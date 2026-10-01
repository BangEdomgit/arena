'use strict';
/* 숨 결투장 — 수읽기 2: 읽기 (v2.15, SPEC 39장, 수는 data/plan.json)
 * 내 수 → 상대의 가장 좋은 응수 → 내 다음 수 …를 깊이(내 수의 수)만큼. 줄인 상태(state.js)와 내 마법 표(후보)만 쓴다. 새 객체를 만들지 않는다(뜨거운 곳).
 *   내 수: 지금 쓸 수 있는 공격(실·투사체·지연 폭발·곡사)을 과녁에 바로(체크) 또는 지연 폭발·곡사를 상대가 피해 갈 곳에(덮기: 그 피할 곳을 터질 때까지 막는다)
 *   응수: 그 틀에 맞는 자원(앞 방패·막기·벽·옆 튀기·구르기·몸 털기)이 닿을 때 쓸 수 있거나, 움직여 비킬 수 있고(시간 안에 반경을 벗어남) 열린 피할 곳이 있으면.
 *     막기는 큰 수엔 응수가 아니다. 세워 둔 앞 방패는 실·투사체를 거저 막는다. 움직이거나 튀거나 구르면 덮어 둔 피할 곳이 풀린다(자리가 바뀌었다)
 *   응수 수마다 맞을 가망(hit: 앞선 값에서 시작해 판 중 내 수로 배운다)만큼 피해를 센다. 응수가 없고 맞을 가망이 hit.mate 넘으면 메이트.
 *   끝 자리의 값: 기대 피해 × dmg + 상대 자원이 잠긴 시간(최대 lockCap) × 무게 + 막힌 피할 곳
 *   상대의 고르기: 깊이 3까지는 가장 싼 응수(움직임 < 자원), 깊이 4(전설)는 상대도 읽는다고 본다(응수마다 끝까지 읽어 가장 나쁜 것)
 *   깊이 3 아래는 상대 자원을 세지 않는다(자원은 늘 있고 다시 쓸 때까지가 0) */
const ST = require('./state'), { P, FM } = ST;
const { C, hyp, castTime, estDmg } = require('../util');
const NK = 12, MAXD = 6, W_ = P.w, WR = new Float64Array([W_.roll, W_.cut, W_.guard, W_.shield, W_.wall, W_.shake]), MATE = W_.mate;
const CN = new Array(NK).fill(''), CT = new Float64Array(NK), TAU = new Float64Array(NK), CR = new Float64Array(NK), CDM = new Float64Array(NK), CBIG = new Uint8Array(NK), CMASK = new Int32Array(NK),
  CCOST = new Float64Array(NK), CCD = new Float64Array(NK), CCOV = new Uint8Array(NK), CSH = new Uint8Array(NK), CH = new Float64Array(NK), ORD = new Int32Array(NK), MYCD = new Float64Array(NK);
