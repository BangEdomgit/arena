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
 *   막힌 직사: 투사체·실이 풀릴 때 과녁과 사이가 막혀 있던 몫 (시작할 때 막혀 있던 몫도) */
const C = require('../src/core'), { hyp } = require('../src/math');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1, topple: 1 }, DIRECT = { proj: 1, thread: 1 };
const newA = () => ({ t: 0, air: 0, inR: 0, busy: 0, two: 0, three: 0, opN: 0, opDid: 0, opLand: 0, opOn: false, opHit: false, opDm: 0, opL: false, dirN: 0, dirBlk: 0, relN: 0, relBlk: 0, pc: null, pb: null, R: -1, W: [], hp: -1, tk: {}, fd: 0, took: 0, foe: 0, by: { fall: 0, salt: 0, wave: 0 } });
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
function maxR(W, m) { let r = 0; for (const n of m.book) { const s = W.spells[n]; if (!s || !OFF[s.t]) continue; const R = s.t === 'touch' ? 1.3 : s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.home ? 12 : C.rangeOf(m, s); if (R > r) r = R; } return r; }
// 벽 하나를 세운 순간의 자리: 2 엄폐 각(내 6 m 안, 적 쪽 35° 안, 내가 땅에) · 4 퇴로(적 뒤 10 m 안, 선에서 5 m 안, 적이 땅에). 1 두 사람 사이는 선 뒤 걸음마다 본다
function wallKind(m, e, w) {
  const dx = e.x - m.x, dy = e.y - m.y, L2 = dx * dx + dy * dy || 1, L = Math.sqrt(L2), t = ((w.x - m.x) * dx + (w.y - m.y) * dy) / L2, lat = Math.abs((w.x - m.x) * dy - (w.y - m.y) * dx) / L;
  let k = 0;
  const wm = hyp(w.x - m.x, w.y - m.y); if (m.z < 2 && e.z <= 2 && wm < 6 && wm > 0.1 && ((w.x - m.x) * dx + (w.y - m.y) * dy) / (wm * L) > 0.819) k |= 2;
  if (e.z < 2 && t > 1 && hyp(w.x - e.x, w.y - e.y) < 10 && lat < 5) k |= 4;
  return k;
}
function watch(W) {
  const A = W._wt || (W._wt = { by: new Map(), wall: new Map() });
  for (const m of W.ms) {
    let a = A.by.get(m); if (!a) { a = newA(); A.by.set(m, a); }
    if (a.hp !== 0) hurtStep(W, m, a);
    if (m.hp <= 0) continue;
    const e = foeOf(W, m); if (!e) continue;
    if (a.R < 0) a.R = maxR(W, m);
    a.t += C.DT; if (m.z >= 1) a.air += C.DT;
    const d = hyp(e.x - m.x, e.y - m.y);
    // 칸: 첫 칸·두 번째 칸·뿜기·청사진 갈래
    let n = (m.cast ? 1 : 0) + (m.castB ? 1 : 0) + (m.chan ? 1 : 0); const bp = m.cast && m.cast.bp; if (bp && bp.lanes > 1) n += Math.max(0, Math.min(bp.lanes, bp.items.length - bp.built) - 1);   // 청사진은 첫 칸 하나에 갈래 여럿
    if (d < a.R) { a.inR += C.DT; if (n >= 1) a.busy += C.DT; if (n >= 2) a.two += C.DT; if (n >= 3) a.three += C.DT; }
    // 새로 시작한 수 (첫 칸·두 번째 칸)와 풀린 수
    let started = false, released = false;
    for (let j = 0; j < 2; j++) {
      const c = j ? m.castB : m.cast, p = j ? a.pb : a.pc;
      if (c && c !== p && OFF[c.s.t] && !c.auto) { started = true; if (DIRECT[c.s.t]) { a.dirN++; if (C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z)) a.dirBlk++; } }
      if (p && p !== c && OFF[p.s.t] && p.t >= p.T - C.DT * 1.5) { released = true; if (DIRECT[p.s.t] && !p.auto) { a.relN++; if (C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z)) { a.relBlk++; if ((m.z > e.z ? m.z : e.z) <= 2) for (const w of W.walls) { const r = A.wall.get(w); if (r && !r.hit && segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r)) r.hit = true; } } } }   // 벽이 풀린 직사를 막았다
      if (j) a.pb = c; else a.pc = c;
    }
    // 빈틈 찌르기
    const wk = weak(W, e);
    if (wk && !a.opOn) { a.opOn = true; a.opHit = false; a.opL = false; a.opDm = dealtOf(m); a.opN++; }
    if (a.opOn && (started || released) && !a.opHit) { a.opHit = true; a.opDid++; }
    if (a.opOn && !a.opL && dealtOf(m) > a.opDm + 0.5) { a.opL = true; a.opLand++; }
    if (!wk) a.opOn = false;
  }
  // 새 벽 (세운 사람이 적힌 것), 서 있는 벽이 두 사람 사이를 가르는 시간 (0.1 s마다, 높이를 넣어: 2 m 넘게 떠 있으면 벽은 가리지 않는다)
  const chk = W.step % 3 === 0;
  for (const w of W.walls) {
    let r = A.wall.get(w);
    if (r === undefined) {
      r = null; if (w.mk != null && w.mk >= 0) { const m = W.ms.find(q => q.id === w.mk), a = m && A.by.get(m), e = m && foeOf(W, m); if (a && e) { r = { m, k: wallKind(m, e, w), cut: 0, w, hp: w.hp, hit: false }; a.W.push(r); } }
      A.wall.set(w, r);
    }
    if (r && !r.hit && w.hp < r.hp - 1e-9) r.hit = true;   // 맞아 깎였다: 투사체를 막아 냈다
    if (!r || !chk || r.m.hp <= 0) continue;
    const e = foeOf(W, r.m); if (e && (r.m.z > e.z ? r.m.z : e.z) <= 2 && segCircle(r.m.x, r.m.y, e.x, e.y, w.x, w.y, w.r + 0.2)) r.cut += 0.1;
  }
}
// 공격(투사체·실·구름·곡사·몸·뿜기, 함정·벽 밀기 빼고)의 명중률: 맞힌 수 / 쏜 수 (여럿으로 갈리는 마법도 한 번에 하나까지)
function atkHit(W, m) { const L = m.log; let c = 0, h = 0; for (const n in L.casts) { const s = W.spells[n]; if (!s || !OFF[s.t] || s.t === 'topple') continue; c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); } return c ? h / c : 0; }
// 시전 가운데 앞 방패(석회 방패 같은 몸의 막기)의 몫
function shieldShare(W, m) { const L = m.log; let c = 0, b = 0; for (const n in L.casts) { c += L.casts[n]; const s = W.spells[n]; if (s && s.t === 'buff' && s.b && s.b.front) b += L.casts[n]; } return c ? b / c : 0; }
// 판이 끝난 뒤: 그 사람의 지표
function seen(W, m) {
  const a = (W._wt && W._wt.by.get(m)) || newA(), L = m.log, took = a.took, foe = a.foe;
  let nw = 0, use = 0, bt = 0, cv = 0, rt = 0; let hb = 0; for (const r of a.W) { nw++; const k = r.k | (r.cut >= 0.5 ? 1 : 0) | (r.hit ? 8 : 0); if (k & 1) bt++; if (k & 2) cv++; if (k & 4) rt++; if (k & 8) hb++; if (k) use++; }   // 사이: 선 뒤 0.5 s 넘게 두 사람 사이를 갈랐다
  const fall = a.by.fall, salt = a.by.salt, wave = a.by.wave, self = Math.max(0, took - foe), other = Math.max(0, self - fall - salt - wave);
  const o = {
    '받은 피해': took, '스스로 입은 몫': took ? self / took : 0, '추락 몫': took ? fall / took : 0, '소금 몫': took ? salt / took : 0, '폭주 몫': took ? wave / took : 0, '제 폭발 몫': took ? other / took : 0,
    '나는 시간 몫': a.t ? a.air / a.t : 0, '사거리 안 짓는 몫': a.inR ? a.busy / a.inR : 0, '사거리 안 두 칸 몫': a.inR ? a.two / a.inR : 0, '사거리 안 세 칸 몫': a.inR ? a.three / a.inR : 0,
    '세운 벽': nw, '쓸모 있는 벽 몫': nw ? use / nw : 0, '두 사람 사이 벽': bt, '엄폐 각 벽': cv, '퇴로 벽': rt, '막아 낸 벽': hb,
    '쓰러뜨림으로 끝남': W.ms.some(q => q.hp <= 0) ? 1 : 0, '판 길이 (s)': W.t, '공격 시전': L.dec.atk, '공격 명중률': atkHit(W, m), '방패 몫': shieldShare(W, m),
    '빈틈': a.opN, '빈틈 찌른 몫': a.opN ? a.opDid / a.opN : 0, '빈틈에 맞힌 몫': a.opN ? a.opLand / a.opN : 0, '폭주': L.over, '막힌 직사 몫': a.relN ? a.relBlk / a.relN : 0, '막힌 채 시작한 직사 몫': a.dirN ? a.dirBlk / a.dirN : 0,
  };
  return o;
}
// 마법별 시전·명중·준 피해 (명중은 시전보다 많을 수 없다: 갈래 돌 같은 여럿은 1로)
function spells(m) { const L = m.log, o = {}; let dm = 0; for (const n in L.dealt) dm += L.dealt[n]; for (const n in L.casts) o[n] = { casts: L.casts[n], hit: Math.min(1, (L.hits[n] || 0) / L.casts[n]), dmgShare: dm ? (L.dealt[n] || 0) / dm : 0 }; return o; }
module.exports = { watch, seen, spells, weak };
