'use strict';
/* 숨 결투장 — 수읽기 (v2.15, SPEC 39장, 수는 data/plan.json·data/joseki.json)
 * 대마법사 결투를 체스처럼: 둘 다 빠르고 서로의 잔기술을 아니까 한 방으론 안 잡힌다. 체크(응수를 강요하는 수)로 상대의 방어 자원과 피할 곳을 하나씩 지워 메이트(응수 0)로 간다.
 * 판단 수준 tac.read = 읽는 깊이: 초보 0 · 중급 1 · 상급 2 · 대가 3(상대 자원을 센다) · 전설 4(상대도 읽는다고 본다). 선명도 5 이상, 결투(적이 하나)에서만.
 *   read: 칸을 고를 때, every s마다 다시 읽고 첫 수만 둔다(K.pl: 마법 n, 덮을 곳 j·tx·ty, 메이트·체크, 첫 수의 응수 수). 실행(피하기)은 반사 겹이 한다
 *   value: 읽은 첫 수 × boost(체크면 × check, 덮기면 그 자리에), 다른 공격 × others. 큰 한 방(big)은 메이트일 때만. 정석의 다음 수
 *   net (막는 쪽, 걸음 앞): 내 방어 여유(state.slack: 0.3 s 안에 쓸 자원 + 움직일 곳)가 net.low 아래로 좁혀오고 상대가 짓고 있으면, 자원이 바닥나기 전에 깨기:
 *     slip s 동안 걸음을 바꾼다(가까운 바위 뒤로 떨어져 엄폐, 없으면 상대에게서 멀리 가장 열린 쪽으로) · 벽 마법 × wall · 가장 빠른 체크로 역체크 × counter. 정석을 알면 받는 법(away·keep·cast)
 *   commit: 시전에 cast.chk(체크)·cast.mate(메이트). 기록 m.mlog: chk·mate·brk·plN(읽은 수)·plNodes(본 마디) */
