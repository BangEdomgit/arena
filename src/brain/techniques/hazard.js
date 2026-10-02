'use strict';
/* 기술: 내 위험 지대 비키기 (v2.21, tac.hazard 대가·전설, 선명도 5 이상, SPEC 45장, 수는 data/hazard.json)
 * 전설끼리의 "실수"로 끝난 판(21%)은 소금 원 절반, 내 지역 마법(낙뢰·대낙뢰가 날며 다가간 나를 친다)과 역류가 나머지였다.
 *   길: 모든 걸음이 정해진 뒤(bound 훅 다음) 내가 깐 지연 폭발·곡사의 반경 + pad 안으로 look s 안에 들어가는 몫을 지우고, 안이면 바깥으로. 소금 원의 벽을 다시 부른다
 *   소금 원: 안전 반경을 salt m 더 안쪽으로 (K.saltPad, rules/saltRing이 읽는다). 끝판의 원은 초당 2 m 줄어 1 s 굳으면 넘어온다
 *   수: 고르기 맨 끝에서 지역 마법이 터질 때 내 자리(지금 + 속도 × 짓는 시간·지연)가 반경 + self m 안이면 버린다 */
const P = require('../../../data/hazard.json');
const { hyp, C } = require('../util');
const on = m => m.tac.hazard && m.C >= 5;
function bound(W, m, K) {
  if (!on(m)) return;
  K.saltPad = P.salt;
  let vx = K.vx, vy = K.vy, hit = false;
  for (let k = 0; k < 2; k++) {
    const L = k ? W.lobs : W.areas;
    for (let i = 0; i < L.length; i++) {
      const a = L[i]; if (a.src !== m) continue;
      const dx = m.x - a.x, dy = m.y - a.y, d = hyp(dx, dy) || 0.01, R = (a.r || 1) + P.pad, t = k ? 0.5 : (a.t > 0 ? a.t : 0), sp = hyp(m.vx, m.vy);
      if (d > R + sp * Math.min(t, P.look) + 0.5) continue;
      const ux = dx / d, uy = dy / d, inw = -(vx * ux + vy * uy);
      if (inw > 0) { vx += ux * inw; vy += uy * inw; }   // 다가가는 몫을 지운다 (둘레로 미끄러진다)
      if (d < R) { vx += ux * P.out; vy += uy * P.out; }
      hit = true;
    }
  }
  if (!hit) return;
  K.vx = vx; K.vy = vy;
  const sr = W.rules.saltRing && C.RULES.find(r => r.name === 'saltRing'); if (sr) sr.api.bound(W, m, K, require('../util'));
}
// 고르기 맨 끝 (choose의 값 고치기): 지역 마법이 터질 때 내가 그 안이면 버린다
function value(W, m, K, o) {
  if (!on(m) || !(o.v > 0)) return; const s = o.s; if (s.t !== 'area' && s.t !== 'lob') return;
  const t = o.Tw + (s.delay || 0), x = m.x + m.vx * t, y = m.y + m.vy * t, r = (s.r || 1) * C.sizeOf(m, s) + P.self;
  if (hyp(o.tx - x, o.ty - y) < r || hyp(o.tx - m.x, o.ty - m.y) < r) o.v = 0;
}
module.exports = { bound, value, P };
