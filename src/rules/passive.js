'use strict';
/* 규칙: 잔기술 — 패시브와 순간 켜기 (rules.passives, v2.18, SPEC 42장, 수는 data/rules/passive.json)
 * 기본 꺼짐, 대마법사 결투 장면이 켠다. 선명도 cMin 이상이고 판단 수준 tac.passive가 있는 사람만, 한 번에 하나.
 *   1 절연 막(전기) · 2 굳은 살(둔기) · 3 열 차단(불·열): 맞는 피해만 × k. 절연 막은 전기 굳힘의 길이도 × stunK (effHold)
 *   상태 st.psv(켠 잔기술, 0 꺼짐)·st.psvT(켠 뒤 지난 시간). onT s가 지나야 막는다(순간 켜기). 끄면 cd s는 다시 못 켠다(바꿔 끼우기도 끄고 켜기)
 *   켜 둔 대가: 서클 하나(두뇌 훅 circles), 머리 열 초당 heat. 머리가 fatOff를 넘으면 꺼진다. 굳어도 꺼지지 않지만 굳은 동안 바꾸지 못한다
 *   켜진 판에선 빠른 판의 일반 막기(rules/pace)는 쉰다. 기록은 막기의 것(mlog.guardN·guardT·guardBlk·gdOn·gdOff·gdOk)을 그대로
 * 두뇌 (tac.passive): 1 중급 늘 켬(상대 책의 공격 가운데 가장 많은 종류) · 2 상급 바꿔 낌(보이는 위협 → 상대가 마지막에 푼 공격 → 책)
 *   · 3 대가 위협이 lead s 안에 닿을 때만 · 4 전설 같게, 더 짧은 lead (맞기 직전에만) */
