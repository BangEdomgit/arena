# CLAUDE.md

숨 결투장: 설정집 3판(`WORLD.md`)의 규칙으로 도는 결정론 마법 결투 시뮬레이터와, 그 위에 올린 브라우저 샌드박스(`sandbox/`). Node 18 이상, 의존성·빌드 없음(`package.json`도 없다).

## 기준 문서

- `SPEC.md`가 **유일한 기준**이다. 코드와 SPEC이 어긋나면 코드가 틀린 것이다. 규칙을 바꾸려면 SPEC부터 고친다.
- `WORLD.md`는 세계관의 근거(설정집 3판). 규칙의 "왜"를 찾을 때 본다. 고치지 않는다.
- `REPORT.md`는 시뮬레이션 측정 보고. 결과가 바뀌는 변경을 했으면 다시 재서 고친다.

## 명령

```
node test/test.js                 # 회귀 시험. 무엇을 고치든 끝나면 돌린다
node cli.js bench                 # 속도. 엔진을 고쳤으면 SPEC 17장과 비교
node cli.js duel 평범 평범 100     # 결투 N판 (등급A 등급B N 덱A 덱B)
node cli.js ring 대마법사 평범 50 기본기 5
node cli.js league 평범 20        # 원소 기본책끼리 총당
node cli.js replay 상위 상위 replay.json   # 녹화 → viewer.html에 끌어다 놓기
node cli.js scene sandbox/scenes/duel.json # 장면 한 판
node cli.js pack                  # JSON(spells·books·scenes)을 고쳤으면 sandbox/data.js 다시 싸기
node cli.js suite [묶음]           # 표준 시험 묶음(약 17 s): suite-baseline.json과 비교해 바뀐 줄만. 규칙·두뇌를 바꿨으면 돌린다
node cli.js suite --save          # 바뀐 게 의도한 것이면 기준을 새로 저장하고 같이 커밋한다
```

`replay.json` 같은 녹화 파일은 커밋하지 않는다.

## 구조

| 파일 | 하는 일 |
|---|---|
| `src/core.js` | 규칙: 세계, 물리, 마법 방출(`release`), 장악권(`share`·`gOf`), 피로, 판 돌리기(`run`), 녹화 |
| `src/brain.js` | 판단: `think(W, m)` 하나. 새 두뇌도 같은 모양으로 내보내면 바꿔 끼울 수 있다 |
| `src/spells.json` | 마법 데이터. 이름이 키, `t`가 틀(SPEC 8장) |
| `src/books.json` | 원소별 기본 마법책 |
| `src/index.js` | 바깥 API: `TIERS`(등급), `DECKS`(덱), `BRAINS`, `mage`, `battle`, `duel`, 장면(`sceneWorld`, `runScene`, `recording`), `register`, `learn` |
| `src/registry.js` | 등록: `register.spell / deck / tier / brain / rule` |
| `cli.js` | 명령줄 |
| `test/test.js` | 규격 시험. `ok('설명', () => { ... assert ... })` 모양으로 더한다 |
| `test/suite.js`, `suite-baseline.json` | 표준 시험 묶음과 그 기준(SPEC 21장). 대진 줄의 id는 기준의 열쇠라 함부로 바꾸지 않는다 |
| `viewer.html` | 녹화 보기. 혼자 도는 HTML 한 장(보기용 녹화 하나가 박혀 있다) |
| `sandbox/index.html`, `sandbox/sandbox.js` | 샌드박스 화면. `../src/*.js`를 그대로 읽는다(SPEC 19장) |
| `sandbox/scenes/*.json` | 예시 장면 |
| `sandbox/data.js` | **만든 파일**(`node cli.js pack`). JSON을 브라우저 전역 `ArenaData`로 싼 것. 손으로 고치지 않는다 |

데이터(`spells.json`) · 규칙(`core.js`) · 판단(`brain.js`)을 섞지 않는다.

## 지킬 것

