'use strict';
/* 규칙: 전투단과 다수 대응 (rules.squad, v2.26, SPEC 49장, 수는 data/rules/squad.json) — 기본 꺼짐
 * 지휘 겹 (tac.squad가 있는 사람의 편, 과녁의 선명도가 편의 가운데 선명도의 ratio배 이상, 셋 넘게 살아 있을 때): 개인의 두뇌 위에 편마다 칠판 하나
 *   칠판 (every s마다, 엔진 훅 world): 과녁(가장 선명한 적)의 본 자리·속도(눈: 시야가 이어진 누군가가 sight m 안에서 본다), 과녁의 응수(굳음·묶임·눈멂·두 칸이 다 참·떨어짐),
 *     우리 편 살아 있는 수·잃은 몫, 조와 역할, 일제 사격의 창
 *   역할: 눈(가장 먼 사거리) · 미끼(편에 하나, 조가 둘 이상일 때) · 묶기(굳히고 묶는 수가 가장 많은) · 타격 · 방패(조가 넷 넘으면, 막는 수가 있는 사람) · 예비(조가 다 차고 남은 사람)
 *     판 시작과 우리 편을 잃을 때마다 다시 정한다. 조는 과녁 둘레의 각 차례로 teamN명씩, 조장은 체력이 가장 많은 사람
 *   자리: 조마다 과녁 둘레의 각(조가 둘·셋이면 sep 사이, 넷부터 고르게), 반지름은 과녁 장악 반경 + out(사거리가 모자라면 사거리 × 0.9), 조원은 옆으로 spread m씩.
 *     눈은 + 8 m, 예비는 + 15 m, 방패는 − 2 m
 *   번갈아: turn s마다 쏘는 조가 바뀌고, 나머지 조는 rot만큼 돌아 자리를 옮긴다(쏘지 않는 조의 공격 × w.off)
 *   망치와 모루: 과녁의 시전이 노린 조는 threatT s 물러서고 방패가 막는다(막는 수 × w.shield). 나머지 조가 친다
 *   동시 체크: 과녁의 응수가 바닥나면(굳음·묶임·눈멂·떨어짐·두 칸이 다 참) 일제 사격을 부른다: lead s 뒤 sync s 안에 닿을 공격 × w.volley.
 *     과녁이 굳거나 묶이면 타격의 큰 수 × w.strike(메이트), 묶기는 늘 묶는 수 × w.bind
 *   물러섬: 모인 뒤 잃은 몫이 fallback이면 흩어졌다(regroup s, 과녁에서 멀어지고 공격 × w.scatter) 다시 모인다(역할을 다시 정한다)
 * 물러서기 (v2.28, solo.retreat): 살아 있는 적이 retreat.foes 넘고 지는 판(체력 retreat.hp 아래, 또는 체력 hpDry 아래에 둘레가 dry 아래로 말랐거나 머리가 fat을 넘음, 또는 숨을 breaths번 다 쓰고 당이 glu 아래)이면
 *   도망치는 사람처럼 싸움터 끝으로 떠난다(m.flee, rules/morale이 끝에서 뺀다: alog.fled). 판의 '물러남'
 * 합창(rules.chorus)이 켜지면 조는 맞추기 전엔 과녁의 장악 반경 + chorus.out 밖에서 모이고, 맞추면 제 자리로 나온다
 * 개인의 다수 모드 (선명도 solo.cMin 이상, 살아 있는 적 solo.foes 넘게. 전투단이 아니어도): 두뇌 훅 aim·steer·value
 *   위협 지도: R 안 적의 각으로 포위각(360° − 가장 넓은 틈)을 재고, enc를 넘으면 가장 넓은 틈 쪽으로 빠져 적을 앞쪽 부채꼴에 모은다
 *   과녁: 가까운 적부터이되, 둘레 iso m 안에 동료가 없는 적(isoB m)·묶는 수를 가진 적(bindB m)을 먼저 지운다(거리에서 뺀다)
 *   총: gunR 안의 장전된 총이 gunN 넘게 나를 겨누면 공격 × gunHold(움직인다), 대부분 장전 중이면 × gunGo(일제 사격 직후의 틈)
 * 지표 (api.stats): 포위각, 동시 공격 몫(과녁에 닿는 공격 가운데 0.3 s 안에 다른 조의 공격이 같이 풀린 몫), 고립 처치 몫, 둘러싸인 시간(포위각 270° 넘게), 역할마다 시전·피해.
 *   사람·시전에 칸을 더하지 않는다: 상태는 세계마다 WeakMap */
