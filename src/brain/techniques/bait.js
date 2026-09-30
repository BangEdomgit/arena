'use strict';
/* 기술: 방어 미끼 (전설, tac.bait)
 * 위협이 없을 때 가끔 반응형 방패를 보란 듯이 든다. 그걸 보고 상대가 시전을 시작하면 가장 빠른 공격으로 벌한다(1.5 s 안). 엔진이 맞힌 것을 방어 적중으로 센다 */
const { landDelay } = require('../util');
function value(W, m, K, o) { if (K.T.bait && m.baitT != null && W.t - m.baitT < 1.5 && (K.e.cast || K.e.castB) && o.isOff) o.v *= 3 / (o.Tw + landDelay(o.s, K.d) + 0.2); }
// 고른 뒤: 미끼를 들지 (K.best를 방패로 바꾼다)
function start(W, m, K) {
  const { T, S, e, d, aimed, slot } = K;
  if (!(T.bait && !aimed && slot === 'A' && d > 4 && d < 10 && !(e.cast || e.castB) && (m.baitT == null || W.t - m.baitT > 4) && W.rng() < 0.05)) return;
  const x = m.book.map(k => S[k]).find(q => q && q.t === 'buff' && q.react && q.b.front && !((m.cd[q.n] || 0) > 0) && m.glu > q.cost);
  const bc = x && { s: x, n: x.n, v: 1, v2: 1, tx: m.x, ty: m.y, Tw: x.cast * (1 - 0.35 * (m.mast[x.n] || 0)), cost: x.cost };
  if (bc) { K.best = bc; m.baitT = W.t; m.baitDone = 0; }
}
module.exports = { value, start };
