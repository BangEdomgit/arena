'use strict';
/* 규칙: 갈라 쏘기 (rules.crowdFire, v2.30, SPEC 53장, 수는 data/rules/crowdFire.json) — 기본 꺼짐
 * 무리(전투단 tac.squad)가 같은 과녁에 투사체를 쏠 때 사람마다 몫을 나눈다(id mod 3): 가운데·왼쪽 피할 자리·오른쪽 피할 자리.
 *   피할 자리는 쏘는 줄에 직각으로 w m(과녁이 구르거나 옆으로 비키는 거리). 곁 R m 안에 같은 편이 n 넘게 있을 때만(혼자면 가운데를 쏜다)
 *   덮어 쏘기 (v2.32): 명중 문턱 없이 사거리 안이면 값 cover 이상으로 쏜다(피하게 만드는 것). v2.30의 때 고르기(빠른 과녁을 기다림)는 사격을 6분의 1로 줄여 거뒀다
 *   과녁이 날아갈 동안 갈 자리를 앞질러 겨눈다(lead). 풀 때 겨냥을 고친다(track 훅, 감각 조준 rules/pace 뒤) */
const P = require('../../data/rules/crowdFire.json');
module.exports = {
  name: 'crowdFire', switch: 'crowdFire', api: { P },
  brain: B => ({
    // 덮어 쏘기 (v2.32): 무리의 던지기는 맞히려는 게 아니라 피하게 만드는 것. 명중 문턱(빈틈 기다리기)에 막힌 직사도 값 cover로 쏜다
    valueLate(W, m, K, o) {
      const s = o.s, e = K.e; if (s.t !== 'proj' || s.mundane || !m.tac.squad || !e || !(K.d <= B.C.rangeOf(m, s))) return;
      if (o.wait || o.v < P.cover) { o.v = P.cover; o.wait = false; }
    },
  }),
  engine: X => ({
    track(W, m, c) {
      const s = c.s, q0 = c.tgt; if (s.t !== 'proj' || s.mundane || !m.tac.squad || !q0 || !(q0.hp > 0)) return;
      if (P.lead > 0) { const f = X.hyp(q0.x - m.x, q0.y - m.y) / s.v * P.lead; c.tx = q0.x + q0.vx * f; c.ty = q0.y + q0.vy * f; }   // 날아갈 동안 갈 자리를 앞질러 겨눈다
      const k = m.id % 3; if (!k) return;
      let n = 0; const f = W.ms; for (let i = 0; i < f.length; i++) { const q = f[i]; if (q !== m && q.side === m.side && q.hp > 0 && !q.flee && X.hyp(q.x - m.x, q.y - m.y) < P.R) n++; } if (n < P.n) return;
      const dx = c.tx - m.x, dy = c.ty - m.y, d = X.hyp(dx, dy) || 1, sg = k === 1 ? 1 : -1;
      c.tx += -dy / d * P.w * sg; c.ty += dx / d * P.w * sg;
    },
  }),
};
