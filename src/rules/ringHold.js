'use strict';
/* 규칙: 붙잡기 (rules.ringHold, v2.39, SPEC 60장, 수는 data/rules/ringHold.json) — 기본 꺼짐, 고리 장부(rules.ringLedger) 위에서만
 * 뇌가 짓고 띠가 붙잡아 돌린다: 서클의 차이는 "동시에 몇 개를 짓나"가 아니라 "몇 개를 붙잡고 돌리나"에서. 붙잡은 것은 하나에 고리 하나(장부가 센다: ringLedger api.ext)
 * 1 새긴 진(자동 진 여럿·종류): 싸우기 전(첫 걸음)에 새긴다(늘 먼저 고리를 받는다). 수 = 선명도 단계의 최대와 (서클 − 일하는 고리) 가운데 적은 쪽(arrays.n). 차례 arrays.order:
 *   자동 대처(react: 지금의 자동 진, rules/multiSlot) → 자동 잔기술(psv0·psv1…: 상대들의 책에 많은 피해 종류부터) → 자동 쿠션(날기가 켜진 판) → 자동 치유 → 둘째 자동 대처(다시 도는 간격이 짧아진다)
 *   반사라 고르지 않는다. 자동 잔기술: 그 종류의 보이는 공격(예비동작·떨어지는 구름·날아오는 투사체)이 auto.lead s 안에 내 둘레(auto.r m, 투사체는 auto.pr m)에 닿으면
 *   auto.on s 켜진다. 빗나갈 수에도 켜진다(헛켜짐). 켤 때마다 머리 auto.heat. 숨긴 수(unseen)엔 움직이지 않고, 눈이 멀면 쉰다
 *   자동 치유(베임에 지혈): 둔기 상처가 heal.min 넘으면 피해 × (1 − heal.k), heal.cd s마다, 머리 heal.heat. 자동 쿠션: 추락 피해 × cushion.k
 * 2 잔기술 여럿을 함께 켜 두기: 잔기술(rules/passive)의 st.psv 하나 위에 더 켜 둔다(종류마다 고리 하나, 장부의 값 v.more, 초당 머리 psv.heat). 판단 수준 tac.passive ≥ psv.L
 *   바라는 종류: 사거리 안의 상대가 쥔 준비된 수의 종류(빛나는 고리를 읽는다) + 전설의 절연 막 켜 두기(rules/passive hold). 지금 켠 잔기술의 종류는 빼고
 * 3 준비된 수(tac.passive ≥ prep.L, 대가·전설): 조용할 때(나를 겨눈 수가 없고, 둘러싸이지 않았고, 첫 칸이 짓는 중) 셋째 칸 대신 지어 붙잡아 둔다(두뇌 훅 slot 'P')
 *   다 지으면 그때 머리 열을 낸다(풀 때는 안 낸다). 붙잡는 동안은 하나에 초당 머리 prep.heat(띠가 돌린다). 굳거나 쓰러지면 흩어진다
 *   기회에 한꺼번에 푼다(두뇌 훅 bound): 과녁이 굳음·묶임·숨·떨어짐·눈멂이거나 큰 수를 짓는 중. 나를 겨눈 수가 prep.loseT s 안에 닿을 때(굳으면 흩어지니). 아니면 다 쥐고(cap) prep.wait s, 또는 prep.maxHold s가 지났을 때
 *   상대는 빛나는 고리를 세어 읽는다: 쥔 준비된 수가 있고 그 사거리 안이면 숨을 마시지 않는다(두뇌 훅 breath), 그 종류의 잔기술을 켜 둔다(위 2)
 * 지표 (api.stats): 단계마다 새긴 진(종류별), 자동 잔기술의 켜짐·헛켜짐·막은 피해, 치유·쿠션, 함께 켠 잔기술 시간, 준비된 수(지음·풂·흩어짐·한꺼번에 푼 수의 분포·쥔 수의 시간 분포) */
