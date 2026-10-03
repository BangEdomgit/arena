# 지능 점검

엔진 v2.31.0 · 2026-10-03 · 장면 32개 × 씨앗 1·2·3 · 20 s. 문턱은 `data/rules/audit.json`, 만든 명령 `node cli.js audit`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.

## 탐지기별 사건 수

| 탐지기 | 사건 | 장면 수 |
|---|---|---|
| 기회 놓침 | 84 | 14 |
| 위험 지대 | 52 | 5 |
| 명중 범위 밖 | 39 | 7 |
| 스스로 입은 피해 몫 | 21 | 8 |
| 헛시전 | 21 | 7 |
| 떨림 | 17 | 5 |
| 같은 수 되풀이 몫 | 16 | 6 |
| 역류 | 15 | 6 |
| 막혀 제자리 | 15 | 8 |
| 대마법사: 총 앞에 서 있음 | 11 | 2 |
| 대마법사: 소금 위 몫 | 10 | 4 |
| 헛시전: 알 수 있었던 것 | 5 | 3 |
| 포 사선에 아군 | 3 | 3 |
| 아군 피해 몫 | 2 | 2 |
| 오류: 느린 걸음 | 1 | 1 |
| 소금 안개 안에서 짓기 | 1 | 1 |
| 체력 남기고 도망 | 1 | 1 |

## 장면별 사건 수

