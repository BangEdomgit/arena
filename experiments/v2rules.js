'use strict';
/* 숨 결투장 v1.13.0 — 대실험: v2.0의 기본 규칙 조합 고르기 (Node, 코어를 다 쓴다)
 *   node experiments/v2rules.js 1                 16조합 × 평범·중간 × 판단 다섯 총당(쌍마다 200판) → results/v2-phase1.json
 *   node experiments/v2rules.js 2 이름 이름 …      고른 조합을 깊게 → results/v2-phase2.json
 *   node experiments/v2rules.js 3 이름 …           행동 지표(허수아비·중급 상대) → results/v2-phase3.json
 *   --jobs N                                      일꾼 수 (기본 코어 수)
 * 조합 이름은 켠 스위치를 +로 이은 것(예: 'risk+control+saltRing', 모두 끄면 'base'). control = bodyBind + response(묶기 + 풀기).
 * 모든 판은 결정론이라 같은 명령이면 같은 JSON이 나온다(시각·걸린 시간 칸만 다르다). 합격 기준은 CRIT, 보고는 reports/v2.0-rules.md */
const fs = require('fs'), path = require('path');
const { runJobs, defaultWorkers } = require('./par');
const JOBS = require.resolve('./jobs');
const OUT = path.join(__dirname, 'results');
const SK = ['초보', '중급', '상급', '대가', '전설'], TIERS = ['평범', '중간'];
const FLAGS = { risk: { risk: true }, control: { bodyBind: true, response: true }, saltRing: { saltRing: true }, wave: { wave: true } };
const CHUNK = 25;
// 합격 기준 (사용자가 정한 것)
const CRIT = { gap: 150, gapTol: 50, timeMax: 0.2, len: { 평범: [30, 70], 중간: [10, 30] }, elemMax: 0.65, crowdEdge: 3 };

function combos() { const ks = Object.keys(FLAGS), out = []; for (let b = 0; b < 16; b++) { const on = ks.filter((k, i) => b >> i & 1), rules = Object.assign({}, ...on.map(k => FLAGS[k])); out.push({ name: on.join('+') || 'base', on, rules }); } return out; }
const comboOf = name => { const c = combos().find(x => x.name === name); if (!c) throw new Error('없는 조합: ' + name + ' (' + combos().map(x => x.name).join(', ') + ')'); return c; };
const args = process.argv.slice(2), ji = args.indexOf('--jobs'), workers = ji >= 0 ? +args[ji + 1] : defaultWorkers();
const pos = args.filter((a, i) => !(ji >= 0 && (i === ji || i === ji + 1)));

