'use strict';
/* 숨 결투장 v2.12.0 — 표준 시험 묶음
 * 정해진 대진을 돌려 기준(suite-baseline.json)과 비교한다. 바뀐 줄만 보여 주고, 차이마다 판 수를 고려해
 * "운일 수 있음 / 진짜 차이"를 붙인다. 규칙이나 두뇌를 바꾼 뒤 무엇이 움직였는지 한눈에 보는 용도 (SPEC 21장).
 *   node cli.js suite            기준과 비교
 *   node cli.js suite 부류        한 묶음만
 *   node cli.js suite --save     지금 결과를 기준으로 저장
 *   node cli.js suite --jobs 1   한 줄로 (기본은 코어 수만큼 일꾼, experiments/par.js. 결과는 같다)
 * 모든 판은 결정론이라 아무것도 안 바꿨으면 차이가 없다. */
const fs = require('fs'), path = require('path');
const A = require('../src');
const BASE = path.join(__dirname, '..', 'suite-baseline.json');
const Z = 2.58;   // 이보다 크면 "진짜 차이" (양쪽 99%). 줄이 많아 우연히 튀는 것을 줄이려고 1.96보다 높게 잡았다

// 사람 한 명: '등급' 또는 { tier, skill, deck, type, gear }. 판단 수준(skill)은 엔진의 A.SKILLS (1.5.0)
function mk(p) { const o = typeof p === 'string' ? { tier: p } : p, sp = A.mage({ tier: o.tier, skill: o.skill, deck: o.deck, type: o.type, gear: o.gear }); if (o.C) sp.C = o.C; return sp; }
const who = p => typeof p === 'string' ? p : [p.tier, p.C ? 'C' + p.C : '', p.skill, p.type, p.deck, p.gear && p.gear.silver ? '은실 옷' : ''].filter(Boolean).join(' ');

// 1대1 N판, 씨앗 1..N, 판마다 자리를 번갈아 (node cli.js duel과 같은 방식)
function duels(a, b, N, rules) { return duelsFrom(a, b, 0, N, rules); }
// 그 가운데 k = from..from+N−1 판만 (병렬로 나눠 돌릴 때. 이어 붙이면 duels와 같다)
function duelsFrom(a, b, from, N, rules) {
  const out = [];
  for (let k = from; k < from + N; k++) { const sw = k % 2, x = mk(a), y = mk(b); const r = sw ? A.duel(y, x, { seed: k + 1, rules }) : A.duel(x, y, { seed: k + 1, rules }); out.push({ w: r.winner === -1 ? -1 : (r.winner === 0) !== !!sw ? 0 : 1, t: r.t, bt: r.byTime }); }
  return out;
}
// 한 명(가운데) 대 무리 N판
function rings(center, crowd, n, N) {
  const out = [];
  for (let k = 0; k < N; k++) { const r = A.battle([mk(center)], Array.from({ length: n }, () => mk(crowd)), { seed: k + 1, layout: 'ring', maxT: 90 }); out.push({ w: r.winner, t: r.t }); }
  return out;
}

// 싸우는 모습: 그 단계가 정해진 상대(같은 등급 중급)와 N판, 그 단계 쪽의 행동 지표(A.look) 평균과 표준편차.
// 덱은 기술을 보일 재료가 다 든 '기술', 화약통 켬. 상대를 고정해야 지표가 상대의 솜씨에 흔들리지 않는다
function looks(tier, skill, N) {
  const acc = {}, rules = { barrels: true };
  for (let k = 1; k <= N; k++) { const sw = k % 2, a = A.mage({ tier, skill, deck: '기술' }), b = A.mage({ tier, skill: '중급', deck: '기술' }); const r = sw ? A.duel(b, a, { seed: k, rules }) : A.duel(a, b, { seed: k, rules }); const m = r.ms[sw ? 1 : 0]; for (const [key, v] of Object.entries(A.look(m, m.deathT ?? r.t))) (acc[key] = acc[key] || []).push(v); }
  const look = {}; for (const [key, xs] of Object.entries(acc)) { const mu = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, xs.length - 1)); look[key] = { m: +mu.toFixed(3), sd: +sd.toFixed(3) }; }
  return { N, look };
}

