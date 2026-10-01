'use strict';
/* 규칙: 청사진 짓기 (rules.blueprint, v2.4, SPEC 28장, 청사진은 data/blueprints.json, 수는 data/rules/blueprint.json)
 * 청사진 = 구조물 배치 묶음(반원 보루·몰이길·함정 격자·하늘 막기·엄폐 사다리). 마법 '청사진'(틀 blueprint)이 한 번에 짓는다.
 * 여러 칸(서클)으로 한꺼번에: 갈래 수 = min(구조물 수, 서클 − 1(떠 있으면 − 1 더), 적어도 1). 갈래마다 제 출력으로 하나씩 차례로 짓는다(출력·머리 피로·당은 갈래 수만큼 든다).
 *   흙벽(블록 둘, 두께 0.4 m, 1.0 m³): 벽 규칙의 세우는 속도(초당 0.6 m³ × 출력/632 kW, 대마법사 1.7 s). 땅에 서서만, 벽 규칙이 켜져 있어야
 *   석회 기둥: 0.4 s. 함정·지대(하늘 덮개·빙판): 그 마법의 예비동작 시간 뒤 그 마법을 그 자리에 푼다(책에 있어야, 방출은 core release 그대로)
 *   구조물을 시작할 때 당을 내고(모자라면 건너뛴다), 벽·기둥은 머리 피로 당 × 1.6(넘칠 것 같으면 건너뛴다). 걸리는 시간은 미리 짜 둔 차례표 그대로(굳으면 멈추고 지은 것은 남는다)
 *   대마법사: 반원 보루(벽 다섯) 약 2 s, 하늘 막기 약 0.9 s, 함정 격자 약 1.2 s
 * 두뇌 (생각 겹, 선명도 5 이상, 판단 수준의 tac.blueprint: 1 상급 = 책에 맞는 첫 청사진, 2 대가부터 = 상황에 맞게):
 *   짓기 단계(리듬): 떠보기 중 상대가 60 m 안이면서 30 m 넘게 멀거나 물러나면(진지 규칙과 같은 때), 청사진이 준비됐고 지난 청사진에서 8 s 지났으면
 *   고르기: 당이 모자라지 않는 것 가운데, 특징(상대가 떠 있음·땅·다가옴·멂, 내 피로·다친 몫)에 청사진의 무게를 곱해 더한 값이 가장 큰 것
 *   자리 맞추기: 진지 자리 = 내 자리, u = 상대 쪽. 구조물이 싸움터·소금 원 밖이면 자리를 안으로 민다. 벽이 든 청사진은 내려앉아 선다 */