// 대결 N판을 CHUNK씩 나눈 일감들
function duelJobs(a, b, N, rules, keys) { const js = []; for (let f = 0; f < N; f += CHUNK) js.push({ mod: JOBS, fn: 'duel', args: [a, b, f, Math.min(CHUNK, N - f), rules, keys || []] }); return js; }
function mergeDuel(ps) { const o = { n: 0, a: 0, b: 0, d: 0, t: 0, bt: 0, la: {}, lb: {} }; for (const p of ps) { for (const k of ['n', 'a', 'b', 'd', 't', 'bt']) o[k] += p[k]; for (const s of ['la', 'lb']) for (const k in p[s]) o[s][k] = (o[s][k] || 0) + p[s][k]; } return o; }
const scoreOf = o => (o.a + o.d / 2) / o.n;
const eloDiff = p => 400 * Math.log10(Math.max(1e-3, Math.min(1 - 1e-3, p)) / (1 - Math.max(1e-3, Math.min(1 - 1e-3, p))));
// 여러 대진을 한꺼번에 일꾼에게 (모든 코어가 쉬지 않게). tasks: [{ key, jobs }] → { key: [부분 결과…] }
async function runAll(tasks, label) {
  const flat = [], owner = []; tasks.forEach((t, i) => t.jobs.forEach(j => { flat.push(j); owner.push(i); }));
  const t0 = Date.now(); let last = 0;
  const res = await runJobs(flat, { workers, onDone: (d, n) => { const now = Date.now(); if (now - last > 5000 || d === n) { last = now; process.stderr.write(`\r${label}: ${d}/${n} 일감, ${((now - t0) / 1000).toFixed(0)} s   `); } } });
  process.stderr.write('\n');
  const out = {}; res.forEach((r, i) => { const k = tasks[owner[i]].key; (out[k] = out[k] || []).push(r); }); return out;
}
// 브래들리–테리 최대 가능도(MM, 무승부는 반승). 쌍마다 한 판씩 무승부를 더해 전승도 유한하게. 첫 사람 = 0
function elo(n, pairs) {
  const W = Array(n).fill(0), G = Array.from({ length: n }, () => Array(n).fill(0));
  for (const { i, j, o } of pairs) { const si = o.a + o.d / 2 + 0.5, sj = o.b + o.d / 2 + 0.5; W[i] += si; W[j] += sj; G[i][j] += o.n + 1; G[j][i] += o.n + 1; }
  let p = Array(n).fill(1);
  for (let it = 0; it < 5000; it++) { const q = p.map((pi, i) => { let s = 0; for (let j = 0; j < n; j++) if (G[i][j]) s += G[i][j] / (pi + p[j]); return W[i] / s; }); const g = q.reduce((a, b) => a * b, 1) ** (1 / n); p = q.map(x => x / g); }
  const R = p.map(x => 400 * Math.log10(x)); return R.map(r => +(r - R[0]).toFixed(1));
}
const r3 = x => +x.toFixed(3), r1 = x => +x.toFixed(1);
function save(name, data) { fs.mkdirSync(OUT, { recursive: true }); const f = path.join(OUT, name); fs.writeFileSync(f, JSON.stringify(data, null, 1) + '\n'); console.log('저장', path.relative(process.cwd(), f)); }

