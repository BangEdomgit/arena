/* =========================================================================
 * 숨 샌드박스 v0.3 — 화면 논리 (편집, 그리기, 입력)
 * 판은 엔진(전역 Arena)이 돌린다. 여기선 장면(JSON)을 고치고, 세계를 걸음씩 돌리고, 그린다.
 * 장면을 고치면 판은 처음으로 돌아간다. 같은 장면·씨앗이면 node cli.js scene과 같은 결과.
 * v0.2 (엔진 v2.14): 중계처럼 본다. 걸음 간격은 세계마다(W.dt, 잘게 걷기 1/60 s). 같은 장면을 따로 앞서 돌려(결정론이라 같은 판) 사건의 때를 미리 알고
 *   그 직전에 느려진다. 되감기 막대(앞으로는 걷고, 뒤로는 처음부터 다시 걷는다). 판단 그림. 장면에 beside가 있으면 그 장면을 나란히 같은 시간만큼 돌린다
 * v0.3 (엔진 v2.28): 마법 그림 — 빛깔 = 원소, 모양 = 종류(data/rules/visual.json). 풀릴 때 이름, 과녁의 상태 표시, 보는 편(숨은 덫), 범례, 마우스를 올리면 마법·쓴 사람·피해
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
  tactics: ['작전 겹', '강자(대가부터)가 1~2 s마다 작전(진지·소모·압박·몰이·사냥·끝내기)과 상대 둘레 자리 24개를 고른다. 전설은 강요하는 수·상대 작전 읽기'],
  reflex: ['반사 겹', '강자(대가부터)는 매 걸음 위협을 보고 몸이 먼저: 피하기·멈칫·옆 뒤집기·내려앉기-구르기 (반응 지연 대가 0.1 s, 전설 0.05 s)'],
  snap: ['끊는 움직임', '걸음 속도가 목표를 가속 한계(대마법사 4.6 g) 안에서 곧장 따라간다. 끊어 걷기·옆 뒤집기·거리 톱질·높이 튕기기'],
  blueprint: ['청사진', "'청사진' 마법으로 반원 보루·몰이길·덫길·하늘 막기·엄폐 사다리를 여러 칸으로 한꺼번에 (대마법사 1~3 s)"],
  fort: ['진지', '함정 한도 = 서클 수, 하늘 덮개(떠 있는 적을 굳힘), 불·비가 적의 함정을 치운다. 강자(상급부터)가 진지를 짓는다'], trapChain: ['함정 연쇄', '함정 하나가 터지면 같은 사람의 3.5 m 안 함정도 0.2 s 뒤 터진다'],
  gluRegen: ['당 회복', '초당 g (버티기가 상위·대마법사에게 곱한다). v2.11 3, 1.x·v2.10까지 1.2', 0, 10, 0.1], breath: ['숨', '판마다 세 번: 0.5 s 마시는 동안 새 마법을 못 짓고 느려진다, 끝나면 당 +80 · 머리 피로 −30 · 기력 +3'],
  stunRes: ['굳힘 내성', '다시 굳으면 굳는 시간 × 0.5 → × 0.25, 굳음을 터는 몸 털기(상급부터)'], rings: ['고리 장부', '가슴 둘레에 서클 고리를 그린다: 짓기·붙잡음·잔기술·날기·공기막·자동 진·몸·빈 고리 (보기만, 판은 그대로)'],
};
const PLN = window.ArenaBrain && window.ArenaBrain.plan, PSD = PLN ? PLN.ST.newSide() : null, PRB = new Float64Array(6);   // 수읽기 (v2.15): 줄인 상태를 읽어 그린다 (판에 닿지 않는다)
const OFFT = { proj: 1, thread: 1, area: 1, lob: 1, touch: 1, cone: 1 };   // 공격 틀 (판단 그림, v0.2)
const MODEN = { poke: '견제', sure: '확정타', cover: '덮기', big: '큰 한 방', throw: '던지기', repeat: '반복' };   // 공격 방식 (v2.12)
// 고리 장부 (v2.22, rules/rings): 가슴 둘레에 고리를 그린다. 짓는 동안 밝아지고 쏘면 튕겨 퍼진다, 잔기술은 몸 가까이, 날기는 발밑 넓고 하얗게,
// 자동 진은 혼자 빠르게 돌다 막을 때 번쩍, 빈 고리는 희미한 점선, 숨긴 시전은 드러남만큼 희미하게. 빛깔·모습은 data/rules/rings.json
const RING_PX = 6;   // 화면에서 1 m가 이만큼(px) 넘으면 고리를 다 그린다 (v0.3)
const RGP = (() => { const r = A.RULES.find(x => x.name === 'rings'); return r ? r.api.P : null; })();
function drawRings(W, m, x, y, footY) {
  const L = m.mlog.rings, P = RGP; if (!L || !P) return;
  const n = L.r.length, r0 = 10, gap = Math.min(2.4, 22 / Math.max(1, n));
  for (let i = 0; i < n; i++) {
    const g = L.r[i], lk = P.look[g.k] || P.look['빈'], col = g.k === '짓기' || g.k === '붙잡음' ? (V.el[g.el] || P.el[g.el] || P.el['없음']) : (lk.c || V.el[g.el] || P.el[g.el] || P.el['없음']);
    let R = r0 + i * gap; if (lk.r) R = r0 * (0.9 + lk.r * 0.2);   // 잔기술·몸은 몸 가까이
    let a = lk.a ?? 0.85; if (g.k === '짓기') a = 0.2 + 0.8 * g.p; a *= g.v ?? 1;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lk.w || 1.5; ctx.globalAlpha = a; ctx.setLineDash(lk.dash || []);
    if (lk.spin) ctx.lineDashOffset = -W.t * lk.spin * 2 * Math.PI * R;
    ctx.beginPath();
    if (lk.foot) ctx.ellipse(x, footY, R * lk.foot, R * lk.foot * 0.45, 0, 0, 7);   // 날기: 발밑에 넓게
    else ctx.arc(x, y, R, 0, 7);
    ctx.stroke();
    const dt = W.t - g.f;
    if (g.fk === 'shot' && dt >= 0 && dt < P.pulse) { const k = dt / P.pulse; ctx.setLineDash([]); ctx.strokeStyle = V.el[g.el] || P.el[g.el] || P.el['없음']; ctx.globalAlpha = (1 - k) * (g.v ?? 1);
      ctx.lineWidth = 2.5 * (1 - k) + 0.5; ctx.beginPath(); ctx.arc(x, y, R + k * 16, 0, 7); ctx.stroke(); }   // 쏘면 튕겨 퍼짐
    if (g.fk === 'flash' && g.k === '자동 진' && dt >= 0 && dt < P.flash) { ctx.setLineDash([]); ctx.strokeStyle = '#ffffff'; ctx.globalAlpha = 1 - dt / P.flash; ctx.lineWidth = 3; ctx.beginPath();
      ctx.arc(x, y, R, 0, 7); ctx.stroke(); }   // 자동 진이 막았다
    ctx.restore();
  }
}
const ringsTxt = L => { const o = [], e = L.r.filter(g => !g.id).length;
  for (const g of L.r) if (g.id) o.push(g.k + (g.n ? '(' + g.n + (g.k === '짓기' ? ' ' + Math.round(g.p * 100) + '%' : '') + ')' : ''));
  return (o.join(' · ') || '모두 빔') + (e ? ' · 빈 ' + e : '') + ' / ' + L.n; };   // 고리 장부 글 (v2.22)
const breathDots = m => { const n = A.RULES.find(r => r.name === 'breath').api.P.n, u = Math.min(n, m.mlog.breath); return '●'.repeat(n - u) + '○'.repeat(u) + (m.st.breath > 0 ? ' 마심' : ''); };   // 남은 숨 (v2.11)
const STANCE = { normal: '보통', hold: '버티기', breakout: '돌파', kite: '거리 두기' };
const PHASE = { probe: '떠보기', in: '들어가기', out: '빠지기', build: '짓기', home: '진지' };
const OPN = { fort: '진지', attrit: '소모', press: '압박', herd: '몰이', hunt: '사냥', finish: '끝내기' };   // 작전 겹 (v2.5, rules/tactics)
const CUTN = { 1: '급정지', 2: '옆 튀기', 3: '튀어오르기', 4: '떨어지기', 5: '내리꽂기' };   // 날기 끊기 (v2.3, rules/flight)
const $ = id => document.getElementById(id), el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'on') for (const [ev, f] of Object.entries(v)) e.addEventListener(ev, f); else if (k in e && k !== 'list') e[k] = v;
    else e.setAttribute(k, v); } for (const k of kids) if (k != null) e.append(k); return e; };
const clone = o => JSON.parse(JSON.stringify(o)), r2 = v => Math.round(v * 100) / 100;

// S.scene: 고치는 장면, S.W: 도는 세계(없으면 편집 중), S.P: 편집 중에 보여 줄 첫 걸음 전 세계
const S = { scene: null, W: null, P: null, play: false, speed: 1, acc: 0, tool: 'move', sel: null, side: 0, drag: null, sc: 20, tab: 'rules', cam: { x: 400, y: 300, z: 1 }, follow: true, ev: [], slowT: 0, seen: null,   // 카메라·사건 줄·느리게 (v2.13)
  ah: null, W2: null, cam2: { x: 200, y: 300, z: 1 }, vp: null, prev2: null, scrub: false, hud: null, hudF: 0, fx: [], hover: null };   // 앞서 보기·나란히 보는 세계·화면 칸·되감기 끄는 중·나란히 지표 (v0.2)
const Wt = window.ArenaWatch;
const cv = $('cv'), ctx = cv.getContext('2d');

/* ---------------- 장면 ---------------- */
function normalize(sc) {
  sc = Object.assign({ v: A.VERSION, seed: 1, width: 40, height: 30, maxT: 120, rules: {}, sides: [], spells: {}, decks: {} }, sc);
  while (sc.sides.length < 2) sc.sides.push({ name: '편' + sc.sides.length, brain: '기본', mages: [] });
  for (const s of sc.sides) { s.mages = s.mages || []; if (!s.brain) s.brain = '기본'; }
  return sc;
}
function loadScene(sc) { S.scene = normalize(clone(sc)); S.sel = null; S.side = 0; reset(); note(''); renderAll(); }
function reset() { S.fx = []; S.W = null; S.W2 = null; S.ah = null; S.P = null; S.play = false; S.acc = 0; S.ev = []; S.hud = null; $('err').textContent = ''; }
function lib() { return { spells: Object.assign({}, A.SPELLS, S.scene.spells), decks: Object.assign({}, A.DECKS, S.scene.decks) }; }
function preview() {
  if (!S.P) try { S.P = A.sceneWorld(S.scene); $('err').textContent = ''; } catch (e) { $('err').textContent = '장면 오류: ' + e.message;
    S.P = A.createWorld({ width: S.scene.width, height: S.scene.height, obstacles: [] }); }
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
// 나란히 보는 장면 (v0.2): beside는 장면 객체이거나 예시 장면의 이름
function besideOf(sc) { const b = sc.beside; return !b ? null : typeof b === 'string' ? D.scenes[b] || null : b; }
// 고리 장부는 어느 판에서나 그린다 (v0.3): rings는 판에 닿지 않는 규칙이라(결과 지문 그대로) 보기만을 위해 켠다
const ringed = sc => Object.assign({}, sc, { rules: Object.assign({}, sc.rules, { rings: true }) });
function start() {
  if (S.W) return;
  S.W = A.sceneWorld(ringed(S.scene), { record: true }); S.P = null; S.ev = [];
  const b = besideOf(S.scene); S.W2 = b ? A.sceneWorld(ringed(b), { record: true }) : null;
  S.ah = { W: A.sceneWorld(S.scene), ev: [], i: 0, last: -9 };   // 앞서 보기: 같은 장면을 따로 돌린다
}
function step() {
  start(); if (A.over(S.W)) { S.play = false; return false; }
  if (!S.fast) { S.prev = S.W.ms.map(m => [m.x, m.y, m.z]); S.pp = new Map(S.W.proj.map(p => [p, [p.x, p.y]])); }   // 사이를 이어 그리려고 지난 걸음의 자리를 둔다 (v2.4)
  const hp0 = S.fast ? null : S.W.ms.map(m => m.hp), br0 = S.fast ? null : S.W.ms.map(m => m.st.breath > 0), tr0 = S.fast ? null : S.W.traps.slice();
  const pre = S.fast ? null : lookPre(S.W);
  A.stepWorld(S.W); if (S.W2) Wt.watch(S.W); if (!S.fast) { events(S.W, hp0, br0, tr0); lookStep(S.W, pre); }
  const W2 = S.W2; if (W2) while (!A.over(W2) && W2.t < S.W.t - 1e-9) { if (!S.fast) S.prev2 = W2.ms.map(m => [m.x, m.y, m.z]); A.stepWorld(W2); Wt.watch(W2); }   // 나란히: 같은 시간만큼
  if (A.over(S.W)) S.play = false; return true;
}
// 되감기 (v0.2): 앞으로는 그냥 걷고, 뒤로는 처음부터 다시 걷는다 (같은 장면·씨앗이면 같은 판)
function seek(t) {
  start(); const n = Math.max(0, Math.round(t / S.W.dt));
  if (n < S.W.step) { const ah = S.ah; S.W = null; S.W2 = null; start(); if (ah) { S.ah = ah; ah.i = 0; } }
  S.fast = true; while (S.W.step < n && step()); S.fast = false; S.prev = null; S.prev2 = null; S.ev = []; S.fx = []; S.acc = 0; S.hud = null; renderStats(); syncButtons();
}
// 앞서 보기 (v0.2): 프레임마다 ms 동안 따로 돌린 세계에서 사건을 찾는다. 큰 피해(한 걸음에 체력 8% 넘게)·쓰러짐·덫 발동·메이트(수읽기, v2.15)·속임수(속임 수를 지음)·미끼 덮기(구르기를 빼낸 뒤 덮기)
const SLOW = { pre: 0.35, post: 0.6, k: 0.15, gap: 0.8 };   // 직전 몇 초부터·뒤 몇 초까지·배속·사건 사이 (게임 초)
function aheadRun(ms) {
  const a = S.ah; if (!a || A.over(a.W)) return; const W = a.W, t0 = performance.now();
  while (!A.over(W) && performance.now() - t0 < ms) {
    const hp0 = W.ms.map(m => m.hp), tr0 = W.traps.filter(t => !t.done), c0 = W.ms.map(m => m.cast);
    A.stepWorld(W);
    const add = (txt, m) => { if (W.t - a.last < SLOW.gap) return; a.last = W.t; a.ev.push({ t: W.t, txt: (m ? m.name + ' ' : '') + txt }); };
    W.ms.forEach((m, i) => { if (hp0[i] > 0 && m.hp <= 0) add('쓰러짐', m); else if (hp0[i] - Math.max(0, m.hp) > 0.08 * m.hpMax) add('큰 피해', m); const c = m.cast; if (c && c !== c0[i] && c.mate) add('메이트', m); else if (c && c !== c0[i] && c.feint) add('속임수', m); else if (c && c !== c0[i] && c.mode === 'cover' && c.bait) add('미끼 덮기', m); });
    for (const t of tr0) if (t.done) { add((t.src.name || '') + '의 ' + t.s.n + ' 발동', null); break; }
  }
}
// 지금 느려야 하나: 다음 사건의 직전~뒤면 SLOW.k, 아니면 1. 앞서 보기가 아직 못 닿았으면 그 전처럼 큰 사건 뒤에 (v2.13)
function slowNow() {
  if (!$('slowmo').checked || !S.W) return null; const a = S.ah, t = S.W.t;
  if (a) { while (a.i < a.ev.length && a.ev[a.i].t + SLOW.post < t) a.i++; const e = a.ev[a.i]; if (e && t >= e.t - SLOW.pre) return e; }
  return performance.now() < S.slowT ? { txt: '' } : null;
}
// 큰 사건 (v2.13): 한 걸음에 체력 15% 넘게 잃음·쓰러짐·덫 발동·숨. 사건 줄에 6 s 띄우고, 큰 피해·쓰러짐은 1.2 s(화면 시간) 0.25배로 느리게
function events(W, hp0, br0, tr0) {
  const add = (txt, col, slow) => { S.ev.push({ t: W.t, txt: W.t.toFixed(1) + ' s  ' + txt, col }); if (S.ev.length > 6) S.ev.shift();
    if (slow && $('slowmo').checked && !(S.ah && S.ah.W.t > W.t)) S.slowT = performance.now() + 1200; };   // 앞서 보기가 닿았으면 그쪽이 미리 늦춘다
  W.ms.forEach((m, i) => { const name = m.name, c = COL[m.side % COL.length], d = hp0[i] - Math.max(0, m.hp);
    if (hp0[i] > 0 && m.hp <= 0) add(name + ' 쓰러짐', c, true); else if (d > 0.15 * m.hpMax) add(name + ' 큰 피해 −' + Math.round(d), c, true);
    if (!br0[i] && m.st.breath > 0) add(name + ' 숨', c, false); });
  for (const t of tr0) if (t.done) add((t.src.name || '') + '의 ' + t.s.n + ' 발동', COL[t.src.side % COL.length], false);
}
function runToEnd() { start(); S.fast = true; while (step()); S.fast = false; S.prev = null; S.prev2 = null; renderStats(); syncButtons(); return A.result(S.W); }
let last = performance.now(), frame = 0;
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (S.play) {
    const t0 = performance.now();
    if (S.speed === 0) { while (S.play && performance.now() - t0 < 12) step(); }
    else { const sl = slowNow(), sd = S.W ? S.W.dt : A.DT; S.acc += dt * S.speed * (sl ? (S.ah && sl.t != null ? SLOW.k : 0.25) : 1); let n = 0; while (S.play && S.acc >= sd && n < 600) { step();
        S.acc -= sd; n++; } }   // 걸음 간격은 세계마다 (v2.14)
    if (++frame % 8 === 0 || !S.play) renderStats();
    if (!S.play) syncButtons();
  }
  if (S.W) aheadRun(S.play ? 6 : 12);
  scrubSync(); draw(); requestAnimationFrame(loop);
}
// 되감기 막대: 끝은 앞서 본 판의 끝 (아직 돌리는 중이면 거기까지)
function scrubSync() {
  const b = $('scrub'), a = S.ah, W = S.W; if (!W) { b.max = 0; b.value = 0; $('scrubT').textContent = ''; return; }
  const end = a ? (A.over(a.W) ? a.W.t : Math.max(a.W.t, W.t)) : W.t; b.max = end.toFixed(3);
  if (!S.scrub) { b.value = W.t.toFixed(3); $('scrubT').textContent = W.t.toFixed(2) + ' / ' + end.toFixed(1) + ' s' + (a && !A.over(a.W) ? ' …' : ''); }
}

