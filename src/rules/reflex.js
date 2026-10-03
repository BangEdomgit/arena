'use strict';
/* 규칙: 두 겹의 두뇌 — 반사 겹 (rules.reflex, v2.4, SPEC 28장, 수는 data/rules/reflex.json)
 * 생각 겹(판단, 0.05~0.3 s마다: 마법·짓기·리듬)과 따로, 반사 겹은 매 걸음(1/30 s) 몸이 먼저 움직인다. 자동 진처럼 뇌를 거치지 않는다.
 * 선명도 5 이상(상위·대마법사)만 보고, 위협이 있을 때만 돈다(무리의 병사는 비용 0).
 * 위협 (가장 먼저 닿는 것 하나):
 *   1 날아오는 투사체: 0.5 s 안에 몸 + 탄 + 0.4 m 안으로 온다(높이 차 1.2 m 안). 서로의 속도로 잰다
 *   2 보이는 구름: 0.5 s 안에 떨어지는데 그때의 내 자리가 반지름 + 0.4 m 안
 *   3 나를 겨눈 예비동작(투사체·실: 풀리는 순간 앞길이 정해지는 수)이 0.3 s 안에 풀리고, 겨눈 자리(예비동작의 방향으로 읽는다)가 내 앞길 위(0.05~1.2 s 뒤, 1.5 m 안)다.
 *     겨눈 자리가 2 m 안(거의 나를 겨눴다)이면 흔들지 않고 겨눈 자리에서 비킨다(4): 느리게 가다 멈추거나 뒤집으면 그 자리(실의 맞는 반지름 1.4 m) 안에 남거나 되돌아간다
 *     (예비동작을 읽는 사람만, 눈멀면 못 본다).
 *     구름·곡사는 흔들지 않는다: 떨어질 자리가 보이니 그때 피하면 된다(흔들면 오히려 맞았다, reports/v2.4.0.md)
 * 반응 (판단 수준의 tac.reflex = 반응 지연 s: 대가 0.1, 전설 0.05. 위협 하나에 한 번):
 *   피하기(1·2): 땅이면 구르기(간격 중이면 0.2 s 옆으로 내달리기), 날면 옆 튀기(날기 끊기, 없으면 옆으로 코너 속도).
 *     낮게(2.5 m 아래) 날다 구름이면 내려앉기-구르기-떠오르기: 떨어지기 + 쿠션 → 닿으면 바깥으로 구르기 → 생각 겹이 다시 띄운다(날기 끊기, 대가부터)
 *   흔들기(3): 빠르면(3 m/s 넘게) 멈칫 — 0.25 s 멈춘다(날면 급정지): 앞길 겨냥이 빗나간다. 아니면 옆 뒤집기 — 지금 옆걸음의 반대로 0.25 s(날면 옆 튀기)
 *   덮는 걸음은 판단 뒤·움직임 앞(preMove)에 걸음 방향(과 나는 목표 속도)을 덮는다. 흔드는 중에 투사체·구름이 오면 흔들기를 거둔다
 * 기록 (C ≥ 5, 반사 겹이 없어도): 방향 전환(0.1 s 사이 속도가 90° 넘게 돌았다), 위협을 본 때부터 몸이 움직이기 시작한 때(구르기·끊기·60° 넘게 돌거나 반 넘게 줄었다)까지,
 *   나를 겨눈 공격이 흔든 뒤(0.4 s 안에 풀림)·안 흔든 뒤에 빗나간 수 */
