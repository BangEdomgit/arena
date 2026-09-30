'use strict';
/* 숨 결투장 — 데이터 읽기 (data/)
 * 마법은 원소마다 한 파일(data/spells/*.json). 판의 결과가 덱·자유 덱의 차례에 기대므로 마법의 차례는 data/spells/order.json이 정한다.
 * 차례 목록에 없는 새 마법은 아래 파일 차례대로 뒤에 붙는다(그래서 새 마법을 넣을 때 order.json을 안 고쳐도 된다).
 * 파일 목록은 require를 그대로 적어 둔다: 샌드박스 묶음(pack)이 이것을 보고 함께 싼다 */
const FILES = [require('../data/spells/불.json'), require('../data/spells/번개.json'), require('../data/spells/흙.json'), require('../data/spells/물.json'),
  require('../data/spells/얼음.json'), require('../data/spells/독.json'), require('../data/spells/없음.json'), require('../data/spells/신호.json'), require('../data/spells/빛.json')];
const ORDER = require('../data/spells/order.json');
function spells() {
  const all = {}; for (const f of FILES) Object.assign(all, f);
  const out = {}; for (const n of ORDER) if (all[n]) out[n] = all[n];
  for (const n in all) if (!(n in out)) out[n] = all[n];
  return out;
}
module.exports = { SPELLS: spells(), BOOKS: require('../data/books.json'), DECKS: require('../data/decks.json'), TIERS: require('../data/tiers.json'), SKILLS: require('../data/skills.json'), GEAR: require('../data/gear.json') };
