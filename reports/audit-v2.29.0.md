# 지능 점검

엔진 v2.29.0 · 2026-10-03 · 장면 28개 × 씨앗 1·2·3 · 14 s. 문턱은 `data/rules/audit.json`, 만든 명령 `node cli.js audit`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.

## 탐지기별 사건 수

| 탐지기 | 사건 | 장면 수 |
|---|---|---|
| 체력 남기고 도망 | 1251 | 21 |
| 헛시전 | 96 | 13 |
| 기회 놓침 | 86 | 14 |
| 명중 범위 밖 | 28 | 8 |
| 막혀 제자리 | 25 | 7 |
| 스스로 입은 피해 몫 | 23 | 8 |
| 떨림 | 18 | 5 |
| 위험 지대 | 15 | 3 |
| 역류 | 8 | 4 |
| 같은 수 되풀이 몫 | 8 | 3 |
| 대마법사: 소금 위 몫 | 6 | 2 |
| 아군 피해 몫 | 5 | 4 |
| 헛시전: 알 수 있었던 것 | 3 | 2 |
| 데이터: 장면의 자리가 판 밖 | 1 | 1 |
| 대마법사: 총 앞에 서 있음 | 1 | 1 |

## 장면별 사건 수

| 장면 | 사건 |
|---|---|
| v2-army-field | 225 |
| v2-archmage-100 | 213 |
| x-joint | 115 |
| v2-army-prepared | 105 |
| archmage-50 | 100 |
| x-squad-30 | 84 |
| v2-army-ambush | 83 |
| v2-crowd-1v20 | 64 |
| x-scattered-30 | 62 |
| x-top-vs-plain30 | 62 |
| x-squad-30-ranged | 57 |
| v2-army-salt-city | 47 |
| v2-archmage-1v10 | 44 |
| v2-sky-musket | 42 |
| musket-arc | 41 |
| x-salt-fort | 41 |
| element-league | 34 |
| v2-musket-40 | 25 |
| v2-archmage-2v6 | 22 |
| v2-squad-10 | 22 |
| v2-sky-wide | 19 |
| v2-challenger-3 | 14 |
| v2-squad-10-scattered | 14 |
| v2-sky-narrow | 13 |
| duel | 11 |
| v2-neighbor-mid | 6 |
| v2-neighbor-plain | 4 |
| v2-tactics-legend | 4 |
| 데이터 | 1 |

## 대마법사 (판마다)

