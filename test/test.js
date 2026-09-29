'use strict';
/* 숨 결투장 v1.7.0 회귀 시험. 규칙을 바꾸면 여기부터 돌린다: node test/test.js */
const assert = require('assert');
const A = require('../src');
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
  for (const f of ['src/core.js', 'src/brain.js', 'src/index.js', 'src/registry.js']) {
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
ok('sandbox/data.js는 JSON과 맞다 (어긋나면 node cli.js pack)', () => {
  assert.strictEqual(SRC('sandbox/data.js'), require('../sandbox/pack').text());
});
ok('브라우저 모양(UMD, 전역)으로 읽어도 같은 결과', () => {
  const ctx = vm.createContext({});
  for (const f of ['sandbox/data.js', 'src/core.js', 'src/brain.js', 'src/registry.js', 'src/index.js']) vm.runInContext(SRC(f), ctx, { filename: f });
  const B = ctx.Arena; assert.strictEqual(B.VERSION, A.VERSION);
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
  delete A.DEFAULT_RULES['시험 규칙']; A.RULE_HOOKS.length = 0;
});
ok('파도 (1.2.0): 꺼 두면 부류와 상관없이 예전과 같고, 켜면 서퍼는 100을 넘어 타다 170에서 휩쓸리고, 이단은 넘치지 않는다', () => {
  const mm = (type, deck) => A.mage({ tier: '중간', deck, type });
  assert.strictEqual(dig(A.duel(mm('서퍼'), mm('이단', '기본기'), { seed: 3 })), dig(A.duel(mm(), mm(undefined, '기본기'), { seed: 3 })));
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
console.log(`시험 ${pass}개 통과 · 결투장 v${A.VERSION}`);
