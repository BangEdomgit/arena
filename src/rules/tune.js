'use strict';
/* 규칙: 손잡이 (rules.tune, v2.19, SPEC 43장, 수는 data/rules/tune.json)
 * 모든 마법에 같은 손잡이 셋 — 크기 z · 화력 f · 속도 v (2단계 = 지금 마법, 최대는 서클 maxCirc 이상) — 과 숨김 스위치(예비동작이 안 보이는 대신 시전 × 1.5, 위력 × 0.8).
 * 붙는 곳은 틀마다: 던지기(무게 × z³ × f·반지름 × z, 빠르기 × v) · 실(굵기 tw × z, 전하 E × f, 뻗는 빠르기 × v) · 구름·발밑·곡사(반지름 × z, 피해 × f, 지연·나는 시간 ÷ v)
 *   · 벽(반지름 × z, 체력 × f) · 함정(반지름 × z, 피해 × f, 터지기까지 ÷ v)
 * 비용: 에너지 E = z³ f (던지기는 × v²). 예비동작 × (sig + (1 − sig) E) (숨김 × 1.5), 당 × f, 머리 피로(풀 때) × log₂(1 + E) (숨김 × (1 + hide.heat)).
 * 드러남 v = E^(1/3) (cast.vis), 숨기면 × hide.vis(1/3). v가 1 아래면 과녁이 짓기 시작할 때 단계·거리에 따라 알아챈다(notice). 못 알아챈 시전(cast.unseen)은 읽는 쪽(hideCast 훅·반사 겹·잔기술·막기·수읽기)이 건너뛴다
 * 엔진: 훅 tune(방출 첫머리) — 손잡이를 돌린 시전(c.tk)은 손잡이가 박힌 마법 사본으로 푼다(세계마다 열쇠로 모아 둔다)
 * 값 = 맞을 가망 × 피해 ÷ (예비동작 + 닿는 때 + 0.25 + 더 쓴 당 ÷ 당 회복 + 더 쓴 머리 ÷ 머리 회복). 회복은 엔진 훅 gluRegen·fatRecover의 사슬로 그 자리에서 잰다
 * 두뇌 (tac.tune): 1 초보 2단계만 · 2 중급 2·3 · 3 상급 1·2·3·최대 · 4 대가 1·2·3·최대 · 5 전설 같게 + 속도만 사이를 잘라 씀 (최대는 메이트에만). 고른 마법 하나만 조합을 따지고 공격 방식으로 먼저 거른다(견제 1·2, 메이트 3·최대).
 *   기록 m.mlog.tune['이름#z?f?v?(h)'] (2단계 셋에 숨김이 없으면 세지 않는다) */