const PH = new Float64Array(8), AV = new Float64Array(6), CDR = new Float64Array(6), BLK = new Float64Array(9), GEO = new Float64Array(9), SBLK = new Float64Array(9 * MAXD);
let EXP = 0, NC = 0, HAS = 0, SH = 0, GLU = 0, DMG = 0, GK = 0.45, MM = false, SS = null, nodes = 0, CHK0 = false, ANS0 = 0, MATE0 = false;
const OUT = { k: -1, j: 0, v: 0, mate: false, line: false, check: false, ans: 0, nodes: 0 };   // mate: 첫 수가 메이트, line: 읽은 수순 끝에 메이트
function leaf(t) {
  let v = 0; for (let i = 0; i < 6; i++) if (HAS & (1 << i)) { const x = AV[i] - t; v += WR[i] * (x <= 0 ? 0 : x > W_.lockCap ? W_.lockCap : x); }
  for (let j = 0; j < 9; j++) if (BLK[j] > t && GEO[j] === 0) v += W_.slot;
  return v + W_.dmg * DMG;
}
const freeSlot = T => { for (let j = 1; j < 9; j++) if (BLK[j] <= T) return j; return 0; };
// 응수 i를 쓸 수 있나 (6은 움직임)
function can(i, k, T) {
  const tau = TAU[k], r = CR[k];
  if (i === 6) return ST.moveOK(SS, tau, r) && freeSlot(T) > 0;
  if (!(HAS & (1 << i)) || AV[i] > T) return false;
  if (i === 2) return !CBIG[k];
  if (i === 1) return ST.cutOK(SS, tau, r);
  if (i === 0) return ST.rollOK(SS, tau, r);
  return true;
}
function cost(i, k) { if (i === 6) return P.cost.move; const c = WR[i] * (CDR[i] > W_.lockCap ? W_.lockCap : CDR[i]); return i === 2 ? c + P.cost.guardDmg * CDM[k] / 30 : c; }
// 응수 i를 두고 읽기를 잇는다
function answer(i, k, t1, T, depth, ply) {
  const s0 = ply * 9; let a0 = 0, sh0 = SH, d0 = DMG, moved = i === 6 || i === 0 || i === 1;
  DMG += CDM[k] * EXP * (i === 2 ? GK : 1);   // 맞을 가망만큼의 피해 (막기면 줄어든다)
  if (i < 6) { a0 = AV[i]; AV[i] = T + CDR[i]; if (i === 3) SH = T + P.res.shieldUp; }
  if (moved) for (let j = 0; j < 9; j++) { SBLK[s0 + j] = BLK[j]; BLK[j] = GEO[j]; }   // 자리가 바뀌었다: 덮어 둔 곳이 풀린다
  const v = me(depth - 1, t1, ply + 1);
  if (moved) for (let j = 0; j < 9; j++) BLK[j] = SBLK[s0 + j];
  if (i < 6) AV[i] = a0; SH = sh0; DMG = d0;
  return v;
}
// 체크: 과녁에 바로. 상대의 응수를 고르고 잇는다
function direct(k, t1, T, depth, ply) {
  if (CSH[k] && SH >= T) return me(depth - 1, t1, ply + 1) - 0.1;   // 세운 방패가 거저 막는다
  const mask = CMASK[k]; let n = 0, bi = -1, bc = 1e9;
  for (let i = 0; i < 7; i++) { if (!(mask & (1 << i)) || !can(i, k, T)) continue; n++; const c = cost(i, k); if (c < bc) { bc = c; bi = i; } }
  if (ply === 0) ANS0 = n;
  const ph = PH[(CSH[k] ? 0 : 4) + (n > 3 ? 3 : n)];   // 응수가 n개일 때 맞을 가망 (배운 값)
  if (ply === 0) MATE0 = !n && ph >= P.hit.mate;
  if (!n && ph >= P.hit.mate) { if (ply === 0) CHK0 = true; return MATE - ply * 2 + W_.dmg * (DMG + CDM[k] * ph); }   // 메이트: 응수가 없고 거의 맞는다
  let v; EXP = ph;
  if (!n) { v = me(depth - 1, t1, ply + 1) + W_.dmg * CDM[k] * ph; if (ply === 0) CHK0 = true; return v; }   // 응수가 없지만 빗나갈 수 있다
  if (!MM) v = answer(bi, k, t1, T, depth, ply);
  else {   // 상대도 읽는다: 응수마다 끝까지 읽어 나에게 가장 나쁜 것
    v = 1e9; let tried = 0, bm = P.beam.them[ply] || 2;
    for (let i = 0; i < 7 && tried < bm; i++) { if (!(mask & (1 << i)) || !can(i, k, T)) continue; tried++; EXP = ph; const x = answer(i, k, t1, T, depth, ply); if (x < v) { v = x; bi = i; } }
  }
  if (ply === 0) CHK0 = bi !== 6;
  return v;
}
function me(depth, t, ply) {
  nodes++;
  if (depth === 0) return leaf(t);
  let best = -1e9, tried = 0; const bm = P.beam.me[ply] || 2;
  for (let q = 0; q < NC && tried < bm; q++) {
    const k = ORD[q]; if (MYCD[k] > t + 0.05 || GLU < CCOST[k]) continue; tried++;
    const t1 = t + (CT[k] > P.minGap ? CT[k] : P.minGap), T = t + TAU[k], cd0 = MYCD[k], g0 = GLU;
    MYCD[k] = t + CT[k] + CCD[k]; GLU -= CCOST[k];
    const v = direct(k, t1, T, depth, ply), c0 = CHK0, a0 = ANS0, m0 = MATE0;
    if (v > best) { best = v; if (ply === 0) { OUT.k = k; OUT.j = 0; OUT.v = v; OUT.check = c0; OUT.ans = a0; OUT.mate = m0; OUT.line = v >= MATE - 10; } }
    if (CCOV[k]) { const j = freeSlot(t); if (j > 0) { const b0 = BLK[j]; if (BLK[j] < T + 0.05) BLK[j] = T + 0.05; const v2 = me(depth - 1, t1, ply + 1); BLK[j] = b0; if (v2 > best) { best = v2; if (ply === 0) { OUT.k = k; OUT.j = j; OUT.v = v2; OUT.check = false; OUT.ans = 9; OUT.mate = false; OUT.line = v2 >= MATE - 10; } } } }   // 덮기: 피해 갈 곳을 막는다
    MYCD[k] = cd0; GLU = g0;
  }
  return tried ? best : leaf(t);
}
// 내 마법 표: 지금 과녁 e에게 닿는 공격마다 짓는 시간·닿는 때·덮는 반경·피해·큰 수·응수 비트·당·다시 쓸 때까지
function table(W, m, e, S) {
  const A = ST.ra(), pc = ST.paceOn(W, m) ? A.pace.P : null, d = hyp(e.x - m.x, e.y - m.y), tr = pc ? pc.track[m.tac.pace || 0] || 0 : 0, los = !C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z);
  NC = 0;
  for (const n of m.book) {
    if (NC >= NK) break; const s = W.spells[n]; if (!s) continue; const f = s.t; if (!(f === 'thread' || f === 'proj' || f === 'area' || f === 'lob')) continue;
    if (d > C.rangeOf(m, s) || ((f === 'thread' || f === 'proj') && !los)) continue;
    if (e.z >= 2 && ((f === 'area' && !s.vis) || f === 'lob')) continue;   // 떠 있는 과녁에 헛된 수
    const ct = castTime(W, m, s.cast), dm = estDmg(s);
    CN[NC] = n; CT[NC] = ct; TAU[NC] = ct + (f === 'thread' ? d / (32 * (s.fast || 1) * (pc ? pc.threadK : 1)) : f === 'proj' ? d / s.v : f === 'area' ? s.delay : s.flight);
    CR[NC] = f === 'area' || f === 'lob' ? (s.r || 1) * C.sizeOf(m, s) + 0.3 : Math.max(1, tr + 0.6);
    CDM[NC] = dm; CBIG[NC] = s.big || dm >= P.big.minDmg ? 1 : 0; CMASK[NC] = FM[f]; CCOST[NC] = s.cost; CCD[NC] = s.cd * (pc ? pc.cdK : 1);
    CCOV[NC] = (f === 'area' || f === 'lob') && !CBIG[NC] && !S.fly ? 1 : 0; CSH[NC] = f === 'thread' || f === 'proj' ? 1 : 0; MYCD[NC] = m.cd[n] > 0 ? m.cd[n] : 0;
    CH[NC] = dm / (TAU[NC] + 0.2); ORD[NC] = NC; NC++;
  }
  for (let i = 1; i < NC; i++) { const x = ORD[i]; let j = i - 1; while (j >= 0 && CH[ORD[j]] < CH[x]) { ORD[j + 1] = ORD[j]; j--; } ORD[j + 1] = x; }   // 빠르고 센 것부터
}
// 읽기: m이 과녁 e를 깊이 depth로. S는 e의 줄인 상태(이미 지은 것). 결과는 OUT (첫 수 k, 덮을 곳 j, 메이트·체크, 첫 수의 응수 수)
function read(W, m, e, S, depth, lt) {
  for (let i = 0; i < 8; i++) PH[i] = lt[8 + i] / lt[i];   // 배운 맞을 가망
  table(W, m, e, S); SS = S; nodes = 0; OUT.k = -1; OUT.j = 0; OUT.v = 0; OUT.mate = false; OUT.line = false; OUT.check = false; OUT.ans = 0;
  const count = depth >= 3; HAS = S.has; SH = S.shUp; GLU = m.glu; DMG = 0; GK = ST.paceOn(W, e) ? ST.ra().pace.P.guard.k : 1; MM = depth >= 4;
  for (let i = 0; i < 6; i++) { AV[i] = count ? S.av[i] : (HAS & (1 << i) ? 0 : Infinity); CDR[i] = count ? S.cd[i] : 0; }
  for (let j = 0; j < 9; j++) { BLK[j] = S.blk[j]; GEO[j] = S.geo[j]; }
  // 이미 짓고 있는 내 수가 먼저 닿는다: 상대가 가장 싼 응수를 쓴다고 보고 상태를 고친다 (자원을 셀 때만)
  if (count) for (let q = 0; q < 2; q++) { const c = q ? m.castB : m.cast; if (!c || c.auto || c.tgt !== e) continue; let k = -1; for (let i = 0; i < NC; i++) if (CN[i] === c.s.n) { k = i; break; } if (k < 0) continue; const T = c.T - c.t + (c.s.t === 'area' ? c.s.delay : 0); let bi = -1, bc = 1e9; for (let i = 0; i < 7; i++) { if (!(CMASK[k] & (1 << i)) || !can(i, k, T)) continue; const x = cost(i, k); if (x < bc) { bc = x; bi = i; } } if (bi >= 0 && bi < 6) { AV[bi] = T + CDR[bi]; if (bi === 3) SH = T + P.res.shieldUp; } }
  if (NC && depth > 0) me(depth, 0, 0);
  OUT.nodes = nodes; return OUT;
}
module.exports = { read, OUT, CN, TAU, CR };
