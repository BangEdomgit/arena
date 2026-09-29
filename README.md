# 숨 결투장 v1.0.1

설정집 3판(`WORLD.md`)의 규칙으로 도는 마법 결투 시뮬레이터. 규격은 `SPEC.md`.

## 바로 쓰기 (Node 18 이상, 설치할 것 없음)

```
node test/test.js                          # 회귀 시험
node cli.js bench                          # 속도
node cli.js duel 평범 평범 20              # 같은 등급 20판
node cli.js duel 상위 상위 10 합법\ 최강 기본기
node cli.js ring 대마법사 평범 50 기본기 5  # 둘러싸기
node cli.js ring 대마법사 병사 40 머스킷 5
node cli.js league 평범 6                  # 원소 기본책 총당
node cli.js replay 상위 상위 replay.json   # 녹화 → viewer.html에 끌어다 놓기
```

## 구조

| 파일 | 하는 일 |
|---|---|
| `src/core.js` | 세계, 물리, 마법 방출, 장악권, 피로, 녹화 |
| `src/brain.js` | 기본 두뇌 (바꿔 끼울 수 있음) |
| `src/spells.json` | 마법 73개 (금지 3, 총 1 포함) |
| `src/books.json` | 원소별 기본 마법책 |
| `src/index.js` | 등급·덱·싸움 배치·학습 API |
| `cli.js` | 명령줄 |
| `test/test.js` | 규격 시험 |
| `viewer.html` | 녹화 보기 |

## 새 마법 넣기

`spells.json`에 틀(`t`)과 필드를 맞춰 한 줄 추가 → 덱에 넣고 `node cli.js duel`로 확인. 새 틀이 필요하면 `core.js`의 `release`에 한 갈래를 더하고 SPEC 8장에 적는다.
