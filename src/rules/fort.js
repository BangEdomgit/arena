'use strict';
/* 규칙: 진지 (rules.fort, v2.3, SPEC 27장, 수는 data/rules/fort.json) — 싸움터에 쌓는다
 * 흙벽·석회 기둥과 구덩이는 벽 규칙(rules/bulwark)대로 무너질 때까지 남는다. 이어 세우면 방벽선이다.
 * 함정 한도: 한 사람 셋 → 서클 수만큼(trapK × 서클, 적어도 셋: 상위 5, 대마법사 10~11). 함정은 벽처럼 판 끝까지 남는다(밟히거나 치워질 때까지)
 * 옆 함정 연쇄 (rules.trapChain): 함정 하나가 터지면 같은 사람의 3.5 m 안 함정이 0.2 s 뒤 제자리에서 터진다(반지름 + 0.4 m 안, 땅에 선 적 모두). 연쇄는 이어진다
 * 하늘 덮개 (마법, 틀 zone의 지대 sky): 덮개 안에 떠 있는(z ≥ 1) 적을 0.5 s마다 번개로 굳힌다(0.4 s): 날다 굳으면 떨어진다(rules/flight). 땅엔 닿지 않는다. 비가 걷는다(core)
 * 치우기: 불(불 지대·불 구름·불 터짐·실 끝, core의 ignite)이나 비가 닿은 적의 함정은 사라진다. 벽은 산·물·벽 밀기(rules/bulwark, terrain), 날아서 넘기(2 m 위)
 * 두뇌 (선명도 5 이상, 판단 수준의 tac.fortify: 1 상급, 2 대가, 3 전설, tac.breach 대가부터):
 *   짓기(리듬의 단계 'build'): 떠보기 중에 상대가 60 m 안이면서 30 m 넘게 멀거나 물러나면(상대가 빠지기거나 −2 m/s) 진지를 세우고(35 m 넘게 떨어졌고 20 s 지났으면 새로) 계획의 다음 칸을 짓는다(세운 뒤 12 s까지)
 *   집('home'): 진지 곁(반지름 10 + 4 m)에 있고 상대가 진지 가운데 24 m 안으로 들어오면 진지 안에서 받아친다(땅에 서서, 공격 × 1.3). 빠지기는 진지로 물러난다(60 m 안이면)
 *   계획(진지 자리 A, 상대 쪽 u, 옆 p): 상급: 벽 하나(A + 3u), 함정 둘(A + 5u ± 1.5p) — 그리고 길목 함정(다가오는 적의 1.2 s 앞), 쏠 때 벽(첫 칸이 0.5 s 넘게 모으면 두 번째 칸에 벽)
 *     대가(몰이길): 하늘 덮개(A + 2u), 흙벽 넷(A + 8u ± 2.6p, ± 5.2p: 가운데 틈 하나), 끝 함정 둘(A + 8u ± 6.8p). 적이 틈(A + 8u) 4 m 안에 들면 지연 폭발을 틈의 끝(A + 5u) 쪽에 × 2
 *     전설(미끼 진지): 대가의 것 + 틈에 안 보이는 함정 셋(1.2 m 간격, 연쇄): 틈은 비어 보인다
 *   부수기(대가부터): 알아챈 적의 함정(적 곁 14 m 안)에 비·불, 나를 막는 하늘 덮개엔 비. 누구나: 떠 있으면 적의 덮개를 비킨다(안에 들었으면 내려앉는다).
 *     들어가는 중(리듬)이면 덮개 앞에서 내려앉아 걸어 들어간다: 몰이길을 지난다 */
