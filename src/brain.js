/* =========================================================================
 * 숨 결투장 — 기본 두뇌 v1.7.0
 * 판단 순서: 위협 읽기 → 입장(보통·버티기·돌파·거리 두기) → 움직임 → 자동 진 → 칸 고르기 → 휴식 → 마법 고르기
 * 새 두뇌를 만들 땐 think(W, m) 하나만 같은 모양으로 내보내면 된다. 등록은 Arena.register.brain
 * Node와 브라우저(전역 ArenaBrain, ArenaCore 다음에 읽는다) 양쪽에서 돈다.
 * ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./core'));
  else root.ArenaBrain = factory(root.ArenaCore);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (C) {
'use strict';
const { hyp, clamp } = C;

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
function logDec(m, s, slot, ctx) {
  const L = m.log.dec; L.n++;
  const c = catOf(s); L.cat[c] = (L.cat[c] || 0) + 1; const f = FORMNAME[s.t]; L.form[f] = (L.form[f] || 0) + 1;
  if (c === '방어') { L.def++; if (ctx.aimed) L.react++; }
  if (c === '공격') { L.atk++; if (ctx.combo) L.combo++; }
  if (c === '함정') { L.trap++; if (ctx.path) L.trapPath++; }
  if (ctx.barrel) L.barrel++; if (slot === 'B') L.slotB++; if (slot === 'auto') L.auto++;
}
function estDmg(s) {
  if (s.hit && s.hit.flat) return s.hit.flat; if (s.hit && s.hit.dmg) return s.hit.dmg;
  if (s.burst && s.burst.dmg) return s.burst.dmg; if (s.burst) return 14;
  if (s.t === 'proj') return Math.min((s.hit && s.hit.cap) || 99, 0.55 * C.pow(0.5 * s.m * s.v * s.v, 0.75)) * (s.multi ? s.multi * 0.5 : 1);
  if (s.t === 'thread') return 0.8 * C.pow(s.E, 0.55);
  if (s.t === 'cone') return s.dps * s.dur;
  return s.dmg || 0;
}

// 이 마법이 과녁을 묶거나 굳히는 시간 (s). 안 보이는 발밑 공격은 소금 밑창에 × 0.3, 실은 min(1.2, E/800)
function bindOf(s, e) {
  const b = s.t === 'thread' ? Math.min(1.2, s.E / 800) : Math.max(s.root || 0, s.stun || 0, (s.hit && Math.max(s.hit.root || 0, s.hit.stun || 0)) || 0);
  return b * (s.t === 'area' && !s.vis && e.gear && e.gear.soles ? 0.3 : 1);
}
// 시전이 끝나고 과녁에 닿기까지 (s): 투사체는 날아가는 시간, 지연 폭발·곡사는 지연
function landDelay(s, d) { return s.t === 'proj' ? d / s.v : s.t === 'area' ? s.delay : s.t === 'lob' ? s.flight : s.t === 'thread' ? d / (32 * (s.fast || 1)) : 0; }
// 사람의 공격 마법 최대 사거리 (m)
function maxRange(m, S) { let r = 0; for (const n of m.book) { const s = S[n]; if (!s || !OFF[s.t]) continue; r = Math.max(r, s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : C.rangeOf(m, s)); } return r; }
// 내가 (x, y)에 섰을 때 제 손끝의 장악 몫: 적 신호가 옅은 땅일수록 크다 (SPEC 5장의 f, 내 몫은 거리 0)
function ownShare(W, m, foes, x, y) { const L = W.rules.domainL; let o = 0; for (const q of foes) o += q._sig * (q._act ? 1 : W.rules.passive) / (1 + hyp(x - q.x, y - q.y) / L); return m._sig / (m._sig + o); }
// 마법의 피해 종류 (덱 읽기)
function kindOf(s) { return s.kind || (s.hit && s.hit.kind) || (s.burst && s.burst.kind) || (s.tr && s.tr.kind) || (s.t === 'thread' ? 'elec' : s.z ? ({ fire: 'fire', nh3: 'tox', spore: 'tox', acid: 'tox', h2s: 'tox' })[s.z.k] : null) || null; }
// 덱 읽기 (전설): 이 마법이 상대 책의 피해 종류에 대한 천적이고, 아직 켜져 있지 않은가
function counters(s, ek, m, W) {
  if (ek.fire && s.t === 'zone' && ['rain', 'mist', 'absorb'].includes(s.z.k)) return !W.zones.some(z => z.src === m && z.k === s.z.k && hyp(z.x - m.x, z.y - m.y) < 3);
  if (s.t !== 'buff') return false;
  if (ek.elec && s.b.elecRes && !s.react) return !m.buf.elecRes;
  if (ek.blunt && (s.b.bluntRes || s.b.block)) return !m.buf.bluntRes && !m.buf.front;
  if (ek.tox && s.b.toxRes) return !m.buf.toxRes;
  return false;
}
// 과녁의 방어 마법(반응형 몸·벽·격추)이 모두 간격 중인가. 하나도 없으면 아니다
function defenseDown(e, S, W) {
  const def = e.book.filter(n => S[n] && ((S[n].t === 'buff' && S[n].react) || S[n].t === 'wall' || S[n].t === 'shoot'));
  return def.length > 0 && def.every(n => (e.cd[n] || 0) > 0.3) && !(W.rules.circles && e.circles >= 3 && e.autoCd <= 0 && def.some(n => (e.cd[n] || 0) <= 0));
}

function think(W, m) {
  const foes = W.foes[m.side], S = W.spells;
  // 파도를 타는 동안: 더 몰아치고, 더 붙고, 덜 피하고, 쉬지 않는다
  let T = m.wave ? Object.assign({}, m.tac, { aggr: m.tac.aggr * 1.6, prefR: m.tac.prefR * 0.7, dodge: m.tac.dodge * 0.5, rest: 999 }) : m.tac;
  if (!foes.length) { m.mv.x = m.mv.y = 0; return; }
  // 과녁: 약자부터(focusLow) 또는 가장 가까운 자
  let e = null, bs = 1e9;
  for (const q of foes) { const d = hyp(q.x - m.x, q.y - m.y), sc = T.focusLow ? q.hp / q.hpMax * 40 + d : d; if (sc < bs) { bs = sc; e = q; } }
  // 메타는 상대의 파도를 읽는다: 상대가 파도 위면 물러서고, 꺼짐이면 몰아친다 (1.3.0)
  if (W.rules.wave && (m.type === '메타' || T.readWave) && (e.wave || e.crash > 0)) T = Object.assign({}, T, e.wave ? { prefR: T.prefR * 1.4, aggr: T.aggr * 0.7 } : { aggr: T.aggr * 1.6 });
  // 판 중 학습 (전설): 과녁이 구르는 쪽과 방패를 드는 거리를 센다
  let mem = null;
  if (T.learn) {
    mem = m.mem[e.id] || (m.mem[e.id] = { L: 0, R: 0, rollT: -9, sh: [], shT: -9 });
    const dx = e.x - m.x, dy = e.y - m.y;
    if (e.roll > 0 && W.t - mem.rollT > 0.3) { if (dx * e.vy - dy * e.vx > 0) mem.L++; else mem.R++; mem.rollT = W.t; }
    if (e.buf.front && W.t - mem.shT > 0.6) { mem.sh.push(hyp(dx, dy)); if (mem.sh.length > 8) mem.sh.shift(); mem.shT = W.t; }
  }
  // 파도 고르기 (전설): 과녁을 끝낼 수 있을 때만 파도를 원한다
  if (T.waveChoose) m.waveWant = e.hp / e.hpMax < 0.35 && m.hp / m.hpMax > 0.3;
  // 사거리 밖 (대가): 내 사거리가 더 길면 상대 덱의 최대 사거리 바로 밖에 선다
  if (T.outrange) { const eR = maxRange(e, S), mR = maxRange(m, S); if (mR > eR + 1) T = Object.assign({}, T, { prefR: Math.min(eR + 1, mR - 0.5) }); }
  const d = hyp(e.x - m.x, e.y - m.y) || 0.01, ux = (e.x - m.x) / d, uy = (e.y - m.y) / d;
  const los = !C.blocked(W, m.x, m.y, e.x, e.y);
  const vt = (e.vx * -ux + e.vy * -uy);           // 적이 나에게 다가오는 속도 (m/s)
  const eDown = e.st.stun > 0 || e.st.root > 0;

  // ---- 1. 위협 읽기 ----
  let dodge = null, aimed = false, threat = null;
  for (const p of W.proj) {
    if (p.src === m || (!W.rules.friendlyFire && p.src.side === m.side)) continue;
    const rx = m.x - p.x, ry = m.y - p.y;
    if (p.s.home && p.src.side !== m.side && rx * rx + ry * ry < 12.25) { dodge = { x: rx, y: ry }; continue; }
    const vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv;
    if (t > 0 && t < 0.8 && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 0.55) { dodge = { x: -p.vy, y: p.vx, perp: 1 }; aimed = true; }
  }
  if (T.readCast) for (const q of foes) for (const c of [q.cast, q.castB]) {   // 초보는 날아오는 투사체만 본다: 예비동작·구름·지대를 못 읽는다
    if (!c || !C.THREAT[c.s.t]) continue;
    if (W.rules.wave && q.type === '이단' && c.T - c.t > 0.12) continue;   // 이단의 예비동작은 신호가 조용해 마지막 0.12 s에만 읽힌다 (읽기·자동 진 모두)
    const r = c.s.t === 'area' ? c.s.r * C.sizeOf(q, c.s) + 0.4 : 0.8;
    if (hyp(c.tx - m.x, c.ty - m.y) < r) { aimed = true; threat = c; if (c.T - c.t < 0.5) dodge = dodge || { x: -uy, y: ux, perp: 1 }; }
  }
  for (const a of W.areas) if ((a.src.side !== m.side && a.vis && T.readCast || a.src === m) && hyp(a.x - m.x, a.y - m.y) < a.r + 0.5) dodge = { x: m.x - a.x || 0.1, y: m.y - a.y || 0.1 };
  if (T.readCast) for (const z of W.zones) if (z.src.side !== m.side && (z.k === 'fire' || z.k === 'h2s' || z.k === 'nh3' || z.k === 'acid' || z.k === 'spore' || z.k === 'ice') && C.inZone(z, m.x, m.y)) dodge = { x: m.x - z.x || 0.1, y: m.y - z.y || 0.1 };
  // 옆으로 피할 땐 버릇대로 쪽을 고른다 (1.6.0). 버릇이 없으면 늘 왼쪽(1.5.0까지)
  if (dodge && dodge.perp && m.rollPref && (W.rng() < m.rollPref ? m.rollSide : -m.rollSide) < 0) { dodge.x = -dodge.x; dodge.y = -dodge.y; }
  if (dodge && m.rollCd <= 0 && m.stam > 1.5 && W.rng() < Math.min(T.rollCap, 0.4 + T.dodge * 0.4 + (m.autoDodge ? 0.3 : 0))) {
    const l = hyp(dodge.x, dodge.y) || 1; if (W.areas.some(a => a.src === m && hyp(m.x + dodge.x / l * 2 - a.x, m.y + dodge.y / l * 2 - a.y) < a.r + 0.5)) { dodge.x = -dodge.x; dodge.y = -dodge.y; }   // 내 폭발 쪽으로는 구르지 않는다
    m.vx = dodge.x / l * 8; m.vy = dodge.y / l * 8; m.roll = 0.25; m.rollCd = m.autoDodge ? 0.6 : 0.8; m.stam -= 1.5;
  }

  // ---- 2. 입장: 둘러싸였을 때 버틸 것인가, 뚫을 것인가 ----
  let near = 0, suppSum = 0, unsup = 0;
  for (const q of foes) {
    if (hyp(q.x - m.x, q.y - m.y) >= 8) continue; near++;
    const g = W.rules.domain ? C.gOf(W, C.share(W, q, q.x, q.y)) : 1;   // 그 적이 제 손끝에서 마법을 지을 수 있는 정도
    const mund = q.book.some(n => S[n] && S[n].mundane);
    suppSum += g; if (g > 0.5 || mund) unsup++;
  }
  let stance = 'normal', escape = null;
  if (T.stance && near >= 3) {
    if (unsup <= 1 && suppSum / near < 0.35) stance = 'hold';
    else {
      stance = 'breakout';
      let bd = null, bsc = -1e9;
      for (let k = 0; k < 16; k++) {
        const a = k / 16 * 6.2832, dx = C.cos(a), dy = C.sin(a); let sc = 0;
        for (const q of foes) { const qx = q.x - m.x, qy = q.y - m.y, dq = hyp(qx, qy) || 1; if ((qx * dx + qy * dy) / dq > 0.6) sc -= 3 / Math.max(1, dq / 3); }
        let room = 0; for (let s2 = 1; s2 <= 14; s2++) { const px = m.x + dx * s2, py = m.y + dy * s2; if (px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1) break; if (W.obs.some(o => hyp(o.x - px, o.y - py) < o.r + 0.3)) break; room = s2; }
        sc += room * 0.4; if (sc > bsc) { bsc = sc; bd = { dx, dy }; }
      }
      const bl = foes.filter(q => { const qx = q.x - m.x, qy = q.y - m.y, dq = hyp(qx, qy) || 1; return dq < 10 && (qx * bd.dx + qy * bd.dy) / dq > 0.6; }).sort((a, b) => hyp(a.x - m.x, a.y - m.y) - hyp(b.x - m.x, b.y - m.y));
      escape = { dir: bd, bl };
    }
  } else if (T.stance && m.stance === 'breakout' || (m.stance === 'kite' && foes.some(q => hyp(q.x - m.x, q.y - m.y) < 12))) stance = 'kite';
  m.stance = stance;

  // ---- 3. 움직임 ----
  let vx = 0, vy = 0;
  if (stance === 'breakout') { vx = escape.dir.dx * 2.5; vy = escape.dir.dy * 2.5; }
  else if (stance === 'kite') {
    let rx = 0, ry = 0; for (const q of foes) { const dq = hyp(m.x - q.x, m.y - q.y) || 1; if (dq < 14) { rx += (m.x - q.x) / dq / dq; ry += (m.y - q.y) / dq / dq; } }
    rx += (m.x < 5 ? 0.3 : 0) - (m.x > W.width - 5 ? 0.3 : 0); ry += (m.y < 5 ? 0.3 : 0) - (m.y > W.height - 5 ? 0.3 : 0);
    const l = hyp(rx, ry) || 1; vx = rx / l * 2 - ry / l * 0.6 * m.sf; vy = ry / l * 2 + rx / l * 0.6 * m.sf;
  } else {
    const pr = stance === 'hold' ? d : T.prefR;
    if (d > pr + 1) { vx += ux; vy += uy; } else if (d < pr - 1) { vx -= ux; vy -= uy; }
    if (W.rng() < 0.02) m.sf *= -1; const sw = stance === 'hold' ? 0.3 : 0.8; vx += -uy * m.sf * sw; vy += ux * m.sf * sw;
    // 자리 판단 (대가): 내 장악권이 짙은 땅 쪽으로 기운다
    if (T.terrain && W.rules.domain) { const f0 = ownShare(W, m, foes, m.x, m.y); let bx = 0, by = 0, bf = f0; for (let k = 0; k < 8; k++) { const a = k / 8 * 6.2832, px = m.x + C.cos(a) * 2, py = m.y + C.sin(a) * 2; if (px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1) continue; const f = ownShare(W, m, foes, px, py); if (f > bf) { bf = f; bx = C.cos(a); by = C.sin(a); } } const k2 = Math.min(1.2, (bf - f0) * 6); vx += bx * k2; vy += by * k2; }
  }
  if (dodge && stance !== 'breakout') { const l = hyp(dodge.x, dodge.y) || 1; vx = dodge.x / l * 2; vy = dodge.y / l * 2; }
  for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < t.r + 1.2) { const l = hyp(m.x - t.x, m.y - t.y) || 1; vx += (m.x - t.x) / l * 1.5; vy += (m.y - t.y) / l * 1.5; }
  for (const b of W.barrels) if (!b.ex && hyp(b.x - m.x, b.y - m.y) < 3.2) { const l = hyp(m.x - b.x, m.y - b.y) || 1; vx += (m.x - b.x) / l * 1.2; vy += (m.y - b.y) / l * 1.2; }
  // 내가 떨어뜨린 지연 폭발 안으로 걸어 들어가지 않는다. 돌파 중에도 (v1.0.1)
  for (const a of W.areas) if (a.src === m && hyp(a.x - m.x, a.y - m.y) < a.r + 1) { const l = hyp(m.x - a.x, m.y - a.y) || 1; vx = (m.x - a.x) / l * 2.5; vy = (m.y - a.y) / l * 2.5; }
  m.mv.x = vx; m.mv.y = vy;
  if (m.st.stun > 0) return;

  // ---- 4. 자동 진: 3서클부터, 생각 없이 막는다 ----
  const circ = W.rules.circles ? m.circles : 1;
  if (circ >= 3 && aimed && threat && threat.T - threat.t < 0.4 && m.autoCd <= 0) {
    for (const n of m.book) {
      const s = S[n]; if ((m.cd[n] || 0) > 0) continue;
      if (!((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot')) continue;
      if (s.t === 'shoot' && !W.proj.some(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < 6)) continue;
      const cost = s.cost * 1.2; if (m.glu < cost) continue;
      m.glu -= cost; m.cd[n] = s.cd; m.autoCd = 0.7 * 3 / circ;
      logDec(m, s, 'auto', { aimed: true });
      C.release(W, m, { s, tx: e.x, ty: e.y, tgt: e, t: 0, T: 0, auto: true });
      break;
    }
  }

  // ---- 속임수 (전설): 큰 예비동작에 상대가 반응했으면 끊고 다른 마법으로 ----
  if (m.cast && m.cast.feint) {
    const c = m.cast, f = c.feint, reacted = (e.roll > 0 && !f.roll) || (e.buf.front && !f.front) || e.autoCd > f.auto || W.walls.filter(w => w.own === e.side).length > f.walls;
    if (reacted) { m.cast = null; m.glu += c.cost * 0.7; m.cd[c.s.n] = Math.min(m.cd[c.s.n] || 0, 1); m.log.dec.feint = (m.log.dec.feint || 0) + 1; }
    else if (c.T - c.t < 0.1) c.feint = null;   // 반응이 없으면 진짜로 쏜다
  }

  // ---- 5. 칸 고르기 ----
  let slot = 'A';
  if (m.cast || m.chan) { if (circ >= 2 && !m.castB && T.slotB) slot = 'B'; else return; }   // 두 번째 칸은 대가부터 (기본은 씀)

  // ---- 6. 휴식: 머리가 뜨거우면 위협이 없을 때 쉰다 ----
  // 파도가 켜져 있으면 부류마다: 서퍼는 쉬지 않고 탄다, 메타는 이기고 있을 때만 타고 너무 깊으면(140) 내려온다, 이단은 쉰다
  // 방어 간격 세기 (대가): 과녁의 방어 마법이 모두 간격 중이면(자동 진도) 칠 때다. 쉬지 않고, 공격 가치 × 1.4
  const defDown = T.cdRead && defenseDown(e, S, W);
  let restNow = W.rules.fatigue && m.fat > T.rest && !aimed && d > 4 && !defDown;
  if (W.rules.wave && restNow) {
    if (T.waveChoose) restNow = !m.waveWant;   // 전설: 평소엔 메타처럼 쉬고, 끝낼 수 있으면 밀어붙인다
    else if (m.type === '서퍼') restNow = false;
    else if (m.type === '메타') restNow = !(e.hp / e.hpMax < 0.5 || m.hp / m.hpMax > e.hp / e.hpMax + 0.1);
  }
  if (restNow || (m.wave && (m.type === '메타' || (T.waveChoose && !m.waveWant)) && m.fat > 140 && !aimed)) { m.log.dec.rest++; m.relT = null; return; }

  // 쏜 뒤 멈춤 (초보): 쏘고 나서 정해진 시간 동안 다음을 고르지 않는다
  if (m.pauseLen && W.t - m.lastRel < m.pauseLen) return;
  // 두 수 콤보 계획 (상급): 묶기를 쏘았으면 묶인 동안 떨어질 결정타를 기다린다
  const plan = T.combo2 && m.combo && m.combo.tgt === e && W.t < m.combo.until ? m.combo : null;
  // ---- 7. 마법 고르기 ----
  const lead = T.lead, cb = T.combo, down = cb && eDown;
  const ek = {}; if (T.counter) for (const n of e.book) { const k = S[n] && kindOf(S[n]); if (k) ek[k] = 1; }
  // 학습한 구르기 쪽으로 겨냥을 옮긴다 (믿음은 본 수만큼), 학습한 방패 거리 근처면 투사체·실을 덜 쓴다
  const roll = mem && e.rollCd <= 0 ? (mem.L - mem.R) / (mem.L + mem.R + 2) * 1.2 : 0;
  const shieldNear = mem && mem.sh.length >= 2 && Math.abs(d - mem.sh.reduce((a, b) => a + b, 0) / mem.sh.length) < 2.5 && e.book.some(n => S[n] && S[n].b && S[n].b.front && !((e.cd[n] || 0) > 0));
  const cand = [];
  for (const n of m.book) {
    const s = S[n];
    if (slot === 'B' && (s.t === 'cone' || s.t === 'move' || (m.cast && m.cast.s.n === n))) continue;
    if ((m.cd[n] || 0) > 0) continue;
    const cost = s.cost * (1 - 0.25 * (m.mast[n] || 0)) * (slot === 'B' ? 1.3 : 1); if (m.glu < cost) continue;
    const he = m.hitEst[n] ?? 0.35, Tw = s.cast * (1 - 0.35 * (m.mast[n] || 0)), R = C.rangeOf(m, s);
    let v = 0, tx = e.x, ty = e.y, barrel = false;
    switch (s.t) {
      case 'proj': if (d < (s.home ? 12 : R) && (los || s.home)) { const tof = d / s.v; tx = e.x + e.vx * (Tw + tof) * 0.8 * lead; ty = e.y + e.vy * (Tw + tof) * 0.8 * lead; v = he * estDmg(s) * (down ? 1.6 : 1) / (Tw + 0.3); } break;
      case 'lob': if (d < R) { tx = e.x + e.vx * s.flight * 0.7 * lead; ty = e.y + e.vy * s.flight * 0.7 * lead; v = he * s.dmg * (down ? 2 : 1) / (Tw + 0.3) + (los ? 0 : 0.3); } break;
      case 'thread': if (d < R && los) { const tt = Tw + d / (32 * (s.fast || 1)); tx = e.x + e.vx * tt * 0.6 * lead; ty = e.y + e.vy * tt * 0.6 * lead; v = he * estDmg(s) * (cb && e.st.wet > 0 ? 1.5 : 1) * (down ? 1.8 : 1) / (tt + 0.3); } break;
      case 'area': if (d < R) { tx = e.x + e.vx * s.delay * 0.5 * lead; ty = e.y + e.vy * s.delay * 0.5 * lead; v = he * s.dmg * (down ? 2 : 1) / (Tw + s.delay * 0.3 + 0.3); } break;
      case 'touch': if (d < 1.3) v = 1.5 * s.dmg / (Tw + 0.3); break;
      case 'cone': if (d < s.L * C.sizeOf(m, s)) v = he * s.dps * s.dur / (Tw + 0.3) * (cb && s.wet && !(e.st.wet > 0) && m.book.some(q => S[q].t === 'thread' || S[q].t === 'touch') ? 1.5 : 1); break;
      case 'zone': {
        const k = s.z.k;
        if ((k === 'fire' || k === 'nh3' || k === 'spore') && d < 9) { v = (vt > 1.2 ? 0.55 : 0.2) + T.zoneBias; tx = (m.x + e.x) / 2; ty = (m.y + e.y) / 2; }
        if (k === 'smoke') { if (aimed) v = 0.6 + T.zoneBias; tx = m.x + ux; ty = m.y + uy; }
        if ((k === 'mist' || k === 'absorb') && d < 7 && e.book.some(q => S[q].kind === 'fire' || S[q].t === 'thread')) { v = 0.4 + T.zoneBias; tx = m.x + ux * 2; ty = m.y + uy * 2; }
        if (k === 'ice' && d < 8) v = (vt > 1.2 ? 0.6 : 0.3) + T.zoneBias;
        if (k === 'acid' && d < R) v = 0.35 + (W.walls.some(w => w.own !== m.side && hyp(w.x - e.x, w.y - e.y) < 3) ? 0.6 : 0) + T.zoneBias;
        if (k === 'rain') { const need = m.st.burn > 0 || W.proj.some(p => p.src.side !== m.side && (p.s.home || p.s.n === '불덩이') && hyp(p.x - m.x, p.y - m.y) < 4) || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3.5); v = need ? 1.1 : 0; tx = m.x; ty = m.y; }
        break;
      }
      case 'wall':
        if (aimed && threat && (threat.s.t === 'proj' || threat.s.t === 'thread') && Tw < threat.T - threat.t) v = 1.0;
        else if (los && d > 6 && !W.walls.some(w => w.own === m.side && hyp(w.x - m.x, w.y - m.y) < 3)) v = 0.3;
        if (stance === 'kite' && d < 9) v = Math.max(v, 0.7);
        break;
      case 'buff':
        if (s.react && aimed && threat && threat.T - threat.t < 0.35) v = 1.1;
        if (s.b.bluntRes && !m.buf.bluntRes && e.book.some(q => S[q].hit && S[q].hit.kind === 'blunt')) v = 0.35;
        if (s.b.elecRes && !s.react && aimed && !m.buf.elecRes) v = 1.0;
        if (s.b.toxRes && !m.buf.toxRes && W.zones.some(z => z.src.side !== m.side && ['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3)) v = 0.9;
        if (s.b.speed && !m.buf.speed && (d > T.prefR + 4 || dodge || stance === 'breakout')) v = stance === 'breakout' ? 1.3 : 0.45;
        break;
      case 'move':
        if (stance === 'breakout') { v = 1.6; tx = m.x + escape.dir.dx * 6; ty = m.y + escape.dir.dy * 6; }
        else if (d > T.prefR + 5) v = 0.45;
        if (s.mv === 'glide' && aimed && m.rollCd > 0) { v = 0.8; const sg = W.rng() < 0.5 ? 1 : -1; tx = m.x - uy * 5 * sg; ty = m.y + ux * 5 * sg; }
        if (s.mv === 'vault' && !los && W.obs.some(o => hyp(o.x - m.x, o.y - m.y) < 2.5)) v = Math.max(v, 0.45);
        break;
      case 'trap':
        if (W.traps.filter(t => t.src === m).length < 3) { v = 0.15 + T.trapBias; if (T.pathTrap && vt > 1.2 && d < 10) { v += 0.35; tx = e.x + e.vx; ty = e.y + e.vy; } else { tx = m.x + ux * 2; ty = m.y + uy * 2; } }
        break;
      case 'ring': if (W.proj.some(p => p.src.side !== m.side && p.s.home && hyp(p.x - m.x, p.y - m.y) < 3.5)) v = 1.2; else if (d < 2.5) v = 0.5; break;
      case 'shoot': { const n2 = W.proj.filter(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r).length; v = n2 ? 0.9 + n2 * 0.2 : 0; break; }
      case 'taunt': { const c = e.cast || e.castB; if (c && e.type !== '이단' && d < R && c.T - c.t > Tw + 0.05) v = he * estDmg(c.s) * (e.wave ? 1 : 0.6) / (Tw + 0.3) * (e.wave ? 1.3 : 1); break; }   // 끊을 부름의 값 × 끊길 확률
      case 'smother': { const need = m.st.burn > 0 || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3) || W.proj.some(p => p.src.side !== m.side && p.s.home && hyp(p.x - m.x, p.y - m.y) < 3); v = need ? 1.1 : 0; break; }
    }
    if (plan && OFF[s.t]) {
      if (n === plan.fin) { const land = W.t + Tw + landDelay(s, d); if (land >= plan.land - 0.05 && land <= plan.land + plan.bind) { v = Math.max(v, 0.6) * 3; if (e.st.root > 0 || e.st.stun > 0 || plan.land > W.t) { tx = e.x; ty = e.y; } } else if (land < plan.land - 0.05) v = 0; }
      else if (!isSetup(s) && W.t < plan.land + plan.bind) v *= 0.3;   // 결정타 자리를 비워 둔다
    }
    if (roll && (s.t === 'proj' || s.t === 'thread')) { tx += -uy * roll; ty += ux * roll; }
    if (shieldNear) { if (s.t === 'proj' || s.t === 'thread') v *= 0.7; else if (s.t === 'area' || s.t === 'lob') v *= 1.25; }
    // 덱 읽기: 상대가 그 종류를 부르는 중이면 천적을 먼저, 아니면 한가할 때 조금 먼저
    if (T.counter && d < 14 && counters(s, ek, m, W)) { const hot = [e.cast, e.castB].some(c => c && kindOf(c.s) && counters(s, { [kindOf(c.s)]: 1 }, m, W)); const vc = hot ? 0.9 : 0.25; if (v < vc) { v = vc; if (s.t === 'buff' || (s.z && s.z.k === 'rain')) { tx = m.x; ty = m.y; } } }
    // 돌파 중이면 길을 막은 자를 친다
    if (escape && escape.bl.length && OFF[s.t]) { const b = escape.bl[0], db = hyp(b.x - m.x, b.y - m.y); if (db < (R || 10) && (s.t !== 'thread' || !C.blocked(W, m.x, m.y, b.x, b.y))) { tx = b.x; ty = b.y; v = Math.max(v, 0.8) * 1.8; } }
    // 지렛대: 적이 화약통 옆에 섰다
    if (T.lever && W.barrels.length && (s.t === 'area' || s.t === 'thread' || (s.t === 'zone' && s.z.k === 'fire')) && (s.t === 'thread' || s.kind === 'fire' || s.kind === 'elec' || s.t === 'zone')) {
      for (const b of W.barrels) {
        if (b.ex) continue; const db = hyp(b.x - m.x, b.y - m.y); if (db > (R || 12) || db < 3.3) continue;
        if (s.t === 'thread' && C.blocked(W, m.x, m.y, b.x, b.y)) continue;
        let nE = 0; for (const q of foes) if (hyp(q.x - b.x, q.y - b.y) < 2.6) nE++; if (!nE) continue;
        const vb = 35 * nE * 0.8 / (Tw + (s.delay || 0) * 0.5 + 0.3); if (vb > v) { v = vb; tx = b.x; ty = b.y; barrel = true; }
      }
    }
    // 여럿이 뭉친 곳
    if (T.crowd && (s.t === 'area' || s.t === 'zone' || s.t === 'lob' || s.t === 'cone')) {
      const rr = s.t === 'cone' ? 2 : (s.r || (s.z && (s.z.r || (s.z.len || 0) / 2)) || 1.5) * C.sizeOf(m, s);
      let cnt = 0; for (const q of foes) if (hyp(q.x - tx, q.y - ty) < rr + 0.4) cnt++; if (cnt > 1) v *= 1 + 0.6 * (cnt - 1);
    }
    // 지연 폭발은 쏜 사람도 맞힌다: 떨어질 자리가 내 둘레면 쓰지 않는다 (v1.0.1)
    if (s.t === 'area' && hyp(tx - m.x, ty - m.y) < s.r * C.sizeOf(m, s) + SELF_GAP) continue;
    if (W.rules.fatigue && !s.react && !m.wave) v -= m.fat / 100 * 0.5;
    if (m.wave && !OFF[s.t]) v *= 0.5;   // 파도 위에선 막기보다 친다
    if (slot === 'B') v -= 0.1;
    if (OFF[s.t]) v *= T.aggr * (defDown ? 1.4 : 1);
    if (v > 0.15) cand.push({ s, n, v, tx, ty, Tw, cost, barrel });
  }
  if (!cand.length) { m.relT = null; return; }   // 쏠 게 없으면 빈틈이 아니다
  // 장악권은 비싸니 상위 넷만 따진다
  cand.sort((a, b) => b.v - a.v);
  let best = null;
  for (let i = 0; i < Math.min(4, cand.length); i++) {
    const c = cand[i]; let v = c.v;
    if (W.rules.domain && !c.barrel && !c.s.mundane) v *= C.gAt(W, m, c.s, c.tx, c.ty);
    if (!best || v > best.v2) { best = c; best.v2 = v; }
  }
  if (!best || best.v2 <= 0.15) { m.relT = null; return; }
  // 속임수 시작 (전설): 상대가 자동 진이나 구르기로 반응할 수 있으면, 가끔 가장 큰 예비동작을 먼저 보인다
  let feint = null;
  if (T.feint && slot === 'A' && (e.autoDodge || (W.rules.circles && e.circles >= 3 && e.book.some(n => S[n] && ((S[n].t === 'buff' && S[n].react) || S[n].t === 'wall')))) && W.rng() < 0.2) {
    const big = cand.filter(c => OFF[c.s.t]).sort((a, b) => estDmg(b.s) - estDmg(a.s) || b.Tw - a.Tw)[0];
    if (big) { best = big; feint = { roll: e.roll > 0, front: !!e.buf.front, auto: e.autoCd, walls: W.walls.filter(w => w.own === e.side).length }; }
  }
  const s = best.s;
  let Tc = best.Tw * (m.st.cough > 0 ? 1.5 : 1) * (W.rules.fatigue ? 1 + Math.min(m.fat, 100) / 200 : 1) * (m.wave ? 0.75 : 1) * (m.crash > 0 ? 1.3 : 1);
  if (s.t === 'thread') Tc += Math.min(hyp(best.tx - m.x, best.ty - m.y), C.rangeOf(m, s)) / (32 * (s.fast || 1));
  const ns = m.noise * hyp(best.tx - m.x, best.ty - m.y) * (m.st.blind > 0 ? 3 : 1);
  m.glu -= best.cost; m.cd[best.n] = s.cd;
  const cast = { s, tgt: e, tx: best.tx + W.rnd(-ns, ns), ty: best.ty + W.rnd(-ns, ns), t: 0, T: Tc, B: slot === 'B', feint, cost: best.cost };
  if (slot === 'B') m.castB = cast; else m.cast = cast;
  // 행동 지표: 시작 시각, 빈틈, 콤보 시도
  m.log.starts.push(W.t); if (m.relT != null && slot === 'A') { m.log.gapSum += W.t - m.relT; m.log.gapN++; m.relT = null; }
  const intent = OFF[s.t] && ((down || (cb && e.st.wet > 0 && s.t === 'thread')) || (plan && s.n === plan.fin));
  if (intent) { m.log.comboTry++; m.comboPend = { tgt: e, until: W.t + Tc + landDelay(s, hyp(best.tx - m.x, best.ty - m.y)) + 0.6 }; if (plan) m.combo = null; }
  // 두 수 콤보를 여는 묶기를 쏘면 결정타를 예약한다 (묶기가 떨어질 때와 묶이는 시간)
  const bind = T.combo2 && OFF[s.t] ? bindOf(s, e) : 0;
  if (bind >= 0.3) {
    const fin = m.book.filter(k => S[k] && OFF[S[k].t] && k !== s.n && !bindOf(S[k], e)).sort((a, b) => estDmg(S[b]) - estDmg(S[a]))[0];
    if (fin) m.combo = { tgt: e, fin, land: W.t + Tc + landDelay(s, d), bind, until: W.t + Tc + 3 };
  }
  logDec(m, s, slot, { aimed, combo: eDown || (m.last && W.t - m.lastT < 1.5 && isSetup(S[m.last])), path: s.t === 'trap' && vt > 1.2 && d < 10, barrel: best.barrel });
  m.last = s.n; m.lastT = W.t;
}

return { think, catOf, FORMNAME, VERSION: '1.7.0' };
});
