# 지능 점검

엔진 v2.30.0 · 2026-10-03 · 장면 28개 × 씨앗 1·2·3 · 18 s. 문턱은 `data/rules/audit.json`, 만든 명령 `node cli.js audit`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.

## 탐지기별 사건 수

| 탐지기 | 사건 | 장면 수 |
|---|---|---|
| 체력 남기고 도망 | 916 | 20 |
| 기회 놓침 | 141 | 12 |
| 헛시전 | 134 | 11 |
| 명중 범위 밖 | 58 | 7 |
| 위험 지대 | 30 | 3 |
| 스스로 입은 피해 몫 | 20 | 8 |
| 떨림 | 16 | 4 |
| 역류 | 14 | 4 |
| 막혀 제자리 | 11 | 6 |
| 대마법사: 총 앞에 서 있음 | 8 | 1 |
| 같은 수 되풀이 몫 | 8 | 2 |
| 대마법사: 소금 위 몫 | 6 | 2 |
| 아군 피해 몫 | 5 | 3 |
| 헛시전: 알 수 있었던 것 | 2 | 2 |
| 데이터: 장면의 자리가 판 밖 | 1 | 1 |

## 장면별 사건 수

| 장면 | 사건 |
|---|---|
| v2-archmage-100 | 174 |
| v2-army-field | 171 |
| x-squad-30 | 102 |
| v2-army-salt-city | 81 |
| v2-army-ambush | 76 |
| x-joint | 76 |
| x-squad-30-ranged | 74 |
| v2-army-prepared | 73 |
| x-salt-fort | 71 |
| archmage-50 | 68 |
| v2-crowd-1v20 | 61 |
| x-top-vs-plain30 | 41 |
| v2-squad-10 | 40 |
| v2-archmage-1v10 | 38 |
| v2-musket-40 | 38 |
| x-scattered-30 | 32 |
| element-league | 26 |
| musket-arc | 25 |
| v2-challenger-3 | 20 |
| v2-sky-musket | 19 |
| v2-sky-wide | 19 |
| v2-archmage-2v6 | 16 |
| v2-squad-10-scattered | 9 |
| v2-neighbor-mid | 8 |
| v2-sky-narrow | 4 |
| v2-tactics-legend | 4 |
| duel | 3 |
| 데이터 | 1 |

## 대마법사 (판마다)

