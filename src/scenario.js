'use strict';
/* 숨 결투장 — 조건 짓개 (v2.33, SPEC 55장): 조건(data/conditions.json) → 장면
 * 조건 = { id, name, note, field?: [w, h], maxT?, timeWin?(시간이 다 되면 이기는 편), closed?(갇힌 판: 물러서거나 끝으로 빠질 수 없다), rules?, decks?, layout?, terrain?, sides: [{ name, groups: [{ tier, n, skill, deck, form, d?, rows?, team?, out?, squad?, chorus?, tac?, hp?, z?, gabion? }] }] }
 * 배치는 부를 때마다 지금 엔진의 수로 정한다: 단계의 선명도(data/tiers.json) → 장악 반경(rules.domainR × C), 덱 공격 마법 R의 가운데 × √C → 사거리.
 * 규칙은 묶음 '지금' 위에 조건의 rules. 판 크기는 가장 먼 무리와 지형에 맞춘다(둘레 margin m). 같은 조건·씨앗이면 늘 같은 장면(난수는 씨앗의 mulberry32).
 * 주인공 = 첫 편의 첫 무리의 첫 사람. 무리는 주인공 쪽에서 +x 쪽으로 놓인다(고리·조는 둘레)
 * form: center · edge(왼쪽 끝) · near(주인공 곁) · ring(주인공 장악 반경 + 10 m 이상의 고리, 황금각 나선) · squads(team명씩 조, 조 사이 같은 각, 장악 반경 + out 밖)
 *   · arc(반원, 거리 d) · line(거리 d, rows줄) · cluster(거리 d의 덩어리) · inFort(소금 성채 안) · city(소금 도시의 골목) · battery(포 n문, 시작 자리에서 d m 밖, 포수 넷씩,
 *     gabion이면 흙 가마니가 앞과 옆 270°, 지형에 문이 있으면 문을 지킨다) · auto(엔진이 놓는다: 장면의 layout)
 * terrain: { rocks: 수, salt: 'under' | 'fort' | 'city', d: 지형의 가운데까지(m), w·h: 도시 크기, wall: 도시 성벽(문 gates개), redoubt: 주인공 둘레 보루 } */
