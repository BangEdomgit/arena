'use strict';
/* 기술: 날카롭게 (v2.6, tac.sharp, 대가부터, 선명도 5 이상, SPEC 30장) — 헛수를 줄이고 틈을 찌른다
 * 빈틈 찌르기: 과녁의 빈틈(굳음·묶임·꺼짐·빈손·과열)이 닫히기 전에 닿는 공격 × 2, 그 가운데 빨리 닿을수록 더(× 1 + 0.5/(닿는 때 + 0.2)).
 *   빈틈에 쉬지 않기도 해 봤으나 대가/상급이 0.02 떨어졌다(머리를 써 버려 다음 수가 없다)
 * 날고 있는 과녁: 빠른 것(실·투사체·0.6 s 안에 떨어지는 구름) × 1.2로 먼저 떨어뜨리고, 느린 구름(0.6 s 넘게 늦게 떨어진다)은 과녁이 그동안 굳거나 묶여 있을 때만(아니면 × 0.3)
 * 막힌 직사 끊기: 실·곧게 나는 투사체를 모으는 중에 과녁과 사이가 막히면 끊는다(당의 70% 돌려받음, 머리 피로는 풀 때 들어 아직 안 들었다)
 * 몰아칠 때(작전 압박·끝내기, 과녁의 굳음·묶임·꺼짐·빈손, v2.7): 쉬지 않고 피로 벌점 없이, 두 번째 칸에도 공격을 겹친다. 두 번째 칸의 값 문턱은 늘 × 0.4
 * 명중 가망 (v2.8): 공격의 값에 맞을 짐작 0.35 대신 판 중의 명중률(쏜 수 대비, 짐작을 세 번 몫으로) × 형편(과녁이 닿을 때까지 묶였으면 × 2.5, 아니면 × 1/(1 + 닿는 때/0.6),
 *   땅에서 구를 수 있으면 × 0.6, 날며 끊을 수 있으면 × 0.7). 8% 아래면 빈틈(닿기 전에 닫히지 않는)을 기다린다
 * 세운 벽 뒤에 머문다 (v2.8): 벽·기둥을 세우고 2 s는 작전의 둘레 돌기를 쉬고, 엄폐가 제 벽 뒤로 끌고, 2 m로 낮게 난다. 벽을 떼어 재니 둘레 돌기가 두 사람 사이의 벽을 반으로 줄였다
 * 몰아치기·빈 칸의 준비·벽 자리 (v2.9, SPEC 33장): 몰아칠 틈(storm)엔 문턱 minOpen, 문턱에 막혀 기다리는 동안 벽·함정·지대(wait, 빈틈이 열리면 끊는다), 세운 벽에 anchorT 머문다(behind). 수를 모두 끄면 v2.8
 * 방패는 0.4 s 안에 닿는 위협(나를 겨눈 예비동작이 풀려 닿는 때, 날아오는 투사체)에만 (v2.8). (둘 다 높이 떠 있을 때 기둥·벽을 막으면 대가/상급이 0.06 떨어졌다: 굳을 위험에 낮게 날아 벽이 곧 다시 가린다) */
