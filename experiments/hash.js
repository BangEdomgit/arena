'use strict';
/* 숨 결투장 — 결과 지문 (바꾼 게 결과를 건드렸는지 보는 도구)
 * 여러 판의 결과·기록·녹화를 통째로 해시한다. 비트 하나라도 바뀌면 달라진다. 속도·구조만 고쳤으면 이 값이 그대로여야 한다.
 *   node experiments/hash.js                 지금 src
 *   node experiments/hash.js 경로/src          다른 판(예: git archive로 푼 예전 판)
 * 세 묶음: 규칙 다섯 × 등급 셋 × 판단 다섯 × 덱 셋 (457판, 녹화 넷 포함), 모든 덱·판단·부류·규칙을 섞은 260판, 망토 30판 */
const path = require('path'), crypto = require('crypto');
const A = require(path.resolve(process.argv[2] || path.join(__dirname, '..', 'src')));

function grid() {
  const H = crypto.createHash('sha256'), rh = [];
  const put = r => H.update(JSON.stringify({ w: r.winner, t: r.t, bt: r.byTime, ms: r.ms.map(m => [m.x, m.y, m.hp, m.fat, m.glu, m.log]) }));
  const SK = ['초보', '중급', '상급', '대가', '전설'];
  const RS = [{}, { risk: true }, { risk: true, bodyBind: true, saltRing: true }, { wave: true, taunt: true, barrels: true }, { hpScale: true, domain: false }];
  let n = 0;
  for (const rules of RS) for (const t of ['평범', '중간', '대마법사']) for (let i = 0; i < 5; i++) for (const d of ['합법 최강', '기술', '기본기']) for (let k = 1; k <= 2; k++) {
    const a = A.mage({ tier: t, skill: SK[i], deck: d, type: rules.wave ? ['서퍼', '메타', '이단'][k % 3] : undefined }), b = A.mage({ tier: t, skill: SK[(i + k) % 5], deck: '합법 최강' });
    put(A.duel(a, b, { seed: k * 7 + i, rules, maxT: 60 })); n++;
  }
  for (let k = 1; k <= 3; k++) { put(A.battle([A.mage({ tier: '대마법사', deck: '광역' })], Array.from({ length: 30 }, () => A.mage({ tier: '평범', deck: '기본기' })), { seed: k, layout: 'ring', maxT: 30 })); n++; }
  for (let k = 1; k <= 4; k++) { const r = A.duel(A.mage({ tier: '중간', skill: SK[k] }), A.mage({ tier: '중간', skill: SK[k - 1], deck: '기술' }), { seed: k, record: true, rules: k % 2 ? { risk: true, bodyBind: true } : { barrels: true } }); const h = crypto.createHash('sha256').update(JSON.stringify(r.rec)).digest('hex').slice(0, 12); rh.push(h); H.update(h); n++; }
  return { n, h: H.digest('hex').slice(0, 16), rec: rh };
}
function mixed() {
  const H = crypto.createHash('sha256'), decks = Object.keys(A.DECKS), SK = [undefined, ...Object.keys(A.SKILLS)], tiers = Object.keys(A.TIERS), TY = ['서퍼', '메타', '이단'];
  const flags = ['risk', 'bodyBind', 'saltRing', 'wave', 'taunt', 'barrels', 'hpScale'];
  let n = 0;
  for (let k = 1; k <= 260; k++) {
    const rules = {}; flags.forEach((f, i) => { if ((k * 7 + i * 3) % (i + 2) === 0) rules[f] = true; }); if (k % 11 === 0) rules.friendlyFire = false; if (k % 13 === 0) rules.domain = false;
    const pick = (a, j) => a[(k * 31 + j * 17) % a.length];
    const mk = j => A.mage({ tier: pick(tiers, j), skill: pick(SK, j + 1), deck: pick(decks, j + 2), type: pick(TY, j) });
    const tA = [mk(1)], tB = [mk(2)]; if (k % 5 === 0) { tA.push(mk(3)); tB.push(mk(4)); }
    const r = A.battle(tA, tB, { seed: k, rules, maxT: 40 }); n++;
    H.update(JSON.stringify([r.winner, r.t, r.ms.map(m => [m.hp, m.x, m.y, m.log])]));
  }
  return { n, h: H.digest('hex').slice(0, 16) };
}
function cloak() {
  const H = crypto.createHash('sha256');
  for (let k = 1; k <= 30; k++) { const r = A.battle([A.mage({ tier: '중간', skill: '대가', gear: { cloak: true } }), A.mage({ tier: '평범' })], [A.mage({ tier: '중간', skill: '전설', deck: '기술', gear: { cloak: k % 2 === 0, soles: false } })], { seed: k, rules: { risk: true, bodyBind: k % 3 === 0 }, maxT: 60 }); H.update(JSON.stringify([r.winner, r.t, r.ms.map(m => [m.hp, m.x, m.log])])); }
  return { n: 30, h: H.digest('hex').slice(0, 16) };
}
function all() { const g = grid(), x = mixed(), c = cloak(); return { grid: g.h + ' (' + g.n + '판)', rec: g.rec.join(' '), mixed: x.h + ' (' + x.n + '판)', cloak: c.h + ' (' + c.n + '판)' }; }
module.exports = { grid, mixed, cloak, all };
if (require.main === module) { const r = all(); for (const [k, v] of Object.entries(r)) console.log(k.padEnd(6), v); }
