# 숨 결투장 v2.0.0

설정집 3판(`WORLD.md`)의 규칙으로 도는 마법 결투 시뮬레이터. 규격은 `SPEC.md`.

v2.0부터 기본 규칙은 하이 리스크 + 소금 원 + 파도, 체력은 선명도에 비례(150 × max(C, 1)^1.2)다. 1.x의 기본 동작은 `rules: A.V1_RULES`(SPEC 24장, `reports/v2.0.0.md`).

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
node cli.js scene sandbox/scenes/duel.json  # 장면 한 판 (샌드박스와 같은 결과)
node cli.js suite                          # 표준 시험 묶음: 기준과 비교해 바뀐 줄만 (--save로 기준 저장, 코어 수만큼 병렬)
```

## 샌드박스 v0.1

`sandbox/index.html`을 브라우저로 연다(서버 필요 없음). 사람·바위·화약통·벽을 놓고, 등급·덱·두뇌 성향·규칙을 바꾸고, 여러 편을 싸움 붙인다. 장면은 JSON으로 내보내고 다시 불러온다. 같은 장면·씨앗이면 명령줄과 결과가 같다. 자세한 것은 SPEC 19장.

`src/`·`metrics/`·`data/`·`sandbox/scenes/*.json`을 고쳤으면 `node cli.js pack`으로 `sandbox/arena.js`(엔진·데이터·장면을 한 장에 싼 것)를 다시 싼다(안 하면 시험이 알려 준다). 빌드 도구는 없다.

## 구조 (SPEC 22장)

| 자리 | 하는 일 |
|---|---|
| `src/core.js` | 규칙의 바탕: 세계, 물리, 마법 방출, 장악권, 피로, 녹화. 켜진 규칙의 훅을 부른다 |
| `src/rules/` | 규칙 하나에 한 파일: 장비, 지대, 소금 원, 파도, 몸 묶기, 하이 리스크, 도발, 서클, 화약통, 대응(풀기·대비·순간 반응), 은실 옷 |
| `src/brain/` | 기본 두뇌 (바꿔 끼울 수 있음): 읽기·입장·움직임·고르기, `techniques/`(기술 하나에 한 파일), `skills.js`(판단 수준) |
| `src/index.js` | 등급·덱·싸움 배치·장면·학습 API |
| `src/registry.js` | 등록: 마법·덱·등급·두뇌·규칙 |
| `src/math.js`, `src/data.js` | 결정론 수학, 데이터 읽기 |
| `data/` | 마법(원소마다 한 파일), 원소별 기본책, 덱, 등급, 판단 수준, 장비 (JSON) |
| `metrics/` | 행동 지표 |
| `experiments/` | 병렬 실행기(`par.js`, 결과는 한 줄로 돌린 것과 같다), 결과 지문(`hash.js`), 대결 재기(`versus.js`) |
| `cli.js` | 명령줄 |
| `test/test.js` | 규격 시험 |
| `test/suite.js`, `suite-baseline.json` | 표준 시험 묶음과 기준 |
| `reports/`, `REPORT.md` | 버전마다 측정 보고, 요약과 목차 |
| `viewer.html` | 녹화 보기 |
| `sandbox/` | 샌드박스 화면, 예시 장면, `arena.js`(묶음) |

## 새 마법·규칙 넣기

마법: `data/spells/원소.json`에 틀(`t`)과 필드를 맞춰 한 항목 추가 → `node cli.js pack` → 덱에 넣고 `node cli.js duel`로 확인. 파일을 고치지 않고 붙이려면 `Arena.register.spell(...)`(SPEC 19장).

규칙: `src/rules/`에 규칙 모듈 한 파일(스위치, 엔진 훅, 두뇌 훅)을 더한다. 정해진 훅에만 끼어들고, 끄면 예전과 같아야 한다(SPEC 22장).
