'use strict';
/* =========================================================================
 * 숨 결투장 — 등록 v2.23.1
 * 새 마법·덱·등급·두뇌·규칙을 붙이는 곳. Arena.register.spell(...) 모양으로 쓴다.
 * 등록한 것은 그 프로세스(브라우저 탭) 안의 모든 판에 붙는다. 한 장면에서만 덮으려면 장면의 spells·decks를 쓴다.
 * 규칙은 규칙 모듈(SPEC 22장)로 붙는다: src/rules/의 파일과 같은 모양
 * ========================================================================= */
const R = require('./rules');

// core: 엔진 핵심, T: { TIERS, DECKS, BRAINS } — index.js가 넘긴다
module.exports = function makeRegistry(core, T) {
  const need = (ok, msg) => { if (!ok) throw new Error(msg); };
  return {
    // SPEC 8장의 필드. 같은 이름이 있으면 바꾼다
    spell(s) {
      need(s && typeof s.n === 'string' && s.n, '마법에 이름(n)이 없다');
      need(core.FORM[s.t], '없는 틀: ' + s.t + ' (' + Object.keys(core.FORM).join(', ') + ')');
      for (const k of ['cost', 'cast', 'cd']) need(typeof s[k] === 'number', s.n + ': ' + k + '가 숫자가 아니다');
      core.SPELLS[s.n] = s;
      const free = T.DECKS['자유'];
      if (free && !s.banned && !s.mundane && !free.includes(s.n)) free.push(s.n);
      return s;
    },
    deck(name, book) {
      need(Array.isArray(book), name + ': 덱은 마법 이름의 목록이다');
      for (const n of book) need(core.SPELLS[n], name + ': 없는 마법 ' + n);
      T.DECKS[name] = book.slice(); return T.DECKS[name];
    },
    tier(name, spec) {
      T.TIERS[name] = Object.assign({ C: 1, circles: 1, noise: 0.05, dec: 0.15, autoDodge: false, mast: 0, tac: {} }, spec);
      return T.TIERS[name];
    },
    brain(name, b) {
      need(b && typeof b.think === 'function', name + ': 두뇌는 think(W, m)를 가져야 한다');
      T.BRAINS[name] = b; return b;
    },
    // 새 규칙 (SPEC 22장). 두 모양:
    //   rule(모듈)            규칙 모듈 { name, switch?, default?, on?, form?, engine?, types?, brain?, brainTypes? } — src/rules/의 파일과 같다
    //   rule(이름, { default, apply(W), init(W) })   예전 모양: 스위치 이름 = 규칙 이름, 걸음마다 apply(world 훅), 세계를 만들 때 init
    // 스위치의 기본값은 꺼짐. 꺼져 있으면 훅을 모으지 않으니 예전과 같다
    rule(name, r) {
      if (name && typeof name === 'object') { r = name; name = r.name; }
      need(typeof name === 'string' && name, '규칙에 이름이 없다');
      const mod = r && (r.engine || r.brain || r.types || r.brainTypes || r.on) ? Object.assign({}, r, { name }) : null;
      need(mod || (r && typeof r.apply === 'function'), name + ': 규칙은 모듈 모양이거나 apply(W)를 가져야 한다');
      const m = mod || { name, switch: name, engine: () => (r.init ? { world: r.apply, init: r.init } : { world: r.apply }) };
      if (m.switch) core.DEFAULT_RULES[m.switch] = r.default ?? false;
      return R.add(m);
    },
    // 등록한 규칙을 뗀다 (스위치도)
    unrule(name) { const r = core.RULES.find(x => x.name === name); if (!r) return; R.remove(name); if (r.switch) delete core.DEFAULT_RULES[r.switch]; },
  };
};
