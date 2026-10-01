'use strict';
/* 숨 결투장 — 단계 사다리 떼어 재기 (v2.10, SPEC 34장): 대마법사끼리 앞 사람의 점수(비김 0.5), 판마다 자리를 번갈아
 *   node experiments/ladder.js [전설-대가] [N=400] [--base] [--scene 장면.json] [--tacA '{…}'] [--tacB '{…}'] [--as 대가] [--rules '{…}'] [--abl]
 *   기본은 대마법사 결투장(장면 v2-tactics-legend: 청사진 덱, 결투장 규칙). --base는 기본 규칙·'대마법사 운영' 덱(200 × 150)
 *   --tacA: 앞 사람에게만 덧씌울 tac. --as: 앞 사람의 판단 수준(선명도·판단 간격·서클)을 이것으로 하고 tac은 원래 수준의 것을 그대로(판단 속도만 떼기)
 *   --abl: 전설의 기술을 하나씩 떼어 표로 (속임수·판 중 학습·파도 고르기·덱 읽기·세 겹치기·강요하는 수·미끼·약한 척·동시 착탄·작전 2·판단 속도)
 * 결과는 일꾼 수와 상관없이 같다 (par.js). 표준오차는 0.5 근처 ±0.5/√N */
const fs = require('fs'), path = require('path'), A = require('../src'), S = require('../data/skills.json');
const SCENE = path.join(__dirname, '..', 'sandbox', 'scenes', 'v2-tactics-legend.json');
function sceneOf(base) {
  if (!base || typeof base === 'string') return JSON.parse(fs.readFileSync(base || SCENE, 'utf8'));   // --scene 파일 (v2.15)
  return { seed: 1, width: 200, height: 150, sides: [{ mages: [{ tier: '대마법사', deck: '대마법사 운영' }] }, { mages: [{ tier: '대마법사', deck: '대마법사 운영' }] }] };
}
// 앞 사람 a = { skill, tac, as }, 뒤 사람 b. 씨앗 s0..s0+n−1. 앞 사람의 점수 합
function games(a, b, s0, n, base, rules) {
  const sc = sceneOf(base); let x = 0; if (rules) sc.rules = Object.assign({}, sc.rules, rules);
  const spec = p => { const o = { tier: '대마법사', deck: sc.sides[0].mages[0].deck, skill: p.as || p.skill }; if (p.as) o.tac = Object.assign({}, fullTac(p.skill), p.tac); else if (p.tac) o.tac = p.tac; return o; };
  for (let s = s0; s < s0 + n; s++) { const sw = s % 2, c = JSON.parse(JSON.stringify(sc)); c.seed = s; c.sides[0].mages = [spec(sw ? b : a)]; c.sides[1].mages = [spec(sw ? a : b)];
    const r = A.runScene(c), me = sw ? 1 : 0; x += r.winner === me ? 1 : r.winner < 0 ? 0.5 : 0; }
  return x;
}
// 판단 수준의 tac 전부 (from을 따라 올라가며)
function fullTac(sk) { const L = S.levels[sk]; if (!L) return {}; const up = L.from && L.from !== 'basic' ? fullTac(L.from) : Object.assign({}, S.basic); return Object.assign(up, L.tac); }
async function score(a, b, N, base, rules) {
  const { runJobs } = require('./par'), jobs = [], CH = 4; for (let s = 1; s <= N; s += CH) jobs.push({ mod: __filename, fn: 'games', args: [a, b, s, Math.min(CH, N - s + 1), base, rules] });
  const r = await runJobs(jobs); return r.reduce((p, q) => p + q, 0) / N;
}
// 전설의 기술을 하나씩 뗀다 (대가의 값으로)
const ABL = [['그대로', {}], ['속임수', { feint: false }], ['판 중 학습', { learn: false }], ['파도 고르기', { waveChoose: false }], ['덱 읽기', { counter: false }], ['세 겹치기', { triple: false }],
  ['강요하는 수·작전 2', { ops: 1 }], ['방어 미끼', { bait: false }], ['약한 척', { fakeRetreat: false }], ['동시 착탄', { simul: false }], ['방패 아끼기 켬', { shieldSave: true }],
  ['날기 5→4·끊기 3→2', { flySkill: 4, flyCut: 2 }], ['반사 0.05→0.1·발놀림 3→2', { reflex: 0.1, footwork: 2 }], ['진지 3→2·엄폐 2.5→2', { fortify: 2, coverW: 2 }]];
async function main() {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; }, base = args.includes('--base') || opt('--scene');
  const pos = args.filter((x, i) => !x.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !['--base', '--abl'].includes(args[i - 1])));
  const [sa, sb] = (pos[0] || '전설-대가').split('-'), N = +(pos[1] || 400);
  const b = { skill: sb, tac: opt('--tacB') ? JSON.parse(opt('--tacB')) : null }, rules = opt('--rules') ? JSON.parse(opt('--rules')) : null;
  if (args.includes('--abl')) {
    const out = []; for (const [nm, t] of ABL) { const sc = await score({ skill: sa, tac: t }, b, N, base, rules); out.push([nm, sc]); console.log(`${nm.padEnd(16)} ${sc.toFixed(3)}`); }
    const sp = await score({ skill: sa, as: sb }, b, N, base, rules); console.log(`${'판단 속도 → ' + sb}  ${sp.toFixed(3)}  (선명도·판단 간격·서클을 ${sb}의 것으로, 기술은 ${sa})`); out.push(['판단 속도', sp]);
    const sv = opt('--save'); if (sv) fs.writeFileSync(path.join(__dirname, 'results', `ladder-${sv}.json`), JSON.stringify({ v: A.VERSION, N, base, pair: [sa, sb], out }, null, 1) + '\n');
    return;
  }
  const a = { skill: sa, tac: opt('--tacA') ? JSON.parse(opt('--tacA')) : null, as: opt('--as') };
  console.log(`${sa} / ${sb} ${base === true ? '기본' : base ? path.basename(base) : '결투장'} ${N}판: ${(await score(a, b, N, base, rules)).toFixed(3)}`);
}
if (require.main === module) main().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { games, score, fullTac, ABL };
