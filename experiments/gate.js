'use strict';
/* 숨 결투장 — v3.0 문턱 (GATE-v4.md, v2.16, SPEC 40장): 1장의 목표 수치를 모두 재서 통과·불합격·애매·못 잼으로 판정하고 버전마다 쌓는다
 *   node cli.js gate [--quick] [--show] [--out 파일]      → reports/gate.json(원자료)·reports/gate.md(표)
 * 판정 (99%): 값의 99% 신뢰 구간(± 2.576 표준오차)이 목표 안이면 ✓ 통과, 목표와 겹치지 않으면 ✗ 불합격, 걸치면 △ 애매(통과로 치지 않음), 잴 수 없으면 — 못 잼.
 *   표준오차: 평균은 표본 표준편차 / √n, 몫(승률·비율)은 √(p(1−p)/n), 시험·결정론·계산 시간처럼 한 번에 정해지는 값은 0.
 * 판 수 (GATE 머리): 결투 100판, 사다리 400판, 무리 20판. --quick이면 결투 30·사다리 100·무리 10 (판정은 그 판 수로)
 * 재는 것 (모두 결정론, 결과는 일꾼 수와 상관없다):
 *   A 시험(test/test.js를 따로 돌린다)·결정론(같은 씨앗 두 번, 브라우저는 Playwright가 있으면 장면 셋)·결투장 한 판 계산(데운 뒤 셋의 평균)·대마법사 1 대 평범 100 30 s 계산
 *   B·C·D·E·F 결투장(v2-tactics-legend) 전설 대 전설 (metrics/watch·judge)
 *   G 이웃 단계 사다리(평범·중간: 기본 결투, 대마법사: 결투장), 전설/대가, Elo, 시간 판정, 계단(단계마다 같은 단계끼리 결투장에서 잰 판단 지표가 늘어나는가)
 *   H 한 등급 위, 상위 1 대 평범 30, 대마법사 대 흩어진 상위 20·30(experiments/crowd), 평범 100 둘러싸기, 머스킷 기습·군대 들판·장악권 밖 던지기(experiments/army)
 *   I 원소(평범 상급, 소금 원 안·밖), 부류(평범·중간·상위 상급), 기본 덱(평범·중간)
 * 2장(판단마다 "확인")은 같은 결투장의 단계별 값을 표로 (gate.md 끝) */
const fs = require('fs'), path = require('path'), A = require('../src');
const ROOT = path.join(__dirname, '..'), ARENA = path.join(ROOT, 'sandbox', 'scenes', 'v2-tactics-legend.json'), Z = 2.576;
const SK = ['초보', '중급', '상급', '대가', '전설'], ELEMS = ['불', '번개', '흙', '물', '얼음', '독'], TYPES = ['서퍼', '메타', '이단'], BASE = ['합법 최강', '광역', '기본기', '기술', '큰 수'];
const OLD = '대마법사 청사진';   // 옛 덱 줄: v2.17에 결투장 덱이 바뀌어 두세 버전은 옛 덱으로도 잰다. 그만 잴 때 ''로
const arena = () => JSON.parse(fs.readFileSync(ARENA, 'utf8'));

/* ---------------- 일감 (일꾼이 부른다) ---------------- */
// 결투장: 두 단계(a, b)로 씨앗 s0..s0+n−1, 판마다 자리를 번갈아. 지표가 필요하면 look
function arenaGames(a, b, s0, n, look, deck) {
  const Wt = require('../metrics/watch'), sc = arena(), out = [];
  for (let s = s0; s < s0 + n; s++) {
    const sw = s % 2, c = JSON.parse(JSON.stringify(sc)); c.seed = s; c.sides[0].mages[0].skill = sw ? b : a; c.sides[1].mages[0].skill = sw ? a : b; if (deck) for (const sd of c.sides) sd.mages[0].deck = deck;
    const W = A.sceneWorld(c); while (!A.over(W)) { A.stepWorld(W); if (look) Wt.watch(W); }
    const r = A.result(W), me = sw ? 1 : 0;
    out.push({ x: r.winner === me ? 1 : r.winner < 0 ? 0.5 : 0, bt: r.byTime ? 1 : 0, t: W.t, ko: W.ms.some(q => q.hp <= 0) ? 1 : 0, ms: look ? W.ms.map(q => ({ skill: q.skill, look: Wt.seen(W, q) })) : null });
  }
  return out;
}
// 기본 결투 (점수·시간 판정 합)
function duels(a, b, s0, n, rules) { const { part } = require('./versus'); return part(a, b, s0, n, rules || {}); }
function crowdJob(n, s0, cnt) { return require('./crowd').run(n, s0, cnt); }
function ringJob(c, q, n, s0, cnt, maxT) { return require('./jobs').crowd(c, q, n, s0, cnt, {}, 'ring', maxT); }
function armyJob(name, s0, cnt) { return require('./army').run(name, s0, cnt); }

/* ---------------- 통계 ---------------- */
const mean = xs => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
function M(xs) { const n = xs.length; if (!n) return null; const m = mean(xs), sd = n > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) * (x - m), 0) / (n - 1)) : 0; return { v: m, se: sd / Math.sqrt(n), n }; }
function Pr(k, n) { if (!n) return null; const p = k / n; return { v: p, se: Math.sqrt(Math.max(p * (1 - p), 0.25 / n) / n), n, p: 1 }; }   // 0·1 몫도 0이 아닌 오차(1/2n)
const X = (v, note) => ({ v, se: 0, n: 1, note });
const NA = note => ({ v: null, se: 0, n: 0, note });
const eloOf = p => 400 * Math.log10(Math.min(0.999, Math.max(0.001, p)) / (1 - Math.min(0.999, Math.max(0.001, p))));
function judge(x, g) {
  if (g.info) return '·';
  if (!x || x.v == null) return '—';
  if (g.bool) return x.v ? '✓' : '✗';
  let lo = x.v - Z * x.se, hi = x.v + Z * x.se; if (x.p) { lo = Math.max(0, lo); hi = Math.min(1, hi); }   // 몫은 0~1 밖으로 넘지 않는다
  if (lo >= g.lo - 1e-9 && hi <= g.hi + 1e-9) return '✓';
  if (hi < g.lo - 1e-9 || lo > g.hi + 1e-9) return '✗';
  return '△';
}

