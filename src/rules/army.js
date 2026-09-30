'use strict';
/* 규칙: 군대 (rules.army, v2.0 둘째 묶음, SPEC 25장, 수는 data/rules/army.json)
 * 머스킷(이 규칙이 켜진 세계에선 2판의 수): 장전 15~20 s(쏠 때마다 뽑는다), 화승 점화 지연 0.1~0.5 s(예비동작에 더한다),
 *   사거리 100 m, 흔들림 = 0.004 + 0.0004 × 거리(rad: 50 m에서 ±1.2 m, 100 m에서 ±4.4 m). 두뇌가 겨눈 자리를 흐리지 않는다(총이 흔든다)
 * 박격포(마법 '박격포', 규칙에 딸림): 높이 쏘아 벽 너머에 떨어뜨린다(곡사 3 s, 반지름 2.5 m, 90, 벽 600). 겨눈 자리 ± 3%×거리
 * 돌아가며 쏘기(tac.volley = 줄 수 n): 사람마다 줄 번호(id mod n), 17.5/n s마다 한 줄씩 쏜다
 * 탄 낭비 금지: 과녁이 2 m 넘게 떠 있고 50 m 넘게 멀면 쏘지 않는다 */
const A = require('../../data/rules/army.json');
module.exports = {
  name: 'army', switch: 'army', on: W => W.rules.army, api: { A },
  engine: () => ({
    init(W) { const s = W.spells['머스킷']; if (s) W.spells['머스킷'] = Object.assign({}, s, A.musket); },   // 이 세계의 머스킷만 바꾼다 (원본 데이터는 그대로)
    release(W, m, c) { const r = c.s.reload; if (r) m.cd[c.s.n] = W.rnd(r[0], r[1]); },   // 장전
  }),
  brain: () => ({
    commit(W, m, K, best, cast) {
      const s = best.s; if (!s.mundane) return;
      cast.tx = best.tx; cast.ty = best.ty;   // 총은 두뇌가 흐리지 않는다 (흔들림은 총이, core)
      if (s.fuse) cast.T += W.rnd(0, s.fuse[1] - s.fuse[0]);   // 화승 점화 지연
      if (s.t === 'lob') { const d = Math.sqrt((best.tx - m.x) * (best.tx - m.x) + (best.ty - m.y) * (best.ty - m.y)) * A.mortar.spread; cast.tx += W.rnd(-d, d); cast.ty += W.rnd(-d, d); }
    },
    value(W, m, K, o) {
      const s = o.s; if (!s.mundane || !(o.v > 0)) return;
      const n = m.tac.volley; if (n > 1 && s.t === 'proj' && m.id % n !== Math.floor(W.t / (A.volleyT / n)) % n) { o.v = 0; return; }   // 제 줄 차례가 아니다
      if (K.e.z >= A.farFly.z && K.d > A.farFly.d) o.v = 0;   // 멀리 떠 있는 과녁에 탄을 버리지 않는다
    },
  }),
};
