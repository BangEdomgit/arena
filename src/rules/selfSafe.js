'use strict';
/* 규칙: 스스로 다치지 않기 (rules.selfSafe, v2.30, SPEC 53장, 수는 data/rules/selfSafe.json) — 기본 꺼짐. 모든 단계의 바탕 위험 피하기
 * 낮은 단계(평범·중간)가 스스로 입은 피해는 거의 둘이었다: 큰 수를 모으다 맞은 역류(22, rules/risk)와 고르지 않은 파도(rules/wave). 그래서
 *   머리: 풀 때 머리가 넘칠(폭주·고르지 않은 파도) 수는 고르지 않고, 고르지 않은 파도에 올랐으면 위협이 없을 때 쉬어 내려온다 (상위의 '스스로 죽지 않기'를 누구나)
 *   큰 수: 겨눠진 동안·적이 near m 안에 있을 땐 모으지 않는다. 모으는 중에 닿을 위협을 보면(남은 시간이 cancelT s 넘게) 끊는다(당 70% 돌려받음) */
const P = require('../../data/rules/selfSafe.json');
module.exports = {
  name: 'selfSafe', switch: 'selfSafe', api: { P },
  brain: B => {
    const { heatOver, castTime, landDelay, hyp } = B, undo = B.lib.undo;
    const near = (W, m) => { const f = W.foes[m.side]; for (let i = 0; i < f.length; i++) { const q = f[i]; if (q.hp > 0 && !q.flee && hyp(q.x - m.x, q.y - m.y) < P.near) return true; } return false; };
    return {
      valueLate(W, m, K, o) {
        if (!(o.v > 0)) return; const s = o.s;
        if (!(m.tac.survive && m.C >= 5)) { const Bs = K.slot === 'B', other = Bs ? m.cast : m.castB, extra = other && !other.auto ? other.s.cost * (other.B ? 1.3 : 1) : 0;
          if (heatOver(W, m, o.cost + extra, castTime(W, m, o.Tw), 1)) { o.v = 0; return; } }
        if (s.big && W.rules.risk && (K.aimed || near(W, m))) o.v = 0;
      },
      cancel(W, m, K) {
        const c = m.cast; if (!c || !c.s.big || !W.rules.risk || c.T - c.t < P.cancelT) return;
        const th = K.threat; let hit = false;
        if (th && th.T - th.t + landDelay(th.s, hyp(th.tx - m.x, th.ty - m.y) + 0.5) < c.T - c.t) hit = true;
        else if (K.aimed && !th) hit = true;   // 날아오는 투사체
        if (hit) undo(m, c);
      },
      rest(W, m, K, r) { return r || (!(m.tac.survive && m.C >= 5) && W.rules.wave && m.wave && !(m.tac.waveChoose && m.waveWant) && !K.aimed); },
    };
  },
};
