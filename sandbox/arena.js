/* 만든 파일: node cli.js pack (sandbox/pack.js). 손으로 고치지 않는다. 기준은 src/, metrics/, data/, sandbox/scenes/ */
(function (G) {
var D = {};
D["data/books.json"] = [function (module, exports, require) {
module.exports = {"불":["불덩이","화염 방사","소이 캡슐","폭굉 추진","불벽","숨 덫"],"번개":["라이트닝","체인","낙뢰","맨손 방전","다리 자극","흘리기 막","번개 지뢰","근육 경직"],"흙":["돌 창","돌 압축탄","곡사 돌","솟는 발판","석회 기둥","석회 방패","흙 꺼짐","석회 굳히기","가두는 기둥"],"물":["물 망치","물 대포","물길 미끄럼","물 장막","흡수 안개","진흙 웅덩이"],"얼음":["얼음 창","저격 창","서리 깔기","얼음 미끄럼","얼음 기둥","얼음 덫","얼음 족쇄"],"독":["황화수소 캡슐","암모니아 캡슐","초산 분사","유도 포자","독 장막","독 웅덩이","균사 그물"]};
}, {}];
D["data/decks.json"] = [function (module, exports, require) {
module.exports = {"합법 최강":["불기둥","비 뿌리기","땅 번개","짧은 실","근육 폭주","불고리","석회 방패","번개 그물","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"],"광역":["낙뢰","번개 그물","체인","불기둥","화염 방사","돌 비","짧은 실","석회 방패","석회 기둥","솟는 발판","근육 폭주","불고리","비 뿌리기","땅 번개"],"기본기":["돌 압축탄","라이트닝","불덩이","물 망치","얼음 창","석회 방패","다리 자극"],"머스킷":["머스킷"],"기술":["짧은 실","체인","번개 그물","흙 손","불기둥","불벽","번개 지뢰","석회 방패","산 안개","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"],"큰 수":["번개 그물","물 대포","빙판","불벽","짧은 실","땅 번개","석회 방패","대낙뢰","화산 기둥","번개 창"],"도발 합법 최강":["도발","불기둥","비 뿌리기","땅 번개","짧은 실","근육 폭주","불고리","석회 방패","번개 그물"]};
}, {}];
D["data/gear.json"] = [function (module, exports, require) {
module.exports = {"default":{"soles":true},"items":{"soles":{"이름":"소금 밑창","설명":"안 보이는 발밑 공격(지연 폭발)의 피해·묶임·굳힘을 × 0.3 (WORLD 148)"},"cloak":{"이름":"소금 망토","설명":"두른 사람 1.6 m 안에서 남의 장악 몫 × 0.3 (WORLD 148)"}}};
}, {}];
D["data/skills.json"] = [function (module, exports, require) {
module.exports = {"roll":{"rollCap":0.85,"rollBias":[0.6,0.9]},"basic":{"readCast":true,"lead":1,"combo":true,"crowd":true,"stance":false,"lever":false,"pathTrap":false,"slotB":false,"terrain":false,"readWave":false,"cdRead":false,"outrange":false,"focusLow":false},"levels":{"초보":{"dec":0.3,"noise":0.14,"autoDodge":false,"circles":"half","from":"basic","tac":{"dodge":0.15,"rest":60,"readCast":false,"lead":0.2,"combo":false,"crowd":false,"castMove":0,"pause":[0.3,0.6],"shieldAny":true}},"중급":{"dec":0.2,"noise":0.08,"autoDodge":false,"circles":"minus1","from":"basic","tac":{"dodge":0.45,"rest":75}},"상급":{"dec":0.13,"noise":0.04,"autoDodge":true,"circles":"same","from":"basic","tac":{"dodge":0.75,"rest":80,"stance":true,"lever":true,"pathTrap":true,"plan":true,"combo2":true,"shieldSave":true,"cancel":true,"cover":true,"tempo":true,"dodgeAim":true}},"대가":{"dec":0.08,"noise":0.02,"autoDodge":true,"circles":"same","from":"basic","tac":{"dodge":1,"rest":80,"stance":true,"lever":true,"pathTrap":true,"plan":true,"combo2":true,"shieldSave":true,"cancel":true,"cover":true,"tempo":true,"coverW":2,"herd":true,"strip":true,"lure":true,"simul":true,"cancel2":true,"bigPlan":true,"dodgeAim":true,"grab":true,"feint":0.08,"focusLow":true,"terrain":true,"slotB":true,"readWave":true,"cdRead":true,"outrange":true}},"전설":{"dec":0.05,"noise":0.01,"autoDodge":true,"circles":"plus1","from":"대가","tac":{"feint":0.12,"learn":true,"waveChoose":true,"counter":true,"coverW":2.5,"bait":true,"fakeRetreat":true,"triple":true}}}};
}, {}];
D["data/spells/order.json"] = [function (module, exports, require) {
module.exports = ["불덩이","화염 방사","소이 캡슐","폭굉 추진","불벽","숨 덫","라이트닝","체인","낙뢰","맨손 방전","다리 자극","흘리기 막","번개 지뢰","돌 창","돌 압축탄","곡사 돌","솟는 발판","석회 기둥","석회 방패","흙 꺼짐","물 망치","물 대포","물길 미끄럼","물 장막","흡수 안개","진흙 웅덩이","얼음 창","저격 창","서리 깔기","얼음 미끄럼","얼음 기둥","얼음 덫","황화수소 캡슐","암모니아 캡슐","초산 분사","유도 포자","독 장막","독 웅덩이","불고리","그을음 연막","갈래 불덩이","불 씨앗","짧은 실","번개 그물","근육 폭주","걸어둔 구름","갈래 돌","흙먼지","흙 손","큰 바위","비 뿌리기","끓는 물","안개 걸음","물 올가미","빙판","얼음 껍질","얼음 산탄","얼음 담","산 안개","마비 포자","포자 벽","독 이끼","불기둥","땅 번개","가시 솟기","발 얼리기","돌 비","공중 격추","흙 이불","얼음 절연","해독 균","바위 박차기","머스킷","도발","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"];
}, {}];
D["data/spells/독.json"] = [function (module, exports, require) {
module.exports = {"황화수소 캡슐":{"n":"황화수소 캡슐","el":"독","t":"proj","m":0.2,"v":14,"R":14,"cost":4,"cast":0.35,"cd":2,"burst":{"zone":{"k":"h2s","shape":"circle","r":1.5,"d":8,"dps":9}},"role":"공격","banned":1},"암모니아 캡슐":{"n":"암모니아 캡슐","el":"독","t":"proj","m":0.2,"v":14,"R":14,"cost":3,"cast":0.35,"cd":1.8,"burst":{"zone":{"k":"nh3","shape":"circle","r":1.6,"d":5,"dps":1}},"role":"공격"},"초산 분사":{"n":"초산 분사","el":"독","t":"cone","L":3,"dur":0.4,"dps":6,"kind":"tox","blind":1.5,"cost":2,"cast":0.15,"cd":1.5,"role":"공격"},"유도 포자":{"n":"유도 포자","el":"독","t":"proj","m":0.05,"v":3.5,"R":30,"life":5,"home":1,"cost":4,"cast":0.3,"cd":4,"hit":{"flat":12,"kind":"tox","cough":2.5},"role":"공격"},"독 장막":{"n":"독 장막","el":"독","t":"zone","z":{"k":"nh3","shape":"line","len":5,"d":6,"dps":1},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"독 웅덩이":{"n":"독 웅덩이","el":"독","t":"trap","tr":{"dmg":3,"zone":{"k":"h2s","shape":"circle","r":1.4,"d":6,"dps":9},"r":1},"vis":0,"cost":4,"cast":0.3,"cd":3,"role":"함정","banned":1},"산 안개":{"n":"산 안개","el":"독","tags":["wall","ranged"],"desc":"눈을 멀게 하고 벽을 녹인다","t":"zone","z":{"k":"acid","shape":"circle","r":2.5,"d":4,"dps":2},"R":8,"cost":4,"cast":0.3,"cd":4,"role":"공격"},"마비 포자":{"n":"마비 포자","el":"독","tags":["kite","close"],"desc":"닿으면 다리가 굳는 포자","t":"proj","m":0.05,"v":5,"R":20,"life":4,"home":1,"cost":4,"cast":0.3,"cd":4,"hit":{"flat":6,"kind":"tox","root":1},"role":"공격"},"포자 벽":{"n":"포자 벽","el":"독","tags":["close"],"desc":"포자 줄. 넘으면 기침","t":"zone","z":{"k":"spore","shape":"line","len":5,"d":6,"dps":3},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"독 이끼":{"n":"독 이끼","el":"독","tags":["miss","close"],"desc":"값싼 독 함정","t":"trap","tr":{"dmg":3,"zone":{"k":"h2s","shape":"circle","r":1.2,"d":5,"dps":8},"r":0.9},"vis":0,"cost":2,"cast":0.2,"cd":1.2,"role":"함정","banned":1},"해독 균":{"n":"해독 균","el":"독","t":"buff","b":{"toxRes":0.5,"d":4},"cost":3,"cast":0.1,"cd":6,"role":"방어","desc":"해독 균막"},"균사 그물":{"n":"균사 그물","el":"독","t":"proj","m":0.1,"v":28,"R":12,"cost":3,"cast":0.3,"cd":3,"hit":{"dmg":4,"kind":"tox","mycel":2},"role":"공격","rule":"bodyBind","desc":"균사를 뭉쳐 던진다. 맞으면 2초 동안 구르지 못하고 × 0.6으로 걷는다. 불에 타면 풀린다","rad":0.4}};
}, {}];
D["data/spells/물.json"] = [function (module, exports, require) {
module.exports = {"물 망치":{"n":"물 망치","el":"물","t":"proj","m":1,"v":26,"R":16,"cost":3,"cast":0.3,"cd":1.2,"hit":{"kind":"blunt","wet":1,"cap":12},"role":"공격"},"물 대포":{"n":"물 대포","el":"물","t":"cone","L":6,"dur":0.5,"dps":6,"kind":"blunt","wet":1,"push":6,"cost":3,"cast":0.2,"cd":1.8,"role":"공격"},"물길 미끄럼":{"n":"물길 미끄럼","el":"물","t":"move","mv":"glide","dist":5,"cost":2,"cast":0.05,"cd":2,"role":"이동"},"물 장막":{"n":"물 장막","el":"물","t":"zone","z":{"k":"mist","shape":"line","len":5,"d":6},"R":4,"cost":2,"cast":0.3,"cd":4,"role":"방어"},"흡수 안개":{"n":"흡수 안개","el":"물","t":"zone","z":{"k":"absorb","shape":"circle","r":2.5,"d":5},"R":6,"cost":4,"cast":0.3,"cd":6,"role":"방어"},"진흙 웅덩이":{"n":"진흙 웅덩이","el":"물","t":"trap","tr":{"dmg":2,"root":1.2,"wet":1,"r":1},"vis":1,"cost":3,"cast":0.25,"cd":2,"role":"함정"},"비 뿌리기":{"n":"비 뿌리기","el":"물","tags":["fire","tox","spore"],"desc":"불을 끄고 독과 포자를 씻어 내리는 비","t":"zone","z":{"k":"rain","shape":"circle","r":3,"d":1},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"끓는 물":{"n":"끓는 물","el":"물","tags":["miss","weak"],"desc":"물을 끓여 쏜다. 적시지 않고 데운다","t":"proj","m":0.8,"v":24,"R":14,"cost":4,"cast":0.35,"cd":1.3,"hit":{"kind":"fire","flat":14,"burn":1.5},"role":"공격"},"안개 걸음":{"n":"안개 걸음","el":"물","tags":["ranged","elec"],"desc":"안개를 두르고 빨라진다","t":"buff","b":{"speed":0.25,"d":3,"smoke":1},"cost":2,"cast":0.1,"cd":4,"role":"이동"},"물 올가미":{"n":"물 올가미","el":"물","tags":["miss","kite"],"desc":"물줄기가 발목을 감는다","t":"area","r":1.2,"delay":0.5,"dmg":3,"root":1.2,"wet":1,"vis":0,"R":8,"cost":3,"cast":0.2,"cd":2.5,"role":"공격"}};
}, {}];
D["data/spells/번개.json"] = [function (module, exports, require) {
module.exports = {"라이트닝":{"n":"라이트닝","el":"번개","t":"thread","E":400,"R":12,"cost":5,"cast":0.3,"cd":1.8,"role":"공격"},"체인":{"n":"체인","el":"번개","t":"thread","E":300,"R":10,"cost":4,"cast":0.25,"cd":1.4,"role":"공격"},"낙뢰":{"n":"낙뢰","el":"번개","t":"area","r":1.6,"delay":1.3,"dmg":30,"kind":"elec","stun":1,"vis":1,"R":18,"cost":7,"cast":0.3,"cd":3,"role":"공격"},"맨손 방전":{"n":"맨손 방전","el":"번개","t":"touch","dmg":25,"stun":0.8,"cost":2,"cast":0.05,"cd":0.9,"role":"공격"},"다리 자극":{"n":"다리 자극","el":"번개","t":"buff","b":{"speed":0.4,"d":1},"cost":2,"cast":0.05,"cd":3,"role":"이동"},"흘리기 막":{"n":"흘리기 막","el":"번개","t":"buff","b":{"elecRes":0.2,"front":1,"d":0.4},"cost":2,"cast":0.03,"cd":1.4,"role":"방어","react":1},"번개 지뢰":{"n":"번개 지뢰","el":"번개","t":"trap","tr":{"dmg":25,"kind":"elec","stun":1,"r":0.9},"vis":0,"cost":4,"cast":0.3,"cd":2,"role":"함정"},"짧은 실":{"n":"짧은 실","el":"번개","tags":["miss","close"],"desc":"가까운 거리에서 실을 두 배로 빨리 뻗는다","t":"thread","E":300,"R":6,"fast":2,"cost":3,"cast":0.15,"cd":1,"role":"공격"},"번개 그물":{"n":"번개 그물","el":"번개","tags":["miss"],"desc":"작은 구름을 반 박자 만에","t":"area","r":1.1,"delay":0.55,"dmg":18,"kind":"elec","stun":0.8,"vis":1,"R":10,"cost":5,"cast":0.2,"cd":2.5,"role":"공격"},"근육 폭주":{"n":"근육 폭주","el":"번개","tags":["ranged","kite"],"desc":"반 초에 75% 빠르게. 붙기 위한 한 걸음","t":"buff","b":{"speed":0.75,"d":0.5},"cost":2,"cast":0.03,"cd":2.5,"role":"이동"},"걸어둔 구름":{"n":"걸어둔 구름","el":"번개","tags":["kite","ranged"],"desc":"3초 뒤 내려칠 큰 구름. 그 자리를 못 쓰게","t":"area","r":2.6,"delay":3,"dmg":26,"kind":"elec","stun":1,"vis":1,"R":16,"cost":7,"cast":0.3,"cd":5,"role":"함정"},"땅 번개":{"n":"땅 번개","el":"번개","t":"area","r":0.9,"delay":0.35,"dmg":18,"kind":"elec","stun":0.6,"vis":0,"R":7,"cost":4,"cast":0.2,"cd":1.8,"role":"공격","desc":"상대 발밑 흙에 전하를 모아 두 발 사이로 흘린다"},"공중 격추":{"n":"공중 격추","el":"번개","t":"shoot","r":6,"cost":3,"cast":0.05,"cd":2,"role":"방어","desc":"날아오는 물·얼음·불·포자를 공중에서 터뜨린다. 돌은 못 떨어뜨린다"},"대낙뢰":{"n":"대낙뢰","el":"번개","t":"area","r":2.2,"delay":0.5,"dmg":60,"kind":"elec","stun":1.2,"vis":1,"R":14,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"하늘 가득 전하를 모아 한 번에 떨어뜨린다. 모으는 동안 맞으면 역류한다"},"번개 창":{"n":"번개 창","el":"번개","t":"thread","E":4000,"R":12,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"실 하나에 모든 전하를 싣는다"},"근육 경직":{"n":"근육 경직","el":"번개","t":"thread","E":120,"R":10,"cramp":2,"cost":3,"cast":0.15,"cd":3,"role":"공격","rule":"bodyBind","desc":"약한 실로 다리 근육을 굳힌다. 2초 동안 구르지 못하고 × 0.5로 걷는다. 절연이 막는다","fast":2}};
}, {}];
D["data/spells/불.json"] = [function (module, exports, require) {
module.exports = {"불덩이":{"n":"불덩이","el":"불","t":"proj","m":0.3,"v":18,"R":16,"cost":4,"cast":0.35,"cd":1.4,"hit":{"dmg":10,"kind":"fire","burn":2.5,"zone":{"k":"fire","r":1,"d":2}},"role":"공격"},"화염 방사":{"n":"화염 방사","el":"불","t":"cone","L":3.6,"dur":1,"dps":22,"kind":"fire","burn":2,"cost":5,"cast":0.2,"cd":2.2,"role":"공격"},"소이 캡슐":{"n":"소이 캡슐","el":"불","t":"proj","m":0.5,"v":14,"R":14,"cost":5,"cast":0.4,"cd":1.8,"burst":{"r":1.4,"dmg":16,"kind":"fire","burn":2},"role":"공격"},"폭굉 추진":{"n":"폭굉 추진","el":"불","t":"move","mv":"dash","dist":5,"self":3,"cost":3,"cast":0.1,"cd":2,"role":"이동"},"불벽":{"n":"불벽","el":"불","t":"zone","z":{"k":"fire","shape":"line","len":4,"d":4,"dps":12},"R":7,"cost":5,"cast":0.35,"cd":3,"role":"방어"},"숨 덫":{"n":"숨 덫","el":"불","t":"trap","tr":{"dmg":18,"kind":"fire","burn":2,"r":1.3},"vis":0,"cost":4,"cast":0.3,"cd":2,"role":"함정"},"불고리":{"n":"불고리","el":"불","tags":["spore","tox","close"],"desc":"몸 둘레 3m를 한순간 태워 날아오는 포자와 독을 없앤다","t":"ring","r":3,"dmg":6,"kill":1,"cost":4,"cast":0.15,"cd":3,"role":"방어"},"그을음 연막":{"n":"그을음 연막","el":"불","tags":["ranged","blunt","elec"],"desc":"덜 탄 연기로 겨냥을 흐린다","t":"zone","z":{"k":"smoke","shape":"circle","r":2.5,"d":5},"R":4,"cost":3,"cast":0.2,"cd":5,"role":"방어"},"갈래 불덩이":{"n":"갈래 불덩이","el":"불","tags":["miss"],"desc":"불덩이를 세 갈래로","t":"proj","m":0.3,"v":18,"R":16,"multi":3,"cost":5,"cast":0.4,"cd":1.6,"hit":{"dmg":5,"kind":"fire","burn":1.5},"role":"공격"},"불 씨앗":{"n":"불 씨앗","el":"불","tags":["miss","close"],"desc":"값싼 불 함정을 여러 개","t":"trap","tr":{"dmg":14,"kind":"fire","burn":2,"r":1.2},"vis":0,"cost":2,"cast":0.2,"cd":1,"role":"함정"},"불기둥":{"n":"불기둥","el":"불","t":"area","r":1.2,"delay":0.45,"dmg":16,"kind":"fire","burn":2,"vis":0,"R":9,"cost":5,"cast":0.25,"cd":2.2,"role":"공격","desc":"상대 발밑에 메탄을 모아 솟구치게 한다. 보이지 않는다"},"화산 기둥":{"n":"화산 기둥","el":"불","t":"area","r":1.5,"delay":0.4,"dmg":55,"kind":"fire","burn":3,"vis":0,"R":9,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"발밑 깊이 메탄과 열을 모아 터뜨린다. 보이지 않는다"}};
}, {}];
D["data/spells/신호.json"] = [function (module, exports, require) {
module.exports = {"도발":{"n":"도발","el":"신호","t":"taunt","R":10,"cost":2,"cast":0.1,"cd":4,"role":"방어","rule":"taunt","desc":"상대의 부름에 헛신호를 섞어 끊는다. 이단은 걸리지 않는다"}};
}, {}];
D["data/spells/얼음.json"] = [function (module, exports, require) {
module.exports = {"얼음 창":{"n":"얼음 창","el":"얼음","t":"proj","m":0.12,"v":25,"R":18,"cost":3,"cast":0.35,"cd":1.4,"hit":{"kind":"blunt","chill":2},"role":"공격"},"저격 창":{"n":"저격 창","el":"얼음","t":"proj","m":0.2,"v":60,"R":30,"cost":6,"cast":1.1,"cd":3,"lock":1,"hit":{"kind":"blunt","flat":35,"stun":0.5},"role":"공격"},"서리 깔기":{"n":"서리 깔기","el":"얼음","t":"zone","z":{"k":"ice","shape":"circle","r":1.8,"d":6,"needWet":1},"R":7,"cost":3,"cast":0.3,"cd":2.5,"role":"공격"},"얼음 미끄럼":{"n":"얼음 미끄럼","el":"얼음","t":"move","mv":"glide","dist":5,"cost":2,"cast":0.05,"cd":2,"role":"이동"},"얼음 기둥":{"n":"얼음 기둥","el":"얼음","t":"wall","hp":35,"dur":10,"r":0.6,"at":1.4,"cost":3,"cast":0.3,"cd":2.5,"role":"방어"},"얼음 덫":{"n":"얼음 덫","el":"얼음","t":"trap","tr":{"dmg":4,"chill":3,"root":1,"r":1},"vis":1,"cost":3,"cast":0.25,"cd":2,"role":"함정"},"빙판":{"n":"빙판","el":"얼음","tags":["close","kite"],"desc":"물 없이 공기의 습기로 바닥을 얼린다","t":"zone","z":{"k":"ice","shape":"circle","r":2.5,"d":6},"R":7,"cost":4,"cast":0.3,"cd":4,"role":"함정"},"얼음 껍질":{"n":"얼음 껍질","el":"얼음","tags":["blunt"],"desc":"몸을 얼음으로 덮는다","t":"buff","b":{"bluntRes":0.5,"d":2.5},"cost":3,"cast":0.1,"cd":5,"role":"방어"},"얼음 산탄":{"n":"얼음 산탄","el":"얼음","tags":["miss"],"desc":"얼음 조각 네 갈래","t":"proj","m":0.05,"v":30,"R":10,"multi":4,"cost":3,"cast":0.3,"cd":1,"hit":{"kind":"blunt","chill":1},"role":"공격"},"얼음 담":{"n":3,"el":"얼음","tags":["ranged","elec"],"desc":"기둥 셋을 잇는 담","t":"wall","hp":40,"dur":10,"r":0.6,"at":1.4,"cost":5,"cast":0.4,"cd":4,"role":"방어"},"발 얼리기":{"n":"발 얼리기","el":"얼음","t":"area","r":1,"delay":0.5,"dmg":4,"kind":"blunt","root":1.4,"chill":2,"vis":0,"R":9,"cost":3,"cast":0.2,"cd":2,"role":"공격","desc":"발밑 습기를 얼려 신발을 땅에 붙인다"},"얼음 절연":{"n":"얼음 절연","el":"얼음","t":"buff","b":{"elecRes":0.3,"d":2.5},"cost":3,"cast":0.1,"cd":5,"role":"방어","desc":"몸을 맑은 얼음으로 덮어 번개를 막는다"},"얼음 족쇄":{"n":"얼음 족쇄","el":"얼음","t":"proj","m":0.1,"v":22,"R":12,"cost":4,"cast":0.3,"cd":4,"hit":{"dmg":4,"kind":"blunt","fetter":1.5},"role":"공격","rule":"bodyBind","desc":"젖은 발목의 물을 얼려 1.5초 묶는다. 마른 적에겐 듣지 않고, 불에 녹는다"}};
}, {}];
D["data/spells/없음.json"] = [function (module, exports, require) {
module.exports = {"머스킷":{"n":"머스킷","el":"없음","t":"proj","m":0.03,"v":300,"R":60,"cost":0,"cast":0.6,"cd":18,"mundane":1,"hit":{"kind":"blunt","flat":60,"stun":0.4},"role":"공격","desc":"마법이 아닌 총. 장악권이 못 막는다"}};
}, {}];
D["data/spells/흙.json"] = [function (module, exports, require) {
module.exports = {"돌 창":{"n":"돌 창","el":"흙","t":"proj","m":0.15,"v":28,"R":20,"cost":3,"cast":0.3,"cd":1.2,"hit":{"kind":"blunt"},"role":"공격"},"돌 압축탄":{"n":"돌 압축탄","el":"흙","t":"proj","m":0.06,"v":30,"R":24,"cost":1,"cast":0.25,"cd":0.7,"hit":{"kind":"blunt"},"role":"공격"},"곡사 돌":{"n":"곡사 돌","el":"흙","t":"lob","flight":1.2,"r":1,"dmg":20,"kind":"blunt","R":26,"cost":3,"cast":0.35,"cd":1.2,"role":"공격"},"솟는 발판":{"n":"솟는 발판","el":"흙","t":"move","mv":"vault","dist":4,"cost":3,"cast":0.12,"cd":2.5,"role":"이동"},"석회 기둥":{"n":"석회 기둥","el":"흙","t":"wall","hp":60,"dur":20,"r":0.7,"at":1.4,"cost":5,"cast":0.4,"cd":3,"role":"방어"},"석회 방패":{"n":"석회 방패","el":"흙","t":"buff","b":{"front":1,"block":1,"d":1.6},"cost":2,"cast":0.1,"cd":0.8,"role":"방어","react":1},"흙 꺼짐":{"n":"흙 꺼짐","el":"흙","t":"trap","tr":{"dmg":8,"kind":"blunt","root":1.8,"r":1},"vis":1,"cost":3,"cast":0.35,"cd":2.5,"role":"함정"},"갈래 돌":{"n":"갈래 돌","el":"흙","tags":["miss"],"desc":"다섯 갈래 돌","t":"proj","m":0.06,"v":40,"R":9,"multi":5,"cost":3,"cast":0.3,"cd":1,"hit":{"kind":"blunt"},"role":"공격"},"흙먼지":{"n":"흙먼지","el":"흙","tags":["ranged","elec"],"desc":"먼지로 겨냥을 흐린다","t":"zone","z":{"k":"smoke","shape":"circle","r":2.5,"d":5},"R":4,"cost":2,"cast":0.2,"cd":5,"role":"방어"},"흙 손":{"n":"흙 손","el":"흙","tags":["miss","kite"],"desc":"상대 발밑 흙이 발목을 움켜쥔다","t":"area","r":1.2,"delay":0.6,"dmg":6,"kind":"blunt","root":1.6,"vis":0,"R":10,"cost":4,"cast":0.25,"cd":2.5,"role":"공격"},"큰 바위":{"n":"큰 바위","el":"흙","tags":["wall","ranged"],"desc":"20kg 바위","t":"proj","m":20,"v":22,"R":26,"cost":12,"cast":2.2,"cd":3,"hit":{"kind":"blunt","flat":70,"stun":1},"rad":0.7,"role":"공격"},"가시 솟기":{"n":"가시 솟기","el":"흙","t":"area","r":1,"delay":0.45,"dmg":12,"kind":"blunt","root":1.2,"vis":0,"R":9,"cost":4,"cast":0.25,"cd":2,"role":"공격","desc":"상대 발밑 흙을 가시로 솟게 한다"},"돌 비":{"n":"돌 비","el":"흙","t":"lob","flight":0.9,"r":1.6,"dmg":14,"kind":"blunt","R":20,"cost":4,"cast":0.3,"cd":1.4,"role":"공격","desc":"작은 돌을 높이 흩뿌려 떨어뜨린다"},"흙 이불":{"n":"흙 이불","el":"흙","t":"smother","r":3,"cost":3,"cast":0.15,"cd":3,"role":"방어","desc":"둘레에 흙을 덮어 불과 독과 포자를 끈다"},"바위 박차기":{"n":"바위 박차기","el":"흙","t":"move","mv":"dash","dist":4,"cost":2,"cast":0.05,"cd":2,"role":"이동","desc":"바위를 차고 반동으로 튄다"},"석회 굳히기":{"n":"석회 굳히기","el":"흙","t":"proj","m":0.2,"v":26,"R":12,"cost":3,"cast":0.3,"cd":3,"hit":{"dmg":5,"kind":"blunt","lime":3},"role":"공격","rule":"bodyBind","desc":"석회 반죽을 다리에 붙인다. 3초 동안 구르는 거리가 절반. 산에 녹는다","rad":0.25},"가두는 기둥":{"n":"가두는 기둥","el":"흙","t":"cage","r":3,"pr":1.4,"hp":120,"dur":2.5,"R":10,"cost":6,"cast":0.35,"cd":6,"role":"공격","rule":"bodyBind","desc":"상대 둘레 3m에 석회 기둥 넷을 한꺼번에 세운다. 솟는 발판으로 넘을 수 있다"}};
}, {}];
D["data/tiers.json"] = [function (module, exports, require) {
module.exports = {"병사":{"C":0.3,"circles":1,"noise":0.12,"dec":0.3,"autoDodge":false,"mast":0,"tac":{"dodge":0.2}},"평범":{"C":1,"circles":1,"noise":0.08,"dec":0.2,"autoDodge":false,"mast":0.3,"tac":{"dodge":0.4}},"중간":{"C":2.5,"circles":3,"noise":0.05,"dec":0.15,"autoDodge":false,"mast":0.6,"tac":{"dodge":0.6}},"상위":{"C":5,"circles":5,"noise":0.03,"dec":0.12,"autoDodge":true,"mast":0.8,"tac":{"dodge":0.8}},"대마법사":{"C":10,"circles":10,"noise":0.02,"dec":0.1,"autoDodge":true,"mast":1,"tac":{"dodge":1,"focusLow":true}}};
}, {}];
D["metrics/look.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 행동 지표 (싸우는 모습, 1.7.0, SPEC 13장)
 * 판이 끝난 사람의 기록(m.log)에서 싸우는 모습을 잰다. t = 그 사람이 싸운 시간 (s). 표준 시험 묶음(suite)의 모습 줄이 이것을 쓴다.
 * 엔진은 기록만 남기고, 지표를 셈하는 건 여기다. 새 지표는 여기에 더한다(엔진의 기록 칸은 addMage의 log 리터럴에) */
function look(m, t) {
  const st = m.log.starts, iv = []; for (let i = 1; i < st.length; i++) iv.push(st[i] - st[i - 1]);
  const mean = iv.length ? iv.reduce((a, b) => a + b, 0) / iv.length : 0, sd = iv.length > 1 ? Math.sqrt(iv.reduce((a, b) => a + (b - mean) ** 2, 0) / (iv.length - 1)) : 0;
  const L = m.log, per = x => x / Math.max(t, 1) * 60;
  return {
    '분당 시전': per(st.length), '빈틈 (s)': L.gaps.length ? L.gaps.slice().sort((a, b) => a - b)[L.gaps.length >> 1] : 0, '박자 흔들림': mean ? sd / mean : 0,
    '분당 콤보': per(L.comboTry), '콤보 성공률': L.comboTry ? L.comboHit / L.comboTry : 0, '분당 동시 시전': per(L.dec.slotB),
    '분당 캔슬': per(L.cancel || 0), '분당 속임수': per(L.dec.feint || 0), '엄폐 시간 비율': t ? (L.coverT || 0) / t : 0,
    '분당 유도 성공': per(L.lure || 0), '분당 동시 착탄': per(L.simul || 0), '방어 적중률': L.defTry ? (L.defHit || 0) / L.defTry : 0,
  };
}
module.exports = { look };
}, {}];
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
  combo.drop(W, m, K);           // 묶기가 빗나갔다: 계획을 버린다
  feint.react(W, m, K);          // 속임수 (전설)

  // ---- 칸 고르기 ----
  let slot = 'A';
  if (m.cast || m.chan) { if (circ >= 2 && !m.castB && T.slotB) slot = 'B'; else return; }   // 두 번째 칸은 대가부터 (기본은 씀)
  if (empty) slot = 'B';
  K.slot = slot;

  // ---- 휴식: 머리가 뜨거우면 위협이 없을 때 쉰다. 규칙이 고친다(파도의 부류, rules/wave) ----
  // 방어 간격 세기 (대가): 과녁의 방어 마법이 모두 간격 중이면(자동 진도) 칠 때다. 쉬지 않고, 공격 가치 × 1.4
  const defDown = T.cdRead && defenseDown(e, S, W);
  let restNow = W.rules.fatigue && m.fat > rest && !aimed && d > 4 && !defDown;
  h = bh.rest; for (let i = 0; i < h.length; i++) restNow = h[i](W, m, K, restNow);
  if (restNow) { m.log.dec.rest++; m.relT = null; return; }

  if (tempo.pause(W, m)) return;       // 쏜 뒤 멈춤 (초보)
  if (simul.wait(W, m, K)) return;     // 동시 착탄 (대가): 묶기가 결정타 직전에 떨어지게 기다린다
  if (tempo.hold(W, m, K)) return;     // 박자 흔들기 (상급)
  K.defDown = defDown; K.plan = combo.planOf(W, m, K);   // 두 수 콤보 계획 (상급)
  // ---- 마법 고르기 ----
  K.lead = T.lead; K.cb = T.combo; K.down0 = K.cb && eDown;
  K.ek = T.counter ? De.kinds : NOKIND;
  learn.prep(W, m, K);
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
      if (W.traps.filter(t => t.src === m).length < 3) { v = 0.15 + T.trapBias; if (T.pathTrap && K.vt > 1.2 && d < 10) { v += 0.35; tx = e.x + e.vx; ty = e.y + e.vy; } else { tx = m.x + K.ux * 2; ty = m.y + K.uy * 2; } }
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
  return P;
}
// 마법 하나의 값. 쓸 만하면 후보에 넣는다
function valueSpell(W, m, K, bi) {
  const { T, e, Dm, d, slot } = K, bh = W._bh;   // 드물게 쓰는 값은 쓸 때 K에서 읽는다
  const n = Dm.nm[bi], s = Dm.sp[bi], mastN = Dm.mast[bi], isOff = Dm.off[bi];
  if (slot === 'B' && (s.t === 'cone' || s.t === 'move' || (m.cast && m.cast.s.n === n))) return;
  if ((m.cd[n] || 0) > 0) return;
  const cost = s.cost * (1 - 0.25 * mastN) * (slot === 'B' ? 1.3 : 1); if (m.glu < cost) return;
  const Tw = s.cast * (1 - 0.35 * mastN);
  const o = K.o;
  o.s = s; o.n = n; o.bi = bi; o.isOff = isOff; o.cost = cost; o.he = Dm.he[bi]; o.Tw = Tw; o.R = Dm.R[bi]; o.v = 0; o.tx = e.x; o.ty = e.y; o.barrel = false; o.pin = false;
  // 콤보의 때 (상급): 남은 묶임 안에 닿는 마법만 묶인 적 보정을 받는다. 중급은 보이는 대로 잇는다
  o.down = K.down0 && (!T.combo2 || Math.max(e.st.root || 0, e.st.stun || 0) > Tw + landDelay(s, d));
  valueForm(W, m, K, o);
  const P = K.pipe || (K.pipe = pipeOf(W, m)); for (let i = 0; i < P.length; i++) P[i](W, m, K, o);   // 값 고치기: 규칙의 훅과 켜진 기술 (pipeOf의 차례)
  // 지연 폭발은 쏜 사람도 맞힌다: 떨어질 자리가 내 둘레면 쓰지 않는다 (v1.0.1)
  if (s.t === 'area' && hyp(o.tx - m.x, o.ty - m.y) < s.r * C.sizeOf(m, s) + SELF_GAP) return;
  if (W.rules.fatigue && !s.react && !m.wave) o.v -= m.fat / 100 * 0.5;
  const h = bh.valueLate; for (let i = 0; i < h.length; i++) h[i](W, m, K, o);        // 파도 위에선 막기보다 친다 (rules/wave)
  if (slot === 'B') o.v -= 0.1;
  if (isOff) o.v *= K.aggr * (K.defDown ? 1.4 : 1);
  const v = o.v;
  if (v > 0.15) { const tx = o.tx, ty = o.ty, barrel = o.barrel, down = o.down, pin = o.pin; let c = K.pool[K.cand.length]; if (!c) c = K.pool[K.cand.length] = { s, n, v, tx, ty, Tw, cost, barrel, down, pin, v2: undefined }; else { c.s = s; c.n = n; c.v = v; c.tx = tx; c.ty = ty; c.Tw = Tw; c.cost = cost; c.barrel = barrel; c.down = down; c.pin = pin; c.v2 = undefined; } K.cand.push(c); }
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
  if (!best || best.v2 <= 0.15) { m.relT = null; return; }
  if (slot === 'B' && T.plan && best.v2 < 1) return;   // 기술이 있는 사람은 두 번째 칸을 값진 수에만 쓴다
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
  const plan = K.plan, cast = { s, tgt: e, tx: best.tx + W.rnd(-ns, ns), ty: best.ty + W.rnd(-ns, ns), t: 0, T: Tc, B: slot === 'B', feint: fe, cost: best.cost, bait: m.baitT === W.t, roll0: e.roll > 0, down: !!(best.down || best.pin), fin: plan && s.n === plan.fin ? plan.land + 0.1 : 0 };
  if (slot === 'B') m.castB = cast; else m.cast = cast;
  // 행동 지표: 시작 시각, 빈틈, 콤보 시도
  m.log.starts.push(W.t); if (m.relT != null) { if (slot === 'A') { m.log.gapSum += W.t - m.relT; m.log.gapN++; if (m.log.gaps.length < 400) m.log.gaps.push(W.t - m.relT); } m.relT = null; }
  combo.tried(W, m, K, best, Tc);
  const h = W._bh.commit; for (let i = 0; i < h.length; i++) h[i](W, m, K, best, cast, Tc);   // 붙잡기 시도 (rules/control), 붙잡기·짝 묶기 (rules/risk)
  simul.fired(W, m, K, s, Tc);
  herd.commit(W, m, K, s);
  combo.plan(W, m, K, s, Tc);
  logDec(m, s, slot, { aimed, combo: eDown || (m.last && W.t - m.lastT < 1.5 && isSetup(K.S[m.last])), path: s.t === 'trap' && vt > 1.2 && d < 10, barrel: best.barrel });
  m.last = s.n; m.lastT = W.t;
}
module.exports = { decide, valueSpell, commit };
}, {"./util":"src/brain/util.js","./hooks":"src/brain/hooks.js","./techniques/combo":"src/brain/techniques/combo.js","./techniques/cancel":"src/brain/techniques/cancel.js","./techniques/feint":"src/brain/techniques/feint.js","./techniques/simul":"src/brain/techniques/simul.js","./techniques/tempo":"src/brain/techniques/tempo.js","./techniques/bait":"src/brain/techniques/bait.js","./techniques/learn":"src/brain/techniques/learn.js","./techniques/counter":"src/brain/techniques/counter.js","./techniques/cover":"src/brain/techniques/cover.js","./techniques/herd":"src/brain/techniques/herd.js","./techniques/crowd":"src/brain/techniques/crowd.js"}];
D["src/brain/hooks.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 훅 모으기 (brain/hooks, SPEC 22장)
 * 세계의 켜진 규칙 모듈(W.mods)에서 두뇌 훅만 차례대로 모아 W._bh에 둔다(세계마다 한 번, 첫 판단 때). 꺼진 규칙은 비용 0.
 * 규칙의 새 틀(taunt…)의 값은 brainTypes. 틀은 스위치와 상관없이 늘 붙는다 */
const R = require('../rules'), U = require('./util');
const BRN = new Map(), BT = {}; let btVer = -1;
// 훅 모음: 이름마다 배열 하나 (리터럴이라 모양이 늘 같다). 이름은 rules/index.js의 BRAIN_HOOKS
function emptyBH() { return { aim: [], read: [], hideCast: [], steer: [], avoid: [], empty: [], circles: [], react: [], cancel: [], rest: [], prep: [], value: [], valueRisk: [], valueMid: [], valueLate: [], commit: [], castTime: [] }; }
function brainOf(r) {
  let b = BRN.get(r); if (b) return b;
  b = r.brain(U); const ok = emptyBH(); for (const k in b) if (!(k in ok)) throw new Error(r.name + ': 없는 두뇌 훅 ' + k + ' (' + R.BRAIN_HOOKS.join(', ') + ')');
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
}, {"../rules":"src/rules/index.js","./util":"src/brain/util.js"}];
D["src/brain/index.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 기본 두뇌 v1.12.0
 * 판단 순서: 읽기(read) → 입장(stance) → 움직임(move) → 고르기(choose: 자동 진 → 칸 → 휴식 → 마법 고르기)
 * 기술(콤보·속임수·엄폐·유도·학습·덱 읽기·붙잡기…)은 techniques/에 하나씩, 어느 단계가 어떤 기술을 켜는지는 skills.js(data/skills.json).
 * 규칙(스위치)에 딸린 판단은 그 규칙 파일(src/rules/)의 brain 훅에 있다. 세계마다 켜진 규칙의 훅만 모은다(hooks.js).
 * 새 두뇌를 만들 땐 think(W, m) 하나만 같은 모양으로 내보내면 된다. 등록은 Arena.register.brain
 * ========================================================================= */
const U = require('./util'), { hooks } = require('./hooks');
const { aimAt, readThreats } = require('./read'), { chooseStance } = require('./stance'), { steer } = require('./move'), { decide } = require('./choose');

// 판단은 차례대로 여러 조각으로 나눠 둔다 (속도, 1.11.1): 한 덩어리(400줄)는 최적화 컴파일이 판보다 오래 걸려 짧은 실행 내내 느린 코드로 돌았다.
// 조각 사이에 오가는 값은 사람마다 하나 둔 K에 담는다(새로 만들지 않는다). 후보 하나의 값은 K.o에
function newO() { return { s: null, n: null, bi: 0, isOff: null, cost: 0, he: 0, Tw: 0, R: 0, v: 0, tx: 0, ty: 0, barrel: false, pin: false, down: false }; }
function newK() { return { foes: null, S: null, T: null, prefR: null, aggr: null, dodgeK: null, rest: null, e: null, mem: null, wantMem: false, Dm: null, De: null, d: null, ux: null, uy: null, los: null, vt: null, eDown: null, dodge: null, aimed: null, threat: null, late: null, blindR: null, stance: null, escape: null, vx: 0, vy: 0, empty: null, circ: null, bigThreat: null, slot: null, defDown: null, sim: null, plan: null, lead: null, cb: null, down0: null, ek: null, roll: null, shieldNear: null, bigs: null, ctOf: null, pinNow: null, holds: null, pinBy: null, cand: null, pool: null, best: null, pipe: null, o: newO() }; }   // 리터럴로 만들어야 빠른 모양이 된다
function think(W, m) {
  if (!W._bh) hooks(W);
  const K = m._k || (m._k = newK());
  if (!aimAt(W, m, K)) return;
  readThreats(W, m, K); chooseStance(W, m, K); steer(W, m, K);
  if (m.st.stun > 0) return;
  decide(W, m, K);
}

module.exports = { think, catOf: U.catOf, FORMNAME: U.FORMNAME, rollSide: U.rollSide, VERSION: '1.12.0' };
}, {"./util":"src/brain/util.js","./hooks":"src/brain/hooks.js","./read":"src/brain/read.js","./stance":"src/brain/stance.js","./move":"src/brain/move.js","./choose":"src/brain/choose.js"}];
D["src/brain/move.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 3: 움직임
 * 입장대로 걷는다(돌파·거리 두기·선호 거리와 옆걸음). 기술(엄폐·자리·유도)이 더하고, 규칙의 훅(소금 원 steer, 화약통 avoid)이 고친다.
 * 피하기가 이기고, 알아챈 함정과 내 지연 폭발은 늘 비킨다. 걸음 방향은 K.vx·K.vy를 거쳐 기술·훅이 함께 고친다 */
const { hyp } = require('./util');
const cover = require('./techniques/cover'), position = require('./techniques/position'), lure = require('./techniques/lure');
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
  const hs = W._bh.steer; for (let i = 0; i < hs.length; i++) hs[i](W, m, K);   // 소금 원: 선 가까이 오면 가운데로 (rules/saltRing)
  vx = K.vx; vy = K.vy;
  if (dodge && stance !== 'breakout') { const l = hyp(dodge.x, dodge.y) || 1; vx = dodge.x / l * 2; vy = dodge.y / l * 2; }
  for (const t of W.traps) if (t.src.side !== m.side && t.seen.has(m.id) && hyp(t.x - m.x, t.y - m.y) < t.r + 1.2) { const l = hyp(m.x - t.x, m.y - t.y) || 1; vx += (m.x - t.x) / l * 1.5; vy += (m.y - t.y) / l * 1.5; }
  K.vx = vx; K.vy = vy; const ha = W._bh.avoid; for (let i = 0; i < ha.length; i++) ha[i](W, m, K);   // 화약통 곁을 비킨다 (rules/barrels)
  vx = K.vx; vy = K.vy;
  // 내가 떨어뜨린 지연 폭발 안으로 걸어 들어가지 않는다. 돌파 중에도 (v1.0.1)
  for (const a of W.areas) if (a.src === m && hyp(a.x - m.x, a.y - m.y) < a.r + 1) { const l = hyp(m.x - a.x, m.y - a.y) || 1; vx = (m.x - a.x) / l * 2.5; vy = (m.y - a.y) / l * 2.5; }
  m.mv.x = vx; m.mv.y = vy;
}
module.exports = { steer };
}, {"./util":"src/brain/util.js","./techniques/cover":"src/brain/techniques/cover.js","./techniques/position":"src/brain/techniques/position.js","./techniques/lure":"src/brain/techniques/lure.js"}];
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
  const d = hyp(e.x - m.x, e.y - m.y) || 0.01, ux = (e.x - m.x) / d, uy = (e.y - m.y) / d;
  const los = !C.blocked(W, m.x, m.y, e.x, e.y);
  if (m.thinkAt != null && !m.losWas) m.log.coverT += W.t - m.thinkAt; m.thinkAt = W.t; m.losWas = los;   // 엄폐 시간: 과녁과 사이가 막혀 있던 시간
  K.d = d; K.ux = ux; K.uy = uy; K.los = los;
  K.vt = (e.vx * -ux + e.vy * -uy);           // 적이 나에게 다가오는 속도 (m/s)
  K.eDown = e.st.stun > 0 || e.st.root > 0;
  return true;
}
// 규칙이 이 예비동작을 숨기는가 (이단, rules/wave)
function hidden(h, W, q, c) { for (let i = 0; i < h.length; i++) if (h[i](W, q, c)) return true; return false; }
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
    if (hc.length && hidden(hc, W, q, c)) continue;
    const r = c.s.t === 'area' ? c.s.r * C.sizeOf(q, c.s) + 0.4 : 0.8;
    if (blindR) { if (hyp(c.tx - m.x, c.ty - m.y) < r && c.T - c.t < 0.2) { late = c; late.by = q; } continue; }
    if (hyp(c.tx - m.x, c.ty - m.y) < r) { aimed = true; threat = c; threat.by = q; if (c.T - c.t < 0.5) dodge = dodge || { x: -uy, y: ux, perp: 1 }; }
  }
  for (const a of W.areas) if ((a.src.side !== m.side && a.vis && T.readCast && !blindR || a.src === m) && hyp(a.x - m.x, a.y - m.y) < a.r + 0.5) dodge = { x: m.x - a.x || 0.1, y: m.y - a.y || 0.1 };
  if (T.readCast) for (const z of W.zones) if (z.src.side !== m.side && (z.k === 'fire' || z.k === 'h2s' || z.k === 'nh3' || z.k === 'acid' || z.k === 'spore' || z.k === 'ice') && C.inZone(z, m.x, m.y)) dodge = { x: m.x - z.x || 0.1, y: m.y - z.y || 0.1 };
  // 옆으로 피할 땐 버릇대로 쪽을 고른다 (1.6.0). 버릇이 없으면 늘 왼쪽(1.5.0까지)
  if (dodge && dodge.perp && m.rollPref && (W.rng() < m.rollPref ? m.rollSide : -m.rollSide) < 0) { dodge.x = -dodge.x; dodge.y = -dodge.y; }
  // 굳거나 묶이면 구르지 못한다 (1.7.0 버그 수정, SPEC 9장). 균사·경직도 (1.11.0)
  if (dodge && m.rollCd <= 0 && m.stam > 1.5 && !(m.st.stun > 0 || m.st.root > 0 || m.st.mycel > 0 || m.st.cramp > 0) && W.rng() < Math.min(T.rollCap, 0.4 + dodgeK * 0.4 + (m.autoDodge ? 0.3 : 0))) {
    const l = hyp(dodge.x, dodge.y) || 1; let mine = false; for (const a of W.areas) if (a.src === m && hyp(m.x + dodge.x / l * 2 - a.x, m.y + dodge.y / l * 2 - a.y) < a.r + 0.5) { mine = true; break; }
    if (mine) { dodge.x = -dodge.x; dodge.y = -dodge.y; }   // 내 폭발 쪽으로는 구르지 않는다
    const rv = m.st.lime > 0 ? 4 : 8; m.vx = dodge.x / l * rv; m.vy = dodge.y / l * rv; m.roll = 0.25; m.rollCd = m.autoDodge ? 0.6 : 0.8; m.stam -= 1.5;   // 석회가 붙으면 구르는 거리 절반
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
const TECH = { combo: 'combo', combo2: 'combo', plan: 'combo', cancel: 'cancel', cancel2: 'cancel', feint: 'feint', simul: 'simul', triple: 'simul', pause: 'tempo', tempo: 'tempo', bait: 'bait', learn: 'learn', counter: 'counter', cover: 'cover', strip: 'cover', outrange: 'position', terrain: 'position', lure: 'lure', fakeRetreat: 'lure', herd: 'herd', crowd: 'crowd', dodgeAim: 'dodgeAim', grab: 'grab' };
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
  if (K.T.cancel2 && m.cast && !m.cast.feint && !m.cast.down && OFF[m.cast.s.t] && K.eDown && m.cast.T - m.cast.t > 0.1 && !(m.simul && m.simul.a === m.cast.s.n)) undo(m, m.cast);
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
 * 엄폐: 과녁에서 보아 바위 뒤, 내 사거리 안의 자리로 간다. 걷어내기: 과녁이 바위 뒤에 숨었으면 불·산 지대를 그 자리에, 지연 폭발·곡사를 더 쓴다 */
const { hyp, maxRange } = require('../util');
// 움직임: 엄폐로 가는가
function steer(W, m, K) {
  const { T, los, e, S } = K;
  if (!(T.cover && los)) return false;
  let best = null, bd2 = 6;
  for (const o of W.obs) { const ox = o.x - e.x, oy = o.y - e.y, ol = hyp(ox, oy) || 1, px = o.x + ox / ol * (o.r + 0.7), py = o.y + oy / ol * (o.r + 0.7), de = hyp(px - e.x, py - e.y), dm = hyp(px - m.x, py - m.y); if (dm < bd2 && de > 3 && de < maxRange(m, S) && px > 1 && py > 1 && px < W.width - 1 && py < W.height - 1) { bd2 = dm; best = [px, py]; } }
  if (!best) return false;
  const l = hyp(best[0] - m.x, best[1] - m.y) || 1; K.vx += (best[0] - m.x) / l * T.coverW; K.vy += (best[1] - m.y) / l * T.coverW;
  return true;
}
function strip(W, m, K, o) {
  const e = K.e, s = o.s;
  if (K.T.strip && !K.los && W.obs.some(b => hyp(b.x - e.x, b.y - e.y) < b.r + 1.5)) { if (s.t === 'zone' && (s.z.k === 'fire' || s.z.k === 'acid')) { o.v = Math.max(o.v, 0.9); o.tx = e.x; o.ty = e.y; } else if (s.t === 'area' || s.t === 'lob') o.v *= 1.5; }
}
module.exports = { steer, strip };
}, {"../util":"src/brain/util.js"}];
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
  if (K.roll && (s.t === 'proj' || s.t === 'thread')) { o.tx += -K.uy * K.roll; o.ty += K.ux * K.roll; }
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
D["src/brain/techniques/position.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 자리 (대가)
 * 사거리 밖(tac.outrange): 내 사거리가 더 길면 상대 덱의 최대 사거리 바로 밖에 선다.
 * 자리 판단(tac.terrain): 내 장악권이 짙은 땅 쪽으로 기운다. 엄폐 중이거나 엄폐로 가는 중이면 따르지 않는다 */
const { DIR8, ownShare } = require('../util');
function outrange(W, m, K) { if (K.T.outrange) { const eR = K.De.maxR, mR = K.Dm.maxR; if (mR > eR + 1) K.prefR = Math.min(eR + 1, mR - 0.5); } }
function terrain(W, m, K, covering) {
  if (!(K.T.terrain && W.rules.domain && !covering && K.los)) return;
  const foes = K.foes, f0 = ownShare(W, m, foes, m.x, m.y); let bx = 0, by = 0, bf = f0;
  for (let k = 0; k < 8; k++) { const px = m.x + DIR8[k][0] * 2, py = m.y + DIR8[k][1] * 2; if (px < 1 || py < 1 || px > W.width - 1 || py > W.height - 1) continue; const f = ownShare(W, m, foes, px, py); if (f > bf) { bf = f; bx = DIR8[k][0]; by = DIR8[k][1]; } }
  const k2 = Math.min(1.2, (bf - f0) * 6); K.vx += bx * k2; K.vy += by * k2;
}
module.exports = { outrange, terrain };
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
D["src/brain/techniques/tempo.js"] = [function (module, exports, require) {
'use strict';
/* 기술: 박자 (초보 tac.pause, 상급 tac.tempo)
 * 쏜 뒤 멈춤(초보): 쏘고 나서 정해진 시간(사람마다 한 번 정한 박자) 동안 다음을 고르지 않는다.
 * 박자 흔들기(상급): 가끔 한 박 쉬었다 쏜다 (빈틈으로 세지 않는다) */
function pause(W, m) { return !!(m.pauseLen && W.t - m.lastRel < m.pauseLen); }
function hold(W, m, K) {
  if (m.hold) { if (W.t < m.hold) return true; m.hold = 0; }
  else if (K.T.tempo && K.slot === 'A' && !K.aimed && W.rng() < 0.2) { m.hold = W.t + W.rnd(0.1, 0.35); m.relT = null; return true; }
  return false;
}
module.exports = { pause, hold };
}, {}];
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
function logDec(m, s, slot, ctx) {
  const L = m.log.dec; L.n++;
  const c = catOf(s); L.cat[c] = (L.cat[c] || 0) + 1; const f = FORMNAME[s.t]; L.form[f] = (L.form[f] || 0) + 1;
  if (c === '방어') { L.def++; if (ctx.aimed) L.react++; }
  if (c === '공격') { L.atk++; if (ctx.combo) L.combo++; }
  if (c === '함정') { L.trap++; if (ctx.path) L.trapPath++; }
  if (ctx.barrel) L.barrel++; if (slot === 'B') L.slotB++; if (slot === 'auto') L.auto++;
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

// 쓰는 서클 수: 서클 규칙(rules/multiSlot)이 꺼지면 누구나 1
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
  for (let j = 0; j < 2; j++) { const c = j ? e.castB : e.cast; if (c && OFF[c.s.t] && !c.s.big) t = Math.min(t, c.T - c.t + landDelay(c.s, d)); }
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
  const D = { S, maxR: 0, offMax: 0, def: [], front: [], kinds: {}, mund: false, threadTouch: false, fireThread: false, bluntHit: false, bigs: [], nm: [], sp: [], mast: [], he: [], off: [], R: [] };
  for (const n of m.book) {
    const s = S[n]; if (!s) continue;
    D.nm.push(n); D.sp.push(s); D.mast.push(m.mast[n] || 0); D.he.push(m.hitEst[n] ?? 0.35); D.off.push(OFF[s.t]); D.R.push(C.rangeOf(m, s));   // 후보 고르기가 이름으로 찾지 않게
    if (OFF[s.t]) { D.maxR = Math.max(D.maxR, s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : C.rangeOf(m, s)); D.offMax = Math.max(D.offMax, estDmg(s)); }
    if ((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot') D.def.push(n);
    if (s.b && s.b.front) D.front.push(n);
    const kd = kindOf(s); if (kd) D.kinds[kd] = 1;
    if (s.mundane) D.mund = true; if (s.t === 'thread' || s.t === 'touch') D.threadTouch = true; if (s.kind === 'fire' || s.t === 'thread') D.fireThread = true;
    if (s.hit && s.hit.kind === 'blunt') D.bluntHit = true; if (s.big) D.bigs.push(s);
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

module.exports = { C, hyp, NOKIND, NONE, DIR16, DIR8, OFF, SELF_GAP, catOf, FORMNAME, isSetup, logDec, estDmg, PAIRS, rollSide, holdsOf, castTime, bindOf, caged, pinned, hitBack, afterPin, pinOf, deck, obsNear, anyNear, bigAttack, landDelay, maxRange, ownShare, kindOf, counters, defenseDown, circOf };
}, {"../core":"src/core.js"}];
D["src/core.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 엔진 핵심 v1.12.0
 * 단위: m, s, kg, J. 고정 시간 간격 DT = 1/30 s. 같은 씨앗이면 같은 결과.
 * 규칙의 근거와 수식은 SPEC.md 참고. 이 파일을 바꾸면 SPEC과 버전을 같이 올린다.
 * 규칙(스위치)은 src/rules/에 하나에 한 파일로 있다. 핵심은 정해진 자리에서 켜진 규칙의 훅(W.H)만 부른다 (SPEC 22장).
 * 브라우저는 sandbox/pack.js가 묶은 sandbox/arena.js로 읽는다(전역 ArenaCore).
 * ========================================================================= */
const { sin, cos, atan2, exp, log, pow, hyp, clamp, mulberry32 } = require('./math');
const { SPELLS } = require('./data');
const R = require('./rules');
const VERSION = '1.12.0';
const DT = 1 / 30;

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
  full: 0.6,           // 장악 몫이 이보다 크면 온전한 힘
  taunt: false,        // 도발: 상대의 부름(예비동작)을 끊는 마법 '도발'을 쓸 수 있다. 끄면 책에서 빠진다 (SPEC 8장)
  wave: false,         // 파도: 머리가 넘치면 굳는 대신 파도를 탄다. 부류(type: 서퍼·메타·이단)마다 다르게 (SPEC 7장)
  risk: false,         // 하이 리스크 하이 리턴: 큰 마법(big)과 역류·빈손 (1.9.0, SPEC 7장). 끄면 큰 마법이 책에서 빠진다
  saltRing: false,     // 줄어드는 소금 원: 선 밖에선 마법이 흩어지고 몸이 마른다 (1.9.0, SPEC 2장)
  bodyBind: false,     // 몸 묶기: 발밑이 아니라 몸을 묶는 마법 다섯과 눈멂의 읽기 막기 (1.11.0, SPEC 9장). 끄면 그 마법이 책에서 빠진다
  hpScale: false,      // 켜면 체력도 선명도^K로 커져 등급과 상관없이 결투 속도가 비슷해진다 (게임 균형용)
};
// 규칙 모듈이 스위치의 기본값을 따로 적었으면 (등록한 규칙). 기본 규칙의 스위치는 위 표에 있다
for (const r of R.RULES) if (r.switch && !(r.switch in DEFAULT_RULES)) DEFAULT_RULES[r.switch] = r.default ?? false;
// 파도의 부류 (WORLD 3-3). 사람 규격의 type. 파도가 꺼져 있으면 셋 다 같다
const TYPES = ['서퍼', '메타', '이단'];
const BUFK = new Set(['speed', 'elecRes', 'bluntRes', 'toxRes', 'front', 'block', 'smoke']);   // 알려진 몸 효과 (stepMage가 이름으로 줄인다)
const BODY = { hp: 150, glu: 110, gluRegen: 1.2, stam: 6, stamRegen: 0.8, speed: 5, radius: 0.3 };
// 마법이 만들어지는 자리
// 규칙 모듈이 더하는 틀(cage·taunt…)은 그 모듈의 form에 있다 (formsOf가 붙인다)
const FORM = { proj: 'self', lob: 'self', wall: 'self', ring: 'self', shoot: 'self', smother: 'self', area: 'target', zone: 'target', trap: 'target', thread: 'target', cone: 'front', buff: 'body', move: 'body', touch: 'body' };
const THREAT = { thread: 1, area: 1, touch: 1, cone: 1, proj: 1 };

/* ---------------- 규칙 모듈과 훅 (SPEC 22장) ---------------- */
// 훅 모음: 이름마다 배열 하나. 리터럴로 만들어 모양이 늘 같다(속도). 이름은 rules/index.js의 ENGINE_HOOKS
function emptyH() { return { place: [], init: [], world: [], ceff: [], power: [], gate: [], share: [], release: [], overload: [], hurtMod: [], hurt: [], eff: [], rain: [], smother: [], ring: [], fatRecover: [], mageStep: [], mageZones: [], speed: [], speedLate: [], accel: [], chan: [], projSub: [], ignite: [], areaHit: [], zoneTick: [], notice: [] }; }
// 규칙 모듈이 엔진에서 쓰는 것 (X). 규칙 파일은 이것만 받아 쓴다
let X = null;
const ENG = new Map(), TFX = {}; let tfxVer = -1;
// 규칙의 엔진 훅은 모듈마다 한 번 만든다
function engineOf(r) { if (!r.engine) return null; let e = ENG.get(r); if (!e) { e = r.engine(X); for (const k in e) if (!(k in emptyH())) throw new Error(r.name + ': 없는 엔진 훅 ' + k + ' (' + R.ENGINE_HOOKS.join(', ') + ')'); ENG.set(r, e); } return e; }
// 틀 표(방출)와 자리 표: 규칙 목록이 바뀌었을 때만 다시 만든다
function formsOf() {
  if (tfxVer === R.ver()) return; tfxVer = R.ver();
  for (const k in TFX) TFX[k] = null;
  for (const r of R.RULES) { if (r.form) Object.assign(FORM, r.form); if (r.types) Object.assign(TFX, r.types(X)); }
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
const SPELL_KEYS = new Set(["n", "el", "t", "m", "v", "R", "cost", "cast", "cd", "hit", "role", "L", "dur", "dps", "kind", "burn", "burst", "mv", "dist", "self", "z", "tr", "vis", "E", "r", "delay", "dmg", "stun", "b", "react", "flight", "hp", "at", "wet", "push", "lock", "banned", "blind", "life", "home", "tags", "desc", "kill", "multi", "fast", "root", "rad", "chill", "mundane", "rule", "big", "cramp", "pr"]);
function shapeOne(s) { const o = { n: s.n, el: s.el, t: s.t, m: s.m, v: s.v, R: s.R, cost: s.cost, cast: s.cast, cd: s.cd, hit: s.hit, role: s.role, L: s.L, dur: s.dur, dps: s.dps, kind: s.kind, burn: s.burn, burst: s.burst, mv: s.mv, dist: s.dist, self: s.self, z: s.z, tr: s.tr, vis: s.vis, E: s.E, r: s.r, delay: s.delay, dmg: s.dmg, stun: s.stun, b: s.b, react: s.react, flight: s.flight, hp: s.hp, at: s.at, wet: s.wet, push: s.push, lock: s.lock, banned: s.banned, blind: s.blind, life: s.life, home: s.home, tags: s.tags, desc: s.desc, kill: s.kill, multi: s.multi, fast: s.fast, root: s.root, rad: s.rad, chill: s.chill, mundane: s.mundane, rule: s.rule, big: s.big, cramp: s.cramp, pr: s.pr }; for (const k in s) if (!SPELL_KEYS.has(k)) o[k] = s[k]; return o; }
const SHAPED = new WeakSet();   // 이 세계에서 모양을 맞춘 사본 (원본 마법은 여기 없다)
function shapeBook(W, book) { for (const n of book) { const s = W.spells[n]; if (s && !SHAPED.has(s)) { const o = shapeOne(s); SHAPED.add(o); W.spells[n] = o; } } }
function createWorld(opt = {}) {
  const W = {
    v: VERSION, t: 0, step: 0, width: opt.width || 40, height: opt.height || 30,
    rng: mulberry32((opt.seed >>> 0) || 1), rules: Object.assign({}, DEFAULT_RULES, opt.rules),
    spells: Object.assign({}, opt.spells || SPELLS), brain: opt.brain || null,   // 책에 든 마법은 addMage가 모양을 맞춘다
    obs: [], walls: [], proj: [], lobs: [], areas: [], zones: [], traps: [], barrels: [], ms: [], fx: [],
    foes: [[], []], _nF: null, _alive: null, _cloak: false, rec: opt.record ? [] : null, sides: 2, maxT: opt.maxT || 120,
    H: null, mods: null, _bh: null,   // 켜진 규칙의 엔진 훅, 켜진 규칙 모듈, 두뇌 훅(두뇌가 채운다)
  };
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
  if (Array.isArray(opt.walls)) for (const w of opt.walls) W.walls.push({ x: w.x, y: w.y, r: w.r || 0.6, hp: w.hp || 200, t: 1e9, own: -1 });
  for (const h of W.H.init) h(W);
  return W;
}

function addMage(W, spec, side, x, y) {
  const book = (spec.book || []).filter(n => W.spells[n] && (!W.spells[n].banned || spec.allowBanned) && (!W.spells[n].rule || W.rules[W.spells[n].rule]));   // 규칙에 딸린 마법은 그 규칙이 켜졌을 때만
  shapeBook(W, book);
  const m = {
    id: W.ms.length, name: spec.name || 'm' + W.ms.length, side, x, y, vx: 0, vy: 0, r: BODY.radius,
    hpMax: (spec.hp || BODY.hp) * (W.rules.hpScale ? pow(spec.C ?? 1, W.rules.powerK) : 1), hp: (spec.hp || BODY.hp) * (W.rules.hpScale ? pow(spec.C ?? 1, W.rules.powerK) : 1), glu: spec.glu || BODY.glu, gluMax: spec.glu || BODY.glu, stam: BODY.stam,
    C: spec.C ?? 1, circles: spec.circles ?? 1, noise: spec.noise ?? 0.05, react: spec.react ?? 0.2, dec: spec.dec ?? 0.15,
    brain: spec.brain || null, skill: spec.skill || null, autoDodge: !!spec.autoDodge, type: spec.type || '메타', wave: 0, waveT: 0, crash: 0, gear: Object.assign({}, spec.gear), book, mast: spec.mast || {}, _deck: null, _cand: null, _pool: null, hitEst: Object.assign({}, spec.hitEst),
    tac: Object.assign({ prefR: 7, aggr: 1, trapBias: 0.1, zoneBias: 0.05, dodge: 0.6, focusLow: false, crowd: true, stance: true, rest: 75,
      // 판단 스위치 (1.5.0, SPEC 13장). 기본값이 1.4.0까지의 두뇌. 판단 수준(skill)이 덮는다
      readCast: true, lead: 1, combo: true, lever: true, pathTrap: true, slotB: true, terrain: false, readWave: false, cdRead: false, outrange: false, feint: false, learn: false, waveChoose: false, counter: false, rollCap: 9, rollBias: null,
      // 기술 사다리 (1.7.0, SPEC 13장): 시전 중 걷기 비율, 쏜 뒤 멈춤(범위, 사람마다 한 번), 쏘는 중에 다음 수 정하기, 두 수 콤보 계획
      castMove: 0.5, pause: null, plan: false, combo2: false,
      // (1.7.0 상급) 방패는 아무 때나(초보), 큰 공격을 위해 방패 아끼기, 상대가 피하면 캔슬, 엄폐, 박자 흔들기
      shieldAny: false, shieldSave: false, cancel: false, cover: false, tempo: false, coverW: 1.5,
      // (1.7.0 대가·전설) 몰이, 엄폐 걷어내기, 유도, 동시 착탄, 기회 캔슬 / 방어 미끼, 약한 척 물러서기, 세 마법 겹치기
      herd: false, strip: false, lure: false, simul: false, cancel2: false, bait: false, fakeRetreat: false, triple: false,
      bigPlan: false, dodgeAim: false, grab: false }, spec.tac),   // (1.10.0 risk) 피할 자리 겨냥(상급부터), 붙잡기(대가부터)   // (1.9.0 대가·전설) 큰 수를 짝 묶기에 맞춰 꽂는다
    st: { stun: 0, root: 0, wet: 0, burn: 0, chill: 0, blind: 0, cough: 0, mycel: 0, cramp: 0, lime: 0, fetter: 0 }, _bufx: [], _sigX: NaN, _sigN: false, _szC: NaN, _sz: 1, _pwC: NaN, _pwK: NaN, _pw: 1, buf: { speed: null, elecRes: null, bluntRes: null, toxRes: null, front: null, block: null, smoke: null }, cd: {}, cast: null, castB: null, chan: null, roll: 0, rollCd: 0, autoCd: 0, fat: 0, aim: 0, thinkT: W.rng() * 0.1,
    mv: { x: 0, y: 0 }, mem: {}, waveWant: false, relT: null, lastRel: -9, comboPend: null, combo: null, last: null, lastT: -9, sf: 1, stance: 'normal', vault: 0, _sig: 1, _act: false, deathT: null,
    // 판 중에 채우는 칸. 처음부터 두어 객체 모양이 바뀌지 않게 한다(속도, 1.11.1). 값은 비어 있을 때와 같게 읽힌다 (null ?? −9, 0 || 0)
    bigp: null, simul: null, herd: null, hold: 0, lureT: null, baitT: null, baitDone: 0, emptyT: -9, lastHit: null, h2sT: 0, thinkAt: null, losWas: false, pauseLen: 0, rollSide: 0, rollPref: 0, _ref: null,
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
  const L = W.rules.domainL, foes = W.foes[m.side];
  const mine = sigOf(W, m) / (1 + hyp(x - m.x, y - m.y) / L);
  let other = 0;
  for (let i = 0; i < foes.length; i++) { const q = foes[i]; other += sigOf(W, q) * (q._act ? 1 : W.rules.passive) / (1 + hyp(x - q.x, y - q.y) / L); }
  let f = mine / (mine + other);
  const h = W.H.share; for (let i = 0; i < h.length; i++) f = h[i](W, m, x, y, f);   // 소금 망토 (rules/gear)
  return f;
}
const gOf = (W, f) => clamp((f - W.rules.fizzle) / (W.rules.full - W.rules.fizzle), 0, 1);
function formPoint(m, s, tx, ty) {
  const k = FORM[s.t];
  if (k === 'target') return [tx, ty];
  if (k === 'front') { const d = hyp(tx - m.x, ty - m.y) || 1, L = Math.min(d, s.L || 3) * 0.4; return [m.x + (tx - m.x) / d * L, m.y + (ty - m.y) / d * L]; }
  if (k === 'self') { const d = hyp(tx - m.x, ty - m.y) || 1; return [m.x + (tx - m.x) / d * 0.5, m.y + (ty - m.y) / d * 0.5]; }
  return null;
}
// 이 자리에 마법이 서는 정도 g. 규칙의 문(gate)이 막으면 0 (소금 원, rules/saltRing)
function gAt(W, m, s, tx, ty) {
  const h = W.H.gate; for (let i = 0; i < h.length; i++) if (h[i](W, m, s, tx, ty)) return 0;
  if (s.mundane || !W.rules.domain) return 1; const p = formPoint(m, s, tx, ty); return p ? gOf(W, share(W, m, p[0], p[1])) : 1;
}

/* ---------------- 공간 ---------------- */
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, t = clamp(((cx - x1) * dx + (cy - y1) * dy) / L2, 0, 1); return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
// 선분의 테두리 상자(+ 반지름) 밖에 있는 원은 재지 않는다: 가장 가까운 점은 상자 안이라 결과가 같다 (속도, 1.11.1)
function segBox(x1, y1, x2, y2, cx, cy, r) { const e = r + 1e-9; return cx < (x1 < x2 ? x1 : x2) - e || cx > (x1 > x2 ? x1 : x2) + e || cy < (y1 < y2 ? y1 : y2) - e || cy > (y1 > y2 ? y1 : y2) + e; }
function blocked(W, x1, y1, x2, y2) {
  for (const o of W.obs) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  for (const o of W.walls) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  for (const z of W.zones) if (z.k === 'smoke' && z.shape === 'circle' && segCircle(x1, y1, x2, y2, z.x, z.y, z.r)) return true;
  return false;
}
function inZone(z, x, y) { if (z.shape === 'circle') return hyp(x - z.x, y - z.y) < z.r; const dx = cos(z.a), dy = sin(z.a), rx = x - z.x, ry = y - z.y; return Math.abs(rx * dx + ry * dy) < z.len / 2 && Math.abs(-rx * dy + ry * dx) < 0.6; }
function frontBlock(e, sx, sy) { if (!e.buf.front) return false; const a = atan2(sy - e.y, sx - e.x), b = Math.abs(((a - e.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 1.1; if (b && !e.buf.front.used) { e.buf.front.used = 1; e.log.defHit++; } return b; }   // 막은 방패는 방어 적중으로 한 번 센다

/* ---------------- 피해와 상태 ---------------- */
function hurt(W, m, v, src, name, kind) {
  if (m.hp <= 0 || v <= 0) return;
  const b = m.buf;
  if (kind === 'elec' && b.elecRes) v *= b.elecRes.v;
  if (kind === 'blunt' && b.bluntRes) v *= b.bluntRes.v;
  if (kind === 'tox' && b.toxRes) v *= b.toxRes.v;
  const H = W.H, hm = H.hurtMod; for (let i = 0; i < hm.length; i++) v = hm[i](W, m, v, kind);   // 흡수 안개·물 장막 (rules/terrain)
  if (kind === 'elec' && m.st.wet > 0) v *= 1.5;
  if (kind === 'fire' && m.st.wet > 0) v *= 0.6;
  m.hp -= v; m.log.taken[kind] = (m.log.taken[kind] || 0) + v;
  const hh = H.hurt; for (let i = 0; i < hh.length; i++) hh[i](W, m, v, src, name, kind);   // 몸 묶기가 불에 풀림 (rules/control), 역류 (rules/risk)
  // 동시 착탄: 같은 사람의 다른 마법이 0.2 s 안에 같은 과녁에 닿았다 (셋이면 둘로 센다)
  if (src && v >= 2) { const h = m.lastHit; if (h && h.src === src && W.t - h.t < 0.2 && !h.names.includes(name)) { src.log.simul++; h.names.push(name); } else m.lastHit = { src, t: W.t, names: [name] }; }
  // 방어 미끼 (전설): 미끼로 방패를 든 뒤 1.5 s 안에, 그걸 보고 시전하던 상대를 맞혔다
  if (src && src.baitT != null && W.t - src.baitT < 1.5 && (m.cast || m.castB) && !src.baitDone) { src.baitDone = 1; src.log.defTry++; src.log.defHit++; }
  // 콤보 성공: 콤보로 쏜 마법이 묶이거나 굳은(전기면 젖은) 상대에게 들어갔다
  const cp = src && src.comboPend; if (cp && cp.tgt === m && W.t <= cp.until && (m.st.stun > 0 || m.st.root > 0 || (kind === 'elec' && m.st.wet > 0))) { src.log.comboHit++; src.log.cHit[cp.kind] = (src.log.cHit[cp.kind] || 0) + 1; src.comboPend = null; }
  if (src && src !== m) src.log.dealt[name] = (src.log.dealt[name] || 0) + v;
  if (m.hp <= 0 && m.deathT === null) m.deathT = W.t;
}
function eff(W, m, o, g = 1) {
  if (!o) return;
  if (o.burn) m.st.burn = Math.max(m.st.burn || 0, o.burn * g);
  if (o.wet) m.st.wet = 20;
  if (o.chill) m.st.chill = Math.max(m.st.chill || 0, o.chill * g);
  if (o.stun) m.st.stun = Math.max(m.st.stun || 0, o.stun * g * (m.buf.elecRes && o.kind === 'elec' ? 0.3 : 1));
  if (o.root) m.st.root = Math.max(m.st.root || 0, o.root * g);
  if (o.blind) m.st.blind = Math.max(m.st.blind || 0, o.blind * g);
  if (o.cough) m.st.cough = Math.max(m.st.cough || 0, o.cough * g);
  const h = W.H.eff; for (let i = 0; i < h.length; i++) h[i](W, m, o, g);   // 몸 묶기 (rules/control)
  if (m.st.stun > 0) { m.cast = null; m.castB = null; m.chan = null; }
}
const hit = (m, s) => { m.log.hits[s.n] = (m.log.hits[s.n] || 0) + 1; if (s.big) m.log.bigHit++; };
function addZone(W, src, z, x, y, a, g) { const gz = g ?? 1; const zz = Object.assign({}, z, { x, y, a: a || 0, src, dps: (z.dps || 0) * gz, t: z.d * (gz < 1 ? Math.max(0.3, gz) : 1) }); W.zones.push(zz); if (zz.k === 'fire') ignite(W, x, y, zz.r || (zz.len || 2) / 2, src); }
// 불·전기가 (x, y) 둘레 r m에 닿았다 (화약통, rules/barrels)
function ignite(W, x, y, r, src) { const h = W.H.ignite; for (let i = 0; i < h.length; i++) h[i](W, x, y, r, src); }
function canHit(W, p, q) { return q !== p.src && q.hp > 0 && (W.rules.friendlyFire || q.side !== p.src.side); }

/* ---------------- 마법 방출 ---------------- */
function release(W, m, c) {
  const s = c.s, tx = c.tx, ty = c.ty, dx0 = tx - m.x, dy0 = ty - m.y, d0 = hyp(dx0, dy0) || 1, ux = dx0 / d0, uy = dy0 / d0;
  m.aim = atan2(uy, ux);
  m.log.casts[s.n] = (m.log.casts[s.n] || 0) + 1;
  if ((s.t === 'wall' || s.t === 'shoot' || (s.t === 'buff' && s.b.front)) && !c.bait) m.log.defTry++;   // 미끼 방패는 성공했을 때만 방어로 센다
  const hr = W.H.release; for (let i = 0; i < hr.length; i++) hr[i](W, m, c);   // 빈손 (rules/risk)
  if (!c.auto && !c.B) { m.relT = W.t; m.lastRel = W.t; if (m.tac.plan) m.thinkT = 0; }   // 빈틈·멈춤은 첫 칸으로 센다   // 쏘는 중에 다음 수를 정해 둔 사람은 바로 다음 걸음에 시작한다
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
        const a = atan2(uy, ux) + (n > 1 ? (j / (n - 1) - 0.5) * 0.26 : 0) + (W.rng() - 0.5) * 2 * m.noise * (m.st.blind > 0 ? 3 : 1);
        W.proj.push({ x: m.x, y: m.y, vx: cos(a) * s.v, vy: sin(a) * s.v, home: s.home, life: s.home ? s.life : rangeOf(m, s) / s.v, s, src: m, pow: P / (n > 1 ? n * 0.55 : 1), rad: (s.rad || 0.1) * (s.mundane ? 1 : Math.min(rs, 3)) });
      }
      break;
    }
    case 'lob': W.lobs.push({ x: tx, y: ty, t: s.flight, s, src: m, pow: P, r: s.r * rs }); break;
    case 'thread': {
      const R = rangeOf(m, s), ex = d0 > R ? m.x + ux * R : tx, ey = d0 > R ? m.y + uy * R : ty;
      if (!blocked(W, m.x, m.y, ex, ey)) {
        let tgt = null; for (const q of foes) if (hyp(q.x - ex, q.y - ey) < 0.6 * Math.min(rs, 2) + 0.2) { tgt = q; break; }
        if (tgt && !frontBlock(tgt, m.x, m.y)) { hurt(W, tgt, 0.8 * pow(s.E, 0.55) * P, m, s.n, 'elec'); eff(W, tgt, s.cramp ? { cramp: s.cramp } : { stun: Math.min(1.2, s.E / 800), kind: 'elec' }, g); hit(m, s); }   // 경직 실은 굳힘 대신 경직
      }
      if (W.rec) W.fx.push(['z', m.x, m.y, ex, ey]); ignite(W, ex, ey, 0.7, m); break;
    }
    case 'area': W.areas.push({ x: tx, y: ty, r: s.r * rs, t: s.delay, s, src: m, pow: P, vis: !!s.vis, g }); break;
    case 'touch': {
      let e = null, bd = 1.35; for (const q of foes) { const d = hyp(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; e = q; } }
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
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 1.1; W.walls.push({ x: m.x + ux * s.at + px * off, y: m.y + uy * s.at + py * off, r: s.r, hp: s.hp * hpS, t: s.dur, by: m, own: m.side }); }
      break;
    }
    case 'buff': {
      for (const [k, v] of Object.entries(s.b)) if (k !== 'd') { m.buf[k] = { v: ['speed', 'elecRes', 'bluntRes', 'toxRes'].includes(k) ? v : 1, t: s.b.d }; if (!BUFK.has(k) && !m._bufx.includes(k)) m._bufx.push(k); }
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
      if (mine.length >= 3) W.traps.splice(W.traps.indexOf(mine[0]), 1);
      W.traps.push({ x: m.x + ux * R0, y: m.y + uy * R0, s, src: m, arm: 0.8, seen: new Set(s.vis ? W.ms.map(q => q.id) : [m.id]), pow: P, r: s.tr.r * Math.min(rs, 2) });
      break;
    }
    case 'ring': {
      const rr = s.r * rs;
      for (const p of W.proj) if (p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
      for (const z of W.zones) if (['h2s', 'nh3', 'spore'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + 1) z.t = 0;
      const hg = W.H.ring; for (let i = 0; i < hg.length; i++) hg[i](W, m);   // 제 몸의 균사를 태운다 (rules/control)
      let h = false; for (const q of foes) if (hyp(q.x - m.x, q.y - m.y) < rr) { hurt(W, q, s.dmg * P, m, s.n, 'fire'); eff(W, q, { burn: 1 }); h = true; }
      if (h) hit(m, s); break;
    }
    case 'shoot': {
      let n = 0; for (const p of W.proj) if (p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < s.r * rs) { p.dead = true; n++; if (W.rec) W.fx.push(['z', m.x, m.y, p.x, p.y]); }
      if (n) { hit(m, s); m.log.defHit++; } break;
    }
    case 'smother': {
      const rr = s.r * rs;
      for (const z of W.zones) if (['fire', 'h2s', 'nh3', 'spore', 'acid'].includes(z.k) && hyp(z.x - m.x, z.y - m.y) < rr + (z.r || 2)) z.t = 0;
      m.st.burn = 0; const hs = W.H.smother; for (let i = 0; i < hs.length; i++) hs[i](W, m); for (const p of W.proj) if (p.src.side !== m.side && p.home && hyp(p.x - m.x, p.y - m.y) < rr) p.dead = true;
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
  for (const q of W.ms) if (q.hp > 0 && hyp(q.x - p.x, q.y - p.y) < r && (W.rules.friendlyFire || q.side !== p.src.side || q === p.src)) {
    hurt(W, q, b.dmg * p.pow * (1 - hyp(q.x - p.x, q.y - p.y) / r * 0.5), q === p.src ? null : p.src, p.s.n, b.kind); eff(W, q, b); if (q !== p.src) hit(p.src, p.s);
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
  if ((b = bf.toxRes) && (b.t -= DT) <= 0) bf.toxRes = null; if ((b = bf.front) && (b.t -= DT) <= 0) bf.front = null; if ((b = bf.block) && (b.t -= DT) <= 0) bf.block = null; if ((b = bf.smoke) && (b.t -= DT) <= 0) bf.smoke = null;
  for (let i = 0; i < m._bufx.length; i++) { const k = m._bufx[i]; if ((b = bf[k]) && (b.t -= DT) <= 0) bf[k] = null; }   // 등록한 마법의 다른 몸 효과
  // 간격은 0 아래로 더 줄이지 않는다: 읽는 곳은 모두 (cd || 0)을 0 이상 문턱과 견주거나 0 이상과 min·max하므로 0 아래는 얼마든 같다 (속도, 1.11.1)
  const cd = m.cd; for (const n in cd) { const v = cd[n]; if (v > 0) cd[n] = v - DT; }
  m.rollCd -= DT; m.autoCd -= DT; if (m.vault > 0) m.vault -= DT;
  m.glu = Math.min(m.gluMax, m.glu + BODY.gluRegen * DT); if (m.stam < BODY.stam) m.stam += BODY.stamRegen * DT;
  const H = W.H;
  if (m.fat > 0) { let k = 4; const hf = H.fatRecover; for (let i = 0; i < hf.length; i++) k = hf[i](W, m, k); m.fat = Math.max(0, m.fat - k * DT); }   // 머리 회복 (메타 × 1.05, rules/wave)
  const hs = H.mageStep; for (let i = 0; i < hs.length; i++) hs[i](W, m);   // 소금 선 밖 (rules/saltRing), 파도가 몸을 태움·꺼짐 (rules/wave)
  if (m.st.burn > 0) hurt(W, m, 3 * DT, null, '옷에 붙은 불', 'fire');
  const hz = H.mageZones; for (let i = 0; i < hz.length; i++) hz[i](W, m);   // 선 지대 (rules/terrain)
  if (m.hp <= 0) return;
  m.thinkT -= DT; if (m.thinkT <= 0) { m.thinkT = m.dec; const B = m.brain || W.brain; if (B) B.think(W, m); }
  if (m.hp <= 0) return;
  const sT = m.log.stanceT, sk = m.stance;   // 이름으로 더한다 (속도). 처음 더할 때 칸이 생기는 차례는 그대로
  if (sk === 'normal') sT.normal = (sT.normal || 0) + DT; else if (sk === 'kite') sT.kite = (sT.kite || 0) + DT; else if (sk === 'hold') sT.hold = (sT.hold || 0) + DT; else if (sk === 'breakout') sT.breakout = (sT.breakout || 0) + DT; else sT[sk] = (sT[sk] || 0) + DT;
  // 첫 칸, 두 번째 칸 차례로 (걸음마다 배열을 만들지 않게 풀어 썼다, 속도 1.11.1)
  let c = m.cast; if (c) { c.t += DT; if (m.st.stun > 0) m.cast = null; else if (c.t >= c.T) { m.cast = null; release(W, m, c); } }
  c = m.castB; if (c) { c.t += DT; if (m.st.stun > 0) m.castB = null; else if (c.t >= c.T) { m.castB = null; release(W, m, c); } }
  if (m.chan) {
    const ch = m.chan, s = ch.s; ch.t -= DT;
    for (const e of W.foes[m.side]) {
      const d = hyp(e.x - m.x, e.y - m.y), ang = Math.abs(((atan2(e.y - m.y, e.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < ch.L && ang < 0.45) {
        hurt(W, e, s.dps * ch.pow * DT, m, s.n, s.kind);
        if (s.burn) e.st.burn = Math.max(e.st.burn || 0, s.burn); if (s.wet) e.st.wet = 20; if (s.blind) e.st.blind = Math.max(e.st.blind || 0, s.blind);
        if (s.push) { e.vx += cos(m.aim) * s.push * DT * 4; e.vy += sin(m.aim) * s.push * DT * 4; }
        ch.hitAny = true;
      }
    }
    const hc = H.chan; for (let i = 0; i < hc.length; i++) hc[i](W, m, ch);   // 앞의 화약통 (rules/barrels)
    if (ch.t <= 0) { if (ch.hitAny) hit(m, s); m.chan = null; }
  }
  // 움직임
  if (m.roll > 0) m.roll -= DT;
  else {
    let sp = BODY.speed; const hv = H.speed; for (let i = 0; i < hv.length; i++) sp = hv[i](W, m, sp);   // 파도·꺼짐 (rules/wave), 빈손 (rules/risk)
    if (m.buf.speed) sp *= 1 + m.buf.speed.v; if (m.st.chill > 0) sp *= 0.7;
    const hl = H.speedLate; for (let i = 0; i < hl.length; i++) sp = hl[i](W, m, sp);   // 경직·균사 (rules/control)
    if (m.cast || m.chan) sp *= (m.cast && m.cast.s.lock) ? 0 : m.tac.castMove; if (m.st.stun > 0 || m.st.root > 0) sp = 0;
    let acc = 9; const ha = H.accel; for (let i = 0; i < ha.length; i++) acc = ha[i](W, m, acc);   // 빙판 (rules/terrain)
    const l = hyp(m.mv.x, m.mv.y), tx = l ? m.mv.x / l * sp : 0, ty = l ? m.mv.y / l * sp : 0, k = Math.min(1, DT * acc);
    m.vx += (tx - m.vx) * k; m.vy += (ty - m.vy) * k;
  }
  m.x = clamp(m.x + m.vx * DT, 0.4, W.width - 0.4); m.y = clamp(m.y + m.vy * DT, 0.4, W.height - 0.4);
  if (!(m.vault > 0)) {
    for (const o of W.obs) { const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
    for (const o of W.walls) { const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
  }
}
// 안 보이는 함정을 알아챌 걸음당 확률 (이단의 함정은 어렵다, rules/wave)
function notice(W, t) { let k = DT * 0.25; const h = W.H.notice; for (let i = 0; i < h.length; i++) k = h[i](W, t, k); return k; }
function stepWorld(W) {
  W.t += DT; W.step++;
  refreshSides(W);
  const H = W.H, hw = H.world; for (let i = 0; i < hw.length; i++) hw[i](W);   // 등록한 규칙의 걸음마다 할 일
  for (const m of W.ms) if (m.hp > 0) stepMage(W, m);
  // 투사체: 속도에 맞춰 잘게 나눠 움직인다 (빠른 탄이 사람을 뚫고 지나가지 않게)
  for (const p of W.proj) {
    if (p.dead) continue; p.life -= DT;
    if (p.home) {
      let e = null, bd = 1e9; for (const q of W.foes[p.src.side]) { const d = hyp(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; e = q; } }
      if (e) { const sp = hyp(p.vx, p.vy), want = atan2(e.y - p.y, e.x - p.x), cur = atan2(p.vy, p.vx); const df = ((want - cur + Math.PI * 3) % (Math.PI * 2)) - Math.PI, na = cur + clamp(df, -2 * DT, 2 * DT); p.vx = cos(na) * sp; p.vy = sin(na) * sp; }
      for (const z of W.zones) if (z.k === 'fire' && inZone(z, p.x, p.y)) p.dead = true;
    }
    const nS = Math.max(3, Math.ceil(hyp(p.vx, p.vy) * DT / 0.25));
    for (let k = 0; k < nS && !p.dead; k++) {
      p.x += p.vx * DT / nS; p.y += p.vy * DT / nS;
      for (const o of W.obs) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; burst(W, p); break; }
      if (p.dead) break;
      for (const o of W.walls) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; if (o.by && !o.used && o.by !== p.src) { o.used = 1; o.by.log.defHit++; } o.hp -= (p.s.hit && p.s.hit.flat > 50) ? 80 : 5 * Math.min(p.pow, 20); burst(W, p); break; }
      if (p.dead) break;
      const hp = H.projSub; for (let i = 0; i < hp.length && !p.dead; i++) hp[i](W, p);   // 화약통 (rules/barrels)
      if (p.dead) break;
      for (const q of W.ms) {
        if (!canHit(W, p, q) || (p.home && q.side === p.src.side)) continue;
        const lim = q.r + p.rad + (p.home ? 0.2 : 0), dx = q.x - p.x, dy = q.y - p.y;
        if (dx > lim + 1e-9 || dx < -lim - 1e-9 || dy > lim + 1e-9 || dy < -lim - 1e-9) continue;   // 멀면 거리를 재지 않는다 (hyp ≥ |dx|라 결과는 같다)
        if (hyp(dx, dy) < lim && !(q.roll > 0 && !p.home)) {
          p.dead = true; if (!frontBlock(q, p.x - p.vx, p.y - p.vy)) { if (p.s.burst) burst(W, p); else projHit(W, p, q); } break;
        }
      }
    }
    if (!p.dead && p.life <= 0) { p.dead = true; burst(W, p); }
  }
  keepIf(W.proj, projLive);
  for (const l of W.lobs) { l.t -= DT; if (l.t <= 0) { for (const q of W.ms) if (q.hp > 0 && q !== l.src && hyp(q.x - l.x, q.y - l.y) < l.r + 0.3 && (W.rules.friendlyFire || q.side !== l.src.side)) { hurt(W, q, l.s.dmg * l.pow, l.src, l.s.n, l.s.kind); hit(l.src, l.s); } if (W.rec) W.fx.push(['a', l.x, l.y, l.r]); } }
  keepIf(W.lobs, timeLeft);
  for (const a of W.areas) {
    a.t -= DT; if (a.t > 0) continue;
    let h = false;
    for (const q of W.ms) {
      if (q.hp <= 0 || hyp(q.x - a.x, q.y - a.y) >= a.r + 0.3) continue;
      if (!W.rules.friendlyFire && q.side === a.src.side && q !== a.src) continue;
      let sole = 1; const hh = H.areaHit; for (let i = 0; i < hh.length; i++) sole = hh[i](W, q, a, sole);   // 소금 밑창 (rules/gear)
      hurt(W, q, a.s.dmg * a.pow * sole, q === a.src ? null : a.src, a.s.n, a.s.kind);
      const as = a.s; eff(W, q, { burn: as.burn, wet: as.wet, chill: as.chill, stun: (as.stun || 0) * sole * a.g, kind: as.kind, root: (as.root || 0) * sole * a.g, blind: as.blind, cough: as.cough, mycel: as.mycel, cramp: as.cramp, lime: as.lime, fetter: as.fetter });   // eff가 읽는 칸만 (마법 전체를 베끼지 않는다, 속도)
      if (q !== a.src) h = true;
    }
    if (h) hit(a.src, a.s); if (W.rec) W.fx.push(['a', a.x, a.y, a.r]);
    if (a.s.kind === 'fire' || a.s.kind === 'elec') ignite(W, a.x, a.y, a.r, a.src);
  }
  keepIf(W.areas, timeLeft);
  const hz = H.zoneTick; for (let i = 0; i < hz.length; i++) hz[i](W);   // 지대의 시간, 산이 벽을 녹인다 (rules/terrain)
  keepIf(W.zones, timeLeft);
  keepIf(W.walls, wallLive);
  for (const t of W.traps) {
    t.arm -= DT; if (t.arm > 0) continue;
    let e = null, bd = 1e9; for (const q of W.foes[t.src.side]) { const d = hyp(q.x - t.x, q.y - t.y); if (d < bd) { bd = d; e = q; } }
    if (!e) continue;
    if (!t.seen.has(e.id) && bd < 2.5 && W.rng() < notice(W, t)) t.seen.add(e.id);
    if (!(e.roll > 0) && bd < t.r) {
      if (W.t - (t.src.lureT ?? -9) < 3) t.src.log.lure++;   // 유도·몰이 성공: 끌어들인 적이 내 함정을 밟았다
      const tr = t.s.tr; if (tr.dmg) hurt(W, e, tr.dmg * t.pow, t.src, t.s.n, tr.kind || 'blunt'); eff(W, e, tr);
      if (tr.zone) addZone(W, t.src, Object.assign({}, tr.zone, { n: t.s.n }), t.x, t.y, 0, 1);
      hit(t.src, t.s); t.done = true;
    }
  }
  keepIf(W.traps, trapLive);
  if (W.rec && W.step % 2 === 0) W.rec.push(snapshot(W)); else W.fx.length = 0;
}

/* ---------------- 기록 ---------------- */
const r2 = v => Math.round(v * 100) / 100;
function snapshot(W) {
  return {
    t: r2(W.t),
    m: W.ms.map(m => [r2(m.x), r2(m.y), Math.round(m.hp), m.cast ? m.cast.s.n : (m.chan ? m.chan.s.n : ''), m.cast ? r2(m.cast.t / m.cast.T) : 0,
      (m.st.stun > 0 ? 1 : 0) | (m.st.root > 0 ? 2 : 0) | (m.st.wet > 0 ? 4 : 0) | (m.st.burn > 0 ? 8 : 0) | (m.buf.front ? 16 : 0) | (m.roll > 0 ? 32 : 0) | (m.castB ? 64 : 0),
      r2(m.aim), m.side, Math.round(m.fat), m.stance[0]]),
    p: W.proj.map(p => [r2(p.x), r2(p.y), p.s.el]), w: W.walls.map(w => [r2(w.x), r2(w.y), w.r]),
    z: W.zones.map(z => [z.k, r2(z.x), r2(z.y), r2(z.r || 0), r2(z.len || 0), r2(z.a || 0)]), a: W.areas.map(a => [r2(a.x), r2(a.y), r2(a.r), a.vis ? 1 : 0]),
    tr: W.traps.map(t => [r2(t.x), r2(t.y), t.s.el]), b: W.barrels.map(b => [r2(b.x), r2(b.y), b.ex ? 1 : 0]), fx: W.fx.splice(0),
  };
}

/* ---------------- 판 돌리기 ---------------- */
function aliveSide(W, s) { for (const m of W.ms) if (m.side === s && m.hp > 0) return true; return false; }
// 산 사람이 있는 편의 수: 한 번 훑어 센다 (속도, 1.11.1. 편마다 따로 훑던 것과 같다)
function aliveCount(W) { const seen = W._alive || (W._alive = []); for (let s = 0; s < W.sides; s++) seen[s] = false; let n = 0; for (const m of W.ms) if (m.hp > 0 && !seen[m.side]) { seen[m.side] = true; if (++n === W.sides) break; } return n; }
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
  if (alive.length > 1) {
    const avg = alive.map(s => { const g = W.ms.filter(m => m.side === s); return g.reduce((a, m) => a + Math.max(0, m.hp) / m.hpMax, 0) / g.length; });
    const best = Math.max(...avg), i = avg.indexOf(best), second = Math.max(...avg.filter((_, j) => j !== i));
    if (best - second > 0.04) { winner = alive[i]; byTime = true; }
  }
  return { v: VERSION, winner, byTime, t: r2(W.t), ms: W.ms, obs: W.obs, rec: W.rec };
}

// 규칙 모듈이 쓰는 엔진의 것 (X)
X = { DT, hyp, clamp, sin, cos, atan2, pow, hurt, hit, eff, burst, addZone, formPoint, inZone, blocked, share, gOf, power, sizeOf, rangeOf };
formsOf();
const { SALT, saltR, outSalt } = require('./rules/saltRing').api;   // 예전 이름 그대로 (소금 원, rules/saltRing)
module.exports = { VERSION, DT, SPELLS, sigOf, TYPES, SALT, saltR, outSalt, sin, cos, atan2, pow, exp, log, DEFAULT_RULES, RULES: R.RULES, BODY, FORM, THREAT, createWorld, addMage, stepWorld, run, over, result, snapshot, release, share, gOf, gAt, power, rangeOf, sizeOf, blocked, inZone, hyp, clamp };
}, {"./math":"src/math.js","./data":"src/data.js","./rules":"src/rules/index.js","./rules/saltRing":"src/rules/saltRing.js"}];
D["src/data.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 데이터 읽기 (data/)
 * 마법은 원소마다 한 파일(data/spells/*.json). 판의 결과가 덱·자유 덱의 차례에 기대므로 마법의 차례는 data/spells/order.json이 정한다.
 * 차례 목록에 없는 새 마법은 아래 파일 차례대로 뒤에 붙는다(그래서 새 마법을 넣을 때 order.json을 안 고쳐도 된다).
 * 파일 목록은 require를 그대로 적어 둔다: 샌드박스 묶음(pack)이 이것을 보고 함께 싼다 */
const FILES = [require('../data/spells/불.json'), require('../data/spells/번개.json'), require('../data/spells/흙.json'), require('../data/spells/물.json'),
  require('../data/spells/얼음.json'), require('../data/spells/독.json'), require('../data/spells/없음.json'), require('../data/spells/신호.json')];
const ORDER = require('../data/spells/order.json');
function spells() {
  const all = {}; for (const f of FILES) Object.assign(all, f);
  const out = {}; for (const n of ORDER) if (all[n]) out[n] = all[n];
  for (const n in all) if (!(n in out)) out[n] = all[n];
  return out;
}
module.exports = { SPELLS: spells(), BOOKS: require('../data/books.json'), DECKS: require('../data/decks.json'), TIERS: require('../data/tiers.json'), SKILLS: require('../data/skills.json'), GEAR: require('../data/gear.json') };
}, {"../data/spells/불.json":"data/spells/불.json","../data/spells/번개.json":"data/spells/번개.json","../data/spells/흙.json":"data/spells/흙.json","../data/spells/물.json":"data/spells/물.json","../data/spells/얼음.json":"data/spells/얼음.json","../data/spells/독.json":"data/spells/독.json","../data/spells/없음.json":"data/spells/없음.json","../data/spells/신호.json":"data/spells/신호.json","../data/spells/order.json":"data/spells/order.json","../data/books.json":"data/books.json","../data/decks.json":"data/decks.json","../data/tiers.json":"data/tiers.json","../data/skills.json":"data/skills.json","../data/gear.json":"data/gear.json"}];
D["src/index.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 v1.12.0 — 바깥으로 내보내는 API
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

// 두 편의 싸움
function battle(teamA, teamB, opt = {}) {
  const W = core.createWorld({ seed: opt.seed, rules: opt.rules, record: opt.record, maxT: opt.maxT, width: opt.width, height: opt.height, obstacles: opt.obstacles, brain });
  place(W, [teamA, teamB], opt.layout);
  return core.run(W);
}
const duel = (a, b, opt) => battle([a], [b], opt);

/* ---------------- 장면 (SPEC 19장) ---------------- */
// 장면의 한 사람 → 사람 규격. 비워 둔 칸은 등급의 값을 따른다
const OVERRIDE = ['C', 'circles', 'noise', 'dec', 'autoDodge', 'hp'];
function sceneMage(mm, side, lib) {
  const sp = mage({ tier: mm.tier, deck: mm.deck, book: mm.book, name: mm.name, gear: mm.gear, tac: mm.tac, brain: mm.brain || side.brain, type: mm.type, skill: mm.skill }, lib);
  for (const k of OVERRIDE) if (mm[k] != null && mm[k] !== '') sp[k] = k === 'autoDodge' ? !!mm[k] : +mm[k];
  return sp;
}
function sceneLib(sc) { return { spells: Object.assign({}, core.SPELLS, sc.spells), decks: Object.assign({}, DECKS, sc.decks) }; }
// 장면 → 첫 걸음 전의 세계. opt.record: 녹화
function sceneWorld(sc, opt = {}) {
  const lib = sceneLib(sc);
  const W = core.createWorld({ seed: sc.seed, rules: sc.rules, record: opt.record, maxT: sc.maxT, width: sc.width, height: sc.height, obstacles: sc.obstacles, barrels: sc.barrels, walls: sc.walls, spells: lib.spells, brain });
  const sides = sc.sides || [];
  place(W, sides.map((s, i) => s.mages.map((mm, k) => { const sp = sceneMage(mm, s, lib); if (sp.name == null) sp.name = (s.name || '편' + i) + (k + 1); return sp; })), sc.layout, sides.map(s => s.mages));
  return W;
}
const runScene = (sc, opt) => core.run(sceneWorld(sc, opt));
// viewer.html이 읽는 녹화 형식 (cli.js replay와 같다)
function recording(W) {
  const r = core.result(W), done = core.over(W);
  return { v: core.VERSION, names: W.ms.map(m => m.name), sides: W.ms.map(m => m.side), hpMax: W.ms.map(m => m.hpMax), winner: done ? r.winner : -1, t: r.t, obs: W.obs, frames: W.rec || [] };
}

// 판이 끝난 뒤 맞힘 기록을 사람 규격에 되먹인다 (결투자가 배우는 몫)
function learn(spec, m, rate = 0.3) {
  for (const n of Object.keys(m.log.casts)) { const c = m.log.casts[n], h = m.log.hits[n] || 0; spec.hitEst[n] = (spec.hitEst[n] ?? 0.35) * (1 - rate) + rate * Math.min(1, h / c); }
  return spec;
}

module.exports = Object.assign({}, core, { brain, TIERS, DECKS, BRAINS, SKILLS, CIRCLES, register, mage, place, battle, duel, look, sceneWorld, runScene, recording, learn });
}, {"./core":"src/core.js","./brain":"src/brain/index.js","./registry":"src/registry.js","./data":"src/data.js","./brain/skills":"src/brain/skills.js","../metrics/look":"metrics/look.js"}];
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
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

module.exports = { sin, cos, atan, atan2, exp, log, pow, hyp, clamp, mulberry32, horner };
}, {}];
D["src/registry.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 등록 v1.12.0
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
      const { cos, sin, clamp, hyp, hit } = X, s = c.s, tx = c.tx, ty = c.ty, hpS = 1 + (m.C - 1) * 0.5, rr = s.r; let h = false;
      for (let k = 0; k < 4; k++) { const b = a.aim + (k < 2 ? 1 : -1) * (k % 2 ? 2 : 1) * Math.PI / 3; W.walls.push({ x: clamp(tx + cos(b) * rr, 0.4, W.width - 0.4), y: clamp(ty + sin(b) * rr, 0.4, W.height - 0.4), r: s.pr, hp: s.hp * hpS, t: s.dur, own: m.side, cage: 1 }); }
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
D["src/rules/index.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 규칙 모듈 목록 (SPEC 22장 모듈과 훅)
 * 규칙 하나 = 파일 하나. 모양: { name, switch?, default?, on(W, opt), form?, engine: X => ({훅}), types: X => ({틀: fn}), brain: B => ({훅}), brainTypes: B => ({틀: fn}), api? }
 *   on: 이 세계에서 켜졌는가 (세계를 만들 때 한 번). 없으면 switch 스위치를 따르고, switch도 없으면 늘 켜짐
 *   engine: 엔진 훅. 세계를 만들 때 켜진 규칙의 훅만 차례대로 W.H[훅]에 모인다 (꺼진 규칙은 비용 0)
 *   types·brainTypes: 새 마법 틀의 방출과 두뇌의 값. 틀은 스위치와 상관없이 늘 붙는다(마법이 규칙에 딸리면 rule 필드가 책에서 뺀다)
 *   brain: 두뇌 훅. 기본 두뇌가 세계마다 켜진 규칙의 것만 모은다 (brain/hooks.js)
 * 차례가 곧 같은 훅 안의 부르는 차례다. 예전 한 덩어리의 계산 차례를 그대로 따른다(결과가 비트 하나 안 바뀌게). 새 규칙은 뒤에 붙는다 */
const RULES = [require('./gear'), require('./terrain'), require('./saltRing'), require('./wave'), require('./control'), require('./risk'), require('./taunt'), require('./multiSlot'), require('./barrels')];
// 엔진 훅의 이름과 부르는 자리 (SPEC 22장 표). 값을 돌려주는 훅은 받은 값을 고쳐 돌려준다
const ENGINE_HOOKS = ['place', 'init', 'world', 'ceff', 'power', 'gate', 'share', 'release', 'overload', 'hurtMod', 'hurt', 'eff', 'rain', 'smother', 'ring', 'fatRecover', 'mageStep', 'mageZones', 'speed', 'speedLate', 'accel', 'chan', 'projSub', 'ignite', 'areaHit', 'zoneTick', 'notice'];
const BRAIN_HOOKS = ['aim', 'read', 'hideCast', 'steer', 'avoid', 'empty', 'circles', 'react', 'cancel', 'rest', 'prep', 'value', 'valueRisk', 'valueMid', 'valueLate', 'commit', 'castTime'];
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
}, {"./gear":"src/rules/gear.js","./terrain":"src/rules/terrain.js","./saltRing":"src/rules/saltRing.js","./wave":"src/rules/wave.js","./control":"src/rules/control.js","./risk":"src/rules/risk.js","./taunt":"src/rules/taunt.js","./multiSlot":"src/rules/multiSlot.js","./barrels":"src/rules/barrels.js"}];
D["src/rules/multiSlot.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 서클 (rules.circles, 기본 켬, SPEC 6장)
 * 두 번째 칸(서클 2부터): 첫 칸을 모으는 동안 하나 더 (당·피로 × 1.3). 자동 진(서클 3부터): 생각 없이 막는다(간격 0.7 × 3 / 서클).
 * 끄면 누구나 서클 1 */
module.exports = {
  name: 'multiSlot', switch: 'circles', on: W => W.rules.circles,
  brain: B => {
    const { C, hyp, logDec, bigAttack } = B;
    return {
      circles(W, q) { return q.circles; },
      // 자동 진: 3서클부터, 생각 없이 막는다. 방패 아끼기(상급)면 큰 공격에만. 앞 방패·벽은 투사체·실만 막는다
      react(W, m, K) {
        const { S, T, e, threat, late, aimed, bigThreat, empty, circ } = K;
        const th = threat || late, bigTh = late && !threat ? (!T.shieldSave || (bigAttack(late, S) && (late.s.t === 'proj' || late.s.t === 'thread'))) : bigThreat;
        if (!(!empty && circ >= 3 && (aimed && threat || late) && th && bigTh && th.T - th.t < 0.4 && m.autoCd <= 0)) return;
        for (const n of m.book) {
          const s = S[n]; if ((m.cd[n] || 0) > 0) continue;
          if (!((s.t === 'buff' && s.react) || s.t === 'wall' || s.t === 'shoot')) continue;
          if (s.t === 'shoot' && !W.proj.some(p => p.src.side !== m.side && p.s.el !== '흙' && !p.s.mundane && hyp(p.x - m.x, p.y - m.y) < 6)) continue;
          const cost = s.cost * 1.2; if (m.glu < cost) continue;
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
    hurt(W, m, v) { if (v >= 3 && ((m.cast && m.cast.s.big) || (m.castB && m.castB.s.big)) && m.hp > 0) { if (m.cast && m.cast.s.big) m.cast = null; if (m.castB && m.castB.s.big) m.castB = null; m.log.backfire++; m.st.stun = Math.max(m.st.stun || 0, 0.6); X.hurt(W, m, 22, null, '역류', 'backfire'); } },
    speed(W, m, sp) { return sp * (m.emptyT > W.t ? 0.6 : 1); },
  }),
  brain: B => {
    const { PAIRS, pinned, hitBack, castTime, landDelay, estDmg, maxRange, bindOf } = B;
    const dodgeAim = require('../brain/techniques/dodgeAim'), grab = require('../brain/techniques/grab'), { undo } = require('../brain/techniques/cancel');
    return {
      aim(W, m, K) { if (m.tac.dodgeAim) K.wantMem = true; },   // 피할 자리 겨냥은 구르는 쪽 기록(학습)을 쓴다
      empty(W, m) { return m.emptyT > W.t; },                    // 빈손: 첫 칸과 자동 진을 못 쓴다
      // 짝에 맞춰 모으던 큰 수 (대가·전설): 짝이 떨어졌는데 과녁이 안 굳었으면 끊고, 굳었으면 끝을 과녁에 다시 겨눈다
      cancel(W, m, K) { const e = K.e; if (K.T.bigPlan && m.cast && m.cast.s.big && m.cast.pairLand && W.t > m.cast.pairLand + 0.05) { const c = m.cast; if (e.st.stun > 0 || e.st.root > 0) { c.tx = e.x; c.ty = e.y; } else undo(m, c); } },
      // 큰 수는 입장 판단이 있으면 때를 가린다, 상대의 큰 수는 빠른 공격으로 끊는다, 빈손은 몰아친다
      valueRisk(W, m, K, o) {
        const T = K.T, e = K.e, d = K.d, s = o.s, n = o.n, Tw = o.Tw;
        const noRoll = e.rollCd > 0.4 || e.stam < 1.5 || K.eDown || e.st.mycel > 0.4 || e.st.cramp > 0.4;   // 과녁이 당분간 못 구른다
        o.pin = W.rules.bodyBind && s.big && pinned(W, m, s, e, castTime(W, m, Tw), d) && hitBack(W, e, K.S, d) > castTime(W, m, Tw) + 0.05;   // 몸 묶기: 빠져나갈 수 없게 붙잡혔고, 모으는 동안 맞지 않는다
        if (s.big && T.stance && !(K.eDown || o.pin || e.emptyT > W.t || d > Math.max(8, maxRange(e, K.S)) || !K.los)) o.v = 0;   // 멀다 = 과녁의 사거리 밖
        // 판을 짜는 사람(대가·전설)은 큰 수를 짝의 틈이나, 남은 굳힘 안에 닿을 때만 쓴다 (아래 짝 계획이 다시 연다)
        if (s.big && T.bigPlan && !(o.pin || Math.max(e.st.stun || 0, e.st.root || 0) > castTime(W, m, Tw) + landDelay(s, d) + 0.02)) o.v = 0;
        else if (s.big && T.bigPlan) { o.v = Math.max(o.v, 30); o.tx = e.x; o.ty = e.y; }
        if (o.isOff && !s.big && T.readCast) { const bc = e.cast && e.cast.s.big ? e.cast : e.castB && e.castB.s.big ? e.castB : undefined; if (bc && Tw + landDelay(s, d) < bc.T - bc.t && estDmg(s) >= 3) o.v *= 2.2; if (e.emptyT > W.t) o.v *= 1.5; }
        // 짝 묶기 (대가·전설): 짝을 열 수 있으면 먼저 열고, 연 뒤에는 짝의 틈에 큰 수를 꽂는다
        if (T.bigPlan) {
          const bp = m.bigp && m.bigp.tgt === e && W.t < m.bigp.until ? m.bigp : null; if (m.bigp && !bp) m.bigp = null;
          // 짝은 과녁이 빠져나갈 수 없을 때(이미 묶였거나 굳음, 또는 젖음형은 당분간 못 구를 때) 연다: 예비동작을 읽는 상대는 보이는 짝을 걸어서 피한다
          const pr = PAIRS[n]; if (!bp && pr && (K.eDown || (pr.kind === 'wet' && noRoll)) && m.book.includes(pr.fin) && !((m.cd[pr.fin] || 0) > 0) && m.glu > o.cost + K.S[pr.fin].cost && o.v > 0) o.v = Math.max(o.v, 1.2);
          if (bp && n === bp.fin) { const ld = castTime(W, m, Tw) + landDelay(s, d), held = Math.max(e.st.stun || 0, e.st.root || 0); o.v = 0;
            // 굳힘형: 짝이 떨어지기 전에 모으기 시작해 굳힘 한가운데 닿게 한다(빗나가면 캔슬). 이미 걸렸으면 남은 굳힘 안에 닿을 때만
            if (bp.kind === 'bind') { const at = W.t + ld;
              if (held > ld + 0.02) { o.v = 60; o.tx = e.x; o.ty = e.y; }
              else if (W.t < bp.land && at >= bp.land + 0.05 && at <= bp.land + bp.bind - 0.05) { o.v = 60; const k = bp.land - W.t; o.tx = e.x + e.vx * k; o.ty = e.y + e.vy * k; }
              else if (W.t < bp.land && at < bp.land + 0.05) m.thinkT = Math.min(m.thinkT, Math.max(0.01, bp.land + 0.05 - at + 0.01));
              else if (W.t >= bp.land + 0.1) m.bigp = null; }
            // 젖음·빙판·몰이형: 그 상태이고 과녁이 당분간 못 구르거나 묶였을 때
            else if (noRoll && ((bp.kind === 'wet' && e.st.wet > 0) || (bp.kind === 'ice' && W.zones.some(z => z.src === m && z.k === 'ice' && B.C.inZone(z, e.x, e.y))) || (bp.kind === 'herd' && m.herd && W.t < m.herd.until))) {
              o.v = 60; const k = held > 0 ? 0 : 0.5; o.tx = e.x + e.vx * ld * k; o.ty = e.y + e.vy * ld * k; if (bp.kind === 'herd') { o.tx += -K.uy * m.herd.side * 1.2; o.ty += K.ux * m.herd.side * 1.2; }
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
        else if (PAIRS[s.n] && m.book.includes(PAIRS[s.n].fin) && !((m.cd[PAIRS[s.n].fin] || 0) > 0) && (K.eDown || (PAIRS[s.n].kind === 'wet' && (e.rollCd > 0.4 || e.stam < 1.5)))) { const pr = PAIRS[s.n]; m.bigp = { tgt: e, fin: pr.fin, kind: pr.kind, land: W.t + Tc + landDelay(s, d) + (s.t === 'cone' ? s.dur : 0), bind: bindOf(s, e), until: W.t + Tc + 4 }; }
      },
    };
  },
};
}, {"../brain/techniques/dodgeAim":"src/brain/techniques/dodgeAim.js","../brain/techniques/grab":"src/brain/techniques/grab.js","../brain/techniques/cancel":"src/brain/techniques/cancel.js"}];
D["src/rules/saltRing.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 줄어드는 소금 원 (rules.saltRing, 1.9.0, SPEC 2장)
 * 싸움터 가운데 중심, 15 s부터 60 s 동안 반지름 4 m까지 줄어든다. 선 밖에서 만들어지는 마법은 흩어지고(g = 0), 선 밖에 선 사람은 초당 6 마른다.
 * 두뇌: 선 1.5 m 안쪽으로 오면 가운데로 돌아간다 */
const { hyp } = require('../math');
const SALT = { t0: 15, dur: 60, rMin: 4, dps: 6 };
function saltR(W) { const R0 = hyp(W.width, W.height) / 2; return Math.max(SALT.rMin, R0 - Math.max(0, W.t - SALT.t0) * (R0 - SALT.rMin) / SALT.dur); }
const outSalt = (W, x, y) => W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > saltR(W);
module.exports = {
  name: 'saltRing', on: W => W.rules.saltRing, api: { SALT, saltR, outSalt },
  engine: X => ({
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return outSalt(W, p[0], p[1]); },   // 선 밖에선 마법이 서지 않는다
    mageStep(W, m) { if (outSalt(W, m.x, m.y)) X.hurt(W, m, SALT.dps * X.DT, null, '소금', 'salt'); },   // 선 밖에선 몸이 마른다
  }),
  brain: () => ({
    steer(W, m, K) { const cx = W.width / 2 - m.x, cy = W.height / 2 - m.y, dc = hyp(cx, cy) || 1; if (dc > saltR(W) - 1.5) { K.vx = cx / dc * 2.5; K.vy = cy / dc * 2.5; } },
  }),
};
}, {"../math":"src/math.js"}];
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
    const { inZone, hurt, DT, hyp } = X;
    return {
      // 맞을 때: 흡수 안개(전기 × 0.5, 불 × 0.4), 물 장막(불 × 0.5)
      hurtMod(W, m, v, kind) { for (const z of W.zones) { if (!inZone(z, m.x, m.y)) continue; if (z.k === 'absorb') { if (kind === 'elec') v *= 0.5; if (kind === 'fire') v *= 0.4; } if (z.k === 'mist' && kind === 'fire') v *= 0.5; } return v; },
      // 걸음마다: 선 지대의 효과
      mageZones(W, m) {
        for (const z of W.zones) {
          if (!inZone(z, m.x, m.y)) continue;
          if (z.dps && z.src !== m && z.src.side !== m.side && !z.lured && W.t - (z.src.lureT ?? -9) < 3) { z.lured = 1; z.src.log.lure++; }   // 끌어들인 적이 내 지대에 들었다
          if (z.dps && (z.src !== m || z.k === 'h2s')) hurt(W, m, z.dps * DT, z.src === m ? null : z.src, z.n, z.k === 'fire' ? 'fire' : 'tox');
          if (z.k === 'fire' && !(m.st.wet > 0)) m.st.burn = Math.max(m.st.burn || 0, 1);
          if (z.k === 'nh3') { m.st.blind = Math.max(m.st.blind || 0, 0.3); m.st.cough = Math.max(m.st.cough || 0, 0.5); }
          if (z.k === 'spore') m.st.cough = Math.max(m.st.cough || 0, 0.5);
          if (z.k === 'acid') { m.st.blind = Math.max(m.st.blind || 0, 0.3); if (m.st.lime > 0) m.st.lime = 0; }   // 산이 석회를 녹인다
          if ((z.k === 'ice' || z.k === 'chill') && z.src !== m) m.st.chill = Math.max(m.st.chill || 0, 0.4);
          if (z.k === 'h2s') { m.h2sT = (m.h2sT || 0) + DT; if (m.h2sT > 1.5) m.st.stun = Math.max(m.st.stun || 0, 0.5); }
        }
      },
      // 걸음의 가속: 남의 빙판 위에선 1.5 (보통 9)
      accel(W, m, acc) { for (const z of W.zones) if (z.k === 'ice' && z.src !== m && inZone(z, m.x, m.y)) return 1.5; return acc; },
      // 지대의 시간, 산이 벽을 녹인다
      zoneTick(W) { for (const z of W.zones) { z.t -= DT; if (z.k === 'acid') for (const w of W.walls) if (hyp(w.x - z.x, w.y - z.y) < (z.r || 2) + w.r) w.hp -= 25 * DT; } },
    };
  },
};
}, {}];
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
    const { hurt, DT } = X;
    return {
      ceff(W, m, x) { return m.wave ? x * 1.1 : x; },
      power(W, m, s, x) { return x * (m.wave ? (m.type === '서퍼' ? 2.0 : 1.3) : m.type === '이단' ? 0.8 : m.type === '메타' && m.fat >= 80 && m.fat <= 100 ? 1.08 : 1); },
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
      fatRecover(W, m, k) { return k * (m.type === '메타' ? 1.05 : 1); },   // 메타: 머리 회복 × 1.05
      mageStep(W, m) {
        if (m.crash > 0) m.crash -= DT;
        if (m.wave) {
          // 파도는 몸을 태운다. 깊을수록 세게. 서퍼는 익숙하고 메타는 조절한다. 피로가 75 아래로 내려오면 꺼짐(crash)
          m.waveT += DT; const wd = (1.5 + (m.fat - 90) * 0.06) * (m.type === '서퍼' ? 0.8 : 0.6) * DT;
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
var C = {};
function load(id) {
  var c = C[id]; if (c) return c.exports;
  var d = D[id]; if (!d) throw new Error('묶음에 없는 모듈: ' + id);
  c = C[id] = { exports: {} };
  d[0].call(c.exports, c, c.exports, function (p) { var t = d[1][p]; if (t === undefined) throw new Error(id + ': 묶음에 없는 require ' + p); return load(t); });
  return c.exports;
}
G.Arena = load("src/index.js");
G.ArenaCore = load('src/core.js'); G.ArenaBrain = load('src/brain/index.js'); G.ArenaRegistry = load('src/registry.js');
G.ArenaData = { spells: G.ArenaCore.SPELLS, books: load('data/books.json'), scenes: {"archmage-50":{"v":"1.12.0","name":"대마법사 대 평범 50명 (둘러싸기, node cli.js ring 씨앗 1과 같다)","seed":1,"width":40,"height":30,"maxT":90,"layout":"ring","rules":{},"sides":[{"name":"대마법사","brain":"기본","mages":[{"tier":"대마법사","deck":"광역"}]},{"name":"무리","brain":"기본","mages":[{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"}]}],"spells":{},"decks":{}},"duel":{"v":"1.12.0","name":"1대1: 중간 합법 최강 대 중간 기본기","seed":1,"width":40,"height":30,"maxT":120,"rules":{"barrels":true},"obstacles":[{"x":14,"y":9,"r":1.4},{"x":26,"y":21,"r":1.4},{"x":20,"y":15,"r":1},{"x":11,"y":22,"r":1.1},{"x":29,"y":8,"r":1.1}],"barrels":[{"x":20,"y":9},{"x":20,"y":21}],"walls":[],"sides":[{"name":"청","brain":"기본","mages":[{"tier":"중간","deck":"합법 최강","x":6,"y":15}]},{"name":"적","brain":"기본","mages":[{"tier":"중간","deck":"기본기","x":34,"y":15}]}],"spells":{},"decks":{}},"element-league":{"v":"1.12.0","name":"원소 리그: 평범 여섯이 원소 기본책으로 난전","seed":4,"width":40,"height":30,"maxT":300,"rules":{},"sides":[{"name":"불","brain":"기본","mages":[{"tier":"평범","deck":"불"}]},{"name":"번개","brain":"기본","mages":[{"tier":"평범","deck":"번개"}]},{"name":"흙","brain":"기본","mages":[{"tier":"평범","deck":"흙"}]},{"name":"물","brain":"기본","mages":[{"tier":"평범","deck":"물"}]},{"name":"얼음","brain":"기본","mages":[{"tier":"평범","deck":"얼음"}]},{"name":"독","brain":"기본","mages":[{"tier":"평범","deck":"독"}]}],"spells":{},"decks":{}},"musket-arc":{"v":"1.12.0","name":"머스킷 반원: 대마법사 대 병사 20명","seed":1,"width":40,"height":30,"maxT":90,"rules":{},"obstacles":[{"x":17,"y":11,"r":1},{"x":17,"y":19,"r":1}],"barrels":[],"walls":[{"x":13,"y":13,"r":0.6,"hp":200},{"x":13,"y":17,"r":0.6,"hp":200}],"sides":[{"name":"대마법사","brain":"기본","mages":[{"tier":"대마법사","deck":"광역","x":6,"y":15}]},{"name":"총병","brain":"기본","mages":[{"tier":"병사","deck":"머스킷","x":12.43,"y":3.18},{"tier":"병사","deck":"머스킷","x":14.42,"y":3.61},{"tier":"병사","deck":"머스킷","x":16.32,"y":4.29},{"tier":"병사","deck":"머스킷","x":18.08,"y":5.2},{"tier":"병사","deck":"머스킷","x":19.67,"y":6.32},{"tier":"병사","deck":"머스킷","x":21.05,"y":7.63},{"tier":"병사","deck":"머스킷","x":22.19,"y":9.1},{"tier":"병사","deck":"머스킷","x":23.07,"y":10.69},{"tier":"병사","deck":"머스킷","x":23.66,"y":12.38},{"tier":"병사","deck":"머스킷","x":23.96,"y":14.12},{"tier":"병사","deck":"머스킷","x":23.96,"y":15.88},{"tier":"병사","deck":"머스킷","x":23.66,"y":17.62},{"tier":"병사","deck":"머스킷","x":23.07,"y":19.31},{"tier":"병사","deck":"머스킷","x":22.19,"y":20.9},{"tier":"병사","deck":"머스킷","x":21.05,"y":22.37},{"tier":"병사","deck":"머스킷","x":19.67,"y":23.68},{"tier":"병사","deck":"머스킷","x":18.08,"y":24.8},{"tier":"병사","deck":"머스킷","x":16.32,"y":25.71},{"tier":"병사","deck":"머스킷","x":14.42,"y":26.39},{"tier":"병사","deck":"머스킷","x":12.43,"y":26.82}]}],"spells":{},"decks":{}}} };
})(typeof globalThis !== 'undefined' ? globalThis : this);
