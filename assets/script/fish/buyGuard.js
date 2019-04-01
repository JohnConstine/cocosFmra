cc.Class({
    extends: cc.Component,

    properties: {
        has: cc.RichText,
        now: cc.RichText,
        handle:cc.Node,
        close:cc.Node
    },

    // use this for initialization
    onLoad: function() {
        this.guardNum = cc.find('Fish').getComponent('fish').guardNum;
    },
    onEnable: function() {

        var guardNum = this.guardNum;
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1017.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    if (guardNum >= 4) {
                        var split = (data.data[0].split * 100);
                        _this.has.string = '　　每条鲨鱼守卫可以提高<color=green>' + split + '%</color>的生产增加率,目前已拥有<color=red>' + guardNum + '</color>条鲨鱼守卫,提高生产增长率<color=green>' + (split * guardNum).toFixed(2) + '％</color>';
                        _this.now.string = '目前最多能购买'+guardNum+'条鲨鱼守卫,请关注后续升级';
                        _this.handle.active=false;
                        _this.close.active=true;
                    } else {
                        var now_price = data.data[guardNum].price;
                        var split = (data.data[guardNum].split * 100);
                        _this.now.string = '是否花费<color=CYAN >' + now_price + '</color>钻石购买一条鲨鱼守卫？';
                        _this.has.string = '　　每条鲨鱼守卫可以提高<color=green>' + split + '%</color>的生产增加率,目前已拥有<color=red>' + guardNum + '</color>条鲨鱼守卫,提高生产增长率<color=green>' + (split * guardNum).toFixed(2) + '％</color>';
                    }


                } else {
                    tips(data.message);
                }
            }
        )
    },
    clickBuyGuard: function() {
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1013.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    _this.guardNum = data.data;
                    tips('购买成功！');
                    updateGoldAndDia();
                    _this.node.getComponent('closeSelf').closeSelfAndUnlock();
                    //TODO添加一条鲨鱼动画
                    cc.find('guard').active=true;
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