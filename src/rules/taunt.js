'use strict';
/* 규칙: 도발 (rules.taunt, 1.4.0, SPEC 8장)
 * 마법 '도발'(틀 taunt)이 책에 남는다. 과녁이 예비동작(부름) 중이면 확률 g × (파도 위 1, 아니면 0.6)로 끊는다. 이단은 걸리지 않는다 */
module.exports = {
  name: 'taunt', on: W => W.rules.taunt, form: { taunt: 'target' },
  types: X => ({
    taunt(W, m, c, a) {
      const { hyp, hit } = X, g = a.g, tx = c.tx, ty = c.ty;
      let e = c.tgt && c.tgt.hp > 0 ? c.tgt : null; if (!e) for (const q of a.foes) if (hyp(q.x - tx, q.y - ty) < 1) { e = q; break; }
      if (!e || e.type === '이단' || !(e.cast || e.castB)) return;
      if (W.rng() < g * (e.wave ? 1 : 0.6)) { e.cast = e.castB = null; e.fat += 8; if (e.wave) e.st.stun = Math.max(e.st.stun || 0, 0.3); e.log.taunted++; hit(m, c.s); if (W.rec) W.fx.push(['z', m.x, m.y, e.x, e.y]); }
    },
  }),
  // 두뇌: 끊을 부름의 값 × 끊길 확률
  brainTypes: B => ({
    taunt(W, m, K, o) { const e = K.e, c = e.cast || e.castB; if (c && e.type !== '이단' && K.d < o.R && c.T - c.t > o.Tw + 0.05) o.v = o.he * B.estDmg(c.s) * (e.wave ? 1 : 0.6) / (o.Tw + 0.3) * (e.wave ? 1.3 : 1); },
  }),
};
