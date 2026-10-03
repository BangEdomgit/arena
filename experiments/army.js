'use strict';
/* 숨 결투장 v2.2.0 — 대마법사 대 무리 (v2.0 둘째 묶음, SPEC 25장 끝, reports/v2.1.0.md)
 *   node experiments/army.js [장면,…] [N]      장면마다 씨앗 1..N (병렬). 기본: 모든 장면, N = 20 → results/army.json
 *   node experiments/army.js scenes [이름,…]    대표 장면을 sandbox/scenes/v2-army-*.json으로 (그다음 node cli.js pack. v2.33: 샌드박스의 군대 장면은 조건 c18~c26이다)
 *   이름이 c + 수(c24)면 그 조건(data/conditions.json)을 씨앗마다 짓는다 (v2.33)
 * 장면 (모두 결정론, 대마법사 = 편 0의 첫 사람):
 *   field-musket / field-plain   들판 1 km: 대마법사가 250 m 떨어져 날아서 시작, 머스킷 100 (넷 줄, 돌아가며 쏘기) / 평범 100 (기본기)
 *   ambush                       기습: 30 m 안, 머스킷 40이 반지름 14 m 반원, 벽 없이
 *   prepared / prepared-mix      준비: 같은 대진, 보루(흙 블록 열일곱)를 세운 뒤 / + 돌아가며 쏘기(넷 줄)·박격포 여섯
 *   salt-city                    소금 도시: 싸움터 대부분이 소금 땅, 건물(바위) 사이 골목, 광장 셋. 머스킷 60, 대마법사가 걸어서 들어간다
 *   throw-<덱>-<n>               장악권 밖 던지기: 평범 n(100·200)이 55~60 m 둘레에서 조약돌 / 무거운 돌 / 번쩍 돌
 *   field-gun / ambush-gun / salt-city-gun / salt-fort-gun   포병 (v2.31, rules.artillery): 위 장면에 청동포(산탄·둥근 탄·소금 탄)와 포수 넷씩
 *   tier-<등급>-<n>              등급 무리 둘러싸기: 상위 3·5·8·12, 중간 10·20·40·80, 평범 100·200 (기본 규칙, 덱 기본기)
 * 지표: 이김, 시간 판정, 걸린 시간, 대마법사의 남은 체력, 무리가 무너진 시각(쓰러지거나 도망친 수가 80%), 도망친 몫,
 *   세운 벽 수, 벽 곁에 있던 시간, 평균 높이, 눈먼 횟수, 무거운 돌 시도·명중 */
const fs = require('fs'), path = require('path');
const A = require('../src');
const ARCH = { tier: '대마법사', skill: '대가', deck: '대마법사 성' };
const NOSALT = { profile: '지금', saltRing: false };   // v2.24.1: 지금의 규칙 모두 (data/profiles.json)
const v = A.VERSION;
// 반지름 R 반원 (대마법사 쪽을 향해 열린)
function arc(n, cx, cy, R, mm) { const out = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + Math.PI * (i + 0.5) / n; out.push(Object.assign({ x: +(cx + Math.cos(a) * R).toFixed(2), y: +(cy + Math.sin(a) * R * 0.95).toFixed(2) }, mm)); } return out; }
function ring(n, cx, cy, R0, R1, mm) { const out = []; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI, R = R0 + (R1 - R0) * ((i * 7) % 5) / 4; out.push(Object.assign({ x: +(cx + Math.cos(a) * R).toFixed(2), y: +(cy + Math.sin(a) * R).toFixed(2) }, mm)); } return out; }
function fort(cx, cy, r = 2.2, n = 17) { const w = []; for (let k = 0; k < n; k++) { const a = k / n * 2 * Math.PI; w.push({ x: +(cx + Math.cos(a) * r).toFixed(2), y: +(cy + Math.sin(a) * r).toFixed(2), r: 0.45, hp: 256, mat: 'earth', thick: 0.5, grp: 1000 }); } return w; }
// 포대 (v2.31, rules.artillery): 청동포 하나와 포수 넷. 포수는 과녁 쪽(fx, fy)의 반대편에 선다
const ART = require('../data/rules/artillery.json');
// 흙 가마니 (v2.32): 포 앞 gabion.d m에 포신 자리(가운데 ± gap/2)를 비운 낮은 흙벽 줄. 포수를 직사·실에서 가린다(곡사·지역은 넘는다)
function gabions(x, y, fx, fy) { const G = ART.gabion, out = []; if (!G || !G.n) return out; const dx = fx - x, dy = fy - y, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  for (let k = 0; k < G.n; k++) { const o = (G.gap / 2 + G.r + Math.floor(k / 2) * G.step) * (k % 2 ? -1 : 1); out.push({ x: +(x + ux * G.d - uy * o).toFixed(2), y: +(y + uy * G.d + ux * o).toFixed(2), r: G.r, hp: G.hp, mat: 'earth' }); }
  return out; }
