'use strict';
/* 규칙: 비행 (rules.flight, v2.0 기본 켬, SPEC 24장, 수는 data/rules/flight.json) — 대마법사는 걷지 않는다
 * 높이 하나를 더한 2.5차원. 출력 P = 2 kW × C^2.5 × 피로 배수, 75 kW 이상(상위부터)이 뜬다.
 * 드는 힘: 떠 있기 150 kW/(1 + (v/20)²) × 오르내림 몫, 앞으로 0.135·v³, 오르기 80·g·vz. 부하 L = 든 힘 / P.
 * 떠 있으면(z ≥ 1): 서클 − 1(60 m/s 넘으면 공기막으로 − 1 더), 위력 × 0.8 × clamp(1.15 − 0.6L, 0.5, 1), 흔들림 × (1 + L), 머리 피로 초당 1 + 6L (+ 40(L − 1)),
 *   안 보이는 발밑 공격·함정·지대·빙판 면역, 번개 × 1.3, 보이는 구름 × 1.3. z > 2면 바위·벽을 넘고 가리지도 않는다(core).
 * 움직임: 앞 가속 3 g와 남는 힘, 옆 가속 min(5 g, k·v²)(코너 속도 ≈ 25 m/s), 오르내림 8 m/s, 높이는 속도의 저금통. 날다 굳으면 떨어진다(높이 × 4, 1 s 굳음).
 * 두뇌: 판단할 때마다 목표 속도(fv)·높이(fz)·뜨기(flyWant)를 고른다. 판단 수준은 tac.flySkill (1 초보 … 5 전설) */