/* ---------------- 마법 그림 (v0.3): 빛깔 = 원소, 모양 = 종류. 수는 data/rules/visual.json (ArenaData.visual). 판에 닿지 않는다 ----------------
 * 풀린 시전은 걸음 앞뒤의 시전 칸을 견줘 안다(lookStep): 사라진 시전이 다 지어졌으면(t ≥ T) 풀렸다. 터진 지역·떨어진 곡사는 목록에서 사라질 때.
 * 그림 효과는 S.fx에 판 시각으로 쌓고(되감기면 비운다), 마우스를 올리면 마법 이름·쓴 사람·피해를 띄운다 */
const V = D.visual || { el: {}, zone: {}, wall: {}, proj: {}, thread: {}, area: {}, lob: {}, cone: {}, flash: {}, beam: {}, name: {}, status: {}, kind: {}, elName: {} };
const elc = s => (s && V.el[s.el]) || V.el['없음'] || '#c8c8c8';
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
const dmgOf = s => s.dmg || (s.hit && s.hit.flat) || (s.dps && s.dur ? s.dps * s.dur : 0) || (s.E ? Math.round(Math.pow(s.E, 0.55)) : 0);
const LK = { trail: new WeakMap(), lob0: new WeakMap(), areas: [], lobs: [] };
const opt = id => { const e = $(id); return !e || e.checked; };
// 걸음 앞: 시전 칸·지역·곡사를 적어 둔다. 걸음 뒤: 풀린 것을 효과로
function lookPre(W) { return { c: W.ms.map(m => [m.cast, m.castB, m.x, m.y]), areas: W.areas.slice(), lobs: W.lobs.slice() }; }
function lookStep(W, pre) {
  const add = o => { S.fx.push(o); if (S.fx.length > 400) S.fx.splice(0, S.fx.length - 400); };
  W.ms.forEach((m, i) => { const p = pre.c[i]; if (!p) return; for (let j = 0; j < 2; j++) { const c = p[j]; if (!c || c === m.cast || c === m.castB || c.t + W.dt < c.T - 1e-9 || m.st.stun > 0) continue;
    const s = c.s, f = { k: s.t, t0: W.t, s, src: m, x: p[2], y: p[3], tx: c.tx, ty: c.ty, tgt: c.tgt, hid: !!c.hid, vis: c.hid ? 0.35 : 1 };
    if (s.t === 'buff' || s.t === 'smother') f.dur = (s.b && s.b.d) || 1.2; add(f); } });
  for (const a of pre.areas) if (!W.areas.includes(a)) add({ k: 'boom', t0: W.t, s: a.s, src: a.src, x: a.x, y: a.y, r: a.r });
  for (const l of pre.lobs) if (!W.lobs.includes(l)) add({ k: 'boom', t0: W.t, s: l.s, src: l.src, x: l.x, y: l.y, r: l.r });
  for (const l of W.lobs) if (!LK.lob0.has(l)) LK.lob0.set(l, [l.src.x, l.src.y, l.t]);
  for (const p of W.proj) { let tr = LK.trail.get(p); if (!tr) LK.trail.set(p, tr = []); tr.push(p.x, p.y); if (tr.length > (V.proj.tail || 6) * 2) tr.splice(0, 2); }
  const cut = W.t - 2; if (S.fx.length && S.fx[0].t0 < cut) S.fx = S.fx.filter(f => f.t0 >= cut);
}
// 보는 편: 숨은 덫·숨긴 시전을 누구 눈으로 보나 (-1 전지적)
const viewSide = () => { const e = $('viewSide'); return e ? +e.value : -1; };
function zigzag(x0, y0, x1, y1, X, seed) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, n = Math.max(2, Math.round(L / (V.thread.seg || 1.6))), ux = -dy / L, uy = dx / L; ctx.beginPath(); ctx.moveTo(X(x0), X(y0));
  for (let i = 1; i < n; i++) { const k = i / n, o = (((i * 7919 + seed * 104729) % 13) / 6.5 - 1) * (V.thread.zig || 0.9); ctx.lineTo(X(x0 + dx * k + ux * o), X(y0 + dy * k + uy * o)); }
  ctx.lineTo(X(x1), X(y1)); ctx.stroke();
}
// 땅: 구역·벽·덫·지역 예고·곡사 그림자 (사람보다 아래)
function lookGround(W, X) {
  for (const z of W.zones) { const v = V.zone[z.k] || ['#ffffff', 0.1]; ctx.fillStyle = rgba(v[0], v[1]); ctx.save(); ctx.translate(X(z.x), X(z.y));
    if (z.shape !== 'circle' && z.len) { ctx.rotate(z.a || 0); ctx.fillRect(-X(z.len) / 2, -X(0.6), X(z.len), X(1.2)); if (v[2]) { ctx.strokeStyle = rgba(v[0], 0.6); ctx.lineWidth = 1; ctx.beginPath(); for (let k = -X(z.len) / 2; k < X(z.len) / 2; k += 5) { ctx.moveTo(k, X(0.6)); ctx.lineTo(k + 5, -X(0.6)); } ctx.stroke(); } }
    else { const r = X(z.r || 1); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); if (v[2]) { ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(v[0], 0.6); ctx.lineWidth = 1; ctx.beginPath(); for (let k = -r * 2; k < r * 2; k += 5) { ctx.moveTo(k - r, r); ctx.lineTo(k + r, -r); } ctx.stroke(); ctx.restore(); } }
    ctx.restore(); }
  for (const w of W.walls) { const c = w.mat ? (V.wall[w.mat] || V.stone) : V.stone; ctx.fillStyle = c; ctx.globalAlpha = w.hp0 ? Math.max(0.35, Math.min(1, w.hp / w.hp0)) : 1; const r = Math.max(2, X(w.r));
    if (w.grp >= 0 && !w.cage) ctx.fillRect(X(w.x) - r, X(w.y) - r, r * 2, r * 2); else { ctx.beginPath(); ctx.arc(X(w.x), X(w.y), r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.stroke(); } }
  ctx.globalAlpha = 1;
  const vs = viewSide();
  for (const t of W.traps) { if (t.done) continue; const c = elc(t.s), seenBy = q => q.side === vs && t.seen.has(q.id);
    const open = t.s.vis || (vs < 0 ? W.ms.some(q => q.side !== t.src.side && t.seen.has(q.id)) : W.ms.some(seenBy)), mine = vs < 0 || t.src.side === vs;
    if (!open && !mine) continue;   // 상대 편 눈에는 숨은 덫이 없다
    ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.setLineDash(open ? [] : [3, 3]); ctx.beginPath(); ctx.arc(X(t.x), X(t.y), Math.max(3, X(t.r)), 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(t.x), X(t.y), 1.6, 0, 7); ctx.fill(); }
  if (opt('vPre')) for (const a of W.areas) { if (vs >= 0 && a.src.side !== vs && !a.vis) continue; ctx.strokeStyle = elc(a.s); ctx.globalAlpha = 0.85; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(X(a.x), X(a.y), X(a.r), 0, 7); ctx.stroke(); ctx.setLineDash([]);
    const k = a.s.delay ? Math.max(0, Math.min(1, 1 - a.t / a.s.delay)) : 0; ctx.globalAlpha = 0.18 + 0.25 * k; ctx.fillStyle = elc(a.s); ctx.beginPath(); ctx.arc(X(a.x), X(a.y), X(a.r) * k, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }   // 예고: 차오르며 터질 때를 알린다
  for (const l of W.lobs) { const s0 = LK.lob0.get(l), c = elc(l.s); if (opt('vPre')) { ctx.strokeStyle = c; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(X(l.x), X(l.y), X(l.r), 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
    if (!s0) continue; const k = s0[2] > 0 ? Math.max(0, Math.min(1, 1 - l.t / s0[2])) : 1, gx = s0[0] + (l.x - s0[0]) * k, gy = s0[1] + (l.y - s0[1]) * k, h = 4 * k * (1 - k) * Math.hypot(l.x - s0[0], l.y - s0[1]) * (V.lob.arc || 0.35);
    ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(X(gx), X(gy), 4, 2, 0, 0, 7); ctx.fill();   // 땅의 그림자
    ctx.strokeStyle = rgba(c, 0.35); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i <= 16; i++) { const q = i / 16, x = s0[0] + (l.x - s0[0]) * q, y = s0[1] + (l.y - s0[1]) * q, hh = 4 * q * (1 - q) * Math.hypot(l.x - s0[0], l.y - s0[1]) * (V.lob.arc || 0.35); if (i) ctx.lineTo(X(x), X(y) - X(hh)); else ctx.moveTo(X(x), X(y)); } ctx.stroke();   // 포물선
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(gx), X(gy) - X(h), 3.5, 0, 7); ctx.fill(); }
}
// 공중: 투사체, 풀린 마법의 효과 (사람보다 위)
function lookAir(W, X, F) {
  const P = V.proj;
  for (const p of W.proj) { const c = p.s.mundane ? V.el['없음'] : elc(p.s), r = (P.r0 || 2.2) + (P.rk || 2.6) * Math.cbrt(p.s.m || 0.1) * (p.s.big ? P.big || 1.6 : 1), tr = LK.trail.get(p);
    if (tr && tr.length > 2) { ctx.strokeStyle = rgba(c, 0.45); ctx.lineWidth = r * 0.9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(tr[0]), X(tr[1])); for (let i = 2; i < tr.length; i += 2) ctx.lineTo(X(tr[i]), X(tr[i + 1])); ctx.lineTo(X(p.x), X(p.y)); ctx.stroke(); ctx.lineCap = 'butt'; }   // 꼬리 (유도면 휜다)
    ctx.fillStyle = rgba(c, 0.25); ctx.beginPath(); ctx.arc(X(p.x), X(p.y), r * 2, 0, 7); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(p.x), X(p.y), r, 0, 7); ctx.fill(); }
  // 열선: 짓는 동안 핵이 빛난다
  for (const m of W.ms) for (const cs of [m.cast, m.castB]) if (cs && cs.s.t === 'beam' && m.hp > 0) { const k = Math.min(1, cs.t / cs.T); ctx.fillStyle = rgba(elc(cs.s), 0.3 + 0.6 * k); ctx.beginPath(); ctx.arc(X(m.x), X(m.y), 3 + 5 * k, 0, 7); ctx.fill(); }
  let white = 0;
  for (const f of S.fx) { const age = W.t - f.t0; if (age < 0) continue; const c = elc(f.s); ctx.globalAlpha = f.vis;
    switch (f.k) {
      case 'thread': { const T = V.thread.t || 0.3; if (age > T) break; ctx.strokeStyle = c; ctx.globalAlpha = f.vis * (1 - age / T); ctx.lineWidth = 2.2; const tx = f.tgt && f.tgt.hp > 0 ? f.tgt.x : f.tx, ty = f.tgt && f.tgt.hp > 0 ? f.tgt.y : f.ty;
        zigzag(f.x, f.y, tx, ty, X, Math.floor(f.t0 * 30)); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 0.8; zigzag(f.x, f.y, tx, ty, X, Math.floor(f.t0 * 30)); break; }
      case 'boom': { const T = V.area.boom || 0.35; if (age > T) break; ctx.fillStyle = c; ctx.globalAlpha = 0.65 * (1 - age / T); ctx.beginPath(); ctx.arc(X(f.x), X(f.y), X(f.r) * (0.8 + 0.4 * age / T), 0, 7); ctx.fill(); break; }
      case 'cone': { const T = V.cone.t || 0.35; if (age > T) break; const a = Math.atan2(f.ty - f.y, f.tx - f.x), L = X((f.s.L || 3) * 1.4); ctx.fillStyle = c; ctx.globalAlpha = 0.5 * (1 - age / T);
        ctx.beginPath(); ctx.moveTo(X(f.x), X(f.y)); ctx.arc(X(f.x), X(f.y), L, a - 0.45, a + 0.45); ctx.closePath(); ctx.fill(); break; }
      case 'flash': { const T = V.flash.t || 0.18; if (age > T) break; white = Math.max(white, 1 - age / T); ctx.strokeStyle = c; ctx.globalAlpha = 1 - age / T; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X(f.x), X(f.y), 10 + 40 * age / T, 0, 7); ctx.stroke(); break; }
      case 'beam': { const T = V.beam.t || 0.22; if (age > T) break; ctx.strokeStyle = c; ctx.globalAlpha = 1 - age / T; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(X(f.x), X(f.y)); ctx.lineTo(X(f.tgt ? f.tgt.x : f.tx), X(f.tgt ? f.tgt.y : f.ty)); ctx.stroke(); break; }
      case 'taunt': { if (age > 0.6) break; ctx.strokeStyle = c; ctx.globalAlpha = 1 - age / 0.6; ctx.lineWidth = 1.5; const a = Math.atan2(f.ty - f.y, f.tx - f.x), L = Math.hypot(f.tx - f.x, f.ty - f.y);
        for (let w = 0; w < 3; w++) { const d = (age * 3 + w / 3) % 1 * L; ctx.beginPath(); ctx.arc(X(f.x), X(f.y), X(d), a - 0.3, a + 0.3); ctx.stroke(); } break; }   // 물결 모양 신호
      case 'touch': { if (age > 0.3) break; ctx.strokeStyle = c; ctx.globalAlpha = 1 - age / 0.3; ctx.lineWidth = 2; const x = X(f.tgt ? f.tgt.x : f.tx), y = X(f.tgt ? f.tgt.y : f.ty);
        ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * 0.785; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); } ctx.stroke(); break; }   // 불꽃
      case 'shoot': { if (age > 0.35) break; ctx.strokeStyle = c; ctx.globalAlpha = 1 - age / 0.35; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(f.x), X(f.y), X((f.s.r || 4) * age / 0.35), 0, 7); ctx.stroke(); break; }   // 공중에서 터짐
      case 'ring': { if (age > 0.4) break; ctx.strokeStyle = c; ctx.globalAlpha = 1 - age / 0.4; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(X(f.src.x), X(f.src.y), X(0.5 + 2.5 * age / 0.4), 0, 7); ctx.stroke(); break; }   // 퍼지는 고리
      case 'buff': case 'smother': { if (age > f.dur || f.src.hp <= 0) break; ctx.strokeStyle = c; ctx.globalAlpha = f.vis * 0.6 * (1 - age / f.dur * 0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X(f.src.x), X(f.src.y), 11, 0, 7); ctx.stroke(); break; }   // 몸을 감싸는 빛
      case 'move': { if (age > 0.7 || f.src.hp <= 0) break; ctx.strokeStyle = c; ctx.globalAlpha = 0.6 * (1 - age / 0.7); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(f.x), X(f.y)); ctx.lineTo(X(f.src.x), X(f.src.y)); ctx.stroke(); ctx.lineCap = 'butt'; break; }   // 지나간 자리
      case 'topple': { if (age > 0.5) break; const a = Math.atan2(f.ty - f.y, f.tx - f.x), k = age / 0.5; ctx.save(); ctx.translate(X(f.tx), X(f.ty)); ctx.rotate(a); ctx.fillStyle = V.stone; ctx.globalAlpha = 1 - k;
        ctx.fillRect(0, -X(1.5), X(2.5) * (0.3 + k), X(3)); ctx.restore(); break; }   // 넘어지는 벽
    }
    ctx.globalAlpha = 1; }
  if (white > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(255,255,255,' + (0.45 * white) + ')'; ctx.fillRect(0, 0, 800, 600); ctx.restore(); }   // 번쩍임: 화면이 하얗게
  if (opt('vName')) for (const f of S.fx) { const age = W.t - f.t0, T = V.name.t || 0.8; if (age < 0 || age > T || f.k === 'boom' || f.src.hp <= 0) continue;
    const zy = f.src.z > 0.05 ? Math.min(40, f.src.z * 3) : 0; ctx.font = '600 ' + F(11) + 'px system-ui'; ctx.textAlign = 'center'; ctx.globalAlpha = f.vis * (1 - age / T); ctx.fillStyle = 'rgba(0,0,0,.6)';
    const w = ctx.measureText(f.s.n).width; ctx.fillRect(X(f.src.x) - w / 2 - 3, X(f.src.y) - zy - 44 - age * 14, w + 6, 14); ctx.fillStyle = elc(f.s); ctx.fillText(f.s.n, X(f.src.x), X(f.src.y) - zy - 33 - age * 14); ctx.globalAlpha = 1; }   // 풀릴 때 이름이 떴다 사라짐
}
// 과녁의 상태: 굳음(번개 무늬)·묶임(사슬)·눈멂(흰 띠)·젖음(물방울)·불붙음(불꽃)
function lookStatus(m, x, y) {
  if (!opt('vSt') || m.hp <= 0) return; const st = m.st, C = V.status;
  if (st.stun > 0) { ctx.strokeStyle = C.stun; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 3; i++) { const a = i * 2.09 + (performance.now() / 300); const px = x + Math.cos(a) * 12, py = y + Math.sin(a) * 12; ctx.moveTo(px - 3, py - 3); ctx.lineTo(px + 1, py); ctx.lineTo(px - 1, py + 1); ctx.lineTo(px + 3, py + 4); } ctx.stroke(); }
  if (st.root > 0 || st.fetter > 0 || st.mycel > 0) { ctx.strokeStyle = C.root; ctx.lineWidth = 1.5; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(x + i * 3.5, y + 9, 2.2, 1.4, 0, 0, 7); ctx.stroke(); } }
  if (st.blind > 0) { ctx.fillStyle = C.blind; ctx.globalAlpha = 0.85; ctx.fillRect(x - 8, y - 3, 16, 3); ctx.globalAlpha = 1; }
  if (st.wet > 0) { ctx.fillStyle = C.wet; ctx.beginPath(); ctx.moveTo(x + 11, y - 9); ctx.quadraticCurveTo(x + 15, y - 3, x + 11, y - 2); ctx.quadraticCurveTo(x + 7, y - 3, x + 11, y - 9); ctx.fill(); }
  if (st.burn > 0) { ctx.fillStyle = C.burn; ctx.beginPath(); ctx.moveTo(x - 11, y - 10); ctx.quadraticCurveTo(x - 6, y - 4, x - 11, y - 1); ctx.quadraticCurveTo(x - 16, y - 4, x - 11, y - 10); ctx.fill(); }
}
// 마우스를 올린 효과: 마법 이름·쓴 사람·피해 (기본 피해, 위력 몫)
function lookHover(W, p) {
  if (!W || !p) return null; const near = (x, y, r) => Math.hypot(p.x - x, p.y - y) < r, txt = (s, src, pow) => s.n + ' · ' + (src ? src.name : '') + (dmgOf(s) ? ' · 피해 ' + Math.round(dmgOf(s)) + (pow && pow !== 1 ? ' × 위력 ' + pow.toFixed(1) : '') : '');
  for (const q of W.proj) if (near(q.x, q.y, 1.5)) return txt(q.s, q.src, q.pow);
  for (const a of W.areas) if (near(a.x, a.y, a.r)) return txt(a.s, a.src, a.pow) + ' · ' + a.t.toFixed(1) + ' s 뒤';
  for (const l of W.lobs) if (near(l.x, l.y, l.r)) return txt(l.s, l.src, l.pow) + ' · ' + l.t.toFixed(1) + ' s 뒤';
  for (const t of W.traps) if (!t.done && near(t.x, t.y, Math.max(1, t.r))) return txt(t.s, t.src, t.pow) + ' · 덫';
  for (let i = S.fx.length - 1; i >= 0; i--) { const f = S.fx[i]; if (W.t - f.t0 > 0.8) continue; if (near(f.tx, f.ty, f.r || 2) || near(f.x, f.y, 1.5)) return txt(f.s, f.src); }
  for (const z of W.zones) if (Math.hypot(p.x - z.x, p.y - z.y) < (z.r || (z.len || 2) / 2)) return (z.n || z.k) + ' · ' + (z.src ? z.src.name : '') + (z.dps ? ' · 초당 ' + z.dps.toFixed(1) : '') + ' · ' + (z.t > 0 ? z.t.toFixed(1) + ' s' : '');
  return null;
}
// 범례: 원소 빛깔 × 종류 모양
function renderLegend() {
  const box = $('legend'); if (!box) return; box.hidden = !$('vLeg').checked; if (box.hidden || box.dataset.done) return; box.dataset.done = 1;
  box.append(el('h2', {}, '그림 읽기'), el('div', { className: 'chips' }, ...Object.entries(V.el).map(([k, c]) => el('span', { className: 'chip', style: 'border-color:' + c + ';color:' + c }, V.elName[k] || k))),
    el('ul', { className: 'leg' }, ...Object.values(V.kind).map(t => el('li', {}, t))),
    el('p', { className: 'hint' }, '상태: 보랏빛 번개 무늬 = 굳음 · 흙빛 사슬 = 묶임 · 흰 띠 = 눈멂 · 물방울 = 젖음 · 주황 불꽃 = 불붙음. 숨긴 시전은 드러남만큼 희미하게'));
}