| 장면 | 씨앗 | 누구 | 떠 있는 몫 | 평균 속도 (m/s) | 소금 위 몫 |
|---|---|---|---|---|---|
| archmage-50 | 1 | 대마법사1 | 94% | 6.4 | 0% |
| archmage-50 | 2 | 대마법사1 | 95% | 9.8 | 0% |
| archmage-50 | 3 | 대마법사1 | 97% | 7.0 | 0% |
| musket-arc | 1 | 대마법사1 | 39% | 10.5 | 0% |
| musket-arc | 2 | 대마법사1 | 42% | 10.2 | 0% |
| musket-arc | 3 | 대마법사1 | 7% | 7.0 | 0% |
| v2-archmage-100 | 1 | 대마법사1 | 99% | 14.2 | 0% |
| v2-archmage-100 | 2 | 대마법사1 | 99% | 12.8 | 0% |
| v2-archmage-100 | 3 | 대마법사1 | 98% | 13.5 | 0% |
| v2-archmage-1v10 | 1 | 대마법사1 | 91% | 14.7 | 0% |
| v2-archmage-1v10 | 2 | 대마법사1 | 91% | 13.8 | 0% |
| v2-archmage-1v10 | 3 | 대마법사1 | 84% | 13.7 | 0% |
| v2-archmage-2v6 | 1 | 대마법사1 | 97% | 17.8 | 0% |
| v2-archmage-2v6 | 1 | 대마법사2 | 98% | 18.6 | 0% |
| v2-archmage-2v6 | 2 | 대마법사1 | 98% | 18.9 | 0% |
| v2-archmage-2v6 | 2 | 대마법사2 | 88% | 18.2 | 0% |
| v2-archmage-2v6 | 3 | 대마법사1 | 99% | 18.9 | 0% |
| v2-archmage-2v6 | 3 | 대마법사2 | 99% | 18.0 | 0% |
| v2-army-ambush | 1 | 대마법사1 | 29% | 8.0 | 0% |
| v2-army-ambush | 2 | 대마법사1 | 5% | 6.6 | 0% |
| v2-army-ambush | 3 | 대마법사1 | 0% | 2.0 | 0% |
| v2-army-field | 1 | 대마법사1 | 56% | 6.6 | 0% |
| v2-army-field | 2 | 대마법사1 | 63% | 11.4 | 0% |
| v2-army-field | 3 | 대마법사1 | 68% | 7.7 | 0% |
| v2-army-prepared | 1 | 대마법사1 | 5% | 7.1 | 0% |
| v2-army-prepared | 2 | 대마법사1 | 5% | 1.8 | 0% |
| v2-army-prepared | 3 | 대마법사1 | 7% | 1.3 | 0% |
| v2-army-salt-city | 1 | 대마법사1 | 14% | 6.8 | 16% |
| v2-army-salt-city | 2 | 대마법사1 | 24% | 7.7 | 16% |
| v2-army-salt-city | 3 | 대마법사1 | 52% | 10.4 | 31% |
| v2-crowd-1v20 | 1 | 대마법사1 | 92% | 11.7 | 0% |
| v2-crowd-1v20 | 2 | 대마법사1 | 87% | 14.2 | 0% |
| v2-crowd-1v20 | 3 | 대마법사1 | 85% | 14.4 | 0% |
| v2-musket-40 | 1 | 대마법사1 | 54% | 7.3 | 0% |
| v2-musket-40 | 2 | 대마법사1 | 0% | 7.8 | 0% |
| v2-musket-40 | 3 | 대마법사1 | 0% | 9.0 | 0% |
| v2-sky-musket | 1 | 대마법사1 | 99% | 13.4 | 0% |
| v2-sky-musket | 2 | 대마법사1 | 99% | 27.7 | 0% |
| v2-sky-musket | 3 | 대마법사1 | 99% | 18.4 | 0% |
| v2-sky-narrow | 1 | 대가1 | 88% | 21.3 | 0% |
| v2-sky-narrow | 1 | 상급1 | 90% | 21.7 | 0% |
| v2-sky-narrow | 2 | 대가1 | 93% | 20.2 | 0% |
| v2-sky-narrow | 2 | 상급1 | 83% | 19.1 | 0% |
| v2-sky-narrow | 3 | 대가1 | 92% | 19.7 | 0% |
| v2-sky-narrow | 3 | 상급1 | 79% | 14.9 | 0% |
| v2-sky-wide | 1 | 전설1 | 99% | 22.5 | 0% |
| v2-sky-wide | 1 | 대가1 | 98% | 24.9 | 0% |
| v2-sky-wide | 2 | 전설1 | 93% | 22.2 | 0% |
| v2-sky-wide | 2 | 대가1 | 94% | 23.4 | 0% |
| v2-sky-wide | 3 | 전설1 | 100% | 23.8 | 0% |
| v2-sky-wide | 3 | 대가1 | 100% | 24.0 | 0% |
| v2-squad-10-scattered | 1 | 대마법사1 | 100% | 15.9 | 0% |
| v2-squad-10-scattered | 2 | 대마법사1 | 99% | 16.1 | 0% |
| v2-squad-10-scattered | 3 | 대마법사1 | 99% | 17.5 | 0% |
| v2-squad-10 | 1 | 대마법사1 | 100% | 15.6 | 0% |
| v2-squad-10 | 2 | 대마법사1 | 99% | 16.1 | 0% |
| v2-squad-10 | 3 | 대마법사1 | 99% | 15.9 | 0% |
| v2-tactics-legend | 1 | 전설 A1 | 94% | 21.4 | 0% |
| v2-tactics-legend | 1 | 전설 B1 | 95% | 22.7 | 0% |
| v2-tactics-legend | 2 | 전설 A1 | 87% | 20.7 | 0% |
| v2-tactics-legend | 2 | 전설 B1 | 74% | 21.8 | 0% |
| v2-tactics-legend | 3 | 전설 A1 | 89% | 19.3 | 0% |
| v2-tactics-legend | 3 | 전설 B1 | 82% | 20.6 | 0% |
| x-joint | 1 | 대마법사1 | 27% | 7.0 | 0% |
| x-joint | 2 | 대마법사1 | 21% | 9.0 | 0% |
| x-joint | 3 | 대마법사1 | 61% | 14.1 | 0% |
| x-salt-fort | 1 | 대마법사1 | 18% | 8.5 | 16% |
| x-salt-fort | 2 | 대마법사1 | 19% | 11.8 | 21% |
| x-salt-fort | 3 | 대마법사1 | 28% | 13.5 | 23% |
| x-scattered-30 | 1 | 대마법사1 | 100% | 16.8 | 0% |
| x-scattered-30 | 2 | 대마법사1 | 95% | 16.7 | 0% |
| x-scattered-30 | 3 | 대마법사1 | 95% | 14.3 | 0% |
| x-squad-30-ranged | 1 | 대마법사1 | 100% | 18.7 | 0% |
| x-squad-30-ranged | 2 | 대마법사1 | 98% | 17.9 | 0% |
| x-squad-30-ranged | 3 | 대마법사1 | 99% | 16.5 | 0% |
| x-squad-30 | 1 | 대마법사1 | 87% | 12.7 | 0% |
| x-squad-30 | 2 | 대마법사1 | 98% | 15.1 | 0% |
| x-squad-30 | 3 | 대마법사1 | 86% | 11.1 | 0% |

