'use strict';
/* 숨 결투장 — 1 대 다수의 경계 (v2.27, SPEC 50장): 최상위 대마법사 하나 대 단계 무리 N
 *   node experiments/bound.js <단계> <N,…> [S=10] [--arch '{…}'] [--rules '{…}'] [--squad] [--save 이름]
 *   단계: 평범(덱 기본기) · 중간(합법 최강·기본기 반반) · 상위(대가·상급 반반, 광역·기술·합법 최강). --squad면 전투단(tac.squad)에 rules.squad·chorus를 켠다
 * 싸움터: 대마법사가 가운데, 무리는 반지름 60~90 m의 둘레에 흩어져 선다. 너비는 무리 수에 맞춰 넓힌다(200 m부터). 묶음 '지금', 판은 maxT(기본 300 s)까지
 * 지표: 대마법사 승(무리를 다 쓰러뜨리거나 쫓았다, 막는 수의 기준)·쓰러짐(잡는 수의 기준)·물러남(v2.28, rules.squad의 물러서기)·시간 끝·판 길이·쓰러뜨린 수, 판이 끝났을 때 대마법사의 체력·머리(fat)·당(glu)·숨(남은 들숨)·몸(stam), 대마법사가 쓰러졌다면 무엇으로(피해 종류의 몫·머리 넘침·당 바닥),
 *   계산 시간(판의 1 s를 도는 데 든 ms)
 * 결과는 일꾼 수와 상관없이 같다 (par.js) */
const fs = require('fs'), path = require('path'), A = require('../src');
const MID = ['합법 최강', '기본기'], TOP = ['광역', '기술', '합법 최강'], SK = ['대가', '상급'];
function scene(tier, n, seed, opt = {}) {
  const W = Math.max(200, Math.round(Math.sqrt(n) * 14)), cx = W / 2, cy = W / 2, crowd = [];
  for (let i = 0; i < n; i++) { const a = i * 2.39996, r = 60 + 30 * ((i * 7) % 11) / 10, x = +(cx + Math.cos(a) * r).toFixed(2), y = +(cy + Math.sin(a) * r).toFixed(2);
    const mm = tier === '평범' ? { tier, deck: '기본기' } : tier === '중간' ? { tier, deck: MID[i % 2] } : { tier, skill: SK[i % 2], deck: TOP[i % 3] };
    if (opt.squad) mm.tac = { squad: 1 }; crowd.push(Object.assign({ x, y }, mm)); }
  return { v: A.VERSION, name: `대마법사 하나 대 ${tier} ${n}`, seed, width: W, height: W, maxT: opt.maxT || 300, obstacles: 0,
    rules: Object.assign({ profile: '지금', saltRing: false, squad: true }, opt.squad ? { chorus: true, chorusCast: true } : {}, opt.rules || {}),   // squad: 대마법사의 다수 모드·물러서기 (v2.28부터 늘)
    sides: [{ name: '대마법사', mages: [Object.assign({ tier: '대마법사', skill: '전설', deck: '대마법사 결투', x: cx, y: cy }, opt.arch || {})] }, { name: tier, mages: crowd }] };
}
// 무리의 모습 (v2.29): 한 사람의 시간(짓는 중·움직임·과녁 장악 반경 안), 전투단 포위각(과녁 평균 자리 기준), 오래 선 합창(셋 넘게 3 s 넘게), 대마법사의 숨 돌리기·물러날 때의 체력
function crowdOf(W) { const SQ = require('../src/rules/squad').api.stats(W), c = SQ.stats.crowd, b = SQ.b[1], CH = W.rules.chorus ? require('../src/rules/chorus').api.stats(W) : null, CC = W.rules.chorusCast ? require('../src/rules/chorusCast').api.stats(W) : null;
  return { cCast: c.n ? c.cast / c.n : 0, cMove: c.n ? c.move / c.n : 0, cDom: c.n ? c.dom / c.n : 0, enc: b.log.encN ? b.log.enc / b.log.encN * 57.3 : 0, good: CH ? CH.good : 0, formed: CH ? CH.formed : 0, brokeHit: CH ? CH.brokeHit : 0, atN: CH ? CH.atN : 0, wideN: CH ? CH.wideN : 0, leadN: CH ? CH.leadN : 0, bigN: CC ? CC.bigN : 0, bigOk: CC ? CC.bigOk : 0, bigBroke: CC ? CC.bigBroke : 0, calmN: CC ? CC.calmN : 0, calmIn: CC ? CC.calmIn : 0, cBy: CC ? CC.by : {}, rests: SQ.stats.rests, retreatHp: SQ.stats.retreatHp }; }
