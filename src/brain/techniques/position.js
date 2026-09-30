'use strict';
/* 기술: 자리 (대가)
 * 사거리 밖(tac.outrange): 내 사거리가 더 길면 상대 덱의 최대 사거리 바로 밖에 선다.
 * 자리 판단(tac.terrain): 내 장악권이 짙은 땅 쪽으로 기운다. 엄폐 중이거나 엄폐로 가는 중이면 따르지 않는다 */
const { DIR8, ownShare } = require('../util');
function outrange(W, m, K) { if (K.T.outrange) { const eR = K.De.maxR, mR = K.Dm.maxR; if (mR > eR + 1) K.prefR = Math.min(eR + 1, mR - 0.5); } }
function terrain(W, m, K, covering) {
  if (!(K.T.terrain && W.rules.domain && !covering && K.los)) return;
  const foes = K.foes, f0 = ownShare(W, m, foes, m.x, m.y); let bx = 0, by = 0, bf = f0;
  for (let k = 0; k < 8; k++) { const px = m.x + DIR8[k][0] * 2, py = m.y + DIR8[k][1] * 2; if (px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1) continue; const f = ownShare(W, m, foes, px, py); if (f > bf) { bf = f; bx = DIR8[k][0]; by = DIR8[k][1]; } }
  const k2 = Math.min(1.2, (bf - f0) * 6); K.vx += bx * k2; K.vy += by * k2;
}
module.exports = { outrange, terrain };
