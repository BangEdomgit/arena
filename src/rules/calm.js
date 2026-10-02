'use strict';
/* 규칙: 머리 아끼기 (rules.calm, v2.25, SPEC 48장, 수는 data/rules/calm.json) — 기본 꺼짐, 규칙 묶음 '지금'이 켠다
 * 낮은 단계(선명도 cMax 아래, 평범·중간)의 싸움꾼도 제 머리가 휩쓸리는 건 안다. 스스로 죽지 않기(tac.survive, 선명도 5 이상)처럼 넘침을 다 막으면
 *   낮은 단계는 머리가 느리게 식어 판이 멈춘다(117 s, 80판에 5판만 끝남: reports/v2.24.1.md). 그래서 파도는 타되 휩쓸리지는 않는다:
 *   파도 위에서 풀고 나면 머리가 edge를 넘을 마법은 고르지 않고(170에서 폭주: 30 피해·2.5 s 굳음), rest면 위협이 없을 때 쉬어 내려온다 */
const P = require('../../data/rules/calm.json');
const on = (W, m) => m.C < P.cMax && !!W.rules.wave && m.type !== '이단';
module.exports = {
  name: 'calm', switch: 'calm', api: { P },
  brain: B => ({
    value(W, m, K, o) {
      if (!(o.v > 0) || o.s.mundane || !on(W, m)) return;
      const B2 = K.slot === 'B', other = B2 ? m.cast : m.castB, extra = other && !other.auto ? other.s.cost * (other.B ? 1.3 : 1) : 0, c = o.s.cost * (B2 ? 1.3 : 1) + extra;   // 같이 모으는 다른 칸이 먼저 풀며 더할 머리도 (tac.survive처럼)
      if (m.wave) { if (m.fat + c * 1.6 > (m.type === '서퍼' ? P.edge : P.edgeM)) o.v = 0; return; }
      if (m.type === '서퍼' || (K.e && K.e.hp < P.finish * K.e.hpMax)) return;   // 서퍼는 탄다, 끝낼 수 있으면 탄다
      if (B.heatOver(W, m, c, B.castTime(W, m, o.Tw), 1)) o.v = 0;
    },
    rest(W, m, K, restNow) { return restNow || (P.rest > 0 && on(W, m) && m.wave > 0 && !K.aimed); },
  }),
};
