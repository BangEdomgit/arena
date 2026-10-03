'use strict';
/* 규칙: 합창 설계 (rules.chorusCast, v2.34, SPEC 56장, 수는 data/rules/chorusCast.json, 마법은 data/spells의 chorusOnly·ring) — 기본 꺼짐, 합창(rules.chorus) 위에서
 * 합창은 여럿이 하나의 설계를 나눠 쥐는 것: 맞춰진 합창(chorus.of)은 셋을 모은다
 *   고리 = 사람마다 (서클 − 1)의 합(하나는 박자 맞추기에), 출력 = 사람마다 kW × C^outK × 피로 배수의 합, 선명도 = C × √N(rules/chorus의 ceff 그대로)
 *   상위 여섯 ≈ 고리 24 · 출력 0.67 MW · 선명도 12, 중간 셋 ≈ 고리 6 · 0.06 MW · 4.3
 * 앞소리꾼이 쓸 수 있는 것은 모은 고리·출력으로 (두뇌 훅 rings: 쥘 수 있는 고리)
 *   손잡이(rules/tune)의 최대 단계는 쥘 수 있는 고리가 tune.maxCirc 이상이면. 고리를 많이 먹는 마법(ring)은 쥘 수 있는 고리가 그만큼일 때만(혼자도 같다: 상위 혼자는 대낙뢰를 못 쥔다)
 *   예비동작 = 신호 + 에너지 ÷ (모은 출력 ÷ 제 출력): 예비동작 × (sig + (1 − sig) E ÷ k) ÷ (sig + (1 − sig) E). 머리 열·당은 합창한 사람들이 나눠 낸다
 *   드러남은 합친 것(큰 수의 cast.vis × N^(1/3), 못 보는 일이 없다)
 * 합창만의 마법(chorusOnly, 앞소리꾼만, 합창할 수 있는 사람의 책에 엔진 훅 book이 더한다)
 *   고요한 원(calm): 앞소리꾼에서 과녁 쪽 reach m까지의 자리에 반지름 r m. 쥐는 동안(합창이 깨지지 않고 dur s까지, 사람마다 초당 hold.fat 머리) 그 안의 장악은 우리 편이 1, 적이 0(엔진 훅 share)
 *   번개 장막(area, sky): 나는 과녁(z ≥ 1)만 맞고, 맞으면 떨어진다(엔진 훅 areaHit) · 석회 고리(limering): 과녁 둘레 r m에 석회 담 multi칸, dur s
 *   구름 걸기(cloud): 반지름 r m의 연막(시야를 끊는다)과 비(불을 끈다) · 곳간 터뜨리기(granary): 과녁 둘레 r m 칸의 곳간을 left만 남긴다(rules/drain이 켜졌을 때)
 *   합창 방패(cshield): 앞소리꾼 둘레 r m의 우리 편 모두에게 석회 막(buf front·block) dur s
 * 깨짐: 큰 수(chorusOnly · 앞소리꾼 혼자의 고리를 넘는 ring · 손잡이 에너지 bigE 이상)를 짓는 동안 합창이 깨지면(쓰러짐·굳음·멀어짐) 설계가 풀리고(시전을 거둔다),
 *   합창했던 사람마다 역류: 피해 back.dmg · 머리 back.fat · 굳음 back.stun × 고리/8 × E^(1/3). 쥐던 고요한 원이 깨지면 그 × back.hold
 * 두뇌: 앞소리꾼은 사람이 calm.minN 이상이고 과녁이 calm.foeC배 넘게 선명하면 고요한 원부터(그 안에선 다른 조의 과녁 자리 마법이 선다), 나는 과녁엔 번개 장막,
 *   땅의 과녁엔 석회 고리, 과녁을 노리는 큰 수엔 합창 방패. 큰 수가 닿지 않으면 합창이 한 덩어리로 다가간다(push, 두뇌 훅 steer).
 *   선명도 see.C 이상은 see.R m 안의 합창 큰 수(번쩍임)를 보고 그 앞소리꾼을 노린다(두뇌 훅 aim), 묶는 수 × see.bind
 * 상태는 세계마다 WeakMap. api: stats(W), pool(W, g), calms(W) */
