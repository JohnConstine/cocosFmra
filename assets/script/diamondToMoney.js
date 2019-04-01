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
        moneyNum: {
            default: null,
            type: cc.Label
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

        var gold = this.moneyNum.string;

        this.moneyNum.string = dia * 20;
    },
    gochange: function(event) {
        var target = event.target;
        target.getComponent(cc.Button).interactable = false;

        var _this = this;
        var user_id = getUserInfo().user_id;
        var dia = this.diamondNum.string;
        if (dia === null || dia === '') {
            tips('请输入正确数字！');
            this.diamondNum.string = '';
            return;
        }
        ajax(
            urlPrefix + 'farm/farm1006.do',
            'user_id=' + user_id +
            '&diamond=' + dia +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    //修改界面
                    cc.find('Canvas/fixItem/fixLayout/gold/goldLabel').getComponent(cc.Label).string += (dia * 20);
                    cc.find('Canvas/fixItem/fixLayout/diamond/diamondLabel').getComponent(cc.Label).string -= dia;
                    //修改ls
                    updateGoldAndDia();
                }
                tips(data.message);
                target.getComponent(cc.Button).interactable = true;
                _this.diamondNum.string = '';
                _this.moneyNum.string = 0;
            }
        );
    },
    clearEdit: function() {

            this.diamondNum.string = '';
            this.moneyNum.string = 0;

        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});