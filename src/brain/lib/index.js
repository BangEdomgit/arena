'use strict';
/* 공용: 규칙의 두뇌 훅이 쓰는 두뇌 도구 (v2.23.1, SPEC 22장). 규칙 파일은 두뇌 파일을 require하지 않는다(순환):
 * 두뇌가 규칙의 brain 훅을 만들 때 B.lib로 넘겨준다(brain/hooks). 도구는 기술 파일에 그대로 있고 여기서 모을 뿐이다 */
const sharp = require('../techniques/sharp'), rhythm = require('../techniques/rhythm'), dodgeAim = require('../techniques/dodgeAim'), grab = require('../techniques/grab'), cancel = require('../techniques/cancel');
module.exports = {
  behind: sharp.behind, chance: sharp.chance, openFor: sharp.openFor,   // 날카롭게: 세운 벽 뒤에 머물기, 명중 가망, 과녁의 빈틈
  inDist: rhythm.inDist,                                                  // 리듬: 들어가는 거리
  dodgeAim: dodgeAim.value, grabValue: grab.value, grabCommit: grab.commit, undo: cancel.undo,   // 큰 수와 짝 (rules/risk)
  crowded: require('./traps').crowded,
};
