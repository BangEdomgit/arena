'use strict';
/* 숨 샌드박스 v0.2 — 묶기 (node cli.js pack)
 * 브라우저는 file://에서 JSON도 모듈도 읽지 못한다. 그래서 엔진(src/의 모듈들, metrics/)과 데이터(data/), 예시 장면(sandbox/scenes/*.json)을
 * sandbox/arena.js 한 장에 그대로 싼다. 빌드 도구 없이 표준 라이브러리만: src/index.js에서 시작해 정적 require('./…')를 따라가 모은다.
 * 파일마다 function (module, exports, require)로 감싸고, 작은 require가 묶음 안에서 찾는다. 코드는 한 글자도 고치지 않는다.
 * 브라우저 전역: Arena(바깥 API), ArenaCore, ArenaBrain, ArenaRegistry, ArenaWatch(걸음마다 보는 지표 metrics/watch, v0.2), ArenaData({ spells, books, scenes }).
 * 기준은 늘 원본 파일이다. arena.js는 손으로 고치지 않는다. 시험(test/test.js)이 어긋났는지 본다.
 * 엔진 안의 require는 정적이고 상대 경로('./', '../')여야 한다(표준 모듈이나 변수 경로는 묶을 수 없다) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(__dirname, 'arena.js');
const ENTRY = 'src/index.js', WATCH = 'metrics/watch.js';   // 박자 지표를 샌드박스에서도 본다 (v0.2)
const REQ = /\brequire\((['"])([^'"]+)\1\)/g;
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');   // 주석 속 require는 따라가지 않는다
const rel = f => path.relative(ROOT, f).split(path.sep).join('/');
// require('p')를 부른 파일 기준으로 찾는다: 그대로, .js, .json, 폴더/index.js
function resolve(from, p) {
  if (!p.startsWith('./') && !p.startsWith('../')) throw new Error(rel(from) + ': 묶을 수 없는 require(\'' + p + '\') — 엔진은 상대 경로만');
  const b = path.resolve(path.dirname(from), p);
  for (const f of [b, b + '.js', b + '.json', path.join(b, 'index.js')]) if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  throw new Error(rel(from) + ': 없는 파일 ' + p);
}
// 엔진에서 닿는 모든 파일 (차례: 경로 이름 순, 결과가 늘 같게)
function modules() {
  const seen = new Map(), todo = [path.join(ROOT, WATCH), path.join(ROOT, ENTRY)];
  while (todo.length) {
    const f = todo.pop(); if (seen.has(f)) continue;
    const src = fs.readFileSync(f, 'utf8'), deps = {};
    if (f.endsWith('.js')) for (const mm of code(src).matchAll(REQ)) { const t = resolve(f, mm[2]); deps[mm[2]] = rel(t); todo.push(t); }
    seen.set(f, { id: rel(f), src, deps });
  }
  return [...seen.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
function scenes() {
  const dir = path.join(__dirname, 'scenes'), out = {};
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) out[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  return out;
}
function text() {
  const ms = modules(), L = [];
  L.push('/* 만든 파일: node cli.js pack (sandbox/pack.js). 손으로 고치지 않는다. 기준은 src/, metrics/, data/, sandbox/scenes/ */');
  L.push('(function (G) {');
  L.push('var D = {};');
  for (const m of ms) {
    const body = m.id.endsWith('.json') ? 'module.exports = ' + JSON.stringify(JSON.parse(m.src)) + ';' : m.src.replace(/\s+$/, '');
    L.push('D[' + JSON.stringify(m.id) + '] = [function (module, exports, require) {\n' + body + '\n}, ' + JSON.stringify(m.deps) + '];');
  }
  L.push(`var C = {};
function load(id) {
  var c = C[id]; if (c) return c.exports;
  var d = D[id]; if (!d) throw new Error('묶음에 없는 모듈: ' + id);
  c = C[id] = { exports: {} };
  d[0].call(c.exports, c, c.exports, function (p) { var t = d[1][p]; if (t === undefined) throw new Error(id + ': 묶음에 없는 require ' + p); return load(t); });
  return c.exports;
}
G.Arena = load(${JSON.stringify(ENTRY)});
G.ArenaCore = load('src/core.js'); G.ArenaBrain = load('src/brain/index.js'); G.ArenaRegistry = load('src/registry.js'); G.ArenaWatch = load(${JSON.stringify(WATCH)});
G.ArenaData = { spells: G.ArenaCore.SPELLS, books: load('data/books.json'), scenes: ${JSON.stringify(scenes())} };
})(typeof globalThis !== 'undefined' ? globalThis : this);`);
  return L.join('\n') + '\n';
}
function write() { fs.writeFileSync(OUT, text()); return OUT; }

module.exports = { modules, text, write, OUT };
