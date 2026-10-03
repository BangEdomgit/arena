/* 만든 파일: node cli.js pack (sandbox/pack.js). 손으로 고치지 않는다. 기준은 src/, metrics/, data/, sandbox/scenes/ */
(function (G) {
var D = {};
D["data/blueprints.json"] = [function (module, exports, require) {
module.exports = {"desc":"청사진 = 구조물 배치 묶음 (rules/blueprint, SPEC 28장). 자리는 [a, b, 돌림°]: 진지 자리 A에서 상대 쪽 u로 a m, 옆 p로 b m. 벽은 u를 돌림°만큼 돌린 쪽을 바라보고 그 옆으로 블록을 잇는다. score는 고를 때의 무게(대가부터): 특징(0~1)마다 곱해 더한다. need의 것이 책에 없으면 그 청사진은 고르지 않는다","items":{"wall":{"build":"earth","blocks":2,"th":0.4,"cost":4},"pillar":{"build":"lime","r":0.7,"hp":60,"time":0.4,"cost":3},"trap":{"cast":"trap"},"hidden":{"cast":"trap","hidden":true},"sky":{"cast":"zone","zone":"sky"},"ice":{"cast":"zone","zone":"ice"}},"features":["base","eFly","eGround","approach","far","tired","hurt"],"blueprints":{"반원 보루":{"desc":"내 둘레 반원(반지름 3.5 m)에 흙벽 다섯: 물러나 버틸 때","items":[["wall",3.5,0,0],["wall",2.5,2.5,45],["wall",2.5,-2.5,-45],["wall",0,3.5,90],["wall",0,-3.5,-90]],"need":["wall"],"score":{"base":0.2,"tired":1,"hurt":1.2,"eGround":0.3}},"몰이길":{"desc":"8 m 앞 흙벽 넷에 가운데 틈 하나, 벽 끝에 함정 둘, 틈 안쪽에 안 보이는 함정: 땅으로 다가오는 상대","items":[["wall",8,1.6,0],["wall",8,-1.6,0],["wall",8,3.8,0],["wall",8,-3.8,0],["trap",8,5.6,0],["trap",8,-5.6,0],["hidden",6.5,0,0]],"need":["wall","trap"],"score":{"base":0.1,"eGround":1,"approach":1}},"덫길":{"desc":"상대가 올 길을 따라 3 m마다 좌우 번갈아 덫 넷(셋째는 안 보이게): 한 자리에 쏟지 않는다 (v2.13, 그 앞은 '함정 격자' 3 × 3)","items":[["trap",4,-1.5,0],["trap",7,1.5,0],["hidden",10,-1.5,0],["trap",13,1.5,0]],"need":["trap"],"score":{"eGround":1.2,"approach":0.6}},"하늘 막기":{"desc":"하늘 덮개 하나와 석회 기둥 넷(앞 둘·옆 둘): 날아드는 상대","items":[["sky",2,0,0],["pillar",3,1.8,0],["pillar",3,-1.8,0],["pillar",0,3,0],["pillar",0,-3,0]],"need":["sky"],"score":{"eFly":1.5,"approach":0.5}},"엄폐 사다리":{"desc":"상대 쪽으로 4 m마다 좌우 번갈아 석회 기둥 넷: 멀리서 다가가며 기둥에서 기둥으로","items":[["pillar",4,1.5,0],["pillar",8,-1.5,0],["pillar",12,1.5,0],["pillar",16,-1.5,0]],"need":["pillar"],"score":{"far":0.3,"eGround":0.2}}}};
}, {}];
D["data/books.json"] = [function (module, exports, require) {
module.exports = {"불":["불덩이","화염 방사","소이 캡슐","폭굉 추진","불벽","숨 덫"],"번개":["라이트닝","체인","낙뢰","맨손 방전","다리 자극","흘리기 막","번개 지뢰","근육 경직"],"흙":["돌 창","돌 압축탄","곡사 돌","솟는 발판","석회 기둥","석회 방패","흙 꺼짐","석회 굳히기","가두는 기둥"],"물":["물 망치","물 대포","물길 미끄럼","물 장막","흡수 안개","진흙 웅덩이"],"얼음":["얼음 창","저격 창","서리 깔기","얼음 미끄럼","얼음 기둥","얼음 덫","얼음 족쇄"],"독":["황화수소 캡슐","암모니아 캡슐","초산 분사","유도 포자","독 장막","독 웅덩이","균사 그물"]};
}, {}];
D["data/conditions.json"] = [function (module, exports, require) {
module.exports = [{"id":"c01","name":"1대1: 중간 합법 최강 대 중간 기본기","field":[40,30],"maxT":120,"rules":{"barrels":true},"terrain":{"rocks":5},"note":"예전 duel","sides":[{"name":"청","groups":[{"tier":"중간","deck":"합법 최강","form":"edge"}]},{"name":"적","groups":[{"tier":"중간","deck":"기본기","form":"line","d":28}]}]},{"id":"c02","name":"대마법사 대 평범 50 (둘러싸기, node cli.js ring 씨앗 1과 같다)","field":[40,30],"maxT":90,"layout":"ring","note":"예전 archmage-50. 배치는 엔진(auto, ring)","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","deck":"광역"}]},{"name":"무리","groups":[{"tier":"평범","deck":"기본기","n":50}]}]},{"id":"c03","name":"원소 리그: 평범 여섯이 원소 기본책으로 난전","field":[40,30],"maxT":300,"note":"예전 element-league","sides":[{"name":"불","groups":[{"tier":"평범","deck":"불"}]},{"name":"번개","groups":[{"tier":"평범","deck":"번개"}]},{"name":"흙","groups":[{"tier":"평범","deck":"흙"}]},{"name":"물","groups":[{"tier":"평범","deck":"물"}]},{"name":"얼음","groups":[{"tier":"평범","deck":"얼음"}]},{"name":"독","groups":[{"tier":"평범","deck":"독"}]}]},{"id":"c04","name":"머스킷 반원: 대마법사 대 병사 20","field":[40,30],"maxT":90,"terrain":{"rocks":2},"note":"예전 musket-arc","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","deck":"광역","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":20,"form":"arc","d":14}]}]},{"id":"c05","name":"대마법사 대 평범 100 둘러싸기","field":[200,150],"maxT":90,"layout":"ring","note":"예전 v2-archmage-100","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","deck":"광역"}]},{"name":"평범","groups":[{"tier":"평범","deck":"기본기","n":100}]}]},{"id":"c06","name":"대마법사 하나 대 상위 열 (기본 덱)","field":[200,150],"note":"예전 v2-archmage-1v10","sides":[{"name":"대마법사","groups":[{"tier":"대마법사"}]},{"name":"상위","groups":[{"tier":"상위","n":10}]}]},{"id":"c07","name":"대마법사 둘 대 상위 여섯 (대마법사 운영 덱)","field":[200,150],"note":"예전 v2-archmage-2v6","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","n":2}]},{"name":"상위","groups":[{"tier":"상위","deck":"대마법사 운영","n":6}]}]},{"id":"c08","name":"평범 전설 1 대 초보 3","field":[40,30],"note":"예전 v2-challenger-3","sides":[{"name":"전설","groups":[{"tier":"평범","skill":"전설"}]},{"name":"초보","groups":[{"tier":"평범","skill":"초보","n":3}]}]},{"id":"c09","name":"대마법사 하나 대 상위 20 (상위 무리 기준: 대가·상급, 광역·기술·합법 최강)","field":[200,150],"note":"예전 v2-crowd-1v20","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"상위","groups":[{"tier":"상위","n":20,"skill":["대가","상급"],"deck":["광역","기술","합법 최강"]}]}]},{"id":"c10","name":"머스킷 반원: 대마법사 대 병사 40","field":[40,30],"maxT":90,"terrain":{"rocks":0},"note":"예전 v2-musket-40","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","deck":"광역","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":40,"form":"arc","d":14}]}]},{"id":"c11","name":"중간 대가 대 상급","field":[40,30],"note":"예전 v2-neighbor-mid","sides":[{"name":"대가","groups":[{"tier":"중간","skill":"대가"}]},{"name":"상급","groups":[{"tier":"중간","skill":"상급"}]}]},{"id":"c12","name":"평범 전설 대 대가","field":[40,30],"note":"예전 v2-neighbor-plain","sides":[{"name":"전설","groups":[{"tier":"평범","skill":"전설"}]},{"name":"대가","groups":[{"tier":"평범","skill":"대가"}]}]},{"id":"c13","name":"날아다니는 대마법사(비행 판단 초보) 대 머스킷 20","field":[200,150],"maxT":90,"note":"예전 v2-sky-musket","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"광역","form":"center","tac":{"flySkill":1}}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":20,"form":"ring","area":400}]}]},{"id":"c14","name":"대마법사 대가 대 상급, 좁은 곳","field":[40,30],"note":"예전 v2-sky-narrow","sides":[{"name":"대가","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 결투"}]},{"name":"상급","groups":[{"tier":"대마법사","skill":"상급","deck":"대마법사 결투"}]}]},{"id":"c15","name":"대마법사 전설 대 대가, 넓은 곳 공중전","field":[200,150],"note":"예전 v2-sky-wide","sides":[{"name":"전설","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투"}]},{"name":"대가","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 결투"}]}]},{"id":"c16","name":"대마법사 전설 대 흩어진 상위 10","field":[200,150],"rules":{"squad":true},"note":"예전 v2-squad-10-scattered","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"상위","groups":[{"tier":"상위","n":10,"skill":["대가","상급"],"deck":["광역","기술","합법 최강"]}]}]},{"id":"c17","name":"대마법사 전설 대 상위 전투단 10","field":[200,150],"note":"예전 v2-squad-10","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"상위","groups":[{"tier":"상위","n":10,"skill":["대가","상급"],"deck":["광역","기술","합법 최강"],"squad":true}]}]},{"id":"c18","name":"기습: 대마법사 대 머스킷 40 반원 (14 m, 벽 없이)","field":[40,30],"maxT":90,"rules":{"saltRing":false},"terrain":{"rocks":0},"note":"예전 v2-army-ambush (army.js ambush)","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":40,"form":"arc","d":14}]}]},{"id":"c19","name":"기습 + 포 둘·소금 탄: 대마법사 대 머스킷 40 반원 + 청동포 둘","field":[40,30],"maxT":90,"rules":{"saltRing":false},"terrain":{"rocks":0},"note":"예전 v2-army-ambush-gun. 문턱 H24","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":40,"form":"arc","d":14},{"tier":"병사","n":2,"form":"battery","d":14,"step":0.21}]}]},{"id":"c20","name":"들판: 대마법사 대 머스킷 100 (넷 줄, 돌아가며 쏘기)","field":[1000,600],"maxT":360,"rules":{"saltRing":false},"terrain":{"rocks":0},"note":"예전 v2-army-field. 문턱 H9","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge","z":10}]},{"name":"군대","groups":[{"tier":"병사","deck":"머스킷","n":100,"form":"line","d":250,"rows":4,"tac":{"volley":4}}]}]},{"id":"c21","name":"들판 + 포 셋","field":[1000,600],"maxT":360,"rules":{"saltRing":false},"terrain":{"rocks":0},"note":"예전 v2-army-field-gun. 문턱 H25","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge","z":10}]},{"name":"군대","groups":[{"tier":"병사","deck":"머스킷","n":100,"form":"line","d":250,"rows":4,"tac":{"volley":4}},{"tier":"병사","n":3,"form":"battery","d":290,"step":0.069}]}]},{"id":"c22","name":"준비: 보루 안의 대마법사 대 머스킷 40 반원","field":[40,30],"maxT":90,"rules":{"saltRing":false},"terrain":{"rocks":0,"redoubt":true},"note":"예전 v2-army-prepared","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":40,"form":"arc","d":14}]}]},{"id":"c23","name":"소금 도시: 걸어 들어가는 대마법사 대 머스킷 60","maxT":240,"rules":{"saltRing":false},"terrain":{"salt":"city","d":115,"w":200,"h":150},"note":"예전 v2-army-salt-city. 문턱 H12 (봄)","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":60,"form":"city"}]}]},{"id":"c24","name":"공성: 소금 도시의 성벽·문을 지키는 포 대 밖에서 오는 대마법사","maxT":240,"rules":{"saltRing":false},"terrain":{"salt":"city","d":280,"w":200,"h":150,"wall":true,"gates":3},"note":"v2.33 새 H23: 대마법사는 포의 사거리 밖(문에서 150 m 넘게)에서 시작해 300 s 안에 도시의 무리를 꺾어야 이긴다(시간이 다 되면 도시가 버틴 것, timeWin). 처형 판(3 s 안에 끝) 5% 아래","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":70,"form":"city"},{"tier":"병사","n":7,"form":"battery","gates":true,"gabion":true}]}],"timeWin":1},{"id":"c25","name":"소금 성채: 대마법사 대 성채 안의 머스킷 34","maxT":240,"rules":{"saltRing":false},"terrain":{"salt":"fort","d":146},"note":"예전 x-salt-fort","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":34,"form":"inFort"}]}]},{"id":"c26","name":"소금 성채 + 포 둘","maxT":240,"rules":{"saltRing":false},"terrain":{"salt":"fort","d":146},"note":"예전 v2-army-salt-fort-gun. 문턱 H26","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":34,"form":"inFort"},{"tier":"병사","n":2,"form":"battery","gates":true}]}]},{"id":"c27","name":"합동: 대마법사 대 머스킷 40 + 상위 8","field":[80,60],"maxT":150,"rules":{"saltRing":false},"terrain":{"rocks":0},"note":"예전 x-joint","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"대가","deck":"대마법사 성","form":"edge"}]},{"name":"총병","groups":[{"tier":"병사","deck":"머스킷","n":40,"form":"arc","d":13},{"tier":"상위","n":8,"skill":["상급","대가"],"deck":["광역","기술","합법 최강"],"form":"cluster","d":40}]}]},{"id":"c28","name":"대마법사 전설 대 흩어진 상위 30","maxT":180,"rules":{"saltRing":false,"squad":true},"terrain":{"rocks":0},"note":"예전 x-scattered-30","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투","form":"center"}]},{"name":"상위","groups":[{"tier":"상위","n":30,"skill":["대가","상급"],"deck":["광역","기술","합법 최강"],"form":"ring","area":300}]}]},{"id":"c29","name":"대마법사 전설 대 상위 전투단 30 + 합창","maxT":180,"rules":{"saltRing":false},"terrain":{"rocks":0},"note":"예전 x-squad-30","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투","form":"center"}]},{"name":"상위","groups":[{"tier":"상위","n":30,"skill":["대가","상급"],"deck":["광역","기술","합법 최강"],"form":"squads","team":5,"squad":true,"chorus":true}]}]},{"id":"c30","name":"대마법사 전설 대 상위 전투단 30 원거리 덱 + 합창","maxT":180,"rules":{"saltRing":false},"decks":{"무리 원거리":["저격 창","돌 압축탄","돌 창","얼음 창","체인","짧은 실","낙뢰","번개 그물","돌 비","석회 방패","석회 기둥","솟는 발판","근육 폭주"]},"terrain":{"rocks":0},"note":"예전 x-squad-30-ranged","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투","form":"center"}]},{"name":"상위","groups":[{"tier":"상위","n":30,"skill":["대가","상급"],"deck":"무리 원거리","form":"squads","team":5,"squad":true,"chorus":true}]}]},{"id":"c31","name":"상위 대가 하나 대 평범 30 둘러싸기","field":[80,60],"note":"예전 x-top-vs-plain30","sides":[{"name":"상위","groups":[{"tier":"상위","skill":"대가","deck":"광역","form":"center"}]},{"name":"평범","groups":[{"tier":"평범","deck":"기본기","n":30,"form":"ring"}]}]},{"id":"c32","name":"잡는 수: 소금 원에 갇힌 서클 11 전설 대 상위 전투단 70 + 합창","maxT":300,"rules":{"saltRing":true},"terrain":{"rocks":0},"note":"v2.33 새 H17: 둘러싼 채 시작하고 소금 원이 좁혀 든다. 갇힌 판(closed)이라 물러서거나 끝으로 빠질 수 없다. 열린 판의 물러남은 맞는 결과","sides":[{"name":"대마법사","groups":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투","form":"center"}]},{"name":"상위","groups":[{"tier":"상위","n":70,"skill":["대가","상급"],"deck":["광역","기술","합법 최강"],"form":"ring","area":40,"squad":true,"chorus":true}]}],"closed":true}];
}, {}];
D["data/decks.json"] = [function (module, exports, require) {
module.exports = {"합법 최강":["불기둥","비 뿌리기","땅 번개","짧은 실","근육 폭주","불고리","석회 방패","번개 그물","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"],"광역":["낙뢰","번개 그물","체인","불기둥","화염 방사","돌 비","짧은 실","석회 방패","석회 기둥","솟는 발판","근육 폭주","불고리","비 뿌리기","땅 번개"],"기본기":["돌 압축탄","라이트닝","불덩이","물 망치","얼음 창","석회 방패","다리 자극"],"머스킷":["머스킷"],"박격포":["박격포"],"기술":["짧은 실","체인","번개 그물","흙 손","불기둥","불벽","번개 지뢰","석회 방패","산 안개","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"],"큰 수":["번개 그물","물 대포","빙판","불벽","짧은 실","땅 번개","석회 방패","대낙뢰","화산 기둥","번개 창"],"도발 합법 최강":["도발","불기둥","비 뿌리기","땅 번개","짧은 실","근육 폭주","불고리","석회 방패","번개 그물"],"조약돌":["조약돌","근육 폭주"],"무거운 돌":["무거운 돌","조약돌","근육 폭주"],"번쩍 돌":["번쩍임","무거운 돌","조약돌","근육 폭주"],"열선":["열선","번쩍임","짧은 실","석회 방패","근육 폭주"],"대마법사 성":["흙벽","보루","벽 밀기","낙뢰","번개 그물","체인","불기둥","화염 방사","돌 비","짧은 실","석회 방패","번쩍임","흙먼지","근육 폭주"],"대마법사 운영":["낙뢰","번개 그물","체인","짧은 실","화염 방사","돌 비","석회 방패","석회 기둥","빙판","불벽","산 안개","벽 밀기","흙벽","번쩍임","흙먼지","근육 폭주"],"대마법사 진지":["흙벽","석회 기둥","번개 지뢰","숨 덫","흙 꺼짐","하늘 덮개","빙판","비 뿌리기","불기둥","걸어둔 구름","낙뢰","번개 그물","체인","짧은 실","석회 방패","벽 밀기"],"대마법사 청사진":["청사진","흙벽","석회 기둥","번개 지뢰","숨 덫","흙 꺼짐","하늘 덮개","빙판","비 뿌리기","불기둥","걸어둔 구름","낙뢰","번개 그물","체인","짧은 실","석회 방패","벽 밀기"],"대마법사 수읽기":["석회 기둥","벽 밀기","화산 기둥","대낙뢰","번개 그물","짧은 실","낙뢰","체인","석회 방패","흙벽","번개 지뢰","숨 덫","하늘 덮개","빙판","걸어둔 구름"],"대마법사 결투":["청사진","흙벽","석회 기둥","번개 지뢰","하늘 덮개","걸어둔 구름","낙뢰","번개 그물","땅 번개","가시 솟기","돌 비","체인","짧은 실","석회 방패","벽 밀기","대낙뢰","화산 기둥"]};
}, {}];
D["data/engage.json"] = [function (module, exports, require) {
module.exports = {"desc":"교전 유지 (techniques/engage, SPEC 37장). idle: 쏠 것 없이 이만큼(s) 지나면 다가간다, reachK: 선호 거리의 끝 = 닿는 사거리 × reachK, closeK: 다가갈 거리 = 가장 긴 공격 사거리 × closeK, chaseK: 끝내기 작전이면 사거리 × chaseK까지 쫓는다, low: 몰렸다고 보는 체력 몫, kiteK: 몰린 쪽이 지키는 거리 = 사거리 × kiteK, breathR: 몰린 쪽이 숨을 마시는 남은 몫, huntK: 숨은 상대 자리에 지연 폭발·곡사·번쩍임의 값 배수","idle":1.2,"reachK":0.9,"closeK":0.65,"chaseK":0.45,"low":0.3,"kiteK":0.8,"breathR":0.6,"huntK":1.8};
}, {}];
D["data/gear.json"] = [function (module, exports, require) {
module.exports = {"default":{"soles":true},"items":{"soles":{"이름":"소금 밑창","설명":"안 보이는 발밑 공격(지연 폭발)의 피해·묶임·굳힘을 × 0.3 (WORLD 148)"},"cloak":{"이름":"소금 망토","설명":"두른 사람 1.6 m 안에서 남의 장악 몫 × 0.3 (WORLD 148)"},"silver":{"이름":"은실 옷","설명":"은이 몸에 닿는 응답을 끊는다(WORLD 3-4): 굳음·묶임·몸 묶기의 길이 × 0.5. 은은 전기를 잘 통해 전기 피해 × 1.1. 수는 data/rules/silver.json. rules.silver가 켜졌을 때만 (SPEC 10장)"},"mirror":{"이름":"유리 비단 거울","설명":"빛을 모아 곧게 보내는 거울. 있어야 열선을 쓴다 (rules.light, SPEC 25장)"},"goggles":{"이름":"연기 안경","설명":"번쩍임의 눈멂 × 0.5 (rules.light, SPEC 25장)"}}};
}, {}];
D["data/hazard.json"] = [function (module, exports, require) {
module.exports = {"desc":"내 위험 지대 비키기 (brain/techniques/hazard, v2.21, tac.hazard, 선명도 5 이상). pad: 내가 깐 지연 폭발·곡사의 반경에 더하는 여유(m). look: 걸음을 볼 앞날(s, 터질 때까지 남은 시간과 작은 쪽). out: 반경 안이면 바깥으로 나가는 걸음의 세기. salt: 소금 원의 안전 반경을 이만큼(m) 더 안쪽으로 (끝판의 원은 초당 2 m 줄어든다: 1 s 굳으면 넘어온다). self: 풀 마지막 자리에서 내가 (지금 자리 + 속도 × 터질 때까지) 반경 + self m 안이면 그 지역 마법은 버린다","pad":1.2,"look":1,"out":2.5,"salt":2.5,"self":0.8};
}, {}];
D["data/joseki.json"] = [function (module, exports, require) {
module.exports = {"desc":"정석 (src/brain/plan/joseki, v2.15, SPEC 39장). seq: 수순(마법 이름, 앞 수가 풀린 뒤 gap s 안에 다음 수). know: 아는 판단 수준. ground: 땅에 선 상대에게만. answer: 첫 수(at)를 보면 받는 쪽이 하는 것 — away(수순의 마지막 수가 닿기 전에 상대에서 멀리, 높이), keep(쓰기 아까운 자원은 마지막 수까지 남긴다), cast(이 마법을 먼저)","lines":{"폭풍의 세 수":{"seq":["번개 그물","짧은 실","낙뢰"],"gap":0.9,"know":["상급","대가","전설"],"desc":"번개 그물로 굳히거나 옆으로 밀어내고, 피한 자리에 짧은 실, 굳은 동안 낙뢰","answer":{"at":1,"do":"away","keep":["cut","shield"]}},"바위 감옥":{"seq":["석회 기둥","석회 기둥","벽 밀기","화산 기둥"],"gap":1.2,"know":["대가","전설"],"ground":true,"desc":"기둥 둘로 옆길을 막고, 기둥을 밀어 묶고, 묶인 발밑에 화산 기둥","answer":{"at":1,"do":"away","keep":["roll","cut"],"cast":"흙벽"}}}};
}, {}];
D["data/mode.json"] = [function (module, exports, require) {
module.exports = {"desc":"공격 방식 (techniques/mode, SPEC 36장). every: 방식을 다시 고르는 간격(판단 수준 1~5, s; 전설은 every5 ~ every5Hi 사이 무작위), pokeGap 견제 사이 간격(s), pokeCost·pokeCast 견제로 치는 싼·빠른 공격의 당·시전 시간 한도, coverH 덮기가 보는 앞날(s), rollD 구르기 거리(m), runV 뒤로 달리기 속도(m/s), flyD 나는 상대의 옆 꺾기 거리(m), 값의 배수 sureK·coverK·throwK·pokeK·repeatK·bigK·offK(방식에 맞지 않는 공격), baitT 견제 뒤 구르기를 빼낸 것으로 보는 시간(s), heat 덮기 뒤 숨을 마실 머리 피로, far 멀다고 보는 사거리 몫, domain 장악권에서 밀린다고 보는 몫, hiddenT 숨은 자리의 첫 수로 보는 쉼(s), l5 전설만의 것 (poke 견제를 먼저, big 큰 수는 확정 순간에만, jitter 방식 박자 흔들기, bait 피하기 빼낸 뒤 덮기)","every":[1,1,1,0.6,0.3],"every5Hi":1,"pokeGap":1,"pokeCost":4,"pokeCast":0.6,"coverH":0.75,"rollD":2.5,"runV":5,"flyD":6,"sureK":2,"coverK":1.5,"throwK":1.6,"pokeK":1.6,"repeatK":1.6,"bigK":2.5,"offK":0.3,"baitT":2,"heat":70,"far":0.75,"domain":0.5,"hiddenT":3,"l5":{"poke":false,"big":true,"jitter":true,"bait":true}};
}, {}];
D["data/plan.json"] = [function (module, exports, require) {
module.exports = {"desc":"수읽기 (src/brain/plan, v2.15, SPEC 39장). 줄인 상태(방어 자원 여섯·피할 곳 아홉)로 내 수 → 상대의 가장 좋은 응수 → 내 다음 수를 깊이(tac.read)만큼 읽는다. res: 구르기의 간격·거리, 옆 튀기의 가속(g). 다른 자원의 간격은 그 규칙·마법의 값(날기 끊기 cut.cd, 막기 pace guard.cd, 방패·벽은 마법의 cd, 몸 털기는 대응 unbind.cd). form: 틀마다 응수(move = 움직여 피하기). w: 끝 자리의 값(피해 × dmg + 잠긴 자원 × 무게 + 막힌 피할 곳 × slot, 메이트 + mate). every: 다시 읽는 간격(s). hit: 응수 수(0·1·2·3+)마다 맞을 가망의 앞선 값(실·투사체 / 지연 폭발·곡사, 결투장 전설 대 전설에서 잰 것)과 그 무게 w(판 중 내 수로 배운다), mate: 응수 0이고 맞을 가망이 이만큼이면 메이트, wait: 맞았나 보는 시간(s). (v2.17) big.hpAt: 큰 한 방은 상대 체력이 이 몫 아래일 때만 수 목록에. plan.finHp·finOthers: 상대 체력이 finHp 아래면 메이트·체크·메이트 수순이 아닌 공격 × finOthers(끝내기는 메이트로). shield.thru: 상대의 세운 앞 방패가 나를 마주 보고 닿을 때까지 남으면 실·투사체 ×","every":0.15,"minGap":0.12,"horizon":1.6,"res":{"roll":{"cd":0.75,"disp":2.4},"cut":{"g":5},"shieldUp":1.6},"form":{"thread":["shield","guard","wall","cut","roll","move"],"proj":["shield","guard","wall","cut","roll","move"],"area":["guard","cut","roll","move"],"lob":["guard","cut","roll","move"],"topple":["cut","roll","move"],"cage":["cut","move","shake"],"touch":["guard","roll","move"],"cone":["guard","roll","move"]},"bind":["shake"],"w":{"roll":0.5,"cut":0.5,"guard":0.4,"shield":0.6,"wall":0.3,"shake":0.3,"slot":0.2,"dmg":0.1,"lockCap":1.2,"mate":20},"cost":{"move":0.2,"guardDmg":0.6},"beam":{"me":[4,3,2,2],"them":[2,2,1,1]},"big":{"minDmg":40,"hpAt":0.5},"plan":{"base":0,"boost":1.3,"mateBoost":3,"others":0.9,"check":1.2,"finHp":0.15,"finOthers":0},"net":{"low":1,"free":3,"slip":0.8,"wall":2.5,"counter":1.3,"away":0.4},"shield":{"thru":0},"slotD":3,"walkV":6,"hit":{"prior":{"thread":[0.4,0.4,0.4,0.4],"area":[0.9,0.55,0.1,0.03]},"w":20,"mate":0.6,"wait":1.5},"takeoff":0.15,"fallT":0.8};
}, {}];
D["data/profiles.json"] = [function (module, exports, require) {
module.exports = {"desc":"규칙 묶음 (rules.profile, v2.23.1, SPEC 22장). 장면·판의 rules에 profile 이름을 주면 그 스위치들을 켠 위에 나머지 rules를 덮는다(스위치 하나하나를 그대로 줄 수도 있다). base는 앞 묶음을 먼저 깐다","진지":{"rules":{"flightCut":true,"fort":true,"trapChain":true}},"청사진":{"base":"진지","rules":{"reflex":true,"snap":true,"blueprint":true}},"작전":{"base":"청사진","rules":{"tactics":true}},"빠른 판":{"base":"작전","rules":{"fineStep":true,"pace":true}},"결투장":{"base":"빠른 판","rules":{"passives":true,"tune":true,"stunRes":true,"rings":true}},"지금":{"base":"결투장","rules":{"gunfire":true,"steady":true,"calm":true,"resolve":true,"fireLane":true,"saltWise":true,"selfSafe":true,"unstuck":true,"edgeCancel":true},"note":"지금의 규칙 모두 (v2.24.1, v2.25에 gunfire, v2.27에 steady·calm(finish 0.7), v2.30에 resolve·fireLane·saltWise·selfSafe·unstuck, v2.31에 edgeCancel. 포병(artillery)은 포가 든 장면이 켠다): 세계를 재는 장면(군대·무리·하늘·이웃 단계·둘러싸기)과 문턱의 H줄이 쓴다. 새 규칙을 기본으로 들이면 여기에 더한다"}};
}, {}];
D["data/rules/army.json"] = [function (module, exports, require) {
module.exports = {"musket":{"R":100,"cast":0.1,"fuse":[0.1,0.5],"reload":[15,20],"aimN":0.004,"aimD":0.0004},"mortar":{"spread":0.05,"min":5},"volleyT":17.5,"farFly":{"z":2,"d":50},"morale":{"every":0.5,"cas":0.2,"casK":2,"shock":0.35,"shockR":10,"shockDmg":50,"decay":0.5,"minSide":3,"skill":{"초보":1,"중급":1.3,"상급":1.6,"대가":2,"전설":2.5},"edge":1,"salt":3,"resolve":{"org":2.5,"fort":2.5,"wallR":3,"hp":0.7,"herd":0.3,"healthy":0.1}}};
}, {}];
D["data/rules/artillery.json"] = [function (module, exports, require) {
module.exports = {"desc":"포병과 소금 탄 (rules.artillery, v2.31, SPEC 54장). 덱은 장면이 쓴다(decks): 데이터 덱 목록을 늘리면 결과 지문(mixed)이 바뀐다","decks":{"청동포":["산탄","둥근 탄","소금 탄"],"포수":[]},"gun":{"hp":400,"crew":4,"crewR":5,"speed":0.12,"reload":30,"lowZ":2.2,"muzzle":1,"magicK":0.15,"hold":1.5,"magicCap":40},"canister":{"n":60,"half":0.05,"elev":0.27,"close":80,"far":120},"round":{"slowV":3,"wall":1.4,"moveD":25},"salt":{"r":12,"t":30,"h":6,"spread":0.04,"min":4,"minD":8,"v":90,"tMin":0.4,"tMax":2.5,"lead":1},"arch":{"cMin":5,"hunt":160,"warn":1.2,"side":3,"fogPad":3},"crew":{"post":3,"side":1.8,"stay":1.2,"fill":25,"every":30},"gabion":{"n":0,"d":1.6,"gap":1.4,"r":0.5,"step":1,"hp":300}};
}, {}];
D["data/rules/blueprint.json"] = [function (module, exports, require) {
module.exports = {"maxLanes":10,"buildD":30,"backD":16,"near":60,"again":8,"value":5};
}, {}];
D["data/rules/breath.json"] = [function (module, exports, require) {
module.exports = {"desc":"숨 (rules/breath, SPEC 35장): n 판마다 쓸 수 있는 수, T 마시는 시간 (s), slow 마시는 동안 속도 배수, glu·fat·stam 끝나면 당 +g · 머리 피로 − · 기력 +, after 숨 뒤 공격 명중을 세는 시간 (s), pre 작전 압박·끝내기를 고른 뒤 '직전'으로 보는 시간 (s)","n":3,"T":0.5,"slow":0.5,"glu":80,"fat":30,"stam":3,"after":5,"pre":1};
}, {}];
D["data/rules/bulwark.json"] = [function (module, exports, require) {
module.exports = {"rate":0.6,"rateP":632000,"block":{"gap":0.8,"r":0.45,"h":1.6,"hpM3":400},"stopThick":0.5,"bullet":2,"heavyM":5,"heavy":500,"water":10,"ice":{"melt":0.5,"fire":20},"pit":{"r":0.7,"out":1.1,"speed":0.5},"upkeep":{"glu":0.8,"max":15},"topple":{"depth":2.5,"reach":6},"maxBuild":20};
}, {}];
D["data/rules/calm.json"] = [function (module, exports, require) {
module.exports = {"desc":"낮은 단계의 머리 아끼기 (rules.calm, v2.25, SPEC 48장)","cMax":5,"enter":[999,100],"edge":150,"edgeM":120,"finish":0.7,"rest":0};
}, {}];
D["data/rules/chipGuard.json"] = [function (module, exports, require) {
module.exports = {"desc":"작은 수 막기 (rules/chipGuard, v2.24, SPEC 47장, 기본 꺼짐). 응수가 있는 동안(몸을 쓸 수 있다: 굳음·묶임·떨어짐이 아니다) 떡대가 적의 한 방마다 cut을 뺀다(0 아래로는 안 간다). 선명도 cMin 이상만. 지대·빔·불·소금처럼 걸음마다 드는 피해(틱)는 빼지 않는다","cMin":8,"cut":1.5};
}, {}];
D["data/rules/chorus.json"] = [function (module, exports, require) {
module.exports = {"desc":"합창 (rules.chorus, v2.27, SPEC 50장)","every":0.25,"R":6,"goodN":3,"goodT":3,"sync":1.5,"cd":2,"limit":[[4,6],[2,3]],"powK":2.5,"hold":0.3,"spread":3,"aimB":20,"out":12,"note":"R: 서로 이만큼 안(m). sync: 박자를 맞추는 시간(s). cd: 깨진 뒤 다시 맞출 수 있기까지(s). limit: [선명도 이상, 함께 맞출 수 있는 수] 차례대로(상위 C 5 → 6, 중간 C 2.5 → 3, 평범은 못 함). 합창하는 사람의 선명도 × √N(장악권), 앞소리꾼의 위력 × √N^powK(함께 짓는 큰 마법). hold: 앞소리꾼이 아닌 사람의 공격 값 × hold(박자를 지킨다, 묶는 수는 그대로). spread: 전투단(rules.squad)의 조원 사이를 이만큼으로 좁힌다. aimB: 대마법사의 다수 모드가 합창하는 사람을 고르는 덤(거리에서 뺀다, m)","keepR":9,"join":1,"bigC":5,"brk":{"R":70,"nW":4,"castB":60,"formB":40,"bind":3,"castK":3,"wide":1.4}};
}, {}];
D["data/rules/chorusCast.json"] = [function (module, exports, require) {
module.exports = {"desc":"합창 설계 (rules.chorusCast, v2.34, SPEC 56장). 합창(rules.chorus)이 고리·출력을 모아 앞소리꾼이 혼자는 못 쥐는 큰 마법을 짓는다","book":["고요한 원","번개 장막","석회 고리","구름 걸기","곳간 터뜨리기","합창 방패","대낙뢰","화산 기둥","하늘 덮개","걸어둔 구름"],"kW":2,"outK":2.5,"bigE":8,"maxRing":8,"back":{"dmg":12,"fat":15,"stun":0.4,"hold":0.5},"hold":{"fat":2.5},"calm":{"minN":4,"reach":12,"v":1.6,"foeC":1.5,"pad":3,"breakB":40,"outPad":3,"outV":12},"net":{"z":2,"v":1.5},"lime":{"v":1.3,"zMax":1.5,"near":4},"cloud":{"v":0.7},"granary":{"left":0.05,"v":1.1,"min":0.5},"shield":{"v":1.3},"see":{"C":8,"R":90,"bind":2,"elecPad":6},"push":{"v":3,"T":2,"pad":3},"note":"book: 합창할 수 있는 사람(tac.squad·tac.chorus, 합창 한계 둘 이상)의 책에 더하는 마법(chorusOnly는 합창의 앞소리꾼만, ring은 쥘 수 있는 고리가 그만큼일 때만). 출력 = kW × C^outK × 피로 배수(kW). bigE: 손잡이의 에너지가 이만큼이면 큰 수. maxRing: 큰 손잡이를 쥔 고리. back: 짓다 깨진 큰 수의 역류(합창한 사람마다 피해 dmg·머리 fat·굳음 stun × 고리/8 × E^(1/3), 쥐던 고요한 원이 깨지면 × hold). hold.fat: 고요한 원을 쥐는 동안 사람마다 초당 머리. calm: 사람 minN 이상, 과녁 선명도가 앞소리꾼의 foeC배 이상일 때, 가운데는 앞소리꾼에서 reach m까지. see: 선명도 C 이상은 R m 안의 합창 큰 수를 보고 그 앞소리꾼을 노리고 묶는 수 × bind. push: 큰 수가 닿지 않으면 합창이 한 덩어리로 v m/s 다가간다(T s마다 다시 정한다). cm (v2.35): 합창의 체크(check: 날기를 꺾고 가두고 장악권을 지운다)와 메이트(mate: 큰 수). 메이트는 과녁이 터지기까지(예비동작 + 지연) 반지름 밖으로 빠져나갈 수 없을 때만(수읽기의 줄인 상태: 옆 튀기·구르기·열린 피할 곳, 굳음·묶임·떨어짐), 맞을 가망 = 빠져나가면 escP, 못 하면 1(막기가 있으면 × guardK). 가망이 mateMin 이상이면 값 mateV × 가망. 과녁의 응수가 within s 안에 하나도 없으면 체크 × noSlack. chainT: 체크 뒤 이 s 안의 메이트를 이어진 것으로 센다. calm (v2.35, 합창 깨기 tac.chorusBreak: 전설): 적의 고요한 원(r + outPad m 안)이면 outV m/s로 밖으로, 원을 쥔 앞소리꾼을 거리 − breakB로 먼저 노리고 묶는 수 × see.bind","cm":{"check":["번개 장막","석회 고리","고요한 원"],"mate":["대낙뢰","걸어둔 구름","화산 기둥"],"mateV":2,"mateMin":0.6,"escP":0.1,"guardK":0.5,"within":1,"noSlack":0.4,"chainT":6}};
}, {}];
D["data/rules/crowdFire.json"] = [function (module, exports, require) {
module.exports = {"R":25,"n":2,"w":2,"lead":1,"cover":0.5};
}, {}];
D["data/rules/drain.json"] = [function (module, exports, require) {
module.exports = {"desc":"마름 (rules.drain, v2.28, SPEC 52장)","cell":10,"stock":1500,"regen":8.33,"reach":3,"k":1,"move":0.35,"lure":0.5,"lureR":25,"note":"땅을 cell m 칸으로 나누고 칸마다 곳간 stock. 마법이 서는 자리의 칸과 둘레 reach 칸(3 × 3)에서 에너지 = 비용 × 선명도^powerK × k를 꺼낸다(가까운 칸부터 고르게). 모자라면 위력이 꺼낸 몫만큼. 칸마다 초당 regen씩 다시 찬다(햇빛, stock / regen ≈ 3분). move: 대마법사(다수 모드)는 둘레 곳간이 이 몫 아래면 가장 찬 쪽으로 옮긴다. lure: 무리(선명도 5 아래)는 대마법사 lureR m 안에서 곳간이 이 몫 아래인 칸에 선다(그 자리에 서는 대마법사의 마법이 약하다)"};
}, {}];
D["data/rules/edgeCancel.json"] = [function (module, exports, require) {
module.exports = {"ratio":1.5,"gStart":0.3,"gCut":0.05,"minLeft":0.1,"back":1.5,"v":2.5};
}, {}];
D["data/rules/fireLane.json"] = [function (module, exports, require) {
module.exports = {"pad":0.3,"k":1,"hold":1.5,"side":1.5};
}, {}];
D["data/rules/flight.json"] = [function (module, exports, require) {
module.exports = {"P0":2000,"Pk":2.5,"minP":75000,"lift":150000,"liftV":20,"glideVz":4,"mass":80,"g":9.8,"drag":0.135,"zMin":2,"zMax":15,"vzMax":8,"vzAcc":12,"vMax":100,"fwdG":3,"latG":5,"latK":0.08,"latP":300000,"corner":25,"film":60,"filmBlind":0.3,"pow":0.8,"powL":[1.15,0.6,0.5],"fat":[1,6,40],"fall":4,"fallStun":1,"elec":1.3,"cloud":1.3,"arena":[200,150],"arenaC":10,"graze":{"v":15,"within":2},"cut":{"brake":5,"side":5,"sideT":0.25,"hop":3,"hopT":0.3,"dive":4,"cush":5,"soft":2,"safeV":4,"fat":1.5,"cd":0.6,"minZ":1.5,"within":2,"brain":{"margin":[0,0,0.8,0.5],"catch":3.5,"tca":0.45,"tcaL":0.8,"miss":1.2,"release":0.25,"strikeZ":4,"strikeT":0.25,"catchS":2,"again":2,"hopRead":0.35}},"brain":{"hover":3,"approach":50,"full":100,"slow":15,"z":6,"zLow":3,"zHigh":15,"near":10,"danger":6,"crowd":8,"elecMany":2,"bind":2,"lead":1.5,"leadV":60,"tiredFat":60,"hopN":2,"hopT":3,"restFat":999,"restWave":100,"guns":3,"zCrowd":10,"vCrowd":5,"waveLand":true,"gunFar":110,"ownGap":2,"gunR":30,"feintV":40,"strike":1.5,"survive":{"land":75,"up":45,"low":70,"lowT":1,"danger":6}}};
}, {}];
D["data/rules/fort.json"] = [function (module, exports, require) {
module.exports = {"trapK":1,"chainR":3.5,"chainDelay":0.2,"chainPad":0.4,"sky":{"every":15,"stun":0.4,"dmg":4},"brain":{"R":10,"near":60,"buildD":30,"backD":16,"relocate":35,"home":14,"skyAt":2,"gapR":2.5,"budget":12,"again":20,"stand":0.8,"wallAt":1.35,"line":8,"seg":2.6,"end":6.8,"kill":5,"breachR":14,"ring":20}};
}, {}];
D["data/rules/gunfire.json"] = [function (module, exports, require) {
module.exports = {"desc":"총의 쏨 (rules.gunfire, v2.25, SPEC 48장)","R":12,"lag":0.3,"alert":{"cMin":5,"hear":120,"near":5,"after":0.15,"hop":1,"lead":0.25,"r":1.2},"sweep":{"t":15,"k":2.5},"note":"R: 처음 겨눈 곳에서 이만큼 안이면 따라간다 (m). lag: 방아쇠에서 풀기까지 (s, 화승)"};
}, {}];
D["data/rules/hold.json"] = [function (module, exports, require) {
module.exports = {"desc":"붙잡아 둔 설계 (rules/hold, SPEC 32장): heat 붙잡은 동안 초당 머리 피로, maxT 다 지은 뒤 붙잡는 가장 긴 시간 (s), go 풀 맞을 가망","heat":1,"maxT":3,"go":0.25};
}, {}];
D["data/rules/pace.json"] = [function (module, exports, require) {
module.exports = {"desc":"빠른 판 (rules/pace, v2.14, SPEC 38장). 선명도 cMin 이상(대마법사)에게만. 엔진: bulk 떡대(적이 준 피해 ×), cool 머리 회복 ×, run 땅 걸음 ×, agile 꺾는 가속 ×, guard 막기(순간 켜기 패시브), track 감각 조준 반경(tac.pace 0~3) (숨긴 수는 × trackHid, v2.23. 1이면 끔: 0.6이면 전설끼리 명중 34 → 27%, 정보의 열매 14 → 8%p).21.0.md). 두뇌: castK·cdK·costK 시전·되쓰기·당 ×, threadK 실 빠르기 ×, move 늘 움직이기(tac.pace)","cMin":8,"bulk":0.35,"cool":2,"run":2.2,"agile":4,"castK":0.6,"cdK":0.5,"costK":0.6,"threadK":3,"track":[0,1,2,5],"trackHid":1,"guard":{"cd":0.35,"okT":0.3,"k":0.45,"glu":5,"pow":0.7,"min":0.12,"lead":0.3,"near":2.2,"gluMin":12},"move":{"vMin":26,"vIn":34,"inK":0.35,"outK":0.5,"lat":0.6,"flip":[0.35,0.8],"flipL":[0.25,0.55],"turnP":0.8,"hurry":[0.4,0.6,0.8],"fly":true,"noDrop":true,"read":true}};
}, {}];
D["data/rules/passive.json"] = [function (module, exports, require) {
module.exports = {"desc":"잔기술 (rules/passive, v2.18, SPEC 42장). 선명도 cMin 이상이고 판단 수준 tac.passive가 있는 사람만, 한 번에 하나. kinds: 잔기술마다 막는 피해의 종류(차례가 st.psv 1·2·3). k: 맞는 피해 ×, stunK: 절연 막이 켜졌을 때 전기 굳힘의 길이 ×. onT: 켜서 막기까지(s), cd: 끈 뒤 다시 켤 때까지(s), heat: 켜 둔 동안 머리 열(초당), fatOff: 머리가 이만큼 넘으면 꺼진다, okT: 켠 지 이만큼 안에 막으면 순간 켜기 성공(지표). 판단: swap 상급이 보는 위협의 앞날(s), lead[tac.passive] 대가·전설이 켜는 앞날(s), min 위협이 없어지고 끄기까지(s), near 내 앞길 몇 m 안을 겨눈 수를 위협으로 보나","cMin":5,"kinds":[["elec"],["blunt"],["fire","heat"]],"names":["절연 막","굳은 살","열 차단"],"k":0.45,"stunK":0.7,"onT":0.05,"cd":0.3,"heat":1,"fatOff":95,"okT":0.3,"swap":0.5,"lead":[0,0,0,0.3,0.1],"min":0.12,"near":2.2,"hold":{"L":4,"n":2,"ang":0.8,"within":1,"keep":2,"note":"v2.36 전설(tac.passive 4): within s 안에 나를 겨눈 전기 굳힘·실이 n개 이상, 방향이 ang rad 넘게 벌어졌으면 keep s 동안 절연 막을 켜 둔다(서클 하나·머리 열 그대로)"}};
}, {}];
D["data/rules/reflex.json"] = [function (module, exports, require) {
module.exports = {"win":0.5,"pad":0.4,"read":0.3,"aheadT":[0.05,1.2],"aheadR":1.5,"aheadMin":2,"stopV":3,"stopT":0.25,"flipT":0.25,"dodgeT":0.2,"airV":25,"lrtZ":2.5,"lrtCush":0.3,"jukeWin":0.4,"after":0.3};
}, {}];
D["data/rules/response.json"] = [function (module, exports, require) {
module.exports = {"reflex":{"window":0.2,"again":0.25},"brace":{"k":0.6,"dur":0.6,"fat":5,"speed":0.3,"within":0.35,"minDmg":12},"unbind":{"fat":12,"glu":4,"cd":5,"min":0.5},"levels":{"초보":{"reflex":0,"brace":false,"unbind":false},"중급":{"reflex":0.3,"brace":true,"unbind":false},"상급":{"reflex":0.5,"brace":true,"unbind":true},"대가":{"reflex":0.7,"brace":true,"unbind":true},"전설":{"reflex":0.85,"brace":true,"unbind":true}},"noSkill":{"autoDodge":{"reflex":0.4,"brace":true,"unbind":false},"plain":{"reflex":0,"brace":false,"unbind":false}}};
}, {}];
D["data/rules/ringLedger.json"] = [function (module, exports, require) {
module.exports = {"desc":"고리 장부 3단계 (rules.ringLedger, v2.37, SPEC 59장). 서클 규칙(circles) 위에서. 모든 일이 고리 하나씩을 쓴다: 첫 칸(짓기·흐름)·두 번째 칸(짓기·붙잡음)·셋째 칸부터(X)·합창의 박자·버팀 벽마다·날기·공기막·잔기술·자동 진·몸 강화. 고리가 모자라면 값이 낮은 일부터 내려놓는다","v":{"A":10,"X":9.5,"bul":10,"body":10,"chorus":9,"B":8,"hold":6,"flyDanger":7.5,"fly":5,"film":7.4,"psvHold":7,"psv":5,"autoAimed":5.5,"auto":4},"danger":6,"x":{"heat":0.3,"glu":0.3,"fatMax":55,"gluMin":20,"heatCap":60,"capAll":80,"dropAt":85},"holdHeat":1.5,"note":"v: 일마다 고리의 값(높은 것부터 고리를 준다). A·X·bul·body는 이미 쥔 것이라 늘 먼저(내려놓을 수 없다). 날기는 둘레 danger m 안에 적의 안 보이는 구름·덫·해로운 지대가 있으면 flyDanger, 공기막은 날기와 함께(빠르게 날 때). 잔기술은 전설의 켜 두기(rules/passive hold) 중이면 psvHold. 자동 진은 나를 겨눈 수가 있으면 autoAimed. 내려놓기: 날기 → 내려앉는다, 잔기술 → 끈다, 붙잡음 → 거둔다, 자동 진 → 쉰다, 두 번째 칸·셋째 칸 → 새로 짓지 않는다. x: 셋째 칸부터 k번째(1부터)의 시전은 머리 열 × (1 + heat × (k + 1))·당 × (1 + glu × (k + 1)), 머리가 fatMax를 넘거나 당이 gluMin 아래면 새로 짓지 않는다. holdHeat: 동시에 짓는 수 n이 셋 이상이면 초당 머리 holdHeat × (n − 2) (많이 쥘 수 있어도 오래는 못 쥔다). x.heatCap: 지금 머리 + 쥔 수들이 풀릴 때의 머리 열 + 이 수의 머리 열이 이것을 넘으면 셋째 칸부터 짓지 않는다(폭주 막기). x.capAll: 셋째 칸부터 쥔 수가 있는 동안엔 첫·두 번째 칸의 수도 같은 셈으로 이것을 넘으면 짓지 않는다. x.dropAt: 셋째 칸부터의 수가 다 지어졌는데 풀면 (지금 머리 + 다른 쥔 수들의 머리 열 + 이 수의 머리 열)이 이것을 넘으면 풀지 않고 놓는다"};
}, {}];
D["data/rules/rings.json"] = [function (module, exports, require) {
module.exports = {"desc":"고리 장부 (rules/rings, v2.22, SPEC 46장). 판에 닿지 않는다: 매 걸음 지금 상태에서 사람마다 고리(서클)의 쓰임을 읽어낸다(m.mlog.rings). 고리 수 = 서클 규칙이 켜지면 m.circles, 아니면 1. 엔진이 서클을 세는 것(날기·공기막·잔기술·버팀 벽·첫 칸·두 번째 칸)을 먼저, 보이기만 하는 것(자동 진: 서클 셋부터, 몸: 몸에 건 강화)은 남은 고리에. 한 번 앉은 고리는 그 일이 끝날 때까지 자리를 지킨다(안쪽부터). el: 원소 빛깔, look: 상태마다 그리는 모습(반지름 몫 r, 굵기 w, 점선 dash, 회전 spin 초당 바퀴), pulse: 쏜 뒤 튕겨 퍼지는 시간(s), flash: 자동 진이 막은 뒤 번쩍이는 시간(s). 빛깔·모습은 WORLD에 표가 들어오면 그대로 바꾼다 (지금은 임시)","el":{"불":"#ff7a3a","번개":"#b9a6ff","흙":"#c79a5b","물":"#4aa3ff","얼음":"#bff0ff","독":"#9bd45a","빛":"#fff3b0","신호":"#ff9ad5","없음":"#e9e4d8"},"psvEl":["","번개","흙","불"],"look":{"빈":{"c":"#8a8a8a","a":0.35,"dash":[1,4],"w":1},"짓기":{"w":2},"붙잡음":{"w":2.5,"dash":[6,3]},"잔기술":{"w":2,"r":0.55},"날기":{"c":"#ffffff","w":3,"a":0.55,"foot":1.8},"공기막":{"c":"#d9f3ff","w":1.5,"a":0.7,"dash":[3,2]},"자동 진":{"c":"#d8d1c3","w":1.5,"dash":[8,6],"spin":3},"버팀 벽":{"c":"#c79a5b","w":2},"몸":{"c":"#ffe0b0","w":1.5,"r":0.65}},"pulse":0.3,"flash":0.25,"minVis":0.15};
}, {}];
D["data/rules/saltWise.json"] = [function (module, exports, require) {
module.exports = {"cMin":5,"lobK":1.4,"reach":3,"look":0.6,"radii":[3,6,10,15,22,32,45],"dirs":12,"far":0.5,"v":2.5,"route":1,"probe":24,"saltK":1.5};
}, {}];
D["data/rules/selfSafe.json"] = [function (module, exports, require) {
module.exports = {"near":6,"cancelT":0.25};
}, {}];
D["data/rules/silver.json"] = [function (module, exports, require) {
module.exports = {"hold":0.5,"elec":1.1,"speed":1};
}, {}];
D["data/rules/snap.json"] = [function (module, exports, require) {
module.exports = {"baseG":2.5,"maxG":5,"brake":2,"chop":0.12,"flip":[0.35,0.75],"flipK":1.6,"saw":[4,-4,2],"sawK":2,"bounce":[0.45,0.7],"bounceZ":[3.5,8],"strafeV":6,"strafeD":10};
}, {}];
D["data/rules/squad.json"] = [function (module, exports, require) {
module.exports = {"desc":"전투단과 다수 대응 (rules.squad, v2.26, SPEC 49장)","ratio":1.8,"every":0.25,"teamN":4,"sep":2.094,"out":4,"spread":7,"turn":3,"rot":0.35,"sight":120,"sync":0.3,"lead":0.7,"fallback":0.3,"regroup":5,"threatT":1.5,"disc":3,"close":15,"anchor":{"tau":4,"move":15,"out":6,"cover":12,"gather":2.5,"inK":0.85,"strikeT":6,"backT":3},"w":{"bind":3,"strike":2.5,"volley":3,"off":0.8,"shield":3,"scatter":0.2},"solo":{"cMin":5,"hunt":30,"foes":3,"R":90,"enc":3.14,"move":1.5,"iso":15,"isoB":14,"bindB":8,"gunR":100,"gunN":3,"gunHold":0.6,"gunGo":1.5,"rest":{"glu":0.25,"fat":85,"back":0.6,"backFat":40,"threat":0.12,"decay":0.95,"threatT":5,"far":70,"off":0.15},"retreat":{"foes":5,"hp":0.3,"hpDry":0.5,"dry":0.25,"glu":0.1,"breaths":3,"fat":95}},"note":"ratio: 과녁 선명도가 편의 가운데 선명도의 몇 배부터 전투단인가. teamN: 조 크기의 목표(3~5). sep: 조가 둘·셋일 때 조 사이 각(rad, 120°). out: 과녁 장악 반경 밖 여유(m). spread: 조원 사이(m). turn: 번갈아 쏘는 한 조의 차례(s), rot: 옮기는 조가 차례마다 도는 각(rad). sync: 동시 체크의 창(s), lead: 일제 사격을 부른 뒤 닿기까지(s). fallback: 모인 뒤 잃은 몫이 이만큼이면 흩어졌다 regroup s 뒤 다시 모인다. threatT: 노려진 조가 물러서는 시간(s). w: 두뇌 값의 곱. solo: 개인의 다수 모드(선명도 cMin 이상, 적 foes 넘게): R 안의 적으로 포위각을 재고 enc(rad) 넘으면 가장 넓은 틈 쪽으로 move만큼, iso m 안에 동료가 없는 적·묶는 적을 먼저(거리에서 isoB·bindB m를 뺀다), gunR 안에 장전된 총이 gunN 넘으면 공격 × gunHold, 대부분 장전 중이면 × gunGo"};
}, {}];
D["data/rules/steady.json"] = [function (module, exports, require) {
module.exports = {"desc":"중간의 읽기 (rules.steady, v2.27, SPEC 51장)","cMin":2,"cMax":5,"readT":0.015,"note":"선명도 cMin 이상 cMax 아래(중간)는 적의 예비동작을 풀기 readT s 전부터만 읽는다(그 전엔 짓는 것이 보이지 않는다): 자동 진·옆걸음이 늦다"};
}, {}];
D["data/rules/stunRes.json"] = [function (module, exports, require) {
module.exports = {"desc":"굳힘 내성 (rules/stunRes, v2.21, SPEC 45장). 몸속 균의 반사: 강한 전기에 놀란 피부의 균이 서클 없이 잠깐 닫힌다. win: 굳음이 풀린 뒤(또는 굳은 동안) 이 시간(s) 안에 다시 굳으면 굳는 시간 × k[단계], 단계는 하나씩 오른다(맨 끝에서 멈춤). 굳음은 털어낼 수 없다(v2.23에 몸 털기를 거둠)","win":1,"k":[1,0.5,0.25]};
}, {}];
D["data/rules/tactics.json"] = [function (module, exports, require) {
module.exports = {"every":[2,1],"stick":0.25,"stall":[8,0.6],"learn":[3,2,1],"score":{"finish":{"eLow":2.5,"finishable":1.2,"lead":1,"eHalf":2},"press":{"base":0.6,"lead":1,"eWeak":0.8,"stronger":0.4,"tired":-0.8},"attrit":{"base":0.5,"rangeAdv":1,"behind":0.8,"eTired":0.3},"hunt":{"base":0.2,"covered":2},"herd":{"terrain":0.3,"eGround":0.2,"eBack":0.5},"fort":{"build":0.3,"hurt":0.8}},"counter":{"press":{"attrit":0.5,"fort":0.3},"attrit":{"press":0.6,"hunt":0.3},"fort":{"press":0.4,"herd":0.4}},"readVt":[2,-1],"aggr":{"finish":1.6,"press":1.25,"fort":0.8},"value":{"attritInd":1.4,"attritDir":0.7,"pressDir":1.2,"finishOff":1.5,"finishDef":0.7,"huntInd":1.3,"herd":1.6,"fortOff":0.8,"shapeAfter":1.5},"angle":{"orbit":0.5,"travel":0.02,"los":1,"losSoft":0.3,"oneSide":1,"exposed":0.5,"peek":0.6,"strip":1.5,"cut":1,"barrel":0.5,"height":0.4,"danger":1,"edge":0.5},"radial":0.4,"keep":0.3,"spiral":1,"spiralEdge":18,"circleLv":2,"force":{"hidden":2,"sky":1.6,"gate":2,"path":1.8},"shapeAfter":1.5,"forceWin":1.2,"forceMove":2};
}, {}];
D["data/rules/tune.json"] = [function (module, exports, require) {
module.exports = {"desc":"손잡이 (rules/tune, v2.19, SPEC 43장). z 크기·f 화력·v 속도의 단계(차례가 1단계·2단계·3단계·최대, 2단계가 지금 마법). 최대는 서클이 maxCirc 이상인 사람만. hide: 숨김 — cast 예비동작 ×, pow 위력 ×, heat 머리 피로 ×(1 + heat), vis 드러남 ×(흔적이 남는다, v2.20). sig: 예비동작 가운데 신호의 몫(나머지가 에너지 몫이라 × E). 판단: allow[tac.tune] 쓰는 단계(0부터), poke 견제가 쓰는 크기·화력 단계, mate 메이트가 쓰는 크기·화력 단계, hideFrom 숨김을 쓰는 tac.tune, heatW 머리가 60을 넘으면 주는 벌점, heatMax 이 머리를 넘길 조합은 쓰지 않는다, q 전설이 잘라 쓰는 값의 눈금. notice(v2.20): 드러남 v = E^(1/3)(숨기면 × hide.vis)가 1 아래면 과녁이 1 − e^(−k · v · eye[과녁의 tac.tune] · 가까움)로 알아챈다. 가까움 = near / 거리(near 안이면 1, far 아래로는 안 내려간다)","z":[0.6,1,1.6,2.5],"f":[0.5,1,2,4],"v":[0.7,1,1.4],"maxCirc":8,"hide":{"cast":1.5,"pow":0.8,"heat":0.5,"vis":0.3333},"sig":0.85,"allow":[[1],[1],[1,2],[0,1,2,3],[0,1,2,3],[0,1,2,3]],"poke":[0,1],"mate":[2,3],"hideFrom":3,"heatW":0.01,"heatMax":92,"q":0.05,"notice":{"k":3,"eye":[0.3,0.3,0.5,0.7,0.85,1],"near":10,"far":0.2}};
}, {}];
D["data/rules/unstuck.json"] = [function (module, exports, require) {
module.exports = {"eps":0.05,"edge":1.5,"every":1.5,"d":0.9,"hold":1.2,"near":3,"out":0.3,"walls":1};
}, {}];
D["data/skills.json"] = [function (module, exports, require) {
module.exports = {"roll":{"rollCap":0.85,"rollBias":[0.6,0.9]},"basic":{"readCast":true,"lead":1,"combo":true,"crowd":true,"stance":false,"lever":false,"pathTrap":false,"slotB":false,"terrain":false,"readWave":false,"cdRead":false,"outrange":false,"focusLow":false},"levels":{"초보":{"dec":0.3,"noise":0.14,"autoDodge":false,"circles":"half","from":"basic","tac":{"tune":1,"mode":1,"flySkill":1,"dodge":0.15,"rest":60,"readCast":false,"lead":0.2,"combo":false,"crowd":false,"castMove":0,"pause":[0.3,0.6],"shieldAny":true}},"중급":{"dec":0.2,"noise":0.08,"autoDodge":false,"circles":"minus1","from":"basic","tac":{"tune":2,"passive":1,"read":1,"mode":2,"breathAt":0.15,"breathSafe":true,"flySkill":2,"dodge":0.45,"rest":75}},"상급":{"dec":0.13,"noise":0.04,"autoDodge":true,"circles":"same","from":"basic","tac":{"hazard":1,"tune":3,"passive":2,"read":2,"pace":1,"trapLine":true,"engage":2,"mode":3,"breathAt":0.25,"breathSafe":true,"flySkill":3,"flyCut":1,"fortify":1,"chop":true,"footwork":2,"blueprint":1,"wallSite":true,"retreat":true,"rhythm":"mimic","buffNeed":true,"dodge":0.75,"rest":80,"stance":true,"lever":true,"pathTrap":true,"plan":true,"combo2":true,"shieldSave":true,"cancel":true,"cover":true,"tempo":true,"dodgeAim":true}},"대가":{"dec":0.08,"noise":0.02,"autoDodge":true,"circles":"same","from":"basic","tac":{"hazard":2,"tune":4,"passive":3,"read":3,"pace":2,"trapLine":true,"engage":2,"mode":4,"breathAt":0.25,"breathSafe":true,"breathPre":0.45,"flySkill":4,"flyCut":2,"survive":true,"sharp":true,"hold":true,"wallLos":0.5,"fortify":2,"breach":true,"reflex":0.1,"chop":true,"footwork":2,"blueprint":2,"ops":1,"wallSite":true,"retreat":true,"wallBreak":true,"rhythm":true,"rhythmTime":true,"domainPush":true,"efficacy":true,"buffNeed":true,"shape":true,"roles":true,"dodge":1,"rest":80,"stance":true,"lever":true,"pathTrap":true,"plan":true,"combo2":true,"shieldSave":true,"cancel":true,"cover":true,"tempo":true,"coverW":2,"herd":true,"strip":true,"lure":true,"simul":false,"cancel2":true,"bigPlan":true,"dodgeAim":true,"grab":true,"feint":false,"focusLow":true,"terrain":true,"slotB":true,"slotBOff":false,"readWave":true,"cdRead":true,"outrange":true}},"전설":{"dec":0.05,"noise":0.01,"autoDodge":true,"circles":"plus1","from":"대가","tac":{"hazard":2,"tune":5,"passive":4,"read":4,"pace":3,"mode":5,"flySkill":5,"flyCut":3,"fortify":3,"reflex":0.05,"footwork":3,"ops":2,"aim":true,"feint":0.12,"simul":true,"shieldSave":false,"learn":true,"learnAim":"wide","waveChoose":true,"counter":true,"coverW":2.5,"bait":true,"fakeRetreat":true,"triple":true,"chorusBreak":true}}}};
}, {}];
D["data/spells/order.json"] = [function (module, exports, require) {
module.exports = ["불덩이","화염 방사","소이 캡슐","폭굉 추진","불벽","숨 덫","라이트닝","체인","낙뢰","맨손 방전","다리 자극","흘리기 막","번개 지뢰","돌 창","돌 압축탄","곡사 돌","솟는 발판","석회 기둥","석회 방패","흙 꺼짐","물 망치","물 대포","물길 미끄럼","물 장막","흡수 안개","진흙 웅덩이","얼음 창","저격 창","서리 깔기","얼음 미끄럼","얼음 기둥","얼음 덫","황화수소 캡슐","암모니아 캡슐","초산 분사","유도 포자","독 장막","독 웅덩이","불고리","그을음 연막","갈래 불덩이","불 씨앗","짧은 실","번개 그물","근육 폭주","걸어둔 구름","하늘 덮개","청사진","갈래 돌","흙먼지","흙 손","큰 바위","비 뿌리기","끓는 물","안개 걸음","물 올가미","빙판","얼음 껍질","얼음 산탄","얼음 담","산 안개","마비 포자","포자 벽","독 이끼","불기둥","땅 번개","가시 솟기","발 얼리기","돌 비","공중 격추","흙 이불","얼음 절연","해독 균","바위 박차기","머스킷","도발","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥","고요한 원","곳간 터뜨리기","번개 장막","석회 고리","합창 방패","구름 걸기"];
}, {}];
D["data/spells/독.json"] = [function (module, exports, require) {
module.exports = {"황화수소 캡슐":{"n":"황화수소 캡슐","el":"독","t":"proj","m":0.2,"v":14,"R":14,"cost":4,"cast":0.35,"cd":2,"burst":{"zone":{"k":"h2s","shape":"circle","r":1.5,"d":8,"dps":9}},"role":"공격","banned":1},"암모니아 캡슐":{"n":"암모니아 캡슐","el":"독","t":"proj","m":0.2,"v":14,"R":14,"cost":3,"cast":0.35,"cd":1.8,"burst":{"zone":{"k":"nh3","shape":"circle","r":1.6,"d":5,"dps":1}},"role":"공격"},"초산 분사":{"n":"초산 분사","el":"독","t":"cone","L":3,"dur":0.4,"dps":6,"kind":"tox","blind":1.5,"cost":2,"cast":0.15,"cd":1.5,"role":"공격"},"유도 포자":{"n":"유도 포자","el":"독","t":"proj","m":0.05,"v":3.5,"R":30,"life":5,"home":1,"cost":4,"cast":0.3,"cd":4,"hit":{"flat":12,"kind":"tox","cough":2.5},"role":"공격"},"독 장막":{"n":"독 장막","el":"독","t":"zone","z":{"k":"nh3","shape":"line","len":5,"d":6,"dps":1},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"독 웅덩이":{"n":"독 웅덩이","el":"독","t":"trap","tr":{"dmg":3,"zone":{"k":"h2s","shape":"circle","r":1.4,"d":6,"dps":9},"r":1},"vis":0,"cost":4,"cast":0.3,"cd":3,"role":"함정","banned":1},"산 안개":{"n":"산 안개","el":"독","tags":["wall","ranged"],"desc":"눈을 멀게 하고 벽을 녹인다","t":"zone","z":{"k":"acid","shape":"circle","r":2.5,"d":4,"dps":2},"R":8,"cost":4,"cast":0.3,"cd":4,"role":"공격"},"마비 포자":{"n":"마비 포자","el":"독","tags":["kite","close"],"desc":"닿으면 다리가 굳는 포자","t":"proj","m":0.05,"v":5,"R":20,"life":4,"home":1,"cost":4,"cast":0.3,"cd":4,"hit":{"flat":6,"kind":"tox","root":1},"role":"공격"},"포자 벽":{"n":"포자 벽","el":"독","tags":["close"],"desc":"포자 줄. 넘으면 기침","t":"zone","z":{"k":"spore","shape":"line","len":5,"d":6,"dps":3},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"독 이끼":{"n":"독 이끼","el":"독","tags":["miss","close"],"desc":"값싼 독 함정","t":"trap","tr":{"dmg":3,"zone":{"k":"h2s","shape":"circle","r":1.2,"d":5,"dps":8},"r":0.9},"vis":0,"cost":2,"cast":0.2,"cd":1.2,"role":"함정","banned":1},"해독 균":{"n":"해독 균","el":"독","t":"buff","b":{"toxRes":0.5,"d":4},"cost":3,"cast":0.1,"cd":6,"role":"방어","desc":"해독 균막"},"균사 그물":{"n":"균사 그물","el":"독","t":"proj","m":0.1,"v":28,"R":12,"cost":3,"cast":0.3,"cd":3,"hit":{"dmg":4,"kind":"tox","mycel":2},"role":"공격","rule":"bodyBind","desc":"균사를 뭉쳐 던진다. 맞으면 2초 동안 구르지 못하고 × 0.6으로 걷는다. 불에 타면 풀린다","rad":0.4}};
}, {}];
D["data/spells/물.json"] = [function (module, exports, require) {
module.exports = {"물 망치":{"n":"물 망치","el":"물","t":"proj","m":1,"v":26,"R":16,"cost":3,"cast":0.3,"cd":1.2,"hit":{"kind":"blunt","wet":1,"cap":12},"role":"공격"},"물 대포":{"n":"물 대포","el":"물","t":"cone","L":6,"dur":0.5,"dps":5,"kind":"blunt","wet":1,"push":6,"cost":3,"cast":0.2,"cd":1.8,"role":"공격"},"물길 미끄럼":{"n":"물길 미끄럼","el":"물","t":"move","mv":"glide","dist":5,"cost":2,"cast":0.05,"cd":2,"role":"이동"},"물 장막":{"n":"물 장막","el":"물","t":"zone","z":{"k":"mist","shape":"line","len":5,"d":6},"R":4,"cost":2,"cast":0.3,"cd":4,"role":"방어"},"흡수 안개":{"n":"흡수 안개","el":"물","t":"zone","z":{"k":"absorb","shape":"circle","r":2.5,"d":5},"R":6,"cost":4,"cast":0.3,"cd":6,"role":"방어"},"진흙 웅덩이":{"n":"진흙 웅덩이","el":"물","t":"trap","tr":{"dmg":2,"root":1.2,"wet":1,"r":1},"vis":1,"cost":3,"cast":0.25,"cd":2,"role":"함정"},"비 뿌리기":{"n":"비 뿌리기","el":"물","tags":["fire","tox","spore"],"desc":"불을 끄고 독과 포자를 씻어 내리는 비","t":"zone","z":{"k":"rain","shape":"circle","r":3,"d":1},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"끓는 물":{"n":"끓는 물","el":"물","tags":["miss","weak"],"desc":"물을 끓여 쏜다. 적시지 않고 데운다","t":"proj","m":0.8,"v":24,"R":14,"cost":4,"cast":0.35,"cd":1.3,"hit":{"kind":"fire","flat":14,"burn":1.5},"role":"공격"},"안개 걸음":{"n":"안개 걸음","el":"물","tags":["ranged","elec"],"desc":"안개를 두르고 빨라진다","t":"buff","b":{"speed":0.25,"d":3,"smoke":1},"cost":2,"cast":0.1,"cd":4,"role":"이동"},"물 올가미":{"n":"물 올가미","el":"물","tags":["miss","kite"],"desc":"물줄기가 발목을 감는다","t":"area","r":1.2,"delay":0.5,"dmg":3,"root":1.2,"wet":1,"vis":0,"R":8,"cost":3,"cast":0.2,"cd":2.5,"role":"공격"},"구름 걸기":{"n":"구름 걸기","el":"물","t":"cloud","r":7,"dur":8,"R":20,"cost":6,"cast":0.8,"cd":12,"ring":8,"role":"방어","desc":"반지름 7 m의 짙은 구름과 비. 시야를 끊고 불을 끈다","rule":"chorusCast","chorusOnly":1}};
}, {}];
D["data/spells/번개.json"] = [function (module, exports, require) {
module.exports = {"라이트닝":{"n":"라이트닝","el":"번개","t":"thread","E":320,"R":12,"cost":5,"cast":0.3,"cd":1.8,"role":"공격"},"체인":{"n":"체인","el":"번개","t":"thread","E":220,"R":10,"cost":4,"cast":0.25,"cd":1.4,"role":"공격"},"낙뢰":{"n":"낙뢰","el":"번개","t":"area","r":1.6,"delay":1.3,"dmg":30,"kind":"elec","stun":1,"vis":1,"R":18,"cost":7,"cast":0.3,"cd":3,"role":"공격"},"맨손 방전":{"n":"맨손 방전","el":"번개","t":"touch","dmg":25,"stun":0.8,"cost":2,"cast":0.05,"cd":0.9,"role":"공격"},"다리 자극":{"n":"다리 자극","el":"번개","t":"buff","b":{"speed":0.4,"d":1},"cost":2,"cast":0.05,"cd":3,"role":"이동"},"흘리기 막":{"n":"흘리기 막","el":"번개","t":"buff","b":{"elecRes":0.2,"front":1,"d":0.4},"cost":2,"cast":0.03,"cd":1.4,"role":"방어","react":1},"번개 지뢰":{"n":"번개 지뢰","el":"번개","t":"trap","tr":{"dmg":14,"kind":"elec","stun":0.5,"r":0.9},"vis":0,"cost":4,"cast":0.3,"cd":2,"role":"함정"},"짧은 실":{"n":"짧은 실","el":"번개","tags":["miss","close"],"desc":"가까운 거리에서 실을 두 배로 빨리 뻗는다","t":"thread","E":300,"R":6,"fast":2,"cost":3,"cast":0.15,"cd":1,"role":"공격"},"번개 그물":{"n":"번개 그물","el":"번개","tags":["miss"],"desc":"작은 구름을 반 박자 만에","t":"area","r":1.1,"delay":0.55,"dmg":18,"kind":"elec","stun":0.8,"vis":1,"R":10,"cost":5,"cast":0.2,"cd":2.5,"role":"공격"},"근육 폭주":{"n":"근육 폭주","el":"번개","tags":["ranged","kite"],"desc":"반 초에 75% 빠르게. 붙기 위한 한 걸음","t":"buff","b":{"speed":0.75,"d":0.5},"cost":2,"cast":0.03,"cd":2.5,"role":"이동"},"걸어둔 구름":{"n":"걸어둔 구름","el":"번개","tags":["kite","ranged"],"desc":"3초 뒤 내려칠 큰 구름. 그 자리를 못 쓰게","t":"area","r":2.6,"delay":3,"dmg":26,"kind":"elec","stun":1,"vis":1,"R":16,"cost":7,"cast":0.3,"cd":5,"role":"함정","ring":6},"하늘 덮개":{"n":"하늘 덮개","el":"번개","tags":["fort"],"desc":"진지 위에 번개 구름을 깔아 둔다. 날아드는 상대를 0.5 s마다 굳혀 떨어뜨린다 (땅엔 닿지 않는다, 진지 규칙)","t":"zone","z":{"k":"sky","shape":"circle","r":5,"d":15},"R":12,"cost":6,"cast":0.5,"cd":8,"vis":1,"role":"방어","rule":"fort","ring":6},"땅 번개":{"n":"땅 번개","el":"번개","t":"area","r":0.9,"delay":0.35,"dmg":18,"kind":"elec","stun":0.6,"vis":0,"R":7,"cost":4,"cast":0.2,"cd":1.8,"role":"공격","desc":"상대 발밑 흙에 전하를 모아 두 발 사이로 흘린다"},"공중 격추":{"n":"공중 격추","el":"번개","t":"shoot","r":6,"cost":3,"cast":0.05,"cd":2,"role":"방어","desc":"날아오는 물·얼음·불·포자를 공중에서 터뜨린다. 돌은 못 떨어뜨린다"},"대낙뢰":{"n":"대낙뢰","el":"번개","t":"area","r":2.2,"delay":0.5,"dmg":60,"kind":"elec","stun":1.2,"vis":1,"R":14,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"하늘 가득 전하를 모아 한 번에 떨어뜨린다. 모으는 동안 맞으면 역류한다","ring":8},"번개 창":{"n":"번개 창","el":"번개","t":"thread","E":4000,"R":12,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"실 하나에 모든 전하를 싣는다"},"근육 경직":{"n":"근육 경직","el":"번개","t":"thread","E":120,"R":10,"cramp":2,"cost":3,"cast":0.15,"cd":3,"role":"공격","rule":"bodyBind","desc":"약한 실로 다리 근육을 굳힌다. 2초 동안 구르지 못하고 × 0.5로 걷는다. 절연이 막는다","fast":2},"번개 장막":{"n":"번개 장막","el":"번개","t":"area","sky":1,"r":3,"delay":0.8,"dmg":20,"kind":"elec","stun":1.2,"vis":1,"R":20,"cost":8,"cast":0.8,"cd":8,"ring":10,"role":"공격","desc":"하늘에 넓은 번개 그물. 나는 과녁만 묶고 떨어뜨린다(땅의 사람엔 닿지 않는다)","rule":"chorusCast","chorusOnly":1}};
}, {}];
D["data/spells/불.json"] = [function (module, exports, require) {
module.exports = {"불덩이":{"n":"불덩이","el":"불","t":"proj","m":0.3,"v":26,"R":16,"cost":4,"cast":0.35,"cd":1.4,"hit":{"dmg":10,"kind":"fire","burn":2.5,"zone":{"k":"fire","r":1,"d":2}},"role":"공격"},"화염 방사":{"n":"화염 방사","el":"불","t":"cone","L":3.6,"dur":1,"dps":22,"kind":"fire","burn":2,"cost":5,"cast":0.2,"cd":2.2,"role":"공격"},"소이 캡슐":{"n":"소이 캡슐","el":"불","t":"proj","m":0.5,"v":20,"R":14,"cost":5,"cast":0.4,"cd":1.8,"burst":{"r":1.4,"dmg":16,"kind":"fire","burn":2},"role":"공격"},"폭굉 추진":{"n":"폭굉 추진","el":"불","t":"move","mv":"dash","dist":5,"self":3,"cost":3,"cast":0.1,"cd":2,"role":"이동"},"불벽":{"n":"불벽","el":"불","t":"zone","z":{"k":"fire","shape":"line","len":4,"d":4,"dps":12},"R":7,"cost":5,"cast":0.35,"cd":3,"role":"방어"},"숨 덫":{"n":"숨 덫","el":"불","t":"trap","tr":{"dmg":18,"kind":"fire","burn":2,"r":1.3},"vis":0,"cost":4,"cast":0.3,"cd":2,"role":"함정"},"불고리":{"n":"불고리","el":"불","tags":["spore","tox","close"],"desc":"몸 둘레 3m를 한순간 태워 날아오는 포자와 독을 없앤다","t":"ring","r":3,"dmg":6,"kill":1,"cost":4,"cast":0.15,"cd":3,"role":"방어"},"그을음 연막":{"n":"그을음 연막","el":"불","tags":["ranged","blunt","elec"],"desc":"덜 탄 연기로 겨냥을 흐린다","t":"zone","z":{"k":"smoke","shape":"circle","r":2.5,"d":5},"R":4,"cost":3,"cast":0.2,"cd":5,"role":"방어"},"갈래 불덩이":{"n":"갈래 불덩이","el":"불","tags":["miss"],"desc":"불덩이를 세 갈래로","t":"proj","m":0.3,"v":18,"R":16,"multi":3,"cost":5,"cast":0.4,"cd":1.6,"hit":{"dmg":5,"kind":"fire","burn":1.5},"role":"공격"},"불 씨앗":{"n":"불 씨앗","el":"불","tags":["miss","close"],"desc":"값싼 불 함정을 여러 개","t":"trap","tr":{"dmg":14,"kind":"fire","burn":2,"r":1.2},"vis":0,"cost":2,"cast":0.2,"cd":1,"role":"함정"},"불기둥":{"n":"불기둥","el":"불","t":"area","r":1.2,"delay":0.45,"dmg":16,"kind":"fire","burn":2,"vis":0,"R":9,"cost":5,"cast":0.25,"cd":2.2,"role":"공격","desc":"상대 발밑에 메탄을 모아 솟구치게 한다. 보이지 않는다"},"화산 기둥":{"n":"화산 기둥","el":"불","t":"area","r":1.5,"delay":0.4,"dmg":55,"kind":"fire","burn":3,"vis":0,"R":9,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"발밑 깊이 메탄과 열을 모아 터뜨린다. 보이지 않는다","ring":8}};
}, {}];
D["data/spells/빛.json"] = [function (module, exports, require) {
module.exports = {"번쩍임":{"n":"번쩍임","el":"빛","t":"flash","desc":"손끝에서 만든 빛이 곧바로 닿는다. 시야가 이어진 적을 눈멀게 한다(1.5 s). 연기·안개·비·흙먼지가 가리고 연기 안경이 절반","R":70,"blind":1.5,"dmg":1,"kind":"heat","cost":4,"cast":0.4,"cd":6,"role":"공격","rule":"light"},"열선":{"n":"열선","el":"빛","t":"beam","desc":"예비동작 동안 핵이 빛나 보인다. 쏘면 곧바로 닿는 열. 거리에 따라 약해지고(반감 15 m) 연기·안개·비를 지나면 × 0.4. 유리 비단 거울이 있어야 쓴다","R":30,"dmg":28,"L":15,"kind":"heat","cost":6,"cast":0.8,"cd":3,"role":"공격","rule":"light","needGear":"mirror"}};
}, {}];
D["data/spells/신호.json"] = [function (module, exports, require) {
module.exports = {"도발":{"n":"도발","el":"신호","t":"taunt","R":10,"cost":2,"cast":0.1,"cd":4,"role":"방어","rule":"taunt","desc":"상대의 부름에 헛신호를 섞어 끊는다. 이단은 걸리지 않는다"},"고요한 원":{"n":"고요한 원","el":"신호","t":"calm","r":15,"R":12,"dur":8,"cost":8,"cast":1,"cd":20,"ring":12,"vis":1,"role":"방어","desc":"합창의 신호로 반지름 15 m의 공기를 차지한다(쥐는 동안). 그 안에선 상대의 장악권이 지워져 우리 편의 과녁 자리 마법이 선다","rule":"chorusCast","chorusOnly":1},"곳간 터뜨리기":{"n":"곳간 터뜨리기","el":"신호","t":"granary","r":12,"R":25,"cost":5,"cast":1,"cd":20,"ring":6,"role":"공격","desc":"과녁 둘레 반지름 12 m의 곳간을 먼저 터뜨려 버린다. 그가 쓸 연료가 없다(마름이 켜졌을 때)","rule":"chorusCast","chorusOnly":1}};
}, {}];
D["data/spells/얼음.json"] = [function (module, exports, require) {
module.exports = {"얼음 창":{"n":"얼음 창","el":"얼음","t":"proj","m":0.12,"v":32,"R":18,"cost":3,"cast":0.35,"cd":1.4,"hit":{"kind":"blunt","chill":2},"role":"공격"},"저격 창":{"n":"저격 창","el":"얼음","t":"proj","m":0.2,"v":60,"R":30,"cost":6,"cast":1.1,"cd":3,"lock":1,"hit":{"kind":"blunt","flat":35,"stun":0.5},"role":"공격"},"서리 깔기":{"n":"서리 깔기","el":"얼음","t":"zone","z":{"k":"ice","shape":"circle","r":1.8,"d":6,"needWet":1},"R":7,"cost":3,"cast":0.3,"cd":2.5,"role":"공격"},"얼음 미끄럼":{"n":"얼음 미끄럼","el":"얼음","t":"move","mv":"glide","dist":5,"cost":2,"cast":0.05,"cd":2,"role":"이동"},"얼음 기둥":{"n":"얼음 기둥","el":"얼음","t":"wall","hp":35,"dur":10,"r":0.6,"at":1.4,"cost":3,"cast":0.3,"cd":2.5,"role":"방어"},"얼음 덫":{"n":"얼음 덫","el":"얼음","t":"trap","tr":{"dmg":4,"chill":3,"root":1,"r":1},"vis":1,"cost":3,"cast":0.25,"cd":2,"role":"함정"},"빙판":{"n":"빙판","el":"얼음","tags":["close","kite"],"desc":"물 없이 공기의 습기로 바닥을 얼린다","t":"zone","z":{"k":"ice","shape":"circle","r":2.5,"d":6},"R":7,"cost":4,"cast":0.3,"cd":4,"role":"함정"},"얼음 껍질":{"n":"얼음 껍질","el":"얼음","tags":["blunt"],"desc":"몸을 얼음으로 덮는다","t":"buff","b":{"bluntRes":0.5,"d":2.5},"cost":3,"cast":0.1,"cd":5,"role":"방어"},"얼음 산탄":{"n":"얼음 산탄","el":"얼음","tags":["miss"],"desc":"얼음 조각 네 갈래","t":"proj","m":0.05,"v":30,"R":10,"multi":4,"cost":3,"cast":0.3,"cd":1,"hit":{"kind":"blunt","chill":1},"role":"공격"},"얼음 담":{"n":"얼음 담","el":"얼음","tags":["ranged","elec"],"desc":"기둥 셋을 잇는 담","t":"wall","hp":40,"dur":10,"r":0.6,"at":1.4,"cost":5,"cast":0.4,"cd":4,"role":"방어"},"발 얼리기":{"n":"발 얼리기","el":"얼음","t":"area","r":1,"delay":0.5,"dmg":4,"kind":"blunt","root":1.4,"chill":2,"vis":0,"R":9,"cost":3,"cast":0.2,"cd":2,"role":"공격","desc":"발밑 습기를 얼려 신발을 땅에 붙인다"},"얼음 절연":{"n":"얼음 절연","el":"얼음","t":"buff","b":{"elecRes":0.3,"d":2.5},"cost":3,"cast":0.1,"cd":5,"role":"방어","desc":"몸을 맑은 얼음으로 덮어 번개를 막는다"},"얼음 족쇄":{"n":"얼음 족쇄","el":"얼음","t":"proj","m":0.1,"v":22,"R":12,"cost":4,"cast":0.3,"cd":4,"hit":{"dmg":4,"kind":"blunt","fetter":1.5},"role":"공격","rule":"bodyBind","desc":"젖은 발목의 물을 얼려 1.5초 묶는다. 마른 적에겐 듣지 않고, 불에 녹는다"}};
}, {}];
D["data/spells/없음.json"] = [function (module, exports, require) {
module.exports = {"머스킷":{"n":"머스킷","el":"없음","t":"proj","m":0.03,"v":300,"R":60,"cost":0,"cast":0.6,"cd":18,"mundane":1,"hit":{"kind":"blunt","flat":60,"stun":0.4},"role":"공격","desc":"마법이 아닌 총. 장악권이 못 막는다"},"박격포":{"n":"박격포","el":"없음","t":"lob","flight":3,"r":2.5,"dmg":90,"kind":"blunt","R":150,"cost":0,"cast":0.5,"cd":30,"mundane":1,"wallDmg":600,"role":"공격","rule":"army","desc":"높이 쏘아 벽 너머에 떨어뜨리는 포탄. 날아가는 시간이 길어(3 s) 움직이는 과녁은 못 맞힌다. 장전 30 s. 떨어진 자리의 벽을 부순다"},"산탄":{"n":"산탄","el":"없음","t":"canister","v":250,"R":300,"cost":0,"cast":0.3,"cd":30,"mundane":1,"rad":0.05,"hit":{"kind":"blunt","flat":60},"role":"공격","rule":"artillery","desc":"청동포의 산탄: 쇠공 수십 개가 원뿔로 퍼진다(100~300 m). 공 하나는 머스킷 탄쯤(60). 포구 높이로 곧게 날아 땅과 낮게 나는 과녁만 맞힌다. 다시 채우기 수십 초, 포수가 곁에 있어야 쏜다","pierce":0.15},"둥근 탄":{"n":"둥근 탄","el":"없음","t":"proj","m":6,"v":300,"R":600,"cost":0,"cast":0.5,"cd":30,"mundane":1,"rad":0.06,"aimN":0.0006,"aimD":0.000001,"hit":{"kind":"blunt","flat":300,"stun":1},"wallDmg":800,"role":"공격","rule":"artillery","desc":"청동포의 둥근 탄: 맞으면 치명. 겨눈 곳으로 곧게 가서 움직이는 과녁은 거의 못 맞히고, 떠서라도 멈춘 과녁은 300 m에서도 맞힌다(v2.33). 벽·보루를 부순다","pierce":1},"소금 탄":{"n":"소금 탄","el":"없음","t":"saltshell","r":2,"dmg":20,"kind":"blunt","R":250,"cost":0,"cast":0.4,"cd":30,"mundane":1,"role":"공격","rule":"artillery","desc":"청동포의 소금 탄: 거리에 맞춰 날아가(0.4~2.5 s) 떨어지면 터져 반지름 몇 m에 소금 안개가 수십 초 선다. 그 안에선 마법이 서지 않고 장악권이 꺼진다"}};
}, {}];
D["data/spells/흙.json"] = [function (module, exports, require) {
module.exports = {"돌 창":{"n":"돌 창","el":"흙","t":"proj","m":0.15,"v":28,"R":20,"cost":3,"cast":0.3,"cd":1.2,"hit":{"kind":"blunt"},"role":"공격"},"돌 압축탄":{"n":"돌 압축탄","el":"흙","t":"proj","m":0.06,"v":30,"R":24,"cost":1,"cast":0.25,"cd":1,"hit":{"kind":"blunt"},"role":"공격"},"곡사 돌":{"n":"곡사 돌","el":"흙","t":"lob","flight":1.2,"r":1,"dmg":20,"kind":"blunt","R":26,"cost":3,"cast":0.35,"cd":1.2,"role":"공격"},"솟는 발판":{"n":"솟는 발판","el":"흙","t":"move","mv":"vault","dist":4,"cost":3,"cast":0.12,"cd":2.5,"role":"이동"},"석회 기둥":{"n":"석회 기둥","el":"흙","t":"wall","hp":60,"dur":20,"r":0.7,"at":1.4,"cost":5,"cast":0.4,"cd":3,"role":"방어"},"석회 방패":{"n":"석회 방패","el":"흙","t":"buff","b":{"front":1,"block":1,"d":1.6},"cost":2,"cast":0.1,"cd":0.8,"role":"방어","react":1},"흙 꺼짐":{"n":"흙 꺼짐","el":"흙","t":"trap","tr":{"dmg":8,"kind":"blunt","root":1.8,"r":1},"vis":1,"cost":3,"cast":0.35,"cd":2.5,"role":"함정"},"갈래 돌":{"n":"갈래 돌","el":"흙","tags":["miss"],"desc":"다섯 갈래 돌","t":"proj","m":0.06,"v":40,"R":9,"multi":5,"cost":3,"cast":0.3,"cd":1,"hit":{"kind":"blunt"},"role":"공격"},"흙먼지":{"n":"흙먼지","el":"흙","tags":["ranged","elec"],"desc":"먼지로 겨냥을 흐린다","t":"zone","z":{"k":"smoke","shape":"circle","r":2.5,"d":5},"R":4,"cost":2,"cast":0.2,"cd":5,"role":"방어"},"흙 손":{"n":"흙 손","el":"흙","tags":["miss","kite"],"desc":"상대 발밑 흙이 발목을 움켜쥔다","t":"area","r":1.2,"delay":0.6,"dmg":6,"kind":"blunt","root":1.6,"vis":0,"R":10,"cost":4,"cast":0.25,"cd":2.5,"role":"공격"},"큰 바위":{"n":"큰 바위","el":"흙","tags":["wall","ranged"],"desc":"20kg 바위","t":"proj","m":20,"v":22,"R":26,"cost":12,"cast":2.2,"cd":3,"hit":{"kind":"blunt","flat":70,"stun":1},"rad":0.7,"role":"공격"},"가시 솟기":{"n":"가시 솟기","el":"흙","t":"area","r":1,"delay":0.45,"dmg":12,"kind":"blunt","root":1.2,"vis":0,"R":9,"cost":4,"cast":0.25,"cd":2,"role":"공격","desc":"상대 발밑 흙을 가시로 솟게 한다"},"돌 비":{"n":"돌 비","el":"흙","t":"lob","flight":0.9,"r":1.6,"dmg":14,"kind":"blunt","R":20,"cost":4,"cast":0.3,"cd":1.4,"role":"공격","desc":"작은 돌을 높이 흩뿌려 떨어뜨린다"},"흙 이불":{"n":"흙 이불","el":"흙","t":"smother","r":3,"cost":3,"cast":0.15,"cd":3,"role":"방어","desc":"둘레에 흙을 덮어 불과 독과 포자를 끈다"},"바위 박차기":{"n":"바위 박차기","el":"흙","t":"move","mv":"dash","dist":4,"cost":2,"cast":0.05,"cd":2,"role":"이동","desc":"바위를 차고 반동으로 튄다"},"석회 굳히기":{"n":"석회 굳히기","el":"흙","t":"proj","m":0.2,"v":26,"R":12,"cost":3,"cast":0.3,"cd":3,"hit":{"dmg":5,"kind":"blunt","lime":3},"role":"공격","rule":"bodyBind","desc":"석회 반죽을 다리에 붙인다. 3초 동안 구르는 거리가 절반. 산에 녹는다","rad":0.25},"가두는 기둥":{"n":"가두는 기둥","el":"흙","t":"cage","r":3,"pr":1.4,"hp":120,"dur":2.5,"R":10,"cost":6,"cast":0.35,"cd":6,"role":"공격","rule":"bodyBind","desc":"상대 둘레 3m에 석회 기둥 넷을 한꺼번에 세운다. 솟는 발판으로 넘을 수 있다"},"흙벽":{"n":"흙벽","el":"흙","t":"build","shape":"line","nb":3,"th":0.5,"at":1.3,"mat":"earth","cost":6,"cast":0.2,"cd":4,"lock":1,"role":"방어","rule":"bulwark","desc":"발밑 흙을 끌어와 앞에 벽을 쌓는다(블록 셋, 2.4 × 1.6 × 0.5 m). 세우는 동안 선다. 속도는 출력에 비례(대마법사 초당 0.6 m³, 약 3 s). 체력이 다할 때까지 서고 총알을 막는다. 흙을 끌어온 바깥쪽에 구덩이"},"보루":{"n":"보루","el":"흙","t":"build","shape":"ring","rad":2.2,"th":0.5,"mat":"earth","cost":14,"cast":0.3,"cd":30,"lock":1,"role":"방어","rule":"bulwark","desc":"제 둘레에 사방 벽을 쌓는다(반지름 2.2 m, 블록 열일곱). 대마법사 약 18 s"},"벽 밀기":{"n":"벽 밀기","el":"흙","t":"topple","R":14,"dmg":60,"root":2,"cost":6,"cast":0.5,"cd":5,"role":"공격","rule":"bulwark","desc":"서 있는 벽 아무것이나 한 방향으로 밀어 넘어뜨려 그 너머 한 줄(2.5 m)을 덮는다: 부딪힘 60 + 묶임 2 s. 벽은 무너진다"},"조약돌":{"n":"조약돌","el":"흙","t":"proj","m":0.05,"v":40,"R":70,"cost":1,"cast":0.3,"cd":1,"hit":{"kind":"blunt"},"role":"공격","desc":"손끝에서 튕겨 멀리 던지는 조약돌(약 9). 굳은 살이 두꺼우면 튕긴다","rule":"army"},"무거운 돌":{"n":"무거운 돌","el":"흙","t":"proj","m":3,"v":32,"R":70,"cost":5,"cast":1,"cd":4,"hit":{"kind":"blunt","flat":45},"rad":0.25,"role":"공격","desc":"주먹 둘만 한 돌을 멀리 던진다(45). 굳은 살을 뚫는다","rule":"army"},"청사진":{"n":"청사진","el":"흙","tags":["fort"],"desc":"청사진 하나(반원 보루·몰이길·덫길·하늘 막기·엄폐 사다리)를 여러 칸으로 한꺼번에 짓는다. 당·피로는 구조물마다 (청사진 규칙)","t":"blueprint","cost":0,"cast":0.3,"cd":8,"role":"방어","rule":"blueprint"},"석회 고리":{"n":"석회 고리","el":"흙","t":"limering","r":3.5,"multi":18,"pr":0.55,"hp":350,"dur":12,"R":18,"cost":10,"cast":1.2,"cd":15,"ring":12,"role":"공격","desc":"과녁 둘레에 석회 담 열여덟 칸을 둘러 가둔다. 잡으려면 가둬야 한다","rule":"chorusCast","chorusOnly":1},"합창 방패":{"n":"합창 방패","el":"흙","t":"cshield","r":9,"dur":3,"cost":5,"cast":0.4,"cd":8,"ring":8,"role":"방어","desc":"앞소리꾼 둘레 9 m의 우리 편 모두에게 석회 막을 씌운다","rule":"chorusCast","chorusOnly":1}};
}, {}];
D["data/tiers.json"] = [function (module, exports, require) {
module.exports = {"병사":{"C":0.3,"circles":1,"noise":0.12,"dec":0.3,"autoDodge":false,"mast":0,"tac":{"dodge":0.2}},"평범":{"C":1,"circles":1,"noise":0.08,"dec":0.2,"autoDodge":false,"mast":0.3,"tac":{"dodge":0.4}},"중간":{"C":2.5,"circles":3,"noise":0.05,"dec":0.15,"autoDodge":false,"mast":0.6,"tac":{"dodge":0.6}},"상위":{"C":5,"circles":5,"noise":0.03,"dec":0.12,"autoDodge":true,"mast":0.8,"tac":{"dodge":0.8,"swarmR":1.8}},"대마법사":{"C":10,"circles":10,"noise":0.02,"dec":0.1,"autoDodge":true,"mast":1,"tac":{"dodge":1,"focusLow":true}}};
}, {}];
D["data/trapline.json"] = [function (module, exports, require) {
module.exports = {"desc":"덫길 (techniques/trapline, SPEC 37장): cell 덫 한 칸의 반지름(m), cellMax 한 칸에 둘 수 있는 내 덫, gap 한 사람이 덫을 놓는 사이(s), along 상대가 올 길(나와 상대 사이) 위의 자리(거리 몫), side 옆으로 비킨 거리(m), behind 상대 뒤(도망칠 길)의 거리(m)","cell":3,"cellMax":2,"gap":0.8,"along":[0.4,0.55,0.7],"side":2.5,"behind":4};
}, {}];
D["metrics/fight.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 싸움의 그림 지표 (v2.20.1, GATE-v4.md 0장·1장, SPEC 44장)
 * watch(metrics/watch.js)가 걸음마다 맨 끝에 부르고 seen이 합친다. 판에는 닿지 않는다(읽기만: 상태는 W._wf, 사람마다 Map).
 *   C7 메이트 (바꿈): 쓰러뜨린 한 방(쓰러지기 1.5 s 안에 나에게 풀린 적의 마지막 공격)이 알아채지 못한 수였거나(cast.unseen),
 *      온전히 받는 응수(막기·잔기술 빼고)가 0이고 막기·잔기술을 써도 남는 피해(× k)로 쓰러지는 수였다. 응수는 짓기 시작할 때 센다(풀 때 과녁이 굳어 있으면 다시 세어 작은 쪽, v2.22)(plan.ansSplit, v2.21: 굳은 동안은 몸 털기뿐)
 *   덫이 결정타면(v2.21) 못 본 덫이거나 몸을 못 쓰는 채(굳음·묶임·떨어짐) 밟았을 때 메이트, 보고 걸어 들어갔으면 견제
 *   B15 판을 끝낸 까닭: 시간 / 판이 끝을 강요함(줄어드는 소금 원, v2.23) / 실수(역류·폭주·내 피해·적의 굳힘 없는 추락) / 떨어뜨림(적이 떨어뜨린 추락) / 메이트 / 견제가 쌓여. 끝낸 수의 이름#손잡이
 *   B9 1 s 최대 손실 (바꿈): 그 1 s가 시작될 때 내 방어 여유(plan.slackOf)가 1 이상이던 창만, 메이트의 결정타가 든 걸음은 뺀다
 *   B7 침묵 (바꿈): 짓기(칸·뿜기)·숨·숨기(둘 사이 시야가 막힘)·자리 잡기(상대 쪽으로 3 m/s 넘게 다가가거나 멀어짐)도 행동
 *   B13 흐름: 판의 마지막 3분의 1에 잃은 체력 몫. B14 역전: 판 절반에서 체력 몫이 5%p 넘게 뒤진 쪽이 이겼나
 *   C12 하이 리스크: 큰 수(큰 한 방·손잡이 최대)를 짓다 끊기거나 역류한 몫
 *   D7 장악권: 풀린 공격 가운데 장악 몫이 반 아래였거나(흐려짐) 흩어진 몫. D8: 상대 자리의 장악 몫을 반 넘게 빼앗은 횟수
 *   E8 정보의 열매: 상대가 알아채지 못한 시전의 명중률 − 알아챈 시전의 명중률 (풀고 1.5 s 안에 그 마법의 명중이 늘었나) */
const C = require('../src/core'), PL = require('../src/brain/plan');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, SELF = { salt: 1, backfire: 1, wave: 1 };
const AD = { n: 0, g: false };
const newF = n => ({ hp: -1, tk: {}, fd: 0, ring: new Float64Array(n), ok: new Uint8Array(n), ri: 0, full: false, okNow: 1, burst: 0, lastC: null, lastCT: -9, pc: null, pb: null, info: new WeakMap(), bigs: [], bigN: 0, bigCut: 0,
  rel: [], uN: 0, uH: 0, sN: 0, sH: 0, relN: 0, weak: 0, fz: 0, fz0: -1, push0: false, pushN: 0, kill: '', killMove: '', kWhy: '', samp: [], lk: false, kH: -1, kBig: false, kBigOK: false, dOk: 0, dAll: 0, dAns: 0, dNo: 0, dUn: 0 });
const foeOf = (W, m) => { let e = null, bd = 1e9; for (const q of W.ms) { if (q.side === m.side || q.hp <= 0) continue; const d = C.hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } } return e; };
const foeDealt = (W, m) => { let x = 0; for (const q of W.ms) if (q.side !== m.side) for (const k in q.log.dealt) x += q.log.dealt[k]; return x; };
// 큰 한 방을 지금 시작할 수 있나 (v2.22 재기): 책의 큰 마법(big)이 간격이 끝났고 당이 있다
const bigReady = (W, m) => { for (const n of m.book) { const s = W.spells[n]; if (s && s.big && !(m.cd[n] > 0) && m.glu >= s.cost) return true; } return false; };
const guardK = W => { const R = C.RULES; if (W.rules.passives) { const r = R.find(x => x.name === 'passive'); return r.api.P.k; } const r = R.find(x => x.name === 'pace'); return r.api.P.guard.k; };
function step(W) {
  const A = W._wf || (W._wf = { by: new Map(), sil: 0, last: 0, samp: [], sampT: -9, n: 0, tp: [] });
  const n = Math.round(1 / W.dt);
  for (const m of W.ms) if (!A.by.has(m)) A.by.set(m, newF(n));
  // 판 전체: 체력 표본 (0.25 s마다), 침묵 (바꾼 정의)
  if (W.t - A.sampT >= 0.25) { A.sampT = W.t; const row = [W.t]; for (const m of W.ms) row.push(m.hp > 0 ? m.hp : 0); A.samp.push(row); }
  { let act = false; const live = W.ms.filter(q => q.hp > 0);
    for (const m of live) { if (m.cast || m.castB || m.chan || m.st.breath > 0) { act = true; break; } const e = foeOf(W, m); if (!e) continue; const dx = e.x - m.x, dy = e.y - m.y, d = C.hyp(dx, dy) || 1; if (Math.abs((m.vx * dx + m.vy * dy) / d) > 3) { act = true; break; } }
    if (!act && live.length === 2 && C.blocked(W, live[0].x, live[0].y, live[1].x, live[1].y, Math.max(live[0].z, live[1].z))) act = true;   // 숨기
    const g = W.t - A.last; if (act || W.ms.some(q => q.hp <= 0)) { if (g > 2) A.sil += g; A.last = W.t; } }
  const chk = W.step % (3 * W.sk) === 0, K = guardK(W);
  for (const m of W.ms) {
    const F = A.by.get(m), e = foeOf(W, m), hp = m.hp > 0 ? m.hp : 0;
    if (F.hp < 0) { F.hp = hp; F.fd = foeDealt(W, m); for (const k in m.log.taken) F.tk[k] = m.log.taken[k]; F.fz0 = m.log.fizz; for (let i = 0; i < n; i++) { F.ring[i] = hp; F.ok[i] = 1; } continue; }
    // 내 시전: 시작(응수·알아챔·큰 수), 풀림(E8·D7), 끊김(C12)
    for (let q = 0; q < 2; q++) {
      const c = q ? m.castB : m.cast, p = q ? F.pb : F.pc;
      if (c && c !== p && !c.auto && OFF[c.s.t] && e) { PL.ansSplit(W, e, m, c, AD); F.info.set(c, { n: AD.n, g: AD.g, un: !!c.unseen, mv: c.s.n + (c.tk ? '#' + c.tk : ''), h: e.hp / e.hpMax, big: !!(c.s.big || c.tf >= 4 || c.tz >= 2.5), bigOK: bigReady(W, m) }); if (c.s.big || c.tf >= 4 || c.tz >= 2.5) { F.bigs.push(c); F.bigN++; } }
      if (p && p !== c && OFF[p.s.t] && !p.auto) {
        const rel = p.t >= p.T - W.dt * 1.5, bi = F.bigs.indexOf(p); if (bi >= 0) { if (!rel) F.bigCut++; F.bigs.splice(bi, 1); }
        if (rel) { F.relN++; if (C.gAt(W, m, p.s, p.tx, p.ty) < 0.5) F.weak++; F.rel.push({ n: p.s.n, h0: m.log.hits[p.s.n] || 0, due: W.t + 1.5, un: !!p.unseen });
          const tg = p.tgt; if (tg && tg.side !== m.side) { const T = A.by.get(tg), I = F.info.get(p); if (I && tg.hp > 0 && tg.st.stun > 0) { PL.ansSplit(W, tg, m, p, AD); if (AD.n < I.n) I.n = AD.n; if (!AD.g) I.g = false; } if (T) { T.lastC = I || null; T.lastCT = W.t; } } }   // 풀 때 과녁이 굳어 있으면 다시 센다(짓는 동안 굳어 응수가 사라졌다). 굳지 않았으면 다시 세지 않는다: 실은 풀자마자 닿아 무엇이든 0이 된다 (v2.22 바로잡음)
      }
      if (q) F.pb = c; else F.pc = c;
    }
    while (F.rel.length && F.rel[0].due <= W.t) { const r = F.rel.shift(), h = (m.log.hits[r.n] || 0) > r.h0 ? 1 : 0; if (r.un) { F.uN++; F.uH += h; } else { F.sN++; F.sH += h; } }
    F.fz = m.log.fizz - F.fz0;
    // 장악권 밀어냄 (0.1 s마다): 상대 자리에서 내 몫이 반을 넘은 횟수
    if (chk && e && m.hp > 0) { const f = C.share(W, m, e.x, e.y); if (f >= 0.5 && !F.push0) F.pushN++; F.push0 = f >= 0.5; F.okNow = PL.slackOf(W, m, e) >= 1 ? 1 : 0; }
    // 받은 피해: 이 걸음의 종류별 증가, 쓰러짐의 까닭
    let tot = 0, bk = '', bv = 0; const tk = m.log.taken; for (const k in tk) { const d = tk[k] - (F.tk[k] || 0); if (d > 0) { tot += d; if (d > bv) { bv = d; bk = k; } } }
    const fd = foeDealt(W, m), foe = fd - F.fd; let mateStep = false;
    if (F.hp > 0 && hp <= 0) {
      let tp = null; for (const t of A.tp) if (t.done && t.src.side !== m.side && C.hyp(t.x - m.x, t.y - m.y) < (t.r || 1) + 0.6) { tp = t; break; }
      const wa = W._wt && W._wt.by.get(m), fallBy = !!(wa && wa.fallBy), lc = W.t - F.lastCT <= 1.5 ? F.lastC : null;
      F.kWhy = bk + (foe < tot * 0.5 ? '·내 것' : '');
      if (bk === 'fall') F.kill = fallBy ? '떨어뜨림' : '실수';
      else if (bk === 'salt') F.kill = '판이 끝을 강요함';   // 줄어드는 소금 원 (v2.23: 실수에서 뺀다)
      else if (SELF[bk] || foe < tot * 0.5) F.kill = '실수';
      else if (tp) { F.kill = !tp.seen.has(m.id) || F.lk ? '메이트' : '견제가 쌓여'; mateStep = F.kill === '메이트'; }   // 덫 (v2.21): 못 본 덫이거나 몸을 못 쓰는 채 밟았으면 메이트, 보고 걸어 들어갔으면 견제
      else if (lc && (lc.un || (lc.n === 0 && (!lc.g || tot * K >= F.hp)))) { F.kill = '메이트'; mateStep = true; }
      else F.kill = '견제가 쌓여';
      F.killMove = tp ? tp.s.n : lc ? lc.mv : ''; if (lc && !tp) { F.kH = lc.h; F.kBig = lc.big; F.kBigOK = lc.bigOK; }
    }
    // 1 s 최대 손실 (바꾼 정의): 창이 시작될 때 응수가 남아 있었던 것만, 메이트의 결정타 걸음은 뺀다
    if (foe > 0) { F.dAll += foe; if (F.okNow) F.dOk += foe; const q = W.t - F.lastCT <= 1.5 ? F.lastC : null; if (q) { if (q.un) F.dUn += foe; else if (q.n >= 1) F.dAns += foe; else F.dNo += foe; } }   // 받은 적 피해 가운데 응수가 남아 있던 때(방어 여유 1 이상)의 몫 (v2.22 재기)
    if (!mateStep) { const i0 = F.ri; if (F.ok[i0] && F.ring[i0] - hp > F.burst) F.burst = F.ring[i0] - hp; }
    F.ring[F.ri] = hp; F.ok[F.ri] = F.okNow; F.ri = (F.ri + 1) % n;
    F.hp = hp; F.fd = fd; for (const k in tk) F.tk[k] = tk[k]; F.lk = m.st.stun > 0 || m.st.root > 0 || m.fly === 2;
  }
  A.tp = W.traps.slice();   // 다음 걸음에 터진 덫을 찾는다 (터진 덫은 그 걸음에 빠진다)
}
// 판 절반·마지막 3분의 1 (체력 표본에서)
function at(A, t) { let r = A.samp[0]; for (const x of A.samp) { if (x[0] > t) break; r = x; } return r; }
function seen(W, m) {
  const A = W._wf; if (!A) return {}; const F = A.by.get(m); if (!F) return {};
  const T = W.t, last = A.samp[A.samp.length - 1], first = A.samp[0], i = W.ms.indexOf(m) + 1;
  const sum = r => { let x = 0; for (let k = 1; k < r.length; k++) x += r[k]; return x; };
  const loss = sum(first) - sum(last), late = sum(at(A, T * 2 / 3)) - sum(last);
  // 판 절반에 뒤진 편이 이겼나 (편의 체력 몫)
  const half = at(A, T / 2), side = q => { let h = 0, mx = 0; W.ms.forEach((x, k) => { if (x.side === q) { h += half[k + 1]; mx += x.hpMax; } }); return mx ? h / mx : 0; };
  const sides = [...new Set(W.ms.map(x => x.side))], r = C.result ? C.result(W) : null;
  let behind = -1; if (sides.length === 2) { const a = side(sides[0]), b = side(sides[1]); if (Math.abs(a - b) > 0.05) behind = a < b ? sides[0] : sides[1]; }
  const done = W.ms.some(q => q.hp <= 0), cause = W.ms.find(q => q.hp <= 0);
  const kc = cause ? A.by.get(cause) : null;
  return {
    '2 s 넘는 침묵 몫 (4판)': T ? (A.sil + (W.t - A.last > 2 ? W.t - A.last : 0)) / T : 0, '1 s에 잃은 가장 큰 체력 몫 (4판)': F.burst / m.hpMax,
    '쓰러진 까닭': m.hp <= 0 ? F.kill : '', '쓰러진 피해 종류': m.hp <= 0 ? F.kWhy : '', '판을 끝낸 까닭': !done ? '시간' : kc ? kc.kill : '', '판을 끝낸 수': kc ? kc.killMove : '',
    '메이트로 끝난 판 (4판)': kc && kc.kill === '메이트' ? 1 : 0, '흐름: 마지막 3분의 1에 잃은 몫': loss > 0 ? late / loss : 0,
    '판 절반에 뒤진 편이 있던 판': behind >= 0 && r && r.winner >= 0 ? 1 : 0, '역전한 판': behind >= 0 && r && r.winner >= 0 && r.winner === behind ? 1 : 0,
    '큰 수를 지은 수': F.bigN, '큰 수가 끊긴 수': F.bigCut,
    '풀린 공격': F.relN, '장악권에 흐려진 공격': F.weak, '흩어진 공격': F.fz, '장악권을 밀어낸 수': F.pushN,
    '결정타 시작 때 내 체력 몫': m.hp <= 0 ? F.kH : -1, '결정타가 큰 수': m.hp <= 0 && F.kBig ? 1 : 0, '결정타 때 큰 수를 쓸 수 있었음': m.hp <= 0 && F.kBigOK ? 1 : 0,
    '응수가 남은 채 받은 피해 몫': F.dAll ? F.dOk / F.dAll : 0, '받은 적 피해': F.dAll, '응수가 있던 수에 받은 피해 몫': F.dAll ? F.dAns / F.dAll : 0, '응수가 없던 수에 받은 피해 몫': F.dAll ? F.dNo / F.dAll : 0, '알아채지 못한 수에 받은 피해 몫': F.dAll ? F.dUn / F.dAll : 0,
    '알아채지 못한 시전': F.uN, '알아채지 못한 시전 명중': F.uH, '알아챈 시전': F.sN, '알아챈 시전 명중': F.sH,
  };
}
module.exports = { step, seen };
}, {"../src/core":"src/core.js","../src/brain/plan":"src/brain/plan/index.js"}];
D["metrics/judge.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 판단 확인 지표 (v2.16, GATE-v4.md 2장, SPEC 40장)
 * watch(metrics/watch.js)가 걸음마다 부르고 seen이 합친다. 판에는 닿지 않는다(읽기만, 사람 객체에 칸을 더하지 않는다: 상태는 W._wj).
 * 판단마다 "확인" 칸의 지표 (없던 것만, 있던 것은 watch에 있다):
 *   응수 예측 맞음: 체크를 풀 때 수읽기가 짐작한 상대의 응수(cast.pred)와 0.6 s 안의 실제 응수(방패·막기·옆 튀기·구르기·벽 차례로 먼저 쓴 것, 아무것도 안 쓰고 맞았으면 '없음', 안 맞았으면 '움직임')
 *   그물 단계별 남은 칸: 1.5 s 안에 이어 건 체크의 첫째·둘째·셋째부터에서 상대의 열린 피할 곳 수(수읽기의 줄인 상태)
 *   큰 한 방·그중 메이트, 속임수 시도·상대가 응수한 수, 미끼(속임수) 뒤 1.5 s 안의 메이트, 정석 첫 수를 상대가 받은 몫(3 s 안)
 *   판 뒤 반의 명중 − 앞 반의 명중, 구르기 빼낸 수(내가 푼 뒤 0.6 s 안에 상대가 구르거나 옆 튀기), 이어치기(내 맞힘으로 굳거나 묶인 동안 푼 수와 명중),
 *   장악권에서 밀릴 때(과녁 자리의 내 장악 몫 0.5 아래)의 던지기 시간 몫, 방식을 바꾼 뒤 1 s 안에 푼 수의 명중
 *   0.5 s 넘게 서 있던 순간(2 m/s 아래, 그중 굳음·묶임·떨어짐), 숨은 시간(상대에게서 시야가 막힘, 2 m 아래)·숨은 동안 옮긴 거리·지은 것·숨었다 나온 첫 수(기습) 명중
 *   준비 칸 시간(두 번째 칸이 찬 시간), 걸어둔 마법 명중, 메이트 순간 벽·덫이 지운 칸의 몫, 단계 전환(분당), 몰린 동안 2 s 넘는 침묵, 몸 털기 뒤 5 s 안의 위기(체력 15% 넘게 잃음)
 *   순간 켜기 성공(켠 지 0.3 s 안에 막음, rules/pace), 패시브(막기)가 막은 피해 몫, 큰 한 방 수 */
const C = require('../src/core'), { hyp } = require('../src/math'), PL = require('../src/brain/plan');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1, topple: 1 };
const BUILD = { wall: 1, build: 1, trap: 1, zone: 1, blueprint: 1 };
const newJ = () => ({ pc: null, pb: null, still: -1, stand: 0, standLock: 0, hid: false, hidT: 0, hidAt: -9, hidX: 0, hidY: 0, hidMove: 0, hidSeg: 0, hidBuild: 0, ambOpen: -9,
  pend: [], predP: [], predN: 0, predOk: 0, chkT: -9, chain: 0, netS: [0, 0, 0], netN: [0, 0, 0], bigN: 0, bigM: 0, feintN: 0, fe0: 0, feintT: -9, baitMate: 0, js0: 0, jsP: [], jsN: 0, jsAns: 0,
  early: [0, 0], late: [0, 0], draw: 0, drawP: [], comboUntil: -9, comboN: 0, comboH: 0, lowT: 0, lowThrow: 0, mode: '', modeT: -9, swN: 0, swH: 0, phase: '', phN: 0,
  lowSil: 0, lowLast: -9, castBT: 0, t: 0, ub0: 0, crisisP: [], ubN: 0, ubCrisis: 0, mateN: 0, mateTer: 0, roll0: 0, rollN: 0, stun0: 0, root0: 0, dealt0: 0, hangN: 0, hangH: 0 });
const dealtOf = m => { let x = 0; for (const k in m.log.dealt) x += m.log.dealt[k]; return x; };
function foeOf(W, m) { let e = null, bd = 1e9; for (const q of W.ms) { if (q.side === m.side || q.hp <= 0) continue; const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } } return e; }
// 방어 자원을 쓴 기록: 구르기·옆 튀기·막기 켬·앞 방패·벽
function useOf(W, q, j) { let sh = 0, wl = 0; for (const n in q.log.casts) { const s = W.spells[n]; if (!s) continue; if (s.t === 'buff' && s.b && s.b.front) sh += q.log.casts[n]; else if (s.t === 'wall' || s.t === 'build') wl += q.log.casts[n]; } return [j ? j.rollN : 0, q.flog ? q.flog.cut : 0, q.mlog.gdOn || 0, sh, wl]; }
const hitsOf = (m, n) => m.log.hits[n] || 0;
const ORD = [3, 2, 1, 0, 4];   // 먼저 본 응수의 차례 (방패·막기·옆 튀기·구르기·벽)
// 수 = 마법 × 손잡이 (v2.18): 손잡이를 돌린 시전은 m.mlog.tune['이름#단계']에 센다(손잡이 규칙이 있을 때). 나머지는 마법 이름 그대로
function movesLook(m) {
  const mv = {}; for (const n in m.log.casts) if (m.log.casts[n] > 0) mv[n] = m.log.casts[n];
  const tu = m.mlog.tune; if (tu) for (const k in tu) { const n = k.slice(0, k.indexOf('#')); if (mv[n]) mv[n] -= tu[k]; mv[k] = tu[k]; }
  const v = Object.keys(mv).map(k => mv[k]).filter(x => x > 0).sort((a, b) => b - a), t = v.reduce((a, b) => a + b, 0);
  return { '판당 수의 종류': v.length, '가장 많이 쓴 세 수의 몫': t ? (v[0] + (v[1] || 0) + (v[2] || 0)) / t : 0 };
}
function step(W) {
  const A = W._wj || (W._wj = { by: new Map(), side: null });
  const chk = W.step % (3 * W.sk) === 0;
  for (const m of W.ms) { if (!A.by.has(m)) A.by.set(m, newJ()); }
  for (const m of W.ms) {
    const j = A.by.get(m);
    if (m.roll > j.roll0 + 0.1 && !(m.cast && m.cast.s.t === 'move')) j.rollN++; j.roll0 = m.roll;
    if (m.hp <= 0) continue;
    const e = foeOf(W, m); if (!e) continue;
    j.t += W.dt; if (m.castB) j.castBT += W.dt;
    const ej = A.by.get(e);
    // 서 있기
    const v = C.hyp3(m.vx, m.vy, m.vz || 0);
    if (v < 2) { if (j.still < 0) j.still = W.t; else if (j.still !== -2 && W.t - j.still > 0.5) { j.stand++; if (m.st.stun > 0 || m.st.root > 0 || m.fly === 2) j.standLock++; j.still = -2; } } else j.still = -1;
    // 시전 시작·풀림
    const K = m._k;
    for (let q = 0; q < 2; q++) {
      const c = q ? m.castB : m.cast, p = q ? j.pb : j.pc;
      if (c && c !== p && !c.auto) {
        if (c.s.big) { j.bigN++; if (c.mate) j.bigM++; }
        if (c.feint) j.feintN++;
        if (c.mate) { j.mateN++; if (W.t - j.feintT < 1.5) j.baitMate++; const S = PL.ST.build(W, e, m, A.side || (A.side = PL.ST.newSide()), 0.5); let bl = 0, tw = 0; for (let k = 0; k < 9; k++) if (S.blk[k] > 0.05) { bl++; if (S.why[k] === 3 || S.why[k] === 4) tw++; } if (bl) j.mateTer += tw / bl; }
        if (BUILD[c.s.t] && j.hid) j.hidBuild++;
      }
      if (p && p !== c && p.t >= p.T - W.dt * 1.5 && OFF[p.s.t] && !p.auto) {
        let tag = 0; if (W.t - j.modeT < 1) tag |= 1; if (W.t < j.comboUntil) tag |= 2; if (j.hid || W.t - j.ambOpen < 0.5) { tag |= 4; j.ambOpen = -9; }
        j.pend.push({ due: W.t + 1.5, n: p.s.n, h0: hitsOf(m, p.s.n), t: W.t, tag, hang: p.s.n.indexOf('걸어둔') >= 0 || !!p.hold });
        if (ej) j.drawP.push({ due: W.t + 0.6, r: ej.rollN + (e.flog ? e.flog.cut : 0) });
        if (p.chk && ej) {
          j.chain = W.t - j.chkT < 1.5 ? j.chain + 1 : 0; j.chkT = W.t;
          const S = PL.ST.build(W, e, m, A.side || (A.side = PL.ST.newSide()), 0.5); let free = 0; for (let k = 1; k < 9; k++) if (S.blk[k] <= 0.05) free++; const ci = j.chain > 2 ? 2 : j.chain; j.netS[ci] += free; j.netN[ci]++;
          if (p.pred !== undefined) j.predP.push({ due: W.t + 0.6, pred: p.pred, u: useOf(W, e, ej), q: e, n: p.s.n, h0: hitsOf(m, p.s.n) });
        }
      }
      if (q) j.pb = c; else j.pc = c;
    }
    // 속임수에 상대가 응수했다 (끊었다)
    const fe = m.log.dec.feint || 0; if (fe > j.fe0) j.feintT = W.t; j.fe0 = fe;
    // 정석 첫 수: 상대가 3 s 안에 받았나
    if (m.mlog.jsS > j.js0) { j.jsP.push({ due: W.t + 3, a0: e.mlog.jsA }); j.js0 = m.mlog.jsS; }
    while (j.jsP.length && j.jsP[0] && j.jsP[0].due <= W.t) { const x = j.jsP.shift(); j.jsN++; if (e.mlog.jsA > x.a0) j.jsAns++; }
    // 이어치기: 내 맞힘으로 상대가 굳거나 묶였다
    const dl = dealtOf(m); if (dl > j.dealt0 + 0.1 && (e.st.stun > j.stun0 + 0.05 || e.st.root > j.root0 + 0.05)) j.comboUntil = W.t + Math.max(e.st.stun, e.st.root); j.dealt0 = dl; j.stun0 = e.st.stun; j.root0 = e.st.root;
    // 방식·단계
    if (K) { if (K.mode !== j.mode) { if (j.mode) j.modeT = W.t; j.mode = K.mode; } }
    if (m.phase !== j.phase) { if (j.phase) j.phN++; j.phase = m.phase; }
    // 몰린 동안 침묵
    if (K && K.low) { if (m.cast || m.castB || m.chan) j.lowLast = W.t; else if (W.t - j.lowLast > 2) { j.lowSil++; j.lowLast = W.t; } } else j.lowLast = W.t;
    // 몸 털기 뒤 위기
    const ub = m.log.unbind || 0; if (ub > j.ub0) { j.ubN++; j.crisisP.push({ due: W.t + 5, hp: m.hp }); } j.ub0 = ub;
    while (j.crisisP.length && (j.crisisP[0].due <= W.t || j.crisisP[0].hp - m.hp > 0.15 * m.hpMax)) { const x = j.crisisP.shift(); if (x.hp - m.hp > 0.15 * m.hpMax) j.ubCrisis++; }
    // 풀린 수의 결과
    while (j.pend.length && j.pend[0].due <= W.t) {
      const x = j.pend.shift(), hit = hitsOf(m, x.n) > x.h0;
      const half = x.t < W.t / 2 ? j.early : j.late; half[0]++; if (hit) half[1]++;
      if (x.tag & 1) { j.swN++; if (hit) j.swH++; } if (x.tag & 2) { j.comboN++; if (hit) j.comboH++; } if (x.tag & 4) { j.ambN = (j.ambN || 0) + 1; if (hit) j.ambH = (j.ambH || 0) + 1; }
      if (x.hang) { j.hangN++; if (hit) j.hangH++; }
    }
    while (j.predP.length && j.predP[0].due <= W.t) { const x = j.predP.shift(), u = useOf(W, x.q, A.by.get(x.q)); let act = -1; for (const r of ORD) if (u[r] > x.u[r]) { act = r; break; } if (act < 0) act = hitsOf(m, x.n) > x.h0 ? -1 : 6; j.predN++; if (act === x.pred) j.predOk++; }   // 응수 예측 (-1 못 막음, 6 움직임)
    while (j.drawP.length && j.drawP[0].due <= W.t) { const x = j.drawP.shift(); if (ej.rollN + (e.flog ? e.flog.cut : 0) > x.r) j.draw++; }
    if (!chk) continue;
    // 0.1 s마다: 숨기, 장악권 몫
    const hidden = m.z <= 2 && C.blocked(W, e.x, e.y, m.x, m.y, m.z > e.z ? m.z : e.z);
    if (hidden) { if (!j.hid) { j.hid = true; j.hidAt = W.t; j.hidX = m.x; j.hidY = m.y; j.hidSeg++; } j.hidT += 0.1; }
    else if (j.hid) { j.hid = false; j.hidMove += hyp(m.x - j.hidX, m.y - j.hidY); if (W.t - j.hidAt >= 1) j.ambOpen = W.t; }
    if (W.rules.domain) { const sh = C.share(W, m, e.x, e.y); if (sh < 0.5) { j.lowT += 0.1; if (K && K.mode === 'throw') j.lowThrow += 0.1; } }
  }
}
// 판이 끝난 뒤
function seen(W, m) {
  const A = W._wj; if (!A) return {}; const j = A.by.get(m); if (!j) return {};
  const e = foeOf(W, m) || W.ms.find(q => q.side !== m.side), ej = e && A.by.get(e), r = (a, b) => b ? a / b : 0, min = j.t / 60;
  const hit = h => r(h[1], h[0]), took = (() => { let x = 0; for (const k in m.log.taken) x += m.log.taken[k]; return x; })();
  return {
    '응수 예측 맞음': r(j.predOk, j.predN), '응수 예측 수': j.predN,
    '그물 1단계 남은 칸': r(j.netS[0], j.netN[0]), '그물 2단계 남은 칸': r(j.netS[1], j.netN[1]), '그물 3단계 남은 칸': r(j.netS[2], j.netN[2]),
    '큰 한 방': j.bigN, '큰 한 방 중 메이트 몫': r(j.bigM, j.bigN), '속임수 시도': j.feintN, '속임수에 상대가 응수한 몫': r(m.log.dec.feint || 0, j.feintN), '미끼 뒤 메이트': j.baitMate,
    '정석 첫 수를 상대가 받은 몫': r(j.jsAns, j.jsN), '판 뒤 반 명중 − 앞 반 명중': hit(j.late) - hit(j.early),
    '구르기 빼낸 수': j.draw, '이어친 수': j.comboN, '이어친 수 명중': r(j.comboH, j.comboN), '장악권에서 밀릴 때 던지기 몫': r(j.lowThrow, j.lowT), '방식 전환 뒤 명중': r(j.swH, j.swN),
    '0.5 s 넘게 서 있음': j.stand, '그중 굳음·묶임·떨어짐': j.standLock, '숨은 시간 몫': r(j.hidT, j.t), '숨은 뒤 옮긴 거리': r(j.hidMove, j.hidSeg), '숨은 동안 지은 것': j.hidBuild, '기습': j.ambN || 0, '기습 명중': r(j.ambH || 0, j.ambN || 0),
    '준비 칸 시간 몫': r(j.castBT, j.t), '걸어둔 마법 명중': r(j.hangH, j.hangN), '메이트 순간 벽·덫이 지운 몫': r(j.mateTer, j.mateN), '분당 단계 전환': r(j.phN, min), '몰린 동안 2 s 침묵': j.lowSil,
    '몸 털기': j.ubN, '몸 털기 뒤 위기': j.ubCrisis, '순간 켜기 성공': m.mlog.gdOk || 0, '패시브가 막은 피해 몫': r(m.mlog.guardBlk || 0, took + (m.mlog.guardBlk || 0)),
    '코너 속도 근처 시간 몫': m.flog && m.flog.t ? m.flog.corner / m.flog.t : 0, '빗나가게 한 수': m.rx ? m.rx.missJ : 0, '속도 속임': m.flog ? m.flog.feint + m.flog.hfeint : 0, '추락': m.flog ? m.flog.falls : 0, '높이 변화 (m)': m.flog ? m.flog.dz : 0,
    '한쪽 사거리 자리': m.op ? m.op.log.oneSide : 0, '엄폐 벗긴 자리': m.op ? m.op.log.strip : 0, '퇴로 자른 자리': m.op ? m.op.log.cut : 0, '강요한 수': m.op ? m.op.log.forced : 0,
    '작전 완수 몫': m.op ? (() => { let n = 0, k = 0; for (const x in m.op.log.n) n += m.op.log.n[x]; for (const x in m.op.log.ok) k += m.op.log.ok[x]; return r(k, n); })() : 0,
    '분당 지은 것': (() => { let x = 0; for (const n in m.log.casts) { const s = W.spells[n]; if (s && BUILD[s.t]) x += m.log.casts[n]; } return r(x, min); })(),
    '지어둔 것이 낸 피해 몫': (() => { let x = 0, t = 0; for (const n in m.log.dealt) { const s = W.spells[n], d = m.log.dealt[n]; t += d; if (s && (s.t === 'trap' || s.t === 'zone' || s.t === 'topple' || n.indexOf('걸어둔') >= 0)) x += d; } return r(x, t); })(),
    '판당 쓴 마법 종류': Object.keys(m.log.casts).filter(n => m.log.casts[n] > 0).length, ...movesLook(m),
    '가장 많이 쓴 세 마법의 몫': (() => { const v = Object.keys(m.log.casts).map(n => m.log.casts[n]).sort((a, b) => b - a), t = v.reduce((a, b) => a + b, 0); return t ? (v[0] + (v[1] || 0) + (v[2] || 0)) / t : 0; })(),
  };
}
module.exports = { step, seen };
}, {"../src/core":"src/core.js","../src/math":"src/math.js","../src/brain/plan":"src/brain/plan/index.js"}];
D["metrics/look.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 행동 지표 (싸우는 모습, 1.7.0, SPEC 13장)
 * 판이 끝난 사람의 기록(m.log)에서 싸우는 모습을 잰다. t = 그 사람이 싸운 시간 (s). 표준 시험 묶음(suite)의 모습 줄이 이것을 쓴다.
 * 엔진은 기록만 남기고, 지표를 셈하는 건 여기다. 새 지표는 여기에 더한다(엔진의 기록 칸은 addMage의 log 리터럴에) */
const { SPELLS } = require('../src/data');
function look(m, t) {
  const st = m.log.starts, iv = []; for (let i = 1; i < st.length; i++) iv.push(st[i] - st[i - 1]);
  const mean = iv.length ? iv.reduce((a, b) => a + b, 0) / iv.length : 0, sd = iv.length > 1 ? Math.sqrt(iv.reduce((a, b) => a + (b - mean) ** 2, 0) / (iv.length - 1)) : 0;
  const L = m.log, per = x => x / Math.max(t, 1) * 60;
  const o = {
    '분당 시전': per(st.length), '빈틈 (s)': L.gaps.length ? L.gaps.slice().sort((a, b) => a - b)[L.gaps.length >> 1] : 0, '박자 흔들림': mean ? sd / mean : 0,
    '분당 콤보': per(L.comboTry), '콤보 성공률': L.comboTry ? L.comboHit / L.comboTry : 0, '분당 동시 시전': per(L.dec.slotB),
    '분당 캔슬': per(L.cancel || 0), '분당 속임수': per(L.dec.feint || 0), '엄폐 시간 비율': t ? (L.coverT || 0) / t : 0,
    '분당 유도 성공': per(L.lure || 0), '분당 동시 착탄': per(L.simul || 0), '방어 적중률': L.defTry ? (L.defHit || 0) / L.defTry : 0,
  };
  // 비행 (v2.0, SPEC 24장): 날았거나 떨어진 사람만. 속도 흔들림 = 날 때 속도의 표준편차 / 평균
  const f = m.flog;
  if (f && (f.t > 0 || f.falls)) {
    const mv = f.t ? f.v / f.t : 0, sv = f.t ? Math.sqrt(Math.max(0, f.v2 / f.t - mv * mv)) : 0;
    o['나는 시간 비율'] = t ? f.t / t : 0; o['평균 속도 (m/s)'] = mv; o['속도 흔들림'] = mv ? sv / mv : 0; o['코너 속도 근처 비율'] = f.t ? f.corner / f.t : 0;
    o['분당 속도 속임'] = per(f.feint); o['분당 높이 변화 (m)'] = per(f.dz); o['추락'] = f.falls; o['스쳐 치기 명중률'] = f.grazeTry ? f.grazeHit / f.grazeTry : 0;
  }
  // 고수 싸움 (v2.2, SPEC 26장): 거리 흔들림(리듬), 칸마다 역할 몫, 공격의 헛손질(맞히지 못한 시전의 몫), 장악 경계, 싸우며 세운·없앤 지형
  const ml = m.mlog;
  if (ml && ml.dN > 1) {
    const mu = ml.dS / ml.dN, sd2 = Math.max(0, ml.dS2 / ml.dN - mu * mu); o['거리 흔들림'] = mu ? Math.sqrt(sd2) / mu : 0; o['평균 거리 (m)'] = mu;
    for (const sl of ['A', 'B', 'auto']) { const R = ml.role[sl]; let n = 0; for (const k in R) n += R[k]; if (!n) continue; for (const ro of ['공격', '방어', '지형']) o['칸 ' + sl + ' ' + ro] = (R[ro] || 0) / n; }
    let c = 0, h = 0; for (const n in L.casts) { const sp = SPELLS[n]; if (!sp || sp.role !== '공격') continue; c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); }
    o['헛손질 비율'] = c ? 1 - h / c : 0; o['장악 경계 틈 (m)'] = ml.gS / ml.dN; o['장악 경계 이동 (m/s)'] = ml.bMove / Math.max(t, 1); o['세운 지형'] = ml.built; o['없앤 지형'] = ml.razed;
  }
  // 날기 끊기 (v2.3, SPEC 27장): 끊은 수, 공기 쿠션과 그 실패(추락), 내려앉으며 친 명중(끊은 동안 풀린 수가 맞았다), 높이 속이기
  if (f && f.cut) { o['날기 끊은 수'] = f.cut; o['공기 쿠션'] = f.cush; o['쿠션 실패 (추락)'] = f.crash; o['내려앉으며 친 명중'] = f.dropHit; o['내려앉으며 친 명중률'] = f.dropTry ? f.dropHit / f.dropTry : 0; o['높이 속이기'] = f.hfeint; }
  // 진지 (v2.3, SPEC 27장): 지은 벽·함정·덮개, 몰이길로 든 적, 연쇄, 치운 적의 것, 진지 안·밖에서 적에게 받은 피해
  const P = m.fort;
  if (P && (P.walls || P.traps || P.sky || P.founded)) { o['지은 벽'] = P.walls; o['깐 함정'] = P.traps; o['하늘 덮개'] = P.sky; o['몰이길로 든 적'] = P.funnel; o['연쇄로 터진 함정'] = P.chain; o['치운 적의 함정·덮개'] = P.clear; o['진지 안 받은 피해'] = P.inDmg; o['진지 밖 받은 피해'] = P.outDmg; }
  // 두 겹의 두뇌·청사진 (v2.4, SPEC 28장): 반사 겹이 켜졌을 때(선명도 5 이상)
  const R = m.rx;
  if (R && (R.turns || R.rN || R.rMiss)) { o['초당 방향 전환'] = R.turns / Math.max(t, 1); o['반응 시간 (ms)'] = R.rN ? R.rS / R.rN * 1000 : 0; o['반응 못 한 몫'] = R.rN + R.rMiss ? R.rMiss / (R.rN + R.rMiss) : 0; o['흔들기'] = R.juke; o['흔든 뒤 빗나간 몫'] = R.shotJ ? R.missJ / R.shotJ : 0; o['안 흔든 뒤 빗나간 몫'] = R.shotN ? R.missN / R.shotN : 0; }
  // 작전 겹 (v2.5, SPEC 29장): 작전을 바꾼 수, 작전 완수 비율, 강요한 수와 그 뒤 상대가 길을 바꾼 몫, 고른 자리가 한쪽 사거리·엿보기·엄폐 벗기기·퇴로 자르기였던 몫
  const OL = m.op && m.op.log;
  if (OL && OL.pick) { let n = 0, ok = 0; for (const k in OL.n) { n += OL.n[k]; ok += OL.ok[k] || 0; } o['작전 바꾼 수'] = OL.pick; o['작전 완수 비율'] = n ? ok / n : 0; o['강요한 수'] = OL.forceN; o['강요 뒤 길 바꾼 몫'] = OL.forceN ? OL.forced / OL.forceN : 0; if (OL.ticks) { o['자리: 한쪽 사거리'] = OL.oneSide / OL.ticks; o['자리: 엿보기'] = OL.peek / OL.ticks; o['자리: 엄폐 벗기기'] = OL.strip / OL.ticks; o['자리: 퇴로 자르기'] = OL.cut / OL.ticks; } }
  // 날카롭게 (v2.6, SPEC 30장): 막혀서 끊은 직사 (걸음마다 보는 지표는 metrics/watch)
  if (ml && ml.losCut) o['막혀서 끊은 직사'] = ml.losCut;
  if (P && P.bpN) { o['청사진'] = P.bpN; o['청사진 한 번의 구조물'] = P.bpItems / P.bpN; o['청사진 한 번의 시간 (s)'] = P.bpT / P.bpN; }
  return o;
}
module.exports = { look };
}, {"../src/data":"src/data.js"}];
D["metrics/watch.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 걸음마다 보는 모습 지표 (v2.6, SPEC 30장)
 * look(m, t)는 판이 끝난 기록만 본다. 시간의 몫(짓는 시간·동시 칸·빈틈)과 지은 벽의 자리는 걸음마다 봐야 해서 여기서 잰다.
 * 판을 돌리는 쪽이 stepWorld 뒤마다 watch(W)를 부르고, 끝나면 seen(W, m)으로 그 사람의 지표를 받는다. 판에는 닿지 않는다(읽기만, 사람 객체에 칸을 더하지 않는다).
 *   스스로 입은 피해: 받은 피해 − 적이 준 피해. 걸음마다 체력이 준 만큼만 센다(마지막 한 방의 넘친 몫은 빼고). 추락·소금·폭주(파도·역류)·그 밖(제 폭발·지대)으로 가른다
 *   짓는 시간: 과녁이 내 가장 긴 공격 사거리 안인 동안, 칸(첫 칸·두 번째 칸·뿜기·청사진 갈래) 하나라도 짓고 있는 시간의 몫. 두 칸 이상·세 칸 이상의 몫
 *   쓸모 있는 벽: 블록 가운데 막아 냈거나(맞아 깎였다, 또는 적의 실·투사체가 풀릴 때 선을 막았다) 두 사람 사이(선 뒤 0.5 s 넘게 두 사람을 잇는 선을 갈랐다. 둘 중 하나가 2 m 넘게 떠 있으면 벽은 가리지 않는다),
 *     엄폐 각(세운 순간 내 6 m 안, 적 쪽 35° 안, 내가 땅에, 적이 2 m 아래: 높이 뜬 적에겐 벽이 가리지 않는다), 퇴로(세운 순간 적 뒤 10 m 안, 선에서 5 m 안, 적이 땅에)인 몫
 *   빈틈 찌르기: 과녁의 빈틈(굳음·묶임·꺼짐·빈손·과열)이 열린 수 가운데, 열린 동안 내 공격을 시작했거나 풀었던 몫. 맞힌 몫: 열린 동안 내 피해가 들어갔다
 *   공격 명중률: 투사체·실·구름·곡사·몸·뿜기(함정·벽 밀기 빼고)의 맞힌 수 / 쏜 수. 방패 몫: 시전 가운데 앞 방패
 *   막힌 직사: 투사체·실이 풀릴 때 과녁과 사이가 막혀 있던 몫 (시작할 때 막혀 있던 몫도)
 *   벽에 의지한 싸움 (v2.9): 제 벽 곁(벽이 6 m 안, 적 쪽 45° 안이거나 적과의 선을 가름, 둘 다 2 m 아래)에 있는 시간의 몫, 그동안 풀린 공격의 몫(벽 뒤에서 쏜 몫), 제 벽이 막은 적 공격(풀린 실·투사체의 선을 가렸다, 투사체에 깎였다)의 수와 막은 실·투사체의 피해(그 판의 그 마법 한 방 평균)
 *   당 몫 평균·당 바닥(15 g 아래) 시간 몫·머리 75 넘은 시간 몫, 숨 쓴 수·마시다 맞은 수·숨 뒤 5 s 안의 공격과 명중률 (v2.11)
 *   리듬 단계·작전의 시간 몫(m.mlog.phase, m.op.log.time), 속임수(상대가 반응해 끊은 수) (v2.9)
 *   박자 (v2.14): 평균 속도(높이까지)·초당 방향 전환(45°)·초당 하는 일·초당 맞힘·초당 교환(판 전체), 막기(rules/pace) 켠 시간 몫·켜고 끈 수·감각 조준 수. 걸음 간격은 W.dt */
const C = require('../src/core'), { hyp } = require('../src/math'), PL = require('../src/brain/plan'), JG = require('./judge'), RG = require('../src/rules/rings').api, FT = require('./fight');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1, topple: 1 }, DIRECT = { proj: 1, thread: 1 };
const newA = () => ({ t: 0, air: 0, inR: 0, busy: 0, two: 0, three: 0, opN: 0, opDid: 0, opLand: 0, opOn: false, opHit: false, opDm: 0, opL: false, dirN: 0, dirBlk: 0, relN: 0, relBlk: 0, rel: false, cov: false, atkN: 0, atkCov: 0, covT: 0, lowT: 0, blk: 0, blkN: 0, eR: -1, openT: 0, cutT: 0, thrX: 0, thrXHit: 0, hd0: 0, hpR: null, hpI: 0, spd: 0, hx: 0, hy: 0, turn: 0, act: 0, roll0: 0, rx0: 0, cut0: 0, gd0: 0, hit0: -1, hitT: -1, hitN: 0, tc: null, tb: null, tch: null, rollN: 0, chkR: 0, chkS: 0, dry: 0, hadRes: false, resN: -1, inNet: false, esc: 0, lastAns: -1, lastAnsT: -9, burst: 0, trapN: 0, trapHit: 0, gluS: 0, gluLow: 0, hot75: 0, h0: new Map(), pend: [], md: {}, mh: {}, mdmg: {}, lastMode: 'none', dm0: -1, covS: 0, bait: 0, baitHit: 0, pc: null, pb: null, R: -1, W: [], hp: -1, tk: {}, fd: 0, took: 0, foe: 0, by: { fall: 0, salt: 0, wave: 0, fallFoe: 0 }, foeT: -9, st0: 0, fly0: 0, fallBy: false, killBy: '', killFall: false });
const foeDealt = (W, m) => { let x = 0; for (const q of W.ms) if (q.side !== m.side) for (const k in q.log.dealt) x += q.log.dealt[k]; return x; };
// 받은 피해 (걸음마다, 남은 체력까지만: 마지막 한 방의 넘친 몫은 세지 않는다). 그 걸음의 기록 증가를 종류·적으로 나눠 체력이 준 만큼 줄여 담는다
const DROP_T = 2;   // 떨어뜨려 준 피해: 적의 맞힘·굳힘 뒤 이만큼 안에 시작된 추락 (v2.18)
function hurtStep(W, m, a) {
  const hp = m.hp > 0 ? m.hp : 0; if (a.hp < 0) { a.hp = hp; a.fd = foeDealt(W, m); for (const k in m.log.taken) a.tk[k] = m.log.taken[k]; return; }
  const dh = a.hp - hp; let tot = 0; const tk = m.log.taken; for (const k in tk) tot += tk[k] - (a.tk[k] || 0);
  const fd = foeDealt(W, m), foe = fd - a.fd;
  // 떨어뜨려 준 피해 (v2.18): 적의 맞힘(피해)·굳힘 뒤 dropT s 안에 시작된 추락은 적이 준 것으로. 추락의 시작 = 날던 사람이 떨어지기·끊어 내려오기로 바뀐 때
  if (foe > 1e-9 || (m.st.stun > a.st0 + 1e-9 && m.fly !== 0)) a.foeT = W.t;
  if (a.fly0 === 1 && (m.fly === 2 || m.fly === 3)) a.fallBy = a.foeT > -9 && W.t - a.foeT <= DROP_T;   // 추락이 시작될 때 정한다 (떨어지는 동안의 맞힘은 보지 않는다)
  a.st0 = m.st.stun; a.fly0 = m.fly;
  const byFoe = a.fallBy;
  if (dh > 1e-9 && tot > 1e-9 && a.hp > 0 && hp <= 0) { let bk = '', bv = 0; for (const k in tk) { const d = tk[k] - (a.tk[k] || 0); if (d > bv) { bv = d; bk = k; } } a.killBy = bk; a.killFall = bk === 'fall' && byFoe; }   // 결정타의 종류
  if (dh > 1e-9 && tot > 1e-9) { const f = Math.min(1, dh / tot); if (byFoe && (tk.fall || 0) > (a.tk.fall || 0)) a.by.fallFoe += ((tk.fall || 0) - (a.tk.fall || 0)) * f; a.took += tot * f; a.foe += Math.min(foe, tot) * f; for (const k of ['fall', 'salt', 'wave']) a.by[k] += (tk[k] || 0) - (a.tk[k] || 0) > 0 ? ((tk[k] || 0) - (a.tk[k] || 0)) * f : 0; a.by.wave += (tk.backfire || 0) - (a.tk.backfire || 0) > 0 ? ((tk.backfire || 0) - (a.tk.backfire || 0)) * f : 0; }
  a.hp = hp; a.fd = fd; for (const k in tk) a.tk[k] = tk[k];
}
const dealtOf = m => { let x = 0; for (const k in m.log.dealt) x += m.log.dealt[k]; return x; };
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((cx - x1) * dx + (cy - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t; return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
const weak = (W, e) => e.st.stun > 0 || e.st.root > 0 || e.crash > 0 || e.emptyT > W.t || (e.fat > 92 && !e.wave);
function foeOf(W, m) { let e = null, bd = 1e9; for (const q of W.ms) { if (q.side === m.side || q.hp <= 0) continue; const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } } return e; }
// 직사가 맞힌 수 (벽을 가로지른 실이 맞았나를 보려고)
const dirHits = (W, m) => { let h = 0; for (const n in m.log.hits) { const s = W.spells[n]; if (s && DIRECT[s.t]) h += m.log.hits[n]; } return h; };
// 직사(실·곧게 나는 투사체)의 가장 긴 사거리
function dirR(W, m) { let r = 0; for (const n of m.book) { const s = W.spells[n]; if (!s || !DIRECT[s.t] || s.home) continue; const R = C.rangeOf(m, s); if (R > r) r = R; } return r; }
function maxR(W, m) { let r = 0; for (const n of m.book) { const s = W.spells[n]; if (!s || !OFF[s.t]) continue; const R = s.t === 'touch' ? 1.3 : s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.home ? 12 : C.rangeOf(m, s); if (R > r) r = R; } return r; }
// 벽 하나를 세운 순간의 자리: 2 엄폐 각(내 6 m 안, 적 쪽 35° 안, 내가 땅에) · 4 퇴로(적 뒤 10 m 안, 선에서 5 m 안, 적이 땅에). 1 두 사람 사이는 선 뒤 걸음마다 본다
function wallKind(m, e, w) {
  const dx = e.x - m.x, dy = e.y - m.y, L2 = dx * dx + dy * dy || 1, L = Math.sqrt(L2), t = ((w.x - m.x) * dx + (w.y - m.y) * dy) / L2, lat = Math.abs((w.x - m.x) * dy - (w.y - m.y) * dx) / L;
  let k = 0;
  const wm = hyp(w.x - m.x, w.y - m.y); if (m.z < 2 && e.z <= 2 && wm < 6 && wm > 0.1 && ((w.x - m.x) * dx + (w.y - m.y) * dy) / (wm * L) > 0.819) k |= 2;
  if (e.z < 2 && t > 1 && hyp(w.x - e.x, w.y - e.y) < 10 && lat < 5) k |= 4;
  return k;
}
// 박자 (v2.14, SPEC 38장): 빠르기(높이까지), 방향 전환(0.1 s마다 3 m/s 넘게 움직이는 쪽이 지난 방향에서 45° 넘게 돌았다), 하는 일(스스로 시작한 칸·뿜기, 구르기, 공중 피하기, 날기 끊기, 막기 켜고 끄기),
// 맞힌 수(마법의 명중이 는 걸음, 같은 사람의 0.2 s 안은 하나로: 판 전체의 합이 교환)
function tempo(W, m, a) {
  const v = C.hyp3(m.vx, m.vy, m.vz || 0); a.spd += v * W.dt;
  if (W.step % (3 * W.sk) === 0) { const h = hyp(m.vx, m.vy); if (h > 3) { const ux = m.vx / h, uy = m.vy / h; if (a.hx === 0 && a.hy === 0) { a.hx = ux; a.hy = uy; } else if (ux * a.hx + uy * a.hy < 0.707) { a.turn++; a.hx = ux; a.hy = uy; } } }
  let n = 0; if (m.cast && m.cast !== a.tc && !m.cast.auto) n++; if (m.castB && m.castB !== a.tb && !m.castB.auto) n++; if (m.chan && m.chan !== a.tch) n++; a.tc = m.cast; a.tb = m.castB; a.tch = m.chan;
  if (m.roll > a.roll0 + 0.1 && !(m.cast && m.cast.s.t === 'move')) { n++; a.rollN++; } a.roll0 = m.roll;
  if (m.rx) { if (m.z >= 1 && m.rx.dodge > a.rx0) n += m.rx.dodge - a.rx0; a.rx0 = m.rx.dodge; }
  if (m.flog) { if (m.flog.cut > a.cut0) n += m.flog.cut - a.cut0; a.cut0 = m.flog.cut; }
  const gd = m.mlog.guardN || 0; if (gd > a.gd0) n += gd - a.gd0; a.gd0 = gd; a.act += n;
  let hs = 0; for (const k in m.log.hits) hs += m.log.hits[k]; if (a.hit0 >= 0 && hs > a.hit0 && W.t - a.hitT >= 0.2) { a.hitN++; a.hitT = W.t; } a.hit0 = hs;
}
function watch(W) {
  JG.step(W);   // 판단 확인 지표 (v2.16, metrics/judge)
  const A = W._wt || (W._wt = { by: new Map(), wall: new Map(), lastAct: 0, sil: 0, silMax: 0, low: -1, trap: new Map(), ans: new WeakMap(), chkP: [] });
  while (A.chkP.length && A.chkP[0].t <= W.t) { const x = A.chkP.shift(); if (useN(W, x.q) > x.u) x.a.chkS++; }
  // 침묵 (v2.13): 아무도 짓지(칸·뿜기) 않는 동안. 2 s 넘는 침묵의 길이를 더하고 가장 긴 것을 적는다. 체력 30% 아래로 처음 떨어진 때
  { let act = false; for (const m of W.ms) if (m.hp > 0 && (m.cast || m.castB || m.chan)) { act = true; break; } const g = W.t - A.lastAct; if (act || W.ms.some(q => q.hp <= 0)) { if (g > 2) A.sil += g; if (g > A.silMax) A.silMax = g; A.lastAct = W.t; }
    if (A.low < 0) for (const m of W.ms) if (m.hp > 0 && m.hp < 0.3 * m.hpMax) { A.low = W.t; break; } }
  // 덫 (v2.13): 놓인 덫이 밟혀 터졌나(t.done) 걷혔나
  for (const t of W.traps) if (!A.trap.has(t)) A.trap.set(t, t);
  if (W.step % (15 * W.sk) === 0) for (const [t] of A.trap) if (!W.traps.includes(t)) { const a = A.by.get(t.src); if (a) { a.trapN++; if (t.done) a.trapHit++; } A.trap.delete(t); }
  for (const m of W.ms) {
    let a = A.by.get(m); if (!a) { a = newA(); A.by.set(m, a); }
    if (a.hp !== 0) hurtStep(W, m, a);
    { const r = a.hpR || (a.hpR = new Array(Math.round(1 / W.dt)).fill(m.hpMax)), h = m.hp > 0 ? m.hp : 0, old = r[a.hpI]; if (old - h > a.burst) a.burst = old - h; r[a.hpI] = h; a.hpI = (a.hpI + 1) % r.length; }   // 1 s 안에 잃은 가장 큰 체력 (v2.13)
    if (m.hp <= 0) continue;
    const e = foeOf(W, m); if (!e) continue;
    if (a.R < 0) a.R = maxR(W, m);
    a.t += W.dt; if (m.z >= 1) a.air += W.dt; a.gluS += m.glu / m.gluMax * W.dt; if (m.glu < 15) a.gluLow += W.dt; if (m.fat > 75) a.hot75 += W.dt;   // 당·머리 (v2.11)
    tempo(W, m, a);
    const d = hyp(e.x - m.x, e.y - m.y);
    // 칸: 첫 칸·두 번째 칸·뿜기·청사진 갈래
    let n = (m.cast ? 1 : 0) + (m.castB ? 1 : 0) + (m.chan ? 1 : 0); const bp = m.cast && m.cast.bp; if (bp && bp.lanes > 1) n += Math.max(0, Math.min(bp.lanes, bp.items.length - bp.built) - 1);   // 청사진은 첫 칸 하나에 갈래 여럿
    if (d < a.R) { a.inR += W.dt; if (n >= 1) a.busy += W.dt; if (n >= 2) a.two += W.dt; if (n >= 3) a.three += W.dt; }
    // 새로 시작한 수 (첫 칸·두 번째 칸)와 풀린 수
    let started = false, released = false;
    for (let j = 0; j < 2; j++) {
      const c = j ? m.castB : m.cast, p = j ? a.pb : a.pc;
      if (c && c !== p && OFF[c.s.t]) a.h0.set(c, m.log.hits[c.s.n] || 0);   // 시작할 때의 명중 수 (방식별 명중, v2.12)
      if (c && c !== p && OFF[c.s.t] && !c.auto && c.tgt === e && e.C >= 5) A.ans.set(c, PL.ansOf(W, e, m, c));   // 수읽기 (v2.15): 짓기 시작할 때 상대의 응수 수
      if (c && c !== p && OFF[c.s.t] && !c.auto) { started = true; if (DIRECT[c.s.t]) { a.dirN++; if (C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z)) a.dirBlk++; } }
      if (p && p !== c && OFF[p.s.t] && p.t >= p.T - W.dt * 1.5) { released = true; if (DIRECT[p.s.t] && !p.auto) { a.relN++; if ((m.z > e.z ? m.z : e.z) <= 2) for (const w of W.walls) if (w.mk === e.id && segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r)) { const o = A.by.get(e); if (o) { o.thrX++; if (dirHits(W, m) > a.hd0) o.thrXHit++; } break; } if (C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z)) { a.relBlk++; if ((m.z > e.z ? m.z : e.z) <= 2) for (const w of W.walls) { const r = A.wall.get(w); if (r && segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r)) { r.hit = true; if (r.m.side !== m.side) { const o = A.by.get(r.m), n = p.s.n, h = m.log.hits[n] || 0; o.blkN++; o.blk += h ? (m.log.dealt[n] || 0) / h : 0; } break; } } } } }   // 벽이 풀린 직사를 막았다
      if (p && p !== c && OFF[p.s.t] && p.t >= p.T - W.dt * 1.5) { a.lastMode = p.mode || (p.auto ? 'auto' : 'none'); if (p.mode) a.pend.push({ md: p.mode, n: p.s.n, h0: a.h0.get(p) || 0, t: W.t + 1.5, cov: p.cov, bait: !!p.bait }); }   // 풀린 수: 1.5 s 뒤 맞았나
      if (p && p !== c && p.t >= p.T - W.dt * 1.5 && OFF[p.s.t]) { const x = A.ans.get(p); if (x !== undefined && p.tgt) { const o = A.by.get(p.tgt); if (o) { o.lastAns = x; o.lastAnsT = W.t; } } if (p.chk && p.tgt) { a.chkR++; A.chkP.push({ t: W.t + 0.6, a, q: p.tgt, u: useN(W, p.tgt) }); } }   // 체크에 자원을 썼나 (0.6 s 뒤 본다)
      if (j) a.pb = c; else a.pc = c;
    }
    a.hd0 = dirHits(W, m);
    { const dm = dealtOf(m); if (a.dm0 >= 0 && dm > a.dm0) a.mdmg[a.lastMode] = (a.mdmg[a.lastMode] || 0) + dm - a.dm0; a.dm0 = dm; }   // 피해는 가장 최근에 풀린 수의 방식으로 (v2.12)
    while (a.pend.length && a.pend[0].t <= W.t) { const q = a.pend.shift(), hit = (m.log.hits[q.n] || 0) > q.h0; a.md[q.md] = (a.md[q.md] || 0) + 1; if (hit) a.mh[q.md] = (a.mh[q.md] || 0) + 1; if (q.md === 'cover') { a.covS += q.cov || 0; if (q.bait) { a.bait++; if (hit) a.baitHit++; } } }
    a.rel = released; a.cov = false; if (m.z < 2 && e.z <= 2) a.lowT += W.dt; if (released) a.atkN++;
    // 빈틈 찌르기
    const wk = weak(W, e);
    if (wk && !a.opOn) { a.opOn = true; a.opHit = false; a.opL = false; a.opDm = dealtOf(m); a.opN++; }
    if (a.opOn && (started || released) && !a.opHit) { a.opHit = true; a.opDid++; }
    if (a.opOn && !a.opL && dealtOf(m) > a.opDm + 0.5) { a.opL = true; a.opLand++; }
    if (!wk) a.opOn = false;
  }
  // 수읽기 (v2.15, 0.1 s마다): 방어 자원이 바닥난 순간(지금 쓸 수 있는 자원이 0이 됨), 그물(방어 여유 net.low 이하)에서 빠져나감(net.free 이상으로)
  if (W.step % (3 * W.sk) === 0) for (const [m, a] of A.by) {
    if (m.hp <= 0 || m.C < 5) continue; const e = foeOf(W, m); if (!e) continue;
    const S = PL.ST.build(W, m, e, A.side || (A.side = PL.ST.newSide()), 0.5); let r = 0; for (let i = 0; i < 6; i++) if (S.has & (1 << i)) { a.hadRes = true; if (S.av[i] <= 0.05) r++; }
    if (a.hadRes && r === 0 && a.resN > 0) a.dry++; a.resN = r;
    const sl = PL.ST.slack(S, 0.3); if (sl <= PL.ST.P.net.low) a.inNet = true; else if (a.inNet && sl >= PL.ST.P.net.free) { a.inNet = false; a.esc++; }
  }
  // 새 벽 (세운 사람이 적힌 것), 서 있는 벽이 두 사람 사이를 가르는 시간 (0.1 s마다, 높이를 넣어: 2 m 넘게 떠 있으면 벽은 가리지 않는다)
  const chk = W.step % (3 * W.sk) === 0;
  for (const w of W.walls) {
    let r = A.wall.get(w);
    if (r === undefined) {
      r = null; if (w.mk != null && w.mk >= 0) { const m = W.ms.find(q => q.id === w.mk), a = m && A.by.get(m), e = m && foeOf(W, m); if (a && e) { r = { m, k: wallKind(m, e, w), cut: 0, w, hp: w.hp, last: w.hp, hit: false }; a.W.push(r); } }
      A.wall.set(w, r);
    }
    if (r && !r.hit && w.hp < r.hp - 1e-9) r.hit = true;   // 맞아 깎였다: 투사체를 막아 냈다
    if (r && w.hp < r.last) { A.by.get(r.m).blkN++; r.last = w.hp; }   // 맞아 깎였다 (v2.9)
    if (r && r.m.hp > 0) { const a = A.by.get(r.m); if (!a.cov) { const m = r.m, e = foeOf(W, m); if (e && m.z < 2 && e.z <= 2) { const dx = e.x - m.x, dy = e.y - m.y, L = hyp(dx, dy) || 1, wx = w.x - m.x, wy = w.y - m.y, wm = hyp(wx, wy); if ((wm < 6 + w.r && wm > 0.1 && (wx * dx + wy * dy) / (wm * L) > 0.707) || segCircle(m.x, m.y, e.x, e.y, w.x, w.y, w.r + 0.2)) a.cov = true; } } }   // 제 벽 곁 (v2.9)
    if (!r || !chk || r.m.hp <= 0) continue;
    const e = foeOf(W, r.m); if (e && (r.m.z > e.z ? r.m.z : e.z) <= 2 && segCircle(r.m.x, r.m.y, e.x, e.y, w.x, w.y, w.r + 0.2)) r.cut += 0.1;
  }
  for (const [m, a] of A.by) if (a.cov && m.hp > 0) { a.covT += W.dt; if (a.rel) a.atkCov++; }   // 제 벽 곁의 시간·쏜 수 (v2.9)
  // 벽이 없었다면 맞았을 피해 (v2.10): 0.1 s마다, 적의 직사(실·투사체) 사거리 안에서 선이 트인 시간과 제 벽이 선을 가른(바위는 아니고) 시간을 잰다
  if (chk) for (const [m, a] of A.by) {
    if (m.hp <= 0) continue; const e = foeOf(W, m); if (!e) continue; if (a.eR < 0) a.eR = dirR(W, e); const d = hyp(e.x - m.x, e.y - m.y); if (d > a.eR) continue;
    const z = m.z > e.z ? m.z : e.z; if (!C.blocked(W, e.x, e.y, m.x, m.y, z)) { a.openT += 0.1; continue; }
    if (z > 2) continue; let rock = false; for (const o of W.obs) if (segCircle(e.x, e.y, m.x, m.y, o.x, o.y, o.r)) { rock = true; break; } if (rock) continue;
    for (const w of W.walls) if (w.mk === m.id && segCircle(e.x, e.y, m.x, m.y, w.x, w.y, w.r)) { a.cutT += 0.1; break; }
  }
  FT.step(W);   // 싸움의 그림 지표 (v2.20.1, GATE 4판, metrics/fight)
}
// 공격(투사체·실·구름·곡사·몸·뿜기, 함정·벽 밀기 빼고)의 명중률: 맞힌 수 / 쏜 수 (여럿으로 갈리는 마법도 한 번에 하나까지)
function atkHit(W, m) { const L = m.log; let c = 0, h = 0; for (const n in L.casts) { const s = W.spells[n]; if (!s || !OFF[s.t] || s.t === 'topple') continue; c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); } return c ? h / c : 0; }
// 시전 가운데 앞 방패(석회 방패 같은 몸의 막기)의 몫
function shieldShare(W, m) { const L = m.log; let c = 0, b = 0; for (const n in L.casts) { c += L.casts[n]; const s = W.spells[n]; if (s && s.t === 'buff' && s.b && s.b.front) b += L.casts[n]; } return c ? b / c : 0; }
// 벽이 없었다면 맞았을 피해 (v2.10): 적의 직사가 나에게 준 피해 / 선이 트인 시간 × 제 벽이 선을 가른 시간
function cf(W, m, a) { let dd = 0; for (const q of W.ms) if (q.side !== m.side) for (const n in q.log.dealt) { const s = W.spells[n]; if (s && DIRECT[s.t] && !s.home) dd += q.log.dealt[n]; } return a.openT > 0.5 ? dd / a.openT * a.cutT : 0; }
// 공격 방식 (v2.12): 방식별 시간·피해 몫, 확정타·덮기의 수와 명중(풀고 1.5 s 안에 그 마법의 명중이 늘었나), 갈 곳 덮은 비율, 구르기 빼낸 뒤 덮기, 큰 수의 확정 순간 몫
const MODES = { poke: '견제', sure: '확정타', cover: '덮기', big: '큰 한 방', throw: '던지기', repeat: '반복', none: '없음' };
function modeLook(m, a) {
  const o = {}, M = m.mlog.mode; if (!M) return o; let tt = 0, td = 0; for (const k in M.t) tt += M.t[k]; for (const k in a.mdmg) td += a.mdmg[k];
  for (const k in MODES) { o['방식 시간: ' + MODES[k]] = tt ? (M.t[k] || 0) / tt : 0; o['방식 피해: ' + MODES[k]] = td ? (a.mdmg[k] || 0) / td : 0; }
  o['확정타'] = a.md.sure || 0; o['확정타 명중률'] = a.md.sure ? (a.mh.sure || 0) / a.md.sure : 0;
  o['덮기'] = a.md.cover || 0; o['덮기 명중률'] = a.md.cover ? (a.mh.cover || 0) / a.md.cover : 0; o['덮기 갈 곳 덮은 비율'] = a.md.cover ? a.covS / a.md.cover : 0;
  o['견제'] = a.md.poke || 0; o['견제 명중률'] = a.md.poke ? (a.mh.poke || 0) / a.md.poke : 0;
  o['구르기 빼낸 뒤 덮기'] = a.bait; o['그중 맞힘'] = a.baitHit; o['큰 수의 확정 순간 몫'] = M.bigN ? M.bigSure / M.bigN : 0;
  return o;
}
// 침묵·결판 뒤·덫 (v2.13): 판 전체의 값(두 사람이 같다). 판이 끝날 때의 침묵도 넣는다. 덫은 판이 끝날 때 남은 것도 놓인 수에 (밟히지 않았다)
function silence(W, m, a) {
  const A = W._wt; if (!A) return {}; const g = W.t - A.lastAct, sil = A.sil + (g > 2 ? g : 0), mx = Math.max(A.silMax, g); let left = 0; for (const [t] of A.trap) if (t.src === m) left++;
  return { '1 s에 잃은 가장 큰 체력 몫': a.burst / m.hpMax, '2 s 넘는 침묵 몫': W.t ? sil / W.t : 0, '가장 긴 침묵 (s)': mx, '30% 아래 뒤 끝까지 (s)': A.low >= 0 && W.ms.some(q => q.hp <= 0) ? W.t - A.low : 0, '30% 아래로 떨어진 판': A.low >= 0 ? 1 : 0, '놓은 덫': a.trapN + left, '덫이 밟힌 몫': a.trapN + left ? a.trapHit / (a.trapN + left) : 0 };
}
// 방어 자원을 쓴 수 (수읽기 지표): 구르기·날기 끊기·막기 켜고 끔·앞 방패·벽
function useN(W, q) { const a = W._wt.by.get(q); let x = (a ? a.rollN : 0) + (q.flog ? q.flog.cut : 0) + (q.mlog.guardN || 0); for (const n in q.log.casts) { const s = W.spells[n]; if (s && ((s.t === 'buff' && s.b && s.b.front) || s.t === 'wall' || s.t === 'build')) x += q.log.casts[n]; } return x; }
// 상대(다른 편)의 자원이 바닥난 순간 수
function foeDry(W, m) { let x = 0; if (W._wt) for (const [q, a] of W._wt.by) if (q.side !== m.side) x += a.dry; return x; }
// 메이트로 끝났나: 쓰러진 사람이 마지막 공격(쓰러지기 1.5 s 안에 풀린 것)을 받을 때 응수가 0이었나
function mated(W) { const A = W._wt; if (!A) return 0; for (const [m, a] of A.by) if (m.hp <= 0 && m.deathT != null && a.lastAns === 0 && m.deathT - a.lastAnsT < 1.5) return 1; return 0; }
// 교환 (v2.14): 판 전체에서 맞힌 수의 합 (두 사람이 같다)
function exch(W) { let x = 0; if (W._wt) for (const [, a] of W._wt.by) x += a.hitN; return x; }
// 판이 끝난 뒤: 그 사람의 지표
function seen(W, m) {
  const a = (W._wt && W._wt.by.get(m)) || newA(), L = m.log, took = a.took, foe = a.foe;
  let nw = 0, use = 0, bt = 0, cv = 0, rt = 0; let hb = 0; for (const r of a.W) { nw++; const k = r.k | (r.cut >= 0.5 ? 1 : 0) | (r.hit ? 8 : 0); if (k & 1) bt++; if (k & 2) cv++; if (k & 4) rt++; if (k & 8) hb++; if (k) use++; }   // 사이: 선 뒤 0.5 s 넘게 두 사람 사이를 갈랐다
  const fall = a.by.fall, salt = a.by.salt, wave = a.by.wave, self = Math.max(0, took - foe), other = Math.max(0, self - fall - salt - wave);
  const ph = m.mlog.phase, op = Object.assign({}, m.op && m.op.log && m.op.log.time); if (m.op && m.op.cur && m.op.st) op[m.op.cur] = (op[m.op.cur] || 0) + W.t - m.op.t0;   // 판이 끝날 때 하던 작전도 (끝내기는 대개 판 끝까지 간다)
  let pt = 0, ot = 0; for (const k in ph) pt += ph[k]; for (const k in op) ot += op[k];
  const o = {
    '받은 피해': took, '스스로 입은 몫': took ? self / took : 0, '실수로 입은 몫': took ? Math.max(0, self - a.by.fallFoe) / took : 0, '떨어뜨려 준 몫': took ? a.by.fallFoe / took : 0, '쓰러짐': m.hp <= 0 ? 1 : 0, '추락으로 쓰러짐': m.hp <= 0 && a.killFall ? 1 : 0, '추락 몫': took ? fall / took : 0, '소금 몫': took ? salt / took : 0, '폭주 몫': took ? wave / took : 0, '제 폭발 몫': took ? other / took : 0,
    '나는 시간 몫': a.t ? a.air / a.t : 0, '사거리 안 짓는 몫': a.inR ? a.busy / a.inR : 0, '사거리 안 두 칸 몫': a.inR ? a.two / a.inR : 0, '사거리 안 세 칸 몫': a.inR ? a.three / a.inR : 0,
    '세운 벽': nw, '쓸모 있는 벽 몫': nw ? use / nw : 0, '두 사람 사이 벽': bt, '엄폐 각 벽': cv, '퇴로 벽': rt, '막아 낸 벽': hb,
    '쓰러뜨림으로 끝남': W.ms.some(q => q.hp <= 0) ? 1 : 0, '판 길이 (s)': W.t, '공격 시전': L.dec.atk, '공격 명중률': atkHit(W, m), '방패 몫': shieldShare(W, m),
    '빈틈': a.opN, '빈틈 찌른 몫': a.opN ? a.opDid / a.opN : 0, '빈틈에 맞힌 몫': a.opN ? a.opLand / a.opN : 0, '폭주': L.over, '막힌 직사 몫': a.relN ? a.relBlk / a.relN : 0, '막힌 채 시작한 직사 몫': a.dirN ? a.dirBlk / a.dirN : 0,
    '짓지 않는 몫': a.inR ? 1 - a.busy / a.inR : 0, '떠보기 몫': pt ? (ph.probe || 0) / pt : 0, '들어가기 몫': pt ? (ph.in || 0) / pt : 0, '빠지기 몫': pt ? (ph.out || 0) / pt : 0,
    '압박 몫': ot ? (op.press || 0) / ot : 0, '끝내기 몫': ot ? (op.finish || 0) / ot : 0, '소모 몫': ot ? (op.attrit || 0) / ot : 0, '몰이 몫': ot ? (op.herd || 0) / ot : 0, '진지 몫': ot ? (op.fort || 0) / ot : 0, '속임수': L.dec.feint || 0,
    '제 벽 곁 몫': a.lowT ? a.covT / a.lowT : 0, '벽 뒤에서 쏜 몫': a.atkN ? a.atkCov / a.atkN : 0, '벽이 막은 적 공격': a.blkN, '벽이 막은 피해': a.blk, '벽이 없었다면 맞았을 피해': cf(W, m, a), '당 몫 평균': a.t ? a.gluS / a.t : 0, '당 바닥 시간 몫': a.t ? a.gluLow / a.t : 0, '머리 75 넘은 시간 몫': a.t ? a.hot75 / a.t : 0, '숨': m.mlog.breath || 0, '숨 마시다 맞은 수': m.mlog.breathHit || 0, '숨 뒤 공격': m.mlog.breathAtk || 0, '숨 뒤 명중률': m.mlog.breathAtk ? m.mlog.breathAtkHit / m.mlog.breathAtk : 0, ...modeLook(m, a), ...silence(W, m, a), '평균 속도 (m/s)': a.t ? a.spd / a.t : 0, '초당 방향 전환': a.t ? a.turn / a.t : 0, '초당 하는 일': a.t ? a.act / a.t : 0, '초당 맞힘': a.t ? a.hitN / a.t : 0, '초당 교환': W.t ? exch(W) / W.t : 0, '막기 켠 시간 몫': a.t ? (m.mlog.guardT || 0) / a.t : 0, '분당 체크': a.t ? (m.mlog.chk || 0) / a.t * 60 : 0, '체크에 자원을 쓴 몫': a.chkR ? a.chkS / a.chkR : 0, '상대 자원 바닥': foeDry(W, m), '자원 바닥': a.dry, '그물에서 빠져나감': a.esc, '메이트로 끝난 판': mated(W), '메이트 수 (읽음)': m.mlog.mate || 0, '정석 둠': m.mlog.jsS || 0, '정석 끝까지': m.mlog.jsF || 0, '정석 받음': m.mlog.jsA || 0, '읽은 마디 (판단당)': m.mlog.plN ? m.mlog.plNodes / m.mlog.plN : 0, '막기': m.mlog.guardN || 0, '감각 조준': m.mlog.trackN || 0, ...JG.seen(W, m), ...FT.seen(W, m), ...RG.seen(m), '벽을 가로지른 적 직사': a.thrX, '그중 맞은 몫': a.thrX ? a.thrXHit / a.thrX : 0,
  };
  return o;
}
// 마법별 시전·명중·준 피해 (명중은 시전보다 많을 수 없다: 갈래 돌 같은 여럿은 1로)
function spells(m) { const L = m.log, o = {}; let dm = 0; for (const n in L.dealt) dm += L.dealt[n]; for (const n in L.casts) o[n] = { casts: L.casts[n], hit: Math.min(1, (L.hits[n] || 0) / L.casts[n]), dmgShare: dm ? (L.dealt[n] || 0) / dm : 0 }; return o; }
module.exports = { watch, seen, spells, weak };
}, {"../src/core":"src/core.js","../src/math":"src/math.js","../src/brain/plan":"src/brain/plan/index.js","./judge":"metrics/judge.js","../src/rules/rings":"src/rules/rings.js","./fight":"metrics/fight.js"}];
D["src/brain/choose.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 4: 고르기 (반사·캔슬·칸·휴식, 마법의 값, 시전 걸기)
 * 차례: 규칙의 반사(react: 자동 진)와 캔슬(cancel) → 기술의 캔슬·속임수 → 칸 → 휴식(rest 훅) → 박자·동시 착탄 기다리기 → 준비(prep 훅) → 마법마다 값 → 고르기.
 * 마법 하나의 값은 틀마다 매긴 뒤(규칙의 새 틀은 brainTypes) 정해진 차례로 고친다: value 훅 → 콤보 → valueRisk 훅 → 동시 착탄 → 걷어내기 → 몰이 → 미끼 →
 * 학습 → 덱 읽기 → 돌파 → valueMid 훅 → 뭉친 곳 → (내 둘레 지연 폭발은 버림) → 피로 → valueLate 훅 → 두 번째 칸 → 몰아치기.
 * 값을 매기는 동안의 것은 사람마다 하나인 후보 틀 K.o에 담는다(새로 만들지 않는다). 쓸 만하면 후보 모음(K.pool)에 옮긴다 */
const { C, hyp, NOKIND, NONE, OFF, SELF_GAP, isSetup, logDec, estDmg, castTime, landDelay, bigAttack, defenseDown, circOf } = require('./util');
const { types } = require('./hooks');
const combo = require('./techniques/combo'), cancel = require('./techniques/cancel'), feint = require('./techniques/feint'), simul = require('./techniques/simul');
const tempo = require('./techniques/tempo'), bait = require('./techniques/bait'), learn = require('./techniques/learn'), counter = require('./techniques/counter');
const cover = require('./techniques/cover'), herd = require('./techniques/herd'), crowd = require('./techniques/crowd');
const swarm = require('./techniques/swarm'), siege = require('./techniques/siege');
const rhythm = require('./techniques/rhythm'), efficacy = require('./techniques/efficacy'), shape = require('./techniques/shape'), survive = require('./techniques/survive'), hazard = require('./techniques/hazard'), sharp = require('./techniques/sharp'), mode = require('./techniques/mode'), engage = require('./techniques/engage'), trapline = require('./techniques/trapline'), PL = require('./plan');

function decide(W, m, K) {
  const { S, T, rest, e, De, d, eDown, aimed, threat } = K, bh = W._bh;
  let empty = false; for (let i = 0; i < bh.empty.length; i++) if (bh.empty[i](W, m, K)) empty = true;   // 빈손 (rules/risk): 첫 칸과 자동 진을 못 쓴다 (두 번째 칸은 쓸 수 있다)
  const circ = circOf(W, m);
  if (empty && !(T.grab && circ >= 2 && !m.castB)) { m.relT = null; return; }
  // 방패 아끼기 (상급): 큰 공격에만 막는다. 앞 방패·벽은 투사체·실만 막는다
  const bigThreat = !!threat && (!T.shieldSave || (bigAttack(threat, S) && (threat.s.t === 'proj' || threat.s.t === 'thread')));
  K.empty = empty; K.circ = circ; K.bigThreat = bigThreat;
  let h = bh.react; for (let i = 0; i < h.length; i++) h[i](W, m, K);    // 자동 진 (rules/multiSlot)
  h = bh.cancel; for (let i = 0; i < h.length; i++) h[i](W, m, K);       // 짝에 맞춰 모으던 큰 수 (rules/risk)
  cancel.opportunity(W, m, K);   // 기회 캔슬 (대가)
  cancel.onDodge(W, m, K);       // 캔슬 (상급)
  if (T.sharp) sharp.losCancel(W, m, K);   // 막힌 직사 끊기 (대가, v2.6)
  combo.drop(W, m, K);           // 묶기가 빗나갔다: 계획을 버린다
  feint.react(W, m, K);          // 속임수 (전설)

  // ---- 칸 고르기 ----
  let slot = 'A';
  if (m.cast || m.chan) { if (circ >= 2 && !m.castB && T.slotB) slot = 'B'; else slot = ''; }   // 두 번째 칸은 대가부터 (기본은 씀)
  h = bh.slot; for (let i = 0; i < h.length; i++) slot = h[i](W, m, K, slot);   // 고리 장부 3단계: 빈 고리만큼 더 짓는다(셋째 칸부터 'X', rules/ringLedger, v2.37)
  if (!slot) return;
  if (empty && slot !== 'X') slot = 'B';
  K.slot = slot;

  // ---- 휴식: 머리가 뜨거우면 위협이 없을 때 쉰다. 규칙이 고친다(파도의 부류, rules/wave) ----
  // 방어 간격 세기 (대가): 과녁의 방어 마법이 모두 간격 중이면(자동 진도) 칠 때다. 쉬지 않고, 공격 가치 × 1.4
  const defDown = T.cdRead && defenseDown(e, S, W);
  const push = T.sharp && sharp.push(W, m, K); K.push = push;   // 몰아칠 때: 작전 압박·끝내기, 과녁의 빈틈 (대가, v2.7)
  if (push) K.pressB = true;
  let restNow = W.rules.fatigue && m.fat > rest && !aimed && d > 4 && !defDown && !push;
  h = bh.rest; for (let i = 0; i < h.length; i++) restNow = h[i](W, m, K, restNow);
  if (T.survive && !restNow) restNow = survive.rest(W, m, K);   // 고르지 않은 파도에서 내려온다 (v2.6)
  if (restNow) { m.log.dec.rest++; m.relT = null; return; }

  if (tempo.pause(W, m)) return;       // 쏜 뒤 멈춤 (초보)
  if (simul.wait(W, m, K)) return;     // 동시 착탄 (대가): 묶기가 결정타 직전에 떨어지게 기다린다
  if (tempo.hold(W, m, K)) return;     // 박자 흔들기 (상급)
  K.defDown = defDown; K.plan = combo.planOf(W, m, K);   // 두 수 콤보 계획 (상급)
  if (T.mode) mode.pick(W, m, K);   // 공격 방식: 견제·확정타·덮기·큰 한 방·던지기 (v2.12)
  if (T.read) PL.read(W, m, K);   // 수읽기: 첫 수 (v2.15)
  // ---- 마법 고르기 ----
  K.lead = T.lead; K.cb = T.combo; K.down0 = K.cb && eDown;
  K.ek = T.counter ? De.kinds : NOKIND;
  learn.prep(W, m, K);
  efficacy.prep(W, m, K);   // 마법마다의 효과 (대가부터, v2.2)
  K.bigs = NONE; K.ctOf = null; K.pinNow = false; K.holds = NONE; K.pinBy = 0;
  h = bh.prep; for (let i = 0; i < h.length; i++) h[i](W, m, K);   // 몸 묶기 계획 (rules/control)
  // 후보 객체는 사람마다 모아 두고 다시 쓴다(쓰레기 줄이기). 이번 판단 밖으로 나가지 않는다
  const cand = m._cand || (m._cand = []), pool = m._pool || (m._pool = []); cand.length = 0;
  K.cand = cand; K.pool = pool;
  const Dm = K.Dm; for (let bi = 0; bi < Dm.sp.length; bi++) valueSpell(W, m, K, bi);
  commit(W, m, K);
}
// 틀마다 값과 겨냥
function valueForm(W, m, K, o) {
  const { T, e, Dm, d } = K, s = o.s, Tw = o.Tw, R = o.R, he = o.he, down = o.down;
  let v = 0, tx = e.x, ty = e.y;
  switch (s.t) {
    case 'proj': if (d < (s.home ? 12 : R) && (K.los || s.home)) { const tof = d / s.v; tx = e.x + e.vx * (Tw + tof) * 0.8 * K.lead; ty = e.y + e.vy * (Tw + tof) * 0.8 * K.lead; v = he * estDmg(s) * (down ? 1.6 : 1) / (Tw + 0.3); } break;
    case 'lob': if (d < R) { tx = e.x + e.vx * s.flight * 0.7 * K.lead; ty = e.y + e.vy * s.flight * 0.7 * K.lead; v = he * s.dmg * (down ? 2 : 1) / (Tw + 0.3) + (K.los ? 0 : 0.3); } break;
    case 'thread': if (d < R && K.los) { const tt = Tw + d / (32 * (s.fast || 1)); tx = e.x + e.vx * tt * 0.6 * K.lead; ty = e.y + e.vy * tt * 0.6 * K.lead; v = he * estDmg(s) * (K.cb && e.st.wet > 0 ? 1.5 : 1) * (down ? 1.8 : 1) / (tt + 0.3); } break;
    case 'area': if (d < R) { tx = e.x + e.vx * s.delay * 0.5 * K.lead; ty = e.y + e.vy * s.delay * 0.5 * K.lead; v = he * s.dmg * (down ? 2 : 1) / (Tw + s.delay * 0.3 + 0.3); } break;
    case 'touch': if (d < 1.3) v = 1.5 * s.dmg / (Tw + 0.3); break;
    case 'cone': if (d < s.L * C.sizeOf(m, s)) v = he * s.dps * s.dur / (Tw + 0.3) * (K.cb && s.wet && !(e.st.wet > 0) && Dm.threadTouch ? 1.5 : 1); break;
    case 'zone': {
      const k = s.z.k;
      if ((k === 'fire' || k === 'nh3' || k === 'spore') && d < 9) { v = (K.vt > 1.2 ? 0.55 : 0.2) + T.zoneBias; tx = (m.x + e.x) / 2; ty = (m.y + e.y) / 2; }
      if (k === 'smoke') { if (K.aimed) v = 0.6 + T.zoneBias; tx = m.x + K.ux; ty = m.y + K.uy; }
      if ((k === 'mist' || k === 'absorb') && d < 7 && K.De.fireThread) { v = 0.4 + T.zoneBias; tx = m.x + K.ux * 2; ty = m.y + K.uy * 2; }
      if (k === 'ice' && d < 8) v = (K.vt > 1.2 ? 0.6 : 0.3) + T.zoneBias;
      if (k === 'acid' && d < R) v = 0.35 + (W.walls.some(w => w.own !== m.side && hyp(w.x - e.x, w.y - e.y) < 3) ? 0.6 : 0) + T.zoneBias;
      if (k === 'rain') { const need = m.st.burn > 0 || K.blindR || W.proj.some(p => p.src.side !== m.side && (p.home || p.s.n === '불덩이') && hyp(p.x - m.x, p.y - m.y) < 4) || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3.5); v = need ? 1.1 : 0; tx = m.x; ty = m.y; }
      break;
    }
    case 'wall':
      if (K.aimed && K.threat && K.bigThreat && (K.threat.s.t === 'proj' || K.threat.s.t === 'thread') && Tw < K.threat.T - K.threat.t) v = 1.0;
      else if (K.los && d > 6 && !W.walls.some(w => w.own === m.side && hyp(w.x - m.x, w.y - m.y) < 3)) v = 0.3;
      if (K.stance === 'kite' && d < 9) v = Math.max(v, 0.7);
      break;
    case 'buff':
      if (s.react && K.aimed && K.threat && K.bigThreat && K.threat.T - K.threat.t < 0.35) v = 1.1;
      if (T.shieldAny && (s.react || s.b.front) && !m.buf.front) v = Math.max(v, 0.35);   // 초보: 방패는 아무 때나
      if (s.b.bluntRes && !m.buf.bluntRes && K.De.bluntHit) v = 0.35;
      if (s.b.elecRes && !s.react && K.aimed && !m.buf.elecRes) v = 1.0;
      if (s.b.toxRes && !m.buf.toxRes && W.zones.some(z => z.src.side !== m.side && ['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3)) v = 0.9;
      if (s.b.speed && !m.buf.speed && (d > K.prefR + 4 || K.dodge || K.stance === 'breakout')) v = K.stance === 'breakout' ? 1.3 : 0.45;
      break;
    case 'move':
      if (K.stance === 'breakout') { v = 1.6; tx = m.x + K.escape.dir.dx * 6; ty = m.y + K.escape.dir.dy * 6; }
      else if (d > K.prefR + 5) v = 0.45;
      if (s.mv === 'glide' && K.aimed && m.rollCd > 0) { v = 0.8; const sg = W.rng() < 0.5 ? 1 : -1; tx = m.x - K.uy * 5 * sg; ty = m.y + K.ux * 5 * sg; }
      if (s.mv === 'vault' && !K.los && W.obs.some(b => hyp(b.x - m.x, b.y - m.y) < 2.5)) v = Math.max(v, 0.45);
      break;
    case 'trap':
      if (W.traps.filter(t => t.src === m).length < C.trapCap(W, m)) { v = 0.15 + T.trapBias; if (T.pathTrap && K.vt > 1.2 && d < 10) { v += 0.35; tx = e.x + e.vx; ty = e.y + e.vy; } else { tx = m.x + K.ux * 2; ty = m.y + K.uy * 2; } }
      break;
    case 'ring': if (W.proj.some(p => p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < 3.5)) v = 1.2; else if (d < 2.5) v = 0.5; if (m.st.mycel > 0.5) v = Math.max(v, 0.9); break;   // 제 몸의 균사를 태운다
    case 'shoot': { const n2 = W.proj.filter(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r).length; v = n2 ? 0.9 + n2 * 0.2 : 0; break; }
    case 'smother': { const need = m.st.burn > 0 || K.blindR || W.zones.some(z => z.src.side !== m.side && ['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < 3) || W.proj.some(p => p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < 3); v = need ? 1.1 : 0; break; }
    default: { const f = types()[s.t]; if (f) { f(W, m, K, o); v = o.v; } }   // 규칙 모듈의 틀 (도발…)
  }
  o.v = v; o.tx = tx; o.ty = ty;
}
// 돌파 중이면 길을 막은 자를 친다
function breakout(W, m, K, o) { const s = o.s; if (K.escape && K.escape.bl.length && o.isOff) { const b = K.escape.bl[0], db = hyp(b.x - m.x, b.y - m.y); if (db < (o.R || 10) && (s.t !== 'thread' || !C.blocked(W, m.x, m.y, b.x, b.y))) { o.tx = b.x; o.ty = b.y; o.v = Math.max(o.v, 0.8) * 1.8; } } }
// 틀마다 매긴 값을 고치는 차례. 사람마다 한 번 만든다(성향 tac은 판 중에 바뀌지 않는다): 꺼진 기술은 부르지 않는다(속도).
// 기술은 제 스위치가 꺼져 있으면 아무것도 안 하니, 빼도 결과는 같다
function pipeOf(W, m) {
  const T = m.tac, bh = W._bh, P = [];
  P.push(...bh.value);                    // 몸 묶기 (rules/control)
  if (T.combo2) P.push(combo.value);      // 두 수 콤보 계획
  P.push(...bh.valueRisk);                // 큰 수·짝 묶기·피할 자리 겨냥·붙잡기 (rules/risk)
  if (T.simul) P.push(simul.value);       // 동시 착탄
  if (T.strip) P.push(cover.strip);       // 엄폐 걷어내기 (대가)
  if (T.herd) P.push(herd.value);         // 몰이 (대가)
  if (T.bait) P.push(bait.value);         // 방어 미끼 (전설)
  if (T.learn) P.push(learn.value);       // 학습한 구르는 쪽·방패 거리 (전설)
  if (T.counter) P.push(counter.value);   // 덱 읽기 (전설)
  P.push(breakout);                       // 돌파 중이면 길을 막은 자를 친다
  P.push(...bh.valueMid);                 // 지렛대: 적이 화약통 옆에 섰다 (rules/barrels)
  if (T.crowd) P.push(crowd.value);       // 여럿이 뭉친 곳
  if (T.swarm) P.push(swarm.value);       // 무리: 눈먼 틈의 무거운 수, 벽 뒤엔 곡사 (v2.0 둘째)
  if (T.siege) P.push(siege.value);       // 성: 벽 세우기·벽 밀기·벽 없애기 (v2.0 둘째)
  if (T.rhythm) P.push(rhythm.value);     // 리듬: 떠보기엔 가볍게, 빠지기엔 방어 (v2.2)
  if (T.efficacy || T.buffNeed) P.push(efficacy.value);   // 효과 학습(대가), 강화의 때(상급) (v2.2)
  if (T.shape || T.roles) P.push(shape.value);   // 지형 설계·칸의 역할 (대가, v2.2)
  if (T.sharp) P.push(sharp.value);       // 날카롭게: 빈틈·나는 과녁·벽과 방패 (대가, v2.6)
  if (T.survive) P.push(survive.value);   // 스스로 죽지 않기: 풀 때 머리가 넘칠 마법은 버린다 (v2.6)
  if (T.mode) P.push(mode.value);         // 공격 방식 안에서 고르기 (v2.12)
  if (T.engage) P.push(engage.value);     // 숨은 상대를 쫓아 들춘다 (v2.13)
  if (T.trapLine) P.push(trapline.value); // 덫은 길에, 한 칸에 둘까지, 0.8 s에 하나 (v2.13)
  if (T.read) P.push(PL.value);         // 수읽기의 첫 수·큰 한 방은 메이트에만·깨기·정석 (v2.15)
  if (T.hazard) P.push(hazard.value);   // 터질 때 내가 안에 있을 지역 마법은 버린다 (v2.21)
  return P;
}
// 마법 하나의 값. 쓸 만하면 후보에 넣는다
function valueSpell(W, m, K, bi) {
  const { T, e, Dm, d, slot } = K, bh = W._bh;   // 드물게 쓰는 값은 쓸 때 K에서 읽는다
  const n = Dm.nm[bi], s = Dm.sp[bi], mastN = Dm.mast[bi], isOff = Dm.off[bi];
  if (slot === 'B' && (s.t === 'cone' || s.t === 'move' || (m.cast && m.cast.s.n === n) || (isOff && !T.slotBOff && !K.pressB && !(T.hold && m.C >= 5 && W.rules.hold)))) return;   // slotBOff가 꺼지면 두 번째 칸엔 공격을 겹치지 않는다(묶기·준비 수는 된다, v2.0)
  if ((m.cd[n] || 0) > 0) return;
  const cost = s.cost * (1 - 0.25 * mastN) * (slot === 'B' ? 1.3 : 1); if (m.glu < cost) return;
  const Tw = s.cast * (1 - 0.35 * mastN);
  const o = K.o;
  o.s = s; o.n = n; o.bi = bi; o.isOff = isOff; o.cost = cost; o.he = Dm.he[bi]; o.Tw = Tw; o.R = Dm.R[bi]; o.v = 0; o.tx = e.x; o.ty = e.y; o.barrel = false; o.pin = false; o.wait = false;
  // 콤보의 때 (상급): 남은 묶임 안에 닿는 마법만 묶인 적 보정을 받는다. 중급은 보이는 대로 잇는다
  o.down = K.down0 && (!T.combo2 || Math.max(e.st.root || 0, e.st.stun || 0) > Tw + landDelay(s, d));
  valueForm(W, m, K, o);
  const P = K.pipe || (K.pipe = pipeOf(W, m)); for (let i = 0; i < P.length; i++) P[i](W, m, K, o);   // 값 고치기: 규칙의 훅과 켜진 기술 (pipeOf의 차례)
  // 지연 폭발은 쏜 사람도 맞힌다: 떨어질 자리가 내 둘레면 쓰지 않는다 (v1.0.1)
  if (s.t === 'area' && hyp(o.tx - m.x, o.ty - m.y) < s.r * C.sizeOf(m, s) + SELF_GAP) return;
  if (W.rules.fatigue && !s.react && !m.wave && !K.push) o.v -= m.fat / 100 * T.fatPen;   // 피로 벌점 (v2.6부터 판단 수준의 값). 몰아칠 때는 없다 (v2.7)
  const h = bh.valueLate; for (let i = 0; i < h.length; i++) h[i](W, m, K, o);        // 파도 위에선 막기보다 친다 (rules/wave)
  if (slot === 'B') o.v -= 0.1;
  if (isOff) o.v *= K.aggr * (K.defDown ? 1.4 : 1);
  const v = o.v;
  if (v > T.valMin) { const tx = o.tx, ty = o.ty, barrel = o.barrel, down = o.down, pin = o.pin; let c = K.pool[K.cand.length]; if (!c) c = K.pool[K.cand.length] = { s, n, v, tx, ty, Tw, cost, barrel, down, pin, v2: undefined }; else { c.s = s; c.n = n; c.v = v; c.tx = tx; c.ty = ty; c.Tw = Tw; c.cost = cost; c.barrel = barrel; c.down = down; c.pin = pin; c.v2 = undefined; } K.cand.push(c); }
}
// 후보 중 고르고 시전을 건다
function commit(W, m, K) {
  const { T, e, d, vt, eDown, aimed, slot, cand } = K;
  if (!cand.length) { m.relT = null; return; }   // 쏠 게 없으면 빈틈이 아니다
  // 가치 내림차순. 짧은 배열이라 삽입 정렬(안정 정렬이라 Array.sort와 같은 차례, 비교 함수를 만들지 않는다)
  for (let i = 1; i < cand.length; i++) { const x = cand[i]; let j = i - 1; while (j >= 0 && cand[j].v < x.v) { cand[j + 1] = cand[j]; j--; } cand[j + 1] = x; }
  // 장악권은 비싸니 상위 넷만 따진다
  let best = null;
  for (let i = 0; i < Math.min(4, cand.length); i++) {
    const c = cand[i]; let v = c.v;
    if (W.rules.domain && !c.barrel && !c.s.mundane) v *= C.gAt(W, m, c.s, c.tx, c.ty);
    if (!best || v > best.v2) { best = c; best.v2 = v; }
  }
  if (!best || best.v2 <= T.valMin) { m.relT = null; return; }
  if (slot === 'B' && T.plan && best.v2 < T.slotBMin * (T.sharp && m.C >= 5 ? 0.4 : 1)) return;   // 날카롭게(대가부터, v2.7): 두 번째 칸 문턱 × 0.4   // 기술이 있는 사람은 두 번째 칸을 값진 수에만 쓴다 (문턱은 판단 수준마다, v2.0)
  K.best = best;
  bait.start(W, m, K);                    // 방어 미끼 시작 (전설)
  simul.start(W, m, K);                   // 동시 착탄 시작 (대가)
  const fe = feint.start(W, m, K);        // 속임수 시작 (전설)
  best = K.best;
  const s = best.s;
  let Tc = castTime(W, m, best.Tw);
  if (s.t === 'thread') Tc += Math.min(hyp(best.tx - m.x, best.ty - m.y), C.rangeOf(m, s)) / (32 * (s.fast || 1));
  const ns = m.noise * hyp(best.tx - m.x, best.ty - m.y) * (m.st.blind > 0 ? 3 : 1);
  m.glu -= best.cost; m.cd[best.n] = s.cd;
  const plan = K.plan, cast = { s, tgt: e, tx: best.tx + W.rnd(-ns, ns), ty: best.ty + W.rnd(-ns, ns), t: 0, T: Tc, B: slot === 'B', feint: fe, cost: best.cost, bait: m.baitT === W.t, roll0: e.roll > 0, down: !!(best.down || best.pin), fin: plan && s.n === plan.fin ? plan.land + 0.1 : 0, tz: 1, tf: 1, tv: 1, hid: false, unseen: false, tk: '', vis: 1 };
  if (slot === 'B') m.castB = cast; else if (slot !== 'X') m.cast = cast;   // 'X'는 규칙의 commit 훅이 쥔다
  // 행동 지표: 시작 시각, 빈틈, 콤보 시도
  m.log.starts.push(W.t); if (m.relT != null) { if (slot === 'A') { m.log.gapSum += W.t - m.relT; m.log.gapN++; if (m.log.gaps.length < 400) m.log.gaps.push(W.t - m.relT); } m.relT = null; }
  combo.tried(W, m, K, best, Tc);
  const h = W._bh.commit; for (let i = 0; i < h.length; i++) h[i](W, m, K, best, cast, Tc);   // 붙잡기 시도 (rules/control), 붙잡기·짝 묶기 (rules/risk)
  simul.fired(W, m, K, s, Tc);
  herd.commit(W, m, K, s);
  combo.plan(W, m, K, s, Tc);
  if (T.mode) mode.commit(W, m, K, best, cast);   // 시전에 방식을 적는다 (v2.12)
  if (T.trapLine) trapline.commit(W, m, K, best);
  if (T.read) PL.commit(W, m, K, best, cast);
  if (T.sharp && (s.t === 'wall' || s.t === 'build')) K.wallT = W.t + Tc;   // 날카롭게 (v2.8): 세운 벽 뒤에 머문다 (sharp.behind)
  logDec(m, s, slot, { aimed, combo: eDown || (m.last && W.t - m.lastT < 1.5 && isSetup(K.S[m.last])), path: s.t === 'trap' && vt > 1.2 && d < 10, barrel: best.barrel });
  m.last = s.n; m.lastT = W.t;
}
module.exports = { decide, valueSpell, commit };
}, {"./util":"src/brain/util.js","./hooks":"src/brain/hooks.js","./techniques/combo":"src/brain/techniques/combo.js","./techniques/cancel":"src/brain/techniques/cancel.js","./techniques/feint":"src/brain/techniques/feint.js","./techniques/simul":"src/brain/techniques/simul.js","./techniques/tempo":"src/brain/techniques/tempo.js","./techniques/bait":"src/brain/techniques/bait.js","./techniques/learn":"src/brain/techniques/learn.js","./techniques/counter":"src/brain/techniques/counter.js","./techniques/cover":"src/brain/techniques/cover.js","./techniques/herd":"src/brain/techniques/herd.js","./techniques/crowd":"src/brain/techniques/crowd.js","./techniques/swarm":"src/brain/techniques/swarm.js","./techniques/siege":"src/brain/techniques/siege.js","./techniques/rhythm":"src/brain/techniques/rhythm.js","./techniques/efficacy":"src/brain/techniques/efficacy.js","./techniques/shape":"src/brain/techniques/shape.js","./techniques/survive":"src/brain/techniques/survive.js","./techniques/hazard":"src/brain/techniques/hazard.js","./techniques/sharp":"src/brain/techniques/sharp.js","./techniques/mode":"src/brain/techniques/mode.js","./techniques/engage":"src/brain/techniques/engage.js","./techniques/trapline":"src/brain/techniques/trapline.js","./plan":"src/brain/plan/index.js"}];
D["src/brain/hooks.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 훅 모으기 (brain/hooks, SPEC 22장)
 * 세계의 켜진 규칙 모듈(W.mods)에서 두뇌 훅만 차례대로 모아 W._bh에 둔다(세계마다 한 번, 첫 판단 때). 꺼진 규칙은 비용 0.
 * 규칙의 새 틀(taunt…)의 값은 brainTypes. 틀은 스위치와 상관없이 늘 붙는다 */
const R = require('../rules'), U = require('./util');
const BRN = new Map(), BT = {}; let btVer = -1;
// 훅 모음: 이름마다 배열 하나 (리터럴이라 모양이 늘 같다). 이름은 rules/index.js의 BRAIN_HOOKS
function emptyBH() { return { aim: [], read: [], hideCast: [], steer: [], avoid: [], empty: [], circles: [], react: [], cancel: [], rest: [], prep: [], value: [], valueRisk: [], valueMid: [], valueLate: [], commit: [], castTime: [], phase: [], bound: [], rings: [], slot: [], heat: [] };
  }
// 규칙의 두뇌 훅이 받는 것: 두뇌 도구(util) + 기술의 공용 도구 B.lib (v2.23.1: 규칙은 두뇌 파일을 require하지 않는다)
let BL_ = null; const BL = () => BL_ || (BL_ = Object.assign({}, U, { lib: require('./lib') }));
function brainOf(r) {
  let b = BRN.get(r); if (b) return b;
  b = r.brain(BL()); const ok = emptyBH(); for (const k in b) if (!(k in ok)) throw new Error(r.name + ': 없는 두뇌 훅 ' + k + ' (' + R.BRAIN_HOOKS.join(', ') + ')');
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
}, {"../rules":"src/rules/index.js","./util":"src/brain/util.js","./lib":"src/brain/lib/index.js"}];
D["src/brain/index.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 기본 두뇌 v2.37.0
 * 판단 순서: 읽기(read) → 입장(stance) → 움직임(move) → 고르기(choose: 자동 진 → 칸 → 휴식 → 마법 고르기)
 * 기술(콤보·속임수·엄폐·유도·학습·덱 읽기·붙잡기…)은 techniques/에 하나씩, 어느 단계가 어떤 기술을 켜는지는 skills.js(data/skills.json).
 * 규칙(스위치)에 딸린 판단은 그 규칙 파일(src/rules/)의 brain 훅에 있다. 세계마다 켜진 규칙의 훅만 모은다(hooks.js).
 * 새 두뇌를 만들 땐 think(W, m) 하나만 같은 모양으로 내보내면 된다. 등록은 Arena.register.brain
 * ========================================================================= */
const U = require('./util'), { hooks } = require('./hooks');
const rhythm = require('./techniques/rhythm'), engage = require('./techniques/engage'), plan = require('./plan');
const { aimAt, readThreats } = require('./read'), { chooseStance } = require('./stance'), { steer } = require('./move'), { decide } = require('./choose');

// 판단은 차례대로 여러 조각으로 나눠 둔다 (속도, 1.11.1): 한 덩어리(400줄)는 최적화 컴파일이 판보다 오래 걸려 짧은 실행 내내 느린 코드로 돌았다.
// 조각 사이에 오가는 값은 사람마다 하나 둔 K에 담는다(새로 만들지 않는다). 후보 하나의 값은 K.o에
function newO() { return { s: null, n: null, bi: 0, isOff: null, cost: 0, he: 0, Tw: 0, R: 0, v: 0, tx: 0, ty: 0, barrel: false, pin: false, down: false, wait: false }; }
function newK() { return { foes: null, S: null, T: null, prefR: null, aggr: null, dodgeK: null, rest: null, e: null, mem: null, wantMem: false, Dm: null, De: null, d: null, ux: null, uy: null, los: null, vt: null, eDown: null, dodge: null, aimed: null, threat: null, late: null, blindR: null, stance: null, escape: null, vx: 0, vy: 0, empty: null, circ: null, bigThreat: null, slot: null, defDown: null, sim: null, plan: null, lead: null, cb: null, down0: null, ek: null, roll: null, shieldNear: null, bigs: null, ctOf: null, pinNow: null, holds: null, pinBy: null, cand: null, pool: null, best: null, pipe: null, effHR: 0, pressB: false, push: false, wallT: -9, waitT: -9, mode: '', modeT: 0, modeAt: 0, sureW: 0, bait: false, pokeT: -9, covN: 0, covPts: null, covT: -9, coverDone: -9, low: false, chase: false, closeIn: false, trapT: -9, hurry: 0, pl: null, plT: -9, netN: 9, brk: -9, brkX: 0, brkY: 0, keep: 0, keepT: -9, jo: -1, joI: 0, joT: -9, eC: null, eC2: null, eN: '', eNT: -9, eP: '', ePT: -9, jsL: null, saltPad: 0, o: newO() }; }   // 리터럴로 만들어야 빠른 모양이 된다
// 모습 지표 (v2.2, 26장): 판단 때마다 거리와 장악 경계(두 신호의 몫이 같은 자리, 5장 식)를 적는다. 판에 영향이 없다
function sample(W, m, K) {
  const e = K.e, d = K.d, ml = m.mlog; ml.dS += d; ml.dS2 += d * d; ml.dN++;
  if (!W.rules.domain) return;
  const L = W.rules.domainL, A = U.C.sigOf(W, m) * (m._act ? 1 : W.rules.passive), B = U.C.sigOf(W, e) * (e._act ? 1 : W.rules.passive), x = L * (A - B) / (A + B) + A * d / (A + B), xc = x < 0 ? 0 : x > d ? d : x;
  ml.gS += d - xc; const bx = m.x + (e.x - m.x) * xc / (d || 1), by = m.y + (e.y - m.y) * xc / (d || 1);
  if (ml.bx === ml.bx) ml.bMove += U.hyp(bx - ml.bx, by - ml.by); ml.bx = bx; ml.by = by; ml.bT = W.t;
}
function think(W, m) {
  if (!W._bh) hooks(W);
  const K = m._k || (m._k = newK());
  if (!aimAt(W, m, K)) return;
  sample(W, m, K);   // 모습 지표 (v2.2): 거리, 장악 경계
  readThreats(W, m, K); rhythm.phase(W, m, K); chooseStance(W, m, K); if (m.tac.engage) engage.adjust(W, m, K); if (m.tac.read) plan.net(W, m, K); steer(W, m, K);   // 리듬: 떠보기·들어가기·빠지기 (v2.2)
  if (m.st.stun > 0) return;
  decide(W, m, K);
}

module.exports = { think, plan, catOf: U.catOf, FORMNAME: U.FORMNAME, rollSide: U.rollSide, VERSION: '2.37.0' };
}, {"./util":"src/brain/util.js","./hooks":"src/brain/hooks.js","./techniques/rhythm":"src/brain/techniques/rhythm.js","./techniques/engage":"src/brain/techniques/engage.js","./plan":"src/brain/plan/index.js","./read":"src/brain/read.js","./stance":"src/brain/stance.js","./move":"src/brain/move.js","./choose":"src/brain/choose.js"}];
D["src/brain/lib/index.js"] = [function (module, exports, require) {
'use strict';
/* 공용: 규칙의 두뇌 훅이 쓰는 두뇌 도구 (v2.23.1, SPEC 22장). 규칙 파일은 두뇌 파일을 require하지 않는다(순환):
 * 두뇌가 규칙의 brain 훅을 만들 때 B.lib로 넘겨준다(brain/hooks). 도구는 기술 파일에 그대로 있고 여기서 모을 뿐이다 */
const sharp = require('../techniques/sharp'), rhythm = require('../techniques/rhythm'), dodgeAim = require('../techniques/dodgeAim'), grab = require('../techniques/grab'), cancel = require('../techniques/cancel');
module.exports = {
  behind: sharp.behind, chance: sharp.chance, openFor: sharp.openFor,   // 날카롭게: 세운 벽 뒤에 머물기, 명중 가망, 과녁의 빈틈
  inDist: rhythm.inDist,                                                  // 리듬: 들어가는 거리
  dodgeAim: dodgeAim.value, grabValue: grab.value, grabCommit: grab.commit, undo: cancel.undo,   // 큰 수와 짝 (rules/risk)
  crowded: require('./traps').crowded,
  plan: require('../plan/state'),   // 수읽기의 줄인 상태: 응수 자원·피할 곳·빠져나갈 거리 (v2.35, 합창의 체크·메이트 rules/chorusCast)
};
}, {"../techniques/sharp":"src/brain/techniques/sharp.js","../techniques/rhythm":"src/brain/techniques/rhythm.js","../techniques/dodgeAim":"src/brain/techniques/dodgeAim.js","../techniques/grab":"src/brain/techniques/grab.js","../techniques/cancel":"src/brain/techniques/cancel.js","./traps":"src/brain/lib/traps.js","../plan/state":"src/brain/plan/state.js"}];
D["src/brain/lib/traps.js"] = [function (module, exports, require) {
'use strict';
/* 공용: 덫 칸 (v2.23.1). 규칙(rules/blueprint의 청사진 짓기)과 기술(techniques/trapline)이 함께 쓴다.
 * 엔진·두뇌 어느 쪽도 require하지 않는다(수학·데이터만): 규칙이 바로 불러도 순환이 생기지 않는다 */
const { hyp } = require('../../math');
const P = require('../../../data/trapline.json');
// (x, y) 둘레 칸에 m의 덫이 cellMax개 넘게 있나
function crowded(W, m, x, y) { let n = 0; for (const t of W.traps) if (t.src === m && hyp(t.x - x, t.y - y) < P.cell && ++n >= P.cellMax) return true; return false; }
module.exports = { crowded };
}, {"../../math":"src/math.js","../../../data/trapline.json":"data/trapline.json"}];
D["src/brain/move.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 3: 움직임
 * 입장대로 걷는다(돌파·거리 두기·선호 거리와 옆걸음). 기술(엄폐·자리·유도)이 더하고, 규칙의 훅(소금 원 steer, 화약통 avoid)이 고친다.
 * 피하기가 이기고, 알아챈 함정과 내 지연 폭발은 늘 비킨다. 걸음 방향은 K.vx·K.vy를 거쳐 기술·훅이 함께 고친다 */
const { hyp } = require('./util');
const cover = require('./techniques/cover'), position = require('./techniques/position'), lure = require('./techniques/lure');
const swarm = require('./techniques/swarm'), siege = require('./techniques/siege'), hazard = require('./techniques/hazard');
function steer(W, m, K) {
  const { foes, prefR, d, ux, uy, dodge, stance, escape } = K;
  let vx = 0, vy = 0;
  if (stance === 'breakout') { vx = escape.dir.dx * 2.5; vy = escape.dir.dy * 2.5; }
  else if (stance === 'kite') {
    let rx = 0, ry = 0; for (const q of foes) { const dq = hyp(m.x - q.x, m.y - q.y) || 1; if (dq < 14) { rx += (m.x - q.x) / dq / dq; ry += (m.y - q.y) / dq / dq; } }
    rx += (m.x < 5 ? 0.3 : 0) - (m.x > W.width - 5 ? 0.3 : 0); ry += (m.y < 5 ? 0.3 : 0) - (m.y > W.height - 5 ? 0.3 : 0);
    const l = hyp(rx, ry) || 1; vx = rx / l * 2 - ry / l * 0.6 * m.sf; vy = ry / l * 2 + rx / l * 0.6 * m.sf;
  } else {
    const pr = stance === 'hold' ? d : prefR;
    if (d > pr + 1) { vx += ux; vy += uy; } else if (d < pr - 1) { vx -= ux; vy -= uy; }
    if (W.rng() < 0.02) m.sf *= -1; const sw = stance === 'hold' ? 0.3 : 0.8; vx += -uy * m.sf * sw; vy += ux * m.sf * sw;
    K.vx = vx; K.vy = vy;
    const covering = cover.steer(W, m, K);   // 엄폐 (상급)
    position.terrain(W, m, K, covering);     // 자리 판단 (대가)
    vx = K.vx; vy = K.vy;
  }
  K.vx = vx; K.vy = vy;
  lure.steer(W, m, K);   // 유도 (대가), 약한 척 물러서기 (전설)
  swarm.steer(W, m, K);  // 무리: 장악권 바로 밖에 흩어져 선다 (v2.0 둘째)
  siege.steer(W, m, K);  // 성: 총 앞에서 벽 뒤·장전 틈, 멀리 떠서 깎기, 물러나기 (v2.0 둘째)
  vx = K.vx; vy = K.vy;
  if (dodge && stance !== 'breakout') { const l = hyp(dodge.x, dodge.y) || 1; vx = dodge.x / l * 2; vy = dodge.y / l * 2; }
  else if (K.brk > W.t) { vx = K.brkX; vy = K.brkY; }   // 그물 깨기 (수읽기, v2.15)
  // 소금 원: 선 가까이 오면 가운데로 (rules/saltRing). 피하기 걸음보다 뒤: 지대를 피하다 선 밖으로 나가 마르지 않게 (v2.0, 1.x에선 피하기가 이겼다)
  K.vx = vx; K.vy = vy; const hs = W._bh.steer; for (let i = 0; i < hs.length; i++) hs[i](W, m, K);
  vx = K.vx; vy = K.vy;
  for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < t.r + 1.2) { const l = hyp(m.x - t.x, m.y - t.y) || 1; vx += (m.x - t.x) / l * 1.5; vy += (m.y - t.y) / l * 1.5; }
  K.vx = vx; K.vy = vy; const ha = W._bh.avoid; for (let i = 0; i < ha.length; i++) ha[i](W, m, K);   // 화약통 곁을 비킨다 (rules/barrels)
  vx = K.vx; vy = K.vy;
  // 내가 떨어뜨린 지연 폭발 안으로 걸어 들어가지 않는다. 돌파 중에도 (v1.0.1)
  for (const a of W.areas) if (a.src === m && hyp(a.x - m.x, a.y - m.y) < a.r + 1) { const l = hyp(m.x - a.x, m.y - a.y) || 1; vx = (m.x - a.x) / l * 2.5; vy = (m.y - a.y) / l * 2.5; }
  // 단단한 벽: 모든 걸음이 정해진 뒤 규칙이 막는다 (소금 원의 안전 반경·과열 전 착지, v2.6). 훅이 없으면 그대로
  const hb = W._bh.bound; if (hb.length) { K.vx = vx; K.vy = vy; for (let i = 0; i < hb.length; i++) hb[i](W, m, K); vx = K.vx; vy = K.vy; }
  if (m.tac.hazard) { K.vx = vx; K.vy = vy; hazard.bound(W, m, K); vx = K.vx; vy = K.vy; }   // 내 위험 지대 비키기 (v2.21): 내 지연 폭발·곡사, 낮은 체력의 소금 원 여유
  m.mv.x = vx; m.mv.y = vy;
}
module.exports = { steer };
}, {"./util":"src/brain/util.js","./techniques/cover":"src/brain/techniques/cover.js","./techniques/position":"src/brain/techniques/position.js","./techniques/lure":"src/brain/techniques/lure.js","./techniques/swarm":"src/brain/techniques/swarm.js","./techniques/siege":"src/brain/techniques/siege.js","./techniques/hazard":"src/brain/techniques/hazard.js"}];
D["src/brain/plan/index.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 수읽기 (v2.15, SPEC 39장, 수는 data/plan.json·data/joseki.json)
 * 대마법사 결투를 체스처럼: 둘 다 빠르고 서로의 잔기술을 아니까 한 방으론 안 잡힌다. 체크(응수를 강요하는 수)로 상대의 방어 자원과 피할 곳을 하나씩 지워 메이트(응수 0)로 간다.
 * 판단 수준 tac.read = 읽는 깊이: 초보 0 · 중급 1 · 상급 2 · 대가 3(상대 자원을 센다) · 전설 4(상대도 읽는다고 본다). 선명도 5 이상, 결투(적이 하나)에서만.
 *   read: 칸을 고를 때, every s마다 다시 읽고 첫 수만 둔다(K.pl: 마법 n, 덮을 곳 j·tx·ty, 메이트·체크, 첫 수의 응수 수). 실행(피하기)은 반사 겹이 한다
 *   value: 읽은 첫 수 × boost(체크면 × check, 덮기면 그 자리에), 다른 공격 × others. 큰 한 방(big)은 메이트일 때만. 정석의 다음 수
 *   net (막는 쪽, 걸음 앞): 내 방어 여유(state.slack: 0.3 s 안에 쓸 자원 + 움직일 곳)가 net.low 아래로 좁혀오고 상대가 짓고 있으면, 자원이 바닥나기 전에 깨기:
 *     slip s 동안 걸음을 바꾼다(가까운 바위 뒤로 떨어져 엄폐, 없으면 상대에게서 멀리 가장 열린 쪽으로) · 벽 마법 × wall · 가장 빠른 체크로 역체크 × counter. 정석을 알면 받는 법(away·keep·cast)
 *   commit: 시전에 cast.chk(체크)·cast.mate(메이트). 기록 m.mlog: chk·mate·brk·plN(읽은 수)·plNodes(본 마디) */
const ST = require('./state'), SE = require('./search'), JO = require('./joseki'), P = ST.P;
const { C, hyp, OFF, landDelay, castTime } = require('../util');
const on = (m, K) => m.tac.read > 0 && m.C >= 5 && K.foes && K.foes.length === 1;
const SD = new WeakMap(), TMP = ST.newSide();
function sides(m) { let o = SD.get(m); if (!o) { o = { e: ST.newSide(), me: ST.newSide() }; SD.set(m, o); } return o; }
const newPl = () => ({ n: '', j: 0, tx: 0, ty: 0, mate: false, line: false, check: false, pred: -1, ans: 0, t: -9, S: null, lt: null, qN: 0, qName: new Array(16).fill(''), qCell: new Int32Array(16), qH: new Int32Array(16), qT: new Float64Array(16) });
const FI = { thread: 0, proj: 0, area: 4, lob: 4 };
// 배운 맞을 가망: 칸 = 틀(실·투사체 0, 지연 폭발·곡사 4) + 응수 수(0~3). [0..7] 수, [8..15] 맞힌 수. 앞선 값 × 무게 w에서 시작
function table(pl) {
  if (pl.lt) return pl.lt; const t = pl.lt = new Float64Array(16), H = P.hit;
  for (let i = 0; i < 4; i++) { t[i] = t[4 + i] = H.w; t[8 + i] = H.prior.thread[i] * H.w; t[12 + i] = H.prior.area[i] * H.w; }
  return t;
}
// 푼 지 wait s 지난 내 수가 맞았나 보고 배운다
function learn(W, m, pl) {
  const t = table(pl); let j = 0;
  for (let i = 0; i < pl.qN; i++) { if (pl.qT[i] <= W.t) { const c = pl.qCell[i]; t[c]++; if ((m.log.hits[pl.qName[i]] || 0) > pl.qH[i]) t[8 + c]++; } else { pl.qName[j] = pl.qName[i]; pl.qCell[j] = pl.qCell[i]; pl.qH[j] = pl.qH[i]; pl.qT[j] = pl.qT[i]; j++; } }
  pl.qN = j;
}
// 읽기 (칸을 고를 때)
function read(W, m, K) {
  if (!on(m, K)) { if (K.pl) K.pl.n = ''; return; }
  const pl = K.pl || (K.pl = newPl());
  if (W.t - K.plT < P.every) return;
  learn(W, m, pl);
  const e = K.e, S = ST.build(W, e, m, sides(m).e, 0.5, !!W.rules.stunRes), o = SE.read(W, m, e, S, m.tac.read, table(pl));
  K.plT = W.t; pl.t = W.t; pl.S = S; pl.n = o.k >= 0 ? SE.CN[o.k] : ''; pl.j = o.j; pl.tx = o.j ? S.bx[o.j] : 0; pl.ty = o.j ? S.by[o.j] : 0; pl.mate = o.mate; pl.line = o.line; pl.check = o.check; pl.ans = o.ans; pl.pred = o.pred;
  m.mlog.plN++; m.mlog.plNodes += o.nodes;
}
// 막는 쪽 (걸음 앞, 판단마다)
function net(W, m, K) {
  if (!on(m, K)) return;
  const e = K.e, S = ST.build(W, m, e, sides(m).me, 0.5, !!W.rules.stunRes); K.netN = ST.slack(S, 0.3);
  const L = JO.read(W, m, K); K.jsL = L;
  if (K.brk > W.t) return;
  let busy = false; for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && !c.unseen && !c.auto && OFF[c.s.t] && c.tgt === m) busy = true; }
  const away = L && L.answer.do === 'away';
  if (!((K.netN <= P.net.low && busy) || away)) return;
  // 깨기: 바위 뒤(상대와 사이에 두고) 또는 상대에게서 멀리, 가장 열린 쪽으로
  let tx = 0, ty = 0, bd = 1e9;
  if (m.z < 3) for (const ob of W.obs) { const d = hyp(ob.x - m.x, ob.y - m.y); if (d < 12 && d < bd) { const ux = ob.x - e.x, uy = ob.y - e.y, l = hyp(ux, uy) || 1; tx = ob.x + ux / l * (ob.r + 1.2) - m.x; ty = ob.y + uy / l * (ob.r + 1.2) - m.y; bd = d; } }
  if (bd === 1e9) { let bj = 1, bb = 1e9; for (let j = 1; j < 9; j++) if (S.blk[j] < bb && ST.OX[j] >= 0) { bb = S.blk[j]; bj = j; } tx = S.bx[bj] - m.x; ty = S.by[bj] - m.y; }
  const l = hyp(tx, ty) || 1; K.brkX = tx / l * 2; K.brkY = ty / l * 2; K.brk = W.t + (away ? P.net.away : P.net.slip); m.mlog.brk++;
}
// 과녁 e의 앞 방패가 τ s 뒤에도 서 있고 나를 바라보나 (core의 frontBlock과 같은 각 1.1)
function faces(e, m, tau) { const f = e.buf.front; if (!f || f.t < tau) return false; const a = C.atan2(m.y - e.y, m.x - e.x), d = ((a - e.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return (d < 0 ? -d : d) < 1.1; }
// 값 고치기 (맨 끝)
function value(W, m, K, o) {
  if (!on(m, K)) return;
  const s = o.s, pl = K.pl;
  if (s.big && !(pl && pl.mate && pl.n === o.n)) { o.v = 0; return; }   // 큰 한 방은 메이트일 때만
  JO.value(W, m, K, o);
  if ((s.t === 'thread' || s.t === 'proj') && o.v > 0 && faces(K.e, m, castTime(W, m, s.cast) + 0.1)) o.v *= P.shield.thru;   // 세운 앞 방패를 마주 보고 실·투사체는 헛수 (v2.16)
  if (pl && pl.n) { if (o.n === pl.n) { o.v = (o.v > 0 || o.wait ? Math.max(o.v, pl.mate ? 0.6 : P.plan.base) : 0) * (pl.mate ? P.plan.mateBoost : P.plan.boost) * (pl.check ? P.plan.check : 1); if (pl.j) { o.tx = pl.tx; o.ty = pl.ty; } else if (pl.mate && (s.t === 'area' || s.t === 'lob')) { const q = ST.aim(W, K.e, castTime(W, m, s.cast) + (s.t === 'area' ? s.delay : s.flight)); o.tx = q.x; o.ty = q.y; } } else if (OFF[s.t] && o.v > 0) o.v *= pl.mate ? P.plan.others * 0.5 : P.plan.others; }   // 메이트면 그 수를 꼭. 메이트의 지연 폭발은 몸을 못 쓰는 상대의 정해진 길에 (v2.16)
  if (OFF[s.t] && o.v > 0 && !(pl && pl.n === o.n && (pl.mate || pl.line || pl.check)) && K.e.hp <= K.e.hpMax * P.plan.finHp) o.v *= P.plan.finOthers;   // 끝내기: 거의 쓰러진 상대는 메이트로 (v2.16)
  if (K.brk > W.t) { if (s.t === 'wall' || s.t === 'build') o.v = Math.max(o.v, P.plan.base) * P.net.wall; else if (s.t === 'thread' && o.v > 0) o.v *= P.net.counter; }   // 깨기: 벽, 역체크
  if (K.jsL && K.jsL.answer.cast === o.n && W.t < K.keepT && o.v > 0) o.v *= JO.P.boost;   // 정석의 받는 법
  if (K.keep & 8 && W.t < K.keepT && s.t === 'buff' && s.b && s.b.front) o.v *= 0.2;   // 아낄 방패
}
// 둔 수
function commit(W, m, K, best, cast) {
  if (!on(m, K)) return;
  const pl = K.pl; if (pl && pl.n === best.n) { cast.chk = pl.check; cast.mate = pl.mate; cast.pred = pl.pred; if (pl.check) m.mlog.chk++; if (pl.mate) m.mlog.mate++; }
  const f = FI[best.s.t]; if (pl && f !== undefined && pl.qN < 16 && K.e) { const i = pl.qN++, n = ansOf(W, K.e, m, cast, !!W.rules.stunRes); pl.qName[i] = best.n; pl.qCell[i] = f + (n > 3 ? 3 : n); pl.qH[i] = m.log.hits[best.n] || 0; pl.qT[i] = W.t + cast.T + P.hit.wait; }   // 배울 것
  JO.commit(W, m, K, best.n); K.plT = -9;   // 다음 칸에서 다시 읽는다
}
// 지표 (metrics/watch, 읽기만): d의 방어 여유, 시전 c에 대한 d의 응수 수. 굳음은 바로 센다(v2.21: 굳은 채 닿으면 응수가 없다)
function slackOf(W, d, a) { return ST.slack(ST.build(W, d, a, TMP, 0.5, true), 0.3); }
function ansOf(W, d, a, c, sk = true) {
  const S = ST.build(W, d, a, TMP, 0.5, sk), s = c.s, f = s.t, mask = ST.FM[f] || 0, A = ST.ra(), pc = ST.paceOn(W, a) ? A.pace.P : null, dist = hyp(c.tx - a.x, c.ty - a.y);
  const tau = Math.max(0, c.T - c.t) + (f === 'thread' ? 0 : landDelay(s, dist)), r = f === 'area' || f === 'lob' ? (s.r || 1) * C.sizeOf(a, s) + 0.3 : Math.max(1, (pc ? pc.track[a.tac.pace || 0] || 0 : 0) + 0.6);
  let n = 0; if ((f === 'thread' || f === 'proj') && S.shUp >= tau) n++;
  for (let i = 0; i < 6; i++) { if (!(mask & (1 << i)) || !(S.has & (1 << i)) || S.av[i] > tau) continue; if (i === 2 && s.big) continue; if (i === 1 && !ST.cutOK(S, tau, r)) continue; if (i === 0 && !ST.rollOK(S, tau, r)) continue; n++; }
  if (mask & (1 << ST.MOVE) && ST.moveOK(S, tau, r)) for (let j = 1; j < 9; j++) if (S.blk[j] <= tau) { n++; break; }
  return n;
}
// 지표용 (v2.20.1, GATE 4판 C7): 응수를 둘로 — 온전히 받는 응수 수(막기·잔기술 빼고)와 피해를 줄이기만 하는 막기·잔기술을 쓸 수 있나
function ansSplit(W, d, a, c, out) {
  const S = ST.build(W, d, a, TMP, 0.5, true), s = c.s, f = s.t, mask = ST.FM[f] || 0, A = ST.ra(), pc = ST.paceOn(W, a) ? A.pace.P : null, dist = hyp(c.tx - a.x, c.ty - a.y);
  const tau = Math.max(0, c.T - c.t) + (f === 'thread' ? 0 : landDelay(s, dist)), r = f === 'area' || f === 'lob' ? (s.r || 1) * C.sizeOf(a, s) + 0.3 : Math.max(1, (pc ? pc.track[a.tac.pace || 0] || 0 : 0) + 0.6);
  let n = 0; if ((f === 'thread' || f === 'proj') && S.shUp > 0 && S.shUp >= tau) n++;   // 세운 방패가 있어야 (v2.21)
  for (let i = 0; i < 6; i++) { if (i === 2 || !(mask & (1 << i)) || !(S.has & (1 << i)) || S.av[i] > tau || tau <= 0) continue; if (i === 1 && !ST.cutOK(S, tau, r)) continue; if (i === 0 && !ST.rollOK(S, tau, r)) continue; n++; }
  if (mask & (1 << ST.MOVE) && ST.moveOK(S, tau, r)) for (let j = 1; j < 9; j++) if (S.blk[j] <= tau) { n++; break; }
  const q = A.ps ? A.ps.psvOf(s) : 0; out.n = n; out.g = !!(mask & 4) && !!(S.has & 4) && (S.av[2] < tau || (S.av[2] === 0 && d.st.psv > 0)) && !s.big && (!S.pk || (q > 0 && (S.pk & (1 << (q - 1))) > 0)); return out;
}
// 방어 자원의 남은 몫 (샌드박스): 자원마다 0(지금 쓸 수 있음)~1(cap s 넘게 잠김), 없으면 -1
function resBars(S, out) { for (let i = 0; i < 6; i++) out[i] = S.has & (1 << i) ? Math.min(1, S.av[i] / P.w.lockCap) : -1; return out; }
module.exports = { read, net, value, commit, slackOf, ansOf, ansSplit, resBars, on, JO, ST };
}, {"./state":"src/brain/plan/state.js","./search":"src/brain/plan/search.js","./joseki":"src/brain/plan/joseki.js","../util":"src/brain/util.js"}];
D["src/brain/plan/joseki.js"] = [function (module, exports, require) {
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
  for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && !c.unseen && !c.auto && c !== K.eC && c !== K.eC2) { K.eP = K.eN; K.ePT = K.eNT; K.eN = c.s.n; K.eNT = W.t; K.eC2 = K.eC; K.eC = c; } }   // 상대가 지은 수의 차례 (내가 본 것만)
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
}, {"../../../data/joseki.json":"data/joseki.json","./state":"src/brain/plan/state.js"}];
D["src/brain/plan/search.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 수읽기 2: 읽기 (v2.15, SPEC 39장, 수는 data/plan.json)
 * 내 수 → 상대의 가장 좋은 응수 → 내 다음 수 …를 깊이(내 수의 수)만큼. 줄인 상태(state.js)와 내 마법 표(후보)만 쓴다. 새 객체를 만들지 않는다(뜨거운 곳).
 *   내 수: 지금 쓸 수 있는 공격(실·투사체·지연 폭발·곡사)을 과녁에 바로(체크) 또는 지연 폭발·곡사를 상대가 피해 갈 곳에(덮기: 그 피할 곳을 터질 때까지 막는다)
 *   응수: 그 틀에 맞는 자원(앞 방패·막기·벽·옆 튀기·구르기·몸 털기)이 닿을 때 쓸 수 있거나, 움직여 비킬 수 있고(시간 안에 반경을 벗어남) 열린 피할 곳이 있으면.
 *     막기는 큰 수엔 응수가 아니다. 세워 둔 앞 방패는 실·투사체를 거저 막는다. 움직이거나 튀거나 구르면 덮어 둔 피할 곳이 풀린다(자리가 바뀌었다)
 *   응수 수마다 맞을 가망(hit: 앞선 값에서 시작해 판 중 내 수로 배운다)만큼 피해를 센다. 응수가 없고 맞을 가망이 hit.mate 넘으면 메이트.
 *   끝 자리의 값: 기대 피해 × dmg + 상대 자원이 잠긴 시간(최대 lockCap) × 무게 + 막힌 피할 곳
 *   상대의 고르기: 깊이 3까지는 가장 싼 응수(움직임 < 자원), 깊이 4(전설)는 상대도 읽는다고 본다(응수마다 끝까지 읽어 가장 나쁜 것)
 *   깊이 3 아래는 상대 자원을 세지 않는다(자원은 늘 있고 다시 쓸 때까지가 0) */
const ST = require('./state'), { P, FM } = ST;
const { C, hyp, castTime, estDmg } = require('../util');
const NK = 12, MAXD = 6, W_ = P.w, WR = new Float64Array([W_.roll, W_.cut, W_.guard, W_.shield, W_.wall, W_.shake]), MATE = W_.mate;
const CN = new Array(NK).fill(''), CT = new Float64Array(NK), TAU = new Float64Array(NK), CR = new Float64Array(NK), CDM = new Float64Array(NK), CBIG = new Uint8Array(NK), CMASK = new Int32Array(NK),
  CCOST = new Float64Array(NK), CCD = new Float64Array(NK), CCOV = new Uint8Array(NK), CSH = new Uint8Array(NK), CH = new Float64Array(NK), ORD = new Int32Array(NK), MYCD = new Float64Array(NK), CHF = new Float64Array(NK), CKD = new Uint8Array(NK);
const PH = new Float64Array(8), AV = new Float64Array(6), CDR = new Float64Array(6), BLK = new Float64Array(9), GEO = new Float64Array(9), SBLK = new Float64Array(9 * MAXD);
let EXP = 0, NC = 0, HAS = 0, SH = 0, GLU = 0, DMG = 0, GK = 0.45, MM = false, SS = null, nodes = 0, CHK0 = false, ANS0 = 0, MATE0 = false, PRED0 = -1;
const OUT = { k: -1, j: 0, v: 0, mate: false, line: false, check: false, ans: 0, pred: -1, nodes: 0 };   // pred: 첫 수에 상대가 쓸 응수 (0~5 자원, 6 움직임, -1 없음)   // mate: 첫 수가 메이트, line: 읽은 수순 끝에 메이트
function leaf(t) {
  let v = 0; for (let i = 0; i < 6; i++) if (HAS & (1 << i)) { const x = AV[i] - t; v += WR[i] * (x <= 0 ? 0 : x > W_.lockCap ? W_.lockCap : x); }
  for (let j = 0; j < 9; j++) if (BLK[j] > t && GEO[j] === 0) v += W_.slot;
  return v + W_.dmg * DMG;
}
const freeSlot = T => { for (let j = 1; j < 9; j++) if (BLK[j] <= T) return j; return 0; };
// 응수 i를 쓸 수 있나 (6은 움직임)
function can(i, k, T) {
  const tau = TAU[k], r = CR[k];
  if (i === 6) return ST.moveOK(SS, tau, r) && freeSlot(T) > 0;
  if (!(HAS & (1 << i)) || AV[i] > T) return false;
  if (SS.sl > T && !(i === 2 && AV[2] === 0)) return false;   // 굳은 채 닿는다: 이미 켠 잔기술 말고는 응수가 없다 (v2.23, rules/stunRes. 굳음을 셀 때만 sl)
  if (i === 2) return !CBIG[k] && (!SS.pk || (SS.pk & CKD[k]) > 0);   // 잔기술은 맞는 종류만 (v2.18)
  if (i === 1) return ST.cutOK(SS, tau, r);
  if (i === 0) return ST.rollOK(SS, tau, r);
  return true;
}
function cost(i, k) { if (i === 6) return P.cost.move; const c = WR[i] * (CDR[i] > W_.lockCap ? W_.lockCap : CDR[i]); return i === 2 ? c + P.cost.guardDmg * CDM[k] / 30 : c; }
// 응수 i를 두고 읽기를 잇는다
function answer(i, k, t1, T, depth, ply) {
  const s0 = ply * 9; let a0 = 0, sh0 = SH, d0 = DMG, moved = i === 6 || i === 0 || i === 1;
  DMG += CDM[k] * EXP * (i === 2 ? GK : 1);   // 맞을 가망만큼의 피해 (막기면 줄어든다)
  if (i < 6) { a0 = AV[i]; AV[i] = T + CDR[i]; if (i === 3) SH = T + P.res.shieldUp; }
  if (moved) for (let j = 0; j < 9; j++) { SBLK[s0 + j] = BLK[j]; BLK[j] = GEO[j]; }   // 자리가 바뀌었다: 덮어 둔 곳이 풀린다
  const v = me(depth - 1, t1, ply + 1);
  if (moved) for (let j = 0; j < 9; j++) BLK[j] = SBLK[s0 + j];
  if (i < 6) AV[i] = a0; SH = sh0; DMG = d0;
  return v;
}
// 체크: 과녁에 바로. 상대의 응수를 고르고 잇는다
function direct(k, t1, T, depth, ply) {
  if (CSH[k] && SH >= T) { if (ply === 0) { PRED0 = 3; MATE0 = false; CHK0 = false; ANS0 = 1; } return me(depth - 1, t1, ply + 1) - 0.1; }   // 세운 방패가 거저 막는다
  const mask = CMASK[k]; let n = 0, bi = -1, bc = 1e9;
  for (let i = 0; i < 7; i++) { if (!(mask & (1 << i)) || !can(i, k, T)) continue; n++; const c = cost(i, k); if (c < bc) { bc = c; bi = i; } }
  if (ply === 0) ANS0 = n;
  const ph = PH[(CSH[k] ? 0 : 4) + (n > 3 ? 3 : n)] * CHF[k];   // 응수가 n개일 때 맞을 가망 (배운 값, 마법마다의 명중으로 고친다)
  if (ply === 0) MATE0 = !n && ph >= P.hit.mate;
  if (!n && ph >= P.hit.mate) { if (ply === 0) CHK0 = true; return MATE - ply * 2 + W_.dmg * (DMG + CDM[k] * ph); }   // 메이트: 응수가 없고 거의 맞는다
  if (CBIG[k]) return -1e9;   // 큰 한 방은 메이트일 때만 둔다 (v2.16)
  let v; EXP = ph;
  if (!n) { v = me(depth - 1, t1, ply + 1) + W_.dmg * CDM[k] * ph; if (ply === 0) CHK0 = true; return v; }   // 응수가 없지만 빗나갈 수 있다
  if (!MM) v = answer(bi, k, t1, T, depth, ply);
  else {   // 상대도 읽는다: 응수마다 끝까지 읽어 나에게 가장 나쁜 것
    v = 1e9; let tried = 0, bm = P.beam.them[ply] || 2;
    for (let i = 0; i < 7 && tried < bm; i++) { if (!(mask & (1 << i)) || !can(i, k, T)) continue; tried++; EXP = ph; const x = answer(i, k, t1, T, depth, ply); if (x < v) { v = x; bi = i; } }
  }
  if (ply === 0) { CHK0 = bi !== 6; PRED0 = bi; }
  return v;
}
function me(depth, t, ply) {
  nodes++;
  if (depth === 0) return leaf(t);
  let best = -1e9, tried = 0; const bm = P.beam.me[ply] || 2;
  for (let q = 0; q < NC && tried < bm; q++) {
    const k = ORD[q]; if (MYCD[k] > t + 0.05 || GLU < CCOST[k]) continue; tried++;
    const t1 = t + (CT[k] > P.minGap ? CT[k] : P.minGap), T = t + TAU[k], cd0 = MYCD[k], g0 = GLU;
    MYCD[k] = t + CT[k] + CCD[k]; GLU -= CCOST[k];
    PRED0 = -1; const v = direct(k, t1, T, depth, ply), c0 = CHK0, a0 = ANS0, m0 = MATE0, p0 = PRED0;
    if (v > best) { best = v; if (ply === 0) { OUT.k = k; OUT.j = 0; OUT.v = v; OUT.check = c0; OUT.ans = a0; OUT.mate = m0; OUT.pred = p0; OUT.line = v >= MATE - 10; } }
    if (CCOV[k]) { const j = freeSlot(t); if (j > 0) { const b0 = BLK[j]; if (BLK[j] < T + 0.05) BLK[j] = T + 0.05; const v2 = me(depth - 1, t1, ply + 1); BLK[j] = b0; if (v2 > best) { best = v2; if (ply === 0) { OUT.k = k; OUT.j = j; OUT.v = v2; OUT.check = false; OUT.ans = 9; OUT.pred = -1; OUT.mate = false; OUT.line = v2 >= MATE - 10; } } } }   // 덮기: 피해 갈 곳을 막는다
    MYCD[k] = cd0; GLU = g0;
  }
  return tried ? best : leaf(t);
}
// 마법마다 배운 명중 (v2.16): 세 번 넘게 쓴 수는 (맞힌 + 0.3) / (쓴 + 1)을 내 공격 전체의 명중(효과 학습의 effHR)과 견준다. 0.1 ~ 1.4
function eff(m, n) { const K = m._k, c = m.log.casts[n] || 0; if (!K || !(K.effHR > 0) || c < 3) return 1; const h = m.log.hits[n] || 0, q = (Math.min(c, h) + 0.3) / (c + 1) / (K.effHR > 0.05 ? K.effHR : 0.05), k = q * Math.sqrt(q); return k < 0.1 ? 0.1 : k > 1.4 ? 1.4 : k; }
// 내 마법 표: 지금 과녁 e에게 닿는 공격마다 짓는 시간·닿는 때·덮는 반경·피해·큰 수·응수 비트·당·다시 쓸 때까지
function table(W, m, e, S) {
  const A = ST.ra(), pc = ST.paceOn(W, m) ? A.pace.P : null, d = hyp(e.x - m.x, e.y - m.y), tr = pc ? pc.track[m.tac.pace || 0] || 0 : 0, los = !C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z);
  NC = 0;
  for (const n of m.book) {
    if (NC >= NK) break; const s = W.spells[n]; if (!s) continue; const f = s.t; if (!(f === 'thread' || f === 'proj' || f === 'area' || f === 'lob')) continue;
    if (d > C.rangeOf(m, s) || ((f === 'thread' || f === 'proj') && !los)) continue;
    if (e.z >= 2 && ((f === 'area' && !s.vis) || f === 'lob')) continue;   // 떠 있는 과녁에 헛된 수
    if (s.big && e.hp > e.hpMax * P.big.hpAt) continue;   // 큰 한 방은 끝내기에만 (v2.16)
    const ct = castTime(W, m, s.cast), dm = estDmg(s);
    CN[NC] = n; CT[NC] = ct; TAU[NC] = ct + (f === 'thread' ? d / (32 * (s.fast || 1) * (pc ? pc.threadK : 1)) : f === 'proj' ? d / s.v : f === 'area' ? s.delay : s.flight);
    CR[NC] = f === 'area' || f === 'lob' ? (s.r || 1) * C.sizeOf(m, s) + 0.3 : Math.max(1, tr + 0.6);
    CDM[NC] = dm; CBIG[NC] = s.big || dm >= P.big.minDmg ? 1 : 0; CMASK[NC] = FM[f]; CCOST[NC] = s.cost; CCD[NC] = s.cd * (pc ? pc.cdK : 1);
    CCOV[NC] = (f === 'area' || f === 'lob') && !CBIG[NC] && !S.fly ? 1 : 0; CSH[NC] = f === 'thread' || f === 'proj' ? 1 : 0; MYCD[NC] = m.cd[n] > 0 ? m.cd[n] : 0;
    CHF[NC] = eff(m, n); { const q = ST.ra().ps.psvOf(s); CKD[NC] = q ? 1 << (q - 1) : 0; } CH[NC] = dm * CHF[NC] / (TAU[NC] + 0.2); ORD[NC] = NC; NC++;
  }
  for (let i = 1; i < NC; i++) { const x = ORD[i]; let j = i - 1; while (j >= 0 && CH[ORD[j]] < CH[x]) { ORD[j + 1] = ORD[j]; j--; } ORD[j + 1] = x; }   // 빠르고 센 것부터
}
// 읽기: m이 과녁 e를 깊이 depth로. S는 e의 줄인 상태(이미 지은 것). 결과는 OUT (첫 수 k, 덮을 곳 j, 메이트·체크, 첫 수의 응수 수)
function read(W, m, e, S, depth, lt) {
  for (let i = 0; i < 8; i++) PH[i] = lt[8 + i] / lt[i];   // 배운 맞을 가망
  table(W, m, e, S); SS = S; nodes = 0; OUT.k = -1; OUT.j = 0; OUT.v = 0; OUT.mate = false; OUT.line = false; OUT.check = false; OUT.ans = 0;
  const count = depth >= 3; HAS = S.has; SH = S.shUp; GLU = m.glu; DMG = 0; GK = ST.paceOn(W, e) ? ST.ra().pace.P.guard.k : 1; MM = depth >= 4;
  for (let i = 0; i < 6; i++) { AV[i] = count ? S.av[i] : (HAS & (1 << i) ? 0 : Infinity); CDR[i] = count ? S.cd[i] : 0; }
  for (let j = 0; j < 9; j++) { BLK[j] = S.blk[j]; GEO[j] = S.geo[j]; }
  // 이미 짓고 있는 내 수가 먼저 닿는다: 상대가 가장 싼 응수를 쓴다고 보고 상태를 고친다 (자원을 셀 때만)
  if (count) for (let q = 0; q < 2; q++) { const c = q ? m.castB : m.cast; if (!c || c.auto || c.tgt !== e) continue; let k = -1; for (let i = 0; i < NC; i++) if (CN[i] === c.s.n) { k = i; break; } if (k < 0) continue; const T = c.T - c.t + (c.s.t === 'area' ? c.s.delay : 0); let bi = -1, bc = 1e9; for (let i = 0; i < 7; i++) { if (!(CMASK[k] & (1 << i)) || !can(i, k, T)) continue; const x = cost(i, k); if (x < bc) { bc = x; bi = i; } } if (bi >= 0 && bi < 6) { AV[bi] = T + CDR[bi]; if (bi === 3) SH = T + P.res.shieldUp; } }
  if (NC && depth > 0) me(depth, 0, 0);
  OUT.nodes = nodes; return OUT;
}
module.exports = { read, OUT, CN, TAU, CR, nc: () => NC };
}, {"./state":"src/brain/plan/state.js","../util":"src/brain/util.js"}];
D["src/brain/plan/state.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 수읽기 1: 줄인 상태 (v2.15, SPEC 39장, 수는 data/plan.json)
 * 막는 사람(d) 하나를 치는 사람(a)의 눈으로 줄인다. 새 객체는 사람마다 한 번만 만들고 다시 쓴다(속도).
 *   자원 여섯 (차례가 비트): 0 구르기(땅) · 1 옆 튀기(날기 끊기) · 2 막기(순간 켜기, rules/pace. 잔기술 규칙이 켜진 판에선 잔기술: pk가 막는 종류의 비트, v2.18) · 3 방패(앞 방패 마법, 서클 셋부터는 자동 진으로 바로) · 4 벽(벽·흙벽 마법) · 5 몸 털기(풀기, rules/response)
 *     av: 지금부터 몇 s 뒤에 쓸 수 있나(없으면 Infinity), cd: 쓰면 다시 쓸 때까지, has: 가진 것의 비트, shUp: 세운 앞 방패가 남은 시간
 *   피할 곳 아홉: 0 제자리, 1~8 치는 사람 쪽에서 본 옆(±90°)·비스듬히(±45°·±135°)·뒤·앞으로 slotD m. blk: 몇 s 뒤까지 막혔나(0 열림, Infinity 늘 막힘)
 *     늘 막힘: 싸움터 끝·소금 원 밖·바위·벽(낮을 때)·치는 사람의 덫(땅). 그때까지 막힘: 치는 사람의 지연 폭발(터질 때까지)
 *   움직임: 날면 옆 가속 a(끊는 움직임·빠른 판의 꺾기, rules/flight의 aF), 땅이면 걷는 빠르기 walkV */
const P = require('../../../data/plan.json');
const { C, hyp, castTime } = require('../util');
const RES = ['roll', 'cut', 'guard', 'shield', 'wall', 'shake'], RI = { roll: 0, cut: 1, guard: 2, shield: 3, wall: 4, shake: 5, move: 6 }, MOVE = 6;
const FM = {}; for (const f in P.form) { let b = 0; for (const k of P.form[f]) b |= 1 << RI[k]; FM[f] = b; }   // 틀마다 응수의 비트
const R2 = Math.SQRT1_2, OX = [0, 0, 0, R2, R2, -R2, -R2, 1, -1], OY = [0, 1, -1, R2, -R2, R2, -R2, 0, 0];   // 피할 곳의 방향 (치는 사람 → 막는 사람 축에서): 제자리·옆·옆·비스듬히 앞뒤·뒤·앞
const G = 9.8;
let RA = null;   // 규칙의 api (처음 부를 때 읽는다: 엔진이 규칙을 읽을 때 두뇌는 아직 없다)
function ra() { if (!RA) { const f = n => { const r = C.RULES.find(x => x.name === n); return r ? r.api : null; }; RA = { fl: f('flight'), pace: f('pace'), resp: f('response'), sr: f('saltRing'), ps: f('passive') }; } return RA; }
function newSide() { return { av: new Float64Array(6), cd: new Float64Array(6), has: 0, shUp: 0, blk: new Float64Array(9), geo: new Float64Array(9), bx: new Float64Array(9), by: new Float64Array(9), why: new Uint8Array(9), pk: 0, sl: 0, a: 0, up: 0, fly: false, walkV: 6, shN: '', wlN: '', ux: 1, uy: 0, x: 0, y: 0 }; }
const paceOn = (W, q) => { const p = ra().pace; return !!(W.rules.pace && p && q.C >= p.P.cMin); };
// 앞 방패·벽 마법 (책마다 한 번)
function bookOf(W, d, S) {
  S.shN = ''; S.wlN = '';
  for (const n of d.book) { const s = W.spells[n]; if (!s) continue; if (!S.shN && s.t === 'buff' && s.b && s.b.front && s.react) S.shN = n; if (!S.wlN && (s.t === 'wall' || s.t === 'build')) S.wlN = n; }
}
// 떨어지는 사람이 몸을 못 쓰는 시간 (v2.16): 쿠션을 뿜을 줄 알면(날기 끊기, 판단 수준 flyCut 2부터) 굳음이 풀릴 때까지, 아니면 땅에 닿아 추락 굳음이 끝날 때까지
function fallLock(W, d) {
  if (W.rules.flightCut && (d.tac.flyCut || 0) >= 2) return d.st.stun > 0 ? d.st.stun : 0;
  const vz = d.vz || 0, z = d.z > 0 ? d.z : 0, tg = (vz + Math.sqrt(vz * vz + 2 * G * z)) / G;
  return tg + ra().fl.F.fallStun;
}
// 막는 사람 d의 줄인 상태 (치는 사람 a의 눈). h: 피할 곳을 볼 앞날(s)
// sk (v2.21): 굳음을 바로 센다 — 굳은 동안은 생각도 시전도 못 하니 막기·방패·벽·몸 털기도 굳음이 풀린 뒤에야(이미 켠 잔기술·세운 방패는 그대로)
function build(W, d, a, S, h, sk) {
  const A = ra(), av = S.av, cd = S.cd; let has = 0;
  bookOf(W, d, S);
  for (let i = 0; i < 6; i++) { av[i] = Infinity; cd[i] = 0; }
  const fly = d.z >= 1 && d.fly === 1, lock = Math.max(d.st.stun, d.st.root, d.fly === 2 ? fallLock(W, d) : 0);   // 굳음·묶임·떨어짐이 풀릴 때까지는 몸을 못 쓴다
  // 0 구르기: 땅에 서 있고 기력이 있으면
  if (!fly && d.fly !== 3 && d.stam > 1.5) { av[0] = Math.max(d.rollCd, lock, 0); cd[0] = P.res.roll.cd; has |= 1; }
  // 1 옆 튀기: 날기 끊기를 쓰는 사람이 날 때
  if (fly && W.rules.flightCut && (d.tac.flyCut || 0) >= 2) { av[1] = Math.max(d.cut.cd, lock, 0); cd[1] = A.fl.F.cut.cd; has |= 2; }
  // 2 막기: 빠른 판의 대마법사(판단 수준 pace), 당이 있으면
  S.pk = 0;
  if (W.rules.passives && A.ps.on(W, d)) { const Q = A.ps.P; if (d.st.psv > 0) { av[2] = d.st.psvT >= Q.onT ? 0 : Q.onT - d.st.psvT; S.pk = 1 << (d.st.psv - 1); } else { av[2] = Math.max(0, d.mlog.gdOff + Q.cd - W.t) + Q.onT; S.pk = 7; } cd[2] = Q.cd + Q.onT; has |= 4; }   // 잔기술 (v2.18): 맞는 종류만 응수 (S.pk)
  else if (paceOn(W, d) && d.tac.pace && d.glu > A.pace.P.guard.gluMin + 3) { const g = A.pace.P.guard; av[2] = d.st.guard > 0 ? 0 : Math.max(0, d.mlog.gdOff + g.cd - W.t); cd[2] = g.cd + g.min; has |= 4; }
  // 3 앞 방패: 마법의 간격, 서클 셋부터는 자동 진(간격 autoCd)이 바로 세운다. 아니면 빈 칸이 있어야
  if (S.shN) { const s = W.spells[S.shN]; let t = d.cd[S.shN] > 0 ? d.cd[S.shN] : 0; if (d.circles >= 3) { if (d.autoCd > t) t = d.autoCd; } else { if (d.cast && d.castB) t = Math.max(t, d.cast.T - d.cast.t); t += castTime(W, d, s.cast); } av[3] = t; cd[3] = s.cd; has |= 8; }
  S.shUp = d.buf.front ? d.buf.front.t : 0;
  // 4 벽: 마법의 간격 + 짓는 시간
  if (S.wlN) { const s = W.spells[S.wlN]; av[4] = (d.cd[S.wlN] > 0 ? d.cd[S.wlN] : 0) + castTime(W, d, s.cast); cd[4] = s.cd; has |= 16; }
  // 5 몸 털기: 대응 규칙의 풀기를 여는 판단 수준
  if (W.rules.response && A.resp && A.resp.levelOf(d).unbind) { av[5] = Math.max(0, d.unbindCd - W.t); cd[5] = A.resp.P.unbind.cd; has |= 32; }
  const sl = sk && d.st.stun > 0 ? d.st.stun : 0; S.sl = sl;   // 굳음 (v2.21): 굳음은 털 수 없다(v2.23)
  if (sl > 0) { if (!(d.st.psv > 0 && av[2] === 0)) av[2] = Math.max(av[2], sl); av[3] = Math.max(av[3], sl); av[4] = Math.max(av[4], sl); av[5] = Math.max(av[5], sl); }
  S.has = has; S.fly = fly;
  // 움직임
  const canF = fly || (W.rules.flight && A.fl.canFly(d));   // 땅에 있어도 뜰 수 있으면 날아 비킨다 (뜨는 데 takeoff s)
  S.a = canF ? Math.max(A.fl.F.latG * G, W.rules.snap && d.tac.footwork >= 2 ? A.fl.aF(W, d) : 0) : 0; S.up = Math.max(fly ? 0 : P.takeoff, lock);
  S.walkV = P.walkV * (paceOn(W, d) ? A.pace.P.run : 1);
  // 피할 곳
  const dx = d.x - a.x, dy = d.y - a.y, l = hyp(dx, dy) || 1, ux = dx / l, uy = dy / l, cx = d.x + d.vx * h * 0.5, cy = d.y + d.vy * h * 0.5, D = P.slotD;
  S.ux = ux; S.uy = uy; S.x = cx; S.y = cy;
  const blk = S.blk, geo = S.geo, low = d.z < 2;
  for (let j = 0; j < 9; j++) {
    const x = cx + (ux * OX[j] - uy * OY[j]) * D * (j ? 1 : 0), y = cy + (uy * OX[j] + ux * OY[j]) * D * (j ? 1 : 0); S.bx[j] = x; S.by[j] = y;
    let g = 0, why = 0;
    if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1) { g = Infinity; why = 1; }
    else if (W.rules.saltRing && A.sr && A.sr.outSalt(W, x, y)) { g = Infinity; why = 1; }
    else if (low) {
      for (const o of W.obs) if (hyp(o.x - x, o.y - y) < o.r + 0.6) { g = Infinity; why = 2; break; }
      if (g === 0 && W.walls.length) { const q = C.wallsIn(W, x - 1.5, y - 1.5, x + 1.5, y + 1.5); for (let i = 0; i < q.length; i++) { const w = W.walls[q[i]]; if (hyp(w.x - x, w.y - y) < w.r + 0.6) { g = Infinity; why = 3; break; } } }
      if (g === 0 && !fly) for (const t of W.traps) if (t.src.side === a.side && !t.done && t.seen.has(d.id) && hyp(t.x - x, t.y - y) < (t.r || 1) + 0.6) { g = Infinity; why = 4; break; }
    }
    geo[j] = g; let b = g;
    if (!fly) for (const ar of W.areas) if (ar.src.side === a.side && ar.t > b && hyp(ar.x - x, ar.y - y) < ar.r + 0.3) { b = ar.t; if (!why) why = 5; }   // 터질 때까지
    blk[j] = b; S.why[j] = why;   // 막은 까닭: 1 끝·소금 2 바위 3 벽 4 덫 5 지연 폭발
  }
  return S;
}
// 움직여서 τ s 안에 r m를 비킬 수 있나: 날면 ½·a·τ², 땅이면 걸음. 옆 튀기는 a + 5 g, 구르기는 roll.disp
function moveOK(S, tau, r) { const t = tau - S.up; return t > 0 && ((S.a > 0 && 0.5 * S.a * t * t >= r) || S.walkV * t * 0.7 >= r); }
function cutOK(S, tau, r) { return 0.5 * (S.a + P.res.cut.g * G) * tau * tau >= r; }
function rollOK(S, tau, r) { return tau >= 0.08 && P.res.roll.disp >= r; }
// 지금의 방어 여유: within s 안에 쓸 수 있는 자원 수 + (열린 피할 곳이 있고 움직일 수 있으면 1). 지표·그물 판단
function slack(S, within) {
  let n = 0; for (let i = 0; i < 6; i++) if (S.has & (1 << i) && S.av[i] <= within) n++;
  for (let j = 1; j < 9; j++) if (S.blk[j] <= within && moveOK(S, within + 0.25, 1.5)) { n++; break; }
  return n;
}
// 굳거나 묶이거나 떨어지는 상대가 τ s 뒤 있을 자리 (v2.16): 몸을 못 쓰는 동안은 길이 정해져 있다. 떨어지면 중력·공기(× (1 − 0.5 dt)), 땅에서 굳으면 걸음 가속 9로 선다, 풀리면 그 빠르기로. 결과는 AIM
const AIM = { x: 0, y: 0, lock: 0 };
function aim(W, e, tau) {
  const dt = W.dt, n = Math.min(90, Math.ceil(tau / dt)); let x = e.x, y = e.y, z = e.z, vx = e.vx, vy = e.vy, vz = e.vz || 0, fall = e.fly === 2, st = e.st.stun > e.st.root ? e.st.stun : e.st.root;
  for (let i = 0; i < n; i++) {
    if (fall) { vz -= G * dt; z += vz * dt; const k = 1 - 0.5 * dt; vx *= k; vy *= k; if (z <= 0) { fall = false; z = 0; if (st < P.fallT) st = P.fallT; } }
    else if (st > 0) { const k = 1 - Math.min(1, dt * 9); vx *= k; vy *= k; }
    st -= dt; x += vx * dt; y += vy * dt;
  }
  AIM.x = x < 0.4 ? 0.4 : x > W.width - 0.4 ? W.width - 0.4 : x; AIM.y = y < 0.4 ? 0.4 : y > W.height - 0.4 ? W.height - 0.4 : y; AIM.lock = st;
  return AIM;
}
module.exports = { P, RES, RI, MOVE, FM, aim, AIM, OX, OY, ra, newSide, build, moveOK, cutOK, rollOK, slack, paceOn };
}, {"../../../data/plan.json":"data/plan.json","../util":"src/brain/util.js"}];
D["src/brain/read.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 1: 읽기 (과녁과 성향, 위협)
 * 과녁: 약자부터(focusLow) 또는 가장 가까운 자. 성향(prefR·aggr·dodge·rest)은 새 객체를 만들지 않고 K에 둔다 (속도, 1.11.1). 규칙의 aim 훅이 고친다(파도).
 * 위협: 날아오는 투사체, 적의 예비동작(읽기, 초보는 못 한다), 보이는 구름, 해로운 지대. 피할 쪽을 정하고 구른다 */
const { C, hyp, deck } = require('./util');
const learn = require('./techniques/learn'), position = require('./techniques/position');
// 과녁과 성향: 과녁이 없으면 false
function aimAt(W, m, K) {
  const foes = W.foes[m.side], S = W.spells, T = m.tac;
  if (!foes.length) { m.mv.x = m.mv.y = 0; return false; }
  let e = null, bs = 1e9;
  for (const q of foes) { const d = hyp(q.x - m.x, q.y - m.y), sc = T.focusLow ? q.hp / q.hpMax * 40 + d : d; if (sc < bs) { bs = sc; e = q; } }
  K.foes = foes; K.S = S; K.T = T; K.prefR = T.prefR; K.aggr = T.aggr; K.dodgeK = T.dodge; K.rest = T.rest; K.e = e; K.wantMem = false;
  const h = W._bh.aim; for (let i = 0; i < h.length; i++) h[i](W, m, K);   // 파도 위의 성향·상대의 파도 읽기·파도 고르기 (rules/wave), 구르는 쪽 기록 (rules/risk)
  K.mem = learn.mem(W, m, K);   // 판 중 학습 (전설): 과녁이 구르는 쪽과 방패를 드는 거리
  const Dm = deck(m, S), De = deck(e, S); K.Dm = Dm; K.De = De;
  position.outrange(W, m, K);   // 사거리 밖 (대가)
  const d2 = hyp(e.x - m.x, e.y - m.y) || 0.01, ux = (e.x - m.x) / d2, uy = (e.y - m.y) / d2, d = m.z || e.z ? C.hyp3(d2, 0, e.z - m.z) : d2;   // 거리는 높이를 넣어, 방향은 땅 위로 (v2.0)
  const los = !C.blocked(W, m.x, m.y, e.x, e.y, m.z > e.z ? m.z : e.z);
  if (m.thinkAt != null && !m.losWas) m.log.coverT += W.t - m.thinkAt; m.thinkAt = W.t; m.losWas = los;   // 엄폐 시간: 과녁과 사이가 막혀 있던 시간
  K.d = d; K.ux = ux; K.uy = uy; K.los = los;
  K.vt = (e.vx * -ux + e.vy * -uy);           // 적이 나에게 다가오는 속도 (m/s)
  K.eDown = e.st.stun > 0 || e.st.root > 0;
  return true;
}
// 규칙이 이 예비동작을 숨기는가 (이단, rules/wave)
function hidden(h, W, q, c, m) { for (let i = 0; i < h.length; i++) if (h[i](W, q, c, m)) return true; return false; }
function readThreats(W, m, K) {
  const { foes, T, dodgeK, ux, uy } = K;
  let dodge = null, aimed = false, threat = null, late = null;
  K.blindR = false; const hr = W._bh.read; for (let i = 0; i < hr.length; i++) hr[i](W, m, K);   // 눈멂 (rules/control): 예비동작과 구름을 못 읽고, 자동 진은 마지막 0.2 s에야
  const blindR = K.blindR, hc = W._bh.hideCast;
  for (const p of W.proj) {
    if (p.src === m || (!W.rules.friendlyFire && p.src.side === m.side)) continue;
    const rx = m.x - p.x, ry = m.y - p.y;
    if (p.home && p.src.side !== m.side && rx * rx + ry * ry < 12.25) { dodge = { x: rx, y: ry }; continue; }
    const vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv;
    if (t > 0 && t < 0.8 && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 0.55) { dodge = { x: -p.vy, y: p.vx, perp: 1 }; aimed = true; }
  }
  if (T.readCast) for (let i = 0; i < foes.length; i++) for (let j = 0; j < 2; j++) {   // 초보는 날아오는 투사체만 본다: 예비동작·구름·지대를 못 읽는다
    const q = foes[i], c = j ? q.castB : q.cast;
    if (!c || !C.THREAT[c.s.t]) continue;
    if (hc.length && hidden(hc, W, q, c, m)) continue;
    const r = c.s.t === 'area' ? c.s.r * C.sizeOf(q, c.s) + 0.4 : 0.8;
    if (blindR) { if (hyp(c.tx - m.x, c.ty - m.y) < r && c.T - c.t < 0.2) { late = c; late.by = q; } continue; }
    if (hyp(c.tx - m.x, c.ty - m.y) < r) { aimed = true; threat = c; threat.by = q; if (c.T - c.t < 0.5) dodge = dodge || { x: -uy, y: ux, perp: 1 }; }
  }
  for (const a of W.areas) if ((a.src.side !== m.side && a.vis && T.readCast && !blindR || a.src === m) && hyp(a.x - m.x, a.y - m.y) < a.r + 0.5) dodge = { x: m.x - a.x || 0.1, y: m.y - a.y || 0.1 };
  // 날아오는 돌(곡사)도 떨어질 자리를 보고 비킨다 (v2.0. 1.x에선 곡사를 읽지 않아 아무도 피하지 않았다)
  if (T.readCast && !blindR && T.readLob) for (const l of W.lobs) if (l.src.side !== m.side && hyp(l.x - m.x, l.y - m.y) < l.r + 0.5) dodge = { x: m.x - l.x || 0.1, y: m.y - l.y || 0.1 };
  if (T.readCast) for (const z of W.zones) if (z.src.side !== m.side && (z.k === 'fire' || z.k === 'h2s' || z.k === 'nh3' || z.k === 'acid' || z.k === 'spore' || z.k === 'ice') && C.inZone(z, m.x, m.y)) dodge = { x: m.x - z.x || 0.1, y: m.y - z.y || 0.1 };
  // 옆으로 피할 땐 버릇대로 쪽을 고른다 (1.6.0). 버릇이 없으면 늘 왼쪽(1.5.0까지)
  if (dodge && dodge.perp && m.rollPref && (W.rng() < m.rollPref ? m.rollSide : -m.rollSide) < 0) { dodge.x = -dodge.x; dodge.y = -dodge.y; }
  // 굳거나 묶이면 구르지 못한다 (1.7.0 버그 수정, SPEC 9장). 균사·경직도 (1.11.0)
  if (dodge && m.rollCd <= 0 && m.stam > 1.5 && !(m.st.stun > 0 || m.st.root > 0 || m.st.mycel > 0 || m.st.cramp > 0) && W.rng() < Math.min(T.rollCap, 0.4 + dodgeK * 0.4 + (m.autoDodge ? 0.3 : 0))) {
    const l = hyp(dodge.x, dodge.y) || 1; let mine = false; for (const a of W.areas) if (a.src === m && hyp(m.x + dodge.x / l * 2 - a.x, m.y + dodge.y / l * 2 - a.y) < a.r + 0.5) { mine = true; break; }
    if (mine) { dodge.x = -dodge.x; dodge.y = -dodge.y; }   // 내 폭발 쪽으로는 구르지 않는다
    C.roll(W, m, dodge.x, dodge.y, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8);   // 석회가 붙으면 구르는 거리 절반
  }
  K.dodge = dodge; K.aimed = aimed; K.threat = threat; K.late = late;
}
module.exports = { aimAt, readThreats };
}, {"./util":"src/brain/util.js","./techniques/learn":"src/brain/techniques/learn.js","./techniques/position":"src/brain/techniques/position.js"}];
D["src/brain/skills.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 판단 수준 (brain/skills, SPEC 13장)
 * 등급(힘)과 따로 고르는 솜씨 다섯 단계: 초보·중급·상급·대가·전설. 값은 data/skills.json.
 * 단계마다: 판단 간격 dec, 겨냥 흔들림 noise, 자동 구르기, 쓰는 서클(그릇 × 솜씨), 성향과 기술 스위치(tac).
 * from: 'basic'이면 기본기(basic) 위에, 단계 이름이면 그 단계의 tac 위에 덧쓴다. 구르기 상한·버릇(roll)은 모든 단계에 */
const D = require('../../data/skills.json');
// 실제로 쓰는 서클 = 그릇(등급) × 솜씨 (1.7.0)
const CIRC = { half: c => Math.max(1, Math.floor(c / 2)), minus1: c => Math.max(1, c - 1), same: c => c, plus1: c => c + 1 };
// 기술 스위치(tac) → 기술 파일 (techniques/). 무슨 단계가 무슨 기술을 켜는지 보일 때 쓴다
const TECH = { combo: 'combo', combo2: 'combo', plan: 'combo', cancel: 'cancel', cancel2: 'cancel', feint: 'feint', simul: 'simul', triple: 'simul', pause: 'tempo', tempo: 'tempo', bait: 'bait', learn: 'learn', counter: 'counter', cover: 'cover', strip: 'cover', outrange: 'position', terrain: 'position', lure: 'lure', fakeRetreat: 'lure', herd: 'herd', crowd: 'crowd', dodgeAim: 'dodgeAim', grab: 'grab', swarm: 'swarm', siege: 'siege', wallSite: 'siege', wallBreak: 'siege', retreat: 'siege', rhythm: 'rhythm', rhythmTime: 'rhythm', domainPush: 'rhythm', efficacy: 'efficacy', buffNeed: 'efficacy', shape: 'shape', roles: 'shape', survive: 'survive', sharp: 'sharp' };   // hold는 규칙(rules/hold)의 두뇌 훅
const SKILLS = {}, CIRCLES = {};
for (const name in D.levels) {
  const L = D.levels[name], base = L.from === 'basic' ? D.basic : SKILLS[L.from].tac;
  if (!base) throw new Error('판단 수준 ' + name + ': 없는 바탕 ' + L.from);
  SKILLS[name] = { dec: L.dec, noise: L.noise, autoDodge: L.autoDodge, tac: Object.assign({}, D.roll, Object.assign({}, base, L.tac)) };
  if (!CIRC[L.circles]) throw new Error('판단 수준 ' + name + ': 없는 서클 규칙 ' + L.circles);
  CIRCLES[name] = CIRC[L.circles];
}
// 이 단계가 켜는 기술 파일들
function techniquesOf(name) { const t = SKILLS[name] && SKILLS[name].tac, out = []; if (!t) return out; for (const k in TECH) if (t[k] && !out.includes(TECH[k])) out.push(TECH[k]); return out; }
module.exports = { SKILLS, CIRCLES, TECH, techniquesOf };
}, {"../../data/skills.json":"data/skills.json"}];
D["src/brain/stance.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 2: 입장 (보통·버티기·돌파·거리 두기)
 * 8 m 안에 적이 셋 이상이면(tac.stance): 적이 제 손끝에서 마법을 못 짓는 곳(내 장악권)이면 버티고, 아니면 가장 트인 쪽으로 뚫는다. 뚫은 뒤엔 거리를 둔다 */
const { C, hyp, deck, obsNear, anyNear, DIR16 } = require('./util');
function chooseStance(W, m, K) {
  const { foes, S, T } = K;
  // ---- 2. 입장: 둘러싸였을 때 버틸 것인가, 뚫을 것인가 ----
  let near = 0, suppSum = 0, unsup = 0;
  for (const q of foes) {
    if (hyp(q.x - m.x, q.y - m.y) >= 8) continue; near++;
    const g = W.rules.domain ? C.gOf(W, C.share(W, q, q.x, q.y)) : 1;   // 그 적이 제 손끝에서 마법을 지을 수 있는 정도
    const mund = deck(q, S).mund;
    suppSum += g; if (g > 0.5 || mund) unsup++;
  }
  let stance = 'normal', escape = null;
  if (T.stance && near >= 3) {
    if (unsup <= 1 && suppSum / near < 0.35) stance = 'hold';
    else {
      stance = 'breakout';
      let bd = null, bsc = -1e9;
      for (let k = 0; k < 16; k++) {
        const dx = DIR16[k][0], dy = DIR16[k][1]; let sc = 0;
        for (const q of foes) { const qx = q.x - m.x, qy = q.y - m.y, dq = hyp(qx, qy) || 1; if ((qx * dx + qy * dy) / dq > 0.6) sc -= 3 / Math.max(1, dq / 3); }
        let room = 0; for (let s2 = 1; s2 <= 14; s2++) { const px = m.x + dx * s2, py = m.y + dy * s2; if (px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1) break; if (obsNear(W, px, py, 0.3)) break; room = s2; }
        sc += room * 0.4; if (sc > bsc) { bsc = sc; bd = { dx, dy }; }
      }
      const bl = foes.filter(q => { const qx = q.x - m.x, qy = q.y - m.y, dq = hyp(qx, qy) || 1; return dq < 10 && (qx * bd.dx + qy * bd.dy) / dq > 0.6; }).sort((a, b) => hyp(a.x - m.x, a.y - m.y) - hyp(b.x - m.x, b.y - m.y));
      escape = { dir: bd, bl };
    }
  } else if (T.stance && m.stance === 'breakout' || (m.stance === 'kite' && anyNear(foes, m, 12))) stance = 'kite';
  m.stance = stance;

  K.stance = stance; K.escape = escape;
}
module.exports = { chooseStance };
}, {"./util":"src/brain/util.js"}];
D["src/brain/techniques/bait.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 방어 미끼 (전설, tac.bait)
 * 위협이 없을 때 가끔 반응형 방패를 보란 듯이 든다. 그걸 보고 상대가 시전을 시작하면 가장 빠른 공격으로 벌한다(1.5 s 안). 엔진이 맞힌 것을 방어 적중으로 센다 */
const { landDelay } = require('../util');
function value(W, m, K, o) { if (K.T.bait && m.baitT != null && W.t - m.baitT < 1.5 && (K.e.cast || K.e.castB) && o.isOff) o.v *= 3 / (o.Tw + landDelay(o.s, K.d) + 0.2); }
// 고른 뒤: 미끼를 들지 (K.best를 방패로 바꾼다)
function start(W, m, K) {
  const { T, S, e, d, aimed, slot } = K;
  if (!(T.bait && !aimed && slot === 'A' && d > 4 && d < 10 && !(e.cast || e.castB) && (m.baitT == null || W.t - m.baitT > 4) && W.rng() < 0.05)) return;
  const x = m.book.map(k => S[k]).find(q => q && q.t === 'buff' && q.react && q.b.front && !((m.cd[q.n] || 0) > 0) && m.glu > q.cost);
  const bc = x && { s: x, n: x.n, v: 1, v2: 1, tx: m.x, ty: m.y, Tw: x.cast * (1 - 0.35 * (m.mast[x.n] || 0)), cost: x.cost };
  if (bc) { K.best = bc; m.baitT = W.t; m.baitDone = 0; }
}
module.exports = { value, start };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/cancel.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 캔슬 (상급 tac.cancel, 대가 tac.cancel2)
 * 캔슬: 쏘는 중에 과녁이 구르기 시작했거나, 계획한 콤보의 묶기가 빗나갔으면 끊는다. 기회 캔슬: 과녁이 묶였는데 지금 시전이 그 틈에 맞지 않으면 끊고 결정타로.
 * 끊으면 당의 70%를 돌려받고, 그 마법의 간격은 0.5 s로 줄인다 */
const { OFF } = require('../util');
function undo(m, c) { m.cast = null; m.glu += (c.cost || 0) * 0.7; m.cd[c.s.n] = Math.min(m.cd[c.s.n] || 0, 0.5); m.log.cancel++; }
function opportunity(W, m, K) {
  if (K.T.cancel2 && m.phase !== 'in' && m.cast && !m.cast.feint && !m.cast.down && OFF[m.cast.s.t] && K.eDown && m.cast.T - m.cast.t > 0.1 && !(m.simul && m.simul.a === m.cast.s.n)) undo(m, m.cast);
}
function onDodge(W, m, K) {
  const e = K.e;
  if (K.T.cancel && m.cast && !m.cast.feint && OFF[m.cast.s.t] && m.cast.tgt === e && m.cast.T - m.cast.t > 0.08) {
    const c = m.cast, missed = m.combo === null && c.fin && !(e.st.root > 0 || e.st.stun > 0) && W.t > c.fin;
    if ((e.roll > 0 && !c.roll0) || missed) undo(m, c);
  }
}
module.exports = { undo, opportunity, onDodge };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/combo.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 콤보 (중급 tac.combo: 묶인 적을 보이는 대로 잇는다, 상급 tac.combo2: 두 수 콤보 계획)
 * 두 수 계획: 묶기를 쏘면 묶인 동안 떨어질 결정타를 예약하고, 그 자리를 비워 둔다. 묶기가 빗나가면(tac.cancel) 계획을 버린다 */
const { hyp, OFF, isSetup, landDelay, bindOf, estDmg } = require('../util');
// 판단 첫머리: 묶기가 빗나갔으면 계획을 버린다
function drop(W, m, K) { const e = K.e; if (K.T.cancel && m.combo && m.combo.tgt === e && W.t > m.combo.land + 0.15 && !(e.st.root > 0 || e.st.stun > 0)) m.combo = null; }
// 지금 계획 (없으면 null)
function planOf(W, m, K) { return K.T.combo2 && m.combo && m.combo.tgt === K.e && W.t < m.combo.until ? m.combo : null; }
function value(W, m, K, o) {
  const plan = K.plan; if (!(plan && o.isOff)) return;
  const e = K.e;
  if (o.n === plan.fin) { const left = Math.max(e.st.root || 0, e.st.stun || 0); if (left > o.Tw + landDelay(o.s, K.d)) { o.v = Math.max(o.v, 0.6) * 3; o.tx = e.x; o.ty = e.y; } else o.v = 0; }   // 묶였고 묶인 동안 닿을 때만
  else if (!isSetup(o.s) && W.t < plan.land + plan.bind) o.v *= 0.3;   // 결정타 자리를 비워 둔다
}
// 시전을 건 뒤: 콤보 시도 세기
function tried(W, m, K, best, Tc) {
  const { e, plan, cb } = K, s = best.s;
  const intent = OFF[s.t] && ((best.down || (cb && e.st.wet > 0 && s.t === 'thread')) || (plan && s.n === plan.fin));
  if (intent) { const kind = plan && s.n === plan.fin ? 'plan' : 'react'; m.log.comboTry++; m.log.cTry[kind] = (m.log.cTry[kind] || 0) + 1; m.comboPend = { tgt: e, kind, until: W.t + Tc + landDelay(s, hyp(best.tx - m.x, best.ty - m.y)) + 0.6 }; if (plan) m.combo = null; }
  if (m.combo && m.combo.tgt === e && !m.combo.logged) { m.combo.logged = 1; m.log.cPlan = (m.log.cPlan || 0) + 1; }
}
// 두 수 콤보를 여는 묶기를 쏘면 결정타를 예약한다 (묶기가 떨어질 때와 묶이는 시간)
function plan(W, m, K, s, Tc) {
  const { S, T, e, d } = K;
  const bind = T.combo2 && OFF[s.t] ? bindOf(s, e) : 0;
  if (bind >= 0.3) {
    const fin = m.book.filter(k => S[k] && OFF[S[k].t] && k !== s.n && !bindOf(S[k], e)).sort((a, b) => estDmg(S[b]) - estDmg(S[a]))[0];
    if (fin) { m.combo = { tgt: e, fin, land: W.t + Tc + landDelay(s, d), bind, until: W.t + Tc + 3 }; m.thinkT = Math.min(m.thinkT, m.combo.land - W.t + 0.04); }   // 묶기가 떨어지는 순간에 맞춰 다시 판단한다
  }
}
module.exports = { drop, planOf, value, tried, plan };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/counter.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 덱 읽기 (전설, tac.counter)
 * 상대 책의 피해 종류를 읽어 천적(절연·둔기 막이·해독, 불에는 비·안개)을 먼저 쓴다. 상대가 그 종류를 부르는 중이면 먼저, 아니면 한가할 때 조금 */
const { counters, kindOf } = require('../util');
function value(W, m, K, o) {
  const s = o.s, e = K.e;
  if (K.T.counter && K.d < 14 && counters(s, K.ek, m, W)) { const hot = [e.cast, e.castB].some(c => c && kindOf(c.s) && counters(s, { [kindOf(c.s)]: 1 }, m, W)); const vc = hot ? 0.9 : 0; if (o.v < vc) { o.v = vc; if (s.t === 'buff' || (s.z && s.z.k === 'rain')) { o.tx = m.x; o.ty = m.y; } } }
}
module.exports = { value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/cover.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 엄폐 (상급, tac.cover)와 엄폐 걷어내기 (대가, tac.strip)
 * 엄폐: 과녁에서 보아 바위 뒤, 내 사거리 안의 자리로 간다. 날카롭게(대가부터, v2.8)는 제가 세운 벽·기둥 뒤로도(둘 다 2 m 아래일 때). 제 벽은 거리를 0.4로 쳐 15 m에서도 돌아온다(v2.9). 걷어내기: 과녁이 바위 뒤에 숨었으면 불·산 지대를 그 자리에, 지연 폭발·곡사를 더 쓴다 */
const { hyp, maxRange } = require('../util'), SH = require('./sharp');
// 움직임: 엄폐로 가는가
function steer(W, m, K) {
  const { T, los, e, S } = K;
  if (!(T.cover && los)) return false;
  let best = null, bd2 = 6;
  const own = T.sharp && m.C >= 5 && !(m.z > 2) && !(e.z > 2);   // 날카롭게 (v2.8): 내가 세운 벽·기둥 뒤에도 (둘 다 낮을 때)
  for (let i = 0, n = W.obs.length + (own ? W.walls.length : 0); i < n; i++) { const o = i < W.obs.length ? W.obs[i] : W.walls[i - W.obs.length]; if (i >= W.obs.length && o.mk !== m.id) continue; const ox = o.x - e.x, oy = o.y - e.y, ol = hyp(ox, oy) || 1, px = o.x + ox / ol * (o.r + 0.7), py = o.y + oy / ol * (o.r + 0.7), de = hyp(px - e.x, py - e.y), dm = hyp(px - m.x, py - m.y) * (i < W.obs.length ? 1 : SH.P.ownCover); if (dm < bd2 && de > 3 && de < maxRange(m, S) && px > 1 && py > 1 && px < W.width - 1 && py < W.height - 1) { bd2 = dm; best = [px, py]; } }
  if (!best) return false;
  const l = hyp(best[0] - m.x, best[1] - m.y) || 1; K.vx += (best[0] - m.x) / l * T.coverW; K.vy += (best[1] - m.y) / l * T.coverW;
  return true;
}
function strip(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.strip && !K.los && W.obs.some(b => hyp(b.x - e.x, b.y - e.y) < b.r + 1.5)) { if (s.t === 'zone' && (s.z.k === 'fire' || s.z.k === 'acid')) { o.v = Math.max(o.v, 0.9); o.tx = e.x; o.ty = e.y; } else if (s.t === 'area' || s.t === 'lob') o.v *= 1.5; }
}
module.exports = { steer, strip };
}, {"../util":"src/brain/util.js","./sharp":"src/brain/techniques/sharp.js"}];
D["src/brain/techniques/crowd.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 뭉친 곳 치기 (tac.crowd, 초보는 없음)
 * 넓은 마법(지연 폭발·지대·곡사·뿜기)은 떨어질 자리 둘레의 적 수만큼 값이 커진다 (한 명 더마다 × 1.6) */
const { hyp, C } = require('../util');
function value(W, m, K, o) {
  const s = o.s;
  if (!(K.T.crowd && (s.t === 'area' || s.t === 'zone' || s.t === 'lob' || s.t === 'cone'))) return;
  const rr = s.t === 'cone' ? 2 : (s.r || (s.z && (s.z.r || (s.z.len || 0) / 2)) || 1.5) * C.sizeOf(m, s);
  let cnt = 0; for (const q of K.foes) if (hyp(q.x - o.tx, q.y - o.ty) < rr + 0.4) cnt++; if (cnt > 1) o.v *= 1 + 0.6 * (cnt - 1);
}
module.exports = { value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/dodgeAim.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 피할 자리 겨냥 (상급부터, tac.dodgeAim, rules/risk가 부른다)
 * 큰 구름은 과녁이 구를 수 있으면 구를 쪽으로 1.1 m 기울인다. 구를 쪽은 막힌 쪽의 반대, 아니면 본 버릇(학습 기록), 모르면 오른쪽 */
const { rollSide } = require('../util');
function value(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.dodgeAim && s.big && s.t === 'area' && e.rollCd <= 0 && e.stam > 1.5 && !K.eDown && !(e.st.mycel > 0 || e.st.cramp > 0)) { const sd = rollSide(W, e, K.ux, K.uy, K.mem); o.tx += -K.uy * sd * 1.1; o.ty += K.ux * sd * 1.1; }
}
module.exports = { value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/efficacy.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 효과 학습과 강화의 때 (v2.2, SPEC 26장)
 * 둘 다 선명도 5 이상(상위·대마법사)만 쓴다.
 * 효과 학습(tac.efficacy, 대가부터): 판 중에 마법마다 쓴 수 대비 맞힌 수를 센다(기록 log.casts·hits). 세 번 넘게 쓴 공격은
 *   값 × clamp((내 명중률 / 내 공격 전체의 명중률)^1.5, 0.1, 1.4), 다섯 번 넘게 쓰고 한 번도 못 맞혔으면 0. 계속 빗나가는 수는 덜 쓰고 먹히는 수를 더 쓴다
 * 강화의 때(tac.buffNeed, 상급부터): 걸음 강화(근육 폭주·다리 자극)는 필요한 순간에만 — 걸어서(날면 걸음 강화가 뜻이 없다)
 *   돌파·거리 두기 중이거나, 빠지는 중이거나, 들어가는데 아직 멀거나(들어갈 거리 + 4 m), 나를 겨눈 큰 수를 피할 때 */
const { OFF } = require('../util');
function prep(W, m, K) {
  K.effHR = 0; if (!m.tac.efficacy || m.C < 5) return;
  let c = 0, h = 0; const L = m.log; for (const n of m.book) { const s = K.S[n]; if (!s || !OFF[s.t]) continue; const k = L.casts[n] || 0; c += k; h += Math.min(k, L.hits[n] || 0); }
  K.effHR = c >= 6 ? (h + 1) / (c + 2) : 0;
}
function value(W, m, K, o) {
  const T = m.tac, s = o.s;
  if (T.efficacy && o.isOff && K.effHR > 0) { const c = m.log.casts[o.n] || 0; if (c >= 5 && !(m.log.hits[o.n] > 0)) o.v = 0;   // 다섯 번 넘게 쓰고 한 번도 못 맞힌 수는 버린다
    else if (c >= 3) { const hr = (Math.min(c, m.log.hits[o.n] || 0) + 0.3) / (c + 1), q = hr / (K.effHR > 0.05 ? K.effHR : 0.05), k = q * Math.sqrt(q); o.v *= k < 0.1 ? 0.1 : k > 1.4 ? 1.4 : k; } }
  if (T.buffNeed && m.C >= 5 && s.t === 'buff' && s.b.speed) {
    const need = m.fly !== 1 && (K.stance === 'breakout' || K.stance === 'kite' || m.phase === 'out' || (m.phase === 'in' && K.d > K.prefR + 4) || (K.aimed && K.threat && K.threat.s.big));
    if (!need) o.v = 0;
  }
}
module.exports = { prep, value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/engage.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 교전 유지 (v2.13, tac.engage 1·2, 상급부터 2, SPEC 37장, 수는 data/engage.json) — 결판 뒤에 멍하니 서 있지 않는다
 * 사거리 R: 상대가 떠 있으면 실·곧은 투사체의 가장 긴 사거리(지연 폭발·곡사는 떠 있으면 닿지 않는다), 아니면 가장 긴 공격 사거리
 * 늘: 선호 거리는 R × reachK 0.9 안, 상대가 R 밖이면 작전의 둘레 걸음을 쉬고 다가간다(K.closeIn). 쏠 것 없이 idle이 지나면 빈 칸을 준비에
 * 1: 아무 칸도 짓지 않고 idle 1.2 s가 지났는데 상대가 R × closeK 0.65 밖이면 거기까지 다가간다
 *   (청사진의 짓기·작전의 자리·벽 자리가 지금 거리를 붙들어 둘 다 사거리 밖에서 섰다: 침묵의 70%가 45 m 넘게 떨어져 있었다)
 * 2 (상급부터): 끝내기 작전이거나 상대 체력이 low 0.3 아래면 쫓는다(사거리 × chaseK 0.45까지), 숨은 상대 자리엔 지연 폭발·곡사·번쩍임 × huntK(들추기·몰이 그물)
 *   몰린 쪽(내 체력이 low 아래이고 상대보다 낮음): 사거리 × kiteK 0.8을 지키며 견제하고(도망치며 쏜다), 빈 칸은 준비(덫·지대)에, 남은 몫이 breathR 0.6 아래면 숨(rules/breath가 K.low를 본다) */
const { OFF } = require('../util');
const P = require('../../../data/engage.json');
// 떠 있는 상대에 닿는 사거리: 실·곧은 투사체 가운데 가장 긴 것 (지연 폭발·곡사는 떠 있으면 닿지 않는다). 덱마다 한 번
const FR = new WeakMap();
function fastR(W, m, K) { let r = FR.get(K.Dm); if (r !== undefined) return r; r = 0; for (let i = 0; i < K.Dm.sp.length; i++) { const s = K.Dm.sp[i]; if ((s.t === 'thread' || (s.t === 'proj' && !s.home)) && K.Dm.R[i] > r) r = K.Dm.R[i]; } if (!r) r = K.Dm.maxR; FR.set(K.Dm, r); return r; }
function adjust(W, m, K) {
  const L = m.tac.engage || 0; if (!L || K.foes.length > 2) return;   // 결투에서만: 무리 싸움은 협공(swarm)·성(siege)이 자리를 잡는다 (대마법사가 무리 쪽으로 다가가니 협공의 둘레 나누기가 깨졌다)
  const e = K.e, R = e.z >= 1 ? fastR(W, m, K) : K.Dm.maxR, busy = m.cast || m.castB || m.chan, idle = !busy && W.t - m.lastRel > P.idle;
  K.low = false; K.chase = false; K.closeIn = false;
  if (L >= 2 && m.hp < P.low * m.hpMax && e.hp > m.hp) {   // 몰린 쪽
    K.low = true; if (K.prefR < P.kiteK * R) K.prefR = P.kiteK * R; K.waitT = W.t; if (!K.mode || K.mode === 'throw') K.mode = 'poke'; return;
  }
  if (L >= 2 && ((m.op && m.op.cur === 'finish') || e.hp < P.low * e.hpMax)) { K.chase = true; if (K.d > P.chaseK * R) K.closeIn = true; if (K.prefR > P.chaseK * R) K.prefR = P.chaseK * R; K.aggr *= 1.3; if (m.phase === 'build') m.phase = 'in'; return; }   // 쫓는다
  if (K.prefR > P.reachK * R) K.prefR = P.reachK * R;   // 닿지 않는 거리를 바라지 않는다 (작전의 소모가 곡사 사거리로 물러나 떠 있는 상대엔 아무것도 닿지 않았다)
  if (K.d > R) K.closeIn = true;
  if (idle && K.d > P.closeK * R) { K.closeIn = true; if (K.prefR > P.closeK * R) K.prefR = P.closeK * R; if (m.phase === 'build') m.phase = 'probe'; }   // 다가간다
  if (idle) K.waitT = W.t;   // 쏠 게 없으면 준비(덫길·지대)에 (날카롭게의 wait)
}
// 쫓는 동안 숨은 상대 자리에: 지연 폭발·곡사·번쩍임
function value(W, m, K, o) {
  if (!K.chase || K.los || !(o.v > 0)) return; const t = o.s.t;
  if (t === 'area' || t === 'lob' || t === 'flash') { o.v *= P.huntK; o.tx = K.e.x; o.ty = K.e.y; }
}
module.exports = { adjust, value, P };
}, {"../util":"src/brain/util.js","../../../data/engage.json":"data/engage.json"}];
D["src/brain/techniques/feint.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 속임수 (대가 0.08, 전설 0.12, tac.feint = 확률)
 * 상대가 자동 진이나 구르기로 반응할 수 있으면, 가끔 가장 큰 예비동작을 먼저 보인다. 상대가 반응했으면 끊고 다른 마법으로, 반응이 없으면 진짜로 쏜다 */
const { OFF, estDmg, circOf } = require('../util');
// 판단 첫머리: 보인 예비동작에 상대가 반응했는가
function react(W, m, K) {
  if (!(m.cast && m.cast.feint)) return;
  const e = K.e, c = m.cast, f = c.feint, reacted = (e.roll > 0 && !f.roll) || (e.buf.front && !f.front) || e.autoCd > f.auto || W.walls.filter(w => w.own === e.side).length > f.walls;
  if (reacted) { m.cast = null; m.glu += c.cost * 0.7; m.cd[c.s.n] = Math.min(m.cd[c.s.n] || 0, 1); m.log.dec.feint = (m.log.dec.feint || 0) + 1; }
  else if (c.T - c.t < 0.1) c.feint = null;   // 반응이 없으면 진짜로 쏜다
}
// 고른 뒤: 속임수로 바꿀지 (K.best를 바꾸고 속임수 기록을 돌려준다)
function start(W, m, K) {
  const { T, S, e, slot, cand } = K, best = K.best;
  if (!(T.feint && !m.simul && best.s.t !== 'buff' && slot === 'A' && ((e.rollCd <= 0 && e.stam > 1.5) || e.autoDodge || (circOf(W, e) >= 3 && e.book.some(n => S[n] && ((S[n].t === 'buff' && S[n].react) || S[n].t === 'wall')))) && W.rng() < (T.feint === true ? 0.2 : T.feint))) return null;
  const big = cand.filter(c => OFF[c.s.t]).sort((a, b) => estDmg(b.s) - estDmg(a.s) || b.Tw - a.Tw)[0];
  if (!big) return null;
  K.best = big; return { roll: e.roll > 0, front: !!e.buf.front, auto: e.autoCd, walls: W.walls.filter(w => w.own === e.side).length };
}
module.exports = { react, start };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/grab.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 붙잡기 (대가부터, tac.grab, rules/risk가 부른다)
 * 내 큰 구름이 떨어지기 전 과녁이 그 안에 있으면, 두 번째 칸으로 그보다 먼저 닿는 굳히기·묶기·느리게 하기 × 3. 빈손이어도 두 번째 칸은 쓸 수 있다 */
const { hyp, holdsOf, castTime, landDelay } = require('../util');
function value(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.grab && K.slot === 'B' && holdsOf(s, e)) { const a = W.areas.find(a => a.src === m && a.s.big && hyp(a.x - e.x, a.y - e.y) < a.r + 0.3); if (a && castTime(W, m, o.Tw) + landDelay(s, K.d) < a.t) { o.v = Math.max(o.v, 0.5) * 3; } }
}
function commit(W, m, K, s) { const e = K.e; if (K.T.grab && K.slot === 'B' && holdsOf(s, e) && W.areas.some(a => a.src === m && a.s.big && hyp(a.x - e.x, a.y - e.y) < a.r + 0.3)) m.log.grab++; }
module.exports = { value, commit };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/hazard.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 내 위험 지대 비키기 (v2.21, tac.hazard 상급 1·대가·전설 2, 선명도 5 이상, SPEC 45장, 수는 data/hazard.json)
 * 전설끼리의 "실수"로 끝난 판(21%)은 소금 원 절반, 내 지역 마법(낙뢰·대낙뢰가 날며 다가간 나를 친다)과 역류가 나머지였다.
 *   길: 모든 걸음이 정해진 뒤(bound 훅 다음) 내가 깐 지연 폭발·곡사의 반경 + pad 안으로 look s 안에 들어가는 몫을 지우고, 안이면 바깥으로. 소금 원의 벽을 다시 부른다
 *   소금 원: 안전 반경을 salt m 더 안쪽으로 (K.saltPad, rules/saltRing이 읽는다). 끝판의 원은 초당 2 m 줄어 1 s 굳으면 넘어온다
 *   단계 (tac.hazard): 1 상급 길·소금 원, 2 대가·전설 수도 (v2.23)
 *   수 (2부터): 고르기 맨 끝에서 지역 마법이 터질 때 내 자리(지금 + 속도 × 짓는 시간·지연)가 반경 + self m 안이면 버린다 */
const P = require('../../../data/hazard.json');
const { hyp, C } = require('../util');
const on = (m, L = 1) => m.tac.hazard >= L && m.C >= 5;   // 1 상급: 길·소금 원, 2 대가: 수(지역 마법·붙잡은 수)도
function bound(W, m, K) {
  if (!on(m)) return;
  K.saltPad = P.salt;
  let vx = K.vx, vy = K.vy, hit = false;
  for (let k = 0; k < 2; k++) {
    const L = k ? W.lobs : W.areas;
    for (let i = 0; i < L.length; i++) {
      const a = L[i]; if (a.src !== m) continue;
      const dx = m.x - a.x, dy = m.y - a.y, d = hyp(dx, dy) || 0.01, R = (a.r || 1) + P.pad, t = k ? 0.5 : (a.t > 0 ? a.t : 0), sp = hyp(m.vx, m.vy);
      if (d > R + sp * Math.min(t, P.look) + 0.5) continue;
      const ux = dx / d, uy = dy / d, inw = -(vx * ux + vy * uy);
      if (inw > 0) { vx += ux * inw; vy += uy * inw; }   // 다가가는 몫을 지운다 (둘레로 미끄러진다)
      if (d < R) { vx += ux * P.out; vy += uy * P.out; }
      hit = true;
    }
  }
  if (!hit) return;
  K.vx = vx; K.vy = vy;
  const sr = W.rules.saltRing && C.RULES.find(r => r.name === 'saltRing'); if (sr) sr.api.bound(W, m, K, require('../util'));
}
// 고르기 맨 끝 (choose의 값 고치기): 지역 마법이 터질 때 내가 그 안이면 버린다
function value(W, m, K, o) {
  if (!on(m, 2) || !(o.v > 0)) return; const s = o.s; if (s.t !== 'area' && s.t !== 'lob') return;
  const t = o.Tw + (s.delay || 0), x = m.x + m.vx * t, y = m.y + m.vy * t, r = (s.r || 1) * C.sizeOf(m, s) + P.self;
  if (hyp(o.tx - x, o.ty - y) < r || hyp(o.tx - m.x, o.ty - m.y) < r) o.v = 0;
}
module.exports = { bound, value, P };
}, {"../../../data/hazard.json":"data/hazard.json","../util":"src/brain/util.js"}];
D["src/brain/techniques/herd.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 몰이 (대가, tac.herd)
 * 옆으로 움직이는 과녁의 한쪽을 선 지대로 막고, 도망칠 쪽에 함정을 두고, 공격을 그쪽으로 기울인다 (3 s) */
function value(W, m, K, o) {
  const e = K.e, s = o.s;
  if (!(K.T.herd && K.d < 9 && !K.eDown)) return;
  const lat = e.vx * -K.uy + e.vy * K.ux, sd = m.herd && W.t < m.herd.until ? m.herd.side : 0;
  if (s.t === 'zone' && s.z.shape === 'line' && s.z.dps && !sd) { const sg = lat > 0 ? 1 : lat < 0 ? -1 : m.sf; o.v = Math.max(o.v, 0.7); o.tx = e.x - K.uy * sg * 1.8; o.ty = e.y + K.ux * sg * 1.8; }
  if (sd && s.t === 'trap') { o.v = Math.max(o.v, 1.2); o.tx = e.x - K.uy * sd * 1.6; o.ty = e.y + K.ux * sd * 1.6; }
  if (sd && o.isOff && s.t !== 'thread') { o.tx += -K.uy * sd * 0.8; o.ty += K.ux * sd * 0.8; }
}
// 시전을 건 뒤: 선 지대를 깔았으면 몰 쪽을 정한다
function commit(W, m, K, s) {
  const e = K.e;
  if (K.T.herd && s.t === 'zone' && s.z.shape === 'line' && s.z.dps && !(m.herd && W.t < m.herd.until)) { const lat = e.vx * -K.uy + e.vy * K.ux; m.herd = { side: -(lat > 0 ? 1 : lat < 0 ? -1 : m.sf), until: W.t + 3 }; m.lureT = W.t; }
}
module.exports = { value, commit };
}, {}];
D["src/brain/techniques/learn.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 판 중 학습 (전설, tac.learn)
 * 과녁이 구르는 쪽과 방패를 드는 거리를 센다. 구를 쪽으로 겨냥을 옮기고(믿음은 본 수만큼), 방패 거리 근처면 투사체·실을 덜 쓴다.
 * 구르는 쪽 기록은 피할 자리 겨냥(rules/risk의 tac.dodgeAim)도 쓴다: 그 훅이 K.wantMem을 켠다 */
const { hyp } = require('../util');
// 읽기 (과녁을 고른 뒤): 기록을 쌓는다
function mem(W, m, K) {
  const T = K.T, e = K.e;
  if (!(T.learn || K.wantMem)) return null;
  const mem = m.mem[e.id] || (m.mem[e.id] = { L: 0, R: 0, rollT: -9, sh: [], shT: -9 });
  const dx = e.x - m.x, dy = e.y - m.y;
  if (e.roll > 0 && W.t - mem.rollT > 0.3) { if (dx * e.vy - dy * e.vx > 0) mem.L++; else mem.R++; mem.rollT = W.t; }
  if (e.buf.front && W.t - mem.shT > 0.6) { mem.sh.push(hyp(dx, dy)); if (mem.sh.length > 8) mem.sh.shift(); mem.shT = W.t; }
  return mem;
}
// 고르기 전에: 옮길 겨냥과 방패 거리
function prep(W, m, K) {
  const { T, mem, e, d, De } = K;
  K.roll = T.learn && mem && e.rollCd <= 0 ? (mem.L - mem.R) / (mem.L + mem.R + 2) * 1.2 : 0;
  K.shieldNear = T.learn && mem && mem.sh.length >= 2 && Math.abs(d - mem.sh.reduce((a, b) => a + b, 0) / mem.sh.length) < 2.5 && De.front.some(n => !((e.cd[n] || 0) > 0));
}
function value(W, m, K, o) {
  const s = o.s;
  if (K.roll && (m.tac.learnAim === 'wide' ? s.t === 'area' || s.t === 'lob' : s.t === 'proj' || s.t === 'thread')) { const k = m.tac.learnAim === 'wide' ? 0.5 : 1; o.tx += -K.uy * K.roll * k; o.ty += K.ux * K.roll * k; }   // 'wide'(v2.0): 넓은 마법만 반쯤 옮긴다(안 구르면 여전히 맞는다)
  if (K.shieldNear) { if (s.t === 'proj' || s.t === 'thread') o.v *= 0.7; else if (s.t === 'area' || s.t === 'lob') o.v *= 1.25; }
}
module.exports = { mem, prep, value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/lure.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 유도 (대가, tac.lure)와 약한 척 물러서기 (전설, tac.fakeRetreat)
 * 다가오는 적을 내 함정·화약통 너머로(물러서기는 내 지대 너머로도) 끌어들인다. 끌어들인 적이 밟으면 lure로 센다(엔진) */
const { hyp } = require('../util');
function steer(W, m, K) {
  const { T, stance, vt, d, e } = K;
  if (!((T.lure || T.fakeRetreat) && stance === 'normal' && vt > 0.3 && d < 10)) return;
  const pts = [];
  if (T.lure) { for (const t of W.traps) if (t.src === m && t.arm <= 0) pts.push([t.x, t.y, 2]); for (const b of W.barrels) if (!b.ex) pts.push([b.x, b.y, 3.4]); }
  if (T.fakeRetreat) for (const z of W.zones) if (z.src === m && z.dps && z.t > 1) pts.push([z.x, z.y, (z.r || (z.len || 2) / 2) + 1]);
  let P = null, bd3 = 8; for (const [px, py, off] of pts) { const ex = px - e.x, ey = py - e.y, el = hyp(ex, ey) || 1, qx = px + ex / el * off, qy = py + ey / el * off, dq = hyp(qx - m.x, qy - m.y); if (dq < bd3 && hyp(px - e.x, py - e.y) < d + 2) { bd3 = dq; P = [qx, qy]; } }
  if (P) { const l = hyp(P[0] - m.x, P[1] - m.y) || 1; K.vx = (P[0] - m.x) / l * 2.5; K.vy = (P[1] - m.y) / l * 2.5; m.lureT = W.t; }
}
module.exports = { steer };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/mode.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 공격 방식 (v2.12, tac.mode 1 초보 ~ 5 전설, SPEC 36장, 수는 data/mode.json) — 두뇌가 먼저 방식을 고르고 그 안에서 마법을 고른다
 * 방식 (K.mode):
 *   poke 견제: 싸고 빠른 던지기(당 4 이하·시전 0.6 s 이하)를 띄엄띄엄(pokeGap 1 s). 상대를 움직이게 하고 구르기·기력을 깎는다. 상대가 멀쩡하고(체력 절반 넘게) 잘 피할 때
 *   sure 확정타: 상대가 못 피하는 순간(굳음·묶임·꺼짐·빈손·숨 마시는 중·끊어 떨어지는 중·기력 바닥·시전에 묶임·눈멂·나를 못 봄) 안에 닿는 것 가운데 가장 센 것
 *     피할 수 없는 공격(번쩍임)도 확정타로 (대가부터. 가까운 실·젖은 상대의 체인은 이 엔진에선 피해져 넣지 않았다). 대가부터는 묶는 수로 확정 순간을 만든다(큰 수가 남아 있으면 묶기 × 1.4: 그 뒤는 확정타가 잇는다)
 *   cover 덮기(난사): 상대가 coverH 0.75 s 안에 갈 수 있는 곳(제자리·좌우 구르기·뒤로 달리기·떠오르기)을 그리고 바위·벽·싸움터 끝·소금 원·내 함정으로 막힌 곳을 지운 뒤
 *     남은 곳을 칸마다 나눠 덮는다(두 번째 칸도 공격). 덮을 수단(하늘이면 투사체·실, 땅이면 지연 폭발·곡사도)이 둘 이상일 때만. 상대가 구르기를 방금 썼거나 기력이 없을 때, 몰렸을 때(갈 곳의 절반 넘게 막힘), 떠 있을 때, 셋 넘게 뭉쳤을 때
 *   big 큰 한 방: 숨은 자리(서로 안 보임)에서 첫 수로(hiddenT 3 s 쉬었으면) 큰 수(덱 가장 센 것의 0.6 이상) × bigK. 확정 순간이 큰 수의 예고보다 길면 확정타가 큰 수를 고른다
 *   throw 던지기: 장악권 싸움에서 밀릴 때(상대 자리의 내 몫 0.5 아래), 멀 때(가장 긴 사거리의 0.75 넘게), 벽 뒤 상대: 곡사 × 1.9, 곧은 투사체 × 1.6 (나는 상대엔 곡사 × 0.3)
 * 판단 단계 (tac.mode):
 *   1 초보: 같은 마법 반복(지난 마법 × repeatK) · 2 중급: 굳은 상대에 친다(확정타만) · 3 상급: 견제와 확정타를 오가고 몰리면 덮기(갈 곳을 지우지 않는다), 던지기
 *   4 대가: 갈 곳을 계산한 덮기(구르기·기력·하늘·뭉침에도), 확정 순간 만들어 잇기, 숨은 자리의 큰 한 방
 *   5 전설: 견제로 구르기를 빼낸 뒤 구르기가 돌기 전에(baitT 2 s 안) 덮기, 큰 수는 확정 순간·숨은 자리에서만(아니면 × 0.3), 방식을 다시 고르는 박자를 흔든다(0.3~1 s)
 * 덮기 뒤 머리가 heat 70 넘으면 숨(rules/breath가 K.coverDone을 본다)
 * 기록 (m.mlog.mode): 방식별 시간(t)·시전 수(n), 큰 수 시전·확정 순간 안의 큰 수, 덮기의 갈 곳 덮은 비율 합, 구르기 빼낸 뒤 덮기. 명중·피해 몫은 metrics/watch가 시전의 mode로 */
const { C, hyp, OFF, estDmg, castTime, landDelay, deck } = require('../util');
const P = require('../../../data/mode.json');
const lv = m => m.tac.mode || 0;
let SR = null;   // 소금 원의 안전 반경 (규칙 api, 처음 부를 때)
const saltSafe = (W, x, y) => { if (!W.rules.saltRing) return true; if (!SR) SR = C.RULES.find(r => r.name === 'saltRing').api; return SR.safeAt(W, x, y); };
// 확정 순간: 상대가 앞으로 못 피할 시간 (s)
function sureWin(W, m, K) {
  const e = K.e, st = e.st; let w = st.stun || 0;
  if (st.root > w) w = st.root; if (e.crash > w) w = e.crash; if (e.emptyT - W.t > w) w = e.emptyT - W.t; if (st.breath > w) w = st.breath; if (st.blind > w) w = st.blind;
  if (e.fly === 3 && e.z > 0.3 && w < 0.4) w = 0.4;   // 끊어 떨어지는 중: 착지까지
  if (e.fly === 0 && e.z < 1 && e.stam < 1.5) { const t = (1.5 - e.stam) / 0.8; if (t > w) w = t; }   // 기력 바닥: 구르지 못한다
  const c = e.cast; if (c && c.s.lock && c.T - c.t > w) w = c.T - c.t;   // 시전에 묶임
  if (!K.los && w < 0.5) w = 0.5;   // 나를 못 본다
  return w;
}
// 피할 수 없는 공격 (대가부터): 번쩍임
// (가까운 실·젖은 상대의 체인도 받았으나 이 엔진에선 피해진다: 전설끼리 30판, 8 m 안의 짧은 실 8~23%, 젖은 상대의 체인 0~9% 맞음. 그래서 번쩍임만)
const unavoidable = (s, K) => s.t === 'flash';
const isBig = (m, s, K) => !!s.big || estDmg(s) >= 0.6 * deck(m, K.S).offMax;
// 상대가 coverH 안에 갈 수 있는 곳 (K.covPts에 x, y, 하늘(1) 셋씩, K.covN개). 막힌 곳은 지운다(full). 갈 곳 가운데 막힌 몫을 돌려준다
function reach(W, m, K, full) {
  const e = K.e, h = P.coverH, ux = K.ux, uy = K.uy, ex = e.x + e.vx * h * 0.5, ey = e.y + e.vy * h * 0.5, pts = K.covPts || (K.covPts = new Array(18).fill(0)), fl = e.z >= 1;
  const side = fl ? P.flyD : (e.rollCd <= h && e.stam >= 1.5 ? P.rollD : 0);
  let n = 0, all = 0, cut = 0;
  const add = (x, y, air) => { all++; if (full) { if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1 || !saltSafe(W, x, y) || C.blocked(W, e.x, e.y, x, y, air ? 3 : 0)) { cut++; return; } for (const t of W.traps) if (t.src === m && hyp(t.x - x, t.y - y) < (t.r || 1)) { cut++; return; } } pts[n * 3] = x; pts[n * 3 + 1] = y; pts[n * 3 + 2] = air; n++; };
  add(ex, ey, fl ? 1 : 0);   // 제자리
  if (side) { add(ex - uy * side, ey + ux * side, fl ? 1 : 0); add(ex + uy * side, ey - ux * side, fl ? 1 : 0); }   // 좌우 구르기 (날면 옆으로 꺾기)
  add(ex + ux * P.runV * h, ey + uy * P.runV * h, fl ? 1 : 0);   // 뒤로
  if (!fl && e.tac.flySkill && W.rules.flight) add(ex, ey, 1);   // 떠오르기
  K.covN = n; return all ? cut / all : 0;
}
// 점 (x, y, 하늘)을 마법 s가 (tx, ty)에 떨어져 덮는가
function covers(W, m, s, tx, ty, x, y, air) {
  if (air) { if (!(s.t === 'proj' || s.t === 'thread')) return false; return hyp(tx - x, ty - y) < 1.2; }
  const r = s.t === 'area' || s.t === 'lob' ? (s.r || 1) * C.sizeOf(m, s) + 0.3 : 1.2; return hyp(tx - x, ty - y) < r;
}
// 이미 내 수(짓는 칸·떨어질 지연 폭발·곡사)가 덮은 점인가
function taken(W, m, i) {
  const p = m._k.covPts, x = p[i * 3], y = p[i * 3 + 1], air = p[i * 3 + 2];
  for (let j = 0; j < 2; j++) { const c = j ? m.castB : m.cast; if (c && !c.auto && OFF[c.s.t] && covers(W, m, c.s, c.tx, c.ty, x, y, air)) return true; }
  if (!air) { for (const a of W.areas) if (a.src === m && hyp(a.x - x, a.y - y) < a.r) return true; for (const l of W.lobs) if (l.src === m && hyp(l.x - x, l.y - y) < l.r) return true; }
  return false;
}
// 방식 고르기 (판단마다, 마법의 값 앞)
function pick(W, m, K) {
  const L = lv(m); if (!L) return;
  const ml = m.mlog.mode, dt = W.t - K.modeAt; if (dt > 0 && dt < 1) ml.t[K.mode || 'none'] = (ml.t[K.mode || 'none'] || 0) + dt; K.modeAt = W.t;
  if (L === 1) { K.mode = 'repeat'; return; }
  const e = K.e, w = sureWin(W, m, K);
  K.sureW = w; K.bait = false;
  if (L === 2) { K.mode = w > 0.15 ? 'sure' : ''; if (K.mode) K.pressB = true; return; }
  let un = false; if (L >= 4) for (const n of m.book) { const s = K.S[n]; if (s && unavoidable(s, K) && !((m.cd[n] || 0) > 0) && m.glu >= s.cost && (s.t !== 'thread' || K.los)) { un = true; break; } }
  if (w > 0.15 || un) { K.mode = 'sure'; K.pressB = true; return; }   // 확정 순간은 늘 먼저 본다
  if (W.t < K.modeT && K.mode !== 'sure') { if (K.mode === 'cover') reach(W, m, K, L >= 4); if (K.mode === 'cover' || K.mode === 'big') K.pressB = true; return; }   // 방식은 정한 동안 붙든다
  K.modeT = W.t + (L >= 5 && P.l5.jitter ? P.every[4] + W.rng() * (P.every5Hi - P.every[4]) : P.every[L - 1]);   // 전설: 방식을 바꾸는 박자를 흔든다
  const cut = reach(W, m, K, L >= 4), d = K.d;
  let near = 0; if (L >= 4) for (const q of K.foes) if (q !== e && q.hp > 0 && hyp(q.x - e.x, q.y - e.y) < 4) near++;
  const dodged = (e.fly === 0 && e.rollCd > 0.2) || (e.z >= 1 && e.cut.cd > 0.2);   // 피하기를 방금 썼다: 땅이면 구르기, 날면 날기 끊기
  const canDodge = (e.fly === 0 && e.rollCd <= 0 && e.stam >= 3) || (e.z >= 1 && !(e.cut.cd > 0)) || (e.autoDodge && e.autoCd <= 0);
  const cornered = cut > 0.5 || e.x < 6 || e.y < 6 || e.x > W.width - 6 || e.y > W.height - 6, healthy = e.hp > 0.5 * e.hpMax;
  const bait = L >= 5 && P.l5.bait && dodged && W.t - K.pokeT < P.baitT;
  let mode = ''; const cv = coverable(m, K), hard = cornered || (L >= 4 && ((e.fly === 0 && e.stam < 1.5) || near >= 2));
  const throwing = !K.los || d > P.far * K.Dm.maxR || share(W, m, e) < P.domain;
  if (L >= 4 && !K.los && W.t - m.lastRel > P.hiddenT && hasBig(m, K)) mode = 'big';
  else if (cv && (bait || hard)) { mode = 'cover'; K.bait = bait; }
  else if (L >= 5 && P.l5.poke && healthy && canDodge) mode = 'poke';   // 전설: 먼저 견제로 피하기를 빼낸다 (던지기보다 먼저)
  else if (cv && L >= 4 && (dodged || e.z >= 1)) mode = 'cover';
  else if (throwing) mode = 'throw';
  else if (healthy && canDodge) mode = 'poke';
  if (mode === 'cover' && L < 4) reach(W, m, K, false);
  K.mode = mode; if (mode === 'cover' || mode === 'big') K.pressB = true;
}
// 덮을 수단이 둘 이상인가: 땅의 곳은 지연 폭발·곡사·투사체·실, 하늘의 곳(떠 있는 상대)은 투사체·실만 (지연 폭발은 떠 있으면 닿지 않는다)
function coverable(m, K) { const air = K.e.z >= 1; let n = 0; for (const nm of m.book) { const s = K.S[nm]; if (!s || (m.cd[nm] || 0) > 0.5 || m.glu < s.cost) continue; if (s.t === 'proj' || s.t === 'thread' || (!air && (s.t === 'area' || s.t === 'lob'))) if (++n >= 2) return true; } return false; }
function hasBig(m, K) { for (const n of m.book) { const s = K.S[n]; if (s && OFF[s.t] && isBig(m, s, K) && !((m.cd[n] || 0) > 0) && m.glu >= s.cost) return true; } return false; }
// 견제로 치는 수: 싸고(당 4 이하) 빠른(시전 0.6 s 이하) 투사체·실
const pokeOk = o => o.cost <= P.pokeCost && o.Tw <= P.pokeCast && (o.s.t === 'proj' || o.s.t === 'thread');
const share = (W, m, e) => W.rules.domain ? C.share(W, m, e.x, e.y) : 1;
// 방식에 따라 마법의 값을 고친다 (값 고치기 차례의 끝 쪽: 날카롭게·스스로 죽지 않기 뒤)
function value(W, m, K, o) {
  const L = lv(m); if (!L || !(o.v > 0)) return;
  const s = o.s, mode = K.mode, off = OFF[s.t] && s.t !== 'trap', big = off && isBig(m, s, K);
  if (L >= 5 && P.l5.big && big && mode !== 'sure' && mode !== 'big') o.v *= P.offK;   // 전설: 큰 수는 확정 순간·숨은 자리에서만
  if (mode === 'repeat') { if (s.n === m.last) o.v *= P.repeatK; return; }
  if (!mode) return;
  if (mode === 'sure') {
    if (!off && s.t !== 'flash') return;
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d);
    if (land <= K.sureW + 0.05 || (L >= 4 && unavoidable(s, K))) o.v = P.sureK * (1 + estDmg(s) / 10);   // 그 순간 안에 닿는 것 가운데 가장 센 것
    else if (L >= 4 && (s.t === 'thread' || s.stun || s.root || s.cramp) && hasBig(m, K)) o.v *= 1.4;   // 확정 순간을 만든다: 묶기 → 큰 수
    else o.v *= P.offK;
  } else if (mode === 'poke') {
    if (!off) return;
    if (W.t - K.pokeT < P.pokeGap) { o.v = 0; K.waitT = W.t; return; }   // 띄엄띄엄 (빈 칸은 준비에)
    o.v *= pokeOk(o) ? P.pokeK : P.offK;
  } else if (mode === 'cover') {
    if (!off || !(s.t === 'area' || s.t === 'lob' || s.t === 'proj' || s.t === 'thread')) return;
    const p = K.covPts, n = K.covN; let best = -1, bc = 0;
    for (let i = 0; i < n; i++) { if (taken(W, m, i)) continue; let c = 0; for (let j = 0; j < n; j++) if (!taken(W, m, j) && covers(W, m, s, p[i * 3], p[i * 3 + 1], p[j * 3], p[j * 3 + 1], p[j * 3 + 2])) c++; if (c > bc) { bc = c; best = i; } }
    if (best < 0) { o.v *= P.offK; return; }   // 덮을 곳이 없는 수는 낮춘다 (0으로 하니 떠 있는 상대 앞에서 아무것도 안 쓰는 침묵이 생겼다, v2.13)
    o.tx = p[best * 3]; o.ty = p[best * 3 + 1]; o.v *= P.coverK * (1 + bc / n);
  } else if (mode === 'big') { if (off) o.v *= big ? P.bigK : P.offK; }
  else if (mode === 'throw') { if (!off) return; o.v *= s.t === 'lob' ? (K.e.z >= 1 ? P.offK : P.throwK * 1.2) : s.t === 'proj' && !s.home ? P.throwK : 0.7; }
}
// 시전을 건 뒤: 시전에 방식을 적고 기록한다
function commit(W, m, K, best, cast) {
  const L = lv(m); if (!L) return;
  const mode = K.mode || 'none', ml = m.mlog.mode, s = best.s; cast.mode = mode; ml.n[mode] = (ml.n[mode] || 0) + 1;
  if (OFF[s.t] && isBig(m, s, K)) { ml.bigN++; if (mode === 'sure' || mode === 'big') ml.bigSure++; }
  if (mode === 'poke') K.pokeT = W.t;
  if (mode === 'cover') {   // 갈 곳 덮은 비율 (이 수까지)
    let c = 0; for (let i = 0; i < K.covN; i++) if (taken(W, m, i)) c++;
    cast.cov = K.covN ? c / K.covN : 0; ml.covS += cast.cov; ml.covN++; if (K.bait) { cast.bait = true; ml.bait++; } K.covT = W.t; K.coverDone = W.t;
  }
}
module.exports = { pick, value, commit, sureWin, reach, pokeOk, P };
}, {"../util":"src/brain/util.js","../../../data/mode.json":"data/mode.json"}];
D["src/brain/techniques/position.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 자리 (대가)
 * 사거리 밖(tac.outrange): 내 사거리가 더 길면 상대 덱의 최대 사거리 바로 밖에 선다.
 * 자리 판단(tac.terrain): 내 장악권이 짙은 땅 쪽으로 기운다. 엄폐 중이거나 엄폐로 가는 중이면, 리듬의 들어가기·빠지기 중이면 따르지 않는다 */
const { DIR8, ownShare } = require('../util');
function outrange(W, m, K) { if (K.T.outrange) { const eR = K.De.maxR, mR = K.Dm.maxR; if (mR > eR + 1) K.prefR = Math.min(eR + 1, mR - 0.5); } }
function terrain(W, m, K, covering) {
  if (!(K.T.terrain && W.rules.domain && !covering && K.los) || m.phase !== 'probe') return;   // 리듬(v2.2)이 들어가거나 빠질 땐 그 거리를 따른다
  const foes = K.foes, f0 = ownShare(W, m, foes, m.x, m.y); let bx = 0, by = 0, bf = f0;
  for (let k = 0; k < 8; k++) { const px = m.x + DIR8[k][0] * 2, py = m.y + DIR8[k][1] * 2; if (px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1) continue; const f = ownShare(W, m, foes, px, py); if (f > bf) { bf = f; bx = DIR8[k][0]; by = DIR8[k][1]; } }
  const k2 = Math.min(1.2, (bf - f0) * 6); K.vx += bx * k2; K.vy += by * k2;
}
module.exports = { outrange, terrain };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/rhythm.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 리듬과 장악권 밀기 (v2.2, SPEC 26장)
 * 선명도 5 이상(상위·대마법사)만 쓴다.
 * 떠보기(probe): 멀리서(14 m 넘게) 가볍게. 비싼 공격(당 7 이상)은 값 × 0.5
 * 들어가기(in): 상대에게 틈(빈손·꺼짐·굳음·묶임·과열 92 넘음·방어 간격)이 있으면 가까이 붙어 몰아친다: 공격 × 1.4, 두 번째 칸에도 공격(K.pressB)
 * 빠지기(out): 내 피로가 넘치기 직전이거나(대가부터 92, 상급 97. 대마법사는 비행 피로로 판의 40%를 80 넘게 보낸다), 나를 겨눈 상대의 큰 수가 보이거나, 2 s 안에 체력 15%를 잃으면 22 m 넘게 물러난다: 공격 × 0.6, 방어 × 1.4
 * 상급(tac.rhythm = 'mimic'): 굳음·묶임·과열만 보고, 틈이 끝난 뒤에도 1.5 s 더 머문다(늦다)
 * 대가·전설(tac.rhythm = true, tac.rhythmTime): 모든 틈을 보고, 붙는 데 드는 시간(거리 / 속도 + 0.25 s)보다 틈이 길 때만 들어간다
 * 장악권 밀기(tac.domainPush, 대가부터): 들어갈 거리 = 두 신호가 맞서는 경계가 상대에게서 3 m 안으로 오는 거리(5장 식을 풀어서, 4~12 m).
 *   다가갈수록 상대 자리의 공기를 빼앗아 상대 자리에서 만드는 내 마법(발밑·구름·지대·실)의 몫이 오른다 */
const { C, defenseDown } = require('../util'), SH = require('./sharp');
const PROBE_R = 14, OUT_R = 22, GAP = 3, STRONG = 5;   // 강자(선명도 5 이상: 상위·대마법사, 나는 사람)만: 평범·중간의 판단 사다리는 v2.1 그대로
// 들어갈 거리: 경계에서 상대까지의 틈이 GAP가 되는 거리. 경계(나에게서) x = L(A−B)/(A+B) + A·d/(A+B) → d − x = GAP를 푼다
function inDist(W, m, e) {
  const L = W.rules.domainL, A = C.sigOf(W, m), B = C.sigOf(W, e) * (e._act ? 1 : W.rules.passive);
  const d = (GAP * (A + B) + L * (A - B)) / (B || 1e-9); return d < 4 ? 4 : d > 12 ? 12 : d;
}
function window(W, m, K, full) {
  const e = K.e, st = e.st; let w = 0;
  if (st.stun > w) w = st.stun; if (st.root > w) w = st.root;
  if (e.fat > 92 && !e.wave) w = w > 1.5 ? w : 1.5;   // 과열: 넘치기 직전이라 곧 쉬어야 한다
  if (full && SH.on(m)) {   // 날카롭게 (v2.9): 과열이 다가오면(머리 85 넘음) 1 s, 다 지어 붙잡아 둔 공격이 있으면 1 s 들어간다 (가까울수록 닿는 때가 짧아 맞을 가망이 오른다)
    if (e.fat > SH.P.hotF && !e.wave && w < 1) w = 1;
    const b = m.castB; if (SH.P.inHeld && b && b.hold && !b.go && b.t >= b.T && w < SH.P.inHeld) w = SH.P.inHeld;
  }
  if (full) { if (e.emptyT > W.t && e.emptyT - W.t > w) w = e.emptyT - W.t; if (e.crash > w) w = e.crash; if (w < 1 && defenseDown(e, K.S, W)) w = 1; }
  return w;
}
function phase(W, m, K) {
  const T = m.tac; if (!T.rhythm || m.C < STRONG) return;
  const ml = m.mlog.phase, dt = W.t - m.ph.t; if (dt > 0 && dt < 1) ml[m.phase] = (ml[m.phase] || 0) + dt; m.ph.t = W.t;
  const full = T.rhythm === true, e = K.e, d = K.d;
  if (W.t - m.ph.hpT > 2) { m.ph.hp = m.hp; m.ph.hpT = W.t; }
  const read = T.readCast && !K.blindR, big = read && ((e.cast && e.cast.s.big && e.cast.tgt === m) || (e.castB && e.castB.s.big && e.castB.tgt === m));
  const danger = m.fat > (full ? 92 : 97) || big || m.ph.hp - m.hp > 0.15 * m.hpMax;
  const dIn = T.domainPush ? inDist(W, m, e) : 6;
  if (danger) { m.phase = 'out'; m.ph.until = W.t + 1.5; }
  else if (m.phase === 'out' && W.t < m.ph.until) { /* 물러나는 중 */ }
  else {
    const w = window(W, m, K, full), close = (d > dIn ? d - dIn : 0) / (m.fly === 1 ? 25 : 7) + 0.25;
    if (w > 0 && (!T.rhythmTime || w >= close)) { m.phase = 'in'; const u = W.t + w + (full ? 0.5 : 1.5); if (!(m.ph.until > u && m.phase === 'in')) m.ph.until = u; }
    else if (!(m.phase === 'in' && W.t < m.ph.until)) m.phase = 'probe';
  }
  const pr = K.prefR; K.prefR = m.phase === 'in' ? dIn : m.phase === 'out' ? (pr > OUT_R ? pr : OUT_R) : (pr > PROBE_R ? pr : PROBE_R);
  K.aggr *= m.phase === 'in' ? 1.4 : m.phase === 'out' ? 0.6 : 0.9;
  K.pressB = m.phase === 'in' && full;
  const hp = W._bh.phase; for (let i = 0; i < hp.length; i++) hp[i](W, m, K);   // 규칙이 더하는 단계 (진지의 짓기·진지, rules/fort, v2.3)
}
function value(W, m, K, o) {
  const s = o.s; if (m.C < STRONG) return;
  if (m.phase === 'probe') { if (o.isOff && s.cost >= 7) o.v *= 0.5; }
  else if (m.phase === 'out' && !o.isOff && (s.t === 'wall' || s.t === 'buff' || s.t === 'zone')) o.v *= 1.4;
}
module.exports = { phase, value, inDist };
}, {"../util":"src/brain/util.js","./sharp":"src/brain/techniques/sharp.js"}];
D["src/brain/techniques/shape.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 지형 설계와 칸의 역할 (v2.2, SPEC 26장, 대가부터)
 * 선명도 5 이상(상위·대마법사)만 쓴다.
 * 지형 설계(tac.shape):
 *   내 엄폐: 빠지는 중이거나 나를 겨눈 실·투사체가 보이면 벽(1.5 s 안에 서는 것)을 나와 상대 사이에 (값 1)
 *   몰이 자리: 들어가는 중에 상대가 물러나면(다가오는 속도 < −1 m/s) 그 도망 길(상대 너머 3 m + 0.5 s 움직임)에 빙판·지대·함정·가두는 기둥·벽을 (값 0.9)
 *   상대의 엄폐 없애기: 상대가 벽·바위 뒤(시야 없음)면 물·산·곡사 × 1.5 (벽 밀기의 값은 rules/bulwark가 매긴다)
 * 칸의 역할(tac.roles): 서클이 셋 이상이면 두 번째 칸 = 지형·방어 칸(지형 × 1.5, 겨눠지면 방어 × 1.3), 자동 진 = 방어, 첫 칸 = 공격.
 *   들어가기(리듬)에선 두 번째 칸도 공격한다 */
const { hyp } = require('../util');
const TERR = { wall: 1, trap: 1, cage: 1 };
function value(W, m, K, o) {
  const T = m.tac, s = o.s, e = K.e; if (m.C < 5) return;   // 선명도 5 이상(상위·대마법사)만
  if (T.shape) {
    const terr = TERR[s.t] || (s.t === 'zone' && s.z && (s.z.k === 'ice' || s.z.k === 'fire' || s.z.k === 'acid' || s.z.k === 'spore' || s.z.k === 'nh3'));
    if (s.t === 'wall' && (m.phase === 'out' || (K.aimed && K.threat && (K.threat.s.t === 'thread' || K.threat.s.t === 'proj')))) { o.v = Math.max(o.v, 1); o.tx = e.x; o.ty = e.y; }
    else if (terr && m.phase === 'in' && K.vt < -1 && K.d < 14) { const l = K.d || 1, tx = e.x + (e.x - m.x) / l * 3 + e.vx * 0.5, ty = e.y + (e.y - m.y) / l * 3 + e.vy * 0.5; o.v = Math.max(o.v, 0.9); o.tx = tx; o.ty = ty; m.ph.shT = W.t; }
    if (!K.los && (s.el === '물' || s.t === 'lob' || (s.t === 'zone' && s.z && s.z.k === 'acid'))) o.v *= 1.5;
  }
  if (T.roles && K.slot === 'B' && K.circ >= 3) { if (TERR[s.t] || s.t === 'zone' || s.t === 'build') o.v *= 1.5; else if (!o.isOff && K.aimed) o.v *= 1.3; }
}
module.exports = { value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/sharp.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 날카롭게 (v2.6, tac.sharp, 대가부터, 선명도 5 이상, SPEC 30장) — 헛수를 줄이고 틈을 찌른다
 * 빈틈 찌르기: 과녁의 빈틈(굳음·묶임·꺼짐·빈손·과열)이 닫히기 전에 닿는 공격 × 2, 그 가운데 빨리 닿을수록 더(× 1 + 0.5/(닿는 때 + 0.2)).
 *   빈틈에 쉬지 않기도 해 봤으나 대가/상급이 0.02 떨어졌다(머리를 써 버려 다음 수가 없다)
 * 날고 있는 과녁: 빠른 것(실·투사체·0.6 s 안에 떨어지는 구름) × 1.2로 먼저 떨어뜨리고, 느린 구름(0.6 s 넘게 늦게 떨어진다)은 과녁이 그동안 굳거나 묶여 있을 때만(아니면 × 0.3)
 * 막힌 직사 끊기: 실·곧게 나는 투사체를 모으는 중에 과녁과 사이가 막히면 끊는다(당의 70% 돌려받음, 머리 피로는 풀 때 들어 아직 안 들었다)
 * 몰아칠 때(작전 압박·끝내기, 과녁의 굳음·묶임·꺼짐·빈손, v2.7): 쉬지 않고 피로 벌점 없이, 두 번째 칸에도 공격을 겹친다. 두 번째 칸의 값 문턱은 늘 × 0.4
 * 명중 가망 (v2.8): 공격의 값에 맞을 짐작 0.35 대신 판 중의 명중률(쏜 수 대비, 짐작을 세 번 몫으로) × 형편(과녁이 닿을 때까지 묶였으면 × 2.5, 아니면 × 1/(1 + 닿는 때/0.6),
 *   땅에서 구를 수 있으면 × 0.6, 날며 끊을 수 있으면 × 0.7). 8% 아래면 빈틈(닿기 전에 닫히지 않는)을 기다린다
 * 세운 벽 뒤에 머문다 (v2.8): 벽·기둥을 세우고 2 s는 작전의 둘레 돌기를 쉬고, 엄폐가 제 벽 뒤로 끌고, 2 m로 낮게 난다. 벽을 떼어 재니 둘레 돌기가 두 사람 사이의 벽을 반으로 줄였다
 * 몰아치기·빈 칸의 준비·벽 자리 (v2.9, SPEC 33장): 몰아칠 틈(storm)엔 문턱 minOpen, 문턱에 막혀 기다리는 동안 벽·함정·지대(wait, 빈틈이 열리면 끊는다), 세운 벽에 anchorT 머문다(behind). 수를 모두 끄면 v2.8
 * 방패는 0.4 s 안에 닿는 위협(나를 겨눈 예비동작이 풀려 닿는 때, 날아오는 투사체)에만 (v2.8). (둘 다 높이 떠 있을 때 기둥·벽을 막으면 대가/상급이 0.06 떨어졌다: 굳을 위험에 낮게 날아 벽이 곧 다시 가린다) */
const { OFF, landDelay, castTime, hyp, C, hidesOf } = require('../util'), { undo } = require('./cancel');
const on = m => m.tac.sharp && m.C >= 5;
const SW = require('./swarm'); let MD = null;
const off = (m, k) => m.tac.sharpOff && m.tac.sharpOff[k];   // 떼어 재기 (실험): 기능 하나를 끈다
const PREP = { trap: 1, wall: 1, build: 1, blueprint: 1, cage: 1, zone: 1 }, ZK = { fire: 1, nh3: 1, spore: 1, ice: 1, acid: 1, mist: 1, absorb: 1 };   // 지형과 준비 (v2.9)
// 과녁의 빈틈이 앞으로 열려 있을 시간 (s). 과열(머리 92 넘음)은 0.8 s로 본다. 없으면 0
function openFor(W, e) { let w = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0, e.emptyT > W.t ? e.emptyT - W.t : 0); if (e.fat > 92 && !e.wave && w < 0.8) w = 0.8; return w; }
// 막힌 직사 끊기 (첫 칸만: 두 번째 칸은 그냥 버린다)
function losCancel(W, m, K) {
  if (!on(m) || off(m, 'los')) return;
  const a = m.cast; if (P.waitW > 0 && a && !a.auto && !a.bp && PREP[a.s.t] && a.T - a.t > 0.1 && openFor(W, K.e) > 0.3) { undo(m, a); m.mlog.prepCut++; }   // 짓던 준비를 끊고 빈틈을 친다 (v2.9)
  if (K.los) return;
  const c = m.cast; if (c && !c.auto && !c.feint && (c.s.t === 'thread' || (c.s.t === 'proj' && !c.s.home)) && c.tgt === K.e && c.T - c.t > 0.03) { undo(m, c); m.mlog.losCut++; }
  const b = m.castB; if (b && !b.auto && (b.s.t === 'thread' || (b.s.t === 'proj' && !b.s.home)) && b.tgt === K.e && b.T - b.t > 0.03) { m.castB = null; m.glu += (b.cost || 0) * 0.7; }
}
// 명중 가망 (v2.8): 판 중의 명중률(쏜 수 대비, 앞의 짐작 0.35를 세 번 몫으로 섞는다) × 지금의 형편(과녁이 묶였나·구를 수 있나·닿는 데 얼마나 걸리나)
// 기다림의 끝 (v2.13): 쏜 지 waitMax 넘게 지나면 문턱을 waitFade 동안 0까지 낮춘다. 문턱에 막혀 둘 다 쏘지 않는 침묵이 판의 20%였다
const patience = (W, m) => { const t = W.t - m.lastRel - P.waitMax; return t > 0 ? (t < P.waitFade ? 1 - t / P.waitFade : 0) : 1; };
const P = { hideWall: 0.8, prior: 3, pin: 2.5, roll: 0.6, fly: 0.7, landT: 0.6, min: 0.14, use: 1, minOpen: 0.05, hotF: 85, inHeld: 0.5, waitW: 0.5, prep: 1.2, prepMin: 0.6, prepFat: 50, anchorT: 10, ownCover: 0.4, losPrior: 30, waitMax: 1.5, waitFade: 1.5 };
// 몰아칠 틈 (v2.9): 과녁의 빈틈(굳음·묶임·꺼짐·빈손), 과열이 다가옴(머리 hotF 넘음, 파도 아님), 내 작전 끝내기. 이때 명중 문턱은 minOpen
const storm = (W, m, K) => { const e = K.e; return openFor(W, e) > 0 || (e.fat > P.hotF && !e.wave) || (m.op && m.op.cur === 'finish'); };
function chance(W, m, K, o, land) {
  const L = m.log, c = L.casts[o.n] || 0, h = Math.min(c, L.hits[o.n] || 0), e = K.e, est = (h + o.he * P.prior) / (c + P.prior);
  const pin = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0);
  let k = pin > land ? P.pin : 1 / (1 + land / P.landT);
  if (pin <= land) { if (e.fly === 0 && e.rollCd <= land && e.stam >= 1.5) k *= P.roll; else if (e.fly === 1 && !(e.cut.cd > land)) k *= P.fly; }   // 구를 수 있다 · 날며 끊을 수 있다
  return est * k;
}
// 막을 위협이 0.4 s 안에 닿는가 (v2.8): 나를 겨눈 실·투사체의 예비동작이 풀려 닿는 때(붙잡아 둔 수는 풀릴 때), 또는 날아오는 투사체
function threatSoon(W, m, K) {
  const th = K.threat; if (th && (th.s.t === 'thread' || th.s.t === 'proj') && !(th.hold && !th.go) && th.T - th.t + landDelay(th.s, K.d) < 0.4) return true;   // 앞 방패가 막는 실·투사체만, 붙잡아 둔 수는 풀릴 때
  for (const p of W.proj) { if (p.src.side === m.side) continue; const rx = m.x - p.x, ry = m.y - p.y, vv = p.vx * p.vx + p.vy * p.vy; if (!(vv > 0)) continue; const t = (rx * p.vx + ry * p.vy) / vv; if (t > 0 && t < 0.4 && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 1.2) return true; }
  return false;
}
function value(W, m, K, o) {
  if (!on(m)) return; if (!MD) MD = require('./mode');
  if (PREP[o.s.t] && W.t - K.waitT < P.waitW && !off(m, 'wait')) wait(W, m, K, o);
  if (!(o.v > 0)) return;
  const s = o.s, e = K.e;
  if (OFF[s.t]) {
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d), win = openFor(W, e);
    if (win > 0.15 && land < win && !off(m, 'open')) o.v *= 2 * (1 + 0.5 / (land + 0.2));   // 빈틈: 닫히기 전에 닿는 것, 빠를수록
    if (s.t !== 'trap' && s.t !== 'topple' && P.use && m.tac.aim && !off(m, 'chance') && !SW.on(W, m, e) && !(K.mode === 'poke' && MD.pokeOk(o))) {   // 공격 방식(v2.12): 견제의 싼·빠른 수만 문턱을 건너뛴다(맞히려는 게 아니라 움직이게 한다). 덮기·확정타까지 건너뛰니 전설 / 대가 0.71 → 0.48   // 무리 싸움(협공)엔 명중 문턱을 쓰지 않는다 (v2.10)
      const ch = chance(W, m, K, o, land); o.v *= ch / (o.he > 0.05 ? o.he : 0.05); if (ch < (storm(W, m, K) ? P.minOpen : P.min) * patience(W, m) * (1 - K.hurry) && !(win > land) && !(K.slot === 'B' && m.tac.hold && W.rules.hold)) { o.v = 0; K.waitT = W.t; o.wait = true; } }   // 명중 가망: 낮으면 빈틈을 기다린다 (v2.8)
    if (e.z >= 1 && !off(m, 'fly')) {
      const fast = s.t === 'thread' || (s.t === 'proj') || (s.t === 'area' && s.delay <= 0.6);
      if (fast) o.v *= 1.2;
      else if (s.t === 'area' && Math.max(e.st.stun || 0, e.st.root || 0) < land) o.v *= 0.3;   // 느린 구름은 굳음·묶임 뒤에만
    }
  }
  if (s.t === 'buff' && s.b && s.b.front && !off(m, 'shield') && !threatSoon(W, m, K)) o.v = 0;  // 방패는 0.4 s 안에 닿는 실제 위협에만 (v2.8)
  if ((s.t === 'wall' || s.t === 'build' || s.t === 'blueprint') && !off(m, 'wall') && (m.z > 2 || e.z > 2)) o.v = 0;   // 둘 중 하나가 2 m 넘게 떠 있으면 벽은 가리지 않는다 (v2.7)
  if ((s.t === 'wall' || s.t === 'build') && o.v > 0 && m.tac.wallLos && losShare(W, e) < m.tac.wallLos && !threatSoon(W, m, K)) o.v = 0;   // 상대의 주력이 시야가 필요한 공격일 때만 벽 (v2.10)
  if ((s.t === 'wall' || s.t === 'build') && !off(m, 'wall') && m.z <= 2 && e.z <= 2 && hidesOf(e) && !W.walls.some(w => w.mk === m.id && hyp(w.x - m.x, w.y - m.y) < 4)) o.v = Math.max(o.v, P.hideWall);   // 숨긴 수를 쓰는 상대: 읽지 못해도 시야를 막으면 막힌다 — 곁에 벽이 없으면 세운다 (v2.20)
}
// 기다리는 동안 빈 칸을 지형과 준비에 (v2.9): 명중 문턱에 공격이 막힌 뒤 0.5 s 안이면 벽·흙벽(둘 다 2 m 아래)·함정(한도 안)·지대에 값을 준다.
// 피로 벌점(머리 100에 0.5)을 넘어 고를 만하게 prepMin. 벽은 내 앞 적 쪽에(엄폐 각), 함정은 나와 적 사이 3 m에(다가오는 길)
function wait(W, m, K, o) {
  if (m.fat > P.prepFat) return;   // 머리를 남겨 둔다: 빈틈이 열리면 칠 수 있게
  const s = o.s, e = K.e; let v = o.v;
  if (s.t === 'wall' || s.t === 'build') { if (m.z > 2 || e.z > 2 || (m.tac.wallLos && losShare(W, e) < m.tac.wallLos) || W.walls.some(w => w.mk === m.id && hyp(w.x - m.x, w.y - m.y) < 4)) return; if (!(v > P.prepMin)) v = P.prepMin; }
  else if (s.t === 'trap') { if (!(v > 0)) { let n = 0; for (const t of W.traps) if (t.src === m) n++; if (n >= C.trapCap(W, m)) return; o.tx = m.x + K.ux * 3; o.ty = m.y + K.uy * 3; v = P.prepMin; } }
  else if (s.t === 'zone') { if (!ZK[s.z.k] || !(v > 0)) return; }
  else if (!(v > 0)) return;
  o.v = (v > P.prepMin ? v : P.prepMin) * P.prep; m.mlog.prep++;
}
// 상대 피해 가운데 시야가 필요한 공격(실·곧게 나는 투사체)의 몫 (v2.10): 판 중에 그 사람이 준 피해, 처음엔 덱의 공격 가운데 직사의 몫을 losPrior만큼 섞는다.
// 벽은 실·직사만 막는다(구름·곡사·함정은 넘거나 돌아간다): 이 몫이 판단 수준의 tac.wallLos 아래면 벽을 세우지 않고 그 칸을 함정·몰이에
const LOSC = new WeakMap();
function losShare(W, e) {
  let pr = LOSC.get(e); if (pr === undefined) { let a = 0, d = 0; for (const n of e.book) { const s = W.spells[n]; if (!s || !OFF[s.t] || s.t === 'trap' || s.t === 'topple') continue; a++; if (s.t === 'thread' || (s.t === 'proj' && !s.home)) d++; } pr = a ? d / a : 0; LOSC.set(e, pr); }
  let all = 0, dd = 0; const L = e.log.dealt; for (const n in L) { all += L[n]; const s = W.spells[n]; if (s && (s.t === 'thread' || (s.t === 'proj' && !s.home))) dd += L[n]; }
  return (dd + pr * P.losPrior) / (all + P.losPrior);
}
// 몰아칠 때 (v2.7): 작전이 압박·끝내기이거나 과녁의 빈틈(과열 빼고)이 열려 있다. 이때는 쉬지 않고, 피로 벌점이 없고, 두 번째 칸도 공격을 겹친다
const push = (W, m, K) => on(m) && !off(m, 'push') && ((m.op && (m.op.cur === 'press' || m.op.cur === 'finish')) || Math.max(K.e.st.stun || 0, K.e.st.root || 0, K.e.crash > 0 ? K.e.crash : 0, K.e.emptyT > W.t ? K.e.emptyT - W.t : 0) > 0.15 || (P.hotF < 92 && K.e.fat > 92 && !K.e.wave));   // 과열도 (v2.9)
// 세운 벽 뒤에 머문다 (v2.8): 벽·기둥을 세우고 2 s 동안은 작전의 둘레 돌기를 하지 않고(엄폐가 그 벽 뒤로 끈다) 2 m로 낮게 난다(벽은 2 m 넘게 뜬 사람을 가리지 않는다)
// 벽 자리를 쓴다 (v2.9): 세운 지 anchorT 안이고 제 벽이 15 m 안에 서 있으면 그 벽에 머문다(돌아온다: 엄폐가 제 벽 뒤로 끈다). 들어가기·끝내기에는 떠난다
function ownWall(W, m, r) { for (const w of W.walls) if (w.mk === m.id && w.hp > 0 && hyp(w.x - m.x, w.y - m.y) < r) return true; return false; }
const behind = (W, m, K) => on(m) && !off(m, 'behind') && W.t >= K.wallT - 1 && (W.t - K.wallT < 2 || (W.t - K.wallT < P.anchorT && m.phase !== 'in' && !(m.op && m.op.cur === 'finish') && !(K.e.z > 2) && ownWall(W, m, 15)));   // 들어갈 때·끝낼 때는 벽을 떠난다
module.exports = { value, losCancel, openFor, push, chance, threatSoon, P, behind, storm, on, losShare };
}, {"../util":"src/brain/util.js","./cancel":"src/brain/techniques/cancel.js","./swarm":"src/brain/techniques/swarm.js","./mode":"src/brain/techniques/mode.js"}];
D["src/brain/techniques/siege.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 성 (tac.siege, 모두, v2.0 둘째 묶음 SPEC 25장) — 선명도 5 이상이 다섯 넘는 적이나 총 둘 이상을 상대할 때만
 * 총(머스킷 등 총이 든 적, 110 m 안)이 있으면:
 *   날고 있으면 가장 가까운 총에서 62 m 쯤(총은 50 m 넘게 멀리 뜬 과녁을 쏘지 않는다, rules/army)에서 구름·곡사로 깎는다
 *   땅이면 먼저 벽(흙벽 3 s, 총 쪽으로)을 세우고, 총 대부분이 장전 중일 때 벽 옆으로 나와 치고, 장전이 끝나 가면 벽 뒤로
 * 벽 밀기의 값은 rules/bulwark의 두뇌 훅이 매긴다(누구나)
 * 벽 자리(상급부터, tac.wallSite): 세울 자리 5 m 안에 적이 있으면 세우지 않는다(적의 엄폐가 된다)
 * 벽 없애기(대가부터, tac.wallBreak): 적이 벽 뒤에 숨었으면 그 벽을 미는 값 × 2, 물·산·큰 바위 × 2
 * 머리: 적이 다섯 넘으면 피로 88 넘어서는 공격하지 않는다(무리 앞에서 파도를 타면 제 몸을 태운다)
 * 물러나기(상급부터, tac.retreat): 체력 35% 아래에서 적이 다섯 넘거나 총이 셋 넘으면 싸우지 않는다: 높이 떠(15 m) 사거리 밖으로(m.retreat, rules/flight가 본다) */
const { C, hyp } = require('../util');
function guns(W, m) { let n = 0; for (const q of W.foes[m.side]) if (!q.flee && q._gun && hyp(q.x - m.x, q.y - m.y) < 110) n++; return n; }
function on(W, m, K) { if (!(m.tac.siege && m.C >= 5 && W.rules.army)) return 0; for (const q of K.foes) if (q._gun === undefined) q._gun = q.book.some(n => { const s = K.S[n]; return s && s.mundane && s.t === 'proj'; }); const g = guns(W, m); return g >= 2 || K.foes.length > 5 ? 1 + g : 0; }
// 나와 총들 사이에 벽이 있는가 (내 곁 2 m 안의 벽)
function covered(W, m, gx, gy) { const ws = W.walls, a = ws.length ? C.wallsIn(W, m.x - 2, m.y - 2, m.x + 2, m.y + 2) : ws; for (let i = 0; i < a.length; i++) { const w = ws[a[i]]; if (w.cage || hyp(w.x - m.x, w.y - m.y) > 2) continue; const dx = gx - m.x, dy = gy - m.y, l = hyp(dx, dy) || 1; if (((w.x - m.x) * dx + (w.y - m.y) * dy) / l > 0) return true; } return false; }
function centroid(W, m) { let x = 0, y = 0, n = 0; for (const q of W.foes[m.side]) if (q._gun && !q.flee && hyp(q.x - m.x, q.y - m.y) < 110) { x += q.x; y += q.y; n++; } return n ? [x / n, y / n] : null; }
function steer(W, m, K) {
  const k = on(W, m, K); m.retreat = 0; if (!k) return;
  const T = m.tac;
  if (T.retreat && m.hp < 0.35 * m.hpMax && (K.foes.length > 5 || k - 1 > 3)) { m.retreat = 1; let rx = 0, ry = 0; for (const q of K.foes) { const dx = m.x - q.x, dy = m.y - q.y, l = hyp(dx, dy) || 1; rx += dx / l; ry += dy / l; } K.vx = rx; K.vy = ry; return; }
  if (k - 1 < 2) return;   // 총이 둘 넘지 않으면 예전 그대로
  const c = centroid(W, m); if (!c) return;
  let near = null, nd = 1e9; for (const q of W.foes[m.side]) if (q._gun && !q.flee) { const d = hyp(q.x - m.x, q.y - m.y); if (d < nd) { nd = d; near = q; } }
  if (m.z >= 1 && near) { const d = nd || 1, ux = (near.x - m.x) / d, uy = (near.y - m.y) / d, want = d - 62; K.vx = ux * (want > 3 ? 1 : want < -3 ? -1.5 : 0) - uy * m.sf * 0.6; K.vy = uy * (want > 3 ? 1 : want < -3 ? -1.5 : 0) + ux * m.sf * 0.6; return; }
  // 땅: 벽 뒤에 있다가 장전 틈에 나온다
  if (!covered(W, m, c[0], c[1])) return;
  let ready = 0, all = 0; for (const q of W.foes[m.side]) if (q._gun && !q.flee && hyp(q.x - m.x, q.y - m.y) < 110) { all++; if (!((q.cd['머스킷'] || 0) > 2.5)) ready++; }
  const dx = c[0] - m.x, dy = c[1] - m.y, l = hyp(dx, dy) || 1;
  if (ready / all > 0.3) { K.vx = -dx / l * 0.5; K.vy = -dy / l * 0.5; }   // 벽 뒤에 붙는다
  else { K.vx = -dy / l * m.sf * 2; K.vy = dx / l * m.sf * 2; }            // 옆으로 나와 친다
}
function value(W, m, K, o) {
  const s = o.s, k = on(W, m, K); if (!k) return;
  const T = m.tac, g = k - 1;
  if (m.retreat && o.isOff) { o.v *= 0.3; return; }
  if (o.isOff && m.fat > 88 && !m.wave && K.foes.length > 5) { o.v = 0; return; }   // 무리 앞에서 머리가 넘치면(파도) 제 몸을 태운다: 문턱 앞에서 공격을 쉰다
  if (s.t === 'build') {
    if (m.z >= 1 || g < 2) return;
    const c = centroid(W, m); if (!c || covered(W, m, c[0], c[1])) return;
    const B = W.mods.find(r => r.name === 'bulwark'); if (!B || B.api.buildT(m, s) > 20) return;
    if (s.shape === 'ring' && !(K.foes.length > 12 && g > 8)) return;
    o.tx = c[0]; o.ty = c[1];
    if (T.wallSite) { const d = hyp(c[0] - m.x, c[1] - m.y) || 1, wx = m.x + (c[0] - m.x) / d * 1.3, wy = m.y + (c[1] - m.y) / d * 1.3; for (const q of K.foes) if (hyp(q.x - wx, q.y - wy) < 5) return; }
    o.v = s.shape === 'ring' ? 15 : 20;   // 총 앞 땅에선 먼저 벽 (어떤 공격보다 먼저)
  }
  if (T.wallBreak && !K.los && W.walls.some(w => hyp(w.x - K.e.x, w.y - K.e.y) < 3) && (s.el === '물' || (s.hit && s.hit.flat >= 60) || (s.t === 'zone' && s.z.k === 'acid'))) o.v *= 2;
}
module.exports = { on, steer, value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/simul.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 동시 착탄 (대가 tac.simul, 전설 tac.triple)
 * 지연 폭발 결정타를 먼저 걸어 두고, 묶기(실)가 그 직전에 떨어지게 기다린다. 전설은 두 번째 칸에 지연 폭발 하나를 더 겹친다.
 * 같은 사람의 다른 마법이 0.2 s 안에 같은 과녁에 닿으면 엔진이 simul로 센다 */
const { OFF, estDmg, bindOf, C } = require('../util');
// 기다리는 중이면 true (다른 것을 시작하지 않는다. 계획해 기다리는 것은 빈틈이 아니다)
function wait(W, m, K) {
  const e = K.e, sim = m.simul && m.simul.tgt === e && W.t < m.simul.until ? m.simul : null; if (m.simul && !sim) m.simul = null;
  K.sim = sim;
  if (sim && !sim.fired && W.t < sim.at - 0.02 && !(sim.b2 && K.slot === 'B' && W.t >= sim.b2at)) { m.thinkT = Math.min(m.thinkT, sim.at - W.t); m.relT = null; return true; }
  return false;
}
function value(W, m, K, o) {
  const sim = K.sim; if (!sim) return;
  const e = K.e, s = o.s;
  if (!sim.fired && o.n === sim.bind && W.t >= sim.at - 0.02) { const tt = o.Tw + K.d / (32 * (s.fast || 1)); o.v = 50; o.tx = e.x + e.vx * tt; o.ty = e.y + e.vy * tt; }
  else if (sim.b2 && o.n === sim.b2 && K.slot === 'B') { o.v = 40; o.tx = sim.x; o.ty = sim.y; }
  else if (o.isOff) o.v *= 0.2;
}
// 고른 뒤: 동시 착탄을 시작할지 (K.best를 결정타로 바꾼다)
function start(W, m, K) {
  const { T, S, e, d, los, eDown, slot, circ, cand } = K, best = K.best;
  if (!(T.simul && !m.simul && slot === 'A' && !eDown && best && OFF[best.s.t])) return;
  const A2 = cand.filter(c => c.s.t === 'area' && c.s.delay >= 0.3 && !bindOf(c.s, e) && !c.s.big).sort((a, b) => estDmg(b.s) - estDmg(a.s))[0];
  // 큰 수는 동시 착탄의 묶기·결정타로 쓰지 않는다: 모으다 끊기면 역류하고, 짝 계획의 '굳은 과녁에만'을 뒷문으로 연다 (1.10.0)
  const bd = m.book.map(k => S[k]).filter(x => x && x.t === 'thread' && !x.big && bindOf(x, e) >= 0.3 && !((m.cd[x.n] || 0) > 0) && d < C.rangeOf(m, x) && los)[0];
  if (!(A2 && bd)) return;
  const TcA = A2.Tw * (W.rules.fatigue ? 1 + Math.min(m.fat, 100) / 200 : 1), TwB = bd.cast * (1 - 0.35 * (m.mast[bd.n] || 0));
  // 결정타는 묶기가 떨어질 때 과녁이 있을 자리에: 지금 속도로 그때까지 간 자리
  const tl = TcA + A2.s.delay - 0.1; K.best = A2; A2.tx = e.x + e.vx * tl; A2.ty = e.y + e.vy * tl;
  m.simul = { tgt: e, a: A2.n, bind: bd.n, at: W.t + tl - TwB - d / (32 * (bd.fast || 1)), until: W.t + TcA + A2.s.delay + 0.5, x: A2.tx, y: A2.ty };
  if (T.triple && circ >= 2) { const A3 = cand.filter(c => c !== A2 && c.s.t === 'area' && c.s.delay > 0).sort((a, b) => estDmg(b.s) - estDmg(a.s))[0]; if (A3) { m.simul.b2 = A3.n; m.simul.b2at = W.t + TcA + A2.s.delay - A3.Tw - A3.s.delay; } }
}
// 시전을 건 뒤: 묶기를 쐈다
function fired(W, m, K, s, Tc) { if (m.simul && s.n === m.simul.bind) { m.simul.fired = 1; m.log.comboTry++; m.log.cTry.simul = (m.log.cTry.simul || 0) + 1; m.comboPend = { tgt: K.e, kind: 'simul', until: W.t + Tc + 0.8 }; } }
module.exports = { wait, value, start, fired };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/survive.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 스스로 죽지 않기 (v2.6, tac.survive, 선명도 5 이상, SPEC 30장)
 * 머리 넘침 막기: 풀 때 머리가 넘쳐 굳을(폭주) 마법, 고르지 않은 파도에 오를 마법은 고르지 않는다. 같이 모으는 다른 칸이 먼저 풀며 더할 머리도 넣는다.
 *   고르지 않은 파도에 올랐으면 위협이 없을 때 쉰다(파도는 75 아래에서 꺼진다)
 *   날다 굳으면 떨어진다(높이 × 4). 전설끼리의 받은 피해 가운데 추락이 40%였고 그 절반이 폭주로 굳어 떨어진 것이었다(reports/v2.6.0.md)
 * 걸음의 단단한 벽(소금 원)·과열 전 착지·굳을 위험에 낮게 날기는 규칙 파일(rules/saltRing·flight)의 bound 훅에, 자동 진의 넘침은 rules/multiSlot에 */
const { heatOver, castTime } = require('../util');
function value(W, m, K, o) {
  if (!m.tac.survive || m.C < 5 || !(o.v > 0)) return;
  const B = K.slot === 'B', other = B ? m.cast : m.castB, extra = other && !other.auto ? other.s.cost * (other.B ? 1.3 : 1) : 0;
  if (heatOver(W, m, o.s.cost * (B ? 1.3 : 1) + extra, castTime(W, m, o.Tw), 1)) o.v = 0;
}
// 고르지 않은 파도에 올랐으면 위협이 없을 때 쉬어 내려온다(75 아래에서 꺼진다)
const rest = (W, m, K) => m.tac.survive && m.C >= 5 && m.wave && !(m.tac.waveChoose && m.waveWant) && !K.aimed;
module.exports = { value, rest };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/swarm.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 무리 (tac.swarm, 모두, v2.0 둘째 묶음 SPEC 25장) — 셋 넘는 편이 훨씬 선명한 적(선명도 3배 이상) 하나를 상대할 때만
 * 자리: 적의 장악권 반경(domainR × C) 바로 밖(+ 5 m)에 흩어져 선다: 내 마법의 사거리가 그보다 길면(총은 장악권과 상관없어 제자리). 동료와 4 m 안이면 서로 밀어낸다(뭉치면 구름 하나에 무너진다)
 *   총: 적이 멀리(50 m 넘게) 떠 있으면 쏘지 않으니(rules/army) 흩어지거나 가까운 바위·벽 뒤로
 * 값: 적이 눈멀었으면 무거운 수(한 방 45 이상) × 3, 동료가 번쩍임을 모으는 중이면 × 2 (읽지 못하는 틈에 동시에)
 *   적이 벽 뒤(시야 없음, 곁에 벽)면 곡사·박격포·산·물 × 2
 * 협공 (v2.10, 판단 수준·등급의 tac.swarmR: 선명도 몇 배부터 무리 싸움인가, 기본 3. 상위는 1.8): 적의 장악권이 내 사거리보다 넓으면(밖에서 칠 수 없다)
 *   둘레를 나눠 선다: 살아 있는 동료를 번호 차례로 세워 적 둘레의 각 360°/n마다 한 자리, 반지름은 내 공격 사거리의 0.75. 여러 방향에서 동시에 치면 한쪽으로 피해도 다른 쪽에 맞는다
 *   나는 적엔 지연 폭발·곡사 × 0.2(떠 있으면 닿지 않는다). 명중 문턱(날카롭게)은 쓰지 않는다: 혼자선 낮은 가망도 여럿이 함께면 맞는다
 *   맞춰 치기: 동료의 공격이 내 것과 0.4 s 안에 풀리면 × (1 + 0.5 × 그 수, 셋까지): 한 박자에 몰아 피할 틈을 없앤다 */
const { C, hyp, castTime, OFF } = require('../util');
// 이 사람이 무리 싸움 중인가: 과녁이 선명도 3배 이상, 내 편이 셋 넘게 살아 있다. 장악권 반경이 있을 때만(rules.domainR)
function on(W, m, e) { if (!(m.tac.swarm && W.rules.domainR > 0 && e.C >= (m.tac.swarmR || 3) * m.C)) return false; let n = 0; for (const q of W.ms) if (q.side === m.side && q.hp > 0 && ++n > 3) return true; return false; }
const heavyOf = s => s.hit && s.hit.flat >= 45;
// 협공의 첫 각: 그 편이 처음 부를 때 편의 무게중심 쪽을 가운데로, 편마다 하나
const BASE = new WeakMap();   // 세계마다 편의 첫 각 (사람 객체에 칸을 더하지 않는다)
function baseA(W, m, e, n) {
  let b = BASE.get(W); if (!b) BASE.set(W, b = {}); if (b[m.side] !== undefined) return b[m.side];
  let x = 0, y = 0, k = 0; for (const q of W.ms) if (q.side === m.side && q.hp > 0) { x += q.x; y += q.y; k++; } return (b[m.side] = C.atan2(y / k - e.y, x / k - e.x) - 3.1416 * (n - 1) / n);
}
function steer(W, m, K) {
  const e = K.e; if (!on(W, m, e) || K.stance === 'breakout' || m.flee) return;
  let R = 0; for (const n of m.book) { const s = K.S[n]; if (s && !s.mundane && s.role === '공격') { const r = C.rangeOf(m, s); if (r > R) R = r; } }   // 마법의 사거리만 (총은 장악권과 상관없다)
  const D = W.rules.domainR * e.C + 5, d = hyp(e.x - m.x, e.y - m.y) || 1, ux = (e.x - m.x) / d, uy = (e.y - m.y) / d;
  let vx = K.vx, vy = K.vy;
  const gun = m.book.some(n => { const s = K.S[n]; return s && s.mundane && s.t === 'proj'; });
  if (gun && e.z >= 2 && d > 50) {   // 탄을 아낀다: 가까운 가림 뒤로 (없으면 흩어진다)
    let best = null, bd = 15; for (const o of W.obs) { const q = hyp(o.x - m.x, o.y - m.y); if (q < bd) { bd = q; best = o; } } const ws = W.walls, a = ws.length ? C.wallsIn(W, m.x - 15, m.y - 15, m.x + 15, m.y + 15) : ws; for (let i = 0; i < a.length; i++) { const o = ws[a[i]]; const q = hyp(o.x - m.x, o.y - m.y); if (q < bd) { bd = q; best = o; } }
    if (best) { const ox = best.x - e.x, oy = best.y - e.y, ol = hyp(ox, oy) || 1, tx = best.x + ox / ol * (best.r + 0.6), ty = best.y + oy / ol * (best.r + 0.6); vx = tx - m.x; vy = ty - m.y; }
    else { vx = 0; vy = 0; }
  } else if (R > D) { const want = d - D; vx = ux * (want > 2 ? 1 : want < -1 ? -2 : 0) - uy * m.sf * 0.4; vy = uy * (want > 2 ? 1 : want < -1 ? -2 : 0) + ux * m.sf * 0.4; }   // 반경 바로 밖, 옆으로 돈다
  else if (m.tac.swarmR) {   // 협공 (v2.10): 둘레를 나눠 선다
    let i = 0, n = 0; for (const q of W.ms) if (q.side === m.side && q.hp > 0) { if (q === m) i = n; n++; }
    const a0 = baseA(W, m, e, n), a = a0 + i / n * 6.2832, r = R * 0.75;
    const tx = e.x + C.cos(a) * r, ty = e.y + C.sin(a) * r, l = hyp(tx - m.x, ty - m.y) || 1; const k = l > 3 ? 3 : l; vx = (tx - m.x) / l * k; vy = (ty - m.y) / l * k;
  }
  else return;
  for (const q of W.ms) { if (q === m || q.side !== m.side || q.hp <= 0) continue; const dx = m.x - q.x, dy = m.y - q.y; if (dx > 4 || dx < -4 || dy > 4 || dy < -4) continue; const l = hyp(dx, dy) || 0.1; if (l < 4) { vx += dx / l * (4 - l) * 0.5; vy += dy / l * (4 - l) * 0.5; } }   // 흩어진다
  K.vx = vx; K.vy = vy;
}
function value(W, m, K, o) {
  const e = K.e, s = o.s; if (!(o.v > 0) || !on(W, m, e)) return;
  if (heavyOf(s)) { if (e.st.blind > 0.2) o.v *= 3; else for (const q of W.ms) if (q.side === m.side && q !== m && q.hp > 0 && q.cast && q.cast.s.t === 'flash') { o.v *= 2; break; } }
  if (m.tac.swarmR && e.z >= 1 && (s.t === 'area' || s.t === 'lob')) o.v *= 0.2;   // 나는 적엔 땅에 떨어지는 것(지연 폭발·곡사)이 닿지 않는다: 실·투사체로 (v2.10)
  if (m.tac.swarmR && OFF[s.t]) { const t0 = castTime(W, m, o.Tw); let k = 0; for (const q of W.ms) { if (q === m || q.side !== m.side || q.hp <= 0) continue; const c = q.cast; if (c && c.tgt === e && OFF[c.s.t] && Math.abs(c.T - c.t - t0) < 0.4 && ++k >= 3) break; } if (k) o.v *= 1 + 0.5 * k; }   // 맞춰 치기 (v2.10)
  if (!K.los && W.walls.some(w => hyp(w.x - e.x, w.y - e.y) < 3) && (s.t === 'lob' || (s.t === 'zone' && s.z.k === 'acid') || s.el === '물')) o.v *= 2;   // 벽 뒤의 적
}
module.exports = { on, steer, value };
}, {"../util":"src/brain/util.js"}];
D["src/brain/techniques/tempo.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 박자 (초보 tac.pause, 상급 tac.tempo)
 * 쏜 뒤 멈춤(초보): 쏘고 나서 정해진 시간(사람마다 한 번 정한 박자) 동안 다음을 고르지 않는다.
 * 박자 흔들기(상급): 가끔 한 박 쉬었다 쏜다 (빈틈으로 세지 않는다). 날카롭게(대가부터)는 초당으로, 몰아칠 때·빈틈엔 쉬지 않는다 */
// 날카롭게(대가부터, v2.7): 판단이 잦을수록 한 번의 확률을 줄여 초당 같게(상급 0.13 s 기준). 몰아칠 때(작전 압박·끝내기)와 과녁의 빈틈엔 쉬지 않는다
// (예전엔 판단마다 20%라 0.05 s마다 판단하는 전설이 사거리 안 시간의 35%를 쉬었다)
const sharpNo = (W, m, K) => (m.op && (m.op.cur === 'press' || m.op.cur === 'finish')) || K.e.st.stun > 0 || K.e.st.root > 0 || K.e.crash > 0 || K.e.emptyT > W.t;
function pause(W, m) { return !!(m.pauseLen && W.t - m.lastRel < m.pauseLen); }
function hold(W, m, K) {
  if (m.hold) { if (W.t < m.hold) return true; m.hold = 0; }
  else if (K.T.tempo && K.slot === 'A' && !K.aimed && !(K.T.sharp && m.C >= 5 && sharpNo(W, m, K)) && W.rng() < (K.T.sharp && m.C >= 5 ? 0.2 * m.dec / 0.13 : 0.2)) { m.hold = W.t + W.rnd(0.1, 0.35); m.relT = null; return true; }
  return false;
}
module.exports = { pause, hold };
}, {}];
D["src/brain/techniques/trapline.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 덫길 (v2.13, tac.trapLine, 상급부터, SPEC 37장, 수는 data/trapline.json) — 덫은 상대가 올 길·도망칠 길에, 한 자리에 몰지 않고 길을 그리듯
 * 받은 측정: 전설끼리 시작 4.9 s에 번개 지뢰 아홉씩을 가운데에 쏟아 덫 22개가 한 무더기로 쌓이고 끝까지 아무도 안 밟았다(청사진 '함정 격자' 3 × 3)
 * 자리: 나와 상대 사이(올 길)의 along 0.4·0.55·0.7 몫 자리와 그 좌우 side 2.5 m, 상대 뒤 behind 4 m(도망칠 길). 내 덫이 cell 3 m 안에 cellMax 2개 넘게 있는 자리는 버린다
 * 한 사람이 gap 0.8 s에 하나만(한꺼번에 쏟지 않는다). 청사진의 덫도 꽉 찬 칸엔 놓지 않는다(rules/blueprint가 crowded를 부른다) */
const { hyp } = require('../util');
const P = require('../../../data/trapline.json');
// (x, y)의 칸에 내 덫이 꽉 찼나
const { crowded } = require('../lib/traps');   // 꽉 찬 칸 (v2.23.1 공용: 청사진도 부른다)
function value(W, m, K, o) {
  if (!m.tac.trapLine || o.s.t !== 'trap' || !(o.v > 0)) return;
  if (W.t - K.trapT < P.gap) { o.v = 0; return; }   // 한꺼번에 쏟지 않는다
  const e = K.e, ux = K.ux, uy = K.uy, d = K.d, reach = 6 * Math.sqrt(m.C);   // 엔진은 내 쪽으로 6√C m까지 놓는다
  let bx = NaN, by = NaN;
  for (let i = 0; i < P.along.length && bx !== bx; i++) { const r = Math.min(reach, d * P.along[i]);
    for (let j = 0; j < 3; j++) { const sd = j === 0 ? 0 : j === 1 ? P.side : -P.side, x = m.x + ux * r - uy * sd, y = m.y + uy * r + ux * sd; if (!crowded(W, m, x, y)) { bx = x; by = y; break; } } }
  if (bx !== bx && d + P.behind < reach) { const x = e.x + ux * P.behind, y = e.y + uy * P.behind; if (!crowded(W, m, x, y)) { bx = x; by = y; } }   // 도망칠 길
  if (bx !== bx) { o.v = 0; return; }   // 놓을 길이 꽉 찼다
  o.tx = bx; o.ty = by;
}
function commit(W, m, K, best) { if (m.tac.trapLine && best.s.t === 'trap') K.trapT = W.t; }
module.exports = { value, commit, crowded, P };
}, {"../util":"src/brain/util.js","../../../data/trapline.json":"data/trapline.json","../lib/traps":"src/brain/lib/traps.js"}];
D["src/brain/util.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌의 공용 도구 (brain/util)
 * 판단 조각(read·stance·move·choose)과 기술(techniques/), 규칙 모듈의 두뇌 훅이 함께 쓴다. 규칙 모듈의 brain(B)이 받는 B가 이것이다.
 * 한 판 안에서 바뀌지 않는 값(덱이 정하는 값, 추정 피해)은 한 번만 잰다 (속도, 1.11.1) */
const C = require('../core');
const { hyp } = C;

const NOKIND = {}, NONE = [];
// 돌파·자리 판단의 방향표: 늘 같은 각이라 한 번만 잰다 (같은 C.cos·C.sin이라 값도 같다, 속도 1.11.1)
const DIR16 = Array.from({ length: 16 }, (_, k) => { const a = k / 16 * 6.2832; return [C.cos(a), C.sin(a)]; });
const DIR8 = Array.from({ length: 8 }, (_, k) => { const a = k / 8 * 6.2832; return [C.cos(a), C.sin(a)]; });   // 비어 있는 것 (새로 만들지 않는다)
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const SELF_GAP = 1.5;   // 지연 폭발 반지름 밖으로 둘 여유 (m): 몸 0.3 + 겨냥 흔들림과 지연 동안의 걸음
function catOf(s) {
  if (s.t === 'trap' || s.role === '함정') return '함정';
  if (s.t === 'move' || (s.t === 'buff' && s.b.speed)) return '이동';
  if (s.role === '방어' || s.t === 'wall' || s.t === 'ring' || s.t === 'shoot' || s.t === 'smother' || s.t === 'buff') return '방어';
  return '공격';
}
const FORMNAME = { taunt: '상대 자리', proj: '던지기', lob: '던지기', touch: '몸', cone: '앞으로 뿜기', thread: '실', area: '상대 자리', zone: '자리 깔기', trap: '함정', wall: '내 앞 벽', buff: '몸', move: '이동', ring: '몸', shoot: '몸', smother: '몸' };
const isSetup = s => !!s && (s.t === 'trap' || s.t === 'zone' || (s.hit && (s.hit.wet || s.hit.root || s.hit.stun || s.hit.chill)) || (s.t === 'area' && (s.root || s.stun)) || (s.t === 'cone' && s.wet));
// 역할 (v2.2, 26장): 공격·방어·지형(벽·지대·함정·가두기·세우기·벽 밀기)·이동·강화(걸음 버프)
const TERRAIN = { wall: 1, build: 1, trap: 1, cage: 1, topple: 1, blueprint: 1 };
function roleOf(s) { if (TERRAIN[s.t] || (s.t === 'zone' && s.z && s.z.k !== 'rain' && s.z.k !== 'smoke' && s.z.k !== 'mist' && s.z.k !== 'absorb')) return '지형'; if (s.t === 'move') return '이동'; if (s.t === 'buff' && s.b && s.b.speed) return '강화'; if (s.role === '공격') return '공격'; return '방어'; }
function logDec(m, s, slot, ctx) {
  const L = m.log.dec; L.n++;
  const c = catOf(s); L.cat[c] = (L.cat[c] || 0) + 1; const f = FORMNAME[s.t]; L.form[f] = (L.form[f] || 0) + 1;
  if (c === '방어') { L.def++; if (ctx.aimed) L.react++; }
  if (c === '공격') { L.atk++; if (ctx.combo) L.combo++; }
  if (c === '함정') { L.trap++; if (ctx.path) L.trapPath++; }
  if (ctx.barrel) L.barrel++; if (slot === 'B') L.slotB++; if (slot === 'auto') L.auto++;
  const ro = roleOf(s), R = m.mlog.role[slot === 'B' ? 'B' : slot === 'auto' ? 'auto' : 'A']; R[ro] = (R[ro] || 0) + 1; if (ro === '지형') m.mlog.built++;   // 칸마다 역할 (v2.2 지표)
}
// 추정 피해는 마법마다 정해져 있다: 한 번 재고 기억한다 (결정론 pow가 비싸다, 속도 1.11.1)
const EST = new WeakMap();
function estDmg(s) { let v = EST.get(s); if (v === undefined) { v = estDmg0(s); EST.set(s, v); } return v; }
function estDmg0(s) {
  if (s.hit && s.hit.flat) return s.hit.flat; if (s.hit && s.hit.dmg) return s.hit.dmg;
  if (s.burst && s.burst.dmg) return s.burst.dmg; if (s.burst) return 14;
  if (s.t === 'proj') return Math.min((s.hit && s.hit.cap) || 99, 0.55 * C.pow(0.5 * s.m * s.v * s.v, 0.75)) * (s.multi ? s.multi * 0.5 : 1);
  if (s.t === 'thread') return 0.8 * C.pow(s.E, 0.55);
  if (s.t === 'cone') return s.dps * s.dur;
  return s.dmg || 0;
}

// 머리 넘침 (v2.6, 스스로 죽지 않기): 지금 이 마법을 시작해 Tc 뒤에 풀면 그때 굳는가(폭주). 날면 머리가 더 뜨거워진다(비행 피로 − 회복 4/s).
// 파도: 이미 탔거나 스스로 고른 파도(파도 고르기, 전설)면 170에서 휩쓸리는지만 본다. 고르지 않은 파도(100을 넘으면 저절로 오른다)는 타지 않는다:
// 몸을 태우고(초당 1.5~2.4) 170에서 휩쓸린다. 대가/상급이 0.63 → 0.76 (reports/v2.6.0.md)
// 쥔 수들이 풀릴 때 더해질 머리 열 (v2.37, 두뇌 훅 heat: 셋째 칸부터의 수, rules/ringLedger). 훅이 없으면 0
function pendHeat(W, m) { let h = 0; const hs = W._bh.heat; for (let i = 0; i < hs.length; i++) h = hs[i](W, m, h); return h; }
function heatOver(W, m, cost, Tc, mul) {
  if (!W.rules.fatigue) return false;
  const L = m.load || 0, air = m.fly === 1 && m.z >= 1 ? 1 + 6 * L + (L > 1 ? 40 * (L - 1) : 0) : 0, f0 = m.fat + pendHeat(W, m) + (air - 4) * (Tc > 0 ? Tc : 0), f = (air && m.fat <= 100 && f0 > 100 ? 100 : f0) + cost * mul * 1.6;   // 비행 피로는 100에서 멈춘다
  if (W.rules.wave && m.type !== '이단' && (m.wave || (m.tac.waveChoose && m.waveWant))) return f > 165;   // 고르지 않은 파도는 타지 않는다: 몸을 태우고 170에서 휩쓸린다
  if (W.rules.wave && m.type === '이단') return false;
  return f > 97;   // 모으는 동안 끊기·쿠션(1.5씩)이 더할 몫을 남긴다
}
// 땅이 안전한가 (v2.6): 살아 있는 적 누구도 땅에 선 사람만 치는 수(함정·안 보이는 구름·벽 밀기·가두기)를 갖고 있지 않다. 대마법사의 함정은 위력 C^2.5로 한 방이다
function groundSafe(W, m) { if (W.rules.bluntK > 0) return true; const f = W.foes[m.side];   // 마법의 부딪힘에 비율 감쇠가 있으면(v2.7) 함정은 한 방이 아니다
   for (let i = 0; i < f.length; i++) if (deck(f[i], W.spells).ground) return false; return true; }
// 쓰는 서클 수: 서클 규칙(rules/multiSlot)이 꺼지면 누구나 1
// 쥘 수 있는 고리 수 (v2.34): 서클 수에서 규칙이 고친다(합창의 앞소리꾼은 모은 고리, rules/chorusCast)
function ringsOf(W, q) { let r = q.circles; const h = W._bh.rings; for (let i = 0; i < h.length; i++) r = h[i](W, q, r); return r; }
function circOf(W, q) { let c = 1; const h = W._bh.circles; for (let i = 0; i < h.length; i++) c = h[i](W, q, c); return c; }
// 큰 수와 짝 (1.9.0): 짝 묶기를 쓰면 그 틈에 큰 수를 꽂는다. bind = 굳힘 시간 안에 닿게, wet = 젖은 동안, ice = 내 빙판 위에 있을 때, herd = 불벽으로 몬 쪽에
const PAIRS = { '번개 그물': { fin: '번개 창', kind: 'bind' }, '물 대포': { fin: '대낙뢰', kind: 'wet' }, '빙판': { fin: '대낙뢰', kind: 'ice' }, '불벽': { fin: '화산 기둥', kind: 'herd' } };
// 과녁이 구를 쪽 (내 쪽에서 본 왼쪽 +1, 오른쪽 −1): 한쪽이 바위·벽·가장자리로 막혔으면 다른 쪽, 아니면 본 버릇, 모르면 오른쪽(구르기 기본 방향: 날아오는 쪽의 반시계)
function rollSide(W, e, ux, uy, mem) {
  const blockedAt = (sx) => { const px = e.x - uy * sx * 2, py = e.y + ux * sx * 2; return px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1 || W.obs.some(o => hyp(o.x - px, o.y - py) < o.r + 0.4) || W.walls.some(o => hyp(o.x - px, o.y - py) < o.r + 0.4); };
  const bl = blockedAt(1), br = blockedAt(-1); if (bl && !br) return -1; if (br && !bl) return 1;
  if (mem && mem.L !== mem.R) return mem.L > mem.R ? 1 : -1; return -1;
}
// 붙잡는 마법인가: 굳히기·묶기, 또는 느리게 하기(냉기·빙판)
function holdsOf(s, e) { return OFF[s.t] || s.t === 'zone' ? (bindOf(s, e) > 0 || !!s.cramp || !!(s.hit && s.hit.mycel) || !!s.chill || !!(s.hit && s.hit.chill) || !!(s.z && (s.z.k === 'ice' || s.z.k === 'chill'))) : false; }
// 실제 시전 시간 (s): 숙련을 뺀 예비동작 × 기침·머리 피로 × 규칙의 것(파도·꺼짐, rules/wave)
function castTime(W, m, Tw) { let t = Tw * (m.st.cough > 0 ? 1.5 : 1) * (W.rules.fatigue ? 1 + Math.min(m.fat, 100) / 200 : 1); const h = W._bh.castTime; for (let i = 0; i < h.length; i++) t = h[i](W, m, t); return t; }
// 이 마법이 과녁을 묶거나 굳히는 시간 (s). 안 보이는 발밑 공격은 소금 밑창에 × 0.3, 실은 min(1.2, E/800)
function bindOf(s, e) {
  const b = s.t === 'thread' ? (s.cramp ? 0 : Math.min(1.2, s.E / 800)) : Math.max(s.root || 0, s.stun || 0, (s.hit && Math.max(s.hit.root || 0, s.hit.stun || 0, s.hit.fetter && e.st && e.st.wet > 0.8 ? s.hit.fetter : 0)) || 0);
  return b * (s.t === 'area' && !s.vis && e.gear && e.gear.soles ? 0.3 : 1);
}
// 몸 묶기 (bodyBind, 1.11.0): 과녁이 이 큰 수를 빠져나갈 수 없는가. 과녁은 예비동작의 마지막 0.5 s부터(눈멀었으면 눈이 뜨일 때부터, 못 읽는 사람은 보이는 구름부터)
// 닿을 때까지 걷고 구른다. 그 거리가 맞는 반지름에 못 미치면 붙잡혔다. 안 보이는 구름은 떨어지기 전까지만 본다. 가두는 기둥 안이면 거리 절반
function caged(W, q) { let n = 0; for (const w of W.walls) if (w.cage && w.own !== q.side && hyp(w.x - q.x, w.y - q.y) < 3.6) n++; return n >= 3; }
function pinned(W, m, s, e, ct, d, st0, cg) {
  const st = st0 || e.st, T = ct + landDelay(s, d); if (Math.max(st.stun || 0, st.root || 0) > T + 0.02) return true;
  const reads = e.tac && e.tac.readCast, blind = st.blind > 0 ? st.blind : 0;
  const see = s.t === 'area' ? (s.vis ? T : ct) : ct;   // 실은 시전 끝에 바로 닿는다
  const from = Math.max(blind, reads ? Math.max(0, ct - 0.5) : T);
  let tEsc = Math.max(0, see - from - Math.max(st.stun || 0, st.root || 0)); if (tEsc <= 0) return true;
  const noRoll = st.mycel > from || st.cramp > from || e.stam < 1.5 || e.rollCd > from + tEsc;
  const sp = 5 * (st.cramp > from ? 0.5 : st.mycel > from ? 0.6 : 1) * (st.chill > from ? 0.7 : 1);
  const esc = (sp * tEsc + (noRoll ? 0 : 2 * (st.lime > from ? 0.5 : 1))) * (cg || caged(W, e) ? 0.5 : 1);
  const need = s.t === 'area' ? s.r * C.sizeOf(m, s) + 0.3 : 0.8;
  return esc < need * 0.85;
}
// 과녁이 지금부터 나를 칠 수 있는 가장 이른 때 (s): 모으던 공격이 닿는 때, 또는 간격이 끝난 가장 빠른 공격을 지금 시작해 닿는 때. 굳음·빈손이면 그만큼 늦다
// 몸 묶기는 굳힘과 달리 시전을 막지 못한다: 붙잡아도 이보다 오래 모으면 역류한다
function hitBack(W, e, S, d) {
  let t = 1e9; const lock = Math.max(e.st.stun || 0, e.emptyT > W.t ? e.emptyT - W.t : 0);   // 빈손은 rules/risk가 켜졌을 때만 생긴다
  for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && !c.unseen && OFF[c.s.t] && !c.s.big) t = Math.min(t, c.T - c.t + landDelay(c.s, d)); }
  for (const n of e.book) { const x = S[n]; if (!x || !OFF[x.t] || x.big || (x.t === 'touch' ? d > 1.3 : x.t === 'cone' ? d > x.L * C.sizeOf(e, x) : d > (x.home ? 12 : C.rangeOf(e, x)))) continue; t = Math.min(t, Math.max(lock, e.cd[n] || 0) + castTime(W, e, x.cast) + landDelay(x, d) + e.dec * 0.5); }
  return t;
}
// 붙잡는 마법 s가 걸린 직후 과녁의 상태 (가정). 기둥은 cg
function afterPin(s, e, st) {
  const h = s.hit || {}, o = Object.assign({}, st);
  if (h.mycel) o.mycel = h.mycel; if (h.lime) o.lime = h.lime; if (h.fetter) o.root = Math.max(o.root || 0, h.fetter); if (s.cramp) o.cramp = s.cramp;
  if (s.t === 'zone' && s.z.k === 'acid') o.blind = Math.max(o.blind || 0, 0.6); if (s.t === 'cone' && s.blind) o.blind = s.blind;   // 산 안개는 안에 있는 동안 0.3 s씩 이어진다
  return o;
}
// 과녁을 큰 수에 붙잡아 둘 수단인가 (몸 묶기·족쇄·기둥·눈멂)
function pinOf(s, e) {
  const h = s.hit || {};
  if (h.mycel) return !(e.st.mycel > 0.5); if (h.lime) return !(e.st.lime > 0.5); if (h.fetter) return e.st.wet > 0.8 && !(e.st.root > 0);
  if (s.cramp) return !e.buf.elecRes && !(e.st.cramp > 0.5); if (s.t === 'cage') return true;
  if ((s.t === 'zone' && s.z.k === 'acid') || (s.t === 'cone' && s.blind)) return !(e.st.blind > 0.3);
  return false;
}
// 덱이 정하는 값: 사람마다 한 번 만든다 (속도, 1.11.1). 책과 선명도는 판 중에 바뀌지 않는다
function deck(m, S) {
  const k = m._deck; if (k && k.S === S) return k;
  const D = { S, maxR: 0, offMax: 0, def: [], front: [], kinds: {}, mund: false, threadTouch: false, fireThread: false, bluntHit: false, ground: false, bigs: [], nm: [], sp: [], mast: [], he: [], off: [], R: [] };
  for (const n of m.book) {
    const s = S[n]; if (!s) continue;
    D.nm.push(n); D.sp.push(s); D.mast.push(m.mast[n] || 0); D.he.push(m.hitEst[n] ?? 0.35); D.off.push(OFF[s.t]); D.R.push(C.rangeOf(m, s));   // 후보 고르기가 이름으로 찾지 않게
    if (OFF[s.t]) { D.maxR = Math.max(D.maxR, s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : C.rangeOf(m, s)); D.offMax = Math.max(D.offMax, estDmg(s)); }
    if ((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot') D.def.push(n);
    if (s.b && s.b.front) D.front.push(n);
    const kd = kindOf(s); if (kd) D.kinds[kd] = 1;
    if (s.mundane) D.mund = true; if (s.t === 'thread' || s.t === 'touch') D.threadTouch = true; if (s.kind === 'fire' || s.t === 'thread') D.fireThread = true;
    if (s.hit && s.hit.kind === 'blunt') D.bluntHit = true; if (s.big) D.bigs.push(s);
    if (s.t === 'trap' || (s.t === 'area' && !s.vis) || s.t === 'topple' || s.t === 'cage') D.ground = true;   // 땅에 선 사람만 치는 수 (v2.6: 떠 있으면 닿지 않는다)
  }
  return (m._deck = D);
}
// (px, py)가 바위 반지름 + pad 안인가
function obsNear(W, px, py, pad) { const O = W.obs; for (let i = 0; i < O.length; i++) { const o = O[i]; if (hyp(o.x - px, o.y - py) < o.r + pad) return true; } return false; }
// m에서 r m 안에 있는 사람이 있는가
function anyNear(qs, m, r) { for (let i = 0; i < qs.length; i++) if (hyp(qs[i].x - m.x, qs[i].y - m.y) < r) return true; return false; }
// 큰 공격인가: 쏘는 사람의 공격 중 가장 센 것의 60% 이상
function bigAttack(c, S) { const q = c.by; if (!q) return true; return estDmg(c.s) >= 0.6 * deck(q, S).offMax; }
// 시전이 끝나고 과녁에 닿기까지 (s): 투사체는 날아가는 시간, 지연 폭발·곡사는 지연
function landDelay(s, d) { return s.t === 'proj' ? d / s.v : s.t === 'area' ? s.delay : s.t === 'lob' ? s.flight : s.t === 'thread' ? d / (32 * (s.fast || 1)) : 0; }
// 사람의 공격 마법 최대 사거리 (m)
const maxRange = (m, S) => deck(m, S).maxR;
// 내가 (x, y)에 섰을 때 제 손끝의 장악 몫: 적 신호가 옅은 땅일수록 크다 (SPEC 5장의 f, 내 몫은 거리 0)
function ownShare(W, m, foes, x, y) { const L = W.rules.domainL; let o = 0; for (const q of foes) o += C.sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + hyp(x - q.x, y - q.y) / L); const ms = C.sigOf(W, m); return ms / (ms + o); }
// 마법의 피해 종류 (덱 읽기)
function kindOf(s) { return s.kind || (s.hit && s.hit.kind) || (s.burst && s.burst.kind) || (s.tr && s.tr.kind) || (s.t === 'thread' ? 'elec' : s.z ? ({ fire: 'fire', nh3: 'tox', spore: 'tox', acid: 'tox', h2s: 'tox' })[s.z.k] : null) || null; }
// 덱 읽기 (전설): 이 마법이 상대 책의 피해 종류에 대한 천적이고, 아직 켜져 있지 않은가
function counters(s, ek, m, W) {
  if (ek.fire && s.t === 'zone' && ['rain', 'mist', 'absorb'].includes(s.z.k) && !(s.z.k === 'rain' && ek.elec)) return   // 비는 나를 적셔 전기에 약하게 한다 !W.zones.some(z => z.src === m && z.k === s.z.k && hyp(z.x - m.x, z.y - m.y) < 3);
  if (s.t !== 'buff') return false;
  if (ek.elec && s.b.elecRes && !s.react) return !m.buf.elecRes;
  if (ek.blunt && (s.b.bluntRes || s.b.block)) return !m.buf.bluntRes && !m.buf.front;
  if (ek.tox && s.b.toxRes) return !m.buf.toxRes;
  return false;
}
// 과녁의 방어 마법(반응형 몸·벽·격추)이 모두 간격 중인가. 하나도 없으면 아니다
function defenseDown(e, S, W) {
  const def = deck(e, S).def; if (!def.length) return false;
  for (let i = 0; i < def.length; i++) if (!((e.cd[def[i]] || 0) > 0.3)) return false;
  if (!(circOf(W, e) >= 3 && e.autoCd <= 0)) return true;
  for (let i = 0; i < def.length; i++) if ((e.cd[def[i]] || 0) <= 0) return false;
  return true;
}

// 상대가 숨긴 수(손잡이)를 쓰나: 풀린 수는 보인다(손잡이 규칙의 기록 m.mlog.tune의 'h' 열쇠, v2.20)
const hidesOf = e => { const T = e && e.mlog.tune; if (!T) return false; for (const k in T) if (k.charCodeAt(k.length - 1) === 104) return true; return false; };
module.exports = { hidesOf, heatOver, groundSafe, C, hyp, roleOf, NOKIND, NONE, DIR16, DIR8, OFF, SELF_GAP, catOf, FORMNAME, isSetup, logDec, estDmg, PAIRS, rollSide, holdsOf, castTime, bindOf, caged, pinned, hitBack, afterPin, pinOf, deck, obsNear, anyNear, bigAttack, landDelay, maxRange, ownShare, kindOf, counters, defenseDown, circOf, ringsOf, pendHeat };
}, {"../core":"src/core.js"}];
D["src/core.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 엔진 핵심 v2.37.0
 * 단위: m, s, kg, J. 고정 시간 간격 DT = 1/30 s. 같은 씨앗이면 같은 결과.
 * 규칙의 근거와 수식은 SPEC.md 참고. 이 파일을 바꾸면 SPEC과 버전을 같이 올린다.
 * 규칙(스위치)은 src/rules/에 하나에 한 파일로 있다. 핵심은 정해진 자리에서 켜진 규칙의 훅(W.H)만 부른다 (SPEC 22장).
 * 브라우저는 sandbox/pack.js가 묶은 sandbox/arena.js로 읽는다(전역 ArenaCore).
 * ========================================================================= */
const { sin, cos, atan2, exp, log, pow, hyp, hyp3, clamp, mulberry32 } = require('./math');
const { SPELLS } = require('./data');
const R = require('./rules');
const VERSION = '2.37.0';
const DT0 = 1 / 30; let DT = DT0;   // 걸음 간격: 세계마다 W.dt (fineStep이면 1/60, v2.14). stepWorld가 그 세계의 것으로 맞춘다

// 1.x의 기본 동작 (SPEC 24장): rules에 주면 v2.0의 새 기본을 끈다
const V1_RULES = { risk: false, saltRing: false, wave: false, hpScale: false, hpK: 2.5, hpFloor: 0, bodyK: 0, evade: false, flight: false, domainR: 0, domainPath: false, callus: 0, bluntK: 0, endureK: 0, hold: false, gluRegen: 1.2, breath: false, light: false, bulwark: false, army: false, morale: false };   // hpK·hpFloor: 1.x에서 hpScale을 켠 판도 그대로
const PROFILES = require('../data/profiles.json');   // 규칙 묶음 (v2.23.1)
const DEFAULT_RULES = {
  domain: true,        // 장악권: 같은 공기는 가장 선명한 신호를 따른다
  circles: true,       // 서클: 두 번째 칸, 3서클부터 자동 진
  fatigue: true,       // 머리 피로와 폭주
  barrels: false,      // 지렛대: 화약통
  friendlyFire: true,  // 투사체와 폭발은 아군도 맞힌다
  powerK: 2.5,         // 위력 = 선명도^K
  domainL: 5,          // 신호가 반으로 흐려지는 거리 (m)
  passive: 0.5,        // 시전 중이 아닐 때 장악권의 세기
  fizzle: 0.15,        // 장악 몫이 이보다 작으면 마법이 흩어진다
  domainR: 5,          // (v2.0 둘째) 도달 반경: 적의 신호는 제 자리에서 domainR × C m 안에서만 몫을 다툰다. 0이면 끝없음 (SPEC 5장)
  domainPath: true,    // (v2.0 둘째) 실(thread)은 길 전체를 지어야 한다: 길의 네 점 가운데 가장 낮은 g (SPEC 5장)
  full: 0.6,           // 장악 몫이 이보다 크면 온전한 힘
  taunt: false,        // 도발: 상대의 부름(예비동작)을 끊는 마법 '도발'을 쓸 수 있다. 끄면 책에서 빠진다 (SPEC 8장)
  wave: true,          // (v2.0 기본 켬) 파도: 머리가 넘치면 굳는 대신 파도를 탄다. 부류(type: 서퍼·메타·이단)마다 다르게 (SPEC 7장)
  risk: true,          // (v2.0 기본 켬) 하이 리스크 하이 리턴: 큰 마법(big)과 역류·빈손 (1.9.0, SPEC 7장). 끄면 큰 마법이 책에서 빠진다
  saltRing: true,      // (v2.0 기본 켬) 줄어드는 소금 원: 선 밖에선 마법이 흩어지고 몸이 마른다 (1.9.0, SPEC 2장)
  bodyBind: false,     // 몸 묶기: 발밑이 아니라 몸을 묶는 마법 다섯과 눈멂의 읽기 막기 (1.11.0, SPEC 9장). 끄면 그 마법이 책에서 빠진다
  response: false,     // 대응: 순간 반응(판단 사이의 구르기)·대비(피할 수 없는 것에 몸을 굳힘)·풀기(몸 묶기를 머리로 푼다) (1.13.0, SPEC 9장, rules/response)
  silver: false,       // 은실 옷: gear.silver를 입은 사람에게 붙잡는 효과 × 0.5, 전기 × 1.1 (1.13.0, SPEC 10장, rules/silver)
  bodyK: 2.3,          // (v2.0) 몸 받침: 받는 에너지 피해 ÷ max(C, 1)^bodyK. 0이면 끔 (SPEC 24장, rules/body)
  callus: 12,          // (v2.0 둘째) 굳은 살: 부딪히는 피해는 한 방마다 callus × log₂ C / log₂ 10 만큼 뺀다. 0이면 첫 묶음(부딪힘도 ÷ C^bodyK, 총은 그대로)
  endureK: 0.8,        // (v2.7, v2.8에 1.2 → 0.8) 버티기: 머리 회복(초당 4)과 당 회복(초당 1.2 g) × max(1, C / endureC)^endureK (평범·중간 × 1 · 상위 × 1.74 · 대마법사 × 3.0). 0이면 누구나 같다 (SPEC 31장, rules/endure)
  endureC: 2.5,        // (v2.7) 버티기가 시작하는 선명도 (중간까지는 그대로)
  gluRegen: 3,         // (v2.11, 1.2 → 3) 당 회복 (초당 g, 버티기가 상위·대마법사에게 곱한다). 숨(rules/breath)은 규칙 모듈의 스위치
  bluntK: 2.3,         // (v2.7) 마법의 부딪힘: 굳은 살을 뺀 뒤 ÷ max(C, 1)^bluntK (총·화약통·벽 밀기는 빼고). 0이면 굳은 살만(v2.6까지: 상위의 돌 비가 대마법사를 한 방에 죽였다) (SPEC 31장, rules/body)
  evade: true,         // (v2.0) 회피: 달리기·구르기 속도 × (1 + 0.25·log₂ C), 구르기 간격 ÷ (1 + 0.2·log₂ C) (SPEC 24장, rules/evade)
  army: true,          // (v2.0 둘째) 군대: 머스킷의 장전·화승·사거리 100 m, 박격포, 돌아가며 쏘기 (SPEC 25장, rules/army)
  morale: true,        // (v2.0 둘째) 사기: 셋 이상인 편은 사상자·큰 수의 충격에 도망친다 (SPEC 25장, rules/morale)
  bulwark: true,       // (v2.0 둘째) 벽: 세우는 데만 힘, 흙·석회는 무너질 때까지, 총알을 막음, 벽 밀기, 벽 뒤는 안 보임 (SPEC 25장, rules/bulwark)
  light: true,         // (v2.0 둘째) 빛: 번쩍임(눈멂)·열선(거울) (SPEC 25장, rules/light)
  flight: true,        // (v2.0) 비행: 출력 75 kW 이상(상위부터)이 난다. 높이 z, 속도 판단 (SPEC 24장, rules/flight)
  flightCut: false,    // (v2.3) 날기 끊기: 급정지·떨어지기·내리꽂기·튀어오르기·옆 튀기·공기 쿠션. 끊는 동안 비행에 묶인 서클·출력이 풀린다 (SPEC 27장, rules/flight)
  trapChain: false,    // (v2.3) 옆 함정 연쇄: 함정 하나가 터지면 같은 사람의 3.5 m 안 함정도 0.2 s 뒤 터진다 (SPEC 27장, rules/fort)
  hpScale: false,      // 켜면 체력 = 150 × max(C, hpFloor)^hpK (SPEC 3장. v2.0의 버팀은 몸 받침이 맡는다)
  hpK: 1.2,            // 체력의 선명도 지수 (1.x의 hpScale은 powerK = 2.5)
  hpFloor: 1,          // 선명도가 이보다 낮아도 이것으로 본다: 마법사가 아닌 몸(병사)은 150보다 약해지지 않는다 (1.x는 0)
  fineStep: false,     // (v2.14) 잘게 걷기: 한 걸음 1/60 s (W.dt). 대마법사 장면이 켠다: 빠른 판의 피하기·끊기가 걸음 크기에 덜 묶인다 (SPEC 38장)
  tune: false,         // (v2.19) 손잡이: 크기·화력·속도, 숨김 (SPEC 43장, rules/tune)
  gunfire: false,      // (v2.25) 총의 쏨: 머스킷은 풀 때까지 과녁을 따라 겨누고, 떡대·잔기술은 총알을 줄이지 않는다 (SPEC 48장, rules/gunfire)
  calm: false,         // (v2.25) 머리 아끼기: 낮은 단계(선명도 5 아래)는 파도를 타되 휩쓸리지 않는다 (SPEC 48장, rules/calm)
  squad: false,        // (v2.26) 전투단과 다수 대응: tac.squad 편의 지휘 겹(칠판·역할·조·번갈아·동시 체크·물러섬)과 선명도 5 이상의 다수 모드 (SPEC 49장, rules/squad)
  ringLedger: false,   // (v2.37) 고리 장부 3단계: 모든 일(짓기·붙잡음·날기·공기막·잔기술·자동 진·몸·합창·버팀 벽)이 고리 하나씩, 모자라면 값이 낮은 것을 내려놓고, 빈 고리만큼 동시에 짓는다 (SPEC 59장, rules/ringLedger)
  chorusCast: false,   // (v2.34) 합창 설계: 합창은 고리·출력을 모아 앞소리꾼이 혼자는 못 쥐는 큰 마법·큰 손잡이·합창만의 마법(고요한 원·번개 장막·석회 고리·구름 걸기·곳간 터뜨리기·합창 방패)을 짓는다. 짓다 깨지면 역류 (SPEC 56장, rules/chorusCast)
  chorus: false,       // (v2.27) 합창: 박자를 맞춘 무리(상위 6·중간 3까지, 서로 10 m 안, 1.5 s)는 선명도 × √N, 앞소리꾼의 위력 × √N^2.5 (SPEC 50장, rules/chorus)
  steady: false,       // (v2.27) 중간의 읽기: 선명도 2~5는 적의 예비동작을 풀기 0.25 s 전부터만 읽는다 (SPEC 51장, rules/steady)
  drain: false,        // (v2.28) 마름: 칸마다 곳간, 마법은 서는 자리 둘레에서 에너지를 꺼내고 모자라면 그만큼 약하다, 햇빛으로 다시 찬다 (SPEC 52장, rules/drain)
  resolve: false,      // (v2.30) 사기의 버팀: 지휘가 있는 무리·보루 곁은 오래 버티고, 멀쩡한 사람은 혼자 먼저 달아나지 않는다 (SPEC 53장, rules/morale)
  fireLane: false,     // (v2.30) 사선: 총은 사선(과녁 너머 사거리 끝까지, 흔들림의 띠)에 우리 편이 있으면 쏘지 않고 옆으로 비킨다 (SPEC 53장, rules/fireLane)
  saltWise: false,     // (v2.30) 소금을 아는 대마법사: 소금 땅에 서지 않고, 흩어질 수·반사 방패를 쓰지 않고, 소금 위 과녁엔 직사·곡사 (SPEC 53장, rules/saltWise)
  selfSafe: false,     // (v2.30) 스스로 다치지 않기: 누구나 머리가 넘칠 수를 고르지 않고 고르지 않은 파도에서 내려오며, 겨눠진 동안 큰 수를 모으지 않고 닿을 위협엔 끊는다 (SPEC 53장, rules/selfSafe)
  crowdFire: false,    // (v2.30) 갈라 쏘기: 전투단의 투사체는 사람마다 가운데·왼쪽·오른쪽 피할 자리를 나눠 겨눈다 (SPEC 53장, rules/crowdFire)
  unstuck: false,      // (v2.30) 막힘 풀기: 땅에 붙은 날기는 내려앉고, 걸으려는데 제자리면 옆으로 돌아간다 (SPEC 53장, rules/unstuck)
  edgeCancel: false,   // (v2.30.1) 장악권 경계: 나보다 1.5배 넘게 선명한 과녁 앞에선 서는 자리가 장악권에 흩어질 수를 짓지 않고, 짓다가 흩어지게 되면 끊고 물러난다 (SPEC 53장, rules/edgeCancel)
  artillery: false,    // (v2.31) 포병과 소금 탄: 청동포(산탄·둥근 탄·소금 탄)는 포수가 곁에 있어야 쏘고, 소금 안개 안에선 마법이 서지 않고 장악권이 꺼진다 (SPEC 54장, rules/artillery)
  chipGuard: false,    // (v2.24, 시험) 작은 수 막기: 응수가 있는 동안 떡대가 적의 한 방마다 일정량을 뺀다 (SPEC 47장, rules/chipGuard)
  rings: false,        // (v2.22) 고리 장부: 사람마다 서클의 쓰임을 읽어낸다(m.mlog.rings). 판에 닿지 않는다 (SPEC 46장, rules/rings)
  stunRes: false,      // (v2.21) 굳힘 내성과 몸 털기: 다시 굳으면 짧게(× 0.5 → × 0.25), 굳음을 터는 몸 털기 (SPEC 45장, rules/stunRes)
  passives: false,     // (v2.18) 잔기술: 절연 막·굳은 살·열 차단, 순간 켜기 (SPEC 42장, rules/passive)
  pace: false,         // (v2.14) 빠른 판: 대마법사의 떡대·막기(순간 켜기)·빠른 시전과 늘 움직이기 (SPEC 38장, rules/pace)
};
// 규칙 모듈이 스위치의 기본값을 따로 적었으면 (등록한 규칙). 기본 규칙의 스위치는 위 표에 있다
for (const r of R.RULES) if (r.switch && !(r.switch in DEFAULT_RULES)) DEFAULT_RULES[r.switch] = r.default ?? false;
// 파도의 부류 (WORLD 3-3). 사람 규격의 type. 파도가 꺼져 있으면 셋 다 같다
const TYPES = ['서퍼', '메타', '이단'];
const BUFK = new Set(['speed', 'elecRes', 'bluntRes', 'toxRes', 'front', 'block', 'smoke']);   // 알려진 몸 효과 (stepMage가 이름으로 줄인다)
const BODY = { hp: 150, glu: 110, gluRegen: 1.2, stam: 6, stamRegen: 0.8, speed: 5, radius: 0.3 };
// 마법이 만들어지는 자리
// 규칙 모듈이 더하는 틀(cage·taunt…)은 그 모듈의 form에 있다 (formsOf가 붙인다)
const FORM = { proj: 'self', lob: 'self', wall: 'self', ring: 'self', shoot: 'self', smother: 'self', area: 'target', zone: 'target', trap: 'target', thread: 'path', cone: 'front', buff: 'body', move: 'body', touch: 'body' };
const THREAT = { thread: 1, area: 1, touch: 1, cone: 1, proj: 1 };

/* ---------------- 규칙 모듈과 훅 (SPEC 22장) ---------------- */
// 훅 모음: 이름마다 배열 하나. 리터럴로 만들어 모양이 늘 같다(속도). 이름은 rules/index.js의 ENGINE_HOOKS
function emptyH() { return { place: [], init: [], world: [], wall: [], wallHit: [], lobLand: [], ceff: [], power: [], gate: [], share: [], release: [], overload: [], roll: [], hurtMod: [], hurt: [], effHold: [], eff: [], rain: [], smother: [], ring: [], fatRecover: [], mageStep: [], mageZones: [], move: [], speed: [], speedLate: [], accel: [], chan: [], projSub: [], ignite: [], areaHit: [], zoneTick: [], notice: [], trapCap: [], trapFire: [], preMove: [], castMove: [], walk: [], gluRegen: [], castHold: [], track: [], flyAccel: [], tune: [], stunHold: [], stepEnd: [], book: [] };
  }
// 규칙 모듈이 엔진에서 쓰는 것 (X). 규칙 파일은 이것만 받아 쓴다
let X = null;
const ENG = new Map(), TFX = {}; let tfxVer = -1;
// 규칙의 엔진 훅은 모듈마다 한 번 만든다
function engineOf(r) { if (!r.engine) return null; let e = ENG.get(r); if (!e) { e = r.engine(X);
    for (const k in e) if (!(k in emptyH())) throw new Error(r.name + ': 없는 엔진 훅 ' + k + ' (' + R.ENGINE_HOOKS.join(', ') + ')'); ENG.set(r, e); } return e; }
// 틀 표(방출)와 자리 표: 규칙 목록이 바뀌었을 때만 다시 만든다
function formsOf() {
  if (tfxVer === R.ver()) return; tfxVer = R.ver();
  for (const k in TFX) TFX[k] = null;
  for (const r of R.RULES) { if (r.form) Object.assign(FORM, r.form); if (r.threat) Object.assign(THREAT, r.threat); if (r.types) Object.assign(TFX, r.types(X)); }
}
// 세계를 만들 때: 켜진 규칙만 골라 그 훅을 차례대로 모은다. 꺼진 규칙은 걸음마다 비용 0
function hooksFor(W, opt) {
  formsOf();
  const H = emptyH(), mods = [];
  for (const r of R.RULES) {
    if (!R.onOf(r)(W, opt)) continue; mods.push(r);
    const e = engineOf(r); if (e) for (const k in e) H[k].push(e[k]);
  }
  W.H = H; W.mods = mods;
}
const TA = { aim: 0, foes: null, g: 0 };   // 틀 방출에 넘기는 값 (새로 만들지 않는다)

/* ---------------- 세계 ---------------- */
// 마법 모양 맞추기 (속도, 1.11.1): 사람의 책에 든 마법을 세계마다 같은 필드·같은 차례의 새 객체로 옮긴다(없는 필드는 undefined, 읽는 값은 그대로).
// 원본은 82개가 51가지 모양이라 's.t' 같은 읽기가 느린 길로 갔다. 객체 리터럴로 만들어야 빠른 모양이 된다(하나씩 넣으면 사전 모양이 된다).
// 목록에 없는 필드(등록한 마법)는 뒤에 붙인다. 속 객체(hit·z·b…)는 원본을 가리킨다. 원본은 고치지 않는다
const SPELL_KEYS = new Set(["n", "el", "t", "m", "v", "R", "cost", "cast", "cd", "hit", "role", "L", "dur", "dps", "kind", "burn", "burst", "mv", "dist", "self", "z", "tr", "vis", "E", "r", "delay", "dmg", "stun", "b", "react", "flight", "hp", "at", "wet", "push", "lock", "banned", "blind", "life", "home", "tags", "desc", "kill", "multi", "fast", "root", "rad", "chill", "mundane", "rule", "big", "cramp", "pr", "needGear", "aimN", "aimD", "fuse", "reload", "wallDmg", "tw", "pierce", "ring", "chorusOnly", "sky"]);
function shapeOne(s) { const o = { n: s.n, el: s.el, t: s.t, m: s.m, v: s.v, R: s.R, cost: s.cost, cast: s.cast, cd: s.cd, hit: s.hit, role: s.role, L: s.L, dur: s.dur, dps: s.dps, kind: s.kind, burn: s.burn, burst: s.burst, mv: s.mv, dist: s.dist, self: s.self, z: s.z, tr: s.tr, vis: s.vis, E: s.E, r: s.r, delay: s.delay, dmg: s.dmg, stun: s.stun, b: s.b, react: s.react, flight: s.flight, hp: s.hp, at: s.at, wet: s.wet, push: s.push, lock: s.lock, banned: s.banned, blind: s.blind, life: s.life, home: s.home, tags: s.tags, desc: s.desc, kill: s.kill, multi: s.multi, fast: s.fast, root: s.root, rad: s.rad, chill: s.chill, mundane: s.mundane, rule: s.rule, big: s.big, cramp: s.cramp, pr: s.pr, needGear: s.needGear, aimN: s.aimN, aimD: s.aimD, fuse: s.fuse, reload: s.reload, wallDmg: s.wallDmg, tw: s.tw, pierce: s.pierce, ring: s.ring, chorusOnly: s.chorusOnly, sky: s.sky };
  for (const k in s) if (!SPELL_KEYS.has(k)) o[k] = s[k]; return o; }
const SHAPED = new WeakSet();   // 이 세계에서 모양을 맞춘 사본 (원본 마법은 여기 없다)
function shapeBook(W, book) { for (const n of book) { const s = W.spells[n]; if (s && !SHAPED.has(s)) { const o = shapeOne(s); SHAPED.add(o); W.spells[n] = o; } } }
// 규칙: 기본값 위에 묶음(rules.profile, data/profiles.json: base부터 차례로)을, 그 위에 주어진 스위치를 (v2.23.1)
function rulesOf(r) {
  const o = Object.assign({}, DEFAULT_RULES); if (!r) return o;
  if (r.profile) { const chain = []; for (let n = r.profile; n; ) { const p = PROFILES[n]; if (!p) throw new Error('없는 규칙 묶음: ' + n); chain.unshift(p.rules); n = p.base;
      } for (const x of chain) Object.assign(o, x); }
  return Object.assign(o, r);
}
function createWorld(opt = {}) {
  const W = {
    v: VERSION, t: 0, step: 0, width: opt.width || 40, height: opt.height || 30,
    rng: mulberry32((opt.seed >>> 0) || 1), rules: rulesOf(opt.rules),
    spells: Object.assign({}, opt.spells || SPELLS), brain: opt.brain || null,   // 책에 든 마법은 addMage가 모양을 맞춘다
    obs: [], walls: [], proj: [], lobs: [], areas: [], zones: [], traps: [], barrels: [], ms: [], fx: [],
    foes: [[], []], _nF: null, _alive: null, _cloak: false, rec: opt.record ? [] : null, sides: 2, maxT: opt.maxT || 120, timeWin: opt.timeWin != null ? opt.timeWin : -1, closed: !!opt.closed,
    H: null, mods: null, _bh: null, _fly: false, _recN: opt.recEvery >= 1 ? Math.floor(opt.recEvery) : 2, dt: DT0, sk: 1, _grp: 0, _sideN: null, _wv: 0, _wgN: -1, _wg: null, _wq: [], _en: null,   // 벽 격자 (벽이 많을 때, 속도): 벽 목록의 판번호·격자를 만든 판번호·격자·찾은 목록
    salt: Array.isArray(opt.salt) ? opt.salt.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h })) : [],   // salt: 소금 땅 사각형 (rules/saltLand)   // _grp: 벽 무리의 다음 번호 (rules/bulwark)
      // 켜진 규칙의 엔진 훅, 켜진 규칙 모듈, 두뇌 훅(두뇌가 채운다), 비행이 켜졌나(녹화에 높이를 적는다)
  };
  if (W.rules.fineStep) { W.dt = DT0 / 2; W.sk = 2; if (!(opt.recEvery >= 1)) W._recN = 4; }   // 잘게 걷기: 걸음은 1/60 s, 기본 녹화는 같은 시간 간격 (v2.14, SPEC 38장)
  hooksFor(W, opt);
  W.rnd = (a, b) => a + W.rng() * (b - a);
  // 바위·화약통·벽은 목록으로 직접 줄 수 있다(장면). 안 주면 씨앗을 따라 놓는다
  if (Array.isArray(opt.obstacles)) W.obs = opt.obstacles.map(o => ({ x: o.x, y: o.y, r: o.r || 1.2 }));
  const nObs = Array.isArray(opt.obstacles) ? 0 : opt.obstacles ?? 12, keep = opt.clear || [];
  for (let t = 0; W.obs.length < nObs && t < 400; t++) {
    const o = { x: W.rnd(5, W.width - 5), y: W.rnd(3, W.height - 3), r: W.rnd(0.7, 1.8) };
    if (keep.some(k => hyp(o.x - k[0], o.y - k[1]) < (k[2] || 4))) continue;
    if (W.obs.some(q => hyp(q.x - o.x, q.y - o.y) < q.r + o.r + 1.2)) continue;
    W.obs.push(o);
  }
  for (const h of W.H.place) h(W, opt);   // 규칙이 놓는 것 (화약통)
  if (Array.isArray(opt.walls)) for (const w of opt.walls) addWall(W, { x: w.x, y: w.y, r: w.r || 0.6, hp: w.hp || 200, t: 1e9, own: -1, mat: w.mat || 'lime', thick: w.thick ?? (w.r || 0.6) * 2, grp: w.grp ?? -1 });
  for (const h of W.H.init) h(W);
  return W;
}

// 체력 배수 (SPEC 3장): hpScale이면 max(C, hpFloor)^hpK
const hpMul = (W, spec) => W.rules.hpScale ? pow(Math.max(spec.C ?? 1, W.rules.hpFloor), W.rules.hpK) : 1;
function addMage(W, spec, side, x, y) {
  let bk = spec.book || []; const hb = W.H.book; if (hb.length) { bk = bk.slice(); for (let i = 0; i < hb.length; i++) hb[i](W, spec, bk); }   // 책에 더하기 (rules/chorusCast: 합창의 책, v2.34)
  const book = bk.filter(n => W.spells[n] && (!W.spells[n].banned || spec.allowBanned) && (!W.spells[n].rule || W.rules[W.spells[n].rule]) && (!W.spells[n].needGear || (spec.gear && spec.gear[W.spells[n].needGear])));   // 규칙에 딸린 마법은 그 규칙이 켜졌을 때만, 장비가 드는 마법(열선: 거울)은 그 장비가 있을 때만
  shapeBook(W, book);
  const m = {
    id: W.ms.length, name: spec.name || 'm' + W.ms.length, side, x, y, vx: 0, vy: 0, r: BODY.radius,
    hpMax: (spec.hp || BODY.hp) * hpMul(W, spec), hp: (spec.hp || BODY.hp) * hpMul(W, spec), glu: spec.glu || BODY.glu, gluMax: spec.glu || BODY.glu, stam: BODY.stam,
    C: spec.C ?? 1, circles: spec.circles ?? 1, noise: spec.noise ?? 0.05, react: spec.react ?? 0.2, dec: spec.dec ?? 0.15,
    brain: spec.brain || null, skill: spec.skill || null, autoDodge: !!spec.autoDodge, type: spec.type || '메타', wave: 0, waveT: 0, crash: 0, gear: Object.assign({}, spec.gear), book, mast: spec.mast || {}, _deck: null, _cand: null, _pool: null, hitEst: Object.assign({}, spec.hitEst),
    tac: Object.assign({ prefR: 7, aggr: 1, trapBias: 0.1, zoneBias: 0.05, dodge: 0.6, focusLow: false, crowd: true, stance: true, rest: 75,
      // 판단 스위치 (1.5.0, SPEC 13장). 기본값이 1.4.0까지의 두뇌. 판단 수준(skill)이 덮는다
      readCast: true, lead: 1, combo: true, lever: true, pathTrap: true, slotB: true, terrain: false, readWave: false, cdRead: false, outrange: false, feint: false, learn: false, waveChoose: false, counter: false, rollCap: 9, rollBias: null,
      // 기술 사다리 (1.7.0, SPEC 13장): 시전 중 걷기 비율, 쏜 뒤 멈춤(범위, 사람마다 한 번), 쏘는 중에 다음 수 정하기, 두 수 콤보 계획
      castMove: 0.5, pause: null, plan: false, combo2: false, slotBMin: 1, slotBOff: true, valMin: 0.15, fatPen: 0.5, learnAim: 'narrow', readLob: true,   // (v2.0) 두 번째 칸: 쓸 수의 값 문턱(plan이 있는 사람)·공격을 겹치는가, 학습한 구르는 쪽 겨냥('narrow' 투사체·실 / 'wide' 넓은 마법만 반쯤), 떨어지는 돌 읽기
      // (1.7.0 상급) 방패는 아무 때나(초보), 큰 공격을 위해 방패 아끼기, 상대가 피하면 캔슬, 엄폐, 박자 흔들기
      shieldAny: false, shieldSave: false, cancel: false, cover: false, tempo: false, coverW: 1.5,
      // (1.7.0 대가·전설) 몰이, 엄폐 걷어내기, 유도, 동시 착탄, 기회 캔슬 / 방어 미끼, 약한 척 물러서기, 세 마법 겹치기
      herd: false, strip: false, lure: false, simul: false, cancel2: false, bait: false, fakeRetreat: false, triple: false,
      bigPlan: false, dodgeAim: false, grab: false, passive: 0, tune: 0, hazard: 0,
      swarm: true, siege: true, wallSite: false, wallBreak: false, retreat: false,
      rhythm: false, rhythmTime: false, domainPush: false, efficacy: false, buffNeed: false, shape: false, roles: false,
      flyCut: 0, fortify: 0, breach: false,
      reflex: 0, chop: false, footwork: 0, blueprint: 0, ops: 0,
      aim: false, wallLos: 0, swarmR: 0, breathAt: 0.05, breathSafe: false, breathPre: 0, mode: 0, engage: 0, trapLine: false, pace: 0, read: 0 }, spec.tac),   // (v2.10) 명중 가망(전설, techniques/sharp), 시야 공격 몫이 이만큼일 때만 벽(대가부터), 협공: 선명도 몇 배부터 무리 싸움인가(상위 1.8, 0이면 3, techniques/swarm)   // (v2.5) 작전 겹(1 대가 · 2 전설: 강요하는 수·작전 읽기, rules/tactics, 29장)   // (v2.4) 반사 겹의 반응 지연(대가 0.1 · 전설 0.05 s, rules/reflex), 끊어 걷기·발놀림(1 옆 뒤집기 · 2 거리 톱질 · 3 높이 튕기기, rules/snap), 청사진(1 상급 · 2 대가부터 상황에 맞게, rules/blueprint) (28장)   // (v2.3) 날기 끊기(1 상급 · 2 대가 · 3 전설, rules/flight), 진지 짓기(1 상급 · 2 대가 몰이길 · 3 전설 미끼)·부수기(대가, rules/fort) (27장)   // (v2.2) 리듬(상급 'mimic', 대가부터 true)·때 재기·장악권 밀기, 효과 학습, 강화의 때(상급), 지형 설계·칸의 역할 (26장)   // (v2.0 둘째) 무리·성 (강한 적 하나, 또는 총·무리를 상대할 때만), 벽 자리(상급)·벽 없애기(대가)·물러나기(상급)   // (1.10.0 risk) 피할 자리 겨냥(상급부터), 붙잡기(대가부터)   // (1.9.0 대가·전설) 큰 수를 짝 묶기에 맞춰 꽂는다
    st: { stun: 0, root: 0, wet: 0, burn: 0, chill: 0, blind: 0, cough: 0, mycel: 0, cramp: 0, lime: 0, fetter: 0, breath: 0, guard: 0, psv: 0, psvT: 0, stR: 0, stE: -9 }, _bufx: [], _sigX: NaN, _sigN: false, _szC: NaN, _sz: 1, _pwC: NaN, _pwK: NaN, _pw: 1, buf: { speed: null, elecRes: null, bluntRes: null, toxRes: null, front: null, block: null, smoke: null }, cd: {}, cast: null, castB: null, chan: null, roll: 0, rollCd: 0, autoCd: 0, fat: 0, aim: 0, thinkT: W.rng() * 0.1,
    mv: { x: 0, y: 0 }, mem: {}, waveWant: false, relT: null, lastRel: -9, comboPend: null, combo: null, last: null, lastT: -9, sf: 1, stance: 'normal', vault: 0, _sig: 1, _act: false, deathT: null,
    // 판 중에 채우는 칸. 처음부터 두어 객체 모양이 바뀌지 않게 한다(속도, 1.11.1). 값은 비어 있을 때와 같게 읽힌다 (null ?? −9, 0 || 0)
    bigp: null, simul: null, herd: null, hold: 0, lureT: null, baitT: null, baitDone: 0, emptyT: -9, lastHit: null, h2sT: 0, thinkAt: null, losWas: false, pauseLen: 0, rollSide: 0, rollPref: 0, _ref: null,
    reflexT: -9, braceT: -9, unbindCd: -9, unbindReq: 0, braceReq: 0,   // 대응 (rules/response, 1.13.0)
    _bkC: NaN, _bk: 1, _clC: NaN, _cl: 0, _evC: NaN, _evS: 1, _evR: 1,   // 몸 받침·회피의 배수 (선명도마다 한 번, rules/body·evade)
    // 높이 (v2.0, SPEC 24장): 땅 0. 비행(rules/flight)만 바꾼다. fly: 0 걷기·1 날기·2 떨어지기. fv·fz·flyWant는 두뇌가 정하는 목표 속도·높이·뜨기
    z: spec.z > 0 ? spec.z : 0, vz: 0, fly: spec.z >= 1 ? 1 : 0, flyWant: spec.z >= 1,   // 장면은 떠서 시작할 수 있다 (z)
    fv: 0, fz: 0, fallZ: 0, load: 0, airFilm: false, _nm: 1, _flC: NaN, _flP: 0, _grazeN: null, _grazeT: -9, _feC: null, _flT0: 0, _gun: undefined, _ltT: -9, flee: 0, shock: 0, retreat: 0,
    // 리듬 (v2.2, brain/techniques/rhythm): 단계(떠보기·들어가기·빠지기, v2.3: 짓기·진지)와 속 값(단계 시각·물러남 끝·2 s 전 체력과 그 시각, 몰이 자리를 고른 시각)
    phase: 'probe', ph: { t: 0, until: -9, hp: 0, hpT: -9, shT: -9 },
    // 날기 끊기 (v2.3, rules/flight): 두뇌가 청한 끊기(w), 하는 중인 끊기(k: 1 급정지·2 옆 튀기·3 튀어오르기·4 떨어지기·5 내리꽂기)와 남은 시간·간격, 옆 방향, 공기 쿠션을 뿜을 높이(−1 없음)·뿜는 중, 떨어지기 시작 높이, 내려앉으며 친 수와 시각
    cut: { w: 0, k: 0, t: 0, cd: 0, x: 0, y: 0, z: -1, on: false, z0: 0, n: null, nT: -9, cool: false },   // cool: 머리를 식히러 내려앉은 중 (v2.6, 스스로 죽지 않기)
    // 반사 겹 (v2.4, rules/reflex·snap): 지금 위협(투사체·구름·예비동작)과 본 시각·쏜 시각, 덮는 걸음(끝 시각·방향·목표 속도), 빗나가길 기다리는 적의 수, 흔들기·내려앉기-구르기, 생각 겹의 발놀림 때
    //   기록: 방향 전환, 반응 시간 합·수·못 한 수, 흔들기(멈칫·뒤집기)·피하기, 흔든 뒤·안 흔든 뒤 나를 겨눈 수와 빗나간 수, 내려앉기-구르기, 톱질·튕기기·옆 뒤집기
    rx: { th: null, thq: null, kind: 0, t0: 0, done: false, met: false, vx0: 0, vy0: 0, pr: 0, pk: 0, until: -9, vx: 0, vy: 0, fv: -1, pend: null, jukeT: -9, lrt: 0, lx: 0, ly: 0, sfT: 0, bT: 0, bUp: false, tvx: 0, tvy: 0,
      turns: 0, rS: 0, rN: 0, rMiss: 0, juke: 0, stop: 0, flip: 0, dodge: 0, shotJ: 0, missJ: 0, shotN: 0, missN: 0, lrtN: 0, saw: 0, bounce: 0, flips: 0 },
    // 작전 겹 (v2.5, rules/tactics): 지금 작전·시작 시각·다음 고를 시각, 고른 자리와 그 성질, 상대의 다가오는 속도 평균·짐작한 작전, 마지막 강요한 시각, 뒤를 볼 수, 이번 작전의 시작 값
    //   기록: 작전마다 고른 수·완수·시간, 강요한 수와 그 뒤 상대가 길을 바꾼 수, 대조(다른 공격), 고른 자리의 성질(한쪽 사거리·엿보기·벗기기·퇴로)과 고른 횟수.  맨 위 칸은 이로써 127개(가득): 새 칸은 하위 객체에
    op: { cur: null, t0: -9, next: 0, tx: NaN, ty: NaN, kind: 0, dir: 1, eVt: 0, eOp: null, fT: -9, pend: null, st: null,
      log: { n: {}, ok: {}, time: {}, dealt: {}, took: {}, forced: 0, forceN: 0, ctrlN: 0, ctrlMoved: 0, pick: 0, ticks: 0, oneSide: 0, peek: 0, strip: 0, cut: 0 } },
    // 사람의 맨 위 칸은 127개까지다: 넘으면 V8이 리터럴을 느린 길로 만들어 판이 두 배 느려진다 (v2.3에서 쟀다). 새 칸은 하위 객체에 (SPEC 17장)
      // 사기 (rules/morale): 도망 중, 충격
    // 비행의 기록 (v2.0, 행동 지표): 난 시간, 속도 합·제곱 합, 코너 속도 근처 시간, 속도 속임, 높이 변화 합, 추락, 스쳐 치기 시도·적중
    flog: { t: 0, v: 0, v2: 0, corner: 0, feint: 0, dz: 0, falls: 0, grazeTry: 0, grazeHit: 0,
      cut: 0, brake: 0, side: 0, hop: 0, drop: 0, dive: 0, cush: 0, crash: 0, dropTry: 0, dropHit: 0, hfeint: 0 },   // 날기 끊기 (v2.3): 끊은 수와 갈래별, 공기 쿠션, 쿠션 실패(추락), 내려앉으며 친 시도·명중, 높이 속이기
    // 진지 (v2.3, 27장, rules/fort): 자리·바라보는 쪽, 짓는 계획(칸 목록), 세운 시각, 몰이길에 든 것을 센 시각 / 기록: 지은 벽(세우기·기둥 시전)·함정·하늘 덮개, 덮개가 굳힌 수, 연쇄로 터진 함정, 치운 함정·덮개, 몰이길로 든 적, 진지 안·밖에서 적에게 받은 피해, 세운 진지
    fort: { x: NaN, y: NaN, ux: 0, uy: 0, plan: null, t: -9, gT: -9, walls: 0, traps: 0, sky: 0, skyZap: 0, chain: 0, clear: 0, funnel: 0, inDmg: 0, outDmg: 0, founded: 0,
      bpN: 0, bpItems: 0, bpT: 0, bpName: {}, bpPick: null, bpLast: -9 },   // 청사진 (v2.4, rules/blueprint): 다 지은 청사진 수·구조물 수·걸린 시간 합, 이름별 수, 고른 것, 마지막 시각
    // 군대와 벽의 기록 (v2.0 둘째, 25장): 번쩍임·맞힌 수·눈먼 수, 무거운 돌 시도·명중, 세운 벽 수·벽 뒤 시간, 도망(시각)
    // 고수 싸움의 기록 (v2.2, 26장 지표): 칸마다 역할별 시전(A·B·자동), 리듬 단계별 시간, 세운·없앤 지형
    mlog: { role: { A: {}, B: {}, auto: {} }, phase: {}, built: 0, razed: 0, losCut: 0, held: 0, prep: 0, prepCut: 0, mode: { t: {}, n: {}, bigN: 0, bigSure: 0, covS: 0, covN: 0, bait: 0 }, breath: 0, breathHit: 0, brHitF: false, breathAtk: 0, breathAtkHit: 0, brT: -9, brA: 0, brH: 0, brV: 0, guardN: 0, guardT: 0, guardBlk: 0, gdT: -9, pcT: 0, pcIn: false, pcS: 1, pcR0: 0, pcR1: 0, pcN: '', trackN: 0, gdOff: -9, gdOn: -9, gdOk: 0, gdOkC: -9, tune: null, chk: 0, mate: 0, brk: 0, plN: 0, plNodes: 0, jsS: 0, jsF: 0, jsA: 0, dS: 0, dS2: 0, dN: 0, gS: 0, bMove: 0, bx: NaN, by: NaN, bT: 0, rings: null, chip: 0, gunShield: 0 },   // 거리 합·제곱 합·수, 경계 틈 합, 경계가 움직인 거리, 지난 경계 자리·시각 (판단 때마다, brain/index)
    alog: { flash: 0, flashHit: 0, blinded: 0, heavyTry: 0, heavyHit: 0, walls: 0, wallT: 0, fled: 0, fledT: null },
    log: { dealt: {}, casts: {}, hits: {}, taken: {}, fizz: 0, over: 0, barrel: 0, stanceT: {}, waves: 0, lost: 0, waveDmg: 0, waveDeath: 0, taunted: 0,
      // 행동 지표 (1.7.0): 시전 시작 시각, 빈틈(쏜 뒤 다음 시작까지) 합·수, 콤보 시도·성공
      starts: [], gaps: [], gapSum: 0, gapN: 0, comboTry: 0, comboHit: 0, bigCast: 0, bigHit: 0, bigPair: 0, bigPin: 0, pinTry: 0, backfire: 0, grab: 0, cTry: {}, cHit: {}, cancel: 0, coverT: 0, defTry: 0, defHit: 0, lure: 0, simul: 0,
      dec: { n: 0, cat: {}, form: {}, react: 0, def: 0, combo: 0, atk: 0, trapPath: 0, trap: 0, barrel: 0, slotB: 0, auto: 0, rest: 0 } },
  };
  // 구르는 쪽 버릇 (1.6.0): 좋아하는 쪽(왼 +1·오른 −1)과 그쪽으로 구를 확률을 사람 만들 때 한 번 정한다
  if (m.tac.pause) m.pauseLen = m.tac.pause[0] + W.rng() * (m.tac.pause[1] - m.tac.pause[0]);   // 초보: 늘 같은 박자
  if (m.tac.rollBias) { m.rollSide = W.rng() < 0.5 ? 1 : -1; m.rollPref = m.tac.rollBias[0] + W.rng() * (m.tac.rollBias[1] - m.tac.rollBias[0]); }
  W.ms.push(m);
  if (side + 1 > W.sides) { W.sides = side + 1; while (W.foes.length < W.sides) W.foes.push([]); }
  return m;
}

/* ---------------- 신호: 선명도, 위력, 장악권 ---------------- */
// 파도를 타는 동안 피로는 100을 넘을 수 있지만, 선명도·위력·시전 시간은 100에서 더 나빠지지 않는다 (파도가 없으면 피로는 100을 넘지 않는다)
function ceff(W, m) { let x = m.C * (W.rules.fatigue ? Math.max(0.45, 1 - Math.min(m.fat, 100) / 150) : 1); const h = W.H.ceff; for (let i = 0; i < h.length; i++) x = h[i](W, m, x); return x; }
function power(W, m, s) {
  if (s.mundane) return 1;
  if (m._pwC !== m.C || m._pwK !== W.rules.powerK) { m._pwC = m.C; m._pwK = W.rules.powerK; m._pw = pow(m.C, W.rules.powerK); }
  let x = m._pw * (1 + 0.3 * (m.mast[s.n] || 0)) * (W.rules.fatigue ? Math.max(0.6, 1 - Math.min(m.fat, 100) / 200) : 1);
  const h = W.H.power; for (let i = 0; i < h.length; i++) x = h[i](W, m, s, x);   // 파도의 부류 (rules/wave)
  return x;
}
const rangeOf = (m, s) => (s.R || 0) * (s.mundane ? 1 : Math.sqrt(m.C));
// C^0.4는 사람마다 한 번 (결정론 pow가 비싸다, 속도 1.11.1). C가 바뀌면 다시 잰다
const sizeOf = (m, s) => (s.mundane ? 1 : m._szC === m.C ? m._sz : (m._szC = m.C, m._sz = pow(m.C, 0.4)));
// 신호 세기 = 선명도^K (걸음 첫머리 refreshSides의 선명도로). 읽을 때만 잰다
function sigOf(W, m) { if (m._sigN) { m._sigN = false; m._sig = pow(m._sigX, W.rules.powerK); } return m._sig; }
// 장악 몫 f: (x,y)의 공기가 m의 신호를 따를 몫. 0~1
function share(W, m, x, y) {
  if (!W.rules.domain) return 1;
  const L = W.rules.domainL, foes = W.foes[m.side], Rr = W.rules.domainR;
  const mine = sigOf(W, m) / (1 + hyp(x - m.x, y - m.y) / L);
  let other = 0;
  for (let i = 0; i < foes.length; i++) { const q = foes[i], dq = hyp(x - q.x, y - q.y); if (Rr > 0 && dq > Rr * q.C) continue; other += sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + dq / L); }   // 도달 반경 밖의 적은 다투지 않는다 (v2.0 둘째)
  let f = mine / (mine + other);
  const h = W.H.share; for (let i = 0; i < h.length; i++) f = h[i](W, m, x, y, f);   // 소금 망토 (rules/gear)
  return f;
}
const gOf = (W, f) => clamp((f - W.rules.fizzle) / (W.rules.full - W.rules.fizzle), 0, 1);
function formPoint(m, s, tx, ty) {
  const k = FORM[s.t];
  if (k === 'target' || k === 'path') return [tx, ty];
  if (k === 'front') { const d = hyp(tx - m.x, ty - m.y) || 1, L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') { const d = hyp(tx - m.x, ty - m.y) || 1; return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5]; }
  return null;
}
// 이 자리에 마법이 서는 정도 g. 규칙의 문(gate)이 막으면 0 (소금 원, rules/saltRing)
function gAt(W, m, s, tx, ty) {
  const h = W.H.gate; for (let i = 0; i < h.length; i++) if (h[i](W, m, s, tx, ty)) return 0;
  if (s.mundane || !W.rules.domain) return 1;
  if (FORM[s.t] === 'path' && W.rules.domainPath) {   // 길 전체를 지어야 한다: 사거리로 자른 길의 ¼·½·¾·끝 가운데 가장 낮은 몫 (v2.0 둘째, SPEC 5장)
    const dx = tx - m.x, dy = ty - m.y, d = hyp(dx, dy) || 1, R = rangeOf(m, s), k = d > R ? R / d : 1; let f = 1;
    for (let i = 1; i <= 4; i++) { const q = share(W, m, m.x + dx * k * i / 4, m.y + dy * k * i / 4); if (q < f) f = q; }
    return gOf(W, f);
  }
  const p = formPoint(m, s, tx, ty); return p ? gOf(W, share(W, m, p[0], p[1])) : 1;
}

/* ---------------- 공간 ---------------- */
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, t = clamp(((cx - x1) * dx + (cy - y1) * dy) / L2, 0, 1);
  return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
// 선분의 테두리 상자(+ 반지름) 밖에 있는 원은 재지 않는다: 가장 가까운 점은 상자 안이라 결과가 같다 (속도, 1.11.1)
function segBox(x1, y1, x2, y2, cx, cy, r) { const e = r + 1e-9; return cx < (x1 < x2 ? x1 : x2) - e || cx > (x1 > x2 ? x1 : x2) + e || cy < (y1 < y2 ? y1 : y2) - e || cy > (y1 > y2 ? y1 : y2) + e; }
function blocked(W, x1, y1, x2, y2, z) {
  if (!(z > 2)) {   // 시선 끝 하나라도 2 m 넘게 떠 있으면 바위·벽이 가리지 않는다 (v2.0)
  for (const o of W.obs) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  const ws = W.walls;
  if (ws.length <= WMIN) { for (const o of ws) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true; }
  else { const q = wallsIn(W, (x1 < x2 ? x1 : x2) - WRMAX, (y1 < y2 ? y1 : y2) - WRMAX, (x1 > x2 ? x1 : x2) + WRMAX, (y1 > y2 ? y1 : y2) + WRMAX);
    for (let i = 0; i < q.length; i++) { const o = ws[q[i]]; if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true; } }
  }
  for (const z of W.zones) if (z.k === 'smoke' && z.shape === 'circle' && segCircle(x1, y1, x2, y2, z.x, z.y, z.r)) return true;
  return false;
}
function inZone(z, x, y) { if (z.shape === 'circle') return hyp(x - z.x, y - z.y) < z.r; const dx = cos(z.a), dy = sin(z.a), rx = x - z.x, ry = y - z.y;
  return Math.abs(rx * dx + ry * dy) < z.len / 2 && Math.abs(-rx * dy + ry * dx) < 0.6; }
// 벽 세우기: 모든 벽이 이것으로 선다. 모양이 늘 같은 리터럴로 옮기고(속도) 규칙이 고친다(재료의 수명, rules/bulwark)
function addWall(W, w) {
  const o = { x: w.x, y: w.y, r: w.r, hp: w.hp, hp0: w.hp, t: w.t, own: w.own, by: w.by || null, used: 0, cage: w.cage || 0, mat: w.mat || 'lime', thick: w.thick || w.r * 2, grp: w.grp ?? -1, mk: w.mk ?? -1 };   // mk: 세운 사람의 번호(흙벽·보루, 진지의 두뇌가 본다)
  const h = W.H.wall; for (let i = 0; i < h.length; i++) h[i](W, o); W.walls.push(o); W._wv++; return o;
}
// 벽 격자 (속도, v2.0 둘째): 벽이 WMIN개 넘게 서면 8 m 칸마다 벽의 번호를 적어 두고, 가까운 칸의 벽만 원래 차례(번호 순)로 본다.
// 벽이 적으면 예전처럼 모두 훑는다(결과가 비트까지 같다). 많아도 같은 벽을 같은 차례로 보니 결과는 모두 훑은 것과 같다
const WG = 8, WMIN = 16, WRMAX = 1.5;
function wallGrid(W) {
  if (W._wgN === W._wv) return W._wg;
  const g = new Map(), ws = W.walls;
  for (let i = 0; i < ws.length; i++) { const w = ws[i], x0 = Math.floor((w.x - w.r) / WG), x1 = Math.floor((w.x + w.r) / WG), y0 = Math.floor((w.y - w.r) / WG), y1 = Math.floor((w.y + w.r) / WG);
    for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) { const k = cx * 65536 + cy; let a = g.get(k); if (!a) g.set(k, a = []); a.push(i); } }
  W._wg = g; W._wgN = W._wv; return g;
}
// 사각형 [x0, x1] × [y0, y1] 에 닿을 수 있는 벽의 번호 (차례대로, 겹침 없이). W._wq를 다시 쓴다
function wallsIn(W, x0, y0, x1, y1) {
  const g = wallGrid(W), q = W._wq; q.length = 0;
  const a0 = Math.floor(x0 / WG), a1 = Math.floor(x1 / WG), b0 = Math.floor(y0 / WG), b1 = Math.floor(y1 / WG);
  for (let cx = a0; cx <= a1; cx++) for (let cy = b0; cy <= b1; cy++) { const a = g.get(cx * 65536 + cy); if (a) for (let i = 0; i < a.length; i++) q.push(a[i]); }
  if (q.length > 1) { for (let i = 1; i < q.length; i++) { const x = q[i]; let k = i - 1; while (k >= 0 && q[k] > x) { q[k + 1] = q[k]; k--; } q[k + 1] = x; } let j = 1;
    for (let i = 1; i < q.length; i++) if (q[i] !== q[j - 1]) q[j++] = q[i]; q.length = j; }   // 삽입 정렬 (짧다, 정렬 함수의 임시 배열 없이: v2.23.1)
  return q;
}
// 소금 땅 위인가 (장면의 사각형, rules/saltLand)
function onSalt(W, x, y) { const a = W.salt; for (let i = 0; i < a.length; i++) { const r = a[i]; if (x >= r.x && y >= r.y && x <= r.x + r.w && y <= r.y + r.h) return true; } return false; }
function frontBlock(e, sx, sy) { if (!e.buf.front) return false; const a = atan2(sy - e.y, sx - e.x), b = Math.abs(((a - e.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 1.1;
  if (b && !e.buf.front.used) { e.buf.front.used = 1; e.log.defHit++; } return b; }   // 막은 방패는 방어 적중으로 한 번 센다

/* ---------------- 피해와 상태 ---------------- */
function hurt(W, m, v, src, name, kind, tick) {   // tick: 걸음마다 드는 피해(지대·빔·불·소금, v2.24)
  if (m.hp <= 0 || v <= 0) return;
  const b = m.buf;
  if (kind === 'elec' && b.elecRes) v *= b.elecRes.v;
  if (kind === 'blunt' && b.bluntRes) v *= b.bluntRes.v;
  if (kind === 'tox' && b.toxRes) v *= b.toxRes.v;
  const H = W.H, hm = H.hurtMod; for (let i = 0; i < hm.length; i++) v = hm[i](W, m, v, kind, name, src, tick);   // 흡수 안개·물 장막 (rules/terrain), 몸 받침 (rules/body)
  if (kind === 'elec' && m.st.wet > 0) v *= 1.5;
  if (kind === 'fire' && m.st.wet > 0) v *= 0.6;
  m.hp -= v; m.log.taken[kind] = (m.log.taken[kind] || 0) + v;
  const hh = H.hurt; for (let i = 0; i < hh.length; i++) hh[i](W, m, v, src, name, kind);   // 몸 묶기가 불에 풀림 (rules/control), 역류 (rules/risk)
  // 동시 착탄: 같은 사람의 다른 마법이 0.2 s 안에 같은 과녁에 닿았다 (셋이면 둘로 센다)
  if (src && v >= 2) { const h = m.lastHit; if (h && h.src === src && W.t - h.t < 0.2 && !h.names.includes(name)) { src.log.simul++; h.names.push(name);
      } else m.lastHit = { src, t: W.t, names: [name] }; }
  // 방어 미끼 (전설): 미끼로 방패를 든 뒤 1.5 s 안에, 그걸 보고 시전하던 상대를 맞혔다
  if (src && src.baitT != null && W.t - src.baitT < 1.5 && (m.cast || m.castB) && !src.baitDone) { src.baitDone = 1; src.log.defTry++; src.log.defHit++; }
  // 콤보 성공: 콤보로 쏜 마법이 묶이거나 굳은(전기면 젖은) 상대에게 들어갔다
  const cp = src && src.comboPend; if (cp && cp.tgt === m && W.t <= cp.until && (m.st.stun > 0 || m.st.root > 0 || (kind === 'elec' && m.st.wet > 0))) { src.log.comboHit++;
    src.log.cHit[cp.kind] = (src.log.cHit[cp.kind] || 0) + 1; src.comboPend = null; }
  if (src && src !== m) src.log.dealt[name] = (src.log.dealt[name] || 0) + v;
  if (m.hp <= 0 && m.deathT === null) m.deathT = W.t;
}
function eff(W, m, o, g = 1) {
  if (!o) return;
  let gh = g; const hh = W.H.effHold; for (let i = 0; i < hh.length; i++) gh = hh[i](W, m, o, gh);   // 붙잡는 효과(굳음·묶임·몸 묶기)의 몫: 은실 옷 (rules/silver)
  if (o.burn) m.st.burn = Math.max(m.st.burn || 0, o.burn * g);
  if (o.wet) m.st.wet = 20;
  if (o.chill) m.st.chill = Math.max(m.st.chill || 0, o.chill * g);
  if (o.stun) { let sv = o.stun * gh * (m.buf.elecRes && o.kind === 'elec' ? 0.3 : 1); const hs = W.H.stunHold; for (let i = 0; i < hs.length; i++) sv = hs[i](W, m, o, sv);
    m.st.stun = Math.max(m.st.stun || 0, sv); }   // 굳는 시간 (rules/stunRes: 굳힘 내성)
  if (o.root) m.st.root = Math.max(m.st.root || 0, o.root * gh);
  if (o.blind) m.st.blind = Math.max(m.st.blind || 0, o.blind * g);
  if (o.cough) m.st.cough = Math.max(m.st.cough || 0, o.cough * g);
  const h = W.H.eff; for (let i = 0; i < h.length; i++) h[i](W, m, o, gh);   // 몸 묶기 (rules/control). 붙잡는 효과라 gh
  if (m.st.stun > 0) { m.cast = null; m.castB = null; m.chan = null; }
}
// 한 사람이 깔아 둘 수 있는 함정 수: 셋. 규칙이 고친다(진지: 서클만큼, rules/fort)
function trapCap(W, m) { let n = 3; const h = W.H.trapCap; for (let i = 0; i < h.length; i++) n = h[i](W, m, n); return n; }
const hit = (m, s) => { m.log.hits[s.n] = (m.log.hits[s.n] || 0) + 1; if (s.big) m.log.bigHit++; };
function addZone(W, src, z, x, y, a, g) { const gz = g ?? 1; const zz = Object.assign({}, z, { x, y, a: a || 0, src, dps: (z.dps || 0) * gz, t: z.d * (gz < 1 ? Math.max(0.3, gz) : 1) });
  W.zones.push(zz); if (zz.k === 'fire') ignite(W, x, y, zz.r || (zz.len || 2) / 2, src); }
// 불·전기가 (x, y) 둘레 r m에 닿았다 (화약통, rules/barrels)
function ignite(W, x, y, r, src) { const h = W.H.ignite; for (let i = 0; i < h.length; i++) h[i](W, x, y, r, src); }
function canHit(W, p, q) { return q !== p.src && q.hp > 0 && (W.rules.friendlyFire || q.side !== p.src.side); }

/* ---------------- 마법 방출 ---------------- */
function release(W, m, c) {
  const hu = W.H.tune; for (let i = 0; i < hu.length; i++) hu[i](W, m, c);   // 손잡이를 돌린 시전은 손잡이가 박힌 마법으로 (rules/tune, v2.19)
  const ht = W.H.track; for (let i = 0; i < ht.length; i++) ht[i](W, m, c);   // 풀 때 겨냥을 고친다: 감각 조준 (rules/pace, v2.14)
  const s = c.s, tx = c.tx, ty = c.ty, dx0 = tx - m.x, dy0 = ty - m.y, d0 = hyp(dx0, dy0) || 1, ux = dx0 / d0, uy = dy0 / d0;
  m.aim = atan2(uy, ux);
  m.log.casts[s.n] = (m.log.casts[s.n] || 0) + 1;
  if ((s.t === 'wall' || s.t === 'shoot' || (s.t === 'buff' && s.b.front)) && !c.bait) m.log.defTry++;   // 미끼 방패는 성공했을 때만 방어로 센다
  const hr = W.H.release; for (let i = 0; i < hr.length; i++) hr[i](W, m, c);   // 빈손 (rules/risk)
  if (!c.auto && !c.B && !c.lane) { m.relT = W.t; m.lastRel = W.t; if (m.tac.plan) m.thinkT = 0; }   // 빈틈·멈춤은 첫 칸으로 센다   // 쏘는 중에 다음 수를 정해 둔 사람은 바로 다음 걸음에 시작한다
  if (W.rules.fatigue && !s.mundane) {
    m.fat += s.cost * (c.B ? 1.3 : 1) * (c.auto ? 0.8 : 1) * 1.6;
    // 머리가 넘치면 굳는다(폭주). 규칙이 넘침을 맡으면(파도, rules/wave) 그 규칙이 한다
    let took = false; const ho = W.H.overload; for (let i = 0; i < ho.length; i++) if (ho[i](W, m)) { took = true; break; }
    if (!took && m.fat > 100) { m.st.stun = Math.max(m.st.stun || 0, 1); m.fat = 55; m.log.over++; m.cast = m.castB = m.chan = null; }
  }
  const g = gAt(W, m, s, tx, ty);
  if (g <= 0.02) { m.log.fizz++; return; }
  const P = power(W, m, s) * g, rs = sizeOf(m, s), foes = W.foes[m.side];
  switch (s.t) {
    case 'proj': {
      const n = s.multi || 1;
      for (let j = 0; j < n; j++) {
        const a = atan2(uy, ux) + (n > 1 ? (j / (n - 1) - 0.5) * 0.26 : 0) + (W.rng() - 0.5) * 2 * (s.aimN != null ? s.aimN + s.aimD * d0 : m.noise) * m._nm * (m.st.blind > 0 ? 3 : 1);   // 총의 흔들림은 총이 정한다(멀수록 크다, rules/army)
        // 높이 (v2.0): 쏜 사람의 높이에서 과녁의 높이로 곧게. 날며 쏘면 내 속도가 더해진다
        const tz = c.tgt && c.tgt.hp > 0 ? c.tgt.z : 0, vz = tz !== m.z ? (tz - m.z) / (d0 / s.v) : 0, fl = m.z > 0;
        W.proj.push({ x: m.x, y: m.y, vx: cos(a) * s.v + (fl ? m.vx : 0), vy: sin(a) * s.v + (fl ? m.vy : 0), z: m.z, vz, home: s.home, life: s.home ? s.life : rangeOf(m, s) / s.v, s, src: m, pow: P / (n > 1 ? n * 0.55 : 1), rad: (s.rad || 0.1) * (s.mundane ? 1 : Math.min(rs, 3)), t0: W.t });   // t0: 쏜 시각 (반사 겹의 반응 시간, rules/reflex)
      }
      break;
    }
    case 'lob': W.lobs.push({ x: tx, y: ty, t: s.flight, s, src: m, pow: P, r: s.r * rs }); break;
    case 'thread': {
      const R = rangeOf(m, s), ex = d0 > R ? m.x + ux * R : tx, ey = d0 > R ? m.y + uy * R : ty, ez = c.tgt ? c.tgt.z : 0;   // 실의 끝 높이는 과녁의 높이 (v2.0)
      if (!blocked(W, m.x, m.y, ex, ey, m.z > ez ? m.z : ez)) {
        let tgt = null; for (const q of foes) if (hyp3(q.x - ex, q.y - ey, q.z - ez) < (0.6 * Math.min(rs, 2) + 0.2) * (s.tw || 1)) { tgt = q; break; }   // 실의 굵기 (손잡이, v2.19)
        if (tgt && !frontBlock(tgt, m.x, m.y)) { hurt(W, tgt, 0.8 * pow(s.E, 0.55) * P, m, s.n, 'elec');
          eff(W, tgt, s.cramp ? { cramp: s.cramp } : { stun: Math.min(1.2, s.E / 800), kind: 'elec' }, g); hit(m, s); }   // 경직 실은 굳힘 대신 경직
      }
      if (W.rec) W.fx.push(['z', m.x, m.y, ex, ey]); ignite(W, ex, ey, 0.7, m); break;
    }
    case 'area': W.areas.push({ x: tx, y: ty, r: s.r * rs, t: s.delay, s, src: m, pow: P, vis: !!s.vis, g, t0: W.t }); break;
    case 'touch': {
      let e = null, bd = 1.35; for (const q of foes) { const d = hyp3(q.x - m.x, q.y - m.y, q.z - m.z); if (d < bd) { bd = d; e = q; } }
      if (e) { hurt(W, e, s.dmg * P, m, s.n, 'elec'); eff(W, e, { stun: s.stun, kind: 'elec' }, g); hit(m, s); }
      if (W.rec) W.fx.push(['z', m.x, m.y, e ? e.x : tx, e ? e.y : ty]); break;
    }
    case 'cone': m.chan = { s, t: s.dur, pow: P, L: s.L * rs, hitAny: false }; break;
    case 'zone': {
      const R0 = Math.min(d0, rangeOf(m, s) || 4), x = m.x + ux * R0, y = m.y + uy * R0;
      if (s.z.k === 'rain') {
        const rr = s.z.r * rs;
        for (const z of W.zones) if (hyp(z.x - x, z.y - y) < rr + (z.r || 2) && z.k !== 'mist' && z.k !== 'absorb') z.t = 0;
        for (const p of W.proj) if (p.src.side !== m.side && (p.home || p.s.n === '불덩이' || p.s.n === '소이 캡슐') && hyp(p.x - x, p.y - y) < rr) p.dead = true;
        const hr2 = W.H.rain; for (const q of W.ms) if (hyp(q.x - x, q.y - y) < rr) { q.st.wet = 15; q.st.burn = 0; for (let i = 0; i < hr2.length; i++) hr2[i](W, q); }   // 비가 눈을 씻는다 (rules/control)
      } else {
        const z = Object.assign({}, s.z, { n: s.n, r: s.z.r ? s.z.r * rs : undefined, len: s.z.len ? s.z.len * rs : undefined });
        if (s.z.needWet) { const e = c.tgt || foes[0]; if (!(e && e.st.wet > 0)) z.k = 'chill'; }
        addZone(W, m, z, x, y, atan2(uy, ux) + Math.PI / 2, g);
      }
      break;
    }
    case 'wall': {
      const n = s.n === '얼음 담' ? 3 : 1, a = atan2(uy, ux), px = -sin(a), py = cos(a), hpS = 1 + (m.C - 1) * 0.5;
      const grp = W._grp++, mat = s.el === '얼음' ? 'ice' : 'lime';
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 1.1;
        addWall(W, { x: m.x + ux * s.at + px * off, y: m.y + uy * s.at + py * off, r: s.r, hp: s.hp * hpS, t: s.dur, by: m, own: m.side, mat, thick: s.r * 2, grp, mk: m.id }); }
      break;
    }
    case 'buff': {
      for (const [k, v] of Object.entries(s.b)) if (k !== 'd') { m.buf[k] = { v: ['speed', 'elecRes', 'bluntRes', 'toxRes'].includes(k) ? v : 1, t: s.b.d };
        if (!BUFK.has(k) && !m._bufx.includes(k)) m._bufx.push(k); }
      if (s.b.smoke) addZone(W, m, { k: 'smoke', shape: 'circle', r: 2, d: 3, n: s.n }, m.x, m.y, 0, 1);
      break;
    }
    case 'move': {
      const dist = s.dist;
      if (s.mv === 'dash') { m.vx = ux * dist / 0.35; m.vy = uy * dist / 0.35; m.roll = 0.35; if (s.self) hurt(W, m, s.self, null, s.n, 'fire'); }
      if (s.mv === 'vault') { m.vx = ux * dist / 0.35; m.vy = uy * dist / 0.35; m.roll = 0.35; m.vault = 0.35; }
      if (s.mv === 'glide') { m.vx = ux * dist / 0.5; m.vy = uy * dist / 0.5; m.roll = 0.5; }
      break;
    }
    case 'trap': {
      const R0 = Math.min(d0, 6 * Math.sqrt(m.C)), mine = W.traps.filter(t => t.src === m);
      if (mine.length >= trapCap(W, m)) W.traps.splice(W.traps.indexOf(mine[0]), 1);   // 한도(보통 셋, 진지는 서클만큼, rules/fort)를 넘으면 가장 오래된 것을 거둔다
      W.traps.push({ x: m.x + ux * R0, y: m.y + uy * R0, s, src: m, arm: s.tr.arm || 0.8, seen: new Set(s.vis ? W.ms.map(q => q.id) : [m.id]), pow: P, r: s.tr.r * Math.min(rs, 2), chain: 0 });
      break;
    }
    case 'ring': {
      const rr = s.r * rs;
      for (const p of W.proj) if (p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      for (const z of W.zones) if (['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + 1) z.t = 0;
      const hg = W.H.ring; for (let i = 0; i < hg.length; i++) hg[i](W, m);   // 제 몸의 균사를 태운다 (rules/control)
      let h = false; for (const q of foes) if (hyp3(q.x - m.x, q.y - m.y, q.z - m.z) < rr) { hurt(W, q, s.dmg * P, m, s.n, 'fire'); eff(W, q, { burn: 1 }); h = true; }
      if (h) hit(m, s); break;
    }
    case 'shoot': {
      let n = 0; for (const p of W.proj) if (p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r * rs) { p.dead = true; n++;
        if (W.rec) W.fx.push(['z', m.x, m.y, p.x, p.y]); }
      if (n) { hit(m, s); m.log.defHit++; } break;
    }
    case 'smother': {
      const rr = s.r * rs;
      for (const z of W.zones) if (['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + (z.r || 2)) z.t = 0;
      m.st.burn = 0; const hs = W.H.smother; for (let i = 0; i < hs.length; i++) hs[i](W, m);
        for (const p of W.proj) if (p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      break;
    }
    default: { const f = TFX[s.t]; if (f) { TA.aim = atan2(uy, ux); TA.foes = foes; TA.g = g; f(W, m, c, TA); } }   // 규칙 모듈의 틀 (가두는 기둥·도발)
  }
}

function projHit(W, p, e) {
  const s = p.s, h = s.hit || {};
  let dmg = h.flat ? h.flat : 0.55 * pow(0.5 * s.m * s.v * s.v, 0.75);
  if (h.cap) dmg = Math.min(dmg, h.cap); if (h.dmg) dmg = h.dmg;
  hurt(W, e, dmg * p.pow, p.src, s.n, h.kind || 'blunt'); eff(W, e, Object.assign({}, h, { kind: h.kind }));
  if (h.zone) addZone(W, p.src, Object.assign({}, h.zone, { n: s.n }), p.x, p.y, 0, 1);
  hit(p.src, s);
}
function burst(W, p) {
  const b = p.s.burst; if (!b) return;
  if (b.zone) { addZone(W, p.src, Object.assign({}, b.zone, { n: p.s.n }), p.x, p.y, 0, 1); return; }
  const r = b.r * sizeOf(p.src, p.s);
  for (const q of W.ms) if (q.hp > 0 && hyp3(q.x - p.x, q.y - p.y, q.z - p.z) < r && (W.rules.friendlyFire || q.side !== p.src.side || q === p.src)) {
    hurt(W, q, b.dmg * p.pow * (1 - hyp3(q.x - p.x, q.y - p.y, q.z - p.z) / r * 0.5), q === p.src ? null : p.src, p.s.n, b.kind); eff(W, q, b); if (q !== p.src) hit(p.src, p.s);
  }
  if (W.rec) W.fx.push(['b', p.x, p.y, r]); if (b.kind === 'fire') ignite(W, p.x, p.y, r, p.src);
}

/* ---------------- 한 걸음 ---------------- */
// 배열을 제자리에서 거른다(순서 그대로, 항목마다 한 번씩 부른다). 걸음마다 새 배열을 만들지 않는다 (속도, 1.11.1)
function keepIf(a, f) { let j = 0; for (let i = 0; i < a.length; i++) { const x = a[i]; if (f(x)) a[j++] = x; } if (j !== a.length) a.length = j; }   // length에 넣는 건 느린 길이라 줄었을 때만
const projLive = p => !p.dead, timeLeft = x => x.t > 0, trapLive = t => !t.done, wallLive = w => (w.t -= DT) > 0 && w.hp > 0;
// 편마다 적 목록을 걸음마다 다시 쓴다: 배열은 그대로 두고 앞에서부터 덮어쓴 뒤 남는 꼬리만 자른다 (속도, 1.11.1)
function refreshSides(W) {
  const F = W.foes, nF = W._nF || (W._nF = []); for (let s = 0; s < F.length; s++) nF[s] = 0;
  let cloak = false;
  for (const m of W.ms) {
    if (m.hp <= 0) continue;
    if (m.gear.cloak) cloak = true;
    const x = ceff(W, m); if (x !== m._sigX) { m._sigX = x; m._sigN = true; }   // 신호 세기는 걸음 첫 선명도로. pow는 누가 읽을 때 한 번 (sigOf, 속도)
    m._act = !!(m.cast || m.castB || m.chan);
    for (let s = 0; s < W.sides; s++) if (s !== m.side) F[s][nF[s]++] = m;
  }
  for (let s = 0; s < F.length; s++) if (F[s].length !== nF[s]) F[s].length = nF[s];
  W._cloak = cloak;
}
function stepMage(W, m) {
  const st = m.st;   // 상태는 이 열한 가지뿐이다(addMage). 이름으로 줄이면 빠르다 (속도, 1.11.1)
  if (st.stun > 0) st.stun -= DT; if (st.root > 0) st.root -= DT; if (st.wet > 0) st.wet -= DT; if (st.burn > 0) st.burn -= DT; if (st.chill > 0) st.chill -= DT; if (st.blind > 0) st.blind -= DT;
  if (st.cough > 0) st.cough -= DT; if (st.mycel > 0) st.mycel -= DT; if (st.cramp > 0) st.cramp -= DT; if (st.lime > 0) st.lime -= DT; if (st.fetter > 0) st.fetter -= DT;
  // 끝난 몸 효과는 지우지 않고 null로 둔다: delete는 객체를 느린 사전 모양으로 바꾼다 (속도, 1.11.1). 읽는 쪽은 없음과 같게 본다
  const bf = m.buf; let b;
  if ((b = bf.speed) && (b.t -= DT) <= 0) bf.speed = null; if ((b = bf.elecRes) && (b.t -= DT) <= 0) bf.elecRes = null; if ((b = bf.bluntRes) && (b.t -= DT) <= 0) bf.bluntRes = null;
  if ((b = bf.toxRes) && (b.t -= DT) <= 0) bf.toxRes = null; if ((b = bf.front) && (b.t -= DT) <= 0) bf.front = null; if ((b = bf.block) && (b.t -= DT) <= 0) bf.block = null;
    if ((b = bf.smoke) && (b.t -= DT) <= 0) bf.smoke = null;
  for (let i = 0; i < m._bufx.length; i++) { const k = m._bufx[i]; if ((b = bf[k]) && (b.t -= DT) <= 0) bf[k] = null; }   // 등록한 마법의 다른 몸 효과
  // 간격은 0 아래로 더 줄이지 않는다: 읽는 곳은 모두 (cd || 0)을 0 이상 문턱과 견주거나 0 이상과 min·max하므로 0 아래는 얼마든 같다 (속도, 1.11.1)
  const cd = m.cd; for (const n in cd) { const v = cd[n]; if (v > 0) cd[n] = v - DT; }
  m.rollCd -= DT; m.autoCd -= DT; if (m.vault > 0) m.vault -= DT;
  let gr = W.rules.gluRegen ?? BODY.gluRegen; const hg = W.H.gluRegen; for (let i = 0; i < hg.length; i++) gr = hg[i](W, m, gr); m.glu = Math.min(m.gluMax, m.glu + gr * DT);
    if (m.stam < BODY.stam) m.stam += BODY.stamRegen * DT;   // 당 회복 (버티기, rules/endure)
  const H = W.H;
  if (m.fat > 0) { let k = 4; const hf = H.fatRecover; for (let i = 0; i < hf.length; i++) k = hf[i](W, m, k); m.fat = Math.max(0, m.fat - k * DT); }   // 머리 회복 (메타 × 1.05, rules/wave)
  const hs = H.mageStep; for (let i = 0; i < hs.length; i++) hs[i](W, m);   // 소금 선 밖 (rules/saltRing), 파도가 몸을 태움·꺼짐 (rules/wave)
  if (m.st.burn > 0) hurt(W, m, 3 * DT, null, '옷에 붙은 불', 'fire', true);
  const hz = H.mageZones; for (let i = 0; i < hz.length; i++) hz[i](W, m);   // 선 지대 (rules/terrain)
  if (m.hp <= 0) return;
  m.thinkT -= DT; if (m.thinkT <= 0) { m.thinkT = m.dec; const B = m.brain || W.brain; if (B) B.think(W, m); }
  if (m.hp <= 0) return;
  const sT = m.log.stanceT, sk = m.stance;   // 이름으로 더한다 (속도). 처음 더할 때 칸이 생기는 차례는 그대로
  if (sk === 'normal') sT.normal = (sT.normal || 0) + DT; else if (sk === 'kite') sT.kite = (sT.kite || 0) + DT; else if (sk === 'hold') sT.hold = (sT.hold || 0) + DT;
    else if (sk === 'breakout') sT.breakout = (sT.breakout || 0) + DT; else sT[sk] = (sT[sk] || 0) + DT;
  // 첫 칸, 두 번째 칸 차례로 (걸음마다 배열을 만들지 않게 풀어 썼다, 속도 1.11.1)
  let c = m.cast; if (c) { c.t += DT; if (m.st.stun > 0) m.cast = null; else if (c.t >= c.T) { m.cast = null; release(W, m, c); } }
  c = m.castB; if (c) { c.t += DT; if (m.st.stun > 0) m.castB = null; else if (c.t >= c.T && !holds(W, m, c)) { m.castB = null; release(W, m, c); } }   // 붙잡아 둔 설계 (rules/hold)
  if (m.chan) {
    const ch = m.chan, s = ch.s; ch.t -= DT;
    for (const e of W.foes[m.side]) {
      const d = hyp3(e.x - m.x, e.y - m.y, e.z - m.z), ang = Math.abs(((atan2(e.y - m.y, e.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < ch.L && ang < 0.45) {
        hurt(W, e, s.dps * ch.pow * DT, m, s.n, s.kind, true);
        if (s.burn) e.st.burn = Math.max(e.st.burn || 0, s.burn); if (s.wet) e.st.wet = 20; if (s.blind) e.st.blind = Math.max(e.st.blind || 0, s.blind);
        if (s.push) { e.vx += cos(m.aim) * s.push * DT * 4; e.vy += sin(m.aim) * s.push * DT * 4; }
        ch.hitAny = true;
      }
    }
    const hc = H.chan; for (let i = 0; i < hc.length; i++) hc[i](W, m, ch);   // 앞의 화약통 (rules/barrels)
    if (ch.t <= 0) { if (ch.hitAny) hit(m, s); m.chan = null; }
  }
  // 움직임. 규칙이 맡으면(나는 사람, rules/flight) 땅의 걸음은 건너뛴다
  const hp = H.preMove; for (let i = 0; i < hp.length; i++) hp[i](W, m);   // 판단 뒤·움직임 앞: 반사 겹이 걸음 방향을 덮는다 (rules/reflex)
  let mv = false; const hm = H.move; for (let i = 0; i < hm.length; i++) if (hm[i](W, m)) { mv = true; break; }
  if (mv) {} else if (m.roll > 0) m.roll -= DT;
  else {
    let sp = BODY.speed; const hv = H.speed; for (let i = 0; i < hv.length; i++) sp = hv[i](W, m, sp);   // 파도·꺼짐 (rules/wave), 빈손 (rules/risk)
    if (m.buf.speed) sp *= 1 + m.buf.speed.v; if (m.st.chill > 0) sp *= 0.7;
    const hl = H.speedLate; for (let i = 0; i < hl.length; i++) sp = hl[i](W, m, sp);   // 경직·균사 (rules/control)
    if (m.cast || m.chan) { let k = (m.cast && m.cast.s.lock) ? 0 : m.tac.castMove; const hk = H.castMove; for (let i = 0; i < hk.length; i++) k = hk[i](W, m, k); sp *= k;
      } if (m.st.stun > 0 || m.st.root > 0) sp = 0;   // 끊어 걷기 (rules/snap)
    let acc = 9; const ha = H.accel; for (let i = 0; i < ha.length; i++) acc = ha[i](W, m, acc);   // 빙판 (rules/terrain)
    const l = hyp(m.mv.x, m.mv.y), tx = l ? m.mv.x / l * sp : 0, ty = l ? m.mv.y / l * sp : 0, k = Math.min(1, DT * acc);
    let wk = false; const hw = H.walk; for (let i = 0; i < hw.length; i++) if (hw[i](W, m, tx, ty, acc)) { wk = true; break; }   // 가속 한계 (rules/snap)
    if (!wk) { m.vx += (tx - m.vx) * k; m.vy += (ty - m.vy) * k; }
  }
  m.x = clamp(m.x + m.vx * DT, 0.4, W.width - 0.4); m.y = clamp(m.y + m.vy * DT, 0.4, W.height - 0.4);
  if (!(m.vault > 0) && !(m.z > 2)) {   // 2 m 넘게 뜨면 바위·벽을 넘는다 (v2.0)
    for (const o of W.obs) { const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy);
      if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
    const ws = W.walls, few = ws.length <= WMIN, q = few ? null : wallsIn(W, m.x - WRMAX - m.r, m.y - WRMAX - m.r, m.x + WRMAX + m.r, m.y + WRMAX + m.r), nq = few ? ws.length : q.length;
    for (let i = 0; i < nq; i++) { const o = few ? ws[i] : ws[q[i]]; const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r;
      if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
  }
}
// 구르기 (SPEC 3장): 두뇌·대응이 모두 이것으로 구른다. 속도 v와 간격 cd는 규칙이 고친다(회피, rules/evade)
const RO = { v: 0, cd: 0, skip: false, dx: 0, dy: 0 };   // 구르는 방향도 훅이 고칠 수 있다 (소금 원 밖으로 구르지 않기, v2.6)
// 다 지은 두 번째 칸을 붙잡아 두는가 (규칙의 castHold 훅, rules/hold). 훅이 없으면 늘 푼다
function holds(W, m, c) { const h = W.H.castHold; for (let i = 0; i < h.length; i++) if (h[i](W, m, c)) return true; return false; }
function roll(W, m, dx, dy, v, cd) {
  RO.v = v; RO.cd = cd; RO.skip = false; RO.dx = dx; RO.dy = dy; const h = W.H.roll; for (let i = 0; i < h.length; i++) h[i](W, m, RO);
  if (RO.skip) return;   // 나는 사람은 구르지 않는다 (rules/flight가 옆으로 꺾는다)
  const l = hyp(RO.dx, RO.dy) || 1; m.vx = RO.dx / l * RO.v; m.vy = RO.dy / l * RO.v; m.roll = 0.25; m.rollCd = RO.cd; m.stam -= 1.5;
}
// 안 보이는 함정을 알아챌 걸음당 확률 (이단의 함정은 어렵다, rules/wave)
function notice(W, t) { let k = DT * 0.25; const h = W.H.notice; for (let i = 0; i < h.length; i++) k = h[i](W, t, k); return k; }
function stepWorld(W) {
  DT = W.dt; X.DT = DT; W.t += DT; W.step++;
  refreshSides(W);
  const H = W.H, hw = H.world; for (let i = 0; i < hw.length; i++) hw[i](W);   // 등록한 규칙의 걸음마다 할 일
  for (const m of W.ms) if (m.hp > 0) stepMage(W, m);
  // 투사체: 속도에 맞춰 잘게 나눠 움직인다 (빠른 탄이 사람을 뚫고 지나가지 않게)
  for (const p of W.proj) {
    if (p.dead) continue; p.life -= DT;
    if (p.home) {
      let e = null, bd = 1e9; for (const q of W.foes[p.src.side]) { const d = hyp(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; e = q; } }
      if (e) { const sp = hyp(p.vx, p.vy), want = atan2(e.y - p.y, e.x - p.x), cur = atan2(p.vy, p.vx);
        const df = ((want - cur + Math.PI * 3) % (Math.PI * 2)) - Math.PI, na = cur + clamp(df, -2 * DT, 2 * DT); p.vx = cos(na) * sp; p.vy = sin(na) * sp;
        if (e.z !== p.z) p.vz = clamp((e.z - p.z) * 2, -sp, sp); }
      for (const z of W.zones) if (z.k === 'fire' && inZone(z, p.x, p.y)) p.dead = true;
    }
    const nS = Math.max(3, Math.ceil(hyp(p.vx, p.vy) * DT / 0.25));
    for (let k = 0; k < nS && !p.dead; k++) {
      p.x += p.vx * DT / nS; p.y += p.vy * DT / nS; if (p.vz) { p.z += p.vz * DT / nS; if (p.z < 0) { p.dead = true; burst(W, p); break; } }   // 땅에 박힌다
      const low = !(p.z >= 2);   // 2 m 넘게 뜬 투사체는 바위·벽을 넘는다 (v2.0)
      if (low) for (const o of W.obs) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; burst(W, p); break; }
      if (p.dead) break;
      if (low) { const ws = W.walls, few = ws.length <= WMIN, q = few ? null : wallsIn(W, p.x - WRMAX - p.rad, p.y - WRMAX - p.rad, p.x + WRMAX + p.rad, p.y + WRMAX + p.rad), nq = few ? ws.length : q.length;
      for (let i = 0; i < nq; i++) { const o = few ? ws[i] : ws[q[i]]; if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; if (o.by && !o.used && o.by !== p.src) { o.used = 1;
            o.by.log.defHit++; } let wd = (p.s.hit && p.s.hit.flat > 50) ? 80 : 5 * Math.min(p.pow, 20); const hw = H.wallHit; for (let i = 0; i < hw.length; i++) wd = hw[i](W, p, o, wd); o.hp -= wd;
          burst(W, p); break; } } }   // 벽이 받는 것: 재료·두께 (rules/bulwark)
      if (p.dead) break;
      const hp = H.projSub; for (let i = 0; i < hp.length && !p.dead; i++) hp[i](W, p);   // 화약통 (rules/barrels)
      if (p.dead) break;
      for (const q of W.ms) {
        if (!canHit(W, p, q) || (p.home && q.side === p.src.side)) continue;
        const lim = q.r + p.rad + (p.home ? 0.2 : 0), dx = q.x - p.x, dy = q.y - p.y;
        if (dx > lim + 1e-9 || dx < -lim - 1e-9 || dy > lim + 1e-9 || dy < -lim - 1e-9) continue;   // 멀면 거리를 재지 않는다 (hyp ≥ |dx|라 결과는 같다)
        if (hyp(dx, dy) < lim && !(q.z - p.z > 1.2 || p.z - q.z > 1.2) && !(q.roll > 0 && !p.home)) {   // 높이 차 1.2 m 안 (v2.0)
          p.dead = true; if ((p.s.pierce && (p.s.pierce >= 1 || W.rng() < p.s.pierce)) || !frontBlock(q, p.x - p.vx, p.y - p.vy)) {   // 대포알은 방패가 못 막는다 (pierce: 뚫는 몫, rules/artillery v2.31)
           if (p.s.burst) burst(W, p); else projHit(W, p, q); } break;
        }
      }
    }
    if (!p.dead && p.life <= 0) { p.dead = true; burst(W, p); }
  }
  keepIf(W.proj, projLive);
  for (const l of W.lobs) { l.t -= DT; if (l.t <= 0) { const hl = H.lobLand; for (let i = 0; i < hl.length; i++) hl[i](W, l);   // 떨어진 돌이 벽을 부순다 (rules/bulwark)
    for (const q of W.ms) if (q.hp > 0 && q !== l.src && hyp(q.x - l.x, q.y - l.y) < l.r + 0.3 && !(q.z >= 2) && (W.rules.friendlyFire || q.side !== l.src.side)) { hurt(W, q, l.s.dmg * l.pow, l.src, l.s.n, l.s.kind);
      hit(l.src, l.s); } if (W.rec) W.fx.push(['a', l.x, l.y, l.r]); } }
  keepIf(W.lobs, timeLeft);
  for (const a of W.areas) {
    a.t -= DT; if (a.t > 0) continue;
    let h = false;
    for (const q of W.ms) {
      if (q.hp <= 0 || hyp(q.x - a.x, q.y - a.y) >= a.r + 0.3) continue;
      if (!W.rules.friendlyFire && q.side === a.src.side && q !== a.src) continue;
      let sole = 1; const hh = H.areaHit; for (let i = 0; i < hh.length; i++) sole = hh[i](W, q, a, sole);   // 소금 밑창 (rules/gear), 높이 (rules/flight)
      if (sole === 0) continue;   // 닿지 않았다 (날고 있다)
      hurt(W, q, a.s.dmg * a.pow * sole, q === a.src ? null : a.src, a.s.n, a.s.kind);
      const as = a.s;
        eff(W, q, { burn: as.burn, wet: as.wet, chill: as.chill, stun: (as.stun || 0) * sole * a.g, kind: as.kind, root: (as.root || 0) * sole * a.g, blind: as.blind, cough: as.cough, mycel: as.mycel, cramp: as.cramp, lime: as.lime, fetter: as.fetter });   // eff가 읽는 칸만 (마법 전체를 베끼지 않는다, 속도)
      if (q !== a.src) h = true;
    }
    if (h) hit(a.src, a.s); if (W.rec) W.fx.push(['a', a.x, a.y, a.r]);
    if (a.s.kind === 'fire' || a.s.kind === 'elec') ignite(W, a.x, a.y, a.r, a.src);
  }
  keepIf(W.areas, timeLeft);
  const hz = H.zoneTick; for (let i = 0; i < hz.length; i++) hz[i](W);   // 지대의 시간, 산이 벽을 녹인다 (rules/terrain)
  keepIf(W.zones, timeLeft);
  const nw = W.walls.length; keepIf(W.walls, wallLive); if (W.walls.length !== nw) W._wv++;
  for (const t of W.traps) {
    if (t.done) continue;   // 이 걸음에 이미 터졌다 (옆 함정 연쇄, rules/fort)
    t.arm -= DT; if (t.arm > 0) continue;
    let e = null, bd = 1e9; for (const q of W.foes[t.src.side]) { const d = hyp(q.x - t.x, q.y - t.y); if (d < bd) { bd = d; e = q; } }
    if (!e) continue;
    if (!t.seen.has(e.id) && bd < 2.5 && W.rng() < notice(W, t)) t.seen.add(e.id);
    if (!(e.roll > 0) && !(e.z >= 1) && bd < t.r) {   // 떠 있으면 밟지 않는다 (v2.0)
      if (W.t - (t.src.lureT ?? -9) < 3) t.src.log.lure++;   // 유도·몰이 성공: 끌어들인 적이 내 함정을 밟았다
      const tr = t.s.tr; if (tr.dmg) hurt(W, e, tr.dmg * t.pow, t.src, t.s.n, tr.kind || 'blunt'); eff(W, e, tr);
      if (tr.zone) addZone(W, t.src, Object.assign({}, tr.zone, { n: t.s.n }), t.x, t.y, 0, 1);
      hit(t.src, t.s); t.done = true;
      const hf = H.trapFire; for (let i = 0; i < hf.length; i++) hf[i](W, t, e);   // 옆 함정 연쇄 (rules/fort)
    }
  }
  keepIf(W.traps, trapLive);
  const he = H.stepEnd; for (let i = 0; i < he.length; i++) he[i](W);   // 걸음의 끝: 다 정해진 상태를 읽는다 (고리 장부 rules/rings, v2.22)
  if (W.rec && W.step % W._recN === 0) W.rec.push(snapshot(W)); else W.fx.length = 0;   // 녹화 간격: 기본 두 걸음, recEvery 1이면 매 걸음 (v2.4)
}

/* ---------------- 기록 ---------------- */
const r2 = v => Math.round(v * 100) / 100;
function snapshot(W) {
  return {
    t: r2(W.t),
    m: W.ms.map(m => [r2(m.x), r2(m.y), Math.round(m.hp), m.cast ? m.cast.s.n : (m.chan ? m.chan.s.n : ''), m.cast ? r2(m.cast.t / m.cast.T) : 0,
      (m.st.stun > 0 ? 1 : 0) | (m.st.root > 0 ? 2 : 0) | (m.st.wet > 0 ? 4 : 0) | (m.st.burn > 0 ? 8 : 0) | (m.buf.front ? 16 : 0) | (m.roll > 0 ? 32 : 0) | (m.castB ? 64 : 0),
      r2(m.aim), m.side, Math.round(m.fat), m.stance[0]].concat(W._fly ? [r2(m.z), Math.round(hyp(m.vx, m.vy))] : [])),   // 비행이 켜졌으면 높이·속도 (v2.0)
    p: W.proj.map(p => [r2(p.x), r2(p.y), p.s.el]), w: W.walls.map(w => [r2(w.x), r2(w.y), w.r]),
    z: W.zones.map(z => [z.k, r2(z.x), r2(z.y), r2(z.r || 0), r2(z.len || 0), r2(z.a || 0)]), a: W.areas.map(a => [r2(a.x), r2(a.y), r2(a.r), a.vis ? 1 : 0]),
    tr: W.traps.map(t => [r2(t.x), r2(t.y), t.s.el]), b: W.barrels.map(b => [r2(b.x), r2(b.y), b.ex ? 1 : 0]), fx: W.fx.splice(0),
  };
}

/* ---------------- 판 돌리기 ---------------- */
function aliveSide(W, s) { for (const m of W.ms) if (m.side === s && m.hp > 0) return true; return false; }
// 산 사람이 있는 편의 수: 한 번 훑어 센다 (속도, 1.11.1. 편마다 따로 훑던 것과 같다)
function aliveCount(W) { const seen = W._alive || (W._alive = []); for (let s = 0; s < W.sides; s++) seen[s] = false; let n = 0;
  for (const m of W.ms) if (m.hp > 0 && !seen[m.side]) { seen[m.side] = true; if (++n === W.sides) break; } return n; }
// 판이 끝났는가: 한 편만 남았거나 시간이 다 됐다. 걸음씩 돌리는 쪽(샌드박스)도 이것으로 멈춘다
function over(W) { return !(W.t < W.maxT) || (W.step > 0 && aliveCount(W) <= 1); }
function run(W) {
  while (W.t < W.maxT) {
    stepWorld(W);
    if (aliveCount(W) <= 1) break;
  }
  return result(W);
}
function result(W) {
  const alive = []; for (let s = 0; s < W.sides; s++) if (aliveSide(W, s)) alive.push(s);
  let winner = alive.length === 1 ? alive[0] : -1, byTime = false;
  if (alive.length > 1 && W.timeWin >= 0 && alive.includes(W.timeWin)) { winner = W.timeWin; byTime = true; }   // 시간이 다 되면 이 편이 이긴다 (장면의 timeWin, v2.33: 공성에서 버틴 쪽)
  else if (alive.length > 1) {
    const avg = alive.map(s => { const g = W.ms.filter(m => m.side === s); return g.reduce((a, m) => a + Math.max(0, m.hp) / m.hpMax, 0) / g.length; });
    const best = Math.max(...avg), i = avg.indexOf(best), second = Math.max(...avg.filter((_, j) => j !== i));
    if (best - second > 0.04) { winner = alive[i]; byTime = true; }
  }
  const dead = [], fled = []; for (let s = 0; s < W.sides; s++) { dead.push(0); fled.push(0); } for (const m of W.ms) if (m.hp <= 0) { if (m.alog.fled) fled[m.side]++; else dead[m.side]++; }   // 끝에 닿아 빠진 사람은 쓰러짐이 아니라 물러남 (v2.29)
  return { v: VERSION, winner, byTime, t: r2(W.t), ms: W.ms, obs: W.obs, rec: W.rec, dead, fled };
}

// 규칙 모듈이 쓰는 엔진의 것 (X)
X = { DT, BODY, sigOf, hyp, hyp3, clamp, addWall, trapCap, canHit, release, keepIf, onSalt, wallsIn, sin, cos, atan2, pow, log, hurt, hit, eff, burst, addZone, formPoint, inZone, blocked, share, gOf, power, sizeOf, rangeOf, roll };
formsOf();
const { SALT, saltR, outSalt } = require('./rules/saltRing').api;   // 예전 이름 그대로 (소금 원, rules/saltRing)
module.exports = { VERSION, DT, SPELLS, sigOf, TYPES, SALT, saltR, outSalt, sin, cos, atan2, pow, exp, log, DEFAULT_RULES, V1_RULES, RULES: R.RULES, BODY, FORM, THREAT, createWorld, addMage, addWall, trapCap, onSalt, wallsIn, stepWorld, run, over, result, snapshot, release, roll, eff, hurt, rulesOf, PROFILES, share, gOf, gAt, power, rangeOf, sizeOf, blocked, inZone, hyp, hyp3, clamp };
}, {"./math":"src/math.js","./data":"src/data.js","./rules":"src/rules/index.js","../data/profiles.json":"data/profiles.json","./rules/saltRing":"src/rules/saltRing.js"}];
D["src/data.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 데이터 읽기 (data/)
 * 마법은 원소마다 한 파일(data/spells/*.json). 판의 결과가 덱·자유 덱의 차례에 기대므로 마법의 차례는 data/spells/order.json이 정한다.
 * 차례 목록에 없는 새 마법은 아래 파일 차례대로 뒤에 붙는다(그래서 새 마법을 넣을 때 order.json을 안 고쳐도 된다).
 * 파일 목록은 require를 그대로 적어 둔다: 샌드박스 묶음(pack)이 이것을 보고 함께 싼다 */
const FILES = [require('../data/spells/불.json'), require('../data/spells/번개.json'), require('../data/spells/흙.json'), require('../data/spells/물.json'),
  require('../data/spells/얼음.json'), require('../data/spells/독.json'), require('../data/spells/없음.json'), require('../data/spells/신호.json'), require('../data/spells/빛.json')];
const ORDER = require('../data/spells/order.json');
function spells() {
  const all = {}; for (const f of FILES) Object.assign(all, f);
  const out = {}; for (const n of ORDER) if (all[n]) out[n] = all[n];
  for (const n in all) if (!(n in out)) out[n] = all[n];
  return out;
}
module.exports = { SPELLS: spells(), BOOKS: require('../data/books.json'), DECKS: require('../data/decks.json'), TIERS: require('../data/tiers.json'), SKILLS: require('../data/skills.json'), GEAR: require('../data/gear.json') };
}, {"../data/spells/불.json":"data/spells/불.json","../data/spells/번개.json":"data/spells/번개.json","../data/spells/흙.json":"data/spells/흙.json","../data/spells/물.json":"data/spells/물.json","../data/spells/얼음.json":"data/spells/얼음.json","../data/spells/독.json":"data/spells/독.json","../data/spells/없음.json":"data/spells/없음.json","../data/spells/신호.json":"data/spells/신호.json","../data/spells/빛.json":"data/spells/빛.json","../data/spells/order.json":"data/spells/order.json","../data/books.json":"data/books.json","../data/decks.json":"data/decks.json","../data/tiers.json":"data/tiers.json","../data/skills.json":"data/skills.json","../data/gear.json":"data/gear.json"}];
D["src/index.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 v2.37.0 — 바깥으로 내보내는 API
 * Node: const A = require('./src')   브라우저: 전역 Arena (sandbox/arena.js 묶음, node cli.js pack)
 * 데이터(마법·마법책·덱·등급·판단 수준·장비)는 data/에 JSON으로 있다. 판단 수준은 brain/skills.js, 행동 지표는 metrics/look.js */
const core = require('./core'), brain = require('./brain'), makeRegistry = require('./registry');
const D = require('./data'), { SKILLS, CIRCLES } = require('./brain/skills'), { look } = require('../metrics/look');

// 3판 등급표를 그대로 옮긴 사람 규격 (data/tiers.json)
const TIERS = D.TIERS;
// 덱 (data/decks.json) + 자유(금지·평범 마법을 뺀 모든 마법) + 원소별 기본 마법책 (data/books.json)
// 큰 마법 셋은 rules.risk일 때만, 몸 묶기 다섯은 rules.bodyBind일 때만, 도발은 rules.taunt일 때만 책에 남는다
const DECKS = Object.assign({}, D.DECKS, { '자유': Object.keys(core.SPELLS).filter(n => !core.SPELLS[n].banned && !core.SPELLS[n].mundane) }, D.BOOKS);
const BRAINS = { '기본': brain };
const register = makeRegistry(core, { TIERS, DECKS, BRAINS });

// lib: 장면이 마법·덱을 덮을 때 넘긴다. 없으면 기본값
function mage(opt = {}, lib = {}) {
  const SP = lib.spells || core.SPELLS, DK = lib.decks || DECKS;
  const t = TIERS[opt.tier || '평범']; if (!t) throw new Error('없는 등급: ' + opt.tier);
  const book = opt.book || DK[opt.deck || '합법 최강']; if (!book) throw new Error('없는 덱: ' + opt.deck);
  const br = opt.brain ? BRAINS[opt.brain] : null; if (opt.brain && !br) throw new Error('없는 두뇌: ' + opt.brain);
  const sk = opt.skill ? SKILLS[opt.skill] : null; if (opt.skill && !sk) throw new Error('없는 판단 수준: ' + opt.skill + ' (' + Object.keys(SKILLS).join(', ') + ')');
  if (opt.type && !core.TYPES.includes(opt.type)) throw new Error('없는 부류: ' + opt.type + ' (' + core.TYPES.join(', ') + ')');
  // 선호 거리: 공격 마법 사거리의 가운데값에 맞춘다 (덱과 거리가 어긋나 아무것도 못 쏘는 일을 막는다)
  // 규칙에 딸린 마법(큰 마법 등)은 선호 거리에 넣지 않는다: 그 규칙이 꺼져 있을 때 예전과 같게
  const Rs = book.map(n => SP[n]).filter(x => x && !x.rule && ['proj', 'thread', 'area', 'lob', 'cone', 'touch'].includes(x.t)).map(x => x.t === 'cone' ? x.L : x.t === 'touch' ? 1.2 : (x.home ? 10 : x.R)).sort((a, b) => a - b);
  const prefR = Rs.length ? core.clamp(Rs[Math.floor(Rs.length / 2)] * 0.5, 2.5, 10) : 7;
  return Object.assign({
    name: opt.name, book: book.slice(), C: t.C, circles: sk ? CIRCLES[opt.skill](t.circles) : t.circles, noise: sk ? sk.noise : t.noise, dec: sk ? sk.dec : t.dec, autoDodge: sk ? sk.autoDodge : t.autoDodge, skill: opt.skill,
    gear: Object.assign({}, D.GEAR.default, opt.gear), mast: Object.fromEntries(book.map(n => [n, t.mast])),
    hitEst: opt.hitEst || {}, tac: Object.assign({ prefR }, t.tac, sk && sk.tac, opt.tac), brain: br || undefined, type: opt.type || '메타',
  }, opt.spec);
}

// 편들을 세계에 놓는다. layout: 'lines'(양쪽 줄), 'ring'(첫 편의 첫 사람을 가운데, 나머지가 둘러쌈)
// 편이 셋 이상이고 'ring'이 아니면 둘레에 고루 놓는다. at[s][k]에 x, y가 있으면 그 자리가 이긴다
function place(W, teams, layout, at = []) {
  const cx = W.width / 2, cy = W.height / 2, put = (s, side, k, x, y) => { const p = at[side] && at[side][k]; const m = core.addMage(W, s, side, p && p.x != null ? p.x : x, p && p.y != null ? p.y : y); m._ref = [side, k]; return m; };
  if (layout === 'ring') {
    W.obs = W.obs.filter(o => core.hyp(o.x - cx, o.y - cy) > 3);
    teams[0].forEach((s, k) => put(s, 0, k, cx + k * 1.2, cy));
    const rest = []; teams.slice(1).forEach((tm, j) => tm.forEach((s, k) => rest.push([s, j + 1, k])));
    rest.forEach(([s, side, kk], k) => { const a = k / rest.length * 6.2832 + W.rnd(-0.1, 0.1), r = 6 + W.rnd(0, 3) + (k % 3) * 1.2; put(s, side, kk, core.clamp(cx + core.cos(a) * r, 1, W.width - 1), core.clamp(cy + core.sin(a) * r, 1, W.height - 1)); });
  } else if (teams.length <= 2) {
    const col = (team, side, x) => team.forEach((s, k) => { const n = team.length, rows = Math.ceil(n / Math.max(1, Math.floor((W.height - 2) / 1.6))); const perCol = Math.ceil(n / rows); const c = Math.floor(k / perCol), r = k % perCol; put(s, side, k, x + (side ? 1 : -1) * c * 1.4, core.clamp(cy + (r - (perCol - 1) / 2) * Math.min(3.2, (W.height - 2) / perCol), 1, W.height - 1)); });
    col(teams[0] || [], 0, 6); col(teams[1] || [], 1, W.width - 6);
  } else {
    const R = Math.min(W.width, W.height) * 0.38;
    teams.forEach((tm, side) => { const a = side / teams.length * 6.2832, px = -core.sin(a), py = core.cos(a); tm.forEach((s, k) => { const off = (k - (tm.length - 1) / 2) * 1.4; put(s, side, k, core.clamp(cx + core.cos(a) * R + px * off, 1, W.width - 1), core.clamp(cy + core.sin(a) * R + py * off, 1, W.height - 1)); }); });
  }
}

// 결투장 넓이 (SPEC 24장): 비행이 켜졌고 대마법사(C ≥ 10)가 끼면, 넓이를 주지 않았을 때 200 × 150 m
const FL = require('./rules/flight').api.F;
function arena(o, rules, specs) {
  if (o.width != null || o.height != null || !((rules && rules.flight != null) ? rules.flight : core.DEFAULT_RULES.flight) || !specs.some(s => (s.C ?? 1) >= FL.arenaC)) return o;
  return { width: FL.arena[0], height: FL.arena[1] };
}
// 두 편의 싸움
function battle(teamA, teamB, opt = {}) {
  const A = arena(opt, opt.rules, teamA.concat(teamB));
  const W = core.createWorld({ seed: opt.seed, rules: opt.rules, record: opt.record, recEvery: opt.recEvery, maxT: opt.maxT, width: A.width, height: A.height, obstacles: opt.obstacles, brain });
  place(W, [teamA, teamB], opt.layout);
  return core.run(W);
}
const duel = (a, b, opt) => battle([a], [b], opt);

/* ---------------- 장면 (SPEC 19장) ---------------- */
// 장면의 한 사람 → 사람 규격. 비워 둔 칸은 등급의 값을 따른다
const OVERRIDE = ['C', 'circles', 'noise', 'dec', 'autoDodge', 'hp', 'z'];
function sceneMage(mm, side, lib) {
  const sp = mage({ tier: mm.tier, deck: mm.deck, book: mm.book, name: mm.name, gear: mm.gear, tac: mm.tac, brain: mm.brain || side.brain, type: mm.type, skill: mm.skill }, lib);
  for (const k of OVERRIDE) if (mm[k] != null && mm[k] !== '') sp[k] = k === 'autoDodge' ? !!mm[k] : +mm[k];
  return sp;
}
function sceneLib(sc) { return { spells: Object.assign({}, core.SPELLS, sc.spells), decks: Object.assign({}, DECKS, sc.decks) }; }
// 장면 → 첫 걸음 전의 세계. opt.record: 녹화
function sceneWorld(sc, opt = {}) {
  const lib = sceneLib(sc), sides = sc.sides || [], specs = sides.map((s, i) => s.mages.map((mm, k) => { const sp = sceneMage(mm, s, lib); if (sp.name == null) sp.name = (s.name || '편' + i) + (k + 1); return sp; }));
  const A = arena(sc, sc.rules, [].concat(...specs));
  const W = core.createWorld({ seed: sc.seed, rules: sc.rules, record: opt.record, recEvery: opt.recEvery || sc.recEvery, maxT: sc.maxT, timeWin: sc.timeWin, closed: sc.closed, width: A.width, height: A.height, obstacles: sc.obstacles, barrels: sc.barrels, walls: sc.walls, salt: sc.salt, spells: lib.spells, brain });
  place(W, specs, sc.layout, sides.map(s => s.mages));
  return W;
}
const runScene = (sc, opt) => core.run(sceneWorld(sc, opt));
// viewer.html이 읽는 녹화 형식 (cli.js replay와 같다)
function recording(W) {
  const r = core.result(W), done = core.over(W);
  return { v: core.VERSION, dt: W._recN * W.dt, names: W.ms.map(m => m.name), sides: W.ms.map(m => m.side), hpMax: W.ms.map(m => m.hpMax), winner: done ? r.winner : -1, t: r.t, obs: W.obs, frames: W.rec || [] };
}

// 판이 끝난 뒤 맞힘 기록을 사람 규격에 되먹인다 (결투자가 배우는 몫)
function learn(spec, m, rate = 0.3) {
  for (const n of Object.keys(m.log.casts)) { const c = m.log.casts[n], h = m.log.hits[n] || 0; spec.hitEst[n] = (spec.hitEst[n] ?? 0.35) * (1 - rate) + rate * Math.min(1, h / c); }
  return spec;
}

module.exports = Object.assign({}, core, { brain, TIERS, DECKS, BRAINS, SKILLS, CIRCLES, register, mage, place, battle, duel, look, sceneWorld, runScene, recording, learn, scenario: require('./scenario') });
}, {"./core":"src/core.js","./brain":"src/brain/index.js","./registry":"src/registry.js","./data":"src/data.js","./brain/skills":"src/brain/skills.js","../metrics/look":"metrics/look.js","./rules/flight":"src/rules/flight.js","./scenario":"src/scenario.js"}];
D["src/math.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 결정론 수학 (SPEC 20장)
 * Math.pow·sin·cos·atan2·hypot은 JS 엔진마다(같은 V8이라도 판마다) 마지막 자리가 다르다. 그 차이가 수천 걸음 뒤 판을 가른다.
 * 그래서 IEEE 754가 결과를 하나로 정한 연산(사칙연산, sqrt, round)만으로 계산한다. 정밀도는 1e-15 안팎.
 * 엔진 안에서는 Math의 위 함수들을 쓰지 않는다 (시험이 본다). */
const PIO2 = 1.5707963267948966, PIO2_HI = 1.5707963267341256, PIO2_LO = 6.077100506506192e-11;
const LN2_HI = 6.93147180369123816490e-01, LN2_LO = 1.90821492927058770002e-10, SQRT2 = Math.sqrt(2);
const series = (n, f) => { const c = []; for (let k = 0; k < n; k++) c.push(f(k)); return c; };
const horner = (c, z) => { let v = c[c.length - 1]; for (let k = c.length - 2; k >= 0; k--) v = v * z + c[k]; return v; };
let fac = 1; const FACT = series(24, k => (fac = k ? fac * k : 1));
const SINC = series(9, k => (k % 2 ? 1 : -1) / FACT[2 * k + 3]), COSC = series(9, k => (k % 2 ? -1 : 1) / FACT[2 * k + 4]);   // r³부터, r⁴부터
const ATNC = series(13, k => (k % 2 ? 1 : -1) / (2 * k + 3)), EXPC = series(18, k => 1 / FACT[k + 2]), LOGC = series(11, k => 1 / (2 * k + 3));
const P2 = new Map(); for (let k = 0, v = 1, u = 1; k <= 1023; k++, v *= 2, u /= 2) { P2.set(k, v); P2.set(-k, u); }
function sincos(x, wantCos) {
  if (!isFinite(x)) return NaN;
  const k = Math.round(x / PIO2), r = (x - k * PIO2_HI) - k * PIO2_LO, z = r * r, q = ((k % 4) + 4) % 4;
  const s = r + r * z * horner(SINC, z), c = 1 - z / 2 + z * z * horner(COSC, z), i = wantCos ? (q + 1) % 4 : q;
  return i === 0 ? s : i === 1 ? c : i === 2 ? -s : -c;
}
const sin = x => sincos(x, false), cos = x => sincos(x, true);
function atan(x) {
  if (x !== x) return NaN; if (x < 0) return -atan(-x); if (x > 1) return PIO2_HI - (atan(1 / x) - PIO2_LO);
  const t = x / (1 + Math.sqrt(1 + x * x)), u = t / (1 + Math.sqrt(1 + t * t)), z = u * u;   // atan x = 4 atan u, |u| ≤ tan(π/16)
  return 4 * (u + u * z * horner(ATNC, z));
}
function atan2(y, x) {
  if (x !== x || y !== y) return NaN;
  if (x > 0) return atan(y / x); if (x < 0) return y >= 0 ? atan(y / x) + Math.PI : atan(y / x) - Math.PI;
  return y > 0 ? PIO2 : y < 0 ? -PIO2 : 0;
}
function exp(x) {
  if (x !== x) return NaN; if (x > 709.78) return Infinity; if (x < -745.2) return 0;
  const k = Math.round(x / LN2_HI), r = (x - k * LN2_HI) - k * LN2_LO, v = 1 + r + r * r * horner(EXPC, r);
  return k > 1023 ? v * P2.get(1023) * P2.get(k - 1023) : k < -1022 ? v * P2.get(-1022) * P2.get(k + 1022) : v * P2.get(k);
}
function log(x) {
  if (x !== x || x < 0) return NaN; if (x === 0) return -Infinity; if (x === Infinity) return x;
  let e = 0, m = x; while (m >= 2 ** 64) { m /= 2 ** 64; e += 64; } while (m < 2 ** -64) { m *= 2 ** 64; e -= 64; }
  while (m >= SQRT2) { m /= 2; e++; } while (m < SQRT2 / 2) { m *= 2; e--; }
  const s = (m - 1) / (m + 1), z = s * s;
  return e * LN2_HI + (e * LN2_LO + 2 * (s + s * z * horner(LOGC, z)));
}
function pow(x, y) {
  if (y === 0) return 1; if (x === 1) return 1; if (x !== x || y !== y) return NaN;
  if (x === 0) return y > 0 ? 0 : Infinity;
  if (x < 0) { if (Math.round(y) !== y) return NaN; const v = exp(y * log(-x)); return Math.abs(y % 2) === 1 ? -v : v; }
  return exp(y * log(x));
}
const hyp = (x, y) => Math.sqrt(x * x + y * y);
const hyp3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);   // 높이를 넣은 거리 (z = 0이면 hyp와 비트까지 같다)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

module.exports = { sin, cos, atan, atan2, exp, log, pow, hyp, hyp3, clamp, mulberry32, horner };
}, {}];
D["src/registry.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 등록 v2.37.0
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
}, {"./rules":"src/rules/index.js"}];
D["src/rules/army.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 군대 (rules.army, v2.0 둘째 묶음, SPEC 25장, 수는 data/rules/army.json)
 * 머스킷(이 규칙이 켜진 세계에선 2판의 수): 장전 15~20 s(쏠 때마다 뽑는다), 화승 점화 지연 0.1~0.5 s(예비동작에 더한다),
 *   사거리 100 m, 흔들림 = 0.004 + 0.0004 × 거리(rad: 50 m에서 ±1.2 m, 100 m에서 ±4.4 m). 두뇌가 겨눈 자리를 흐리지 않는다(총이 흔든다)
 * 박격포(마법 '박격포', 규칙에 딸림): 높이 쏘아 벽 너머에 떨어뜨린다(곡사 3 s, 반지름 2.5 m, 90, 벽 600). 겨눈 자리 ± max(5 m, 5% × 거리)
 * 돌아가며 쏘기(tac.volley = 줄 수 n): 사람마다 줄 번호(id mod n), 17.5/n s마다 한 줄씩 쏜다
 * 탄 낭비 금지: 과녁이 2 m 넘게 떠 있고 50 m 넘게 멀면 쏘지 않는다 */
const A = require('../../data/rules/army.json');
module.exports = {
  name: 'army', switch: 'army', on: W => W.rules.army, api: { A },
  engine: () => ({
    init(W) { const s = W.spells['머스킷']; if (s) W.spells['머스킷'] = Object.assign({}, s, A.musket); },   // 이 세계의 머스킷만 바꾼다 (원본 데이터는 그대로)
    release(W, m, c) { const r = c.s.reload; if (r) m.cd[c.s.n] = W.rnd(r[0], r[1]); },   // 장전
  }),
  brain: () => ({
    commit(W, m, K, best, cast) {
      const s = best.s; if (!s.mundane) return;
      cast.tx = best.tx; cast.ty = best.ty;   // 총은 두뇌가 흐리지 않는다 (흔들림은 총이, core)
      if (s.fuse) cast.T += W.rnd(0, s.fuse[1] - s.fuse[0]);   // 화승 점화 지연
      if (s.t === 'lob') { const d = Math.max(A.mortar.min, Math.sqrt((best.tx - m.x) * (best.tx - m.x) + (best.ty - m.y) * (best.ty - m.y)) * A.mortar.spread); cast.tx += W.rnd(-d, d); cast.ty += W.rnd(-d, d); }   // 박격포는 ± max(5 m, 5% × 거리)
    },
    value(W, m, K, o) {
      const s = o.s; if (!s.mundane || !(o.v > 0)) return;
      const n = m.tac.volley; if (n > 1 && s.t === 'proj' && m.id % n !== Math.floor(W.t / (A.volleyT / n)) % n) { o.v = 0; return; }   // 제 줄 차례가 아니다
      if (K.e.z >= A.farFly.z && K.d > A.farFly.d) o.v = 0;   // 멀리 떠 있는 과녁에 탄을 버리지 않는다
    },
  }),
};
}, {"../../data/rules/army.json":"data/rules/army.json"}];
D["src/rules/artillery.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 포병과 소금 탄 (rules.artillery, v2.31, SPEC 54장, 수는 data/rules/artillery.json, 마법은 data/spells/없음.json의 산탄·둥근 탄·소금 탄) — 기본 꺼짐
 * WORLD 5-1 "대포는 마법사 사냥꾼", 4-5 대마법사가 못 하는 것: 대포알 막기(마법이 아니라 장악권이 못 빼앗는다)
 * 청동포(장면의 tac.gun, 덱 '청동포', 체력 gun.hp): 포수(tac.crew, 덱 '포수')가 곁(crewR m)에 있어야 쏘고 끌고 간다.
 *   쓰러지거나 달아난 포수 자리는 곁(crew.fill m)의 머스킷 병이 채운다(v2.32). 흙 가마니(장면의 낮은 흙벽, 포 앞에 포신 자리를 비운 줄)가 포수를 직사·실에서 가린다
 *   다시 채우기 reload s × crew / 곁의 포수(셋 다 함께 돈다), 걸음 × speed × 곁의 포수 / crew. 구르지 않고 달아나지 않는다. 포수가 모두 쓰러지거나 달아나면 버려진다(빠진 것으로 센다)
 *   산탄(틀 canister): 불을 댈 때 과녁을 따라 돌려(앞질러) 과녁 높이로 들어(앙각 elev 한도) 쇠공 n개가 반각 half rad의 원뿔로(옆·위아래) 포구(muzzle m)에서.
 *     공 하나는 머스킷 탄쯤(60). 앙각보다 높이 나는 과녁엔 닿지 않는다. 석회 방패는 공의 1 − pierce를 막는다
 *   둥근 탄(proj, pierce): 맞으면 치명(300). 방패가 못 막는다. 벽을 부순다(800). 겨눈 곳으로 곧게 가서 움직이는 과녁은 거의 못 맞힌다
 *   소금 탄(틀 saltshell): 거리 ÷ salt.v s(tMin~tMax) 날아가 떨어지면 반지름 salt.r m의 소금 안개가 salt.t s 선다(지대 'saltfog', 비가 씻어낸다). 겨눈 자리 ± max(min, spread × 거리)
 * 소금 안개(높이 salt.h m까지): 그 안에선 마법이 서지 않고(서는 자리·시전자가 안개 안이면 흩어진다), 안에 선 사람의 장악권이 꺼진다(다른 자리를 다투지 않는다).
 *   안개 안에서 날던 사람은 떨어지고, 몸에 건 마법(석회 방패·빠르기…)이 흩어진다
 * 포는 마법 피해 × gun.magicK, 한 번에 gun.magicCap까지(청동). 판단 수준의 캔슬을 쓰지 않는다(과녁이 굴러도 쏜다)
 * 두뇌
 *   포: 가장 선명한 적을 노린다. 소금 탄(1.3)은 선명도 2 이상의 과녁(아직 안개 밖, 다른 포의 소금이 오지 않을 때)에, 둥근 탄(1.2)은 거의 선 과녁(slowV m/s 아래)에,
 *     산탄은 앙각 안의 과녁에(소금 안개 안 1.6, close m 안 1.1, 밖 0.5). 우리 편이 원뿔·사선에 있으면 쏘지 않는다
 *   포수: 포 뒤(과녁 반대쪽) post m에 선다
 *   대마법사(선명도 arch.cMin 이상): 소금 안개를 피하고, 나를 겨눠 다 채운 포(warn s 안에 풀린다)의 사선에서 옆으로 비키고, 곁(hunt m)의 포수부터 노린다
 *   마법을 쓰는 누구나 소금 안개 안이면 밖으로 나간다 */
const P = require('../../data/rules/artillery.json'), G = P.gun, { hyp, atan2 } = require('../math');
const LANE = require('./fireLane').api.lane;
const GUNS = { 산탄: 1, '둥근 탄': 1, '소금 탄': 1 };
const ST = new WeakMap(), HOLD = new WeakMap();   // HOLD: 시전 → 늦춘 시간
   // 세계 → { guns: [], crew: Map(포수 → 포), n: Map(포 → 곁의 포수 수), fog: 안개 수, last: 센 걸음 }
const isGun = m => !!m.tac.gun, isCrew = m => !!m.tac.crew;
function stOf(W) {
  let S = ST.get(W); if (S) return S; S = { guns: [], crew: new Map(), n: new Map(), fog: 0, filled: 0 }; ST.set(W, S);
  for (const m of W.ms) if (isGun(m)) { S.guns.push(m); S.n.set(m, 0); }
  const left = new Map(S.guns.map(g => [g, G.crew]));   // 포수는 가까운 포에 (포마다 crew명까지)
  for (const m of W.ms) { if (!isCrew(m)) continue; let b = null, bd = 1e9; for (const g of S.guns) if (g.side === m.side && left.get(g) > 0) { const d = hyp(g.x - m.x, g.y - m.y); if (d < bd) { bd = d; b = g; } } if (b) { S.crew.set(m, b); left.set(b, left.get(b) - 1); } }
  return S;
}
// 이 과녁 둘레에 소금이 이미 오는가: 같은 편 포가 소금 탄을 짓는 중이거나 날아가는 소금 탄
function saltComing(W, m, e) { for (const g of W.ms) if (g !== m && g.side === m.side && g.hp > 0 && g.cast && g.cast.s.n === '소금 탄') return true;
  for (const l of W.lobs) if (l.src.side === m.side && l.s.n === '소금 탄' && hyp(l.x - e.x, l.y - e.y) < P.salt.r * 2) return true; return false; }
// 포수 채우기: 포에 붙은 포수(살아 있고 달아나지 않은)가 crew보다 적으면 곁(crew.fill m)의 머스킷 병을 가까운 차례로 포수로 (tac.crew, 그 포에 붙는다)
function fill(X, W, S, g) {
  let k = 0; for (const [c, gg] of S.crew) if (gg === g && c.hp > 0 && !c.flee) k++;
  let got = false; while (k < G.crew) { let b = null, bd = P.crew.fill; for (const q of W.ms) { if (q.side !== g.side || !(q.hp > 0) || q.flee || q.tac.gun || q.tac.crew || q.book.indexOf('머스킷') < 0) continue; const d = X.hyp(q.x - g.x, q.y - g.y); if (d < bd) { bd = d; b = q; } }
    if (!b) return got; b.tac.crew = 1; S.crew.set(b, g); S.filled++; k++; got = true; }
  return got;
}
const fogs = W => { let n = 0; for (const z of W.zones) if (z.k === 'saltfog') n++; return n; };
function inFog(W, x, y, z) { if (z >= P.salt.h) return false; for (const f of W.zones) if (f.k === 'saltfog' && hyp(x - f.x, y - f.y) < f.r) return true; return false; }
// 산탄의 원뿔(반각 + 여유) 안의 우리 편
function coneAlly(W, m, tx, ty) {
  const a = atan2(ty - m.y, tx - m.x), R = 300; for (const q of W.ms) { if (q === m || q.side !== m.side || !(q.hp > 0) || q.z >= 6) continue;
    const dx = q.x - m.x, dy = q.y - m.y, d = hyp(dx, dy); if (d < 0.5 || d > R) continue; let da = Math.abs(atan2(dy, dx) - a); if (da > Math.PI) da = 2 * Math.PI - da; if (da < P.canister.half * 1.5 + (q.r + 0.3) / d) return true; }
  return false;
}
module.exports = {
  name: 'artillery', switch: 'artillery', form: { canister: 'self', saltshell: 'self' }, threat: { canister: 1 }, api: { P, stOf, inFog, coneAlly, isGun, isCrew },
  engine: X => ({
    world(W) {
      const S = stOf(W); S.fog = fogs(W);
      for (const g of S.guns) { if (!(g.hp > 0)) continue; let n = 0, any = false;
        for (const [c, gg] of S.crew) if (gg === g && c.hp > 0 && !c.flee) { any = true; if (X.hyp(c.x - g.x, c.y - g.y) < G.crewR) n++; }
        S.n.set(g, n); g.flee = 0;   // 포는 달아나지 않는다
        if (P.crew.fill > 0 && (!any || W.step % P.crew.every === 0) && fill(X, W, S, g)) any = true;   // 쓰러진 포수 자리를 곁의 머스킷 병이 채운다 (v2.32)
        if (!any) { g.alog.fled = 1; g.hp = 0; g.deathT = W.t; g.cast = null; } }   // 포수가 모두 없으면 버려진다
      if (S.fog) for (const m of W.ms) { if (!(m.hp > 0) || !inFog(W, m.x, m.y, m.z)) continue;
        if (W.rules.flight && (m.fly === 1 || m.fly === 3)) { m.fly = 2; m.fallZ = m.z; if (m.vz > 0) m.vz = 0; }   // 안개 안에선 날 수 없다
        const b = m.buf; for (const k in b) if (b[k]) b[k] = null; }   // 몸에 건 마법(석회 방패·빠르기…)이 흩어진다
    },
    speed(W, m, sp) { if (!isGun(m)) return sp; const n = stOf(W).n.get(m) || 0; return sp * G.speed * n / G.crew; },
    roll(W, m, o) { if (isGun(m)) o.skip = true; },
    // 쏘기 직전에 원뿔·사선을 다시 본다: 우리 편이 들어왔으면 hold s까지 늦추고, 넘으면 거둔다 (rules/fireLane과 같은 뜻, 포는 늘)
    mageStep(W, m) { if (!isGun(m)) return; const c = m.cast; if (!c || !GUNS[c.s.n] || c.s.t === 'saltshell' || c.t + W.dt < c.T) return;
      const q = c.tgt && c.tgt.hp > 0 ? c.tgt : null, x = q ? q.x : c.tx, y = q ? q.y : c.ty; if (!(c.s.t === 'canister' ? coneAlly(W, m, x, y) : LANE(W, m, x, y, c.s.R))) return;
      const h = (HOLD.get(c) || 0) + W.dt; if (h > G.hold) { m.cast = null; return; } HOLD.set(c, h); c.T += W.dt; },
    hurtMod(W, m, v, kind, name, src) { if (!isGun(m) || (W.spells[name] && W.spells[name].mundane)) return v; const x = v * G.magicK; return x < G.magicCap ? x : G.magicCap; },   // 청동은 마법(불·번개·돌)에 거의 다치지 않는다(× magicK, 한 번에 magicCap까지): 포수를 쓰러뜨려야 한다
    release(W, m, c) { if (!GUNS[c.s.n]) return; const n = stOf(W).n.get(m) || 0, t = G.reload * G.crew / (n > 0 ? n : 1); for (const k in GUNS) m.cd[k] = t; },
    gate(W, m, s, tx, ty) { if (s.mundane || !stOf(W).fog) return false; if (inFog(W, m.x, m.y, m.z)) return true; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return inFog(W, p[0], p[1], 0); },
    share(W, m, x, y, f) {
      if (!stOf(W).fog || f >= 1) return f; const foes = W.foes[m.side]; let any = false; for (const q of foes) if (inFog(W, q.x, q.y, q.z)) { any = true; break; } if (!any) return f;
      const L = W.rules.domainL, Rr = W.rules.domainR, mine = X.sigOf(W, m) / (1 + X.hyp(x - m.x, y - m.y) / L); let other = 0;   // 안개 안의 적은 다투지 않는다 (core share와 같은 셈)
      for (const q of foes) { if (inFog(W, q.x, q.y, q.z)) continue; const dq = X.hyp(x - q.x, y - q.y); if (Rr > 0 && dq > Rr * q.C) continue; other += X.sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + dq / L); }
      return mine / (mine + other);
    },
    lobLand(W, l) { if (l.s.n !== '소금 탄') return; X.addZone(W, l.src, { k: 'saltfog', n: '소금 안개', shape: 'circle', r: P.salt.r, d: P.salt.t, dps: 0 }, l.x, l.y, 0, 1); },
    track(W, m, c) { const q = c.tgt; if (!q || !(q.hp > 0)) return;
      if (c.s.n === '둥근 탄') { if (X.hyp(q.vx, q.vy) < P.round.slowV) { c.tx = q.x; c.ty = q.y; } return; }   // 둥근 탄: 거의 선 과녁이면 불을 댈 때 그 자리에 바로 댄다(떠서 멈춘 과녁은 300 m에서도 맞는다, v2.33). 움직이면 겨눈 곳 그대로
      if (c.s.t !== 'canister') return; const f = X.hyp(q.x - m.x, q.y - m.y) / c.s.v; c.tx = q.x + q.vx * f; c.ty = q.y + q.vy * f; },   // 산탄은 불을 댈 때 과녁을 따라 돌린다(앞질러)
    wallHit(W, p, o, wd) { return p.s.n === '둥근 탄' ? p.s.wallDmg : wd; },
  }),
  types: X => ({
    canister(W, m, c, a) {
      const s = c.s, n = P.canister.n, z = m.z + G.muzzle, life = s.R / s.v, q = c.tgt, d = X.hyp(c.tx - m.x, c.ty - m.y) || 1;
      let tz = (q && q.hp > 0 ? q.z : 0) + G.muzzle; if (tz > d * P.canister.elev + z) tz = d * P.canister.elev + z;   // 과녁의 몸 가운데 높이로 들어 겨눈다 (앙각 한도)
      const vz0 = (tz - z) / (d / s.v);
      for (let j = 0; j < n; j++) { const an = a.aim + (W.rng() - 0.5) * 2 * P.canister.half, vz = vz0 + (W.rng() - 0.5) * 2 * P.canister.half * s.v;   // 옆으로도 위아래로도 퍼진다
        W.proj.push({ x: m.x, y: m.y, vx: X.cos(an) * s.v, vy: X.sin(an) * s.v, z, vz, home: s.home, life, s, src: m, pow: 1, rad: s.rad, t0: W.t }); }
    },
    // 소금 탄: 거리 ÷ salt.v s(tMin~tMax) 날아가 떨어진다 (곡사와 같은 칸, 떨어지면 lobLand가 안개를 세운다)
    saltshell(W, m, c, a) { const d = X.hyp(c.tx - m.x, c.ty - m.y), t = d / P.salt.v; W.lobs.push({ x: c.tx, y: c.ty, t: t < P.salt.tMin ? P.salt.tMin : t > P.salt.tMax ? P.salt.tMax : t, s: c.s, src: m, pow: 1, r: c.s.r }); },
  }),
  brainTypes: () => ({ canister(W, m, K, o) { o.v = 0; }, saltshell(W, m, K, o) { o.v = 0; } }),   // 값은 valueLate (포의 두뇌)
  brain: B => {
    const C = B.C, hyp = B.hyp;
    return {
      aim(W, m, K) {
        const S = stOf(W);
        if (isGun(m)) { let e = null; for (const q of K.foes) if (q.hp > 0 && !q.flee && (!e || q.C > e.C)) e = q; if (e) K.e = e; return; }   // 포: 가장 선명한 적
        if (m.C < P.arch.cMin || !S.guns.length) return;   // 대마법사: 곁의 포수부터
        let b = null, bd = P.arch.hunt; for (const [c, g] of S.crew) if (c.side !== m.side && c.hp > 0 && !c.flee && g.hp > 0) { const d = hyp(c.x - m.x, c.y - m.y); if (d < bd) { bd = d; b = c; } }
        if (b) K.e = b;
      },
      valueLate(W, m, K, o) {
        const s = o.s; if (!GUNS[s.n] || !isGun(m)) return; const e = K.e, S = stOf(W);
        if (!e || !(S.n.get(m) > 0) || !K.los) { o.v = 0; return; }
        const d = K.d, sp = hyp(e.vx, e.vy);
        if (s.n === '산탄') { o.v = e.z <= d * P.canister.elev + G.muzzle + 1 && d <= Math.min(s.R, P.canister.far) && !coneAlly(W, m, e.x, e.y) ? (inFog(W, e.x, e.y, e.z) ? 1.6 : d <= P.canister.close ? 1.1 : 0.5) : 0; return; }   // far m 밖으론 아껴 둔다 (v2.33: 다시 채우는 데 30 s)   // 앙각 안의 과녁: 소금 안개 안(방패·날기가 꺼졌다)이면 먼저, 가까우면(close m)
        if (s.n === '소금 탄') { o.v = e.C >= 2 && d >= P.salt.minD && d <= s.R && !inFog(W, e.x, e.y, 0) && !saltComing(W, m, e) ? 1.3 : 0; if (o.v) { const f = d / P.salt.v; o.tx = e.x + e.vx * f * P.salt.lead; o.ty = e.y + e.vy * f * P.salt.lead; } return; }   // 다른 포가 소금을 쏘는 중이거나 날아가는 중이면 산탄
        o.v = (sp < P.round.slowV ? 1.2 : d <= P.round.moveD ? 0.3 : 0) * (LANE(W, m, e.x, e.y, s.R) ? 0 : 1);   // 움직이는 과녁엔 moveD m 안에서만 (v2.33: 멀리서 헛쏘고 30 s를 비우지 않는다)   // 둥근 탄: 거의 선 과녁(짓기·모으기·떠 있기)이면 한 방. 사선에 우리 편이면 쏘지 않는다 (rules/fireLane의 셈)
      },
      commit(W, m, K, best, cast) { if (best.s.n !== '소금 탄') return; const d = Math.max(P.salt.min, hyp(best.tx - m.x, best.ty - m.y) * P.salt.spread); cast.tx += W.rnd(-d, d); cast.ty += W.rnd(-d, d); },   // 소금 탄은 ± max(min, spread × 거리)
      steer(W, m, K) {
        const S = stOf(W);
        if (isGun(m)) { const e = K.e; if (e && K.d > 250) return; K.vx = 0; K.vy = 0; return; }   // 포는 닿으면 선다
        const g = S.crew.get(m); if (g && g.hp > 0 && !m.flee) { const e = g._k && g._k.e; let ux = 0, uy = 0; if (e) { const dx = g.x - e.x, dy = g.y - e.y, l = hyp(dx, dy) || 1; ux = dx / l; uy = dy / l; }   // 포수: 포 뒤
          const sd = ((m.id % 4) - 1.5) * P.crew.side, tx = B.C.clamp(g.x + ux * P.crew.post - uy * sd, 1, W.width - 1), ty = B.C.clamp(g.y + uy * P.crew.post + ux * sd, 1, W.height - 1),   // 판 안의 자리
            dx = tx - m.x, dy = ty - m.y, l = hyp(dx, dy); if (l > P.crew.stay) { K.vx = dx / l * Math.min(3, l); K.vy = dy / l * Math.min(3, l); } else { K.vx = 0; K.vy = 0; } return; }   // 자리 둘레 stay m 안이면 선다 (과녁이 돌면 포 뒤도 돈다: 쫓으면 흔들린다)
        if (K.dodge || m.flee) return;
        if (S.fog && m.C >= 0.9 && m.book.some(n => W.spells[n] && !W.spells[n].mundane)) for (const f of W.zones) { if (f.k !== 'saltfog') continue; const dx = m.x - f.x, dy = m.y - f.y, l = hyp(dx, dy) || 0.1, pad = m.C >= P.arch.cMin ? P.arch.fogPad : 0.5; if (l < f.r + pad && m.z < P.salt.h) { K.vx = dx / l * 4; K.vy = dy / l * 4; return; } }   // 안개 밖으로
        if (m.C < P.arch.cMin) return;
        for (const g of S.guns) { if (g.side === m.side || !(g.hp > 0)) continue; const c = g.cast; if (!c || c.tgt !== m || c.T - c.t > P.arch.warn) continue;   // 나를 겨눈 포가 곧 풀린다: 사선에서 옆으로
          const dx = m.x - g.x, dy = m.y - g.y, l = hyp(dx, dy) || 1, sg = m.sf || 1; K.vx = -dy / l * P.arch.side * sg; K.vy = dx / l * P.arch.side * sg; return; }
      },
    };
  },
};
}, {"../../data/rules/artillery.json":"data/rules/artillery.json","../math":"src/math.js","./fireLane":"src/rules/fireLane.js"}];
D["src/rules/barrels.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 지렛대 — 화약통 (rules.barrels, 또는 장면이 화약통을 놓으면, SPEC 11장)
 * 불·전기가 닿으면 터져 2.8 m 안에 35(가장자리 절반)와 화상. 두뇌: 적이 통 옆에 서면 통을 친다(lever), 통 3.2 m 안에는 가지 않는다 */
module.exports = {
  name: 'barrels', on: (W, opt) => W.rules.barrels || Array.isArray(opt && opt.barrels),
  engine: X => {
    const { hyp, atan2, hurt } = X;
    function ignite(W, x, y, r, src) {
      for (const b of W.barrels) {
        if (b.ex || hyp(b.x - x, b.y - y) > r + 0.6) continue;
        b.ex = true;
        for (const q of W.ms) { if (q.hp <= 0) continue; const d = hyp(q.x - b.x, q.y - b.y); if (d < 2.8) { hurt(W, q, 35 * (1 - d / 2.8 * 0.5), q === src ? null : src, '화약통', 'fire'); q.st.burn = Math.max(q.st.burn || 0, 2); } }
        if (W.rec) W.fx.push(['b', b.x, b.y, 2.8]); if (src) src.log.barrel++;
        if (src && W.t - (src.lureT ?? -9) < 3 && W.ms.some(q => q.side !== src.side && hyp(q.x - b.x, q.y - b.y) < 2.8)) src.log.lure++;
      }
    }
    return {
      // 세계를 만들 때: 장면이 준 통, 아니면 규칙이 켜졌을 때 씨앗을 따라 다섯
      place(W, opt) {
        if (Array.isArray(opt.barrels)) W.barrels = opt.barrels.map(b => ({ x: b.x, y: b.y, ex: false }));
        else if (W.rules.barrels) for (const [bx, by] of [[0.3, 0.27], [0.7, 0.73], [0.5, 0.5], [0.35, 0.8], [0.65, 0.23]])
          W.barrels.push({ x: bx * W.width + W.rnd(-2, 2), y: by * W.height + W.rnd(-2, 2), ex: false });
      },
      ignite,
      // 불을 뿜는 동안 앞의 통
      chan(W, m, ch) { const s = ch.s; if (s.kind === 'fire') for (const b of W.barrels) if (!b.ex) { const d = hyp(b.x - m.x, b.y - m.y), ang = Math.abs(((atan2(b.y - m.y, b.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < ch.L && ang < 0.45) ignite(W, b.x, b.y, 0.1, m); } },
      // 불 터지는 투사체가 통에 닿았다
      projSub(W, p) { if (p.s.burst && p.s.burst.kind === 'fire') for (const b of W.barrels) if (!b.ex && hyp(b.x - p.x, b.y - p.y) < 0.5) { p.dead = true; X.burst(W, p); break; } },
    };
  },
  brain: B => {
    const { C, hyp } = B;
    return {
      // 통 3.2 m 안에는 가지 않는다
      avoid(W, m, K) { for (const b of W.barrels) if (!b.ex && hyp(b.x - m.x, b.y - m.y) < 3.2) { const l = hyp(m.x - b.x, m.y - b.y) || 1; K.vx += (m.x - b.x) / l * 1.2; K.vy += (m.y - b.y) / l * 1.2; } },
      // 지렛대 (tac.lever): 적이 화약통 옆에 섰으면 불·전기로 통을 친다
      valueMid(W, m, K, o) {
        const s = o.s;
        if (!(K.T.lever && W.barrels.length && (s.t === 'area' || s.t === 'thread' || (s.t === 'zone' && s.z.k === 'fire')) && (s.t === 'thread' || s.kind === 'fire' || s.kind === 'elec' || s.t === 'zone'))) return;
        for (const b of W.barrels) {
          if (b.ex) continue; const db = hyp(b.x - m.x, b.y - m.y); if (db > (o.R || 12) || db < 3.3) continue;
          if (s.t === 'thread' && C.blocked(W, m.x, m.y, b.x, b.y)) continue;
          let nE = 0; for (const q of K.foes) if (hyp(q.x - b.x, q.y - b.y) < 2.6) nE++; if (!nE) continue;
          const vb = 35 * nE * 0.8 / (o.Tw + (s.delay || 0) * 0.5 + 0.3); if (vb > o.v) { o.v = vb; o.tx = b.x; o.ty = b.y; o.barrel = true; }
        }
      },
    };
  },
};
}, {}];
D["src/rules/blueprint.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 청사진 짓기 (rules.blueprint, v2.4, SPEC 28장, 청사진은 data/blueprints.json, 수는 data/rules/blueprint.json)
 * 청사진 = 구조물 배치 묶음(반원 보루·몰이길·덫길·하늘 막기·엄폐 사다리). 마법 '청사진'(틀 blueprint)이 한 번에 짓는다.
 * 여러 칸(서클)으로 한꺼번에: 갈래 수 = min(구조물 수, 서클 − 1(떠 있으면 − 1 더), 적어도 1). 갈래마다 제 출력으로 하나씩 차례로 짓는다(출력·머리 피로·당은 갈래 수만큼 든다).
 *   흙벽(블록 둘, 두께 0.4 m, 1.0 m³): 벽 규칙의 세우는 속도(초당 0.6 m³ × 출력/632 kW, 대마법사 1.7 s). 땅에 서서만, 벽 규칙이 켜져 있어야
 *   석회 기둥: 0.4 s. 함정·지대(하늘 덮개·빙판): 그 마법의 예비동작 시간 뒤 그 마법을 그 자리에 푼다(책에 있어야, 방출은 core release 그대로)
 *   구조물을 시작할 때 당을 내고(모자라면 건너뛴다), 벽·기둥은 머리 피로 당 × 1.6(넘칠 것 같으면 건너뛴다). 걸리는 시간은 미리 짜 둔 차례표 그대로(굳으면 멈추고 지은 것은 남는다)
 *   대마법사: 반원 보루(벽 다섯) 약 2 s, 하늘 막기 약 0.9 s, 덫길 약 1.2 s
 * 두뇌 (생각 겹, 선명도 5 이상, 판단 수준의 tac.blueprint: 1 상급 = 책에 맞는 첫 청사진, 2 대가부터 = 상황에 맞게):
 *   짓기 단계(리듬): 떠보기 중 상대가 60 m 안이면서 30 m 넘게 멀거나 물러나면(진지 규칙과 같은 때), 청사진이 준비됐고 지난 청사진에서 8 s 지났으면
 *   고르기: 당이 모자라지 않는 것 가운데, 특징(상대가 떠 있음·땅·다가옴·멂, 내 피로·다친 몫)에 청사진의 무게를 곱해 더한 값이 가장 큰 것
 *   자리 맞추기: 진지 자리 = 내 자리, u = 상대 쪽. 구조물이 싸움터·소금 원 밖이면 자리를 안으로 민다. 벽이 든 청사진은 내려앉아 선다 */
const { hyp, sin, cos } = require('../math');
const BPD = require('../../data/blueprints.json'), P = require('../../data/rules/blueprint.json');
const BK = require('../../data/rules/bulwark.json').block;
const { rateOf } = require('./bulwark').api, { saltR } = require('./saltRing').api;
const NAMES = Object.keys(BPD.blueprints), D2R = Math.PI / 180;
const { crowded } = require('../brain/lib/traps');   // 덫길의 칸 (v2.23.1 공용: 수학·데이터만이라 순환이 없다)
// 구조물에 쓸 마법 (책에서): 함정(안 보이는 것을 바라면 안 보이는 것), 지대
function spellFor(W, m, it) {
  const S = W.spells; let any = null;
  for (const n of m.book) { const s = S[n]; if (!s) continue;
    if (it.cast === 'trap' && s.t === 'trap') { if (!it.hidden || !s.vis) return s; if (!any) any = s; }
    if (it.cast === 'zone' && s.t === 'zone' && s.z && s.z.k === it.zone) return s; }
  return it.cast === 'trap' ? any : null;
}
// 이 청사진을 지을 수 있나 (need의 것이 모두 있나)
function can(W, m, bp) {
  for (const k of bp.need) { const it = BPD.items[k]; if (it.build === 'earth' && !W.rules.bulwark) return false; if (it.cast && !spellFor(W, m, it)) return false; }
  return true;
}
// 청사진의 당 (구조물마다: 벽·기둥은 제 값, 함정·지대는 그 마법의 당)
function costOf(W, m, bp) { let c = 0; for (const [k] of bp.items) { const it = BPD.items[k]; if (it.build) c += it.cost; else { const s = spellFor(W, m, it); if (s) c += s.cost; } } return c; }
// 갈래 수
const lanesOf = (m, n) => Math.max(1, Math.min(n, m.circles - 1 - (m.z >= 1 && m.fly !== 3 ? 1 : 0), P.maxLanes));
// 구조물 하나를 짓는 데 드는 시간
function durOf(W, m, it, s) { if (it.build === 'earth') return it.blocks * BK.gap * BK.h * it.th / (rateOf(m) || 1e-9); if (it.build === 'lime') return it.time; return s ? s.cast : 0; }
// 차례표: 자리를 맞추고 갈래마다 차례로 (시작·끝 시각은 청사진 시전의 준비 뒤부터)
function plan(W, m, name, ax, ay, ux, uy) {
  const bp = BPD.blueprints[name], px = -uy, py = ux, out = [];
  for (const [k, a, b, rot] of bp.items) {
    const it = BPD.items[k], s = it.cast ? spellFor(W, m, it) : null; if (it.cast && !s) continue; if (it.build === 'earth' && !W.rules.bulwark) continue;
    const r = (rot || 0) * D2R, fx = ux * cos(r) - uy * sin(r), fy = ux * sin(r) + uy * cos(r);
    out.push({ k, it, s, x: ax + ux * a + px * b, y: ay + uy * a + py * b, fx, fy, s0: 0, s1: 0, on: 0, placed: 0, grp: -1 });
  }
  // 자리 맞추기: 싸움터 안(1.5 m 여유), 소금 원 안(2 m 여유)으로 민다
  let sx = 0, sy = 0; const lo = 1.5;
  for (const o of out) { if (o.x + sx < lo) sx = lo - o.x; if (o.x + sx > W.width - lo) sx = W.width - lo - o.x; if (o.y + sy < lo) sy = lo - o.y;
    if (o.y + sy > W.height - lo) sy = W.height - lo - o.y; }
  if (W.rules.saltRing) { const R = saltR(W) - 2, cx = W.width / 2, cy = W.height / 2; let worst = 0, wx = 0, wy = 0;
    for (const o of out) { const dx = o.x + sx - cx, dy = o.y + sy - cy, d = hyp(dx, dy); if (d - R > worst) { worst = d - R; wx = dx / d; wy = dy / d; } } sx -= wx * worst; sy -= wy * worst; }
  for (const o of out) { o.x += sx; o.y += sy; }
  const L = lanesOf(m, out.length), free = new Array(L).fill(0); let T = 0;
  for (const o of out) { let j = 0; for (let i = 1; i < L; i++) if (free[i] < free[j]) j = i; o.s0 = free[j]; o.s1 = free[j] + durOf(W, m, o.it, o.s); free[j] = o.s1; if (o.s1 > T) T = o.s1; }
  return { name, x: ax + sx, y: ay + sy, ux, uy, items: out, T, lanes: L, built: 0, ground: out.some(o => o.it.build) };
}
// 짓기: 청사진 시전의 준비(마법의 예비동작) 뒤 차례표대로. all이면 남은 것을 모두
// 함정·지대도 풀 때 머리가 넘쳐 굳거나 고르지 않은 파도에 오를 것이면 건너뛴다 (v2.6, 스스로 죽지 않기: tac.survive, 선명도 5 이상, brain/util의 heatOver와 같은 문턱)
function hot(W, m, cost) { if (!m.tac.survive || m.C < 5 || !W.rules.fatigue) return false; const f = m.fat + cost * 1.6; if (W.rules.wave) { if (m.type === '이단') return false;
    if (m.wave || (m.tac.waveChoose && m.waveWant)) return f > 165; } return f > 97; }
function step(W, m, c, all, X) {
  const b = c.bp, tc = c.t - c.s.cast, e = c.tgt;
  for (const o of b.items) {
    if (o.on === 2 || (!all && tc < o.s0)) continue;
    if (!o.on) {   // 시작: 당·머리 피로, 땅
      const cost = o.s ? o.s.cost : o.it.cost;
      if (o.it.cast === 'trap' && m.tac.trapLine && crowded(W, m, o.x, o.y)) { o.on = 2; continue; }   // 꽉 찬 칸엔 덫을 놓지 않는다 (덫길, v2.13)
      if (m.glu < cost || (o.it.build && (m.z >= 1 || m.fat + cost * 1.6 > 100)) || (!o.it.build && hot(W, m, cost)) || (o.it.build && m.tac.sharp && m.C >= 5 && e && e.z > 2)) { o.on = 2; continue; }   // 날카롭게 (v2.7): 높이 뜬 과녁에겐 벽·기둥이 가리지 않는다
      m.glu -= cost; if (o.it.build && W.rules.fatigue) m.fat += cost * 1.6; o.on = 1;
    }
    const k = all || tc >= o.s1 ? 1 : (tc - o.s0) / ((o.s1 - o.s0) || 1);
    if (o.it.build === 'earth') {   // 블록을 하나씩
      const n = o.it.blocks, upto = Math.floor(k * n + 1e-9), qx = -o.fy, qy = o.fx, vol = BK.gap * BK.h * o.it.th; if (o.grp < 0) o.grp = W._grp++;
      while (o.placed < upto) { const off = (o.placed - (n - 1) / 2) * BK.gap;
        X.addWall(W, { x: o.x + qx * off, y: o.y + qy * off, r: BK.r, hp: BK.hpM3 * vol, t: 1e9, own: -1, mat: 'earth', thick: o.it.th, grp: o.grp, mk: m.id }); o.placed++; }
      if (o.placed >= n) { o.on = 2; b.built++; }
    } else if (k >= 1) {
      if (o.it.build === 'lime') X.addWall(W, { x: o.x, y: o.y, r: o.it.r, hp: o.it.hp * (1 + (m.C - 1) * 0.5), t: 1e9, own: -1, mat: 'lime', thick: o.it.r * 2, grp: W._grp++, mk: m.id });
      else if (hot(W, m, o.s.cost)) { o.on = 2; continue; }   // 풀 때 넘칠 것이면 건너뛴다 (여럿이 한 걸음에 풀린다)
      else X.release(W, m, { s: o.s, tx: o.x, ty: o.y, tgt: e, t: 0, T: 0, lane: true });   // 함정·지대: 그 마법을 그 자리에 (방출 그대로: 머리 피로·장악권)
      o.on = 2; b.built++;
    }
  }
}
// 두뇌 (생각 겹): 판단 수준, 특징(0~1), 고르기, 땅이 드는가
const lvOf = m => (m.C >= 5 && m.tac.blueprint) || 0;
function feats(m, K) { const e = K.e;
  return { base: 1, eFly: e.z >= 1 ? 1 : 0, eGround: e.z >= 1 ? 0 : 1, approach: Math.max(0, Math.min(1, K.vt / 5)), far: Math.max(0, Math.min(1, (K.d - 20) / 30)), tired: Math.max(0, Math.min(1, (m.fat - 60) / 40)), hurt: 1 - m.hp / m.hpMax };
  }
function pick(W, m, K) {
  const lv = lvOf(m); let best = null, bs = -1; const F = lv >= 2 ? feats(m, K) : null;
  for (const n of NAMES) { const bp = BPD.blueprints[n]; if (!can(W, m, bp) || m.glu < costOf(W, m, bp)) continue; if (lv < 2) return n; let s = 0; for (const k in bp.score) s += bp.score[k] * F[k];
    if (s > bs) { bs = s; best = n; } }   // 당이 모자라면 고르지 않는다
  return best;
}
const needGround = n => BPD.blueprints[n].items.some(([k]) => BPD.items[k].build);
// 짓기 단계로: 청사진이 준비됐고(책·간격·지난 청사진에서 8 s) 고를 게 있으면. 작전 겹(진지, rules/tactics)도 이것으로 짓는다(v2.5)
function startBuild(W, m, K) {
  const f = m.fort, s = W.spells['청사진'];
  if (!lvOf(m) || !s || !m.book.includes('청사진') || (m.cd['청사진'] || 0) > 0 || W.t - f.bpLast < P.again) { f.bpPick = null; return false; }
  f.bpPick = pick(W, m, K); if (!f.bpPick) return false;
  m.phase = 'build'; K.prefR = K.d; K.aggr *= 0.6; K.pressB = false; return true;
}
module.exports = {
  name: 'blueprint', switch: 'blueprint', on: W => W.rules.blueprint, form: { blueprint: 'self' }, api: { plan, can, BPD, startBuild },
  engine: X => ({ mageStep(W, m) { const c = m.cast; if (c && c.bp && c.s.t === 'blueprint' && c.t >= c.s.cast) step(W, m, c, false, X); } }),
  types: X => ({
    // 다 지었다: 남은 반올림 몫까지 짓고 센다
    blueprint(W, m, c) { const b = c.bp; if (!b) return; step(W, m, c, true, X); const f = m.fort; f.bpN++; f.bpItems += b.built; f.bpT += c.T; f.bpName[b.name] = (f.bpName[b.name] || 0) + 1;
      f.bpLast = W.t; },
  }),
  brainTypes: B => ({ blueprint(W, m, K, o) { o.v = 0; } }),   // 값은 두뇌 훅이
  brain: B => {
    return {
      // 리듬의 짓기 단계 (진지 규칙의 짓기를 대신한다)
      phase(W, m, K) {
        if (!lvOf(m) || m.phase !== 'probe') return;
        const e = K.e, d = K.d;
        const away = d > P.buildD || ((e.phase === 'out' || K.vt < -2) && d > P.backD);
        if (!away || d > P.near) { m.fort.bpPick = null; return; }
        startBuild(W, m, K);
      },
      steer(W, m, K) {
        const f = m.fort, c = m.cast;
        if (c && c.bp && c.bp.ground) { m.flyWant = false; return; }   // 짓는 동안 땅에 (벽·기둥은 떠서 못 짓는다)
        if (m.phase === 'build' && f.bpPick && needGround(f.bpPick) && !K.dodge) { m.flyWant = false; K.vx = 0; K.vy = 0; }   // 벽이 든 청사진은 내려앉아 선다
      },
      value(W, m, K, o) {
        if (o.s.t !== 'blueprint' || !lvOf(m)) return; const f = m.fort;
        if (m.phase !== 'build' || !f.bpPick || (needGround(f.bpPick) && m.z >= 1) || K.slot !== 'A') return;
        o.v = P.value; o.tx = K.e.x; o.ty = K.e.y;
      },
      commit(W, m, K, best, cast) {
        if (best.s.t !== 'blueprint') return; const f = m.fort, e = K.e, d = K.d || 1;
        const b = plan(W, m, f.bpPick, m.x, m.y, (e.x - m.x) / d, (e.y - m.y) / d); cast.bp = b; cast.T = best.s.cast + b.T;
        f.x = b.x; f.y = b.y; f.ux = b.ux; f.uy = b.uy; f.t = W.t; f.founded++; f.bpLast = W.t;   // 진지 자리 (진지 규칙의 집·피해 지표가 본다)
      },
    };
  },
};
}, {"../math":"src/math.js","../../data/blueprints.json":"data/blueprints.json","../../data/rules/blueprint.json":"data/rules/blueprint.json","../../data/rules/bulwark.json":"data/rules/bulwark.json","./bulwark":"src/rules/bulwark.js","./saltRing":"src/rules/saltRing.js","../brain/lib/traps":"src/brain/lib/traps.js"}];
D["src/rules/body.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 몸 받침 (rules.bodyK, v2.0 기본 2.3, SPEC 24장; 굳은 살은 v2.0 둘째 묶음, 25장)
 * 에너지 피해(불·번개·독·열선…)는 ÷ max(C, 1)^bodyK: 열 차단·절연 막·폐 거르기.
 * 부딪히는 피해('blunt': 돌·얼음·곡사·물·총·벽 밀기)는 한 방마다 굳은 살 = callus × log₂ C / log₂ 10 만큼 뺀다. 조약돌은 튕기고 무거운 돌·총알은 들어온다.
 * callus 0이면 첫 묶음 그대로(부딪힘도 ÷ C^bodyK, 총은 받치지 않는다).
 * 마법의 부딪힘(v2.7, bluntK): 굳은 살을 뺀 뒤 ÷ C^bluntK. 돌·얼음·물·곡사·함정·구름의 부딪힘은 쏜 사람의 위력(C^2.5)이 곱해져 들어오는데
 *   굳은 살(대마법사 12)만 빼서, 상위의 돌 비(14 × 56 = 783)가 대마법사를 한 방에 죽였다(에너지였다면 ÷ 200 = 4). 총·화약통·벽 밀기는 그대로
 * 받치지 않는 것: 화약통(마법이 아니다), 소금(몸의 마력을 끊는다), 추락, 제 머리가 넘친 것(파도·폭주, 역류) */
const { pow, log } = require('../math');
const SKIP = { salt: 1, fall: 1, wave: 1, backfire: 1 }, L10 = log(10);
module.exports = {
  name: 'body', switch: 'bodyK', on: W => W.rules.bodyK > 0,
  engine: () => ({
    hurtMod(W, m, v, kind, name) {
      if (SKIP[kind] || name === '화약통') return v;
      const cal = W.rules.callus;
      if (cal > 0 && kind === 'blunt') {   // 굳은 살 (선명도마다 한 번)
        if (m._clC !== m.C) { m._clC = m.C; m._cl = m.C > 1 ? cal * log(m.C) / L10 : 0; }
        const r = v > m._cl ? v - m._cl : 0, bk = W.rules.bluntK;
        if (!(bk > 0) || !(r > 0) || m.C <= 1) return r;
        const s = W.spells[name]; if (!s || s.mundane || s.t === 'topple') return r;   // 총(마법이 아니다)·벽 밀기(위력이 곱해지지 않은 벽의 무게)는 굳은 살만
        if (bk === W.rules.bodyK) { if (m._bkC !== m.C) { m._bkC = m.C; m._bk = pow(m.C, bk); } return r / m._bk; }   // 몸 받침과 같은 지수면 그 값을 같이 쓴다
        return r / pow(m.C, bk);
      }
      const s = W.spells[name]; if (s && s.mundane && !(cal > 0)) return v;
      if (m._bkC !== m.C) { m._bkC = m.C; m._bk = pow(Math.max(m.C, 1), W.rules.bodyK); }   // 선명도마다 한 번 (결정론 pow가 비싸다)
      return v / m._bk;
    },
  }),
};
}, {"../math":"src/math.js"}];
D["src/rules/breath.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 숨 (rules.breath, v2.11, SPEC 35장, 수는 data/rules/breath.json) — 판마다 세 번, 깊이 마셔 몸의 연료를 채운다
 * 엔진: 마시는 동안(st.breath, T 0.5 s) 새 마법을 짓지 못하고(두뇌의 rest 훅: 자동 진은 돈다) 느려진다(× slow 0.5, 날면 마시기 시작한 속도의 절반으로).
 *   끝나면 당 + glu 80 (당 한도까지) · 머리 피로 − fat 30 · 기력 + stam 3
 * 두뇌 (판단 수준의 tac): 남은 몫 = 머리의 남은 몫(1 − 피로/100)과 당의 몫(당/한도) 가운데 적은 쪽. 숨은 둘 다 채운다
 *   breathAt 아래면 마신다 (초보 0.05 · 중급 0.15 · 상급 0.25 · 대가·전설 0.25). breathSafe(중급부터)면 위협(나를 겨눈 수)이 없을 때만,
 *   상대가 숨긴 수(손잡이)를 쓰면 엄폐 뒤(시야가 막힌 곳)에서만 (v2.20)
 *   breathPre(대가·전설 0.45): 작전 압박·끝내기를 고른 직후(pre 1 s 안)에 남은 몫이 이 아래면 위협이 없을 때 미리 마신다
 *   두 칸이 비어 있을 때만 마신다(짓던 설계는 버리지 않는다)
 * 기록 (m.mlog): breath 쓴 수, breathHit 마시다 맞은 수(빈틈, 한 번 마실 때 한 번), breathAtk·breathAtkHit 숨 뒤 after 5 s 안에 쏜 공격·맞힌 공격 */
const P = require('../../data/rules/breath.json');
let MP = null, EP = null;   // 공격 방식의 수 (덮기 뒤 숨, data/mode.json)
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
// 쏜 공격·맞힌 공격의 합 (숨 뒤 명중을 세려고)
function atk(W, m) { let c = 0, h = 0; const L = m.log; for (const n in L.casts) { const s = W.spells[n]; if (s && OFF[s.t]) { c += L.casts[n]; h += Math.min(L.casts[n], L.hits[n] || 0); } } return [c, h]; }
const left = m => m.mlog.breath < P.n;
module.exports = {
  name: 'breath', switch: 'breath', default: true, api: { P, left: m => P.n - m.mlog.breath },
  engine: X => ({
    mageStep(W, m) {
      const L = m.mlog;
      if (m.st.breath > 0) {
        m.st.breath -= W.dt;
        if (m.z >= 1) { const v = X.hyp(m.vx, m.vy); if (v > L.brV && v > 0) { m.vx *= L.brV / v; m.vy *= L.brV / v; } }   // 날면 마시기 시작한 속도의 절반
        if (m.st.breath <= 0) { m.st.breath = 0; m.glu = Math.min(m.gluMax, m.glu + P.glu); if (W.rules.fatigue) m.fat = Math.max(0, m.fat - P.fat); m.stam = Math.min(X.BODY.stam, m.stam + P.stam); const a = atk(W, m); L.brT = W.t; L.brA = a[0]; L.brH = a[1]; }
      } else if (L.brT >= 0 && W.t - L.brT >= P.after) { const a = atk(W, m); L.breathAtk += a[0] - L.brA; L.breathAtkHit += a[1] - L.brH; L.brT = -9; }   // 숨 뒤 5 s
    },
    speed(W, m, sp) { return m.st.breath > 0 ? sp * P.slow : sp; },
    hurt(W, m, v, src) { if (m.st.breath > 0 && src && src.side !== m.side && !m.mlog.brHitF) { m.mlog.brHitF = true; m.mlog.breathHit++; } },   // 마시다 맞았다
  }),
  brain: B => ({
    // 마시는 동안은 새 마법을 고르지 않는다. 남은 몫이 문턱 아래면 마시기 시작한다
    rest(W, m, K, restNow) {
      if (m.st.breath > 0) return true;
      if (!left(m) || m.cast || m.castB || m.chan || m.hp <= 0) return restNow;   // 쉬려던 참이어도 본다(쉴 때가 마실 때다)
      const T = m.tac, r = Math.min(W.rules.fatigue ? 1 - m.fat / 100 : 1, m.glu / m.gluMax), threat = !!(K.aimed || K.threat);
      let go = r < T.breathAt && (!T.breathSafe || !threat);
      if (!go && K.coverDone > W.t - 1.5 && m.fat > (MP || (MP = require('../../data/mode.json'))).heat && !threat && r < 0.5) go = true;   // 덮기 뒤 머리가 뜨거우면 (v2.12)
      if (!go && K.low && r < (EP || (EP = require('../../data/engage.json'))).breathR && !threat) go = true;   // 몰린 쪽은 깊이 마신다 (v2.13)
      if (!go && T.breathPre && r < T.breathPre && !threat && m.op && (m.op.cur === 'press' || m.op.cur === 'finish') && W.t - m.op.t0 < P.pre) go = true;   // 몰아치기 직전에 미리 (대가·전설)
      if (go && T.breathSafe && K.los && B.hidesOf(K.e)) go = false;   // 숨긴 수를 쓰는 상대: 언제 올지 모르니 엄폐 뒤(시야가 막힌 곳)에서만 마신다 (v2.20)
      if (!go) return restNow;
      m.st.breath = P.T; m.mlog.breath++; m.mlog.brHitF = false; m.mlog.brV = Math.max(B.C.hyp(m.vx, m.vy) * P.slow, 2.5); m.relT = null; return true;
    },
  }),
};
}, {"../../data/rules/breath.json":"data/rules/breath.json","../../data/mode.json":"data/mode.json","../../data/engage.json":"data/engage.json"}];
D["src/rules/bulwark.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 벽 (rules.bulwark, v2.0 둘째 묶음, SPEC 25장, 수는 data/rules/bulwark.json)
 * 세울 때만 힘이 들고 고체는 유지 비용이 없다.
 *   흙·석회: 시간으로 사라지지 않고 체력이 다할 때까지 선다. 세우는 속도는 출력에 비례(초당 0.6 m³ × 출력/632 kW: 대마법사 흙벽 약 3 s, 보루 약 18 s, 평범은 사실상 못 한다)
 *   얼음: 유지 비용 없이 조금씩 녹고(초당 0.5) 불 지대 곁에선 빨리 녹는다(초당 20)
 *   불·물 벽(불벽·물 장막): 세운 사람이 버티는 동안(굳지 않고 당이 있는 동안, 15 s까지) 남고 당과 서클 하나를 쓴다. 멈추면 사라진다
 *   흙벽이 0.5 m 넘게 두꺼우면 총알이 멈춘다(2만 깎임). 큰 바위(무게 5 kg 넘는 투사체)·박격포는 부수고, 물은 흙벽을 진흙으로(× 10), 산은 석회를 녹인다(지대, rules/terrain)
 *   한 번 선 벽은 누구의 것도 아니다(own −1): 양쪽 모두 엄폐로 쓰고 양쪽 모두 막힌다. 흙을 끌어온 바깥쪽에 구덩이(걸음 × 0.5, 날면 없다)
 *   벽 뒤에선 시야가 막혀 예비동작을 못 읽는다(두뇌 hideCast). 날고 있으면(2 m 위) 벽이 없다(core)
 *   벽 밀기(틀 topple): 서 있는 벽 무리 하나를 한 방향으로 넘어뜨려 그 너머 한 줄(2.5 m)을 덮는다. 부딪힘 60 + 묶임 2 s. 벽은 무너진다 */
const { hyp, sin, cos, atan2 } = require('../math');
const P = require('../../data/rules/bulwark.json');
const { outP } = require('./flight').api;
const B0 = P.block, EARTH = { earth: 1, lime: 1 };
const rateOf = m => P.rate * outP(m) / P.rateP;   // 세우는 속도 m³/s
const volOf = s => B0.gap * B0.h * s.th;           // 블록 하나의 부피 m³
function nOf(s) { return s.shape === 'ring' ? Math.max(6, Math.round(2 * Math.PI * s.rad / B0.gap)) : s.nb; }
const buildT = (m, s) => s.cast + nOf(s) * volOf(s) / (rateOf(m) || 1e-9);   // 세우는 데 드는 시간 (예비동작 포함)
// 블록 k의 자리와 바깥 방향: 한 줄(겨눈 쪽 앞, 겨눈 쪽에 수직) 또는 제 둘레 고리
function spot(s, cx, cy, a, k, n) {
  if (s.shape === 'ring') { const b = a + k / n * 2 * Math.PI; return [cx + cos(b) * s.rad, cy + sin(b) * s.rad, cos(b), sin(b)]; }
  const off = (k - (n - 1) / 2) * B0.gap, ux = cos(a), uy = sin(a); return [cx + ux * s.at - uy * off, cy + uy * s.at + ux * off, ux, uy];
}
// 벽 무리를 넘어뜨릴 때 덮이는 사람 (무리의 블록마다 민 방향으로 depth m, 폭은 블록 간격)
const SEEN = new Set(), NEAR = [], BLK = [], CR = [];   // 벽 밀기의 값에서 다시 쓰는 것 (v2.23.1)
function crushed(W, blocks, ux, uy, out = []) {
  out.length = 0; const D = P.topple.depth;
  for (const q of W.ms) { if (q.hp <= 0 || q.z >= 1) continue; for (const b of blocks) { const rx = q.x - b.x, ry = q.y - b.y, t = rx * ux + ry * uy, w = -rx * uy + ry * ux;
      if (t > -0.3 && t < D + 0.3 && w > -B0.gap && w < B0.gap) { out.push(q); break; } } }
  return out;
}
// 세우는 중인 벽: 블록을 upto개까지 (시전 c에 자리를 적어 둔다). 한 줄 끝·고리가 싸움터 밖으로 나가면 그 블록은 건너뛴다
function begin(W, m, c) { if (!c.bw) c.bw = { x: m.x, y: m.y, a: atan2(c.ty - m.y, c.tx - m.x), k: 0, grp: W._grp++, done: 0 }; return c.bw; }
function place(W, m, c, upto, addWall) {
  const s = c.s, n = nOf(s), bw = begin(W, m, c);
  while (bw.k < upto && bw.k < n) {
    const [x, y, ox, oy] = spot(s, bw.x, bw.y, bw.a, bw.k, n); bw.k++;
    if (x < 0.5 || y < 0.5 || x > W.width - 0.5 || y > W.height - 0.5) continue;
    addWall(W, { x, y, r: B0.r, hp: B0.hpM3 * volOf(s), t: 1e9, own: -1, mat: s.mat, thick: s.th, grp: bw.grp, mk: m.id });
    W.zones.push({ k: 'pit', shape: 'circle', r: P.pit.r, x: x + ox * P.pit.out, y: y + oy * P.pit.out, a: 0, src: m, dps: 0, t: 1e9, n: '구덩이' });   // 흙을 끌어온 바깥쪽
  }
  if (bw.k >= n && !bw.done) { bw.done = 1; m.alog.walls++; }
}
function segHit(x1, y1, x2, y2, w) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((w.x - x1) * dx + (w.y - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
  return hyp(x1 + dx * t - w.x, y1 + dy * t - w.y) < w.r; }
module.exports = {
  name: 'bulwark', switch: 'bulwark', on: W => W.rules.bulwark, form: { build: 'self', topple: 'target' }, api: { rateOf, buildT, nOf, volOf, crushed },
  engine: X => {
    const { addWall } = X;
    return {
      // 흙·석회·얼음 벽은 시간으로 사라지지 않는다 (가두는 기둥은 그대로 짧다)
      wall(W, w) { if (!w.cage && (EARTH[w.mat] || w.mat === 'ice')) w.t = 1e9; },
      wallHit(W, p, o, wd) {
        const s = p.s; let r = wd;
        if (EARTH[o.mat]) {
          if ((s.m || 0) >= P.heavyM) r = P.heavy;                               // 큰 바위는 부순다
          else if (s.mundane) r = o.thick >= P.stopThick ? P.bullet : wd;        // 0.5 m 흙벽이면 총알이 멈춘다
          else if (s.el === '물') r = wd * P.water;                              // 물은 흙벽을 진흙으로
        }
        if (o.hp > 0 && o.hp <= r) p.src.mlog.razed++;   // 없앤 지형 (v2.2 지표)
        return r;
      },
      lobLand(W, l) { const d = l.s.wallDmg; if (d) for (const w of W.walls) if (hyp(w.x - l.x, w.y - l.y) < l.r + w.r) w.hp -= d; },   // 박격포는 벽을 부순다
      world(W) {
        for (const w of W.walls) if (w.mat === 'ice') {   // 얼음은 녹는다, 불 곁에선 빨리
          let k = P.ice.melt; for (const z of W.zones) if (z.k === 'fire' && hyp(z.x - w.x, z.y - w.y) < (z.r || (z.len || 2) / 2) + w.r + 0.5) { k = P.ice.fire; break; }
          w.hp -= k * W.dt;
        }
        // 버티는 벽(불벽·물 장막): 세운 사람이 굳지 않고 당이 있는 동안 남는다. 멈추면 사라진다
        for (const z of W.zones) {
          if (z.up === undefined) z.up = (z.n === '불벽' || z.n === '물 장막') ? 1 : 0;
          if (!z.up) continue; const q = z.src; z.age = (z.age || 0) + W.dt;
          if (q.hp <= 0 || q.st.stun > 0 || q.glu < P.upkeep.glu * W.dt || z.age > P.upkeep.max) { z.t = 0; z.up = 0; continue; }
          q.glu -= P.upkeep.glu * W.dt; if (z.t < 1) z.t = 1;
        }
      },
      mageStep(W, m) {
        const c = m.cast; if (c && c.s.t === 'build') {
          if (m.z >= 1) { m.cast = null; return; }   // 떠서는 흙을 못 끌어온다
          const t = c.t - c.s.cast; begin(W, m, c); if (t > 0) place(W, m, c, Math.floor(t * rateOf(m) / volOf(c.s) + 1e-9), addWall);
        }
        if ((W.step + m.id) % 6 === 0 && W.walls.length) { const ws = W.walls, q = X.wallsIn(W, m.x - 3, m.y - 3, m.x + 3, m.y + 3); for (let i = 0; i < q.length; i++) { const w = ws[q[i]];
            if (w.grp >= 0 && !w.cage && hyp(w.x - m.x, w.y - m.y) < w.r + 1.2) { m.alog.wallT += 6 * W.dt; break; } } }   // 벽 곁에 있던 시간 (지표, 벽 격자)
      },
      speedLate(W, m, sp) { if (m.z < 1) for (const z of W.zones) if (z.k === 'pit' && hyp(z.x - m.x, z.y - m.y) < z.r) return sp * P.pit.speed; return sp; },   // 구덩이
    };
  },
  types: X => ({
    // 세우기가 끝났다: 남은 블록을 모두 (예비동작만으로 바로 방출하면 한꺼번에 선다)
    build(W, m, c) { if (m.z < 1) place(W, m, c, 1e9, X.addWall); },
    topple(W, m, c, a) {
      const s = c.s; let best = null, bd = P.topple.reach;
      for (const w of W.walls) { if (w.cage) continue; const d = hyp(w.x - c.tx, w.y - c.ty); if (d < bd) { bd = d; best = w; } }
      if (!best) return;
      const blocks = best.grp >= 0 ? W.walls.filter(w => w.grp === best.grp) : [best];
      const dx = c.tx - m.x, dy = c.ty - m.y, l = hyp(dx, dy) || 1, ux = dx / l, uy = dy / l;
      const hitQ = crushed(W, blocks, ux, uy);
      for (const w of blocks) w.hp = 0; m.mlog.razed += blocks.length;
      for (const q of hitQ) { X.hurt(W, q, s.dmg * a.g, q === m ? null : m, s.n, 'blunt'); X.eff(W, q, { root: s.root }, a.g); }
      if (hitQ.some(q => q.side !== m.side)) X.hit(m, s);
      if (W.rec) for (const w of blocks) W.fx.push(['b', w.x + ux, w.y + uy, 1.5]);
    },
  }),
  brainTypes: B => ({
    build(W, m, K, o) { o.v = 0; },    // 값은 두뇌 훅(value)이 매긴다 (총·둘레를 본다, 25장)
    topple(W, m, K, o) { o.v = 0; },
  }),
  brain: B => ({
    circles(W, q, c) { let n = 0; for (const z of W.zones) if (z.up && z.src === q) n++; return n ? Math.max(1, c - n) : c; },   // 버티는 벽은 서클 하나씩
    // 벽 밀기의 값 (누구나): 벽 무리마다 넘어뜨리면 깔릴 적 × 0.6(내 편이 깔리면 안 민다), 벽 없애기(대가, tac.wallBreak)면 × 2. 가장 큰 곳
    value(W, m, K, o) {
      const s = o.s; if (s.t !== 'topple' || !W.walls.length) return;
      const R = B.C.rangeOf(m, s) || s.R; let best = 0, bx = 0, by = 0; const seen = SEEN, near = NEAR, q0 = B.C.wallsIn(W, m.x - R, m.y - R, m.x + R, m.y + R);
      seen.clear(); near.length = 0; for (let i = 0; i < q0.length; i++) near.push(q0[i]);   // 미리 잡은 배열을 다시 쓴다 (v2.23.1)
      for (let i = 0; i < near.length; i++) {
        const w = W.walls[near[i]]; if (w.cage || (w.grp >= 0 && seen.has(w.grp)) || hyp(w.x - m.x, w.y - m.y) > R) continue; if (w.grp >= 0) seen.add(w.grp);
        const blocks = BLK; blocks.length = 0; if (w.grp >= 0) { for (const x of W.walls) if (x.grp === w.grp) blocks.push(x); } else blocks.push(w);
        const dx = w.x - m.x, dy = w.y - m.y, l = hyp(dx, dy) || 1, cr = crushed(W, blocks, dx / l, dy / l, CR);
        let foes = 0, mine = 0; for (let k = 0; k < cr.length; k++) { if (cr[k].side === m.side) mine++; else foes++; }
        if (mine) continue; const v = foes * 0.6 * (m.tac.wallBreak ? 2 : 1); if (v > best) { best = v; bx = w.x; by = w.y; }
      }
      if (best > 0) { o.v = best; o.tx = bx; o.ty = by; }
    },
    hideCast(W, q, c, m) { if (!m || q.z > 2 || m.z > 2 || !W.walls.length) return false;
      const ws = W.walls, a = B.C.wallsIn(W, Math.min(q.x, m.x) - 1.5, Math.min(q.y, m.y) - 1.5, Math.max(q.x, m.x) + 1.5, Math.max(q.y, m.y) + 1.5);
      for (let i = 0; i < a.length; i++) { const w = ws[a[i]]; if (!w.cage && segHit(q.x, q.y, m.x, m.y, w)) return true; } return false; },   // 벽 뒤의 예비동작은 안 보인다
    // 세우기의 시간: 블록이 모두 찰 때까지
    commit(W, m, K, best, cast) { if (best.s.t === 'build') cast.T = buildT(m, best.s); },
  }),
};
}, {"../math":"src/math.js","../../data/rules/bulwark.json":"data/rules/bulwark.json","./flight":"src/rules/flight.js"}];
D["src/rules/calm.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 머리 아끼기 (rules.calm, v2.25, SPEC 48장, 수는 data/rules/calm.json) — 기본 꺼짐, 규칙 묶음 '지금'이 켠다
 * 낮은 단계(선명도 cMax 아래, 평범·중간)의 싸움꾼도 제 머리가 휩쓸리는 건 안다. 스스로 죽지 않기(tac.survive, 선명도 5 이상)처럼 넘침을 다 막으면
 *   낮은 단계는 머리가 느리게 식어 판이 멈춘다(117 s, 80판에 5판만 끝남: reports/v2.24.1.md). 그래서 파도는 타되 휩쓸리지는 않는다:
 *   파도 위에서 풀고 나면 머리가 edge를 넘을 마법은 고르지 않고(170에서 폭주: 30 피해·2.5 s 굳음), rest면 위협이 없을 때 쉬어 내려온다 */
const P = require('../../data/rules/calm.json');
const on = (W, m) => m.C < P.cMax && !!W.rules.wave && m.type !== '이단';
module.exports = {
  name: 'calm', switch: 'calm', api: { P },
  brain: B => ({
    value(W, m, K, o) {
      if (!(o.v > 0) || o.s.mundane || !on(W, m)) return;
      const B2 = K.slot === 'B', other = B2 ? m.cast : m.castB, extra = other && !other.auto ? other.s.cost * (other.B ? 1.3 : 1) : 0, c = o.s.cost * (B2 ? 1.3 : 1) + extra;   // 같이 모으는 다른 칸이 먼저 풀며 더할 머리도 (tac.survive처럼)
      if (m.wave) { if (m.fat + c * 1.6 > (m.type === '서퍼' ? P.edge : P.edgeM)) o.v = 0; return; }
      if (m.type === '서퍼' || (K.e && K.e.hp < P.finish * K.e.hpMax)) return;   // 서퍼는 탄다, 끝낼 수 있으면 탄다
      if (B.heatOver(W, m, c, B.castTime(W, m, o.Tw), 1)) o.v = 0;
    },
    rest(W, m, K, restNow) { return restNow || (P.rest > 0 && on(W, m) && m.wave > 0 && !K.aimed); },
  }),
};
}, {"../../data/rules/calm.json":"data/rules/calm.json"}];
D["src/rules/chipGuard.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 작은 수 막기 (rules.chipGuard, v2.24, SPEC 47장, 수는 data/rules/chipGuard.json) — 시험 규칙, 기본 꺼짐
 * 응수가 있는 동안(굳음·묶임·떨어짐이 아니라 몸을 쓸 수 있다) 떡대가 적의 한 방(투사체·실·폭발·덫)마다 cut만큼 뺀다(0 아래로는 안 간다).
 *   선명도 cMin 이상(대마법사)만. 걸음마다 드는 피해(지대·빔·불·소금, tick)는 그대로. 뺀 양은 mlog.chip
 * 물음: 연타로 앞쪽에서 잃는 판(흐름)을 뒤로 미루고, 끝은 큰 한 방이 내게 할 수 있나 */
const P = require('../../data/rules/chipGuard.json');
module.exports = {
  name: 'chipGuard', switch: 'chipGuard', api: { P },
  engine: X => ({
    hurtMod(W, m, v, kind, name, src, tick) {
      if (tick || !src || src.side === m.side || m.C < P.cMin || m.st.stun > 0 || m.st.root > 0 || m.fly === 2) return v;
      const w = v > P.cut ? v - P.cut : 0; m.mlog.chip += v - w; return w;
    },
  }),
};
}, {"../../data/rules/chipGuard.json":"data/rules/chipGuard.json"}];
D["src/rules/chorus.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 합창 (rules.chorus, v2.27, SPEC 50장, 수는 data/rules/chorus.json) — 기본 꺼짐
 * 박자를 맞춘 무리는 한 사람처럼 선명하다. tac.squad(전투단)나 tac.chorus가 있는 사람만, 고리 하나를 박자 맞추기에 쥔다(두뇌 훅 circles: 서클 − 1).
 *   함께 맞출 수 있는 수는 단계마다 limit(상위 6, 중간 3, 평범은 못 함). 서로 R m 안에 sync s 머물러야 맞춰진다.
 *   맞춰지면: 모두의 선명도 × √N(엔진 훅 ceff: 장악권을 밀어내 그 안에 마법을 세운다), 앞소리꾼(가장 선명한, 같으면 먼저 온 사람)의 위력 × √N^powK(함께 짓는 큰 마법),
 *     그 지연 폭발·곡사의 반지름 × √N(엔진 훅 tune: 넓힌 사본으로 바꾼다). 장악권은 한 목소리: 어느 자리든 앞소리꾼의 몫은 합창하는 모두의 신호의 합(엔진 훅 share).
 *     v2.36: 한 목소리(선명도 × √N, 합친 신호)는 함께 부르는 것에만 — 앞소리꾼의 수(합창이 함께 쥐는 마법 포함). 합창원이 제 손으로 쏘는 수는 제 선명도·제 신호로 다툰다(고요한 원 안은 예외, rules/chorusCast)
 *   나머지는 박자를 지킨다: 공격 값 × hold(묶는 수는 그대로, 두뇌 훅 valueLate)
 *   깨짐: 한 명이 쓰러지거나 굳거나 R m 밖으로 나가면 깨지고, 그 사람들은 cd s 동안 다시 못 맞춘다. 모여 있으니 넓은 마법에 약하다(따로 셈하지 않는다: 그대로 맞는다)
 * 지표 (v2.33): 깬 합창(brokeHit: 한 명이 쓰러지거나 굳어 깨진 것), 선명도 bigC 이상이 합창하는 사람에게 쏜 수(atN)·그중 넓은 마법(wideN)·앞소리꾼을 노린 것(leadN)
 * 사람에 칸을 더하지 않는다: 상태는 세계마다 WeakMap. api: of(W, m) → 합창 { n, lead, t0, on } 또는 null, stats(W) */
const P = require('../../data/rules/chorus.json');
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, WIDE = { area: 1, lob: 1, cone: 1 };
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const ST = new WeakMap(), BIG = new WeakMap();   // 마법 → [N마다 넓힌 사본] (앞소리꾼의 큰 마법)
const bigOf = (s, n) => { let a = BIG.get(s); if (!a) BIG.set(s, a = []); return a[n] || (a[n] = Object.assign({}, s, { r: s.r * Math.sqrt(n) })); };
function stOf(W) { let s = ST.get(W); if (!s) ST.set(W, s = { of: new Map(), cd: new Map(), groups: [], st: { formed: 0, broke: 0, onT: 0, leadCasts: 0, leadDmg: 0, maxN: 0, good: 0, brokeHit: 0, atN: 0, wideN: 0, leadN: 0 } }); return s; }
const limitOf = m => { for (const [c, n] of P.limit) if (m.C >= c) return n; return 0; };
const able = (W, m, S) => m.hp > 0 && !m.flee && (m.tac.squad || m.tac.chorus) && limitOf(m) > 1 && !(m.st.stun > 0) && !((S.cd.get(m) || -9) > W.t);
function update(X, W) {
  const S = stOf(W), old = S.groups, used = new Set(), now = [];
  // 지난 합창을 먼저 이어 본다: 모두 서 있고 서로 R 안이면 그대로(깨지면 cd)
  for (const g of old) {
    let ok = true; for (const m of g.ms) if (!able(W, m, S) && !(m.st.stun > 0 && false)) { ok = false; break; }
    if (ok) for (let i = 0; i < g.ms.length && ok; i++) for (let j = i + 1; j < g.ms.length; j++) if (X.hyp(g.ms[i].x - g.ms[j].x, g.ms[i].y - g.ms[j].y) > (P.keepR || P.R)) { ok = false; break; }   // 이어 가는 거리 (v2.32): 맞출 땐 R, 이어 갈 땐 keepR
    if (!ok) { if (g.on) { S.st.broke++; for (const m of g.ms) if (m.hp <= 0 || m.st.stun > 0) { S.st.brokeHit++; break; } } for (const m of g.ms) { S.of.delete(m); if (m.hp > 0) S.cd.set(m, W.t + P.cd); } continue; }   // 깬 합창 (v2.33): 한 명이 쓰러지거나 굳어서
    for (const m of g.ms) used.add(m); now.push(g);
  }
  // 끼어들기 (v2.32, join): 이어 가는 합창에 곁(모두에게서 R 안)의 같은 편이 한계까지 들어온다. 들어오면 박자를 다시 맞춘다(sync)
  if (P.join) for (const g of now) { let lim = limitOf(g.ms[0]); for (const q of g.ms) { const l = limitOf(q); if (l < lim) lim = l; } if (g.ms.length >= lim) continue;
    for (const q of W.ms) { if (g.ms.length >= lim) break; if (used.has(q) || q.side !== g.ms[0].side || !able(W, q, S) || limitOf(q) < g.ms.length + 1) continue;
      let near = true; for (const r of g.ms) if (X.hyp(r.x - q.x, r.y - q.y) > P.R) { near = false; break; } if (!near) continue;
      g.ms.push(q); used.add(q); g.n = g.ms.length; if (q.C > g.lead.C) g.lead = q; if (g.on) { g.on = false; g.t0 = W.t; } } }
  // 새로 모인다: 같은 편, 아직 합창하지 않는 사람끼리, 먼저 온 사람 둘레 R 안, 단계의 한계까지
  for (const m of W.ms) {
    if (used.has(m) || !able(W, m, S)) continue;
    const ms = [m]; let lim = limitOf(m);
    for (const q of W.ms) { if (ms.length >= lim) break; if (q === m || used.has(q) || q.side !== m.side || !able(W, q, S)) continue;
      let near = true; for (const r of ms) if (X.hyp(r.x - q.x, r.y - q.y) > P.R) { near = false; break; } if (!near) continue;
      const l2 = limitOf(q); if (l2 < lim) { if (ms.length >= l2) continue; lim = l2; } ms.push(q); }
    if (ms.length < 2) continue;
    let lead = ms[0]; for (const q of ms) if (q.C > lead.C) lead = q;
    const g = { ms, n: ms.length, lead, t0: W.t, on: false, onT: 0, good: false }; for (const q of ms) used.add(q); now.push(g);
  }
  // 붙어 있던 무리에 사람이 더해지거나 빠지면 다시 맞춘다 (위에서 새 무리가 된다)
  S.of.clear(); for (const g of now) { if (!g.on && W.t - g.t0 >= P.sync) { g.on = true; g.onT = W.t; S.st.formed++; } if (g.on && !g.good && g.n >= P.goodN && W.t - g.onT > P.goodT) { g.good = true; S.st.good++; } if (g.n > S.st.maxN && g.on) S.st.maxN = g.n; for (const m of g.ms) S.of.set(m, g); if (g.on) S.st.onT += P.every * g.n; }   // 오래 선 합창 (v2.29 지표: goodN 넘게 goodT s 넘게)
  S.groups = now;
}
const of = (W, m) => { const S = ST.get(W); if (!S) return null; const g = S.of.get(m); return g && g.on ? g : null; };
const forming = (W, m) => { const S = ST.get(W); if (!S) return false; const g = S.of.get(m); return !!g && !g.on; };   // 맞추는 중 (v2.30.1, 점검이 읽는다)
module.exports = {
  name: 'chorus', switch: 'chorus', api: { P, of, forming, limitOf, stats: W => stOf(W).st, group: (W, m) => { const S = ST.get(W); return S ? S.of.get(m) || null : null; }, groups: W => { const S = ST.get(W); return S ? S.groups : []; } },   // group: 맞추는 중이어도 (v2.34, rules/chorusCast)
  engine: X => ({
    world(W) { if (W.step % Math.round(P.every / W.dt) === 0) update(X, W); },
    tune(W, m, c) { const g = of(W, m); if (g && g.lead === m && (c.s.t === 'area' || c.s.t === 'lob') && c.s.r > 0) c.s = bigOf(c.s, g.n); },   // 함께 짓는 큰 마법: 넓이 × √N
    // 한 목소리: 자리 (x, y)의 내 몫을 합창하는 모두의 신호의 합으로 (적의 몫은 그대로)
    share(W, m, x, y, f) {
      const g = of(W, m); if (!g || g.lead !== m || !(f > 0) || f >= 1) return f;   // 함께 짓는 것(앞소리꾼의 수)에만 (v2.36): 합창원이 제 손으로 쏘는 수는 제 신호로 다툰다
      const L = W.rules.domainL, m0 = X.sigOf(W, m) / (1 + X.hyp(x - m.x, y - m.y) / L), other = m0 * (1 - f) / f; let mine = 0;
      for (const q of g.ms) mine += X.sigOf(W, q) / (1 + X.hyp(x - q.x, y - q.y) / L);
      return mine / (mine + other);
    },
    ceff(W, m, x) { const g = of(W, m); return g && g.lead === m ? x * Math.sqrt(g.n) : x; },   // 합창의 선명도도 앞소리꾼에만 (v2.36)
    power(W, m, s, x) { const g = of(W, m); return g && g.lead === m ? x * X.pow(Math.sqrt(g.n), P.powK) : x; },
    release(W, m, c) { const g = of(W, m); if (g && g.lead === m && OFF[c.s.t]) stOf(W).st.leadCasts++;
      if (m.C >= P.bigC && OFF[c.s.t] && c.tgt) { const h = of(W, c.tgt); if (h) { const st = stOf(W).st; st.atN++; if (WIDE[c.s.t]) st.wideN++; if (c.tgt === h.lead) st.leadN++; } } },   // 큰 사람이 합창에 쏜 것 (v2.33 지표): 넓은 마법의 몫, 앞소리꾼을 노린 몫
    hurt(W, m, v, src) { if (src) { const g = of(W, src); if (g && g.lead === src && m.side !== src.side) stOf(W).st.leadDmg += v; } },
  }),
  brain: B => ({
    circles(W, q, c) { const S = ST.get(W); return S && S.of.has(q) ? Math.max(1, c - 1) : c; },   // 박자 맞추기에 고리 하나
    // 합창 깨기 (v2.33, 판단 수준의 tac.chorusBreak: 전설): 선 합창의 앞소리꾼을 노린다(크게 짓는 중이면 먼저, 큰 합창 먼저). 거기엔 묶는 수(굳히면 깨진다)·넓은 마법을 더 친다
    aim(W, m, K) { if (!m.tac.chorusBreak || m.C < P.bigC || m.flee) return; const S = ST.get(W); if (!S) return; const R = P.brk;
      let e = null, bs = 1e9; for (const g of S.groups) { const q = g.lead; if (q.side === m.side || !(q.hp > 0) || q.flee) continue; const d = B.hyp(q.x - m.x, q.y - m.y); if (d > R.R) continue;
        const sc = d - g.n * R.nW - (g.on ? (q.cast ? R.castB : 0) : R.formB); if (sc < bs) { bs = sc; e = q; } }   // 맞추는 중인 무리(아직 한 목소리가 아니다)를 먼저: 모여 있고 아직 세지 않다
      if (e) K.e = e; },
    valueLate(W, m, K, o) { if (!(o.v > 0) || !OFF[o.s.t]) return; const g = of(W, m); if (g && g.lead !== m && !isBind(o.s)) o.v *= P.hold;
      if (m.tac.chorusBreak && K.e && m.C >= P.bigC) { const S = ST.get(W), h = S && S.of.get(K.e); if (!h) return; o.v *= isBind(o.s) ? P.brk.bind * (K.e.cast ? P.brk.castK : 1) : WIDE[o.s.t] ? P.brk.wide : 1;
        if ((o.s.t === 'area' || o.s.t === 'lob') && o.s.r > 0) { let x = 0, y = 0, n = 0; for (const q of h.ms) if (q.hp > 0) { x += q.x; y += q.y; n++; } if (n) { o.tx = x / n; o.ty = y / n; } } } },   // 넓은 마법은 합창의 가운데로 (몇이 함께 맞고, 피하면 박자가 깨진다)
  }),
};
}, {"../../data/rules/chorus.json":"data/rules/chorus.json"}];
D["src/rules/chorusCast.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 합창 설계 (rules.chorusCast, v2.34, SPEC 56장, 수는 data/rules/chorusCast.json, 마법은 data/spells의 chorusOnly·ring) — 기본 꺼짐, 합창(rules.chorus) 위에서
 * 합창은 여럿이 하나의 설계를 나눠 쥐는 것: 맞춰진 합창(chorus.of)은 셋을 모은다
 *   고리 = 사람마다 (서클 − 1)의 합(하나는 박자 맞추기에), 출력 = 사람마다 kW × C^outK × 피로 배수의 합, 선명도 = C × √N(rules/chorus의 ceff 그대로)
 *   상위 여섯 ≈ 고리 24 · 출력 0.67 MW · 선명도 12, 중간 셋 ≈ 고리 6 · 0.06 MW · 4.3
 * 앞소리꾼이 쓸 수 있는 것은 모은 고리·출력으로 (두뇌 훅 rings: 쥘 수 있는 고리)
 *   손잡이(rules/tune)의 최대 단계는 쥘 수 있는 고리가 tune.maxCirc 이상이면. 고리를 많이 먹는 마법(ring)은 쥘 수 있는 고리가 그만큼일 때만(혼자도 같다: 상위 혼자는 대낙뢰를 못 쥔다)
 *   예비동작 = 신호 + 에너지 ÷ (모은 출력 ÷ 제 출력): 예비동작 × (sig + (1 − sig) E ÷ k) ÷ (sig + (1 − sig) E). 머리 열·당은 합창한 사람들이 나눠 낸다
 *   드러남은 합친 것(큰 수의 cast.vis × N^(1/3), 못 보는 일이 없다)
 * 합창만의 마법(chorusOnly, 앞소리꾼만, 합창할 수 있는 사람의 책에 엔진 훅 book이 더한다)
 *   고요한 원(calm): 앞소리꾼에서 과녁 쪽 reach m까지의 자리에 반지름 r m. 쥐는 동안(합창이 깨지지 않고 dur s까지, 사람마다 초당 hold.fat 머리) 그 안의 장악은 우리 편이 1, 적이 0(엔진 훅 share)
 *   번개 장막(area, sky): 나는 과녁(z ≥ 1)만 맞고, 맞으면 떨어진다(엔진 훅 areaHit) · 석회 고리(limering): 과녁 둘레 r m에 석회 담 multi칸, dur s
 *   구름 걸기(cloud): 반지름 r m의 연막(시야를 끊는다)과 비(불을 끈다) · 곳간 터뜨리기(granary): 과녁 둘레 r m 칸의 곳간을 left만 남긴다(rules/drain이 켜졌을 때)
 *   합창 방패(cshield): 앞소리꾼 둘레 r m의 우리 편 모두에게 석회 막(buf front·block) dur s
 * 깨짐: 큰 수(chorusOnly · 앞소리꾼 혼자의 고리를 넘는 ring · 손잡이 에너지 bigE 이상)를 짓는 동안 합창이 깨지면(쓰러짐·굳음·멀어짐) 설계가 풀리고(시전을 거둔다),
 *   합창했던 사람마다 역류: 피해 back.dmg · 머리 back.fat · 굳음 back.stun × 고리/8 × E^(1/3). 쥐던 고요한 원이 깨지면 그 × back.hold
 * 두뇌: 앞소리꾼은 사람이 calm.minN 이상이고 과녁이 calm.foeC배 넘게 선명하면 고요한 원부터(그 안에선 다른 조의 과녁 자리 마법이 선다), 나는 과녁엔 번개 장막,
 *   땅의 과녁엔 석회 고리, 과녁을 노리는 큰 수엔 합창 방패. 큰 수가 닿지 않으면 합창이 한 덩어리로 다가간다(push, 두뇌 훅 steer).
 *   선명도 see.C 이상은 see.R m 안의 합창 큰 수(번쩍임)를 보고 그 앞소리꾼을 노린다(두뇌 훅 aim), 묶는 수 × see.bind
 * 상태는 세계마다 WeakMap. api: stats(W), pool(W, g), calms(W) */
const P = require('../../data/rules/chorusCast.json'), TP = require('../../data/rules/tune.json');
const CH = require('./chorus').api, DR = require('./drain').api, TU = require('./tune').api;
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, MINE = { calm: 1, limering: 1, cloud: 1, granary: 1, cshield: 1 };
const CHK = new Set(P.cm.check), MATE = new Set(P.cm.mate);
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const ST = new WeakMap();
function stOf(W) { let s = ST.get(W); if (!s) ST.set(W, s = { big: new Map(), calms: [], push: new Map(), chk: new Map(), es: new Map(), st: { bindN: 0, bindOk: 0, bindG: 0, checkN: 0, mateN: 0, chain: 0, bigN: 0, bigOk: 0, bigBroke: 0, bigCancel: 0, by: {}, calmN: 0, calmT: 0, calmIn: 0, netHit: 0, limeN: 0, cloudN: 0, granN: 0, shieldN: 0, backDmg: 0 } }); return s; }
const fatK = m => { const k = 1 - Math.min(m.fat, 100) / 200; return k < 0.6 ? 0.6 : k; };
// 사람 하나의 출력(kW)과 합창이 모은 것
function outOf(X, m) { return P.kW * X.pow(m.C > 0.01 ? m.C : 0.01, P.outK) * fatK(m); }
function pool(X, W, g) { let rings = 0, out = 0; for (const q of g.ms) if (q.hp > 0) { rings += q.circles > 1 ? q.circles - 1 : 0; out += outOf(X, q); } return { rings, out, C: g.lead.C * Math.sqrt(g.n) }; }
const leadOf = (W, m) => { const g = CH.of(W, m); return g && g.lead === m ? g : null; };
function heldOf(S, g) { let h = 0; for (const c of S.calms) if (c.g === g) h += c.ring; return h; }
const bigOf = (m, s, E) => !!(s.chorusOnly || (s.ring && s.ring > m.circles - 1) || E >= P.bigE);
let XX = null;   // 엔진의 것 (두뇌 쪽도 같은 셈을 쓴다)
// 역류: 합창했던 사람마다
function backlash(X, W, ms, k) {
  const S = stOf(W), B = P.back; for (const q of ms) { if (!(q.hp > 0)) continue; const d = B.dmg * k; X.hurt(W, q, d, null, '합창 역류', 'blunt'); S.st.backDmg += d; q.fat += B.fat * k; if (B.stun > 0) X.eff(W, q, { stun: B.stun * k }, 1); }
}
module.exports = {
  name: 'chorusCast', switch: 'chorusCast', api: { P, stats: W => stOf(W).st, pool: (W, g) => pool(XX, W, g), calms: W => stOf(W).calms },
  form: { calm: 'self', limering: 'target', cloud: 'target', granary: 'target', cshield: 'self' },
  engine: X => {
    XX = X;
    return {
      // 합창할 수 있는 사람(전투단·합창, 단계의 합창 한계가 둘 이상)의 책에 합창의 마법을 더한다
      book(W, spec, bk) { if (!spec.tac || !(spec.tac.squad || spec.tac.chorus) || CH.limitOf({ C: spec.C || 0 }) < 2) return; for (const n of P.book) if (!bk.includes(n)) bk.push(n); },
      // 고요한 원 안의 장악: 원을 쥔 편 1, 적 0
      share(W, m, x, y, f) { const S = ST.get(W); if (!S || !S.calms.length) return f; for (const c of S.calms) if (X.hyp(x - c.x, y - c.y) < c.r) return m.side === c.side ? 1 : 0; return f; },
      // 번개 장막: 나는 과녁만, 맞으면 떨어진다
      areaHit(W, q, a, sole) { if (!a.s.sky) return sole; if (!(q.z >= 1)) return 0; if (W.rules.flight && (q.fly === 1 || q.fly === 3)) { q.fly = 2; q.fallZ = q.z; if (q.vz > 0) q.vz = 0; } stOf(W).st.netHit++; return sole; },
      release(W, m, c) {
        const S = stOf(W), s = c.s, g = leadOf(W, m);
        if (S.calms.length && OFF[s.t]) { const p = X.formPoint(m, s, c.tx, c.ty); if (p) for (const k of S.calms) if (k.side === m.side && X.hyp(p[0] - k.x, p[1] - k.y) < k.r) { S.st.calmIn++; break; } }   // 고요한 원 안에서 선 과녁 자리 마법
        const b = S.big.get(m); if (b && b.c === c) { S.st.bigOk++; S.big.delete(m); }
        if (c.tgt && c.tgt.C >= P.see.C && isBind(s) && !s.mundane) { const h = CH.of(W, m); if (h && h.lead !== m) { const p = X.formPoint(m, s, c.tx, c.ty) || [c.tx, c.ty], gg = X.gOf(W, X.share(W, m, p[0], p[1])); S.st.bindN++; S.st.bindG += gg; if (gg > 0.02) S.st.bindOk++; } }   // 합창원(앞소리꾼 빼고)의 굳히는 수가 대마법사에게 선 몫 (v2.36 지표)
        if (g && c.tgt) { if (CHK.has(s.n)) { S.st.checkN++; S.chk.set(c.tgt, W.t); } else if (MATE.has(s.n)) { S.st.mateN++; const t = S.chk.get(c.tgt); if (t != null && W.t - t <= P.cm.chainT) S.st.chain++; } }   // 체크 뒤 메이트로 이어진 몫 (v2.35)
        if (g && W.rules.fatigue && !s.mundane && g.n > 1) {   // 머리 열은 나눠 낸다 (core가 이 뒤에 앞소리꾼에게 더한다)
          const heat = s.cost * (c.B ? 1.3 : 1) * (c.auto ? 0.8 : 1) * 1.6, n = g.n; m.fat -= heat * (n - 1) / n; for (const q of g.ms) if (q !== m && q.hp > 0) q.fat += heat / n; }
      },
      world(W) {
        const S = ST.get(W); if (!S) return;
        if (S.big.size) for (const [m, b] of S.big) {   // 짓는 큰 수: 합창이 깨지면 설계가 풀리고 역류
          const g = CH.of(W, m); if (m.cast === b.c && g === b.g && m.hp > 0) continue;
          S.big.delete(m); if (m.cast === b.c) m.cast = null;
          if (g !== b.g || !(m.hp > 0) || m.st.stun > 0) { S.st.bigBroke++; backlash(X, W, b.ms, b.ring / 8 * X.pow(b.E, 1 / 3)); } else S.st.bigCancel++;
        }
        if (S.calms.length) { let w = 0; for (const c of S.calms) {   // 쥐는 고요한 원
          const g = CH.of(W, c.lead), alive = g === c.g && c.lead.hp > 0 && W.t < c.end;
          if (alive) { c.z.t = c.end - W.t; S.st.calmT += W.dt; for (const q of g.ms) if (q.hp > 0) q.fat += P.hold.fat * W.dt; S.calms[w++] = c; continue; }
          c.z.t = 0; if (W.t < c.end) backlash(X, W, c.ms, c.ring / 8 * P.back.hold); }
          if (w < S.calms.length) S.calms.splice(w); }
      },
    };
  },
  types: X => ({
    calm(W, m, c, a) {
      const g = leadOf(W, m); if (!g) return; const s = c.s, S = stOf(W), dx = c.tx - m.x, dy = c.ty - m.y, d = X.hyp(dx, dy) || 1, k = Math.min(d, P.calm.reach) / d;
      const x = X.clamp(m.x + dx * k, 0, W.width), y = X.clamp(m.y + dy * k, 0, W.height); X.addZone(W, m, { k: 'calm', shape: 'circle', r: s.r, d: s.dur, n: s.n }, x, y, 0, 1);
      S.calms.push({ z: W.zones[W.zones.length - 1], g, lead: m, ms: g.ms.slice(), side: m.side, x, y, r: s.r, end: W.t + s.dur, ring: s.ring || 0 }); S.st.calmN++;
    },
    limering(W, m, c, a) {
      const s = c.s, n = s.multi || 18, grp = W._grp++; let h = false;
      for (let k = 0; k < n; k++) { const b = k / n * 6.2832; X.addWall(W, { x: X.clamp(c.tx + X.cos(b) * s.r, 0.4, W.width - 0.4), y: X.clamp(c.ty + X.sin(b) * s.r, 0.4, W.height - 0.4), r: s.pr, hp: s.hp, t: s.dur, own: m.side, cage: 1, mat: 'lime', grp }); }
      for (const q of a.foes) if (X.hyp(q.x - c.tx, q.y - c.ty) < s.r - 0.4) h = true; if (h) X.hit(m, s); stOf(W).st.limeN++;
    },
    cloud(W, m, c, a) { const s = c.s; X.addZone(W, m, { k: 'smoke', shape: 'circle', r: s.r, d: s.dur, n: s.n }, c.tx, c.ty, 0, 1); X.addZone(W, m, { k: 'rain', shape: 'circle', r: s.r, d: s.dur, n: s.n }, c.tx, c.ty, 0, 1); stOf(W).st.cloudN++; },
    granary(W, m, c, a) {
      if (!W.rules.drain) return; const s = c.s, G = DR.stats(W), cell = DR.P.cell, i0 = Math.floor((c.tx - s.r) / cell), i1 = Math.floor((c.tx + s.r) / cell), j0 = Math.floor((c.ty - s.r) / cell), j1 = Math.floor((c.ty + s.r) / cell);
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { if (i < 0 || j < 0 || i >= G.nx || j >= G.ny) continue; if (X.hyp((i + 0.5) * cell - c.tx, (j + 0.5) * cell - c.ty) > s.r) continue; G.a[j * G.nx + i] *= P.granary.left; }
      stOf(W).st.granN++;
    },
    cshield(W, m, c, a) { const s = c.s; for (const q of W.ms) if (q.side === m.side && q.hp > 0 && X.hyp(q.x - m.x, q.y - m.y) < s.r) { q.buf.front = { v: 1, t: s.dur }; q.buf.block = { v: 1, t: s.dur }; } stOf(W).st.shieldN++; },
  }),
  brainTypes: () => ({ calm(W, m, K, o) { o.v = 0; }, limering(W, m, K, o) { o.v = 0; }, cloud(W, m, K, o) { o.v = 0; }, granary(W, m, K, o) { o.v = 0; }, cshield(W, m, K, o) { o.v = 0; } }),   // 값은 valueLate (앞소리꾼)
  brain: B => {
    const C = B.C, hyp = B.hyp, PL = B.lib.plan, CM = P.cm;
    // 과녁의 줄인 상태 (수읽기, SPEC 39장): 앞소리꾼마다 걸음마다 한 번
    const stateOf = (W, m, e) => { const S = stOf(W); let x = S.es.get(m); if (!x) S.es.set(m, x = { s: PL.newSide(), step: -1, e: null, k: 0 }); const k = e.st.stun + e.st.root * 7 + e.z * 13; if (x.step !== W.step || x.e !== e || x.k !== k) { PL.build(W, e, m, x.s, PL.P.horizon, true); x.step = W.step; x.e = e; x.k = k; } return x.s; };
    // τ s 안에 r m를 빠져나갈 수 있나: 옆 튀기·구르기·열린 피할 곳으로 움직이기 (막힌 곳: 벽·석회 고리·바위·소금·끝, 굳음·묶임·떨어짐은 S.up)
    // 날 수 없는 과녁(S.a 0)은 피할 곳까지의 길도 본다: 석회 고리·벽·바위를 넘지 못한다. 날 수 있으면 굳음·떨어짐(S.up)이 풀린 뒤 넘는다
    // 합창의 앞소리꾼이 나를 겨눈 번개, 또는 내 둘레의 합창 번개 구름
    function chorusElec(W, m) {
      for (const a of W.areas) if (a.src.side !== m.side && a.s.kind === 'elec' && hyp(a.x - m.x, a.y - m.y) < a.r + P.see.elecPad && leadOf(W, a.src)) return true;
      for (const q of W.ms) { if (q.side === m.side || !(q.hp > 0)) continue; const c = q.cast; if (c && c.tgt === m && c.s.kind === 'elec' && leadOf(W, q)) return true; }
      return false;
    }
    function escapes(W, e, S, tau, r) {
      if (S.has & 2 && S.av[1] <= tau && PL.cutOK(S, tau - S.av[1], r)) return true;
      if (S.has & 1 && S.av[0] <= tau && PL.rollOK(S, tau - S.av[0], r)) return true;
      if (!PL.moveOK(S, tau, r)) return false;
      for (let j = 1; j < 9; j++) if (S.blk[j] <= tau && (S.a > 0 || !C.blocked(W, e.x, e.y, S.bx[j], S.by[j], 0))) return true;
      return false;
    }
    // 메이트(큰 수)의 맞을 가망: 터지기까지(예비동작 + 지연·나는 시간) 과녁이 반지름 밖으로 빠져나갈 수 있으면 escP, 못 하면 1 (막기가 있으면 × guardK)
    function mateHit(W, m, e, s, o, g) {
      const S = stateOf(W, m, e), k = pool(XX, W, g).out / outOf(XX, m), sig = TP.sig, Tc = B.castTime(W, m, o.Tw) * (sig + (1 - sig) / (k > 1 ? k : 1));
      const tau = Tc + (s.t === 'area' ? s.delay : s.t === 'lob' ? s.flight : 0), r = (s.r || 1) * C.sizeOf(m, s) * Math.sqrt(g.n) + 0.3;
      let p = escapes(W, e, S, tau, r) ? CM.escP : 1; if (S.has & 4 && S.av[2] <= tau) p *= CM.guardK;
      const a = PL.aim(W, e, tau); o.tx = a.x; o.ty = a.y; return p;
    }
    return {
      // 쥘 수 있는 고리: 앞소리꾼은 모은 고리 − 쥐고 있는 고요한 원, 다른 합창하는 사람은 박자 하나
      rings(W, m, r) { const g = CH.of(W, m); if (!g) return r; if (g.lead !== m) return 1; const S = ST.get(W); return pool(XX, W, g).rings - (S ? heldOf(S, g) : 0); },
      // 합창의 큰 수를 보고 깨러 온다
      aim(W, m, K) { if (m.C < P.see.C || m.flee) return; const S = ST.get(W); if (!S) return; let e = null, bd = P.see.R;
        if (S.big.size) for (const [q, b] of S.big) { if (q.side === m.side || !(q.hp > 0) || q.cast !== b.c) continue; const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } }
        if (m.tac.chorusBreak && S.calms.length) for (const c of S.calms) { if (c.side === m.side || !(c.lead.hp > 0)) continue; const d = hyp(c.lead.x - m.x, c.lead.y - m.y) - P.calm.breakB; if (d < bd) { bd = d; e = c.lead; } }   // 합창 깨기(전설): 고요한 원을 쥔 앞소리꾼 (깨면 원이 사라진다, v2.35)
        if (e) K.e = e; },
      steer(W, m, K) {   // 큰 수가 닿지 않으면 합창이 한 덩어리로 다가간다
        if (m.tac.chorusBreak && m.C >= P.see.C && !m.flyWant && m.fly !== 2 && !(m.cut && m.cut.cool) && chorusElec(W, m)) m.flyWant = true;   // 합창 깨기(전설): 합창의 번개(넓고 세다)엔 내려앉지 않고 날며 비킨다 (v2.35)
        if (K.dodge || m.flee) return;
        if (m.tac.chorusBreak && m.C >= P.see.C) { const S = ST.get(W); if (S) for (const c of S.calms) { if (c.side === m.side) continue; const dx = m.x - c.x, dy = m.y - c.y, l = hyp(dx, dy) || 0.1; if (l < c.r + P.calm.outPad) { K.vx = dx / l * P.calm.outV; K.vy = dy / l * P.calm.outV; return; } } }   // 합창 깨기(전설): 적의 고요한 원 안이면 밖으로 (그 안에선 내 마법이 서지 않는다)
       const g = CH.of(W, m); if (!g) return; const S = ST.get(W), p = S && S.push.get(g); if (!p || W.t > p.until || !(p.e.hp > 0)) return;
        const dx = p.e.x - g.lead.x, dy = p.e.y - g.lead.y, l = hyp(dx, dy) || 1; if (l <= p.R) return; K.vx = dx / l * P.push.v; K.vy = dy / l * P.push.v; },
      valueLate(W, m, K, o) {
        const s = o.s; if (!s.ring && !s.chorusOnly && !(o.v > 0)) return;
        const e = K.e, S = stOf(W);
        if (m.C >= P.see.C && e && o.v > 0 && isBind(s)) { const b = S.big.get(e); if ((b && e.cast === b.c) || (m.tac.chorusBreak && S.calms.some(c => c.lead === e))) o.v *= P.see.bind; }   // 짓는 앞소리꾼엔 묶는 수(굳히면 깨진다)
        if (s.ring && B.ringsOf(W, m) < s.ring) { o.v = 0; return; }   // 고리를 많이 먹는 마법은 쥘 고리가 있을 때만
        if (MATE.has(s.n)) { const g = leadOf(W, m); if (!g || !e || !(e.hp > 0)) return; if (K.d > C.rangeOf(m, s)) { o.v = 0; return; }   // 메이트: 빠져나갈 수 없을 때만 (v2.35)
          const p = mateHit(W, m, e, s, o, g); o.v = p >= CM.mateMin ? CM.mateV * p : 0; return; }
        if (!s.chorusOnly) return;
        const g = leadOf(W, m); if (!g || !e || !(e.hp > 0)) { o.v = 0; return; }
        const d = K.d, R = s.t === 'calm' ? P.calm.reach + s.r - P.calm.pad : C.rangeOf(m, s), strong = e.C >= P.calm.foeC * m.C;
        let v = 0, tx = e.x, ty = e.y;
        if (s.t === 'calm') { if (g.n >= P.calm.minN && strong && !S.calms.some(c => c.side === m.side && hyp(e.x - c.x, e.y - c.y) < c.r)) v = P.calm.v; }
        else if (s.t === 'area' && s.sky) { if (e.z >= P.net.z) v = P.net.v; }
        else if (s.t === 'limering') { if (e.z < P.lime.zMax && !W.walls.some(w => w.cage && w.own === m.side && hyp(w.x - e.x, w.y - e.y) < s.r + P.lime.near)) { v = P.lime.v * (strong ? 1 : 0.3); const k = C.rangeOf(m, s) > 0 ? s.cast : 0; tx = e.x + e.vx * k; ty = e.y + e.vy * k; } }
        else if (s.t === 'cloud') { if (strong && K.los && e.cast && g.ms.includes(e.cast.tgt) && !W.zones.some(z => z.k === 'smoke' && hyp(z.x - (m.x + e.x) / 2, z.y - (m.y + e.y) / 2) < z.r)) { v = P.cloud.v; tx = (m.x + e.x) / 2; ty = (m.y + e.y) / 2; } }   // 과녁이 우리를 겨눌 때 사이에 구름을 건다
        else if (s.t === 'granary') { if (W.rules.drain && strong && DR.around(W, e.x, e.y) > P.granary.min) v = P.granary.v; }
        else if (s.t === 'cshield') { for (const q of K.foes) if (q.hp > 0 && q.C >= m.C && q.cast && g.ms.includes(q.cast.tgt)) { v = P.shield.v; break; } tx = m.x; ty = m.y; }
        if (v > 0 && CHK.has(s.n)) { const Sx = stateOf(W, m, e); if (PL.slack(Sx, CM.within) === 0 && s.t !== 'calm') v *= CM.noSlack; }   // 응수가 바닥난 과녁엔 체크보다 메이트
        if (v > 0 && s.t !== 'cshield' && d > R) { if (s.t !== 'cloud') { const p = S.push.get(g); if (!p || W.t > p.until) S.push.set(g, { e, R: R - P.push.pad, until: W.t + P.push.T }); } v = 0; }   // 닿지 않으면 한 덩어리로 다가간다
        o.v = v; if (v > 0) { o.tx = tx; o.ty = ty; }
      },
      commit(W, m, K, best, cast) {
        const g = leadOf(W, m); if (!g) return; const s = best.s, n = g.n, S = stOf(W), pl = pool(XX, W, g), k = pl.out / outOf(XX, m);
        const E = cast.tk ? TU.energy(s, cast.tz, cast.tf, cast.tv) : 1, sig = TP.sig;
        if (k > 1) cast.T *= (sig + (1 - sig) * E / k) / (sig + (1 - sig) * E);   // 모은 출력으로 에너지 몫이 짧다
        if (n > 1 && cast.cost > 0) { m.glu += cast.cost * (n - 1) / n; for (const q of g.ms) if (q !== m && q.hp > 0) { q.glu -= cast.cost / n; if (q.glu < 0) q.glu = 0; } }   // 당도 나눠 낸다
        if (!bigOf(m, s, E)) return;
        cast.vis = (cast.vis > 1 ? cast.vis : 1) * C.pow(n, 1 / 3); cast.unseen = false;   // 드러남은 합친 것
        S.big.set(m, { c: cast, g, ms: g.ms.slice(), ring: s.ring || P.maxRing, E }); S.st.bigN++; S.st.by[s.n] = (S.st.by[s.n] || 0) + 1;
      },
    };
  },
};
}, {"../../data/rules/chorusCast.json":"data/rules/chorusCast.json","../../data/rules/tune.json":"data/rules/tune.json","./chorus":"src/rules/chorus.js","./drain":"src/rules/drain.js","./tune":"src/rules/tune.js"}];
D["src/rules/control.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 몸 묶기 (rules.bodyBind, 1.11.0, SPEC 7·9장)
 * 발밑이 아니라 몸을 묶는다(소금 밑창이 막지 못한다): 균사(구르기 불가·걸음 × 0.6), 경직(구르기 불가·× 0.5, 절연이 막음), 석회(구르는 거리 절반), 족쇄(젖은 발만 묶임).
 * 불이 균사·족쇄를 풀고, 산이 석회를 녹이고, 비·흙 이불이 눈을 씻는다. 가두는 기둥(틀 cage). 눈멀면 예비동작을 못 읽는다(두뇌) */
module.exports = {
  name: 'control', switch: 'bodyBind', on: W => W.rules.bodyBind, form: { cage: 'target' },
  engine: X => ({
    // 불에 타면 균사가 타고 족쇄가 녹는다 (족쇄로 걸린 묶임만 풀린다)
    hurt(W, m, v, src, name, kind) { if (kind === 'fire' && (m.st.mycel > 0 || m.st.fetter > 0)) { if (m.st.fetter > 0 && m.st.root <= m.st.fetter + 1e-9) m.st.root = 0; m.st.mycel = 0; m.st.fetter = 0; } },
    eff(W, m, o, g) {
      if (o.mycel) m.st.mycel = Math.max(m.st.mycel || 0, o.mycel * g);
      if (o.cramp && !m.buf.elecRes) m.st.cramp = Math.max(m.st.cramp || 0, o.cramp * g);
      if (o.lime) m.st.lime = Math.max(m.st.lime || 0, o.lime * g);
      if (o.fetter && m.st.wet > 0) { m.st.fetter = Math.max(m.st.fetter || 0, o.fetter * g); m.st.root = Math.max(m.st.root || 0, o.fetter * g); }
    },
    rain(W, q) { q.st.blind = 0; },      // 비가 눈을 씻는다
    smother(W, m) { m.st.blind = 0; },   // 흙 이불도
    ring(W, m) { if (m.st.mycel > 0) m.st.mycel = 0; },   // 불고리가 제 몸의 균사를 태운다
    speedLate(W, m, sp) { if (m.st.cramp > 0) sp *= 0.5; else if (m.st.mycel > 0) sp *= 0.6; return sp; },
  }),
  // 가두는 기둥: 과녁 자리 둘레 s.r m에 기둥 넷을 ±60°·±120°에. 옆으로 피하는 길은 닫고, 나와 과녁 사이(앞)와 그 뒤는 열어 둔다
  types: X => ({
    cage(W, m, c, a) {
      const { cos, sin, clamp, hyp, hit } = X, s = c.s, tx = c.tx, ty = c.ty, hpS = 1 + (m.C - 1) * 0.5, rr = s.r, grp = W._grp++; let h = false;
      for (let k = 0; k < 4; k++) { const b = a.aim + (k < 2 ? 1 : -1) * (k % 2 ? 2 : 1) * Math.PI / 3; X.addWall(W, { x: clamp(tx + cos(b) * rr, 0.4, W.width - 0.4), y: clamp(ty + sin(b) * rr, 0.4, W.height - 0.4), r: s.pr, hp: s.hp * hpS, t: s.dur, own: m.side, cage: 1, mat: 'lime', grp }); }
      for (const q of a.foes) if (hyp(q.x - tx, q.y - ty) < rr - 0.5) h = true;
      if (h) hit(m, s);
    },
  }),
  // 두뇌: 눈멀면 못 읽는다. 붙잡는 마법은 과녁이 아직 안 걸렸을 때 쓴다. 큰 수(rules/risk)가 준비됐으면 그 큰 수를 확정시키는 붙잡기를 먼저 건다
  brain: B => {
    const { C, NONE, pinOf, pinned, afterPin, caged, castTime, landDelay, hitBack } = B;
    return {
      read(W, m, K) { K.blindR = m.st.blind > 0; },   // 눈멀면 예비동작과 구름을 못 읽고, 자동 진은 마지막 0.2 s에야 반응한다
      // 몸 묶기 계획 (대가·전설, + rules/risk): 붙잡기가 큰 수를 확정시킬 때만(지금 상태 + 이 붙잡기, 또는 + 준비된 다른 붙잡기 하나) 먼저 건다
      prep(W, m, K) {
        const { S, T, e, Dm, d } = K;
        if (!(W.rules.risk && T.bigPlan && Dm.bigs.length)) return;
        const bigs = Dm.bigs.filter(x => !((m.cd[x.n] || 0) > 0) && m.glu > x.cost + 3 && d < C.rangeOf(m, x) + 1);
        const ctOf = bigs.length ? x => castTime(W, m, x.cast * (1 - 0.35 * (m.mast[x.n] || 0))) : null;   // 큰 수가 있을 때만 만든다
        const pinNow = bigs.length > 0 && bigs.some(x => pinned(W, m, x, e, ctOf(x), d));
        const holds = bigs.length && !pinNow ? m.book.map(k => S[k]).filter(x => x && !x.big && pinOf(x, e) && !((m.cd[x.n] || 0) > 0)) : NONE;
        const pinBy = holds.length && ((x, x2) => { let st = afterPin(x, e, e.st), cg = x.t === 'cage'; if (x2) { st = afterPin(x2, e, st); cg = cg || x2.t === 'cage'; } return bigs.some(b => pinned(W, m, b, e, ctOf(b), d, st, cg)); });
        K.bigs = bigs; K.ctOf = ctOf; K.pinNow = pinNow; K.holds = holds; K.pinBy = pinBy;
      },
      value(W, m, K, o) {
        const e = K.e, d = K.d, s = o.s, Tw = o.Tw;
        if (s.t === 'move' && s.mv === 'vault' && caged(W, m)) { o.v = Math.max(o.v, 1.0); o.tx = m.x - K.uy * m.sf * 4; o.ty = m.y + K.ux * m.sf * 4; }   // 가두는 기둥을 넘는다 (옆으로)
        const h = s.hit || {};
        // 약한 공격으로 치지 않는다: 빈 간격을 채우면 머리만 뜨거워진다. 족쇄는 묶기(두 수 콤보가 잇는다), 나머지는 할 일이 없을 때만
        let ok = pinOf(s, e);
        if (h.mycel || h.lime || h.fetter || s.cramp || s.t === 'cage') { ok = ok && d < o.R && (K.los || s.t === 'cage') && !(s.t === 'cage' && (d < 4 || d > 10)); o.v = ok ? (h.fetter ? 0.6 : s.t === 'cage' ? 0 : 0.2) : 0; if (s.t === 'cage') { const k = castTime(W, m, Tw) * K.lead; o.tx = e.x + e.vx * k; o.ty = e.y + e.vy * k; } }   // 기둥은 시전이 끝날 때 과녁이 있을 자리에
        else ok = ok && o.v > 0;
        // 투사체 붙잡기는 과녁이 날아가는 동안 구를 수 없을 때만 (구르는 사람은 보이는 탄을 피한다)
        if (s.t === 'proj' && (h.mycel || h.lime || h.fetter) && e.rollCd <= castTime(W, m, Tw) + d / s.v && e.stam >= 1.5 && !K.eDown && !(e.st.mycel > 0 || e.st.cramp > 0)) { o.v = 0; ok = false; }
        if (K.holds.length && ok && !K.eDown && K.holds.includes(s) && hitBack(W, e, K.S, d) > castTime(W, m, Tw) + landDelay(s, d) + Math.min(...K.bigs.map(K.ctOf)) + 0.05) { if (K.pinBy(s)) o.v = Math.max(o.v, 1.2); else if (s.t !== 'cage' && K.holds.some(x => x !== s && K.pinBy(s, x))) o.v = Math.max(o.v, 0.7); }   // 기둥은 제 실 길도 가려 혼자 확정시킬 때만
      },
      commit(W, m, K, best) { if (K.holds.length && K.holds.includes(best.s) && best.v >= 0.7) m.log.pinTry++; },   // 큰 수를 위해 건 붙잡기
    };
  },
};
}, {}];
D["src/rules/crowdFire.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 갈라 쏘기 (rules.crowdFire, v2.30, SPEC 53장, 수는 data/rules/crowdFire.json) — 기본 꺼짐
 * 무리(전투단 tac.squad)가 같은 과녁에 투사체를 쏠 때 사람마다 몫을 나눈다(id mod 3): 가운데·왼쪽 피할 자리·오른쪽 피할 자리.
 *   피할 자리는 쏘는 줄에 직각으로 w m(과녁이 구르거나 옆으로 비키는 거리). 곁 R m 안에 같은 편이 n 넘게 있을 때만(혼자면 가운데를 쏜다)
 *   덮어 쏘기 (v2.32): 명중 문턱 없이 사거리 안이면 값 cover 이상으로 쏜다(피하게 만드는 것). v2.30의 때 고르기(빠른 과녁을 기다림)는 사격을 6분의 1로 줄여 거뒀다
 *   과녁이 날아갈 동안 갈 자리를 앞질러 겨눈다(lead). 풀 때 겨냥을 고친다(track 훅, 감각 조준 rules/pace 뒤) */
const P = require('../../data/rules/crowdFire.json');
module.exports = {
  name: 'crowdFire', switch: 'crowdFire', api: { P },
  brain: B => ({
    // 덮어 쏘기 (v2.32): 무리의 던지기는 맞히려는 게 아니라 피하게 만드는 것. 명중 문턱(빈틈 기다리기)에 막힌 직사도 값 cover로 쏜다
    valueLate(W, m, K, o) {
      const s = o.s, e = K.e; if (s.t !== 'proj' || s.mundane || !m.tac.squad || !e || !(K.d <= B.C.rangeOf(m, s))) return;
      if (o.wait || o.v < P.cover) { o.v = P.cover; o.wait = false; }
    },
  }),
  engine: X => ({
    track(W, m, c) {
      const s = c.s, q0 = c.tgt; if (s.t !== 'proj' || s.mundane || !m.tac.squad || !q0 || !(q0.hp > 0)) return;
      if (P.lead > 0) { const f = X.hyp(q0.x - m.x, q0.y - m.y) / s.v * P.lead; c.tx = q0.x + q0.vx * f; c.ty = q0.y + q0.vy * f; }   // 날아갈 동안 갈 자리를 앞질러 겨눈다
      const k = m.id % 3; if (!k) return;
      let n = 0; const f = W.ms; for (let i = 0; i < f.length; i++) { const q = f[i]; if (q !== m && q.side === m.side && q.hp > 0 && !q.flee && X.hyp(q.x - m.x, q.y - m.y) < P.R) n++; } if (n < P.n) return;
      const dx = c.tx - m.x, dy = c.ty - m.y, d = X.hyp(dx, dy) || 1, sg = k === 1 ? 1 : -1;
      c.tx += -dy / d * P.w * sg; c.ty += dx / d * P.w * sg;
    },
  }),
};
}, {"../../data/rules/crowdFire.json":"data/rules/crowdFire.json"}];
D["src/rules/drain.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 마름 (rules.drain, v2.28, SPEC 52장, 수는 data/rules/drain.json) — 기본 꺼짐
 * 대마법사가 전력으로 쓸 때만 둘레가 지친다(WORLD 3장 "마름은 꼭대기에서만"·한계 "대마법사급의 국지적 마름").
 *   땅은 cell m 칸, 칸마다 곳간 stock. 마법을 풀 때 서는 자리(formPoint)의 칸과 둘레 reach 칸에서 에너지 = 비용(손잡이가 박힌 마법의 cost) × 선명도^powerK × k를 꺼낸다.
 *   모자라면 그 시전의 위력 × 꺼낸 몫(엔진 훅 release가 정하고 power가 곱한다). 칸마다 초당 regen씩 다시 찬다(햇빛).
 *   몸의 마법도 곳간에서: 마른 땅(둘레 몫 d = 1 − 곳간)에 선 대마법사는 빠른 판의 떡대가 그만큼 벗겨진다(엔진 훅 hurtMod: 받는 피해 × (1 + (1/bulk − 1) d))
 *   평범·중간의 마법은 에너지가 대마법사의 1/30~1/300이라 곳간이 거의 줄지 않는다
 * 두뇌: 대마법사(선명도 5 이상)는 제 둘레 곳간이 move 몫 아래면 가장 찬 칸 쪽으로 옮긴다(걸음에 더한다).
 *   무리(선명도 5 아래, 적에 선명도 5 이상이 있을 때)는 그 적 lureR m 안에서 곳간이 lure 몫 아래인 칸으로 간다: 대마법사가 그 자리에 세우는 마법이 약하다
 * 상태는 세계마다 WeakMap(칸 배열), api: at(W, x, y) → 곳간 몫(0~1), stats(W) */
const P = require('../../data/rules/drain.json'), PC = require('../../data/rules/pace.json');
const ST = new WeakMap(), PEND = new WeakMap();
function gridOf(W) {
  let g = ST.get(W); if (g) return g;
  const nx = Math.max(1, Math.ceil(W.width / P.cell)), ny = Math.max(1, Math.ceil(W.height / P.cell)), a = new Float64Array(nx * ny).fill(P.stock);
  ST.set(W, g = { nx, ny, a, t: 0, drawn: 0, short: 0, casts: 0 }); return g;
}
const idx = (g, x, y) => { let i = Math.floor(x / P.cell), j = Math.floor(y / P.cell); if (i < 0) i = 0; if (i >= g.nx) i = g.nx - 1; if (j < 0) j = 0; if (j >= g.ny) j = g.ny - 1; return j * g.nx + i; };
const at = (W, x, y) => { const g = gridOf(W); return g.a[idx(g, x, y)] / P.stock; };
// (x, y) 둘레 칸들의 평균 몫
function around(W, x, y) { const g = gridOf(W), i0 = Math.floor(x / P.cell), j0 = Math.floor(y / P.cell); let s = 0, n = 0;
  for (let j = j0 - P.reach; j <= j0 + P.reach; j++) for (let i = i0 - P.reach; i <= i0 + P.reach; i++) { if (i < 0 || j < 0 || i >= g.nx || j >= g.ny) continue; s += g.a[j * g.nx + i]; n++; } return n ? s / n / P.stock : 1; }
module.exports = {
  name: 'drain', switch: 'drain', api: { P, at, around, stats: W => gridOf(W) },
  engine: X => ({
    world(W) { const g = gridOf(W), r = P.regen * W.dt, a = g.a; for (let i = 0; i < a.length; i++) if (a[i] < P.stock) a[i] = a[i] + r > P.stock ? P.stock : a[i] + r; },
    release(W, m, c) {
      const s = c.s; if (s.mundane || !(s.cost > 0)) return;
      const g = gridOf(W), p = X.formPoint(m, s, c.tx, c.ty) || [m.x, m.y], need = s.cost * X.pow(m.C > 1 ? m.C : 1, W.rules.powerK) * P.k;
      const i0 = Math.floor(p[0] / P.cell), j0 = Math.floor(p[1] / P.cell); let have = 0;
      for (let j = j0 - P.reach; j <= j0 + P.reach; j++) for (let i = i0 - P.reach; i <= i0 + P.reach; i++) if (i >= 0 && j >= 0 && i < g.nx && j < g.ny) have += g.a[j * g.nx + i];
      const take = need < have ? need : have, f = have > 0 ? take / have : 0;
      for (let j = j0 - P.reach; j <= j0 + P.reach; j++) for (let i = i0 - P.reach; i <= i0 + P.reach; i++) if (i >= 0 && j >= 0 && i < g.nx && j < g.ny) g.a[j * g.nx + i] *= 1 - f;   // 칸마다 같은 몫씩
      g.drawn += take; g.casts++; const k = need > 0 ? take / need : 1; if (k < 1) g.short++;
      let q = PEND.get(m); if (!q) PEND.set(m, q = { step: -1, s: null, k: 1 }); q.step = W.step; q.s = s; q.k = k;
    },
    // 마른 땅의 대마법사는 몸의 마법(빠른 판의 떡대)도 둘레 곳간에서 꺼낸다: 마른 만큼 떡대가 벗겨진다
    hurtMod(W, m, v, kind, name, src) { if (!src || src.side === m.side || m.C < PC.cMin || !W.rules.pace) return v; const d = 1 - around(W, m.x, m.y); return d > 0 ? v * (1 + (1 / PC.bulk - 1) * d) : v; },
    power(W, m, s, x) { const q = PEND.get(m); return q && q.step === W.step && q.s === s ? x * q.k : x; },
  }),
  brain: B => ({
    steer(W, m, K) {
      if (K.dodge) return;
      if (m.C >= 5) {   // 대마법사: 마른 곳을 떠난다
        if (around(W, m.x, m.y) >= P.move) return; let bx = 0, by = 0, bv = -1;
        for (let k = 0; k < 8; k++) { const a = k * 0.7854, x = m.x + B.C.cos(a) * 25, y = m.y + B.C.sin(a) * 25; if (x < 2 || y < 2 || x > W.width - 2 || y > W.height - 2) continue; const v = around(W, x, y); if (v > bv) { bv = v; bx = x; by = y; } }
        if (bv > 0) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx += dx / l * 1.5; K.vy += dy / l * 1.5; } return;
      }
      const e = K.e; if (!e || e.C < 5) return;   // 무리: 대마법사 둘레의 마른 칸에 선다
      if (at(W, m.x, m.y) < P.lure && B.hyp(e.x - m.x, e.y - m.y) < P.lureR) return;
      let bx = 0, by = 0, bv = 2;
      for (let k = 0; k < 8; k++) { const a = k * 0.7854, x = m.x + B.C.cos(a) * P.cell, y = m.y + B.C.sin(a) * P.cell; if (B.hyp(e.x - x, e.y - y) > P.lureR) continue; const v = at(W, x, y); if (v < bv) { bv = v; bx = x; by = y; } }
      if (bv < P.lure) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx += dx / l; K.vy += dy / l; }
    },
  }),
};
}, {"../../data/rules/drain.json":"data/rules/drain.json","../../data/rules/pace.json":"data/rules/pace.json"}];
D["src/rules/edgeCancel.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 장악권 경계 (rules.edgeCancel, v2.30.1, SPEC 53장 끝, 수는 data/rules/edgeCancel.json) — 기본 꺼짐
 * 잰 원인: 상위 무리의 헛시전 430 가운데 366은 짓기 시작할 때 이미 서는 자리의 장악 계수가 0.3 아래였다(값 × g로 깎일 뿐 고르긴 했다).
 *   나머지는 짓는 동안 과녁이 다가와(대마법사의 장악권은 움직인다) 서는 자리가 장악권 안이 된 것이다
 * 과녁이 나보다 ratio배 넘게 선명하면(합창이 맞춰진 사람은 빼고, v2.32)
 *   짓지 않는다: 서는 자리의 장악 계수가 gStart 아래인 수는 값 0
 *   끊고 물러난다: 짓는 중에 서는 자리의 장악 계수가 gCut 아래로 떨어지면 끊고(당 70% 돌려받음), back s 동안 과녁 반대쪽으로 */
const P = require('../../data/rules/edgeCancel.json');
const BACK = new WeakMap();   // 사람 → 물러나는 끝 시각
const CH = require('./chorus').api;
const strong = (W, m, e) => !!e && e.hp > 0 && e.C > m.C * P.ratio && !(W.rules.chorus && CH.of(W, m));   // 합창이 맞춰진 조는 합창의 선명도로 장악권 안에도 설 수 있다 (v2.32)
module.exports = {
  name: 'edgeCancel', switch: 'edgeCancel', api: { P },
  brain: B => {
    const undo = B.lib.undo, C = B.C;
    return {
      valueLate(W, m, K, o) { const s = o.s; if (!(o.v > 0) || s.mundane || !B.OFF[s.t] || !strong(W, m, K.e)) return; if (C.gAt(W, m, s, o.tx, o.ty) < P.gStart) o.v = 0; },
      cancel(W, m, K) {
        const c = m.cast; if (!c || c.auto || c.s.mundane || !B.OFF[c.s.t] || !strong(W, m, c.tgt || K.e) || c.T - c.t < P.minLeft) return;
        if (C.gAt(W, m, c.s, c.tx, c.ty) >= P.gCut) return;
        undo(m, c); BACK.set(m, W.t + P.back);
      },
      steer(W, m, K) {
        const t = BACK.get(m); if (t === undefined || W.t > t || K.dodge || m.flee) return; const e = K.e; if (!e) return;
        const dx = m.x - e.x, dy = m.y - e.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * P.v; K.vy = dy / l * P.v;
      },
    };
  },
};
}, {"../../data/rules/edgeCancel.json":"data/rules/edgeCancel.json","./chorus":"src/rules/chorus.js"}];
D["src/rules/endure.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 버티기 (rules.endureK, v2.7, SPEC 31장) — 머리 회복과 당 회복의 선명도 배수
 * 꺼져 있으면(0) 누구나 머리 초당 4, 당 초당 1.2 g이 돌아왔다. 켜지면 둘 다 × max(1, C / endureC)^endureK: 평범·중간 × 1, 상위·대마법사는 더 (endureC 2.5, endureK 1.2: 상위 × 2.3, 대마법사 × 5.3).
 *   중간까지는 그대로다: 선명도 1부터 곱하면 중간의 판단 사다리(머리를 아끼는 것이 단계를 가른다)가 무너졌다(전설 / 대가 0.99 → 0.71)
 * WORLD 4-1의 버티는 시간(평범 몇 분 · 중간 10~20분 · 상위 30분~1시간 · 대마법사 몇 시간)과 서클(동시에 붙잡는 층 수, 대마법사 8~12).
 * 이 규칙이 없을 때 대마법사는 머리(날면 남는 회복 1.2/s)와 당(초당 1.2 g, 마법 하나 3~7 g)에 묶여 4 s에 하나를 짓고 120 s 안에 서로 쓰러뜨리지 못했다 (reports/v2.7.0.md) */
const { pow } = require('../math');
// 배수는 사람마다 한 번 (선명도가 바뀌면 다시): 세계의 배열에 번호로 (걸음마다 두 번 부르니 Map은 느렸다)
function mul(W, m) { const a = W._en || (W._en = []), c = a[m.id]; if (c !== undefined && c[0] === m.C) return c[1]; const x = pow(m.C / W.rules.endureC, W.rules.endureK); a[m.id] = [m.C, x]; return x; }
module.exports = {
  name: 'endure', switch: 'endureK', on: W => W.rules.endureK > 0,
  engine: () => ({
    fatRecover(W, m, k) { return m.C > W.rules.endureC ? k * mul(W, m) : k; },   // 중간까지는 그대로
    gluRegen(W, m, g) { return m.C > W.rules.endureC ? g * mul(W, m) : g; },
  }),
};
}, {"../math":"src/math.js"}];
D["src/rules/evade.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 회피 (rules.evade, v2.0 기본 켬, SPEC 24장)
 * k = log₂ max(C, 1). 달리기·구르기 속도 × (1 + 0.25·k), 구르기 간격 ÷ (1 + 0.2·k). 결정론 log.
 * 평범 × 1, 중간 × 1.33, 상위 × 1.58, 대마법사 × 1.83 */
const { log } = require('../math');
const LN2 = log(2);
// 선명도마다 한 번 잰다
function mul(m) { if (m._evC !== m.C) { m._evC = m.C; const k = log(Math.max(m.C, 1)) / LN2; m._evS = 1 + 0.25 * k; m._evR = 1 + 0.2 * k; } }
module.exports = {
  name: 'evade', switch: 'evade', on: W => W.rules.evade,
  engine: () => ({
    speed(W, m, sp) { mul(m); return sp * m._evS; },
    roll(W, m, o) { mul(m); o.v *= m._evS; o.cd /= m._evR; },
  }),
};
}, {"../math":"src/math.js"}];
D["src/rules/fireLane.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 사선 (rules.fireLane, v2.30, SPEC 53장, 수는 data/rules/fireLane.json) — 기본 꺼짐
 * 총은 쏘기 전에 사선을 본다: 쏘는 자리에서 과녁 너머 사거리 끝까지, 총의 흔들림(0.004 + 0.0004 × 거리 rad)이 벌어지는 띠 안에
 *   우리 편이 서 있으면(높이 차 1.2 m 안) 쏘지 않는다. 빗나간 총알은 사거리 끝까지 날아가니 과녁 너머도 본다
 * 화승이 타는 동안 우리 편이 사선에 들어오면 방아쇠를 늦춘다(wait s까지, 넘으면 시전을 거둔다: 장전은 쏠 때만 돈다)
 * 막혔으면 옆으로 비켜 사선을 연다(과녁 쪽에 직각, 막은 사람의 반대쪽). 열리면 다시 쏜다 */
const P = require('../../data/rules/fireLane.json'), AR = require('../../data/rules/army.json');
const BL = new WeakMap();   // 사람 → { t: 막힌 걸 본 시각, sx: 비킬 쪽 }
const HOLD = new WeakMap();   // 시전 → 늦춘 시간
const mark = (W, m, k) => { let b = BL.get(m); if (!b) BL.set(m, b = { t: 0, sx: 0 }); b.t = W.t; b.sx = -k; };
// 사선을 막은 우리 편: 막은 사람이 과녁 쪽 기준 어느 옆에 섰는지(+1·−1), 없으면 0
function lane(W, m, tx, ty, R) {
  const dx = tx - m.x, dy = ty - m.y, d = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / d, uy = dy / d, ang = (AR.musket.aimN + AR.musket.aimD * d) * m._nm * (m.st.blind > 0 ? 3 : 1);   // 흔들림은 core와 같은 셈
  for (const q of W.ms) { if (q === m || q.side !== m.side || !(q.hp > 0) || q.z - m.z > 1.2 || m.z - q.z > 1.2) continue;
    const rx = q.x - m.x, ry = q.y - m.y, t = rx * ux + ry * uy; if (t < -q.r - P.pad || t > R) continue;   // 붙어 선 사람은 총구에서 바로 맞는다
    const s = rx * -uy + ry * ux, w = q.r + P.pad + ang * t * P.k; if (s < w && s > -w) return s >= 0 ? 1 : -1; }
  return 0;
}
module.exports = {
  name: 'fireLane', switch: 'fireLane', api: { P, lane },
  engine: X => ({
    mageStep(W, m) {
      const c = m.cast; if (!c || !c.s.mundane || c.s.t !== 'proj' || c.t + W.dt < c.T) return;
      const q = c.tgt && c.tgt.hp > 0 ? c.tgt : null, R = X.rangeOf(m, c.s); let k = lane(W, m, c.tx, c.ty, R);
      if (!k && q) { const f = X.hyp(q.x - m.x, q.y - m.y) / c.s.v; k = lane(W, m, q.x, q.y, R) || lane(W, m, q.x + q.vx * f, q.y + q.vy * f, R); }   // 지금 자리와 앞질러 겨눌 자리 (rules/gunfire)
      if (!k) return;
      mark(W, m, k); const h = (HOLD.get(c) || 0) + W.dt; if (h > P.wait) { m.cast = null; return; }
      HOLD.set(c, h); c.T += W.dt;   // 방아쇠를 늦춘다
    },
  }),
  brain: B => ({
    valueLate(W, m, K, o) {
      const s = o.s; if (!s.mundane || s.t !== 'proj' || !(o.v > 0)) return;
      const k = lane(W, m, o.tx, o.ty, B.C.rangeOf(m, s)); if (!k) return;
      o.v = 0; mark(W, m, k);
    },
    steer(W, m, K) {
      const b = BL.get(m); if (!b || W.t - b.t > P.hold || K.dodge || m.flee) return;
      K.vx += -K.uy * b.sx * P.side; K.vy += K.ux * b.sx * P.side;   // 막은 사람의 반대쪽으로 비킨다
    },
  }),
};
}, {"../../data/rules/fireLane.json":"data/rules/fireLane.json","../../data/rules/army.json":"data/rules/army.json"}];
D["src/rules/flight.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 비행 (rules.flight, v2.0 기본 켬, SPEC 24장, 수는 data/rules/flight.json) — 대마법사는 걷지 않는다
 * 높이 하나를 더한 2.5차원. 출력 P = 2 kW × C^2.5 × 피로 배수, 75 kW 이상(상위부터)이 뜬다.
 * 드는 힘: 떠 있기 150 kW/(1 + (v/20)²) × 오르내림 몫, 앞으로 0.135·v³, 오르기 80·g·vz. 부하 L = 든 힘 / P.
 * 떠 있으면(z ≥ 1): 서클 − 1(60 m/s 넘으면 공기막으로 − 1 더), 위력 × 0.8 × clamp(1.15 − 0.6L, 0.5, 1), 흔들림 × (1 + L), 머리 피로 초당 1 + 6L (+ 40(L − 1)),
 *   안 보이는 발밑 공격·함정·지대·빙판 면역, 번개 × 1.3, 보이는 구름 × 1.3. z > 2면 바위·벽을 넘고 가리지도 않는다(core).
 * 움직임: 앞 가속 3 g와 남는 힘, 옆 가속 min(5 g, k·v²)(코너 속도 ≈ 25 m/s), 오르내림 8 m/s, 높이는 속도의 저금통. 날다 굳으면 떨어진다(높이 × 4, 1 s 굳음).
 * 두뇌: 판단할 때마다 목표 속도(fv)·높이(fz)·뜨기(flyWant)를 고른다. 판단 수준은 tac.flySkill (1 초보 … 5 전설)
 * 날기 끊기 (v2.3, rules.flightCut, SPEC 27장, 수는 flight.json의 cut): 두뇌가 m.cut.w로 청하면 걸음에서 한다(굳음·묶임이면 못 한다, 간격 0.6 s, 머리 피로 1.5)
 *   급정지(1): 거꾸로 뿜어 5 g로 멈춘다 · 옆 튀기(2): 0.25 s 동안 옆으로 5 g (속도와 상관없이, 날며 꺾는 옆 가속은 v²에 묶인다) · 튀어오르기(3): 0.3 s 동안 위로 3 g (땅에서도)
 *   떨어지기(4): 뜨는 힘을 끊고 중력으로 · 내리꽂기(5): 아래로 4 g를 더 뿜는다. 끊은 동안(fly 3)은 비행에 묶였던 서클 하나·출력(위력 × 0.8 · 부하)·흔들림이 풀린다: 내려앉으며 치기 (풀리는 순간 끊는다)
 *   공기 쿠션: 떨어지는 중 cut.z 높이에 닿으면 위로 5 g(알짜 4 g)를 뿜어 2 m/s로 늦춘다. 뜨고 싶으면 그 자리에서 다시 난다(받아 잡기).
 *     4 m/s 넘게 땅에 닿으면 추락: 피해 = 닿는 속도의 높이(v²/2g) × 4 (그냥 떨어지면 높이 × 4), 1 s 굳음. 날다 굳어 떨어진 사람(fly 2)도 굳음이 풀리면 쿠션을 뿜을 수 있다 */
const { pow, hyp, clamp } = require('../math');
const F = require('../../data/rules/flight.json');
const { saltR } = require('./saltRing').api, SR = require('./saltRing').api;
const { aOf } = require('./snap').api;   // 끊는 움직임 (v2.4): 옆·오르내림 가속의 바닥
const G = F.g, M = F.mass, OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 }, CU = F.cut;
// 출력 (W). C^2.5는 선명도마다 한 번
function outP(m) { if (m._flC !== m.C) { m._flC = m.C; m._flP = F.P0 * pow(Math.max(m.C, 0.01), F.Pk); } return m._flP * Math.max(0.6, 1 - Math.min(m.fat, 100) / 200); }
const canFly = m => outP(m) >= F.minP;
// 싸움터 끝·소금 선까지 지금 방향으로 남은 거리 (브레이크를 잡을 거리)
function room(W, m, ux, uy) {
  let t = 1e9;
  if (ux > 0) t = Math.min(t, (W.width - m.x) / ux); else if (ux < 0) t = Math.min(t, m.x / -ux);
  if (uy > 0) t = Math.min(t, (W.height - m.y) / uy); else if (uy < 0) t = Math.min(t, m.y / -uy);
  if (W.rules.saltRing) { const R = saltR(W), px = m.x - W.width / 2, py = m.y - W.height / 2, b = px * ux + py * uy, c = px * px + py * py - R * R, q = b * b - c;
    if (c < 0 && q >= 0) t = Math.min(t, -b + Math.sqrt(q)); }
  return t;
}
// 떨어지기 시작
function fall(m) { m.fly = 2; m.fallZ = m.z; if (m.vz > 0) m.vz = 0; }
// 끊기 시작 (v2.3): 두뇌가 청한 것(cut.w)을 한다. 굳음·묶임·간격 중이거나 뜰 힘이 없으면 못 한다
function cutStart(W, m) {
  const k = m.cut.w; m.cut.w = 0;
  if (m.cut.cd > 0 || m.st.stun > 0 || m.st.root > 0 || !canFly(m) || m.cut.k) return;
  const v = hyp(m.vx, m.vy), lg = m.flog;
  if (k === 3) { if (m.fly > 1) return; if (m.fly === 0) { m.fly = 1; m.vz = 0; m._flT0 = W.t; } m.cut.k = 3; m.cut.t = CU.hopT; lg.hop++; }   // 튀어오르기 (땅에서도)
  else if (m.fly !== 1) return;
  else if (k === 1) { if (v < 2) return; m.cut.k = 1; m.cut.t = Math.min(0.6, v / (CU.brake * G)); lg.brake++; }
  else if (k === 2) { m.cut.k = 2; m.cut.t = CU.sideT; lg.side++; }
  else if (k === 4 || k === 5) { if (m.z < CU.minZ) return; m.fly = 3; m.cut.k = k; m.cut.z0 = m.z; m.load = 0; m.cut.on = false; if (m.vz > 0) m.vz = 0; if (k === 5) lg.dive++; else lg.drop++; }
  else return;
  lg.cut++; m.cut.cd = CU.cd;
  if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + CU.fat);
}
// 떨어지기·내리꽂기 (fly 3): 중력(+ 아래로 뿜기), 공기 쿠션, 받아 잡기, 닿기
function dropStep(W, m, hurt) {
  if (m.st.stun > 0) m.cut.on = false;
  else if (!m.cut.on && m.cut.z >= 0 && m.z <= m.cut.z) { m.cut.on = true; m.flog.cush++; if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + CU.fat); }
  if (m.cut.on) {
    if (m.vz < -CU.soft) { m.vz += (CU.cush - 1) * G * W.dt; if (m.vz > -CU.soft) m.vz = -CU.soft; }
    else if (m.flyWant && m.z >= 0.5 && canFly(m)) { m.fly = 1; m.cut.k = 0; m.cut.z = -1; m.cut.on = false; m.vz = -CU.soft; return; }   // 받아 잡기: 그 높이에서 다시 난다
    else m.vz = -CU.soft;
  } else m.vz -= (m.cut.k === 5 ? 1 + CU.dive : 1) * G * W.dt;
  m.z += m.vz * W.dt; m.flog.dz -= m.vz * W.dt; const k = 1 - 0.3 * W.dt; m.vx *= k; m.vy *= k; edge(W, m);
  if (m.z <= 0) {
    const v = -m.vz; m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; m.cut.k = 0; m.cut.z = -1; m.cut.on = false;
    if (v > CU.safeV) { m.flog.crash++; m.flog.falls++; hurt(W, m, v * v / (2 * G) * F.fall, null, '추락', 'fall'); m.st.stun = Math.max(m.st.stun, F.fallStun); m.cast = m.castB = m.chan = null; }   // 쿠션을 못 뿜었다
  }
}
// 날기 끊기의 판단 (v2.3, 27장). lv = tac.flyCut: 1 상급(위협에 맞춰 뜨고 내려앉기: 발밑을 노리는 수에 튀어오르기),
// 2 대가(급정지·떨어지기·옆 튀기로 공중 회피, 공기 쿠션), 3 전설(+ 쏘는 순간 높이 속이기, 내려앉으며 치기). 뜨기·높이는 CB로 돌려준다
const CB = { want: false, fz: 0 }, CBR = CU.brain;
const GROUND = s => s.t === 'trap' || (s.t === 'area' && !s.vis) || (s.t === 'zone' && s.z && (s.z.k === 'ice' || s.z.k === 'fire' || s.z.k === 'acid' || s.z.k === 'spore' || s.z.k === 'nh3'));
// 공기 쿠션을 뿜을 높이: 지금 아래로 v, 높이 z에서 아래로 ad로 떨어지다 위로 ac로 늦추면 h = (v² + 2·ad·z) / (2(ac + ad))에서 뿜어야 땅에서 멈춘다
function cushAt(z, vd, dive, lv) { const ad = (dive ? 1 + CU.dive : 1) * G, ac = (CU.cush - 1) * G; return (vd * vd + 2 * ad * z) / (2 * (ac + ad)) + CBR.margin[lv]; }
const cushH = (m, lv) => cushAt(m.z, m.vz < 0 ? -m.vz : 0, m.cut.k === 5 && !m.cut.on, lv);
// 적의 대공 지대(하늘 덮개, rules/fort)가 나나 과녁 위에 있나: 그 아래로는 내리꽂지 않는다 (굳으면 쿠션을 못 뿜는다)
function antiAir(W, m, e) { for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && (hyp(z.x - e.x, z.y - e.y) < z.r + 2 || hyp(z.x - m.x, z.y - m.y) < z.r + 2)) return true;
  return false; }
function cutBrain(W, m, K, lv) {
  const T = m.tac, e = K.e;
  // 쿠션 높이: 떨어지는 중이면 판단 때마다 다시 잰다(대가부터). 회피로 떨어졌으면 3.5 m 아래에서 받아 잡는다
  if (lv >= 2 && (m.fly === 3 || (m.fly === 2 && !(m.st.stun > 0)))) { let h = cushH(m, lv); if (m.fly === 3) { const c = m.cut.z0 - (m.cut.k === 4 ? CBR.catchS : CBR.catch); if (c > h) h = c;
      } m.cut.z = h; }
  if (m.cut.cd > 0 || m.cut.k || m.fly > 1 || m.st.stun > 0 || m.st.root > 0) return;
  const read = T.readCast && !K.blindR;
  // 상급부터: 땅에서 발밑·함정·지대로 나를 노리는 수가 곧 풀리면 튀어오른다
  if (m.fly === 0) {
    if (!read) return;
    for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (c && !c.unseen && c.tgt === m && GROUND(c.s) && c.T - c.t < CBR.hopRead) { m.cut.w = 3; CB.want = true;
        if (CB.fz < F.brain.zLow) CB.fz = F.brain.zLow; return; } }
    return;
  }
  if (lv < 2) return;
  // 대가부터: 공중 회피. 날아오는 투사체(0.45 s 안에 1.2 m 안으로, 높이 차 1.2 m 안), 떨어질 보이는 구름.
  // 전설(높이 속이기): 투사체는 풀리는 순간 내 높이로 겨눠진다 — 그동안 높이를 지키다 풀린 뒤 일찍(0.8 s 안) 위·아래로 바꾼다. 실은 풀리는 순간의 내 높이를 따라오니 옆으로 (풀리기 0.25 s 전)
  let tx = 0, ty = 0, how = 0; const v = hyp(m.vx, m.vy), tca = lv >= 3 && T.flyFeint !== false ? CBR.tcaL : CBR.tca;
  for (const p of W.proj) {
    if (p.src.side === m.side) continue;
    const rx = m.x - p.x, ry = m.y - p.y, rvx = m.vx - p.vx, rvy = m.vy - p.vy, vv = rvx * rvx + rvy * rvy; if (vv < 1) continue;
    const t = -(rx * rvx + ry * rvy) / vv; if (t < 0 || t > tca) continue;
    if (hyp(rx + rvx * t, ry + rvy * t) > CBR.miss || Math.abs(p.z + (p.vz || 0) * t - m.z) > 1.2) continue;
    tx = p.vx; ty = p.vy; how = 1; break;
  }
  if (!how) for (const a of W.areas) { if (a.src.side === m.side || !a.vis || a.t > CBR.tca) continue; const px = m.x + m.vx * a.t - a.x, py = m.y + m.vy * a.t - a.y;
    if (hyp(px, py) < a.r + 0.5) { tx = -py; ty = px; how = 2; break; } }   // 구름: 가운데에서 먼 쪽으로
  if (!how && lv >= 3 && T.flyFeint !== false && read) for (const q of K.foes) { const c = q.cast;
    if (c && c.tgt === m && (c.s.t === 'thread' || c.s.t === 'touch') && c.T - c.t < CBR.release) { tx = m.x - q.x; ty = m.y - q.y; how = 3; if (m._feC !== c) { m._feC = c; m.flog.hfeint++; } break;
      } }   // 실: 풀리기 직전 옆으로
  if (how) {
    if (how === 1 && lv >= 3 && T.flyFeint !== false) { if (m.z >= 5) { m.cut.w = 5; const h = cushAt(m.z, 0, true, lv), c = m.z - CBR.catch; m.cut.z = h > c ? h : c; } else m.cut.w = 3;
      m.flog.hfeint++; }   // 높이 속이기: 겨눠진 높이에서 벗어난다
    else if (how === 1 && m.z >= 5) { m.cut.w = 5; const h = cushAt(m.z, 0, true, lv), c = m.z - CBR.catch; m.cut.z = h > c ? h : c; }   // 높으면 내리꽂았다 받아 잡는다
    else if (how === 1 && v > 15) m.cut.w = 1;                                                        // 빠르면 급정지 (앞길 겨냥이 빗나간다)
    else {   // 옆 튀기 (가던 쪽에 가까운 옆)
      const l = hyp(tx, ty) || 1; let sx = -ty / l, sy = tx / l; if (how === 2) { sx = tx / l; sy = ty / l; } else if (sx * m.vx + sy * m.vy < 0) { sx = -sx; sy = -sy; }
      if (W.rules.saltRing && SR.safeOn(m)) { const k = CU.side * G * CU.sideT * CU.sideT / 2 + 0.3; if (!SR.safeAt(W, m.x + sx * k + m.vx * CU.sideT, m.y + sy * k + m.vy * CU.sideT)) { sx = -sx;
          sy = -sy; if (!SR.safeAt(W, m.x + sx * k + m.vx * CU.sideT, m.y + sy * k + m.vy * CU.sideT)) return; } }   // 소금 원 밖으로 튀지 않는다 (v2.6)
      m.cut.x = sx; m.cut.y = sy; m.cut.w = 2;
    }
    return;
  }
  // 전설: 내려앉으며 치기. 내 공격이 곧(0.25 s 안) 풀리면 뜨는 힘을 끊는다: 풀리는 순간 비행에 묶였던 서클·출력(위력 × 0.8 · 부하)이 풀린다. 2 m 떨어진 뒤 받아 잡는다 (2 s에 한 번, 적의 덮개 밑은 빼고)
  const c = m.cast;
  if (lv >= 3 && T.flyStrike !== false && c && OFF[c.s.t] && !c.auto && c.T - c.t < CBR.strikeT && m.z >= CBR.strikeZ && W.t - m.cut.nT > CBR.again && !K.aimed && !(e.cast && e.cast.tgt === m) && !antiAir(W, m, e)) {   // 나를 겨눈 수가 없을 때만 (끊은 동안은 옆 튀기를 못 하고, 굳으면 쿠션을 못 뿜는다)
    m.cut.w = 4; const h = cushAt(m.z, 0, false, lv), k = m.z - CBR.catchS; m.cut.z = h > k ? h : k;
  }
}
// 끊는 움직임의 가속 a에 규칙이 곱한다: 빠른 판의 꺾기 (rules/pace, v2.14)
function aF(W, m) { let a = aOf(W, m); const h = W.H.flyAccel; for (let i = 0; i < h.length; i++) a = h[i](W, m, a); return a; }
module.exports = {
  name: 'flight', switch: 'flight', on: W => W.rules.flight, api: { F, outP, canFly, aF: (W, m) => aF(W, m) },
  engine: X => {
    const { hurt } = X;
    return {
      init(W) { W._fly = true; },   // 녹화에 높이·속도를 적는다
      mageStep(W, m) {
        if (m.cut.cd > 0) m.cut.cd -= W.dt;
        if (m.fly === 1) {
          if (m.st.stun > 0) fall(m);   // 날다가 굳으면(폭주 포함) 떨어진다
          else {
            const L = m.load;
            if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + (F.fat[0] + F.fat[1] * L + (L > 1 ? F.fat[2] * (L - 1) : 0)) * W.dt);
            const v = hyp(m.vx, m.vy); m.airFilm = false;
            if (v > F.film) { if (m.circles >= 3) m.airFilm = true; else m.st.blind = Math.max(m.st.blind, F.filmBlind); }   // 공기막이 없으면 눈이 먼다
            const lg = m.flog; lg.t += W.dt; lg.v += v * W.dt; lg.v2 += v * v * W.dt; if (v > F.corner - 5 && v < F.corner + 5) lg.corner += W.dt;
          }
        }
        m._nm = m.z >= 1 && m.fly !== 3 ? 1 + m.load : 1;   // 겨냥 흔들림 × (1 + L). 끊은 동안은 풀린다 (v2.3)
      },
      // 걸음: 나는 사람·떨어지는 사람은 여기서 움직인다 (땅의 걸음을 건너뛴다)
      move(W, m) {
        if (m.cut.w && W.rules.flightCut) cutStart(W, m);   // 날기 끊기 (v2.3)
        if (m.fly === 0) {
          if (!(m.flyWant && !(m.st.stun > 0 || m.st.root > 0) && canFly(m) && !(W.salt.length && X.onSalt(W, m.x, m.y)))) return false;
          m.fly = 1; m.vz = 0; m._flT0 = W.t;   // 이륙
        }
        if (m.roll > 0) m.roll -= W.dt;
        if (m.fly === 2 && W.rules.flightCut && !(m.st.stun > 0) && m.cut.z >= 0) { m.fly = 3; m.cut.k = 4; m.cut.z0 = m.fallZ; m.cut.on = false; }   // 굳음이 풀렸다: 쿠션을 뿜을 수 있다 (v2.3)
        if (m.fly === 3) { dropStep(W, m, hurt); return true; }   // 끊었다 (v2.3)
        if (m.fly === 2) {   // 떨어진다
          m.vz -= G * W.dt; m.z += m.vz * W.dt; m.flog.dz -= m.vz * W.dt; const k = 1 - 0.5 * W.dt; m.vx *= k; m.vy *= k; edge(W, m);
          if (m.z <= 0) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; m.flog.falls++; hurt(W, m, m.fallZ * F.fall, null, '추락', 'fall'); m.st.stun = Math.max(m.st.stun, F.fallStun);
            m.cast = m.castB = m.chan = null; }
          return true;
        }
        const P = outP(m), want = m.flyWant && P >= F.minP && !(W.salt.length && X.onSalt(W, m.x, m.y)), fz = want ? clamp(m.fz, F.zMin, F.zMax) : 0;
        let v = hyp(m.vx, m.vy);
        // 오르내림 (목표 높이로). 튀어오르기는 위로 3 g (v2.3)
        if (m.cut.k === 3) m.vz += CU.hop * G * W.dt;
        else { const vzT = clamp((fz - m.z) * 2, -F.vzMax, F.vzMax), va = W.rules.snap && m.tac.footwork >= 2 ? Math.max(F.vzAcc, aF(W, m)) : F.vzAcc; m.vz += clamp(vzT - m.vz, -va * W.dt, va * W.dt);
          }
        const r = v / F.liftV, lift = F.lift / (1 + r * r) * clamp(1 + m.vz / F.glideVz, 0, 1), drag = F.drag * v * v * v;
        let spare = P - lift - drag, climb = 0;
        if (m.vz > 0) {   // 오르기: 남는 힘으로, 모자라는 몫은 속도에서 (높이는 속도의 저금통)
          climb = M * G * m.vz; const have = spare > 0 ? spare : 0;
          if (climb > have) {
            const dv2 = 2 * (climb - have) * W.dt / M;
            if (v * v > dv2) { const nv = Math.sqrt(v * v - dv2); m.vx *= nv / v; m.vy *= nv / v; v = nv; }
            else { m.vz = (have + v * v * M / (2 * W.dt)) / (M * G); m.vx = m.vy = 0; v = 0; climb = M * G * m.vz; }
            spare = spare < 0 ? spare : 0;
          } else spare -= climb;
        } else if (m.vz < 0 && v > 1) { const nv = Math.sqrt(v * v - 2 * G * m.vz * W.dt); m.vx *= nv / v; m.vy *= nv / v; v = nv; }   // 내리꽂으면 힘 없이 속도가 붙는다
        // 앞·옆 가속
        const mx = m.mv.x, my = m.mv.y, ml = hyp(mx, my), fv = m.st.root > 0 || !ml ? 0 : clamp(m.fv, 0, F.vMax);
        const tx = ml ? mx / ml * fv : 0, ty = ml ? my / ml * fv : 0, dx = tx - m.vx, dy = ty - m.vy;
        let ux = 1, uy = 0; if (v >= 1) { ux = m.vx / v; uy = m.vy / v; } else if (ml) { ux = mx / ml; uy = my / ml; }
        const vv = M * (v > 5 ? v : 5), gF = W.rules.snap && m.tac.footwork >= 2 ? Math.max(F.fwdG * G, aF(W, m)) : F.fwdG * G, fwd = spare >= 0 ? Math.min(gF, spare / vv) : Math.max(-gF, spare / vv);   // 끊는 움직임: 앞뒤 가속의 한계도 a (앞으로는 여전히 남는 힘에 묶인다, v2.4)
        const al = dx * ux + dy * uy, at = -dx * uy + dy * ux;
        const aL = Math.min(clamp(al / W.dt, -gF, gF), fwd);   // 힘이 모자라면(fwd < 0) 늦춰진다
        const k = F.latK * clamp(spare / F.latP, 0.1, 1), latMax = Math.max(Math.min(F.latG * G, Math.max(k * v * v, v < 5 && fwd > 0 ? fwd : 0)), W.rules.snap && m.tac.footwork >= 2 ? aF(W, m) : 0);   // 끊는 움직임: 느려도 a로 꺾는다 (v2.4)
        const aT = clamp(at / W.dt, -latMax, latMax);
        if (m.cut.k === 1) { const a = CU.brake * G * W.dt; if (v > a) { m.vx -= ux * a; m.vy -= uy * a; } else m.vx = m.vy = 0; }   // 급정지: 거꾸로 5 g (v2.3)
        else if (m.cut.k === 2) { const a = CU.side * G * W.dt; m.vx += m.cut.x * a; m.vy += m.cut.y * a; }                             // 옆 튀기: 옆으로 5 g
        else { m.vx += (aL * ux - aT * uy) * W.dt; m.vy += (aL * uy + aT * ux) * W.dt; }
        if (m.cut.k && m.cut.k < 4 && (m.cut.t -= W.dt) <= 0) m.cut.k = 0;
        const nv = hyp(m.vx, m.vy); if (nv > F.vMax) { m.vx *= F.vMax / nv; m.vy *= F.vMax / nv; }
        edge(W, m);
        m.z += m.vz * W.dt; m.flog.dz += Math.abs(m.vz) * W.dt; if (m.z > F.zMax) { m.z = F.zMax; m.vz = 0; }
        m.load = (lift + drag + climb) / P;
        if (m.z <= 0) { m.z = 0; m.vz = 0; if (!want) { m.fly = 0; m.load = 0; } }   // 내려앉아 걷는다
        return true;
      },
      power(W, m, s, x) { return m.z >= 1 && m.fly !== 3 && !s.mundane ? x * F.pow * clamp(F.powL[0] - F.powL[1] * m.load, F.powL[2], 1) : x; },
      hurtMod(W, m, v, kind) { return m.z >= 1 && kind === 'elec' ? v * F.elec : v; },
      // 지연 폭발: 안 보이는 발밑 공격엔 닿지 않고, 보이는 구름은 × 1.3 (번개 구름은 hurtMod가 이미 × 1.3)
      areaHit(W, q, a, sole) { if (!(q.z >= 1)) return sole; if (!a.vis) return 0; return a.s.kind === 'elec' ? sole : sole * F.cloud; },
      roll(W, m, o) { if (m.fly !== 0) o.skip = true; },   // 나는 사람은 구르지 않는다(꺾는다)
      // 스쳐 치기: 빠르게 날며 쏜 공격이 2 s 안에 맞았나
      release(W, m, c) {
        if (m.fly === 1 && !c.auto && OFF[c.s.t] && hyp(m.vx, m.vy) > F.graze.v) { m.flog.grazeTry++; m._grazeN = c.s.n; m._grazeT = W.t; }
        if (m.fly === 3 && OFF[c.s.t]) { m.flog.dropTry++; m.cut.n = c.s.n; m.cut.nT = W.t; }   // 내려앉으며 치기 (v2.3)
      },
      hurt(W, m, v, src, name) {
        if (src && src._grazeN === name && W.t - src._grazeT < F.graze.within) { src.flog.grazeHit++; src._grazeN = null; }
        if (src && src.cut.n === name && W.t - src.cut.nT < CU.within) { src.flog.dropHit++; src.cut.n = null; }
      },
    };
  },
  brain: B => {
    const Bn = F.brain;
    // 떠 있는 적에게 헛된 수: 곡사(2 m 위), 안 보이는 발밑 공격·함정·해로운 지대, 가두는 기둥
    const useless = (s, e) => (s.t === 'lob' && e.z >= 2) || (s.t === 'area' && !s.vis) || s.t === 'trap' || (s.t === 'cage' && e.z > 2) || (s.t === 'zone' && s.z && s.z.k !== 'smoke' && s.z.k !== 'mist' && s.z.k !== 'absorb' && s.z.k !== 'rain');
    const binds = s => s.t === 'thread' || s.t === 'touch' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root));
    return {
      circles(W, q, c) { return q.z >= 1 && q.fly !== 3 ? Math.max(1, c - 1 - (q.airFilm ? 1 : 0)) : c; },   // 떠 있기에 서클 하나, 공기막에 하나 더. 끊은 동안은 풀린다 (v2.3)
      // 속도 판단: 목표 속도·높이·뜨기 (SPEC 24장 표)
      steer(W, m, K) {
        const P = outP(m);
        if (P < F.minP) { m.flyWant = false; return; }
        const T = m.tac, L = T.flySkill || 3, e = K.e, sustain = P >= F.lift;
        let ground = 0, elec = 0, elecT = false;
        for (const a of W.areas) if (a.src.side !== m.side && hyp(a.x - m.x, a.y - m.y) < a.r + Bn.danger) { if (!a.vis) ground++; else if (a.s.kind === 'elec') elec++; }
        for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < Bn.danger) ground++;
        for (const z of W.zones) if (z.src.side !== m.side && z.dps && hyp(z.x - m.x, z.y - m.y) < (z.r || 2) + Bn.danger) ground++;
        let near = 0, guns = 0, gunsFar = 0; for (const q of K.foes) { const dq = hyp(q.x - m.x, q.y - m.y); if (dq < Bn.crowd) near++;
          if (q._gun === undefined) q._gun = q.book.some(n => W.spells[n] && W.spells[n].mundane && W.spells[n].t === 'proj'); if (q._gun && dq < Bn.gunR) guns++;
          if (q._gun && dq < Bn.gunFar) gunsFar++; } if (near >= 3) ground++;
        if (T.readCast) for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast;
          if (c && !c.unseen && (c.s.kind === 'elec' || c.s.t === 'thread') && hyp(c.tx - m.x, c.ty - m.y) < 3) elecT = true; }
        const ec = T.readCast ? e.cast : null, eBig = !!(ec && ec.s.big), myBig = !!(m.cast && m.cast.s.big), far = K.stance === 'kite' || K.stance === 'breakout';
        let want = true, fv = F.corner, fz = Bn.z;
        if (L <= 1) { want = K.d > Bn.near; fv = F.vMax; }   // 초보: 걷거나 전속
        else if (L === 2) fv = m.cast ? Bn.hover : K.d > K.prefR + 3 ? Bn.approach : Bn.slow;   // 중급: 다가갈 땐 빠르게, 쏠 땐 멈춤
        else { if (myBig) fv = Bn.hover; else if (far) fv = F.vMax; else if (eBig) fv = F.corner; }   // 상급: 코너 속도
        if (L >= 4) {
          if (eBig) fz = ec.T - ec.t > 0.5 ? Bn.zHigh : Bn.zLow;   // 대가: 솟구쳤다 내리꽂기 (높이를 속도로)
          const c = m.cast; if (c && !myBig && OFF[c.s.t] && c.T - c.t < 0.3) fv = Math.min(fv, Bn.slow);   // 스쳐 치기: 치는 순간만 감속
        }
        if (L >= 5 && eBig && !myBig) {   // 전설: 일정 속도로 앞길을 읽게 한 뒤, 떨어지기 직전 급감속·급상승
          if (ec.T - ec.t < 0.3) { fv = Bn.hover; fz = Math.min(F.zMax, m.z + 6); if (m._feC !== ec) { m._feC = ec; m.flog.feint++; } } else fv = Bn.feintV;
        }
        if (K.dodge && L >= 2) fv = Math.max(fv, F.corner);   // 피할 땐 구르지 않고 옆으로 내달린다 (걸음 방향은 피하기가 정했다)
        if (sustain && (m.fat > Bn.restFat || (m.wave && Bn.waveLand && !gunsFar))) want = false;   // 머리가 뜨겁거나 파도를 타면 내려앉아 식힌다 (떠 있으면 비행 피로로 파도에서 못 내려온다, v2.0 둘째)   // 머리가 뜨거우면 내려앉아 쉰다 (떠 있기도 머리를 쓴다)
        if (ground) { want = true; if (near >= 3) { fz = Bn.zCrowd; fv = Math.min(fv, Bn.vCrowd); } }   // 발밑·함정·무리가 많으면 뜬다 (무리 위에선 낮게 천천히)
        if (L >= 2 && guns >= Bn.guns) want = false;
        if (m.phase === 'out' && fv < Bn.approach) fv = Bn.approach;   // 리듬의 빠지기: 빠르게 (v2.2)
        if (m.retreat) { want = true; fz = F.zMax; fv = F.vMax; }   // 물러나기: 높이 떠 사거리 밖으로 (brain/techniques/siege)   // 총이 많으면 내려앉아 구르며 피한다 (하늘에선 구르지 못해 더 맞는다)
        else if (L >= 3 && T.readCast && (elecT || elec >= Bn.elecMany)) want = false;   // 번개 위협엔 내려앉는다
        if (!sustain) { want = want && (ground >= Bn.hopN || K.stance === 'breakout') && m.fat < Bn.tiredFat && (m.fly !== 1 || W.t - m._flT0 < Bn.hopT); fv = Math.max(fv, F.corner); fz = Bn.zLow; }   // 상위: 떠오르기·도약·활공만 (hopT 초까지)
        // 브레이크를 잡을 거리가 모자라면 늦춘다 (끝·소금 선)
        const v = hyp(m.vx, m.vy); if (v > 1) { const d = room(W, m, m.vx / v, m.vy / v) - 2, cap = Math.sqrt(2 * F.fwdG * G * (d > 0 ? d : 0)); if (fv > cap) fv = cap < Bn.slow ? Bn.slow : cap; }
        // 제 구름이 터질 때 있을 자리를 미리 비킨다 (날면 관성이 커서 지금 자리만 보면 늦다, v2.0 둘째)
        if (m.fly === 1) for (const a of W.areas) { if (a.src !== m) continue; const px = m.x + m.vx * a.t, py = m.y + m.vy * a.t, dx = px - a.x, dy = py - a.y, l = hyp(dx, dy);
          if (l < a.r + Bn.ownGap) { K.vx = (dx || 0.1) / (l || 1) * 3; K.vy = (dy || 0.1) / (l || 1) * 3; if (fv < F.corner) fv = F.corner; } }
        if (W.rules.flightCut && T.flyCut) { CB.want = want; CB.fz = fz; cutBrain(W, m, K, T.flyCut); want = CB.want; fz = CB.fz; }   // 날기 끊기 (v2.3)
        m.flyWant = want; m.fv = fv; m.fz = fz;
      },
      // 하늘에서 쉬기: 떠 있고 파도가 깊으면(restWave) 쏘기를 멈추고 머리를 식힌다 (땅의 무리는 쉽게 닿지 못한다)
      rest(W, m, K, restNow) { return restNow || (m.z >= F.zMin && m.fat > Bn.restWave); },
      // 스스로 죽지 않기 (v2.6, tac.survive, 선명도 5 이상, SPEC 30장). 모든 걸음이 정해진 뒤(bound):
      //   과열 전 착지: 머리 75 넘으면 내려앉아 식히고 45 아래에서 다시 뜬다. 땅이 위험하면(적이 함정·안 보이는 구름·벽 밀기를 가졌다: 대마법사의 함정은 위력 C^2.5로 한 방,
      //     또는 안 보이는 구름·함정·해로운 지대가 6 m 안) 내려앉지 않고 2 m로 낮춘다. 쏘기를 멈추지는 않는다: 풀 때 넘칠 수만 버린다(techniques/survive)
      //   굳을 위험엔 낮게: 상대가 나에게 굳히기·묶기·번개를 1 s 안에 풀거나 머리 70 넘으면 목표 높이 2 m (날다 굳으면 높이 × 4로 떨어진다: 3.6 m 14 → 2 m 8. 1 s 굳음은 쿠션보다 길다)
      bound(W, m, K) {
        if (!(m.tac.survive && m.C >= 5) || outP(m) < F.minP) return;
        const S = Bn.survive, c = m.cut;
        if (m.wave) c.cool = false; else if (m.fat > S.land) c.cool = true; else if (m.fat < S.up) c.cool = false;
        let risk = m.fat > S.low;
        if (!risk) for (const q of K.foes) for (let j = 0; j < 2; j++) { const x = j ? q.castB : q.cast;
          if (x && !x.unseen && x.tgt === m && (binds(x.s) || x.s.kind === 'elec') && x.T - x.t < S.lowT) risk = true; }
        if (c.cool) risk = true;
        if (B.lib.behind(W, m, K)) risk = true;   // 세운 벽 뒤: 낮게 (벽은 2 m 넘게 뜬 사람을 가리지 않는다, v2.8)
        if (c.cool && m.flyWant) {
          let bad = !B.groundSafe(W, m);
          for (const a of W.areas) if (a.src.side !== m.side && !a.vis && hyp(a.x - m.x, a.y - m.y) < a.r + S.danger) { bad = true; break; }
          if (!bad) for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < S.danger) { bad = true; break; }
          if (!bad) for (const z of W.zones) if (z.src.side !== m.side && z.dps && hyp(z.x - m.x, z.y - m.y) < (z.r || 2) + S.danger) { bad = true; break; }
          if (bad) risk = true; else m.flyWant = false;
        }
        if (risk && m.fz > F.zMin) m.fz = F.zMin;
      },
      // 떠 있는 적: 굳히기·묶기 × 2 (떨어뜨리기), 헛된 수는 버린다. 빠른 적엔 번개·구름을 앞길에. 전설은 꺾지 못하는 순간을 친다
      value(W, m, K, o) {
        const s = o.s, e = K.e; if (!(o.v > 0)) return;
        if (m.fly === 1 && s.t === 'move') { o.v = 0; return; }
        if (!(e.z >= 1)) return;
        if (useless(s, e)) { o.v = 0; return; }
        if (binds(s)) o.v *= Bn.bind;
        const ev = hyp(e.vx, e.vy);
        if (ev > Bn.leadV && (s.t === 'thread' || (s.t === 'area' && s.kind === 'elec'))) { const k = (s.t === 'area' ? s.delay * 0.5 : (o.Tw + K.d / (32 * (s.fast || 1))) * 0.6) * K.lead * (Bn.lead - 1);
          o.tx += e.vx * k; o.ty += e.vy * k; }
        if ((m.tac.flySkill || 3) >= 5 && OFF[s.t] && ev > F.corner * Bn.strike) o.v *= 1.3;
      },
    };
  },
};
function edge(W, m) {   // 싸움터 끝에선 그 방향의 속도가 0
  const x = m.x + m.vx * W.dt, y = m.y + m.vy * W.dt;
  if ((x < 0.4 && m.vx < 0) || (x > W.width - 0.4 && m.vx > 0)) m.vx = 0;
  if ((y < 0.4 && m.vy < 0) || (y > W.height - 0.4 && m.vy > 0)) m.vy = 0;
}
}, {"../math":"src/math.js","../../data/rules/flight.json":"data/rules/flight.json","./saltRing":"src/rules/saltRing.js","./snap":"src/rules/snap.js"}];
D["src/rules/fort.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 진지 (rules.fort, v2.3, SPEC 27장, 수는 data/rules/fort.json) — 싸움터에 쌓는다
 * 흙벽·석회 기둥과 구덩이는 벽 규칙(rules/bulwark)대로 무너질 때까지 남는다. 이어 세우면 방벽선이다.
 * 함정 한도: 한 사람 셋 → 서클 수만큼(trapK × 서클, 적어도 셋: 상위 5, 대마법사 10~11). 함정은 벽처럼 판 끝까지 남는다(밟히거나 치워질 때까지)
 * 옆 함정 연쇄 (rules.trapChain): 함정 하나가 터지면 같은 사람의 3.5 m 안 함정이 0.2 s 뒤 제자리에서 터진다(반지름 + 0.4 m 안, 땅에 선 적 모두). 연쇄는 이어진다
 * 하늘 덮개 (마법, 틀 zone의 지대 sky): 덮개 안에 떠 있는(z ≥ 1) 적을 0.5 s마다 번개로 굳힌다(0.4 s): 날다 굳으면 떨어진다(rules/flight). 땅엔 닿지 않는다. 비가 걷는다(core)
 * 치우기: 불(불 지대·불 구름·불 터짐·실 끝, core의 ignite)이나 비가 닿은 적의 함정은 사라진다. 벽은 산·물·벽 밀기(rules/bulwark, terrain), 날아서 넘기(2 m 위)
 * 두뇌 (선명도 5 이상, 판단 수준의 tac.fortify: 1 상급, 2 대가, 3 전설, tac.breach 대가부터):
 *   짓기(리듬의 단계 'build'): 떠보기 중에 상대가 60 m 안이면서 30 m 넘게 멀거나 물러나면(상대가 빠지기거나 −2 m/s) 진지를 세우고(35 m 넘게 떨어졌고 20 s 지났으면 새로) 계획의 다음 칸을 짓는다(세운 뒤 12 s까지)
 *   집('home'): 진지 곁(반지름 10 + 4 m)에 있고 상대가 진지 가운데 24 m 안으로 들어오면 진지 안에서 받아친다(땅에 서서, 공격 × 1.3). 빠지기는 진지로 물러난다(60 m 안이면)
 *   계획(진지 자리 A, 상대 쪽 u, 옆 p): 상급: 벽 하나(A + 3u), 함정 둘(A + 5u ± 1.5p) — 그리고 길목 함정(다가오는 적의 1.2 s 앞), 쏠 때 벽(첫 칸이 0.5 s 넘게 모으면 두 번째 칸에 벽)
 *     대가(몰이길): 하늘 덮개(A + 2u), 흙벽 넷(A + 8u ± 2.6p, ± 5.2p: 가운데 틈 하나), 끝 함정 둘(A + 8u ± 6.8p). 적이 틈(A + 8u) 4 m 안에 들면 지연 폭발을 틈의 끝(A + 5u) 쪽에 × 2
 *     전설(미끼 진지): 대가의 것 + 틈에 안 보이는 함정 셋(1.2 m 간격, 연쇄): 틈은 비어 보인다
 *   부수기(대가부터): 알아챈 적의 함정(적 곁 14 m 안)에 비·불, 나를 막는 하늘 덮개엔 비. 누구나: 떠 있으면 적의 덮개를 비킨다(안에 들었으면 내려앉는다).
 *     들어가는 중(리듬)이면 덮개 앞에서 내려앉아 걸어 들어간다: 몰이길을 지난다 */
const F = require('../../data/rules/fort.json'), BR = F.brain;
const { hyp } = require('../math');
const { saltR } = require('./saltRing').api;
// 소금 원 안인가 (여유 k m): 진지는 줄어드는 원 안쪽에만 세우고, 원 밖이 된 진지로는 물러나지 않는다
const inRing = (W, x, y, k) => !W.rules.saltRing || hyp(x - W.width / 2, y - W.height / 2) < saltR(W) - k;
const SKY = s => s.t === 'zone' && s.z && s.z.k === 'sky';
const FIRE = s => (s.t === 'area' && s.kind === 'fire') || (s.t === 'zone' && s.z && s.z.k === 'fire') || (s.t === 'proj' && s.burst && s.burst.kind === 'fire');
module.exports = {
  name: 'fort', switch: 'fort', on: W => W.rules.fort,
  engine: X => {
    const { hurt, eff, hit, addZone, rangeOf, sizeOf } = X;
    // 연쇄: t가 터졌다. 같은 사람의 옆 함정에 불을 붙인다
    function chain(W, t) { if (!W.rules.trapChain) return; for (const u of W.traps) if (u !== t && !u.done && u.src === t.src && !(u.chain > 0) && u.arm <= 0 && hyp(u.x - t.x, u.y - t.y) < F.chainR) u.chain = F.chainDelay; }
    function blast(W, t) {
      const tr = t.s.tr, src = t.src; let h = false; t.done = true; src.fort.chain++;
      for (const q of W.foes[src.side]) { if (q.z >= 1 || q.hp <= 0 || hyp(q.x - t.x, q.y - t.y) >= t.r + F.chainPad) continue; if (tr.dmg) hurt(W, q, tr.dmg * t.pow, src, t.s.n, tr.kind || 'blunt'); eff(W, q, tr); h = true; }
      if (h) hit(src, t.s);
      if (tr.zone) addZone(W, src, Object.assign({}, tr.zone, { n: t.s.n }), t.x, t.y, 0, 1);
      if (W.rec) W.fx.push(['b', t.x, t.y, t.r]);
      chain(W, t);
    }
    return {
      trapCap(W, m, n) { const k = Math.round(F.trapK * m.circles); return k > n ? k : n; },
      trapFire(W, t) { chain(W, t); },
      world(W) {
        if (W.rules.trapChain) for (const t of W.traps) if (t.chain > 0 && !t.done && (t.chain -= W.dt) <= 0) blast(W, t);
        // 하늘 덮개: 0.5 s마다 덮개 안에 떠 있는 적을 굳힌다
        if (W.step % (F.sky.every * W.sk) === 0) for (const z of W.zones) {
          if (z.k !== 'sky') continue;
          for (const q of W.foes[z.src.side]) if (q.z >= 1 && q.hp > 0 && hyp(q.x - z.x, q.y - z.y) < z.r) { hurt(W, q, F.sky.dmg, z.src, z.n, 'elec'); eff(W, q, { stun: F.sky.stun, kind: 'elec' }, 1); z.src.fort.skyZap++; }
        }
        // 몰이길로 든 적 (지표): 틈 2.5 m 안의 땅에 선 적, 진지마다 3 s에 한 번
        if (W.step % (3 * W.sk) === 0) for (const m of W.ms) {
          const P = m.fort.plan; if (!P || !P.gap || m.hp <= 0 || W.t - m.fort.gT < 3) continue;
          const gx = m.fort.x + m.fort.ux * BR.line, gy = m.fort.y + m.fort.uy * BR.line;
          for (const q of W.foes[m.side]) if (q.z < 1 && hyp(q.x - gx, q.y - gy) < BR.gapR) { m.fort.funnel++; m.fort.gT = W.t; break; }
        }
      },
      // 진지 안(반지름 + 2 m)·밖에서 적에게 받은 피해 (지표. 제 머리·소금·추락은 빼고)
      hurt(W, m, v, src) { if (m.fort.x === m.fort.x && src && src.side !== m.side) { if (hyp(m.x - m.fort.x, m.y - m.fort.y) < BR.R + 2) m.fort.inDmg += v; else m.fort.outDmg += v; } },
      // 불이 닿은 적의 함정은 탄다
      ignite(W, x, y, r, src) { if (!src || !src.fort) return; for (const t of W.traps) if (!t.done && t.src.side !== src.side && hyp(t.x - x, t.y - y) < r + t.r) { t.done = true; src.fort.clear++; src.mlog.razed++; } },
      release(W, m, c) {
        const s = c.s, f = m.fort;
        if (s.t === 'trap') f.traps++; else if (s.t === 'build' || s.t === 'wall') f.walls++; else if (SKY(s)) f.sky++;
        if (s.t === 'zone' && s.z.k === 'rain') {   // 비가 적의 함정을 씻고 덮개를 걷는다(덮개는 core가 지운다. 여기선 센다)
          const dx = c.tx - m.x, dy = c.ty - m.y, d = hyp(dx, dy) || 1, R0 = Math.min(d, rangeOf(m, s) || 4), x = m.x + dx / d * R0, y = m.y + dy / d * R0, rr = s.z.r * sizeOf(m, s);
          for (const t of W.traps) if (!t.done && t.src.side !== m.side && hyp(t.x - x, t.y - y) < rr) { t.done = true; f.clear++; m.mlog.razed++; }
          for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && z.t > 0 && hyp(z.x - x, z.y - y) < rr + z.r) { f.clear++; m.mlog.razed++; }
        }
      },
    };
  },
  brain: B => {
    const C = B.C;
    const lvOf = m => (m.C >= 5 && m.tac.fortify) || 0;   // 선명도 5 이상(상위·대마법사)만
    const el = (k, x, y, hid) => ({ k, x, y, hid: hid || 0 });
    // 진지를 세운다: 지금 자리, 상대 쪽. 계획은 판단 수준마다 (위 머리 주석)
    function found(W, m, K) {
      const e = K.e, d = K.d || 1, ux = (e.x - m.x) / d, uy = (e.y - m.y) / d, px = -uy, py = ux, lv = lvOf(m), L = BR.line, S = BR.seg;
      const at = (a, b, k, hid) => el(k, m.x + ux * a + px * b, m.y + uy * a + py * b, hid);
      m.fort.x = m.x; m.fort.y = m.y; m.fort.ux = ux; m.fort.uy = uy; m.fort.t = W.t; m.fort.founded++;
      const els = [];
      if (lv === 1) els.push(at(3, 0, 'wall'), at(5, 1.5, 'trap'), at(5, -1.5, 'trap'));
      else {
        els.push(at(BR.skyAt, 0, 'sky'));
        if (lv >= 3) els.push(at(L + 0.8, 0, 'trap', 1), at(L - 0.4, 0, 'trap', 1), at(L - 1.6, 0, 'trap', 1));   // 미끼: 틈에 안 보이는 함정 (연쇄 거리 안)
        els.push(at(L, S, 'wall'), at(L, -S, 'wall'), at(L, BR.end, 'trap'), at(L, -BR.end, 'trap'), at(L, 2 * S, 'wall'), at(L, -2 * S, 'wall'));
      }
      m.fort.plan = { els, gap: lv >= 2, nx: null, built: 0 };
    }
    // 계획의 칸이 서 있는가
    function stands(W, m, n) {
      if (n.k === 'wall') { const ws = W.walls, a = ws.length ? C.wallsIn(W, n.x - 1.5, n.y - 1.5, n.x + 1.5, n.y + 1.5) : ws; for (let i = 0; i < a.length; i++) { const w = ws[a[i]]; if (w.mk === m.id && hyp(w.x - n.x, w.y - n.y) < 1.3) return true; } return false; }
      if (n.k === 'trap') { for (const t of W.traps) if (t.src === m && !t.done && hyp(t.x - n.x, t.y - n.y) < 1.2) return true; return false; }
      for (const z of W.zones) if (z.k === 'sky' && z.src === m && hyp(z.x - n.x, z.y - n.y) < 4) return true; return false;
    }
    function next(W, m) { const P = m.fort.plan; P.nx = null; P.built = 0; for (const n of P.els) { if (stands(W, m, n)) P.built++; else if (!P.nx) P.nx = n; } return P.nx; }
    return {
      // 리듬에 더하는 단계 (rhythm.phase의 끝에서): 짓기·집. 떠보기일 때만 바꾼다(들어가기·빠지기가 먼저)
      phase(W, m, K) {
        const lv = lvOf(m); if (!lv || m.phase !== 'probe') return;
        const e = K.e, d = K.d, has = m.fort.x === m.fort.x;
        if (has && m.fort.plan) next(W, m);
        if (has && ((m.fort.plan && m.fort.plan.built) || m.fort.bpN) && hyp(m.x - m.fort.x, m.y - m.fort.y) < BR.R + 4 && hyp(e.x - m.fort.x, e.y - m.fort.y) < BR.R + BR.home) { m.phase = 'home'; K.prefR = d; K.aggr *= 1.3; return; }
        if (W.rules.blueprint) return;   // 청사진이 켜지면 짓기는 청사진 규칙이 (v2.4, rules/blueprint)
        const away = d > BR.buildD || ((e.phase === 'out' || K.vt < -2) && d > BR.backD);
        if (!away || d > BR.near) return;
        if ((!has || (hyp(m.x - m.fort.x, m.y - m.fort.y) > BR.relocate && W.t - m.fort.t > BR.again)) && inRing(W, m.x, m.y, BR.ring)) { found(W, m, K); next(W, m); }
        if (!(m.fort.x === m.fort.x)) return;
        if (W.t - m.fort.t < BR.budget && m.fort.plan.nx) { m.phase = 'build'; K.prefR = d; K.aggr *= 0.6; K.pressB = false; }
      },
      steer(W, m, K) {
        // 누구나(예비동작을 읽는 사람): 떠 있으면 적의 하늘 덮개를 비킨다. 이미 안이면 내려앉는다
        if (m.tac.readCast && !K.blindR && m.fly >= 1) for (const z of W.zones) {
          if (z.k !== 'sky' || z.src.side === m.side) continue;
          const px = m.x + m.vx * 0.8 - z.x, py = m.y + m.vy * 0.8 - z.y, l = hyp(px, py);
          if (l < z.r + 1.5) { if (m.phase === 'in') { m.flyWant = false; continue; } K.vx = px / (l || 1) * 3; K.vy = py / (l || 1) * 3; if (hyp(m.x - z.x, m.y - z.y) < z.r + 0.5) m.flyWant = false; }   // 들어가는 중이면 덮개 앞에서 내려앉아 걸어 들어간다
        }
        const lv = lvOf(m); if (!lv || !(m.fort.x === m.fort.x) || K.dodge) return;
        const P = m.fort.plan, ph = m.phase; let tx = NaN, ty = NaN;
        if (ph === 'build' && P && P.nx && !W.rules.blueprint) { tx = m.fort.x; ty = m.fort.y; if (P.nx.k === 'wall') { tx = P.nx.x - m.fort.ux * BR.wallAt; ty = P.nx.y - m.fort.uy * BR.wallAt; } }
        else if (ph === 'home') { tx = m.fort.x; ty = m.fort.y; }
        else if (ph === 'out' && hyp(m.x - m.fort.x, m.y - m.fort.y) < BR.near && inRing(W, m.fort.x, m.fort.y, 5)) { tx = m.fort.x; ty = m.fort.y; }   // 빠지기: 진지로 (진지가 소금 원 안이면)
        if (!(tx === tx)) return;
        const dx = tx - m.x, dy = ty - m.y, l = hyp(dx, dy);
        if (l > 0.4) { const k = l > 2 ? 2 : l; K.vx = dx / l * k; K.vy = dy / l * k; } else if (ph !== 'out') { K.vx = 0; K.vy = 0; }
        if (m.fv > 2 + l * 1.5) m.fv = 2 + l * 1.5;   // 날아가면 넘치지 않게
        if ((ph === 'build' && P.nx.k === 'wall' && l < 12) || (ph === 'home' && l < 4)) m.flyWant = false;   // 벽은 땅에서 세운다, 집에선 땅에 선다
      },
      value(W, m, K, o) {
        const lv = lvOf(m), s = o.s, e = K.e; if (!lv) return;
        const R = C.rangeOf(m, s), P = m.fort.plan;
        // 상급부터: 길목 함정(땅에서 다가오는 적의 1.2 s 앞), 쏠 때 벽(첫 칸이 0.5 s 넘게 모으거나 큰 수면 두 번째 칸에 벽을 상대 쪽으로)
        if (s.t === 'trap' && e.z < 1 && K.vt > 1 && K.d < 6 * Math.sqrt(m.C)) { const tx = e.x + e.vx * 1.2, ty = e.y + e.vy * 1.2; if (hyp(tx - m.x, ty - m.y) > 3 && o.v < 1) { o.v = 1; o.tx = tx; o.ty = ty; } }
        if (K.slot === 'B' && s.t === 'wall' && m.cast && (m.cast.T >= 0.5 || m.cast.s.big) && K.los && K.d < 25 && o.v < 1) { o.v = 1; o.tx = e.x; o.ty = e.y; }
        // 짓기: 계획의 다음 칸. 집에선 덮개만 다시 깐다
        const n = !W.rules.blueprint && P && P.nx;   // 청사진이 켜지면 칸 하나씩 짓지 않는다
        if (n && (m.phase === 'build' || (m.phase === 'home' && n.k === 'sky'))) {
          if (n.k === 'sky' && SKY(s) && hyp(n.x - m.x, n.y - m.y) < R) { o.v = 2.5; o.tx = n.x; o.ty = n.y; }
          else if (n.k === 'trap' && s.t === 'trap' && !(n.hid && s.vis) && hyp(n.x - m.x, n.y - m.y) < 6 * Math.sqrt(m.C) - 0.3) { o.v = 2; o.tx = n.x; o.ty = n.y; }
          else if (n.k === 'wall' && ((s.t === 'build' && s.shape === 'line') || s.t === 'wall') && m.z < 1 && hyp(n.x - m.fort.ux * BR.wallAt - m.x, n.y - m.fort.uy * BR.wallAt - m.y) < BR.stand) { o.v = s.t === 'build' ? 3 : 2.5; o.tx = m.x + m.fort.ux * 5; o.ty = m.y + m.fort.uy * 5; }   // 흙벽(세 블록·구덩이)을 먼저, 없으면 기둥
          else if (m.phase === 'build' && o.isOff) o.v *= 0.5;
        }
        // 대가부터 몰이길의 끝: 적이 틈 4 m 안(땅)이면 지연 폭발을 틈과 그 끝(A + 3u) 사이에 × 2
        if (P && P.gap && m.phase === 'home' && s.t === 'area' && e.z < 1) {
          const gx = m.fort.x + m.fort.ux * BR.line, gy = m.fort.y + m.fort.uy * BR.line;
          if (hyp(e.x - gx, e.y - gy) < 4) { const kx = m.fort.x + m.fort.ux * BR.kill, ky = m.fort.y + m.fort.uy * BR.kill, w = s.delay > 1 ? 0.7 : 0.3; o.v = o.v * 2 + 0.3; o.tx = e.x + (kx - e.x) * w; o.ty = e.y + (ky - e.y) * w; }
        }
        // 부수기 (대가부터): 알아챈 적의 함정에 비·불, 나를 막는 적의 하늘 덮개에 비
        if (m.tac.breach && (FIRE(s) || (s.t === 'zone' && s.z.k === 'rain'))) {
          const rain = s.t === 'zone', Rr = R || 4;
          for (const t of W.traps) if (!t.done && t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - e.x, t.y - e.y) < BR.breachR && hyp(t.x - m.x, t.y - m.y) < Rr) { if (o.v < 0.8) { o.v = 0.8; o.tx = t.x; o.ty = t.y; } break; }
          if (rain) for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && hyp(z.x - m.x, z.y - m.y) < Rr + z.r * 0.5 && (m.z >= 1 || hyp(z.x - e.x, z.y - e.y) < z.r + 3)) { if (o.v < 1.2) { o.v = 1.2; o.tx = z.x; o.ty = z.y; } break; }
        }
      },
    };
  },
};
}, {"../../data/rules/fort.json":"data/rules/fort.json","../math":"src/math.js","./saltRing":"src/rules/saltRing.js"}];
D["src/rules/gear.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 장비 (늘 켜짐, data/gear.json, SPEC 10장)
 * 소금 밑창: 안 보이는 발밑 공격(지연 폭발)의 피해·묶임·굳힘 × 0.3. 소금 망토: 두른 사람 1.6 m 안에서 남의 장악 몫 × 0.3 */
const { hyp } = require('../math');
module.exports = {
  name: 'gear', on: () => true,
  engine: () => ({
    // 장악 계산: 망토 (refreshSides가 산 사람 중 망토 두른 이가 있는지 W._cloak에 적어 둔다)
    share(W, m, x, y, f) { if (W._cloak) { const foes = W.foes[m.side]; for (let i = 0; i < foes.length; i++) { const q = foes[i]; if (q.gear.cloak && hyp(x - q.x, y - q.y) < 1.6) f *= 0.3; } } return f; },
    // 지연 폭발이 사람에게 닿을 때의 몫: 밑창
    areaHit(W, q, a, k) { return !a.vis && q.gear.soles ? k * 0.3 : k; },
  }),
};
}, {"../math":"src/math.js"}];
D["src/rules/gunfire.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 총의 쏨 (rules.gunfire, v2.25, SPEC 48장, 수는 data/rules/gunfire.json) — 기본 꺼짐, 규칙 묶음 '지금'이 켠다
 * 따라 겨누기: 병사는 방아쇠를 당길 때까지 과녁을 눈으로 따라가고 움직이는 과녁은 앞질러 겨눈다. 방아쇠는 풀기 lag s 전(화승이 타는 동안은 못 고친다):
 *   그때 과녁의 자리 + 속도 × (lag + 날아갈 시간)을 겨눈다. 그사이 꺾으면 빗나간다. 겨눈 곳에서 R m 넘게 벗어난 과녁은 놓친다(처음 겨눈 곳 그대로).
 *   흔들림은 그대로 총이 정한다(core)
 * 총알은 마력이 아니다: 빠른 판의 떡대·막기(rules/pace)와 잔기술(rules/passive)은 마력 없는 총알을 줄이지 않는다(그 두 규칙이 이 스위치를 본다).
 *   굳은 살(rules/body)은 몸이라 그대로 뺀다
 * 대마법사의 총 대응 (v2.26.1, 선명도 alert.cMin 이상):
 *   놀람 → 반사: 총이 alert.hear m 안에서 울리거나(소리·섬광) 총알이 alert.near m 안을 지나거나 맞으면 alert.after s 뒤부터 총을 안다. 그다음부터 자동 진(서클 3부터)이
 *     alert.lead s 안에 alert.r m 안으로 지나갈 총알을 보면 앞 방패(반사로 서는 buff front)를 그 쪽으로 세운다(당 × 1.2, 자동 진 간격).
 *     방패가 서 있으면 그 총알 쪽으로 돌린다(굳으면 못 한다)
 *     처음 놀라면 한 번 튀어오른다(날기 끊기의 튀어오르기, alert.hop): 총알은 쏠 때의 과녁 높이를 겨눈다
 *   맞으면 쓸기: 총에 맞은 뒤 sweep.t s 동안 넓은 마법(지연 폭발·곡사·지대·뿜기)의 값 × sweep.k (장전하는 15~20 s 동안 줄을 쓴다) */
const P = require('../../data/rules/gunfire.json');
const isGun = (W, name) => { const s = W.spells[name]; return !!(s && s.mundane); };
const AIM = new WeakMap();   // 시전 → 방아쇠를 당길 때 정한 겨눔 [x, y] (쏠 때만 생긴다)
const AL = new WeakMap();   // 세계 → { al: Map(사람 → 총을 안 때), hit: Map(사람 → 마지막으로 총에 맞은 때) }
const alOf = W => { let a = AL.get(W); if (!a) AL.set(W, a = { al: new Map(), hit: new Map(), hop: new Set() }); return a; };
const WIDE = { area: 1, lob: 1, zone: 1, cone: 1 };
// 놀람과 반사 방패: 총알이 곁을 지나면 놀라고(alert.after s 뒤 반사), 그다음부터 닿을 총알에 앞 방패
function shield(X, W, m) {
  const A = P.alert, a = alOf(W), t0 = a.al.get(m); let hot = null, ht = 9;
  if (t0 !== undefined && A.hop && W.t - t0 >= A.after && !a.hop.has(m) && m.st.stun <= 0 && W.rules.flight) { a.hop.add(m); if (m.fly === 1 || m.fly === 0) m.cut.w = 3; }   // 놀라 튀어오른다: 총알은 쏠 때의 높이를 겨눴다
  for (const p of W.proj) { if (!p.s.mundane || p.src.side === m.side) continue;
    const rx = m.x - p.x, ry = m.y - p.y, vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv; if (t < 0 || t > A.lead) continue;
    const mx = p.x + p.vx * t - m.x, my = p.y + p.vy * t - m.y, d2 = mx * mx + my * my;
    if (t0 === undefined && d2 < A.near * A.near) { a.al.set(m, W.t); return; }
    if (d2 < A.r * A.r && t < ht) { ht = t; hot = p; } }
  if (!hot || t0 === undefined || W.t - t0 < A.after || m.circles < 3 || m.st.stun > 0) return;
  if (m.buf.front && m.buf.front.t > 0.05) { m.aim = X.atan2(hot.y - m.y, hot.x - m.x); return; }   // 선 방패는 반사로 총알 쪽을 향한다
  if (m.autoCd > 0 || (W.rules.saltWise && W.salt.length && X.onSalt(W, m.x, m.y))) return;   // 소금 위에선 방패가 흩어진다 (rules/saltWise, v2.30)
  for (const n of m.book) { const s = W.spells[n]; if (!s || s.t !== 'buff' || !s.b || !s.b.front || !s.react || (m.cd[n] || 0) > 0) continue;
    const cost = s.cost * 1.2; if (m.glu < cost) continue;
    m.glu -= cost; m.cd[n] = s.cd; m.autoCd = 0.7 * 3 / m.circles; m.mlog.gunShield++;
    X.release(W, m, { s, tx: hot.src.x, ty: hot.src.y, tgt: hot.src, t: 0, T: 0, auto: true }); return; }
}
module.exports = {
  name: 'gunfire', switch: 'gunfire', api: { P, isGun },
  engine: X => ({
    mageStep(W, m) {
      if (m.C >= P.alert.cMin && m.hp > 0) shield(X, W, m);
      const c = m.cast; if (!c || !c.s.mundane || c.s.t !== 'proj' || c.T - c.t > P.lag || AIM.has(c)) return;
      const q = c.tgt; if (!q || q.hp <= 0) return;
      const d = X.hyp(q.x - m.x, q.y - m.y), k = (c.T - c.t > 0 ? c.T - c.t : 0) + d / c.s.v;   // 남은 화승 + 날아갈 시간
      AIM.set(c, [q.x + q.vx * k, q.y + q.vy * k]);
    },
    release(W, m, c) { if (!c.s.mundane) return; const a = alOf(W); for (const q of W.foes[m.side]) if (q.C >= P.alert.cMin && q.hp > 0 && !a.al.has(q) && X.hyp(q.x - m.x, q.y - m.y) < P.alert.hear) a.al.set(q, W.t); },   // 총소리·섬광에 놀란다
    hurt(W, m, v, src, name) { if (src && m.C >= P.alert.cMin && isGun(W, name)) { const a = alOf(W); a.hit.set(m, W.t); if (!a.al.has(m)) a.al.set(m, W.t); } },
    track(W, m, c) {
      if (!c.s.mundane || c.s.t !== 'proj') return; const a = AIM.get(c); if (!a) return;
      if (X.hyp(a[0] - c.tx, a[1] - c.ty) < P.R) { c.tx = a[0]; c.ty = a[1]; }
    },
  }),
  brain: () => ({
    // 총에 맞은 뒤 장전하는 동안 넓은 마법으로 줄을 쓴다
    valueLate(W, m, K, o) { if (!(o.v > 0) || m.C < P.alert.cMin || !WIDE[o.s.t]) return; const h = alOf(W).hit.get(m); if (h !== undefined && W.t - h < P.sweep.t) o.v *= P.sweep.k; },
  }),
};
}, {"../../data/rules/gunfire.json":"data/rules/gunfire.json"}];
D["src/rules/hold.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 붙잡아 둔 설계 (rules.hold, v2.8, SPEC 32장, 수는 data/rules/hold.json)
 * 서클 = 머릿속에 동시에 붙잡는 설계의 층 수(WORLD 3-6). 두 번째 칸에 다 지은 공격을 풀지 않고 붙잡아 두었다가 틈이 오면 바로 푼다.
 * 엔진: 두 번째 칸의 시전에 hold가 붙었으면 다 지어도 풀지 않는다(엔진 훅 castHold). 붙잡은 동안 머리 피로가 초당 heat씩 든다. maxT를 넘기면 그때의 과녁 자리로 푼다.
 * 두뇌 (판단 수준의 tac.hold, 대가부터, 선명도 5 이상): 두 번째 칸에 공격을 붙잡아 둔다(몰아칠 때가 아니어도, 맞을 가망이 낮아도). 과녁의 빈틈이 닿는 때보다 길거나
 *   맞을 가망(날카롭게의 명중 가망)이 go 넘으면 그때의 과녁 자리로(닿는 동안의 걸음을 넣어) 푼다 */
const P = require('../../data/rules/hold.json');
const on = m => m.tac.hold && m.C >= 5;
module.exports = {
  name: 'hold', switch: 'hold', default: true, on: W => !!W.rules.hold, api: { P },
  engine: X => ({
    castHold(W, m, c) {
      if (!c.hold || c.go) return false;
      if (W.t > c.holdUntil) { const e = c.tgt; if (e && e.hp > 0) { c.tx = e.x; c.ty = e.y; } return false; }   // 너무 오래: 그때의 과녁 자리로 푼다
      if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + P.heat * W.dt);
      return true;
    },
  }),
  brain: B => {
    const { landDelay } = B;
    return {
      // 붙잡은 수를 풀 때: 과녁의 빈틈이 닿는 때보다 길거나, 맞을 가망이 높다 (판단 때마다, 칸 고르기 앞이라 두 칸이 차 있어도 본다)
      cancel(W, m, K) {
        const c = m.castB; if (!c || !c.hold || c.go || c.t < c.T || !on(m)) return;
        const e = K.e; if (!e) return; const sharp = B.lib;   // 날카롭게의 빈틈·명중 가망 (두뇌가 넘겨준다, v2.23.1)
        const land = landDelay(c.s, K.d), win = sharp.openFor(W, e), ch = sharp.chance(W, m, K, { n: c.s.n, he: 0.35 }, land);
        if (!(win > land || ch >= P.go)) return;
        const lead = land * (K.lead || 1), tx = e.x + e.vx * lead * 0.7, ty = e.y + e.vy * lead * 0.7;
        if (m.tac.hazard >= 2 && (c.s.t === 'area' || c.s.t === 'lob') && B.hyp(tx - m.x - m.vx * land, ty - m.y - m.vy * land) < (c.s.r || 1) * B.C.sizeOf(m, c.s) + B.SELF_GAP) return;   // 내 위험 지대 (v2.21, tac.hazard 2 대가부터): 터질 때 내가 안이면 더 붙잡는다
        c.tx = tx; c.ty = ty; c.tgt = e; c.go = true; m.mlog.held++;
      },
      // 두 번째 칸에 고른 공격은 붙잡는다
      commit(W, m, K, best, cast, Tc) {
        if (!on(m) || !cast.B || !B.OFF[best.s.t] || best.s.t === 'cone' || best.s.t === 'touch') return;
        cast.hold = true; cast.go = false; cast.holdUntil = W.t + Tc + P.maxT;
      },
    };
  },
};
}, {"../../data/rules/hold.json":"data/rules/hold.json"}];
D["src/rules/index.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 규칙 모듈 목록 (SPEC 22장 모듈과 훅)
 * 규칙 하나 = 파일 하나. 모양: { name, switch?, default?, on(W, opt), form?, engine: X => ({훅}), types: X => ({틀: fn}), brain: B => ({훅}), brainTypes: B => ({틀: fn}), api? }
 *   on: 이 세계에서 켜졌는가 (세계를 만들 때 한 번). 없으면 switch 스위치를 따르고, switch도 없으면 늘 켜짐
 *   engine: 엔진 훅. 세계를 만들 때 켜진 규칙의 훅만 차례대로 W.H[훅]에 모인다 (꺼진 규칙은 비용 0)
 *   types·brainTypes: 새 마법 틀의 방출과 두뇌의 값. 틀은 스위치와 상관없이 늘 붙는다(마법이 규칙에 딸리면 rule 필드가 책에서 뺀다)
 *   brain: 두뇌 훅. 기본 두뇌가 세계마다 켜진 규칙의 것만 모은다 (brain/hooks.js)
 * 차례가 곧 같은 훅 안의 부르는 차례다. 예전 한 덩어리의 계산 차례를 그대로 따른다(결과가 비트 하나 안 바뀌게). 새 규칙은 뒤에 붙는다 */
const RULES = [require('./gear'), require('./terrain'), require('./saltRing'), require('./wave'), require('./control'), require('./risk'), require('./taunt'), require('./multiSlot'), require('./barrels'), require('./response'), require('./silver'), require('./body'), require('./evade'), require('./flight'), require('./light'), require('./bulwark'), require('./army'), require('./morale'), require('./saltLand'), require('./fort'), require('./snap'), require('./reflex'), require('./blueprint'), require('./tactics'), require('./endure'), require('./hold'), require('./breath'), require('./pace'), require('./passive'), require('./tune'), require('./stunRes'), require('./rings'), require('./chipGuard'), require('./gunfire'), require('./calm'), require('./squad'), require('./chorus'), require('./steady'), require('./drain'), require('./fireLane'), require('./saltWise'), require('./selfSafe'), require('./crowdFire'), require('./unstuck'), require('./edgeCancel'), require('./artillery'), require('./chorusCast'), require('./ringLedger')];
// 엔진 훅의 이름과 부르는 자리 (SPEC 22장 표). 값을 돌려주는 훅은 받은 값을 고쳐 돌려준다
const ENGINE_HOOKS = ['place', 'init', 'world', 'wall', 'wallHit', 'lobLand', 'ceff', 'power', 'gate', 'share', 'release', 'overload', 'roll', 'hurtMod', 'hurt', 'effHold', 'eff', 'rain', 'smother', 'ring', 'fatRecover', 'mageStep', 'mageZones', 'move', 'speed', 'speedLate', 'accel', 'chan', 'projSub', 'ignite', 'areaHit', 'zoneTick', 'notice', 'trapCap', 'trapFire', 'preMove', 'castMove', 'walk', 'gluRegen', 'castHold', 'track', 'flyAccel', 'tune', 'stunHold', 'stepEnd', 'book'];
const BRAIN_HOOKS = ['aim', 'read', 'hideCast', 'steer', 'avoid', 'empty', 'circles', 'react', 'cancel', 'rest', 'prep', 'value', 'valueRisk', 'valueMid', 'valueLate', 'commit', 'castTime', 'phase', 'bound', 'rings', 'slot', 'heat'];
let ver = 0;   // 목록이 바뀐 횟수 (엔진이 틀 표를 다시 만든다)
const onOf = r => r.on || (r.switch ? W => !!W.rules[r.switch] : () => true);
// 규칙을 더한다(같은 이름이면 바꾼다). 스위치가 있으면 기본값을 DEFAULT_RULES에 적는 건 부르는 쪽(registry)
function add(r) {
  if (!r || typeof r.name !== 'string' || !r.name) throw new Error('규칙에 이름(name)이 없다');
  const i = RULES.findIndex(x => x.name === r.name); if (i >= 0) RULES[i] = r; else RULES.push(r);
  ver++; return r;
}
function remove(name) { const i = RULES.findIndex(x => x.name === name); if (i >= 0) { RULES.splice(i, 1); ver++; } }
module.exports = { RULES, ENGINE_HOOKS, BRAIN_HOOKS, onOf, add, remove, ver: () => ver };
}, {"./gear":"src/rules/gear.js","./terrain":"src/rules/terrain.js","./saltRing":"src/rules/saltRing.js","./wave":"src/rules/wave.js","./control":"src/rules/control.js","./risk":"src/rules/risk.js","./taunt":"src/rules/taunt.js","./multiSlot":"src/rules/multiSlot.js","./barrels":"src/rules/barrels.js","./response":"src/rules/response.js","./silver":"src/rules/silver.js","./body":"src/rules/body.js","./evade":"src/rules/evade.js","./flight":"src/rules/flight.js","./light":"src/rules/light.js","./bulwark":"src/rules/bulwark.js","./army":"src/rules/army.js","./morale":"src/rules/morale.js","./saltLand":"src/rules/saltLand.js","./fort":"src/rules/fort.js","./snap":"src/rules/snap.js","./reflex":"src/rules/reflex.js","./blueprint":"src/rules/blueprint.js","./tactics":"src/rules/tactics.js","./endure":"src/rules/endure.js","./hold":"src/rules/hold.js","./breath":"src/rules/breath.js","./pace":"src/rules/pace.js","./passive":"src/rules/passive.js","./tune":"src/rules/tune.js","./stunRes":"src/rules/stunRes.js","./rings":"src/rules/rings.js","./chipGuard":"src/rules/chipGuard.js","./gunfire":"src/rules/gunfire.js","./calm":"src/rules/calm.js","./squad":"src/rules/squad.js","./chorus":"src/rules/chorus.js","./steady":"src/rules/steady.js","./drain":"src/rules/drain.js","./fireLane":"src/rules/fireLane.js","./saltWise":"src/rules/saltWise.js","./selfSafe":"src/rules/selfSafe.js","./crowdFire":"src/rules/crowdFire.js","./unstuck":"src/rules/unstuck.js","./edgeCancel":"src/rules/edgeCancel.js","./artillery":"src/rules/artillery.js","./chorusCast":"src/rules/chorusCast.js","./ringLedger":"src/rules/ringLedger.js"}];
D["src/rules/light.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 빛 — 번쩍임·열선 (rules.light, v2.0 둘째 묶음, SPEC 25장, 마법은 data/spells/빛.json)
 * 손끝에서 만들어 곧바로 닿는다(장악권은 손끝만 본다, 피할 수 없다). 시야가 이어져야 하고(바위·벽·연기가 막는다), 연기·안개·비·흙먼지가 가린다.
 *   번쩍임(틀 flash): 사거리 안, 시야가 이어진 적 모두를 눈멀게 한다(blind × g, 연기 안경 × 0.5, 가림 × 0.4). 피해는 거의 없다
 *   열선(틀 beam): 예비동작 동안 핵이 빛나 보인다(읽힌다). 과녁 하나에 곧바로 닿는 열(에너지 피해 'heat', 몸 받침이 받는다).
 *     피해 = dmg × 위력 × g / (1 + 거리/L), 가림을 지나면 × 0.4. 유리 비단 거울(gear.mirror)이 있어야 책에 든다(core의 needGear)
 * 눈멀면 예비동작을 못 읽는다(두뇌 read 훅, 몸 묶기와 같은 뜻). 두뇌: 번쩍임·열선의 예비동작(빛이 오름)을 보면 가림(바위·벽) 뒤나 연기로 */
const { hyp } = require('../math');
const OBSC = { smoke: 1, mist: 1, rain: 1, absorb: 1 };   // 빛을 가리는 지대 (연기·흙먼지·안개·물 장막·비)
// 선분이 가리는 지대를 지나는가 (원이면 반지름, 선이면 길이의 반으로 넉넉히)
function veiled(W, x1, y1, x2, y2) {
  for (const z of W.zones) {
    if (!OBSC[z.k]) continue; const r = z.shape === 'circle' ? z.r : (z.len || 2) / 2;
    const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((z.x - x1) * dx + (z.y - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t;
    if (hyp(x1 + dx * t - z.x, y1 + dy * t - z.y) < r) return true;
  }
  return false;
}
module.exports = {
  name: 'light', switch: 'light', on: W => W.rules.light, form: { flash: 'self', beam: 'self' }, threat: { flash: 1, beam: 1 }, api: { veiled },
  types: X => ({
    flash(W, m, c, a) {
      const s = c.s, R = X.rangeOf(m, s), g = a.g; let n = 0;
      for (const q of a.foes) {
        if (X.hyp3(q.x - m.x, q.y - m.y, q.z - m.z) > R || X.blocked(W, m.x, m.y, q.x, q.y, m.z > q.z ? m.z : q.z)) continue;
        const k = (veiled(W, m.x, m.y, q.x, q.y) ? 0.4 : 1) * (q.gear.goggles ? 0.5 : 1) * g;
        q.st.blind = Math.max(q.st.blind, s.blind * k); q.cast = q.castB = null;   // 눈이 멀면 모으던 수를 놓친다
        X.hurt(W, q, s.dmg, m, s.n, s.kind); q.alog.blinded++; n++;
      }
      if (n) { X.hit(m, s); m.alog.flash++; m.alog.flashHit += n; }
      if (W.rec) W.fx.push(['f', m.x, m.y, R]);
    },
    beam(W, m, c, a) {
      const s = c.s, q = c.tgt; if (!q || q.hp <= 0) return;
      const d = X.hyp3(q.x - m.x, q.y - m.y, q.z - m.z); if (d > X.rangeOf(m, s) || X.blocked(W, m.x, m.y, q.x, q.y, m.z > q.z ? m.z : q.z)) return;
      const P = X.power(W, m, s) * a.g * (veiled(W, m.x, m.y, q.x, q.y) ? 0.4 : 1) / (1 + d / s.L);
      X.hurt(W, q, s.dmg * P, m, s.n, s.kind); X.hit(m, s);
      if (W.rec) W.fx.push(['z', m.x, m.y, q.x, q.y]);
    },
  }),
  // 두뇌: 틀의 값과 읽기
  brainTypes: B => ({
    flash(W, m, K, o) {
      const e = K.e, s = o.s; o.v = 0;
      if (!(K.d < B.C.rangeOf(m, s) && K.los) || e.st.blind > 0.3) return;
      // 눈먼 틈에 칠 무거운 수가 곧 있으면 먼저 번쩍인다 (무리 두뇌, 25장): 아니면 모으는 적의 수를 끊는 값
      const heavy = m.book.some(n => { const x = K.S[n]; return x && x.hit && x.hit.flat >= 50 && !((m.cd[n] || 0) > 0); });
      o.v = (heavy ? 1.3 : 0.35) + (e.cast || e.castB ? 0.4 : 0);
    },
    beam(W, m, K, o) {
      const e = K.e, s = o.s; o.v = 0;
      if (!(K.d < B.C.rangeOf(m, s) && K.los)) return;
      o.v = o.he * s.dmg * B.C.power(W, m, s) / (1 + K.d / s.L) / 20 / (o.Tw + 0.3);   // 20 = 실 한 줄 쯤의 값에 맞춘다
    },
  }),
  brain: B => ({
    read(W, m, K) { if (m.st.blind > 0) K.blindR = true; },   // 눈멀면 예비동작을 못 읽는다 (몸 묶기와 같은 뜻)
    // 빛이 오르는 것을 보면(번쩍임·열선의 예비동작, 나를 볼 수 있는 자리) 가림 뒤로 (바위·벽의 반대편)
    steer(W, m, K) {
      if (!m.tac.readCast || K.blindR || m.z >= 2) return;
      let q = null; for (const f of K.foes) { const c = f.cast; if (c && (c.s.t === 'flash' || (c.s.t === 'beam' && c.tgt === m)) && !B.C.blocked(W, f.x, f.y, m.x, m.y, 0)) { q = f; break; } }
      if (!q) return;
      let best = null, bd = 9; for (const o of W.obs) { const d = hyp(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; best = o; } } const ws = W.walls, wa = ws.length ? B.C.wallsIn(W, m.x - 9, m.y - 9, m.x + 9, m.y + 9) : ws; for (let i = 0; i < wa.length; i++) { const o = ws[wa[i]]; const d = hyp(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; best = o; } }
      if (best) { const dx = best.x - q.x, dy = best.y - q.y, l = hyp(dx, dy) || 1, tx = best.x + dx / l * (best.r + 0.6), ty = best.y + dy / l * (best.r + 0.6); K.vx = (tx - m.x) * 2; K.vy = (ty - m.y) * 2; }
      m._ltT = W.t;
    },
    // 가림이 없으면 연기·안개로 (빛이 오르는 것을 본 뒤 1 s 안)
    value(W, m, K, o) { const s = o.s; if (W.t - m._ltT < 1 && s.t === 'zone' && s.z && (s.z.k === 'smoke' || s.z.k === 'mist' || s.z.k === 'absorb')) { o.v = Math.max(o.v, 1.2); o.tx = m.x; o.ty = m.y; } },
  }),
};
}, {"../math":"src/math.js"}];
D["src/rules/morale.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 사기 (rules.morale, v2.0 둘째 묶음, SPEC 25장, 수는 data/rules/army.json의 morale)
 * 셋 이상인 편만. 0.5 s마다 도망칠 확률 = (편 사상자 몫 − 0.2) × 2 (넘을 때만) + 충격 × 0.35, 을 단단함으로 나눈다.
 *   충격: 10 m 안의 동료가 큰 수(한 방 50 이상)에 쓰러질 때마다 + 1, 초당 반으로 준다
 *   단단함 = √C × 판단 단계(초보 1, 중급 1.3, 상급 1.6, 대가 2, 전설 2.5, 없으면 1): 병사 0.55, 평범 1, 대마법사 3.2
 *   소금 땅 위에 선 사람은 × salt (v2.25: 소금은 마력을 끊는 피난처이자 신앙이다, WORLD 211)
 * 버팀(v2.30, 스위치 resolve): 지휘가 있는 무리 ÷ resolve.org, 보루 곁(resolve.wallR m) ÷ resolve.fort, 체력이 resolve.hp 넘는 사람은 10 m 안 동료의 resolve.herd 넘게 이미 도망치지 않았으면 × resolve.healthy
 * 도망치는 사람은 가장 가까운 싸움터 끝으로 달리고 공격하지 않는다(alog.fledT = 도망을 시작한 때). 끝에 닿으면 싸움에서 빠진다(체력 0으로 센다, alog.fled) */
const { hyp, pow } = require('../math');
const M = require('../../data/rules/army.json').morale;
const hard = m => Math.sqrt(Math.max(m.C, 0.01)) * (m.skill ? M.skill[m.skill] || 1 : 1);
// 버팀 (v2.30, rules.resolve, 기본 꺼짐): 지휘가 있는 무리(전투단·돌아가며 쏘는 줄)·보루 곁은 오래 버티고, 멀쩡한 사람은 둘레가 먼저 무너지기 전엔 혼자 달아나지 않는다. 도망칠 확률에 곱한다
function resolveK(X, W, m) { const R = M.resolve; let k = 1;
  if (m.tac.squad || m.tac.volley > 1) k /= R.org;
  if (W.walls.length) { const q = X.wallsIn(W, m.x - R.wallR, m.y - R.wallR, m.x + R.wallR, m.y + R.wallR); for (let i = 0; i < q.length; i++) { const w = W.walls[q[i]]; if (w.hp > 0 && X.hyp(w.x - m.x, w.y - m.y) < R.wallR + w.r) { k /= R.fort; break; } } }
  if (m.hp > R.hp * m.hpMax) { let a = 0, f = 0; for (const q of W.ms) if (q !== m && q.side === m.side && q.hp > 0 && X.hyp(q.x - m.x, q.y - m.y) < M.shockR) { a++; if (q.flee) f++; } if (!(a && f / a >= R.herd)) k *= R.healthy; }
  return k; }
module.exports = {
  name: 'morale', switch: 'morale', on: W => W.rules.morale, api: { hard, resolveK },
  engine: X => ({
    world(W) {
      if (!W._sideN) { W._sideN = []; for (const m of W.ms) W._sideN[m.side] = (W._sideN[m.side] || 0) + 1; }
      const every = Math.round(M.every / W.dt); if (W.step % every) return;
      const down = []; for (const m of W.ms) if (m.hp <= 0) down[m.side] = (down[m.side] || 0) + 1;
      const k = pow(M.decay, M.every);   // 충격은 초당 반으로
      for (const m of W.ms) {
        if (m.hp <= 0 || m.flee || W._sideN[m.side] < M.minSide) continue;
        const cas = (down[m.side] || 0) / W._sideN[m.side], p = (cas > M.cas ? (cas - M.cas) * M.casK : 0) + m.shock * M.shock;
        m.shock *= k;
        if (p > 0 && W.rng() < p * (W.rules.resolve ? resolveK(X, W, m) : 1) / (hard(m) * (W.salt.length && X.onSalt(W, m.x, m.y) ? M.salt : 1)) * M.every) { m.flee = 1; m.alog.fledT = W.t; m.cast = m.castB = m.chan = null; }   // fledT: 도망을 시작한 때
      }
    },
    // 동료가 큰 수에 쓰러졌다
    hurt(W, m, v, src, name, kind) {
      if (m.hp > 0 || v < M.shockDmg || W._sideN == null || W._sideN[m.side] < M.minSide) return;
      for (const q of W.ms) if (q !== m && q.hp > 0 && q.side === m.side && hyp(q.x - m.x, q.y - m.y) < M.shockR) q.shock += 1;
    },
    // 끝에 닿으면 빠진다
    mageStep(W, m) {
      if (!m.flee || W.closed) return; const e = M.edge;   // 갇힌 판(closed, v2.33)엔 빠질 끝이 없다
      if (m.x < e || m.y < e || m.x > W.width - e || m.y > W.height - e) { m.alog.fled = 1; m.hp = 0; m.deathT = W.t; }
    },
  }),
  brain: () => ({
    // 도망: 가장 가까운 끝으로 곧장, 쏘지 않는다
    steer(W, m, K) { if (!m.flee) return; const dl = m.x, dr = W.width - m.x, dt = m.y, db = W.height - m.y, mn = Math.min(dl, dr, dt, db); K.vx = mn === dl ? -3 : mn === dr ? 3 : 0; K.vy = mn === dt ? -3 : mn === db ? 3 : 0; if (!K.vx && !K.vy) K.vx = 3; },
    rest(W, m, K, restNow) { return restNow || !!m.flee; },
  }),
};
}, {"../math":"src/math.js","../../data/rules/army.json":"data/rules/army.json"}];
D["src/rules/multiSlot.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 서클 (rules.circles, 기본 켬, SPEC 6장)
 * 두 번째 칸(서클 2부터): 첫 칸을 모으는 동안 하나 더 (당·피로 × 1.3). 자동 진(서클 3부터): 생각 없이 막는다(간격 0.7 × 3 / 서클).
 * 끄면 누구나 서클 1 */
module.exports = {
  name: 'multiSlot', switch: 'circles', on: W => W.rules.circles,
  brain: B => {
    const { C, hyp, logDec, bigAttack, heatOver, landDelay } = B;
    return {
      circles(W, q) { return q.circles; },
      // 자동 진: 3서클부터, 생각 없이 막는다. 방패 아끼기(상급)면 큰 공격에만. 앞 방패·벽은 투사체·실만 막는다
      react(W, m, K) {
        const { S, T, e, threat, late, aimed, bigThreat, empty, circ } = K;
        const th = threat || late, bigTh = late && !threat ? (!T.shieldSave || (bigAttack(late, S) && (late.s.t === 'proj' || late.s.t === 'thread'))) : bigThreat;
        if (!(!empty && circ >= 3 && (aimed && threat || late) && th && bigTh && th.T - th.t < 0.4 && m.autoCd <= 0)) return;
        if (W.rules.saltWise && W.salt.length && m.z < 1 && C.onSalt(W, m.x, m.y)) return;   // 소금 위에선 진이 흩어진다 (rules/saltWise, v2.30)
        for (const n of m.book) {
          const s = S[n]; if ((m.cd[n] || 0) > 0) continue;
          if (!((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot')) continue;
          if (s.t === 'shoot' && !W.proj.some(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < 6)) continue;
          const cost = s.cost * 1.2; if (m.glu < cost) continue;
          if (m.tac.survive && m.C >= 5 && heatOver(W, m, s.cost, 0, 0.8)) continue;
          if (s.t === 'wall' && m.tac.sharp && m.C >= 5 && (m.z > 2 || (th.by && th.by.z > 2))) continue;   // 날카롭게 (v2.7): 둘 중 하나가 2 m 넘게 떠 있으면 기둥은 가리지 않는다
          if ((s.t === 'wall' || (s.t === 'buff' && s.b.front)) && m.tac.sharp && m.C >= 5 && !((th.s.t === 'thread' || th.s.t === 'proj') && !(th.hold && !th.go) && th.T - th.t + landDelay(th.s, hyp(th.tx - m.x, th.ty - m.y) + 0.5) < 0.4)) continue;   // 날카롭게 (v2.8): 앞 방패·기둥은 막을 수 있는 실·투사체가 0.4 s 안에 닿을 때만   // 스스로 죽지 않기 (v2.6): 머리가 넘칠 막기는 하지 않는다
          m.glu -= cost; m.cd[n] = s.cd; m.autoCd = 0.7 * 3 / circ;
          logDec(m, s, 'auto', { aimed: true });
          C.release(W, m, { s, tx: e.x, ty: e.y, tgt: e, t: 0, T: 0, auto: true });
          break;
        }
      },
    };
  },
};
}, {}];
D["src/rules/pace.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 빠른 판 (rules.pace, v2.14, SPEC 38장, 수는 data/rules/pace.json) — 대마법사 결투는 사람 눈이 못 따라갈 만큼 빠르다
 * 선명도 cMin(8) 이상에게만 (대마법사). 기본 꺼짐, 대마법사 결투 장면이 켠다. 끄면 예전과 같다.
 * 엔진 (대마법사 누구나):
 *   떡대 — 적이 준 피해(추락·소금·폭주 빼고) × bulk. 빨리 식기(머리 회복 × cool), 땅 걸음 × run, 꺾는 가속(걷기·날기의 끊는 움직임) × agile
 *   막기 — 순간 켜기 패시브 (st.guard: 켠 뒤 지난 시간, 0이면 꺼짐). 켠 동안 피해 × guard.k, 당 초당 guard.glu, 그동안 지어 푼 마법의 위력 × guard.pow.
 *     잔기술 규칙(rules/passive, v2.18)이 켜진 판에선 막기를 켜지 않는다(잔기술이 대신한다). 켜고 끄는 데 시간이 들지 않는다. 끈 뒤 guard.cd s는 다시 못 켠다(v2.15: 수읽기의 자원). 당이 guard.gluMin 아래거나 굳으면 꺼진다. 기록 m.mlog.guardN(켜고 끈 수)·guardT(켠 시간)·guardBlk(막은 피해)
 *   감각 조준 (track 훅) — 실·투사체·구름을 풀 때 과녁의 지금 자리(구름은 터질 때까지의 반쯤 앞)가 겨눈 곳에서 track[tac.pace] m 안이면 그리로 고쳐 겨눈다. 기록 mlog.trackN
 *     숨긴 수(c.hid)는 반경 × trackHid (v2.23, 기본 1 = 끔: 0.6은 명중을 무너뜨렸다. v2.21의 × 드러남은 거뒀다)
 * 두뇌 (대마법사 누구나): 시전 시간 × castK, 되쓰기 × cdK, 당 × costK, 실은 threadK 배 빨리 뻗는다 (빠른 수의 연속)
 * 두뇌 (판단 수준 tac.pace: 상급 1·대가 2·전설 3):
 *   서두름 K.hurry = move.hurry: 날카롭게의 명중 문턱 × (1 − hurry) (기다림이 아니라 빠른 수)
 *   막기: 나를 노린 수가 guard.lead s 안에 닿으면 켠다(적의 칸이 나를 노림·내 앞길 guard.near m 안, 터지기 직전의 구름, 앞길의 덫, 다가오는 투사체). 위협이 없으면 guard.min s 뒤 끈다
 *   늘 움직이기 (결투에서만): 늘 난다(식히러 내려앉을 때만 땅), 날면 목표 속도 move.vMin(들 땐 vIn) 아래로 늦추지 않는다(쏠 때도).
 *     피하기가 아니면 걸음을 들고 나기로: 둘레(옆) move.lat + 지름(안·밖). 들기는 가장 짧은 실의 사거리 × inK까지, 나기는 가장 긴 실의 × outK까지.
 *     닿거나 move.flip s가 지나면 바꾸고, 바꿀 때 둘레 방향을 turnP로 뒤집고 옆으로 튄다(날기 끊기). 전설은 flipL로 더 잦고, 때를 읽는다(move.read:
 *     짧은 실이 준비됐고 노린 수가 없으면 들고, 막 쏘았거나 노린 수가 곧 닿으면 난다)
 *   끊기를 옆 튀기로 (preMove): 떨어지기·내리꽂기·급정지와 반사 겹의 멈칫은 걸음을 못 바꾸거나 멈춘다. 옆 튀기·옆으로 꺾기로 바꾼다(반사 겹 뒤에 돈다) */
const P = require('../../data/rules/pace.json'), G = P.guard, MV = P.move;
const on = (W, m) => m.C >= P.cMin;
const TR = { thread: 1, proj: 1, area: 2 };
const FL = require('./flight').api, SR = require('./saltRing').api;
const SKIP = { fall: 1, salt: 1, backfire: 1, wave: 1 };
const GF = require('./gunfire').api;
module.exports = {
  name: 'pace', switch: 'pace', api: { P },
  engine: X => ({
    // 감각 조준: 실·투사체·구름을 풀 때 과녁의 지금 자리가 겨눈 곳에서 track m 안이면 그리로 고쳐 겨눈다 (짓는 동안 장악권으로 과녁을 느낀다)
    track(W, m, c) {
      const q = c.tgt, t = TR[c.s.t]; if (!on(W, m) || !q || q.hp <= 0 || c.auto || !t) return;
      const R = (P.track[m.tac.pace || 0] || 0) * (c.hid ? P.trackHid : 1); if (!R) return;   // 숨긴 수는 짓는 동안 장악권을 억눌러 과녁을 덜 느낀다 (v2.23)
      const k = t === 2 ? (c.s.delay || 0) * 0.5 : 0, px = q.x + q.vx * k, py = q.y + q.vy * k, d = X.hyp(px - c.tx, py - c.ty);   // 구름은 터질 때의 반쯤 앞으로
      if (d < R && d > 0) { c.tx = px; c.ty = py; m.mlog.trackN++; }
    },
    hurtMod(W, m, v, kind, name) {
      if (!on(W, m) || SKIP[kind] || (W.rules.gunfire && GF.isGun(W, name))) return v;   // 총알은 마력이 아니다 (rules/gunfire, v2.25)
      v *= P.bulk;
      if (m.st.guard > 0) { m.mlog.guardBlk += v * (1 - G.k); v *= G.k; if (m.st.guard < G.okT && m.mlog.gdOkC !== m.mlog.gdOn) { m.mlog.gdOk++; m.mlog.gdOkC = m.mlog.gdOn; } }   // 순간 켜기 성공: 켠 지 okT s 안에 맞았다 (v2.16 지표)
      return v;
    },
    fatRecover(W, m, k) { return on(W, m) ? k * P.cool : k; },   // 빨리 식는다 (짧은 수를 잇달아 지으니)
    flyAccel(W, m, a) { return on(W, m) ? a * P.agile : a; },   // 날며 꺾는 가속 (끊는 움직임의 a, rules/flight)
    accel(W, m, acc) { return on(W, m) ? acc * P.agile : acc; },   // 땅에서도
    speed(W, m, sp) { return on(W, m) ? sp * P.run : sp; },   // 땅에서도 빠르다 (장악권으로 미끄러진다)
    power(W, m, s, p) { return on(W, m) && m.st.guard > 0 ? p * G.pow : p; },   // 막기를 켠 채 지은 마법은 약하다
    // 끊기를 옆 튀기로 (tac.pace): 떨어지기·내리꽂기·급정지·멈칫은 걸음을 못 바꾸거나 멈춘다. 반사 겹(엔진)·두뇌가 청한 것을 움직이기 앞에서 바꾼다 (반사 겹 뒤에 돈다)
    preMove(W, m) {
      if (!m.tac.pace || !MV.noDrop || !on(W, m)) return;
      const w = m.cut.w, R = m.rx, stop = R && W.t < R.until && R.vx === 0 && R.vy === 0 && m.fly === 1;
      if (!(w === 1 || w === 4 || w === 5) && !stop) return;
      let q = null, bd = 1e9; for (const o of W.ms) if (o.side !== m.side && o.hp > 0) { const d = X.hyp(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; q = o; } }
      const ex = q ? q.x - m.x : 1, ey = q ? q.y - m.y : 0, l = X.hyp(ex, ey) || 1, s = m.mlog.pcS || 1, px = -ey / l * s, py = ex / l * s;
      if (w === 1 || w === 4 || w === 5) { m.cut.x = px; m.cut.y = py; m.cut.w = 2; }
      if (stop) { R.vx = px; R.vy = py; R.fv = MV.vIn; m.mv.x = px; m.mv.y = py; m.fv = MV.vIn; }   // 반사 겹의 멈칫(rules/reflex)도 옆으로 꺾기로
    },
    mageStep(W, m) {
      if (!(m.st.guard > 0)) return;
      m.st.guard += W.dt; m.mlog.guardT += W.dt; m.glu -= G.glu * W.dt;
      if (m.glu < G.gluMin || m.st.stun > 0) { m.st.guard = 0; m.mlog.guardN++; m.mlog.gdOff = W.t; }   // 당이 바닥나거나 굳으면 꺼진다
    },
  }),
  brain: B => {
    // 나를 노린 수가 lead s 안에 닿는가
    function soon(W, m, K) {
      for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || c.s.t === 'buff' || c.s.t === 'wall' || c.s.t === 'move' || c.T - c.t >= G.lead) continue; const k = c.T - c.t; if (c.tgt === m || B.C.hyp(c.tx - m.x - m.vx * k, c.ty - m.y - m.vy * k) < G.near + (c.s.r || 0)) return true; }
      for (const a of W.areas) if (a.src.side !== m.side && a.t < G.lead && B.C.hyp(a.x - m.x - m.vx * a.t, a.y - m.y - m.vy * a.t) < a.r + 0.6) return true;
      for (const t of W.traps) if (t.src.side !== m.side && !t.done && m.z < 1.5 && t.seen.has(m.id) && B.C.hyp(t.x - m.x - m.vx * G.lead, t.y - m.y - m.vy * G.lead) < 2) return true;
      for (const p of W.proj) { if (p.dead || !p.src || p.src.side === m.side) continue; const dx = m.x - p.x, dy = m.y - p.y, v2 = p.vx * p.vx + p.vy * p.vy; if (!v2) continue; const t = (dx * p.vx + dy * p.vy) / v2; if (t > 0 && t < G.lead && B.C.hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 1.2) return true; }
      return false;
    }
    return {
      castTime(W, m, t) { return on(W, m) ? t * P.castK : t; },
      commit(W, m, K, best, cast) {
        if (!on(W, m)) return; if (m.cd[best.n] > 0) m.cd[best.n] *= P.cdK; m.glu += best.cost * (1 - P.costK);
        const s = best.s; if (s.t === 'thread') { const fl = Math.min(B.C.hyp(best.tx - m.x, best.ty - m.y), B.C.rangeOf(m, s)) / (32 * (s.fast || 1)); cast.T -= fl * (1 - 1 / P.threadK); }   // 실이 threadK 배 빨리 뻗는다
      },
      bound(W, m, K) {
        const L = m.tac.pace; if (!L || !on(W, m) || m.hp <= 0) return;
        K.hurry = MV.hurry[L - 1] || 0;   // 서두름: 날카롭게의 명중 문턱 × (1 − hurry) (techniques/sharp, 이 판단의 고르기에)
        // 막기
        const th = soon(W, m, K), g = m.st.guard > 0;
        if (W.rules.passives) {} else if (th && !g && m.glu > G.gluMin + 3 && !(m.st.stun > 0) && W.t - m.mlog.gdOff >= G.cd && !(K.keep & 4 && W.t < K.keepT)) { m.st.guard = 1e-6; m.mlog.guardN++; m.mlog.gdT = W.t; m.mlog.gdOn = W.t; }
        else if (g) { if (th) m.mlog.gdT = W.t; else if (W.t - m.mlog.gdT >= G.min) { m.st.guard = 0; m.mlog.guardN++; m.mlog.gdOff = W.t; } }
        // 늘 움직이기 (결투에서만)
        if (K.foes.length !== 1 || m.st.breath > 0 || m.retreat) return;
        const e = K.e; if (!e) return;
        const pl = m.mlog;
        if (MV.fly && !m.cut.cool && !m.flyWant && FL.outP(m) >= FL.F.minP && FL.canFly(m)) { m.flyWant = true; if (m.fz < FL.F.zMin) m.fz = FL.F.zMin + 1; }   // 늘 난다 (식히러 내려앉을 때만 땅)
        if (m.fly === 1 && m.fv < MV.vMin) m.fv = pl.pcIn ? MV.vIn : MV.vMin;
        if (K.dodge || K.brk > W.t) return;   // 피하기의 걸음·그물 깨기(수읽기, v2.15)는 그대로
        if (!pl.pcR0) { let a = 1e9, b = 0; for (const n of m.book) { const x = W.spells[n]; if (!x || x.t !== 'thread') continue; const r = B.C.rangeOf(m, x); if (r < a) { a = r; pl.pcN = n; } if (r > b) b = r; } pl.pcR0 = a < 1e9 ? a : 10; pl.pcR1 = b || 20; }   // 실의 사거리 (가장 짧은 것·긴 것)
        const dx = e.x - m.x, dy = e.y - m.y, d = B.C.hyp(dx, dy) || 1, ux = dx / d, uy = dy / d, w0 = pl.pcR0 * MV.inK, w1 = pl.pcR1 * MV.outK;
        // 들기는 가까운 거리에 닿거나 move.flip이 지나면 나기로, 나기는 먼 거리에 닿거나 지나면 들기로. 바꿀 때 둘레 방향을 반쯤 뒤집는다
        // 전설(pace 2)은 때를 읽는다: 짧은 실이 준비됐고 나를 노린 수가 없으면 들고, 막 쏘았거나 노린 수가 곧 닿으면 난다
        let flip = W.t >= pl.pcT || (pl.pcIn ? d < w0 + 1 : d > w1 - 1);
        if (L >= 3 && MV.read) { const rdy = pl.pcN ? !(m.cd[pl.pcN] > 0) : true; if (!pl.pcIn && rdy && !th && d > w0 + 3) flip = true; else if (pl.pcIn && (th || W.t - m.lastRel < 0.1)) flip = true; }
        if (flip) { const f = L >= 3 ? MV.flipL : MV.flip; pl.pcT = W.t + W.rnd(f[0], f[1]); pl.pcIn = !pl.pcIn; if (W.rng() < MV.turnP) pl.pcS = -pl.pcS || 1;
          if (W.rules.flightCut && m.fly === 1 && !(m.cut.cd > 0) && !m.cut.k) { const s = pl.pcS || 1; m.cut.x = -uy * s; m.cut.y = ux * s; m.cut.w = 2; } }   // 바꿀 때 옆으로 튄다 (끊기)
        const want = pl.pcIn ? w0 : w1, rad = d > want + 1 ? 1 : d < want - 1 ? -1 : 0, s = pl.pcS || 1;
        K.vx = ux * rad - uy * s * MV.lat; K.vy = uy * rad + ux * s * MV.lat;
        if (W.rules.saltRing) SR.bound(W, m, K, B);   // 소금 원의 단단한 벽은 바뀐 걸음에도 (rules/saltRing)
      },
    };
  },
};
}, {"../../data/rules/pace.json":"data/rules/pace.json","./flight":"src/rules/flight.js","./saltRing":"src/rules/saltRing.js","./gunfire":"src/rules/gunfire.js"}];
D["src/rules/passive.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 잔기술 — 패시브와 순간 켜기 (rules.passives, v2.18, SPEC 42장, 수는 data/rules/passive.json)
 * 기본 꺼짐, 대마법사 결투 장면이 켠다. 선명도 cMin 이상이고 판단 수준 tac.passive가 있는 사람만, 한 번에 하나.
 *   1 절연 막(전기) · 2 굳은 살(둔기) · 3 열 차단(불·열): 맞는 피해만 × k. 절연 막은 전기 굳힘의 길이도 × stunK (effHold)
 *   상태 st.psv(켠 잔기술, 0 꺼짐)·st.psvT(켠 뒤 지난 시간). onT s가 지나야 막는다(순간 켜기). 끄면 cd s는 다시 못 켠다(바꿔 끼우기도 끄고 켜기)
 *   켜 둔 대가: 서클 하나(두뇌 훅 circles), 머리 열 초당 heat. 머리가 fatOff를 넘으면 꺼진다. 굳어도 꺼지지 않지만 굳은 동안 바꾸지 못한다
 *   켜진 판에선 빠른 판의 일반 막기(rules/pace)는 쉰다. 기록은 막기의 것(mlog.guardN·guardT·guardBlk·gdOn·gdOff·gdOk)을 그대로
 * 두뇌 (tac.passive): 1 중급 늘 켬(상대 책의 공격 가운데 가장 많은 종류) · 2 상급 바꿔 낌(보이는 위협 → 상대가 마지막에 푼 공격 → 책)
 *   · 3 대가 위협이 lead s 안에 닿을 때만 · 4 전설 같게, 더 짧은 lead (맞기 직전에만) */
const P = require('../../data/rules/passive.json'), GF = require('./gunfire').api;
const KIND = {}; P.kinds.forEach((ks, i) => { for (const k of ks) KIND[k] = i + 1; });   // 피해 종류 → 잔기술
const HOLD = new WeakMap();   // 사람 → { t: 절연 막을 켜 둘 때까지, n: 켜 둔 번 수 } (v2.36)
const on = (W, m) => m.C >= P.cMin && m.tac.passive > 0;
const kindOf = s => s.t === 'thread' ? 'elec' : (s.kind || (s.hit && s.hit.kind) || 'blunt');   // 이 마법의 피해 종류 (실은 전기, 투사체는 맞힘의 것)
const psvOf = s => KIND[kindOf(s)] || 0;
const active = m => m.st.psv > 0 && m.st.psvT >= P.onT;
function off(W, m) { if (!(m.st.psv > 0)) return; m.st.psv = 0; m.st.psvT = 0; m.mlog.guardN++; m.mlog.gdOff = W.t; }
function turnOn(W, m, p) { if (m.st.psv === p) return; if (m.st.psv > 0) { off(W, m); return; } if (W.t - m.mlog.gdOff < P.cd || m.st.stun > 0 || m.fat > P.fatOff - 5) return; m.st.psv = p; m.st.psvT = 1e-6; m.mlog.guardN++; m.mlog.gdOn = W.t; }
module.exports = {
  name: 'passive', switch: 'passives', api: { P, KIND, kindOf, psvOf, active, on, off, holdOn: (W, m) => { const h = HOLD.get(m); return !!h && W.t < h.t; }, holdN: m => (HOLD.get(m) || { n: 0 }).n },
  engine: X => ({
    hurtMod(W, m, v, kind, name) {
      if (!active(m) || KIND[kind] !== m.st.psv || (W.rules.gunfire && GF.isGun(W, name))) return v;   // 총알은 마력이 아니다 (rules/gunfire, v2.25)
      m.mlog.guardBlk += v * (1 - P.k); if (m.st.psvT < P.okT && m.mlog.gdOkC !== m.mlog.gdOn) { m.mlog.gdOk++; m.mlog.gdOkC = m.mlog.gdOn; }   // 순간 켜기 성공
      return v * P.k;
    },
    effHold(W, m, o, g) { return o.kind === 'elec' && o.stun && active(m) && m.st.psv === 1 ? g * P.stunK : g; },   // 절연 막: 전기 굳힘이 짧다
    mageStep(W, m) {
      if (!(m.st.psv > 0)) return;
      m.st.psvT += W.dt; m.mlog.guardT += W.dt; m.fat += P.heat * W.dt;
      if (m.fat > P.fatOff || m.hp <= 0) off(W, m);
    },
  }),
  brain: B => {
    // 가장 먼저 닿는 위협의 잔기술 (within s 안). 없으면 0
    function threat(W, m, K, within) {
      let best = within, p = 0;
      for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || !B.OFF[c.s.t]) continue; const t = c.T - c.t; if (t >= best) continue; if (c.tgt === m || B.C.hyp(c.tx - m.x - m.vx * t, c.ty - m.y - m.vy * t) < P.near + (c.s.r || 0)) { best = t; p = psvOf(c.s); } }
      for (const a of W.areas) if (a.src.side !== m.side && a.t < best && B.C.hyp(a.x - m.x - m.vx * a.t, a.y - m.y - m.vy * a.t) < a.r + 0.6) { best = a.t; p = psvOf(a.s); }
      for (const pr of W.proj) { if (pr.dead || !pr.src || pr.src.side === m.side) continue; const dx = m.x - pr.x, dy = m.y - pr.y, v2 = pr.vx * pr.vx + pr.vy * pr.vy; if (!v2) continue; const t = (dx * pr.vx + dy * pr.vy) / v2; if (t > 0 && t < best && B.C.hyp(pr.x + pr.vx * t - m.x, pr.y + pr.vy * t - m.y) < 1.2) { best = t; p = psvOf(pr.s); } }
      return p;
    }
    // 굳히는 번개가 여러 방향에서 오나 (v2.36, 전설): within s 안에 나를 겨눈 전기 굳힘·실이 hold.n개 넘게, 그 방향들이 hold.ang rad 넘게 벌어졌으면
    function multiElec(W, m, K) {
      const H = P.hold; let n = 0, a0 = 0, lo = 9, hi = -9;
      for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (!c || c.unseen || c.tgt !== m || c.T - c.t > H.within) continue; const s = c.s; if (!(s.t === 'thread' || (kindOf(s) === 'elec' && (s.stun || (s.hit && s.hit.stun))))) continue;
        let a = B.C.atan2(q.y - m.y, q.x - m.x); if (!n) a0 = a; let d = a - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; if (d < lo) lo = d; if (d > hi) hi = d; n++; }
      for (const a of W.areas) { if (a.src.side === m.side || a.t > H.within || a.s.kind !== 'elec' || !a.s.stun || B.C.hyp(a.x - m.x, a.y - m.y) > a.r + 0.6) continue;   // 떨어지는 번개 그물도 (치는 사람 쪽에서 온다)
        let ang = B.C.atan2(a.src.y - m.y, a.src.x - m.x); if (!n) a0 = ang; let d = ang - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; if (d < lo) lo = d; if (d > hi) hi = d; n++; }
      return n >= H.n && hi - lo >= H.ang;
    }
    // 상대 책의 공격 가운데 가장 많은 종류
    function main(W, e) { const n = [0, 0, 0, 0]; for (const x of e.book) { const s = W.spells[x]; if (s && B.OFF[s.t]) n[psvOf(s)]++; } let b = 1; for (let i = 2; i < 4; i++) if (n[i] > n[b]) b = i; return b; }
    return {
      circles(W, q, c) { return q.st.psv > 0 ? Math.max(1, c - 1) : c; },   // 켜 둔 잔기술이 서클 하나
      bound(W, m, K) {
        if (!on(W, m) || m.hp <= 0 || m.st.stun > 0) return; const L = m.tac.passive, e = K.e; if (!e) return;
        let want = 0;
        if (L === 1) want = main(W, e);
        else if (L === 2) { want = threat(W, m, K, P.swap); if (!want) { const r = e.last && W.spells[e.last]; want = r && B.OFF[r.t] ? psvOf(r) : main(W, e); } }
        else { want = threat(W, m, K, P.lead[L] || P.lead[4]); if (want) m.mlog.gdT = W.t; else if (m.st.psv > 0 && W.t - m.mlog.gdT < P.min) want = m.st.psv; }
        if (L >= P.hold.L) { let h = HOLD.get(m); if (multiElec(W, m, K)) { if (!h) HOLD.set(m, h = { t: -9, n: 0 }); if (W.t >= h.t) h.n++; h.t = W.t + P.hold.keep; } if (h && W.t < h.t) want = 1; }   // 전설: 여러 방향의 굳히는 번개엔 순간 켜기 대신 절연 막을 늘 켜 둔다 (v2.36)
        if (K.keep & 4 && W.t < K.keepT && !(m.st.psv > 0)) want = 0;   // 정석의 아낄 자원 (수읽기)
        if (want) turnOn(W, m, want); else off(W, m);
      },
    };
  },
};
}, {"../../data/rules/passive.json":"data/rules/passive.json","./gunfire":"src/rules/gunfire.js"}];
D["src/rules/reflex.js"] = [function (module, exports, require) {
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
  for (const q of W.foes[m.side]) for (let j = 0; j < 2; j++) {
    const c = j ? q.castB : q.cast; if (!(c && !c.unseen && c.tgt === m && LEAD[c.s.t] && c.T - c.t < P.read)) continue;
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
}, {"../math":"src/math.js","../../data/rules/reflex.json":"data/rules/reflex.json","./saltRing":"src/rules/saltRing.js"}];
D["src/rules/response.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 대응 — 풀기·대비·순간 반응 (rules.response, 1.13.0, SPEC 9장, 수는 data/rules/response.json)
 * WORLD 5장의 잔기술(신경 가속, 통증 차단, 굳은 살)로 붙잡는 마법과 피할 수 없는 한 방에 답한다. 판단 수준이 셋을 연다(없으면 등급의 자동 구르기를 따른다).
 *   순간 반응: 판단과 판단 사이에도, 0.2 s 안에 닿을 보이는 탄·구름을 몸이 먼저 피한다(확률 = 단계의 reflex, 한 번 본 뒤 0.25 s 쉼)
 *   대비: 읽은 큰 공격(큰 수, 또는 그 사람의 가장 센 공격의 60% 이상, 추정 피해 12 이상)이 0.35 s 안에 닿는데 몸이 묶였으면(묶임·균사·경직)
 *         0.6 s 몸을 굳힌다: 받는 피해 × 0.6, 걸음 × 0.3, 머리 + 5
 *   풀기: 몸 묶기(균사·경직·석회·족쇄)에 걸렸고 상대가 모으고 있으면 머리 + 12, 당 4로 푼다(간격 5 s). 굳음과 보통 묶임은 못 푼다
 * 두뇌가 청하고(대비·풀기) 엔진이 다음 걸음에 한다. 순간 반응은 엔진(몸)만 */
const { hyp } = require('../math');
const P = require('../../data/rules/response.json');
// 이 사람의 단계 값
const levelOf = m => (m.skill && P.levels[m.skill]) || (m.autoDodge ? P.noSkill.autoDodge : P.noSkill.plain);
const canRoll = m => m.roll <= 0 && m.rollCd <= 0 && m.stam > 1.5 && !(m.st.stun > 0 || m.st.root > 0 || m.st.mycel > 0 || m.st.cramp > 0);
module.exports = {
  name: 'response', switch: 'response', on: W => W.rules.response, api: { levelOf, P },
  engine: X => {
    const bump = (m, k) => { m.log[k] = (m.log[k] || 0) + 1; };   // 규칙이 켜졌을 때만 칸이 생긴다
    return {
      mageStep(W, m) {
        // 두뇌가 청한 대비·풀기
        if (m.braceReq) { m.braceReq = 0; m.braceT = W.t + P.brace.dur; m.fat += P.brace.fat; bump(m, 'brace'); }
        if (m.unbindReq) {
          m.unbindReq = 0; const st = m.st;
          if (W.t >= m.unbindCd && m.glu >= P.unbind.glu && (st.mycel > 0 || st.cramp > 0 || st.lime > 0 || st.fetter > 0)) {
            if (st.fetter > 0 && st.root <= st.fetter + 1e-9) st.root = 0;   // 족쇄로 걸린 묶임만
            st.mycel = 0; st.cramp = 0; st.lime = 0; st.fetter = 0; m.fat += P.unbind.fat; m.glu -= P.unbind.glu; m.unbindCd = W.t + P.unbind.cd; bump(m, 'unbind');
          }
        }
        // 순간 반응: 0.2 s 안에 닿을 보이는 것
        const L = levelOf(m); if (!L.reflex || !canRoll(m) || W.t - m.reflexT < P.reflex.again) return;
        const win = P.reflex.window; let dx = 0, dy = 0, seen = false;
        for (const p of W.proj) {
          if (p.dead || p.src.side === m.side || p.home) continue;
          const rx = m.x - p.x, ry = m.y - p.y, vv = p.vx * p.vx + p.vy * p.vy, t = (rx * p.vx + ry * p.vy) / vv;
          if (t > 0 && t < win && hyp(p.x + p.vx * t - m.x, p.y + p.vy * t - m.y) < 0.55) { const sd = p.vx * ry - p.vy * rx > 0 ? 1 : -1; dx = -p.vy * sd; dy = p.vx * sd; seen = true; break; }
        }
        if (!seen) for (const a of W.areas) if (a.vis && a.src.side !== m.side && a.t < win && hyp(a.x - m.x, a.y - m.y) < a.r + 0.3) { dx = m.x - a.x || 0.1; dy = m.y - a.y || 0.1; seen = true; break; }
        if (!seen) return;
        m.reflexT = W.t;
        if (W.rng() < L.reflex) { X.roll(W, m, dx, dy, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8); bump(m, 'reflex'); }
      },
      hurtMod(W, m, v) { return m.braceT > W.t ? v * P.brace.k : v; },          // 굳은 살·통증 차단
      speedLate(W, m, sp) { return m.braceT > W.t ? sp * P.brace.speed : sp; },   // 굳힌 몸은 느리다
    };
  },
  // 두뇌: 자동 진 다음에 대비와 풀기를 청한다
  brain: B => ({
    react(W, m, K) {
      const L = levelOf(m), st = m.st, e = K.e;
      if (L.unbind && W.t >= m.unbindCd && m.glu >= P.unbind.glu + 2 && (st.mycel > P.unbind.min || st.cramp > P.unbind.min || st.lime > P.unbind.min || st.fetter > P.unbind.min) && (K.threat || K.late || e.cast || e.castB)) m.unbindReq = 1;
      const th = K.threat || K.late;
      // 큰 공격(큰 수, 또는 쏘는 사람의 가장 센 공격의 60% 이상)이 곧 닿는데 몸이 묶여 걸어서도 구르기로도 못 나갈 때만.
      // 걸을 수 있으면 굳히지 않는다: 굳힌 몸은 느려(× 0.3) 걸어 나갈 수 있던 구름 안에 남는다 (1.13.0 재기, reports/v1.13.0.md)
      if (L.brace && th && th.T - th.t < P.brace.within && !(m.braceT > W.t) && !m.buf.front && (th.s.big || B.bigAttack(th, K.S)) && B.estDmg(th.s) >= P.brace.minDmg
        && (st.root > 0 || st.mycel > 0 || st.cramp > 0)) m.braceReq = 1;
    },
  }),
};
}, {"../math":"src/math.js","../../data/rules/response.json":"data/rules/response.json"}];
D["src/rules/ringLedger.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 고리 장부 3단계 (rules.ringLedger, v2.37, SPEC 59장, 수는 data/rules/ringLedger.json) — 기본 꺼짐, 서클 규칙(circles) 위에서
 * 1단계(rules/rings)는 읽어내기만 했다. 3단계는 장부 하나가 서클을 나눈다: 모든 일이 고리 하나씩을 쓴다
 *   늘 먼저(이미 쥔 것): 첫 칸(짓기·흐름) · 셋째 칸부터의 짓기(X) · 버팀 벽마다 · 몸 강화(빠르기·절연·둔기·독 막기 가운데 걸린 것)
 *   값으로 고른다(높은 것부터): 합창의 박자 · 두 번째 칸 · 붙잡음 · 날기(둘레가 위험하면 더) · 공기막 · 잔기술(전설의 켜 두기 중이면 더) · 자동 진(나를 겨눈 수가 있으면 더)
 *   고리가 모자라 못 받은 일은 내려놓는다: 날기 → 내려앉는다(두뇌 훅 bound가 flyWant를 끈다), 잔기술 → 끈다, 붙잡음 → 거둔다, 자동 진 → 쉰다(두뇌 훅 circles)
 * 동시에 짓기 = 빈 고리만큼(엔진의 두 칸 + 셋째 칸부터 X, 두뇌 훅 slot). X는 이 규칙이 쥐고 걸음마다 지어 풀며(엔진 훅 mageStep), 굳거나 쓰러지면 모두 흩어진다
 *   k번째 X: 머리 열 × (1 + x.heat (k + 1))·당 × (1 + x.glu (k + 1)). 동시에 짓는 수 n이 셋 넘으면 초당 머리 holdHeat × (n − 2): 많이 쥘 수 있어도 오래는 못 쥔다
 *   X는 상대의 예비동작 읽기(cast·castB)에 보이지 않는다(지금 엔진의 한계, 59장)
 * 지표 (api.stats): 단계마다 고리가 꽉 찬 시간·고리 쓰임·내려놓은 시간, 시작할 때 동시에 짓는 수의 분포, X의 수·풀림·흩어짐 */
const P = require('../../data/rules/ringLedger.json'), CH = require('./chorus').api, PS = require('./passive').api;
let XX = null;   // 엔진의 것
const ST = new WeakMap(), XK = new WeakMap(), WS = new WeakMap();   // 사람 → 장부, X 시전 → k, 세계 → 지표
const tierOf = m => m.C >= 8 ? '대마법사' : m.C >= 4 ? '상위' : m.C >= 2 ? '중간' : m.C >= 0.9 ? '평범' : '병사';
const T0 = () => ({ T: 0, full: 0, ringT: 0, usedT: 0, drop: { fly: 0, psv: 0, hold: 0, auto: 0, B: 0 }, hist: [0, 0, 0, 0, 0, 0, 0, 0, 0], xN: 0, xRel: 0, xLost: 0, xDrop: 0 });
function wsOf(W) { let s = WS.get(W); if (!s) WS.set(W, s = { by: {} }); return s; }
function stOf(m) { let s = ST.get(m); if (!s) ST.set(m, s = { X: [], F: 0, R: 0, fly: true, film: true, psv: true, auto: true, hold: true, B: true, over: 0 }); return s; }
const KS = ['chorus', 'B', 'hold', 'fly', 'film', 'psv', 'auto'], VAL = [0, 0, 0, 0, 0, 0, 0], HAS = [false, false, false, false, false, false, false];
// 지금 쥔 수들이 풀릴 때 더해질 머리 열 (첫 칸 × 1, 두 번째 × 1.3, k번째 X × (1 + heat (k + 1)))
const TU = require('./tune').api, LN2 = Math.LN2;
// 한 시전이 풀릴 때의 머리 열 (손잡이를 돌렸으면 그 값: rules/tune의 비용 × log₂(1 + E), 숨기면 더)
function heatOf(c) { const s = c.s; let k = 1; if (c.tk) { const E = TU.energy(s, c.tz, c.tf, c.tv); k = XX.log(1 + E) / LN2 * (c.hid ? 1 + TU.P.hide.heat : 1); } return s.cost * 1.6 * k; }
function pend(m, S) { let h = 0; if (m.cast) h += heatOf(m.cast); if (m.castB) h += heatOf(m.castB) * 1.3; for (let i = 0; i < S.X.length; i++) h += heatOf(S.X[i]) * (1 + P.x.heat * (i + 2)); return h; }
// 장부: 이번 걸음의 일과 고리를 나눈다 (걸음마다, 새 객체 없이)
function alloc(X, W, m) {
  const S = stOf(m), V = P.v, R = W.rules.circles ? Math.max(1, m.circles) : 1; let fixed = 0;
  if (m.cast || m.chan) fixed++; fixed += S.X.length;
  for (const z of W.zones) if (z.up && z.src === m) fixed++;
  if (m.buf.speed || m.buf.elecRes || m.buf.bluntRes || m.buf.toxRes) fixed++;
  const flying = W.rules.flight && ((m.z >= 1 && m.fly === 1) || m.flyWant);
  let danger = false; if (flying) { for (const a of W.areas) if (a.src.side !== m.side && !a.vis && X.hyp(a.x - m.x, a.y - m.y) < a.r + P.danger) { danger = true; break; }
    if (!danger) for (const t of W.traps) if (t.src.side !== m.side && X.hyp(t.x - m.x, t.y - m.y) < P.danger) { danger = true; break; } }
  let aimed = false; if (W.rules.circles && m.circles >= 3) for (const q of W.foes[m.side]) if (q.hp > 0 && ((q.cast && q.cast.tgt === m) || (q.castB && q.castB.tgt === m))) { aimed = true; break; }
  const b = m.castB, held = !!(b && b.hold && b.t >= b.T);
  HAS[0] = !!CH.of(W, m); VAL[0] = V.chorus; HAS[1] = !!b && !held; VAL[1] = V.B; HAS[2] = held; VAL[2] = V.hold;
  HAS[3] = !!flying; VAL[3] = danger ? V.flyDanger : V.fly; HAS[4] = !!flying && m.airFilm; VAL[4] = V.film;
  HAS[5] = m.st.psv > 0; VAL[5] = PS.holdOn && PS.holdOn(W, m) ? V.psvHold : V.psv; HAS[6] = !!(W.rules.circles && m.circles >= 3); VAL[6] = aimed ? V.autoAimed : V.auto;
  let left = R - fixed; S.over = left < 0 ? -left : 0; if (left < 0) left = 0;
  S.chorus = S.B = S.hold = S.fly = S.film = S.psv = S.auto = true;
  // 값이 높은 차례로 (일곱이라 고르기 정렬 없이 매번 가장 큰 것)
  for (let n = 0; n < 7; n++) { let bi = -1; for (let i = 0; i < 7; i++) if (HAS[i] && (bi < 0 || VAL[i] > VAL[bi])) bi = i; if (bi < 0) break; HAS[bi] = false;
    if (left > 0) left--; else S[KS[bi]] = false; }
  if (S.fly === false) S.film = false;
  S.R = R; S.F = left; return S;
}
module.exports = {
  name: 'ringLedger', switch: 'ringLedger', api: { P, stats: W => wsOf(W).by, extra: m => stOf(m).X, ledger: m => ST.get(m) || null, alloc: (W, m) => alloc(XX, W, m) },
  engine: X => {
    XX = X;
    return {
      mageStep(W, m) {
        const S = stOf(m), dt = W.dt;
        if (S.X.length) {   // 셋째 칸부터: 짓고 풀고, 굳거나 쓰러지면 흩어진다
          const by = wsOf(W).by[tierOf(m)];
          if (m.st.stun > 0 || !(m.hp > 0)) { if (by) by.xLost += S.X.length; S.X.splice(0); }
          else { let w = 0; for (let i = 0; i < S.X.length; i++) { const c = S.X[i]; c.t += dt; if (c.t >= c.T) { const k = XK.get(c) || 1; if (W.rules.fatigue && !c.s.mundane && m.fat + heatOf(c) * (1 + P.x.heat * (k + 1)) > P.x.dropAt) { if (by) by.xDrop++; continue; } if (by) by.xRel++; X.release(W, m, c); } else S.X[w++] = c; } if (w < S.X.length) S.X.splice(w); }   // 풀면 머리가 넘칠 X는 놓는다(흩어짐, 머리 열 없이)
        }
        const n = (m.cast || m.chan ? 1 : 0) + (m.castB ? 1 : 0) + S.X.length; if (n > 2 && W.rules.fatigue) m.fat += P.holdHeat * (n - 2) * dt;   // 오래는 못 쥔다
        const s = alloc(X, W, m);
        if (!s.hold && m.castB && m.castB.hold) m.castB = null;   // 붙잡은 수를 내려놓는다
        if (!s.psv && m.st.psv > 0) PS.off(W, m);
        // 지표
        const k = tierOf(m), WB = wsOf(W).by, by = WB[k] || (WB[k] = T0()); by.T += dt; by.ringT += s.R * dt; by.usedT += (s.R - s.F) * dt; if (s.F <= 0) by.full += dt;
        if (!s.fly) by.drop.fly += dt; if (!s.psv && m.st.psv > 0) by.drop.psv += dt; if (!s.auto) by.drop.auto += dt; if (!s.B) by.drop.B += dt;
      },
      release(W, m, c) { const k = XK.get(c); if (k == null || !W.rules.fatigue || c.s.mundane) return; m.fat += c.s.cost * 1.6 * P.x.heat * (k + 1); },   // c.s는 이미 손잡이가 박힌 사본(cost에 log₂(1 + E))   // k번째 X의 머리 열
    };
  },
  brain: B => ({
    heat(W, m, h) { const s = ST.get(m); if (!s || !s.X.length) return h; let x = 0; for (let i = 0; i < s.X.length; i++) x += heatOf(s.X[i]) * (1 + P.x.heat * (i + 2)); return h + x + P.holdHeat * Math.max(0, (m.cast || m.chan ? 1 : 0) + (m.castB ? 1 : 0) + s.X.length - 2); },   // 쥔 셋째 칸부터의 수가 풀릴 때의 머리 열 + 1 s의 오래 쥠 (손잡이·스스로 죽지 않기가 본다)
    circles(W, q, c) { const s = ST.get(q); if (!s) return c; return s.auto ? 3 : s.F >= 1 ? 2 : 1; },   // 장부가 정한 수: 자동 진이 고리를 받았나, 두 번째 칸에 빈 고리가 있나 (맨 뒤라 다른 규칙의 깎기를 덮는다)
    slot(W, m, K, slot) {
      const s = ST.get(m); if (!s) return slot;
      if (slot === 'B' && s.F < 1) return '';
      if (!slot && (m.cast || m.chan) && m.castB && s.F >= 1 && K.T.slotB && m.fat < P.x.fatMax && m.glu > P.x.gluMin) return 'X';   // 빈 고리만큼 더
      return slot;
    },
    commit(W, m, K, best, cast) {
      const s = stOf(m), WB = wsOf(W).by, k = tierOf(m), by = WB[k] || (WB[k] = T0());
      if (K.slot === 'X') { s.X.push(cast); const x = s.X.length; XK.set(cast, x); m.glu -= best.cost * P.x.glu * (x + 1); if (m.glu < 0) m.glu = 0; by.xN++; }
      const n = (m.cast || m.chan ? 1 : 0) + (m.castB ? 1 : 0) + s.X.length; by.hist[n < 8 ? n : 8]++;   // 시작할 때 동시에 짓는 수
    },
    bound(W, m, K) { const s = ST.get(m); if (!s) return; if (!s.fly && m.flyWant) m.flyWant = false; if (!s.psv && m.st.psv > 0) PS.off(W, m); },   // 내려놓은 날기·잔기술
    valueLate(W, m, K, o) { const s = ST.get(m); if (!s || !(o.v > 0)) return;
      if (W.rules.fatigue && (s.X.length || K.slot === 'X') && m.fat + pend(m, s) + o.s.cost * 1.6 * (K.slot === 'X' ? 1 + P.x.heat * (s.X.length + 2) : K.slot === 'B' ? 1.3 : 1) > (K.slot === 'X' ? P.x.heatCap : P.x.capAll)) { o.v = 0; return; }   // 쥔 수들이 풀릴 때의 머리 열까지 셈해 넘치면 셋째 칸부터는 짓지 않는다
      const b = o.s.b; if (o.s.t === 'buff' && b && (b.speed || b.elecRes || b.bluntRes || b.toxRes) && s.F < 1) o.v = 0; },   // 몸 강화도 고리가 있어야
  }),
};
}, {"../../data/rules/ringLedger.json":"data/rules/ringLedger.json","./chorus":"src/rules/chorus.js","./passive":"src/rules/passive.js","./tune":"src/rules/tune.js"}];
D["src/rules/rings.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 고리 장부 (rules.rings, v2.22, SPEC 46장, 수는 data/rules/rings.json) — 1단계: 읽어내기만, 판에 닿지 않는다
 * 설정: 심장 둘레의 공생 조직 고리(서클). 고리마다 붙잡은 것이 다르고 모습이 다르다.
 * 지금 엔진은 서클의 "수"만 센다(규칙마다 깎는다: 날기 −1·공기막 −1·잔기술 −1·버팀 벽 −1, 문턱 2 두 번째 칸·3 자동 진). 이 규칙은 매 걸음
 *   사람마다 고리 장부 m.mlog.rings를 지금 상태에서 다시 읽어낸다(난수·판의 값은 건드리지 않는다: 켜도 지문 그대로).
 *   고리 n개(서클 규칙이 켜지면 m.circles, 아니면 1). 고리 하나 = { k 상태, n 마법 이름, el 원소, p 진행 0~1, v 드러남, f 쏜 때·막은 때 }
 *   상태: 짓기(첫 칸 'A'·두 번째 칸 'B') / 붙잡음(hold: 두 번째 칸을 다 짓고 쥐고 있음) / 잔기술(종류) / 날기 / 공기막 / 버팀 벽 / 자동 진 / 몸 / 빈
 *   차례: 엔진이 서클을 세는 일 먼저, 보이기만 하는 일(자동 진, 몸)은 남은 고리에. 앉은 고리는 그 일이 끝날 때까지 자리를 지킨다(안쪽부터 채운다)
 *   녹화하거나(W.rec: 샌드박스) 지표를 재는(W._wt: metrics/watch) 판에서만 읽는다(v2.23.1). 지표는 watch가 처음 불린 걸음부터
 *   기록(지표, 보기만): 고리·초(tot), 빈 고리·초(emp), 꽉 찬 초(full), 상태별 고리·초(by), 넘친 초(over: 일이 고리보다 많았던 때) */
const P = require('../../data/rules/rings.json');
const KEYS = ['날기', '공기막', '잔기술', '버팀 벽', '짓기', '붙잡음', '자동 진', '몸', '빈'];
function newLedger(n) {
  const r = []; for (let i = 0; i < n; i++) r.push({ k: '빈', id: '', n: '', el: '', p: 0, v: 1, f: -9, fk: '' });
  const by = {}; for (const k of KEYS) by[k] = 0;
  return { r, n, tot: 0, emp: 0, full: 0, over: 0, T: 0, by, cA: null, cB: null, au: 0, want: [] };
}
const elOf = s => (s && s.el) || '없음';
const visOf = c => { const v = (c.vis > 0 ? c.vis : 1) * (c.hid ? 1 / 3 : 1); return v > 1 ? 1 : v < P.minVis ? P.minVis : v; };
function add(w, id, k, n, el, p, v) { w.push(id, k, n, el, p, v); }
// 이번 걸음에 고리를 쓰는 일들 (차례대로): [id, 상태, 이름, 원소, 진행, 드러남]
function wants(W, m, L) {
  const w = L.want; w.length = 0;   // 켜진 판에서만 (보기용)
  if (W.rules.flight && m.z >= 1 && m.fly !== 3) { add(w, 'fly', '날기', '', '', 0, 1); if (m.airFilm) add(w, 'film', '공기막', '', '', 0, 1); }
  if (m.st.psv > 0) add(w, 'psv', '잔기술', ['', '절연 막', '굳은 살', '열 차단'][m.st.psv] || '', P.psvEl[m.st.psv] || '없음', 0, 1);
  for (const z of W.zones) if (z.up && z.src === m) add(w, 'bul', '버팀 벽', z.n || '', '흙', 0, 1);
  const a = m.cast || m.chan; if (a) add(w, 'A', '짓기', a.s.n, elOf(a.s), m.cast ? Math.min(1, a.t / (a.T || 1)) : 1, m.cast ? visOf(a) : 1);
  const b = m.castB; if (b) add(w, 'B', b.hold && b.t >= b.T ? '붙잡음' : '짓기', b.s.n, elOf(b.s), Math.min(1, b.t / (b.T || 1)), visOf(b));
  if (W.rules.circles && m.circles >= 3) add(w, 'auto', '자동 진', '', '없음', 0, 1);
  if (m.buf.speed || m.buf.elecRes || m.buf.bluntRes || m.buf.toxRes) add(w, 'body', '몸', '', '없음', 0, 1);
  return w;
}
function read(W, m) {
  const n = W.rules.circles ? Math.max(1, m.circles) : 1;
  let L = m.mlog.rings; if (!L || L.n !== n) L = m.mlog.rings = newLedger(n);
  const R = L.r, w = wants(W, m, L), dt = W.dt;
  // 쏜 칸: 지난 걸음의 시전이 다 지어져 풀렸다 → 그 고리를 튕긴다
  const relA = L.cA && L.cA !== m.cast && L.cA.t >= L.cA.T - dt * 1.5, relB = L.cB && L.cB !== m.castB && L.cB.t >= L.cB.T - dt * 1.5;
  for (const g of R) if ((g.id === 'A' && relA) || (g.id === 'B' && relB)) { g.f = W.t; g.fk = 'shot'; }
  L.cA = m.cast; L.cB = m.castB;
  // 자동 진이 막았다 (간격이 막 걸렸다)
  if (m.autoCd > L.au + 1e-9) for (const g of R) if (g.id === 'auto') { g.f = W.t; g.fk = 'flash'; }
  L.au = m.autoCd;
  // 끝난 일의 고리를 비운다
  for (const g of R) { if (!g.id) continue; let keep = false; for (let i = 0; i < w.length; i += 6) if (w[i] === g.id) { keep = true; break; } if (!keep) { g.id = ''; g.k = '빈'; g.n = ''; g.p = 0;
      g.v = 1; } }
  // 일을 고리에 (있던 자리 그대로, 새 일은 안쪽 빈 고리에). 버팀 벽은 여럿일 수 있어 같은 id를 차례로
  let over = 0;
  for (let i = 0; i < w.length; i += 6) {
    const id = w[i]; let g = null;
    if (id !== 'bul') for (const x of R) if (x.id === id) { g = x; break; }
    if (id === 'bul') { let seen = 0; for (let j = 0; j < i; j += 6) if (w[j] === 'bul') seen++; let c = 0; for (const x of R) if (x.id === 'bul') { if (c === seen) { g = x; break; } c++; } }
    if (!g) for (const x of R) if (!x.id) { g = x; break; }
    if (!g) { over++; continue; }
    g.id = id; g.k = w[i + 1]; g.n = w[i + 2]; g.el = w[i + 3]; g.p = w[i + 4]; g.v = w[i + 5];
  }
  // 기록
  let emp = 0; for (const g of R) { L.by[g.k] += dt; if (!g.id) emp++; }
  L.tot += n * dt; L.emp += emp * dt; L.T += dt; if (!emp) L.full += dt; if (over) L.over += dt;
}
// 지표 (metrics/watch가 합친다): 고리·초의 몫
function seen(m) {
  const L = m.mlog.rings; if (!L || !L.tot) return {};
  const o = { '고리 수': L.n, '빈 고리 몫': L.emp / L.tot, '고리가 꽉 찬 시간 몫': L.full / L.T, '일이 고리보다 많았던 시간 몫': L.over / L.T };
  for (const k of KEYS) o['고리 시간 몫: ' + k] = L.by[k] / L.tot;
  return o;
}
module.exports = {
  name: 'rings', switch: 'rings', api: { P, KEYS, read, seen },
  engine: X => ({ stepEnd(W) { if (!W.rec && !W._wt) return; for (const m of W.ms) if (m.hp > 0) read(W, m); } }),   // 걸음의 끝에서 (두뇌가 이 걸음에 시작한 시전까지). 녹화(샌드박스)나 지표(metrics/watch)를 잴 때만 (v2.23.1: 매 걸음 3%)
};
}, {"../../data/rules/rings.json":"data/rules/rings.json"}];
D["src/rules/risk.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 하이 리스크 하이 리턴 (rules.risk, 1.9.0~, SPEC 7장)
 * 큰 마법(big: 1 — 대낙뢰·화산 기둥·번개 창)이 책에 남는다. 모으는 중에 한 번에 3 이상 맞으면 역류(끊기고 22 피해, 0.6 s 굳음).
 * 쏜 뒤 0.9 s 빈손(첫 칸·자동 진 불가, 걸음 × 0.6). 두뇌: 큰 수의 때 가리기, 상대의 큰 수 끊기, 빈손 몰아치기, 짝 묶기(대가·전설) */
module.exports = {
  name: 'risk', on: W => W.rules.risk,
  engine: X => ({
    release(W, m, c) { if (c.s.big) { m.emptyT = W.t + 0.9; m.log.bigCast++; } },   // 빈손: 큰 마법 뒤 0.9 s 동안 시전 불가, 속도 × 0.6
    // 역류: 큰 마법을 모으는 중에 3 이상 맞으면 끊기고 22 피해, 0.6 s 굳음
    hurt(W, m, v) { if (v >= 3 && ((m.cast && m.cast.s.big) || (m.castB && m.castB.s.big)) && m.hp > 0) { if (m.cast && m.cast.s.big) m.cast = null; if (m.castB && m.castB.s.big) m.castB = null;
        m.log.backfire++; m.st.stun = Math.max(m.st.stun || 0, 0.6); X.hurt(W, m, 22, null, '역류', 'backfire'); } },
    speed(W, m, sp) { return sp * (m.emptyT > W.t ? 0.6 : 1); },
  }),
  brain: B => {
    const { PAIRS, pinned, hitBack, castTime, landDelay, estDmg, maxRange, bindOf } = B;
    const L = B.lib, dodgeAim = { value: L.dodgeAim }, grab = { value: L.grabValue, commit: L.grabCommit }, undo = L.undo;   // 두뇌가 넘겨준다 (v2.23.1)
    return {
      aim(W, m, K) { if (m.tac.dodgeAim) K.wantMem = true; },   // 피할 자리 겨냥은 구르는 쪽 기록(학습)을 쓴다
      empty(W, m) { return m.emptyT > W.t; },                    // 빈손: 첫 칸과 자동 진을 못 쓴다
      // 짝에 맞춰 모으던 큰 수 (대가·전설): 짝이 떨어졌는데 과녁이 안 굳었으면 끊고, 굳었으면 끝을 과녁에 다시 겨눈다
      cancel(W, m, K) { const e = K.e; if (K.T.bigPlan && m.cast && m.cast.s.big && m.cast.pairLand && W.t > m.cast.pairLand + 0.05) { const c = m.cast;
          if (e.st.stun > 0 || e.st.root > 0) { c.tx = e.x; c.ty = e.y; } else undo(m, c); } },
      // 큰 수는 입장 판단이 있으면 때를 가린다, 상대의 큰 수는 빠른 공격으로 끊는다, 빈손은 몰아친다
      valueRisk(W, m, K, o) {
        const T = K.T, e = K.e, d = K.d, s = o.s, n = o.n, Tw = o.Tw;
        const noRoll = e.rollCd > 0.4 || e.stam < 1.5 || K.eDown || e.st.mycel > 0.4 || e.st.cramp > 0.4;   // 과녁이 당분간 못 구른다
        o.pin = W.rules.bodyBind && s.big && pinned(W, m, s, e, castTime(W, m, Tw), d) && hitBack(W, e, K.S, d) > castTime(W, m, Tw) + 0.05;   // 몸 묶기: 빠져나갈 수 없게 붙잡혔고, 모으는 동안 맞지 않는다
        if (s.big && T.stance && !(K.eDown || o.pin || e.emptyT > W.t || d > Math.max(8, maxRange(e, K.S)) || !K.los)) o.v = 0;   // 멀다 = 과녁의 사거리 밖
        // 판을 짜는 사람(대가·전설)은 큰 수를 짝의 틈이나, 남은 굳힘 안에 닿을 때만 쓴다 (아래 짝 계획이 다시 연다)
        if (s.big && T.bigPlan && !(o.pin || Math.max(e.st.stun || 0, e.st.root || 0) > castTime(W, m, Tw) + landDelay(s, d) + 0.02)) o.v = 0;
        else if (s.big && T.bigPlan) { o.v = Math.max(o.v, 30); o.tx = e.x; o.ty = e.y; }
        if (o.isOff && !s.big && T.readCast) { const bc = e.cast && e.cast.s.big ? e.cast : e.castB && e.castB.s.big ? e.castB : undefined;
          if (bc && Tw + landDelay(s, d) < bc.T - bc.t && estDmg(s) >= 3) o.v *= 2.2; if (e.emptyT > W.t) o.v *= 1.5; }
        // 짝 묶기 (대가·전설): 짝을 열 수 있으면 먼저 열고, 연 뒤에는 짝의 틈에 큰 수를 꽂는다
        if (T.bigPlan) {
          const bp = m.bigp && m.bigp.tgt === e && W.t < m.bigp.until ? m.bigp : null; if (m.bigp && !bp) m.bigp = null;
          // 짝은 과녁이 빠져나갈 수 없을 때(이미 묶였거나 굳음, 또는 젖음형은 당분간 못 구를 때) 연다: 예비동작을 읽는 상대는 보이는 짝을 걸어서 피한다
          const pr = PAIRS[n];
            if (!bp && pr && (K.eDown || (pr.kind === 'wet' && noRoll)) && m.book.includes(pr.fin) && !((m.cd[pr.fin] || 0) > 0) && m.glu > o.cost + K.S[pr.fin].cost && o.v > 0) o.v = Math.max(o.v, 1.2);
          if (bp && n === bp.fin) { const ld = castTime(W, m, Tw) + landDelay(s, d), held = Math.max(e.st.stun || 0, e.st.root || 0); o.v = 0;
            // 굳힘형: 짝이 떨어지기 전에 모으기 시작해 굳힘 한가운데 닿게 한다(빗나가면 캔슬). 이미 걸렸으면 남은 굳힘 안에 닿을 때만
            if (bp.kind === 'bind') { const at = W.t + ld;
              if (held > ld + 0.02) { o.v = 60; o.tx = e.x; o.ty = e.y; }
              else if (W.t < bp.land && at >= bp.land + 0.05 && at <= bp.land + bp.bind - 0.05) { o.v = 60; const k = bp.land - W.t; o.tx = e.x + e.vx * k; o.ty = e.y + e.vy * k; }
              else if (W.t < bp.land && at < bp.land + 0.05) m.thinkT = Math.min(m.thinkT, Math.max(0.01, bp.land + 0.05 - at + 0.01));
              else if (W.t >= bp.land + 0.1) m.bigp = null; }
            // 젖음·빙판·몰이형: 그 상태이고 과녁이 당분간 못 구르거나 묶였을 때
            else if (noRoll && ((bp.kind === 'wet' && e.st.wet > 0) || (bp.kind === 'ice' && W.zones.some(z => z.src === m && z.k === 'ice' && B.C.inZone(z, e.x, e.y))) || (bp.kind === 'herd' && m.herd && W.t < m.herd.until))) {
              o.v = 60; const k = held > 0 ? 0 : 0.5; o.tx = e.x + e.vx * ld * k; o.ty = e.y + e.vy * ld * k; if (bp.kind === 'herd') { o.tx += -K.uy * m.herd.side * 1.2;
                o.ty += K.ux * m.herd.side * 1.2; }
            }
          }
        }
        dodgeAim.value(W, m, K, o);   // 피할 자리 겨냥 (상급부터)
        grab.value(W, m, K, o);       // 붙잡기 (대가부터)
      },
      commit(W, m, K, best, cast, Tc) {
        const T = K.T, e = K.e, d = K.d, s = best.s;
        grab.commit(W, m, K, s);
        if (!T.bigPlan) return;
        if (s.big && best.pin && !(Math.max(e.st.stun || 0, e.st.root || 0) > 0)) m.log.bigPin++;   // 굳힘·묶임 없이 몸 묶기·기둥·눈멂으로 붙잡은 과녁에 큰 수
        if (s.big) { if (m.bigp && s.n === m.bigp.fin) { m.log.bigPair++; if (m.bigp.kind === 'bind' && W.t < m.bigp.land) cast.pairLand = m.bigp.land; } m.bigp = null; }
        else if (PAIRS[s.n] && m.book.includes(PAIRS[s.n].fin) && !((m.cd[PAIRS[s.n].fin] || 0) > 0) && (K.eDown || (PAIRS[s.n].kind === 'wet' && (e.rollCd > 0.4 || e.stam < 1.5)))) { const pr = PAIRS[s.n];
          m.bigp = { tgt: e, fin: pr.fin, kind: pr.kind, land: W.t + Tc + landDelay(s, d) + (s.t === 'cone' ? s.dur : 0), bind: bindOf(s, e), until: W.t + Tc + 4 }; }
      },
    };
  },
};
}, {}];
D["src/rules/saltLand.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 소금 땅 (장면의 salt 사각형이 있을 때만, v2.0 둘째 묶음, SPEC 25장)
 * 소금은 마력을 끊는다(WORLD 148): 소금 땅 위에서 만들어지는 마법은 흩어진다(g = 0, 총은 그대로), 소금 땅 위에선 뜰 수 없다(rules/flight가 본다).
 * 소금 도시 장면: 싸움터 대부분이 소금 땅이고 광장만 맨땅이다 */
module.exports = {
  name: 'saltLand', on: W => W.salt.length > 0,
  engine: X => ({
    // 짓는 벽(build)은 짓는 동안 블록이 하나씩 선다: 소금 땅에 올라서면 흙을 더 끌어오지 못한다 (v2.25: 풀 때만 보던 구멍)
    mageStep(W, m) { const c = m.cast; if (c && c.s.t === 'build' && X.onSalt(W, m.x, m.y)) { m.cast = null; m.log.fizz++; } },
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return X.onSalt(W, p[0], p[1]); },
  }),
  brain: B => ({
    // 소금 땅 위에 설 자리의 마법은 버린다 (흩어질 것을 쏘지 않는다)
    value(W, m, K, o) { const s = o.s; if (!(o.v > 0) || s.mundane) return; const k = s.t; const at = k === 'area' || k === 'zone' || k === 'trap' || k === 'thread' ? [o.tx, o.ty] : [m.x, m.y]; if (B.C.onSalt(W, at[0], at[1])) o.v = 0; },
  }),
};
}, {}];
D["src/rules/saltRing.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 줄어드는 소금 원 (rules.saltRing, 1.9.0, SPEC 2장)
 * 싸움터 가운데 중심, 15 s부터 60 s 동안 반지름 4 m까지 줄어든다. 선 밖에서 만들어지는 마법은 흩어지고(g = 0), 선 밖에 선 사람은 초당 6 마른다.
 * 두뇌: 선 1.5 m 안쪽으로 오면 가운데로 돌아간다
 * 스스로 죽지 않기 (v2.6, 판단 수준의 tac.survive, 선명도 5 이상, SPEC 30장): 안전 반경 = 1.5 s 뒤의 반지름 − 1.5 m − 지금 속도로 설 거리.
 *   모든 걸음이 정해진 뒤(두뇌 훅 bound) 바깥쪽 걸음을 지우고(벽을 따라 미끄러진다), 안전 반경 밖이면 안으로. 나는 사람은 설 수 있는 속도로 늦춘다.
 *   3 s 뒤의 반지름이 15 m 아래면 땅이 안전할 때(적에게 함정·안 보이는 구름·벽 밀기가 없을 때) 내려앉아 걷는다. 아니면 떠서 5 m/s 아래로. 여유는 min(1.5 m, 반지름 × 0.25). 구르기도 끝 자리가 선 밖이면 반대로, 그쪽도 밖이면 구르지 않는다 */
const { hyp } = require('../math');
const SALT = { t0: 15, dur: 60, rMin: 4, dps: 6 }, SAFE = { look: 1.5, pad: 1.5, padK: 0.25, land: 3, landR: 15, smallV: 5, flyA: 29.4, walkA: 20, backV: 8, roll: 0.3 };
function saltRAt(W, t) { const R0 = hyp(W.width, W.height) / 2; return Math.max(SALT.rMin, R0 - Math.max(0, t - SALT.t0) * (R0 - SALT.rMin) / SALT.dur); }
function saltR(W) { return saltRAt(W, W.t); }
const safeOn = m => m.tac.survive && m.C >= 5;
// 벽 (v2.6): 걸음 방향 (vx, vy)를 안전 반경에 맞춘다. 바깥쪽 몫을 지우고(벽을 따라 미끄러진다), 지금 속도로 설 거리까지 넣어 안전 반경 밖이면 안으로.
// 나는 사람: 밖이면 안으로 8 m/s까지, 안이면 둘레로 꺾을 수 있는 속도(√(a·R))로. 고칠 게 없으면 null
const WO = [0, 0];
function wallOf(W, m, vx, vy) {
  const rx = m.x - W.width / 2, ry = m.y - W.height / 2, r = hyp(rx, ry) || 0.01, ux = rx / r, uy = ry / r, fly = m.fly === 1 && m.z >= 1;
  const Rf = saltRAt(W, W.t + SAFE.look), a = fly ? SAFE.flyA : SAFE.walkA, Rs = Rf - Math.min(SAFE.pad, SAFE.padK * Rf) - (m._k ? m._k.saltPad : 0), vr = m.vx * ux + m.vy * uy, brake = vr > 0 ? vr * vr / (2 * a) : 0;
  if (r + brake < Rs - 1) return null;
  const out = vx * ux + vy * uy; if (out > 0) { vx -= ux * out; vy -= uy * out; }
  const outside = r + brake >= Rs; if (outside) { const l = hyp(vx, vy); vx = vx * 0.5 - ux * (l > 1 ? l : 2); vy = vy * 0.5 - uy * (l > 1 ? l : 2); }
  if (fly) { if (outside) { if (m.fv < SAFE.backV) m.fv = SAFE.backV; } else { const cap = Math.sqrt(a * Rs); if (m.fv > cap) m.fv = cap; } }
  WO[0] = vx; WO[1] = vy; return WO;
}
// 반사 겹(rules/reflex)이 걸음을 덮을 때도: 덮은 걸음 방향(m.mv)을 고치고, 좁은 원에선 나는 속도도 늦춘다
function wall(W, m) { const o = wallOf(W, m, m.mv.x, m.mv.y); if (o) { m.mv.x = o[0]; m.mv.y = o[1]; } if (m.fly === 1 && m.fv > SAFE.smallV && saltRAt(W, W.t + SAFE.land) < SAFE.landR) m.fv = SAFE.smallV; }
// (x, y)가 안전 반경 안인가 (옆 튀기의 끝 자리)
function safeAt(W, x, y) { const Rf = saltRAt(W, W.t + SAFE.look); return hyp(x - W.width / 2, y - W.height / 2) < Rf - Math.min(SAFE.pad, SAFE.padK * Rf); }
// 단단한 벽 (v2.6): 안전 반경 밖으로 나가는 걸음을 지운다. 빠른 판(rules/pace)이 걸음을 바꾼 뒤에도 다시 부른다 (v2.14)
function bound(W, m, K, B) {
  if (!safeOn(m)) return;
  if (saltRAt(W, W.t + SAFE.land) < SAFE.landR) { if (B.groundSafe(W, m)) m.flyWant = false; else if (m.fv > SAFE.smallV) m.fv = SAFE.smallV; }   // 좁은 원: 땅이 안전하면 내려앉아 걷고, 아니면 떠서 천천히
  const o = wallOf(W, m, K.vx, K.vy); if (o) { K.vx = o[0]; K.vy = o[1]; }
}
const outSalt = (W, x, y) => W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > saltR(W);
module.exports = {
  name: 'saltRing', on: W => W.rules.saltRing, api: { SALT, SAFE, saltR, saltRAt, outSalt, wall, safeAt, safeOn, bound },
  engine: X => ({
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return outSalt(W, p[0], p[1]); },   // 선 밖에선 마법이 서지 않는다
    mageStep(W, m) { if (outSalt(W, m.x, m.y)) X.hurt(W, m, SALT.dps * W.dt, null, '소금', 'salt', true); },   // 선 밖에선 몸이 마른다
    // 선 밖으로 구르지 않는다 (v2.6): 끝 자리(구르는 속도 × 0.3 s)가 선 0.5 m 안쪽이 아니면 반대로, 그쪽도 밖이면 구르지 않는다
    roll(W, m, o) {
      if (!safeOn(m)) return; const l = hyp(o.dx, o.dy) || 1, k = o.v * SAFE.roll / l, cx = W.width / 2, cy = W.height / 2, R = saltR(W) - 0.5;
      if (hyp(m.x + o.dx * k - cx, m.y + o.dy * k - cy) < R) return;
      if (hyp(m.x - o.dx * k - cx, m.y - o.dy * k - cy) < R) { o.dx = -o.dx; o.dy = -o.dy; } else o.skip = true;
    },
  }),
  brain: B => ({
    // 이동 마법(돌진·넘기·미끄럼)은 떨어질 자리가 선 1 m 안쪽일 때만, 제자리에 묶이는 시전은 선 2.5 m 안쪽에서만 (v2.0: 1.x에선 선 밖에서 말랐다)
    value(W, m, K, o) { const s = o.s; if (!(o.v > 0)) return;
      if (s.lock) { if (hyp(m.x - W.width / 2, m.y - W.height / 2) > saltR(W) - 2.5) o.v = 0; return; }   // 제자리에 묶이는 시전(저격)은 선 2.5 m 안쪽에서만
      if (s.t !== 'move') return; const dx = o.tx - m.x, dy = o.ty - m.y, l = hyp(dx, dy) || 1, x = m.x + dx / l * s.dist, y = m.y + dy / l * s.dist; if (hyp(x - W.width / 2, y - W.height / 2) > saltR(W) - 1) o.v = 0; },
    steer(W, m, K) { const cx = W.width / 2 - m.x, cy = W.height / 2 - m.y, dc = hyp(cx, cy) || 1; if (dc > saltR(W) - 1.5) { K.vx = cx / dc * 2.5; K.vy = cy / dc * 2.5; } },
    bound: (W, m, K) => bound(W, m, K, B),   // 단단한 벽 (v2.6)
  }),
};
}, {"../math":"src/math.js"}];
D["src/rules/saltWise.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 소금을 아는 대마법사 (rules.saltWise, v2.30, SPEC 53장, 수는 data/rules/saltWise.json) — 기본 꺼짐. 소금 땅(saltLand)이 있는 판에서만 일한다
 * 선명도 cMin 이상의 마법사는
 *   서지 않는다: 소금 땅 위에 섰으면 가까운 맨땅으로 간다(과녁에서 너무 멀어지지 않는 곳). 맨땅에서 과녁이 손닿는 거리면 소금으로 걸어 들어가지 않고
 *     걸음을 45°·90°·135° 돌려 소금 둘레를 따라 돈다(멈춰 서면 총 앞의 과녁이다)
 *   흩어질 수는 쓰지 않는다: 값 고치기가 다 끝난 뒤의 겨눈 자리로 다시 본다(앞의 기술이 과녁을 옮겼을 수 있다). 자동 진의 반사 방패도 소금 위에선 세우지 않는다(rules/gunfire)
 *   길 (v2.32): 과녁이 멀어 소금으로 걸어 들어가야 하면 16 방향 가운데 (나아가는 거리 − saltK × probe m 안의 소금 길이)가 큰 쪽으로
 *   과녁이 소금 위면 내 자리에서 서는 수(직사·곡사)를 고른다(값 × lobK) */
const P = require('../../data/rules/saltWise.json');
const SELF = { proj: 1, lob: 1 };
const H = 0.707107, ROT = [[H, H], [H, -H], [0, 1], [0, -1], [-H, H], [-H, -H]];   // 45°·90°·135° 돌리기 [cos, sin]
const on = (W, m) => W.salt.length > 0 && m.C >= P.cMin;
module.exports = {
  name: 'saltWise', switch: 'saltWise', api: { P, on },
  brain: B => ({
    valueLate(W, m, K, o) {
      if (!(o.v > 0) || !on(W, m)) return; const s = o.s; if (s.mundane) return;
      const p = B.C.FORM[s.t] === 'body' ? null : formAt(B, m, s, o.tx, o.ty); if (p ? B.C.onSalt(W, p[0], p[1]) : (m.z < 1 && B.C.onSalt(W, m.x, m.y))) { o.v = 0; return; }
      const e = K.e; if (SELF[s.t] && e && e.z < 1 && B.C.onSalt(W, e.x, e.y)) o.v *= P.lobK;
    },
    steer(W, m, K) {
      if (K.dodge || m.flee || m.z >= 1 || !on(W, m)) return; const e = K.e;
      if (!B.C.onSalt(W, m.x, m.y)) {   // 맨땅: 손닿는 과녁이 있으면 소금으로 들어가지 않는다
        const vx = K.vx, vy = K.vy; if (!B.C.onSalt(W, m.x + vx * P.look, m.y + vy * P.look)) return;
        if (!e || !(K.d <= K.prefR + P.reach)) { if (P.route) route(B, W, m, K, e); return; }   // 과녁이 멀다: 소금을 덜 밟는 길로 (v2.32)
        for (let i = 0; i < ROT.length; i++) { const c = ROT[i][0], s = ROT[i][1], rx = vx * c - vy * s, ry = vx * s + vy * c;   // 소금 쪽 몫을 버리고 둘레를 따라 돈다 (서 있으면 총 앞의 과녁이다)
          if (!B.C.onSalt(W, m.x + rx * P.look, m.y + ry * P.look)) { K.vx = rx; K.vy = ry; return; } }
        K.vx = 0; K.vy = 0; return; }
      let bx = 0, by = 0, bs = 1e9;
      for (let i = 0; i < P.radii.length; i++) { const r = P.radii[i]; if (r > bs) break;
        for (let k = 0; k < P.dirs; k++) { const a = k * 6.2832 / P.dirs, x = m.x + B.C.cos(a) * r, y = m.y + B.C.sin(a) * r;
          if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1 || B.C.onSalt(W, x, y)) continue;
          const sc = r + (e ? P.far * Math.max(0, B.hyp(e.x - x, e.y - y) - K.prefR) : 0); if (sc < bs) { bs = sc; bx = x; by = y; } } }
      if (bs < 1e9) { const dx = bx - m.x, dy = by - m.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * P.v; K.vy = dy / l * P.v; }
    },
  }),
};
// 길 고르기 (v2.32, route): 16 방향마다 probe m 앞까지 2 m씩 소금 위를 지나는 길이를 재, (과녁 쪽으로 나아가는 거리 − saltK × 소금 길이)가 가장 큰 쪽으로.
// 소금 위에선 날 수도 방패도 못 세운다(saltLand·artillery의 안개와 같은 뜻)
function route(B, W, m, K, e) {
  const sp = B.hyp(K.vx, K.vy) || P.v; let ux = K.vx / sp, uy = K.vy / sp; if (e) { const dx = e.x - m.x, dy = e.y - m.y, l = B.hyp(dx, dy) || 1; ux = dx / l; uy = dy / l; }
  let bx = 0, by = 0, bv = -1e9;
  for (let k = 0; k < 16; k++) { const a = k * 0.3927, cx = B.C.cos(a), cy = B.C.sin(a); let salt = 0;
    for (let r = 2; r <= P.probe; r += 2) { const x = m.x + cx * r, y = m.y + cy * r; if (x < 1 || y < 1 || x > W.width - 1 || y > W.height - 1) { salt += 1e3; break; } if (B.C.onSalt(W, x, y)) salt += 2; }
    const v = (cx * ux + cy * uy) * P.probe - P.saltK * salt; if (v > bv) { bv = v; bx = cx; by = cy; } }
  K.vx = bx * sp; K.vy = by * sp;
}
// 마법이 서는 자리 (core의 formPoint와 같은 셈)
function formAt(B, m, s, tx, ty) {
  const k = B.C.FORM[s.t], d = B.hyp(tx - m.x, ty - m.y) || 1;
  if (k === 'target' || k === 'path') return [tx, ty];
  if (k === 'front') { const L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5];
  return [m.x, m.y];
}
}, {"../../data/rules/saltWise.json":"data/rules/saltWise.json"}];
D["src/rules/selfSafe.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 스스로 다치지 않기 (rules.selfSafe, v2.30, SPEC 53장, 수는 data/rules/selfSafe.json) — 기본 꺼짐. 모든 단계의 바탕 위험 피하기
 * 낮은 단계(평범·중간)가 스스로 입은 피해는 거의 둘이었다: 큰 수를 모으다 맞은 역류(22, rules/risk)와 고르지 않은 파도(rules/wave). 그래서
 *   머리: 풀 때 머리가 넘칠(폭주·고르지 않은 파도) 수는 고르지 않고, 고르지 않은 파도에 올랐으면 위협이 없을 때 쉬어 내려온다 (상위의 '스스로 죽지 않기'를 누구나)
 *   큰 수: 겨눠진 동안·적이 near m 안에 있을 땐 모으지 않는다. 모으는 중에 닿을 위협을 보면(남은 시간이 cancelT s 넘게) 끊는다(당 70% 돌려받음) */
const P = require('../../data/rules/selfSafe.json');
module.exports = {
  name: 'selfSafe', switch: 'selfSafe', api: { P },
  brain: B => {
    const { heatOver, castTime, landDelay, hyp } = B, undo = B.lib.undo;
    const near = (W, m) => { const f = W.foes[m.side]; for (let i = 0; i < f.length; i++) { const q = f[i]; if (q.hp > 0 && !q.flee && hyp(q.x - m.x, q.y - m.y) < P.near) return true; } return false; };
    return {
      valueLate(W, m, K, o) {
        if (!(o.v > 0)) return; const s = o.s;
        if (!(m.tac.survive && m.C >= 5)) { const Bs = K.slot === 'B', other = Bs ? m.cast : m.castB, extra = other && !other.auto ? other.s.cost * (other.B ? 1.3 : 1) : 0;
          if (heatOver(W, m, o.cost + extra, castTime(W, m, o.Tw), 1)) { o.v = 0; return; } }
        if (s.big && W.rules.risk && (K.aimed || near(W, m))) o.v = 0;
      },
      cancel(W, m, K) {
        const c = m.cast; if (!c || !c.s.big || !W.rules.risk || c.T - c.t < P.cancelT) return;
        const th = K.threat; let hit = false;
        if (th && th.T - th.t + landDelay(th.s, hyp(th.tx - m.x, th.ty - m.y) + 0.5) < c.T - c.t) hit = true;
        else if (K.aimed && !th) hit = true;   // 날아오는 투사체
        if (hit) undo(m, c);
      },
      rest(W, m, K, r) { return r || (!(m.tac.survive && m.C >= 5) && W.rules.wave && m.wave && !(m.tac.waveChoose && m.waveWant) && !K.aimed); },
    };
  },
};
}, {"../../data/rules/selfSafe.json":"data/rules/selfSafe.json"}];
D["src/rules/silver.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 은실 옷 (rules.silver, 1.13.0, SPEC 10장, data/gear.json)
 * WORLD 3-4: "응답은 소금·은·독한 술·더 선명한 신호로 끊는다". 은실을 누빈 옷(gear.silver)이 몸에 닿는 응답을 끊어
 * 붙잡는 효과(굳음·묶임·균사·경직·석회·족쇄)의 길이를 × 0.5로. 값: 은은 전기를 잘 통해 전기 피해 × 1.1. 걸음(speed)은 기본 × 1(얇은 실이라 무겁지 않다).
 * 재 보니 입어도 이기지 못한다: 결투가 붙잡는 시간으로 갈리지 않는다 (reports/v1.13.0.md)
 * 수는 data/rules/silver.json. 스위치가 꺼져 있으면 입어도 아무 일 없다 */
const P = require('../../data/rules/silver.json');
module.exports = {
  name: 'silver', switch: 'silver', on: W => W.rules.silver,
  engine: () => ({
    effHold(W, m, o, g) { return m.gear.silver ? g * P.hold : g; },
    hurtMod(W, m, v, kind) { return kind === 'elec' && m.gear.silver ? v * P.elec : v; },
    speed(W, m, sp) { return m.gear.silver ? sp * P.speed : sp; },
  }),
};
}, {"../../data/rules/silver.json":"data/rules/silver.json"}];
D["src/rules/snap.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 끊는 움직임 (rules.snap, v2.4, SPEC 28장, 수는 data/rules/snap.json)
 * 걸음의 속도가 목표를 스르르(지수로) 따라가던 것을, 가속 한계 안에서 곧장(일정 가속으로) 따라가게 한다: 붙었다 멈췄다가 "딱딱" 끊긴다.
 *   가속 한계 a = min(5 g, 2.5 g × 회피 배수(1 + 0.25·log₂ C, 회피 규칙이 꺼지면 1)): 평범 2.5 g, 중간 3.3 g, 상위 3.9 g, 대마법사 4.6 g. 빙판 위는 × 가속/9
 *     앞뒤와 옆으로 나눈다: 옆·가속은 a, 거꾸로 밟아 서기는 2a(대마법사 9.2 g). 대마법사의 달리기(9.2 m/s)가 0.1 s 만에 서고 0.3 s에 거꾸로 제 속도.
 *     예전 걸음(지수로 따라가기: 차 × 9/s)은 큰 차에선 처음이 16 g로 빨랐고 끝(목표 근처)이 늘어졌다(95%까지 0.33 s)
 *   나는 사람(rules/flight): 옆 가속의 바닥 = a (느려도 꺾는다, 옆 튀기와 같은 크기), 오르내림 가속 = max(12 m/s², a) (높이 튕기기)
 * 두뇌 (생각 겹의 발놀림, 선명도 5 이상, 판단 수준의 tac):
 *   끊어 걷기(chop, 상급부터): 모으는 동안은 제 속도로 걷고, 풀리기 전 0.12 s만 멈춘다(보통은 모으는 내내 × 0.5)
 *   옆 뒤집기(footwork 1, 상급부터): 옆걸음의 방향을 0.35~0.75 s마다 뒤집는다(버릇 없이)
 *   거리 톱질(footwork 2, 대가부터): 떠보기에서 선호 거리 + 4 m(사거리 끝) 둘레 −4~+2 m에 있으면 모을 땐 들어가고 아니면 나간다
 *   높이 튕기기(footwork 3, 전설): 날 때 목표 높이를 3.5 m와 8 m 사이로 0.45~0.7 s마다 튕긴다
 *   게걸음 비행(footwork 2, 대가부터): 붙어 싸울 때(떠보기·들어가기, 선호 거리 + 10 m 안) 나는 목표 속도를 6 m/s로: 코너 속도(25 m/s)로는 5 g로도 방향을 못 뒤집는다 */
const { hyp, log } = require('../math');
const P = require('../../data/rules/snap.json');
const G = 9.8, LN2 = log(2), AC = new Map();
// 가속 한계 (m/s²): 선명도마다 한 번 잰다(결정론 log가 비싸다)
function aOf(W, m) {
  const key = W.rules.evade ? m.C : -1; let a = AC.get(key);
  if (a === undefined) { const ev = key < 0 ? 1 : 1 + 0.25 * log(Math.max(m.C, 1)) / LN2; a = G * Math.min(P.maxG, P.baseG * ev); AC.set(key, a); }
  return a;
}
module.exports = {
  name: 'snap', switch: 'snap', on: W => W.rules.snap, api: { aOf },
  engine: X => {
    return {
      // 걸음: 가속 한계 안에서 목표 속도로 곧장
      // 속도 차를 지금 가는 쪽(앞뒤)과 옆으로 나눠: 옆·가속은 a, 거꾸로 밟아 서기(앞뒤로 줄이기)는 brake × a. 가는 게 없으면 a
      walk(W, m, tx, ty, acc) {
        const a = aOf(W, m) * (acc < 9 ? acc / 9 : 1) * W.dt, dx = tx - m.vx, dy = ty - m.vy, v = hyp(m.vx, m.vy);
        let lx = 0, ly = 0, px = dx, py = dy;
        if (v > 0.1) { const ux = m.vx / v, uy = m.vy / v, dl = dx * ux + dy * uy, cap = dl < 0 ? a * P.brake : a, k = dl > cap ? cap : dl < -cap ? -cap : dl; lx = ux * k; ly = uy * k; px = dx - ux * dl; py = dy - uy * dl; }
        const pl = hyp(px, py); if (pl > a) { px *= a / pl; py *= a / pl; }
        m.vx += lx + px; m.vy += ly + py;
        return true;
      },
      // 끊어 걷기: 모으는 동안 제 속도, 풀리기 직전만 멈춘다
      castMove(W, m, k) { const c = m.cast; if (!m.tac.chop || m.C < 5 || !c || c.s.lock) return k; return c.T - c.t > P.chop ? 1 : 0; },
    };
  },
  brain: B => ({
    steer(W, m, K) {
      const lv = m.C >= 5 ? m.tac.footwork || 0 : 0; if (!lv || K.dodge || K.stance === 'breakout' || K.stance === 'kite') return;
      const R = m.rx, ux = K.ux, uy = K.uy;
      // 옆 뒤집기: 옆걸음을 버릇 없이 짧게 뒤집는다 (옆걸음 몫 0.8을 거꾸로 두 배)
      if (W.t - R.sfT > P.flip[0]) { R.sfT = W.t + W.rng() * (P.flip[1] - P.flip[0]); m.sf = -m.sf; R.flips++; }
      K.vx += -uy * m.sf * P.flipK; K.vy += ux * m.sf * P.flipK;
      // 거리 톱질: 사거리 끝 둘레에서 모을 땐 들어가고, 아니면 나간다
      if (lv >= 2 && m.phase === 'probe' && !K.closeIn) {   // 교전 유지(v2.13)가 다가가는 중엔 쉰다: 짓지 않으면 나가는 톱질이 둘을 사거리 끝에 붙들었다
        const edge = Math.min(K.Dm.maxR, K.prefR + P.saw[0]);
        if (K.d > edge + P.saw[1] && K.d < edge + P.saw[2]) { const inn = !!m.cast, s = inn ? 1 : -1; K.vx += ux * s * P.sawK; K.vy += uy * s * P.sawK; if (R.ly !== s) { R.ly = s; R.saw++; } }
      }
      // 게걸음 비행: 붙어 싸울 땐 느리게 날아 옆 뒤집기가 먹게
      if (lv >= 2 && m.fly === 1 && !m.retreat && (m.phase === 'probe' || m.phase === 'in') && K.d < K.prefR + P.strafeD && m.fv > P.strafeV) m.fv = P.strafeV;
      // 높이 튕기기: 날 때 목표 높이를 낮게·높게
      if (lv >= 3 && m.fly === 1 && !m.retreat && m.phase !== 'out') {
        if (W.t > R.bT) { R.bT = W.t + P.bounce[0] + W.rng() * (P.bounce[1] - P.bounce[0]); R.bUp = !R.bUp; R.bounce++; }
        m.fz = R.bUp ? P.bounceZ[1] : P.bounceZ[0];
      }
    },
  }),
};
}, {"../math":"src/math.js","../../data/rules/snap.json":"data/rules/snap.json"}];
D["src/rules/squad.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 전투단과 다수 대응 (rules.squad, v2.26, SPEC 49장, 수는 data/rules/squad.json) — 기본 꺼짐
 * 지휘 겹 (tac.squad가 있는 사람의 편, 과녁의 선명도가 편의 가운데 선명도의 ratio배 이상, 셋 넘게 살아 있을 때): 개인의 두뇌 위에 편마다 칠판 하나
 *   칠판 (every s마다, 엔진 훅 world): 과녁(가장 선명한 적)의 본 자리·속도(눈: 시야가 이어진 누군가가 sight m 안에서 본다), 과녁의 응수(굳음·묶임·눈멂·두 칸이 다 참·떨어짐),
 *     우리 편 살아 있는 수·잃은 몫, 조와 역할, 일제 사격의 창
 *   역할: 눈(가장 먼 사거리) · 미끼(편에 하나, 조가 둘 이상일 때) · 묶기(굳히고 묶는 수가 가장 많은) · 타격 · 방패(조가 넷 넘으면, 막는 수가 있는 사람) · 예비(조가 다 차고 남은 사람)
 *     판 시작과 우리 편을 잃을 때마다 다시 정한다. 조는 과녁 둘레의 각 차례로 teamN명씩, 조장은 체력이 가장 많은 사람
 *   자리: 조마다 과녁 둘레의 각(조가 둘·셋이면 sep 사이, 넷부터 고르게), 반지름은 과녁 장악 반경 + out(사거리가 모자라면 사거리 × 0.9), 조원은 옆으로 spread m씩.
 *     눈은 + 8 m, 예비는 + 15 m, 방패는 − 2 m
 *   번갈아: turn s마다 쏘는 조가 바뀌고, 나머지 조는 rot만큼 돌아 자리를 옮긴다(쏘지 않는 조의 공격 × w.off)
 *   망치와 모루: 과녁의 시전이 노린 조는 threatT s 물러서고 방패가 막는다(막는 수 × w.shield). 나머지 조가 친다
 *   동시 체크: 과녁의 응수가 바닥나면(굳음·묶임·눈멂·떨어짐·두 칸이 다 참) 일제 사격을 부른다: lead s 뒤 sync s 안에 닿을 공격 × w.volley.
 *     과녁이 굳거나 묶이면 타격의 큰 수 × w.strike(메이트), 묶기는 늘 묶는 수 × w.bind
 *   물러섬: 모인 뒤 잃은 몫이 fallback이면 흩어졌다(regroup s, 과녁에서 멀어지고 공격 × w.scatter) 다시 모인다(역할을 다시 정한다)
 * 물러서기 (v2.28, solo.retreat): 살아 있는 적이 retreat.foes 넘고 지는 판(체력 retreat.hp 아래, 또는 체력 hpDry 아래에 둘레가 dry 아래로 말랐거나 머리가 fat을 넘음, 또는 숨을 breaths번 다 쓰고 당이 glu 아래)이면
 *   도망치는 사람처럼 싸움터 끝으로 떠난다(m.flee, rules/morale이 끝에서 뺀다: alog.fled). 판의 '물러남'
 * 합창(rules.chorus)이 켜지면 조는 맞추기 전엔 과녁의 장악 반경 + chorus.out 밖에서 모이고, 맞추면 제 자리로 나온다
 * 개인의 다수 모드 (선명도 solo.cMin 이상, 살아 있는 적 solo.foes 넘게. 전투단이 아니어도): 두뇌 훅 aim·steer·value
 *   위협 지도: R 안 적의 각으로 포위각(360° − 가장 넓은 틈)을 재고, enc를 넘으면 가장 넓은 틈 쪽으로 빠져 적을 앞쪽 부채꼴에 모은다
 *   과녁: 가까운 적부터이되, 둘레 iso m 안에 동료가 없는 적(isoB m)·묶는 수를 가진 적(bindB m)을 먼저 지운다(거리에서 뺀다)
 *   총: gunR 안의 장전된 총이 gunN 넘게 나를 겨누면 공격 × gunHold(움직인다), 대부분 장전 중이면 × gunGo(일제 사격 직후의 틈)
 * 지표 (api.stats): 포위각, 동시 공격 몫(과녁에 닿는 공격 가운데 0.3 s 안에 다른 조의 공격이 같이 풀린 몫), 고립 처치 몫, 둘러싸인 시간(포위각 270° 넘게), 역할마다 시전·피해.
 *   사람·시전에 칸을 더하지 않는다: 상태는 세계마다 WeakMap */
const P = require('../../data/rules/squad.json'), SO = P.solo, CH = require('./chorus').api, DR = require('./drain').api;
const OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const isBind = s => !!(OFF[s.t] && (s.t === 'thread' || s.stun || s.root || (s.hit && (s.hit.stun || s.hit.root)) || s.t === 'cage'));
const isShield = s => !!((s.t === 'buff' && s.b && s.b.front) || s.t === 'wall' || s.t === 'build');
const ROLES = ['eye', 'bait', 'bind', 'strike', 'shield', 'reserve'];
const STATE = new WeakMap();
function newBoard() { return { on: false, t: -9, tgt: null, sx: 0, sy: 0, svx: 0, svy: 0, seenT: -9, base: 0, n0: 0, alive: 0, k: 0, scatter: -9, g0: 0, ax: NaN, ay: NaN, cx: NaN, cy: NaN, anc: [], ts: [], vAt: -9, vEnd: -9, threat: -1, thrT: -9, role: new Map(), team: new Map(), pt: new Map(), ang: [], log: { volleys: 0, regroups: 0, enc: 0, encN: 0 } }; }
function newStats() { return { retreat: -1, retreatHp: -1, rests: 0, crowd: { n: 0, cast: 0, move: 0, dom: 0 }, rel: [], hitN: 0, simN: 0, enc: 0, encN: 0, surT: 0, kills: 0, isoK: 0, role: {} }; }
function stOf(W) { let s = STATE.get(W); if (!s) STATE.set(W, s = { b: [newBoard(), newBoard()], solo: new Map(), stats: newStats(), last: -9 }); return s; }
// 둘레의 포위각: R 안의 점들(과녁에서 본 각)의 가장 넓은 틈을 360°에서 뺀다. [포위각, 틈 가운데의 각]
function encircle(X, cx, cy, pts) {
  const a = []; for (const q of pts) a.push(X.atan2(q.y - cy, q.x - cx)); if (a.length < 2) return [0, a.length ? a[0] + 3.1416 : 0];
  a.sort((x, y) => x - y); let gap = a[0] + 6.2832 - a[a.length - 1], mid = a[a.length - 1] + gap / 2;
  for (let i = 1; i < a.length; i++) { const g = a[i] - a[i - 1]; if (g > gap) { gap = g; mid = a[i - 1] + g / 2; } }
  return [6.2832 - gap, mid];
}
// 이 편이 상대하는 가장 선명한 적 (살아 있고 도망치지 않는)
function bigOf(W, side) { let t = null; for (const q of W.foes[side]) if (q.hp > 0 && !q.flee && (!t || q.C > t.C)) t = q; return t; }
function sideOn(W, side) { for (const m of W.ms) if (m.side === side && m.hp > 0 && m.tac.squad) return true; return false; }
function bestRange(X, W, m, pick) { let R = 0; for (const n of m.book) { const s = W.spells[n]; if (s && OFF[s.t] && !s.mundane && (!pick || pick(s))) { const r = X.rangeOf(m, s); if (r > R) R = r; } } return R; }
// 공격 사거리의 가운데 값: 조원이 설 반지름 (가장 긴 하나에 맞추면 나머지 수가 닿지 않는다)
const RS = []; function midRange(X, W, m) { RS.length = 0; for (const n of m.book) { const s = W.spells[n]; if (s && OFF[s.t] && !s.mundane && s.t !== 'cone' && s.t !== 'touch') RS.push(X.rangeOf(m, s)); } if (!RS.length) return 10; RS.sort((a, c) => a - c); return RS[RS.length >> 1]; }
// 역할과 조를 다시 정한다
function assign(X, W, b, mem) {
  const t = b.tgt; b.role.clear(); b.team.clear();
  mem.sort((p, q) => X.atan2(p.y - t.y, p.x - t.x) - X.atan2(q.y - t.y, q.x - t.x));
  const n = mem.length, k = Math.max(1, Math.round(n / P.teamN)), full = k * 5; b.k = k; b.n0 = n; b.alive = n;
  for (let i = 0; i < n; i++) b.team.set(mem[i], Math.min(k - 1, Math.floor(i * k / n)));
  for (let j = 0; j < k; j++) {
    const tm = mem.filter(q => b.team.get(q) === j);
    let eye = null, eR = -1, bnd = null, bN = -1, sh = null;
    for (const q of tm) { const r = bestRange(X, W, q); if (r > eR) { eR = r; eye = q; } let c = 0, s0 = false; for (const nm of q.book) { const s = W.spells[nm]; if (!s) continue; if (isBind(s)) c++; if (isShield(s)) s0 = true; } if (q !== eye && c > bN) { bN = c; bnd = q; } if (s0 && q !== eye && !sh) sh = q; }
    for (const q of tm) b.role.set(q, q === eye ? 'eye' : q === bnd ? 'bind' : 'strike');
    if (tm.length >= 4 && sh && sh !== bnd) b.role.set(sh, 'shield');
    if (j === 0 && k >= 2) { const q = tm.find(x => b.role.get(x) === 'strike'); if (q) b.role.set(q, 'bait'); }
  }
  if (n > full) for (let i = full; i < n; i++) b.role.set(mem[i], 'reserve');
  let x = 0, y = 0; for (const q of mem) { x += q.x; y += q.y; } b.base = X.atan2(y / n - t.y, x / n - t.x);
  const D = k === 1 ? 0 : k <= 3 ? P.sep : 6.2832 / k; b.ang.length = 0; for (let j = 0; j < k; j++) b.ang.push(b.base + (j - (k - 1) / 2) * D);
}
function board(X, W, side) {
  const S = stOf(W), b = S.b[side], foes = W.foes[side];
  let tgt = null; for (const q of foes) if (q.hp > 0 && !q.flee && (!tgt || q.C > tgt.C)) tgt = q;
  const mem = []; for (const m of W.ms) if (m.side === side && m.hp > 0 && !m.flee) mem.push(m);
  const cs = mem.map(m => m.C).sort((a, c) => a - c), med = cs.length ? cs[cs.length >> 1] : 0;
  b.on = !!tgt && mem.length > 3 && tgt.C >= P.ratio * med; if (!b.on) return;
  if (b.tgt !== tgt || mem.length < b.alive || !b.k) { if (!b.k) b.g0 = mem.length; b.tgt = tgt; assign(X, W, b, mem); }
  b.alive = mem.length;
  for (const m of mem) if (X.hyp(m.x - tgt.x, m.y - tgt.y) < P.sight && !X.blocked(W, m.x, m.y, tgt.x, tgt.y, tgt.z > m.z ? tgt.z : m.z)) { b.sx = tgt.x; b.sy = tgt.y; b.svx = tgt.vx; b.svy = tgt.vy; b.seenT = W.t; break; }   // 눈: 시야가 이어진 누군가가 본다
  if (b.scatter < W.t && (b.g0 - b.alive) / b.g0 >= P.fallback) { b.scatter = W.t + P.regroup; b.k = 0; b.g0 = b.alive; b.log.regroups++; }   // 물러섬: 흩어졌다가 다시 모인다(역할을 다시)
  // 과녁의 시전이 노린 조 (망치와 모루)
  for (let j = 0; j < 2; j++) { const c = j ? tgt.castB : tgt.cast; if (c && c.tgt && c.tgt.side === side && b.team.has(c.tgt)) { b.threat = b.team.get(c.tgt); b.thrT = W.t + P.threatT; } }
  // 응수가 바닥났다: 일제 사격
  const down = tgt.st.stun > 0 || tgt.st.root > 0 || tgt.st.blind > 0 || tgt.fly === 2 || (tgt.cast && tgt.castB && !tgt.cast.auto && !tgt.castB.auto);
  if (down && W.t > b.vEnd) { b.vAt = W.t + P.lead; b.vEnd = b.vAt + P.sync; b.log.volleys++; }
  // 닻 자리 (v2.29): 과녁 둘레의 각이 아니라 땅에 둔다. 과녁의 몇 초 평균 자리(ax, ay)가 anchor.move m 넘게 옮겨야 닻을 다시 놓는다
  if (!b.k) return;
  const AN = P.anchor, D = W.rules.domainR * tgt.C, k0 = P.every / AN.tau;
  if (b.ax !== b.ax) { b.ax = b.sx; b.ay = b.sy; } else { b.ax += (b.sx - b.ax) * k0; b.ay += (b.sy - b.ay) * k0; }
  if (b.cx !== b.cx || X.hyp(b.ax - b.cx, b.ay - b.cy) > AN.move || b.anc.length !== b.k) {
    b.cx = b.ax; b.cy = b.ay; b.anc.length = 0; b.ts.length = 0;
    for (let j = 0; j < b.k; j++) { const a = b.ang[j], r = D + P.out + AN.out; let x = b.cx + X.cos(a) * r, y = b.cy + X.sin(a) * r, bd = AN.cover;
      for (const o of W.obs) { const d = X.hyp(o.x - x, o.y - y); if (d < bd) { bd = d; const ox = o.x - b.cx, oy = o.y - b.cy, l = X.hyp(ox, oy) || 1; x = o.x + ox / l * (o.r + 1.2); y = o.y + oy / l * (o.r + 1.2); } }   // 엄폐: 둘레의 바위 뒤
      x = x < 2 ? 2 : x > W.width - 2 ? W.width - 2 : x; y = y < 2 ? 2 : y > W.height - 2 ? W.height - 2 : y;
      b.anc.push([x, y]); b.ts.push({ st: 0, t: W.t }); }   // st 0 모으기·맞추기, 1 들어가 치기, 2 나오기
  }
  const tm = []; for (let j = 0; j < b.k; j++) tm.push([]);
  for (const m of mem) { const j = b.team.get(m); if (j !== undefined && b.role.get(m) !== 'reserve') tm[j].push(m); }
  for (let j = 0; j < b.k; j++) {
    const T = b.ts[j], A = b.anc[j], sing = W.rules.chorus && teamSings(W, b, j);
    if (T.st === 0 && sing) { T.st = 1; T.t = W.t; } else if (T.st === 1 && (!sing && W.rules.chorus || W.t - T.t > AN.strikeT || (b.threat === j && W.t < b.thrT))) { T.st = 2; T.t = W.t; } else if (T.st === 2 && W.t - T.t > AN.backT) { T.st = 0; T.t = W.t; }
    let cx = A[0], cy = A[1];
    if (T.st === 1 || (!W.rules.chorus && tm[j].length)) {   // 들어가 치기: 합창한 조가 한 덩어리로, 합창이 없으면 장악 반경 밖 사거리 끝까지만
      let R = 0; for (const q of tm[j]) R += midRange(X, W, q); R = tm[j].length ? R / tm[j].length * AN.inK : 10; if (!(T.st === 1)) R = Math.max(R, D + P.out);
      const dx = A[0] - b.ax, dy = A[1] - b.ay, l = X.hyp(dx, dy) || 1; if (l > R) { cx = b.ax + dx / l * R; cy = b.ay + dy / l * R; }
    }
    const n = tm[j].length; for (let i = 0; i < n; i++) { const q = tm[j][i], a = i * 6.2832 / (n || 1), rr = n > 1 ? AN.gather : 0; let p = b.pt.get(q); if (!p) b.pt.set(q, p = [0, 0]); p[0] = cx + X.cos(a) * rr; p[1] = cy + X.sin(a) * rr; }
  }
  for (const m of mem) if (b.role.get(m) === 'reserve') { const A = b.anc[b.team.get(m) || 0]; let p = b.pt.get(m); if (!p) b.pt.set(m, p = [0, 0]); const dx = A[0] - b.ax, dy = A[1] - b.ay, l = X.hyp(dx, dy) || 1; p[0] = A[0] + dx / l * 15; p[1] = A[1] + dy / l * 15; }
  const [enc] = encircle(X, b.ax, b.ay, mem); b.log.enc += enc; b.log.encN++;   // 포위는 과녁의 평균 자리 기준 (v2.29)
}
// 이 조가 합창을 맞췄나 (v2.28: 맞추기 전엔 과녁의 장악 반경 밖에서 모이고, 맞추면 나온다)
// 조의 차례 (v2.30.1, 점검이 읽는다): 0 닻에서 모으기·맞추기, 1 들어가 치기, 2 나오기, 전투단이 아니면 -1
function phaseOf(W, m) { const S = STATE.get(W); if (!S) return -1; const b = S.b[m.side]; if (!b || !b.on) return -1; const j = b.team.get(m); return j === undefined || !b.ts[j] ? -1 : b.ts[j].st; }
function teamSings(W, b, j) { for (const [q, t] of b.team) if (t === j && q.hp > 0 && CH.of(W, q)) return true; return false; }
function soloOn(W, m) { if (m.C < SO.cMin) return false; let n = 0; const f = W.foes[m.side]; for (let i = 0; i < f.length; i++) if (f[i].hp > 0 && !f[i].flee && ++n > SO.foes) return true; return false; }
// 지는 판인가: 체력·당·머리·둘레의 마름으로 (v2.28)
// 받는 위협: 지난 rest.threatT s의 피해를 체력 몫으로 (지수로 잊는다, 세계 훅이 0.25 s마다)
function soloOf(S, m) { let o = S.solo.get(m); if (!o) S.solo.set(m, o = { hp: m.hp, thr: 0, rest: 0 }); return o; }
function tired(W, m) { const R = SO.rest; return m.glu < R.glu * m.gluMax || m.fat > R.fat; }
function losing(W, m) { const R = SO.retreat; if (!R || W.closed) return false;   // 갇힌 판(장면의 closed, v2.33)엔 물러설 곳이 없다
  let n = 0; for (const q of W.foes[m.side]) if (q.hp > 0 && !q.flee) n++; if (n < R.foes) return false;
  const dry = W.rules.drain ? DR.around(W, m.x, m.y) : 1, hp = m.hp / m.hpMax;
  const S = STATE.get(W), thr = S ? soloOf(S, m).thr : 0;
  return hp < R.hp || (hp < R.hpDry && dry < R.dry) || (tired(W, m) && thr > SO.rest.threat); }   // v2.29: 지쳤어도 위협이 약하면 숨 돌리기(물러남이 아니다)
function loadedGuns(W, m) { let r = 0, a = 0; const f = W.foes[m.side]; for (const q of f) if (q.hp > 0 && !q.flee && q.book.includes('머스킷')) { const d = Math.sqrt((q.x - m.x) * (q.x - m.x) + (q.y - m.y) * (q.y - m.y)); if (d > SO.gunR) continue; a++; if (!((q.cd['머스킷'] || 0) > 1)) r++; } return [r, a]; }
module.exports = {
  name: 'squad', switch: 'squad', api: { P, stats: W => stOf(W), encircle, isBind, isShield, ROLES, phaseOf },
  engine: X => ({
    world(W) {
      const S = stOf(W), ev = Math.round(P.every / W.dt); if (W.step % ev) return;
      for (let side = 0; side < 2; side++) if (sideOn(W, side)) board(X, W, side);
      for (const m of W.ms) if (m.hp > 0 && m.C >= SO.cMin) { const o = soloOf(S, m); o.thr = o.thr * SO.rest.decay + (o.hp > m.hp ? o.hp - m.hp : 0) / m.hpMax; o.hp = m.hp; }
      // 무리 한 사람의 시간 (지표): 짓는 중·움직임·과녁 장악 반경 안
      for (let side = 0; side < 2; side++) { const big = bigOf(W, side); if (!big) continue; const D = W.rules.domainR * big.C, c = S.stats.crowd;
        for (const m of W.ms) if (m.side === side && m.hp > 0 && !m.flee && big.C >= P.ratio * m.C) { c.n++; if (m.cast || m.castB || m.chan) c.cast++; if (m.vx * m.vx + m.vy * m.vy > 2.25) c.move++; if (X.hyp(m.x - big.x, m.y - big.y) < D) c.dom++; } }
      for (const m of W.ms) if (m.hp > 0 && soloOn(W, m)) {   // 개인의 포위각 (지표)
        const near = []; for (const q of W.foes[m.side]) if (q.hp > 0 && !q.flee && X.hyp(q.x - m.x, q.y - m.y) < SO.R) near.push(q);
        const [enc] = encircle(X, m.x, m.y, near); S.stats.enc += enc; S.stats.encN++; if (enc > 4.712) S.stats.surT += P.every;
      }
    },
    release(W, m, c) {   // 동시 공격·역할의 시전
      const S = STATE.get(W); if (!S) return; const b = S.b[m.side]; if (!b.on || !OFF[c.s.t] || c.tgt !== b.tgt) return;
      const j = b.team.get(m), r = b.role.get(m); if (j === undefined) return; const st = S.stats, rl = st.role[r] || (st.role[r] = { casts: 0, dmg: 0 }); rl.casts++;
      const at = W.t + (c.s.t === 'lob' ? 1 : 0); let sim = false; for (const e of st.rel) if (e[2] === m.side && e[1] !== j && Math.abs(e[0] - at) < P.sync) { sim = true; break; }
      st.hitN++; if (sim) st.simN++; st.rel.push([at, j, m.side]); if (st.rel.length > 64) st.rel.shift();
    },
    hurt(W, m, v, src) {
      const S = STATE.get(W); if (!S || !src) return; const b = S.b[src.side];
      if (b.on && m === b.tgt) { const r = b.role.get(src); if (r) { const rl = S.stats.role[r] || (S.stats.role[r] = { casts: 0, dmg: 0 }); rl.dmg += v; } }
      if (m.hp <= 0 && src.C >= SO.cMin && m.side !== src.side) { S.stats.kills++; let iso = true; for (const q of W.ms) if (q !== m && q.side === m.side && q.hp > 0 && Math.sqrt((q.x - m.x) * (q.x - m.x) + (q.y - m.y) * (q.y - m.y)) < SO.iso) { iso = false; break; } if (iso) S.stats.isoK++; }
    },
  }),
  brain: B => ({
    aim(W, m, K) {
      const S = STATE.get(W); if (!S) return;
      const b = S.b[m.side]; if (m.tac.squad && b.on && b.tgt && b.tgt.hp > 0) { K.e = b.tgt; return; }
      if (!soloOn(W, m)) return;
      if (!m.flee && losing(W, m)) { m.flee = 1; m.alog.fledT = W.t; S.stats.retreat = W.t; S.stats.retreatHp = m.hp / m.hpMax; return; }   // 물러서기 (v2.28): 무리에게 지는 판이면 날아서 떠난다
      const o = soloOf(S, m); if (!o.rest && tired(W, m)) { o.rest = 1; S.stats.rests++; } else if (o.rest && m.glu > SO.rest.back * m.gluMax && m.fat < SO.rest.backFat) o.rest = 0;   // 숨 돌리기 (v2.29)
      let e = null, bs = 1e9; for (const q of K.foes) { if (q.hp <= 0 || q.flee) continue; let sc = B.hyp(q.x - m.x, q.y - m.y), al = false;
        for (const o of W.ms) if (o !== q && o.side === q.side && o.hp > 0 && B.hyp(o.x - q.x, o.y - q.y) < SO.iso) { al = true; break; }
        if (!al) sc -= SO.isoB; if (W.rules.chorus && CH.of(W, q)) sc -= CH.P.aimB;   // 합창하는 무리를 먼저 (v2.27)
        for (const n of q.book) { const s = W.spells[n]; if (s && isBind(s) && s.t !== 'thread') { sc -= SO.bindB; break; } }
        if (sc < bs) { bs = sc; e = q; } }
      if (e) K.e = e;
    },
    steer(W, m, K) {
      if (K.dodge) return; const S = STATE.get(W); if (!S) return;
      const b = S.b[m.side];
      if (m.tac.squad && b.on) {
        const t = b.tgt; if (W.t < b.scatter) { const dx = m.x - t.x, dy = m.y - t.y, l = B.hyp(dx, dy) || 1; K.vx = dx / l * 2 - dy / l * m.sf; K.vy = dy / l * 2 + dx / l * m.sf; return; }
        const p = b.pt.get(m); if (!p) return; const dx = p[0] - m.x, dy = p[1] - m.y, l = B.hyp(dx, dy); if (l < 1) { K.vx = -K.uy * m.sf * 0.3; K.vy = K.ux * m.sf * 0.3; return; }
        const k = l > 3 ? 2 : l / 1.5; K.vx = dx / l * k; K.vy = dy / l * k;
        { const j = b.team.get(m), D = W.rules.domainR * t.C + P.disc, ex = m.x - t.x, ey = m.y - t.y, el = B.hyp(ex, ey) || 1; if (!(b.ts[j] && b.ts[j].st === 1) && el < D) { if (el < P.close) { K.vx = ex / el * 2; K.vy = ey / el * 2; } else { K.vx = 0; K.vy = 0; } return; } }   // 장악권 규율: 합창 없이 과녁의 장악 반경 안으로 들어가지 않는다
        if (l > 3 && m.vx * m.vx + m.vy * m.vy < 0.5) { const sf = m.sf; K.vx = (dx - dy * sf * 1.5) / l * 2; K.vy = (dy + dx * sf * 1.5) / l * 2; }   // 막혔다(벽·바위): 옆으로 돌아간다
        return;
      }
      if (!m.flee && !m.tac.squad && W.rules.domainR > 0 && K.e && K.e.C >= P.ratio * m.C && K.e.C >= SO.cMin) {   // 장악권 규율 (v2.29): 흩어진 무리도 제자리에서 버티고, 과녁이 장악 반경 안으로 다가오면 물러난다
        const e = K.e, dx = m.x - e.x, dy = m.y - e.y, l = B.hyp(dx, dy) || 1; if (l < P.close) { K.vx = dx / l * 2; K.vy = dy / l * 2; } else { K.vx = 0; K.vy = 0; } return; }   // 다가가지 않고(장악 반경 밖이면 그대로 기다린다) 서서 친다, 너무 가까우면(close m) 물러난다
      if (!soloOn(W, m)) return;
      const so = soloOf(S, m); if (so.rest) {   // 숨 돌리기: 적 사거리 밖으로 (적의 무게중심에서 rest.far m)
        let x = 0, y = 0, n = 0; for (const q of K.foes) if (q.hp > 0 && !q.flee) { x += q.x; y += q.y; n++; } if (n) { x /= n; y /= n; const dx = m.x - x, dy = m.y - y, l = B.hyp(dx, dy) || 1; if (l < SO.rest.far) { K.vx = dx / l * 3; K.vy = dy / l * 3; } else { K.vx *= 0.3; K.vy *= 0.3; } } return; }
      if (K.d > SO.hunt) { K.vx += K.ux * 1.5; K.vy += K.uy * 1.5; }   // 사냥 (v2.29): 서서 기다리는 무리에게 다가간다
      const near = []; for (const q of K.foes) if (q.hp > 0 && !q.flee && B.hyp(q.x - m.x, q.y - m.y) < SO.R) near.push(q);
      const [enc, mid] = encircle(B.C, m.x, m.y, near); if (enc < SO.enc) return;
      K.vx += B.C.cos(mid) * SO.move; K.vy += B.C.sin(mid) * SO.move;   // 가장 넓은 틈으로: 적을 앞쪽 부채꼴에
    },
    // 값의 맨 끝(valueLate): 다른 기술이 값을 다시 세우지 않게 (벽 세우기·발판·덫은 앞의 기술이 값을 정한다)
    valueLate(W, m, K, o) {
      if (!(o.v > 0)) return; const S = STATE.get(W); if (!S) return; const s = o.s, b = S.b[m.side];
      if (m.tac.squad && b.on && !m.flee) {
        if (W.t < b.scatter) { if (OFF[s.t]) o.v *= P.w.scatter; else if (s.t === 'trap' || s.t === 'wall' || s.t === 'build') o.v = 0; return; }
        const role = b.role.get(m), j = b.team.get(m), t = b.tgt;
        if (isShield(s)) { if (b.threat === j && W.t < b.thrT && (role === 'shield' || role === 'bait')) o.v *= P.w.shield; else if (s.t !== 'buff') o.v = 0; return; }   // 벽은 노려진 조의 방패만 (제 벽에 갇히지 않게)
        if (!OFF[s.t]) { if (s.t === 'trap' || s.t === 'move') o.v = 0; return; }   // 나는 과녁에 덫은 헛수, 발판은 자리를 흩뜨린다
        const land = W.t + B.castTime(W, m, o.Tw);
        if (role === 'bind' && isBind(s)) o.v *= P.w.bind;
        if ((t.st.stun > 0 || t.st.root > 0) && (role === 'strike' || role === 'bait') && B.estDmg(s) >= 0.6 * B.deck(m, W.spells).offMax) o.v *= P.w.strike;   // 메이트
        if (land >= b.vAt && land <= b.vEnd) o.v *= P.w.volley; else if (W.rules.chorus && b.ts[j] && b.ts[j].st === 0 && role !== 'bind') o.v *= P.w.off;   // 모으는 조는 덜 친다 (v2.29: 번갈아 대신 들고 나기)
        return;
      }
      if (!soloOn(W, m) || !OFF[s.t]) return;
      if (soloOf(S, m).rest) { o.v *= SO.rest.off; return; }
      const [r, a] = loadedGuns(W, m); if (!a) return;
      if (r >= SO.gunN && m.z < 2) o.v *= SO.gunHold; else if (a >= SO.gunN && r <= a * 0.25) o.v *= SO.gunGo;   // 일제 사격 직후의 장전 틈
    },
  }),
};
}, {"../../data/rules/squad.json":"data/rules/squad.json","./chorus":"src/rules/chorus.js","./drain":"src/rules/drain.js"}];
D["src/rules/steady.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 중간의 읽기 (rules.steady, v2.27, SPEC 51장, 수는 data/rules/steady.json) — 기본 꺼짐, 묶음 '지금'이 켠다
 * 중간끼리는 서로의 예비동작을 일찍 읽어 자동 진(앞 방패)과 옆걸음으로 거의 다 막고 비켜, 공격의 명중이 10%였다(판은 머리 넘침이 끝냈다, reports/v2.26.0·v2.27.0).
 * 선명도 cMin 이상 cMax 아래(중간)는 적의 예비동작을 풀기 readT s 전부터만 읽는다(두뇌 훅 hideCast: 그 전엔 숨긴 시전처럼 건너뛴다).
 * 아래(평범)는 그대로(원래 많이 못 읽는다), 위(상위·대마법사)도 그대로 */
const P = require('../../data/rules/steady.json');
module.exports = {
  name: 'steady', switch: 'steady', api: { P },
  brain: () => ({
    hideCast(W, q, c, m) { return !!m && m.C >= P.cMin && m.C < P.cMax && c.T - c.t > P.readT; },
  }),
};
}, {"../../data/rules/steady.json":"data/rules/steady.json"}];
D["src/rules/stunRes.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 굳힘 내성 (rules.stunRes, v2.21, v2.23에 몸 털기를 거둠, SPEC 45장, 수는 data/rules/stunRes.json)
 * 기본 꺼짐, 대마법사 결투 장면이 켠다. 설정: 굳음은 전기가 신경과 고리를 흩뜨린 것이라 털어낼 수 없다. 대신 몸속 균의 반사 —
 *   강한 전기에 놀란 피부의 균이 서클 없이 잠깐 닫힌다.
 *   굳힘 내성: 굳은 동안이나 굳음이 풀리고 win s 안에 다시 굳으면 굳는 시간 × k[단계] (1 → 0.5 → 0.25). 상태 st.stR(단계)·st.stE(지금 굳음이 풀리는 때)
 * 몸 털기(rules/response의 풀기)는 붙잡는 것(균사·경직·석회·족쇄)만 푼다. 굳음은 못 턴다
 * 수읽기(brain/plan)는 이 규칙이 켜지면 굳음을 바로 센다: 굳은 채 닿는 수엔 응수가 없다(이미 켠 잔기술·세운 방패만) */
const P = require('../../data/rules/stunRes.json');
module.exports = {
  name: 'stunRes', switch: 'stunRes', api: { P },
  engine: X => ({
    stunHold(W, m, o, v) {
      if (!(v > 0)) return v; const st = m.st;
      st.stR = W.t <= st.stE + P.win ? Math.min(st.stR + 1, P.k.length - 1) : 0;
      v *= P.k[st.stR]; const e = W.t + Math.max(v, st.stun > 0 ? st.stun : 0); if (e > st.stE) st.stE = e;
      return v;
    },
  }),
};
}, {"../../data/rules/stunRes.json":"data/rules/stunRes.json"}];
D["src/rules/tactics.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 작전 겹과 각도 판단 (rules.tactics, v2.5, SPEC 29장, 무게·수는 data/rules/tactics.json)
 * 두뇌의 세 번째 겹. 반사 겹(매 걸음, rules/reflex) · 생각 겹(판단, 0.05~0.3 s)의 위에서 1~2 s마다 작전을 고르고 둘레 자리를 잰다.
 * 선명도 5 이상, 판단 수준의 tac.ops (1 대가: 2 s마다 / 2 전설: 1 s마다 + 강요하는 수 + 상대 작전 읽기).
 * 작전 (고르는 근거: 체력·피로·다음 칸의 간격·사거리 차이·지형·상대의 상태(빈손·꺼짐·과열·굳음·엄폐)):
 *   진지 fort: 짓고 기다린다(청사진 규칙이 있으면 짓기 단계로) · 소모 attrit: 내 곡사·구름 사거리 안, 상대의 가장 긴 직사 사거리 밖에서 깎는다
 *   압박 press: 장악권이 상대 쪽으로 넘어가는 거리(5장 식, 리듬의 들어갈 거리)로 밀고 들어간다 · 몰이 herd: 벽·함정·구름·지대를 상대의 퇴로 쪽에
 *   사냥 hunt: 각도를 돌아 엄폐 벗기기 · 끝내기 finish: 모든 칸으로 몰아친다(두 번째 칸도 공격)
 *   작전이 정해지면 생각 겹의 선호 거리·공격 성향·마법의 값·걸음이 그 목표를 향한다
 * 각도 판단: 작전 때마다 상대 둘레 자리 24개(각 8 × 반지름 3, 반지름은 작전마다)를 점수로 매겨 가장 좋은 자리로. 점수:
 *   가는 길(−0.02/m), 시야(작전이 시야를 바라면), 한쪽 사거리(상대 직사 밖·내 곡사 안), 엿보기 각(반 걸음 옆에 숨을 바위), 엄폐 벗기기(지금 안 보이는 상대가 보이는 각),
 *   퇴로 자르기(상대와 그 진지·가장 가까운 엄폐 사이), 화약통 선(상대 곁 화약통이 보이는 각), 높이의 각(날 수 있으면 바위 뒤도 좋다: 떠서 넘겨 보고 내려앉아 숨는다),
 *   위험(적 지대·알아챈 함정·적 하늘 덮개(날 때)·싸움터 끝·소금 원 밖)
 *   돌던 쪽으로 한 칸(45°) 나아간 자리에 + 0.5: 원을 그리며 돈다(막히면 돌아선다).
 *   걸음은 그 자리로 곧장이 아니라 상대 둘레로(둘레 방향 1, 반지름 방향 0.4): 거리를 유지하며 원을 그린다.
 *   빠지기(리듬)에는 빠지기 거리까지 바깥 1 + 도는 쪽 1로 나선을 그리며 벌리고, 그 뒤로는 둘레로만 돈다. 싸움터 끝·소금 선 18 m 안이면 소금 원의 걸음 그대로
 * 강요하는 수 (전설): 숨은 상대 자리 위에 보이는 구름, 퇴로에 함정, 진지 입구에 벽 밀기, 나는 상대 위에 번개 구름 → 값 × 무게. 그 뒤 1.5 s는 내 모양(청사진·벽·함정·지대) × 1.5
 *   상대의 작전을 읽고 반대로: 다가오는 속도의 평균·짓는 수로 상대의 작전을 짐작(압박: 평균 2 m/s 넘게 다가옴, 소모: 22 m 넘게·내 직사 밖에서 버팀, 진지: 짓는 중)하고 맞수에 무게
 *   지금 작전이 8 s 넘게 먹히지 않으면(준 피해 ≤ 받은 피해) 그 작전에 −0.6: 오래 붙들지 않는다
 *   판 중 학습: 3 s 넘게 해 본 작전은 그 성적(초당 준 피해 − 받은 피해, 2 /s를 1로)을 −1~1로 잘라 × 1.0
 * 기록 (m.op.log): 작전마다 고른 수·완수·시간, 강요하는 수와 그 뒤 상대가 길을 바꾼 수(대조: 다른 공격), 고른 자리의 성질(한쪽 사거리·엿보기·벗기기·퇴로) */
const { hyp, atan2, sin, cos } = require('../math');
const P = require('../../data/rules/tactics.json');
const OPS = ['fort', 'attrit', 'press', 'herd', 'hunt', 'finish'];
const DIRECT = { proj: 1, thread: 1, touch: 1, cone: 1 }, INDIRECT = { area: 1, lob: 1 }, OFF = { proj: 1, thread: 1, area: 1, touch: 1, cone: 1, lob: 1 };
const TERR = { wall: 1, build: 1, trap: 1, cage: 1, blueprint: 1, topple: 1 };
const lvOf = m => (m.C >= 5 && m.tac.ops) || 0;
module.exports = {
  name: 'tactics', switch: 'tactics', on: W => W.rules.tactics, api: { OPS, P },
  // 엔진: 강요한 수·대조 수의 뒤를 본다 (상대가 과녁 자리에서 2 m 넘게 멀어졌나)
  engine: X => ({
    mageStep(W, m) {
      const p = m.op.pend; if (!p || W.t < p.until) return;
      const moved = hyp(p.e.x - p.tx, p.e.y - p.ty) - p.d0 >= P.forceMove, L = m.op.log;
      if (p.force) { L.forceN++; if (moved) L.forced++; } else { L.ctrlN++; if (moved) L.ctrlMoved++; }
      m.op.pend = null;
    },
  }),
  brain: B => {
    const C = B.C, inDist = B.lib.inDist, RC = new WeakMap(), BPA = () => { const r = C.RULES.find(x => x.name === 'blueprint'); return r && r.api; };
    // 사거리: 직사(투사체·실·몸·앞으로 뿜기)와 곡사·구름의 가장 긴 것 (덱마다 한 번)
    function ranges(m, D) {
      let r = RC.get(D); if (r) return r; r = { dir: 0, ind: 0 };
      for (let i = 0; i < D.sp.length; i++) { const s = D.sp[i], R = s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : D.R[i]; if (DIRECT[s.t] && R > r.dir) r.dir = R;
        if (INDIRECT[s.t] && R > r.ind) r.ind = R; }
      RC.set(D, r); return r;
    }
    const weak = (W, e) => e.st.stun > 0 || e.st.root > 0 || e.crash > 0 || (e.emptyT > W.t) || (e.fat > 92 && !e.wave);
    // 상대의 퇴로: 제 진지(60 m 안), 아니면 가장 가까운 바위(15 m 안), 아니면 싸움터 가운데
    function retreatOf(W, e) {
      if (e.fort && e.fort.x === e.fort.x && hyp(e.fort.x - e.x, e.fort.y - e.y) < 60) return [e.fort.x, e.fort.y];
      let b = null, bd = 15; for (const o of W.obs) { const d = hyp(o.x - e.x, o.y - e.y); if (d < bd) { bd = d; b = o; } }
      return b ? [b.x, b.y] : [W.width / 2, W.height / 2];
    }
    const book = (m, f) => { for (const n of m.book) { const s = m._deck && m._deck.S[n]; if (s && f(s)) return true; } return false; };
    // 작전 고르기 (data의 무게 × 특징)
    function choose(W, m, K, lv) {
      const e = K.e, h = m.hp / m.hpMax, eh = e.hp / e.hpMax, f = m.fat / 100, ef = e.fat / 100, Rm = ranges(m, K.Dm), Re = ranges(e, K.De), wk = weak(W, e) ? 1 : 0;
      const F = { base: 1, lead: h - eh, eLow: eh < 0.3 ? 1 : 0, eHalf: eh < 0.5 ? 1 : 0, eWeak: wk, finishable: eh < 0.5 && wk ? 1 : 0, hurt: 1 - h, behind: eh - h > 0.1 ? 1 : 0, tired: f > 0.8 ? 1 : 0, eTired: ef > f ? 1 : 0,
        rangeAdv: Math.max(0, Math.min(1, (Math.max(Rm.ind, Rm.dir) - Math.max(Re.ind, Re.dir)) / 10)), covered: K.los ? 0 : 1, eGround: e.z < 1 ? 1 : 0, eBack: K.vt < -1 ? 1 : 0, stronger: m.C >= e.C ? 1 : 0,   // rangeAdv: 상대 사거리(무엇이든) 밖에서 칠 수 있는 몫
        terrain: book(m, s => TERR[s.t] || (s.t === 'zone' && s.z && s.z.k !== 'rain' && s.z.k !== 'smoke')) ? 1 : 0, build: BPA() && m.book.includes('청사진') && W.rules.blueprint ? 1 : 0 };
      const O = m.op; let best = null, bs = -1e9;
      for (const k of OPS) {
        const w = P.score[k]; let s = 0; for (const f2 in w) s += w[f2] * (F[f2] || 0);
        const tk = O.log.time[k] || 0; if (tk >= P.learn[0]) { const q = ((O.log.dealt[k] || 0) - (O.log.took[k] || 0)) / tk / P.learn[1]; s += P.learn[2] * (q > 1 ? 1 : q < -1 ? -1 : q); }   // 판 중에 배운 작전의 성적 (초당 준 피해 − 받은 피해)
        if (k === O.cur) { s += P.stick; if (O.st && W.t - O.t0 > P.stall[0] && (O.st.ehp - e.hp) <= (O.st.hp - m.hp)) s -= P.stall[1]; }   // 먹히지 않는 작전은 오래 붙들지 않는다
        if (lv >= 2 && O.eOp && P.counter[O.eOp] && P.counter[O.eOp][k]) s += P.counter[O.eOp][k];   // 상대 작전의 맞수
        if (s > bs) { bs = s; best = k; }
      }
      return best;
    }
    // 작전 하나가 끝났다: 완수했나
    function close(W, m, K) {
      const O = m.op, S = O.st, L = O.log; if (!O.cur || !S) return;
      const e = K.e, dealt = S.ehp - e.hp, took = S.hp - m.hp, dt = W.t - O.t0; let ok = false;
      if (O.cur === 'attrit') ok = dealt > took;
      else if (O.cur === 'press') ok = dealt > took && S.minD <= S.dIn + 3;
      else if (O.cur === 'herd') ok = S.herdHit > 0 || m.fort.funnel > S.funnel;
      else if (O.cur === 'hunt') ok = S.gotLos;
      else if (O.cur === 'finish') ok = e.hp <= 0 || dealt > 0.15 * e.hpMax;
      else if (O.cur === 'fort') ok = (m.fort.bpN > S.bp || m.fort.walls + m.fort.traps > S.built) && took < 0.2 * m.hpMax;
      L.n[O.cur] = (L.n[O.cur] || 0) + 1; if (ok) L.ok[O.cur] = (L.ok[O.cur] || 0) + 1; L.time[O.cur] = (L.time[O.cur] || 0) + dt;
      L.dealt[O.cur] = (L.dealt[O.cur] || 0) + dealt; L.took[O.cur] = (L.took[O.cur] || 0) + took;
    }
    function open(W, m, K, op) {
      const O = m.op, e = K.e; O.cur = op; O.t0 = W.t;
      O.st = { hp: m.hp, ehp: e.hp, minD: K.d, dIn: inDist(W, m, e), herdHit: 0, funnel: m.fort.funnel, gotLos: false, covered0: !K.los, bp: m.fort.bpN, built: m.fort.walls + m.fort.traps };
    }
    // 각도 판단: 상대 둘레 자리 24개
    function angle(W, m, K, op) {
      const e = K.e, O = m.op, Rm = ranges(m, K.Dm), Re = ranges(e, K.De), d = K.d, dIn = O.st ? O.st.dIn : inDist(W, m, e);
      let rs;
      if (op === 'attrit') rs = Rm.ind > Re.dir + 4 ? [Re.dir + 2, (Re.dir + Rm.ind) / 2, Rm.ind - 2] : [K.prefR, K.prefR + 4, K.prefR + 8];
      else if (op === 'press') rs = [dIn, dIn + 3, dIn + 6];
      else if (op === 'finish') rs = [Math.max(3, dIn - 1), dIn + 2, dIn + 5];
      else rs = [Math.max(4, d - 4), d, d + 3];
      const th0 = atan2(m.y - e.y, m.x - e.x), zq = m.z > 2 ? m.z : 0, losNow = K.los, [rx, ry] = retreatOf(W, e), rd = hyp(rx - e.x, ry - e.y) || 1, fly = m.fly === 1 || (m.C >= 5 && W.rules.flight);
      const wantLos = op === 'press' || op === 'hunt' || op === 'finish', G = P.angle;
      let best = -1e9, bx = NaN, by = NaN, bk = 0;
      for (let a = 0; a < 8; a++) for (let j = 0; j < 3; j++) {
        const th = th0 + a * Math.PI / 4, r = rs[j], x = e.x + cos(th) * r, y = e.y + sin(th) * r;
        if (x < 2 || y < 2 || x > W.width - 2 || y > W.height - 2) continue;
        if (W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > C.saltR(W) - 2) continue;
        let s = -G.travel * hyp(x - m.x, y - m.y), kind = 0;
        if (lvOf(m) >= P.circleLv && ((a === 1 && O.dir > 0) || (a === 7 && O.dir < 0))) s += G.orbit;   // 돌던 쪽으로 한 칸(45°): 원을 그리며 돈다
        const los = !C.blocked(W, x, y, e.x, e.y, zq);
        if (los) s += wantLos ? G.los : G.losSoft;
        const dq = hyp(x - e.x, y - e.y);
        if (op !== 'press' && op !== 'finish' && dq > Re.dir + 1 && dq < Rm.ind - 1) { s += G.oneSide * (op === 'attrit' ? 1.5 : 1); kind |= 1; }
        if (op === 'attrit' && dq < Re.dir) s -= G.exposed;
        // 엿보기 각: 반 걸음(1.5 m) 옆 바위 쪽으로 들어가면 숨는다
        if (los) for (const o of W.obs) { const od = hyp(o.x - x, o.y - y); if (od < 3 && od > 0.1) { const sx = x + (o.x - x) / od * 1.5, sy = y + (o.y - y) / od * 1.5;
            if (C.blocked(W, sx, sy, e.x, e.y, 0)) { s += G.peek; kind |= 2; break; } } }
        if (!losNow && los) { s += G.strip * (op === 'hunt' ? 1.5 : 1); kind |= 4; }
        // 퇴로 자르기: 상대에서 퇴로 쪽 30° 안, 퇴로보다 가깝게
        if ((op === 'herd' || op === 'press') && dq < rd && ((x - e.x) * (rx - e.x) + (y - e.y) * (ry - e.y)) / (dq * rd || 1) > 0.866) { s += G.cut; kind |= 8; }
        for (const b of W.barrels) if (!b.ex && hyp(b.x - e.x, b.y - e.y) < 3.5 && !C.blocked(W, x, y, b.x, b.y, 0)) { s += G.barrel; break; }
        if (fly && !los) s += G.height;   // 날 수 있으면 바위 뒤도 좋다
        for (const z of W.zones) if (z.src.side !== m.side && ((z.k === 'sky' && fly) || (z.dps && C.inZone(z, x, y)))) { s -= G.danger; break; }
        for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - x, t.y - y) < 2) { s -= G.danger; break; }
        if (x < 6 || y < 6 || x > W.width - 6 || y > W.height - 6) s -= G.edge;
        if (s > best) { best = s; bx = x; by = y; bk = kind; }
      }
      if (bx === bx) { const cr = (m.x - e.x) * (by - e.y) - (m.y - e.y) * (bx - e.x); if (Math.abs(cr) > 1) O.dir = cr > 0 ? 1 : -1; }   // 도는 쪽을 기억한다
      O.tx = bx; O.ty = by; O.kind = bk;
    }
    // 강요하는 수: 상대가 반드시 대응해야 하는 수
    function forcing(W, m, K, s, tx, ty) {
      const e = K.e;
      if (s.t === 'area' && s.vis && e.z < 1 && !K.los && hyp(tx - e.x, ty - e.y) < 2) return P.force.hidden;          // 숨은 자리 위에 구름
      if (s.t === 'area' && s.kind === 'elec' && e.z >= 1 && hyp(tx - e.x, ty - e.y) < 3) return P.force.sky;            // 나는 상대 위에 번개 구름
      if (s.t === 'topple' && e.fort && e.fort.x === e.fort.x && hyp(tx - e.fort.x, ty - e.fort.y) < 12) return P.force.gate;   // 진지 입구에 벽 밀기
      if (s.t === 'trap' && e.z < 1) { const [rx, ry] = retreatOf(W, e), l = hyp(rx - e.x, ry - e.y) || 1;
        if (hyp(tx - (e.x + (rx - e.x) / l * 3), ty - (e.y + (ry - e.y) / l * 3)) < 2) return P.force.path; }   // 퇴로에 함정
      return 0;
    }
    return {
      // 작전 겹: 1~2 s마다 작전·자리를 고르고, 판단 때마다 작전을 생각 겹에 건다 (리듬의 단계를 고른 뒤)
      phase(W, m, K) {
        const lv = lvOf(m); if (!lv) return;
        const O = m.op, e = K.e;
        O.eVt = O.eVt * 0.8 + K.vt * 0.2;   // 상대의 다가오는 속도 (평균)
        if (O.st) { if (K.d < O.st.minD) O.st.minD = K.d; if (O.st.covered0 && K.los) O.st.gotLos = true; }
        if (W.t >= O.next) {
          O.next = W.t + (lv >= 2 ? P.every[1] : P.every[0]);
          if (lv >= 2) O.eOp = e.cast && (e.cast.s.t === 'build' || e.cast.s.t === 'blueprint') ? 'fort' : O.eVt > P.readVt[0] ? 'press' : (O.eVt < P.readVt[1] || (Math.abs(O.eVt) < P.readVt[0] && K.d > ranges(m, K.Dm).dir)) && K.d > 22 ? 'attrit' : null;   // 멀리서 버티면 소모로 본다
          const op = choose(W, m, K, lv); if (op !== O.cur) { close(W, m, K); open(W, m, K, op); O.log.pick++; }
          angle(W, m, K, op); const L = O.log; if (O.kind & 1) L.oneSide++; if (O.kind & 2) L.peek++; if (O.kind & 4) L.strip++; if (O.kind & 8) L.cut++; L.ticks++;
        }
        if (m.phase === 'out' || m.phase === 'build') return;   // 빠지기·짓기가 먼저
        const op = O.cur, Rm = ranges(m, K.Dm), Re = ranges(e, K.De);
        if (op === 'finish') { K.aggr *= P.aggr.finish; K.pressB = true; K.prefR = Math.min(K.prefR, O.st.dIn + 2); }
        else if (op === 'press') { K.aggr *= P.aggr.press; K.prefR = O.st.dIn; }
        else if (op === 'attrit') { K.prefR = Rm.ind > Re.dir + 4 ? Math.min(Rm.ind - 2, Re.dir + 3) : Math.max(K.prefR, 20); }
        else if (op === 'hunt' || op === 'herd') K.prefR = K.d;
        else if (op === 'fort') { K.prefR = K.d; K.aggr *= P.aggr.fort; const bp = BPA(); if (bp && m.phase === 'probe') bp.startBuild(W, m, K); }
      },
      // 걸음: 고른 자리로, 상대 둘레를 돌아서 (둘레 방향 1, 반지름 방향 0.4)
      steer(W, m, K) {
        const O = m.op; if (!lvOf(m) || !O.cur || K.dodge || m.phase === 'build') return;
        if (B.lib.behind(W, m, K)) return;
        if (K.closeIn) return;   // 교전 유지(v2.13)가 다가가거나 쫓는 중: 둘레 자리로 돌지 않는다   // 세운 벽 뒤에 머문다 (날카롭게, v2.8)
        if (m.phase === 'out') {   // 빠지기: 곧장 물러나지 않고 상대 둘레로 돌며 벌린다 (나선)
          if (m.retreat || !P.spiral || lvOf(m) < P.circleLv) return;   // 무리 앞 물러나기는 그대로. 나선은 전설만
          if (m.x < P.spiralEdge || m.y < P.spiralEdge || m.x > W.width - P.spiralEdge || m.y > W.height - P.spiralEdge || (W.rules.saltRing && hyp(m.x - W.width / 2, m.y - W.height / 2) > C.saltR(W) - P.spiralEdge)) return;   // 끝·소금 선 가까이선 소금 원의 걸음 그대로 (벌리다 선 밖으로 나가지 않게)
          const e = K.e, rx = m.x - e.x, ry = m.y - e.y, rl = hyp(rx, ry) || 1, out = rl < K.prefR ? P.spiral : 0;   // 빠지기 거리(22 m)까지만 벌리고, 그 뒤로는 둘레로만
          K.vx = (rx * out - ry * O.dir) / rl * 2; K.vy = (ry * out + rx * O.dir) / rl * 2; return;
        }
        if (!(O.tx === O.tx)) return;
        const e = K.e, dx = O.tx - m.x, dy = O.ty - m.y, l = hyp(dx, dy); if (l < 1) return;
        const rx0 = m.x - e.x, ry0 = m.y - e.y, rl = hyp(rx0, ry0) || 1, ux = rx0 / rl, uy = ry0 / rl, rad = dx * ux + dy * uy, tx = -uy, ty = ux, tan = dx * tx + dy * ty;
        let vx = ux * rad * P.radial + tx * tan, vy = uy * rad * P.radial + ty * tan; const vl = hyp(vx, vy) || 1; vx = vx / vl * 2; vy = vy / vl * 2;
        K.vx = K.vx * P.keep + vx * (1 - P.keep); K.vy = K.vy * P.keep + vy * (1 - P.keep);
      },
      // 값: 작전이 생각 겹의 마법을 목표로 기울인다, 강요하는 수(전설), 강요한 뒤 내 모양
      value(W, m, K, o) {
        const lv = lvOf(m), O = m.op; if (!lv || !O.cur || !(o.v > 0)) return;
        const s = o.s, e = K.e, op = O.cur, V = P.value;
        if (op === 'attrit') { const Re = ranges(e, K.De); if (INDIRECT[s.t]) o.v *= V.attritInd; else if (DIRECT[s.t] && K.d > Re.dir) o.v *= V.attritDir; }
        else if (op === 'press') { if (DIRECT[s.t]) o.v *= V.pressDir; }
        else if (op === 'finish') { if (OFF[s.t]) o.v *= V.finishOff; else o.v *= V.finishDef; }
        else if (op === 'hunt') { if (!K.los && INDIRECT[s.t]) o.v *= V.huntInd; }
        else if (op === 'herd' && (TERR[s.t] || s.t === 'zone' || s.t === 'area') && e.z < 1) {   // 몰이: 퇴로 쪽에
          const [rx, ry] = retreatOf(W, e), l = hyp(rx - e.x, ry - e.y) || 1; o.tx = e.x + (rx - e.x) / l * 3 + e.vx * 0.5; o.ty = e.y + (ry - e.y) / l * 3 + e.vy * 0.5; o.v *= V.herd;
        }
        else if (op === 'fort' && OFF[s.t]) o.v *= V.fortOff;
        if (lv >= 2) {
          const k = forcing(W, m, K, s, o.tx, o.ty); if (k) o.v = o.v * k + 0.2;
          if (W.t - O.fT < P.shapeAfter && (TERR[s.t] || (s.t === 'zone' && s.z && s.z.k !== 'rain'))) o.v *= V.shapeAfter;   // 상대가 대응하는 동안 내 모양을
        }
      },
      // 걸린 수: 강요한 수인가(전설), 그 뒤 상대가 길을 바꾸는지 엔진이 본다 (공격이면 대조로)
      commit(W, m, K, best, cast, Tc) {
        const lv = lvOf(m), O = m.op; if (!lv || O.pend) return;
        const s = best.s, e = K.e, f = lv >= 2 && forcing(W, m, K, s, best.tx, best.ty) > 0;
        if (f) O.fT = W.t;
        if (f || OFF[s.t]) O.pend = { force: f, e, tx: best.tx, ty: best.ty, d0: hyp(e.x - best.tx, e.y - best.ty), until: W.t + (Tc || 0) + P.forceWin };
        if (O.cur === 'herd' && O.st && (s.t === 'trap' || s.t === 'area' || s.t === 'zone')) O.st.herdHit += (m.log.hits[s.n] || 0) > 0 ? 1 : 0;
      },
    };
  },
};
}, {"../math":"src/math.js","../../data/rules/tactics.json":"data/rules/tactics.json"}];
D["src/rules/taunt.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 도발 (rules.taunt, 1.4.0, SPEC 8장)
 * 마법 '도발'(틀 taunt)이 책에 남는다. 과녁이 예비동작(부름) 중이면 확률 g × (파도 위 1, 아니면 0.6)로 끊는다. 이단은 걸리지 않는다 */
module.exports = {
  name: 'taunt', on: W => W.rules.taunt, form: { taunt: 'target' },
  types: X => ({
    taunt(W, m, c, a) {
      const { hyp, hit } = X, g = a.g, tx = c.tx, ty = c.ty;
      let e = c.tgt && c.tgt.hp > 0 ? c.tgt : null; if (!e) for (const q of a.foes) if (hyp(q.x - tx, q.y - ty) < 1) { e = q; break; }
      if (!e || e.type === '이단' || !(e.cast || e.castB)) return;
      if (W.rng() < g * (e.wave ? 1 : 0.6)) { e.cast = e.castB = null; e.fat += 8; if (e.wave) e.st.stun = Math.max(e.st.stun || 0, 0.3); e.log.taunted++; hit(m, c.s); if (W.rec) W.fx.push(['z', m.x, m.y, e.x, e.y]); }
    },
  }),
  // 두뇌: 끊을 부름의 값 × 끊길 확률
  brainTypes: B => ({
    taunt(W, m, K, o) { const e = K.e, c = e.cast || e.castB; if (c && e.type !== '이단' && K.d < o.R && c.T - c.t > o.Tw + 0.05) o.v = o.he * B.estDmg(c.s) * (e.wave ? 1 : 0.6) / (o.Tw + 0.3) * (e.wave ? 1.3 : 1); },
  }),
};
}, {}];
D["src/rules/terrain.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 지대 (늘 켜짐, SPEC 8장 zone)
 * 지대가 몸에 거는 것(불·암모니아·포자·산·얼음·황화수소), 흡수 안개·물 장막의 피해 줄이기, 빙판의 미끄러짐, 산이 벽을 녹이기, 지대의 시간 */
module.exports = {
  name: 'terrain', on: () => true,
  engine: X => {
    const { inZone, hurt, hyp } = X;
    return {
      // 맞을 때: 흡수 안개(전기 × 0.5, 불 × 0.4), 물 장막(불 × 0.5)
      hurtMod(W, m, v, kind) { if (m.z >= 1) return v; for (const z of W.zones) { if (!inZone(z, m.x, m.y)) continue; if (z.k === 'absorb') { if (kind === 'elec') v *= 0.5; if (kind === 'fire') v *= 0.4; } if (z.k === 'mist' && kind === 'fire') v *= 0.5; } return v; },
      // 걸음마다: 선 지대의 효과
      mageZones(W, m) {
        if (m.z >= 1) return;   // 떠 있으면 지대에 닿지 않는다 (v2.0, rules/flight)
        for (const z of W.zones) {
          if (!inZone(z, m.x, m.y)) continue;
          if (z.dps && z.src !== m && z.src.side !== m.side && !z.lured && W.t - (z.src.lureT ?? -9) < 3) { z.lured = 1; z.src.log.lure++; }   // 끌어들인 적이 내 지대에 들었다
          if (z.dps && (z.src !== m || z.k === 'h2s')) hurt(W, m, z.dps * W.dt, z.src === m ? null : z.src, z.n, z.k === 'fire' ? 'fire' : 'tox', true);
          if (z.k === 'fire' && !(m.st.wet > 0)) m.st.burn = Math.max(m.st.burn || 0, 1);
          if (z.k === 'nh3') { m.st.blind = Math.max(m.st.blind || 0, 0.3); m.st.cough = Math.max(m.st.cough || 0, 0.5); }
          if (z.k === 'spore') m.st.cough = Math.max(m.st.cough || 0, 0.5);
          if (z.k === 'acid') { m.st.blind = Math.max(m.st.blind || 0, 0.3); if (m.st.lime > 0) m.st.lime = 0; }   // 산이 석회를 녹인다
          if ((z.k === 'ice' || z.k === 'chill') && z.src !== m) m.st.chill = Math.max(m.st.chill || 0, 0.4);
          if (z.k === 'h2s') { m.h2sT = (m.h2sT || 0) + W.dt; if (m.h2sT > 1.5) m.st.stun = Math.max(m.st.stun || 0, 0.5); }
        }
      },
      // 걸음의 가속: 남의 빙판 위에선 1.5 (보통 9)
      accel(W, m, acc) { if (m.z >= 1) return acc; for (const z of W.zones) if (z.k === 'ice' && z.src !== m && inZone(z, m.x, m.y)) return 1.5; return acc; },
      // 지대의 시간, 산이 벽을 녹인다
      zoneTick(W) { for (const z of W.zones) { z.t -= W.dt; if (z.k === 'acid') for (const w of W.walls) if (hyp(w.x - z.x, w.y - z.y) < (z.r || 2) + w.r) { if (w.hp > 0 && w.hp <= 25 * W.dt && z.src.mlog) z.src.mlog.razed++; w.hp -= 25 * W.dt; } } },   // 녹여 없앤 벽은 지형 지표에 (v2.2)
    };
  },
};
}, {}];
D["src/rules/tune.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 손잡이 (rules.tune, v2.19, SPEC 43장, 수는 data/rules/tune.json)
 * 모든 마법에 같은 손잡이 셋 — 크기 z · 화력 f · 속도 v (2단계 = 지금 마법, 최대는 서클 maxCirc 이상) — 과 숨김 스위치(예비동작이 안 보이는 대신 시전 × 1.5, 위력 × 0.8).
 * 붙는 곳은 틀마다: 던지기(무게 × z³ × f·반지름 × z, 빠르기 × v) · 실(굵기 tw × z, 전하 E × f, 뻗는 빠르기 × v) · 구름·발밑·곡사(반지름 × z, 피해 × f, 지연·나는 시간 ÷ v)
 *   · 벽(반지름 × z, 체력 × f) · 함정(반지름 × z, 피해 × f, 터지기까지 ÷ v)
 * 비용: 에너지 E = z³ f (던지기는 × v²). 예비동작 × (sig + (1 − sig) E) (숨김 × 1.5), 당 × f, 머리 피로(풀 때) × log₂(1 + E) (숨김 × (1 + hide.heat)).
 * 드러남 v = E^(1/3) (cast.vis), 숨기면 × hide.vis(1/3). v가 1 아래면 과녁이 짓기 시작할 때 단계·거리에 따라 알아챈다(notice). 못 알아챈 시전(cast.unseen)은 읽는 쪽(hideCast 훅·반사 겹·잔기술·막기·수읽기)이 건너뛴다
 * 엔진: 훅 tune(방출 첫머리) — 손잡이를 돌린 시전(c.tk)은 손잡이가 박힌 마법 사본으로 푼다(세계마다 열쇠로 모아 둔다)
 * 값 = 맞을 가망 × 피해 ÷ (예비동작 + 닿는 때 + 0.25 + 더 쓴 당 ÷ 당 회복 + 더 쓴 머리 ÷ 머리 회복). 회복은 엔진 훅 gluRegen·fatRecover의 사슬로 그 자리에서 잰다
 * 두뇌 (tac.tune): 1 초보 2단계만 · 2 중급 2·3 · 3 상급 1·2·3·최대 · 4 대가 1·2·3·최대 · 5 전설 같게 + 속도만 사이를 잘라 씀 (최대는 메이트에만). 고른 마법 하나만 조합을 따지고 공격 방식으로 먼저 거른다(견제 1·2, 메이트 3·최대).
 *   기록 m.mlog.tune['이름#z?f?v?(h)'] (2단계 셋에 숨김이 없으면 세지 않는다) */
const P = require('../../data/rules/tune.json');
const { pow, log, exp, hyp } = require('../math');
const LN2 = log(2), TUNED = { proj: 1, thread: 1, area: 1, lob: 1, wall: 1, trap: 1 };
const energy = (s, z, f, v) => z * z * z * f * (s.t === 'proj' ? v * v : 1);
const near = (a, x) => { let b = 0; for (let i = 1; i < a.length; i++) if (Math.abs(a[i] - x) < Math.abs(a[b] - x)) b = i; return b + 1; };
const keyOf = (z, f, v, h) => 'z' + near(P.z, z) + 'f' + near(P.f, f) + 'v' + near(P.v, v) + (h ? 'h' : '');
// 알아채기 (v2.20): 드러남 v(= E^(1/3), 숨기면 × hide.vis)가 1 아래면 읽는 쪽의 단계와 거리에 따라 1 − e^(−k · v · 눈 · 가까움)로 알아챈다
function notice(W, v, e, d) {
  if (v >= 1 || !e) return true; const N = P.notice, L = e.tac.tune || 0, eye = N.eye[L] ?? N.eye[0], nr = d > N.near ? N.near / d : 1;
  return W.rng() < 1 - exp(-N.k * v * eye * (nr < N.far ? N.far : nr));
}
// 손잡이가 박힌 마법 사본
function make(s, z, f, v, h) {
  const t = Object.assign({}, s), E = energy(s, z, f, v), d = f * (h ? P.hide.pow : 1);
  switch (s.t) {
    case 'proj': t.m = (s.m || 0) * z * z * z * d; t.v = s.v * v; t.rad = (s.rad || 0.1) * z; if (s.hit && (s.hit.dmg || s.hit.flat)) { t.hit = Object.assign({}, s.hit);
      const k = pow(z * z * z * d * v * v, 0.75); if (t.hit.dmg) t.hit.dmg *= k; if (t.hit.flat) t.hit.flat *= k; } break;
    case 'thread': t.tw = z; t.E = s.E * d; break;
    case 'area': t.r = s.r * z; t.dmg = s.dmg * d; t.delay = s.delay / v; break;
    case 'lob': t.r = s.r * z; t.dmg = s.dmg * d; t.flight = s.flight / v; break;
    case 'wall': t.r = s.r * z; t.hp = s.hp * f; break;
    case 'trap': t.tr = Object.assign({}, s.tr, { r: s.tr.r * z, arm: 0.8 / v }); if (s.tr.dmg) t.tr.dmg = s.tr.dmg * d; break;
  }
  t.cost = s.cost * log(1 + E) / LN2 * (h ? 1 + P.hide.heat : 1);   // 숨기면 고리를 억누르느라 머리가 더 든다 (v2.20)   // 머리 피로는 풀 때 cost로 센다 (당은 짓기 시작할 때 이미 냈다)
  return t;
}
// 손잡이 조합 하나의 값 (판단, commit이 부른다). 고르는 동안 같은 값은 TV에 모아 두고 다시 쓴다 (v2.23.1: 판단마다 새 함수를 만들지 않는다)
const TV = { ex: 0, s: null, m: null, best: null, T0: 0, ext: 0, sees: false, lock: 0, vl: 0, reach: 0, gR: 0, hR: 0, d: 0 };
function valueOf(z, f, v, h) {
  const s = TV.s, m = TV.m, best = TV.best, T0 = TV.T0, ext = TV.ext, sees = TV.sees, lock = TV.lock, vl = TV.vl, reach = TV.reach, gR = TV.gR, hR = TV.hR, d = TV.d;
  const E = energy(s, z, f, v), Tc = (T0 - ext) * (P.sig + (1 - P.sig) * E) * (h ? P.hide.cast : 1) + ext / v;
  const glu = best.cost * f; if (glu - best.cost > m.glu) return -1e9;
  const heat = s.cost * 1.6 * log(1 + E) / LN2 * (h ? 1 + P.hide.heat : 1); if (m.fat + TV.ex + heat > P.heatMax && E > 1) return -1e9;
  const land = s.t === 'area' ? s.delay / v : s.t === 'lob' ? s.flight / v : s.t === 'proj' ? d / (s.v * v) : 0, t = Tc + land;
  const seen = h || !sees ? land : t, need = lock >= t ? 0.3 : vl * seen * 0.5 + 0.3;
  const ph = s.t === 'wall' ? 1 : Math.min(1, reach * z / need), D = (s.t === 'thread' ? pow(f, 0.55) : s.t === 'proj' ? pow(E, 0.75) : s.t === 'wall' ? pow(z * f, 0.5) : f) * (h ? P.hide.pow : 1);
  const tr = (glu - best.cost) / (gR > 0.1 ? gR : 0.1) + (heat - s.cost * 1.6) / (hR > 0.1 ? hR : 0.1);   // 더 쓴 당·머리가 돌아오기까지 (덜 쓰면 그만큼 번다)
  return ph * D / Math.max(0.5 * (t + 0.25), t + 0.25 + tr) - P.heatW * Math.max(0, m.fat + heat - 60);
}
module.exports = {
  name: 'tune', switch: 'tune', api: { P, energy, make, keyOf, notice },
  engine: X => ({
    tune(W, m, c) {
      if (!c.tk) return; const C = W._tuneC || (W._tuneC = new Map()), k = c.s.n + '|' + c.tz + '|' + c.tf + '|' + c.tv + '|' + (c.hid ? 1 : 0);
      let t = C.get(k); if (!t) { t = make(c.s, c.tz, c.tf, c.tv, c.hid); C.set(k, t); } c.s = t;
    },
  }),
  brain: B => {
    const C = B.C, Z = P.z, F = P.f, V = P.v, AL = [];
    return {
      hideCast(W, q, c) { return !!c.unseen; },   // 알아채지 못한 예비동작은 안 보인다 (v2.20)
      commit(W, m, K, best, cast) {
        const L = m.tac.tune, s = best.s; if (!L || !TUNED[s.t] || s.big && !(K.pl && K.pl.mate)) return;   // 큰 한 방은 메이트에서만 손잡이를
        const pl = K.pl, mate = !!(pl && pl.mate && pl.n === s.n), poke = K.mode === 'poke', e = cast.tgt;
        // 쓰는 단계 (크기·화력), 속도는 최대가 없다
        const al = P.allow[L] || P.allow[1]; AL.length = 0; const rc = B.ringsOf(W, m); for (const i of al) if (i < 3 || rc >= P.maxCirc) AL.push(i);   // 쥘 수 있는 고리 (합창의 앞소리꾼은 모은 고리, v2.34)
        let lo = 0, hi = 2; if (poke) { lo = P.poke[0]; hi = P.poke[1]; } else if (mate) { lo = P.mate[0]; hi = P.mate[1]; }   // 최대는 메이트의 큰 한 방에만
        let any = false; for (const i of AL) if (i >= lo && i <= hi) any = true; if (!any) { lo = 0; hi = 2; }
        const d = hyp(cast.tx - m.x, cast.ty - m.y), lock = e ? Math.max(e.st.stun, e.st.root) : 0, vl = e ? hyp(e.vx, e.vy) : 0, rs = C.sizeOf(m, s), T0 = cast.T;
        const ext = s.t === 'thread' ? Math.min(d, C.rangeOf(m, s)) / (32 * (s.fast || 1)) / (W.rules.pace && m.C >= 8 ? 3 : 1) : 0;   // 예비동작에 접힌 실의 뻗는 시간 (빠른 판이면 3배 빠르다)
        const reach = s.t === 'thread' ? 0.6 * Math.min(rs, 2) + 0.2 : s.t === 'area' || s.t === 'lob' ? s.r * rs : s.t === 'proj' ? (s.rad || 0.1) * Math.min(rs, 3) + 0.5 : s.t === 'trap' ? s.tr.r * Math.min(rs, 2) : 1;
        let gR = W.rules.gluRegen ?? 1.2; const hg = W.H.gluRegen; for (let i = 0; i < hg.length; i++) gR = hg[i](W, m, gR);   // 당·머리가 돌아오는 빠르기: 더 쓴 당·머리를 시간으로 본다
        let hR = 4; const hf = W.H.fatRecover; for (let i = 0; i < hf.length; i++) hR = hf[i](W, m, hR);
        const sees = e && e.tac.readCast;   // 숨김은 상대가 예비동작을 읽을 때만 값이 있다
        let bv = -1e9, bz = 1, bf = 1, bvv = 1, bh = false;
        TV.ex = B.pendHeat(W, m); TV.s = s; TV.m = m; TV.best = best; TV.T0 = T0; TV.ext = ext; TV.sees = sees; TV.lock = lock; TV.vl = vl; TV.reach = reach; TV.gR = gR; TV.hR = hR; TV.d = d; const value = valueOf;
        for (const iz of AL) { if (iz < lo || iz > hi) continue; for (const iff of AL) { if (iff < lo || iff > hi) continue; for (const iv of AL) { if (iv > 2) continue;
          for (let h = 0; h < (L >= P.hideFrom ? 2 : 1); h++) { const x = value(Z[iz], F[iff], V[iv], h === 1); if (x > bv + 1e-9) { bv = x; bz = Z[iz]; bf = F[iff]; bvv = V[iv]; bh = h === 1;
              } } } } }
        // 전설: 속도만 단계 사이를 잘라 쓴다 (확정 순간에 딱 맞게). 크기·화력은 단계로 (v2.20)
        if (L >= 5 && s.t !== 'wall') { const q = P.q; for (let v = V[0]; v <= V[2] + 1e-9; v += q) { const vq = Math.round(v / q) * q, x = value(bz, bf, vq, bh); if (x > bv + 1e-9) { bv = x;
              bvv = vq; } } }
        if (bz === 1 && bf === 1 && bvv === 1 && !bh) return;
        const E = energy(s, bz, bf, bvv);
        cast.T = (T0 - ext) * (P.sig + (1 - P.sig) * E) * (bh ? P.hide.cast : 1) + ext / bvv;
        m.glu -= best.cost * (bf - 1); cast.cost = best.cost * bf;
        cast.tz = bz; cast.tf = bf; cast.tv = bvv; cast.hid = bh; cast.vis = pow(E, 1 / 3); cast.tk = keyOf(bz, bf, bvv, bh);
        cast.unseen = !notice(W, cast.vis * (bh ? P.hide.vis : 1), e, d);   // 과녁이 알아챘나 (짓기 시작할 때 과녁의 눈으로 한 번)
        const T = m.mlog.tune || (m.mlog.tune = {}), k = s.n + '#' + cast.tk; T[k] = (T[k] || 0) + 1;
      },
    };
  },
};
}, {"../../data/rules/tune.json":"data/rules/tune.json","../math":"src/math.js"}];
D["src/rules/unstuck.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 막힘 풀기 (rules.unstuck, v2.30, SPEC 53장, 수는 data/rules/unstuck.json) — 기본 꺼짐
 * 땅에 붙은 날기: 날기를 그만둔(flyWant 꺼짐) 사람의 높이가 0으로 다가가기만 하고 닿지 않으면(1e-27 m) 날기 상태로 남아 힘이 모자라 걷지도 못했다.
 *   eps m 아래로 내려오면 내려앉는다(rules/flight의 착지와 같다)
 * 판 끝: 판 밖으로 걸으려는 몫은 버리고 끝을 따라 미끄러진다(물러서다 모서리에 몰려 한 점에 쌓이지 않게)
 * 막혀 제자리: 걸으려는데(걸음 0.5 넘게) every s 동안 d m도 못 갔으면 hold s(거듭 막히면 네 배까지) 동안 옆으로 돌아간다.
 *   곁(near m)의 바위(v2.32부터 벽도)가 막았으면 바위를 끼고 돈다(가려던 쪽에 가까운 접선, 조금 밖으로 out), 아니면 직각으로 같은 쪽으로 가다가 세 번 막히면 쪽을 바꾼다 */
const P = require('../../data/rules/unstuck.json');
const ST = new WeakMap();   // 사람 → { x, y, t: 잰 시각, until: 돌아가는 끝 시각, sx: 쪽, n: 거듭 막힌 수, o: 막은 바위 }
module.exports = {
  name: 'unstuck', switch: 'unstuck', api: { P },
  engine: () => ({
    mageStep(W, m) { if (m.fly === 1 && !m.flyWant && m.z > 0 && m.z < P.eps && !(m.vz > 0)) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; } },
  }),
  brain: B => ({
    steer(W, m, K) {
      if (m.flee) return;   // 달아나는 사람은 판 밖으로 나간다
      const e = P.edge; if ((m.x < e && K.vx < 0) || (m.x > W.width - e && K.vx > 0)) K.vx = 0; if ((m.y < e && K.vy < 0) || (m.y > W.height - e && K.vy > 0)) K.vy = 0;
      let s = ST.get(m); if (!s) ST.set(m, s = { x: m.x, y: m.y, t: W.t, until: -9, sx: 1, n: 0, o: null });
      if (W.t < s.until && !K.dodge) { const vx = K.vx, vy = K.vy, l = B.hyp(vx, vy) || 1, o = s.o;
        if (o) { const ox = m.x - o.x, oy = m.y - o.y, ol = B.hyp(ox, oy) || 1, nx = ox / ol, ny = oy / ol, sg = -ny * vx + nx * vy >= 0 ? 1 : -1;   // 바위를 끼고 돈다: 접선(원하는 쪽에 가까운 쪽)과 조금 밖으로
          K.vx = (-ny * sg + nx * P.out) * l; K.vy = (nx * sg + ny * P.out) * l; }
        else { const k = s.sx; K.vx = -vy * k; K.vy = vx * k; }   // 옆으로 돈다
        return; }
      if (W.t - s.t < P.every) return;
      const want = B.hyp(K.vx, K.vy) > 0.5 && !(m.st.root > 0) && !(m.st.stun > 0) && !m.cast;
      if (want && B.hyp(m.x - s.x, m.y - s.y) < P.d) { s.n++; s.until = W.t + P.hold * (s.n < 4 ? s.n : 4);
        let bo = null, bd = P.near; for (const o of W.obs) { const d = B.hyp(o.x - m.x, o.y - m.y) - o.r; if (d < bd) { bd = d; bo = o; } }   // 막은 바위
        if (P.walls) for (const o of W.walls) { if (!(o.hp > 0)) continue; const d = B.hyp(o.x - m.x, o.y - m.y) - o.r; if (d < bd) { bd = d; bo = o; } }   // 벽도 (v2.32)
        s.o = bo; if (!bo && s.n % 3 === 0) s.sx = -s.sx; }
      else if (!want || B.hyp(m.x - s.x, m.y - s.y) > P.d * 4) s.n = 0;
      s.x = m.x; s.y = m.y; s.t = W.t;
    },
  }),
};
}, {"../../data/rules/unstuck.json":"data/rules/unstuck.json"}];
D["src/rules/wave.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 파도 (rules.wave, 1.2.0~, SPEC 7장, WORLD 3-3)
 * 머리가 넘치면 굳는 대신 파도를 탄다. 부류(서퍼·메타·이단)마다 다르다.
 * 파도 위: 선명도 × 1.1, 위력 × 2.0(서퍼)·1.3, 걸음 × 1.15, 시전 × 0.75, 몸이 탄다. 170 넘으면 폭주. 75 아래로 내려오면 꺼짐(crash).
 * 이단: 파도를 못 느끼고 머리는 100에서 멈춘다. 위력 × 0.8, 예비동작이 조용하고(마지막 0.12 s에만 읽힌다), 안 보이는 함정을 알아채기 어렵다.
 * 메타: 머리 회복 × 1.05, 문턱 아래(80~100)에서 위력 × 1.08, 상대의 파도를 읽는다 */
module.exports = {
  name: 'wave', on: W => W.rules.wave,
  engine: X => {
    const { hurt } = X;
    return {
      ceff(W, m, x) { return m.wave ? x * 1.1 : x; },
      power(W, m, s, x) { return x * (m.wave ? (m.type === '서퍼' ? 2.0 : 1.3) : m.type === '이단' ? 0.9 : m.type === '메타' && m.fat >= 80 && m.fat <= 100 ? 1.08 : 1); },
      // 머리가 넘칠 때: 굳지 않고 탄다. 너무 깊이(170) 가면 휩쓸린다. 이단은 100에서 멈춘다
      overload(W, m) {
        if (m.type !== '이단') {
          const enter = m.type === '서퍼' ? 90 : 100, may = !m.tac.waveChoose || m.waveWant;   // 파도 고르기(전설): 끝낼 수 있을 때만 스스로 탄다
          if (!m.wave && m.fat > enter && may) { m.wave = 1; m.log.waves++; }
          else if (!m.wave && m.fat > 100 && !may) { m.st.stun = Math.max(m.st.stun || 0, 1); m.fat = 55; m.log.over++; m.cast = m.castB = m.chan = null; }
          if (m.fat > 170) { m.log.over++; m.log.lost++; hurt(W, m, 30, null, '폭주', 'wave'); m.st.stun = Math.max(m.st.stun || 0, 2.5); m.fat = 60; m.wave = 0; m.crash = 3; m.cast = m.castB = m.chan = null; }
        } else if (m.fat > 100) m.fat = 100;
        return true;
      },
      fatRecover(W, m, k) { return k * (m.type === '메타' ? 1.05 : m.type === '이단' ? 1.3 : 1); },   // 메타: 머리 회복 × 1.05. 이단 × 1.3 (v2.0: 파도의 도파민도 꺼짐도 없어 머리가 빨리 식는다)
      mageStep(W, m) {
        if (m.crash > 0) m.crash -= W.dt;
        if (m.wave) {
          // 파도는 몸을 태운다. 깊을수록 세게. 서퍼는 익숙하고 메타는 조절한다. 피로가 75 아래로 내려오면 꺼짐(crash)
          m.waveT += W.dt; const wd = (1.5 + (m.fat - 90) * 0.06) * (m.type === '서퍼' ? 0.8 : 0.6) * W.dt;
          m.log.waveDmg += Math.max(0, wd); hurt(W, m, wd, null, '파도', 'wave'); if (m.hp <= 0) m.log.waveDeath = 1;
          if (m.fat < 75) { m.wave = 0; m.crash = m.type === '메타' ? 0 : 2; }   // 메타는 조절해 내려와 꺼짐이 없다
        }
      },
      speed(W, m, sp) { return sp * (m.wave ? 1.15 : 1) * (m.crash > 0 ? 0.85 : 1); },
      notice(W, t, k) { return k * (t.src.type === '이단' ? 0.32 : 1); },   // 이단의 안 보이는 함정은 알아채기 어렵다
    };
  },
  brain: () => ({
    // 성향: 파도 위에선 더 몰아치고 더 붙고 덜 피하고 쉬지 않는다. 메타(또는 파도 읽기)는 상대의 파도를 읽는다. 파도 고르기(전설)
    aim(W, m, K) {
      const T = m.tac, e = K.e;
      if (m.wave) { K.aggr = T.aggr * 1.6; K.prefR = T.prefR * 0.7; K.dodgeK = T.dodge * 0.5; K.rest = 999; }
      if ((m.type === '메타' || T.readWave) && (e.wave || e.crash > 0)) { if (e.wave) { K.prefR = K.prefR * 1.4; K.aggr = K.aggr * 0.7; } else K.aggr = K.aggr * 1.6; }
      if (T.waveChoose) m.waveWant = e.hp / e.hpMax < 0.35 && m.hp / m.hpMax > 0.3;
    },
    hideCast(W, q, c) { return q.type === '이단' && c.T - c.t > 0.12; },   // 이단의 예비동작은 마지막 0.12 s에만 읽힌다 (읽기·자동 진 모두)
    // 쉴 때: 서퍼는 쉬지 않고 탄다, 메타는 이기고 있을 때만 타고 너무 깊으면(140) 내려온다, 이단은 쉰다. 전설은 끝낼 수 있을 때만
    rest(W, m, K, restNow) {
      const T = m.tac, e = K.e;
      if (restNow) {
        if (T.waveChoose) restNow = !m.waveWant;
        else if (m.type === '서퍼') restNow = false;
        else if (m.type === '메타') restNow = !(e.hp / e.hpMax < 0.5 || m.hp / m.hpMax > e.hp / e.hpMax + 0.1);
      }
      return restNow || (m.wave && (m.type === '메타' || (T.waveChoose && !m.waveWant)) && m.fat > 140 && !K.aimed);
    },
    castTime(W, m, t) { return t * (m.wave ? 0.75 : 1) * (m.crash > 0 ? 1.3 : 1); },
    valueLate(W, m, K, o) { if (m.wave && !o.isOff) o.v *= 0.5; },   // 파도 위에선 막기보다 친다
  }),
};
}, {}];
D["src/scenario.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 조건 짓개 (v2.33, SPEC 55장): 조건(data/conditions.json) → 장면
 * 조건 = { id, name, note, field?: [w, h], maxT?, timeWin?(시간이 다 되면 이기는 편), closed?(갇힌 판: 물러서거나 끝으로 빠질 수 없다), rules?, decks?, layout?, terrain?, sides: [{ name, groups: [{ tier, n, skill, deck, form, d?, rows?, team?, out?, squad?, chorus?, tac?, hp?, z?, gabion? }] }] }
 * 배치는 부를 때마다 지금 엔진의 수로 정한다: 단계의 선명도(data/tiers.json) → 장악 반경(rules.domainR × C), 덱 공격 마법 R의 가운데 × √C → 사거리.
 * 규칙은 묶음 '지금' 위에 조건의 rules. 판 크기는 가장 먼 무리와 지형에 맞춘다(둘레 margin m). 같은 조건·씨앗이면 늘 같은 장면(난수는 씨앗의 mulberry32).
 * 주인공 = 첫 편의 첫 무리의 첫 사람. 무리는 주인공 쪽에서 +x 쪽으로 놓인다(고리·조는 둘레)
 * form: center · edge(왼쪽 끝) · near(주인공 곁) · ring(주인공 장악 반경 + 10 m 이상의 고리, 황금각 나선) · squads(team명씩 조, 조 사이 같은 각, 장악 반경 + out 밖)
 *   · arc(반원, 거리 d) · line(거리 d, rows줄) · cluster(거리 d의 덩어리) · inFort(소금 성채 안) · city(소금 도시의 골목) · battery(포 n문, 시작 자리에서 d m 밖, 포수 넷씩,
 *     gabion이면 흙 가마니가 앞과 옆 270°, 지형에 문이 있으면 문을 지킨다) · auto(엔진이 놓는다: 장면의 layout)
 * terrain: { rocks: 수, salt: 'under' | 'fort' | 'city', d: 지형의 가운데까지(m), w·h: 도시 크기, wall: 도시 성벽(문 gates개), redoubt: 주인공 둘레 보루 } */
const core = require('./core'), { cos, sin, hyp, mulberry32 } = require('./math');
const TIERS = require('../data/tiers.json'), DECKS = require('../data/decks.json'), LIST = require('../data/conditions.json'), ART = require('../data/rules/artillery.json');
const GOLD = 2.39996, M = 12;   // 황금각, 판 둘레 여유 (m)
const OFFT = { proj: 1, thread: 1, area: 1, lob: 1, cone: 1, touch: 1 };
const pick = (v, k) => Array.isArray(v) ? v[k % v.length] : v;
const r2 = x => Math.round(x * 100) / 100;
// 단계·덱의 지금 수: 선명도, 장악 반경, 사거리
function stat(g, rules, decks) {
  const t = TIERS[g.tier]; if (!t) throw new Error('없는 단계: ' + g.tier); const C = t.C, book = decks[pick(g.deck, 0)] || decks['합법 최강'] || [];
  const Rs = book.map(n => core.SPELLS[n]).filter(s => s && OFFT[s.t] && !s.mundane && !(s.rule && !rules[s.rule])).map(s => (s.R || 0) * Math.sqrt(C)).sort((a, b) => a - b);
  return { C, dom: (rules.domainR || 0) * C, range: Rs.length ? Rs[Rs.length >> 1] : 10 };
}
// 소금 도시 (army.js의 salt-city와 같은 셈, x0·y0에서 w × h): 골목 격자의 건물(바위), 광장 셋만 맨땅
function city(x0, y0, w, h) {
  const obs = [], plazas = [[x0 + w * 0.3, y0 + h * 0.27], [x0 + w * 0.55, y0 + h * 0.67], [x0 + w * 0.8, y0 + h * 0.37]];
  for (let x = x0 + 8; x < x0 + w - 4; x += 11) for (let y = y0 + 8; y < y0 + h - 4; y += 11) if (!plazas.some(([px, py]) => Math.abs(px - x) < 14 && Math.abs(py - y) < 14)) obs.push({ x: r2(x), y: r2(y), r: 3.5 });
  let rects = [{ x: x0, y: y0, w, h }]; for (const [px, py] of plazas) { const out = []; for (const r of rects) { const a0 = px - 12, a1 = px + 12, b0 = py - 12, b1 = py + 12;
    if (a1 <= r.x || a0 >= r.x + r.w || b1 <= r.y || b0 >= r.y + r.h) { out.push(r); continue; }
    if (r.x < a0) out.push({ x: r.x, y: r.y, w: a0 - r.x, h: r.h }); if (r.x + r.w > a1) out.push({ x: a1, y: r.y, w: r.x + r.w - a1, h: r.h });
    const c0 = Math.max(r.x, a0), c1 = Math.min(r.x + r.w, a1); if (r.y < b0) out.push({ x: c0, y: r.y, w: c1 - c0, h: b0 - r.y }); if (r.y + r.h > b1) out.push({ x: c0, y: b1, w: c1 - c0, h: r.y + r.h - b1 }); } rects = out; }
  return { obs, salt: rects.map(r => ({ x: r2(r.x), y: r2(r.y), w: r2(r.w), h: r2(r.h) })), plazas };
}
// 장면을 짓는다
function build(cond, opt = {}) {
  if (typeof cond === 'string') { const c = LIST.find(x => x.id === cond); if (!c) throw new Error('없는 조건: ' + cond); cond = c; }
  const seed = opt.seed || 1, rnd = mulberry32(seed * 7919 + 17), rules = Object.assign({ profile: '지금' }, cond.rules), R = core.rulesOf(rules), T = cond.terrain || {};
  const decks = Object.assign({}, DECKS, cond.decks); let useArt = false;
  const sides = [], pts = [], walls = [], obs = [], salt = []; let auto = false;
  const g0 = cond.sides[0].groups[0], P = stat(g0, R, decks);
  // 지형의 가운데: 주인공(0, 0)에서 +x로 T.d
  const tx = T.d != null ? T.d : 0; let CITY = null, FORT = null, gates = [];
  if (T.salt === 'city') { const w = T.w || 200, h = T.h || 150; CITY = city(tx - w / 2, -h / 2, w, h); salt.push(...CITY.salt); obs.push(...CITY.obs);
    if (T.wall) { const n = T.gates || 3, x = tx - w / 2; for (let k = 0; k < n; k++) gates.push([x, -h / 2 + h * (k + 0.5) / n]);
      for (let y = -h / 2; y <= h / 2; y += 1.2) if (!gates.some(g => Math.abs(g[1] - y) < 4)) walls.push({ x: r2(x), y: r2(y), r: 0.7, hp: 600, mat: 'earth' }); } }
  if (T.salt === 'fort') { const S = T.yard || 25, Rw = T.wallR || 11; FORT = { x: tx, y: 0, R: Rw }; salt.push({ x: r2(tx - S), y: -S, w: 2 * S, h: 2 * S });
    for (let k = 0; k < 40; k++) { const a = k / 40 * 6.2832, gap = [0, 1.5708, 3.1416, 4.7124].some(b => Math.abs(((a - b + 9.4248) % 6.2832) - 3.1416) < 0.2); if (!gap) walls.push({ x: r2(tx + cos(a) * Rw), y: r2(sin(a) * Rw), r: 0.7, hp: 300, mat: 'earth' }); }
    gates = [[tx - Rw, 0], [tx, -Rw], [tx + Rw, 0], [tx, Rw]]; }
  if (T.salt === 'under') salt.push({ x: -10, y: -10, w: 20, h: 20 });
  if (T.redoubt) for (let k = 0; k < 17; k++) { const a = k / 17 * 6.2832; walls.push({ x: r2(cos(a) * 2.2), y: r2(sin(a) * 2.2), r: 0.45, hp: 256, mat: 'earth', thick: 0.5, grp: 1000 }); }   // 보루: 주인공 둘레 흙 블록 열일곱
  cond.sides.forEach((sd, si) => {
    const ms = []; sides.push({ name: sd.name, mages: ms });
    for (const g of sd.groups) {
      const S = stat(g, R, decks), n = g.n || 1, f = g.form || 'auto', at = [];
      if (f === 'auto') auto = true;
      for (let k = 0; k < n; k++) {
        let p = null;
        if (f === 'center' || f === 'edge') p = [k * 1.2, 0];
        else if (f === 'near') { const r = 2 + 1.2 * Math.sqrt(k), a = k * GOLD; p = [cos(a) * r, sin(a) * r]; }
        else if (f === 'ring') { const R0 = P.dom + 10, r = Math.sqrt(R0 * R0 + k * (g.area || 12) / 3.1416), a = k * GOLD; p = [cos(a) * r, sin(a) * r]; }
        else if (f === 'squads') { const t = g.team || 5, K = Math.ceil(n / t), j = Math.floor(k / t), i = k % t, a = j * 6.2832 / K, D = P.dom + (g.out != null ? g.out : 12), ia = i * 6.2832 / t;
          p = [cos(a) * D + cos(ia) * 2, sin(a) * D + sin(ia) * 2]; }
        else if (f === 'arc') { const d = g.d || 14, a = -1.5708 + 3.1416 * (k + 0.5) / n; p = [cos(a) * d, sin(a) * d * 0.95]; }
        else if (f === 'line') { const rows = g.rows || 1, per = Math.ceil(n / rows), r = Math.floor(k / per), i = k % per; p = [(g.d || 30) + r * 3, (i - (per - 1) / 2) * 3]; }
        else if (f === 'cluster') { const r = 1.4 * Math.sqrt(k), a = k * GOLD; p = [(g.d || 30) + cos(a) * r, sin(a) * r]; }
        else if (f === 'inFort') { const F = FORT || { x: tx, y: 0, R: 11 }, r = Math.min(F.R - 2, 1.4 * Math.sqrt(k + 1)), a = k * GOLD; p = [F.x + cos(a) * r, F.y + sin(a) * r]; }
        else if (f === 'city') { const C2 = CITY ? { x0: tx - (T.w || 200) / 2, w: T.w || 200, h: T.h || 150 } : { x0: tx - 100, w: 200, h: 150 };
          for (let tr = 0; tr < 40 && !p; tr++) { const x = C2.x0 + 10 + rnd() * (C2.w - 20), y = -C2.h / 2 + 6 + rnd() * (C2.h - 12);
            if (CITY && (CITY.obs.some(o => hyp(o.x - x, o.y - y) < o.r + 1) || CITY.plazas.some(([px, py]) => Math.abs(px - x) < 13 && Math.abs(py - y) < 13))) continue; p = [x, y]; } if (!p) p = [C2.x0 + 10, 0]; }
        else if (f === 'battery') { useArt = true; const d = g.d || 60; let x, y;
          if (g.gates && gates.length) { const gt = gates[k % gates.length], j = Math.floor(k / gates.length), dx = tx - gt[0], dy = -gt[1], l = hyp(dx, dy) || 1; x = gt[0] + dx / l * (5 + j * 5) + (j % 2 ? -dy / l : dy / l) * 3 * (j ? 1 : 0); y = gt[1] + dy / l * (5 + j * 5) + (j % 2 ? dx / l : -dx / l) * 3 * (j ? 1 : 0); }   // 문 안쪽 5 m씩
          else { const a = (k - (n - 1) / 2) * (g.step || Math.min(0.5, 14 / d)); x = cos(a) * d; y = sin(a) * d; }
          p = [x, y]; }
        else if (f === 'auto') p = null;
        else throw new Error('없는 배치: ' + f);
        const spec = { tier: g.tier, deck: pick(g.deck, k), skill: pick(g.skill, k) };
        if (!spec.skill) delete spec.skill; if (!spec.deck) delete spec.deck; if (g.name) spec.name = g.name + (n > 1 ? k + 1 : '');
        const tac = Object.assign({}, g.tac); if (g.squad) tac.squad = 1; if (g.chorus) tac.chorus = 1; if (f === 'battery') { tac.gun = 1; tac.cancel = false; tac.cancel2 = false; spec.deck = '청동포'; spec.hp = ART.gun.hp; }
        if (Object.keys(tac).length) spec.tac = tac; if (g.hp && f !== 'battery') spec.hp = g.hp; if (g.z) spec.z = g.z;
        if (p) { spec.x = p[0]; spec.y = p[1]; pts.push(p); } ms.push(spec); at.push(p);
        if (f === 'battery') {   // 포수 넷: 포 뒤(주인공 반대쪽), 흙 가마니
          const l = hyp(p[0], p[1]) || 1, ux = p[0] / l, uy = p[1] / l;
          for (let c = 0; c < ART.gun.crew; c++) { const o = (c - 1.5) * ART.crew.side, q = [p[0] + ux * ART.crew.post - uy * o, p[1] + uy * ART.crew.post + ux * o]; ms.push({ tier: '병사', deck: '포수', x: q[0], y: q[1], tac: { crew: 1 } }); pts.push(q); }
          if (g.gabion) for (let c = 0; c < 14; c++) { const a = (c - 6.5) * (4.712 / 14), gap = Math.abs(a) < 0.35; if (gap) continue;
            const bx = -ux, by = -uy, ca = cos(a), sa = sin(a), vx = bx * ca - by * sa, vy = bx * sa + by * ca; walls.push({ x: p[0] + vx * 2.4, y: p[1] + vy * 2.4, r: 0.55, hp: 300, mat: 'earth' }); } }
      }
      if (g.squad) rules.squad = true; if (g.chorus) { rules.chorus = true; rules.chorusCast = true; }   // 합창이면 합창 설계도 (v2.34)
    }
  });
  if (useArt) { rules.artillery = true; Object.assign(decks, ART.decks); }
  // 판 크기와 옮기기
  let field = cond.field, ox = 0, oy = 0;
  const ext = pts.concat(salt.map(r => [r.x, r.y]), salt.map(r => [r.x + r.w, r.y + r.h]), obs.map(o => [o.x, o.y]), walls.map(w => [w.x, w.y]));
  if (pts.length) {
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0; for (const [x, y] of ext) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    const m = cond.margin != null ? cond.margin : M, w = Math.max(40, Math.ceil(x1 - x0 + 2 * m)), h = Math.max(30, Math.ceil(y1 - y0 + 2 * m));
    if (!field) field = [w, h]; ox = (field[0] - (x1 - x0)) / 2 - x0; oy = (field[1] - (y1 - y0)) / 2 - y0;
    if (g0.form === 'edge') ox = 6 - x0;   // 주인공을 왼쪽 끝에
  }
  const mv = (x, y) => [r2(Math.min(field[0] - 0.5, Math.max(0.5, x + ox))), r2(Math.min(field[1] - 0.5, Math.max(0.5, y + oy)))];
  for (const sd of sides) for (const m of sd.mages) if (m.x != null) { const q = mv(m.x, m.y); m.x = q[0]; m.y = q[1]; }
  const sc = { v: core.VERSION, cond: cond.id, name: cond.name, note: cond.note, seed, rules, maxT: cond.maxT, layout: cond.layout, sides }; if (cond.timeWin != null) sc.timeWin = cond.timeWin; if (cond.closed) sc.closed = true;
  if (field) { sc.width = field[0]; sc.height = field[1]; }
  if (salt.length) sc.salt = salt.map(r => ({ x: r2(r.x + ox), y: r2(r.y + oy), w: r.w, h: r.h }));
  if (walls.length) sc.walls = walls.map(w => Object.assign({}, w, { x: r2(w.x + ox), y: r2(w.y + oy) }));
  if (T.rocks != null || obs.length) { const ro = obs.map(o => ({ x: r2(o.x + ox), y: r2(o.y + oy), r: o.r }));
    for (let k = 0, tr = 0; k < (T.rocks || 0) && tr < 400; tr++) { const W0 = field ? field[0] : 40, H0 = field ? field[1] : 30, x = 3 + rnd() * (W0 - 6), y = 3 + rnd() * (H0 - 6), r = 1 + rnd() * 1.5;
      if (sides.some(sd => sd.mages.some(m => m.x != null && hyp(m.x - x, m.y - y) < r + 3)) || (!pts.length && Math.abs(y - H0 / 2) < 2.5)) continue; ro.push({ x: r2(x), y: r2(y), r: r2(r) }); k++; }
    sc.obstacles = ro.filter(o => !sides.some(sd => sd.mages.some(m => m.x != null && hyp(m.x - o.x, m.y - o.y) < o.r + 0.6))); }
  else if (cond.obstacles != null) sc.obstacles = cond.obstacles;
  if (Object.keys(cond.decks || {}).length || useArt) { sc.decks = {}; for (const k in decks) if (!DECKS[k] || (cond.decks && cond.decks[k])) sc.decks[k] = decks[k]; }
  sc.info = { prot: { C: P.C, dom: r2(P.dom), range: r2(P.range) } };
  return sc;
}
const list = () => LIST.map(c => ({ id: c.id, name: c.name, note: c.note }));
module.exports = { build, list, LIST, stat };
}, {"./core":"src/core.js","./math":"src/math.js","../data/tiers.json":"data/tiers.json","../data/decks.json":"data/decks.json","../data/conditions.json":"data/conditions.json","../data/rules/artillery.json":"data/rules/artillery.json"}];
var C = {};
function load(id) {
  var c = C[id]; if (c) return c.exports;
  var d = D[id]; if (!d) throw new Error('묶음에 없는 모듈: ' + id);
  c = C[id] = { exports: {} };
  d[0].call(c.exports, c, c.exports, function (p) { var t = d[1][p]; if (t === undefined) throw new Error(id + ': 묶음에 없는 require ' + p); return load(t); });
  return c.exports;
}
G.Arena = load("src/index.js");
G.ArenaCore = load('src/core.js'); G.ArenaBrain = load('src/brain/index.js'); G.ArenaRegistry = load('src/registry.js'); G.ArenaWatch = load("metrics/watch.js");
G.ArenaData = { spells: G.ArenaCore.SPELLS, books: load('data/books.json'), visual: {
 "desc": "샌드박스의 마법 그림 (v0.3, 판에 닿지 않는다): 빛깔 = 원소(WORLD 3-6), 모양 = 종류. 샌드박스(sandbox/sandbox.js)만 읽는다",
 "el": { "불": "#5cc3ff", "번개": "#b58cff", "흙": "#d8ccb2", "물": "#3fd0c4", "얼음": "#b9f27d", "독": "#a58ad8", "빛": "#fff2a8", "신호": "#f29bd0", "없음": "#c8c8c8" },
 "elName": { "불": "불", "번개": "번개", "흙": "흙", "물": "물", "얼음": "얼음", "독": "독", "빛": "빛", "신호": "신호", "없음": "총·포" },
 "burn": "#ff9d4d",
 "stone": "#a08a66",
 "zone": { "fire": ["#ff9d4d", 0.32], "h2s": ["#a58ad8", 0.3, "hatch"], "nh3": ["#a58ad8", 0.3, "hatch"], "acid": ["#a58ad8", 0.32, "hatch"], "spore": ["#a58ad8", 0.28, "hatch"],
   "ice": ["#b9f27d", 0.32], "chill": ["#b9f27d", 0.18], "smoke": ["#d8ccb2", 0.4], "mist": ["#3fd0c4", 0.22], "absorb": ["#3fd0c4", 0.18], "pit": ["#0f0c08", 0.6], "sky": ["#b58cff", 0.14], "saltfog": ["#f2f2ee", 0.42], "calm": ["#ffd84a", 0.12], "rain": ["#6aa8ff", 0.14] },
 "wall": { "earth": "#a08a66", "lime": "#d8ccb2", "ice": "#b9f27d" },
 "proj": { "r0": 2.2, "rk": 2.6, "big": 1.6, "tail": 6, "glow": 9 },
 "thread": { "t": 0.3, "zig": 0.9, "seg": 1.6 },
 "area": { "boom": 0.35 },
 "lob": { "arc": 0.35 },
 "cone": { "t": 0.35 },
 "flash": { "t": 0.18 },
 "beam": { "t": 0.22 },
 "name": { "t": 0.8 },
 "status": { "stun": "#b58cff", "root": "#a08a66", "blind": "#ffffff", "wet": "#3fd0c4", "burn": "#ff9d4d" },
 "kind": {
  "proj": "투사체: 빛나는 공 + 꼬리 (크기 = 무게, 큰 한 방은 더 크게, 유도는 휘는 길)",
  "thread": "실: 시전자~과녁의 지그재그 선이 0.3 s 번쩍",
  "area": "지역: 터지기 전 점선 원(예고) → 채운 원",
  "lob": "곡사: 포물선 + 땅의 그림자 + 떨어질 자리 점선 원",
  "cone": "부채꼴: 손앞의 부채꼴",
  "zone": "구역: 원소 빛깔로 칠한 땅 (독은 빗금, 타는 곳은 주황)",
  "trap": "덫: 보이는 덫 실선 고리, 숨은 덫은 우리 편에게만 점선",
  "buff": "몸 강화: 몸을 감싸는 빛",
  "move": "이동: 지나간 자리의 꼬리",
  "wall": "기둥·담: 재료 빛깔의 기둥",
  "build": "벽 쌓기: 블록, 흙벽은 바깥쪽 구덩이",
  "cage": "가두기: 과녁 둘레 기둥 넷",
  "topple": "벽 밀기: 넘어지는 벽",
  "touch": "손닿기: 닿는 자리의 불꽃",
  "shoot": "요격: 공중에서 터짐",
  "ring": "둘레 불: 퍼지는 고리",
  "flash": "번쩍임: 화면이 하얗게",
  "beam": "열선: 핵이 빛나다 곧은 빛줄기",
  "taunt": "도발: 물결 모양 신호",
  "smother": "덮기: 몸 둘레를 덮는 막",
  "blueprint": "청사진: 여러 칸을 한꺼번에"
 }
}, scenes: {"v2-agile-legend":{"v":"2.37.0","name":"[역사] 대마법사 전설 대 대가: 반사 겹·끊는 움직임·청사진 (청사진 덱, 매 걸음 녹화, 200×150)","seed":4,"width":200,"height":150,"rules":{"profile":"청사진"},"recEvery":1,"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가","deck":"대마법사 청사진"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 8/9)이 이기고 길이(69.87 s)가 가운데값(69.87 s)에 가장 가까운 판"},"v2-chess-legend":{"v":"2.37.0","name":"[역사] 대마법사 수읽기 전설 대 전설: 체크와 메이트 (수읽기 덱, 200×150)","seed":6,"width":200,"height":150,"rules":{"profile":"빠른 판"},"sides":[{"name":"전설 A","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 수읽기"}]},{"name":"전설 B","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 수읽기"}]}],"note":"수읽기(v2.15)를 보는 장면: 큰 한 방(대낙뢰·화산 기둥)과 정석(폭풍의 세 수·바위 감옥)이 든 덱. 대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 5/9)이 이기고 길이(55.0 s)가 가운데값(54.9 s)에 가장 가까운 판"},"v2-fort-legend":{"v":"2.37.0","name":"[역사] 대마법사 전설 대 대가: 날기 끊기와 진지 (진지 덱, 날기 끊기·진지·함정 연쇄, 200×150)","seed":3,"width":200,"height":150,"rules":{"profile":"진지"},"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 진지"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가","deck":"대마법사 진지"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 9/9)이 이기고 길이(67.5 s)가 가운데값(67.5 s)에 가장 가까운 판"},"v2-master-legend":{"v":"2.37.0","name":"[역사] 대마법사 전설 대 대가: 떠보기·들어가기·빠지기, 지형 (운영 덱, 200×150)","seed":5,"width":200,"height":150,"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 운영"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가","deck":"대마법사 운영"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 6/9)이 이기고 길이(54.07 s)가 가운데값(54.07 s)에 가장 가까운 판"},"v2-pace-compare":{"v":"2.37.0","name":"[역사] 나란히: 대마법사 전설 대 전설(빠른 판) · 평범 대 평범, 같은 시간","seed":3,"width":200,"height":150,"rules":{"profile":"빠른 판"},"sides":[{"name":"전설 A","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"전설 B","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]}],"note":"샌드박스는 beside 장면을 오른쪽 칸에 같은 시간만큼 나란히 돌린다(명령줄은 왼쪽 판만). 아래 띠는 지금까지의 평균 속도·방향 전환·하는 일·교환 (v2.14). 씨앗 3: 편 1이 56.7 s에 이긴다","beside":{"name":"평범 대 평범 (합법 최강, 40×30)","seed":3,"width":40,"height":30,"maxT":120,"sides":[{"name":"평범 A","mages":[{"tier":"평범","deck":"합법 최강"}]},{"name":"평범 B","mages":[{"tier":"평범","deck":"합법 최강"}]}]}},"v2-tactics-legend":{"v":"2.37.0","name":"대마법사 결투장 전설 대 전설: 빠른 판·잘게 걷기 (결투 덱, 200×150)","seed":1,"width":200,"height":150,"rules":{"profile":"결투장"},"sides":[{"name":"전설 A","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투"}]},{"name":"전설 B","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 결투"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 1, 5/9)이 이기고 길이(64.0 s)가 가운데값(64.0 s)에 가장 가까운 판"}} };
})(typeof globalThis !== 'undefined' ? globalThis : this);
