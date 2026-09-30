'use strict';
/* 숨 결투장 — 두뇌 1: 읽기 (과녁과 성향, 위협)
 * 과녁: 약자부터(focusLow) 또는 가장 가까운 자. 성향(prefR·aggr·dodge·rest)은 새 객체를 만들지 않고 K에 둔다 (속도, 1.11.1). 규칙의 aim 훅이 고친다(파도).
 * 위협: 날아오는 투사체, 적의 예비동작(읽기, 초보는 못 한다), 보이는 구름, 해로운 지대. 피할 쪽을 정하고 구른다 */
const { C, hyp, deck } = require('./util');
const learn = require('./techniques/learn'), position = require('./techniques/position');
// 과녁과 성향: 과녁이 없으면 false
function aimAt(W, m, K) {
  const foes = W.foes[m.side], S = W.spells, T = m.tac;
  if (!foes.length) { m.mv.x = m.mv.y = 0; return false; }
  let e = null, bs = 1e9;
  for (const q of foes) { const d = hyp(q.x - m.x, q.y - m.y), sc = T.focusLow ? q.hp / q.hpMax * 40 + d : d; if (sc < bs) { bs = sc; e = q; } }
  K.foes = foes; K.S = S; K.T = T; K.prefR = T.prefR; K.aggr = T.aggr; K.dodgeK = T.dodge; K.rest = T.rest; K.e = e; K.wantMem = false;
  const h = W._bh.aim; for (let i = 0; i < h.length; i++) h[i](W, m, K);   // 파도 위의 성향·상대의 파도 읽기·파도 고르기 (rules/wave), 구르는 쪽 기록 (rules/risk)
  K.mem = learn.mem(W, m, K);   // 판 중 학습 (전설): 과녁이 구르는 쪽과 방패를 드는 거리
  const Dm = deck(m, S), De = deck(e, S); K.Dm = Dm; K.De = De;
  position.outrange(W, m, K);   // 사거리 밖 (대가)
  const d2 = hyp(e.x - m.x, e.y - m.y) || 0.01, ux = (e.x - m.x) / d2, uy = (e.y - m.y) / d2, d = m.z || e.z ? C.hyp3(d2, 0, e.z - m.z) : d2;   // 거리는 높이를 넣어, 방향은 땅 위로 (v2.0)
  const los = !C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z);
  if (m.thinkAt != null && !m.losWas) m.log.coverT += W.t - m.thinkAt; m.thinkAt = W.t; m.losWas = los;   // 엄폐 시간: 과녁과 사이가 막혀 있던 시간
  K.d = d; K.ux = ux; K.uy = uy; K.los = los;
  K.vt = (e.vx * -ux + e.vy * -uy);           // 적이 나에게 다가오는 속도 (m/s)
  K.eDown = e.st.stun > 0 || e.st.root > 0;
  return true;
}
// 규칙이 이 예비동작을 숨기는가 (이단, rules/wave)
function hidden(h, W, q, c, m) { for (let i = 0; i < h.length; i++) if (h[i](W, q, c, m)) return true; return false; }
function readThreats(W, m, K) {
  const { foes, T, dodgeK, ux, uy } = K;
  let dodge = null, aimed = false, threat = null, late = null;
  K.blindR = false; const hr = W._bh.read; for (let i = 0; i < hr.length; i++) hr[i](W, m, K);   // 눈멂 (rules/control): 예비동작과 구름을 못 읽고, 자동 진은 마지막 0.2 s에야
  const blindR = K.blindR, hc = W._bh.hideCast;
  for (const p of W.proj) {
    if (p.src === m || (!W.rules.friendlyFire && p.src.side === m.side)) continue;
    const rx = m.x - p.x, ry = m.y - p.y;
    if (p.home && p.src.side !== m.side && rx * rx + ry * ry < 12.25) { dodge = { x: rx, y: ry }; continue; }
    const vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv;
    if (t > 0 && t < 0.8 && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 0.55) { dodge = { x: -p.vy, y: p.vx, perp: 1 }; aimed = true; }
  }
  if (T.readCast) for (let i = 0; i < foes.length; i++) for (let j = 0; j < 2; j++) {   // 초보는 날아오는 투사체만 본다: 예비동작·구름·지대를 못 읽는다
    const q = foes[i], c = j ? q.castB : q.cast;
    if (!c || !C.THREAT[c.s.t]) continue;
    if (hc.length && hidden(hc, W, q, c, m)) continue;
    const r = c.s.t === 'area' ? c.s.r * C.sizeOf(q, c.s) + 0.4 : 0.8;
    if (blindR) { if (hyp(c.tx - m.x, c.ty - m.y) < r && c.T - c.t < 0.2) { late = c; late.by = q; } continue; }
    if (hyp(c.tx - m.x, c.ty - m.y) < r) { aimed = true; threat = c; threat.by = q; if (c.T - c.t < 0.5) dodge = dodge || { x: -uy, y: ux, perp: 1 }; }
  }
  for (const a of W.areas) if ((a.src.side !== m.side && a.vis && T.readCast && !blindR || a.src === m) && hyp(a.x - m.x, a.y - m.y) < a.r + 0.5) dodge = { x: m.x - a.x || 0.1, y: m.y - a.y || 0.1 };
  // 날아오는 돌(곡사)도 떨어질 자리를 보고 비킨다 (v2.0. 1.x에선 곡사를 읽지 않아 아무도 피하지 않았다)
  if (T.readCast && !blindR && T.readLob) for (const l of W.lobs) if (l.src.side !== m.side && hyp(l.x - m.x, l.y - m.y) < l.r + 0.5) dodge = { x: m.x - l.x || 0.1, y: m.y - l.y || 0.1 };
  if (T.readCast) for (const z of W.zones) if (z.src.side !== m.side && (z.k === 'fire' || z.k === 'h2s' || z.k === 'nh3' || z.k === 'acid' || z.k === 'spore' || z.k === 'ice') && C.inZone(z, m.x, m.y)) dodge = { x: m.x - z.x || 0.1, y: m.y - z.y || 0.1 };
  // 옆으로 피할 땐 버릇대로 쪽을 고른다 (1.6.0). 버릇이 없으면 늘 왼쪽(1.5.0까지)
  if (dodge && dodge.perp && m.rollPref && (W.rng() < m.rollPref ? m.rollSide : -m.rollSide) < 0) { dodge.x = -dodge.x; dodge.y = -dodge.y; }
  // 굳거나 묶이면 구르지 못한다 (1.7.0 버그 수정, SPEC 9장). 균사·경직도 (1.11.0)
  if (dodge && m.rollCd <= 0 && m.stam > 1.5 && !(m.st.stun > 0 || m.st.root > 0 || m.st.mycel > 0 || m.st.cramp > 0) && W.rng() < Math.min(T.rollCap, 0.4 + dodgeK * 0.4 + (m.autoDodge ? 0.3 : 0))) {
    const l = hyp(dodge.x, dodge.y) || 1; let mine = false; for (const a of W.areas) if (a.src === m && hyp(m.x + dodge.x / l * 2 - a.x, m.y + dodge.y / l * 2 - a.y) < a.r + 0.5) { mine = true; break; }
    if (mine) { dodge.x = -dodge.x; dodge.y = -dodge.y; }   // 내 폭발 쪽으로는 구르지 않는다
    C.roll(W, m, dodge.x, dodge.y, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8);   // 석회가 붙으면 구르는 거리 절반
  }
  K.dodge = dodge; K.aimed = aimed; K.threat = threat; K.late = late;
}
module.exports = { aimAt, readThreats };
