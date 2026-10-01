'use strict';
/* 규칙: 줄어드는 소금 원 (rules.saltRing, 1.9.0, SPEC 2장)
 * 싸움터 가운데 중심, 15 s부터 60 s 동안 반지름 4 m까지 줄어든다. 선 밖에서 만들어지는 마법은 흩어지고(g = 0), 선 밖에 선 사람은 초당 6 마른다.
 * 두뇌: 선 1.5 m 안쪽으로 오면 가운데로 돌아간다
 * 스스로 죽지 않기 (v2.6, 판단 수준의 tac.survive, 선명도 5 이상, SPEC 30장): 안전 반경 = 1.5 s 뒤의 반지름 − 1.5 m − 지금 속도로 설 거리.
 *   모든 걸음이 정해진 뒤(두뇌 훅 bound) 바깥쪽 걸음을 지우고(벽을 따라 미끄러진다), 안전 반경 밖이면 안으로. 나는 사람은 설 수 있는 속도로 늦춘다.
 *   3 s 뒤의 반지름이 15 m 아래면 땅이 안전할 때(적에게 함정·안 보이는 구름·벽 밀기가 없을 때) 내려앉아 걷는다. 아니면 떠서 5 m/s 아래로. 여유는 min(1.5 m, 반지름 × 0.25). 구르기도 끝 자리가 선 밖이면 반대로, 그쪽도 밖이면 구르지 않는다 */
