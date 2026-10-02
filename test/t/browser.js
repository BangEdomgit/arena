'use strict';
/* 숨 결투장 시험: 브라우저 모양으로 읽기 (1.1.0)
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/browser.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
// k번째 몫(n으로 나눈 장면)만: test/test.js가 여럿으로 나눠 돌린다
function run(k = 0, n = 1) {
  const part = Object.entries(SCENES).filter((_, i) => i % n === k);
  legacy(true); const { ok, done } = suite();
  ok('브라우저 모양(묶음 한 장, 전역)으로 읽어도 같은 결과', () => {
    const ctx = vm.createContext({});
    vm.runInContext(SRC('sandbox/arena.js'), ctx, { filename: 'sandbox/arena.js' });
    const B = ctx.Arena; assert.strictEqual(B.VERSION, A.VERSION); Object.assign(B.DEFAULT_RULES, A.DEFAULT_RULES);   // 이 시험 동안의 기본(1.x)을 묶음에도 assert.ok(ctx.ArenaCore && ctx.ArenaBrain && ctx.ArenaRegistry && ctx.ArenaData.scenes.duel);
    for (const [nm, sc] of part) { const W = B.sceneWorld(sc); while (!B.over(W)) B.stepWorld(W); assert.strictEqual(dig(B.result(W)), dig(A.runScene(sc)), nm); }
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
