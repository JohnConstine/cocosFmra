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
        payWayItem: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    init: function(event, rmb) {
       
        if (!is_show) {
            var agent = anysdk.agentManager;
            var iap_plugin= this.iap_plugin = agent.getIAPPlugin();
         
            var info = {
                Product_Id: rmb.toString(),
                Product_Name: rmb + "钻石",
                Product_Price: rmb.toString(),
                Product_Count: "1",
                Product_Desc: "",
                Coin_Name: "钻石",
                Coin_Rate: "1",
                Role_Id: getUserInfo().user_id.toString(),
                Role_Name: getUserInfo().nickname.toString(),
                Role_Grade: "1",
                Role_Balance: "1",
                Vip_Level: "1",
                Party_Name: "1",
                Server_Id: "1",
                Server_Name: "server",
                EXT: ""
            };
            iap_plugin.payForProduct(info);
            iap_plugin.setListener(this.onPayResult, this);

        } else {
            var prefab = this.payWayItem;
            var _this = this;
            this.node.active = true;
            ajax(
                urlPrefix + 'user/user1019.do',
                '',
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        for (var i = 0; i < data.data.length; i++) {

                            var item = cc.instantiate(prefab);
                            item.getChildByName('name').getComponent(cc.Label).string = data.data[i].payment;
                            item.on('touchstart', function(item) {


                                var user_id = gJson('allInfo').userInfo[0].user_id;
                                var date = new Date();
                                var order_num = user_id.toString() + date.getTime().toString();



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
                                            if (item.id == 1) {
                                                pay.getComponent(cc.WebView).url = item.pay_url + '?user_id=' + user_id +
                                                    '&order_id=' + order_num +
                                                    '&order_total=' + rmb +
                                                    userToken();
                                            } else if (item.id == 2) {



                                                pay.getComponent(cc.WebView).url = item.pay_url + '?user_id=' + user_id +
                                                    '&order_id=' + order_num +
                                                    '&order_total=' + rmb +
                                                    // '&order_introduce=dasdasd' +
                                                    // '&good_name=' + rmb + 
                                                    '&dt_order=' + getDttime() +
                                                    userToken();
                                            } else if (item.id == 3) {
                                                ajax(
                                                    urlPrefix + 'youzanpay/youzanpay1001.do',
                                                    'user_id=' + getUserInfo().user_id +
                                                    '&order_id=' + order_num +
                                                    '&order_total=' + rmb * 100 +
                                                    userToken(),
                                                    function(res) {
                                                        var data = JSON.parse(res);
                                                        if (data.state) {
                                                            pay.getComponent(cc.WebView).url = data.data;
                                                        } else {
                                                            tips(data.message);
                                                        }
                                                    })



                                            }

                                        } else {
                                            tips(data.message);
                                        }
                                    }
                                )


                            }.bind({}, data.data[i]));
                            item.parent = cc.find('scrollView/view/content', _this.node);
                        }

                    } else {
                        tips(data.message);
                    }
                }
            )
        }
    },
    onDisable: function() {
        cc.find('scrollView/view/content', this.node).removeAllChildren();
    },
    onPayResult: function(code, msg, info) {
       
        switch (code) {
            case anysdk.PayResultCode.kPaySuccess: // 支付系统支付成功
                tips('支付成功！');
                setTimeout(function() {
                 
                    updateGoldAndDia();
                }, 1500);
                break;
            case anysdk.PayResultCode.kPayCancel: // 支付系统支付取消
                console.log(' kPayCancel ');
                break;
            case anysdk.PayResultCode.kPayFail: // 支付系统支付失败
                tips('支付失败!');
                break;
            case anysdk.PayResultCode.kPayNetworkError: // 支付系统网络错误
                tips('支付系统网络错误!');
                break;
            case anysdk.PayResultCode.kPayProductionInforIncomplete: // 支付系统支付信息不完整
                console.log(' kPayFail3 ');
                break;
            case anysdk.PayResultCode.kPayInitSuccess: // 支付系统初始化成功
                console.log(' kPayInitSuccess ');
                break;
            case anysdk.PayResultCode.kPayInitFail: // 支付系统初始化失败
                console.log(' kPayInitFail ');
                break;
            case anysdk.PayResultCode.kPayNowPaying: // 支付系统正在支付中
                console.log(' kPayNowPaying ');
                break;
            default:
                break;
        }
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});