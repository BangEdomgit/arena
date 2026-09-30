'use strict';
/* 규칙: 몸 받침 (rules.bodyK, v2.0 기본 2.3, SPEC 24장; 굳은 살은 v2.0 둘째 묶음, 25장)
 * 에너지 피해(불·번개·독·열선…)는 ÷ max(C, 1)^bodyK: 열 차단·절연 막·폐 거르기.
 * 부딪히는 피해('blunt': 돌·얼음·곡사·물·총·벽 밀기)는 한 방마다 굳은 살 = callus × log₂ C / log₂ 10 만큼 뺀다. 조약돌은 튕기고 무거운 돌·총알은 들어온다.
 * callus 0이면 첫 묶음 그대로(부딪힘도 ÷ C^bodyK, 총은 받치지 않는다).
 * 받치지 않는 것: 화약통(마법이 아니다), 소금(몸의 마력을 끊는다), 추락, 제 머리가 넘친 것(파도·폭주, 역류) */
const { pow, log } = require('../math');
const SKIP = { salt: 1, fall: 1, wave: 1, backfire: 1 }, L10 = log(10);
module.exports = {
  name: 'body', switch: 'bodyK', on: W => W.rules.bodyK > 0,
  engine: () => ({
    hurtMod(W, m, v, kind, name) {
      if (SKIP[kind] || name === '화약통') return v;
      const cal = W.rules.callus;
      if (cal > 0 && kind === 'blunt') {   // 굳은 살 (선명도마다 한 번)
        if (m._clC !== m.C) { m._clC = m.C; m._cl = m.C > 1 ? cal * log(m.C) / L10 : 0; }
        return v > m._cl ? v - m._cl : 0;
      }
      const s = W.spells[name]; if (s && s.mundane && !(cal > 0)) return v;
      if (m._bkC !== m.C) { m._bkC = m.C; m._bk = pow(Math.max(m.C, 1), W.rules.bodyK); }   // 선명도마다 한 번 (결정론 pow가 비싸다)
      return v / m._bk;
    },
  }),
};
