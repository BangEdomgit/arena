/* =========================================================================
 * 숨 결투장 — 등록 v1.2.0
 * 새 마법·덱·등급·두뇌·규칙을 붙이는 곳. Arena.register.spell(...) 모양으로 쓴다.
 * 등록한 것은 그 프로세스(브라우저 탭) 안의 모든 판에 붙는다. 한 장면에서만 덮으려면 장면의 spells·decks를 쓴다.
 * Node와 브라우저(전역 ArenaRegistry) 양쪽에서 돈다.
 * ========================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ArenaRegistry = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
'use strict';

// core: 엔진 핵심, T: { TIERS, DECKS, BRAINS } — index.js가 넘긴다
return function makeRegistry(core, T) {
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
    // 새 규칙: 스위치 이름, 기본값(끄면 예전과 같아야 한다), 걸음마다 할 일 apply(W), 세계를 만들 때 할 일 init(W)
    rule(name, r) {
      need(r && typeof r.apply === 'function', name + ': 규칙은 apply(W)를 가져야 한다');
      core.DEFAULT_RULES[name] = r.default ?? false;
      const h = { name, apply: r.apply, init: r.init }, i = core.RULE_HOOKS.findIndex(x => x.name === name);
      if (i >= 0) core.RULE_HOOKS[i] = h; else core.RULE_HOOKS.push(h);
      return h;
    },
  };
};
});