| 장면 | 사건 |
|---|---|
| x-squad-30-ranged | 42 |
| v2-army-salt-fort-gun | 27 |
| element-league | 26 |
| x-squad-30 | 26 |
| v2-crowd-1v20 | 22 |
| v2-army-salt-city | 20 |
| v2-challenger-3 | 20 |
| v2-sky-wide | 19 |
| v2-archmage-1v10 | 17 |
| x-salt-fort | 14 |
| x-scattered-30 | 12 |
| v2-army-field | 11 |
| v2-army-salt-city-gun | 11 |
| v2-neighbor-mid | 8 |
| v2-army-field-gun | 7 |
| v2-archmage-2v6 | 6 |
| v2-sky-narrow | 4 |
| v2-squad-10 | 4 |
| v2-tactics-legend | 4 |
| duel | 3 |
| v2-squad-10-scattered | 3 |
| x-joint | 3 |
| v2-army-ambush-gun | 2 |
| v2-sky-musket | 2 |
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
| v2-archmage-2v6 | 1 | 대마법사1 | 98% | 20.7 | 0% |
| v2-archmage-2v6 | 1 | 대마법사2 | 93% | 19.2 | 0% |
| v2-archmage-2v6 | 2 | 대마법사1 | 98% | 19.2 | 0% |
| v2-archmage-2v6 | 2 | 대마법사2 | 98% | 19.3 | 0% |
| v2-archmage-2v6 | 3 | 대마법사1 | 84% | 18.8 | 0% |
| v2-archmage-2v6 | 3 | 대마법사2 | 97% | 19.4 | 0% |
| v2-army-ambush-gun | 1 | 대마법사1 | 0% | 14.6 | 0% |
| v2-army-ambush-gun | 2 | 대마법사1 | 86% | 4.3 | 0% |
| v2-army-ambush-gun | 3 | 대마법사1 | 3% | 4.2 | 0% |
| v2-army-ambush | 1 | 대마법사1 | 29% | 8.0 | 0% |
| v2-army-ambush | 2 | 대마법사1 | 5% | 6.6 | 0% |
| v2-army-ambush | 3 | 대마법사1 | 0% | 2.0 | 0% |
| v2-army-field-gun | 1 | 대마법사1 | 53% | 7.4 | 0% |
| v2-army-field-gun | 2 | 대마법사1 | 58% | 14.3 | 0% |
| v2-army-field-gun | 3 | 대마법사1 | 63% | 15.0 | 0% |
| v2-army-field | 1 | 대마법사1 | 56% | 6.6 | 0% |
| v2-army-field | 2 | 대마법사1 | 63% | 11.4 | 0% |
| v2-army-field | 3 | 대마법사1 | 68% | 7.7 | 0% |
| v2-army-prepared | 1 | 대마법사1 | 5% | 7.1 | 0% |
| v2-army-prepared | 2 | 대마법사1 | 5% | 1.8 | 0% |
| v2-army-prepared | 3 | 대마법사1 | 7% | 1.3 | 0% |
| v2-army-salt-city-gun | 1 | 대마법사1 | 63% | 18.7 | 37% |
| v2-army-salt-city-gun | 2 | 대마법사1 | 10% | 10.2 | 30% |
| v2-army-salt-city-gun | 3 | 대마법사1 | 100% | 13.3 | 0% |
| v2-army-salt-city | 1 | 대마법사1 | 24% | 8.9 | 7% |
| v2-army-salt-city | 2 | 대마법사1 | 22% | 10.1 | 24% |
| v2-army-salt-city | 3 | 대마법사1 | 56% | 9.5 | 22% |
| v2-army-salt-fort-gun | 1 | 대마법사1 | 80% | 9.5 | 16% |
| v2-army-salt-fort-gun | 2 | 대마법사1 | 43% | 21.5 | 36% |
| v2-army-salt-fort-gun | 3 | 대마법사1 | 30% | 12.9 | 37% |
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
| v2-squad-10 | 2 | 대마법사1 | 100% | 11.4 | 0% |
| v2-squad-10 | 3 | 대마법사1 | 99% | 12.7 | 0% |
| v2-tactics-legend | 1 | 전설 A1 | 94% | 21.4 | 0% |
| v2-tactics-legend | 1 | 전설 B1 | 95% | 22.7 | 0% |
| v2-tactics-legend | 2 | 전설 A1 | 87% | 20.7 | 0% |
| v2-tactics-legend | 2 | 전설 B1 | 74% | 21.8 | 0% |
| v2-tactics-legend | 3 | 전설 A1 | 89% | 19.3 | 0% |
| v2-tactics-legend | 3 | 전설 B1 | 82% | 20.6 | 0% |
| x-joint | 1 | 대마법사1 | 20% | 7.3 | 0% |
| x-joint | 2 | 대마법사1 | 34% | 9.1 | 0% |
| x-joint | 3 | 대마법사1 | 62% | 6.2 | 0% |
| x-salt-fort | 1 | 대마법사1 | 18% | 8.5 | 16% |
| x-salt-fort | 2 | 대마법사1 | 19% | 11.8 | 21% |
| x-salt-fort | 3 | 대마법사1 | 28% | 13.5 | 23% |
| x-scattered-30 | 1 | 대마법사1 | 100% | 15.8 | 0% |
| x-scattered-30 | 2 | 대마법사1 | 93% | 13.9 | 0% |
| x-scattered-30 | 3 | 대마법사1 | 87% | 13.8 | 0% |
| x-squad-30-ranged | 1 | 대마법사1 | 100% | 17.5 | 0% |
| x-squad-30-ranged | 2 | 대마법사1 | 97% | 14.9 | 0% |
| x-squad-30-ranged | 3 | 대마법사1 | 97% | 17.2 | 0% |
| x-squad-30 | 1 | 대마법사1 | 98% | 12.6 | 0% |
| x-squad-30 | 2 | 대마법사1 | 92% | 15.8 | 0% |
| x-squad-30 | 3 | 대마법사1 | 98% | 13.0 | 0% |

## 사건 (탐지기마다 앞의 25개)

