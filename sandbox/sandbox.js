/* =========================================================================
 * 숨 샌드박스 v0.1 — 화면 논리 (편집, 그리기, 입력)
 * 판은 엔진(전역 Arena)이 돌린다. 여기선 장면(JSON)을 고치고, 세계를 걸음씩 돌리고, 그린다.
 * 장면을 고치면 판은 처음으로 돌아간다. 같은 장면·씨앗이면 node cli.js scene과 같은 결과.
 * ========================================================================= */
(function () {
'use strict';
const A = window.Arena, D = window.ArenaData;
const COL = ['#6fb7ff', '#ff7a6b', '#9ad07a', '#f0c35a', '#c79bf2', '#6fd6c9', '#f29bd0', '#b8b0a2'];
const ZC = { fire: 'rgba(255,120,50,.35)', h2s: 'rgba(200,190,80,.3)', nh3: 'rgba(200,170,230,.3)', acid: 'rgba(190,220,80,.3)', spore: 'rgba(150,200,100,.3)', ice: 'rgba(215,235,255,.4)', chill: 'rgba(215,235,255,.2)', smoke: 'rgba(200,200,200,.45)', mist: 'rgba(170,210,240,.25)', absorb: 'rgba(120,180,230,.2)', pit: 'rgba(15,12,8,.55)', sky: 'rgba(160,140,255,.16)' };
// 벽의 재료 (v2.0 둘째, rules/bulwark): 흙·석회·얼음
const WC = { earth: '#8a6a45', lime: '#c9c2b0', ice: '#a8d8ef' };
const RULE_TXT = {
  domain: ['장악권', '같은 공기는 가장 선명한 신호를 따른다'], circles: ['서클', '두 번째 칸, 3서클부터 자동 진'], fatigue: ['머리 피로', '피로와 폭주'],
  barrels: ['화약통', '씨앗 따라 5개 놓기 (장면에 화약통 목록이 있으면 그것)'], friendlyFire: ['아군 피해', '투사체와 폭발이 아군도 맞힌다'],
  powerK: ['위력 지수', '위력 = 선명도^K', 1, 4, 0.1], domainL: ['장악 거리', '신호가 반으로 흐려지는 거리 (m)', 1, 20, 0.5], passive: ['쉬는 신호', '시전 중이 아닐 때 장악권의 세기', 0, 1, 0.05],
  fizzle: ['흩어짐 문턱', '장악 몫이 이보다 작으면 흩어진다', 0, 0.6, 0.01], full: ['온전한 문턱', '장악 몫이 이보다 크면 온전한 힘', 0.2, 1, 0.01], wave: ['파도', '머리가 넘치면 굳는 대신 파도를 탄다. 부류(서퍼·메타·이단)마다 다르다'], risk: ['하이 리스크', '큰 마법(대낙뢰·화산 기둥·번개 창), 모으다 맞으면 역류, 쏜 뒤 빈손'], saltRing: ['소금 원', '15 s부터 줄어드는 소금 선. 밖에선 마법이 흩어지고 몸이 마른다'], bodyBind: ['몸 묶기', '균사 그물·얼음 족쇄·근육 경직·석회 굳히기·가두는 기둥. 눈멀면 예비동작을 못 읽는다'], taunt: ['도발', "'도발' 마법으로 상대의 부름을 끊는다. 이단은 걸리지 않는다. 끄면 책에서 빠진다"], hpScale: ['체력 비례', '켜면 체력 = 150 × max(C, 바닥)^지수 (v2.0 기본 끔)'], hpK: ['체력 지수', '체력 비례의 선명도 지수', 0, 3, 0.1], hpFloor: ['체력 바닥', '체력 비례에서 이보다 작은 선명도는 이것으로', 0, 2, 0.1],
  bodyK: ['몸 받침', '받는 에너지 피해(불·번개·독·열) ÷ 선명도^K. 0이면 끔', 0, 4, 0.1], callus: ['굳은 살', '부딪히는 피해(돌·얼음·총·벽 밀기)는 한 방마다 이것 × log₁₀ C만큼 뺀다. 0이면 부딪힘도 ÷ C^K', 0, 30, 1],
  domainR: ['장악권 반경', '적의 신호는 제 자리에서 이것 × C m 안에서만 몫을 다툰다(대마법사 50 m). 0이면 끝없음', 0, 10, 0.5], domainPath: ['실은 길 전체', '실은 길의 네 점 가운데 가장 낮은 몫으로 선다'],
  light: ['빛', '번쩍임(시야 안의 적 눈멂 1.5 s)·열선(거울이 있어야)'], bulwark: ['벽', '세울 때만 힘이 든다. 흙·석회는 무너질 때까지, 0.5 m 흙벽은 총알을 막는다, 벽 밀기, 벽 뒤는 안 보인다'],
  army: ['군대', '머스킷 장전 15~20 s·화승·사거리 100 m, 박격포, 돌아가며 쏘기'], morale: ['사기', '셋 넘는 편은 사상자·큰 수의 충격에 도망친다'], evade: ['회피', '걸음·구르기 × (1 + 0.25·log₂ C), 구르기 간격 ÷ (1 + 0.2·log₂ C)'], flight: ['비행', '출력 75 kW 이상(상위부터)이 뜬다. 대마법사는 계속 날고, 굳으면 떨어진다. 대마법사가 끼면 200 × 150 m'],
  flightCut: ['날기 끊기', '급정지 5 g·떨어지기·내리꽂기·튀어오르기·옆 튀기, 땅 앞 공기 쿠션(못 뿜으면 닿는 속도의 높이 × 4). 끊는 동안 서클·출력이 풀린다'],
  reflex: ['반사 겹', '강자(대가부터)는 매 걸음 위협을 보고 몸이 먼저: 피하기·멈칫·옆 뒤집기·내려앉기-구르기 (반응 지연 대가 0.1 s, 전설 0.05 s)'],
  snap: ['끊는 움직임', '걸음 속도가 목표를 가속 한계(대마법사 4.6 g) 안에서 곧장 따라간다. 끊어 걷기·옆 뒤집기·거리 톱질·높이 튕기기'],
  blueprint: ['청사진', "'청사진' 마법으로 반원 보루·몰이길·함정 격자·하늘 막기·엄폐 사다리를 여러 칸으로 한꺼번에 (대마법사 1~3 s)"],
  fort: ['진지', '함정 한도 = 서클 수, 하늘 덮개(떠 있는 적을 굳힘), 불·비가 적의 함정을 치운다. 강자(상급부터)가 진지를 짓는다'], trapChain: ['함정 연쇄', '함정 하나가 터지면 같은 사람의 3.5 m 안 함정도 0.2 s 뒤 터진다'],
};
const STANCE = { normal: '보통', hold: '버티기', breakout: '돌파', kite: '거리 두기' };
const PHASE = { probe: '떠보기', in: '들어가기', out: '빠지기', build: '짓기', home: '진지' };
const CUTN = { 1: '급정지', 2: '옆 튀기', 3: '튀어오르기', 4: '떨어지기', 5: '내리꽂기' };   // 날기 끊기 (v2.3, rules/flight)
const $ = id => document.getElementById(id), el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'on') for (const [ev, f] of Object.entries(v)) e.addEventListener(ev, f); else if (k in e && k !== 'list') e[k] = v; else e.setAttribute(k, v); } for (const k of kids) if (k != null) e.append(k); return e; };
const clone = o => JSON.parse(JSON.stringify(o)), r2 = v => Math.round(v * 100) / 100;

