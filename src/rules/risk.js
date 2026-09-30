'use strict';
/* 규칙: 하이 리스크 하이 리턴 (rules.risk, 1.9.0~, SPEC 7장)
 * 큰 마법(big: 1 — 대낙뢰·화산 기둥·번개 창)이 책에 남는다. 모으는 중에 한 번에 3 이상 맞으면 역류(끊기고 22 피해, 0.6 s 굳음).
 * 쏜 뒤 0.9 s 빈손(첫 칸·자동 진 불가, 걸음 × 0.6). 두뇌: 큰 수의 때 가리기, 상대의 큰 수 끊기, 빈손 몰아치기, 짝 묶기(대가·전설) */
module.exports = {
  name: 'risk', on: W => W.rules.risk,
  engine: X => ({
    release(W, m, c) { if (c.s.big) { m.emptyT = W.t + 0.9; m.log.bigCast++; } },   // 빈손: 큰 마법 뒤 0.9 s 동안 시전 불가, 속도 × 0.6
    // 역류: 큰 마법을 모으는 중에 3 이상 맞으면 끊기고 22 피해, 0.6 s 굳음
    hurt(W, m, v) { if (v >= 3 && ((m.cast && m.cast.s.big) || (m.castB && m.castB.s.big)) && m.hp > 0) { if (m.cast && m.cast.s.big) m.cast = null; if (m.castB && m.castB.s.big) m.castB = null; m.log.backfire++; m.st.stun = Math.max(m.st.stun || 0, 0.6); X.hurt(W, m, 22, null, '역류', 'backfire'); } },
    speed(W, m, sp) { return sp * (m.emptyT > W.t ? 0.6 : 1); },
  }),
  brain: B => {
    const { PAIRS, pinned, hitBack, castTime, landDelay, estDmg, maxRange, bindOf } = B;
    const dodgeAim = require('../brain/techniques/dodgeAim'), grab = require('../brain/techniques/grab'), { undo } = require('../brain/techniques/cancel');
    return {
      aim(W, m, K) { if (m.tac.dodgeAim) K.wantMem = true; },   // 피할 자리 겨냥은 구르는 쪽 기록(학습)을 쓴다
      empty(W, m) { return m.emptyT > W.t; },                    // 빈손: 첫 칸과 자동 진을 못 쓴다
      // 짝에 맞춰 모으던 큰 수 (대가·전설): 짝이 떨어졌는데 과녁이 안 굳었으면 끊고, 굳었으면 끝을 과녁에 다시 겨눈다
      cancel(W, m, K) { const e = K.e; if (K.T.bigPlan && m.cast && m.cast.s.big && m.cast.pairLand && W.t > m.cast.pairLand + 0.05) { const c = m.cast; if (e.st.stun > 0 || e.st.root > 0) { c.tx = e.x; c.ty = e.y; } else undo(m, c); } },
      // 큰 수는 입장 판단이 있으면 때를 가린다, 상대의 큰 수는 빠른 공격으로 끊는다, 빈손은 몰아친다
      valueRisk(W, m, K, o) {
        const T = K.T, e = K.e, d = K.d, s = o.s, n = o.n, Tw = o.Tw;
        const noRoll = e.rollCd > 0.4 || e.stam < 1.5 || K.eDown || e.st.mycel > 0.4 || e.st.cramp > 0.4;   // 과녁이 당분간 못 구른다
        o.pin = W.rules.bodyBind && s.big && pinned(W, m, s, e, castTime(W, m, Tw), d) && hitBack(W, e, K.S, d) > castTime(W, m, Tw) + 0.05;   // 몸 묶기: 빠져나갈 수 없게 붙잡혔고, 모으는 동안 맞지 않는다
        if (s.big && T.stance && !(K.eDown || o.pin || e.emptyT > W.t || d > Math.max(8, maxRange(e, K.S)) || !K.los)) o.v = 0;   // 멀다 = 과녁의 사거리 밖
        // 판을 짜는 사람(대가·전설)은 큰 수를 짝의 틈이나, 남은 굳힘 안에 닿을 때만 쓴다 (아래 짝 계획이 다시 연다)
        if (s.big && T.bigPlan && !(o.pin || Math.max(e.st.stun || 0, e.st.root || 0) > castTime(W, m, Tw) + landDelay(s, d) + 0.02)) o.v = 0;
        else if (s.big && T.bigPlan) { o.v = Math.max(o.v, 30); o.tx = e.x; o.ty = e.y; }
        if (o.isOff && !s.big && T.readCast) { const bc = e.cast && e.cast.s.big ? e.cast : e.castB && e.castB.s.big ? e.castB : undefined; if (bc && Tw + landDelay(s, d) < bc.T - bc.t && estDmg(s) >= 3) o.v *= 2.2; if (e.emptyT > W.t) o.v *= 1.5; }
        // 짝 묶기 (대가·전설): 짝을 열 수 있으면 먼저 열고, 연 뒤에는 짝의 틈에 큰 수를 꽂는다
        if (T.bigPlan) {
          const bp = m.bigp && m.bigp.tgt === e && W.t < m.bigp.until ? m.bigp : null; if (m.bigp && !bp) m.bigp = null;
          // 짝은 과녁이 빠져나갈 수 없을 때(이미 묶였거나 굳음, 또는 젖음형은 당분간 못 구를 때) 연다: 예비동작을 읽는 상대는 보이는 짝을 걸어서 피한다
          const pr = PAIRS[n]; if (!bp && pr && (K.eDown || (pr.kind === 'wet' && noRoll)) && m.book.includes(pr.fin) && !((m.cd[pr.fin] || 0) > 0) && m.glu > o.cost + K.S[pr.fin].cost && o.v > 0) o.v = Math.max(o.v, 1.2);
          if (bp && n === bp.fin) { const ld = castTime(W, m, Tw) + landDelay(s, d), held = Math.max(e.st.stun || 0, e.st.root || 0); o.v = 0;
            // 굳힘형: 짝이 떨어지기 전에 모으기 시작해 굳힘 한가운데 닿게 한다(빗나가면 캔슬). 이미 걸렸으면 남은 굳힘 안에 닿을 때만
            if (bp.kind === 'bind') { const at = W.t + ld;
              if (held > ld + 0.02) { o.v = 60; o.tx = e.x; o.ty = e.y; }
              else if (W.t < bp.land && at >= bp.land + 0.05 && at <= bp.land + bp.bind - 0.05) { o.v = 60; const k = bp.land - W.t; o.tx = e.x + e.vx * k; o.ty = e.y + e.vy * k; }
              else if (W.t < bp.land && at < bp.land + 0.05) m.thinkT = Math.min(m.thinkT, Math.max(0.01, bp.land + 0.05 - at + 0.01));
              else if (W.t >= bp.land + 0.1) m.bigp = null; }
            // 젖음·빙판·몰이형: 그 상태이고 과녁이 당분간 못 구르거나 묶였을 때
            else if (noRoll && ((bp.kind === 'wet' && e.st.wet > 0) || (bp.kind === 'ice' && W.zones.some(z => z.src === m && z.k === 'ice' && B.C.inZone(z, e.x, e.y))) || (bp.kind === 'herd' && m.herd && W.t < m.herd.until))) {
              o.v = 60; const k = held > 0 ? 0 : 0.5; o.tx = e.x + e.vx * ld * k; o.ty = e.y + e.vy * ld * k; if (bp.kind === 'herd') { o.tx += -K.uy * m.herd.side * 1.2; o.ty += K.ux * m.herd.side * 1.2; }
            }
          }
        }
        dodgeAim.value(W, m, K, o);   // 피할 자리 겨냥 (상급부터)
        grab.value(W, m, K, o);       // 붙잡기 (대가부터)
      },
      commit(W, m, K, best, cast, Tc) {
        const T = K.T, e = K.e, d = K.d, s = best.s;
        grab.commit(W, m, K, s);
        if (!T.bigPlan) return;
        if (s.big && best.pin && !(Math.max(e.st.stun || 0, e.st.root || 0) > 0)) m.log.bigPin++;   // 굳힘·묶임 없이 몸 묶기·기둥·눈멂으로 붙잡은 과녁에 큰 수
        if (s.big) { if (m.bigp && s.n === m.bigp.fin) { m.log.bigPair++; if (m.bigp.kind === 'bind' && W.t < m.bigp.land) cast.pairLand = m.bigp.land; } m.bigp = null; }
        else if (PAIRS[s.n] && m.book.includes(PAIRS[s.n].fin) && !((m.cd[PAIRS[s.n].fin] || 0) > 0) && (K.eDown || (PAIRS[s.n].kind === 'wet' && (e.rollCd > 0.4 || e.stam < 1.5)))) { const pr = PAIRS[s.n]; m.bigp = { tgt: e, fin: pr.fin, kind: pr.kind, land: W.t + Tc + landDelay(s, d) + (s.t === 'cone' ? s.dur : 0), bind: bindOf(s, e), until: W.t + Tc + 4 }; }
      },
    };
  },
};
