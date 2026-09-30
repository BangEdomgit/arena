'use strict';
/* 숨 결투장 v2.0.0 — v2.0 조정 측정 (Node, 코어를 다 쓴다)
 *   node experiments/v2tune.js nb [N]                 평범·중간·상위 이웃 판단 단계 N판(기본 400): 점수·Elo·시간 판정·길이
 *   node experiments/v2tune.js ablate [N]             기술 떼기: 전설의 기술 대 대가, 대가의 기술 대 상급, 상급의 기술 대 중급 (한 기술을 끈 위 단계의 점수)
 *   node experiments/v2tune.js elem [N]               원소 리그 (평범 상급끼리, 소금 원 안 = 기본, 밖 = saltRing 끔)
 *   node experiments/v2tune.js types [N]              부류 상성 (평범·중간 상급끼리)
 *   node experiments/v2tune.js crowd [N]              챌린저(전설) 대 브론즈(초보) 1~4명, 대마법사 대 평범 100, 머스킷 40 반원
 *   node experiments/v2tune.js sky [N]                대마법사끼리 판단 단계별, 좁은 곳(40×30)·넓은 곳(200×150): 길이·추락·스쳐 치기·비행 지표
 *   node experiments/v2tune.js all                    위 모두 → results/v2.0-final.json
 * 공통: --rules '{"…":…}'(기본 위에 덧씌움), --jobs N. 결과는 results/v2tune-<명령>.json에도 남는다 */
