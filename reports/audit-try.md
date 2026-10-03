# 지능 점검

엔진 v2.31.0 · 2026-10-03 · 장면 4개 × 씨앗 1·2·3 · 6 s. 문턱은 `data/rules/audit.json`, 만든 명령 `node cli.js audit`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.

## 탐지기별 사건 수

| 탐지기 | 사건 | 장면 수 |
|---|---|---|
| 위험 지대 | 34 | 4 |
| 대마법사: 소금 위 몫 | 10 | 4 |
| 오류: 느린 걸음 | 7 | 1 |
| 막혀 제자리 | 7 | 2 |
| 헛시전: 알 수 있었던 것 | 7 | 3 |
| 포 사선에 아군 | 2 | 2 |
| 떨림 | 1 | 1 |
| 소금 안개 안에서 짓기 | 1 | 1 |
| 아군 피해 몫 | 1 | 1 |

## 장면별 사건 수

| 장면 | 사건 |
|---|---|
| x-salt-fort | 22 |
| v2-army-salt-city | 17 |
| v2-army-salt-fort-gun | 17 |
| v2-army-salt-city-gun | 14 |

## 대마법사 (판마다)

| 장면 | 씨앗 | 누구 | 떠 있는 몫 | 평균 속도 (m/s) | 소금 위 몫 |
|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 대마법사1 | 63% | 18.7 | 37% |
| v2-army-salt-city-gun | 2 | 대마법사1 | 9% | 10.4 | 12% |
| v2-army-salt-city-gun | 3 | 대마법사1 | 100% | 13.3 | 0% |
| v2-army-salt-city | 1 | 대마법사1 | 22% | 11.1 | 21% |
| v2-army-salt-city | 2 | 대마법사1 | 27% | 10.0 | 19% |
| v2-army-salt-city | 3 | 대마법사1 | 29% | 8.2 | 18% |
| v2-army-salt-fort-gun | 1 | 대마법사1 | 32% | 14.2 | 30% |
| v2-army-salt-fort-gun | 2 | 대마법사1 | 41% | 17.7 | 56% |
| v2-army-salt-fort-gun | 3 | 대마법사1 | 29% | 15.1 | 34% |
| x-salt-fort | 1 | 대마법사1 | 35% | 20.9 | 45% |
| x-salt-fort | 2 | 대마법사1 | 28% | 10.9 | 23% |
| x-salt-fort | 3 | 대마법사1 | 26% | 9.7 | 27% |

## 사건 (탐지기마다 앞의 25개)

### 위험 지대 (34)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=4.25) |
| v2-army-salt-city-gun | 2 | 52 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=52) |
| v2-army-salt-city-gun | 2 | 55 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=55) |
| v2-army-salt-city | 1 | 6.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=6.5) |
| v2-army-salt-city | 1 | 46.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=46.75) |
| v2-army-salt-city | 2 | 7 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=7) |
| v2-army-salt-city | 2 | 13 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=13) |
| v2-army-salt-city | 2 | 20.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=20.75) |
| v2-army-salt-city | 2 | 64.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=64.25) |
| v2-army-salt-city | 3 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=6.75) |
| v2-army-salt-city | 3 | 24.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=24.75) |
| v2-army-salt-fort-gun | 1 | 6.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=6.75) |
| v2-army-salt-fort-gun | 1 | 23.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=23.5) |
| v2-army-salt-fort-gun | 1 | 31.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=31.75) |
| v2-army-salt-fort-gun | 2 | 5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=5) |
| v2-army-salt-fort-gun | 2 | 13 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=13) |
| v2-army-salt-fort-gun | 3 | 16.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=16.25) |
| v2-army-salt-fort-gun | 3 | 19.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=19.25) |
| x-salt-fort | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=4.25) |
| x-salt-fort | 1 | 5.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=5.75) |
| x-salt-fort | 1 | 9.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=9.75) |
| x-salt-fort | 1 | 25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=25) |
| x-salt-fort | 1 | 29.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=29.25) |
| x-salt-fort | 1 | 32.75 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=32.75) |
| x-salt-fort | 1 | 39 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=39) |

