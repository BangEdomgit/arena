'use strict';
/* 기술: 스스로 죽지 않기 (v2.6, tac.survive, 선명도 5 이상, SPEC 30장)
 * 머리 넘침 막기: 풀 때 머리가 넘쳐 굳을(폭주) 마법, 고르지 않은 파도에 오를 마법은 고르지 않는다. 같이 모으는 다른 칸이 먼저 풀며 더할 머리도 넣는다.
 *   고르지 않은 파도에 올랐으면 위협이 없을 때 쉰다(파도는 75 아래에서 꺼진다)
 *   날다 굳으면 떨어진다(높이 × 4). 전설끼리의 받은 피해 가운데 추락이 40%였고 그 절반이 폭주로 굳어 떨어진 것이었다(reports/v2.6.0.md)
 * 걸음의 단단한 벽(소금 원)·과열 전 착지·굳을 위험에 낮게 날기는 규칙 파일(rules/saltRing·flight)의 bound 훅에, 자동 진의 넘침은 rules/multiSlot에 */
const { heatOver, castTime } = require('../util');
function value(W, m, K, o) {
  if (!m.tac.survive || m.C < 5 || !(o.v > 0)) return;
  const B = K.slot === 'B', other = B ? m.cast : m.castB, extra = other && !other.auto ? other.s.cost * (other.B ? 1.3 : 1) : 0;
  if (heatOver(W, m, o.s.cost * (B ? 1.3 : 1) + extra, castTime(W, m, o.Tw), 1)) o.v = 0;
}
// 고르지 않은 파도에 올랐으면 위협이 없을 때 쉬어 내려온다(75 아래에서 꺼진다)
const rest = (W, m, K) => m.tac.survive && m.C >= 5 && m.wave && !(m.tac.waveChoose && m.waveWant) && !K.aimed;
module.exports = { value, rest };
