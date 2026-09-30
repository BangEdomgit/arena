'use strict';
/* 규칙: 줄어드는 소금 원 (rules.saltRing, 1.9.0, SPEC 2장)
 * 싸움터 가운데 중심, 15 s부터 60 s 동안 반지름 4 m까지 줄어든다. 선 밖에서 만들어지는 마법은 흩어지고(g = 0), 선 밖에 선 사람은 초당 6 마른다.
 * 두뇌: 선 1.5 m 안쪽으로 오면 가운데로 돌아간다 */
const { hyp } = require('../math');
const SALT = { t0: 15, dur: 60, rMin: 4, dps: 6 };
function saltR(W) { const R0 = hyp(W.width, W.height) / 2; return Math.max(SALT.rMin, R0 - Math.max(0, W.t - SALT.t0) * (R0 - SALT.rMin) / SALT.dur); }
const outSalt = (W, x, y) => W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > saltR(W);
module.exports = {
  name: 'saltRing', on: W => W.rules.saltRing, api: { SALT, saltR, outSalt },
  engine: X => ({
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return outSalt(W, p[0], p[1]); },   // 선 밖에선 마법이 서지 않는다
    mageStep(W, m) { if (outSalt(W, m.x, m.y)) X.hurt(W, m, SALT.dps * X.DT, null, '소금', 'salt'); },   // 선 밖에선 몸이 마른다
  }),
  brain: () => ({
    // 이동 마법(돌진·넘기·미끄럼)은 떨어질 자리가 선 1 m 안쪽일 때만, 제자리에 묶이는 시전은 선 2.5 m 안쪽에서만 (v2.0: 1.x에선 선 밖에서 말랐다)
    value(W, m, K, o) { const s = o.s; if (!(o.v > 0)) return;
      if (s.lock) { if (hyp(m.x - W.width / 2, m.y - W.height / 2) > saltR(W) - 2.5) o.v = 0; return; }   // 제자리에 묶이는 시전(저격)은 선 2.5 m 안쪽에서만
      if (s.t !== 'move') return; const dx = o.tx - m.x, dy = o.ty - m.y, l = hyp(dx, dy) || 1, x = m.x + dx / l * s.dist, y = m.y + dy / l * s.dist; if (hyp(x - W.width / 2, y - W.height / 2) > saltR(W) - 1) o.v = 0; },
    steer(W, m, K) { const cx = W.width / 2 - m.x, cy = W.height / 2 - m.y, dc = hyp(cx, cy) || 1; if (dc > saltR(W) - 1.5) { K.vx = cx / dc * 2.5; K.vy = cy / dc * 2.5; } },
  }),
};
