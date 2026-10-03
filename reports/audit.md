# 지능 점검

엔진 v2.32.0 · 2026-10-03 · 장면 32개 × 씨앗 1·2·3 · 19 s. 문턱은 `data/rules/audit.json`, 만든 명령 `node cli.js audit`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.

## 탐지기별 사건 수

| 탐지기 | 사건 | 장면 수 |
|---|---|---|
| 기회 놓침 | 91 | 13 |
| 명중 범위 밖 | 43 | 7 |
| 위험 지대 | 34 | 4 |
| 막혀 제자리 | 30 | 5 |
| 헛시전 | 25 | 7 |
| 대마법사: 총 앞에 서 있음 | 20 | 2 |
| 스스로 입은 피해 몫 | 19 | 7 |
| 같은 수 되풀이 몫 | 16 | 6 |
| 떨림 | 14 | 4 |
| 역류 | 13 | 5 |
| 아군 피해 몫 | 7 | 3 |
| 대마법사: 소금 위 몫 | 7 | 3 |
| 소금 안개 안에서 짓기 | 5 | 1 |
| 헛시전: 알 수 있었던 것 | 3 | 2 |
| 포 사선에 아군 | 2 | 2 |
| 오류: 느린 걸음 | 2 | 1 |
| 끝나지 않는 판 | 1 | 1 |
| 체력 남기고 도망 | 1 | 1 |

## 장면별 사건 수

| 장면 | 사건 |
|---|---|
| v2-army-field-gun | 40 |
| x-squad-30-ranged | 39 |
| x-squad-30 | 38 |
| element-league | 23 |
| v2-crowd-1v20 | 23 |
| x-salt-fort | 23 |
| v2-challenger-3 | 20 |
| v2-sky-wide | 19 |
| v2-archmage-1v10 | 17 |
| v2-army-salt-fort-gun | 17 |
| x-scattered-30 | 13 |
| v2-army-salt-city | 12 |
| v2-army-field | 9 |
| v2-neighbor-mid | 8 |
| v2-archmage-2v6 | 6 |
| v2-sky-narrow | 4 |
| v2-tactics-legend | 4 |
| duel | 3 |
| v2-squad-10-scattered | 3 |
| x-joint | 3 |
| v2-army-ambush-gun | 2 |
| v2-army-salt-city-gun | 2 |
| v2-sky-musket | 2 |
| v2-squad-10 | 2 |
| v2-army-ambush | 1 |

## 대마법사 (판마다)

