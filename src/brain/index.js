'use strict';
/* =========================================================================
 * 숨 결투장 — 기본 두뇌 v2.20.0
 * 판단 순서: 읽기(read) → 입장(stance) → 움직임(move) → 고르기(choose: 자동 진 → 칸 → 휴식 → 마법 고르기)
 * 기술(콤보·속임수·엄폐·유도·학습·덱 읽기·붙잡기…)은 techniques/에 하나씩, 어느 단계가 어떤 기술을 켜는지는 skills.js(data/skills.json).
 * 규칙(스위치)에 딸린 판단은 그 규칙 파일(src/rules/)의 brain 훅에 있다. 세계마다 켜진 규칙의 훅만 모은다(hooks.js).
 * 새 두뇌를 만들 땐 think(W, m) 하나만 같은 모양으로 내보내면 된다. 등록은 Arena.register.brain
 * ========================================================================= */
const U = require('./util'), { hooks } = require('./hooks');
const rhythm = require('./techniques/rhythm'), engage = require('./techniques/engage'), plan = require('./plan');
const { aimAt, readThreats } = require('./read'), { chooseStance } = require('./stance'), { steer } = require('./move'), { decide } = require('./choose');

// 판단은 차례대로 여러 조각으로 나눠 둔다 (속도, 1.11.1): 한 덩어리(400줄)는 최적화 컴파일이 판보다 오래 걸려 짧은 실행 내내 느린 코드로 돌았다.
// 조각 사이에 오가는 값은 사람마다 하나 둔 K에 담는다(새로 만들지 않는다). 후보 하나의 값은 K.o에
function newO() { return { s: null, n: null, bi: 0, isOff: null, cost: 0, he: 0, Tw: 0, R: 0, v: 0, tx: 0, ty: 0, barrel: false, pin: false, down: false, wait: false }; }
function newK() { return { foes: null, S: null, T: null, prefR: null, aggr: null, dodgeK: null, rest: null, e: null, mem: null, wantMem: false, Dm: null, De: null, d: null, ux: null, uy: null, los: null, vt: null, eDown: null, dodge: null, aimed: null, threat: null, late: null, blindR: null, stance: null, escape: null, vx: 0, vy: 0, empty: null, circ: null, bigThreat: null, slot: null, defDown: null, sim: null, plan: null, lead: null, cb: null, down0: null, ek: null, roll: null, shieldNear: null, bigs: null, ctOf: null, pinNow: null, holds: null, pinBy: null, cand: null, pool: null, best: null, pipe: null, effHR: 0, pressB: false, push: false, wallT: -9, waitT: -9, mode: '', modeT: 0, modeAt: 0, sureW: 0, bait: false, pokeT: -9, covN: 0, covPts: null, covT: -9, coverDone: -9, low: false, chase: false, closeIn: false, trapT: -9, hurry: 0, pl: null, plT: -9, netN: 9, brk: -9, brkX: 0, brkY: 0, keep: 0, keepT: -9, jo: -1, joI: 0, joT: -9, eC: null, eC2: null, eN: '', eNT: -9, eP: '', ePT: -9, jsL: null, o: newO() }; }   // 리터럴로 만들어야 빠른 모양이 된다
// 모습 지표 (v2.2, 26장): 판단 때마다 거리와 장악 경계(두 신호의 몫이 같은 자리, 5장 식)를 적는다. 판에 영향이 없다
function sample(W, m, K) {
  const e = K.e, d = K.d, ml = m.mlog; ml.dS += d; ml.dS2 += d * d; ml.dN++;
  if (!W.rules.domain) return;
  const L = W.rules.domainL, A = U.C.sigOf(W, m) * (m._act ? 1 : W.rules.passive), B = U.C.sigOf(W, e) * (e._act ? 1 : W.rules.passive), x = L * (A - B) / (A + B) + A * d / (A + B), xc = x < 0 ? 0 : x > d ? d : x;
  ml.gS += d - xc; const bx = m.x + (e.x - m.x) * xc / (d || 1), by = m.y + (e.y - m.y) * xc / (d || 1);
  if (ml.bx === ml.bx) ml.bMove += U.hyp(bx - ml.bx, by - ml.by); ml.bx = bx; ml.by = by; ml.bT = W.t;
}
function think(W, m) {
  if (!W._bh) hooks(W);
  const K = m._k || (m._k = newK());
  if (!aimAt(W, m, K)) return;
  sample(W, m, K);   // 모습 지표 (v2.2): 거리, 장악 경계
  readThreats(W, m, K); rhythm.phase(W, m, K); chooseStance(W, m, K); if (m.tac.engage) engage.adjust(W, m, K); if (m.tac.read) plan.net(W, m, K); steer(W, m, K);   // 리듬: 떠보기·들어가기·빠지기 (v2.2)
  if (m.st.stun > 0) return;
  decide(W, m, K);
}

module.exports = { think, plan, catOf: U.catOf, FORMNAME: U.FORMNAME, rollSide: U.rollSide, VERSION: '2.20.0' };
