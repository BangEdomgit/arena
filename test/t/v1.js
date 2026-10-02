'use strict';
/* 숨 결투장 시험: 1.x 규칙: 등록·파도·부류·도발·판단·기술·위험·몸 묶기·모듈·대응 (1.1~1.13)
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v1.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
function run() {
  legacy(true); const { ok, done } = suite();
  ok('등록: 새 마법·덱·등급·두뇌·규칙이 붙고, 새 규칙은 끄면 예전과 같다', () => {
    const base = dig(A.duel(A.mage({ tier: '중간' }), A.mage({ tier: '중간', deck: '기본기' }), { seed: 4 }));
    let calls = 0; A.register.rule('시험 규칙', { default: false, apply() { calls++; } });
    assert.strictEqual(dig(A.duel(A.mage({ tier: '중간' }), A.mage({ tier: '중간', deck: '기본기' }), { seed: 4 })), base); assert.strictEqual(calls, 0);
    A.duel(A.mage({ tier: '중간' }), A.mage({ tier: '중간', deck: '기본기' }), { seed: 4, rules: { '시험 규칙': true }, maxT: 1 }); assert.ok(calls > 0);
    A.register.spell({ n: '시험 돌', el: '흙', t: 'proj', m: 0.5, v: 30, R: 20, cost: 3, cast: 0.3, cd: 1, role: '공격' });
    A.register.deck('시험 덱', ['시험 돌', '석회 방패']); A.register.tier('영웅', { C: 7, circles: 7 });
    A.register.brain('가만히', { think(W, m) { m.mv.x = m.mv.y = 0; } });
    const r = A.runScene({ seed: 1, maxT: 20, sides: [{ mages: [{ tier: '영웅', deck: '시험 덱' }] }, { brain: '가만히', mages: [{ tier: '평범' }] }] });
    assert.ok(r.ms[0].log.casts['시험 돌'] > 0, '새 마법을 안 씀'); assert.strictEqual(Object.keys(r.ms[1].log.casts).length, 0, '가만히 두뇌가 시전함');
    assert.throws(() => A.register.spell({ n: '틀 없음', t: 'nope', cost: 1, cast: 1, cd: 1 }));
    A.register.unrule('시험 규칙'); assert.ok(!('시험 규칙' in A.DEFAULT_RULES));
  });
  ok('파도 (1.2.0): 꺼 두면 부류와 상관없이 예전과 같고, 켜면 서퍼는 100을 넘어 타다 170에서 휩쓸리고, 이단은 넘치지 않는다', () => {
    const mm = (type, deck) => A.mage({ tier: '중간', deck, type });
    assert.strictEqual(dig(A.duel(mm('서퍼'), mm('이단', '기본기'), { seed: 3, rules: V1 })), dig(A.duel(mm(), mm(undefined, '기본기'), { seed: 3, rules: V1 })));
    const pour = type => {   // 머리를 넘치게 붓는다
      const W = A.createWorld({ seed: 1, obstacles: 0, rules: { wave: true } }); const m = A.addMage(W, { book: ['돌 창'], type }, 0, 5, 15); A.addMage(W, {}, 1, 25, 15); A.stepWorld(W);
      const seen = []; for (let k = 0; k < 40; k++) { A.release(W, m, { s: W.spells['돌 창'], tx: 25, ty: 15 }); seen.push({ fat: m.fat, wave: m.wave, stun: m.st.stun || 0 }); }
      return { m, seen };
    };
    const s = pour('서퍼'); assert.ok(s.m.log.waves >= 1 && s.m.log.lost >= 1, JSON.stringify(s.m.log));
    assert.ok(s.seen.some(x => x.fat > 100 && x.wave && !x.stun), '서퍼가 100을 넘어 파도를 타지 않았다');
    assert.ok(s.m.st.stun >= 2.5 - 1e-9 && s.m.log.taken.wave >= 30, '휩쓸림(170)의 굳음·피해가 없다');
    const h = pour('이단'); assert.ok(h.m.log.waves === 0 && h.m.log.over === 0 && h.seen.every(x => x.fat <= 100 && !x.stun), JSON.stringify(h.m.log));
    assert.throws(() => A.mage({ type: '없는 부류' }));
  });
  ok('부류의 이점 (1.3.0): 메타는 문턱 아래 위력·회복·꺼짐 없음, 이단의 예비동작은 마지막 0.12 s에만 읽힌다', () => {
    const W0 = A.createWorld({ seed: 1, obstacles: 0 }), W1 = A.createWorld({ seed: 1, obstacles: 0, rules: { wave: true } }), s = W1.spells['돌 창'];
    const meta = W => { const m = A.addMage(W, { book: ['돌 창'] }, 0, 5, 15); m.fat = 90; return m; };
    assert.ok(Math.abs(A.power(W1, meta(W1), s) / A.power(W0, meta(W0), s) - 1.08) < 1e-12, '피로 90 위력');
    const down = type => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: { wave: true } }); const m = A.addMage(W, { type }, 0, 5, 15); A.addMage(W, { book: [] }, 1, 35, 15); m.wave = 1;
      m.fat = 75.05; const f0 = m.fat; A.stepWorld(W); return { m, drop: f0 - m.fat }; };
    const me = down('메타'), su = down('서퍼');
    assert.ok(!me.m.wave && me.m.crash === 0 && !su.m.wave && su.m.crash > 1.9, '꺼짐'); assert.ok(Math.abs(me.drop / su.drop - 1.05) < 1e-9, '회복 ' + me.drop / su.drop);
    const auto = (type, left) => {   // 상위(5서클)가 적의 예비동작을 읽고 자동 진을 펴는가
      const W = A.createWorld({ seed: 1, obstacles: 0, rules: { wave: true } });
        const d = A.addMage(W, { C: 5, circles: 5, book: ['흘리기 막'] }, 0, 10, 15), q = A.addMage(W, { type, book: ['라이트닝'] }, 1, 18, 15);
      A.stepWorld(W); d.thinkT = 1; q.cast = { s: W.spells['라이트닝'], tgt: d, tx: d.x, ty: d.y, t: 1 - left, T: 1 }; A.brain.think(W, d); return d.log.dec.auto;
    };
    assert.strictEqual(auto('메타', 0.3), 1); assert.strictEqual(auto('이단', 0.3), 0); assert.strictEqual(auto('이단', 0.1), 1);
  });
  ok('표준 시험 묶음: 같으면 줄이 없고, 판 수에 따라 운과 진짜 차이를 가른다', () => {
    const Su = require('../suite'), row = (A, B, D, t, sd) => ({ N: A + B + D, A, B, D, score: (A + D / 2) / (A + B + D), t, sd });
    const base = { rows: { x: row(50, 50, 0, 30, 10), y: row(50, 50, 0, 30, 10) } };
    assert.strictEqual(Su.compare(base, { rows: { x: row(50, 50, 0, 30, 10), y: row(50, 50, 0, 30, 10) } }).length, 0);
    const d = Su.compare(base, { rows: { x: row(55, 45, 0, 30, 10), y: row(75, 25, 0, 30, 10), z: row(1, 0, 0, 1, 0) } });
    assert.deepStrictEqual(d.map(x => [x.id, x.kind, x.zs != null ? Su.verdict(x.zs) : '']), [['x', '바뀜', '운일 수 있음'], ['y', '바뀜', '진짜 차이'], ['z', '새 줄', '']]);
    assert.ok(Su.table().length >= 40 && Su.GROUPS.every(g => Su.table().some(r => r.group === g)));
  });
  ok('도발 (1.4.0): 꺼 두면 책에서 빠지고, 켜면 부름을 끊고, 이단은 걸리지 않는다', () => {
    assert.deepStrictEqual(A.addMage(A.createWorld({ seed: 1 }), { book: ['도발', '돌 창'] }, 0, 5, 5).book, ['돌 창']);
    const tryIt = type => {
      const W = A.createWorld({ seed: 1, obstacles: 0, rules: { taunt: true, wave: true } });
        const m = A.addMage(W, { C: 10, book: ['도발'] }, 0, 5, 15), e = A.addMage(W, { type, book: ['돌 창'] }, 1, 12, 15);
      A.stepWorld(W); e.wave = 1; e.cast = { s: W.spells['돌 창'], tgt: m, tx: m.x, ty: m.y, t: 0, T: 1 }; const f0 = e.fat;
      A.release(W, m, { s: W.spells['도발'], tgt: e, tx: e.x, ty: e.y }); return { e, df: e.fat - f0 };
    };
    const me = tryIt('메타'); assert.ok(!me.e.cast && me.e.log.taunted === 1 && me.df === 8 && me.e.st.stun >= 0.3, JSON.stringify(me.e.log));
    const he = tryIt('이단'); assert.ok(he.e.cast && he.e.log.taunted === 0);
  });
  ok('판단 수준 (1.5.0): 다섯 단계, 초보는 예비동작을 못 읽고, 전설은 배우고 속인다', () => {
    assert.deepStrictEqual(Object.keys(A.SKILLS), ['초보', '중급', '상급', '대가', '전설']);
    const s = A.mage({ tier: '중간', skill: '초보' }); assert.ok(s.dec === 0.3 && s.noise === 0.14 && s.tac.dodge === 0.15 && s.tac.rest === 60 && !s.tac.readCast && !s.tac.stance);
    const auto = skill => {   // 상위(5서클)가 적의 예비동작을 읽고 자동 진을 펴는가
      const W = A.createWorld({ seed: 1, obstacles: 0 });
        const d = A.addMage(W, Object.assign(A.mage({ tier: '상위', skill }), { book: ['흘리기 막'] }), 0, 10, 15), q = A.addMage(W, { book: ['라이트닝'] }, 1, 18, 15);
      A.stepWorld(W); q.cast = { s: W.spells['라이트닝'], tgt: d, tx: d.x, ty: d.y, t: 0.7, T: 1 }; A.brain.think(W, d); return d.log.dec.auto;
    };
    assert.strictEqual(auto('초보'), 0); assert.strictEqual(auto('중급'), 1);
    let feint = 0, learned = 0; for (let k = 1; k <= 4; k++) { const r = A.duel(A.mage({ tier: '중간', skill: '전설' }), A.mage({ tier: '중간', skill: '대가' }), { seed: k });
      feint += r.ms[0].log.dec.feint || 0; const mm = Object.values(r.ms[0].mem)[0]; if (mm && mm.L + mm.R > 0) learned++; }
    assert.ok(feint > 0 && learned > 0, 'feint ' + feint + ' learned ' + learned);
    assert.throws(() => A.mage({ skill: '신' }));
  });
  ok('기술 사다리 1 (1.7.0): 초보는 서서 쏘고 멈추며, 상급은 바로 잇고 콤보를 계획하고, 서클은 그릇 × 솜씨', () => {
    assert.deepStrictEqual(['초보', '중급', '상급', '대가', '전설'].map(skill => A.mage({ tier: '중간', skill }).circles), [1, 2, 3, 3, 4]);
    assert.deepStrictEqual(['초보', '전설'].map(skill => A.mage({ tier: '평범', skill }).circles), [1, 2]);
    const lk = skill => { const r = A.duel(A.mage({ tier: '평범', skill }), A.mage({ tier: '평범', skill }), { seed: 2 }); return A.look(r.ms[0], r.ms[0].deathT ?? r.t); };
    const b = lk('초보'), m = lk('중급'), s = lk('상급');
    assert.ok(b['빈틈 (s)'] > m['빈틈 (s)'] && m['빈틈 (s)'] > s['빈틈 (s)'], [b, m, s].map(x => x['빈틈 (s)']).join(' > '));
    assert.ok(b['분당 콤보'] === 0 && m['분당 콤보'] > 0);
    const W = A.createWorld({ seed: 1, obstacles: 0 }); const n = A.addMage(W, A.mage({ skill: '초보' }), 0, 5, 15); A.addMage(W, {}, 1, 25, 15);
    n.cast = { s: W.spells['불기둥'], tx: 25, ty: 15, t: 0, T: 5 }; n.mv.x = 1; n.thinkT = 9; const x0 = n.x; for (let k = 0; k < 10; k++) A.stepWorld(W); assert.strictEqual(n.x, x0, '초보가 쏘면서 걸었다');
  });
  ok('기술 사다리 2 (1.8.0): 굳으면 못 구르고, 상급은 캔슬, 대가는 유도·동시 착탄, 전설은 속임수', () => {
    const W = A.createWorld({ seed: 1, obstacles: 0 }); const d = A.addMage(W, A.mage({ tier: '상위', skill: '전설' }), 0, 10, 15), q = A.addMage(W, { book: ['라이트닝'] }, 1, 18, 15);
    A.stepWorld(W); d.st.stun = 1; d.stam = 6; d.rollCd = 0; q.cast = { s: W.spells['라이트닝'], tgt: d, tx: d.x, ty: d.y, t: 0.7, T: 1 }; A.brain.think(W, d); assert.ok(!(d.roll > 0), '굳었는데 굴렀다');
    const lk = (tier, skill) => { const acc = {}; for (let k = 1; k <= 6; k++) { const sw = k % 2, a = A.mage({ tier, skill, deck: '기술' }), b = A.mage({ tier, skill: '중급', deck: '기술' });
        const r = sw ? A.duel(b, a, { seed: k, rules: { barrels: true } }) : A.duel(a, b, { seed: k, rules: { barrels: true } }); const m = r.ms[sw ? 1 : 0];
        for (const [x, v] of Object.entries(A.look(m, m.deathT ?? r.t))) acc[x] = (acc[x] || 0) + v; } return acc; };
    const L = ['중급', '상급', '대가', '전설'].map(s => lk('중간', s));
    assert.ok(L[0]['분당 캔슬'] === 0 && L[1]['분당 캔슬'] > 0, '캔슬'); assert.ok(L[1]['분당 유도 성공'] === 0 && L[2]['분당 유도 성공'] > 0, '유도');
    assert.ok(L[1]['분당 속임수'] === 0 && L[3]['분당 속임수'] > 0, '속임수'); assert.ok(L[2]['분당 동시 시전'] > 0 && L[1]['분당 동시 시전'] === 0, '동시 시전');
  });
  ok('하이 리스크·소금 원 (1.9.0): 꺼 두면 큰 마법이 빠지고, 역류·빈손, 소금 선 밖에선 마법이 흩어진다', () => {
    assert.ok(!A.addMage(A.createWorld({ seed: 1 }), A.mage({}), 0, 5, 5).book.includes('대낙뢰'));
    const W = A.createWorld({ seed: 1, obstacles: 0, rules: { risk: true } }); const m = A.addMage(W, A.mage({}), 0, 10, 15), e = A.addMage(W, A.mage({}), 1, 20, 15);
    assert.ok(m.book.includes('번개 창')); A.stepWorld(W);
    m.cast = { s: W.spells['번개 창'], tgt: e, tx: e.x, ty: e.y, t: 0, T: 0.8 }; const hp0 = m.hp; A.release(W, e, { s: W.spells['땅 번개'], tgt: m, tx: m.x, ty: m.y });
      for (let k = 0; k < 15; k++) A.stepWorld(W);
    assert.ok(m.log.backfire === 1 && !(m.cast && m.cast.s.big) && hp0 - m.hp >= 22, '역류 ' + m.log.backfire + ' ' + (hp0 - m.hp));
    const W2 = A.createWorld({ seed: 1, obstacles: 0, rules: { risk: true } }); const a = A.addMage(W2, A.mage({}), 0, 10, 15), b = A.addMage(W2, A.mage({}), 1, 16, 15); A.stepWorld(W2);
    A.release(W2, a, { s: W2.spells['대낙뢰'], tgt: b, tx: b.x, ty: b.y }); assert.ok(a.emptyT > W2.t + 0.8 && a.log.bigCast === 1);
    const W3 = A.createWorld({ seed: 1, obstacles: 0, rules: { saltRing: true } }); W3.t = 80; const q = A.addMage(W3, A.mage({}), 0, 2, 2); A.addMage(W3, A.mage({}), 1, 20, 15);
    assert.strictEqual(A.gAt(W3, q, W3.spells['짧은 실'], 3, 3), 0); const h0 = q.hp; A.stepWorld(W3); assert.ok(q.hp < h0, '소금 밖인데 마르지 않았다');
  });
  ok('위험 규칙 판단 (1.10.0): 구를 쪽 읽기, 빈손은 첫 칸만, 큰 수의 예고 < 묶는 시간', () => {
    const W = A.createWorld({ seed: 1, obstacles: [{ x: 20, y: 17, r: 1 }], rules: { risk: true } }); const e = A.addMage(W, A.mage({}), 1, 20, 15);
    assert.strictEqual(A.brain.rollSide(W, e, 1, 0, null), -1, '왼쪽(y+)이 막혔으면 오른쪽');   // 내가 x−에서 x+로 볼 때 왼쪽은 y+
    assert.strictEqual(A.brain.rollSide(A.createWorld({ seed: 1, obstacles: [] }), e, 1, 0, { L: 3, R: 1 }), 1, '버릇');
    const empty = skill => { const W2 = A.createWorld({ seed: 1, obstacles: 0, rules: { risk: true } });
      const m = A.addMage(W2, A.mage({ tier: '중간', skill }), 0, 10, 15), q = A.addMage(W2, A.mage({ tier: '중간' }), 1, 16, 15);
      A.stepWorld(W2); m.emptyT = W2.t + 0.9; m.cast = m.castB = null; m.thinkT = 1; A.brain.think(W2, m); return m; };
    const a = empty('상급'); assert.ok(!a.cast && !a.castB, '상급은 빈손에 아무것도 못 한다');
    const b = empty('대가'); assert.ok(!b.cast, '대가도 빈손에 첫 칸은 못 쓴다');
    for (const n of ['대낙뢰', '화산 기둥', '번개 창']) assert.ok(A.SPELLS[n].cast <= 0.6, n);
    assert.ok(A.SPELLS['대낙뢰'].cast + A.SPELLS['대낙뢰'].delay <= 1.1 && A.SPELLS['화산 기둥'].cast + A.SPELLS['화산 기둥'].delay <= 1.0);
  });
  ok('몸 묶기 (1.11.0): 꺼 두면 빠지고, 균사·경직은 구르기를 막고, 족쇄는 젖은 발만, 불·산·비가 푼다, 기둥 넷, 눈멀면 예비동작을 못 읽는다', () => {
    const NEW = ['균사 그물', '얼음 족쇄', '근육 경직', '석회 굳히기', '가두는 기둥'];
    assert.ok(!A.addMage(A.createWorld({ seed: 1 }), A.mage({ deck: '기술' }), 0, 5, 5).book.some(n => NEW.includes(n)));
    const mk = () => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: { bodyBind: true } });
      const m = A.addMage(W, A.mage({ tier: '중간', skill: '상급', deck: '기술' }), 0, 10, 15), e = A.addMage(W, A.mage({ tier: '중간', deck: '기술' }), 1, 16, 15); A.stepWorld(W); e.thinkT = 1e9;
      return [W, m, e]; };   // 상대는 생각하지 않는다
    let [W, m, e] = mk(); assert.ok(NEW.every(n => m.book.includes(n)));
    // 균사: 구르지 못하고 × 0.6. 불에 타면 풀린다
    A.release(W, e, { s: W.spells['균사 그물'], tgt: m, tx: m.x, ty: m.y }); for (let k = 0; k < 12 && !(m.st.mycel > 0); k++) A.stepWorld(W);
    assert.ok(m.st.mycel > 0.5, '균사 ' + m.st.mycel);
    m.stam = 6; m.rollCd = 0; m.roll = 0; m.thinkT = 0;
    e.cast = { s: W.spells['땅 번개'], tgt: m, tx: m.x, ty: m.y, t: 0, T: 0.3 }; A.brain.think(W, m); assert.ok(!(m.roll > 0), '균사에 걸렸는데 굴렀다');
    m.st.burn = 1; A.stepWorld(W); assert.ok(!(m.st.mycel > 0), '불에 타도 균사가 남았다');
    // 경직: 굳히지 않고 × 0.5, 절연이 막는다
    [W, m, e] = mk(); A.release(W, e, { s: W.spells['근육 경직'], tgt: m, tx: m.x, ty: m.y }); assert.ok(m.st.cramp > 0.5 && !(m.st.stun > 0), '경직 ' + m.st.cramp);   // 과녁 발밑이라 장악 g만큼
    [W, m, e] = mk(); m.buf.elecRes = { v: 0.3, t: 2 }; A.release(W, e, { s: W.spells['근육 경직'], tgt: m, tx: m.x, ty: m.y }); assert.ok(!(m.st.cramp > 0), '절연이 경직을 못 막았다');
    // 족쇄: 마른 발엔 안 걸리고, 젖은 발은 1.5 s 묶인다
    [W, m, e] = mk(); const shoot = () => { A.release(W, e, { s: W.spells['얼음 족쇄'], tgt: m, tx: m.x, ty: m.y }); for (let k = 0; k < 12; k++) A.stepWorld(W); };
    shoot(); assert.ok(!(m.st.root > 0), '마른 발이 묶였다'); m.st.wet = 10; e.cd = {}; shoot(); assert.ok(m.st.root > 1 && m.st.fetter > 1, '젖은 발이 안 묶였다');
    m.st.burn = 1; A.stepWorld(W); assert.ok(!(m.st.root > 0) && !(m.st.fetter > 0), '불에 족쇄가 안 녹았다');
    // 석회: 산에 녹는다
    [W, m, e] = mk(); m.st.lime = 3; A.release(W, e, { s: W.spells['산 안개'], tgt: m, tx: m.x, ty: m.y }); A.stepWorld(W); assert.ok(!(m.st.lime > 0), '산에 석회가 안 녹았다');
    // 가두는 기둥: 과녁 둘레 3 m에 넷, 나와 과녁 사이는 비운다
    [W, m, e] = mk(); A.release(W, m, { s: W.spells['가두는 기둥'], tgt: e, tx: e.x, ty: e.y }); const cg = W.walls.filter(w => w.cage);
    assert.strictEqual(cg.length, 4); assert.ok(cg.every(w => Math.abs(A.hyp(w.x - e.x, w.y - e.y) - 3) < 0.01)); assert.ok(!A.blocked(W, m.x, m.y, e.x, e.y), '기둥이 내 길을 막았다');
    // 눈멂: 예비동작을 위협으로 못 읽는다. 비가 씻는다 (꺼 두면 안 씻는다)
    const read = blind => { const [W2, q, f] = mk(); q.st.blind = blind; q.rollCd = 0; q.stam = 6; q.thinkT = 0; f.cast = { s: W2.spells['번개 그물'], tgt: q, tx: q.x, ty: q.y, t: 0.2, T: 0.5, by: f };
      let rolled = 0; for (let k = 0; k < 20; k++) { q.thinkT = 0; A.brain.think(W2, q); if (q.roll > 0) rolled++; q.roll = 0; q.rollCd = 0; q.stam = 6; } return rolled; };
    assert.ok(read(0) > 0 && read(2) === 0, '눈멀어도 예비동작을 읽었다 ' + read(0) + ' ' + read(2));
    [W, m, e] = mk(); m.st.blind = 2; A.release(W, e, { s: W.spells['비 뿌리기'], tgt: m, tx: m.x, ty: m.y }); assert.ok(!(m.st.blind > 0), '비가 눈을 안 씻었다');
    const W0 = A.createWorld({ seed: 1, obstacles: 0 }), p = A.addMage(W0, A.mage({}), 0, 10, 15), o = A.addMage(W0, A.mage({}), 1, 14, 15); A.stepWorld(W0); p.st.blind = 2;
    A.release(W0, o, { s: W0.spells['비 뿌리기'], tgt: p, tx: p.x, ty: p.y }); assert.ok(p.st.blind > 1, '꺼 두었는데 비가 눈을 씻었다');
  });
  ok('모듈과 훅 (1.12.0): 켜진 규칙의 훅만 모이고, 규칙 모듈을 등록하면 켰을 때만 끼어든다, 데이터·판단 수준은 data/에서', () => {
    const names = W => W.mods.map(r => r.name).join(',');
    const W0 = A.createWorld({ seed: 1 }); assert.strictEqual(names(W0), 'gear,terrain,multiSlot');
    assert.ok(W0.H.hurt.length === 0 && W0.H.speed.length === 0 && W0.H.gate.length === 0 && W0.H.share.length === 1, '꺼진 규칙의 훅이 모였다');
    const W1 = A.createWorld({ seed: 1, rules: { wave: true, risk: true, bodyBind: true, saltRing: true, circles: false } });
    assert.strictEqual(names(W1), 'gear,terrain,saltRing,wave,control,risk'); assert.ok(W1.H.hurt.length === 2 && W1.H.speed.length === 2 && W1.H.mageStep.length === 2);
    assert.strictEqual(names(A.createWorld({ seed: 1, barrels: [{ x: 5, y: 5 }] })), 'gear,terrain,multiSlot,barrels');   // 장면이 화약통을 놓으면 켜진다
    // 규칙 모듈 등록: 끄면 판이 같고, 켜면 훅이 끼어든다. 없는 훅 이름은 거절
    const duel = rules => dig(A.duel(A.mage({ tier: '중간' }), A.mage({ tier: '중간', deck: '기본기' }), { seed: 6, rules }));
    const base = duel(); let n = 0;
    A.register.rule({ name: '시험 방패', switch: '시험 방패', engine: () => ({ hurtMod(W, m, v) { n++; return v * 0.5; } }), brain: () => ({ castTime(W, m, t) { return t; } }) });
    assert.strictEqual(duel(), base); assert.strictEqual(n, 0);
    assert.notStrictEqual(duel({ '시험 방패': true }), base); assert.ok(n > 0);
    A.register.unrule('시험 방패'); assert.strictEqual(duel({ '시험 방패': true }), base);
    A.register.rule({ name: '틀린 훅', engine: () => ({ nope() {} }) }); assert.throws(() => A.createWorld({})); A.register.unrule('틀린 훅');
    // 데이터: 원소 파일을 모은 마법의 차례·덱·판단 수준
    const ORD = require('../../data/spells/order.json'); assert.deepStrictEqual(Object.keys(A.SPELLS).slice(0, ORD.length), ORD); assert.strictEqual(A.DECKS['자유'][0], Object.keys(A.SPELLS)[0]);
    assert.ok(A.SKILLS['전설'].tac.learn && A.SKILLS['초보'].tac.pause && A.CIRCLES['초보'](5) === 2 && A.CIRCLES['전설'](5) === 6);
    assert.deepStrictEqual(require('../../src/brain/skills').techniquesOf('초보'), ['tempo']);
  });
  ok('대응·은실 옷 (1.13.0): 꺼 두면 예전과 같고, 순간 반응은 판단 사이에 구르고, 대비는 피해를 줄이고, 풀기는 몸 묶기만 푼다, 은실은 붙잡기를 반으로', () => {
    const duel = (rules, gear) => dig(A.duel(A.mage({ tier: '중간', skill: '대가', gear }), A.mage({ tier: '중간', skill: '상급', deck: '기술' }), { seed: 3, rules: Object.assign({ risk: true, bodyBind: true }, rules) }));
    assert.strictEqual(duel({}, { silver: true }), duel({}), '스위치가 꺼졌는데 은실 옷이 일했다');
    assert.ok(!A.createWorld({}).mods.some(r => r.name === 'response' || r.name === 'silver'));
    const mk = (rules, spec) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules });
      const m = A.addMage(W, Object.assign({ book: [] }, spec), 0, 10, 15), e = A.addMage(W, { book: [] }, 1, 30, 15); A.stepWorld(W); m.thinkT = e.thinkT = 99; return [W, m, e]; };
    // 순간 반응: 판단이 멈춰 있어도(thinkT 99) 0.2 s 안에 닿을 탄을 몸이 피한다. 초보·꺼짐은 못 한다
    const shoot = (rules, skill) => { let n = 0; for (let k = 0; k < 20; k++) { const W = A.createWorld({ seed: k + 1, obstacles: 0, rules });
        const m = A.addMage(W, { book: [], skill }, 0, 10, 15), e = A.addMage(W, { book: [] }, 1, 30, 15); A.stepWorld(W); m.thinkT = e.thinkT = 99;
      W.proj.push({ x: 13, y: 15, vx: -20, vy: 0, home: false, life: 1, s: W.spells['돌 압축탄'], src: e, pow: 1, rad: 0.1 }); for (let i = 0; i < 6; i++) A.stepWorld(W); if (m.log.reflex) n++;
        } return n; };
    assert.ok(shoot({ response: true }, '전설') >= 12, '전설의 순간 반응 ' + shoot({ response: true }, '전설')); assert.strictEqual(shoot({ response: true }, '초보'), 0); assert.strictEqual(shoot({}, '전설'), 0);
    // 대비: 받는 피해 × 0.6, 걸음 × 0.3
    let [W, m] = mk({ response: true }, { skill: '대가' }); m.braceReq = 1; A.stepWorld(W); assert.ok(m.braceT > W.t && m.log.brace === 1);
    const taken = brace => { const [W2, q, f] = mk({ response: true }, { skill: '대가' }); if (brace) { q.braceReq = 1; A.stepWorld(W2); } f.x = q.x + 3; f.y = q.y; const b0 = q.hp;
      A.release(W2, f, { s: W2.spells['짧은 실'], tx: q.x, ty: q.y }); return b0 - q.hp; };
    const t0 = taken(false), t1 = taken(true); assert.ok(t0 > 0 && Math.abs(t1 / t0 - 0.6) < 1e-9, '대비 ' + t0 + ' → ' + t1);
    // 풀기: 몸 묶기만 풀고 머리 + 12, 당 − 4, 간격 5 s. 굳음은 그대로
    [W, m] = mk({ response: true, bodyBind: true }, { skill: '상급' }); m.st.mycel = 2; m.st.lime = 3; m.st.stun = 0.5; const f0 = m.fat, g0 = m.glu; m.unbindReq = 1; A.stepWorld(W);
    assert.ok(m.st.mycel === 0 && m.st.lime === 0 && m.st.stun > 0.3 && m.fat - f0 > 11 && m.log.unbind === 1 && m.unbindCd > W.t + 4.9, JSON.stringify(m.st));
    m.st.mycel = 2; m.unbindReq = 1; A.stepWorld(W); assert.ok(m.st.mycel > 1, '간격 안에 또 풀었다');
    // 은실 옷: 붙잡는 효과 × hold(화상은 그대로), 전기 × elec (data/rules/silver.json)
    const sv = gear => { const [W3, q, f] = mk({ silver: true }, { gear }); f.x = q.x + 3; f.y = q.y; A.release(W3, f, { s: W3.spells['짧은 실'], tx: q.x, ty: q.y }); return q; };
    const a = sv({}), b = sv({ silver: true });
    const SP = require('../../data/rules/silver.json');
      assert.ok(Math.abs(b.st.stun / a.st.stun - SP.hold) < 1e-9 && Math.abs(b.log.taken.elec / a.log.taken.elec - SP.elec) < 1e-9, a.st.stun + ' ' + b.st.stun);
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
