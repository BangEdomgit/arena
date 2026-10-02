'use strict';
/* 규칙: 굳힘 내성 (rules.stunRes, v2.21, v2.23에 몸 털기를 거둠, SPEC 45장, 수는 data/rules/stunRes.json)
 * 기본 꺼짐, 대마법사 결투 장면이 켠다. 설정: 굳음은 전기가 신경과 고리를 흩뜨린 것이라 털어낼 수 없다. 대신 몸속 균의 반사 —
 *   강한 전기에 놀란 피부의 균이 서클 없이 잠깐 닫힌다.
 *   굳힘 내성: 굳은 동안이나 굳음이 풀리고 win s 안에 다시 굳으면 굳는 시간 × k[단계] (1 → 0.5 → 0.25). 상태 st.stR(단계)·st.stE(지금 굳음이 풀리는 때)
 * 몸 털기(rules/response의 풀기)는 붙잡는 것(균사·경직·석회·족쇄)만 푼다. 굳음은 못 턴다
 * 수읽기(brain/plan)는 이 규칙이 켜지면 굳음을 바로 센다: 굳은 채 닿는 수엔 응수가 없다(이미 켠 잔기술·세운 방패만) */
const P = require('../../data/rules/stunRes.json');
module.exports = {
  name: 'stunRes', switch: 'stunRes', api: { P },
  engine: X => ({
    stunHold(W, m, o, v) {
      if (!(v > 0)) return v; const st = m.st;
      st.stR = W.t <= st.stE + P.win ? Math.min(st.stR + 1, P.k.length - 1) : 0;
      v *= P.k[st.stR]; const e = W.t + Math.max(v, st.stun > 0 ? st.stun : 0); if (e > st.stE) st.stE = e;
      return v;
    },
  }),
};
