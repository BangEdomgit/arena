/* =========================================================================
 * 숨 결투장 — 엔진 핵심 v1.2.0
 * 단위: m, s, kg, J. 고정 시간 간격 DT = 1/30 s. 같은 씨앗이면 같은 결과.
 * 규칙의 근거와 수식은 SPEC.md 참고. 이 파일을 바꾸면 SPEC과 버전을 같이 올린다.
 * Node(require)와 브라우저(<script>, 전역 ArenaCore) 양쪽에서 돈다. 브라우저에선 ArenaData.spells를 먼저 읽어 둔다.
 * ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./spells.json'));
  else root.ArenaCore = factory(root.ArenaData.spells);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SPELLS) {
'use strict';
const VERSION = '1.2.0';
const DT = 1 / 30;

/* ---------------- 결정론 수학 ----------------
 * Math.pow·sin·cos·atan2·hypot은 JS 엔진마다(같은 V8이라도 판마다) 마지막 자리가 다르다. 그 차이가 수천 걸음 뒤 판을 가른다.
 * 그래서 IEEE 754가 결과를 하나로 정한 연산(사칙연산, sqrt, round)만으로 계산한다. 정밀도는 1e-15 안팎.
 * 엔진 안에서는 Math의 위 함수들을 쓰지 않는다 (시험이 본다). */
const PIO2 = 1.5707963267948966, PIO2_HI = 1.5707963267341256, PIO2_LO = 6.077100506506192e-11;
const LN2_HI = 6.93147180369123816490e-01, LN2_LO = 1.90821492927058770002e-10, SQRT2 = Math.sqrt(2);
const series = (n, f) => { const c = []; for (let k = 0; k < n; k++) c.push(f(k)); return c; };
const horner = (c, z) => { let v = c[c.length - 1]; for (let k = c.length - 2; k >= 0; k--) v = v * z + c[k]; return v; };
let fac = 1; const FACT = series(24, k => (fac = k ? fac * k : 1));
const SINC = series(9, k => (k % 2 ? 1 : -1) / FACT[2 * k + 3]), COSC = series(9, k => (k % 2 ? -1 : 1) / FACT[2 * k + 4]);   // r³부터, r⁴부터
const ATNC = series(13, k => (k % 2 ? 1 : -1) / (2 * k + 3)), EXPC = series(18, k => 1 / FACT[k + 2]), LOGC = series(11, k => 1 / (2 * k + 3));
const P2 = new Map(); for (let k = 0, v = 1, u = 1; k <= 1023; k++, v *= 2, u /= 2) { P2.set(k, v); P2.set(-k, u); }
function sincos(x, wantCos) {
  if (!isFinite(x)) return NaN;
  const k = Math.round(x / PIO2), r = (x - k * PIO2_HI) - k * PIO2_LO, z = r * r, q = ((k % 4) + 4) % 4;
  const s = r + r * z * horner(SINC, z), c = 1 - z / 2 + z * z * horner(COSC, z), i = wantCos ? (q + 1) % 4 : q;
  return i === 0 ? s : i === 1 ? c : i === 2 ? -s : -c;
}
const sin = x => sincos(x, false), cos = x => sincos(x, true);
function atan(x) {
  if (x !== x) return NaN; if (x < 0) return -atan(-x); if (x > 1) return PIO2_HI - (atan(1 / x) - PIO2_LO);
  const t = x / (1 + Math.sqrt(1 + x * x)), u = t / (1 + Math.sqrt(1 + t * t)), z = u * u;   // atan x = 4 atan u, |u| ≤ tan(π/16)
  return 4 * (u + u * z * horner(ATNC, z));
}
function atan2(y, x) {
  if (x !== x || y !== y) return NaN;
  if (x > 0) return atan(y / x); if (x < 0) return y >= 0 ? atan(y / x) + Math.PI : atan(y / x) - Math.PI;
  return y > 0 ? PIO2 : y < 0 ? -PIO2 : 0;
}
function exp(x) {
  if (x !== x) return NaN; if (x > 709.78) return Infinity; if (x < -745.2) return 0;
  const k = Math.round(x / LN2_HI), r = (x - k * LN2_HI) - k * LN2_LO, v = 1 + r + r * r * horner(EXPC, r);
  return k > 1023 ? v * P2.get(1023) * P2.get(k - 1023) : k < -1022 ? v * P2.get(-1022) * P2.get(k + 1022) : v * P2.get(k);
}
function log(x) {
  if (x !== x || x < 0) return NaN; if (x === 0) return -Infinity; if (x === Infinity) return x;
  let e = 0, m = x; while (m >= 2 ** 64) { m /= 2 ** 64; e += 64; } while (m < 2 ** -64) { m *= 2 ** 64; e -= 64; }
  while (m >= SQRT2) { m /= 2; e++; } while (m < SQRT2 / 2) { m *= 2; e--; }
  const s = (m - 1) / (m + 1), z = s * s;
  return e * LN2_HI + (e * LN2_LO + 2 * (s + s * z * horner(LOGC, z)));
}
function pow(x, y) {
  if (y === 0) return 1; if (x === 1) return 1; if (x !== x || y !== y) return NaN;
  if (x === 0) return y > 0 ? 0 : Infinity;
  if (x < 0) { if (Math.round(y) !== y) return NaN; const v = exp(y * log(-x)); return Math.abs(y % 2) === 1 ? -v : v; }
  return exp(y * log(x));
}
const hyp = (x, y) => Math.sqrt(x * x + y * y);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

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
  full: 0.6,           // 장악 몫이 이보다 크면 온전한 힘
  wave: false,         // 파도: 머리가 넘치면 굳는 대신 파도를 탄다. 부류(type: 서퍼·메타·이단)마다 다르게 (SPEC 7장)
  hpScale: false,      // 켜면 체력도 선명도^K로 커져 등급과 상관없이 결투 속도가 비슷해진다 (게임 균형용)
};
// 파도의 부류 (WORLD 3-3). 사람 규격의 type. 파도가 꺼져 있으면 셋 다 같다
const TYPES = ['서퍼', '메타', '이단'];
// 등록한 규칙(registry.rule)의 걸음마다 할 일. 스위치가 꺼져 있으면 부르지 않는다
const RULE_HOOKS = [];
const BODY = { hp: 150, glu: 110, gluRegen: 1.2, stam: 6, stamRegen: 0.8, speed: 5, radius: 0.3 };
// 마법이 만들어지는 자리
const FORM = { proj: 'self', lob: 'self', wall: 'self', ring: 'self', shoot: 'self', smother: 'self', area: 'target', zone: 'target', trap: 'target', thread: 'target', cone: 'front', buff: 'body', move: 'body', touch: 'body' };
const THREAT = { thread: 1, area: 1, touch: 1, cone: 1, proj: 1 };