const P = require('../../data/rules/tune.json');
const { pow, log, exp, hyp } = require('../math');
const LN2 = log(2), TUNED = { proj: 1, thread: 1, area: 1, lob: 1, wall: 1, trap: 1 };
const energy = (s, z, f, v) => z * z * z * f * (s.t === 'proj' ? v * v : 1);
const near = (a, x) => { let b = 0; for (let i = 1; i < a.length; i++) if (Math.abs(a[i] - x) < Math.abs(a[b] - x)) b = i; return b + 1; };
const keyOf = (z, f, v, h) => 'z' + near(P.z, z) + 'f' + near(P.f, f) + 'v' + near(P.v, v) + (h ? 'h' : '');
// 알아채기 (v2.20): 드러남 v(= E^(1/3), 숨기면 × hide.vis)가 1 아래면 읽는 쪽의 단계와 거리에 따라 1 − e^(−k · v · 눈 · 가까움)로 알아챈다
function notice(W, v, e, d) {
  if (v >= 1 || !e) return true; const N = P.notice, L = e.tac.tune || 0, eye = N.eye[L] ?? N.eye[0], nr = d > N.near ? N.near / d : 1;
  return W.rng() < 1 - exp(-N.k * v * eye * (nr < N.far ? N.far : nr));
}
// 손잡이가 박힌 마법 사본
function make(s, z, f, v, h) {
  const t = Object.assign({}, s), E = energy(s, z, f, v), d = f * (h ? P.hide.pow : 1);
  switch (s.t) {
    case 'proj': t.m = (s.m || 0) * z * z * z * d; t.v = s.v * v; t.rad = (s.rad || 0.1) * z; if (s.hit && (s.hit.dmg || s.hit.flat)) { t.hit = Object.assign({}, s.hit); const k = pow(z * z * z * d * v * v, 0.75); if (t.hit.dmg) t.hit.dmg *= k; if (t.hit.flat) t.hit.flat *= k; } break;
    case 'thread': t.tw = z; t.E = s.E * d; break;
    case 'area': t.r = s.r * z; t.dmg = s.dmg * d; t.delay = s.delay / v; break;
    case 'lob': t.r = s.r * z; t.dmg = s.dmg * d; t.flight = s.flight / v; break;
    case 'wall': t.r = s.r * z; t.hp = s.hp * f; break;
    case 'trap': t.tr = Object.assign({}, s.tr, { r: s.tr.r * z, arm: 0.8 / v }); if (s.tr.dmg) t.tr.dmg = s.tr.dmg * d; break;
  }
  t.cost = s.cost * log(1 + E) / LN2 * (h ? 1 + P.hide.heat : 1);   // 숨기면 고리를 억누르느라 머리가 더 든다 (v2.20)   // 머리 피로는 풀 때 cost로 센다 (당은 짓기 시작할 때 이미 냈다)
  return t;
}
module.exports = {
  name: 'tune', switch: 'tune', api: { P, energy, make, keyOf, notice },
  engine: X => ({
    tune(W, m, c) {
      if (!c.tk) return; const C = W._tuneC || (W._tuneC = new Map()), k = c.s.n + '|' + c.tz + '|' + c.tf + '|' + c.tv + '|' + (c.hid ? 1 : 0);
      let t = C.get(k); if (!t) { t = make(c.s, c.tz, c.tf, c.tv, c.hid); C.set(k, t); } c.s = t;
    },
  }),
  brain: B => {
    const C = B.C, Z = P.z, F = P.f, V = P.v, AL = [];
    return {
      hideCast(W, q, c) { return !!c.unseen; },   // 알아채지 못한 예비동작은 안 보인다 (v2.20)
      commit(W, m, K, best, cast) {
        const L = m.tac.tune, s = best.s; if (!L || !TUNED[s.t] || s.big && !(K.pl && K.pl.mate)) return;   // 큰 한 방은 메이트에서만 손잡이를
        const pl = K.pl, mate = !!(pl && pl.mate && pl.n === s.n), poke = K.mode === 'poke', e = cast.tgt;
        // 쓰는 단계 (크기·화력), 속도는 최대가 없다
        const al = P.allow[L] || P.allow[1]; AL.length = 0; for (const i of al) if (i < 3 || m.circles >= P.maxCirc) AL.push(i);
        let lo = 0, hi = 2; if (poke) { lo = P.poke[0]; hi = P.poke[1]; } else if (mate) { lo = P.mate[0]; hi = P.mate[1]; }   // 최대는 메이트의 큰 한 방에만
        let any = false; for (const i of AL) if (i >= lo && i <= hi) any = true; if (!any) { lo = 0; hi = 2; }
        const d = hyp(cast.tx - m.x, cast.ty - m.y), lock = e ? Math.max(e.st.stun, e.st.root) : 0, vl = e ? hyp(e.vx, e.vy) : 0, rs = C.sizeOf(m, s), T0 = cast.T;
        const ext = s.t === 'thread' ? Math.min(d, C.rangeOf(m, s)) / (32 * (s.fast || 1)) / (W.rules.pace && m.C >= 8 ? 3 : 1) : 0;   // 예비동작에 접힌 실의 뻗는 시간 (빠른 판이면 3배 빠르다)
        const reach = s.t === 'thread' ? 0.6 * Math.min(rs, 2) + 0.2 : s.t === 'area' || s.t === 'lob' ? s.r * rs : s.t === 'proj' ? (s.rad || 0.1) * Math.min(rs, 3) + 0.5 : s.t === 'trap' ? s.tr.r * Math.min(rs, 2) : 1;
        let gR = W.rules.gluRegen ?? 1.2; const hg = W.H.gluRegen; for (let i = 0; i < hg.length; i++) gR = hg[i](W, m, gR);   // 당·머리가 돌아오는 빠르기: 더 쓴 당·머리를 시간으로 본다
        let hR = 4; const hf = W.H.fatRecover; for (let i = 0; i < hf.length; i++) hR = hf[i](W, m, hR);
        const sees = e && e.tac.readCast;   // 숨김은 상대가 예비동작을 읽을 때만 값이 있다
        let bv = -1e9, bz = 1, bf = 1, bvv = 1, bh = false;
        const value = (z, f, v, h) => {
          const E = energy(s, z, f, v), Tc = (T0 - ext) * (P.sig + (1 - P.sig) * E) * (h ? P.hide.cast : 1) + ext / v;
          const glu = best.cost * f; if (glu - best.cost > m.glu) return -1e9;
          const heat = s.cost * 1.6 * log(1 + E) / LN2 * (h ? 1 + P.hide.heat : 1); if (m.fat + heat > P.heatMax && E > 1) return -1e9;
          const land = s.t === 'area' ? s.delay / v : s.t === 'lob' ? s.flight / v : s.t === 'proj' ? d / (s.v * v) : 0, t = Tc + land;
          const seen = h || !sees ? land : t, need = lock >= t ? 0.3 : vl * seen * 0.5 + 0.3;
          const ph = s.t === 'wall' ? 1 : Math.min(1, reach * z / need), D = (s.t === 'thread' ? pow(f, 0.55) : s.t === 'proj' ? pow(E, 0.75) : s.t === 'wall' ? pow(z * f, 0.5) : f) * (h ? P.hide.pow : 1);
          const tr = (glu - best.cost) / (gR > 0.1 ? gR : 0.1) + (heat - s.cost * 1.6) / (hR > 0.1 ? hR : 0.1);   // 더 쓴 당·머리가 돌아오기까지 (덜 쓰면 그만큼 번다)
          return ph * D / Math.max(0.5 * (t + 0.25), t + 0.25 + tr) - P.heatW * Math.max(0, m.fat + heat - 60);
        };
        for (const iz of AL) { if (iz < lo || iz > hi) continue; for (const iff of AL) { if (iff < lo || iff > hi) continue; for (const iv of AL) { if (iv > 2) continue;
          for (let h = 0; h < (L >= P.hideFrom ? 2 : 1); h++) { const x = value(Z[iz], F[iff], V[iv], h === 1); if (x > bv + 1e-9) { bv = x; bz = Z[iz]; bf = F[iff]; bvv = V[iv]; bh = h === 1; } } } } }
        // 전설: 속도만 단계 사이를 잘라 쓴다 (확정 순간에 딱 맞게). 크기·화력은 단계로 (v2.20)
        if (L >= 5 && s.t !== 'wall') { const q = P.q; for (let v = V[0]; v <= V[2] + 1e-9; v += q) { const vq = Math.round(v / q) * q, x = value(bz, bf, vq, bh); if (x > bv + 1e-9) { bv = x; bvv = vq; } } }
        if (bz === 1 && bf === 1 && bvv === 1 && !bh) return;
        const E = energy(s, bz, bf, bvv);
        cast.T = (T0 - ext) * (P.sig + (1 - P.sig) * E) * (bh ? P.hide.cast : 1) + ext / bvv;
        m.glu -= best.cost * (bf - 1); cast.cost = best.cost * bf;
        cast.tz = bz; cast.tf = bf; cast.tv = bvv; cast.hid = bh; cast.vis = pow(E, 1 / 3); cast.tk = keyOf(bz, bf, bvv, bh);
        cast.unseen = !notice(W, cast.vis * (bh ? P.hide.vis : 1), e, d);   // 과녁이 알아챘나 (짓기 시작할 때 과녁의 눈으로 한 번)
        const T = m.mlog.tune || (m.mlog.tune = {}), k = s.n + '#' + cast.tk; T[k] = (T[k] || 0) + 1;
      },
    };
  },
};
