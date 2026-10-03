'use strict';
/* 규칙: 막힘 풀기 (rules.unstuck, v2.30, SPEC 53장, 수는 data/rules/unstuck.json) — 기본 꺼짐
 * 땅에 붙은 날기: 날기를 그만둔(flyWant 꺼짐) 사람의 높이가 0으로 다가가기만 하고 닿지 않으면(1e-27 m) 날기 상태로 남아 힘이 모자라 걷지도 못했다.
 *   eps m 아래로 내려오면 내려앉는다(rules/flight의 착지와 같다)
 * 막혀 제자리: 걸으려는데(걸음 0.5 넘게) every s 동안 d m도 못 갔으면 hold s 동안 옆으로 돌아간다(쪽은 번갈아) */
const P = require('../../data/rules/unstuck.json');
const ST = new WeakMap();   // 사람 → { x, y, t: 잰 시각, until: 돌아가는 끝 시각, sx: 쪽 }
module.exports = {
  name: 'unstuck', switch: 'unstuck', api: { P },
  engine: () => ({
    mageStep(W, m) { if (m.fly === 1 && !m.flyWant && m.z > 0 && m.z < P.eps && !(m.vz > 0)) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; } },
  }),
  brain: B => ({
    steer(W, m, K) {
      let s = ST.get(m); if (!s) ST.set(m, s = { x: m.x, y: m.y, t: W.t, until: -9, sx: 1 });
      if (W.t < s.until && !K.dodge) { const vx = K.vx, vy = K.vy, l = B.hyp(vx, vy) || 1, k = P.side * s.sx; K.vx = vx - vy / l * k; K.vy = vy + vx / l * k; return; }
      if (W.t - s.t < P.every) return;
      const want = B.hyp(K.vx, K.vy) > 0.5 && !(m.st.root > 0) && !(m.st.stun > 0) && !m.cast;
      if (want && B.hyp(m.x - s.x, m.y - s.y) < P.d) { s.until = W.t + P.hold; s.sx = -s.sx; }
      s.x = m.x; s.y = m.y; s.t = W.t;
    },
  }),
};
