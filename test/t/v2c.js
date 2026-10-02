'use strict';
/* 숨 결투장 시험: v2.7~v2.14: 버티기·붙잡기·몰아치기·명중 가망·숨·공격 방식·빠른 판
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2c.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.7 마법의 부딪힘 감쇠·버티기·몰아치기 (SPEC 31장): 돌 비가 대마법사를 한 방에 죽이지 않고, 중간까지는 회복이 그대로, 판단이 잦아도 박자 흔들기는 초당 같다', () => {
    const BD = require('../../src/rules/body').engine(), hit = (rules, name, tier = '대마법사') => { const W = A.createWorld({ seed: 1, obstacles: 0, rules });
      const m = A.addMage(W, A.mage({ tier }), 0, 10, 10); return BD.hurtMod(W, m, 783, 'blunt', name); };
    // 상위의 돌 비 한 방(14 × 5^2.5 = 783): 굳은 살만이면 771, 감쇠가 있으면 ÷ 10^2.3. 총(마법이 아님)·벽 밀기는 굳은 살만
    assert.ok(Math.abs(hit({ bluntK: 0 }, '돌 비') - 771) < 1e-6); assert.ok(Math.abs(hit({}, '돌 비') - 771 / Math.pow(10, 2.3)) < 1e-6, '감쇠');
    assert.ok(Math.abs(hit({}, '벽 밀기') - 771) < 1e-6 && Math.abs(hit({}, '머스킷') - 771) < 1e-6, '총·벽 밀기는 그대로'); assert.strictEqual(hit({}, '돌 비', '평범'), 783, '평범(선명도 1)은 그대로');
    // 버티기: 평범·중간 × 1, 대마법사 × (10/2.5)^endureK (머리·당 모두)
    const rec = (tier, rules) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false }, rules) }); const m = A.addMage(W, A.mage({ tier }), 0, 10, 10);
      A.addMage(W, A.mage({ tier: '평범' }), 1, 300, 10); m.fat = 50; m.glu = 10; m.thinkT = 1e9; W.ms[1].thinkT = 1e9; A.stepWorld(W); return [50 - m.fat, m.glu - 10]; };
    for (const t of ['평범', '중간']) assert.deepStrictEqual(rec(t, {}), rec(t, { endureK: 0 }), t + '는 그대로');
    const [f1, g1] = rec('대마법사', {}), [f0, g0] = rec('대마법사', { endureK: 0 }), k = Math.pow(4, A.DEFAULT_RULES.endureK);
      assert.ok(Math.abs(f1 / f0 - k) < 1e-6 && Math.abs(g1 / g0 - k) < 1e-6, '대마법사 × ' + k);
    // 대마법사 둘 대 상위 여섯(상위는 돌 비가 든 덱): 대마법사가 이긴다
    const sc = SCENES['v2-archmage-2v6']; for (let s2 = 1; s2 <= 4; s2++) assert.strictEqual(A.runScene(Object.assign({}, sc, { seed: s2 })).winner, 0, '씨앗 ' + s2);
    // 박자 흔들기: 날카롭게(대가부터)는 한 번의 확률이 판단 간격에 비례한다(0.13 s에 20%), 몰아칠 때(과녁이 굳음)는 쉬지 않는다
    const tempo = require('../../src/brain/techniques/tempo'), W = A.createWorld({ seed: 1 }), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 10, 10), e = A.addMage(W, A.mage({ tier: '대마법사' }), 1, 30, 10);
    let n = 0; for (let i = 0; i < 4000; i++) { m.hold = 0; if (tempo.hold(W, m, { T: m.tac, slot: 'A', aimed: false, e })) n++;
      } assert.ok(Math.abs(n / 4000 - 0.2 * m.dec / 0.13) < 0.02, '초당 ' + n / 4000);
    e.st.stun = 1; n = 0; for (let i = 0; i < 400; i++) { m.hold = 0; if (tempo.hold(W, m, { T: m.tac, slot: 'A', aimed: false, e })) n++; } assert.strictEqual(n, 0, '굳은 과녁엔 쉬지 않는다');
  });
  ok('v2.8 붙잡아 둔 설계·명중 가망·방패의 때 (SPEC 32장): 다 지은 두 번째 칸을 붙잡았다가 틈에 풀고, 구를 수 있는 과녁엔 가망이 낮고, 구름엔 방패를 들지 않는다', () => {
    const sharp = require('../../src/brain/techniques/sharp'), U = require('../../src/brain/util');
    const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false, saltRing: false }, rules) });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }), 0, 10, 10), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }), 1, 25, 10);
      m.thinkT = e.thinkT = 1e9; return [W, m, e]; };
    // 엔진: 붙잡은 두 번째 칸은 다 지어도 풀리지 않고 머리가 든다. go면 풀린다. 규칙을 끄면 바로 풀린다
    let [W, m, e] = mk({}); const s = W.spells['짧은 실'], c = { s, tgt: e, tx: e.x, ty: e.y, t: 0, T: 0.2, B: true, cost: 3, hold: true, go: false, holdUntil: 3 };
    m.castB = c; m.fat = 10; for (let i = 0; i < 30; i++) A.stepWorld(W); assert.ok(m.castB === c && m.fat > 10 - 30 * A.DT * 4 * 3.1, '붙잡는다'); c.go = true; A.stepWorld(W);
      assert.ok(m.castB !== c && m.log.casts['짧은 실'] === 1, 'go면 푼다');
    [W, m, e] = mk({ hold: false }); m.castB = Object.assign({}, c, { go: false, t: 0 }); for (let i = 0; i < 10; i++) A.stepWorld(W); assert.strictEqual(m.log.casts['짧은 실'], 1, '끄면 바로 푼다');
    // 명중 가망: 구를 수 있는 과녁 < 굳은 과녁, 판 중에 빗나간 수가 쌓이면 내려간다
    [W, m, e] = mk({}); const K = { e, d: 15 }, o = { n: '짧은 실', he: 0.35 }; e.rollCd = 0; e.stam = 6; e.fly = 0; const free = sharp.chance(W, m, K, o, 0.3); e.st.stun = 1;
      const pin = sharp.chance(W, m, K, o, 0.3); assert.ok(pin > 3 * free, pin + ' > ' + free);
    e.st.stun = 0; m.log.casts['짧은 실'] = 10; m.log.hits['짧은 실'] = 0; assert.ok(sharp.chance(W, m, K, o, 0.3) < free / 3, '빗나감이 쌓이면');
    // 방패의 때: 0.4 s 안에 닿는 실에만. 구름·붙잡아 둔 수에는 아니다
    const th = (st, T, t, hold) => sharp.threatSoon(W, m, { threat: { s: W.spells[st], T, t, hold, go: false }, d: 15 });
    assert.ok(th('짧은 실', 0.25, 0.1) && !th('짧은 실', 1, 0.1) && !th('번개 그물', 0.3, 0.29) && !th('짧은 실', 0.2, 0.3, true));
    // 판 하나: 붙잡았다가 푼 수가 있고 같은 씨앗이면 같다
    const sc = SCENES['v2-tactics-legend'], g = () => { const w = A.sceneWorld(Object.assign({}, sc, { seed: 2 })); while (!A.over(w)) A.stepWorld(w); return w; }, x = g(), y = g();
    assert.ok(x.t === y.t && x.ms[0].mlog.held + x.ms[1].mlog.held > 0 && x.ms[0].mlog.held === y.ms[0].mlog.held, '붙잡아 푼 수 ' + x.ms[0].mlog.held);
  });
  ok('v2.9 몰아치기·빈 칸의 준비·벽 자리·성적표 (SPEC 33장): 틈엔 문턱이 낮고, 기다리는 동안 벽·함정, 세운 벽에 머문다, 무리 기준, 성적표', () => {
    const sharp = require('../../src/brain/techniques/sharp'), P = sharp.P;
    const W = A.createWorld({ seed: 1, obstacles: 0, rules: { flight: false, saltRing: false } }), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }), 0, 50, 50), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }), 1, 70, 50);
    const K = { e, d: 20, waitT: -9, wallT: -9, los: true, ux: 1, uy: 0 };   m.tac.wallLos = 0;   // 벽 조건(v2.10)은 따로 본다
    // 몰아칠 틈: 굳음·과열이 다가옴·끝내기
    assert.ok(!sharp.storm(W, m, K)); e.fat = P.hotF + 1; assert.ok(sharp.storm(W, m, K)); e.fat = 0; e.st.stun = 0.5; assert.ok(sharp.storm(W, m, K)); e.st.stun = 0;
    // 기다리는 동안: 문턱에 막힌 뒤 0.5 s 안이면 벽·함정에 값 (둘 다 낮을 때 벽)
    const o = { s: W.spells['석회 기둥'], v: 0, he: 0.35 }; sharp.value(W, m, K, o); assert.strictEqual(o.v, 0, '기다리지 않으면 그대로');
    K.waitT = W.t; sharp.value(W, m, K, o); assert.ok(o.v >= P.prepMin, '기다리는 동안 벽 ' + o.v);
    const tr = { s: W.spells['숨 덫'], v: 0, he: 0.35 }; sharp.value(W, m, K, tr); assert.ok(tr.v > 0 && tr.tx > m.x, '함정은 적 쪽 3 m');
    m.fat = P.prepFat + 1; const o2 = { s: W.spells['석회 기둥'], v: 0, he: 0.35 }; sharp.value(W, m, K, o2); assert.strictEqual(o2.v, 0, '머리를 남겨 둔다'); m.fat = 0;
    // 벽 자리: 세운 지 10 s 안, 제 벽이 15 m 안이면 머문다. 들어갈 땐 떠난다
    K.wallT = W.t - 5; assert.ok(!sharp.behind(W, m, K), '벽이 없으면');
    A.addWall(W, { x: 53, y: 50, r: 0.6, hp: 100, t: 30, own: 0, mk: m.id }); assert.ok(sharp.behind(W, m, K), '제 벽 곁');
    m.phase = 'in'; assert.ok(!sharp.behind(W, m, K), '들어갈 땐 떠난다'); m.phase = 'probe'; K.wallT = W.t - 11; assert.ok(!sharp.behind(W, m, K), '10 s 뒤');
    // 상위 무리 기준: 대가·상급 반반, 덱 셋을 돌려, 결투장 들판
    const CR = require('../../experiments/crowd'), sc = CR.scene(6, 1), cm = sc.sides[1].mages;
    assert.ok(sc.width === 200 && sc.height === 150 && A.rulesOf(sc.rules).tactics && cm.filter(x => x.skill === '대가').length === 3 && new Set(cm.map(x => x.deck)).size === 3);
    // 걸음마다 지표의 새 칸, 성적표
    const Wt = require('../../metrics/watch'), w = A.sceneWorld(Object.assign({}, SCENES['v2-tactics-legend'], { seed: 1, maxT: 20 })); while (!A.over(w)) { A.stepWorld(w); Wt.watch(w); }
    const lk = Wt.seen(w, w.ms[0]); for (const k of ['짓지 않는 몫', '들어가기 몫', '끝내기 몫', '제 벽 곁 몫', '벽 뒤에서 쏜 몫']) assert.ok(lk[k] >= 0 && lk[k] <= 1, k);
    const R = require('../../experiments/report'), md = R.render({ versions: { '2.10.0': { date: 'd', N: 1, crowd: 1, o: { '공격 명중률': 0.25, '무리:6': [1, 0.5] } }, '2.9.0': { date: 'd', N: 1, crowd: 1, o: {} } } });
    assert.ok(md.indexOf('v2.9.0 | v2.10.0') > 0 && md.includes('| 25% |') && md.includes('100% · 50%'), '성적표: 버전 차례');
  });
  ok('v2.10 명중 가망은 전설만·시야 공격에만 벽·벽이 실을 끊는다·협공 (SPEC 34장)', () => {
    const sharp = require('../../src/brain/techniques/sharp'), SW = require('../../src/brain/techniques/swarm');
    assert.ok(A.mage({ tier: '대마법사', skill: '전설' }).tac.aim && !A.mage({ tier: '대마법사', skill: '대가' }).tac.aim, '명중 가망은 전설');
    // 시야 공격 몫: 덱의 직사 몫에서 시작해 판 중에 준 피해로
    const W = A.createWorld({ seed: 1, obstacles: 0, rules: { flight: false, saltRing: false } }), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 청사진' }), 0, 50, 50), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 청사진' }), 1, 70, 50);
    const s0 = sharp.losShare(W, e); assert.ok(s0 > 0.2 && s0 < 0.5, '덱 ' + s0); e.log.dealt['짧은 실'] = 300; assert.ok(sharp.losShare(W, e) > 0.8, '실로 맞았다');
    e.log.dealt['짧은 실'] = 0; e.log.dealt['낙뢰'] = 300; const K = { e, d: 20, waitT: -9, wallT: -9, los: true, ux: 1, uy: 0 }; const o = { s: W.spells['석회 기둥'], v: 0.5, he: 0.35 };
      sharp.value(W, m, K, o); assert.strictEqual(o.v, 0, '구름이 주력이면 벽을 세우지 않는다');
    const g = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 1, 90, 50); assert.ok(sharp.losShare(W, g) > 0.9, '총은 시야 공격');
    // 벽이 실을 끊는다: 둘 다 땅이면 막고, 한쪽이 2 m 넘게 떠 있으면 넘는다
    const shot = z => { const W2 = A.createWorld({ seed: 1, obstacles: 0, rules: { flight: false, saltRing: false, evade: false } }), a = A.addMage(W2, A.mage({ tier: '대마법사', skill: '대가' }), 0, 10, 10), b = A.addMage(W2, A.mage({ tier: '대마법사', skill: '대가' }), 1, 25, 10);
      a.thinkT = b.thinkT = 1e9; b.z = z; b.autoDodge = false;
      A.addWall(W2, { x: 17, y: 10, r: 0.7, hp: 100, t: 30, own: 1 }); a.cast = { s: W2.spells['짧은 실'], tgt: b, tx: b.x, ty: b.y, t: 0, T: 0.1, cost: 0 }; for (let i = 0; i < 8; i++) A.stepWorld(W2);
        return a.log.hits['짧은 실'] || 0; };
    assert.strictEqual(shot(0), 0, '벽이 실을 끊는다'); assert.strictEqual(shot(3), 1, '떠 있으면 넘는다');
    // 협공: 상위는 대마법사(선명도 두 배)에게 무리 싸움, 둘레를 나눠 선다
    const spread1 = (tac, sd) => { const w = A.sceneWorld(require('../../experiments/crowd').scene(14, sd, tac)); let res = 0, rn = 0, on = null;
      const N = Math.round(20 / w.dt), ev = Math.round(0.5 / w.dt), t5 = Math.round(5 / w.dt);   // 걸음이 아니라 초로 (잘게 걷기면 걸음이 두 배)
      for (let i = 0; i < N; i++) { A.stepWorld(w); if (i === t5) on = w.ms.slice(1).every(q => q.hp <= 0 || SW.on(w, q, w.ms[0])); if (i % ev) continue;
        const a0 = w.ms[0], sp = w.ms.slice(1).filter(q => q.hp > 0); if (sp.length < 3) continue; let sx = 0, sy = 0; for (const q of sp) { const d = Math.hypot(q.x - a0.x, q.y - a0.y);
          sx += (q.x - a0.x) / d; sy += (q.y - a0.y) / d; } res += Math.hypot(sx, sy) / sp.length; rn++; }
      return [on, res / rn]; }, spread = tac => { const a = spread1(tac, 1), b = spread1(tac, 2); return [a[0] && b[0], (a[1] + b[1]) / 2]; };   // 두 판 평균 (한 판은 대마법사의 움직임에 흔들린다)
    const [on, r1] = spread(null), [, r0] = spread({ swarmR: 0 }); assert.ok(r1 < 0.9 && r1 < r0 - 0.03, '둘레로 흩어진다 (20 s 평균, 동료 방향의 합) ' + r1.toFixed(2) + ' / 끄면 ' + r0.toFixed(2));
    assert.ok(on, '협공이 켜진다');
    // 벽이 없었다면 맞았을 피해: 지표가 있다
    const Wt = require('../../metrics/watch'), v = A.sceneWorld(Object.assign({}, SCENES['v2-tactics-legend'], { seed: 1, maxT: 15 })); while (!A.over(v)) { A.stepWorld(v); Wt.watch(v);
      } const lk = Wt.seen(v, v.ms[0]); assert.ok(lk['벽이 없었다면 맞았을 피해'] >= 0 && lk['그중 맞은 몫'] >= 0);
  });
  ok('v2.11 당 회복 3 g/s·숨 (SPEC 35장): 마시는 0.5 s는 못 짓고 느리다, 끝나면 당 +80·머리 −30·기력 +3, 판마다 세 번, 판단 수준마다 문턱', () => {
    const mk = (skill, rules) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false, saltRing: false }, rules) });
      const m = A.addMage(W, A.mage({ tier: '상위', skill, deck: '합법 최강' }), 0, 10, 10), e = A.addMage(W, A.mage({ tier: '상위', skill: '상급', deck: '합법 최강' }), 1, 30, 10); e.thinkT = m.thinkT = 1e9;
      A.stepWorld(W); return [W, m, e]; };
    // 당 회복: 기본 3 (상위는 버티기 × 1.74), 1.2로 하면 예전
    let [W, m] = mk('상급'); m.thinkT = 1e9; m.glu = 0; A.stepWorld(W); const g3 = m.glu; [W, m] = mk('상급', { gluRegen: 1.2 }); m.thinkT = 1e9; m.glu = 0; A.stepWorld(W);
      assert.ok(Math.abs(g3 / m.glu - 2.5) < 1e-6, '2.5배');
    // 숨: 남은 몫(머리·당 가운데 적은 쪽)이 문턱 아래면 마신다. 마시는 동안은 새 마법을 고르지 않고, 끝나면 채운다
    [W, m] = mk('상급'); m.fat = 80; m.glu = 20; m.stam = 1; m.thinkT = 0; A.brain.think(W, m); assert.ok(m.st.breath > 0 && m.mlog.breath === 1 && !m.cast, '마신다');
    for (let i = 0; i < 6; i++) { m.thinkT = 0; A.stepWorld(W); } assert.ok(m.st.breath > 0 && !m.cast, '마시는 동안 못 짓는다');
    const f0 = m.fat; for (let i = 0; i < 12; i++) A.stepWorld(W); assert.ok(m.st.breath === 0 && m.glu > 95 && m.fat < f0 - 25 && m.stam > 3.5, '채운다 ' + m.glu.toFixed(0) + ' ' + m.fat.toFixed(0));
    m.mlog.breath = 3; m.fat = 99; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0), '세 번까지');
    // 판단 수준: 상급은 위협이 있으면 참는다, 초보는 넘치기 직전이면 마신다(문턱 5%)
    [W, m] = mk('상급'); const e = W.ms[1]; e.cast = { s: W.spells['짧은 실'], tgt: m, tx: m.x, ty: m.y, t: 0, T: 1 }; m.fat = 80; m.thinkT = 0; A.brain.think(W, m);
      assert.ok(!(m.st.breath > 0), '위협이면 참는다');
    [W, m] = mk('초보'); m.fat = 90; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0), '초보는 90에선 아니다'); m.fat = 96; m.thinkT = 0; A.brain.think(W, m);
      assert.ok(m.st.breath > 0, '초보는 넘치기 직전');
    // 대가: 압박·끝내기를 고른 직후 남은 몫 45% 아래면 미리
    [W, m] = mk('대가'); m.fat = 60; m.op.cur = 'press'; m.op.t0 = W.t; m.thinkT = 0; A.brain.think(W, m); assert.ok(m.st.breath > 0, '몰아치기 직전에 미리');
    // 끄면 없다, 1.x는 1.2·없음
    [W, m] = mk('상급', { breath: false }); m.fat = 95; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0));
      assert.ok(A.V1_RULES.gluRegen === 1.2 && A.V1_RULES.breath === false && A.DEFAULT_RULES.breath === true && A.DEFAULT_RULES.gluRegen === 3);
  });
  ok('v2.12 공격 방식 (SPEC 36장): 판단 단계마다 방식을 고르고, 확정 순간·갈 곳 계산·시전에 방식 기록', () => {
    const MD = require('../../src/brain/techniques/mode');
    const mk = (skill, ex) => { const W = A.createWorld({ seed: 1, obstacles: [], rules: { flight: false, saltRing: false } });
      const m = A.addMage(W, A.mage({ tier: '상위', skill, deck: '합법 최강' }), 0, 10, 15), e = A.addMage(W, A.mage({ tier: '상위', skill: '상급', deck: '합법 최강' }), 1, ex || 22, 15); e.thinkT = m.thinkT = 1e9;
      A.stepWorld(W); return [W, m, e]; };
    assert.ok(A.mage({ tier: '평범', skill: '초보' }).tac.mode === 1 && A.mage({ tier: '평범', skill: '전설' }).tac.mode === 5 && !A.mage({ tier: '평범' }).tac.mode);
    // 초보는 반복, 중급은 굳은 상대에만 확정타
    let [W, m, e] = mk('초보'); m.thinkT = 0; A.brain.think(W, m); assert.strictEqual(m._k.mode, 'repeat');
    [W, m, e] = mk('중급'); m.thinkT = 0; A.brain.think(W, m); assert.strictEqual(m._k.mode, ''); e.st.stun = 1; m.cast = m.castB = null; m.thinkT = 0; A.brain.think(W, m);
      assert.strictEqual(m._k.mode, 'sure', '굳은 상대');
    // 확정 순간: 굳음·숨 마시는 중·기력 바닥(땅)
    const K = { e, los: true }; e.st.stun = 0; assert.strictEqual(MD.sureWin(W, m, K), 0); e.st.breath = 0.4; assert.ok(Math.abs(MD.sureWin(W, m, K) - 0.4) < 1e-9); e.st.breath = 0; e.stam = 0.7;
      assert.ok(MD.sureWin(W, m, K) > 0.9, '기력 바닥'); e.stam = 6;
    // 대가: 갈 곳 계산 — 바위가 막은 곳은 지운다
    [W, m, e] = mk('대가'); const K2 = Object.assign({}, m._k || {}, { e, ux: 1, uy: 0, covPts: null }); e.vx = e.vy = 0; e.rollCd = 0; e.stam = 6;
    MD.reach(W, m, K2, true); const n0 = K2.covN; W.obs.push({ x: 22, y: 12.5, r: 1 }); const cut = MD.reach(W, m, K2, true);
      assert.ok(n0 >= 4 && K2.covN === n0 - 1 && cut > 0, '막힌 곳 ' + n0 + ' → ' + K2.covN);
    // 판 하나: 시전에 방식이 적히고, 지표가 있다
    const Wt = require('../../metrics/watch'), v = A.sceneWorld(Object.assign({}, SCENES['v2-tactics-legend'], { seed: 1, maxT: 30 })); let marked = 0; while (!A.over(v)) { A.stepWorld(v);
      Wt.watch(v); for (const q of v.ms) if (q.cast && q.cast.mode) marked++; }
    const lk = Wt.seen(v, v.ms[0]); assert.ok(marked > 0 && v.ms[0].mlog.mode.n && lk['방식 시간: 견제'] >= 0 && lk['덮기 갈 곳 덮은 비율'] >= 0 && lk['큰 수의 확정 순간 몫'] >= 0);
  });
  ok('v2.14 잘게 걷기·빠른 판 (SPEC 38장): 1/60 s 걸음도 같은 씨앗이면 같은 판, 떡대·막기·감각 조준, 박자 지표', () => {
    const sc = SCENES['v2-tactics-legend'], Wt = require('../../metrics/watch'), run = (rules, seed) => { const W = A.sceneWorld(Object.assign({}, sc, { seed, maxT: 10, rules: Object.assign({}, sc.rules, rules) }));
      while (!A.over(W)) { A.stepWorld(W); Wt.watch(W); } return W; };
    const a = run({}, 2), b = run({}, 2), c = run({ fineStep: false }, 2);
    assert.ok(A.rulesOf(sc.rules).fineStep && A.rulesOf(sc.rules).pace && a.dt === 1 / 60 && a.sk === 2 && c.dt === A.DT && c.sk === 1);
    assert.strictEqual(dig(A.result(a)) + JSON.stringify(a.ms.map(m => [m.x, m.y, m.hp])), dig(A.result(b)) + JSON.stringify(b.ms.map(m => [m.x, m.y, m.hp])), '같은 씨앗 같은 판');
    if (a.ms.every(m => m.hp > 0)) assert.ok(Math.abs(a.step - 600) <= 1 && Math.abs(c.step - 300) <= 1, a.step + ' ' + c.step);
    const lk = Wt.seen(a, a.ms[0]);
      assert.ok(lk['평균 속도 (m/s)'] > 10 && lk['초당 하는 일'] > 2 && lk['초당 방향 전환'] > 0.5 && lk['막기'] > 0, JSON.stringify([lk['평균 속도 (m/s)'], lk['초당 하는 일'], lk['초당 방향 전환'], lk['막기']]));
    // 떡대 × 0.35, 막기를 켜면 × 0.45 더. 대마법사만, 추락은 빼고
    const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: [], rules });
      return [W, A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 10, 15), A.addMage(W, A.mage({ tier: '평범' }), 1, 30, 15)]; };
    const hm = (W, m, k) => { let v = 100; for (const h of W.H.hurtMod) v = h(W, m, v, k, 'x'); return v; };
    const [W0, m0, q0] = mk({}), [W1, m1, q1] = mk({ pace: true }), P = A.RULES.find(r => r.name === 'pace').api.P;
    assert.ok(Math.abs(hm(W1, m1, 'elec') / hm(W0, m0, 'elec') - P.bulk) < 1e-9 && hm(W1, m1, 'fall') === hm(W0, m0, 'fall') && hm(W1, q1, 'elec') === hm(W0, q0, 'elec'));
    m1.st.guard = 0.1; assert.ok(Math.abs(hm(W1, m1, 'elec') / hm(W0, m0, 'elec') - P.bulk * P.guard.k) < 1e-9);
    // 감각 조준: 전설은 track[3] m 안이면 과녁의 자리로 고쳐 겨눈다, 밖이면 그대로
    const ct = (dx) => { const c = { s: W1.spells['체인'], tgt: q1, tx: q1.x + dx, ty: q1.y, auto: false }; for (const h of W1.H.track) h(W1, m1, c); return c.tx; };
    assert.ok(ct(P.track[3] - 0.5) === q1.x && ct(P.track[3] + 0.5) === q1.x + P.track[3] + 0.5 && !W0.H.track.length);
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
