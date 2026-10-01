'use strict';
/* 규칙: 파도 (rules.wave, 1.2.0~, SPEC 7장, WORLD 3-3)
 * 머리가 넘치면 굳는 대신 파도를 탄다. 부류(서퍼·메타·이단)마다 다르다.
 * 파도 위: 선명도 × 1.1, 위력 × 2.0(서퍼)·1.3, 걸음 × 1.15, 시전 × 0.75, 몸이 탄다. 170 넘으면 폭주. 75 아래로 내려오면 꺼짐(crash).
 * 이단: 파도를 못 느끼고 머리는 100에서 멈춘다. 위력 × 0.8, 예비동작이 조용하고(마지막 0.12 s에만 읽힌다), 안 보이는 함정을 알아채기 어렵다.
 * 메타: 머리 회복 × 1.05, 문턱 아래(80~100)에서 위력 × 1.08, 상대의 파도를 읽는다 */
module.exports = {
  name: 'wave', on: W => W.rules.wave,
  engine: X => {
    const { hurt } = X;
    return {
      ceff(W, m, x) { return m.wave ? x * 1.1 : x; },
      power(W, m, s, x) { return x * (m.wave ? (m.type === '서퍼' ? 2.0 : 1.3) : m.type === '이단' ? 0.9 : m.type === '메타' && m.fat >= 80 && m.fat <= 100 ? 1.08 : 1); },
      // 머리가 넘칠 때: 굳지 않고 탄다. 너무 깊이(170) 가면 휩쓸린다. 이단은 100에서 멈춘다
      overload(W, m) {
        if (m.type !== '이단') {
          const enter = m.type === '서퍼' ? 90 : 100, may = !m.tac.waveChoose || m.waveWant;   // 파도 고르기(전설): 끝낼 수 있을 때만 스스로 탄다
          if (!m.wave && m.fat > enter && may) { m.wave = 1; m.log.waves++; }
          else if (!m.wave && m.fat > 100 && !may) { m.st.stun = Math.max(m.st.stun || 0, 1); m.fat = 55; m.log.over++; m.cast = m.castB = m.chan = null; }
          if (m.fat > 170) { m.log.over++; m.log.lost++; hurt(W, m, 30, null, '폭주', 'wave'); m.st.stun = Math.max(m.st.stun || 0, 2.5); m.fat = 60; m.wave = 0; m.crash = 3; m.cast = m.castB = m.chan = null; }
        } else if (m.fat > 100) m.fat = 100;
        return true;
      },
      fatRecover(W, m, k) { return k * (m.type === '메타' ? 1.05 : m.type === '이단' ? 1.3 : 1); },   // 메타: 머리 회복 × 1.05. 이단 × 1.3 (v2.0: 파도의 도파민도 꺼짐도 없어 머리가 빨리 식는다)
      mageStep(W, m) {
        if (m.crash > 0) m.crash -= W.dt;
        if (m.wave) {
          // 파도는 몸을 태운다. 깊을수록 세게. 서퍼는 익숙하고 메타는 조절한다. 피로가 75 아래로 내려오면 꺼짐(crash)
          m.waveT += W.dt; const wd = (1.5 + (m.fat - 90) * 0.06) * (m.type === '서퍼' ? 0.8 : 0.6) * W.dt;
          m.log.waveDmg += Math.max(0, wd); hurt(W, m, wd, null, '파도', 'wave'); if (m.hp <= 0) m.log.waveDeath = 1;
          if (m.fat < 75) { m.wave = 0; m.crash = m.type === '메타' ? 0 : 2; }   // 메타는 조절해 내려와 꺼짐이 없다
        }
      },
      speed(W, m, sp) { return sp * (m.wave ? 1.15 : 1) * (m.crash > 0 ? 0.85 : 1); },
      notice(W, t, k) { return k * (t.src.type === '이단' ? 0.32 : 1); },   // 이단의 안 보이는 함정은 알아채기 어렵다
    };
  },
  brain: () => ({
    // 성향: 파도 위에선 더 몰아치고 더 붙고 덜 피하고 쉬지 않는다. 메타(또는 파도 읽기)는 상대의 파도를 읽는다. 파도 고르기(전설)
    aim(W, m, K) {
      const T = m.tac, e = K.e;
      if (m.wave) { K.aggr = T.aggr * 1.6; K.prefR = T.prefR * 0.7; K.dodgeK = T.dodge * 0.5; K.rest = 999; }
      if ((m.type === '메타' || T.readWave) && (e.wave || e.crash > 0)) { if (e.wave) { K.prefR = K.prefR * 1.4; K.aggr = K.aggr * 0.7; } else K.aggr = K.aggr * 1.6; }
      if (T.waveChoose) m.waveWant = e.hp / e.hpMax < 0.35 && m.hp / m.hpMax > 0.3;
    },
    hideCast(W, q, c) { return q.type === '이단' && c.T - c.t > 0.12; },   // 이단의 예비동작은 마지막 0.12 s에만 읽힌다 (읽기·자동 진 모두)
    // 쉴 때: 서퍼는 쉬지 않고 탄다, 메타는 이기고 있을 때만 타고 너무 깊으면(140) 내려온다, 이단은 쉰다. 전설은 끝낼 수 있을 때만
    rest(W, m, K, restNow) {
      const T = m.tac, e = K.e;
      if (restNow) {
        if (T.waveChoose) restNow = !m.waveWant;
        else if (m.type === '서퍼') restNow = false;
        else if (m.type === '메타') restNow = !(e.hp / e.hpMax < 0.5 || m.hp / m.hpMax > e.hp / e.hpMax + 0.1);
      }
      return restNow || (m.wave && (m.type === '메타' || (T.waveChoose && !m.waveWant)) && m.fat > 140 && !K.aimed);
    },
    castTime(W, m, t) { return t * (m.wave ? 0.75 : 1) * (m.crash > 0 ? 1.3 : 1); },
    valueLate(W, m, K, o) { if (m.wave && !o.isOff) o.v *= 0.5; },   // 파도 위에선 막기보다 친다
  }),
};
