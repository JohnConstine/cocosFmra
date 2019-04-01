cc.Class({
    extends: cc.Component,

    properties: {
        joinRoom: cc.Node,
        createRoom: cc.Node,
        diaLabel: cc.Label,
        cardNumLabel: cc.Label,
        nickName: cc.Label,
        headImg: cc.Sprite,
        headAtlas: cc.SpriteAtlas,
        buyCardPanel: cc.Node,
        createRoomToggleIndex: 0
    },

    // use this for initialization
    onLoad: function() {
        this.cardToCount = [{
            count: 6,
            card: 2
        }, {
            count: 12,
            card: 3
        }, {
            count: 20,
            card: 5
        }];
    },
    toJoinRoom: function() {
        this.joinRoom.active = true;
        this.createRoom.active = false;
    },
    toCreateRoom: function() {
        this.joinRoom.active = false;
        this.createRoom.active = true;
    },
    roomNumChange: function(event) {
        this.roomNum = event;
    },
    joinRoomBtnClick: function() {
        var roomNum = this.roomNum;
        if(!roomNum){
            ddztips('请输入正确的房间号');
            return;
        }
        var reg = /[^0-9]/;
        if (reg.test(roomNum)) {
            ddztips('请输入正确的房间号');
            return;
        }
        if (roomNum.toString().length != 6) {
            ddztips('房间号必须是6位');
            return;
        }
        joinRoom(roomNum);

    },
    joinRoomCb: function(res) {

        if (res.status) {
            cc.director.loadScene('table', function() {
                var send_msg = {
                    'type': 'getRoomData'
                };

                DZWS.ob.send(JSON.stringify(send_msg));
            });
        } else {
            ddztips(res.msg);
        }
    },
    createRoomBtn: function() {
        
        var msg = {
            'type': 'createRoom',
            'game_count': this.cardToCount[this.createRoomToggleIndex]
        };

        DZWS.ob.send(JSON.stringify(msg));
    },
    createRoomToggleChange: function(event, index) {
        this.createRoomToggleIndex = index;
    },
    toggleBuyCardPanel: function() {
        this.buyCardPanel.active = !this.buyCardPanel.active;
    },
    renderInfos: function(data) {
        this.room_card_num = data.room_card;

        this.nickName.string = data.nickname;
        this.diaLabel.string = data.diamond;
        this.cardNumLabel.string = data.room_card;
        this.headImg.spriteFrame = this.headAtlas.getSpriteFrame(data.head_img);
    },
    updateDiaAndCard: function(data) {

        var allInfo = gJson('allInfo');
        allInfo.farmInfo[0].diamond = data.diamond;
        sJson('allInfo', allInfo);
        this.room_card_num = data.num;

        this.diaLabel.string = data.diamond;
        this.cardNumLabel.string = data.num;


    }

});