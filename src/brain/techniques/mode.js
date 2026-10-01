'use strict';
/* 기술: 공격 방식 (v2.12, tac.mode 1 초보 ~ 5 전설, SPEC 36장, 수는 data/mode.json) — 두뇌가 먼저 방식을 고르고 그 안에서 마법을 고른다
 * 방식 (K.mode):
 *   poke 견제: 싸고 빠른 던지기(당 4 이하·시전 0.6 s 이하)를 띄엄띄엄(pokeGap 1 s). 상대를 움직이게 하고 구르기·기력을 깎는다. 상대가 멀쩡하고(체력 절반 넘게) 잘 피할 때
 *   sure 확정타: 상대가 못 피하는 순간(굳음·묶임·꺼짐·빈손·숨 마시는 중·끊어 떨어지는 중·기력 바닥·시전에 묶임·눈멂·나를 못 봄) 안에 닿는 것 가운데 가장 센 것
 *     피할 수 없는 공격(번쩍임)도 확정타로 (대가부터. 가까운 실·젖은 상대의 체인은 이 엔진에선 피해져 넣지 않았다). 대가부터는 묶는 수로 확정 순간을 만든다(큰 수가 남아 있으면 묶기 × 1.4: 그 뒤는 확정타가 잇는다)
 *   cover 덮기(난사): 상대가 coverH 0.75 s 안에 갈 수 있는 곳(제자리·좌우 구르기·뒤로 달리기·떠오르기)을 그리고 바위·벽·싸움터 끝·소금 원·내 함정으로 막힌 곳을 지운 뒤
 *     남은 곳을 칸마다 나눠 덮는다(두 번째 칸도 공격). 덮을 수단(하늘이면 투사체·실, 땅이면 지연 폭발·곡사도)이 둘 이상일 때만. 상대가 구르기를 방금 썼거나 기력이 없을 때, 몰렸을 때(갈 곳의 절반 넘게 막힘), 떠 있을 때, 셋 넘게 뭉쳤을 때
 *   big 큰 한 방: 숨은 자리(서로 안 보임)에서 첫 수로(hiddenT 3 s 쉬었으면) 큰 수(덱 가장 센 것의 0.6 이상) × bigK. 확정 순간이 큰 수의 예고보다 길면 확정타가 큰 수를 고른다
 *   throw 던지기: 장악권 싸움에서 밀릴 때(상대 자리의 내 몫 0.5 아래), 멀 때(가장 긴 사거리의 0.75 넘게), 벽 뒤 상대: 곡사 × 1.9, 곧은 투사체 × 1.6 (나는 상대엔 곡사 × 0.3)
 * 판단 단계 (tac.mode):
 *   1 초보: 같은 마법 반복(지난 마법 × repeatK) · 2 중급: 굳은 상대에 친다(확정타만) · 3 상급: 견제와 확정타를 오가고 몰리면 덮기(갈 곳을 지우지 않는다), 던지기
 *   4 대가: 갈 곳을 계산한 덮기(구르기·기력·하늘·뭉침에도), 확정 순간 만들어 잇기, 숨은 자리의 큰 한 방
 *   5 전설: 견제로 구르기를 빼낸 뒤 구르기가 돌기 전에(baitT 2 s 안) 덮기, 큰 수는 확정 순간·숨은 자리에서만(아니면 × 0.3), 방식을 다시 고르는 박자를 흔든다(0.3~1 s)
 * 덮기 뒤 머리가 heat 70 넘으면 숨(rules/breath가 K.coverDone을 본다)
 * 기록 (m.mlog.mode): 방식별 시간(t)·시전 수(n), 큰 수 시전·확정 순간 안의 큰 수, 덮기의 갈 곳 덮은 비율 합, 구르기 빼낸 뒤 덮기. 명중·피해 몫은 metrics/watch가 시전의 mode로 */
