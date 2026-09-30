'use strict';
/* 기술: 캔슬 (상급 tac.cancel, 대가 tac.cancel2)
 * 캔슬: 쏘는 중에 과녁이 구르기 시작했거나, 계획한 콤보의 묶기가 빗나갔으면 끊는다. 기회 캔슬: 과녁이 묶였는데 지금 시전이 그 틈에 맞지 않으면 끊고 결정타로.
 * 끊으면 당의 70%를 돌려받고, 그 마법의 간격은 0.5 s로 줄인다 */
const { OFF } = require('../util');
function undo(m, c) { m.cast = null; m.glu += (c.cost || 0) * 0.7; m.cd[c.s.n] = Math.min(m.cd[c.s.n] || 0, 0.5); m.log.cancel++; }
function opportunity(W, m, K) {
  if (K.T.cancel2 && m.cast && !m.cast.feint && !m.cast.down && OFF[m.cast.s.t] && K.eDown && m.cast.T - m.cast.t > 0.1 && !(m.simul && m.simul.a === m.cast.s.n)) undo(m, m.cast);
}
function onDodge(W, m, K) {
  const e = K.e;
  if (K.T.cancel && m.cast && !m.cast.feint && OFF[m.cast.s.t] && m.cast.tgt === e && m.cast.T - m.cast.t > 0.08) {
    const c = m.cast, missed = m.combo === null && c.fin && !(e.st.root > 0 || e.st.stun > 0) && W.t > c.fin;
    if ((e.roll > 0 && !c.roll0) || missed) undo(m, c);
  }
}
module.exports = { undo, opportunity, onDodge };
