'use strict';
/* 숨 결투장 시험: v2.3~v2.6: 끊기·진지·두 겹·작전·스스로 죽지 않기
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2b.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.3 날기 끊기 (SPEC 27장): 급정지 5 g, 떨어지면 닿는 속도의 높이 × 4, 공기 쿠션이면 0, 끊은 동안 서클·출력이 풀린다, 옆 튀기, 끄면 없다', () => {
    const mk = (rules = {}) => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 200, height: 150, rules: Object.assign({ domain: false, saltRing: false, flightCut: true }, rules) });
      const q = A.addMage(W, Object.assign(A.mage({ tier: '대마법사', skill: '대가' }), { z: 8 }), 0, 50, 75), e = A.addMage(W, A.mage({}), 1, 190, 140); q.thinkT = e.thinkT = 1e9; q.fz = 8; q.fv = 40;
      q.mv.x = 1; return [W, q]; };
    const st = (W, n) => { for (let i = 0; i < n; i++) A.stepWorld(W); };
    let [W, q] = mk(); st(W, 90); const v0 = Math.hypot(q.vx, q.vy); q.cut.w = 1; st(W, 3); assert.ok(Math.abs(v0 - 5 * 9.8 * 0.1 - Math.hypot(q.vx, q.vy)) < 0.2 && q.flog.brake === 1, '급정지');
    [W, q] = mk(); st(W, 60); const s = W.spells['낙뢰'], p1 = A.power(W, q, s), z0 = q.z, h0 = q.hp; q.cut.w = 4; st(W, 1);
    const U = require('../../src/brain/util'); require('../../src/brain/hooks').hooks(W);
    assert.ok(q.fly === 3 && A.power(W, q, s) > p1 * 1.2 && U.circOf(W, q) === q.circles, '끊으면 출력·서클이 풀린다'); q.fly = 1; assert.ok(U.circOf(W, q) < q.circles); q.fly = 3;
    q.cut.z = -1; q.thinkT = 1e9; st(W, 60); assert.ok(q.fly === 0 && q.flog.crash === 1 && Math.abs(h0 - q.hp - z0 * 4) < z0 * 0.2 && q.st.stun > 0, '쿠션 없이 추락 ' + (h0 - q.hp) + ' / ' + z0 * 4);
    [W, q] = mk(); st(W, 60); const h1 = q.hp; q.cut.w = 5; q.cut.z = (2 * 5 * 9.8 * q.z) / (2 * 9 * 9.8) + 0.5; st(W, 60); assert.ok(q.hp === h1 && q.flog.cush === 1 && q.flog.crash === 0, '공기 쿠션');
    [W, q] = mk(); st(W, 60); q.fv = 0; q.mv.x = 0; st(W, 60); const x0 = q.x, y0 = q.y; q.cut.x = 0; q.cut.y = 1; q.cut.w = 2; st(W, 12); assert.ok(Math.hypot(q.x - x0, q.y - y0) > 2.5, '옆 튀기');
    [W, q] = mk({ flightCut: false }); st(W, 60); q.cut.w = 4; st(W, 5); assert.ok(q.fly === 1 && q.flog.cut === 0, '끄면 끊지 않는다');
    // 판단: 끊는 수가 있고, 같은 씨앗이면 같다
    const d = () => A.sceneWorld({ seed: 3, rules: { flightCut: true }, sides: [{ mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 운영' }] }, { mages: [{ tier: '대마법사', skill: '대가', deck: '대마법사 운영' }] }] });
    const run = () => { const w = d(); while (!A.over(w)) A.stepWorld(w); return w; }, a = run(), b = run();
    assert.ok(a.t === b.t && a.ms[0].hp === b.ms[0].hp && a.ms[0].flog.cut > 0 && a.ms[0].flog.cut === b.ms[0].flog.cut, '끊기 판단');
  });
  ok('v2.3 진지 (SPEC 27장): 함정 한도는 서클만큼, 옆 함정 연쇄, 하늘 덮개는 떠 있는 적만 굳힌다, 불·비가 적의 함정을 치운다, 짓기 단계', () => {
    const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 60, height: 40, rules: Object.assign({ domain: false, saltRing: false, fort: true, trapChain: true }, rules) });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 진지' }), 0, 10, 20), e = A.addMage(W, A.mage({ tier: '중간' }), 1, 40, 20), e2 = A.addMage(W, A.mage({ tier: '중간' }), 1, 42, 26);
      m.thinkT = e.thinkT = e2.thinkT = 1e9; return [W, m, e, e2]; };
    const trap = (W, m, x, y) => { const t = { x, y, s: W.spells['번개 지뢰'], src: m, arm: 0, seen: new Set([m.id]), pow: 1, r: 0.9, chain: 0 }; W.traps.push(t); return t; };
    let [W, m, e, e2] = mk(); assert.strictEqual(A.trapCap(W, m), m.circles); assert.strictEqual(A.trapCap(mk({ fort: false })[0], m), 3);
    // 연쇄: e가 밟은 함정 곁(2 m)의 함정이 0.2 s 뒤 터져 그 곁(밟지는 않은 1.1 m)의 e2를 친다
    e.x = 30; e.y = 20; e2.x = 30; e2.y = 23.1; trap(W, m, 30, 20); const t2 = trap(W, m, 30, 22); const h2 = e2.hp; for (let i = 0; i < 10; i++) A.stepWorld(W);
    assert.ok(t2.done && e2.hp < h2 && e2.st.stun > 0 && m.fort.chain === 1, '연쇄');
    [W, m, e, e2] = mk({ trapChain: false }); e.x = 30; e.y = 20; e2.x = 30; e2.y = 23.1; trap(W, m, 30, 20); const t3 = trap(W, m, 30, 22); for (let i = 0; i < 10; i++) A.stepWorld(W);
      assert.ok(!t3.done, '연쇄를 끄면 그대로');
    // 하늘 덮개: 떠 있는 적만 0.5 s마다 굳힌다
    [W, m, e, e2] = mk(); A.release(W, m, { s: W.spells['하늘 덮개'], tx: 40, ty: 20, tgt: e }); const z = W.zones.find(q => q.k === 'sky'); assert.ok(z && z.r > 10);
    e.x = z.x; e.y = z.y; e.z = 5; e.fly = 1; e2.x = z.x + 2; e2.y = z.y; for (let i = 0; i < 16; i++) A.stepWorld(W); assert.ok(e.fly === 2 && e2.st.stun <= 0 && m.fort.skyZap >= 1, '덮개');
    // 비·불이 적의 함정을 치운다
    [W, m, e, e2] = mk(); const t4 = trap(W, e, 20, 20), t5 = trap(W, e, 20, 30); A.release(W, m, { s: W.spells['비 뿌리기'], tx: 20, ty: 20, tgt: e }); for (const h of W.H.ignite) h(W, 20, 30, 1.5, m);
    assert.ok(t4.done && t5.done && m.fort.clear === 2, '치우기');
    // 짓기: 대마법사 대가가 진지를 세우고 벽·함정·덮개를 짓는다 (끄면 짓기 단계가 없다)
    const g = rules => { const w = A.sceneWorld({ seed: 2, rules, sides: [{ mages: [{ tier: '대마법사', skill: '대가', deck: '대마법사 진지' }] }, { mages: [{ tier: '대마법사', skill: '상급', deck: '대마법사 진지' }] }] });
      while (!A.over(w)) A.stepWorld(w); return w.ms[0]; };
    const on = g({ fort: true, trapChain: true }), off = g({});
    assert.ok(on.fort.founded >= 1 && on.fort.walls + on.fort.traps + on.fort.sky >= 3 && on.mlog.phase.build > 0, '짓기 ' + JSON.stringify(on.fort));
    assert.ok(!off.mlog.phase.build && !off.fort.founded && !off.book.includes('하늘 덮개'), '끄면 짓지 않는다');
  });
  ok('v2.4 두 겹의 두뇌·끊는 움직임·청사진·매 걸음 녹화 (SPEC 28장)', () => {
    const mk = (rules, tac) => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 60, height: 40, rules: Object.assign({ domain: false, saltRing: false, flight: false }, rules) });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 청사진', tac }), 0, 20, 20), e = A.addMage(W, A.mage({ tier: '중간' }), 1, 45, 20); m.thinkT = e.thinkT = 1e9; return [W, m, e];
      };
    const st = (W, n) => { for (let i = 0; i < n; i++) A.stepWorld(W); };
    // 끊는 움직임: 가속 한계(대마법사 2.5 g × 1.83, 거꾸로 밟으면 두 배) 안에서 곧장. 목표에서 딱 멎는다
    let [W, m] = mk({ snap: true }); const a = A.RULES.find(r => r.name === 'snap').api.aOf(W, m); assert.ok(Math.abs(a - 9.8 * 2.5 * (1 + 0.25 * Math.log2(10))) < 1e-6);
    m.mv.x = 1; st(W, 30); const v0 = m.vx; m.mv.x = -1; st(W, 1); assert.ok(Math.abs(v0 - m.vx - 2 * a * A.DT) < 1e-9, '거꾸로 밟으면 한 걸음에 2a·DT');   // 앞뒤로 줄이기는 2a, 옆은 a st(W, 20); assert.ok(Math.abs(m.vx + v0) < 1e-9, '목표에서 멎는다');
    [W, m] = mk({}); m.mv.x = 1; st(W, 30); const w0 = m.vx; m.mv.x = -1; st(W, 20); assert.ok(Math.abs(m.vx + w0) > 1e-3, '끄면 예전처럼 스르르');
    // 끊어 걷기: 모으는 동안 제 속도, 풀리기 0.12 s 전부터 멈춤
    [W, m] = mk({ snap: true }); m.mv.x = 1; st(W, 30); const v1 = m.vx; m.cast = { s: W.spells['낙뢰'], tgt: null, tx: 40, ty: 20, t: 0, T: 1, B: false }; st(W, 10);
      assert.ok(Math.abs(m.vx - v1) < 1e-9, '모으는 동안 걷는다'); st(W, 20); assert.ok(m.vx < v1 * 0.5, '풀리기 전에 멈춘다');
    // 반사 겹: 날아오는 투사체를 반응 지연(대가 0.1 s) 뒤 매 걸음 안에 피한다(판단 없이). 반사 겹이 없으면 그대로
    const shot = (tac) => { const [W2, m2, e2] = mk({ reflex: true }, tac);
      W2.proj.push({ x: 30, y: 20, vx: -20, vy: 0, z: 0, vz: 0, home: false, life: 2, s: W2.spells['돌 창'] || { n: '시험', el: '흙', m: 1 }, src: e2, pow: 1, rad: 0.1, t0: W2.t }); let n = 0;
      while (!(m2.roll > 0) && n < 15) { A.stepWorld(W2); n++; } A.stepWorld(W2); return [n, m2]; };   // 반응 시간은 다음 걸음에 센다
    const [n1, r1] = shot({}); assert.ok(n1 >= 3 && n1 <= 5 && r1.rx.dodge === 1 && r1.rx.rN === 1, '반사로 굴렀다 ' + n1); const [n2] = shot({ reflex: 0 });
      assert.strictEqual(n2, 15, '반사 겹이 없으면 판단 없이는 안 구른다');
    // 흔들기: 앞길(2 m 넘게 앞)을 겨누는 실이 0.3 s 안에 풀리고 빠르게 가면 멈칫 (걸음을 0으로 덮는다)
    [W, m] = mk({ reflex: true, snap: true }); const e = W.ms[1]; m.mv.x = 0; m.mv.y = 1; st(W, 20); e.cast = { s: W.spells['짧은 실'], tgt: m, tx: m.x, ty: m.y + 3, t: 0.8, T: 1, B: false }; st(W, 10);   // 0.1 s 뒤 멈칫, 4.6 g로 0.2 s
    assert.ok(m.rx.stop === 1 && m.rx.juke === 1 && Math.hypot(m.vx, m.vy) < 1, '멈칫 ' + Math.hypot(m.vx, m.vy));
    // 청사진: 반원 보루 = 흙벽 다섯을 다섯 갈래로 한꺼번에. 대마법사 약 1.7 s (+ 준비 0.3 s)
    [W, m] = mk({ blueprint: true, bulwark: true, endureK: 0 }); const BP = A.RULES.find(r => r.name === 'blueprint').api, b = BP.plan(W, m, '반원 보루', m.x, m.y, 1, 0);
    assert.ok(b.lanes === 5 && b.items.length === 5 && b.T > 1.5 && b.T < 2, '차례표 ' + b.lanes + ' ' + b.T);
    const f0 = m.fat; m.cast = { s: W.spells['청사진'], tgt: W.ms[1], tx: 40, ty: 20, t: 0, T: 0.3 + b.T, B: false, bp: b }; let k = 0; while (m.cast && k++ < 120) A.stepWorld(W);
    assert.ok(W.walls.filter(w => w.mk === m.id).length === 10 && m.fort.bpN === 1 && m.fort.bpItems === 5 && m.fat > f0, '다섯 벽 ' + W.walls.length);
    assert.ok(BP.can(W, m, BP.BPD.blueprints['덫길']) && !BP.can(W, m, BP.BPD.blueprints['하늘 막기']), '책에 맞는 청사진 (덮개는 진지 규칙이 켜져야)');
    // 매 걸음 녹화
    const rec = n => { const w = A.createWorld({ seed: 1, record: true, recEvery: n }); A.addMage(w, A.mage({}), 0, 5, 5); A.addMage(w, A.mage({}), 1, 30, 5);
      for (let i = 0; i < 60; i++) A.stepWorld(w); return w.rec.length; };
    assert.ok(rec(1) === 60 && rec(undefined) === 30, '녹화 간격');
    // 판단까지: 모두 켜면 반사·발놀림·청사진이 쓰이고, 같은 씨앗이면 같다
    const g = () => { const w = A.sceneWorld({ seed: 2, rules: { flightCut: true, fort: true, reflex: true, snap: true, blueprint: true }, sides: [{ mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }] }, { mages: [{ tier: '대마법사', skill: '대가', deck: '대마법사 청사진' }] }] });
      while (!A.over(w)) A.stepWorld(w); return w; };
    const x = g(), y = g();
      assert.ok(x.t === y.t && x.ms[0].hp === y.ms[0].hp && x.ms[0].rx.dodge === y.ms[0].rx.dodge && x.ms[0].rx.dodge + x.ms[0].rx.juke > 0 && x.ms[0].rx.flips > 0 && x.ms[0].fort.bpN + x.ms[1].fort.bpN > 0, '판단');
  });
  ok('v2.5 작전 겹과 각도 판단 (SPEC 29장): 대가부터 작전을 고르고, 숨은 상대엔 사냥(보이는 자리로), 다 잡은 상대엔 끝내기, 끄면 없다', () => {
    const mk = (rules, sa = '전설', sb = '대가') => { const W = A.createWorld({ seed: 1, obstacles: [{ x: 60, y: 40, r: 1.8 }], width: 120, height: 80, rules: Object.assign({ saltRing: false, tactics: true }, rules) });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: sa, deck: '대마법사 청사진' }), 0, 40, 40), e = A.addMage(W, A.mage({ tier: '대마법사', skill: sb, deck: '대마법사 청사진' }), 1, 62.5, 40); return [W, m, e];
      };
    const st = (W, n) => { for (let i = 0; i < n; i++) A.stepWorld(W); };
    // 숨은 상대 (바위 뒤): 사냥, 고른 자리에선 보인다
    let [W, m, e] = mk({}); m.z = e.z = 0; m.fly = e.fly = 0; m.thinkT = e.thinkT = 1e9; e.flyWant = m.flyWant = false; st(W, 1); A.brain.think(W, m);   // 적 목록은 걸음이 채운다
    assert.ok(A.blocked(W, m.x, m.y, e.x, e.y, 0) && m.op.cur === 'hunt', '사냥 ' + m.op.cur); assert.ok(!A.blocked(W, m.op.tx, m.op.ty, e.x, e.y, 0) && (m.op.kind & 4), '벗기는 자리');
    // 다 잡은 상대: 끝내기 (두 번째 칸도 공격)
    [W, m, e] = mk({}); m.thinkT = e.thinkT = 1e9; e.hp = e.hpMax * 0.2; e.x = 40; e.y = 60; st(W, 1); A.brain.think(W, m); assert.strictEqual(m.op.cur, 'finish'); assert.ok(m._k.pressB, '모든 칸');
    // 상급은 작전 겹이 없다, 규칙을 끄면 없다
    [W, m, e] = mk({}, '상급', '상급'); st(W, 60); assert.ok(!m.op.cur && !e.op.cur, '상급');
    [W, m, e] = mk({ tactics: false }); st(W, 60); assert.ok(!m.op.cur && !e.op.cur, '끄면');
    // 판 하나: 작전을 고르고 바꾸며, 같은 씨앗이면 같다
    const g = () => { const w = A.sceneWorld({ seed: 3, rules: { flightCut: true, fort: true, reflex: true, snap: true, blueprint: true, tactics: true }, sides: [{ mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }] }, { mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }] }] });
      while (!A.over(w)) A.stepWorld(w); return w; };
    const x = g(), y = g();
      assert.ok(x.t === y.t && x.ms[0].hp === y.ms[0].hp && x.ms[0].op.log.pick >= 1 && x.ms[0].op.log.ticks > 5 && JSON.stringify(x.ms[0].op.log) === JSON.stringify(y.ms[0].op.log), '판단');
    const L = A.look(x.ms[0], x.t); assert.ok('작전 바꾼 수' in L && '자리: 한쪽 사거리' in L);
  });
  ok('v2.6 스스로 죽지 않기·날카롭게 (SPEC 30장): 머리 넘침 막기, 소금 원의 벽, 땅이 안전한가, 막힌 직사 끊기, 걸음마다 지표', () => {
    const U = require('../../src/brain/util'), SR = require('../../src/rules/saltRing'), Wt = require('../../metrics/watch'), sharp = require('../../src/brain/techniques/sharp');
    const mk = (sa = '전설', sb = '전설', deck = '대마법사 청사진', obstacles) => { const W = A.createWorld({ seed: 1, width: 200, height: 150, obstacles: obstacles || [], rules: { flightCut: true, fort: true, blueprint: true } });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: sa, deck }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: sb, deck }), 1, 110, 75); A.stepWorld(W);
      require('../../src/brain/hooks').hooks(W); return [W, m, e]; };
    // 머리 넘침: 전설(파도 고르기)은 100에서 굳는다 → 97을 넘길 수는 버린다. 고른 파도·탄 파도는 165까지. 대가(고르지 않음)도 파도에 오를 수는 버린다
    let [W, m, e] = mk(); m.z = 0; m.fly = 0; m.fat = 90; assert.ok(U.heatOver(W, m, 7, 0, 1) && !U.heatOver(W, m, 3, 0, 1), '전설 넘침');
    m.waveWant = true; assert.ok(!U.heatOver(W, m, 7, 0, 1)); m.waveWant = false; m.wave = 1; m.fat = 150; assert.ok(!U.heatOver(W, m, 7, 0, 1) && U.heatOver(W, m, 12, 0, 1), '탄 파도는 165까지');
    [W, m, e] = mk('대가', '대가'); m.fat = 95; m.z = 0; m.fly = 0; assert.ok(U.heatOver(W, m, 3, 0, 1), '대가는 고르지 않은 파도에 오르지 않는다');
    // 땅이 안전한가: 적의 책에 함정·안 보이는 구름·벽 밀기·가두기가 있으면 아니다
    W.rules.bluntK = 0; assert.ok(!U.groundSafe(W, m)); W.rules.bluntK = 2.3; assert.ok(U.groundSafe(W, m), '마법의 부딪힘에 비율 감쇠가 있으면(v2.7) 함정은 한 방이 아니다'); W.rules.bluntK = 0;
      [W, m, e] = mk('전설', '전설', '기본기'); W.rules.bluntK = 0; assert.ok(U.groundSafe(W, m) === !U.deck(e, W.spells).ground);
    // 소금 원의 벽: 원이 반지름 20 m일 때 선 가까이에서 바깥으로 가려는 걸음은 지워지고 안으로 돈다
    [W, m, e] = mk(); W.t = 15 + 60 * (125.0 - 20) / (125.0 - 4); W.rules.saltRing = true; m.x = 100 + 18.5; m.y = 75; m.vx = 6; m.vy = 0; m.fly = 0; m.z = 0;
    const K = { vx: 2, vy: 0.5, foes: [e], e }, B = SR.brain(U); B.bound(W, m, K); assert.ok(K.vx < 0, '안으로 ' + K.vx);
    const o = { v: 8, cd: 1, skip: false, dx: 1, dy: 0 }; SR.engine({ hurt() {}, DT: 1 / 30 }).roll(W, m, o); assert.ok(o.dx < 0 || o.skip, '선 밖으로 구르지 않는다');
    m.tac.survive = false; const K2 = { vx: 2, vy: 0.5 }; B.bound(W, m, K2); assert.strictEqual(K2.vx, 2, '기술이 없으면 그대로');
    // 막힌 직사 끊기: 바위 뒤 과녁에 실을 모으면 끊고 당을 돌려받는다
    [W, m, e] = mk('대가', '대가', '대마법사 청사진', [{ x: 100, y: 75, r: 2 }]); m.z = e.z = 0; const g0 = m.glu;
    m.cast = { s: W.spells['체인'], tgt: e, tx: e.x, ty: e.y, t: 0, T: 0.4, cost: 4 }; sharp.losCancel(W, m, { los: false, e }); assert.ok(!m.cast && m.glu > g0 && m.mlog.losCut === 1, '끊기');
    // 판 하나 (v2.6의 규칙: 버티기·마법의 부딪힘 감쇠 없이): 걸음마다 지표, 같은 씨앗이면 같다. 전설끼리 추락 피해가 기술이 없을 때보다 적다
    const sc = SCENES['v2-tactics-legend'], run = tac => { const x = JSON.parse(JSON.stringify(sc)); x.seed = 2; x.rules = Object.assign({}, x.rules, { endureK: 0, bluntK: 0, tune: false });
      for (const sd of x.sides) { sd.mages[0].deck = '대마법사 청사진'; if (tac) sd.mages[0].tac = tac; } const w = A.sceneWorld(x); while (!A.over(w)) { A.stepWorld(w); Wt.watch(w);
        } return w.ms.map(q => Wt.seen(w, q)); };   // 덱은 v2.6의 것 (결투장 장면은 v2.16부터 '대마법사 결투')
    const a = run({ read: 0 }), b = run({ read: 0 }), c = run({ survive: false, sharp: false, read: 0 });   // 수읽기(v2.15)는 끄고 이 둘만 견준다
    assert.deepStrictEqual(a, b); for (const k of ['스스로 입은 몫', '사거리 안 짓는 몫', '사거리 안 두 칸 몫', '쓸모 있는 벽 몫', '빈틈 찌른 몫', '폭주', '막힌 직사 몫']) assert.ok(k in a[0], k);
    const fall = r => r.reduce((x, q) => x + q['받은 피해'] * q['추락 몫'], 0), over = r => r.reduce((x, q) => x + q['폭주'], 0);
      assert.ok(fall(a) < fall(c) && over(a) < over(c), '추락 ' + fall(a) + ' < ' + fall(c) + ', 폭주 ' + over(a) + ' < ' + over(c));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
