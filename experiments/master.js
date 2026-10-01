'use strict';
/* 숨 결투장 v2.2.0 — 고수 싸움 재기 (대마법사끼리, SPEC 26장, reports/v2.2.0.md)
 *   node experiments/master.js [대진,…] [N] [--deck 덱] [--tac '{…}'] [--rules '{…}']
 *     대진: 전설-대가, 전설-전설, 대가-상급, 상급-중급 (기본 모두), N = 100 (씨앗 1..N, 판마다 자리를 번갈아)
 *     --tacA: 앞 사람에게만 덧씌울 tac (기술 떼기). --tac: 두 사람 모두에게 덧씌울 tac (새 기술을 끄고 견줄 때: '{"rhythm":false,"roles":false,"efficacy":false,"buffNeed":false,"shape":false,"domainPush":false}')
 *   → results/master[-이름].json (--save 이름)
 *   node experiments/master.js scene [fort|agile]  대표 장면 → sandbox/scenes/v2-master-legend.json (fort: v2-fort-legend.json v2.3, agile: v2-agile-legend.json v2.4 매 걸음 녹화) (그다음 node cli.js pack)
 *   v2.3: --rules '{"flightCut":true,"fort":true,"trapChain":true}' --deck '대마법사 진지'로 날기 끊기·진지를 켠다. 사람마다(A 앞·B 뒤) 끊기·진지 수가 더 나온다
 * 지표 (한 사람 기준, 두 사람 평균; 점수는 앞 사람):
 *   길이, 평균 거리, 거리 흔들림(0.5 s마다 잰 거리의 표준편차/평균 = 리듬), 초당 시전, 두 번째 칸 판당, 입장 몫,
 *   마법별 시전 몫·명중률·헛손질(명중 없는 시전의 몫), 칸마다 역할 몫(A·B·자동: 공격·방어·지형·이동·강화),
 *   리듬 단계 몫(떠보기·들어가기·빠지기), 장악 경계: 상대 쪽 틈(경계에서 상대까지, m)의 평균과 초당 경계 이동(m/s),
 *   세운 지형·없앤 지형(판당) */
