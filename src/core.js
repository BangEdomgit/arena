'use strict';
/* =========================================================================
 * 숨 결투장 — 엔진 핵심 v2.3.0
 * 단위: m, s, kg, J. 고정 시간 간격 DT = 1/30 s. 같은 씨앗이면 같은 결과.
 * 규칙의 근거와 수식은 SPEC.md 참고. 이 파일을 바꾸면 SPEC과 버전을 같이 올린다.
 * 규칙(스위치)은 src/rules/에 하나에 한 파일로 있다. 핵심은 정해진 자리에서 켜진 규칙의 훅(W.H)만 부른다 (SPEC 22장).
 * 브라우저는 sandbox/pack.js가 묶은 sandbox/arena.js로 읽는다(전역 ArenaCore).
 * ========================================================================= */
const { sin, cos, atan2, exp, log, pow, hyp, hyp3, clamp, mulberry32 } = require('./math');
const { SPELLS } = require('./data');
const R = require('./rules');
const VERSION = '2.3.0';
const DT = 1 / 30;

// 1.x의 기본 동작 (SPEC 24장): rules에 주면 v2.0의 새 기본을 끈다
const V1_RULES = { risk: false, saltRing: false, wave: false, hpScale: false, hpK: 2.5, hpFloor: 0, bodyK: 0, evade: false, flight: false, domainR: 0, domainPath: false, callus: 0, light: false, bulwark: false, army: false, morale: false };   // hpK·hpFloor: 1.x에서 hpScale을 켠 판도 그대로
const DEFAULT_RULES = {
  domain: true,        // 장악권: 같은 공기는 가장 선명한 신호를 따른다
  circles: true,       // 서클: 두 번째 칸, 3서클부터 자동 진
  fatigue: true,       // 머리 피로와 폭주
  barrels: false,      // 지렛대: 화약통
  friendlyFire: true,  // 투사체와 폭발은 아군도 맞힌다
  powerK: 2.5,         // 위력 = 선명도^K
  domainL: 5,          // 신호가 반으로 흐려지는 거리 (m)
  passive: 0.5,        // 시전 중이 아닐 때 장악권의 세기
  fizzle: 0.15,        // 장악 몫이 이보다 작으면 마법이 흩어진다
  domainR: 5,          // (v2.0 둘째) 도달 반경: 적의 신호는 제 자리에서 domainR × C m 안에서만 몫을 다툰다. 0이면 끝없음 (SPEC 5장)
  domainPath: true,    // (v2.0 둘째) 실(thread)은 길 전체를 지어야 한다: 길의 네 점 가운데 가장 낮은 g (SPEC 5장)
  full: 0.6,           // 장악 몫이 이보다 크면 온전한 힘
  taunt: false,        // 도발: 상대의 부름(예비동작)을 끊는 마법 '도발'을 쓸 수 있다. 끄면 책에서 빠진다 (SPEC 8장)
  wave: true,          // (v2.0 기본 켬) 파도: 머리가 넘치면 굳는 대신 파도를 탄다. 부류(type: 서퍼·메타·이단)마다 다르게 (SPEC 7장)
  risk: true,          // (v2.0 기본 켬) 하이 리스크 하이 리턴: 큰 마법(big)과 역류·빈손 (1.9.0, SPEC 7장). 끄면 큰 마법이 책에서 빠진다
  saltRing: true,      // (v2.0 기본 켬) 줄어드는 소금 원: 선 밖에선 마법이 흩어지고 몸이 마른다 (1.9.0, SPEC 2장)
  bodyBind: false,     // 몸 묶기: 발밑이 아니라 몸을 묶는 마법 다섯과 눈멂의 읽기 막기 (1.11.0, SPEC 9장). 끄면 그 마법이 책에서 빠진다
  response: false,     // 대응: 순간 반응(판단 사이의 구르기)·대비(피할 수 없는 것에 몸을 굳힘)·풀기(몸 묶기를 머리로 푼다) (1.13.0, SPEC 9장, rules/response)
  silver: false,       // 은실 옷: gear.silver를 입은 사람에게 붙잡는 효과 × 0.5, 전기 × 1.1 (1.13.0, SPEC 10장, rules/silver)
  bodyK: 2.3,          // (v2.0) 몸 받침: 받는 에너지 피해 ÷ max(C, 1)^bodyK. 0이면 끔 (SPEC 24장, rules/body)
  callus: 12,          // (v2.0 둘째) 굳은 살: 부딪히는 피해는 한 방마다 callus × log₂ C / log₂ 10 만큼 뺀다. 0이면 첫 묶음(부딪힘도 ÷ C^bodyK, 총은 그대로)
  evade: true,         // (v2.0) 회피: 달리기·구르기 속도 × (1 + 0.25·log₂ C), 구르기 간격 ÷ (1 + 0.2·log₂ C) (SPEC 24장, rules/evade)
  army: true,          // (v2.0 둘째) 군대: 머스킷의 장전·화승·사거리 100 m, 박격포, 돌아가며 쏘기 (SPEC 25장, rules/army)
  morale: true,        // (v2.0 둘째) 사기: 셋 이상인 편은 사상자·큰 수의 충격에 도망친다 (SPEC 25장, rules/morale)
  bulwark: true,       // (v2.0 둘째) 벽: 세우는 데만 힘, 흙·석회는 무너질 때까지, 총알을 막음, 벽 밀기, 벽 뒤는 안 보임 (SPEC 25장, rules/bulwark)
  light: true,         // (v2.0 둘째) 빛: 번쩍임(눈멂)·열선(거울) (SPEC 25장, rules/light)
  flight: true,        // (v2.0) 비행: 출력 75 kW 이상(상위부터)이 난다. 높이 z, 속도 판단 (SPEC 24장, rules/flight)
  flightCut: false,    // (v2.3) 날기 끊기: 급정지·떨어지기·내리꽂기·튀어오르기·옆 튀기·공기 쿠션. 끊는 동안 비행에 묶인 서클·출력이 풀린다 (SPEC 27장, rules/flight)
  trapChain: false,    // (v2.3) 옆 함정 연쇄: 함정 하나가 터지면 같은 사람의 3.5 m 안 함정도 0.2 s 뒤 터진다 (SPEC 27장, rules/fort)
  hpScale: false,      // 켜면 체력 = 150 × max(C, hpFloor)^hpK (SPEC 3장. v2.0의 버팀은 몸 받침이 맡는다)
  hpK: 1.2,            // 체력의 선명도 지수 (1.x의 hpScale은 powerK = 2.5)
  hpFloor: 1,          // 선명도가 이보다 낮아도 이것으로 본다: 마법사가 아닌 몸(병사)은 150보다 약해지지 않는다 (1.x는 0)
};
// 규칙 모듈이 스위치의 기본값을 따로 적었으면 (등록한 규칙). 기본 규칙의 스위치는 위 표에 있다
for (const r of R.RULES) if (r.switch && !(r.switch in DEFAULT_RULES)) DEFAULT_RULES[r.switch] = r.default ?? false;
// 파도의 부류 (WORLD 3-3). 사람 규격의 type. 파도가 꺼져 있으면 셋 다 같다
const TYPES = ['서퍼', '메타', '이단'];
const BUFK = new Set(['speed', 'elecRes', 'bluntRes', 'toxRes', 'front', 'block', 'smoke']);   // 알려진 몸 효과 (stepMage가 이름으로 줄인다)
const BODY = { hp: 150, glu: 110, gluRegen: 1.2, stam: 6, stamRegen: 0.8, speed: 5, radius: 0.3 };
// 마법이 만들어지는 자리
// 규칙 모듈이 더하는 틀(cage·taunt…)은 그 모듈의 form에 있다 (formsOf가 붙인다)
const FORM = { proj: 'self', lob: 'self', wall: 'self', ring: 'self', shoot: 'self', smother: 'self', area: 'target', zone: 'target', trap: 'target', thread: 'path', cone: 'front', buff: 'body', move: 'body', touch: 'body' };
const THREAT = { thread: 1, area: 1, touch: 1, cone: 1, proj: 1 };

/* ---------------- 규칙 모듈과 훅 (SPEC 22장) ---------------- */
// 훅 모음: 이름마다 배열 하나. 리터럴로 만들어 모양이 늘 같다(속도). 이름은 rules/index.js의 ENGINE_HOOKS
function emptyH() { return { place: [], init: [], world: [], wall: [], wallHit: [], lobLand: [], ceff: [], power: [], gate: [], share: [], release: [], overload: [], roll: [], hurtMod: [], hurt: [], effHold: [], eff: [], rain: [], smother: [], ring: [], fatRecover: [], mageStep: [], mageZones: [], move: [], speed: [], speedLate: [], accel: [], chan: [], projSub: [], ignite: [], areaHit: [], zoneTick: [], notice: [], trapCap: [], trapFire: [] }; }
// 규칙 모듈이 엔진에서 쓰는 것 (X). 규칙 파일은 이것만 받아 쓴다
let X = null;
const ENG = new Map(), TFX = {}; let tfxVer = -1;
// 규칙의 엔진 훅은 모듈마다 한 번 만든다
function engineOf(r) { if (!r.engine) return null; let e = ENG.get(r); if (!e) { e = r.engine(X); for (const k in e) if (!(k in emptyH())) throw new Error(r.name + ': 없는 엔진 훅 ' + k + ' (' + R.ENGINE_HOOKS.join(', ') + ')'); ENG.set(r, e); } return e; }
// 틀 표(방출)와 자리 표: 규칙 목록이 바뀌었을 때만 다시 만든다
function formsOf() {
  if (tfxVer === R.ver()) return; tfxVer = R.ver();
  for (const k in TFX) TFX[k] = null;
  for (const r of R.RULES) { if (r.form) Object.assign(FORM, r.form); if (r.threat) Object.assign(THREAT, r.threat); if (r.types) Object.assign(TFX, r.types(X)); }
}
// 세계를 만들 때: 켜진 규칙만 골라 그 훅을 차례대로 모은다. 꺼진 규칙은 걸음마다 비용 0
function hooksFor(W, opt) {
  formsOf();
  const H = emptyH(), mods = [];
  for (const r of R.RULES) {
    if (!R.onOf(r)(W, opt)) continue; mods.push(r);
    const e = engineOf(r); if (e) for (const k in e) H[k].push(e[k]);
  }
  W.H = H; W.mods = mods;
}
const TA = { aim: 0, foes: null, g: 0 };   // 틀 방출에 넘기는 값 (새로 만들지 않는다)

