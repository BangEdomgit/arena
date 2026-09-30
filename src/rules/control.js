'use strict';
/* 규칙: 몸 묶기 (rules.bodyBind, 1.11.0, SPEC 7·9장)
 * 발밑이 아니라 몸을 묶는다(소금 밑창이 막지 못한다): 균사(구르기 불가·걸음 × 0.6), 경직(구르기 불가·× 0.5, 절연이 막음), 석회(구르는 거리 절반), 족쇄(젖은 발만 묶임).
 * 불이 균사·족쇄를 풀고, 산이 석회를 녹이고, 비·흙 이불이 눈을 씻는다. 가두는 기둥(틀 cage). 눈멀면 예비동작을 못 읽는다(두뇌) */
module.exports = {
  name: 'control', switch: 'bodyBind', on: W => W.rules.bodyBind, form: { cage: 'target' },
  engine: X => ({
    // 불에 타면 균사가 타고 족쇄가 녹는다 (족쇄로 걸린 묶임만 풀린다)
    hurt(W, m, v, src, name, kind) { if (kind === 'fire' && (m.st.mycel > 0 || m.st.fetter > 0)) { if (m.st.fetter > 0 && m.st.root <= m.st.fetter + 1e-9) m.st.root = 0; m.st.mycel = 0; m.st.fetter = 0; } },
    eff(W, m, o, g) {
      if (o.mycel) m.st.mycel = Math.max(m.st.mycel || 0, o.mycel * g);
      if (o.cramp && !m.buf.elecRes) m.st.cramp = Math.max(m.st.cramp || 0, o.cramp * g);
      if (o.lime) m.st.lime = Math.max(m.st.lime || 0, o.lime * g);
      if (o.fetter && m.st.wet > 0) { m.st.fetter = Math.max(m.st.fetter || 0, o.fetter * g); m.st.root = Math.max(m.st.root || 0, o.fetter * g); }
    },
    rain(W, q) { q.st.blind = 0; },      // 비가 눈을 씻는다
    smother(W, m) { m.st.blind = 0; },   // 흙 이불도
    ring(W, m) { if (m.st.mycel > 0) m.st.mycel = 0; },   // 불고리가 제 몸의 균사를 태운다
    speedLate(W, m, sp) { if (m.st.cramp > 0) sp *= 0.5; else if (m.st.mycel > 0) sp *= 0.6; return sp; },
  }),
  // 가두는 기둥: 과녁 자리 둘레 s.r m에 기둥 넷을 ±60°·±120°에. 옆으로 피하는 길은 닫고, 나와 과녁 사이(앞)와 그 뒤는 열어 둔다
  types: X => ({
    cage(W, m, c, a) {
      const { cos, sin, clamp, hyp, hit } = X, s = c.s, tx = c.tx, ty = c.ty, hpS = 1 + (m.C - 1) * 0.5, rr = s.r; let h = false;
      for (let k = 0; k < 4; k++) { const b = a.aim + (k < 2 ? 1 : -1) * (k % 2 ? 2 : 1) * Math.PI / 3; W.walls.push({ x: clamp(tx + cos(b) * rr, 0.4, W.width - 0.4), y: clamp(ty + sin(b) * rr, 0.4, W.height - 0.4), r: s.pr, hp: s.hp * hpS, t: s.dur, own: m.side, cage: 1 }); }
      for (const q of a.foes) if (hyp(q.x - tx, q.y - ty) < rr - 0.5) h = true;
      if (h) hit(m, s);
    },
  }),
  // 두뇌: 눈멀면 못 읽는다. 붙잡는 마법은 과녁이 아직 안 걸렸을 때 쓴다. 큰 수(rules/risk)가 준비됐으면 그 큰 수를 확정시키는 붙잡기를 먼저 건다
  brain: B => {
    const { C, NONE, pinOf, pinned, afterPin, caged, castTime, landDelay, hitBack } = B;
    return {
      read(W, m, K) { K.blindR = m.st.blind > 0; },   // 눈멀면 예비동작과 구름을 못 읽고, 자동 진은 마지막 0.2 s에야 반응한다
      // 몸 묶기 계획 (대가·전설, + rules/risk): 붙잡기가 큰 수를 확정시킬 때만(지금 상태 + 이 붙잡기, 또는 + 준비된 다른 붙잡기 하나) 먼저 건다
      prep(W, m, K) {
        const { S, T, e, Dm, d } = K;
        if (!(W.rules.risk && T.bigPlan && Dm.bigs.length)) return;
        const bigs = Dm.bigs.filter(x => !((m.cd[x.n] || 0) > 0) && m.glu > x.cost + 3 && d < C.rangeOf(m, x) + 1);
        const ctOf = bigs.length ? x => castTime(W, m, x.cast * (1 - 0.35 * (m.mast[x.n] || 0))) : null;   // 큰 수가 있을 때만 만든다
        const pinNow = bigs.length > 0 && bigs.some(x => pinned(W, m, x, e, ctOf(x), d));
        const holds = bigs.length && !pinNow ? m.book.map(k => S[k]).filter(x => x && !x.big && pinOf(x, e) && !((m.cd[x.n] || 0) > 0)) : NONE;
        const pinBy = holds.length && ((x, x2) => { let st = afterPin(x, e, e.st), cg = x.t === 'cage'; if (x2) { st = afterPin(x2, e, st); cg = cg || x2.t === 'cage'; } return bigs.some(b => pinned(W, m, b, e, ctOf(b), d, st, cg)); });
        K.bigs = bigs; K.ctOf = ctOf; K.pinNow = pinNow; K.holds = holds; K.pinBy = pinBy;
      },
      value(W, m, K, o) {
        const e = K.e, d = K.d, s = o.s, Tw = o.Tw;
        if (s.t === 'move' && s.mv === 'vault' && caged(W, m)) { o.v = Math.max(o.v, 1.0); o.tx = m.x - K.uy * m.sf * 4; o.ty = m.y + K.ux * m.sf * 4; }   // 가두는 기둥을 넘는다 (옆으로)
        const h = s.hit || {};
        // 약한 공격으로 치지 않는다: 빈 간격을 채우면 머리만 뜨거워진다. 족쇄는 묶기(두 수 콤보가 잇는다), 나머지는 할 일이 없을 때만
        let ok = pinOf(s, e);
        if (h.mycel || h.lime || h.fetter || s.cramp || s.t === 'cage') { ok = ok && d < o.R && (K.los || s.t === 'cage') && !(s.t === 'cage' && (d < 4 || d > 10)); o.v = ok ? (h.fetter ? 0.6 : s.t === 'cage' ? 0 : 0.2) : 0; if (s.t === 'cage') { const k = castTime(W, m, Tw) * K.lead; o.tx = e.x + e.vx * k; o.ty = e.y + e.vy * k; } }   // 기둥은 시전이 끝날 때 과녁이 있을 자리에
        else ok = ok && o.v > 0;
        // 투사체 붙잡기는 과녁이 날아가는 동안 구를 수 없을 때만 (구르는 사람은 보이는 탄을 피한다)
        if (s.t === 'proj' && (h.mycel || h.lime || h.fetter) && e.rollCd <= castTime(W, m, Tw) + d / s.v && e.stam >= 1.5 && !K.eDown && !(e.st.mycel > 0 || e.st.cramp > 0)) { o.v = 0; ok = false; }
        if (K.holds.length && ok && !K.eDown && K.holds.includes(s) && hitBack(W, e, K.S, d) > castTime(W, m, Tw) + landDelay(s, d) + Math.min(...K.bigs.map(K.ctOf)) + 0.05) { if (K.pinBy(s)) o.v = Math.max(o.v, 1.2); else if (s.t !== 'cage' && K.holds.some(x => x !== s && K.pinBy(s, x))) o.v = Math.max(o.v, 0.7); }   // 기둥은 제 실 길도 가려 혼자 확정시킬 때만
      },
      commit(W, m, K, best) { if (K.holds.length && K.holds.includes(best.s) && best.v >= 0.7) m.log.pinTry++; },   // 큰 수를 위해 건 붙잡기
    };
  },
};
