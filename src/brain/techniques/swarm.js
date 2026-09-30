'use strict';
/* 기술: 무리 (tac.swarm, 모두, v2.0 둘째 묶음 SPEC 25장) — 셋 넘는 편이 훨씬 선명한 적(선명도 3배 이상) 하나를 상대할 때만
 * 자리: 적의 장악권 반경(domainR × C) 바로 밖(+ 5 m)에 흩어져 선다: 내 마법의 사거리가 그보다 길면(총은 장악권과 상관없어 제자리). 동료와 4 m 안이면 서로 밀어낸다(뭉치면 구름 하나에 무너진다)
 *   총: 적이 멀리(50 m 넘게) 떠 있으면 쏘지 않으니(rules/army) 흩어지거나 가까운 바위·벽 뒤로
 * 값: 적이 눈멀었으면 무거운 수(한 방 45 이상) × 3, 동료가 번쩍임을 모으는 중이면 × 2 (읽지 못하는 틈에 동시에)
 *   적이 벽 뒤(시야 없음, 곁에 벽)면 곡사·박격포·산·물 × 2 */
const { C, hyp } = require('../util');
// 이 사람이 무리 싸움 중인가: 과녁이 선명도 3배 이상, 내 편이 셋 넘게 살아 있다. 장악권 반경이 있을 때만(rules.domainR)
function on(W, m, e) { if (!(m.tac.swarm && W.rules.domainR > 0 && e.C >= 3 * m.C)) return false; let n = 0; for (const q of W.ms) if (q.side === m.side && q.hp > 0 && ++n > 3) return true; return false; }
const heavyOf = s => s.hit && s.hit.flat >= 45;
function steer(W, m, K) {
  const e = K.e; if (!on(W, m, e) || K.stance === 'breakout' || m.flee) return;
  let R = 0; for (const n of m.book) { const s = K.S[n]; if (s && !s.mundane && s.role === '공격') { const r = C.rangeOf(m, s); if (r > R) R = r; } }   // 마법의 사거리만 (총은 장악권과 상관없다)
  const D = W.rules.domainR * e.C + 5, d = hyp(e.x - m.x, e.y - m.y) || 1, ux = (e.x - m.x) / d, uy = (e.y - m.y) / d;
  let vx = K.vx, vy = K.vy;
  const gun = m.book.some(n => { const s = K.S[n]; return s && s.mundane && s.t === 'proj'; });
  if (gun && e.z >= 2 && d > 50) {   // 탄을 아낀다: 가까운 가림 뒤로 (없으면 흩어진다)
    let best = null, bd = 15; for (const o of W.obs) { const q = hyp(o.x - m.x, o.y - m.y); if (q < bd) { bd = q; best = o; } } const ws = W.walls, a = ws.length ? C.wallsIn(W, m.x - 15, m.y - 15, m.x + 15, m.y + 15) : ws; for (let i = 0; i < a.length; i++) { const o = ws[a[i]]; const q = hyp(o.x - m.x, o.y - m.y); if (q < bd) { bd = q; best = o; } }
    if (best) { const ox = best.x - e.x, oy = best.y - e.y, ol = hyp(ox, oy) || 1, tx = best.x + ox / ol * (best.r + 0.6), ty = best.y + oy / ol * (best.r + 0.6); vx = tx - m.x; vy = ty - m.y; }
    else { vx = 0; vy = 0; }
  } else if (R > D) { const want = d - D; vx = ux * (want > 2 ? 1 : want < -1 ? -2 : 0) - uy * m.sf * 0.4; vy = uy * (want > 2 ? 1 : want < -1 ? -2 : 0) + ux * m.sf * 0.4; }   // 반경 바로 밖, 옆으로 돈다
  else return;
  for (const q of W.ms) { if (q === m || q.side !== m.side || q.hp <= 0) continue; const dx = m.x - q.x, dy = m.y - q.y; if (dx > 4 || dx < -4 || dy > 4 || dy < -4) continue; const l = hyp(dx, dy) || 0.1; if (l < 4) { vx += dx / l * (4 - l) * 0.5; vy += dy / l * (4 - l) * 0.5; } }   // 흩어진다
  K.vx = vx; K.vy = vy;
}
function value(W, m, K, o) {
  const e = K.e, s = o.s; if (!(o.v > 0) || !on(W, m, e)) return;
  if (heavyOf(s)) { if (e.st.blind > 0.2) o.v *= 3; else for (const q of W.ms) if (q.side === m.side && q !== m && q.hp > 0 && q.cast && q.cast.s.t === 'flash') { o.v *= 2; break; } }
  if (!K.los && W.walls.some(w => hyp(w.x - e.x, w.y - e.y) < 3) && (s.t === 'lob' || (s.t === 'zone' && s.z.k === 'acid') || s.el === '물')) o.v *= 2;   // 벽 뒤의 적
}
module.exports = { on, steer, value };
