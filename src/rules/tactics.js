'use strict';
/* 규칙: 작전 겹과 각도 판단 (rules.tactics, v2.5, SPEC 29장, 무게·수는 data/rules/tactics.json)
 * 두뇌의 세 번째 겹. 반사 겹(매 걸음, rules/reflex) · 생각 겹(판단, 0.05~0.3 s)의 위에서 1~2 s마다 작전을 고르고 둘레 자리를 잰다.
 * 선명도 5 이상, 판단 수준의 tac.ops (1 대가: 2 s마다 / 2 전설: 1 s마다 + 강요하는 수 + 상대 작전 읽기).
 * 작전 (고르는 근거: 체력·피로·다음 칸의 간격·사거리 차이·지형·상대의 상태(빈손·꺼짐·과열·굳음·엄폐)):
 *   진지 fort: 짓고 기다린다(청사진 규칙이 있으면 짓기 단계로) · 소모 attrit: 내 곡사·구름 사거리 안, 상대의 가장 긴 직사 사거리 밖에서 깎는다
 *   압박 press: 장악권이 상대 쪽으로 넘어가는 거리(5장 식, 리듬의 들어갈 거리)로 밀고 들어간다 · 몰이 herd: 벽·함정·구름·지대를 상대의 퇴로 쪽에
 *   사냥 hunt: 각도를 돌아 엄폐 벗기기 · 끝내기 finish: 모든 칸으로 몰아친다(두 번째 칸도 공격)
 *   작전이 정해지면 생각 겹의 선호 거리·공격 성향·마법의 값·걸음이 그 목표를 향한다
 * 각도 판단: 작전 때마다 상대 둘레 자리 24개(각 8 × 반지름 3, 반지름은 작전마다)를 점수로 매겨 가장 좋은 자리로. 점수:
 *   가는 길(−0.02/m), 시야(작전이 시야를 바라면), 한쪽 사거리(상대 직사 밖·내 곡사 안), 엿보기 각(반 걸음 옆에 숨을 바위), 엄폐 벗기기(지금 안 보이는 상대가 보이는 각),
 *   퇴로 자르기(상대와 그 진지·가장 가까운 엄폐 사이), 화약통 선(상대 곁 화약통이 보이는 각), 높이의 각(날 수 있으면 바위 뒤도 좋다: 떠서 넘겨 보고 내려앉아 숨는다),
 *   위험(적 지대·알아챈 함정·적 하늘 덮개(날 때)·싸움터 끝·소금 원 밖)
 *   돌던 쪽으로 한 칸(45°) 나아간 자리에 + 0.5: 원을 그리며 돈다(막히면 돌아선다).
 *   걸음은 그 자리로 곧장이 아니라 상대 둘레로(둘레 방향 1, 반지름 방향 0.4): 거리를 유지하며 원을 그린다.
 *   빠지기(리듬)에는 빠지기 거리까지 바깥 1 + 도는 쪽 1로 나선을 그리며 벌리고, 그 뒤로는 둘레로만 돈다. 싸움터 끝·소금 선 18 m 안이면 소금 원의 걸음 그대로
 * 강요하는 수 (전설): 숨은 상대 자리 위에 보이는 구름, 퇴로에 함정, 진지 입구에 벽 밀기, 나는 상대 위에 번개 구름 → 값 × 무게. 그 뒤 1.5 s는 내 모양(청사진·벽·함정·지대) × 1.5
 *   상대의 작전을 읽고 반대로: 다가오는 속도의 평균·짓는 수로 상대의 작전을 짐작(압박: 평균 2 m/s 넘게 다가옴, 소모: 22 m 넘게·내 직사 밖에서 버팀, 진지: 짓는 중)하고 맞수에 무게
 *   지금 작전이 8 s 넘게 먹히지 않으면(준 피해 ≤ 받은 피해) 그 작전에 −0.6: 오래 붙들지 않는다
 *   판 중 학습: 3 s 넘게 해 본 작전은 그 성적(초당 준 피해 − 받은 피해, 2 /s를 1로)을 −1~1로 잘라 × 1.0
 * 기록 (m.op.log): 작전마다 고른 수·완수·시간, 강요하는 수와 그 뒤 상대가 길을 바꾼 수(대조: 다른 공격), 고른 자리의 성질(한쪽 사거리·엿보기·벗기기·퇴로) */
