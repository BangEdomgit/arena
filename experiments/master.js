'use strict';
/* 숨 결투장 v2.2.0 — 고수 싸움 재기 (대마법사끼리, SPEC 26장, reports/v2.2.0.md)
 *   node experiments/master.js [대진,…] [N] [--deck 덱] [--tac '{…}'] [--rules '{…}']
 *     대진: 전설-대가, 전설-전설, 대가-상급, 상급-중급 (기본 모두), N = 100 (씨앗 1..N, 판마다 자리를 번갈아)
 *     --tacA: 앞 사람에게만 덧씌울 tac (기술 떼기). --tac: 두 사람 모두에게 덧씌울 tac (새 기술을 끄고 견줄 때: '{"rhythm":false,"roles":false,"efficacy":false,"buffNeed":false,"shape":false,"domainPush":false}')
 *   → results/master[-이름].json (--save 이름)
 *   node experiments/master.js scene      대표 장면 → sandbox/scenes/v2-master-legend.json (그다음 node cli.js pack)
 * 지표 (한 사람 기준, 두 사람 평균; 점수는 앞 사람):
 *   길이, 평균 거리, 거리 흔들림(0.5 s마다 잰 거리의 표준편차/평균 = 리듬), 초당 시전, 두 번째 칸 판당, 입장 몫,
 *   마법별 시전 몫·명중률·헛손질(명중 없는 시전의 몫), 칸마다 역할 몫(A·B·자동: 공격·방어·지형·이동·강화),
 *   리듬 단계 몫(떠보기·들어가기·빠지기), 장악 경계: 상대 쪽 틈(경계에서 상대까지, m)의 평균과 초당 경계 이동(m/s),
 *   세운 지형·없앤 지형(판당) */
