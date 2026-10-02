'use strict';
/* 규칙: 마름 (rules.drain, v2.28, SPEC 52장, 수는 data/rules/drain.json) — 기본 꺼짐
 * 대마법사가 전력으로 쓸 때만 둘레가 지친다(WORLD 3장 "마름은 꼭대기에서만"·한계 "대마법사급의 국지적 마름").
 *   땅은 cell m 칸, 칸마다 곳간 stock. 마법을 풀 때 서는 자리(formPoint)의 칸과 둘레 reach 칸에서 에너지 = 비용(손잡이가 박힌 마법의 cost) × 선명도^powerK × k를 꺼낸다.
 *   모자라면 그 시전의 위력 × 꺼낸 몫(엔진 훅 release가 정하고 power가 곱한다). 칸마다 초당 regen씩 다시 찬다(햇빛).
 *   몸의 마법도 곳간에서: 마른 땅(둘레 몫 d = 1 − 곳간)에 선 대마법사는 빠른 판의 떡대가 그만큼 벗겨진다(엔진 훅 hurtMod: 받는 피해 × (1 + (1/bulk − 1) d))
 *   평범·중간의 마법은 에너지가 대마법사의 1/30~1/300이라 곳간이 거의 줄지 않는다
 * 두뇌: 대마법사(선명도 5 이상)는 제 둘레 곳간이 move 몫 아래면 가장 찬 칸 쪽으로 옮긴다(걸음에 더한다).
 *   무리(선명도 5 아래, 적에 선명도 5 이상이 있을 때)는 그 적 lureR m 안에서 곳간이 lure 몫 아래인 칸으로 간다: 대마법사가 그 자리에 세우는 마법이 약하다
 * 상태는 세계마다 WeakMap(칸 배열), api: at(W, x, y) → 곳간 몫(0~1), stats(W) */
const P = require('../../data/rules/drain.json'), PC = require('../../data/rules/pace.json');
const ST = new WeakMap(), PEND = new WeakMap();
function gridOf(W) {
  let g = ST.get(W); if (g) return g;
  const nx = Math.max(1, Math.ceil(W.width / P.cell)), ny = Math.max(1, Math.ceil(W.height / P.cell)), a = new Float64Array(nx * ny).fill(P.stock);
  ST.set(W, g = { nx, ny, a, t: 0, drawn: 0, short: 0, casts: 0 }); return g;
}
const idx = (g, x, y) => { let i = Math.floor(x / P.cell), j = Math.floor(y / P.cell); if (i < 0) i = 0; if (i >= g.nx) i = g.nx - 1; if (j < 0) j = 0; if (j >= g.ny) j = g.ny - 1; return j * g.nx + i; };
const at = (W, x, y) => { const g = gridOf(W); return g.a[idx(g, x, y)] / P.stock; };
// (x, y) 둘레 칸들의 평균 몫
function around(W, x, y) { const g = gridOf(W), i0 = Math.floor(x / P.cell), j0 = Math.floor(y / P.cell); let s = 0, n = 0;
  for (let j = j0 - P.reach; j <= j0 + P.reach; j++) for (let i = i0 - P.reach; i <= i0 + P.reach; i++) { if (i < 0 || j < 0 || i >= g.nx || j >= g.ny) continue; s += g.a[j * g.nx + i]; n++; } return n ? s / n / P.stock : 1; }
module.exports = {
  name: 'drain', switch: 'drain', api: { P, at, around, stats: W => gridOf(W) },
  engine: X => ({
    world(W) { const g = gridOf(W), r = P.regen * W.dt, a = g.a; for (let i = 0; i < a.length; i++) if (a[i] < P.stock) a[i] = a[i] + r > P.stock ? P.stock : a[i] + r; },
    release(W, m, c) {
      const s = c.s; if (s.mundane || !(s.cost > 0)) return;
      const g = gridOf(W), p = X.formPoint(m, s, c.tx, c.ty) || [m.x, m.y], need = s.cost * X.pow(m.C > 1 ? m.C : 1, W.rules.powerK) * P.k;
      const i0 = Math.floor(p[0] / P.cell), j0 = Math.floor(p[1] / P.cell); let have = 0;
      for (let j = j0 - P.reach; j <= j0 + P.reach; j++) for (let i = i0 - P.reach; i <= i0 + P.reach; i++) if (i >= 0 && j >= 0 && i < g.nx && j < g.ny) have += g.a[j * g.nx + i];
      const take = need < have ? need : have, f = have > 0 ? take / have : 0;
      for (let j = j0 - P.reach; j <= j0 + P.reach; j++) for (let i = i0 - P.reach; i <= i0 + P.reach; i++) if (i >= 0 && j >= 0 && i < g.nx && j < g.ny) g.a[j * g.nx + i] *= 1 - f;   // 칸마다 같은 몫씩
      g.drawn += take; g.casts++; const k = need > 0 ? take / need : 1; if (k < 1) g.short++;
      let q = PEND.get(m); if (!q) PEND.set(m, q = { step: -1, s: null, k: 1 }); q.step = W.step; q.s = s; q.k = k;
    },
    // 마른 땅의 대마법사는 몸의 마법(빠른 판의 떡대)도 둘레 곳간에서 꺼낸다: 마른 만큼 떡대가 벗겨진다
    hurtMod(W, m, v, kind, name, src) { if (!src || src.side === m.side || m.C < PC.cMin || !W.rules.pace) return v; const d = 1 - around(W, m.x, m.y); return d > 0 ? v * (1 + (1 / PC.bulk - 1) * d) : v; },
    power(W, m, s, x) { const q = PEND.get(m); return q && q.step === W.step && q.s === s ? x * q.k : x; },
  }),
  brain: B => ({
    steer(W, m, K) {
      if (K.dodge) return;
      if (m.C >= 5) {   // 대마법사: 마른 곳을 떠난다
        if (around(W, m.x, m.y) >= P.move) return; let bx = 0, by = 0, bv = -1;
        for (let k = 0; k < 8; k++) { const a = k * 0.7854, x = m.x + B.C.cos(a) * 25, y = m.y + B.C.sin(a) * 25; if (x < 2 || y < 2 || x > W.width - 2 || y > W.height - 2) continue; const v = around(W, x, y); if (v > bv) { bv = v; bx = x; by = y; } }
        if (bv > 0) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx += dx / l * 1.5; K.vy += dy / l * 1.5; } return;
      }
      const e = K.e; if (!e || e.C < 5) return;   // 무리: 대마법사 둘레의 마른 칸에 선다
      if (at(W, m.x, m.y) < P.lure && B.hyp(e.x - m.x, e.y - m.y) < P.lureR) return;
      let bx = 0, by = 0, bv = 2;
      for (let k = 0; k < 8; k++) { const a = k * 0.7854, x = m.x + B.C.cos(a) * P.cell, y = m.y + B.C.sin(a) * P.cell; if (B.hyp(e.x - x, e.y - y) > P.lureR) continue; const v = at(W, x, y); if (v < bv) { bv = v; bx = x; by = y; } }
      if (bv < P.lure) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx += dx / l; K.vy += dy / l; }
    },
  }),
};