const fs = require('fs'), path = require('path');
const A = require('../src'), core = require('../src/core');
const PAIRS = { '전설-대가': ['전설', '대가'], '전설-전설': ['전설', '전설'], '대가-상급': ['대가', '상급'], '상급-중급': ['상급', '중급'] };
// 날기 끊기·진지 (v2.3, 27장): 사람마다(앞 사람 A, 뒤 사람 B) 판당 수
// 반사 겹·끊는 움직임 (v2.4, 28장): m.rx의 기록. 방향 전환은 여기서도 따로 잰다(규칙이 꺼져도)
const RX = ['rS', 'rN', 'rMiss', 'juke', 'stop', 'flip', 'dodge', 'shotJ', 'missJ', 'shotN', 'missN', 'lrtN', 'saw', 'bounce', 'flips'], BP = ['bpN', 'bpItems', 'bpT'];
// 작전 겹·각도 (v2.5, 29장): 둘레 방향 몫·한쪽 사거리·상대가 대응하는 시간·엄폐 벗김·퇴로 자름은 여기서 잰다(규칙이 꺼져도). 작전 기록은 m.op.log
const U = require('../src/brain/util'), DIRECT = { proj: 1, thread: 1, touch: 1, cone: 1 }, INDIRECT = { area: 1, lob: 1 };
function rangesOf(w, m) { const D = U.deck(m, w.spells), r = { dir: 0, ind: 0 }; for (let i = 0; i < D.sp.length; i++) { const s = D.sp[i], R = s.t === 'cone' ? s.L * core.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : D.R[i]; if (DIRECT[s.t] && R > r.dir) r.dir = R; if (INDIRECT[s.t] && R > r.ind) r.ind = R; } return r; }
function retreatOf(w, e) { if (e.fort && e.fort.x === e.fort.x && Math.hypot(e.fort.x - e.x, e.fort.y - e.y) < 60) return [e.fort.x, e.fort.y]; let b = null, bd = 15; for (const o of w.obs) { const d = Math.hypot(o.x - e.x, o.y - e.y); if (d < bd) { bd = d; b = o; } } return b ? [b.x, b.y] : [w.width / 2, w.height / 2]; }
const responding = (w, m) => m.roll > 0 || !!(m._k && m._k.dodge) || w.t < m.rx.until || !!m.cut.k;
const CUT = ['cut', 'brake', 'side', 'hop', 'drop', 'dive', 'cush', 'crash', 'dropTry', 'dropHit', 'hfeint', 'falls'], FORT = ['walls', 'traps', 'sky', 'skyZap', 'chain', 'clear', 'funnel', 'inDmg', 'outDmg', 'founded'];
// 장악 경계: 두 사람을 잇는 선 위에서 두 신호의 몫이 같은 자리 (5장 식, 도달 반경 안). 나에게서의 거리
function boundary(W, a, b) {
  const L = W.rules.domainL, d = Math.hypot(a.x - b.x, a.y - b.y) || 1, A1 = core.sigOf(W, a) * (a._act ? 1 : W.rules.passive), B1 = core.sigOf(W, b) * (b._act ? 1 : W.rules.passive);
  return Math.max(0, Math.min(d, L * (A1 - B1) / (A1 + B1) + A1 * d / (A1 + B1)));
}
function run(pair, from, N, deck, tac, rules, tacA) {
  const [sa, sb] = PAIRS[pair], o = { n: 0, a: 0, draw: 0, t: 0, dS: 0, dJ: 0, dSD: 0, casts: 0, slotB: 0, stance: {}, spells: {}, role: {}, phase: {}, gap: 0, bMove: 0, built: 0, razed: 0, gapN: 0, cutA: {}, cutB: {}, fortA: {}, fortB: {}, earthA: 0, earthB: 0, hitA: 0, hitB: 0, rxA: {}, rxB: {}, bpA: {}, bpB: {}, turnA: 0, turnB: 0, liveA: 0, liveB: 0, bpName: {}, angA: {}, angB: {}, opA: {}, opB: {} };
  for (let k = from; k < from + N; k++) {
    const sw = k % 2, ma = { tier: '대마법사', skill: sa, deck, tac: tacA ? Object.assign({}, tac, tacA) : tac }, mb = { tier: '대마법사', skill: sb, deck, tac };
    const w = A.sceneWorld({ seed: k + 1, rules, width: 200, height: 150, sides: [{ mages: [sw ? mb : ma] }, { mages: [sw ? ma : mb] }] });
    const X = w.ms[sw ? 1 : 0], Y = w.ms[sw ? 0 : 1];
    const ds = [], bs = []; let lastB = null, bm = 0, met = false;
    const tv = [[0, 0], [0, 0]], RG = [rangesOf(w, X), rangesOf(w, Y)], AG = [{ tan: 0, tot: 0, one: 0, resp: 0, strip: 0, cut: 0, live: 0, orb: 0, w: 0 }, { tan: 0, tot: 0, one: 0, resp: 0, strip: 0, cut: 0, live: 0, orb: 0, w: 0 }], LS = [null, null];
    while (!A.over(w)) {
      A.stepWorld(w);
      if (w.step % 3 === 0 && X.hp > 0 && Y.hp > 0) [X, Y].forEach((m, i) => {   // 0.1 s마다: 둘레 방향, 한쪽 사거리, 대응, 퇴로 자름
        const e = i ? X : Y, g = AG[i], rx = m.x - e.x, ry = m.y - e.y, rl = Math.hypot(rx, ry) || 1, v = Math.hypot(m.vx, m.vy), d = rl;
        g.live += 0.1; g.tan += Math.abs((-ry * m.vx + rx * m.vy) / rl) * 0.1; g.tot += v * 0.1;
        if (d > RG[1 - i].dir && d < RG[i].ind) g.one += 0.1;
        if (responding(w, m)) g.resp += 0.1;
        const [tx, ty] = retreatOf(w, e), tl = Math.hypot(tx - e.x, ty - e.y) || 1; if (d < tl && ((m.x - e.x) * (tx - e.x) + (m.y - e.y) * (ty - e.y)) / (d * tl) > 0.866) g.cut += 0.1;
        g.w += (-ry * m.vx + rx * m.vy) / (rl * rl) * 0.1; if (w.step % 30 === 0) { g.orb += Math.abs(g.w) * 180 / Math.PI; g.w = 0; }   // 내 걸음만으로 상대 둘레를 돈 각 (1 s마다 알짜, 왔다 갔다는 지워진다)
        if (w.step % 15 === 0) { const bl = core.blocked(w, m.x, m.y, e.x, e.y, Math.max(m.z, e.z)), L = LS[i]; if (L && L.bl && !bl && Math.hypot(e.x - L.ex, e.y - L.ey) < 2 && Math.hypot(m.x - L.mx, m.y - L.my) > 2) g.strip++; LS[i] = { bl, ex: e.x, ey: e.y, mx: m.x, my: m.y }; }
      });
      if (w.step % 3 === 0) [X, Y].forEach((m, i) => { if (m.hp <= 0) return; const a = tv[i]; if (m.vx * a[0] + m.vy * a[1] < 0 && Math.hypot(m.vx, m.vy) > 1 && Math.hypot(a[0], a[1]) > 1) o[i ? 'turnB' : 'turnA']++; a[0] = m.vx; a[1] = m.vy; o[i ? 'liveB' : 'liveA'] += 0.1; });   // 0.1 s 사이 90° 넘게 돌았다
      if (w.step % 15 === 0 && X.hp > 0 && Y.hp > 0) {
        const d = Math.hypot(X.x - Y.x, X.y - Y.y); if (!met && d < 50) met = true; if (!met) continue; ds.push(d);   // 처음 50 m 안으로 만난 뒤부터 (다가가는 188 m는 빼고)
        for (const [p, q] of [[X, Y], [Y, X]]) { const x = boundary(w, p, q); bs.push(d - x); }
        const bx = X.x + (Y.x - X.x) * boundary(w, X, Y) / (d || 1), by = X.y + (Y.y - X.y) * boundary(w, X, Y) / (d || 1);
        if (lastB) bm += Math.hypot(bx - lastB[0], by - lastB[1]); lastB = [bx, by];
      }
    }
    const r = A.result(w); o.n++; o.t += r.t; if (r.winner === X.side) o.a++; else if (r.winner < 0) o.draw++;
    if (ds.length > 1) { const mu = ds.reduce((x, y) => x + y, 0) / ds.length, sd = Math.sqrt(ds.reduce((x, y) => x + (y - mu) * (y - mu), 0) / ds.length); o.dS += mu; o.dJ += sd / mu; o.dSD += sd; }
    if (bs.length) { o.gap += bs.reduce((x, y) => x + y, 0) / bs.length; o.gapN++; }
    o.bMove += bm / Math.max(r.t, 1);
    for (const m of [X, Y]) {
      for (const n in m.log.casts) { const s = o.spells[n] || (o.spells[n] = { c: 0, h: 0 }); s.c += m.log.casts[n]; s.h += m.log.hits[n] || 0; o.casts += m.log.casts[n]; }
      o.slotB += m.log.dec.slotB / 2;
      for (const k2 in m.log.stanceT) o.stance[k2] = (o.stance[k2] || 0) + m.log.stanceT[k2];
      const ml = m.mlog; for (const sl in ml.role) for (const ro in ml.role[sl]) { const key = sl + ':' + ro; o.role[key] = (o.role[key] || 0) + ml.role[sl][ro]; }
      for (const ph in ml.phase) o.phase[ph] = (o.phase[ph] || 0) + ml.phase[ph];
      o.built += ml.built / 2; o.razed += ml.razed / 2;
      const ab = m === X ? 'A' : 'B', oc = o['cut' + ab], of = o['fort' + ab];
      for (const k2 of CUT) oc[k2] = (oc[k2] || 0) + m.flog[k2]; for (const k2 of FORT) of[k2] = (of[k2] || 0) + m.fort[k2];
      o['earth' + ab] += m.alog.walls;
      const oag = o['ang' + ab], g = AG[m === X ? 0 : 1]; for (const k2 in g) oag[k2] = (oag[k2] || 0) + g[k2];
      const oop = o['op' + ab], OL = m.op.log; for (const k2 of ['forced', 'forceN', 'ctrlN', 'ctrlMoved', 'pick', 'ticks', 'oneSide', 'peek', 'strip', 'cut']) oop[k2] = (oop[k2] || 0) + OL[k2];
      for (const k2 of ['n', 'ok', 'time']) { const q = oop[k2] || (oop[k2] = {}); for (const z in OL[k2]) q[z] = (q[z] || 0) + OL[k2][z]; }
      if (m.op.cur && m.op.t0 >= 0) { const q = oop.time || (oop.time = {}); q[m.op.cur] = (q[m.op.cur] || 0) + (r.t - m.op.t0); }   // 끝날 때의 작전 시간까지
      const orx = o['rx' + ab], obp = o['bp' + ab]; for (const k2 of RX) orx[k2] = (orx[k2] || 0) + m.rx[k2]; for (const k2 of BP) obp[k2] = (obp[k2] || 0) + (m.fort[k2] || 0);
      if (m.fort.bpName) for (const k2 in m.fort.bpName) o.bpName[k2] = (o.bpName[k2] || 0) + m.fort.bpName[k2]; o['hit' + ab] += (m === X ? Y : X).hpMax - Math.max(0, (m === X ? Y : X).hp);
    }
  }
  return o;
}
// 움직임: 초당 방향 전환, 반응 시간(ms)·반응 못 한 몫, 흔들기(멈칫·뒤집기)·피하기 판당, 흔든 뒤·안 흔든 뒤 나를 겨눈 수가 빗나간 몫, 내려앉기-구르기, 발놀림
const mv = (x, turns, live) => ({ turnsPerS: +(turns / Math.max(1, live)).toFixed(2), reactMs: x.rN ? Math.round(x.rS / x.rN * 1000) : null, noReact: x.rN + x.rMiss ? +(x.rMiss / (x.rN + x.rMiss)).toFixed(3) : null,
  missAfterJuke: x.shotJ ? +(x.missJ / x.shotJ).toFixed(3) : null, missNoJuke: x.shotN ? +(x.missN / x.shotN).toFixed(3) : null, jukeMissed: x.missJ || 0, raw: x });
