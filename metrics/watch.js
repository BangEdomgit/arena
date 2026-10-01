'use strict';
/* 숨 결투장 — 걸음마다 보는 모습 지표 (v2.6, SPEC 30장)
 * look(m, t)는 판이 끝난 기록만 본다. 시간의 몫(짓는 시간·동시 칸·빈틈)과 지은 벽의 자리는 걸음마다 봐야 해서 여기서 잰다.
 * 판을 돌리는 쪽이 stepWorld 뒤마다 watch(W)를 부르고, 끝나면 seen(W, m)으로 그 사람의 지표를 받는다. 판에는 닿지 않는다(읽기만, 사람 객체에 칸을 더하지 않는다).
 *   스스로 입은 피해: 받은 피해 − 적이 준 피해. 걸음마다 체력이 준 만큼만 센다(마지막 한 방의 넘친 몫은 빼고). 추락·소금·폭주(파도·역류)·그 밖(제 폭발·지대)으로 가른다
 *   짓는 시간: 과녁이 내 가장 긴 공격 사거리 안인 동안, 칸(첫 칸·두 번째 칸·뿜기·청사진 갈래) 하나라도 짓고 있는 시간의 몫. 두 칸 이상·세 칸 이상의 몫
 *   쓸모 있는 벽: 블록 가운데 막아 냈거나(맞아 깎였다, 또는 적의 실·투사체가 풀릴 때 선을 막았다) 두 사람 사이(선 뒤 0.5 s 넘게 두 사람을 잇는 선을 갈랐다. 둘 중 하나가 2 m 넘게 떠 있으면 벽은 가리지 않는다),
 *     엄폐 각(세운 순간 내 6 m 안, 적 쪽 35° 안, 내가 땅에, 적이 2 m 아래: 높이 뜬 적에겐 벽이 가리지 않는다), 퇴로(세운 순간 적 뒤 10 m 안, 선에서 5 m 안, 적이 땅에)인 몫
 *   빈틈 찌르기: 과녁의 빈틈(굳음·묶임·꺼짐·빈손·과열)이 열린 수 가운데, 열린 동안 내 공격을 시작했거나 풀었던 몫. 맞힌 몫: 열린 동안 내 피해가 들어갔다
 *   공격 명중률: 투사체·실·구름·곡사·몸·뿜기(함정·벽 밀기 빼고)의 맞힌 수 / 쏜 수. 방패 몫: 시전 가운데 앞 방패
 *   막힌 직사: 투사체·실이 풀릴 때 과녁과 사이가 막혀 있던 몫 (시작할 때 막혀 있던 몫도)
 *   벽에 의지한 싸움 (v2.9): 제 벽 곁(벽이 6 m 안, 적 쪽 45° 안이거나 적과의 선을 가름, 둘 다 2 m 아래)에 있는 시간의 몫, 그동안 풀린 공격의 몫(벽 뒤에서 쏜 몫), 제 벽이 막은 적 공격(풀린 실·투사체의 선을 가렸다, 투사체에 깎였다)의 수와 막은 실·투사체의 피해(그 판의 그 마법 한 방 평균)
 *   당 몫 평균·당 바닥(15 g 아래) 시간 몫·머리 75 넘은 시간 몫, 숨 쓴 수·마시다 맞은 수·숨 뒤 5 s 안의 공격과 명중률 (v2.11)
 *   리듬 단계·작전의 시간 몫(m.mlog.phase, m.op.log.time), 속임수(상대가 반응해 끊은 수) (v2.9)
 *   박자 (v2.14): 평균 속도(높이까지)·초당 방향 전환(45°)·초당 하는 일·초당 맞힘·초당 교환(판 전체), 막기(rules/pace) 켠 시간 몫·켜고 끈 수·감각 조준 수. 걸음 간격은 W.dt */
