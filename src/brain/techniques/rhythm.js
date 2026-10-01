'use strict';
/* 기술: 리듬과 장악권 밀기 (v2.2, SPEC 26장)
 * 선명도 5 이상(상위·대마법사)만 쓴다.
 * 떠보기(probe): 멀리서(14 m 넘게) 가볍게. 비싼 공격(당 7 이상)은 값 × 0.5
 * 들어가기(in): 상대에게 틈(빈손·꺼짐·굳음·묶임·과열 92 넘음·방어 간격)이 있으면 가까이 붙어 몰아친다: 공격 × 1.4, 두 번째 칸에도 공격(K.pressB)
 * 빠지기(out): 내 피로가 넘치기 직전이거나(대가부터 92, 상급 97. 대마법사는 비행 피로로 판의 40%를 80 넘게 보낸다), 나를 겨눈 상대의 큰 수가 보이거나, 2 s 안에 체력 15%를 잃으면 22 m 넘게 물러난다: 공격 × 0.6, 방어 × 1.4
 * 상급(tac.rhythm = 'mimic'): 굳음·묶임·과열만 보고, 틈이 끝난 뒤에도 1.5 s 더 머문다(늦다)
 * 대가·전설(tac.rhythm = true, tac.rhythmTime): 모든 틈을 보고, 붙는 데 드는 시간(거리 / 속도 + 0.25 s)보다 틈이 길 때만 들어간다
 * 장악권 밀기(tac.domainPush, 대가부터): 들어갈 거리 = 두 신호가 맞서는 경계가 상대에게서 3 m 안으로 오는 거리(5장 식을 풀어서, 4~12 m).
 *   다가갈수록 상대 자리의 공기를 빼앗아 상대 자리에서 만드는 내 마법(발밑·구름·지대·실)의 몫이 오른다 */
const { C, defenseDown } = require('../util'), SH = require('./sharp');
const PROBE_R = 14, OUT_R = 22, GAP = 3, STRONG = 5;   // 강자(선명도 5 이상: 상위·대마법사, 나는 사람)만: 평범·중간의 판단 사다리는 v2.1 그대로
// 들어갈 거리: 경계에서 상대까지의 틈이 GAP가 되는 거리. 경계(나에게서) x = L(A−B)/(A+B) + A·d/(A+B) → d − x = GAP를 푼다
function inDist(W, m, e) {
  const L = W.rules.domainL, A = C.sigOf(W, m), B = C.sigOf(W, e) * (e._act ? 1 : W.rules.passive);
  const d = (GAP * (A + B) + L * (A - B)) / (B || 1e-9); return d < 4 ? 4 : d > 12 ? 12 : d;
}
function window(W, m, K, full) {
  const e = K.e, st = e.st; let w = 0;
  if (st.stun > w) w = st.stun; if (st.root > w) w = st.root;
  if (e.fat > 92 && !e.wave) w = w > 1.5 ? w : 1.5;   // 과열: 넘치기 직전이라 곧 쉬어야 한다
  if (full && SH.on(m)) {   // 날카롭게 (v2.9): 과열이 다가오면(머리 85 넘음) 1 s, 다 지어 붙잡아 둔 공격이 있으면 1 s 들어간다 (가까울수록 닿는 때가 짧아 맞을 가망이 오른다)
    if (e.fat > SH.P.hotF && !e.wave && w < 1) w = 1;
    const b = m.castB; if (SH.P.inHeld && b && b.hold && !b.go && b.t >= b.T && w < SH.P.inHeld) w = SH.P.inHeld;
  }
  if (full) { if (e.emptyT > W.t && e.emptyT - W.t > w) w = e.emptyT - W.t; if (e.crash > w) w = e.crash; if (w < 1 && defenseDown(e, K.S, W)) w = 1; }
  return w;
}
function phase(W, m, K) {
  const T = m.tac; if (!T.rhythm || m.C < STRONG) return;
  const ml = m.mlog.phase, dt = W.t - m.ph.t; if (dt > 0 && dt < 1) ml[m.phase] = (ml[m.phase] || 0) + dt; m.ph.t = W.t;
  const full = T.rhythm === true, e = K.e, d = K.d;
  if (W.t - m.ph.hpT > 2) { m.ph.hp = m.hp; m.ph.hpT = W.t; }
  const read = T.readCast && !K.blindR, big = read && ((e.cast && e.cast.s.big && e.cast.tgt === m) || (e.castB && e.castB.s.big && e.castB.tgt === m));
  const danger = m.fat > (full ? 92 : 97) || big || m.ph.hp - m.hp > 0.15 * m.hpMax;
  const dIn = T.domainPush ? inDist(W, m, e) : 6;
  if (danger) { m.phase = 'out'; m.ph.until = W.t + 1.5; }
  else if (m.phase === 'out' && W.t < m.ph.until) { /* 물러나는 중 */ }
  else {
    const w = window(W, m, K, full), close = (d > dIn ? d - dIn : 0) / (m.fly === 1 ? 25 : 7) + 0.25;
    if (w > 0 && (!T.rhythmTime || w >= close)) { m.phase = 'in'; const u = W.t + w + (full ? 0.5 : 1.5); if (!(m.ph.until > u && m.phase === 'in')) m.ph.until = u; }
    else if (!(m.phase === 'in' && W.t < m.ph.until)) m.phase = 'probe';
  }
  const pr = K.prefR; K.prefR = m.phase === 'in' ? dIn : m.phase === 'out' ? (pr > OUT_R ? pr : OUT_R) : (pr > PROBE_R ? pr : PROBE_R);
  K.aggr *= m.phase === 'in' ? 1.4 : m.phase === 'out' ? 0.6 : 0.9;
  K.pressB = m.phase === 'in' && full;
  const hp = W._bh.phase; for (let i = 0; i < hp.length; i++) hp[i](W, m, K);   // 규칙이 더하는 단계 (진지의 짓기·진지, rules/fort, v2.3)
}
function value(W, m, K, o) {
  const s = o.s; if (m.C < STRONG) return;
  if (m.phase === 'probe') { if (o.isOff && s.cost >= 7) o.v *= 0.5; }
  else if (m.phase === 'out' && !o.isOff && (s.t === 'wall' || s.t === 'buff' || s.t === 'zone')) o.v *= 1.4;
}
module.exports = { phase, value, inDist };