/* ---------------- 세계 ---------------- */
// 마법 모양 맞추기 (속도, 1.11.1): 사람의 책에 든 마법을 세계마다 같은 필드·같은 차례의 새 객체로 옮긴다(없는 필드는 undefined, 읽는 값은 그대로).
// 원본은 82개가 51가지 모양이라 's.t' 같은 읽기가 느린 길로 갔다. 객체 리터럴로 만들어야 빠른 모양이 된다(하나씩 넣으면 사전 모양이 된다).
// 목록에 없는 필드(등록한 마법)는 뒤에 붙인다. 속 객체(hit·z·b…)는 원본을 가리킨다. 원본은 고치지 않는다
const SPELL_KEYS = new Set(["n", "el", "t", "m", "v", "R", "cost", "cast", "cd", "hit", "role", "L", "dur", "dps", "kind", "burn", "burst", "mv", "dist", "self", "z", "tr", "vis", "E", "r", "delay", "dmg", "stun", "b", "react", "flight", "hp", "at", "wet", "push", "lock", "banned", "blind", "life", "home", "tags", "desc", "kill", "multi", "fast", "root", "rad", "chill", "mundane", "rule", "big", "cramp", "pr", "needGear", "aimN", "aimD", "fuse", "reload", "wallDmg"]);
function shapeOne(s) { const o = { n: s.n, el: s.el, t: s.t, m: s.m, v: s.v, R: s.R, cost: s.cost, cast: s.cast, cd: s.cd, hit: s.hit, role: s.role, L: s.L, dur: s.dur, dps: s.dps, kind: s.kind, burn: s.burn, burst: s.burst, mv: s.mv, dist: s.dist, self: s.self, z: s.z, tr: s.tr, vis: s.vis, E: s.E, r: s.r, delay: s.delay, dmg: s.dmg, stun: s.stun, b: s.b, react: s.react, flight: s.flight, hp: s.hp, at: s.at, wet: s.wet, push: s.push, lock: s.lock, banned: s.banned, blind: s.blind, life: s.life, home: s.home, tags: s.tags, desc: s.desc, kill: s.kill, multi: s.multi, fast: s.fast, root: s.root, rad: s.rad, chill: s.chill, mundane: s.mundane, rule: s.rule, big: s.big, cramp: s.cramp, pr: s.pr, needGear: s.needGear, aimN: s.aimN, aimD: s.aimD, fuse: s.fuse, reload: s.reload, wallDmg: s.wallDmg }; for (const k in s) if (!SPELL_KEYS.has(k)) o[k] = s[k]; return o; }
const SHAPED = new WeakSet();   // 이 세계에서 모양을 맞춘 사본 (원본 마법은 여기 없다)
function shapeBook(W, book) { for (const n of book) { const s = W.spells[n]; if (s && !SHAPED.has(s)) { const o = shapeOne(s); SHAPED.add(o); W.spells[n] = o; } } }
function createWorld(opt = {}) {
  const W = {
    v: VERSION, t: 0, step: 0, width: opt.width || 40, height: opt.height || 30,
    rng: mulberry32((opt.seed >>> 0) || 1), rules: Object.assign({}, DEFAULT_RULES, opt.rules),
    spells: Object.assign({}, opt.spells || SPELLS), brain: opt.brain || null,   // 책에 든 마법은 addMage가 모양을 맞춘다
    obs: [], walls: [], proj: [], lobs: [], areas: [], zones: [], traps: [], barrels: [], ms: [], fx: [],
    foes: [[], []], _nF: null, _alive: null, _cloak: false, rec: opt.record ? [] : null, sides: 2, maxT: opt.maxT || 120,
    H: null, mods: null, _bh: null, _fly: false, _grp: 0, _sideN: null, _wv: 0, _wgN: -1, _wg: null, _wq: [],   // 벽 격자 (벽이 많을 때, 속도): 벽 목록의 판번호·격자를 만든 판번호·격자·찾은 목록
    salt: Array.isArray(opt.salt) ? opt.salt.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h })) : [],   // salt: 소금 땅 사각형 (rules/saltLand)   // _grp: 벽 무리의 다음 번호 (rules/bulwark)
      // 켜진 규칙의 엔진 훅, 켜진 규칙 모듈, 두뇌 훅(두뇌가 채운다), 비행이 켜졌나(녹화에 높이를 적는다)
  };
  hooksFor(W, opt);
  W.rnd = (a, b) => a + W.rng() * (b - a);
  // 바위·화약통·벽은 목록으로 직접 줄 수 있다(장면). 안 주면 씨앗을 따라 놓는다
  if (Array.isArray(opt.obstacles)) W.obs = opt.obstacles.map(o => ({ x: o.x, y: o.y, r: o.r || 1.2 }));
  const nObs = Array.isArray(opt.obstacles) ? 0 : opt.obstacles ?? 12, keep = opt.clear || [];
  for (let t = 0; W.obs.length < nObs && t < 400; t++) {
    const o = { x: W.rnd(5, W.width - 5), y: W.rnd(3, W.height - 3), r: W.rnd(0.7, 1.8) };
    if (keep.some(k => hyp(o.x - k[0], o.y - k[1]) < (k[2] || 4))) continue;
    if (W.obs.some(q => hyp(q.x - o.x, q.y - o.y) < q.r + o.r + 1.2)) continue;
    W.obs.push(o);
  }
  for (const h of W.H.place) h(W, opt);   // 규칙이 놓는 것 (화약통)
  if (Array.isArray(opt.walls)) for (const w of opt.walls) addWall(W, { x: w.x, y: w.y, r: w.r || 0.6, hp: w.hp || 200, t: 1e9, own: -1, mat: w.mat || 'lime', thick: w.thick ?? (w.r || 0.6) * 2, grp: w.grp ?? -1 });
  for (const h of W.H.init) h(W);
  return W;
}

