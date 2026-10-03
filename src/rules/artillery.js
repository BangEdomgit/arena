'use strict';
/* 규칙: 포병과 소금 탄 (rules.artillery, v2.31, SPEC 54장, 수는 data/rules/artillery.json, 마법은 data/spells/없음.json의 산탄·둥근 탄·소금 탄) — 기본 꺼짐
 * WORLD 5-1 "대포는 마법사 사냥꾼", 4-5 대마법사가 못 하는 것: 대포알 막기(마법이 아니라 장악권이 못 빼앗는다)
 * 청동포(장면의 tac.gun, 덱 '청동포', 체력 gun.hp): 포수(tac.crew, 덱 '포수')가 곁(crewR m)에 있어야 쏘고 끌고 간다.
 *   쓰러지거나 달아난 포수 자리는 곁(crew.fill m)의 머스킷 병이 채운다(v2.32). 흙 가마니(장면의 낮은 흙벽, 포 앞에 포신 자리를 비운 줄)가 포수를 직사·실에서 가린다
 *   다시 채우기 reload s × crew / 곁의 포수(셋 다 함께 돈다), 걸음 × speed × 곁의 포수 / crew. 구르지 않고 달아나지 않는다. 포수가 모두 쓰러지거나 달아나면 버려진다(빠진 것으로 센다)
 *   산탄(틀 canister): 불을 댈 때 과녁을 따라 돌려(앞질러) 과녁 높이로 들어(앙각 elev 한도) 쇠공 n개가 반각 half rad의 원뿔로(옆·위아래) 포구(muzzle m)에서.
 *     공 하나는 머스킷 탄쯤(60). 앙각보다 높이 나는 과녁엔 닿지 않는다. 석회 방패는 공의 1 − pierce를 막는다
 *   둥근 탄(proj, pierce): 맞으면 치명(300). 방패가 못 막는다. 벽을 부순다(800). 겨눈 곳으로 곧게 가서 움직이는 과녁은 거의 못 맞힌다
 *   소금 탄(틀 saltshell): 거리 ÷ salt.v s(tMin~tMax) 날아가 떨어지면 반지름 salt.r m의 소금 안개가 salt.t s 선다(지대 'saltfog', 비가 씻어낸다). 겨눈 자리 ± max(min, spread × 거리)
 * 소금 안개(높이 salt.h m까지): 그 안에선 마법이 서지 않고(서는 자리·시전자가 안개 안이면 흩어진다), 안에 선 사람의 장악권이 꺼진다(다른 자리를 다투지 않는다).
 *   안개 안에서 날던 사람은 떨어지고, 몸에 건 마법(석회 방패·빠르기…)이 흩어진다
 * 포는 마법 피해 × gun.magicK, 한 번에 gun.magicCap까지(청동). 판단 수준의 캔슬을 쓰지 않는다(과녁이 굴러도 쏜다)
 * 두뇌
 *   포: 가장 선명한 적을 노린다. 소금 탄(1.3)은 선명도 2 이상의 과녁(아직 안개 밖, 다른 포의 소금이 오지 않을 때)에, 둥근 탄(1.2)은 거의 선 과녁(slowV m/s 아래)에,
 *     산탄은 앙각 안의 과녁에(소금 안개 안 1.6, close m 안 1.1, 밖 0.5). 우리 편이 원뿔·사선에 있으면 쏘지 않는다
 *   포수: 포 뒤(과녁 반대쪽) post m에 선다
 *   대마법사(선명도 arch.cMin 이상): 소금 안개를 피하고, 나를 겨눠 다 채운 포(warn s 안에 풀린다)의 사선에서 옆으로 비키고, 곁(hunt m)의 포수부터 노린다
 *   마법을 쓰는 누구나 소금 안개 안이면 밖으로 나간다 */
