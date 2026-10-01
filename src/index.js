'use strict';
/* 숨 결투장 v2.8.0 — 바깥으로 내보내는 API
 * Node: const A = require('./src')   브라우저: 전역 Arena (sandbox/arena.js 묶음, node cli.js pack)
 * 데이터(마법·마법책·덱·등급·판단 수준·장비)는 data/에 JSON으로 있다. 판단 수준은 brain/skills.js, 행동 지표는 metrics/look.js */
const core = require('./core'), brain = require('./brain'), makeRegistry = require('./registry');
const D = require('./data'), { SKILLS, CIRCLES } = require('./brain/skills'), { look } = require('../metrics/look');

// 3판 등급표를 그대로 옮긴 사람 규격 (data/tiers.json)
const TIERS = D.TIERS;
// 덱 (data/decks.json) + 자유(금지·평범 마법을 뺀 모든 마법) + 원소별 기본 마법책 (data/books.json)
// 큰 마법 셋은 rules.risk일 때만, 몸 묶기 다섯은 rules.bodyBind일 때만, 도발은 rules.taunt일 때만 책에 남는다
const DECKS = Object.assign({}, D.DECKS, { '자유': Object.keys(core.SPELLS).filter(n => !core.SPELLS[n].banned && !core.SPELLS[n].mundane) }, D.BOOKS);
const BRAINS = { '기본': brain };
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
    gear: Object.assign({}, D.GEAR.default, opt.gear), mast: Object.fromEntries(book.map(n => [n, t.mast])),
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

// 결투장 넓이 (SPEC 24장): 비행이 켜졌고 대마법사(C ≥ 10)가 끼면, 넓이를 주지 않았을 때 200 × 150 m
const FL = require('./rules/flight').api.F;
function arena(o, rules, specs) {
  if (o.width != null || o.height != null || !((rules && rules.flight != null) ? rules.flight : core.DEFAULT_RULES.flight) || !specs.some(s => (s.C ?? 1) >= FL.arenaC)) return o;
  return { width: FL.arena[0], height: FL.arena[1] };
}
// 두 편의 싸움
function battle(teamA, teamB, opt = {}) {
  const A = arena(opt, opt.rules, teamA.concat(teamB));
  const W = core.createWorld({ seed: opt.seed, rules: opt.rules, record: opt.record, recEvery: opt.recEvery, maxT: opt.maxT, width: A.width, height: A.height, obstacles: opt.obstacles, brain });
  place(W, [teamA, teamB], opt.layout);
  return core.run(W);
}
const duel = (a, b, opt) => battle([a], [b], opt);

/* ---------------- 장면 (SPEC 19장) ---------------- */
// 장면의 한 사람 → 사람 규격. 비워 둔 칸은 등급의 값을 따른다
const OVERRIDE = ['C', 'circles', 'noise', 'dec', 'autoDodge', 'hp', 'z'];
function sceneMage(mm, side, lib) {
  const sp = mage({ tier: mm.tier, deck: mm.deck, book: mm.book, name: mm.name, gear: mm.gear, tac: mm.tac, brain: mm.brain || side.brain, type: mm.type, skill: mm.skill }, lib);
  for (const k of OVERRIDE) if (mm[k] != null && mm[k] !== '') sp[k] = k === 'autoDodge' ? !!mm[k] : +mm[k];
  return sp;
}
function sceneLib(sc) { return { spells: Object.assign({}, core.SPELLS, sc.spells), decks: Object.assign({}, DECKS, sc.decks) }; }
// 장면 → 첫 걸음 전의 세계. opt.record: 녹화
function sceneWorld(sc, opt = {}) {
  const lib = sceneLib(sc), sides = sc.sides || [], specs = sides.map((s, i) => s.mages.map((mm, k) => { const sp = sceneMage(mm, s, lib); if (sp.name == null) sp.name = (s.name || '편' + i) + (k + 1); return sp; }));
  const A = arena(sc, sc.rules, [].concat(...specs));
  const W = core.createWorld({ seed: sc.seed, rules: sc.rules, record: opt.record, recEvery: opt.recEvery || sc.recEvery, maxT: sc.maxT, width: A.width, height: A.height, obstacles: sc.obstacles, barrels: sc.barrels, walls: sc.walls, salt: sc.salt, spells: lib.spells, brain });
  place(W, specs, sc.layout, sides.map(s => s.mages));
  return W;
}
const runScene = (sc, opt) => core.run(sceneWorld(sc, opt));
// viewer.html이 읽는 녹화 형식 (cli.js replay와 같다)
function recording(W) {
  const r = core.result(W), done = core.over(W);
  return { v: core.VERSION, dt: W._recN * core.DT, names: W.ms.map(m => m.name), sides: W.ms.map(m => m.side), hpMax: W.ms.map(m => m.hpMax), winner: done ? r.winner : -1, t: r.t, obs: W.obs, frames: W.rec || [] };
}

// 판이 끝난 뒤 맞힘 기록을 사람 규격에 되먹인다 (결투자가 배우는 몫)
function learn(spec, m, rate = 0.3) {
  for (const n of Object.keys(m.log.casts)) { const c = m.log.casts[n], h = m.log.hits[n] || 0; spec.hitEst[n] = (spec.hitEst[n] ?? 0.35) * (1 - rate) + rate * Math.min(1, h / c); }
  return spec;
}

module.exports = Object.assign({}, core, { brain, TIERS, DECKS, BRAINS, SKILLS, CIRCLES, register, mage, place, battle, duel, look, sceneWorld, runScene, recording, learn });
