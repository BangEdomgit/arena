'use strict';
/* 숨 결투장 시험의 공용 (v2.23.1): 시험 파일(test/t/*.js)마다 suite()로 ok를 만들고 run()이 결과를 돌려준다.
 * v2.0에서 기본 규칙이 바뀌었다(SPEC 24장). 1.x의 기본(규칙 꺼짐)을 전제로 한 시험은 legacy(true)로 1.x 동작을 그대로 본다 */
const assert = require('assert'), fs = require('fs'), path = require('path'), vm = require('vm');
const A = require('../src');
const V1 = A.V1_RULES, V2 = Object.assign({}, A.DEFAULT_RULES);
// 1.x의 시험은 1.x의 기본(규칙 꺼짐) 위에서 돈다: 그동안 DEFAULT_RULES를 1.x로 둔다. 파일마다 run()의 첫머리에서 정한다
const legacy = on => Object.assign(A.DEFAULT_RULES, on ? V1 : V2);
const SRC = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const dig = r => [r.winner, r.t, r.ms.map(m => m.hp).join('/')].join(';');
const SCENES = Object.fromEntries(fs.readdirSync(path.join(__dirname, '../sandbox/scenes')).filter(f => f.endsWith('.json')).map(f => [f.slice(0, -5), JSON.parse(SRC('sandbox/scenes/' + f))]));
// 시험 묶음 하나: ok(이름, 함수)는 실패해도 다음으로 간다. done()은 { pass: [이름…], fail: [[이름, 오류]…] }
function suite() {
  const pass = [], fail = [];
  const ok = (name, fn) => { try { fn(); pass.push(name); } catch (e) { fail.push([name, String(e && e.stack || e)]); } };
  return { ok, done: () => ({ pass, fail }) };
}
// 혼자 돌릴 때 (node test/t/이름.js)
function main(runs) { let n = 0, bad = 0; for (const r of runs) { const o = r(); for (const x of o.pass) console.log('  ✓', x); for (const [x, e] of o.fail) console.log('  ✗', x, '\n', e);
    n += o.pass.length; bad += o.fail.length; } console.log(`시험 ${n}개 통과${bad ? ', ' + bad + '개 실패' : ''} · 결투장 v${A.VERSION}`); if (bad) process.exitCode = 1; }
module.exports = { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite, main };
