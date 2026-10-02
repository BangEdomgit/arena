'use strict';
/* 숨 결투장 — 싸움의 그림 지표 (v2.20.1, GATE-v4.md 0장·1장, SPEC 44장)
 * watch(metrics/watch.js)가 걸음마다 맨 끝에 부르고 seen이 합친다. 판에는 닿지 않는다(읽기만: 상태는 W._wf, 사람마다 Map).
 *   C7 메이트 (바꿈): 쓰러뜨린 한 방(쓰러지기 1.5 s 안에 나에게 풀린 적의 마지막 공격)이 알아채지 못한 수였거나(cast.unseen),
 *      온전히 받는 응수(막기·잔기술 빼고)가 0이고 막기·잔기술을 써도 남는 피해(× k)로 쓰러지는 수였다. 응수는 짓기 시작할 때와 풀 때 세어 작은 쪽(plan.ansSplit, v2.21: 굳은 동안은 몸 털기뿐)
 *   덫이 결정타면(v2.21) 못 본 덫이거나 몸을 못 쓰는 채(굳음·묶임·떨어짐) 밟았을 때 메이트, 보고 걸어 들어갔으면 견제
 *   B15 판을 끝낸 까닭: 시간 / 실수(소금·역류·폭주·내 피해·적의 굳힘 없는 추락) / 떨어뜨림(적이 떨어뜨린 추락) / 메이트 / 견제가 쌓여. 끝낸 수의 이름#손잡이
 *   B9 1 s 최대 손실 (바꿈): 그 1 s가 시작될 때 내 방어 여유(plan.slackOf)가 1 이상이던 창만, 메이트의 결정타가 든 걸음은 뺀다
 *   B7 침묵 (바꿈): 짓기(칸·뿜기)·숨·숨기(둘 사이 시야가 막힘)·자리 잡기(상대 쪽으로 3 m/s 넘게 다가가거나 멀어짐)도 행동
 *   B13 흐름: 판의 마지막 3분의 1에 잃은 체력 몫. B14 역전: 판 절반에서 체력 몫이 5%p 넘게 뒤진 쪽이 이겼나
 *   C12 하이 리스크: 큰 수(큰 한 방·손잡이 최대)를 짓다 끊기거나 역류한 몫
 *   D7 장악권: 풀린 공격 가운데 장악 몫이 반 아래였거나(흐려짐) 흩어진 몫. D8: 상대 자리의 장악 몫을 반 넘게 빼앗은 횟수
 *   E8 정보의 열매: 상대가 알아채지 못한 시전의 명중률 − 알아챈 시전의 명중률 (풀고 1.5 s 안에 그 마법의 명중이 늘었나) */
const C = require('../src/core'), PL = require('../src/brain/plan');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, SELF = { salt: 1, backfire: 1, wave: 1 };
const AD = { n: 0, g: false };
const newF = n => ({ hp: -1, tk: {}, fd: 0, ring: new Float64Array(n), ok: new Uint8Array(n), ri: 0, full: false, okNow: 1, burst: 0, lastC: null, lastCT: -9, pc: null, pb: null, info: new WeakMap(), bigs: [], bigN: 0, bigCut: 0,
  rel: [], uN: 0, uH: 0, sN: 0, sH: 0, relN: 0, weak: 0, fz: 0, fz0: -1, push0: false, pushN: 0, kill: '', killMove: '', kWhy: '', samp: [], lk: false });
