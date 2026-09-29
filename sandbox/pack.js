'use strict';
/* 숨 샌드박스 v0.1 — 데이터 싸기
 * 브라우저는 file://에서 JSON을 읽지 못한다. 그래서 src/spells.json, src/books.json, sandbox/scenes/*.json을
 * 그대로 sandbox/data.js 한 장(전역 ArenaData)에 싼다. 기준은 늘 JSON이다. data.js는 손으로 고치지 않는다.
 *   node cli.js pack     다시 싸기 (JSON을 고쳤으면)
 * 시험(test/test.js)이 data.js가 JSON과 어긋났는지 본다. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(__dirname, 'data.js');

function data() {
  const rd = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  const dir = path.join(__dirname, 'scenes'), scenes = {};
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) scenes[f.replace(/\.json$/, '')] = rd('sandbox/scenes/' + f);
  return { spells: rd('src/spells.json'), books: rd('src/books.json'), scenes };
}
function text(d = data()) {
  return '/* 만든 파일: node cli.js pack. 손으로 고치지 않는다. 기준은 src/spells.json, src/books.json, sandbox/scenes/*.json */\n' +
    'globalThis.ArenaData = ' + JSON.stringify(d) + ';\n';
}
function write() { fs.writeFileSync(OUT, text()); return OUT; }

module.exports = { data, text, write, OUT };