function run(tier, n, s0, cnt, opt) {   // tier가 조건 id('c32')면 그 조건의 장면 (v2.33)
  const o = []; for (let s = s0; s < s0 + cnt; s++) {
    const sc = /^c\d+$/.test(tier) ? A.scenario.build(tier, { seed: s + 1 }) : scene(tier, n, s + 1, opt), W = A.sceneWorld(sc), t0 = Date.now(); while (!A.over(W)) A.stepWorld(W); const ms = Date.now() - t0;
    const am = W.ms[0], r = A.result(W), tk = am.log.taken, tot = Object.values(tk).reduce((a, b) => a + b, 0) || 1, by = {}; for (const k in tk) by[k] = tk[k] / tot;
    o.push({ win: r.winner === 0 && !r.byTime && !am.flee ? 1 : 0, dead: am.hp <= 0 && !am.flee ? 1 : 0, retreat: am.flee ? 1 : 0, byTime: r.byTime && !am.flee && am.hp > 0 ? 1 : 0, t: W.t, kills: W.ms.filter((m, i) => i > 0 && m.hp <= 0 && !m.alog.fled).length, hp: Math.max(0, am.hp) / am.hpMax, fat: am.fat, glu: am.glu / am.gluMax, stam: am.stam,
      breaths: am.mlog.breath, over: am.log.over, by, msPerS: ms / W.t,
      cfled: r.fled[1], cdead: r.dead[1], ...crowdOf(W) });
  } return o;
}
async function main() {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--squad'));
  const tier = pos[0] || '평범', ns = (pos[1] || '100').split(',').map(Number), S = +(pos[2] || 10);
  const o = { arch: opt('--arch') ? JSON.parse(opt('--arch')) : null, rules: opt('--rules') ? JSON.parse(opt('--rules')) : null, squad: args.includes('--squad'), maxT: opt('--maxT') ? +opt('--maxT') : null };
  const { runJobs } = require('./par'), jobs = []; for (const n of ns) for (let s = 0; s < S; s++) jobs.push({ mod: __filename, fn: 'run', args: [tier, n, s, 1, o] });
  const res = await runJobs(jobs), out = {}; let j = 0;
  for (const n of ns) { const g = []; for (let s = 0; s < S; s++) g.push(...res[j++]); const k = g.length, avg = f => g.reduce((a, x) => a + f(x), 0) / k, lost = g.filter(x => x.dead);
    const by = {}; for (const x of lost) for (const q in x.by) by[q] = (by[q] || 0) + x.by[q] / (lost.length || 1);
    out[n] = { n: k, win: +avg(x => x.win).toFixed(3), dead: +avg(x => x.dead).toFixed(3), retreat: +avg(x => x.retreat).toFixed(3), byTime: +avg(x => x.byTime).toFixed(3), t: +avg(x => x.t).toFixed(1), kills: +avg(x => x.kills).toFixed(1), hp: +avg(x => x.hp).toFixed(3), fat: +avg(x => x.fat).toFixed(0), glu: +avg(x => x.glu).toFixed(2), stam: +avg(x => x.stam).toFixed(1), breaths: +avg(x => x.breaths).toFixed(1), over: +avg(x => x.over).toFixed(1), lostBy: Object.fromEntries(Object.entries(by).map(([q, v]) => [q, +v.toFixed(2)])), msPerS: +avg(x => x.msPerS).toFixed(1), cCast: +avg(x => x.cCast).toFixed(3), cMove: +avg(x => x.cMove).toFixed(3), cDom: +avg(x => x.cDom).toFixed(3), enc: +avg(x => x.enc).toFixed(0), good: +avg(x => x.good).toFixed(1), formed: +avg(x => x.formed).toFixed(1), rests: +avg(x => x.rests).toFixed(1), cfled: +avg(x => x.cfled).toFixed(1),
      retreatHp: (() => { const r = g.filter(x => x.retreat); return r.length ? +(r.reduce((a, x) => a + x.retreatHp, 0) / r.length).toFixed(2) : null; })() };
    const x = out[n]; console.log(`${tier} ${n}${o.squad ? ' 전투단' : ''}: 대마법사 승 ${(x.win * 100).toFixed(0)}% · 쓰러짐 ${(x.dead * 100).toFixed(0)}% · 물러남 ${(x.retreat * 100).toFixed(0)}% · 시간 끝 ${(x.byTime * 100).toFixed(0)}% · ${x.t} s · 쓰러뜨림 ${x.kills} · 끝의 체력 ${(x.hp * 100).toFixed(0)}% 머리 ${x.fat} 당 ${(x.glu * 100).toFixed(0)}% 몸 ${x.stam} 숨 ${x.breaths} 넘침 ${x.over} · 진 판의 피해 ${JSON.stringify(x.lostBy)} · 판 1 s에 ${x.msPerS} ms\n   무리: 짓는 중 ${(x.cCast * 100).toFixed(0)}% · 움직임 ${(x.cMove * 100).toFixed(0)}% · 장악 반경 안 ${(x.cDom * 100).toFixed(0)}% · 물러난 무리 ${x.cfled} · 포위각 ${x.enc}° · 합창 ${x.formed} (셋 넘게 3 s 넘게 ${x.good}) · 대마법사 숨 돌리기 ${x.rests} · 물러날 때 체력 ${x.retreatHp}`); }
  const sv = opt('--save'); if (sv) fs.writeFileSync(path.join(__dirname, 'results', `bound-${sv}.json`), JSON.stringify({ v: A.VERSION, tier, S, opt: o, out }, null, 1) + '\n');
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { scene, run };
