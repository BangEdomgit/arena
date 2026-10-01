'use strict';
/* 숨 결투장 — 성적표 (v2.9, SPEC 33장): 버전마다 같은 잣대로 재서 쌓는다
 *   node cli.js report [--n 100] [--lad 400] [--crowd 20] [--show] [--out 파일]
 *   잰 것은 reports/scorecard.json에 버전을 열쇠로 더하고(같은 버전이면 바꾼다) reports/scorecard.md(버전이 열인 표)를 다시 쓴다. --show는 재지 않고 표만 보인다
 * 잣대 (모두 씨앗 1..N, 결과는 일꾼 수와 상관없이 같다):
 *   1 대마법사 결투장 전설 대 전설 (장면 v2-tactics-legend, n판, metrics/watch): 끝남·길이·스스로 입은 몫·폭주, 공격 시전·명중(마법별)·방패, 빈틈, 짓지 않는 시간·두 칸,
 *     리듬 단계·작전의 시간 몫·속임수, 벽(쓸모·사이·곁·벽 뒤에서 쏜 몫·막은 적 공격)
 *   2 단계 사다리 (같은 장면, lad판(v2.10부터 400, 그 앞은 100), 판마다 자리를 번갈아): 전설 / 대가, 대가 / 상급의 앞 사람 점수 (비김 0.5)
 *   3 상위 무리 기준 (experiments/crowd, crowd판): 대마법사 하나 대 상위 6·10·14·20·30의 승률과 남은 체력 */
