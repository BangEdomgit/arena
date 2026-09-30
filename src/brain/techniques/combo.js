'use strict';
/* 기술: 콤보 (중급 tac.combo: 묶인 적을 보이는 대로 잇는다, 상급 tac.combo2: 두 수 콤보 계획)
 * 두 수 계획: 묶기를 쏘면 묶인 동안 떨어질 결정타를 예약하고, 그 자리를 비워 둔다. 묶기가 빗나가면(tac.cancel) 계획을 버린다 */
const { hyp, OFF, isSetup, landDelay, bindOf, estDmg } = require('../util');
// 판단 첫머리: 묶기가 빗나갔으면 계획을 버린다
function drop(W, m, K) { const e = K.e; if (K.T.cancel && m.combo && m.combo.tgt === e && W.t > m.combo.land + 0.15 && !(e.st.root > 0 || e.st.stun > 0)) m.combo = null; }
// 지금 계획 (없으면 null)
function planOf(W, m, K) { return K.T.combo2 && m.combo && m.combo.tgt === K.e && W.t < m.combo.until ? m.combo : null; }
function value(W, m, K, o) {
  const plan = K.plan; if (!(plan && o.isOff)) return;
  const e = K.e;
  if (o.n === plan.fin) { const left = Math.max(e.st.root || 0, e.st.stun || 0); if (left > o.Tw + landDelay(o.s, K.d)) { o.v = Math.max(o.v, 0.6) * 3; o.tx = e.x; o.ty = e.y; } else o.v = 0; }   // 묶였고 묶인 동안 닿을 때만
  else if (!isSetup(o.s) && W.t < plan.land + plan.bind) o.v *= 0.3;   // 결정타 자리를 비워 둔다
}
// 시전을 건 뒤: 콤보 시도 세기
function tried(W, m, K, best, Tc) {
  const { e, plan, cb } = K, s = best.s;
  const intent = OFF[s.t] && ((best.down || (cb && e.st.wet > 0 && s.t === 'thread')) || (plan && s.n === plan.fin));
  if (intent) { const kind = plan && s.n === plan.fin ? 'plan' : 'react'; m.log.comboTry++; m.log.cTry[kind] = (m.log.cTry[kind] || 0) + 1; m.comboPend = { tgt: e, kind, until: W.t + Tc + landDelay(s, hyp(best.tx - m.x, best.ty - m.y)) + 0.6 }; if (plan) m.combo = null; }
  if (m.combo && m.combo.tgt === e && !m.combo.logged) { m.combo.logged = 1; m.log.cPlan = (m.log.cPlan || 0) + 1; }
}
// 두 수 콤보를 여는 묶기를 쏘면 결정타를 예약한다 (묶기가 떨어질 때와 묶이는 시간)
function plan(W, m, K, s, Tc) {
  const { S, T, e, d } = K;
  const bind = T.combo2 && OFF[s.t] ? bindOf(s, e) : 0;
  if (bind >= 0.3) {
    const fin = m.book.filter(k => S[k] && OFF[S[k].t] && k !== s.n && !bindOf(S[k], e)).sort((a, b) => estDmg(S[b]) - estDmg(S[a]))[0];
    if (fin) { m.combo = { tgt: e, fin, land: W.t + Tc + landDelay(s, d), bind, until: W.t + Tc + 3 }; m.thinkT = Math.min(m.thinkT, m.combo.land - W.t + 0.04); }   // 묶기가 떨어지는 순간에 맞춰 다시 판단한다
  }
}
module.exports = { drop, planOf, value, tried, plan };
