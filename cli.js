#!/usr/bin/env node
'use strict';
/* 숨 결투장 v2.31.0 명령줄
 *   node cli.js bench               속도 측정
 *   node cli.js duel 평범 평범 20    같은 등급 결투 20판
 *   node cli.js ring 대마법사 평범 50 [기본기]   한 명을 가운데 두고 둘러쌈
 *   node cli.js league 상위 10      원소 기본책끼리 총당
 *   node cli.js replay 상위 상위 out.json   한 판 녹화
 *   node cli.js scene sandbox/scenes/duel.json   장면 한 판 (샌드박스와 같은 결과)
 *   node cli.js pack                샌드박스가 읽을 sandbox/arena.js(엔진·데이터·장면 묶음) 다시 싸기
 *   node cli.js suite [묶음] [--save] [--jobs N]   표준 시험 묶음: 기준(suite-baseline.json)과 비교, --save면 기준 저장. 기본은 코어 수만큼 병렬(par.js)
 *   node cli.js report [--n 100] [--crowd 20] [--show]   성적표: 결투장 전설 대 전설·사다리·상위 무리 기준을 재서 reports/scorecard.json·.md에 이 버전으로 쌓는다 (v2.9)
 *   node cli.js audit [--seeds 1,2,3] [--only 장면,…] [--rules '{…}'] [--save 이름]   지능 점검: 모든 장면 × 씨앗의 사건을 reports/audit.md에 (v2.30)
 *   node cli.js gate [--quick] [--show]               v3.0 문턱(GATE-v4.md 1장)을 재서 통과·불합격·못 잼을 reports/gate.json·.md에 이 버전으로 쌓는다 (v2.16)
 */
const A = require('./src');
const [cmd, ...args] = process.argv.slice(2);
const now = () => Number(process.hrtime.bigint() / 1000000n);
function tally(results, sides = 2) { const w = Array(sides + 1).fill(0); for (const r of results) w[r.winner === -1 ? sides : r.winner]++; return w; }

if (cmd === 'bench') {
  let t0 = now(), steps = 0, n = 0;
  while (now() - t0 < 4000) { const r = A.duel(A.mage({ tier: '평범', deck: '기본기' }), A.mage({ tier: '평범', deck: '합법 최강' }), { seed: n + 1 }); steps += Math.round(r.t / A.DT); n++; }
  const ms1 = (now() - t0) / n;
  t0 = now(); const r = A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 50 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: 7, layout: 'ring', maxT: 30 });
  const ms2 = now() - t0;
  console.log(JSON.stringify({ version: A.VERSION, duel_1v1_ms_per_match: +ms1.toFixed(1), duel_steps_per_s: Math.round(steps / (n * ms1) * 1000), ring_1v50_ms_for_30s: ms2, ring_game_seconds: r.t }));
}
if (cmd === 'duel') {
  const [ta = '평범', tb = '평범', N = 20, da = '합법 최강', db = '합법 최강'] = args; const res = [];
  for (let k = 0; k < +N; k++) { const sw = k % 2; const a = A.mage({ tier: ta, deck: da }), b = A.mage({ tier: tb, deck: db }); const r = sw ? A.duel(b, a, { seed: k + 1 }) : A.duel(a, b, { seed: k + 1 }); res.push({ winner: r.winner === -1 ? -1 : (r.winner === 0) !== !!sw ? 0 : 1, t: r.t }); }
  const w = tally(res); console.log(JSON.stringify({ A: ta + '/' + da, B: tb + '/' + db, A승: w[0], B승: w[1], 무: w[2], 평균시간: +(res.reduce((a, r) => a + r.t, 0) / res.length).toFixed(1) }));
}
if (cmd === 'ring') {
  const [ta = '대마법사', tb = '평범', nb = 50, db = '기본기', N = 5] = args; const out = [];
  for (let k = 0; k < +N; k++) { const r = A.battle([A.mage({ tier: ta, deck: '광역' })], Array.from({ length: +nb }, () => A.mage({ tier: tb, deck: db })), { seed: k + 1, layout: 'ring', maxT: 90 }); const c = r.ms[0]; out.push({ winner: r.winner, t: r.t, hp: Math.round(Math.max(0, c.hp)), kills: r.ms.slice(1).filter(m => m.hp <= 0).length, stance: Object.fromEntries(Object.entries(c.log.stanceT).map(([k2, v]) => [k2, +v.toFixed(1)])) }); }
  console.log(JSON.stringify(out));
}
if (cmd === 'league') {
  const [tier = '평범', N = 6] = args; const els = ['불', '번개', '흙', '물', '얼음', '독']; const W = Object.fromEntries(els.map(e => [e, 0]));
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) for (let k = 0; k < +N; k++) { const a = A.mage({ tier, deck: els[i] }), b = A.mage({ tier, deck: els[j] }); const sw = k % 2; const r = sw ? A.duel(b, a, { seed: 1000 + i * 50 + j * 7 + k }) : A.duel(a, b, { seed: 1000 + i * 50 + j * 7 + k }); if (r.winner === -1) continue; const wa = (r.winner === 0) !== !!sw; W[wa ? els[i] : els[j]]++; }
  console.log(JSON.stringify({ tier, 승: W }));
}
if (cmd === 'replay') {
  const [ta = '상위', tb = '상위', file = 'replay.json'] = args;
  const r = A.duel(A.mage({ tier: ta, name: 'A' }), A.mage({ tier: tb, deck: '기본기', name: 'B' }), { seed: 3, record: true, rules: { barrels: true } });
  require('fs').writeFileSync(file, JSON.stringify({ v: A.VERSION, names: r.ms.map(m => m.name), sides: r.ms.map(m => m.side), hpMax: r.ms.map(m => m.hpMax), winner: r.winner, t: r.t, obs: r.obs, frames: r.rec }));
  console.log('녹화', file, r.rec.length, '프레임, 승자', r.winner);
}
if (cmd === 'scene') {
  const [file, rec] = args; if (!file) throw new Error('장면 파일을 준다: node cli.js scene sandbox/scenes/duel.json [녹화.json]');
  const sc = JSON.parse(require('fs').readFileSync(file, 'utf8')), W = A.sceneWorld(sc, { record: !!rec }), r = A.run(W);
  if (rec) require('fs').writeFileSync(rec, JSON.stringify(A.recording(W)));
  console.log(JSON.stringify({ 장면: sc.name || file, 씨앗: sc.seed, 승자: r.winner === -1 ? '무승부' : (sc.sides[r.winner].name || r.winner), 시간판정: r.byTime, 시간: r.t, 남은: r.ms.filter(m => m.hp > 0).map(m => m.name + ':' + Math.round(m.hp)) }));
}
if (cmd === 'pack') console.log('쌈', require('./sandbox/pack').write());
if (cmd === 'suite') require('./test/suite').main(args);
if (cmd === 'report') require('./experiments/report').main(args).catch(e => { console.error(e); process.exitCode = 1; });   // 성적표 (v2.9, SPEC 33장)
if (cmd === 'audit') require('./experiments/audit').main(args).catch(e => { console.error(e); process.exitCode = 1; });   // 지능 점검 (v2.30, SPEC 53장)
if (cmd === 'gate') require('./experiments/gate').main(args).catch(e => { console.error(e); process.exitCode = 1; });   // v3.0 문턱 (v2.16, SPEC 40장, GATE-v4.md)