| 장면 | 씨앗 | 누구 | 떠 있는 몫 | 평균 속도 (m/s) | 소금 위 몫 |
|---|---|---|---|---|---|
| archmage-50 | 1 | 대마법사1 | 93% | 6.9 | 0% |
| archmage-50 | 2 | 대마법사1 | 92% | 7.2 | 0% |
| archmage-50 | 3 | 대마법사1 | 95% | 6.8 | 0% |
| musket-arc | 1 | 대마법사1 | 47% | 9.9 | 0% |
| musket-arc | 2 | 대마법사1 | 44% | 12.2 | 0% |
| musket-arc | 3 | 대마법사1 | 0% | 9.7 | 0% |
| v2-archmage-100 | 1 | 대마법사1 | 98% | 12.5 | 0% |
| v2-archmage-100 | 2 | 대마법사1 | 89% | 10.1 | 0% |
| v2-archmage-100 | 3 | 대마법사1 | 98% | 15.6 | 0% |
| v2-archmage-1v10 | 1 | 대마법사1 | 99% | 18.0 | 0% |
| v2-archmage-1v10 | 2 | 대마법사1 | 89% | 16.1 | 0% |
| v2-archmage-1v10 | 3 | 대마법사1 | 93% | 17.2 | 0% |
| v2-archmage-2v6 | 1 | 대마법사1 | 88% | 20.5 | 0% |
| v2-archmage-2v6 | 1 | 대마법사2 | 98% | 20.2 | 0% |
| v2-archmage-2v6 | 2 | 대마법사1 | 87% | 19.2 | 0% |
| v2-archmage-2v6 | 2 | 대마법사2 | 98% | 20.4 | 0% |
| v2-archmage-2v6 | 3 | 대마법사1 | 98% | 20.0 | 0% |
| v2-archmage-2v6 | 3 | 대마법사2 | 80% | 17.2 | 0% |
| v2-army-ambush | 1 | 대마법사1 | 11% | 9.7 | 0% |
| v2-army-ambush | 2 | 대마법사1 | 14% | 2.7 | 0% |
| v2-army-ambush | 3 | 대마법사1 | 7% | 6.6 | 0% |
| v2-army-field | 1 | 대마법사1 | 63% | 17.1 | 0% |
| v2-army-field | 2 | 대마법사1 | 79% | 19.3 | 0% |
| v2-army-field | 3 | 대마법사1 | 75% | 19.0 | 0% |
| v2-army-prepared | 1 | 대마법사1 | 14% | 6.1 | 0% |
| v2-army-prepared | 2 | 대마법사1 | 0% | 1.3 | 0% |
| v2-army-prepared | 3 | 대마법사1 | 4% | 0.8 | 0% |
| v2-army-salt-city | 1 | 대마법사1 | 20% | 8.6 | 79% |
| v2-army-salt-city | 2 | 대마법사1 | 23% | 9.0 | 76% |
| v2-army-salt-city | 3 | 대마법사1 | 46% | 8.9 | 54% |
| v2-crowd-1v20 | 1 | 대마법사1 | 83% | 13.4 | 0% |
| v2-crowd-1v20 | 2 | 대마법사1 | 83% | 15.3 | 0% |
| v2-crowd-1v20 | 3 | 대마법사1 | 93% | 11.0 | 0% |
| v2-musket-40 | 1 | 대마법사1 | 0% | 9.5 | 0% |
| v2-musket-40 | 2 | 대마법사1 | 0% | 7.9 | 0% |
| v2-musket-40 | 3 | 대마법사1 | 0% | 14.6 | 0% |
| v2-sky-musket | 1 | 대마법사1 | 99% | 17.6 | 0% |
| v2-sky-musket | 2 | 대마법사1 | 99% | 19.2 | 0% |
| v2-sky-musket | 3 | 대마법사1 | 99% | 29.0 | 0% |
| v2-sky-narrow | 1 | 대가1 | 100% | 23.1 | 0% |
| v2-sky-narrow | 1 | 상급1 | 83% | 18.4 | 0% |
| v2-sky-narrow | 2 | 대가1 | 83% | 19.2 | 0% |
| v2-sky-narrow | 2 | 상급1 | 79% | 19.2 | 0% |
| v2-sky-narrow | 3 | 대가1 | 62% | 20.4 | 0% |
| v2-sky-narrow | 3 | 상급1 | 100% | 24.4 | 0% |
| v2-sky-wide | 1 | 전설1 | 99% | 22.5 | 0% |
| v2-sky-wide | 1 | 대가1 | 98% | 24.9 | 0% |
| v2-sky-wide | 2 | 전설1 | 93% | 22.6 | 0% |
| v2-sky-wide | 2 | 대가1 | 94% | 23.4 | 0% |
| v2-sky-wide | 3 | 전설1 | 92% | 22.6 | 0% |
| v2-sky-wide | 3 | 대가1 | 92% | 24.6 | 0% |
| v2-squad-10-scattered | 1 | 대마법사1 | 100% | 13.8 | 0% |
| v2-squad-10-scattered | 2 | 대마법사1 | 99% | 14.8 | 0% |
| v2-squad-10-scattered | 3 | 대마법사1 | 99% | 17.8 | 0% |
| v2-squad-10 | 1 | 대마법사1 | 100% | 14.4 | 0% |
| v2-squad-10 | 2 | 대마법사1 | 99% | 15.5 | 0% |
| v2-squad-10 | 3 | 대마법사1 | 99% | 14.5 | 0% |
| v2-tactics-legend | 1 | 전설 A1 | 94% | 21.4 | 0% |
| v2-tactics-legend | 1 | 전설 B1 | 95% | 22.7 | 0% |
| v2-tactics-legend | 2 | 전설 A1 | 87% | 20.7 | 0% |
| v2-tactics-legend | 2 | 전설 B1 | 74% | 21.8 | 0% |
| v2-tactics-legend | 3 | 전설 A1 | 89% | 19.3 | 0% |
| v2-tactics-legend | 3 | 전설 B1 | 82% | 20.6 | 0% |
| x-joint | 1 | 대마법사1 | 32% | 7.1 | 0% |
| x-joint | 2 | 대마법사1 | 41% | 7.2 | 0% |
| x-joint | 3 | 대마법사1 | 40% | 9.2 | 0% |
| x-salt-fort | 1 | 대마법사1 | 6% | 13.7 | 91% |
| x-salt-fort | 2 | 대마법사1 | 14% | 10.0 | 86% |
| x-salt-fort | 3 | 대마법사1 | 16% | 14.0 | 81% |
| x-scattered-30 | 1 | 대마법사1 | 99% | 16.9 | 0% |
| x-scattered-30 | 2 | 대마법사1 | 99% | 17.2 | 0% |
| x-scattered-30 | 3 | 대마법사1 | 90% | 17.1 | 0% |
| x-squad-30-ranged | 1 | 대마법사1 | 100% | 17.5 | 0% |
| x-squad-30-ranged | 2 | 대마법사1 | 98% | 17.2 | 0% |
| x-squad-30-ranged | 3 | 대마법사1 | 97% | 17.1 | 0% |
| x-squad-30 | 1 | 대마법사1 | 92% | 9.8 | 0% |
| x-squad-30 | 2 | 대마법사1 | 91% | 13.3 | 0% |
| x-squad-30 | 3 | 대마법사1 | 90% | 10.5 | 0% |