// 대마법사 결투장의 모습 (v2.6, SPEC 30장): 장면(전설 대 전설, 200 × 150, 청사진 덱, v2.4 스위치 + 작전 겹)을 씨앗 1..N으로 걸음마다 지켜본다(metrics/watch).
// 두 사람 모두의 지표: 스스로 입은 피해, 사거리 안 짓는 시간·동시 칸, 쓸모 있는 벽, 빈틈 찌르기, 폭주, 막힌 직사, 큰 마법의 명중
const BIG = ['짧은 실', '체인', '번개 그물', '낙뢰', '걸어둔 구름'];
function arena(file, N) {
  const Wt = require('../metrics/watch'), sc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sandbox', 'scenes', file), 'utf8')), acc = {};
  for (let k = 1; k <= N; k++) {
    const W = A.sceneWorld(Object.assign({}, sc, { seed: k })); while (!A.over(W)) { A.stepWorld(W); Wt.watch(W); }
    for (const m of W.ms) { const o = Wt.seen(W, m), sp = Wt.spells(m); for (const n of BIG) o['명중 ' + n] = sp[n] ? sp[n].hit : 0; for (const [key, v] of Object.entries(o)) (acc[key] = acc[key] || []).push(v); }
  }
  const look = {}; for (const [key, xs] of Object.entries(acc)) { const mu = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, xs.length - 1)); look[key] = { m: +mu.toFixed(3), sd: +sd.toFixed(3) }; }
  return { N: acc['받은 피해'].length, look };
}

// 장면 N판의 이긴 몫과 길이 (v2.7): 앞 편(0)이 이긴 몫, 판 길이
function sceneWins(file, N) {
  const sc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sandbox', 'scenes', file), 'utf8')), w = [], t = [];
  for (let k = 1; k <= N; k++) { const r = A.runScene(Object.assign({}, sc, { seed: k })); w.push(r.winner === 0 ? 1 : 0); t.push(r.t); }
  const st = xs => { const mu = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, xs.length - 1)); return { m: +mu.toFixed(3), sd: +sd.toFixed(3) }; };
  return { N, look: { '앞 편 이긴 몫': st(w), '판 길이 (s)': st(t) } };
}

