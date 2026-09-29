'use strict';
/* =========================================================================
 * 숨 결투장 — 기본 두뇌 v1.0.1
 * 판단 순서: 위협 읽기 → 입장(보통·버티기·돌파·거리 두기) → 움직임 → 자동 진 → 칸 고르기 → 휴식 → 마법 고르기
 * 새 두뇌를 만들 땐 think(W, m) 하나만 같은 모양으로 내보내면 된다.
 * ========================================================================= */
const C = require('./core');
const { hyp, clamp } = C;

const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const SELF_GAP = 1.5;   // 지연 폭발 반지름 밖으로 둘 여유 (m): 몸 0.3 + 겨냥 흔들림과 지연 동안의 걸음
function catOf(s) {
  if (s.t === 'trap' || s.role === '함정') return '함정';
  if (s.t === 'move' || (s.t === 'buff' && s.b.speed)) return '이동';
  if (s.role === '방어' || s.t === 'wall' || s.t === 'ring' || s.t === 'shoot' || s.t === 'smother' || s.t === 'buff') return '방어';
  return '공격';
}
const FORMNAME = { proj: '던지기', lob: '던지기', touch: '몸', cone: '앞으로 뿜기', thread: '실', area: '상대 자리', zone: '자리 깔기', trap: '함정', wall: '내 앞 벽', buff: '몸', move: '이동', ring: '몸', shoot: '몸', smother: '몸' };
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
  if (s.t === 'proj') return Math.min((s.hit && s.hit.cap) || 99, 0.55 * Math.pow(0.5 * s.m * s.v * s.v, 0.75)) * (s.multi ? s.multi * 0.5 : 1);
  if (s.t === 'thread') return 0.8 * Math.pow(s.E, 0.55);
  if (s.t === 'cone') return s.dps * s.dur;
  return s.dmg || 0;
}