| 장면 | 씨앗 | 누구 | 떠 있는 몫 | 평균 속도 (m/s) | 소금 위 몫 |
|---|---|---|---|---|---|
| archmage-50 | 1 | 대마법사1 | 97% | 8.4 | 0% |
| archmage-50 | 2 | 대마법사1 | 94% | 5.5 | 0% |
| archmage-50 | 3 | 대마법사1 | 96% | 9.1 | 0% |
| musket-arc | 1 | 대마법사1 | 39% | 10.5 | 0% |
| musket-arc | 2 | 대마법사1 | 42% | 10.2 | 0% |
| musket-arc | 3 | 대마법사1 | 7% | 7.0 | 0% |
| v2-archmage-100 | 1 | 대마법사1 | 99% | 10.0 | 0% |
| v2-archmage-100 | 2 | 대마법사1 | 99% | 11.9 | 0% |
| v2-archmage-100 | 3 | 대마법사1 | 99% | 12.5 | 0% |
| v2-archmage-1v10 | 1 | 대마법사1 | 83% | 14.2 | 0% |
| v2-archmage-1v10 | 2 | 대마법사1 | 99% | 16.8 | 0% |
| v2-archmage-1v10 | 3 | 대마법사1 | 84% | 13.6 | 0% |
| v2-archmage-2v6 | 1 | 대마법사1 | 88% | 18.9 | 0% |
| v2-archmage-2v6 | 1 | 대마법사2 | 98% | 21.4 | 0% |
| v2-archmage-2v6 | 2 | 대마법사1 | 98% | 19.2 | 0% |
| v2-archmage-2v6 | 2 | 대마법사2 | 98% | 19.3 | 0% |
| v2-archmage-2v6 | 3 | 대마법사1 | 84% | 18.8 | 0% |
| v2-archmage-2v6 | 3 | 대마법사2 | 97% | 19.4 | 0% |
| v2-army-ambush-gun | 1 | 대마법사1 | 0% | 14.6 | 0% |
| v2-army-ambush-gun | 2 | 대마법사1 | 88% | 4.6 | 0% |
| v2-army-ambush-gun | 3 | 대마법사1 | 5% | 4.2 | 0% |
| v2-army-ambush | 1 | 대마법사1 | 29% | 8.0 | 0% |
| v2-army-ambush | 2 | 대마법사1 | 5% | 6.6 | 0% |
| v2-army-ambush | 3 | 대마법사1 | 0% | 2.0 | 0% |
| v2-army-field-gun | 1 | 대마법사1 | 44% | 9.8 | 0% |
| v2-army-field-gun | 2 | 대마법사1 | 48% | 12.1 | 0% |
| v2-army-field-gun | 3 | 대마법사1 | 75% | 10.1 | 0% |
| v2-army-field | 1 | 대마법사1 | 64% | 7.7 | 0% |
| v2-army-field | 2 | 대마법사1 | 47% | 12.6 | 0% |
| v2-army-field | 3 | 대마법사1 | 68% | 7.7 | 0% |
| v2-army-prepared | 1 | 대마법사1 | 5% | 7.1 | 0% |
| v2-army-prepared | 2 | 대마법사1 | 5% | 1.8 | 0% |
| v2-army-prepared | 3 | 대마법사1 | 7% | 1.3 | 0% |
| v2-army-salt-city-gun | 1 | 대마법사1 | 100% | 16.5 | 0% |
| v2-army-salt-city-gun | 2 | 대마법사1 | 100% | 26.1 | 0% |
| v2-army-salt-city-gun | 3 | 대마법사1 | 100% | 20.8 | 0% |
| v2-army-salt-city | 1 | 대마법사1 | 24% | 8.8 | 7% |
| v2-army-salt-city | 2 | 대마법사1 | 28% | 10.4 | 16% |
| v2-army-salt-city | 3 | 대마법사1 | 28% | 7.7 | 19% |
| v2-army-salt-fort-gun | 1 | 대마법사1 | 96% | 2.2 | 3% |
| v2-army-salt-fort-gun | 2 | 대마법사1 | 41% | 17.7 | 56% |
| v2-army-salt-fort-gun | 3 | 대마법사1 | 19% | 10.5 | 43% |
| v2-crowd-1v20 | 1 | 대마법사1 | 91% | 11.2 | 0% |
| v2-crowd-1v20 | 2 | 대마법사1 | 84% | 13.3 | 0% |
| v2-crowd-1v20 | 3 | 대마법사1 | 94% | 10.8 | 0% |
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
| v2-squad-10-scattered | 1 | 대마법사1 | 100% | 16.4 | 0% |
| v2-squad-10-scattered | 2 | 대마법사1 | 99% | 13.7 | 0% |
| v2-squad-10-scattered | 3 | 대마법사1 | 99% | 16.5 | 0% |
| v2-squad-10 | 1 | 대마법사1 | 100% | 16.6 | 0% |
| v2-squad-10 | 2 | 대마법사1 | 95% | 11.5 | 0% |
| v2-squad-10 | 3 | 대마법사1 | 99% | 12.7 | 0% |
| v2-tactics-legend | 1 | 전설 A1 | 94% | 21.4 | 0% |
| v2-tactics-legend | 1 | 전설 B1 | 95% | 22.7 | 0% |
| v2-tactics-legend | 2 | 전설 A1 | 87% | 20.7 | 0% |
| v2-tactics-legend | 2 | 전설 B1 | 74% | 21.8 | 0% |
| v2-tactics-legend | 3 | 전설 A1 | 89% | 19.3 | 0% |
| v2-tactics-legend | 3 | 전설 B1 | 82% | 20.6 | 0% |
| x-joint | 1 | 대마법사1 | 20% | 7.3 | 0% |
| x-joint | 2 | 대마법사1 | 28% | 5.0 | 0% |
| x-joint | 3 | 대마법사1 | 62% | 6.2 | 0% |
| x-salt-fort | 1 | 대마법사1 | 22% | 17.2 | 52% |
| x-salt-fort | 2 | 대마법사1 | 39% | 16.5 | 51% |
| x-salt-fort | 3 | 대마법사1 | 9% | 6.8 | 25% |
| x-scattered-30 | 1 | 대마법사1 | 100% | 15.8 | 0% |
| x-scattered-30 | 2 | 대마법사1 | 93% | 13.9 | 0% |
| x-scattered-30 | 3 | 대마법사1 | 91% | 14.3 | 0% |
| x-squad-30-ranged | 1 | 대마법사1 | 100% | 17.3 | 0% |
| x-squad-30-ranged | 2 | 대마법사1 | 100% | 17.8 | 0% |
| x-squad-30-ranged | 3 | 대마법사1 | 93% | 18.0 | 0% |
| x-squad-30 | 1 | 대마법사1 | 81% | 10.1 | 0% |
| x-squad-30 | 2 | 대마법사1 | 94% | 13.4 | 0% |
| x-squad-30 | 3 | 대마법사1 | 77% | 11.9 | 0% |

