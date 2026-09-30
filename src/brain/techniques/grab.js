'use strict';
/* 기술: 붙잡기 (대가부터, tac.grab, rules/risk가 부른다)
 * 내 큰 구름이 떨어지기 전 과녁이 그 안에 있으면, 두 번째 칸으로 그보다 먼저 닿는 굳히기·묶기·느리게 하기 × 3. 빈손이어도 두 번째 칸은 쓸 수 있다 */
const { hyp, holdsOf, castTime, landDelay } = require('../util');
function value(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.grab && K.slot === 'B' && holdsOf(s, e)) { const a = W.areas.find(a => a.src === m && a.s.big && hyp(a.x - e.x, a.y - e.y) < a.r + 0.3); if (a && castTime(W, m, o.Tw) + landDelay(s, K.d) < a.t) { o.v = Math.max(o.v, 0.5) * 3; } }
}
function commit(W, m, K, s) { const e = K.e; if (K.T.grab && K.slot === 'B' && holdsOf(s, e) && W.areas.some(a => a.src === m && a.s.big && hyp(a.x - e.x, a.y - e.y) < a.r + 0.3)) m.log.grab++; }
module.exports = { value, commit };