## 사건 (탐지기마다 앞의 25개)

### 체력 남기고 도망 (916)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| archmage-50 | 1 | 1 | 무리5 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리6 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1 | 무리12 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1) |
| archmage-50 | 1 | 1.5 | 무리20 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 1.5 | 무리33 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=1.5) |
| archmage-50 | 1 | 2 | 무리7 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리8 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리11 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리13 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리14 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리15 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리18 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리27 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2 | 무리29 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2) |
| archmage-50 | 1 | 2.5 | 무리2 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2.5) |
| archmage-50 | 1 | 2.5 | 무리26 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2.5) |
| archmage-50 | 1 | 2.5 | 무리32 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=1&t=2.5) |
| archmage-50 | 2 | 1 | 무리6 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1) |
| archmage-50 | 2 | 1 | 무리11 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1) |
| archmage-50 | 2 | 1 | 무리27 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1) |
| archmage-50 | 2 | 1.5 | 무리8 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1.5) |
| archmage-50 | 2 | 1.5 | 무리9 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1.5) |
| archmage-50 | 2 | 1.5 | 무리12 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1.5) |
| archmage-50 | 2 | 1.5 | 무리14 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1.5) |
| archmage-50 | 2 | 1.5 | 무리16 | 체력 남기고 도망 (평범) | 1 | [열기](../sandbox/index.html#archmage-50&seed=2&t=1.5) |

### 기회 놓침 (141)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 1 | 15 | 적1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=1&t=15) |
| element-league | 1 | 47 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=1&t=47) |
| element-league | 2 | 21.75 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=21.75) |
| element-league | 2 | 26 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=26) |
| element-league | 2 | 66 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=66) |
| element-league | 3 | 28.75 | 흙1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=28.75) |
| element-league | 3 | 37 | 얼음1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=37) |
| element-league | 3 | 51 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=51) |
| v2-challenger-3 | 1 | 14.5 | 초보2 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=14.5) |
| v2-challenger-3 | 1 | 28.75 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=28.75) |
| v2-challenger-3 | 1 | 31.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=31.25) |
| v2-challenger-3 | 3 | 33.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=33.25) |
| v2-crowd-1v20 | 1 | 10.5 | 상위7 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=10.5) |
| v2-crowd-1v20 | 1 | 28 | 상위7 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=28) |
| v2-crowd-1v20 | 1 | 31.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=31.25) |
| v2-crowd-1v20 | 1 | 33.75 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=33.75) |
| v2-crowd-1v20 | 1 | 48.25 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=48.25) |
| v2-crowd-1v20 | 1 | 49 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=49) |
| v2-crowd-1v20 | 2 | 12.75 | 상위7 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=12.75) |
| v2-crowd-1v20 | 3 | 12.75 | 상위19 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=12.75) |
| v2-crowd-1v20 | 3 | 13.25 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=13.25) |
| v2-crowd-1v20 | 3 | 39 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=39) |
| v2-sky-musket | 1 | 5.5 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-musket&seed=1&t=5.5) |
| v2-sky-musket | 2 | 7.25 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-musket&seed=2&t=7.25) |
| v2-sky-wide | 2 | 63.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-sky-wide&seed=2&t=63.25) |

