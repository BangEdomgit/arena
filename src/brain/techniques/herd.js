'use strict';
/* 기술: 몰이 (대가, tac.herd)
 * 옆으로 움직이는 과녁의 한쪽을 선 지대로 막고, 도망칠 쪽에 함정을 두고, 공격을 그쪽으로 기울인다 (3 s) */
function value(W, m, K, o) {
  const e = K.e, s = o.s;
  if (!(K.T.herd && K.d < 9 && !K.eDown)) return;
  const lat = e.vx * -K.uy + e.vy * K.ux, sd = m.herd && W.t < m.herd.until ? m.herd.side : 0;
  if (s.t === 'zone' && s.z.shape === 'line' && s.z.dps && !sd) { const sg = lat > 0 ? 1 : lat < 0 ? -1 : m.sf; o.v = Math.max(o.v, 0.7); o.tx = e.x - K.uy * sg * 1.8; o.ty = e.y + K.ux * sg * 1.8; }
  if (sd && s.t === 'trap') { o.v = Math.max(o.v, 1.2); o.tx = e.x - K.uy * sd * 1.6; o.ty = e.y + K.ux * sd * 1.6; }
  if (sd && o.isOff && s.t !== 'thread') { o.tx += -K.uy * sd * 0.8; o.ty += K.ux * sd * 0.8; }
}
// 시전을 건 뒤: 선 지대를 깔았으면 몰 쪽을 정한다
function commit(W, m, K, s) {
  const e = K.e;
  if (K.T.herd && s.t === 'zone' && s.z.shape === 'line' && s.z.dps && !(m.herd && W.t < m.herd.until)) { const lat = e.vx * -K.uy + e.vy * K.ux; m.herd = { side: -(lat > 0 ? 1 : lat < 0 ? -1 : m.sf), until: W.t + 3 }; m.lureT = W.t; }
}
module.exports = { value, commit };
