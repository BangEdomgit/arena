'use strict';
/* 규칙: 서클 (rules.circles, 기본 켬, SPEC 6장)
 * 두 번째 칸(서클 2부터): 첫 칸을 모으는 동안 하나 더 (당·피로 × 1.3). 자동 진(서클 3부터): 생각 없이 막는다(간격 0.7 × 3 / 서클).
 * 끄면 누구나 서클 1 */
module.exports = {
  name: 'multiSlot', switch: 'circles', on: W => W.rules.circles,
  brain: B => {
    const { C, hyp, logDec, bigAttack, heatOver } = B;
    return {
      circles(W, q) { return q.circles; },
      // 자동 진: 3서클부터, 생각 없이 막는다. 방패 아끼기(상급)면 큰 공격에만. 앞 방패·벽은 투사체·실만 막는다
      react(W, m, K) {
        const { S, T, e, threat, late, aimed, bigThreat, empty, circ } = K;
        const th = threat || late, bigTh = late && !threat ? (!T.shieldSave || (bigAttack(late, S) && (late.s.t === 'proj' || late.s.t === 'thread'))) : bigThreat;
        if (!(!empty && circ >= 3 && (aimed && threat || late) && th && bigTh && th.T - th.t < 0.4 && m.autoCd <= 0)) return;
        for (const n of m.book) {
          const s = S[n]; if ((m.cd[n] || 0) > 0) continue;
          if (!((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot')) continue;
          if (s.t === 'shoot' && !W.proj.some(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < 6)) continue;
          const cost = s.cost * 1.2; if (m.glu < cost) continue;
          if (m.tac.survive && m.C >= 5 && heatOver(W, m, s.cost, 0, 0.8)) continue;   // 스스로 죽지 않기 (v2.6): 머리가 넘칠 막기는 하지 않는다
          m.glu -= cost; m.cd[n] = s.cd; m.autoCd = 0.7 * 3 / circ;
          logDec(m, s, 'auto', { aimed: true });
          C.release(W, m, { s, tx: e.x, ty: e.y, tgt: e, t: 0, T: 0, auto: true });
          break;
        }
      },
    };
  },
};