## 사건 (탐지기마다 앞의 25개)

### 기회 놓침 (91)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 1 | 15 | 적1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#duel&seed=1&t=15) |
| element-league | 1 | 47 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=1&t=47) |
| element-league | 2 | 44 | 얼음1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=44) |
| element-league | 2 | 53 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=2&t=53) |
| element-league | 3 | 34.5 | 흙1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=34.5) |
| element-league | 3 | 40.25 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=40.25) |
| element-league | 3 | 42 | 번개1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=42) |
| element-league | 3 | 49.25 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=49.25) |
| element-league | 3 | 63.25 | 불1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#element-league&seed=3&t=63.25) |
| v2-challenger-3 | 1 | 14.5 | 초보2 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=14.5) |
| v2-challenger-3 | 1 | 28.75 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=28.75) |
| v2-challenger-3 | 1 | 31.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=31.25) |
| v2-challenger-3 | 3 | 33.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=33.25) |
| v2-crowd-1v20 | 1 | 13.75 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=13.75) |
| v2-crowd-1v20 | 1 | 25 | 상위10 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=25) |
| v2-crowd-1v20 | 1 | 27.5 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=27.5) |
| v2-crowd-1v20 | 1 | 45.5 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=45.5) |
| v2-crowd-1v20 | 1 | 48 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=48) |
| v2-crowd-1v20 | 2 | 12.75 | 상위19 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=12.75) |
| v2-crowd-1v20 | 2 | 13.5 | 상위16 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=13.5) |
| v2-crowd-1v20 | 2 | 15.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=15.25) |
| v2-crowd-1v20 | 2 | 19.5 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=19.5) |
| v2-crowd-1v20 | 2 | 24.5 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=24.5) |
| v2-crowd-1v20 | 3 | 15.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=15.25) |
| v2-crowd-1v20 | 3 | 20.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=20.25) |

