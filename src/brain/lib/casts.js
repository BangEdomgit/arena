'use strict';
/* 공용: 셋째 칸부터의 시전 읽기 (v2.38, SPEC 59장). 두뇌 훅 casts(rules/ringLedger)가 사람마다의 X 배열을 준다.
 * 예비동작을 읽는 자리(brain/read, 잔기술·반사 겹·날기·박자…)가 cast·castB 다음에 본다. 훅이 없거나 두뇌가 아직 돌지 않았으면 빈 배열
 * 쓰는 모양: for (let j = 0, xs = castsX(W, q), jn = 2 + xs.length; j < jn; j++) { const c = castAt(q, j, xs); … } */
const NONE = [];
function castsX(W, q) { const B = W._bh; if (!B) return NONE; const h = B.casts; let a = NONE; for (let i = 0; i < h.length; i++) a = h[i](W, q, a); return a; }
const castAt = (q, j, xs) => j === 0 ? q.cast : j === 1 ? q.castB : xs[j - 2];
module.exports = { castsX, castAt };
