'use strict';
/* 기술: 뭉친 곳 치기 (tac.crowd, 초보는 없음)
 * 넓은 마법(지연 폭발·지대·곡사·뿜기)은 떨어질 자리 둘레의 적 수만큼 값이 커진다 (한 명 더마다 × 1.6) */
const { hyp, C } = require('../util');
function value(W, m, K, o) {
  const s = o.s;
  if (!(K.T.crowd && (s.t === 'area' || s.t === 'zone' || s.t === 'lob' || s.t === 'cone'))) return;
  const rr = s.t === 'cone' ? 2 : (s.r || (s.z && (s.z.r || (s.z.len || 0) / 2)) || 1.5) * C.sizeOf(m, s);
  let cnt = 0; for (const q of K.foes) if (hyp(q.x - o.tx, q.y - o.ty) < rr + 0.4) cnt++; if (cnt > 1) o.v *= 1 + 0.6 * (cnt - 1);
}
module.exports = { value };