/* ---------------- 세계 ---------------- */
function createWorld(opt = {}) {
  const W = {
    v: VERSION, t: 0, step: 0, width: opt.width || 40, height: opt.height || 30,
    rng: mulberry32((opt.seed >>> 0) || 1), rules: Object.assign({}, DEFAULT_RULES, opt.rules),
    spells: opt.spells || SPELLS, brain: opt.brain || null,
    obs: [], walls: [], proj: [], lobs: [], areas: [], zones: [], traps: [], barrels: [], ms: [], fx: [],
    foes: [[], []], rec: opt.record ? [] : null, sides: 2, maxT: opt.maxT || 120,
  };
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
  if (Array.isArray(opt.barrels)) W.barrels = opt.barrels.map(b => ({ x: b.x, y: b.y, ex: false }));
  else if (W.rules.barrels) for (const [bx, by] of [[0.3, 0.27], [0.7, 0.73], [0.5, 0.5], [0.35, 0.8], [0.65, 0.23]])
    W.barrels.push({ x: bx * W.width + W.rnd(-2, 2), y: by * W.height + W.rnd(-2, 2), ex: false });
  if (Array.isArray(opt.walls)) for (const w of opt.walls) W.walls.push({ x: w.x, y: w.y, r: w.r || 0.6, hp: w.hp || 200, t: 1e9, own: -1 });
  for (const h of RULE_HOOKS) if (h.init && W.rules[h.name]) h.init(W);
  return W;
}

function addMage(W, spec, side, x, y) {
  const book = (spec.book || []).filter(n => W.spells[n] && (!W.spells[n].banned || spec.allowBanned));
  const m = {
    id: W.ms.length, name: spec.name || 'm' + W.ms.length, side, x, y, vx: 0, vy: 0, r: BODY.radius,
    hpMax: (spec.hp || BODY.hp) * (W.rules.hpScale ? pow(spec.C ?? 1, W.rules.powerK) : 1), hp: (spec.hp || BODY.hp) * (W.rules.hpScale ? pow(spec.C ?? 1, W.rules.powerK) : 1), glu: spec.glu || BODY.glu, gluMax: spec.glu || BODY.glu, stam: BODY.stam,
    C: spec.C ?? 1, circles: spec.circles ?? 1, noise: spec.noise ?? 0.05, react: spec.react ?? 0.2, dec: spec.dec ?? 0.15,
    brain: spec.brain || null, autoDodge: !!spec.autoDodge, type: spec.type || '메타', wave: 0, waveT: 0, crash: 0, gear: Object.assign({}, spec.gear), book, mast: spec.mast || {}, hitEst: Object.assign({}, spec.hitEst),
    tac: Object.assign({ prefR: 7, aggr: 1, trapBias: 0.1, zoneBias: 0.05, dodge: 0.6, focusLow: false, crowd: true, stance: true, rest: 75 }, spec.tac),
    st: {}, buf: {}, cd: {}, cast: null, castB: null, chan: null, roll: 0, rollCd: 0, autoCd: 0, fat: 0, aim: 0, thinkT: W.rng() * 0.1,
    mv: { x: 0, y: 0 }, last: null, lastT: -9, sf: 1, stance: 'normal', vault: 0, _sig: 1, _act: false, deathT: null,
    log: { dealt: {}, casts: {}, hits: {}, taken: {}, fizz: 0, over: 0, barrel: 0, stanceT: {}, waves: 0, lost: 0, waveDmg: 0, waveDeath: 0,
      dec: { n: 0, cat: {}, form: {}, react: 0, def: 0, combo: 0, atk: 0, trapPath: 0, trap: 0, barrel: 0, slotB: 0, auto: 0, rest: 0 } },
  };
  W.ms.push(m);
  if (side + 1 > W.sides) { W.sides = side + 1; while (W.foes.length < W.sides) W.foes.push([]); }
  return m;
}

