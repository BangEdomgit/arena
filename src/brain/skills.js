'use strict';
/* 숨 결투장 — 판단 수준 (brain/skills, SPEC 13장)
 * 등급(힘)과 따로 고르는 솜씨 다섯 단계: 초보·중급·상급·대가·전설. 값은 data/skills.json.
 * 단계마다: 판단 간격 dec, 겨냥 흔들림 noise, 자동 구르기, 쓰는 서클(그릇 × 솜씨), 성향과 기술 스위치(tac).
 * from: 'basic'이면 기본기(basic) 위에, 단계 이름이면 그 단계의 tac 위에 덧쓴다. 구르기 상한·버릇(roll)은 모든 단계에 */
const D = require('../../data/skills.json');
// 실제로 쓰는 서클 = 그릇(등급) × 솜씨 (1.7.0)
const CIRC = { half: c => Math.max(1, Math.floor(c / 2)), minus1: c => Math.max(1, c - 1), same: c => c, plus1: c => c + 1 };
// 기술 스위치(tac) → 기술 파일 (techniques/). 무슨 단계가 무슨 기술을 켜는지 보일 때 쓴다
const TECH = { combo: 'combo', combo2: 'combo', plan: 'combo', cancel: 'cancel', cancel2: 'cancel', feint: 'feint', simul: 'simul', triple: 'simul', pause: 'tempo', tempo: 'tempo', bait: 'bait', learn: 'learn', counter: 'counter', cover: 'cover', strip: 'cover', outrange: 'position', terrain: 'position', lure: 'lure', fakeRetreat: 'lure', herd: 'herd', crowd: 'crowd', dodgeAim: 'dodgeAim', grab: 'grab', swarm: 'swarm', siege: 'siege', wallSite: 'siege', wallBreak: 'siege', retreat: 'siege', rhythm: 'rhythm', rhythmTime: 'rhythm', domainPush: 'rhythm', efficacy: 'efficacy', buffNeed: 'efficacy', shape: 'shape', roles: 'shape', survive: 'survive', sharp: 'sharp' };
const SKILLS = {}, CIRCLES = {};
for (const name in D.levels) {
  const L = D.levels[name], base = L.from === 'basic' ? D.basic : SKILLS[L.from].tac;
  if (!base) throw new Error('판단 수준 ' + name + ': 없는 바탕 ' + L.from);
  SKILLS[name] = { dec: L.dec, noise: L.noise, autoDodge: L.autoDodge, tac: Object.assign({}, D.roll, Object.assign({}, base, L.tac)) };
  if (!CIRC[L.circles]) throw new Error('판단 수준 ' + name + ': 없는 서클 규칙 ' + L.circles);
  CIRCLES[name] = CIRC[L.circles];
}
// 이 단계가 켜는 기술 파일들
function techniquesOf(name) { const t = SKILLS[name] && SKILLS[name].tac, out = []; if (!t) return out; for (const k in TECH) if (t[k] && !out.includes(TECH[k])) out.push(TECH[k]); return out; }
module.exports = { SKILLS, CIRCLES, TECH, techniquesOf };
