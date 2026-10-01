/* 만든 파일: node cli.js pack (sandbox/pack.js). 손으로 고치지 않는다. 기준은 src/, metrics/, data/, sandbox/scenes/ */
(function (G) {
var D = {};
D["data/blueprints.json"] = [function (module, exports, require) {
module.exports = {"desc":"청사진 = 구조물 배치 묶음 (rules/blueprint, SPEC 28장). 자리는 [a, b, 돌림°]: 진지 자리 A에서 상대 쪽 u로 a m, 옆 p로 b m. 벽은 u를 돌림°만큼 돌린 쪽을 바라보고 그 옆으로 블록을 잇는다. score는 고를 때의 무게(대가부터): 특징(0~1)마다 곱해 더한다. need의 것이 책에 없으면 그 청사진은 고르지 않는다","items":{"wall":{"build":"earth","blocks":2,"th":0.4,"cost":4},"pillar":{"build":"lime","r":0.7,"hp":60,"time":0.4,"cost":3},"trap":{"cast":"trap"},"hidden":{"cast":"trap","hidden":true},"sky":{"cast":"zone","zone":"sky"},"ice":{"cast":"zone","zone":"ice"}},"features":["base","eFly","eGround","approach","far","tired","hurt"],"blueprints":{"반원 보루":{"desc":"내 둘레 반원(반지름 3.5 m)에 흙벽 다섯: 물러나 버틸 때","items":[["wall",3.5,0,0],["wall",2.5,2.5,45],["wall",2.5,-2.5,-45],["wall",0,3.5,90],["wall",0,-3.5,-90]],"need":["wall"],"score":{"base":0.2,"tired":1,"hurt":1.2,"eGround":0.3}},"몰이길":{"desc":"8 m 앞 흙벽 넷에 가운데 틈 하나, 벽 끝에 함정 둘, 틈 안쪽에 안 보이는 함정: 땅으로 다가오는 상대","items":[["wall",8,1.6,0],["wall",8,-1.6,0],["wall",8,3.8,0],["wall",8,-3.8,0],["trap",8,5.6,0],["trap",8,-5.6,0],["hidden",6.5,0,0]],"need":["wall","trap"],"score":{"base":0.1,"eGround":1,"approach":1}},"함정 격자":{"desc":"5~10 m 앞에 2.4 m 간격 함정 3 × 3 (연쇄 거리 안), 가운데 줄은 안 보이게","items":[["trap",5,-2.4,0],["trap",5,0,0],["trap",5,2.4,0],["hidden",7.4,-2.4,0],["hidden",7.4,0,0],["hidden",7.4,2.4,0],["trap",9.8,-2.4,0],["trap",9.8,0,0],["trap",9.8,2.4,0]],"need":["trap"],"score":{"eGround":1.2,"approach":0.6}},"하늘 막기":{"desc":"하늘 덮개 하나와 석회 기둥 넷(앞 둘·옆 둘): 날아드는 상대","items":[["sky",2,0,0],["pillar",3,1.8,0],["pillar",3,-1.8,0],["pillar",0,3,0],["pillar",0,-3,0]],"need":["sky"],"score":{"eFly":1.5,"approach":0.5}},"엄폐 사다리":{"desc":"상대 쪽으로 4 m마다 좌우 번갈아 석회 기둥 넷: 멀리서 다가가며 기둥에서 기둥으로","items":[["pillar",4,1.5,0],["pillar",8,-1.5,0],["pillar",12,1.5,0],["pillar",16,-1.5,0]],"need":["pillar"],"score":{"far":0.3,"eGround":0.2}}}};
}, {}];
D["data/books.json"] = [function (module, exports, require) {
module.exports = {"불":["불덩이","화염 방사","소이 캡슐","폭굉 추진","불벽","숨 덫"],"번개":["라이트닝","체인","낙뢰","맨손 방전","다리 자극","흘리기 막","번개 지뢰","근육 경직"],"흙":["돌 창","돌 압축탄","곡사 돌","솟는 발판","석회 기둥","석회 방패","흙 꺼짐","석회 굳히기","가두는 기둥"],"물":["물 망치","물 대포","물길 미끄럼","물 장막","흡수 안개","진흙 웅덩이"],"얼음":["얼음 창","저격 창","서리 깔기","얼음 미끄럼","얼음 기둥","얼음 덫","얼음 족쇄"],"독":["황화수소 캡슐","암모니아 캡슐","초산 분사","유도 포자","독 장막","독 웅덩이","균사 그물"]};
}, {}];
D["data/decks.json"] = [function (module, exports, require) {
module.exports = {"합법 최강":["불기둥","비 뿌리기","땅 번개","짧은 실","근육 폭주","불고리","석회 방패","번개 그물","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"],"광역":["낙뢰","번개 그물","체인","불기둥","화염 방사","돌 비","짧은 실","석회 방패","석회 기둥","솟는 발판","근육 폭주","불고리","비 뿌리기","땅 번개"],"기본기":["돌 압축탄","라이트닝","불덩이","물 망치","얼음 창","석회 방패","다리 자극"],"머스킷":["머스킷"],"박격포":["박격포"],"기술":["짧은 실","체인","번개 그물","흙 손","불기둥","불벽","번개 지뢰","석회 방패","산 안개","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"],"큰 수":["번개 그물","물 대포","빙판","불벽","짧은 실","땅 번개","석회 방패","대낙뢰","화산 기둥","번개 창"],"도발 합법 최강":["도발","불기둥","비 뿌리기","땅 번개","짧은 실","근육 폭주","불고리","석회 방패","번개 그물"],"조약돌":["조약돌","근육 폭주"],"무거운 돌":["무거운 돌","조약돌","근육 폭주"],"번쩍 돌":["번쩍임","무거운 돌","조약돌","근육 폭주"],"열선":["열선","번쩍임","짧은 실","석회 방패","근육 폭주"],"대마법사 성":["흙벽","보루","벽 밀기","낙뢰","번개 그물","체인","불기둥","화염 방사","돌 비","짧은 실","석회 방패","번쩍임","흙먼지","근육 폭주"],"대마법사 운영":["낙뢰","번개 그물","체인","짧은 실","화염 방사","돌 비","석회 방패","석회 기둥","빙판","불벽","산 안개","벽 밀기","흙벽","번쩍임","흙먼지","근육 폭주"],"대마법사 진지":["흙벽","석회 기둥","번개 지뢰","숨 덫","흙 꺼짐","하늘 덮개","빙판","비 뿌리기","불기둥","걸어둔 구름","낙뢰","번개 그물","체인","짧은 실","석회 방패","벽 밀기"],"대마법사 청사진":["청사진","흙벽","석회 기둥","번개 지뢰","숨 덫","흙 꺼짐","하늘 덮개","빙판","비 뿌리기","불기둥","걸어둔 구름","낙뢰","번개 그물","체인","짧은 실","석회 방패","벽 밀기"]};
}, {}];
D["data/gear.json"] = [function (module, exports, require) {
module.exports = {"default":{"soles":true},"items":{"soles":{"이름":"소금 밑창","설명":"안 보이는 발밑 공격(지연 폭발)의 피해·묶임·굳힘을 × 0.3 (WORLD 148)"},"cloak":{"이름":"소금 망토","설명":"두른 사람 1.6 m 안에서 남의 장악 몫 × 0.3 (WORLD 148)"},"silver":{"이름":"은실 옷","설명":"은이 몸에 닿는 응답을 끊는다(WORLD 3-4): 굳음·묶임·몸 묶기의 길이 × 0.5. 은은 전기를 잘 통해 전기 피해 × 1.1. 수는 data/rules/silver.json. rules.silver가 켜졌을 때만 (SPEC 10장)"},"mirror":{"이름":"유리 비단 거울","설명":"빛을 모아 곧게 보내는 거울. 있어야 열선을 쓴다 (rules.light, SPEC 25장)"},"goggles":{"이름":"연기 안경","설명":"번쩍임의 눈멂 × 0.5 (rules.light, SPEC 25장)"}}};
}, {}];
D["data/rules/army.json"] = [function (module, exports, require) {
module.exports = {"musket":{"R":100,"cast":0.1,"fuse":[0.1,0.5],"reload":[15,20],"aimN":0.004,"aimD":0.0004},"mortar":{"spread":0.05,"min":5},"volleyT":17.5,"farFly":{"z":2,"d":50},"morale":{"every":0.5,"cas":0.2,"casK":2,"shock":0.35,"shockR":10,"shockDmg":50,"decay":0.5,"minSide":3,"skill":{"초보":1,"중급":1.3,"상급":1.6,"대가":2,"전설":2.5},"edge":1}};
}, {}];
D["data/rules/blueprint.json"] = [function (module, exports, require) {
module.exports = {"maxLanes":10,"buildD":30,"backD":16,"near":60,"again":8,"value":5};
}, {}];
D["data/rules/bulwark.json"] = [function (module, exports, require) {
module.exports = {"rate":0.6,"rateP":632000,"block":{"gap":0.8,"r":0.45,"h":1.6,"hpM3":400},"stopThick":0.5,"bullet":2,"heavyM":5,"heavy":500,"water":10,"ice":{"melt":0.5,"fire":20},"pit":{"r":0.7,"out":1.1,"speed":0.5},"upkeep":{"glu":0.8,"max":15},"topple":{"depth":2.5,"reach":6},"maxBuild":20};
}, {}];
D["data/rules/flight.json"] = [function (module, exports, require) {
module.exports = {"P0":2000,"Pk":2.5,"minP":75000,"lift":150000,"liftV":20,"glideVz":4,"mass":80,"g":9.8,"drag":0.135,"zMin":2,"zMax":15,"vzMax":8,"vzAcc":12,"vMax":100,"fwdG":3,"latG":5,"latK":0.08,"latP":300000,"corner":25,"film":60,"filmBlind":0.3,"pow":0.8,"powL":[1.15,0.6,0.5],"fat":[1,6,40],"fall":4,"fallStun":1,"elec":1.3,"cloud":1.3,"arena":[200,150],"arenaC":10,"graze":{"v":15,"within":2},"cut":{"brake":5,"side":5,"sideT":0.25,"hop":3,"hopT":0.3,"dive":4,"cush":5,"soft":2,"safeV":4,"fat":1.5,"cd":0.6,"minZ":1.5,"within":2,"brain":{"margin":[0,0,0.8,0.5],"catch":3.5,"tca":0.45,"tcaL":0.8,"miss":1.2,"release":0.25,"strikeZ":4,"strikeT":0.25,"catchS":2,"again":2,"hopRead":0.35}},"brain":{"hover":3,"approach":50,"full":100,"slow":15,"z":6,"zLow":3,"zHigh":15,"near":10,"danger":6,"crowd":8,"elecMany":2,"bind":2,"lead":1.5,"leadV":60,"tiredFat":60,"hopN":2,"hopT":3,"restFat":999,"restWave":100,"guns":3,"zCrowd":10,"vCrowd":5,"waveLand":true,"gunFar":110,"ownGap":2,"gunR":30,"feintV":40,"strike":1.5,"survive":{"land":75,"up":45,"low":70,"lowT":1,"danger":6}}};
}, {}];
D["data/rules/fort.json"] = [function (module, exports, require) {
module.exports = {"trapK":1,"chainR":3.5,"chainDelay":0.2,"chainPad":0.4,"sky":{"every":15,"stun":0.4,"dmg":4},"brain":{"R":10,"near":60,"buildD":30,"backD":16,"relocate":35,"home":14,"skyAt":2,"gapR":2.5,"budget":12,"again":20,"stand":0.8,"wallAt":1.35,"line":8,"seg":2.6,"end":6.8,"kill":5,"breachR":14,"ring":20}};
}, {}];
D["data/rules/reflex.json"] = [function (module, exports, require) {
module.exports = {"win":0.5,"pad":0.4,"read":0.3,"aheadT":[0.05,1.2],"aheadR":1.5,"aheadMin":2,"stopV":3,"stopT":0.25,"flipT":0.25,"dodgeT":0.2,"airV":25,"lrtZ":2.5,"lrtCush":0.3,"jukeWin":0.4,"after":0.3};
}, {}];
D["data/rules/response.json"] = [function (module, exports, require) {
module.exports = {"reflex":{"window":0.2,"again":0.25},"brace":{"k":0.6,"dur":0.6,"fat":5,"speed":0.3,"within":0.35,"minDmg":12},"unbind":{"fat":12,"glu":4,"cd":5,"min":0.5},"levels":{"초보":{"reflex":0,"brace":false,"unbind":false},"중급":{"reflex":0.3,"brace":true,"unbind":false},"상급":{"reflex":0.5,"brace":true,"unbind":true},"대가":{"reflex":0.7,"brace":true,"unbind":true},"전설":{"reflex":0.85,"brace":true,"unbind":true}},"noSkill":{"autoDodge":{"reflex":0.4,"brace":true,"unbind":false},"plain":{"reflex":0,"brace":false,"unbind":false}}};
}, {}];
D["data/rules/silver.json"] = [function (module, exports, require) {
module.exports = {"hold":0.5,"elec":1.1,"speed":1};
}, {}];
D["data/rules/snap.json"] = [function (module, exports, require) {
module.exports = {"baseG":2.5,"maxG":5,"brake":2,"chop":0.12,"flip":[0.35,0.75],"flipK":1.6,"saw":[4,-4,2],"sawK":2,"bounce":[0.45,0.7],"bounceZ":[3.5,8],"strafeV":6,"strafeD":10};
}, {}];
D["data/rules/tactics.json"] = [function (module, exports, require) {
module.exports = {"every":[2,1],"stick":0.25,"stall":[8,0.6],"learn":[3,2,1],"score":{"finish":{"eLow":2.5,"finishable":1.2,"lead":1},"press":{"base":0.6,"lead":1,"eWeak":0.8,"stronger":0.4,"tired":-0.8},"attrit":{"base":0.5,"rangeAdv":1,"behind":0.8,"eTired":0.3},"hunt":{"base":0.2,"covered":2},"herd":{"terrain":0.3,"eGround":0.2,"eBack":0.5},"fort":{"build":0.3,"hurt":0.8}},"counter":{"press":{"attrit":0.5,"fort":0.3},"attrit":{"press":0.6,"hunt":0.3},"fort":{"press":0.4,"herd":0.4}},"readVt":[2,-1],"aggr":{"finish":1.6,"press":1.25,"fort":0.8},"value":{"attritInd":1.4,"attritDir":0.7,"pressDir":1.2,"finishOff":1.5,"finishDef":0.7,"huntInd":1.3,"herd":1.6,"fortOff":0.8,"shapeAfter":1.5},"angle":{"orbit":0.5,"travel":0.02,"los":1,"losSoft":0.3,"oneSide":1,"exposed":0.5,"peek":0.6,"strip":1.5,"cut":1,"barrel":0.5,"height":0.4,"danger":1,"edge":0.5},"radial":0.4,"keep":0.3,"spiral":1,"spiralEdge":18,"circleLv":2,"force":{"hidden":2,"sky":1.6,"gate":2,"path":1.8},"shapeAfter":1.5,"forceWin":1.2,"forceMove":2};
}, {}];
D["data/skills.json"] = [function (module, exports, require) {
module.exports = {"roll":{"rollCap":0.85,"rollBias":[0.6,0.9]},"basic":{"readCast":true,"lead":1,"combo":true,"crowd":true,"stance":false,"lever":false,"pathTrap":false,"slotB":false,"terrain":false,"readWave":false,"cdRead":false,"outrange":false,"focusLow":false},"levels":{"초보":{"dec":0.3,"noise":0.14,"autoDodge":false,"circles":"half","from":"basic","tac":{"flySkill":1,"dodge":0.15,"rest":60,"readCast":false,"lead":0.2,"combo":false,"crowd":false,"castMove":0,"pause":[0.3,0.6],"shieldAny":true}},"중급":{"dec":0.2,"noise":0.08,"autoDodge":false,"circles":"minus1","from":"basic","tac":{"flySkill":2,"dodge":0.45,"rest":75}},"상급":{"dec":0.13,"noise":0.04,"autoDodge":true,"circles":"same","from":"basic","tac":{"flySkill":3,"flyCut":1,"fortify":1,"chop":true,"footwork":1,"blueprint":1,"wallSite":true,"retreat":true,"rhythm":"mimic","buffNeed":true,"dodge":0.75,"rest":80,"stance":true,"lever":true,"pathTrap":true,"plan":true,"combo2":true,"shieldSave":true,"cancel":true,"cover":true,"tempo":true,"dodgeAim":true}},"대가":{"dec":0.08,"noise":0.02,"autoDodge":true,"circles":"same","from":"basic","tac":{"flySkill":4,"flyCut":2,"survive":true,"sharp":true,"fortify":2,"breach":true,"reflex":0.1,"chop":true,"footwork":2,"blueprint":2,"ops":1,"wallSite":true,"retreat":true,"wallBreak":true,"rhythm":true,"rhythmTime":true,"domainPush":true,"efficacy":true,"buffNeed":true,"shape":true,"roles":true,"dodge":1,"rest":80,"stance":true,"lever":true,"pathTrap":true,"plan":true,"combo2":true,"shieldSave":true,"cancel":true,"cover":true,"tempo":true,"coverW":2,"herd":true,"strip":true,"lure":true,"simul":false,"cancel2":true,"bigPlan":true,"dodgeAim":true,"grab":true,"feint":false,"focusLow":true,"terrain":true,"slotB":true,"slotBOff":false,"readWave":true,"cdRead":true,"outrange":true}},"전설":{"dec":0.05,"noise":0.01,"autoDodge":true,"circles":"plus1","from":"대가","tac":{"flySkill":5,"flyCut":3,"fortify":3,"reflex":0.05,"footwork":3,"ops":2,"feint":0.12,"simul":true,"shieldSave":false,"learn":true,"learnAim":"wide","waveChoose":true,"counter":true,"coverW":2.5,"bait":true,"fakeRetreat":true,"triple":true}}}};
}, {}];
D["data/spells/order.json"] = [function (module, exports, require) {
module.exports = ["불덩이","화염 방사","소이 캡슐","폭굉 추진","불벽","숨 덫","라이트닝","체인","낙뢰","맨손 방전","다리 자극","흘리기 막","번개 지뢰","돌 창","돌 압축탄","곡사 돌","솟는 발판","석회 기둥","석회 방패","흙 꺼짐","물 망치","물 대포","물길 미끄럼","물 장막","흡수 안개","진흙 웅덩이","얼음 창","저격 창","서리 깔기","얼음 미끄럼","얼음 기둥","얼음 덫","황화수소 캡슐","암모니아 캡슐","초산 분사","유도 포자","독 장막","독 웅덩이","불고리","그을음 연막","갈래 불덩이","불 씨앗","짧은 실","번개 그물","근육 폭주","걸어둔 구름","하늘 덮개","청사진","갈래 돌","흙먼지","흙 손","큰 바위","비 뿌리기","끓는 물","안개 걸음","물 올가미","빙판","얼음 껍질","얼음 산탄","얼음 담","산 안개","마비 포자","포자 벽","독 이끼","불기둥","땅 번개","가시 솟기","발 얼리기","돌 비","공중 격추","흙 이불","얼음 절연","해독 균","바위 박차기","머스킷","도발","대낙뢰","화산 기둥","번개 창","균사 그물","얼음 족쇄","근육 경직","석회 굳히기","가두는 기둥"];
}, {}];
D["data/spells/독.json"] = [function (module, exports, require) {
module.exports = {"황화수소 캡슐":{"n":"황화수소 캡슐","el":"독","t":"proj","m":0.2,"v":14,"R":14,"cost":4,"cast":0.35,"cd":2,"burst":{"zone":{"k":"h2s","shape":"circle","r":1.5,"d":8,"dps":9}},"role":"공격","banned":1},"암모니아 캡슐":{"n":"암모니아 캡슐","el":"독","t":"proj","m":0.2,"v":14,"R":14,"cost":3,"cast":0.35,"cd":1.8,"burst":{"zone":{"k":"nh3","shape":"circle","r":1.6,"d":5,"dps":1}},"role":"공격"},"초산 분사":{"n":"초산 분사","el":"독","t":"cone","L":3,"dur":0.4,"dps":6,"kind":"tox","blind":1.5,"cost":2,"cast":0.15,"cd":1.5,"role":"공격"},"유도 포자":{"n":"유도 포자","el":"독","t":"proj","m":0.05,"v":3.5,"R":30,"life":5,"home":1,"cost":4,"cast":0.3,"cd":4,"hit":{"flat":12,"kind":"tox","cough":2.5},"role":"공격"},"독 장막":{"n":"독 장막","el":"독","t":"zone","z":{"k":"nh3","shape":"line","len":5,"d":6,"dps":1},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"독 웅덩이":{"n":"독 웅덩이","el":"독","t":"trap","tr":{"dmg":3,"zone":{"k":"h2s","shape":"circle","r":1.4,"d":6,"dps":9},"r":1},"vis":0,"cost":4,"cast":0.3,"cd":3,"role":"함정","banned":1},"산 안개":{"n":"산 안개","el":"독","tags":["wall","ranged"],"desc":"눈을 멀게 하고 벽을 녹인다","t":"zone","z":{"k":"acid","shape":"circle","r":2.5,"d":4,"dps":2},"R":8,"cost":4,"cast":0.3,"cd":4,"role":"공격"},"마비 포자":{"n":"마비 포자","el":"독","tags":["kite","close"],"desc":"닿으면 다리가 굳는 포자","t":"proj","m":0.05,"v":5,"R":20,"life":4,"home":1,"cost":4,"cast":0.3,"cd":4,"hit":{"flat":6,"kind":"tox","root":1},"role":"공격"},"포자 벽":{"n":"포자 벽","el":"독","tags":["close"],"desc":"포자 줄. 넘으면 기침","t":"zone","z":{"k":"spore","shape":"line","len":5,"d":6,"dps":3},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"독 이끼":{"n":"독 이끼","el":"독","tags":["miss","close"],"desc":"값싼 독 함정","t":"trap","tr":{"dmg":3,"zone":{"k":"h2s","shape":"circle","r":1.2,"d":5,"dps":8},"r":0.9},"vis":0,"cost":2,"cast":0.2,"cd":1.2,"role":"함정","banned":1},"해독 균":{"n":"해독 균","el":"독","t":"buff","b":{"toxRes":0.5,"d":4},"cost":3,"cast":0.1,"cd":6,"role":"방어","desc":"해독 균막"},"균사 그물":{"n":"균사 그물","el":"독","t":"proj","m":0.1,"v":28,"R":12,"cost":3,"cast":0.3,"cd":3,"hit":{"dmg":4,"kind":"tox","mycel":2},"role":"공격","rule":"bodyBind","desc":"균사를 뭉쳐 던진다. 맞으면 2초 동안 구르지 못하고 × 0.6으로 걷는다. 불에 타면 풀린다","rad":0.4}};
}, {}];
D["data/spells/물.json"] = [function (module, exports, require) {
module.exports = {"물 망치":{"n":"물 망치","el":"물","t":"proj","m":1,"v":26,"R":16,"cost":3,"cast":0.3,"cd":1.2,"hit":{"kind":"blunt","wet":1,"cap":12},"role":"공격"},"물 대포":{"n":"물 대포","el":"물","t":"cone","L":6,"dur":0.5,"dps":5,"kind":"blunt","wet":1,"push":6,"cost":3,"cast":0.2,"cd":1.8,"role":"공격"},"물길 미끄럼":{"n":"물길 미끄럼","el":"물","t":"move","mv":"glide","dist":5,"cost":2,"cast":0.05,"cd":2,"role":"이동"},"물 장막":{"n":"물 장막","el":"물","t":"zone","z":{"k":"mist","shape":"line","len":5,"d":6},"R":4,"cost":2,"cast":0.3,"cd":4,"role":"방어"},"흡수 안개":{"n":"흡수 안개","el":"물","t":"zone","z":{"k":"absorb","shape":"circle","r":2.5,"d":5},"R":6,"cost":4,"cast":0.3,"cd":6,"role":"방어"},"진흙 웅덩이":{"n":"진흙 웅덩이","el":"물","t":"trap","tr":{"dmg":2,"root":1.2,"wet":1,"r":1},"vis":1,"cost":3,"cast":0.25,"cd":2,"role":"함정"},"비 뿌리기":{"n":"비 뿌리기","el":"물","tags":["fire","tox","spore"],"desc":"불을 끄고 독과 포자를 씻어 내리는 비","t":"zone","z":{"k":"rain","shape":"circle","r":3,"d":1},"R":6,"cost":4,"cast":0.3,"cd":4,"role":"방어"},"끓는 물":{"n":"끓는 물","el":"물","tags":["miss","weak"],"desc":"물을 끓여 쏜다. 적시지 않고 데운다","t":"proj","m":0.8,"v":24,"R":14,"cost":4,"cast":0.35,"cd":1.3,"hit":{"kind":"fire","flat":14,"burn":1.5},"role":"공격"},"안개 걸음":{"n":"안개 걸음","el":"물","tags":["ranged","elec"],"desc":"안개를 두르고 빨라진다","t":"buff","b":{"speed":0.25,"d":3,"smoke":1},"cost":2,"cast":0.1,"cd":4,"role":"이동"},"물 올가미":{"n":"물 올가미","el":"물","tags":["miss","kite"],"desc":"물줄기가 발목을 감는다","t":"area","r":1.2,"delay":0.5,"dmg":3,"root":1.2,"wet":1,"vis":0,"R":8,"cost":3,"cast":0.2,"cd":2.5,"role":"공격"}};
}, {}];
D["data/spells/번개.json"] = [function (module, exports, require) {
module.exports = {"라이트닝":{"n":"라이트닝","el":"번개","t":"thread","E":320,"R":12,"cost":5,"cast":0.3,"cd":1.8,"role":"공격"},"체인":{"n":"체인","el":"번개","t":"thread","E":220,"R":10,"cost":4,"cast":0.25,"cd":1.4,"role":"공격"},"낙뢰":{"n":"낙뢰","el":"번개","t":"area","r":1.6,"delay":1.3,"dmg":30,"kind":"elec","stun":1,"vis":1,"R":18,"cost":7,"cast":0.3,"cd":3,"role":"공격"},"맨손 방전":{"n":"맨손 방전","el":"번개","t":"touch","dmg":25,"stun":0.8,"cost":2,"cast":0.05,"cd":0.9,"role":"공격"},"다리 자극":{"n":"다리 자극","el":"번개","t":"buff","b":{"speed":0.4,"d":1},"cost":2,"cast":0.05,"cd":3,"role":"이동"},"흘리기 막":{"n":"흘리기 막","el":"번개","t":"buff","b":{"elecRes":0.2,"front":1,"d":0.4},"cost":2,"cast":0.03,"cd":1.4,"role":"방어","react":1},"번개 지뢰":{"n":"번개 지뢰","el":"번개","t":"trap","tr":{"dmg":14,"kind":"elec","stun":0.5,"r":0.9},"vis":0,"cost":4,"cast":0.3,"cd":2,"role":"함정"},"짧은 실":{"n":"짧은 실","el":"번개","tags":["miss","close"],"desc":"가까운 거리에서 실을 두 배로 빨리 뻗는다","t":"thread","E":300,"R":6,"fast":2,"cost":3,"cast":0.15,"cd":1,"role":"공격"},"번개 그물":{"n":"번개 그물","el":"번개","tags":["miss"],"desc":"작은 구름을 반 박자 만에","t":"area","r":1.1,"delay":0.55,"dmg":18,"kind":"elec","stun":0.8,"vis":1,"R":10,"cost":5,"cast":0.2,"cd":2.5,"role":"공격"},"근육 폭주":{"n":"근육 폭주","el":"번개","tags":["ranged","kite"],"desc":"반 초에 75% 빠르게. 붙기 위한 한 걸음","t":"buff","b":{"speed":0.75,"d":0.5},"cost":2,"cast":0.03,"cd":2.5,"role":"이동"},"걸어둔 구름":{"n":"걸어둔 구름","el":"번개","tags":["kite","ranged"],"desc":"3초 뒤 내려칠 큰 구름. 그 자리를 못 쓰게","t":"area","r":2.6,"delay":3,"dmg":26,"kind":"elec","stun":1,"vis":1,"R":16,"cost":7,"cast":0.3,"cd":5,"role":"함정"},"하늘 덮개":{"n":"하늘 덮개","el":"번개","tags":["fort"],"desc":"진지 위에 번개 구름을 깔아 둔다. 날아드는 상대를 0.5 s마다 굳혀 떨어뜨린다 (땅엔 닿지 않는다, 진지 규칙)","t":"zone","z":{"k":"sky","shape":"circle","r":5,"d":15},"R":12,"cost":6,"cast":0.5,"cd":8,"vis":1,"role":"방어","rule":"fort"},"땅 번개":{"n":"땅 번개","el":"번개","t":"area","r":0.9,"delay":0.35,"dmg":18,"kind":"elec","stun":0.6,"vis":0,"R":7,"cost":4,"cast":0.2,"cd":1.8,"role":"공격","desc":"상대 발밑 흙에 전하를 모아 두 발 사이로 흘린다"},"공중 격추":{"n":"공중 격추","el":"번개","t":"shoot","r":6,"cost":3,"cast":0.05,"cd":2,"role":"방어","desc":"날아오는 물·얼음·불·포자를 공중에서 터뜨린다. 돌은 못 떨어뜨린다"},"대낙뢰":{"n":"대낙뢰","el":"번개","t":"area","r":2.2,"delay":0.5,"dmg":60,"kind":"elec","stun":1.2,"vis":1,"R":14,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"하늘 가득 전하를 모아 한 번에 떨어뜨린다. 모으는 동안 맞으면 역류한다"},"번개 창":{"n":"번개 창","el":"번개","t":"thread","E":4000,"R":12,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"실 하나에 모든 전하를 싣는다"},"근육 경직":{"n":"근육 경직","el":"번개","t":"thread","E":120,"R":10,"cramp":2,"cost":3,"cast":0.15,"cd":3,"role":"공격","rule":"bodyBind","desc":"약한 실로 다리 근육을 굳힌다. 2초 동안 구르지 못하고 × 0.5로 걷는다. 절연이 막는다","fast":2}};
}, {}];
D["data/spells/불.json"] = [function (module, exports, require) {
module.exports = {"불덩이":{"n":"불덩이","el":"불","t":"proj","m":0.3,"v":26,"R":16,"cost":4,"cast":0.35,"cd":1.4,"hit":{"dmg":10,"kind":"fire","burn":2.5,"zone":{"k":"fire","r":1,"d":2}},"role":"공격"},"화염 방사":{"n":"화염 방사","el":"불","t":"cone","L":3.6,"dur":1,"dps":22,"kind":"fire","burn":2,"cost":5,"cast":0.2,"cd":2.2,"role":"공격"},"소이 캡슐":{"n":"소이 캡슐","el":"불","t":"proj","m":0.5,"v":20,"R":14,"cost":5,"cast":0.4,"cd":1.8,"burst":{"r":1.4,"dmg":16,"kind":"fire","burn":2},"role":"공격"},"폭굉 추진":{"n":"폭굉 추진","el":"불","t":"move","mv":"dash","dist":5,"self":3,"cost":3,"cast":0.1,"cd":2,"role":"이동"},"불벽":{"n":"불벽","el":"불","t":"zone","z":{"k":"fire","shape":"line","len":4,"d":4,"dps":12},"R":7,"cost":5,"cast":0.35,"cd":3,"role":"방어"},"숨 덫":{"n":"숨 덫","el":"불","t":"trap","tr":{"dmg":18,"kind":"fire","burn":2,"r":1.3},"vis":0,"cost":4,"cast":0.3,"cd":2,"role":"함정"},"불고리":{"n":"불고리","el":"불","tags":["spore","tox","close"],"desc":"몸 둘레 3m를 한순간 태워 날아오는 포자와 독을 없앤다","t":"ring","r":3,"dmg":6,"kill":1,"cost":4,"cast":0.15,"cd":3,"role":"방어"},"그을음 연막":{"n":"그을음 연막","el":"불","tags":["ranged","blunt","elec"],"desc":"덜 탄 연기로 겨냥을 흐린다","t":"zone","z":{"k":"smoke","shape":"circle","r":2.5,"d":5},"R":4,"cost":3,"cast":0.2,"cd":5,"role":"방어"},"갈래 불덩이":{"n":"갈래 불덩이","el":"불","tags":["miss"],"desc":"불덩이를 세 갈래로","t":"proj","m":0.3,"v":18,"R":16,"multi":3,"cost":5,"cast":0.4,"cd":1.6,"hit":{"dmg":5,"kind":"fire","burn":1.5},"role":"공격"},"불 씨앗":{"n":"불 씨앗","el":"불","tags":["miss","close"],"desc":"값싼 불 함정을 여러 개","t":"trap","tr":{"dmg":14,"kind":"fire","burn":2,"r":1.2},"vis":0,"cost":2,"cast":0.2,"cd":1,"role":"함정"},"불기둥":{"n":"불기둥","el":"불","t":"area","r":1.2,"delay":0.45,"dmg":16,"kind":"fire","burn":2,"vis":0,"R":9,"cost":5,"cast":0.25,"cd":2.2,"role":"공격","desc":"상대 발밑에 메탄을 모아 솟구치게 한다. 보이지 않는다"},"화산 기둥":{"n":"화산 기둥","el":"불","t":"area","r":1.5,"delay":0.4,"dmg":55,"kind":"fire","burn":3,"vis":0,"R":9,"cost":10,"cast":0.6,"cd":5,"role":"공격","big":1,"rule":"risk","desc":"발밑 깊이 메탄과 열을 모아 터뜨린다. 보이지 않는다"}};
}, {}];
D["data/spells/빛.json"] = [function (module, exports, require) {
module.exports = {"번쩍임":{"n":"번쩍임","el":"빛","t":"flash","desc":"손끝에서 만든 빛이 곧바로 닿는다. 시야가 이어진 적을 눈멀게 한다(1.5 s). 연기·안개·비·흙먼지가 가리고 연기 안경이 절반","R":70,"blind":1.5,"dmg":1,"kind":"heat","cost":4,"cast":0.4,"cd":6,"role":"공격","rule":"light"},"열선":{"n":"열선","el":"빛","t":"beam","desc":"예비동작 동안 핵이 빛나 보인다. 쏘면 곧바로 닿는 열. 거리에 따라 약해지고(반감 15 m) 연기·안개·비를 지나면 × 0.4. 유리 비단 거울이 있어야 쓴다","R":30,"dmg":28,"L":15,"kind":"heat","cost":6,"cast":0.8,"cd":3,"role":"공격","rule":"light","needGear":"mirror"}};
}, {}];
D["data/spells/신호.json"] = [function (module, exports, require) {
module.exports = {"도발":{"n":"도발","el":"신호","t":"taunt","R":10,"cost":2,"cast":0.1,"cd":4,"role":"방어","rule":"taunt","desc":"상대의 부름에 헛신호를 섞어 끊는다. 이단은 걸리지 않는다"}};
}, {}];
D["data/spells/얼음.json"] = [function (module, exports, require) {
module.exports = {"얼음 창":{"n":"얼음 창","el":"얼음","t":"proj","m":0.12,"v":32,"R":18,"cost":3,"cast":0.35,"cd":1.4,"hit":{"kind":"blunt","chill":2},"role":"공격"},"저격 창":{"n":"저격 창","el":"얼음","t":"proj","m":0.2,"v":60,"R":30,"cost":6,"cast":1.1,"cd":3,"lock":1,"hit":{"kind":"blunt","flat":35,"stun":0.5},"role":"공격"},"서리 깔기":{"n":"서리 깔기","el":"얼음","t":"zone","z":{"k":"ice","shape":"circle","r":1.8,"d":6,"needWet":1},"R":7,"cost":3,"cast":0.3,"cd":2.5,"role":"공격"},"얼음 미끄럼":{"n":"얼음 미끄럼","el":"얼음","t":"move","mv":"glide","dist":5,"cost":2,"cast":0.05,"cd":2,"role":"이동"},"얼음 기둥":{"n":"얼음 기둥","el":"얼음","t":"wall","hp":35,"dur":10,"r":0.6,"at":1.4,"cost":3,"cast":0.3,"cd":2.5,"role":"방어"},"얼음 덫":{"n":"얼음 덫","el":"얼음","t":"trap","tr":{"dmg":4,"chill":3,"root":1,"r":1},"vis":1,"cost":3,"cast":0.25,"cd":2,"role":"함정"},"빙판":{"n":"빙판","el":"얼음","tags":["close","kite"],"desc":"물 없이 공기의 습기로 바닥을 얼린다","t":"zone","z":{"k":"ice","shape":"circle","r":2.5,"d":6},"R":7,"cost":4,"cast":0.3,"cd":4,"role":"함정"},"얼음 껍질":{"n":"얼음 껍질","el":"얼음","tags":["blunt"],"desc":"몸을 얼음으로 덮는다","t":"buff","b":{"bluntRes":0.5,"d":2.5},"cost":3,"cast":0.1,"cd":5,"role":"방어"},"얼음 산탄":{"n":"얼음 산탄","el":"얼음","tags":["miss"],"desc":"얼음 조각 네 갈래","t":"proj","m":0.05,"v":30,"R":10,"multi":4,"cost":3,"cast":0.3,"cd":1,"hit":{"kind":"blunt","chill":1},"role":"공격"},"얼음 담":{"n":3,"el":"얼음","tags":["ranged","elec"],"desc":"기둥 셋을 잇는 담","t":"wall","hp":40,"dur":10,"r":0.6,"at":1.4,"cost":5,"cast":0.4,"cd":4,"role":"방어"},"발 얼리기":{"n":"발 얼리기","el":"얼음","t":"area","r":1,"delay":0.5,"dmg":4,"kind":"blunt","root":1.4,"chill":2,"vis":0,"R":9,"cost":3,"cast":0.2,"cd":2,"role":"공격","desc":"발밑 습기를 얼려 신발을 땅에 붙인다"},"얼음 절연":{"n":"얼음 절연","el":"얼음","t":"buff","b":{"elecRes":0.3,"d":2.5},"cost":3,"cast":0.1,"cd":5,"role":"방어","desc":"몸을 맑은 얼음으로 덮어 번개를 막는다"},"얼음 족쇄":{"n":"얼음 족쇄","el":"얼음","t":"proj","m":0.1,"v":22,"R":12,"cost":4,"cast":0.3,"cd":4,"hit":{"dmg":4,"kind":"blunt","fetter":1.5},"role":"공격","rule":"bodyBind","desc":"젖은 발목의 물을 얼려 1.5초 묶는다. 마른 적에겐 듣지 않고, 불에 녹는다"}};
}, {}];
D["data/spells/없음.json"] = [function (module, exports, require) {
module.exports = {"머스킷":{"n":"머스킷","el":"없음","t":"proj","m":0.03,"v":300,"R":60,"cost":0,"cast":0.6,"cd":18,"mundane":1,"hit":{"kind":"blunt","flat":60,"stun":0.4},"role":"공격","desc":"마법이 아닌 총. 장악권이 못 막는다"},"박격포":{"n":"박격포","el":"없음","t":"lob","flight":3,"r":2.5,"dmg":90,"kind":"blunt","R":150,"cost":0,"cast":0.5,"cd":30,"mundane":1,"wallDmg":600,"role":"공격","rule":"army","desc":"높이 쏘아 벽 너머에 떨어뜨리는 포탄. 날아가는 시간이 길어(3 s) 움직이는 과녁은 못 맞힌다. 장전 30 s. 떨어진 자리의 벽을 부순다"}};
}, {}];
D["data/spells/흙.json"] = [function (module, exports, require) {
module.exports = {"돌 창":{"n":"돌 창","el":"흙","t":"proj","m":0.15,"v":28,"R":20,"cost":3,"cast":0.3,"cd":1.2,"hit":{"kind":"blunt"},"role":"공격"},"돌 압축탄":{"n":"돌 압축탄","el":"흙","t":"proj","m":0.06,"v":30,"R":24,"cost":1,"cast":0.25,"cd":1,"hit":{"kind":"blunt"},"role":"공격"},"곡사 돌":{"n":"곡사 돌","el":"흙","t":"lob","flight":1.2,"r":1,"dmg":20,"kind":"blunt","R":26,"cost":3,"cast":0.35,"cd":1.2,"role":"공격"},"솟는 발판":{"n":"솟는 발판","el":"흙","t":"move","mv":"vault","dist":4,"cost":3,"cast":0.12,"cd":2.5,"role":"이동"},"석회 기둥":{"n":"석회 기둥","el":"흙","t":"wall","hp":60,"dur":20,"r":0.7,"at":1.4,"cost":5,"cast":0.4,"cd":3,"role":"방어"},"석회 방패":{"n":"석회 방패","el":"흙","t":"buff","b":{"front":1,"block":1,"d":1.6},"cost":2,"cast":0.1,"cd":0.8,"role":"방어","react":1},"흙 꺼짐":{"n":"흙 꺼짐","el":"흙","t":"trap","tr":{"dmg":8,"kind":"blunt","root":1.8,"r":1},"vis":1,"cost":3,"cast":0.35,"cd":2.5,"role":"함정"},"갈래 돌":{"n":"갈래 돌","el":"흙","tags":["miss"],"desc":"다섯 갈래 돌","t":"proj","m":0.06,"v":40,"R":9,"multi":5,"cost":3,"cast":0.3,"cd":1,"hit":{"kind":"blunt"},"role":"공격"},"흙먼지":{"n":"흙먼지","el":"흙","tags":["ranged","elec"],"desc":"먼지로 겨냥을 흐린다","t":"zone","z":{"k":"smoke","shape":"circle","r":2.5,"d":5},"R":4,"cost":2,"cast":0.2,"cd":5,"role":"방어"},"흙 손":{"n":"흙 손","el":"흙","tags":["miss","kite"],"desc":"상대 발밑 흙이 발목을 움켜쥔다","t":"area","r":1.2,"delay":0.6,"dmg":6,"kind":"blunt","root":1.6,"vis":0,"R":10,"cost":4,"cast":0.25,"cd":2.5,"role":"공격"},"큰 바위":{"n":"큰 바위","el":"흙","tags":["wall","ranged"],"desc":"20kg 바위","t":"proj","m":20,"v":22,"R":26,"cost":12,"cast":2.2,"cd":3,"hit":{"kind":"blunt","flat":70,"stun":1},"rad":0.7,"role":"공격"},"가시 솟기":{"n":"가시 솟기","el":"흙","t":"area","r":1,"delay":0.45,"dmg":12,"kind":"blunt","root":1.2,"vis":0,"R":9,"cost":4,"cast":0.25,"cd":2,"role":"공격","desc":"상대 발밑 흙을 가시로 솟게 한다"},"돌 비":{"n":"돌 비","el":"흙","t":"lob","flight":0.9,"r":1.6,"dmg":14,"kind":"blunt","R":20,"cost":4,"cast":0.3,"cd":1.4,"role":"공격","desc":"작은 돌을 높이 흩뿌려 떨어뜨린다"},"흙 이불":{"n":"흙 이불","el":"흙","t":"smother","r":3,"cost":3,"cast":0.15,"cd":3,"role":"방어","desc":"둘레에 흙을 덮어 불과 독과 포자를 끈다"},"바위 박차기":{"n":"바위 박차기","el":"흙","t":"move","mv":"dash","dist":4,"cost":2,"cast":0.05,"cd":2,"role":"이동","desc":"바위를 차고 반동으로 튄다"},"석회 굳히기":{"n":"석회 굳히기","el":"흙","t":"proj","m":0.2,"v":26,"R":12,"cost":3,"cast":0.3,"cd":3,"hit":{"dmg":5,"kind":"blunt","lime":3},"role":"공격","rule":"bodyBind","desc":"석회 반죽을 다리에 붙인다. 3초 동안 구르는 거리가 절반. 산에 녹는다","rad":0.25},"가두는 기둥":{"n":"가두는 기둥","el":"흙","t":"cage","r":3,"pr":1.4,"hp":120,"dur":2.5,"R":10,"cost":6,"cast":0.35,"cd":6,"role":"공격","rule":"bodyBind","desc":"상대 둘레 3m에 석회 기둥 넷을 한꺼번에 세운다. 솟는 발판으로 넘을 수 있다"},"흙벽":{"n":"흙벽","el":"흙","t":"build","shape":"line","nb":3,"th":0.5,"at":1.3,"mat":"earth","cost":6,"cast":0.2,"cd":4,"lock":1,"role":"방어","rule":"bulwark","desc":"발밑 흙을 끌어와 앞에 벽을 쌓는다(블록 셋, 2.4 × 1.6 × 0.5 m). 세우는 동안 선다. 속도는 출력에 비례(대마법사 초당 0.6 m³, 약 3 s). 체력이 다할 때까지 서고 총알을 막는다. 흙을 끌어온 바깥쪽에 구덩이"},"보루":{"n":"보루","el":"흙","t":"build","shape":"ring","rad":2.2,"th":0.5,"mat":"earth","cost":14,"cast":0.3,"cd":30,"lock":1,"role":"방어","rule":"bulwark","desc":"제 둘레에 사방 벽을 쌓는다(반지름 2.2 m, 블록 열일곱). 대마법사 약 18 s"},"벽 밀기":{"n":"벽 밀기","el":"흙","t":"topple","R":14,"dmg":60,"root":2,"cost":6,"cast":0.5,"cd":5,"role":"공격","rule":"bulwark","desc":"서 있는 벽 아무것이나 한 방향으로 밀어 넘어뜨려 그 너머 한 줄(2.5 m)을 덮는다: 부딪힘 60 + 묶임 2 s. 벽은 무너진다"},"조약돌":{"n":"조약돌","el":"흙","t":"proj","m":0.05,"v":40,"R":70,"cost":1,"cast":0.3,"cd":1,"hit":{"kind":"blunt"},"role":"공격","desc":"손끝에서 튕겨 멀리 던지는 조약돌(약 9). 굳은 살이 두꺼우면 튕긴다","rule":"army"},"무거운 돌":{"n":"무거운 돌","el":"흙","t":"proj","m":3,"v":32,"R":70,"cost":5,"cast":1,"cd":4,"hit":{"kind":"blunt","flat":45},"rad":0.25,"role":"공격","desc":"주먹 둘만 한 돌을 멀리 던진다(45). 굳은 살을 뚫는다","rule":"army"},"청사진":{"n":"청사진","el":"흙","tags":["fort"],"desc":"청사진 하나(반원 보루·몰이길·함정 격자·하늘 막기·엄폐 사다리)를 여러 칸으로 한꺼번에 짓는다. 당·피로는 구조물마다 (청사진 규칙)","t":"blueprint","cost":0,"cast":0.3,"cd":8,"role":"방어","rule":"blueprint"}};
}, {}];
D["data/tiers.json"] = [function (module, exports, require) {
module.exports = {"병사":{"C":0.3,"circles":1,"noise":0.12,"dec":0.3,"autoDodge":false,"mast":0,"tac":{"dodge":0.2}},"평범":{"C":1,"circles":1,"noise":0.08,"dec":0.2,"autoDodge":false,"mast":0.3,"tac":{"dodge":0.4}},"중간":{"C":2.5,"circles":3,"noise":0.05,"dec":0.15,"autoDodge":false,"mast":0.6,"tac":{"dodge":0.6}},"상위":{"C":5,"circles":5,"noise":0.03,"dec":0.12,"autoDodge":true,"mast":0.8,"tac":{"dodge":0.8}},"대마법사":{"C":10,"circles":10,"noise":0.02,"dec":0.1,"autoDodge":true,"mast":1,"tac":{"dodge":1,"focusLow":true}}};
}, {}];
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
const rhythm = require('./techniques/rhythm'), efficacy = require('./techniques/efficacy'), shape = require('./techniques/shape'), survive = require('./techniques/survive'), sharp = require('./techniques/sharp');

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
  if (m.cast || m.chan) { if (circ >= 2 && !m.castB && T.slotB) slot = 'B'; else return; }   // 두 번째 칸은 대가부터 (기본은 씀)
  if (empty) slot = 'B';
  K.slot = slot;

  // ---- 휴식: 머리가 뜨거우면 위협이 없을 때 쉰다. 규칙이 고친다(파도의 부류, rules/wave) ----
  // 방어 간격 세기 (대가): 과녁의 방어 마법이 모두 간격 중이면(자동 진도) 칠 때다. 쉬지 않고, 공격 가치 × 1.4
  const defDown = T.cdRead && defenseDown(e, S, W);
  let restNow = W.rules.fatigue && m.fat > rest && !aimed && d > 4 && !defDown;
  h = bh.rest; for (let i = 0; i < h.length; i++) restNow = h[i](W, m, K, restNow);
  if (T.survive && !restNow) restNow = survive.rest(W, m, K);   // 고르지 않은 파도에서 내려온다 (v2.6)
  if (restNow) { m.log.dec.rest++; m.relT = null; return; }

  if (tempo.pause(W, m)) return;       // 쏜 뒤 멈춤 (초보)
  if (simul.wait(W, m, K)) return;     // 동시 착탄 (대가): 묶기가 결정타 직전에 떨어지게 기다린다
  if (tempo.hold(W, m, K)) return;     // 박자 흔들기 (상급)
  K.defDown = defDown; K.plan = combo.planOf(W, m, K);   // 두 수 콤보 계획 (상급)
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
  return P;
}
// 마법 하나의 값. 쓸 만하면 후보에 넣는다
function valueSpell(W, m, K, bi) {
  const { T, e, Dm, d, slot } = K, bh = W._bh;   // 드물게 쓰는 값은 쓸 때 K에서 읽는다
  const n = Dm.nm[bi], s = Dm.sp[bi], mastN = Dm.mast[bi], isOff = Dm.off[bi];
  if (slot === 'B' && (s.t === 'cone' || s.t === 'move' || (m.cast && m.cast.s.n === n) || (isOff && !T.slotBOff && !K.pressB))) return;   // slotBOff가 꺼지면 두 번째 칸엔 공격을 겹치지 않는다(묶기·준비 수는 된다, v2.0)
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
  if (W.rules.fatigue && !s.react && !m.wave) o.v -= m.fat / 100 * T.fatPen;   // 피로 벌점 (v2.6부터 판단 수준의 값)
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
  if (slot === 'B' && T.plan && best.v2 < T.slotBMin) return;   // 기술이 있는 사람은 두 번째 칸을 값진 수에만 쓴다 (문턱은 판단 수준마다, v2.0)
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
}, {"./util":"src/brain/util.js","./hooks":"src/brain/hooks.js","./techniques/combo":"src/brain/techniques/combo.js","./techniques/cancel":"src/brain/techniques/cancel.js","./techniques/feint":"src/brain/techniques/feint.js","./techniques/simul":"src/brain/techniques/simul.js","./techniques/tempo":"src/brain/techniques/tempo.js","./techniques/bait":"src/brain/techniques/bait.js","./techniques/learn":"src/brain/techniques/learn.js","./techniques/counter":"src/brain/techniques/counter.js","./techniques/cover":"src/brain/techniques/cover.js","./techniques/herd":"src/brain/techniques/herd.js","./techniques/crowd":"src/brain/techniques/crowd.js","./techniques/swarm":"src/brain/techniques/swarm.js","./techniques/siege":"src/brain/techniques/siege.js","./techniques/rhythm":"src/brain/techniques/rhythm.js","./techniques/efficacy":"src/brain/techniques/efficacy.js","./techniques/shape":"src/brain/techniques/shape.js","./techniques/survive":"src/brain/techniques/survive.js","./techniques/sharp":"src/brain/techniques/sharp.js"}];
D["src/brain/hooks.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 훅 모으기 (brain/hooks, SPEC 22장)
 * 세계의 켜진 규칙 모듈(W.mods)에서 두뇌 훅만 차례대로 모아 W._bh에 둔다(세계마다 한 번, 첫 판단 때). 꺼진 규칙은 비용 0.
 * 규칙의 새 틀(taunt…)의 값은 brainTypes. 틀은 스위치와 상관없이 늘 붙는다 */
const R = require('../rules'), U = require('./util');
const BRN = new Map(), BT = {}; let btVer = -1;
// 훅 모음: 이름마다 배열 하나 (리터럴이라 모양이 늘 같다). 이름은 rules/index.js의 BRAIN_HOOKS
function emptyBH() { return { aim: [], read: [], hideCast: [], steer: [], avoid: [], empty: [], circles: [], react: [], cancel: [], rest: [], prep: [], value: [], valueRisk: [], valueMid: [], valueLate: [], commit: [], castTime: [], phase: [], bound: [] }; }
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
 * 숨 결투장 — 기본 두뇌 v2.6.0
 * 판단 순서: 읽기(read) → 입장(stance) → 움직임(move) → 고르기(choose: 자동 진 → 칸 → 휴식 → 마법 고르기)
 * 기술(콤보·속임수·엄폐·유도·학습·덱 읽기·붙잡기…)은 techniques/에 하나씩, 어느 단계가 어떤 기술을 켜는지는 skills.js(data/skills.json).
 * 규칙(스위치)에 딸린 판단은 그 규칙 파일(src/rules/)의 brain 훅에 있다. 세계마다 켜진 규칙의 훅만 모은다(hooks.js).
 * 새 두뇌를 만들 땐 think(W, m) 하나만 같은 모양으로 내보내면 된다. 등록은 Arena.register.brain
 * ========================================================================= */
const U = require('./util'), { hooks } = require('./hooks');
const rhythm = require('./techniques/rhythm');
const { aimAt, readThreats } = require('./read'), { chooseStance } = require('./stance'), { steer } = require('./move'), { decide } = require('./choose');

// 판단은 차례대로 여러 조각으로 나눠 둔다 (속도, 1.11.1): 한 덩어리(400줄)는 최적화 컴파일이 판보다 오래 걸려 짧은 실행 내내 느린 코드로 돌았다.
// 조각 사이에 오가는 값은 사람마다 하나 둔 K에 담는다(새로 만들지 않는다). 후보 하나의 값은 K.o에
function newO() { return { s: null, n: null, bi: 0, isOff: null, cost: 0, he: 0, Tw: 0, R: 0, v: 0, tx: 0, ty: 0, barrel: false, pin: false, down: false }; }
function newK() { return { foes: null, S: null, T: null, prefR: null, aggr: null, dodgeK: null, rest: null, e: null, mem: null, wantMem: false, Dm: null, De: null, d: null, ux: null, uy: null, los: null, vt: null, eDown: null, dodge: null, aimed: null, threat: null, late: null, blindR: null, stance: null, escape: null, vx: 0, vy: 0, empty: null, circ: null, bigThreat: null, slot: null, defDown: null, sim: null, plan: null, lead: null, cb: null, down0: null, ek: null, roll: null, shieldNear: null, bigs: null, ctOf: null, pinNow: null, holds: null, pinBy: null, cand: null, pool: null, best: null, pipe: null, effHR: 0, pressB: false, o: newO() }; }   // 리터럴로 만들어야 빠른 모양이 된다
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
  readThreats(W, m, K); rhythm.phase(W, m, K); chooseStance(W, m, K); steer(W, m, K);   // 리듬: 떠보기·들어가기·빠지기 (v2.2)
  if (m.st.stun > 0) return;
  decide(W, m, K);
}

module.exports = { think, catOf: U.catOf, FORMNAME: U.FORMNAME, rollSide: U.rollSide, VERSION: '2.6.0' };
}, {"./util":"src/brain/util.js","./hooks":"src/brain/hooks.js","./techniques/rhythm":"src/brain/techniques/rhythm.js","./read":"src/brain/read.js","./stance":"src/brain/stance.js","./move":"src/brain/move.js","./choose":"src/brain/choose.js"}];
D["src/brain/move.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 두뇌 3: 움직임
 * 입장대로 걷는다(돌파·거리 두기·선호 거리와 옆걸음). 기술(엄폐·자리·유도)이 더하고, 규칙의 훅(소금 원 steer, 화약통 avoid)이 고친다.
 * 피하기가 이기고, 알아챈 함정과 내 지연 폭발은 늘 비킨다. 걸음 방향은 K.vx·K.vy를 거쳐 기술·훅이 함께 고친다 */
const { hyp } = require('./util');
const cover = require('./techniques/cover'), position = require('./techniques/position'), lure = require('./techniques/lure');
const swarm = require('./techniques/swarm'), siege = require('./techniques/siege');
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
  m.mv.x = vx; m.mv.y = vy;
}
module.exports = { steer };
}, {"./util":"src/brain/util.js","./techniques/cover":"src/brain/techniques/cover.js","./techniques/position":"src/brain/techniques/position.js","./techniques/lure":"src/brain/techniques/lure.js","./techniques/swarm":"src/brain/techniques/swarm.js","./techniques/siege":"src/brain/techniques/siege.js"}];
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
const TECH = { combo: 'combo', combo2: 'combo', plan: 'combo', cancel: 'cancel', cancel2: 'cancel', feint: 'feint', simul: 'simul', triple: 'simul', pause: 'tempo', tempo: 'tempo', bait: 'bait', learn: 'learn', counter: 'counter', cover: 'cover', strip: 'cover', outrange: 'position', terrain: 'position', lure: 'lure', fakeRetreat: 'lure', herd: 'herd', crowd: 'crowd', dodgeAim: 'dodgeAim', grab: 'grab', swarm: 'swarm', siege: 'siege', wallSite: 'siege', wallBreak: 'siege', retreat: 'siege', rhythm: 'rhythm', rhythmTime: 'rhythm', domainPush: 'rhythm', efficacy: 'efficacy', buffNeed: 'efficacy', shape: 'shape', roles: 'shape', survive: 'survive', sharp: 'sharp' };
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
const { C, defenseDown } = require('../util');
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
}, {"../util":"src/brain/util.js"}];
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
 * 방패는 나를 겨눈 수가 있을 때만. (둘 다 높이 떠 있을 때 기둥·벽을 막으면 대가/상급이 0.06 떨어졌다: 굳을 위험에 낮게 날아 벽이 곧 다시 가린다) */