### 헛시전 (134)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-1v10 | 1 | 42.03 | 상위1 | 헛시전 (장악권·소금 원) | 0.241 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위2 | 헛시전 (장악권·소금 원) | 0.333 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위3 | 헛시전 (장악권·소금 원) | 0.226 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위4 | 헛시전 (장악권·소금 원) | 0.167 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위5 | 헛시전 (장악권·소금 원) | 0.267 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위6 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위7 | 헛시전 (장악권·소금 원) | 0.211 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위8 | 헛시전 (장악권·소금 원) | 0.111 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위9 | 헛시전 (장악권·소금 원) | 0.273 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 1 | 42.03 | 상위10 | 헛시전 (장악권·소금 원) | 0.273 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 2 | 32.38 | 상위1 | 헛시전 (장악권·소금 원) | 0.333 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위2 | 헛시전 (장악권·소금 원) | 0.364 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위3 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위4 | 헛시전 (장악권·소금 원) | 0.25 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위5 | 헛시전 (장악권·소금 원) | 0.348 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위6 | 헛시전 (장악권·소금 원) | 0.167 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위7 | 헛시전 (장악권·소금 원) | 0.278 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위8 | 헛시전 (장악권·소금 원) | 0.211 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위9 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 3 | 28.42 | 상위1 | 헛시전 (장악권·소금 원) | 0.25 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-archmage-1v10 | 3 | 28.42 | 상위2 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-archmage-1v10 | 3 | 28.42 | 상위3 | 헛시전 (장악권·소금 원) | 0.273 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-archmage-1v10 | 3 | 28.42 | 상위4 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-archmage-1v10 | 3 | 28.42 | 상위5 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-archmage-1v10 | 3 | 28.42 | 상위6 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |

