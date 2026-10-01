'use strict';
/* 규칙: 끊는 움직임 (rules.snap, v2.4, SPEC 28장, 수는 data/rules/snap.json)
 * 걸음의 속도가 목표를 스르르(지수로) 따라가던 것을, 가속 한계 안에서 곧장(일정 가속으로) 따라가게 한다: 붙었다 멈췄다가 "딱딱" 끊긴다.
 *   가속 한계 a = min(5 g, 2.5 g × 회피 배수(1 + 0.25·log₂ C, 회피 규칙이 꺼지면 1)): 평범 2.5 g, 중간 3.3 g, 상위 3.9 g, 대마법사 4.6 g. 빙판 위는 × 가속/9
 *     앞뒤와 옆으로 나눈다: 옆·가속은 a, 거꾸로 밟아 서기는 2a(대마법사 9.2 g). 대마법사의 달리기(9.2 m/s)가 0.1 s 만에 서고 0.3 s에 거꾸로 제 속도.
 *     예전 걸음(지수로 따라가기: 차 × 9/s)은 큰 차에선 처음이 16 g로 빨랐고 끝(목표 근처)이 늘어졌다(95%까지 0.33 s)
 *   나는 사람(rules/flight): 옆 가속의 바닥 = a (느려도 꺾는다, 옆 튀기와 같은 크기), 오르내림 가속 = max(12 m/s², a) (높이 튕기기)
 * 두뇌 (생각 겹의 발놀림, 선명도 5 이상, 판단 수준의 tac):
 *   끊어 걷기(chop, 상급부터): 모으는 동안은 제 속도로 걷고, 풀리기 전 0.12 s만 멈춘다(보통은 모으는 내내 × 0.5)
 *   옆 뒤집기(footwork 1, 상급부터): 옆걸음의 방향을 0.35~0.75 s마다 뒤집는다(버릇 없이)
 *   거리 톱질(footwork 2, 대가부터): 떠보기에서 선호 거리 + 4 m(사거리 끝) 둘레 −4~+2 m에 있으면 모을 땐 들어가고 아니면 나간다
 *   높이 튕기기(footwork 3, 전설): 날 때 목표 높이를 3.5 m와 8 m 사이로 0.45~0.7 s마다 튕긴다
 *   게걸음 비행(footwork 2, 대가부터): 붙어 싸울 때(떠보기·들어가기, 선호 거리 + 10 m 안) 나는 목표 속도를 6 m/s로: 코너 속도(25 m/s)로는 5 g로도 방향을 못 뒤집는다 */
const { hyp, log } = require('../math');
const P = require('../../data/rules/snap.json');
const G = 9.8, LN2 = log(2), AC = new Map();
// 가속 한계 (m/s²): 선명도마다 한 번 잰다(결정론 log가 비싸다)
function aOf(W, m) {
  const key = W.rules.evade ? m.C : -1; let a = AC.get(key);
  if (a === undefined) { const ev = key < 0 ? 1 : 1 + 0.25 * log(Math.max(m.C, 1)) / LN2; a = G * Math.min(P.maxG, P.baseG * ev); AC.set(key, a); }
  return a;
}
module.exports = {
  name: 'snap', switch: 'snap', on: W => W.rules.snap, api: { aOf },
  engine: X => {
    return {
      // 걸음: 가속 한계 안에서 목표 속도로 곧장
      // 속도 차를 지금 가는 쪽(앞뒤)과 옆으로 나눠: 옆·가속은 a, 거꾸로 밟아 서기(앞뒤로 줄이기)는 brake × a. 가는 게 없으면 a
      walk(W, m, tx, ty, acc) {
        const a = aOf(W, m) * (acc < 9 ? acc / 9 : 1) * W.dt, dx = tx - m.vx, dy = ty - m.vy, v = hyp(m.vx, m.vy);
        let lx = 0, ly = 0, px = dx, py = dy;
        if (v > 0.1) { const ux = m.vx / v, uy = m.vy / v, dl = dx * ux + dy * uy, cap = dl < 0 ? a * P.brake : a, k = dl > cap ? cap : dl < -cap ? -cap : dl; lx = ux * k; ly = uy * k; px = dx - ux * dl; py = dy - uy * dl; }
        const pl = hyp(px, py); if (pl > a) { px *= a / pl; py *= a / pl; }
        m.vx += lx + px; m.vy += ly + py;
        return true;
      },
      // 끊어 걷기: 모으는 동안 제 속도, 풀리기 직전만 멈춘다
      castMove(W, m, k) { const c = m.cast; if (!m.tac.chop || m.C < 5 || !c || c.s.lock) return k; return c.T - c.t > P.chop ? 1 : 0; },
    };
  },
  brain: B => ({
    steer(W, m, K) {
      const lv = m.C >= 5 ? m.tac.footwork || 0 : 0; if (!lv || K.dodge || K.stance === 'breakout' || K.stance === 'kite') return;
      const R = m.rx, ux = K.ux, uy = K.uy;
      // 옆 뒤집기: 옆걸음을 버릇 없이 짧게 뒤집는다 (옆걸음 몫 0.8을 거꾸로 두 배)
      if (W.t - R.sfT > P.flip[0]) { R.sfT = W.t + W.rng() * (P.flip[1] - P.flip[0]); m.sf = -m.sf; R.flips++; }
      K.vx += -uy * m.sf * P.flipK; K.vy += ux * m.sf * P.flipK;
      // 거리 톱질: 사거리 끝 둘레에서 모을 땐 들어가고, 아니면 나간다
      if (lv >= 2 && m.phase === 'probe' && !K.closeIn) {   // 교전 유지(v2.13)가 다가가는 중엔 쉰다: 짓지 않으면 나가는 톱질이 둘을 사거리 끝에 붙들었다
        const edge = Math.min(K.Dm.maxR, K.prefR + P.saw[0]);
        if (K.d > edge + P.saw[1] && K.d < edge + P.saw[2]) { const inn = !!m.cast, s = inn ? 1 : -1; K.vx += ux * s * P.sawK; K.vy += uy * s * P.sawK; if (R.ly !== s) { R.ly = s; R.saw++; } }
      }
      // 게걸음 비행: 붙어 싸울 땐 느리게 날아 옆 뒤집기가 먹게
      if (lv >= 2 && m.fly === 1 && !m.retreat && (m.phase === 'probe' || m.phase === 'in') && K.d < K.prefR + P.strafeD && m.fv > P.strafeV) m.fv = P.strafeV;
      // 높이 튕기기: 날 때 목표 높이를 낮게·높게
      if (lv >= 3 && m.fly === 1 && !m.retreat && m.phase !== 'out') {
        if (W.t > R.bT) { R.bT = W.t + P.bounce[0] + W.rng() * (P.bounce[1] - P.bounce[0]); R.bUp = !R.bUp; R.bounce++; }
        m.fz = R.bUp ? P.bounceZ[1] : P.bounceZ[0];
      }
    },
  }),
};