const { OFF, landDelay, castTime } = require('../util'), { undo } = require('./cancel');
const on = m => m.tac.sharp && m.C >= 5;
// 과녁의 빈틈이 앞으로 열려 있을 시간 (s). 과열(머리 92 넘음)은 0.8 s로 본다. 없으면 0
function openFor(W, e) { let w = Math.max(e.st.stun || 0, e.st.root || 0, e.crash > 0 ? e.crash : 0, e.emptyT > W.t ? e.emptyT - W.t : 0); if (e.fat > 92 && !e.wave && w < 0.8) w = 0.8; return w; }
// 막힌 직사 끊기 (첫 칸만: 두 번째 칸은 그냥 버린다)
function losCancel(W, m, K) {
  if (!on(m) || K.los) return;
  const c = m.cast; if (c && !c.auto && !c.feint && (c.s.t === 'thread' || (c.s.t === 'proj' && !c.s.home)) && c.tgt === K.e && c.T - c.t > 0.03) { undo(m, c); m.mlog.losCut++; }
  const b = m.castB; if (b && !b.auto && (b.s.t === 'thread' || (b.s.t === 'proj' && !b.s.home)) && b.tgt === K.e && b.T - b.t > 0.03) { m.castB = null; m.glu += (b.cost || 0) * 0.7; }
}
function value(W, m, K, o) {
  if (!on(m) || !(o.v > 0)) return;
  const s = o.s, e = K.e;
  if (OFF[s.t]) {
    const land = castTime(W, m, o.Tw) + landDelay(s, K.d), win = openFor(W, e);
    if (win > 0.15 && land < win) o.v *= 2 * (1 + 0.5 / (land + 0.2));   // 빈틈: 닫히기 전에 닿는 것, 빠를수록
    if (e.z >= 1) {
      const fast = s.t === 'thread' || (s.t === 'proj') || (s.t === 'area' && s.delay <= 0.6);
      if (fast) o.v *= 1.2;
      else if (s.t === 'area' && Math.max(e.st.stun || 0, e.st.root || 0) < land) o.v *= 0.3;   // 느린 구름은 굳음·묶임 뒤에만
    }
  }
  if (s.t === 'buff' && s.b && s.b.front && !K.aimed && !K.threat) o.v = 0;  // 방패는 실제 위협에만
}
module.exports = { value, losCancel, openFor };
}, {"../util":"src/brain/util.js","./cancel":"src/brain/techniques/cancel.js"}];
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
 *   적이 벽 뒤(시야 없음, 곁에 벽)면 곡사·박격포·산·물 × 2 */
