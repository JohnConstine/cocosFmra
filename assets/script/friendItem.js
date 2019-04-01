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

    },
    init:function (data) {
        this.data=data;

    },
    goFriendHome: function(event) {
        var button = event.target;
        curFriendId = this.node.data.user_id;
        cc.director.loadScene('friendHome');
    },
    jiaoyi: function(event) {
        var friendId = this.node.data.user_id;
        var nickname = this.node.data.nickname;
        var jiaoyi = cc.find('Canvas/fixItem/myfriends/jiaoyi');
        jiaoyi.friendId = friendId;

        cc.find('content/id', jiaoyi).getComponent(cc.Label).string = nickname + '(ID:' + friendId + ')';


        jiaoyi.active = true;
    },
    feed: function() {
            var _this = this;
            
            ajax(
                urlPrefix + 'fish/fish1006.do',
                'user_id=' + getUserInfo().user_id +
                '&friend_id='+_this.data.user_id+
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        cc.find('feed',_this.node).active=false;
                        cc.find('friendInfo/friendLevel',_this.node).getComponent(cc.Label).string='已喂养';
                        tips('喂养成功,收获'+_this.data.fish_num+'条鱼苗!');
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