const C = require('../src/core'), { hyp } = require('../src/math');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1, topple: 1 }, DIRECT = { proj: 1, thread: 1 };
const newA = () => ({ t: 0, air: 0, inR: 0, busy: 0, two: 0, three: 0, opN: 0, opDid: 0, opLand: 0, opOn: false, opHit: false, opDm: 0, opL: false, dirN: 0, dirBlk: 0, relN: 0, relBlk: 0, rel: false, cov: false, atkN: 0, atkCov: 0, covT: 0, lowT: 0, blk: 0, blkN: 0, eR: -1, openT: 0, cutT: 0, thrX: 0, thrXHit: 0, hd0: 0, hpR: null, hpI: 0, spd: 0, hx: 0, hy: 0, turn: 0, act: 0, roll0: 0, rx0: 0, cut0: 0, gd0: 0, hit0: -1, hitT: -1, hitN: 0, tc: null, tb: null, tch: null, burst: 0, trapN: 0, trapHit: 0, gluS: 0, gluLow: 0, hot75: 0, h0: new Map(), pend: [], md: {}, mh: {}, mdmg: {}, lastMode: 'none', dm0: -1, covS: 0, bait: 0, baitHit: 0, pc: null, pb: null, R: -1, W: [], hp: -1, tk: {}, fd: 0, took: 0, foe: 0, by: { fall: 0, salt: 0, wave: 0 } });
const foeDealt = (W, m) => { let x = 0; for (const q of W.ms) if (q.side !== m.side) for (const k in q.log.dealt) x += q.log.dealt[k]; return x; };
// 받은 피해 (걸음마다, 남은 체력까지만: 마지막 한 방의 넘친 몫은 세지 않는다). 그 걸음의 기록 증가를 종류·적으로 나눠 체력이 준 만큼 줄여 담는다
function hurtStep(W, m, a) {
  const hp = m.hp > 0 ? m.hp : 0; if (a.hp < 0) { a.hp = hp; a.fd = foeDealt(W, m); for (const k in m.log.taken) a.tk[k] = m.log.taken[k]; return; }
  const dh = a.hp - hp; let tot = 0; const tk = m.log.taken; for (const k in tk) tot += tk[k] - (a.tk[k] || 0);
  const fd = foeDealt(W, m), foe = fd - a.fd;
  if (dh > 1e-9 && tot > 1e-9) { const f = Math.min(1, dh / tot); a.took += tot * f; a.foe += Math.min(foe, tot) * f; for (const k of ['fall', 'salt', 'wave']) a.by[k] += (tk[k] || 0) - (a.tk[k] || 0) > 0 ? ((tk[k] || 0) - (a.tk[k] || 0)) * f : 0; a.by.wave += (tk.backfire || 0) - (a.tk.backfire || 0) > 0 ? ((tk.backfire || 0) - (a.tk.backfire || 0)) * f : 0; }
  a.hp = hp; a.fd = fd; for (const k in tk) a.tk[k] = tk[k];
}
const dealtOf = m => { let x = 0; for (const k in m.log.dealt) x += m.log.dealt[k]; return x; };
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((cx - x1) * dx + (cy - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t; return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
const weak = (W, e) => e.st.stun > 0 || e.st.root > 0 || e.crash > 0 || e.emptyT > W.t || (e.fat > 92 && !e.wave);
function foeOf(W, m) { let e = null, bd = 1e9; for (const q of W.ms) { if (q.side === m.side || q.hp <= 0) continue; const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } } return e; }
// 직사가 맞힌 수 (벽을 가로지른 실이 맞았나를 보려고)
const dirHits = (W, m) => { let h = 0; for (const n in m.log.hits) { const s = W.spells[n]; if (s && DIRECT[s.t]) h += m.log.hits[n]; } return h; };
// 직사(실·곧게 나는 투사체)의 가장 긴 사거리
function dirR(W, m) { let r = 0; for (const n of m.book) { const s = W.spells[n]; if (!s || !DIRECT[s.t] || s.home) continue; const R = C.rangeOf(m, s); if (R > r) r = R; } return r; }
function maxR(W, m) { let r = 0; for (const n of m.book) { const s = W.spells[n]; if (!s || !OFF[s.t]) continue; const R = s.t === 'touch' ? 1.3 : s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.home ? 12 : C.rangeOf(m, s); if (R > r) r = R; } return r; }
// 벽 하나를 세운 순간의 자리: 2 엄폐 각(내 6 m 안, 적 쪽 35° 안, 내가 땅에) · 4 퇴로(적 뒤 10 m 안, 선에서 5 m 안, 적이 땅에). 1 두 사람 사이는 선 뒤 걸음마다 본다
function wallKind(m, e, w) {
  const dx = e.x - m.x, dy = e.y - m.y, L2 = dx * dx + dy * dy || 1, L = Math.sqrt(L2), t = ((w.x - m.x) * dx + (w.y - m.y) * dy) / L2, lat = Math.abs((w.x - m.x) * dy - (w.y - m.y) * dx) / L;
  let k = 0;
  const wm = hyp(w.x - m.x, w.y - m.y); if (m.z < 2 && e.z <= 2 && wm < 6 && wm > 0.1 && ((w.x - m.x) * dx + (w.y - m.y) * dy) / (wm * L) > 0.819) k |= 2;
  if (e.z < 2 && t > 1 && hyp(w.x - e.x, w.y - e.y) < 10 && lat < 5) k |= 4;
  return k;
}
// 박자 (v2.14, SPEC 38장): 빠르기(높이까지), 방향 전환(0.1 s마다 3 m/s 넘게 움직이는 쪽이 지난 방향에서 45° 넘게 돌았다), 하는 일(스스로 시작한 칸·뿜기, 구르기, 공중 피하기, 날기 끊기, 막기 켜고 끄기),
// 맞힌 수(마법의 명중이 는 걸음, 같은 사람의 0.2 s 안은 하나로: 판 전체의 합이 교환)
function tempo(W, m, a) {
  const v = C.hyp3(m.vx, m.vy, m.vz || 0); a.spd += v * W.dt;
  if (W.step % (3 * W.sk) === 0) { const h = hyp(m.vx, m.vy); if (h > 3) { const ux = m.vx / h, uy = m.vy / h; if (a.hx === 0 && a.hy === 0) { a.hx = ux; a.hy = uy; } else if (ux * a.hx + uy * a.hy < 0.707) { a.turn++; a.hx = ux; a.hy = uy; } } }
  let n = 0; if (m.cast && m.cast !== a.tc && !m.cast.auto) n++; if (m.castB && m.castB !== a.tb && !m.castB.auto) n++; if (m.chan && m.chan !== a.tch) n++; a.tc = m.cast; a.tb = m.castB; a.tch = m.chan;
  if (m.roll > a.roll0 + 0.1 && !(m.cast && m.cast.s.t === 'move')) n++; a.roll0 = m.roll;
  if (m.rx) { if (m.z >= 1 && m.rx.dodge > a.rx0) n += m.rx.dodge - a.rx0; a.rx0 = m.rx.dodge; }
  if (m.flog) { if (m.flog.cut > a.cut0) n += m.flog.cut - a.cut0; a.cut0 = m.flog.cut; }
  const gd = m.mlog.guardN || 0; if (gd > a.gd0) n += gd - a.gd0; a.gd0 = gd; a.act += n;
  let hs = 0; for (const k in m.log.hits) hs += m.log.hits[k]; if (a.hit0 >= 0 && hs > a.hit0 && W.t - a.hitT >= 0.2) { a.hitN++; a.hitT = W.t; } a.hit0 = hs;
}
function watch(W) {
  const A = W._wt || (W._wt = { by: new Map(), wall: new Map(), lastAct: 0, sil: 0, silMax: 0, low: -1, trap: new Map() });
  // 침묵 (v2.13): 아무도 짓지(칸·뿜기) 않는 동안. 2 s 넘는 침묵의 길이를 더하고 가장 긴 것을 적는다. 체력 30% 아래로 처음 떨어진 때
  { let act = false; for (const m of W.ms) if (m.hp > 0 && (m.cast || m.castB || m.chan)) { act = true; break; } const g = W.t - A.lastAct; if (act || W.ms.some(q => q.hp <= 0)) { if (g > 2) A.sil += g; if (g > A.silMax) A.silMax = g; A.lastAct = W.t; }
    if (A.low < 0) for (const m of W.ms) if (m.hp > 0 && m.hp < 0.3 * m.hpMax) { A.low = W.t; break; } }
  // 덫 (v2.13): 놓인 덫이 밟혀 터졌나(t.done) 걷혔나
  for (const t of W.traps) if (!A.trap.has(t)) A.trap.set(t, t);
  if (W.step % (15 * W.sk) === 0) for (const [t] of A.trap) if (!W.traps.includes(t)) { const a = A.by.get(t.src); if (a) { a.trapN++; if (t.done) a.trapHit++; } A.trap.delete(t); }
  for (const m of W.ms) {
    let a = A.by.get(m); if (!a) { a = newA(); A.by.set(m, a); }
    if (a.hp !== 0) hurtStep(W, m, a);
    { const r = a.hpR || (a.hpR = new Array(Math.round(1 / W.dt)).fill(m.hpMax)), h = m.hp > 0 ? m.hp : 0, old = r[a.hpI]; if (old - h > a.burst) a.burst = old - h; r[a.hpI] = h; a.hpI = (a.hpI + 1) % r.length; }   // 1 s 안에 잃은 가장 큰 체력 (v2.13)
    if (m.hp <= 0) continue;
    const e = foeOf(W, m); if (!e) continue;
    if (a.R < 0) a.R = maxR(W, m);
    a.t += W.dt; if (m.z >= 1) a.air += W.dt; a.gluS += m.glu / m.gluMax * W.dt; if (m.glu < 15) a.gluLow += W.dt; if (m.fat > 75) a.hot75 += W.dt;   // 당·머리 (v2.11)
    tempo(W, m, a);
    const d = hyp(e.x - m.x, e.y - m.y);
    // 칸: 첫 칸·두 번째 칸·뿜기·청사진 갈래
    let n = (m.cast ? 1 : 0) + (m.castB ? 1 : 0) + (m.chan ? 1 : 0); const bp = m.cast && m.cast.bp; if (bp && bp.lanes > 1) n += Math.max(0, Math.min(bp.lanes, bp.items.length - bp.built) - 1);   // 청사진은 첫 칸 하나에 갈래 여럿
    if (d < a.R) { a.inR += W.dt; if (n >= 1) a.busy += W.dt; if (n >= 2) a.two += W.dt; if (n >= 3) a.three += W.dt; }
    // 새로 시작한 수 (첫 칸·두 번째 칸)와 풀린 수
    let started = false, released = false;
    for (let j = 0; j < 2; j++) {
      const c = j ? m.castB : m.cast, p = j ? a.pb : a.pc;
      if (c && c !== p && OFF[c.s.t]) a.h0.set(c, m.log.hits[c.s.n] || 0);   // 시작할 때의 명중 수 (방식별 명중, v2.12)
      if (c && c !== p && OFF[c.s.t] && !c.auto) { started = true; if (DIRECT[c.s.t]) { a.dirN++; if (C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z)) a.dirBlk++; } }
      if (p && p !== c && OFF[p.s.t] && p.t >= p.T - W.dt * 1.5) { released = true; if (DIRECT[p.s.t] && !p.auto) { a.relN++; if ((m.z > e.z ? m.z : e.z) <= 2) for (const w of W.walls) if (w.mk === e.id && segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r)) { const o = A.by.get(e); if (o) { o.thrX++; if (dirHits(W, m) > a.hd0) o.thrXHit++; } break; } if (C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z)) { a.relBlk++; if ((m.z > e.z ? m.z : e.z) <= 2) for (const w of W.walls) { const r = A.wall.get(w); if (r && segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r)) { r.hit = true; if (r.m.side !== m.side) { const o = A.by.get(r.m), n = p.s.n, h = m.log.hits[n] || 0; o.blkN++; o.blk += h ? (m.log.dealt[n] || 0) / h : 0; } break; } } } } }   // 벽이 풀린 직사를 막았다
      if (p && p !== c && OFF[p.s.t] && p.t >= p.T - W.dt * 1.5) { a.lastMode = p.mode || (p.auto ? 'auto' : 'none'); if (p.mode) a.pend.push({ md: p.mode, n: p.s.n, h0: a.h0.get(p) || 0, t: W.t + 1.5, cov: p.cov, bait: !!p.bait }); }   // 풀린 수: 1.5 s 뒤 맞았나
      if (j) a.pb = c; else a.pc = c;
    }
    a.hd0 = dirHits(W, m);
    { const dm = dealtOf(m); if (a.dm0 >= 0 && dm > a.dm0) a.mdmg[a.lastMode] = (a.mdmg[a.lastMode] || 0) + dm - a.dm0; a.dm0 = dm; }   // 피해는 가장 최근에 풀린 수의 방식으로 (v2.12)
    while (a.pend.length && a.pend[0].t <= W.t) { const q = a.pend.shift(), hit = (m.log.hits[q.n] || 0) > q.h0; a.md[q.md] = (a.md[q.md] || 0) + 1; if (hit) a.mh[q.md] = (a.mh[q.md] || 0) + 1; if (q.md === 'cover') { a.covS += q.cov || 0; if (q.bait) { a.bait++; if (hit) a.baitHit++; } } }
    a.rel = released; a.cov = false; if (m.z < 2 && e.z <= 2) a.lowT += W.dt; if (released) a.atkN++;
    // 빈틈 찌르기
    const wk = weak(W, e);
    if (wk && !a.opOn) { a.opOn = true; a.opHit = false; a.opL = false; a.opDm = dealtOf(m); a.opN++; }
    if (a.opOn && (started || released) && !a.opHit) { a.opHit = true; a.opDid++; }
    if (a.opOn && !a.opL && dealtOf(m) > a.opDm + 0.5) { a.opL = true; a.opLand++; }
    if (!wk) a.opOn = false;
  }
  // 새 벽 (세운 사람이 적힌 것), 서 있는 벽이 두 사람 사이를 가르는 시간 (0.1 s마다, 높이를 넣어: 2 m 넘게 떠 있으면 벽은 가리지 않는다)
  const chk = W.step % (3 * W.sk) === 0;
  for (const w of W.walls) {
    let r = A.wall.get(w);
    if (r === undefined) {
      r = null; if (w.mk != null && w.mk >= 0) { const m = W.ms.find(q => q.id === w.mk), a = m && A.by.get(m), e = m && foeOf(W, m); if (a && e) { r = { m, k: wallKind(m, e, w), cut: 0, w, hp: w.hp, last: w.hp, hit: false }; a.W.push(r); } }
      A.wall.set(w, r);
    }
    if (r && !r.hit && w.hp < r.hp - 1e-9) r.hit = true;   // 맞아 깎였다: 투사체를 막아 냈다
    if (r && w.hp < r.last) { A.by.get(r.m).blkN++; r.last = w.hp; }   // 맞아 깎였다 (v2.9)
    if (r && r.m.hp > 0) { const a = A.by.get(r.m); if (!a.cov) { const m = r.m, e = foeOf(W, m); if (e && m.z < 2 && e.z <= 2) { const dx = e.x - m.x, dy = e.y - m.y, L = hyp(dx, dy) || 1, wx = w.x - m.x, wy = w.y - m.y, wm = hyp(wx, wy); if ((wm < 6 + w.r && wm > 0.1 && (wx * dx + wy * dy) / (wm * L) > 0.707) || segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r + 0.2)) a.cov = true; } } }   // 제 벽 곁 (v2.9)
    if (!r || !chk || r.m.hp <= 0) continue;
    const e = foeOf(W, r.m); if (e && (r.m.z > e.z ? r.m.z : e.z) <= 2 && segCircle(r.m.x, r.m.y, e.x, e.y, w.x, w.y, w.r + 0.2)) r.cut += 0.1;
  }
  for (const [m, a] of A.by) if (a.cov && m.hp > 0) { a.covT += W.dt; if (a.rel) a.atkCov++; }   // 제 벽 곁의 시간·쏜 수 (v2.9)
  // 벽이 없었다면 맞았을 피해 (v2.10): 0.1 s마다, 적의 직사(실·투사체) 사거리 안에서 선이 트인 시간과 제 벽이 선을 가른(바위는 아니고) 시간을 잰다
  if (chk) for (const [m, a] of A.by) {
    if (m.hp <= 0) continue; const e = foeOf(W, m); if (!e) continue; if (a.eR < 0) a.eR = dirR(W, e); const d = hyp(e.x - m.x, e.y - m.y); if (d > a.eR) continue;
    const z = m.z > e.z ? m.z : e.z; if (!C.blocked(W, e.x, e.y, m.x, m.y, z)) { a.openT += 0.1; continue; }
    if (z > 2) continue; let rock = false; for (const o of W.obs) if (segCircle(e.x, e.y, m.x, m.y, o.x, o.y, o.r)) { rock = true; break; } if (rock) continue;
    for (const w of W.walls) if (w.mk === m.id && segCircle(e.x, e.y, m.x, m.y, w.x, w.y, w.r)) { a.cutT += 0.1; break; }
  }
}
// 공격(투사체·실·구름·곡사·몸·뿜기, 함정·벽 밀기 빼고)의 명중률: 맞힌 수 / 쏜 수 (여럿으로 갈리는 마법도 한 번에 하나까지)
function atkHit(W, m) { const L = m.log; let c = 0, h = 0; for (const n in L.casts) { const s = W.spells[n]; if (!s || !OFF[s.t] || s.t === 'topple') continue; c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); } return c ? h / c : 0; }
// 시전 가운데 앞 방패(석회 방패 같은 몸의 막기)의 몫
function shieldShare(W, m) { const L = m.log; let c = 0, b = 0; for (const n in L.casts) { c += L.casts[n]; const s = W.spells[n]; if (s && s.t === 'buff' && s.b && s.b.front) b += L.casts[n]; } return c ? b / c : 0; }
// 벽이 없었다면 맞았을 피해 (v2.10): 적의 직사가 나에게 준 피해 / 선이 트인 시간 × 제 벽이 선을 가른 시간
function cf(W, m, a) { let dd = 0; for (const q of W.ms) if (q.side !== m.side) for (const n in q.log.dealt) { const s = W.spells[n]; if (s && DIRECT[s.t] && !s.home) dd += q.log.dealt[n]; } return a.openT > 0.5 ? dd / a.openT * a.cutT : 0; }
// 공격 방식 (v2.12): 방식별 시간·피해 몫, 확정타·덮기의 수와 명중(풀고 1.5 s 안에 그 마법의 명중이 늘었나), 갈 곳 덮은 비율, 구르기 빼낸 뒤 덮기, 큰 수의 확정 순간 몫
const MODES = { poke: '견제', sure: '확정타', cover: '덮기', big: '큰 한 방', throw: '던지기', repeat: '반복', none: '없음' };
function modeLook(m, a) {
  const o = {}, M = m.mlog.mode; if (!M) return o; let tt = 0, td = 0; for (const k in M.t) tt += M.t[k]; for (const k in a.mdmg) td += a.mdmg[k];
  for (const k in MODES) { o['방식 시간: ' + MODES[k]] = tt ? (M.t[k] || 0) / tt : 0; o['방식 피해: ' + MODES[k]] = td ? (a.mdmg[k] || 0) / td : 0; }
  o['확정타'] = a.md.sure || 0; o['확정타 명중률'] = a.md.sure ? (a.mh.sure || 0) / a.md.sure : 0;
  o['덮기'] = a.md.cover || 0; o['덮기 명중률'] = a.md.cover ? (a.mh.cover || 0) / a.md.cover : 0; o['덮기 갈 곳 덮은 비율'] = a.md.cover ? a.covS / a.md.cover : 0;
  o['견제'] = a.md.poke || 0; o['견제 명중률'] = a.md.poke ? (a.mh.poke || 0) / a.md.poke : 0;
  o['구르기 빼낸 뒤 덮기'] = a.bait; o['그중 맞힘'] = a.baitHit; o['큰 수의 확정 순간 몫'] = M.bigN ? M.bigSure / M.bigN : 0;
  return o;
}
// 침묵·결판 뒤·덫 (v2.13): 판 전체의 값(두 사람이 같다). 판이 끝날 때의 침묵도 넣는다. 덫은 판이 끝날 때 남은 것도 놓인 수에 (밟히지 않았다)
function silence(W, m, a) {
  const A = W._wt; if (!A) return {}; const g = W.t - A.lastAct, sil = A.sil + (g > 2 ? g : 0), mx = Math.max(A.silMax, g); let left = 0; for (const [t] of A.trap) if (t.src === m) left++;
  return { '1 s에 잃은 가장 큰 체력 몫': a.burst / m.hpMax, '2 s 넘는 침묵 몫': W.t ? sil / W.t : 0, '가장 긴 침묵 (s)': mx, '30% 아래 뒤 끝까지 (s)': A.low >= 0 && W.ms.some(q => q.hp <= 0) ? W.t - A.low : 0, '30% 아래로 떨어진 판': A.low >= 0 ? 1 : 0, '놓은 덫': a.trapN + left, '덫이 밟힌 몫': a.trapN + left ? a.trapHit / (a.trapN + left) : 0 };
}
// 교환 (v2.14): 판 전체에서 맞힌 수의 합 (두 사람이 같다)
function exch(W) { let x = 0; if (W._wt) for (const [, a] of W._wt.by) x += a.hitN; return x; }
// 판이 끝난 뒤: 그 사람의 지표
function seen(W, m) {
  const a = (W._wt && W._wt.by.get(m)) || newA(), L = m.log, took = a.took, foe = a.foe;
  let nw = 0, use = 0, bt = 0, cv = 0, rt = 0; let hb = 0; for (const r of a.W) { nw++; const k = r.k | (r.cut >= 0.5 ? 1 : 0) | (r.hit ? 8 : 0); if (k & 1) bt++; if (k & 2) cv++; if (k & 4) rt++; if (k & 8) hb++; if (k) use++; }   // 사이: 선 뒤 0.5 s 넘게 두 사람 사이를 갈랐다
  const fall = a.by.fall, salt = a.by.salt, wave = a.by.wave, self = Math.max(0, took - foe), other = Math.max(0, self - fall - salt - wave);
  const ph = m.mlog.phase, op = Object.assign({}, m.op && m.op.log && m.op.log.time); if (m.op && m.op.cur && m.op.st) op[m.op.cur] = (op[m.op.cur] || 0) + W.t - m.op.t0;   // 판이 끝날 때 하던 작전도 (끝내기는 대개 판 끝까지 간다)
  let pt = 0, ot = 0; for (const k in ph) pt += ph[k]; for (const k in op) ot += op[k];
  const o = {
    '받은 피해': took, '스스로 입은 몫': took ? self / took : 0, '추락 몫': took ? fall / took : 0, '소금 몫': took ? salt / took : 0, '폭주 몫': took ? wave / took : 0, '제 폭발 몫': took ? other / took : 0,
    '나는 시간 몫': a.t ? a.air / a.t : 0, '사거리 안 짓는 몫': a.inR ? a.busy / a.inR : 0, '사거리 안 두 칸 몫': a.inR ? a.two / a.inR : 0, '사거리 안 세 칸 몫': a.inR ? a.three / a.inR : 0,
    '세운 벽': nw, '쓸모 있는 벽 몫': nw ? use / nw : 0, '두 사람 사이 벽': bt, '엄폐 각 벽': cv, '퇴로 벽': rt, '막아 낸 벽': hb,
    '쓰러뜨림으로 끝남': W.ms.some(q => q.hp <= 0) ? 1 : 0, '판 길이 (s)': W.t, '공격 시전': L.dec.atk, '공격 명중률': atkHit(W, m), '방패 몫': shieldShare(W, m),
    '빈틈': a.opN, '빈틈 찌른 몫': a.opN ? a.opDid / a.opN : 0, '빈틈에 맞힌 몫': a.opN ? a.opLand / a.opN : 0, '폭주': L.over, '막힌 직사 몫': a.relN ? a.relBlk / a.relN : 0, '막힌 채 시작한 직사 몫': a.dirN ? a.dirBlk / a.dirN : 0,
    '짓지 않는 몫': a.inR ? 1 - a.busy / a.inR : 0, '떠보기 몫': pt ? (ph.probe || 0) / pt : 0, '들어가기 몫': pt ? (ph.in || 0) / pt : 0, '빠지기 몫': pt ? (ph.out || 0) / pt : 0,
    '압박 몫': ot ? (op.press || 0) / ot : 0, '끝내기 몫': ot ? (op.finish || 0) / ot : 0, '소모 몫': ot ? (op.attrit || 0) / ot : 0, '몰이 몫': ot ? (op.herd || 0) / ot : 0, '진지 몫': ot ? (op.fort || 0) / ot : 0, '속임수': L.dec.feint || 0,
    '제 벽 곁 몫': a.lowT ? a.covT / a.lowT : 0, '벽 뒤에서 쏜 몫': a.atkN ? a.atkCov / a.atkN : 0, '벽이 막은 적 공격': a.blkN, '벽이 막은 피해': a.blk, '벽이 없었다면 맞았을 피해': cf(W, m, a), '당 몫 평균': a.t ? a.gluS / a.t : 0, '당 바닥 시간 몫': a.t ? a.gluLow / a.t : 0, '머리 75 넘은 시간 몫': a.t ? a.hot75 / a.t : 0, '숨': m.mlog.breath || 0, '숨 마시다 맞은 수': m.mlog.breathHit || 0, '숨 뒤 공격': m.mlog.breathAtk || 0, '숨 뒤 명중률': m.mlog.breathAtk ? m.mlog.breathAtkHit / m.mlog.breathAtk : 0, ...modeLook(m, a), ...silence(W, m, a), '평균 속도 (m/s)': a.t ? a.spd / a.t : 0, '초당 방향 전환': a.t ? a.turn / a.t : 0, '초당 하는 일': a.t ? a.act / a.t : 0, '초당 맞힘': a.t ? a.hitN / a.t : 0, '초당 교환': W.t ? exch(W) / W.t : 0, '막기 켠 시간 몫': a.t ? (m.mlog.guardT || 0) / a.t : 0, '막기': m.mlog.guardN || 0, '감각 조준': m.mlog.trackN || 0, '벽을 가로지른 적 직사': a.thrX, '그중 맞은 몫': a.thrX ? a.thrXHit / a.thrX : 0,
  };
  return o;
}
// 마법별 시전·명중·준 피해 (명중은 시전보다 많을 수 없다: 갈래 돌 같은 여럿은 1로)
function spells(m) { const L = m.log, o = {}; let dm = 0; for (const n in L.dealt) dm += L.dealt[n]; for (const n in L.casts) o[n] = { casts: L.casts[n], hit: Math.min(1, (L.hits[n] || 0) / L.casts[n]), dmgShare: dm ? (L.dealt[n] || 0) / dm : 0 }; return o; }
module.exports = { watch, seen, spells, weak };
