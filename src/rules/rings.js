'use strict';
/* 규칙: 고리 장부 (rules.rings, v2.22, SPEC 46장, 수는 data/rules/rings.json) — 1단계: 읽어내기만, 판에 닿지 않는다
 * 설정: 심장 둘레의 공생 조직 고리(서클). 고리마다 붙잡은 것이 다르고 모습이 다르다.
 * 지금 엔진은 서클의 "수"만 센다(규칙마다 깎는다: 날기 −1·공기막 −1·잔기술 −1·버팀 벽 −1, 문턱 2 두 번째 칸·3 자동 진). 이 규칙은 매 걸음
 *   사람마다 고리 장부 m.mlog.rings를 지금 상태에서 다시 읽어낸다(난수·판의 값은 건드리지 않는다: 켜도 지문 그대로).
 *   고리 n개(서클 규칙이 켜지면 m.circles, 아니면 1). 고리 하나 = { k 상태, n 마법 이름, el 원소, p 진행 0~1, v 드러남, f 쏜 때·막은 때 }
 *   상태: 짓기(첫 칸 'A'·두 번째 칸 'B') / 붙잡음(hold: 두 번째 칸을 다 짓고 쥐고 있음) / 잔기술(종류) / 날기 / 공기막 / 버팀 벽 / 자동 진 / 몸 / 빈
 *   차례: 엔진이 서클을 세는 일 먼저, 보이기만 하는 일(자동 진, 몸)은 남은 고리에. 앉은 고리는 그 일이 끝날 때까지 자리를 지킨다(안쪽부터 채운다)
 *   기록(지표, 보기만): 고리·초(tot), 빈 고리·초(emp), 꽉 찬 초(full), 상태별 고리·초(by), 넘친 초(over: 일이 고리보다 많았던 때) */
const P = require('../../data/rules/rings.json');
const KEYS = ['날기', '공기막', '잔기술', '버팀 벽', '짓기', '붙잡음', '자동 진', '몸', '빈'];
function newLedger(n) {
  const r = []; for (let i = 0; i < n; i++) r.push({ k: '빈', id: '', n: '', el: '', p: 0, v: 1, f: -9, fk: '' });
  const by = {}; for (const k of KEYS) by[k] = 0;
  return { r, n, tot: 0, emp: 0, full: 0, over: 0, T: 0, by, cA: null, cB: null, au: 0, want: [] };
}
const elOf = s => (s && s.el) || '없음';
const visOf = c => { const v = (c.vis > 0 ? c.vis : 1) * (c.hid ? 1 / 3 : 1); return v > 1 ? 1 : v < P.minVis ? P.minVis : v; };
function add(w, id, k, n, el, p, v) { w.push(id, k, n, el, p, v); }
// 이번 걸음에 고리를 쓰는 일들 (차례대로): [id, 상태, 이름, 원소, 진행, 드러남]
function wants(W, m, L) {
  const w = L.want; w.length = 0;   // 켜진 판에서만 (보기용)
  if (W.rules.flight && m.z >= 1 && m.fly !== 3) { add(w, 'fly', '날기', '', '', 0, 1); if (m.airFilm) add(w, 'film', '공기막', '', '', 0, 1); }
  if (m.st.psv > 0) add(w, 'psv', '잔기술', ['', '절연 막', '굳은 살', '열 차단'][m.st.psv] || '', P.psvEl[m.st.psv] || '없음', 0, 1);
  for (const z of W.zones) if (z.up && z.src === m) add(w, 'bul', '버팀 벽', z.n || '', '흙', 0, 1);
  const a = m.cast || m.chan; if (a) add(w, 'A', '짓기', a.s.n, elOf(a.s), m.cast ? Math.min(1, a.t / (a.T || 1)) : 1, m.cast ? visOf(a) : 1);
  const b = m.castB; if (b) add(w, 'B', b.hold && b.t >= b.T ? '붙잡음' : '짓기', b.s.n, elOf(b.s), Math.min(1, b.t / (b.T || 1)), visOf(b));
  if (W.rules.circles && m.circles >= 3) add(w, 'auto', '자동 진', '', '없음', 0, 1);
  if (m.buf.speed || m.buf.elecRes || m.buf.bluntRes || m.buf.toxRes) add(w, 'body', '몸', '', '없음', 0, 1);
  return w;
}
function read(W, m) {
  const n = W.rules.circles ? Math.max(1, m.circles) : 1;
  let L = m.mlog.rings; if (!L || L.n !== n) L = m.mlog.rings = newLedger(n);
  const R = L.r, w = wants(W, m, L), dt = W.dt;
  // 쏜 칸: 지난 걸음의 시전이 다 지어져 풀렸다 → 그 고리를 튕긴다
  const relA = L.cA && L.cA !== m.cast && L.cA.t >= L.cA.T - dt * 1.5, relB = L.cB && L.cB !== m.castB && L.cB.t >= L.cB.T - dt * 1.5;
  for (const g of R) if ((g.id === 'A' && relA) || (g.id === 'B' && relB)) { g.f = W.t; g.fk = 'shot'; }
  L.cA = m.cast; L.cB = m.castB;
  // 자동 진이 막았다 (간격이 막 걸렸다)
  if (m.autoCd > L.au + 1e-9) for (const g of R) if (g.id === 'auto') { g.f = W.t; g.fk = 'flash'; }
  L.au = m.autoCd;
  // 끝난 일의 고리를 비운다
  for (const g of R) { if (!g.id) continue; let keep = false; for (let i = 0; i < w.length; i += 6) if (w[i] === g.id) { keep = true; break; } if (!keep) { g.id = ''; g.k = '빈'; g.n = ''; g.p = 0; g.v = 1; } }
  // 일을 고리에 (있던 자리 그대로, 새 일은 안쪽 빈 고리에). 버팀 벽은 여럿일 수 있어 같은 id를 차례로
  let over = 0;
  for (let i = 0; i < w.length; i += 6) {
    const id = w[i]; let g = null;
    if (id !== 'bul') for (const x of R) if (x.id === id) { g = x; break; }
    if (id === 'bul') { let seen = 0; for (let j = 0; j < i; j += 6) if (w[j] === 'bul') seen++; let c = 0; for (const x of R) if (x.id === 'bul') { if (c === seen) { g = x; break; } c++; } }
    if (!g) for (const x of R) if (!x.id) { g = x; break; }
    if (!g) { over++; continue; }
    g.id = id; g.k = w[i + 1]; g.n = w[i + 2]; g.el = w[i + 3]; g.p = w[i + 4]; g.v = w[i + 5];
  }
  // 기록
  let emp = 0; for (const g of R) { L.by[g.k] += dt; if (!g.id) emp++; }
  L.tot += n * dt; L.emp += emp * dt; L.T += dt; if (!emp) L.full += dt; if (over) L.over += dt;
}
// 지표 (metrics/watch가 합친다): 고리·초의 몫
function seen(m) {
  const L = m.mlog.rings; if (!L || !L.tot) return {};
  const o = { '고리 수': L.n, '빈 고리 몫': L.emp / L.tot, '고리가 꽉 찬 시간 몫': L.full / L.T, '일이 고리보다 많았던 시간 몫': L.over / L.T };
  for (const k of KEYS) o['고리 시간 몫: ' + k] = L.by[k] / L.tot;
  return o;
}
module.exports = {
  name: 'rings', switch: 'rings', api: { P, KEYS, read, seen },
  engine: X => ({ stepEnd(W) { for (const m of W.ms) if (m.hp > 0) read(W, m); } }),   // 걸음의 끝에서 (두뇌가 이 걸음에 시작한 시전까지)
};
