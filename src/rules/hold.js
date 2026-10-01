'use strict';
/* 규칙: 붙잡아 둔 설계 (rules.hold, v2.8, SPEC 32장, 수는 data/rules/hold.json)
 * 서클 = 머릿속에 동시에 붙잡는 설계의 층 수(WORLD 3-6). 두 번째 칸에 다 지은 공격을 풀지 않고 붙잡아 두었다가 틈이 오면 바로 푼다.
 * 엔진: 두 번째 칸의 시전에 hold가 붙었으면 다 지어도 풀지 않는다(엔진 훅 castHold). 붙잡은 동안 머리 피로가 초당 heat씩 든다. maxT를 넘기면 그때의 과녁 자리로 푼다.
 * 두뇌 (판단 수준의 tac.hold, 대가부터, 선명도 5 이상): 두 번째 칸에 공격을 붙잡아 둔다(몰아칠 때가 아니어도, 맞을 가망이 낮아도). 과녁의 빈틈이 닿는 때보다 길거나
 *   맞을 가망(날카롭게의 명중 가망)이 go 넘으면 그때의 과녁 자리로(닿는 동안의 걸음을 넣어) 푼다 */
let SH = null;   // 날카롭게의 빈틈·명중 가망 (두뇌를 처음 부를 때 읽는다: 엔진이 규칙 목록을 읽을 때 두뇌는 아직 없다)
const P = require('../../data/rules/hold.json');
const on = m => m.tac.hold && m.C >= 5;
module.exports = {
  name: 'hold', switch: 'hold', default: true, on: W => !!W.rules.hold, api: { P },
  engine: X => ({
    castHold(W, m, c) {
      if (!c.hold || c.go) return false;
      if (W.t > c.holdUntil) { const e = c.tgt; if (e && e.hp > 0) { c.tx = e.x; c.ty = e.y; } return false; }   // 너무 오래: 그때의 과녁 자리로 푼다
      if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + P.heat * W.dt);
      return true;
    },
  }),
  brain: B => {
    const { landDelay } = B;
    return {
      // 붙잡은 수를 풀 때: 과녁의 빈틈이 닿는 때보다 길거나, 맞을 가망이 높다 (판단 때마다, 칸 고르기 앞이라 두 칸이 차 있어도 본다)
      cancel(W, m, K) {
        const c = m.castB; if (!c || !c.hold || c.go || c.t < c.T || !on(m)) return;
        const e = K.e; if (!e) return; const sharp = SH || (SH = require('../brain/techniques/sharp'));
        const land = landDelay(c.s, K.d), win = sharp.openFor(W, e), ch = sharp.chance(W, m, K, { n: c.s.n, he: 0.35 }, land);
        if (!(win > land || ch >= P.go)) return;
        const lead = land * (K.lead || 1); c.tx = e.x + e.vx * lead * 0.7; c.ty = e.y + e.vy * lead * 0.7; c.tgt = e; c.go = true; m.mlog.held++;
      },
      // 두 번째 칸에 고른 공격은 붙잡는다
      commit(W, m, K, best, cast, Tc) {
        if (!on(m) || !cast.B || !B.OFF[best.s.t] || best.s.t === 'cone' || best.s.t === 'touch') return;
        cast.hold = true; cast.go = false; cast.holdUntil = W.t + Tc + P.maxT;
      },
    };
  },
};
