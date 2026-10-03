'use strict';
/* 숨 결투장 — 지능 점검 (v2.30, SPEC 53장): node cli.js audit [--seeds 1,2,3] [--only 장면,…] [--rules '{…}'] [--save 이름]
 * 모든 장면(sandbox/scenes, 이름이 [역사]로 시작하는 것 빼고) × 씨앗을 돌리며 사람마다 아래를 재고, 문턱(data/rules/audit.json)을 넘으면 사건으로 적는다:
 *   장면 · 씨앗 · 판 시각 · 누가 · 무엇 · 값. 샌드박스 주소(sandbox/index.html#장면&seed=2&t=34.5)로 그 시각을 바로 연다
 * 탐지기: 기회 놓침 · 헛시전(알 수 있었던 것 따로) · 명중 · 떨림 · 막혀 제자리 · 위험 지대 · 아군 피해 · 스스로 입은 피해 · 역류 · 체력 남기고 도망 ·
 *   끝나지 않는 판 · 같은 수 되풀이 · 대마법사(총 앞에 서 있음·소금 위·떠 있음·속도) · 오류(NaN·판 밖·예외·느린 걸음) · 데이터(덱·장면·마법 칸)
 * 판에 닿지 않는다: 세계의 훅 배열에 읽기만 하는 함수를 붙이고(release·hurt) 걸음 사이에 상태를 읽는다. 결과는 일꾼 수와 상관없이 같다 (par.js) */
