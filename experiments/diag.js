'use strict';
/* 숨 결투장 — 대마법사 결투장 진단 (v2.6, SPEC 30장)
 * 장면(기본: sandbox/scenes/v2-tactics-legend.json, 전설 대 전설 200×150)을 씨앗 N개로 걸음마다 지켜보고(metrics/watch) 사람마다 평균한다.
 *   node experiments/diag.js [N] [--scene 파일] [--rules '{…}'] [--tac '{…}'] [--skill 전설,대가] [--save 이름]
 * 결과는 일꾼 수와 상관없이 같다 (par.js) */
const fs = require('fs'), path = require('path'), A = require('../src'), Wt = require('../metrics/watch');
function one(sc, seed, rules) {
  const s = Object.assign({}, sc, { seed }); if (rules) s.rules = Object.assign({}, sc.rules, rules);
  const W = A.sceneWorld(s); while (!A.over(W)) { A.stepWorld(W); Wt.watch(W); }
  return { t: W.t, winner: A.result(W).winner, ms: W.ms.map(m => ({ side: m.side, skill: m.skill, hp: Math.max(0, m.hp), look: Wt.seen(W, m), spells: Wt.spells(m) })) };
}
function run(sc, s0, n, rules) { const o = []; for (let s = s0; s < s0 + n; s++) o.push(one(sc, s, rules)); return o; }
function sum(games) {
  const acc = {}, sp = {}; let n = 0;
  for (const g of games) for (const m of g.ms) { n++; for (const k in m.look) (acc[k] = acc[k] || []).push(m.look[k]); for (const k in m.spells) { const x = sp[k] || (sp[k] = { casts: 0, hits: 0, dmg: 0 }); x.casts += m.spells[k].casts; x.hits += m.spells[k].hit * m.spells[k].casts; x.dmg += m.spells[k].dmgShare; } }
  const look = {}; for (const k in acc) look[k] = +(acc[k].reduce((a, b) => a + b, 0) / acc[k].length).toFixed(3);
  // 몫은 판마다의 몫의 평균이 아니라 합의 몫으로도 본다: 스스로 입은 피해
  let took = 0, self = 0, fall = 0, salt = 0; for (const g of games) for (const m of g.ms) { took += m.look['받은 피해']; self += m.look['받은 피해'] * m.look['스스로 입은 몫']; fall += m.look['받은 피해'] * m.look['추락 몫']; salt += m.look['받은 피해'] * m.look['소금 몫']; }
  look['(합) 스스로 입은 몫'] = +(self / took).toFixed(3); look['(합) 추락 몫'] = +(fall / took).toFixed(3); look['(합) 소금 몫'] = +(salt / took).toFixed(3);
  look['판당 추락 피해'] = +(fall / n).toFixed(1); look['판 길이 (s)'] = +(games.reduce((a, g) => a + g.t, 0) / games.length).toFixed(1);
  const spells = Object.entries(sp).map(([k, x]) => ({ spell: k, castsPerMage: +(x.casts / n).toFixed(1), hit: +(x.hits / Math.max(1, x.casts)).toFixed(3), dmgShare: +(x.dmg / n).toFixed(3) })).sort((a, b) => b.castsPerMage - a.castsPerMage);
  return { mages: n, look, spells };
}
async function main() {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const N = +(args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) || 10);
  const sc = JSON.parse(fs.readFileSync(opt('--scene') || path.join(__dirname, '..', 'sandbox', 'scenes', 'v2-tactics-legend.json'), 'utf8')), rules = opt('--rules') ? JSON.parse(opt('--rules')) : null;
  if (opt('--tac')) { const t = JSON.parse(opt('--tac')); for (const sd of sc.sides) for (const mm of sd.mages) mm.tac = Object.assign({}, mm.tac, t); }
  if (opt('--skill')) { const [a, b] = opt('--skill').split(','); sc.sides[0].mages[0].skill = a; sc.sides[1].mages[0].skill = b || a; }
  const { runJobs } = require('./par'), CH = 2, jobs = []; for (let s = 1; s <= N; s += CH) jobs.push({ mod: __filename, fn: 'run', args: [sc, s, Math.min(CH, N - s + 1), rules] });
  const games = (await runJobs(jobs)).flat(), out = sum(games), wins = [0, 0]; for (const g of games) if (g.winner >= 0) wins[g.winner]++;
  out.wins = wins; out.look['쓰러뜨림으로 끝난 판'] = +(games.filter(g => g.ms.some(m => m.hp <= 0)).length / games.length).toFixed(3); console.log(JSON.stringify(out.look, null, 1)); console.log('이긴 판', wins.join(' : '));
  for (const x of out.spells) console.log(`  ${x.spell}  판당 ${x.castsPerMage} · 명중 ${(x.hit * 100).toFixed(0)}% · 피해 몫 ${(x.dmgShare * 100).toFixed(0)}%`);
  const sv = opt('--save'); if (sv) { fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'results', `diag-${sv}.json`), JSON.stringify(Object.assign({ v: A.VERSION, date: new Date().toISOString().slice(0, 10), N, rules }, out), null, 1) + '\n'); }
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { run, one, sum };
