'use strict';
/* 규칙: 몸 받침 (rules.bodyK, v2.0 기본 2.3, SPEC 24장)
 * 받는 마법 피해 ÷ max(C, 1)^bodyK. 잔기술과 몸 관리의 서클(굳은 살·지혈·통증 차단·열 차단, WORLD 5장)이 등급만큼 강해진다.
 * 위력이 C^2.5라 같은 등급끼리의 한 방은 C^0.2배로 거의 그대로이고, 등급 차이는 그대로 크다.
 * 받치지 않는 것: 총(mundane), 화약통(마법이 아니다), 소금(몸의 마력을 끊는다), 추락, 제 머리가 넘친 것(파도·폭주, 역류) */
const { pow } = require('../math');
const SKIP = { salt: 1, fall: 1, wave: 1, backfire: 1 };
module.exports = {
  name: 'body', switch: 'bodyK', on: W => W.rules.bodyK > 0,
  engine: () => ({
    hurtMod(W, m, v, kind, name) {
      if (SKIP[kind] || name === '화약통') return v; const s = W.spells[name]; if (s && s.mundane) return v;
      if (m._bkC !== m.C) { m._bkC = m.C; m._bk = pow(Math.max(m.C, 1), W.rules.bodyK); }   // 선명도마다 한 번 (결정론 pow가 비싸다)
      return v / m._bk;
    },
  }),
};