// 체력 배수 (SPEC 3장): hpScale이면 max(C, hpFloor)^hpK
const hpMul = (W, spec) => W.rules.hpScale ? pow(Math.max(spec.C ?? 1, W.rules.hpFloor), W.rules.hpK) : 1;
function addMage(W, spec, side, x, y) {
  const book = (spec.book || []).filter(n => W.spells[n] && (!W.spells[n].banned || spec.allowBanned) && (!W.spells[n].rule || W.rules[W.spells[n].rule]) && (!W.spells[n].needGear || (spec.gear && spec.gear[W.spells[n].needGear])));   // 규칙에 딸린 마법은 그 규칙이 켜졌을 때만, 장비가 드는 마법(열선: 거울)은 그 장비가 있을 때만
  shapeBook(W, book);
  const m = {
    id: W.ms.length, name: spec.name || 'm' + W.ms.length, side, x, y, vx: 0, vy: 0, r: BODY.radius,
    hpMax: (spec.hp || BODY.hp) * hpMul(W, spec), hp: (spec.hp || BODY.hp) * hpMul(W, spec), glu: spec.glu || BODY.glu, gluMax: spec.glu || BODY.glu, stam: BODY.stam,
    C: spec.C ?? 1, circles: spec.circles ?? 1, noise: spec.noise ?? 0.05, react: spec.react ?? 0.2, dec: spec.dec ?? 0.15,
    brain: spec.brain || null, skill: spec.skill || null, autoDodge: !!spec.autoDodge, type: spec.type || '메타', wave: 0, waveT: 0, crash: 0, gear: Object.assign({}, spec.gear), book, mast: spec.mast || {}, _deck: null, _cand: null, _pool: null, hitEst: Object.assign({}, spec.hitEst),
    tac: Object.assign({ prefR: 7, aggr: 1, trapBias: 0.1, zoneBias: 0.05, dodge: 0.6, focusLow: false, crowd: true, stance: true, rest: 75,
      // 판단 스위치 (1.5.0, SPEC 13장). 기본값이 1.4.0까지의 두뇌. 판단 수준(skill)이 덮는다
      readCast: true, lead: 1, combo: true, lever: true, pathTrap: true, slotB: true, terrain: false, readWave: false, cdRead: false, outrange: false, feint: false, learn: false, waveChoose: false, counter: false, rollCap: 9, rollBias: null,
      // 기술 사다리 (1.7.0, SPEC 13장): 시전 중 걷기 비율, 쏜 뒤 멈춤(범위, 사람마다 한 번), 쏘는 중에 다음 수 정하기, 두 수 콤보 계획
      castMove: 0.5, pause: null, plan: false, combo2: false, slotBMin: 1, slotBOff: true, learnAim: 'narrow', readLob: true,   // (v2.0) 두 번째 칸: 쓸 수의 값 문턱(plan이 있는 사람)·공격을 겹치는가, 학습한 구르는 쪽 겨냥('narrow' 투사체·실 / 'wide' 넓은 마법만 반쯤), 떨어지는 돌 읽기
      // (1.7.0 상급) 방패는 아무 때나(초보), 큰 공격을 위해 방패 아끼기, 상대가 피하면 캔슬, 엄폐, 박자 흔들기
      shieldAny: false, shieldSave: false, cancel: false, cover: false, tempo: false, coverW: 1.5,
      // (1.7.0 대가·전설) 몰이, 엄폐 걷어내기, 유도, 동시 착탄, 기회 캔슬 / 방어 미끼, 약한 척 물러서기, 세 마법 겹치기
      herd: false, strip: false, lure: false, simul: false, cancel2: false, bait: false, fakeRetreat: false, triple: false,
      bigPlan: false, dodgeAim: false, grab: false,
      swarm: true, siege: true, wallSite: false, wallBreak: false, retreat: false,
      rhythm: false, rhythmTime: false, domainPush: false, efficacy: false, buffNeed: false, shape: false, roles: false,
      flyCut: 0, fortify: 0, breach: false }, spec.tac),   // (v2.3) 날기 끊기(1 상급 · 2 대가 · 3 전설, rules/flight), 진지 짓기(1 상급 · 2 대가 몰이길 · 3 전설 미끼)·부수기(대가, rules/fort) (27장)   // (v2.2) 리듬(상급 'mimic', 대가부터 true)·때 재기·장악권 밀기, 효과 학습, 강화의 때(상급), 지형 설계·칸의 역할 (26장)   // (v2.0 둘째) 무리·성 (강한 적 하나, 또는 총·무리를 상대할 때만), 벽 자리(상급)·벽 없애기(대가)·물러나기(상급)   // (1.10.0 risk) 피할 자리 겨냥(상급부터), 붙잡기(대가부터)   // (1.9.0 대가·전설) 큰 수를 짝 묶기에 맞춰 꽂는다
    st: { stun: 0, root: 0, wet: 0, burn: 0, chill: 0, blind: 0, cough: 0, mycel: 0, cramp: 0, lime: 0, fetter: 0 }, _bufx: [], _sigX: NaN, _sigN: false, _szC: NaN, _sz: 1, _pwC: NaN, _pwK: NaN, _pw: 1, buf: { speed: null, elecRes: null, bluntRes: null, toxRes: null, front: null, block: null, smoke: null }, cd: {}, cast: null, castB: null, chan: null, roll: 0, rollCd: 0, autoCd: 0, fat: 0, aim: 0, thinkT: W.rng() * 0.1,
    mv: { x: 0, y: 0 }, mem: {}, waveWant: false, relT: null, lastRel: -9, comboPend: null, combo: null, last: null, lastT: -9, sf: 1, stance: 'normal', vault: 0, _sig: 1, _act: false, deathT: null,
    // 판 중에 채우는 칸. 처음부터 두어 객체 모양이 바뀌지 않게 한다(속도, 1.11.1). 값은 비어 있을 때와 같게 읽힌다 (null ?? −9, 0 || 0)
    bigp: null, simul: null, herd: null, hold: 0, lureT: null, baitT: null, baitDone: 0, emptyT: -9, lastHit: null, h2sT: 0, thinkAt: null, losWas: false, pauseLen: 0, rollSide: 0, rollPref: 0, _ref: null,
    reflexT: -9, braceT: -9, unbindCd: -9, unbindReq: 0, braceReq: 0,   // 대응 (rules/response, 1.13.0)
    _bkC: NaN, _bk: 1, _clC: NaN, _cl: 0, _evC: NaN, _evS: 1, _evR: 1,   // 몸 받침·회피의 배수 (선명도마다 한 번, rules/body·evade)
    // 높이 (v2.0, SPEC 24장): 땅 0. 비행(rules/flight)만 바꾼다. fly: 0 걷기·1 날기·2 떨어지기. fv·fz·flyWant는 두뇌가 정하는 목표 속도·높이·뜨기
    z: spec.z > 0 ? spec.z : 0, vz: 0, fly: spec.z >= 1 ? 1 : 0, flyWant: spec.z >= 1,   // 장면은 떠서 시작할 수 있다 (z)
    fv: 0, fz: 0, fallZ: 0, load: 0, airFilm: false, _nm: 1, _flC: NaN, _flP: 0, _grazeN: null, _grazeT: -9, _feC: null, _flT0: 0, _gun: undefined, _ltT: -9, flee: 0, shock: 0, retreat: 0,
    // 리듬 (v2.2, brain/techniques/rhythm): 단계(떠보기·들어가기·빠지기, v2.3: 짓기·진지)와 속 값(단계 시각·물러남 끝·2 s 전 체력과 그 시각, 몰이 자리를 고른 시각)
    phase: 'probe', ph: { t: 0, until: -9, hp: 0, hpT: -9, shT: -9 },
    // 날기 끊기 (v2.3, rules/flight): 두뇌가 청한 끊기(w), 하는 중인 끊기(k: 1 급정지·2 옆 튀기·3 튀어오르기·4 떨어지기·5 내리꽂기)와 남은 시간·간격, 옆 방향, 공기 쿠션을 뿜을 높이(−1 없음)·뿜는 중, 떨어지기 시작 높이, 내려앉으며 친 수와 시각
    cut: { w: 0, k: 0, t: 0, cd: 0, x: 0, y: 0, z: -1, on: false, z0: 0, n: null, nT: -9 },
    // 사람의 맨 위 칸은 127개까지다: 넘으면 V8이 리터럴을 느린 길로 만들어 판이 두 배 느려진다 (v2.3에서 쟀다). 새 칸은 하위 객체에 (SPEC 17장)
      // 사기 (rules/morale): 도망 중, 충격
    // 비행의 기록 (v2.0, 행동 지표): 난 시간, 속도 합·제곱 합, 코너 속도 근처 시간, 속도 속임, 높이 변화 합, 추락, 스쳐 치기 시도·적중
    flog: { t: 0, v: 0, v2: 0, corner: 0, feint: 0, dz: 0, falls: 0, grazeTry: 0, grazeHit: 0,
      cut: 0, brake: 0, side: 0, hop: 0, drop: 0, dive: 0, cush: 0, crash: 0, dropTry: 0, dropHit: 0, hfeint: 0 },   // 날기 끊기 (v2.3): 끊은 수와 갈래별, 공기 쿠션, 쿠션 실패(추락), 내려앉으며 친 시도·명중, 높이 속이기
    // 진지 (v2.3, 27장, rules/fort): 자리·바라보는 쪽, 짓는 계획(칸 목록), 세운 시각, 몰이길에 든 것을 센 시각 / 기록: 지은 벽(세우기·기둥 시전)·함정·하늘 덮개, 덮개가 굳힌 수, 연쇄로 터진 함정, 치운 함정·덮개, 몰이길로 든 적, 진지 안·밖에서 적에게 받은 피해, 세운 진지
    fort: { x: NaN, y: NaN, ux: 0, uy: 0, plan: null, t: -9, gT: -9, walls: 0, traps: 0, sky: 0, skyZap: 0, chain: 0, clear: 0, funnel: 0, inDmg: 0, outDmg: 0, founded: 0 },
    // 군대와 벽의 기록 (v2.0 둘째, 25장): 번쩍임·맞힌 수·눈먼 수, 무거운 돌 시도·명중, 세운 벽 수·벽 뒤 시간, 도망(시각)
    // 고수 싸움의 기록 (v2.2, 26장 지표): 칸마다 역할별 시전(A·B·자동), 리듬 단계별 시간, 세운·없앤 지형
    mlog: { role: { A: {}, B: {}, auto: {} }, phase: {}, built: 0, razed: 0, dS: 0, dS2: 0, dN: 0, gS: 0, bMove: 0, bx: NaN, by: NaN, bT: 0 },   // 거리 합·제곱 합·수, 경계 틈 합, 경계가 움직인 거리, 지난 경계 자리·시각 (판단 때마다, brain/index)
    alog: { flash: 0, flashHit: 0, blinded: 0, heavyTry: 0, heavyHit: 0, walls: 0, wallT: 0, fled: 0, fledT: null },
    log: { dealt: {}, casts: {}, hits: {}, taken: {}, fizz: 0, over: 0, barrel: 0, stanceT: {}, waves: 0, lost: 0, waveDmg: 0, waveDeath: 0, taunted: 0,
      // 행동 지표 (1.7.0): 시전 시작 시각, 빈틈(쏜 뒤 다음 시작까지) 합·수, 콤보 시도·성공
      starts: [], gaps: [], gapSum: 0, gapN: 0, comboTry: 0, comboHit: 0, bigCast: 0, bigHit: 0, bigPair: 0, bigPin: 0, pinTry: 0, backfire: 0, grab: 0, cTry: {}, cHit: {}, cancel: 0, coverT: 0, defTry: 0, defHit: 0, lure: 0, simul: 0,
      dec: { n: 0, cat: {}, form: {}, react: 0, def: 0, combo: 0, atk: 0, trapPath: 0, trap: 0, barrel: 0, slotB: 0, auto: 0, rest: 0 } },
  };
  // 구르는 쪽 버릇 (1.6.0): 좋아하는 쪽(왼 +1·오른 −1)과 그쪽으로 구를 확률을 사람 만들 때 한 번 정한다
  if (m.tac.pause) m.pauseLen = m.tac.pause[0] + W.rng() * (m.tac.pause[1] - m.tac.pause[0]);   // 초보: 늘 같은 박자
  if (m.tac.rollBias) { m.rollSide = W.rng() < 0.5 ? 1 : -1; m.rollPref = m.tac.rollBias[0] + W.rng() * (m.tac.rollBias[1] - m.tac.rollBias[0]); }
  W.ms.push(m);
  if (side + 1 > W.sides) { W.sides = side + 1; while (W.foes.length < W.sides) W.foes.push([]); }
  return m;
}