### 명중 범위 밖 (43)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 149.42 | 흙1 | 명중 범위 밖 (평범) | 0.026 | [열기](../sandbox/index.html#element-league&seed=1&t=149.42) |
| element-league | 2 | 89.63 | 흙1 | 명중 범위 밖 (평범) | 0.074 | [열기](../sandbox/index.html#element-league&seed=2&t=89.63) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 명중 범위 밖 (평범) | 0.067 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 명중 범위 밖 (평범) | 0.077 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-sky-wide | 1 | 49.3 | 대가1 | 명중 범위 밖 (대마법사) | 0.059 | [열기](../sandbox/index.html#v2-sky-wide&seed=1&t=49.3) |
| v2-sky-wide | 3 | 65.7 | 대가1 | 명중 범위 밖 (대마법사) | 0.031 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=65.7) |
| v2-squad-10 | 2 | 49.48 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-squad-10&seed=2&t=49.48) |
| x-joint | 2 | 24.18 | 총병41 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-joint&seed=2&t=24.18) |
| x-squad-30-ranged | 1 | 76.97 | 상위3 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위5 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위7 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위10 | 명중 범위 밖 (상위) | 0.036 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위18 | 명중 범위 밖 (상위) | 0.042 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위24 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위26 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위28 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 1 | 76.97 | 상위29 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 2 | 65.95 | 상위1 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위3 | 명중 범위 밖 (상위) | 0.048 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위5 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위23 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위25 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위26 | 명중 범위 밖 (상위) | 0.059 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위28 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 2 | 65.95 | 상위30 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |

### 위험 지대 (34)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 118 | 얼음1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=118) |
| element-league | 2 | 86 | 번개1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=2&t=86) |
| v2-army-salt-city | 1 | 6.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=6.5) |
| v2-army-salt-city | 2 | 7 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=7) |
| v2-army-salt-city | 2 | 13 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=13) |
| v2-army-salt-city | 2 | 20.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=20.75) |
| v2-army-salt-city | 3 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=6.75) |
| v2-army-salt-city | 3 | 24.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=24.75) |
| v2-army-salt-fort-gun | 1 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=6.75) |
| v2-army-salt-fort-gun | 1 | 14 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=14) |
| v2-army-salt-fort-gun | 2 | 5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=5) |
| v2-army-salt-fort-gun | 2 | 13 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=13) |
| v2-army-salt-fort-gun | 3 | 3.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=3.75) |
| v2-army-salt-fort-gun | 3 | 12 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=12) |
| v2-army-salt-fort-gun | 3 | 24.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=24.75) |
| v2-army-salt-fort-gun | 3 | 29 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=29) |
| x-salt-fort | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=4.25) |
| x-salt-fort | 1 | 5.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=5.75) |
| x-salt-fort | 1 | 22 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=22) |
| x-salt-fort | 1 | 25.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=25.5) |
| x-salt-fort | 1 | 33.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=33.25) |
| x-salt-fort | 1 | 34.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=34.75) |
| x-salt-fort | 1 | 38 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=38) |
| x-salt-fort | 2 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=4.25) |
| x-salt-fort | 2 | 6 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=6) |

