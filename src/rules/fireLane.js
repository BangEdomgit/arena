'use strict';
/* 규칙: 사선 (rules.fireLane, v2.30, SPEC 53장, 수는 data/rules/fireLane.json) — 기본 꺼짐
 * 총은 쏘기 전에 사선을 본다: 쏘는 자리에서 과녁 너머 사거리 끝까지, 총의 흔들림(0.004 + 0.0004 × 거리 rad)이 벌어지는 띠 안에
 *   우리 편이 서 있으면(높이 차 1.2 m 안) 쏘지 않는다. 빗나간 총알은 사거리 끝까지 날아가니 과녁 너머도 본다
 * 화승이 타는 동안 우리 편이 사선에 들어오면 방아쇠를 늦춘다(wait s까지, 넘으면 시전을 거둔다: 장전은 쏠 때만 돈다)
 * 막혔으면 옆으로 비켜 사선을 연다(과녁 쪽에 직각, 막은 사람의 반대쪽). 열리면 다시 쏜다 */
const P = require('../../data/rules/fireLane.json'), AR = require('../../data/rules/army.json');
const BL = new WeakMap();   // 사람 → { t: 막힌 걸 본 시각, sx: 비킬 쪽 }
const HOLD = new WeakMap();   // 시전 → 늦춘 시간
const mark = (W, m, k) => { let b = BL.get(m); if (!b) BL.set(m, b = { t: 0, sx: 0 }); b.t = W.t; b.sx = -k; };
// 사선을 막은 우리 편: 막은 사람이 과녁 쪽 기준 어느 옆에 섰는지(+1·−1), 없으면 0
function lane(W, m, tx, ty, R) {
  const dx = tx - m.x, dy = ty - m.y, d = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / d, uy = dy / d, ang = (AR.musket.aimN + AR.musket.aimD * d) * m._nm * (m.st.blind > 0 ? 3 : 1);   // 흔들림은 core와 같은 셈
  for (const q of W.ms) { if (q === m || q.side !== m.side || !(q.hp > 0) || q.z - m.z > 1.2 || m.z - q.z > 1.2) continue;
    const rx = q.x - m.x, ry = q.y - m.y, t = rx * ux + ry * uy; if (t < -q.r - P.pad || t > R) continue;   // 붙어 선 사람은 총구에서 바로 맞는다
    const s = rx * -uy + ry * ux, w = q.r + P.pad + ang * t * P.k; if (s < w && s > -w) return s >= 0 ? 1 : -1; }
  return 0;
}
module.exports = {
  name: 'fireLane', switch: 'fireLane', api: { P, lane },
  engine: X => ({
    mageStep(W, m) {
      const c = m.cast; if (!c || !c.s.mundane || c.s.t !== 'proj' || c.t + W.dt < c.T) return;
      const q = c.tgt && c.tgt.hp > 0 ? c.tgt : null, R = X.rangeOf(m, c.s); let k = lane(W, m, c.tx, c.ty, R);
      if (!k && q) { const f = X.hyp(q.x - m.x, q.y - m.y) / c.s.v; k = lane(W, m, q.x, q.y, R) || lane(W, m, q.x + q.vx * f, q.y + q.vy * f, R); }   // 지금 자리와 앞질러 겨눌 자리 (rules/gunfire)
      if (!k) return;
      mark(W, m, k); const h = (HOLD.get(c) || 0) + W.dt; if (h > P.wait) { m.cast = null; return; }
      HOLD.set(c, h); c.T += W.dt;   // 방아쇠를 늦춘다
    },
  }),
  brain: B => ({
    valueLate(W, m, K, o) {
      const s = o.s; if (!s.mundane || s.t !== 'proj' || !(o.v > 0)) return;
      const k = lane(W, m, o.tx, o.ty, B.C.rangeOf(m, s)); if (!k) return;
      o.v = 0; mark(W, m, k);
    },
    steer(W, m, K) {
      const b = BL.get(m); if (!b || W.t - b.t > P.hold || K.dodge || m.flee) return;
      K.vx += -K.uy * b.sx * P.side; K.vy += K.ux * b.sx * P.side;   // 막은 사람의 반대쪽으로 비킨다
    },
  }),
};