/* ---------------- 1단계: 16조합 총당 ---------------- */
async function phase1() {
  const tasks = [];
  for (const c of combos()) for (const t of TIERS) for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++)
    tasks.push({ key: [c.name, t, i, j].join('|'), jobs: duelJobs({ tier: t, skill: SK[j] }, { tier: t, skill: SK[i] }, 200, c.rules, ['bigHit', 'bigCast']) });
  const t0 = Date.now(), R = await runAll(tasks, '1단계'), rows = [];
  for (const c of combos()) {
    const row = { combo: c.name, rules: c.rules, tiers: {} };
    for (const t of TIERS) {
      const pairs = [], all = mergeDuel([]), nb = mergeDuel([]); let bh = 0, bc = 0;
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
        const o = mergeDuel(R[[c.name, t, i, j].join('|')]); pairs.push({ i: j, j: i, o });   // a = 위 단계(j)
        const add = (x, y) => { for (const k of ['n', 'a', 'b', 'd', 't', 'bt']) x[k] += y[k]; }; add(all, o); if (j === i + 1) add(nb, o);
        bh += (o.la.bigHit || 0) + (o.lb.bigHit || 0); bc += (o.la.bigCast || 0) + (o.lb.bigCast || 0);
      }
      const E = elo(5, pairs), gaps = E.slice(1).map((x, k) => r1(x - E[k]));
      const nbScore = []; for (let i = 0; i < 4; i++) { const p = pairs.find(x => x.i === i + 1 && x.j === i); nbScore.push(r3(scoreOf(p.o))); }
      row.tiers[t] = { elo: E, gaps, nbScore, time: r3(all.bt / all.n), len: r1(all.t / all.n), nbTime: r3(nb.bt / nb.n), nbLen: r1(nb.t / nb.n), big: bc ? r3(bh / bc) : null, bigPerGame: r3(bc / all.n), games: all.n,
        matrix: pairs.map(x => ({ hi: SK[x.i], lo: SK[x.j], score: r3(scoreOf(x.o)), time: r3(x.o.bt / x.o.n), len: r1(x.o.t / x.o.n) })) };
    }
    row.miss = misses1(row); row.dist = r3(dist1(row)); rows.push(row);
  }
  rows.sort((a, b) => a.dist - b.dist);
  save('v2-phase1.json', { v: require('../src').VERSION, date: new Date().toISOString().slice(0, 10), gamesPerPair: 200, workers, seconds: Math.round((Date.now() - t0) / 1000), criteria: CRIT, rows });
  for (const r of rows) console.log(r.combo.padEnd(30), '거리', r.dist, TIERS.map(t => { const x = r.tiers[t]; return `${t} 간격 ${x.gaps.join('/')} 시간판정 ${(x.time * 100).toFixed(0)}% (이웃 ${(x.nbTime * 100).toFixed(0)}%) 길이 ${x.len}s (이웃 ${x.nbLen}) 큰수 ${x.big ?? '-'}`; }).join(' | '));
}
// 기준과의 거리: 간격(150에서 벗어난 몫), 시간 판정(평범 20% 넘는 몫), 길이(범위 밖 몫). 이웃 판으로 잰다
function dist1(r) {
  let d = 0;
  for (const t of TIERS) { const x = r.tiers[t]; for (const g of x.gaps) d += g <= 0 ? 2 : Math.abs(g - CRIT.gap) / CRIT.gap / 4; const [lo, hi] = CRIT.len[t]; d += x.nbLen < lo ? (lo - x.nbLen) / lo : x.nbLen > hi ? (x.nbLen - hi) / hi : 0; }
  d += Math.max(0, r.tiers['평범'].nbTime - CRIT.timeMax) / CRIT.timeMax;
  return d;
}
function misses1(r) {
  const m = [];
  for (const t of TIERS) { const x = r.tiers[t];
    x.gaps.forEach((g, k) => { if (Math.abs(g - CRIT.gap) > CRIT.gapTol) m.push(`${t} ${SK[k + 1]}−${SK[k]} Elo 간격 ${g} (기준 ${CRIT.gap}±${CRIT.gapTol})`); });
    const [lo, hi] = CRIT.len[t]; if (x.nbLen < lo || x.nbLen > hi) m.push(`${t} 이웃 결투 길이 ${x.nbLen} s (기준 ${lo}~${hi})`); }
  if (r.tiers['평범'].nbTime > CRIT.timeMax) m.push(`평범 이웃 시간 판정 ${(r.tiers['평범'].nbTime * 100).toFixed(0)}% (기준 ${CRIT.timeMax * 100}% 이하)`);
  return m;
}