### 막혀 제자리 (30)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 141.75 | 독1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=1&t=141.75) |
| element-league | 1 | 146 | 독1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#element-league&seed=1&t=146) |
| v2-army-ambush | 3 | 5.25 | 총병36 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-ambush&seed=3&t=5.25) |
| v2-army-field-gun | 1 | 37.75 | 군대7 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=37.75) |
| v2-army-field-gun | 1 | 38 | 군대51 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=38) |
| v2-army-field-gun | 1 | 45 | 군대72 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=45) |
| v2-army-field-gun | 1 | 45.25 | 군대48 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=45.25) |
| v2-army-field-gun | 1 | 47 | 군대64 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=47) |
| v2-army-field-gun | 1 | 48.25 | 군대48 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=48.25) |
| v2-army-field-gun | 1 | 50 | 군대64 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=50) |
| v2-army-field-gun | 1 | 51.25 | 군대48 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=51.25) |
| v2-army-field-gun | 1 | 54.25 | 군대48 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=54.25) |
| v2-army-field-gun | 2 | 33.75 | 군대9 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=33.75) |
| v2-army-field-gun | 2 | 34 | 군대40 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=34) |
| v2-army-field-gun | 2 | 35.75 | 군대97 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=35.75) |
| v2-army-field-gun | 2 | 38.5 | 군대81 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=38.5) |
| v2-army-field-gun | 2 | 50 | 군대42 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=50) |
| v2-army-field-gun | 2 | 55.5 | 군대39 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=55.5) |
| v2-army-field-gun | 3 | 31 | 군대42 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=31) |
| v2-army-field-gun | 3 | 31.25 | 군대2 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=31.25) |
| v2-army-field-gun | 3 | 31.25 | 군대14 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=31.25) |
| v2-army-field-gun | 3 | 51 | 군대78 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=51) |
| v2-army-field-gun | 3 | 73.5 | 군대55 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=73.5) |
| v2-army-field-gun | 3 | 102.25 | 군대96 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=102.25) |
| v2-army-field-gun | 3 | 103.5 | 군대3 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=103.5) |

### 헛시전 (25)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-1v10 | 1 | 28.22 | 상위6 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 1 | 28.22 | 상위8 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 3 | 31.68 | 상위1 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위3 | 헛시전 (장악권·소금 원) | 0.111 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위5 | 헛시전 (장악권·소금 원) | 0.182 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위7 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위8 | 헛시전 (장악권·소금 원) | 0.176 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-2v6 | 3 | 14.62 | 상위1 | 헛시전 (장악권·소금 원) | 0.111 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=14.62) |
| v2-army-ambush-gun | 2 | 6.12 | 대마법사1 | 헛시전 (장악권·소금 원) | 0.111 | [열기](../sandbox/index.html#v2-army-ambush-gun&seed=2&t=6.12) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 헛시전 (장악권·소금 원) | 0.15 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-crowd-1v20 | 1 | 48.67 | 상위11 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=48.67) |
| v2-crowd-1v20 | 1 | 48.67 | 상위14 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=48.67) |
| v2-crowd-1v20 | 1 | 48.67 | 상위17 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=48.67) |
| v2-crowd-1v20 | 2 | 40.45 | 상위5 | 헛시전 (장악권·소금 원) | 0.111 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-crowd-1v20 | 2 | 40.45 | 상위11 | 헛시전 (장악권·소금 원) | 0.286 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-crowd-1v20 | 2 | 40.45 | 상위14 | 헛시전 (장악권·소금 원) | 0.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-tactics-legend | 3 | 60.97 | 전설 B1 | 헛시전 (장악권·소금 원) | 0.109 | [열기](../sandbox/index.html#v2-tactics-legend&seed=3&t=60.97) |
| x-squad-30 | 1 | 88.65 | 상위18 | 헛시전 (장악권·소금 원) | 0.167 | [열기](../sandbox/index.html#x-squad-30&seed=1&t=88.65) |
| x-squad-30 | 1 | 88.65 | 상위25 | 헛시전 (장악권·소금 원) | 0.176 | [열기](../sandbox/index.html#x-squad-30&seed=1&t=88.65) |
| x-squad-30 | 2 | 95.37 | 상위5 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#x-squad-30&seed=2&t=95.37) |
| x-squad-30 | 2 | 95.37 | 상위17 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#x-squad-30&seed=2&t=95.37) |
| x-squad-30 | 3 | 95.05 | 상위1 | 헛시전 (장악권·소금 원) | 0.143 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=95.05) |
| x-squad-30 | 3 | 95.05 | 상위17 | 헛시전 (장악권·소금 원) | 0.158 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=95.05) |
| x-squad-30 | 3 | 95.05 | 상위25 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=95.05) |
| x-squad-30 | 3 | 95.05 | 상위29 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=95.05) |

