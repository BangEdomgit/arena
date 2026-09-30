'use strict';
/* 기술: 성 (tac.siege, 모두, v2.0 둘째 묶음 SPEC 25장) — 선명도 5 이상이 다섯 넘는 적이나 총 둘 이상을 상대할 때만
 * 총(머스킷 등 총이 든 적, 110 m 안)이 있으면:
 *   날고 있으면 가장 가까운 총에서 62 m 쯤(총은 50 m 넘게 멀리 뜬 과녁을 쏘지 않는다, rules/army)에서 구름·곡사로 깎는다
 *   땅이면 먼저 벽(흙벽 3 s, 총 쪽으로)을 세우고, 총 대부분이 장전 중일 때 벽 옆으로 나와 치고, 장전이 끝나 가면 벽 뒤로
 * 벽 밀기: 벽 너머에 적이 있으면(깔리는 적 × 0.6)
 * 벽 자리(상급부터, tac.wallSite): 세울 자리 5 m 안에 적이 있으면 세우지 않는다(적의 엄폐가 된다)
 * 벽 없애기(대가부터, tac.wallBreak): 적이 벽 뒤에 숨었으면 그 벽을 미는 값 × 2, 물·산·큰 바위 × 2
 * 머리: 적이 다섯 넘으면 피로 88 넘어서는 공격하지 않는다(무리 앞에서 파도를 타면 제 몸을 태운다)
 * 물러나기(상급부터, tac.retreat): 체력 35% 아래에서 적이 다섯 넘거나 총이 셋 넘으면 싸우지 않는다: 높이 떠(15 m) 사거리 밖으로(m.retreat, rules/flight가 본다) */