## 사건 (탐지기마다 앞의 25개)

### 체력 남기고 도망 (1251)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| archmage-50 | 1 | 1 | 무리2 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리5 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리6 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리7 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리8 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리9 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리10 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리11 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리12 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리14 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리21 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리24 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리26 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리27 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리28 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리29 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리30 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리32 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리33 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1.5 | 무리13 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 1.5 | 무리15 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 1.5 | 무리20 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 1.5 | 무리22 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 1.5 | 무리23 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 1.5 | 무리25 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |

### 헛시전 (96)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 2 | 115.43 | 번개1 | 헛시전 (장악권·소금 원) | 0.107 | [열기](../sandbox/index.html#element-league&seed=2&t=115.43) |
| element-league | 3 | 170.5 | 번개1 | 헛시전 (장악권·소금 원) | 0.108 | [열기](../sandbox/index.html#element-league&seed=3&t=170.5) |
| v2-archmage-1v10 | 1 | 19.43 | 상위1 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위2 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위3 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위4 | 헛시전 (장악권·소금 원) | 0.286 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위5 | 헛시전 (장악권·소금 원) | 0.375 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위6 | 헛시전 (장악권·소금 원) | 0.167 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위7 | 헛시전 (장악권·소금 원) | 0.333 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위8 | 헛시전 (장악권·소금 원) | 0.167 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위9 | 헛시전 (장악권·소금 원) | 0.25 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 1 | 19.43 | 상위10 | 헛시전 (장악권·소금 원) | 0.286 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=19.43) |
| v2-archmage-1v10 | 2 | 23.42 | 상위1 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위2 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위3 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위4 | 헛시전 (장악권·소금 원) | 0.182 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위5 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위6 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위7 | 헛시전 (장악권·소금 원) | 0.455 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위8 | 헛시전 (장악권·소금 원) | 0.273 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 2 | 23.42 | 상위9 | 헛시전 (장악권·소금 원) | 0.25 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=23.42) |
| v2-archmage-1v10 | 3 | 18.98 | 상위2 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=18.98) |
| v2-archmage-1v10 | 3 | 18.98 | 상위3 | 헛시전 (장악권·소금 원) | 0.333 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=18.98) |
| v2-archmage-1v10 | 3 | 18.98 | 상위4 | 헛시전 (장악권·소금 원) | 0.333 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=18.98) |
| v2-archmage-1v10 | 3 | 18.98 | 상위5 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=18.98) |

