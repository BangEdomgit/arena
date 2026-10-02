'use strict';
/* 숨 결투장 — 상위 무리 기준 (v2.9, SPEC 33장): 대마법사 하나 대 상위 N
 * 대마법사 결투장 들판(200 × 150, 결투장 규칙: v2.4 스위치 + 작전 겹)에서 대마법사(전설, 청사진 덱) 하나가 상위 N과 싸운다.
 * 상위 무리는 판단 대가·상급을 번갈아(반반), 덱은 광역·기술·합법 최강을 돌려 섞는다. N마다 씨앗 S개(판마다 하나)로 대마법사의 승률·남은 체력·판 길이.
 *   node experiments/crowd.js [S=20] [--n 6,10,14,20] [--tac '{…}'(상위 무리에 덧씌울 tac)] [--rules '{…}'(결투장 규칙에 덧씌움)] [--save 이름]
 * 결과는 일꾼 수와 상관없이 같다 (par.js) */
const fs = require('fs'), path = require('path'), A = require('../src');
const RULES = { profile: '지금' };   // v2.24.1: 지금의 규칙 모두 (v2.23까지는 작전 묶음)
const SKILLS = ['대가', '상급'], DECKS = ['광역', '기술', '합법 최강'];
function scene(n, seed, tac, arch) {
  const crowd = []; for (let i = 0; i < n; i++) crowd.push(Object.assign({ tier: '상위', skill: SKILLS[i % 2], deck: DECKS[i % 3] }, tac ? { tac } : null));
  return { v: A.VERSION, name: `대마법사 하나 대 상위 ${n} (상위 무리 기준: 대가·상급 반반, 광역·기술·합법 최강, 결투장 들판 200 × 150)`, seed, width: 200, height: 150, rules: RULES,
    sides: [{ name: '대마법사', mages: [Object.assign({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }, arch || {})] }, { name: '상위', mages: crowd }] };
}
function run(n, s0, cnt, tac, rules) { const o = []; for (let s = s0; s < s0 + cnt; s++) { const sc = scene(n, s, tac); if (rules) sc.rules = Object.assign({}, sc.rules, rules); const r = A.runScene(sc); o.push({ win: r.winner === 0 ? 1 : 0, hp: Math.max(0, r.ms[0].hp) / r.ms[0].hpMax, t: r.t, kills: r.ms.filter((m, i) => i > 0 && m.hp <= 0).length }); } return o; }
// N마다 S판: 대마법사의 승률·남은 체력 몫·판 길이·쓰러뜨린 상위 수
async function table(S, ns, tac, rules) {
  const { runJobs } = require('./par'), jobs = [], CH = 2; for (const n of ns) for (let s = 1; s <= S; s += CH) jobs.push({ mod: __filename, fn: 'run', args: [n, s, Math.min(CH, S - s + 1), tac, rules] });
  const res = await runJobs(jobs), out = {}; let j = 0;
  for (const n of ns) { const g = []; for (let s = 1; s <= S; s += CH) g.push(...res[j++]); const k = g.length, avg = f => g.reduce((a, x) => a + f(x), 0) / k;
    out[n] = { n: k, win: +avg(x => x.win).toFixed(3), hp: +avg(x => x.hp).toFixed(3), t: +avg(x => x.t).toFixed(1), kills: +avg(x => x.kills).toFixed(1) }; }
  return out;
}
async function main() {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const S = +(args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) || 20), ns = (opt('--n') || '6,10,14,20').split(',').map(Number);
  const out = await table(S, ns, opt('--tac') ? JSON.parse(opt('--tac')) : null, opt('--rules') ? JSON.parse(opt('--rules')) : null);
  for (const n of ns) { const x = out[n]; console.log(`1 대 ${n}: 대마법사 승 ${(x.win * 100).toFixed(0)}% · 남은 체력 ${(x.hp * 100).toFixed(0)}% · ${x.t} s · 쓰러뜨린 상위 ${x.kills}`); }
  const sv = opt('--save'); if (sv) fs.writeFileSync(path.join(__dirname, 'results', `crowd-${sv}.json`), JSON.stringify({ v: A.VERSION, date: new Date().toISOString().slice(0, 10), S, out }, null, 1) + '\n');
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { scene, run, table, RULES };
