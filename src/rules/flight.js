'use strict';
/* 규칙: 비행 (rules.flight, v2.0 기본 켬, SPEC 24장, 수는 data/rules/flight.json) — 대마법사는 걷지 않는다
 * 높이 하나를 더한 2.5차원. 출력 P = 2 kW × C^2.5 × 피로 배수, 75 kW 이상(상위부터)이 뜬다.
 * 드는 힘: 떠 있기 150 kW/(1 + (v/20)²) × 오르내림 몫, 앞으로 0.135·v³, 오르기 80·g·vz. 부하 L = 든 힘 / P.
 * 떠 있으면(z ≥ 1): 서클 − 1(60 m/s 넘으면 공기막으로 − 1 더), 위력 × 0.8 × clamp(1.15 − 0.6L, 0.5, 1), 흔들림 × (1 + L), 머리 피로 초당 1 + 6L (+ 40(L − 1)),
 *   안 보이는 발밑 공격·함정·지대·빙판 면역, 번개 × 1.3, 보이는 구름 × 1.3. z > 2면 바위·벽을 넘고 가리지도 않는다(core).
 * 움직임: 앞 가속 3 g와 남는 힘, 옆 가속 min(5 g, k·v²)(코너 속도 ≈ 25 m/s), 오르내림 8 m/s, 높이는 속도의 저금통. 날다 굳으면 떨어진다(높이 × 4, 1 s 굳음).
 * 두뇌: 판단할 때마다 목표 속도(fv)·높이(fz)·뜨기(flyWant)를 고른다. 판단 수준은 tac.flySkill (1 초보 … 5 전설)
 * 날기 끊기 (v2.3, rules.flightCut, SPEC 27장, 수는 flight.json의 cut): 두뇌가 m.cut.w로 청하면 걸음에서 한다(굳음·묶임이면 못 한다, 간격 0.6 s, 머리 피로 1.5)
 *   급정지(1): 거꾸로 뿜어 5 g로 멈춘다 · 옆 튀기(2): 0.25 s 동안 옆으로 5 g (속도와 상관없이, 날며 꺾는 옆 가속은 v²에 묶인다) · 튀어오르기(3): 0.3 s 동안 위로 3 g (땅에서도)
 *   떨어지기(4): 뜨는 힘을 끊고 중력으로 · 내리꽂기(5): 아래로 4 g를 더 뿜는다. 끊은 동안(fly 3)은 비행에 묶였던 서클 하나·출력(위력 × 0.8 · 부하)·흔들림이 풀린다: 내려앉으며 치기 (풀리는 순간 끊는다)
 *   공기 쿠션: 떨어지는 중 cut.z 높이에 닿으면 위로 5 g(알짜 4 g)를 뿜어 2 m/s로 늦춘다. 뜨고 싶으면 그 자리에서 다시 난다(받아 잡기).
 *     4 m/s 넘게 땅에 닿으면 추락: 피해 = 닿는 속도의 높이(v²/2g) × 4 (그냥 떨어지면 높이 × 4), 1 s 굳음. 날다 굳어 떨어진 사람(fly 2)도 굳음이 풀리면 쿠션을 뿜을 수 있다 */