function think(W, m) {
  const foes = W.foes[m.side], T = m.tac, S = W.spells;
  if (!foes.length) { m.mv.x = m.mv.y = 0; return; }
  // 과녁: 약자부터(focusLow) 또는 가장 가까운 자
  let e = null, bs = 1e9;
  for (const q of foes) { const d = hyp(q.x - m.x, q.y - m.y), sc = T.focusLow ? q.hp / q.hpMax * 40 + d : d; if (sc < bs) { bs = sc; e = q; } }
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
    if (t > 0 && t < 0.8 && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 0.55) { dodge = { x: -p.vy, y: p.vx }; aimed = true; }
  }
  for (const q of foes) for (const c of [q.cast, q.castB]) {
    if (!c || !C.THREAT[c.s.t]) continue;
    const r = c.s.t === 'area' ? c.s.r * C.sizeOf(q, c.s) + 0.4 : 0.8;
    if (hyp(c.tx - m.x, c.ty - m.y) < r) { aimed = true; threat = c; if (c.T - c.t < 0.5) dodge = dodge || { x: -uy, y: ux }; }
  }
  for (const a of W.areas) if ((a.src.side !== m.side && a.vis || a.src === m) && hyp(a.x - m.x, a.y - m.y) < a.r + 0.5) dodge = { x: m.x - a.x || 0.1, y: m.y - a.y || 0.1 };
  for (const z of W.zones) if (z.src.side !== m.side && (z.k === 'fire' || z.k === 'h2s' || z.k === 'nh3' || z.k === 'acid' || z.k === 'spore' || z.k === 'ice') && C.inZone(z, m.x, m.y)) dodge = { x: m.x - z.x || 0.1, y: m.y - z.y || 0.1 };
  if (dodge && m.rollCd <= 0 && m.stam > 1.5 && W.rng() < 0.4 + T.dodge * 0.4 + (m.autoDodge ? 0.3 : 0)) {
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
        const a = k / 16 * 6.2832, dx = Math.cos(a), dy = Math.sin(a); let sc = 0;
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

  // ---- 5. 칸 고르기 ----
  let slot = 'A';
  if (m.cast || m.chan) { if (circ >= 2 && !m.castB) slot = 'B'; else return; }

  // ---- 6. 휴식: 머리가 뜨거우면 위협이 없을 때 쉰다 ----
  if (W.rules.fatigue && m.fat > T.rest && !aimed && d > 4) { m.log.dec.rest++; return; }

  // ---- 7. 마법 고르기 ----
  const cand = [];
  for (const n of m.book) {
    const s = S[n];
    if (slot === 'B' && (s.t === 'cone' || s.t === 'move' || (m.cast && m.cast.s.n === n))) continue;
    if ((m.cd[n] || 0) > 0) continue;
    const cost = s.cost * (1 - 0.25 * (m.mast[n] || 0)) * (slot === 'B' ? 1.3 : 1); if (m.glu < cost) continue;
    const he = m.hitEst[n] ?? 0.35, Tw = s.cast * (1 - 0.35 * (m.mast[n] || 0)), R = C.rangeOf(m, s);
    let v = 0, tx = e.x, ty = e.y, barrel = false;
    switch (s.t) {
      case 'proj': if (d < (s.home ? 12 : R) && (los || s.home)) { const tof = d / s.v; tx = e.x + e.vx * (Tw + tof) * 0.8; ty = e.y + e.vy * (Tw + tof) * 0.8; v = he * estDmg(s) * (eDown ? 1.6 : 1) / (Tw + 0.3); } break;
      case 'lob': if (d < R) { tx = e.x + e.vx * s.flight * 0.7; ty = e.y + e.vy * s.flight * 0.7; v = he * s.dmg * (eDown ? 2 : 1) / (Tw + 0.3) + (los ? 0 : 0.3); } break;
      case 'thread': if (d < R && los) { const tt = Tw + d / (32 * (s.fast || 1)); tx = e.x + e.vx * tt * 0.6; ty = e.y + e.vy * tt * 0.6; v = he * estDmg(s) * (e.st.wet > 0 ? 1.5 : 1) * (eDown ? 1.8 : 1) / (tt + 0.3); } break;
      case 'area': if (d < R) { tx = e.x + e.vx * s.delay * 0.5; ty = e.y + e.vy * s.delay * 0.5; v = he * s.dmg * (eDown ? 2 : 1) / (Tw + s.delay * 0.3 + 0.3); } break;
      case 'touch': if (d < 1.3) v = 1.5 * s.dmg / (Tw + 0.3); break;
      case 'cone': if (d < s.L * C.sizeOf(m, s)) v = he * s.dps * s.dur / (Tw + 0.3) * (s.wet && !(e.st.wet > 0) && m.book.some(q => S[q].t === 'thread' || S[q].t === 'touch') ? 1.5 : 1); break;
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
        if (W.traps.filter(t => t.src === m).length < 3) { v = 0.15 + T.trapBias; if (vt > 1.2 && d < 10) { v += 0.35; tx = e.x + e.vx; ty = e.y + e.vy; } else { tx = m.x + ux * 2; ty = m.y + uy * 2; } }
        break;
      case 'ring': if (W.proj.some(p => p.src.side !== m.side && p.s.home && hyp(p.x - m.x, p.y - m.y) < 3.5)) v = 1.2; else if (d < 2.5) v = 0.5; break;
      case 'shoot': { const n2 = W.proj.filter(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r).length; v = n2 ? 0.9 + n2 * 0.2 : 0; break; }
      case 'smother': { const need = m.st.burn > 0 || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3) || W.proj.some(p => p.src.side !== m.side && p.s.home && hyp(p.x - m.x, p.y - m.y) < 3); v = need ? 1.1 : 0; break; }
    }
    // 돌파 중이면 길을 막은 자를 친다
    if (escape && escape.bl.length && OFF[s.t]) { const b = escape.bl[0], db = hyp(b.x - m.x, b.y - m.y); if (db < (R || 10) && (s.t !== 'thread' || !C.blocked(W, m.x, m.y, b.x, b.y))) { tx = b.x; ty = b.y; v = Math.max(v, 0.8) * 1.8; } }
    // 지렛대: 적이 화약통 옆에 섰다
    if (W.barrels.length && (s.t === 'area' || s.t === 'thread' || (s.t === 'zone' && s.z.k === 'fire')) && (s.t === 'thread' || s.kind === 'fire' || s.kind === 'elec' || s.t === 'zone')) {
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
    if (W.rules.fatigue && !s.react) v -= m.fat / 100 * 0.5;
    if (slot === 'B') v -= 0.1;
    if (OFF[s.t]) v *= T.aggr;
    if (v > 0.15) cand.push({ s, n, v, tx, ty, Tw, cost, barrel });
  }
  if (!cand.length) return;
  // 장악권은 비싸니 상위 넷만 따진다
  cand.sort((a, b) => b.v - a.v);
  let best = null;
  for (let i = 0; i < Math.min(4, cand.length); i++) {
    const c = cand[i]; let v = c.v;
    if (W.rules.domain && !c.barrel && !c.s.mundane) v *= C.gAt(W, m, c.s, c.tx, c.ty);
    if (!best || v > best.v2) { best = c; best.v2 = v; }
  }
  if (!best || best.v2 <= 0.15) return;
  const s = best.s;
  let Tc = best.Tw * (m.st.cough > 0 ? 1.5 : 1) * (W.rules.fatigue ? 1 + m.fat / 200 : 1);
  if (s.t === 'thread') Tc += Math.min(hyp(best.tx - m.x, best.ty - m.y), C.rangeOf(m, s)) / (32 * (s.fast || 1));
  const ns = m.noise * hyp(best.tx - m.x, best.ty - m.y) * (m.st.blind > 0 ? 3 : 1);
  m.glu -= best.cost; m.cd[best.n] = s.cd;
  const cast = { s, tgt: e, tx: best.tx + W.rnd(-ns, ns), ty: best.ty + W.rnd(-ns, ns), t: 0, T: Tc, B: slot === 'B' };
  if (slot === 'B') m.castB = cast; else m.cast = cast;
  logDec(m, s, slot, { aimed, combo: eDown || (m.last && W.t - m.lastT < 1.5 && isSetup(S[m.last])), path: s.t === 'trap' && vt > 1.2 && d < 10, barrel: best.barrel });
  m.last = s.n; m.lastT = W.t;
}

module.exports = { think, catOf, FORMNAME, VERSION: '1.0.1' };
