'use strict';
/* 규칙: 작은 수 막기 (rules.chipGuard, v2.24, SPEC 47장, 수는 data/rules/chipGuard.json) — 시험 규칙, 기본 꺼짐
 * 응수가 있는 동안(굳음·묶임·떨어짐이 아니라 몸을 쓸 수 있다) 떡대가 적의 한 방(투사체·실·폭발·덫)마다 cut만큼 뺀다(0 아래로는 안 간다).
 *   선명도 cMin 이상(대마법사)만. 걸음마다 드는 피해(지대·빔·불·소금, tick)는 그대로. 뺀 양은 mlog.chip
 * 물음: 연타로 앞쪽에서 잃는 판(흐름)을 뒤로 미루고, 끝은 큰 한 방이 내게 할 수 있나 */
const P = require('../../data/rules/chipGuard.json');
module.exports = {
  name: 'chipGuard', switch: 'chipGuard', api: { P },
  engine: X => ({
    hurtMod(W, m, v, kind, name, src, tick) {
      if (tick || !src || src.side === m.side || m.C < P.cMin || m.st.stun > 0 || m.st.root > 0 || m.fly === 2) return v;
      const w = v > P.cut ? v - P.cut : 0; m.mlog.chip += v - w; return w;
    },
  }),
};
