'use strict';
/* 숨 결투장 시험: v2.39~: 붙잡기(ringHold) — 새긴 진(자동 진 여럿·종류), 잔기술 여럿 함께 켜 두기, 준비된 수
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2i.js */
const { assert, A, legacy, suite, SCENES } = require('../lib');
const RL = require('../../src/rules/ringLedger').api, RH = require('../../src/rules/ringHold').api;
const world = (on, extra) => A.createWorld(Object.assign({ seed: 1, obstacles: [], width: 120, height: 80, rules: { profile: '지금', ringLedger: on, ringHold: on } }, extra || {}));
const fake = (W, n) => ({ s: W.spells[n], tgt: null, tx: 0, ty: 0, t: 0, T: 5, B: false, cost: 1, tz: 1, tf: 1, tv: 1, hid: false, unseen: false, tk: '', vis: 1 });
function pair(on, circ) { const W = world(on), a = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 0, 20, 40), b = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 1, 60, 40); if (circ) a.circles = circ; A.stepWorld(W); return { W, a, b }; }
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.39 새긴 진: 꺼지면 없다. 켜면 min(단계의 최대, 서클 − 일하는 고리): 대마법사 서클 11 → 6, 8 → 4, 상위 서클 4 → 2. 장부가 늘 먼저 고리를 준다', () => {
    const o = pair(false); assert.strictEqual(RH.of(o.a), null);
    const p = pair(true), q = pair(true, 8); assert.strictEqual(RH.of(p.a).arr.length, 6, RH.of(p.a).arr.join()); assert.strictEqual(RH.of(q.a).arr.length, 4); assert.strictEqual(RH.of(p.a).arr[0], 'react');
    const W = world(true), u = A.addMage(W, A.mage({ tier: '상위' }), 0, 20, 40); A.addMage(W, A.mage({ tier: '대마법사' }), 1, 60, 40); u.circles = 4; A.stepWorld(W); assert.strictEqual(RH.of(u).arr.length, 2);
    const m = p.a; m.cast = fake(p.W, '낙뢰'); m.castB = null; m.st.psv = 0; m.fly = 0; m.flyWant = false; const L = RL.alloc(p.W, m); assert.strictEqual(L.F, m.circles - 1 - 6, '빈 고리 ' + L.F);
  });
  ok('v2.39 자동 잔기술: 보이는 전기 공격이 곧 닿으면 저절로 켜져 막고, 숨긴 수엔 움직이지 않는다. 빗나가면 헛켜짐으로 센다', () => {
    const { W, a, b } = pair(true); A.brain.think(W, a); A.brain.think(W, b); b.x = a.x + 3; b.y = a.y;
    const s = RH.of(a); assert.ok(s.auto[1], '전기 진 ' + s.arr.join());
    const c = fake(W, '체인'); c.tgt = a; c.tx = a.x; c.ty = a.y; c.T = 1; c.t = 1; c.unseen = true; b.cast = c; a.st.psv = 0; A.stepWorld(W); assert.ok(!(W.t < s.au[1]), '숨긴 수');
    c.unseen = false; c.t = 0.95; b.cast = c; A.stepWorld(W); assert.ok(W.t < s.au[1], '켜짐'); b.cast = null;
    const C = require('../../src/core'); C.hurt(W, a, 10, b, '체인', 'elec'); assert.ok(s.auHit[1], '닿았다');
    const by = RH.stats(W)['대마법사']; assert.ok(by.trig[1] >= 1 && by.blk[1] > 0);
  });
  ok('v2.39 준비된 수: 조용할 때 P로 짓고, 다 지으면 그때 머리 열을 내고, 과녁이 굳으면 한꺼번에 푼다(풀 때는 머리 열이 더해지지 않는다)', () => {
    const { W, a, b } = pair(true); b.x = a.x + 10; A.brain.think(W, a); a.cast = fake(W, '낙뢰'); a.castB = fake(W, '체인'); a.fat = 0; a.glu = a.gluMax; RL.alloc(W, a);
    const K = { T: a.tac, foes: [b], aimed: false, threat: null }; let slot = ''; for (const f of W._bh.slot) slot = f(W, a, K, slot); assert.strictEqual(slot, 'P');
    K.aimed = true; slot = ''; for (const f of W._bh.slot) slot = f(W, a, K, slot); assert.notStrictEqual(slot, 'P', '겨눴으면 조용하지 않다');
    const s = RH.of(a), c = fake(W, '짧은 실'); c.T = 0.05; c.t = 0; c.tgt = b; c.tx = b.x; c.ty = b.y; RH.hold(W, a, c); a.cast = a.castB = null;
    const K2 = { T: a.tac, foes: [b], e: b, los: true };
    const f0 = a.fat; for (let i = 0; i < 3; i++) A.stepWorld(W); assert.ok(a.fat > f0, '다 지을 때 머리 열'); assert.strictEqual(RH.readyN(a), 1);
    b.st.stun = 1; a.st.stun = 0; const f1 = a.fat; for (const f of W._bh.bound) f(W, a, K2); assert.strictEqual(s.prep.length, 0, '풀었다'); assert.ok(a.fat <= f1 + 1e-9, '풀 때 머리 열 없음 ' + (a.fat - f1));
    const by = RH.stats(W)['대마법사']; assert.strictEqual(by.burst[1], 1);
  });
  ok('v2.39 상대가 쥔 준비된 수를 읽는다: 그 사거리 안이면 숨을 미루고, 그 종류의 잔기술을 함께 켜 둘 일로 바란다', () => {
    const { W, a, b } = pair(true); A.brain.think(W, a); A.brain.think(W, b);
    b.x = a.x + 10; b.y = a.y; const sb = RH.of(b), c = fake(W, '체인'); c.t = c.T = 1; sb.prep.push(c); a.st.psv = 0;
    let go = true; for (const f of W._bh.breath) go = f(W, a, { foes: [b] }, go); assert.strictEqual(go, false);
    for (const f of W._bh.bound) f(W, a, { foes: [b], e: b, los: true }); assert.ok(RH.of(a).wantN >= 1 && RH.of(a).wantK[0] === 1, '절연 막을 바란다');
  });
  ok('v2.39 결투장 전설 대 전설(장부·붙잡기 켬): 진이 켜지고 준비된 수를 짓고 풀며, 같은 씨앗이면 같은 판', () => {
    const sc = Object.assign(JSON.parse(JSON.stringify(SCENES['v2-tactics-legend'])), { seed: 3, maxT: 40 }); sc.rules = Object.assign({}, sc.rules, { ringLedger: true, ringHold: true });
    const W = A.sceneWorld(sc); while (!A.over(W)) A.stepWorld(W); const st = RH.stats(W)['대마법사'];
    assert.ok(st && st.trig[1] > 0 && st.pB > 0, JSON.stringify({ trig: st && st.trig, pB: st && st.pB }));
    const W2 = A.sceneWorld(sc); while (!A.over(W2)) A.stepWorld(W2); assert.strictEqual(JSON.stringify(W2.ms.map(m => [m.x, m.y, m.hp])), JSON.stringify(W.ms.map(m => [m.x, m.y, m.hp])));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
