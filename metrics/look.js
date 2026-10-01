'use strict';
/* 숨 결투장 — 행동 지표 (싸우는 모습, 1.7.0, SPEC 13장)
 * 판이 끝난 사람의 기록(m.log)에서 싸우는 모습을 잰다. t = 그 사람이 싸운 시간 (s). 표준 시험 묶음(suite)의 모습 줄이 이것을 쓴다.
 * 엔진은 기록만 남기고, 지표를 셈하는 건 여기다. 새 지표는 여기에 더한다(엔진의 기록 칸은 addMage의 log 리터럴에) */
const { SPELLS } = require('../src/data');
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
  // 고수 싸움 (v2.2, SPEC 26장): 거리 흔들림(리듬), 칸마다 역할 몫, 공격의 헛손질(맞히지 못한 시전의 몫), 장악 경계, 싸우며 세운·없앤 지형
  const ml = m.mlog;
  if (ml && ml.dN > 1) {
    const mu = ml.dS / ml.dN, sd2 = Math.max(0, ml.dS2 / ml.dN - mu * mu); o['거리 흔들림'] = mu ? Math.sqrt(sd2) / mu : 0; o['평균 거리 (m)'] = mu;
    for (const sl of ['A', 'B', 'auto']) { const R = ml.role[sl]; let n = 0; for (const k in R) n += R[k]; if (!n) continue; for (const ro of ['공격', '방어', '지형']) o['칸 ' + sl + ' ' + ro] = (R[ro] || 0) / n; }
    let c = 0, h = 0; for (const n in L.casts) { const sp = SPELLS[n]; if (!sp || sp.role !== '공격') continue; c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); }
    o['헛손질 비율'] = c ? 1 - h / c : 0; o['장악 경계 틈 (m)'] = ml.gS / ml.dN; o['장악 경계 이동 (m/s)'] = ml.bMove / Math.max(t, 1); o['세운 지형'] = ml.built; o['없앤 지형'] = ml.razed;
  }
  // 날기 끊기 (v2.3, SPEC 27장): 끊은 수, 공기 쿠션과 그 실패(추락), 내려앉으며 친 명중(끊은 동안 풀린 수가 맞았다), 높이 속이기
  if (f && f.cut) { o['날기 끊은 수'] = f.cut; o['공기 쿠션'] = f.cush; o['쿠션 실패 (추락)'] = f.crash; o['내려앉으며 친 명중'] = f.dropHit; o['내려앉으며 친 명중률'] = f.dropTry ? f.dropHit / f.dropTry : 0; o['높이 속이기'] = f.hfeint; }
  // 진지 (v2.3, SPEC 27장): 지은 벽·함정·덮개, 몰이길로 든 적, 연쇄, 치운 적의 것, 진지 안·밖에서 적에게 받은 피해
  const P = m.fort;
  if (P && (P.walls || P.traps || P.sky || P.founded)) { o['지은 벽'] = P.walls; o['깐 함정'] = P.traps; o['하늘 덮개'] = P.sky; o['몰이길로 든 적'] = P.funnel; o['연쇄로 터진 함정'] = P.chain; o['치운 적의 함정·덮개'] = P.clear; o['진지 안 받은 피해'] = P.inDmg; o['진지 밖 받은 피해'] = P.outDmg; }
  // 두 겹의 두뇌·청사진 (v2.4, SPEC 28장): 반사 겹이 켜졌을 때(선명도 5 이상)
  const R = m.rx;
  if (R && (R.turns || R.rN || R.rMiss)) { o['초당 방향 전환'] = R.turns / Math.max(t, 1); o['반응 시간 (ms)'] = R.rN ? R.rS / R.rN * 1000 : 0; o['반응 못 한 몫'] = R.rN + R.rMiss ? R.rMiss / (R.rN + R.rMiss) : 0; o['흔들기'] = R.juke; o['흔든 뒤 빗나간 몫'] = R.shotJ ? R.missJ / R.shotJ : 0; o['안 흔든 뒤 빗나간 몫'] = R.shotN ? R.missN / R.shotN : 0; }
  // 작전 겹 (v2.5, SPEC 29장): 작전을 바꾼 수, 작전 완수 비율, 강요한 수와 그 뒤 상대가 길을 바꾼 몫, 고른 자리가 한쪽 사거리·엿보기·엄폐 벗기기·퇴로 자르기였던 몫
  const OL = m.op && m.op.log;
  if (OL && OL.pick) { let n = 0, ok = 0; for (const k in OL.n) { n += OL.n[k]; ok += OL.ok[k] || 0; } o['작전 바꾼 수'] = OL.pick; o['작전 완수 비율'] = n ? ok / n : 0; o['강요한 수'] = OL.forceN; o['강요 뒤 길 바꾼 몫'] = OL.forceN ? OL.forced / OL.forceN : 0; if (OL.ticks) { o['자리: 한쪽 사거리'] = OL.oneSide / OL.ticks; o['자리: 엿보기'] = OL.peek / OL.ticks; o['자리: 엄폐 벗기기'] = OL.strip / OL.ticks; o['자리: 퇴로 자르기'] = OL.cut / OL.ticks; } }
  // 날카롭게 (v2.6, SPEC 30장): 막혀서 끊은 직사 (걸음마다 보는 지표는 metrics/watch)
  if (ml && ml.losCut) o['막혀서 끊은 직사'] = ml.losCut;
  if (P && P.bpN) { o['청사진'] = P.bpN; o['청사진 한 번의 구조물'] = P.bpItems / P.bpN; o['청사진 한 번의 시간 (s)'] = P.bpT / P.bpN; }
  return o;
}
module.exports = { look };