const F = require('../../data/rules/fort.json'), BR = F.brain;
const { hyp } = require('../math');
const { saltR } = require('./saltRing').api;
// 소금 원 안인가 (여유 k m): 진지는 줄어드는 원 안쪽에만 세우고, 원 밖이 된 진지로는 물러나지 않는다
const inRing = (W, x, y, k) => !W.rules.saltRing || hyp(x - W.width / 2, y - W.height / 2) < saltR(W) - k;
const SKY = s => s.t === 'zone' && s.z && s.z.k === 'sky';
const FIRE = s => (s.t === 'area' && s.kind === 'fire') || (s.t === 'zone' && s.z && s.z.k === 'fire') || (s.t === 'proj' && s.burst && s.burst.kind === 'fire');
module.exports = {
  name: 'fort', switch: 'fort', on: W => W.rules.fort,
  engine: X => {
    const { hurt, eff, hit, addZone, rangeOf, sizeOf } = X;
    // 연쇄: t가 터졌다. 같은 사람의 옆 함정에 불을 붙인다
    function chain(W, t) { if (!W.rules.trapChain) return; for (const u of W.traps) if (u !== t && !u.done && u.src === t.src && !(u.chain > 0) && u.arm <= 0 && hyp(u.x - t.x, u.y - t.y) < F.chainR) u.chain = F.chainDelay; }
    function blast(W, t) {
      const tr = t.s.tr, src = t.src; let h = false; t.done = true; src.fort.chain++;
      for (const q of W.foes[src.side]) { if (q.z >= 1 || q.hp <= 0 || hyp(q.x - t.x, q.y - t.y) >= t.r + F.chainPad) continue; if (tr.dmg) hurt(W, q, tr.dmg * t.pow, src, t.s.n, tr.kind || 'blunt'); eff(W, q, tr); h = true; }
      if (h) hit(src, t.s);
      if (tr.zone) addZone(W, src, Object.assign({}, tr.zone, { n: t.s.n }), t.x, t.y, 0, 1);
      if (W.rec) W.fx.push(['b', t.x, t.y, t.r]);
      chain(W, t);
    }
    return {
      trapCap(W, m, n) { const k = Math.round(F.trapK * m.circles); return k > n ? k : n; },
      trapFire(W, t) { chain(W, t); },
      world(W) {
        if (W.rules.trapChain) for (const t of W.traps) if (t.chain > 0 && !t.done && (t.chain -= W.dt) <= 0) blast(W, t);
        // 하늘 덮개: 0.5 s마다 덮개 안에 떠 있는 적을 굳힌다
        if (W.step % (F.sky.every * W.sk) === 0) for (const z of W.zones) {
          if (z.k !== 'sky') continue;
          for (const q of W.foes[z.src.side]) if (q.z >= 1 && q.hp > 0 && hyp(q.x - z.x, q.y - z.y) < z.r) { hurt(W, q, F.sky.dmg, z.src, z.n, 'elec'); eff(W, q, { stun: F.sky.stun, kind: 'elec' }, 1); z.src.fort.skyZap++; }
        }
        // 몰이길로 든 적 (지표): 틈 2.5 m 안의 땅에 선 적, 진지마다 3 s에 한 번
        if (W.step % (3 * W.sk) === 0) for (const m of W.ms) {
          const P = m.fort.plan; if (!P || !P.gap || m.hp <= 0 || W.t - m.fort.gT < 3) continue;
          const gx = m.fort.x + m.fort.ux * BR.line, gy = m.fort.y + m.fort.uy * BR.line;
          for (const q of W.foes[m.side]) if (q.z < 1 && hyp(q.x - gx, q.y - gy) < BR.gapR) { m.fort.funnel++; m.fort.gT = W.t; break; }
        }
      },
      // 진지 안(반지름 + 2 m)·밖에서 적에게 받은 피해 (지표. 제 머리·소금·추락은 빼고)
      hurt(W, m, v, src) { if (m.fort.x === m.fort.x && src && src.side !== m.side) { if (hyp(m.x - m.fort.x, m.y - m.fort.y) < BR.R + 2) m.fort.inDmg += v; else m.fort.outDmg += v; } },
      // 불이 닿은 적의 함정은 탄다
      ignite(W, x, y, r, src) { if (!src || !src.fort) return; for (const t of W.traps) if (!t.done && t.src.side !== src.side && hyp(t.x - x, t.y - y) < r + t.r) { t.done = true; src.fort.clear++; src.mlog.razed++; } },
      release(W, m, c) {
        const s = c.s, f = m.fort;
        if (s.t === 'trap') f.traps++; else if (s.t === 'build' || s.t === 'wall') f.walls++; else if (SKY(s)) f.sky++;
        if (s.t === 'zone' && s.z.k === 'rain') {   // 비가 적의 함정을 씻고 덮개를 걷는다(덮개는 core가 지운다. 여기선 센다)
          const dx = c.tx - m.x, dy = c.ty - m.y, d = hyp(dx, dy) || 1, R0 = Math.min(d, rangeOf(m, s) || 4), x = m.x + dx / d * R0, y = m.y + dy / d * R0, rr = s.z.r * sizeOf(m, s);
          for (const t of W.traps) if (!t.done && t.src.side !== m.side && hyp(t.x - x, t.y - y) < rr) { t.done = true; f.clear++; m.mlog.razed++; }
          for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && z.t > 0 && hyp(z.x - x, z.y - y) < rr + z.r) { f.clear++; m.mlog.razed++; }
        }
      },
    };
  },
  brain: B => {
    const C = B.C;
    const lvOf = m => (m.C >= 5 && m.tac.fortify) || 0;   // 선명도 5 이상(상위·대마법사)만
    const el = (k, x, y, hid) => ({ k, x, y, hid: hid || 0 });
    // 진지를 세운다: 지금 자리, 상대 쪽. 계획은 판단 수준마다 (위 머리 주석)
    function found(W, m, K) {
      const e = K.e, d = K.d || 1, ux = (e.x - m.x) / d, uy = (e.y - m.y) / d, px = -uy, py = ux, lv = lvOf(m), L = BR.line, S = BR.seg;
      const at = (a, b, k, hid) => el(k, m.x + ux * a + px * b, m.y + uy * a + py * b, hid);
      m.fort.x = m.x; m.fort.y = m.y; m.fort.ux = ux; m.fort.uy = uy; m.fort.t = W.t; m.fort.founded++;
      const els = [];
      if (lv === 1) els.push(at(3, 0, 'wall'), at(5, 1.5, 'trap'), at(5, -1.5, 'trap'));
      else {
        els.push(at(BR.skyAt, 0, 'sky'));
        if (lv >= 3) els.push(at(L + 0.8, 0, 'trap', 1), at(L - 0.4, 0, 'trap', 1), at(L - 1.6, 0, 'trap', 1));   // 미끼: 틈에 안 보이는 함정 (연쇄 거리 안)
        els.push(at(L, S, 'wall'), at(L, -S, 'wall'), at(L, BR.end, 'trap'), at(L, -BR.end, 'trap'), at(L, 2 * S, 'wall'), at(L, -2 * S, 'wall'));
      }
      m.fort.plan = { els, gap: lv >= 2, nx: null, built: 0 };
    }
    // 계획의 칸이 서 있는가
    function stands(W, m, n) {
      if (n.k === 'wall') { const ws = W.walls, a = ws.length ? C.wallsIn(W, n.x - 1.5, n.y - 1.5, n.x + 1.5, n.y + 1.5) : ws; for (let i = 0; i < a.length; i++) { const w = ws[a[i]]; if (w.mk === m.id && hyp(w.x - n.x, w.y - n.y) < 1.3) return true; } return false; }
      if (n.k === 'trap') { for (const t of W.traps) if (t.src === m && !t.done && hyp(t.x - n.x, t.y - n.y) < 1.2) return true; return false; }
      for (const z of W.zones) if (z.k === 'sky' && z.src === m && hyp(z.x - n.x, z.y - n.y) < 4) return true; return false;
    }
    function next(W, m) { const P = m.fort.plan; P.nx = null; P.built = 0; for (const n of P.els) { if (stands(W, m, n)) P.built++; else if (!P.nx) P.nx = n; } return P.nx; }
    return {
      // 리듬에 더하는 단계 (rhythm.phase의 끝에서): 짓기·집. 떠보기일 때만 바꾼다(들어가기·빠지기가 먼저)
      phase(W, m, K) {
        const lv = lvOf(m); if (!lv || m.phase !== 'probe') return;
        const e = K.e, d = K.d, has = m.fort.x === m.fort.x;
        if (has && m.fort.plan) next(W, m);
        if (has && ((m.fort.plan && m.fort.plan.built) || m.fort.bpN) && hyp(m.x - m.fort.x, m.y - m.fort.y) < BR.R + 4 && hyp(e.x - m.fort.x, e.y - m.fort.y) < BR.R + BR.home) { m.phase = 'home'; K.prefR = d; K.aggr *= 1.3; return; }
        if (W.rules.blueprint) return;   // 청사진이 켜지면 짓기는 청사진 규칙이 (v2.4, rules/blueprint)
        const away = d > BR.buildD || ((e.phase === 'out' || K.vt < -2) && d > BR.backD);
        if (!away || d > BR.near) return;
        if ((!has || (hyp(m.x - m.fort.x, m.y - m.fort.y) > BR.relocate && W.t - m.fort.t > BR.again)) && inRing(W, m.x, m.y, BR.ring)) { found(W, m, K); next(W, m); }
        if (!(m.fort.x === m.fort.x)) return;
        if (W.t - m.fort.t < BR.budget && m.fort.plan.nx) { m.phase = 'build'; K.prefR = d; K.aggr *= 0.6; K.pressB = false; }
      },
      steer(W, m, K) {
        // 누구나(예비동작을 읽는 사람): 떠 있으면 적의 하늘 덮개를 비킨다. 이미 안이면 내려앉는다
        if (m.tac.readCast && !K.blindR && m.fly >= 1) for (const z of W.zones) {
          if (z.k !== 'sky' || z.src.side === m.side) continue;
          const px = m.x + m.vx * 0.8 - z.x, py = m.y + m.vy * 0.8 - z.y, l = hyp(px, py);
          if (l < z.r + 1.5) { if (m.phase === 'in') { m.flyWant = false; continue; } K.vx = px / (l || 1) * 3; K.vy = py / (l || 1) * 3; if (hyp(m.x - z.x, m.y - z.y) < z.r + 0.5) m.flyWant = false; }   // 들어가는 중이면 덮개 앞에서 내려앉아 걸어 들어간다
        }
        const lv = lvOf(m); if (!lv || !(m.fort.x === m.fort.x) || K.dodge) return;
        const P = m.fort.plan, ph = m.phase; let tx = NaN, ty = NaN;
        if (ph === 'build' && P && P.nx && !W.rules.blueprint) { tx = m.fort.x; ty = m.fort.y; if (P.nx.k === 'wall') { tx = P.nx.x - m.fort.ux * BR.wallAt; ty = P.nx.y - m.fort.uy * BR.wallAt; } }
        else if (ph === 'home') { tx = m.fort.x; ty = m.fort.y; }
        else if (ph === 'out' && hyp(m.x - m.fort.x, m.y - m.fort.y) < BR.near && inRing(W, m.fort.x, m.fort.y, 5)) { tx = m.fort.x; ty = m.fort.y; }   // 빠지기: 진지로 (진지가 소금 원 안이면)
        if (!(tx === tx)) return;
        const dx = tx - m.x, dy = ty - m.y, l = hyp(dx, dy);
        if (l > 0.4) { const k = l > 2 ? 2 : l; K.vx = dx / l * k; K.vy = dy / l * k; } else if (ph !== 'out') { K.vx = 0; K.vy = 0; }
        if (m.fv > 2 + l * 1.5) m.fv = 2 + l * 1.5;   // 날아가면 넘치지 않게
        if ((ph === 'build' && P.nx.k === 'wall' && l < 12) || (ph === 'home' && l < 4)) m.flyWant = false;   // 벽은 땅에서 세운다, 집에선 땅에 선다
      },
      value(W, m, K, o) {
        const lv = lvOf(m), s = o.s, e = K.e; if (!lv) return;
        const R = C.rangeOf(m, s), P = m.fort.plan;
        // 상급부터: 길목 함정(땅에서 다가오는 적의 1.2 s 앞), 쏠 때 벽(첫 칸이 0.5 s 넘게 모으거나 큰 수면 두 번째 칸에 벽을 상대 쪽으로)
        if (s.t === 'trap' && e.z < 1 && K.vt > 1 && K.d < 6 * Math.sqrt(m.C)) { const tx = e.x + e.vx * 1.2, ty = e.y + e.vy * 1.2; if (hyp(tx - m.x, ty - m.y) > 3 && o.v < 1) { o.v = 1; o.tx = tx; o.ty = ty; } }
        if (K.slot === 'B' && s.t === 'wall' && m.cast && (m.cast.T >= 0.5 || m.cast.s.big) && K.los && K.d < 25 && o.v < 1) { o.v = 1; o.tx = e.x; o.ty = e.y; }
        // 짓기: 계획의 다음 칸. 집에선 덮개만 다시 깐다
        const n = !W.rules.blueprint && P && P.nx;   // 청사진이 켜지면 칸 하나씩 짓지 않는다
        if (n && (m.phase === 'build' || (m.phase === 'home' && n.k === 'sky'))) {
          if (n.k === 'sky' && SKY(s) && hyp(n.x - m.x, n.y - m.y) < R) { o.v = 2.5; o.tx = n.x; o.ty = n.y; }
          else if (n.k === 'trap' && s.t === 'trap' && !(n.hid && s.vis) && hyp(n.x - m.x, n.y - m.y) < 6 * Math.sqrt(m.C) - 0.3) { o.v = 2; o.tx = n.x; o.ty = n.y; }
          else if (n.k === 'wall' && ((s.t === 'build' && s.shape === 'line') || s.t === 'wall') && m.z < 1 && hyp(n.x - m.fort.ux * BR.wallAt - m.x, n.y - m.fort.uy * BR.wallAt - m.y) < BR.stand) { o.v = s.t === 'build' ? 3 : 2.5; o.tx = m.x + m.fort.ux * 5; o.ty = m.y + m.fort.uy * 5; }   // 흙벽(세 블록·구덩이)을 먼저, 없으면 기둥
          else if (m.phase === 'build' && o.isOff) o.v *= 0.5;
        }
        // 대가부터 몰이길의 끝: 적이 틈 4 m 안(땅)이면 지연 폭발을 틈과 그 끝(A + 3u) 사이에 × 2
        if (P && P.gap && m.phase === 'home' && s.t === 'area' && e.z < 1) {
          const gx = m.fort.x + m.fort.ux * BR.line, gy = m.fort.y + m.fort.uy * BR.line;
          if (hyp(e.x - gx, e.y - gy) < 4) { const kx = m.fort.x + m.fort.ux * BR.kill, ky = m.fort.y + m.fort.uy * BR.kill, w = s.delay > 1 ? 0.7 : 0.3; o.v = o.v * 2 + 0.3; o.tx = e.x + (kx - e.x) * w; o.ty = e.y + (ky - e.y) * w; }
        }
        // 부수기 (대가부터): 알아챈 적의 함정에 비·불, 나를 막는 적의 하늘 덮개에 비
        if (m.tac.breach && (FIRE(s) || (s.t === 'zone' && s.z.k === 'rain'))) {
          const rain = s.t === 'zone', Rr = R || 4;
          for (const t of W.traps) if (!t.done && t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - e.x, t.y - e.y) < BR.breachR && hyp(t.x - m.x, t.y - m.y) < Rr) { if (o.v < 0.8) { o.v = 0.8; o.tx = t.x; o.ty = t.y; } break; }
          if (rain) for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && hyp(z.x - m.x, z.y - m.y) < Rr + z.r * 0.5 && (m.z >= 1 || hyp(z.x - e.x, z.y - e.y) < z.r + 3)) { if (o.v < 1.2) { o.v = 1.2; o.tx = z.x; o.ty = z.y; } break; }
        }
      },
    };
  },
};
