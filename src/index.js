'use strict';
/* 숨 결투장 v1.0.1 — 바깥으로 내보내는 API */
const core = require('./core');
const brain = require('./brain');
const BOOKS = require('./books.json');

// 3판 등급표를 그대로 옮긴 사람 규격
const TIERS = {
  '병사':     { C: 0.3, circles: 1,  noise: 0.12, dec: 0.3,  autoDodge: false, mast: 0,   tac: { dodge: 0.2 } },
  '평범':     { C: 1,   circles: 1,  noise: 0.08, dec: 0.2,  autoDodge: false, mast: 0.3, tac: { dodge: 0.4 } },
  '중간':     { C: 2.5, circles: 3,  noise: 0.05, dec: 0.15, autoDodge: false, mast: 0.6, tac: { dodge: 0.6 } },
  '상위':     { C: 5,   circles: 5,  noise: 0.03, dec: 0.12, autoDodge: true,  mast: 0.8, tac: { dodge: 0.8 } },
  '대마법사': { C: 10,  circles: 10, noise: 0.02, dec: 0.1,  autoDodge: true,  mast: 1,   tac: { dodge: 1, focusLow: true } },
};
const DECKS = Object.assign({
  '합법 최강': ['불기둥', '비 뿌리기', '땅 번개', '짧은 실', '근육 폭주', '불고리', '석회 방패', '번개 그물'],
  '광역': ['낙뢰', '번개 그물', '체인', '불기둥', '화염 방사', '돌 비', '짧은 실', '석회 방패', '석회 기둥', '솟는 발판', '근육 폭주', '불고리', '비 뿌리기', '땅 번개'],
  '기본기': ['돌 압축탄', '라이트닝', '불덩이', '물 망치', '얼음 창', '석회 방패', '다리 자극'],
  '머스킷': ['머스킷'],
  '자유': Object.keys(core.SPELLS).filter(n => !core.SPELLS[n].banned && !core.SPELLS[n].mundane),
}, BOOKS);

function mage(opt = {}) {
  const t = TIERS[opt.tier || '평범']; if (!t) throw new Error('없는 등급: ' + opt.tier);
  const book = opt.book || DECKS[opt.deck || '합법 최강']; if (!book) throw new Error('없는 덱: ' + opt.deck);
  // 선호 거리: 공격 마법 사거리의 가운데값에 맞춘다 (덱과 거리가 어긋나 아무것도 못 쏘는 일을 막는다)
  const Rs = book.map(n => core.SPELLS[n]).filter(x => x && ['proj', 'thread', 'area', 'lob', 'cone', 'touch'].includes(x.t)).map(x => x.t === 'cone' ? x.L : x.t === 'touch' ? 1.2 : (x.home ? 10 : x.R)).sort((a, b) => a - b);
  const prefR = Rs.length ? core.clamp(Rs[Math.floor(Rs.length / 2)] * 0.5, 2.5, 10) : 7;
  return Object.assign({
    name: opt.name, book: book.slice(), C: t.C, circles: t.circles, noise: t.noise, dec: t.dec, autoDodge: t.autoDodge,
    gear: Object.assign({ soles: true }, opt.gear), mast: Object.fromEntries(book.map(n => [n, t.mast])),
    hitEst: opt.hitEst || {}, tac: Object.assign({ prefR }, t.tac, opt.tac),
  }, opt.spec);
}

// 두 편의 싸움. layout: 'lines'(양쪽 줄), 'ring'(A의 첫 사람을 가운데, B가 둘러쌈)
function battle(teamA, teamB, opt = {}) {
  const W = core.createWorld({ seed: opt.seed, rules: opt.rules, record: opt.record, maxT: opt.maxT, width: opt.width, height: opt.height, obstacles: opt.obstacles, brain });
  const cx = W.width / 2, cy = W.height / 2;
  if (opt.layout === 'ring') {
    W.obs = W.obs.filter(o => core.hyp(o.x - cx, o.y - cy) > 3);
    teamA.forEach((s, k) => core.addMage(W, s, 0, cx + k * 1.2, cy));
    teamB.forEach((s, k) => { const a = k / teamB.length * 6.2832 + W.rnd(-0.1, 0.1), r = 6 + W.rnd(0, 3) + (k % 3) * 1.2; core.addMage(W, s, 1, core.clamp(cx + Math.cos(a) * r, 1, W.width - 1), core.clamp(cy + Math.sin(a) * r, 1, W.height - 1)); });
  } else {
    const col = (team, side, x) => team.forEach((s, k) => { const n = team.length, rows = Math.ceil(n / Math.max(1, Math.floor((W.height - 2) / 1.6))); const perCol = Math.ceil(n / rows); const c = Math.floor(k / perCol), r = k % perCol; core.addMage(W, s, side, x + (side ? 1 : -1) * c * 1.4, core.clamp(cy + (r - (perCol - 1) / 2) * Math.min(3.2, (W.height - 2) / perCol), 1, W.height - 1)); });
    col(teamA, 0, 6); col(teamB, 1, W.width - 6);
  }
  return core.run(W);
}
const duel = (a, b, opt) => battle([a], [b], opt);

// 판이 끝난 뒤 맞힘 기록을 사람 규격에 되먹인다 (결투자가 배우는 몫)
function learn(spec, m, rate = 0.3) {
  for (const n of Object.keys(m.log.casts)) { const c = m.log.casts[n], h = m.log.hits[n] || 0; spec.hitEst[n] = (spec.hitEst[n] ?? 0.35) * (1 - rate) + rate * Math.min(1, h / c); }
  return spec;
}

module.exports = Object.assign({}, core, { brain, TIERS, DECKS, mage, battle, duel, learn });