const { hyp } = require('../math');
const SALT = { t0: 15, dur: 60, rMin: 4, dps: 6 }, SAFE = { look: 1.5, pad: 1.5, padK: 0.25, land: 3, landR: 15, smallV: 5, flyA: 29.4, walkA: 20, backV: 8, roll: 0.3 };
function saltRAt(W, t) { const R0 = hyp(W.width, W.height) / 2; return Math.max(SALT.rMin, R0 - Math.max(0, t - SALT.t0) * (R0 - SALT.rMin) / SALT.dur); }
function saltR(W) { return saltRAt(W, W.t); }
const safeOn = m => m.tac.survive && m.C >= 5;
// 벽 (v2.6): 걸음 방향 (vx, vy)를 안전 반경에 맞춘다. 바깥쪽 몫을 지우고(벽을 따라 미끄러진다), 지금 속도로 설 거리까지 넣어 안전 반경 밖이면 안으로.
// 나는 사람: 밖이면 안으로 8 m/s까지, 안이면 둘레로 꺾을 수 있는 속도(√(a·R))로. 고칠 게 없으면 null
const WO = [0, 0];
function wallOf(W, m, vx, vy) {
  const rx = m.x - W.width / 2, ry = m.y - W.height / 2, r = hyp(rx, ry) || 0.01, ux = rx / r, uy = ry / r, fly = m.fly === 1 && m.z >= 1;
  const Rf = saltRAt(W, W.t + SAFE.look), a = fly ? SAFE.flyA : SAFE.walkA, Rs = Rf - Math.min(SAFE.pad, SAFE.padK * Rf), vr = m.vx * ux + m.vy * uy, brake = vr > 0 ? vr * vr / (2 * a) : 0;
  if (r + brake < Rs - 1) return null;
  const out = vx * ux + vy * uy; if (out > 0) { vx -= ux * out; vy -= uy * out; }
  const outside = r + brake >= Rs; if (outside) { const l = hyp(vx, vy); vx = vx * 0.5 - ux * (l > 1 ? l : 2); vy = vy * 0.5 - uy * (l > 1 ? l : 2); }
  if (fly) { if (outside) { if (m.fv < SAFE.backV) m.fv = SAFE.backV; } else { const cap = Math.sqrt(a * Rs); if (m.fv > cap) m.fv = cap; } }
  WO[0] = vx; WO[1] = vy; return WO;
}
// 반사 겹(rules/reflex)이 걸음을 덮을 때도: 덮은 걸음 방향(m.mv)을 고치고, 좁은 원에선 나는 속도도 늦춘다
function wall(W, m) { const o = wallOf(W, m, m.mv.x, m.mv.y); if (o) { m.mv.x = o[0]; m.mv.y = o[1]; } if (m.fly === 1 && m.fv > SAFE.smallV && saltRAt(W, W.t + SAFE.land) < SAFE.landR) m.fv = SAFE.smallV; }
// (x, y)가 안전 반경 안인가 (옆 튀기의 끝 자리)
function safeAt(W, x, y) { const Rf = saltRAt(W, W.t + SAFE.look); return hyp(x - W.width / 2, y - W.height / 2) < Rf - Math.min(SAFE.pad, SAFE.padK * Rf); }
const outSalt = (W, x, y) => W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > saltR(W);
module.exports = {
  name: 'saltRing', on: W => W.rules.saltRing, api: { SALT, SAFE, saltR, saltRAt, outSalt, wall, safeAt, safeOn },
  engine: X => ({
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return outSalt(W, p[0], p[1]); },   // 선 밖에선 마법이 서지 않는다
    mageStep(W, m) { if (outSalt(W, m.x, m.y)) X.hurt(W, m, SALT.dps * X.DT, null, '소금', 'salt'); },   // 선 밖에선 몸이 마른다
    // 선 밖으로 구르지 않는다 (v2.6): 끝 자리(구르는 속도 × 0.3 s)가 선 0.5 m 안쪽이 아니면 반대로, 그쪽도 밖이면 구르지 않는다
    roll(W, m, o) {
      if (!safeOn(m)) return; const l = hyp(o.dx, o.dy) || 1, k = o.v * SAFE.roll / l, cx = W.width / 2, cy = W.height / 2, R = saltR(W) - 0.5;
      if (hyp(m.x + o.dx * k - cx, m.y + o.dy * k - cy) < R) return;
      if (hyp(m.x - o.dx * k - cx, m.y - o.dy * k - cy) < R) { o.dx = -o.dx; o.dy = -o.dy; } else o.skip = true;
    },
  }),
  brain: B => ({
    // 이동 마법(돌진·넘기·미끄럼)은 떨어질 자리가 선 1 m 안쪽일 때만, 제자리에 묶이는 시전은 선 2.5 m 안쪽에서만 (v2.0: 1.x에선 선 밖에서 말랐다)
    value(W, m, K, o) { const s = o.s; if (!(o.v > 0)) return;
      if (s.lock) { if (hyp(m.x - W.width / 2, m.y - W.height / 2) > saltR(W) - 2.5) o.v = 0; return; }   // 제자리에 묶이는 시전(저격)은 선 2.5 m 안쪽에서만
      if (s.t !== 'move') return; const dx = o.tx - m.x, dy = o.ty - m.y, l = hyp(dx, dy) || 1, x = m.x + dx / l * s.dist, y = m.y + dy / l * s.dist; if (hyp(x - W.width / 2, y - W.height / 2) > saltR(W) - 1) o.v = 0; },
    steer(W, m, K) { const cx = W.width / 2 - m.x, cy = W.height / 2 - m.y, dc = hyp(cx, cy) || 1; if (dc > saltR(W) - 1.5) { K.vx = cx / dc * 2.5; K.vy = cy / dc * 2.5; } },
    // 단단한 벽 (v2.6): 안전 반경 밖으로 나가는 걸음을 지운다
    bound(W, m, K) {
      if (!safeOn(m)) return;
      if (saltRAt(W, W.t + SAFE.land) < SAFE.landR) { if (B.groundSafe(W, m)) m.flyWant = false; else if (m.fv > SAFE.smallV) m.fv = SAFE.smallV; }   // 좁은 원: 땅이 안전하면 내려앉아 걷고, 아니면 떠서 천천히
      const o = wallOf(W, m, K.vx, K.vy); if (o) { K.vx = o[0]; K.vy = o[1]; }
    },
  }),
};
