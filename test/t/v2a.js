'use strict';
/* 숨 결투장 시험: v2.0~v2.2: 기본·몸·장악·빛·벽·군대·두뇌·고수·비행·이단
 * test/test.js가 파일마다 일꾼에 나눠 돌린다(par.js). 혼자 돌릴 땐 node test/t/v2a.js */
const { assert, A, V1, V2, legacy, fs, path, vm, SRC, dig, SCENES, suite } = require('../lib');
function run() {
  legacy(false); const { ok, done } = suite();
  ok('v2.0 기본 (SPEC 24장): risk·saltRing·wave 켬, 몸 받침 2.3·회피 켬, 체력은 150, V1_RULES면 1.x', () => {
    const W = A.createWorld({ seed: 1, rules: { flight: false } }); assert.ok(W.rules.risk && W.rules.saltRing && W.rules.wave && W.rules.bodyK === 2.3 && W.rules.evade && !W.rules.hpScale);
    assert.ok(['gear', 'terrain', 'saltRing', 'wave', 'risk', 'multiSlot', 'body', 'evade'].every(n => W.mods.some(r => r.name === n)), W.mods.map(r => r.name).join());
    assert.ok(A.createWorld({ seed: 1 }).rules.flight === true && A.createWorld({ seed: 1 }).mods.some(r => r.name === 'flight'), '비행 기본 켬');
    const hp = C => A.addMage(W, { C }, 0, 5, 5).hpMax; assert.strictEqual(hp(1), 150); assert.strictEqual(hp(10), 150);
    const W1 = A.createWorld({ seed: 1, rules: V1 }); assert.strictEqual(W1.mods.map(r => r.name).join(','), 'gear,terrain,multiSlot');
      assert.strictEqual(A.addMage(W1, { C: 2.5 }, 0, 5, 5).hpMax, 150);
    const W2 = A.createWorld({ seed: 1, rules: Object.assign({}, V1, { hpScale: true }) });
      assert.ok(Math.abs(A.addMage(W2, { C: 0.3 }, 0, 5, 5).hpMax - 150 * Math.pow(0.3, 2.5)) < 1e-9, '1.x의 hpScale');
    const W3 = A.createWorld({ seed: 1, rules: { hpScale: true } });
      assert.ok(Math.abs(A.addMage(W3, { C: 2.5 }, 0, 5, 5).hpMax - 150 * Math.pow(2.5, 1.2)) < 1e-9 && A.addMage(W3, { C: 0.3 }, 0, 5, 5).hpMax === 150, 'hpScale C^1.2');
  });
  ok('v2.0 몸 받침·회피: 에너지 피해 ÷ C^2.3, 부딪힘은 굳은 살(12 × log₁₀ C)만큼 빼기(총도), callus 0이면 첫 묶음, 소금·추락·폭주는 그대로, 걸음·구르기 × (1 + 0.25·log₂ C), 구르기 간격 ÷ (1 + 0.2·log₂ C)', () => {
    const mk = rules => { const W = A.createWorld({ seed: 1, obstacles: 0, rules: Object.assign({ flight: false, domain: false }, rules) });
      const q = A.addMage(W, { C: 10, book: [] }, 0, 10, 15), f = A.addMage(W, { book: ['짧은 실', '머스킷'], allowBanned: true }, 1, 13, 15); A.stepWorld(W); return [W, q, f]; };
    const taken = (rules, spell, steps = 0) => { const [W, q, f] = mk(rules); const h0 = q.hp; A.release(W, f, { s: W.spells[spell], tx: q.x, ty: q.y, tgt: q });
      for (let i = 0; i < steps; i++) A.stepWorld(W); return h0 - q.hp; };
    const a = taken({ bodyK: 0 }, '짧은 실'), b = taken({}, '짧은 실'); assert.ok(a > 0 && Math.abs(b / a - 1 / Math.pow(10, 2.3)) < 1e-9, a + ' → ' + b);
    const g0 = taken({ bodyK: 0 }, '머스킷', 10), g1 = taken({}, '머스킷', 10), g2 = taken({ callus: 0 }, '머스킷', 10);
      assert.ok(g0 === 60 && Math.abs(g1 - 48) < 1e-9 && g2 === 60, '총: 굳은 살 12를 뺀다 (callus 0이면 그대로) ' + g0 + ' ' + g1 + ' ' + g2);
    const p0 = taken({ bodyK: 0 }, '돌 압축탄', 12), p1 = taken({}, '돌 압축탄', 12); assert.ok(p0 > 0 && p0 < 12 && p1 === 0, '조약돌은 튕긴다 ' + p0 + ' ' + p1);
    const [W, q] = mk({}); W.t = 200; for (let i = 0; i < 3; i++) A.stepWorld(W); assert.ok(q.log.taken.salt > 0 && Math.abs(q.log.taken.salt - 6 * 3 / 30) < 1e-6, '소금은 받치지 않는다 ' + q.log.taken.salt);
    const k = Math.log2(10), [W2, r] = mk({}); A.roll(W2, r, 1, 0, 8, 0.8); assert.ok(Math.abs(r.vx - 8 * (1 + 0.25 * k)) < 1e-9 && Math.abs(r.rollCd - 0.8 / (1 + 0.2 * k)) < 1e-9);
    const [W3, r3] = mk({ evade: false }); A.roll(W3, r3, 1, 0, 8, 0.8); assert.ok(r3.vx === 8 && r3.rollCd === 0.8);
  });
  ok('v2.0 장악권의 원칙 (SPEC 5장): 만드는 것을 빼앗지 가는 것은 못 막는다 — 도달 반경 5 m × C, 실은 길 전체, 발밑은 상대 자리', () => {
    const mk = rules => { const W = A.createWorld({ seed: 1, width: 400, height: 300, obstacles: 0, rules: Object.assign({ flight: false, saltRing: false }, rules) });
      const e = A.addMage(W, A.mage({ tier: '대마법사' }), 0, 100, 150), m = A.addMage(W, A.mage({ tier: '평범', book: ['돌 압축탄', '짧은 실', '라이트닝', '땅 번개'] }), 1, 160, 150); A.stepWorld(W); return [W, e, m];
      };
    const g = (rules, n, d) => { const [W, e, m] = mk(rules); m.x = e.x + d; return A.gAt(W, m, W.spells[n], e.x, e.y); };
    assert.strictEqual(g({}, '돌 압축탄', 55), 1, '반경 밖 손끝'); assert.strictEqual(g({}, '돌 압축탄', 45), 0, '반경 안 손끝');
    assert.strictEqual(g({ domainR: 0 }, '돌 압축탄', 55), 0, '예전: 끝없음');
    assert.strictEqual(g({}, '라이트닝', 55), 0, '실의 길이 반경 안을 지난다'); assert.strictEqual(g({}, '땅 번개', 55), 0, '상대 자리');
    // 길: 사거리 끝이 반경 밖이면 선다 (평범 라이트닝 12 m, 70 m 떨어져 쏘면 길이 모두 반경 밖)
    assert.strictEqual(g({}, '라이트닝', 70), 1); assert.ok(g({ domainPath: false }, '짧은 실', 55) === g({}, '짧은 실', 55));
  });
  ok('v2.0 빛 (SPEC 25장): 번쩍임은 시야가 이어진 적을 눈멀게(가림 × 0.4, 연기 안경 × 0.5), 열선은 거울이 있어야, 거리로 약해지고, 눈멀면 예비동작을 못 읽는다', () => {
    const mk = (gear, rules) => { const W = A.createWorld({ seed: 1, width: 80, height: 60, obstacles: [], rules: Object.assign({ flight: false, saltRing: false, domain: false }, rules) });
      const m = A.addMage(W, A.mage({ tier: '평범', book: ['번쩍임', '열선'], gear: { mirror: true } }), 0, 10, 30), q = A.addMage(W, A.mage({ tier: '평범', gear }), 1, 30, 30); A.stepWorld(W);
      return [W, m, q]; };
    const flash = (gear, f) => { const [W, m, q] = mk(gear); if (f) f(W, q); A.release(W, m, { s: W.spells['번쩍임'], tx: q.x, ty: q.y, tgt: q }); return q.st.blind; };
    assert.ok(Math.abs(flash({}) - 1.5) < 1e-9 && Math.abs(flash({ goggles: true }) - 0.75) < 1e-9, '눈멂 1.5, 안경 절반');
    assert.ok(flash({}, (W, q) => W.obs.push({ x: 20, y: 30, r: 1 })) === 0, '바위 뒤는 안 보인다');
    assert.ok(Math.abs(flash({}, (W, q) => W.zones.push({ k: 'mist', shape: 'circle', r: 2, x: 20, y: 30, t: 5, src: q })) - 0.6) < 1e-9, '안개 × 0.4');
    const [W, m] = mk({}); assert.ok(m.book.includes('열선')); const W2 = A.createWorld({ seed: 1 });
      assert.ok(!A.addMage(W2, A.mage({ tier: '평범', book: ['열선'] }), 0, 5, 5).book.includes('열선'), '거울이 없으면 책에 없다');
    assert.ok(!A.addMage(A.createWorld({ seed: 1, rules: { light: false } }), A.mage({ tier: '평범', book: ['번쩍임'] }), 0, 5, 5).book.length, '빛을 끄면 책에서 빠진다');
    const beam = d => { const [W, m, q] = mk({}); q.x = m.x + d; const h = q.hp; A.release(W, m, { s: W.spells['열선'], tx: q.x, ty: q.y, tgt: q }); return h - q.hp; };
    assert.ok(beam(15) > 10 && Math.abs(beam(5) / beam(15) - 2 / (1 + 1 / 3)) < 1e-9 && beam(35) === 0, '열선 ∝ 1 / (1 + d/15), 사거리 30');
    // 눈멀면 예비동작을 못 읽는다
    const [W3, m3, q3] = mk({}); q3.cast = { s: W3.spells['열선'], tgt: m3, tx: m3.x, ty: m3.y, t: 0, T: 0.8 }; m3.st.blind = 1; m3.thinkT = 0; A.brain.think(W3, m3);
      assert.ok(m3._k.blindR && !m3._k.threat);
  });
  ok('v2.0 벽 (SPEC 25장): 출력에 비례해 한 블록씩 솟고, 흙벽은 총알을 막고 큰 바위·물에 무너지고, 얼음은 녹고, 벽 밀기는 너머 한 줄을 덮고, 벽 뒤는 안 보인다', () => {
    const B = A.RULES.find(r => r.name === 'bulwark').api;
    const mk = rules => { const W = A.createWorld({ seed: 1, width: 80, height: 60, obstacles: [], rules: Object.assign({ flight: false, saltRing: false, domain: false }, rules) });
      const m = A.addMage(W, A.mage({ tier: '대마법사', book: ['흙벽', '보루', '벽 밀기', '큰 바위', '물 망치'] }), 0, 20, 30), q = A.addMage(W, A.mage({ tier: '병사', deck: '머스킷' }), 1, 40, 30);
      m.thinkT = q.thinkT = 1e9; A.stepWorld(W); return [W, m, q]; };
    const [W, m, q] = mk(); const s = W.spells['흙벽'], T = B.buildT(m, s); assert.ok(T > 3 && T < 4 && B.buildT({ C: 1, fat: 0 }, s) > 900, '대마법사 약 3 s, 평범은 사실상 못 한다');
    m.cast = { s, tx: 40, ty: 30, tgt: q, t: 0, T }; const seen = []; let n = 0; while (m.cast && n++ < 200) { A.stepWorld(W); seen.push(W.walls.length); }
    assert.ok(W.walls.length === 3 && seen[30] < seen[seen.length - 1] && W.walls.every(w => w.own === -1 && w.mat === 'earth' && w.t > 1e8) && W.zones.filter(z => z.k === 'pit').length === 3 && m.alog.walls === 1, '블록 셋이 차례로, 누구의 것도 아닌 흙벽, 구덩이');
    // 총알은 멈추고(2), 큰 바위는 부순다
    const shoot = (name, who) => { const w = W.walls[1], h = w.hp; A.release(W, who, { s: W.spells[name], tx: w.x, ty: w.y, tgt: null }); for (let i = 0; i < 20; i++) A.stepWorld(W); return h - w.hp;
      };
    q.noise = 0; assert.strictEqual(shoot('머스킷', q), 2); m.noise = 0; assert.ok(shoot('물 망치', m) >= 50, '물은 흙벽을 진흙으로'); 
    // 벽 밀기: 너머의 병사를 덮는다 (부딪힘 60 − 굳은 살 0), 벽은 무너진다
    const [W2, m2, q2] = mk(); A.release(W2, m2, { s: W2.spells['흙벽'], tx: 40, ty: 30, tgt: q2 }); q2.x = 23; q2.y = 30; const h2 = q2.hp;
    A.release(W2, m2, { s: W2.spells['벽 밀기'], tx: 23, ty: 30, tgt: q2 }); assert.ok(h2 - q2.hp === 60 && q2.st.root > 1.9 && W2.walls.every(w => w.hp <= 0), '벽 밀기 ' + (h2 - q2.hp));
    // 얼음 벽은 녹는다, 벽을 끄면 석회 기둥은 예전처럼 시간으로 사라진다
    const [W3, m3, q3] = mk(); A.addWall(W3, { x: 30, y: 30, r: 0.6, hp: 40, t: 10, own: 0, mat: 'ice' }); for (let i = 0; i < 60; i++) A.stepWorld(W3);
      assert.ok(Math.abs(W3.walls[0].hp - 39) < 1e-6 && W3.walls[0].t > 1e8, '얼음 초당 0.5');
    const [W4] = mk({ bulwark: false }); A.addWall(W4, { x: 30, y: 30, r: 0.6, hp: 40, t: 10, own: 0, mat: 'lime' }); assert.ok(W4.walls[0].t === 10);
    // 벽 뒤의 예비동작은 못 읽는다
    const [W5, m5, q5] = mk(); A.addWall(W5, { x: 30, y: 30, r: 0.8, hp: 400, t: 1e9, own: -1, mat: 'earth' }); q5.cast = { s: W5.spells['머스킷'], tgt: m5, tx: m5.x, ty: m5.y, t: 0, T: 0.6 };
      m5.thinkT = 0; A.brain.think(W5, m5); assert.ok(!m5._k.threat, '벽 뒤');
  });
  ok('v2.0 군대·사기 (SPEC 25장): 머스킷 장전 15~20 s·화승 0.1~0.5 s·사거리 100 m, 박격포는 벽을 부순다, 돌아가며 쏘기, 사상자·충격에 도망친다', () => {
    const mk = (rules, n = 1, deck = '머스킷', tac) => { const W = A.createWorld({ seed: 3, width: 200, height: 150, obstacles: [], brain: A.brain, rules: Object.assign({ flight: false, saltRing: false }, rules) });
      const e = A.addMage(W, A.mage({ tier: '평범', book: [] }), 0, 20, 75), q = []; for (let i = 0; i < n; i++) q.push(A.addMage(W, A.mage({ tier: '병사', deck, tac }), 1, 80, 60 + i * 2));
      A.stepWorld(W); return [W, e, q]; };
    const [W, e, [q]] = mk(); const s = W.spells['머스킷']; assert.ok(s.R === 100 && s.reload && A.SPELLS['머스킷'].R === 60, '이 세계의 머스킷만 2판');
    assert.ok(A.createWorld({ seed: 1, rules: { army: false } }).spells['머스킷'].R === 60);
    q.thinkT = 0; A.brain.think(W, q); assert.ok(q.cast && q.cast.T >= 0.1 && q.cast.T <= 0.5 + 1e-9 && q.cast.tx === e.x, '화승 지연, 겨눈 자리는 흐리지 않는다 ' + (q.cast && q.cast.T));
    for (let i = 0; i < 20 && q.cast; i++) A.stepWorld(W); assert.ok(q.cd['머스킷'] > 14 && q.cd['머스킷'] <= 20, '장전 ' + q.cd['머스킷']);
    // 박격포: 곡사 3 s, 떨어진 자리의 벽을 부순다
    const [W2, e2, [m2]] = mk({}, 1, '박격포'); A.addWall(W2, { x: 40, y: 75, r: 0.45, hp: 256, t: 1e9, own: -1, mat: 'earth', thick: 0.5 }); A.release(W2, m2, { s: W2.spells['박격포'], tx: 40, ty: 75 });
    for (let i = 0; i < 95; i++) A.stepWorld(W2); assert.ok(W2.walls.length === 0, '박격포가 벽을 부쉈다');
    // 돌아가며 쏘기: 세 줄이면 한 때에 한 줄만
    const [W3, e3, q3] = mk({}, 6, '머스킷', { volley: 3 }); for (const x of q3) { x.thinkT = 0; A.brain.think(W3, x); } assert.strictEqual(q3.filter(x => x.cast).length, 2, '여섯 중 한 줄(둘)만');
    // 사기: 열 중 여섯이 쓰러지면 남은 병사가 도망치고, 끝에 닿으면 빠진다. 둘뿐인 편은 도망치지 않는다
    const [W4, e4, q4] = mk({}, 10); for (let i = 0; i < 6; i++) q4[i].hp = 0; for (let i = 0; i < 30 * 30; i++) A.stepWorld(W4);
    assert.ok(q4.slice(6).every(x => x.flee) && q4.slice(6).some(x => x.alog.fled === 1 && x.hp === 0), '도망쳤다');
    const [W5, e5, q5] = mk({}, 2); q5[0].hp = 0; for (let i = 0; i < 30 * 10; i++) A.stepWorld(W5); assert.ok(!q5[1].flee);
    const [W6, e6, q6] = mk({ morale: false }, 10); for (let i = 0; i < 6; i++) q6[i].hp = 0; for (let i = 0; i < 30 * 10; i++) A.stepWorld(W6); assert.ok(q6.every(x => !x.flee));
  });
  ok('v2.0 두뇌: 무리는 장악권 바로 밖에 흩어지고, 대마법사는 총 앞에서 벽을 세우고 날면 62 m 밖에서 깎는다, 소금 땅에선 마법이 흩어진다', () => {
    const mk = (crowd, n, d, rules, arch) => { const W = A.createWorld({ seed: 2, width: 300, height: 200, obstacles: [], brain: A.brain, rules: Object.assign({ saltRing: false }, rules) });
      const c = A.addMage(W, Object.assign(A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 성' }), arch), 0, 100, 100); const q = [];
      for (let i = 0; i < n; i++) q.push(A.addMage(W, A.mage(crowd), 1, 100 + d, 90 + i * 5)); A.stepWorld(W); return [W, c, q]; };
    // 무리: 70 m에서 반경(50) + 5 쪽으로 다가서고, 사거리가 짧으면(기본기) 예전 그대로
    const [W, c, q] = mk({ tier: '평범', deck: '조약돌' }, 5, 70); for (const x of q) { x.thinkT = 0; A.brain.think(W, x); } assert.ok(q.every(x => x.mv.x < 0), '다가선다');
    const [W1, c1, q1] = mk({ tier: '평범', deck: '조약돌' }, 5, 40); for (const x of q1) { x.thinkT = 0; A.brain.think(W1, x); } assert.ok(q1.every(x => x.mv.x > 0), '반경 안이면 물러난다');
    const [W2, c2, q2] = mk({ tier: '평범', deck: '조약돌' }, 5, 70, { domainR: 0 }); for (const x of q2) { x.thinkT = 0; A.brain.think(W2, x);
      } assert.ok(q2.every(x => x.mv.x < 0 && !x._k.stance.startsWith('k')), '반경이 없으면 기술이 꺼진다');
    // 대마법사: 땅에서 총 다섯이 40 m 앞이면 흙벽을 총 쪽으로 세운다
    const [W3, c3, q3] = mk({ tier: '병사', deck: '머스킷' }, 5, 40); for (const x of q3) x.thinkT = 1e9; let first = null; for (let i = 0; i < 60 && !first; i++) { c3.flyWant = false; A.stepWorld(W3);
      if (c3.cast) first = c3.cast; } assert.ok(first && first.s.n === '흙벽' && first.tx > c3.x && first.T > 3, '흙벽 ' + (first && first.s.n));
    // 날고 있으면 가장 가까운 총에서 62 m 쪽으로 물러난다
    const [W4, c4, q4] = mk({ tier: '병사', deck: '머스킷' }, 5, 40, {}, { z: 10 }); c4.thinkT = 0; A.brain.think(W4, c4); assert.ok(c4.mv.x < 0, '물러난다');
    // 소금 땅: 그 위에서 만들어지는 마법은 흩어지고, 뜰 수 없다
    const W5 = A.createWorld({ seed: 1, salt: [{ x: 0, y: 0, w: 20, h: 30 }], obstacles: [], rules: { domain: false } }), m5 = A.addMage(W5, A.mage({ tier: '대마법사' }), 0, 10, 15), e5 = A.addMage(W5, A.mage({ tier: '평범' }), 1, 30, 15);
    assert.strictEqual(A.gAt(W5, m5, W5.spells['돌 창'], 30, 15), 0); assert.strictEqual(A.gAt(W5, e5, W5.spells['돌 창'], 10, 15), 1); m5.flyWant = true; m5.fz = 6;
      for (let i = 0; i < 30; i++) A.stepWorld(W5); assert.strictEqual(m5.z, 0);
  });
  ok('v2.2 고수 싸움 (SPEC 26장): 리듬(틈이 있으면 들어가고 넘치기 직전엔 빠진다, 상급은 늦다), 장악권 밀기 거리, 헛손질 버리기, 강화는 필요할 때만, 모습 지표', () => {
    const R = require('../../src/brain/techniques/rhythm'), E = require('../../src/brain/techniques/efficacy');
    const mk = (sa, sb) => { const W = A.createWorld({ seed: 1, width: 200, height: 150, obstacles: [], brain: A.brain });
      const m = A.addMage(W, A.mage({ tier: '대마법사', skill: sa, deck: '대마법사 운영' }), 0, 90, 75), e = A.addMage(W, A.mage({ tier: '대마법사', skill: sb, deck: '대마법사 운영' }), 1, 102, 75); A.stepWorld(W);
      return [W, m, e]; };
    const think = (W, m) => { m.thinkT = 0; A.brain.think(W, m); return m.phase; };
    // 장악권 밀기: 같은 신호(둘 다 시전 중)면 들어갈 거리 = 틈 3 m × 2 = 6 m
    const [W0, m0, e0] = mk('대가', '대가'); m0._act = e0._act = true; assert.ok(Math.abs(R.inDist(W0, m0, e0) - 6) < 1e-9);
    // 대가: 상대가 굳으면 들어가고(붙는 시간보다 틈이 길 때만), 넘치기 직전(92)이면 빠진다
    const [W1, m1, e1] = mk('대가', '대가'); e1.st.stun = 2; assert.strictEqual(think(W1, m1), 'in'); assert.ok(m1._k.prefR <= 12 && m1._k.pressB);
    const [W2, m2, e2] = mk('대가', '대가'); e2.st.stun = 0.1; e2.x = 190; assert.strictEqual(think(W2, m2), 'probe', '틈이 너무 짧다');
    const [W3, m3] = mk('대가', '대가'); m3.fat = 95; assert.strictEqual(think(W3, m3), 'out'); assert.ok(m3._k.prefR >= 22);
    const [W4, m4] = mk('상급', '대가'); m4.fat = 95; assert.strictEqual(think(W4, m4), 'probe', '상급은 97까지 버틴다');
    const [W5, m5] = mk('중급', '대가'); think(W5, m5); assert.strictEqual(m5.phase, 'probe'); assert.ok(!m5.mlog.phase.in, '중급은 리듬이 없다');
    // 효과 학습: 다섯 번 쓰고 못 맞힌 수는 버리고, 많이 맞힌 수는 더 쓴다
    const [W6, m6] = mk('대가', '대가'); m6.log.casts = { '낙뢰': 6, '짧은 실': 6 }; m6.log.hits = { '짧은 실': 3 }; const K = m6._k || (think(W6, m6), m6._k); K.S = W6.spells; E.prep(W6, m6, K);
    const o = n => { const x = { s: W6.spells[n], n, isOff: true, v: 1, tx: 0, ty: 0 }; E.value(W6, m6, K, x); return x.v; }; assert.ok(o('낙뢰') === 0 && o('짧은 실') > 1);
    // 강화의 때: 날고 있으면 걸음 강화는 뜻이 없다
    m6.fly = 1; const b = { s: W6.spells['근육 폭주'], n: '근육 폭주', isOff: false, v: 1 }; E.value(W6, m6, K, b); assert.strictEqual(b.v, 0);
    // 모습 지표
    const r = A.duel(A.mage({ tier: '대마법사', skill: '전설', deck: '대마법사 운영' }), A.mage({ tier: '대마법사', skill: '대가', deck: '대마법사 운영' }), { seed: 2 }), L = A.look(r.ms[0], r.t);
    for (const k of ['거리 흔들림', '칸 A 공격', '헛손질 비율', '장악 경계 틈 (m)', '장악 경계 이동 (m/s)', '세운 지형', '없앤 지형']) assert.ok(k in L, k);
    assert.ok(r.ms.some(q => Object.keys(q.mlog.phase).length >= 2), '단계가 바뀐다');   // v2.8: 이 판의 전설은 떠보기만 한다(붙잡아 둔 수로 친다)
  });
  ok('v2.0 비행 (SPEC 24장): 대마법사만 계속 난다, 떠 있으면 발밑 공격·함정에 닿지 않고 총은 맞는다, 굳으면 떨어진다(높이 × 4), 넓은 결투장', () => {
    const FL = A.RULES.find(r => r.name === 'flight').api;
    assert.ok(FL.canFly({ C: 10, fat: 0 }) && FL.canFly({ C: 5, fat: 0 }) && !FL.canFly({ C: 2.5, fat: 0 }) && !FL.canFly({ C: 5, fat: 100 }), '출력 75 kW');
    const mk = (rules, C = 10) => { const W = A.createWorld({ seed: 1, obstacles: 0, width: 200, height: 150, rules: Object.assign({ domain: false, saltRing: false }, rules) });
      const q = A.addMage(W, { C, book: [] }, 0, 100, 75), f = A.addMage(W, { book: ['머스킷', '번개 지뢰'], allowBanned: true }, 1, 110, 75); return [W, q, f]; };
    const up = (W, q, n = 60) => { for (let i = 0; i < n; i++) { q.flyWant = true; q.fz = 6; q.fv = 0; q.mv.x = q.mv.y = 0; q.thinkT = 9; A.stepWorld(W); } };
    const [W, q, f] = mk({}); f.thinkT = 1e9; up(W, q); assert.ok(q.fly === 1 && q.z > 5 && q.z <= 6.5, '떴다 ' + q.z); assert.ok(W._fly && A.snapshot(W).m[0].length === 12, '녹화에 높이·속도');
    // 안 보이는 지연 폭발·함정은 닿지 않는다
    const h0 = q.hp; W.areas.push({ x: q.x, y: q.y, r: 2, t: 0, s: { n: '시험', dmg: 50, kind: 'blunt', stun: 1 }, src: f, pow: 1, vis: false, g: 1 });
      W.traps.push({ x: q.x, y: q.y, r: 1, s: W.spells['번개 지뢰'], src: f, pow: 1, seen: new Set(), t: 30 }); up(W, q, 3);
    assert.ok(q.hp === h0 && q.fly === 1, '발밑 공격에 닿았다 ' + (h0 - q.hp));
    // 총은 그대로 맞는다 (높이로 겨냥한다)
    const hits = []; for (let s = 1; s <= 12 && !hits.length; s++) { const [W2, q2, f2] = mk({}); f2.thinkT = 1e9; up(W2, q2); f2.noise = 0; const g0 = q2.hp;
      A.release(W2, f2, { s: W2.spells['머스킷'], tx: q2.x, ty: q2.y, tgt: q2 }); up(W2, q2, 20); if (q2.hp < g0) hits.push(g0 - q2.hp); }
    assert.ok(hits.length && hits[0] > 20, '총이 안 맞았다');
    // 굳으면 떨어진다: 피해 = 떨어지기 시작한 높이 × 4, 땅에서 1 s 굳음. 몸 받침은 받치지 않는다
    const [W3, q3, f3] = mk({}); f3.thinkT = 1e9; up(W3, q3); const z0 = q3.z, h3 = q3.hp; q3.st.stun = 0.5; let n = 0; while (q3.z > 0 && n++ < 90) A.stepWorld(W3);
    assert.ok(q3.fly === 0 && q3.flog.falls === 1 && Math.abs(h3 - q3.hp - z0 * 4) < 1e-6 && q3.st.stun > 0.9, '추락 ' + (h3 - q3.hp) + ' / ' + z0);
    // 중간은 못 난다, 비행을 끄면 늘 땅
    const [W4, q4] = mk({}, 2.5); up(W4, q4, 10); assert.ok(q4.z === 0 && q4.fly === 0);
    const [W5, q5] = mk({ flight: false }); up(W5, q5, 10); assert.ok(q5.z === 0 && q5.fly === 0 && !W5._fly);
    // 결투장: 대마법사가 끼면 200 × 150 (넓이를 주면 그대로, 비행을 끄면 40 × 30)
    const ar = o => { const W = A.sceneWorld(Object.assign({ seed: 1, sides: [{ mages: [{ tier: '대마법사' }] }, { mages: [{ tier: '평범' }] }] }, o)); return W.width + 'x' + W.height; };
    assert.strictEqual(ar({}), '200x150'); assert.strictEqual(ar({ width: 40, height: 30 }), '40x30'); assert.strictEqual(ar({ rules: { flight: false } }), '40x30');
    // 대마법사끼리: 날고, 같은 씨앗이면 같다
    const d = () => A.duel(A.mage({ tier: '대마법사', skill: '상급' }), A.mage({ tier: '대마법사', skill: '상급' }), { seed: 4 });
    const r1 = d(), r2 = d(); assert.ok(r1.ms[0].flog.t > 1 && r1.t === r2.t && r1.ms[0].hp === r2.ms[0].hp && r1.ms[1].flog.v === r2.ms[1].flog.v);
  });
  ok('v2.0 판단: 떨어지는 돌을 읽고, 소금 선 가까이선 피하기보다 가운데로, 선 밖에 떨어질 이동은 안 한다, 단계 데이터', () => {
    const mk = (tac, rules) => { const W = A.createWorld({ seed: 1, obstacles: 0, rules });
      const m = A.addMage(W, A.mage({ tier: '평범', skill: '상급', tac }), 0, 15, 15), e = A.addMage(W, A.mage({ tier: '평범', deck: '흙' }), 1, 25, 15); A.stepWorld(W); return [W, m, e]; };
    // 곡사: 떨어질 자리 안이면 비킨다 (readLob을 끄면 그대로 걷는다)
    const lob = tac => { const [W, m, e] = mk(tac); m.rollCd = 9; W.lobs.push({ x: m.x + 0.3, y: m.y, t: 0.8, s: W.spells['곡사 돌'], src: e, pow: 1, r: 1 }); m.thinkT = 0; A.brain.think(W, m);
      return m.mv.x; };
    assert.ok(lob({}) < 0, '곡사를 안 피했다'); assert.ok(!(lob({ readLob: false }) < -1), 'readLob을 꺼도 피했다');
    // 소금 선 가까이: 적 지대를 피하는 걸음이 바깥을 가리켜도 가운데로
    const [W, m, e] = mk({}); W.t = 60; const R = A.saltR(W), cx = W.width / 2, cy = W.height / 2; m.x = cx + R - 0.8; m.y = cy; m.rollCd = 9;
    W.zones.push({ k: 'nh3', shape: 'circle', r: 1.5, x: m.x - 0.5, y: m.y, a: 0, src: e, dps: 1, t: 5, n: '시험' }); m.thinkT = 0; A.brain.think(W, m); assert.ok(m.mv.x < 0, '소금 선 밖으로 피했다 ' + m.mv.x);
    // 단계 데이터 (SPEC 13·24장)
    const T = n => A.SKILLS[n].tac; assert.ok(T('대가').slotBOff === false && T('대가').feint === false && T('대가').simul === false);
    assert.ok(T('전설').shieldSave === false && T('전설').learnAim === 'wide' && T('전설').simul === true && T('전설').feint === 0.12 && T('상급').slotBOff === undefined);
  });
  ok('v2.0 이단: 위력 × 0.9, 머리 회복 × 1.3', () => {
    const W = A.createWorld({ seed: 1, obstacles: 0 }), s = W.spells['돌 창'], h = A.addMage(W, { book: ['돌 창'], type: '이단' }, 0, 5, 15), b = A.addMage(W, { book: ['돌 창'], type: '서퍼' }, 1, 35, 15);
    assert.ok(Math.abs(A.power(W, h, s) / A.power(W, b, s) - 0.9) < 1e-12);
    h.fat = b.fat = 50; A.stepWorld(W); assert.ok(Math.abs((50 - h.fat) / (50 - b.fat) - 1.3) < 1e-9);
  });
  return done();
}
module.exports = { run };
if (require.main === module) require('../lib').main([run]);