### 기회 놓침 (86)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 1 | 39.75 | 청1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=1&t=39.75) |
| duel | 2 | 10.25 | 청1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=2&t=10.25) |
| duel | 2 | 10.25 | 적1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=2&t=10.25) |
| duel | 2 | 14.25 | 적1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=2&t=14.25) |
| duel | 2 | 18.25 | 적1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=2&t=18.25) |
| element-league | 1 | 27.75 | 번개1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=1&t=27.75) |
| element-league | 2 | 25 | 얼음1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=25) |
| element-league | 2 | 25.5 | 흙1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=25.5) |
| element-league | 2 | 25.5 | 물1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=25.5) |
| element-league | 2 | 28.75 | 흙1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=28.75) |
| element-league | 3 | 59.25 | 흙1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=59.25) |
| v2-army-salt-city | 1 | 21.25 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=21.25) |
| v2-challenger-3 | 2 | 10.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=10.25) |
| v2-challenger-3 | 3 | 31 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=31) |
| v2-crowd-1v20 | 3 | 8.75 | 상위19 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=8.75) |
| v2-crowd-1v20 | 3 | 22.75 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=22.75) |
| v2-sky-musket | 1 | 9.25 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-musket&seed=1&t=9.25) |
| v2-sky-musket | 2 | 8.5 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-musket&seed=2&t=8.5) |
| v2-sky-narrow | 3 | 22.5 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=22.5) |
| v2-sky-narrow | 3 | 27.75 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=27.75) |
| v2-sky-narrow | 3 | 32.25 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=32.25) |
| v2-sky-narrow | 3 | 36.25 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=36.25) |
| v2-sky-narrow | 3 | 49.5 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=49.5) |
| v2-sky-narrow | 3 | 56.25 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=56.25) |
| v2-sky-narrow | 3 | 62.75 | 대가1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=62.75) |

### 명중 범위 밖 (28)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 36.93 | 적1 | 명중 범위 밖 (중간) | 0.098 | [열기](../sandbox/index.html#duel&seed=2&t=36.93) |
| element-league | 1 | 152.88 | 흙1 | 명중 범위 밖 (평범) | 0.039 | [열기](../sandbox/index.html#element-league&seed=1&t=152.88) |
| element-league | 3 | 170.5 | 얼음1 | 명중 범위 밖 (평범) | 0.054 | [열기](../sandbox/index.html#element-league&seed=3&t=170.5) |
| v2-challenger-3 | 1 | 33.73 | 초보1 | 명중 범위 밖 (평범) | 0 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=33.73) |
| v2-crowd-1v20 | 1 | 56.07 | 상위16 | 명중 범위 밖 (상위) | 0.048 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=56.07) |
| v2-crowd-1v20 | 2 | 53.1 | 상위3 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=53.1) |
| v2-crowd-1v20 | 2 | 53.1 | 상위4 | 명중 범위 밖 (상위) | 0.04 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=53.1) |
| v2-crowd-1v20 | 2 | 53.1 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=53.1) |
| v2-crowd-1v20 | 2 | 53.1 | 상위13 | 명중 범위 밖 (상위) | 0.038 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=53.1) |
| v2-crowd-1v20 | 2 | 53.1 | 상위15 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=53.1) |
| v2-crowd-1v20 | 2 | 53.1 | 상위16 | 명중 범위 밖 (상위) | 0.053 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=53.1) |
| v2-sky-narrow | 3 | 71.97 | 대가1 | 명중 범위 밖 (대마법사) | 0 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=71.97) |
| v2-sky-wide | 1 | 49.3 | 대가1 | 명중 범위 밖 (대마법사) | 0.059 | [열기](../sandbox/index.html#v2-sky-wide&seed=1&t=49.3) |
| v2-sky-wide | 3 | 73.22 | 대가1 | 명중 범위 밖 (대마법사) | 0.052 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=73.22) |
| x-squad-30-ranged | 1 | 44.98 | 상위5 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=44.98) |
| x-squad-30-ranged | 1 | 44.98 | 상위28 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=44.98) |
| x-squad-30-ranged | 2 | 40.82 | 상위11 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=40.82) |
| x-squad-30-ranged | 2 | 40.82 | 상위19 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=40.82) |
| x-squad-30-ranged | 2 | 40.82 | 상위21 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=40.82) |
| x-squad-30-ranged | 2 | 40.82 | 상위27 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=40.82) |
| x-squad-30-ranged | 3 | 41.98 | 상위6 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=41.98) |
| x-squad-30-ranged | 3 | 41.98 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=41.98) |
| x-squad-30-ranged | 3 | 41.98 | 상위14 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=41.98) |
| x-squad-30 | 1 | 59.1 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30&seed=1&t=59.1) |
| x-squad-30 | 2 | 63.33 | 상위7 | 명중 범위 밖 (상위) | 0.056 | [열기](../sandbox/index.html#x-squad-30&seed=2&t=63.33) |

### 막혀 제자리 (25)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 145.75 | 물1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=1&t=145.75) |
| element-league | 2 | 109.75 | 독1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=2&t=109.75) |
| element-league | 3 | 112.25 | 물1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=3&t=112.25) |
| element-league | 3 | 130 | 물1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=3&t=130) |
| element-league | 3 | 147.75 | 물1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=3&t=147.75) |
| element-league | 3 | 167.25 | 물1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=3&t=167.25) |
| v2-army-salt-city | 1 | 20 | 총병32 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=20) |
| v2-army-salt-city | 2 | 8 | 총병32 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=8) |
| v2-army-salt-city | 3 | 41 | 총병12 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=41) |
| v2-army-salt-city | 3 | 41.5 | 총병24 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=41.5) |
| v2-army-salt-city | 3 | 44 | 총병12 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=44) |
| v2-army-salt-city | 3 | 46.25 | 총병17 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=46.25) |
| v2-crowd-1v20 | 2 | 30 | 상위7 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=30) |
| v2-crowd-1v20 | 2 | 30 | 상위11 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=30) |
| v2-crowd-1v20 | 2 | 33 | 상위7 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=33) |
| v2-crowd-1v20 | 2 | 33 | 상위11 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=33) |
| v2-crowd-1v20 | 2 | 36 | 상위7 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=36) |
| v2-crowd-1v20 | 2 | 36 | 상위11 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=36) |
| v2-crowd-1v20 | 2 | 39 | 상위7 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=39) |
| v2-crowd-1v20 | 2 | 39 | 상위11 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=39) |
| v2-neighbor-plain | 1 | 62.5 | 대가1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-neighbor-plain&seed=1&t=62.5) |
| x-salt-fort | 3 | 19.75 | 대마법사1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=19.75) |
| x-squad-30-ranged | 3 | 28.25 | 상위10 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=28.25) |
| x-squad-30 | 1 | 29 | 상위23 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30&seed=1&t=29) |
| x-squad-30 | 1 | 39 | 상위1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30&seed=1&t=39) |

