'use strict';
/* 규칙: 빠른 판 (rules.pace, v2.14, SPEC 38장, 수는 data/rules/pace.json) — 대마법사 결투는 사람 눈이 못 따라갈 만큼 빠르다
 * 선명도 cMin(8) 이상에게만 (대마법사). 기본 꺼짐, 대마법사 결투 장면이 켠다. 끄면 예전과 같다.
 * 엔진 (대마법사 누구나):
 *   떡대 — 적이 준 피해(추락·소금·폭주 빼고) × bulk. 빨리 식기(머리 회복 × cool), 땅 걸음 × run, 꺾는 가속(걷기·날기의 끊는 움직임) × agile
 *   막기 — 순간 켜기 패시브 (st.guard: 켠 뒤 지난 시간, 0이면 꺼짐). 켠 동안 피해 × guard.k, 당 초당 guard.glu, 그동안 지어 푼 마법의 위력 × guard.pow.
 *     잔기술 규칙(rules/passive, v2.18)이 켜진 판에선 막기를 켜지 않는다(잔기술이 대신한다). 켜고 끄는 데 시간이 들지 않는다. 끈 뒤 guard.cd s는 다시 못 켠다(v2.15: 수읽기의 자원). 당이 guard.gluMin 아래거나 굳으면 꺼진다. 기록 m.mlog.guardN(켜고 끈 수)·guardT(켠 시간)·guardBlk(막은 피해)
 *   감각 조준 (track 훅) — 실·투사체·구름을 풀 때 과녁의 지금 자리(구름은 터질 때까지의 반쯤 앞)가 겨눈 곳에서 track[tac.pace] m 안이면 그리로 고쳐 겨눈다. 기록 mlog.trackN
 *     숨긴 수(c.hid)는 반경 × trackHid (v2.23, 기본 1 = 끔: 0.6은 명중을 무너뜨렸다. v2.21의 × 드러남은 거뒀다)
 * 두뇌 (대마법사 누구나): 시전 시간 × castK, 되쓰기 × cdK, 당 × costK, 실은 threadK 배 빨리 뻗는다 (빠른 수의 연속)
 * 두뇌 (판단 수준 tac.pace: 상급 1·대가 2·전설 3):
 *   서두름 K.hurry = move.hurry: 날카롭게의 명중 문턱 × (1 − hurry) (기다림이 아니라 빠른 수)
 *   막기: 나를 노린 수가 guard.lead s 안에 닿으면 켠다(적의 칸이 나를 노림·내 앞길 guard.near m 안, 터지기 직전의 구름, 앞길의 덫, 다가오는 투사체). 위협이 없으면 guard.min s 뒤 끈다
 *   늘 움직이기 (결투에서만): 늘 난다(식히러 내려앉을 때만 땅), 날면 목표 속도 move.vMin(들 땐 vIn) 아래로 늦추지 않는다(쏠 때도).
 *     피하기가 아니면 걸음을 들고 나기로: 둘레(옆) move.lat + 지름(안·밖). 들기는 가장 짧은 실의 사거리 × inK까지, 나기는 가장 긴 실의 × outK까지.
 *     닿거나 move.flip s가 지나면 바꾸고, 바꿀 때 둘레 방향을 turnP로 뒤집고 옆으로 튄다(날기 끊기). 전설은 flipL로 더 잦고, 때를 읽는다(move.read:
 *     짧은 실이 준비됐고 노린 수가 없으면 들고, 막 쏘았거나 노린 수가 곧 닿으면 난다)
 *   끊기를 옆 튀기로 (preMove): 떨어지기·내리꽂기·급정지와 반사 겹의 멈칫은 걸음을 못 바꾸거나 멈춘다. 옆 튀기·옆으로 꺾기로 바꾼다(반사 겹 뒤에 돈다) */