// S.scene: 고치는 장면, S.W: 도는 세계(없으면 편집 중), S.P: 편집 중에 보여 줄 첫 걸음 전 세계
const S = { scene: null, W: null, P: null, play: false, speed: 1, acc: 0, tool: 'move', sel: null, side: 0, drag: null, sc: 20, tab: 'rules' };
const cv = $('cv'), ctx = cv.getContext('2d');

/* ---------------- 장면 ---------------- */
function normalize(sc) {
  sc = Object.assign({ v: A.VERSION, seed: 1, width: 40, height: 30, maxT: 120, rules: {}, sides: [], spells: {}, decks: {} }, sc);
  while (sc.sides.length < 2) sc.sides.push({ name: '편' + sc.sides.length, brain: '기본', mages: [] });
  for (const s of sc.sides) { s.mages = s.mages || []; if (!s.brain) s.brain = '기본'; }
  return sc;
}
function loadScene(sc) { S.scene = normalize(clone(sc)); S.sel = null; S.side = 0; reset(); note(''); renderAll(); }
function reset() { S.W = null; S.P = null; S.play = false; S.acc = 0; $('err').textContent = ''; }
function lib() { return { spells: Object.assign({}, A.SPELLS, S.scene.spells), decks: Object.assign({}, A.DECKS, S.scene.decks) }; }
function preview() {
  if (!S.P) try { S.P = A.sceneWorld(S.scene); $('err').textContent = ''; } catch (e) { $('err').textContent = '장면 오류: ' + e.message; S.P = A.createWorld({ width: S.scene.width, height: S.scene.height, obstacles: [] }); }
  return S.P;
}
const world = () => S.W || preview();
// 고치기: 판을 처음으로 돌리고 장면을 바꾼다
function edit(fn, panels = true) { reset(); fn(S.scene); S.P = null; if (panels) renderAll(); else renderStats(); }
// 자리를 씨앗에 맡긴 장면(layout, 바위 수)을 지금 보이는 자리 그대로 적어 넣는다. 손으로 옮기려면 먼저 이렇게 한다
function fixLayout() {
  const sc = S.scene, auto = sc.layout || !Array.isArray(sc.obstacles) || sc.sides.some(s => s.mages.some(m => m.x == null || m.y == null)) || (!Array.isArray(sc.barrels) && sc.rules.barrels);
  if (!auto) return;
  const P = A.sceneWorld(sc);
  for (const m of P.ms) { const [s, k] = m._ref; sc.sides[s].mages[k].x = r2(m.x); sc.sides[s].mages[k].y = r2(m.y); }
  sc.obstacles = P.obs.map(o => ({ x: r2(o.x), y: r2(o.y), r: r2(o.r) }));
  sc.barrels = P.barrels.map(b => ({ x: r2(b.x), y: r2(b.y) }));
  delete sc.layout; S.P = null;
  note('자리를 장면에 적어 넣었다. 이제 씨앗을 바꿔도 자리는 그대로다.');
}

/* ---------------- 돌리기 ---------------- */
function start() { if (!S.W) { S.W = A.sceneWorld(S.scene, { record: true }); S.P = null; } }
function step() {
  start(); if (A.over(S.W)) { S.play = false; return false; }
  if (!S.fast) { S.prev = S.W.ms.map(m => [m.x, m.y, m.z]); S.pp = new Map(S.W.proj.map(p => [p, [p.x, p.y]])); }   // 사이를 이어 그리려고 지난 걸음의 자리를 둔다 (v2.4)
  A.stepWorld(S.W); if (A.over(S.W)) S.play = false; return true;
}
function runToEnd() { start(); S.fast = true; while (step()); S.fast = false; S.prev = null; renderStats(); syncButtons(); return A.result(S.W); }
let last = performance.now(), frame = 0;
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (S.play) {
    const t0 = performance.now();
    if (S.speed === 0) { while (S.play && performance.now() - t0 < 12) step(); }
    else { S.acc += dt * S.speed; let n = 0; while (S.play && S.acc >= A.DT && n < 600) { step(); S.acc -= A.DT; n++; } }
    if (++frame % 8 === 0 || !S.play) renderStats();
    if (!S.play) syncButtons();
  }
  draw(); requestAnimationFrame(loop);
}

