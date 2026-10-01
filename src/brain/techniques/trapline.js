'use strict';
/* 기술: 덫길 (v2.13, tac.trapLine, 상급부터, SPEC 37장, 수는 data/trapline.json) — 덫은 상대가 올 길·도망칠 길에, 한 자리에 몰지 않고 길을 그리듯
 * 받은 측정: 전설끼리 시작 4.9 s에 번개 지뢰 아홉씩을 가운데에 쏟아 덫 22개가 한 무더기로 쌓이고 끝까지 아무도 안 밟았다(청사진 '함정 격자' 3 × 3)
 * 자리: 나와 상대 사이(올 길)의 along 0.4·0.55·0.7 몫 자리와 그 좌우 side 2.5 m, 상대 뒤 behind 4 m(도망칠 길). 내 덫이 cell 3 m 안에 cellMax 2개 넘게 있는 자리는 버린다
 * 한 사람이 gap 0.8 s에 하나만(한꺼번에 쏟지 않는다). 청사진의 덫도 꽉 찬 칸엔 놓지 않는다(rules/blueprint가 crowded를 부른다) */
const { hyp } = require('../util');
const P = require('../../../data/trapline.json');
// (x, y)의 칸에 내 덫이 꽉 찼나
function crowded(W, m, x, y) { let n = 0; for (const t of W.traps) if (t.src === m && hyp(t.x - x, t.y - y) < P.cell && ++n >= P.cellMax) return true; return false; }
function value(W, m, K, o) {
  if (!m.tac.trapLine || o.s.t !== 'trap' || !(o.v > 0)) return;
  if (W.t - K.trapT < P.gap) { o.v = 0; return; }   // 한꺼번에 쏟지 않는다
  const e = K.e, ux = K.ux, uy = K.uy, d = K.d, reach = 6 * Math.sqrt(m.C);   // 엔진은 내 쪽으로 6√C m까지 놓는다
  let bx = NaN, by = NaN;
  for (let i = 0; i < P.along.length && bx !== bx; i++) { const r = Math.min(reach, d * P.along[i]); for (let j = 0; j < 3; j++) { const sd = j === 0 ? 0 : j === 1 ? P.side : -P.side, x = m.x + ux * r - uy * sd, y = m.y + uy * r + ux * sd; if (!crowded(W, m, x, y)) { bx = x; by = y; break; } } }
  if (bx !== bx && d + P.behind < reach) { const x = e.x + ux * P.behind, y = e.y + uy * P.behind; if (!crowded(W, m, x, y)) { bx = x; by = y; } }   // 도망칠 길
  if (bx !== bx) { o.v = 0; return; }   // 놓을 길이 꽉 찼다
  o.tx = bx; o.ty = by;
}
function commit(W, m, K, best) { if (m.tac.trapLine && best.s.t === 'trap') K.trapT = W.t; }
module.exports = { value, commit, crowded, P };