// 대진표. 줄의 id는 기준과 맞춰 보는 열쇠라 바꾸지 않는다 (바꾸면 새 줄·사라진 줄로 나온다)
function table() {
  const T = [], duel = (group, a, b, N, rules) => T.push({ id: group + ': ' + who(a) + ' 대 ' + who(b) + (rules ? ' ' + JSON.stringify(rules) : ''), group, N, job: { fn: 'duels', args: [a, b, N, rules] } });
  // 등급
  for (const t of ['평범', '중간', '상위']) duel('등급', t, t, 100);
  duel('등급', '중간', '평범', 100); duel('등급', '상위', '중간', 100); duel('등급', '대마법사', '상위', 100);
  // 판단 수준: 같은 등급에서 이웃 단계끼리
  const SK = ['초보', '중급', '상급', '대가', '전설'];
  for (const t of ['평범', '중간']) for (let i = 0; i < 4; i++) duel('판단', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100);
  // 부류 (파도 켬)
  for (const t of ['평범', '중간']) for (const [a, b] of [['서퍼', '메타'], ['서퍼', '이단'], ['메타', '이단']]) duel('부류', { tier: t, type: a }, { tier: t, type: b }, 100, { wave: true });
  // 덱
  for (const [a, b] of [['합법 최강', '기본기'], ['광역', '기본기'], ['자유', '기본기']]) duel('덱', { tier: '평범', deck: a }, { tier: '평범', deck: b }, 100);
  for (const [a, b] of [['합법 최강', '기본기'], ['광역', '기본기']]) duel('덱', { tier: '상위', deck: a }, { tier: '상위', deck: b }, 100);
  const els = ['불', '번개', '흙', '물', '얼음', '독'];
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) duel('원소', { tier: '평범', deck: els[i] }, { tier: '평범', deck: els[j] }, 20);
  // 둘러싸기
  for (const [c, q, n] of [[{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 50], [{ tier: '대마법사', deck: '광역' }, { tier: '병사', deck: '머스킷' }, 40], [{ tier: '상위', deck: '광역' }, { tier: '평범', deck: '기본기' }, 12]])
    T.push({ id: '둘러싸기: ' + who(c) + ' 대 ' + who(q) + ' ' + n + '명', group: '둘러싸기', N: 10, job: { fn: 'rings', args: [c, q, n, 10] } });
  // 도발 (1.4.0)
  for (const t of ['평범', '중간']) duel('도발', { tier: t, deck: '도발 합법 최강' }, { tier: t }, 100, { taunt: true });
  duel('도발', { tier: '중간', deck: '도발 합법 최강', type: '메타' }, { tier: '중간', deck: '도발 합법 최강', type: '서퍼' }, 100, { taunt: true, wave: true });
  duel('도발', { tier: '중간', deck: '도발 합법 최강', type: '서퍼' }, { tier: '중간', deck: '도발 합법 최강', type: '이단' }, 100, { taunt: true, wave: true });
  // 하이 리스크 (1.9.0): 판단 줄을 risk, risk + 소금 원으로
  for (const rules of [{ risk: true }, { risk: true, saltRing: true }]) for (const t of ['평범', '중간']) for (let i = 0; i < 4; i++) duel('큰 수', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100, rules);
  // 몸 묶기 (1.11.0): 판단 줄을 risk + bodyBind로
  for (const t of ['평범', '중간']) for (let i = 0; i < 4; i++) duel('몸 묶기', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100, { risk: true, bodyBind: true });
  // 대응 (1.13.0): 몸 묶기 줄의 위 둘에 대응을 켜서. 은실 옷: 대가끼리 한쪽만 입고
  for (const t of ['평범', '중간']) for (const i of [2, 3]) duel('대응', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100, { risk: true, bodyBind: true, response: true });
  for (const t of ['평범', '중간']) duel('대응', { tier: t, skill: '대가', gear: { silver: true } }, { tier: t, skill: '대가', deck: '기술' }, 100, { risk: true, bodyBind: true, silver: true });
  // 싸우는 모습 (1.7.0): 판단 수준마다 같은 단계끼리
  for (const t of ['평범', '중간']) for (const sk of SK) T.push({ id: '모습: ' + t + ' ' + sk, group: '모습', N: 40, job: { fn: 'looks', args: [t, sk, 40] } });
  T.push({ id: '모습: 대마법사 결투장 전설 대 전설', group: '모습', N: 20, job: { fn: 'arena', args: ['v2-tactics-legend.json', 20] } });   // 걸음마다 본 지표 (v2.6)
  T.push({ id: '모습: 대마법사 둘 대 상위 여섯', group: '모습', N: 20, job: { fn: 'sceneWins', args: ['v2-archmage-2v6.json', 20] } });   // 상위의 부딪힘이 대마법사를 한 방에 죽이지 않는가 (v2.7)
  T.push({ id: '모습: 대마법사 하나 대 상위 열', group: '모습', N: 40, job: { fn: 'sceneWins', args: ['v2-archmage-1v10.json', 40] } });   // 대마법사 하나가 상위 열과 반반인가 (v2.8, WORLD 4-1)
  T.push({ id: '모습: 상위 무리 기준 1 대 20', group: '모습', N: 20, job: { fn: 'sceneWins', args: ['v2-crowd-1v20.json', 20] } });   // 상위 무리 기준(대가·상급 반반, 덱 섞기, 결투장 들판)의 1 대 20 (v2.9)
  // 힘 대 판단: 한 등급 위의 초보 대 한 등급 아래의 전설
  duel('힘 대 판단', { tier: '중간', skill: '초보' }, { tier: '평범', skill: '전설' }, 100);
  duel('힘 대 판단', { tier: '상위', skill: '초보' }, { tier: '중간', skill: '전설' }, 100);
  duel('힘 대 판단', { tier: '대마법사', skill: '초보' }, { tier: '상위', skill: '전설' }, 100);
  // 판단이 힘을 이기는 경계: 평범 초보의 선명도만 올린다 (1.0이면 판단 줄의 전설 대 초보와 같은 선명도)
  for (const c of [1.2, 1.5, 2.0]) duel('힘 대 판단', { tier: '평범', skill: '초보', C: c }, { tier: '평범', skill: '전설' }, 100);
  duel('힘 대 판단', { tier: '평범', skill: '전설' }, { tier: '평범', skill: '초보' }, 100);
  return T;
}
const GROUPS = ['등급', '판단', '큰 수', '몸 묶기', '대응', '모습', '부류', '덱', '원소', '둘러싸기', '도발', '힘 대 판단'];

