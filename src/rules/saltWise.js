'use strict';
/* 규칙: 소금을 아는 대마법사 (rules.saltWise, v2.30, SPEC 53장, 수는 data/rules/saltWise.json) — 기본 꺼짐. 소금 땅(saltLand)이 있는 판에서만 일한다
 * 선명도 cMin 이상의 마법사는
 *   서지 않는다: 소금 땅 위에 섰으면 가까운 맨땅으로 간다(과녁에서 너무 멀어지지 않는 곳). 맨땅에서 과녁이 손닿는 거리면 소금으로 걸어 들어가지 않는다
 *   흩어질 수는 쓰지 않는다: 값 고치기가 다 끝난 뒤의 겨눈 자리로 다시 본다(앞의 기술이 과녁을 옮겼을 수 있다). 자동 진의 반사 방패도 소금 위에선 세우지 않는다(rules/gunfire)
 *   과녁이 소금 위면 내 자리에서 서는 수(직사·곡사)를 고른다(값 × lobK) */
const P = require('../../data/rules/saltWise.json');
const SELF = { proj: 1, lob: 1 };
const on = (W, m) => W.salt.length > 0 && m.C >= P.cMin;
module.exports = {
  name: 'saltWise', switch: 'saltWise', api: { P, on },
  brain: B => ({
    valueLate(W, m, K, o) {
      if (!(o.v > 0) || !on(W, m)) return; const s = o.s; if (s.mundane) return;
      const p = B.C.FORM[s.t] === 'body' ? null : formAt(B, m, s, o.tx, o.ty); if (p ? B.C.onSalt(W, p[0], p[1]) : (m.z < 1 && B.C.onSalt(W, m.x, m.y))) { o.v = 0; return; }
      const e = K.e; if (SELF[s.t] && e && e.z < 1 && B.C.onSalt(W, e.x, e.y)) o.v *= P.lobK;
    },
    steer(W, m, K) {
      if (K.dodge || m.flee || m.z >= 1 || !on(W, m)) return; const e = K.e;
      if (!B.C.onSalt(W, m.x, m.y)) {   // 맨땅: 손닿는 과녁이 있으면 소금으로 들어가지 않는다
        if (!e || !(K.d <= K.prefR + P.reach)) return; const nx = m.x + K.vx * P.look, ny = m.y + K.vy * P.look;
        if (B.C.onSalt(W, nx, ny)) { K.vx = 0; K.vy = 0; } return; }
      let bx = 0, by = 0, bs = 1e9;
      for (let i = 0; i < P.radii.length; i++) { const r = P.radii[i]; if (r > bs) break;
        for (let k = 0; k < P.dirs; k++) { const a = k * 6.2832 / P.dirs, x = m.x + B.C.cos(a) * r, y = m.y + B.C.sin(a) * r;
          if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1 || B.C.onSalt(W, x, y)) continue;
          const sc = r + (e ? P.far * Math.max(0, B.hyp(e.x - x, e.y - y) - K.prefR) : 0); if (sc < bs) { bs = sc; bx = x; by = y; } } }
      if (bs < 1e9) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * P.v; K.vy = dy / l * P.v; }
    },
  }),
};
// 마법이 서는 자리 (core의 formPoint와 같은 셈)
function formAt(B, m, s, tx, ty) {
  const k = B.C.FORM[s.t], d = B.hyp(tx - m.x, ty - m.y) || 1;
  if (k === 'target' || k === 'path') return [tx, ty];
  if (k === 'front') { const L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5];
  return [m.x, m.y];
}