const { C, hyp } = require('../util');
function guns(W, m) { let n = 0; for (const q of W.foes[m.side]) if (!q.flee && q._gun && hyp(q.x - m.x, q.y - m.y) < 110) n++; return n; }
function on(W, m, K) { if (!(m.tac.siege && m.C >= 5 && W.rules.army)) return 0; for (const q of K.foes) if (q._gun === undefined) q._gun = q.book.some(n => { const s = K.S[n]; return s && s.mundane && s.t === 'proj'; }); const g = guns(W, m); return g >= 2 || K.foes.length > 5 ? 1 + g : 0; }
// 나와 총들 사이에 벽이 있는가 (내 곁 2 m 안의 벽)
function covered(W, m, gx, gy) { for (const w of W.walls) { if (w.cage || hyp(w.x - m.x, w.y - m.y) > 2) continue; const dx = gx - m.x, dy = gy - m.y, l = hyp(dx, dy) || 1; if (((w.x - m.x) * dx + (w.y - m.y) * dy) / l > 0) return true; } return false; }
function centroid(W, m) { let x = 0, y = 0, n = 0; for (const q of W.foes[m.side]) if (q._gun && !q.flee && hyp(q.x - m.x, q.y - m.y) < 110) { x += q.x; y += q.y; n++; } return n ? [x / n, y / n] : null; }
function steer(W, m, K) {
  const k = on(W, m, K); m.retreat = 0; if (!k) return;
  const T = m.tac;
  if (T.retreat && m.hp < 0.35 * m.hpMax && (K.foes.length > 5 || k - 1 > 3)) { m.retreat = 1; let rx = 0, ry = 0; for (const q of K.foes) { const dx = m.x - q.x, dy = m.y - q.y, l = hyp(dx, dy) || 1; rx += dx / l; ry += dy / l; } K.vx = rx; K.vy = ry; return; }
  if (k - 1 < 2) return;   // 총이 둘 넘지 않으면 예전 그대로
  const c = centroid(W, m); if (!c) return;
  let near = null, nd = 1e9; for (const q of W.foes[m.side]) if (q._gun && !q.flee) { const d = hyp(q.x - m.x, q.y - m.y); if (d < nd) { nd = d; near = q; } }
  if (m.z >= 1 && near) { const d = nd || 1, ux = (near.x - m.x) / d, uy = (near.y - m.y) / d, want = d - 62; K.vx = ux * (want > 3 ? 1 : want < -3 ? -1.5 : 0) - uy * m.sf * 0.6; K.vy = uy * (want > 3 ? 1 : want < -3 ? -1.5 : 0) + ux * m.sf * 0.6; return; }
  // 땅: 벽 뒤에 있다가 장전 틈에 나온다
  if (!covered(W, m, c[0], c[1])) return;
  let ready = 0, all = 0; for (const q of W.foes[m.side]) if (q._gun && !q.flee && hyp(q.x - m.x, q.y - m.y) < 110) { all++; if (!((q.cd['머스킷'] || 0) > 2.5)) ready++; }
  const dx = c[0] - m.x, dy = c[1] - m.y, l = hyp(dx, dy) || 1;
  if (ready / all > 0.3) { K.vx = -dx / l * 0.5; K.vy = -dy / l * 0.5; }   // 벽 뒤에 붙는다
  else { K.vx = -dy / l * m.sf * 2; K.vy = dx / l * m.sf * 2; }            // 옆으로 나와 친다
}
function value(W, m, K, o) {
  const s = o.s, k = on(W, m, K); if (!k) return;
  const T = m.tac, g = k - 1;
  if (m.retreat && o.isOff) { o.v *= 0.3; return; }
  if (o.isOff && m.fat > 88 && !m.wave && K.foes.length > 5) { o.v = 0; return; }   // 무리 앞에서 머리가 넘치면(파도) 제 몸을 태운다: 문턱 앞에서 공격을 쉰다
  if (s.t === 'build') {
    if (m.z >= 1 || g < 2) return;
    const c = centroid(W, m); if (!c || covered(W, m, c[0], c[1])) return;
    const B = W.mods.find(r => r.name === 'bulwark'); if (!B || B.api.buildT(m, s) > 20) return;
    if (s.shape === 'ring' && !(K.foes.length > 12 && g > 8)) return;
    o.tx = c[0]; o.ty = c[1];
    if (T.wallSite) { const d = hyp(c[0] - m.x, c[1] - m.y) || 1, wx = m.x + (c[0] - m.x) / d * 1.3, wy = m.y + (c[1] - m.y) / d * 1.3; for (const q of K.foes) if (hyp(q.x - wx, q.y - wy) < 5) return; }
    o.v = s.shape === 'ring' ? 15 : 20;   // 총 앞 땅에선 먼저 벽 (어떤 공격보다 먼저)
  }
  if (s.t === 'topple') {
    const B = W.mods.find(r => r.name === 'bulwark'); if (!B) return;
    const R = C.rangeOf(m, s) || s.R; let best = 0, bx = 0, by = 0; const seen = {};
    for (const w of W.walls) {
      if (w.cage || seen[w.grp] || hyp(w.x - m.x, w.y - m.y) > R) continue; if (w.grp >= 0) seen[w.grp] = 1;
      const blocks = w.grp >= 0 ? W.walls.filter(x => x.grp === w.grp) : [w], dx = w.x - m.x, dy = w.y - m.y, l = hyp(dx, dy) || 1;
      let foes = 0, mine = 0; for (const q of B.api.crushed(W, blocks, dx / l, dy / l)) { if (q.side === m.side) mine++; else foes++; }
      if (mine) continue; const v = foes * 0.6 * (T.wallBreak ? 2 : 1); if (v > best) { best = v; bx = w.x; by = w.y; }
    }
    if (best > 0) { o.v = best; o.tx = bx; o.ty = by; }
  }
  if (T.wallBreak && !K.los && W.walls.some(w => hyp(w.x - K.e.x, w.y - K.e.y) < 3) && (s.el === '물' || (s.hit && s.hit.flat >= 60) || (s.t === 'zone' && s.z.k === 'acid'))) o.v *= 2;
}
module.exports = { on, steer, value };
