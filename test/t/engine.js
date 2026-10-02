'use strict';
/* 숨 결투장 시험: 결정론 수학·장면·묶음·편·등록 (1.1.0)
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/engine.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
function run() {
  legacy(true); const { ok, done } = suite();
  ok('엔진은 JS 엔진마다 다른 Math 함수를 쓰지 않는다', () => {
    const walk = d => fs.readdirSync(path.join(__dirname, '..', '..', d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(d + '/' + e.name) : e.name.endsWith('.js') ? [d + '/' + e.name] : []);
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
  ok('sandbox/arena.js는 원본(src·metrics·data·장면)과 맞다 (어긋나면 node cli.js pack)', () => {
    assert.strictEqual(SRC('sandbox/arena.js'), require('../../sandbox/pack').text());
  });
  ok('편이 셋 이상이어도 돈다', () => {
    const r = A.runScene({ seed: 2, maxT: 30, sides: ['불', '물', '흙'].map(e => ({ name: e, mages: [{ tier: '중간', deck: e }] })) });
    assert.ok(r.ms.length === 3 && r.ms.every(m => m.side === m._ref[0]));
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
