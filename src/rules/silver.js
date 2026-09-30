'use strict';
/* 규칙: 은실 옷 (rules.silver, 1.13.0, SPEC 10장, data/gear.json)
 * WORLD 3-4: "응답은 소금·은·독한 술·더 선명한 신호로 끊는다". 은실을 누빈 옷(gear.silver)이 몸에 닿는 응답을 끊어
 * 붙잡는 효과(굳음·묶임·균사·경직·석회·족쇄)의 길이를 × 0.5로. 값: 은은 전기를 잘 통해 전기 피해 × 1.1. 걸음(speed)은 기본 × 1(얇은 실이라 무겁지 않다).
 * 재 보니 입어도 이기지 못한다: 결투가 붙잡는 시간으로 갈리지 않는다 (reports/v1.13.0.md)
 * 수는 data/rules/silver.json. 스위치가 꺼져 있으면 입어도 아무 일 없다 */
const P = require('../../data/rules/silver.json');
module.exports = {
  name: 'silver', switch: 'silver', on: W => W.rules.silver,
  engine: () => ({
    effHold(W, m, o, g) { return m.gear.silver ? g * P.hold : g; },
    hurtMod(W, m, v, kind) { return kind === 'elec' && m.gear.silver ? v * P.elec : v; },
    speed(W, m, sp) { return m.gear.silver ? sp * P.speed : sp; },
  }),
};
