'use strict';
/* 숨 결투장 — 두뇌의 공용 도구 (brain/util)
 * 판단 조각(read·stance·move·choose)과 기술(techniques/), 규칙 모듈의 두뇌 훅이 함께 쓴다. 규칙 모듈의 brain(B)이 받는 B가 이것이다.
 * 한 판 안에서 바뀌지 않는 값(덱이 정하는 값, 추정 피해)은 한 번만 잰다 (속도, 1.11.1) */
const C = require('../core');
const { hyp } = C;

const NOKIND = {}, NONE = [];
// 돌파·자리 판단의 방향표: 늘 같은 각이라 한 번만 잰다 (같은 C.cos·C.sin이라 값도 같다, 속도 1.11.1)
const DIR16 = Array.from({ length: 16 }, (_, k) => { const a = k / 16 * 6.2832; return [C.cos(a), C.sin(a)]; });
const DIR8 = Array.from({ length: 8 }, (_, k) => { const a = k / 8 * 6.2832; return [C.cos(a), C.sin(a)]; });   // 비어 있는 것 (새로 만들지 않는다)
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const SELF_GAP = 1.5;   // 지연 폭발 반지름 밖으로 둘 여유 (m): 몸 0.3 + 겨냥 흔들림과 지연 동안의 걸음
function catOf(s) {
  if (s.t === 'trap' || s.role === '함정') return '함정';
  if (s.t === 'move' || (s.t === 'buff' && s.b.speed)) return '이동';
  if (s.role === '방어' || s.t === 'wall' || s.t === 'ring' || s.t === 'shoot' || s.t === 'smother' || s.t === 'buff') return '방어';
  return '공격';
}
const FORMNAME = { taunt: '상대 자리', proj: '던지기', lob: '던지기', touch: '몸', cone: '앞으로 뿜기', thread: '실', area: '상대 자리', zone: '자리 깔기', trap: '함정', wall: '내 앞 벽', buff: '몸', move: '이동', ring: '몸', shoot: '몸', smother: '몸' };
const isSetup = s => !!s && (s.t === 'trap' || s.t === 'zone' || (s.hit && (s.hit.wet || s.hit.root || s.hit.stun || s.hit.chill)) || (s.t === 'area' && (s.root || s.stun)) || (s.t === 'cone' && s.wet));
// 역할 (v2.2, 26장): 공격·방어·지형(벽·지대·함정·가두기·세우기·벽 밀기)·이동·강화(걸음 버프)
const TERRAIN = { wall: 1, build: 1, trap: 1, cage: 1, topple: 1, blueprint: 1 };
function roleOf(s) { if (TERRAIN[s.t] || (s.t === 'zone' && s.z && s.z.k !== 'rain' && s.z.k !== 'smoke' && s.z.k !== 'mist' && s.z.k !== 'absorb')) return '지형'; if (s.t === 'move') return '이동'; if (s.t === 'buff' && s.b && s.b.speed) return '강화'; if (s.role === '공격') return '공격'; return '방어'; }
function logDec(m, s, slot, ctx) {
  const L = m.log.dec; L.n++;
  const c = catOf(s); L.cat[c] = (L.cat[c] || 0) + 1; const f = FORMNAME[s.t]; L.form[f] = (L.form[f] || 0) + 1;
  if (c === '방어') { L.def++; if (ctx.aimed) L.react++; }
  if (c === '공격') { L.atk++; if (ctx.combo) L.combo++; }
  if (c === '함정') { L.trap++; if (ctx.path) L.trapPath++; }
  if (ctx.barrel) L.barrel++; if (slot === 'B') L.slotB++; if (slot === 'auto') L.auto++;
  const ro = roleOf(s), R = m.mlog.role[slot === 'B' ? 'B' : slot === 'auto' ? 'auto' : 'A']; R[ro] = (R[ro] || 0) + 1; if (ro === '지형') m.mlog.built++;   // 칸마다 역할 (v2.2 지표)
}
// 추정 피해는 마법마다 정해져 있다: 한 번 재고 기억한다 (결정론 pow가 비싸다, 속도 1.11.1)
const EST = new WeakMap();
function estDmg(s) { let v = EST.get(s); if (v === undefined) { v = estDmg0(s); EST.set(s, v); } return v; }
function estDmg0(s) {
  if (s.hit && s.hit.flat) return s.hit.flat; if (s.hit && s.hit.dmg) return s.hit.dmg;
  if (s.burst && s.burst.dmg) return s.burst.dmg; if (s.burst) return 14;
  if (s.t === 'proj') return Math.min((s.hit && s.hit.cap) || 99, 0.55 * C.pow(0.5 * s.m * s.v * s.v, 0.75)) * (s.multi ? s.multi * 0.5 : 1);
  if (s.t === 'thread') return 0.8 * C.pow(s.E, 0.55);
  if (s.t === 'cone') return s.dps * s.dur;
  return s.dmg || 0;
}

