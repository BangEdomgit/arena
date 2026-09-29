/* 숨 결투장 v1.10.0 — 바깥으로 내보내는 API
 * Node: const A = require('./src')   브라우저: 전역 Arena (ArenaData, ArenaCore, ArenaBrain, ArenaRegistry 다음에 읽는다) */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./core'), require('./brain'), require('./books.json'), require('./registry'));
  else root.Arena = factory(root.ArenaCore, root.ArenaBrain, root.ArenaData.books, root.ArenaRegistry);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (core, brain, BOOKS, makeRegistry) {
'use strict';

// 3판 등급표를 그대로 옮긴 사람 규격
const TIERS = {
  '병사':     { C: 0.3, circles: 1,  noise: 0.12, dec: 0.3,  autoDodge: false, mast: 0,   tac: { dodge: 0.2 } },
  '평범':     { C: 1,   circles: 1,  noise: 0.08, dec: 0.2,  autoDodge: false, mast: 0.3, tac: { dodge: 0.4 } },
  '중간':     { C: 2.5, circles: 3,  noise: 0.05, dec: 0.15, autoDodge: false, mast: 0.6, tac: { dodge: 0.6 } },
  '상위':     { C: 5,   circles: 5,  noise: 0.03, dec: 0.12, autoDodge: true,  mast: 0.8, tac: { dodge: 0.8 } },
  '대마법사': { C: 10,  circles: 10, noise: 0.02, dec: 0.1,  autoDodge: true,  mast: 1,   tac: { dodge: 1, focusLow: true } },
};
const DECKS = Object.assign({
  '합법 최강': ['불기둥', '비 뿌리기', '땅 번개', '짧은 실', '근육 폭주', '불고리', '석회 방패', '번개 그물', '대낙뢰', '화산 기둥', '번개 창'],   // 큰 마법 셋은 rules.risk일 때만 남는다
  '광역': ['낙뢰', '번개 그물', '체인', '불기둥', '화염 방사', '돌 비', '짧은 실', '석회 방패', '석회 기둥', '솟는 발판', '근육 폭주', '불고리', '비 뿌리기', '땅 번개'],
  '기본기': ['돌 압축탄', '라이트닝', '불덩이', '물 망치', '얼음 창', '석회 방패', '다리 자극'],
  '머스킷': ['머스킷'],
  '기술': ['짧은 실', '체인', '번개 그물', '흙 손', '불기둥', '불벽', '번개 지뢰', '석회 방패', '산 안개', '대낙뢰', '화산 기둥', '번개 창'],
  '큰 수': ['번개 그물', '물 대포', '빙판', '불벽', '짧은 실', '땅 번개', '석회 방패', '대낙뢰', '화산 기둥', '번개 창'],   // 큰 수와 그 짝 묶기 (1.9.0)   // 기술 사다리를 보일 재료가 다 든 덱 (1.7.0, suite 모습)
  '도발 합법 최강': ['도발', '불기둥', '비 뿌리기', '땅 번개', '짧은 실', '근육 폭주', '불고리', '석회 방패', '번개 그물'],   // 도발은 rules.taunt가 켜졌을 때만 남는다
  '자유': Object.keys(core.SPELLS).filter(n => !core.SPELLS[n].banned && !core.SPELLS[n].mundane),
}, BOOKS);
const BRAINS = { '기본': brain };
// 판단 수준 (1.5.0, SPEC 13장). 등급(힘)과 따로 고른다. 없으면 등급의 값과 1.4.0 두뇌 그대로
const SK = (dec, noise, autoDodge, tac) => ({ dec, noise, autoDodge, tac: Object.assign({}, ROLL, tac) });
// 구르기 상한과 구르는 쪽 버릇 (1.6.0): 다섯 단계 모두. 상한 0.85~0.95 × 버릇 범위를 표준 묶음으로 재서 가장 고른 것 (REPORT 16절)
const ROLL = { rollCap: 0.85, rollBias: [0.6, 0.9] };
const BASIC = { readCast: true, lead: 1, combo: true, crowd: true, stance: false, lever: false, pathTrap: false, slotB: false, terrain: false, readWave: false, cdRead: false, outrange: false, focusLow: false };
const SKILLS = {
  '초보': SK(0.3, 0.14, false, Object.assign({}, BASIC, { dodge: 0.15, rest: 60, readCast: false, lead: 0.2, combo: false, crowd: false, castMove: 0, pause: [0.3, 0.6], shieldAny: true })),
  '중급': SK(0.2, 0.08, false, Object.assign({}, BASIC, { dodge: 0.45, rest: 75 })),
  '상급': SK(0.13, 0.04, true, Object.assign({}, BASIC, { dodge: 0.75, rest: 80, stance: true, lever: true, pathTrap: true, plan: true, combo2: true, shieldSave: true, cancel: true, cover: true, tempo: true, dodgeAim: true })),
  '대가': SK(0.08, 0.02, true, Object.assign({}, BASIC, { dodge: 1, rest: 80, stance: true, lever: true, pathTrap: true, plan: true, combo2: true, shieldSave: true, cancel: true, cover: true, tempo: true, coverW: 2, herd: true, strip: true, lure: true, simul: true, cancel2: true, bigPlan: true, dodgeAim: true, grab: true, feint: 0.08, focusLow: true, terrain: true, slotB: true, readWave: true, cdRead: true, outrange: true })),
};
// 실제로 쓰는 서클 = 그릇(등급) × 솜씨(판단 수준) (1.7.0)
const CIRCLES = { '초보': c => Math.max(1, Math.floor(c / 2)), '중급': c => Math.max(1, c - 1), '상급': c => c, '대가': c => c, '전설': c => c + 1 };
SKILLS['전설'] = SK(0.05, 0.01, true, Object.assign({}, SKILLS['대가'].tac, { feint: 0.12, learn: true, waveChoose: true, counter: true, coverW: 2.5, bait: true, fakeRetreat: true, triple: true }));
const register = makeRegistry(core, { TIERS, DECKS, BRAINS });

// lib: 장면이 마법·덱을 덮을 때 넘긴다. 없으면 기본값
function mage(opt = {}, lib = {}) {
  const SP = lib.spells || core.SPELLS, DK = lib.decks || DECKS;
  const t = TIERS[opt.tier || '평범']; if (!t) throw new Error('없는 등급: ' + opt.tier);
  const book = opt.book || DK[opt.deck || '합법 최강']; if (!book) throw new Error('없는 덱: ' + opt.deck);
  const br = opt.brain ? BRAINS[opt.brain] : null; if (opt.brain && !br) throw new Error('없는 두뇌: ' + opt.brain);
  const sk = opt.skill ? SKILLS[opt.skill] : null; if (opt.skill && !sk) throw new Error('없는 판단 수준: ' + opt.skill + ' (' + Object.keys(SKILLS).join(', ') + ')');
  if (opt.type && !core.TYPES.includes(opt.type)) throw new Error('없는 부류: ' + opt.type + ' (' + core.TYPES.join(', ') + ')');
  // 선호 거리: 공격 마법 사거리의 가운데값에 맞춘다 (덱과 거리가 어긋나 아무것도 못 쏘는 일을 막는다)
  // 규칙에 딸린 마법(큰 마법 등)은 선호 거리에 넣지 않는다: 그 규칙이 꺼져 있을 때 예전과 같게
  const Rs = book.map(n => SP[n]).filter(x => x && !x.rule && ['proj', 'thread', 'area', 'lob', 'cone', 'touch'].includes(x.t)).map(x => x.t === 'cone' ? x.L : x.t === 'touch' ? 1.2 : (x.home ? 10 : x.R)).sort((a, b) => a - b);
  const prefR = Rs.length ? core.clamp(Rs[Math.floor(Rs.length / 2)] * 0.5, 2.5, 10) : 7;
  return Object.assign({
    name: opt.name, book: book.slice(), C: t.C, circles: sk ? CIRCLES[opt.skill](t.circles) : t.circles, noise: sk ? sk.noise : t.noise, dec: sk ? sk.dec : t.dec, autoDodge: sk ? sk.autoDodge : t.autoDodge, skill: opt.skill,
    gear: Object.assign({ soles: true }, opt.gear), mast: Object.fromEntries(book.map(n => [n, t.mast])),
    hitEst: opt.hitEst || {}, tac: Object.assign({ prefR }, t.tac, sk && sk.tac, opt.tac), brain: br || undefined, type: opt.type || '메타',
  }, opt.spec);
}

// 편들을 세계에 놓는다. layout: 'lines'(양쪽 줄), 'ring'(첫 편의 첫 사람을 가운데, 나머지가 둘러쌈)
// 편이 셋 이상이고 'ring'이 아니면 둘레에 고루 놓는다. at[s][k]에 x, y가 있으면 그 자리가 이긴다
function place(W, teams, layout, at = []) {
  const cx = W.width / 2, cy = W.height / 2, put = (s, side, k, x, y) => { const p = at[side] && at[side][k]; const m = core.addMage(W, s, side, p && p.x != null ? p.x : x, p && p.y != null ? p.y : y); m._ref = [side, k]; return m; };
  if (layout === 'ring') {
    W.obs = W.obs.filter(o => core.hyp(o.x - cx, o.y - cy) > 3);
    teams[0].forEach((s, k) => put(s, 0, k, cx + k * 1.2, cy));
    const rest = []; teams.slice(1).forEach((tm, j) => tm.forEach((s, k) => rest.push([s, j + 1, k])));
    rest.forEach(([s, side, kk], k) => { const a = k / rest.length * 6.2832 + W.rnd(-0.1, 0.1), r = 6 + W.rnd(0, 3) + (k % 3) * 1.2; put(s, side, kk, core.clamp(cx + core.cos(a) * r, 1, W.width - 1), core.clamp(cy + core.sin(a) * r, 1, W.height - 1)); });
  } else if (teams.length <= 2) {
    const col = (team, side, x) => team.forEach((s, k) => { const n = team.length, rows = Math.ceil(n / Math.max(1, Math.floor((W.height - 2) / 1.6))); const perCol = Math.ceil(n / rows); const c = Math.floor(k / perCol), r = k % perCol; put(s, side, k, x + (side ? 1 : -1) * c * 1.4, core.clamp(cy + (r - (perCol - 1) / 2) * Math.min(3.2, (W.height - 2) / perCol), 1, W.height - 1)); });
    col(teams[0] || [], 0, 6); col(teams[1] || [], 1, W.width - 6);
  } else {
    const R = Math.min(W.width, W.height) * 0.38;
    teams.forEach((tm, side) => { const a = side / teams.length * 6.2832, px = -core.sin(a), py = core.cos(a); tm.forEach((s, k) => { const off = (k - (tm.length - 1) / 2) * 1.4; put(s, side, k, core.clamp(cx + core.cos(a) * R + px * off, 1, W.width - 1), core.clamp(cy + core.sin(a) * R + py * off, 1, W.height - 1)); }); });
  }
}

// 두 편의 싸움
function battle(teamA, teamB, opt = {}) {
  const W = core.createWorld({ seed: opt.seed, rules: opt.rules, record: opt.record, maxT: opt.maxT, width: opt.width, height: opt.height, obstacles: opt.obstacles, brain });
  place(W, [teamA, teamB], opt.layout);
  return core.run(W);
}
const duel = (a, b, opt) => battle([a], [b], opt);

/* ---------------- 장면 (SPEC 19장) ---------------- */
// 장면의 한 사람 → 사람 규격. 비워 둔 칸은 등급의 값을 따른다
const OVERRIDE = ['C', 'circles', 'noise', 'dec', 'autoDodge', 'hp'];
function sceneMage(mm, side, lib) {
  const sp = mage({ tier: mm.tier, deck: mm.deck, book: mm.book, name: mm.name, gear: mm.gear, tac: mm.tac, brain: mm.brain || side.brain, type: mm.type, skill: mm.skill }, lib);
  for (const k of OVERRIDE) if (mm[k] != null && mm[k] !== '') sp[k] = k === 'autoDodge' ? !!mm[k] : +mm[k];
  return sp;
}
function sceneLib(sc) { return { spells: Object.assign({}, core.SPELLS, sc.spells), decks: Object.assign({}, DECKS, sc.decks) }; }
// 장면 → 첫 걸음 전의 세계. opt.record: 녹화
function sceneWorld(sc, opt = {}) {
  const lib = sceneLib(sc);
  const W = core.createWorld({ seed: sc.seed, rules: sc.rules, record: opt.record, maxT: sc.maxT, width: sc.width, height: sc.height, obstacles: sc.obstacles, barrels: sc.barrels, walls: sc.walls, spells: lib.spells, brain });
  const sides = sc.sides || [];
  place(W, sides.map((s, i) => s.mages.map((mm, k) => { const sp = sceneMage(mm, s, lib); if (sp.name == null) sp.name = (s.name || '편' + i) + (k + 1); return sp; })), sc.layout, sides.map(s => s.mages));
  return W;
}
const runScene = (sc, opt) => core.run(sceneWorld(sc, opt));
// viewer.html이 읽는 녹화 형식 (cli.js replay와 같다)
function recording(W) {
  const r = core.result(W), done = core.over(W);
  return { v: core.VERSION, names: W.ms.map(m => m.name), sides: W.ms.map(m => m.side), hpMax: W.ms.map(m => m.hpMax), winner: done ? r.winner : -1, t: r.t, obs: W.obs, frames: W.rec || [] };
}

// 싸우는 모습 (1.7.0): 판이 끝난 사람의 행동 지표. t = 그 사람이 싸운 시간 (s)
function look(m, t) {
  const st = m.log.starts, iv = []; for (let i = 1; i < st.length; i++) iv.push(st[i] - st[i - 1]);
  const mean = iv.length ? iv.reduce((a, b) => a + b, 0) / iv.length : 0, sd = iv.length > 1 ? Math.sqrt(iv.reduce((a, b) => a + (b - mean) ** 2, 0) / (iv.length - 1)) : 0;
  const L = m.log, per = x => x / Math.max(t, 1) * 60;
  return {
    '분당 시전': per(st.length), '빈틈 (s)': L.gaps.length ? L.gaps.slice().sort((a, b) => a - b)[L.gaps.length >> 1] : 0, '박자 흔들림': mean ? sd / mean : 0,
    '분당 콤보': per(L.comboTry), '콤보 성공률': L.comboTry ? L.comboHit / L.comboTry : 0, '분당 동시 시전': per(L.dec.slotB),
    '분당 캔슬': per(L.cancel || 0), '분당 속임수': per(L.dec.feint || 0), '엄폐 시간 비율': t ? (L.coverT || 0) / t : 0,
    '분당 유도 성공': per(L.lure || 0), '분당 동시 착탄': per(L.simul || 0), '방어 적중률': L.defTry ? (L.defHit || 0) / L.defTry : 0,
  };
}

// 판이 끝난 뒤 맞힘 기록을 사람 규격에 되먹인다 (결투자가 배우는 몫)
function learn(spec, m, rate = 0.3) {
  for (const n of Object.keys(m.log.casts)) { const c = m.log.casts[n], h = m.log.hits[n] || 0; spec.hitEst[n] = (spec.hitEst[n] ?? 0.35) * (1 - rate) + rate * Math.min(1, h / c); }
  return spec;
}

return Object.assign({}, core, { brain, TIERS, DECKS, BRAINS, SKILLS, register, mage, place, battle, duel, look, sceneWorld, runScene, recording, learn });
});
