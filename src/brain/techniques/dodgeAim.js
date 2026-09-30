'use strict';
/* 기술: 피할 자리 겨냥 (상급부터, tac.dodgeAim, rules/risk가 부른다)
 * 큰 구름은 과녁이 구를 수 있으면 구를 쪽으로 1.1 m 기울인다. 구를 쪽은 막힌 쪽의 반대, 아니면 본 버릇(학습 기록), 모르면 오른쪽 */
const { rollSide } = require('../util');
function value(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.dodgeAim && s.big && s.t === 'area' && e.rollCd <= 0 && e.stam > 1.5 && !K.eDown && !(e.st.mycel > 0 || e.st.cramp > 0)) { const sd = rollSide(W, e, K.ux, K.uy, K.mem); o.tx += -K.uy * sd * 1.1; o.ty += K.ux * sd * 1.1; }
}
module.exports = { value };