const P = require('../../data/rules/artillery.json'), G = P.gun, { hyp, atan2 } = require('../math');
const LANE = require('./fireLane').api.lane;
const GUNS = { 산탄: 1, '둥근 탄': 1, '소금 탄': 1 };
const ST = new WeakMap(), HOLD = new WeakMap();   // HOLD: 시전 → 늦춘 시간
   // 세계 → { guns: [], crew: Map(포수 → 포), n: Map(포 → 곁의 포수 수), fog: 안개 수, last: 센 걸음 }
const isGun = m => !!m.tac.gun, isCrew = m => !!m.tac.crew;
function stOf(W) {
  let S = ST.get(W); if (S) return S; S = { guns: [], crew: new Map(), n: new Map(), fog: 0, filled: 0 }; ST.set(W, S);
  for (const m of W.ms) if (isGun(m)) { S.guns.push(m); S.n.set(m, 0); }
  const left = new Map(S.guns.map(g => [g, G.crew]));   // 포수는 가까운 포에 (포마다 crew명까지)
  for (const m of W.ms) { if (!isCrew(m)) continue; let b = null, bd = 1e9; for (const g of S.guns) if (g.side === m.side && left.get(g) > 0) { const d = hyp(g.x - m.x, g.y - m.y); if (d < bd) { bd = d; b = g; } } if (b) { S.crew.set(m, b); left.set(b, left.get(b) - 1); } }
  return S;
}
// 이 과녁 둘레에 소금이 이미 오는가: 같은 편 포가 소금 탄을 짓는 중이거나 날아가는 소금 탄
function saltComing(W, m, e) { for (const g of W.ms) if (g !== m && g.side === m.side && g.hp > 0 && g.cast && g.cast.s.n === '소금 탄') return true;
  for (const l of W.lobs) if (l.src.side === m.side && l.s.n === '소금 탄' && hyp(l.x - e.x, l.y - e.y) < P.salt.r * 2) return true; return false; }