### 대마법사: 소금 위 몫 (10)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 5 | 대마법사1 | 대마법사: 소금 위 몫 | 0.368 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=5) |
| v2-army-salt-city | 1 | 54.02 | 대마법사1 | 대마법사: 소금 위 몫 | 0.208 | [열기](../sandbox/index.html#v2-army-salt-city&seed=1&t=54.02) |
| v2-army-salt-city | 2 | 65.67 | 대마법사1 | 대마법사: 소금 위 몫 | 0.191 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=65.67) |
| v2-army-salt-city | 3 | 73.6 | 대마법사1 | 대마법사: 소금 위 몫 | 0.184 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=73.6) |
| v2-army-salt-fort-gun | 1 | 56.43 | 대마법사1 | 대마법사: 소금 위 몫 | 0.302 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=56.43) |
| v2-army-salt-fort-gun | 2 | 17.13 | 대마법사1 | 대마법사: 소금 위 몫 | 0.559 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=17.13) |
| v2-army-salt-fort-gun | 3 | 50.43 | 대마법사1 | 대마법사: 소금 위 몫 | 0.338 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=50.43) |
| x-salt-fort | 1 | 44.32 | 대마법사1 | 대마법사: 소금 위 몫 | 0.452 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=44.32) |
| x-salt-fort | 2 | 54.7 | 대마법사1 | 대마법사: 소금 위 몫 | 0.229 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=54.7) |
| x-salt-fort | 3 | 60.32 | 대마법사1 | 대마법사: 소금 위 몫 | 0.266 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=60.32) |

### 오류: 느린 걸음 (7)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 0.67 | - | 오류: 느린 걸음 (ms) | 73 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=0.67) |
| v2-army-salt-city-gun | 1 | 5 | - | 오류: 느린 걸음 (ms) | 67 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=5) |
| v2-army-salt-city-gun | 2 | 0.68 | - | 오류: 느린 걸음 (ms) | 79 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.68) |
| v2-army-salt-city-gun | 2 | 0.7 | - | 오류: 느린 걸음 (ms) | 89 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.7) |
| v2-army-salt-city-gun | 2 | 0.72 | - | 오류: 느린 걸음 (ms) | 64 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.72) |
| v2-army-salt-city-gun | 3 | 0.67 | - | 오류: 느린 걸음 (ms) | 76 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=3&t=0.67) |
| v2-army-salt-city-gun | 3 | 0.78 | - | 오류: 느린 걸음 (ms) | 62 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=3&t=0.78) |

### 막혀 제자리 (7)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 2 | 33 | 총병35 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=33) |
| v2-army-salt-city-gun | 2 | 35 | 총병36 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=35) |
| v2-army-salt-city | 2 | 6 | 총병31 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=6) |
| v2-army-salt-city | 2 | 43 | 총병37 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=43) |
| v2-army-salt-city | 2 | 58.25 | 대마법사1 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=58.25) |
| v2-army-salt-city | 3 | 12.75 | 총병4 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=12.75) |
| v2-army-salt-city | 3 | 32.25 | 총병9 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=32.25) |

### 헛시전: 알 수 있었던 것 (7)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 2 | 65.67 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.121 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=65.67) |
| v2-army-salt-fort-gun | 1 | 56.43 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.151 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=56.43) |
| v2-army-salt-fort-gun | 2 | 17.13 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=17.13) |
| v2-army-salt-fort-gun | 3 | 50.43 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.152 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=50.43) |
| x-salt-fort | 1 | 44.32 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.109 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=44.32) |
| x-salt-fort | 2 | 54.7 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.151 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=54.7) |
| x-salt-fort | 3 | 60.32 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.204 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=60.32) |

### 포 사선에 아군 (2)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 2 | 1.02 | 총병60 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=1.02) |
| v2-army-salt-fort-gun | 1 | 2.52 | 총병40 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=2.52) |

### 떨림 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 1 | 17.75 | 대마법사1 | 떨림 (뒤집기/s) | 3.333 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=17.75) |

### 소금 안개 안에서 짓기 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 1 | 40.75 | 대마법사1 | 소금 안개 안에서 짓기 | 흙벽 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=40.75) |

### 아군 피해 몫 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 2 | 17.13 | 편 1 | 아군 피해 몫 | 0.443 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=17.13) |