/* ---------------- 신호: 선명도, 위력, 장악권 ---------------- */
// 파도를 타는 동안 피로는 100을 넘을 수 있지만, 선명도·위력·시전 시간은 100에서 더 나빠지지 않는다 (파도가 없으면 피로는 100을 넘지 않는다)
function ceff(W, m) { let x = m.C * (W.rules.fatigue ? Math.max(0.45, 1 - Math.min(m.fat, 100) / 150) : 1); const h = W.H.ceff; for (let i = 0; i < h.length; i++) x = h[i](W, m, x); return x; }
function power(W, m, s) {
  if (s.mundane) return 1;
  if (m._pwC !== m.C || m._pwK !== W.rules.powerK) { m._pwC = m.C; m._pwK = W.rules.powerK; m._pw = pow(m.C, W.rules.powerK); }
  let x = m._pw * (1 + 0.3 * (m.mast[s.n] || 0)) * (W.rules.fatigue ? Math.max(0.6, 1 - Math.min(m.fat, 100) / 200) : 1);
  const h = W.H.power; for (let i = 0; i < h.length; i++) x = h[i](W, m, s, x);   // 파도의 부류 (rules/wave)
  return x;
}
const rangeOf = (m, s) => (s.R || 0) * (s.mundane ? 1 : Math.sqrt(m.C));
// C^0.4는 사람마다 한 번 (결정론 pow가 비싸다, 속도 1.11.1). C가 바뀌면 다시 잰다
const sizeOf = (m, s) => (s.mundane ? 1 : m._szC === m.C ? m._sz : (m._szC = m.C, m._sz = pow(m.C, 0.4)));
// 신호 세기 = 선명도^K (걸음 첫머리 refreshSides의 선명도로). 읽을 때만 잰다
function sigOf(W, m) { if (m._sigN) { m._sigN = false; m._sig = pow(m._sigX, W.rules.powerK); } return m._sig; }
// 장악 몫 f: (x,y)의 공기가 m의 신호를 따를 몫. 0~1
function share(W, m, x, y) {
  if (!W.rules.domain) return 1;
  const L = W.rules.domainL, foes = W.foes[m.side], Rr = W.rules.domainR;
  const mine = sigOf(W, m) / (1 + hyp(x - m.x, y - m.y) / L);
  let other = 0;
  for (let i = 0; i < foes.length; i++) { const q = foes[i], dq = hyp(x - q.x, y - q.y); if (Rr > 0 && dq > Rr * q.C) continue; other += sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + dq / L); }   // 도달 반경 밖의 적은 다투지 않는다 (v2.0 둘째)
  let f = mine / (mine + other);
  const h = W.H.share; for (let i = 0; i < h.length; i++) f = h[i](W, m, x, y, f);   // 소금 망토 (rules/gear)
  return f;
}
const gOf = (W, f) => clamp((f - W.rules.fizzle) / (W.rules.full - W.rules.fizzle), 0, 1);
function formPoint(m, s, tx, ty) {
  const k = FORM[s.t];
  if (k === 'target' || k === 'path') return [tx, ty];
  if (k === 'front') { const d = hyp(tx - m.x, ty - m.y) || 1, L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') { const d = hyp(tx - m.x, ty - m.y) || 1; return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5]; }
  return null;
}
// 이 자리에 마법이 서는 정도 g. 규칙의 문(gate)이 막으면 0 (소금 원, rules/saltRing)
function gAt(W, m, s, tx, ty) {
  const h = W.H.gate; for (let i = 0; i < h.length; i++) if (h[i](W, m, s, tx, ty)) return 0;
  if (s.mundane || !W.rules.domain) return 1;
  if (FORM[s.t] === 'path' && W.rules.domainPath) {   // 길 전체를 지어야 한다: 사거리로 자른 길의 ¼·½·¾·끝 가운데 가장 낮은 몫 (v2.0 둘째, SPEC 5장)
    const dx = tx - m.x, dy = ty - m.y, d = hyp(dx, dy) || 1, R = rangeOf(m, s), k = d > R ? R / d : 1; let f = 1;
    for (let i = 1; i <= 4; i++) { const q = share(W, m, m.x + dx * k * i / 4, m.y + dy * k * i / 4); if (q < f) f = q; }
    return gOf(W, f);
  }
  const p = formPoint(m, s, tx, ty); return p ? gOf(W, share(W, m, p[0], p[1])) : 1;
}

/* ---------------- 공간 ---------------- */
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, t = clamp(((cx - x1) * dx + (cy - y1) * dy) / L2, 0, 1); return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
// 선분의 테두리 상자(+ 반지름) 밖에 있는 원은 재지 않는다: 가장 가까운 점은 상자 안이라 결과가 같다 (속도, 1.11.1)
function segBox(x1, y1, x2, y2, cx, cy, r) { const e = r + 1e-9; return cx < (x1 < x2 ? x1 : x2) - e || cx > (x1 > x2 ? x1 : x2) + e || cy < (y1 < y2 ? y1 : y2) - e || cy > (y1 > y2 ? y1 : y2) + e; }
function blocked(W, x1, y1, x2, y2, z) {
  if (!(z > 2)) {   // 시선 끝 하나라도 2 m 넘게 떠 있으면 바위·벽이 가리지 않는다 (v2.0)
  for (const o of W.obs) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  const ws = W.walls;
  if (ws.length <= WMIN) { for (const o of ws) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true; }
  else { const q = wallsIn(W, (x1 < x2 ? x1 : x2) - WRMAX, (y1 < y2 ? y1 : y2) - WRMAX, (x1 > x2 ? x1 : x2) + WRMAX, (y1 > y2 ? y1 : y2) + WRMAX); for (let i = 0; i < q.length; i++) { const o = ws[q[i]]; if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true; } }
  }
  for (const z of W.zones) if (z.k === 'smoke' && z.shape === 'circle' && segCircle(x1, y1, x2, y2, z.x, z.y, z.r)) return true;
  return false;
}
function inZone(z, x, y) { if (z.shape === 'circle') return hyp(x - z.x, y - z.y) < z.r; const dx = cos(z.a), dy = sin(z.a), rx = x - z.x, ry = y - z.y; return Math.abs(rx * dx + ry * dy) < z.len / 2 && Math.abs(-rx * dy + ry * dx) < 0.6; }
// 벽 세우기: 모든 벽이 이것으로 선다. 모양이 늘 같은 리터럴로 옮기고(속도) 규칙이 고친다(재료의 수명, rules/bulwark)
function addWall(W, w) {
  const o = { x: w.x, y: w.y, r: w.r, hp: w.hp, hp0: w.hp, t: w.t, own: w.own, by: w.by || null, used: 0, cage: w.cage || 0, mat: w.mat || 'lime', thick: w.thick || w.r * 2, grp: w.grp ?? -1, mk: w.mk ?? -1 };   // mk: 세운 사람의 번호(흙벽·보루, 진지의 두뇌가 본다)
  const h = W.H.wall; for (let i = 0; i < h.length; i++) h[i](W, o); W.walls.push(o); W._wv++; return o;
}
// 벽 격자 (속도, v2.0 둘째): 벽이 WMIN개 넘게 서면 8 m 칸마다 벽의 번호를 적어 두고, 가까운 칸의 벽만 원래 차례(번호 순)로 본다.
// 벽이 적으면 예전처럼 모두 훑는다(결과가 비트까지 같다). 많아도 같은 벽을 같은 차례로 보니 결과는 모두 훑은 것과 같다
const WG = 8, WMIN = 16, WRMAX = 1.5;
function wallGrid(W) {
  if (W._wgN === W._wv) return W._wg;
  const g = new Map(), ws = W.walls;
  for (let i = 0; i < ws.length; i++) { const w = ws[i], x0 = Math.floor((w.x - w.r) / WG), x1 = Math.floor((w.x + w.r) / WG), y0 = Math.floor((w.y - w.r) / WG), y1 = Math.floor((w.y + w.r) / WG); for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) { const k = cx * 65536 + cy; let a = g.get(k); if (!a) g.set(k, a = []); a.push(i); } }
  W._wg = g; W._wgN = W._wv; return g;
}
// 사각형 [x0, x1] × [y0, y1] 에 닿을 수 있는 벽의 번호 (차례대로, 겹침 없이). W._wq를 다시 쓴다
function wallsIn(W, x0, y0, x1, y1) {
  const g = wallGrid(W), q = W._wq; q.length = 0;
  const a0 = Math.floor(x0 / WG), a1 = Math.floor(x1 / WG), b0 = Math.floor(y0 / WG), b1 = Math.floor(y1 / WG);
  for (let cx = a0; cx <= a1; cx++) for (let cy = b0; cy <= b1; cy++) { const a = g.get(cx * 65536 + cy); if (a) for (let i = 0; i < a.length; i++) q.push(a[i]); }
  if (q.length > 1) { q.sort(numUp); let j = 1; for (let i = 1; i < q.length; i++) if (q[i] !== q[j - 1]) q[j++] = q[i]; q.length = j; }
  return q;
}
const numUp = (a, b) => a - b;
// 소금 땅 위인가 (장면의 사각형, rules/saltLand)
function onSalt(W, x, y) { const a = W.salt; for (let i = 0; i < a.length; i++) { const r = a[i]; if (x >= r.x && y >= r.y && x <= r.x + r.w && y <= r.y + r.h) return true; } return false; }
function frontBlock(e, sx, sy) { if (!e.buf.front) return false; const a = atan2(sy - e.y, sx - e.x), b = Math.abs(((a - e.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 1.1; if (b && !e.buf.front.used) { e.buf.front.used = 1; e.log.defHit++; } return b; }   // 막은 방패는 방어 적중으로 한 번 센다

/* ---------------- 피해와 상태 ---------------- */
function hurt(W, m, v, src, name, kind) {
  if (m.hp <= 0 || v <= 0) return;
  const b = m.buf;
  if (kind === 'elec' && b.elecRes) v *= b.elecRes.v;
  if (kind === 'blunt' && b.bluntRes) v *= b.bluntRes.v;
  if (kind === 'tox' && b.toxRes) v *= b.toxRes.v;
  const H = W.H, hm = H.hurtMod; for (let i = 0; i < hm.length; i++) v = hm[i](W, m, v, kind, name);   // 흡수 안개·물 장막 (rules/terrain), 몸 받침 (rules/body)
  if (kind === 'elec' && m.st.wet > 0) v *= 1.5;
  if (kind === 'fire' && m.st.wet > 0) v *= 0.6;
  m.hp -= v; m.log.taken[kind] = (m.log.taken[kind] || 0) + v;
  const hh = H.hurt; for (let i = 0; i < hh.length; i++) hh[i](W, m, v, src, name, kind);   // 몸 묶기가 불에 풀림 (rules/control), 역류 (rules/risk)
  // 동시 착탄: 같은 사람의 다른 마법이 0.2 s 안에 같은 과녁에 닿았다 (셋이면 둘로 센다)
  if (src && v >= 2) { const h = m.lastHit; if (h && h.src === src && W.t - h.t < 0.2 && !h.names.includes(name)) { src.log.simul++; h.names.push(name); } else m.lastHit = { src, t: W.t, names: [name] }; }
  // 방어 미끼 (전설): 미끼로 방패를 든 뒤 1.5 s 안에, 그걸 보고 시전하던 상대를 맞혔다
  if (src && src.baitT != null && W.t - src.baitT < 1.5 && (m.cast || m.castB) && !src.baitDone) { src.baitDone = 1; src.log.defTry++; src.log.defHit++; }
  // 콤보 성공: 콤보로 쏜 마법이 묶이거나 굳은(전기면 젖은) 상대에게 들어갔다
  const cp = src && src.comboPend; if (cp && cp.tgt === m && W.t <= cp.until && (m.st.stun > 0 || m.st.root > 0 || (kind === 'elec' && m.st.wet > 0))) { src.log.comboHit++; src.log.cHit[cp.kind] = (src.log.cHit[cp.kind] || 0) + 1; src.comboPend = null; }
  if (src && src !== m) src.log.dealt[name] = (src.log.dealt[name] || 0) + v;
  if (m.hp <= 0 && m.deathT === null) m.deathT = W.t;
}
function eff(W, m, o, g = 1) {
  if (!o) return;
  let gh = g; const hh = W.H.effHold; for (let i = 0; i < hh.length; i++) gh = hh[i](W, m, o, gh);   // 붙잡는 효과(굳음·묶임·몸 묶기)의 몫: 은실 옷 (rules/silver)
  if (o.burn) m.st.burn = Math.max(m.st.burn || 0, o.burn * g);
  if (o.wet) m.st.wet = 20;
  if (o.chill) m.st.chill = Math.max(m.st.chill || 0, o.chill * g);
  if (o.stun) m.st.stun = Math.max(m.st.stun || 0, o.stun * gh * (m.buf.elecRes && o.kind === 'elec' ? 0.3 : 1));
  if (o.root) m.st.root = Math.max(m.st.root || 0, o.root * gh);
  if (o.blind) m.st.blind = Math.max(m.st.blind || 0, o.blind * g);
  if (o.cough) m.st.cough = Math.max(m.st.cough || 0, o.cough * g);
  const h = W.H.eff; for (let i = 0; i < h.length; i++) h[i](W, m, o, gh);   // 몸 묶기 (rules/control). 붙잡는 효과라 gh
  if (m.st.stun > 0) { m.cast = null; m.castB = null; m.chan = null; }
}
// 한 사람이 깔아 둘 수 있는 함정 수: 셋. 규칙이 고친다(진지: 서클만큼, rules/fort)
function trapCap(W, m) { let n = 3; const h = W.H.trapCap; for (let i = 0; i < h.length; i++) n = h[i](W, m, n); return n; }
const hit = (m, s) => { m.log.hits[s.n] = (m.log.hits[s.n] || 0) + 1; if (s.big) m.log.bigHit++; };
function addZone(W, src, z, x, y, a, g) { const gz = g ?? 1; const zz = Object.assign({}, z, { x, y, a: a || 0, src, dps: (z.dps || 0) * gz, t: z.d * (gz < 1 ? Math.max(0.3, gz) : 1) }); W.zones.push(zz); if (zz.k === 'fire') ignite(W, x, y, zz.r || (zz.len || 2) / 2, src); }
// 불·전기가 (x, y) 둘레 r m에 닿았다 (화약통, rules/barrels)
function ignite(W, x, y, r, src) { const h = W.H.ignite; for (let i = 0; i < h.length; i++) h[i](W, x, y, r, src); }
function canHit(W, p, q) { return q !== p.src && q.hp > 0 && (W.rules.friendlyFire || q.side !== p.src.side); }

/* ---------------- 마법 방출 ---------------- */
function release(W, m, c) {
  const s = c.s, tx = c.tx, ty = c.ty, dx0 = tx - m.x, dy0 = ty - m.y, d0 = hyp(dx0, dy0) || 1, ux = dx0 / d0, uy = dy0 / d0;
  m.aim = atan2(uy, ux);
  m.log.casts[s.n] = (m.log.casts[s.n] || 0) + 1;
  if ((s.t === 'wall' || s.t === 'shoot' || (s.t === 'buff' && s.b.front)) && !c.bait) m.log.defTry++;   // 미끼 방패는 성공했을 때만 방어로 센다
  const hr = W.H.release; for (let i = 0; i < hr.length; i++) hr[i](W, m, c);   // 빈손 (rules/risk)
  if (!c.auto && !c.B) { m.relT = W.t; m.lastRel = W.t; if (m.tac.plan) m.thinkT = 0; }   // 빈틈·멈춤은 첫 칸으로 센다   // 쏘는 중에 다음 수를 정해 둔 사람은 바로 다음 걸음에 시작한다
  if (W.rules.fatigue && !s.mundane) {
    m.fat += s.cost * (c.B ? 1.3 : 1) * (c.auto ? 0.8 : 1) * 1.6;
    // 머리가 넘치면 굳는다(폭주). 규칙이 넘침을 맡으면(파도, rules/wave) 그 규칙이 한다
    let took = false; const ho = W.H.overload; for (let i = 0; i < ho.length; i++) if (ho[i](W, m)) { took = true; break; }
    if (!took && m.fat > 100) { m.st.stun = Math.max(m.st.stun || 0, 1); m.fat = 55; m.log.over++; m.cast = m.castB = m.chan = null; }
  }
  const g = gAt(W, m, s, tx, ty);
  if (g <= 0.02) { m.log.fizz++; return; }
  const P = power(W, m, s) * g, rs = sizeOf(m, s), foes = W.foes[m.side];
  switch (s.t) {
    case 'proj': {
      const n = s.multi || 1;
      for (let j = 0; j < n; j++) {
        const a = atan2(uy, ux) + (n > 1 ? (j / (n - 1) - 0.5) * 0.26 : 0) + (W.rng() - 0.5) * 2 * (s.aimN != null ? s.aimN + s.aimD * d0 : m.noise) * m._nm * (m.st.blind > 0 ? 3 : 1);   // 총의 흔들림은 총이 정한다(멀수록 크다, rules/army)
        // 높이 (v2.0): 쏜 사람의 높이에서 과녁의 높이로 곧게. 날며 쏘면 내 속도가 더해진다
        const tz = c.tgt && c.tgt.hp > 0 ? c.tgt.z : 0, vz = tz !== m.z ? (tz - m.z) / (d0 / s.v) : 0, fl = m.z > 0;
        W.proj.push({ x: m.x, y: m.y, vx: cos(a) * s.v + (fl ? m.vx : 0), vy: sin(a) * s.v + (fl ? m.vy : 0), z: m.z, vz, home: s.home, life: s.home ? s.life : rangeOf(m, s) / s.v, s, src: m, pow: P / (n > 1 ? n * 0.55 : 1), rad: (s.rad || 0.1) * (s.mundane ? 1 : Math.min(rs, 3)) });
      }
      break;
    }
    case 'lob': W.lobs.push({ x: tx, y: ty, t: s.flight, s, src: m, pow: P, r: s.r * rs }); break;
    case 'thread': {
      const R = rangeOf(m, s), ex = d0 > R ? m.x + ux * R : tx, ey = d0 > R ? m.y + uy * R : ty, ez = c.tgt ? c.tgt.z : 0;   // 실의 끝 높이는 과녁의 높이 (v2.0)
      if (!blocked(W, m.x, m.y, ex, ey, m.z > ez ? m.z : ez)) {
        let tgt = null; for (const q of foes) if (hyp3(q.x - ex, q.y - ey, q.z - ez) < 0.6 * Math.min(rs, 2) + 0.2) { tgt = q; break; }
        if (tgt && !frontBlock(tgt, m.x, m.y)) { hurt(W, tgt, 0.8 * pow(s.E, 0.55) * P, m, s.n, 'elec'); eff(W, tgt, s.cramp ? { cramp: s.cramp } : { stun: Math.min(1.2, s.E / 800), kind: 'elec' }, g); hit(m, s); }   // 경직 실은 굳힘 대신 경직
      }
      if (W.rec) W.fx.push(['z', m.x, m.y, ex, ey]); ignite(W, ex, ey, 0.7, m); break;
    }
    case 'area': W.areas.push({ x: tx, y: ty, r: s.r * rs, t: s.delay, s, src: m, pow: P, vis: !!s.vis, g }); break;
    case 'touch': {
      let e = null, bd = 1.35; for (const q of foes) { const d = hyp3(q.x - m.x, q.y - m.y, q.z - m.z); if (d < bd) { bd = d; e = q; } }
      if (e) { hurt(W, e, s.dmg * P, m, s.n, 'elec'); eff(W, e, { stun: s.stun, kind: 'elec' }, g); hit(m, s); }
      if (W.rec) W.fx.push(['z', m.x, m.y, e ? e.x : tx, e ? e.y : ty]); break;
    }
    case 'cone': m.chan = { s, t: s.dur, pow: P, L: s.L * rs, hitAny: false }; break;
    case 'zone': {
      const R0 = Math.min(d0, rangeOf(m, s) || 4), x = m.x + ux * R0, y = m.y + uy * R0;
      if (s.z.k === 'rain') {
        const rr = s.z.r * rs;
        for (const z of W.zones) if (hyp(z.x - x, z.y - y) < rr + (z.r || 2) && z.k !== 'mist' && z.k !== 'absorb') z.t = 0;
        for (const p of W.proj) if (p.src.side !== m.side && (p.home || p.s.n === '불덩이' || p.s.n === '소이 캡슐') && hyp(p.x - x, p.y - y) < rr) p.dead = true;
        const hr2 = W.H.rain; for (const q of W.ms) if (hyp(q.x - x, q.y - y) < rr) { q.st.wet = 15; q.st.burn = 0; for (let i = 0; i < hr2.length; i++) hr2[i](W, q); }   // 비가 눈을 씻는다 (rules/control)
      } else {
        const z = Object.assign({}, s.z, { n: s.n, r: s.z.r ? s.z.r * rs : undefined, len: s.z.len ? s.z.len * rs : undefined });
        if (s.z.needWet) { const e = c.tgt || foes[0]; if (!(e && e.st.wet > 0)) z.k = 'chill'; }
        addZone(W, m, z, x, y, atan2(uy, ux) + Math.PI / 2, g);
      }
      break;
    }
    case 'wall': {
      const n = s.n === '얼음 담' ? 3 : 1, a = atan2(uy, ux), px = -sin(a), py = cos(a), hpS = 1 + (m.C - 1) * 0.5;
      const grp = W._grp++, mat = s.el === '얼음' ? 'ice' : 'lime';
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 1.1; addWall(W, { x: m.x + ux * s.at + px * off, y: m.y + uy * s.at + py * off, r: s.r, hp: s.hp * hpS, t: s.dur, by: m, own: m.side, mat, thick: s.r * 2, grp, mk: m.id }); }
      break;
    }
    case 'buff': {
      for (const [k, v] of Object.entries(s.b)) if (k !== 'd') { m.buf[k] = { v: ['speed', 'elecRes', 'bluntRes', 'toxRes'].includes(k) ? v : 1, t: s.b.d }; if (!BUFK.has(k) && !m._bufx.includes(k)) m._bufx.push(k); }
      if (s.b.smoke) addZone(W, m, { k: 'smoke', shape: 'circle', r: 2, d: 3, n: s.n }, m.x, m.y, 0, 1);
      break;
    }
    case 'move': {
      const dist = s.dist;
      if (s.mv === 'dash') { m.vx = ux * dist / 0.35; m.vy = uy * dist / 0.35; m.roll = 0.35; if (s.self) hurt(W, m, s.self, null, s.n, 'fire'); }
      if (s.mv === 'vault') { m.vx = ux * dist / 0.35; m.vy = uy * dist / 0.35; m.roll = 0.35; m.vault = 0.35; }
      if (s.mv === 'glide') { m.vx = ux * dist / 0.5; m.vy = uy * dist / 0.5; m.roll = 0.5; }
      break;
    }
    case 'trap': {
      const R0 = Math.min(d0, 6 * Math.sqrt(m.C)), mine = W.traps.filter(t => t.src === m);
      if (mine.length >= trapCap(W, m)) W.traps.splice(W.traps.indexOf(mine[0]), 1);   // 한도(보통 셋, 진지는 서클만큼, rules/fort)를 넘으면 가장 오래된 것을 거둔다
      W.traps.push({ x: m.x + ux * R0, y: m.y + uy * R0, s, src: m, arm: 0.8, seen: new Set(s.vis ? W.ms.map(q => q.id) : [m.id]), pow: P, r: s.tr.r * Math.min(rs, 2), chain: 0 });
      break;
    }
    case 'ring': {
      const rr = s.r * rs;
      for (const p of W.proj) if (p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      for (const z of W.zones) if (['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + 1) z.t = 0;
      const hg = W.H.ring; for (let i = 0; i < hg.length; i++) hg[i](W, m);   // 제 몸의 균사를 태운다 (rules/control)
      let h = false; for (const q of foes) if (hyp3(q.x - m.x, q.y - m.y, q.z - m.z) < rr) { hurt(W, q, s.dmg * P, m, s.n, 'fire'); eff(W, q, { burn: 1 }); h = true; }
      if (h) hit(m, s); break;
    }
    case 'shoot': {
      let n = 0; for (const p of W.proj) if (p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r * rs) { p.dead = true; n++; if (W.rec) W.fx.push(['z', m.x, m.y, p.x, p.y]); }
      if (n) { hit(m, s); m.log.defHit++; } break;
    }
    case 'smother': {
      const rr = s.r * rs;
      for (const z of W.zones) if (['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + (z.r || 2)) z.t = 0;
      m.st.burn = 0; const hs = W.H.smother; for (let i = 0; i < hs.length; i++) hs[i](W, m); for (const p of W.proj) if (p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      break;
    }
    default: { const f = TFX[s.t]; if (f) { TA.aim = atan2(uy, ux); TA.foes = foes; TA.g = g; f(W, m, c, TA); } }   // 규칙 모듈의 틀 (가두는 기둥·도발)
  }
}

function projHit(W, p, e) {
  const s = p.s, h = s.hit || {};
  let dmg = h.flat ? h.flat : 0.55 * pow(0.5 * s.m * s.v * s.v, 0.75);
  if (h.cap) dmg = Math.min(dmg, h.cap); if (h.dmg) dmg = h.dmg;
  hurt(W, e, dmg * p.pow, p.src, s.n, h.kind || 'blunt'); eff(W, e, Object.assign({}, h, { kind: h.kind }));
  if (h.zone) addZone(W, p.src, Object.assign({}, h.zone, { n: s.n }), p.x, p.y, 0, 1);
  hit(p.src, s);
}
function burst(W, p) {
  const b = p.s.burst; if (!b) return;
  if (b.zone) { addZone(W, p.src, Object.assign({}, b.zone, { n: p.s.n }), p.x, p.y, 0, 1); return; }
  const r = b.r * sizeOf(p.src, p.s);
  for (const q of W.ms) if (q.hp > 0 && hyp3(q.x - p.x, q.y - p.y, q.z - p.z) < r && (W.rules.friendlyFire || q.side !== p.src.side || q === p.src)) {
    hurt(W, q, b.dmg * p.pow * (1 - hyp3(q.x - p.x, q.y - p.y, q.z - p.z) / r * 0.5), q === p.src ? null : p.src, p.s.n, b.kind); eff(W, q, b); if (q !== p.src) hit(p.src, p.s);
  }
  if (W.rec) W.fx.push(['b', p.x, p.y, r]); if (b.kind === 'fire') ignite(W, p.x, p.y, r, p.src);
}

/* ---------------- 한 걸음 ---------------- */
// 배열을 제자리에서 거른다(순서 그대로, 항목마다 한 번씩 부른다). 걸음마다 새 배열을 만들지 않는다 (속도, 1.11.1)
function keepIf(a, f) { let j = 0; for (let i = 0; i < a.length; i++) { const x = a[i]; if (f(x)) a[j++] = x; } if (j !== a.length) a.length = j; }   // length에 넣는 건 느린 길이라 줄었을 때만
const projLive = p => !p.dead, timeLeft = x => x.t > 0, trapLive = t => !t.done, wallLive = w => (w.t -= DT) > 0 && w.hp > 0;
// 편마다 적 목록을 걸음마다 다시 쓴다: 배열은 그대로 두고 앞에서부터 덮어쓴 뒤 남는 꼬리만 자른다 (속도, 1.11.1)
function refreshSides(W) {
  const F = W.foes, nF = W._nF || (W._nF = []); for (let s = 0; s < F.length; s++) nF[s] = 0;
  let cloak = false;
  for (const m of W.ms) {
    if (m.hp <= 0) continue;
    if (m.gear.cloak) cloak = true;
    const x = ceff(W, m); if (x !== m._sigX) { m._sigX = x; m._sigN = true; }   // 신호 세기는 걸음 첫 선명도로. pow는 누가 읽을 때 한 번 (sigOf, 속도)
    m._act = !!(m.cast || m.castB || m.chan);
    for (let s = 0; s < W.sides; s++) if (s !== m.side) F[s][nF[s]++] = m;
  }
  for (let s = 0; s < F.length; s++) if (F[s].length !== nF[s]) F[s].length = nF[s];
  W._cloak = cloak;
}
function stepMage(W, m) {
  const st = m.st;   // 상태는 이 열한 가지뿐이다(addMage). 이름으로 줄이면 빠르다 (속도, 1.11.1)
  if (st.stun > 0) st.stun -= DT; if (st.root > 0) st.root -= DT; if (st.wet > 0) st.wet -= DT; if (st.burn > 0) st.burn -= DT; if (st.chill > 0) st.chill -= DT; if (st.blind > 0) st.blind -= DT;
  if (st.cough > 0) st.cough -= DT; if (st.mycel > 0) st.mycel -= DT; if (st.cramp > 0) st.cramp -= DT; if (st.lime > 0) st.lime -= DT; if (st.fetter > 0) st.fetter -= DT;
  // 끝난 몸 효과는 지우지 않고 null로 둔다: delete는 객체를 느린 사전 모양으로 바꾼다 (속도, 1.11.1). 읽는 쪽은 없음과 같게 본다
  const bf = m.buf; let b;
  if ((b = bf.speed) && (b.t -= DT) <= 0) bf.speed = null; if ((b = bf.elecRes) && (b.t -= DT) <= 0) bf.elecRes = null; if ((b = bf.bluntRes) && (b.t -= DT) <= 0) bf.bluntRes = null;
  if ((b = bf.toxRes) && (b.t -= DT) <= 0) bf.toxRes = null; if ((b = bf.front) && (b.t -= DT) <= 0) bf.front = null; if ((b = bf.block) && (b.t -= DT) <= 0) bf.block = null; if ((b = bf.smoke) && (b.t -= DT) <= 0) bf.smoke = null;
  for (let i = 0; i < m._bufx.length; i++) { const k = m._bufx[i]; if ((b = bf[k]) && (b.t -= DT) <= 0) bf[k] = null; }   // 등록한 마법의 다른 몸 효과
  // 간격은 0 아래로 더 줄이지 않는다: 읽는 곳은 모두 (cd || 0)을 0 이상 문턱과 견주거나 0 이상과 min·max하므로 0 아래는 얼마든 같다 (속도, 1.11.1)
  const cd = m.cd; for (const n in cd) { const v = cd[n]; if (v > 0) cd[n] = v - DT; }
  m.rollCd -= DT; m.autoCd -= DT; if (m.vault > 0) m.vault -= DT;
  m.glu = Math.min(m.gluMax, m.glu + BODY.gluRegen * DT); if (m.stam < BODY.stam) m.stam += BODY.stamRegen * DT;
  const H = W.H;
  if (m.fat > 0) { let k = 4; const hf = H.fatRecover; for (let i = 0; i < hf.length; i++) k = hf[i](W, m, k); m.fat = Math.max(0, m.fat - k * DT); }   // 머리 회복 (메타 × 1.05, rules/wave)
  const hs = H.mageStep; for (let i = 0; i < hs.length; i++) hs[i](W, m);   // 소금 선 밖 (rules/saltRing), 파도가 몸을 태움·꺼짐 (rules/wave)
  if (m.st.burn > 0) hurt(W, m, 3 * DT, null, '옷에 붙은 불', 'fire');
  const hz = H.mageZones; for (let i = 0; i < hz.length; i++) hz[i](W, m);   // 선 지대 (rules/terrain)
  if (m.hp <= 0) return;
  m.thinkT -= DT; if (m.thinkT <= 0) { m.thinkT = m.dec; const B = m.brain || W.brain; if (B) B.think(W, m); }
  if (m.hp <= 0) return;
  const sT = m.log.stanceT, sk = m.stance;   // 이름으로 더한다 (속도). 처음 더할 때 칸이 생기는 차례는 그대로
  if (sk === 'normal') sT.normal = (sT.normal || 0) + DT; else if (sk === 'kite') sT.kite = (sT.kite || 0) + DT; else if (sk === 'hold') sT.hold = (sT.hold || 0) + DT; else if (sk === 'breakout') sT.breakout = (sT.breakout || 0) + DT; else sT[sk] = (sT[sk] || 0) + DT;
  // 첫 칸, 두 번째 칸 차례로 (걸음마다 배열을 만들지 않게 풀어 썼다, 속도 1.11.1)
  let c = m.cast; if (c) { c.t += DT; if (m.st.stun > 0) m.cast = null; else if (c.t >= c.T) { m.cast = null; release(W, m, c); } }
  c = m.castB; if (c) { c.t += DT; if (m.st.stun > 0) m.castB = null; else if (c.t >= c.T) { m.castB = null; release(W, m, c); } }
  if (m.chan) {
    const ch = m.chan, s = ch.s; ch.t -= DT;
    for (const e of W.foes[m.side]) {
      const d = hyp3(e.x - m.x, e.y - m.y, e.z - m.z), ang = Math.abs(((atan2(e.y - m.y, e.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < ch.L && ang < 0.45) {
        hurt(W, e, s.dps * ch.pow * DT, m, s.n, s.kind);
        if (s.burn) e.st.burn = Math.max(e.st.burn || 0, s.burn); if (s.wet) e.st.wet = 20; if (s.blind) e.st.blind = Math.max(e.st.blind || 0, s.blind);
        if (s.push) { e.vx += cos(m.aim) * s.push * DT * 4; e.vy += sin(m.aim) * s.push * DT * 4; }
        ch.hitAny = true;
      }
    }
    const hc = H.chan; for (let i = 0; i < hc.length; i++) hc[i](W, m, ch);   // 앞의 화약통 (rules/barrels)
    if (ch.t <= 0) { if (ch.hitAny) hit(m, s); m.chan = null; }
  }
  // 움직임. 규칙이 맡으면(나는 사람, rules/flight) 땅의 걸음은 건너뛴다
  let mv = false; const hm = H.move; for (let i = 0; i < hm.length; i++) if (hm[i](W, m)) { mv = true; break; }
  if (mv) {} else if (m.roll > 0) m.roll -= DT;
  else {
    let sp = BODY.speed; const hv = H.speed; for (let i = 0; i < hv.length; i++) sp = hv[i](W, m, sp);   // 파도·꺼짐 (rules/wave), 빈손 (rules/risk)
    if (m.buf.speed) sp *= 1 + m.buf.speed.v; if (m.st.chill > 0) sp *= 0.7;
    const hl = H.speedLate; for (let i = 0; i < hl.length; i++) sp = hl[i](W, m, sp);   // 경직·균사 (rules/control)
    if (m.cast || m.chan) sp *= (m.cast && m.cast.s.lock) ? 0 : m.tac.castMove; if (m.st.stun > 0 || m.st.root > 0) sp = 0;
    let acc = 9; const ha = H.accel; for (let i = 0; i < ha.length; i++) acc = ha[i](W, m, acc);   // 빙판 (rules/terrain)
    const l = hyp(m.mv.x, m.mv.y), tx = l ? m.mv.x / l * sp : 0, ty = l ? m.mv.y / l * sp : 0, k = Math.min(1, DT * acc);
    m.vx += (tx - m.vx) * k; m.vy += (ty - m.vy) * k;
  }
  m.x = clamp(m.x + m.vx * DT, 0.4, W.width - 0.4); m.y = clamp(m.y + m.vy * DT, 0.4, W.height - 0.4);
  if (!(m.vault > 0) && !(m.z > 2)) {   // 2 m 넘게 뜨면 바위·벽을 넘는다 (v2.0)
    for (const o of W.obs) { const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
    const ws = W.walls, few = ws.length <= WMIN, q = few ? null : wallsIn(W, m.x - WRMAX - m.r, m.y - WRMAX - m.r, m.x + WRMAX + m.r, m.y + WRMAX + m.r), nq = few ? ws.length : q.length;
    for (let i = 0; i < nq; i++) { const o = few ? ws[i] : ws[q[i]]; const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
  }
}
// 구르기 (SPEC 3장): 두뇌·대응이 모두 이것으로 구른다. 속도 v와 간격 cd는 규칙이 고친다(회피, rules/evade)
const RO = { v: 0, cd: 0, skip: false };
function roll(W, m, dx, dy, v, cd) {
  RO.v = v; RO.cd = cd; RO.skip = false; const h = W.H.roll; for (let i = 0; i < h.length; i++) h[i](W, m, RO);
  if (RO.skip) return;   // 나는 사람은 구르지 않는다 (rules/flight가 옆으로 꺾는다)
  const l = hyp(dx, dy) || 1; m.vx = dx / l * RO.v; m.vy = dy / l * RO.v; m.roll = 0.25; m.rollCd = RO.cd; m.stam -= 1.5;
}
// 안 보이는 함정을 알아챌 걸음당 확률 (이단의 함정은 어렵다, rules/wave)
function notice(W, t) { let k = DT * 0.25; const h = W.H.notice; for (let i = 0; i < h.length; i++) k = h[i](W, t, k); return k; }
function stepWorld(W) {
  W.t += DT; W.step++;
  refreshSides(W);
  const H = W.H, hw = H.world; for (let i = 0; i < hw.length; i++) hw[i](W);   // 등록한 규칙의 걸음마다 할 일
  for (const m of W.ms) if (m.hp > 0) stepMage(W, m);
  // 투사체: 속도에 맞춰 잘게 나눠 움직인다 (빠른 탄이 사람을 뚫고 지나가지 않게)
  for (const p of W.proj) {
    if (p.dead) continue; p.life -= DT;
    if (p.home) {
      let e = null, bd = 1e9; for (const q of W.foes[p.src.side]) { const d = hyp(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; e = q; } }
      if (e) { const sp = hyp(p.vx, p.vy), want = atan2(e.y - p.y, e.x - p.x), cur = atan2(p.vy, p.vx); const df = ((want - cur + Math.PI * 3) % (Math.PI * 2)) - Math.PI, na = cur + clamp(df, -2 * DT, 2 * DT); p.vx = cos(na) * sp; p.vy = sin(na) * sp; if (e.z !== p.z) p.vz = clamp((e.z - p.z) * 2, -sp, sp); }
      for (const z of W.zones) if (z.k === 'fire' && inZone(z, p.x, p.y)) p.dead = true;
    }
    const nS = Math.max(3, Math.ceil(hyp(p.vx, p.vy) * DT / 0.25));
    for (let k = 0; k < nS && !p.dead; k++) {
      p.x += p.vx * DT / nS; p.y += p.vy * DT / nS; if (p.vz) { p.z += p.vz * DT / nS; if (p.z < 0) { p.dead = true; burst(W, p); break; } }   // 땅에 박힌다
      const low = !(p.z >= 2);   // 2 m 넘게 뜬 투사체는 바위·벽을 넘는다 (v2.0)
      if (low) for (const o of W.obs) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; burst(W, p); break; }
      if (p.dead) break;
      if (low) { const ws = W.walls, few = ws.length <= WMIN, q = few ? null : wallsIn(W, p.x - WRMAX - p.rad, p.y - WRMAX - p.rad, p.x + WRMAX + p.rad, p.y + WRMAX + p.rad), nq = few ? ws.length : q.length;
      for (let i = 0; i < nq; i++) { const o = few ? ws[i] : ws[q[i]]; if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; if (o.by && !o.used && o.by !== p.src) { o.used = 1; o.by.log.defHit++; } let wd = (p.s.hit && p.s.hit.flat > 50) ? 80 : 5 * Math.min(p.pow, 20); const hw = H.wallHit; for (let i = 0; i < hw.length; i++) wd = hw[i](W, p, o, wd); o.hp -= wd; burst(W, p); break; } } }   // 벽이 받는 것: 재료·두께 (rules/bulwark)
      if (p.dead) break;
      const hp = H.projSub; for (let i = 0; i < hp.length && !p.dead; i++) hp[i](W, p);   // 화약통 (rules/barrels)
      if (p.dead) break;
      for (const q of W.ms) {
        if (!canHit(W, p, q) || (p.home && q.side === p.src.side)) continue;
        const lim = q.r + p.rad + (p.home ? 0.2 : 0), dx = q.x - p.x, dy = q.y - p.y;
        if (dx > lim + 1e-9 || dx < -lim - 1e-9 || dy > lim + 1e-9 || dy < -lim - 1e-9) continue;   // 멀면 거리를 재지 않는다 (hyp ≥ |dx|라 결과는 같다)
        if (hyp(dx, dy) < lim && !(q.z - p.z > 1.2 || p.z - q.z > 1.2) && !(q.roll > 0 && !p.home)) {   // 높이 차 1.2 m 안 (v2.0)
          p.dead = true; if (!frontBlock(q, p.x - p.vx, p.y - p.vy)) { if (p.s.burst) burst(W, p); else projHit(W, p, q); } break;
        }
      }
    }
    if (!p.dead && p.life <= 0) { p.dead = true; burst(W, p); }
  }
  keepIf(W.proj, projLive);
  for (const l of W.lobs) { l.t -= DT; if (l.t <= 0) { const hl = H.lobLand; for (let i = 0; i < hl.length; i++) hl[i](W, l);   // 떨어진 돌이 벽을 부순다 (rules/bulwark)
    for (const q of W.ms) if (q.hp > 0 && q !== l.src && hyp(q.x - l.x, q.y - l.y) < l.r + 0.3 && !(q.z >= 2) && (W.rules.friendlyFire || q.side !== l.src.side)) { hurt(W, q, l.s.dmg * l.pow, l.src, l.s.n, l.s.kind); hit(l.src, l.s); } if (W.rec) W.fx.push(['a', l.x, l.y, l.r]); } }
  keepIf(W.lobs, timeLeft);
  for (const a of W.areas) {
    a.t -= DT; if (a.t > 0) continue;
    let h = false;
    for (const q of W.ms) {
      if (q.hp <= 0 || hyp(q.x - a.x, q.y - a.y) >= a.r + 0.3) continue;
      if (!W.rules.friendlyFire && q.side === a.src.side && q !== a.src) continue;
      let sole = 1; const hh = H.areaHit; for (let i = 0; i < hh.length; i++) sole = hh[i](W, q, a, sole);   // 소금 밑창 (rules/gear), 높이 (rules/flight)
      if (sole === 0) continue;   // 닿지 않았다 (날고 있다)
      hurt(W, q, a.s.dmg * a.pow * sole, q === a.src ? null : a.src, a.s.n, a.s.kind);
      const as = a.s; eff(W, q, { burn: as.burn, wet: as.wet, chill: as.chill, stun: (as.stun || 0) * sole * a.g, kind: as.kind, root: (as.root || 0) * sole * a.g, blind: as.blind, cough: as.cough, mycel: as.mycel, cramp: as.cramp, lime: as.lime, fetter: as.fetter });   // eff가 읽는 칸만 (마법 전체를 베끼지 않는다, 속도)
      if (q !== a.src) h = true;
    }
    if (h) hit(a.src, a.s); if (W.rec) W.fx.push(['a', a.x, a.y, a.r]);
    if (a.s.kind === 'fire' || a.s.kind === 'elec') ignite(W, a.x, a.y, a.r, a.src);
  }
  keepIf(W.areas, timeLeft);
  const hz = H.zoneTick; for (let i = 0; i < hz.length; i++) hz[i](W);   // 지대의 시간, 산이 벽을 녹인다 (rules/terrain)
  keepIf(W.zones, timeLeft);
  const nw = W.walls.length; keepIf(W.walls, wallLive); if (W.walls.length !== nw) W._wv++;
  for (const t of W.traps) {
    if (t.done) continue;   // 이 걸음에 이미 터졌다 (옆 함정 연쇄, rules/fort)
    t.arm -= DT; if (t.arm > 0) continue;
    let e = null, bd = 1e9; for (const q of W.foes[t.src.side]) { const d = hyp(q.x - t.x, q.y - t.y); if (d < bd) { bd = d; e = q; } }
    if (!e) continue;
    if (!t.seen.has(e.id) && bd < 2.5 && W.rng() < notice(W, t)) t.seen.add(e.id);
    if (!(e.roll > 0) && !(e.z >= 1) && bd < t.r) {   // 떠 있으면 밟지 않는다 (v2.0)
      if (W.t - (t.src.lureT ?? -9) < 3) t.src.log.lure++;   // 유도·몰이 성공: 끌어들인 적이 내 함정을 밟았다
      const tr = t.s.tr; if (tr.dmg) hurt(W, e, tr.dmg * t.pow, t.src, t.s.n, tr.kind || 'blunt'); eff(W, e, tr);
      if (tr.zone) addZone(W, t.src, Object.assign({}, tr.zone, { n: t.s.n }), t.x, t.y, 0, 1);
      hit(t.src, t.s); t.done = true;
      const hf = H.trapFire; for (let i = 0; i < hf.length; i++) hf[i](W, t, e);   // 옆 함정 연쇄 (rules/fort)
    }
  }
  keepIf(W.traps, trapLive);
  if (W.rec && W.step % 2 === 0) W.rec.push(snapshot(W)); else W.fx.length = 0;
}

/* ---------------- 기록 ---------------- */
const r2 = v => Math.round(v * 100) / 100;
function snapshot(W) {
  return {
    t: r2(W.t),
    m: W.ms.map(m => [r2(m.x), r2(m.y), Math.round(m.hp), m.cast ? m.cast.s.n : (m.chan ? m.chan.s.n : ''), m.cast ? r2(m.cast.t / m.cast.T) : 0,
      (m.st.stun > 0 ? 1 : 0) | (m.st.root > 0 ? 2 : 0) | (m.st.wet > 0 ? 4 : 0) | (m.st.burn > 0 ? 8 : 0) | (m.buf.front ? 16 : 0) | (m.roll > 0 ? 32 : 0) | (m.castB ? 64 : 0),
      r2(m.aim), m.side, Math.round(m.fat), m.stance[0]].concat(W._fly ? [r2(m.z), Math.round(hyp(m.vx, m.vy))] : [])),   // 비행이 켜졌으면 높이·속도 (v2.0)
    p: W.proj.map(p => [r2(p.x), r2(p.y), p.s.el]), w: W.walls.map(w => [r2(w.x), r2(w.y), w.r]),
    z: W.zones.map(z => [z.k, r2(z.x), r2(z.y), r2(z.r || 0), r2(z.len || 0), r2(z.a || 0)]), a: W.areas.map(a => [r2(a.x), r2(a.y), r2(a.r), a.vis ? 1 : 0]),
    tr: W.traps.map(t => [r2(t.x), r2(t.y), t.s.el]), b: W.barrels.map(b => [r2(b.x), r2(b.y), b.ex ? 1 : 0]), fx: W.fx.splice(0),
  };
}

/* ---------------- 판 돌리기 ---------------- */
function aliveSide(W, s) { for (const m of W.ms) if (m.side === s && m.hp > 0) return true; return false; }
// 산 사람이 있는 편의 수: 한 번 훑어 센다 (속도, 1.11.1. 편마다 따로 훑던 것과 같다)
function aliveCount(W) { const seen = W._alive || (W._alive = []); for (let s = 0; s < W.sides; s++) seen[s] = false; let n = 0; for (const m of W.ms) if (m.hp > 0 && !seen[m.side]) { seen[m.side] = true; if (++n === W.sides) break; } return n; }
// 판이 끝났는가: 한 편만 남았거나 시간이 다 됐다. 걸음씩 돌리는 쪽(샌드박스)도 이것으로 멈춘다
function over(W) { return !(W.t < W.maxT) || (W.step > 0 && aliveCount(W) <= 1); }
function run(W) {
  while (W.t < W.maxT) {
    stepWorld(W);
    if (aliveCount(W) <= 1) break;
  }
  return result(W);
}
function result(W) {
  const alive = []; for (let s = 0; s < W.sides; s++) if (aliveSide(W, s)) alive.push(s);
  let winner = alive.length === 1 ? alive[0] : -1, byTime = false;
  if (alive.length > 1) {
    const avg = alive.map(s => { const g = W.ms.filter(m => m.side === s); return g.reduce((a, m) => a + Math.max(0, m.hp) / m.hpMax, 0) / g.length; });
    const best = Math.max(...avg), i = avg.indexOf(best), second = Math.max(...avg.filter((_, j) => j !== i));
    if (best - second > 0.04) { winner = alive[i]; byTime = true; }
  }
  return { v: VERSION, winner, byTime, t: r2(W.t), ms: W.ms, obs: W.obs, rec: W.rec };
}

// 규칙 모듈이 쓰는 엔진의 것 (X)
X = { DT, hyp, hyp3, clamp, addWall, trapCap, canHit, keepIf, onSalt, wallsIn, sin, cos, atan2, pow, log, hurt, hit, eff, burst, addZone, formPoint, inZone, blocked, share, gOf, power, sizeOf, rangeOf, roll };
formsOf();
const { SALT, saltR, outSalt } = require('./rules/saltRing').api;   // 예전 이름 그대로 (소금 원, rules/saltRing)
module.exports = { VERSION, DT, SPELLS, sigOf, TYPES, SALT, saltR, outSalt, sin, cos, atan2, pow, exp, log, DEFAULT_RULES, V1_RULES, RULES: R.RULES, BODY, FORM, THREAT, createWorld, addMage, addWall, trapCap, onSalt, wallsIn, stepWorld, run, over, result, snapshot, release, roll, share, gOf, gAt, power, rangeOf, sizeOf, blocked, inZone, hyp, hyp3, clamp };
