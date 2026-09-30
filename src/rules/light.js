'use strict';
/* 규칙: 빛 — 번쩍임·열선 (rules.light, v2.0 둘째 묶음, SPEC 25장, 마법은 data/spells/빛.json)
 * 손끝에서 만들어 곧바로 닿는다(장악권은 손끝만 본다, 피할 수 없다). 시야가 이어져야 하고(바위·벽·연기가 막는다), 연기·안개·비·흙먼지가 가린다.
 *   번쩍임(틀 flash): 사거리 안, 시야가 이어진 적 모두를 눈멀게 한다(blind × g, 연기 안경 × 0.5, 가림 × 0.4). 피해는 거의 없다
 *   열선(틀 beam): 예비동작 동안 핵이 빛나 보인다(읽힌다). 과녁 하나에 곧바로 닿는 열(에너지 피해 'heat', 몸 받침이 받는다).
 *     피해 = dmg × 위력 × g / (1 + 거리/L), 가림을 지나면 × 0.4. 유리 비단 거울(gear.mirror)이 있어야 책에 든다(core의 needGear)
 * 눈멀면 예비동작을 못 읽는다(두뇌 read 훅, 몸 묶기와 같은 뜻). 두뇌: 번쩍임·열선의 예비동작(빛이 오름)을 보면 가림(바위·벽) 뒤나 연기로 */
const { hyp } = require('../math');
const OBSC = { smoke: 1, mist: 1, rain: 1, absorb: 1 };   // 빛을 가리는 지대 (연기·흙먼지·안개·물 장막·비)
// 선분이 가리는 지대를 지나는가 (원이면 반지름, 선이면 길이의 반으로 넉넉히)
function veiled(W, x1, y1, x2, y2) {
  for (const z of W.zones) {
    if (!OBSC[z.k]) continue; const r = z.shape === 'circle' ? z.r : (z.len || 2) / 2;
    const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((z.x - x1) * dx + (z.y - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
    if (hyp(x1 + dx * t - z.x, y1 + dy * t - z.y) < r) return true;
  }
  return false;
}
module.exports = {
  name: 'light', switch: 'light', on: W => W.rules.light, form: { flash: 'self', beam: 'self' }, threat: { flash: 1, beam: 1 }, api: { veiled },
  types: X => ({
    flash(W, m, c, a) {
      const s = c.s, R = X.rangeOf(m, s), g = a.g; let n = 0;
      for (const q of a.foes) {
        if (X.hyp3(q.x - m.x, q.y - m.y, q.z - m.z) > R || X.blocked(W, m.x, m.y, q.x, q.y, m.z > q.z ? m.z : q.z)) continue;
        const k = (veiled(W, m.x, m.y, q.x, q.y) ? 0.4 : 1) * (q.gear.goggles ? 0.5 : 1) * g;
        q.st.blind = Math.max(q.st.blind, s.blind * k); q.cast = q.castB = null;   // 눈이 멀면 모으던 수를 놓친다
        X.hurt(W, q, s.dmg, m, s.n, s.kind); q.alog.blinded++; n++;
      }
      if (n) { X.hit(m, s); m.alog.flash++; m.alog.flashHit += n; }
      if (W.rec) W.fx.push(['f', m.x, m.y, R]);
    },
    beam(W, m, c, a) {
      const s = c.s, q = c.tgt; if (!q || q.hp <= 0) return;
      const d = X.hyp3(q.x - m.x, q.y - m.y, q.z - m.z); if (d > X.rangeOf(m, s) || X.blocked(W, m.x, m.y, q.x, q.y, m.z > q.z ? m.z : q.z)) return;
      const P = X.power(W, m, s) * a.g * (veiled(W, m.x, m.y, q.x, q.y) ? 0.4 : 1) / (1 + d / s.L);
      X.hurt(W, q, s.dmg * P, m, s.n, s.kind); X.hit(m, s);
      if (W.rec) W.fx.push(['z', m.x, m.y, q.x, q.y]);
    },
  }),
  // 두뇌: 틀의 값과 읽기
  brainTypes: B => ({
    flash(W, m, K, o) {
      const e = K.e, s = o.s; o.v = 0;
      if (!(K.d < B.C.rangeOf(m, s) && K.los) || e.st.blind > 0.3) return;
      // 눈먼 틈에 칠 무거운 수가 곧 있으면 먼저 번쩍인다 (무리 두뇌, 25장): 아니면 모으는 적의 수를 끊는 값
      const heavy = m.book.some(n => { const x = K.S[n]; return x && x.hit && x.hit.flat >= 50 && !((m.cd[n] || 0) > 0); });
      o.v = (heavy ? 1.3 : 0.35) + (e.cast || e.castB ? 0.4 : 0);
    },
    beam(W, m, K, o) {
      const e = K.e, s = o.s; o.v = 0;
      if (!(K.d < B.C.rangeOf(m, s) && K.los)) return;
      o.v = o.he * s.dmg * B.C.power(W, m, s) / (1 + K.d / s.L) / 20 / (o.Tw + 0.3);   // 20 = 실 한 줄 쯤의 값에 맞춘다
    },
  }),
  brain: B => ({
    read(W, m, K) { if (m.st.blind > 0) K.blindR = true; },   // 눈멀면 예비동작을 못 읽는다 (몸 묶기와 같은 뜻)
    // 빛이 오르는 것을 보면(번쩍임·열선의 예비동작, 나를 볼 수 있는 자리) 가림 뒤로 (바위·벽의 반대편)
    steer(W, m, K) {
      if (!m.tac.readCast || K.blindR || m.z >= 2) return;
      let q = null; for (const f of K.foes) { const c = f.cast; if (c && (c.s.t === 'flash' || (c.s.t === 'beam' && c.tgt === m)) && !B.C.blocked(W, f.x, f.y, m.x, m.y, 0)) { q = f; break; } }
      if (!q) return;
      let best = null, bd = 9; for (const o of W.obs) { const d = hyp(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; best = o; } } for (const o of W.walls) { const d = hyp(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; best = o; } }
      if (best) { const dx = best.x - q.x, dy = best.y - q.y, l = hyp(dx, dy) || 1, tx = best.x + dx / l * (best.r + 0.6), ty = best.y + dy / l * (best.r + 0.6); K.vx = (tx - m.x) * 2; K.vy = (ty - m.y) * 2; }
      m._ltT = W.t;
    },
    // 가림이 없으면 연기·안개로 (빛이 오르는 것을 본 뒤 1 s 안)
    value(W, m, K, o) { const s = o.s; if (W.t - m._ltT < 1 && s.t === 'zone' && s.z && (s.z.k === 'smoke' || s.z.k === 'mist' || s.z.k === 'absorb')) { o.v = Math.max(o.v, 1.2); o.tx = m.x; o.ty = m.y; } },
  }),
};
