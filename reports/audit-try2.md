# 지능 점검

엔진 v2.31.0 · 2026-10-03 · 장면 4개 × 씨앗 1·2·3 · 6 s. 문턱은 `data/rules/audit.json`, 만든 명령 `node cli.js audit`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.

## 탐지기별 사건 수

| 탐지기 | 사건 | 장면 수 |
|---|---|---|
| 위험 지대 | 43 | 4 |
| 대마법사: 소금 위 몫 | 9 | 4 |
| 막혀 제자리 | 8 | 3 |
| 오류: 느린 걸음 | 7 | 1 |
| 헛시전: 알 수 있었던 것 | 5 | 3 |
| 포 사선에 아군 | 2 | 2 |
| 소금 안개 안에서 짓기 | 1 | 1 |

## 장면별 사건 수

| 장면 | 사건 |
|---|---|
| v2-army-salt-fort-gun | 27 |
| v2-army-salt-city | 20 |
| v2-army-salt-city-gun | 14 |
| x-salt-fort | 14 |

## 대마법사 (판마다)

| 장면 | 씨앗 | 누구 | 떠 있는 몫 | 평균 속도 (m/s) | 소금 위 몫 |
|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 대마법사1 | 63% | 18.7 | 37% |
| v2-army-salt-city-gun | 2 | 대마법사1 | 9% | 10.4 | 12% |
| v2-army-salt-city-gun | 3 | 대마법사1 | 100% | 13.3 | 0% |
| v2-army-salt-city | 1 | 대마법사1 | 24% | 8.9 | 7% |
| v2-army-salt-city | 2 | 대마법사1 | 22% | 10.1 | 24% |
| v2-army-salt-city | 3 | 대마법사1 | 56% | 9.5 | 22% |
| v2-army-salt-fort-gun | 1 | 대마법사1 | 80% | 9.5 | 16% |
| v2-army-salt-fort-gun | 2 | 대마법사1 | 43% | 21.5 | 36% |
| v2-army-salt-fort-gun | 3 | 대마법사1 | 30% | 12.9 | 37% |
| x-salt-fort | 1 | 대마법사1 | 18% | 8.5 | 16% |
| x-salt-fort | 2 | 대마법사1 | 19% | 11.8 | 21% |
| x-salt-fort | 3 | 대마법사1 | 28% | 13.5 | 23% |

## 사건 (탐지기마다 앞의 25개)

### 위험 지대 (43)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 4.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=4.25) |
| v2-army-salt-city-gun | 2 | 52 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=52) |
| v2-army-salt-city-gun | 2 | 55 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=55) |
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
| v2-army-salt-fort-gun | 1 | 11 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=11) |
| v2-army-salt-fort-gun | 1 | 18 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=18) |
| v2-army-salt-fort-gun | 1 | 111.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=111.5) |
| v2-army-salt-fort-gun | 2 | 5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=5) |
| v2-army-salt-fort-gun | 2 | 16 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=16) |
| v2-army-salt-fort-gun | 2 | 22.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=22.5) |
| v2-army-salt-fort-gun | 2 | 33 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=33) |
| v2-army-salt-fort-gun | 2 | 36.25 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=36.25) |
| v2-army-salt-fort-gun | 2 | 42.5 | 대마법사1 | 위험 지대 (s) | 1.25 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=42.5) |

