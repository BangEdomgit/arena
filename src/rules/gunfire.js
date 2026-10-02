'use strict';
/* 규칙: 총의 쏨 (rules.gunfire, v2.25, SPEC 48장, 수는 data/rules/gunfire.json) — 기본 꺼짐, 규칙 묶음 '지금'이 켠다
 * 따라 겨누기: 병사는 방아쇠를 당길 때까지 과녁을 눈으로 따라가고 움직이는 과녁은 앞질러 겨눈다. 방아쇠는 풀기 lag s 전(화승이 타는 동안은 못 고친다):
 *   그때 과녁의 자리 + 속도 × (lag + 날아갈 시간)을 겨눈다. 그사이 꺾으면 빗나간다. 겨눈 곳에서 R m 넘게 벗어난 과녁은 놓친다(처음 겨눈 곳 그대로).
 *   흔들림은 그대로 총이 정한다(core)
 * 총알은 마력이 아니다: 빠른 판의 떡대·막기(rules/pace)와 잔기술(rules/passive)은 마력 없는 총알을 줄이지 않는다(그 두 규칙이 이 스위치를 본다).
 *   굳은 살(rules/body)은 몸이라 그대로 뺀다 */
const P = require('../../data/rules/gunfire.json');
const isGun = (W, name) => { const s = W.spells[name]; return !!(s && s.mundane); };
const AIM = new WeakMap();   // 시전 → 방아쇠를 당길 때 정한 겨눔 [x, y] (쏠 때만 생긴다)
module.exports = {
  name: 'gunfire', switch: 'gunfire', api: { P, isGun },
  engine: X => ({
    mageStep(W, m) {
      const c = m.cast; if (!c || !c.s.mundane || c.s.t !== 'proj' || c.T - c.t > P.lag || AIM.has(c)) return;
      const q = c.tgt; if (!q || q.hp <= 0) return;
      const d = X.hyp(q.x - m.x, q.y - m.y), k = (c.T - c.t > 0 ? c.T - c.t : 0) + d / c.s.v;   // 남은 화승 + 날아갈 시간
      AIM.set(c, [q.x + q.vx * k, q.y + q.vy * k]);
    },
    track(W, m, c) {
      if (!c.s.mundane || c.s.t !== 'proj') return; const a = AIM.get(c); if (!a) return;
      if (X.hyp(a[0] - c.tx, a[1] - c.ty) < P.R) { c.tx = a[0]; c.ty = a[1]; }
    },
  }),
};
