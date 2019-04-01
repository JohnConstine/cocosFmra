cc.Class({
    extends: cc.Component,

    properties: {
        editbox: {
            default: null,
            type: cc.EditBox
        },
        touzhuDia: 2,
        imgs: cc.SpriteAtlas
    },

    // use this for initialization
    onLoad: function() {

    },
    onEnable: function() {
        var _this = this;
        ajax(
            urlPrefix + 'lottery/lottery1003.do',
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
        if (this.result1) {
            animalArr[this.result1 - 1].color = new cc.color(255, 255, 255);
        }

        var all = [];
        for (var i = 1; i < 17; i++) {
            all.push(i);
        }
        var result = '';
        var result1 = '';
        var index = Math.floor(Math.random() * 16);
        result = all[index];
        all.splice(index, 1);
        var index1 = Math.floor(Math.random() * 15);
        result1 = all[index1];
        if (result > result1) {
            var z = result;
            result = result1;
            result1 = z;
        }
        cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = result + '号,' + result1 + '号';
        this.result = result;
        this.result1 = result1;


        animalArr[result - 1].color = new cc.color(0, 245, 0);
        animalArr[result1 - 1].color = new cc.color(0, 245, 0);
    },
    chooseThis: function(event) {
        var index = event.currentTarget.getSiblingIndex() + 1;
        var animalArr = cc.find('animalArr', this.node).children;
        if (!this.result && !this.result1) {
            this.result = index;
            animalArr[index - 1].color = new cc.color(0, 245, 0);
            cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = this.result + '号';

        } else if (this.result && !this.result1) { //如果有一个

            if (index > this.result) {
                this.result1 = index;
                animalArr[index - 1].color = new cc.color(0, 245, 0);
                cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = this.result + '号,' + this.result1 + '号';
            } else if (index < this.result) {
                this.result1 = this.result;
                this.result = index;
                animalArr[index - 1].color = new cc.color(0, 245, 0);
                cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = this.result + '号,' + this.result1 + '号';
            } else {
                return;
            }
        } else if (this.result && this.result1) {

            animalArr[this.result - 1].color = new cc.color(255, 255, 255);
            animalArr[this.result1 - 1].color = new cc.color(255, 255, 255);
            this.result = index;
            this.result1 = '';
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
    clear: function() {
        if (this.result || this.result1) {
            var animalArr = cc.find('animalArr', this.node).children;
            animalArr[this.result - 1].color = new cc.color(255, 255, 255);
            animalArr[this.result1 - 1].color = new cc.color(255, 255, 255);
            cc.find('chooseLabel/choose', this.node).getComponent('cc.Label').string = '';
            this.result = '';
            this.result1 = '';
        }

    },
    submit: function() {
        var user_id = getUserInfo().user_id;
        var diamond = this.touzhuDia;
        var result = this.result;
        var result1 = this.result1;
        if (result && result1) {

        } else {
            tips('请选择投注号码！');
            return;
        }
        var _this = this;
        ajax(
            urlPrefix + 'lottery/lottery1002.do',
            'user_id=' + user_id +
            '&diamond=' + diamond +
            '&result=' + result +
            '&result1=' + result1 +
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
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});