/* ---------------- 2단계: 고른 조합을 깊게 ---------------- */
const ELEMS = ['불', '번개', '흙', '물', '얼음', '독'], DECKS = ['합법 최강', '광역', '기본기', '기술', '큰 수', '자유'], TYPES = ['서퍼', '메타', '이단'];
async function phase2(names) {
  const tasks = [], cs = names.map(comboOf);
  for (const c of cs) {
    const R = c.rules, K = c.name + '|';
    for (const t of TIERS) for (let i = 0; i < 4; i++) tasks.push({ key: K + `nb|${t}|${i}`, jobs: duelJobs({ tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 400, R, ['bigHit', 'bigCast']) });
    const RW = Object.assign({}, R, { wave: true });   // 부류는 파도가 켜져야 갈린다
    for (const t of TIERS) for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) tasks.push({ key: K + `type|${t}|${TYPES[i]}|${TYPES[j]}`, jobs: duelJobs({ tier: t, skill: '상급', type: TYPES[i] }, { tier: t, skill: '상급', type: TYPES[j] }, 400, RW) });
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) tasks.push({ key: K + `elem|${ELEMS[i]}|${ELEMS[j]}`, jobs: duelJobs({ tier: '평범', skill: '상급', deck: ELEMS[i] }, { tier: '평범', skill: '상급', deck: ELEMS[j] }, 200, R) });
    for (const t of TIERS) for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) tasks.push({ key: K + `deck|${t}|${DECKS[i]}|${DECKS[j]}`, jobs: duelJobs({ tier: t, skill: '상급', deck: DECKS[i] }, { tier: t, skill: '상급', deck: DECKS[j] }, 200, R) });
    for (const C of [1.0, 1.2, 1.5, 2.0]) tasks.push({ key: K + `power|${C}`, jobs: duelJobs({ tier: '평범', skill: '초보', spec: { C } }, { tier: '평범', skill: '전설' }, 400, R) });
    for (const t of TIERS) for (const n of [1, 2, 3, 4]) { const js = []; for (let f = 0; f < 200; f += CHUNK) js.push({ mod: JOBS, fn: 'crowd', args: [{ tier: t, skill: '전설' }, { tier: t, skill: '초보' }, n, f, CHUNK, R, 'lines', 120] }); tasks.push({ key: K + `cb|${t}|${n}`, jobs: js }); }
    { const js = []; for (let f = 0; f < 20; f += 2) js.push({ mod: JOBS, fn: 'crowd', args: [{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 100, f, 2, R, 'ring', 90] }); tasks.push({ key: K + 'ring', jobs: js }); }
    { const js = []; for (let f = 0; f < 20; f += 2) js.push({ mod: JOBS, fn: 'musket', args: [40, f, 2, R] }); tasks.push({ key: K + 'musket', jobs: js }); }
  }
  const t0 = Date.now(), X = await runAll(tasks, '2단계'), out = [];
  const D = k => mergeDuel(X[k]), sumC = ps => ps.reduce((o, p) => { for (const k in p) o[k] = (o[k] || 0) + p[k]; return o; }, {});
  for (const c of cs) {
    const K = c.name + '|', r = { combo: c.name, rules: c.rules };
    r.neighbors = {}; for (const t of TIERS) { const rows = []; let bh = 0, bc = 0, all = mergeDuel([]); for (let i = 0; i < 4; i++) { const o = D(K + `nb|${t}|${i}`), p = scoreOf(o); rows.push({ hi: SK[i + 1], lo: SK[i], score: r3(p), elo: r1(eloDiff(p)), time: r3(o.bt / o.n), len: r1(o.t / o.n) }); bh += (o.la.bigHit || 0) + (o.lb.bigHit || 0); bc += (o.la.bigCast || 0) + (o.lb.bigCast || 0); for (const k of ['n', 'a', 'b', 'd', 't', 'bt']) all[k] += o[k]; } r.neighbors[t] = { rows, time: r3(all.bt / all.n), len: r1(all.t / all.n), big: bc ? r3(bh / bc) : null }; }
    r.types = {}; for (const t of TIERS) { r.types[t] = []; for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) { const o = D(K + `type|${t}|${TYPES[i]}|${TYPES[j]}`); r.types[t].push({ a: TYPES[i], b: TYPES[j], score: r3(scoreOf(o)), len: r1(o.t / o.n) }); } }
    const elemTot = {}; r.elements = []; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { const o = D(K + `elem|${ELEMS[i]}|${ELEMS[j]}`), p = scoreOf(o); r.elements.push({ a: ELEMS[i], b: ELEMS[j], score: r3(p) }); (elemTot[ELEMS[i]] = elemTot[ELEMS[i]] || []).push(p); (elemTot[ELEMS[j]] = elemTot[ELEMS[j]] || []).push(1 - p); }
    r.elementTotal = Object.fromEntries(ELEMS.map(e => [e, r3(elemTot[e].reduce((a, b) => a + b, 0) / elemTot[e].length)]));
    r.decks = {}; r.deckTotal = {}; for (const t of TIERS) { const tot = {}; r.decks[t] = []; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { const o = D(K + `deck|${t}|${DECKS[i]}|${DECKS[j]}`), p = scoreOf(o); r.decks[t].push({ a: DECKS[i], b: DECKS[j], score: r3(p), len: r1(o.t / o.n) }); (tot[DECKS[i]] = tot[DECKS[i]] || []).push(p); (tot[DECKS[j]] = tot[DECKS[j]] || []).push(1 - p); } r.deckTotal[t] = Object.fromEntries(DECKS.map(d => [d, r3(tot[d].reduce((a, b) => a + b, 0) / tot[d].length)])); }
    r.power = [1.0, 1.2, 1.5, 2.0].map(C => { const o = D(K + `power|${C}`); return { C, score: r3(scoreOf(o)), len: r1(o.t / o.n), time: r3(o.bt / o.n) }; });
    r.crowd = {}; for (const t of TIERS) r.crowd[t] = [1, 2, 3, 4].map(n => { const o = sumC(X[K + `cb|${t}|${n}`]); return { n, win: r3(o.win / o.n), draw: r3(o.draw / o.n), hp: r3(o.hp / o.n), len: r1(o.t / o.n) }; });
    for (const k of ['ring', 'musket']) { const o = sumC(X[K + k]); r[k] = { n: o.n, win: r3(o.win / o.n), lose: r3(o.lose / o.n), hp: r3(o.hp / o.n), len: r1(o.t / o.n) }; }
    r.miss = misses2(r); out.push(r);
  }
  save('v2-phase2.json', { v: require('../src').VERSION, date: new Date().toISOString().slice(0, 10), workers, seconds: Math.round((Date.now() - t0) / 1000), criteria: CRIT, combos: out });
  for (const r of out) { console.log('\n== ' + r.combo); console.log(JSON.stringify(r.neighbors)); console.log('원소', JSON.stringify(r.elementTotal)); console.log('부류', JSON.stringify(r.types)); console.log('힘 대 판단', JSON.stringify(r.power)); console.log('챌린저 대 브론즈', JSON.stringify(r.crowd)); console.log('둘러싸기', JSON.stringify(r.ring), '머스킷', JSON.stringify(r.musket)); console.log('못 미침', r.miss); }
}
// 챌린저 대 브론즈의 경계: 전설의 승률이 0.5 아래로 내려가는 무리 수(선형 보간)
function edge(rows) { for (let k = 0; k < rows.length; k++) { const s = rows[k].win + rows[k].draw / 2; if (s < 0.5) { if (!k) return rows[0].n - 0.5; const s0 = rows[k - 1].win + rows[k - 1].draw / 2; return +(rows[k - 1].n + (s0 - 0.5) / (s0 - s)).toFixed(2); } } return null; }
function misses2(r) {
  const m = [];
  for (const t of TIERS) { const N = r.neighbors[t];
    for (const x of N.rows) if (Math.abs(x.elo - CRIT.gap) > CRIT.gapTol) m.push(`${t} ${x.hi}/${x.lo}: 점수 ${x.score} = Elo ${x.elo} (기준 ${CRIT.gap}±${CRIT.gapTol}, 점수 약 0.70)`);
    const [lo, hi] = CRIT.len[t]; if (N.len < lo || N.len > hi) m.push(`${t} 이웃 결투 길이 ${N.len} s (기준 ${lo}~${hi})`); }
  if (r.neighbors['평범'].time > CRIT.timeMax) m.push(`평범 이웃 시간 판정 ${(r.neighbors['평범'].time * 100).toFixed(0)}% (기준 20% 이하)`);
  for (const [e, p] of Object.entries(r.elementTotal)) if (p > CRIT.elemMax) m.push(`원소 ${e} 전체 승률 ${p} (기준 ${CRIT.elemMax} 이하)`);
  for (const t of TIERS) { const heretic = r.types[t].some(x => (x.a === '이단' && x.score > 0.5) || (x.b === '이단' && x.score < 0.5)); if (!heretic) m.push(`${t} 이단이 어느 부류도 못 이김: ${JSON.stringify(r.types[t])}`); }
  if (r.ring.win < 0.8) m.push(`대마법사가 평범 100명을 못 버팀: 승 ${r.ring.win}`);
  if (r.musket.lose === 0) m.push(`머스킷 40 반원이 대마법사를 한 번도 못 무너뜨림`);
  r.crowdEdge = {}; for (const t of TIERS) { const e = edge(r.crowd[t]); r.crowdEdge[t] = e; if (e === null || Math.abs(e - CRIT.crowdEdge) > 0.75) m.push(`${t} 챌린저 대 브론즈 경계 ${e ?? '4명 넘음'}명 (기준 약 ${CRIT.crowdEdge}명)`); }
  return m;
}