// 한 줄의 요약: A승·B승·무, A의 점수(무 = 0.5), 평균 시간과 표준편차
function summarize(res) {
  const n = res.length, a = res.filter(r => r.w === 0).length, b = res.filter(r => r.w === 1).length, d = n - a - b;
  const mean = res.reduce((s, r) => s + r.t, 0) / n, sd = Math.sqrt(res.reduce((s, r) => s + (r.t - mean) ** 2, 0) / Math.max(1, n - 1));
  return { N: n, A: a, B: b, D: d, score: +((a + d / 2) / n).toFixed(4), t: +mean.toFixed(2), sd: +sd.toFixed(2), bt: res.filter(r => r.bt).length };
}
// 줄마다 일감 하나(대진은 데이터, 판마다 씨앗이 정해져 있다). jobs개 일꾼으로 나눠 돌린다(par.js, 1.11.1). 결과는 일꾼 수와 상관없이 같다
async function run(only, log = () => {}, jobs = 1) {
  const rows = {}, T = table().filter(r => !only || r.group === only);
  if (only && !T.length) throw new Error('없는 묶음: ' + only + ' (' + GROUPS.join(', ') + ')');
  const t0 = Date.now(), J = T.map(r => Object.assign({ mod: __filename }, r.job));
  let res;
  if (jobs > 1) {
    // 1대1 줄은 25판씩 쪼개 나눠 준다(가장 긴 줄이 전체를 붙잡지 않게). 차례대로 이어 붙이면 한 줄로 돌린 것과 같다
    const parts = [], own = [];
    J.forEach((j, i) => { if (j.fn === 'duels' && j.args[2] > 25) for (let f = 0; f < j.args[2]; f += 25) { parts.push({ mod: j.mod, fn: 'duelsFrom', args: [j.args[0], j.args[1], f, Math.min(25, j.args[2] - f), j.args[3]] }); own.push(i); } else { parts.push(j); own.push(i); } });
    const got = await require('../experiments/par').runJobs(parts, { workers: jobs, onDone: (d, n) => log(`\r${d}/${n} (일꾼 ${jobs})   `) });
    res = J.map(() => null); got.forEach((x, k) => { const i = own[k]; res[i] = res[i] ? (Array.isArray(x) ? res[i].concat(x) : x) : x; });
  } else res = J.map((j, i) => { const x = module.exports[j.fn](...j.args); log(`\r${i + 1}/${T.length} ${T[i].group}   `); return x; });
  T.forEach((r, i) => { const x = res[i]; rows[r.id] = Object.assign({ group: r.group }, x.look ? x : summarize(x)); });
  log(`\r${T.length}줄, ${((Date.now() - t0) / 1000).toFixed(1)} s (일꾼 ${Math.min(jobs, T.length)})\n`);
  return { v: A.VERSION, date: new Date().toISOString().slice(0, 10), z: Z, rows };
}

