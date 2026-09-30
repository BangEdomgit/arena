'use strict';
/* 기술: 덱 읽기 (전설, tac.counter)
 * 상대 책의 피해 종류를 읽어 천적(절연·둔기 막이·해독, 불에는 비·안개)을 먼저 쓴다. 상대가 그 종류를 부르는 중이면 먼저, 아니면 한가할 때 조금 */
const { counters, kindOf } = require('../util');
function value(W, m, K, o) {
  const s = o.s, e = K.e;
  if (K.T.counter && K.d < 14 && counters(s, K.ek, m, W)) { const hot = [e.cast, e.castB].some(c => c && kindOf(c.s) && counters(s, { [kindOf(c.s)]: 1 }, m, W)); const vc = hot ? 0.9 : 0; if (o.v < vc) { o.v = vc; if (s.t === 'buff' || (s.z && s.z.k === 'rain')) { o.tx = m.x; o.ty = m.y; } } }
}
module.exports = { value };
