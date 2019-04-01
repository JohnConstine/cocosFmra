
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

    },

    // use this for initialization
    onLoad: function() {
       
        var _this=this;
        ajax(
            urlPrefix + 'farm/farm1016.do',
            '',
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var childs=cc.find('7/scroll/view/content',_this.node).children;
                    for (var i=0;i<childs.length;i++) {
                        cc.find('num',childs[i]).getComponent(cc.Label).string='购买'+data.data[i]+'个钻石';
                        cc.find('btn/Label',childs[i]).getComponent(cc.Label).string=data.data[i]+'元';
                        cc.find('btn',childs[i]).getComponent(cc.Button).clickEvents[0].customEventData=data.data[i];
                    }
                } else {
                    tips(data.message);
                }
            }
        )

    },
    redirect: function(event, rmb) {
        var button = event.target;
        button.getComponent(cc.Button).interactable = false;
        var user_id = gJson('allInfo').userInfo[0].user_id;
        var order_num = user_id.toString() + new Date().getTime().toString();

        ajax(
            urlPrefix + 'farm/farm1014.do',
            'user_id=' + user_id +
            '&order_num=' + order_num +
            '&recharge_money=' + rmb +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var pay = cc.find('pay');
                    pay.active = true;
                    pay.getComponent(cc.WebView).url = urlPrefix + 'alipay/alipay1001.do?user_id=' + user_id + '&order_id=' + order_num + '&order_total=' + rmb + '&order_introduce=dasdasd' + userToken();


                } else {
                    tips(data.message);
                }
                button.getComponent(cc.Button).interactable = true;
            }
        )



    },
    onPayResult: function(code, msg, info) {
        cc.log("pay result, resultcode:" + code + ", msg: " + msg); //根据返回的 code 和 msg 来做相对应的处理和操作。
        if (code == anysdk.PayResultCode.kPaySuccess) {
            //do something
            var iap_plugin = agent.getIAPPlugin();
            var iap_plugin = iap_plugins[92]; //可通过 for 循环输出各个插件的 key 来判断自己所需要支付插件的 key 值。
            var order_id = iap_plusgin.getOrderId();
            tips(order_id);
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});