const P = require('../../data/rules/passive.json'), GF = require('./gunfire').api;
const KIND = {}; P.kinds.forEach((ks, i) => { for (const k of ks) KIND[k] = i + 1; });   // 피해 종류 → 잔기술
const HOLD = new WeakMap();   // 사람 → { t: 절연 막을 켜 둘 때까지, n: 켜 둔 번 수 } (v2.36)
const on = (W, m) => m.C >= P.cMin && m.tac.passive > 0;
const kindOf = s => s.t === 'thread' ? 'elec' : (s.kind || (s.hit && s.hit.kind) || 'blunt');   // 이 마법의 피해 종류 (실은 전기, 투사체는 맞힘의 것)
const psvOf = s => KIND[kindOf(s)] || 0;
const active = m => m.st.psv > 0 && m.st.psvT >= P.onT;
function off(W, m) { if (!(m.st.psv > 0)) return; m.st.psv = 0; m.st.psvT = 0; m.mlog.guardN++; m.mlog.gdOff = W.t; }
function turnOn(W, m, p) { if (m.st.psv === p) return; if (m.st.psv > 0) { off(W, m); return; } if (W.t - m.mlog.gdOff < P.cd || m.st.stun > 0 || m.fat > P.fatOff - 5) return; m.st.psv = p; m.st.psvT = 1e-6; m.mlog.guardN++; m.mlog.gdOn = W.t; }
module.exports = {
  name: 'passive', switch: 'passives', api: { P, KIND, kindOf, psvOf, active, on, holdN: m => (HOLD.get(m) || { n: 0 }).n },
  engine: X => ({
    hurtMod(W, m, v, kind, name) {
      if (!active(m) || KIND[kind] !== m.st.psv || (W.rules.gunfire && GF.isGun(W, name))) return v;   // 총알은 마력이 아니다 (rules/gunfire, v2.25)
      m.mlog.guardBlk += v * (1 - P.k); if (m.st.psvT < P.okT && m.mlog.gdOkC !== m.mlog.gdOn) { m.mlog.gdOk++; m.mlog.gdOkC = m.mlog.gdOn; }   // 순간 켜기 성공
      return v * P.k;
    },
    effHold(W, m, o, g) { return o.kind === 'elec' && o.stun && active(m) && m.st.psv === 1 ? g * P.stunK : g; },   // 절연 막: 전기 굳힘이 짧다
    mageStep(W, m) {
      if (!(m.st.psv > 0)) return;
      m.st.psvT += W.dt; m.mlog.guardT += W.dt; m.fat += P.heat * W.dt;
      if (m.fat > P.fatOff || m.hp <= 0) off(W, m);
    },
  }),
  brain: B => {
    // 가장 먼저 닿는 위협의 잔기술 (within s 안). 없으면 0
    function threat(W, m, K, within) {
      let best = within, p = 0;
      for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || !B.OFF[c.s.t]) continue; const t = c.T - c.t; if (t >= best) continue; if (c.tgt === m || B.C.hyp(c.tx - m.x - m.vx * t, c.ty - m.y - m.vy * t) < P.near + (c.s.r || 0)) { best = t; p = psvOf(c.s); } }
      for (const a of W.areas) if (a.src.side !== m.side && a.t < best && B.C.hyp(a.x - m.x - m.vx * a.t, a.y - m.y - m.vy * a.t) < a.r + 0.6) { best = a.t; p = psvOf(a.s); }
      for (const pr of W.proj) { if (pr.dead || !pr.src || pr.src.side === m.side) continue; const dx = m.x - pr.x, dy = m.y - pr.y, v2 = pr.vx * pr.vx + pr.vy * pr.vy; if (!v2) continue; const t = (dx * pr.vx + dy * pr.vy) / v2; if (t > 0 && t < best && B.C.hyp(pr.x + pr.vx * t - m.x, pr.y + pr.vy * t - m.y) < 1.2) { best = t; p = psvOf(pr.s); } }
      return p;
    }
    // 굳히는 번개가 여러 방향에서 오나 (v2.36, 전설): within s 안에 나를 겨눈 전기 굳힘·실이 hold.n개 넘게, 그 방향들이 hold.ang rad 넘게 벌어졌으면
    function multiElec(W, m, K) {
      const H = P.hold; let n = 0, a0 = 0, lo = 9, hi = -9;
      for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || c.tgt !== m || c.T - c.t > H.within) continue; const s = c.s; if (!(s.t === 'thread' || (kindOf(s) === 'elec' && (s.stun || (s.hit && s.hit.stun))))) continue;
        let a = B.C.atan2(q.y - m.y, q.x - m.x); if (!n) a0 = a; let d = a - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; if (d < lo) lo = d; if (d > hi) hi = d; n++; }
      for (const a of W.areas) { if (a.src.side === m.side || a.t > H.within || a.s.kind !== 'elec' || !a.s.stun || B.C.hyp(a.x - m.x, a.y - m.y) > a.r + 0.6) continue;   // 떨어지는 번개 그물도 (치는 사람 쪽에서 온다)
        let ang = B.C.atan2(a.src.y - m.y, a.src.x - m.x); if (!n) a0 = ang; let d = ang - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; if (d < lo) lo = d; if (d > hi) hi = d; n++; }
      return n >= H.n && hi - lo >= H.ang;
    }
    // 상대 책의 공격 가운데 가장 많은 종류
    function main(W, e) { const n = [0, 0, 0, 0]; for (const x of e.book) { const s = W.spells[x]; if (s && B.OFF[s.t]) n[psvOf(s)]++; } let b = 1; for (let i = 2; i < 4; i++) if (n[i] > n[b]) b = i; return b; }
    return {
      circles(W, q, c) { return q.st.psv > 0 ? Math.max(1, c - 1) : c; },   // 켜 둔 잔기술이 서클 하나
      bound(W, m, K) {
        if (!on(W, m) || m.hp <= 0 || m.st.stun > 0) return; const L = m.tac.passive, e = K.e; if (!e) return;
        let want = 0;
        if (L === 1) want = main(W, e);
        else if (L === 2) { want = threat(W, m, K, P.swap); if (!want) { const r = e.last && W.spells[e.last]; want = r && B.OFF[r.t] ? psvOf(r) : main(W, e); } }
        else { want = threat(W, m, K, P.lead[L] || P.lead[4]); if (want) m.mlog.gdT = W.t; else if (m.st.psv > 0 && W.t - m.mlog.gdT < P.min) want = m.st.psv; }
        if (L >= P.hold.L) { let h = HOLD.get(m); if (multiElec(W, m, K)) { if (!h) HOLD.set(m, h = { t: -9, n: 0 }); if (W.t >= h.t) h.n++; h.t = W.t + P.hold.keep; } if (h && W.t < h.t) want = 1; }   // 전설: 여러 방향의 굳히는 번개엔 순간 켜기 대신 절연 막을 늘 켜 둔다 (v2.36)
        if (K.keep & 4 && W.t < K.keepT && !(m.st.psv > 0)) want = 0;   // 정석의 아낄 자원 (수읽기)
        if (want) turnOn(W, m, want); else off(W, m);
      },
    };
  },
};
