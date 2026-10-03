'use strict';
/* 규칙: 소금을 아는 대마법사 (rules.saltWise, v2.30, SPEC 53장, 수는 data/rules/saltWise.json) — 기본 꺼짐. 소금 땅(saltLand)이 있는 판에서만 일한다
 * 선명도 cMin 이상의 마법사는
 *   서지 않는다: 소금 땅 위에 섰으면 가까운 맨땅으로 간다(과녁에서 너무 멀어지지 않는 곳). 맨땅에서 과녁이 손닿는 거리면 소금으로 걸어 들어가지 않고
 *     걸음을 45°·90°·135° 돌려 소금 둘레를 따라 돈다(멈춰 서면 총 앞의 과녁이다)
 *   흩어질 수는 쓰지 않는다: 값 고치기가 다 끝난 뒤의 겨눈 자리로 다시 본다(앞의 기술이 과녁을 옮겼을 수 있다). 자동 진의 반사 방패도 소금 위에선 세우지 않는다(rules/gunfire)
 *   길 (v2.32): 과녁이 멀어 소금으로 걸어 들어가야 하면 16 방향 가운데 (나아가는 거리 − saltK × probe m 안의 소금 길이)가 큰 쪽으로
 *   과녁이 소금 위면 내 자리에서 서는 수(직사·곡사)를 고른다(값 × lobK) */
const P = require('../../data/rules/saltWise.json');
const SELF = { proj: 1, lob: 1 };
const H = 0.707107, ROT = [[H, H], [H, -H], [0, 1], [0, -1], [-H, H], [-H, -H]];   // 45°·90°·135° 돌리기 [cos, sin]
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
        const vx = K.vx, vy = K.vy; if (!B.C.onSalt(W, m.x + vx * P.look, m.y + vy * P.look)) return;
        if (!e || !(K.d <= K.prefR + P.reach)) { if (P.route) route(B, W, m, K, e); return; }   // 과녁이 멀다: 소금을 덜 밟는 길로 (v2.32)
        for (let i = 0; i < ROT.length; i++) { const c = ROT[i][0], s = ROT[i][1], rx = vx * c - vy * s, ry = vx * s + vy * c;   // 소금 쪽 몫을 버리고 둘레를 따라 돈다 (서 있으면 총 앞의 과녁이다)
          if (!B.C.onSalt(W, m.x + rx * P.look, m.y + ry * P.look)) { K.vx = rx; K.vy = ry; return; } }
        K.vx = 0; K.vy = 0; return; }
      let bx = 0, by = 0, bs = 1e9;
      for (let i = 0; i < P.radii.length; i++) { const r = P.radii[i]; if (r > bs) break;
        for (let k = 0; k < P.dirs; k++) { const a = k * 6.2832 / P.dirs, x = m.x + B.C.cos(a) * r, y = m.y + B.C.sin(a) * r;
          if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1 || B.C.onSalt(W, x, y)) continue;
          const sc = r + (e ? P.far * Math.max(0, B.hyp(e.x - x, e.y - y) - K.prefR) : 0); if (sc < bs) { bs = sc; bx = x; by = y; } } }
      if (bs < 1e9) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * P.v; K.vy = dy / l * P.v; }
    },
  }),
};
// 길 고르기 (v2.32, route): 16 방향마다 probe m 앞까지 2 m씩 소금 위를 지나는 길이를 재, (과녁 쪽으로 나아가는 거리 − saltK × 소금 길이)가 가장 큰 쪽으로.
// 소금 위에선 날 수도 방패도 못 세운다(saltLand·artillery의 안개와 같은 뜻)
function route(B, W, m, K, e) {
  const sp = B.hyp(K.vx, K.vy) || P.v; let ux = K.vx / sp, uy = K.vy / sp; if (e) { const dx = e.x - m.x, dy = e.y - m.y, l = B.hyp(dx, dy) || 1; ux = dx / l; uy = dy / l; }
  let bx = 0, by = 0, bv = -1e9;
  for (let k = 0; k < 16; k++) { const a = k * 0.3927, cx = B.C.cos(a), cy = B.C.sin(a); let salt = 0;
    for (let r = 2; r <= P.probe; r += 2) { const x = m.x + cx * r, y = m.y + cy * r; if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1) { salt += 1e3; break; } if (B.C.onSalt(W, x, y)) salt += 2; }
    const v = (cx * ux + cy * uy) * P.probe - P.saltK * salt; if (v > bv) { bv = v; bx = cx; by = cy; } }
  K.vx = bx * sp; K.vy = by * sp;
}
// 마법이 서는 자리 (core의 formPoint와 같은 셈)
function formAt(B, m, s, tx, ty) {
  const k = B.C.FORM[s.t], d = B.hyp(tx - m.x, ty - m.y) || 1;
  if (k === 'target' || k === 'path') return [tx, ty];
  if (k === 'front') { const L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5];
  return [m.x, m.y];
}
