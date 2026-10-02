'use strict';
/* 규칙: 벽 (rules.bulwark, v2.0 둘째 묶음, SPEC 25장, 수는 data/rules/bulwark.json)
 * 세울 때만 힘이 들고 고체는 유지 비용이 없다.
 *   흙·석회: 시간으로 사라지지 않고 체력이 다할 때까지 선다. 세우는 속도는 출력에 비례(초당 0.6 m³ × 출력/632 kW: 대마법사 흙벽 약 3 s, 보루 약 18 s, 평범은 사실상 못 한다)
 *   얼음: 유지 비용 없이 조금씩 녹고(초당 0.5) 불 지대 곁에선 빨리 녹는다(초당 20)
 *   불·물 벽(불벽·물 장막): 세운 사람이 버티는 동안(굳지 않고 당이 있는 동안, 15 s까지) 남고 당과 서클 하나를 쓴다. 멈추면 사라진다
 *   흙벽이 0.5 m 넘게 두꺼우면 총알이 멈춘다(2만 깎임). 큰 바위(무게 5 kg 넘는 투사체)·박격포는 부수고, 물은 흙벽을 진흙으로(× 10), 산은 석회를 녹인다(지대, rules/terrain)
 *   한 번 선 벽은 누구의 것도 아니다(own −1): 양쪽 모두 엄폐로 쓰고 양쪽 모두 막힌다. 흙을 끌어온 바깥쪽에 구덩이(걸음 × 0.5, 날면 없다)
 *   벽 뒤에선 시야가 막혀 예비동작을 못 읽는다(두뇌 hideCast). 날고 있으면(2 m 위) 벽이 없다(core)
 *   벽 밀기(틀 topple): 서 있는 벽 무리 하나를 한 방향으로 넘어뜨려 그 너머 한 줄(2.5 m)을 덮는다. 부딪힘 60 + 묶임 2 s. 벽은 무너진다 */