### 명중 범위 밖 (58)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 121.82 | 흙1 | 명중 범위 밖 (평범) | 0.051 | [열기](../sandbox/index.html#element-league&seed=1&t=121.82) |
| v2-archmage-1v10 | 1 | 42.03 | 상위1 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 명중 범위 밖 (평범) | 0.067 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 명중 범위 밖 (평범) | 0.077 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-crowd-1v20 | 1 | 52.05 | 상위19 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=52.05) |
| v2-crowd-1v20 | 2 | 43.13 | 상위4 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=43.13) |
| v2-crowd-1v20 | 2 | 43.13 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=43.13) |
| v2-crowd-1v20 | 3 | 42.32 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=42.32) |
| v2-crowd-1v20 | 3 | 42.32 | 상위16 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=42.32) |
| v2-crowd-1v20 | 3 | 42.32 | 상위19 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=42.32) |
| v2-sky-wide | 1 | 49.3 | 대가1 | 명중 범위 밖 (대마법사) | 0.059 | [열기](../sandbox/index.html#v2-sky-wide&seed=1&t=49.3) |
| v2-sky-wide | 3 | 65.7 | 대가1 | 명중 범위 밖 (대마법사) | 0.031 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=65.7) |
| x-squad-30-ranged | 1 | 64.78 | 상위2 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위4 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위8 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위11 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위16 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위17 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 1 | 64.78 | 상위27 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 2 | 77.77 | 상위2 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=77.77) |
| x-squad-30-ranged | 2 | 77.77 | 상위6 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=77.77) |
| x-squad-30-ranged | 2 | 77.77 | 상위7 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=77.77) |
| x-squad-30-ranged | 2 | 77.77 | 상위9 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=77.77) |
| x-squad-30-ranged | 2 | 77.77 | 상위11 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=77.77) |

### 위험 지대 (30)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 60.5 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=60.5) |
| element-league | 1 | 74.75 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=74.75) |
| element-league | 1 | 83.25 | 얼음1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=83.25) |
| element-league | 2 | 107.5 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=2&t=107.5) |
| element-league | 3 | 54.5 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=54.5) |
| element-league | 3 | 55.25 | 번개1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=55.25) |
| element-league | 3 | 68.75 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=68.75) |
| v2-army-salt-city | 1 | 6.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=6.5) |
| v2-army-salt-city | 1 | 26.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=26.75) |
| v2-army-salt-city | 2 | 7 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=7) |
| v2-army-salt-city | 2 | 12.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=12.75) |
| v2-army-salt-city | 2 | 20.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=20.25) |
| v2-army-salt-city | 2 | 63.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=63.75) |
| v2-army-salt-city | 3 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=6.75) |
| v2-army-salt-city | 3 | 25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=25) |
| v2-army-salt-city | 3 | 32.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=32.5) |
| v2-army-salt-city | 3 | 40.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=40.75) |
| v2-army-salt-city | 3 | 49.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=49.5) |
| v2-army-salt-city | 3 | 71.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=71.25) |
| v2-army-salt-city | 3 | 80.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=80.25) |
| x-salt-fort | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=4.25) |
| x-salt-fort | 1 | 5.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=5.75) |
| x-salt-fort | 1 | 11.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=11.25) |
| x-salt-fort | 2 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=4.25) |
| x-salt-fort | 2 | 7.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=7.25) |