const foeOf = (W, m) => { let e = null, bd = 1e9; for (const q of W.ms) { if (q.side === m.side || q.hp <= 0) continue; const d = C.hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } } return e; };
const foeDealt = (W, m) => { let x = 0; for (const q of W.ms) if (q.side !== m.side) for (const k in q.log.dealt) x += q.log.dealt[k]; return x; };
const guardK = W => { const R = C.RULES; if (W.rules.passives) { const r = R.find(x => x.name === 'passive'); return r.api.P.k; } const r = R.find(x => x.name === 'pace'); return r.api.P.guard.k; };
function step(W) {
  const A = W._wf || (W._wf = { by: new Map(), sil: 0, last: 0, samp: [], sampT: -9, n: 0, tp: [] });
  const n = Math.round(1 / W.dt);
  for (const m of W.ms) if (!A.by.has(m)) A.by.set(m, newF(n));
  // 판 전체: 체력 표본 (0.25 s마다), 침묵 (바꾼 정의)
  if (W.t - A.sampT >= 0.25) { A.sampT = W.t; const row = [W.t]; for (const m of W.ms) row.push(m.hp > 0 ? m.hp : 0); A.samp.push(row); }
  { let act = false; const live = W.ms.filter(q => q.hp > 0);
    for (const m of live) { if (m.cast || m.castB || m.chan || m.st.breath > 0) { act = true; break; } const e = foeOf(W, m); if (!e) continue; const dx = e.x - m.x, dy = e.y - m.y, d = C.hyp(dx, dy) || 1; if (Math.abs((m.vx * dx + m.vy * dy) / d) > 3) { act = true; break; } }
    if (!act && live.length === 2 && C.blocked(W, live[0].x, live[0].y, live[1].x, live[1].y, Math.max(live[0].z, live[1].z))) act = true;   // 숨기
    const g = W.t - A.last; if (act || W.ms.some(q => q.hp <= 0)) { if (g > 2) A.sil += g; A.last = W.t; } }
  const chk = W.step % (3 * W.sk) === 0, K = guardK(W);
  for (const m of W.ms) {
    const F = A.by.get(m), e = foeOf(W, m), hp = m.hp > 0 ? m.hp : 0;
    if (F.hp < 0) { F.hp = hp; F.fd = foeDealt(W, m); for (const k in m.log.taken) F.tk[k] = m.log.taken[k]; F.fz0 = m.log.fizz; for (let i = 0; i < n; i++) { F.ring[i] = hp; F.ok[i] = 1; } continue; }
    // 내 시전: 시작(응수·알아챔·큰 수), 풀림(E8·D7), 끊김(C12)
    for (let q = 0; q < 2; q++) {
      const c = q ? m.castB : m.cast, p = q ? F.pb : F.pc;
      if (c && c !== p && !c.auto && OFF[c.s.t] && e) { PL.ansSplit(W, e, m, c, AD); F.info.set(c, { n: AD.n, g: AD.g, un: !!c.unseen, mv: c.s.n + (c.tk ? '#' + c.tk : '') }); if (c.s.big || c.tf >= 4 || c.tz >= 2.5) { F.bigs.push(c); F.bigN++; } }
      if (p && p !== c && OFF[p.s.t] && !p.auto) {
        const rel = p.t >= p.T - W.dt * 1.5, bi = F.bigs.indexOf(p); if (bi >= 0) { if (!rel) F.bigCut++; F.bigs.splice(bi, 1); }
        if (rel) { F.relN++; if (C.gAt(W, m, p.s, p.tx, p.ty) < 0.5) F.weak++; F.rel.push({ n: p.s.n, h0: m.log.hits[p.s.n] || 0, due: W.t + 1.5, un: !!p.unseen });
          const tg = p.tgt; if (tg && tg.side !== m.side) { const T = A.by.get(tg), I = F.info.get(p); if (I && tg.hp > 0) { PL.ansSplit(W, tg, m, p, AD); if (AD.n < I.n) I.n = AD.n; if (!AD.g) I.g = false; } if (T) { T.lastC = I || null; T.lastCT = W.t; } } }   // 풀 때 다시 센다(v2.21: 짓는 동안 굳었으면 응수가 사라진다)
      }
      if (q) F.pb = c; else F.pc = c;
    }
    while (F.rel.length && F.rel[0].due <= W.t) { const r = F.rel.shift(), h = (m.log.hits[r.n] || 0) > r.h0 ? 1 : 0; if (r.un) { F.uN++; F.uH += h; } else { F.sN++; F.sH += h; } }
    F.fz = m.log.fizz - F.fz0;
    // 장악권 밀어냄 (0.1 s마다): 상대 자리에서 내 몫이 반을 넘은 횟수
    if (chk && e && m.hp > 0) { const f = C.share(W, m, e.x, e.y); if (f >= 0.5 && !F.push0) F.pushN++; F.push0 = f >= 0.5; F.okNow = PL.slackOf(W, m, e) >= 1 ? 1 : 0; }
    // 받은 피해: 이 걸음의 종류별 증가, 쓰러짐의 까닭
    let tot = 0, bk = '', bv = 0; const tk = m.log.taken; for (const k in tk) { const d = tk[k] - (F.tk[k] || 0); if (d > 0) { tot += d; if (d > bv) { bv = d; bk = k; } } }
    const fd = foeDealt(W, m), foe = fd - F.fd; let mateStep = false;
    if (F.hp > 0 && hp <= 0) {
      let tp = null; for (const t of A.tp) if (t.done && t.src.side !== m.side && C.hyp(t.x - m.x, t.y - m.y) < (t.r || 1) + 0.6) { tp = t; break; }
      const wa = W._wt && W._wt.by.get(m), fallBy = !!(wa && wa.fallBy), lc = W.t - F.lastCT <= 1.5 ? F.lastC : null;
      F.kWhy = bk + (foe < tot * 0.5 ? '·내 것' : '');
      if (bk === 'fall') F.kill = fallBy ? '떨어뜨림' : '실수';
      else if (SELF[bk] || foe < tot * 0.5) F.kill = '실수';
      else if (tp) { F.kill = !tp.seen.has(m.id) || F.lk ? '메이트' : '견제가 쌓여'; mateStep = F.kill === '메이트'; }   // 덫 (v2.21): 못 본 덫이거나 몸을 못 쓰는 채 밟았으면 메이트, 보고 걸어 들어갔으면 견제
      else if (lc && (lc.un || (lc.n === 0 && (!lc.g || tot * K >= F.hp)))) { F.kill = '메이트'; mateStep = true; }
      else F.kill = '견제가 쌓여';
      F.killMove = tp ? tp.s.n : lc ? lc.mv : '';
    }
    // 1 s 최대 손실 (바꾼 정의): 창이 시작될 때 응수가 남아 있었던 것만, 메이트의 결정타 걸음은 뺀다
    if (!mateStep) { const i0 = F.ri; if (F.ok[i0] && F.ring[i0] - hp > F.burst) F.burst = F.ring[i0] - hp; }
    F.ring[F.ri] = hp; F.ok[F.ri] = F.okNow; F.ri = (F.ri + 1) % n;
    F.hp = hp; F.fd = fd; for (const k in tk) F.tk[k] = tk[k]; F.lk = m.st.stun > 0 || m.st.root > 0 || m.fly === 2;
  }
  A.tp = W.traps.slice();   // 다음 걸음에 터진 덫을 찾는다 (터진 덫은 그 걸음에 빠진다)
}
// 판 절반·마지막 3분의 1 (체력 표본에서)
function at(A, t) { let r = A.samp[0]; for (const x of A.samp) { if (x[0] > t) break; r = x; } return r; }
function seen(W, m) {
  const A = W._wf; if (!A) return {}; const F = A.by.get(m); if (!F) return {};
  const T = W.t, last = A.samp[A.samp.length - 1], first = A.samp[0], i = W.ms.indexOf(m) + 1;
  const sum = r => { let x = 0; for (let k = 1; k < r.length; k++) x += r[k]; return x; };
  const loss = sum(first) - sum(last), late = sum(at(A, T * 2 / 3)) - sum(last);
  // 판 절반에 뒤진 편이 이겼나 (편의 체력 몫)
  const half = at(A, T / 2), side = q => { let h = 0, mx = 0; W.ms.forEach((x, k) => { if (x.side === q) { h += half[k + 1]; mx += x.hpMax; } }); return mx ? h / mx : 0; };
  const sides = [...new Set(W.ms.map(x => x.side))], r = C.result ? C.result(W) : null;
  let behind = -1; if (sides.length === 2) { const a = side(sides[0]), b = side(sides[1]); if (Math.abs(a - b) > 0.05) behind = a < b ? sides[0] : sides[1]; }
  const done = W.ms.some(q => q.hp <= 0), cause = W.ms.find(q => q.hp <= 0);
  const kc = cause ? A.by.get(cause) : null;
  return {
    '2 s 넘는 침묵 몫 (4판)': T ? (A.sil + (W.t - A.last > 2 ? W.t - A.last : 0)) / T : 0, '1 s에 잃은 가장 큰 체력 몫 (4판)': F.burst / m.hpMax,
    '쓰러진 까닭': m.hp <= 0 ? F.kill : '', '쓰러진 피해 종류': m.hp <= 0 ? F.kWhy : '', '판을 끝낸 까닭': !done ? '시간' : kc ? kc.kill : '', '판을 끝낸 수': kc ? kc.killMove : '',
    '메이트로 끝난 판 (4판)': kc && kc.kill === '메이트' ? 1 : 0, '흐름: 마지막 3분의 1에 잃은 몫': loss > 0 ? late / loss : 0,
    '판 절반에 뒤진 편이 있던 판': behind >= 0 && r && r.winner >= 0 ? 1 : 0, '역전한 판': behind >= 0 && r && r.winner >= 0 && r.winner === behind ? 1 : 0,
    '큰 수를 지은 수': F.bigN, '큰 수가 끊긴 수': F.bigCut,
    '풀린 공격': F.relN, '장악권에 흐려진 공격': F.weak, '흩어진 공격': F.fz, '장악권을 밀어낸 수': F.pushN,
    '알아채지 못한 시전': F.uN, '알아채지 못한 시전 명중': F.uH, '알아챈 시전': F.sN, '알아챈 시전 명중': F.sH,
  };
}
module.exports = { step, seen };
