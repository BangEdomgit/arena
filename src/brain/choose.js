'use strict';
/* 숨 결투장 — 두뇌 4: 고르기 (반사·캔슬·칸·휴식, 마법의 값, 시전 걸기)
 * 차례: 규칙의 반사(react: 자동 진)와 캔슬(cancel) → 기술의 캔슬·속임수 → 칸 → 휴식(rest 훅) → 박자·동시 착탄 기다리기 → 준비(prep 훅) → 마법마다 값 → 고르기.
 * 마법 하나의 값은 틀마다 매긴 뒤(규칙의 새 틀은 brainTypes) 정해진 차례로 고친다: value 훅 → 콤보 → valueRisk 훅 → 동시 착탄 → 걷어내기 → 몰이 → 미끼 →
 * 학습 → 덱 읽기 → 돌파 → valueMid 훅 → 뭉친 곳 → (내 둘레 지연 폭발은 버림) → 피로 → valueLate 훅 → 두 번째 칸 → 몰아치기.
 * 값을 매기는 동안의 것은 사람마다 하나인 후보 틀 K.o에 담는다(새로 만들지 않는다). 쓸 만하면 후보 모음(K.pool)에 옮긴다 */
const { C, hyp, NOKIND, NONE, OFF, SELF_GAP, isSetup, logDec, estDmg, castTime, landDelay, bigAttack, defenseDown, circOf } = require('./util');
const { types } = require('./hooks');
const combo = require('./techniques/combo'), cancel = require('./techniques/cancel'), feint = require('./techniques/feint'), simul = require('./techniques/simul');
const tempo = require('./techniques/tempo'), bait = require('./techniques/bait'), learn = require('./techniques/learn'), counter = require('./techniques/counter');
const cover = require('./techniques/cover'), herd = require('./techniques/herd'), crowd = require('./techniques/crowd');
const swarm = require('./techniques/swarm'), siege = require('./techniques/siege');
const rhythm = require('./techniques/rhythm'), efficacy = require('./techniques/efficacy'), shape = require('./techniques/shape');

