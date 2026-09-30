'use strict';
/* 숨 결투장 v2.0.0 — 대표 판을 샌드박스 장면으로 (대실험 3단계)
 *   node experiments/scenes.js [조합이름, 기본 risk+saltRing+wave] → sandbox/scenes/v2-*.json 다섯 장 (그다음 node cli.js pack)
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
    // 비행 (v2.0): 대마법사끼리 좁은 곳·넓은 곳, 날아다니는 대마법사 대 머스킷 (넓은 곳에 흩어진 스무 정)
    'v2-sky-narrow': pick(s => ({ v, name: `대마법사 대가 대 상급, 좁은 곳 40×30${tag}`, seed: s, width: 40, height: 30, rules: R, sides: [{ name: '대가', mages: [{ tier: '대마법사', skill: '대가' }] }, { name: '상급', mages: [{ tier: '대마법사', skill: '상급' }] }] })),
    'v2-sky-wide': pick(s => ({ v, name: `대마법사 전설 대 대가, 넓은 곳 공중전 200×150${tag}`, seed: s, width: 200, height: 150, rules: R, sides: [{ name: '전설', mages: [{ tier: '대마법사', skill: '전설' }] }, { name: '대가', mages: [{ tier: '대마법사', skill: '대가' }] }] })),
    'v2-sky-musket': pick(s => ({ v, name: `날아다니는 대마법사(비행 판단 초보: 총 앞에서도 난다) 대 머스킷 20정, 200×150${tag}`, seed: s, width: 200, height: 150, maxT: 90, rules: R, sides: [{ name: '대마법사', mages: [{ tier: '대마법사', skill: '대가', deck: '광역', tac: { flySkill: 1 }, x: 100, y: 75 }] }, { name: '총병', mages: Array.from({ length: 20 }, (_, i) => { const a = i / 20 * 6.2832; return { tier: '병사', deck: '머스킷', x: +(100 + Math.cos(a) * 60).toFixed(2), y: +(75 + Math.sin(a) * 50).toFixed(2) }; }) }] })),
  };
  // 넓이를 적어 둔다: 샌드박스는 넓이가 없으면 40 × 30으로 연다 (엔진은 대마법사가 끼면 200 × 150)
  for (const sc of Object.values(out)) if (sc.width == null) { const W = A.sceneWorld(sc); sc.width = W.width; sc.height = W.height; }
  for (const [f, sc] of Object.entries(out)) { fs.writeFileSync(path.join(DIR, f + '.json'), JSON.stringify(sc, null, 1) + '\n'); console.log(f, sc.seed, sc.note); }
}
if (require.main === module) main(process.argv[2] || 'risk+saltRing+wave');
module.exports = { main };
