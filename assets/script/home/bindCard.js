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
        realname: {
            default: null,
            type: cc.EditBox
        },
        bankCard: {
            default: null,
            type: cc.EditBox
        },
        bank_deposit: {
            default: null,
            type: cc.EditBox
        },
        ali: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function() {
        var real_name = getUserInfo().real_name;
        var bank_card = getUserInfo().bank_card;
        var bank_deposit = getUserInfo().bank_deposit;
        var ali_account = getUserInfo().ali_account;

        if (this.node.name == 'bindCard') {
            if (real_name != null && real_name.length > 1) {
                this.realname.string = real_name;
            }
            if (bank_card != null && bank_card.length > 1) {
                this.bankCard.string = bank_card;
            }
            if (bank_deposit != null && bank_deposit.length > 1) {
                this.bank_deposit.string = bank_deposit;
            }
        }else if(this.node.name == 'bindAli'){
            if (ali_account != null && ali_account.length > 1) {
                this.ali.string = ali_account;
            }
        }
    },
    submit: function() {
        var realname = this.realname.string;
        var bankCard = this.bankCard.string;
        var bank_deposit = this.bank_deposit.string;
        ajax(
            urlPrefix + 'user/user1011.do',
            'user_id=' + getUserInfo().user_id +
            '&real_name=' + realname +
            '&bank_card=' + bankCard +
            '&bank_deposit=' + bank_deposit +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(bank_deposit + '绑定成功!');
                    var allInfo = gJson('allInfo');
                    allInfo.userInfo[0].bank_deposit = bank_deposit;
                    allInfo.userInfo[0].bank_card = bankCard;
                    sJson('allInfo', allInfo);
                } else {
                    tips(data.message);
                }
            })
    },
    bindali: function() {

            var ali = this.ali.string;
            ajax(
                urlPrefix + 'user/user1026.do',
                'user_id=' + getUserInfo().user_id +
                '&ali_account=' + ali +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        tips(ali + '绑定成功!');
                        var allInfo = gJson('allInfo');
                        allInfo.userInfo[0].ali_account = ali;
                        sJson('allInfo', allInfo);
                    } else {
                        tips(data.message);
                    }
                })
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});