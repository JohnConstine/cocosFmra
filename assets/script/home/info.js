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
        num: 1,
    },

    // use this for initialization
    onLoad: function() {


        var haveNum = cc.find('have/num', this.node).getComponent(cc.Label).string;
        haveNum = haveNum.substring(0, haveNum.length - 1);

        var add = cc.find('number/add', this.node);
        var del = cc.find('number/del', this.node);
        var num = cc.find('number/num', this.node);
        var all = cc.find('all', this.node);
        var total = cc.find('total/total', this.node);
        var price = cc.find('price/price', this.node).getComponent(cc.Label).string;


        add.on('touchstart', function(haveNum) {

            this.num++;
            if (this.num > haveNum) this.num = haveNum;
            num.getComponent(cc.Label).string = this.num;
            total.getComponent(cc.Label).string = (this.num * price).toFixed(2);

        }.bind(this, haveNum));

        del.on('touchstart', function() {
            this.num--;
            if (this.num < 1) this.num = 1;
            num.getComponent(cc.Label).string = this.num;
            total.getComponent(cc.Label).string = (this.num * price).toFixed(2);
        }.bind(this));

        all.on('touchstart', function() {
            this.num = haveNum;
            num.getComponent(cc.Label).string = this.num;
            total.getComponent(cc.Label).string = (this.num * price).toFixed(2);

        }.bind(this));
    },

    clearNum: function() {
        this.node.destroy();
        var ScrollView = cc.find('Canvas').getComponent(cc.ScrollView);
        if (ScrollView) {
            ScrollView.enabled = true;
        }
    },
    sell: function() {
            var userInfo = getUserInfo();
            var user_id = userInfo.user_id;
            var user_token = userInfo.user_token;
            var product_num = this.num;
            var product_id = cc.find('id', this.node).getComponent(cc.Label).string;
            var index = cc.find('index', this.node).getComponent(cc.Label).string;
            var gold = cc.find('total/total', this.node).getComponent(cc.Label).string;
            var _this = this;
            ajax(
                urlPrefix + 'warehouse/warehouse1002.do',
                'user_id=' + user_id + '&product_num=' + product_num + '&product_id=' + product_id + '&gold=' + gold + '&user_token=' + user_token,
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        updateGoldAndDia();
                        var item = cc.find('Canvas/fixItem/warehouse/scroll/view/content/' + product_id);
                        // var warehouse=gJson('warehouse');

                        // warehouse[index].product_num-=product_num;
                        //  console.log(warehouse[index]);
                        //  console.log(warehouse);

                        // sJson('warehouse',warehouse);

                        // console.log(gJson('warehouse'));

                        var num = cc.find('num', item).getComponent(cc.Label).string.substring(1);

                        var curNum = num - product_num;

                        cc.find('num', item).getComponent(cc.Label).string = 'X' + curNum;

                        _this.node.destroy();

                        if (curNum <= 0) {
                            item.destroy();
                        }



                    }

                    tips(data.message);
                }

            )
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});