const fs = require('fs'), path = require('path'), A = require('../src');
const ROOT = path.join(__dirname, '..'), SCENE = path.join(ROOT, 'sandbox', 'scenes', 'v2-tactics-legend.json');
// 표의 줄: [열쇠, 이름, 꼴(% 몫 · n 수 · s 초 · x 점수 · w 승률·남은 체력), 목표 [아래, 위] (v2.10: 받은 요청의 목표. 무리는 승률)]
const ROWS = [
  ['## 대마법사 결투장 전설 대 전설'],
  ['쓰러뜨림으로 끝난 판', '쓰러뜨림으로 끝난 판', '%', [0.7, 1]], ['판 길이 (s)', '판 길이', 's', [40, 90]], ['(합) 스스로 입은 몫', '스스로 입은 피해 몫', '%', [0, 0.2]], ['폭주', '폭주 (판당)', 'n'], ['2 s 넘는 침묵 몫', '2 s 넘는 침묵', '%', [0, 0.05]], ['가장 긴 침묵 (s)', '가장 긴 침묵', 's', [0, 4]], ['30% 아래 뒤 끝까지 (s)', '30% 아래로 떨어진 뒤 끝까지', 's', [7, 13]], ['1 s에 잃은 가장 큰 체력 몫', '1 s에 잃은 가장 큰 체력', '%'], ['놓은 덫', '놓은 덫 (사람당 판당)', 'n'], ['덫이 밟힌 몫', '덫이 밟힌 몫', '%'], ['당 몫 평균', '당 (한도 대비 평균)', '%'], ['당 바닥 시간 몫', '당 바닥 (15 g 아래) 시간', '%'], ['머리 75 넘은 시간 몫', '머리 피로 75 넘은 시간', '%'], ['숨', '숨 (사람당 판당)', 'n'], ['숨 마시다 맞은 수', '숨 마시다 맞음 (판당)', 'n'], ['숨 뒤 명중률', '숨 뒤 5 s 공격 명중률', '%'],
  ['공격 시전', '공격 시전 (판당)', 'n'], ['공격 명중률', '공격 명중률', '%'], ['명중:짧은 실', '　짧은 실 명중', '%'], ['명중:체인', '　체인 명중', '%'], ['명중:번개 그물', '　번개 그물 명중', '%'], ['방패 몫', '방패 몫 (시전 중)', '%'],
  ['빈틈 찌른 몫', '빈틈 찌르기', '%', [0.6, 1]], ['빈틈에 맞힌 몫', '빈틈에 맞히기', '%'],
  ['짓지 않는 몫', '짓지 않는 시간 (사거리 안)', '%', [0, 0.4]], ['사거리 안 두 칸 몫', '두 칸 (사거리 안)', '%', [0.2, 1]],
  ['떠보기 몫', '리듬 떠보기', '%'], ['들어가기 몫', '리듬 들어가기', '%', [0.15, 1]], ['빠지기 몫', '리듬 빠지기', '%'], ['압박 몫', '작전 압박', '%'], ['끝내기 몫', '작전 끝내기', '%', [0.1, 1]], ['속임수', '속임수 (판당)', 'n'],
  ['쓸모 있는 벽 몫', '쓸모 있는 벽', '%', [0.5, 1]], ['두 사람 사이 벽', '두 사람 사이 벽 (판당)', 'n'], ['제 벽 곁 몫', '제 벽 곁 시간', '%'], ['벽 뒤에서 쏜 몫', '벽 뒤에서 쏜 몫', '%'], ['벽이 막은 적 공격', '벽이 막은 적 공격 (판당)', 'n'], ['벽이 없었다면 맞았을 피해', '벽이 없었다면 맞았을 피해 (판당)', 'n'], ['그중 맞은 몫', '벽을 가로지른 적 실이 맞은 몫', '%', [0, 0.02]],
  ['## 공격 방식 (결투장 전설 대 전설, v2.12)'],
  ['방식 시간: 견제', '견제 시간', '%'], ['방식 시간: 확정타', '확정타 시간', '%'], ['방식 시간: 덮기', '덮기 시간', '%'], ['방식 시간: 큰 한 방', '큰 한 방 시간', '%'], ['방식 시간: 던지기', '던지기 시간', '%'],
  ['방식 피해: 견제', '견제 피해 몫', '%'], ['방식 피해: 확정타', '확정타 피해 몫', '%'], ['방식 피해: 덮기', '덮기 피해 몫', '%'], ['방식 피해: 큰 한 방', '큰 한 방 피해 몫', '%'], ['방식 피해: 던지기', '던지기 피해 몫', '%'],
  ['확정타', '확정타 (판당)', 'n'], ['확정타 명중률', '확정타 명중률', '%'], ['견제', '견제 (판당)', 'n'], ['견제 명중률', '견제 명중률', '%'],
  ['덮기', '덮기 (판당)', 'n'], ['덮기 명중률', '덮기 명중률', '%'], ['덮기 갈 곳 덮은 비율', '덮기: 갈 곳 덮은 비율', '%'], ['구르기 빼낸 뒤 덮기', '피하기 빼낸 뒤 덮기 (판당)', 'n'], ['그중 맞힘', '　그중 맞힘 (판당)', 'n'], ['큰 수의 확정 순간 몫', '큰 수 가운데 확정 순간에 쓴 몫', '%'],
  ['## 단계 사다리 (결투장, 앞 사람 점수)'],
  ['사다리:전설-대가', '전설 / 대가', 'x', [0.65, 1]], ['사다리:대가-상급', '대가 / 상급', 'x', [0.7, 0.8]],
  ['## 상위 무리 기준 (대마법사 하나 대 상위 N: 승률 · 남은 체력)'],
  ['무리:6', '1 대 6', 'w'], ['무리:10', '1 대 10', 'w', [0.4, 0.6]], ['무리:14', '1 대 14', 'w'], ['무리:20', '1 대 20', 'w'], ['무리:30', '1 대 30', 'w'],
];
// 사다리 한 몫: 씨앗 s0..s0+cnt−1, 판마다 자리를 번갈아. 앞 사람의 점수 합
function ladder(sk, s0, cnt) {
  const sc = JSON.parse(fs.readFileSync(SCENE, 'utf8')); let x = 0;
  for (let s = s0; s < s0 + cnt; s++) { const sw = s % 2, c = JSON.parse(JSON.stringify(sc)); c.seed = s; c.sides[0].mages[0].skill = sw ? sk[1] : sk[0]; c.sides[1].mages[0].skill = sw ? sk[0] : sk[1];
    const r = A.runScene(c), me = sw ? 1 : 0; x += r.winner === me ? 1 : r.winner < 0 ? 0.5 : 0; }
  return x;
}
async function measure(N, NC, NL) {
  const { runJobs } = require('./par'), D = require('./diag'), CR = require('./crowd'), sc = JSON.parse(fs.readFileSync(SCENE, 'utf8')), CH = 2, jobs = [], tag = [];
  for (let s = 1; s <= N; s += CH) { jobs.push({ mod: path.join(__dirname, 'diag.js'), fn: 'run', args: [sc, s, Math.min(CH, N - s + 1), null] }); tag.push('diag'); }
  const LAD = { '전설-대가': ['전설', '대가'], '대가-상급': ['대가', '상급'] };
  for (const k in LAD) for (let s = 1; s <= NL; s += CH * 2) { jobs.push({ mod: __filename, fn: 'ladder', args: [LAD[k], s, Math.min(CH * 2, NL - s + 1)] }); tag.push('lad:' + k); }
  const NS = [6, 10, 14, 20, 30]; for (const n of NS) for (let s = 1; s <= NC; s += CH) { jobs.push({ mod: path.join(__dirname, 'crowd.js'), fn: 'run', args: [n, s, Math.min(CH, NC - s + 1)] }); tag.push('crowd:' + n); }
  const res = await runJobs(jobs), games = [], lad = {}, cr = {};
  res.forEach((r, i) => { const t = tag[i]; if (t === 'diag') games.push(...r); else if (t.startsWith('lad:')) lad[t.slice(4)] = (lad[t.slice(4)] || 0) + r; else (cr[t.slice(6)] = cr[t.slice(6)] || []).push(...r); });
  const o = {}, d = D.sum(games);
  for (const k in d.look) o[k] = d.look[k];
  o['쓰러뜨림으로 끝난 판'] = games.filter(g => g.ms.some(m => m.hp <= 0)).length / games.length;
  for (const x of d.spells) o['명중:' + x.spell] = x.hit;
  for (const k in LAD) o['사다리:' + k] = lad[k] / NL;
  for (const n of NS) { const g = cr[n]; o['무리:' + n] = [g.reduce((a, x) => a + x.win, 0) / g.length, g.reduce((a, x) => a + x.hp, 0) / g.length]; }
  return o;
}
const fmt = (v, f) => v == null ? '–' : f === '%' ? (v * 100).toFixed(0) + '%' : f === 's' ? v.toFixed(0) + ' s' : f === 'n' ? (+v).toFixed(1) : f === 'x' ? (+v).toFixed(2) : f === 'w' ? `${(v[0] * 100).toFixed(0)}% · ${(v[1] * 100).toFixed(0)}%` : String(v);
// 목표 칸: 아래만이면 "N 이상", 위만이면 "N 이하", 둘 다면 "N~M"
const gv = (x, f) => f === '%' || f === 'w' ? (x * 100).toFixed(0) + '%' : f === 's' ? x + ' s' : f === 'x' ? x.toFixed(2) : String(x);
function goal(g, f) { if (!g) return ''; const hi = f === 's' ? 1e9 : f === 'x' || f === '%' || f === 'w' ? 1 : 1e9; return g[1] >= hi ? gv(g[0], f) + ' 이상' : g[0] <= 0 ? gv(g[1], f) + ' 이하' : gv(g[0], f) + '~' + gv(g[1], f).replace(/^(\d+)%$/, '$1%'); }
// 버전 정렬 (2.10.0이 2.9.0 뒤)
const vkey = v => v.split('.').map(Number).reduce((a, x) => a * 1000 + x, 0);
function render(card) {
  const vs = Object.keys(card.versions).sort((a, b) => vkey(a) - vkey(b)), L = [];
  L.push('# 성적표', '', '버전마다 같은 잣대로 잰 값 (`node cli.js report`, 잣대는 `experiments/report.js` 머리 주석, SPEC 33장). 원자료는 `reports/scorecard.json`. 목표는 받은 요청의 것, ✓는 닿음 (무리는 대마법사 승률).', '');
  for (const v of vs) { const c = card.versions[v]; L.push(`- v${v}: ${c.date} 잼, 결투장 ${c.N}판 · 사다리 ${c.lad || c.N}판 · 무리 N마다 ${c.crowd}판`); }
  for (const r of ROWS) {
    if (r.length === 1) { L.push('', r[0], '', '| 지표 | 목표 | ' + vs.map(v => 'v' + v).join(' | ') + ' |', '|---|---|' + vs.map(() => '---|').join('')); continue; }
    const g = r[3], cell = v => { const x = card.versions[v].o[r[0]]; if (x == null || !g) return fmt(x, r[2]); const y = Array.isArray(x) ? x[0] : x; return fmt(x, r[2]) + (y >= g[0] - 1e-9 && y <= g[1] + 1e-9 ? ' ✓' : ' ✗'); };
    L.push(`| ${r[1]} | ${goal(g, r[2])} | ` + vs.map(cell).join(' | ') + ' |');
  }
  return L.join('\n') + '\n';
}
function load(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return { versions: {} }; } }
async function main(args) {
  const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const file = opt('--out') || path.join(ROOT, 'reports', 'scorecard.json'), md = file.replace(/\.json$/, '.md'), card = load(file);
  if (!args.includes('--show')) {
    const N = +(opt('--n') || 100), NC = +(opt('--crowd') || 20), NL = +(opt('--lad') || 400), t0 = Date.now(), o = await measure(N, NC, NL);
    card.versions[A.VERSION] = { date: new Date().toISOString().slice(0, 10), N, crowd: NC, lad: NL, o };
    fs.writeFileSync(file, JSON.stringify(card, null, 1) + '\n'); fs.writeFileSync(md, render(card));
    console.log(`v${A.VERSION} 잼 (${((Date.now() - t0) / 1000).toFixed(0)} s) → ${path.relative(process.cwd(), file)}, ${path.relative(process.cwd(), md)}`);
  }
  console.log(render(card));
}
module.exports = { measure, render, ladder, main, ROWS };
if (require.main === module) main(process.argv.slice(2)).catch(e => { console.error(e); process.exitCode = 1; });
