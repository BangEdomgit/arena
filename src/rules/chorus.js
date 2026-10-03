'use strict';
/* 규칙: 합창 (rules.chorus, v2.27, SPEC 50장, 수는 data/rules/chorus.json) — 기본 꺼짐
 * 박자를 맞춘 무리는 한 사람처럼 선명하다. tac.squad(전투단)나 tac.chorus가 있는 사람만, 고리 하나를 박자 맞추기에 쥔다(두뇌 훅 circles: 서클 − 1).
 *   함께 맞출 수 있는 수는 단계마다 limit(상위 6, 중간 3, 평범은 못 함). 서로 R m 안에 sync s 머물러야 맞춰진다.
 *   맞춰지면: 모두의 선명도 × √N(엔진 훅 ceff: 장악권을 밀어내 그 안에 마법을 세운다), 앞소리꾼(가장 선명한, 같으면 먼저 온 사람)의 위력 × √N^powK(함께 짓는 큰 마법),
 *     그 지연 폭발·곡사의 반지름 × √N(엔진 훅 tune: 넓힌 사본으로 바꾼다). 장악권은 한 목소리: 어느 자리든 앞소리꾼의 몫은 합창하는 모두의 신호의 합(엔진 훅 share).
 *     v2.36: 한 목소리(선명도 × √N, 합친 신호)는 함께 부르는 것에만 — 앞소리꾼의 수(합창이 함께 쥐는 마법 포함). 합창원이 제 손으로 쏘는 수는 제 선명도·제 신호로 다툰다(고요한 원 안은 예외, rules/chorusCast)
 *   나머지는 박자를 지킨다: 공격 값 × hold(묶는 수는 그대로, 두뇌 훅 valueLate)
 *   깨짐: 한 명이 쓰러지거나 굳거나 R m 밖으로 나가면 깨지고, 그 사람들은 cd s 동안 다시 못 맞춘다. 모여 있으니 넓은 마법에 약하다(따로 셈하지 않는다: 그대로 맞는다)
 * 지표 (v2.33): 깬 합창(brokeHit: 한 명이 쓰러지거나 굳어 깨진 것), 선명도 bigC 이상이 합창하는 사람에게 쏜 수(atN)·그중 넓은 마법(wideN)·앞소리꾼을 노린 것(leadN)
 * 사람에 칸을 더하지 않는다: 상태는 세계마다 WeakMap. api: of(W, m) → 합창 { n, lead, t0, on } 또는 null, stats(W) */
