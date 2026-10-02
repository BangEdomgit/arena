'use strict';
/* 숨 결투장 시험: 장면을 내보내고 다시 불러오기 (1.1.0)
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/roundtrip.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
// k번째 몫(n으로 나눈 장면)만: test/test.js가 여럿으로 나눠 돌린다
function run(k = 0, n = 1) {
  const part = Object.entries(SCENES).filter((_, i) => i % n === k);
  legacy(true); const { ok, done } = suite();
  ok('장면을 내보내고 다시 불러오면 같은 판', () => {
    for (const [, sc] of part) assert.strictEqual(dig(A.runScene(JSON.parse(JSON.stringify(sc)))), dig(A.runScene(sc)));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
