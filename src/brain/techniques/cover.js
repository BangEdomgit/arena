'use strict';
/* 기술: 엄폐 (상급, tac.cover)와 엄폐 걷어내기 (대가, tac.strip)
 * 엄폐: 과녁에서 보아 바위 뒤, 내 사거리 안의 자리로 간다. 걷어내기: 과녁이 바위 뒤에 숨었으면 불·산 지대를 그 자리에, 지연 폭발·곡사를 더 쓴다 */
const { hyp, maxRange } = require('../util');
// 움직임: 엄폐로 가는가
function steer(W, m, K) {
  const { T, los, e, S } = K;
  if (!(T.cover && los)) return false;
  let best = null, bd2 = 6;
  for (const o of W.obs) { const ox = o.x - e.x, oy = o.y - e.y, ol = hyp(ox, oy) || 1, px = o.x + ox / ol * (o.r + 0.7), py = o.y + oy / ol * (o.r + 0.7), de = hyp(px - e.x, py - e.y), dm = hyp(px - m.x, py - m.y); if (dm < bd2 && de > 3 && de < maxRange(m, S) && px > 1 && py > 1 && px < W.width - 1 && py < W.height - 1) { bd2 = dm; best = [px, py]; } }
  if (!best) return false;
  const l = hyp(best[0] - m.x, best[1] - m.y) || 1; K.vx += (best[0] - m.x) / l * T.coverW; K.vy += (best[1] - m.y) / l * T.coverW;
  return true;
}
function strip(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.strip && !K.los && W.obs.some(b => hyp(b.x - e.x, b.y - e.y) < b.r + 1.5)) { if (s.t === 'zone' && (s.z.k === 'fire' || s.z.k === 'acid')) { o.v = Math.max(o.v, 0.9); o.tx = e.x; o.ty = e.y; } else if (s.t === 'area' || s.t === 'lob') o.v *= 1.5; }
}
module.exports = { steer, strip };
