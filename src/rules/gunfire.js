'use strict';
/* 규칙: 총의 쏨 (rules.gunfire, v2.25, SPEC 48장, 수는 data/rules/gunfire.json) — 기본 꺼짐, 규칙 묶음 '지금'이 켠다
 * 따라 겨누기: 병사는 방아쇠를 당길 때까지 과녁을 눈으로 따라가고 움직이는 과녁은 앞질러 겨눈다. 방아쇠는 풀기 lag s 전(화승이 타는 동안은 못 고친다):
 *   그때 과녁의 자리 + 속도 × (lag + 날아갈 시간)을 겨눈다. 그사이 꺾으면 빗나간다. 겨눈 곳에서 R m 넘게 벗어난 과녁은 놓친다(처음 겨눈 곳 그대로).
 *   흔들림은 그대로 총이 정한다(core)
 * 총알은 마력이 아니다: 빠른 판의 떡대·막기(rules/pace)와 잔기술(rules/passive)은 마력 없는 총알을 줄이지 않는다(그 두 규칙이 이 스위치를 본다).
 *   굳은 살(rules/body)은 몸이라 그대로 뺀다
 * 대마법사의 총 대응 (v2.26.1, 선명도 alert.cMin 이상):
 *   놀람 → 반사: 총이 alert.hear m 안에서 울리거나(소리·섬광) 총알이 alert.near m 안을 지나거나 맞으면 alert.after s 뒤부터 총을 안다. 그다음부터 자동 진(서클 3부터)이
 *     alert.lead s 안에 alert.r m 안으로 지나갈 총알을 보면 앞 방패(반사로 서는 buff front)를 그 쪽으로 세운다(당 × 1.2, 자동 진 간격).
 *     방패가 서 있으면 그 총알 쪽으로 돌린다(굳으면 못 한다)
 *     처음 놀라면 한 번 튀어오른다(날기 끊기의 튀어오르기, alert.hop): 총알은 쏠 때의 과녁 높이를 겨눈다
 *   맞으면 쓸기: 총에 맞은 뒤 sweep.t s 동안 넓은 마법(지연 폭발·곡사·지대·뿜기)의 값 × sweep.k (장전하는 15~20 s 동안 줄을 쓴다) */
const P = require('../../data/rules/gunfire.json');
const isGun = (W, name) => { const s = W.spells[name]; return !!(s && s.mundane); };
const AIM = new WeakMap();   // 시전 → 방아쇠를 당길 때 정한 겨눔 [x, y] (쏠 때만 생긴다)
const AL = new WeakMap();   // 세계 → { al: Map(사람 → 총을 안 때), hit: Map(사람 → 마지막으로 총에 맞은 때) }
const alOf = W => { let a = AL.get(W); if (!a) AL.set(W, a = { al: new Map(), hit: new Map(), hop: new Set() }); return a; };
const WIDE = { area: 1, lob: 1, zone: 1, cone: 1 };
// 놀람과 반사 방패: 총알이 곁을 지나면 놀라고(alert.after s 뒤 반사), 그다음부터 닿을 총알에 앞 방패
function shield(X, W, m) {
  const A = P.alert, a = alOf(W), t0 = a.al.get(m); let hot = null, ht = 9;
  if (t0 !== undefined && A.hop && W.t - t0 >= A.after && !a.hop.has(m) && m.st.stun <= 0 && W.rules.flight) { a.hop.add(m); if (m.fly === 1 || m.fly === 0) m.cut.w = 3; }   // 놀라 튀어오른다: 총알은 쏠 때의 높이를 겨눴다
  for (const p of W.proj) { if (!p.s.mundane || p.src.side === m.side) continue;
    const rx = m.x - p.x, ry = m.y - p.y, vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv; if (t < 0 || t > A.lead) continue;
    const mx = p.x + p.vx * t - m.x, my = p.y + p.vy * t - m.y, d2 = mx * mx + my * my;
    if (t0 === undefined && d2 < A.near * A.near) { a.al.set(m, W.t); return; }
    if (d2 < A.r * A.r && t < ht) { ht = t; hot = p; } }
  if (!hot || t0 === undefined || W.t - t0 < A.after || m.circles < 3 || m.st.stun > 0) return;
  if (m.buf.front && m.buf.front.t > 0.05) { m.aim = X.atan2(hot.y - m.y, hot.x - m.x); return; }   // 선 방패는 반사로 총알 쪽을 향한다
  if (m.autoCd > 0) return;
  for (const n of m.book) { const s = W.spells[n]; if (!s || s.t !== 'buff' || !s.b || !s.b.front || !s.react || (m.cd[n] || 0) > 0) continue;
    const cost = s.cost * 1.2; if (m.glu < cost) continue;
    m.glu -= cost; m.cd[n] = s.cd; m.autoCd = 0.7 * 3 / m.circles; m.mlog.gunShield++;
    X.release(W, m, { s, tx: hot.src.x, ty: hot.src.y, tgt: hot.src, t: 0, T: 0, auto: true }); return; }
}
module.exports = {
  name: 'gunfire', switch: 'gunfire', api: { P, isGun },
  engine: X => ({
    mageStep(W, m) {
      if (m.C >= P.alert.cMin && m.hp > 0) shield(X, W, m);
      const c = m.cast; if (!c || !c.s.mundane || c.s.t !== 'proj' || c.T - c.t > P.lag || AIM.has(c)) return;
      const q = c.tgt; if (!q || q.hp <= 0) return;
      const d = X.hyp(q.x - m.x, q.y - m.y), k = (c.T - c.t > 0 ? c.T - c.t : 0) + d / c.s.v;   // 남은 화승 + 날아갈 시간
      AIM.set(c, [q.x + q.vx * k, q.y + q.vy * k]);
    },
    release(W, m, c) { if (!c.s.mundane) return; const a = alOf(W); for (const q of W.foes[m.side]) if (q.C >= P.alert.cMin && q.hp > 0 && !a.al.has(q) && X.hyp(q.x - m.x, q.y - m.y) < P.alert.hear) a.al.set(q, W.t); },   // 총소리·섬광에 놀란다
    hurt(W, m, v, src, name) { if (src && m.C >= P.alert.cMin && isGun(W, name)) { const a = alOf(W); a.hit.set(m, W.t); if (!a.al.has(m)) a.al.set(m, W.t); } },
    track(W, m, c) {
      if (!c.s.mundane || c.s.t !== 'proj') return; const a = AIM.get(c); if (!a) return;
      if (X.hyp(a[0] - c.tx, a[1] - c.ty) < P.R) { c.tx = a[0]; c.ty = a[1]; }
    },
  }),
  brain: () => ({
    // 총에 맞은 뒤 장전하는 동안 넓은 마법으로 줄을 쓴다
    valueLate(W, m, K, o) { if (!(o.v > 0) || m.C < P.alert.cMin || !WIDE[o.s.t]) return; const h = alOf(W).hit.get(m); if (h !== undefined && W.t - h < P.sweep.t) o.v *= P.sweep.k; },
  }),
};