const { hyp, sin, cos } = require('../math');
const BPD = require('../../data/blueprints.json'), P = require('../../data/rules/blueprint.json');
const BK = require('../../data/rules/bulwark.json').block;
const { rateOf } = require('./bulwark').api, { saltR } = require('./saltRing').api;
const NAMES = Object.keys(BPD.blueprints), D2R = Math.PI / 180;
// 구조물에 쓸 마법 (책에서): 함정(안 보이는 것을 바라면 안 보이는 것), 지대
function spellFor(W, m, it) {
  const S = W.spells; let any = null;
  for (const n of m.book) { const s = S[n]; if (!s) continue;
    if (it.cast === 'trap' && s.t === 'trap') { if (!it.hidden || !s.vis) return s; if (!any) any = s; }
    if (it.cast === 'zone' && s.t === 'zone' && s.z && s.z.k === it.zone) return s; }
  return it.cast === 'trap' ? any : null;
}
// 이 청사진을 지을 수 있나 (need의 것이 모두 있나)
function can(W, m, bp) {
  for (const k of bp.need) { const it = BPD.items[k]; if (it.build === 'earth' && !W.rules.bulwark) return false; if (it.cast && !spellFor(W, m, it)) return false; }
  return true;
}
// 청사진의 당 (구조물마다: 벽·기둥은 제 값, 함정·지대는 그 마법의 당)
function costOf(W, m, bp) { let c = 0; for (const [k] of bp.items) { const it = BPD.items[k]; if (it.build) c += it.cost; else { const s = spellFor(W, m, it); if (s) c += s.cost; } } return c; }
// 갈래 수
const lanesOf = (m, n) => Math.max(1, Math.min(n, m.circles - 1 - (m.z >= 1 && m.fly !== 3 ? 1 : 0), P.maxLanes));
// 구조물 하나를 짓는 데 드는 시간
function durOf(W, m, it, s) { if (it.build === 'earth') return it.blocks * BK.gap * BK.h * it.th / (rateOf(m) || 1e-9); if (it.build === 'lime') return it.time; return s ? s.cast : 0; }
// 차례표: 자리를 맞추고 갈래마다 차례로 (시작·끝 시각은 청사진 시전의 준비 뒤부터)
function plan(W, m, name, ax, ay, ux, uy) {
  const bp = BPD.blueprints[name], px = -uy, py = ux, out = [];
  for (const [k, a, b, rot] of bp.items) {
    const it = BPD.items[k], s = it.cast ? spellFor(W, m, it) : null; if (it.cast && !s) continue; if (it.build === 'earth' && !W.rules.bulwark) continue;
    const r = (rot || 0) * D2R, fx = ux * cos(r) - uy * sin(r), fy = ux * sin(r) + uy * cos(r);
    out.push({ k, it, s, x: ax + ux * a + px * b, y: ay + uy * a + py * b, fx, fy, s0: 0, s1: 0, on: 0, placed: 0, grp: -1 });
  }
  // 자리 맞추기: 싸움터 안(1.5 m 여유), 소금 원 안(2 m 여유)으로 민다
  let sx = 0, sy = 0; const lo = 1.5;
  for (const o of out) { if (o.x + sx < lo) sx = lo - o.x; if (o.x + sx > W.width - lo) sx = W.width - lo - o.x; if (o.y + sy < lo) sy = lo - o.y; if (o.y + sy > W.height - lo) sy = W.height - lo - o.y; }
  if (W.rules.saltRing) { const R = saltR(W) - 2, cx = W.width / 2, cy = W.height / 2; let worst = 0, wx = 0, wy = 0; for (const o of out) { const dx = o.x + sx - cx, dy = o.y + sy - cy, d = hyp(dx, dy); if (d - R > worst) { worst = d - R; wx = dx / d; wy = dy / d; } } sx -= wx * worst; sy -= wy * worst; }
  for (const o of out) { o.x += sx; o.y += sy; }
  const L = lanesOf(m, out.length), free = new Array(L).fill(0); let T = 0;
  for (const o of out) { let j = 0; for (let i = 1; i < L; i++) if (free[i] < free[j]) j = i; o.s0 = free[j]; o.s1 = free[j] + durOf(W, m, o.it, o.s); free[j] = o.s1; if (o.s1 > T) T = o.s1; }
  return { name, x: ax + sx, y: ay + sy, ux, uy, items: out, T, lanes: L, built: 0, ground: out.some(o => o.it.build) };
}
// 짓기: 청사진 시전의 준비(마법의 예비동작) 뒤 차례표대로. all이면 남은 것을 모두
// 함정·지대도 풀 때 머리가 넘쳐 굳거나 고르지 않은 파도에 오를 것이면 건너뛴다 (v2.6, 스스로 죽지 않기: tac.survive, 선명도 5 이상, brain/util의 heatOver와 같은 문턱)
function hot(W, m, cost) { if (!m.tac.survive || m.C < 5 || !W.rules.fatigue) return false; const f = m.fat + cost * 1.6; if (W.rules.wave) { if (m.type === '이단') return false; if (m.wave || (m.tac.waveChoose && m.waveWant)) return f > 165; } return f > 97; }
function step(W, m, c, all, X) {
  const b = c.bp, tc = c.t - c.s.cast, e = c.tgt;
  for (const o of b.items) {
    if (o.on === 2 || (!all && tc < o.s0)) continue;
    if (!o.on) {   // 시작: 당·머리 피로, 땅
      const cost = o.s ? o.s.cost : o.it.cost;
      if (m.glu < cost || (o.it.build && (m.z >= 1 || m.fat + cost * 1.6 > 100)) || (!o.it.build && hot(W, m, cost))) { o.on = 2; continue; }
      m.glu -= cost; if (o.it.build && W.rules.fatigue) m.fat += cost * 1.6; o.on = 1;
    }
    const k = all || tc >= o.s1 ? 1 : (tc - o.s0) / ((o.s1 - o.s0) || 1);
    if (o.it.build === 'earth') {   // 블록을 하나씩
      const n = o.it.blocks, upto = Math.floor(k * n + 1e-9), qx = -o.fy, qy = o.fx, vol = BK.gap * BK.h * o.it.th; if (o.grp < 0) o.grp = W._grp++;
      while (o.placed < upto) { const off = (o.placed - (n - 1) / 2) * BK.gap; X.addWall(W, { x: o.x + qx * off, y: o.y + qy * off, r: BK.r, hp: BK.hpM3 * vol, t: 1e9, own: -1, mat: 'earth', thick: o.it.th, grp: o.grp, mk: m.id }); o.placed++; }
      if (o.placed >= n) { o.on = 2; b.built++; }
    } else if (k >= 1) {
      if (o.it.build === 'lime') X.addWall(W, { x: o.x, y: o.y, r: o.it.r, hp: o.it.hp * (1 + (m.C - 1) * 0.5), t: 1e9, own: -1, mat: 'lime', thick: o.it.r * 2, grp: W._grp++, mk: m.id });
      else if (hot(W, m, o.s.cost)) { o.on = 2; continue; }   // 풀 때 넘칠 것이면 건너뛴다 (여럿이 한 걸음에 풀린다)
      else X.release(W, m, { s: o.s, tx: o.x, ty: o.y, tgt: e, t: 0, T: 0, lane: true });   // 함정·지대: 그 마법을 그 자리에 (방출 그대로: 머리 피로·장악권)
      o.on = 2; b.built++;
    }
  }
}
// 두뇌 (생각 겹): 판단 수준, 특징(0~1), 고르기, 땅이 드는가
const lvOf = m => (m.C >= 5 && m.tac.blueprint) || 0;
function feats(m, K) { const e = K.e; return { base: 1, eFly: e.z >= 1 ? 1 : 0, eGround: e.z >= 1 ? 0 : 1, approach: Math.max(0, Math.min(1, K.vt / 5)), far: Math.max(0, Math.min(1, (K.d - 20) / 30)), tired: Math.max(0, Math.min(1, (m.fat - 60) / 40)), hurt: 1 - m.hp / m.hpMax }; }
function pick(W, m, K) {
  const lv = lvOf(m); let best = null, bs = -1; const F = lv >= 2 ? feats(m, K) : null;
  for (const n of NAMES) { const bp = BPD.blueprints[n]; if (!can(W, m, bp) || m.glu < costOf(W, m, bp)) continue; if (lv < 2) return n; let s = 0; for (const k in bp.score) s += bp.score[k] * F[k]; if (s > bs) { bs = s; best = n; } }   // 당이 모자라면 고르지 않는다
  return best;
}
const needGround = n => BPD.blueprints[n].items.some(([k]) => BPD.items[k].build);
// 짓기 단계로: 청사진이 준비됐고(책·간격·지난 청사진에서 8 s) 고를 게 있으면. 작전 겹(진지, rules/tactics)도 이것으로 짓는다(v2.5)
function startBuild(W, m, K) {
  const f = m.fort, s = W.spells['청사진'];
  if (!lvOf(m) || !s || !m.book.includes('청사진') || (m.cd['청사진'] || 0) > 0 || W.t - f.bpLast < P.again) { f.bpPick = null; return false; }
  f.bpPick = pick(W, m, K); if (!f.bpPick) return false;
  m.phase = 'build'; K.prefR = K.d; K.aggr *= 0.6; K.pressB = false; return true;
}
module.exports = {
  name: 'blueprint', switch: 'blueprint', on: W => W.rules.blueprint, form: { blueprint: 'self' }, api: { plan, can, BPD, startBuild },
  engine: X => ({ mageStep(W, m) { const c = m.cast; if (c && c.bp && c.s.t === 'blueprint' && c.t >= c.s.cast) step(W, m, c, false, X); } }),
  types: X => ({
    // 다 지었다: 남은 반올림 몫까지 짓고 센다
    blueprint(W, m, c) { const b = c.bp; if (!b) return; step(W, m, c, true, X); const f = m.fort; f.bpN++; f.bpItems += b.built; f.bpT += c.T; f.bpName[b.name] = (f.bpName[b.name] || 0) + 1; f.bpLast = W.t; },
  }),
  brainTypes: B => ({ blueprint(W, m, K, o) { o.v = 0; } }),   // 값은 두뇌 훅이
  brain: B => {
    return {
      // 리듬의 짓기 단계 (진지 규칙의 짓기를 대신한다)
      phase(W, m, K) {
        if (!lvOf(m) || m.phase !== 'probe') return;
        const e = K.e, d = K.d;
        const away = d > P.buildD || ((e.phase === 'out' || K.vt < -2) && d > P.backD);
        if (!away || d > P.near) { m.fort.bpPick = null; return; }
        startBuild(W, m, K);
      },
      steer(W, m, K) {
        const f = m.fort, c = m.cast;
        if (c && c.bp && c.bp.ground) { m.flyWant = false; return; }   // 짓는 동안 땅에 (벽·기둥은 떠서 못 짓는다)
        if (m.phase === 'build' && f.bpPick && needGround(f.bpPick) && !K.dodge) { m.flyWant = false; K.vx = 0; K.vy = 0; }   // 벽이 든 청사진은 내려앉아 선다
      },
      value(W, m, K, o) {
        if (o.s.t !== 'blueprint' || !lvOf(m)) return; const f = m.fort;
        if (m.phase !== 'build' || !f.bpPick || (needGround(f.bpPick) && m.z >= 1) || K.slot !== 'A') return;
        o.v = P.value; o.tx = K.e.x; o.ty = K.e.y;
      },
      commit(W, m, K, best, cast) {
        if (best.s.t !== 'blueprint') return; const f = m.fort, e = K.e, d = K.d || 1;
        const b = plan(W, m, f.bpPick, m.x, m.y, (e.x - m.x) / d, (e.y - m.y) / d); cast.bp = b; cast.T = best.s.cast + b.T;
        f.x = b.x; f.y = b.y; f.ux = b.ux; f.uy = b.uy; f.t = W.t; f.founded++; f.bpLast = W.t;   // 진지 자리 (진지 규칙의 집·피해 지표가 본다)
      },
    };
  },
};