### 대마법사: 소금 위 몫 (9)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 5 | 대마법사1 | 대마법사: 소금 위 몫 | 0.368 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=5) |
| v2-army-salt-city | 2 | 77.77 | 대마법사1 | 대마법사: 소금 위 몫 | 0.244 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=77.77) |
| v2-army-salt-city | 3 | 75.47 | 대마법사1 | 대마법사: 소금 위 몫 | 0.223 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=75.47) |
| v2-army-salt-fort-gun | 1 | 111.77 | 대마법사1 | 대마법사: 소금 위 몫 | 0.163 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=111.77) |
| v2-army-salt-fort-gun | 2 | 103.5 | 대마법사1 | 대마법사: 소금 위 몫 | 0.36 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=103.5) |
| v2-army-salt-fort-gun | 3 | 56.23 | 대마법사1 | 대마법사: 소금 위 몫 | 0.371 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=56.23) |
| x-salt-fort | 1 | 54.65 | 대마법사1 | 대마법사: 소금 위 몫 | 0.156 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=54.65) |
| x-salt-fort | 2 | 44.18 | 대마법사1 | 대마법사: 소금 위 몫 | 0.21 | [열기](../sandbox/index.html#x-salt-fort&seed=2&t=44.18) |
| x-salt-fort | 3 | 41.07 | 대마법사1 | 대마법사: 소금 위 몫 | 0.226 | [열기](../sandbox/index.html#x-salt-fort&seed=3&t=41.07) |

### 막혀 제자리 (8)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 2 | 33 | 총병35 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=33) |
| v2-army-salt-city-gun | 2 | 35 | 총병36 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=35) |
| v2-army-salt-city | 2 | 6 | 총병31 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=6) |
| v2-army-salt-city | 2 | 12 | 총병17 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=12) |
| v2-army-salt-city | 2 | 43.5 | 총병12 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=43.5) |
| v2-army-salt-city | 3 | 12.75 | 총병4 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=12.75) |
| v2-army-salt-city | 3 | 41 | 총병23 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-city&seed=3&t=41) |
| v2-army-salt-fort-gun | 2 | 51.25 | 총병23 | 막혀 제자리 (s) | 3 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=51.25) |

### 오류: 느린 걸음 (7)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 1 | 0.68 | - | 오류: 느린 걸음 (ms) | 83 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=0.68) |
| v2-army-salt-city-gun | 1 | 0.7 | - | 오류: 느린 걸음 (ms) | 64 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=1&t=0.7) |
| v2-army-salt-city-gun | 2 | 0.67 | - | 오류: 느린 걸음 (ms) | 82 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.67) |
| v2-army-salt-city-gun | 2 | 0.68 | - | 오류: 느린 걸음 (ms) | 123 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.68) |
| v2-army-salt-city-gun | 2 | 0.7 | - | 오류: 느린 걸음 (ms) | 125 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=0.7) |
| v2-army-salt-city-gun | 3 | 0.67 | - | 오류: 느린 걸음 (ms) | 62 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=3&t=0.67) |
| v2-army-salt-city-gun | 3 | 0.78 | - | 오류: 느린 걸음 (ms) | 84 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=3&t=0.78) |

### 헛시전: 알 수 있었던 것 (5)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city | 2 | 77.77 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.111 | [열기](../sandbox/index.html#v2-army-salt-city&seed=2&t=77.77) |
| v2-army-salt-fort-gun | 1 | 111.77 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.172 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=111.77) |
| v2-army-salt-fort-gun | 2 | 103.5 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.17 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=103.5) |
| v2-army-salt-fort-gun | 3 | 56.23 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.219 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=3&t=56.23) |
| x-salt-fort | 1 | 54.65 | 대마법사1 | 헛시전: 알 수 있었던 것 (소금) | 0.111 | [열기](../sandbox/index.html#x-salt-fort&seed=1&t=54.65) |

### 포 사선에 아군 (2)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-city-gun | 2 | 1.02 | 총병60 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-city-gun&seed=2&t=1.02) |
| v2-army-salt-fort-gun | 1 | 2.52 | 총병40 | 포 사선에 아군 | 산탄 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=1&t=2.52) |

### 소금 안개 안에서 짓기 (1)

| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |
|---|---|---|---|---|---|---|
| v2-army-salt-fort-gun | 2 | 45.75 | 대마법사1 | 소금 안개 안에서 짓기 | 흙벽 | [열기](../sandbox/index.html#v2-army-salt-fort-gun&seed=2&t=45.75) |
