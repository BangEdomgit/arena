'use strict';
/* 숨 결투장 — 전투단 대 흩어진 무리 (v2.26, SPEC 49장): 대마법사(전설) 하나 대 상위 N
 * 상위 무리 기준(experiments/crowd.js)의 장면에 rules.squad를 켜고, 같은 N을 흩어진 무리(tac.squad 없음)와 전투단(tac.squad)으로 나란히 잰다.
 * 대마법사의 다수 모드는 두 쪽 모두 켜진다(스위치가 켜면). 반반이 되는 N이 설정의 경계 숫자다.
 *   node experiments/squad.js [S=20] [--n 6,8,10,12,15] [--rules '{…}'] [--arch '{"skill":"대가","circles":8}'] [--only 0|1] [--save 이름]
 * 지표: 대마법사 승·남은 체력·판 길이·쓰러뜨린 상위, 포위각(대마법사 둘레), 둘러싸인 시간(270° 넘게), 동시 공격 몫, 고립 처치 몫, 역할마다 시전·과녁에 준 피해, 일제 사격·다시 모임
 * 결과는 일꾼 수와 상관없이 같다 (par.js) */
const fs = require('fs'), path = require('path'), A = require('../src'), CR = require('./crowd');
const SQ = () => require('../src/rules/squad').api;
function run(n, s0, cnt, squad, rules, arch) {
  const o = []; for (let s = s0; s < s0 + cnt; s++) {
    const sc = CR.scene(n, s, squad ? { squad: 1 } : null, arch); sc.rules = Object.assign({}, sc.rules, { squad: true }, rules || {});
    const W = A.sceneWorld(sc); while (!A.over(W)) A.stepWorld(W);
    const r = A.result(W), am = W.ms[0], S = SQ().stats(W), st = S.stats, b = S.b[1];
    const CHS = W.rules.chorus ? require('../src/rules/chorus').api.stats(W) : null;
    o.push({ ch: CHS ? { formed: CHS.formed, broke: CHS.broke, onT: CHS.onT, leadDmg: CHS.leadDmg, maxN: CHS.maxN } : null, win: r.winner === 0 ? 1 : 0, hp: Math.max(0, am.hp) / am.hpMax, t: W.t, kills: W.ms.filter((m, i) => i > 0 && m.hp <= 0).length,
      enc: st.encN ? st.enc / st.encN * 57.3 : 0, sur: st.surT / W.t, sim: st.hitN ? st.simN / st.hitN : 0, simN: st.hitN, iso: st.kills ? st.isoK / st.kills : 0,
      sqEnc: b.log.encN ? b.log.enc / b.log.encN * 57.3 : 0, volleys: b.log.volleys, regroups: b.log.regroups, role: st.role });
  } return o;
}
async function table(S, ns, rules, arch, only) {
  const { runJobs } = require('./par'), jobs = [], CH = 2; const SQS = only == null ? [0, 1] : [only]; for (const sq of SQS) for (const n of ns) for (let s = 1; s <= S; s += CH) jobs.push({ mod: __filename, fn: 'run', args: [n, s, Math.min(CH, S - s + 1), sq, rules, arch] });
  const res = await runJobs(jobs), out = { scattered: {}, squad: {} }; let j = 0;
  for (const sq of SQS) for (const n of ns) {
    const g = []; for (let s = 1; s <= S; s += CH) g.push(...res[j++]); const k = g.length, avg = f => g.reduce((a, x) => a + f(x), 0) / k;
    const role = {}; for (const x of g) for (const r in x.role) { const q = role[r] || (role[r] = { casts: 0, dmg: 0 }); q.casts += x.role[r].casts / k; q.dmg += x.role[r].dmg / k; }
    for (const r in role) { role[r].casts = +role[r].casts.toFixed(1); role[r].dmg = +role[r].dmg.toFixed(1); }
    out[sq ? 'squad' : 'scattered'][n] = { n: k, win: +avg(x => x.win).toFixed(3), hp: +avg(x => x.hp).toFixed(3), t: +avg(x => x.t).toFixed(1), kills: +avg(x => x.kills).toFixed(1),
      enc: +avg(x => x.enc).toFixed(0), sur: +avg(x => x.sur).toFixed(3), sim: +avg(x => x.sim).toFixed(3), iso: +avg(x => x.iso).toFixed(3), sqEnc: +avg(x => x.sqEnc).toFixed(0), volleys: +avg(x => x.volleys).toFixed(1), regroups: +avg(x => x.regroups).toFixed(1), role,
      ch: g[0].ch ? { formed: +avg(x => x.ch.formed).toFixed(1), broke: +avg(x => x.ch.broke).toFixed(1), onT: +avg(x => x.ch.onT).toFixed(0), leadDmg: +avg(x => x.ch.leadDmg).toFixed(0), maxN: +avg(x => x.ch.maxN).toFixed(1) } : null };
  }
  return out;
}
async function main() {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const S = +(args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) || 20), ns = (opt('--n') || '6,8,10,12,15').split(',').map(Number);
  const only = opt('--only') == null ? null : +opt('--only'), out = await table(S, ns, opt('--rules') ? JSON.parse(opt('--rules')) : null, opt('--arch') ? JSON.parse(opt('--arch')) : null, only);
  for (const k of ['scattered', 'squad']) for (const n of ns) { const x = out[k][n]; if (!x) continue;
    console.log(`${k === 'squad' ? '전투단' : '흩어짐'} ${n}: 대마법사 승 ${(x.win * 100).toFixed(0)}% · 체력 ${(x.hp * 100).toFixed(0)}% · ${x.t} s · 쓰러뜨림 ${x.kills} · 포위각 ${x.enc}° · 둘러싸임 ${(x.sur * 100).toFixed(0)}% · 동시 ${(x.sim * 100).toFixed(0)}% · 고립 처치 ${(x.iso * 100).toFixed(0)}%` + (x.ch ? ` · 합창 ${JSON.stringify(x.ch)}` : '') + (k === 'squad' ? ` · 전투단 포위각 ${x.sqEnc}° · 일제 ${x.volleys} · 다시 모임 ${x.regroups} · 역할 ${JSON.stringify(x.role)}` : '')); }
  const sv = opt('--save'); if (sv) fs.writeFileSync(path.join(__dirname, 'results', `squad-${sv}.json`), JSON.stringify({ v: A.VERSION, date: new Date().toISOString().slice(0, 10), S, out }, null, 1) + '\n');
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { run, table };