/* ---------------- 줄 (1장) ---------------- */
// [묶음, 열쇠, 이름, 목표 {lo, hi} 또는 {bool}, 꼴]
const INF = 1e9, G = (lo, hi) => ({ lo, hi }), B = { bool: true }, I = { info: true };   // I: 보기만 (판정하지 않는다)
const ROWS = [
  ['A. 바닥'], ['A1', '시험', B, 'b'], ['A2', '결정론 (같은 씨앗 = 같은 결과)', B, 'b'], ['A3', '브라우저 = Node', B, 'b'], ['A4', '대마법사 결투 한 판 계산 (데운 뒤, s)', G(0, 1), 's2'], ['A5', '대마법사 1 대 평범 100, 30 s 계산 (s)', G(0, 0.5), 's2'],
  ['B. 판의 박자 (결투장 전설 대 전설)'], ['B1', '쓰러뜨림으로 끝남', G(0.9, 1), '%'], ['B2', '판 길이 (s)', G(30, 60), 's'], ['B3', '평균 속도 (m/s)', G(20, 40), 'n'], ['B4', '초당 방향 전환', G(2, 5), 'n'], ['B5', '사람당 초당 행동', G(5, 10), 'n'], ['B6', '초당 교환', G(1, 2), 'n'],
  ['B7n', '2 s 넘는 침묵 (4판: 숨기·짓기·자리 잡기·숨도 행동)', G(0, 0.02), '%'], ['B7', '2 s 넘는 침묵 (v2.20까지의 줄: 짓기만 행동)', I, '%'], ['B8', '0.5 s 넘게 서 있는 순간 (사람당 판당)', G(0, 0), 'n'], ['B9n', '1 s에 잃은 최대 체력 (4판: 응수가 남아 있던 창만, 메이트의 결정타 뺌)', G(0, 0.25), '%'], ['B9', '1 s에 잃은 최대 체력 (v2.20까지의 줄)', I, '%'], ['B10', '30% 아래로 떨어진 뒤 끝까지 (s)', G(7, 13), 's'], ['B11m', '실수로 입은 피해 (내 폭주·숨·적의 굳힘 없는 추락·소금 원·내 덫·역류)', G(0, 0.10), '%'], ['B11f', '떨어뜨려 준 피해 (적의 맞힘·굳힘 뒤 2 s 안에 시작된 추락, 적이 준 것으로 셈)', I, '%'], ['B11k', '추락 결정타 몫 (쓰러진 판 중)', I, '%'], ['B11', '스스로 입은 피해 (v2.17까지의 줄: 추락 모두 포함)', I, '%'], ['B12', '폭주 (판당)', G(0, 0.2), 'n'], ['B13', '흐름: 판의 마지막 3분의 1에 잃은 체력 몫', G(0.45, 0.65), '%'], ['B14', '역전률: 판 절반에 체력이 뒤진 편이 이긴 몫', G(0.2, 0.35), '%'], ['B15', '판을 끝낸 까닭 (메이트 / 견제가 쌓여 / 떨어뜨림 / 판이 끝을 강요함 / 실수 / 시간)', I, 'r'], ['B15m', '판을 끝낸 수 (이름#손잡이, 많은 셋)', I, 'r'], ['B16', '메이트의 결정타가 시작될 때 과녁 체력 (중앙, 20% 아래 몫)', I, 'r'], ['B17', '받은 적 피해 가운데 응수가 있던 수에 받은 몫 (나머지: 응수 없던 수 · 알아채지 못한 수)', I, 'r'], ['C13', '메이트 가운데 큰 수를 쓸 수 있었는데 작은 수로 끝낸 몫', I, '%'],
  ['C. 수와 어휘'], ['C1m', '가장 많이 쓴 세 수(마법 × 손잡이)의 몫', G(0, 0.4), '%'], ['C2m', '판당 수(마법 × 손잡이)의 종류', G(12, INF), 'n'], ['C1', '가장 많이 쓴 세 마법의 몫 (v2.17까지의 줄)', I, '%'], ['C2', '판당 쓴 마법 종류 (v2.17까지의 줄)', I, 'n'], ['C3', '큰 한 방 (사람당 판당)', G(1, 3), 'n'], ['C4', '큰 한 방 중 메이트 순간', G(0.7, 1), '%'], ['C5', '분당 체크', G(15, INF), 'n'], ['C6', '체크에 상대가 방어 자원을 쓴 몫', G(0.5, 1), '%'],
  ['C7n', '메이트로 끝난 판 (4판: 결정타가 알아채지 못한 수이거나, 응수해도 남는 피해로 쓰러짐)', G(0.5, 1), '%'], ['C7', '메이트로 끝난 판 (v2.20까지의 줄: 응수 수 0)', I, '%'], ['C8', '그물에서 빠져나감 (판당)', G(0.3, INF), 'n'], ['C9', '속임수 (판당)', G(3, INF), 'n'], ['C10', '속임수 중 상대가 응수한 몫', G(0.3, 1), '%'], ['C11', '정석을 아는 쪽이 첫 수에서 받은 몫', G(0.6, 1), '%'], ['C12', '하이 리스크: 큰 수를 짓다 끊기거나 역류한 몫 (중급·상급 결투장)', G(0.2, 0.4), '%'], ['C12L', '하이 리스크 (전설 대 전설: 큰 수는 메이트에만)', I, '%'],
  ['D. 공격 방식'], ['D1', '공격 명중률', G(0.3, 0.45), '%'], ['D2', '확정타 명중률', G(0.5, 1), '%'], ['D3', '덮기: 갈 곳을 덮은 몫', G(0.5, 1), '%'], ['D4', '덮기 명중률', G(0.4, 1), '%'], ['D5', '빈틈에 맞히기', G(0.4, 1), '%'], ['D6', '피하기 빼낸 뒤 덮기 (판당)', G(2, INF), 'n'], ['D7', '장악권: 상대 장악권에 흐려지거나(장악 몫 반 아래) 흩어진 공격 몫', G(0.1, 0.25), '%'], ['D8', '장악권을 밀어낸 수 (판당, 상대 자리의 몫을 반 넘게)', I, 'n'],
  ['E. 몸과 감각'], ['E1', '순간 켜기 성공 (판당, 전설)', G(5, INF), 'n'], ['E2', '패시브가 막은 피해 몫', G(0.15, 1), '%'], ['E3', '숨은 시간 (보기만: 참고 10~30%)', I, '%'], ['E4', '숨은 자리 첫 수(기습) 명중', G(0.4, 1), '%'], ['E5', '숨었을 때 상대의 짐작 오차 (m)', G(5, INF), 'n'], ['E6', '숨 마시다 맞음 (판당)', G(0, 0.3), 'n'], ['E8', '정보의 열매: 알아채지 못한 시전의 명중률 − 알아챈 시전의 명중률', G(0.15, INF), '%'], ['E9', '빈 고리 몫 (고리·초, rules/rings)', I, '%'], ['E10', '고리가 꽉 찬 시간 몫', I, '%'], ['E11', '고리 시간 (상태별 몫, 많은 차례)', I, 'r'],
  ['F. 판과 지형'], ['F1', '분당 지은 것 (벽·덫·걸어둔 마법)', G(6, INF), 'n'], ['F2', '지어둔 것이 낸 피해 몫', G(0.15, 0.35), '%'], ['F3', '벽이 막은 적 공격 (판당)', G(2, INF), 'n'], ['F4', '덫이 밟힌 몫', G(0.4, 0.6), '%'], ['F5', '메이트 순간 벽·덫이 지운 칸의 몫', G(0.3, 1), '%'],
  ['G. 단계 사다리'],
  ...['평범', '중간', '대마법사'].flatMap(t => [1, 2, 3, 4].map(i => [`G-${t}-${i}`, `${t} ${SK[i]} / ${SK[i - 1]}`, G(0.65, 0.8), 'x'])),
  ['G2', '전설 / 대가 (결투장)', G(0.7, 1), 'x'], ...['평범', '중간', '대마법사'].map(t => [`Gelo-${t}`, `${t} 단계 사이 Elo 간격 (평균)`, G(90, 210), 'n']), ['G4', '시간 판정 (사다리 전체)', G(0, 0.1), '%'],
  ...['읽는 깊이', '분당 체크', '속임수 시도', '판당 수의 종류', '순간 켜기 성공'].map(k => [`Gs-${k}`, `계단: ${k} (초보→전설)`, B, 'b']),
  ['H. 힘과 무리'], ['H1-중간', '한 등급 위 1대1: 중간 / 평범', G(0.95, 1), '%'], ['H1-상위', '한 등급 위 1대1: 상위 / 중간', G(0.95, 1), '%'], ['H2', '대마법사 1 대 상위 1', G(0.95, 1), '%'], ['H3', '상위 1 대 평범 30', G(0.9, 1), '%'],
  ['H4', '대마법사 1 대 흩어진 상위 20', G(0.8, 1), '%'], ['H5', '대마법사 1 대 흩어진 상위 30', G(0.4, 0.6), '%'], ['H6', '대마법사 1 대 상위 전투단 10', G(0.4, 0.6), '%'], ['H7', '대마법사 1 대 평범 100 둘러싸기', G(0.95, 1), '%'],
  ['H8', '머스킷 기습 (대마법사 승률)', G(0, 0.7), '%'], ['H9', '군대 들판 (대마법사 승률)', G(0.9, 1), '%'], ['H10', '장악권 밖 조약돌 (대마법사)', G(0.9, 1), '%'], ['H11', '장악권 밖 번쩍임 + 무거운 돌 (대마법사)', G(0.6, 0.9), '%'],
  ['I. 균형'], ['I1-안', '원소 전체 승률 (소금 원 안): 가장 낮은·높은', B, 'r'], ['I1-밖', '원소 전체 승률 (소금 원 밖): 가장 낮은·높은', B, 'r'], ['I2', '부류: 어느 하나가 모든 등급에서 둘을 다 이기지 않음', B, 'b'], ['I3', '부류: 이단이 한 칸 이상 이김', B, 'b'],
  ['I4-평범', '기본 덱 같은 등급 전체 (평범): 가장 높은', G(0, 0.7), '%'], ['I4-중간', '기본 덱 같은 등급 전체 (중간): 가장 높은', G(0, 0.7), '%'],
];
// 2장: [묶음, 판단, 단계, 확인 지표(watch·judge의 열쇠, 없으면 null: 못 잼)]
const JUDGE = [
  ['수읽기', '체크를 건다', '상급', '분당 체크'], ['수읽기', '상대 응수를 예측한다', '상급', '응수 예측 맞음'], ['수읽기', '상대 방어 자원을 센다', '대가', '자원 바닥'], ['수읽기', '피할 곳을 지워 그물을 좁힌다', '대가', '그물 3단계 남은 칸'],
  ['수읽기', '응수 0인 순간에만 큰 한 방', '대가', '큰 한 방 중 메이트 몫'], ['수읽기', '그물이 좁혀오면 깬다', '상급', '그물에서 빠져나감'], ['수읽기', '미끼로 응수 자리를 내 그물로', '전설', '미끼 뒤 메이트'], ['수읽기', '정석을 알아보고 받는다', '대가', '정석 첫 수를 상대가 받은 몫'],
  ['수읽기', '판 중에 상대 버릇을 익힌다', '전설', '판 뒤 반 명중 − 앞 반 명중'],
  ['공격 방식', '견제로 구르기를 빼낸다', '상급', '구르기 빼낸 수'], ['공격 방식', '확정 순간에 가장 센 것', '중급', '확정타 명중률'], ['공격 방식', '확정 순간을 만든다', '대가', '이어친 수 명중'], ['공격 방식', '갈 곳을 계산해 덮는다', '대가', '덮기 갈 곳 덮은 비율'],
  ['공격 방식', '빼낸 뒤 덮는다', '전설', '구르기 빼낸 뒤 덮기'], ['공격 방식', '장악권에서 밀릴 때 던지기', '상급', '장악권에서 밀릴 때 던지기 몫'], ['공격 방식', '방식을 바꾸는 박자로 속인다', '전설', '방식 전환 뒤 명중'],
  ['움직임', '서 있지 않는다', '상급', '0.5 s 넘게 서 있음'], ['움직임', '코너 속도 근처를 지킨다', '상급', '코너 속도 근처 시간 몫'], ['움직임', '옆 뒤집기·멈칫으로 빗나가게', '대가', '빗나가게 한 수'], ['움직임', '사거리 끝에서 들고 난다', '대가', '한쪽 사거리 자리'],
  ['움직임', '원을 그려 엄폐를 벗긴다', '대가', '엄폐 벗긴 자리'], ['움직임', '퇴로를 자른다', '대가', '퇴로 자른 자리'], ['움직임', '높이를 쓴다 (추락 0)', '대가', '추락'], ['움직임', '높이와 속도로 속인다', '전설', '속도 속임'],
  ['방어와 몸', '맞는 패시브를 켠다', '중급', '패시브가 막은 피해 몫'], ['방어와 몸', '패시브를 바꿔 끼운다', '상급', null], ['방어와 몸', '맞기 직전에만 켠다', '전설', '순간 켜기 성공'], ['방어와 몸', '벽은 상대 주력이 시야 공격일 때만', '상급', '벽이 막은 적 공격'],
  ['방어와 몸', '숨은 위협이 없을 때', '상급', '숨 마시다 맞은 수'], ['방어와 몸', '몸 털기를 위기에 아낀다', '상급', '몸 털기 뒤 위기'],
  ['숨기와 정보', '숨어서 자리를 옮긴다', '상급', '숨은 뒤 옮긴 거리'], ['숨기와 정보', '조용히 짓는다', '대가', '숨은 동안 지은 것'], ['숨기와 정보', '숨은 자리에서 기습', '대가', '기습 명중'], ['숨기와 정보', '숨은 상대를 좁히고 들춘다', '대가', null], ['숨기와 정보', '들킨 척 미끼', '전설', null],
  ['짓기와 지형', '서클 하나를 늘 준비에', '상급', '준비 칸 시간 몫'], ['짓기와 지형', '덫은 길에만', '상급', '덫이 밟힌 몫'], ['짓기와 지형', '엿보기 둥지 (벽 뒤에서 쏜 몫으로 대신)', '대가', '벽 뒤에서 쏜 몫'], ['짓기와 지형', '걸어둔 마법을 그 아래 올 때', '대가', '걸어둔 마법 명중'],
  ['짓기와 지형', '숨은 상대 둘레에 몰이 그물', '전설', null], ['짓기와 지형', '벽·덫을 메이트의 칸 지우기로', '대가', '메이트 순간 벽·덫이 지운 몫'],
  ['작전과 리듬', '떠보기→들어가기→빠지기', '상급', '분당 단계 전환'], ['작전과 리듬', '작전을 고르고 바꾼다', '대가', '작전 완수 몫'], ['작전과 리듬', '끝내기면 쫓는다', '상급', '30% 아래 뒤 끝까지 (s)'], ['작전과 리듬', '몰리면 무언가 한다', '상급', '몰린 동안 2 s 침묵'],
  ['작전과 리듬', '강요하는 수로 끌고 간다', '전설', '강요한 수'],
  ['무리', '둘러싸이면 버티기·뚫기를 고른다', '상급', null], ['무리', '장악권 밖 무리를 깎거나 가둔다', '대가', null], ['무리', '전투단', '(전투단)', null],
];

