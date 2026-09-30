'use strict';
/* 기술: 동시 착탄 (대가 tac.simul, 전설 tac.triple)
 * 지연 폭발 결정타를 먼저 걸어 두고, 묶기(실)가 그 직전에 떨어지게 기다린다. 전설은 두 번째 칸에 지연 폭발 하나를 더 겹친다.
 * 같은 사람의 다른 마법이 0.2 s 안에 같은 과녁에 닿으면 엔진이 simul로 센다 */
const { OFF, estDmg, bindOf, C } = require('../util');
// 기다리는 중이면 true (다른 것을 시작하지 않는다. 계획해 기다리는 것은 빈틈이 아니다)
function wait(W, m, K) {
  const e = K.e, sim = m.simul && m.simul.tgt === e && W.t < m.simul.until ? m.simul : null; if (m.simul && !sim) m.simul = null;
  K.sim = sim;
  if (sim && !sim.fired && W.t < sim.at - 0.02 && !(sim.b2 && K.slot === 'B' && W.t >= sim.b2at)) { m.thinkT = Math.min(m.thinkT, sim.at - W.t); m.relT = null; return true; }
  return false;
}
function value(W, m, K, o) {
  const sim = K.sim; if (!sim) return;
  const e = K.e, s = o.s;
  if (!sim.fired && o.n === sim.bind && W.t >= sim.at - 0.02) { const tt = o.Tw + K.d / (32 * (s.fast || 1)); o.v = 50; o.tx = e.x + e.vx * tt; o.ty = e.y + e.vy * tt; }
  else if (sim.b2 && o.n === sim.b2 && K.slot === 'B') { o.v = 40; o.tx = sim.x; o.ty = sim.y; }
  else if (o.isOff) o.v *= 0.2;
}
// 고른 뒤: 동시 착탄을 시작할지 (K.best를 결정타로 바꾼다)
function start(W, m, K) {
  const { T, S, e, d, los, eDown, slot, circ, cand } = K, best = K.best;
  if (!(T.simul && !m.simul && slot === 'A' && !eDown && best && OFF[best.s.t])) return;
  const A2 = cand.filter(c => c.s.t === 'area' && c.s.delay >= 0.3 && !bindOf(c.s, e) && !c.s.big).sort((a, b) => estDmg(b.s) - estDmg(a.s))[0];
  // 큰 수는 동시 착탄의 묶기·결정타로 쓰지 않는다: 모으다 끊기면 역류하고, 짝 계획의 '굳은 과녁에만'을 뒷문으로 연다 (1.10.0)
  const bd = m.book.map(k => S[k]).filter(x => x && x.t === 'thread' && !x.big && bindOf(x, e) >= 0.3 && !((m.cd[x.n] || 0) > 0) && d < C.rangeOf(m, x) && los)[0];
  if (!(A2 && bd)) return;
  const TcA = A2.Tw * (W.rules.fatigue ? 1 + Math.min(m.fat, 100) / 200 : 1), TwB = bd.cast * (1 - 0.35 * (m.mast[bd.n] || 0));
  // 결정타는 묶기가 떨어질 때 과녁이 있을 자리에: 지금 속도로 그때까지 간 자리
  const tl = TcA + A2.s.delay - 0.1; K.best = A2; A2.tx = e.x + e.vx * tl; A2.ty = e.y + e.vy * tl;
  m.simul = { tgt: e, a: A2.n, bind: bd.n, at: W.t + tl - TwB - d / (32 * (bd.fast || 1)), until: W.t + TcA + A2.s.delay + 0.5, x: A2.tx, y: A2.ty };
  if (T.triple && circ >= 2) { const A3 = cand.filter(c => c !== A2 && c.s.t === 'area' && c.s.delay > 0).sort((a, b) => estDmg(b.s) - estDmg(a.s))[0]; if (A3) { m.simul.b2 = A3.n; m.simul.b2at = W.t + TcA + A2.s.delay - A3.Tw - A3.s.delay; } }
}
// 시전을 건 뒤: 묶기를 쐈다
function fired(W, m, K, s, Tc) { if (m.simul && s.n === m.simul.bind) { m.simul.fired = 1; m.log.comboTry++; m.log.cTry.simul = (m.log.cTry.simul || 0) + 1; m.comboPend = { tgt: K.e, kind: 'simul', until: W.t + Tc + 0.8 }; } }
module.exports = { wait, value, start, fired };
