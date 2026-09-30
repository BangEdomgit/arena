'use strict';
/* 숨 결투장 v1.11.0 — 표준 시험 묶음
 * 정해진 대진을 돌려 기준(suite-baseline.json)과 비교한다. 바뀐 줄만 보여 주고, 차이마다 판 수를 고려해
 * "운일 수 있음 / 진짜 차이"를 붙인다. 규칙이나 두뇌를 바꾼 뒤 무엇이 움직였는지 한눈에 보는 용도 (SPEC 21장).
 *   node cli.js suite            기준과 비교
 *   node cli.js suite 부류        한 묶음만
 *   node cli.js suite --save     지금 결과를 기준으로 저장
 * 모든 판은 결정론이라 아무것도 안 바꿨으면 차이가 없다. */
const fs = require('fs'), path = require('path');
const A = require('../src');
const BASE = path.join(__dirname, '..', 'suite-baseline.json');
const Z = 2.58;   // 이보다 크면 "진짜 차이" (양쪽 99%). 줄이 많아 우연히 튀는 것을 줄이려고 1.96보다 높게 잡았다

// 사람 한 명: '등급' 또는 { tier, skill, deck, type }. 판단 수준(skill)은 엔진의 A.SKILLS (1.5.0)
function mk(p) { const o = typeof p === 'string' ? { tier: p } : p, sp = A.mage({ tier: o.tier, skill: o.skill, deck: o.deck, type: o.type }); if (o.C) sp.C = o.C; return sp; }
const who = p => typeof p === 'string' ? p : [p.tier, p.C ? 'C' + p.C : '', p.skill, p.type, p.deck].filter(Boolean).join(' ');

// 1대1 N판, 씨앗 1..N, 판마다 자리를 번갈아 (node cli.js duel과 같은 방식)
function duels(a, b, N, rules) {
  const out = [];
  for (let k = 0; k < N; k++) { const sw = k % 2, x = mk(a), y = mk(b); const r = sw ? A.duel(y, x, { seed: k + 1, rules }) : A.duel(x, y, { seed: k + 1, rules }); out.push({ w: r.winner === -1 ? -1 : (r.winner === 0) !== !!sw ? 0 : 1, t: r.t, bt: r.byTime }); }
  return out;
}
// 한 명(가운데) 대 무리 N판
function rings(center, crowd, n, N) {
  const out = [];
  for (let k = 0; k < N; k++) { const r = A.battle([mk(center)], Array.from({ length: n }, () => mk(crowd)), { seed: k + 1, layout: 'ring', maxT: 90 }); out.push({ w: r.winner, t: r.t }); }
  return out;
}

// 싸우는 모습: 그 단계가 정해진 상대(같은 등급 중급)와 N판, 그 단계 쪽의 행동 지표(A.look) 평균과 표준편차.
// 덱은 기술을 보일 재료가 다 든 '기술', 화약통 켬. 상대를 고정해야 지표가 상대의 솜씨에 흔들리지 않는다
function looks(tier, skill, N) {
  const acc = {}, rules = { barrels: true };
  for (let k = 1; k <= N; k++) { const sw = k % 2, a = A.mage({ tier, skill, deck: '기술' }), b = A.mage({ tier, skill: '중급', deck: '기술' }); const r = sw ? A.duel(b, a, { seed: k, rules }) : A.duel(a, b, { seed: k, rules }); const m = r.ms[sw ? 1 : 0]; for (const [key, v] of Object.entries(A.look(m, m.deathT ?? r.t))) (acc[key] = acc[key] || []).push(v); }
  const look = {}; for (const [key, xs] of Object.entries(acc)) { const mu = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / Math.max(1, xs.length - 1)); look[key] = { m: +mu.toFixed(3), sd: +sd.toFixed(3) }; }
  return { N, look };
}