const { pow, hyp, clamp } = require('../math');
const F = require('../../data/rules/flight.json');
const { saltR } = require('./saltRing').api;
const G = F.g, M = F.mass, OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
// 출력 (W). C^2.5는 선명도마다 한 번
function outP(m) { if (m._flC !== m.C) { m._flC = m.C; m._flP = F.P0 * pow(Math.max(m.C, 0.01), F.Pk); } return m._flP * Math.max(0.6, 1 - Math.min(m.fat, 100) / 200); }
const canFly = m => outP(m) >= F.minP;
// 싸움터 끝·소금 선까지 지금 방향으로 남은 거리 (브레이크를 잡을 거리)
function room(W, m, ux, uy) {
  let t = 1e9;
  if (ux > 0) t = Math.min(t, (W.width - m.x) / ux); else if (ux < 0) t = Math.min(t, m.x / -ux);
  if (uy > 0) t = Math.min(t, (W.height - m.y) / uy); else if (uy < 0) t = Math.min(t, m.y / -uy);
  if (W.rules.saltRing) { const R = saltR(W), px = m.x - W.width / 2, py = m.y - W.height / 2, b = px * ux + py * uy, c = px * px + py * py - R * R, q = b * b - c; if (c < 0 && q >= 0) t = Math.min(t, -b + Math.sqrt(q)); }
  return t;
}
// 떨어지기 시작
function fall(m) { m.fly = 2; m.fallZ = m.z; if (m.vz > 0) m.vz = 0; }
module.exports = {
  name: 'flight', switch: 'flight', on: W => W.rules.flight, api: { F, outP, canFly },
  engine: X => {
    const { hurt, DT } = X;
    return {
      init(W) { W._fly = true; },   // 녹화에 높이·속도를 적는다
      mageStep(W, m) {
        if (m.fly === 1) {
          if (m.st.stun > 0) fall(m);   // 날다가 굳으면(폭주 포함) 떨어진다
          else {
            const L = m.load;
            if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + (F.fat[0] + F.fat[1] * L + (L > 1 ? F.fat[2] * (L - 1) : 0)) * DT);
            const v = hyp(m.vx, m.vy); m.airFilm = false;
            if (v > F.film) { if (m.circles >= 3) m.airFilm = true; else m.st.blind = Math.max(m.st.blind, F.filmBlind); }   // 공기막이 없으면 눈이 먼다
            const lg = m.flog; lg.t += DT; lg.v += v * DT; lg.v2 += v * v * DT; if (v > F.corner - 5 && v < F.corner + 5) lg.corner += DT;
          }
        }
        m._nm = m.z >= 1 ? 1 + m.load : 1;   // 겨냥 흔들림 × (1 + L)
      },
      // 걸음: 나는 사람·떨어지는 사람은 여기서 움직인다 (땅의 걸음을 건너뛴다)
      move(W, m) {
        if (m.fly === 0) {
          if (!(m.flyWant && !(m.st.stun > 0 || m.st.root > 0) && canFly(m) && !(W.salt.length && X.onSalt(W, m.x, m.y)))) return false;
          m.fly = 1; m.vz = 0; m._flT0 = W.t;   // 이륙
        }
        if (m.roll > 0) m.roll -= DT;
        if (m.fly === 2) {   // 떨어진다
          m.vz -= G * DT; m.z += m.vz * DT; m.flog.dz -= m.vz * DT; const k = 1 - 0.5 * DT; m.vx *= k; m.vy *= k; edge(W, m);
          if (m.z <= 0) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; m.flog.falls++; hurt(W, m, m.fallZ * F.fall, null, '추락', 'fall'); m.st.stun = Math.max(m.st.stun, F.fallStun); m.cast = m.castB = m.chan = null; }
          return true;
        }
        const P = outP(m), want = m.flyWant && P >= F.minP && !(W.salt.length && X.onSalt(W, m.x, m.y)), fz = want ? clamp(m.fz, F.zMin, F.zMax) : 0;
        let v = hyp(m.vx, m.vy);
        // 오르내림 (목표 높이로)
        const vzT = clamp((fz - m.z) * 2, -F.vzMax, F.vzMax); m.vz += clamp(vzT - m.vz, -F.vzAcc * DT, F.vzAcc * DT);
        const r = v / F.liftV, lift = F.lift / (1 + r * r) * clamp(1 + m.vz / F.glideVz, 0, 1), drag = F.drag * v * v * v;
        let spare = P - lift - drag, climb = 0;
        if (m.vz > 0) {   // 오르기: 남는 힘으로, 모자라는 몫은 속도에서 (높이는 속도의 저금통)
          climb = M * G * m.vz; const have = spare > 0 ? spare : 0;
          if (climb > have) {
            const dv2 = 2 * (climb - have) * DT / M;
            if (v * v > dv2) { const nv = Math.sqrt(v * v - dv2); m.vx *= nv / v; m.vy *= nv / v; v = nv; }
            else { m.vz = (have + v * v * M / (2 * DT)) / (M * G); m.vx = m.vy = 0; v = 0; climb = M * G * m.vz; }
            spare = spare < 0 ? spare : 0;
          } else spare -= climb;
        } else if (m.vz < 0 && v > 1) { const nv = Math.sqrt(v * v - 2 * G * m.vz * DT); m.vx *= nv / v; m.vy *= nv / v; v = nv; }   // 내리꽂으면 힘 없이 속도가 붙는다
        // 앞·옆 가속
        const mx = m.mv.x, my = m.mv.y, ml = hyp(mx, my), fv = m.st.root > 0 || !ml ? 0 : clamp(m.fv, 0, F.vMax);
        const tx = ml ? mx / ml * fv : 0, ty = ml ? my / ml * fv : 0, dx = tx - m.vx, dy = ty - m.vy;
        let ux = 1, uy = 0; if (v >= 1) { ux = m.vx / v; uy = m.vy / v; } else if (ml) { ux = mx / ml; uy = my / ml; }
        const vv = M * (v > 5 ? v : 5), gF = F.fwdG * G, fwd = spare >= 0 ? Math.min(gF, spare / vv) : Math.max(-gF, spare / vv);
        const al = dx * ux + dy * uy, at = -dx * uy + dy * ux;
        const aL = Math.min(clamp(al / DT, -gF, gF), fwd);   // 힘이 모자라면(fwd < 0) 늦춰진다
        const k = F.latK * clamp(spare / F.latP, 0.1, 1), latMax = Math.min(F.latG * G, Math.max(k * v * v, v < 5 && fwd > 0 ? fwd : 0));
        const aT = clamp(at / DT, -latMax, latMax);
        m.vx += (aL * ux - aT * uy) * DT; m.vy += (aL * uy + aT * ux) * DT;
        const nv = hyp(m.vx, m.vy); if (nv > F.vMax) { m.vx *= F.vMax / nv; m.vy *= F.vMax / nv; }
        edge(W, m);
        m.z += m.vz * DT; m.flog.dz += Math.abs(m.vz) * DT; if (m.z > F.zMax) { m.z = F.zMax; m.vz = 0; }
        m.load = (lift + drag + climb) / P;
        if (m.z <= 0) { m.z = 0; m.vz = 0; if (!want) { m.fly = 0; m.load = 0; } }   // 내려앉아 걷는다
        return true;
      },
      power(W, m, s, x) { return m.z >= 1 && !s.mundane ? x * F.pow * clamp(F.powL[0] - F.powL[1] * m.load, F.powL[2], 1) : x; },
      hurtMod(W, m, v, kind) { return m.z >= 1 && kind === 'elec' ? v * F.elec : v; },
      // 지연 폭발: 안 보이는 발밑 공격엔 닿지 않고, 보이는 구름은 × 1.3 (번개 구름은 hurtMod가 이미 × 1.3)
      areaHit(W, q, a, sole) { if (!(q.z >= 1)) return sole; if (!a.vis) return 0; return a.s.kind === 'elec' ? sole : sole * F.cloud; },
      roll(W, m, o) { if (m.fly !== 0) o.skip = true; },   // 나는 사람은 구르지 않는다(꺾는다)
      // 스쳐 치기: 빠르게 날며 쏜 공격이 2 s 안에 맞았나
      release(W, m, c) { if (m.fly === 1 && !c.auto && OFF[c.s.t] && hyp(m.vx, m.vy) > F.graze.v) { m.flog.grazeTry++; m._grazeN = c.s.n; m._grazeT = W.t; } },
      hurt(W, m, v, src, name) { if (src && src._grazeN === name && W.t - src._grazeT < F.graze.within) { src.flog.grazeHit++; src._grazeN = null; } },
    };
  },
  brain: B => {
    const Bn = F.brain;
    // 떠 있는 적에게 헛된 수: 곡사(2 m 위), 안 보이는 발밑 공격·함정·해로운 지대, 가두는 기둥
    const useless = (s, e) => (s.t === 'lob' && e.z >= 2) || (s.t === 'area' && !s.vis) || s.t === 'trap' || (s.t === 'cage' && e.z > 2) || (s.t === 'zone' && s.z && s.z.k !== 'smoke' && s.z.k !== 'mist' && s.z.k !== 'absorb' && s.z.k !== 'rain');
    const binds = s => s.t === 'thread' || s.t === 'touch' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root));
    return {
      circles(W, q, c) { return q.z >= 1 ? Math.max(1, c - 1 - (q.airFilm ? 1 : 0)) : c; },   // 떠 있기에 서클 하나, 공기막에 하나 더
      // 속도 판단: 목표 속도·높이·뜨기 (SPEC 24장 표)
      steer(W, m, K) {
        const P = outP(m);
        if (P < F.minP) { m.flyWant = false; return; }
        const T = m.tac, L = T.flySkill || 3, e = K.e, sustain = P >= F.lift;
        let ground = 0, elec = 0, elecT = false;
        for (const a of W.areas) if (a.src.side !== m.side && hyp(a.x - m.x, a.y - m.y) < a.r + Bn.danger) { if (!a.vis) ground++; else if (a.s.kind === 'elec') elec++; }
        for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < Bn.danger) ground++;
        for (const z of W.zones) if (z.src.side !== m.side && z.dps && hyp(z.x - m.x, z.y - m.y) < (z.r || 2) + Bn.danger) ground++;
        let near = 0, guns = 0, gunsFar = 0; for (const q of K.foes) { const dq = hyp(q.x - m.x, q.y - m.y); if (dq < Bn.crowd) near++; if (q._gun === undefined) q._gun = q.book.some(n => W.spells[n] && W.spells[n].mundane && W.spells[n].t === 'proj'); if (q._gun && dq < Bn.gunR) guns++; if (q._gun && dq < Bn.gunFar) gunsFar++; } if (near >= 3) ground++;
        if (T.readCast) for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (c && (c.s.kind === 'elec' || c.s.t === 'thread') && hyp(c.tx - m.x, c.ty - m.y) < 3) elecT = true; }
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
        if (m.retreat) { want = true; fz = F.zMax; fv = F.vMax; }   // 물러나기: 높이 떠 사거리 밖으로 (brain/techniques/siege)   // 총이 많으면 내려앉아 구르며 피한다 (하늘에선 구르지 못해 더 맞는다)
        else if (L >= 3 && T.readCast && (elecT || elec >= Bn.elecMany)) want = false;   // 번개 위협엔 내려앉는다
        if (!sustain) { want = want && (ground >= Bn.hopN || K.stance === 'breakout') && m.fat < Bn.tiredFat && (m.fly !== 1 || W.t - m._flT0 < Bn.hopT); fv = Math.max(fv, F.corner); fz = Bn.zLow; }   // 상위: 떠오르기·도약·활공만 (hopT 초까지)
        // 브레이크를 잡을 거리가 모자라면 늦춘다 (끝·소금 선)
        const v = hyp(m.vx, m.vy); if (v > 1) { const d = room(W, m, m.vx / v, m.vy / v) - 2, cap = Math.sqrt(2 * F.fwdG * G * (d > 0 ? d : 0)); if (fv > cap) fv = cap < Bn.slow ? Bn.slow : cap; }
        // 제 구름이 터질 때 있을 자리를 미리 비킨다 (날면 관성이 커서 지금 자리만 보면 늦다, v2.0 둘째)
        if (m.fly === 1) for (const a of W.areas) { if (a.src !== m) continue; const px = m.x + m.vx * a.t, py = m.y + m.vy * a.t, dx = px - a.x, dy = py - a.y, l = hyp(dx, dy); if (l < a.r + Bn.ownGap) { K.vx = (dx || 0.1) / (l || 1) * 3; K.vy = (dy || 0.1) / (l || 1) * 3; if (fv < F.corner) fv = F.corner; } }
        m.flyWant = want; m.fv = fv; m.fz = fz;
      },
      // 하늘에서 쉬기: 떠 있고 파도가 깊으면(restWave) 쏘기를 멈추고 머리를 식힌다 (땅의 무리는 쉽게 닿지 못한다)
      rest(W, m, K, restNow) { return restNow || (m.z >= F.zMin && m.fat > Bn.restWave); },
      // 떠 있는 적: 굳히기·묶기 × 2 (떨어뜨리기), 헛된 수는 버린다. 빠른 적엔 번개·구름을 앞길에. 전설은 꺾지 못하는 순간을 친다
      value(W, m, K, o) {
        const s = o.s, e = K.e; if (!(o.v > 0)) return;
        if (m.fly === 1 && s.t === 'move') { o.v = 0; return; }
        if (!(e.z >= 1)) return;
        if (useless(s, e)) { o.v = 0; return; }
        if (binds(s)) o.v *= Bn.bind;
        const ev = hyp(e.vx, e.vy);
        if (ev > Bn.leadV && (s.t === 'thread' || (s.t === 'area' && s.kind === 'elec'))) { const k = (s.t === 'area' ? s.delay * 0.5 : (o.Tw + K.d / (32 * (s.fast || 1))) * 0.6) * K.lead * (Bn.lead - 1); o.tx += e.vx * k; o.ty += e.vy * k; }
        if ((m.tac.flySkill || 3) >= 5 && OFF[s.t] && ev > F.corner * Bn.strike) o.v *= 1.3;
      },
    };
  },
};
function edge(W, m) {   // 싸움터 끝에선 그 방향의 속도가 0
  const DT = 1 / 30, x = m.x + m.vx * DT, y = m.y + m.vy * DT;
  if ((x < 0.4 && m.vx < 0) || (x > W.width - 0.4 && m.vx > 0)) m.vx = 0;
  if ((y < 0.4 && m.vy < 0) || (y > W.height - 0.4 && m.vy > 0)) m.vy = 0;
}
