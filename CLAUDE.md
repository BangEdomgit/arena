# CLAUDE.md

숨 결투장: 설정집 3판(`WORLD.md`)의 규칙으로 도는 결정론 마법 결투 시뮬레이터와, 그 위에 올린 브라우저 샌드박스(`sandbox/`). Node 18 이상, 의존성·빌드 없음(`package.json`도 없다).

## 기준 문서

- `SPEC.md`가 **유일한 기준**이다. 코드와 SPEC이 어긋나면 코드가 틀린 것이다. 규칙을 바꾸려면 SPEC부터 고친다.
- `WORLD.md`는 세계관의 근거(설정집 3판). 규칙의 "왜"를 찾을 때 본다. 고치지 않는다.
- `REPORT.md`는 측정 보고의 요약과 목차, 본문은 `reports/`에 버전마다 한 장(`reports/v1.12.0.md`). 결과가 바뀌는 변경을 했으면 다시 재서 그 버전의 장을 쓰고 `REPORT.md`의 요약·목차를 고친다. 성적표(`reports/scorecard.md`)는 `node cli.js report`로 그 버전의 열을 더한다.

## 명령

```
node test/test.js                 # 회귀 시험. 무엇을 고치든 끝나면 돌린다
node cli.js bench                 # 속도. 엔진을 고쳤으면 SPEC 17장과 비교
node cli.js duel 평범 평범 100     # 결투 N판 (등급A 등급B N 덱A 덱B)
node cli.js ring 대마법사 평범 50 기본기 5
node cli.js league 평범 20        # 원소 기본책끼리 총당
node cli.js replay 상위 상위 replay.json   # 녹화 → viewer.html에 끌어다 놓기
node cli.js scene sandbox/scenes/duel.json # 장면 한 판
node cli.js pack                  # src/·metrics/·data/·장면을 고쳤으면 sandbox/arena.js 다시 싸기 (안 하면 시험이 알려 준다)
node experiments/hash.js [--v1]   # 결과 지문 넷. 구조·속도만 고쳤으면 그대로여야 한다 (값은 reports/v2.15.0.md. --v1은 1.x 기본 A.V1_RULES 위에서, --rules '{…}'는 덧씌움)
node experiments/v2tune.js all    # v2.0 목표 측정: 이웃·부류·원소(원 안·밖)·무리 (약 50 s). ablate는 기술 떼기, sky는 대마법사끼리
node experiments/army.js all 20   # v2.1 대마법사 대 무리: 들판·기습·준비·소금 도시·던지기·등급 무리 (약 60 s). scenes는 대표 장면
node experiments/master.js all 200 --deck '대마법사 운영'   # v2.2 고수 싸움: 대마법사끼리 판단 단계별 모습 지표 (--tac로 새 기술 끄기, --tacA로 앞 사람 기술 떼기)
node experiments/master.js all 200 --deck '대마법사 진지' --rules '{"flightCut":true,"fort":true,"trapChain":true}'   # v2.3 날기 끊기·진지 (사람마다 끊기·진지 수). scene fort는 대표 장면
node experiments/master.js all 200 --deck '대마법사 청사진' --rules '{"flightCut":true,"fort":true,"trapChain":true,"reflex":true,"snap":true,"blueprint":true}'   # v2.4 반사 겹·끊는 움직임·청사진 (방향 전환·반응 시간·흔들기·청사진). scene agile은 매 걸음 녹화 장면
node experiments/master.js all 400 --deck '대마법사 청사진' --rules '{"flightCut":true,"fort":true,"trapChain":true,"reflex":true,"snap":true,"blueprint":true,"tactics":true}'   # v2.5 작전 겹·각도 판단 (각도 …·작전 … 줄: 둘레 각속도·한쪽 사거리·강요한 수·작전별 완수). scene tactics는 전설 대 전설 장면
node experiments/diag.js 100 [--tac '{"survive":false}'] [--skill 전설,대가] [--rules '{"pace":false}'] [--save 이름]   # v2.6 대마법사 결투장 진단: 걸음마다 지표(스스로 입은 피해·짓는 시간·동시 칸·쓸모 있는 벽·빈틈·막힌 직사·마법별 명중, v2.14 박자, metrics/watch)
node experiments/versus.js '{"tier":"중간","skill":"대가"}' '{"tier":"중간","skill":"상급"}' 1000 '{"risk":true}' backfire   # 대결 N판 (병렬)
node cli.js suite [묶음]           # 표준 시험 묶음(약 20초, 코어 수만큼 병렬. --jobs 1이면 한 줄로): suite-baseline.json과 비교해 바뀐 줄만. 규칙·두뇌를 바꿨으면 돌린다
node cli.js suite --save          # 바뀐 게 의도한 것이면 기준을 새로 저장하고 같이 커밋한다
node cli.js report                # v2.9 성적표: 결투장 전설 대 전설·사다리·상위 무리 기준을 재서 reports/scorecard.md에 이 버전으로 쌓는다 (약 20 s, --show는 보기만)
node experiments/crowd.js 20 [--n 6,10,14,20] [--tac '{…}'] [--rules '{…}']   # v2.9 상위 무리 기준: 대마법사(전설) 하나 대 상위 N
node experiments/ladder.js 전설-대가 800 [--abl] [--base] [--tacB '{…}'] [--rules '{…}']   # v2.10 단계 사다리 떼어 재기 (결투장, --abl은 전설의 기술을 하나씩)
node experiments/v2rules.js 1     # 대실험: 규칙 16조합 총당 (2·3단계는 조합 이름을 준다, reports/v2.0-rules.md)
# 수치를 맞출 땐 100판(±10%p)으로 가르지 말고 1000판 이상으로 잰다 (reports/v1.3.1.md, 13절)
```

