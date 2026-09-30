'use strict';
/* 기술: 지형 설계와 칸의 역할 (v2.2, SPEC 26장, 대가부터)
 * 선명도 5 이상(상위·대마법사)만 쓴다.
 * 지형 설계(tac.shape):
 *   내 엄폐: 빠지는 중이거나 나를 겨눈 실·투사체가 보이면 벽(1.5 s 안에 서는 것)을 나와 상대 사이에 (값 1)
 *   몰이 자리: 들어가는 중에 상대가 물러나면(다가오는 속도 < −1 m/s) 그 도망 길(상대 너머 3 m + 0.5 s 움직임)에 빙판·지대·함정·가두는 기둥·벽을 (값 0.9)
 *   상대의 엄폐 없애기: 상대가 벽·바위 뒤(시야 없음)면 물·산·곡사 × 1.5 (벽 밀기의 값은 rules/bulwark가 매긴다)
 * 칸의 역할(tac.roles): 서클이 셋 이상이면 두 번째 칸 = 지형·방어 칸(지형 × 1.5, 겨눠지면 방어 × 1.3), 자동 진 = 방어, 첫 칸 = 공격.
 *   들어가기(리듬)에선 두 번째 칸도 공격한다 */
const { hyp } = require('../util');
const TERR = { wall: 1, trap: 1, cage: 1 };
function value(W, m, K, o) {
  const T = m.tac, s = o.s, e = K.e; if (m.C < 5) return;   // 선명도 5 이상(상위·대마법사)만
  if (T.shape) {
    const terr = TERR[s.t] || (s.t === 'zone' && s.z && (s.z.k === 'ice' || s.z.k === 'fire' || s.z.k === 'acid' || s.z.k === 'spore' || s.z.k === 'nh3'));
    if (s.t === 'wall' && (m.phase === 'out' || (K.aimed && K.threat && (K.threat.s.t === 'thread' || K.threat.s.t === 'proj')))) { o.v = Math.max(o.v, 1); o.tx = e.x; o.ty = e.y; }
    else if (terr && m.phase === 'in' && K.vt < -1 && K.d < 14) { const l = K.d || 1, tx = e.x + (e.x - m.x) / l * 3 + e.vx * 0.5, ty = e.y + (e.y - m.y) / l * 3 + e.vy * 0.5; o.v = Math.max(o.v, 0.9); o.tx = tx; o.ty = ty; m._shT = W.t; }
    if (!K.los && (s.el === '물' || s.t === 'lob' || (s.t === 'zone' && s.z && s.z.k === 'acid'))) o.v *= 1.5;
  }
  if (T.roles && K.slot === 'B' && K.circ >= 3) { if (TERR[s.t] || s.t === 'zone' || s.t === 'build') o.v *= 1.5; else if (!o.isOff && K.aimed) o.v *= 1.3; }
}
module.exports = { value };
