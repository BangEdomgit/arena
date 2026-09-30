'use strict';
/* 기술: 속임수 (대가 0.08, 전설 0.12, tac.feint = 확률)
 * 상대가 자동 진이나 구르기로 반응할 수 있으면, 가끔 가장 큰 예비동작을 먼저 보인다. 상대가 반응했으면 끊고 다른 마법으로, 반응이 없으면 진짜로 쏜다 */
const { OFF, estDmg, circOf } = require('../util');
// 판단 첫머리: 보인 예비동작에 상대가 반응했는가
function react(W, m, K) {
  if (!(m.cast && m.cast.feint)) return;
  const e = K.e, c = m.cast, f = c.feint, reacted = (e.roll > 0 && !f.roll) || (e.buf.front && !f.front) || e.autoCd > f.auto || W.walls.filter(w => w.own === e.side).length > f.walls;
  if (reacted) { m.cast = null; m.glu += c.cost * 0.7; m.cd[c.s.n] = Math.min(m.cd[c.s.n] || 0, 1); m.log.dec.feint = (m.log.dec.feint || 0) + 1; }
  else if (c.T - c.t < 0.1) c.feint = null;   // 반응이 없으면 진짜로 쏜다
}
// 고른 뒤: 속임수로 바꿀지 (K.best를 바꾸고 속임수 기록을 돌려준다)
function start(W, m, K) {
  const { T, S, e, slot, cand } = K, best = K.best;
  if (!(T.feint && !m.simul && best.s.t !== 'buff' && slot === 'A' && ((e.rollCd <= 0 && e.stam > 1.5) || e.autoDodge || (circOf(W, e) >= 3 && e.book.some(n => S[n] && ((S[n].t === 'buff' && S[n].react) || S[n].t === 'wall')))) && W.rng() < (T.feint === true ? 0.2 : T.feint))) return null;
  const big = cand.filter(c => OFF[c.s.t]).sort((a, b) => estDmg(b.s) - estDmg(a.s) || b.Tw - a.Tw)[0];
  if (!big) return null;
  K.best = big; return { roll: e.roll > 0, front: !!e.buf.front, auto: e.autoCd, walls: W.walls.filter(w => w.own === e.side).length };
}
module.exports = { react, start };
