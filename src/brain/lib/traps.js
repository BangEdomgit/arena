'use strict';
/* 공용: 덫 칸 (v2.23.1). 규칙(rules/blueprint의 청사진 짓기)과 기술(techniques/trapline)이 함께 쓴다.
 * 엔진·두뇌 어느 쪽도 require하지 않는다(수학·데이터만): 규칙이 바로 불러도 순환이 생기지 않는다 */
const { hyp } = require('../../math');
const P = require('../../../data/trapline.json');
// (x, y) 둘레 칸에 m의 덫이 cellMax개 넘게 있나
function crowded(W, m, x, y) { let n = 0; for (const t of W.traps) if (t.src === m && hyp(t.x - x, t.y - y) < P.cell && ++n >= P.cellMax) return true; return false; }
module.exports = { crowded };
