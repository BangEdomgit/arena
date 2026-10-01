'use strict';
/* 규칙: 숨 (rules.breath, v2.11, SPEC 35장, 수는 data/rules/breath.json) — 판마다 세 번, 깊이 마셔 몸의 연료를 채운다
 * 엔진: 마시는 동안(st.breath, T 0.5 s) 새 마법을 짓지 못하고(두뇌의 rest 훅: 자동 진은 돈다) 느려진다(× slow 0.5, 날면 마시기 시작한 속도의 절반으로).
 *   끝나면 당 + glu 80 (당 한도까지) · 머리 피로 − fat 30 · 기력 + stam 3
 * 두뇌 (판단 수준의 tac): 남은 몫 = 머리의 남은 몫(1 − 피로/100)과 당의 몫(당/한도) 가운데 적은 쪽. 숨은 둘 다 채운다
 *   breathAt 아래면 마신다 (초보 0.05 · 중급 0.15 · 상급 0.25 · 대가·전설 0.25). breathSafe(중급부터)면 위협(나를 겨눈 수)이 없을 때만
 *   breathPre(대가·전설 0.45): 작전 압박·끝내기를 고른 직후(pre 1 s 안)에 남은 몫이 이 아래면 위협이 없을 때 미리 마신다
 *   두 칸이 비어 있을 때만 마신다(짓던 설계는 버리지 않는다)
 * 기록 (m.mlog): breath 쓴 수, breathHit 마시다 맞은 수(빈틈, 한 번 마실 때 한 번), breathAtk·breathAtkHit 숨 뒤 after 5 s 안에 쏜 공격·맞힌 공격 */
const P = require('../../data/rules/breath.json');
let MP = null, EP = null;   // 공격 방식의 수 (덮기 뒤 숨, data/mode.json)
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
// 쏜 공격·맞힌 공격의 합 (숨 뒤 명중을 세려고)
function atk(W, m) { let c = 0, h = 0; const L = m.log; for (const n in L.casts) { const s = W.spells[n]; if (s && OFF[s.t]) { c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); } } return [c, h]; }
const left = m => m.mlog.breath < P.n;
module.exports = {
  name: 'breath', switch: 'breath', default: true, api: { P, left: m => P.n - m.mlog.breath },
  engine: X => ({
    mageStep(W, m) {
      const L = m.mlog;
      if (m.st.breath > 0) {
        m.st.breath -= X.DT;
        if (m.z >= 1) { const v = X.hyp(m.vx, m.vy); if (v > L.brV && v > 0) { m.vx *= L.brV / v; m.vy *= L.brV / v; } }   // 날면 마시기 시작한 속도의 절반
        if (m.st.breath <= 0) { m.st.breath = 0; m.glu = Math.min(m.gluMax, m.glu + P.glu); if (W.rules.fatigue) m.fat = Math.max(0, m.fat - P.fat); m.stam = Math.min(X.BODY.stam, m.stam + P.stam); const a = atk(W, m); L.brT = W.t; L.brA = a[0]; L.brH = a[1]; }
      } else if (L.brT >= 0 && W.t - L.brT >= P.after) { const a = atk(W, m); L.breathAtk += a[0] - L.brA; L.breathAtkHit += a[1] - L.brH; L.brT = -9; }   // 숨 뒤 5 s
    },
    speed(W, m, sp) { return m.st.breath > 0 ? sp * P.slow : sp; },
    hurt(W, m, v, src) { if (m.st.breath > 0 && src && src.side !== m.side && !m.mlog.brHitF) { m.mlog.brHitF = true; m.mlog.breathHit++; } },   // 마시다 맞았다
  }),
  brain: B => ({
    // 마시는 동안은 새 마법을 고르지 않는다. 남은 몫이 문턱 아래면 마시기 시작한다
    rest(W, m, K, restNow) {
      if (m.st.breath > 0) return true;
      if (!left(m) || m.cast || m.castB || m.chan || m.hp <= 0) return restNow;   // 쉬려던 참이어도 본다(쉴 때가 마실 때다)
      const T = m.tac, r = Math.min(W.rules.fatigue ? 1 - m.fat / 100 : 1, m.glu / m.gluMax), threat = !!(K.aimed || K.threat);
      let go = r < T.breathAt && (!T.breathSafe || !threat);
      if (!go && K.coverDone > W.t - 1.5 && m.fat > (MP || (MP = require('../../data/mode.json'))).heat && !threat && r < 0.5) go = true;   // 덮기 뒤 머리가 뜨거우면 (v2.12)
      if (!go && K.low && r < (EP || (EP = require('../../data/engage.json'))).breathR && !threat) go = true;   // 몰린 쪽은 깊이 마신다 (v2.13)
      if (!go && T.breathPre && r < T.breathPre && !threat && m.op && (m.op.cur === 'press' || m.op.cur === 'finish') && W.t - m.op.t0 < P.pre) go = true;   // 몰아치기 직전에 미리 (대가·전설)
      if (!go) return restNow;
      m.st.breath = P.T; m.mlog.breath++; m.mlog.brHitF = false; m.mlog.brV = Math.max(B.C.hyp(m.vx, m.vy) * P.slow, 2.5); m.relT = null; return true;
    },
  }),
};