const P = require('../../data/rules/pace.json'), G = P.guard, MV = P.move;
const on = (W, m) => m.C >= P.cMin;
const TR = { thread: 1, proj: 1, area: 2 };
const FL = require('./flight').api, SR = require('./saltRing').api;
const SKIP = { fall: 1, salt: 1, backfire: 1, wave: 1 };
module.exports = {
  name: 'pace', switch: 'pace', api: { P },
  engine: X => ({
    // 감각 조준: 실·투사체·구름을 풀 때 과녁의 지금 자리가 겨눈 곳에서 track m 안이면 그리로 고쳐 겨눈다 (짓는 동안 장악권으로 과녁을 느낀다)
    track(W, m, c) {
      const q = c.tgt, t = TR[c.s.t]; if (!on(W, m) || !q || q.hp <= 0 || c.auto || !t) return;
      const R = (P.track[m.tac.pace || 0] || 0) * (c.hid ? P.trackHid : 1); if (!R) return;   // 숨긴 수는 짓는 동안 장악권을 억눌러 과녁을 덜 느낀다 (v2.23)
      const k = t === 2 ? (c.s.delay || 0) * 0.5 : 0, px = q.x + q.vx * k, py = q.y + q.vy * k, d = X.hyp(px - c.tx, py - c.ty);   // 구름은 터질 때의 반쯤 앞으로
      if (d < R && d > 0) { c.tx = px; c.ty = py; m.mlog.trackN++; }
    },
    hurtMod(W, m, v, kind) {
      if (!on(W, m) || SKIP[kind]) return v;
      v *= P.bulk;
      if (m.st.guard > 0) { m.mlog.guardBlk += v * (1 - G.k); v *= G.k; if (m.st.guard < G.okT && m.mlog.gdOkC !== m.mlog.gdOn) { m.mlog.gdOk++; m.mlog.gdOkC = m.mlog.gdOn; } }   // 순간 켜기 성공: 켠 지 okT s 안에 맞았다 (v2.16 지표)
      return v;
    },
    fatRecover(W, m, k) { return on(W, m) ? k * P.cool : k; },   // 빨리 식는다 (짧은 수를 잇달아 지으니)
    flyAccel(W, m, a) { return on(W, m) ? a * P.agile : a; },   // 날며 꺾는 가속 (끊는 움직임의 a, rules/flight)
    accel(W, m, acc) { return on(W, m) ? acc * P.agile : acc; },   // 땅에서도
    speed(W, m, sp) { return on(W, m) ? sp * P.run : sp; },   // 땅에서도 빠르다 (장악권으로 미끄러진다)
    power(W, m, s, p) { return on(W, m) && m.st.guard > 0 ? p * G.pow : p; },   // 막기를 켠 채 지은 마법은 약하다
    // 끊기를 옆 튀기로 (tac.pace): 떨어지기·내리꽂기·급정지·멈칫은 걸음을 못 바꾸거나 멈춘다. 반사 겹(엔진)·두뇌가 청한 것을 움직이기 앞에서 바꾼다 (반사 겹 뒤에 돈다)
    preMove(W, m) {
      if (!m.tac.pace || !MV.noDrop || !on(W, m)) return;
      const w = m.cut.w, R = m.rx, stop = R && W.t < R.until && R.vx === 0 && R.vy === 0 && m.fly === 1;
      if (!(w === 1 || w === 4 || w === 5) && !stop) return;
      let q = null, bd = 1e9; for (const o of W.ms) if (o.side !== m.side && o.hp > 0) { const d = X.hyp(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; q = o; } }
      const ex = q ? q.x - m.x : 1, ey = q ? q.y - m.y : 0, l = X.hyp(ex, ey) || 1, s = m.mlog.pcS || 1, px = -ey / l * s, py = ex / l * s;
      if (w === 1 || w === 4 || w === 5) { m.cut.x = px; m.cut.y = py; m.cut.w = 2; }
      if (stop) { R.vx = px; R.vy = py; R.fv = MV.vIn; m.mv.x = px; m.mv.y = py; m.fv = MV.vIn; }   // 반사 겹의 멈칫(rules/reflex)도 옆으로 꺾기로
    },
    mageStep(W, m) {
      if (!(m.st.guard > 0)) return;
      m.st.guard += W.dt; m.mlog.guardT += W.dt; m.glu -= G.glu * W.dt;
      if (m.glu < G.gluMin || m.st.stun > 0) { m.st.guard = 0; m.mlog.guardN++; m.mlog.gdOff = W.t; }   // 당이 바닥나거나 굳으면 꺼진다
    },
  }),
  brain: B => {
    // 나를 노린 수가 lead s 안에 닿는가
    function soon(W, m, K) {
      for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || c.s.t === 'buff' || c.s.t === 'wall' || c.s.t === 'move' || c.T - c.t >= G.lead) continue; const k = c.T - c.t; if (c.tgt === m || B.C.hyp(c.tx - m.x - m.vx * k, c.ty - m.y - m.vy * k) < G.near + (c.s.r || 0)) return true; }
      for (const a of W.areas) if (a.src.side !== m.side && a.t < G.lead && B.C.hyp(a.x - m.x - m.vx * a.t, a.y - m.y - m.vy * a.t) < a.r + 0.6) return true;
      for (const t of W.traps) if (t.src.side !== m.side && !t.done && m.z < 1.5 && t.seen.has(m.id) && B.C.hyp(t.x - m.x - m.vx * G.lead, t.y - m.y - m.vy * G.lead) < 2) return true;
      for (const p of W.proj) { if (p.dead || !p.src || p.src.side === m.side) continue; const dx = m.x - p.x, dy = m.y - p.y, v2 = p.vx * p.vx + p.vy * p.vy; if (!v2) continue; const t = (dx * p.vx + dy * p.vy) / v2; if (t > 0 && t < G.lead && B.C.hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 1.2) return true; }
      return false;
    }
    return {
      castTime(W, m, t) { return on(W, m) ? t * P.castK : t; },
      commit(W, m, K, best, cast) {
        if (!on(W, m)) return; if (m.cd[best.n] > 0) m.cd[best.n] *= P.cdK; m.glu += best.cost * (1 - P.costK);
        const s = best.s; if (s.t === 'thread') { const fl = Math.min(B.C.hyp(best.tx - m.x, best.ty - m.y), B.C.rangeOf(m, s)) / (32 * (s.fast || 1)); cast.T -= fl * (1 - 1 / P.threadK); }   // 실이 threadK 배 빨리 뻗는다
      },
      bound(W, m, K) {
        const L = m.tac.pace; if (!L || !on(W, m) || m.hp <= 0) return;
        K.hurry = MV.hurry[L - 1] || 0;   // 서두름: 날카롭게의 명중 문턱 × (1 − hurry) (techniques/sharp, 이 판단의 고르기에)
        // 막기
        const th = soon(W, m, K), g = m.st.guard > 0;
        if (W.rules.passives) {} else if (th && !g && m.glu > G.gluMin + 3 && !(m.st.stun > 0) && W.t - m.mlog.gdOff >= G.cd && !(K.keep & 4 && W.t < K.keepT)) { m.st.guard = 1e-6; m.mlog.guardN++; m.mlog.gdT = W.t; m.mlog.gdOn = W.t; }
        else if (g) { if (th) m.mlog.gdT = W.t; else if (W.t - m.mlog.gdT >= G.min) { m.st.guard = 0; m.mlog.guardN++; m.mlog.gdOff = W.t; } }
        // 늘 움직이기 (결투에서만)
        if (K.foes.length !== 1 || m.st.breath > 0 || m.retreat) return;
        const e = K.e; if (!e) return;
        const pl = m.mlog;
        if (MV.fly && !m.cut.cool && !m.flyWant && FL.outP(m) >= FL.F.minP && FL.canFly(m)) { m.flyWant = true; if (m.fz < FL.F.zMin) m.fz = FL.F.zMin + 1; }   // 늘 난다 (식히러 내려앉을 때만 땅)
        if (m.fly === 1 && m.fv < MV.vMin) m.fv = pl.pcIn ? MV.vIn : MV.vMin;
        if (K.dodge || K.brk > W.t) return;   // 피하기의 걸음·그물 깨기(수읽기, v2.15)는 그대로
        if (!pl.pcR0) { let a = 1e9, b = 0; for (const n of m.book) { const x = W.spells[n]; if (!x || x.t !== 'thread') continue; const r = B.C.rangeOf(m, x); if (r < a) { a = r; pl.pcN = n; } if (r > b) b = r; } pl.pcR0 = a < 1e9 ? a : 10; pl.pcR1 = b || 20; }   // 실의 사거리 (가장 짧은 것·긴 것)
        const dx = e.x - m.x, dy = e.y - m.y, d = B.C.hyp(dx, dy) || 1, ux = dx / d, uy = dy / d, w0 = pl.pcR0 * MV.inK, w1 = pl.pcR1 * MV.outK;
        // 들기는 가까운 거리에 닿거나 move.flip이 지나면 나기로, 나기는 먼 거리에 닿거나 지나면 들기로. 바꿀 때 둘레 방향을 반쯤 뒤집는다
        // 전설(pace 2)은 때를 읽는다: 짧은 실이 준비됐고 나를 노린 수가 없으면 들고, 막 쏘았거나 노린 수가 곧 닿으면 난다
        let flip = W.t >= pl.pcT || (pl.pcIn ? d < w0 + 1 : d > w1 - 1);
        if (L >= 3 && MV.read) { const rdy = pl.pcN ? !(m.cd[pl.pcN] > 0) : true; if (!pl.pcIn && rdy && !th && d > w0 + 3) flip = true; else if (pl.pcIn && (th || W.t - m.lastRel < 0.1)) flip = true; }
        if (flip) { const f = L >= 3 ? MV.flipL : MV.flip; pl.pcT = W.t + W.rnd(f[0], f[1]); pl.pcIn = !pl.pcIn; if (W.rng() < MV.turnP) pl.pcS = -pl.pcS || 1;
          if (W.rules.flightCut && m.fly === 1 && !(m.cut.cd > 0) && !m.cut.k) { const s = pl.pcS || 1; m.cut.x = -uy * s; m.cut.y = ux * s; m.cut.w = 2; } }   // 바꿀 때 옆으로 튄다 (끊기)
        const want = pl.pcIn ? w0 : w1, rad = d > want + 1 ? 1 : d < want - 1 ? -1 : 0, s = pl.pcS || 1;
        K.vx = ux * rad - uy * s * MV.lat; K.vy = uy * rad + ux * s * MV.lat;
        if (W.rules.saltRing) SR.bound(W, m, K, B);   // 소금 원의 단단한 벽은 바뀐 걸음에도 (rules/saltRing)
      },
    };
  },
};
