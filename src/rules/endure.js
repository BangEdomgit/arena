'use strict';
/* 규칙: 버티기 (rules.endureK, v2.7, SPEC 31장) — 머리 회복과 당 회복의 선명도 배수
 * 꺼져 있으면(0) 누구나 머리 초당 4, 당 초당 1.2 g이 돌아왔다. 켜지면 둘 다 × max(1, C / endureC)^endureK: 평범·중간 × 1, 상위·대마법사는 더 (endureC 2.5, endureK 1.2: 상위 × 2.3, 대마법사 × 5.3).
 *   중간까지는 그대로다: 선명도 1부터 곱하면 중간의 판단 사다리(머리를 아끼는 것이 단계를 가른다)가 무너졌다(전설 / 대가 0.99 → 0.71)
 * WORLD 4-1의 버티는 시간(평범 몇 분 · 중간 10~20분 · 상위 30분~1시간 · 대마법사 몇 시간)과 서클(동시에 붙잡는 층 수, 대마법사 8~12).
 * 이 규칙이 없을 때 대마법사는 머리(날면 남는 회복 1.2/s)와 당(초당 1.2 g, 마법 하나 3~7 g)에 묶여 4 s에 하나를 짓고 120 s 안에 서로 쓰러뜨리지 못했다 (reports/v2.7.0.md) */
const { pow } = require('../math');
// 배수는 사람마다 한 번 (선명도가 바뀌면 다시): 세계의 배열에 번호로 (걸음마다 두 번 부르니 Map은 느렸다)
function mul(W, m) { const a = W._en || (W._en = []), c = a[m.id]; if (c !== undefined && c[0] === m.C) return c[1]; const x = pow(m.C / W.rules.endureC, W.rules.endureK); a[m.id] = [m.C, x]; return x; }
module.exports = {
  name: 'endure', switch: 'endureK', on: W => W.rules.endureK > 0,
  engine: () => ({
    fatRecover(W, m, k) { return m.C > W.rules.endureC ? k * mul(W, m) : k; },   // 중간까지는 그대로
    gluRegen(W, m, g) { return m.C > W.rules.endureC ? g * mul(W, m) : g; },
  }),
};