const fs = require('fs'), path = require('path');
const { runJobs, defaultWorkers } = require('./par');
const { elo } = require('./v2rules');
const JOBS = require.resolve('./jobs'), OUT = path.join(__dirname, 'results'), CHUNK = 25;
const SK = ['초보', '중급', '상급', '대가', '전설'], TIERS = ['평범', '중간'], NBT = ['평범', '중간', '상위'], ELEMS = ['불', '번개', '흙', '물', '얼음', '독'], TYPES = ['서퍼', '메타', '이단'];
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const workers = +(opt('--jobs') || defaultWorkers()), RULES = JSON.parse(opt('--rules') || '{}');
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const r3 = x => +x.toFixed(3), r1 = x => +x.toFixed(1);
const eloOf = p => r1(400 * Math.log10(Math.min(0.999, Math.max(0.001, p)) / (1 - Math.min(0.999, Math.max(0.001, p)))));
const dj = (a, b, N, rules) => { const js = []; for (let f = 0; f < N; f += CHUNK) js.push({ mod: JOBS, fn: 'duel', args: [a, b, f, Math.min(CHUNK, N - f), Object.assign({}, RULES, rules), ['bigHit', 'bigCast']] }); return js; };
const cj = (c, q, n, N, rules, layout, maxT) => { const js = []; for (let f = 0; f < N; f += CHUNK) js.push({ mod: JOBS, fn: 'crowd', args: [c, q, n, f, Math.min(CHUNK, N - f), Object.assign({}, RULES, rules), layout, maxT] }); return js; };
async function run(tasks, label) {
  const flat = [], own = []; tasks.forEach((t, i) => t.jobs.forEach(j => { flat.push(j); own.push(i); }));
  const t0 = Date.now(), res = await runJobs(flat, { workers }); process.stderr.write(`${label}: ${flat.length} 일감 ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
  const out = {}; res.forEach((r, i) => { const k = tasks[own[i]].key; (out[k] = out[k] || []).push(r); }); return out;
}
const merge = ps => ps.reduce((o, p) => { for (const k in p) if (typeof p[k] === 'number') o[k] = (o[k] || 0) + p[k]; else { o[k] = o[k] || {}; for (const j in p[k]) o[k][j] = (o[k][j] || 0) + p[k][j]; } return o; }, {});
const duelRow = o => ({ score: r3((o.a + o.d / 2) / o.n), se: r3(Math.sqrt(((o.a + o.d / 2) / o.n) * (1 - (o.a + o.d / 2) / o.n) / o.n)), elo: eloOf((o.a + o.d / 2) / o.n), time: r3(o.bt / o.n), len: r1(o.t / o.n), big: (o.la.bigCast || 0) + (o.lb.bigCast || 0) ? r3(((o.la.bigHit || 0) + (o.lb.bigHit || 0)) / ((o.la.bigCast || 0) + (o.lb.bigCast || 0))) : null, n: o.n });
function save(name, data) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, name), JSON.stringify(Object.assign({ v: require('../src').VERSION, rules: RULES }, data), null, 1) + '\n'); }

async function nb(N = 400) {
  const t = []; for (const tier of NBT) for (let i = 0; i < 4; i++) t.push({ key: tier + '|' + i, jobs: dj({ tier, skill: SK[i + 1] }, { tier, skill: SK[i] }, N) });
  const X = await run(t, '이웃'), out = {};
  for (const tier of NBT) { const rows = [], all = merge([]); for (let i = 0; i < 4; i++) { const o = merge(X[tier + '|' + i]); rows.push(Object.assign({ hi: SK[i + 1], lo: SK[i] }, duelRow(o))); for (const k of ['n', 'bt', 't']) all[k] = (all[k] || 0) + o[k]; } out[tier] = { rows, time: r3(all.bt / all.n), len: r1(all.t / all.n) }; }
  for (const tier of NBT) console.log(tier, out[tier].rows.map(r => `${r.hi}/${r.lo} ${r.score}±${r.se} (${r.elo}) ${r.len}s 시간${(r.time * 100).toFixed(0)}%`).join(' | '), '· 평균', out[tier].len, 's, 시간 판정', (out[tier].time * 100).toFixed(1) + '%');
  return out;
}
// 떼기: 한 기술을 끈 위 단계 대 아래 단계
const ABL = { 전설: [['전부', {}], ['학습', { learn: false }], ['학습 겨냥 예전(narrow)', { learnAim: 'narrow' }], ['덱 읽기', { counter: false }], ['속임수', { feint: false }], ['동시 착탄', { simul: false }], ['세 겹치기', { triple: false }], ['미끼', { bait: false }], ['약한 척', { fakeRetreat: false }], ['파도 고르기', { waveChoose: false }], ['방패 아끼기 켬(예전)', { shieldSave: true }]],
  상급: [['전부', {}], ['입장', { stance: false }], ['지렛대', { lever: false }], ['길목 함정', { pathTrap: false }], ['미리 정하기', { plan: false }], ['두 수 콤보', { combo2: false }], ['방패 아끼기', { shieldSave: false }], ['캔슬', { cancel: false }], ['엄폐', { cover: false }], ['박자', { tempo: false }], ['피할 자리 겨냥', { dodgeAim: false }]],
  대가: [['전부', {}], ['몰이', { herd: false }], ['걷어내기', { strip: false }], ['유도', { lure: false }], ['기회 캔슬', { cancel2: false }], ['짝 계획', { bigPlan: false }], ['붙잡기', { grab: false }], ['자리', { terrain: false }], ['두 번째 칸', { slotB: false }], ['공격 겹치기 켬(예전)', { slotBOff: true }], ['속임수 켬(예전 0.08)', { feint: 0.08 }], ['동시 착탄 켬(예전)', { simul: true }], ['간격 세기', { cdRead: false }], ['사거리 밖', { outrange: false }], ['약자부터', { focusLow: false }]] };
async function ablate(N = 400) {
  const t = []; for (const tier of TIERS) for (const hi of ['전설', '대가', '상급']) for (const [name, tac] of ABL[hi]) t.push({ key: [tier, hi, name].join('|'), jobs: dj({ tier, skill: hi, tac }, { tier, skill: SK[SK.indexOf(hi) - 1] }, N) });
  const X = await run(t, '떼기'), out = {};
  for (const tier of TIERS) for (const hi of ['전설', '대가', '상급']) { const base = duelRow(merge(X[[tier, hi, '전부'].join('|')])); out[tier + '|' + hi] = ABL[hi].map(([name]) => { const r = duelRow(merge(X[[tier, hi, name].join('|')])); return { off: name, score: r.score, se: r.se, drop: r3(base.score - r.score) }; }); console.log(tier, hi, out[tier + '|' + hi].map(x => `${x.off} ${x.score}${x.off === '전부' ? '' : ' (' + (x.drop >= 0 ? '−' : '+') + Math.abs(x.drop) + ')'}`).join(' | ')); }
  return out;
}
async function elem(N = 200) {
  const t = []; for (const ring of [true, false]) for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) t.push({ key: [ring, i, j].join('|'), jobs: dj({ tier: '평범', skill: '상급', deck: ELEMS[i] }, { tier: '평범', skill: '상급', deck: ELEMS[j] }, N, { saltRing: ring }) });
  const X = await run(t, '원소'), out = {};
  for (const ring of [true, false]) { const tot = {}, pairs = []; for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { const r = duelRow(merge(X[[ring, i, j].join('|')])); pairs.push({ a: ELEMS[i], b: ELEMS[j], score: r.score, len: r.len }); (tot[ELEMS[i]] = tot[ELEMS[i]] || []).push(r.score); (tot[ELEMS[j]] = tot[ELEMS[j]] || []).push(1 - r.score); }
    const k = ring ? '원 안' : '원 밖'; out[k] = { total: Object.fromEntries(ELEMS.map(e => [e, r3(tot[e].reduce((a, b) => a + b, 0) / 5)])), pairs }; console.log(k, JSON.stringify(out[k].total)); }
  return out;
}
async function types(N = 400) {
  const t = []; for (const tier of TIERS) for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) t.push({ key: [tier, i, j].join('|'), jobs: dj({ tier, skill: '상급', type: TYPES[i] }, { tier, skill: '상급', type: TYPES[j] }, N) });
  const X = await run(t, '부류'), out = {};
  for (const tier of TIERS) { out[tier] = []; for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) { const r = duelRow(merge(X[[tier, i, j].join('|')])); out[tier].push({ a: TYPES[i], b: TYPES[j], score: r.score, se: r.se, len: r.len }); } console.log(tier, out[tier].map(x => `${x.a}/${x.b} ${x.score}`).join(' | ')); }
  return out;
}
async function crowd(N = 200) {
  const t = []; for (const tier of TIERS) for (const n of [1, 2, 3, 4]) t.push({ key: `cb|${tier}|${n}`, jobs: cj({ tier, skill: '전설' }, { tier, skill: '초보' }, n, N, {}, 'lines', 120) });
  { const js = []; for (let f = 0; f < 20; f += 2) js.push({ mod: JOBS, fn: 'crowd', args: [{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 100, f, 2, Object.assign({}, RULES), 'ring', 90] }); t.push({ key: 'ring', jobs: js }); }   // 100명 판은 무거워 2판씩
  { const js = []; for (let f = 0; f < 20; f += 2) js.push({ mod: JOBS, fn: 'musket', args: [40, f, 2, Object.assign({}, RULES)] }); t.push({ key: 'musket', jobs: js }); }
  const X = await run(t, '무리'), out = { cb: {} }, rate = o => ({ games: o.n, win: r3(o.win / o.n), lose: r3(o.lose / o.n), draw: r3(o.draw / o.n), hp: r3(o.hp / o.n), len: r1(o.t / o.n) });
  for (const tier of TIERS) out.cb[tier] = [1, 2, 3, 4].map(n => Object.assign({ n }, rate(merge(X[`cb|${tier}|${n}`]))));
  out.ring = rate(merge(X.ring)); out.musket = rate(merge(X.musket));
  for (const tier of TIERS) console.log('챌린저', tier, out.cb[tier].map(x => `${x.n}명 ${x.win}`).join(' | '));
  console.log('둘러싸기', JSON.stringify(out.ring), '머스킷', JSON.stringify(out.musket));
  return out;
}
// 대마법사끼리: 좁은 곳(40×30)과 넓은 곳(200×150), 판단 단계별 (v2.0 비행)
async function sky(N = 100) {
  const t = []; for (const w of [40, 200]) for (const sk of SK) { const js = []; for (let f = 0; f < N; f += CHUNK) js.push({ mod: JOBS, fn: 'sky', args: [sk, w, f, Math.min(CHUNK, N - f), Object.assign({}, RULES)] }); t.push({ key: w + '|' + sk, jobs: js }); }
  const X = await run(t, '하늘'), out = {};
  for (const w of [40, 200]) { out[w] = SK.map(sk => { const o = merge(X[w + '|' + sk]), L = {}; for (const q in o.look) L[q] = r3(o.look[q] / o.n);
    return { skill: sk, len: r1(o.t / o.n), time: r3(o.bt / o.n), falls: r3(o.falls / o.n), graze: o.gT ? r3(o.gH / o.gT) : null, grazePerGame: r1(o.gT / o.n), fly: r3(o.flyT / o.t / 2), look: L, n: o.n }; });
    console.log(w + '×' + w * 0.75, out[w].map(x => `${x.skill} ${x.len}s 추락${x.falls} 스침${x.graze} 날기${x.fly} 흔들림${x.look['속도 흔들림']} 코너${x.look['코너 속도 근처 비율']}`).join(' | ')); }
  return out;
}
const CMD = { nb, ablate, elem, types, crowd, sky };
async function main() {
  const [cmd, n] = pos;
  if (cmd === 'all') { const t0 = Date.now(), r = { nb: await nb(), types: await types(), elem: await elem(), crowd: await crowd() }; save('v2.0-final.json', Object.assign({ date: new Date().toISOString().slice(0, 10), seconds: Math.round((Date.now() - t0) / 1000) }, r)); return; }
  if (!CMD[cmd]) throw new Error('명령: ' + Object.keys(CMD).join(', ') + ', all');
  const r = await CMD[cmd](n ? +n : undefined); save('v2tune-' + cmd + '.json', { date: new Date().toISOString().slice(0, 10), result: r });
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { nb, ablate, elem, types, crowd, sky, ABL };
