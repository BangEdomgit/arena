'use strict';
/* 숨 결투장 v1.0.0 회귀 시험. 규칙을 바꾸면 여기부터 돌린다: node test/test.js */
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
console.log(`시험 ${pass}개 통과 · 결투장 v${A.VERSION}`);