const P = require('../../data/rules/ringHold.json'), RL = require('./ringLedger').api, PS = require('./passive').api, GF = require('./gunfire').api;
const { castsX, castAt } = require('../brain/lib/casts');
let XX = null;   // 엔진의 것
const ST = new WeakMap(), PK = new WeakMap(), WS = new WeakMap();   // 사람 → 붙잡기, 준비된 수, 세계 → 지표
const tierOf = m => m.C >= 8 ? '대마법사' : m.C >= 4 ? '상위' : m.C >= 2 ? '중간' : m.C >= 0.9 ? '평범' : '병사';
const OFFT = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, PREPT = { proj: 1, thread: 1, area: 1, lob: 1 };
const landDelay = (s, d) => s.t === 'proj' ? d / s.v : s.t === 'area' ? s.delay : s.t === 'lob' ? s.flight : s.t === 'thread' ? d / (32 * (s.fast || 1)) : 0;
const T0 = () => ({ T: 0, n: 0, arr: {}, trig: [0, 0, 0, 0], fals: [0, 0, 0, 0], blk: [0, 0, 0, 0], heal: 0, healV: 0, cush: 0, cushV: 0, exT: 0, exOn: 0, pT: 0, pB: 0, pRel: 0, pLost: 0, burst: [0, 0, 0, 0, 0, 0, 0, 0, 0], held: [0, 0, 0, 0, 0, 0, 0, 0, 0], readW: 0 });
function wsOf(W) { let s = WS.get(W); if (!s) WS.set(W, s = { by: {} }); return s; }
function byOf(W, m) { const WB = wsOf(W).by, k = tierOf(m); return WB[k] || (WB[k] = T0()); }
// 싸우기 전에 새긴다: 선명도 단계의 수만큼, 차례대로 (자동 잔기술은 상대들의 책에 많은 피해 종류부터)
function engrave(W, m) {
  let n = 0; for (const t of P.arrays.n) if (m.C >= t[0]) { n = Math.max(0, Math.min(t[1], (W.rules.circles ? m.circles : 1) - t[2])); break; }   // 단계의 최대와 (서클 − 일하는 고리) 가운데 적은 쪽
  const out = []; if (!n) return out;
  const cnt = [0, 0, 0, 0]; for (const q of W.foes[m.side]) for (const x of q.book) { const s = W.spells[x]; if (s && OFFT[s.t] && !s.mundane) cnt[PS.psvOf(s)]++; }
  const ks = [1, 2, 3].filter(i => cnt[i] > 0).sort((a, b) => cnt[b] - cnt[a] || a - b);
  for (const k of P.arrays.order) { if (out.length >= n) break;
    if (k.startsWith('psv')) { const i = +k.slice(3); if (i < ks.length) out.push('psv' + ks[i]); }   // psv0: 가장 많은 종류, psv1: 둘째…
    else if (k === 'cushion') { if (W.rules.flight) out.push(k); }
    else out.push(k); }
  return out;
}
// 사람의 붙잡기. au[k] 자동 잔기술이 켜진 끝(시각, 판정하면 −9) · auHit[k] 그동안 막았나 · ex[k] 함께 켠 잔기술(켠 시각, −1 꺼짐) · wantK·wantN 바라는 종류 · prep 준비된 수 · pT 다 지어 쥔 첫 때
function stOf(W, m) {
  let s = ST.get(m); if (s) return s;
  const arr = engrave(W, m); ST.set(m, s = { arr, react: arr.indexOf('react') >= 0, reactN: arr.filter(k => k === 'react').length, au: [-9, -9, -9, -9], auHit: [false, false, false, false], auto: [false, arr.indexOf('psv1') >= 0, arr.indexOf('psv2') >= 0, arr.indexOf('psv3') >= 0],
    heal: arr.indexOf('heal') >= 0, cushion: arr.indexOf('cushion') >= 0, ex: [-1, -1, -1, -1], wantK: [0, 0, 0], wantN: 0, hcd: -9, prep: [], pT: -1 });
  const by = byOf(W, m); by.n++; for (const k of arr) by.arr[k] = (by.arr[k] || 0) + 1;
  return s;
}
function readyN(s) { let n = 0; for (let i = 0; i < s.prep.length; i++) if (s.prep[i].t >= s.prep[i].T) n++; return n; }
// 그 종류의 보이는 공격이 곧 내 둘레에 닿나 (반사: 빗나갈 수에도)
function soon(W, m, k) {
  const L = P.auto.lead, R = P.auto.r;
  for (const q of W.foes[m.side]) { if (!(q.hp > 0)) continue; const d = XX.hyp(q.x - m.x, q.y - m.y);
    for (let j = 0, xs = castsX(W, q), jn = 2 + xs.length; j < jn; j++) { const c = castAt(q, j, xs); if (!c || c.unseen || !OFFT[c.s.t] || PS.psvOf(c.s) !== k || c.T - c.t + landDelay(c.s, d) > L) continue;
      if (c.tgt === m || XX.hyp(c.tx - m.x, c.ty - m.y) < R + (c.s.r || 0)) return true; } }
  for (const a of W.areas) if (a.vis && a.src.side !== m.side && a.t < L && PS.psvOf(a.s) === k && XX.hyp(a.x - m.x, a.y - m.y) < a.r + R) return true;
  for (const p of W.proj) { if (p.dead || !p.src || p.src.side === m.side || PS.psvOf(p.s) !== k) continue; const dx = m.x - p.x, dy = m.y - p.y, v2 = p.vx * p.vx + p.vy * p.vy; if (!v2) continue;
    const t = (dx * p.vx + dy * p.vy) / v2; if (t > 0 && t < L && XX.hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < P.auto.pr) return true; }
  return false;
}
const exOn = (W, s, k) => s.ex[k] >= 0 && W.t - s.ex[k] >= PS.P.onT;
// 장부에 알리는 일 (rules/ringLedger alloc): 새긴 진·준비된 수는 늘 먼저, 함께 켜 둘 잔기술은 값 more로 여럿
RL.ext({ on: (W, m) => !!W.rules.ringHold && m.hp > 0, fixed: (W, m) => { const s = stOf(W, m); return s.arr.length + s.prep.length; }, want: (W, m) => stOf(W, m).wantN, value: () => P.v.more });
module.exports = {
  name: 'ringHold', switch: 'ringHold', on: W => W.rules.ringHold && W.rules.ringLedger,
  api: { P, stats: W => wsOf(W).by, of: m => ST.get(m) || null, hold: (W, m, c) => { stOf(W, m).prep.push(c); PK.set(c, 1); }, readyN: m => { const s = ST.get(m); return s ? readyN(s) : 0; }, engrave },
  engine: X => {
    XX = X;
    return {
      mageStep(W, m) {
        const s = stOf(W, m), by = byOf(W, m), dt = W.dt;
        if (!(m.hp > 0)) { if (s.prep.length) { by.pLost += s.prep.length; s.prep.splice(0); } return; }
        by.T += dt;
        if (s.reactN > 1 && m.autoCd > 0) m.autoCd -= (s.reactN - 1) * dt;   // 자동 대처를 여럿 새겼으면 그만큼 빨리 다시 돈다
        // 1 자동 잔기술: 끝난 창을 판정하고(막은 것이 없으면 헛켜짐), 그 종류가 곧 닿으면 켠다
        for (let k = 1; k < 4; k++) { if (!s.auto[k]) continue;
          if (s.au[k] > 0 && W.t >= s.au[k]) { if (!s.auHit[k]) by.fals[k]++; s.au[k] = -9; }
          if (s.au[k] < 0 && !(m.st.blind > 0) && soon(W, m, k)) { s.au[k] = W.t + P.auto.on; s.auHit[k] = false; by.trig[k]++; if (W.rules.fatigue) m.fat += P.auto.heat; } }
        // 2 함께 켜 둔 잔기술: 장부가 준 고리(more)만큼 바라는 차례로
        const L = RL.ledger(m), got = L ? L.more : 0; let on = 0;
        for (let k = 1; k < 4; k++) { let w = -1; for (let i = 0; i < s.wantN; i++) if (s.wantK[i] === k) { w = i; break; }
          if (w >= 0 && w < got && !(m.fat > PS.P.fatOff)) { if (s.ex[k] < 0) { s.ex[k] = W.t; by.exOn++; } on++; } else s.ex[k] = -1; }
        if (on) { by.exT += on * dt; if (W.rules.fatigue) m.fat += P.psv.heat * on * dt; }
        // 3 준비된 수: 짓고, 다 지으면 머리 열을 그때 내고, 붙잡는 동안은 싸게. 굳으면 흩어진다
        if (s.prep.length) {
          if (m.st.stun > 0) { by.pLost += s.prep.length; s.prep.splice(0); s.pT = -1; }
          else { let ready = 0;
            for (let i = 0; i < s.prep.length; i++) { const c = s.prep[i]; if (c.t < c.T) { c.t += dt; if (c.t >= c.T) { c.t = c.T; if (W.rules.fatigue && !c.s.mundane) m.fat += RL.heatOf(c); } } if (c.t >= c.T) ready++; }
            if (ready) { if (s.pT < 0) s.pT = W.t; if (W.rules.fatigue) m.fat += P.prep.heat * ready * dt; }
            if (W.rules.fatigue && m.fat > 100) { m.st.stun = Math.max(m.st.stun || 0, 1); m.fat = 55; m.log.over++; m.cast = m.castB = m.chan = null; by.pLost += s.prep.length; s.prep.splice(0); s.pT = -1; } } }   // 다 지은 열에 머리가 넘쳤다(폭주)
        if (m.tac.passive >= P.prep.L) { by.pT += dt; const r = readyN(s); by.held[r < 8 ? r : 8] += dt; }
      },
      hurtMod(W, m, v, kind, name) {
        const s = ST.get(m); if (!s) return v; const k = PS.KIND[kind] || 0;
        if (k && !(W.rules.gunfire && GF.isGun(W, name))) { const au = W.t < s.au[k]; if (au) s.auHit[k] = true;   // 그 종류가 닿았다: 헛켜짐이 아니다
          if ((au || exOn(W, s, k)) && !(PS.active(m) && m.st.psv === k)) { byOf(W, m).blk[k] += v * (1 - PS.P.k); v *= PS.P.k; } }   // 잔기술이 이미 그 종류를 막았으면 겹치지 않는다
        if (s.heal && kind === 'blunt' && v >= P.heal.min && W.t >= s.hcd) { const by = byOf(W, m); by.heal++; by.healV += v * P.heal.k; v *= 1 - P.heal.k; s.hcd = W.t + P.heal.cd; if (W.rules.fatigue) m.fat += P.heal.heat; }   // 베임에 지혈
        if (s.cushion && name === '추락') { const by = byOf(W, m); by.cush++; by.cushV += v * (1 - P.cushion.k); v *= P.cushion.k; }   // 떨어짐에 공기 쿠션
        return v;
      },
      effHold(W, m, o, g) { const s = ST.get(m); return s && o.kind === 'elec' && o.stun && (W.t < s.au[1] || exOn(W, s, 1)) && !(PS.active(m) && m.st.psv === 1) ? g * PS.P.stunK : g; },   // 절연 막: 전기 굳힘이 짧다
      release(W, m, c) { if (PK.has(c) && W.rules.fatigue && !c.s.mundane) m.fat -= c.s.cost * 1.6; },   // 준비된 수의 머리 열은 다 지을 때 냈다 (바탕이 풀 때 더하는 몫을 미리 뺀다)
    };
  },
  brain: B => {
    // 조용한가: 나를 겨눈 수가 없고, 둘러싸이지 않았다
    function quiet(W, m, K) {
      if (K.aimed || K.threat || RL.crowded(m, K)) return false;
      for (const q of K.foes) { if (!(q.hp > 0)) continue; for (let j = 0, xs = castsX(W, q), jn = 2 + xs.length; j < jn; j++) { const c = castAt(q, j, xs); if (c && !c.unseen && c.tgt === m && c.T - c.t < P.prep.quietT) return false; } }
      return true;
    }
    // 쥔 준비된 수의 가장 먼 사거리 (상대가 읽는다)
    function reach(q, s) { let r = 0; for (const c of s.prep) if (c.t >= c.T) { const x = B.C.rangeOf(q, c.s); if (x > r) r = x; } return r; }
    return {
      circles(W, q, c) { const s = ST.get(q); return !s || s.react ? c : Math.min(c, 2); },   // 자동 대처를 새기지 않았으면 자동 진이 없다 (장부 뒤라 덮는다)
      slot(W, m, K, slot) {
        const s = ST.get(m), L = RL.ledger(m); if (!s || !L || !(m.tac.passive >= P.prep.L) || (slot !== '' && slot !== 'X') || !(m.cast || m.chan)) return slot;
        if (L.F < 1 || s.prep.length >= P.prep.cap || m.fat >= P.prep.fatMax || m.glu <= P.prep.gluMin || !quiet(W, m, K)) return slot;
        return 'P';
      },
      valueLate(W, m, K, o) {
        if (K.slot !== 'P' || !(o.v > 0)) return;
        const s = o.s; if (!PREPT[s.t] || s.big || s.chorusOnly || s.mundane) { o.v = 0; return; }
        let h = m.fat + B.pendHeat(W, m); const st = ST.get(m); if (st) for (const c of st.prep) if (c.t < c.T) h += RL.heatOf(c);
        if (W.rules.fatigue && h + s.cost * 1.6 * P.prep.hk > P.prep.heatCap) o.v = 0;   // 다 지을 때의 머리 열까지 셈해 넘치면 쥐지 않는다
      },
      commit(W, m, K, best, cast) { if (K.slot !== 'P') return; const s = stOf(W, m); s.prep.push(cast); PK.set(cast, 1); byOf(W, m).pB++; },
      // 기회에 한꺼번에 푼다. 함께 켜 둘 잔기술을 고른다(상대가 쥔 준비된 수를 읽는다)
      bound(W, m, K) {
        const s = ST.get(m); if (!s || m.hp <= 0) return;
        if (m.tac.passive >= P.psv.L) { let n = 0; const cnt = [0, 0, 0, 0];
          for (const q of K.foes) { const sq = ST.get(q); if (!sq || !(q.hp > 0) || !sq.prep.length) continue; const d = B.C.hyp(q.x - m.x, q.y - m.y); for (const c of sq.prep) if (c.t >= c.T && !c.hid && d < B.C.rangeOf(q, c.s) + 5) cnt[PS.psvOf(c.s)]++; }
          if (PS.holdOn && PS.holdOn(W, m)) cnt[1] += 9;
          for (let r = 0; r < 3; r++) { let bk = 0; for (let k = 1; k < 4; k++) if (cnt[k] > 0 && k !== m.st.psv && (bk === 0 || cnt[k] > cnt[bk])) bk = k; if (!bk) break; s.wantK[n++] = bk; cnt[bk] = 0; }
          s.wantN = n; }
        if (!s.prep.length || m.st.stun > 0 || m.st.breath > 0) return;
        const ready = readyN(s), e = K.e; if (!ready || !e || !(e.hp > 0) || K.los === false) return;
        const big = (e.cast && e.cast.s.big) || (e.castB && e.castB.s.big), open = e.st.stun > 0 || e.st.root > 0 || e.st.breath > 0 || e.fly === 2 || e.st.blind > 0 || !!big;
        const th = K.threat || K.late, lose = !!(th && th.T - th.t < P.prep.loseT);   // 곧 맞는다: 굳으면 흩어지니 쥔 것을 먼저 푼다
        if (!(open || lose || (ready >= P.prep.cap && W.t - s.pT >= P.prep.wait) || W.t - s.pT >= P.prep.maxHold)) return;
        const d = B.C.hyp(e.x - m.x, e.y - m.y); let n = 0, w = 0;
        for (let i = 0; i < s.prep.length; i++) { const c = s.prep[i];
          if (c.t >= c.T && d <= B.C.rangeOf(m, c.s)) { const ld = landDelay(c.s, d); c.tgt = e; c.tx = e.x + e.vx * ld; c.ty = e.y + e.vy * ld; B.C.release(W, m, c); n++; }
          else s.prep[w++] = c; }
        if (w < s.prep.length) s.prep.splice(w);
        if (n) { const by = byOf(W, m); by.pRel += n; by.burst[n < 8 ? n : 8]++; s.pT = readyN(s) ? W.t : -1; }
      },
      // 숨 고를 때: 사거리 안의 상대가 준비된 수를 쥐고 있으면 마시지 않는다(빛나는 고리를 센다)
      breath(W, m, K, go) {
        if (!go) return go;
        for (const q of K.foes) { const sq = ST.get(q); if (!sq || !(q.hp > 0) || !sq.prep.length) continue; if (B.C.hyp(q.x - m.x, q.y - m.y) < reach(q, sq)) { byOf(W, m).readW++; return false; } }
        return go;
      },
    };
  },
};