function battery(x, y, fx, fy) { const dx = x - fx, dy = y - fy, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, out = [{ tier: '병사', deck: '청동포', x, y, hp: ART.gun.hp, tac: { gun: 1, cancel: false, cancel2: false } }];
  for (let k = 0; k < ART.gun.crew; k++) out.push({ tier: '병사', deck: '포수', x: +(x + ux * ART.crew.post - uy * (k - 1.5) * ART.crew.side).toFixed(2), y: +(y + uy * ART.crew.post + ux * (k - 1.5) * ART.crew.side).toFixed(2), tac: { crew: 1 } }); return out; }
// 장면에 포대를 더한다: 규칙 artillery를 켜고 덱(청동포·포수)을 장면에 싣는다
function withGuns(sc, pts, name) { const fx = sc.sides[0].mages[0].x, fy = sc.sides[0].mages[0].y; for (const [x, y] of pts) { sc.sides[1].mages.push(...battery(x, y, fx, fy)); const gb = gabions(x, y, fx, fy); if (gb.length) sc.walls = (sc.walls || []).concat(gb); }
  sc.rules = Object.assign({}, sc.rules, { artillery: true }); sc.decks = Object.assign({}, sc.decks, ART.decks); sc.name = name; if (sc.obstacles && sc.obstacles.length) sc.obstacles = sc.obstacles.filter(o => !pts.some(([x, y]) => Math.hypot(o.x - x, o.y - y) < o.r + 3)); return sc; }