### 대마법사: 총 앞에 서 있음 (20)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-field-gun | 1 | 17 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=17) |
| v2-army-field-gun | 1 | 20.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=20.25) |
| v2-army-field-gun | 1 | 22.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=22.25) |
| v2-army-field-gun | 1 | 46.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=46.5) |
| v2-army-field-gun | 2 | 17 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=17) |
| v2-army-field-gun | 2 | 19 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=19) |
| v2-army-field-gun | 2 | 43.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=43.25) |
| v2-army-field-gun | 3 | 16.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=16.25) |
| v2-army-field-gun | 3 | 18.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=18.25) |
| v2-army-field-gun | 3 | 33.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=33.25) |
| v2-army-field-gun | 3 | 35 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=35) |
| v2-army-field-gun | 3 | 41 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=41) |
| v2-army-field-gun | 3 | 42.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=42.5) |
| v2-army-field | 1 | 16.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=16.5) |
| v2-army-field | 1 | 18.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=18.5) |
| v2-army-field | 2 | 13.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=2&t=13.25) |
| v2-army-field | 2 | 16.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=2&t=16.25) |
| v2-army-field | 3 | 13 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=13) |
| v2-army-field | 3 | 17 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=17) |
| v2-army-field | 3 | 20.75 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=20.75) |

### 스스로 입은 피해 몫 (19)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 11.38 | 청1 | 스스로 입은 피해 몫 | 0.145 | [열기](../sandbox/index.html#duel&seed=2&t=11.38) |
| v2-archmage-1v10 | 1 | 28.22 | 대마법사1 | 스스로 입은 피해 몫 | 0.973 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 3 | 31.68 | 대마법사1 | 스스로 입은 피해 몫 | 0.632 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-2v6 | 1 | 14.28 | 대마법사1 | 스스로 입은 피해 몫 | 0.178 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=14.28) |
| v2-archmage-2v6 | 3 | 14.62 | 대마법사1 | 스스로 입은 피해 몫 | 0.831 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=14.62) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 스스로 입은 피해 몫 | 0.271 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 2 | 26.73 | 초보1 | 스스로 입은 피해 몫 | 0.14 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보2 | 스스로 입은 피해 몫 | 0.748 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보3 | 스스로 입은 피해 몫 | 0.364 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 스스로 입은 피해 몫 | 0.358 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-challenger-3 | 3 | 37.62 | 초보2 | 스스로 입은 피해 몫 | 0.147 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-neighbor-mid | 1 | 16.47 | 상급1 | 스스로 입은 피해 몫 | 0.277 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=1&t=16.47) |
| v2-neighbor-mid | 2 | 35.92 | 상급1 | 스스로 입은 피해 몫 | 0.404 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=35.92) |
| v2-neighbor-mid | 3 | 22.73 | 상급1 | 스스로 입은 피해 몫 | 0.145 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=22.73) |
| v2-sky-narrow | 1 | 27.72 | 대가1 | 스스로 입은 피해 몫 | 0.206 | [열기](../sandbox/index.html#v2-sky-narrow&seed=1&t=27.72) |
| v2-sky-narrow | 1 | 27.72 | 상급1 | 스스로 입은 피해 몫 | 0.477 | [열기](../sandbox/index.html#v2-sky-narrow&seed=1&t=27.72) |
| v2-sky-narrow | 2 | 23.93 | 상급1 | 스스로 입은 피해 몫 | 0.435 | [열기](../sandbox/index.html#v2-sky-narrow&seed=2&t=23.93) |
| v2-sky-narrow | 3 | 17.98 | 상급1 | 스스로 입은 피해 몫 | 0.444 | [열기](../sandbox/index.html#v2-sky-narrow&seed=3&t=17.98) |
| v2-tactics-legend | 3 | 60.97 | 전설 A1 | 스스로 입은 피해 몫 | 0.199 | [열기](../sandbox/index.html#v2-tactics-legend&seed=3&t=60.97) |

### 같은 수 되풀이 몫 (16)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-1v10 | 1 | 28.22 | 상위3 | 같은 수 되풀이 몫 | 0.643 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 2 | 31.72 | 상위4 | 같은 수 되풀이 몫 | 0.647 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=31.72) |
| v2-archmage-1v10 | 2 | 31.72 | 상위9 | 같은 수 되풀이 몫 | 0.692 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=31.72) |
| v2-archmage-1v10 | 3 | 31.68 | 상위2 | 같은 수 되풀이 몫 | 0.786 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위4 | 같은 수 되풀이 몫 | 0.733 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위9 | 같은 수 되풀이 몫 | 0.625 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-army-salt-fort-gun | 1 | 240 | 대마법사1 | 같은 수 되풀이 몫 | 1 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=240) |
| v2-crowd-1v20 | 2 | 40.45 | 상위1 | 같은 수 되풀이 몫 | 0.632 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-crowd-1v20 | 2 | 40.45 | 상위13 | 같은 수 되풀이 몫 | 0.765 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-sky-wide | 3 | 65.7 | 전설1 | 같은 수 되풀이 몫 | 0.712 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=65.7) |
| x-scattered-30 | 1 | 87.18 | 상위1 | 같은 수 되풀이 몫 | 1 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=87.18) |
| x-scattered-30 | 2 | 87.32 | 상위13 | 같은 수 되풀이 몫 | 0.759 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=87.32) |
| x-scattered-30 | 2 | 87.32 | 상위19 | 같은 수 되풀이 몫 | 0.682 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=87.32) |
| x-scattered-30 | 3 | 98.88 | 상위13 | 같은 수 되풀이 몫 | 0.813 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=98.88) |
| x-scattered-30 | 3 | 98.88 | 상위19 | 같은 수 되풀이 몫 | 0.75 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=98.88) |
| x-squad-30 | 3 | 95.05 | 상위22 | 같은 수 되풀이 몫 | 0.706 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=95.05) |