/* ---------------- 그리기 ---------------- */
// 사이를 부드럽게 (v2.4): 걸음(1/30 s)보다 화면이 잦으면 지난 걸음과 이번 걸음 사이를 남은 시간 몫(α)만큼 이어 그린다.
// 그리는 동안만 자리를 바꿔 두고 그린 뒤 그대로 돌려놓는다 (판에는 닿지 않는다)
function draw() {
  const W = S.W, a = W && S.prev && S.play && S.speed > 0 && S.prev.length === W.ms.length ? Math.min(1, S.acc / A.DT) : 1;
  if (a >= 1) return draw0();
  const keep = W.ms.map(m => [m.x, m.y, m.z]), kp = W.proj.map(p => [p.x, p.y]);
  W.ms.forEach((m, i) => { const q = S.prev[i]; m.x = q[0] + (m.x - q[0]) * a; m.y = q[1] + (m.y - q[1]) * a; m.z = q[2] + (m.z - q[2]) * a; });
  W.proj.forEach(p => { const q = S.pp.get(p); if (q) { p.x = q[0] + (p.x - q[0]) * a; p.y = q[1] + (p.y - q[1]) * a; } });
  try { draw0(); } finally { W.ms.forEach((m, i) => { m.x = keep[i][0]; m.y = keep[i][1]; m.z = keep[i][2]; }); W.proj.forEach((p, i) => { p.x = kp[i][0]; p.y = kp[i][1]; }); }
}
function draw0() {
  const W = world(); S.sc = Math.min(800 / W.width, 600 / W.height); const sc = S.sc, X = v => v * sc;
  ctx.fillStyle = '#121317'; ctx.fillRect(0, 0, 800, 600);
  ctx.fillStyle = '#34322d'; ctx.fillRect(0, 0, X(W.width), X(W.height));
  ctx.fillStyle = 'rgba(235,232,220,.13)'; for (const r of W.salt || []) ctx.fillRect(X(r.x), X(r.y), X(r.w), X(r.h));   // 소금 땅 (rules/saltLand)
  ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 5; x < W.width; x += 5) { ctx.moveTo(X(x), 0); ctx.lineTo(X(x), X(W.height)); } for (let y = 5; y < W.height; y += 5) { ctx.moveTo(0, X(y)); ctx.lineTo(X(W.width), X(y)); } ctx.stroke();
  for (const z of W.zones) { ctx.fillStyle = ZC[z.k] || 'rgba(255,255,255,.1)'; if (z.shape !== 'circle' && z.len) { ctx.save(); ctx.translate(X(z.x), X(z.y)); ctx.rotate(z.a || 0); ctx.fillRect(-X(z.len) / 2, -X(0.6), X(z.len), X(1.2)); ctx.restore(); } else { ctx.beginPath(); ctx.arc(X(z.x), X(z.y), X(z.r || 1), 0, 7); ctx.fill(); } }
  if (W.rules.saltRing) { ctx.strokeStyle = 'rgba(245,245,235,.75)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.arc(X(W.width / 2), X(W.height / 2), X(A.saltR(W)), 0, 7); ctx.stroke(); ctx.setLineDash([]); }
  for (const o of W.obs) { ctx.fillStyle = '#6e685f'; ctx.beginPath(); ctx.arc(X(o.x), X(o.y), X(o.r), 0, 7); ctx.fill(); }
  for (const b of W.barrels) { ctx.fillStyle = b.ex ? '#3a2a20' : '#a8744a'; ctx.beginPath(); ctx.arc(X(b.x), X(b.y), Math.max(5, X(0.35)), 0, 7); ctx.fill(); }
  for (const w of W.walls) { ctx.fillStyle = WC[w.mat] || '#9a938a'; ctx.globalAlpha = w.hp0 ? Math.max(0.35, Math.min(1, w.hp / w.hp0)) : 1; ctx.beginPath(); ctx.arc(X(w.x), X(w.y), Math.max(2, X(w.r)), 0, 7); ctx.fill(); } ctx.globalAlpha = 1;   // 흐려질수록 깎였다
  for (const a of W.areas) { ctx.strokeStyle = 'rgba(230,240,255,.7)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(X(a.x), X(a.y), X(a.r), 0, 7); ctx.stroke(); ctx.setLineDash([]); }
  for (const l of W.lobs) { ctx.strokeStyle = 'rgba(255,220,160,.6)'; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(X(l.x), X(l.y), X(l.r), 0, 7); ctx.stroke(); ctx.setLineDash([]); }
  for (const m of W.ms) if (m.fort.x === m.fort.x && m.hp > 0) { ctx.strokeStyle = COL[m.side % COL.length]; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.setLineDash([1, 5]); ctx.beginPath(); ctx.arc(X(m.fort.x), X(m.fort.y), X(10), 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }   // 진지 (v2.3, rules/fort)
  for (const t of W.traps) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(X(t.x), X(t.y) - 6); ctx.lineTo(X(t.x) + 5, X(t.y) + 4); ctx.lineTo(X(t.x) - 5, X(t.y) + 4); ctx.fill(); }
  for (const p of W.proj) { ctx.fillStyle = p.s.mundane ? '#ffd27a' : '#e9e4d8'; ctx.beginPath(); ctx.arc(X(p.x), X(p.y), 3, 0, 7); ctx.fill(); }
  for (const x of W.fx) if (x[0] === 'z') { ctx.strokeStyle = 'rgba(230,243,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(x[1]), X(x[2])); ctx.lineTo(X(x[3]), X(x[4])); ctx.stroke(); }
  // 예비동작 선
  for (const m of W.ms) for (const c of [m.cast, m.castB]) if (c && m.hp > 0) { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(m.x), X(m.y)); ctx.lineTo(X(c.tx), X(c.ty)); ctx.stroke(); ctx.setLineDash([]); }
  const selM = S.sel && S.sel.k === 'mage' ? S.sel : null;
  // 높이 (비행, v2.0): 땅에 그림자, 몸은 높이만큼 위로 올려 그리고 숫자를 단다. 속도는 꼬리선(0.3 s 동안 온 길)
  for (const m of W.ms) if (m.hp > 0) {
    const sp = Math.hypot(m.vx, m.vy), zy = m.z > 0.05 ? Math.min(40, m.z * 3) : 0;
    if (zy) { ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(X(m.x), X(m.y), 8, 4, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(m.x), X(m.y)); ctx.lineTo(X(m.x), X(m.y) - zy); ctx.stroke(); }
    if (sp > 6) { ctx.strokeStyle = COL[m.side % COL.length]; ctx.globalAlpha = 0.45; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(m.x), X(m.y) - zy); ctx.lineTo(X(m.x - m.vx * 0.3), X(m.y - m.vy * 0.3) - zy); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  for (const m of W.ms) {
    const zy = m.hp > 0 && m.z > 0.05 ? Math.min(40, m.z * 3) : 0, x = X(m.x), y = X(m.y) - zy, c = COL[m.side % COL.length], dead = m.hp <= 0;
    ctx.globalAlpha = dead ? 0.25 : (m.roll > 0 || m.flee ? 0.55 : 1);
    if (selM && m._ref && m._ref[0] === selM.s && m._ref[1] === selM.i) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(x, y, 17, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle = '#1b1c20'; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2.6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(m.aim) * 13, y + Math.sin(m.aim) * 13); ctx.stroke();
    if (m.buf.front) { ctx.strokeStyle = '#d8d1c3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 13, m.aim - 0.9, m.aim + 0.9); ctx.stroke(); }
    if (m.flee && !dead) { ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); ctx.setLineDash([]); if (W.ms.length <= 60) { ctx.font = '9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd27a'; ctx.fillText('도망', x, y + 21); } }   // 사기가 꺾여 도망치는 사람 (rules/morale)
    if (m.wave) { ctx.strokeStyle = 'rgba(111,214,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 19, 0, 7); ctx.stroke(); }
    if (m.castB) { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    const cs = m.cast || m.chan;
    if (cs && !dead) { const pr = m.cast ? m.cast.t / m.cast.T : 1; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 11, -1.57, -1.57 + Math.min(1, pr) * 6.28); ctx.stroke(); ctx.font = '10px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#e9e4d8'; ctx.fillText(cs.s.n, x, y + 22); }
    ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - 14, y - 16, 28, 3); ctx.fillStyle = c; ctx.fillRect(x - 14, y - 16, 28 * Math.max(0, m.hp) / m.hpMax, 3);
    ctx.fillStyle = '#ff8a7a'; ctx.fillRect(x - 14, y - 12, 28 * Math.min(1, m.fat / 100), 1.5);
    if (W.ms.length <= 12) { ctx.font = '600 10px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(m.name + ' ' + m.stance[0] + (m.tac.rhythm && m.C >= 5 && !dead ? ' · ' + PHASE[m.phase] : ''), x, y - 20); }   // 리듬 단계 (v2.2)
    if (zy) { ctx.font = '10px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = '#cfe6ff'; ctx.fillText(m.z.toFixed(1) + ' m · ' + Math.round(Math.hypot(m.vx, m.vy)) + ' m/s' + (m.cut.k ? ' · ' + CUTN[m.cut.k] : '') + (m.cut.on ? ' · 쿠션' : ''), x + 12, y + 4); }
    if (!dead && W.t < m.rx.until) { ctx.font = '600 9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffe28a'; ctx.fillText(m.rx.vx || m.rx.vy ? '반사' : '멈칫', x, y + 32); }   // 반사 겹이 걸음을 덮는 중 (v2.4)
    if (!dead && m.cast && m.cast.bp) { ctx.font = '600 9px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#c9b08a'; ctx.fillText('청사진 ' + m.cast.bp.name + ' ' + m.cast.bp.built + '/' + m.cast.bp.items.length, x, y + 42); }
  }
  if (S.sel && S.sel.k !== 'mage') { const it = itemOf(S.sel); if (it) { ctx.strokeStyle = '#fff'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(X(it.x), X(it.y), X(it.r || 0.4) + 5, 0, 7); ctx.stroke(); ctx.setLineDash([]); } }
  if (S.W && A.over(S.W)) { const r = A.result(S.W); ctx.font = '600 22px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = r.winner >= 0 ? COL[r.winner % COL.length] : '#e9e4d8'; ctx.fillText(winText(r), X(W.width) / 2, 34); }
  $('clock').textContent = (S.W ? S.W.t.toFixed(2) : '0.00') + ' / ' + S.scene.maxT + '초';
}
function winText(r) { return r.winner < 0 ? '무승부' : (S.scene.sides[r.winner].name || '편 ' + r.winner) + ' 승리' + (r.byTime ? ' (시간 판정)' : ''); }

/* ---------------- 싸움터 입력 ---------------- */
function mpos(e) { const b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width * 800 / S.sc, y: (e.clientY - b.top) / b.height * 600 / S.sc }; }
function itemOf(sel) { const sc = S.scene; if (sel.k === 'obs') return Array.isArray(sc.obstacles) && sc.obstacles[sel.i]; if (sel.k === 'barrel') return sc.barrels && sc.barrels[sel.i]; if (sel.k === 'wall') return sc.walls && sc.walls[sel.i]; if (sel.k === 'mage') return sc.sides[sel.s] && sc.sides[sel.s].mages[sel.i]; }
function hitTest(p) {
  const W = world(); let best = null, bd = 1e9; const tryIt = (sel, x, y, r) => { const d = Math.hypot(p.x - x, p.y - y); if (d < r && d < bd) { bd = d; best = sel; } };
  for (const m of W.ms) if (m._ref) tryIt({ k: 'mage', s: m._ref[0], i: m._ref[1] }, m.x, m.y, 0.9);
  if (best) return best;
  W.barrels.forEach((b, i) => tryIt({ k: 'barrel', i }, b.x, b.y, 0.7));
  if (S.W) return best;
  const sc = S.scene;
  (sc.walls || []).forEach((w, i) => tryIt({ k: 'wall', i }, w.x, w.y, (w.r || 0.6) + 0.2));
  W.obs.forEach((o, i) => tryIt({ k: 'obs', i }, o.x, o.y, o.r + 0.2));
  return best;
}
function clampPos(p) { return { x: r2(Math.max(0.5, Math.min(S.scene.width - 0.5, p.x))), y: r2(Math.max(0.5, Math.min(S.scene.height - 0.5, p.y))) }; }
function removeSel(sel) {
  edit(sc => {
    if (sel.k === 'mage') sc.sides[sel.s].mages.splice(sel.i, 1);
    if (sel.k === 'obs') { fixLayout(); sc.obstacles.splice(sel.i, 1); }
    if (sel.k === 'barrel') { fixLayout(); sc.barrels.splice(sel.i, 1); }
    if (sel.k === 'wall') sc.walls.splice(sel.i, 1);
    S.sel = null;
  });
}
cv.addEventListener('pointerdown', e => {
  const p = mpos(e), q = clampPos(p), t = S.tool;
  if (t === 'move') {
    const h = hitTest(p); S.sel = h; if (h && h.k === 'mage') S.side = h.s;
    if (h && !S.W) { if (h.k !== 'wall') fixLayout(); S.drag = h; cv.setPointerCapture(e.pointerId); }
    renderAll(); return;
  }
  if (t === 'erase') { const h = hitTest(p); if (h) removeSel(h); return; }
  edit(sc => {
    fixLayout();
    if (t === 'mage') { const side = sc.sides[S.side] || sc.sides[0], tpl = side.mages[side.mages.length - 1] || { tier: '평범', deck: '합법 최강' }; side.mages.push({ tier: tpl.tier, deck: tpl.deck, x: q.x, y: q.y }); S.sel = { k: 'mage', s: sc.sides.indexOf(side), i: side.mages.length - 1 }; }
    if (t === 'obs') { sc.obstacles.push({ x: q.x, y: q.y, r: 1.2 }); S.sel = { k: 'obs', i: sc.obstacles.length - 1 }; }
    if (t === 'barrel') { sc.barrels.push({ x: q.x, y: q.y }); S.sel = { k: 'barrel', i: sc.barrels.length - 1 }; }
    if (t === 'wall') { sc.walls = sc.walls || []; sc.walls.push({ x: q.x, y: q.y, r: 0.6, hp: 200 }); S.sel = { k: 'wall', i: sc.walls.length - 1 }; }
  });
});
cv.addEventListener('pointermove', e => {
  if (!S.drag) return; const q = clampPos(mpos(e));
  const it = itemOf(S.drag); if (!it) return; it.x = q.x; it.y = q.y; S.P = null;
});
cv.addEventListener('pointerup', () => { if (S.drag) { S.drag = null; renderAll(); } });
document.addEventListener('keydown', e => {
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel) { e.preventDefault(); removeSel(S.sel); }
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
});

/* ---------------- 패널: 편과 사람 ---------------- */
function tierOpts(v) { return Object.keys(A.TIERS).map(k => el('option', { value: k, selected: k === v }, k)); }
function deckOpts(v) { return Object.keys(lib().decks).map(k => el('option', { value: k, selected: k === v }, k)); }
function brainOpts(v) { return Object.keys(A.BRAINS).map(k => el('option', { value: k, selected: k === v }, k)); }
const CHIPS = 12;   // 편마다 목록에 보일 사람 수
function renderSides() {
  const box = $('sides'); box.textContent = '';
  S.scene.sides.forEach((s, si) => {
    const chips = el('div', { className: 'chips' }, ...s.mages.map((m, i) => [m, i]).filter(([, i]) => i < CHIPS || (S.sel && S.sel.k === 'mage' && S.sel.s === si && S.sel.i === i)).map(([m, i]) => el('button', { type: 'button', className: 'chip' + (S.sel && S.sel.k === 'mage' && S.sel.s === si && S.sel.i === i ? ' sel' : ''), on: { click: () => { S.sel = { k: 'mage', s: si, i }; S.side = si; renderAll(); } } }, (m.name || (s.name + (i + 1))) + ' · ' + (m.tier || '평범') + ' · ' + (m.book ? '직접' : (m.deck || '합법 최강')) + (m.type && m.type !== '메타' ? ' · ' + m.type : ''))));
    box.append(el('div', { className: 'side', style: S.side === si ? 'border-color:' + COL[si % COL.length] : '' },
      el('div', { className: 'head' }, el('span', { className: 'sw', style: 'background:' + COL[si % COL.length] }),
        el('input', { type: 'text', value: s.name || '', 'aria-label': '편 이름', on: { change: e => edit(sc => { sc.sides[si].name = e.target.value; }) } }),
        el('select', { title: '두뇌', on: { change: e => edit(sc => { sc.sides[si].brain = e.target.value; }) } }, ...brainOpts(s.brain)),
        el('button', { type: 'button', title: '이 편 지우기', disabled: S.scene.sides.length <= 2, on: { click: () => edit(sc => { sc.sides.splice(si, 1); S.sel = null; S.side = 0; }) } }, '×')),
      el('div', { className: 'row' }, el('span', { className: 'sub' }, s.mages.length + '명'),
        el('button', { type: 'button', on: { click: () => { S.side = si; addMage(si); } } }, '사람 추가'),
        el('button', { type: 'button', title: '싸움터를 누르면 이 편에 사람을 놓는다', className: S.side === si && S.tool === 'mage' ? 'on' : '', on: { click: () => { S.side = si; setTool('mage'); renderAll(); } } }, '눌러 놓기')),
      chips, s.mages.length > CHIPS ? el('p', { className: 'sub' }, '… ' + (s.mages.length - CHIPS) + '명 더. 싸움터에서 눌러 고른다.') : null));
  });
}
function addMage(si) {
  edit(sc => {
    const side = sc.sides[si], tpl = side.mages[side.mages.length - 1] || { tier: '평범', deck: '합법 최강' }, auto = sc.layout || side.mages.some(m => m.x == null);
    const m = { tier: tpl.tier, deck: tpl.deck };
    if (!auto) { m.x = r2(si % 2 ? sc.width - 6 : 6); m.y = r2(Math.max(1, Math.min(sc.height - 1, sc.height / 2 + (side.mages.length % 2 ? 1 : -1) * Math.ceil(side.mages.length / 2) * 1.6))); }
    side.mages.push(m); S.sel = { k: 'mage', s: si, i: side.mages.length - 1 };
  });
}
// 비워 두면 기본값(등급의 값)을 따르는 칸. obj 대신 bag(만들까) 함수를 주면 필요할 때만 하위 객체를 만든다
function numField(label, obj, key, ph, fix, after) {
  const get = create => (typeof obj === 'function' ? obj(create) : obj), cur = (get(false) || {})[key];
  return [el('label', {}, label), el('input', { type: 'number', step: 'any', value: cur ?? '', placeholder: ph == null ? '' : String(ph), 'aria-label': label, on: { change: e => edit(() => { const v = e.target.value, o = get(v !== ''); if (o) { if (v === '') delete o[key]; else o[key] = fix ? r2(+v) : +v; } if (after) after(); }) } })];
}
function renderMageEd() {
  const box = $('mageEd'); box.textContent = '';
  const sel = S.sel; if (!sel || sel.k !== 'mage') { box.append(el('p', { className: 'hint' }, '사람을 고르면 여기서 고친다. 비워 둔 칸은 등급의 값을 따른다.')); return; }
  const side = S.scene.sides[sel.s], m = side && side.mages[sel.i]; if (!m) return;
  const T = A.TIERS[m.tier || '평범'] || A.TIERS['평범'], bag = k => create => m[k] || (create ? (m[k] = {}) : null), tac = m.tac || {}, gear = m.gear || {};
  const W = world(), live = W.ms.find(q => q._ref && q._ref[0] === sel.s && q._ref[1] === sel.i);
  const clean = () => { for (const k of ['tac', 'gear']) if (m[k] && !Object.keys(m[k]).length) delete m[k]; };
  const g = el('div', { className: 'grid' },
    el('label', {}, '이름'), el('input', { type: 'text', value: m.name || '', placeholder: side.name + (sel.i + 1), on: { change: e => edit(() => { if (e.target.value) m.name = e.target.value; else delete m.name; }) } }),
    el('label', {}, '등급'), el('select', { on: { change: e => edit(() => { m.tier = e.target.value; }) } }, ...tierOpts(m.tier || '평범')),
    el('label', {}, '덱'), el('select', { on: { change: e => edit(() => { m.deck = e.target.value; delete m.book; }) } }, ...deckOpts(m.deck || '합법 최강')),
    el('label', {}, '판단 수준'), el('select', { title: '비우면 등급의 값과 기본 두뇌 그대로', on: { change: e => edit(() => { if (e.target.value) m.skill = e.target.value; else delete m.skill; }) } }, el('option', { value: '', selected: !m.skill }, '없음 (등급대로)'), ...Object.keys(A.SKILLS).map(k => el('option', { value: k, selected: k === m.skill }, k))),
    el('label', {}, '부류'), el('select', { title: '파도 규칙이 켜져 있을 때만 다르다', on: { change: e => edit(() => { if (e.target.value === '메타') delete m.type; else m.type = e.target.value; }) } }, ...A.TYPES.map(k => el('option', { value: k, selected: k === (m.type || '메타') }, k + (k === '메타' ? ' (기본)' : '')))),
    ...numField('선명도 C', m, 'C', T.C), ...numField('서클', m, 'circles', T.circles), ...numField('겨냥 흔들림', m, 'noise', T.noise), ...numField('판단 간격 (s)', m, 'dec', T.dec),
    el('label', {}, '자동 구르기'), el('select', { on: { change: e => edit(() => { if (e.target.value === '') delete m.autoDodge; else m.autoDodge = e.target.value === '1'; }) } },
      el('option', { value: '', selected: m.autoDodge == null }, '등급대로 (' + (T.autoDodge ? '켬' : '끔') + ')'), el('option', { value: '1', selected: m.autoDodge === true }, '켬'), el('option', { value: '0', selected: m.autoDodge === false }, '끔')),
    el('label', {}, '장비'), el('span', {},
      el('label', {}, el('input', { type: 'checkbox', checked: gear.soles !== false, on: { change: e => edit(() => { const o = bag('gear')(true); if (e.target.checked) delete o.soles; else o.soles = false; clean(); }) } }), ' 소금 밑창 '),
      el('label', {}, el('input', { type: 'checkbox', checked: !!gear.cloak, on: { change: e => edit(() => { const o = bag('gear')(true); if (e.target.checked) o.cloak = true; else delete o.cloak; clean(); }) } }), ' 소금 외투 '),
      el('label', { title: '규칙 silver가 켜졌을 때만 (SPEC 10장)' }, el('input', { type: 'checkbox', checked: !!gear.silver, on: { change: e => edit(() => { const o = bag('gear')(true); if (e.target.checked) o.silver = true; else delete o.silver; clean(); }) } }), ' 은실 옷')),
    ...numField('선호 거리 (m)', bag('tac'), 'prefR', '자동', false, clean), ...numField('공격 비중', bag('tac'), 'aggr', 1, false, clean), ...numField('함정 비중', bag('tac'), 'trapBias', 0.1, false, clean), ...numField('구르기', bag('tac'), 'dodge', (T.tac && T.tac.dodge) ?? 0.6, false, clean),
    el('label', {}, '입장 판단'), el('label', {}, el('input', { type: 'checkbox', checked: tac.stance !== false, on: { change: e => edit(() => { const o = bag('tac')(true); if (e.target.checked) delete o.stance; else o.stance = false; clean(); }) } }), ' 버티기·돌파·거리 두기'),
    ...(m.x != null ? [...numField('x (m)', m, 'x', '', true), ...numField('y (m)', m, 'y', '', true)] : [el('label', {}, '자리'), el('span', { className: 'sub' }, '씨앗 따라 자동 (옮기면 적어 넣는다)')]),
  );
  box.append(el('h2', { style: 'margin-top:12px' }, '고른 사람: ' + (m.name || side.name + (sel.i + 1))), g,
    el('div', { className: 'row' },
      el('button', { type: 'button', on: { click: () => edit(sc => { const c = clone(m); if (c.x != null) { c.x = r2(Math.min(sc.width - 1, c.x + 1)); } sc.sides[sel.s].mages.push(c); S.sel = { k: 'mage', s: sel.s, i: sc.sides[sel.s].mages.length - 1 }; }) } }, '복제'),
      el('button', { type: 'button', on: { click: () => removeSel(sel) } }, '지우기')),
    live && S.W ? el('p', { className: 'hint' }, '지금: 체력 ' + Math.round(Math.max(0, live.hp)) + ', 피로 ' + Math.round(live.fat) + ', 입장 ' + (STANCE[live.stance] || live.stance) + (live.wave ? ', 파도를 탄다' : live.crash > 0 ? ', 꺼짐' : '')) : null);
}

/* ---------------- 패널: 규칙, 장면 ---------------- */
function renderRules() {
  const box = $('tab-rules'); box.textContent = '';
  const R = S.scene.rules, D0 = A.DEFAULT_RULES;
  for (const k of Object.keys(D0)) {
    const [name, desc, lo, hi, st] = RULE_TXT[k] || [k, '등록한 규칙'], v = R[k] ?? D0[k], changed = R[k] != null && R[k] !== D0[k];
    const set = val => edit(sc => { if (val === D0[k]) delete sc.rules[k]; else sc.rules[k] = val; });
    let ctl;
    if (typeof D0[k] === 'boolean') ctl = el('input', { type: 'checkbox', checked: !!v, 'aria-label': name, on: { change: e => set(e.target.checked) } });
    else {
      const num = el('input', { type: 'number', step: st || 'any', value: v, 'aria-label': name, on: { change: e => set(+e.target.value) } });
      ctl = el('span', {}, num);
      box.append(el('div', { className: 'rule' }, el('div', { className: 'top' }, el('b', {}, name + (changed ? ' *' : '')), ctl),
        el('input', { type: 'range', min: lo ?? 0, max: hi ?? Math.max(1, v * 2), step: st || 0.01, value: v, 'aria-label': name, on: { input: e => { num.value = e.target.value; }, change: e => set(+e.target.value) } }), el('div', { className: 'd' }, desc)));
      continue;
    }
    box.append(el('div', { className: 'rule' }, el('div', { className: 'top' }, el('b', {}, name + (changed ? ' *' : '')), ctl), el('div', { className: 'd' }, desc)));
  }
  box.append(el('button', { type: 'button', on: { click: () => edit(sc => { sc.rules = {}; }) } }, '모두 기본으로'), el('p', { className: 'hint' }, '* 기본값과 다른 규칙. 장면에는 다른 것만 적힌다.'));
}
function renderSceneTab() {
  const box = $('tab-scene'); box.textContent = ''; const sc = S.scene;
  const auto = sc.layout || !Array.isArray(sc.obstacles) || sc.sides.some(s => s.mages.some(m => m.x == null));
  box.append(el('div', { className: 'grid' },
    el('label', {}, '이름'), el('input', { type: 'text', value: sc.name || '', on: { change: e => edit(s => { s.name = e.target.value; }) } }),
    ...numField('씨앗', sc, 'seed', 1), ...numField('넓이 (m)', sc, 'width', 40), ...numField('높이 (m)', sc, 'height', 30), ...numField('시간 제한 (s)', sc, 'maxT', 120), ...numField('녹화 간격 (걸음)', sc, 'recEvery', 2),   // 1이면 매 걸음 (v2.4)
    el('label', {}, '배치'), el('span', { className: 'sub' }, auto ? (sc.layout === 'ring' ? '둘러싸기, 씨앗 따라' : '씨앗 따라') : '직접 적음')),
    el('div', { className: 'row' },
      el('button', { type: 'button', disabled: !auto, title: '지금 보이는 자리를 장면에 적어 넣는다', on: { click: () => edit(() => fixLayout()) } }, '자리 적어 넣기'),
      el('button', { type: 'button', on: { click: () => edit(s => { s.obstacles = []; }) } }, '바위 모두 치우기')),
    el('p', { className: 'hint' }, '바위 ' + world().obs.length + '개, 화약통 ' + world().barrels.length + '개, 벽 ' + (sc.walls || []).length + '개. 장면에서만 덮은 마법 ' + Object.keys(sc.spells || {}).length + '개, 덱 ' + Object.keys(sc.decks || {}).length + '개.'),
    el('p', { className: 'hint' }, '두뇌: ' + Object.keys(A.BRAINS).join(', ') + '. 새 두뇌·마법·덱·등급·규칙은 개발자 도구에서 Arena.register로 붙인다 (SPEC 19장).'));
}

/* ---------------- 기록 ---------------- */
function renderStats() {
  const W = world(), tb = $('stats'), sum = o => Object.values(o).reduce((a, b) => a + b, 0);
  tb.textContent = '';
  tb.append(el('tr', {}, ...['이름', '편', '체력', '준 피해', '맞힘/시전', '헛시전', '폭주', '파도', '입장'].map(h => el('th', {}, h))));
  const rows = W.ms.length > 40 ? W.ms.filter((m, i) => i < 20 || m.hp > 0).slice(0, 40) : W.ms;
  for (const m of rows) tb.append(el('tr', {}, el('td', { style: 'color:' + COL[m.side % COL.length] }, m.name), el('td', {}, S.scene.sides[m.side] ? S.scene.sides[m.side].name : m.side), el('td', {}, (m.hp > 0 ? Math.max(1, Math.round(m.hp)) : 0) + '/' + Math.round(m.hpMax)),
    el('td', {}, Math.round(sum(m.log.dealt))), el('td', {}, sum(m.log.hits) + '/' + sum(m.log.casts)), el('td', {}, m.log.fizz), el('td', {}, m.log.over), el('td', {}, m.log.waves + (m.wave ? ' 탐' : '')), el('td', {}, STANCE[m.stance] || m.stance)));
  if (rows.length < W.ms.length) tb.append(el('tr', {}, el('td', { colSpan: 9, className: 'sub' }, '… ' + (W.ms.length - rows.length) + '명 줄임')));
  $('result').textContent = S.W && A.over(S.W) ? winText(A.result(S.W)) : '';
}

/* ---------------- 위쪽, 조작 ---------------- */
function renderAll() {
  renderSides(); renderMageEd(); renderRules(); renderSceneTab(); renderStats(); syncButtons();
  $('seed').value = S.scene.seed;
  const sel = $('scenes'); if (!sel.options.length) { sel.append(el('option', { value: '' }, '예시 장면…')); for (const [k, v] of Object.entries(D.scenes)) sel.append(el('option', { value: k }, v.name || k)); }
}
function syncButtons() { $('play').textContent = S.play ? '멈춤' : (S.W && A.over(S.W) ? '다시' : '재생'); $('exportRec').disabled = !S.W; }
function togglePlay() { if (S.W && A.over(S.W)) { reset(); } S.play = !S.play; if (S.play) { start(); last = performance.now(); } syncButtons(); }
function setTool(t) { S.tool = t; for (const b of document.querySelectorAll('#tools [data-tool]')) b.classList.toggle('on', b.dataset.tool === t); note(t === 'move' ? '' : t === 'mage' ? '싸움터를 누르면 「' + (S.scene.sides[S.side] || {}).name + '」 편에 사람을 놓는다.' : '싸움터를 누르면 놓는다. 고치면 판은 처음으로 돌아간다.'); }
function note(t) { $('note').textContent = t; }
function download(name, text) { const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: name }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
function exportScene() { const sc = clone(S.scene); sc.v = A.VERSION; return JSON.stringify(sc, null, 1); }
function exportRecording() { return S.W ? JSON.stringify(A.recording(S.W)) : null; }
function importText(text) {
  let o; try { o = JSON.parse(text); } catch (e) { $('err').textContent = '읽을 수 없는 JSON: ' + e.message; return false; }
  if (o.frames) { $('err').textContent = '녹화 파일이다. viewer.html에 끌어다 놓는다.'; return false; }
  if (!Array.isArray(o.sides)) { $('err').textContent = '장면이 아니다 (sides가 없다).'; return false; }
  loadScene(o); note('장면을 불러왔다: ' + (o.name || '')); return true;
}
$('play').onclick = togglePlay;
$('step').onclick = () => { S.play = false; step(); renderStats(); renderMageEd(); syncButtons(); };
$('reset').onclick = () => { reset(); renderAll(); };
$('speed').onchange = e => { S.speed = +e.target.value; };
$('seed').onchange = e => edit(sc => { sc.seed = Math.round(+e.target.value) || 1; });
for (const b of document.querySelectorAll('#tools [data-tool]')) b.onclick = () => setTool(b.dataset.tool);
for (const b of document.querySelectorAll('[data-tab]')) b.onclick = () => { S.tab = b.dataset.tab; for (const x of document.querySelectorAll('[data-tab]')) x.classList.toggle('on', x === b); $('tab-rules').hidden = S.tab !== 'rules'; $('tab-scene').hidden = S.tab !== 'scene'; };
$('scenes').onchange = e => { if (e.target.value) { loadScene(D.scenes[e.target.value]); S.play = true; start(); syncButtons(); } e.target.value = ''; };
$('exportScene').onclick = () => download((S.scene.name || 'scene').replace(/[^\w가-힣-]+/g, '_').slice(0, 40) + '.json', exportScene());
$('exportRec').onclick = () => { const t = exportRecording(); if (t) download('replay.json', t); };
$('file').onchange = e => { const f = e.target.files[0]; if (f) f.text().then(importText); e.target.value = ''; };
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) f.text().then(importText); });
$('addSide').onclick = () => edit(sc => { sc.sides.push({ name: '편' + sc.sides.length, brain: '기본', mages: [] }); S.side = sc.sides.length - 1; });
$('ver').textContent = 'v0.1 · 엔진 v' + A.VERSION;

// 시험·자동화용 손잡이
window.Sandbox = { S, loadScene, step, runToEnd, exportScene, exportRecording, importText, reset: () => { reset(); renderAll(); } };

// 열면 첫 예시 장면이 바로 돈다
loadScene(D.scenes.duel || Object.values(D.scenes)[0]); S.play = true; start(); syncButtons();
requestAnimationFrame(loop);
})();
