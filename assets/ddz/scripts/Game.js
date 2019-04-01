// var players = require('PlayerData').players;
// var Decks = require('Decks');
// var Types = require('Types');
// var ActorPlayingState = Types.ActorPlayingState;
// var Fsm = require('game-fsm');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        playerAnchors: {
            default: [],
            type: cc.Node
        },
        playerPrefab: cc.Prefab,
        playerPrefabO: cc.Prefab,
        dealer: cc.Node,
        inGameUI: cc.Node,
        betUI: cc.Node,
        assetMng: cc.Node,
        audioMng: cc.Node,
        turnDuration: 0,
        betDuration: 0,
        totalChipsNum: 0,
        totalDiamondNum: 0,
        numberOfDecks: {
            default: 1,
            type: 'Integer'
        },
        muteBtn: cc.Node,
        playBtn: cc.Node
    },

    statics: {
        instance: null
    },

    // use this for initialization
    onLoad: function() {
        Game.instance = this;
    },
    reConnect: function(res) {
        //初始化三个玩家 房间号 局数 
        var createData = {};
        var roomMsg = res.roomMsg;
        createData.data = res.teams;
        createData.roomNum = roomMsg.roomNum;
        createData.game_count = roomMsg.game_count;
        createData.now_game_count = roomMsg.now_game_count;
        this.joinRoomToCreatePlayer(createData);

        //刷新倍数


        //隐藏准备
        cc.find('Canvas/uiLayer/btnStart').active = false;
        //刷新积分
        var playerAnchors = this.playerAnchors;
        var jifenArr = res.jifenArr;
        for (var i in jifenArr) {
            var index = siteToIndex(jifenArr[i].site);
            var thisPlayerPrefab = playerAnchors[index].getChildByName('playerPrefab');
            if (thisPlayerPrefab) {
                thisPlayerPrefab.getComponent('ActorRenderer').labelTotalStake.string = '积分:' + jifenArr[i].jifen;
            }

        }



        var myPlayerNode = this.playerAnchors[2].getChildByName('playerPrefab');
        var actorRenderer = myPlayerNode.getComponent('ActorRenderer');
        if (res.behavior == 'jdz') {

            //刷新倍数
            var times = cc.find('Canvas/uiLayer/times');
            times.getComponent('cc.Label').string = '倍数:' + roomMsg.times;
            times.active = true;


            var dizhupai = [
                [],
                [],
                []
            ];
            actorRenderer.setDizhuCard(dizhupai, false);
            var steps = res.steps;
            var inGameUI = this.inGameUI.getComponent('InGameUI');
            if (!steps) { //第一个人还没叫地主
                var firstJdz = roomMsg.firstJdz;
                if (firstJdz == globalSite) {
                    inGameUI.showGameState('jdz');
                } else {
                    var index = siteToIndex(firstJdz);
                    // 如果这个人没掉线
                    if (Game.instance.playerAnchors[index].getChildByName('playerPrefab')) {
                        var ActorRenderer = Game.instance.playerAnchors[index].getChildByName('playerPrefab').getComponent('ActorRenderer');
                        ActorRenderer.startCountdown(30, 2);
                    }

                }
            } else { //第一个人已经做了选择
                var last_item = steps[steps.length - 1];
                var last_site = last_item.site;
                var last_res = last_item.res;
                var last_text = last_res ? '叫地主' : '不叫';
                var siteIndex = siteToIndex(last_site);


                inGameUI.changeGameHandleState(siteIndex, last_text);

                var next = last_site % 3 + 1;
                window.nextChupai = next;
                if (next == globalSite) { //现在的人是我

                    inGameUI.showGameState(roomMsg.cur_dizhu ? 'qdz' : 'jdz');
                    var ActorRenderer = Game.instance.playerAnchors[2].getChildByName('playerPrefab').getComponent('ActorRenderer');
                    ActorRenderer.startCountdown(30, 2);
                } else { //现在的人不是我
                    var nextIndex = siteToIndex(next);
                    if (Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab')) {
                        var ActorRenderer = Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
                        ActorRenderer.startCountdown(30, 2);
                    }

                }
            }


            //渲染现有的手牌
            var porks = [];
            for (var i = 0; i < res.cards.length; i++) {
                porks.push(porkStand[res.cards[i]]);
            }
            porks.sort(function(a, b) {
                return b.value - a.value;
            });


            var myPlayerNode = this.playerAnchors[2].getChildByName('playerPrefab');
            var actorRenderer = myPlayerNode.getComponent('ActorRenderer');
            actorRenderer.sendCard(porks);

            var player = myPlayerNode.getComponent('Player');
            player.init(porks);



            // 渲染对手剩余牌数
            var has_card_num = roomMsg.cards_num;
            for (var i in has_card_num) {
                if (i != globalSite) {
                    var index = siteToIndex(i);
                    playerAnchors[index].getChildByName('cardNum').active = true;
                    playerAnchors[index].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label').string = has_card_num[i];
                }
            }


        } else if (res.behavior == 'chupai') { //出牌阶段


            //刷新倍数
            var times = cc.find('Canvas/uiLayer/times');
            times.getComponent('cc.Label').string = '倍数:' + roomMsg.times;
            times.active = true;

            var dizhu = roomMsg.dizhu;
            var dizhuIndex = siteToIndex(dizhu);
            var playerAnchors = this.playerAnchors;
            //地主图标
            playerAnchors[dizhuIndex].getChildByName('dizhuIcon').active = true;

            //渲染上一步的出牌
            var steps = res.steps;
            var last_item = steps[steps.length - 1];
            var last_site = last_item.site;
            var last_res = last_item.res;
            var next = last_site % 3 + 1;

            window.nextChupai = next;

            var nextIndex = siteToIndex(next);
            var ActorRenderer = Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');



            var last_cards = last_item.cards;

            if (next == globalSite) { //现在是我出牌
                if (!last_res) { //如果上一个人没出牌

                    this.pass_changeText(last_site);

                    var ll_item = steps[steps.length - 2];
                    if (!ll_item.res) { //上上个也没出牌
                        upperChupaiCards = '';
                        this.pass_changeText(ll_item.site);
                        this.showChupaiBtn(true); //说这是新的一轮
                        if (ActorRenderer) {
                            ActorRenderer.startCountdown(30, 1);
                        }

                    } else { //上上个出牌了
                        upperChupaiCards = getType(ll_item.cards);

                        var upperIndex = siteToIndex(ll_item.site);

                        var cardNum = this.playerAnchors[upperIndex].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label');
                        cardNum.string -= ll_item.cards.length;

                        var actorRenderer = this.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
                        if (actorRenderer) {
                            actorRenderer.renderChupaiCards(ll_item.cards);
                        }

                        this.showChupaiBtn();
                        ActorRenderer.startCountdown(30);
                    }

                } else { //上一个人出牌了

                    upperChupaiCards = getType(last_cards);

                    var upperIndex = siteToIndex(last_site);

                    var cardNum = this.playerAnchors[upperIndex].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label');
                    cardNum.string -= last_cards.length;

                    var actorRenderer = this.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
                    if (actorRenderer) {
                        actorRenderer.renderChupaiCards(last_cards);
                    }
                    this.showChupaiBtn();
                    ActorRenderer.startCountdown(30);
                }



            } else {
                if (last_res) { //上一个人出牌了
                    if (ActorRenderer) {
                        ActorRenderer.startCountdown(30);
                    }

                } else { //上一个人没出牌  渲染上上个人的出牌
                    if (ActorRenderer) {
                        ActorRenderer.startCountdown(30);
                    }

                }
            }

            //渲染现有的手牌
            var porks = [];
            for (var i = 0; i < res.cards.length; i++) {
                porks.push(porkStand[res.cards[i]]);
            }
            porks.sort(function(a, b) {
                return b.value - a.value;
            });


            var myPlayerNode = this.playerAnchors[2].getChildByName('playerPrefab');
            var actorRenderer = myPlayerNode.getComponent('ActorRenderer');
            actorRenderer.sendCard(porks);


            var dizhupai = roomMsg.dizhupai;
            actorRenderer.setDizhuCard(dizhupai, true);



            var player = myPlayerNode.getComponent('Player');
            player.init(porks);



            // 渲染对手剩余牌数
            var has_card_num = roomMsg.cards_num;
            for (var i in has_card_num) {
                if (i != globalSite) {
                    var index = siteToIndex(i);
                    playerAnchors[index].getChildByName('cardNum').active = true;
                    playerAnchors[index].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label').string = has_card_num[i];
                }
            }


        } else if (res.behavior == 'waitReady') {
            cc.find('Canvas/uiLayer/btnStart').active = true;
            if (roomMsg.now_game_count != 0) { //已经开始了

                var inGameUI = this.inGameUI.getComponent('InGameUI');
                inGameUI.showLeaveRequestBtn();



            } else { //还未开始，可以退出

            }
        }



    },
    backTocreatePlayer: function(res) {
        var item = res;

        var site = siteToIndex(item.site);

        var prefab = this.playerPrefabO;

        var is_created = cc.find('playerPrefab', this.playerAnchors[site]);
        if (is_created) {
            return;
        }
        this.playerAnchors[site].getChildByName('duanxian').active=false;

        var playerNode = cc.instantiate(prefab);

        playerNode.getComponent('ActorRenderer').initItem(item);

        if (site == 3) {
            cc.find('cardInfo/infoBG/text', playerNode).scaleX = -cc.find('cardInfo/infoBG/text', playerNode).scaleX;
            cc.find('playerInfo/namePlate/playerName', playerNode).scaleX = -cc.find('playerInfo/namePlate/playerName', playerNode).scaleX;
            cc.find('playerInfo/namePlate/stakeNum', playerNode).scaleX = -cc.find('playerInfo/namePlate/stakeNum', playerNode).scaleX;
            cc.find('playerInfo/zj', playerNode).scaleX = -cc.find('playerInfo/zj', playerNode).scaleX;
            cc.find('time', playerNode).scaleX = -cc.find('time', playerNode).scaleX;
        }
        // var site;

        playerNode.parent = this.playerAnchors[site];
    },


    joinRoomToCreatePlayer: function(res,isReconnect) {

        var inGameUI = this.inGameUI.getComponent('InGameUI');

        inGameUI.showRoomNum(res.roomNum);
        inGameUI.updateGameCount(res.now_game_count, res.game_count);
        var data = res.data;

        for (var i in data) {

            var item = data[i];

            var site = siteToIndex(item.site);

            var prefab = site == 2 ? this.playerPrefab : this.playerPrefabO;

            var is_created = cc.find('playerPrefab', this.playerAnchors[site]);
            if (is_created) {
                continue;
            }

            var playerNode = cc.instantiate(prefab);

            playerNode.getComponent('ActorRenderer').initItem(item);

            if (site == 3) {
                cc.find('cardInfo/infoBG/text', playerNode).scaleX = -cc.find('cardInfo/infoBG/text', playerNode).scaleX;
                cc.find('playerInfo/namePlate/playerName', playerNode).scaleX = -cc.find('playerInfo/namePlate/playerName', playerNode).scaleX;
                cc.find('playerInfo/namePlate/stakeNum', playerNode).scaleX = -cc.find('playerInfo/namePlate/stakeNum', playerNode).scaleX;
                cc.find('playerInfo/zj', playerNode).scaleX = -cc.find('playerInfo/zj', playerNode).scaleX;
                cc.find('time', playerNode).scaleX = -cc.find('time', playerNode).scaleX;
            }
            // var site;

            playerNode.parent = this.playerAnchors[site];

        }
        if(isReconnect && data.length!=3){//如果两个人都掉线了，先回来的那个人可以看到另外一个人掉线了
            var arr=[1,2,3];
            var brr=[];
            for(var i in data){
                brr.push(data[i].site);
            }
            var index=arr.filter(key=>!brr.includes(key))[0];
            index=siteToIndex(index);
            this.playerAnchors[index].getChildByName('duanxian').active=true;
        }


    },
    clearTabel: function() {
        //删除地主卡 另外两人的牌面，剩余牌数 地主图标 自己的出牌 
        var playerAnchors = this.playerAnchors;
        playerAnchors[2].getChildByName('playerPrefab').getComponent('ActorRenderer').startNewGame();

        playerAnchors[1].getChildByName('cardNum').active = false;
        playerAnchors[1].getChildByName('cards').removeAllChildren();
        playerAnchors[1].getChildByName('dizhuIcon').active = false;

        playerAnchors[2].getChildByName('dizhuIcon').active = false;

        playerAnchors[3].getChildByName('cardNum').active = false;
        playerAnchors[3].getChildByName('cards').removeAllChildren();
        playerAnchors[3].getChildByName('dizhuIcon').active = false;



    },
    oneGameOver: function(res) {
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        inGameUI.showResultByRes(res);


        //更新台面积分
        var playerAnchors = this.playerAnchors;
        var jifenArr = res.jifenArr;
        for (var i in jifenArr) {
            var index = siteToIndex(jifenArr[i].site);
            playerAnchors[index].getChildByName('playerPrefab').getComponent('ActorRenderer').labelTotalStake.string = '积分:' + jifenArr[i].jifen;
        }


        //展开其他两个人剩余的牌，并清空台面牌 ，地主牌，
        var lost_cards = res.lost_cards;


        //展现另外两个人 剩余 牌数  从手卡到出牌处 隐藏数量
        for (var i in lost_cards) {

            if (i != globalSite && lost_cards[i].length) {
                var index = siteToIndex(i);
                var porks = lost_cards[i];
                for (var j = 0; j < porks.length; j++) {
                    porks[j] = porkStand[porks[j]];
                }
                porks.sort(function(a, b) {
                    return b.value - a.value;
                })
                var actorRenderer = this.playerAnchors[index].getChildByName('playerPrefab').getComponent('ActorRenderer');
                actorRenderer.renderChupaiCards(porks);
            }
        }


    },
    leaveRoomToDeletePlayer: function(site) {
        var index = siteToIndex(site);
        this.playerAnchors[index].getChildByName('playerPrefab').removeFromParent();
    },
    leaveRoomToSendMsg: function() {
        var msg = {
            'type': 'leaveRoom',
            'site': globalSite
        };

        DZWS.ob.send(JSON.stringify(msg));
    },
    leaveRoomToRequest: function() {
        var msg = {
            'type': 'leaveRequest',
            'site': globalSite
        };

        DZWS.ob.send(JSON.stringify(msg));
    },

    createPlayers: function() {
        for (var i = 0; i < 5; ++i) {
            var playerNode = cc.instantiate(this.playerPrefab);
            var anchor = this.playerAnchors[i];
            var switchSide = (i > 2);
            anchor.addChild(playerNode);
            playerNode.position = cc.p(0, 0);

            var playerInfoPos = cc.find('anchorPlayerInfo', anchor).getPosition();
            var stakePos = cc.find('anchorStake', anchor).getPosition();
            var actorRenderer = playerNode.getComponent('ActorRenderer');
            actorRenderer.init(players[i], playerInfoPos, stakePos, this.turnDuration, switchSide);
            if (i === 2) {
                this.player = playerNode.getComponent('Player');
                this.player.init();
            }
        }
    },

    ready: function(event) {
        // body...
        ready();
        event.target.active = false;
    },
    sendCard: function(cards) {
        // body...
        var AudioMng = this.audioMng.getComponent('AudioMng');
        AudioMng.playBgmLoop();
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        inGameUI.hideAllGameHandleState();
        inGameUI.showLeaveRequestBtn();
        var myPlayerNode = this.playerAnchors[2].getChildByName('playerPrefab');
        var actorRenderer = myPlayerNode.getComponent('ActorRenderer');
        actorRenderer.sendCard(cards);
        var player = myPlayerNode.getComponent('Player');
        player.init(cards);
    },

    show_jdz: function(res) {
        var time = res.times;
        var index = res.index;
        var site = res.site;
        var next = res.next;
        var timeLimit = res.timeLimit;
        var cur_index = siteToIndex(next);
        var bef_index = siteToIndex(site);
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        //叫地主的人显示选择面板
        if (next == globalSite) {
            inGameUI.showGameState(res.cur_dizhu ? 'qdz' : 'jdz');
        }
        //倒计时 
        // var player = this.playerAnchors[cur_index].getChildByName('playerPrefab');
        // player = player ? player : this.playerAnchors[cur_index].getChildByName('playerPrefabO')
        // player.getComponent('ActorRenderer').startCountdown()
        var times = cc.find('Canvas/uiLayer/times');
        times.getComponent('cc.Label').string = '倍数:' + time;
        times.active = true;
        //显示上一次结果
        if (index > 1) {
            var resText = res.res == 1 ? '叫地主' : '不叫';
            var audioMng = this.audioMng.getComponent('AudioMng');
            var auidoType = res.audio;
            switch (auidoType) {
                case 'jdz':
                    audioMng.playJdz();
                    break;
                case 'qdz':
                    audioMng.playQdz();
                    break;
                case 'bj':
                    audioMng.playBj();
                    break;
                case 'bq':
                    audioMng.playBq();
                    break;
            }

            inGameUI.changeGameHandleState(bef_index, resText);
        }
    },
    pass_changeText: function(upper) {
        var bef_index = siteToIndex(upper);
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        inGameUI.changeGameHandleState(bef_index, '不要');
    },

    is_jdz: function(event, is_jdz) { //TODO

        jdz(parseInt(is_jdz));
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        inGameUI.hideGameState();
    },
    show_qdz: function() {
        // body...
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        inGameUI.showGameState('qdz');

    },
    is_qdz: function(res) {
        var cur_dizhu = res.cur_dizhu;
        var time = res.times;
        var next = res.next;
        var site = res.site;
        var timeLimit = res.timeLimit;
        var index = siteToIndex(site);
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        // var audio=this.audioMng.getComponent('AudioMng');
        // if(res.res==1){
        //     audio._playSFX(audio.mqiangdizhu[0]);
        // }else{
        //     audio._playSFX(audio.buqiang[0]);
        // }
        //每个人展示倍数  展示前一步叫地主结果
        var times = cc.find('Canvas/uiLayer/times');
        times.getComponent('cc.Label').string = '倍数:' + time;
        times.active = true;


        //展示上一轮的结果
        if (res.before) {
            if (res.before == 'is_jdz') {
                var resText = res.res ? '叫地主' : '不叫';
            } else {
                var resText = res.res ? '抢地主' : '不抢';

            }
            inGameUI.changeGameHandleState(index, resText);
        }
        //如果下一个是自己，则展示选择按钮
        if (next == globalSite) {
            this.show_qdz();
        }
    },

    showDizhupaiAndTitle: function(dizhu, dizhupai) {
        var myPlayerNode = this.playerAnchors[2].getChildByName('playerPrefab');
        var actorRenderer = myPlayerNode.getComponent('ActorRenderer');
        actorRenderer.setDizhuCard(dizhupai, true);

        var index = siteToIndex(dizhu);
        this.playerAnchors[index].getChildByName('dizhuIcon').active = true;


        this.playerAnchors[1].getChildByName('cardNum').active = true;
        this.playerAnchors[1].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label').string = 17;
        this.playerAnchors[3].getChildByName('cardNum').active = true;
        this.playerAnchors[3].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label').string = 17;
        var audioMng = this.audioMng.getComponent('AudioMng');
        audioMng.playDizhupai();

        if (dizhu == globalSite) {
            this.insertDizhupai(dizhupai);
        } else {
            this.playerAnchors[index].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label').string = 20;
        }
        this.hideAllGameHandleState();

    },
    hideAllGameHandleState: function() {
        var inGameUI = this.inGameUI.getComponent('InGameUI');

        for (var i = 1; i < 4; i++) {
            inGameUI.hideGameHandleState(i);
        }
    },
    hideUpperChupai: function() {
        this.playerAnchors[1].getChildByName('cards').removeAllChildren();
        this.playerAnchors[3].getChildByName('cards').removeAllChildren();
    },
    insertDizhupai: function(dizhupai) {
        var player = this.playerAnchors[2].getChildByName('playerPrefab').getComponent('Player');
        player.insertDizhupai(dizhupai);

        //插入地主牌并显示出牌和倒计时
        this.showChupaiBtn(true);
    },
    showChupaiBtn: function(bool) { //是否第一个出牌。不能过，必须出牌
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        var chupai = inGameUI.gameStateUI.getChildByName('chupai');
        if (bool) {
            chupai.getChildByName('btnPass').active = false;
        } else {
            chupai.getChildByName('btnPass').active = true;
        }
        chupai.active = true;
        var chupaiAnchor = inGameUI.gameStateUI.getChildByName('chupaiAnchor');
        chupaiAnchor.removeAllChildren();
    },
    hideChupaiBtn: function() {
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        var chupai = inGameUI.gameStateUI.getChildByName('chupai');
        chupai.active = false;
    },
    clickChupai: function() {
        var player = this.playerAnchors[2].getChildByName('playerPrefab').getComponent('Player');
        var res = player.canPickOut();
        if (!res.canPickOut) {
            this.inGameTextTip(res.msg);
        } else {
            player.chupai(res);
        }

    },

    pass: function() {
        var msg = {
            'type': 'pass',
            'res': upperChupaiCards,
            'pass': true

        };
        DZWS.ob.send(JSON.stringify(msg));

    },
    chupaiAuto: function() {
        var player = this.playerAnchors[2].getChildByName('playerPrefab').getComponent('Player');
        player.chupaiAuto();
    },
    resetCountdown: function() {
        var index = siteToIndex(nextChupai);
        this.playerAnchors[index].getChildByName('playerPrefab').getComponent('ActorRenderer').resetCountdown();
    },
    inGameTextTip: function(str) {
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        var gameHandle = inGameUI.gameHandle[1];
        var text = cc.find('text', gameHandle);
        text.getComponent('cc.Label').string = str;
        text.active = true;
        setTimeout(function() {
            text.getComponent('cc.Label').string = '';
            text.active = false;
        }, 2000)
    },
    // 玩家要牌
    hit: function() {
        this.player.addCard(this.decks.draw());
        if (this.player.state === ActorPlayingState.Bust) {
            // if every player end
            this.fsm.onPlayerActed();
        }

        this.audioMng.playCard();


        this.audioMng.playButton();
    },

    // 玩家停牌
    stand: function() {
        this.player.stand();

        this.audioMng.playButton();

        // if every player end
        this.fsm.onPlayerActed();
    },

    //

    // 玩家报到
    report: function() {
        this.player.report();

        // if every player end
        this.fsm.onPlayerActed();
    },

    quitToMenu: function() {
        cc.audioEngine.stopAllEffects();
        cc.director.loadScene('menu', function() {
            var msg = {
                'type': 'login',
                'user_id': getUserInfo().user_id
            };
            DZWS.ob.send(JSON.stringify(msg));
        });
    },
    myDeleteCards: function(res) {
        var playerNode = this.playerAnchors[2].getChildByName('playerPrefab');

        //在player删除数据
        var player = playerNode.getComponent('Player');
        player.chupaiToDeleteCards(res);
        //在actorRenderer删除图形
        var actorRenderer = playerNode.getComponent('ActorRenderer');
        actorRenderer.deleteMyChupaiCards(res);
    },
    showUpperChupaiAndDeleteCardNum: function(res) {

        var upper = res.upper;
        var upperIndex = siteToIndex(upper);

        var cardNum = this.playerAnchors[upperIndex].getChildByName('cardNum').getChildByName('num').getComponent('cc.Label');
        cardNum.string -= res.res.porks.length;


        var porks = res.res.porks;
        var actorRenderer = this.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
        actorRenderer.renderChupaiCards(porks);

    },
    leaveRequest: function(res) {
        var inGameUI = this.inGameUI.getComponent('InGameUI');
        inGameUI.leaveRequest(res);
    },
    leaveResponse: function(event, res) {
        var msg = {
            'type': 'leaveResponse',
            'res': res
        };

        DZWS.ob.send(JSON.stringify(msg));
    },
    leaveRoomRes: function(res) {
        var inGameUI = this.inGameUI.getComponent('InGameUI');

        if (res.res == 1) {
            inGameUI.showResultByRes(res);
        } else {
            inGameUI.showleaveRequestResPanel(res);
        }
    },
    showDuanxian: function(site) {
        this.playerAnchors[site].getChildByName('duanxian').active = true;
        this.playerAnchors[site].getChildByName('playerPrefab').getChildByName('cardInfo').active = false;
    },
    hideDuanxian: function(site) {
        this.playerAnchors[site].getChildByName('duanxian').active = false;
    },

    muteMusic: function() {
        var AudioMng = this.audioMng.getComponent('AudioMng');
        AudioMng.toMute();
        cc.audioEngine.stopAllEffects();
        this.muteBtn.active = false;
        this.playBtn.active = true;
    },
    playMusic: function() {
        var AudioMng = this.audioMng.getComponent('AudioMng');
        AudioMng.resumeMute();
        AudioMng.playBgmLoop();
        this.playBtn.active = false;
        this.muteBtn.active = true;
    }
});