const { OFF, landDelay, castTime, hyp, C } = require('../util'), { undo } = require('./cancel');
const on = m => m.tac.sharp && m.C >= 5;
const SW = require('./swarm'); let MD = null;
const off = (m, k) => m.tac.sharpOff && m.tac.sharpOff[k];   // 떼어 재기 (실험): 기능 하나를 끈다
const PREP = { trap: 1, wall: 1, build: 1, blueprint: 1, cage: 1, zone: 1 }, ZK = { fire: 1, nh3: 1, spore: 1, ice: 1, acid: 1, mist: 1, absorb: 1 };   // 지형과 준비 (v2.9)
// 과녁의 빈틈이 앞으로 열려 있을 시간 (s). 과열(머리 92 넘음)은 0.8 s로 본다. 없으면 0
function openFor(W, e) { let w = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0, e.emptyT > W.t ? e.emptyT - W.t : 0); if (e.fat > 92 && !e.wave && w < 0.8) w = 0.8; return w; }
// 막힌 직사 끊기 (첫 칸만: 두 번째 칸은 그냥 버린다)
function losCancel(W, m, K) {
  if (!on(m) || off(m, 'los')) return;
  const a = m.cast; if (P.waitW > 0 && a && !a.auto && !a.bp && PREP[a.s.t] && a.T - a.t > 0.1 && openFor(W, K.e) > 0.3) { undo(m, a); m.mlog.prepCut++; }   // 짓던 준비를 끊고 빈틈을 친다 (v2.9)
  if (K.los) return;
  const c = m.cast; if (c && !c.auto && !c.feint && (c.s.t === 'thread' || (c.s.t === 'proj' && !c.s.home)) && c.tgt === K.e && c.T - c.t > 0.03) { undo(m, c); m.mlog.losCut++; }
  const b = m.castB; if (b && !b.auto && (b.s.t === 'thread' || (b.s.t === 'proj' && !b.s.home)) && b.tgt === K.e && b.T - b.t > 0.03) { m.castB = null; m.glu += (b.cost || 0) * 0.7; }
}
// 명중 가망 (v2.8): 판 중의 명중률(쏜 수 대비, 앞의 짐작 0.35를 세 번 몫으로 섞는다) × 지금의 형편(과녁이 묶였나·구를 수 있나·닿는 데 얼마나 걸리나)
const P = { prior: 3, pin: 2.5, roll: 0.6, fly: 0.7, landT: 0.6, min: 0.14, use: 1, minOpen: 0.05, hotF: 85, inHeld: 0.5, waitW: 0.5, prep: 1.2, prepMin: 0.6, prepFat: 50, anchorT: 10, ownCover: 0.4, losPrior: 30 };
// 몰아칠 틈 (v2.9): 과녁의 빈틈(굳음·묶임·꺼짐·빈손), 과열이 다가옴(머리 hotF 넘음, 파도 아님), 내 작전 끝내기. 이때 명중 문턱은 minOpen
const storm = (W, m, K) => { const e = K.e; return openFor(W, e) > 0 || (e.fat > P.hotF && !e.wave) || (m.op && m.op.cur === 'finish'); };
function chance(W, m, K, o, land) {
  const L = m.log, c = L.casts[o.n] || 0, h = Math.min(c, L.hits[o.n] || 0), e = K.e, est = (h + o.he * P.prior) / (c + P.prior);
  const pin = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0);
  let k = pin > land ? P.pin : 1 / (1 + land / P.landT);
  if (pin <= land) { if (e.fly === 0 && e.rollCd <= land && e.stam >= 1.5) k *= P.roll; else if (e.fly === 1 && !(e.cut.cd > land)) k *= P.fly; }   // 구를 수 있다 · 날며 끊을 수 있다
  return est * k;
}
// 막을 위협이 0.4 s 안에 닿는가 (v2.8): 나를 겨눈 실·투사체의 예비동작이 풀려 닿는 때(붙잡아 둔 수는 풀릴 때), 또는 날아오는 투사체
function threatSoon(W, m, K) {
  const th = K.threat; if (th && (th.s.t === 'thread' || th.s.t === 'proj') && !(th.hold && !th.go) && th.T - th.t + landDelay(th.s, K.d) < 0.4) return true;   // 앞 방패가 막는 실·투사체만, 붙잡아 둔 수는 풀릴 때
  for (const p of W.proj) { if (p.src.side === m.side) continue; const rx = m.x - p.x, ry = m.y - p.y, vv = p.vx * p.vx + p.vy * p.vy; if (!(vv > 0)) continue; const t = (rx * p.vx + ry * p.vy) / vv; if (t > 0 && t < 0.4 && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 1.2) return true; }
  return false;
}
function value(W, m, K, o) {
  if (!on(m)) return; if (!MD) MD = require('./mode');
  if (PREP[o.s.t] && W.t - K.waitT < P.waitW && !off(m, 'wait')) wait(W, m, K, o);
  if (!(o.v > 0)) return;
  const s = o.s, e = K.e;
  if (OFF[s.t]) {
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d), win = openFor(W, e);
    if (win > 0.15 && land < win && !off(m, 'open')) o.v *= 2 * (1 + 0.5 / (land + 0.2));   // 빈틈: 닫히기 전에 닿는 것, 빠를수록
    if (s.t !== 'trap' && s.t !== 'topple' && P.use && m.tac.aim && !off(m, 'chance') && !SW.on(W, m, e) && !(K.mode === 'poke' && MD.pokeOk(o))) {   // 공격 방식(v2.12): 견제의 싼·빠른 수만 문턱을 건너뛴다(맞히려는 게 아니라 움직이게 한다). 덮기·확정타까지 건너뛰니 전설 / 대가 0.71 → 0.48   // 무리 싸움(협공)엔 명중 문턱을 쓰지 않는다 (v2.10)
      const ch = chance(W, m, K, o, land); o.v *= ch / (o.he > 0.05 ? o.he : 0.05); if (ch < (storm(W, m, K) ? P.minOpen : P.min) && !(win > land) && !(K.slot === 'B' && m.tac.hold && W.rules.hold)) { o.v = 0; K.waitT = W.t; } }   // 명중 가망: 낮으면 빈틈을 기다린다 (v2.8)
    if (e.z >= 1 && !off(m, 'fly')) {
      const fast = s.t === 'thread' || (s.t === 'proj') || (s.t === 'area' && s.delay <= 0.6);
      if (fast) o.v *= 1.2;
      else if (s.t === 'area' && Math.max(e.st.stun || 0, e.st.root || 0) < land) o.v *= 0.3;   // 느린 구름은 굳음·묶임 뒤에만
    }
  }
  if (s.t === 'buff' && s.b && s.b.front && !off(m, 'shield') && !threatSoon(W, m, K)) o.v = 0;  // 방패는 0.4 s 안에 닿는 실제 위협에만 (v2.8)
  if ((s.t === 'wall' || s.t === 'build' || s.t === 'blueprint') && !off(m, 'wall') && (m.z > 2 || e.z > 2)) o.v = 0;   // 둘 중 하나가 2 m 넘게 떠 있으면 벽은 가리지 않는다 (v2.7)
  if ((s.t === 'wall' || s.t === 'build') && o.v > 0 && m.tac.wallLos && losShare(W, e) < m.tac.wallLos && !threatSoon(W, m, K)) o.v = 0;   // 상대의 주력이 시야가 필요한 공격일 때만 벽 (v2.10)
}
// 기다리는 동안 빈 칸을 지형과 준비에 (v2.9): 명중 문턱에 공격이 막힌 뒤 0.5 s 안이면 벽·흙벽(둘 다 2 m 아래)·함정(한도 안)·지대에 값을 준다.
// 피로 벌점(머리 100에 0.5)을 넘어 고를 만하게 prepMin. 벽은 내 앞 적 쪽에(엄폐 각), 함정은 나와 적 사이 3 m에(다가오는 길)
function wait(W, m, K, o) {
  if (m.fat > P.prepFat) return;   // 머리를 남겨 둔다: 빈틈이 열리면 칠 수 있게
  const s = o.s, e = K.e; let v = o.v;
  if (s.t === 'wall' || s.t === 'build') { if (m.z > 2 || e.z > 2 || (m.tac.wallLos && losShare(W, e) < m.tac.wallLos) || W.walls.some(w => w.mk === m.id && hyp(w.x - m.x, w.y - m.y) < 4)) return; if (!(v > P.prepMin)) v = P.prepMin; }
  else if (s.t === 'trap') { if (!(v > 0)) { let n = 0; for (const t of W.traps) if (t.src === m) n++; if (n >= C.trapCap(W, m)) return; o.tx = m.x + K.ux * 3; o.ty = m.y + K.uy * 3; v = P.prepMin; } }
  else if (s.t === 'zone') { if (!ZK[s.z.k] || !(v > 0)) return; }
  else if (!(v > 0)) return;
  o.v = (v > P.prepMin ? v : P.prepMin) * P.prep; m.mlog.prep++;
}
// 상대 피해 가운데 시야가 필요한 공격(실·곧게 나는 투사체)의 몫 (v2.10): 판 중에 그 사람이 준 피해, 처음엔 덱의 공격 가운데 직사의 몫을 losPrior만큼 섞는다.
// 벽은 실·직사만 막는다(구름·곡사·함정은 넘거나 돌아간다): 이 몫이 판단 수준의 tac.wallLos 아래면 벽을 세우지 않고 그 칸을 함정·몰이에
const LOSC = new WeakMap();
function losShare(W, e) {
  let pr = LOSC.get(e); if (pr === undefined) { let a = 0, d = 0; for (const n of e.book) { const s = W.spells[n]; if (!s || !OFF[s.t] || s.t === 'trap' || s.t === 'topple') continue; a++; if (s.t === 'thread' || (s.t === 'proj' && !s.home)) d++; } pr = a ? d / a : 0; LOSC.set(e, pr); }
  let all = 0, dd = 0; const L = e.log.dealt; for (const n in L) { all += L[n]; const s = W.spells[n]; if (s && (s.t === 'thread' || (s.t === 'proj' && !s.home))) dd += L[n]; }
  return (dd + pr * P.losPrior) / (all + P.losPrior);
}
// 몰아칠 때 (v2.7): 작전이 압박·끝내기이거나 과녁의 빈틈(과열 빼고)이 열려 있다. 이때는 쉬지 않고, 피로 벌점이 없고, 두 번째 칸도 공격을 겹친다
const push = (W, m, K) => on(m) && !off(m, 'push') && ((m.op && (m.op.cur === 'press' || m.op.cur === 'finish')) || Math.max(K.e.st.stun || 0, K.e.st.root || 0, K.e.crash > 0 ? K.e.crash : 0, K.e.emptyT > W.t ? K.e.emptyT - W.t : 0) > 0.15 || (P.hotF < 92 && K.e.fat > 92 && !K.e.wave));   // 과열도 (v2.9)
// 세운 벽 뒤에 머문다 (v2.8): 벽·기둥을 세우고 2 s 동안은 작전의 둘레 돌기를 하지 않고(엄폐가 그 벽 뒤로 끈다) 2 m로 낮게 난다(벽은 2 m 넘게 뜬 사람을 가리지 않는다)
// 벽 자리를 쓴다 (v2.9): 세운 지 anchorT 안이고 제 벽이 15 m 안에 서 있으면 그 벽에 머문다(돌아온다: 엄폐가 제 벽 뒤로 끈다). 들어가기·끝내기에는 떠난다
function ownWall(W, m, r) { for (const w of W.walls) if (w.mk === m.id && w.hp > 0 && hyp(w.x - m.x, w.y - m.y) < r) return true; return false; }
const behind = (W, m, K) => on(m) && !off(m, 'behind') && W.t >= K.wallT - 1 && (W.t - K.wallT < 2 || (W.t - K.wallT < P.anchorT && m.phase !== 'in' && !(m.op && m.op.cur === 'finish') && !(K.e.z > 2) && ownWall(W, m, 15)));   // 들어갈 때·끝낼 때는 벽을 떠난다
module.exports = { value, losCancel, openFor, push, chance, threatSoon, P, behind, storm, on, losShare };