/* ---------------- 그리기 ---------------- */
// 사이를 부드럽게 (v2.4): 걸음보다 화면이 잦으면 지난 걸음과 이번 걸음 사이를 남은 시간 몫(α)만큼 이어 그린다.
// 그리는 동안만 자리를 바꿔 두고 그린 뒤 그대로 돌려놓는다 (판에는 닿지 않는다). 나란히 보는 세계도 같은 시각으로 (v0.2)
function lerped(W, prev, pp, a, fn) {
  if (!W || !prev || a >= 1 || prev.length !== W.ms.length) return fn();
  const keep = W.ms.map(m => [m.x, m.y, m.z]), kp = pp ? W.proj.map(p => [p.x, p.y]) : null;
  W.ms.forEach((m, i) => { const q = prev[i]; m.x = q[0] + (m.x - q[0]) * a; m.y = q[1] + (m.y - q[1]) * a; m.z = q[2] + (m.z - q[2]) * a; });
  if (pp) W.proj.forEach(p => { const q = pp.get(p); if (q) { p.x = q[0] + (p.x - q[0]) * a; p.y = q[1] + (p.y - q[1]) * a; } });
  try { fn(); } finally { W.ms.forEach((m, i) => { m.x = keep[i][0]; m.y = keep[i][1]; m.z = keep[i][2]; }); if (kp) W.proj.forEach((p, i) => { p.x = kp[i][0]; p.y = kp[i][1]; }); }
}
function draw() {
  const W = world(), live = S.W && S.play && S.speed > 0, a = live && S.prev ? Math.min(1, S.acc / S.W.dt) : 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#121317'; ctx.fillRect(0, 0, 800, 600);
  const two = !!(S.W && S.W2), vp = two ? { x: 0, w: 398, h: 600, cam: S.cam, main: true } : { x: 0, w: 800, h: 600, cam: S.cam, main: true }; S.vp = vp;
  lerped(live ? W : null, S.prev, S.pp, a, () => draw0(W, vp));
  if (two) {
    const W2 = S.W2, td = S.W.t - (1 - a) * S.W.dt, a2 = live && S.prev2 ? Math.max(0, Math.min(1, (td - (W2.t - W2.dt)) / W2.dt)) : 1;
    lerped(live ? W2 : null, S.prev2, null, a2, () => draw0(W2, { x: 402, w: 398, h: 600, cam: S.cam2, main: false }));
    ctx.fillStyle = '#2a2b31'; ctx.fillRect(398, 0, 4, 600); hud();
  }
}
// 나란히 (v0.2): 칸마다 같은 시간 동안의 박자 (metrics/watch: 평균 속도·방향 전환·하는 일·교환)
function hud() {
  if (!S.hud || ++S.hudF % 15 === 0) S.hud = [S.W, S.W2].map(W => { let v = 0, tr = 0, ac = 0, n = 0, ex = 0; for (const m of W.ms) { const o = Wt.seen(W, m); v += o['평균 속도 (m/s)']; tr += o['초당 방향 전환']; ac += o['초당 하는 일']; ex = o['초당 교환']; n++; } return n ? [v / n, tr / n, ac / n, ex] : [0, 0, 0, 0]; });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = '600 12px system-ui'; ctx.textAlign = 'left';
  [S.W, S.W2].forEach((W, i) => { const h = S.hud[i], x = i ? 410 : 8, y = 582, name = (i ? besideOf(S.scene) : S.scene).name || '', tx = W.t.toFixed(1) + ' s · ' + h[0].toFixed(1) + ' m/s · 방향 전환 ' + h[1].toFixed(1) + '/s · 하는 일 ' + h[2].toFixed(1) + '/s · 교환 ' + h[3].toFixed(2) + '/s';
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - 4, y - 30, 386, 36); ctx.fillStyle = '#e9e4d8'; ctx.fillText(name.slice(0, 44), x, y - 14); ctx.fillStyle = '#ffe28a'; ctx.fillText(tx, x, y);
      });
}
// 카메라 (v2.13): 판이 돌면 살아 있는 사람들을 따라가며 확대한다(둘레 12 m 여유, 1~4배, 멀어지면 줌아웃). 편집할 땐(판이 없거나 끔) 싸움터 전체. 화면 칸마다 (v0.2)
function camera(W, sc, vp) {
  let tx = W.width * sc / 2, ty = W.height * sc / 2, tz = 1;
  if (S.W && S.follow && $('follow').checked) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const m of W.ms) if (m.hp > 0) { if (m.x < x0) x0 = m.x; if (m.x > x1) x1 = m.x; if (m.y < y0) y0 = m.y; if (m.y > y1) y1 = m.y; }
    if (x1 >= x0) { const pad = 12; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad; tx = (x0 + x1) / 2 * sc; ty = (y0 + y1) / 2 * sc;
      tz = Math.max(1, Math.min(4, vp.w / ((x1 - x0) * sc), vp.h / ((y1 - y0) * sc))); }
  }
  const c = vp.cam, k = S.W && S.follow ? 0.12 : 1; c.x += (tx - c.x) * k; c.y += (ty - c.y) * k; c.z += (tz - c.z) * k;
}
function draw0(W, vp) {
  const sc = Math.min(vp.w / W.width, vp.h / W.height), X = v => v * sc; if (vp.main) S.sc = sc;
  ctx.save(); ctx.beginPath(); ctx.rect(vp.x, 0, vp.w, vp.h); ctx.clip();
  camera(W, sc, vp); const cam = vp.cam, cz = cam.z, F = px => (px / Math.sqrt(cz)).toFixed(1); ctx.setTransform(cz, 0, 0, cz, vp.x + vp.w / 2 - cam.x * cz, vp.h / 2 - cam.y * cz);   // 확대해도 글자는 덜 커진다
  const lab = [];   // 이름표 자리 (겹치면 아래로 민다)
  ctx.fillStyle = '#34322d'; ctx.fillRect(0, 0, X(W.width), X(W.height));
  ctx.fillStyle = 'rgba(235,232,220,.13)'; for (const r of W.salt || []) ctx.fillRect(X(r.x), X(r.y), X(r.w), X(r.h));   // 소금 땅 (rules/saltLand)
  ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 5; x < W.width; x += 5) { ctx.moveTo(X(x), 0); ctx.lineTo(X(x), X(W.height)); } for (let y = 5; y < W.height; y += 5) { ctx.moveTo(0, X(y)); ctx.lineTo(X(W.width), X(y));
    } ctx.stroke();
  if (W.rules.saltRing) { ctx.strokeStyle = 'rgba(245,245,235,.75)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.arc(X(W.width / 2), X(W.height / 2), X(A.saltR(W)), 0, 7);
    ctx.stroke(); ctx.setLineDash([]); }
  for (const o of W.obs) { ctx.fillStyle = '#6e685f'; ctx.beginPath(); ctx.arc(X(o.x), X(o.y), X(o.r), 0, 7); ctx.fill(); }
  for (const b of W.barrels) { ctx.fillStyle = b.ex ? '#3a2a20' : '#a8744a'; ctx.beginPath(); ctx.arc(X(b.x), X(b.y), Math.max(5, X(0.35)), 0, 7); ctx.fill(); }
  lookGround(W, X);   // 마법 그림 (v0.3): 구역·벽·덫·지역 예고·곡사
  for (const m of W.ms) if (m.op.cur && m.hp > 0 && m.op.tx === m.op.tx) { const x = X(m.op.tx), y = X(m.op.ty); ctx.strokeStyle = COL[m.side % COL.length]; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke(); ctx.globalAlpha = 1; }   // 작전 겹이 고른 자리 (v2.5)
  for (const m of W.ms) if (m.fort.x === m.fort.x && m.hp > 0) { ctx.strokeStyle = COL[m.side % COL.length]; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.setLineDash([1, 5]); ctx.beginPath();
    ctx.arc(X(m.fort.x), X(m.fort.y), X(10), 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }   // 진지 (v2.3, rules/fort)
  // 예비동작 선
  for (const m of W.ms) for (const c of [m.cast, m.castB]) if (c && m.hp > 0) { ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(X(m.x), X(m.y)); ctx.lineTo(X(c.tx), X(c.ty)); ctx.stroke(); ctx.setLineDash([]); }
  const selM = S.sel && S.sel.k === 'mage' ? S.sel : null;
  // 높이 (비행, v2.0): 땅에 그림자, 몸은 높이만큼 위로 올려 그리고 숫자를 단다. 속도는 꼬리선(0.3 s 동안 온 길)
  for (const m of W.ms) if (m.hp > 0) {
    const sp = Math.hypot(m.vx, m.vy), zy = m.z > 0.05 ? Math.min(40, m.z * 3) : 0;
    if (zy) { ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(X(m.x), X(m.y), 8, 4, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(X(m.x), X(m.y)); ctx.lineTo(X(m.x), X(m.y) - zy); ctx.stroke(); }
    if (sp > 6) { ctx.strokeStyle = COL[m.side % COL.length]; ctx.globalAlpha = 0.45; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(m.x), X(m.y) - zy);
      ctx.lineTo(X(m.x - m.vx * 0.3), X(m.y - m.vy * 0.3) - zy); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  for (const m of W.ms) {
    const zy = m.hp > 0 && m.z > 0.05 ? Math.min(40, m.z * 3) : 0, x = X(m.x), y = X(m.y) - zy, c = COL[m.side % COL.length], dead = m.hp <= 0;
    ctx.globalAlpha = dead ? 0.25 : (m.roll > 0 || m.flee ? 0.55 : 1);
    if (selM && m._ref && m._ref[0] === selM.s && m._ref[1] === selM.i) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(x, y, 17, 0, 7);
      ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle = '#1b1c20'; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2.6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(m.aim) * 13, y + Math.sin(m.aim) * 13); ctx.stroke();
    if (m.buf.front) { ctx.strokeStyle = '#d8d1c3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 13, m.aim - 0.9, m.aim + 0.9); ctx.stroke(); }
    if (m.flee && !dead) { ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      if (W.ms.length <= 60) { ctx.font = '' + F(9) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd27a'; ctx.fillText('도망', x, y + 21); } }   // 사기가 꺾여 도망치는 사람 (rules/morale)
    const k = m._k; if (k && k.covPts && !dead && W.t - k.covT < 0.6) { ctx.fillStyle = c; ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.globalAlpha = 0.8;
      for (let i = 0; i < k.covN; i++) { ctx.beginPath(); ctx.arc(X(k.covPts[i * 3]), X(k.covPts[i * 3 + 1]), k.covPts[i * 3 + 2] ? 2 : 3, 0, 7); if (k.covPts[i * 3 + 2]) ctx.stroke();
        else ctx.fill(); } ctx.globalAlpha = dead ? 0.25 : (m.roll > 0 || m.flee ? 0.55 : 1); }   // 덮기: 상대가 갈 수 있는 곳 (속 찬 점 땅, 빈 점 하늘, v2.12)
    if (m.st.guard > 0 && !dead) { ctx.strokeStyle = 'rgba(159,224,255,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 10.5, 0, 7); ctx.stroke(); }   // 막기를 켰다 (v2.14, rules/pace): 몸에 붙은 얇은 고리
    if (m.st.breath > 0 && !dead) { ctx.strokeStyle = 'rgba(200,235,210,.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 22, 0, 7); ctx.stroke(); }   // 숨을 마시는 중 (v2.11): 옅은 고리
    if (m.wave) { ctx.strokeStyle = 'rgba(111,214,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 19, 0, 7); ctx.stroke(); }
    if (m.mlog.rings && !dead) { const sel = selM && m._ref && m._ref[0] === selM.s && m._ref[1] === selM.i, big = m.C >= 8 || sel || sc * cz >= RING_PX;   // 고리 장부 (v2.22): 대마법사와 고른 사람은 늘, 나머지는 화면에서 충분히 클 때만 (v0.3)
      if (big) drawRings(W, m, x, y, X(m.y)); else { const e = m.mlog.rings.r.filter(g => !g.id).length; ctx.strokeStyle = 'rgba(233,228,216,.35)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x, y, 10.5, 0, 7); ctx.stroke();
        if (e) { ctx.font = '' + F(8) + 'px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(233,228,216,.6)'; ctx.fillText('○' + e, x + 9, y - 8); } } }   // 멀면 고리 대신 빈 고리 수만 얇게
    else if (m.castB) { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    const cs = m.cast || m.chan;
    if (cs && !dead) { const pr = m.cast ? m.cast.t / m.cast.T : 1; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 11, -1.57, -1.57 + Math.min(1, pr) * 6.28);
      ctx.stroke(); ctx.font = '' + F(10) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#e9e4d8'; ctx.fillText(cs.s.n, x, y + 22); }
    ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - 14, y - 16, 28, 3); ctx.fillStyle = c; ctx.fillRect(x - 14, y - 16, 28 * Math.max(0, m.hp) / m.hpMax, 3);
    ctx.fillStyle = '#ff8a7a'; ctx.fillRect(x - 14, y - 12, 28 * Math.min(1, m.fat / 100), 1.5);
    lookStatus(m, x, y);   // 상태 표시 (v0.3)
    if (W.ms.length <= 12) { ctx.font = '600 ' + F(10) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = c;
      const tx = m.name + ' ' + m.stance[0] + (m.tac.rhythm && m.C >= 5 && !dead ? ' · ' + PHASE[m.phase] : '') + (m.op.cur && !dead ? ' · ' + OPN[m.op.cur] : ''), lw = ctx.measureText(tx).width, lh = 11 / Math.sqrt(cz);
      let ly = y - 20; for (let k = 0; k < 8 && lab.some(b => Math.abs(b[0] - x) < (b[2] + lw) / 2 && Math.abs(b[1] - ly) < lh); k++) ly -= lh; lab.push([x, ly, lw]); ctx.fillText(tx, x, ly); }   // 이름표가 겹치면 위로 민다 (v2.13)   // 리듬 단계 (v2.2)
    if (zy) { ctx.font = '' + F(10) + 'px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = '#cfe6ff';
      ctx.fillText(m.z.toFixed(1) + ' m · ' + Math.round(Math.hypot(m.vx, m.vy)) + ' m/s' + (m.cut.k ? ' · ' + CUTN[m.cut.k] : '') + (m.cut.on ? ' · 쿠션' : ''), x + 12, y + 4); }
    if (!dead && W.t < m.rx.until) { ctx.font = '600 ' + F(9) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffe28a'; ctx.fillText(m.rx.vx || m.rx.vy ? '반사' : '멈칫', x, y + 32); }   // 반사 겹이 걸음을 덮는 중 (v2.4)
    if (!dead && m.cast && m.cast.bp) { ctx.font = '600 ' + F(9) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#c9b08a';
      ctx.fillText('청사진 ' + m.cast.bp.name + ' ' + m.cast.bp.built + '/' + m.cast.bp.items.length, x, y + 42); }
  }
  lookAir(W, X, F);   // 마법 그림 (v0.3): 투사체·실·폭발·부채꼴·번쩍임·열선·도발·이름
  if (S.sel && S.sel.k !== 'mage') { const it = itemOf(S.sel); if (it) { ctx.strokeStyle = '#fff'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(X(it.x), X(it.y), X(it.r || 0.4) + 5, 0, 7);
      ctx.stroke(); ctx.setLineDash([]); } }
  if ($('mind').checked && S.W) mind(W, X, F);   // 판단 그림 (v0.2)
  ctx.setTransform(1, 0, 0, 1, 0, 0);   // 여기부터 화면 위 (카메라와 상관없이)
  if (S.W && vp.main) { ctx.font = '600 12px system-ui'; ctx.textAlign = 'left'; let yy = 18; for (const e of S.ev) { if (S.W.t - e.t > 6) continue;
      ctx.globalAlpha = Math.max(0.3, 1 - (S.W.t - e.t) / 6); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(8, yy - 12, ctx.measureText(e.txt).width + 10, 16); ctx.fillStyle = e.col;
      ctx.fillText(e.txt, 13, yy); yy += 18; } ctx.globalAlpha = 1; const sl = S.play ? slowNow() : null; if (sl) { ctx.fillStyle = '#ffe28a'; ctx.textAlign = 'right';
      ctx.fillText('느리게' + (sl.txt ? ' · ' + sl.txt : ''), vp.x + vp.w - 8, 18); } }   // 사건 줄 (v2.13), 사건 직전 느리게 (v0.2)
  if (vp.main && S.hover && S.W) { const t = lookHover(W, S.hover.w); if (t) { ctx.font = '12px system-ui'; ctx.textAlign = 'left'; const w = ctx.measureText(t).width, hx = Math.min(790 - w, S.hover.sx + 12), hy = Math.max(16, S.hover.sy - 10);
    ctx.fillStyle = 'rgba(0,0,0,.75)'; ctx.fillRect(hx - 4, hy - 13, w + 8, 18); ctx.fillStyle = '#e9e4d8'; ctx.fillText(t, hx, hy); } }   // 마우스를 올린 효과 (v0.3)
  if (S.W && A.over(W)) { const r = A.result(W); ctx.font = '600 22px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = r.winner >= 0 ? COL[r.winner % COL.length] : '#e9e4d8';
    ctx.fillText(vp.main ? winText(r) : r.winner < 0 ? '무승부' : '편 ' + r.winner + ' 승리', vp.x + vp.w / 2, 34); }
  ctx.restore();
  if (vp.main) $('clock').textContent = (S.W ? S.W.t.toFixed(2) : '0.00') + ' / ' + S.scene.maxT + '초' + (S.W && S.W.dt < A.DT ? ' · 1/' + Math.round(1 / S.W.dt) + ' s 걸음' : '');
}
// 판단 그림 (v0.2): 판에 닿지 않고 두뇌가 남긴 것(m._k, 시전 객체, m.herd)을 읽기만 한다
//   몰이 화살표(m.herd: 상대를 어느 옆으로 미는가, 작전 몰이), 덮기(상대가 갈 수 있는 곳 점 + 그곳을 덮는 지어지는 마법의 원),
//   노리는 자리(흐림: 지어지는 공격이 과녁이 있으리라 믿는 곳)와 실제 자리를 잇는 선, 속임수(속임 수·미끼 덮기·날기 속이기), 걸어둔 마법(붙잡아 둔 두 번째 칸) 점선
function mind(W, X, F) {
  const lab = (t, x, y, c) => { ctx.font = '600 ' + F(9) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(t, x, y); };
  for (const m of W.ms) {
    if (m.hp <= 0) continue; const c = COL[m.side % COL.length], k = m._k;
    // 몰이: 과녁을 옆으로 미는 화살표
    const e = k && k.e; if (e && e.hp > 0 && ((m.herd && W.t < m.herd.until) || m.op.cur === 'herd')) {
      const dx = e.x - m.x, dy = e.y - m.y, l = Math.hypot(dx, dy) || 1, sd = m.herd && W.t < m.herd.until ? m.herd.side : (m.op.tx === m.op.tx ? Math.sign((m.op.tx - e.x) * -dy / l + (m.op.ty - e.y) * dx / l) || 1 : 1), px = -dy / l * sd, py = dx / l * sd;
      const x0 = X(e.x), y0 = X(e.y), x1 = X(e.x + px * 6), y1 = X(e.y + py * 6); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      const an = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 9 * Math.cos(an - 0.45), y1 - 9 * Math.sin(an - 0.45));
        ctx.lineTo(x1 - 9 * Math.cos(an + 0.45), y1 - 9 * Math.sin(an + 0.45)); ctx.fill(); lab('몰이', x1, y1 - 6, c); ctx.globalAlpha = 1;
    }
    for (const cs of [m.cast, m.castB]) {
      if (!cs) continue; const q = cs.tgt;
      // 노리는 자리(흐림)와 실제 자리
      if (q && q.hp > 0 && OFFT[cs.s.t]) { ctx.globalAlpha = 0.3; ctx.fillStyle = COL[q.side % COL.length]; ctx.beginPath(); ctx.arc(X(cs.tx), X(cs.ty), 8, 0, 7); ctx.fill(); ctx.globalAlpha = 0.5;
        ctx.strokeStyle = COL[q.side % COL.length]; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(X(cs.tx), X(cs.ty)); ctx.lineTo(X(q.x), X(q.y)); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1; }
      // 덮기: 덮는 마법의 원과 갈 곳 점
      if (cs.mode === 'cover') { const r = (cs.s.r || 1) * (A.sizeOf ? A.sizeOf(m, cs.s) : 1); ctx.strokeStyle = c; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.arc(X(cs.tx), X(cs.ty), X(r), 0, 7); ctx.stroke(); lab(cs.bait ? '미끼 덮기' : '덮기', X(cs.tx), X(cs.ty) - X(r) - 3, c); ctx.globalAlpha = 1;
        if (k && k.covPts) { ctx.fillStyle = c; ctx.globalAlpha = 0.85; for (let i = 0; i < k.covN; i++) { ctx.beginPath(); ctx.arc(X(k.covPts[i * 3]), X(k.covPts[i * 3 + 1]), 2.5, 0, 7); ctx.fill();
            } ctx.globalAlpha = 1; } }
      if (cs.feint) lab('속임수', X(m.x), X(m.y) + 52, '#ff9a8a');
      // 걸어둔 마법: 붙잡아 둔 칸은 과녁까지 점선
      if (cs.hold && !cs.go) { ctx.strokeStyle = '#c9b0ff'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(X(m.x), X(m.y)); ctx.lineTo(X(cs.tx), X(cs.ty)); ctx.stroke();
        ctx.setLineDash([]); lab('걸어둠 ' + cs.s.n, X((m.x + cs.tx) / 2), X((m.y + cs.ty) / 2) - 4, '#c9b0ff'); }
    }
    if (m.flog && m._feC && m._feC === (k && k.e && k.e.cast)) lab('날기 속이기', X(m.x), X(m.y) + 52, '#ff9a8a');
    // 수읽기 (v2.15): 거는 체크·메이트, 상대의 남은 방어 자원(막대)과 피할 곳(점: 열림 빈 점, 막힘 붉은 점), 그물·깨기
    if (PLN && k && m.tac.read && m.C >= 5 && e && e.hp > 0) {
      const S = PLN.ST.build(W, e, m, PSD, 0.5), b = PLN.resBars(S, PRB), ex = X(e.x), ey = X(e.y);
      for (let j = 0; j < 9; j++) { const bl = S.blk[j] > 0.05; ctx.globalAlpha = 0.8; ctx.fillStyle = '#ff6a5a'; ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath();
        ctx.arc(X(S.bx[j]), X(S.by[j]), bl ? 2.5 : 2, 0, 7); if (bl) ctx.fill(); else ctx.stroke(); }
      for (let i = 0; i < 6; i++) { if (b[i] < 0) continue; const x0 = ex - 21 + i * 7.2, y0 = ey + 14; ctx.globalAlpha = 0.9; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x0, y0, 6, 10);
        ctx.fillStyle = b[i] <= 0.02 ? '#7fe08a' : '#e0b25a'; const h = 10 * (1 - b[i]); ctx.fillRect(x0, y0 + 10 - h, 6, h); }
      ctx.globalAlpha = 1; ctx.font = F(7) + 'px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = '#e9e4d8'; ctx.fillText('구튀막방벽털', ex - 21, ey + 31);
    }
    for (const cs of [m.cast, m.castB]) if (cs && cs.tgt && cs.tgt.hp > 0) { if (cs.mate) { ctx.strokeStyle = '#ffd25a'; ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.arc(X(cs.tgt.x), X(cs.tgt.y), 24, 0, 7); ctx.stroke(); lab('메이트', X(cs.tgt.x), X(cs.tgt.y) - 30, '#ffd25a'); } else if (cs.chk) lab('체크', X(cs.tgt.x), X(cs.tgt.y) - 30, '#ff7a6b'); }
    if (k && k.brk > W.t) lab('그물 깨기', X(m.x), X(m.y) + 62, '#9fe0ff'); else if (k && m.tac.read && k.netN <= 1) lab('그물', X(m.x), X(m.y) + 62, '#ff9a8a');
  }
}
function winText(r) { return r.winner < 0 ? '무승부' : (S.scene.sides[r.winner].name || '편 ' + r.winner) + ' 승리' + (r.byTime ? ' (시간 판정)' : ''); }

/* ---------------- 싸움터 입력 ---------------- */
function mpos(e) { const b = cv.getBoundingClientRect(), c = S.cam, v = S.vp || { x: 0, w: 800, h: 600 }, sx = (e.clientX - b.left) / b.width * 800, sy = (e.clientY - b.top) / b.height * 600;
  return { x: ((sx - v.x - v.w / 2) / c.z + c.x) / S.sc, y: ((sy - v.h / 2) / c.z + c.y) / S.sc }; }   // 카메라를 거꾸로 (v2.13), 화면 칸 (v0.2)
function itemOf(sel) { const sc = S.scene; if (sel.k === 'obs') return Array.isArray(sc.obstacles) && sc.obstacles[sel.i]; if (sel.k === 'barrel') return sc.barrels && sc.barrels[sel.i];
  if (sel.k === 'wall') return sc.walls && sc.walls[sel.i]; if (sel.k === 'mage') return sc.sides[sel.s] && sc.sides[sel.s].mages[sel.i]; }
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
    if (t === 'mage') { const side = sc.sides[S.side] || sc.sides[0], tpl = side.mages[side.mages.length - 1] || { tier: '평범', deck: '합법 최강' };
      side.mages.push({ tier: tpl.tier, deck: tpl.deck, x: q.x, y: q.y }); S.sel = { k: 'mage', s: sc.sides.indexOf(side), i: side.mages.length - 1 }; }
    if (t === 'obs') { sc.obstacles.push({ x: q.x, y: q.y, r: 1.2 }); S.sel = { k: 'obs', i: sc.obstacles.length - 1 }; }
    if (t === 'barrel') { sc.barrels.push({ x: q.x, y: q.y }); S.sel = { k: 'barrel', i: sc.barrels.length - 1 }; }
    if (t === 'wall') { sc.walls = sc.walls || []; sc.walls.push({ x: q.x, y: q.y, r: 0.6, hp: 200 }); S.sel = { k: 'wall', i: sc.walls.length - 1 }; }
  });
});
cv.addEventListener('pointerleave', () => { S.hover = null; });
cv.addEventListener('pointermove', e => { { const b = cv.getBoundingClientRect(); S.hover = { w: mpos(e), sx: (e.clientX - b.left) / b.width * 800, sy: (e.clientY - b.top) / b.height * 600 }; }
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
    live && S.W ? el('p', { className: 'hint' }, '지금: 체력 ' + Math.round(Math.max(0, live.hp)) + ', 피로 ' + Math.round(live.fat) + ', 입장 ' + (STANCE[live.stance] || live.stance) + (live.wave ? ', 파도를 탄다' : live.crash > 0 ? ', 꺼짐' : '')) : null,
    live && S.W && live.mlog.rings ? el('p', { className: 'hint' }, '고리: ' + ringsTxt(live.mlog.rings)) : null);
}

/* ---------------- 패널: 규칙, 장면 ---------------- */
function renderRules() {
  const box = $('tab-rules'); box.textContent = '';
  const R = S.scene.rules, D0 = A.rulesOf ? A.rulesOf({ profile: R.profile }) : A.DEFAULT_RULES;   // 규칙 묶음이 있으면 그 위가 기본 (v2.23.1)
  if (A.PROFILES) { const sel = el('select', { 'aria-label': '규칙 묶음', on: { change: e => edit(sc => { if (e.target.value) sc.rules.profile = e.target.value; else delete sc.rules.profile; }) } }, el('option', { value: '' }, '(없음)'), ...Object.keys(A.PROFILES).filter(n => n !== 'desc').map(n => el('option', { value: n, selected: R.profile === n }, n)));
    box.append(el('div', { className: 'rule' }, el('div', { className: 'top' }, el('b', {}, '규칙 묶음'), sel), el('div', { className: 'd' }, '고르면 그 스위치들이 켜진 것이 기본이 된다 (data/profiles.json)'))); }
  for (const k of Object.keys(A.DEFAULT_RULES)) {
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
  tb.append(el('tr', {}, ...['이름', '편', '체력', '준 피해', '맞힘/시전', '헛시전', '폭주', '파도', '입장', '작전', '방식', '숨'].map(h => el('th', {}, h))));
  const rows = W.ms.length > 40 ? W.ms.filter((m, i) => i < 20 || m.hp > 0).slice(0, 40) : W.ms;
  for (const m of rows) tb.append(el('tr', {}, el('td', { style: 'color:' + COL[m.side % COL.length] }, m.name), el('td', {}, S.scene.sides[m.side] ? S.scene.sides[m.side].name : m.side), el('td', {}, (m.hp > 0 ? Math.max(1, Math.round(m.hp)) : 0) + '/' + Math.round(m.hpMax)),
    el('td', {}, Math.round(sum(m.log.dealt))), el('td', {}, sum(m.log.hits) + '/' + sum(m.log.casts)), el('td', {}, m.log.fizz), el('td', {}, m.log.over), el('td', {}, m.log.waves + (m.wave ? ' 탐' : '')), el('td', {}, STANCE[m.stance] || m.stance), el('td', {}, m.op.cur ? OPN[m.op.cur] + (m.op.eOp ? ' (상대 ' + OPN[m.op.eOp] + ')' : '') : ''), el('td', { title: '지금 공격 방식 (v2.12)' }, m.hp > 0 && m._k && m._k.mode ? MODEN[m._k.mode] || m._k.mode : ''), el('td', { title: '남은 숨 (판마다 세 번, v2.11)' }, W.rules.breath ? breathDots(m) : '')));
  if (rows.length < W.ms.length) tb.append(el('tr', {}, el('td', { colSpan: 12, className: 'sub' }, '… ' + (W.ms.length - rows.length) + '명 줄임')));
  $('result').textContent = S.W && A.over(S.W) ? winText(A.result(S.W)) : '';
}

/* ---------------- 위쪽, 조작 ---------------- */
function renderAll() {
  renderSides(); renderMageEd(); renderRules(); renderSceneTab(); renderStats(); syncButtons();
  $('seed').value = S.scene.seed;
  const sel = $('scenes'); if (!sel.options.length) { sel.append(el('option', { value: '' }, '예시 장면…'));
    for (const [k, v] of Object.entries(D.scenes)) sel.append(el('option', { value: k }, v.name || k)); }
}
function syncButtons() { $('play').textContent = S.play ? '멈춤' : (S.W && A.over(S.W) ? '다시' : '재생'); $('exportRec').disabled = !S.W; }
function togglePlay() { if (S.W && A.over(S.W)) { reset(); } S.play = !S.play; if (S.play) { start(); last = performance.now(); } syncButtons(); }
function setTool(t) { S.tool = t; for (const b of document.querySelectorAll('#tools [data-tool]')) b.classList.toggle('on', b.dataset.tool === t);
  note(t === 'move' ? '' : t === 'mage' ? '싸움터를 누르면 「' + (S.scene.sides[S.side] || {}).name + '」 편에 사람을 놓는다.' : '싸움터를 누르면 놓는다. 고치면 판은 처음으로 돌아간다.'); }
function note(t) { $('note').textContent = t; }
function download(name, text) { const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: name }); document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
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
$('scrub').addEventListener('input', e => { S.scrub = true; $('scrubT').textContent = '→ ' + (+e.target.value).toFixed(2) + ' s'; });
$('scrub').addEventListener('change', e => { S.scrub = false; const p = S.play; seek(+e.target.value); S.play = p && !A.over(S.W); last = performance.now(); });   // 놓으면 그 시각으로 (v0.2)
$('seed').onchange = e => edit(sc => { sc.seed = Math.round(+e.target.value) || 1; });
for (const b of document.querySelectorAll('#tools [data-tool]')) b.onclick = () => setTool(b.dataset.tool);
for (const b of document.querySelectorAll('[data-tab]')) b.onclick = () => { S.tab = b.dataset.tab; for (const x of document.querySelectorAll('[data-tab]')) x.classList.toggle('on', x === b);
  $('tab-rules').hidden = S.tab !== 'rules'; $('tab-scene').hidden = S.tab !== 'scene'; };
$('scenes').onchange = e => { if (e.target.value) { loadScene(D.scenes[e.target.value]); S.play = true; start(); syncButtons(); } e.target.value = ''; };
$('exportScene').onclick = () => download((S.scene.name || 'scene').replace(/[^\w가-힣-]+/g, '_').slice(0, 40) + '.json', exportScene());
$('exportRec').onclick = () => { const t = exportRecording(); if (t) download('replay.json', t); };
$('file').onchange = e => { const f = e.target.files[0]; if (f) f.text().then(importText); e.target.value = ''; };
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) f.text().then(importText); });
$('addSide').onclick = () => edit(sc => { sc.sides.push({ name: '편' + sc.sides.length, brain: '기본', mages: [] }); S.side = sc.sides.length - 1; });
$('ver').textContent = 'v0.3 · 엔진 v' + A.VERSION;
$('vLeg').onchange = renderLegend; renderLegend();

