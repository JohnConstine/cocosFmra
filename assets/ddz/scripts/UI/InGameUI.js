var Game = require('Game');

cc.Class({
    extends: cc.Component,

    properties: {
        panelChat: cc.Node,
        panelSocial: cc.Node,
        betStateUI: cc.Node,
        gameStateUI: cc.Node,
        resultTxt: cc.Label,
        betCounter: cc.ProgressBar,
        btnStart: cc.Node,
        labelTotalChips: cc.Label,
        gameHandle: {
            default: [],
            type: cc.Node
        },
        roomNumLabel: cc.Label,
        gameCountLabel: cc.Label,
        resultPanel: cc.Node,
        leaveRequestPanel: cc.Node,
        leaveRequestWating: cc.Node,
        leaveBtn: cc.Node,
        leaveRequestBtn: cc.Node,
        leaveRequestResPanel: cc.Node
    },

    // use this for initialization
    init: function(betDuration) {
        this.panelChat.active = false;
        this.panelSocial.active = false;
        this.resultTxt.enabled = false;
        this.betStateUI.active = true;
        this.gameStateUI.active = false;
        // this.resultStateUI.active = false;
        this.btnStart.active = false;
        this.betDuration = betDuration;
        this.betTimer = 0;
        this.isBetCounting = false;
    },

    startCountdown: function() {
        if (this.betCounter) {
            this.betTimer = 0;
            this.isBetCounting = true;
        }
    },

    resetCountdown: function() {
        if (this.betCounter) {
            this.betTimer = 0;
            this.isBetCounting = false;
            this.betCounter.progress = 0;
        }
    },

    showRoomNum: function(roomNum) {
        this.roomNumLabel.string = '房间号:' + roomNum;
    },
    updateGameCount: function(num, all) {
        this.gameCountLabel.string = '局数:' + num + '/' + all;
    },

    showBetState: function() {
        this.betStateUI.active = true;
        this.gameStateUI.active = false;
        this.btnStart.active = false;
    },
    leaveRequest: function(res) {
        if (globalSite == res.site) {
            this.leaveRequestWating.active = true;
        } else {
            this.leaveRequestPanel.getChildByName('content').getComponent('cc.Label').string = res.nickName + '申请解散游戏,是否同意？';
            this.leaveRequestPanel.active = true;
        }

    },
    showleaveRequestResPanel: function(res) {
        this.leaveRequestPanel.active = false;
        this.leaveRequestWating.active = false;
        this.leaveRequestResPanel.getChildByName('content').getComponent('cc.Label').string = res.nickName + '拒绝了解散请求,游戏继续';
        this.leaveRequestResPanel.active = true;
        var _this=this;
        setTimeout(function() {
            _this.leaveRequestResPanel.active = false;
        }, 3000)
    },
    showLeaveRequestBtn: function() {
        this.leaveBtn.active = false;
        this.leaveRequestBtn.active = true;
    },
    showGameState: function(res) {
        //this.betStateUI.active = false;
        this.gameStateUI.active = true;
        if (res == 'jdz') {
            this.gameStateUI.getChildByName('jdz').active = true;
            this.gameStateUI.getChildByName('qdz').active = false;
        } else if (res == 'qdz') {
            this.gameStateUI.getChildByName('jdz').active = false;
            this.gameStateUI.getChildByName('qdz').active = true;
        }
        this.btnStart.active = false;
    },
    hideGameState: function() {
        this.gameStateUI.getChildByName('jdz').active = false;
        this.gameStateUI.getChildByName('qdz').active = false;
    },

    showResultState: function() {
        this.betStateUI.active = false;
        this.gameStateUI.active = false;
        this.btnStart.active = true;
    },

    toggleChat: function() {
        this.panelChat.active = !this.panelChat.active;
    },

    toggleSocial: function() {
        this.panelSocial.active = !this.panelSocial.active;
    },

    // called every frame
    update: function(dt) {
        if (this.isBetCounting) {
            this.betCounter.progress = this.betTimer / this.betDuration;
            this.betTimer += dt;
            if (this.betTimer >= this.betDuration) {
                this.isBetCounting = false;
                this.betCounter.progress = 1;
            }
        }
    },
    changeGameHandleState: function(index, string) {

        var gameState = this.gameHandle[index - 1].getChildByName('gameState');
        gameState.getComponent('cc.Label').string = string;
        gameState.active = true;
    },
    hideGameHandleState: function(index) {

        var gameState = this.gameHandle[index - 1].getChildByName('gameState');
        gameState.active = false;
    },
    hideAllGameHandleState: function() {
        var gameHandles = this.gameHandle;
        for (var i = 0; i < gameHandles.length; i++) {
            gameHandles[i].getChildByName('gameState').active = false;
        }
    },
    showResultByRes: function(res) {

        this.leaveRequestPanel.active = false;
        this.leaveRequestWating.active = false;

        var jifenArr = res.jifenArr;

        var items = this.resultPanel.getChildByName('content').children;
        var title = this.resultPanel.getChildByName('title');
        if (res.winner) {
            title.getComponent('cc.Label').string = '地主胜利';
        } else {
            title.getComponent('cc.Label').string = '农民胜利';
        }

        if (res.ext == 'spring') {
            title.getComponent('cc.Label').string = '地主胜利-春天';
        } else if (res.ext == 'desc_spring') {
            title.getComponent('cc.Label').string = '农民胜利-反春天';
        }
        if (res.all_over) {
            this.resultPanel.getChildByName('btnReStart').active = true;
            this.resultPanel.getChildByName('btnStart').active = false;
        } else {
            this.resultPanel.getChildByName('btnStart').active = true;
            this.resultPanel.getChildByName('btnReStart').active = false;
        }



        var index = 0;
        for (var i in jifenArr) {
            items[index].getChildByName('nick_name').getComponent('cc.Label').string = jifenArr[i].nickname;
            items[index].getChildByName('jifen').getComponent('cc.Label').string = jifenArr[i].last_jifen;
            items[index].getChildByName('zongjifen').getComponent('cc.Label').string = jifenArr[i].jifen;
            index++;
        }

        this.resultPanel.active = true;
    }
});