const { hyp, atan2, sin, cos } = require('../math');
const P = require('../../data/rules/tactics.json');
const OPS = ['fort', 'attrit', 'press', 'herd', 'hunt', 'finish'];
const DIRECT = { proj: 1, thread: 1, touch: 1, cone: 1 }, INDIRECT = { area: 1, lob: 1 }, OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const TERR = { wall: 1, build: 1, trap: 1, cage: 1, blueprint: 1, topple: 1 };
const lvOf = m => (m.C >= 5 && m.tac.ops) || 0;
module.exports = {
  name: 'tactics', switch: 'tactics', on: W => W.rules.tactics, api: { OPS, P },
  // 엔진: 강요한 수·대조 수의 뒤를 본다 (상대가 과녁 자리에서 2 m 넘게 멀어졌나)
  engine: X => ({
    mageStep(W, m) {
      const p = m.op.pend; if (!p || W.t < p.until) return;
      const moved = hyp(p.e.x - p.tx, p.e.y - p.ty) - p.d0 >= P.forceMove, L = m.op.log;
      if (p.force) { L.forceN++; if (moved) L.forced++; } else { L.ctrlN++; if (moved) L.ctrlMoved++; }
      m.op.pend = null;
    },
  }),
  brain: B => {
    const C = B.C, { inDist } = require('../brain/techniques/rhythm'), RC = new WeakMap(), BPA = () => { const r = C.RULES.find(x => x.name === 'blueprint'); return r && r.api; };
    // 사거리: 직사(투사체·실·몸·앞으로 뿜기)와 곡사·구름의 가장 긴 것 (덱마다 한 번)
    function ranges(m, D) {
      let r = RC.get(D); if (r) return r; r = { dir: 0, ind: 0 };
      for (let i = 0; i < D.sp.length; i++) { const s = D.sp[i], R = s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : D.R[i]; if (DIRECT[s.t] && R > r.dir) r.dir = R; if (INDIRECT[s.t] && R > r.ind) r.ind = R; }
      RC.set(D, r); return r;
    }
    const weak = (W, e) => e.st.stun > 0 || e.st.root > 0 || e.crash > 0 || (e.emptyT > W.t) || (e.fat > 92 && !e.wave);
    // 상대의 퇴로: 제 진지(60 m 안), 아니면 가장 가까운 바위(15 m 안), 아니면 싸움터 가운데
    function retreatOf(W, e) {
      if (e.fort && e.fort.x === e.fort.x && hyp(e.fort.x - e.x, e.fort.y - e.y) < 60) return [e.fort.x, e.fort.y];
      let b = null, bd = 15; for (const o of W.obs) { const d = hyp(o.x - e.x, o.y - e.y); if (d < bd) { bd = d; b = o; } }
      return b ? [b.x, b.y] : [W.width / 2, W.height / 2];
    }
    const book = (m, f) => { for (const n of m.book) { const s = m._deck && m._deck.S[n]; if (s && f(s)) return true; } return false; };
    // 작전 고르기 (data의 무게 × 특징)
    function choose(W, m, K, lv) {
      const e = K.e, h = m.hp / m.hpMax, eh = e.hp / e.hpMax, f = m.fat / 100, ef = e.fat / 100, Rm = ranges(m, K.Dm), Re = ranges(e, K.De), wk = weak(W, e) ? 1 : 0;
      const F = { base: 1, lead: h - eh, eLow: eh < 0.3 ? 1 : 0, eHalf: eh < 0.5 ? 1 : 0, eWeak: wk, finishable: eh < 0.5 && wk ? 1 : 0, hurt: 1 - h, behind: eh - h > 0.1 ? 1 : 0, tired: f > 0.8 ? 1 : 0, eTired: ef > f ? 1 : 0,
        rangeAdv: Math.max(0, Math.min(1, (Math.max(Rm.ind, Rm.dir) - Math.max(Re.ind, Re.dir)) / 10)), covered: K.los ? 0 : 1, eGround: e.z < 1 ? 1 : 0, eBack: K.vt < -1 ? 1 : 0, stronger: m.C >= e.C ? 1 : 0,   // rangeAdv: 상대 사거리(무엇이든) 밖에서 칠 수 있는 몫
        terrain: book(m, s => TERR[s.t] || (s.t === 'zone' && s.z && s.z.k !== 'rain' && s.z.k !== 'smoke')) ? 1 : 0, build: BPA() && m.book.includes('청사진') && W.rules.blueprint ? 1 : 0 };
      const O = m.op; let best = null, bs = -1e9;
      for (const k of OPS) {
        const w = P.score[k]; let s = 0; for (const f2 in w) s += w[f2] * (F[f2] || 0);
        const tk = O.log.time[k] || 0; if (tk >= P.learn[0]) { const q = ((O.log.dealt[k] || 0) - (O.log.took[k] || 0)) / tk / P.learn[1]; s += P.learn[2] * (q > 1 ? 1 : q < -1 ? -1 : q); }   // 판 중에 배운 작전의 성적 (초당 준 피해 − 받은 피해)
        if (k === O.cur) { s += P.stick; if (O.st && W.t - O.t0 > P.stall[0] && (O.st.ehp - e.hp) <= (O.st.hp - m.hp)) s -= P.stall[1]; }   // 먹히지 않는 작전은 오래 붙들지 않는다
        if (lv >= 2 && O.eOp && P.counter[O.eOp] && P.counter[O.eOp][k]) s += P.counter[O.eOp][k];   // 상대 작전의 맞수
        if (s > bs) { bs = s; best = k; }
      }
      return best;
    }
    // 작전 하나가 끝났다: 완수했나
    function close(W, m, K) {
      const O = m.op, S = O.st, L = O.log; if (!O.cur || !S) return;
      const e = K.e, dealt = S.ehp - e.hp, took = S.hp - m.hp, dt = W.t - O.t0; let ok = false;
      if (O.cur === 'attrit') ok = dealt > took;
      else if (O.cur === 'press') ok = dealt > took && S.minD <= S.dIn + 3;
      else if (O.cur === 'herd') ok = S.herdHit > 0 || m.fort.funnel > S.funnel;
      else if (O.cur === 'hunt') ok = S.gotLos;
      else if (O.cur === 'finish') ok = e.hp <= 0 || dealt > 0.15 * e.hpMax;
      else if (O.cur === 'fort') ok = (m.fort.bpN > S.bp || m.fort.walls + m.fort.traps > S.built) && took < 0.2 * m.hpMax;
      L.n[O.cur] = (L.n[O.cur] || 0) + 1; if (ok) L.ok[O.cur] = (L.ok[O.cur] || 0) + 1; L.time[O.cur] = (L.time[O.cur] || 0) + dt;
      L.dealt[O.cur] = (L.dealt[O.cur] || 0) + dealt; L.took[O.cur] = (L.took[O.cur] || 0) + took;
    }
    function open(W, m, K, op) {
      const O = m.op, e = K.e; O.cur = op; O.t0 = W.t;
      O.st = { hp: m.hp, ehp: e.hp, minD: K.d, dIn: inDist(W, m, e), herdHit: 0, funnel: m.fort.funnel, gotLos: false, covered0: !K.los, bp: m.fort.bpN, built: m.fort.walls + m.fort.traps };
    }
    // 각도 판단: 상대 둘레 자리 24개
    function angle(W, m, K, op) {
      const e = K.e, O = m.op, Rm = ranges(m, K.Dm), Re = ranges(e, K.De), d = K.d, dIn = O.st ? O.st.dIn : inDist(W, m, e);
      let rs;
      if (op === 'attrit') rs = Rm.ind > Re.dir + 4 ? [Re.dir + 2, (Re.dir + Rm.ind) / 2, Rm.ind - 2] : [K.prefR, K.prefR + 4, K.prefR + 8];
      else if (op === 'press') rs = [dIn, dIn + 3, dIn + 6];
      else if (op === 'finish') rs = [Math.max(3, dIn - 1), dIn + 2, dIn + 5];
      else rs = [Math.max(4, d - 4), d, d + 3];
      const th0 = atan2(m.y - e.y, m.x - e.x), zq = m.z > 2 ? m.z : 0, losNow = K.los, [rx, ry] = retreatOf(W, e), rd = hyp(rx - e.x, ry - e.y) || 1, fly = m.fly === 1 || (m.C >= 5 && W.rules.flight);
      const wantLos = op === 'press' || op === 'hunt' || op === 'finish', G = P.angle;
      let best = -1e9, bx = NaN, by = NaN, bk = 0;
      for (let a = 0; a < 8; a++) for (let j = 0; j < 3; j++) {
        const th = th0 + a * Math.PI / 4, r = rs[j], x = e.x + cos(th) * r, y = e.y + sin(th) * r;
        if (x < 2 || y < 2 || x > W.width - 2 || y > W.height - 2) continue;
        if (W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > C.saltR(W) - 2) continue;
        let s = -G.travel * hyp(x - m.x, y - m.y), kind = 0;
        if (lvOf(m) >= P.circleLv && ((a === 1 && O.dir > 0) || (a === 7 && O.dir < 0))) s += G.orbit;   // 돌던 쪽으로 한 칸(45°): 원을 그리며 돈다
        const los = !C.blocked(W, x, y, e.x, e.y, zq);
        if (los) s += wantLos ? G.los : G.losSoft;
        const dq = hyp(x - e.x, y - e.y);
        if (op !== 'press' && op !== 'finish' && dq > Re.dir + 1 && dq < Rm.ind - 1) { s += G.oneSide * (op === 'attrit' ? 1.5 : 1); kind |= 1; }
        if (op === 'attrit' && dq < Re.dir) s -= G.exposed;
        // 엿보기 각: 반 걸음(1.5 m) 옆 바위 쪽으로 들어가면 숨는다
        if (los) for (const o of W.obs) { const od = hyp(o.x - x, o.y - y); if (od < 3 && od > 0.1) { const sx = x + (o.x - x) / od * 1.5, sy = y + (o.y - y) / od * 1.5; if (C.blocked(W, sx, sy, e.x, e.y, 0)) { s += G.peek; kind |= 2; break; } } }
        if (!losNow && los) { s += G.strip * (op === 'hunt' ? 1.5 : 1); kind |= 4; }
        // 퇴로 자르기: 상대에서 퇴로 쪽 30° 안, 퇴로보다 가깝게
        if ((op === 'herd' || op === 'press') && dq < rd && ((x - e.x) * (rx - e.x) + (y - e.y) * (ry - e.y)) / (dq * rd || 1) > 0.866) { s += G.cut; kind |= 8; }
        for (const b of W.barrels) if (!b.ex && hyp(b.x - e.x, b.y - e.y) < 3.5 && !C.blocked(W, x, y, b.x, b.y, 0)) { s += G.barrel; break; }
        if (fly && !los) s += G.height;   // 날 수 있으면 바위 뒤도 좋다
        for (const z of W.zones) if (z.src.side !== m.side && ((z.k === 'sky' && fly) || (z.dps && C.inZone(z, x, y)))) { s -= G.danger; break; }
        for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - x, t.y - y) < 2) { s -= G.danger; break; }
        if (x < 6 || y < 6 || x > W.width - 6 || y > W.height - 6) s -= G.edge;
        if (s > best) { best = s; bx = x; by = y; bk = kind; }
      }
      if (bx === bx) { const cr = (m.x - e.x) * (by - e.y) - (m.y - e.y) * (bx - e.x); if (Math.abs(cr) > 1) O.dir = cr > 0 ? 1 : -1; }   // 도는 쪽을 기억한다
      O.tx = bx; O.ty = by; O.kind = bk;
    }
    // 강요하는 수: 상대가 반드시 대응해야 하는 수
    function forcing(W, m, K, s, tx, ty) {
      const e = K.e;
      if (s.t === 'area' && s.vis && e.z < 1 && !K.los && hyp(tx - e.x, ty - e.y) < 2) return P.force.hidden;          // 숨은 자리 위에 구름
      if (s.t === 'area' && s.kind === 'elec' && e.z >= 1 && hyp(tx - e.x, ty - e.y) < 3) return P.force.sky;            // 나는 상대 위에 번개 구름
      if (s.t === 'topple' && e.fort && e.fort.x === e.fort.x && hyp(tx - e.fort.x, ty - e.fort.y) < 12) return P.force.gate;   // 진지 입구에 벽 밀기
      if (s.t === 'trap' && e.z < 1) { const [rx, ry] = retreatOf(W, e), l = hyp(rx - e.x, ry - e.y) || 1; if (hyp(tx - (e.x + (rx - e.x) / l * 3), ty - (e.y + (ry - e.y) / l * 3)) < 2) return P.force.path; }   // 퇴로에 함정
      return 0;
    }
    return {
      // 작전 겹: 1~2 s마다 작전·자리를 고르고, 판단 때마다 작전을 생각 겹에 건다 (리듬의 단계를 고른 뒤)
      phase(W, m, K) {
        const lv = lvOf(m); if (!lv) return;
        const O = m.op, e = K.e;
        O.eVt = O.eVt * 0.8 + K.vt * 0.2;   // 상대의 다가오는 속도 (평균)
        if (O.st) { if (K.d < O.st.minD) O.st.minD = K.d; if (O.st.covered0 && K.los) O.st.gotLos = true; }
        if (W.t >= O.next) {
          O.next = W.t + (lv >= 2 ? P.every[1] : P.every[0]);
          if (lv >= 2) O.eOp = e.cast && (e.cast.s.t === 'build' || e.cast.s.t === 'blueprint') ? 'fort' : O.eVt > P.readVt[0] ? 'press' : (O.eVt < P.readVt[1] || (Math.abs(O.eVt) < P.readVt[0] && K.d > ranges(m, K.Dm).dir)) && K.d > 22 ? 'attrit' : null;   // 멀리서 버티면 소모로 본다
          const op = choose(W, m, K, lv); if (op !== O.cur) { close(W, m, K); open(W, m, K, op); O.log.pick++; }
          angle(W, m, K, op); const L = O.log; if (O.kind & 1) L.oneSide++; if (O.kind & 2) L.peek++; if (O.kind & 4) L.strip++; if (O.kind & 8) L.cut++; L.ticks++;
        }
        if (m.phase === 'out' || m.phase === 'build') return;   // 빠지기·짓기가 먼저
        const op = O.cur, Rm = ranges(m, K.Dm), Re = ranges(e, K.De);
        if (op === 'finish') { K.aggr *= P.aggr.finish; K.pressB = true; K.prefR = Math.min(K.prefR, O.st.dIn + 2); }
        else if (op === 'press') { K.aggr *= P.aggr.press; K.prefR = O.st.dIn; }
        else if (op === 'attrit') { K.prefR = Rm.ind > Re.dir + 4 ? Math.min(Rm.ind - 2, Re.dir + 3) : Math.max(K.prefR, 20); }
        else if (op === 'hunt' || op === 'herd') K.prefR = K.d;
        else if (op === 'fort') { K.prefR = K.d; K.aggr *= P.aggr.fort; const bp = BPA(); if (bp && m.phase === 'probe') bp.startBuild(W, m, K); }
      },
      // 걸음: 고른 자리로, 상대 둘레를 돌아서 (둘레 방향 1, 반지름 방향 0.4)
      steer(W, m, K) {
        const O = m.op; if (!lvOf(m) || !O.cur || K.dodge || m.phase === 'build') return;
        if (m.tac.sharp && W.t - K.wallT < 2 && W.t >= K.wallT - 1) return;   // 세운 벽 뒤에 머문다 (날카롭게, v2.8)
        if (m.phase === 'out') {   // 빠지기: 곧장 물러나지 않고 상대 둘레로 돌며 벌린다 (나선)
          if (m.retreat || !P.spiral || lvOf(m) < P.circleLv) return;   // 무리 앞 물러나기는 그대로. 나선은 전설만
          if (m.x < P.spiralEdge || m.y < P.spiralEdge || m.x > W.width - P.spiralEdge || m.y > W.height - P.spiralEdge || (W.rules.saltRing && hyp(m.x - W.width / 2, m.y - W.height / 2) > C.saltR(W) - P.spiralEdge)) return;   // 끝·소금 선 가까이선 소금 원의 걸음 그대로 (벌리다 선 밖으로 나가지 않게)
          const e = K.e, rx = m.x - e.x, ry = m.y - e.y, rl = hyp(rx, ry) || 1, out = rl < K.prefR ? P.spiral : 0;   // 빠지기 거리(22 m)까지만 벌리고, 그 뒤로는 둘레로만
          K.vx = (rx * out - ry * O.dir) / rl * 2; K.vy = (ry * out + rx * O.dir) / rl * 2; return;
        }
        if (!(O.tx === O.tx)) return;
        const e = K.e, dx = O.tx - m.x, dy = O.ty - m.y, l = hyp(dx, dy); if (l < 1) return;
        const rx0 = m.x - e.x, ry0 = m.y - e.y, rl = hyp(rx0, ry0) || 1, ux = rx0 / rl, uy = ry0 / rl, rad = dx * ux + dy * uy, tx = -uy, ty = ux, tan = dx * tx + dy * ty;
        let vx = ux * rad * P.radial + tx * tan, vy = uy * rad * P.radial + ty * tan; const vl = hyp(vx, vy) || 1; vx = vx / vl * 2; vy = vy / vl * 2;
        K.vx = K.vx * P.keep + vx * (1 - P.keep); K.vy = K.vy * P.keep + vy * (1 - P.keep);
      },
      // 값: 작전이 생각 겹의 마법을 목표로 기울인다, 강요하는 수(전설), 강요한 뒤 내 모양
      value(W, m, K, o) {
        const lv = lvOf(m), O = m.op; if (!lv || !O.cur || !(o.v > 0)) return;
        const s = o.s, e = K.e, op = O.cur, V = P.value;
        if (op === 'attrit') { const Re = ranges(e, K.De); if (INDIRECT[s.t]) o.v *= V.attritInd; else if (DIRECT[s.t] && K.d > Re.dir) o.v *= V.attritDir; }
        else if (op === 'press') { if (DIRECT[s.t]) o.v *= V.pressDir; }
        else if (op === 'finish') { if (OFF[s.t]) o.v *= V.finishOff; else o.v *= V.finishDef; }
        else if (op === 'hunt') { if (!K.los && INDIRECT[s.t]) o.v *= V.huntInd; }
        else if (op === 'herd' && (TERR[s.t] || s.t === 'zone' || s.t === 'area') && e.z < 1) {   // 몰이: 퇴로 쪽에
          const [rx, ry] = retreatOf(W, e), l = hyp(rx - e.x, ry - e.y) || 1; o.tx = e.x + (rx - e.x) / l * 3 + e.vx * 0.5; o.ty = e.y + (ry - e.y) / l * 3 + e.vy * 0.5; o.v *= V.herd;
        }
        else if (op === 'fort' && OFF[s.t]) o.v *= V.fortOff;
        if (lv >= 2) {
          const k = forcing(W, m, K, s, o.tx, o.ty); if (k) o.v = o.v * k + 0.2;
          if (W.t - O.fT < P.shapeAfter && (TERR[s.t] || (s.t === 'zone' && s.z && s.z.k !== 'rain'))) o.v *= V.shapeAfter;   // 상대가 대응하는 동안 내 모양을
        }
      },
      // 걸린 수: 강요한 수인가(전설), 그 뒤 상대가 길을 바꾸는지 엔진이 본다 (공격이면 대조로)
      commit(W, m, K, best, cast, Tc) {
        const lv = lvOf(m), O = m.op; if (!lv || O.pend) return;
        const s = best.s, e = K.e, f = lv >= 2 && forcing(W, m, K, s, best.tx, best.ty) > 0;
        if (f) O.fT = W.t;
        if (f || OFF[s.t]) O.pend = { force: f, e, tx: best.tx, ty: best.ty, d0: hyp(e.x - best.tx, e.y - best.ty), until: W.t + (Tc || 0) + P.forceWin };
        if (O.cur === 'herd' && O.st && (s.t === 'trap' || s.t === 'area' || s.t === 'zone')) O.st.herdHit += (m.log.hits[s.n] || 0) > 0 ? 1 : 0;
      },
    };
  },
};
