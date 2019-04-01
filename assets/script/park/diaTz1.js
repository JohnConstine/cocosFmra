cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        editbox: {
            default: null,
            type: cc.EditBox
        },
        bteditbox: {
            default: null,
            type: cc.EditBox
        },
        touzhuDia: 2,
        imgs: cc.SpriteAtlas,
        sure: cc.Node
    },

    // use this for initialization
    onLoad: function() {

    },
    onEnable: function() {
        var _this = this;
        ajax(
            urlPrefix + 'lottery/lottery2002.do',
            '',
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    cc.find('periodsLabel/periods', _this.node).getComponent('cc.Label').string = '第' + data.data.periods + '期';
                    cc.find('totalLabel/totalCount', _this.node).getComponent('cc.Label').string = data.data.totalCount + '注';
                    cc.find('intro', _this.node).getComponent('cc.Label').string = data.data.tip;
                    var codes = data.data.codes;
                    var imgs = _this.imgs;
                    var nodes = cc.find('animalArr', _this.node).children;
                    for (var i = 0; i < nodes.length; i++) {
                        cc.find('sprite', nodes[i]).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(codes[i]);
                    }
                }
            }
        )
    },
    random: function() {
        var animalArr = cc.find('animalArr', this.node).children;
        if (this.result) {
            animalArr[this.result - 1].color = new cc.color(255, 255, 255);
        }


        var all = [];
        for (var i = 1; i < 17; i++) {
            all.push(i);
        }
        var result = '';
        var index = Math.floor(Math.random() * 16);
        result = all[index];
        cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = result + '号';
        this.result = result;

        animalArr[result - 1].color = new cc.color(0, 245, 0);

    },
    chooseThis: function(event) {
        var index = event.currentTarget.getSiblingIndex() + 1;
        var animalArr = cc.find('animalArr', this.node).children;
        if (!this.result) {
            this.result = index;
            animalArr[index - 1].color = new cc.color(0, 245, 0);
            cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = this.result + '号';

        } else if (this.result) {

            animalArr[this.result - 1].color = new cc.color(255, 255, 255);

            this.result = index;

            animalArr[index - 1].color = new cc.color(0, 245, 0);
            cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = this.result + '号';
        }

    },
    edit: function() {
        var editValue = this.editbox.string;
        var nowDia = curDia();
        if (new RegExp('\\D').test(editValue)) {
            tips('非法输入！');
            this.editbox.string = '';
            return;
        }
        if (editValue * 2 > nowDia) {
            tips('没有这么多钻石！');
            this.editbox.string = '';
            return;
        }
        this.touzhuDia = editValue * 2;
    },
    btedit: function() {
        var editValue = this.bteditbox.string;
        var nowDia = curDia();
        if (new RegExp('\\D').test(editValue)) {
            tips('非法输入！');
            this.bteditbox.string = 2;
            return;
        }
        if (editValue < 2) {
            tips('2钻石起投!');
            this.bteditbox.string = 2;
            return;
        }
        if (editValue * 8 > nowDia) {
            tips('没有这么多钻石！');
            this.bteditbox.string = 2;
            return;
        }
        this.btDia = editValue;
        cc.find('sure/sure/intro', this.node).getComponent('cc.Label').string = '每个号码:' + editValue + '钻石,共' + editValue * 8 + '钻石';
    },

    clear: function() {
        if (this.result) {
            var animalArr = cc.find('animalArr', this.node).children;
            animalArr[this.result - 1].color = new cc.color(255, 255, 255);

            cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = '';
            this.result = '';

        }

    },
    submit: function() {
        var user_id = getUserInfo().user_id;
        var diamond = this.touzhuDia;
        var result = this.result;

        if (result) {

        } else {
            tips('请选择投注号码！');
            return;
        }
        var _this = this;
        ajax(
            urlPrefix + 'lottery/lottery2001.do',
            'user_id=' + user_id +
            '&diamond=' + diamond +
            '&result=' + result +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    _this.clear();
                    _this.node.active = false;
                    // 
                    updateGoldAndDia();
                } else {
                    tips(data.message);
                }
            }
        )
    },
    btsubmit: function() {
        var user_id = getUserInfo().user_id;
        var diamond = this.btDia;
        var result = this.btresult;

        if (result) {

        } else {
            tips('请选择投注号码！');
            return;
        }
        var _this = this;
        ajax(
            urlPrefix + 'lottery/lottery2001.do',
            'user_id=' + user_id +
            '&diamond=' + diamond +
            '&result=' + result +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    _this.clear();
                    _this.node.active = false;

                    updateGoldAndDia();
                } else {
                    tips(data.message);
                }
            }
        )
    },
    kjgm: function(event, CustomEventData) {

        this.btresult = '';
        this.btDia = 2;
        this.bteditbox.string = '2';
        cc.find('sure/sure/intro', this.node).getComponent('cc.Label').string = '每个号码:2钻石,共16钻石';
        this.sure.active = true;

        if (CustomEventData == '大') {
            cc.find('sure/info', this.sure).getComponent('cc.Label').string = '买大号:9号,10号,11号,12号,13号,14号,15号,16号';
            this.btresult = '9,10,11,12,13,14,15,16';
        } else if (CustomEventData == '小') {
            cc.find('sure/info', this.sure).getComponent('cc.Label').string = '买小号:1号,2号,3号,4号,5号,6号,7号,8号';
            this.btresult = '1,2,3,4,5,6,7,8';
        } else if (CustomEventData == '单') {
            cc.find('sure/info', this.sure).getComponent('cc.Label').string = '买单号:1号,3号,5号,7号,9号,11号,13号,15号';
            this.btresult = '1,3,5,7,9,11,13,15';
        } else if (CustomEventData == '双') {
            cc.find('sure/info', this.sure).getComponent('cc.Label').string = '买双号:2号,4号,6号,8号,10号,12号,14号,16号';
            this.btresult = '2,4,6,8,10,12,14,16';
        }
        this.sure.active = true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});