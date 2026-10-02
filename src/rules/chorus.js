'use strict';
/* 규칙: 합창 (rules.chorus, v2.27, SPEC 50장, 수는 data/rules/chorus.json) — 기본 꺼짐
 * 박자를 맞춘 무리는 한 사람처럼 선명하다. tac.squad(전투단)나 tac.chorus가 있는 사람만, 고리 하나를 박자 맞추기에 쥔다(두뇌 훅 circles: 서클 − 1).
 *   함께 맞출 수 있는 수는 단계마다 limit(상위 6, 중간 3, 평범은 못 함). 서로 R m 안에 sync s 머물러야 맞춰진다.
 *   맞춰지면: 모두의 선명도 × √N(엔진 훅 ceff: 장악권을 밀어내 그 안에 마법을 세운다), 앞소리꾼(가장 선명한, 같으면 먼저 온 사람)의 위력 × √N^powK(함께 짓는 큰 마법),
 *     그 지연 폭발·곡사의 반지름 × √N(엔진 훅 tune: 넓힌 사본으로 바꾼다). 장악권은 한 목소리: 어느 자리든 내 몫은 합창하는 모두의 신호의 합(엔진 훅 share).
 *   나머지는 박자를 지킨다: 공격 값 × hold(묶는 수는 그대로, 두뇌 훅 valueLate)
 *   깨짐: 한 명이 쓰러지거나 굳거나 R m 밖으로 나가면 깨지고, 그 사람들은 cd s 동안 다시 못 맞춘다. 모여 있으니 넓은 마법에 약하다(따로 셈하지 않는다: 그대로 맞는다)
 * 사람에 칸을 더하지 않는다: 상태는 세계마다 WeakMap. api: of(W, m) → 합창 { n, lead, t0, on } 또는 null, stats(W) */
const P = require('../../data/rules/chorus.json');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const ST = new WeakMap(), BIG = new WeakMap();   // 마법 → [N마다 넓힌 사본] (앞소리꾼의 큰 마법)
const bigOf = (s, n) => { let a = BIG.get(s); if (!a) BIG.set(s, a = []); return a[n] || (a[n] = Object.assign({}, s, { r: s.r * Math.sqrt(n) })); };
function stOf(W) { let s = ST.get(W); if (!s) ST.set(W, s = { of: new Map(), cd: new Map(), groups: [], st: { formed: 0, broke: 0, onT: 0, leadCasts: 0, leadDmg: 0, maxN: 0, good: 0 } }); return s; }
const limitOf = m => { for (const [c, n] of P.limit) if (m.C >= c) return n; return 0; };
const able = (W, m, S) => m.hp > 0 && !m.flee && (m.tac.squad || m.tac.chorus) && limitOf(m) > 1 && !(m.st.stun > 0) && !((S.cd.get(m) || -9) > W.t);
function update(X, W) {
  const S = stOf(W), old = S.groups, used = new Set(), now = [];
  // 지난 합창을 먼저 이어 본다: 모두 서 있고 서로 R 안이면 그대로(깨지면 cd)
  for (const g of old) {
    let ok = true; for (const m of g.ms) if (!able(W, m, S) && !(m.st.stun > 0 && false)) { ok = false; break; }
    if (ok) for (let i = 0; i < g.ms.length && ok; i++) for (let j = i + 1; j < g.ms.length; j++) if (X.hyp(g.ms[i].x - g.ms[j].x, g.ms[i].y - g.ms[j].y) > P.R) { ok = false; break; }
    if (!ok) { if (g.on) S.st.broke++; for (const m of g.ms) { S.of.delete(m); if (m.hp > 0) S.cd.set(m, W.t + P.cd); } continue; }
    for (const m of g.ms) used.add(m); now.push(g);
  }
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
module.exports = {
  name: 'chorus', switch: 'chorus', api: { P, of, limitOf, stats: W => stOf(W).st },
  engine: X => ({
    world(W) { if (W.step % Math.round(P.every / W.dt) === 0) update(X, W); },
    tune(W, m, c) { const g = of(W, m); if (g && g.lead === m && (c.s.t === 'area' || c.s.t === 'lob') && c.s.r > 0) c.s = bigOf(c.s, g.n); },   // 함께 짓는 큰 마법: 넓이 × √N
    // 한 목소리: 자리 (x, y)의 내 몫을 합창하는 모두의 신호의 합으로 (적의 몫은 그대로)
    share(W, m, x, y, f) {
      const g = of(W, m); if (!g || !(f > 0) || f >= 1) return f;
      const L = W.rules.domainL, m0 = X.sigOf(W, m) / (1 + X.hyp(x - m.x, y - m.y) / L), other = m0 * (1 - f) / f; let mine = 0;
      for (const q of g.ms) mine += X.sigOf(W, q) / (1 + X.hyp(x - q.x, y - q.y) / L);
      return mine / (mine + other);
    },
    ceff(W, m, x) { const g = of(W, m); return g ? x * Math.sqrt(g.n) : x; },
    power(W, m, s, x) { const g = of(W, m); return g && g.lead === m ? x * X.pow(Math.sqrt(g.n), P.powK) : x; },
    release(W, m, c) { const g = of(W, m); if (g && g.lead === m && OFF[c.s.t]) stOf(W).st.leadCasts++; },
    hurt(W, m, v, src) { if (src) { const g = of(W, src); if (g && g.lead === src && m.side !== src.side) stOf(W).st.leadDmg += v; } },
  }),
  brain: () => ({
    circles(W, q, c) { const S = ST.get(W); return S && S.of.has(q) ? Math.max(1, c - 1) : c; },   // 박자 맞추기에 고리 하나
    valueLate(W, m, K, o) { if (!(o.v > 0) || !OFF[o.s.t]) return; const g = of(W, m); if (g && g.lead !== m && !isBind(o.s)) o.v *= P.hold; },
  }),
};
