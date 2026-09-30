'use strict';
/* 기술: 유도 (대가, tac.lure)와 약한 척 물러서기 (전설, tac.fakeRetreat)
 * 다가오는 적을 내 함정·화약통 너머로(물러서기는 내 지대 너머로도) 끌어들인다. 끌어들인 적이 밟으면 lure로 센다(엔진) */
const { hyp } = require('../util');
function steer(W, m, K) {
  const { T, stance, vt, d, e } = K;
  if (!((T.lure || T.fakeRetreat) && stance === 'normal' && vt > 0.3 && d < 10)) return;
  const pts = [];
  if (T.lure) { for (const t of W.traps) if (t.src === m && t.arm <= 0) pts.push([t.x, t.y, 2]); for (const b of W.barrels) if (!b.ex) pts.push([b.x, b.y, 3.4]); }
  if (T.fakeRetreat) for (const z of W.zones) if (z.src === m && z.dps && z.t > 1) pts.push([z.x, z.y, (z.r || (z.len || 2) / 2) + 1]);
  let P = null, bd3 = 8; for (const [px, py, off] of pts) { const ex = px - e.x, ey = py - e.y, el = hyp(ex, ey) || 1, qx = px + ex / el * off, qy = py + ey / el * off, dq = hyp(qx - m.x, qy - m.y); if (dq < bd3 && hyp(px - e.x, py - e.y) < d + 2) { bd3 = dq; P = [qx, qy]; } }
  if (P) { const l = hyp(P[0] - m.x, P[1] - m.y) || 1; K.vx = (P[0] - m.x) / l * 2.5; K.vy = (P[1] - m.y) / l * 2.5; m.lureT = W.t; }
}
module.exports = { steer };
