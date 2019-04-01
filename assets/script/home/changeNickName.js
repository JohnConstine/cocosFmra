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
        edit: {
            default: null,
            type: cc.EditBox
        },

    },

    // use this for initialization
    onLoad: function() {

    },
    changeNickName: function(event) {
            var button = event.target;
            button.getComponent(cc.Button).interactable = false;
            var _this = this;
            var name = this.edit.string;
            var allInfo = gJson('allInfo');

            var user_id = getUserInfo().user_id;
            ajax(
                urlPrefix + 'user/user1016.do',
                'user_id=' + user_id +
                '&nickname=' + name +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {

                        //修改金钱及本地数据
                        cc.find('Canvas/fixItem/fixLayout/gold/goldLabel').getComponent(cc.Label).string -= 600;

                        allInfo.farmInfo[0].gold -= 600;



                        //修改昵称及本地数据
                        cc.find('Canvas/fixItem/fixLayout/status/nickName').getComponent(cc.Label).string = name;

                        allInfo.userInfo[0].nickname = name;


                        sJson('allInfo', allInfo);



                        _this.node.active = false;
                    }
                    tips(data.message, 1);
                    button.getComponent(cc.Button).interactable = true;
                }
            );

        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});