// 시험·자동화용 손잡이
window.Sandbox = { S, loadScene, step, runToEnd, seek, exportScene, exportRecording, importText, reset: () => { reset(); renderAll(); } };

// 열면 첫 예시 장면이 바로 돈다
// 주소로 열기 (v0.3, node cli.js audit의 링크): #장면&seed=2&t=34.5 → 그 장면·씨앗을 그 시각까지 돌려 멈춘다
function openHash() {
  const h = decodeURIComponent((location.hash || '').slice(1)); if (!h) return false; const [key, ...kv] = h.split('&'), o = {}; for (const x of kv) { const [k, v] = x.split('='); o[k] = v; }
  const sc = D.scenes[key]; if (!sc) { note('주소의 장면이 없다: ' + key); return false; }
  const c = clone(sc); if (o.seed) c.seed = +o.seed; loadScene(c); if (o.t) { seek(+o.t); S.play = false; } else { S.play = true; start(); } syncButtons(); note('주소로 열었다: ' + key + (o.seed ? ' · 씨앗 ' + o.seed : '') + (o.t ? ' · ' + o.t + ' s' : '')); return true;
}
window.addEventListener('hashchange', openHash);
if (!openHash()) { loadScene(D.scenes.duel || Object.values(D.scenes)[0]); S.play = true; start(); syncButtons(); }
requestAnimationFrame(loop);
})();