### 기회 놓침 (84)

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
| v2-army-salt-city-gun | 2 | 11.75 | 대마법사1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=11.75) |
| v2-challenger-3 | 1 | 14.5 | 초보2 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=14.5) |
| v2-challenger-3 | 1 | 28.75 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=28.75) |
| v2-challenger-3 | 1 | 31.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=31.25) |
| v2-challenger-3 | 3 | 33.25 | 전설1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=33.25) |
| v2-crowd-1v20 | 1 | 13.75 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=13.75) |
| v2-crowd-1v20 | 1 | 25 | 상위10 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=25) |
| v2-crowd-1v20 | 1 | 25.5 | 상위16 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=25.5) |
| v2-crowd-1v20 | 1 | 31.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=31.25) |
| v2-crowd-1v20 | 2 | 12.75 | 상위19 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=12.75) |
| v2-crowd-1v20 | 2 | 13.5 | 상위16 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=13.5) |
| v2-crowd-1v20 | 2 | 15.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=15.25) |
| v2-crowd-1v20 | 2 | 19.5 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=19.5) |
| v2-crowd-1v20 | 2 | 24.5 | 상위1 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=24.5) |
| v2-crowd-1v20 | 3 | 15.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=15.25) |
| v2-crowd-1v20 | 3 | 20.25 | 상위13 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=20.25) |
| v2-crowd-1v20 | 3 | 32 | 상위4 | 기회 놓침 (s) | 2.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=3&t=32) |

### 위험 지대 (52)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 60.5 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=60.5) |
| element-league | 1 | 74.75 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=74.75) |
| element-league | 1 | 83.25 | 얼음1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=1&t=83.25) |
| element-league | 2 | 107.5 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=2&t=107.5) |
| element-league | 3 | 54.5 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=54.5) |
| element-league | 3 | 55.25 | 번개1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=55.25) |
| element-league | 3 | 68.75 | 흙1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#element-league&seed=3&t=68.75) |
| v2-army-salt-city-gun | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=4.25) |
| v2-army-salt-city-gun | 2 | 14 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=14) |
| v2-army-salt-city-gun | 2 | 33.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=33.5) |
| v2-army-salt-city-gun | 2 | 46 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=46) |
| v2-army-salt-city-gun | 2 | 49 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=49) |
| v2-army-salt-city | 1 | 6.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=6.5) |
| v2-army-salt-city | 2 | 7 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=7) |
| v2-army-salt-city | 2 | 12.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=12.75) |
| v2-army-salt-city | 2 | 20.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=20.25) |
| v2-army-salt-city | 2 | 66 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=66) |
| v2-army-salt-city | 2 | 75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=75) |
| v2-army-salt-city | 2 | 77 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=77) |
| v2-army-salt-city | 3 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=6.75) |
| v2-army-salt-city | 3 | 25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=25) |
| v2-army-salt-city | 3 | 32.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=32.5) |
| v2-army-salt-city | 3 | 40.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=40.75) |
| v2-army-salt-city | 3 | 49.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=49.5) |
| v2-army-salt-fort-gun | 1 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=6.75) |

### 명중 범위 밖 (39)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| element-league | 1 | 121.82 | 흙1 | 명중 범위 밖 (평범) | 0.051 | [열기](../sandbox/index.html#element-league&seed=1&t=121.82) |
| v2-challenger-3 | 1 | 39.97 | 초보2 | 명중 범위 밖 (평범) | 0.067 | [열기](../sandbox/index.html#v2-challenger-3&seed=1&t=39.97) |
| v2-challenger-3 | 3 | 37.62 | 초보1 | 명중 범위 밖 (평범) | 0.077 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-sky-wide | 1 | 49.3 | 대가1 | 명중 범위 밖 (대마법사) | 0.059 | [열기](../sandbox/index.html#v2-sky-wide&seed=1&t=49.3) |
| v2-sky-wide | 3 | 65.7 | 대가1 | 명중 범위 밖 (대마법사) | 0.031 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=65.7) |
| v2-squad-10 | 2 | 52.42 | 상위10 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#v2-squad-10&seed=2&t=52.42) |
| x-joint | 2 | 26.35 | 총병41 | 명중 범위 밖 (상위) | 0.053 | [열기](../sandbox/index.html#x-joint&seed=2&t=26.35) |
| x-squad-30-ranged | 1 | 53.5 | 상위2 | 명중 범위 밖 (상위) | 0.059 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위9 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위11 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위15 | 명중 범위 밖 (상위) | 0.05 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위17 | 명중 범위 밖 (상위) | 0.053 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위25 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위28 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 1 | 53.5 | 상위29 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 2 | 59.08 | 상위1 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 2 | 59.08 | 상위2 | 명중 범위 밖 (상위) | 0.029 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 2 | 59.08 | 상위15 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 2 | 59.08 | 상위23 | 명중 범위 밖 (상위) | 0.032 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 2 | 59.08 | 상위26 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 2 | 59.08 | 상위28 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 2 | 59.08 | 상위30 | 명중 범위 밖 (상위) | 0.053 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |
| x-squad-30-ranged | 3 | 78.32 | 상위1 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=78.32) |
| x-squad-30-ranged | 3 | 78.32 | 상위3 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=78.32) |
| x-squad-30-ranged | 3 | 78.32 | 상위7 | 명중 범위 밖 (상위) | 0 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=3&t=78.32) |

