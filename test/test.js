'use strict';
/* 숨 결투장 v2.15.0 회귀 시험. 규칙을 바꾸면 여기부터 돌린다: node test/test.js
 * v2.0에서 기본 규칙이 바뀌었다(SPEC 24장). 1.x의 기본(규칙 꺼짐)을 전제로 한 시험은 V1(= A.V1_RULES)을 명시해 1.x 동작을 그대로 본다 */
const assert = require('assert');
const A = require('../src');
const V1 = A.V1_RULES, V2 = Object.assign({}, A.DEFAULT_RULES);
// 1.x의 시험은 1.x의 기본(규칙 꺼짐) 위에서 돈다: 그동안 DEFAULT_RULES를 1.x로 둔다. v2.0 시험 앞에서 되돌린다
const legacy = on => Object.assign(A.DEFAULT_RULES, on ? V1 : V2);
legacy(true);
let pass = 0; const ok = (name, fn) => { fn(); pass++; console.log('  ✓', name); };

ok('같은 씨앗이면 같은 결과', () => {
  const run = () => { const r = A.duel(A.mage({ tier: '평범' }), A.mage({ tier: '평범', deck: '기본기' }), { seed: 42 }); return [r.winner, r.t, r.ms.map(m => Math.round(m.hp))].join(','); };
  assert.strictEqual(run(), run());
});
ok('금지된 마법은 기본으로 빠진다', () => {
  const W = A.createWorld({ seed: 1 }); const m = A.addMage(W, { book: ['황화수소 캡슐', '돌 압축탄'] }, 0, 5, 5); assert.deepStrictEqual(m.book, ['돌 압축탄']);
});
ok('같은 등급: 내 손끝은 온전, 상대 발밑은 약해진다', () => {
  const W = A.createWorld({ seed: 1, obstacles: 0 }); const a = A.addMage(W, { C: 1 }, 0, 10, 15), b = A.addMage(W, { C: 1 }, 1, 18, 15);
  A.stepWorld(W);
  const self = A.gOf(W, A.share(W, a, 10.5, 15)), foot = A.gOf(W, A.share(W, a, 18, 15));
  assert.ok(self > 0.95, 'self ' + self); assert.ok(foot > 0.2 && foot < 0.9, 'foot ' + foot);
});
ok('대마법사 둘레에선 평범한 마법사가 제 손끝에서도 흩어진다', () => {
  const W = A.createWorld({ seed: 1, obstacles: 0 }); const big = A.addMage(W, { C: 10 }, 0, 10, 15), small = A.addMage(W, { C: 1 }, 1, 18, 15);
  A.stepWorld(W); assert.ok(A.gOf(W, A.share(W, small, 18.5, 15)) === 0);
});
ok('빠른 탄은 사람을 뚫고 지나가지 않는다', () => {
  const W = A.createWorld({ seed: 1, obstacles: 0, rules: { domain: false } }); const s = A.addMage(W, { book: ['머스킷'], noise: 0 }, 0, 5, 15), t = A.addMage(W, { book: [] }, 1, 25, 15);
  A.stepWorld(W); A.release(W, s, { s: W.spells['머스킷'], tx: 25, ty: 15 }); for (let k = 0; k < 10; k++) A.stepWorld(W);
  assert.ok(t.hp < t.hpMax, '맞지 않음');
});
ok('머리가 넘치면 폭주한다', () => {
  const W = A.createWorld({ seed: 1, obstacles: 0 }); const m = A.addMage(W, { book: ['돌 창'] }, 0, 5, 15); A.addMage(W, {}, 1, 25, 15); A.stepWorld(W);
  for (let k = 0; k < 40; k++) A.release(W, m, { s: W.spells['돌 창'], tx: 25, ty: 15 });
  assert.ok(m.log.over >= 1);
});
ok('약한 무리에 둘러싸이면 버티고, 총에 둘러싸이면 뚫는다', () => {
  const r1 = A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 12 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: 3, layout: 'ring', maxT: 3 });
  const s1 = r1.ms[0].log.stanceT; assert.ok((s1.hold || 0) > (s1.breakout || 0), JSON.stringify(s1));
  const r2 = A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 12 }, () => A.mage({ tier: '병사', deck: '머스킷' })), { seed: 3, layout: 'ring', maxT: 3 });
  const s2 = r2.ms[0].log.stanceT; assert.ok((s2.breakout || 0) + (s2.kite || 0) > (s2.hold || 0), JSON.stringify(s2));
});
ok('대마법사는 평범한 마법사 30명을 버틴다', () => {
  const r = A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 30 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: 5, layout: 'ring', maxT: 60 });
  assert.ok(r.ms[0].hp > 0, '쓰러짐');
});
ok('대마법사는 자기 낙뢰에 맞지 않는다 (1.0.1)', () => {
  const r = A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 50 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: 2, layout: 'ring', maxT: 90 });
  assert.ok(r.ms[0].hp > 0 && !r.ms[0].log.taken.elec, JSON.stringify(r.ms[0].log.taken));
});

/* ---------------- 1.1.0: 결정론 수학, 장면, 샌드박스, 등록 ---------------- */
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const dig = r => [r.winner, r.t, r.ms.map(m => m.hp).join('/')].join(';');
const SCENES = Object.fromEntries(fs.readdirSync(path.join(__dirname, '../sandbox/scenes')).filter(f => f.endsWith('.json')).map(f => [f.slice(0, -5), JSON.parse(SRC('sandbox/scenes/' + f))]));