const fs = require('fs'), path = require('path'), A = require('../src'), C = require('../src/core'), P = require('../data/rules/audit.json');
const ROOT = path.join(__dirname, '..'), SC = path.join(ROOT, 'sandbox', 'scenes');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const BAD = { fire: 1, h2s: 1, nh3: 1, acid: 1, spore: 1, ice: 0, pit: 0 };
function scenes(only) { const out = {}; for (const f of fs.readdirSync(SC).filter(f => f.endsWith('.json')).sort()) { const k = f.slice(0, -5), sc = JSON.parse(fs.readFileSync(path.join(SC, f), 'utf8')); if ((sc.name || '').startsWith('[역사]')) continue; if (only && !only.includes(k)) continue; out[k] = sc; } return out; }
// 마법이 서는 자리 (core의 formPoint와 같은 셈: core가 내보내지 않는다)
function formPt(m, s, tx, ty) { const k = C.FORM[s.t], d = Math.hypot(tx - m.x, ty - m.y) || 1; if (k === 'target' || k === 'path') return [tx, ty]; if (k === 'front') { const L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; } if (k === 'self') return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5]; return null; }
const tierOf = m => m.C >= 8 ? '대마법사' : m.C >= 4 ? '상위' : m.C >= 2 ? '중간' : m.C >= 0.9 ? '평범' : '병사';
// 한 판: 사건 목록과 사람마다의 합
function run(key, seed, rules) {
  const sc = Object.assign({}, scenes([key])[key], { seed }); if (rules) sc.rules = Object.assign({}, sc.rules, rules);
  const ev = [], add = (t, who, what, v) => ev.push({ scene: key, seed, t: +t.toFixed(2), who, what, v: typeof v === 'number' ? +v.toFixed(3) : v });
  let W; try { W = A.sceneWorld(sc); } catch (e) { add(0, '-', '오류: 장면을 못 만듦', String(e.message || e)); return { ev, sum: {} }; }
  const n = W.ms.length, S = W.ms.map(() => ({ idle: 0, idleRep: false, stuckT: 0, sx: 0, sy: 0, flips: [], jitRep: false, dang: 0, dangRep: false, gun: 0, gunRep: false, salt: 0, air: 0, sp: 0, k: 0, lmx: 0, lmy: 0, fizzS: 0, fizzF: 0, rel: 0, ff: 0, self: 0, tot: 0, fled: false }));
  W.ms.forEach((m, i) => { S[i].sx = m.x; S[i].sy = m.y; });
  const idx = new Map(W.ms.map((m, i) => [m, i]));
  W.H.release.push((W, m, c) => { const i = idx.get(m); if (i === undefined || c.auto) return; const s = c.s; S[i].rel++; if (s.mundane) return;
    const g = C.gAt(W, m, s, c.tx, c.ty); if (g <= 0.02) { const p = formPt(m, s, c.tx, c.ty) || [m.x, m.y]; if (W.salt.length && C.onSalt(W, p[0], p[1])) S[i].fizzF++; else S[i].fizzS++; } });
  W.H.hurt.push((W, m, v, src, name, kind) => { const i = idx.get(m); if (i === undefined) return; S[i].tot += v; if (src === m || (!src && (kind === 'wave' || kind === 'backfire' || kind === 'fall'))) S[i].self += v; else if (src && src.side === m.side) S[i].ff += v; });
  const ev0 = Math.round(P.every / W.dt); let slow = 0;
  try {
    while (!A.over(W)) {
      const t0 = Date.now(); A.stepWorld(W); const dtMs = Date.now() - t0; if (dtMs > P.stepMs && ++slow <= 3) add(W.t, '-', '오류: 느린 걸음 (ms)', dtMs);
      if (W.step % ev0) continue;
      for (let i = 0; i < n; i++) { const m = W.ms[i], s = S[i]; if (m.hp <= 0) continue;
        if (!(m.x === m.x && m.y === m.y && m.hp === m.hp)) { add(W.t, m.name, '오류: NaN', m.x); continue; }
        if (m.x < -2 || m.y < -2 || m.x > W.width + 2 || m.y > W.height + 2) add(W.t, m.name, '오류: 판 밖', m.x);
        if (m.flee && !s.fled) { s.fled = true; const h = m.hp / m.hpMax; if (h > P.flee.hp) add(W.t, m.name, (m.C >= P.arch.cMin ? '체력 남기고 물러남' : m.book.includes('머스킷') ? '체력 남기고 도망 (군대)' : '체력 남기고 도망 (' + tierOf(m) + ')'), h); }
        if (m.flee) continue;
        // 기회 놓침 (장악권에 흩어질 수는 기회가 아니다)
        const busy = m.cast || m.castB || m.chan || m.st.stun > 0 || m.st.breath > 0 || m.roll > 0;
        let can = false; if (!busy) for (const nm of m.book) { const sp = W.spells[nm]; if (!sp || !OFF[sp.t] || (m.cd[nm] || 0) > 0 || m.glu < sp.cost) continue; const R = sp.t === 'cone' ? (sp.L || 3) * 1.5 : sp.t === 'touch' ? 1.3 : C.rangeOf(m, sp);
          if (sp.mundane && m.tac.volley > 1 && m.id % m.tac.volley !== Math.floor(W.t / (17.5 / m.tac.volley)) % m.tac.volley) continue;   // 돌아가며 쏘기: 제 줄 차례가 아니면 기다리는 게 맞다
          for (const q of W.foes[m.side]) { if (!(q.hp > 0) || q.flee) continue; const d = C.hyp(q.x - m.x, q.y - m.y); if (sp.mundane && q.z >= 2 && d > 50) continue; if (d < R * 0.9 && !C.blocked(W, m.x, m.y, q.x, q.y, Math.max(m.z, q.z)) && (sp.mundane || C.gAt(W, m, sp, q.x, q.y) > P.idle.g)) { can = true; break; }  } if (can) break; }
        if (can) { s.idle += P.every; if (s.idle > P.idle.t && !s.idleRep) { s.idleRep = true; add(W.t, m.name, '기회 놓침 (s)', s.idle); } } else { s.idle = 0; s.idleRep = false; }
        // 막혀 제자리·떨림
        const wl = Math.hypot(m.mv.x, m.mv.y); if (wl > 0.5 && !(m.st.root > 0) && !(m.st.stun > 0) && m.z < 1 && !m.cast) { s.stuckT += P.every; if (s.stuckT >= P.stuck.t) { if (Math.hypot(m.x - s.sx, m.y - s.sy) < P.stuck.d) add(W.t, m.name, '막혀 제자리 (s)', s.stuckT); s.stuckT = 0; s.sx = m.x; s.sy = m.y; } } else { s.stuckT = 0; s.sx = m.x; s.sy = m.y; }
        if (wl > 0.3 && !(m._k && m._k.dodge) && !(m.roll > 0)) { if (s.lmx * m.mv.x + s.lmy * m.mv.y < -0.3 * wl * Math.hypot(s.lmx, s.lmy)) s.flips.push(W.t); s.lmx = m.mv.x; s.lmy = m.mv.y; }
        while (s.flips.length && W.t - s.flips[0] > P.jitter.t) s.flips.shift();
        if (s.flips.length / P.jitter.t > P.jitter.perS && !s.jitRep) { s.jitRep = true; add(W.t, m.name, '떨림 (뒤집기/s)', s.flips.length / P.jitter.t); } else if (s.flips.length / P.jitter.t < 1) s.jitRep = false;
        // 위험 지대
        let bad = m.z < 1 && ((W.salt.length && C.onSalt(W, m.x, m.y) && m.C >= 2) || (W.rules.saltRing && C.outSalt(W, m)));
        if (!bad && m.z < 1) for (const z of W.zones) if (z.src && z.src.side !== m.side && BAD[z.k] && C.inZone(z, m.x, m.y)) { bad = true; break; }
        if (!bad) for (const a of W.areas) if (a.src === m && C.hyp(a.x - m.x, a.y - m.y) < a.r && a.t < 0.4) { bad = true; break; }
        if (bad) { s.dang += P.every; if (s.dang > P.danger.t && !s.dangRep) { s.dangRep = true; add(W.t, m.name, '위험 지대 (s)', s.dang); } } else { s.dang = 0; s.dangRep = false; }
        // 대마법사
        if (m.C >= P.arch.cMin) { s.k++; s.sp += Math.hypot(m.vx, m.vy); if (m.z >= 1) s.air++; if (W.salt.length && C.onSalt(W, m.x, m.y) && m.z < 1) s.salt++;
          let g = 0; for (const q of W.foes[m.side]) if (q.hp > 0 && !q.flee && q.book.includes('머스킷') && !((q.cd['머스킷'] || 0) > 1) && C.hyp(q.x - m.x, q.y - m.y) < P.arch.gunR) g++;
          if (g >= P.arch.gunN && m.z < 1 && Math.hypot(m.vx, m.vy) < 1.5) { s.gun += P.every; if (s.gun > P.arch.gunStand && !s.gunRep) { s.gunRep = true; add(W.t, m.name, '대마법사: 총 앞에 서 있음 (s)', s.gun); } } else { s.gun = 0; s.gunRep = false; } }
      }
    }
  } catch (e) { add(W.t, '-', '오류: 예외', String(e.stack || e).split('\n').slice(0, 2).join(' ')); }
  const r = A.result(W); if (r.byTime || !A.over(W) || W.t >= W.maxT - 1e-6) add(W.t, '-', '끝나지 않는 판 (s)', W.t);
  const sides = {}; for (let i = 0; i < n; i++) { const m = W.ms[i], s = S[i], sd = sides[m.side] || (sides[m.side] = { ff: 0, tot: 0 }); sd.ff += s.ff; sd.tot += s.tot;
    if (s.tot > 20 && s.self / s.tot > P.self.share) add(W.t, m.name, '스스로 입은 피해 몫', s.self / s.tot);
    if (m.log.backfire) add(W.t, m.name, '역류 (번)', m.log.backfire);
    const fz = s.fizzS + s.fizzF; if (s.rel > P.fizz.n && fz / s.rel > P.fizz.share) add(W.t, m.name, s.fizzF >= s.fizzS ? '헛시전: 알 수 있었던 것 (소금)' : '헛시전 (장악권·소금 원)', fz / s.rel);
    let oc = 0, oh = 0, top = 0; for (const k in m.log.casts) { const sp = W.spells[k]; const c = m.log.casts[k]; if (sp && OFF[sp.t]) { oc += c; oh += (m.log.hits[k] || 0); } if (c > top) top = c; }
    const tr = tierOf(m), rg = P.hit[tr]; if (oc > P.hit.n && rg && (oh / oc < rg[0] || oh / oc > rg[1])) add(W.t, m.name, '명중 범위 밖 (' + tr + ')', oh / oc);
    const tc = Object.values(m.log.casts).reduce((a, b) => a + b, 0); if (tc > P.repeat.n && top / tc > P.repeat.share) add(W.t, m.name, '같은 수 되풀이 몫', top / tc);
    if (m.C >= P.arch.cMin && s.k) { const sh = s.salt / s.k; if (sh > P.arch.salt) add(W.t, m.name, '대마법사: 소금 위 몫', sh); } }
  for (const k in sides) if (sides[k].tot > 30 && sides[k].ff / sides[k].tot > P.ff.share) add(W.t, '편 ' + k, '아군 피해 몫', sides[k].ff / sides[k].tot);
  const arch = W.ms.filter(m => m.C >= P.arch.cMin).map(m => { const s = S[idx.get(m)]; return s.k ? { name: m.name, air: s.air / s.k, speed: s.sp / s.k, salt: s.salt / s.k } : null; }).filter(Boolean);
  return { ev, sum: { scene: key, seed, t: W.t, arch } };
}
// 데이터 검사
function dataCheck() {
  const ev = [], add = (who, what, v) => ev.push({ scene: '데이터', seed: 0, t: 0, who, what, v });
  for (const [k, s] of Object.entries(A.SPELLS)) { if (typeof s.n !== 'string' || s.n !== k) add(k, '데이터: 마법 이름 칸이 키와 다름', String(s.n)); if (!s.t) add(k, '데이터: 마법에 틀(t)이 없음', ''); if (!(s.cost >= 0)) add(k, '데이터: 마법에 비용이 없음', String(s.cost)); if (!s.el) add(k, '데이터: 마법에 원소가 없음', ''); }
  for (const [d, list] of Object.entries(A.DECKS)) for (const n of (Array.isArray(list) ? list : list.spells || [])) if (!A.SPELLS[n]) add(d, '데이터: 덱에 없는 마법', n);
  const all = scenes(); for (const [k, sc] of Object.entries(all)) for (const side of sc.sides || []) for (const mm of side.mages || []) {
    if (mm.tier && !A.TIERS[mm.tier]) add(k, '데이터: 장면에 없는 단계', mm.tier); if (mm.deck && !A.DECKS[mm.deck] && !(sc.decks && sc.decks[mm.deck])) add(k, '데이터: 장면에 없는 덱', mm.deck);
    if (mm.x != null && sc.width && (mm.x < 0 || mm.x > sc.width || mm.y < 0 || mm.y > sc.height)) add(k, '데이터: 장면의 자리가 판 밖', mm.x + ',' + mm.y); }
  return ev;
}
const link = e => e.scene === '데이터' ? '' : `[열기](../sandbox/index.html#${encodeURIComponent(e.scene)}&seed=${e.seed}&t=${e.t})`;
const kind = what => what.replace(/ \(.*$/, '');
function render(all, sums, meta) {
  const by = {}; for (const e of all) (by[kind(e.what)] = by[kind(e.what)] || []).push(e);
  const L = ['# 지능 점검', '', `엔진 v${A.VERSION} · ${meta.date} · 장면 ${meta.scenes}개 × 씨앗 ${meta.seeds.join('·')}${meta.rules ? ' · 덧씌운 규칙 ' + JSON.stringify(meta.rules) : ''} · ${meta.sec} s. 문턱은 \`data/rules/audit.json\`, 만든 명령 \`node cli.js audit\`. 링크는 샌드박스를 그 장면·씨앗·시각으로 연다.`, '',
    '## 탐지기별 사건 수', '', '| 탐지기 | 사건 | 장면 수 |', '|---|---|---|'];
  for (const [k, es] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) L.push(`| ${k} | ${es.length} | ${new Set(es.map(e => e.scene)).size} |`);
  L.push('', '## 장면별 사건 수', '', '| 장면 | 사건 |', '|---|---|'); const bs = {}; for (const e of all) bs[e.scene] = (bs[e.scene] || 0) + 1; for (const [k, v] of Object.entries(bs).sort((a, b) => b[1] - a[1])) L.push(`| ${k} | ${v} |`);
  L.push('', '## 대마법사 (판마다)', '', '| 장면 | 씨앗 | 누구 | 떠 있는 몫 | 평균 속도 (m/s) | 소금 위 몫 |', '|---|---|---|---|---|---|');
  for (const s of sums) for (const a of s.arch || []) L.push(`| ${s.scene} | ${s.seed} | ${a.name} | ${(a.air * 100).toFixed(0)}% | ${a.speed.toFixed(1)} | ${(a.salt * 100).toFixed(0)}% |`);
  L.push('', '## 사건 (탐지기마다 앞의 ' + P.maxEv + '개)');
  for (const [k, es] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) { L.push('', '### ' + k + ' (' + es.length + ')', '', '| 장면 | 씨앗 | 시각 | 누가 | 무엇 | 값 | |', '|---|---|---|---|---|---|---|');
    for (const e of es.slice(0, P.maxEv)) L.push(`| ${e.scene} | ${e.seed} | ${e.t} | ${e.who} | ${e.what} | ${e.v} | ${link(e)} |`); }
  return L.join('\n') + '\n';
}
async function main(args = []) {
  const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
  const seeds = opt('--seeds') ? opt('--seeds').split(',').map(Number) : P.seeds, only = opt('--only') ? opt('--only').split(',') : null, rules = opt('--rules') ? JSON.parse(opt('--rules')) : null;
  const keys = Object.keys(scenes(only)), { runJobs } = require('./par'), jobs = []; for (const k of keys) for (const s of seeds) jobs.push({ mod: __filename, fn: 'run', args: [k, s, rules] });
  const t0 = Date.now(), res = await runJobs(jobs), all = dataCheck(), sums = []; for (const r of res) { all.push(...r.ev); sums.push(r.sum); }
  const meta = { date: new Date().toISOString().slice(0, 10), scenes: keys.length, seeds, rules, sec: Math.round((Date.now() - t0) / 1000) }, md = render(all, sums, meta);
  const name = opt('--save') || 'audit', dir = path.join(ROOT, 'reports'); fs.writeFileSync(path.join(dir, name + '.md'), md); fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify({ v: A.VERSION, meta, events: all, sums }, null, 0) + '\n');
  const by = {}; for (const e of all) by[kind(e.what)] = (by[kind(e.what)] || 0) + 1; for (const [k, v] of Object.entries(by).sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(5), k);
  console.log('→ reports/' + name + '.md (' + all.length + '건, ' + meta.sec + ' s)');
}
module.exports = { run, dataCheck, scenes, main, render };
if (require.main === module) main(process.argv.slice(2)).catch(e => { console.error(e); process.exitCode = 1; });
