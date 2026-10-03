'use strict';
/* 숨 결투장 시험: v2.34~: 합창 설계(chorusCast) — 모은 고리·출력, 고리를 먹는 마법, 합창만의 마법, 깨짐과 역류
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2g.js */
const { assert, A, legacy, suite } = require('../lib');
const CC = require('../../src/rules/chorusCast').api, CH = require('../../src/rules/chorus').api, U = require('../../src/brain/util');
const world = (rules, o) => A.createWorld(Object.assign({ seed: 1, obstacles: [], width: 120, height: 80, rules: Object.assign({ profile: '지금', chorus: true, chorusCast: true, saltRing: false }, rules) }, o));
// tier n명을 (x, y) 둘레에 붙여 놓고 합창이 맞춰질 때까지 (적 하나는 멀리)
function choir(tier, n, foe, rules) {
  const W = world(rules), ms = [];
  for (let k = 0; k < n; k++) ms.push(A.addMage(W, A.mage({ tier, deck: '광역', skill: '대가', tac: { chorus: 1 } }), 0, 30 + (k % 3) * 1.5, 40 + Math.floor(k / 3) * 1.5));
  const e = A.addMage(W, A.mage({ tier: foe || '대마법사', skill: '대가', deck: '대마법사 결투' }), 1, 100, 40);
  for (const q of ms) q.tac.squad = 0;
  while (W.t < 2.5) { for (const q of ms) { q.x = 30 + (ms.indexOf(q) % 3) * 1.5; q.y = 40 + Math.floor(ms.indexOf(q) / 3) * 1.5; q.vx = q.vy = 0; q.cast = null; } e.x = 100; e.y = 40; e.cast = null; A.stepWorld(W); }
  return { W, ms, e, g: CH.of(W, ms[0]) };
}
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.34 합창 설계: 꺼지면 합창의 마법이 책에 없다, 켜면 합창할 수 있는 사람의 책에만 더한다', () => {
    const W0 = world({ chorusCast: false }), a = A.addMage(W0, A.mage({ tier: '상위', deck: '광역', tac: { chorus: 1 } }), 0, 10, 10); assert.ok(!a.book.includes('고요한 원'));
    const W = world(), b = A.addMage(W, A.mage({ tier: '상위', deck: '광역', tac: { chorus: 1 } }), 0, 10, 10), c = A.addMage(W, A.mage({ tier: '상위', deck: '광역' }), 0, 20, 10), d = A.addMage(W, A.mage({ tier: '평범', deck: '기본기', tac: { chorus: 1 } }), 0, 30, 10);
    for (const n of ['고요한 원', '번개 장막', '석회 고리', '구름 걸기', '곳간 터뜨리기', '합창 방패']) assert.ok(b.book.includes(n), n);
    assert.ok(!c.book.includes('고요한 원'), '합창하지 않는 사람'); assert.ok(!d.book.includes('고요한 원'), '평범은 합창 한계가 없다');
  });
  ok('v2.34 합창이 모으는 것: 상위 여섯 ≈ 고리 24 · 출력 0.67 MW · 선명도 12, 중간 셋 ≈ 고리 6 · 0.06 MW · 4.3', () => {
    const a = choir('상위', 6), pa = CC.pool(a.W, a.g); assert.ok(a.g && a.g.n === 6, '합창 ' + (a.g && a.g.n));
    assert.strictEqual(pa.rings, 24); assert.ok(Math.abs(pa.out - 671) < 15, '출력 ' + pa.out); assert.ok(Math.abs(pa.C - 12.25) < 0.1, '선명도 ' + pa.C);
    const b = choir('중간', 3), pb = CC.pool(b.W, b.g); assert.ok(b.g && b.g.n === 3); assert.strictEqual(pb.rings, 6); assert.ok(Math.abs(pb.out - 59) < 3, '출력 ' + pb.out); assert.ok(Math.abs(pb.C - 4.33) < 0.05);
  });
  ok('v2.34 쥘 수 있는 고리: 앞소리꾼은 모은 고리, 다른 합창원은 하나, 혼자는 서클. 고리를 먹는 마법(ring)은 쥘 고리가 있을 때만', () => {
    const a = choir('상위', 6), lead = a.g.lead, other = a.ms.find(q => q !== lead); A.brain.think(a.W, lead);
    assert.strictEqual(U.ringsOf(a.W, lead), 24); assert.strictEqual(U.ringsOf(a.W, other), 1);
    const W = world(), solo = A.addMage(W, A.mage({ tier: '상위', deck: '합법 최강' }), 0, 10, 10); A.addMage(W, A.mage({ tier: '상위' }), 1, 20, 10); A.stepWorld(W); A.brain.think(W, solo);
    assert.strictEqual(U.ringsOf(W, solo), 5); assert.ok(W.spells['대낙뢰'].ring > 5);
    const vl = W._bh.valueLate, o = { s: W.spells['대낙뢰'], v: 1, tx: 20, ty: 10 }, K = { e: W.ms[1], d: 10, foes: [W.ms[1]] }; for (const f of vl) f(W, solo, K, o); assert.strictEqual(o.v, 0, '상위 혼자는 대낙뢰를 못 쥔다');
  });
  ok('v2.34 고요한 원: 쥐는 동안 그 안의 장악은 우리 편 1·적 0, 합창이 깨지면 사라지고 역류', () => {
    const a = choir('상위', 6), lead = a.g.lead, s = a.W.spells['고요한 원'];
    A.release(a.W, lead, { s, tgt: a.e, tx: a.e.x, ty: a.e.y, t: 0, T: 1, B: false, cost: s.cost, tz: 1, tf: 1, tv: 1, hid: false, unseen: false, tk: '', vis: 1 });
    const c = CC.calms(a.W)[0]; assert.ok(c && Math.abs(c.r - 15) < 1e-9, '원'); assert.ok(Math.abs(Math.hypot(c.x - lead.x, c.y - lead.y) - 12) < 0.01, '가운데는 앞소리꾼에서 12 m');
    assert.strictEqual(A.share(a.W, lead, c.x + 3, c.y), 1); assert.strictEqual(A.share(a.W, a.e, c.x + 3, c.y), 0); assert.ok(A.share(a.W, a.e, c.x + 20, c.y) > 0, '원 밖');
    assert.ok(a.W.zones.some(z => z.k === 'calm'));
    const hp0 = a.ms.map(q => q.hp); a.ms[1].hp = 0; for (let i = 0; i < 40; i++) A.stepWorld(a.W);
    assert.strictEqual(CC.calms(a.W).length, 0, '깨지면 사라진다'); assert.ok(a.ms.some((q, i) => i !== 1 && q.hp < hp0[i]), '역류');
  });
  ok('v2.34 번개 장막은 나는 과녁만 맞히고 떨어뜨린다, 석회 고리는 과녁 둘레에 담 열여덟', () => {
    const a = choir('상위', 6), lead = a.g.lead, W = a.W, s = W.spells['번개 장막'], low = A.addMage(W, A.mage({ tier: '상위' }), 1, 60, 40);
    a.e.x = 60; a.e.y = 41; a.e.z = 6; a.e.fly = 1;
    A.release(W, lead, { s, tgt: a.e, tx: 60, ty: 40.5, t: 0, T: 1, B: false, cost: s.cost, tz: 1, tf: 1, tv: 1, hid: false, unseen: false, tk: '', vis: 1 });
    const hl = low.hp; for (let i = 0; i < 90; i++) { a.e.x = 60; a.e.y = 41; low.x = 60; low.y = 40; A.stepWorld(W); }
    assert.strictEqual(low.hp, hl, '땅의 사람엔 닿지 않는다'); assert.ok(a.e.fly === 2 || a.e.z < 6, '떨어진다'); assert.ok(CC.stats(W).netHit >= 1);
    const n0 = W.walls.length, l = W.spells['석회 고리']; A.release(W, lead, { s: l, tgt: low, tx: 60, ty: 40, t: 0, T: 1, B: false, cost: l.cost, tz: 1, tf: 1, tv: 1, hid: false, unseen: false, tk: '', vis: 1 });
    assert.strictEqual(W.walls.length - n0, 18); assert.ok(W.walls.slice(n0).every(w => Math.abs(Math.hypot(w.x - 60, w.y - 40) - 3.5) < 0.01 && w.cage));
  });
  ok('v2.34 합창 설계 판: 큰 수를 짓고(성공·깨짐을 센다), 고요한 원 안에서 과녁 자리 마법이 선다 (갇힌 판 c32, 씨앗 1)', () => {
    const W = A.sceneWorld(Object.assign(A.scenario.build('c32', { seed: 1 }), { maxT: 40 })); while (!A.over(W)) A.stepWorld(W); const st = CC.stats(W);
    assert.ok(st.bigN > 5 && st.bigOk > 0, JSON.stringify(st)); assert.ok(st.bigOk + st.bigBroke + st.bigCancel <= st.bigN); assert.ok(st.calmN >= 1 && st.calmIn > 0, '고요한 원');
    if (st.bigBroke) assert.ok(st.backDmg > 0, '역류');
  });
  ok('v2.35 합창의 메이트: 빠져나갈 수 있는 과녁엔 큰 수를 쓰지 않고, 굳어 빠져나갈 수 없을 때 쓴다(겨냥은 그 자리). 체크 뒤 메이트를 센다', () => {
    const a = choir('상위', 6), lead = a.g.lead, W = a.W, e = a.e, s = W.spells['대낙뢰']; e.x = lead.x + 15; e.y = lead.y; e.z = 0; e.fly = 0; e.st.stun = 0;
    A.brain.think(W, lead); const vl = W._bh.valueLate, val = () => { const o = { s, v: 1, tx: e.x, ty: e.y, Tw: s.cast }, K = { e, d: 15, foes: [e], los: true }; for (const f of vl) f(W, lead, K, o); return o; };
    assert.strictEqual(val().v, 0, '빠져나갈 수 있으면 메이트를 쓰지 않는다'); e.st.stun = 3; const o = val(); assert.ok(o.v > 1, '굳어 빠져나갈 수 없으면: ' + o.v); assert.ok(Math.hypot(o.tx - e.x, o.ty - e.y) < 1);
    assert.ok(CC.P.cm.check.includes('번개 장막') && CC.P.cm.mate.includes('걸어둔 구름'));
    const W2 = A.sceneWorld(Object.assign(A.scenario.build('c32', { seed: 3 }), { maxT: 40 })); while (!A.over(W2)) A.stepWorld(W2); const st = CC.stats(W2); assert.ok(st.checkN > 0 && st.chain <= st.mateN, JSON.stringify(st));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
