'use strict';
/* 기술: 날카롭게 (v2.6, tac.sharp, 대가부터, 선명도 5 이상, SPEC 30장) — 헛수를 줄이고 틈을 찌른다
 * 빈틈 찌르기: 과녁의 빈틈(굳음·묶임·꺼짐·빈손·과열)이 닫히기 전에 닿는 공격 × 2, 그 가운데 빨리 닿을수록 더(× 1 + 0.5/(닿는 때 + 0.2)).
 *   빈틈에 쉬지 않기도 해 봤으나 대가/상급이 0.02 떨어졌다(머리를 써 버려 다음 수가 없다)
 * 날고 있는 과녁: 빠른 것(실·투사체·0.6 s 안에 떨어지는 구름) × 1.2로 먼저 떨어뜨리고, 느린 구름(0.6 s 넘게 늦게 떨어진다)은 과녁이 그동안 굳거나 묶여 있을 때만(아니면 × 0.3)
 * 막힌 직사 끊기: 실·곧게 나는 투사체를 모으는 중에 과녁과 사이가 막히면 끊는다(당의 70% 돌려받음, 머리 피로는 풀 때 들어 아직 안 들었다)
 * 방패는 나를 겨눈 수가 있을 때만. (둘 다 높이 떠 있을 때 기둥·벽을 막으면 대가/상급이 0.06 떨어졌다: 굳을 위험에 낮게 날아 벽이 곧 다시 가린다) */
const { OFF, landDelay, castTime } = require('../util'), { undo } = require('./cancel');
const on = m => m.tac.sharp && m.C >= 5;
// 과녁의 빈틈이 앞으로 열려 있을 시간 (s). 과열(머리 92 넘음)은 0.8 s로 본다. 없으면 0
function openFor(W, e) { let w = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0, e.emptyT > W.t ? e.emptyT - W.t : 0); if (e.fat > 92 && !e.wave && w < 0.8) w = 0.8; return w; }
// 막힌 직사 끊기 (첫 칸만: 두 번째 칸은 그냥 버린다)
function losCancel(W, m, K) {
  if (!on(m) || K.los) return;
  const c = m.cast; if (c && !c.auto && !c.feint && (c.s.t === 'thread' || (c.s.t === 'proj' && !c.s.home)) && c.tgt === K.e && c.T - c.t > 0.03) { undo(m, c); m.mlog.losCut++; }
  const b = m.castB; if (b && !b.auto && (b.s.t === 'thread' || (b.s.t === 'proj' && !b.s.home)) && b.tgt === K.e && b.T - b.t > 0.03) { m.castB = null; m.glu += (b.cost || 0) * 0.7; }
}
function value(W, m, K, o) {
  if (!on(m) || !(o.v > 0)) return;
  const s = o.s, e = K.e;
  if (OFF[s.t]) {
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d), win = openFor(W, e);
    if (win > 0.15 && land < win) o.v *= 2 * (1 + 0.5 / (land + 0.2));   // 빈틈: 닫히기 전에 닿는 것, 빠를수록
    if (e.z >= 1) {
      const fast = s.t === 'thread' || (s.t === 'proj') || (s.t === 'area' && s.delay <= 0.6);
      if (fast) o.v *= 1.2;
      else if (s.t === 'area' && Math.max(e.st.stun || 0, e.st.root || 0) < land) o.v *= 0.3;   // 느린 구름은 굳음·묶임 뒤에만
    }
  }
  if (s.t === 'buff' && s.b && s.b.front && !K.aimed && !K.threat) o.v = 0;  // 방패는 실제 위협에만
}
module.exports = { value, losCancel, openFor };
