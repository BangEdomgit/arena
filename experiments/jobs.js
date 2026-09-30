'use strict';
/* 숨 결투장 v1.13.0 — 대실험 일감 (experiments/v2rules.js가 병렬 실행기로 나눠 부른다)
 * 모두 결정론: 씨앗이 판마다 정해져 있어 일꾼 수·차례와 상관없이 같은 결과다. 결과는 구조화 복제가 되는 값만.
 *   duel     1대1 N판 (versus.part와 같다: 점수·시간·시간 판정·기록 칸 합)
 *   crowd    한 명 대 무리 N판 (챌린저 대 브론즈 n명, 대마법사 대 둘러싸기)
 *   musket   대마법사 대 머스킷 병사 n명의 반원 (반지름 14 m)
 *   looks    한 사람의 행동 지표(A.look)를 판마다: 허수아비 또는 같은 등급 중급 상대 */
const A = require('../src');
const { part } = require('./versus');

// 허수아비: 서서 아무것도 하지 않는다
const DUMMY = { think(W, m) { m.mv.x = m.mv.y = 0; } };
const spec = o => { const s = A.mage(o); if (o.dummy) s.brain = DUMMY; return s; };

function crowd(center, member, n, from, N, rules, layout, maxT) {
  const o = { n: 0, win: 0, lose: 0, draw: 0, t: 0, hp: 0 };
  for (let k = from; k < from + N; k++) {
    const r = A.battle([spec(center)], Array.from({ length: n }, () => spec(member)), { seed: k + 1, rules, layout: layout || 'lines', maxT: maxT || 120 });
    o.n++; o.t += r.t; o.hp += Math.max(0, r.ms[0].hp) / r.ms[0].hpMax;
    if (r.winner === 0) o.win++; else if (r.winner === 1) o.lose++; else o.draw++;
  }
  return o;
}
function musketScene(n, seed, rules) {
  const cx = 6, cy = 15, R = 14, ms = [];
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + Math.PI * (i + 0.5) / n; ms.push({ tier: '병사', deck: '머스킷', x: +(cx + Math.cos(a) * R).toFixed(2), y: +(cy + Math.sin(a) * R * 0.95).toFixed(2) }); }
  return { v: A.VERSION, name: '머스킷 반원: 대마법사 대 병사 ' + n + '명', seed, width: 40, height: 30, maxT: 90, rules, obstacles: [],
    sides: [{ name: '대마법사', brain: '기본', mages: [{ tier: '대마법사', deck: '광역', x: cx, y: cy }] }, { name: '총병', brain: '기본', mages: ms }] };
}
function musket(n, from, N, rules) {
  const o = { n: 0, win: 0, lose: 0, draw: 0, t: 0, hp: 0 };
  for (let k = from; k < from + N; k++) {
    const r = A.runScene(musketScene(n, k + 1, rules)), c = r.ms[0];
    o.n++; o.t += r.t; o.hp += Math.max(0, c.hp) / c.hpMax;
    if (r.winner === 0) o.win++; else if (r.winner === 1) o.lose++; else o.draw++;
  }
  return o;
}
// 지표는 그 사람이 싸운 시간으로 (쓰러졌으면 쓰러질 때까지)
function looks(tier, skill, opp, from, N, rules) {
  const out = [];
  for (let k = from; k < from + N; k++) {
    const sw = k % 2, a = spec({ tier, skill, deck: '기술' }), b = spec(opp === 'dummy' ? { tier, deck: '기술', dummy: true } : { tier, skill: '중급', deck: '기술' });
    const r = sw ? A.duel(b, a, { seed: k + 1, rules }) : A.duel(a, b, { seed: k + 1, rules }), m = r.ms[sw ? 1 : 0];
    out.push(A.look(m, m.deathT ?? r.t));
  }
  return out;
}
module.exports = { duel: part, crowd, musket, musketScene, looks, DUMMY };