### 떨림 (14)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 92.5 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=92.5) |
| element-league | 1 | 139.25 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=1&t=139.25) |
| element-league | 2 | 43 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=43) |
| element-league | 2 | 60.75 | 얼음1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=2&t=60.75) |
| element-league | 3 | 52.5 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=52.5) |
| element-league | 3 | 54 | 불1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=54) |
| element-league | 3 | 67 | 독1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=67) |
| element-league | 3 | 81.75 | 얼음1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=81.75) |
| element-league | 3 | 86.25 | 흙1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#element-league&seed=3&t=86.25) |
| v2-army-field | 1 | 84.75 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=84.75) |
| v2-army-field | 3 | 78.25 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=78.25) |
| v2-neighbor-mid | 2 | 27 | 상급1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=27) |
| v2-neighbor-mid | 3 | 16.75 | 대가1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=16.75) |
| v2-sky-wide | 2 | 64.25 | 전설1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-sky-wide&seed=2&t=64.25) |

### 역류 (13)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 11.38 | 청1 | 역류 (번) | 1 | [열기](../sandbox/index.html#duel&seed=2&t=11.38) |
| v2-archmage-1v10 | 1 | 28.22 | 대마법사1 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 2 | 31.72 | 상위6 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=31.72) |
| v2-archmage-2v6 | 3 | 14.62 | 대마법사1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=14.62) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 2 | 26.73 | 초보1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보2 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 2 | 26.73 | 초보3 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=26.73) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-challenger-3 | 3 | 37.62 | 초보2 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-neighbor-mid | 1 | 16.47 | 상급1 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=1&t=16.47) |
| v2-neighbor-mid | 2 | 35.92 | 상급1 | 역류 (번) | 3 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=2&t=35.92) |
| v2-neighbor-mid | 3 | 22.73 | 상급1 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-neighbor-mid&seed=3&t=22.73) |

