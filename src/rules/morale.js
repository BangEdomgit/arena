'use strict';
/* 규칙: 사기 (rules.morale, v2.0 둘째 묶음, SPEC 25장, 수는 data/rules/army.json의 morale)
 * 셋 이상인 편만. 0.5 s마다 도망칠 확률 = (편 사상자 몫 − 0.2) × 2 (넘을 때만) + 충격 × 0.35, 을 단단함으로 나눈다.
 *   충격: 10 m 안의 동료가 큰 수(한 방 50 이상)에 쓰러질 때마다 + 1, 초당 반으로 준다
 *   단단함 = √C × 판단 단계(초보 1, 중급 1.3, 상급 1.6, 대가 2, 전설 2.5, 없으면 1): 병사 0.55, 평범 1, 대마법사 3.2
 * 도망치는 사람은 가장 가까운 싸움터 끝으로 달리고 공격하지 않는다(alog.fledT = 도망을 시작한 때). 끝에 닿으면 싸움에서 빠진다(체력 0으로 센다, alog.fled) */
const { hyp, pow } = require('../math');
const M = require('../../data/rules/army.json').morale;
const hard = m => Math.sqrt(Math.max(m.C, 0.01)) * (m.skill ? M.skill[m.skill] || 1 : 1);
module.exports = {
  name: 'morale', switch: 'morale', on: W => W.rules.morale, api: { hard },
  engine: X => ({
    world(W) {
      if (!W._sideN) { W._sideN = []; for (const m of W.ms) W._sideN[m.side] = (W._sideN[m.side] || 0) + 1; }
      const every = Math.round(M.every / X.DT); if (W.step % every) return;
      const down = []; for (const m of W.ms) if (m.hp <= 0) down[m.side] = (down[m.side] || 0) + 1;
      const k = pow(M.decay, M.every);   // 충격은 초당 반으로
      for (const m of W.ms) {
        if (m.hp <= 0 || m.flee || W._sideN[m.side] < M.minSide) continue;
        const cas = (down[m.side] || 0) / W._sideN[m.side], p = (cas > M.cas ? (cas - M.cas) * M.casK : 0) + m.shock * M.shock;
        m.shock *= k;
        if (p > 0 && W.rng() < p / hard(m) * M.every) { m.flee = 1; m.alog.fledT = W.t; m.cast = m.castB = m.chan = null; }   // fledT: 도망을 시작한 때
      }
    },
    // 동료가 큰 수에 쓰러졌다
    hurt(W, m, v, src, name, kind) {
      if (m.hp > 0 || v < M.shockDmg || W._sideN == null || W._sideN[m.side] < M.minSide) return;
      for (const q of W.ms) if (q !== m && q.hp > 0 && q.side === m.side && hyp(q.x - m.x, q.y - m.y) < M.shockR) q.shock += 1;
    },
    // 끝에 닿으면 빠진다
    mageStep(W, m) {
      if (!m.flee) return; const e = M.edge;
      if (m.x < e || m.y < e || m.x > W.width - e || m.y > W.height - e) { m.alog.fled = 1; m.hp = 0; m.deathT = W.t; }
    },
  }),
  brain: () => ({
    // 도망: 가장 가까운 끝으로 곧장, 쏘지 않는다
    steer(W, m, K) { if (!m.flee) return; const dl = m.x, dr = W.width - m.x, dt = m.y, db = W.height - m.y, mn = Math.min(dl, dr, dt, db); K.vx = mn === dl ? -3 : mn === dr ? 3 : 0; K.vy = mn === dt ? -3 : mn === db ? 3 : 0; if (!K.vx && !K.vy) K.vx = 3; },
    rest(W, m, K, restNow) { return restNow || !!m.flee; },
  }),
};
