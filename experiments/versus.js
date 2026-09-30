'use strict';
/* 숨 결투장 v2.0.0 — 대결 재기 (실험 도구, Node)
 * 두 사람 규격(A.mage의 옵션 그대로: tier·skill·deck·type·gear·tac…)을 N판 싸우고, 이긴 수·시간·시간 판정과 기록(m.log) 칸의 합을 편마다 모은다.
 * 씨앗 1..N, 판마다 자리를 번갈아(node cli.js duel과 같다). 병렬 실행기로 나눠 돌려도 결과는 같다(from으로 이어 붙인다).
 *   node experiments/versus.js '{"tier":"중간","skill":"대가"}' '{"tier":"중간","skill":"상급"}' 400 '{"risk":true}' [기록 칸,…]
 *   const { versus } = require('./experiments/versus'); await versus(a, b, 400, rules, ['backfire'])
 * 1000판 이상으로 재야 ±3%p 안이다 (reports/v1.3.1.md, 13절) */
const path = require('path');
const A = require('../src');
// k = from..from+N−1 판. 기록 칸 keys의 합을 a·b 쪽으로
function part(a, b, from, N, rules, keys = []) {
  const o = { n: 0, a: 0, b: 0, d: 0, t: 0, bt: 0, la: {}, lb: {} };
  for (let k = from; k < from + N; k++) {
    const sw = k % 2, x = A.mage(a), y = A.mage(b), r = sw ? A.duel(y, x, { seed: k + 1, rules }) : A.duel(x, y, { seed: k + 1, rules });
    const ma = r.ms[sw ? 1 : 0], mb = r.ms[sw ? 0 : 1];
    o.n++; o.t += r.t; if (r.byTime) o.bt++;
    if (r.winner === -1) o.d++; else if ((r.winner === 0) !== !!sw) o.a++; else o.b++;
    for (const key of keys) { o.la[key] = (o.la[key] || 0) + (ma.log[key] || 0); o.lb[key] = (o.lb[key] || 0) + (mb.log[key] || 0); }
  }
  return o;
}
function merge(ps) { const o = { n: 0, a: 0, b: 0, d: 0, t: 0, bt: 0, la: {}, lb: {} }; for (const p of ps) { for (const k of ['n', 'a', 'b', 'd', 't', 'bt']) o[k] += p[k]; for (const s of ['la', 'lb']) for (const k in p[s]) o[s][k] = (o[s][k] || 0) + p[s][k]; } return o; }
// 모은 것 → 한 줄: A 점수(무 = 0.5), 표준오차, 평균 시간, 시간 판정 수, 판당 기록
function summary(o) { const p = (o.a + o.d / 2) / o.n, se = Math.sqrt(p * (1 - p) / o.n), per = x => { const r = {}; for (const k in x) r[k] = +(x[k] / o.n).toFixed(3); return r; }; return { N: o.n, A: o.a, B: o.b, D: o.d, score: +p.toFixed(3), se: +se.toFixed(3), t: +(o.t / o.n).toFixed(2), byTime: o.bt, logA: per(o.la), logB: per(o.lb) }; }
async function versus(a, b, N, rules, keys = [], opt = {}) {
  const { runJobs } = require('./par'), step = opt.chunk || 25, jobs = [];
  for (let f = 0; f < N; f += step) jobs.push({ mod: __filename, fn: 'part', args: [a, b, f, Math.min(step, N - f), rules, keys] });
  return summary(merge(await runJobs(jobs, opt)));
}
module.exports = { part, merge, summary, versus };
if (require.main === module) {
  const [a, b, N = '100', rules = '{}', keys = ''] = process.argv.slice(2);
  versus(JSON.parse(a), JSON.parse(b), +N, JSON.parse(rules), keys ? keys.split(',') : []).then(r => console.log(JSON.stringify(r)));
}