### 스스로 입은 피해 몫 (21)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 11.38 | 청1 | 스스로 입은 피해 몫 | 0.145 | [열기](../sandbox/index.html#duel&seed=2&t=11.38) |
| v2-archmage-1v10 | 1 | 28.22 | 대마법사1 | 스스로 입은 피해 몫 | 0.973 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 3 | 31.68 | 대마법사1 | 스스로 입은 피해 몫 | 0.632 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-2v6 | 1 | 14.95 | 대마법사2 | 스스로 입은 피해 몫 | 0.96 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=14.95) |
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
| x-squad-30-ranged | 1 | 53.5 | 대마법사1 | 스스로 입은 피해 몫 | 0.676 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |
| x-squad-30-ranged | 2 | 59.08 | 대마법사1 | 스스로 입은 피해 몫 | 0.201 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=59.08) |

### 헛시전 (21)

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
| v2-challenger-3 | 3 | 37.62 | 초보1 | 헛시전 (장악권·소금 원) | 0.15 | [열기](../sandbox/index.html#v2-challenger-3&seed=3&t=37.62) |
| v2-crowd-1v20 | 1 | 46.38 | 상위11 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=46.38) |
| v2-crowd-1v20 | 1 | 46.38 | 상위14 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=46.38) |
| v2-crowd-1v20 | 1 | 46.38 | 상위17 | 헛시전 (장악권·소금 원) | 0.125 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=1&t=46.38) |
| v2-crowd-1v20 | 2 | 40.45 | 상위5 | 헛시전 (장악권·소금 원) | 0.111 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-crowd-1v20 | 2 | 40.45 | 상위11 | 헛시전 (장악권·소금 원) | 0.286 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-crowd-1v20 | 2 | 40.45 | 상위14 | 헛시전 (장악권·소금 원) | 0.25 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-tactics-legend | 3 | 60.97 | 전설 B1 | 헛시전 (장악권·소금 원) | 0.109 | [열기](../sandbox/index.html#v2-tactics-legend&seed=3&t=60.97) |
| x-joint | 2 | 26.35 | 총병45 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#x-joint&seed=2&t=26.35) |
| x-squad-30 | 1 | 86 | 상위25 | 헛시전 (장악권·소금 원) | 0.4 | [열기](../sandbox/index.html#x-squad-30&seed=1&t=86) |
| x-squad-30 | 3 | 109.8 | 상위5 | 헛시전 (장악권·소금 원) | 0.333 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=109.8) |
| x-squad-30 | 3 | 109.8 | 상위11 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=109.8) |
| x-squad-30 | 3 | 109.8 | 상위24 | 헛시전 (장악권·소금 원) | 0.2 | [열기](../sandbox/index.html#x-squad-30&seed=3&t=109.8) |

### 떨림 (17)

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
| x-squad-30 | 2 | 51.25 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#x-squad-30&seed=2&t=51.25) |

### 같은 수 되풀이 몫 (16)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-1v10 | 1 | 28.22 | 상위3 | 같은 수 되풀이 몫 | 0.643 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 2 | 31.72 | 상위4 | 같은 수 되풀이 몫 | 0.647 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=31.72) |
| v2-archmage-1v10 | 2 | 31.72 | 상위9 | 같은 수 되풀이 몫 | 0.692 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=31.72) |
| v2-archmage-1v10 | 3 | 31.68 | 상위2 | 같은 수 되풀이 몫 | 0.786 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위4 | 같은 수 되풀이 몫 | 0.733 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-archmage-1v10 | 3 | 31.68 | 상위9 | 같은 수 되풀이 몫 | 0.625 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=3&t=31.68) |
| v2-crowd-1v20 | 2 | 40.45 | 상위1 | 같은 수 되풀이 몫 | 0.632 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-crowd-1v20 | 2 | 40.45 | 상위13 | 같은 수 되풀이 몫 | 0.765 | [열기](../sandbox/index.html#v2-crowd-1v20&seed=2&t=40.45) |
| v2-sky-wide | 3 | 65.7 | 전설1 | 같은 수 되풀이 몫 | 0.712 | [열기](../sandbox/index.html#v2-sky-wide&seed=3&t=65.7) |
| v2-squad-10 | 2 | 52.42 | 상위10 | 같은 수 되풀이 몫 | 0.611 | [열기](../sandbox/index.html#v2-squad-10&seed=2&t=52.42) |
| x-scattered-30 | 1 | 87.18 | 상위1 | 같은 수 되풀이 몫 | 1 | [열기](../sandbox/index.html#x-scattered-30&seed=1&t=87.18) |
| x-scattered-30 | 2 | 87.32 | 상위13 | 같은 수 되풀이 몫 | 0.759 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=87.32) |
| x-scattered-30 | 2 | 87.32 | 상위19 | 같은 수 되풀이 몫 | 0.682 | [열기](../sandbox/index.html#x-scattered-30&seed=2&t=87.32) |
| x-scattered-30 | 3 | 86.92 | 상위13 | 같은 수 되풀이 몫 | 0.75 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=86.92) |
| x-scattered-30 | 3 | 86.92 | 상위19 | 같은 수 되풀이 몫 | 0.75 | [열기](../sandbox/index.html#x-scattered-30&seed=3&t=86.92) |
| x-squad-30 | 2 | 58.45 | 상위13 | 같은 수 되풀이 몫 | 0.857 | [열기](../sandbox/index.html#x-squad-30&seed=2&t=58.45) |

### 역류 (15)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| duel | 2 | 11.38 | 청1 | 역류 (번) | 1 | [열기](../sandbox/index.html#duel&seed=2&t=11.38) |
| v2-archmage-1v10 | 1 | 28.22 | 대마법사1 | 역류 (번) | 2 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=1&t=28.22) |
| v2-archmage-1v10 | 2 | 31.72 | 상위6 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-1v10&seed=2&t=31.72) |
| v2-archmage-2v6 | 1 | 14.95 | 대마법사2 | 역류 (번) | 1 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=1&t=14.95) |
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
| x-squad-30-ranged | 1 | 53.5 | 대마법사1 | 역류 (번) | 1 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |

### 막혀 제자리 (15)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-ambush-gun | 3 | 6.75 | 총병31 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-ambush-gun&seed=3&t=6.75) |
| v2-army-ambush | 3 | 5.25 | 총병36 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-ambush&seed=3&t=5.25) |
| v2-army-field-gun | 1 | 38.25 | 군대28 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=38.25) |
| v2-army-field-gun | 1 | 38.25 | 군대56 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=38.25) |
| v2-army-field-gun | 1 | 41.25 | 군대83 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=41.25) |
| v2-army-field-gun | 1 | 54.25 | 군대53 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field-gun&seed=1&t=54.25) |
| v2-army-field | 1 | 31.25 | 군대94 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=31.25) |
| v2-army-salt-city-gun | 2 | 40 | 총병5 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=40) |
| v2-army-salt-city | 2 | 6 | 총병31 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=6) |
| v2-army-salt-city | 2 | 12 | 총병17 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=12) |
| v2-army-salt-city | 2 | 43.5 | 총병12 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=43.5) |
| v2-army-salt-city | 3 | 12.75 | 총병4 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=12.75) |
| v2-army-salt-city | 3 | 41 | 총병23 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=41) |
| v2-army-salt-fort-gun | 2 | 51.25 | 총병23 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=51.25) |
| x-squad-30-ranged | 2 | 7.75 | 상위20 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=2&t=7.75) |

