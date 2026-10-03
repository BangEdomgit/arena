'use strict';
/* 규칙: 장악권 경계 (rules.edgeCancel, v2.30.1, SPEC 53장 끝, 수는 data/rules/edgeCancel.json) — 기본 꺼짐
 * 잰 원인: 상위 무리의 헛시전 430 가운데 366은 짓기 시작할 때 이미 서는 자리의 장악 계수가 0.3 아래였다(값 × g로 깎일 뿐 고르긴 했다).
 *   나머지는 짓는 동안 과녁이 다가와(대마법사의 장악권은 움직인다) 서는 자리가 장악권 안이 된 것이다
 * 과녁이 나보다 ratio배 넘게 선명하면(합창이 맞춰진 사람은 빼고, v2.32)
 *   짓지 않는다: 서는 자리의 장악 계수가 gStart 아래인 수는 값 0
 *   끊고 물러난다: 짓는 중에 서는 자리의 장악 계수가 gCut 아래로 떨어지면 끊고(당 70% 돌려받음), back s 동안 과녁 반대쪽으로 */
const P = require('../../data/rules/edgeCancel.json');
const BACK = new WeakMap();   // 사람 → 물러나는 끝 시각
const CH = require('./chorus').api;
const strong = (W, m, e) => !!e && e.hp > 0 && e.C > m.C * P.ratio && !(W.rules.chorus && CH.of(W, m));   // 합창이 맞춰진 조는 합창의 선명도로 장악권 안에도 설 수 있다 (v2.32)
module.exports = {
  name: 'edgeCancel', switch: 'edgeCancel', api: { P },
  brain: B => {
    const undo = B.lib.undo, C = B.C;
    return {
      valueLate(W, m, K, o) { const s = o.s; if (!(o.v > 0) || s.mundane || !B.OFF[s.t] || !strong(W, m, K.e)) return; if (C.gAt(W, m, s, o.tx, o.ty) < P.gStart) o.v = 0; },
      cancel(W, m, K) {
        const c = m.cast; if (!c || c.auto || c.s.mundane || !B.OFF[c.s.t] || !strong(W, m, c.tgt || K.e) || c.T - c.t < P.minLeft) return;
        if (C.gAt(W, m, c.s, c.tx, c.ty) >= P.gCut) return;
        undo(m, c); BACK.set(m, W.t + P.back);
      },
      steer(W, m, K) {
        const t = BACK.get(m); if (t === undefined || W.t > t || K.dodge || m.flee) return; const e = K.e; if (!e) return;
        const dx = m.x - e.x, dy = m.y - e.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * P.v; K.vy = dy / l * P.v;
      },
    };
  },
};