`replay.json` 같은 녹화 파일은 커밋하지 않는다.

## 구조 (SPEC 22장)

| 자리 | 하는 일 |
|---|---|
| `src/core.js` | 규칙의 바탕: 세계, 물리, 마법 방출(`release`), 장악권(`share`·`gOf`), 피로, 판 돌리기(`run`), 녹화. 정해진 자리에서 켜진 규칙의 훅(`W.H`)을 부른다 |
| `src/rules/*.js` | **규칙 하나 = 파일 하나** (gear, terrain, saltRing, wave, control, risk, taunt, multiSlot, barrels, response, silver, body, evade, flight, light, bulwark, army, morale, saltLand, fort, snap, reflex, blueprint, tactics, endure, hold, breath, pace). 엔진 훅·두뇌 훅·새 틀. 목록과 차례는 `rules/index.js`. 규칙의 수는 `data/rules/*.json` |
| `src/math.js`, `src/data.js` | 결정론 수학, `data/` 읽기 |
| `src/brain/` | 판단: `index.js`의 `think(W, m)` → `read`·`stance`·`move`·`choose`. 기술은 `techniques/`에 하나씩, 판단 수준은 `skills.js`. 새 두뇌도 `think` 모양으로 내보내면 바꿔 끼울 수 있다 |
| `src/index.js` | 바깥 API: `TIERS`(등급), `DECKS`(덱), `BRAINS`, `SKILLS`, `mage`, `battle`, `duel`, 장면(`sceneWorld`, `runScene`, `recording`), `register`, `learn`, `look` |
| `src/registry.js` | 등록: `register.spell / deck / tier / brain / rule / unrule` |
| `data/` | JSON: `spells/원소.json`(마법, 이름이 키, `t`가 틀, 차례는 `spells/order.json`), `books.json`(원소별 기본책), `decks.json`, `tiers.json`, `skills.json`, `gear.json`, `blueprints.json`(청사진) |
| `metrics/look.js`, `metrics/watch.js` | 행동 지표(싸우는 모습): 판이 끝난 기록에서(`look`), 걸음마다 지켜보며(`watch`, v2.6) |
| `experiments/` | `par.js`(병렬 실행기, Node 전용, worker_threads. 일감 `{ mod, fn, args }`, 결과는 일꾼 수와 상관없이 같다), `hash.js`(결과 지문), `versus.js`(대결 N판: 점수·표준오차·시간·기록 칸의 합, 장비까지) |
| `reports/` | 버전마다 한 장의 측정 보고. `REPORT.md`는 요약과 목차 |
| `cli.js` | 명령줄 |
| `test/test.js` | 규격 시험. `ok('설명', () => { ... assert ... })` 모양으로 더한다 |
| `test/suite.js`, `suite-baseline.json` | 표준 시험 묶음과 그 기준(SPEC 21장). 대진 줄의 id는 기준의 열쇠라 함부로 바꾸지 않는다 |
| `viewer.html` | 녹화 보기. 혼자 도는 HTML 한 장(보기용 녹화 하나가 박혀 있다) |
| `sandbox/index.html`, `sandbox/sandbox.js` | 샌드박스 화면. 묶음 `arena.js`를 읽는다(SPEC 19장) |
| `sandbox/scenes/*.json` | 예시 장면 |
| `sandbox/arena.js` | **만든 파일**(`node cli.js pack`, `sandbox/pack.js`). 엔진 모듈·데이터·장면을 브라우저 전역(`Arena`, `ArenaData`, `ArenaWatch`…)으로 싼 것. 손으로 고치지 않는다 |