// 대진표. 줄의 id는 기준과 맞춰 보는 열쇠라 바꾸지 않는다 (바꾸면 새 줄·사라진 줄로 나온다)
function table() {
  const T = [], duel = (group, a, b, N, rules) => T.push({ id: group + ': ' + who(a) + ' 대 ' + who(b) + (rules ? ' ' + JSON.stringify(rules) : ''), group, N, run: () => duels(a, b, N, rules) });
  // 등급
  for (const t of ['평범', '중간', '상위']) duel('등급', t, t, 100);
  duel('등급', '중간', '평범', 100); duel('등급', '상위', '중간', 100); duel('등급', '대마법사', '상위', 100);
  // 판단 수준: 같은 등급에서 이웃 단계끼리
  const SK = ['초보', '중급', '상급', '대가', '전설'];
  for (const t of ['평범', '중간']) for (let i = 0; i < 4; i++) duel('판단', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100);
  // 부류 (파도 켬)
  for (const t of ['평범', '중간']) for (const [a, b] of [['서퍼', '메타'], ['서퍼', '이단'], ['메타', '이단']]) duel('부류', { tier: t, type: a }, { tier: t, type: b }, 100, { wave: true });
  // 덱
  for (const [a, b] of [['합법 최강', '기본기'], ['광역', '기본기'], ['자유', '기본기']]) duel('덱', { tier: '평범', deck: a }, { tier: '평범', deck: b }, 100);
  for (const [a, b] of [['합법 최강', '기본기'], ['광역', '기본기']]) duel('덱', { tier: '상위', deck: a }, { tier: '상위', deck: b }, 100);
  const els = ['불', '번개', '흙', '물', '얼음', '독'];
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) duel('원소', { tier: '평범', deck: els[i] }, { tier: '평범', deck: els[j] }, 20);
  // 둘러싸기
  for (const [c, q, n] of [[{ tier: '대마법사', deck: '광역' }, { tier: '평범', deck: '기본기' }, 50], [{ tier: '대마법사', deck: '광역' }, { tier: '병사', deck: '머스킷' }, 40], [{ tier: '상위', deck: '광역' }, { tier: '평범', deck: '기본기' }, 12]])
    T.push({ id: '둘러싸기: ' + who(c) + ' 대 ' + who(q) + ' ' + n + '명', group: '둘러싸기', N: 10, run: () => rings(c, q, n, 10) });
  // 도발 (1.4.0)
  for (const t of ['평범', '중간']) duel('도발', { tier: t, deck: '도발 합법 최강' }, { tier: t }, 100, { taunt: true });
  duel('도발', { tier: '중간', deck: '도발 합법 최강', type: '메타' }, { tier: '중간', deck: '도발 합법 최강', type: '서퍼' }, 100, { taunt: true, wave: true });
  duel('도발', { tier: '중간', deck: '도발 합법 최강', type: '서퍼' }, { tier: '중간', deck: '도발 합법 최강', type: '이단' }, 100, { taunt: true, wave: true });
  // 하이 리스크 (1.9.0): 판단 줄을 risk, risk + 소금 원으로
  for (const rules of [{ risk: true }, { risk: true, saltRing: true }]) for (const t of ['평범', '중간']) for (let i = 0; i < 4; i++) duel('큰 수', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100, rules);
  // 몸 묶기 (1.11.0): 판단 줄을 risk + bodyBind로
  for (const t of ['평범', '중간']) for (let i = 0; i < 4; i++) duel('몸 묶기', { tier: t, skill: SK[i + 1] }, { tier: t, skill: SK[i] }, 100, { risk: true, bodyBind: true });
  // 싸우는 모습 (1.7.0): 판단 수준마다 같은 단계끼리
  for (const t of ['평범', '중간']) for (const sk of SK) T.push({ id: '모습: ' + t + ' ' + sk, group: '모습', N: 40, run: () => looks(t, sk, 40) });
  // 힘 대 판단: 한 등급 위의 초보 대 한 등급 아래의 전설
  duel('힘 대 판단', { tier: '중간', skill: '초보' }, { tier: '평범', skill: '전설' }, 100);
  duel('힘 대 판단', { tier: '상위', skill: '초보' }, { tier: '중간', skill: '전설' }, 100);
  duel('힘 대 판단', { tier: '대마법사', skill: '초보' }, { tier: '상위', skill: '전설' }, 100);
  // 판단이 힘을 이기는 경계: 평범 초보의 선명도만 올린다 (1.0이면 판단 줄의 전설 대 초보와 같은 선명도)
  for (const c of [1.2, 1.5, 2.0]) duel('힘 대 판단', { tier: '평범', skill: '초보', C: c }, { tier: '평범', skill: '전설' }, 100);
  duel('힘 대 판단', { tier: '평범', skill: '전설' }, { tier: '평범', skill: '초보' }, 100);
  return T;
}
const GROUPS = ['등급', '판단', '큰 수', '몸 묶기', '모습', '부류', '덱', '원소', '둘러싸기', '도발', '힘 대 판단'];