function decide(W, m, K) {
  const { S, T, rest, e, De, d, eDown, aimed, threat } = K, bh = W._bh;
  let empty = false; for (let i = 0; i < bh.empty.length; i++) if (bh.empty[i](W, m, K)) empty = true;   // 빈손 (rules/risk): 첫 칸과 자동 진을 못 쓴다 (두 번째 칸은 쓸 수 있다)
  const circ = circOf(W, m);
  if (empty && !(T.grab && circ >= 2 && !m.castB)) { m.relT = null; return; }
  // 방패 아끼기 (상급): 큰 공격에만 막는다. 앞 방패·벽은 투사체·실만 막는다
  const bigThreat = !!threat && (!T.shieldSave || (bigAttack(threat, S) && (threat.s.t === 'proj' || threat.s.t === 'thread')));
  K.empty = empty; K.circ = circ; K.bigThreat = bigThreat;
  let h = bh.react; for (let i = 0; i < h.length; i++) h[i](W, m, K);    // 자동 진 (rules/multiSlot)
  h = bh.cancel; for (let i = 0; i < h.length; i++) h[i](W, m, K);       // 짝에 맞춰 모으던 큰 수 (rules/risk)
  cancel.opportunity(W, m, K);   // 기회 캔슬 (대가)
  cancel.onDodge(W, m, K);       // 캔슬 (상급)
  combo.drop(W, m, K);           // 묶기가 빗나갔다: 계획을 버린다
  feint.react(W, m, K);          // 속임수 (전설)

  // ---- 칸 고르기 ----
  let slot = 'A';
  if (m.cast || m.chan) { if (circ >= 2 && !m.castB && T.slotB) slot = 'B'; else return; }   // 두 번째 칸은 대가부터 (기본은 씀)
  if (empty) slot = 'B';
  K.slot = slot;

  // ---- 휴식: 머리가 뜨거우면 위협이 없을 때 쉰다. 규칙이 고친다(파도의 부류, rules/wave) ----
  // 방어 간격 세기 (대가): 과녁의 방어 마법이 모두 간격 중이면(자동 진도) 칠 때다. 쉬지 않고, 공격 가치 × 1.4
  const defDown = T.cdRead && defenseDown(e, S, W);
  let restNow = W.rules.fatigue && m.fat > rest && !aimed && d > 4 && !defDown;
  h = bh.rest; for (let i = 0; i < h.length; i++) restNow = h[i](W, m, K, restNow);
  if (restNow) { m.log.dec.rest++; m.relT = null; return; }

  if (tempo.pause(W, m)) return;       // 쏜 뒤 멈춤 (초보)
  if (simul.wait(W, m, K)) return;     // 동시 착탄 (대가): 묶기가 결정타 직전에 떨어지게 기다린다
  if (tempo.hold(W, m, K)) return;     // 박자 흔들기 (상급)
  K.defDown = defDown; K.plan = combo.planOf(W, m, K);   // 두 수 콤보 계획 (상급)
  // ---- 마법 고르기 ----
  K.lead = T.lead; K.cb = T.combo; K.down0 = K.cb && eDown;
  K.ek = T.counter ? De.kinds : NOKIND;
  learn.prep(W, m, K);
  efficacy.prep(W, m, K);   // 마법마다의 효과 (대가부터, v2.2)
  K.bigs = NONE; K.ctOf = null; K.pinNow = false; K.holds = NONE; K.pinBy = 0;
  h = bh.prep; for (let i = 0; i < h.length; i++) h[i](W, m, K);   // 몸 묶기 계획 (rules/control)
  // 후보 객체는 사람마다 모아 두고 다시 쓴다(쓰레기 줄이기). 이번 판단 밖으로 나가지 않는다
  const cand = m._cand || (m._cand = []), pool = m._pool || (m._pool = []); cand.length = 0;
  K.cand = cand; K.pool = pool;
  const Dm = K.Dm; for (let bi = 0; bi < Dm.sp.length; bi++) valueSpell(W, m, K, bi);
  commit(W, m, K);
}
// 틀마다 값과 겨냥
function valueForm(W, m, K, o) {
  const { T, e, Dm, d } = K, s = o.s, Tw = o.Tw, R = o.R, he = o.he, down = o.down;
  let v = 0, tx = e.x, ty = e.y;
  switch (s.t) {
    case 'proj': if (d < (s.home ? 12 : R) && (K.los || s.home)) { const tof = d / s.v; tx = e.x + e.vx * (Tw + tof) * 0.8 * K.lead; ty = e.y + e.vy * (Tw + tof) * 0.8 * K.lead; v = he * estDmg(s) * (down ? 1.6 : 1) / (Tw + 0.3); } break;
    case 'lob': if (d < R) { tx = e.x + e.vx * s.flight * 0.7 * K.lead; ty = e.y + e.vy * s.flight * 0.7 * K.lead; v = he * s.dmg * (down ? 2 : 1) / (Tw + 0.3) + (K.los ? 0 : 0.3); } break;
    case 'thread': if (d < R && K.los) { const tt = Tw + d / (32 * (s.fast || 1)); tx = e.x + e.vx * tt * 0.6 * K.lead; ty = e.y + e.vy * tt * 0.6 * K.lead; v = he * estDmg(s) * (K.cb && e.st.wet > 0 ? 1.5 : 1) * (down ? 1.8 : 1) / (tt + 0.3); } break;
    case 'area': if (d < R) { tx = e.x + e.vx * s.delay * 0.5 * K.lead; ty = e.y + e.vy * s.delay * 0.5 * K.lead; v = he * s.dmg * (down ? 2 : 1) / (Tw + s.delay * 0.3 + 0.3); } break;
    case 'touch': if (d < 1.3) v = 1.5 * s.dmg / (Tw + 0.3); break;
    case 'cone': if (d < s.L * C.sizeOf(m, s)) v = he * s.dps * s.dur / (Tw + 0.3) * (K.cb && s.wet && !(e.st.wet > 0) && Dm.threadTouch ? 1.5 : 1); break;
    case 'zone': {
      const k = s.z.k;
      if ((k === 'fire' || k === 'nh3' || k === 'spore') && d < 9) { v = (K.vt > 1.2 ? 0.55 : 0.2) + T.zoneBias; tx = (m.x + e.x) / 2; ty = (m.y + e.y) / 2; }
      if (k === 'smoke') { if (K.aimed) v = 0.6 + T.zoneBias; tx = m.x + K.ux; ty = m.y + K.uy; }
      if ((k === 'mist' || k === 'absorb') && d < 7 && K.De.fireThread) { v = 0.4 + T.zoneBias; tx = m.x + K.ux * 2; ty = m.y + K.uy * 2; }
      if (k === 'ice' && d < 8) v = (K.vt > 1.2 ? 0.6 : 0.3) + T.zoneBias;
      if (k === 'acid' && d < R) v = 0.35 + (W.walls.some(w => w.own !== m.side && hyp(w.x - e.x, w.y - e.y) < 3) ? 0.6 : 0) + T.zoneBias;
      if (k === 'rain') { const need = m.st.burn > 0 || K.blindR || W.proj.some(p => p.src.side !== m.side && (p.home || p.s.n === '불덩이') && hyp(p.x - m.x, p.y - m.y) < 4) || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3.5); v = need ? 1.1 : 0; tx = m.x; ty = m.y; }
      break;
    }
    case 'wall':
      if (K.aimed && K.threat && K.bigThreat && (K.threat.s.t === 'proj' || K.threat.s.t === 'thread') && Tw < K.threat.T - K.threat.t) v = 1.0;
      else if (K.los && d > 6 && !W.walls.some(w => w.own === m.side && hyp(w.x - m.x, w.y - m.y) < 3)) v = 0.3;
      if (K.stance === 'kite' && d < 9) v = Math.max(v, 0.7);
      break;
    case 'buff':
      if (s.react && K.aimed && K.threat && K.bigThreat && K.threat.T - K.threat.t < 0.35) v = 1.1;
      if (T.shieldAny && (s.react || s.b.front) && !m.buf.front) v = Math.max(v, 0.35);   // 초보: 방패는 아무 때나
      if (s.b.bluntRes && !m.buf.bluntRes && K.De.bluntHit) v = 0.35;
      if (s.b.elecRes && !s.react && K.aimed && !m.buf.elecRes) v = 1.0;
      if (s.b.toxRes && !m.buf.toxRes && W.zones.some(z => z.src.side !== m.side && ['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3)) v = 0.9;
      if (s.b.speed && !m.buf.speed && (d > K.prefR + 4 || K.dodge || K.stance === 'breakout')) v = K.stance === 'breakout' ? 1.3 : 0.45;
      break;
    case 'move':
      if (K.stance === 'breakout') { v = 1.6; tx = m.x + K.escape.dir.dx * 6; ty = m.y + K.escape.dir.dy * 6; }
      else if (d > K.prefR + 5) v = 0.45;
      if (s.mv === 'glide' && K.aimed && m.rollCd > 0) { v = 0.8; const sg = W.rng() < 0.5 ? 1 : -1; tx = m.x - K.uy * 5 * sg; ty = m.y + K.ux * 5 * sg; }
      if (s.mv === 'vault' && !K.los && W.obs.some(b => hyp(b.x - m.x, b.y - m.y) < 2.5)) v = Math.max(v, 0.45);
      break;
    case 'trap':
      if (W.traps.filter(t => t.src === m).length < C.trapCap(W, m)) { v = 0.15 + T.trapBias; if (T.pathTrap && K.vt > 1.2 && d < 10) { v += 0.35; tx = e.x + e.vx; ty = e.y + e.vy; } else { tx = m.x + K.ux * 2; ty = m.y + K.uy * 2; } }
      break;
    case 'ring': if (W.proj.some(p => p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < 3.5)) v = 1.2; else if (d < 2.5) v = 0.5; if (m.st.mycel > 0.5) v = Math.max(v, 0.9); break;   // 제 몸의 균사를 태운다
    case 'shoot': { const n2 = W.proj.filter(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r).length; v = n2 ? 0.9 + n2 * 0.2 : 0; break; }
    case 'smother': { const need = m.st.burn > 0 || K.blindR || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3) || W.proj.some(p => p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < 3); v = need ? 1.1 : 0; break; }
    default: { const f = types()[s.t]; if (f) { f(W, m, K, o); v = o.v; } }   // 규칙 모듈의 틀 (도발…)
  }
  o.v = v; o.tx = tx; o.ty = ty;
}
// 돌파 중이면 길을 막은 자를 친다
function breakout(W, m, K, o) { const s = o.s; if (K.escape && K.escape.bl.length && o.isOff) { const b = K.escape.bl[0], db = hyp(b.x - m.x, b.y - m.y); if (db < (o.R || 10) && (s.t !== 'thread' || !C.blocked(W, m.x, m.y, b.x, b.y))) { o.tx = b.x; o.ty = b.y; o.v = Math.max(o.v, 0.8) * 1.8; } } }
// 틀마다 매긴 값을 고치는 차례. 사람마다 한 번 만든다(성향 tac은 판 중에 바뀌지 않는다): 꺼진 기술은 부르지 않는다(속도).
// 기술은 제 스위치가 꺼져 있으면 아무것도 안 하니, 빼도 결과는 같다
function pipeOf(W, m) {
  const T = m.tac, bh = W._bh, P = [];
  P.push(...bh.value);                    // 몸 묶기 (rules/control)
  if (T.combo2) P.push(combo.value);      // 두 수 콤보 계획
  P.push(...bh.valueRisk);                // 큰 수·짝 묶기·피할 자리 겨냥·붙잡기 (rules/risk)
  if (T.simul) P.push(simul.value);       // 동시 착탄
  if (T.strip) P.push(cover.strip);       // 엄폐 걷어내기 (대가)
  if (T.herd) P.push(herd.value);         // 몰이 (대가)
  if (T.bait) P.push(bait.value);         // 방어 미끼 (전설)
  if (T.learn) P.push(learn.value);       // 학습한 구르는 쪽·방패 거리 (전설)
  if (T.counter) P.push(counter.value);   // 덱 읽기 (전설)
  P.push(breakout);                       // 돌파 중이면 길을 막은 자를 친다
  P.push(...bh.valueMid);                 // 지렛대: 적이 화약통 옆에 섰다 (rules/barrels)
  if (T.crowd) P.push(crowd.value);       // 여럿이 뭉친 곳
  if (T.swarm) P.push(swarm.value);       // 무리: 눈먼 틈의 무거운 수, 벽 뒤엔 곡사 (v2.0 둘째)
  if (T.siege) P.push(siege.value);       // 성: 벽 세우기·벽 밀기·벽 없애기 (v2.0 둘째)
  if (T.rhythm) P.push(rhythm.value);     // 리듬: 떠보기엔 가볍게, 빠지기엔 방어 (v2.2)
  if (T.efficacy || T.buffNeed) P.push(efficacy.value);   // 효과 학습(대가), 강화의 때(상급) (v2.2)
  if (T.shape || T.roles) P.push(shape.value);   // 지형 설계·칸의 역할 (대가, v2.2)
  return P;
}
// 마법 하나의 값. 쓸 만하면 후보에 넣는다
function valueSpell(W, m, K, bi) {
  const { T, e, Dm, d, slot } = K, bh = W._bh;   // 드물게 쓰는 값은 쓸 때 K에서 읽는다
  const n = Dm.nm[bi], s = Dm.sp[bi], mastN = Dm.mast[bi], isOff = Dm.off[bi];
  if (slot === 'B' && (s.t === 'cone' || s.t === 'move' || (m.cast && m.cast.s.n === n) || (isOff && !T.slotBOff && !K.pressB))) return;   // slotBOff가 꺼지면 두 번째 칸엔 공격을 겹치지 않는다(묶기·준비 수는 된다, v2.0)
  if ((m.cd[n] || 0) > 0) return;
  const cost = s.cost * (1 - 0.25 * mastN) * (slot === 'B' ? 1.3 : 1); if (m.glu < cost) return;
  const Tw = s.cast * (1 - 0.35 * mastN);
  const o = K.o;
  o.s = s; o.n = n; o.bi = bi; o.isOff = isOff; o.cost = cost; o.he = Dm.he[bi]; o.Tw = Tw; o.R = Dm.R[bi]; o.v = 0; o.tx = e.x; o.ty = e.y; o.barrel = false; o.pin = false;
  // 콤보의 때 (상급): 남은 묶임 안에 닿는 마법만 묶인 적 보정을 받는다. 중급은 보이는 대로 잇는다
  o.down = K.down0 && (!T.combo2 || Math.max(e.st.root || 0, e.st.stun || 0) > Tw + landDelay(s, d));
  valueForm(W, m, K, o);
  const P = K.pipe || (K.pipe = pipeOf(W, m)); for (let i = 0; i < P.length; i++) P[i](W, m, K, o);   // 값 고치기: 규칙의 훅과 켜진 기술 (pipeOf의 차례)
  // 지연 폭발은 쏜 사람도 맞힌다: 떨어질 자리가 내 둘레면 쓰지 않는다 (v1.0.1)
  if (s.t === 'area' && hyp(o.tx - m.x, o.ty - m.y) < s.r * C.sizeOf(m, s) + SELF_GAP) return;
  if (W.rules.fatigue && !s.react && !m.wave) o.v -= m.fat / 100 * 0.5;
  const h = bh.valueLate; for (let i = 0; i < h.length; i++) h[i](W, m, K, o);        // 파도 위에선 막기보다 친다 (rules/wave)
  if (slot === 'B') o.v -= 0.1;
  if (isOff) o.v *= K.aggr * (K.defDown ? 1.4 : 1);
  const v = o.v;
  if (v > 0.15) { const tx = o.tx, ty = o.ty, barrel = o.barrel, down = o.down, pin = o.pin; let c = K.pool[K.cand.length]; if (!c) c = K.pool[K.cand.length] = { s, n, v, tx, ty, Tw, cost, barrel, down, pin, v2: undefined }; else { c.s = s; c.n = n; c.v = v; c.tx = tx; c.ty = ty; c.Tw = Tw; c.cost = cost; c.barrel = barrel; c.down = down; c.pin = pin; c.v2 = undefined; } K.cand.push(c); }
}
// 후보 중 고르고 시전을 건다
function commit(W, m, K) {
  const { T, e, d, vt, eDown, aimed, slot, cand } = K;
  if (!cand.length) { m.relT = null; return; }   // 쏠 게 없으면 빈틈이 아니다
  // 가치 내림차순. 짧은 배열이라 삽입 정렬(안정 정렬이라 Array.sort와 같은 차례, 비교 함수를 만들지 않는다)
  for (let i = 1; i < cand.length; i++) { const x = cand[i]; let j = i - 1; while (j >= 0 && cand[j].v < x.v) { cand[j + 1] = cand[j]; j--; } cand[j + 1] = x; }
  // 장악권은 비싸니 상위 넷만 따진다
  let best = null;
  for (let i = 0; i < Math.min(4, cand.length); i++) {
    const c = cand[i]; let v = c.v;
    if (W.rules.domain && !c.barrel && !c.s.mundane) v *= C.gAt(W, m, c.s, c.tx, c.ty);
    if (!best || v > best.v2) { best = c; best.v2 = v; }
  }
  if (!best || best.v2 <= 0.15) { m.relT = null; return; }
  if (slot === 'B' && T.plan && best.v2 < T.slotBMin) return;   // 기술이 있는 사람은 두 번째 칸을 값진 수에만 쓴다 (문턱은 판단 수준마다, v2.0)
  K.best = best;
  bait.start(W, m, K);                    // 방어 미끼 시작 (전설)
  simul.start(W, m, K);                   // 동시 착탄 시작 (대가)
  const fe = feint.start(W, m, K);        // 속임수 시작 (전설)
  best = K.best;
  const s = best.s;
  let Tc = castTime(W, m, best.Tw);
  if (s.t === 'thread') Tc += Math.min(hyp(best.tx - m.x, best.ty - m.y), C.rangeOf(m, s)) / (32 * (s.fast || 1));
  const ns = m.noise * hyp(best.tx - m.x, best.ty - m.y) * (m.st.blind > 0 ? 3 : 1);
  m.glu -= best.cost; m.cd[best.n] = s.cd;
  const plan = K.plan, cast = { s, tgt: e, tx: best.tx + W.rnd(-ns, ns), ty: best.ty + W.rnd(-ns, ns), t: 0, T: Tc, B: slot === 'B', feint: fe, cost: best.cost, bait: m.baitT === W.t, roll0: e.roll > 0, down: !!(best.down || best.pin), fin: plan && s.n === plan.fin ? plan.land + 0.1 : 0 };
  if (slot === 'B') m.castB = cast; else m.cast = cast;
  // 행동 지표: 시작 시각, 빈틈, 콤보 시도
  m.log.starts.push(W.t); if (m.relT != null) { if (slot === 'A') { m.log.gapSum += W.t - m.relT; m.log.gapN++; if (m.log.gaps.length < 400) m.log.gaps.push(W.t - m.relT); } m.relT = null; }
  combo.tried(W, m, K, best, Tc);
  const h = W._bh.commit; for (let i = 0; i < h.length; i++) h[i](W, m, K, best, cast, Tc);   // 붙잡기 시도 (rules/control), 붙잡기·짝 묶기 (rules/risk)
  simul.fired(W, m, K, s, Tc);
  herd.commit(W, m, K, s);
  combo.plan(W, m, K, s, Tc);
  logDec(m, s, slot, { aimed, combo: eDown || (m.last && W.t - m.lastT < 1.5 && isSetup(K.S[m.last])), path: s.t === 'trap' && vt > 1.2 && d < 10, barrel: best.barrel });
  m.last = s.n; m.lastT = W.t;
}
module.exports = { decide, valueSpell, commit };
