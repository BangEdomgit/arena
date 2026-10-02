'use strict';
/* 규칙: 굳힘 내성과 몸 털기 (rules.stunRes, v2.21, SPEC 45장, 수는 data/rules/stunRes.json)
 * 기본 꺼짐, 대마법사 결투 장면이 켠다. 설정: 몸속 균의 반사 — 강한 전기에 놀란 피부의 균이 서클 없이 잠깐 닫힌다.
 *   굳힘 내성: 굳은 동안이나 굳음이 풀리고 win s 안에 다시 굳으면 굳는 시간 × k[단계] (1 → 0.5 → 0.25). 상태 st.stR(단계)·st.stE(지금 굳음이 풀리는 때)
 *   몸 털기: 굳은 사람이 청하면(st.shk) 다음 걸음에 굳음을 턴다. 머리·당·간격(unbindCd: 대응 규칙의 풀기와 같은 간격). 기록 mlog.shk
 * 두뇌 (훅 stunned, 굳은 동안만 불린다): 판단 수준 levels가 쓰고, 보이는 위협(겨눈 시전·날아오는 투사체·발밑 지대)이 굳음이 풀리기 전에 닿으면 턴다
 * 수읽기(brain/plan)는 이 규칙이 켜지면 굳음을 바로 센다: 굳은 동안의 응수는 몸 털기 하나 */
const P = require('../../data/rules/stunRes.json');
const can = m => !!(m.skill && P.levels[m.skill]);
const ready = (W, m) => W.t >= m.unbindCd && m.glu >= P.shake.glu;
module.exports = {
  name: 'stunRes', switch: 'stunRes', api: { P, can, ready },
  engine: X => ({
    stunHold(W, m, o, v) {
      if (!(v > 0)) return v; const st = m.st;
      st.stR = W.t <= st.stE + P.win ? Math.min(st.stR + 1, P.k.length - 1) : 0;
      v *= P.k[st.stR]; const e = W.t + Math.max(v, st.stun > 0 ? st.stun : 0); if (e > st.stE) st.stE = e;
      return v;
    },
    mageStep(W, m) {
      const st = m.st; if (!st.shk) return; st.shk = 0;
      if (!(st.stun > 0) || !ready(W, m)) return;
      st.stun = 0; st.stE = W.t; m.fat += P.shake.fat; m.glu -= P.shake.glu; m.unbindCd = W.t + P.shake.cd; m.mlog.shk++; m.mlog.shT = W.t;
    },
  }),
  brain: B => ({
    stunned(W, m, K) {
      const st = m.st, Q = P.brain; if (!can(m) || st.shk || st.stun < Q.minLeft || !ready(W, m) || m.glu < P.shake.glu + 2) return;
      const left = st.stun + Q.lead; let soon = false;
      for (const q of K.foes) for (let j = 0; j < 2 && !soon; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || !B.OFF[c.s.t]) continue; const t = c.T - c.t; if (t < left && (c.tgt === m || B.C.hyp(c.tx - m.x, c.ty - m.y) < Q.near + (c.s.r || 0))) soon = true; }
      if (!soon) for (const a of W.areas) if (a.src.side !== m.side && a.t < left && B.C.hyp(a.x - m.x, a.y - m.y) < a.r + 0.6) { soon = true; break; }
      if (!soon) for (const pr of W.proj) { if (pr.dead || !pr.src || pr.src.side === m.side) continue; const dx = m.x - pr.x, dy = m.y - pr.y, v2 = pr.vx * pr.vx + pr.vy * pr.vy; if (!v2) continue; const t = (dx * pr.vx + dy * pr.vy) / v2; if (t > 0 && t < left && B.C.hyp(pr.x + pr.vx * t - m.x, pr.y + pr.vy * t - m.y) < 1.2) { soon = true; break; } }
      if (soon) st.shk = 1;
    },
  }),
};
