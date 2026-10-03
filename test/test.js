'use strict';
/* 숨 결투장 v2.38.0 회귀 시험. 규칙을 바꾸면 여기부터 돌린다: node test/test.js [--jobs N] [--fresh] [이름…]
 * 시험은 주제마다 test/t/*.js에 있고(공용은 test/lib.js), 파일(무거운 것은 장면 몫)마다 일꾼에 나눠 돌린다(experiments/par.js, v2.23.1. 일꾼은 다시 쓴다: 시험은 바꾼 등록·기본값을 되돌린다. --fresh면 일감마다 새 일꾼). 혼자: node test/t/이름.js */
const assert = require('assert'), fs = require('fs'), path = require('path');
const A = require('../src'), P = require('../experiments/par');
const argv = process.argv.slice(2), ji = argv.indexOf('--jobs'), workers = ji >= 0 ? +argv[ji + 1] : undefined, only = argv.filter((a, k) => a[0] !== '-' && (ji < 0 || k !== ji + 1));
const HEAVY = { browser: 8, roundtrip: 3 }, COST = { browser: 9, v2c: 8, v2b: 7, roundtrip: 6, v2d: 5 };   // 오래 걸리는 것은 장면을 몫으로 나누고, 큰 일감부터 준다 (run(k, n))
const FILES = fs.readdirSync(path.join(__dirname, 't')).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)).filter(n => !only.length || only.includes(n)).sort((a, b) => ((COST[b] || 0) - (COST[a] || 0)) || (a < b ? -1 : 1));
(async () => {
  const jobs = [], of = []; for (const n of FILES) { const k = HEAVY[n] || 1; for (let i = 0; i < k; i++) { jobs.push({ mod: path.join(__dirname, 't', n + '.js'), fn: 'run', args: [i, k] });
      of.push(n); } }
  const t0 = Date.now(), got = await P.runJobs(jobs, { workers, fresh: argv.includes('--fresh') }), res = {};
  got.forEach((o, i) => { const r = res[of[i]] || (res[of[i]] = { pass: [], fail: [] }); for (const x of o.fail) if (!r.fail.some(f => f[0] === x[0])) r.fail.push(x); for (const x of o.pass) if (!r.pass.includes(x)) r.pass.push(x); });   // 몫을 합친다: 한 몫이라도 실패면 실패
  for (const r of Object.values(res)) r.pass = r.pass.filter(x => !r.fail.some(f => f[0] === x));
  let pass = 0, bad = 0;
  FILES.forEach(n => { const o = res[n]; console.log(n); for (const x of o.pass) console.log('  ✓', x); for (const [x, e] of o.fail) console.log('  ✗', x, '\n', e); pass += o.pass.length; bad += o.fail.length; });
  // 병렬 실행기 (1.11.1): 일꾼 수·차례와 상관없이 한 줄로 돌린 것과 같다
  if (!only.length) {
    const S = require.resolve('./suite');
    const J = [[{ tier: '평범', skill: '전설' }, { tier: '평범', skill: '대가' }, 6], [{ tier: '중간', skill: '대가' }, { tier: '중간', skill: '상급' }, 6, { risk: true, bodyBind: true }], ['중간', '평범', 4]].map(args => ({ mod: S, fn: 'duels', args }));
    J.push({ mod: S, fn: 'rings', args: [{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 30, 2] });
    const one = JSON.stringify(P.runSerial(J)), par = JSON.stringify(await P.runJobs(J.slice().reverse(), { workers: 3 }).then(r => r.reverse()));
    try { assert.strictEqual(par, one, '병렬 결과가 한 줄 결과와 다르다'); pass++; console.log('  ✓ 병렬 실행기 (1.11.1): 일꾼 셋이 거꾸로 돌려도 한 줄로 돌린 것과 같다'); } catch (e) { bad++; console.log('  ✗ 병렬 실행기', e.message); }
  }
  console.log(`시험 ${pass}개 통과${bad ? ', ' + bad + '개 실패' : ''} · 결투장 v${A.VERSION} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  if (bad) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
