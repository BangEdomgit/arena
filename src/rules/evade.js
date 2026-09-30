'use strict';
/* 규칙: 회피 (rules.evade, v2.0 기본 켬, SPEC 24장)
 * k = log₂ max(C, 1). 달리기·구르기 속도 × (1 + 0.25·k), 구르기 간격 ÷ (1 + 0.2·k). 결정론 log.
 * 평범 × 1, 중간 × 1.33, 상위 × 1.58, 대마법사 × 1.83 */
const { log } = require('../math');
const LN2 = log(2);
// 선명도마다 한 번 잰다
function mul(m) { if (m._evC !== m.C) { m._evC = m.C; const k = log(Math.max(m.C, 1)) / LN2; m._evS = 1 + 0.25 * k; m._evR = 1 + 0.2 * k; } }
module.exports = {
  name: 'evade', switch: 'evade', on: W => W.rules.evade,
  engine: () => ({
    speed(W, m, sp) { mul(m); return sp * m._evS; },
    roll(W, m, o) { mul(m); o.v *= m._evS; o.cd /= m._evR; },
  }),
};
