'use strict';
/* 규칙: 고리 장부 3단계 (rules.ringLedger, v2.37, SPEC 59장, 수는 data/rules/ringLedger.json) — 기본 꺼짐, 서클 규칙(circles) 위에서
 * 1단계(rules/rings)는 읽어내기만 했다. 3단계는 장부 하나가 서클을 나눈다: 모든 일이 고리 하나씩을 쓴다
 *   늘 먼저(이미 쥔 것): 첫 칸(짓기·흐름) · 셋째 칸부터의 짓기(X) · 버팀 벽마다 · 몸 강화(빠르기·절연·둔기·독 막기 가운데 걸린 것)
 *   값으로 고른다(높은 것부터): 합창의 박자 · 두 번째 칸 · 붙잡음 · 날기(둘레가 위험하면 더) · 공기막 · 잔기술(전설의 켜 두기 중이면 더) · 자동 진(나를 겨눈 수가 있으면 더)
 *   고리가 모자라 못 받은 일은 내려놓는다: 날기 → 내려앉는다(두뇌 훅 bound가 flyWant를 끈다), 잔기술 → 끈다, 붙잡음 → 거둔다, 자동 진 → 쉰다(두뇌 훅 circles)
 * 동시에 짓기 = 빈 고리만큼(엔진의 두 칸 + 셋째 칸부터 X, 두뇌 훅 slot). X는 이 규칙이 쥐고 걸음마다 지어 풀며(엔진 훅 mageStep), 굳거나 쓰러지면 모두 흩어진다
 *   k번째 X: 머리 열 × (1 + x.heat (k + 1))·당 × (1 + x.glu (k + 1)). 동시에 짓는 수 n이 셋 넘으면 초당 머리 holdHeat × (n − 2): 많이 쥘 수 있어도 오래는 못 쥔다
 *   X도 상대의 예비동작 읽기에 보인다 (v2.38: 두뇌 훅 casts → brain/lib/casts, 읽는 자리가 cast·castB 다음에 본다)
 * 지표 (api.stats): 단계마다 고리가 꽉 찬 시간·고리 쓰임·내려놓은 시간, 시작할 때 동시에 짓는 수의 분포, X의 수·풀림·흩어짐 */
const P = require('../../data/rules/ringLedger.json'), CH = require('./chorus').api, PS = require('./passive').api;
let XX = null;   // 엔진의 것
const ST = new WeakMap(), XK = new WeakMap(), WS = new WeakMap();   // 사람 → 장부, X 시전 → k, 세계 → 지표
const tierOf = m => m.C >= 8 ? '대마법사' : m.C >= 4 ? '상위' : m.C >= 2 ? '중간' : m.C >= 0.9 ? '평범' : '병사';
const T0 = () => ({ T: 0, full: 0, ringT: 0, usedT: 0, drop: { fly: 0, psv: 0, hold: 0, auto: 0, B: 0 }, hist: [0, 0, 0, 0, 0, 0, 0, 0, 0], xN: 0, xRel: 0, xLost: 0, xDrop: 0 });
function wsOf(W) { let s = WS.get(W); if (!s) WS.set(W, s = { by: {} }); return s; }
function stOf(m) { let s = ST.get(m); if (!s) ST.set(m, s = { X: [], F: 0, R: 0, fly: true, film: true, psv: true, auto: true, hold: true, B: true, over: 0 }); return s; }
const KS = ['chorus', 'B', 'hold', 'fly', 'film', 'psv', 'auto'], VAL = [0, 0, 0, 0, 0, 0, 0], HAS = [false, false, false, false, false, false, false];
// 지금 쥔 수들이 풀릴 때 더해질 머리 열 (첫 칸 × 1, 두 번째 × 1.3, k번째 X × (1 + heat (k + 1)))
const TU = require('./tune').api, LN2 = Math.LN2;
// 한 시전이 풀릴 때의 머리 열 (손잡이를 돌렸으면 그 값: rules/tune의 비용 × log₂(1 + E), 숨기면 더)
function heatOf(c) { const s = c.s; let k = 1; if (c.tk) { const E = TU.energy(s, c.tz, c.tf, c.tv); k = XX.log(1 + E) / LN2 * (c.hid ? 1 + TU.P.hide.heat : 1); } return s.cost * 1.6 * k; }
function xAt(q, m) { const s = ST.get(q); if (!s) return false; for (let i = 0; i < s.X.length; i++) if (s.X[i].tgt === m) return true; return false; }   // 셋째 칸부터 나를 겨눴나
// 둘러싸여 위협이 많은가 (v2.38): 산 적이 all 이상(다수와 싸움)이거나, R m 안에 산 적이 n 이상이거나, 나를 겨눈 예비동작이 aim 이상이면 셋째 칸을 열지 않는다
function crowded(m, K) { const C = P.x.crowd; if (!C) return false; let near = 0, aim = 0, all = 0; const fs = K.foes;
  for (let i = 0; i < fs.length; i++) { const q = fs[i]; if (!(q.hp > 0)) continue; all++; const dx = q.x - m.x, dy = q.y - m.y; if (dx * dx + dy * dy < C.R * C.R) near++; if ((q.cast && q.cast.tgt === m) || (q.castB && q.castB.tgt === m) || xAt(q, m)) aim++; }
  return all >= C.all || near >= C.n || aim >= C.aim; }