const P = require('../../data/rules/squad.json'), SO = P.solo, CH = require('./chorus').api, DR = require('./drain').api;
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const isShield = s => !!((s.t === 'buff' && s.b && s.b.front) || s.t === 'wall' || s.t === 'build');
const ROLES = ['eye', 'bait', 'bind', 'strike', 'shield', 'reserve'];
const STATE = new WeakMap();
function newBoard() { return { on: false, t: -9, tgt: null, sx: 0, sy: 0, svx: 0, svy: 0, seenT: -9, base: 0, n0: 0, alive: 0, k: 0, scatter: -9, g0: 0, vAt: -9, vEnd: -9, threat: -1, thrT: -9, role: new Map(), team: new Map(), pt: new Map(), ang: [], log: { volleys: 0, regroups: 0, enc: 0, encN: 0 } }; }
function newStats() { return { retreat: -1, rel: [], hitN: 0, simN: 0, enc: 0, encN: 0, surT: 0, kills: 0, isoK: 0, role: {} }; }
function stOf(W) { let s = STATE.get(W); if (!s) STATE.set(W, s = { b: [newBoard(), newBoard()], solo: new Map(), stats: newStats(), last: -9 }); return s; }
// 둘레의 포위각: R 안의 점들(과녁에서 본 각)의 가장 넓은 틈을 360°에서 뺀다. [포위각, 틈 가운데의 각]
function encircle(X, cx, cy, pts) {
  const a = []; for (const q of pts) a.push(X.atan2(q.y - cy, q.x - cx)); if (a.length < 2) return [0, a.length ? a[0] + 3.1416 : 0];
  a.sort((x, y) => x - y); let gap = a[0] + 6.2832 - a[a.length - 1], mid = a[a.length - 1] + gap / 2;
  for (let i = 1; i < a.length; i++) { const g = a[i] - a[i - 1]; if (g > gap) { gap = g; mid = a[i - 1] + g / 2; } }
  return [6.2832 - gap, mid];
}
function sideOn(W, side) { for (const m of W.ms) if (m.side === side && m.hp > 0 && m.tac.squad) return true; return false; }
function bestRange(X, W, m, pick) { let R = 0; for (const n of m.book) { const s = W.spells[n]; if (s && OFF[s.t] && !s.mundane && (!pick || pick(s))) { const r = X.rangeOf(m, s); if (r > R) R = r; } } return R; }
// 공격 사거리의 가운데 값: 조원이 설 반지름 (가장 긴 하나에 맞추면 나머지 수가 닿지 않는다)
const RS = []; function midRange(X, W, m) { RS.length = 0; for (const n of m.book) { const s = W.spells[n]; if (s && OFF[s.t] && !s.mundane && s.t !== 'cone' && s.t !== 'touch') RS.push(X.rangeOf(m, s)); } if (!RS.length) return 10; RS.sort((a, c) => a - c); return RS[RS.length >> 1]; }
// 역할과 조를 다시 정한다
function assign(X, W, b, mem) {
  const t = b.tgt; b.role.clear(); b.team.clear();
  mem.sort((p, q) => X.atan2(p.y - t.y, p.x - t.x) - X.atan2(q.y - t.y, q.x - t.x));
  const n = mem.length, k = Math.max(1, Math.round(n / P.teamN)), full = k * 5; b.k = k; b.n0 = n; b.alive = n;
  for (let i = 0; i < n; i++) b.team.set(mem[i], Math.min(k - 1, Math.floor(i * k / n)));
  for (let j = 0; j < k; j++) {
    const tm = mem.filter(q => b.team.get(q) === j);
    let eye = null, eR = -1, bnd = null, bN = -1, sh = null;
    for (const q of tm) { const r = bestRange(X, W, q); if (r > eR) { eR = r; eye = q; } let c = 0, s0 = false; for (const nm of q.book) { const s = W.spells[nm]; if (!s) continue; if (isBind(s)) c++; if (isShield(s)) s0 = true; } if (q !== eye && c > bN) { bN = c; bnd = q; } if (s0 && q !== eye && !sh) sh = q; }
    for (const q of tm) b.role.set(q, q === eye ? 'eye' : q === bnd ? 'bind' : 'strike');
    if (tm.length >= 4 && sh && sh !== bnd) b.role.set(sh, 'shield');
    if (j === 0 && k >= 2) { const q = tm.find(x => b.role.get(x) === 'strike'); if (q) b.role.set(q, 'bait'); }
  }
  if (n > full) for (let i = full; i < n; i++) b.role.set(mem[i], 'reserve');
  let x = 0, y = 0; for (const q of mem) { x += q.x; y += q.y; } b.base = X.atan2(y / n - t.y, x / n - t.x);
  const D = k === 1 ? 0 : k <= 3 ? P.sep : 6.2832 / k; b.ang.length = 0; for (let j = 0; j < k; j++) b.ang.push(b.base + (j - (k - 1) / 2) * D);
}
function board(X, W, side) {
  const S = stOf(W), b = S.b[side], foes = W.foes[side];
  let tgt = null; for (const q of foes) if (q.hp > 0 && !q.flee && (!tgt || q.C > tgt.C)) tgt = q;
  const mem = []; for (const m of W.ms) if (m.side === side && m.hp > 0 && !m.flee) mem.push(m);
  const cs = mem.map(m => m.C).sort((a, c) => a - c), med = cs.length ? cs[cs.length >> 1] : 0;
  b.on = !!tgt && mem.length > 3 && tgt.C >= P.ratio * med; if (!b.on) return;
  if (b.tgt !== tgt || mem.length < b.alive || !b.k) { if (!b.k) b.g0 = mem.length; b.tgt = tgt; assign(X, W, b, mem); }
  b.alive = mem.length;
  for (const m of mem) if (X.hyp(m.x - tgt.x, m.y - tgt.y) < P.sight && !X.blocked(W, m.x, m.y, tgt.x, tgt.y, tgt.z > m.z ? tgt.z : m.z)) { b.sx = tgt.x; b.sy = tgt.y; b.svx = tgt.vx; b.svy = tgt.vy; b.seenT = W.t; break; }   // 눈: 시야가 이어진 누군가가 본다
  if (b.scatter < W.t && (b.g0 - b.alive) / b.g0 >= P.fallback) { b.scatter = W.t + P.regroup; b.k = 0; b.g0 = b.alive; b.log.regroups++; }   // 물러섬: 흩어졌다가 다시 모인다(역할을 다시)
  // 과녁의 시전이 노린 조 (망치와 모루)
  for (let j = 0; j < 2; j++) { const c = j ? tgt.castB : tgt.cast; if (c && c.tgt && c.tgt.side === side && b.team.has(c.tgt)) { b.threat = b.team.get(c.tgt); b.thrT = W.t + P.threatT; } }
  // 응수가 바닥났다: 일제 사격
  const down = tgt.st.stun > 0 || tgt.st.root > 0 || tgt.st.blind > 0 || tgt.fly === 2 || (tgt.cast && tgt.castB && !tgt.cast.auto && !tgt.castB.auto);
  if (down && W.t > b.vEnd) { b.vAt = W.t + P.lead; b.vEnd = b.vAt + P.sync; b.log.volleys++; }
  // 자리
  if (!b.k) return;
  const D = W.rules.domainR * tgt.C, turn = Math.floor(W.t / P.turn), act = b.k ? turn % b.k : 0;
  const tm = []; for (let j = 0; j < b.k; j++) tm.push(0);
  for (const m of mem) {
    const j = b.team.get(m); if (j === undefined) continue; const role = b.role.get(m);
    const R = role === 'eye' ? bestRange(X, W, m) : midRange(X, W, m), sing = W.rules.chorus && !teamSings(W, b, j), r0 = (sing ? D + CH.P.out : Math.min(D + P.out, R * 0.85)) + (role === 'eye' ? 8 : role === 'reserve' ? 15 : role === 'shield' ? -2 : 0) + (b.threat === j && W.t < b.thrT ? 6 : 0);
    const a = b.ang[j] + (j !== act ? P.rot * turn : P.rot * (turn - 1 > 0 ? turn - 1 : 0)), i = tm[j]++, off = (i - 1.5) * (W.rules.chorus ? CH.P.spread : P.spread) / (r0 > 1 ? r0 : 1);   // 합창하면 조원이 붙어 선다 (rules/chorus)
    const x = b.sx + X.cos(a + off) * r0, y = b.sy + X.sin(a + off) * r0;
    let p = b.pt.get(m); if (!p) b.pt.set(m, p = [0, 0]); p[0] = x; p[1] = y;
  }
  const [enc] = encircle(X, tgt.x, tgt.y, mem); b.log.enc += enc; b.log.encN++;
}
// 이 조가 합창을 맞췄나 (v2.28: 맞추기 전엔 과녁의 장악 반경 밖에서 모이고, 맞추면 나온다)
function teamSings(W, b, j) { for (const [q, t] of b.team) if (t === j && q.hp > 0 && CH.of(W, q)) return true; return false; }
function soloOn(W, m) { if (m.C < SO.cMin) return false; let n = 0; const f = W.foes[m.side]; for (let i = 0; i < f.length; i++) if (f[i].hp > 0 && !f[i].flee && ++n > SO.foes) return true; return false; }
// 지는 판인가: 체력·당·머리·둘레의 마름으로 (v2.28)
function losing(W, m) { const R = SO.retreat; if (!R) return false; let n = 0; for (const q of W.foes[m.side]) if (q.hp > 0 && !q.flee) n++; if (n < R.foes) return false;
  const dry = W.rules.drain ? DR.around(W, m.x, m.y) : 1, hp = m.hp / m.hpMax;
  return hp < R.hp || (hp < R.hpDry && dry < R.dry) || (m.glu < R.glu * m.gluMax && m.mlog.breath >= R.breaths) || (m.fat > R.fat && hp < R.hpDry); }