### 스스로 입은 피해 몫 (23)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 1 | 42.45 | 청1 | 스스로 입은 피해 몫 | 0.102 | [열기](../sandbox/index.html#duel&seed=1&t=42.45) |
| duel | 1 | 42.45 | 적1 | 스스로 입은 피해 몫 | 0.146 | [열기](../sandbox/index.html#duel&seed=1&t=42.45) |
| duel | 2 | 36.93 | 청1 | 스스로 입은 피해 몫 | 0.286 | [열기](../sandbox/index.html#duel&seed=2&t=36.93) |
| duel | 3 | 21.15 | 청1 | 스스로 입은 피해 몫 | 0.277 | [열기](../sandbox/index.html#duel&seed=3&t=21.15) |
| element-league | 1 | 152.88 | 불1 | 스스로 입은 피해 몫 | 0.209 | [열기](../sandbox/index.html#element-league&seed=1&t=152.88) |
| element-league | 1 | 152.88 | 흙1 | 스스로 입은 피해 몫 | 0.327 | [열기](../sandbox/index.html#element-league&seed=1&t=152.88) |
| element-league | 3 | 170.5 | 번개1 | 스스로 입은 피해 몫 | 0.127 | [열기](../sandbox/index.html#element-league&seed=3&t=170.5) |
| element-league | 3 | 170.5 | 흙1 | 스스로 입은 피해 몫 | 0.173 | [열기](../sandbox/index.html#element-league&seed=3&t=170.5) |
| v2-archmage-100 | 2 | 15.87 | 대마법사1 | 스스로 입은 피해 몫 | 0.716 | [열기](../sandbox/index.html#v2-archmage-100&seed=2&t=15.87) |
| v2-archmage-2v6 | 1 | 14.7 | 대마법사1 | 스스로 입은 피해 몫 | 0.987 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=14.7) |
| v2-archmage-2v6 | 2 | 13.45 | 대마법사1 | 스스로 입은 피해 몫 | 0.979 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=2&t=13.45) |
| v2-archmage-2v6 | 3 | 16.17 | 대마법사2 | 스스로 입은 피해 몫 | 0.514 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=16.17) |
| v2-challenger-3 | 1 | 33.73 | 초보2 | 스스로 입은 피해 몫 | 0.279 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=33.73) |
| v2-challenger-3 | 2 | 21.52 | 초보1 | 스스로 입은 피해 몫 | 0.141 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=21.52) |
| v2-challenger-3 | 3 | 36.87 | 초보2 | 스스로 입은 피해 몫 | 0.43 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=36.87) |
| v2-neighbor-mid | 1 | 23.18 | 상급1 | 스스로 입은 피해 몫 | 0.137 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=1&t=23.18) |
| v2-neighbor-mid | 2 | 23.62 | 상급1 | 스스로 입은 피해 몫 | 0.252 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=23.62) |
| v2-neighbor-mid | 3 | 20.93 | 상급1 | 스스로 입은 피해 몫 | 0.141 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=20.93) |
| v2-sky-narrow | 1 | 28.82 | 대가1 | 스스로 입은 피해 몫 | 0.106 | [열기](../sandbox/index.html#v2-sky-narrow&seed=1&t=28.82) |
| v2-sky-narrow | 1 | 28.82 | 상급1 | 스스로 입은 피해 몫 | 0.484 | [열기](../sandbox/index.html#v2-sky-narrow&seed=1&t=28.82) |
| v2-sky-narrow | 2 | 30.17 | 대가1 | 스스로 입은 피해 몫 | 0.267 | [열기](../sandbox/index.html#v2-sky-narrow&seed=2&t=30.17) |
| v2-sky-narrow | 2 | 30.17 | 상급1 | 스스로 입은 피해 몫 | 0.515 | [열기](../sandbox/index.html#v2-sky-narrow&seed=2&t=30.17) |
| v2-tactics-legend | 3 | 60.97 | 전설 A1 | 스스로 입은 피해 몫 | 0.199 | [열기](../sandbox/index.html#v2-tactics-legend&seed=3&t=60.97) |

### 떨림 (18)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 47.75 | 번개1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=47.75) |
| element-league | 1 | 70.5 | 번개1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=70.5) |
| element-league | 1 | 81 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=81) |
| element-league | 1 | 92.75 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=92.75) |
| element-league | 1 | 105.75 | 얼음1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=105.75) |
| element-league | 2 | 93.75 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=93.75) |
| element-league | 2 | 113.25 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=113.25) |
| element-league | 3 | 49.75 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=49.75) |
| element-league | 3 | 94.25 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=94.25) |
| element-league | 3 | 117.5 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=117.5) |
| v2-army-field | 1 | 63.5 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=63.5) |
| v2-army-salt-city | 3 | 42.25 | 총병38 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=42.25) |
| v2-army-salt-city | 3 | 42.5 | 총병8 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=42.5) |
| v2-army-salt-city | 3 | 42.75 | 총병25 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=42.75) |
| v2-army-salt-city | 3 | 43.25 | 총병23 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=43.25) |
| v2-neighbor-plain | 1 | 61.75 | 대가1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-neighbor-plain&seed=1&t=61.75) |
| v2-neighbor-plain | 2 | 55.5 | 대가1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-neighbor-plain&seed=2&t=55.5) |
| v2-sky-wide | 2 | 64.25 | 전설1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-sky-wide&seed=2&t=64.25) |