### 대마법사: 총 앞에 서 있음 (11)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-field-gun | 3 | 16.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=16.25) |
| v2-army-field-gun | 3 | 18 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=18) |
| v2-army-field-gun | 3 | 20 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field-gun&seed=3&t=20) |
| v2-army-field | 1 | 16.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=16.5) |
| v2-army-field | 1 | 18.5 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=18.5) |
| v2-army-field | 1 | 23.75 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=1&t=23.75) |
| v2-army-field | 2 | 13.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=2&t=13.25) |
| v2-army-field | 2 | 16.25 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=2&t=16.25) |
| v2-army-field | 3 | 13 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=13) |
| v2-army-field | 3 | 17 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=17) |
| v2-army-field | 3 | 20.75 | 대마법사1 | 대마법사: 총 앞에 서 있음 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-field&seed=3&t=20.75) |

### 대마법사: 소금 위 몫 (10)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 5 | 대마법사1 | 대마법사: 소금 위 몫 | 0.368 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=5) |
| v2-army-salt-city-gun | 2 | 49.3 | 대마법사1 | 대마법사: 소금 위 몫 | 0.299 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=49.3) |
| v2-army-salt-city | 2 | 77.77 | 대마법사1 | 대마법사: 소금 위 몫 | 0.244 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=77.77) |
| v2-army-salt-city | 3 | 75.47 | 대마법사1 | 대마법사: 소금 위 몫 | 0.223 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=75.47) |
| v2-army-salt-fort-gun | 1 | 111.77 | 대마법사1 | 대마법사: 소금 위 몫 | 0.163 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=111.77) |
| v2-army-salt-fort-gun | 2 | 103.5 | 대마법사1 | 대마법사: 소금 위 몫 | 0.36 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=103.5) |
| v2-army-salt-fort-gun | 3 | 56.23 | 대마법사1 | 대마법사: 소금 위 몫 | 0.371 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=56.23) |
| x-salt-fort | 1 | 54.65 | 대마법사1 | 대마법사: 소금 위 몫 | 0.156 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=54.65) |
| x-salt-fort | 2 | 44.18 | 대마법사1 | 대마법사: 소금 위 몫 | 0.21 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=44.18) |
| x-salt-fort | 3 | 41.07 | 대마법사1 | 대마법사: 소금 위 몫 | 0.226 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=41.07) |