// 쓰는 서클 수: 서클 규칙(rules/multiSlot)이 꺼지면 누구나 1
function circOf(W, q) { let c = 1; const h = W._bh.circles; for (let i = 0; i < h.length; i++) c = h[i](W, q, c); return c; }
// 큰 수와 짝 (1.9.0): 짝 묶기를 쓰면 그 틈에 큰 수를 꽂는다. bind = 굳힘 시간 안에 닿게, wet = 젖은 동안, ice = 내 빙판 위에 있을 때, herd = 불벽으로 몬 쪽에
const PAIRS = { '번개 그물': { fin: '번개 창', kind: 'bind' }, '물 대포': { fin: '대낙뢰', kind: 'wet' }, '빙판': { fin: '대낙뢰', kind: 'ice' }, '불벽': { fin: '화산 기둥', kind: 'herd' } };
// 과녁이 구를 쪽 (내 쪽에서 본 왼쪽 +1, 오른쪽 −1): 한쪽이 바위·벽·가장자리로 막혔으면 다른 쪽, 아니면 본 버릇, 모르면 오른쪽(구르기 기본 방향: 날아오는 쪽의 반시계)
function rollSide(W, e, ux, uy, mem) {
  const blockedAt = (sx) => { const px = e.x - uy * sx * 2, py = e.y + ux * sx * 2; return px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1 || W.obs.some(o => hyp(o.x - px, o.y - py) < o.r + 0.4) || W.walls.some(o => hyp(o.x - px, o.y - py) < o.r + 0.4); };
  const bl = blockedAt(1), br = blockedAt(-1); if (bl && !br) return -1; if (br && !bl) return 1;
  if (mem && mem.L !== mem.R) return mem.L > mem.R ? 1 : -1; return -1;
}
// 붙잡는 마법인가: 굳히기·묶기, 또는 느리게 하기(냉기·빙판)
function holdsOf(s, e) { return OFF[s.t] || s.t === 'zone' ? (bindOf(s, e) > 0 || !!s.cramp || !!(s.hit && s.hit.mycel) || !!s.chill || !!(s.hit && s.hit.chill) || !!(s.z && (s.z.k === 'ice' || s.z.k === 'chill'))) : false; }
// 실제 시전 시간 (s): 숙련을 뺀 예비동작 × 기침·머리 피로 × 규칙의 것(파도·꺼짐, rules/wave)
function castTime(W, m, Tw) { let t = Tw * (m.st.cough > 0 ? 1.5 : 1) * (W.rules.fatigue ? 1 + Math.min(m.fat, 100) / 200 : 1); const h = W._bh.castTime; for (let i = 0; i < h.length; i++) t = h[i](W, m, t); return t; }
// 이 마법이 과녁을 묶거나 굳히는 시간 (s). 안 보이는 발밑 공격은 소금 밑창에 × 0.3, 실은 min(1.2, E/800)
function bindOf(s, e) {
  const b = s.t === 'thread' ? (s.cramp ? 0 : Math.min(1.2, s.E / 800)) : Math.max(s.root || 0, s.stun || 0, (s.hit && Math.max(s.hit.root || 0, s.hit.stun || 0, s.hit.fetter && e.st && e.st.wet > 0.8 ? s.hit.fetter : 0)) || 0);
  return b * (s.t === 'area' && !s.vis && e.gear && e.gear.soles ? 0.3 : 1);
}
// 몸 묶기 (bodyBind, 1.11.0): 과녁이 이 큰 수를 빠져나갈 수 없는가. 과녁은 예비동작의 마지막 0.5 s부터(눈멀었으면 눈이 뜨일 때부터, 못 읽는 사람은 보이는 구름부터)
// 닿을 때까지 걷고 구른다. 그 거리가 맞는 반지름에 못 미치면 붙잡혔다. 안 보이는 구름은 떨어지기 전까지만 본다. 가두는 기둥 안이면 거리 절반
function caged(W, q) { let n = 0; for (const w of W.walls) if (w.cage && w.own !== q.side && hyp(w.x - q.x, w.y - q.y) < 3.6) n++; return n >= 3; }
function pinned(W, m, s, e, ct, d, st0, cg) {
  const st = st0 || e.st, T = ct + landDelay(s, d); if (Math.max(st.stun || 0, st.root || 0) > T + 0.02) return true;
  const reads = e.tac && e.tac.readCast, blind = st.blind > 0 ? st.blind : 0;
  const see = s.t === 'area' ? (s.vis ? T : ct) : ct;   // 실은 시전 끝에 바로 닿는다
  const from = Math.max(blind, reads ? Math.max(0, ct - 0.5) : T);
  let tEsc = Math.max(0, see - from - Math.max(st.stun || 0, st.root || 0)); if (tEsc <= 0) return true;
  const noRoll = st.mycel > from || st.cramp > from || e.stam < 1.5 || e.rollCd > from + tEsc;
  const sp = 5 * (st.cramp > from ? 0.5 : st.mycel > from ? 0.6 : 1) * (st.chill > from ? 0.7 : 1);
  const esc = (sp * tEsc + (noRoll ? 0 : 2 * (st.lime > from ? 0.5 : 1))) * (cg || caged(W, e) ? 0.5 : 1);
  const need = s.t === 'area' ? s.r * C.sizeOf(m, s) + 0.3 : 0.8;
  return esc < need * 0.85;
}
// 과녁이 지금부터 나를 칠 수 있는 가장 이른 때 (s): 모으던 공격이 닿는 때, 또는 간격이 끝난 가장 빠른 공격을 지금 시작해 닿는 때. 굳음·빈손이면 그만큼 늦다
// 몸 묶기는 굳힘과 달리 시전을 막지 못한다: 붙잡아도 이보다 오래 모으면 역류한다
function hitBack(W, e, S, d) {
  let t = 1e9; const lock = Math.max(e.st.stun || 0, e.emptyT > W.t ? e.emptyT - W.t : 0);   // 빈손은 rules/risk가 켜졌을 때만 생긴다
  for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && OFF[c.s.t] && !c.s.big) t = Math.min(t, c.T - c.t + landDelay(c.s, d)); }
  for (const n of e.book) { const x = S[n]; if (!x || !OFF[x.t] || x.big || (x.t === 'touch' ? d > 1.3 : x.t === 'cone' ? d > x.L * C.sizeOf(e, x) : d > (x.home ? 12 : C.rangeOf(e, x)))) continue; t = Math.min(t, Math.max(lock, e.cd[n] || 0) + castTime(W, e, x.cast) + landDelay(x, d) + e.dec * 0.5); }
  return t;
}
// 붙잡는 마법 s가 걸린 직후 과녁의 상태 (가정). 기둥은 cg
function afterPin(s, e, st) {
  const h = s.hit || {}, o = Object.assign({}, st);
  if (h.mycel) o.mycel = h.mycel; if (h.lime) o.lime = h.lime; if (h.fetter) o.root = Math.max(o.root || 0, h.fetter); if (s.cramp) o.cramp = s.cramp;
  if (s.t === 'zone' && s.z.k === 'acid') o.blind = Math.max(o.blind || 0, 0.6); if (s.t === 'cone' && s.blind) o.blind = s.blind;   // 산 안개는 안에 있는 동안 0.3 s씩 이어진다
  return o;
}
// 과녁을 큰 수에 붙잡아 둘 수단인가 (몸 묶기·족쇄·기둥·눈멂)
function pinOf(s, e) {
  const h = s.hit || {};
  if (h.mycel) return !(e.st.mycel > 0.5); if (h.lime) return !(e.st.lime > 0.5); if (h.fetter) return e.st.wet > 0.8 && !(e.st.root > 0);
  if (s.cramp) return !e.buf.elecRes && !(e.st.cramp > 0.5); if (s.t === 'cage') return true;
  if ((s.t === 'zone' && s.z.k === 'acid') || (s.t === 'cone' && s.blind)) return !(e.st.blind > 0.3);
  return false;
}
// 덱이 정하는 값: 사람마다 한 번 만든다 (속도, 1.11.1). 책과 선명도는 판 중에 바뀌지 않는다
function deck(m, S) {
  const k = m._deck; if (k && k.S === S) return k;
  const D = { S, maxR: 0, offMax: 0, def: [], front: [], kinds: {}, mund: false, threadTouch: false, fireThread: false, bluntHit: false, bigs: [], nm: [], sp: [], mast: [], he: [], off: [], R: [] };
  for (const n of m.book) {
    const s = S[n]; if (!s) continue;
    D.nm.push(n); D.sp.push(s); D.mast.push(m.mast[n] || 0); D.he.push(m.hitEst[n] ?? 0.35); D.off.push(OFF[s.t]); D.R.push(C.rangeOf(m, s));   // 후보 고르기가 이름으로 찾지 않게
    if (OFF[s.t]) { D.maxR = Math.max(D.maxR, s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : C.rangeOf(m, s)); D.offMax = Math.max(D.offMax, estDmg(s)); }
    if ((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot') D.def.push(n);
    if (s.b && s.b.front) D.front.push(n);
    const kd = kindOf(s); if (kd) D.kinds[kd] = 1;
    if (s.mundane) D.mund = true; if (s.t === 'thread' || s.t === 'touch') D.threadTouch = true; if (s.kind === 'fire' || s.t === 'thread') D.fireThread = true;
    if (s.hit && s.hit.kind === 'blunt') D.bluntHit = true; if (s.big) D.bigs.push(s);
  }
  return (m._deck = D);
}
// (px, py)가 바위 반지름 + pad 안인가
function obsNear(W, px, py, pad) { const O = W.obs; for (let i = 0; i < O.length; i++) { const o = O[i]; if (hyp(o.x - px, o.y - py) < o.r + pad) return true; } return false; }
// m에서 r m 안에 있는 사람이 있는가
function anyNear(qs, m, r) { for (let i = 0; i < qs.length; i++) if (hyp(qs[i].x - m.x, qs[i].y - m.y) < r) return true; return false; }
// 큰 공격인가: 쏘는 사람의 공격 중 가장 센 것의 60% 이상
function bigAttack(c, S) { const q = c.by; if (!q) return true; return estDmg(c.s) >= 0.6 * deck(q, S).offMax; }
// 시전이 끝나고 과녁에 닿기까지 (s): 투사체는 날아가는 시간, 지연 폭발·곡사는 지연
function landDelay(s, d) { return s.t === 'proj' ? d / s.v : s.t === 'area' ? s.delay : s.t === 'lob' ? s.flight : s.t === 'thread' ? d / (32 * (s.fast || 1)) : 0; }
// 사람의 공격 마법 최대 사거리 (m)
const maxRange = (m, S) => deck(m, S).maxR;
// 내가 (x, y)에 섰을 때 제 손끝의 장악 몫: 적 신호가 옅은 땅일수록 크다 (SPEC 5장의 f, 내 몫은 거리 0)
function ownShare(W, m, foes, x, y) { const L = W.rules.domainL; let o = 0; for (const q of foes) o += C.sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + hyp(x - q.x, y - q.y) / L); const ms = C.sigOf(W, m); return ms / (ms + o); }
// 마법의 피해 종류 (덱 읽기)
function kindOf(s) { return s.kind || (s.hit && s.hit.kind) || (s.burst && s.burst.kind) || (s.tr && s.tr.kind) || (s.t === 'thread' ? 'elec' : s.z ? ({ fire: 'fire', nh3: 'tox', spore: 'tox', acid: 'tox', h2s: 'tox' })[s.z.k] : null) || null; }
// 덱 읽기 (전설): 이 마법이 상대 책의 피해 종류에 대한 천적이고, 아직 켜져 있지 않은가
function counters(s, ek, m, W) {
  if (ek.fire && s.t === 'zone' && ['rain', 'mist', 'absorb'].includes(s.z.k) && !(s.z.k === 'rain' && ek.elec)) return   // 비는 나를 적셔 전기에 약하게 한다 !W.zones.some(z => z.src === m && z.k === s.z.k && hyp(z.x - m.x, z.y - m.y) < 3);
  if (s.t !== 'buff') return false;
  if (ek.elec && s.b.elecRes && !s.react) return !m.buf.elecRes;
  if (ek.blunt && (s.b.bluntRes || s.b.block)) return !m.buf.bluntRes && !m.buf.front;
  if (ek.tox && s.b.toxRes) return !m.buf.toxRes;
  return false;
}
// 과녁의 방어 마법(반응형 몸·벽·격추)이 모두 간격 중인가. 하나도 없으면 아니다
function defenseDown(e, S, W) {
  const def = deck(e, S).def; if (!def.length) return false;
  for (let i = 0; i < def.length; i++) if (!((e.cd[def[i]] || 0) > 0.3)) return false;
  if (!(circOf(W, e) >= 3 && e.autoCd <= 0)) return true;
  for (let i = 0; i < def.length; i++) if ((e.cd[def[i]] || 0) <= 0) return false;
  return true;
}

module.exports = { C, hyp, roleOf, NOKIND, NONE, DIR16, DIR8, OFF, SELF_GAP, catOf, FORMNAME, isSetup, logDec, estDmg, PAIRS, rollSide, holdsOf, castTime, bindOf, caged, pinned, hitBack, afterPin, pinOf, deck, obsNear, anyNear, bigAttack, landDelay, maxRange, ownShare, kindOf, counters, defenseDown, circOf };
