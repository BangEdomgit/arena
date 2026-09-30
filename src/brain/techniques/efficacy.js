'use strict';
/* 기술: 효과 학습과 강화의 때 (v2.2, SPEC 26장)
 * 둘 다 선명도 5 이상(상위·대마법사)만 쓴다.
 * 효과 학습(tac.efficacy, 대가부터): 판 중에 마법마다 쓴 수 대비 맞힌 수를 센다(기록 log.casts·hits). 세 번 넘게 쓴 공격은
 *   값 × clamp((내 명중률 / 내 공격 전체의 명중률)^1.5, 0.1, 1.4), 다섯 번 넘게 쓰고 한 번도 못 맞혔으면 0. 계속 빗나가는 수는 덜 쓰고 먹히는 수를 더 쓴다
 * 강화의 때(tac.buffNeed, 상급부터): 걸음 강화(근육 폭주·다리 자극)는 필요한 순간에만 — 걸어서(날면 걸음 강화가 뜻이 없다)
 *   돌파·거리 두기 중이거나, 빠지는 중이거나, 들어가는데 아직 멀거나(들어갈 거리 + 4 m), 나를 겨눈 큰 수를 피할 때 */
const { OFF } = require('../util');
function prep(W, m, K) {
  K.effHR = 0; if (!m.tac.efficacy || m.C < 5) return;
  let c = 0, h = 0; const L = m.log; for (const n of m.book) { const s = K.S[n]; if (!s || !OFF[s.t]) continue; const k = L.casts[n] || 0; c += k; h += Math.min(k, L.hits[n] || 0); }
  K.effHR = c >= 6 ? (h + 1) / (c + 2) : 0;
}
function value(W, m, K, o) {
  const T = m.tac, s = o.s;
  if (T.efficacy && o.isOff && K.effHR > 0) { const c = m.log.casts[o.n] || 0; if (c >= 5 && !(m.log.hits[o.n] > 0)) o.v = 0;   // 다섯 번 넘게 쓰고 한 번도 못 맞힌 수는 버린다
    else if (c >= 3) { const hr = (Math.min(c, m.log.hits[o.n] || 0) + 0.3) / (c + 1), q = hr / (K.effHR > 0.05 ? K.effHR : 0.05), k = q * Math.sqrt(q); o.v *= k < 0.1 ? 0.1 : k > 1.4 ? 1.4 : k; } }
  if (T.buffNeed && m.C >= 5 && s.t === 'buff' && s.b.speed) {
    const need = m.fly !== 1 && (K.stance === 'breakout' || K.stance === 'kite' || m.phase === 'out' || (m.phase === 'in' && K.d > K.prefR + 4) || (K.aimed && K.threat && K.threat.s.big));
    if (!need) o.v = 0;
  }
}
module.exports = { prep, value };
