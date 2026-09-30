'use strict';
/* 규칙: 지렛대 — 화약통 (rules.barrels, 또는 장면이 화약통을 놓으면, SPEC 11장)
 * 불·전기가 닿으면 터져 2.8 m 안에 35(가장자리 절반)와 화상. 두뇌: 적이 통 옆에 서면 통을 친다(lever), 통 3.2 m 안에는 가지 않는다 */
module.exports = {
  name: 'barrels', on: (W, opt) => W.rules.barrels || Array.isArray(opt && opt.barrels),
  engine: X => {
    const { hyp, atan2, hurt } = X;
    function ignite(W, x, y, r, src) {
      for (const b of W.barrels) {
        if (b.ex || hyp(b.x - x, b.y - y) > r + 0.6) continue;
        b.ex = true;
        for (const q of W.ms) { if (q.hp <= 0) continue; const d = hyp(q.x - b.x, q.y - b.y); if (d < 2.8) { hurt(W, q, 35 * (1 - d / 2.8 * 0.5), q === src ? null : src, '화약통', 'fire'); q.st.burn = Math.max(q.st.burn || 0, 2); } }
        if (W.rec) W.fx.push(['b', b.x, b.y, 2.8]); if (src) src.log.barrel++;
        if (src && W.t - (src.lureT ?? -9) < 3 && W.ms.some(q => q.side !== src.side && hyp(q.x - b.x, q.y - b.y) < 2.8)) src.log.lure++;
      }
    }
    return {
      // 세계를 만들 때: 장면이 준 통, 아니면 규칙이 켜졌을 때 씨앗을 따라 다섯
      place(W, opt) {
        if (Array.isArray(opt.barrels)) W.barrels = opt.barrels.map(b => ({ x: b.x, y: b.y, ex: false }));
        else if (W.rules.barrels) for (const [bx, by] of [[0.3, 0.27], [0.7, 0.73], [0.5, 0.5], [0.35, 0.8], [0.65, 0.23]])
          W.barrels.push({ x: bx * W.width + W.rnd(-2, 2), y: by * W.height + W.rnd(-2, 2), ex: false });
      },
      ignite,
      // 불을 뿜는 동안 앞의 통
      chan(W, m, ch) { const s = ch.s; if (s.kind === 'fire') for (const b of W.barrels) if (!b.ex) { const d = hyp(b.x - m.x, b.y - m.y), ang = Math.abs(((atan2(b.y - m.y, b.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < ch.L && ang < 0.45) ignite(W, b.x, b.y, 0.1, m); } },
      // 불 터지는 투사체가 통에 닿았다
      projSub(W, p) { if (p.s.burst && p.s.burst.kind === 'fire') for (const b of W.barrels) if (!b.ex && hyp(b.x - p.x, b.y - p.y) < 0.5) { p.dead = true; X.burst(W, p); break; } },
    };
  },
  brain: B => {
    const { C, hyp } = B;
    return {
      // 통 3.2 m 안에는 가지 않는다
      avoid(W, m, K) { for (const b of W.barrels) if (!b.ex && hyp(b.x - m.x, b.y - m.y) < 3.2) { const l = hyp(m.x - b.x, m.y - b.y) || 1; K.vx += (m.x - b.x) / l * 1.2; K.vy += (m.y - b.y) / l * 1.2; } },
      // 지렛대 (tac.lever): 적이 화약통 옆에 섰으면 불·전기로 통을 친다
      valueMid(W, m, K, o) {
        const s = o.s;
        if (!(K.T.lever && W.barrels.length && (s.t === 'area' || s.t === 'thread' || (s.t === 'zone' && s.z.k === 'fire')) && (s.t === 'thread' || s.kind === 'fire' || s.kind === 'elec' || s.t === 'zone'))) return;
        for (const b of W.barrels) {
          if (b.ex) continue; const db = hyp(b.x - m.x, b.y - m.y); if (db > (o.R || 12) || db < 3.3) continue;
          if (s.t === 'thread' && C.blocked(W, m.x, m.y, b.x, b.y)) continue;
          let nE = 0; for (const q of K.foes) if (hyp(q.x - b.x, q.y - b.y) < 2.6) nE++; if (!nE) continue;
          const vb = 35 * nE * 0.8 / (o.Tw + (s.delay || 0) * 0.5 + 0.3); if (vb > o.v) { o.v = vb; o.tx = b.x; o.ty = b.y; o.barrel = true; }
        }
      },
    };
  },
};
