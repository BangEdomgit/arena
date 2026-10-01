'use strict';
/* 숨 결투장 — 판단 확인 지표 (v2.16, GATE-v3.md 2장, SPEC 40장)
 * watch(metrics/watch.js)가 걸음마다 부르고 seen이 합친다. 판에는 닿지 않는다(읽기만, 사람 객체에 칸을 더하지 않는다: 상태는 W._wj).
 * 판단마다 "확인" 칸의 지표 (없던 것만, 있던 것은 watch에 있다):
 *   응수 예측 맞음: 체크를 풀 때 수읽기가 짐작한 상대의 응수(cast.pred)와 0.6 s 안의 실제 응수(방패·막기·옆 튀기·구르기·벽 차례로 먼저 쓴 것, 아무것도 안 쓰고 맞았으면 '없음', 안 맞았으면 '움직임')
 *   그물 단계별 남은 칸: 1.5 s 안에 이어 건 체크의 첫째·둘째·셋째부터에서 상대의 열린 피할 곳 수(수읽기의 줄인 상태)
 *   큰 한 방·그중 메이트, 속임수 시도·상대가 응수한 수, 미끼(속임수) 뒤 1.5 s 안의 메이트, 정석 첫 수를 상대가 받은 몫(3 s 안)
 *   판 뒤 반의 명중 − 앞 반의 명중, 구르기 빼낸 수(내가 푼 뒤 0.6 s 안에 상대가 구르거나 옆 튀기), 이어치기(내 맞힘으로 굳거나 묶인 동안 푼 수와 명중),
 *   장악권에서 밀릴 때(과녁 자리의 내 장악 몫 0.5 아래)의 던지기 시간 몫, 방식을 바꾼 뒤 1 s 안에 푼 수의 명중
 *   0.5 s 넘게 서 있던 순간(2 m/s 아래, 그중 굳음·묶임·떨어짐), 숨은 시간(상대에게서 시야가 막힘, 2 m 아래)·숨은 동안 옮긴 거리·지은 것·숨었다 나온 첫 수(기습) 명중
 *   준비 칸 시간(두 번째 칸이 찬 시간), 걸어둔 마법 명중, 메이트 순간 벽·덫이 지운 칸의 몫, 단계 전환(분당), 몰린 동안 2 s 넘는 침묵, 몸 털기 뒤 5 s 안의 위기(체력 15% 넘게 잃음)
 *   순간 켜기 성공(켠 지 0.3 s 안에 막음, rules/pace), 패시브(막기)가 막은 피해 몫, 큰 한 방 수 */
const C = require('../src/core'), { hyp } = require('../src/math'), PL = require('../src/brain/plan');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1, topple: 1 };
const BUILD = { wall: 1, build: 1, trap: 1, zone: 1, blueprint: 1 };
const newJ = () => ({ pc: null, pb: null, still: -1, stand: 0, standLock: 0, hid: false, hidT: 0, hidAt: -9, hidX: 0, hidY: 0, hidMove: 0, hidSeg: 0, hidBuild: 0, ambOpen: -9,
  pend: [], predP: [], predN: 0, predOk: 0, chkT: -9, chain: 0, netS: [0, 0, 0], netN: [0, 0, 0], bigN: 0, bigM: 0, feintN: 0, fe0: 0, feintT: -9, baitMate: 0, js0: 0, jsP: [], jsN: 0, jsAns: 0,
  early: [0, 0], late: [0, 0], draw: 0, drawP: [], comboUntil: -9, comboN: 0, comboH: 0, lowT: 0, lowThrow: 0, mode: '', modeT: -9, swN: 0, swH: 0, phase: '', phN: 0,
  lowSil: 0, lowLast: -9, castBT: 0, t: 0, ub0: 0, crisisP: [], ubN: 0, ubCrisis: 0, mateN: 0, mateTer: 0, roll0: 0, rollN: 0, stun0: 0, root0: 0, dealt0: 0, hangN: 0, hangH: 0 });