const { C, hyp, OFF, estDmg, castTime, landDelay, deck } = require('../util');
const P = require('../../../data/mode.json');
const lv = m => m.tac.mode || 0;
let SR = null;   // 소금 원의 안전 반경 (규칙 api, 처음 부를 때)
const saltSafe = (W, x, y) => { if (!W.rules.saltRing) return true; if (!SR) SR = C.RULES.find(r => r.name === 'saltRing').api; return SR.safeAt(W, x, y); };
// 확정 순간: 상대가 앞으로 못 피할 시간 (s)
function sureWin(W, m, K) {
  const e = K.e, st = e.st; let w = st.stun || 0;
  if (st.root > w) w = st.root; if (e.crash > w) w = e.crash; if (e.emptyT - W.t > w) w = e.emptyT - W.t; if (st.breath > w) w = st.breath; if (st.blind > w) w = st.blind;
  if (e.fly === 3 && e.z > 0.3 && w < 0.4) w = 0.4;   // 끊어 떨어지는 중: 착지까지
  if (e.fly === 0 && e.z < 1 && e.stam < 1.5) { const t = (1.5 - e.stam) / 0.8; if (t > w) w = t; }   // 기력 바닥: 구르지 못한다
  const c = e.cast; if (c && c.s.lock && c.T - c.t > w) w = c.T - c.t;   // 시전에 묶임
  if (!K.los && w < 0.5) w = 0.5;   // 나를 못 본다
  return w;
}
// 피할 수 없는 공격 (대가부터): 번쩍임
// (가까운 실·젖은 상대의 체인도 받았으나 이 엔진에선 피해진다: 전설끼리 30판, 8 m 안의 짧은 실 8~23%, 젖은 상대의 체인 0~9% 맞음. 그래서 번쩍임만)
const unavoidable = (s, K) => s.t === 'flash';
const isBig = (m, s, K) => !!s.big || estDmg(s) >= 0.6 * deck(m, K.S).offMax;
// 상대가 coverH 안에 갈 수 있는 곳 (K.covPts에 x, y, 하늘(1) 셋씩, K.covN개). 막힌 곳은 지운다(full). 갈 곳 가운데 막힌 몫을 돌려준다
function reach(W, m, K, full) {
  const e = K.e, h = P.coverH, ux = K.ux, uy = K.uy, ex = e.x + e.vx * h * 0.5, ey = e.y + e.vy * h * 0.5, pts = K.covPts || (K.covPts = new Array(18).fill(0)), fl = e.z >= 1;
  const side = fl ? P.flyD : (e.rollCd <= h && e.stam >= 1.5 ? P.rollD : 0);
  let n = 0, all = 0, cut = 0;
  const add = (x, y, air) => { all++; if (full) { if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1 || !saltSafe(W, x, y) || C.blocked(W, e.x, e.y, x, y, air ? 3 : 0)) { cut++; return; } for (const t of W.traps) if (t.src === m && hyp(t.x - x, t.y - y) < (t.r || 1)) { cut++; return; } } pts[n * 3] = x; pts[n * 3 + 1] = y; pts[n * 3 + 2] = air; n++; };
  add(ex, ey, fl ? 1 : 0);   // 제자리
  if (side) { add(ex - uy * side, ey + ux * side, fl ? 1 : 0); add(ex + uy * side, ey - ux * side, fl ? 1 : 0); }   // 좌우 구르기 (날면 옆으로 꺾기)
  add(ex + ux * P.runV * h, ey + uy * P.runV * h, fl ? 1 : 0);   // 뒤로
  if (!fl && e.tac.flySkill && W.rules.flight) add(ex, ey, 1);   // 떠오르기
  K.covN = n; return all ? cut / all : 0;
}
// 점 (x, y, 하늘)을 마법 s가 (tx, ty)에 떨어져 덮는가
function covers(W, m, s, tx, ty, x, y, air) {
  if (air) { if (!(s.t === 'proj' || s.t === 'thread')) return false; return hyp(tx - x, ty - y) < 1.2; }
  const r = s.t === 'area' || s.t === 'lob' ? (s.r || 1) * C.sizeOf(m, s) + 0.3 : 1.2; return hyp(tx - x, ty - y) < r;
}
// 이미 내 수(짓는 칸·떨어질 지연 폭발·곡사)가 덮은 점인가
function taken(W, m, i) {
  const p = m._k.covPts, x = p[i * 3], y = p[i * 3 + 1], air = p[i * 3 + 2];
  for (let j = 0; j < 2; j++) { const c = j ? m.castB : m.cast; if (c && !c.auto && OFF[c.s.t] && covers(W, m, c.s, c.tx, c.ty, x, y, air)) return true; }
  if (!air) { for (const a of W.areas) if (a.src === m && hyp(a.x - x, a.y - y) < a.r) return true; for (const l of W.lobs) if (l.src === m && hyp(l.x - x, l.y - y) < l.r) return true; }
  return false;
}
// 방식 고르기 (판단마다, 마법의 값 앞)
function pick(W, m, K) {
  const L = lv(m); if (!L) return;
  const ml = m.mlog.mode, dt = W.t - K.modeAt; if (dt > 0 && dt < 1) ml.t[K.mode || 'none'] = (ml.t[K.mode || 'none'] || 0) + dt; K.modeAt = W.t;
  if (L === 1) { K.mode = 'repeat'; return; }
  const e = K.e, w = sureWin(W, m, K);
  K.sureW = w; K.bait = false;
  if (L === 2) { K.mode = w > 0.15 ? 'sure' : ''; if (K.mode) K.pressB = true; return; }
  let un = false; if (L >= 4) for (const n of m.book) { const s = K.S[n]; if (s && unavoidable(s, K) && !((m.cd[n] || 0) > 0) && m.glu >= s.cost && (s.t !== 'thread' || K.los)) { un = true; break; } }
  if (w > 0.15 || un) { K.mode = 'sure'; K.pressB = true; return; }   // 확정 순간은 늘 먼저 본다
  if (W.t < K.modeT && K.mode !== 'sure') { if (K.mode === 'cover') reach(W, m, K, L >= 4); if (K.mode === 'cover' || K.mode === 'big') K.pressB = true; return; }   // 방식은 정한 동안 붙든다
  K.modeT = W.t + (L >= 5 && P.l5.jitter ? P.every[4] + W.rng() * (P.every5Hi - P.every[4]) : P.every[L - 1]);   // 전설: 방식을 바꾸는 박자를 흔든다
  const cut = reach(W, m, K, L >= 4), d = K.d;
  let near = 0; if (L >= 4) for (const q of K.foes) if (q !== e && q.hp > 0 && hyp(q.x - e.x, q.y - e.y) < 4) near++;
  const dodged = (e.fly === 0 && e.rollCd > 0.2) || (e.z >= 1 && e.cut.cd > 0.2);   // 피하기를 방금 썼다: 땅이면 구르기, 날면 날기 끊기
  const canDodge = (e.fly === 0 && e.rollCd <= 0 && e.stam >= 3) || (e.z >= 1 && !(e.cut.cd > 0)) || (e.autoDodge && e.autoCd <= 0);
  const cornered = cut > 0.5 || e.x < 6 || e.y < 6 || e.x > W.width - 6 || e.y > W.height - 6, healthy = e.hp > 0.5 * e.hpMax;
  const bait = L >= 5 && P.l5.bait && dodged && W.t - K.pokeT < P.baitT;
  let mode = ''; const cv = coverable(m, K), hard = cornered || (L >= 4 && ((e.fly === 0 && e.stam < 1.5) || near >= 2));
  const throwing = !K.los || d > P.far * K.Dm.maxR || share(W, m, e) < P.domain;
  if (L >= 4 && !K.los && W.t - m.lastRel > P.hiddenT && hasBig(m, K)) mode = 'big';
  else if (cv && (bait || hard)) { mode = 'cover'; K.bait = bait; }
  else if (L >= 5 && P.l5.poke && healthy && canDodge) mode = 'poke';   // 전설: 먼저 견제로 피하기를 빼낸다 (던지기보다 먼저)
  else if (cv && L >= 4 && (dodged || e.z >= 1)) mode = 'cover';
  else if (throwing) mode = 'throw';
  else if (healthy && canDodge) mode = 'poke';
  if (mode === 'cover' && L < 4) reach(W, m, K, false);
  K.mode = mode; if (mode === 'cover' || mode === 'big') K.pressB = true;
}
// 덮을 수단이 둘 이상인가: 땅의 곳은 지연 폭발·곡사·투사체·실, 하늘의 곳(떠 있는 상대)은 투사체·실만 (지연 폭발은 떠 있으면 닿지 않는다)
function coverable(m, K) { const air = K.e.z >= 1; let n = 0; for (const nm of m.book) { const s = K.S[nm]; if (!s || (m.cd[nm] || 0) > 0.5 || m.glu < s.cost) continue; if (s.t === 'proj' || s.t === 'thread' || (!air && (s.t === 'area' || s.t === 'lob'))) if (++n >= 2) return true; } return false; }
function hasBig(m, K) { for (const n of m.book) { const s = K.S[n]; if (s && OFF[s.t] && isBig(m, s, K) && !((m.cd[n] || 0) > 0) && m.glu >= s.cost) return true; } return false; }
// 견제로 치는 수: 싸고(당 4 이하) 빠른(시전 0.6 s 이하) 투사체·실
const pokeOk = o => o.cost <= P.pokeCost && o.Tw <= P.pokeCast && (o.s.t === 'proj' || o.s.t === 'thread');
const share = (W, m, e) => W.rules.domain ? C.share(W, m, e.x, e.y) : 1;
// 방식에 따라 마법의 값을 고친다 (값 고치기 차례의 끝 쪽: 날카롭게·스스로 죽지 않기 뒤)
function value(W, m, K, o) {
  const L = lv(m); if (!L || !(o.v > 0)) return;
  const s = o.s, mode = K.mode, off = OFF[s.t] && s.t !== 'trap', big = off && isBig(m, s, K);
  if (L >= 5 && P.l5.big && big && mode !== 'sure' && mode !== 'big') o.v *= P.offK;   // 전설: 큰 수는 확정 순간·숨은 자리에서만
  if (mode === 'repeat') { if (s.n === m.last) o.v *= P.repeatK; return; }
  if (!mode) return;
  if (mode === 'sure') {
    if (!off && s.t !== 'flash') return;
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d);
    if (land <= K.sureW + 0.05 || (L >= 4 && unavoidable(s, K))) o.v = P.sureK * (1 + estDmg(s) / 10);   // 그 순간 안에 닿는 것 가운데 가장 센 것
    else if (L >= 4 && (s.t === 'thread' || s.stun || s.root || s.cramp) && hasBig(m, K)) o.v *= 1.4;   // 확정 순간을 만든다: 묶기 → 큰 수
    else o.v *= P.offK;
  } else if (mode === 'poke') {
    if (!off) return;
    if (W.t - K.pokeT < P.pokeGap) { o.v = 0; K.waitT = W.t; return; }   // 띄엄띄엄 (빈 칸은 준비에)
    o.v *= pokeOk(o) ? P.pokeK : P.offK;
  } else if (mode === 'cover') {
    if (!off || !(s.t === 'area' || s.t === 'lob' || s.t === 'proj' || s.t === 'thread')) return;
    const p = K.covPts, n = K.covN; let best = -1, bc = 0;
    for (let i = 0; i < n; i++) { if (taken(W, m, i)) continue; let c = 0; for (let j = 0; j < n; j++) if (!taken(W, m, j) && covers(W, m, s, p[i * 3], p[i * 3 + 1], p[j * 3], p[j * 3 + 1], p[j * 3 + 2])) c++; if (c > bc) { bc = c; best = i; } }
    if (best < 0) { o.v = 0; return; }   // 덮을 곳이 없는 수는 쓰지 않는다 (떠 있는 상대에 지연 폭발)
    o.tx = p[best * 3]; o.ty = p[best * 3 + 1]; o.v *= P.coverK * (1 + bc / n);
  } else if (mode === 'big') { if (off) o.v *= big ? P.bigK : P.offK; }
  else if (mode === 'throw') { if (!off) return; o.v *= s.t === 'lob' ? (K.e.z >= 1 ? P.offK : P.throwK * 1.2) : s.t === 'proj' && !s.home ? P.throwK : 0.7; }
}
// 시전을 건 뒤: 시전에 방식을 적고 기록한다
function commit(W, m, K, best, cast) {
  const L = lv(m); if (!L) return;
  const mode = K.mode || 'none', ml = m.mlog.mode, s = best.s; cast.mode = mode; ml.n[mode] = (ml.n[mode] || 0) + 1;
  if (OFF[s.t] && isBig(m, s, K)) { ml.bigN++; if (mode === 'sure' || mode === 'big') ml.bigSure++; }
  if (mode === 'poke') K.pokeT = W.t;
  if (mode === 'cover') {   // 갈 곳 덮은 비율 (이 수까지)
    let c = 0; for (let i = 0; i < K.covN; i++) if (taken(W, m, i)) c++;
    cast.cov = K.covN ? c / K.covN : 0; ml.covS += cast.cov; ml.covN++; if (K.bait) { cast.bait = true; ml.bait++; } K.covT = W.t; K.coverDone = W.t;
  }
}
module.exports = { pick, value, commit, sureWin, reach, pokeOk, P };
