'use strict';
/* 숨 결투장 — 두뇌 훅 모으기 (brain/hooks, SPEC 22장)
 * 세계의 켜진 규칙 모듈(W.mods)에서 두뇌 훅만 차례대로 모아 W._bh에 둔다(세계마다 한 번, 첫 판단 때). 꺼진 규칙은 비용 0.
 * 규칙의 새 틀(taunt…)의 값은 brainTypes. 틀은 스위치와 상관없이 늘 붙는다 */
const R = require('../rules'), U = require('./util');
const BRN = new Map(), BT = {}; let btVer = -1;
// 훅 모음: 이름마다 배열 하나 (리터럴이라 모양이 늘 같다). 이름은 rules/index.js의 BRAIN_HOOKS
function emptyBH() { return { aim: [], read: [], hideCast: [], steer: [], avoid: [], empty: [], circles: [], react: [], cancel: [], rest: [], prep: [], value: [], valueRisk: [], valueMid: [], valueLate: [], commit: [], castTime: [], phase: [], bound: [], stunned: [] }; }
function brainOf(r) {
  let b = BRN.get(r); if (b) return b;
  b = r.brain(U); const ok = emptyBH(); for (const k in b) if (!(k in ok)) throw new Error(r.name + ': 없는 두뇌 훅 ' + k + ' (' + R.BRAIN_HOOKS.join(', ') + ')');
  BRN.set(r, b); return b;
}
function hooks(W) {
  if (W._bh) return W._bh;
  const bh = emptyBH();
  for (const r of W.mods) if (r.brain) { const b = brainOf(r); for (const k in b) bh[k].push(b[k]); }
  return (W._bh = bh);
}
// 틀 → 값 매기기 (규칙 모듈의 brainTypes). 규칙 목록이 바뀌었을 때만 다시 만든다
function types() {
  if (btVer === R.ver()) return BT; btVer = R.ver();
  for (const k in BT) BT[k] = null;
  for (const r of R.RULES) if (r.brainTypes) Object.assign(BT, r.brainTypes(U));
  return BT;
}
module.exports = { hooks, types };
