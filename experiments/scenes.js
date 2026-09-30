'use strict';
/* 숨 결투장 v1.13.0 — 대표 판을 샌드박스 장면으로 (대실험 3단계)
 *   node experiments/scenes.js 조합이름      → sandbox/scenes/v2-*.json 다섯 장 (그다음 node cli.js pack)
 * 대진마다 씨앗 1..15를 돌려, 많이 이긴 쪽이 이기고 길이가 가운데값에 가장 가까운 판을 고른다(대표 판).
 * 장면은 결정론이라 샌드박스에서 열면 같은 판이 그대로 다시 돈다 */
const fs = require('fs'), path = require('path');
const A = require('../src'), { comboOf } = require('./v2rules'), { musketScene } = require('./jobs');
const DIR = path.join(__dirname, '..', 'sandbox', 'scenes');

function pick(make) {
  const rs = []; for (let s = 1; s <= 15; s++) { const sc = make(s), r = A.runScene(sc); rs.push({ s, sc, w: r.winner, t: r.t }); }
  const cnt = {}; for (const r of rs) cnt[r.w] = (cnt[r.w] || 0) + 1; const w = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  const ts = rs.map(r => r.t).sort((a, b) => a - b), med = ts[ts.length >> 1];
  const best = rs.filter(r => r.w === w).sort((a, b) => Math.abs(a.t - med) - Math.abs(b.t - med) || a.s - b.s)[0];
  return Object.assign(best.sc, { note: `대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 ${w}, ${cnt[w]}/15)이 이기고 길이(${best.t} s)가 가운데값(${med} s)에 가장 가까운 판` });
}
function main(name) {
  const c = comboOf(name), R = c.rules, v = A.VERSION, tag = ' [' + name + ']';
  const duel = (t, hi, lo) => s => ({ v, name: `${t} ${hi} 대 ${lo}${tag}`, seed: s, rules: R, sides: [{ name: hi, mages: [{ tier: t, skill: hi }] }, { name: lo, mages: [{ tier: t, skill: lo }] }] });
  const out = {
    'v2-neighbor-plain': pick(duel('평범', '전설', '대가')),
    'v2-neighbor-mid': pick(duel('중간', '대가', '상급')),
    'v2-challenger-3': pick(s => ({ v, name: `평범 전설 1 대 초보 3${tag}`, seed: s, rules: R, sides: [{ name: '전설', mages: [{ tier: '평범', skill: '전설' }] }, { name: '초보', mages: [1, 2, 3].map(() => ({ tier: '평범', skill: '초보' })) }] })),
    'v2-archmage-100': pick(s => ({ v, name: `대마법사 대 평범 100명 둘러싸기${tag}`, seed: s, maxT: 90, layout: 'ring', rules: R, sides: [{ name: '대마법사', mages: [{ tier: '대마법사', deck: '광역' }] }, { name: '평범', mages: Array.from({ length: 100 }, () => ({ tier: '평범', deck: '기본기' })) }] })),
    'v2-musket-40': pick(s => Object.assign(musketScene(40, s, R), { name: `머스킷 반원: 대마법사 대 병사 40명${tag}` })),
  };
  for (const [f, sc] of Object.entries(out)) { fs.writeFileSync(path.join(DIR, f + '.json'), JSON.stringify(sc, null, 1) + '\n'); console.log(f, sc.seed, sc.note); }
}
if (require.main === module) main(process.argv[2] || 'base');
module.exports = { main };
