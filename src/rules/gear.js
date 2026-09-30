'use strict';
/* 규칙: 장비 (늘 켜짐, data/gear.json, SPEC 10장)
 * 소금 밑창: 안 보이는 발밑 공격(지연 폭발)의 피해·묶임·굳힘 × 0.3. 소금 망토: 두른 사람 1.6 m 안에서 남의 장악 몫 × 0.3 */
const { hyp } = require('../math');
module.exports = {
  name: 'gear', on: () => true,
  engine: () => ({
    // 장악 계산: 망토 (refreshSides가 산 사람 중 망토 두른 이가 있는지 W._cloak에 적어 둔다)
    share(W, m, x, y, f) { if (W._cloak) { const foes = W.foes[m.side]; for (let i = 0; i < foes.length; i++) { const q = foes[i]; if (q.gear.cloak && hyp(x - q.x, y - q.y) < 1.6) f *= 0.3; } } return f; },
    // 지연 폭발이 사람에게 닿을 때의 몫: 밑창
    areaHit(W, q, a, k) { return !a.vis && q.gear.soles ? k * 0.3 : k; },
  }),
};