const { hyp, sin, cos, atan2 } = require('../math');
const P = require('../../data/rules/bulwark.json');
const { outP } = require('./flight').api;
const B0 = P.block, EARTH = { earth: 1, lime: 1 };
const rateOf = m => P.rate * outP(m) / P.rateP;   // 세우는 속도 m³/s
const volOf = s => B0.gap * B0.h * s.th;           // 블록 하나의 부피 m³
function nOf(s) { return s.shape === 'ring' ? Math.max(6, Math.round(2 * Math.PI * s.rad / B0.gap)) : s.nb; }
const buildT = (m, s) => s.cast + nOf(s) * volOf(s) / (rateOf(m) || 1e-9);   // 세우는 데 드는 시간 (예비동작 포함)
// 블록 k의 자리와 바깥 방향: 한 줄(겨눈 쪽 앞, 겨눈 쪽에 수직) 또는 제 둘레 고리
function spot(s, cx, cy, a, k, n) {
  if (s.shape === 'ring') { const b = a + k / n * 2 * Math.PI; return [cx + cos(b) * s.rad, cy + sin(b) * s.rad, cos(b), sin(b)]; }
  const off = (k - (n - 1) / 2) * B0.gap, ux = cos(a), uy = sin(a); return [cx + ux * s.at - uy * off, cy + uy * s.at + ux * off, ux, uy];
}
// 벽 무리를 넘어뜨릴 때 덮이는 사람 (무리의 블록마다 민 방향으로 depth m, 폭은 블록 간격)
const SEEN = new Set(), NEAR = [], BLK = [], CR = [];   // 벽 밀기의 값에서 다시 쓰는 것 (v2.23.1)
function crushed(W, blocks, ux, uy, out = []) {
  out.length = 0; const D = P.topple.depth;
  for (const q of W.ms) { if (q.hp <= 0 || q.z >= 1) continue; for (const b of blocks) { const rx = q.x - b.x, ry = q.y - b.y, t = rx * ux + ry * uy, w = -rx * uy + ry * ux;
      if (t > -0.3 && t < D + 0.3 && w > -B0.gap && w < B0.gap) { out.push(q); break; } } }
  return out;
}
// 세우는 중인 벽: 블록을 upto개까지 (시전 c에 자리를 적어 둔다). 한 줄 끝·고리가 싸움터 밖으로 나가면 그 블록은 건너뛴다
function begin(W, m, c) { if (!c.bw) c.bw = { x: m.x, y: m.y, a: atan2(c.ty - m.y, c.tx - m.x), k: 0, grp: W._grp++, done: 0 }; return c.bw; }
function place(W, m, c, upto, addWall) {
  const s = c.s, n = nOf(s), bw = begin(W, m, c);
  while (bw.k < upto && bw.k < n) {
    const [x, y, ox, oy] = spot(s, bw.x, bw.y, bw.a, bw.k, n); bw.k++;
    if (x < 0.5 || y < 0.5 || x > W.width - 0.5 || y > W.height - 0.5) continue;
    addWall(W, { x, y, r: B0.r, hp: B0.hpM3 * volOf(s), t: 1e9, own: -1, mat: s.mat, thick: s.th, grp: bw.grp, mk: m.id });
    W.zones.push({ k: 'pit', shape: 'circle', r: P.pit.r, x: x + ox * P.pit.out, y: y + oy * P.pit.out, a: 0, src: m, dps: 0, t: 1e9, n: '구덩이' });   // 흙을 끌어온 바깥쪽
  }
  if (bw.k >= n && !bw.done) { bw.done = 1; m.alog.walls++; }
}
function segHit(x1, y1, x2, y2, w) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((w.x - x1) * dx + (w.y - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
  return hyp(x1 + dx * t - w.x, y1 + dy * t - w.y) < w.r; }
module.exports = {
  name: 'bulwark', switch: 'bulwark', on: W => W.rules.bulwark, form: { build: 'self', topple: 'target' }, api: { rateOf, buildT, nOf, volOf, crushed },
  engine: X => {
    const { addWall } = X;
    return {
      // 흙·석회·얼음 벽은 시간으로 사라지지 않는다 (가두는 기둥은 그대로 짧다)
      wall(W, w) { if (!w.cage && (EARTH[w.mat] || w.mat === 'ice')) w.t = 1e9; },
      wallHit(W, p, o, wd) {
        const s = p.s; let r = wd;
        if (EARTH[o.mat]) {
          if ((s.m || 0) >= P.heavyM) r = P.heavy;                               // 큰 바위는 부순다
          else if (s.mundane) r = o.thick >= P.stopThick ? P.bullet : wd;        // 0.5 m 흙벽이면 총알이 멈춘다
          else if (s.el === '물') r = wd * P.water;                              // 물은 흙벽을 진흙으로
        }
        if (o.hp > 0 && o.hp <= r) p.src.mlog.razed++;   // 없앤 지형 (v2.2 지표)
        return r;
      },
      lobLand(W, l) { const d = l.s.wallDmg; if (d) for (const w of W.walls) if (hyp(w.x - l.x, w.y - l.y) < l.r + w.r) w.hp -= d; },   // 박격포는 벽을 부순다
      world(W) {
        for (const w of W.walls) if (w.mat === 'ice') {   // 얼음은 녹는다, 불 곁에선 빨리
          let k = P.ice.melt; for (const z of W.zones) if (z.k === 'fire' && hyp(z.x - w.x, z.y - w.y) < (z.r || (z.len || 2) / 2) + w.r + 0.5) { k = P.ice.fire; break; }
          w.hp -= k * W.dt;
        }
        // 버티는 벽(불벽·물 장막): 세운 사람이 굳지 않고 당이 있는 동안 남는다. 멈추면 사라진다
        for (const z of W.zones) {
          if (z.up === undefined) z.up = (z.n === '불벽' || z.n === '물 장막') ? 1 : 0;
          if (!z.up) continue; const q = z.src; z.age = (z.age || 0) + W.dt;
          if (q.hp <= 0 || q.st.stun > 0 || q.glu < P.upkeep.glu * W.dt || z.age > P.upkeep.max) { z.t = 0; z.up = 0; continue; }
          q.glu -= P.upkeep.glu * W.dt; if (z.t < 1) z.t = 1;
        }
      },
      mageStep(W, m) {
        const c = m.cast; if (c && c.s.t === 'build') {
          if (m.z >= 1) { m.cast = null; return; }   // 떠서는 흙을 못 끌어온다
          const t = c.t - c.s.cast; begin(W, m, c); if (t > 0) place(W, m, c, Math.floor(t * rateOf(m) / volOf(c.s) + 1e-9), addWall);
        }
        if ((W.step + m.id) % 6 === 0 && W.walls.length) { const ws = W.walls, q = X.wallsIn(W, m.x - 3, m.y - 3, m.x + 3, m.y + 3); for (let i = 0; i < q.length; i++) { const w = ws[q[i]];
            if (w.grp >= 0 && !w.cage && hyp(w.x - m.x, w.y - m.y) < w.r + 1.2) { m.alog.wallT += 6 * W.dt; break; } } }   // 벽 곁에 있던 시간 (지표, 벽 격자)
      },
      speedLate(W, m, sp) { if (m.z < 1) for (const z of W.zones) if (z.k === 'pit' && hyp(z.x - m.x, z.y - m.y) < z.r) return sp * P.pit.speed; return sp; },   // 구덩이
    };
  },
  types: X => ({
    // 세우기가 끝났다: 남은 블록을 모두 (예비동작만으로 바로 방출하면 한꺼번에 선다)
    build(W, m, c) { if (m.z < 1) place(W, m, c, 1e9, X.addWall); },
    topple(W, m, c, a) {
      const s = c.s; let best = null, bd = P.topple.reach;
      for (const w of W.walls) { if (w.cage) continue; const d = hyp(w.x - c.tx, w.y - c.ty); if (d < bd) { bd = d; best = w; } }
      if (!best) return;
      const blocks = best.grp >= 0 ? W.walls.filter(w => w.grp === best.grp) : [best];
      const dx = c.tx - m.x, dy = c.ty - m.y, l = hyp(dx, dy) || 1, ux = dx / l, uy = dy / l;
      const hitQ = crushed(W, blocks, ux, uy);
      for (const w of blocks) w.hp = 0; m.mlog.razed += blocks.length;
      for (const q of hitQ) { X.hurt(W, q, s.dmg * a.g, q === m ? null : m, s.n, 'blunt'); X.eff(W, q, { root: s.root }, a.g); }
      if (hitQ.some(q => q.side !== m.side)) X.hit(m, s);
      if (W.rec) for (const w of blocks) W.fx.push(['b', w.x + ux, w.y + uy, 1.5]);
    },
  }),
  brainTypes: B => ({
    build(W, m, K, o) { o.v = 0; },    // 값은 두뇌 훅(value)이 매긴다 (총·둘레를 본다, 25장)
    topple(W, m, K, o) { o.v = 0; },
  }),
  brain: B => ({
    circles(W, q, c) { let n = 0; for (const z of W.zones) if (z.up && z.src === q) n++; return n ? Math.max(1, c - n) : c; },   // 버티는 벽은 서클 하나씩
    // 벽 밀기의 값 (누구나): 벽 무리마다 넘어뜨리면 깔릴 적 × 0.6(내 편이 깔리면 안 민다), 벽 없애기(대가, tac.wallBreak)면 × 2. 가장 큰 곳
    value(W, m, K, o) {
      const s = o.s; if (s.t !== 'topple' || !W.walls.length) return;
      const R = B.C.rangeOf(m, s) || s.R; let best = 0, bx = 0, by = 0; const seen = SEEN, near = NEAR, q0 = B.C.wallsIn(W, m.x - R, m.y - R, m.x + R, m.y + R);
      seen.clear(); near.length = 0; for (let i = 0; i < q0.length; i++) near.push(q0[i]);   // 미리 잡은 배열을 다시 쓴다 (v2.23.1)
      for (let i = 0; i < near.length; i++) {
        const w = W.walls[near[i]]; if (w.cage || (w.grp >= 0 && seen.has(w.grp)) || hyp(w.x - m.x, w.y - m.y) > R) continue; if (w.grp >= 0) seen.add(w.grp);
        const blocks = BLK; blocks.length = 0; if (w.grp >= 0) { for (const x of W.walls) if (x.grp === w.grp) blocks.push(x); } else blocks.push(w);
        const dx = w.x - m.x, dy = w.y - m.y, l = hyp(dx, dy) || 1, cr = crushed(W, blocks, dx / l, dy / l, CR);
        let foes = 0, mine = 0; for (let k = 0; k < cr.length; k++) { if (cr[k].side === m.side) mine++; else foes++; }
        if (mine) continue; const v = foes * 0.6 * (m.tac.wallBreak ? 2 : 1); if (v > best) { best = v; bx = w.x; by = w.y; }
      }
      if (best > 0) { o.v = best; o.tx = bx; o.ty = by; }
    },
    hideCast(W, q, c, m) { if (!m || q.z > 2 || m.z > 2 || !W.walls.length) return false;
      const ws = W.walls, a = B.C.wallsIn(W, Math.min(q.x, m.x) - 1.5, Math.min(q.y, m.y) - 1.5, Math.max(q.x, m.x) + 1.5, Math.max(q.y, m.y) + 1.5);
      for (let i = 0; i < a.length; i++) { const w = ws[a[i]]; if (!w.cage && segHit(q.x, q.y, m.x, m.y, w)) return true; } return false; },   // 벽 뒤의 예비동작은 안 보인다
    // 세우기의 시간: 블록이 모두 찰 때까지
    commit(W, m, K, best, cast) { if (best.s.t === 'build') cast.T = buildT(m, best.s); },
  }),
};