// B~F: 결투장 판들(games)의 박자·어휘·공격 방식·몸·판을 o의 열쇠 p + 줄에 (p: '' 결투장, 'old:' 옛 덱)
function bf(games, o, p) {
  const ms = games.flatMap(g => g.ms), lk = k => ms.map(x => x.look[k]).filter(v => typeof v === 'number' && isFinite(v)), g0 = k => games.map(g => g.ms[0].look[k]);
  const pool = (kr, kn) => { let a = 0, b = 0; for (const x of ms) { const n = x.look[kn] || 0; a += (x.look[kr] || 0) * n; b += n; } return Pr(a, b); };
  o[p + 'B1'] = Pr(games.filter(g => g.ko).length, games.length); o[p + 'B2'] = M(games.map(g => g.t)); o[p + 'B3'] = M(lk('평균 속도 (m/s)')); o[p + 'B4'] = M(lk('초당 방향 전환')); o[p + 'B5'] = M(lk('초당 하는 일')); o[p + 'B6'] = M(g0('초당 교환'));
  o[p + 'B7'] = M(g0('2 s 넘는 침묵 몫')); o[p + 'B8'] = M(lk('0.5 s 넘게 서 있음')); o[p + 'B9'] = M(lk('1 s에 잃은 가장 큰 체력 몫')); o[p + 'B10'] = M(games.filter(g => g.ms[0].look['30% 아래로 떨어진 판'] && g.ko).map(g => g.ms[0].look['30% 아래 뒤 끝까지 (s)']));
  { let s = 0, t = 0; for (const x of ms) { t += x.look['받은 피해']; s += x.look['받은 피해'] * x.look['스스로 입은 몫']; } o[p + 'B11'] = M(ms.map(x => x.look['스스로 입은 몫'])); if (o[p + 'B11']) o[p + 'B11'].pooled = t ? s / t : 0; } o[p + 'B12'] = M(lk('폭주'));
  o[p + 'B11m'] = M(lk('실수로 입은 몫')); o[p + 'B11f'] = M(lk('떨어뜨려 준 몫')); { const d = ms.filter(x => x.look['쓰러짐']); o[p + 'B11k'] = Pr(d.filter(x => x.look['추락으로 쓰러짐']).length, d.length); }
  o[p + 'B7n'] = M(g0('2 s 넘는 침묵 몫 (4판)')); o[p + 'B9n'] = M(lk('1 s에 잃은 가장 큰 체력 몫 (4판)')); o[p + 'B13'] = M(games.filter(g => g.ms[0].look['흐름: 마지막 3분의 1에 잃은 몫'] > 0).map(g => g.ms[0].look['흐름: 마지막 3분의 1에 잃은 몫']));
  o[p + 'B14'] = Pr(games.filter(g => g.ms[0].look['역전한 판']).length, games.filter(g => g.ms[0].look['판 절반에 뒤진 편이 있던 판']).length);
  { const c = {}, mv = {}; for (const g of games) { const k = g.ms[0].look['판을 끝낸 까닭'] || '시간'; c[k] = (c[k] || 0) + 1; const v = g.ms[0].look['판을 끝낸 수']; if (v && (k === '메이트' || k === '견제가 쌓여')) mv[v] = (mv[v] || 0) + 1; }
    { const mt = []; let cs = 0, ok = 0, mn = 0; for (const g of games) for (const x of g.ms) if (x.look['쓰러진 까닭'] === '메이트' && x.look['결정타 시작 때 내 체력 몫'] >= 0) { mn++; mt.push(x.look['결정타 시작 때 내 체력 몫']); if (!x.look['결정타가 큰 수']) { cs++; if (x.look['결정타 때 큰 수를 쓸 수 있었음']) ok++; } }
      mt.sort((a, b) => a - b); o[p + 'B16'] = mt.length ? X(mt[mt.length >> 1], '중앙 ' + Math.round(100 * mt[mt.length >> 1]) + '% · 20% 아래 ' + Math.round(100 * mt.filter(v => v <= 0.2).length / mt.length) + '% (' + mt.length + ')') : null; o[p + 'C13'] = Pr(ok, mn);
      let dA = 0, dN = 0, dU = 0, dT = 0; for (const g of games) for (const x of g.ms) { const t = x.look['받은 적 피해'] || 0; dT += t; dA += t * (x.look['응수가 있던 수에 받은 피해 몫'] || 0); dN += t * (x.look['응수가 없던 수에 받은 피해 몫'] || 0); dU += t * (x.look['알아채지 못한 수에 받은 피해 몫'] || 0); }
      o[p + 'B17'] = dT ? X(dA / dT, '응수 있던 수 ' + Math.round(100 * dA / dT) + '% · 응수 없던 수 ' + Math.round(100 * dN / dT) + '% · 알아채지 못한 수 ' + Math.round(100 * dU / dT) + '%') : null; }   // v2.23 재기 (보기만)
    const n = games.length || 1; o[p + 'B15'] = X((c['메이트'] || 0) / n, ['메이트', '견제가 쌓여', '떨어뜨림', '판이 끝을 강요함', '실수', '시간'].map(k => k + ' ' + Math.round(100 * (c[k] || 0) / n) + '%').join(' · '));
    o[p + 'B15m'] = X(0, Object.entries(mv).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => k + ' ' + v).join(' · ')); }
  o[p + 'C7n'] = Pr(games.filter(g => g.ko && g.ms[0].look['메이트로 끝난 판 (4판)']).length, games.filter(g => g.ko).length);
  { let a = 0, b = 0; for (const x of ms) { a += x.look['큰 수가 끊긴 수'] || 0; b += x.look['큰 수를 지은 수'] || 0; } o[p + 'C12'] = Pr(a, b); }
  { let a = 0, b = 0, uh = 0, un = 0, sh = 0, sn = 0; for (const x of ms) { a += x.look['장악권에 흐려진 공격'] || 0; b += x.look['풀린 공격'] || 0; uh += x.look['알아채지 못한 시전 명중'] || 0; un += x.look['알아채지 못한 시전'] || 0; sh += x.look['알아챈 시전 명중'] || 0; sn += x.look['알아챈 시전'] || 0; }
    o[p + 'D7'] = Pr(a, b); const u = Pr(uh, un), s = Pr(sh, sn); o[p + 'E8'] = u && s ? { v: u.v - s.v, se: Math.sqrt(u.se * u.se + s.se * s.se), n: un, note: '알아채지 못함 ' + Math.round(100 * u.v) + '% (' + un + ') · 알아챔 ' + Math.round(100 * s.v) + '%' } : NA('알아채지 못한 시전 없음'); }
  o[p + 'D8'] = M(lk('장악권을 밀어낸 수'));
  if (ms.some(x => x.look['고리 수'])) { const RK = ['짓기', '붙잡음', '잔기술', '날기', '공기막', '자동 진', '버팀 벽', '몸', '빈'], av = k => mean(lk('고리 시간 몫: ' + k)); o[p + 'E9'] = M(lk('빈 고리 몫')); o[p + 'E10'] = M(lk('고리가 꽉 찬 시간 몫'));
    o[p + 'E11'] = X(av('빈'), RK.map(k => [k, av(k)]).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + Math.round(100 * v) + '%').join(' · ') + ' (고리 ' + Math.round(mean(lk('고리 수'))) + ')'); }   // 고리 장부 (v2.22, 보기만)
  o[p + 'C1m'] = M(lk('가장 많이 쓴 세 수의 몫')); o[p + 'C2m'] = M(lk('판당 수의 종류'));
  o[p + 'C1'] = M(lk('가장 많이 쓴 세 마법의 몫')); o[p + 'C2'] = M(lk('판당 쓴 마법 종류')); o[p + 'C3'] = M(lk('큰 한 방')); o[p + 'C4'] = pool('큰 한 방 중 메이트 몫', '큰 한 방'); o[p + 'C5'] = M(lk('분당 체크')); o[p + 'C6'] = M(lk('체크에 자원을 쓴 몫'));
  o[p + 'C7'] = Pr(games.filter(g => g.ko && g.ms[0].look['메이트로 끝난 판']).length, games.filter(g => g.ko).length); o[p + 'C8'] = M(lk('그물에서 빠져나감')); o[p + 'C9'] = M(lk('속임수 시도')); o[p + 'C10'] = pool('속임수에 상대가 응수한 몫', '속임수 시도');
  { let a = 0, b = 0; for (const g of games) for (let i = 0; i < 2; i++) { const me = g.ms[i].look, foe = g.ms[1 - i].look; const n = me['정석 둠'] || 0; a += (foe['정석 첫 수를 상대가 받은 몫'] || 0) * n; b += n; } o[p + 'C11'] = Pr(a, b); }
  o[p + 'D1'] = M(lk('공격 명중률')); o[p + 'D2'] = pool('확정타 명중률', '확정타'); o[p + 'D3'] = pool('덮기 갈 곳 덮은 비율', '덮기'); o[p + 'D4'] = pool('덮기 명중률', '덮기'); o[p + 'D5'] = M(lk('빈틈에 맞힌 몫')); o[p + 'D6'] = M(lk('구르기 빼낸 뒤 덮기'));
  o[p + 'E1'] = M(lk('순간 켜기 성공')); o[p + 'E2'] = M(lk('패시브가 막은 피해 몫')); o[p + 'E3'] = M(lk('숨은 시간 몫')); o[p + 'E4'] = pool('기습 명중', '기습'); o[p + 'E5'] = NA('두뇌가 상대 자리를 정확히 본다 (앎이 없다, 2단계)'); o[p + 'E6'] = M(lk('숨 마시다 맞은 수'));
  o[p + 'F1'] = M(lk('분당 지은 것')); o[p + 'F2'] = M(lk('지어둔 것이 낸 피해 몫')); o[p + 'F3'] = M(lk('벽이 막은 적 공격')); o[p + 'F4'] = pool('덫이 밟힌 몫', '놓은 덫'); o[p + 'F5'] = M(ms.filter(x => x.look['메이트 수 (읽음)'] > 0).map(x => x.look['메이트 순간 벽·덫이 지운 몫']));
}

