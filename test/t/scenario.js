'use strict';
/* 숨 결투장 시험: v2.33~: 조건 짓개(src/scenario.js, data/conditions.json), 공성의 시간 끝(timeWin)·갇힌 판(closed), 둥근 탄의 명중, 합창 깨기
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/scenario.js */
const { assert, A, vm, SRC, legacy, suite } = require('../lib');
const ART = require('../../src/rules/artillery').api, CH = require('../../src/rules/chorus').api;
function run() {
  legacy(false); const { ok, done } = suite();
  const L = A.scenario.list();
  ok('v2.33 짓개: 조건마다 장면이 지어지고 3 s 돈다, 판 밖에 사람이 없다', () => {
    assert.ok(L.length >= 30, '조건 ' + L.length);
    for (const { id } of L) { const sc = A.scenario.build(id, { seed: 2 }); assert.strictEqual(sc.cond, id);
      for (const sd of sc.sides) for (const m of sd.mages) if (m.x != null) assert.ok(m.x >= 0 && m.x <= sc.width && m.y >= 0 && m.y <= sc.height, id + ' 판 밖: ' + m.x + ',' + m.y);
      const W = A.sceneWorld(Object.assign({}, sc, { maxT: 3 })); while (!A.over(W)) A.stepWorld(W);
      for (const m of W.ms) assert.ok(Number.isFinite(m.x) && m.x >= -1 && m.x <= W.width + 1 && m.y >= -1 && m.y <= W.height + 1, id + ' 돈 뒤 판 밖: ' + m.name); }
  });
  ok('v2.33 짓개: 같은 조건·씨앗이면 같은 장면, 씨앗이 다르면 골목의 자리가 다르다', () => {
    for (const { id } of L) assert.strictEqual(JSON.stringify(A.scenario.build(id, { seed: 3 })), JSON.stringify(A.scenario.build(id, { seed: 3 })), id);
    const a = A.scenario.build('c23', { seed: 1 }), b = A.scenario.build('c23', { seed: 2 }); assert.notStrictEqual(JSON.stringify(a.sides[1].mages), JSON.stringify(b.sides[1].mages));
  });
  ok('v2.33 짓개: 배치는 지금 엔진의 수 (장악 반경 = domainR × C, 고리는 그 밖), 규칙은 지금 묶음 + 조건', () => {
    const sc = A.scenario.build('c02'), R = A.rulesOf(sc.rules); assert.strictEqual(sc.rules.profile, '지금'); assert.strictEqual(sc.info.prot.dom, Math.round(R.domainR * A.TIERS['대마법사'].C * 100) / 100);
    const c = A.scenario.build('c32'), p = c.sides[0].mages[0]; for (const m of c.sides[1].mages) assert.ok(Math.hypot(m.x - p.x, m.y - p.y) >= c.info.prot.dom + 9.9, '고리 안쪽');
    assert.ok(c.rules.squad && c.rules.chorus && c.rules.saltRing && c.closed);
    const g = A.scenario.build('c24'); assert.ok(g.rules.artillery && g.decks['청동포'] && g.timeWin === 1); const arch = g.sides[0].mages[0];
    for (const m of g.sides[1].mages) if (m.tac && m.tac.gun) assert.ok(Math.hypot(m.x - arch.x, m.y - arch.y) > 150, '포는 150 m 밖');
  });
  ok('v2.33 짓개: 묶음(sandbox/arena.js)의 Arena.scenario가 Node와 같은 장면을 짓는다', () => {
    const ctx = vm.createContext({}); vm.runInContext(SRC('sandbox/arena.js'), ctx, { filename: 'sandbox/arena.js' }); const B = ctx.Arena;
    assert.strictEqual(B.scenario.list().length, L.length); for (const { id } of L) assert.strictEqual(JSON.stringify(B.scenario.build(id, { seed: 4 })), JSON.stringify(A.scenario.build(id, { seed: 4 })), id);
  });
  ok('v2.33 장면 칸: timeWin이면 시간이 다 됐을 때 그 편이 이기고, 없으면 예전대로 체력 몫', () => {
    const sc = { seed: 1, maxT: 1, obstacles: [], sides: [{ mages: [{ tier: '대마법사', x: 5, y: 15 }] }, { mages: [{ tier: '평범', deck: '기본기', x: 35, y: 15 }] }] };
    const r0 = A.runScene(sc), r1 = A.runScene(Object.assign({}, sc, { timeWin: 1 })); assert.strictEqual(r1.winner, 1); assert.ok(r1.byTime); assert.notStrictEqual(r0.winner, 1);
  });
  ok('v2.33 갇힌 판(closed): 대마법사가 물러서지 않고 끝으로 빠지지 않는다', () => {
    const sc = Object.assign(A.scenario.build('c32', { seed: 1 }), { maxT: 40 }), W = A.sceneWorld(sc); assert.ok(W.closed);
    while (!A.over(W)) A.stepWorld(W); assert.ok(!W.ms[0].flee && !W.ms[0].alog.fled);
  });
  ok('v2.33 둥근 탄: 떠서라도 멈춘 과녁은 300 m에서 맞고, 움직이는 과녁은 못 맞힌다', () => {
    const shot = (d, z, mv) => { let h = 0, n = 0; for (let seed = 1; seed <= 3; seed++) {
      const sc = { seed, width: d + 40, height: 60, maxT: 40, obstacles: [], rules: { profile: '지금', artillery: true, saltRing: false }, decks: ART.P.decks,
        sides: [{ mages: [{ tier: '평범', deck: '기본기', x: d + 20, y: 30, z, hp: 99999 }] }, { mages: [{ tier: '병사', deck: '청동포', x: 20, y: 30, hp: 400, tac: { gun: 1, cancel: false, cancel2: false } }].concat([0, 1, 2, 3].map(c => ({ tier: '병사', deck: '포수', x: 17, y: 28 + c * 1.5, tac: { crew: 1 } }))) }] };
      const W = A.sceneWorld(sc), t = W.ms[0]; while (!A.over(W)) { if (!mv) { t.x = d + 20; t.y = 30; t.vx = 0; t.vy = 0; t.z = z; t.vz = 0; } t.hp = 99999; A.stepWorld(W); }
      n += W.ms[1].log.casts['둥근 탄'] || 0; h += W.ms[1].log.hits['둥근 탄'] || 0; } return [h, n]; };
    const [h3, n3] = shot(300, 8, false); assert.ok(n3 >= 3 && h3 >= n3 - 1, '300 m 떠서 멈춤 ' + h3 + '/' + n3);
    const [hm] = shot(200, 0, true); assert.strictEqual(hm, 0, '움직이는 과녁');
  });
  ok('v2.33 합창 깨기: 지표(깬 합창·넓은 마법·앞소리꾼)가 쌓이고, 전설(tac.chorusBreak)은 앞소리꾼을 노린다', () => {
    assert.ok(A.mage({ tier: '대마법사', skill: '전설' }).tac.chorusBreak); assert.ok(!A.mage({ tier: '대마법사', skill: '대가' }).tac.chorusBreak);
    const B = require('../../experiments/bound'), g = B.run('상위', 30, 0, 1, { squad: true })[0];
    assert.ok(g.atN > 0 && g.leadN / g.atN > 0.8, '앞소리꾼 ' + g.leadN + '/' + g.atN); assert.ok(g.brokeHit >= 0 && g.wideN <= g.atN);
    assert.ok(CH.stats);
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