### 위험 지대 (15)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 60 | 번개1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=60) |
| element-league | 2 | 68.5 | 얼음1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=2&t=68.5) |
| element-league | 2 | 94.5 | 얼음1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=2&t=94.5) |
| element-league | 3 | 73 | 물1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=73) |
| v2-army-salt-city | 1 | 6.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=6.5) |
| v2-army-salt-city | 1 | 8.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=8.25) |
| v2-army-salt-city | 2 | 6.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=6.25) |
| v2-army-salt-city | 3 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=6.75) |
| v2-army-salt-city | 3 | 58.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=58.75) |
| x-salt-fort | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=4.25) |
| x-salt-fort | 1 | 5.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=5.75) |
| x-salt-fort | 1 | 10.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=10.5) |
| x-salt-fort | 2 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=4.25) |
| x-salt-fort | 3 | 5.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=5.75) |
| x-salt-fort | 3 | 9 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=9) |

### 역류 (8)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 3 | 21.15 | 청1 | 역류 (번) | 2 | [열기](../sandbox/index.html#duel&seed=3&t=21.15) |
| v2-archmage-2v6 | 1 | 14.7 | 대마법사1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=14.7) |
| v2-challenger-3 | 1 | 33.73 | 초보2 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=33.73) |
| v2-challenger-3 | 2 | 21.52 | 초보1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=21.52) |
| v2-challenger-3 | 3 | 36.87 | 초보2 | 역류 (번) | 3 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=36.87) |
| v2-neighbor-mid | 1 | 23.18 | 상급1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=1&t=23.18) |
| v2-neighbor-mid | 2 | 23.62 | 상급1 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=23.62) |
| v2-neighbor-mid | 3 | 20.93 | 상급1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=20.93) |