/* ---------------- 재기 ---------------- */
async function measure(q) {
  const { runJobs } = require('./par'), N = q ? 30 : 100, NL = q ? 100 : 400, NC = q ? 10 : 20, NI = q ? 40 : 100, jobs = [], tag = [], CH = 2;
  const add = (t, fn, args) => { jobs.push({ mod: __filename, fn, args }); tag.push(t); };
  for (let s = 1; s <= N; s += CH) add('arena', 'arenaGames', ['전설', '전설', s, Math.min(CH, N - s + 1), true]);
  if (OLD) for (let s = 1; s <= N; s += CH) add('arenaOld', 'arenaGames', ['전설', '전설', s, Math.min(CH, N - s + 1), true, OLD]);   // 옛 덱 줄 (이음용)
  const NS = q ? 6 : 20; for (const sk of SK) for (let s = 1; s <= NS; s += CH) add('stair:' + sk, 'arenaGames', [sk, sk, s, Math.min(CH, NS - s + 1), true]);
  for (let i = 1; i <= 4; i++) { for (const t of ['평범', '중간']) for (let s = 0; s < NL; s += 50) add(`lad:${t}:${i}`, 'duels', [{ tier: t, skill: SK[i] }, { tier: t, skill: SK[i - 1] }, s, Math.min(50, NL - s)]); for (let s = 1; s <= NL; s += 4) add(`lad:대마법사:${i}`, 'arenaGames', [SK[i], SK[i - 1], s, Math.min(4, NL - s + 1), false]); }
  for (const [hi, lo] of [['중간', '평범'], ['상위', '중간'], ['대마법사', '상위']]) add('up:' + hi, 'duels', [{ tier: hi }, { tier: lo }, 0, N]);
  for (const n of [20, 30]) for (let s = 1; s <= NC; s += 2) add('crowd:' + n, 'crowdJob', [n, s, Math.min(2, NC - s + 1)]);
  for (let s = 0; s < NC; s += 5) { add('ring30', 'ringJob', [{ tier: '상위' }, { tier: '평범', deck: '기본기' }, 30, s, Math.min(5, NC - s), 120]); add('ring100', 'ringJob', [{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 100, s, Math.min(5, NC - s), 90]); }
  for (const nm of ['ambush', 'field-musket', 'throw-조약돌-100', 'throw-번쩍 돌-100']) for (let s = 0; s < NC; s += 5) add('army:' + nm, 'armyJob', [nm, s, Math.min(5, NC - s)]);
  for (const ring of [true, false]) for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) add(`el:${ring}:${i}:${j}`, 'duels', [{ tier: '평범', skill: '상급', deck: ELEMS[i] }, { tier: '평범', skill: '상급', deck: ELEMS[j] }, 0, NI, { saltRing: ring }]);
  for (const t of ['평범', '중간', '상위']) for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) add(`ty:${t}:${i}:${j}`, 'duels', [{ tier: t, skill: '상급', type: TYPES[i] }, { tier: t, skill: '상급', type: TYPES[j] }, 0, NI]);
  for (const t of ['평범', '중간']) for (let i = 0; i < BASE.length; i++) for (let j = i + 1; j < BASE.length; j++) add(`dk:${t}:${i}:${j}`, 'duels', [{ tier: t, deck: BASE[i] }, { tier: t, deck: BASE[j] }, 0, NI]);
  const t0 = Date.now(), res = await runJobs(jobs), R = {};
  res.forEach((r, i) => { (R[tag[i]] = R[tag[i]] || []).push(r); });
  const o = {}, flat = k => (R[k] || []).flat();
  // A
  o.A1 = tests(); o.A2 = determinism(); o.A3 = browser(); const [t1, t2] = timing(); o.A4 = X(t1); o.A5 = X(t2);
  // B~F: 결투장 전설 대 전설 (옛 덱 줄도: v2.16까지의 결투장 덱 '대마법사 청사진', 이음용)
  bf(flat('arena'), o, ''); if (R.arenaOld) bf(flat('arenaOld'), o, 'old:');
  // G
  let btN = 0, btK = 0;
  for (const t of ['평범', '중간', '대마법사']) { const el = []; for (let i = 1; i <= 4; i++) { const r = R[`lad:${t}:${i}`] || []; let x, n;
    if (t === '대마법사') { const gs = r.flat(); x = gs.reduce((a, g) => a + g.x, 0); n = gs.length; btK += gs.reduce((a, g) => a + g.bt, 0); btN += n; } else { n = r.reduce((a, p) => a + p.n, 0); x = r.reduce((a, p) => a + p.a + p.d / 2, 0); btK += r.reduce((a, p) => a + p.bt, 0); btN += n; }
    o[`G-${t}-${i}`] = Pr(x, n); if (n) el.push(eloOf(x / n)); }
    o[`Gelo-${t}`] = el.length ? M(el) : null; }
  o.G2 = o['G-대마법사-4']; o.G4 = Pr(btK, btN);
  const stair = SK.map(sk => flat('stair:' + sk).flatMap(g => g.ms)), sm = (i, k) => mean(stair[i].map(x => x.look[k] || 0));
  const SKV = { '읽는 깊이': i => (A.SKILLS[SK[i]] && A.mage({ tier: '대마법사', skill: SK[i] }).tac.read) || 0, '분당 체크': i => sm(i, '분당 체크'), '속임수 시도': i => sm(i, '속임수 시도'), '판당 수의 종류': i => sm(i, '판당 수의 종류'), '순간 켜기 성공': i => sm(i, '순간 켜기 성공') };
  { let a = 0, b = 0; for (const i of [1, 2]) for (const x of stair[i]) { a += x.look['큰 수가 끊긴 수'] || 0; b += x.look['큰 수를 지은 수'] || 0; } o.C12L = o.C12; o.C12 = Pr(a, b); if (o['old:C12']) { o['old:C12L'] = o['old:C12']; o['old:C12'] = null; } }   // C12 (v2.21): 중급·상급 결투장에서, 전설은 보기만
  for (const k in SKV) { const v = SK.map((_, i) => SKV[k](i)); let ok = v[4] > v[0]; for (let i = 1; i < 5; i++) if (v[i] < v[i - 1] - 1e-9) ok = false; o[`Gs-${k}`] = X(ok ? 1 : 0, v.map(x => +x.toFixed(2)).join(' → ')); }
  // H
  const dsc = k => { const r = R[k] || []; const n = r.reduce((a, p) => a + p.n, 0); return Pr(r.reduce((a, p) => a + p.a + p.d / 2, 0), n); };
  o['H1-중간'] = dsc('up:중간'); o['H1-상위'] = dsc('up:상위'); o.H2 = dsc('up:대마법사');
  const win = k => { const r = (R[k] || []); const n = r.reduce((a, p) => a + p.n, 0); return Pr(r.reduce((a, p) => a + p.win, 0), n); };
  o.H3 = win('ring30'); o.H4 = (() => { const g = flat('crowd:20'); return Pr(g.reduce((a, x) => a + x.win, 0), g.length); })(); o.H5 = (() => { const g = flat('crowd:30'); return Pr(g.reduce((a, x) => a + x.win, 0), g.length); })();
  o.H6 = NA('상위 전투단 두뇌가 아직 없다 (4단계)'); o.H7 = win('ring100'); o.H8 = win('army:ambush'); o.H9 = win('army:field-musket'); o.H10 = win('army:throw-조약돌-100'); o.H11 = win('army:throw-번쩍 돌-100');
  // I
  for (const ring of [true, false]) { const tot = ELEMS.map(() => [0, 0]); for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) for (const p of R[`el:${ring}:${i}:${j}`] || []) { const x = p.a + p.d / 2; tot[i][0] += x; tot[i][1] += p.n; tot[j][0] += p.n - x; tot[j][1] += p.n; }
    const ps = tot.map(([x, n]) => Pr(x, n)), ok = ps.every(p => p && judge(p, G(0.35, 0.65)) !== '✗'), lo = Math.min(...ps.map(p => p.v)), hi = Math.max(...ps.map(p => p.v));
    o['I1-' + (ring ? '안' : '밖')] = X(ok && ps.every(p => judge(p, G(0.35, 0.65)) === '✓') ? 1 : 0, `${(lo * 100).toFixed(0)}~${(hi * 100).toFixed(0)}% (` + ELEMS.map((e, i) => e + ' ' + (ps[i].v * 100).toFixed(0)).join(' · ') + ')'); }
  { const cell = {}; for (const t of ['평범', '중간', '상위']) for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) { const r = R[`ty:${t}:${i}:${j}`] || [], n = r.reduce((a, p) => a + p.n, 0), x = r.reduce((a, p) => a + p.a + p.d / 2, 0); cell[`${t}:${i}:${j}`] = x / n; }
    const beats = (t, a, b) => { const [i, j] = a < b ? [a, b] : [b, a], v = cell[`${t}:${i}:${j}`]; return a < b ? v > 0.5 : v < 0.5; };
    const dom = [0, 1, 2].some(a => ['평범', '중간', '상위'].every(t => [0, 1, 2].filter(b => b !== a).every(b => beats(t, a, b))));
    const heretic = ['평범', '중간', '상위'].some(t => [0, 1].some(b => beats(t, 2, b)));
    o.I2 = X(dom ? 0 : 1, Object.entries(cell).map(([k, v]) => k.replace(/(\d):(\d)/, (_, a, b) => TYPES[a] + '/' + TYPES[b]) + ' ' + v.toFixed(2)).join(' · ')); o.I3 = X(heretic ? 1 : 0); }
  for (const t of ['평범', '중간']) { const tot = BASE.map(() => [0, 0]); for (let i = 0; i < BASE.length; i++) for (let j = i + 1; j < BASE.length; j++) for (const p of R[`dk:${t}:${i}:${j}`] || []) { const x = p.a + p.d / 2; tot[i][0] += x; tot[i][1] += p.n; tot[j][0] += p.n - x; tot[j][1] += p.n; }
    const ps = tot.map(([x, n]) => Pr(x, n)), bi = ps.reduce((b, p, i) => p.v > ps[b].v ? i : b, 0); o['I4-' + t] = Object.assign(ps[bi], { note: BASE[bi] }); }
  // 2장: 단계별
  const judgeV = {}; for (const [, , , k] of JUDGE) if (k) judgeV[k] = SK.map((_, i) => +sm(i, k).toFixed(3));
  return { o, judge: judgeV, N, NL, NC, sec: Math.round((Date.now() - t0) / 1000) };
}
function tests() { const r = require('child_process').spawnSync(process.execPath, [path.join(ROOT, 'test', 'test.js')], { encoding: 'utf8' }), m = /시험 (\d+)개 통과/.exec(r.stdout || ''); return X(r.status === 0 && m ? 1 : 0, m ? m[1] + '개 통과' : '실패'); }
function determinism() { const sc = arena(); sc.seed = 3; sc.maxT = 20; const a = JSON.stringify(A.runScene(sc).ms.map(m => [m.x, m.y, m.hp])), b = JSON.stringify(A.runScene(sc).ms.map(m => [m.x, m.y, m.hp])); return X(a === b ? 1 : 0); }
// 브라우저: Playwright가 있으면(전역 설치) 장면 셋을 Chromium의 샌드박스로 돌려 Node와 견준다. 없으면 못 잼
function browser() {
  const cand = [process.env.PLAYWRIGHT_PATH, '/opt/node22/lib/node_modules/playwright'].filter(Boolean); let pw = null; for (const c of cand) { try { pw = require(c); break; } catch (e) { /* 없다 */ } }
  if (!pw) return NA('Playwright 없음');
  const code = `(async()=>{const {chromium}=require(${JSON.stringify(cand.find(c => { try { require.resolve(c); return true; } catch (e) { return false; } }))});const A=require(${JSON.stringify(path.join(ROOT, 'src'))}),fs=require('fs');
const names=['duel','v2-tactics-legend','v2-chess-legend'],scs=names.map(n=>JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'sandbox', 'scenes'))}+'/'+n+'.json','utf8')));
const node=scs.map(sc=>{const w=A.sceneWorld(sc);while(!A.over(w))A.stepWorld(w);return JSON.stringify(w.ms.map(m=>[m.x,m.y,m.hp]));});
const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}).catch(()=>chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}));const p=await b.newPage();await p.goto('file://'+${JSON.stringify(path.join(ROOT, 'sandbox', 'index.html'))});
const br=await p.evaluate(js=>js.map(sc=>{window.Sandbox.loadScene(sc);window.Sandbox.runToEnd();return JSON.stringify(window.Sandbox.S.W.ms.map(m=>[m.x,m.y,m.hp]));}),scs);await b.close();
console.log(JSON.stringify(br.filter((x,i)=>x!==node[i]).length));})().catch(e=>{console.log('ERR '+e.message);});`;
  const r = require('child_process').spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', timeout: 600000 }), s = (r.stdout || '').trim();
  if (!/^\d+$/.test(s)) return NA('브라우저를 띄우지 못함: ' + s.slice(0, 60));
  return X(+s === 0 ? 1 : 0, '장면 셋, 다른 판 ' + s);
}
// 계산 시간: 데운 뒤 결투장 한 판 셋의 평균, 대마법사 1 대 평범 100 둘러싸기 30 s
function timing() {
  const sc = arena(), one = s => { const c = JSON.parse(JSON.stringify(sc)); c.seed = s; const t0 = process.hrtime.bigint(); A.runScene(c); return Number(process.hrtime.bigint() - t0) / 1e9; };
  one(1); const t1 = (one(2) + one(3) + one(4)) / 3;
  const ring = () => { const t0 = process.hrtime.bigint(); A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 100 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: 1, layout: 'ring', maxT: 30 }); return Number(process.hrtime.bigint() - t0) / 1e9; };
  ring(); return [t1, ring()];
}