// 반원 위의 포 자리 (과녁 쪽을 향해 열린 반원의 가운데 둘레, ±12°씩)
const GUNN = 2;   // 기습의 포 수 (v2.31: 둘이면 대마법사 약 55%, 셋이면 약 38%)
function arcPts(n, cx, cy, R) { const out = []; for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 0.21; out.push([+(cx + Math.cos(a) * R).toFixed(2), +(cy + Math.sin(a) * R * 0.95).toFixed(2)]); } return out; }
const CITY8 = [[3, 8], [8, 142], [3, 16], [8, 134], [3, 25], [8, 125], [110, 84], [60, 56]];   // 소금 도시의 포 자리: 맨땅 띠 여섯·광장 둘, 모두 시작 자리에서 35 m 밖
const FAR = [[3, 8], [8, 142], [3, 16], [8, 134], [3, 25], [8, 125], [110, 84], [60, 56], [3, 2], [8, 148], [160, 55], [110, 100]];   // 소금 도시의 먼 포 자리 (시작 (4, 75)에서 50 m 밖)
const SCENES = {
  'field-musket': s => {
    const ms = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 25; k++) ms.push({ tier: '병사', deck: '머스킷', x: 600 + r * 3, y: 263 + k * 3, tac: { volley: 4 } });
    return { v, name: '들판: 대마법사 대 머스킷 100 (넷 줄, 돌아가며 쏘기)', seed: s, width: 1000, height: 600, maxT: 360, obstacles: 0, rules: NOSALT, sides: [{ name: '대마법사', mages: [Object.assign({ x: 350, y: 300, z: 10 }, ARCH)] }, { name: '군대', mages: ms }] };
  },
  'field-plain': s => {
    const ms = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 25; k++) ms.push({ tier: '평범', deck: '기본기', x: 600 + r * 3, y: 263 + k * 3 });
    return { v, name: '들판: 대마법사 대 평범 100 (기본기)', seed: s, width: 1000, height: 600, maxT: 360, obstacles: 0, rules: NOSALT, sides: [{ name: '대마법사', mages: [Object.assign({ x: 350, y: 300, z: 10 }, ARCH)] }, { name: '평범', mages: ms }] };
  },
  ambush: s => ({ v, name: '기습: 대마법사 대 머스킷 40 반원 (14 m, 벽 없이)', seed: s, width: 40, height: 30, maxT: 90, obstacles: [], rules: NOSALT, sides: [{ name: '대마법사', mages: [Object.assign({ x: 6, y: 15 }, ARCH)] }, { name: '총병', mages: arc(40, 6, 15, 14, { tier: '병사', deck: '머스킷' }) }] }),
  prepared: s => Object.assign(SCENES.ambush(s), { name: '준비: 보루 안의 대마법사 대 머스킷 40 반원', walls: fort(6, 15) }),
  'prepared-mix': s => { const sc = SCENES.prepared(s); sc.name = '준비: 보루 안의 대마법사 대 머스킷 34 (넷 줄, 돌아가며 쏘기) + 박격포 6'; sc.sides[1].mages = arc(40, 6, 15, 14, {}).map((p, i) => i % 7 === 3 ? { tier: '병사', deck: '박격포', x: p.x, y: p.y } : { tier: '병사', deck: '머스킷', x: p.x, y: p.y, tac: { volley: 4 } }); return sc; },
  'salt-city': s => {
    // 200 × 150: 건물은 격자의 바위, 골목 폭 약 4 m, 광장 셋은 맨땅(소금 없음). 들어오는 서쪽 가장자리 10 m도 맨땅
    const obs = [], salt = [{ x: 10, y: 0, w: 190, h: 150 }], plazas = [[60, 40], [110, 100], [160, 55]];
    for (let x = 18; x < 196; x += 11) for (let y = 8; y < 146; y += 11) if (!plazas.some(([px, py]) => Math.abs(px - x) < 14 && Math.abs(py - y) < 14)) obs.push({ x, y, r: 3.5 });
    const ms = []; for (let i = 0; i < 60; i++) ms.push({ tier: '병사', deck: '머스킷', x: 60 + (i * 37) % 130, y: 12 + (i * 53) % 126 });
    // 광장은 소금 땅에서 빼 사각형 여럿으로 나눈다 (소금 = 전체 − 광장)
    const cut = []; let rects = salt; for (const [px, py] of plazas) { const out = []; for (const r of rects) { const x0 = px - 12, x1 = px + 12, y0 = py - 12, y1 = py + 12; if (x1 <= r.x || x0 >= r.x + r.w || y1 <= r.y || y0 >= r.y + r.h) { out.push(r); continue; } if (r.x < x0) out.push({ x: r.x, y: r.y, w: x0 - r.x, h: r.h }); if (r.x + r.w > x1) out.push({ x: x1, y: r.y, w: r.x + r.w - x1, h: r.h }); const cx0 = Math.max(r.x, x0), cx1 = Math.min(r.x + r.w, x1); if (r.y < y0) out.push({ x: cx0, y: r.y, w: cx1 - cx0, h: y0 - r.y }); if (r.y + r.h > y1) out.push({ x: cx0, y: y1, w: cx1 - cx0, h: r.y + r.h - y1 }); } rects = out; }
    for (const m of ms) for (const [px, py] of plazas) if (Math.abs(m.x - px) < 13 && Math.abs(m.y - py) < 13) m.x = m.x + 30 <= 196 ? m.x + 30 : m.x - 30;   // 광장 밖으로 (v2.30.1: 판 끝을 넘지 않게, 예전엔 201까지 갔다)
    return { v, name: '소금 도시: 걸어 들어가는 대마법사 대 머스킷 60 (골목, 광장 셋만 맨땅)', seed: s, width: 200, height: 150, maxT: 240, obstacles: obs.filter(o => !ms.some(m => Math.hypot(m.x - o.x, m.y - o.y) < o.r + 1)), salt: rects, rules: NOSALT,
      sides: [{ name: '대마법사', mages: [Object.assign({ x: 4, y: 75 }, ARCH)] }, { name: '총병', mages: ms.filter(m => !obs.some(o => Math.hypot(m.x - o.x, m.y - o.y) < o.r + 0.5)) }] };
  },
  // 포병 (v2.31): 들판·기습·소금 도시·소금 성채에 포대를 더한다. 기습은 소금 탄까지(덱 그대로: 포는 셋 다 싣는다)
  'field-gun': s => withGuns(SCENES['field-musket'](s), [[640, 280], [640, 300], [640, 320]], '들판 + 포: 대마법사 대 머스킷 100 + 청동포 셋'),
  'ambush-gun': s => withGuns(SCENES.ambush(s), arcPts(GUNN, 6, 15, 14), '기습 + 포 + 소금: 대마법사 대 머스킷 40 반원 + 청동포 ' + GUNN + '(산탄·소금 탄)'),
  'salt-city-gun': s => withGuns(SCENES['salt-city'](s), CITY8.concat([[3, 40], [8, 110]]), '소금 도시 + 포: 대마법사 대 머스킷 60 + 청동포 열 (맨땅 띠를 따라 여덟, 광장에 둘)'),
  // 포 수를 바꿔 재는 소금 도시 (v2.32): 모두 시작 자리에서 50 m 밖(첫 산탄 한 방으로 끝나는 처형 판을 빼려고)
  'salt-city-gun8': s => withGuns(SCENES['salt-city'](s), FAR.slice(0, 8), '소금 도시 + 포 여덟 (50 m 밖)'),
  'salt-city-gun10': s => withGuns(SCENES['salt-city'](s), FAR.slice(0, 10), '소금 도시 + 포 열 (50 m 밖)'),
  'salt-city-gun12': s => withGuns(SCENES['salt-city'](s), FAR.slice(0, 12), '소금 도시 + 포 열둘 (50 m 밖)'),
  'salt-fort': s => A.scenario.build('c25', { seed: s }),
  'salt-fort-gun': s => withGuns(SCENES['salt-fort'](s), [[150, 70], [150, 80]], '소금 성채 + 포: 대마법사 대 보루 안의 머스킷 34 + 청동포 둘'),
};
for (const deck of ['조약돌', '무거운 돌', '번쩍 돌']) for (const n of [100, 200]) SCENES[`throw-${deck}-${n}`] = s => ({ v, name: `장악권 밖 던지기: 평범 ${n} (${deck}) 55~60 m`, seed: s, width: 300, height: 300, maxT: 180, obstacles: 0, rules: NOSALT, sides: [{ name: '대마법사', mages: [Object.assign({ x: 150, y: 150 }, ARCH)] }, { name: '평범', mages: ring(n, 150, 150, 55, 60, { tier: '평범', deck }) }] });
for (const [t, ns] of [['상위', [3, 5, 8, 12]], ['중간', [10, 20, 40, 80]], ['평범', [100, 200]]]) for (const n of ns) SCENES[`tier-${t}-${n}`] = s => ({ v, name: `둘러싸기: 대마법사 대 ${t} ${n}`, seed: s, maxT: 120, layout: 'ring', sides: [{ name: '대마법사', mages: [{ tier: '대마법사', deck: '광역' }] }, { name: t, mages: Array.from({ length: n }, () => ({ tier: t, deck: '기본기' })) }] });

