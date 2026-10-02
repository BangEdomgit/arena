'use strict';
/* 숨 결투장 시험: v2.15~: 수읽기·고리 장부·굳힘 내성·문턱 지표·손잡이·잔기술·끝내기
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2d.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.15 수읽기 (SPEC 39장): 줄인 상태·응수 0이면 메이트·큰 한 방은 메이트에만·정석·깊이 0이면 없다', () => {
    const PL = A.brain.plan, ST = PL.ST, SE = require('../../src/brain/plan/search');
    assert.ok(A.mage({ tier: '대마법사', skill: '전설' }).tac.read === 4 && A.mage({ tier: '대마법사', skill: '대가' }).tac.read === 3 && A.mage({ tier: '대마법사', skill: '중급' }).tac.read === 1 && !A.mage({ tier: '대마법사', skill: '초보' }).tac.read);
    const mk = (rules, deck) => { const W = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 150, rules: Object.assign({ flightCut: true, reflex: true, snap: true, pace: true, fineStep: true }, rules) });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: deck || '대마법사 수읽기' }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: deck || '대마법사 수읽기' }), 1, 104, 75);
      A.stepWorld(W); A.brain.think(W, m); return [W, m, e]; };
    // 줄인 상태: 땅에 선 전설은 구르기·막기·방패·벽을 가졌고, 굳으면 굳음이 풀릴 때까지 몸을 못 쓴다
    let [W, m, e] = mk(); e.z = 0; e.fly = 0; e.vz = 0; e.stam = 6; e.rollCd = 0; const S = ST.build(W, e, m, ST.newSide(), 0.5);
    assert.ok(S.has & 1 && S.has & 4 && S.has & 8 && S.has & 16 && S.av[0] === 0, S.has.toString(2));
    e.st.stun = 0.9; const S2 = ST.build(W, e, m, ST.newSide(), 0.5); assert.ok(S2.av[0] >= 0.9 && !ST.moveOK(S2, 0.5, 2) && ST.moveOK(S2, 1.6, 2));
    // 응수 0: 자원을 다 쓰고(간격), 피할 곳이 모두 막히고, 굳었으면 대낙뢰가 메이트다. 큰 한 방은 메이트일 때만 값이 있다
    for (let i = 0; i < 6; i++) S2.av[i] = Infinity; S2.has = 0; for (let j = 0; j < 9; j++) S2.blk[j] = Infinity; S2.up = 5;
    const lt = new Float64Array(16).fill(10); for (let i = 0; i < 8; i++) lt[8 + i] = 9; m.glu = 100; for (const n in m.cd) m.cd[n] = 0; m.cast = m.castB = null;
    const o = SE.read(W, m, e, S2, 2, lt); assert.ok(o.k >= 0 && o.mate && o.ans === 0 && o.nodes > 0, JSON.stringify(o));
    const K = { foes: [e], e, pl: { n: '', mate: false }, brk: -9, keep: 0, keepT: -9, jsL: null, jo: -1 }, big = { s: W.spells['대낙뢰'], n: '대낙뢰', v: 1 }, small = { s: W.spells['짧은 실'], n: '짧은 실', v: 1 };
    PL.value(W, m, K, big); assert.strictEqual(big.v, 0, '메이트가 아니면 큰 한 방 0'); K.pl = { n: '대낙뢰', mate: true, check: true, j: 0 }; big.v = 1; PL.value(W, m, K, big); assert.ok(big.v > 1);
    // 깊이 0이면 아무것도 안 한다
    m.tac.read = 0; small.v = 1; PL.value(W, m, K, small); assert.strictEqual(small.v, 1); m.tac.read = 4;
    // 정석: 아는 수준만, 첫 수를 두면 다음 수를 잇는다
    const JO = PL.JO, L = JO.LINES.find(x => x.name === '폭풍의 세 수'); assert.ok(L && JO.knows(m, L) && !JO.knows({ skill: '중급' }, L));
    const K2 = { e, jo: -1, joI: 0, joT: -9 }; JO.commit(W, m, K2, '번개 그물'); assert.ok(K2.jo >= 0 && K2.joI === 1); const nx = { n: '짧은 실', s: W.spells['짧은 실'], v: 0.5 }; JO.value(W, m, K2, nx);
      assert.ok(nx.v > 0.5);
    // 판 하나: 같은 씨앗이면 같고, 지표가 있다
    const Wt = require('../../metrics/watch'), run = () => { const v = A.sceneWorld(Object.assign({}, SCENES['v2-chess-legend'], { seed: 2, maxT: 15 })); while (!A.over(v)) { A.stepWorld(v);
        Wt.watch(v); } return v; };
    const a = run(), b = run(); assert.strictEqual(JSON.stringify(a.ms.map(q => [q.x, q.y, q.hp, q.mlog.chk, q.mlog.plN])), JSON.stringify(b.ms.map(q => [q.x, q.y, q.hp, q.mlog.chk, q.mlog.plN])));
    const lk = Wt.seen(a, a.ms[0]); assert.ok(a.ms[0].mlog.plN > 10 && lk['분당 체크'] >= 0 && lk['체크에 자원을 쓴 몫'] >= 0 && '메이트로 끝난 판' in lk && '그물에서 빠져나감' in lk);
  });
  ok('v2.22 고리 장부 (SPEC 46장): 켜도 판은 그대로, 고리 수 = 서클, 짓기·붙잡음·날기·빈을 읽어내고 쏜 고리는 튕긴다', () => {
    const sc = JSON.parse(JSON.stringify(SCENES['v2-tactics-legend'])); sc.seed = 4; sc.maxT = 25; const off = JSON.parse(JSON.stringify(sc)); off.rules.rings = false; sc.rules.rings = true;
    const a = A.runScene(off), W = A.sceneWorld(sc, { record: true }); let fly = 0, cast = 0, held = 0, shot = 0;   // 고리 장부는 녹화·지표를 잴 때만 돈다 (v2.23.1)
    while (!A.over(W)) { A.stepWorld(W); for (const m of W.ms) { const L = m.mlog.rings; if (!L || m.hp <= 0) continue; assert.strictEqual(L.r.length, m.circles);
      const ks = L.r.map(g => g.k); if (m.z >= 1 && m.fly !== 3) { assert.ok(ks.includes('날기'), '날면 날기 고리'); fly++; } if (m.cast) { assert.ok(L.r.some(g => g.id === 'A' && g.n === m.cast.s.n), '첫 칸');
        cast++; }
      if (m.castB && m.castB.hold && m.castB.t >= m.castB.T) { assert.ok(ks.includes('붙잡음')); held++; } if (L.r.some(g => g.fk === 'shot' && g.f === W.t)) shot++; } }
    assert.deepStrictEqual(W.ms.map(m => [m.hp, m.x, m.y]), a.ms.map(m => [m.hp, m.x, m.y]), '켜도 판이 같다');
    assert.ok(fly > 0 && cast > 0 && shot > 0, [fly, cast, held, shot].join(' '));
    const RG = require('../../src/rules/rings').api, o = RG.seen(W.ms[0]); let sum = 0; for (const k of RG.KEYS) sum += o['고리 시간 몫: ' + k];
    assert.ok(Math.abs(sum - 1) < 1e-9 && o['빈 고리 몫'] > 0 && o['빈 고리 몫'] < 1, '몫의 합 ' + sum);
    const W1 = A.createWorld({ seed: 1, obstacles: 0, rules: { rings: true, circles: false }, record: true }), m1 = A.addMage(W1, { tier: '대마법사', skill: '전설' }, 0, 10, 10);
      A.addMage(W1, { tier: '대마법사', skill: '전설' }, 1, 30, 10); A.stepWorld(W1); assert.strictEqual(m1.mlog.rings.r.length, 1, '서클 규칙이 꺼지면 고리 하나');
  });
  ok('v2.21 굳힘 내성 (SPEC 45장, v2.23 몸 털기 거둠): 다시 굳으면 × 0.5 → × 0.25, 굳음은 털 수 없고 굳은 상대의 응수는 없다', () => {
    const C = require('../../src/core'), PL = require('../../src/brain/plan'), mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules });
      const m = A.addMage(W, { tier: '대마법사', skill: '전설', book: [] }, 0, 40, 40), e = A.addMage(W, { tier: '대마법사', skill: '전설', book: ['짧은 실'] }, 1, 50, 40); return { W, m, e }; };
    const o = { stun: 1, kind: 'elec' }, run = rules => { const { W, m } = mk(rules), out = []; for (let i = 0; i < 3; i++) { m.st.stun = 0; C.eff(W, m, o); out.push(m.st.stun); W.t += 0.5;
        } return out; };
    assert.deepStrictEqual(run({}), [1, 1, 1], '끄면 그대로');
    const r = run({ stunRes: true }); assert.ok(Math.abs(r[0] - 1) < 1e-9 && Math.abs(r[1] - 0.5) < 1e-9 && Math.abs(r[2] - 0.25) < 1e-9, '내성 ' + r);
    { const { W, m } = mk({ stunRes: true }); C.eff(W, m, o); W.t += 3; m.st.stun = 0; C.eff(W, m, o); assert.ok(Math.abs(m.st.stun - 1) < 1e-9, '풀리고 1 s 넘으면 처음부터'); }
    { const { W, m } = mk({ stunRes: true, response: true }); C.eff(W, m, o); m.unbindReq = 1; A.stepWorld(W); assert.ok(m.st.stun > 0, '풀기는 굳음을 못 턴다'); }
    for (const rules of [{}, { stunRes: true }]) { const { W, m, e } = mk(rules); m.st.stun = 2; const c = { s: W.spells['짧은 실'], tgt: m, tx: m.x, ty: m.y, t: 0, T: 0.6 }, out = { n: 0, g: false };
      PL.ansSplit(W, m, e, c, out);
      assert.strictEqual(out.n, 0, '굳은 사람의 응수 ' + JSON.stringify(rules)); }
  });
  ok('v2.20.1 문턱 4판 지표 (SPEC 44장): 지켜보기는 판을 바꾸지 않고, 판을 끝낸 까닭·메이트·1 s 손실·침묵·흐름을 낸다', () => {
    const Wt = require('../../metrics/watch'), sc = JSON.parse(JSON.stringify(SCENES['v2-tactics-legend'])); sc.seed = 5;
    const a = A.runScene(JSON.parse(JSON.stringify(sc))), W = A.sceneWorld(sc); while (!A.over(W)) { A.stepWorld(W); Wt.watch(W); }
    assert.deepStrictEqual(W.ms.map(m => m.hp), a.ms.map(m => m.hp), '지켜봐도 판은 같다');
    const L = Wt.seen(W, W.ms[0]); assert.ok(['메이트', '견제가 쌓여', '떨어뜨림', '판이 끝을 강요함', '실수', '시간'].includes(L['판을 끝낸 까닭']), L['판을 끝낸 까닭']);
    for (const k of ['메이트로 끝난 판 (4판)', '1 s에 잃은 가장 큰 체력 몫 (4판)', '2 s 넘는 침묵 몫 (4판)', '흐름: 마지막 3분의 1에 잃은 몫', '큰 수를 지은 수', '풀린 공격', '알아챈 시전']) assert.ok(typeof L[k] === 'number', k);
    assert.ok(L['1 s에 잃은 가장 큰 체력 몫 (4판)'] <= L['1 s에 잃은 가장 큰 체력 몫'] + 1e-9 && L['2 s 넘는 침묵 몫 (4판)'] <= L['2 s 넘는 침묵 몫'] + 1e-9, '좁힌 정의는 넓지 않다');
  });
  ok('v2.19 손잡이 (SPEC 43장): 틀마다 붙는 곳, 2단계는 그대로, 에너지·비용, 방출에서 사본으로, 숨김은 안 보인다, 초보는 2단계만, 수를 센다', () => {
    const TU = require('../../src/rules/tune').api, W0 = A.createWorld({ seed: 1, obstacles: 0, rules: { tune: true } }), S = W0.spells;
    const a = TU.make(S['낙뢰'], 1.6, 2, 1.4, false); assert.ok(Math.abs(a.r - S['낙뢰'].r * 1.6) < 1e-9 && a.dmg === S['낙뢰'].dmg * 2 && Math.abs(a.delay - S['낙뢰'].delay / 1.4) < 1e-9, '구름');
    const t = TU.make(S['짧은 실'], 0.6, 4, 1, true); assert.ok(t.tw === 0.6 && Math.abs(t.E - S['짧은 실'].E * 4 * 0.8) < 1e-9, '실 (숨김은 위력 × 0.8)');
    const tr = TU.make(S['번개 지뢰'], 1, 1, 1.4, false); assert.ok(Math.abs(tr.tr.arm - 0.8 / 1.4) < 1e-9 && tr.tr.r === S['번개 지뢰'].tr.r, '함정');
    const two = TU.make(S['낙뢰'], 1, 1, 1, false); assert.ok(two.r === S['낙뢰'].r && two.dmg === S['낙뢰'].dmg && Math.abs(two.cost - S['낙뢰'].cost) < 1e-9, '2단계는 그대로');
    assert.ok(Math.abs(TU.energy(S['돌 압축탄'], 1, 1, 1.4) - 1.96) < 1e-9 && Math.abs(TU.energy(S['낙뢰'], 2.5, 4, 1.4) - 62.5) < 1e-9, '에너지: 던지기는 × 속도²');
    // 방출: 손잡이를 돌린 시전은 사본으로 푼다
    const W = A.createWorld({ seed: 1, obstacles: 0, width: 60, height: 40, rules: { tune: true, flight: false, saltRing: false } }), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 0, 20, 20), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 1, 30, 20);
    m.thinkT = e.thinkT = 1e9; A.stepWorld(W); A.release(W, m, { s: S['낙뢰'], tx: 30, ty: 20, tgt: e, t: 0, T: 0, tz: 1.6, tf: 2, tv: 1, hid: false, tk: 'z3f3v2' });
    assert.ok(Math.abs(W.areas[W.areas.length - 1].r - S['낙뢰'].r * 1.6 * A.sizeOf(m, S['낙뢰'])) < 1e-9, '사본의 반지름');
    // 숨김 (v2.20): 알아채지 못한 예비동작만 안 보인다. 흔적(드러남 1/3)이 남아 전설은 가까이서 잘 알아채고, 큰 수는 숨겨도 보인다
    const BH = require('../../src/brain/hooks').hooks(W);
      assert.ok(BH.hideCast.some(f => f(W, m, { unseen: true, s: S['낙뢰'], T: 1, t: 0 }, e)) && !BH.hideCast.some(f => f(W, m, { hid: true, unseen: false, s: S['낙뢰'], T: 1, t: 0 }, e)));
    const rate = (v, L, d) => { let k = 0; const q = { tac: { tune: L } }; for (let i = 0; i < 2000; i++) if (TU.notice(W, v, q, d)) k++; return k / 2000; };
    assert.ok(rate(0.2, 5, 5) > rate(0.2, 2, 5) + 0.1 && rate(0.2, 5, 5) > rate(0.2, 5, 40) + 0.1 && rate(2 / 3, 5, 5) > 0.8 && rate(1.2, 1, 40) === 1, '알아채기');
    assert.ok(TU.make(S['낙뢰'], 1, 1, 1, true).cost > TU.make(S['낙뢰'], 1, 1, 1, false).cost * 1.4, '숨김은 머리가 더 든다');
    // 판단: 초보는 손잡이를 돌리지 않는다, 전설은 판을 돌리면 돌린 수를 센다
    assert.ok(A.mage({ tier: '대마법사', skill: '초보' }).tac.tune === 1 && A.mage({ tier: '대마법사', skill: '전설' }).tac.tune === 5);
    const sc = JSON.parse(JSON.stringify(SCENES['v2-tactics-legend'])); sc.seed = 1; sc.maxT = 20; const w = A.sceneWorld(sc); while (!A.over(w)) A.stepWorld(w);
    const k = Object.keys(w.ms[0].mlog.tune || {}); assert.ok(k.length > 0 && k.every(x => /#z[1-4]f[1-4]v[1-3]h?$/.test(x)), k.join(','));
  });
  ok('v2.18 잔기술 (SPEC 42장): 맞는 종류만 막고, 0.05 s에 켜지고, 끈 뒤 0.3 s, 서클 하나·머리 열, 절연 막은 전기 굳힘도 줄인다, 끄면 일반 막기', () => {
    const PS = require('../../src/rules/passive').api, mk = on => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 60, height: 40, rules: { pace: true, passives: on, flight: false, saltRing: false } });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 0, 20, 20), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 1, 40, 20);
      m.thinkT = e.thinkT = 1e9; A.stepWorld(W); return [W, m, e]; };
    let [W, m] = mk(true); const hit = (k) => { m.hp = 1000; const H = W.H.hurtMod; let v = 10; for (const f of H) v = f(W, m, v, k, 'x'); return v; };
    const base = hit('elec'), bl = hit('blunt'); m.st.psv = 1; m.st.psvT = 0.01; assert.strictEqual(hit('elec'), base, '켜는 중엔 아직'); m.st.psvT = 0.06;
    assert.ok(Math.abs(hit('elec') - base * PS.P.k) < 1e-9 && Math.abs(hit('blunt') - bl) < 1e-9, '맞는 종류만');
    let g = 1; for (const f of W.H.effHold) g = f(W, m, { stun: 1, kind: 'elec' }, g); assert.ok(Math.abs(g - PS.P.stunK) < 1e-9, '절연 막: 전기 굳힘');
    const f0 = m.fat; for (let i = 0; i < 60; i++) A.stepWorld(W); assert.ok(m.fat > f0 || m.st.psv === 0, '머리 열');
    const U = require('../../src/brain/util'); require('../../src/brain/hooks').hooks(W); m.st.psv = 1; const c1 = U.circOf(W, m); m.st.psv = 0; assert.strictEqual(U.circOf(W, m), c1 + 1, '서클 하나');
    assert.ok(PS.psvOf(W.spells['짧은 실']) === 1 && PS.psvOf(W.spells['화산 기둥']) === 3 && PS.psvOf(W.spells['돌 비']) === 2, '피해 종류');
    // 줄인 상태: 켜진 절연 막은 실의 응수지만 불의 응수는 아니다
    const ST = A.brain.plan.ST, e = W.ms[1]; m.st.psv = 1; m.st.psvT = 1; const S = ST.build(W, m, e, ST.newSide(), 0.5); assert.ok(S.has & 4 && S.av[2] === 0 && S.pk === 1, S.pk);
    // 끄면 일반 막기(빠른 판)는 그대로, 켜면 쉰다
    [W, m] = mk(false); assert.ok(!W.mods.some(r => r.name === 'passive'));
  });
  ok('v2.17 수읽기의 끝내기 (SPEC 41장): 떨어지는 상대의 잠김·정해진 길, 큰 한 방은 끝내기에만, 세운 방패를 마주 본 실은 헛수, 거의 쓰러진 상대엔 메이트·체크만', () => {
    const PL = A.brain.plan, ST = PL.ST, SE = require('../../src/brain/plan/search');
    const W = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 150, rules: { flightCut: true, reflex: true, snap: true, pace: true, fineStep: true } });
    const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 결투' }), 1, 100, 75); A.stepWorld(W);
      require('../../src/brain/hooks').hooks(W); m.thinkT = e.thinkT = 1e9;
    // 굳은 채 떨어진다: 쿠션을 쓸 줄 알면(날기 끊기 2부터) 굳음이 풀릴 때까지, 모르면 땅에 닿아 추락 굳음이 끝날 때까지 몸을 못 쓴다
    e.z = 3; e.fly = 2; e.vz = 0; e.vx = 20; e.vy = 0; e.st.stun = 0.4; e.tac.flyCut = 3; let S = ST.build(W, e, m, ST.newSide(), 0.5);
      assert.ok(S.av[3] >= 0 && Math.abs(S.up - Math.max(0.4, PL.ST.P.takeoff)) < 1e-9, '쿠션: ' + S.up);
    e.tac.flyCut = 0; S = ST.build(W, e, m, ST.newSide(), 0.5); assert.ok(S.up > 0.78 + 1, '땅까지 + 추락 굳음: ' + S.up);
    // 정해진 길: 떨어지는 동안 20 m/s로 미끄러진다 (반만 앞선 겨냥보다 멀리)
    const q = ST.aim(W, e, 0.6); assert.ok(q.x > e.x + 9 && q.x < e.x + 12.5 && Math.abs(q.y - e.y) < 1e-9, q.x);
    e.z = 0; e.fly = 0; e.vx = 0; e.st.stun = 0; e.tac.flyCut = 3;
    // 큰 한 방은 상대 체력이 절반 아래일 때만 수 목록에 든다
    const lt = new Float64Array(16).fill(10); for (let i = 0; i < 8; i++) lt[8 + i] = 9; m.glu = 100; for (const n in m.cd) m.cd[n] = 0;
    const S2 = ST.build(W, e, m, ST.newSide(), 0.5); SE.read(W, m, e, S2, 1, lt); const has = () => SE.CN.slice(0, SE.nc()).includes('대낙뢰');
    assert.ok(!has(), '체력이 가득하면 큰 한 방 없음'); e.hp = e.hpMax * 0.4; SE.read(W, m, e, S2, 1, lt); assert.ok(has(), '절반 아래면 있음');
    // 세운 앞 방패가 나를 마주 보면 실은 헛수. 거의 쓰러진 상대에겐 메이트·체크가 아닌 공격을 쉰다
    const K = { foes: [e], e, pl: { n: '', mate: false }, brk: -9, keep: 0, keepT: -9, jsL: null, jo: -1 }, th = () => ({ s: W.spells['짧은 실'], n: '짧은 실', v: 1 });
    e.hp = e.hpMax; e.aim = 3.14159; e.buf.front = { t: 1.5 }; let o = th(); PL.value(W, m, K, o); assert.strictEqual(o.v, 0, '방패');
    e.aim = 0; o = th(); PL.value(W, m, K, o); assert.strictEqual(o.v, 1, '등 뒤에서는 그대로'); e.buf.front = null;
    e.hp = e.hpMax * 0.1; o = th(); PL.value(W, m, K, o); assert.strictEqual(o.v, 0, '끝내기'); K.pl = { n: '짧은 실', mate: false, check: true, line: false, j: 0 }; o = th(); PL.value(W, m, K, o);
      assert.ok(o.v > 1, '체크는 둔다');
  });
  ok('v2.24 작은 수 막기 (SPEC 47장, 시험 규칙): 끄면 그대로, 켜면 몸을 쓸 수 있는 대마법사의 한 방에서 cut을 빼고 틱·굳은 몸·약자는 그대로', () => {
    const C = require('../../src/core'), P = require('../../data/rules/chipGuard.json'), mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 40, 40), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 1, 50, 40); return { W, m, e }; };
    const hit = (rules, v, tick, stun) => { const { W, m, e } = mk(rules); if (stun) m.st.stun = 1; const h0 = m.hp; C.hurt(W, m, v, e, '짧은 실', 'fire', tick); return h0 - m.hp; };
    const off = hit({}, 3), on = hit({ chipGuard: true }, 3); assert.ok(off > 0 && on < off, '줄어든다 ' + off + ' ' + on);
    assert.strictEqual(hit({ chipGuard: true }, 3, true), hit({}, 3, true), '틱은 그대로'); assert.strictEqual(hit({ chipGuard: true }, 3, false, true), hit({}, 3, false, true), '굳은 몸은 그대로');
    assert.strictEqual(hit({ chipGuard: true }, 0.01), 0, '작은 수는 0까지'); assert.ok(P.cut > 0);
  });
  ok('총의 쏨 (v2.25, SPEC 48장): 총알은 떡대·잔기술이 줄이지 않고, 머스킷은 방아쇠 때의 과녁을 앞질러 겨눈다. 머리 아끼기는 끄면 그대로', () => {
    const C = require('../../src/core'), mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ profile: '결투장' }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 40, 40), e = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 1, 50, 40); return { W, m, e }; };
    const hit = rules => { const { W, m, e } = mk(rules); const h0 = m.hp; C.hurt(W, m, 60, e, '머스킷', 'blunt'); return h0 - m.hp; };
    assert.ok(hit({ gunfire: true }) > 2 * hit({}), '총알 ' + hit({}) + ' → ' + hit({ gunfire: true }));
    const { W, m, e } = mk({ gunfire: true }); m.vx = 6; m.vy = 0; const c = { s: W.spells['머스킷'], t: 0.2, T: 0.4, tgt: m, tx: m.x, ty: m.y };
    e.cast = c; for (const f of W.H.mageStep) f(W, e); for (const f of W.H.track) f(W, e, c);
    assert.ok(c.tx > m.x + 1, '앞질러 겨눈다 ' + c.tx + ' ' + m.x);
    assert.ok(A.rulesOf({ profile: '지금' }).gunfire && !A.rulesOf({}).gunfire && !A.rulesOf({}).calm);
  });
  ok('전투단 (v2.26, SPEC 49장): 끄면 칠판이 없고, 켜면 tac.squad 편에 역할·조·자리를 정하고 포위각을 잰다', () => {
    const SQ = require('../../src/rules/squad').api, CR = require('../../experiments/crowd'), X = require('../../src/core');
    const [enc] = SQ.encircle(X, 0, 0, [{ x: 1, y: 0 }, { x: -1, y: 0 }]); assert.ok(Math.abs(enc - 3.1416) < 0.01, '맞선 둘은 180° ' + enc);
    const [e2] = SQ.encircle(X, 0, 0, [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }]); assert.ok(Math.abs(e2 - 4.712) < 0.01, '넷은 270°');
    const run = rules => { const sc = CR.scene(10, 1, { squad: 1 }); sc.rules = Object.assign({}, sc.rules, rules); const W = A.sceneWorld(sc); for (let i = 0; i < 60; i++) A.stepWorld(W); return W; };
    assert.strictEqual(run({}).H.world.length, run({ squad: false }).H.world.length);
    const W = run({ squad: true }), b = SQ.stats(W).b[1];
    assert.ok(b.on && b.tgt === W.ms[0], '과녁은 대마법사'); assert.ok(b.k >= 2, '조 ' + b.k);
    const rs = [...b.role.values()]; assert.ok(rs.includes('eye') && rs.includes('bind') && rs.includes('strike'), rs.join(',')); assert.ok(rs.every(r => SQ.ROLES.includes(r)));
    assert.strictEqual(b.pt.size, 10, '모두 자리가 있다'); assert.ok([...b.pt.values()].every(p => p[0] === p[0] && p[1] === p[1]), 'NaN 없음');
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