- **결정론**: 난수는 세계마다 하나. `W.rng()`·`W.rnd(a, b)`만 쓰고 `Math.random`이나 시계에 기대는 코드는 넣지 않는다. 같은 씨앗이면 같은 결과가 나와야 한다(시험 1번).
- **결정론 수학**: 엔진(`src/*.js`)에서 `Math.pow·sin·cos·atan2·hypot·exp·log` 같은 초월 함수를 쓰지 않는다. JS 엔진마다 마지막 자리가 달라 Node와 브라우저의 판이 갈라진다. 대신 `core`의 `pow`, `sin`, `cos`, `atan2`, `exp`, `log`, `hyp`(brain에선 `C.pow` 등). 시험이 본다(SPEC 20장).
- **UMD**: 엔진 파일은 `(function (root, factory) { ... })(...)`로 감싸 Node와 브라우저 양쪽에서 돈다. 새 파일도 같은 모양으로 쓰고, 브라우저 전역 이름과 `sandbox/index.html`의 `<script>` 순서를 맞춘다. 엔진 안에서 `require`를 새로 쓰지 말고 factory 인자로 받는다.
- **새 규칙은 스위치로**: `DEFAULT_RULES`에 스위치를 더하고, 끄면 이전 동작과 똑같아야 한다.
- **단위**: m, s, kg, J. 시간 간격 `DT = 1/30 s`.
- **등급·덱·마법 이름**은 한국어 문자열이 곧 키다(`'대마법사'`, `'합법 최강'`, `'낙뢰'`). 이름을 바꾸면 `books.json`, `DECKS`, 시험, 문서를 함께 고친다.
- **금지 마법**(`banned: 1`)은 `addMage`에서 기본으로 책에서 빠진다. `allowBanned`로만 쓴다.
- 의존성을 들이지 않는다. 표준 라이브러리만.

## 바꾸는 절차 (SPEC 1장)

`SPEC.md` 수정 → 코드 → `node test/test.js` → `node cli.js bench` → `CHANGELOG.md` → 버전 올림.

버전 자리: 큰 수는 규칙의 뜻이 바뀔 때, 가운데는 새 마법·스위치·두뇌 기능(끄면 예전과 같음), 끝 수는 버그 수정·수치 조정.

버전 문자열은 여러 곳에 있다. 올릴 때 함께 고친다:
`src/core.js`(`VERSION`, 머리 주석), `src/brain.js`(`VERSION`, 머리 주석), `src/index.js`·`src/registry.js`·`cli.js`·`test/test.js` 머리 주석, `README.md`·`SPEC.md` 제목, `CHANGELOG.md`. 예시 장면의 `"v"`와 `node cli.js pack`도. 샌드박스 자체의 버전(v0.1)은 `sandbox/index.html`·`sandbox.js`·`pack.js`·SPEC 19장에 따로 있다.

시험이 실패하면 규격을 어긴 것이다. 규칙을 일부러 바꾼 거라면 시험도 고치고 CHANGELOG에 이유를 적는다.

## 새 마법 넣기

`spells.json`에 틀(`t`)과 필드를 맞춰 한 항목 추가 → `node cli.js pack` → 덱에 넣고 `node cli.js duel`로 확인. 새 틀이 필요하면 `core.js`의 `release`에 갈래를 더하고, 두뇌가 쓰게 `brain.js`의 후보 평가에도 더하고, SPEC 8장에 적는다.

## 샌드박스를 고칠 때

- 규칙·판단은 샌드박스에 넣지 않는다. 엔진(`src/`)에 넣고 샌드박스는 부르기만 한다. 샌드박스용 엔진 사본을 만들지 않는다.
- 판을 돌리는 건 `A.sceneWorld` → `A.stepWorld` / `A.over` / `A.result`뿐이다. 그래야 명령줄과 결과가 같다(시험).
- 브라우저에서 확인할 땐 Chromium을 헤드리스로 띄워 `file://.../sandbox/index.html`을 연다. 손잡이: `window.Sandbox`(`loadScene`, `step`, `runToEnd`, `exportScene`, `importText`).

## 코드 모양

- CommonJS, 파일 첫 줄 `'use strict';`.
- 주석과 문서는 한국어, 식별자는 짧은 영어(`W` 세계, `m` 마법사, `s` 마법, `g` 장악 계수, `C` 선명도).
- 한 줄에 여러 문장을 붙이는 조밀한 모양을 그대로 따른다. 고치는 김에 서식을 바꾸지 않는다.
