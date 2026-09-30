'use strict';
/* 규칙: 소금 땅 (장면의 salt 사각형이 있을 때만, v2.0 둘째 묶음, SPEC 25장)
 * 소금은 마력을 끊는다(WORLD 148): 소금 땅 위에서 만들어지는 마법은 흩어진다(g = 0, 총은 그대로), 소금 땅 위에선 뜰 수 없다(rules/flight가 본다).
 * 소금 도시 장면: 싸움터 대부분이 소금 땅이고 광장만 맨땅이다 */
module.exports = {
  name: 'saltLand', on: W => W.salt.length > 0,
  engine: X => ({
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return X.onSalt(W, p[0], p[1]); },
  }),
  brain: B => ({
    // 소금 땅 위에 설 자리의 마법은 버린다 (흩어질 것을 쏘지 않는다)
    value(W, m, K, o) { const s = o.s; if (!(o.v > 0) || s.mundane) return; const k = s.t; const at = k === 'area' || k === 'zone' || k === 'trap' || k === 'thread' ? [o.tx, o.ty] : [m.x, m.y]; if (B.C.onSalt(W, at[0], at[1])) o.v = 0; },
  }),
};