### 스스로 입은 피해 몫 (20)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 11.38 | 청1 | 스스로 입은 피해 몫 | 0.145 | [열기](../sandbox/index.html#duel&seed=2&t=11.38) |
| v2-archmage-1v10 | 2 | 32.38 | 대마법사1 | 스스로 입은 피해 몫 | 0.942 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위8 | 스스로 입은 피해 몫 | 0.144 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 3 | 28.42 | 대마법사1 | 스스로 입은 피해 몫 | 0.905 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-archmage-2v6 | 2 | 15.03 | 대마법사2 | 스스로 입은 피해 몫 | 0.996 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=2&t=15.03) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 스스로 입은 피해 몫 | 0.271 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 2 | 26.73 | 초보1 | 스스로 입은 피해 몫 | 0.14 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보2 | 스스로 입은 피해 몫 | 0.748 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보3 | 스스로 입은 피해 몫 | 0.364 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 스스로 입은 피해 몫 | 0.358 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-challenger-3 | 3 | 37.62 | 초보2 | 스스로 입은 피해 몫 | 0.147 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-crowd-1v20 | 3 | 42.32 | 대마법사1 | 스스로 입은 피해 몫 | 0.452 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=42.32) |
| v2-neighbor-mid | 1 | 16.47 | 상급1 | 스스로 입은 피해 몫 | 0.277 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=1&t=16.47) |
| v2-neighbor-mid | 2 | 35.92 | 상급1 | 스스로 입은 피해 몫 | 0.404 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=35.92) |
| v2-neighbor-mid | 3 | 22.73 | 상급1 | 스스로 입은 피해 몫 | 0.145 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=22.73) |
| v2-sky-narrow | 1 | 27.72 | 대가1 | 스스로 입은 피해 몫 | 0.206 | [열기](../sandbox/index.html#v2-sky-narrow&seed=1&t=27.72) |
| v2-sky-narrow | 1 | 27.72 | 상급1 | 스스로 입은 피해 몫 | 0.477 | [열기](../sandbox/index.html#v2-sky-narrow&seed=1&t=27.72) |
| v2-sky-narrow | 2 | 23.93 | 상급1 | 스스로 입은 피해 몫 | 0.435 | [열기](../sandbox/index.html#v2-sky-narrow&seed=2&t=23.93) |
| v2-sky-narrow | 3 | 17.98 | 상급1 | 스스로 입은 피해 몫 | 0.444 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=17.98) |
| v2-tactics-legend | 3 | 60.97 | 전설 A1 | 스스로 입은 피해 몫 | 0.199 | [열기](../sandbox/index.html#v2-tactics-legend&seed=3&t=60.97) |

### 떨림 (16)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 63 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=63) |
| element-league | 1 | 71.75 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=71.75) |
| element-league | 1 | 96.5 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=96.5) |
| element-league | 1 | 110 | 불1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=110) |
| element-league | 2 | 25 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=25) |
| element-league | 2 | 33.25 | 번개1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=33.25) |
| element-league | 2 | 52.5 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=52.5) |
| element-league | 2 | 57.5 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=57.5) |
| element-league | 2 | 97.5 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=97.5) |
| element-league | 2 | 111 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=111) |
| element-league | 3 | 29 | 물1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=29) |
| v2-army-field | 1 | 89.75 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=89.75) |
| v2-army-field | 3 | 78.25 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=78.25) |
| v2-neighbor-mid | 2 | 27 | 상급1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=27) |
| v2-neighbor-mid | 3 | 16.75 | 대가1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=16.75) |
| v2-sky-wide | 2 | 64.25 | 전설1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-sky-wide&seed=2&t=64.25) |

### 역류 (14)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 11.38 | 청1 | 역류 (번) | 1 | [열기](../sandbox/index.html#duel&seed=2&t=11.38) |
| v2-archmage-1v10 | 1 | 42.03 | 상위10 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=42.03) |
| v2-archmage-1v10 | 2 | 32.38 | 상위8 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 2 | 32.38 | 상위9 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=32.38) |
| v2-archmage-1v10 | 3 | 28.42 | 대마법사1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=28.42) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 2 | 26.73 | 초보1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보2 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보3 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-challenger-3 | 3 | 37.62 | 초보2 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-neighbor-mid | 1 | 16.47 | 상급1 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=1&t=16.47) |
| v2-neighbor-mid | 2 | 35.92 | 상급1 | 역류 (번) | 3 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=35.92) |
| v2-neighbor-mid | 3 | 22.73 | 상급1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=22.73) |

### 막혀 제자리 (11)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-1v10 | 3 | 21.5 | 상위3 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=21.5) |
| v2-army-ambush | 3 | 5.25 | 총병36 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-ambush&seed=3&t=5.25) |
| v2-army-field | 1 | 31.25 | 군대94 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=31.25) |
| v2-army-salt-city | 2 | 6 | 총병31 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=6) |
| v2-army-salt-city | 2 | 12 | 총병17 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=12) |
| v2-army-salt-city | 2 | 43.5 | 총병12 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=43.5) |
| v2-army-salt-city | 3 | 12.75 | 총병4 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=12.75) |
| v2-army-salt-city | 3 | 41 | 총병23 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=41) |
| x-squad-30-ranged | 2 | 7.75 | 상위20 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=7.75) |
| x-squad-30 | 2 | 49 | 상위16 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30&seed=2&t=49) |
| x-squad-30 | 3 | 92.25 | 상위7 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=92.25) |

