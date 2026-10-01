'use strict';
/* 기술: 교전 유지 (v2.13, tac.engage 1·2, 상급부터 2, SPEC 37장, 수는 data/engage.json) — 결판 뒤에 멍하니 서 있지 않는다
 * 사거리 R: 상대가 떠 있으면 실·곧은 투사체의 가장 긴 사거리(지연 폭발·곡사는 떠 있으면 닿지 않는다), 아니면 가장 긴 공격 사거리
 * 늘: 선호 거리는 R × reachK 0.9 안, 상대가 R 밖이면 작전의 둘레 걸음을 쉬고 다가간다(K.closeIn). 쏠 것 없이 idle이 지나면 빈 칸을 준비에
 * 1: 아무 칸도 짓지 않고 idle 1.2 s가 지났는데 상대가 R × closeK 0.65 밖이면 거기까지 다가간다
 *   (청사진의 짓기·작전의 자리·벽 자리가 지금 거리를 붙들어 둘 다 사거리 밖에서 섰다: 침묵의 70%가 45 m 넘게 떨어져 있었다)
 * 2 (상급부터): 끝내기 작전이거나 상대 체력이 low 0.3 아래면 쫓는다(사거리 × chaseK 0.45까지), 숨은 상대 자리엔 지연 폭발·곡사·번쩍임 × huntK(들추기·몰이 그물)
 *   몰린 쪽(내 체력이 low 아래이고 상대보다 낮음): 사거리 × kiteK 0.8을 지키며 견제하고(도망치며 쏜다), 빈 칸은 준비(덫·지대)에, 남은 몫이 breathR 0.6 아래면 숨(rules/breath가 K.low를 본다) */
const { OFF } = require('../util');
const P = require('../../../data/engage.json');
// 떠 있는 상대에 닿는 사거리: 실·곧은 투사체 가운데 가장 긴 것 (지연 폭발·곡사는 떠 있으면 닿지 않는다). 덱마다 한 번
const FR = new WeakMap();
function fastR(W, m, K) { let r = FR.get(K.Dm); if (r !== undefined) return r; r = 0; for (let i = 0; i < K.Dm.sp.length; i++) { const s = K.Dm.sp[i]; if ((s.t === 'thread' || (s.t === 'proj' && !s.home)) && K.Dm.R[i] > r) r = K.Dm.R[i]; } if (!r) r = K.Dm.maxR; FR.set(K.Dm, r); return r; }
function adjust(W, m, K) {
  const L = m.tac.engage || 0; if (!L || K.foes.length > 2) return;   // 결투에서만: 무리 싸움은 협공(swarm)·성(siege)이 자리를 잡는다 (대마법사가 무리 쪽으로 다가가니 협공의 둘레 나누기가 깨졌다)
  const e = K.e, R = e.z >= 1 ? fastR(W, m, K) : K.Dm.maxR, busy = m.cast || m.castB || m.chan, idle = !busy && W.t - m.lastRel > P.idle;
  K.low = false; K.chase = false; K.closeIn = false;
  if (L >= 2 && m.hp < P.low * m.hpMax && e.hp > m.hp) {   // 몰린 쪽
    K.low = true; if (K.prefR < P.kiteK * R) K.prefR = P.kiteK * R; K.waitT = W.t; if (!K.mode || K.mode === 'throw') K.mode = 'poke'; return;
  }
  if (L >= 2 && ((m.op && m.op.cur === 'finish') || e.hp < P.low * e.hpMax)) { K.chase = true; if (K.d > P.chaseK * R) K.closeIn = true; if (K.prefR > P.chaseK * R) K.prefR = P.chaseK * R; K.aggr *= 1.3; if (m.phase === 'build') m.phase = 'in'; return; }   // 쫓는다
  if (K.prefR > P.reachK * R) K.prefR = P.reachK * R;   // 닿지 않는 거리를 바라지 않는다 (작전의 소모가 곡사 사거리로 물러나 떠 있는 상대엔 아무것도 닿지 않았다)
  if (K.d > R) K.closeIn = true;
  if (idle && K.d > P.closeK * R) { K.closeIn = true; if (K.prefR > P.closeK * R) K.prefR = P.closeK * R; if (m.phase === 'build') m.phase = 'probe'; }   // 다가간다
  if (idle) K.waitT = W.t;   // 쏠 게 없으면 준비(덫길·지대)에 (날카롭게의 wait)
}
// 쫓는 동안 숨은 상대 자리에: 지연 폭발·곡사·번쩍임
function value(W, m, K, o) {
  if (!K.chase || K.los || !(o.v > 0)) return; const t = o.s.t;
  if (t === 'area' || t === 'lob' || t === 'flash') { o.v *= P.huntK; o.tx = K.e.x; o.ty = K.e.y; }
}
module.exports = { adjust, value, P };