### 같은 수 되풀이 몫 (8)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 1 | 27.7 | 대마법사1 | 같은 수 되풀이 몫 | 0.647 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=27.7) |
| v2-army-salt-city | 2 | 21.03 | 대마법사1 | 같은 수 되풀이 몫 | 0.733 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=21.03) |
| v2-sky-wide | 3 | 73.22 | 전설1 | 같은 수 되풀이 몫 | 0.603 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=73.22) |
| x-scattered-30 | 1 | 43.38 | 상위1 | 같은 수 되풀이 몫 | 0.923 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=43.38) |
| x-scattered-30 | 1 | 43.38 | 상위25 | 같은 수 되풀이 몫 | 0.929 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=43.38) |
| x-scattered-30 | 2 | 44.77 | 상위13 | 같은 수 되풀이 몫 | 0.929 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=44.77) |
| x-scattered-30 | 3 | 47.32 | 상위1 | 같은 수 되풀이 몫 | 0.929 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=47.32) |
| x-scattered-30 | 3 | 47.32 | 상위13 | 같은 수 되풀이 몫 | 0.875 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=47.32) |

### 대마법사: 소금 위 몫 (6)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 1 | 27.7 | 대마법사1 | 대마법사: 소금 위 몫 | 0.791 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=27.7) |
| v2-army-salt-city | 2 | 21.03 | 대마법사1 | 대마법사: 소금 위 몫 | 0.762 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=21.03) |
| v2-army-salt-city | 3 | 62.58 | 대마법사1 | 대마법사: 소금 위 몫 | 0.536 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=62.58) |
| x-salt-fort | 1 | 51.6 | 대마법사1 | 대마법사: 소금 위 몫 | 0.908 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=51.6) |
| x-salt-fort | 2 | 22.17 | 대마법사1 | 대마법사: 소금 위 몫 | 0.864 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=22.17) |
| x-salt-fort | 3 | 23.35 | 대마법사1 | 대마법사: 소금 위 몫 | 0.806 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=23.35) |

### 아군 피해 몫 (5)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-2v6 | 3 | 16.17 | 편 0 | 아군 피해 몫 | 0.479 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=16.17) |
| v2-musket-40 | 2 | 0.52 | 편 1 | 아군 피해 몫 | 1 | [열기](../sandbox/index.html#v2-musket-40&seed=2&t=0.52) |
| v2-musket-40 | 3 | 0.45 | 편 1 | 아군 피해 몫 | 1 | [열기](../sandbox/index.html#v2-musket-40&seed=3&t=0.45) |
| x-salt-fort | 2 | 22.17 | 편 1 | 아군 피해 몫 | 0.946 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=22.17) |
| x-squad-30-ranged | 3 | 41.98 | 편 1 | 아군 피해 몫 | 0.128 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=41.98) |

### 헛시전: 알 수 있었던 것 (3)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 1 | 27.7 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.167 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=27.7) |
| x-salt-fort | 1 | 51.6 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.458 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=51.6) |
| x-salt-fort | 3 | 23.35 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.273 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=23.35) |

### 데이터: 장면의 자리가 판 밖 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| 데이터 | 0 | 0 | v2-army-salt-city | 데이터: 장면의 자리가 판 밖 | 201,45 |  |

### 대마법사: 총 앞에 서 있음 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-prepared | 3 | 1.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-prepared&seed=3&t=1.25) |