const ST = require('./state'), SE = require('./search'), JO = require('./joseki'), P = ST.P;
const { C, hyp, OFF, landDelay } = require('../util');
const on = (m, K) => m.tac.read > 0 && m.C >= 5 && K.foes && K.foes.length === 1;
const SD = new WeakMap(), TMP = ST.newSide();
function sides(m) { let o = SD.get(m); if (!o) { o = { e: ST.newSide(), me: ST.newSide() }; SD.set(m, o); } return o; }
const newPl = () => ({ n: '', j: 0, tx: 0, ty: 0, mate: false, line: false, check: false, ans: 0, t: -9, S: null, lt: null, qN: 0, qName: new Array(16).fill(''), qCell: new Int32Array(16), qH: new Int32Array(16), qT: new Float64Array(16) });
const FI = { thread: 0, proj: 0, area: 4, lob: 4 };
// 배운 맞을 가망: 칸 = 틀(실·투사체 0, 지연 폭발·곡사 4) + 응수 수(0~3). [0..7] 수, [8..15] 맞힌 수. 앞선 값 × 무게 w에서 시작
function table(pl) {
  if (pl.lt) return pl.lt; const t = pl.lt = new Float64Array(16), H = P.hit;
  for (let i = 0; i < 4; i++) { t[i] = t[4 + i] = H.w; t[8 + i] = H.prior.thread[i] * H.w; t[12 + i] = H.prior.area[i] * H.w; }
  return t;
}
// 푼 지 wait s 지난 내 수가 맞았나 보고 배운다
function learn(W, m, pl) {
  const t = table(pl); let j = 0;
  for (let i = 0; i < pl.qN; i++) { if (pl.qT[i] <= W.t) { const c = pl.qCell[i]; t[c]++; if ((m.log.hits[pl.qName[i]] || 0) > pl.qH[i]) t[8 + c]++; } else { pl.qName[j] = pl.qName[i]; pl.qCell[j] = pl.qCell[i]; pl.qH[j] = pl.qH[i]; pl.qT[j] = pl.qT[i]; j++; } }
  pl.qN = j;
}
// 읽기 (칸을 고를 때)
function read(W, m, K) {
  if (!on(m, K)) { if (K.pl) K.pl.n = ''; return; }
  const pl = K.pl || (K.pl = newPl());
  if (W.t - K.plT < P.every) return;
  learn(W, m, pl);
  const e = K.e, S = ST.build(W, e, m, sides(m).e, 0.5), o = SE.read(W, m, e, S, m.tac.read, table(pl));
  K.plT = W.t; pl.t = W.t; pl.S = S; pl.n = o.k >= 0 ? SE.CN[o.k] : ''; pl.j = o.j; pl.tx = o.j ? S.bx[o.j] : 0; pl.ty = o.j ? S.by[o.j] : 0; pl.mate = o.mate; pl.line = o.line; pl.check = o.check; pl.ans = o.ans;
  m.mlog.plN++; m.mlog.plNodes += o.nodes;
}
// 막는 쪽 (걸음 앞, 판단마다)
function net(W, m, K) {
  if (!on(m, K)) return;
  const e = K.e, S = ST.build(W, m, e, sides(m).me, 0.5); K.netN = ST.slack(S, 0.3);
  const L = JO.read(W, m, K); K.jsL = L;
  if (K.brk > W.t) return;
  let busy = false; for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && !c.auto && OFF[c.s.t] && c.tgt === m) busy = true; }
  const away = L && L.answer.do === 'away';
  if (!((K.netN <= P.net.low && busy) || away)) return;
  // 깨기: 바위 뒤(상대와 사이에 두고) 또는 상대에게서 멀리, 가장 열린 쪽으로
  let tx = 0, ty = 0, bd = 1e9;
  if (m.z < 3) for (const ob of W.obs) { const d = hyp(ob.x - m.x, ob.y - m.y); if (d < 12 && d < bd) { const ux = ob.x - e.x, uy = ob.y - e.y, l = hyp(ux, uy) || 1; tx = ob.x + ux / l * (ob.r + 1.2) - m.x; ty = ob.y + uy / l * (ob.r + 1.2) - m.y; bd = d; } }
  if (bd === 1e9) { let bj = 1, bb = 1e9; for (let j = 1; j < 9; j++) if (S.blk[j] < bb && ST.OX[j] >= 0) { bb = S.blk[j]; bj = j; } tx = S.bx[bj] - m.x; ty = S.by[bj] - m.y; }
  const l = hyp(tx, ty) || 1; K.brkX = tx / l * 2; K.brkY = ty / l * 2; K.brk = W.t + (away ? P.net.away : P.net.slip); m.mlog.brk++;
}
// 값 고치기 (맨 끝)
function value(W, m, K, o) {
  if (!on(m, K)) return;
  const s = o.s, pl = K.pl;
  if (s.big && !(pl && pl.mate && pl.n === o.n)) { o.v = 0; return; }   // 큰 한 방은 메이트일 때만
  JO.value(W, m, K, o);
  if (pl && pl.n) { if (o.n === pl.n) { o.v = Math.max(o.v, pl.mate ? 0.6 : P.plan.base) * (pl.mate ? P.plan.mateBoost : P.plan.boost) * (pl.check ? P.plan.check : 1); if (pl.j) { o.tx = pl.tx; o.ty = pl.ty; } } else if (OFF[s.t] && o.v > 0) o.v *= pl.mate ? P.plan.others * 0.5 : P.plan.others; }   // 메이트면 그 수를 꼭
  if (K.brk > W.t) { if (s.t === 'wall' || s.t === 'build') o.v = Math.max(o.v, P.plan.base) * P.net.wall; else if (s.t === 'thread' && o.v > 0) o.v *= P.net.counter; }   // 깨기: 벽, 역체크
  if (K.jsL && K.jsL.answer.cast === o.n && W.t < K.keepT && o.v > 0) o.v *= JO.P.boost;   // 정석의 받는 법
  if (K.keep & 8 && W.t < K.keepT && s.t === 'buff' && s.b && s.b.front) o.v *= 0.2;   // 아낄 방패
}
// 둔 수
function commit(W, m, K, best, cast) {
  if (!on(m, K)) return;
  const pl = K.pl; if (pl && pl.n === best.n) { cast.chk = pl.check; cast.mate = pl.mate; if (pl.check) m.mlog.chk++; if (pl.mate) m.mlog.mate++; }
  const f = FI[best.s.t]; if (pl && f !== undefined && pl.qN < 16 && K.e) { const i = pl.qN++, n = ansOf(W, K.e, m, cast); pl.qName[i] = best.n; pl.qCell[i] = f + (n > 3 ? 3 : n); pl.qH[i] = m.log.hits[best.n] || 0; pl.qT[i] = W.t + cast.T + P.hit.wait; }   // 배울 것
  JO.commit(W, m, K, best.n); K.plT = -9;   // 다음 칸에서 다시 읽는다
}
// 지표 (metrics/watch, 읽기만): d의 방어 여유, 시전 c에 대한 d의 응수 수
function slackOf(W, d, a) { return ST.slack(ST.build(W, d, a, TMP, 0.5), 0.3); }
function ansOf(W, d, a, c) {
  const S = ST.build(W, d, a, TMP, 0.5), s = c.s, f = s.t, mask = ST.FM[f] || 0, A = ST.ra(), pc = ST.paceOn(W, a) ? A.pace.P : null, dist = hyp(c.tx - a.x, c.ty - a.y);
  const tau = Math.max(0, c.T - c.t) + (f === 'thread' ? 0 : landDelay(s, dist)), r = f === 'area' || f === 'lob' ? (s.r || 1) * C.sizeOf(a, s) + 0.3 : Math.max(1, (pc ? pc.track[a.tac.pace || 0] || 0 : 0) + 0.6);
  let n = 0; if ((f === 'thread' || f === 'proj') && S.shUp >= tau) n++;
  for (let i = 0; i < 6; i++) { if (!(mask & (1 << i)) || !(S.has & (1 << i)) || S.av[i] > tau) continue; if (i === 2 && s.big) continue; if (i === 1 && !ST.cutOK(S, tau, r)) continue; if (i === 0 && !ST.rollOK(S, tau, r)) continue; n++; }
  if (mask & (1 << ST.MOVE) && ST.moveOK(S, tau, r)) for (let j = 1; j < 9; j++) if (S.blk[j] <= tau) { n++; break; }
  return n;
}
// 방어 자원의 남은 몫 (샌드박스): 자원마다 0(지금 쓸 수 있음)~1(cap s 넘게 잠김), 없으면 -1
function resBars(S, out) { for (let i = 0; i < 6; i++) out[i] = S.has & (1 << i) ? Math.min(1, S.av[i] / P.w.lockCap) : -1; return out; }
module.exports = { read, net, value, commit, slackOf, ansOf, resBars, on, JO, ST };
