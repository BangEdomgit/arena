'use strict';
/* 숨 결투장 — 1 대 다수의 경계 (v2.27, SPEC 50장): 최상위 대마법사 하나 대 단계 무리 N
 *   node experiments/bound.js <단계> <N,…> [S=10] [--arch '{…}'] [--rules '{…}'] [--squad] [--save 이름]
 *   단계: 평범(덱 기본기) · 중간(합법 최강·기본기 반반) · 상위(대가·상급 반반, 광역·기술·합법 최강). --squad면 전투단(tac.squad)에 rules.squad·chorus를 켠다
 * 싸움터: 대마법사가 가운데, 무리는 반지름 60~90 m의 둘레에 흩어져 선다. 너비는 무리 수에 맞춰 넓힌다(200 m부터). 묶음 '지금', 판은 maxT(기본 300 s)까지
 * 지표: 대마법사 승(무리를 다 쓰러뜨리거나 쫓았다)·쓰러짐(반반의 기준)·시간 끝·판 길이·쓰러뜨린 수, 판이 끝났을 때 대마법사의 체력·머리(fat)·당(glu)·숨(남은 들숨)·몸(stam), 대마법사가 쓰러졌다면 무엇으로(피해 종류의 몫·머리 넘침·당 바닥),
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
    rules: Object.assign({ profile: '지금', saltRing: false }, opt.squad ? { squad: true, chorus: true } : {}, opt.rules || {}),
    sides: [{ name: '대마법사', mages: [Object.assign({ tier: '대마법사', skill: '전설', deck: '대마법사 결투', x: cx, y: cy }, opt.arch || {})] }, { name: tier, mages: crowd }] };
}
function run(tier, n, s0, cnt, opt) {
  const o = []; for (let s = s0; s < s0 + cnt; s++) {
    const sc = scene(tier, n, s + 1, opt), W = A.sceneWorld(sc), t0 = Date.now(); while (!A.over(W)) A.stepWorld(W); const ms = Date.now() - t0;
    const am = W.ms[0], r = A.result(W), tk = am.log.taken, tot = Object.values(tk).reduce((a, b) => a + b, 0) || 1, by = {}; for (const k in tk) by[k] = tk[k] / tot;
    o.push({ win: r.winner === 0 && !r.byTime ? 1 : 0, dead: am.hp <= 0 ? 1 : 0, byTime: r.byTime ? 1 : 0, t: W.t, kills: W.ms.filter((m, i) => i > 0 && m.hp <= 0).length, hp: Math.max(0, am.hp) / am.hpMax, fat: am.fat, glu: am.glu / am.gluMax, stam: am.stam,
      breaths: am.mlog.breath, over: am.log.over, by, msPerS: ms / W.t });
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
    out[n] = { n: k, win: +avg(x => x.win).toFixed(3), dead: +avg(x => x.dead).toFixed(3), byTime: +avg(x => x.byTime).toFixed(3), t: +avg(x => x.t).toFixed(1), kills: +avg(x => x.kills).toFixed(1), hp: +avg(x => x.hp).toFixed(3), fat: +avg(x => x.fat).toFixed(0), glu: +avg(x => x.glu).toFixed(2), stam: +avg(x => x.stam).toFixed(1), breaths: +avg(x => x.breaths).toFixed(1), over: +avg(x => x.over).toFixed(1), lostBy: Object.fromEntries(Object.entries(by).map(([q, v]) => [q, +v.toFixed(2)])), msPerS: +avg(x => x.msPerS).toFixed(1) };
    const x = out[n]; console.log(`${tier} ${n}${o.squad ? ' 전투단' : ''}: 대마법사 승 ${(x.win * 100).toFixed(0)}% · 쓰러짐 ${(x.dead * 100).toFixed(0)}% · 시간 끝 ${(x.byTime * 100).toFixed(0)}% · ${x.t} s · 쓰러뜨림 ${x.kills} · 끝의 체력 ${(x.hp * 100).toFixed(0)}% 머리 ${x.fat} 당 ${(x.glu * 100).toFixed(0)}% 몸 ${x.stam} 숨 ${x.breaths} 넘침 ${x.over} · 진 판의 피해 ${JSON.stringify(x.lostBy)} · 판 1 s에 ${x.msPerS} ms`); }
  const sv = opt('--save'); if (sv) fs.writeFileSync(path.join(__dirname, 'results', `bound-${sv}.json`), JSON.stringify({ v: A.VERSION, tier, S, opt: o, out }, null, 1) + '\n');
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { scene, run };
