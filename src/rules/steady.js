'use strict';
/* 규칙: 중간의 읽기 (rules.steady, v2.27, SPEC 51장, 수는 data/rules/steady.json) — 기본 꺼짐, 묶음 '지금'이 켠다
 * 중간끼리는 서로의 예비동작을 일찍 읽어 자동 진(앞 방패)과 옆걸음으로 거의 다 막고 비켜, 공격의 명중이 10%였다(판은 머리 넘침이 끝냈다, reports/v2.26.0·v2.27.0).
 * 선명도 cMin 이상 cMax 아래(중간)는 적의 예비동작을 풀기 readT s 전부터만 읽는다(두뇌 훅 hideCast: 그 전엔 숨긴 시전처럼 건너뛴다).
 * 아래(평범)는 그대로(원래 많이 못 읽는다), 위(상위·대마법사)도 그대로 */
const P = require('../../data/rules/steady.json');
module.exports = {
  name: 'steady', switch: 'steady', api: { P },
  brain: () => ({
    hideCast(W, q, c, m) { return !!m && m.C >= P.cMin && m.C < P.cMax && c.T - c.t > P.readT; },
  }),
};
