'use strict';
/* 규칙: 갈라 쏘기 (rules.crowdFire, v2.30, SPEC 53장, 수는 data/rules/crowdFire.json) — 기본 꺼짐
 * 무리(전투단 tac.squad)가 같은 과녁에 투사체를 쏠 때 사람마다 몫을 나눈다(id mod 3): 가운데·왼쪽 피할 자리·오른쪽 피할 자리.
 *   피할 자리는 쏘는 줄에 직각으로 w m(과녁이 구르거나 옆으로 비키는 거리). 곁 R m 안에 같은 편이 n 넘게 있을 때만(혼자면 가운데를 쏜다)
 *   때 고르기: 과녁이 (모으는 시간 + 날아갈 시간) 동안 slack m 넘게 움직일 빠르기면 쏘지 않는다(멈추거나 모으거나 내려앉을 때를 기다린다)
 *   과녁이 날아갈 동안 갈 자리를 앞질러 겨눈다(lead). 풀 때 겨냥을 고친다(track 훅, 감각 조준 rules/pace 뒤) */
const P = require('../../data/rules/crowdFire.json');
module.exports = {
  name: 'crowdFire', switch: 'crowdFire', api: { P },
  brain: B => ({
    valueLate(W, m, K, o) {
      const s = o.s, e = K.e; if (s.t !== 'proj' || s.mundane || !m.tac.squad || !e || !(o.v > 0)) return;
      const t = B.castTime(W, m, o.Tw) + B.hyp(e.x - m.x, e.y - m.y) / s.v; if (B.hyp(e.vx, e.vy) * t > P.slack) o.v = 0;
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