const { pow, hyp, clamp } = require('../math');
const F = require('../../data/rules/flight.json');
const { saltR } = require('./saltRing').api, SR = require('./saltRing').api;
const { aOf } = require('./snap').api;   // 끊는 움직임 (v2.4): 옆·오르내림 가속의 바닥
const G = F.g, M = F.mass, OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, CU = F.cut;
// 출력 (W). C^2.5는 선명도마다 한 번
function outP(m) { if (m._flC !== m.C) { m._flC = m.C; m._flP = F.P0 * pow(Math.max(m.C, 0.01), F.Pk); } return m._flP * Math.max(0.6, 1 - Math.min(m.fat, 100) / 200); }
const canFly = m => outP(m) >= F.minP;
// 싸움터 끝·소금 선까지 지금 방향으로 남은 거리 (브레이크를 잡을 거리)
function room(W, m, ux, uy) {
  let t = 1e9;
  if (ux > 0) t = Math.min(t, (W.width - m.x) / ux); else if (ux < 0) t = Math.min(t, m.x / -ux);
  if (uy > 0) t = Math.min(t, (W.height - m.y) / uy); else if (uy < 0) t = Math.min(t, m.y / -uy);
  if (W.rules.saltRing) { const R = saltR(W), px = m.x - W.width / 2, py = m.y - W.height / 2, b = px * ux + py * uy, c = px * px + py * py - R * R, q = b * b - c;
    if (c < 0 && q >= 0) t = Math.min(t, -b + Math.sqrt(q)); }
  return t;
}
// 떨어지기 시작
function fall(m) { m.fly = 2; m.fallZ = m.z; if (m.vz > 0) m.vz = 0; }
// 끊기 시작 (v2.3): 두뇌가 청한 것(cut.w)을 한다. 굳음·묶임·간격 중이거나 뜰 힘이 없으면 못 한다
function cutStart(W, m) {
  const k = m.cut.w; m.cut.w = 0;
  if (m.cut.cd > 0 || m.st.stun > 0 || m.st.root > 0 || !canFly(m) || m.cut.k) return;
  const v = hyp(m.vx, m.vy), lg = m.flog;
  if (k === 3) { if (m.fly > 1) return; if (m.fly === 0) { m.fly = 1; m.vz = 0; m._flT0 = W.t; } m.cut.k = 3; m.cut.t = CU.hopT; lg.hop++; }   // 튀어오르기 (땅에서도)
  else if (m.fly !== 1) return;
  else if (k === 1) { if (v < 2) return; m.cut.k = 1; m.cut.t = Math.min(0.6, v / (CU.brake * G)); lg.brake++; }
  else if (k === 2) { m.cut.k = 2; m.cut.t = CU.sideT; lg.side++; }
  else if (k === 4 || k === 5) { if (m.z < CU.minZ) return; m.fly = 3; m.cut.k = k; m.cut.z0 = m.z; m.load = 0; m.cut.on = false; if (m.vz > 0) m.vz = 0; if (k === 5) lg.dive++; else lg.drop++; }
  else return;
  lg.cut++; m.cut.cd = CU.cd;
  if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + CU.fat);
}
// 떨어지기·내리꽂기 (fly 3): 중력(+ 아래로 뿜기), 공기 쿠션, 받아 잡기, 닿기
function dropStep(W, m, hurt) {
  if (m.st.stun > 0) m.cut.on = false;
  else if (!m.cut.on && m.cut.z >= 0 && m.z <= m.cut.z) { m.cut.on = true; m.flog.cush++; if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + CU.fat); }
  if (m.cut.on) {
    if (m.vz < -CU.soft) { m.vz += (CU.cush - 1) * G * W.dt; if (m.vz > -CU.soft) m.vz = -CU.soft; }
    else if (m.flyWant && m.z >= 0.5 && canFly(m)) { m.fly = 1; m.cut.k = 0; m.cut.z = -1; m.cut.on = false; m.vz = -CU.soft; return; }   // 받아 잡기: 그 높이에서 다시 난다
    else m.vz = -CU.soft;
  } else m.vz -= (m.cut.k === 5 ? 1 + CU.dive : 1) * G * W.dt;
  m.z += m.vz * W.dt; m.flog.dz -= m.vz * W.dt; const k = 1 - 0.3 * W.dt; m.vx *= k; m.vy *= k; edge(W, m);
  if (m.z <= 0) {
    const v = -m.vz; m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; m.cut.k = 0; m.cut.z = -1; m.cut.on = false;
    if (v > CU.safeV) { m.flog.crash++; m.flog.falls++; hurt(W, m, v * v / (2 * G) * F.fall, null, '추락', 'fall'); m.st.stun = Math.max(m.st.stun, F.fallStun); m.cast = m.castB = m.chan = null; }   // 쿠션을 못 뿜었다
  }
}
// 날기 끊기의 판단 (v2.3, 27장). lv = tac.flyCut: 1 상급(위협에 맞춰 뜨고 내려앉기: 발밑을 노리는 수에 튀어오르기),
// 2 대가(급정지·떨어지기·옆 튀기로 공중 회피, 공기 쿠션), 3 전설(+ 쏘는 순간 높이 속이기, 내려앉으며 치기). 뜨기·높이는 CB로 돌려준다
const CB = { want: false, fz: 0 }, CBR = CU.brain;
const GROUND = s => s.t === 'trap' || (s.t === 'area' && !s.vis) || (s.t === 'zone' && s.z && (s.z.k === 'ice' || s.z.k === 'fire' || s.z.k === 'acid' || s.z.k === 'spore' || s.z.k === 'nh3'));
// 공기 쿠션을 뿜을 높이: 지금 아래로 v, 높이 z에서 아래로 ad로 떨어지다 위로 ac로 늦추면 h = (v² + 2·ad·z) / (2(ac + ad))에서 뿜어야 땅에서 멈춘다
function cushAt(z, vd, dive, lv) { const ad = (dive ? 1 + CU.dive : 1) * G, ac = (CU.cush - 1) * G; return (vd * vd + 2 * ad * z) / (2 * (ac + ad)) + CBR.margin[lv]; }
const cushH = (m, lv) => cushAt(m.z, m.vz < 0 ? -m.vz : 0, m.cut.k === 5 && !m.cut.on, lv);
// 적의 대공 지대(하늘 덮개, rules/fort)가 나나 과녁 위에 있나: 그 아래로는 내리꽂지 않는다 (굳으면 쿠션을 못 뿜는다)
function antiAir(W, m, e) { for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && (hyp(z.x - e.x, z.y - e.y) < z.r + 2 || hyp(z.x - m.x, z.y - m.y) < z.r + 2)) return true;
  return false; }
