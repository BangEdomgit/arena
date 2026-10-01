'use strict';
/* 기술: 박자 (초보 tac.pause, 상급 tac.tempo)
 * 쏜 뒤 멈춤(초보): 쏘고 나서 정해진 시간(사람마다 한 번 정한 박자) 동안 다음을 고르지 않는다.
 * 박자 흔들기(상급): 가끔 한 박 쉬었다 쏜다 (빈틈으로 세지 않는다). 날카롭게(대가부터)는 초당으로, 몰아칠 때·빈틈엔 쉬지 않는다 */
// 날카롭게(대가부터, v2.7): 판단이 잦을수록 한 번의 확률을 줄여 초당 같게(상급 0.13 s 기준). 몰아칠 때(작전 압박·끝내기)와 과녁의 빈틈엔 쉬지 않는다
// (예전엔 판단마다 20%라 0.05 s마다 판단하는 전설이 사거리 안 시간의 35%를 쉬었다)
const sharpNo = (W, m, K) => (m.op && (m.op.cur === 'press' || m.op.cur === 'finish')) || K.e.st.stun > 0 || K.e.st.root > 0 || K.e.crash > 0 || K.e.emptyT > W.t;
function pause(W, m) { return !!(m.pauseLen && W.t - m.lastRel < m.pauseLen); }
function hold(W, m, K) {
  if (m.hold) { if (W.t < m.hold) return true; m.hold = 0; }
  else if (K.T.tempo && K.slot === 'A' && !K.aimed && !(K.T.sharp && m.C >= 5 && sharpNo(W, m, K)) && W.rng() < (K.T.sharp && m.C >= 5 ? 0.2 * m.dec / 0.13 : 0.2)) { m.hold = W.t + W.rnd(0.1, 0.35); m.relT = null; return true; }
  return false;
}
module.exports = { pause, hold };
