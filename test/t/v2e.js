'use strict';
/* 숨 결투장 시험: v2.30~: 지능 점검(audit)의 탐지기 하나에 시험 하나, 고침의 스위치(resolve·fireLane·saltWise·selfSafe·crowdFire·unstuck)
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2e.js */
const { assert, A, legacy, suite } = require('../lib');
const AU = require('../../experiments/audit'), C = require('../../src/core');
// 작은 장면: 편마다 [단계, 덱, x, y]
const scene = (sides, o) => Object.assign({ v: A.VERSION, name: '점검 시험', width: 60, height: 40, maxT: 12, obstacles: [], rules: { saltRing: false },
  sides: sides.map((ms, i) => ({ name: '편' + i, mages: ms.map(([tier, deck, x, y]) => ({ tier, deck, x, y })) })) }, o);
const evs = (r, re) => r.ev.filter(e => re.test(e.what));
const still = W => { for (const m of W.ms) m.thinkT = 1e9; };   // 아무도 생각하지 않는다
function run() {
  legacy(false); const { ok, done } = suite();
  const duo = (o) => scene([[['평범', '기본기', 20, 20]], [['평범', '기본기', 32, 20]]], o);
  ok('v2.30 점검: 기회 놓침 — 쏠 수 있는데 2 s 넘게 아무것도 안 하면 적는다 (장악권에 흩어질 수는 빼고)', () => {
    const r = AU.run('', 1, null, { sc: duo(), prep: W => { W.ms[0].thinkT = 1e9; } });
    const e = evs(r, /^기회 놓침/); assert.ok(e.length >= 1 && e[0].v > 2 && e[0].t > 2, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 헛시전 — 소금 위에서 선 마법은 "알 수 있었던 것"으로 따로 센다', () => {
    let k = 0; const r = AU.run('', 1, null, { sc: duo({ salt: [{ x: 0, y: 0, w: 26, h: 40 }] }), prep: still,
      step: W => { const m = W.ms[0]; if (W.step % 10 === 0 && k < 6) { k++; C.release(W, m, { s: W.spells['불덩이'], tx: 32, ty: 20, tgt: W.ms[1], t: 0, T: 0 }); } } });
    assert.strictEqual(evs(r, /^헛시전: 알 수 있었던 것/).length, 1, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 명중 범위 밖과 같은 수 되풀이 — 13번 빗나간 같은 수', () => {
    let k = 0; const r = AU.run('', 1, null, { sc: duo(), prep: still,
      step: W => { const m = W.ms[0]; if (W.step % 10 === 0 && k < 14) { k++; m.glu = 100; C.release(W, m, { s: W.spells['불덩이'], tx: 20, ty: 2, tgt: W.ms[1], t: 0, T: 0 }); } } });
    assert.ok(evs(r, /^명중 범위 밖 \(평범\)/).length === 1 && evs(r, /^같은 수 되풀이/).length === 1, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 떨림 — 걸음 방향을 1초에 세 번 넘게 뒤집으면 적는다', () => {
    const r = AU.run('', 1, null, { sc: duo(), prep: still, step: W => { const m = W.ms[0]; const s = Math.floor(W.t / 0.25) % 2 ? 1 : -1; m.mv.x = 0; m.mv.y = 2 * s; } });
    assert.strictEqual(evs(r, /^떨림/).length >= 1, true, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 막혀 제자리 — 걸으려는데 3 s 동안 0.6 m도 못 가면 적는다', () => {
    const r = AU.run('', 1, null, { sc: scene([[['평범', '기본기', 0.5, 20]], [['평범', '기본기', 40, 20]]]), prep: still, step: W => { W.ms[0].mv.x = -3; W.ms[0].mv.y = 0; } });
    assert.ok(evs(r, /^막혀 제자리/).length >= 1, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 위험 지대 — 선명도 2 이상이 소금 위에 1 s 넘게 서 있으면 적는다', () => {
    const r = AU.run('', 1, null, { sc: scene([[['중간', '기본기', 10, 20]], [['중간', '기본기', 50, 20]]], { salt: [{ x: 0, y: 0, w: 20, h: 40 }] }), prep: still });
    assert.strictEqual(evs(r, /^위험 지대/).length, 1, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 아군 피해·스스로 입은 피해·역류 — 편의 몫, 사람의 몫, 번', () => {
    const sc = scene([[['평범', '기본기', 10, 10], ['평범', '기본기', 10, 30]], [['평범', '기본기', 50, 20]]]);
    const r = AU.run('', 1, null, { sc, prep: still, step: W => { if (W.step === 5) { const [a, b] = W.ms; C.hurt(W, b, 40, a, '불덩이', 'fire'); C.hurt(W, a, 30, a, '불기둥', 'fire'); a.log.backfire = 1; } } });
    assert.ok(evs(r, /^아군 피해 몫/).length === 1 && evs(r, /^스스로 입은 피해 몫/).length === 1 && evs(r, /^역류/).length === 1, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 체력 남기고 도망 — 비슷한 상대(2배 아래) 앞에서 멀쩡한데 달아나면 적고, 3배 넘게 선명한 상대 앞은 세지 않는다 (v2.31)', () => {
    const sc = scene([[['평범', '기본기', 10, 10], ['병사', '머스킷', 10, 30]], [['평범', '기본기', 50, 20]]]);
    const r = AU.run('', 1, null, { sc, prep: W => { still(W); W.ms[0].flee = 1; W.ms[1].flee = 1; } });
    assert.ok(evs(r, /^체력 남기고 도망 \(평범\)/).length === 1 && evs(r, /^체력 남기고 도망 \(군대\)/).length === 0, JSON.stringify(r.ev));
    const sc2 = scene([[['병사', '머스킷', 10, 10], ['병사', '머스킷', 10, 30]], [['병사', '머스킷', 50, 20]]]);
    const r2 = AU.run('', 1, null, { sc: sc2, prep: W => { still(W); W.ms[0].flee = 1; } }); assert.strictEqual(evs(r2, /^체력 남기고 도망 \(군대\)/).length, 1, JSON.stringify(r2.ev));
  });
  ok('v2.30 점검: 끝나지 않는 판 — 시간이 다 되면 적는다', () => {
    const r = AU.run('', 1, null, { sc: duo({ maxT: 4 }), prep: still });
    assert.strictEqual(evs(r, /^끝나지 않는 판/).length, 1, JSON.stringify(r.ev));
  });
  ok('v2.30 점검: 대마법사 — 장전된 총 셋 앞에 서 있음, 소금 위 몫, 판마다 떠 있는 몫·속도', () => {
    const sc = scene([[['대마법사', '대마법사 성', 30, 20]], [['병사', '머스킷', 50, 10], ['병사', '머스킷', 50, 20], ['병사', '머스킷', 50, 30]]], { salt: [{ x: 25, y: 0, w: 10, h: 40 }] });
    const r = AU.run('', 1, null, { sc, prep: still });
    assert.ok(evs(r, /^대마법사: 총 앞에 서 있음/).length === 1 && evs(r, /^대마법사: 소금 위 몫/).length === 1, JSON.stringify(r.ev));
    assert.ok(r.sum.arch.length === 1 && r.sum.arch[0].salt > 0.9 && r.sum.arch[0].air === 0);
  });
  ok('v2.30 점검: 오류 — NaN과 판 밖', () => {
    const r1 = AU.run('', 1, null, { sc: duo(), prep: still, step: W => { if (W.step === 20) W.ms[0].x = NaN; } });
    const r2 = AU.run('', 1, null, { sc: duo(), prep: still, after: W => { if (W.step >= 20) W.ms[0].x = -10; } });
    assert.ok(evs(r1, /^오류: NaN/).length === 1 && evs(r2, /^오류: 판 밖/).length === 1, JSON.stringify(r2.ev));
  });
  ok('v2.30 점검: 데이터 — 덱에 없는 마법, 장면의 자리가 판 밖', () => {
    A.DECKS['시험 덱'] = ['없는 마법']; let ev; try { ev = AU.dataCheck(); } finally { delete A.DECKS['시험 덱']; }
    assert.ok(ev.some(e => e.what === '데이터: 덱에 없는 마법' && e.who === '시험 덱'));
    assert.ok(!ev.some(e => e.what === '데이터: 장면의 자리가 판 밖'), '소금 도시의 총병 (v2.31에 고침)');
    assert.ok(AU.dataCheck({ 시험: scene([[['평범', '기본기', 61, 20]], [['평범', '기본기', 30, 20]]]) }).some(e => e.what === '데이터: 장면의 자리가 판 밖' && e.who === '시험'));
    assert.ok(!AU.dataCheck().some(e => e.what === '데이터: 마법 이름 칸이 키와 다름'), '얼음 담 같은 이름 칸 (v2.28.1)');
  });
  ok('v2.30 점검: 같은 씨앗이면 같은 사건, 판에는 닿지 않는다(점검을 붙여도 결과가 같다)', () => {
    const a = AU.run('duel', 2), b = AU.run('duel', 2); assert.deepStrictEqual(a.ev, b.ev);
    const W = A.sceneWorld(Object.assign({}, require('../../sandbox/scenes/duel.json'), { seed: 2 })); while (!A.over(W)) A.stepWorld(W); assert.strictEqual(+W.t.toFixed(2), a.sum.t ? +a.sum.t.toFixed(2) : -1);
  });
  // ---- 고침의 스위치 ----
  ok('v2.30 사선 (fireLane): 쏘는 줄·과녁 너머에 우리 편이 있으면 막혔다, 옆이면 열렸다. 붙어 선 사람은 총구에서 맞는다', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60, rules: { army: true, fireLane: true } });
    const m = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 0, 10, 30), q = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 0, 30, 30); A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 50, 30);
    const L = require('../../src/rules/fireLane').api.lane;
    assert.ok(L(W, m, 50, 30, 100) !== 0); q.y = 36; assert.strictEqual(L(W, m, 50, 30, 100), 0); q.x = 70; q.y = 30.5; assert.ok(L(W, m, 50, 30, 100) !== 0, '과녁 너머');
    q.x = 10.3; q.y = 29.8; assert.ok(L(W, m, 50, 30, 100) !== 0, '붙어 선 사람'); q.x = 9.8; assert.ok(L(W, m, 50, 30, 100) !== 0, '등 뒤에 붙은 사람'); q.x = 9; assert.strictEqual(L(W, m, 50, 30, 100), 0, '등 뒤 1 m');
  });
  ok('v2.30 사선 (fireLane): 둘러싼 총병이 서로를 덜 쏜다 (소금 성채, 씨앗 1~2)', () => {
    const ff = sw => { let n = 0; for (const seed of [1, 2]) { const W = A.sceneWorld(Object.assign({}, require('../../sandbox/scenes/x-salt-fort.json'), { seed, maxT: 30, rules: { profile: '지금', saltRing: false, fireLane: sw } }));
      W.H.hurt.push((W, m, v, src, name) => { if (src && src.side === m.side && W.spells[name] && W.spells[name].mundane) n++; }); while (!A.over(W)) A.stepWorld(W); } return n; };
    const a = ff(false), b = ff(true); assert.ok(b < a, a + ' → ' + b);
  });
  ok('v2.30 소금을 아는 대마법사 (saltWise): 소금에 서면 맨땅으로 가고, 흩어질 수·반사 방패를 안 쓰고, 소금 위 과녁엔 직사·곡사', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60, salt: [{ x: 40, y: 0, w: 20, h: 60 }], rules: { saltWise: true } });
    const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 성' }), 0, 45, 30), e = A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 52, 30);
    A.stepWorld(W); A.brain.think(W, m); assert.ok(m.mv.x < -1, '왼쪽 맨땅(40)으로: ' + m.mv.x);
    const bh = W._bh, o = { s: W.spells['낙뢰'], v: 1, tx: e.x, ty: e.y, cost: 3, Tw: 1 }; const K = { e, d: 7, prefR: 10, slot: 'A', vx: 0, vy: 0 };
    for (const h of bh.valueLate) h(W, m, K, o); assert.strictEqual(o.v, 0, '과녁 자리가 소금');
    m.x = 30; const o2 = { s: W.spells['돌 비'], v: 1, tx: e.x, ty: e.y, cost: 3, Tw: 1 }; for (const h of bh.valueLate) h(W, m, K, o2); assert.ok(o2.v > 1, '소금 위 과녁엔 곡사 × lobK');
  });
  ok('v2.30 스스로 다치지 않기 (selfSafe): 누구나 머리가 넘칠 수를 고르지 않고, 겨눠지면 큰 수를 안 모은다', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60, rules: { selfSafe: true, risk: true } });
    const m = A.addMage(W, A.mage({ tier: '평범', deck: '합법 최강' }), 0, 20, 30), e = A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 40, 30); A.stepWorld(W); A.brain.think(W, m);
    const bh = W._bh, K = { e, slot: 'A', aimed: false }; m.fat = 99; const o = { s: W.spells['불기둥'], v: 1, cost: 6, Tw: 0.8 }; for (const h of bh.valueLate) h(W, m, K, o); assert.strictEqual(o.v, 0, '머리 넘침');
    m.fat = 0; K.aimed = true; const o2 = { s: W.spells['대낙뢰'], v: 1, cost: 6, Tw: 1.5 }; for (const h of bh.valueLate) h(W, m, K, o2); assert.strictEqual(o2.v, 0, '겨눠진 동안 큰 수');
    K.aimed = false; const o3 = { s: W.spells['대낙뢰'], v: 1, cost: 6, Tw: 1.5 }; for (const h of bh.valueLate) h(W, m, K, o3); assert.ok(o3.v > 0);
  });
  ok('v2.30 막힘 풀기 (unstuck): 땅에 붙은 날기는 내려앉는다, 판 끝으론 걷지 않는다(달아나는 사람은 나간다)', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60, rules: { unstuck: true, flight: true } });
    const m = A.addMage(W, A.mage({ tier: '상위', deck: '광역' }), 0, 0.8, 30); A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 60, 30);
    m.fly = 1; m.flyWant = false; m.z = 1e-20; m.vz = 0; for (const h of W.H.mageStep) h(W, m); assert.ok(m.fly === 0 && m.z === 0);
    const st = require('../../src/rules/unstuck').brain(require('../../src/brain/util')).steer, K = { vx: -3, vy: 0, dodge: null }; st(W, m, K); assert.strictEqual(K.vx, 0);
    m.flee = 1; K.vx = -3; st(W, m, K); assert.strictEqual(K.vx, -3);
  });
  ok('v2.30 사기의 버팀 (resolve): 지휘가 있는 무리·보루 곁·멀쩡한 사람은 덜 무너진다', () => {
    const MO = require('../../src/rules/morale'), W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60, rules: { army: true, resolve: true } });
    const m = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷', tac: { volley: 4 } }), 0, 20, 30), q = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 0, 22, 30); A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 60, 30);
    const k = MO.api.resolveK, X = { wallsIn: C.wallsIn, hyp: C.hyp };
    const a = k(X, W, m), b = k(X, W, q); assert.ok(a < b, '지휘가 있는 무리 ' + a + ' < ' + b); assert.ok(b < 1, '멀쩡한 사람 × healthy: ' + b);
    q.hp = q.hpMax * 0.5; assert.strictEqual(k(X, W, q), 1, '다친 사람은 그대로');
  });
  ok('v2.30 갈라 쏘기 (crowdFire): 전투단의 투사체는 몫마다 가운데·왼쪽·오른쪽을 겨눈다 (곁에 둘 넘게 있을 때)', () => {
    const W = A.createWorld({ seed: 1, obstacles: [], width: 100, height: 60, rules: { crowdFire: true } }), sq = { squad: 1 };
    const ms = [0, 1, 2].map(i => A.addMage(W, A.mage({ tier: '상위', deck: '기본기', tac: sq }), 0, 20, 20 + i * 2)), e = A.addMage(W, A.mage({ tier: '평범', deck: '기본기' }), 1, 50, 22);
    const ys = ms.map(m => { const c = { s: W.spells['돌 압축탄'], tx: e.x, ty: e.y, tgt: e }; for (const h of W.H.track) h(W, m, c); return c.ty; });
    assert.strictEqual(new Set(ys.map(y => y.toFixed(2))).size, 3, ys.join(' '));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
