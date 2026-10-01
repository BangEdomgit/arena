'use strict';
/* 숨 결투장 — 수읽기 1: 줄인 상태 (v2.15, SPEC 39장, 수는 data/plan.json)
 * 막는 사람(d) 하나를 치는 사람(a)의 눈으로 줄인다. 새 객체는 사람마다 한 번만 만들고 다시 쓴다(속도).
 *   자원 여섯 (차례가 비트): 0 구르기(땅) · 1 옆 튀기(날기 끊기) · 2 막기(순간 켜기, rules/pace) · 3 방패(앞 방패 마법, 서클 셋부터는 자동 진으로 바로) · 4 벽(벽·흙벽 마법) · 5 몸 털기(풀기, rules/response)
 *     av: 지금부터 몇 s 뒤에 쓸 수 있나(없으면 Infinity), cd: 쓰면 다시 쓸 때까지, has: 가진 것의 비트, shUp: 세운 앞 방패가 남은 시간
 *   피할 곳 아홉: 0 제자리, 1~8 치는 사람 쪽에서 본 옆(±90°)·비스듬히(±45°·±135°)·뒤·앞으로 slotD m. blk: 몇 s 뒤까지 막혔나(0 열림, Infinity 늘 막힘)
 *     늘 막힘: 싸움터 끝·소금 원 밖·바위·벽(낮을 때)·치는 사람의 덫(땅). 그때까지 막힘: 치는 사람의 지연 폭발(터질 때까지)
 *   움직임: 날면 옆 가속 a(끊는 움직임·빠른 판의 꺾기, rules/flight의 aF), 땅이면 걷는 빠르기 walkV */
