'use strict';
/* 규칙: 대응 — 풀기·대비·순간 반응 (rules.response, 1.13.0, SPEC 9장, 수는 data/rules/response.json)
 * WORLD 5장의 잔기술(신경 가속, 통증 차단, 굳은 살)로 붙잡는 마법과 피할 수 없는 한 방에 답한다. 판단 수준이 셋을 연다(없으면 등급의 자동 구르기를 따른다).
 *   순간 반응: 판단과 판단 사이에도, 0.2 s 안에 닿을 보이는 탄·구름을 몸이 먼저 피한다(확률 = 단계의 reflex, 한 번 본 뒤 0.25 s 쉼)
 *   대비: 읽은 큰 공격(큰 수, 또는 그 사람의 가장 센 공격의 60% 이상, 추정 피해 12 이상)이 0.35 s 안에 닿는데 몸이 묶였으면(묶임·균사·경직)
 *         0.6 s 몸을 굳힌다: 받는 피해 × 0.6, 걸음 × 0.3, 머리 + 5
 *   풀기: 몸 묶기(균사·경직·석회·족쇄)에 걸렸고 상대가 모으고 있으면 머리 + 12, 당 4로 푼다(간격 5 s). 굳음과 보통 묶임은 못 푼다
 * 두뇌가 청하고(대비·풀기) 엔진이 다음 걸음에 한다. 순간 반응은 엔진(몸)만 */
const { hyp } = require('../math');
const P = require('../../data/rules/response.json');
// 이 사람의 단계 값
const levelOf = m => (m.skill && P.levels[m.skill]) || (m.autoDodge ? P.noSkill.autoDodge : P.noSkill.plain);
const canRoll = m => m.roll <= 0 && m.rollCd <= 0 && m.stam > 1.5 && !(m.st.stun > 0 || m.st.root > 0 || m.st.mycel > 0 || m.st.cramp > 0);
module.exports = {
  name: 'response', switch: 'response', on: W => W.rules.response, api: { levelOf, P },
  engine: X => {
    const bump = (m, k) => { m.log[k] = (m.log[k] || 0) + 1; };   // 규칙이 켜졌을 때만 칸이 생긴다
    return {
      mageStep(W, m) {
        // 두뇌가 청한 대비·풀기
        if (m.braceReq) { m.braceReq = 0; m.braceT = W.t + P.brace.dur; m.fat += P.brace.fat; bump(m, 'brace'); }
        if (m.unbindReq) {
          m.unbindReq = 0; const st = m.st;
          if (W.t >= m.unbindCd && m.glu >= P.unbind.glu && (st.mycel > 0 || st.cramp > 0 || st.lime > 0 || st.fetter > 0)) {
            if (st.fetter > 0 && st.root <= st.fetter + 1e-9) st.root = 0;   // 족쇄로 걸린 묶임만
            st.mycel = 0; st.cramp = 0; st.lime = 0; st.fetter = 0; m.fat += P.unbind.fat; m.glu -= P.unbind.glu; m.unbindCd = W.t + P.unbind.cd; bump(m, 'unbind');
          }
        }
        // 순간 반응: 0.2 s 안에 닿을 보이는 것
        const L = levelOf(m); if (!L.reflex || !canRoll(m) || W.t - m.reflexT < P.reflex.again) return;
        const win = P.reflex.window; let dx = 0, dy = 0, seen = false;
        for (const p of W.proj) {
          if (p.dead || p.src.side === m.side || p.home) continue;
          const rx = m.x - p.x, ry = m.y - p.y, vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv;
          if (t > 0 && t < win && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 0.55) { const sd = p.vx * ry - p.vy * rx > 0 ? 1 : -1; dx = -p.vy * sd; dy = p.vx * sd; seen = true; break; }
        }
        if (!seen) for (const a of W.areas) if (a.vis && a.src.side !== m.side && a.t < win && hyp(a.x - m.x, a.y - m.y) < a.r + 0.3) { dx = m.x - a.x || 0.1; dy = m.y - a.y || 0.1; seen = true; break; }
        if (!seen) return;
        m.reflexT = W.t;
        if (W.rng() < L.reflex) { X.roll(W, m, dx, dy, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8); bump(m, 'reflex'); }
      },
      hurtMod(W, m, v) { return m.braceT > W.t ? v * P.brace.k : v; },          // 굳은 살·통증 차단
      speedLate(W, m, sp) { return m.braceT > W.t ? sp * P.brace.speed : sp; },   // 굳힌 몸은 느리다
    };
  },
  // 두뇌: 자동 진 다음에 대비와 풀기를 청한다
  brain: B => ({
    react(W, m, K) {
      const L = levelOf(m), st = m.st, e = K.e;
      if (L.unbind && W.t >= m.unbindCd && m.glu >= P.unbind.glu + 2 && (st.mycel > P.unbind.min || st.cramp > P.unbind.min || st.lime > P.unbind.min || st.fetter > P.unbind.min) && (K.threat || K.late || e.cast || e.castB)) m.unbindReq = 1;
      const th = K.threat || K.late;
      // 큰 공격(큰 수, 또는 쏘는 사람의 가장 센 공격의 60% 이상)이 곧 닿는데 몸이 묶여 걸어서도 구르기로도 못 나갈 때만.
      // 걸을 수 있으면 굳히지 않는다: 굳힌 몸은 느려(× 0.3) 걸어 나갈 수 있던 구름 안에 남는다 (1.13.0 재기, reports/v1.13.0.md)
      if (L.brace && th && th.T - th.t < P.brace.within && !(m.braceT > W.t) && !m.buf.front && (th.s.big || B.bigAttack(th, K.S)) && B.estDmg(th.s) >= P.brace.minDmg
        && (st.root > 0 || st.mycel > 0 || st.cramp > 0)) m.braceReq = 1;
    },
  }),
};