/* ---------------- 3단계: 모습 ---------------- */
async function phase3(names) {
  const tasks = [], cs = names.map(comboOf), N = 100;
  for (const c of cs) for (const t of TIERS) for (const sk of SK) for (const opp of ['dummy', '중급']) { const js = []; for (let f = 0; f < N; f += CHUNK) js.push({ mod: JOBS, fn: 'looks', args: [t, sk, opp, f, CHUNK, c.rules] }); tasks.push({ key: [c.name, t, sk, opp].join('|'), jobs: js }); }
  const t0 = Date.now(), X = await runAll(tasks, '3단계'), out = [];
  for (const c of cs) {
    const r = { combo: c.name, rules: c.rules, looks: {}, stairs: {} };
    for (const t of TIERS) for (const opp of ['dummy', '중급']) {
      const tab = {}; for (const sk of SK) { const L = [].concat(...X[[c.name, t, sk, opp].join('|')]), keys = Object.keys(L[0]); tab[sk] = Object.fromEntries(keys.map(k => { const xs = L.map(l => l[k]), mu = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, xs.length - 1)); return [k, { m: r3(mu), se: r3(sd / Math.sqrt(xs.length)) }]; })); }
      r.looks[t + '|' + opp] = tab;
      // 계단: 다섯 단계의 평균이 한쪽으로만 가는가(이웃 차가 표준오차 합보다 작으면 평평으로 보고 허용)
      const st = {}; for (const k of Object.keys(tab['초보'])) { const ms = SK.map(s => tab[s][k]); let up = 0, down = 0, flat = 0; for (let i = 0; i < 4; i++) { const d = ms[i + 1].m - ms[i].m, e = ms[i + 1].se + ms[i].se; if (Math.abs(d) <= e) flat++; else if (d > 0) up++; else down++; } st[k] = { dir: up && down ? '들쭉날쭉' : up ? '오름' : down ? '내림' : '평평', up, down, flat, from: ms[0].m, to: ms[4].m }; }
      r.stairs[t + '|' + opp] = st;
    }
    out.push(r);
  }
  save('v2-phase3.json', { v: require('../src').VERSION, date: new Date().toISOString().slice(0, 10), workers, gamesPerCell: N, seconds: Math.round((Date.now() - t0) / 1000), combos: out });
  for (const r of out) { console.log('\n== ' + r.combo); for (const [k, st] of Object.entries(r.stairs)) console.log(k, Object.entries(st).map(([n, s]) => `${n}:${s.dir}(${s.from}→${s.to})`).join(' ')); }
}

module.exports = { combos, comboOf, elo, edge, CRIT };
if (require.main === module) {
  const [ph, ...names] = pos;
  (ph === '1' ? phase1() : ph === '2' ? phase2(names) : ph === '3' ? phase3(names) : Promise.reject(new Error('단계: 1, 2, 3'))).catch(e => { console.error(e); process.exitCode = 1; });
}