const { C, hyp } = require('../util');
// 이 사람이 무리 싸움 중인가: 과녁이 선명도 3배 이상, 내 편이 셋 넘게 살아 있다. 장악권 반경이 있을 때만(rules.domainR)
function on(W, m, e) { if (!(m.tac.swarm && W.rules.domainR > 0 && e.C >= 3 * m.C)) return false; let n = 0; for (const q of W.ms) if (q.side === m.side && q.hp > 0 && ++n > 3) return true; return false; }
const heavyOf = s => s.hit && s.hit.flat >= 45;
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
  else return;
  for (const q of W.ms) { if (q === m || q.side !== m.side || q.hp <= 0) continue; const dx = m.x - q.x, dy = m.y - q.y; if (dx > 4 || dx < -4 || dy > 4 || dy < -4) continue; const l = hyp(dx, dy) || 0.1; if (l < 4) { vx += dx / l * (4 - l) * 0.5; vy += dy / l * (4 - l) * 0.5; } }   // 흩어진다
  K.vx = vx; K.vy = vy;
}
function value(W, m, K, o) {
  const e = K.e, s = o.s; if (!(o.v > 0) || !on(W, m, e)) return;
  if (heavyOf(s)) { if (e.st.blind > 0.2) o.v *= 3; else for (const q of W.ms) if (q.side === m.side && q !== m && q.hp > 0 && q.cast && q.cast.s.t === 'flash') { o.v *= 2; break; } }
  if (!K.los && W.walls.some(w => hyp(w.x - e.x, w.y - e.y) < 3) && (s.t === 'lob' || (s.t === 'zone' && s.z.k === 'acid') || s.el === '물')) o.v *= 2;   // 벽 뒤의 적
}
module.exports = { on, steer, value };
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
function heatOver(W, m, cost, Tc, mul) {
  if (!W.rules.fatigue) return false;
  const L = m.load || 0, air = m.fly === 1 && m.z >= 1 ? 1 + 6 * L + (L > 1 ? 40 * (L - 1) : 0) : 0, f0 = m.fat + (air - 4) * (Tc > 0 ? Tc : 0), f = (air && m.fat <= 100 && f0 > 100 ? 100 : f0) + cost * mul * 1.6;   // 비행 피로는 100에서 멈춘다
  if (W.rules.wave && m.type !== '이단' && (m.wave || (m.tac.waveChoose && m.waveWant))) return f > 165;   // 고르지 않은 파도는 타지 않는다: 몸을 태우고 170에서 휩쓸린다
  if (W.rules.wave && m.type === '이단') return false;
  return f > 97;   // 모으는 동안 끊기·쿠션(1.5씩)이 더할 몫을 남긴다
}
// 땅이 안전한가 (v2.6): 살아 있는 적 누구도 땅에 선 사람만 치는 수(함정·안 보이는 구름·벽 밀기·가두기)를 갖고 있지 않다. 대마법사의 함정은 위력 C^2.5로 한 방이다
function groundSafe(W, m) { const f = W.foes[m.side]; for (let i = 0; i < f.length; i++) if (deck(f[i], W.spells).ground) return false; return true; }
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