// 판 수를 고려한 차이의 크기. 점수(승률)는 두 비율의 차, 시간은 두 평균의 차를 표준오차로 나눈다
function zScore(o, n) {
  const p = (o.score * o.N + n.score * n.N) / (o.N + n.N), se = Math.sqrt(p * (1 - p) * (1 / o.N + 1 / n.N));
  return se > 0 ? (n.score - o.score) / se : (n.score === o.score ? 0 : Infinity);
}
function zTime(o, n) { const se = Math.sqrt(o.sd ** 2 / o.N + n.sd ** 2 / n.N); return se > 0 ? (n.t - o.t) / se : (n.t === o.t ? 0 : Infinity); }
const verdict = z => Math.abs(z) >= Z ? '진짜 차이' : '운일 수 있음';
function compare(base, now) {
  const out = [];
  for (const [id, n] of Object.entries(now.rows)) {
    const o = base.rows[id];
    if (!o) { out.push({ id, kind: '새 줄', now: n }); continue; }
    if (n.look) {   // 모습 줄: 지표마다 평균의 차를 표준오차로
      const ch = Object.keys(n.look).filter(k => !o.look || !o.look[k] || o.look[k].m !== n.look[k].m).map(k => { const a = (o.look && o.look[k]) || { m: 0, sd: 0 }, b = n.look[k], se = Math.sqrt(a.sd ** 2 / o.N + b.sd ** 2 / n.N); return { k, a: a.m, b: b.m, z: se > 0 ? (b.m - a.m) / se : Infinity }; });
      if (ch.length) out.push({ id, kind: '모습', ch, now: n }); continue;
    }
    if (o.A === n.A && o.B === n.B && o.D === n.D && o.t === n.t && o.N === n.N) continue;
    out.push({ id, kind: '바뀜', old: o, now: n, zs: zScore(o, n), zt: zTime(o, n) });
  }
  return out;
}
const pct = v => (v * 100).toFixed(0) + '%', sgn = v => (v > 0 ? '+' : '') + v;
function format(d) {
  if (d.kind === '모습') return d.id + '\n' + d.ch.map(c => `    ${c.k}  ${c.a} → ${c.b}  z=${isFinite(c.z) ? c.z.toFixed(1) : '∞'}  → ${verdict(c.z)}`).join('\n');
  if (d.kind === '새 줄' && d.now.look) return `${d.id}\n    새 줄: ` + Object.entries(d.now.look).map(([k, v]) => k + ' ' + v.m).join(', ');
  if (d.kind === '새 줄') return `${d.id}\n    새 줄: ${d.now.A}:${d.now.B}:무 ${d.now.D} (${d.now.N}판), 시간 ${d.now.t} s`;
  const o = d.old, n = d.now, dp = Math.round((n.score - o.score) * 100);
  return `${d.id}\n    승패  ${o.A}:${o.B}:무 ${o.D} → ${n.A}:${n.B}:무 ${n.D} (${n.N}판), A 점수 ${pct(o.score)} → ${pct(n.score)} (${sgn(dp)}%p)  z=${d.zs.toFixed(1)}  → ${dp === 0 ? '같음' : verdict(d.zs)}` +
    `\n    시간  ${o.t} → ${n.t} s (${sgn(+(n.t - o.t).toFixed(2))})  z=${d.zt.toFixed(1)}  → ${n.t === o.t ? '같음' : verdict(d.zt)}`;
}

async function main(args) {
  const save = args.includes('--save'), ji = args.indexOf('--jobs'), jobs = ji >= 0 ? Math.max(1, +args[ji + 1] || 1) : require('../experiments/par').defaultWorkers();
  const only = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--jobs');
  const log = s => process.stderr.write(s);
  let now; try { now = await run(only, log, jobs); } catch (e) { console.log(e.message); process.exitCode = 1; return; }
  if (save) {
    let base = { rows: {} }; if (only && fs.existsSync(BASE)) base = JSON.parse(fs.readFileSync(BASE, 'utf8'));   // 한 묶음만 저장하면 나머지 줄은 그대로 둔다
    const out = Object.assign({}, now, { rows: Object.assign({}, base.rows, now.rows) });
    fs.writeFileSync(BASE, JSON.stringify(out, null, 1) + '\n'); console.log('기준 저장:', path.basename(BASE), Object.keys(out.rows).length + '줄, 엔진 v' + now.v); return;
  }
  if (!fs.existsSync(BASE)) { console.log('기준이 없다. node cli.js suite --save로 먼저 저장한다.'); process.exitCode = 1; return; }
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8')), diff = compare(base, now);
  const gone = Object.keys(base.rows).filter(id => !now.rows[id] && (!only || base.rows[id].group === only));
  console.log(`기준: 엔진 v${base.v} (${base.date}) · 지금: v${now.v} · ${Object.keys(now.rows).length}줄 · |z| ≥ ${Z}이면 진짜 차이`);
  if (!diff.length && !gone.length) { console.log('바뀐 줄 없음'); return; }
  for (const d of diff) console.log(format(d));
  for (const id of gone) console.log(`${id}\n    사라진 줄`);
  const ch = diff.filter(d => d.kind === '바뀜' || d.kind === '모습'), real = ch.filter(d => d.kind === '모습' ? d.ch.some(c => Math.abs(c.z) >= Z) : Math.abs(d.zs) >= Z || Math.abs(d.zt) >= Z).length, added = diff.length - ch.length;
  console.log(`\n바뀐 줄 ${ch.length} (진짜 차이 ${real}, 운일 수 있음 ${ch.length - real})${added ? ', 새 줄 ' + added : ''}${gone.length ? ', 사라진 줄 ' + gone.length : ''}`);
}

module.exports = { GROUPS, table, run, duels, duelsFrom, rings, looks, arena, sceneWins, summarize, compare, zScore, zTime, verdict, format, main, Z };