// 포수 채우기: 포에 붙은 포수(살아 있고 달아나지 않은)가 crew보다 적으면 곁(crew.fill m)의 머스킷 병을 가까운 차례로 포수로 (tac.crew, 그 포에 붙는다)
function fill(X, W, S, g) {
  let k = 0; for (const [c, gg] of S.crew) if (gg === g && c.hp > 0 && !c.flee) k++;
  let got = false; while (k < G.crew) { let b = null, bd = P.crew.fill; for (const q of W.ms) { if (q.side !== g.side || !(q.hp > 0) || q.flee || q.tac.gun || q.tac.crew || q.book.indexOf('머스킷') < 0) continue; const d = X.hyp(q.x - g.x, q.y - g.y); if (d < bd) { bd = d; b = q; } }
    if (!b) return got; b.tac.crew = 1; S.crew.set(b, g); S.filled++; k++; got = true; }
  return got;
}
const fogs = W => { let n = 0; for (const z of W.zones) if (z.k === 'saltfog') n++; return n; };
function inFog(W, x, y, z) { if (z >= P.salt.h) return false; for (const f of W.zones) if (f.k === 'saltfog' && hyp(x - f.x, y - f.y) < f.r) return true; return false; }
// 산탄의 원뿔(반각 + 여유) 안의 우리 편
function coneAlly(W, m, tx, ty) {
  const a = atan2(ty - m.y, tx - m.x), R = 300; for (const q of W.ms) { if (q === m || q.side !== m.side || !(q.hp > 0) || q.z >= 6) continue;
    const dx = q.x - m.x, dy = q.y - m.y, d = hyp(dx, dy); if (d < 0.5 || d > R) continue; let da = Math.abs(atan2(dy, dx) - a); if (da > Math.PI) da = 2 * Math.PI - da; if (da < P.canister.half * 1.5 + (q.r + 0.3) / d) return true; }
  return false;
}
module.exports = {
  name: 'artillery', switch: 'artillery', form: { canister: 'self', saltshell: 'self' }, threat: { canister: 1 }, api: { P, stOf, inFog, coneAlly, isGun, isCrew },
  engine: X => ({
    world(W) {
      const S = stOf(W); S.fog = fogs(W);
      for (const g of S.guns) { if (!(g.hp > 0)) continue; let n = 0, any = false;
        for (const [c, gg] of S.crew) if (gg === g && c.hp > 0 && !c.flee) { any = true; if (X.hyp(c.x - g.x, c.y - g.y) < G.crewR) n++; }
        S.n.set(g, n); g.flee = 0;   // 포는 달아나지 않는다
        if (P.crew.fill > 0 && (!any || W.step % P.crew.every === 0) && fill(X, W, S, g)) any = true;   // 쓰러진 포수 자리를 곁의 머스킷 병이 채운다 (v2.32)
        if (!any) { g.alog.fled = 1; g.hp = 0; g.deathT = W.t; g.cast = null; } }   // 포수가 모두 없으면 버려진다
      if (S.fog) for (const m of W.ms) { if (!(m.hp > 0) || !inFog(W, m.x, m.y, m.z)) continue;
        if (W.rules.flight && (m.fly === 1 || m.fly === 3)) { m.fly = 2; m.fallZ = m.z; if (m.vz > 0) m.vz = 0; }   // 안개 안에선 날 수 없다
        const b = m.buf; for (const k in b) if (b[k]) b[k] = null; }   // 몸에 건 마법(석회 방패·빠르기…)이 흩어진다
    },
    speed(W, m, sp) { if (!isGun(m)) return sp; const n = stOf(W).n.get(m) || 0; return sp * G.speed * n / G.crew; },
    roll(W, m, o) { if (isGun(m)) o.skip = true; },
    // 쏘기 직전에 원뿔·사선을 다시 본다: 우리 편이 들어왔으면 hold s까지 늦추고, 넘으면 거둔다 (rules/fireLane과 같은 뜻, 포는 늘)
    mageStep(W, m) { if (!isGun(m)) return; const c = m.cast; if (!c || !GUNS[c.s.n] || c.s.t === 'saltshell' || c.t + W.dt < c.T) return;
      const q = c.tgt && c.tgt.hp > 0 ? c.tgt : null, x = q ? q.x : c.tx, y = q ? q.y : c.ty; if (!(c.s.t === 'canister' ? coneAlly(W, m, x, y) : LANE(W, m, x, y, c.s.R))) return;
      const h = (HOLD.get(c) || 0) + W.dt; if (h > G.hold) { m.cast = null; return; } HOLD.set(c, h); c.T += W.dt; },
    hurtMod(W, m, v, kind, name, src) { if (!isGun(m) || (W.spells[name] && W.spells[name].mundane)) return v; const x = v * G.magicK; return x < G.magicCap ? x : G.magicCap; },   // 청동은 마법(불·번개·돌)에 거의 다치지 않는다(× magicK, 한 번에 magicCap까지): 포수를 쓰러뜨려야 한다
    release(W, m, c) { if (!GUNS[c.s.n]) return; const n = stOf(W).n.get(m) || 0, t = G.reload * G.crew / (n > 0 ? n : 1); for (const k in GUNS) m.cd[k] = t; },
    gate(W, m, s, tx, ty) { if (s.mundane || !stOf(W).fog) return false; if (inFog(W, m.x, m.y, m.z)) return true; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return inFog(W, p[0], p[1], 0); },
    share(W, m, x, y, f) {
      if (!stOf(W).fog || f >= 1) return f; const foes = W.foes[m.side]; let any = false; for (const q of foes) if (inFog(W, q.x, q.y, q.z)) { any = true; break; } if (!any) return f;
      const L = W.rules.domainL, Rr = W.rules.domainR, mine = X.sigOf(W, m) / (1 + X.hyp(x - m.x, y - m.y) / L); let other = 0;   // 안개 안의 적은 다투지 않는다 (core share와 같은 셈)
      for (const q of foes) { if (inFog(W, q.x, q.y, q.z)) continue; const dq = X.hyp(x - q.x, y - q.y); if (Rr > 0 && dq > Rr * q.C) continue; other += X.sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + dq / L); }
      return mine / (mine + other);
    },
    lobLand(W, l) { if (l.s.n !== '소금 탄') return; X.addZone(W, l.src, { k: 'saltfog', n: '소금 안개', shape: 'circle', r: P.salt.r, d: P.salt.t, dps: 0 }, l.x, l.y, 0, 1); },
    track(W, m, c) { if (c.s.t !== 'canister') return; const q = c.tgt; if (!q || !(q.hp > 0)) return; const f = X.hyp(q.x - m.x, q.y - m.y) / c.s.v; c.tx = q.x + q.vx * f; c.ty = q.y + q.vy * f; },   // 산탄은 불을 댈 때 과녁을 따라 돌린다(앞질러)
    wallHit(W, p, o, wd) { return p.s.n === '둥근 탄' ? p.s.wallDmg : wd; },
  }),
  types: X => ({
    canister(W, m, c, a) {
      const s = c.s, n = P.canister.n, z = m.z + G.muzzle, life = s.R / s.v, q = c.tgt, d = X.hyp(c.tx - m.x, c.ty - m.y) || 1;
      let tz = (q && q.hp > 0 ? q.z : 0) + G.muzzle; if (tz > d * P.canister.elev + z) tz = d * P.canister.elev + z;   // 과녁의 몸 가운데 높이로 들어 겨눈다 (앙각 한도)
      const vz0 = (tz - z) / (d / s.v);
      for (let j = 0; j < n; j++) { const an = a.aim + (W.rng() - 0.5) * 2 * P.canister.half, vz = vz0 + (W.rng() - 0.5) * 2 * P.canister.half * s.v;   // 옆으로도 위아래로도 퍼진다
        W.proj.push({ x: m.x, y: m.y, vx: X.cos(an) * s.v, vy: X.sin(an) * s.v, z, vz, home: s.home, life, s, src: m, pow: 1, rad: s.rad, t0: W.t }); }
    },
    // 소금 탄: 거리 ÷ salt.v s(tMin~tMax) 날아가 떨어진다 (곡사와 같은 칸, 떨어지면 lobLand가 안개를 세운다)
    saltshell(W, m, c, a) { const d = X.hyp(c.tx - m.x, c.ty - m.y), t = d / P.salt.v; W.lobs.push({ x: c.tx, y: c.ty, t: t < P.salt.tMin ? P.salt.tMin : t > P.salt.tMax ? P.salt.tMax : t, s: c.s, src: m, pow: 1, r: c.s.r }); },
  }),
  brainTypes: () => ({ canister(W, m, K, o) { o.v = 0; }, saltshell(W, m, K, o) { o.v = 0; } }),   // 값은 valueLate (포의 두뇌)
  brain: B => {
    const C = B.C, hyp = B.hyp;
    return {
      aim(W, m, K) {
        const S = stOf(W);
        if (isGun(m)) { let e = null; for (const q of K.foes) if (q.hp > 0 && !q.flee && (!e || q.C > e.C)) e = q; if (e) K.e = e; return; }   // 포: 가장 선명한 적
        if (m.C < P.arch.cMin || !S.guns.length) return;   // 대마법사: 곁의 포수부터
        let b = null, bd = P.arch.hunt; for (const [c, g] of S.crew) if (c.side !== m.side && c.hp > 0 && !c.flee && g.hp > 0) { const d = hyp(c.x - m.x, c.y - m.y); if (d < bd) { bd = d; b = c; } }
        if (b) K.e = b;
      },
      valueLate(W, m, K, o) {
        const s = o.s; if (!GUNS[s.n] || !isGun(m)) return; const e = K.e, S = stOf(W);
        if (!e || !(S.n.get(m) > 0) || !K.los) { o.v = 0; return; }
        const d = K.d, sp = hyp(e.vx, e.vy);
        if (s.n === '산탄') { o.v = e.z <= d * P.canister.elev + G.muzzle + 1 && d <= s.R && !coneAlly(W, m, e.x, e.y) ? (inFog(W, e.x, e.y, e.z) ? 1.6 : d <= P.canister.close ? 1.1 : 0.5) : 0; return; }   // 앙각 안의 과녁: 소금 안개 안(방패·날기가 꺼졌다)이면 먼저, 가까우면(close m)
        if (s.n === '소금 탄') { o.v = e.C >= 2 && d >= P.salt.minD && d <= s.R && !inFog(W, e.x, e.y, 0) && !saltComing(W, m, e) ? 1.3 : 0; if (o.v) { const f = d / P.salt.v; o.tx = e.x + e.vx * f * P.salt.lead; o.ty = e.y + e.vy * f * P.salt.lead; } return; }   // 다른 포가 소금을 쏘는 중이거나 날아가는 중이면 산탄
        o.v = (sp < P.round.slowV ? 1.2 : 0.3) * (LANE(W, m, e.x, e.y, s.R) ? 0 : 1);   // 둥근 탄: 거의 선 과녁(짓기·모으기·떠 있기)이면 한 방. 사선에 우리 편이면 쏘지 않는다 (rules/fireLane의 셈)
      },
      commit(W, m, K, best, cast) { if (best.s.n !== '소금 탄') return; const d = Math.max(P.salt.min, hyp(best.tx - m.x, best.ty - m.y) * P.salt.spread); cast.tx += W.rnd(-d, d); cast.ty += W.rnd(-d, d); },   // 소금 탄은 ± max(min, spread × 거리)
      steer(W, m, K) {
        const S = stOf(W);
        if (isGun(m)) { const e = K.e; if (e && K.d > 250) return; K.vx = 0; K.vy = 0; return; }   // 포는 닿으면 선다
        const g = S.crew.get(m); if (g && g.hp > 0 && !m.flee) { const e = g._k && g._k.e; let ux = 0, uy = 0; if (e) { const dx = g.x - e.x, dy = g.y - e.y, l = hyp(dx, dy) || 1; ux = dx / l; uy = dy / l; }   // 포수: 포 뒤
          const sd = ((m.id % 4) - 1.5) * P.crew.side, tx = B.C.clamp(g.x + ux * P.crew.post - uy * sd, 1, W.width - 1), ty = B.C.clamp(g.y + uy * P.crew.post + ux * sd, 1, W.height - 1),   // 판 안의 자리
            dx = tx - m.x, dy = ty - m.y, l = hyp(dx, dy); if (l > P.crew.stay) { K.vx = dx / l * Math.min(3, l); K.vy = dy / l * Math.min(3, l); } else { K.vx = 0; K.vy = 0; } return; }   // 자리 둘레 stay m 안이면 선다 (과녁이 돌면 포 뒤도 돈다: 쫓으면 흔들린다)
        if (K.dodge || m.flee) return;
        if (S.fog && m.C >= 0.9 && m.book.some(n => W.spells[n] && !W.spells[n].mundane)) for (const f of W.zones) { if (f.k !== 'saltfog') continue; const dx = m.x - f.x, dy = m.y - f.y, l = hyp(dx, dy) || 0.1, pad = m.C >= P.arch.cMin ? P.arch.fogPad : 0.5; if (l < f.r + pad && m.z < P.salt.h) { K.vx = dx / l * 4; K.vy = dy / l * 4; return; } }   // 안개 밖으로
        if (m.C < P.arch.cMin) return;
        for (const g of S.guns) { if (g.side === m.side || !(g.hp > 0)) continue; const c = g.cast; if (!c || c.tgt !== m || c.T - c.t > P.arch.warn) continue;   // 나를 겨눈 포가 곧 풀린다: 사선에서 옆으로
          const dx = m.x - g.x, dy = m.y - g.y, l = hyp(dx, dy) || 1, sg = m.sf || 1; K.vx = -dy / l * P.arch.side * sg; K.vy = dx / l * P.arch.side * sg; return; }
      },
    };
  },
};