module.exports = { heatOver, groundSafe, C, hyp, roleOf, NOKIND, NONE, DIR16, DIR8, OFF, SELF_GAP, catOf, FORMNAME, isSetup, logDec, estDmg, PAIRS, rollSide, holdsOf, castTime, bindOf, caged, pinned, hitBack, afterPin, pinOf, deck, obsNear, anyNear, bigAttack, landDelay, maxRange, ownShare, kindOf, counters, defenseDown, circOf };
}, {"../core":"src/core.js"}];
D["src/core.js"] = [function (module, exports, require) {
'use strict';
/* =========================================================================
 * 숨 결투장 — 엔진 핵심 v2.6.0
 * 단위: m, s, kg, J. 고정 시간 간격 DT = 1/30 s. 같은 씨앗이면 같은 결과.
 * 규칙의 근거와 수식은 SPEC.md 참고. 이 파일을 바꾸면 SPEC과 버전을 같이 올린다.
 * 규칙(스위치)은 src/rules/에 하나에 한 파일로 있다. 핵심은 정해진 자리에서 켜진 규칙의 훅(W.H)만 부른다 (SPEC 22장).
 * 브라우저는 sandbox/pack.js가 묶은 sandbox/arena.js로 읽는다(전역 ArenaCore).
 * ========================================================================= */
const { sin, cos, atan2, exp, log, pow, hyp, hyp3, clamp, mulberry32 } = require('./math');
const { SPELLS } = require('./data');
const R = require('./rules');
const VERSION = '2.6.0';
const DT = 1 / 30;

// 1.x의 기본 동작 (SPEC 24장): rules에 주면 v2.0의 새 기본을 끈다
const V1_RULES = { risk: false, saltRing: false, wave: false, hpScale: false, hpK: 2.5, hpFloor: 0, bodyK: 0, evade: false, flight: false, domainR: 0, domainPath: false, callus: 0, light: false, bulwark: false, army: false, morale: false };   // hpK·hpFloor: 1.x에서 hpScale을 켠 판도 그대로
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
function emptyH() { return { place: [], init: [], world: [], wall: [], wallHit: [], lobLand: [], ceff: [], power: [], gate: [], share: [], release: [], overload: [], roll: [], hurtMod: [], hurt: [], effHold: [], eff: [], rain: [], smother: [], ring: [], fatRecover: [], mageStep: [], mageZones: [], move: [], speed: [], speedLate: [], accel: [], chan: [], projSub: [], ignite: [], areaHit: [], zoneTick: [], notice: [], trapCap: [], trapFire: [], preMove: [], castMove: [], walk: [] }; }
// 규칙 모듈이 엔진에서 쓰는 것 (X). 규칙 파일은 이것만 받아 쓴다
let X = null;
const ENG = new Map(), TFX = {}; let tfxVer = -1;
// 규칙의 엔진 훅은 모듈마다 한 번 만든다
function engineOf(r) { if (!r.engine) return null; let e = ENG.get(r); if (!e) { e = r.engine(X); for (const k in e) if (!(k in emptyH())) throw new Error(r.name + ': 없는 엔진 훅 ' + k + ' (' + R.ENGINE_HOOKS.join(', ') + ')'); ENG.set(r, e); } return e; }
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
const SPELL_KEYS = new Set(["n", "el", "t", "m", "v", "R", "cost", "cast", "cd", "hit", "role", "L", "dur", "dps", "kind", "burn", "burst", "mv", "dist", "self", "z", "tr", "vis", "E", "r", "delay", "dmg", "stun", "b", "react", "flight", "hp", "at", "wet", "push", "lock", "banned", "blind", "life", "home", "tags", "desc", "kill", "multi", "fast", "root", "rad", "chill", "mundane", "rule", "big", "cramp", "pr", "needGear", "aimN", "aimD", "fuse", "reload", "wallDmg"]);
function shapeOne(s) { const o = { n: s.n, el: s.el, t: s.t, m: s.m, v: s.v, R: s.R, cost: s.cost, cast: s.cast, cd: s.cd, hit: s.hit, role: s.role, L: s.L, dur: s.dur, dps: s.dps, kind: s.kind, burn: s.burn, burst: s.burst, mv: s.mv, dist: s.dist, self: s.self, z: s.z, tr: s.tr, vis: s.vis, E: s.E, r: s.r, delay: s.delay, dmg: s.dmg, stun: s.stun, b: s.b, react: s.react, flight: s.flight, hp: s.hp, at: s.at, wet: s.wet, push: s.push, lock: s.lock, banned: s.banned, blind: s.blind, life: s.life, home: s.home, tags: s.tags, desc: s.desc, kill: s.kill, multi: s.multi, fast: s.fast, root: s.root, rad: s.rad, chill: s.chill, mundane: s.mundane, rule: s.rule, big: s.big, cramp: s.cramp, pr: s.pr, needGear: s.needGear, aimN: s.aimN, aimD: s.aimD, fuse: s.fuse, reload: s.reload, wallDmg: s.wallDmg }; for (const k in s) if (!SPELL_KEYS.has(k)) o[k] = s[k]; return o; }
const SHAPED = new WeakSet();   // 이 세계에서 모양을 맞춘 사본 (원본 마법은 여기 없다)
function shapeBook(W, book) { for (const n of book) { const s = W.spells[n]; if (s && !SHAPED.has(s)) { const o = shapeOne(s); SHAPED.add(o); W.spells[n] = o; } } }
function createWorld(opt = {}) {
  const W = {
    v: VERSION, t: 0, step: 0, width: opt.width || 40, height: opt.height || 30,
    rng: mulberry32((opt.seed >>> 0) || 1), rules: Object.assign({}, DEFAULT_RULES, opt.rules),
    spells: Object.assign({}, opt.spells || SPELLS), brain: opt.brain || null,   // 책에 든 마법은 addMage가 모양을 맞춘다
    obs: [], walls: [], proj: [], lobs: [], areas: [], zones: [], traps: [], barrels: [], ms: [], fx: [],
    foes: [[], []], _nF: null, _alive: null, _cloak: false, rec: opt.record ? [] : null, sides: 2, maxT: opt.maxT || 120,
    H: null, mods: null, _bh: null, _fly: false, _recN: opt.recEvery >= 1 ? Math.floor(opt.recEvery) : 2, _grp: 0, _sideN: null, _wv: 0, _wgN: -1, _wg: null, _wq: [],   // 벽 격자 (벽이 많을 때, 속도): 벽 목록의 판번호·격자를 만든 판번호·격자·찾은 목록
    salt: Array.isArray(opt.salt) ? opt.salt.map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h })) : [],   // salt: 소금 땅 사각형 (rules/saltLand)   // _grp: 벽 무리의 다음 번호 (rules/bulwark)
      // 켜진 규칙의 엔진 훅, 켜진 규칙 모듈, 두뇌 훅(두뇌가 채운다), 비행이 켜졌나(녹화에 높이를 적는다)
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
  if (Array.isArray(opt.walls)) for (const w of opt.walls) addWall(W, { x: w.x, y: w.y, r: w.r || 0.6, hp: w.hp || 200, t: 1e9, own: -1, mat: w.mat || 'lime', thick: w.thick ?? (w.r || 0.6) * 2, grp: w.grp ?? -1 });
  for (const h of W.H.init) h(W);
  return W;
}