const dealtOf = m => { let x = 0; for (const k in m.log.dealt) x += m.log.dealt[k]; return x; };
function foeOf(W, m) { let e = null, bd = 1e9; for (const q of W.ms) { if (q.side === m.side || q.hp <= 0) continue; const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } } return e; }
// 방어 자원을 쓴 기록: 구르기·옆 튀기·막기 켬·앞 방패·벽
function useOf(W, q, j) { let sh = 0, wl = 0; for (const n in q.log.casts) { const s = W.spells[n]; if (!s) continue; if (s.t === 'buff' && s.b && s.b.front) sh += q.log.casts[n]; else if (s.t === 'wall' || s.t === 'build') wl += q.log.casts[n]; } return [j ? j.rollN : 0, q.flog ? q.flog.cut : 0, q.mlog.gdOn || 0, sh, wl]; }
const hitsOf = (m, n) => m.log.hits[n] || 0;
const ORD = [3, 2, 1, 0, 4];   // 먼저 본 응수의 차례 (방패·막기·옆 튀기·구르기·벽)
function step(W) {
  const A = W._wj || (W._wj = { by: new Map(), side: null });
  const chk = W.step % (3 * W.sk) === 0;
  for (const m of W.ms) { if (!A.by.has(m)) A.by.set(m, newJ()); }
  for (const m of W.ms) {
    const j = A.by.get(m);
    if (m.roll > j.roll0 + 0.1 && !(m.cast && m.cast.s.t === 'move')) j.rollN++; j.roll0 = m.roll;
    if (m.hp <= 0) continue;
    const e = foeOf(W, m); if (!e) continue;
    j.t += W.dt; if (m.castB) j.castBT += W.dt;
    const ej = A.by.get(e);
    // 서 있기
    const v = C.hyp3(m.vx, m.vy, m.vz || 0);
    if (v < 2) { if (j.still < 0) j.still = W.t; else if (j.still !== -2 && W.t - j.still > 0.5) { j.stand++; if (m.st.stun > 0 || m.st.root > 0 || m.fly === 2) j.standLock++; j.still = -2; } } else j.still = -1;
    // 시전 시작·풀림
    const K = m._k;
    for (let q = 0; q < 2; q++) {
      const c = q ? m.castB : m.cast, p = q ? j.pb : j.pc;
      if (c && c !== p && !c.auto) {
        if (c.s.big) { j.bigN++; if (c.mate) j.bigM++; }
        if (c.feint) j.feintN++;
        if (c.mate) { j.mateN++; if (W.t - j.feintT < 1.5) j.baitMate++; const S = PL.ST.build(W, e, m, A.side || (A.side = PL.ST.newSide()), 0.5); let bl = 0, tw = 0; for (let k = 0; k < 9; k++) if (S.blk[k] > 0.05) { bl++; if (S.why[k] === 3 || S.why[k] === 4) tw++; } if (bl) j.mateTer += tw / bl; }
        if (BUILD[c.s.t] && j.hid) j.hidBuild++;
      }
      if (p && p !== c && p.t >= p.T - W.dt * 1.5 && OFF[p.s.t] && !p.auto) {
        let tag = 0; if (W.t - j.modeT < 1) tag |= 1; if (W.t < j.comboUntil) tag |= 2; if (j.hid || W.t - j.ambOpen < 0.5) { tag |= 4; j.ambOpen = -9; }
        j.pend.push({ due: W.t + 1.5, n: p.s.n, h0: hitsOf(m, p.s.n), t: W.t, tag, hang: p.s.n.indexOf('걸어둔') >= 0 || !!p.hold });
        if (ej) j.drawP.push({ due: W.t + 0.6, r: ej.rollN + (e.flog ? e.flog.cut : 0) });
        if (p.chk && ej) {
          j.chain = W.t - j.chkT < 1.5 ? j.chain + 1 : 0; j.chkT = W.t;
          const S = PL.ST.build(W, e, m, A.side || (A.side = PL.ST.newSide()), 0.5); let free = 0; for (let k = 1; k < 9; k++) if (S.blk[k] <= 0.05) free++; const ci = j.chain > 2 ? 2 : j.chain; j.netS[ci] += free; j.netN[ci]++;
          if (p.pred !== undefined) j.predP.push({ due: W.t + 0.6, pred: p.pred, u: useOf(W, e, ej), q: e, n: p.s.n, h0: hitsOf(m, p.s.n) });
        }
      }
      if (q) j.pb = c; else j.pc = c;
    }
    // 속임수에 상대가 응수했다 (끊었다)
    const fe = m.log.dec.feint || 0; if (fe > j.fe0) j.feintT = W.t; j.fe0 = fe;
    // 정석 첫 수: 상대가 3 s 안에 받았나
    if (m.mlog.jsS > j.js0) { j.jsP.push({ due: W.t + 3, a0: e.mlog.jsA }); j.js0 = m.mlog.jsS; }
    while (j.jsP.length && j.jsP[0] && j.jsP[0].due <= W.t) { const x = j.jsP.shift(); j.jsN++; if (e.mlog.jsA > x.a0) j.jsAns++; }
    // 이어치기: 내 맞힘으로 상대가 굳거나 묶였다
    const dl = dealtOf(m); if (dl > j.dealt0 + 0.1 && (e.st.stun > j.stun0 + 0.05 || e.st.root > j.root0 + 0.05)) j.comboUntil = W.t + Math.max(e.st.stun, e.st.root); j.dealt0 = dl; j.stun0 = e.st.stun; j.root0 = e.st.root;
    // 방식·단계
    if (K) { if (K.mode !== j.mode) { if (j.mode) j.modeT = W.t; j.mode = K.mode; } }
    if (m.phase !== j.phase) { if (j.phase) j.phN++; j.phase = m.phase; }
    // 몰린 동안 침묵
    if (K && K.low) { if (m.cast || m.castB || m.chan) j.lowLast = W.t; else if (W.t - j.lowLast > 2) { j.lowSil++; j.lowLast = W.t; } } else j.lowLast = W.t;
    // 몸 털기 뒤 위기
    const ub = m.log.unbind || 0; if (ub > j.ub0) { j.ubN++; j.crisisP.push({ due: W.t + 5, hp: m.hp }); } j.ub0 = ub;
    while (j.crisisP.length && (j.crisisP[0].due <= W.t || j.crisisP[0].hp - m.hp > 0.15 * m.hpMax)) { const x = j.crisisP.shift(); if (x.hp - m.hp > 0.15 * m.hpMax) j.ubCrisis++; }
    // 풀린 수의 결과
    while (j.pend.length && j.pend[0].due <= W.t) {
      const x = j.pend.shift(), hit = hitsOf(m, x.n) > x.h0;
      const half = x.t < W.t / 2 ? j.early : j.late; half[0]++; if (hit) half[1]++;
      if (x.tag & 1) { j.swN++; if (hit) j.swH++; } if (x.tag & 2) { j.comboN++; if (hit) j.comboH++; } if (x.tag & 4) { j.ambN = (j.ambN || 0) + 1; if (hit) j.ambH = (j.ambH || 0) + 1; }
      if (x.hang) { j.hangN++; if (hit) j.hangH++; }
    }
    while (j.predP.length && j.predP[0].due <= W.t) { const x = j.predP.shift(), u = useOf(W, x.q, A.by.get(x.q)); let act = -1; for (const r of ORD) if (u[r] > x.u[r]) { act = r; break; } if (act < 0) act = hitsOf(m, x.n) > x.h0 ? -1 : 6; j.predN++; if (act === x.pred) j.predOk++; }   // 응수 예측 (-1 못 막음, 6 움직임)
    while (j.drawP.length && j.drawP[0].due <= W.t) { const x = j.drawP.shift(); if (ej.rollN + (e.flog ? e.flog.cut : 0) > x.r) j.draw++; }
    if (!chk) continue;
    // 0.1 s마다: 숨기, 장악권 몫
    const hidden = m.z <= 2 && C.blocked(W, e.x, e.y, m.x, m.y, m.z > e.z ? m.z : e.z);
    if (hidden) { if (!j.hid) { j.hid = true; j.hidAt = W.t; j.hidX = m.x; j.hidY = m.y; j.hidSeg++; } j.hidT += 0.1; }
    else if (j.hid) { j.hid = false; j.hidMove += hyp(m.x - j.hidX, m.y - j.hidY); if (W.t - j.hidAt >= 1) j.ambOpen = W.t; }
    if (W.rules.domain) { const sh = C.share(W, m, e.x, e.y); if (sh < 0.5) { j.lowT += 0.1; if (K && K.mode === 'throw') j.lowThrow += 0.1; } }
  }
}
// 판이 끝난 뒤
function seen(W, m) {
  const A = W._wj; if (!A) return {}; const j = A.by.get(m); if (!j) return {};
  const e = foeOf(W, m) || W.ms.find(q => q.side !== m.side), ej = e && A.by.get(e), r = (a, b) => b ? a / b : 0, min = j.t / 60;
  const hit = h => r(h[1], h[0]), took = (() => { let x = 0; for (const k in m.log.taken) x += m.log.taken[k]; return x; })();
  return {
    '응수 예측 맞음': r(j.predOk, j.predN), '응수 예측 수': j.predN,
    '그물 1단계 남은 칸': r(j.netS[0], j.netN[0]), '그물 2단계 남은 칸': r(j.netS[1], j.netN[1]), '그물 3단계 남은 칸': r(j.netS[2], j.netN[2]),
    '큰 한 방': j.bigN, '큰 한 방 중 메이트 몫': r(j.bigM, j.bigN), '속임수 시도': j.feintN, '속임수에 상대가 응수한 몫': r(m.log.dec.feint || 0, j.feintN), '미끼 뒤 메이트': j.baitMate,
    '정석 첫 수를 상대가 받은 몫': r(j.jsAns, j.jsN), '판 뒤 반 명중 − 앞 반 명중': hit(j.late) - hit(j.early),
    '구르기 빼낸 수': j.draw, '이어친 수': j.comboN, '이어친 수 명중': r(j.comboH, j.comboN), '장악권에서 밀릴 때 던지기 몫': r(j.lowThrow, j.lowT), '방식 전환 뒤 명중': r(j.swH, j.swN),
    '0.5 s 넘게 서 있음': j.stand, '그중 굳음·묶임·떨어짐': j.standLock, '숨은 시간 몫': r(j.hidT, j.t), '숨은 뒤 옮긴 거리': r(j.hidMove, j.hidSeg), '숨은 동안 지은 것': j.hidBuild, '기습': j.ambN || 0, '기습 명중': r(j.ambH || 0, j.ambN || 0),
    '준비 칸 시간 몫': r(j.castBT, j.t), '걸어둔 마법 명중': r(j.hangH, j.hangN), '메이트 순간 벽·덫이 지운 몫': r(j.mateTer, j.mateN), '분당 단계 전환': r(j.phN, min), '몰린 동안 2 s 침묵': j.lowSil,
    '몸 털기': j.ubN, '몸 털기 뒤 위기': j.ubCrisis, '순간 켜기 성공': m.mlog.gdOk || 0, '패시브가 막은 피해 몫': r(m.mlog.guardBlk || 0, took + (m.mlog.guardBlk || 0)),
    '코너 속도 근처 시간 몫': m.flog && m.flog.t ? m.flog.corner / m.flog.t : 0, '빗나가게 한 수': m.rx ? m.rx.missJ : 0, '속도 속임': m.flog ? m.flog.feint + m.flog.hfeint : 0, '추락': m.flog ? m.flog.falls : 0, '높이 변화 (m)': m.flog ? m.flog.dz : 0,
    '한쪽 사거리 자리': m.op ? m.op.log.oneSide : 0, '엄폐 벗긴 자리': m.op ? m.op.log.strip : 0, '퇴로 자른 자리': m.op ? m.op.log.cut : 0, '강요한 수': m.op ? m.op.log.forced : 0,
    '작전 완수 몫': m.op ? (() => { let n = 0, k = 0; for (const x in m.op.log.n) n += m.op.log.n[x]; for (const x in m.op.log.ok) k += m.op.log.ok[x]; return r(k, n); })() : 0,
    '분당 지은 것': (() => { let x = 0; for (const n in m.log.casts) { const s = W.spells[n]; if (s && BUILD[s.t]) x += m.log.casts[n]; } return r(x, min); })(),
    '지어둔 것이 낸 피해 몫': (() => { let x = 0, t = 0; for (const n in m.log.dealt) { const s = W.spells[n], d = m.log.dealt[n]; t += d; if (s && (s.t === 'trap' || s.t === 'zone' || s.t === 'topple' || n.indexOf('걸어둔') >= 0)) x += d; } return r(x, t); })(),
    '판당 쓴 마법 종류': Object.keys(m.log.casts).filter(n => m.log.casts[n] > 0).length,
    '가장 많이 쓴 세 마법의 몫': (() => { const v = Object.keys(m.log.casts).map(n => m.log.casts[n]).sort((a, b) => b - a), t = v.reduce((a, b) => a + b, 0); return t ? (v[0] + (v[1] || 0) + (v[2] || 0)) / t : 0; })(),
  };
}
module.exports = { step, seen };
