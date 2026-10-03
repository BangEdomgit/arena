'use strict';
/* 규칙: 막힘 풀기 (rules.unstuck, v2.30, SPEC 53장, 수는 data/rules/unstuck.json) — 기본 꺼짐
 * 땅에 붙은 날기: 날기를 그만둔(flyWant 꺼짐) 사람의 높이가 0으로 다가가기만 하고 닿지 않으면(1e-27 m) 날기 상태로 남아 힘이 모자라 걷지도 못했다.
 *   eps m 아래로 내려오면 내려앉는다(rules/flight의 착지와 같다)
 * 판 끝: 판 밖으로 걸으려는 몫은 버리고 끝을 따라 미끄러진다(물러서다 모서리에 몰려 한 점에 쌓이지 않게)
 * 막혀 제자리: 걸으려는데(걸음 0.5 넘게) every s 동안 d m도 못 갔으면 hold s(거듭 막히면 네 배까지) 동안 옆으로 돌아간다.
 *   곁(near m)의 바위(v2.32부터 벽도)가 막았으면 바위를 끼고 돈다(가려던 쪽에 가까운 접선, 조금 밖으로 out), 아니면 직각으로 같은 쪽으로 가다가 세 번 막히면 쪽을 바꾼다 */
const P = require('../../data/rules/unstuck.json');
const ST = new WeakMap();   // 사람 → { x, y, t: 잰 시각, until: 돌아가는 끝 시각, sx: 쪽, n: 거듭 막힌 수, o: 막은 바위 }
module.exports = {
  name: 'unstuck', switch: 'unstuck', api: { P },
  engine: () => ({
    mageStep(W, m) { if (m.fly === 1 && !m.flyWant && m.z > 0 && m.z < P.eps && !(m.vz > 0)) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; } },
  }),
  brain: B => ({
    steer(W, m, K) {
      if (m.flee) return;   // 달아나는 사람은 판 밖으로 나간다
      const e = P.edge; if ((m.x < e && K.vx < 0) || (m.x > W.width - e && K.vx > 0)) K.vx = 0; if ((m.y < e && K.vy < 0) || (m.y > W.height - e && K.vy > 0)) K.vy = 0;
      let s = ST.get(m); if (!s) ST.set(m, s = { x: m.x, y: m.y, t: W.t, until: -9, sx: 1, n: 0, o: null });
      if (W.t < s.until && !K.dodge) { const vx = K.vx, vy = K.vy, l = B.hyp(vx, vy) || 1, o = s.o;
        if (o) { const ox = m.x - o.x, oy = m.y - o.y, ol = B.hyp(ox, oy) || 1, nx = ox / ol, ny = oy / ol, sg = -ny * vx + nx * vy >= 0 ? 1 : -1;   // 바위를 끼고 돈다: 접선(원하는 쪽에 가까운 쪽)과 조금 밖으로
          K.vx = (-ny * sg + nx * P.out) * l; K.vy = (nx * sg + ny * P.out) * l; }
        else { const k = s.sx; K.vx = -vy * k; K.vy = vx * k; }   // 옆으로 돈다
        return; }
      if (W.t - s.t < P.every) return;
      const want = B.hyp(K.vx, K.vy) > 0.5 && !(m.st.root > 0) && !(m.st.stun > 0) && !m.cast;
      if (want && B.hyp(m.x - s.x, m.y - s.y) < P.d) { s.n++; s.until = W.t + P.hold * (s.n < 4 ? s.n : 4);
        let bo = null, bd = P.near; for (const o of W.obs) { const d = B.hyp(o.x - m.x, o.y - m.y) - o.r; if (d < bd) { bd = d; bo = o; } }   // 막은 바위
        if (P.walls) for (const o of W.walls) { if (!(o.hp > 0)) continue; const d = B.hyp(o.x - m.x, o.y - m.y) - o.r; if (d < bd) { bd = d; bo = o; } }   // 벽도 (v2.32)
        s.o = bo; if (!bo && s.n % 3 === 0) s.sx = -s.sx; }
      else if (!want || B.hyp(m.x - s.x, m.y - s.y) > P.d * 4) s.n = 0;
      s.x = m.x; s.y = m.y; s.t = W.t;
    },
  }),
};