### 헛시전: 알 수 있었던 것 (5)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 2 | 77.77 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.111 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=77.77) |
| v2-army-salt-fort-gun | 1 | 111.77 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.172 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=111.77) |
| v2-army-salt-fort-gun | 2 | 103.5 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.17 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=103.5) |
| v2-army-salt-fort-gun | 3 | 56.23 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.219 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=56.23) |
| x-salt-fort | 1 | 54.65 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.111 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=54.65) |

### 포 사선에 아군 (3)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-ambush-gun | 1 | 0.4 | 총병41 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-ambush-gun&seed=1&t=0.4) |
| v2-army-salt-city-gun | 2 | 1.02 | 총병60 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=1.02) |
| v2-army-salt-fort-gun | 1 | 2.52 | 총병40 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=2.52) |

### 아군 피해 몫 (2)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-archmage-2v6 | 3 | 14.62 | 편 0 | 아군 피해 몫 | 0.164 | [열기](../sandbox/index.html#v2-archmage-2v6&seed=3&t=14.62) |
| x-squad-30-ranged | 1 | 53.5 | 편 1 | 아군 피해 몫 | 0.332 | [열기](../sandbox/index.html#x-squad-30-ranged&seed=1&t=53.5) |

### 오류: 느린 걸음 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 2 | 0.68 | - | 오류: 느린 걸음 (ms) | 83 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.68) |

### 소금 안개 안에서 짓기 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 2 | 45.75 | 대마법사1 | 소금 안개 안에서 짓기 | 흙벽 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=45.75) |

### 체력 남기고 도망 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-challenger-3 | 2 | 22 | 초보2 | 체력 남기고 도망 (평범) | 0.804 | [열기](../sandbox/index.html#v2-challenger-3&seed=2&t=22) |