// 한 줄의 요약: A승·B승·무, A의 점수(무 = 0.5), 평균 시간과 표준편차
function summarize(res) {
  const n = res.length, a = res.filter(r => r.w === 0).length, b = res.filter(r => r.w === 1).length, d = n - a - b;
  const mean = res.reduce((s, r) => s + r.t, 0) / n, sd = Math.sqrt(res.reduce((s, r) => s + (r.t - mean) ** 2, 0) / Math.max(1, n - 1));
  return { N: n, A: a, B: b, D: d, score: +((a + d / 2) / n).toFixed(4), t: +mean.toFixed(2), sd: +sd.toFixed(2), bt: res.filter(r => r.bt).length };
}
function run(only, log = () => {}) {
  const rows = {}, T = table().filter(r => !only || r.group === only);
  if (only && !T.length) throw new Error('없는 묶음: ' + only + ' (' + GROUPS.join(', ') + ')');
  const t0 = Date.now();
  T.forEach((r, i) => { const x = r.run(); rows[r.id] = Object.assign({ group: r.group }, x.look ? x : summarize(x)); log(`\r${i + 1}/${T.length} ${r.group}   `); });
  log(`\r${T.length}줄, ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  return { v: A.VERSION, date: new Date().toISOString().slice(0, 10), z: Z, rows };
}

// 판 수를 고려한 차이의 크기. 점수(승률)는 두 비율의 차, 시간은 두 평균의 차를 표준오차로 나눈다
function zScore(o, n) {
  const p = (o.score * o.N + n.score * n.N) / (o.N + n.N), se = Math.sqrt(p * (1 - p) * (1 / o.N + 1 / n.N));
  return se > 0 ? (n.score - o.score) / se : (n.score === o.score ? 0 : Infinity);
}
function zTime(o, n) { const se = Math.sqrt(o.sd ** 2 / o.N + n.sd ** 2 / n.N); return se > 0 ? (n.t - o.t) / se : (n.t === o.t ? 0 : Infinity); }
const verdict = z => Math.abs(z) >= Z ? '진짜 차이' : '운일 수 있음';
function compare(base, now) {
  const out = [];
  for (const [id, n] of Object.entries(now.rows)) {
    const o = base.rows[id];
    if (!o) { out.push({ id, kind: '새 줄', now: n }); continue; }
    if (n.look) {   // 모습 줄: 지표마다 평균의 차를 표준오차로
      const ch = Object.keys(n.look).filter(k => !o.look || !o.look[k] || o.look[k].m !== n.look[k].m).map(k => { const a = (o.look && o.look[k]) || { m: 0, sd: 0 }, b = n.look[k], se = Math.sqrt(a.sd ** 2 / o.N + b.sd ** 2 / n.N); return { k, a: a.m, b: b.m, z: se > 0 ? (b.m - a.m) / se : Infinity }; });
      if (ch.length) out.push({ id, kind: '모습', ch, now: n }); continue;
    }
    if (o.A === n.A && o.B === n.B && o.D === n.D && o.t === n.t && o.N === n.N) continue;
    out.push({ id, kind: '바뀜', old: o, now: n, zs: zScore(o, n), zt: zTime(o, n) });
  }
  return out;
}
const pct = v => (v * 100).toFixed(0) + '%', sgn = v => (v > 0 ? '+' : '') + v;
function format(d) {
  if (d.kind === '모습') return d.id + '\n' + d.ch.map(c => `    ${c.k}  ${c.a} → ${c.b}  z=${isFinite(c.z) ? c.z.toFixed(1) : '∞'}  → ${verdict(c.z)}`).join('\n');
  if (d.kind === '새 줄' && d.now.look) return `${d.id}\n    새 줄: ` + Object.entries(d.now.look).map(([k, v]) => k + ' ' + v.m).join(', ');
  if (d.kind === '새 줄') return `${d.id}\n    새 줄: ${d.now.A}:${d.now.B}:무 ${d.now.D} (${d.now.N}판), 시간 ${d.now.t} s`;
  const o = d.old, n = d.now, dp = Math.round((n.score - o.score) * 100);
  return `${d.id}\n    승패  ${o.A}:${o.B}:무 ${o.D} → ${n.A}:${n.B}:무 ${n.D} (${n.N}판), A 점수 ${pct(o.score)} → ${pct(n.score)} (${sgn(dp)}%p)  z=${d.zs.toFixed(1)}  → ${dp === 0 ? '같음' : verdict(d.zs)}` +
    `\n    시간  ${o.t} → ${n.t} s (${sgn(+(n.t - o.t).toFixed(2))})  z=${d.zt.toFixed(1)}  → ${n.t === o.t ? '같음' : verdict(d.zt)}`;
}

function main(args) {
  const save = args.includes('--save'), only = args.find(a => !a.startsWith('--'));
  const log = s => process.stderr.write(s);
  let now; try { now = run(only, log); } catch (e) { console.log(e.message); process.exitCode = 1; return; }
  if (save) {
    let base = { rows: {} }; if (only && fs.existsSync(BASE)) base = JSON.parse(fs.readFileSync(BASE, 'utf8'));   // 한 묶음만 저장하면 나머지 줄은 그대로 둔다
    const out = Object.assign({}, now, { rows: Object.assign({}, base.rows, now.rows) });
    fs.writeFileSync(BASE, JSON.stringify(out, null, 1) + '\n'); console.log('기준 저장:', path.basename(BASE), Object.keys(out.rows).length + '줄, 엔진 v' + now.v); return;
  }
  if (!fs.existsSync(BASE)) { console.log('기준이 없다. node cli.js suite --save로 먼저 저장한다.'); process.exitCode = 1; return; }
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8')), diff = compare(base, now);
  const gone = Object.keys(base.rows).filter(id => !now.rows[id] && (!only || base.rows[id].group === only));
  console.log(`기준: 엔진 v${base.v} (${base.date}) · 지금: v${now.v} · ${Object.keys(now.rows).length}줄 · |z| ≥ ${Z}이면 진짜 차이`);
  if (!diff.length && !gone.length) { console.log('바뀐 줄 없음'); return; }
  for (const d of diff) console.log(format(d));
  for (const id of gone) console.log(`${id}\n    사라진 줄`);
  const ch = diff.filter(d => d.kind === '바뀜' || d.kind === '모습'), real = ch.filter(d => d.kind === '모습' ? d.ch.some(c => Math.abs(c.z) >= Z) : Math.abs(d.zs) >= Z || Math.abs(d.zt) >= Z).length, added = diff.length - ch.length;
  console.log(`\n바뀐 줄 ${ch.length} (진짜 차이 ${real}, 운일 수 있음 ${ch.length - real})${added ? ', 새 줄 ' + added : ''}${gone.length ? ', 사라진 줄 ' + gone.length : ''}`);
}

module.exports = { GROUPS, table, run, summarize, compare, zScore, zTime, verdict, format, main, Z };
