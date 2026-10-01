'use strict';
/* 규칙: 지대 (늘 켜짐, SPEC 8장 zone)
 * 지대가 몸에 거는 것(불·암모니아·포자·산·얼음·황화수소), 흡수 안개·물 장막의 피해 줄이기, 빙판의 미끄러짐, 산이 벽을 녹이기, 지대의 시간 */
module.exports = {
  name: 'terrain', on: () => true,
  engine: X => {
    const { inZone, hurt, DT, hyp } = X;
    return {
      // 맞을 때: 흡수 안개(전기 × 0.5, 불 × 0.4), 물 장막(불 × 0.5)
      hurtMod(W, m, v, kind) { if (m.z >= 1) return v; for (const z of W.zones) { if (!inZone(z, m.x, m.y)) continue; if (z.k === 'absorb') { if (kind === 'elec') v *= 0.5; if (kind === 'fire') v *= 0.4; } if (z.k === 'mist' && kind === 'fire') v *= 0.5; } return v; },
      // 걸음마다: 선 지대의 효과
      mageZones(W, m) {
        if (m.z >= 1) return;   // 떠 있으면 지대에 닿지 않는다 (v2.0, rules/flight)
        for (const z of W.zones) {
          if (!inZone(z, m.x, m.y)) continue;
          if (z.dps && z.src !== m && z.src.side !== m.side && !z.lured && W.t - (z.src.lureT ?? -9) < 3) { z.lured = 1; z.src.log.lure++; }   // 끌어들인 적이 내 지대에 들었다
          if (z.dps && (z.src !== m || z.k === 'h2s')) hurt(W, m, z.dps * DT, z.src === m ? null : z.src, z.n, z.k === 'fire' ? 'fire' : 'tox');
          if (z.k === 'fire' && !(m.st.wet > 0)) m.st.burn = Math.max(m.st.burn || 0, 1);
          if (z.k === 'nh3') { m.st.blind = Math.max(m.st.blind || 0, 0.3); m.st.cough = Math.max(m.st.cough || 0, 0.5); }
          if (z.k === 'spore') m.st.cough = Math.max(m.st.cough || 0, 0.5);
          if (z.k === 'acid') { m.st.blind = Math.max(m.st.blind || 0, 0.3); if (m.st.lime > 0) m.st.lime = 0; }   // 산이 석회를 녹인다
          if ((z.k === 'ice' || z.k === 'chill') && z.src !== m) m.st.chill = Math.max(m.st.chill || 0, 0.4);
          if (z.k === 'h2s') { m.h2sT = (m.h2sT || 0) + DT; if (m.h2sT > 1.5) m.st.stun = Math.max(m.st.stun || 0, 0.5); }
        }
      },
      // 걸음의 가속: 남의 빙판 위에선 1.5 (보통 9)
      accel(W, m, acc) { if (m.z >= 1) return acc; for (const z of W.zones) if (z.k === 'ice' && z.src !== m && inZone(z, m.x, m.y)) return 1.5; return acc; },
      // 지대의 시간, 산이 벽을 녹인다
      zoneTick(W) { for (const z of W.zones) { z.t -= DT; if (z.k === 'acid') for (const w of W.walls) if (hyp(w.x - z.x, w.y - z.y) < (z.r || 2) + w.r) { if (w.hp > 0 && w.hp <= 25 * DT && z.src.mlog) z.src.mlog.razed++; w.hp -= 25 * DT; } } },   // 녹여 없앤 벽은 지형 지표에 (v2.2)
    };
  },
};