/* ---------------- 표 ---------------- */
const vkey = v => v.split('.').map(Number).reduce((a, x) => a * 1000 + x, 0);
function fmt(x, f) {
  if (!x || x.v == null) return '—';
  const v = x.v, e = x.se ? ' ±' + (f === '%' ? (Z * x.se * 100).toFixed(0) : (Z * x.se).toFixed(f === 'x' ? 2 : 1)) : '';
  if (f === 'b') return (v ? '예' : '아니오') + (x.note ? ' (' + x.note + ')' : '');
  if (f === 'r') return x.note || '';
  return (f === '%' ? (v * 100).toFixed(0) + '%' : f === 'x' ? v.toFixed(2) : f === 's2' ? v.toFixed(2) : f === 's' ? v.toFixed(1) : (+v).toFixed(v >= 100 ? 0 : 2)) + e + (x.note && f !== 'b' ? ' (' + x.note + ')' : '');
}
function goal(g, f) { if (g.info) return '봄'; if (g.bool) return '예'; const s = v => f === '%' ? (v * 100).toFixed(0) + '%' : f === 'x' ? v.toFixed(2) : String(v); return g.hi >= INF ? s(g.lo) + ' 이상' : g.lo <= 0 && g.hi === 0 ? '0' : g.lo <= 0 ? s(g.hi) + ' 이하' : s(g.lo) + '~' + s(g.hi); }
function render(card) {
  const vs = Object.keys(card.versions).sort((a, b) => vkey(a) - vkey(b)), L = [];
  L.push('# v3.0 문턱 성적', '', '`GATE-v4.md` 1장의 목표 수치를 버전마다 같은 잣대로 잰 값 (`node cli.js gate`, 잣대는 `experiments/gate.js` 머리 주석, SPEC 40장). 원자료는 `reports/gate.json`.',
    '판정(99%): 값 ± 2.576 표준오차가 목표 안이면 ✓, 목표와 겹치지 않으면 ✗, 걸치면 △(통과로 치지 않음), 잴 수 없으면 —. 값 옆의 ±는 99% 구간의 반폭.', '');
  for (const v of vs) { const c = card.versions[v], st = {}; for (const r of ROWS) if (r.length > 1 && !r[2].info) { const s = judge(c.o[r[0]], r[2]); st[s] = (st[s] || 0) + 1; } L.push(`- v${v}: ${c.date} 잼 (${c.sec} s, 결투 ${c.N} · 사다리 ${c.NL} · 무리 ${c.NC}판): ✓ ${st['✓'] || 0} · ✗ ${st['✗'] || 0} · △ ${st['△'] || 0} · — ${st['—'] || 0}`); }
  for (const r of ROWS) {
    if (r.length === 1) { L.push('', '## ' + r[0], '', '| 지표 | 목표 | ' + vs.map(v => 'v' + v).join(' | ') + ' |', '|---|---|' + vs.map(() => '---|').join('')); continue; }
    L.push(`| ${r[1]} | ${goal(r[2], r[3])} | ` + vs.map(v => { const x = card.versions[v].o[r[0]]; return judge(x, r[2]) + ' ' + fmt(x, r[3]); }).join(' | ') + ' |');
  }
  // 옛 덱 줄 (이음용): v2.17에 결투장 덱이 '대마법사 결투'로 바뀌었다. v2.16까지는 결투장 줄이 곧 옛 덱 줄
  const ov = vs.filter(v => vkey(v) <= vkey('2.16.0') || Object.keys(card.versions[v].o).some(k => k.startsWith('old:')));
  if (ov.length) {
    L.push('', "## 옛 덱 줄 (결투장 전설 대 전설, '대마법사 청사진': v2.16까지의 결투장 덱, 이음용)", '', '| 지표 | 목표 | ' + ov.map(v => 'v' + v).join(' | ') + ' |', '|---|---|' + ov.map(() => '---|').join(''));
    for (const r of ROWS) if (r.length > 1 && /^[B-F]/.test(r[0])) L.push(`| ${r[1]} | ${goal(r[2], r[3])} | ` + ov.map(v => { const o = card.versions[v].o, x = vkey(v) <= vkey('2.16.0') ? o[r[0]] : o['old:' + r[0]]; return judge(x, r[2]) + ' ' + fmt(x, r[3]); }).join(' | ') + ' |');
  }
  const last = card.versions[vs[vs.length - 1]];
  L.push('', `## 2장: 판단마다 확인 (v${vs[vs.length - 1]}, 결투장에서 같은 단계끼리, 단계마다 ${last.N >= 100 ? 20 : 6}판)`, '', '| 묶음 | 판단 | 단계 | 확인 | ' + SK.join(' | ') + ' |', '|---|---|---|---|' + SK.map(() => '---|').join(''));
  for (const [g, j, sk, k] of JUDGE) L.push(`| ${g} | ${j} | ${sk} | ${k || '— (기능 없음)'} | ` + (k && last.judge[k] ? last.judge[k].map(x => x === 0 ? '0' : Math.abs(x) >= 10 ? x.toFixed(0) : x.toFixed(2)).join(' | ') : SK.map(() => '—').join(' | ')) + ' |');
  return L.join('\n') + '\n';
}
async function main(args) {
  const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const file = opt('--out') || path.join(ROOT, 'reports', 'gate.json'), md = file.replace(/\.json$/, '.md'); let card; try { card = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { card = { versions: {} }; }
  if (!args.includes('--show')) { const r = await measure(args.includes('--quick')); card.versions[A.VERSION] = Object.assign({ date: new Date().toISOString().slice(0, 10) }, r); fs.writeFileSync(file, JSON.stringify(card, null, 1) + '\n'); fs.writeFileSync(md, render(card)); console.log(`v${A.VERSION} 잼 (${r.sec} s) → ${path.relative(process.cwd(), md)}`); }
  console.log(render(card));
}
module.exports = { arenaGames, duels, crowdJob, ringJob, armyJob, measure, render, judge, ROWS, JUDGE, main };
if (require.main === module) main(process.argv.slice(2)).catch(e => { console.error(e); process.exitCode = 1; });