const fs = require('fs'), path = require('path');
const A = require('../src'), core = require('../src/core');
const PAIRS = { '전설-대가': ['전설', '대가'], '전설-전설': ['전설', '전설'], '대가-상급': ['대가', '상급'], '상급-중급': ['상급', '중급'] };
// 장악 경계: 두 사람을 잇는 선 위에서 두 신호의 몫이 같은 자리 (5장 식, 도달 반경 안). 나에게서의 거리
function boundary(W, a, b) {
  const L = W.rules.domainL, d = Math.hypot(a.x - b.x, a.y - b.y) || 1, A1 = core.sigOf(W, a) * (a._act ? 1 : W.rules.passive), B1 = core.sigOf(W, b) * (b._act ? 1 : W.rules.passive);
  return Math.max(0, Math.min(d, L * (A1 - B1) / (A1 + B1) + A1 * d / (A1 + B1)));
}
function run(pair, from, N, deck, tac, rules, tacA) {
  const [sa, sb] = PAIRS[pair], o = { n: 0, a: 0, draw: 0, t: 0, dS: 0, dJ: 0, dSD: 0, casts: 0, slotB: 0, stance: {}, spells: {}, role: {}, phase: {}, gap: 0, bMove: 0, built: 0, razed: 0, gapN: 0 };
  for (let k = from; k < from + N; k++) {
    const sw = k % 2, ma = { tier: '대마법사', skill: sa, deck, tac: tacA ? Object.assign({}, tac, tacA) : tac }, mb = { tier: '대마법사', skill: sb, deck, tac };
    const w = A.sceneWorld({ seed: k + 1, rules, width: 200, height: 150, sides: [{ mages: [sw ? mb : ma] }, { mages: [sw ? ma : mb] }] });
    const X = w.ms[sw ? 1 : 0], Y = w.ms[sw ? 0 : 1];
    const ds = [], bs = []; let lastB = null, bm = 0, met = false;
    while (!A.over(w)) {
      A.stepWorld(w);
      if (w.step % 15 === 0 && X.hp > 0 && Y.hp > 0) {
        const d = Math.hypot(X.x - Y.x, X.y - Y.y); if (!met && d < 50) met = true; if (!met) continue; ds.push(d);   // 처음 50 m 안으로 만난 뒤부터 (다가가는 188 m는 빼고)
        for (const [p, q] of [[X, Y], [Y, X]]) { const x = boundary(w, p, q); bs.push(d - x); }
        const bx = X.x + (Y.x - X.x) * boundary(w, X, Y) / (d || 1), by = X.y + (Y.y - X.y) * boundary(w, X, Y) / (d || 1);
        if (lastB) bm += Math.hypot(bx - lastB[0], by - lastB[1]); lastB = [bx, by];
      }
    }
    const r = A.result(w); o.n++; o.t += r.t; if (r.winner === X.side) o.a++; else if (r.winner < 0) o.draw++;
    if (ds.length > 1) { const mu = ds.reduce((x, y) => x + y, 0) / ds.length, sd = Math.sqrt(ds.reduce((x, y) => x + (y - mu) * (y - mu), 0) / ds.length); o.dS += mu; o.dJ += sd / mu; o.dSD += sd; }
    if (bs.length) { o.gap += bs.reduce((x, y) => x + y, 0) / bs.length; o.gapN++; }
    o.bMove += bm / Math.max(r.t, 1);
    for (const m of [X, Y]) {
      for (const n in m.log.casts) { const s = o.spells[n] || (o.spells[n] = { c: 0, h: 0 }); s.c += m.log.casts[n]; s.h += m.log.hits[n] || 0; o.casts += m.log.casts[n]; }
      o.slotB += m.log.dec.slotB / 2;
      for (const k2 in m.log.stanceT) o.stance[k2] = (o.stance[k2] || 0) + m.log.stanceT[k2];
      const ml = m.mlog; for (const sl in ml.role) for (const ro in ml.role[sl]) { const key = sl + ':' + ro; o.role[key] = (o.role[key] || 0) + ml.role[sl][ro]; }
      for (const ph in ml.phase) o.phase[ph] = (o.phase[ph] || 0) + ml.phase[ph];
      o.built += ml.built / 2; o.razed += ml.razed / 2;
    }
  }
  return o;
}
const r3 = x => +x.toFixed(3), r1 = x => +x.toFixed(1);
function summarize(os) {
  const o = {}; for (const p of os) for (const k in p) { if (typeof p[k] === 'number') o[k] = (o[k] || 0) + p[k]; else { o[k] = o[k] || {}; for (const j in p[k]) { if (typeof p[k][j] === 'number') o[k][j] = (o[k][j] || 0) + p[k][j]; else { const q = o[k][j] || (o[k][j] = {}); for (const z in p[k][j]) q[z] = (q[z] || 0) + p[k][j][z]; } } } }
  const n = o.n, st = Object.values(o.stance).reduce((a, b) => a + b, 0) || 1, rs = {}, ph = Object.values(o.phase).reduce((a, b) => a + b, 0) || 1;
  for (const sl of ['A', 'B', 'auto']) { let tot = 0; for (const k in o.role) if (k.startsWith(sl + ':')) tot += o.role[k]; if (tot) { rs[sl] = { n: r1(tot / n / 2) }; for (const k in o.role) if (k.startsWith(sl + ':')) rs[sl][k.slice(sl.length + 1)] = r3(o.role[k] / tot); } }
  const spells = Object.entries(o.spells).sort((a, b) => b[1].c - a[1].c).map(([k, s]) => ({ spell: k, share: r3(s.c / o.casts), hit: r3(s.h / s.c), miss: r3(Math.max(0, s.c - s.h) / s.c) }));
  const off = Object.entries(o.spells).filter(([k]) => { const s = A.SPELLS[k]; return s && s.role === '공격'; }), oc = off.reduce((a, [, s]) => a + s.c, 0), oh = off.reduce((a, [, s]) => a + Math.min(s.h, s.c), 0);
  return { games: n, score: r3((o.a + o.draw / 2) / n), len: r1(o.t / n), dist: r1(o.dS / n), distSD: r1(o.dSD / n), distJitter: r3(o.dJ / n), castsPerS: r3(o.casts / o.t / 2), slotBPerGame: r1(o.slotB / n),
    stance: Object.fromEntries(Object.entries(o.stance).map(([k, v]) => [k, r3(v / st)])), phase: Object.fromEntries(Object.entries(o.phase).map(([k, v]) => [k, r3(v / ph)])),
    roles: rs, gap: r1(o.gap / Math.max(1, o.gapN)), boundaryMove: r3(o.bMove / n), built: r1(o.built / n), razed: r1(o.razed / n), offMiss: r3(1 - oh / Math.max(1, oc)), spells: spells.slice(0, 10) };
}
// 대표 장면: 대마법사 전설 대 대가(운영 덱), 씨앗 1~9 가운데 많이 이긴 쪽이 이기고 길이가 가운데값에 가장 가까운 판 → sandbox/scenes/v2-master-legend.json
function scene() {
  const rs = []; for (let s = 1; s <= 9; s++) { const sc = { v: A.VERSION, name: '대마법사 전설 대 대가: 떠보기·들어가기·빠지기, 지형 (운영 덱, 200×150)', seed: s, width: 200, height: 150, sides: [{ name: '전설', mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 운영' }] }, { name: '대가', mages: [{ tier: '대마법사', skill: '대가', deck: '대마법사 운영' }] }] }; const r = A.runScene(sc); rs.push({ s, sc, w: r.winner, t: r.t }); }
  const cnt = {}; for (const r of rs) cnt[r.w] = (cnt[r.w] || 0) + 1; const w = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  const ts = rs.map(r => r.t).sort((a, b) => a - b), med = ts[ts.length >> 1], best = rs.filter(r => r.w === w).sort((a, b) => Math.abs(a.t - med) - Math.abs(b.t - med) || a.s - b.s)[0];
  best.sc.note = `대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 ${w}, ${cnt[w]}/9)이 이기고 길이(${best.t} s)가 가운데값(${med} s)에 가장 가까운 판`;
  fs.writeFileSync(path.join(__dirname, '..', 'sandbox', 'scenes', 'v2-master-legend.json'), JSON.stringify(best.sc, null, 1) + '\n'); console.log(best.s, best.sc.note);
}
async function main() {
  if (process.argv[2] === 'scene') return scene();
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  const names = pos[0] && pos[0] !== 'all' ? pos[0].split(',') : Object.keys(PAIRS), N = +(pos[1] || 100), deck = opt('--deck') || '대마법사 성', tac = opt('--tac') ? JSON.parse(opt('--tac')) : undefined, tacA = opt('--tacA') ? JSON.parse(opt('--tacA')) : undefined, rules = opt('--rules') ? JSON.parse(opt('--rules')) : undefined, CH = 5;
  const { runJobs } = require('./par'), jobs = [], own = [];
  for (const nm of names) { if (!PAIRS[nm]) throw new Error('없는 대진: ' + nm); for (let f = 0; f < N; f += CH) { jobs.push({ mod: __filename, fn: 'run', args: [nm, f, Math.min(CH, N - f), deck, tac, rules, tacA] }); own.push(nm); } }
  const t0 = Date.now(), res = await runJobs(jobs), by = {}; res.forEach((r, i) => (by[own[i]] = by[own[i]] || []).push(r));
  const out = {}; for (const nm of names) { out[nm] = summarize(by[nm]); const s = out[nm];
    console.log(`${nm} 점수 ${s.score} · ${s.len} s · 거리 ${s.dist} m (±${s.distSD}, 흔들림 ${s.distJitter}) · 시전 ${s.castsPerS}/s · B칸 ${s.slotBPerGame}/판 · 헛손질 ${s.offMiss} · 경계 틈 ${s.gap} m, 이동 ${s.boundaryMove} m/s · 지형 ${s.built}/${s.razed} · 단계 ${JSON.stringify(s.phase)} · 입장 ${JSON.stringify(s.stance)}`);
    console.log('   칸 역할', JSON.stringify(s.roles)); console.log('   마법', s.spells.slice(0, 7).map(x => `${x.spell} ${(x.share * 100).toFixed(0)}%·명중 ${(x.hit * 100).toFixed(0)}%`).join(', ')); }
  process.stderr.write(`${jobs.length} 일감 ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
  const sv = opt('--save'); if (sv) { fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'results', `master-${sv}.json`), JSON.stringify({ v: A.VERSION, date: new Date().toISOString().slice(0, 10), deck, tac: tac || null, N, result: out }, null, 1) + '\n'); }
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { run, boundary, PAIRS };