/* ---------------- 신호: 선명도, 위력, 장악권 ---------------- */
// 파도를 타는 동안 피로는 100을 넘을 수 있지만, 선명도·위력·시전 시간은 100에서 더 나빠지지 않는다 (파도가 없으면 피로는 100을 넘지 않는다)
function ceff(W, m) { return m.C * (W.rules.fatigue ? Math.max(0.45, 1 - Math.min(m.fat, 100) / 150) : 1) * (m.wave ? 1.1 : 1); }
function power(W, m, s) {
  if (s.mundane) return 1;
  const wv = m.wave ? (m.type === '서퍼' ? 1.45 : 1.3) : (W.rules.wave && m.type === '이단' ? 0.8 : 1);
  return pow(m.C, W.rules.powerK) * (1 + 0.3 * (m.mast[s.n] || 0)) * (W.rules.fatigue ? Math.max(0.6, 1 - Math.min(m.fat, 100) / 200) : 1) * wv;
}
const rangeOf = (m, s) => (s.R || 0) * (s.mundane ? 1 : Math.sqrt(m.C));
const sizeOf = (m, s) => (s.mundane ? 1 : pow(m.C, 0.4));
// 장악 몫 f: (x,y)의 공기가 m의 신호를 따를 몫. 0~1
function share(W, m, x, y) {
  if (!W.rules.domain) return 1;
  const L = W.rules.domainL, foes = W.foes[m.side];
  const mine = m._sig / (1 + hyp(x - m.x, y - m.y) / L);
  let other = 0;
  for (let i = 0; i < foes.length; i++) { const q = foes[i]; other += q._sig * (q._act ? 1 : W.rules.passive) / (1 + hyp(x - q.x, y - q.y) / L); }
  let f = mine / (mine + other);
  for (let i = 0; i < foes.length; i++) { const q = foes[i]; if (q.gear.cloak && hyp(x - q.x, y - q.y) < 1.6) f *= 0.3; }
  return f;
}
const gOf = (W, f) => clamp((f - W.rules.fizzle) / (W.rules.full - W.rules.fizzle), 0, 1);
function formPoint(m, s, tx, ty) {
  const k = FORM[s.t];
  if (k === 'target') return [tx, ty];
  if (k === 'front') { const d = hyp(tx - m.x, ty - m.y) || 1, L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') { const d = hyp(tx - m.x, ty - m.y) || 1; return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5]; }
  return null;
}
function gAt(W, m, s, tx, ty) { if (s.mundane || !W.rules.domain) return 1; const p = formPoint(m, s, tx, ty); return p ? gOf(W, share(W, m, p[0], p[1])) : 1; }

/* ---------------- 공간 ---------------- */
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, t = clamp(((cx - x1) * dx + (cy - y1) * dy) / L2, 0, 1); return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
function blocked(W, x1, y1, x2, y2) {
  for (const o of W.obs) if (segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  for (const o of W.walls) if (segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  for (const z of W.zones) if (z.k === 'smoke' && z.shape === 'circle' && segCircle(x1, y1, x2, y2, z.x, z.y, z.r)) return true;
  return false;
}
function inZone(z, x, y) { if (z.shape === 'circle') return hyp(x - z.x, y - z.y) < z.r; const dx = cos(z.a), dy = sin(z.a), rx = x - z.x, ry = y - z.y; return Math.abs(rx * dx + ry * dy) < z.len / 2 && Math.abs(-rx * dy + ry * dx) < 0.6; }
function frontBlock(e, sx, sy) { if (!e.buf.front) return false; const a = atan2(sy - e.y, sx - e.x); return Math.abs(((a - e.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 1.1; }

/* ---------------- 피해와 상태 ---------------- */
function hurt(W, m, v, src, name, kind) {
  if (m.hp <= 0 || v <= 0) return;
  const b = m.buf;
  if (kind === 'elec' && b.elecRes) v *= b.elecRes.v;
  if (kind === 'blunt' && b.bluntRes) v *= b.bluntRes.v;
  if (kind === 'tox' && b.toxRes) v *= b.toxRes.v;
  for (const z of W.zones) { if (!inZone(z, m.x, m.y)) continue; if (z.k === 'absorb') { if (kind === 'elec') v *= 0.5; if (kind === 'fire') v *= 0.4; } if (z.k === 'mist' && kind === 'fire') v *= 0.5; }
  if (kind === 'elec' && m.st.wet > 0) v *= 1.5;
  if (kind === 'fire' && m.st.wet > 0) v *= 0.6;
  m.hp -= v; m.log.taken[kind] = (m.log.taken[kind] || 0) + v;
  if (src && src !== m) src.log.dealt[name] = (src.log.dealt[name] || 0) + v;
  if (m.hp <= 0 && m.deathT === null) m.deathT = W.t;
}
function eff(m, o, g = 1) {
  if (!o) return;
  if (o.burn) m.st.burn = Math.max(m.st.burn || 0, o.burn * g);
  if (o.wet) m.st.wet = 20;
  if (o.chill) m.st.chill = Math.max(m.st.chill || 0, o.chill * g);
  if (o.stun) m.st.stun = Math.max(m.st.stun || 0, o.stun * g * (m.buf.elecRes && o.kind === 'elec' ? 0.3 : 1));
  if (o.root) m.st.root = Math.max(m.st.root || 0, o.root * g);
  if (o.blind) m.st.blind = Math.max(m.st.blind || 0, o.blind * g);
  if (o.cough) m.st.cough = Math.max(m.st.cough || 0, o.cough * g);
  if (m.st.stun > 0) { m.cast = null; m.castB = null; m.chan = null; }
}
const hit = (m, s) => { m.log.hits[s.n] = (m.log.hits[s.n] || 0) + 1; };
function addZone(W, src, z, x, y, a, g) { const gz = g ?? 1; const zz = Object.assign({}, z, { x, y, a: a || 0, src, dps: (z.dps || 0) * gz, t: z.d * (gz < 1 ? Math.max(0.3, gz) : 1) }); W.zones.push(zz); if (zz.k === 'fire') ignite(W, x, y, zz.r || (zz.len || 2) / 2, src); }
function ignite(W, x, y, r, src) {
  if (!W.barrels.length) return;
  for (const b of W.barrels) {
    if (b.ex || hyp(b.x - x, b.y - y) > r + 0.6) continue;
    b.ex = true;
    for (const q of W.ms) { if (q.hp <= 0) continue; const d = hyp(q.x - b.x, q.y - b.y); if (d < 2.8) { hurt(W, q, 35 * (1 - d / 2.8 * 0.5), q === src ? null : src, '화약통', 'fire'); q.st.burn = Math.max(q.st.burn || 0, 2); } }
    W.fx.push(['b', b.x, b.y, 2.8]); if (src) src.log.barrel++;
  }
}
function canHit(W, p, q) { return q !== p.src && q.hp > 0 && (W.rules.friendlyFire || q.side !== p.src.side); }

/* ---------------- 마법 방출 ---------------- */
function release(W, m, c) {
  const s = c.s, tx = c.tx, ty = c.ty, dx0 = tx - m.x, dy0 = ty - m.y, d0 = hyp(dx0, dy0) || 1, ux = dx0 / d0, uy = dy0 / d0;
  m.aim = atan2(uy, ux);
  m.log.casts[s.n] = (m.log.casts[s.n] || 0) + 1;
  if (W.rules.fatigue && !s.mundane) {
    m.fat += s.cost * (c.B ? 1.3 : 1) * (c.auto ? 0.8 : 1) * 1.6;
    if (W.rules.wave && m.type !== '이단') {
      // 파도: 넘쳐도 굳지 않고 탄다. 너무 깊이(170) 가면 휩쓸린다
      const enter = m.type === '서퍼' ? 90 : 100;
      if (!m.wave && m.fat > enter) { m.wave = 1; m.log.waves++; }
      if (m.fat > 170) { m.log.over++; m.log.lost++; hurt(W, m, 30, null, '폭주', 'wave'); m.st.stun = Math.max(m.st.stun || 0, 2.5); m.fat = 60; m.wave = 0; m.crash = 3; m.cast = m.castB = m.chan = null; }
    } else if (m.fat > 100) {
      if (W.rules.wave) m.fat = 100;   // 이단: 파도를 못 느낀다. 폭주도 없고 머리는 100에서 멈춘다
      else { m.st.stun = Math.max(m.st.stun || 0, 1); m.fat = 55; m.log.over++; m.cast = m.castB = m.chan = null; }
    }
  }
  const g = gAt(W, m, s, tx, ty);
  if (g <= 0.02) { m.log.fizz++; return; }
  const P = power(W, m, s) * g, rs = sizeOf(m, s), foes = W.foes[m.side];
  switch (s.t) {
    case 'proj': {
      const n = s.multi || 1;
      for (let j = 0; j < n; j++) {
        const a = atan2(uy, ux) + (n > 1 ? (j / (n - 1) - 0.5) * 0.26 : 0) + (W.rng() - 0.5) * 2 * m.noise * (m.st.blind > 0 ? 3 : 1);
        W.proj.push({ x: m.x, y: m.y, vx: cos(a) * s.v, vy: sin(a) * s.v, life: s.home ? s.life : rangeOf(m, s) / s.v, s, src: m, pow: P / (n > 1 ? n * 0.55 : 1), rad: (s.rad || 0.1) * (s.mundane ? 1 : Math.min(rs, 3)) });
      }
      break;
    }
    case 'lob': W.lobs.push({ x: tx, y: ty, t: s.flight, s, src: m, pow: P, r: s.r * rs }); break;
    case 'thread': {
      const R = rangeOf(m, s), ex = d0 > R ? m.x + ux * R : tx, ey = d0 > R ? m.y + uy * R : ty;
      if (!blocked(W, m.x, m.y, ex, ey)) {
        let tgt = null; for (const q of foes) if (hyp(q.x - ex, q.y - ey) < 0.6 * Math.min(rs, 2) + 0.2) { tgt = q; break; }
        if (tgt && !frontBlock(tgt, m.x, m.y)) { hurt(W, tgt, 0.8 * pow(s.E, 0.55) * P, m, s.n, 'elec'); eff(tgt, { stun: Math.min(1.2, s.E / 800), kind: 'elec' }, g); hit(m, s); }
      }
      W.fx.push(['z', m.x, m.y, ex, ey]); ignite(W, ex, ey, 0.7, m); break;
    }
    case 'area': W.areas.push({ x: tx, y: ty, r: s.r * rs, t: s.delay, s, src: m, pow: P, vis: !!s.vis, g }); break;
    case 'touch': {
      let e = null, bd = 1.35; for (const q of foes) { const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } }
      if (e) { hurt(W, e, s.dmg * P, m, s.n, 'elec'); eff(e, { stun: s.stun, kind: 'elec' }, g); hit(m, s); }
      W.fx.push(['z', m.x, m.y, e ? e.x : tx, e ? e.y : ty]); break;
    }
    case 'cone': m.chan = { s, t: s.dur, pow: P, L: s.L * rs, hitAny: false }; break;
    case 'zone': {
      const R0 = Math.min(d0, rangeOf(m, s) || 4), x = m.x + ux * R0, y = m.y + uy * R0;
      if (s.z.k === 'rain') {
        const rr = s.z.r * rs;
        for (const z of W.zones) if (hyp(z.x - x, z.y - y) < rr + (z.r || 2) && z.k !== 'mist' && z.k !== 'absorb') z.t = 0;
        for (const p of W.proj) if (p.src.side !== m.side && (p.s.home || p.s.n === '불덩이' || p.s.n === '소이 캡슐') && hyp(p.x - x, p.y - y) < rr) p.dead = true;
        for (const q of W.ms) if (hyp(q.x - x, q.y - y) < rr) { q.st.wet = 15; q.st.burn = 0; }
      } else {
        const z = Object.assign({}, s.z, { n: s.n, r: s.z.r ? s.z.r * rs : undefined, len: s.z.len ? s.z.len * rs : undefined });
        if (s.z.needWet) { const e = c.tgt || foes[0]; if (!(e && e.st.wet > 0)) z.k = 'chill'; }
        addZone(W, m, z, x, y, atan2(uy, ux) + Math.PI / 2, g);
      }
      break;
    }
    case 'wall': {
      const n = s.n === '얼음 담' ? 3 : 1, a = atan2(uy, ux), px = -sin(a), py = cos(a), hpS = 1 + (m.C - 1) * 0.5;
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 1.1; W.walls.push({ x: m.x + ux * s.at + px * off, y: m.y + uy * s.at + py * off, r: s.r, hp: s.hp * hpS, t: s.dur, own: m.side }); }
      break;
    }
    case 'buff': {
      for (const [k, v] of Object.entries(s.b)) if (k !== 'd') m.buf[k] = { v: ['speed', 'elecRes', 'bluntRes', 'toxRes'].includes(k) ? v : 1, t: s.b.d };
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
      if (mine.length >= 3) W.traps.splice(W.traps.indexOf(mine[0]), 1);
      W.traps.push({ x: m.x + ux * R0, y: m.y + uy * R0, s, src: m, arm: 0.8, seen: new Set(s.vis ? W.ms.map(q => q.id) : [m.id]), pow: P, r: s.tr.r * Math.min(rs, 2) });
      break;
    }
    case 'ring': {
      const rr = s.r * rs;
      for (const p of W.proj) if (p.src.side !== m.side && p.s.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      for (const z of W.zones) if (['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + 1) z.t = 0;
      let h = false; for (const q of foes) if (hyp(q.x - m.x, q.y - m.y) < rr) { hurt(W, q, s.dmg * P, m, s.n, 'fire'); eff(q, { burn: 1 }); h = true; }
      if (h) hit(m, s); break;
    }
    case 'shoot': {
      let n = 0; for (const p of W.proj) if (p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r * rs) { p.dead = true; n++; W.fx.push(['z', m.x, m.y, p.x, p.y]); }
      if (n) hit(m, s); break;
    }
    case 'smother': {
      const rr = s.r * rs;
      for (const z of W.zones) if (['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + (z.r || 2)) z.t = 0;
      m.st.burn = 0; for (const p of W.proj) if (p.src.side !== m.side && p.s.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      break;
    }
  }
}

function projHit(W, p, e) {
  const s = p.s, h = s.hit || {};
  let dmg = h.flat ? h.flat : 0.55 * pow(0.5 * s.m * s.v * s.v, 0.75);
  if (h.cap) dmg = Math.min(dmg, h.cap); if (h.dmg) dmg = h.dmg;
  hurt(W, e, dmg * p.pow, p.src, s.n, h.kind || 'blunt'); eff(e, Object.assign({}, h, { kind: h.kind }));
  if (h.zone) addZone(W, p.src, Object.assign({}, h.zone, { n: s.n }), p.x, p.y, 0, 1);
  hit(p.src, s);
}
function burst(W, p) {
  const b = p.s.burst; if (!b) return;
  if (b.zone) { addZone(W, p.src, Object.assign({}, b.zone, { n: p.s.n }), p.x, p.y, 0, 1); return; }
  const r = b.r * sizeOf(p.src, p.s);
  for (const q of W.ms) if (q.hp > 0 && hyp(q.x - p.x, q.y - p.y) < r && (W.rules.friendlyFire || q.side !== p.src.side || q === p.src)) {
    hurt(W, q, b.dmg * p.pow * (1 - hyp(q.x - p.x, q.y - p.y) / r * 0.5), q === p.src ? null : p.src, p.s.n, b.kind); eff(q, b); if (q !== p.src) hit(p.src, p.s);
  }
  W.fx.push(['b', p.x, p.y, r]); if (b.kind === 'fire') ignite(W, p.x, p.y, r, p.src);
}

/* ---------------- 한 걸음 ---------------- */
function refreshSides(W) {
  for (const arr of W.foes) arr.length = 0;
  for (const m of W.ms) {
    if (m.hp <= 0) continue;
    m._sig = pow(ceff(W, m), W.rules.powerK); m._act = !!(m.cast || m.castB || m.chan);
    for (let s = 0; s < W.sides; s++) if (s !== m.side) W.foes[s].push(m);
  }
}
function stepMage(W, m) {
  for (const k in m.st) if (m.st[k] > 0) m.st[k] -= DT;
  for (const k in m.buf) { m.buf[k].t -= DT; if (m.buf[k].t <= 0) delete m.buf[k]; }
  for (const n in m.cd) m.cd[n] -= DT;
  m.rollCd -= DT; m.autoCd -= DT; if (m.vault > 0) m.vault -= DT;
  m.glu = Math.min(m.gluMax, m.glu + BODY.gluRegen * DT); if (m.stam < BODY.stam) m.stam += BODY.stamRegen * DT;
  if (m.fat > 0) m.fat = Math.max(0, m.fat - 4 * DT);
  if (m.crash > 0) m.crash -= DT;
  if (m.wave) {
    // 파도는 몸을 태운다. 깊을수록 세게. 서퍼는 익숙하고 메타는 조절한다. 피로가 75 아래로 내려오면 꺼짐(crash)
    m.waveT += DT; const wd = (1.5 + (m.fat - 90) * 0.06) * (m.type === '서퍼' ? 0.8 : 0.6) * DT;
    m.log.waveDmg += Math.max(0, wd); hurt(W, m, wd, null, '파도', 'wave'); if (m.hp <= 0) m.log.waveDeath = 1;
    if (m.fat < 75) { m.wave = 0; m.crash = 2; }
  }
  if (m.st.burn > 0) hurt(W, m, 3 * DT, null, '옷에 붙은 불', 'fire');
  for (const z of W.zones) {
    if (!inZone(z, m.x, m.y)) continue;
    if (z.dps && (z.src !== m || z.k === 'h2s')) hurt(W, m, z.dps * DT, z.src === m ? null : z.src, z.n, z.k === 'fire' ? 'fire' : 'tox');
    if (z.k === 'fire' && !(m.st.wet > 0)) m.st.burn = Math.max(m.st.burn || 0, 1);
    if (z.k === 'nh3') { m.st.blind = Math.max(m.st.blind || 0, 0.3); m.st.cough = Math.max(m.st.cough || 0, 0.5); }
    if (z.k === 'spore') m.st.cough = Math.max(m.st.cough || 0, 0.5);
    if (z.k === 'acid') m.st.blind = Math.max(m.st.blind || 0, 0.3);
    if ((z.k === 'ice' || z.k === 'chill') && z.src !== m) m.st.chill = Math.max(m.st.chill || 0, 0.4);
    if (z.k === 'h2s') { m.h2sT = (m.h2sT || 0) + DT; if (m.h2sT > 1.5) m.st.stun = Math.max(m.st.stun || 0, 0.5); }
  }
  if (m.hp <= 0) return;
  m.thinkT -= DT; if (m.thinkT <= 0) { m.thinkT = m.dec; const B = m.brain || W.brain; if (B) B.think(W, m); }
  if (m.hp <= 0) return;
  m.log.stanceT[m.stance] = (m.log.stanceT[m.stance] || 0) + DT;
  for (const slot of ['cast', 'castB']) {
    const c = m[slot]; if (!c) continue;
    c.t += DT; if (m.st.stun > 0) { m[slot] = null; continue; }
    if (c.t >= c.T) { m[slot] = null; release(W, m, c); }
  }
  if (m.chan) {
    const ch = m.chan, s = ch.s; ch.t -= DT;
    for (const e of W.foes[m.side]) {
      const d = hyp(e.x - m.x, e.y - m.y), ang = Math.abs(((atan2(e.y - m.y, e.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < ch.L && ang < 0.45) {
        hurt(W, e, s.dps * ch.pow * DT, m, s.n, s.kind);
        if (s.burn) e.st.burn = Math.max(e.st.burn || 0, s.burn); if (s.wet) e.st.wet = 20; if (s.blind) e.st.blind = Math.max(e.st.blind || 0, s.blind);
        if (s.push) { e.vx += cos(m.aim) * s.push * DT * 4; e.vy += sin(m.aim) * s.push * DT * 4; }
        ch.hitAny = true;
      }
    }
    if (s.kind === 'fire') for (const b of W.barrels) if (!b.ex) { const d = hyp(b.x - m.x, b.y - m.y), ang = Math.abs(((atan2(b.y - m.y, b.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < ch.L && ang < 0.45) ignite(W, b.x, b.y, 0.1, m); }
    if (ch.t <= 0) { if (ch.hitAny) hit(m, s); m.chan = null; }
  }
  // 움직임
  if (m.roll > 0) m.roll -= DT;
  else {
    let sp = BODY.speed * (m.wave ? 1.15 : 1) * (m.crash > 0 ? 0.85 : 1); if (m.buf.speed) sp *= 1 + m.buf.speed.v; if (m.st.chill > 0) sp *= 0.7;
    if (m.cast || m.chan) sp *= (m.cast && m.cast.s.lock) ? 0 : 0.5; if (m.st.stun > 0 || m.st.root > 0) sp = 0;
    let onIce = false; for (const z of W.zones) if (z.k === 'ice' && z.src !== m && inZone(z, m.x, m.y)) { onIce = true; break; }
    const acc = onIce ? 1.5 : 9, l = hyp(m.mv.x, m.mv.y), tx = l ? m.mv.x / l * sp : 0, ty = l ? m.mv.y / l * sp : 0, k = Math.min(1, DT * acc);
    m.vx += (tx - m.vx) * k; m.vy += (ty - m.vy) * k;
  }
  m.x = clamp(m.x + m.vx * DT, 0.4, W.width - 0.4); m.y = clamp(m.y + m.vy * DT, 0.4, W.height - 0.4);
  if (!(m.vault > 0)) {
    for (const o of W.obs) { const dx = m.x - o.x, dy = m.y - o.y, d = hyp(dx, dy), mn = o.r + m.r; if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
    for (const o of W.walls) { const dx = m.x - o.x, dy = m.y - o.y, d = hyp(dx, dy), mn = o.r + m.r; if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
  }
}
function stepWorld(W) {
  W.t += DT; W.step++;
  refreshSides(W);
  for (let i = 0; i < RULE_HOOKS.length; i++) if (W.rules[RULE_HOOKS[i].name]) RULE_HOOKS[i].apply(W);
  for (const m of W.ms) if (m.hp > 0) stepMage(W, m);
  // 투사체: 속도에 맞춰 잘게 나눠 움직인다 (빠른 탄이 사람을 뚫고 지나가지 않게)
  for (const p of W.proj) {
    if (p.dead) continue; p.life -= DT;
    if (p.s.home) {
      let e = null, bd = 1e9; for (const q of W.foes[p.src.side]) { const d = hyp(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; e = q; } }
      if (e) { const sp = hyp(p.vx, p.vy), want = atan2(e.y - p.y, e.x - p.x), cur = atan2(p.vy, p.vx); const df = ((want - cur + Math.PI * 3) % (Math.PI * 2)) - Math.PI, na = cur + clamp(df, -2 * DT, 2 * DT); p.vx = cos(na) * sp; p.vy = sin(na) * sp; }
      for (const z of W.zones) if (z.k === 'fire' && inZone(z, p.x, p.y)) p.dead = true;
    }
    const nS = Math.max(3, Math.ceil(hyp(p.vx, p.vy) * DT / 0.25));
    for (let k = 0; k < nS && !p.dead; k++) {
      p.x += p.vx * DT / nS; p.y += p.vy * DT / nS;
      for (const o of W.obs) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; burst(W, p); break; }
      if (p.dead) break;
      for (const o of W.walls) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; o.hp -= (p.s.hit && p.s.hit.flat > 50) ? 80 : 5 * Math.min(p.pow, 20); burst(W, p); break; }
      if (p.dead) break;
      if (p.s.burst && p.s.burst.kind === 'fire') for (const b of W.barrels) if (!b.ex && hyp(b.x - p.x, b.y - p.y) < 0.5) { p.dead = true; burst(W, p); break; }
      if (p.dead) break;
      for (const q of W.ms) {
        if (!canHit(W, p, q) || (p.s.home && q.side === p.src.side)) continue;
        if (hyp(q.x - p.x, q.y - p.y) < q.r + p.rad + (p.s.home ? 0.2 : 0) && !(q.roll > 0 && !p.s.home)) {
          p.dead = true; if (!frontBlock(q, p.x - p.vx, p.y - p.vy)) { if (p.s.burst) burst(W, p); else projHit(W, p, q); } break;
        }
      }
    }
    if (!p.dead && p.life <= 0) { p.dead = true; burst(W, p); }
  }
  W.proj = W.proj.filter(p => !p.dead);
  for (const l of W.lobs) { l.t -= DT; if (l.t <= 0) { for (const q of W.ms) if (q.hp > 0 && q !== l.src && hyp(q.x - l.x, q.y - l.y) < l.r + 0.3 && (W.rules.friendlyFire || q.side !== l.src.side)) { hurt(W, q, l.s.dmg * l.pow, l.src, l.s.n, l.s.kind); hit(l.src, l.s); } W.fx.push(['a', l.x, l.y, l.r]); } }
  W.lobs = W.lobs.filter(l => l.t > 0);
  for (const a of W.areas) {
    a.t -= DT; if (a.t > 0) continue;
    let h = false;
    for (const q of W.ms) {
      if (q.hp <= 0 || hyp(q.x - a.x, q.y - a.y) >= a.r + 0.3) continue;
      if (!W.rules.friendlyFire && q.side === a.src.side && q !== a.src) continue;
      const sole = !a.vis && q.gear.soles ? 0.3 : 1;
      hurt(W, q, a.s.dmg * a.pow * sole, q === a.src ? null : a.src, a.s.n, a.s.kind);
      eff(q, Object.assign({}, a.s, { root: (a.s.root || 0) * sole * a.g, stun: (a.s.stun || 0) * sole * a.g }));
      if (q !== a.src) h = true;
    }
    if (h) hit(a.src, a.s); W.fx.push(['a', a.x, a.y, a.r]);
    if (a.s.kind === 'fire' || a.s.kind === 'elec') ignite(W, a.x, a.y, a.r, a.src);
  }
  W.areas = W.areas.filter(a => a.t > 0);
  for (const z of W.zones) { z.t -= DT; if (z.k === 'acid') for (const w of W.walls) if (hyp(w.x - z.x, w.y - z.y) < (z.r || 2) + w.r) w.hp -= 25 * DT; }
  W.zones = W.zones.filter(z => z.t > 0);
  W.walls = W.walls.filter(w => (w.t -= DT) > 0 && w.hp > 0);
  for (const t of W.traps) {
    t.arm -= DT; if (t.arm > 0) continue;
    let e = null, bd = 1e9; for (const q of W.foes[t.src.side]) { const d = hyp(q.x - t.x, q.y - t.y); if (d < bd) { bd = d; e = q; } }
    if (!e) continue;
    if (!t.seen.has(e.id) && bd < 2.5 && W.rng() < DT * 0.25) t.seen.add(e.id);
    if (!(e.roll > 0) && bd < t.r) {
      const tr = t.s.tr; if (tr.dmg) hurt(W, e, tr.dmg * t.pow, t.src, t.s.n, tr.kind || 'blunt'); eff(e, tr);
      if (tr.zone) addZone(W, t.src, Object.assign({}, tr.zone, { n: t.s.n }), t.x, t.y, 0, 1);
      hit(t.src, t.s); t.done = true;
    }
  }
  W.traps = W.traps.filter(t => !t.done);
  if (W.rec && W.step % 2 === 0) W.rec.push(snapshot(W)); else W.fx.length = 0;
}

/* ---------------- 기록 ---------------- */
const r2 = v => Math.round(v * 100) / 100;
function snapshot(W) {
  return {
    t: r2(W.t),
    m: W.ms.map(m => [r2(m.x), r2(m.y), Math.round(m.hp), m.cast ? m.cast.s.n : (m.chan ? m.chan.s.n : ''), m.cast ? r2(m.cast.t / m.cast.T) : 0,
      (m.st.stun > 0 ? 1 : 0) | (m.st.root > 0 ? 2 : 0) | (m.st.wet > 0 ? 4 : 0) | (m.st.burn > 0 ? 8 : 0) | (m.buf.front ? 16 : 0) | (m.roll > 0 ? 32 : 0) | (m.castB ? 64 : 0),
      r2(m.aim), m.side, Math.round(m.fat), m.stance[0]]),
    p: W.proj.map(p => [r2(p.x), r2(p.y), p.s.el]), w: W.walls.map(w => [r2(w.x), r2(w.y), w.r]),
    z: W.zones.map(z => [z.k, r2(z.x), r2(z.y), r2(z.r || 0), r2(z.len || 0), r2(z.a || 0)]), a: W.areas.map(a => [r2(a.x), r2(a.y), r2(a.r), a.vis ? 1 : 0]),
    tr: W.traps.map(t => [r2(t.x), r2(t.y), t.s.el]), b: W.barrels.map(b => [r2(b.x), r2(b.y), b.ex ? 1 : 0]), fx: W.fx.splice(0),
  };
}

/* ---------------- 판 돌리기 ---------------- */
function aliveSide(W, s) { for (const m of W.ms) if (m.side === s && m.hp > 0) return true; return false; }
function aliveCount(W) { let n = 0; for (let s = 0; s < W.sides; s++) if (aliveSide(W, s)) n++; return n; }
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

return { VERSION, DT, SPELLS, TYPES, sin, cos, atan2, pow, exp, log, DEFAULT_RULES, RULE_HOOKS, BODY, FORM, THREAT, createWorld, addMage, stepWorld, run, over, result, snapshot, release, share, gOf, gAt, power, rangeOf, sizeOf, blocked, inZone, hyp, clamp };
});