// 각도: 둘레 방향 몫, 한쪽 사거리 시간 몫, 상대가 대응하는 시간 몫, 엄폐 벗긴 수(판당), 퇴로 자른 시간 몫
const angOf = (g, h, n) => ({ orbitDegPerS: g.live ? +(g.orb / g.live).toFixed(1) : null, tangential: g.tot ? +(g.tan / g.tot).toFixed(3) : null, oneSide: g.live ? +(g.one / g.live).toFixed(3) : null, foeResponding: h.live ? +(h.resp / h.live).toFixed(3) : null, strips: +((g.strip || 0) / n).toFixed(2), cutOff: g.live ? +(g.cut / g.live).toFixed(3) : null });
// 작전: 작전별 시간 몫·완수 비율, 강요한 수(판당)와 그 뒤 상대가 길을 바꾼 몫(대조: 다른 공격)
function opsOf(x, n) {
  const T = Object.values(x.time || {}).reduce((a, b) => a + b, 0) || 1, out = { share: {}, done: {}, forcedPerGame: +((x.forced || 0) / n).toFixed(2), forceN: +((x.forceN || 0) / n).toFixed(2), forcedRate: x.forceN ? +(x.forced / x.forceN).toFixed(3) : null, ctrlRate: x.ctrlN ? +(x.ctrlMoved / x.ctrlN).toFixed(3) : null, switchesPerGame: +((x.pick || 0) / n).toFixed(1) };
  for (const k in x.time || {}) out.share[k] = +(x.time[k] / T).toFixed(3); for (const k in x.n || {}) out.done[k] = +(((x.ok || {})[k] || 0) / x.n[k]).toFixed(2);
  if (x.ticks) out.picks = { oneSide: +(x.oneSide / x.ticks).toFixed(2), peek: +(x.peek / x.ticks).toFixed(2), strip: +(x.strip / x.ticks).toFixed(2), cut: +(x.cut / x.ticks).toFixed(2) };
  return out;
}
const bpOf = (x, n) => ({ perGame: +((x.bpN || 0) / n).toFixed(2), items: x.bpN ? +(x.bpItems / x.bpN).toFixed(1) : 0, secs: x.bpN ? +(x.bpT / x.bpN).toFixed(2) : 0 });
const r3 = x => +x.toFixed(3), r1 = x => +x.toFixed(1), per = (a, n) => Object.fromEntries(Object.entries(a).map(([k, v]) => [k, r1(v / n)]));
function summarize(os) {
  const o = {}; for (const p of os) for (const k in p) { if (typeof p[k] === 'number') o[k] = (o[k] || 0) + p[k]; else { o[k] = o[k] || {}; for (const j in p[k]) { if (typeof p[k][j] === 'number') o[k][j] = (o[k][j] || 0) + p[k][j]; else { const q = o[k][j] || (o[k][j] = {}); for (const z in p[k][j]) q[z] = (q[z] || 0) + p[k][j][z]; } } } }
  const n = o.n, st = Object.values(o.stance).reduce((a, b) => a + b, 0) || 1, rs = {}, ph = Object.values(o.phase).reduce((a, b) => a + b, 0) || 1;
  for (const sl of ['A', 'B', 'auto']) { let tot = 0; for (const k in o.role) if (k.startsWith(sl + ':')) tot += o.role[k]; if (tot) { rs[sl] = { n: r1(tot / n / 2) }; for (const k in o.role) if (k.startsWith(sl + ':')) rs[sl][k.slice(sl.length + 1)] = r3(o.role[k] / tot); } }
  const spells = Object.entries(o.spells).sort((a, b) => b[1].c - a[1].c).map(([k, s]) => ({ spell: k, share: r3(s.c / o.casts), hit: r3(s.h / s.c), miss: r3(Math.max(0, s.c - s.h) / s.c) }));
  const off = Object.entries(o.spells).filter(([k]) => { const s = A.SPELLS[k]; return s && s.role === '공격'; }), oc = off.reduce((a, [, s]) => a + s.c, 0), oh = off.reduce((a, [, s]) => a + Math.min(s.h, s.c), 0);
  return { games: n, score: r3((o.a + o.draw / 2) / n), len: r1(o.t / n), dist: r1(o.dS / n), distSD: r1(o.dSD / n), distJitter: r3(o.dJ / n), castsPerS: r3(o.casts / o.t / 2), slotBPerGame: r1(o.slotB / n),
    stance: Object.fromEntries(Object.entries(o.stance).map(([k, v]) => [k, r3(v / st)])), phase: Object.fromEntries(Object.entries(o.phase).map(([k, v]) => [k, r3(v / ph)])),
    roles: rs, gap: r1(o.gap / Math.max(1, o.gapN)), boundaryMove: r3(o.bMove / n), built: r1(o.built / n), razed: r1(o.razed / n), offMiss: r3(1 - oh / Math.max(1, oc)),
    cut: { A: per(o.cutA, n), B: per(o.cutB, n) }, fort: { A: Object.assign(per(o.fortA, n), { earthWalls: r1(o.earthA / n) }), B: Object.assign(per(o.fortB, n), { earthWalls: r1(o.earthB / n) }) }, dealt: { A: r1(o.hitA / n), B: r1(o.hitB / n) },
    move: { A: mv(o.rxA, o.turnA, o.liveA), B: mv(o.rxB, o.turnB, o.liveB) }, ang: { A: angOf(o.angA, o.angB, n), B: angOf(o.angB, o.angA, n) }, ops: { A: opsOf(o.opA, n), B: opsOf(o.opB, n) }, bp: { A: bpOf(o.bpA, n), B: bpOf(o.bpB, n), names: per(o.bpName, n) }, spells: spells.slice(0, 10) };
}
// 대표 장면: 대마법사 전설 대 대가, 씨앗 1~9 가운데 많이 이긴 쪽이 이기고 길이가 가운데값에 가장 가까운 판
//   (기본) 운영 덱 → sandbox/scenes/v2-master-legend.json (v2.2) · fort: 진지 덱, 날기 끊기·진지·연쇄 → sandbox/scenes/v2-fort-legend.json (v2.3) · agile: 청사진 덱, 반사 겹·끊는 움직임·청사진, 매 걸음 녹화 → sandbox/scenes/v2-agile-legend.json (v2.4)
const SCENES = {
  legend: { file: 'v2-master-legend.json', name: '대마법사 전설 대 대가: 떠보기·들어가기·빠지기, 지형 (운영 덱, 200×150)', deck: '대마법사 운영' },
  agile: { file: 'v2-agile-legend.json', name: '대마법사 전설 대 대가: 반사 겹·끊는 움직임·청사진 (청사진 덱, 매 걸음 녹화, 200×150)', deck: '대마법사 청사진', rules: { flightCut: true, fort: true, trapChain: true, reflex: true, snap: true, blueprint: true }, recEvery: 1 },
  tactics: { file: 'v2-tactics-legend.json', name: '대마법사 결투장 전설 대 전설: 작전 겹·각도 판단 (청사진 덱, 200×150)', deck: '대마법사 청사진', rules: { flightCut: true, fort: true, trapChain: true, reflex: true, snap: true, blueprint: true, tactics: true }, sides: ['전설', '전설'] },
  fort: { file: 'v2-fort-legend.json', name: '대마법사 전설 대 대가: 날기 끊기와 진지 (진지 덱, 날기 끊기·진지·함정 연쇄, 200×150)', deck: '대마법사 진지', rules: { flightCut: true, fort: true, trapChain: true } },
};
function scene(kind) {
  const K = SCENES[kind || 'legend']; if (!K) throw new Error('없는 장면: ' + kind);
  const rs = []; for (let s = 1; s <= 9; s++) { const sc = { v: A.VERSION, name: K.name, seed: s, width: 200, height: 150 }; if (K.rules) sc.rules = K.rules; if (K.recEvery) sc.recEvery = K.recEvery; const sd = K.sides || ['전설', '대가']; sc.sides = sd.map((k, i) => ({ name: sd[0] === sd[1] ? k + ' ' + 'AB'[i] : k, mages: [{ tier: '대마법사', skill: k, deck: K.deck }] })); const r = A.runScene(sc); rs.push({ s, sc, w: r.winner, t: r.t }); }
  const cnt = {}; for (const r of rs) cnt[r.w] = (cnt[r.w] || 0) + 1; const w = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  const ts = rs.map(r => r.t).sort((a, b) => a - b), med = ts[ts.length >> 1], best = rs.filter(r => r.w === w).sort((a, b) => Math.abs(a.t - med) - Math.abs(b.t - med) || a.s - b.s)[0];
  best.sc.note = `대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 ${w}, ${cnt[w]}/9)이 이기고 길이(${best.t} s)가 가운데값(${med} s)에 가장 가까운 판`;
  fs.writeFileSync(path.join(__dirname, '..', 'sandbox', 'scenes', K.file), JSON.stringify(best.sc, null, 1) + '\n'); console.log(best.s, best.sc.note);
}
async function main() {
  if (process.argv[2] === 'scene') return scene(process.argv[3]);
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  const names = pos[0] && pos[0] !== 'all' ? pos[0].split(',') : Object.keys(PAIRS), N = +(pos[1] || 100), deck = opt('--deck') || '대마법사 성', tac = opt('--tac') ? JSON.parse(opt('--tac')) : undefined, tacA = opt('--tacA') ? JSON.parse(opt('--tacA')) : undefined, rules = opt('--rules') ? JSON.parse(opt('--rules')) : undefined, CH = 5;
  const { runJobs } = require('./par'), jobs = [], own = [];
  for (const nm of names) { if (!PAIRS[nm]) throw new Error('없는 대진: ' + nm); for (let f = 0; f < N; f += CH) { jobs.push({ mod: __filename, fn: 'run', args: [nm, f, Math.min(CH, N - f), deck, tac, rules, tacA] }); own.push(nm); } }
  const t0 = Date.now(), res = await runJobs(jobs), by = {}; res.forEach((r, i) => (by[own[i]] = by[own[i]] || []).push(r));
  const out = {}; for (const nm of names) { out[nm] = summarize(by[nm]); const s = out[nm];
    console.log(`${nm} 점수 ${s.score} · ${s.len} s · 거리 ${s.dist} m (±${s.distSD}, 흔들림 ${s.distJitter}) · 시전 ${s.castsPerS}/s · B칸 ${s.slotBPerGame}/판 · 헛손질 ${s.offMiss} · 경계 틈 ${s.gap} m, 이동 ${s.boundaryMove} m/s · 지형 ${s.built}/${s.razed} · 단계 ${JSON.stringify(s.phase)} · 입장 ${JSON.stringify(s.stance)}`);
    console.log('   칸 역할', JSON.stringify(s.roles));
    for (const ab of ['A', 'B']) console.log(`   ${ab} 끊기 ${JSON.stringify(s.cut[ab])} · 진지 ${JSON.stringify(s.fort[ab])}`);
    for (const ab of ['A', 'B']) { const q = s.move[ab]; console.log(`   ${ab} 움직임 전환 ${q.turnsPerS}/s · 반응 ${q.reactMs} ms (못 함 ${q.noReact}) · 빗나감 흔든 뒤 ${q.missAfterJuke} / 안 흔든 뒤 ${q.missNoJuke} · 판당 ${JSON.stringify(Object.fromEntries(Object.entries(q.raw).filter(([k]) => ['juke', 'stop', 'flip', 'dodge', 'missJ', 'lrtN', 'saw', 'bounce', 'flips'].includes(k)).map(([k, v]) => [k, r1(v / s.games)])))} · 청사진 ${JSON.stringify(s.bp[ab])}`); }
    if (Object.keys(s.bp.names).length) console.log('   청사진', JSON.stringify(s.bp.names));
    for (const ab of ['A', 'B']) console.log(`   ${ab} 각도 ${JSON.stringify(s.ang[ab])} · 작전 ${JSON.stringify(s.ops[ab])}`); console.log('   마법', s.spells.slice(0, 7).map(x => `${x.spell} ${(x.share * 100).toFixed(0)}%·명중 ${(x.hit * 100).toFixed(0)}%`).join(', ')); }
  process.stderr.write(`${jobs.length} 일감 ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
  const sv = opt('--save'); if (sv) { fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'results', `master-${sv}.json`), JSON.stringify({ v: A.VERSION, date: new Date().toISOString().slice(0, 10), deck, tac: tac || null, N, result: out }, null, 1) + '\n'); }
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { run, boundary, PAIRS };