function pend(m, S) { let h = 0; if (m.cast) h += heatOf(m.cast); if (m.castB) h += heatOf(m.castB) * 1.3; for (let i = 0; i < S.X.length; i++) h += heatOf(S.X[i]) * (1 + P.x.heat * (i + 2)); return h; }
// 장부: 이번 걸음의 일과 고리를 나눈다 (걸음마다, 새 객체 없이)
function alloc(X, W, m) {
  const S = stOf(m), V = P.v, R = W.rules.circles ? Math.max(1, m.circles) : 1; let fixed = 0;
  if (m.cast || m.chan) fixed++; fixed += S.X.length;
  for (const z of W.zones) if (z.up && z.src === m) fixed++;
  if (m.buf.speed || m.buf.elecRes || m.buf.bluntRes || m.buf.toxRes) fixed++;
  const flying = W.rules.flight && ((m.z >= 1 && m.fly === 1) || m.flyWant);
  let danger = false; if (flying) { for (const a of W.areas) if (a.src.side !== m.side && !a.vis && X.hyp(a.x - m.x, a.y - m.y) < a.r + P.danger) { danger = true; break; }
    if (!danger) for (const t of W.traps) if (t.src.side !== m.side && X.hyp(t.x - m.x, t.y - m.y) < P.danger) { danger = true; break; } }
  let aimed = false; if (W.rules.circles && m.circles >= 3) for (const q of W.foes[m.side]) if (q.hp > 0 && ((q.cast && q.cast.tgt === m) || (q.castB && q.castB.tgt === m) || xAt(q, m))) { aimed = true; break; }
  const b = m.castB, held = !!(b && b.hold && b.t >= b.T);
  HAS[0] = !!CH.of(W, m); VAL[0] = V.chorus; HAS[1] = !!b && !held; VAL[1] = V.B; HAS[2] = held; VAL[2] = V.hold;
  HAS[3] = !!flying; VAL[3] = danger ? V.flyDanger : V.fly; HAS[4] = !!flying && m.airFilm; VAL[4] = V.film;
  HAS[5] = m.st.psv > 0; VAL[5] = PS.holdOn && PS.holdOn(W, m) ? V.psvHold : V.psv; HAS[6] = !!(W.rules.circles && m.circles >= 3); VAL[6] = aimed ? V.autoAimed : V.auto;
  let left = R - fixed; S.over = left < 0 ? -left : 0; if (left < 0) left = 0;
  S.chorus = S.B = S.hold = S.fly = S.film = S.psv = S.auto = true;
  // 값이 높은 차례로 (일곱이라 고르기 정렬 없이 매번 가장 큰 것)
  for (let n = 0; n < 7; n++) { let bi = -1; for (let i = 0; i < 7; i++) if (HAS[i] && (bi < 0 || VAL[i] > VAL[bi])) bi = i; if (bi < 0) break; HAS[bi] = false;
    if (left > 0) left--; else S[KS[bi]] = false; }
  if (S.fly === false) S.film = false;
  S.R = R; S.F = left; return S;
}
module.exports = {
  name: 'ringLedger', switch: 'ringLedger', api: { P, stats: W => wsOf(W).by, extra: m => stOf(m).X, ledger: m => ST.get(m) || null, alloc: (W, m) => alloc(XX, W, m) },
  engine: X => {
    XX = X;
    return {
      mageStep(W, m) {
        const S = stOf(m), dt = W.dt;
        if (S.X.length) {   // 셋째 칸부터: 짓고 풀고, 굳거나 쓰러지면 흩어진다
          const by = wsOf(W).by[tierOf(m)];
          if (!(m.hp > 0) || (m.st.stun > 0 && P.x.lose)) { if (by) by.xLost += S.X.length; S.X.splice(0); }
          else if (!(m.st.stun > 0)) { let w = 0; for (let i = 0; i < S.X.length; i++) { const c = S.X[i]; c.t += dt; if (c.t >= c.T) { const k = XK.get(c) || 1; if (W.rules.fatigue && !c.s.mundane && m.fat + heatOf(c) * (1 + P.x.heat * (k + 1)) > P.x.dropAt) { if (by) by.xDrop++; continue; } if (by) by.xRel++; X.release(W, m, c); } else S.X[w++] = c; } if (w < S.X.length) S.X.splice(w); }   // 풀면 머리가 넘칠 X는 놓는다(흩어짐, 머리 열 없이)
        }
        const n = (m.cast || m.chan ? 1 : 0) + (m.castB ? 1 : 0) + S.X.length; if (n > 2 && W.rules.fatigue) m.fat += P.holdHeat * (n - 2) * dt;   // 오래는 못 쥔다
        const s = alloc(X, W, m);
        if (!s.hold && m.castB && m.castB.hold) m.castB = null;   // 붙잡은 수를 내려놓는다
        if (!s.psv && m.st.psv > 0) PS.off(W, m);
        // 지표
        const k = tierOf(m), WB = wsOf(W).by, by = WB[k] || (WB[k] = T0()); by.T += dt; by.ringT += s.R * dt; by.usedT += (s.R - s.F) * dt; if (s.F <= 0) by.full += dt;
        if (!s.fly) by.drop.fly += dt; if (!s.psv && m.st.psv > 0) by.drop.psv += dt; if (!s.auto) by.drop.auto += dt; if (!s.B) by.drop.B += dt;
      },
      release(W, m, c) { const k = XK.get(c); if (k == null || !W.rules.fatigue || c.s.mundane) return; m.fat += c.s.cost * 1.6 * P.x.heat * (k + 1); },   // c.s는 이미 손잡이가 박힌 사본(cost에 log₂(1 + E))   // k번째 X의 머리 열
    };
  },
  brain: B => ({
    // 숨 고를 때 (v2.38): 셋째 칸부터 쥔 수가 있으면 먼저 푼다. 상대의 보이는 공격(모든 칸)이 숨이 끝나기 전(breath.T + br.pad s)에 내 둘레(br.r m)에 닿으면 기다린다
    breath(W, m, K, go) { const s = ST.get(m); if (!go || !s) return go; if (s.X.length) return false; const BR = P.br, lim = BR.T + BR.pad;
      for (const q of K.foes) { if (!(q.hp > 0)) continue; const d = B.C.hyp(q.x - m.x, q.y - m.y); for (let j = 0, xs = B.castsX(W, q), jn = 2 + xs.length; j < jn; j++) { const c = B.castAt(q, j, xs);
        if (!c || c.unseen || !B.OFF[c.s.t] || c.T - c.t + B.landDelay(c.s, d) > lim) continue; if (c.tgt === m || B.C.hyp(c.tx - m.x, c.ty - m.y) < BR.r + (c.s.r || 0)) return false; } }
      return go; },
    casts(W, q, a) { const s = ST.get(q); return s && s.X.length ? s.X : a; },   // 셋째 칸부터의 시전 (예비동작 읽기가 본다, v2.38)
    heat(W, m, h) { const s = ST.get(m); if (!s || !s.X.length) return h; let x = 0; for (let i = 0; i < s.X.length; i++) x += heatOf(s.X[i]) * (1 + P.x.heat * (i + 2)); return h + x + P.holdHeat * Math.max(0, (m.cast || m.chan ? 1 : 0) + (m.castB ? 1 : 0) + s.X.length - 2); },   // 쥔 셋째 칸부터의 수가 풀릴 때의 머리 열 + 1 s의 오래 쥠 (손잡이·스스로 죽지 않기가 본다)
    circles(W, q, c) { const s = ST.get(q); if (!s) return c; return s.auto ? 3 : s.F >= 1 ? 2 : 1; },   // 장부가 정한 수: 자동 진이 고리를 받았나, 두 번째 칸에 빈 고리가 있나 (맨 뒤라 다른 규칙의 깎기를 덮는다)
    slot(W, m, K, slot) {
      const s = ST.get(m); if (!s) return slot;
      if (slot === 'B' && s.F < 1) return '';
      if (!slot && (m.cast || m.chan) && m.castB && s.F >= 1 && K.T.slotB && m.fat < P.x.fatMax && m.glu > P.x.gluMin && !crowded(m, K)) return 'X';   // 빈 고리만큼 더 (둘러싸였으면 열지 않는다, v2.38)
      return slot;
    },
    commit(W, m, K, best, cast) {
      const s = stOf(m), WB = wsOf(W).by, k = tierOf(m), by = WB[k] || (WB[k] = T0());
      if (K.slot === 'X') { s.X.push(cast); const x = s.X.length; XK.set(cast, x); m.glu -= best.cost * P.x.glu * (x + 1); if (m.glu < 0) m.glu = 0; by.xN++; }
      const n = (m.cast || m.chan ? 1 : 0) + (m.castB ? 1 : 0) + s.X.length; by.hist[n < 8 ? n : 8]++;   // 시작할 때 동시에 짓는 수
    },
    bound(W, m, K) { const s = ST.get(m); if (!s) return; if (!s.fly && m.flyWant) m.flyWant = false; if (!s.psv && m.st.psv > 0) PS.off(W, m); },   // 내려놓은 날기·잔기술
    valueLate(W, m, K, o) { const s = ST.get(m); if (!s || !(o.v > 0)) return;
      if (W.rules.fatigue && (s.X.length || K.slot === 'X') && m.fat + pend(m, s) + o.s.cost * 1.6 * (K.slot === 'X' ? 1 + P.x.heat * (s.X.length + 2) : K.slot === 'B' ? 1.3 : 1) > (K.slot === 'X' ? P.x.heatCap : P.x.capAll)) { o.v = 0; return; }   // 쥔 수들이 풀릴 때의 머리 열까지 셈해 넘치면 셋째 칸부터는 짓지 않는다
      const b = o.s.b; if (o.s.t === 'buff' && b && (b.speed || b.elecRes || b.bluntRes || b.toxRes) && s.F < 1) o.v = 0; },   // 몸 강화도 고리가 있어야
  }),
};
