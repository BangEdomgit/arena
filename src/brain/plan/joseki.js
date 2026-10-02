'use strict';
/* 숨 결투장 — 수읽기 3: 정석 (v2.15, SPEC 39장, data/joseki.json)
 * 이름 있는 수순과 받는 법. 아는 판단 수준(know)만 쓴다.
 *   두는 쪽: 수순의 첫 수를 둔 뒤 gap s 안에 다음 수를 값 × boost로 잇는다(K.jo 수순, K.joI 다음 차례, K.joT 앞 수를 둔 때). 첫 수는 뒤 수가 모두 곧 쓸 수 있을 때 × start
 *   받는 쪽: 상대가 수순의 answer.at째 수를 짓기 시작하면(앞 수를 gap 안에 두었으면) 받는 법: away(K.brk: 멀리·높이), keep(아낄 자원 K.keep 비트, K.keepT까지), cast(이 마법 × boost)
 * 기록 m.mlog: jsS(둔 수순 첫 수)·jsF(끝까지 둔 수순)·jsA(받는 법을 쓴 수) */
const J = require('../../../data/joseki.json'), ST = require('./state');
const LINES = Object.keys(J.lines).map(k => Object.assign({ name: k }, J.lines[k]));
const KEEP = r => { let b = 0; for (const k of r || []) b |= 1 << ST.RI[k]; return b; };
for (const L of LINES) L.keepB = KEEP(L.answer.keep);
const knows = (m, L) => !!m.skill && L.know.includes(m.skill);
const P = { boost: 2, start: 1.2 };
// 두는 쪽: 값
function value(W, m, K, o) {
  const n = o.n, e = K.e;
  if (K.jo >= 0) { const L = LINES[K.jo]; if (W.t - K.joT > L.gap) K.jo = -1; else if (n === L.seq[K.joI]) { if (o.v > 0) o.v *= P.boost; return; } }   // 닿지 않는 수를 억지로 두지 않는다
  for (let i = 0; i < LINES.length; i++) {
    const L = LINES[i]; if (n !== L.seq[0] || !knows(m, L) || (L.ground && e.z >= 1)) continue;
    let ok = true; for (let q = 1; q < L.seq.length; q++) { const x = L.seq[q]; if (!m.book.includes(x) || (m.cd[x] || 0) > L.gap * q) { ok = false; break; } }
    if (ok && o.v > 0) o.v *= P.start;
  }
}
// 두는 쪽: 둔 수
function commit(W, m, K, n) {
  if (K.jo >= 0) { const L = LINES[K.jo]; if (n === L.seq[K.joI] && W.t - K.joT <= L.gap) { K.joI++; K.joT = W.t; if (K.joI >= L.seq.length) { K.jo = -1; m.mlog.jsF++; } return; } }
  for (let i = 0; i < LINES.length; i++) { const L = LINES[i]; if (n === L.seq[0] && knows(m, L) && !(L.ground && K.e.z >= 1)) { K.jo = i; K.joI = 1; K.joT = W.t; m.mlog.jsS++; return; } }
}
// 받는 쪽: 상대가 수순을 짓기 시작했나. 받는 법을 K에 건다 (돌려줌: 받는 수순 또는 null)
function read(W, m, K) {
  const e = K.e; if (!e) return null;
  for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && !c.hid && !c.auto && c !== K.eC && c !== K.eC2) { K.eP = K.eN; K.ePT = K.eNT; K.eN = c.s.n; K.eNT = W.t; K.eC2 = K.eC; K.eC = c; } }   // 상대가 지은 수의 차례 (내가 본 것만)
  for (const L of LINES) {
    if (!knows(m, L) || (L.ground && m.z >= 1)) continue; const a = L.answer.at;
    if (K.eN !== L.seq[a] || W.t - K.eNT > 0.6) continue;
    if (a > 0 && !(K.eP === L.seq[a - 1] && K.eNT - K.ePT <= L.gap + 0.4)) continue;   // 앞 수가 gap 안에 있었나
    if (K.keepT < W.t) m.mlog.jsA++;
    K.keep = L.keepB; K.keepT = W.t + (L.seq.length - a) * L.gap; return L;
  }
  return null;
}
module.exports = { LINES, value, commit, read, knows, P };
