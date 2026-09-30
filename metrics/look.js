'use strict';
/* 숨 결투장 — 행동 지표 (싸우는 모습, 1.7.0, SPEC 13장)
 * 판이 끝난 사람의 기록(m.log)에서 싸우는 모습을 잰다. t = 그 사람이 싸운 시간 (s). 표준 시험 묶음(suite)의 모습 줄이 이것을 쓴다.
 * 엔진은 기록만 남기고, 지표를 셈하는 건 여기다. 새 지표는 여기에 더한다(엔진의 기록 칸은 addMage의 log 리터럴에) */
function look(m, t) {
  const st = m.log.starts, iv = []; for (let i = 1; i < st.length; i++) iv.push(st[i] - st[i - 1]);
  const mean = iv.length ? iv.reduce((a, b) => a + b, 0) / iv.length : 0, sd = iv.length > 1 ? Math.sqrt(iv.reduce((a, b) => a + (b - mean) ** 2, 0) / (iv.length - 1)) : 0;
  const L = m.log, per = x => x / Math.max(t, 1) * 60;
  const o = {
    '분당 시전': per(st.length), '빈틈 (s)': L.gaps.length ? L.gaps.slice().sort((a, b) => a - b)[L.gaps.length >> 1] : 0, '박자 흔들림': mean ? sd / mean : 0,
    '분당 콤보': per(L.comboTry), '콤보 성공률': L.comboTry ? L.comboHit / L.comboTry : 0, '분당 동시 시전': per(L.dec.slotB),
    '분당 캔슬': per(L.cancel || 0), '분당 속임수': per(L.dec.feint || 0), '엄폐 시간 비율': t ? (L.coverT || 0) / t : 0,
    '분당 유도 성공': per(L.lure || 0), '분당 동시 착탄': per(L.simul || 0), '방어 적중률': L.defTry ? (L.defHit || 0) / L.defTry : 0,
  };
  // 비행 (v2.0, SPEC 24장): 날았거나 떨어진 사람만. 속도 흔들림 = 날 때 속도의 표준편차 / 평균
  const f = m.flog;
  if (f && (f.t > 0 || f.falls)) {
    const mv = f.t ? f.v / f.t : 0, sv = f.t ? Math.sqrt(Math.max(0, f.v2 / f.t - mv * mv)) : 0;
    o['나는 시간 비율'] = t ? f.t / t : 0; o['평균 속도 (m/s)'] = mv; o['속도 흔들림'] = mv ? sv / mv : 0; o['코너 속도 근처 비율'] = f.t ? f.corner / f.t : 0;
    o['분당 속도 속임'] = per(f.feint); o['분당 높이 변화 (m)'] = per(f.dz); o['추락'] = f.falls; o['스쳐 치기 명중률'] = f.grazeTry ? f.grazeHit / f.grazeTry : 0;
  }
  return o;
}
module.exports = { look };