데이터(`data/`) · 규칙(`core.js`와 `rules/`) · 판단(`brain/`)을 섞지 않는다.

## 지킬 것

- **결정론**: 난수는 세계마다 하나. `W.rng()`·`W.rnd(a, b)`만 쓰고 `Math.random`이나 시계에 기대는 코드는 넣지 않는다. 같은 씨앗이면 같은 결과가 나와야 한다(시험 1번).
- **결정론 수학**: 엔진(`src/` 아래 모두, `metrics/`)에서 `Math.pow·sin·cos·atan2·hypot·exp·log` 같은 초월 함수를 쓰지 않는다. JS 엔진마다 마지막 자리가 달라 Node와 브라우저의 판이 갈라진다. 대신 `src/math.js`의 `pow`, `sin`, `cos`, `atan2`, `exp`, `log`, `hyp`(core도 내보낸다. brain에선 `C.pow` 등). 시험이 본다(SPEC 20장).
- **모듈과 묶음**: 엔진 파일은 평범한 CommonJS다(1.12.0, UMD는 없앴다). 브라우저는 `node cli.js pack`이 묶은 `sandbox/arena.js`로 읽는다. 그래서 엔진 안의 `require`는 **정적인 상대 경로**(`require('./util')`, `require('../../data/skills.json')`)만 쓴다. 표준 모듈(`fs` 등)이나 변수 경로는 묶이지 않는다. 새 파일을 더하면 `node cli.js pack`.
- **v2.15 (SPEC 39장)**: 수읽기는 `src/brain/plan/`(`state` 줄인 상태 — 방어 자원 여섯의 비트·피할 곳 아홉, `search` 읽기 — 미리 만든 형 배열만, 새 객체 없음, `joseki`, `index` — read·net·value·commit과 지표용 `slackOf`·`ansOf`). 판단 수준 `tac.read`(깊이, 0이면 아무것도 안 함: 모두 0이면 v2.14 지문), 선명도 5 이상의 결투에서만. 두뇌 상태는 `K.pl`(첫 수·메이트·체크), `K.netN`·`K.brk`(그물 깨기: `brain/move`가 걸음을, 빠른 판이 늘 움직이기를 쉰다), `K.keep`·`K.keepT`(정석의 아낄 자원). 시전에 `cast.chk`·`cast.mate`, 기록 `mlog.chk`·`mate`·`brk`·`plN`·`plNodes`·`js*`. 수는 `data/plan.json`(맞을 가망 `hit`은 판 중에 배운다)·`data/joseki.json`. 샌드박스는 `ArenaBrain.plan`을 읽기만
- **v2.14 (SPEC 38장)**: 엔진 시계: 걸음 간격은 세계마다 `W.dt`(`rules.fineStep`이면 1/60 s), 걸음 수로 잰 간격은 `W.sk`배. 엔진·규칙·지표의 새 코드는 `DT` 대신 `W.dt`(core 안은 `stepWorld`가 맞춰 둔 모듈 `DT`), `W.step % n`은 `n * W.sk`. 빠른 판 `rules/pace`(`pace`, 기본 꺼짐, 대마법사 결투 장면이 켠다, `data/rules/pace.json`): 선명도 8 이상의 떡대·막기(`st.guard`, 기록 `mlog.guard*`)·감각 조준(엔진 훅 `track`)·꺾기(엔진 훅 `flyAccel`), 두뇌 `tac.pace`(상급 1·대가 2·전설 3)의 서두름 `K.hurry`(날카롭게의 문턱)·막기·늘 움직이기(`bound` 맨 뒤, 소금 원의 벽을 다시 부른다). 박자 지표는 `metrics/watch`(평균 속도·초당 방향 전환·하는 일·교환). 샌드박스 v0.2: 앞서 보기(`S.ah`)·사건 직전 느리게·되감기(`seek`)·판단 그림·나란히(`beside`, `ArenaWatch`)
- **v2.13 (SPEC 37장)**: 두뇌 기술 둘: 교전 유지 `techniques/engage`(`tac.engage`, `data/engage.json`, `brain/index`의 think에서 steer 앞에 `engage.adjust`: `K.closeIn`이면 작전의 둘레 걸음·거리 톱질이 쉰다, `K.low`면 숨, 결투에서만)와 덫길 `techniques/trapline`(`tac.trapLine`, `crowded`는 청사진도 부른다). 날카롭게의 기다림의 끝(`waitMax`·`waitFade`). 침묵·결판·덫 지표는 `metrics/watch`의 `silence`(판 전체 값). 샌드박스의 카메라는 그리기 변환만(`S.cam`, 마우스는 `mpos`가 거꾸로), 사건은 `events`가 읽기만
- **v2.12 (SPEC 36장)**: 공격 방식은 두뇌 기술 `techniques/mode`(판단 수준 `tac.mode` 1~5, 수는 `data/mode.json`, 전설만의 것은 `l5`). `choose`에서 칸 고르기 뒤 `mode.pick`(→ `K.mode`, 확정 순간 `K.sureW`, 갈 곳 `K.covPts`·`K.covN`), 값 고치기 끝에 `mode.value`, 시전에 `mode.commit`(`cast.mode`·`cov`·`bait`). 기록은 `m.mlog.mode`, 명중·피해 몫은 `metrics/watch`가 시전의 mode로. 명중 가망의 문턱은 견제의 싼·빠른 수만 건너뛴다(다 건너뛰면 전설이 진다)
- **v2.11 (SPEC 35장)**: 기본 규칙 둘. 당 회복 `gluRegen`(`DEFAULT_RULES`, 3 g/s, V1 1.2)과 숨(`rules/breath`, `breath` 기본 켬, 수는 `data/rules/breath.json`): 상태 `st.breath`(마시는 남은 시간), 기록 `m.mlog.breath*`·`brT`·`brA`·`brH`·`brV`(`mlog.bT`는 장악 경계의 것이라 쓰지 않는다). 마시기는 두뇌 훅 `rest`(쉬려던 참이어도 본다), 판단 수준 `breathAt`·`breathSafe`·`breathPre`. 둘 다 끄면 v2.10 지문
- **v2.10 (SPEC 34장)**: 판단 수준 값 셋(`addMage`의 tac 리터럴): `aim`(명중 가망, 전설만), `wallLos`(상대 피해 가운데 시야 공격 몫이 이만큼일 때만 벽, 대가부터 0.5, `sharp.losShare`), `swarmR`(선명도 몇 배부터 무리 싸움인가, 상위 1.8 `data/tiers.json`: 협공은 `techniques/swarm`, 편의 첫 각은 세계마다 WeakMap). 사다리 떼어 재기는 `experiments/ladder.js`(`--abl`, `--tacA`·`--tacB`), 날카롭게의 기능 하나 끄기는 `tac.sharpOff`(실험). 무리의 경계를 정하는 것은 장악권 규칙이다(끄면 1 대 10 반반, reports/v2.10.0.md)
- **v2.9 (SPEC 33장)**: 두뇌 기술만(날카롭게 `techniques/sharp`의 `P`, 모두 끄면 v2.8 지문): 몰아칠 틈(`storm`)엔 명중 문턱 `minOpen`, 붙잡아 둔 수가 있으면 리듬 들어가기(`inHeld`), 문턱에 막혀 기다리는 동안(`K.waitT`) 빈 칸을 벽·함정·지대에(`wait`, 빈틈이 열리면 끊는다), 세운 벽에 머물기(`behind`: 날기·작전 규칙도 이걸 부른다, 처음 부를 때 읽는다). 성적표는 `node cli.js report`(`experiments/report.js` → `reports/scorecard.json`·`.md`, 버전마다 쌓는다: 결과가 바뀌는 변경을 했으면 돌린다). 상위 무리 기준은 `experiments/crowd.js`(결투장 들판, 대가·상급 반반, 광역·기술·합법 최강)
- **v2.8 (SPEC 32장)**: 붙잡아 둔 설계(`rules/hold`, `hold` 기본 켬, 수는 `data/rules/hold.json`): 두 번째 칸의 시전에 `hold`가 붙으면 엔진 훅 `castHold`가 풀지 않는다. 푸는 판단은 두뇌 훅 `cancel`(칸 고르기 앞). 규칙 모듈이 두뇌 기술을 쓸 땐 처음 부를 때 읽는다(엔진이 규칙을 읽을 때 두뇌는 아직 없다: 순환). 명중 가망·방패의 때는 `techniques/sharp`(`chance`·`threatSoon`), 세운 벽은 `K.wallT`. `endureK`는 0.8(대마법사 하나 대 상위 열이 반반: 장면 `v2-archmage-1v10`)
- **v2.7 (SPEC 31장)**: 기본 규칙 둘. 버티기(`rules/endure`, `endureK`·`endureC`): 상위·대마법사의 머리·당 회복 × (C/2.5)^endureK(v2.8부터 0.8), 평범·중간은 그대로(중간의 판단 사다리가 머리 아끼기에 걸려 있다). 마법의 부딪힘 감쇠(`bluntK`, `rules/body`): 굳은 살 뒤 ÷ C^2.3, 총·화약통·벽 밀기 빼고. 둘 다 0이면 v2.6.0(V1_RULES도 0). 당 회복은 엔진 훅 `gluRegen`. 판단이 잦은 사람의 확률적 기술은 초당으로 맞춘다(박자 흔들기가 판단마다 20%라 전설이 35%를 쉬었다). 장면 `v2-archmage-2v6`(대마법사 둘 대 상위 여섯)은 크기를 적어 둔다(샌드박스의 기본 크기는 40 × 30)
- **v2.6 (SPEC 30장)**: 판단 수준의 기술 `survive`(스스로 죽지 않기)·`sharp`(날카롭게)는 대가부터·선명도 5 이상. 머리 넘침은 `brain/util`의 `heatOver`로 본다(시전·자동 진·청사진 모두). 소금 원·비행의 단단한 벽은 두뇌 훅 `bound`(움직임의 맨 끝)에, 구르기 훅은 방향(`o.dx`·`o.dy`)도 고친다. 땅이 안전한가는 `groundSafe`(대마법사의 함정은 땅에 선 대마법사를 한 방에 죽인다: 내려앉히는 새 코드는 이걸 본다). 걸음마다 보는 지표는 `metrics/watch.js`(판에 닿지 않게 읽기만, 기록 칸을 `m.log`에 더하면 지문이 바뀌니 모습 기록은 `m.mlog`에). 머리 피로가 짓는 시간을 막는다(날면 남는 회복 1.2/s, reports/v2.6.0.md)
- **v2.5 (SPEC 29장)**: 작전 겹(`rules/tactics`, 수·무게는 `data/rules/tactics.json`)은 기본 꺼짐, 판단 수준의 `tac.ops`(대가 1, 전설 2)가 켠다. 두뇌 훅 `phase`·`steer`·`value`·`commit`과 엔진 훅 `mageStep`만 쓴다. 상태·기록은 `m.op`(작전 `cur`, 고른 자리 `tx`·`ty`, 읽은 상대 작전 `eOp`, 기록 `log`). 청사진 짓기는 `blueprint`의 api `startBuild`로 건다. 원 돌기·나선 빠지기는 전설만(`circleLv`)
- **v2.4 (SPEC 28장)**: 반사 겹(`rules/reflex`)·끊는 움직임(`rules/snap`)·청사진(`rules/blueprint`, 청사진은 `data/blueprints.json`)은 기본 꺼짐. 반사 겹은 엔진 쪽(몸)에서 매 걸음 돌고 선명도 5 이상·위협이 있을 때만 훑는다(무리전 속도). 상태·기록은 `m.rx`, 청사진 기록은 `m.fort.bp*`. 나는 사람의 가속 바닥은 발놀림 2부터(누구나 주면 대가의 끊기가 지워진다). 녹화 간격 `recEvery`
- **v2.3 (SPEC 27장)**: 날기 끊기(`flightCut`, `rules/flight` 안)·진지(`rules/fort`, `fort`·`trapChain`)는 기본 꺼짐. 끊기 상태는 `m.cut`, 진지 자리·계획·기록은 `m.fort`. 끊은 동안은 `m.fly === 3`(떠 있어도 서클·출력 풀림: 새 코드에서 "떠 있다"를 볼 땐 `z ≥ 1`과 `fly !== 3`을 가른다). 함정 한도는 `core.trapCap`
- **v2.2 (SPEC 26장)**: 강자(선명도 5 이상)의 두뇌 기술(`rhythm`·`efficacy`·`shape`)은 선명도 5 아래에선 아무것도 하지 않는다(평범·중간의 판이 그대로). 사람의 단계는 `m.phase`, 모습 기록은 `m.mlog`
- **v2.1 (SPEC 25장)**: 장악권은 도달 반경(`domainR` × C) 안에서만 다투고 실은 길 전체로 선다. 부딪히는 피해는 굳은 살(`callus`)만큼 뺀다. 벽은 모두 `core.addWall`로 세운다(모양 고정, 재료 `mat`). 벽을 훑는 새 코드는 `wallsIn`(격자)을 쓴다. 무리·대마법사 두뇌는 `techniques/swarm.js`·`siege.js`(켜지는 때에만)
- **v2.0 기본 (SPEC 24장)**: `risk`·`saltRing`·`wave`·`evade`·`flight`가 켜져 있고 `bodyK`는 2.3(`hpScale`은 끔). 비행은 높이 `z`를 더한다: 새 거리 계산은 높이를 넣어(`hyp3`), 땅에 서는 것(지대·함정·지연 폭발)은 `z ≥ 1`이면 건너뛴다. 1.x 동작을 볼 땐 `rules: A.V1_RULES`. 1.x를 전제로 한 시험은 `test/test.js`의 `legacy(true)` 구간에 둔다
- **새 규칙은 규칙 모듈로만 (SPEC 22장)**: `src/rules/새규칙.js` 한 파일에 `{ name, switch, on, engine: X => ({훅}), brain: B => ({훅}), types, brainTypes }`로 넣고 `rules/index.js` 목록 끝에 붙인다. 정해진 훅(쏠 때 `release`, 맞을 때 `hurt`·`hurtMod`, 걸음마다 `mageStep`·`world`, 위력·선명도·시전 시간·장악 `power`·`ceff`·`castTime`·`share`·`gate`, 두뇌의 후보 가치 `value`·`valueRisk`·`valueMid`·`valueLate` …)에만 끼어든다. `core.js`·`brain/`에 `if (W.rules.새규칙)`을 흩뿌리지 않는다. 꼭 필요한 새 자리는 훅 하나로 더하고(빈 배열이면 예전과 같게) SPEC 22장 표에 적는다. `DEFAULT_RULES`에 스위치(기본 꺼짐)를 더하고, 끄면 이전 동작과 똑같아야 한다(`suite` 바뀐 줄 없음, `hash.js` 그대로). 같은 훅 안의 차례는 목록 차례다.
- **기술은 techniques/에**: 판단 수준이 켜는 기술(콤보·속임수·엄폐…)은 `src/brain/techniques/`에 하나씩, 켜는 스위치는 `data/skills.json`의 `tac`. 규칙에 딸린 판단은 그 규칙 파일의 `brain` 훅에.
- **단위**: m, s, kg, J. 시간 간격 `DT = 1/30 s` (세계마다 `W.dt`, 잘게 걷기 1/60 s).
- **등급·덱·마법 이름**은 한국어 문자열이 곧 키다(`'대마법사'`, `'합법 최강'`, `'낙뢰'`). 이름을 바꾸면 `data/`(`books.json`, `decks.json`, `spells/order.json`), 시험, 문서를 함께 고친다.
- **금지 마법**(`banned: 1`)은 `addMage`에서 기본으로 책에서 빠진다. `allowBanned`로만 쓴다.
- 의존성을 들이지 않는다. 표준 라이브러리만.
- **속도 (1.11.1, SPEC 17장)**: 뜨거운 곳의 객체 모양을 바꾸지 않는다. 사람의 새 칸은 `addMage`의 리터럴에(**맨 위 칸은 127개까지**: 넘으면 판이 두 배 느려진다. v2.5의 `m.op`로 127개, **한도에 닿았다**: 새 칸은 반드시 하위 객체에), 두뇌의 새 값은 `brain/index.js`의 `newK` 리터럴에, 새 상태는 `st`의 열한 칸 옆에(그리고 `stepMage`의 줄이기에), 마법의 새 필드는 `SPELL_KEYS`에 더한다. `delete`, 걸음마다 새 배열·클로저, 배열 `length` 대입, 판단 안의 `Object.assign`을 피한다. 덱이 정하는 값은 `deck()`에. 속도를 고치면 결과가 같은지 본다: `node cli.js suite`가 "바뀐 줄 없음"이어야 한다