const P = require('../../data/rules/chorusCast.json'), TP = require('../../data/rules/tune.json');
const CH = require('./chorus').api, DR = require('./drain').api, TU = require('./tune').api;
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, MINE = { calm: 1, limering: 1, cloud: 1, granary: 1, cshield: 1 };
const CHK = new Set(P.cm.check), MATE = new Set(P.cm.mate);
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const ST = new WeakMap();
function stOf(W) { let s = ST.get(W); if (!s) ST.set(W, s = { big: new Map(), calms: [], push: new Map(), chk: new Map(), es: new Map(), st: { bindN: 0, bindOk: 0, bindG: 0, checkN: 0, mateN: 0, chain: 0, bigN: 0, bigOk: 0, bigBroke: 0, bigCancel: 0, by: {}, calmN: 0, calmT: 0, calmIn: 0, netHit: 0, limeN: 0, cloudN: 0, granN: 0, shieldN: 0, backDmg: 0 } }); return s; }
const fatK = m => { const k = 1 - Math.min(m.fat, 100) / 200; return k < 0.6 ? 0.6 : k; };
// 사람 하나의 출력(kW)과 합창이 모은 것
function outOf(X, m) { return P.kW * X.pow(m.C > 0.01 ? m.C : 0.01, P.outK) * fatK(m); }
function pool(X, W, g) { let rings = 0, out = 0; for (const q of g.ms) if (q.hp > 0) { rings += q.circles > 1 ? q.circles - 1 : 0; out += outOf(X, q); } return { rings, out, C: g.lead.C * Math.sqrt(g.n) }; }
const leadOf = (W, m) => { const g = CH.of(W, m); return g && g.lead === m ? g : null; };
function heldOf(S, g) { let h = 0; for (const c of S.calms) if (c.g === g) h += c.ring; return h; }
const bigOf = (m, s, E) => !!(s.chorusOnly || (s.ring && s.ring > m.circles - 1) || E >= P.bigE);
let XX = null;   // 엔진의 것 (두뇌 쪽도 같은 셈을 쓴다)
// 역류: 합창했던 사람마다
function backlash(X, W, ms, k) {
  const S = stOf(W), B = P.back; for (const q of ms) { if (!(q.hp > 0)) continue; const d = B.dmg * k; X.hurt(W, q, d, null, '합창 역류', 'blunt'); S.st.backDmg += d; q.fat += B.fat * k; if (B.stun > 0) X.eff(W, q, { stun: B.stun * k }, 1); }
}
module.exports = {
  name: 'chorusCast', switch: 'chorusCast', api: { P, stats: W => stOf(W).st, pool: (W, g) => pool(XX, W, g), calms: W => stOf(W).calms },
  form: { calm: 'self', limering: 'target', cloud: 'target', granary: 'target', cshield: 'self' },
  engine: X => {
    XX = X;
    return {
      // 합창할 수 있는 사람(전투단·합창, 단계의 합창 한계가 둘 이상)의 책에 합창의 마법을 더한다
      book(W, spec, bk) { if (!spec.tac || !(spec.tac.squad || spec.tac.chorus) || CH.limitOf({ C: spec.C || 0 }) < 2) return; for (const n of P.book) if (!bk.includes(n)) bk.push(n); },
      // 고요한 원 안의 장악: 원을 쥔 편 1, 적 0
      share(W, m, x, y, f) { const S = ST.get(W); if (!S || !S.calms.length) return f; for (const c of S.calms) if (X.hyp(x - c.x, y - c.y) < c.r) return m.side === c.side ? 1 : 0; return f; },
      // 번개 장막: 나는 과녁만, 맞으면 떨어진다
      areaHit(W, q, a, sole) { if (!a.s.sky) return sole; if (!(q.z >= 1)) return 0; if (W.rules.flight && (q.fly === 1 || q.fly === 3)) { q.fly = 2; q.fallZ = q.z; if (q.vz > 0) q.vz = 0; } stOf(W).st.netHit++; return sole; },
      release(W, m, c) {
        const S = stOf(W), s = c.s, g = leadOf(W, m);
        if (S.calms.length && OFF[s.t]) { const p = X.formPoint(m, s, c.tx, c.ty); if (p) for (const k of S.calms) if (k.side === m.side && X.hyp(p[0] - k.x, p[1] - k.y) < k.r) { S.st.calmIn++; break; } }   // 고요한 원 안에서 선 과녁 자리 마법
        const b = S.big.get(m); if (b && b.c === c) { S.st.bigOk++; S.big.delete(m); }
        if (c.tgt && c.tgt.C >= P.see.C && isBind(s) && !s.mundane) { const h = CH.of(W, m); if (h && h.lead !== m) { const p = X.formPoint(m, s, c.tx, c.ty) || [c.tx, c.ty], gg = X.gOf(W, X.share(W, m, p[0], p[1])); S.st.bindN++; S.st.bindG += gg; if (gg > 0.02) S.st.bindOk++; } }   // 합창원(앞소리꾼 빼고)의 굳히는 수가 대마법사에게 선 몫 (v2.36 지표)
        if (g && c.tgt) { if (CHK.has(s.n)) { S.st.checkN++; S.chk.set(c.tgt, W.t); } else if (MATE.has(s.n)) { S.st.mateN++; const t = S.chk.get(c.tgt); if (t != null && W.t - t <= P.cm.chainT) S.st.chain++; } }   // 체크 뒤 메이트로 이어진 몫 (v2.35)
        if (g && W.rules.fatigue && !s.mundane && g.n > 1) {   // 머리 열은 나눠 낸다 (core가 이 뒤에 앞소리꾼에게 더한다)
          const heat = s.cost * (c.B ? 1.3 : 1) * (c.auto ? 0.8 : 1) * 1.6, n = g.n; m.fat -= heat * (n - 1) / n; for (const q of g.ms) if (q !== m && q.hp > 0) q.fat += heat / n; }
      },
      world(W) {
        const S = ST.get(W); if (!S) return;
        if (S.big.size) for (const [m, b] of S.big) {   // 짓는 큰 수: 합창이 깨지면 설계가 풀리고 역류
          const g = CH.of(W, m); if (m.cast === b.c && g === b.g && m.hp > 0) continue;
          S.big.delete(m); if (m.cast === b.c) m.cast = null;
          if (g !== b.g || !(m.hp > 0) || m.st.stun > 0) { S.st.bigBroke++; backlash(X, W, b.ms, b.ring / 8 * X.pow(b.E, 1 / 3)); } else S.st.bigCancel++;
        }
        if (S.calms.length) { let w = 0; for (const c of S.calms) {   // 쥐는 고요한 원
          const g = CH.of(W, c.lead), alive = g === c.g && c.lead.hp > 0 && W.t < c.end;
          if (alive) { c.z.t = c.end - W.t; S.st.calmT += W.dt; for (const q of g.ms) if (q.hp > 0) q.fat += P.hold.fat * W.dt; S.calms[w++] = c; continue; }
          c.z.t = 0; if (W.t < c.end) backlash(X, W, c.ms, c.ring / 8 * P.back.hold); }
          if (w < S.calms.length) S.calms.splice(w); }
      },
    };
  },
  types: X => ({
    calm(W, m, c, a) {
      const g = leadOf(W, m); if (!g) return; const s = c.s, S = stOf(W), dx = c.tx - m.x, dy = c.ty - m.y, d = X.hyp(dx, dy) || 1, k = Math.min(d, P.calm.reach) / d;
      const x = X.clamp(m.x + dx * k, 0, W.width), y = X.clamp(m.y + dy * k, 0, W.height); X.addZone(W, m, { k: 'calm', shape: 'circle', r: s.r, d: s.dur, n: s.n }, x, y, 0, 1);
      S.calms.push({ z: W.zones[W.zones.length - 1], g, lead: m, ms: g.ms.slice(), side: m.side, x, y, r: s.r, end: W.t + s.dur, ring: s.ring || 0 }); S.st.calmN++;
    },
    limering(W, m, c, a) {
      const s = c.s, n = s.multi || 18, grp = W._grp++; let h = false;
      for (let k = 0; k < n; k++) { const b = k / n * 6.2832; X.addWall(W, { x: X.clamp(c.tx + X.cos(b) * s.r, 0.4, W.width - 0.4), y: X.clamp(c.ty + X.sin(b) * s.r, 0.4, W.height - 0.4), r: s.pr, hp: s.hp, t: s.dur, own: m.side, cage: 1, mat: 'lime', grp }); }
      for (const q of a.foes) if (X.hyp(q.x - c.tx, q.y - c.ty) < s.r - 0.4) h = true; if (h) X.hit(m, s); stOf(W).st.limeN++;
    },
    cloud(W, m, c, a) { const s = c.s; X.addZone(W, m, { k: 'smoke', shape: 'circle', r: s.r, d: s.dur, n: s.n }, c.tx, c.ty, 0, 1); X.addZone(W, m, { k: 'rain', shape: 'circle', r: s.r, d: s.dur, n: s.n }, c.tx, c.ty, 0, 1); stOf(W).st.cloudN++; },
    granary(W, m, c, a) {
      if (!W.rules.drain) return; const s = c.s, G = DR.stats(W), cell = DR.P.cell, i0 = Math.floor((c.tx - s.r) / cell), i1 = Math.floor((c.tx + s.r) / cell), j0 = Math.floor((c.ty - s.r) / cell), j1 = Math.floor((c.ty + s.r) / cell);
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { if (i < 0 || j < 0 || i >= G.nx || j >= G.ny) continue; if (X.hyp((i + 0.5) * cell - c.tx, (j + 0.5) * cell - c.ty) > s.r) continue; G.a[j * G.nx + i] *= P.granary.left; }
      stOf(W).st.granN++;
    },
    cshield(W, m, c, a) { const s = c.s; for (const q of W.ms) if (q.side === m.side && q.hp > 0 && X.hyp(q.x - m.x, q.y - m.y) < s.r) { q.buf.front = { v: 1, t: s.dur }; q.buf.block = { v: 1, t: s.dur }; } stOf(W).st.shieldN++; },
  }),
  brainTypes: () => ({ calm(W, m, K, o) { o.v = 0; }, limering(W, m, K, o) { o.v = 0; }, cloud(W, m, K, o) { o.v = 0; }, granary(W, m, K, o) { o.v = 0; }, cshield(W, m, K, o) { o.v = 0; } }),   // 값은 valueLate (앞소리꾼)
  brain: B => {
    const C = B.C, hyp = B.hyp, PL = B.lib.plan, CM = P.cm;
    // 과녁의 줄인 상태 (수읽기, SPEC 39장): 앞소리꾼마다 걸음마다 한 번
    const stateOf = (W, m, e) => { const S = stOf(W); let x = S.es.get(m); if (!x) S.es.set(m, x = { s: PL.newSide(), step: -1, e: null, k: 0 }); const k = e.st.stun + e.st.root * 7 + e.z * 13; if (x.step !== W.step || x.e !== e || x.k !== k) { PL.build(W, e, m, x.s, PL.P.horizon, true); x.step = W.step; x.e = e; x.k = k; } return x.s; };
    // τ s 안에 r m를 빠져나갈 수 있나: 옆 튀기·구르기·열린 피할 곳으로 움직이기 (막힌 곳: 벽·석회 고리·바위·소금·끝, 굳음·묶임·떨어짐은 S.up)
    // 날 수 없는 과녁(S.a 0)은 피할 곳까지의 길도 본다: 석회 고리·벽·바위를 넘지 못한다. 날 수 있으면 굳음·떨어짐(S.up)이 풀린 뒤 넘는다
    // 합창의 앞소리꾼이 나를 겨눈 번개, 또는 내 둘레의 합창 번개 구름
    function chorusElec(W, m) {
      for (const a of W.areas) if (a.src.side !== m.side && a.s.kind === 'elec' && hyp(a.x - m.x, a.y - m.y) < a.r + P.see.elecPad && leadOf(W, a.src)) return true;
      for (const q of W.ms) { if (q.side === m.side || !(q.hp > 0)) continue; const c = q.cast; if (c && c.tgt === m && c.s.kind === 'elec' && leadOf(W, q)) return true; }
      return false;
    }
    function escapes(W, e, S, tau, r) {
      if (S.has & 2 && S.av[1] <= tau && PL.cutOK(S, tau - S.av[1], r)) return true;
      if (S.has & 1 && S.av[0] <= tau && PL.rollOK(S, tau - S.av[0], r)) return true;
      if (!PL.moveOK(S, tau, r)) return false;
      for (let j = 1; j < 9; j++) if (S.blk[j] <= tau && (S.a > 0 || !C.blocked(W, e.x, e.y, S.bx[j], S.by[j], 0))) return true;
      return false;
    }
    // 메이트(큰 수)의 맞을 가망: 터지기까지(예비동작 + 지연·나는 시간) 과녁이 반지름 밖으로 빠져나갈 수 있으면 escP, 못 하면 1 (막기가 있으면 × guardK)
    function mateHit(W, m, e, s, o, g) {
      const S = stateOf(W, m, e), k = pool(XX, W, g).out / outOf(XX, m), sig = TP.sig, Tc = B.castTime(W, m, o.Tw) * (sig + (1 - sig) / (k > 1 ? k : 1));
      const tau = Tc + (s.t === 'area' ? s.delay : s.t === 'lob' ? s.flight : 0), r = (s.r || 1) * C.sizeOf(m, s) * Math.sqrt(g.n) + 0.3;
      let p = escapes(W, e, S, tau, r) ? CM.escP : 1; if (S.has & 4 && S.av[2] <= tau) p *= CM.guardK;
      const a = PL.aim(W, e, tau); o.tx = a.x; o.ty = a.y; return p;
    }
    return {
      // 쥘 수 있는 고리: 앞소리꾼은 모은 고리 − 쥐고 있는 고요한 원, 다른 합창하는 사람은 박자 하나
      rings(W, m, r) { const g = CH.of(W, m); if (!g) return r; if (g.lead !== m) return 1; const S = ST.get(W); return pool(XX, W, g).rings - (S ? heldOf(S, g) : 0); },
      // 합창의 큰 수를 보고 깨러 온다
      aim(W, m, K) { if (m.C < P.see.C || m.flee) return; const S = ST.get(W); if (!S) return; let e = null, bd = P.see.R;
        if (S.big.size) for (const [q, b] of S.big) { if (q.side === m.side || !(q.hp > 0) || q.cast !== b.c) continue; const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } }
        if (m.tac.chorusBreak && S.calms.length) for (const c of S.calms) { if (c.side === m.side || !(c.lead.hp > 0)) continue; const d = hyp(c.lead.x - m.x, c.lead.y - m.y) - P.calm.breakB; if (d < bd) { bd = d; e = c.lead; } }   // 합창 깨기(전설): 고요한 원을 쥔 앞소리꾼 (깨면 원이 사라진다, v2.35)
        if (e) K.e = e; },
      steer(W, m, K) {   // 큰 수가 닿지 않으면 합창이 한 덩어리로 다가간다
        if (m.tac.chorusBreak && m.C >= P.see.C && !m.flyWant && m.fly !== 2 && !(m.cut && m.cut.cool) && chorusElec(W, m)) m.flyWant = true;   // 합창 깨기(전설): 합창의 번개(넓고 세다)엔 내려앉지 않고 날며 비킨다 (v2.35)
        if (K.dodge || m.flee) return;
        if (m.tac.chorusBreak && m.C >= P.see.C) { const S = ST.get(W); if (S) for (const c of S.calms) { if (c.side === m.side) continue; const dx = m.x - c.x, dy = m.y - c.y, l = hyp(dx, dy) || 0.1; if (l < c.r + P.calm.outPad) { K.vx = dx / l * P.calm.outV; K.vy = dy / l * P.calm.outV; return; } } }   // 합창 깨기(전설): 적의 고요한 원 안이면 밖으로 (그 안에선 내 마법이 서지 않는다)
       const g = CH.of(W, m); if (!g) return; const S = ST.get(W), p = S && S.push.get(g); if (!p || W.t > p.until || !(p.e.hp > 0)) return;
        const dx = p.e.x - g.lead.x, dy = p.e.y - g.lead.y, l = hyp(dx, dy) || 1; if (l <= p.R) return; K.vx = dx / l * P.push.v; K.vy = dy / l * P.push.v; },
      valueLate(W, m, K, o) {
        const s = o.s; if (!s.ring && !s.chorusOnly && !(o.v > 0)) return;
        const e = K.e, S = stOf(W);
        if (m.C >= P.see.C && e && o.v > 0 && isBind(s)) { const b = S.big.get(e); if ((b && e.cast === b.c) || (m.tac.chorusBreak && S.calms.some(c => c.lead === e))) o.v *= P.see.bind; }   // 짓는 앞소리꾼엔 묶는 수(굳히면 깨진다)
        if (s.ring && B.ringsOf(W, m) < s.ring) { o.v = 0; return; }   // 고리를 많이 먹는 마법은 쥘 고리가 있을 때만
        if (MATE.has(s.n)) { const g = leadOf(W, m); if (!g || !e || !(e.hp > 0)) return; if (K.d > C.rangeOf(m, s)) { o.v = 0; return; }   // 메이트: 빠져나갈 수 없을 때만 (v2.35)
          const p = mateHit(W, m, e, s, o, g); o.v = p >= CM.mateMin ? CM.mateV * p : 0; return; }
        if (!s.chorusOnly) return;
        const g = leadOf(W, m); if (!g || !e || !(e.hp > 0)) { o.v = 0; return; }
        const d = K.d, R = s.t === 'calm' ? P.calm.reach + s.r - P.calm.pad : C.rangeOf(m, s), strong = e.C >= P.calm.foeC * m.C;
        let v = 0, tx = e.x, ty = e.y;
        if (s.t === 'calm') { if (g.n >= P.calm.minN && strong && !S.calms.some(c => c.side === m.side && hyp(e.x - c.x, e.y - c.y) < c.r)) v = P.calm.v; }
        else if (s.t === 'area' && s.sky) { if (e.z >= P.net.z) v = P.net.v; }
        else if (s.t === 'limering') { if (e.z < P.lime.zMax && !W.walls.some(w => w.cage && w.own === m.side && hyp(w.x - e.x, w.y - e.y) < s.r + P.lime.near)) { v = P.lime.v * (strong ? 1 : 0.3); const k = C.rangeOf(m, s) > 0 ? s.cast : 0; tx = e.x + e.vx * k; ty = e.y + e.vy * k; } }
        else if (s.t === 'cloud') { if (strong && K.los && e.cast && g.ms.includes(e.cast.tgt) && !W.zones.some(z => z.k === 'smoke' && hyp(z.x - (m.x + e.x) / 2, z.y - (m.y + e.y) / 2) < z.r)) { v = P.cloud.v; tx = (m.x + e.x) / 2; ty = (m.y + e.y) / 2; } }   // 과녁이 우리를 겨눌 때 사이에 구름을 건다
        else if (s.t === 'granary') { if (W.rules.drain && strong && DR.around(W, e.x, e.y) > P.granary.min) v = P.granary.v; }
        else if (s.t === 'cshield') { for (const q of K.foes) if (q.hp > 0 && q.C >= m.C && q.cast && g.ms.includes(q.cast.tgt)) { v = P.shield.v; break; } tx = m.x; ty = m.y; }
        if (v > 0 && CHK.has(s.n)) { const Sx = stateOf(W, m, e); if (PL.slack(Sx, CM.within) === 0 && s.t !== 'calm') v *= CM.noSlack; }   // 응수가 바닥난 과녁엔 체크보다 메이트
        if (v > 0 && s.t !== 'cshield' && d > R) { if (s.t !== 'cloud') { const p = S.push.get(g); if (!p || W.t > p.until) S.push.set(g, { e, R: R - P.push.pad, until: W.t + P.push.T }); } v = 0; }   // 닿지 않으면 한 덩어리로 다가간다
        o.v = v; if (v > 0) { o.tx = tx; o.ty = ty; }
      },
      commit(W, m, K, best, cast) {
        const g = leadOf(W, m); if (!g) return; const s = best.s, n = g.n, S = stOf(W), pl = pool(XX, W, g), k = pl.out / outOf(XX, m);
        const E = cast.tk ? TU.energy(s, cast.tz, cast.tf, cast.tv) : 1, sig = TP.sig;
        if (k > 1) cast.T *= (sig + (1 - sig) * E / k) / (sig + (1 - sig) * E);   // 모은 출력으로 에너지 몫이 짧다
        if (n > 1 && cast.cost > 0) { m.glu += cast.cost * (n - 1) / n; for (const q of g.ms) if (q !== m && q.hp > 0) { q.glu -= cast.cost / n; if (q.glu < 0) q.glu = 0; } }   // 당도 나눠 낸다
        if (!bigOf(m, s, E)) return;
        cast.vis = (cast.vis > 1 ? cast.vis : 1) * C.pow(n, 1 / 3); cast.unseen = false;   // 드러남은 합친 것
        S.big.set(m, { c: cast, g, ms: g.ms.slice(), ring: s.ring || P.maxRing, E }); S.st.bigN++; S.st.by[s.n] = (S.st.by[s.n] || 0) + 1;
      },
    };
  },
};
