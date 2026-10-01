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
 * 방패는 0.4 s 안에 닿는 위협(나를 겨눈 예비동작이 풀려 닿는 때, 날아오는 투사체)에만 (v2.8). (둘 다 높이 떠 있을 때 기둥·벽을 막으면 대가/상급이 0.06 떨어졌다: 굳을 위험에 낮게 날아 벽이 곧 다시 가린다) */
const { OFF, landDelay, castTime, hyp } = require('../util'), { undo } = require('./cancel');
const on = m => m.tac.sharp && m.C >= 5;
// 과녁의 빈틈이 앞으로 열려 있을 시간 (s). 과열(머리 92 넘음)은 0.8 s로 본다. 없으면 0
function openFor(W, e) { let w = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0, e.emptyT > W.t ? e.emptyT - W.t : 0); if (e.fat > 92 && !e.wave && w < 0.8) w = 0.8; return w; }
// 막힌 직사 끊기 (첫 칸만: 두 번째 칸은 그냥 버린다)
function losCancel(W, m, K) {
  if (!on(m) || K.los) return;
  const c = m.cast; if (c && !c.auto && !c.feint && (c.s.t === 'thread' || (c.s.t === 'proj' && !c.s.home)) && c.tgt === K.e && c.T - c.t > 0.03) { undo(m, c); m.mlog.losCut++; }
  const b = m.castB; if (b && !b.auto && (b.s.t === 'thread' || (b.s.t === 'proj' && !b.s.home)) && b.tgt === K.e && b.T - b.t > 0.03) { m.castB = null; m.glu += (b.cost || 0) * 0.7; }
}
// 명중 가망 (v2.8): 판 중의 명중률(쏜 수 대비, 앞의 짐작 0.35를 세 번 몫으로 섞는다) × 지금의 형편(과녁이 묶였나·구를 수 있나·닿는 데 얼마나 걸리나)
const P = { prior: 3, pin: 2.5, roll: 0.6, fly: 0.7, landT: 0.6, min: 0.14 };
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
  if (!on(m) || !(o.v > 0)) return;
  const s = o.s, e = K.e;
  if (OFF[s.t]) {
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d), win = openFor(W, e);
    if (win > 0.15 && land < win) o.v *= 2 * (1 + 0.5 / (land + 0.2));   // 빈틈: 닫히기 전에 닿는 것, 빠를수록
    if (s.t !== 'trap' && s.t !== 'topple') { const ch = chance(W, m, K, o, land); o.v *= ch / (o.he > 0.05 ? o.he : 0.05); if (ch < P.min && !(win > land) && !(K.slot === 'B' && m.tac.hold && W.rules.hold)) o.v = 0; }   // 명중 가망: 낮으면 빈틈을 기다린다 (v2.8)
    if (e.z >= 1) {
      const fast = s.t === 'thread' || (s.t === 'proj') || (s.t === 'area' && s.delay <= 0.6);
      if (fast) o.v *= 1.2;
      else if (s.t === 'area' && Math.max(e.st.stun || 0, e.st.root || 0) < land) o.v *= 0.3;   // 느린 구름은 굳음·묶임 뒤에만
    }
  }
  if (s.t === 'buff' && s.b && s.b.front && !threatSoon(W, m, K)) o.v = 0;  // 방패는 0.4 s 안에 닿는 실제 위협에만 (v2.8)
  if ((s.t === 'wall' || s.t === 'build' || s.t === 'blueprint') && (m.z > 2 || e.z > 2)) o.v = 0;   // 둘 중 하나가 2 m 넘게 떠 있으면 벽은 가리지 않는다 (v2.7)
}
// 몰아칠 때 (v2.7): 작전이 압박·끝내기이거나 과녁의 빈틈(과열 빼고)이 열려 있다. 이때는 쉬지 않고, 피로 벌점이 없고, 두 번째 칸도 공격을 겹친다
const push = (W, m, K) => on(m) && ((m.op && (m.op.cur === 'press' || m.op.cur === 'finish')) || Math.max(K.e.st.stun || 0, K.e.st.root || 0, K.e.crash > 0 ? K.e.crash : 0, K.e.emptyT > W.t ? K.e.emptyT - W.t : 0) > 0.15);
// 세운 벽 뒤에 머문다 (v2.8): 벽·기둥을 세우고 2 s 동안은 작전의 둘레 돌기를 하지 않고(엄폐가 그 벽 뒤로 끈다) 2 m로 낮게 난다(벽은 2 m 넘게 뜬 사람을 가리지 않는다)
const behind = (W, m, K) => on(m) && W.t - K.wallT < 2 && W.t >= K.wallT - 1;
module.exports = { value, losCancel, openFor, push, chance, threatSoon, P, behind };
