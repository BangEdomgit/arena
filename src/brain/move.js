'use strict';
/* 숨 결투장 — 두뇌 3: 움직임
 * 입장대로 걷는다(돌파·거리 두기·선호 거리와 옆걸음). 기술(엄폐·자리·유도)이 더하고, 규칙의 훅(소금 원 steer, 화약통 avoid)이 고친다.
 * 피하기가 이기고, 알아챈 함정과 내 지연 폭발은 늘 비킨다. 걸음 방향은 K.vx·K.vy를 거쳐 기술·훅이 함께 고친다 */
const { hyp } = require('./util');
const cover = require('./techniques/cover'), position = require('./techniques/position'), lure = require('./techniques/lure');
const swarm = require('./techniques/swarm'), siege = require('./techniques/siege'), hazard = require('./techniques/hazard');
function steer(W, m, K) {
  const { foes, prefR, d, ux, uy, dodge, stance, escape } = K;
  let vx = 0, vy = 0;
  if (stance === 'breakout') { vx = escape.dir.dx * 2.5; vy = escape.dir.dy * 2.5; }
  else if (stance === 'kite') {
    let rx = 0, ry = 0; for (const q of foes) { const dq = hyp(m.x - q.x, m.y - q.y) || 1; if (dq < 14) { rx += (m.x - q.x) / dq / dq; ry += (m.y - q.y) / dq / dq; } }
    rx += (m.x < 5 ? 0.3 : 0) - (m.x > W.width - 5 ? 0.3 : 0); ry += (m.y < 5 ? 0.3 : 0) - (m.y > W.height - 5 ? 0.3 : 0);
    const l = hyp(rx, ry) || 1; vx = rx / l * 2 - ry / l * 0.6 * m.sf; vy = ry / l * 2 + rx / l * 0.6 * m.sf;
  } else {
    const pr = stance === 'hold' ? d : prefR;
    if (d > pr + 1) { vx += ux; vy += uy; } else if (d < pr - 1) { vx -= ux; vy -= uy; }
    if (W.rng() < 0.02) m.sf *= -1; const sw = stance === 'hold' ? 0.3 : 0.8; vx += -uy * m.sf * sw; vy += ux * m.sf * sw;
    K.vx = vx; K.vy = vy;
    const covering = cover.steer(W, m, K);   // 엄폐 (상급)
    position.terrain(W, m, K, covering);     // 자리 판단 (대가)
    vx = K.vx; vy = K.vy;
  }
  K.vx = vx; K.vy = vy;
  lure.steer(W, m, K);   // 유도 (대가), 약한 척 물러서기 (전설)
  swarm.steer(W, m, K);  // 무리: 장악권 바로 밖에 흩어져 선다 (v2.0 둘째)
  siege.steer(W, m, K);  // 성: 총 앞에서 벽 뒤·장전 틈, 멀리 떠서 깎기, 물러나기 (v2.0 둘째)
  vx = K.vx; vy = K.vy;
  if (dodge && stance !== 'breakout') { const l = hyp(dodge.x, dodge.y) || 1; vx = dodge.x / l * 2; vy = dodge.y / l * 2; }
  else if (K.brk > W.t) { vx = K.brkX; vy = K.brkY; }   // 그물 깨기 (수읽기, v2.15)
  // 소금 원: 선 가까이 오면 가운데로 (rules/saltRing). 피하기 걸음보다 뒤: 지대를 피하다 선 밖으로 나가 마르지 않게 (v2.0, 1.x에선 피하기가 이겼다)
  K.vx = vx; K.vy = vy; const hs = W._bh.steer; for (let i = 0; i < hs.length; i++) hs[i](W, m, K);
  vx = K.vx; vy = K.vy;
  for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < t.r + 1.2) { const l = hyp(m.x - t.x, m.y - t.y) || 1; vx += (m.x - t.x) / l * 1.5; vy += (m.y - t.y) / l * 1.5; }
  K.vx = vx; K.vy = vy; const ha = W._bh.avoid; for (let i = 0; i < ha.length; i++) ha[i](W, m, K);   // 화약통 곁을 비킨다 (rules/barrels)
  vx = K.vx; vy = K.vy;
  // 내가 떨어뜨린 지연 폭발 안으로 걸어 들어가지 않는다. 돌파 중에도 (v1.0.1)
  for (const a of W.areas) if (a.src === m && hyp(a.x - m.x, a.y - m.y) < a.r + 1) { const l = hyp(m.x - a.x, m.y - a.y) || 1; vx = (m.x - a.x) / l * 2.5; vy = (m.y - a.y) / l * 2.5; }
  // 단단한 벽: 모든 걸음이 정해진 뒤 규칙이 막는다 (소금 원의 안전 반경·과열 전 착지, v2.6). 훅이 없으면 그대로
  const hb = W._bh.bound; if (hb.length) { K.vx = vx; K.vy = vy; for (let i = 0; i < hb.length; i++) hb[i](W, m, K); vx = K.vx; vy = K.vy; }
  if (m.tac.hazard) { K.vx = vx; K.vy = vy; hazard.bound(W, m, K); vx = K.vx; vy = K.vy; }   // 내 위험 지대 비키기 (v2.21): 내 지연 폭발·곡사, 낮은 체력의 소금 원 여유
  m.mv.x = vx; m.mv.y = vy;
}
module.exports = { steer };