const P = require('../../../data/plan.json');
const { C, hyp, castTime } = require('../util');
const RES = ['roll', 'cut', 'guard', 'shield', 'wall', 'shake'], RI = { roll: 0, cut: 1, guard: 2, shield: 3, wall: 4, shake: 5, move: 6 }, MOVE = 6;
const FM = {}; for (const f in P.form) { let b = 0; for (const k of P.form[f]) b |= 1 << RI[k]; FM[f] = b; }   // 틀마다 응수의 비트
const R2 = Math.SQRT1_2, OX = [0, 0, 0, R2, R2, -R2, -R2, 1, -1], OY = [0, 1, -1, R2, -R2, R2, -R2, 0, 0];   // 피할 곳의 방향 (치는 사람 → 막는 사람 축에서): 제자리·옆·옆·비스듬히 앞뒤·뒤·앞
const G = 9.8;
let RA = null;   // 규칙의 api (처음 부를 때 읽는다: 엔진이 규칙을 읽을 때 두뇌는 아직 없다)
function ra() { if (!RA) { const f = n => { const r = C.RULES.find(x => x.name === n); return r ? r.api : null; }; RA = { fl: f('flight'), pace: f('pace'), resp: f('response'), sr: f('saltRing') }; } return RA; }
function newSide() { return { av: new Float64Array(6), cd: new Float64Array(6), has: 0, shUp: 0, blk: new Float64Array(9), geo: new Float64Array(9), bx: new Float64Array(9), by: new Float64Array(9), a: 0, up: 0, fly: false, walkV: 6, shN: '', wlN: '', ux: 1, uy: 0, x: 0, y: 0 }; }
const paceOn = (W, q) => { const p = ra().pace; return !!(W.rules.pace && p && q.C >= p.P.cMin); };
// 앞 방패·벽 마법 (책마다 한 번)
function bookOf(W, d, S) {
  S.shN = ''; S.wlN = '';
  for (const n of d.book) { const s = W.spells[n]; if (!s) continue; if (!S.shN && s.t === 'buff' && s.b && s.b.front && s.react) S.shN = n; if (!S.wlN && (s.t === 'wall' || s.t === 'build')) S.wlN = n; }
}
// 막는 사람 d의 줄인 상태 (치는 사람 a의 눈). h: 피할 곳을 볼 앞날(s)
function build(W, d, a, S, h) {
  const A = ra(), av = S.av, cd = S.cd; let has = 0;
  bookOf(W, d, S);
  for (let i = 0; i < 6; i++) { av[i] = Infinity; cd[i] = 0; }
  const fly = d.z >= 1 && d.fly === 1, lock = Math.max(d.st.stun, d.st.root, d.fly === 2 ? P.fallT : 0);   // 굳음·묶임·떨어짐이 풀릴 때까지는 몸을 못 쓴다
  // 0 구르기: 땅에 서 있고 기력이 있으면
  if (!fly && d.fly !== 3 && d.stam > 1.5) { av[0] = Math.max(d.rollCd, lock, 0); cd[0] = P.res.roll.cd; has |= 1; }
  // 1 옆 튀기: 날기 끊기를 쓰는 사람이 날 때
  if (fly && W.rules.flightCut && (d.tac.flyCut || 0) >= 2) { av[1] = Math.max(d.cut.cd, lock, 0); cd[1] = A.fl.F.cut.cd; has |= 2; }
  // 2 막기: 빠른 판의 대마법사(판단 수준 pace), 당이 있으면
  if (paceOn(W, d) && d.tac.pace && d.glu > A.pace.P.guard.gluMin + 3) { const g = A.pace.P.guard; av[2] = d.st.guard > 0 ? 0 : Math.max(0, d.mlog.gdOff + g.cd - W.t); cd[2] = g.cd + g.min; has |= 4; }
  // 3 앞 방패: 마법의 간격, 서클 셋부터는 자동 진(간격 autoCd)이 바로 세운다. 아니면 빈 칸이 있어야
  if (S.shN) { const s = W.spells[S.shN]; let t = d.cd[S.shN] > 0 ? d.cd[S.shN] : 0; if (d.circles >= 3) { if (d.autoCd > t) t = d.autoCd; } else { if (d.cast && d.castB) t = Math.max(t, d.cast.T - d.cast.t); t += castTime(W, d, s.cast); } av[3] = t; cd[3] = s.cd; has |= 8; }
  S.shUp = d.buf.front ? d.buf.front.t : 0;
  // 4 벽: 마법의 간격 + 짓는 시간
  if (S.wlN) { const s = W.spells[S.wlN]; av[4] = (d.cd[S.wlN] > 0 ? d.cd[S.wlN] : 0) + castTime(W, d, s.cast); cd[4] = s.cd; has |= 16; }
  // 5 몸 털기: 대응 규칙의 풀기를 여는 판단 수준
  if (W.rules.response && A.resp && A.resp.levelOf(d).unbind) { av[5] = Math.max(0, d.unbindCd - W.t); cd[5] = A.resp.P.unbind.cd; has |= 32; }
  S.has = has; S.fly = fly;
  // 움직임
  const canF = fly || (W.rules.flight && A.fl.canFly(d));   // 땅에 있어도 뜰 수 있으면 날아 비킨다 (뜨는 데 takeoff s)
  S.a = canF ? Math.max(A.fl.F.latG * G, W.rules.snap && d.tac.footwork >= 2 ? A.fl.aF(W, d) : 0) : 0; S.up = Math.max(fly ? 0 : P.takeoff, lock);
  S.walkV = P.walkV * (paceOn(W, d) ? A.pace.P.run : 1);
  // 피할 곳
  const dx = d.x - a.x, dy = d.y - a.y, l = hyp(dx, dy) || 1, ux = dx / l, uy = dy / l, cx = d.x + d.vx * h * 0.5, cy = d.y + d.vy * h * 0.5, D = P.slotD;
  S.ux = ux; S.uy = uy; S.x = cx; S.y = cy;
  const blk = S.blk, geo = S.geo, low = d.z < 2;
  for (let j = 0; j < 9; j++) {
    const x = cx + (ux * OX[j] - uy * OY[j]) * D * (j ? 1 : 0), y = cy + (uy * OX[j] + ux * OY[j]) * D * (j ? 1 : 0); S.bx[j] = x; S.by[j] = y;
    let g = 0;
    if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1) g = Infinity;
    else if (W.rules.saltRing && A.sr && A.sr.outSalt(W, x, y)) g = Infinity;
    else if (low) {
      for (const o of W.obs) if (hyp(o.x - x, o.y - y) < o.r + 0.6) { g = Infinity; break; }
      if (g === 0 && W.walls.length) { const q = C.wallsIn(W, x - 1.5, y - 1.5, x + 1.5, y + 1.5); for (let i = 0; i < q.length; i++) { const w = W.walls[q[i]]; if (hyp(w.x - x, w.y - y) < w.r + 0.6) { g = Infinity; break; } } }
      if (g === 0 && !fly) for (const t of W.traps) if (t.src.side === a.side && !t.done && t.seen.has(d.id) && hyp(t.x - x, t.y - y) < (t.r || 1) + 0.6) { g = Infinity; break; }
    }
    geo[j] = g; let b = g;
    if (!fly) for (const ar of W.areas) if (ar.src.side === a.side && ar.t > b && hyp(ar.x - x, ar.y - y) < ar.r + 0.3) b = ar.t;   // 터질 때까지
    blk[j] = b;
  }
  return S;
}
// 움직여서 τ s 안에 r m를 비킬 수 있나: 날면 ½·a·τ², 땅이면 걸음. 옆 튀기는 a + 5 g, 구르기는 roll.disp
function moveOK(S, tau, r) { const t = tau - S.up; return t > 0 && ((S.a > 0 && 0.5 * S.a * t * t >= r) || S.walkV * t * 0.7 >= r); }
function cutOK(S, tau, r) { return 0.5 * (S.a + P.res.cut.g * G) * tau * tau >= r; }
function rollOK(S, tau, r) { return tau >= 0.08 && P.res.roll.disp >= r; }
// 지금의 방어 여유: within s 안에 쓸 수 있는 자원 수 + (열린 피할 곳이 있고 움직일 수 있으면 1). 지표·그물 판단
function slack(S, within) {
  let n = 0; for (let i = 0; i < 6; i++) if (S.has & (1 << i) && S.av[i] <= within) n++;
  for (let j = 1; j < 9; j++) if (S.blk[j] <= within && moveOK(S, within + 0.25, 1.5)) { n++; break; }
  return n;
}
module.exports = { P, RES, RI, MOVE, FM, OX, OY, ra, newSide, build, moveOK, cutOK, rollOK, slack, paceOn };