const core = require('./core'), { cos, sin, hyp, mulberry32 } = require('./math');
const TIERS = require('../data/tiers.json'), DECKS = require('../data/decks.json'), LIST = require('../data/conditions.json'), ART = require('../data/rules/artillery.json');
const GOLD = 2.39996, M = 12;   // 황금각, 판 둘레 여유 (m)
const OFFT = { proj: 1, thread: 1, area: 1, lob: 1, cone: 1, touch: 1 };
const pick = (v, k) => Array.isArray(v) ? v[k % v.length] : v;
const r2 = x => Math.round(x * 100) / 100;
// 단계·덱의 지금 수: 선명도, 장악 반경, 사거리
function stat(g, rules, decks) {
  const t = TIERS[g.tier]; if (!t) throw new Error('없는 단계: ' + g.tier); const C = t.C, book = decks[pick(g.deck, 0)] || decks['합법 최강'] || [];
  const Rs = book.map(n => core.SPELLS[n]).filter(s => s && OFFT[s.t] && !s.mundane && !(s.rule && !rules[s.rule])).map(s => (s.R || 0) * Math.sqrt(C)).sort((a, b) => a - b);
  return { C, dom: (rules.domainR || 0) * C, range: Rs.length ? Rs[Rs.length >> 1] : 10 };
}
// 소금 도시 (army.js의 salt-city와 같은 셈, x0·y0에서 w × h): 골목 격자의 건물(바위), 광장 셋만 맨땅
function city(x0, y0, w, h) {
  const obs = [], plazas = [[x0 + w * 0.3, y0 + h * 0.27], [x0 + w * 0.55, y0 + h * 0.67], [x0 + w * 0.8, y0 + h * 0.37]];
  for (let x = x0 + 8; x < x0 + w - 4; x += 11) for (let y = y0 + 8; y < y0 + h - 4; y += 11) if (!plazas.some(([px, py]) => Math.abs(px - x) < 14 && Math.abs(py - y) < 14)) obs.push({ x: r2(x), y: r2(y), r: 3.5 });
  let rects = [{ x: x0, y: y0, w, h }]; for (const [px, py] of plazas) { const out = []; for (const r of rects) { const a0 = px - 12, a1 = px + 12, b0 = py - 12, b1 = py + 12;
    if (a1 <= r.x || a0 >= r.x + r.w || b1 <= r.y || b0 >= r.y + r.h) { out.push(r); continue; }
    if (r.x < a0) out.push({ x: r.x, y: r.y, w: a0 - r.x, h: r.h }); if (r.x + r.w > a1) out.push({ x: a1, y: r.y, w: r.x + r.w - a1, h: r.h });
    const c0 = Math.max(r.x, a0), c1 = Math.min(r.x + r.w, a1); if (r.y < b0) out.push({ x: c0, y: r.y, w: c1 - c0, h: b0 - r.y }); if (r.y + r.h > b1) out.push({ x: c0, y: b1, w: c1 - c0, h: r.y + r.h - b1 }); } rects = out; }
  return { obs, salt: rects.map(r => ({ x: r2(r.x), y: r2(r.y), w: r2(r.w), h: r2(r.h) })), plazas };
}
// 장면을 짓는다
function build(cond, opt = {}) {
  if (typeof cond === 'string') { const c = LIST.find(x => x.id === cond); if (!c) throw new Error('없는 조건: ' + cond); cond = c; }
  const seed = opt.seed || 1, rnd = mulberry32(seed * 7919 + 17), rules = Object.assign({ profile: '지금' }, cond.rules), R = core.rulesOf(rules), T = cond.terrain || {};
  const decks = Object.assign({}, DECKS, cond.decks); let useArt = false;
  const sides = [], pts = [], walls = [], obs = [], salt = []; let auto = false;
  const g0 = cond.sides[0].groups[0], P = stat(g0, R, decks);
  // 지형의 가운데: 주인공(0, 0)에서 +x로 T.d
  const tx = T.d != null ? T.d : 0; let CITY = null, FORT = null, gates = [];
  if (T.salt === 'city') { const w = T.w || 200, h = T.h || 150; CITY = city(tx - w / 2, -h / 2, w, h); salt.push(...CITY.salt); obs.push(...CITY.obs);
    if (T.wall) { const n = T.gates || 3, x = tx - w / 2; for (let k = 0; k < n; k++) gates.push([x, -h / 2 + h * (k + 0.5) / n]);
      for (let y = -h / 2; y <= h / 2; y += 1.2) if (!gates.some(g => Math.abs(g[1] - y) < 4)) walls.push({ x: r2(x), y: r2(y), r: 0.7, hp: 600, mat: 'earth' }); } }
  if (T.salt === 'fort') { const S = T.yard || 25, Rw = T.wallR || 11; FORT = { x: tx, y: 0, R: Rw }; salt.push({ x: r2(tx - S), y: -S, w: 2 * S, h: 2 * S });
    for (let k = 0; k < 40; k++) { const a = k / 40 * 6.2832, gap = [0, 1.5708, 3.1416, 4.7124].some(b => Math.abs(((a - b + 9.4248) % 6.2832) - 3.1416) < 0.2); if (!gap) walls.push({ x: r2(tx + cos(a) * Rw), y: r2(sin(a) * Rw), r: 0.7, hp: 300, mat: 'earth' }); }
    gates = [[tx - Rw, 0], [tx, -Rw], [tx + Rw, 0], [tx, Rw]]; }
  if (T.salt === 'under') salt.push({ x: -10, y: -10, w: 20, h: 20 });
  if (T.redoubt) for (let k = 0; k < 17; k++) { const a = k / 17 * 6.2832; walls.push({ x: r2(cos(a) * 2.2), y: r2(sin(a) * 2.2), r: 0.45, hp: 256, mat: 'earth', thick: 0.5, grp: 1000 }); }   // 보루: 주인공 둘레 흙 블록 열일곱
  cond.sides.forEach((sd, si) => {
    const ms = []; sides.push({ name: sd.name, mages: ms });
    for (const g of sd.groups) {
      const S = stat(g, R, decks), n = g.n || 1, f = g.form || 'auto', at = [];
      if (f === 'auto') auto = true;
      for (let k = 0; k < n; k++) {
        let p = null;
        if (f === 'center' || f === 'edge') p = [k * 1.2, 0];
        else if (f === 'near') { const r = 2 + 1.2 * Math.sqrt(k), a = k * GOLD; p = [cos(a) * r, sin(a) * r]; }
        else if (f === 'ring') { const R0 = P.dom + 10, r = Math.sqrt(R0 * R0 + k * (g.area || 12) / 3.1416), a = k * GOLD; p = [cos(a) * r, sin(a) * r]; }
        else if (f === 'squads') { const t = g.team || 5, K = Math.ceil(n / t), j = Math.floor(k / t), i = k % t, a = j * 6.2832 / K, D = P.dom + (g.out != null ? g.out : 12), ia = i * 6.2832 / t;
          p = [cos(a) * D + cos(ia) * 2, sin(a) * D + sin(ia) * 2]; }
        else if (f === 'arc') { const d = g.d || 14, a = -1.5708 + 3.1416 * (k + 0.5) / n; p = [cos(a) * d, sin(a) * d * 0.95]; }
        else if (f === 'line') { const rows = g.rows || 1, per = Math.ceil(n / rows), r = Math.floor(k / per), i = k % per; p = [(g.d || 30) + r * 3, (i - (per - 1) / 2) * 3]; }
        else if (f === 'cluster') { const r = 1.4 * Math.sqrt(k), a = k * GOLD; p = [(g.d || 30) + cos(a) * r, sin(a) * r]; }
        else if (f === 'inFort') { const F = FORT || { x: tx, y: 0, R: 11 }, r = Math.min(F.R - 2, 1.4 * Math.sqrt(k + 1)), a = k * GOLD; p = [F.x + cos(a) * r, F.y + sin(a) * r]; }
        else if (f === 'city') { const C2 = CITY ? { x0: tx - (T.w || 200) / 2, w: T.w || 200, h: T.h || 150 } : { x0: tx - 100, w: 200, h: 150 };
          for (let tr = 0; tr < 40 && !p; tr++) { const x = C2.x0 + 10 + rnd() * (C2.w - 20), y = -C2.h / 2 + 6 + rnd() * (C2.h - 12);
            if (CITY && (CITY.obs.some(o => hyp(o.x - x, o.y - y) < o.r + 1) || CITY.plazas.some(([px, py]) => Math.abs(px - x) < 13 && Math.abs(py - y) < 13))) continue; p = [x, y]; } if (!p) p = [C2.x0 + 10, 0]; }
        else if (f === 'battery') { useArt = true; const d = g.d || 60; let x, y;
          if (g.gates && gates.length) { const gt = gates[k % gates.length], j = Math.floor(k / gates.length), dx = tx - gt[0], dy = -gt[1], l = hyp(dx, dy) || 1; x = gt[0] + dx / l * (5 + j * 5) + (j % 2 ? -dy / l : dy / l) * 3 * (j ? 1 : 0); y = gt[1] + dy / l * (5 + j * 5) + (j % 2 ? dx / l : -dx / l) * 3 * (j ? 1 : 0); }   // 문 안쪽 5 m씩
          else { const a = (k - (n - 1) / 2) * (g.step || Math.min(0.5, 14 / d)); x = cos(a) * d; y = sin(a) * d; }
          p = [x, y]; }
        else if (f === 'auto') p = null;
        else throw new Error('없는 배치: ' + f);
        const spec = { tier: g.tier, deck: pick(g.deck, k), skill: pick(g.skill, k) };
        if (!spec.skill) delete spec.skill; if (!spec.deck) delete spec.deck; if (g.name) spec.name = g.name + (n > 1 ? k + 1 : '');
        const tac = Object.assign({}, g.tac); if (g.squad) tac.squad = 1; if (g.chorus) tac.chorus = 1; if (f === 'battery') { tac.gun = 1; tac.cancel = false; tac.cancel2 = false; spec.deck = '청동포'; spec.hp = ART.gun.hp; }
        if (Object.keys(tac).length) spec.tac = tac; if (g.hp && f !== 'battery') spec.hp = g.hp; if (g.z) spec.z = g.z;
        if (p) { spec.x = p[0]; spec.y = p[1]; pts.push(p); } ms.push(spec); at.push(p);
        if (f === 'battery') {   // 포수 넷: 포 뒤(주인공 반대쪽), 흙 가마니
          const l = hyp(p[0], p[1]) || 1, ux = p[0] / l, uy = p[1] / l;
          for (let c = 0; c < ART.gun.crew; c++) { const o = (c - 1.5) * ART.crew.side, q = [p[0] + ux * ART.crew.post - uy * o, p[1] + uy * ART.crew.post + ux * o]; ms.push({ tier: '병사', deck: '포수', x: q[0], y: q[1], tac: { crew: 1 } }); pts.push(q); }
          if (g.gabion) for (let c = 0; c < 14; c++) { const a = (c - 6.5) * (4.712 / 14), gap = Math.abs(a) < 0.35; if (gap) continue;
            const bx = -ux, by = -uy, ca = cos(a), sa = sin(a), vx = bx * ca - by * sa, vy = bx * sa + by * ca; walls.push({ x: p[0] + vx * 2.4, y: p[1] + vy * 2.4, r: 0.55, hp: 300, mat: 'earth' }); } }
      }
      if (g.squad) rules.squad = true; if (g.chorus) { rules.chorus = true; rules.chorusCast = true; }   // 합창이면 합창 설계도 (v2.34)
    }
  });
  if (useArt) { rules.artillery = true; Object.assign(decks, ART.decks); }
  // 판 크기와 옮기기
  let field = cond.field, ox = 0, oy = 0;
  const ext = pts.concat(salt.map(r => [r.x, r.y]), salt.map(r => [r.x + r.w, r.y + r.h]), obs.map(o => [o.x, o.y]), walls.map(w => [w.x, w.y]));
  if (pts.length) {
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0; for (const [x, y] of ext) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    const m = cond.margin != null ? cond.margin : M, w = Math.max(40, Math.ceil(x1 - x0 + 2 * m)), h = Math.max(30, Math.ceil(y1 - y0 + 2 * m));
    if (!field) field = [w, h]; ox = (field[0] - (x1 - x0)) / 2 - x0; oy = (field[1] - (y1 - y0)) / 2 - y0;
    if (g0.form === 'edge') ox = 6 - x0;   // 주인공을 왼쪽 끝에
  }
  const mv = (x, y) => [r2(Math.min(field[0] - 0.5, Math.max(0.5, x + ox))), r2(Math.min(field[1] - 0.5, Math.max(0.5, y + oy)))];
  for (const sd of sides) for (const m of sd.mages) if (m.x != null) { const q = mv(m.x, m.y); m.x = q[0]; m.y = q[1]; }
  const sc = { v: core.VERSION, cond: cond.id, name: cond.name, note: cond.note, seed, rules, maxT: cond.maxT, layout: cond.layout, sides }; if (cond.timeWin != null) sc.timeWin = cond.timeWin; if (cond.closed) sc.closed = true;
  if (field) { sc.width = field[0]; sc.height = field[1]; }
  if (salt.length) sc.salt = salt.map(r => ({ x: r2(r.x + ox), y: r2(r.y + oy), w: r.w, h: r.h }));
  if (walls.length) sc.walls = walls.map(w => Object.assign({}, w, { x: r2(w.x + ox), y: r2(w.y + oy) }));
  if (T.rocks != null || obs.length) { const ro = obs.map(o => ({ x: r2(o.x + ox), y: r2(o.y + oy), r: o.r }));
    for (let k = 0, tr = 0; k < (T.rocks || 0) && tr < 400; tr++) { const W0 = field ? field[0] : 40, H0 = field ? field[1] : 30, x = 3 + rnd() * (W0 - 6), y = 3 + rnd() * (H0 - 6), r = 1 + rnd() * 1.5;
      if (sides.some(sd => sd.mages.some(m => m.x != null && hyp(m.x - x, m.y - y) < r + 3)) || (!pts.length && Math.abs(y - H0 / 2) < 2.5)) continue; ro.push({ x: r2(x), y: r2(y), r: r2(r) }); k++; }
    sc.obstacles = ro.filter(o => !sides.some(sd => sd.mages.some(m => m.x != null && hyp(m.x - o.x, m.y - o.y) < o.r + 0.6))); }
  else if (cond.obstacles != null) sc.obstacles = cond.obstacles;
  if (Object.keys(cond.decks || {}).length || useArt) { sc.decks = {}; for (const k in decks) if (!DECKS[k] || (cond.decks && cond.decks[k])) sc.decks[k] = decks[k]; }
  sc.info = { prot: { C: P.C, dom: r2(P.dom), range: r2(P.range) } };
  return sc;
}
const list = () => LIST.map(c => ({ id: c.id, name: c.name, note: c.note }));
module.exports = { build, list, LIST, stat };