## 바꾸는 절차 (SPEC 1장)

`SPEC.md` 수정 → 코드 → `node test/test.js` → `node cli.js bench` → `CHANGELOG.md` → 버전 올림.

버전 자리: 큰 수는 규칙의 뜻이 바뀔 때, 가운데는 새 마법·스위치·두뇌 기능(끄면 예전과 같음), 끝 수는 버그 수정·수치 조정.

버전 문자열은 여러 곳에 있다. 올릴 때 함께 고친다:
`src/core.js`(`VERSION`, 머리 주석), `src/brain/index.js`(`VERSION`, 머리 주석), `src/index.js`·`src/registry.js`·`experiments/par.js`·`cli.js`·`test/test.js` 머리 주석, `README.md`·`SPEC.md` 제목, `REPORT.md`, `CHANGELOG.md`. 예시 장면의 `"v"`와 `node cli.js pack`도. 샌드박스 자체의 버전(v0.2)은 `sandbox/index.html`·`sandbox.js`·`pack.js`·SPEC 19장에 따로 있다.

시험이 실패하면 규격을 어긴 것이다. 규칙을 일부러 바꾼 거라면 시험도 고치고 CHANGELOG에 이유를 적는다.

## 새 마법 넣기

`data/spells/원소.json`에 틀(`t`)과 필드를 맞춰 한 항목 추가(규칙에 딸린 마법이면 `rule: '스위치 이름'` — 꺼지면 책에서 빠져 예전과 같다. 차례는 `data/spells/order.json`, 없으면 파일 차례대로 뒤에) → `node cli.js pack` → 덱에 넣고 `node cli.js duel`로 확인. 새 틀이 필요하면 규칙 모듈의 `types`(방출)·`brainTypes`(두뇌의 값)·`form`(만들어지는 자리)으로 더하고 SPEC 8장에 적는다. 규칙과 상관없는 바탕 틀만 `core.js`의 `release`와 `brain/choose.js`의 `valueForm`에 갈래를 더한다.

## 샌드박스를 고칠 때

- 규칙·판단은 샌드박스에 넣지 않는다. 엔진(`src/`)에 넣고 샌드박스는 부르기만 한다. 샌드박스용 엔진 사본을 만들지 않는다.
- 판을 돌리는 건 `A.sceneWorld` → `A.stepWorld` / `A.over` / `A.result`뿐이다. 그래야 명령줄과 결과가 같다(시험).
- 브라우저에서 확인할 땐 Chromium을 헤드리스로 띄워 `file://.../sandbox/index.html`을 연다. 손잡이: `window.Sandbox`(`loadScene`, `step`, `runToEnd`, `exportScene`, `importText`).

## 코드 모양

- CommonJS, 파일 첫 줄 `'use strict';`.
- 주석과 문서는 한국어, 식별자는 짧은 영어(`W` 세계, `m` 마법사, `s` 마법, `g` 장악 계수, `C` 선명도).
- 한 줄에 여러 문장을 붙이는 조밀한 모양을 그대로 따른다. 고치는 김에 서식을 바꾸지 않는다.
