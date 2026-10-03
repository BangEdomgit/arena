'use strict';
/* 숨 결투장 시험: v2.37~: 고리 장부 3단계(ringLedger) — 장부 하나가 서클을 나눈다, 내려놓기, 빈 고리만큼 동시에 짓기
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2h.js */
const { assert, A, legacy, suite, SCENES } = require('../lib');
const RL = require('../../src/rules/ringLedger').api;
const world = on => A.createWorld({ seed: 1, obstacles: [], width: 120, height: 80, rules: { profile: '지금', ringLedger: on } });
const fake = (W, n) => ({ s: W.spells[n], tgt: null, tx: 0, ty: 0, t: 0, T: 5, B: false, cost: 1, tz: 1, tf: 1, tv: 1, hid: false, unseen: false, tk: '', vis: 1 });
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.37 고리 장부: 꺼지면 장부가 없다(예전 그대로), 켜면 고리 수 = 서클', () => {
    const W0 = world(false), a = A.addMage(W0, A.mage({ tier: '대마법사', skill: '전설' }), 0, 20, 40); A.addMage(W0, A.mage({ tier: '대마법사' }), 1, 80, 40); A.stepWorld(W0); assert.strictEqual(RL.ledger(a), null);
    const W = world(true), b = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 20, 40); A.addMage(W, A.mage({ tier: '대마법사' }), 1, 80, 40); A.stepWorld(W);
    const L = RL.ledger(b); assert.ok(L && L.R === b.circles, '고리 ' + (L && L.R));
  });
  ok('v2.37 모자라면 값이 낮은 일부터 내려놓는다: 첫 칸은 늘, 날기(5)와 잔기술(5) 가운데 하나만, 날기를 위험이 있으면 지킨다', () => {
    const W = world(true), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 20, 40); A.addMage(W, A.mage({ tier: '대마법사' }), 1, 80, 40); A.stepWorld(W);
    m.circles = 2; m.cast = fake(W, '낙뢰'); m.z = 6; m.fly = 1; m.flyWant = true; m.airFilm = false; m.st.psv = 1; m.castB = null;
    let L = RL.alloc(W, m); assert.strictEqual(L.F, 0); assert.ok(L.fly !== L.psv, '하나만'); assert.ok(L.fly, '같으면 날기 먼저');
    m.circles = 5; L = RL.alloc(W, m); assert.ok(L.fly && L.psv && L.auto, '첫 칸·날기·잔기술·자동 진'); assert.strictEqual(L.F, 1);
  });
  ok('v2.37 셋째 칸: 두 칸이 차 있고 빈 고리가 있으면 X, 머리가 넘칠 수는 X로 짓지 않는다', () => {
    const W = world(true), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 0, 20, 40), e = A.addMage(W, A.mage({ tier: '대마법사' }), 1, 60, 40); A.stepWorld(W);
    A.brain.think(W, m); m.cast = fake(W, '낙뢰'); m.castB = fake(W, '체인'); m.fat = 0; m.glu = m.gluMax; RL.alloc(W, m);
    const sh = W._bh.slot, K = { T: m.tac, foes: [e] }; let slot = ''; for (const f of sh) slot = f(W, m, K, slot); assert.strictEqual(slot, 'X');
    m.fat = 60; slot = ''; for (const f of sh) slot = f(W, m, K, slot); assert.strictEqual(slot, '', '머리가 fatMax 넘으면 아니');
    m.fat = 40; const o = { s: W.spells['대낙뢰'], v: 1, tx: 60, ty: 40, cost: 10 }, K2 = { slot: 'X', e, d: 40, foes: [e] }; for (const f of W._bh.valueLate) f(W, m, K2, o); assert.strictEqual(o.v, 0, '풀릴 때 머리가 넘친다');
  });
  ok('v2.37 결투장 전설 대 전설(장부 켬): 셋째 칸을 짓고 풀며, 시작할 때 동시에 짓는 수를 센다. 같은 씨앗이면 같은 판', () => {
    const sc = Object.assign(JSON.parse(JSON.stringify(SCENES['v2-tactics-legend'])), { seed: 2, maxT: 30 }); sc.rules = Object.assign({}, sc.rules, { ringLedger: true });
    const W = A.sceneWorld(sc); while (!A.over(W)) A.stepWorld(W); const st = RL.stats(W)['대마법사'];
    assert.ok(st && st.xN > 0 && st.xRel > 0, JSON.stringify(st)); assert.ok(st.hist[3] > 0, '셋'); assert.ok(st.usedT > 0 && st.usedT <= st.ringT);
    const W2 = A.sceneWorld(sc); while (!A.over(W2)) A.stepWorld(W2); assert.strictEqual(JSON.stringify(W2.ms.map(m => [m.x, m.y, m.hp])), JSON.stringify(W.ms.map(m => [m.x, m.y, m.hp])));
  });
  ok('v2.38 셋째 칸부터의 수도 예비동작으로 읽힌다: 상대가 X로 나를 겨누면 위협으로 본다 (꺼지면 X가 없다)', () => {
    const W = world(true), a = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 20, 40), b = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 1, 40, 40); A.stepWorld(W); A.brain.think(W, a);
    const c = fake(W, '낙뢰'); c.tgt = a; c.tx = a.x; c.ty = a.y; c.T = 1; c.t = 0.8; RL.extra(b).push(c);
    const L = require('../../src/brain/lib/casts'), got = L.castsX(W, b); assert.strictEqual(got.length, 1); assert.strictEqual(L.castAt(b, 2, got), c);
    const K = { foes: [b], T: a.tac, dodgeK: 0, ux: 1, uy: 0 }; require('../../src/brain/read').readThreats(W, a, K); assert.ok(K.aimed && K.threat === c, '위협 ' + (K.threat && K.threat.s.n));
    const W0 = world(false), b0 = A.addMage(W0, A.mage({ tier: '대마법사' }), 1, 40, 40); A.addMage(W0, A.mage({ tier: '대마법사' }), 0, 20, 40); A.stepWorld(W0); A.brain.think(W0, b0); assert.strictEqual(L.castsX(W0, b0).length, 0);
  });
  ok('v2.38 둘러싸이면 셋째 칸을 열지 않는다: 산 적이 여섯 넘거나 30 m 안에 넷이면', () => {
    const W = world(true), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 0, 20, 40), es = []; for (let i = 0; i < 6; i++) es.push(A.addMage(W, A.mage({ tier: '상위' }), 1, 100, 10 + i * 10)); A.stepWorld(W);
    A.brain.think(W, m); m.cast = fake(W, '낙뢰'); m.castB = fake(W, '체인'); m.fat = 0; m.glu = m.gluMax; RL.alloc(W, m);
    const sh = W._bh.slot; let slot = ''; for (const f of sh) slot = f(W, m, { T: m.tac, foes: es }, slot); assert.strictEqual(slot, '', '여섯');
    slot = ''; for (const f of sh) slot = f(W, m, { T: m.tac, foes: es.slice(0, 2) }, slot); assert.strictEqual(slot, 'X', '둘은 멀다');
  });
  ok('v2.38 숨 고를 때: 셋째 칸을 쥐었거나 상대의 보이는 공격이 숨이 끝나기 전에 닿으면 기다린다', () => {
    const W = world(true), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 20, 40), e = A.addMage(W, A.mage({ tier: '대마법사' }), 1, 40, 40); A.stepWorld(W); A.brain.think(W, m);
    const hb = W._bh.breath, go = K => { let g = true; for (const f of hb) g = f(W, m, K, g); return g; }, K = { foes: [e] };
    e.cast = null; e.castB = null; assert.strictEqual(go(K), true);
    const c = fake(W, '체인'); c.tgt = m; c.tx = m.x; c.ty = m.y; c.T = 1; c.t = 0.9; e.cast = c; assert.strictEqual(go(K), false, '곧 닿는다');
    c.t = 0; c.T = 5; assert.strictEqual(go(K), true, '멀었다'); e.cast = null;
    RL.extra(m).push(fake(W, '체인')); assert.strictEqual(go(K), false, '쥔 셋째 칸');
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