const P = require('../../data/rules/chorus.json');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, WIDE = { area: 1, lob: 1, cone: 1 };
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const ST = new WeakMap(), BIG = new WeakMap();   // 마법 → [N마다 넓힌 사본] (앞소리꾼의 큰 마법)
const bigOf = (s, n) => { let a = BIG.get(s); if (!a) BIG.set(s, a = []); return a[n] || (a[n] = Object.assign({}, s, { r: s.r * Math.sqrt(n) })); };
function stOf(W) { let s = ST.get(W); if (!s) ST.set(W, s = { of: new Map(), cd: new Map(), groups: [], st: { formed: 0, broke: 0, onT: 0, leadCasts: 0, leadDmg: 0, maxN: 0, good: 0, brokeHit: 0, atN: 0, wideN: 0, leadN: 0 } }); return s; }
const limitOf = m => { for (const [c, n] of P.limit) if (m.C >= c) return n; return 0; };
const able = (W, m, S) => m.hp > 0 && !m.flee && (m.tac.squad || m.tac.chorus) && limitOf(m) > 1 && !(m.st.stun > 0) && !((S.cd.get(m) || -9) > W.t);
function update(X, W) {
  const S = stOf(W), old = S.groups, used = new Set(), now = [];
  // 지난 합창을 먼저 이어 본다: 모두 서 있고 서로 R 안이면 그대로(깨지면 cd)
  for (const g of old) {
    let ok = true; for (const m of g.ms) if (!able(W, m, S) && !(m.st.stun > 0 && false)) { ok = false; break; }
    if (ok) for (let i = 0; i < g.ms.length && ok; i++) for (let j = i + 1; j < g.ms.length; j++) if (X.hyp(g.ms[i].x - g.ms[j].x, g.ms[i].y - g.ms[j].y) > (P.keepR || P.R)) { ok = false; break; }   // 이어 가는 거리 (v2.32): 맞출 땐 R, 이어 갈 땐 keepR
    if (!ok) { if (g.on) { S.st.broke++; for (const m of g.ms) if (m.hp <= 0 || m.st.stun > 0) { S.st.brokeHit++; break; } } for (const m of g.ms) { S.of.delete(m); if (m.hp > 0) S.cd.set(m, W.t + P.cd); } continue; }   // 깬 합창 (v2.33): 한 명이 쓰러지거나 굳어서
    for (const m of g.ms) used.add(m); now.push(g);
  }
  // 끼어들기 (v2.32, join): 이어 가는 합창에 곁(모두에게서 R 안)의 같은 편이 한계까지 들어온다. 들어오면 박자를 다시 맞춘다(sync)
  if (P.join) for (const g of now) { let lim = limitOf(g.ms[0]); for (const q of g.ms) { const l = limitOf(q); if (l < lim) lim = l; } if (g.ms.length >= lim) continue;
    for (const q of W.ms) { if (g.ms.length >= lim) break; if (used.has(q) || q.side !== g.ms[0].side || !able(W, q, S) || limitOf(q) < g.ms.length + 1) continue;
      let near = true; for (const r of g.ms) if (X.hyp(r.x - q.x, r.y - q.y) > P.R) { near = false; break; } if (!near) continue;
      g.ms.push(q); used.add(q); g.n = g.ms.length; if (q.C > g.lead.C) g.lead = q; if (g.on) { g.on = false; g.t0 = W.t; } } }
  // 새로 모인다: 같은 편, 아직 합창하지 않는 사람끼리, 먼저 온 사람 둘레 R 안, 단계의 한계까지
  for (const m of W.ms) {
    if (used.has(m) || !able(W, m, S)) continue;
    const ms = [m]; let lim = limitOf(m);
    for (const q of W.ms) { if (ms.length >= lim) break; if (q === m || used.has(q) || q.side !== m.side || !able(W, q, S)) continue;
      let near = true; for (const r of ms) if (X.hyp(r.x - q.x, r.y - q.y) > P.R) { near = false; break; } if (!near) continue;
      const l2 = limitOf(q); if (l2 < lim) { if (ms.length >= l2) continue; lim = l2; } ms.push(q); }
    if (ms.length < 2) continue;
    let lead = ms[0]; for (const q of ms) if (q.C > lead.C) lead = q;
    const g = { ms, n: ms.length, lead, t0: W.t, on: false, onT: 0, good: false }; for (const q of ms) used.add(q); now.push(g);
  }
  // 붙어 있던 무리에 사람이 더해지거나 빠지면 다시 맞춘다 (위에서 새 무리가 된다)
  S.of.clear(); for (const g of now) { if (!g.on && W.t - g.t0 >= P.sync) { g.on = true; g.onT = W.t; S.st.formed++; } if (g.on && !g.good && g.n >= P.goodN && W.t - g.onT > P.goodT) { g.good = true; S.st.good++; } if (g.n > S.st.maxN && g.on) S.st.maxN = g.n; for (const m of g.ms) S.of.set(m, g); if (g.on) S.st.onT += P.every * g.n; }   // 오래 선 합창 (v2.29 지표: goodN 넘게 goodT s 넘게)
  S.groups = now;
}
const of = (W, m) => { const S = ST.get(W); if (!S) return null; const g = S.of.get(m); return g && g.on ? g : null; };
const forming = (W, m) => { const S = ST.get(W); if (!S) return false; const g = S.of.get(m); return !!g && !g.on; };   // 맞추는 중 (v2.30.1, 점검이 읽는다)
module.exports = {
  name: 'chorus', switch: 'chorus', api: { P, of, forming, limitOf, stats: W => stOf(W).st, group: (W, m) => { const S = ST.get(W); return S ? S.of.get(m) || null : null; }, groups: W => { const S = ST.get(W); return S ? S.groups : []; } },   // group: 맞추는 중이어도 (v2.34, rules/chorusCast)
  engine: X => ({
    world(W) { if (W.step % Math.round(P.every / W.dt) === 0) update(X, W); },
    tune(W, m, c) { const g = of(W, m); if (g && g.lead === m && (c.s.t === 'area' || c.s.t === 'lob') && c.s.r > 0) c.s = bigOf(c.s, g.n); },   // 함께 짓는 큰 마법: 넓이 × √N
    // 한 목소리: 자리 (x, y)의 내 몫을 합창하는 모두의 신호의 합으로 (적의 몫은 그대로)
    share(W, m, x, y, f) {
      const g = of(W, m); if (!g || g.lead !== m || !(f > 0) || f >= 1) return f;   // 함께 짓는 것(앞소리꾼의 수)에만 (v2.36): 합창원이 제 손으로 쏘는 수는 제 신호로 다툰다
      const L = W.rules.domainL, m0 = X.sigOf(W, m) / (1 + X.hyp(x - m.x, y - m.y) / L), other = m0 * (1 - f) / f; let mine = 0;
      for (const q of g.ms) mine += X.sigOf(W, q) / (1 + X.hyp(x - q.x, y - q.y) / L);
      return mine / (mine + other);
    },
    ceff(W, m, x) { const g = of(W, m); return g && g.lead === m ? x * Math.sqrt(g.n) : x; },   // 합창의 선명도도 앞소리꾼에만 (v2.36)
    power(W, m, s, x) { const g = of(W, m); return g && g.lead === m ? x * X.pow(Math.sqrt(g.n), P.powK) : x; },
    release(W, m, c) { const g = of(W, m); if (g && g.lead === m && OFF[c.s.t]) stOf(W).st.leadCasts++;
      if (m.C >= P.bigC && OFF[c.s.t] && c.tgt) { const h = of(W, c.tgt); if (h) { const st = stOf(W).st; st.atN++; if (WIDE[c.s.t]) st.wideN++; if (c.tgt === h.lead) st.leadN++; } } },   // 큰 사람이 합창에 쏜 것 (v2.33 지표): 넓은 마법의 몫, 앞소리꾼을 노린 몫
    hurt(W, m, v, src) { if (src) { const g = of(W, src); if (g && g.lead === src && m.side !== src.side) stOf(W).st.leadDmg += v; } },
  }),
  brain: B => ({
    circles(W, q, c) { const S = ST.get(W); return S && S.of.has(q) ? Math.max(1, c - 1) : c; },   // 박자 맞추기에 고리 하나
    // 합창 깨기 (v2.33, 판단 수준의 tac.chorusBreak: 전설): 선 합창의 앞소리꾼을 노린다(크게 짓는 중이면 먼저, 큰 합창 먼저). 거기엔 묶는 수(굳히면 깨진다)·넓은 마법을 더 친다
    aim(W, m, K) { if (!m.tac.chorusBreak || m.C < P.bigC || m.flee) return; const S = ST.get(W); if (!S) return; const R = P.brk;
      let e = null, bs = 1e9; for (const g of S.groups) { const q = g.lead; if (q.side === m.side || !(q.hp > 0) || q.flee) continue; const d = B.hyp(q.x - m.x, q.y - m.y); if (d > R.R) continue;
        const sc = d - g.n * R.nW - (g.on ? (q.cast ? R.castB : 0) : R.formB); if (sc < bs) { bs = sc; e = q; } }   // 맞추는 중인 무리(아직 한 목소리가 아니다)를 먼저: 모여 있고 아직 세지 않다
      if (e) K.e = e; },
    valueLate(W, m, K, o) { if (!(o.v > 0) || !OFF[o.s.t]) return; const g = of(W, m); if (g && g.lead !== m && !isBind(o.s)) o.v *= P.hold;
      if (m.tac.chorusBreak && K.e && m.C >= P.bigC) { const S = ST.get(W), h = S && S.of.get(K.e); if (!h) return; o.v *= isBind(o.s) ? P.brk.bind * (K.e.cast ? P.brk.castK : 1) : WIDE[o.s.t] ? P.brk.wide : 1;
        if ((o.s.t === 'area' || o.s.t === 'lob') && o.s.r > 0) { let x = 0, y = 0, n = 0; for (const q of h.ms) if (q.hp > 0) { x += q.x; y += q.y; n++; } if (n) { o.tx = x / n; o.ty = y / n; } } } },   // 넓은 마법은 합창의 가운데로 (몇이 함께 맞고, 피하면 박자가 깨진다)
  }),
};