// 체력 배수 (SPEC 3장): hpScale이면 max(C, hpFloor)^hpK
const hpMul = (W, spec) => W.rules.hpScale ? pow(Math.max(spec.C ?? 1, W.rules.hpFloor), W.rules.hpK) : 1;
function addMage(W, spec, side, x, y) {
  const book = (spec.book || []).filter(n => W.spells[n] && (!W.spells[n].banned || spec.allowBanned) && (!W.spells[n].rule || W.rules[W.spells[n].rule]) && (!W.spells[n].needGear || (spec.gear && spec.gear[W.spells[n].needGear])));   // 규칙에 딸린 마법은 그 규칙이 켜졌을 때만, 장비가 드는 마법(열선: 거울)은 그 장비가 있을 때만
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
      bigPlan: false, dodgeAim: false, grab: false,
      swarm: true, siege: true, wallSite: false, wallBreak: false, retreat: false,
      rhythm: false, rhythmTime: false, domainPush: false, efficacy: false, buffNeed: false, shape: false, roles: false,
      flyCut: 0, fortify: 0, breach: false,
      reflex: 0, chop: false, footwork: 0, blueprint: 0, ops: 0 }, spec.tac),   // (v2.5) 작전 겹(1 대가 · 2 전설: 강요하는 수·작전 읽기, rules/tactics, 29장)   // (v2.4) 반사 겹의 반응 지연(대가 0.1 · 전설 0.05 s, rules/reflex), 끊어 걷기·발놀림(1 옆 뒤집기 · 2 거리 톱질 · 3 높이 튕기기, rules/snap), 청사진(1 상급 · 2 대가부터 상황에 맞게, rules/blueprint) (28장)   // (v2.3) 날기 끊기(1 상급 · 2 대가 · 3 전설, rules/flight), 진지 짓기(1 상급 · 2 대가 몰이길 · 3 전설 미끼)·부수기(대가, rules/fort) (27장)   // (v2.2) 리듬(상급 'mimic', 대가부터 true)·때 재기·장악권 밀기, 효과 학습, 강화의 때(상급), 지형 설계·칸의 역할 (26장)   // (v2.0 둘째) 무리·성 (강한 적 하나, 또는 총·무리를 상대할 때만), 벽 자리(상급)·벽 없애기(대가)·물러나기(상급)   // (1.10.0 risk) 피할 자리 겨냥(상급부터), 붙잡기(대가부터)   // (1.9.0 대가·전설) 큰 수를 짝 묶기에 맞춰 꽂는다
    st: { stun: 0, root: 0, wet: 0, burn: 0, chill: 0, blind: 0, cough: 0, mycel: 0, cramp: 0, lime: 0, fetter: 0 }, _bufx: [], _sigX: NaN, _sigN: false, _szC: NaN, _sz: 1, _pwC: NaN, _pwK: NaN, _pw: 1, buf: { speed: null, elecRes: null, bluntRes: null, toxRes: null, front: null, block: null, smoke: null }, cd: {}, cast: null, castB: null, chan: null, roll: 0, rollCd: 0, autoCd: 0, fat: 0, aim: 0, thinkT: W.rng() * 0.1,
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
    mlog: { role: { A: {}, B: {}, auto: {} }, phase: {}, built: 0, razed: 0, losCut: 0, dS: 0, dS2: 0, dN: 0, gS: 0, bMove: 0, bx: NaN, by: NaN, bT: 0 },   // 거리 합·제곱 합·수, 경계 틈 합, 경계가 움직인 거리, 지난 경계 자리·시각 (판단 때마다, brain/index)
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
function segCircle(x1, y1, x2, y2, cx, cy, r) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, t = clamp(((cx - x1) * dx + (cy - y1) * dy) / L2, 0, 1); return hyp(x1 + dx * t - cx, y1 + dy * t - cy) < r; }
// 선분의 테두리 상자(+ 반지름) 밖에 있는 원은 재지 않는다: 가장 가까운 점은 상자 안이라 결과가 같다 (속도, 1.11.1)
function segBox(x1, y1, x2, y2, cx, cy, r) { const e = r + 1e-9; return cx < (x1 < x2 ? x1 : x2) - e || cx > (x1 > x2 ? x1 : x2) + e || cy < (y1 < y2 ? y1 : y2) - e || cy > (y1 > y2 ? y1 : y2) + e; }
function blocked(W, x1, y1, x2, y2, z) {
  if (!(z > 2)) {   // 시선 끝 하나라도 2 m 넘게 떠 있으면 바위·벽이 가리지 않는다 (v2.0)
  for (const o of W.obs) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true;
  const ws = W.walls;
  if (ws.length <= WMIN) { for (const o of ws) if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true; }
  else { const q = wallsIn(W, (x1 < x2 ? x1 : x2) - WRMAX, (y1 < y2 ? y1 : y2) - WRMAX, (x1 > x2 ? x1 : x2) + WRMAX, (y1 > y2 ? y1 : y2) + WRMAX); for (let i = 0; i < q.length; i++) { const o = ws[q[i]]; if (!segBox(x1, y1, x2, y2, o.x, o.y, o.r) && segCircle(x1, y1, x2, y2, o.x, o.y, o.r)) return true; } }
  }
  for (const z of W.zones) if (z.k === 'smoke' && z.shape === 'circle' && segCircle(x1, y1, x2, y2, z.x, z.y, z.r)) return true;
  return false;
}
function inZone(z, x, y) { if (z.shape === 'circle') return hyp(x - z.x, y - z.y) < z.r; const dx = cos(z.a), dy = sin(z.a), rx = x - z.x, ry = y - z.y; return Math.abs(rx * dx + ry * dy) < z.len / 2 && Math.abs(-rx * dy + ry * dx) < 0.6; }
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
  for (let i = 0; i < ws.length; i++) { const w = ws[i], x0 = Math.floor((w.x - w.r) / WG), x1 = Math.floor((w.x + w.r) / WG), y0 = Math.floor((w.y - w.r) / WG), y1 = Math.floor((w.y + w.r) / WG); for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) { const k = cx * 65536 + cy; let a = g.get(k); if (!a) g.set(k, a = []); a.push(i); } }
  W._wg = g; W._wgN = W._wv; return g;
}
// 사각형 [x0, x1] × [y0, y1] 에 닿을 수 있는 벽의 번호 (차례대로, 겹침 없이). W._wq를 다시 쓴다
function wallsIn(W, x0, y0, x1, y1) {
  const g = wallGrid(W), q = W._wq; q.length = 0;
  const a0 = Math.floor(x0 / WG), a1 = Math.floor(x1 / WG), b0 = Math.floor(y0 / WG), b1 = Math.floor(y1 / WG);
  for (let cx = a0; cx <= a1; cx++) for (let cy = b0; cy <= b1; cy++) { const a = g.get(cx * 65536 + cy); if (a) for (let i = 0; i < a.length; i++) q.push(a[i]); }
  if (q.length > 1) { q.sort(numUp); let j = 1; for (let i = 1; i < q.length; i++) if (q[i] !== q[j - 1]) q[j++] = q[i]; q.length = j; }
  return q;
}
const numUp = (a, b) => a - b;
// 소금 땅 위인가 (장면의 사각형, rules/saltLand)
function onSalt(W, x, y) { const a = W.salt; for (let i = 0; i < a.length; i++) { const r = a[i]; if (x >= r.x && y >= r.y && x <= r.x + r.w && y <= r.y + r.h) return true; } return false; }
function frontBlock(e, sx, sy) { if (!e.buf.front) return false; const a = atan2(sy - e.y, sx - e.x), b = Math.abs(((a - e.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 1.1; if (b && !e.buf.front.used) { e.buf.front.used = 1; e.log.defHit++; } return b; }   // 막은 방패는 방어 적중으로 한 번 센다

/* ---------------- 피해와 상태 ---------------- */
function hurt(W, m, v, src, name, kind) {
  if (m.hp <= 0 || v <= 0) return;
  const b = m.buf;
  if (kind === 'elec' && b.elecRes) v *= b.elecRes.v;
  if (kind === 'blunt' && b.bluntRes) v *= b.bluntRes.v;
  if (kind === 'tox' && b.toxRes) v *= b.toxRes.v;
  const H = W.H, hm = H.hurtMod; for (let i = 0; i < hm.length; i++) v = hm[i](W, m, v, kind, name);   // 흡수 안개·물 장막 (rules/terrain), 몸 받침 (rules/body)
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
  let gh = g; const hh = W.H.effHold; for (let i = 0; i < hh.length; i++) gh = hh[i](W, m, o, gh);   // 붙잡는 효과(굳음·묶임·몸 묶기)의 몫: 은실 옷 (rules/silver)
  if (o.burn) m.st.burn = Math.max(m.st.burn || 0, o.burn * g);
  if (o.wet) m.st.wet = 20;
  if (o.chill) m.st.chill = Math.max(m.st.chill || 0, o.chill * g);
  if (o.stun) m.st.stun = Math.max(m.st.stun || 0, o.stun * gh * (m.buf.elecRes && o.kind === 'elec' ? 0.3 : 1));
  if (o.root) m.st.root = Math.max(m.st.root || 0, o.root * gh);
  if (o.blind) m.st.blind = Math.max(m.st.blind || 0, o.blind * g);
  if (o.cough) m.st.cough = Math.max(m.st.cough || 0, o.cough * g);
  const h = W.H.eff; for (let i = 0; i < h.length; i++) h[i](W, m, o, gh);   // 몸 묶기 (rules/control). 붙잡는 효과라 gh
  if (m.st.stun > 0) { m.cast = null; m.castB = null; m.chan = null; }
}
// 한 사람이 깔아 둘 수 있는 함정 수: 셋. 규칙이 고친다(진지: 서클만큼, rules/fort)
function trapCap(W, m) { let n = 3; const h = W.H.trapCap; for (let i = 0; i < h.length; i++) n = h[i](W, m, n); return n; }
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
        let tgt = null; for (const q of foes) if (hyp3(q.x - ex, q.y - ey, q.z - ez) < 0.6 * Math.min(rs, 2) + 0.2) { tgt = q; break; }
        if (tgt && !frontBlock(tgt, m.x, m.y)) { hurt(W, tgt, 0.8 * pow(s.E, 0.55) * P, m, s.n, 'elec'); eff(W, tgt, s.cramp ? { cramp: s.cramp } : { stun: Math.min(1.2, s.E / 800), kind: 'elec' }, g); hit(m, s); }   // 경직 실은 굳힘 대신 경직
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
      for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * 1.1; addWall(W, { x: m.x + ux * s.at + px * off, y: m.y + uy * s.at + py * off, r: s.r, hp: s.hp * hpS, t: s.dur, by: m, own: m.side, mat, thick: s.r * 2, grp, mk: m.id }); }
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
      if (mine.length >= trapCap(W, m)) W.traps.splice(W.traps.indexOf(mine[0]), 1);   // 한도(보통 셋, 진지는 서클만큼, rules/fort)를 넘으면 가장 오래된 것을 거둔다
      W.traps.push({ x: m.x + ux * R0, y: m.y + uy * R0, s, src: m, arm: 0.8, seen: new Set(s.vis ? W.ms.map(q => q.id) : [m.id]), pow: P, r: s.tr.r * Math.min(rs, 2), chain: 0 });
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
      const d = hyp3(e.x - m.x, e.y - m.y, e.z - m.z), ang = Math.abs(((atan2(e.y - m.y, e.x - m.x) - m.aim + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
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
  // 움직임. 규칙이 맡으면(나는 사람, rules/flight) 땅의 걸음은 건너뛴다
  const hp = H.preMove; for (let i = 0; i < hp.length; i++) hp[i](W, m);   // 판단 뒤·움직임 앞: 반사 겹이 걸음 방향을 덮는다 (rules/reflex)
  let mv = false; const hm = H.move; for (let i = 0; i < hm.length; i++) if (hm[i](W, m)) { mv = true; break; }
  if (mv) {} else if (m.roll > 0) m.roll -= DT;
  else {
    let sp = BODY.speed; const hv = H.speed; for (let i = 0; i < hv.length; i++) sp = hv[i](W, m, sp);   // 파도·꺼짐 (rules/wave), 빈손 (rules/risk)
    if (m.buf.speed) sp *= 1 + m.buf.speed.v; if (m.st.chill > 0) sp *= 0.7;
    const hl = H.speedLate; for (let i = 0; i < hl.length; i++) sp = hl[i](W, m, sp);   // 경직·균사 (rules/control)
    if (m.cast || m.chan) { let k = (m.cast && m.cast.s.lock) ? 0 : m.tac.castMove; const hk = H.castMove; for (let i = 0; i < hk.length; i++) k = hk[i](W, m, k); sp *= k; } if (m.st.stun > 0 || m.st.root > 0) sp = 0;   // 끊어 걷기 (rules/snap)
    let acc = 9; const ha = H.accel; for (let i = 0; i < ha.length; i++) acc = ha[i](W, m, acc);   // 빙판 (rules/terrain)
    const l = hyp(m.mv.x, m.mv.y), tx = l ? m.mv.x / l * sp : 0, ty = l ? m.mv.y / l * sp : 0, k = Math.min(1, DT * acc);
    let wk = false; const hw = H.walk; for (let i = 0; i < hw.length; i++) if (hw[i](W, m, tx, ty, acc)) { wk = true; break; }   // 가속 한계 (rules/snap)
    if (!wk) { m.vx += (tx - m.vx) * k; m.vy += (ty - m.vy) * k; }
  }
  m.x = clamp(m.x + m.vx * DT, 0.4, W.width - 0.4); m.y = clamp(m.y + m.vy * DT, 0.4, W.height - 0.4);
  if (!(m.vault > 0) && !(m.z > 2)) {   // 2 m 넘게 뜨면 바위·벽을 넘는다 (v2.0)
    for (const o of W.obs) { const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
    const ws = W.walls, few = ws.length <= WMIN, q = few ? null : wallsIn(W, m.x - WRMAX - m.r, m.y - WRMAX - m.r, m.x + WRMAX + m.r, m.y + WRMAX + m.r), nq = few ? ws.length : q.length;
    for (let i = 0; i < nq; i++) { const o = few ? ws[i] : ws[q[i]]; const dx = m.x - o.x, dy = m.y - o.y, mn = o.r + m.r; if (dx > mn + 1e-9 || dx < -mn - 1e-9 || dy > mn + 1e-9 || dy < -mn - 1e-9) continue; const d = hyp(dx, dy); if (d < mn) { m.x = o.x + dx / (d || 1) * mn; m.y = o.y + dy / (d || 1) * mn; } }
  }
}
// 구르기 (SPEC 3장): 두뇌·대응이 모두 이것으로 구른다. 속도 v와 간격 cd는 규칙이 고친다(회피, rules/evade)
const RO = { v: 0, cd: 0, skip: false, dx: 0, dy: 0 };   // 구르는 방향도 훅이 고칠 수 있다 (소금 원 밖으로 구르지 않기, v2.6)
function roll(W, m, dx, dy, v, cd) {
  RO.v = v; RO.cd = cd; RO.skip = false; RO.dx = dx; RO.dy = dy; const h = W.H.roll; for (let i = 0; i < h.length; i++) h[i](W, m, RO);
  if (RO.skip) return;   // 나는 사람은 구르지 않는다 (rules/flight가 옆으로 꺾는다)
  const l = hyp(RO.dx, RO.dy) || 1; m.vx = RO.dx / l * RO.v; m.vy = RO.dy / l * RO.v; m.roll = 0.25; m.rollCd = RO.cd; m.stam -= 1.5;
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
      if (e) { const sp = hyp(p.vx, p.vy), want = atan2(e.y - p.y, e.x - p.x), cur = atan2(p.vy, p.vx); const df = ((want - cur + Math.PI * 3) % (Math.PI * 2)) - Math.PI, na = cur + clamp(df, -2 * DT, 2 * DT); p.vx = cos(na) * sp; p.vy = sin(na) * sp; if (e.z !== p.z) p.vz = clamp((e.z - p.z) * 2, -sp, sp); }
      for (const z of W.zones) if (z.k === 'fire' && inZone(z, p.x, p.y)) p.dead = true;
    }
    const nS = Math.max(3, Math.ceil(hyp(p.vx, p.vy) * DT / 0.25));
    for (let k = 0; k < nS && !p.dead; k++) {
      p.x += p.vx * DT / nS; p.y += p.vy * DT / nS; if (p.vz) { p.z += p.vz * DT / nS; if (p.z < 0) { p.dead = true; burst(W, p); break; } }   // 땅에 박힌다
      const low = !(p.z >= 2);   // 2 m 넘게 뜬 투사체는 바위·벽을 넘는다 (v2.0)
      if (low) for (const o of W.obs) if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; burst(W, p); break; }
      if (p.dead) break;
      if (low) { const ws = W.walls, few = ws.length <= WMIN, q = few ? null : wallsIn(W, p.x - WRMAX - p.rad, p.y - WRMAX - p.rad, p.x + WRMAX + p.rad, p.y + WRMAX + p.rad), nq = few ? ws.length : q.length;
      for (let i = 0; i < nq; i++) { const o = few ? ws[i] : ws[q[i]]; if (hyp(p.x - o.x, p.y - o.y) < o.r + p.rad) { p.dead = true; if (o.by && !o.used && o.by !== p.src) { o.used = 1; o.by.log.defHit++; } let wd = (p.s.hit && p.s.hit.flat > 50) ? 80 : 5 * Math.min(p.pow, 20); const hw = H.wallHit; for (let i = 0; i < hw.length; i++) wd = hw[i](W, p, o, wd); o.hp -= wd; burst(W, p); break; } } }   // 벽이 받는 것: 재료·두께 (rules/bulwark)
      if (p.dead) break;
      const hp = H.projSub; for (let i = 0; i < hp.length && !p.dead; i++) hp[i](W, p);   // 화약통 (rules/barrels)
      if (p.dead) break;
      for (const q of W.ms) {
        if (!canHit(W, p, q) || (p.home && q.side === p.src.side)) continue;
        const lim = q.r + p.rad + (p.home ? 0.2 : 0), dx = q.x - p.x, dy = q.y - p.y;
        if (dx > lim + 1e-9 || dx < -lim - 1e-9 || dy > lim + 1e-9 || dy < -lim - 1e-9) continue;   // 멀면 거리를 재지 않는다 (hyp ≥ |dx|라 결과는 같다)
        if (hyp(dx, dy) < lim && !(q.z - p.z > 1.2 || p.z - q.z > 1.2) && !(q.roll > 0 && !p.home)) {   // 높이 차 1.2 m 안 (v2.0)
          p.dead = true; if (!frontBlock(q, p.x - p.vx, p.y - p.vy)) { if (p.s.burst) burst(W, p); else projHit(W, p, q); } break;
        }
      }
    }
    if (!p.dead && p.life <= 0) { p.dead = true; burst(W, p); }
  }
  keepIf(W.proj, projLive);
  for (const l of W.lobs) { l.t -= DT; if (l.t <= 0) { const hl = H.lobLand; for (let i = 0; i < hl.length; i++) hl[i](W, l);   // 떨어진 돌이 벽을 부순다 (rules/bulwark)
    for (const q of W.ms) if (q.hp > 0 && q !== l.src && hyp(q.x - l.x, q.y - l.y) < l.r + 0.3 && !(q.z >= 2) && (W.rules.friendlyFire || q.side !== l.src.side)) { hurt(W, q, l.s.dmg * l.pow, l.src, l.s.n, l.s.kind); hit(l.src, l.s); } if (W.rec) W.fx.push(['a', l.x, l.y, l.r]); } }
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
      const as = a.s; eff(W, q, { burn: as.burn, wet: as.wet, chill: as.chill, stun: (as.stun || 0) * sole * a.g, kind: as.kind, root: (as.root || 0) * sole * a.g, blind: as.blind, cough: as.cough, mycel: as.mycel, cramp: as.cramp, lime: as.lime, fetter: as.fetter });   // eff가 읽는 칸만 (마법 전체를 베끼지 않는다, 속도)
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
X = { DT, hyp, hyp3, clamp, addWall, trapCap, canHit, release, keepIf, onSalt, wallsIn, sin, cos, atan2, pow, log, hurt, hit, eff, burst, addZone, formPoint, inZone, blocked, share, gOf, power, sizeOf, rangeOf, roll };
formsOf();
const { SALT, saltR, outSalt } = require('./rules/saltRing').api;   // 예전 이름 그대로 (소금 원, rules/saltRing)
module.exports = { VERSION, DT, SPELLS, sigOf, TYPES, SALT, saltR, outSalt, sin, cos, atan2, pow, exp, log, DEFAULT_RULES, V1_RULES, RULES: R.RULES, BODY, FORM, THREAT, createWorld, addMage, addWall, trapCap, onSalt, wallsIn, stepWorld, run, over, result, snapshot, release, roll, share, gOf, gAt, power, rangeOf, sizeOf, blocked, inZone, hyp, hyp3, clamp };
}, {"./math":"src/math.js","./data":"src/data.js","./rules":"src/rules/index.js","./rules/saltRing":"src/rules/saltRing.js"}];
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
/* 숨 결투장 v2.6.0 — 바깥으로 내보내는 API
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
  const W = core.createWorld({ seed: sc.seed, rules: sc.rules, record: opt.record, recEvery: opt.recEvery || sc.recEvery, maxT: sc.maxT, width: A.width, height: A.height, obstacles: sc.obstacles, barrels: sc.barrels, walls: sc.walls, salt: sc.salt, spells: lib.spells, brain });
  place(W, specs, sc.layout, sides.map(s => s.mages));
  return W;
}
const runScene = (sc, opt) => core.run(sceneWorld(sc, opt));
// viewer.html이 읽는 녹화 형식 (cli.js replay와 같다)
function recording(W) {
  const r = core.result(W), done = core.over(W);
  return { v: core.VERSION, dt: W._recN * core.DT, names: W.ms.map(m => m.name), sides: W.ms.map(m => m.side), hpMax: W.ms.map(m => m.hpMax), winner: done ? r.winner : -1, t: r.t, obs: W.obs, frames: W.rec || [] };
}

// 판이 끝난 뒤 맞힘 기록을 사람 규격에 되먹인다 (결투자가 배우는 몫)
function learn(spec, m, rate = 0.3) {
  for (const n of Object.keys(m.log.casts)) { const c = m.log.casts[n], h = m.log.hits[n] || 0; spec.hitEst[n] = (spec.hitEst[n] ?? 0.35) * (1 - rate) + rate * Math.min(1, h / c); }
  return spec;
}

module.exports = Object.assign({}, core, { brain, TIERS, DECKS, BRAINS, SKILLS, CIRCLES, register, mage, place, battle, duel, look, sceneWorld, runScene, recording, learn });
}, {"./core":"src/core.js","./brain":"src/brain/index.js","./registry":"src/registry.js","./data":"src/data.js","./brain/skills":"src/brain/skills.js","../metrics/look":"metrics/look.js","./rules/flight":"src/rules/flight.js"}];
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
 * 숨 결투장 — 등록 v2.6.0
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
 * 청사진 = 구조물 배치 묶음(반원 보루·몰이길·함정 격자·하늘 막기·엄폐 사다리). 마법 '청사진'(틀 blueprint)이 한 번에 짓는다.
 * 여러 칸(서클)으로 한꺼번에: 갈래 수 = min(구조물 수, 서클 − 1(떠 있으면 − 1 더), 적어도 1). 갈래마다 제 출력으로 하나씩 차례로 짓는다(출력·머리 피로·당은 갈래 수만큼 든다).
 *   흙벽(블록 둘, 두께 0.4 m, 1.0 m³): 벽 규칙의 세우는 속도(초당 0.6 m³ × 출력/632 kW, 대마법사 1.7 s). 땅에 서서만, 벽 규칙이 켜져 있어야
 *   석회 기둥: 0.4 s. 함정·지대(하늘 덮개·빙판): 그 마법의 예비동작 시간 뒤 그 마법을 그 자리에 푼다(책에 있어야, 방출은 core release 그대로)
 *   구조물을 시작할 때 당을 내고(모자라면 건너뛴다), 벽·기둥은 머리 피로 당 × 1.6(넘칠 것 같으면 건너뛴다). 걸리는 시간은 미리 짜 둔 차례표 그대로(굳으면 멈추고 지은 것은 남는다)
 *   대마법사: 반원 보루(벽 다섯) 약 2 s, 하늘 막기 약 0.9 s, 함정 격자 약 1.2 s
 * 두뇌 (생각 겹, 선명도 5 이상, 판단 수준의 tac.blueprint: 1 상급 = 책에 맞는 첫 청사진, 2 대가부터 = 상황에 맞게):
 *   짓기 단계(리듬): 떠보기 중 상대가 60 m 안이면서 30 m 넘게 멀거나 물러나면(진지 규칙과 같은 때), 청사진이 준비됐고 지난 청사진에서 8 s 지났으면
 *   고르기: 당이 모자라지 않는 것 가운데, 특징(상대가 떠 있음·땅·다가옴·멂, 내 피로·다친 몫)에 청사진의 무게를 곱해 더한 값이 가장 큰 것
 *   자리 맞추기: 진지 자리 = 내 자리, u = 상대 쪽. 구조물이 싸움터·소금 원 밖이면 자리를 안으로 민다. 벽이 든 청사진은 내려앉아 선다 */
const { hyp, sin, cos } = require('../math');
const BPD = require('../../data/blueprints.json'), P = require('../../data/rules/blueprint.json');
const BK = require('../../data/rules/bulwark.json').block;
const { rateOf } = require('./bulwark').api, { saltR } = require('./saltRing').api;
const NAMES = Object.keys(BPD.blueprints), D2R = Math.PI / 180;
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
  for (const o of out) { if (o.x + sx < lo) sx = lo - o.x; if (o.x + sx > W.width - lo) sx = W.width - lo - o.x; if (o.y + sy < lo) sy = lo - o.y; if (o.y + sy > W.height - lo) sy = W.height - lo - o.y; }
  if (W.rules.saltRing) { const R = saltR(W) - 2, cx = W.width / 2, cy = W.height / 2; let worst = 0, wx = 0, wy = 0; for (const o of out) { const dx = o.x + sx - cx, dy = o.y + sy - cy, d = hyp(dx, dy); if (d - R > worst) { worst = d - R; wx = dx / d; wy = dy / d; } } sx -= wx * worst; sy -= wy * worst; }
  for (const o of out) { o.x += sx; o.y += sy; }
  const L = lanesOf(m, out.length), free = new Array(L).fill(0); let T = 0;
  for (const o of out) { let j = 0; for (let i = 1; i < L; i++) if (free[i] < free[j]) j = i; o.s0 = free[j]; o.s1 = free[j] + durOf(W, m, o.it, o.s); free[j] = o.s1; if (o.s1 > T) T = o.s1; }
  return { name, x: ax + sx, y: ay + sy, ux, uy, items: out, T, lanes: L, built: 0, ground: out.some(o => o.it.build) };
}
// 짓기: 청사진 시전의 준비(마법의 예비동작) 뒤 차례표대로. all이면 남은 것을 모두
// 함정·지대도 풀 때 머리가 넘쳐 굳거나 고르지 않은 파도에 오를 것이면 건너뛴다 (v2.6, 스스로 죽지 않기: tac.survive, 선명도 5 이상, brain/util의 heatOver와 같은 문턱)
function hot(W, m, cost) { if (!m.tac.survive || m.C < 5 || !W.rules.fatigue) return false; const f = m.fat + cost * 1.6; if (W.rules.wave) { if (m.type === '이단') return false; if (m.wave || (m.tac.waveChoose && m.waveWant)) return f > 165; } return f > 97; }
function step(W, m, c, all, X) {
  const b = c.bp, tc = c.t - c.s.cast, e = c.tgt;
  for (const o of b.items) {
    if (o.on === 2 || (!all && tc < o.s0)) continue;
    if (!o.on) {   // 시작: 당·머리 피로, 땅
      const cost = o.s ? o.s.cost : o.it.cost;
      if (m.glu < cost || (o.it.build && (m.z >= 1 || m.fat + cost * 1.6 > 100)) || (!o.it.build && hot(W, m, cost))) { o.on = 2; continue; }
      m.glu -= cost; if (o.it.build && W.rules.fatigue) m.fat += cost * 1.6; o.on = 1;
    }
    const k = all || tc >= o.s1 ? 1 : (tc - o.s0) / ((o.s1 - o.s0) || 1);
    if (o.it.build === 'earth') {   // 블록을 하나씩
      const n = o.it.blocks, upto = Math.floor(k * n + 1e-9), qx = -o.fy, qy = o.fx, vol = BK.gap * BK.h * o.it.th; if (o.grp < 0) o.grp = W._grp++;
      while (o.placed < upto) { const off = (o.placed - (n - 1) / 2) * BK.gap; X.addWall(W, { x: o.x + qx * off, y: o.y + qy * off, r: BK.r, hp: BK.hpM3 * vol, t: 1e9, own: -1, mat: 'earth', thick: o.it.th, grp: o.grp, mk: m.id }); o.placed++; }
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
function feats(m, K) { const e = K.e; return { base: 1, eFly: e.z >= 1 ? 1 : 0, eGround: e.z >= 1 ? 0 : 1, approach: Math.max(0, Math.min(1, K.vt / 5)), far: Math.max(0, Math.min(1, (K.d - 20) / 30)), tired: Math.max(0, Math.min(1, (m.fat - 60) / 40)), hurt: 1 - m.hp / m.hpMax }; }
function pick(W, m, K) {
  const lv = lvOf(m); let best = null, bs = -1; const F = lv >= 2 ? feats(m, K) : null;
  for (const n of NAMES) { const bp = BPD.blueprints[n]; if (!can(W, m, bp) || m.glu < costOf(W, m, bp)) continue; if (lv < 2) return n; let s = 0; for (const k in bp.score) s += bp.score[k] * F[k]; if (s > bs) { bs = s; best = n; } }   // 당이 모자라면 고르지 않는다
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
    blueprint(W, m, c) { const b = c.bp; if (!b) return; step(W, m, c, true, X); const f = m.fort; f.bpN++; f.bpItems += b.built; f.bpT += c.T; f.bpName[b.name] = (f.bpName[b.name] || 0) + 1; f.bpLast = W.t; },
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
}, {"../math":"src/math.js","../../data/blueprints.json":"data/blueprints.json","../../data/rules/blueprint.json":"data/rules/blueprint.json","../../data/rules/bulwark.json":"data/rules/bulwark.json","./bulwark":"src/rules/bulwark.js","./saltRing":"src/rules/saltRing.js"}];
D["src/rules/body.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 몸 받침 (rules.bodyK, v2.0 기본 2.3, SPEC 24장; 굳은 살은 v2.0 둘째 묶음, 25장)
 * 에너지 피해(불·번개·독·열선…)는 ÷ max(C, 1)^bodyK: 열 차단·절연 막·폐 거르기.
 * 부딪히는 피해('blunt': 돌·얼음·곡사·물·총·벽 밀기)는 한 방마다 굳은 살 = callus × log₂ C / log₂ 10 만큼 뺀다. 조약돌은 튕기고 무거운 돌·총알은 들어온다.
 * callus 0이면 첫 묶음 그대로(부딪힘도 ÷ C^bodyK, 총은 받치지 않는다).
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
        return v > m._cl ? v - m._cl : 0;
      }
      const s = W.spells[name]; if (s && s.mundane && !(cal > 0)) return v;
      if (m._bkC !== m.C) { m._bkC = m.C; m._bk = pow(Math.max(m.C, 1), W.rules.bodyK); }   // 선명도마다 한 번 (결정론 pow가 비싸다)
      return v / m._bk;
    },
  }),
};
}, {"../math":"src/math.js"}];
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
function crushed(W, blocks, ux, uy) {
  const out = []; const D = P.topple.depth;
  for (const q of W.ms) { if (q.hp <= 0 || q.z >= 1) continue; for (const b of blocks) { const rx = q.x - b.x, ry = q.y - b.y, t = rx * ux + ry * uy, w = -rx * uy + ry * ux; if (t > -0.3 && t < D + 0.3 && w > -B0.gap && w < B0.gap) { out.push(q); break; } } }
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
function segHit(x1, y1, x2, y2, w) { const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1; let t = ((w.x - x1) * dx + (w.y - y1) * dy) / L2; t = t < 0 ? 0 : t > 1 ? 1 : t; return hyp(x1 + dx * t - w.x, y1 + dy * t - w.y) < w.r; }
module.exports = {
  name: 'bulwark', switch: 'bulwark', on: W => W.rules.bulwark, form: { build: 'self', topple: 'target' }, api: { rateOf, buildT, nOf, volOf, crushed },
  engine: X => {
    const { DT, addWall } = X;
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
          w.hp -= k * DT;
        }
        // 버티는 벽(불벽·물 장막): 세운 사람이 굳지 않고 당이 있는 동안 남는다. 멈추면 사라진다
        for (const z of W.zones) {
          if (z.up === undefined) z.up = (z.n === '불벽' || z.n === '물 장막') ? 1 : 0;
          if (!z.up) continue; const q = z.src; z.age = (z.age || 0) + DT;
          if (q.hp <= 0 || q.st.stun > 0 || q.glu < P.upkeep.glu * DT || z.age > P.upkeep.max) { z.t = 0; z.up = 0; continue; }
          q.glu -= P.upkeep.glu * DT; if (z.t < 1) z.t = 1;
        }
      },
      mageStep(W, m) {
        const c = m.cast; if (c && c.s.t === 'build') {
          if (m.z >= 1) { m.cast = null; return; }   // 떠서는 흙을 못 끌어온다
          const t = c.t - c.s.cast; begin(W, m, c); if (t > 0) place(W, m, c, Math.floor(t * rateOf(m) / volOf(c.s) + 1e-9), addWall);
        }
        if ((W.step + m.id) % 6 === 0 && W.walls.length) { const ws = W.walls, q = X.wallsIn(W, m.x - 3, m.y - 3, m.x + 3, m.y + 3); for (let i = 0; i < q.length; i++) { const w = ws[q[i]]; if (w.grp >= 0 && !w.cage && hyp(w.x - m.x, w.y - m.y) < w.r + 1.2) { m.alog.wallT += 6 * DT; break; } } }   // 벽 곁에 있던 시간 (지표, 벽 격자)
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
      const R = B.C.rangeOf(m, s) || s.R; let best = 0, bx = 0, by = 0; const seen = {}, near = B.C.wallsIn(W, m.x - R, m.y - R, m.x + R, m.y + R).slice();
      for (let i = 0; i < near.length; i++) {
        const w = W.walls[near[i]]; if (w.cage || seen[w.grp] || hyp(w.x - m.x, w.y - m.y) > R) continue; if (w.grp >= 0) seen[w.grp] = 1;
        const blocks = w.grp >= 0 ? W.walls.filter(x => x.grp === w.grp) : [w], dx = w.x - m.x, dy = w.y - m.y, l = hyp(dx, dy) || 1;
        let foes = 0, mine = 0; for (const q of crushed(W, blocks, dx / l, dy / l)) { if (q.side === m.side) mine++; else foes++; }
        if (mine) continue; const v = foes * 0.6 * (m.tac.wallBreak ? 2 : 1); if (v > best) { best = v; bx = w.x; by = w.y; }
      }
      if (best > 0) { o.v = best; o.tx = bx; o.ty = by; }
    },
    hideCast(W, q, c, m) { if (!m || q.z > 2 || m.z > 2 || !W.walls.length) return false; const ws = W.walls, a = B.C.wallsIn(W, Math.min(q.x, m.x) - 1.5, Math.min(q.y, m.y) - 1.5, Math.max(q.x, m.x) + 1.5, Math.max(q.y, m.y) + 1.5); for (let i = 0; i < a.length; i++) { const w = ws[a[i]]; if (!w.cage && segHit(q.x, q.y, m.x, m.y, w)) return true; } return false; },   // 벽 뒤의 예비동작은 안 보인다
    // 세우기의 시간: 블록이 모두 찰 때까지
    commit(W, m, K, best, cast) { if (best.s.t === 'build') cast.T = buildT(m, best.s); },
  }),
};
}, {"../math":"src/math.js","../../data/rules/bulwark.json":"data/rules/bulwark.json","./flight":"src/rules/flight.js"}];
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
  if (W.rules.saltRing) { const R = saltR(W), px = m.x - W.width / 2, py = m.y - W.height / 2, b = px * ux + py * uy, c = px * px + py * py - R * R, q = b * b - c; if (c < 0 && q >= 0) t = Math.min(t, -b + Math.sqrt(q)); }
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
function dropStep(W, m, hurt, DT) {
  if (m.st.stun > 0) m.cut.on = false;
  else if (!m.cut.on && m.cut.z >= 0 && m.z <= m.cut.z) { m.cut.on = true; m.flog.cush++; if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + CU.fat); }
  if (m.cut.on) {
    if (m.vz < -CU.soft) { m.vz += (CU.cush - 1) * G * DT; if (m.vz > -CU.soft) m.vz = -CU.soft; }
    else if (m.flyWant && m.z >= 0.5 && canFly(m)) { m.fly = 1; m.cut.k = 0; m.cut.z = -1; m.cut.on = false; m.vz = -CU.soft; return; }   // 받아 잡기: 그 높이에서 다시 난다
    else m.vz = -CU.soft;
  } else m.vz -= (m.cut.k === 5 ? 1 + CU.dive : 1) * G * DT;
  m.z += m.vz * DT; m.flog.dz -= m.vz * DT; const k = 1 - 0.3 * DT; m.vx *= k; m.vy *= k; edge(W, m);
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
function antiAir(W, m, e) { for (const z of W.zones) if (z.k === 'sky' && z.src.side !== m.side && (hyp(z.x - e.x, z.y - e.y) < z.r + 2 || hyp(z.x - m.x, z.y - m.y) < z.r + 2)) return true; return false; }
function cutBrain(W, m, K, lv) {
  const T = m.tac, e = K.e;
  // 쿠션 높이: 떨어지는 중이면 판단 때마다 다시 잰다(대가부터). 회피로 떨어졌으면 3.5 m 아래에서 받아 잡는다
  if (lv >= 2 && (m.fly === 3 || (m.fly === 2 && !(m.st.stun > 0)))) { let h = cushH(m, lv); if (m.fly === 3) { const c = m.cut.z0 - (m.cut.k === 4 ? CBR.catchS : CBR.catch); if (c > h) h = c; } m.cut.z = h; }
  if (m.cut.cd > 0 || m.cut.k || m.fly > 1 || m.st.stun > 0 || m.st.root > 0) return;
  const read = T.readCast && !K.blindR;
  // 상급부터: 땅에서 발밑·함정·지대로 나를 노리는 수가 곧 풀리면 튀어오른다
  if (m.fly === 0) {
    if (!read) return;
    for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (c && c.tgt === m && GROUND(c.s) && c.T - c.t < CBR.hopRead) { m.cut.w = 3; CB.want = true; if (CB.fz < F.brain.zLow) CB.fz = F.brain.zLow; return; } }
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
  if (!how) for (const a of W.areas) { if (a.src.side === m.side || !a.vis || a.t > CBR.tca) continue; const px = m.x + m.vx * a.t - a.x, py = m.y + m.vy * a.t - a.y; if (hyp(px, py) < a.r + 0.5) { tx = -py; ty = px; how = 2; break; } }   // 구름: 가운데에서 먼 쪽으로
  if (!how && lv >= 3 && T.flyFeint !== false && read) for (const q of K.foes) { const c = q.cast; if (c && c.tgt === m && (c.s.t === 'thread' || c.s.t === 'touch') && c.T - c.t < CBR.release) { tx = m.x - q.x; ty = m.y - q.y; how = 3; if (m._feC !== c) { m._feC = c; m.flog.hfeint++; } break; } }   // 실: 풀리기 직전 옆으로
  if (how) {
    if (how === 1 && lv >= 3 && T.flyFeint !== false) { if (m.z >= 5) { m.cut.w = 5; const h = cushAt(m.z, 0, true, lv), c = m.z - CBR.catch; m.cut.z = h > c ? h : c; } else m.cut.w = 3; m.flog.hfeint++; }   // 높이 속이기: 겨눠진 높이에서 벗어난다
    else if (how === 1 && m.z >= 5) { m.cut.w = 5; const h = cushAt(m.z, 0, true, lv), c = m.z - CBR.catch; m.cut.z = h > c ? h : c; }   // 높으면 내리꽂았다 받아 잡는다
    else if (how === 1 && v > 15) m.cut.w = 1;                                                        // 빠르면 급정지 (앞길 겨냥이 빗나간다)
    else {   // 옆 튀기 (가던 쪽에 가까운 옆)
      const l = hyp(tx, ty) || 1; let sx = -ty / l, sy = tx / l; if (how === 2) { sx = tx / l; sy = ty / l; } else if (sx * m.vx + sy * m.vy < 0) { sx = -sx; sy = -sy; }
      if (W.rules.saltRing && SR.safeOn(m)) { const k = CU.side * G * CU.sideT * CU.sideT / 2 + 0.3; if (!SR.safeAt(W, m.x + sx * k + m.vx * CU.sideT, m.y + sy * k + m.vy * CU.sideT)) { sx = -sx; sy = -sy; if (!SR.safeAt(W, m.x + sx * k + m.vx * CU.sideT, m.y + sy * k + m.vy * CU.sideT)) return; } }   // 소금 원 밖으로 튀지 않는다 (v2.6)
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
module.exports = {
  name: 'flight', switch: 'flight', on: W => W.rules.flight, api: { F, outP, canFly },
  engine: X => {
    const { hurt, DT } = X;
    return {
      init(W) { W._fly = true; },   // 녹화에 높이·속도를 적는다
      mageStep(W, m) {
        if (m.cut.cd > 0) m.cut.cd -= DT;
        if (m.fly === 1) {
          if (m.st.stun > 0) fall(m);   // 날다가 굳으면(폭주 포함) 떨어진다
          else {
            const L = m.load;
            if (W.rules.fatigue && m.fat < 100) m.fat = Math.min(100, m.fat + (F.fat[0] + F.fat[1] * L + (L > 1 ? F.fat[2] * (L - 1) : 0)) * DT);
            const v = hyp(m.vx, m.vy); m.airFilm = false;
            if (v > F.film) { if (m.circles >= 3) m.airFilm = true; else m.st.blind = Math.max(m.st.blind, F.filmBlind); }   // 공기막이 없으면 눈이 먼다
            const lg = m.flog; lg.t += DT; lg.v += v * DT; lg.v2 += v * v * DT; if (v > F.corner - 5 && v < F.corner + 5) lg.corner += DT;
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
        if (m.roll > 0) m.roll -= DT;
        if (m.fly === 2 && W.rules.flightCut && !(m.st.stun > 0) && m.cut.z >= 0) { m.fly = 3; m.cut.k = 4; m.cut.z0 = m.fallZ; m.cut.on = false; }   // 굳음이 풀렸다: 쿠션을 뿜을 수 있다 (v2.3)
        if (m.fly === 3) { dropStep(W, m, hurt, DT); return true; }   // 끊었다 (v2.3)
        if (m.fly === 2) {   // 떨어진다
          m.vz -= G * DT; m.z += m.vz * DT; m.flog.dz -= m.vz * DT; const k = 1 - 0.5 * DT; m.vx *= k; m.vy *= k; edge(W, m);
          if (m.z <= 0) { m.z = 0; m.vz = 0; m.fly = 0; m.load = 0; m.flog.falls++; hurt(W, m, m.fallZ * F.fall, null, '추락', 'fall'); m.st.stun = Math.max(m.st.stun, F.fallStun); m.cast = m.castB = m.chan = null; }
          return true;
        }
        const P = outP(m), want = m.flyWant && P >= F.minP && !(W.salt.length && X.onSalt(W, m.x, m.y)), fz = want ? clamp(m.fz, F.zMin, F.zMax) : 0;
        let v = hyp(m.vx, m.vy);
        // 오르내림 (목표 높이로). 튀어오르기는 위로 3 g (v2.3)
        if (m.cut.k === 3) m.vz += CU.hop * G * DT;
        else { const vzT = clamp((fz - m.z) * 2, -F.vzMax, F.vzMax), va = W.rules.snap && m.tac.footwork >= 2 ? Math.max(F.vzAcc, aOf(W, m)) : F.vzAcc; m.vz += clamp(vzT - m.vz, -va * DT, va * DT); }
        const r = v / F.liftV, lift = F.lift / (1 + r * r) * clamp(1 + m.vz / F.glideVz, 0, 1), drag = F.drag * v * v * v;
        let spare = P - lift - drag, climb = 0;
        if (m.vz > 0) {   // 오르기: 남는 힘으로, 모자라는 몫은 속도에서 (높이는 속도의 저금통)
          climb = M * G * m.vz; const have = spare > 0 ? spare : 0;
          if (climb > have) {
            const dv2 = 2 * (climb - have) * DT / M;
            if (v * v > dv2) { const nv = Math.sqrt(v * v - dv2); m.vx *= nv / v; m.vy *= nv / v; v = nv; }
            else { m.vz = (have + v * v * M / (2 * DT)) / (M * G); m.vx = m.vy = 0; v = 0; climb = M * G * m.vz; }
            spare = spare < 0 ? spare : 0;
          } else spare -= climb;
        } else if (m.vz < 0 && v > 1) { const nv = Math.sqrt(v * v - 2 * G * m.vz * DT); m.vx *= nv / v; m.vy *= nv / v; v = nv; }   // 내리꽂으면 힘 없이 속도가 붙는다
        // 앞·옆 가속
        const mx = m.mv.x, my = m.mv.y, ml = hyp(mx, my), fv = m.st.root > 0 || !ml ? 0 : clamp(m.fv, 0, F.vMax);
        const tx = ml ? mx / ml * fv : 0, ty = ml ? my / ml * fv : 0, dx = tx - m.vx, dy = ty - m.vy;
        let ux = 1, uy = 0; if (v >= 1) { ux = m.vx / v; uy = m.vy / v; } else if (ml) { ux = mx / ml; uy = my / ml; }
        const vv = M * (v > 5 ? v : 5), gF = W.rules.snap && m.tac.footwork >= 2 ? Math.max(F.fwdG * G, aOf(W, m)) : F.fwdG * G, fwd = spare >= 0 ? Math.min(gF, spare / vv) : Math.max(-gF, spare / vv);   // 끊는 움직임: 앞뒤 가속의 한계도 a (앞으로는 여전히 남는 힘에 묶인다, v2.4)
        const al = dx * ux + dy * uy, at = -dx * uy + dy * ux;
        const aL = Math.min(clamp(al / DT, -gF, gF), fwd);   // 힘이 모자라면(fwd < 0) 늦춰진다
        const k = F.latK * clamp(spare / F.latP, 0.1, 1), latMax = Math.max(Math.min(F.latG * G, Math.max(k * v * v, v < 5 && fwd > 0 ? fwd : 0)), W.rules.snap && m.tac.footwork >= 2 ? aOf(W, m) : 0);   // 끊는 움직임: 느려도 a로 꺾는다 (v2.4)
        const aT = clamp(at / DT, -latMax, latMax);
        if (m.cut.k === 1) { const a = CU.brake * G * DT; if (v > a) { m.vx -= ux * a; m.vy -= uy * a; } else m.vx = m.vy = 0; }   // 급정지: 거꾸로 5 g (v2.3)
        else if (m.cut.k === 2) { const a = CU.side * G * DT; m.vx += m.cut.x * a; m.vy += m.cut.y * a; }                             // 옆 튀기: 옆으로 5 g
        else { m.vx += (aL * ux - aT * uy) * DT; m.vy += (aL * uy + aT * ux) * DT; }
        if (m.cut.k && m.cut.k < 4 && (m.cut.t -= DT) <= 0) m.cut.k = 0;
        const nv = hyp(m.vx, m.vy); if (nv > F.vMax) { m.vx *= F.vMax / nv; m.vy *= F.vMax / nv; }
        edge(W, m);
        m.z += m.vz * DT; m.flog.dz += Math.abs(m.vz) * DT; if (m.z > F.zMax) { m.z = F.zMax; m.vz = 0; }
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
        let near = 0, guns = 0, gunsFar = 0; for (const q of K.foes) { const dq = hyp(q.x - m.x, q.y - m.y); if (dq < Bn.crowd) near++; if (q._gun === undefined) q._gun = q.book.some(n => W.spells[n] && W.spells[n].mundane && W.spells[n].t === 'proj'); if (q._gun && dq < Bn.gunR) guns++; if (q._gun && dq < Bn.gunFar) gunsFar++; } if (near >= 3) ground++;
        if (T.readCast) for (const q of K.foes) for (let j = 0; j < 2; j++) { const c = j ? q.castB : q.cast; if (c && (c.s.kind === 'elec' || c.s.t === 'thread') && hyp(c.tx - m.x, c.ty - m.y) < 3) elecT = true; }
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
        if (m.fly === 1) for (const a of W.areas) { if (a.src !== m) continue; const px = m.x + m.vx * a.t, py = m.y + m.vy * a.t, dx = px - a.x, dy = py - a.y, l = hyp(dx, dy); if (l < a.r + Bn.ownGap) { K.vx = (dx || 0.1) / (l || 1) * 3; K.vy = (dy || 0.1) / (l || 1) * 3; if (fv < F.corner) fv = F.corner; } }
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
        if (!risk) for (const q of K.foes) for (let j = 0; j < 2; j++) { const x = j ? q.castB : q.cast; if (x && x.tgt === m && (binds(x.s) || x.s.kind === 'elec') && x.T - x.t < S.lowT) risk = true; }
        if (c.cool) risk = true;
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
        if (ev > Bn.leadV && (s.t === 'thread' || (s.t === 'area' && s.kind === 'elec'))) { const k = (s.t === 'area' ? s.delay * 0.5 : (o.Tw + K.d / (32 * (s.fast || 1))) * 0.6) * K.lead * (Bn.lead - 1); o.tx += e.vx * k; o.ty += e.vy * k; }
        if ((m.tac.flySkill || 3) >= 5 && OFF[s.t] && ev > F.corner * Bn.strike) o.v *= 1.3;
      },
    };
  },
};
function edge(W, m) {   // 싸움터 끝에선 그 방향의 속도가 0
  const DT = 1 / 30, x = m.x + m.vx * DT, y = m.y + m.vy * DT;
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
    const { DT, hurt, eff, hit, addZone, rangeOf, sizeOf } = X;
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
        if (W.rules.trapChain) for (const t of W.traps) if (t.chain > 0 && !t.done && (t.chain -= DT) <= 0) blast(W, t);
        // 하늘 덮개: 0.5 s마다 덮개 안에 떠 있는 적을 굳힌다
        if (W.step % F.sky.every === 0) for (const z of W.zones) {
          if (z.k !== 'sky') continue;
          for (const q of W.foes[z.src.side]) if (q.z >= 1 && q.hp > 0 && hyp(q.x - z.x, q.y - z.y) < z.r) { hurt(W, q, F.sky.dmg, z.src, z.n, 'elec'); eff(W, q, { stun: F.sky.stun, kind: 'elec' }, 1); z.src.fort.skyZap++; }
        }
        // 몰이길로 든 적 (지표): 틈 2.5 m 안의 땅에 선 적, 진지마다 3 s에 한 번
        if (W.step % 3 === 0) for (const m of W.ms) {
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
D["src/rules/index.js"] = [function (module, exports, require) {
'use strict';
/* 숨 결투장 — 규칙 모듈 목록 (SPEC 22장 모듈과 훅)
 * 규칙 하나 = 파일 하나. 모양: { name, switch?, default?, on(W, opt), form?, engine: X => ({훅}), types: X => ({틀: fn}), brain: B => ({훅}), brainTypes: B => ({틀: fn}), api? }
 *   on: 이 세계에서 켜졌는가 (세계를 만들 때 한 번). 없으면 switch 스위치를 따르고, switch도 없으면 늘 켜짐
 *   engine: 엔진 훅. 세계를 만들 때 켜진 규칙의 훅만 차례대로 W.H[훅]에 모인다 (꺼진 규칙은 비용 0)
 *   types·brainTypes: 새 마법 틀의 방출과 두뇌의 값. 틀은 스위치와 상관없이 늘 붙는다(마법이 규칙에 딸리면 rule 필드가 책에서 뺀다)
 *   brain: 두뇌 훅. 기본 두뇌가 세계마다 켜진 규칙의 것만 모은다 (brain/hooks.js)
 * 차례가 곧 같은 훅 안의 부르는 차례다. 예전 한 덩어리의 계산 차례를 그대로 따른다(결과가 비트 하나 안 바뀌게). 새 규칙은 뒤에 붙는다 */
const RULES = [require('./gear'), require('./terrain'), require('./saltRing'), require('./wave'), require('./control'), require('./risk'), require('./taunt'), require('./multiSlot'), require('./barrels'), require('./response'), require('./silver'), require('./body'), require('./evade'), require('./flight'), require('./light'), require('./bulwark'), require('./army'), require('./morale'), require('./saltLand'), require('./fort'), require('./snap'), require('./reflex'), require('./blueprint'), require('./tactics')];
// 엔진 훅의 이름과 부르는 자리 (SPEC 22장 표). 값을 돌려주는 훅은 받은 값을 고쳐 돌려준다
const ENGINE_HOOKS = ['place', 'init', 'world', 'wall', 'wallHit', 'lobLand', 'ceff', 'power', 'gate', 'share', 'release', 'overload', 'roll', 'hurtMod', 'hurt', 'effHold', 'eff', 'rain', 'smother', 'ring', 'fatRecover', 'mageStep', 'mageZones', 'move', 'speed', 'speedLate', 'accel', 'chan', 'projSub', 'ignite', 'areaHit', 'zoneTick', 'notice', 'trapCap', 'trapFire', 'preMove', 'castMove', 'walk'];
const BRAIN_HOOKS = ['aim', 'read', 'hideCast', 'steer', 'avoid', 'empty', 'circles', 'react', 'cancel', 'rest', 'prep', 'value', 'valueRisk', 'valueMid', 'valueLate', 'commit', 'castTime', 'phase', 'bound'];
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
}, {"./gear":"src/rules/gear.js","./terrain":"src/rules/terrain.js","./saltRing":"src/rules/saltRing.js","./wave":"src/rules/wave.js","./control":"src/rules/control.js","./risk":"src/rules/risk.js","./taunt":"src/rules/taunt.js","./multiSlot":"src/rules/multiSlot.js","./barrels":"src/rules/barrels.js","./response":"src/rules/response.js","./silver":"src/rules/silver.js","./body":"src/rules/body.js","./evade":"src/rules/evade.js","./flight":"src/rules/flight.js","./light":"src/rules/light.js","./bulwark":"src/rules/bulwark.js","./army":"src/rules/army.js","./morale":"src/rules/morale.js","./saltLand":"src/rules/saltLand.js","./fort":"src/rules/fort.js","./snap":"src/rules/snap.js","./reflex":"src/rules/reflex.js","./blueprint":"src/rules/blueprint.js","./tactics":"src/rules/tactics.js"}];
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
 * 도망치는 사람은 가장 가까운 싸움터 끝으로 달리고 공격하지 않는다(alog.fledT = 도망을 시작한 때). 끝에 닿으면 싸움에서 빠진다(체력 0으로 센다, alog.fled) */
const { hyp, pow } = require('../math');
const M = require('../../data/rules/army.json').morale;
const hard = m => Math.sqrt(Math.max(m.C, 0.01)) * (m.skill ? M.skill[m.skill] || 1 : 1);
module.exports = {
  name: 'morale', switch: 'morale', on: W => W.rules.morale, api: { hard },
  engine: X => ({
    world(W) {
      if (!W._sideN) { W._sideN = []; for (const m of W.ms) W._sideN[m.side] = (W._sideN[m.side] || 0) + 1; }
      const every = Math.round(M.every / X.DT); if (W.step % every) return;
      const down = []; for (const m of W.ms) if (m.hp <= 0) down[m.side] = (down[m.side] || 0) + 1;
      const k = pow(M.decay, M.every);   // 충격은 초당 반으로
      for (const m of W.ms) {
        if (m.hp <= 0 || m.flee || W._sideN[m.side] < M.minSide) continue;
        const cas = (down[m.side] || 0) / W._sideN[m.side], p = (cas > M.cas ? (cas - M.cas) * M.casK : 0) + m.shock * M.shock;
        m.shock *= k;
        if (p > 0 && W.rng() < p / hard(m) * M.every) { m.flee = 1; m.alog.fledT = W.t; m.cast = m.castB = m.chan = null; }   // fledT: 도망을 시작한 때
      }
    },
    // 동료가 큰 수에 쓰러졌다
    hurt(W, m, v, src, name, kind) {
      if (m.hp > 0 || v < M.shockDmg || W._sideN == null || W._sideN[m.side] < M.minSide) return;
      for (const q of W.ms) if (q !== m && q.hp > 0 && q.side === m.side && hyp(q.x - m.x, q.y - m.y) < M.shockR) q.shock += 1;
    },
    // 끝에 닿으면 빠진다
    mageStep(W, m) {
      if (!m.flee) return; const e = M.edge;
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
    const { C, hyp, logDec, bigAttack, heatOver } = B;
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
          if (m.tac.survive && m.C >= 5 && heatOver(W, m, s.cost, 0, 0.8)) continue;   // 스스로 죽지 않기 (v2.6): 머리가 넘칠 막기는 하지 않는다
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
    const c = j ? q.castB : q.cast; if (!(c && c.tgt === m && LEAD[c.s.t] && c.T - c.t < P.read)) continue;
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
    const { DT, roll } = X;
    const over = (W, R, vx, vy, fv, dur) => { R.vx = vx; R.vy = vy; R.fv = fv; R.until = W.t + dur; };
    function done(R) { const p = R.pend; if (p.j) { R.shotJ++; if (!p.hit) R.missJ++; } else { R.shotN++; if (!p.hit) R.missN++; } R.pend = null; }
    return {
      mageStep(W, m) {
        if (m.C < 5 || m.hp <= 0) return;
        const R = m.rx;
        if (R.pend && W.t > R.pend.until) done(R);
        if (R.lrt && m.fly === 0) { R.lrt = 0; if (canRoll(m)) roll(W, m, R.lx, R.ly, m.st.lime > 0 ? 4 : 8, m.autoDodge ? 0.6 : 0.8); }   // 내려앉았다: 구른다
        if (W.step % 3 === 0) { const a = R.tvx, b = R.tvy; if ((m.vx * a + m.vy * b) < 0 && hyp(m.vx, m.vy) > 1 && hyp(a, b) > 1) R.turns++; R.tvx = m.vx; R.tvy = m.vy; }   // 방향 전환
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
    const { DT } = X;
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
D["src/rules/saltLand.js"] = [function (module, exports, require) {
'use strict';
/* 규칙: 소금 땅 (장면의 salt 사각형이 있을 때만, v2.0 둘째 묶음, SPEC 25장)
 * 소금은 마력을 끊는다(WORLD 148): 소금 땅 위에서 만들어지는 마법은 흩어진다(g = 0, 총은 그대로), 소금 땅 위에선 뜰 수 없다(rules/flight가 본다).
 * 소금 도시 장면: 싸움터 대부분이 소금 땅이고 광장만 맨땅이다 */
module.exports = {
  name: 'saltLand', on: W => W.salt.length > 0,
  engine: X => ({
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
  const Rf = saltRAt(W, W.t + SAFE.look), a = fly ? SAFE.flyA : SAFE.walkA, Rs = Rf - Math.min(SAFE.pad, SAFE.padK * Rf), vr = m.vx * ux + m.vy * uy, brake = vr > 0 ? vr * vr / (2 * a) : 0;
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
const outSalt = (W, x, y) => W.rules.saltRing && hyp(x - W.width / 2, y - W.height / 2) > saltR(W);
module.exports = {
  name: 'saltRing', on: W => W.rules.saltRing, api: { SALT, SAFE, saltR, saltRAt, outSalt, wall, safeAt, safeOn },
  engine: X => ({
    gate(W, m, s, tx, ty) { if (s.mundane) return false; const p = X.formPoint(m, s, tx, ty) || [m.x, m.y]; return outSalt(W, p[0], p[1]); },   // 선 밖에선 마법이 서지 않는다
    mageStep(W, m) { if (outSalt(W, m.x, m.y)) X.hurt(W, m, SALT.dps * X.DT, null, '소금', 'salt'); },   // 선 밖에선 몸이 마른다
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
    // 단단한 벽 (v2.6): 안전 반경 밖으로 나가는 걸음을 지운다
    bound(W, m, K) {
      if (!safeOn(m)) return;
      if (saltRAt(W, W.t + SAFE.land) < SAFE.landR) { if (B.groundSafe(W, m)) m.flyWant = false; else if (m.fv > SAFE.smallV) m.fv = SAFE.smallV; }   // 좁은 원: 땅이 안전하면 내려앉아 걷고, 아니면 떠서 천천히
      const o = wallOf(W, m, K.vx, K.vy); if (o) { K.vx = o[0]; K.vy = o[1]; }
    },
  }),
};
}, {"../math":"src/math.js"}];
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
    const { DT } = X;
    return {
      // 걸음: 가속 한계 안에서 목표 속도로 곧장
      // 속도 차를 지금 가는 쪽(앞뒤)과 옆으로 나눠: 옆·가속은 a, 거꾸로 밟아 서기(앞뒤로 줄이기)는 brake × a. 가는 게 없으면 a
      walk(W, m, tx, ty, acc) {
        const a = aOf(W, m) * (acc < 9 ? acc / 9 : 1) * DT, dx = tx - m.vx, dy = ty - m.vy, v = hyp(m.vx, m.vy);
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
      if (lv >= 2 && m.phase === 'probe') {
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
    const C = B.C, { inDist } = require('../brain/techniques/rhythm'), RC = new WeakMap(), BPA = () => { const r = C.RULES.find(x => x.name === 'blueprint'); return r && r.api; };
    // 사거리: 직사(투사체·실·몸·앞으로 뿜기)와 곡사·구름의 가장 긴 것 (덱마다 한 번)
    function ranges(m, D) {
      let r = RC.get(D); if (r) return r; r = { dir: 0, ind: 0 };
      for (let i = 0; i < D.sp.length; i++) { const s = D.sp[i], R = s.t === 'cone' ? s.L * C.sizeOf(m, s) : s.t === 'touch' ? 1.3 : s.home ? 12 : D.R[i]; if (DIRECT[s.t] && R > r.dir) r.dir = R; if (INDIRECT[s.t] && R > r.ind) r.ind = R; }
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
        if (los) for (const o of W.obs) { const od = hyp(o.x - x, o.y - y); if (od < 3 && od > 0.1) { const sx = x + (o.x - x) / od * 1.5, sy = y + (o.y - y) / od * 1.5; if (C.blocked(W, sx, sy, e.x, e.y, 0)) { s += G.peek; kind |= 2; break; } } }
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
      if (s.t === 'trap' && e.z < 1) { const [rx, ry] = retreatOf(W, e), l = hyp(rx - e.x, ry - e.y) || 1; if (hyp(tx - (e.x + (rx - e.x) / l * 3), ty - (e.y + (ry - e.y) / l * 3)) < 2) return P.force.path; }   // 퇴로에 함정
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
}, {"../math":"src/math.js","../../data/rules/tactics.json":"data/rules/tactics.json","../brain/techniques/rhythm":"src/brain/techniques/rhythm.js"}];
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
      hurtMod(W, m, v, kind) { if (m.z >= 1) return v; for (const z of W.zones) { if (!inZone(z, m.x, m.y)) continue; if (z.k === 'absorb') { if (kind === 'elec') v *= 0.5; if (kind === 'fire') v *= 0.4; } if (z.k === 'mist' && kind === 'fire') v *= 0.5; } return v; },
      // 걸음마다: 선 지대의 효과
      mageZones(W, m) {
        if (m.z >= 1) return;   // 떠 있으면 지대에 닿지 않는다 (v2.0, rules/flight)
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
      accel(W, m, acc) { if (m.z >= 1) return acc; for (const z of W.zones) if (z.k === 'ice' && z.src !== m && inZone(z, m.x, m.y)) return 1.5; return acc; },
      // 지대의 시간, 산이 벽을 녹인다
      zoneTick(W) { for (const z of W.zones) { z.t -= DT; if (z.k === 'acid') for (const w of W.walls) if (hyp(w.x - z.x, w.y - z.y) < (z.r || 2) + w.r) { if (w.hp > 0 && w.hp <= 25 * DT && z.src.mlog) z.src.mlog.razed++; w.hp -= 25 * DT; } } },   // 녹여 없앤 벽은 지형 지표에 (v2.2)
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
G.ArenaData = { spells: G.ArenaCore.SPELLS, books: load('data/books.json'), scenes: {"archmage-50":{"v":"2.6.0","name":"대마법사 대 평범 50명 (둘러싸기, node cli.js ring 씨앗 1과 같다)","seed":1,"width":40,"height":30,"maxT":90,"layout":"ring","rules":{},"sides":[{"name":"대마법사","brain":"기본","mages":[{"tier":"대마법사","deck":"광역"}]},{"name":"무리","brain":"기본","mages":[{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"}]}],"spells":{},"decks":{}},"duel":{"v":"2.6.0","name":"1대1: 중간 합법 최강 대 중간 기본기","seed":1,"width":40,"height":30,"maxT":120,"rules":{"barrels":true},"obstacles":[{"x":14,"y":9,"r":1.4},{"x":26,"y":21,"r":1.4},{"x":20,"y":15,"r":1},{"x":11,"y":22,"r":1.1},{"x":29,"y":8,"r":1.1}],"barrels":[{"x":20,"y":9},{"x":20,"y":21}],"walls":[],"sides":[{"name":"청","brain":"기본","mages":[{"tier":"중간","deck":"합법 최강","x":6,"y":15}]},{"name":"적","brain":"기본","mages":[{"tier":"중간","deck":"기본기","x":34,"y":15}]}],"spells":{},"decks":{}},"element-league":{"v":"2.6.0","name":"원소 리그: 평범 여섯이 원소 기본책으로 난전","seed":4,"width":40,"height":30,"maxT":300,"rules":{},"sides":[{"name":"불","brain":"기본","mages":[{"tier":"평범","deck":"불"}]},{"name":"번개","brain":"기본","mages":[{"tier":"평범","deck":"번개"}]},{"name":"흙","brain":"기본","mages":[{"tier":"평범","deck":"흙"}]},{"name":"물","brain":"기본","mages":[{"tier":"평범","deck":"물"}]},{"name":"얼음","brain":"기본","mages":[{"tier":"평범","deck":"얼음"}]},{"name":"독","brain":"기본","mages":[{"tier":"평범","deck":"독"}]}],"spells":{},"decks":{}},"musket-arc":{"v":"2.6.0","name":"머스킷 반원: 대마법사 대 병사 20명","seed":1,"width":40,"height":30,"maxT":90,"rules":{},"obstacles":[{"x":17,"y":11,"r":1},{"x":17,"y":19,"r":1}],"barrels":[],"walls":[{"x":13,"y":13,"r":0.6,"hp":200},{"x":13,"y":17,"r":0.6,"hp":200}],"sides":[{"name":"대마법사","brain":"기본","mages":[{"tier":"대마법사","deck":"광역","x":6,"y":15}]},{"name":"총병","brain":"기본","mages":[{"tier":"병사","deck":"머스킷","x":12.43,"y":3.18},{"tier":"병사","deck":"머스킷","x":14.42,"y":3.61},{"tier":"병사","deck":"머스킷","x":16.32,"y":4.29},{"tier":"병사","deck":"머스킷","x":18.08,"y":5.2},{"tier":"병사","deck":"머스킷","x":19.67,"y":6.32},{"tier":"병사","deck":"머스킷","x":21.05,"y":7.63},{"tier":"병사","deck":"머스킷","x":22.19,"y":9.1},{"tier":"병사","deck":"머스킷","x":23.07,"y":10.69},{"tier":"병사","deck":"머스킷","x":23.66,"y":12.38},{"tier":"병사","deck":"머스킷","x":23.96,"y":14.12},{"tier":"병사","deck":"머스킷","x":23.96,"y":15.88},{"tier":"병사","deck":"머스킷","x":23.66,"y":17.62},{"tier":"병사","deck":"머스킷","x":23.07,"y":19.31},{"tier":"병사","deck":"머스킷","x":22.19,"y":20.9},{"tier":"병사","deck":"머스킷","x":21.05,"y":22.37},{"tier":"병사","deck":"머스킷","x":19.67,"y":23.68},{"tier":"병사","deck":"머스킷","x":18.08,"y":24.8},{"tier":"병사","deck":"머스킷","x":16.32,"y":25.71},{"tier":"병사","deck":"머스킷","x":14.42,"y":26.39},{"tier":"병사","deck":"머스킷","x":12.43,"y":26.82}]}],"spells":{},"decks":{}},"v2-agile-legend":{"v":"2.6.0","name":"대마법사 전설 대 대가: 반사 겹·끊는 움직임·청사진 (청사진 덱, 매 걸음 녹화, 200×150)","seed":4,"width":200,"height":150,"rules":{"flightCut":true,"fort":true,"trapChain":true,"reflex":true,"snap":true,"blueprint":true},"recEvery":1,"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가","deck":"대마법사 청사진"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 8/9)이 이기고 길이(69.87 s)가 가운데값(69.87 s)에 가장 가까운 판"},"v2-archmage-100":{"v":"2.6.0","name":"대마법사 대 평범 100명 둘러싸기 [risk+saltRing+wave]","seed":3,"maxT":90,"layout":"ring","rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"대마법사","mages":[{"tier":"대마법사","deck":"광역"}]},{"name":"평범","mages":[{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"},{"tier":"평범","deck":"기본기"}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 0, 15/15)이 이기고 길이(90.03 s)가 가운데값(90.03 s)에 가장 가까운 판","width":200,"height":150},"v2-army-ambush":{"v":"2.6.0","name":"기습: 대마법사 대 머스킷 40 반원 (14 m, 벽 없이)","seed":5,"width":40,"height":30,"maxT":90,"obstacles":[],"rules":{"saltRing":false},"sides":[{"name":"대마법사","mages":[{"x":6,"y":15,"tier":"대마법사","skill":"대가","deck":"대마법사 성"}]},{"name":"총병","mages":[{"x":6.55,"y":1.71,"tier":"병사","deck":"머스킷"},{"x":7.65,"y":1.79,"tier":"병사","deck":"머스킷"},{"x":8.73,"y":1.96,"tier":"병사","deck":"머스킷"},{"x":9.8,"y":2.2,"tier":"병사","deck":"머스킷"},{"x":10.85,"y":2.52,"tier":"병사","deck":"머스킷"},{"x":11.86,"y":2.92,"tier":"병사","deck":"머스킷"},{"x":12.84,"y":3.4,"tier":"병사","deck":"머스킷"},{"x":13.78,"y":3.94,"tier":"병사","deck":"머스킷"},{"x":14.67,"y":4.56,"tier":"병사","deck":"머스킷"},{"x":15.5,"y":5.23,"tier":"병사","deck":"머스킷"},{"x":16.28,"y":5.97,"tier":"병사","deck":"머스킷"},{"x":16.99,"y":6.77,"tier":"병사","deck":"머스킷"},{"x":17.64,"y":7.61,"tier":"병사","deck":"머스킷"},{"x":18.21,"y":8.5,"tier":"병사","deck":"머스킷"},{"x":18.71,"y":9.43,"tier":"병사","deck":"머스킷"},{"x":19.13,"y":10.4,"tier":"병사","deck":"머스킷"},{"x":19.47,"y":11.39,"tier":"병사","deck":"머스킷"},{"x":19.73,"y":12.41,"tier":"병사","deck":"머스킷"},{"x":19.9,"y":13.44,"tier":"병사","deck":"머스킷"},{"x":19.99,"y":14.48,"tier":"병사","deck":"머스킷"},{"x":19.99,"y":15.52,"tier":"병사","deck":"머스킷"},{"x":19.9,"y":16.56,"tier":"병사","deck":"머스킷"},{"x":19.73,"y":17.59,"tier":"병사","deck":"머스킷"},{"x":19.47,"y":18.61,"tier":"병사","deck":"머스킷"},{"x":19.13,"y":19.6,"tier":"병사","deck":"머스킷"},{"x":18.71,"y":20.57,"tier":"병사","deck":"머스킷"},{"x":18.21,"y":21.5,"tier":"병사","deck":"머스킷"},{"x":17.64,"y":22.39,"tier":"병사","deck":"머스킷"},{"x":16.99,"y":23.23,"tier":"병사","deck":"머스킷"},{"x":16.28,"y":24.03,"tier":"병사","deck":"머스킷"},{"x":15.5,"y":24.77,"tier":"병사","deck":"머스킷"},{"x":14.67,"y":25.44,"tier":"병사","deck":"머스킷"},{"x":13.78,"y":26.06,"tier":"병사","deck":"머스킷"},{"x":12.84,"y":26.6,"tier":"병사","deck":"머스킷"},{"x":11.86,"y":27.08,"tier":"병사","deck":"머스킷"},{"x":10.85,"y":27.48,"tier":"병사","deck":"머스킷"},{"x":9.8,"y":27.8,"tier":"병사","deck":"머스킷"},{"x":8.73,"y":28.04,"tier":"병사","deck":"머스킷"},{"x":7.65,"y":28.21,"tier":"병사","deck":"머스킷"},{"x":6.55,"y":28.29,"tier":"병사","deck":"머스킷"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 9/9)이 이기고 길이(5.5 s)가 가운데값(5.5 s)에 가장 가까운 판"},"v2-army-field":{"v":"2.6.0","name":"들판: 대마법사 대 머스킷 100 (넷 줄, 돌아가며 쏘기)","seed":1,"width":1000,"height":600,"maxT":360,"obstacles":0,"rules":{"saltRing":false},"sides":[{"name":"대마법사","mages":[{"x":350,"y":300,"z":10,"tier":"대마법사","skill":"대가","deck":"대마법사 성"}]},{"name":"군대","mages":[{"tier":"병사","deck":"머스킷","x":600,"y":263,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":266,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":269,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":272,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":275,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":278,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":281,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":284,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":287,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":290,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":293,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":296,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":299,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":302,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":305,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":308,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":311,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":314,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":317,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":320,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":323,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":326,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":329,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":332,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":600,"y":335,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":263,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":266,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":269,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":272,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":275,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":278,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":281,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":284,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":287,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":290,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":293,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":296,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":299,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":302,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":305,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":308,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":311,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":314,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":317,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":320,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":323,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":326,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":329,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":332,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":603,"y":335,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":263,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":266,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":269,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":272,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":275,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":278,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":281,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":284,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":287,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":290,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":293,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":296,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":299,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":302,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":305,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":308,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":311,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":314,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":317,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":320,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":323,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":326,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":329,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":332,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":606,"y":335,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":263,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":266,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":269,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":272,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":275,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":278,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":281,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":284,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":287,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":290,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":293,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":296,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":299,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":302,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":305,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":308,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":311,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":314,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":317,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":320,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":323,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":326,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":329,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":332,"tac":{"volley":4}},{"tier":"병사","deck":"머스킷","x":609,"y":335,"tac":{"volley":4}}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 7/9)이 이기고 길이(261.47 s)가 가운데값(261.47 s)에 가장 가까운 판"},"v2-army-prepared":{"v":"2.6.0","name":"준비: 보루 안의 대마법사 대 머스킷 40 반원","seed":3,"width":40,"height":30,"maxT":90,"obstacles":[],"rules":{"saltRing":false},"sides":[{"name":"대마법사","mages":[{"x":6,"y":15,"tier":"대마법사","skill":"대가","deck":"대마법사 성"}]},{"name":"총병","mages":[{"x":6.55,"y":1.71,"tier":"병사","deck":"머스킷"},{"x":7.65,"y":1.79,"tier":"병사","deck":"머스킷"},{"x":8.73,"y":1.96,"tier":"병사","deck":"머스킷"},{"x":9.8,"y":2.2,"tier":"병사","deck":"머스킷"},{"x":10.85,"y":2.52,"tier":"병사","deck":"머스킷"},{"x":11.86,"y":2.92,"tier":"병사","deck":"머스킷"},{"x":12.84,"y":3.4,"tier":"병사","deck":"머스킷"},{"x":13.78,"y":3.94,"tier":"병사","deck":"머스킷"},{"x":14.67,"y":4.56,"tier":"병사","deck":"머스킷"},{"x":15.5,"y":5.23,"tier":"병사","deck":"머스킷"},{"x":16.28,"y":5.97,"tier":"병사","deck":"머스킷"},{"x":16.99,"y":6.77,"tier":"병사","deck":"머스킷"},{"x":17.64,"y":7.61,"tier":"병사","deck":"머스킷"},{"x":18.21,"y":8.5,"tier":"병사","deck":"머스킷"},{"x":18.71,"y":9.43,"tier":"병사","deck":"머스킷"},{"x":19.13,"y":10.4,"tier":"병사","deck":"머스킷"},{"x":19.47,"y":11.39,"tier":"병사","deck":"머스킷"},{"x":19.73,"y":12.41,"tier":"병사","deck":"머스킷"},{"x":19.9,"y":13.44,"tier":"병사","deck":"머스킷"},{"x":19.99,"y":14.48,"tier":"병사","deck":"머스킷"},{"x":19.99,"y":15.52,"tier":"병사","deck":"머스킷"},{"x":19.9,"y":16.56,"tier":"병사","deck":"머스킷"},{"x":19.73,"y":17.59,"tier":"병사","deck":"머스킷"},{"x":19.47,"y":18.61,"tier":"병사","deck":"머스킷"},{"x":19.13,"y":19.6,"tier":"병사","deck":"머스킷"},{"x":18.71,"y":20.57,"tier":"병사","deck":"머스킷"},{"x":18.21,"y":21.5,"tier":"병사","deck":"머스킷"},{"x":17.64,"y":22.39,"tier":"병사","deck":"머스킷"},{"x":16.99,"y":23.23,"tier":"병사","deck":"머스킷"},{"x":16.28,"y":24.03,"tier":"병사","deck":"머스킷"},{"x":15.5,"y":24.77,"tier":"병사","deck":"머스킷"},{"x":14.67,"y":25.44,"tier":"병사","deck":"머스킷"},{"x":13.78,"y":26.06,"tier":"병사","deck":"머스킷"},{"x":12.84,"y":26.6,"tier":"병사","deck":"머스킷"},{"x":11.86,"y":27.08,"tier":"병사","deck":"머스킷"},{"x":10.85,"y":27.48,"tier":"병사","deck":"머스킷"},{"x":9.8,"y":27.8,"tier":"병사","deck":"머스킷"},{"x":8.73,"y":28.04,"tier":"병사","deck":"머스킷"},{"x":7.65,"y":28.21,"tier":"병사","deck":"머스킷"},{"x":6.55,"y":28.29,"tier":"병사","deck":"머스킷"}]}],"walls":[{"x":8.2,"y":15,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":8.05,"y":15.79,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":7.63,"y":16.48,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":6.98,"y":16.97,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":6.2,"y":17.19,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":5.4,"y":17.12,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":4.67,"y":16.76,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":4.13,"y":16.16,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":3.84,"y":15.4,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":3.84,"y":14.6,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":4.13,"y":13.84,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":4.67,"y":13.24,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":5.4,"y":12.88,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":6.2,"y":12.81,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":6.98,"y":13.03,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":7.63,"y":13.52,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000},{"x":8.05,"y":14.21,"r":0.45,"hp":256,"mat":"earth","thick":0.5,"grp":1000}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 9/9)이 이기고 길이(5.5 s)가 가운데값(5.5 s)에 가장 가까운 판"},"v2-army-salt-city":{"v":"2.6.0","name":"소금 도시: 걸어 들어가는 대마법사 대 머스킷 60 (골목, 광장 셋만 맨땅)","seed":9,"width":200,"height":150,"maxT":240,"obstacles":[{"x":18,"y":8,"r":3.5},{"x":18,"y":19,"r":3.5},{"x":18,"y":30,"r":3.5},{"x":18,"y":41,"r":3.5},{"x":18,"y":52,"r":3.5},{"x":18,"y":63,"r":3.5},{"x":18,"y":74,"r":3.5},{"x":18,"y":85,"r":3.5},{"x":18,"y":96,"r":3.5},{"x":18,"y":107,"r":3.5},{"x":18,"y":118,"r":3.5},{"x":18,"y":129,"r":3.5},{"x":18,"y":140,"r":3.5},{"x":29,"y":8,"r":3.5},{"x":29,"y":19,"r":3.5},{"x":29,"y":30,"r":3.5},{"x":29,"y":41,"r":3.5},{"x":29,"y":52,"r":3.5},{"x":29,"y":63,"r":3.5},{"x":29,"y":74,"r":3.5},{"x":29,"y":85,"r":3.5},{"x":29,"y":96,"r":3.5},{"x":29,"y":107,"r":3.5},{"x":29,"y":118,"r":3.5},{"x":29,"y":129,"r":3.5},{"x":29,"y":140,"r":3.5},{"x":40,"y":8,"r":3.5},{"x":40,"y":19,"r":3.5},{"x":40,"y":30,"r":3.5},{"x":40,"y":41,"r":3.5},{"x":40,"y":52,"r":3.5},{"x":40,"y":63,"r":3.5},{"x":40,"y":74,"r":3.5},{"x":40,"y":85,"r":3.5},{"x":40,"y":96,"r":3.5},{"x":40,"y":107,"r":3.5},{"x":40,"y":118,"r":3.5},{"x":40,"y":129,"r":3.5},{"x":40,"y":140,"r":3.5},{"x":51,"y":8,"r":3.5},{"x":51,"y":19,"r":3.5},{"x":51,"y":63,"r":3.5},{"x":51,"y":74,"r":3.5},{"x":51,"y":85,"r":3.5},{"x":51,"y":96,"r":3.5},{"x":51,"y":107,"r":3.5},{"x":51,"y":118,"r":3.5},{"x":51,"y":129,"r":3.5},{"x":51,"y":140,"r":3.5},{"x":62,"y":19,"r":3.5},{"x":62,"y":63,"r":3.5},{"x":62,"y":74,"r":3.5},{"x":62,"y":85,"r":3.5},{"x":62,"y":96,"r":3.5},{"x":62,"y":107,"r":3.5},{"x":62,"y":118,"r":3.5},{"x":62,"y":129,"r":3.5},{"x":62,"y":140,"r":3.5},{"x":73,"y":8,"r":3.5},{"x":73,"y":19,"r":3.5},{"x":73,"y":96,"r":3.5},{"x":73,"y":107,"r":3.5},{"x":73,"y":118,"r":3.5},{"x":73,"y":129,"r":3.5},{"x":73,"y":140,"r":3.5},{"x":84,"y":8,"r":3.5},{"x":84,"y":19,"r":3.5},{"x":84,"y":30,"r":3.5},{"x":84,"y":41,"r":3.5},{"x":84,"y":52,"r":3.5},{"x":84,"y":63,"r":3.5},{"x":84,"y":74,"r":3.5},{"x":84,"y":85,"r":3.5},{"x":84,"y":96,"r":3.5},{"x":84,"y":107,"r":3.5},{"x":84,"y":118,"r":3.5},{"x":84,"y":129,"r":3.5},{"x":84,"y":140,"r":3.5},{"x":95,"y":8,"r":3.5},{"x":95,"y":19,"r":3.5},{"x":95,"y":74,"r":3.5},{"x":95,"y":85,"r":3.5},{"x":95,"y":96,"r":3.5},{"x":95,"y":107,"r":3.5},{"x":95,"y":118,"r":3.5},{"x":95,"y":129,"r":3.5},{"x":95,"y":140,"r":3.5},{"x":106,"y":8,"r":3.5},{"x":106,"y":19,"r":3.5},{"x":106,"y":30,"r":3.5},{"x":106,"y":41,"r":3.5},{"x":106,"y":52,"r":3.5},{"x":106,"y":63,"r":3.5},{"x":106,"y":74,"r":3.5},{"x":106,"y":85,"r":3.5},{"x":106,"y":129,"r":3.5},{"x":106,"y":140,"r":3.5},{"x":117,"y":8,"r":3.5},{"x":117,"y":30,"r":3.5},{"x":117,"y":41,"r":3.5},{"x":117,"y":52,"r":3.5},{"x":117,"y":63,"r":3.5},{"x":117,"y":74,"r":3.5},{"x":117,"y":85,"r":3.5},{"x":117,"y":118,"r":3.5},{"x":117,"y":129,"r":3.5},{"x":117,"y":140,"r":3.5},{"x":128,"y":8,"r":3.5},{"x":128,"y":19,"r":3.5},{"x":128,"y":30,"r":3.5},{"x":128,"y":41,"r":3.5},{"x":128,"y":52,"r":3.5},{"x":128,"y":107,"r":3.5},{"x":128,"y":118,"r":3.5},{"x":128,"y":129,"r":3.5},{"x":128,"y":140,"r":3.5},{"x":139,"y":8,"r":3.5},{"x":139,"y":19,"r":3.5},{"x":139,"y":30,"r":3.5},{"x":139,"y":41,"r":3.5},{"x":139,"y":52,"r":3.5},{"x":139,"y":63,"r":3.5},{"x":139,"y":74,"r":3.5},{"x":139,"y":85,"r":3.5},{"x":139,"y":96,"r":3.5},{"x":139,"y":118,"r":3.5},{"x":139,"y":129,"r":3.5},{"x":139,"y":140,"r":3.5},{"x":150,"y":8,"r":3.5},{"x":150,"y":19,"r":3.5},{"x":150,"y":30,"r":3.5},{"x":150,"y":85,"r":3.5},{"x":150,"y":96,"r":3.5},{"x":150,"y":107,"r":3.5},{"x":150,"y":118,"r":3.5},{"x":150,"y":129,"r":3.5},{"x":150,"y":140,"r":3.5},{"x":161,"y":8,"r":3.5},{"x":161,"y":19,"r":3.5},{"x":161,"y":30,"r":3.5},{"x":161,"y":41,"r":3.5},{"x":161,"y":74,"r":3.5},{"x":161,"y":85,"r":3.5},{"x":161,"y":96,"r":3.5},{"x":161,"y":107,"r":3.5},{"x":161,"y":140,"r":3.5},{"x":172,"y":8,"r":3.5},{"x":172,"y":19,"r":3.5},{"x":172,"y":74,"r":3.5},{"x":172,"y":85,"r":3.5},{"x":172,"y":96,"r":3.5},{"x":172,"y":107,"r":3.5},{"x":172,"y":118,"r":3.5},{"x":172,"y":129,"r":3.5},{"x":172,"y":140,"r":3.5},{"x":183,"y":8,"r":3.5},{"x":183,"y":19,"r":3.5},{"x":183,"y":30,"r":3.5},{"x":183,"y":41,"r":3.5},{"x":183,"y":52,"r":3.5},{"x":183,"y":74,"r":3.5},{"x":183,"y":129,"r":3.5},{"x":183,"y":140,"r":3.5},{"x":194,"y":8,"r":3.5},{"x":194,"y":19,"r":3.5},{"x":194,"y":30,"r":3.5},{"x":194,"y":41,"r":3.5},{"x":194,"y":52,"r":3.5},{"x":194,"y":63,"r":3.5},{"x":194,"y":74,"r":3.5},{"x":194,"y":85,"r":3.5},{"x":194,"y":96,"r":3.5},{"x":194,"y":107,"r":3.5},{"x":194,"y":118,"r":3.5},{"x":194,"y":129,"r":3.5},{"x":194,"y":140,"r":3.5}],"salt":[{"x":10,"y":0,"w":38,"h":150},{"x":72,"y":0,"w":26,"h":150},{"x":122,"y":0,"w":26,"h":150},{"x":172,"y":0,"w":28,"h":150},{"x":148,"y":0,"w":24,"h":43},{"x":148,"y":67,"w":24,"h":83},{"x":98,"y":0,"w":24,"h":88},{"x":98,"y":112,"w":24,"h":38},{"x":48,"y":0,"w":24,"h":28},{"x":48,"y":52,"w":24,"h":98}],"rules":{"saltRing":false},"sides":[{"name":"대마법사","mages":[{"x":4,"y":75,"tier":"대마법사","skill":"대가","deck":"대마법사 성"}]},{"name":"총병","mages":[{"tier":"병사","deck":"머스킷","x":60,"y":12},{"tier":"병사","deck":"머스킷","x":134,"y":118},{"tier":"병사","deck":"머스킷","x":201,"y":45},{"tier":"병사","deck":"머스킷","x":78,"y":98},{"tier":"병사","deck":"머스킷","x":115,"y":25},{"tier":"병사","deck":"머스킷","x":152,"y":78},{"tier":"병사","deck":"머스킷","x":189,"y":131},{"tier":"병사","deck":"머스킷","x":96,"y":58},{"tier":"병사","deck":"머스킷","x":133,"y":111},{"tier":"병사","deck":"머스킷","x":77,"y":91},{"tier":"병사","deck":"머스킷","x":188,"y":124},{"tier":"병사","deck":"머스킷","x":132,"y":104},{"tier":"병사","deck":"머스킷","x":113,"y":137},{"tier":"병사","deck":"머스킷","x":187,"y":117},{"tier":"병사","deck":"머스킷","x":168,"y":24},{"tier":"병사","deck":"머스킷","x":112,"y":130},{"tier":"병사","deck":"머스킷","x":179,"y":57},{"tier":"병사","deck":"머스킷","x":186,"y":110},{"tier":"병사","deck":"머스킷","x":93,"y":37},{"tier":"병사","deck":"머스킷","x":130,"y":90},{"tier":"병사","deck":"머스킷","x":167,"y":17},{"tier":"병사","deck":"머스킷","x":74,"y":70},{"tier":"병사","deck":"머스킷","x":111,"y":123},{"tier":"병사","deck":"머스킷","x":178,"y":50},{"tier":"병사","deck":"머스킷","x":185,"y":103},{"tier":"병사","deck":"머스킷","x":166,"y":136},{"tier":"병사","deck":"머스킷","x":110,"y":116},{"tier":"병사","deck":"머스킷","x":91,"y":23},{"tier":"병사","deck":"머스킷","x":165,"y":129},{"tier":"병사","deck":"머스킷","x":72,"y":56},{"tier":"병사","deck":"머스킷","x":146,"y":36},{"tier":"병사","deck":"머스킷","x":183,"y":89},{"tier":"병사","deck":"머스킷","x":90,"y":16},{"tier":"병사","deck":"머스킷","x":127,"y":69},{"tier":"병사","deck":"머스킷","x":164,"y":122},{"tier":"병사","deck":"머스킷","x":101,"y":49},{"tier":"병사","deck":"머스킷","x":138,"y":102},{"tier":"병사","deck":"머스킷","x":145,"y":29},{"tier":"병사","deck":"머스킷","x":89,"y":135}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 1, 8/9)이 이기고 길이(77.07 s)가 가운데값(134.4 s)에 가장 가까운 판"},"v2-challenger-3":{"v":"2.6.0","name":"평범 전설 1 대 초보 3 [risk+saltRing+wave]","seed":2,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"전설","mages":[{"tier":"평범","skill":"전설"}]},{"name":"초보","mages":[{"tier":"평범","skill":"초보"},{"tier":"평범","skill":"초보"},{"tier":"평범","skill":"초보"}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 1, 15/15)이 이기고 길이(22.9 s)가 가운데값(22.9 s)에 가장 가까운 판","width":40,"height":30},"v2-fort-legend":{"v":"2.6.0","name":"대마법사 전설 대 대가: 날기 끊기와 진지 (진지 덱, 날기 끊기·진지·함정 연쇄, 200×150)","seed":3,"width":200,"height":150,"rules":{"flightCut":true,"fort":true,"trapChain":true},"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 진지"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가","deck":"대마법사 진지"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 9/9)이 이기고 길이(67.5 s)가 가운데값(67.5 s)에 가장 가까운 판"},"v2-master-legend":{"v":"2.6.0","name":"대마법사 전설 대 대가: 떠보기·들어가기·빠지기, 지형 (운영 덱, 200×150)","seed":5,"width":200,"height":150,"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 운영"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가","deck":"대마법사 운영"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 0, 6/9)이 이기고 길이(54.07 s)가 가운데값(54.07 s)에 가장 가까운 판"},"v2-musket-40":{"v":"2.6.0","name":"머스킷 반원: 대마법사 대 병사 40명 [risk+saltRing+wave]","seed":13,"width":40,"height":30,"maxT":90,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"obstacles":[],"sides":[{"name":"대마법사","brain":"기본","mages":[{"tier":"대마법사","deck":"광역","x":6,"y":15}]},{"name":"총병","brain":"기본","mages":[{"tier":"병사","deck":"머스킷","x":6.55,"y":1.71},{"tier":"병사","deck":"머스킷","x":7.65,"y":1.79},{"tier":"병사","deck":"머스킷","x":8.73,"y":1.96},{"tier":"병사","deck":"머스킷","x":9.8,"y":2.2},{"tier":"병사","deck":"머스킷","x":10.85,"y":2.52},{"tier":"병사","deck":"머스킷","x":11.86,"y":2.92},{"tier":"병사","deck":"머스킷","x":12.84,"y":3.4},{"tier":"병사","deck":"머스킷","x":13.78,"y":3.94},{"tier":"병사","deck":"머스킷","x":14.67,"y":4.56},{"tier":"병사","deck":"머스킷","x":15.5,"y":5.23},{"tier":"병사","deck":"머스킷","x":16.28,"y":5.97},{"tier":"병사","deck":"머스킷","x":16.99,"y":6.77},{"tier":"병사","deck":"머스킷","x":17.64,"y":7.61},{"tier":"병사","deck":"머스킷","x":18.21,"y":8.5},{"tier":"병사","deck":"머스킷","x":18.71,"y":9.43},{"tier":"병사","deck":"머스킷","x":19.13,"y":10.4},{"tier":"병사","deck":"머스킷","x":19.47,"y":11.39},{"tier":"병사","deck":"머스킷","x":19.73,"y":12.41},{"tier":"병사","deck":"머스킷","x":19.9,"y":13.44},{"tier":"병사","deck":"머스킷","x":19.99,"y":14.48},{"tier":"병사","deck":"머스킷","x":19.99,"y":15.52},{"tier":"병사","deck":"머스킷","x":19.9,"y":16.56},{"tier":"병사","deck":"머스킷","x":19.73,"y":17.59},{"tier":"병사","deck":"머스킷","x":19.47,"y":18.61},{"tier":"병사","deck":"머스킷","x":19.13,"y":19.6},{"tier":"병사","deck":"머스킷","x":18.71,"y":20.57},{"tier":"병사","deck":"머스킷","x":18.21,"y":21.5},{"tier":"병사","deck":"머스킷","x":17.64,"y":22.39},{"tier":"병사","deck":"머스킷","x":16.99,"y":23.23},{"tier":"병사","deck":"머스킷","x":16.28,"y":24.03},{"tier":"병사","deck":"머스킷","x":15.5,"y":24.77},{"tier":"병사","deck":"머스킷","x":14.67,"y":25.44},{"tier":"병사","deck":"머스킷","x":13.78,"y":26.06},{"tier":"병사","deck":"머스킷","x":12.84,"y":26.6},{"tier":"병사","deck":"머스킷","x":11.86,"y":27.08},{"tier":"병사","deck":"머스킷","x":10.85,"y":27.48},{"tier":"병사","deck":"머스킷","x":9.8,"y":27.8},{"tier":"병사","deck":"머스킷","x":8.73,"y":28.04},{"tier":"병사","deck":"머스킷","x":7.65,"y":28.21},{"tier":"병사","deck":"머스킷","x":6.55,"y":28.29}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 0, 11/15)이 이기고 길이(34.13 s)가 가운데값(34.13 s)에 가장 가까운 판"},"v2-neighbor-mid":{"v":"2.6.0","name":"중간 대가 대 상급 [risk+saltRing+wave]","seed":15,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"대가","mages":[{"tier":"중간","skill":"대가"}]},{"name":"상급","mages":[{"tier":"중간","skill":"상급"}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 0, 8/15)이 이기고 길이(25.97 s)가 가운데값(25.97 s)에 가장 가까운 판","width":40,"height":30},"v2-neighbor-plain":{"v":"2.6.0","name":"평범 전설 대 대가 [risk+saltRing+wave]","seed":12,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"전설","mages":[{"tier":"평범","skill":"전설"}]},{"name":"대가","mages":[{"tier":"평범","skill":"대가"}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 0, 12/15)이 이기고 길이(109.2 s)가 가운데값(109.2 s)에 가장 가까운 판","width":40,"height":30},"v2-sky-musket":{"v":"2.6.0","name":"날아다니는 대마법사(비행 판단 초보: 총 앞에서도 난다) 대 머스킷 20정, 200×150 [risk+saltRing+wave]","seed":2,"width":200,"height":150,"maxT":90,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"대마법사","mages":[{"tier":"대마법사","skill":"대가","deck":"광역","tac":{"flySkill":1},"x":100,"y":75}]},{"name":"총병","mages":[{"tier":"병사","deck":"머스킷","x":160,"y":75},{"tier":"병사","deck":"머스킷","x":157.06,"y":90.45},{"tier":"병사","deck":"머스킷","x":148.54,"y":104.39},{"tier":"병사","deck":"머스킷","x":135.27,"y":115.45},{"tier":"병사","deck":"머스킷","x":118.54,"y":122.55},{"tier":"병사","deck":"머스킷","x":100,"y":125},{"tier":"병사","deck":"머스킷","x":81.46,"y":122.55},{"tier":"병사","deck":"머스킷","x":64.73,"y":115.45},{"tier":"병사","deck":"머스킷","x":51.46,"y":104.39},{"tier":"병사","deck":"머스킷","x":42.94,"y":90.45},{"tier":"병사","deck":"머스킷","x":40,"y":75},{"tier":"병사","deck":"머스킷","x":42.94,"y":59.55},{"tier":"병사","deck":"머스킷","x":51.46,"y":45.61},{"tier":"병사","deck":"머스킷","x":64.73,"y":34.55},{"tier":"병사","deck":"머스킷","x":81.46,"y":27.45},{"tier":"병사","deck":"머스킷","x":100,"y":25},{"tier":"병사","deck":"머스킷","x":118.54,"y":27.45},{"tier":"병사","deck":"머스킷","x":135.27,"y":34.55},{"tier":"병사","deck":"머스킷","x":148.54,"y":45.61},{"tier":"병사","deck":"머스킷","x":157.06,"y":59.55}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 1, 13/15)이 이기고 길이(36.63 s)가 가운데값(36.63 s)에 가장 가까운 판"},"v2-sky-narrow":{"v":"2.6.0","name":"대마법사 대가 대 상급, 좁은 곳 40×30 [risk+saltRing+wave]","seed":2,"width":40,"height":30,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"대가","mages":[{"tier":"대마법사","skill":"대가"}]},{"name":"상급","mages":[{"tier":"대마법사","skill":"상급"}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 0, 11/15)이 이기고 길이(9.07 s)가 가운데값(9.07 s)에 가장 가까운 판"},"v2-sky-wide":{"v":"2.6.0","name":"대마법사 전설 대 대가, 넓은 곳 공중전 200×150 [risk+saltRing+wave]","seed":6,"width":200,"height":150,"rules":{"risk":true,"bodyBind":false,"response":false,"saltRing":true,"wave":true},"sides":[{"name":"전설","mages":[{"tier":"대마법사","skill":"전설"}]},{"name":"대가","mages":[{"tier":"대마법사","skill":"대가"}]}],"note":"대표 판: 씨앗 1~15 중 많이 이긴 쪽(편 0, 10/15)이 이기고 길이(15.33 s)가 가운데값(15.33 s)에 가장 가까운 판"},"v2-tactics-legend":{"v":"2.6.0","name":"대마법사 결투장 전설 대 전설: 작전 겹·각도 판단 (청사진 덱, 200×150)","seed":3,"width":200,"height":150,"rules":{"flightCut":true,"fort":true,"trapChain":true,"reflex":true,"snap":true,"blueprint":true,"tactics":true},"sides":[{"name":"전설 A","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]},{"name":"전설 B","mages":[{"tier":"대마법사","skill":"전설","deck":"대마법사 청사진"}]}],"note":"대표 판: 씨앗 1~9 중 많이 이긴 쪽(편 1, 5/9)이 이기고 길이(90.1 s)가 가운데값(89.27 s)에 가장 가까운 판"}} };
})(typeof globalThis !== 'undefined' ? globalThis : this);