// 한 장면 N판의 지표 합 (씨앗 from+1 ..)
function run(name, from, N, rules) {
  const o = { n: 0, win: 0, byTime: 0, t: 0, hp: 0, breakT: 0, broke: 0, fled: 0, army: 0, walls: 0, wallT: 0, z: 0, blind: 0, heavyTry: 0, heavyHit: 0, flashHit: 0, mb: 0, exec: 0 };
  for (let k = from; k < from + N; k++) {
    const sc = /^c\d+$/.test(name) ? A.scenario.build(name, { seed: k + 1 }) : SCENES[name](k + 1); if (rules) sc.rules = Object.assign({}, sc.rules, rules);
    const W = A.sceneWorld(sc), c = W.ms[0]; let zs = 0, zn = 0;
    while (!A.over(W)) { A.stepWorld(W); if (c.hp > 0 && W.step % 15 === 0) { zs += c.z; zn++; } }
    const r = A.result(W), army = W.ms.filter(m => m.side !== 0), gone = army.map(m => m.alog.fledT ?? m.deathT).filter(x => x != null).sort((a, b) => a - b), need = Math.ceil(army.length * 0.8);
    o.n++; if (r.winner === 0) o.win++; if (r.t < 3) o.exec++; if (r.byTime) o.byTime++; o.t += r.t; o.hp += Math.max(0, c.hp) / c.hpMax;
    if (gone.length >= need) { o.broke++; o.breakT += gone[need - 1]; }
    const fl = army.filter(m => m.alog.fled).length, fs = army.filter(m => m.flee).length; o.fled += fl; o.army += army.length; if (fs >= army.length * 0.5) o.mb++;   // 사기로 무너진 판: 무리의 반 넘게 도망치기 시작했다 (v2.24.1, v2.26.1부터 끝에 닿지 못하고 쓰러진 사람도 센다)
    o.walls += c.alog.walls; o.wallT += c.alog.wallT; o.z += zn ? zs / zn : 0; o.blind += c.alog.blinded;
    for (const m of army) { o.heavyTry += m.log.casts['무거운 돌'] || 0; o.heavyHit += m.log.hits['무거운 돌'] || 0; o.flashHit += m.alog.flashHit; }
  }
  return o;
}
const rate = o => ({ games: o.n, win: +(o.win / o.n).toFixed(3), byTime: +(o.byTime / o.n).toFixed(3), len: +(o.t / o.n).toFixed(1), hp: +(o.hp / o.n).toFixed(3), breakT: o.broke ? +(o.breakT / o.broke).toFixed(1) : null, broke: +(o.broke / o.n).toFixed(3), mb: +(o.mb / o.n).toFixed(3), exec: +(o.exec / o.n).toFixed(3), fled: +(o.fled / o.army).toFixed(3), walls: +(o.walls / o.n).toFixed(2), wallT: +(o.wallT / o.n).toFixed(1), z: +(o.z / o.n).toFixed(1), blind: +(o.blind / o.n).toFixed(2), heavy: o.heavyTry ? `${o.heavyHit}/${o.heavyTry}` : null });
async function main() {
  const args = process.argv.slice(2), R = args.indexOf('--rules'), rules = R >= 0 ? JSON.parse(args[R + 1]) : null, pos = args.filter((a, i) => !a.startsWith('--') && !(R >= 0 && i === R + 1));
  if (pos[0] === 'scenes') return scenes(pos[1] ? pos[1].split(',') : null);
  const names = pos[0] && pos[0] !== 'all' ? pos[0].split(',') : Object.keys(SCENES), N = +(pos[1] || 20), CH = 2;
  const { runJobs } = require('./par'), jobs = [], own = [];
  for (const nm of names) { if (!SCENES[nm] && !/^c\d+$/.test(nm)) throw new Error('없는 장면: ' + nm + ' (' + Object.keys(SCENES).join(', ') + ')'); for (let f = 0; f < N; f += CH) { jobs.push({ mod: __filename, fn: 'run', args: [nm, f, Math.min(CH, N - f), rules] }); own.push(nm); } }
  const t0 = Date.now(), res = await runJobs(jobs), sum = {};
  res.forEach((r, i) => { const s = sum[own[i]] || (sum[own[i]] = {}); for (const k in r) s[k] = (s[k] || 0) + r[k]; });
  const out = {}; for (const nm of names) { out[nm] = rate(sum[nm]); console.log(nm.padEnd(22), JSON.stringify(out[nm])); }
  process.stderr.write(`${jobs.length} 일감 ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
  if (!rules && names.length === Object.keys(SCENES).length) { fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'results', 'army.json'), JSON.stringify({ v, date: new Date().toISOString().slice(0, 10), N, result: out }, null, 1) + '\n'); }
}
// 대표 장면: 씨앗 1~9 가운데 많이 난 결과 쪽이고 길이가 가운데값에 가장 가까운 판
function scenes(only) {   // only: 다시 쓸 장면 이름(army.js의 이름, 예: salt-city)만
  const DIR = path.join(__dirname, '..', 'sandbox', 'scenes');
  for (const [f, nm] of [['v2-army-field', 'field-musket'], ['v2-army-ambush', 'ambush'], ['v2-army-prepared', 'prepared'], ['v2-army-salt-city', 'salt-city'], ['v2-army-field-gun', 'field-gun'], ['v2-army-ambush-gun', 'ambush-gun'], ['v2-army-salt-city-gun', 'salt-city-gun'], ['v2-army-salt-fort-gun', 'salt-fort-gun']]) { if (only && !only.includes(nm)) continue;
    const rs = []; for (let s = 1; s <= 9; s++) { const sc = SCENES[nm](s), r = A.runScene(sc); rs.push({ s, sc, w: r.winner, t: r.t }); }
    const cnt = {}; for (const r of rs) cnt[r.w] = (cnt[r.w] || 0) + 1; const w = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
    const ts = rs.map(r => r.t).sort((a, b) => a - b), med = ts[ts.length >> 1], best = rs.filter(r => r.w === w).sort((a, b) => Math.abs(a.t - med) - Math.abs(b.t - med) || a.s - b.s)[0];
    best.sc.note = `대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 ${w}, ${cnt[w]}/9)이 이기고 길이(${best.t} s)가 가운데값(${med} s)에 가장 가까운 판`;
    if (best.sc.width == null) { const W = A.sceneWorld(best.sc); best.sc.width = W.width; best.sc.height = W.height; }
    fs.writeFileSync(path.join(DIR, f + '.json'), JSON.stringify(best.sc, null, 1) + '\n'); console.log(f, best.s, best.sc.note);
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { SCENES, run };