const { hyp } = require('../math');
const P = require('../../data/rules/reflex.json'), SR = require('./saltRing').api;
const { castsX, castAt } = require('../brain/lib/casts');   // 셋째 칸부터의 시전도 읽는다 (v2.38, 공용: 순환 없음)
const LEAD = { proj: 1, thread: 1 }, OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const canRoll = m => m.roll <= 0 && m.rollCd <= 0 && m.stam > 1.5 && !(m.st.stun > 0 || m.st.root > 0 || m.st.mycel > 0 || m.st.cramp > 0);
const TH = { th: null, q: null, kind: 0, dx: 0, dy: 0 };   // 찾은 위협 (새로 만들지 않는다)
// 가장 먼저 닿는 위협 하나
function scan(W, m) {
  TH.th = null; let best = 9;
  for (const p of W.proj) {
    if (p.dead || p.home || p.src.side === m.side) continue;
    const rx = m.x - p.x, ry = m.y - p.y, rvx = m.vx - p.vx, rvy = m.vy - p.vy, vv = rvx * rvx + rvy * rvy; if (vv < 1) continue;
    const t = -(rx * rvx + ry * rvy) / vv; if (t <= 0 || t > P.win || t >= best) continue;
    if (hyp(rx + rvx * t, ry + rvy * t) > m.r + p.rad + P.pad || Math.abs(p.z + (p.vz || 0) * t - m.z) > 1.2) continue;
    const sd = p.vx * ry - p.vy * rx > 0 ? 1 : -1; best = t; TH.th = p; TH.q = p.src; TH.kind = 1; TH.dx = -p.vy * sd; TH.dy = p.vx * sd;
  }
  for (const a of W.areas) {
    if (!a.vis || a.src.side === m.side || a.t > P.win || a.t >= best) continue;
    const px = m.x + m.vx * a.t - a.x, py = m.y + m.vy * a.t - a.y; if (hyp(px, py) > a.r + P.pad) continue;
    best = a.t; TH.th = a; TH.q = a.src; TH.kind = 2; TH.dx = m.x - a.x || 0.1; TH.dy = m.y - a.y || 0.1;
  }
  if (TH.th || !m.tac.readCast || m.st.blind > 0) return;
  const v2 = m.vx * m.vx + m.vy * m.vy;
  for (const q of W.foes[m.side]) for (let j = 0, xs = castsX(W, q), jn = 2 + xs.length; j < jn; j++) {
    const c = castAt(q, j, xs); if (!(c && !c.unseen && c.tgt === m && LEAD[c.s.t] && c.T - c.t < P.read)) continue;
    const ax = c.tx - m.x, ay = c.ty - m.y, d = hyp(ax, ay), s = v2 > 1 ? (ax * m.vx + ay * m.vy) / v2 : 0;   // 겨눈 자리가 내 앞길의 s초 뒤인가
    if (d >= P.aheadMin && s > P.aheadT[0] && s < P.aheadT[1] && hyp(ax - m.vx * s, ay - m.vy * s) < P.aheadR) { TH.th = c; TH.q = q; TH.kind = 3; return; }   // 앞길을 겨눴다: 흔든다
    if (d < P.aheadMin) { const k = d > 0.1 ? d : 1; TH.th = c; TH.q = q; TH.kind = 4; TH.dx = d > 0.1 ? -ax / k : -(q.y - m.y); TH.dy = d > 0.1 ? -ay / k : q.x - m.x; return; }   // 거의 나를 겨눴다: 겨눈 자리에서 비킨다
  }
}
// 이 수가 과녁에 닿을 때까지 (빗나감을 볼 때)
function flightT(m, q, s) { if (s.t === 'proj') return hyp(q.x - m.x, q.y - m.y) / s.v; if (s.t === 'area') return s.delay; if (s.t === 'lob') return s.flight; return 0; }
module.exports = {
  name: 'reflex', switch: 'reflex', on: W => W.rules.reflex, api: { P },
  engine: X => {
    const { roll } = X;
    const over = (W, R, vx, vy, fv, dur) => { R.vx = vx; R.vy = vy; R.fv = fv; R.until = W.t + dur; };
    function done(R) { const p = R.pend; if (p.j) { R.shotJ++; if (!p.hit) R.missJ++; } else { R.shotN++; if (!p.hit) R.missN++; } R.pend = null; }
    return {
      mageStep(W, m) {
        if (m.C < 5 || m.hp <= 0) return;
        const R = m.rx;
        if (R.pend && W.t > R.pend.until) done(R);
        if (R.lrt && m.fly === 0) { R.lrt = 0; if (canRoll(m)) roll(W, m, R.lx, R.ly, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8); }   // 내려앉았다: 구른다
        if (W.step % (3 * W.sk) === 0) { const a = R.tvx, b = R.tvy; if ((m.vx * a + m.vy * b) < 0 && hyp(m.vx, m.vy) > 1 && hyp(a, b) > 1) R.turns++; R.tvx = m.vx; R.tvy = m.vy; }   // 방향 전환
        if (!W.proj.length && !W.areas.length && !m.tac.readCast) { R.th = null; return; }
        // 반응 시간: 본 때부터 몸이 움직이기 시작한 때까지 (반사 겹이든 생각 겹이든). 위협이 바뀌기 전에 본다(피하면 위협이 사라진다)
        if (R.th && !R.met) {
          const v = hyp(m.vx, m.vy), v0 = hyp(R.vx0, R.vy0);
          if ((m.roll > 0 && R.pr <= 0) || (m.cut.k && !R.pk) || (v > 1 && v0 > 1 && m.vx * R.vx0 + m.vy * R.vy0 < 0.5 * v * v0) || (v0 > 2 && v < 0.5 * v0) || (v0 <= 1 && v > 2)) { R.met = true; R.rS += W.t - R.t0; R.rN++; }
        }
        R.pr = m.roll; R.pk = m.cut.k;
        scan(W, m);
        if (TH.th && TH.kind !== 3 && W.t < R.until && R.kind === 3) R.until = -9;   // 흔드는 중에 진짜 위협이 오면 흔들기를 거둔다 (생각 겹의 피하기를 덮지 않게)
        if (TH.th !== R.th) {   // 새 위협 (또는 없어짐)
          if (R.th && !R.met) R.rMiss++;
          R.th = TH.th; R.thq = TH.q; R.kind = TH.kind; R.t0 = W.t; R.done = false; R.met = false; R.vx0 = m.vx; R.vy0 = m.vy;
        }
        if (!R.th) return;
        const lat = m.tac.reflex; if (!lat || R.done || W.t - R.t0 < lat || m.st.stun > 0 || m.st.root > 0) return;
        R.done = true;
        const fl = m.fly === 1 && m.z >= 1, cut = W.rules.flightCut && m.cut.cd <= 0 && !m.cut.k && m.tac.flyCut >= 2;
        if (R.kind === 3) {   // 흔들기: 앞길을 겨누는 수가 곧 풀린다
          R.jukeT = W.t; R.juke++;
          const v = hyp(m.vx, m.vy);
          if (v > P.stopV) { R.stop++; if (fl && cut && v > 12) m.cut.w = 1; over(W, R, 0, 0, fl ? 0 : -1, P.stopT); }   // 멈칫
          else {   // 옆 뒤집기
            R.flip++; const q = R.thq, dx = q.x - m.x, dy = q.y - m.y, l = hyp(dx, dy) || 1, px = -dy / l, py = dx / l, s = m.vx * px + m.vy * py >= 0 ? -1 : 1;
            if (fl && cut) { m.cut.x = px * s; m.cut.y = py * s; m.cut.w = 2; }
            over(W, R, px * s, py * s, fl ? P.airV : -1, P.flipT);
          }
          return;
        }
        R.dodge++;   // 피하기 (1 투사체·2 구름·4 거의 나를 겨눈 예비동작)
        const l = hyp(TH.dx, TH.dy) || 1, dx = TH.dx / l, dy = TH.dy / l;
        if (m.fly === 0) { if (canRoll(m)) roll(W, m, dx, dy, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8); else over(W, R, dx, dy, -1, P.dodgeT); return; }
        if (!fl) return;
        if (cut && R.kind === 2 && m.z < P.lrtZ) {   // 내려앉기-구르기-떠오르기
          m.cut.w = 4; m.cut.z = (m.vz < 0 ? m.vz * m.vz : 0) / (2 * 5 * 9.8) + m.z / 5 + P.lrtCush; R.lrt = 1; R.lx = dx; R.ly = dy; R.lrtN++; return;
        }
        if (cut) { m.cut.x = dx; m.cut.y = dy; m.cut.w = 2; }
        over(W, R, dx, dy, P.airV, P.dodgeT);
      },
      // 판단 뒤·움직임 앞: 덮는 걸음
      preMove(W, m) { const R = m.rx; if (W.t < R.until) { m.mv.x = R.vx; m.mv.y = R.vy; if (R.fv >= 0 && m.fly === 1) m.fv = R.fv; if (W.rules.saltRing && m.tac.survive && m.C >= 5) SR.wall(W, m); } },   // 반사도 소금 원의 벽을 넘지 않는다 (v2.6)
      // 나를 겨눈 공격이 풀렸다: 빗나가는지 본다 (흔든 뒤 0.4 s 안이면 흔든 몫)
      release(W, m, c) {
        const q = c.tgt; if (!q || q.C < 5 || q.side === m.side || !OFF[c.s.t] || c.auto) return;
        const R = q.rx; if (R.pend) done(R);
        R.pend = { src: m, n: c.s.n, until: W.t + flightT(q, m, c.s) + P.after, hit: false, j: W.t - R.jukeT < P.jukeWin };
      },
      hurt(W, m, v, src, name) { const p = m.rx.pend; if (p && src === p.src && name === p.n) p.hit = true; },
    };
  },
};
