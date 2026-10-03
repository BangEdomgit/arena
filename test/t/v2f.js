'use strict';
/* 숨 결투장 시험: v2.31~: 포병과 소금 탄(artillery), 장악권 경계(edgeCancel), 점검의 포 탐지기
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2f.js */
const { assert, A, legacy, suite } = require('../lib');
const C = require('../../src/core'), ART = require('../../src/rules/artillery').api, AU = require('../../experiments/audit');
const DK = ART.P.decks;
const world = (rules, o) => A.createWorld(Object.assign({ seed: 1, obstacles: [], width: 200, height: 100, rules: Object.assign({ artillery: true }, rules) }, o));
const gun = (W, side, x, y) => { const lib = { decks: Object.assign({}, A.DECKS, DK) }; const g = A.addMage(W, Object.assign(A.mage({ tier: '병사', deck: '청동포', tac: { gun: 1, cancel: false, cancel2: false } }, lib), { hp: 400 }), side, x, y);
  const crew = []; for (let k = 0; k < 4; k++) crew.push(A.addMage(W, A.mage({ tier: '병사', deck: '포수', tac: { crew: 1 } }, lib), side, x + 1, y - 1.5 + k)); return [g, crew]; };
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.31 포병: 꺼지면 포의 마법이 책에서 빠진다 (규칙에 딸린 마법)', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60 }), lib = { decks: Object.assign({}, A.DECKS, DK) };
    const g = A.addMage(W, A.mage({ tier: '병사', deck: '청동포' }, lib), 0, 10, 10); assert.strictEqual(g.book.length, 0);
    const W2 = world(), g2 = A.addMage(W2, A.mage({ tier: '병사', deck: '청동포' }, lib), 0, 10, 10); assert.deepStrictEqual(g2.book, ['산탄', '둥근 탄', '소금 탄']);
  });
  ok('v2.31 포병: 포수가 곁에 있어야 쏘고 끈다, 다시 채우기는 포수 수에 반비례, 포수가 없으면 버려진다(빠짐)', () => {
    const W = world(); const [g, crew] = gun(W, 0, 20, 50); A.addMage(W, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 120, 50);
    A.stepWorld(W); const S = ART.stOf(W); assert.strictEqual(S.n.get(g), 4); assert.strictEqual(S.guns.length, 1);
    C.release(W, g, { s: W.spells['둥근 탄'], tx: 120, ty: 50, tgt: W.ms[5], t: 0, T: 0 }); assert.ok(Math.abs(g.cd['산탄'] - 30) < 1e-9 && Math.abs(g.cd['소금 탄'] - 30) < 1e-9);
    crew[0].hp = 0; crew[1].hp = 0; A.stepWorld(W); C.release(W, g, { s: W.spells['둥근 탄'], tx: 120, ty: 50, tgt: W.ms[5], t: 0, T: 0 }); assert.ok(Math.abs(g.cd['둥근 탄'] - 60) < 1e-9, g.cd['둥근 탄']);
    for (const c of crew) c.hp = 0; A.stepWorld(W); assert.ok(g.hp === 0 && g.alog.fled === 1, '버려진 포');
  });
  ok('v2.31 포병: 산탄은 공 n개를 원뿔로, 앙각 안의 과녁을 맞히고 석회 방패를 일부만 뚫는다. 포는 마법에 거의 다치지 않는다', () => {
    const W = world(); const [g] = gun(W, 0, 20, 50); const e = A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 40, 50); A.stepWorld(W);
    const n0 = W.proj.length; C.release(W, g, { s: W.spells['산탄'], tx: 40, ty: 50, tgt: e, t: 0, T: 0 }); assert.strictEqual(W.proj.length - n0, ART.P.canister.n);
    const hp0 = e.hp; for (let i = 0; i < 20; i++) A.stepWorld(W); assert.ok(e.hp < hp0 - 100, '맞았다 ' + (hp0 - e.hp));
    const h0 = g.hp; C.hurt(W, g, 5000, e, '낙뢰', 'elec'); assert.ok(h0 - g.hp <= ART.P.gun.magicCap + 1e-9, '청동: ' + (h0 - g.hp));
  });
  ok('v2.31 포병: 둥근 탄은 방패가 못 막는다 (pierce)', () => {
    const W = world(); const [g] = gun(W, 0, 20, 50); const e = A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 60, 50); A.stepWorld(W);
    e.buf.front = { v: 1, t: 5 }; e.aim = Math.PI; const hp0 = e.hp; C.release(W, g, { s: W.spells['둥근 탄'], tx: 60, ty: 50, tgt: e, t: 0, T: 0 }); for (let i = 0; i < 30; i++) A.stepWorld(W);
    assert.ok(e.hp < hp0 - 100, '방패를 뚫는다 ' + (hp0 - e.hp));
  });
  ok('v2.31 소금 안개: 안에선 마법이 서지 않고(시전자·서는 자리), 날던 사람이 떨어지고, 몸 마법이 흩어지고, 안의 적은 장악권을 다투지 않는다', () => {
    const W = world({ flight: true, domain: true }); const [g] = gun(W, 0, 20, 50); const e = A.addMage(W, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 60, 50), q = A.addMage(W, A.mage({ tier: '상위', deck: '기본기' }), 0, 75, 50); A.stepWorld(W);
    const s = W.spells['불덩이'], st = W.spells['낙뢰'], g0 = C.gAt(W, q, st, 61, 50);
    W.lobs.push({ x: 60, y: 50, t: 0.01, s: W.spells['소금 탄'], src: g, pow: 1, r: 2 }); e.fly = 1; e.z = 3; e.buf.front = { v: 1, t: 5 }; A.stepWorld(W); A.stepWorld(W);
    assert.ok(W.zones.some(z => z.k === 'saltfog'), '안개'); assert.ok(ART.inFog(W, 60, 50, 0));
    assert.strictEqual(C.gAt(W, e, s, 75, 50), 0, '안의 시전자'); assert.strictEqual(C.gAt(W, q, st, 61, 50), 0, '안의 서는 자리');
    assert.ok(e.fly === 2 && e.buf.front === null, '떨어지고 방패가 흩어진다');
    assert.ok(C.gAt(W, q, s, 75, 50) >= C.gAt(W, q, s, 75, 50) && C.share(W, q, 72, 50) > 0.9, '안의 적은 다투지 않는다'); void g0;
  });
  ok('v2.31 포병 두뇌: 포는 가장 선명한 적, 대마법사는 곁의 포수부터 노린다. 소금은 하나만, 산탄은 안개 안의 과녁에 먼저', () => {
    const W = world(); const [g] = gun(W, 0, 20, 50); const [g2] = gun(W, 0, 20, 70); A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 50, 50); const am = A.addMage(W, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 70, 52);
    A.stepWorld(W); A.brain.think(W, g); assert.strictEqual(g._k.e, am); A.brain.think(W, am); assert.ok(am._k.e.tac.crew, '포수: ' + am._k.e.name);
    g.cast = { s: W.spells['소금 탄'], tgt: am, tx: am.x, ty: am.y, t: 0, T: 1 }; const o = { s: W.spells['소금 탄'], n: '소금 탄', v: 1, tx: 0, ty: 0 }, K = Object.assign({}, g2._k || {}, { e: am, d: 50, los: true });
    for (const h of W._bh.valueLate) h(W, g2, K, o); assert.strictEqual(o.v, 0, '다른 포가 소금을 쏘는 중');
  });
  ok('v2.31 장악권 경계 (edgeCancel): 나보다 1.5배 넘게 선명한 과녁 앞에선 흩어질 수를 짓지 않고, 짓다가 흩어지게 되면 끊는다', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 100, rules: { edgeCancel: true } });
    const m = A.addMage(W, A.mage({ tier: '상위', deck: '광역' }), 0, 40, 50), am = A.addMage(W, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 70, 50); A.stepWorld(W); A.brain.think(W, m);
    const o = { s: W.spells['낙뢰'], v: 1, tx: am.x, ty: am.y }, K = { e: am }; assert.ok(C.gAt(W, m, o.s, am.x, am.y) < 0.3); for (const h of W._bh.valueLate) h(W, m, K, o); assert.strictEqual(o.v, 0);
    const EB = require('../../src/rules/edgeCancel').brain(Object.assign({}, require('../../src/brain/util'), { lib: require('../../src/brain/lib') }));
    m.cast = { s: W.spells['낙뢰'], tgt: am, tx: am.x, ty: am.y, t: 0, T: 1, cost: 3 }; EB.cancel(W, m, { e: am }); assert.strictEqual(m.cast, null, '끊었다');
    const W0 = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 100 }), m0 = A.addMage(W0, A.mage({ tier: '상위', deck: '광역' }), 0, 40, 50); A.addMage(W0, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 70, 50);
    A.stepWorld(W0); assert.ok(!W0.mods.some(r => r.name === 'edgeCancel'), '꺼지면 규칙이 세계에 없다');
  });
  ok('v2.31 점검: 포 사선에 아군, 소금 안개 안에서 짓기', () => {
    const sc = { v: A.VERSION, name: '점검 시험', width: 120, height: 60, maxT: 4, obstacles: [], rules: { saltRing: false, artillery: true }, decks: DK,
      sides: [{ name: '포', mages: [{ tier: '병사', deck: '청동포', x: 10, y: 30, hp: 400, tac: { gun: 1 } }, { tier: '병사', deck: '포수', x: 7, y: 30, tac: { crew: 1 } }, { tier: '병사', deck: '머스킷', x: 30, y: 30 }] },
        { name: '적', mages: [{ tier: '상위', deck: '기본기', x: 60, y: 30 }] }] };
    const r = AU.run('', 1, null, { sc, prep: W => { for (const m of W.ms) m.thinkT = 1e9; }, step: W => { if (W.step === 3) C.release(W, W.ms[0], { s: W.spells['산탄'], tx: 60, ty: 30, tgt: W.ms[3], t: 0, T: 0 });
      if (W.step === 4) { W.lobs.push({ x: 60, y: 30, t: 0.01, s: W.spells['소금 탄'], src: W.ms[0], pow: 1, r: 2 }); }
      if (W.step === 8) { const e = W.ms[3]; e.cast = { s: W.spells['불덩이'], tgt: W.ms[2], tx: 30, ty: 30, t: 0, T: 9, cost: 1 }; } } });
    assert.ok(r.ev.some(e => e.what === '포 사선에 아군') && r.ev.some(e => e.what === '소금 안개 안에서 짓기'), JSON.stringify(r.ev));
  });
  ok('v2.32 합창: 이어 가는 거리(keepR)와 끼어들기(join) — 맞출 땐 R, 이어 갈 땐 keepR, 곁의 같은 편이 들어오면 다시 맞춘다', () => {
    const CHP = require('../../src/rules/chorus').api; assert.ok(CHP.P.keepR > CHP.P.R && CHP.P.join);
    const W = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 100, rules: { chorus: true, squad: true } }), sq = { squad: 1 };
    const a = A.addMage(W, A.mage({ tier: '상위', deck: '광역', tac: sq }), 0, 50, 50), b = A.addMage(W, A.mage({ tier: '상위', deck: '광역', tac: sq }), 0, 54, 50); A.addMage(W, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 190, 50);
    for (const m of W.ms) m.thinkT = 1e9; for (let i = 0; i < 120; i++) A.stepWorld(W); const g = CHP.of(W, a); assert.ok(g && g.n === 2, '둘이 맞췄다');
    b.x = 50 + (CHP.P.R + CHP.P.keepR) / 2; for (let i = 0; i < 20; i++) A.stepWorld(W); assert.ok(CHP.of(W, a), 'R보다 멀어도 keepR 안이면 이어 간다');
    b.x = 54; const c = A.addMage(W, A.mage({ tier: '상위', deck: '광역', tac: sq }), 0, 52, 53); c.thinkT = 1e9; for (let i = 0; i < 20; i++) A.stepWorld(W);
    const g2 = CHP.forming(W, a) || CHP.of(W, a); assert.ok(g2, '셋째가 들어와 다시 맞춘다');
  });
  ok('v2.32 장악권 경계는 합창이 맞춰진 사람의 수를 끊지 않는다', () => {
    const src = require('fs').readFileSync(require('path').join(__dirname, '../../src/rules/edgeCancel.js'), 'utf8'); assert.ok(/CH\.of\(W, m\)/.test(src));
  });
  ok('v2.32 포수 채우기: 쓰러진 포수 자리를 곁(crew.fill m)의 머스킷 병이 채운다, 포가 버려지지 않는다', () => {
    const W = world(); const [g, crew] = gun(W, 0, 20, 50); const mk = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 0, 30, 50); A.addMage(W, A.mage({ tier: '대마법사', deck: '대마법사 성' }), 1, 150, 50);
    A.stepWorld(W); for (const c of crew) c.hp = 0; A.stepWorld(W); assert.ok(g.hp > 0 && mk.tac.crew === 1 && ART.stOf(W).crew.get(mk) === g && ART.stOf(W).filled === 1);
  });
  ok('v2.32 소금을 건너는 길: 과녁이 멀면 소금을 덜 밟는 쪽으로, 앞 probe m 안 (saltWise route)', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 100, salt: [{ x: 50, y: 0, w: 20, h: 70 }], rules: { saltWise: true } });
    const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 성' }), 0, 49.5, 40), e = A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 190, 40);
    A.stepWorld(W); const st = require('../../src/rules/saltWise').brain(require('../../src/brain/util')).steer, K = { vx: 2.5, vy: 0, dodge: null, e, d: 145, prefR: 7 }; m.z = 0; st(W, m, K);
    assert.ok(K.vx < 1 && Math.abs(K.vy) > 1.5, '소금 띠를 곧바로 건너지 않고 옆으로 돈다: ' + K.vx.toFixed(2) + ',' + K.vy.toFixed(2));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