function cutBrain(W, m, K, lv) {
  const T = m.tac, e = K.e;
  // 쿠션 높이: 떨어지는 중이면 판단 때마다 다시 잰다(대가부터). 회피로 떨어졌으면 3.5 m 아래에서 받아 잡는다
  if (lv >= 2 && (m.fly === 3 || (m.fly === 2 && !(m.st.stun > 0)))) { let h = cushH(m, lv); if (m.fly === 3) { const c = m.cut.z0 - (m.cut.k === 4 ? CBR.catchS : CBR.catch); if (c > h) h = c;
      } m.cut.z = h; }
  if (m.cut.cd > 0 || m.cut.k || m.fly > 1 || m.st.stun > 0 || m.st.root > 0) return;
  const read = T.readCast && !K.blindR;
  // 상급부터: 땅에서 발밑·함정·지대로 나를 노리는 수가 곧 풀리면 튀어오른다
  if (m.fly === 0) {
    if (!read) return;
    for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (c && !c.unseen && c.tgt === m && GROUND(c.s) && c.T - c.t < CBR.hopRead) { m.cut.w = 3; CB.want = true;
        if (CB.fz < F.brain.zLow) CB.fz = F.brain.zLow; return; } }
    return;
  }
  if (lv < 2) return;
  // 대가부터: 공중 회피. 날아오는 투사체(0.45 s 안에 1.2 m 안으로, 높이 차 1.2 m 안), 떨어질 보이는 구름.
  // 전설(높이 속이기): 투사체는 풀리는 순간 내 높이로 겨눠진다 — 그동안 높이를 지키다 풀린 뒤 일찍(0.8 s 안) 위·아래로 바꾼다. 실은 풀리는 순간의 내 높이를 따라오니 옆으로 (풀리기 0.25 s 전)
  let tx = 0, ty = 0, how = 0; const v = hyp(m.vx, m.vy), tca = lv >= 3 && T.flyFeint !== false ? CBR.tcaL : CBR.tca;
  for (const p of W.proj) {
    if (p.src.side === m.side) continue;
    const rx = m.x - p.x, ry = m.y - p.y, rvx = m.vx - p.vx, rvy = m.vy - p.vy, vv = rvx * rvx + rvy * rvy; if (vv < 1) continue;
    const t = -(rx * rvx + ry * rvy) / vv; if (t < 0 || t > tca) continue;
    if (hyp(rx + rvx * t, ry + rvy * t) > CBR.miss || Math.abs(p.z + (p.vz || 0) * t - m.z) > 1.2) continue;
    tx = p.vx; ty = p.vy; how = 1; break;
  }
  if (!how) for (const a of W.areas) { if (a.src.side === m.side || !a.vis || a.t > CBR.tca) continue; const px = m.x + m.vx * a.t - a.x, py = m.y + m.vy * a.t - a.y;
    if (hyp(px, py) < a.r + 0.5) { tx = -py; ty = px; how = 2; break; } }   // 구름: 가운데에서 먼 쪽으로
  if (!how && lv >= 3 && T.flyFeint !== false && read) for (const q of K.foes) { const c = q.cast;
    if (c && c.tgt === m && (c.s.t === 'thread' || c.s.t === 'touch') && c.T - c.t < CBR.release) { tx = m.x - q.x; ty = m.y - q.y; how = 3; if (m._feC !== c) { m._feC = c; m.flog.hfeint++; } break;
      } }   // 실: 풀리기 직전 옆으로
  if (how) {
    if (how === 1 && lv >= 3 && T.flyFeint !== false) { if (m.z >= 5) { m.cut.w = 5; const h = cushAt(m.z, 0, true, lv), c = m.z - CBR.catch; m.cut.z = h > c ? h : c; } else m.cut.w = 3;
      m.flog.hfeint++; }   // 높이 속이기: 겨눠진 높이에서 벗어난다
    else if (how === 1 && m.z >= 5) { m.cut.w = 5; const h = cushAt(m.z, 0, true, lv), c = m.z - CBR.catch; m.cut.z = h > c ? h : c; }   // 높으면 내리꽂았다 받아 잡는다
    else if (how === 1 && v > 15) m.cut.w = 1;                                                        // 빠르면 급정지 (앞길 겨냥이 빗나간다)
    else {   // 옆 튀기 (가던 쪽에 가까운 옆)
      const l = hyp(tx, ty) || 1; let sx = -ty / l, sy = tx / l; if (how === 2) { sx = tx / l; sy = ty / l; } else if (sx * m.vx + sy * m.vy < 0) { sx = -sx; sy = -sy; }
      if (W.rules.saltRing && SR.safeOn(m)) { const k = CU.side * G * CU.sideT * CU.sideT / 2 + 0.3; if (!SR.safeAt(W, m.x + sx * k + m.vx * CU.sideT, m.y + sy * k + m.vy * CU.sideT)) { sx = -sx;
          sy = -sy; if (!SR.safeAt(W, m.x + sx * k + m.vx * CU.sideT, m.y + sy * k + m.vy * CU.sideT)) return; } }   // 소금 원 밖으로 튀지 않는다 (v2.6)
      m.cut.x = sx; m.cut.y = sy; m.cut.w = 2;
    }
    return;
  }
  // 전설: 내려앉으며 치기. 내 공격이 곧(0.25 s 안) 풀리면 뜨는 힘을 끊는다: 풀리는 순간 비행에 묶였던 서클·출력(위력 × 0.8 · 부하)이 풀린다. 2 m 떨어진 뒤 받아 잡는다 (2 s에 한 번, 적의 덮개 밑은 빼고)
  const c = m.cast;
  if (lv >= 3 && T.flyStrike !== false && c && OFF[c.s.t] && !c.auto && c.T - c.t < CBR.strikeT && m.z >= CBR.strikeZ && W.t - m.cut.nT > CBR.again && !K.aimed && !(e.cast && e.cast.tgt === m) && !antiAir(W, m, e)) {   // 나를 겨눈 수가 없을 때만 (끊은 동안은 옆 튀기를 못 하고, 굳으면 쿠션을 못 뿜는다)
    m.cut.w = 4; const h = cushAt(m.z, 0, false, lv), k = m.z - CBR.catchS; m.cut.z = h > k ? h : k;
  }
}
// 끊는 움직임의 가속 a에 규칙이 곱한다: 빠른 판의 꺾기 (rules/pace, v2.14)
function aF(W, m) { let a = aOf(W, m); const h = W.H.flyAccel; for (let i = 0; i < h.length; i++) a = h[i](W, m, a); return a; }
module.exports = {
  name: 'flight', switch: 'flight', on: W => W.rules.flight, api: { F, outP, canFly, aF: (W, m) => aF(W, m) },
  engine: X => {
    const { hurt } = X;
    return {
      init(W) { W._fly = true; },   // 녹화에 높이·속도를 적는다
      mageStep(W, m) {
        if (m.cut.cd > 0) m.cut.cd -= W.dt;
        if (m.fly === 1) {
          if (m.st.stun > 0) fall(m);   // 날다가 굳으면(폭주 포함) 떨어진다
          else {
            const L = m.load;
            if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + (F.fat[0] + F.fat[1] * L + (L > 1 ? F.fat[2] * (L - 1) : 0)) * W.dt);
            const v = hyp(m.vx, m.vy); m.airFilm = false;
            if (v > F.film) { if (m.circles >= 3) m.airFilm = true; else m.st.blind = Math.max(m.st.blind, F.filmBlind); }   // 공기막이 없으면 눈이 먼다
            const lg = m.flog; lg.t += W.dt; lg.v += v * W.dt; lg.v2 += v * v * W.dt; if (v > F.corner - 5 && v < F.corner + 5) lg.corner += W.dt;
          }
        }
        m._nm = m.z >= 1 && m.fly !== 3 ? 1 + m.load : 1;   // 겨냥 흔들림 × (1 + L). 끊은 동안은 풀린다 (v2.3)
      },
      // 걸음: 나는 사람·떨어지는 사람은 여기서 움직인다 (땅의 걸음을 건너뛴다)
      move(W, m) {
        if (m.cut.w && W.rules.flightCut) cutStart(W, m);   // 날기 끊기 (v2.3)
        if (m.fly === 0) {
          if (!(m.flyWant && !(m.st.stun > 0 || m.st.root > 0) && canFly(m) && !(W.salt.length && X.onSalt(W, m.x, m.y)))) return false;
          m.fly = 1; m.vz = 0; m._flT0 = W.t;   // 이륙
        }
        if (m.roll > 0) m.roll -= W.dt;
        if (m.fly === 2 && W.rules.flightCut && !(m.st.stun > 0) && m.cut.z >= 0) { m.fly = 3; m.cut.k = 4; m.cut.z0 = m.fallZ; m.cut.on = false; }   // 굳음이 풀렸다: 쿠션을 뿜을 수 있다 (v2.3)
        if (m.fly === 3) { dropStep(W, m, hurt); return true; }   // 끊었다 (v2.3)
        if (m.fly === 2) {   // 떨어진다
          m.vz -= G * W.dt; m.z += m.vz * W.dt; m.flog.dz -= m.vz * W.dt; const k = 1 - 0.5 * W.dt; m.vx *= k; m.vy *= k; edge(W, m);
          if (m.z <= 0) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; m.flog.falls++; hurt(W, m, m.fallZ * F.fall, null, '추락', 'fall'); m.st.stun = Math.max(m.st.stun, F.fallStun);
            m.cast = m.castB = m.chan = null; }
          return true;
        }
        const P = outP(m), want = m.flyWant && P >= F.minP && !(W.salt.length && X.onSalt(W, m.x, m.y)), fz = want ? clamp(m.fz, F.zMin, F.zMax) : 0;
        let v = hyp(m.vx, m.vy);
        // 오르내림 (목표 높이로). 튀어오르기는 위로 3 g (v2.3)
        if (m.cut.k === 3) m.vz += CU.hop * G * W.dt;
        else { const vzT = clamp((fz - m.z) * 2, -F.vzMax, F.vzMax), va = W.rules.snap && m.tac.footwork >= 2 ? Math.max(F.vzAcc, aF(W, m)) : F.vzAcc; m.vz += clamp(vzT - m.vz, -va * W.dt, va * W.dt);
          }
        const r = v / F.liftV, lift = F.lift / (1 + r * r) * clamp(1 + m.vz / F.glideVz, 0, 1), drag = F.drag * v * v * v;
        let spare = P - lift - drag, climb = 0;
        if (m.vz > 0) {   // 오르기: 남는 힘으로, 모자라는 몫은 속도에서 (높이는 속도의 저금통)
          climb = M * G * m.vz; const have = spare > 0 ? spare : 0;
          if (climb > have) {
            const dv2 = 2 * (climb - have) * W.dt / M;
            if (v * v > dv2) { const nv = Math.sqrt(v * v - dv2); m.vx *= nv / v; m.vy *= nv / v; v = nv; }
            else { m.vz = (have + v * v * M / (2 * W.dt)) / (M * G); m.vx = m.vy = 0; v = 0; climb = M * G * m.vz; }
            spare = spare < 0 ? spare : 0;
          } else spare -= climb;
        } else if (m.vz < 0 && v > 1) { const nv = Math.sqrt(v * v - 2 * G * m.vz * W.dt); m.vx *= nv / v; m.vy *= nv / v; v = nv; }   // 내리꽂으면 힘 없이 속도가 붙는다
        // 앞·옆 가속
        const mx = m.mv.x, my = m.mv.y, ml = hyp(mx, my), fv = m.st.root > 0 || !ml ? 0 : clamp(m.fv, 0, F.vMax);
        const tx = ml ? mx / ml * fv : 0, ty = ml ? my / ml * fv : 0, dx = tx - m.vx, dy = ty - m.vy;
        let ux = 1, uy = 0; if (v >= 1) { ux = m.vx / v; uy = m.vy / v; } else if (ml) { ux = mx / ml; uy = my / ml; }
        const vv = M * (v > 5 ? v : 5), gF = W.rules.snap && m.tac.footwork >= 2 ? Math.max(F.fwdG * G, aF(W, m)) : F.fwdG * G, fwd = spare >= 0 ? Math.min(gF, spare / vv) : Math.max(-gF, spare / vv);   // 끊는 움직임: 앞뒤 가속의 한계도 a (앞으로는 여전히 남는 힘에 묶인다, v2.4)
        const al = dx * ux + dy * uy, at = -dx * uy + dy * ux;
        const aL = Math.min(clamp(al / W.dt, -gF, gF), fwd);   // 힘이 모자라면(fwd < 0) 늦춰진다
        const k = F.latK * clamp(spare / F.latP, 0.1, 1), latMax = Math.max(Math.min(F.latG * G, Math.max(k * v * v, v < 5 && fwd > 0 ? fwd : 0)), W.rules.snap && m.tac.footwork >= 2 ? aF(W, m) : 0);   // 끊는 움직임: 느려도 a로 꺾는다 (v2.4)
        const aT = clamp(at / W.dt, -latMax, latMax);
        if (m.cut.k === 1) { const a = CU.brake * G * W.dt; if (v > a) { m.vx -= ux * a; m.vy -= uy * a; } else m.vx = m.vy = 0; }   // 급정지: 거꾸로 5 g (v2.3)
        else if (m.cut.k === 2) { const a = CU.side * G * W.dt; m.vx += m.cut.x * a; m.vy += m.cut.y * a; }                             // 옆 튀기: 옆으로 5 g
        else { m.vx += (aL * ux - aT * uy) * W.dt; m.vy += (aL * uy + aT * ux) * W.dt; }
        if (m.cut.k && m.cut.k < 4 && (m.cut.t -= W.dt) <= 0) m.cut.k = 0;
        const nv = hyp(m.vx, m.vy); if (nv > F.vMax) { m.vx *= F.vMax / nv; m.vy *= F.vMax / nv; }
        edge(W, m);
        m.z += m.vz * W.dt; m.flog.dz += Math.abs(m.vz) * W.dt; if (m.z > F.zMax) { m.z = F.zMax; m.vz = 0; }
        m.load = (lift + drag + climb) / P;
        if (m.z <= 0) { m.z = 0; m.vz = 0; if (!want) { m.fly = 0; m.load = 0; } }   // 내려앉아 걷는다
        return true;
      },
      power(W, m, s, x) { return m.z >= 1 && m.fly !== 3 && !s.mundane ? x * F.pow * clamp(F.powL[0] - F.powL[1] * m.load, F.powL[2], 1) : x; },
      hurtMod(W, m, v, kind) { return m.z >= 1 && kind === 'elec' ? v * F.elec : v; },
      // 지연 폭발: 안 보이는 발밑 공격엔 닿지 않고, 보이는 구름은 × 1.3 (번개 구름은 hurtMod가 이미 × 1.3)
      areaHit(W, q, a, sole) { if (!(q.z >= 1)) return sole; if (!a.vis) return 0; return a.s.kind === 'elec' ? sole : sole * F.cloud; },
      roll(W, m, o) { if (m.fly !== 0) o.skip = true; },   // 나는 사람은 구르지 않는다(꺾는다)
      // 스쳐 치기: 빠르게 날며 쏜 공격이 2 s 안에 맞았나
      release(W, m, c) {
        if (m.fly === 1 && !c.auto && OFF[c.s.t] && hyp(m.vx, m.vy) > F.graze.v) { m.flog.grazeTry++; m._grazeN = c.s.n; m._grazeT = W.t; }
        if (m.fly === 3 && OFF[c.s.t]) { m.flog.dropTry++; m.cut.n = c.s.n; m.cut.nT = W.t; }   // 내려앉으며 치기 (v2.3)
      },
      hurt(W, m, v, src, name) {
        if (src && src._grazeN === name && W.t - src._grazeT < F.graze.within) { src.flog.grazeHit++; src._grazeN = null; }
        if (src && src.cut.n === name && W.t - src.cut.nT < CU.within) { src.flog.dropHit++; src.cut.n = null; }
      },
    };
  },
  brain: B => {
    const Bn = F.brain;
    // 떠 있는 적에게 헛된 수: 곡사(2 m 위), 안 보이는 발밑 공격·함정·해로운 지대, 가두는 기둥
    const useless = (s, e) => (s.t === 'lob' && e.z >= 2) || (s.t === 'area' && !s.vis) || s.t === 'trap' || (s.t === 'cage' && e.z > 2) || (s.t === 'zone' && s.z && s.z.k !== 'smoke' && s.z.k !== 'mist' && s.z.k !== 'absorb' && s.z.k !== 'rain');
    const binds = s => s.t === 'thread' || s.t === 'touch' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root));
    return {
      circles(W, q, c) { return q.z >= 1 && q.fly !== 3 ? Math.max(1, c - 1 - (q.airFilm ? 1 : 0)) : c; },   // 떠 있기에 서클 하나, 공기막에 하나 더. 끊은 동안은 풀린다 (v2.3)
      // 속도 판단: 목표 속도·높이·뜨기 (SPEC 24장 표)
      steer(W, m, K) {
        const P = outP(m);
        if (P < F.minP) { m.flyWant = false; return; }
        const T = m.tac, L = T.flySkill || 3, e = K.e, sustain = P >= F.lift;
        let ground = 0, elec = 0, elecT = false;
        for (const a of W.areas) if (a.src.side !== m.side && hyp(a.x - m.x, a.y - m.y) < a.r + Bn.danger) { if (!a.vis) ground++; else if (a.s.kind === 'elec') elec++; }
        for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < Bn.danger) ground++;
        for (const z of W.zones) if (z.src.side !== m.side && z.dps && hyp(z.x - m.x, z.y - m.y) < (z.r || 2) + Bn.danger) ground++;
        let near = 0, guns = 0, gunsFar = 0; for (const q of K.foes) { const dq = hyp(q.x - m.x, q.y - m.y); if (dq < Bn.crowd) near++;
          if (q._gun === undefined) q._gun = q.book.some(n => W.spells[n] && W.spells[n].mundane && W.spells[n].t === 'proj'); if (q._gun && dq < Bn.gunR) guns++;
          if (q._gun && dq < Bn.gunFar) gunsFar++; } if (near >= 3) ground++;
        if (T.readCast) for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast;
          if (c && !c.unseen && (c.s.kind === 'elec' || c.s.t === 'thread') && hyp(c.tx - m.x, c.ty - m.y) < 3) elecT = true; }
        const ec = T.readCast ? e.cast : null, eBig = !!(ec && ec.s.big), myBig = !!(m.cast && m.cast.s.big), far = K.stance === 'kite' || K.stance === 'breakout';
        let want = true, fv = F.corner, fz = Bn.z;
        if (L <= 1) { want = K.d > Bn.near; fv = F.vMax; }   // 초보: 걷거나 전속
        else if (L === 2) fv = m.cast ? Bn.hover : K.d > K.prefR + 3 ? Bn.approach : Bn.slow;   // 중급: 다가갈 땐 빠르게, 쏠 땐 멈춤
        else { if (myBig) fv = Bn.hover; else if (far) fv = F.vMax; else if (eBig) fv = F.corner; }   // 상급: 코너 속도
        if (L >= 4) {
          if (eBig) fz = ec.T - ec.t > 0.5 ? Bn.zHigh : Bn.zLow;   // 대가: 솟구쳤다 내리꽂기 (높이를 속도로)
          const c = m.cast; if (c && !myBig && OFF[c.s.t] && c.T - c.t < 0.3) fv = Math.min(fv, Bn.slow);   // 스쳐 치기: 치는 순간만 감속
        }
        if (L >= 5 && eBig && !myBig) {   // 전설: 일정 속도로 앞길을 읽게 한 뒤, 떨어지기 직전 급감속·급상승
          if (ec.T - ec.t < 0.3) { fv = Bn.hover; fz = Math.min(F.zMax, m.z + 6); if (m._feC !== ec) { m._feC = ec; m.flog.feint++; } } else fv = Bn.feintV;
        }
        if (K.dodge && L >= 2) fv = Math.max(fv, F.corner);   // 피할 땐 구르지 않고 옆으로 내달린다 (걸음 방향은 피하기가 정했다)
        if (sustain && (m.fat > Bn.restFat || (m.wave && Bn.waveLand && !gunsFar))) want = false;   // 머리가 뜨겁거나 파도를 타면 내려앉아 식힌다 (떠 있으면 비행 피로로 파도에서 못 내려온다, v2.0 둘째)   // 머리가 뜨거우면 내려앉아 쉰다 (떠 있기도 머리를 쓴다)
        if (ground) { want = true; if (near >= 3) { fz = Bn.zCrowd; fv = Math.min(fv, Bn.vCrowd); } }   // 발밑·함정·무리가 많으면 뜬다 (무리 위에선 낮게 천천히)
        if (L >= 2 && guns >= Bn.guns) want = false;
        if (m.phase === 'out' && fv < Bn.approach) fv = Bn.approach;   // 리듬의 빠지기: 빠르게 (v2.2)
        if (m.retreat) { want = true; fz = F.zMax; fv = F.vMax; }   // 물러나기: 높이 떠 사거리 밖으로 (brain/techniques/siege)   // 총이 많으면 내려앉아 구르며 피한다 (하늘에선 구르지 못해 더 맞는다)
        else if (L >= 3 && T.readCast && (elecT || elec >= Bn.elecMany)) want = false;   // 번개 위협엔 내려앉는다
        if (!sustain) { want = want && (ground >= Bn.hopN || K.stance === 'breakout') && m.fat < Bn.tiredFat && (m.fly !== 1 || W.t - m._flT0 < Bn.hopT); fv = Math.max(fv, F.corner); fz = Bn.zLow; }   // 상위: 떠오르기·도약·활공만 (hopT 초까지)
        // 브레이크를 잡을 거리가 모자라면 늦춘다 (끝·소금 선)
        const v = hyp(m.vx, m.vy); if (v > 1) { const d = room(W, m, m.vx / v, m.vy / v) - 2, cap = Math.sqrt(2 * F.fwdG * G * (d > 0 ? d : 0)); if (fv > cap) fv = cap < Bn.slow ? Bn.slow : cap; }
        // 제 구름이 터질 때 있을 자리를 미리 비킨다 (날면 관성이 커서 지금 자리만 보면 늦다, v2.0 둘째)
        if (m.fly === 1) for (const a of W.areas) { if (a.src !== m) continue; const px = m.x + m.vx * a.t, py = m.y + m.vy * a.t, dx = px - a.x, dy = py - a.y, l = hyp(dx, dy);
          if (l < a.r + Bn.ownGap) { K.vx = (dx || 0.1) / (l || 1) * 3; K.vy = (dy || 0.1) / (l || 1) * 3; if (fv < F.corner) fv = F.corner; } }
        if (W.rules.flightCut && T.flyCut) { CB.want = want; CB.fz = fz; cutBrain(W, m, K, T.flyCut); want = CB.want; fz = CB.fz; }   // 날기 끊기 (v2.3)
        m.flyWant = want; m.fv = fv; m.fz = fz;
      },
      // 하늘에서 쉬기: 떠 있고 파도가 깊으면(restWave) 쏘기를 멈추고 머리를 식힌다 (땅의 무리는 쉽게 닿지 못한다)
      rest(W, m, K, restNow) { return restNow || (m.z >= F.zMin && m.fat > Bn.restWave); },
      // 스스로 죽지 않기 (v2.6, tac.survive, 선명도 5 이상, SPEC 30장). 모든 걸음이 정해진 뒤(bound):
      //   과열 전 착지: 머리 75 넘으면 내려앉아 식히고 45 아래에서 다시 뜬다. 땅이 위험하면(적이 함정·안 보이는 구름·벽 밀기를 가졌다: 대마법사의 함정은 위력 C^2.5로 한 방,
      //     또는 안 보이는 구름·함정·해로운 지대가 6 m 안) 내려앉지 않고 2 m로 낮춘다. 쏘기를 멈추지는 않는다: 풀 때 넘칠 수만 버린다(techniques/survive)
      //   굳을 위험엔 낮게: 상대가 나에게 굳히기·묶기·번개를 1 s 안에 풀거나 머리 70 넘으면 목표 높이 2 m (날다 굳으면 높이 × 4로 떨어진다: 3.6 m 14 → 2 m 8. 1 s 굳음은 쿠션보다 길다)
      bound(W, m, K) {
        if (!(m.tac.survive && m.C >= 5) || outP(m) < F.minP) return;
        const S = Bn.survive, c = m.cut;
        if (m.wave) c.cool = false; else if (m.fat > S.land) c.cool = true; else if (m.fat < S.up) c.cool = false;
        let risk = m.fat > S.low;
        if (!risk) for (const q of K.foes) for (let j = 0; j < 2; j++) { const x = j ? q.castB : q.cast;
          if (x && !x.unseen && x.tgt === m && (binds(x.s) || x.s.kind === 'elec') && x.T - x.t < S.lowT) risk = true; }
        if (c.cool) risk = true;
        if (B.lib.behind(W, m, K)) risk = true;   // 세운 벽 뒤: 낮게 (벽은 2 m 넘게 뜬 사람을 가리지 않는다, v2.8)
        if (c.cool && m.flyWant) {
          let bad = !B.groundSafe(W, m);
          for (const a of W.areas) if (a.src.side !== m.side && !a.vis && hyp(a.x - m.x, a.y - m.y) < a.r + S.danger) { bad = true; break; }
          if (!bad) for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < S.danger) { bad = true; break; }
          if (!bad) for (const z of W.zones) if (z.src.side !== m.side && z.dps && hyp(z.x - m.x, z.y - m.y) < (z.r || 2) + S.danger) { bad = true; break; }
          if (bad) risk = true; else m.flyWant = false;
        }
        if (risk && m.fz > F.zMin) m.fz = F.zMin;
      },
      // 떠 있는 적: 굳히기·묶기 × 2 (떨어뜨리기), 헛된 수는 버린다. 빠른 적엔 번개·구름을 앞길에. 전설은 꺾지 못하는 순간을 친다
      value(W, m, K, o) {
        const s = o.s, e = K.e; if (!(o.v > 0)) return;
        if (m.fly === 1 && s.t === 'move') { o.v = 0; return; }
        if (!(e.z >= 1)) return;
        if (useless(s, e)) { o.v = 0; return; }
        if (binds(s)) o.v *= Bn.bind;
        const ev = hyp(e.vx, e.vy);
        if (ev > Bn.leadV && (s.t === 'thread' || (s.t === 'area' && s.kind === 'elec'))) { const k = (s.t === 'area' ? s.delay * 0.5 : (o.Tw + K.d / (32 * (s.fast || 1))) * 0.6) * K.lead * (Bn.lead - 1);
          o.tx += e.vx * k; o.ty += e.vy * k; }
        if ((m.tac.flySkill || 3) >= 5 && OFF[s.t] && ev > F.corner * Bn.strike) o.v *= 1.3;
      },
    };
  },
};
function edge(W, m) {   // 싸움터 끝에선 그 방향의 속도가 0
  const x = m.x + m.vx * W.dt, y = m.y + m.vy * W.dt;
  if ((x < 0.4 && m.vx < 0) || (x > W.width - 0.4 && m.vx > 0)) m.vx = 0;
  if ((y < 0.4 && m.vy < 0) || (y > W.height - 0.4 && m.vy > 0)) m.vy = 0;
}