### 대마법사: 총 앞에 서 있음 (8)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-field | 1 | 16.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=16.5) |
| v2-army-field | 1 | 18.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=18.5) |
| v2-army-field | 1 | 23.75 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=23.75) |
| v2-army-field | 2 | 13.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=2&t=13.25) |
| v2-army-field | 2 | 16.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=2&t=16.25) |
| v2-army-field | 3 | 13 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=13) |
| v2-army-field | 3 | 17 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=17) |
| v2-army-field | 3 | 20.75 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=20.75) |

### 같은 수 되풀이 몫 (8)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-sky-wide | 3 | 65.7 | 전설1 | 같은 수 되풀이 몫 | 0.712 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=65.7) |
| x-scattered-30 | 1 | 62.77 | 상위1 | 같은 수 되풀이 몫 | 0.938 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=62.77) |
| x-scattered-30 | 1 | 62.77 | 상위7 | 같은 수 되풀이 몫 | 0.938 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=62.77) |
| x-scattered-30 | 1 | 62.77 | 상위19 | 같은 수 되풀이 몫 | 0.923 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=62.77) |
| x-scattered-30 | 1 | 62.77 | 상위25 | 같은 수 되풀이 몫 | 1 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=62.77) |
| x-scattered-30 | 2 | 66.3 | 상위13 | 같은 수 되풀이 몫 | 0.857 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=66.3) |
| x-scattered-30 | 2 | 66.3 | 상위19 | 같은 수 되풀이 몫 | 0.75 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=66.3) |
| x-scattered-30 | 3 | 83.48 | 상위13 | 같은 수 되풀이 몫 | 0.857 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=83.48) |

### 대마법사: 소금 위 몫 (6)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 1 | 48.03 | 대마법사1 | 대마법사: 소금 위 몫 | 0.161 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=48.03) |
| v2-army-salt-city | 2 | 65.8 | 대마법사1 | 대마법사: 소금 위 몫 | 0.163 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=65.8) |
| v2-army-salt-city | 3 | 81.92 | 대마법사1 | 대마법사: 소금 위 몫 | 0.315 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=81.92) |
| x-salt-fort | 1 | 54.65 | 대마법사1 | 대마법사: 소금 위 몫 | 0.156 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=54.65) |
| x-salt-fort | 2 | 44.18 | 대마법사1 | 대마법사: 소금 위 몫 | 0.21 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=44.18) |
| x-salt-fort | 3 | 41.07 | 대마법사1 | 대마법사: 소금 위 몫 | 0.226 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=41.07) |

### 아군 피해 몫 (5)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-2v6 | 1 | 16.47 | 편 0 | 아군 피해 몫 | 0.999 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=16.47) |
| x-joint | 1 | 13.78 | 편 1 | 아군 피해 몫 | 0.115 | [열기](../sandbox/index.html#x-joint&seed=1&t=13.78) |
| x-squad-30-ranged | 1 | 64.78 | 편 1 | 아군 피해 몫 | 0.328 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=64.78) |
| x-squad-30-ranged | 2 | 77.77 | 편 1 | 아군 피해 몫 | 0.361 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=77.77) |
| x-squad-30-ranged | 3 | 77.02 | 편 1 | 아군 피해 몫 | 0.321 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=77.02) |

### 헛시전: 알 수 있었던 것 (2)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 2 | 65.8 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.104 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=65.8) |
| x-salt-fort | 1 | 54.65 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.111 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=54.65) |

### 데이터: 장면의 자리가 판 밖 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| 데이터 | 0 | 0 | v2-army-salt-city | 데이터: 장면의 자리가 판 밖 | 201,45 |  |
