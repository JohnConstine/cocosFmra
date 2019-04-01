var Game = require('Game');
var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

var actorRenderer = cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo: cc.Node,
        stakeOnTable: cc.Node,
        cardInfo: cc.Node,
        cardPrefab: cc.Prefab,
        smallCardPrefab: cc.Prefab,
        anchorCards: cc.Node,

        spPlayerName: cc.Sprite,
        labelPlayerName: cc.Label,
        labelTotalStake: cc.Label,
        spPlayerPhoto: cc.Sprite,
        timer: cc.Label,
        timeLabel: cc.Node,
        timeNum: 30,
        labelStakeOnTable: cc.Label,

        labelCardInfo: cc.Label,
        spCardInfo: cc.Sprite,
        animFX: cc.Node,
        cardSpace: 10,
        turnDuration: 30,

        headimg: cc.Sprite,
        headAtlas: cc.SpriteAtlas,
        zj: cc.Node,
        readyState: cc.Node,
        teamMateCardPrefab: cc.Prefab
    },
    statics: {
        instance: null
    },
    onLoad: function() {
        var photo = this.playerInfo.getChildByName('photoFrame');
        var zj = this.playerInfo.getChildByName('zj');
        actorRenderer.instance = this;
        // photo.on('mouseenter', function() {
        //     zj.active = true;
        // });
        // photo.on('mouseleave', function() {
        //     zj.active = false;
        // });

        var _this = this;
        this.schedule(function() {
            if (_this.timeLabel.active) {
                _this.timer.string = _this.timeNum;
                _this.timeNum--;
                if (_this.timeNum == 2) {
                    var audio = cc.find('Game/AudioMng').getComponent('AudioMng');
                    audio.playTimeOut();
                }
                if (_this.timeNum <= -1) {
                    _this.timeLabel.active = false;

                    if (globalSite == nextChupai) {
                        switch (this.scheduleType) {
                            case 0: //可以不出
                                Game.instance.pass();
                                break;
                            case 1: //必须出
                                Game.instance.chupaiAuto();
                                break;
                            case 2: //不叫地主

                                Game.instance.is_jdz('', 0);
                                break;
                        }
                    }

                }
            }
        }, 1)
    },
    startCountdown: function(sec, type) {

        if (!type) {
            this.scheduleType = 0;
        } else {
            this.scheduleType = type;
        }
        if (this.timeLabel) {
            this.timeLabel.active = true;
            this.timeNum = sec;
            this.timer.string = sec;
        }
    },

    resetCountdown: function() {
        if (this.timeLabel) {
            this.timeLabel.active = false;
        }
    },
    update: function(dt) {

    },
    initItem: function(data) {

        if (data.is_ready) {
            this.readyState.active = true;
        }
        var data = data.user_data;
        this.labelPlayerName.string = data.nickname;
        this.labelTotalStake.string = '积分:' + 0;
        this.headimg.spriteFrame = this.headAtlas.getSpriteFrame(data.head_img);
        this.zj.getComponent('cc.Label').string = '赢:' + data.win_count + ',输:' + data.lose_count + ',共' + data.total_game + ',胜率' + (data.win_count / data.total_game).toFixed(4) * 100;
    },
    init: function(playerInfo, playerInfoPos, stakePos, turnDuration, switchSide) {
        // actor
        this.actor = this.getComponent('Actor');

        // nodes
        this.isCounting = false;
        this.counterTimer = 0;
        this.turnDuration = turnDuration;

        this.playerInfo.position = playerInfoPos;
        this.stakeOnTable.position = stakePos;
        this.labelPlayerName.string = playerInfo.name;
        this.updateTotalStake(playerInfo.gold);
        var photoIdx = playerInfo.photoIdx % 5;
        this.spPlayerPhoto.spriteFrame = Game.instance.assetMng.playerPhotos[photoIdx];
        // fx
        this.animFX = this.animFX.getComponent('FXPlayer');
        this.animFX.init();
        this.animFX.show(false);

        this.cardInfo.active = false;

        // switch side
        if (switchSide) {
            this.spCardInfo.getComponent('SideSwitcher').switchSide();
            this.spPlayerName.getComponent('SideSwitcher').switchSide();
        }
    },



    sendCard: function(cards) {
        this.anchorCards.removeAllChildren();
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(card);
            newCard.reveal(true);
            newCard.addListener();
        }
        var cards = this.anchorCards.children;
        cards[cards.length - 1].getChildByName('tap').width = 150;
        this.setDizhuCard('', false);
    },
    formatDzCards: function(cards) {
        this.anchorCards.removeAllChildren();
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.anchorCards.addChild(newCard.node);
            newCard.init(card);
            newCard.reveal(true);
            newCard.addListener();
        }
        var cards = this.anchorCards.children;
        cards[cards.length - 1].getChildByName('tap').width = 150;
    },
    startNewGame: function function_name(argument) {
        var anchorDizhuCards = cc.find('Canvas/uiLayer/dizhuCard');
        anchorDizhuCards.removeAllChildren();


        this.anchorCards.removeAllChildren();

        var chupaiAnchor = cc.find('Canvas/uiLayer/GameStateUI/chupaiAnchor');
        chupaiAnchor.removeAllChildren();

    },
    setDizhuCard: function(cards, isFaceUp) {
        // body...
        console.log(cards);
        console.log(isFaceUp);
        var anchorDizhuCards = cc.find('Canvas/uiLayer/dizhuCard');
        anchorDizhuCards.removeAllChildren();
        if (!isFaceUp) {
            cards = [
                [],
                [],
                []
            ];
        }

        for (var i = 0; i < 3; i++) {
            var card = porkStand[cards[i]];

            var newCard = cc.instantiate(this.smallCardPrefab).getComponent('Card');



            if (isFaceUp) {
                newCard.init(card);
            }
            newCard.reveal(isFaceUp);
            anchorDizhuCards.addChild(newCard.node);
        }

    },
    addCard: function(card, idx) {

        var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        this.anchorCards.addChild(newCard.node);
        newCard.init(card);
        newCard.reveal(true);
        newCard.addListener();
        if (idx) {
            newCard.node.setSiblingIndex(idx);
        }

    },
    chupaiAutoDeleteCard: function() {
        var cards = this.anchorCards.children;
        cards[cards.length - 1].removeFromParent();
    },
    deleteMyChupaiCards: function(res) {
        var cards = this.anchorCards.children;
        var anchorCards = this.anchorCards;
        var chupaiAnchor = cc.find('Canvas/uiLayer/GameStateUI/chupaiAnchor');
        var porks = res.porks;
        porks.sort(function(a, b) {
                return b.value == a.value ? a.id - b.id : b.value - a.value;
            })
            // for (var i = 0; i < cards.length; i++) {
            //     if (cards[i].getPositionY()) {

        //         cards[i].removeFromParent();
        //         i--;
        //     }
        // };



        for (var i = 0; i < cards.length; i++) {
            for (var j = 0; j < porks.length; j++) {

                if (cards[i].getComponent('Card').card.id == porks[j].id) {
                    cards[i].removeFromParent();
                    i--;
                    break;
                }
            }
        }

        for (var i = 0; i < porks.length; i++) {
            var card = porks[i];

            var newCard = cc.instantiate(this.teamMateCardPrefab).getComponent('Card');

            chupaiAnchor.addChild(newCard.node);

            newCard.init(card);

            newCard.reveal(true);

        }
        if (cards.length) {
            cards[cards.length - 1].getChildByName('tap').width = 150;
        }

    },


    onDeal: function(card, show) {
        var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        this.anchorCards.addChild(newCard.node);
        newCard.init(card);
        newCard.reveal(show);

        var startPos = cc.p(0, 0);
        var index = this.actor.cards.length - 1;
        var endPos = cc.p(this.cardSpace * index, 0);
        newCard.node.setPosition(startPos);
        this._updatePointPos(endPos.x);

        var moveAction = cc.moveTo(0.5, endPos);
        var callback = cc.callFunc(this._onDealEnd, this);
        newCard.node.runAction(cc.sequence(moveAction, callback));
    },

    _onDealEnd: function(target) {
        this.resetCountdown();
        // if (this.actor.state === ActorPlayingState.Normal) {
        //     this.startCountdown();
        // }
        // this.updatePoint();
        // this._updatePointPos(pointX);
    },
    delChupaiLocation: function() {
        var anchor = this.node.parent.getChildByName('cards');
        anchor.removeAllChildren();
    },
    renderChupaiCards: function(porks) {

        var anchor = this.node.parent.getChildByName('cards');
        anchor.removeAllChildren();
        for (var i = 0; i < porks.length; i++) {
            var card = porks[i];

            var newCard = cc.instantiate(this.teamMateCardPrefab).getComponent('Card');

            anchor.addChild(newCard.node);
            newCard.init(card);
            newCard.reveal(true);

        }
    }


});