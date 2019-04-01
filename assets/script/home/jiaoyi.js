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
        diamondNum: {
            default: null,
            type: cc.EditBox
        },
    },

    // use this for initialization
    onLoad: function() {

    },
    editChange: function() {

        var diamond = gJson('allInfo').farmInfo[0].diamond;

        var dia = this.diamondNum.string;


        if (new RegExp('\\D').test(dia)) {
            //this.diamondNum.string=dia.substring(0,dia.length-1);
            tips('非法输入！');
            this.diamondNum.string = '';
            return;
        }
        if (dia > diamond) {

            tips('没有那么多钻石！');
            this.diamondNum.string = '';
            return;
        }

    },
    submit: function() {
        var dia = this.diamondNum.string;
        var friend_id = this.node.friendId;
        ajax(
            urlPrefix + 'farm/farm1015.do',
            'user_id=' + getUserInfo().user_id +
            '&friend_id=' + friend_id +
            '&diamond=' + dia +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips('交易成功！');
                    var wsMessage = {
                        sendId: getUserInfo().user_id,
                        acceptId: friend_id,
                        target: 3,
                        type: 1,
                        data: {
                            shed_id: 1
                        }
                    }
                    WS.ob.send(JSON.stringify(wsMessage));
                    var allInfo = gJson('allInfo');
                    allInfo.farmInfo[0] -= dia;
                    sJson('allInfo', allInfo);
                    cc.find('Canvas/fixItem/fixLayout/diamond/diamondLabel').getComponent(cc.Label).string -= dia;
                } else {
                    tips(data.message);
                }
            })
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});