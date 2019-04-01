cc.Class({
    extends: cc.Component,

    properties: {
        goodName: cc.Label,
        num: cc.EditBox,
        price: cc.Label,
        totalPrice: cc.Label,
        max: cc.Label
    },

    // use this for initialization
    onLoad: function() {

    },
    initAndShow: function(data) {
        
        this.data = data;
        this.goodName.string = data.goods_name;
        this.price.string = data.single_price;

        this.max.string = '(最多:' + data.number + ')';

        this.node.active = true;
    },
    onNumChange: function(event, node) {
        if (event > this.data.number) {
            tips('最大数量不能超过' + this.data.number + '!');
            node.string = this.data.number;
            event = this.data.number;
        }
        var rep = /[^0-9]/;

        if (rep.test(event)) {

            node.string = '';
            event = 0;
            tips('数量必须为整数!');
        }
        this.buyNum = event;

        this.totalPrice.string = (this.data.single_price * this.buyNum).toFixed(2);

    },
  
    submit: function() {

        var _this = this;
        if (_this.buyNum < 1) {
            tips('数量不合法,必须为大于1的整数!');
            return;
        }
        if (!_this.buyNum ) {
            tips('数量不可为空');
            return;
        }
        var data = this.data;
        ajax(
            urlPrefix + 'fish/fish1021.do',
            'user_id=' + getUserInfo().user_id +
            '&id='+_this.data.id+
            '&friend_id='+_this.data.user_id+
            '&number=' + _this.buyNum +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    _this.node.parent.parent.getComponent('auction').buyPanel();
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