function loadedGuns(W, m) { let r = 0, a = 0; const f = W.foes[m.side]; for (const q of f) if (q.hp > 0 && !q.flee && q.book.includes('머스킷')) { const d = Math.sqrt((q.x - m.x) * (q.x - m.x) + (q.y - m.y) * (q.y - m.y)); if (d > SO.gunR) continue; a++; if (!((q.cd['머스킷'] || 0) > 1)) r++; } return [r, a]; }
module.exports = {
  name: 'squad', switch: 'squad', api: { P, stats: W => stOf(W), encircle, isBind, isShield, ROLES },
  engine: X => ({
    world(W) {
      const S = stOf(W), ev = Math.round(P.every / W.dt); if (W.step % ev) return;
      for (let side = 0; side < 2; side++) if (sideOn(W, side)) board(X, W, side);
      for (const m of W.ms) if (m.hp > 0 && soloOn(W, m)) {   // 개인의 포위각 (지표)
        const near = []; for (const q of W.foes[m.side]) if (q.hp > 0 && !q.flee && X.hyp(q.x - m.x, q.y - m.y) < SO.R) near.push(q);
        const [enc] = encircle(X, m.x, m.y, near); S.stats.enc += enc; S.stats.encN++; if (enc > 4.712) S.stats.surT += P.every;
      }
    },
    release(W, m, c) {   // 동시 공격·역할의 시전
      const S = STATE.get(W); if (!S) return; const b = S.b[m.side]; if (!b.on || !OFF[c.s.t] || c.tgt !== b.tgt) return;
      const j = b.team.get(m), r = b.role.get(m); if (j === undefined) return; const st = S.stats, rl = st.role[r] || (st.role[r] = { casts: 0, dmg: 0 }); rl.casts++;
      const at = W.t + (c.s.t === 'lob' ? 1 : 0); let sim = false; for (const e of st.rel) if (e[2] === m.side && e[1] !== j && Math.abs(e[0] - at) < P.sync) { sim = true; break; }
      st.hitN++; if (sim) st.simN++; st.rel.push([at, j, m.side]); if (st.rel.length > 64) st.rel.shift();
    },
    hurt(W, m, v, src) {
      const S = STATE.get(W); if (!S || !src) return; const b = S.b[src.side];
      if (b.on && m === b.tgt) { const r = b.role.get(src); if (r) { const rl = S.stats.role[r] || (S.stats.role[r] = { casts: 0, dmg: 0 }); rl.dmg += v; } }
      if (m.hp <= 0 && src.C >= SO.cMin && m.side !== src.side) { S.stats.kills++; let iso = true; for (const q of W.ms) if (q !== m && q.side === m.side && q.hp > 0 && Math.sqrt((q.x - m.x) * (q.x - m.x) + (q.y - m.y) * (q.y - m.y)) < SO.iso) { iso = false; break; } if (iso) S.stats.isoK++; }
    },
  }),
  brain: B => ({
    aim(W, m, K) {
      const S = STATE.get(W); if (!S) return;
      const b = S.b[m.side]; if (m.tac.squad && b.on && b.tgt && b.tgt.hp > 0) { K.e = b.tgt; return; }
      if (!soloOn(W, m)) return;
      if (!m.flee && losing(W, m)) { m.flee = 1; m.alog.fledT = W.t; S.stats.retreat = W.t; return; }   // 물러서기 (v2.28): 무리에게 지는 판이면 날아서 떠난다
      let e = null, bs = 1e9; for (const q of K.foes) { if (q.hp <= 0 || q.flee) continue; let sc = B.hyp(q.x - m.x, q.y - m.y), al = false;
        for (const o of W.ms) if (o !== q && o.side === q.side && o.hp > 0 && B.hyp(o.x - q.x, o.y - q.y) < SO.iso) { al = true; break; }
        if (!al) sc -= SO.isoB; if (W.rules.chorus && CH.of(W, q)) sc -= CH.P.aimB;   // 합창하는 무리를 먼저 (v2.27)
        for (const n of q.book) { const s = W.spells[n]; if (s && isBind(s) && s.t !== 'thread') { sc -= SO.bindB; break; } }
        if (sc < bs) { bs = sc; e = q; } }
      if (e) K.e = e;
    },
    steer(W, m, K) {
      if (K.dodge) return; const S = STATE.get(W); if (!S) return;
      const b = S.b[m.side];
      if (m.tac.squad && b.on) {
        const t = b.tgt; if (W.t < b.scatter) { const dx = m.x - t.x, dy = m.y - t.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * 2 - dy / l * m.sf; K.vy = dy / l * 2 + dx / l * m.sf; return; }
        const p = b.pt.get(m); if (!p) return; const dx = p[0] - m.x, dy = p[1] - m.y, l = B.hyp(dx, dy); if (l < 1) { K.vx = -K.uy * m.sf * 0.3; K.vy = K.ux * m.sf * 0.3; return; }
        const k = l > 3 ? 2 : l / 1.5; K.vx = dx / l * k; K.vy = dy / l * k;
        if (l > 3 && m.vx * m.vx + m.vy * m.vy < 0.5) { const sf = m.sf; K.vx = (dx - dy * sf * 1.5) / l * 2; K.vy = (dy + dx * sf * 1.5) / l * 2; }   // 막혔다(벽·바위): 옆으로 돌아간다
        return;
      }
      if (!soloOn(W, m)) return;
      const near = []; for (const q of K.foes) if (q.hp > 0 && !q.flee && B.hyp(q.x - m.x, q.y - m.y) < SO.R) near.push(q);
      const [enc, mid] = encircle(B.C, m.x, m.y, near); if (enc < SO.enc) return;
      K.vx += B.C.cos(mid) * SO.move; K.vy += B.C.sin(mid) * SO.move;   // 가장 넓은 틈으로: 적을 앞쪽 부채꼴에
    },
    // 값의 맨 끝(valueLate): 다른 기술이 값을 다시 세우지 않게 (벽 세우기·발판·덫은 앞의 기술이 값을 정한다)
    valueLate(W, m, K, o) {
      if (!(o.v > 0)) return; const S = STATE.get(W); if (!S) return; const s = o.s, b = S.b[m.side];
      if (m.tac.squad && b.on) {
        if (W.t < b.scatter) { if (OFF[s.t]) o.v *= P.w.scatter; else if (s.t === 'trap' || s.t === 'wall' || s.t === 'build') o.v = 0; return; }
        const role = b.role.get(m), j = b.team.get(m), t = b.tgt, act = b.k ? Math.floor(W.t / P.turn) % b.k : 0;
        if (isShield(s)) { if (b.threat === j && W.t < b.thrT && (role === 'shield' || role === 'bait')) o.v *= P.w.shield; else if (s.t !== 'buff') o.v = 0; return; }   // 벽은 노려진 조의 방패만 (제 벽에 갇히지 않게)
        if (!OFF[s.t]) { if (s.t === 'trap' || s.t === 'move') o.v = 0; return; }   // 나는 과녁에 덫은 헛수, 발판은 자리를 흩뜨린다
        const land = W.t + B.castTime(W, m, o.Tw);
        if (role === 'bind' && isBind(s)) o.v *= P.w.bind;
        if ((t.st.stun > 0 || t.st.root > 0) && (role === 'strike' || role === 'bait') && B.estDmg(s) >= 0.6 * B.deck(m, W.spells).offMax) o.v *= P.w.strike;   // 메이트
        if (land >= b.vAt && land <= b.vEnd) o.v *= P.w.volley; else if (j !== act && role !== 'bind') o.v *= P.w.off;
        return;
      }
      if (!soloOn(W, m) || !OFF[s.t]) return;
      const [r, a] = loadedGuns(W, m); if (!a) return;
      if (r >= SO.gunN && m.z < 2) o.v *= SO.gunHold; else if (a >= SO.gunN && r <= a * 0.25) o.v *= SO.gunGo;   // 일제 사격 직후의 장전 틈
    },
  }),
};