ok('엔진은 JS 엔진마다 다른 Math 함수를 쓰지 않는다', () => {
  const walk = d => fs.readdirSync(path.join(__dirname, '..', d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(d + '/' + e.name) : e.name.endsWith('.js') ? [d + '/' + e.name] : []);
  const files = [...walk('src'), ...walk('metrics')]; assert.ok(files.length > 30, files.join());
  for (const f of files) {
    const code = SRC(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const bad = code.match(/Math\.(pow|sin|cos|tan|asin|acos|atan2?|sinh|cosh|tanh|hypot|exp|expm1|log1?p?|log2|log10|cbrt|random)\b/g);
    assert.ok(!bad, f + ': ' + bad);
  }
});
ok('결정론 수학은 Math와 1e-14 안에서 맞는다', () => {
  let s = 7; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  for (let i = 0; i < 20000; i++) {
    const a = rnd() * 60 - 30, b = rnd() * 60 - 30, x = rnd() * 50;
    assert.ok(Math.abs(A.sin(a) - Math.sin(a)) < 1e-14 && Math.abs(A.cos(a) - Math.cos(a)) < 1e-14, 'sin/cos ' + a);
    assert.ok(Math.abs(A.atan2(a, b) - Math.atan2(a, b)) < 1e-14, 'atan2 ' + a + ',' + b);
    assert.ok(Math.abs(A.pow(x, b / 10) / Math.pow(x, b / 10) - 1) < 1e-14, 'pow ' + x + ',' + b / 10);
  }
  assert.strictEqual(A.pow(10, 2.5).toFixed(9), '316.227766017');
});
ok('장면: 자리를 비워 두면 명령줄 싸움과 같다', () => {
  for (let k = 1; k <= 3; k++) {
    const sc = { seed: k, sides: [{ mages: [{ tier: '중간' }] }, { mages: [{ tier: '중간', deck: '기본기' }] }] };
    assert.strictEqual(dig(A.runScene(sc)), dig(A.duel(A.mage({ tier: '중간' }), A.mage({ tier: '중간', deck: '기본기' }), { seed: k })));
  }
  const ring = A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 50 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: 1, layout: 'ring', maxT: 90 });
  assert.strictEqual(dig(A.runScene(SCENES['archmage-50'])), dig(ring));
});
ok('장면: 걸음씩 돌려도(샌드박스) 한 번에 돌린 것과 같다', () => {
  const W = A.sceneWorld(SCENES.duel, { record: true }); while (!A.over(W)) A.stepWorld(W);
  assert.strictEqual(dig(A.result(W)), dig(A.runScene(SCENES.duel)));
  const rec = A.recording(W); assert.ok(rec.frames.length > 10 && rec.names.length === 2 && rec.winner === A.result(W).winner);
});
ok('장면을 내보내고 다시 불러오면 같은 판', () => {
  for (const sc of Object.values(SCENES)) assert.strictEqual(dig(A.runScene(JSON.parse(JSON.stringify(sc)))), dig(A.runScene(sc)));
});
ok('sandbox/arena.js는 원본(src·metrics·data·장면)과 맞다 (어긋나면 node cli.js pack)', () => {
  assert.strictEqual(SRC('sandbox/arena.js'), require('../sandbox/pack').text());
});
ok('브라우저 모양(묶음 한 장, 전역)으로 읽어도 같은 결과', () => {
  const ctx = vm.createContext({});
  vm.runInContext(SRC('sandbox/arena.js'), ctx, { filename: 'sandbox/arena.js' });
  const B = ctx.Arena; assert.strictEqual(B.VERSION, A.VERSION); Object.assign(B.DEFAULT_RULES, A.DEFAULT_RULES);   // 이 시험 동안의 기본(1.x)을 묶음에도 assert.ok(ctx.ArenaCore && ctx.ArenaBrain && ctx.ArenaRegistry && ctx.ArenaData.scenes.duel);
  for (const [n, sc] of Object.entries(SCENES)) { const W = B.sceneWorld(sc); while (!B.over(W)) B.stepWorld(W); assert.strictEqual(dig(B.result(W)), dig(A.runScene(sc)), n); }
});
ok('편이 셋 이상이어도 돈다', () => {
  const r = A.runScene({ seed: 2, maxT: 30, sides: ['불', '물', '흙'].map(e => ({ name: e, mages: [{ tier: '중간', deck: e }] })) });
  assert.ok(r.ms.length === 3 && r.ms.every(m => m.side === m._ref[0]));
});
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
  const down = type => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: { wave: true } }); const m = A.addMage(W, { type }, 0, 5, 15); A.addMage(W, { book: [] }, 1, 35, 15); m.wave = 1; m.fat = 75.05; const f0 = m.fat; A.stepWorld(W); return { m, drop: f0 - m.fat }; };
  const me = down('메타'), su = down('서퍼');
  assert.ok(!me.m.wave && me.m.crash === 0 && !su.m.wave && su.m.crash > 1.9, '꺼짐'); assert.ok(Math.abs(me.drop / su.drop - 1.05) < 1e-9, '회복 ' + me.drop / su.drop);
  const auto = (type, left) => {   // 상위(5서클)가 적의 예비동작을 읽고 자동 진을 펴는가
    const W = A.createWorld({ seed: 1, obstacles: 0, rules: { wave: true } }); const d = A.addMage(W, { C: 5, circles: 5, book: ['흘리기 막'] }, 0, 10, 15), q = A.addMage(W, { type, book: ['라이트닝'] }, 1, 18, 15);
    A.stepWorld(W); d.thinkT = 1; q.cast = { s: W.spells['라이트닝'], tgt: d, tx: d.x, ty: d.y, t: 1 - left, T: 1 }; A.brain.think(W, d); return d.log.dec.auto;
  };
  assert.strictEqual(auto('메타', 0.3), 1); assert.strictEqual(auto('이단', 0.3), 0); assert.strictEqual(auto('이단', 0.1), 1);
});
ok('표준 시험 묶음: 같으면 줄이 없고, 판 수에 따라 운과 진짜 차이를 가른다', () => {
  const Su = require('./suite'), row = (A, B, D, t, sd) => ({ N: A + B + D, A, B, D, score: (A + D / 2) / (A + B + D), t, sd });
  const base = { rows: { x: row(50, 50, 0, 30, 10), y: row(50, 50, 0, 30, 10) } };
  assert.strictEqual(Su.compare(base, { rows: { x: row(50, 50, 0, 30, 10), y: row(50, 50, 0, 30, 10) } }).length, 0);
  const d = Su.compare(base, { rows: { x: row(55, 45, 0, 30, 10), y: row(75, 25, 0, 30, 10), z: row(1, 0, 0, 1, 0) } });
  assert.deepStrictEqual(d.map(x => [x.id, x.kind, x.zs != null ? Su.verdict(x.zs) : '']), [['x', '바뀜', '운일 수 있음'], ['y', '바뀜', '진짜 차이'], ['z', '새 줄', '']]);
  assert.ok(Su.table().length >= 40 && Su.GROUPS.every(g => Su.table().some(r => r.group === g)));
});
ok('도발 (1.4.0): 꺼 두면 책에서 빠지고, 켜면 부름을 끊고, 이단은 걸리지 않는다', () => {
  assert.deepStrictEqual(A.addMage(A.createWorld({ seed: 1 }), { book: ['도발', '돌 창'] }, 0, 5, 5).book, ['돌 창']);
  const tryIt = type => {
    const W = A.createWorld({ seed: 1, obstacles: 0, rules: { taunt: true, wave: true } }); const m = A.addMage(W, { C: 10, book: ['도발'] }, 0, 5, 15), e = A.addMage(W, { type, book: ['돌 창'] }, 1, 12, 15);
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
    const W = A.createWorld({ seed: 1, obstacles: 0 }); const d = A.addMage(W, Object.assign(A.mage({ tier: '상위', skill }), { book: ['흘리기 막'] }), 0, 10, 15), q = A.addMage(W, { book: ['라이트닝'] }, 1, 18, 15);
    A.stepWorld(W); q.cast = { s: W.spells['라이트닝'], tgt: d, tx: d.x, ty: d.y, t: 0.7, T: 1 }; A.brain.think(W, d); return d.log.dec.auto;
  };
  assert.strictEqual(auto('초보'), 0); assert.strictEqual(auto('중급'), 1);
  let feint = 0, learned = 0; for (let k = 1; k <= 4; k++) { const r = A.duel(A.mage({ tier: '중간', skill: '전설' }), A.mage({ tier: '중간', skill: '대가' }), { seed: k }); feint += r.ms[0].log.dec.feint || 0; const mm = Object.values(r.ms[0].mem)[0]; if (mm && mm.L + mm.R > 0) learned++; }
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
  const lk = (tier, skill) => { const acc = {}; for (let k = 1; k <= 6; k++) { const sw = k % 2, a = A.mage({ tier, skill, deck: '기술' }), b = A.mage({ tier, skill: '중급', deck: '기술' }); const r = sw ? A.duel(b, a, { seed: k, rules: { barrels: true } }) : A.duel(a, b, { seed: k, rules: { barrels: true } }); const m = r.ms[sw ? 1 : 0]; for (const [x, v] of Object.entries(A.look(m, m.deathT ?? r.t))) acc[x] = (acc[x] || 0) + v; } return acc; };
  const L = ['중급', '상급', '대가', '전설'].map(s => lk('중간', s));
  assert.ok(L[0]['분당 캔슬'] === 0 && L[1]['분당 캔슬'] > 0, '캔슬'); assert.ok(L[1]['분당 유도 성공'] === 0 && L[2]['분당 유도 성공'] > 0, '유도');
  assert.ok(L[1]['분당 속임수'] === 0 && L[3]['분당 속임수'] > 0, '속임수'); assert.ok(L[2]['분당 동시 시전'] > 0 && L[1]['분당 동시 시전'] === 0, '동시 시전');
});
ok('하이 리스크·소금 원 (1.9.0): 꺼 두면 큰 마법이 빠지고, 역류·빈손, 소금 선 밖에선 마법이 흩어진다', () => {
  assert.ok(!A.addMage(A.createWorld({ seed: 1 }), A.mage({}), 0, 5, 5).book.includes('대낙뢰'));
  const W = A.createWorld({ seed: 1, obstacles: 0, rules: { risk: true } }); const m = A.addMage(W, A.mage({}), 0, 10, 15), e = A.addMage(W, A.mage({}), 1, 20, 15);
  assert.ok(m.book.includes('번개 창')); A.stepWorld(W);
  m.cast = { s: W.spells['번개 창'], tgt: e, tx: e.x, ty: e.y, t: 0, T: 0.8 }; const hp0 = m.hp; A.release(W, e, { s: W.spells['땅 번개'], tgt: m, tx: m.x, ty: m.y }); for (let k = 0; k < 15; k++) A.stepWorld(W);
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
  const empty = skill => { const W2 = A.createWorld({ seed: 1, obstacles: 0, rules: { risk: true } }); const m = A.addMage(W2, A.mage({ tier: '중간', skill }), 0, 10, 15), q = A.addMage(W2, A.mage({ tier: '중간' }), 1, 16, 15);
    A.stepWorld(W2); m.emptyT = W2.t + 0.9; m.cast = m.castB = null; m.thinkT = 1; A.brain.think(W2, m); return m; };
  const a = empty('상급'); assert.ok(!a.cast && !a.castB, '상급은 빈손에 아무것도 못 한다');
  const b = empty('대가'); assert.ok(!b.cast, '대가도 빈손에 첫 칸은 못 쓴다');
  for (const n of ['대낙뢰', '화산 기둥', '번개 창']) assert.ok(A.SPELLS[n].cast <= 0.6, n);
  assert.ok(A.SPELLS['대낙뢰'].cast + A.SPELLS['대낙뢰'].delay <= 1.1 && A.SPELLS['화산 기둥'].cast + A.SPELLS['화산 기둥'].delay <= 1.0);
});
ok('몸 묶기 (1.11.0): 꺼 두면 빠지고, 균사·경직은 구르기를 막고, 족쇄는 젖은 발만, 불·산·비가 푼다, 기둥 넷, 눈멀면 예비동작을 못 읽는다', () => {
  const NEW = ['균사 그물', '얼음 족쇄', '근육 경직', '석회 굳히기', '가두는 기둥'];
  assert.ok(!A.addMage(A.createWorld({ seed: 1 }), A.mage({ deck: '기술' }), 0, 5, 5).book.some(n => NEW.includes(n)));
  const mk = () => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: { bodyBind: true } }); const m = A.addMage(W, A.mage({ tier: '중간', skill: '상급', deck: '기술' }), 0, 10, 15), e = A.addMage(W, A.mage({ tier: '중간', deck: '기술' }), 1, 16, 15); A.stepWorld(W); e.thinkT = 1e9; return [W, m, e]; };   // 상대는 생각하지 않는다
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
  const read = blind => { const [W2, q, f] = mk(); q.st.blind = blind; q.rollCd = 0; q.stam = 6; q.thinkT = 0; f.cast = { s: W2.spells['번개 그물'], tgt: q, tx: q.x, ty: q.y, t: 0.2, T: 0.5, by: f }; let rolled = 0; for (let k = 0; k < 20; k++) { q.thinkT = 0; A.brain.think(W2, q); if (q.roll > 0) rolled++; q.roll = 0; q.rollCd = 0; q.stam = 6; } return rolled; };
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
  const ORD = require('../data/spells/order.json'); assert.deepStrictEqual(Object.keys(A.SPELLS).slice(0, ORD.length), ORD); assert.strictEqual(A.DECKS['자유'][0], Object.keys(A.SPELLS)[0]);
  assert.ok(A.SKILLS['전설'].tac.learn && A.SKILLS['초보'].tac.pause && A.CIRCLES['초보'](5) === 2 && A.CIRCLES['전설'](5) === 6);
  assert.deepStrictEqual(require('../src/brain/skills').techniquesOf('초보'), ['tempo']);
});
ok('대응·은실 옷 (1.13.0): 꺼 두면 예전과 같고, 순간 반응은 판단 사이에 구르고, 대비는 피해를 줄이고, 풀기는 몸 묶기만 푼다, 은실은 붙잡기를 반으로', () => {
  const duel = (rules, gear) => dig(A.duel(A.mage({ tier: '중간', skill: '대가', gear }), A.mage({ tier: '중간', skill: '상급', deck: '기술' }), { seed: 3, rules: Object.assign({ risk: true, bodyBind: true }, rules) }));
  assert.strictEqual(duel({}, { silver: true }), duel({}), '스위치가 꺼졌는데 은실 옷이 일했다');
  assert.ok(!A.createWorld({}).mods.some(r => r.name === 'response' || r.name === 'silver'));
  const mk = (rules, spec) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules }); const m = A.addMage(W, Object.assign({ book: [] }, spec), 0, 10, 15), e = A.addMage(W, { book: [] }, 1, 30, 15); A.stepWorld(W); m.thinkT = e.thinkT = 99; return [W, m, e]; };
  // 순간 반응: 판단이 멈춰 있어도(thinkT 99) 0.2 s 안에 닿을 탄을 몸이 피한다. 초보·꺼짐은 못 한다
  const shoot = (rules, skill) => { let n = 0; for (let k = 0; k < 20; k++) { const W = A.createWorld({ seed: k + 1, obstacles: 0, rules }); const m = A.addMage(W, { book: [], skill }, 0, 10, 15), e = A.addMage(W, { book: [] }, 1, 30, 15); A.stepWorld(W); m.thinkT = e.thinkT = 99;
    W.proj.push({ x: 13, y: 15, vx: -20, vy: 0, home: false, life: 1, s: W.spells['돌 압축탄'], src: e, pow: 1, rad: 0.1 }); for (let i = 0; i < 6; i++) A.stepWorld(W); if (m.log.reflex) n++; } return n; };
  assert.ok(shoot({ response: true }, '전설') >= 12, '전설의 순간 반응 ' + shoot({ response: true }, '전설')); assert.strictEqual(shoot({ response: true }, '초보'), 0); assert.strictEqual(shoot({}, '전설'), 0);
  // 대비: 받는 피해 × 0.6, 걸음 × 0.3
  let [W, m] = mk({ response: true }, { skill: '대가' }); m.braceReq = 1; A.stepWorld(W); assert.ok(m.braceT > W.t && m.log.brace === 1);
  const taken = brace => { const [W2, q, f] = mk({ response: true }, { skill: '대가' }); if (brace) { q.braceReq = 1; A.stepWorld(W2); } f.x = q.x + 3; f.y = q.y; const b0 = q.hp; A.release(W2, f, { s: W2.spells['짧은 실'], tx: q.x, ty: q.y }); return b0 - q.hp; };
  const t0 = taken(false), t1 = taken(true); assert.ok(t0 > 0 && Math.abs(t1 / t0 - 0.6) < 1e-9, '대비 ' + t0 + ' → ' + t1);
  // 풀기: 몸 묶기만 풀고 머리 + 12, 당 − 4, 간격 5 s. 굳음은 그대로
  [W, m] = mk({ response: true, bodyBind: true }, { skill: '상급' }); m.st.mycel = 2; m.st.lime = 3; m.st.stun = 0.5; const f0 = m.fat, g0 = m.glu; m.unbindReq = 1; A.stepWorld(W);
  assert.ok(m.st.mycel === 0 && m.st.lime === 0 && m.st.stun > 0.3 && m.fat - f0 > 11 && m.log.unbind === 1 && m.unbindCd > W.t + 4.9, JSON.stringify(m.st));
  m.st.mycel = 2; m.unbindReq = 1; A.stepWorld(W); assert.ok(m.st.mycel > 1, '간격 안에 또 풀었다');
  // 은실 옷: 붙잡는 효과 × hold(화상은 그대로), 전기 × elec (data/rules/silver.json)
  const sv = gear => { const [W3, q, f] = mk({ silver: true }, { gear }); f.x = q.x + 3; f.y = q.y; A.release(W3, f, { s: W3.spells['짧은 실'], tx: q.x, ty: q.y }); return q; };
  const a = sv({}), b = sv({ silver: true });
  const SP = require('../data/rules/silver.json'); assert.ok(Math.abs(b.st.stun / a.st.stun - SP.hold) < 1e-9 && Math.abs(b.log.taken.elec / a.log.taken.elec - SP.elec) < 1e-9, a.st.stun + ' ' + b.st.stun);
});
legacy(false);   // 여기부터 v2.0의 기본 (일꾼도 v2.0 기본으로 돈다)
ok('v2.0 기본 (SPEC 24장): risk·saltRing·wave 켬, 몸 받침 2.3·회피 켬, 체력은 150, V1_RULES면 1.x', () => {
  const W = A.createWorld({ seed: 1, rules: { flight: false } }); assert.ok(W.rules.risk && W.rules.saltRing && W.rules.wave && W.rules.bodyK === 2.3 && W.rules.evade && !W.rules.hpScale);
  assert.ok(['gear', 'terrain', 'saltRing', 'wave', 'risk', 'multiSlot', 'body', 'evade'].every(n => W.mods.some(r => r.name === n)), W.mods.map(r => r.name).join());
  assert.ok(A.createWorld({ seed: 1 }).rules.flight === true && A.createWorld({ seed: 1 }).mods.some(r => r.name === 'flight'), '비행 기본 켬');
  const hp = C => A.addMage(W, { C }, 0, 5, 5).hpMax; assert.strictEqual(hp(1), 150); assert.strictEqual(hp(10), 150);
  const W1 = A.createWorld({ seed: 1, rules: V1 }); assert.strictEqual(W1.mods.map(r => r.name).join(','), 'gear,terrain,multiSlot'); assert.strictEqual(A.addMage(W1, { C: 2.5 }, 0, 5, 5).hpMax, 150);
  const W2 = A.createWorld({ seed: 1, rules: Object.assign({}, V1, { hpScale: true }) }); assert.ok(Math.abs(A.addMage(W2, { C: 0.3 }, 0, 5, 5).hpMax - 150 * Math.pow(0.3, 2.5)) < 1e-9, '1.x의 hpScale');
  const W3 = A.createWorld({ seed: 1, rules: { hpScale: true } }); assert.ok(Math.abs(A.addMage(W3, { C: 2.5 }, 0, 5, 5).hpMax - 150 * Math.pow(2.5, 1.2)) < 1e-9 && A.addMage(W3, { C: 0.3 }, 0, 5, 5).hpMax === 150, 'hpScale C^1.2');
});
ok('v2.0 몸 받침·회피: 에너지 피해 ÷ C^2.3, 부딪힘은 굳은 살(12 × log₁₀ C)만큼 빼기(총도), callus 0이면 첫 묶음, 소금·추락·폭주는 그대로, 걸음·구르기 × (1 + 0.25·log₂ C), 구르기 간격 ÷ (1 + 0.2·log₂ C)', () => {
  const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false, domain: false }, rules) }); const q = A.addMage(W, { C: 10, book: [] }, 0, 10, 15), f = A.addMage(W, { book: ['짧은 실', '머스킷'], allowBanned: true }, 1, 13, 15); A.stepWorld(W); return [W, q, f]; };
  const taken = (rules, spell, steps = 0) => { const [W, q, f] = mk(rules); const h0 = q.hp; A.release(W, f, { s: W.spells[spell], tx: q.x, ty: q.y, tgt: q }); for (let i = 0; i < steps; i++) A.stepWorld(W); return h0 - q.hp; };
  const a = taken({ bodyK: 0 }, '짧은 실'), b = taken({}, '짧은 실'); assert.ok(a > 0 && Math.abs(b / a - 1 / Math.pow(10, 2.3)) < 1e-9, a + ' → ' + b);
  const g0 = taken({ bodyK: 0 }, '머스킷', 10), g1 = taken({}, '머스킷', 10), g2 = taken({ callus: 0 }, '머스킷', 10); assert.ok(g0 === 60 && Math.abs(g1 - 48) < 1e-9 && g2 === 60, '총: 굳은 살 12를 뺀다 (callus 0이면 그대로) ' + g0 + ' ' + g1 + ' ' + g2);
  const p0 = taken({ bodyK: 0 }, '돌 압축탄', 12), p1 = taken({}, '돌 압축탄', 12); assert.ok(p0 > 0 && p0 < 12 && p1 === 0, '조약돌은 튕긴다 ' + p0 + ' ' + p1);
  const [W, q] = mk({}); W.t = 200; for (let i = 0; i < 3; i++) A.stepWorld(W); assert.ok(q.log.taken.salt > 0 && Math.abs(q.log.taken.salt - 6 * 3 / 30) < 1e-6, '소금은 받치지 않는다 ' + q.log.taken.salt);
  const k = Math.log2(10), [W2, r] = mk({}); A.roll(W2, r, 1, 0, 8, 0.8); assert.ok(Math.abs(r.vx - 8 * (1 + 0.25 * k)) < 1e-9 && Math.abs(r.rollCd - 0.8 / (1 + 0.2 * k)) < 1e-9);
  const [W3, r3] = mk({ evade: false }); A.roll(W3, r3, 1, 0, 8, 0.8); assert.ok(r3.vx === 8 && r3.rollCd === 0.8);
});
ok('v2.0 장악권의 원칙 (SPEC 5장): 만드는 것을 빼앗지 가는 것은 못 막는다 — 도달 반경 5 m × C, 실은 길 전체, 발밑은 상대 자리', () => {
  const mk = rules => { const W = A.createWorld({ seed: 1, width: 400, height: 300, obstacles: 0, rules: Object.assign({ flight: false, saltRing: false }, rules) }); const e = A.addMage(W, A.mage({ tier: '대마법사' }), 0, 100, 150), m = A.addMage(W, A.mage({ tier: '평범', book: ['돌 압축탄', '짧은 실', '라이트닝', '땅 번개'] }), 1, 160, 150); A.stepWorld(W); return [W, e, m]; };
  const g = (rules, n, d) => { const [W, e, m] = mk(rules); m.x = e.x + d; return A.gAt(W, m, W.spells[n], e.x, e.y); };
  assert.strictEqual(g({}, '돌 압축탄', 55), 1, '반경 밖 손끝'); assert.strictEqual(g({}, '돌 압축탄', 45), 0, '반경 안 손끝');
  assert.strictEqual(g({ domainR: 0 }, '돌 압축탄', 55), 0, '예전: 끝없음');
  assert.strictEqual(g({}, '라이트닝', 55), 0, '실의 길이 반경 안을 지난다'); assert.strictEqual(g({}, '땅 번개', 55), 0, '상대 자리');
  // 길: 사거리 끝이 반경 밖이면 선다 (평범 라이트닝 12 m, 70 m 떨어져 쏘면 길이 모두 반경 밖)
  assert.strictEqual(g({}, '라이트닝', 70), 1); assert.ok(g({ domainPath: false }, '짧은 실', 55) === g({}, '짧은 실', 55));
});
ok('v2.0 빛 (SPEC 25장): 번쩍임은 시야가 이어진 적을 눈멀게(가림 × 0.4, 연기 안경 × 0.5), 열선은 거울이 있어야, 거리로 약해지고, 눈멀면 예비동작을 못 읽는다', () => {
  const mk = (gear, rules) => { const W = A.createWorld({ seed: 1, width: 80, height: 60, obstacles: [], rules: Object.assign({ flight: false, saltRing: false, domain: false }, rules) }); const m = A.addMage(W, A.mage({ tier: '평범', book: ['번쩍임', '열선'], gear: { mirror: true } }), 0, 10, 30), q = A.addMage(W, A.mage({ tier: '평범', gear }), 1, 30, 30); A.stepWorld(W); return [W, m, q]; };
  const flash = (gear, f) => { const [W, m, q] = mk(gear); if (f) f(W, q); A.release(W, m, { s: W.spells['번쩍임'], tx: q.x, ty: q.y, tgt: q }); return q.st.blind; };
  assert.ok(Math.abs(flash({}) - 1.5) < 1e-9 && Math.abs(flash({ goggles: true }) - 0.75) < 1e-9, '눈멂 1.5, 안경 절반');
  assert.ok(flash({}, (W, q) => W.obs.push({ x: 20, y: 30, r: 1 })) === 0, '바위 뒤는 안 보인다');
  assert.ok(Math.abs(flash({}, (W, q) => W.zones.push({ k: 'mist', shape: 'circle', r: 2, x: 20, y: 30, t: 5, src: q })) - 0.6) < 1e-9, '안개 × 0.4');
  const [W, m] = mk({}); assert.ok(m.book.includes('열선')); const W2 = A.createWorld({ seed: 1 }); assert.ok(!A.addMage(W2, A.mage({ tier: '평범', book: ['열선'] }), 0, 5, 5).book.includes('열선'), '거울이 없으면 책에 없다');
  assert.ok(!A.addMage(A.createWorld({ seed: 1, rules: { light: false } }), A.mage({ tier: '평범', book: ['번쩍임'] }), 0, 5, 5).book.length, '빛을 끄면 책에서 빠진다');
  const beam = d => { const [W, m, q] = mk({}); q.x = m.x + d; const h = q.hp; A.release(W, m, { s: W.spells['열선'], tx: q.x, ty: q.y, tgt: q }); return h - q.hp; };
  assert.ok(beam(15) > 10 && Math.abs(beam(5) / beam(15) - 2 / (1 + 1 / 3)) < 1e-9 && beam(35) === 0, '열선 ∝ 1 / (1 + d/15), 사거리 30');
  // 눈멀면 예비동작을 못 읽는다
  const [W3, m3, q3] = mk({}); q3.cast = { s: W3.spells['열선'], tgt: m3, tx: m3.x, ty: m3.y, t: 0, T: 0.8 }; m3.st.blind = 1; m3.thinkT = 0; A.brain.think(W3, m3); assert.ok(m3._k.blindR && !m3._k.threat);
});
ok('v2.0 벽 (SPEC 25장): 출력에 비례해 한 블록씩 솟고, 흙벽은 총알을 막고 큰 바위·물에 무너지고, 얼음은 녹고, 벽 밀기는 너머 한 줄을 덮고, 벽 뒤는 안 보인다', () => {
  const B = A.RULES.find(r => r.name === 'bulwark').api;
  const mk = rules => { const W = A.createWorld({ seed: 1, width: 80, height: 60, obstacles: [], rules: Object.assign({ flight: false, saltRing: false, domain: false }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', book: ['흙벽', '보루', '벽 밀기', '큰 바위', '물 망치'] }), 0, 20, 30), q = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 1, 40, 30); m.thinkT = q.thinkT = 1e9; A.stepWorld(W); return [W, m, q]; };
  const [W, m, q] = mk(); const s = W.spells['흙벽'], T = B.buildT(m, s); assert.ok(T > 3 && T < 4 && B.buildT({ C: 1, fat: 0 }, s) > 900, '대마법사 약 3 s, 평범은 사실상 못 한다');
  m.cast = { s, tx: 40, ty: 30, tgt: q, t: 0, T }; const seen = []; let n = 0; while (m.cast && n++ < 200) { A.stepWorld(W); seen.push(W.walls.length); }
  assert.ok(W.walls.length === 3 && seen[30] < seen[seen.length - 1] && W.walls.every(w => w.own === -1 && w.mat === 'earth' && w.t > 1e8) && W.zones.filter(z => z.k === 'pit').length === 3 && m.alog.walls === 1, '블록 셋이 차례로, 누구의 것도 아닌 흙벽, 구덩이');
  // 총알은 멈추고(2), 큰 바위는 부순다
  const shoot = (name, who) => { const w = W.walls[1], h = w.hp; A.release(W, who, { s: W.spells[name], tx: w.x, ty: w.y, tgt: null }); for (let i = 0; i < 20; i++) A.stepWorld(W); return h - w.hp; };
  q.noise = 0; assert.strictEqual(shoot('머스킷', q), 2); m.noise = 0; assert.ok(shoot('물 망치', m) >= 50, '물은 흙벽을 진흙으로'); 
  // 벽 밀기: 너머의 병사를 덮는다 (부딪힘 60 − 굳은 살 0), 벽은 무너진다
  const [W2, m2, q2] = mk(); A.release(W2, m2, { s: W2.spells['흙벽'], tx: 40, ty: 30, tgt: q2 }); q2.x = 23; q2.y = 30; const h2 = q2.hp;
  A.release(W2, m2, { s: W2.spells['벽 밀기'], tx: 23, ty: 30, tgt: q2 }); assert.ok(h2 - q2.hp === 60 && q2.st.root > 1.9 && W2.walls.every(w => w.hp <= 0), '벽 밀기 ' + (h2 - q2.hp));
  // 얼음 벽은 녹는다, 벽을 끄면 석회 기둥은 예전처럼 시간으로 사라진다
  const [W3, m3, q3] = mk(); A.addWall(W3, { x: 30, y: 30, r: 0.6, hp: 40, t: 10, own: 0, mat: 'ice' }); for (let i = 0; i < 60; i++) A.stepWorld(W3); assert.ok(Math.abs(W3.walls[0].hp - 39) < 1e-6 && W3.walls[0].t > 1e8, '얼음 초당 0.5');
  const [W4] = mk({ bulwark: false }); A.addWall(W4, { x: 30, y: 30, r: 0.6, hp: 40, t: 10, own: 0, mat: 'lime' }); assert.ok(W4.walls[0].t === 10);
  // 벽 뒤의 예비동작은 못 읽는다
  const [W5, m5, q5] = mk(); A.addWall(W5, { x: 30, y: 30, r: 0.8, hp: 400, t: 1e9, own: -1, mat: 'earth' }); q5.cast = { s: W5.spells['머스킷'], tgt: m5, tx: m5.x, ty: m5.y, t: 0, T: 0.6 }; m5.thinkT = 0; A.brain.think(W5, m5); assert.ok(!m5._k.threat, '벽 뒤');
});
ok('v2.0 군대·사기 (SPEC 25장): 머스킷 장전 15~20 s·화승 0.1~0.5 s·사거리 100 m, 박격포는 벽을 부순다, 돌아가며 쏘기, 사상자·충격에 도망친다', () => {
  const mk = (rules, n = 1, deck = '머스킷', tac) => { const W = A.createWorld({ seed: 3, width: 200, height: 150, obstacles: [], brain: A.brain, rules: Object.assign({ flight: false, saltRing: false }, rules) }); const e = A.addMage(W, A.mage({ tier: '평범', book: [] }), 0, 20, 75), q = []; for (let i = 0; i < n; i++) q.push(A.addMage(W, A.mage({ tier: '병사', deck, tac }), 1, 80, 60 + i * 2)); A.stepWorld(W); return [W, e, q]; };
  const [W, e, [q]] = mk(); const s = W.spells['머스킷']; assert.ok(s.R === 100 && s.reload && A.SPELLS['머스킷'].R === 60, '이 세계의 머스킷만 2판');
  assert.ok(A.createWorld({ seed: 1, rules: { army: false } }).spells['머스킷'].R === 60);
  q.thinkT = 0; A.brain.think(W, q); assert.ok(q.cast && q.cast.T >= 0.1 && q.cast.T <= 0.5 + 1e-9 && q.cast.tx === e.x, '화승 지연, 겨눈 자리는 흐리지 않는다 ' + (q.cast && q.cast.T));
  for (let i = 0; i < 20 && q.cast; i++) A.stepWorld(W); assert.ok(q.cd['머스킷'] > 14 && q.cd['머스킷'] <= 20, '장전 ' + q.cd['머스킷']);
  // 박격포: 곡사 3 s, 떨어진 자리의 벽을 부순다
  const [W2, e2, [m2]] = mk({}, 1, '박격포'); A.addWall(W2, { x: 40, y: 75, r: 0.45, hp: 256, t: 1e9, own: -1, mat: 'earth', thick: 0.5 }); A.release(W2, m2, { s: W2.spells['박격포'], tx: 40, ty: 75 });
  for (let i = 0; i < 95; i++) A.stepWorld(W2); assert.ok(W2.walls.length === 0, '박격포가 벽을 부쉈다');
  // 돌아가며 쏘기: 세 줄이면 한 때에 한 줄만
  const [W3, e3, q3] = mk({}, 6, '머스킷', { volley: 3 }); for (const x of q3) { x.thinkT = 0; A.brain.think(W3, x); } assert.strictEqual(q3.filter(x => x.cast).length, 2, '여섯 중 한 줄(둘)만');
  // 사기: 열 중 여섯이 쓰러지면 남은 병사가 도망치고, 끝에 닿으면 빠진다. 둘뿐인 편은 도망치지 않는다
  const [W4, e4, q4] = mk({}, 10); for (let i = 0; i < 6; i++) q4[i].hp = 0; for (let i = 0; i < 30 * 30; i++) A.stepWorld(W4);
  assert.ok(q4.slice(6).every(x => x.flee) && q4.slice(6).some(x => x.alog.fled === 1 && x.hp === 0), '도망쳤다');
  const [W5, e5, q5] = mk({}, 2); q5[0].hp = 0; for (let i = 0; i < 30 * 10; i++) A.stepWorld(W5); assert.ok(!q5[1].flee);
  const [W6, e6, q6] = mk({ morale: false }, 10); for (let i = 0; i < 6; i++) q6[i].hp = 0; for (let i = 0; i < 30 * 10; i++) A.stepWorld(W6); assert.ok(q6.every(x => !x.flee));
});
ok('v2.0 두뇌: 무리는 장악권 바로 밖에 흩어지고, 대마법사는 총 앞에서 벽을 세우고 날면 62 m 밖에서 깎는다, 소금 땅에선 마법이 흩어진다', () => {
  const mk = (crowd, n, d, rules, arch) => { const W = A.createWorld({ seed: 2, width: 300, height: 200, obstacles: [], brain: A.brain, rules: Object.assign({ saltRing: false }, rules) }); const c = A.addMage(W, Object.assign(A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 성' }), arch), 0, 100, 100); const q = []; for (let i = 0; i < n; i++) q.push(A.addMage(W, A.mage(crowd), 1, 100 + d, 90 + i * 5)); A.stepWorld(W); return [W, c, q]; };
  // 무리: 70 m에서 반경(50) + 5 쪽으로 다가서고, 사거리가 짧으면(기본기) 예전 그대로
  const [W, c, q] = mk({ tier: '평범', deck: '조약돌' }, 5, 70); for (const x of q) { x.thinkT = 0; A.brain.think(W, x); } assert.ok(q.every(x => x.mv.x < 0), '다가선다');
  const [W1, c1, q1] = mk({ tier: '평범', deck: '조약돌' }, 5, 40); for (const x of q1) { x.thinkT = 0; A.brain.think(W1, x); } assert.ok(q1.every(x => x.mv.x > 0), '반경 안이면 물러난다');
  const [W2, c2, q2] = mk({ tier: '평범', deck: '조약돌' }, 5, 70, { domainR: 0 }); for (const x of q2) { x.thinkT = 0; A.brain.think(W2, x); } assert.ok(q2.every(x => x.mv.x < 0 && !x._k.stance.startsWith('k')), '반경이 없으면 기술이 꺼진다');
  // 대마법사: 땅에서 총 다섯이 40 m 앞이면 흙벽을 총 쪽으로 세운다
  const [W3, c3, q3] = mk({ tier: '병사', deck: '머스킷' }, 5, 40); for (const x of q3) x.thinkT = 1e9; let first = null; for (let i = 0; i < 60 && !first; i++) { c3.flyWant = false; A.stepWorld(W3); if (c3.cast) first = c3.cast; } assert.ok(first && first.s.n === '흙벽' && first.tx > c3.x && first.T > 3, '흙벽 ' + (first && first.s.n));
  // 날고 있으면 가장 가까운 총에서 62 m 쪽으로 물러난다
  const [W4, c4, q4] = mk({ tier: '병사', deck: '머스킷' }, 5, 40, {}, { z: 10 }); c4.thinkT = 0; A.brain.think(W4, c4); assert.ok(c4.mv.x < 0, '물러난다');
  // 소금 땅: 그 위에서 만들어지는 마법은 흩어지고, 뜰 수 없다
  const W5 = A.createWorld({ seed: 1, salt: [{ x: 0, y: 0, w: 20, h: 30 }], obstacles: [], rules: { domain: false } }), m5 = A.addMage(W5, A.mage({ tier: '대마법사' }), 0, 10, 15), e5 = A.addMage(W5, A.mage({ tier: '평범' }), 1, 30, 15);
  assert.strictEqual(A.gAt(W5, m5, W5.spells['돌 창'], 30, 15), 0); assert.strictEqual(A.gAt(W5, e5, W5.spells['돌 창'], 10, 15), 1); m5.flyWant = true; m5.fz = 6; for (let i = 0; i < 30; i++) A.stepWorld(W5); assert.strictEqual(m5.z, 0);
});
ok('v2.2 고수 싸움 (SPEC 26장): 리듬(틈이 있으면 들어가고 넘치기 직전엔 빠진다, 상급은 늦다), 장악권 밀기 거리, 헛손질 버리기, 강화는 필요할 때만, 모습 지표', () => {
  const R = require('../src/brain/techniques/rhythm'), E = require('../src/brain/techniques/efficacy');
  const mk = (sa, sb) => { const W = A.createWorld({ seed: 1, width: 200, height: 150, obstacles: [], brain: A.brain }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: sa, deck: '대마법사 운영' }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: sb, deck: '대마법사 운영' }), 1, 102, 75); A.stepWorld(W); return [W, m, e]; };
  const think = (W, m) => { m.thinkT = 0; A.brain.think(W, m); return m.phase; };
  // 장악권 밀기: 같은 신호(둘 다 시전 중)면 들어갈 거리 = 틈 3 m × 2 = 6 m
  const [W0, m0, e0] = mk('대가', '대가'); m0._act = e0._act = true; assert.ok(Math.abs(R.inDist(W0, m0, e0) - 6) < 1e-9);
  // 대가: 상대가 굳으면 들어가고(붙는 시간보다 틈이 길 때만), 넘치기 직전(92)이면 빠진다
  const [W1, m1, e1] = mk('대가', '대가'); e1.st.stun = 2; assert.strictEqual(think(W1, m1), 'in'); assert.ok(m1._k.prefR <= 12 && m1._k.pressB);
  const [W2, m2, e2] = mk('대가', '대가'); e2.st.stun = 0.1; e2.x = 190; assert.strictEqual(think(W2, m2), 'probe', '틈이 너무 짧다');
  const [W3, m3] = mk('대가', '대가'); m3.fat = 95; assert.strictEqual(think(W3, m3), 'out'); assert.ok(m3._k.prefR >= 22);
  const [W4, m4] = mk('상급', '대가'); m4.fat = 95; assert.strictEqual(think(W4, m4), 'probe', '상급은 97까지 버틴다');
  const [W5, m5] = mk('중급', '대가'); think(W5, m5); assert.strictEqual(m5.phase, 'probe'); assert.ok(!m5.mlog.phase.in, '중급은 리듬이 없다');
  // 효과 학습: 다섯 번 쓰고 못 맞힌 수는 버리고, 많이 맞힌 수는 더 쓴다
  const [W6, m6] = mk('대가', '대가'); m6.log.casts = { '낙뢰': 6, '짧은 실': 6 }; m6.log.hits = { '짧은 실': 3 }; const K = m6._k || (think(W6, m6), m6._k); K.S = W6.spells; E.prep(W6, m6, K);
  const o = n => { const x = { s: W6.spells[n], n, isOff: true, v: 1, tx: 0, ty: 0 }; E.value(W6, m6, K, x); return x.v; }; assert.ok(o('낙뢰') === 0 && o('짧은 실') > 1);
  // 강화의 때: 날고 있으면 걸음 강화는 뜻이 없다
  m6.fly = 1; const b = { s: W6.spells['근육 폭주'], n: '근육 폭주', isOff: false, v: 1 }; E.value(W6, m6, K, b); assert.strictEqual(b.v, 0);
  // 모습 지표
  const r = A.duel(A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 운영' }), A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 운영' }), { seed: 2 }), L = A.look(r.ms[0], r.t);
  for (const k of ['거리 흔들림', '칸 A 공격', '헛손질 비율', '장악 경계 틈 (m)', '장악 경계 이동 (m/s)', '세운 지형', '없앤 지형']) assert.ok(k in L, k);
  assert.ok(r.ms.some(q => Object.keys(q.mlog.phase).length >= 2), '단계가 바뀐다');   // v2.8: 이 판의 전설은 떠보기만 한다(붙잡아 둔 수로 친다)
});
ok('v2.0 비행 (SPEC 24장): 대마법사만 계속 난다, 떠 있으면 발밑 공격·함정에 닿지 않고 총은 맞는다, 굳으면 떨어진다(높이 × 4), 넓은 결투장', () => {
  const FL = A.RULES.find(r => r.name === 'flight').api;
  assert.ok(FL.canFly({ C: 10, fat: 0 }) && FL.canFly({ C: 5, fat: 0 }) && !FL.canFly({ C: 2.5, fat: 0 }) && !FL.canFly({ C: 5, fat: 100 }), '출력 75 kW');
  const mk = (rules, C = 10) => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 200, height: 150, rules: Object.assign({ domain: false, saltRing: false }, rules) }); const q = A.addMage(W, { C, book: [] }, 0, 100, 75), f = A.addMage(W, { book: ['머스킷', '번개 지뢰'], allowBanned: true }, 1, 110, 75); return [W, q, f]; };
  const up = (W, q, n = 60) => { for (let i = 0; i < n; i++) { q.flyWant = true; q.fz = 6; q.fv = 0; q.mv.x = q.mv.y = 0; q.thinkT = 9; A.stepWorld(W); } };
  const [W, q, f] = mk({}); f.thinkT = 1e9; up(W, q); assert.ok(q.fly === 1 && q.z > 5 && q.z <= 6.5, '떴다 ' + q.z); assert.ok(W._fly && A.snapshot(W).m[0].length === 12, '녹화에 높이·속도');
  // 안 보이는 지연 폭발·함정은 닿지 않는다
  const h0 = q.hp; W.areas.push({ x: q.x, y: q.y, r: 2, t: 0, s: { n: '시험', dmg: 50, kind: 'blunt', stun: 1 }, src: f, pow: 1, vis: false, g: 1 }); W.traps.push({ x: q.x, y: q.y, r: 1, s: W.spells['번개 지뢰'], src: f, pow: 1, seen: new Set(), t: 30 }); up(W, q, 3);
  assert.ok(q.hp === h0 && q.fly === 1, '발밑 공격에 닿았다 ' + (h0 - q.hp));
  // 총은 그대로 맞는다 (높이로 겨냥한다)
  const hits = []; for (let s = 1; s <= 12 && !hits.length; s++) { const [W2, q2, f2] = mk({}); f2.thinkT = 1e9; up(W2, q2); f2.noise = 0; const g0 = q2.hp; A.release(W2, f2, { s: W2.spells['머스킷'], tx: q2.x, ty: q2.y, tgt: q2 }); up(W2, q2, 20); if (q2.hp < g0) hits.push(g0 - q2.hp); }
  assert.ok(hits.length && hits[0] > 20, '총이 안 맞았다');
  // 굳으면 떨어진다: 피해 = 떨어지기 시작한 높이 × 4, 땅에서 1 s 굳음. 몸 받침은 받치지 않는다
  const [W3, q3, f3] = mk({}); f3.thinkT = 1e9; up(W3, q3); const z0 = q3.z, h3 = q3.hp; q3.st.stun = 0.5; let n = 0; while (q3.z > 0 && n++ < 90) A.stepWorld(W3);
  assert.ok(q3.fly === 0 && q3.flog.falls === 1 && Math.abs(h3 - q3.hp - z0 * 4) < 1e-6 && q3.st.stun > 0.9, '추락 ' + (h3 - q3.hp) + ' / ' + z0);
  // 중간은 못 난다, 비행을 끄면 늘 땅
  const [W4, q4] = mk({}, 2.5); up(W4, q4, 10); assert.ok(q4.z === 0 && q4.fly === 0);
  const [W5, q5] = mk({ flight: false }); up(W5, q5, 10); assert.ok(q5.z === 0 && q5.fly === 0 && !W5._fly);
  // 결투장: 대마법사가 끼면 200 × 150 (넓이를 주면 그대로, 비행을 끄면 40 × 30)
  const ar = o => { const W = A.sceneWorld(Object.assign({ seed: 1, sides: [{ mages: [{ tier: '대마법사' }] }, { mages: [{ tier: '평범' }] }] }, o)); return W.width + 'x' + W.height; };
  assert.strictEqual(ar({}), '200x150'); assert.strictEqual(ar({ width: 40, height: 30 }), '40x30'); assert.strictEqual(ar({ rules: { flight: false } }), '40x30');
  // 대마법사끼리: 날고, 같은 씨앗이면 같다
  const d = () => A.duel(A.mage({ tier: '대마법사', skill: '상급' }), A.mage({ tier: '대마법사', skill: '상급' }), { seed: 4 });
  const r1 = d(), r2 = d(); assert.ok(r1.ms[0].flog.t > 1 && r1.t === r2.t && r1.ms[0].hp === r2.ms[0].hp && r1.ms[1].flog.v === r2.ms[1].flog.v);
});
ok('v2.0 판단: 떨어지는 돌을 읽고, 소금 선 가까이선 피하기보다 가운데로, 선 밖에 떨어질 이동은 안 한다, 단계 데이터', () => {
  const mk = (tac, rules) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules }); const m = A.addMage(W, A.mage({ tier: '평범', skill: '상급', tac }), 0, 15, 15), e = A.addMage(W, A.mage({ tier: '평범', deck: '흙' }), 1, 25, 15); A.stepWorld(W); return [W, m, e]; };
  // 곡사: 떨어질 자리 안이면 비킨다 (readLob을 끄면 그대로 걷는다)
  const lob = tac => { const [W, m, e] = mk(tac); m.rollCd = 9; W.lobs.push({ x: m.x + 0.3, y: m.y, t: 0.8, s: W.spells['곡사 돌'], src: e, pow: 1, r: 1 }); m.thinkT = 0; A.brain.think(W, m); return m.mv.x; };
  assert.ok(lob({}) < 0, '곡사를 안 피했다'); assert.ok(!(lob({ readLob: false }) < -1), 'readLob을 꺼도 피했다');
  // 소금 선 가까이: 적 지대를 피하는 걸음이 바깥을 가리켜도 가운데로
  const [W, m, e] = mk({}); W.t = 60; const R = A.saltR(W), cx = W.width / 2, cy = W.height / 2; m.x = cx + R - 0.8; m.y = cy; m.rollCd = 9;
  W.zones.push({ k: 'nh3', shape: 'circle', r: 1.5, x: m.x - 0.5, y: m.y, a: 0, src: e, dps: 1, t: 5, n: '시험' }); m.thinkT = 0; A.brain.think(W, m); assert.ok(m.mv.x < 0, '소금 선 밖으로 피했다 ' + m.mv.x);
  // 단계 데이터 (SPEC 13·24장)
  const T = n => A.SKILLS[n].tac; assert.ok(T('대가').slotBOff === false && T('대가').feint === false && T('대가').simul === false);
  assert.ok(T('전설').shieldSave === false && T('전설').learnAim === 'wide' && T('전설').simul === true && T('전설').feint === 0.12 && T('상급').slotBOff === undefined);
});
ok('v2.0 이단: 위력 × 0.9, 머리 회복 × 1.3', () => {
  const W = A.createWorld({ seed: 1, obstacles: 0 }), s = W.spells['돌 창'], h = A.addMage(W, { book: ['돌 창'], type: '이단' }, 0, 5, 15), b = A.addMage(W, { book: ['돌 창'], type: '서퍼' }, 1, 35, 15);
  assert.ok(Math.abs(A.power(W, h, s) / A.power(W, b, s) - 0.9) < 1e-12);
  h.fat = b.fat = 50; A.stepWorld(W); assert.ok(Math.abs((50 - h.fat) / (50 - b.fat) - 1.3) < 1e-9);
});
ok('v2.3 날기 끊기 (SPEC 27장): 급정지 5 g, 떨어지면 닿는 속도의 높이 × 4, 공기 쿠션이면 0, 끊은 동안 서클·출력이 풀린다, 옆 튀기, 끄면 없다', () => {
  const mk = (rules = {}) => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 200, height: 150, rules: Object.assign({ domain: false, saltRing: false, flightCut: true }, rules) }); const q = A.addMage(W, Object.assign(A.mage({ tier: '대마법사', skill: '대가' }), { z: 8 }), 0, 50, 75), e = A.addMage(W, A.mage({}), 1, 190, 140); q.thinkT = e.thinkT = 1e9; q.fz = 8; q.fv = 40; q.mv.x = 1; return [W, q]; };
  const st = (W, n) => { for (let i = 0; i < n; i++) A.stepWorld(W); };
  let [W, q] = mk(); st(W, 90); const v0 = Math.hypot(q.vx, q.vy); q.cut.w = 1; st(W, 3); assert.ok(Math.abs(v0 - 5 * 9.8 * 0.1 - Math.hypot(q.vx, q.vy)) < 0.2 && q.flog.brake === 1, '급정지');
  [W, q] = mk(); st(W, 60); const s = W.spells['낙뢰'], p1 = A.power(W, q, s), z0 = q.z, h0 = q.hp; q.cut.w = 4; st(W, 1);
  const U = require('../src/brain/util'); require('../src/brain/hooks').hooks(W);
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
  const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 60, height: 40, rules: Object.assign({ domain: false, saltRing: false, fort: true, trapChain: true }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 진지' }), 0, 10, 20), e = A.addMage(W, A.mage({ tier: '중간' }), 1, 40, 20), e2 = A.addMage(W, A.mage({ tier: '중간' }), 1, 42, 26); m.thinkT = e.thinkT = e2.thinkT = 1e9; return [W, m, e, e2]; };
  const trap = (W, m, x, y) => { const t = { x, y, s: W.spells['번개 지뢰'], src: m, arm: 0, seen: new Set([m.id]), pow: 1, r: 0.9, chain: 0 }; W.traps.push(t); return t; };
  let [W, m, e, e2] = mk(); assert.strictEqual(A.trapCap(W, m), m.circles); assert.strictEqual(A.trapCap(mk({ fort: false })[0], m), 3);
  // 연쇄: e가 밟은 함정 곁(2 m)의 함정이 0.2 s 뒤 터져 그 곁(밟지는 않은 1.1 m)의 e2를 친다
  e.x = 30; e.y = 20; e2.x = 30; e2.y = 23.1; trap(W, m, 30, 20); const t2 = trap(W, m, 30, 22); const h2 = e2.hp; for (let i = 0; i < 10; i++) A.stepWorld(W);
  assert.ok(t2.done && e2.hp < h2 && e2.st.stun > 0 && m.fort.chain === 1, '연쇄');
  [W, m, e, e2] = mk({ trapChain: false }); e.x = 30; e.y = 20; e2.x = 30; e2.y = 23.1; trap(W, m, 30, 20); const t3 = trap(W, m, 30, 22); for (let i = 0; i < 10; i++) A.stepWorld(W); assert.ok(!t3.done, '연쇄를 끄면 그대로');
  // 하늘 덮개: 떠 있는 적만 0.5 s마다 굳힌다
  [W, m, e, e2] = mk(); A.release(W, m, { s: W.spells['하늘 덮개'], tx: 40, ty: 20, tgt: e }); const z = W.zones.find(q => q.k === 'sky'); assert.ok(z && z.r > 10);
  e.x = z.x; e.y = z.y; e.z = 5; e.fly = 1; e2.x = z.x + 2; e2.y = z.y; for (let i = 0; i < 16; i++) A.stepWorld(W); assert.ok(e.fly === 2 && e2.st.stun <= 0 && m.fort.skyZap >= 1, '덮개');
  // 비·불이 적의 함정을 치운다
  [W, m, e, e2] = mk(); const t4 = trap(W, e, 20, 20), t5 = trap(W, e, 20, 30); A.release(W, m, { s: W.spells['비 뿌리기'], tx: 20, ty: 20, tgt: e }); for (const h of W.H.ignite) h(W, 20, 30, 1.5, m);
  assert.ok(t4.done && t5.done && m.fort.clear === 2, '치우기');
  // 짓기: 대마법사 대가가 진지를 세우고 벽·함정·덮개를 짓는다 (끄면 짓기 단계가 없다)
  const g = rules => { const w = A.sceneWorld({ seed: 2, rules, sides: [{ mages: [{ tier: '대마법사', skill: '대가', deck: '대마법사 진지' }] }, { mages: [{ tier: '대마법사', skill: '상급', deck: '대마법사 진지' }] }] }); while (!A.over(w)) A.stepWorld(w); return w.ms[0]; };
  const on = g({ fort: true, trapChain: true }), off = g({});
  assert.ok(on.fort.founded >= 1 && on.fort.walls + on.fort.traps + on.fort.sky >= 3 && on.mlog.phase.build > 0, '짓기 ' + JSON.stringify(on.fort));
  assert.ok(!off.mlog.phase.build && !off.fort.founded && !off.book.includes('하늘 덮개'), '끄면 짓지 않는다');
});
ok('v2.4 두 겹의 두뇌·끊는 움직임·청사진·매 걸음 녹화 (SPEC 28장)', () => {
  const mk = (rules, tac) => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 60, height: 40, rules: Object.assign({ domain: false, saltRing: false, flight: false }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 청사진', tac }), 0, 20, 20), e = A.addMage(W, A.mage({ tier: '중간' }), 1, 45, 20); m.thinkT = e.thinkT = 1e9; return [W, m, e]; };
  const st = (W, n) => { for (let i = 0; i < n; i++) A.stepWorld(W); };
  // 끊는 움직임: 가속 한계(대마법사 2.5 g × 1.83, 거꾸로 밟으면 두 배) 안에서 곧장. 목표에서 딱 멎는다
  let [W, m] = mk({ snap: true }); const a = A.RULES.find(r => r.name === 'snap').api.aOf(W, m); assert.ok(Math.abs(a - 9.8 * 2.5 * (1 + 0.25 * Math.log2(10))) < 1e-6);
  m.mv.x = 1; st(W, 30); const v0 = m.vx; m.mv.x = -1; st(W, 1); assert.ok(Math.abs(v0 - m.vx - 2 * a * A.DT) < 1e-9, '거꾸로 밟으면 한 걸음에 2a·DT');   // 앞뒤로 줄이기는 2a, 옆은 a st(W, 20); assert.ok(Math.abs(m.vx + v0) < 1e-9, '목표에서 멎는다');
  [W, m] = mk({}); m.mv.x = 1; st(W, 30); const w0 = m.vx; m.mv.x = -1; st(W, 20); assert.ok(Math.abs(m.vx + w0) > 1e-3, '끄면 예전처럼 스르르');
  // 끊어 걷기: 모으는 동안 제 속도, 풀리기 0.12 s 전부터 멈춤
  [W, m] = mk({ snap: true }); m.mv.x = 1; st(W, 30); const v1 = m.vx; m.cast = { s: W.spells['낙뢰'], tgt: null, tx: 40, ty: 20, t: 0, T: 1, B: false }; st(W, 10); assert.ok(Math.abs(m.vx - v1) < 1e-9, '모으는 동안 걷는다'); st(W, 20); assert.ok(m.vx < v1 * 0.5, '풀리기 전에 멈춘다');
  // 반사 겹: 날아오는 투사체를 반응 지연(대가 0.1 s) 뒤 매 걸음 안에 피한다(판단 없이). 반사 겹이 없으면 그대로
  const shot = (tac) => { const [W2, m2, e2] = mk({ reflex: true }, tac); W2.proj.push({ x: 30, y: 20, vx: -20, vy: 0, z: 0, vz: 0, home: false, life: 2, s: W2.spells['돌 창'] || { n: '시험', el: '흙', m: 1 }, src: e2, pow: 1, rad: 0.1, t0: W2.t }); let n = 0; while (!(m2.roll > 0) && n < 15) { A.stepWorld(W2); n++; } A.stepWorld(W2); return [n, m2]; };   // 반응 시간은 다음 걸음에 센다
  const [n1, r1] = shot({}); assert.ok(n1 >= 3 && n1 <= 5 && r1.rx.dodge === 1 && r1.rx.rN === 1, '반사로 굴렀다 ' + n1); const [n2] = shot({ reflex: 0 }); assert.strictEqual(n2, 15, '반사 겹이 없으면 판단 없이는 안 구른다');
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
  const rec = n => { const w = A.createWorld({ seed: 1, record: true, recEvery: n }); A.addMage(w, A.mage({}), 0, 5, 5); A.addMage(w, A.mage({}), 1, 30, 5); for (let i = 0; i < 60; i++) A.stepWorld(w); return w.rec.length; };
  assert.ok(rec(1) === 60 && rec(undefined) === 30, '녹화 간격');
  // 판단까지: 모두 켜면 반사·발놀림·청사진이 쓰이고, 같은 씨앗이면 같다
  const g = () => { const w = A.sceneWorld({ seed: 2, rules: { flightCut: true, fort: true, reflex: true, snap: true, blueprint: true }, sides: [{ mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }] }, { mages: [{ tier: '대마법사', skill: '대가', deck: '대마법사 청사진' }] }] }); while (!A.over(w)) A.stepWorld(w); return w; };
  const x = g(), y = g(); assert.ok(x.t === y.t && x.ms[0].hp === y.ms[0].hp && x.ms[0].rx.dodge === y.ms[0].rx.dodge && x.ms[0].rx.dodge + x.ms[0].rx.juke > 0 && x.ms[0].rx.flips > 0 && x.ms[0].fort.bpN + x.ms[1].fort.bpN > 0, '판단');
});
ok('v2.5 작전 겹과 각도 판단 (SPEC 29장): 대가부터 작전을 고르고, 숨은 상대엔 사냥(보이는 자리로), 다 잡은 상대엔 끝내기, 끄면 없다', () => {
  const mk = (rules, sa = '전설', sb = '대가') => { const W = A.createWorld({ seed: 1, obstacles: [{ x: 60, y: 40, r: 1.8 }], width: 120, height: 80, rules: Object.assign({ saltRing: false, tactics: true }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: sa, deck: '대마법사 청사진' }), 0, 40, 40), e = A.addMage(W, A.mage({ tier: '대마법사', skill: sb, deck: '대마법사 청사진' }), 1, 62.5, 40); return [W, m, e]; };
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
  const g = () => { const w = A.sceneWorld({ seed: 3, rules: { flightCut: true, fort: true, reflex: true, snap: true, blueprint: true, tactics: true }, sides: [{ mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }] }, { mages: [{ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }] }] }); while (!A.over(w)) A.stepWorld(w); return w; };
  const x = g(), y = g(); assert.ok(x.t === y.t && x.ms[0].hp === y.ms[0].hp && x.ms[0].op.log.pick >= 1 && x.ms[0].op.log.ticks > 5 && JSON.stringify(x.ms[0].op.log) === JSON.stringify(y.ms[0].op.log), '판단');
  const L = A.look(x.ms[0], x.t); assert.ok('작전 바꾼 수' in L && '자리: 한쪽 사거리' in L);
});
ok('v2.6 스스로 죽지 않기·날카롭게 (SPEC 30장): 머리 넘침 막기, 소금 원의 벽, 땅이 안전한가, 막힌 직사 끊기, 걸음마다 지표', () => {
  const U = require('../src/brain/util'), SR = require('../src/rules/saltRing'), Wt = require('../metrics/watch'), sharp = require('../src/brain/techniques/sharp');
  const mk = (sa = '전설', sb = '전설', deck = '대마법사 청사진', obstacles) => { const W = A.createWorld({ seed: 1, width: 200, height: 150, obstacles: obstacles || [], rules: { flightCut: true, fort: true, blueprint: true } }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: sa, deck }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: sb, deck }), 1, 110, 75); A.stepWorld(W); require('../src/brain/hooks').hooks(W); return [W, m, e]; };
  // 머리 넘침: 전설(파도 고르기)은 100에서 굳는다 → 97을 넘길 수는 버린다. 고른 파도·탄 파도는 165까지. 대가(고르지 않음)도 파도에 오를 수는 버린다
  let [W, m, e] = mk(); m.z = 0; m.fly = 0; m.fat = 90; assert.ok(U.heatOver(W, m, 7, 0, 1) && !U.heatOver(W, m, 3, 0, 1), '전설 넘침');
  m.waveWant = true; assert.ok(!U.heatOver(W, m, 7, 0, 1)); m.waveWant = false; m.wave = 1; m.fat = 150; assert.ok(!U.heatOver(W, m, 7, 0, 1) && U.heatOver(W, m, 12, 0, 1), '탄 파도는 165까지');
  [W, m, e] = mk('대가', '대가'); m.fat = 95; m.z = 0; m.fly = 0; assert.ok(U.heatOver(W, m, 3, 0, 1), '대가는 고르지 않은 파도에 오르지 않는다');
  // 땅이 안전한가: 적의 책에 함정·안 보이는 구름·벽 밀기·가두기가 있으면 아니다
  W.rules.bluntK = 0; assert.ok(!U.groundSafe(W, m)); W.rules.bluntK = 2.3; assert.ok(U.groundSafe(W, m), '마법의 부딪힘에 비율 감쇠가 있으면(v2.7) 함정은 한 방이 아니다'); W.rules.bluntK = 0; [W, m, e] = mk('전설', '전설', '기본기'); W.rules.bluntK = 0; assert.ok(U.groundSafe(W, m) === !U.deck(e, W.spells).ground);
  // 소금 원의 벽: 원이 반지름 20 m일 때 선 가까이에서 바깥으로 가려는 걸음은 지워지고 안으로 돈다
  [W, m, e] = mk(); W.t = 15 + 60 * (125.0 - 20) / (125.0 - 4); W.rules.saltRing = true; m.x = 100 + 18.5; m.y = 75; m.vx = 6; m.vy = 0; m.fly = 0; m.z = 0;
  const K = { vx: 2, vy: 0.5, foes: [e], e }, B = SR.brain(U); B.bound(W, m, K); assert.ok(K.vx < 0, '안으로 ' + K.vx);
  const o = { v: 8, cd: 1, skip: false, dx: 1, dy: 0 }; SR.engine({ hurt() {}, DT: 1 / 30 }).roll(W, m, o); assert.ok(o.dx < 0 || o.skip, '선 밖으로 구르지 않는다');
  m.tac.survive = false; const K2 = { vx: 2, vy: 0.5 }; B.bound(W, m, K2); assert.strictEqual(K2.vx, 2, '기술이 없으면 그대로');
  // 막힌 직사 끊기: 바위 뒤 과녁에 실을 모으면 끊고 당을 돌려받는다
  [W, m, e] = mk('대가', '대가', '대마법사 청사진', [{ x: 100, y: 75, r: 2 }]); m.z = e.z = 0; const g0 = m.glu;
  m.cast = { s: W.spells['체인'], tgt: e, tx: e.x, ty: e.y, t: 0, T: 0.4, cost: 4 }; sharp.losCancel(W, m, { los: false, e }); assert.ok(!m.cast && m.glu > g0 && m.mlog.losCut === 1, '끊기');
  // 판 하나 (v2.6의 규칙: 버티기·마법의 부딪힘 감쇠 없이): 걸음마다 지표, 같은 씨앗이면 같다. 전설끼리 추락 피해가 기술이 없을 때보다 적다
  const sc = SCENES['v2-tactics-legend'], run = tac => { const x = JSON.parse(JSON.stringify(sc)); x.seed = 2; x.rules = Object.assign({}, x.rules, { endureK: 0, bluntK: 0 }); if (tac) for (const sd of x.sides) sd.mages[0].tac = tac; const w = A.sceneWorld(x); while (!A.over(w)) { A.stepWorld(w); Wt.watch(w); } return w.ms.map(q => Wt.seen(w, q)); };
  const a = run({ read: 0 }), b = run({ read: 0 }), c = run({ survive: false, sharp: false, read: 0 });   // 수읽기(v2.15)는 끄고 이 둘만 견준다
  assert.deepStrictEqual(a, b); for (const k of ['스스로 입은 몫', '사거리 안 짓는 몫', '사거리 안 두 칸 몫', '쓸모 있는 벽 몫', '빈틈 찌른 몫', '폭주', '막힌 직사 몫']) assert.ok(k in a[0], k);
  const fall = r => r.reduce((x, q) => x + q['받은 피해'] * q['추락 몫'], 0), over = r => r.reduce((x, q) => x + q['폭주'], 0); assert.ok(fall(a) < fall(c) && over(a) < over(c), '추락 ' + fall(a) + ' < ' + fall(c) + ', 폭주 ' + over(a) + ' < ' + over(c));
});
ok('v2.7 마법의 부딪힘 감쇠·버티기·몰아치기 (SPEC 31장): 돌 비가 대마법사를 한 방에 죽이지 않고, 중간까지는 회복이 그대로, 판단이 잦아도 박자 흔들기는 초당 같다', () => {
  const BD = require('../src/rules/body').engine(), hit = (rules, name, tier = '대마법사') => { const W = A.createWorld({ seed: 1, obstacles: 0, rules }); const m = A.addMage(W, A.mage({ tier }), 0, 10, 10); return BD.hurtMod(W, m, 783, 'blunt', name); };
  // 상위의 돌 비 한 방(14 × 5^2.5 = 783): 굳은 살만이면 771, 감쇠가 있으면 ÷ 10^2.3. 총(마법이 아님)·벽 밀기는 굳은 살만
  assert.ok(Math.abs(hit({ bluntK: 0 }, '돌 비') - 771) < 1e-6); assert.ok(Math.abs(hit({}, '돌 비') - 771 / Math.pow(10, 2.3)) < 1e-6, '감쇠');
  assert.ok(Math.abs(hit({}, '벽 밀기') - 771) < 1e-6 && Math.abs(hit({}, '머스킷') - 771) < 1e-6, '총·벽 밀기는 그대로'); assert.strictEqual(hit({}, '돌 비', '평범'), 783, '평범(선명도 1)은 그대로');
  // 버티기: 평범·중간 × 1, 대마법사 × (10/2.5)^endureK (머리·당 모두)
  const rec = (tier, rules) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false }, rules) }); const m = A.addMage(W, A.mage({ tier }), 0, 10, 10); A.addMage(W, A.mage({ tier: '평범' }), 1, 300, 10); m.fat = 50; m.glu = 10; m.thinkT = 1e9; W.ms[1].thinkT = 1e9; A.stepWorld(W); return [50 - m.fat, m.glu - 10]; };
  for (const t of ['평범', '중간']) assert.deepStrictEqual(rec(t, {}), rec(t, { endureK: 0 }), t + '는 그대로');
  const [f1, g1] = rec('대마법사', {}), [f0, g0] = rec('대마법사', { endureK: 0 }), k = Math.pow(4, A.DEFAULT_RULES.endureK); assert.ok(Math.abs(f1 / f0 - k) < 1e-6 && Math.abs(g1 / g0 - k) < 1e-6, '대마법사 × ' + k);
  // 대마법사 둘 대 상위 여섯(상위는 돌 비가 든 덱): 대마법사가 이긴다
  const sc = SCENES['v2-archmage-2v6']; for (let s2 = 1; s2 <= 4; s2++) assert.strictEqual(A.runScene(Object.assign({}, sc, { seed: s2 })).winner, 0, '씨앗 ' + s2);
  // 박자 흔들기: 날카롭게(대가부터)는 한 번의 확률이 판단 간격에 비례한다(0.13 s에 20%), 몰아칠 때(과녁이 굳음)는 쉬지 않는다
  const tempo = require('../src/brain/techniques/tempo'), W = A.createWorld({ seed: 1 }), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 10, 10), e = A.addMage(W, A.mage({ tier: '대마법사' }), 1, 30, 10);
  let n = 0; for (let i = 0; i < 4000; i++) { m.hold = 0; if (tempo.hold(W, m, { T: m.tac, slot: 'A', aimed: false, e })) n++; } assert.ok(Math.abs(n / 4000 - 0.2 * m.dec / 0.13) < 0.02, '초당 ' + n / 4000);
  e.st.stun = 1; n = 0; for (let i = 0; i < 400; i++) { m.hold = 0; if (tempo.hold(W, m, { T: m.tac, slot: 'A', aimed: false, e })) n++; } assert.strictEqual(n, 0, '굳은 과녁엔 쉬지 않는다');
});
ok('v2.8 붙잡아 둔 설계·명중 가망·방패의 때 (SPEC 32장): 다 지은 두 번째 칸을 붙잡았다가 틈에 풀고, 구를 수 있는 과녁엔 가망이 낮고, 구름엔 방패를 들지 않는다', () => {
  const sharp = require('../src/brain/techniques/sharp'), U = require('../src/brain/util');
  const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false, saltRing: false }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }), 0, 10, 10), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 청사진' }), 1, 25, 10); m.thinkT = e.thinkT = 1e9; return [W, m, e]; };
  // 엔진: 붙잡은 두 번째 칸은 다 지어도 풀리지 않고 머리가 든다. go면 풀린다. 규칙을 끄면 바로 풀린다
  let [W, m, e] = mk({}); const s = W.spells['짧은 실'], c = { s, tgt: e, tx: e.x, ty: e.y, t: 0, T: 0.2, B: true, cost: 3, hold: true, go: false, holdUntil: 3 };
  m.castB = c; m.fat = 10; for (let i = 0; i < 30; i++) A.stepWorld(W); assert.ok(m.castB === c && m.fat > 10 - 30 * A.DT * 4 * 3.1, '붙잡는다'); c.go = true; A.stepWorld(W); assert.ok(m.castB !== c && m.log.casts['짧은 실'] === 1, 'go면 푼다');
  [W, m, e] = mk({ hold: false }); m.castB = Object.assign({}, c, { go: false, t: 0 }); for (let i = 0; i < 10; i++) A.stepWorld(W); assert.strictEqual(m.log.casts['짧은 실'], 1, '끄면 바로 푼다');
  // 명중 가망: 구를 수 있는 과녁 < 굳은 과녁, 판 중에 빗나간 수가 쌓이면 내려간다
  [W, m, e] = mk({}); const K = { e, d: 15 }, o = { n: '짧은 실', he: 0.35 }; e.rollCd = 0; e.stam = 6; e.fly = 0; const free = sharp.chance(W, m, K, o, 0.3); e.st.stun = 1; const pin = sharp.chance(W, m, K, o, 0.3); assert.ok(pin > 3 * free, pin + ' > ' + free);
  e.st.stun = 0; m.log.casts['짧은 실'] = 10; m.log.hits['짧은 실'] = 0; assert.ok(sharp.chance(W, m, K, o, 0.3) < free / 3, '빗나감이 쌓이면');
  // 방패의 때: 0.4 s 안에 닿는 실에만. 구름·붙잡아 둔 수에는 아니다
  const th = (st, T, t, hold) => sharp.threatSoon(W, m, { threat: { s: W.spells[st], T, t, hold, go: false }, d: 15 });
  assert.ok(th('짧은 실', 0.25, 0.1) && !th('짧은 실', 1, 0.1) && !th('번개 그물', 0.3, 0.29) && !th('짧은 실', 0.2, 0.3, true));
  // 판 하나: 붙잡았다가 푼 수가 있고 같은 씨앗이면 같다
  const sc = SCENES['v2-tactics-legend'], g = () => { const w = A.sceneWorld(Object.assign({}, sc, { seed: 2 })); while (!A.over(w)) A.stepWorld(w); return w; }, x = g(), y = g();
  assert.ok(x.t === y.t && x.ms[0].mlog.held + x.ms[1].mlog.held > 0 && x.ms[0].mlog.held === y.ms[0].mlog.held, '붙잡아 푼 수 ' + x.ms[0].mlog.held);
});
ok('v2.9 몰아치기·빈 칸의 준비·벽 자리·성적표 (SPEC 33장): 틈엔 문턱이 낮고, 기다리는 동안 벽·함정, 세운 벽에 머문다, 무리 기준, 성적표', () => {
  const sharp = require('../src/brain/techniques/sharp'), P = sharp.P;
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
  const CR = require('../experiments/crowd'), sc = CR.scene(6, 1), cm = sc.sides[1].mages;
  assert.ok(sc.width === 200 && sc.height === 150 && sc.rules.tactics && cm.filter(x => x.skill === '대가').length === 3 && new Set(cm.map(x => x.deck)).size === 3);
  // 걸음마다 지표의 새 칸, 성적표
  const Wt = require('../metrics/watch'), w = A.sceneWorld(Object.assign({}, SCENES['v2-tactics-legend'], { seed: 1, maxT: 20 })); while (!A.over(w)) { A.stepWorld(w); Wt.watch(w); }
  const lk = Wt.seen(w, w.ms[0]); for (const k of ['짓지 않는 몫', '들어가기 몫', '끝내기 몫', '제 벽 곁 몫', '벽 뒤에서 쏜 몫']) assert.ok(lk[k] >= 0 && lk[k] <= 1, k);
  const R = require('../experiments/report'), md = R.render({ versions: { '2.10.0': { date: 'd', N: 1, crowd: 1, o: { '공격 명중률': 0.25, '무리:6': [1, 0.5] } }, '2.9.0': { date: 'd', N: 1, crowd: 1, o: {} } } });
  assert.ok(md.indexOf('v2.9.0 | v2.10.0') > 0 && md.includes('| 25% |') && md.includes('100% · 50%'), '성적표: 버전 차례');
});
ok('v2.10 명중 가망은 전설만·시야 공격에만 벽·벽이 실을 끊는다·협공 (SPEC 34장)', () => {
  const sharp = require('../src/brain/techniques/sharp'), SW = require('../src/brain/techniques/swarm');
  assert.ok(A.mage({ tier: '대마법사', skill: '전설' }).tac.aim && !A.mage({ tier: '대마법사', skill: '대가' }).tac.aim, '명중 가망은 전설');
  // 시야 공격 몫: 덱의 직사 몫에서 시작해 판 중에 준 피해로
  const W = A.createWorld({ seed: 1, obstacles: 0, rules: { flight: false, saltRing: false } }), m = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 청사진' }), 0, 50, 50), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 청사진' }), 1, 70, 50);
  const s0 = sharp.losShare(W, e); assert.ok(s0 > 0.2 && s0 < 0.5, '덱 ' + s0); e.log.dealt['짧은 실'] = 300; assert.ok(sharp.losShare(W, e) > 0.8, '실로 맞았다');
  e.log.dealt['짧은 실'] = 0; e.log.dealt['낙뢰'] = 300; const K = { e, d: 20, waitT: -9, wallT: -9, los: true, ux: 1, uy: 0 }; const o = { s: W.spells['석회 기둥'], v: 0.5, he: 0.35 }; sharp.value(W, m, K, o); assert.strictEqual(o.v, 0, '구름이 주력이면 벽을 세우지 않는다');
  const g = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 1, 90, 50); assert.ok(sharp.losShare(W, g) > 0.9, '총은 시야 공격');
  // 벽이 실을 끊는다: 둘 다 땅이면 막고, 한쪽이 2 m 넘게 떠 있으면 넘는다
  const shot = z => { const W2 = A.createWorld({ seed: 1, obstacles: 0, rules: { flight: false, saltRing: false, evade: false } }), a = A.addMage(W2, A.mage({ tier: '대마법사', skill: '대가' }), 0, 10, 10), b = A.addMage(W2, A.mage({ tier: '대마법사', skill: '대가' }), 1, 25, 10); a.thinkT = b.thinkT = 1e9; b.z = z; b.autoDodge = false;
    A.addWall(W2, { x: 17, y: 10, r: 0.7, hp: 100, t: 30, own: 1 }); a.cast = { s: W2.spells['짧은 실'], tgt: b, tx: b.x, ty: b.y, t: 0, T: 0.1, cost: 0 }; for (let i = 0; i < 8; i++) A.stepWorld(W2); return a.log.hits['짧은 실'] || 0; };
  assert.strictEqual(shot(0), 0, '벽이 실을 끊는다'); assert.strictEqual(shot(3), 1, '떠 있으면 넘는다');
  // 협공: 상위는 대마법사(선명도 두 배)에게 무리 싸움, 둘레를 나눠 선다
  const spread1 = (tac, sd) => { const w = A.sceneWorld(require('../experiments/crowd').scene(14, sd, tac)); let res = 0, rn = 0, on = null;
    for (let i = 0; i < 600; i++) { A.stepWorld(w); if (i === 150) on = w.ms.slice(1).every(q => q.hp <= 0 || SW.on(w, q, w.ms[0])); if (i % 15) continue; const a0 = w.ms[0], sp = w.ms.slice(1).filter(q => q.hp > 0); if (sp.length < 3) continue; let sx = 0, sy = 0; for (const q of sp) { const d = Math.hypot(q.x - a0.x, q.y - a0.y); sx += (q.x - a0.x) / d; sy += (q.y - a0.y) / d; } res += Math.hypot(sx, sy) / sp.length; rn++; }
    return [on, res / rn]; }, spread = tac => { const a = spread1(tac, 1), b = spread1(tac, 2); return [a[0] && b[0], (a[1] + b[1]) / 2]; };   // 두 판 평균 (한 판은 대마법사의 움직임에 흔들린다)
  const [on, r1] = spread(null), [, r0] = spread({ swarmR: 0 }); assert.ok(r1 < 0.9 && r1 < r0 - 0.03, '둘레로 흩어진다 (20 s 평균, 동료 방향의 합) ' + r1.toFixed(2) + ' / 끄면 ' + r0.toFixed(2));
  assert.ok(on, '협공이 켜진다');
  // 벽이 없었다면 맞았을 피해: 지표가 있다
  const Wt = require('../metrics/watch'), v = A.sceneWorld(Object.assign({}, SCENES['v2-tactics-legend'], { seed: 1, maxT: 15 })); while (!A.over(v)) { A.stepWorld(v); Wt.watch(v); } const lk = Wt.seen(v, v.ms[0]); assert.ok(lk['벽이 없었다면 맞았을 피해'] >= 0 && lk['그중 맞은 몫'] >= 0);
});
ok('v2.11 당 회복 3 g/s·숨 (SPEC 35장): 마시는 0.5 s는 못 짓고 느리다, 끝나면 당 +80·머리 −30·기력 +3, 판마다 세 번, 판단 수준마다 문턱', () => {
  const mk = (skill, rules) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false, saltRing: false }, rules) }); const m = A.addMage(W, A.mage({ tier: '상위', skill, deck: '합법 최강' }), 0, 10, 10), e = A.addMage(W, A.mage({ tier: '상위', skill: '상급', deck: '합법 최강' }), 1, 30, 10); e.thinkT = m.thinkT = 1e9; A.stepWorld(W); return [W, m, e]; };
  // 당 회복: 기본 3 (상위는 버티기 × 1.74), 1.2로 하면 예전
  let [W, m] = mk('상급'); m.thinkT = 1e9; m.glu = 0; A.stepWorld(W); const g3 = m.glu; [W, m] = mk('상급', { gluRegen: 1.2 }); m.thinkT = 1e9; m.glu = 0; A.stepWorld(W); assert.ok(Math.abs(g3 / m.glu - 2.5) < 1e-6, '2.5배');
  // 숨: 남은 몫(머리·당 가운데 적은 쪽)이 문턱 아래면 마신다. 마시는 동안은 새 마법을 고르지 않고, 끝나면 채운다
  [W, m] = mk('상급'); m.fat = 80; m.glu = 20; m.stam = 1; m.thinkT = 0; A.brain.think(W, m); assert.ok(m.st.breath > 0 && m.mlog.breath === 1 && !m.cast, '마신다');
  for (let i = 0; i < 6; i++) { m.thinkT = 0; A.stepWorld(W); } assert.ok(m.st.breath > 0 && !m.cast, '마시는 동안 못 짓는다');
  const f0 = m.fat; for (let i = 0; i < 12; i++) A.stepWorld(W); assert.ok(m.st.breath === 0 && m.glu > 95 && m.fat < f0 - 25 && m.stam > 3.5, '채운다 ' + m.glu.toFixed(0) + ' ' + m.fat.toFixed(0));
  m.mlog.breath = 3; m.fat = 99; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0), '세 번까지');
  // 판단 수준: 상급은 위협이 있으면 참는다, 초보는 넘치기 직전이면 마신다(문턱 5%)
  [W, m] = mk('상급'); const e = W.ms[1]; e.cast = { s: W.spells['짧은 실'], tgt: m, tx: m.x, ty: m.y, t: 0, T: 1 }; m.fat = 80; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0), '위협이면 참는다');
  [W, m] = mk('초보'); m.fat = 90; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0), '초보는 90에선 아니다'); m.fat = 96; m.thinkT = 0; A.brain.think(W, m); assert.ok(m.st.breath > 0, '초보는 넘치기 직전');
  // 대가: 압박·끝내기를 고른 직후 남은 몫 45% 아래면 미리
  [W, m] = mk('대가'); m.fat = 60; m.op.cur = 'press'; m.op.t0 = W.t; m.thinkT = 0; A.brain.think(W, m); assert.ok(m.st.breath > 0, '몰아치기 직전에 미리');
  // 끄면 없다, 1.x는 1.2·없음
  [W, m] = mk('상급', { breath: false }); m.fat = 95; m.thinkT = 0; A.brain.think(W, m); assert.ok(!(m.st.breath > 0)); assert.ok(A.V1_RULES.gluRegen === 1.2 && A.V1_RULES.breath === false && A.DEFAULT_RULES.breath === true && A.DEFAULT_RULES.gluRegen === 3);
});
ok('v2.12 공격 방식 (SPEC 36장): 판단 단계마다 방식을 고르고, 확정 순간·갈 곳 계산·시전에 방식 기록', () => {
  const MD = require('../src/brain/techniques/mode');
  const mk = (skill, ex) => { const W = A.createWorld({ seed: 1, obstacles: [], rules: { flight: false, saltRing: false } }); const m = A.addMage(W, A.mage({ tier: '상위', skill, deck: '합법 최강' }), 0, 10, 15), e = A.addMage(W, A.mage({ tier: '상위', skill: '상급', deck: '합법 최강' }), 1, ex || 22, 15); e.thinkT = m.thinkT = 1e9; A.stepWorld(W); return [W, m, e]; };
  assert.ok(A.mage({ tier: '평범', skill: '초보' }).tac.mode === 1 && A.mage({ tier: '평범', skill: '전설' }).tac.mode === 5 && !A.mage({ tier: '평범' }).tac.mode);
  // 초보는 반복, 중급은 굳은 상대에만 확정타
  let [W, m, e] = mk('초보'); m.thinkT = 0; A.brain.think(W, m); assert.strictEqual(m._k.mode, 'repeat');
  [W, m, e] = mk('중급'); m.thinkT = 0; A.brain.think(W, m); assert.strictEqual(m._k.mode, ''); e.st.stun = 1; m.cast = m.castB = null; m.thinkT = 0; A.brain.think(W, m); assert.strictEqual(m._k.mode, 'sure', '굳은 상대');
  // 확정 순간: 굳음·숨 마시는 중·기력 바닥(땅)
  const K = { e, los: true }; e.st.stun = 0; assert.strictEqual(MD.sureWin(W, m, K), 0); e.st.breath = 0.4; assert.ok(Math.abs(MD.sureWin(W, m, K) - 0.4) < 1e-9); e.st.breath = 0; e.stam = 0.7; assert.ok(MD.sureWin(W, m, K) > 0.9, '기력 바닥'); e.stam = 6;
  // 대가: 갈 곳 계산 — 바위가 막은 곳은 지운다
  [W, m, e] = mk('대가'); const K2 = Object.assign({}, m._k || {}, { e, ux: 1, uy: 0, covPts: null }); e.vx = e.vy = 0; e.rollCd = 0; e.stam = 6;
  MD.reach(W, m, K2, true); const n0 = K2.covN; W.obs.push({ x: 22, y: 12.5, r: 1 }); const cut = MD.reach(W, m, K2, true); assert.ok(n0 >= 4 && K2.covN === n0 - 1 && cut > 0, '막힌 곳 ' + n0 + ' → ' + K2.covN);
  // 판 하나: 시전에 방식이 적히고, 지표가 있다
  const Wt = require('../metrics/watch'), v = A.sceneWorld(Object.assign({}, SCENES['v2-tactics-legend'], { seed: 1, maxT: 30 })); let marked = 0; while (!A.over(v)) { A.stepWorld(v); Wt.watch(v); for (const q of v.ms) if (q.cast && q.cast.mode) marked++; }
  const lk = Wt.seen(v, v.ms[0]); assert.ok(marked > 0 && v.ms[0].mlog.mode.n && lk['방식 시간: 견제'] >= 0 && lk['덮기 갈 곳 덮은 비율'] >= 0 && lk['큰 수의 확정 순간 몫'] >= 0);
});
ok('v2.14 잘게 걷기·빠른 판 (SPEC 38장): 1/60 s 걸음도 같은 씨앗이면 같은 판, 떡대·막기·감각 조준, 박자 지표', () => {
  const sc = SCENES['v2-tactics-legend'], Wt = require('../metrics/watch'), run = (rules, seed) => { const W = A.sceneWorld(Object.assign({}, sc, { seed, maxT: 10, rules: Object.assign({}, sc.rules, rules) })); while (!A.over(W)) { A.stepWorld(W); Wt.watch(W); } return W; };
  const a = run({}, 2), b = run({}, 2), c = run({ fineStep: false }, 2);
  assert.ok(sc.rules.fineStep && sc.rules.pace && a.dt === 1 / 60 && a.sk === 2 && c.dt === A.DT && c.sk === 1);
  assert.strictEqual(dig(A.result(a)) + JSON.stringify(a.ms.map(m => [m.x, m.y, m.hp])), dig(A.result(b)) + JSON.stringify(b.ms.map(m => [m.x, m.y, m.hp])), '같은 씨앗 같은 판');
  if (a.ms.every(m => m.hp > 0)) assert.ok(Math.abs(a.step - 600) <= 1 && Math.abs(c.step - 300) <= 1, a.step + ' ' + c.step);
  const lk = Wt.seen(a, a.ms[0]); assert.ok(lk['평균 속도 (m/s)'] > 10 && lk['초당 하는 일'] > 2 && lk['초당 방향 전환'] > 0.5 && lk['막기'] > 0, JSON.stringify([lk['평균 속도 (m/s)'], lk['초당 하는 일'], lk['초당 방향 전환'], lk['막기']]));
  // 떡대 × 0.35, 막기를 켜면 × 0.45 더. 대마법사만, 추락은 빼고
  const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: [], rules }); return [W, A.addMage(W, A.mage({ tier: '대마법사', skill: '전설' }), 0, 10, 15), A.addMage(W, A.mage({ tier: '평범' }), 1, 30, 15)]; };
  const hm = (W, m, k) => { let v = 100; for (const h of W.H.hurtMod) v = h(W, m, v, k, 'x'); return v; };
  const [W0, m0, q0] = mk({}), [W1, m1, q1] = mk({ pace: true }), P = A.RULES.find(r => r.name === 'pace').api.P;
  assert.ok(Math.abs(hm(W1, m1, 'elec') / hm(W0, m0, 'elec') - P.bulk) < 1e-9 && hm(W1, m1, 'fall') === hm(W0, m0, 'fall') && hm(W1, q1, 'elec') === hm(W0, q0, 'elec'));
  m1.st.guard = 0.1; assert.ok(Math.abs(hm(W1, m1, 'elec') / hm(W0, m0, 'elec') - P.bulk * P.guard.k) < 1e-9);
  // 감각 조준: 전설은 track[3] m 안이면 과녁의 자리로 고쳐 겨눈다, 밖이면 그대로
  const ct = (dx) => { const c = { s: W1.spells['체인'], tgt: q1, tx: q1.x + dx, ty: q1.y, auto: false }; for (const h of W1.H.track) h(W1, m1, c); return c.tx; };
  assert.ok(ct(P.track[3] - 0.5) === q1.x && ct(P.track[3] + 0.5) === q1.x + P.track[3] + 0.5 && !W0.H.track.length);
});
ok('v2.15 수읽기 (SPEC 39장): 줄인 상태·응수 0이면 메이트·큰 한 방은 메이트에만·정석·깊이 0이면 없다', () => {
  const PL = A.brain.plan, ST = PL.ST, SE = require('../src/brain/plan/search');
  assert.ok(A.mage({ tier: '대마법사', skill: '전설' }).tac.read === 4 && A.mage({ tier: '대마법사', skill: '대가' }).tac.read === 3 && A.mage({ tier: '대마법사', skill: '중급' }).tac.read === 1 && !A.mage({ tier: '대마법사', skill: '초보' }).tac.read);
  const mk = (rules, deck) => { const W = A.createWorld({ seed: 1, obstacles: [], width: 200, height: 150, rules: Object.assign({ flightCut: true, reflex: true, snap: true, pace: true, fineStep: true }, rules) }); const m = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: deck || '대마법사 수읽기' }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: '전설', deck: deck || '대마법사 수읽기' }), 1, 104, 75); A.stepWorld(W); A.brain.think(W, m); return [W, m, e]; };
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
  const K2 = { e, jo: -1, joI: 0, joT: -9 }; JO.commit(W, m, K2, '번개 그물'); assert.ok(K2.jo >= 0 && K2.joI === 1); const nx = { n: '짧은 실', s: W.spells['짧은 실'], v: 0.5 }; JO.value(W, m, K2, nx); assert.ok(nx.v > 0.5);
  // 판 하나: 같은 씨앗이면 같고, 지표가 있다
  const Wt = require('../metrics/watch'), run = () => { const v = A.sceneWorld(Object.assign({}, SCENES['v2-chess-legend'], { seed: 2, maxT: 15 })); while (!A.over(v)) { A.stepWorld(v); Wt.watch(v); } return v; };
  const a = run(), b = run(); assert.strictEqual(JSON.stringify(a.ms.map(q => [q.x, q.y, q.hp, q.mlog.chk, q.mlog.plN])), JSON.stringify(b.ms.map(q => [q.x, q.y, q.hp, q.mlog.chk, q.mlog.plN])));
  const lk = Wt.seen(a, a.ms[0]); assert.ok(a.ms[0].mlog.plN > 10 && lk['분당 체크'] >= 0 && lk['체크에 자원을 쓴 몫'] >= 0 && '메이트로 끝난 판' in lk && '그물에서 빠져나감' in lk);
});
// 병렬 실행기 (1.11.1): 일꾼 수·차례와 상관없이 한 줄로 돌린 것과 같다
(async () => {
  const P = require('../experiments/par'), S = require.resolve('./suite');
  const J = [[{ tier: '평범', skill: '전설' }, { tier: '평범', skill: '대가' }, 6], [{ tier: '중간', skill: '대가' }, { tier: '중간', skill: '상급' }, 6, { risk: true, bodyBind: true }], ['중간', '평범', 4]].map(args => ({ mod: S, fn: 'duels', args }));
  J.push({ mod: S, fn: 'rings', args: [{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 30, 2] });
  const one = JSON.stringify(P.runSerial(J)), par = JSON.stringify(await P.runJobs(J.slice().reverse(), { workers: 3 }).then(r => r.reverse()));
  assert.strictEqual(par, one, '병렬 결과가 한 줄 결과와 다르다'); pass++; console.log('  ✓ 병렬 실행기 (1.11.1): 일꾼 셋이 거꾸로 돌려도 한 줄로 돌린 것과 같다');
  console.log(`시험 ${pass}개 통과 · 결투장 v${A.VERSION}`);
})().catch(e => { console.error(e); process.exitCode = 1; });
