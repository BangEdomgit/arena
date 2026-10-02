'use strict';
/* 숨 결투장 — 규칙 모듈 목록 (SPEC 22장 모듈과 훅)
 * 규칙 하나 = 파일 하나. 모양: { name, switch?, default?, on(W, opt), form?, engine: X => ({훅}), types: X => ({틀: fn}), brain: B => ({훅}), brainTypes: B => ({틀: fn}), api? }
 *   on: 이 세계에서 켜졌는가 (세계를 만들 때 한 번). 없으면 switch 스위치를 따르고, switch도 없으면 늘 켜짐
 *   engine: 엔진 훅. 세계를 만들 때 켜진 규칙의 훅만 차례대로 W.H[훅]에 모인다 (꺼진 규칙은 비용 0)
 *   types·brainTypes: 새 마법 틀의 방출과 두뇌의 값. 틀은 스위치와 상관없이 늘 붙는다(마법이 규칙에 딸리면 rule 필드가 책에서 뺀다)
 *   brain: 두뇌 훅. 기본 두뇌가 세계마다 켜진 규칙의 것만 모은다 (brain/hooks.js)
 * 차례가 곧 같은 훅 안의 부르는 차례다. 예전 한 덩어리의 계산 차례를 그대로 따른다(결과가 비트 하나 안 바뀌게). 새 규칙은 뒤에 붙는다 */
const RULES = [require('./gear'), require('./terrain'), require('./saltRing'), require('./wave'), require('./control'), require('./risk'), require('./taunt'), require('./multiSlot'), require('./barrels'), require('./response'), require('./silver'), require('./body'), require('./evade'), require('./flight'), require('./light'), require('./bulwark'), require('./army'), require('./morale'), require('./saltLand'), require('./fort'), require('./snap'), require('./reflex'), require('./blueprint'), require('./tactics'), require('./endure'), require('./hold'), require('./breath'), require('./pace'), require('./passive'), require('./tune'), require('./stunRes')];
// 엔진 훅의 이름과 부르는 자리 (SPEC 22장 표). 값을 돌려주는 훅은 받은 값을 고쳐 돌려준다
const ENGINE_HOOKS = ['place', 'init', 'world', 'wall', 'wallHit', 'lobLand', 'ceff', 'power', 'gate', 'share', 'release', 'overload', 'roll', 'hurtMod', 'hurt', 'effHold', 'eff', 'rain', 'smother', 'ring', 'fatRecover', 'mageStep', 'mageZones', 'move', 'speed', 'speedLate', 'accel', 'chan', 'projSub', 'ignite', 'areaHit', 'zoneTick', 'notice', 'trapCap', 'trapFire', 'preMove', 'castMove', 'walk', 'gluRegen', 'castHold', 'track', 'flyAccel', 'tune', 'stunHold'];
const BRAIN_HOOKS = ['aim', 'read', 'hideCast', 'steer', 'avoid', 'empty', 'circles', 'react', 'cancel', 'rest', 'prep', 'value', 'valueRisk', 'valueMid', 'valueLate', 'commit', 'castTime', 'phase', 'bound', 'stunned'];
let ver = 0;   // 목록이 바뀐 횟수 (엔진이 틀 표를 다시 만든다)
const onOf = r => r.on || (r.switch ? W => !!W.rules[r.switch] : () => true);
// 규칙을 더한다(같은 이름이면 바꾼다). 스위치가 있으면 기본값을 DEFAULT_RULES에 적는 건 부르는 쪽(registry)
function add(r) {
  if (!r || typeof r.name !== 'string' || !r.name) throw new Error('규칙에 이름(name)이 없다');
  const i = RULES.findIndex(x => x.name === r.name); if (i >= 0) RULES[i] = r; else RULES.push(r);
  ver++; return r;
}
function remove(name) { const i = RULES.findIndex(x => x.name === name); if (i >= 0) { RULES.splice(i, 1); ver++; } }
module.exports = { RULES, ENGINE_HOOKS, BRAIN_HOOKS, onOf, add, remove, ver: () => ver };
