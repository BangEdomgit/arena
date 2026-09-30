'use strict';
/* 기술: 판 중 학습 (전설, tac.learn)
 * 과녁이 구르는 쪽과 방패를 드는 거리를 센다. 구를 쪽으로 겨냥을 옮기고(믿음은 본 수만큼), 방패 거리 근처면 투사체·실을 덜 쓴다.
 * 구르는 쪽 기록은 피할 자리 겨냥(rules/risk의 tac.dodgeAim)도 쓴다: 그 훅이 K.wantMem을 켠다 */
const { hyp } = require('../util');
// 읽기 (과녁을 고른 뒤): 기록을 쌓는다
function mem(W, m, K) {
  const T = K.T, e = K.e;
  if (!(T.learn || K.wantMem)) return null;
  const mem = m.mem[e.id] || (m.mem[e.id] = { L: 0, R: 0, rollT: -9, sh: [], shT: -9 });
  const dx = e.x - m.x, dy = e.y - m.y;
  if (e.roll > 0 && W.t - mem.rollT > 0.3) { if (dx * e.vy - dy * e.vx > 0) mem.L++; else mem.R++; mem.rollT = W.t; }
  if (e.buf.front && W.t - mem.shT > 0.6) { mem.sh.push(hyp(dx, dy)); if (mem.sh.length > 8) mem.sh.shift(); mem.shT = W.t; }
  return mem;
}
// 고르기 전에: 옮길 겨냥과 방패 거리
function prep(W, m, K) {
  const { T, mem, e, d, De } = K;
  K.roll = T.learn && mem && e.rollCd <= 0 ? (mem.L - mem.R) / (mem.L + mem.R + 2) * 1.2 : 0;
  K.shieldNear = T.learn && mem && mem.sh.length >= 2 && Math.abs(d - mem.sh.reduce((a, b) => a + b, 0) / mem.sh.length) < 2.5 && De.front.some(n => !((e.cd[n] || 0) > 0));
}
function value(W, m, K, o) {
  const s = o.s;
  if (K.roll && (m.tac.learnAim === 'wide' ? s.t === 'area' || s.t === 'lob' : s.t === 'proj' || s.t === 'thread')) { const k = m.tac.learnAim === 'wide' ? 0.5 : 1; o.tx += -K.uy * K.roll * k; o.ty += K.ux * K.roll * k; }   // 'wide'(v2.0): 넓은 마법만 반쯤 옮긴다(안 구르면 여전히 맞는다)
  if (K.shieldNear) { if (s.t === 'proj' || s.t === 'thread') o.v *= 0.7; else if (s.t === 'area' || s.t === 'lob') o.v *= 1.25; }
}
module.exports = { mem, prep, value };