### 아군 피해 몫 (7)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-2v6 | 1 | 14.28 | 편 0 | 아군 피해 몫 | 0.407 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=14.28) |
| v2-archmage-2v6 | 3 | 14.62 | 편 0 | 아군 피해 몫 | 0.164 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=14.62) |
| v2-army-salt-fort-gun | 1 | 240 | 편 1 | 아군 피해 몫 | 0.153 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=240) |
| v2-army-salt-fort-gun | 2 | 17.13 | 편 1 | 아군 피해 몫 | 0.443 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=17.13) |
| x-squad-30-ranged | 1 | 76.97 | 편 1 | 아군 피해 몫 | 0.345 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=76.97) |
| x-squad-30-ranged | 2 | 65.95 | 편 1 | 아군 피해 몫 | 0.253 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=65.95) |
| x-squad-30-ranged | 3 | 71.97 | 편 1 | 아군 피해 몫 | 0.417 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=71.97) |

### 대마법사: 소금 위 몫 (7)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 2 | 64.1 | 대마법사1 | 대마법사: 소금 위 몫 | 0.164 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=64.1) |
| v2-army-salt-city | 3 | 70.48 | 대마법사1 | 대마법사: 소금 위 몫 | 0.185 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=70.48) |
| v2-army-salt-fort-gun | 2 | 17.13 | 대마법사1 | 대마법사: 소금 위 몫 | 0.559 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=17.13) |
| v2-army-salt-fort-gun | 3 | 49.88 | 대마법사1 | 대마법사: 소금 위 몫 | 0.427 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=49.88) |
| x-salt-fort | 1 | 44.68 | 대마법사1 | 대마법사: 소금 위 몫 | 0.517 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=44.68) |
| x-salt-fort | 2 | 27.72 | 대마법사1 | 대마법사: 소금 위 몫 | 0.509 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=27.72) |
| x-salt-fort | 3 | 55.02 | 대마법사1 | 대마법사: 소금 위 몫 | 0.245 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=55.02) |

### 소금 안개 안에서 짓기 (5)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-field-gun | 1 | 34.75 | 대마법사1 | 소금 안개 안에서 짓기 | 보루 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=34.75) |
| v2-army-field-gun | 1 | 69.5 | 대마법사1 | 소금 안개 안에서 짓기 | 낙뢰 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=69.5) |
| v2-army-field-gun | 2 | 34 | 대마법사1 | 소금 안개 안에서 짓기 | 보루 | [열기](../sandbox/index.html#v2-army-field-gun&seed=2&t=34) |
| v2-army-field-gun | 3 | 34 | 대마법사1 | 소금 안개 안에서 짓기 | 보루 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=34) |
| v2-army-field-gun | 3 | 49 | 대마법사1 | 소금 안개 안에서 짓기 | 흙벽 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=49) |

### 헛시전: 알 수 있었던 것 (3)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 2 | 17.13 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=17.13) |
| v2-army-salt-fort-gun | 3 | 49.88 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.163 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=49.88) |
| x-salt-fort | 2 | 27.72 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.15 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=27.72) |

### 포 사선에 아군 (2)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-ambush-gun | 1 | 0.4 | 총병41 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-ambush-gun&seed=1&t=0.4) |
| v2-army-salt-fort-gun | 1 | 2.52 | 총병40 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=2.52) |

### 오류: 느린 걸음 (2)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 1.37 | - | 오류: 느린 걸음 (ms) | 66 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=1.37) |
| v2-army-salt-city-gun | 3 | 0.67 | - | 오류: 느린 걸음 (ms) | 89 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=3&t=0.67) |

### 끝나지 않는 판 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 1 | 240 | - | 끝나지 않는 판 (s) | 240 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=240) |

### 체력 남기고 도망 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-challenger-3 | 2 | 22 | 초보2 | 체력 남기고 도망 (평범) | 0.804 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=22) |
