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
        friendItem: {
            default: null,
            type: cc.Prefab
        },

        content: {
            default: null,
            type: cc.Node
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        tab: 1, //1是全部，2是推荐
        page: 0,
        scroll: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onEnable: function() {
        this.page = 0;
        if (this.tab == 1) {
            this.getAllFriend()
        } else if (this.tab == 2) {
            this.getrefFriend()
        }
    },
    getAllFriend: function() {
        //获得好友信息
        var page = this.page;
        var atlas = this.atlas;
        var friendItem = this.friendItem;
        var _this = this;
        var user_id = getUserInfo().user_id;
        ajax(urlPrefix + 'fish/fish1004.do',
            'user_id=' + user_id +
            '&page=' + _this.page +
            '&size=15' +
            userToken(),
            function(res) {
                var data = JSON.parse(res);

                if (data.state) {
                    for (var i = 0; i < data.data.length; i++) {
                        var TfriendItem = cc.instantiate(friendItem);
                        cc.find('headimg/img', TfriendItem).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(data.data[i].head_img);
                        cc.find('friendInfo/friendNickName', TfriendItem).getComponent(cc.Label).string = data.data[i].nickname;
                        cc.find('friendInfo/friendLevel', TfriendItem).getComponent(cc.Label).string = data.data[i].is_feed ? '已喂养' : "可获取鱼仔数量:X" + data.data[i].fish_num + '\n消耗金币:' + (data.data[i].feed_gold * data.data[i].fish_num).toFixed(2);
                        cc.find('id/id', TfriendItem).getComponent(cc.Label).string = data.data[i].user_id;

                        if (data.data[i].is_feed == 0 && data.data[i].fish_num != 0) {
                            cc.find('feed', TfriendItem).active = true;
                        }
                        TfriendItem.getComponent('friendItem').init(data.data[i]);
                        TfriendItem.parent = _this.content;

                    }
                }
                tips(data.message);
            }
        );
        this.scroll.once('scroll-to-bottom', this.loadingMore, this);
    },
    loadingMore: function() {
        var page = this.page;

        this.scroll.off('scroll-to-bottom', this.loadingMore, this);
        var atlas = this.atlas;
        var friendItem = this.friendItem;
        var _this = this;
        _this.page++;
        ajax(
            urlPrefix + 'fish/fish1004.do',
            'user_id=' + getUserInfo().user_id +
            '&page=' + _this.page +
            '&size=15' +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {

                    if (data.data.length == 0) {
                        tips('没有更多好友了！');
                    } else {
                        for (var i = 0; i < data.data.length; i++) {
                            var TfriendItem = cc.instantiate(friendItem);
                            cc.find('headimg/img', TfriendItem).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(data.data[i].head_img);
                            cc.find('friendInfo/friendNickName', TfriendItem).getComponent(cc.Label).string = data.data[i].nickname;
                            cc.find('friendInfo/friendLevel', TfriendItem).getComponent(cc.Label).string = data.data[i].is_feed ? '已喂养' : "可获取鱼仔数量:X" + data.data[i].fish_num;
                            cc.find('id/id', TfriendItem).getComponent(cc.Label).string = data.data[i].user_id;

                            if (data.data[i].is_feed == 0 && data.data[i].fish_num != 0) {
                                cc.find('feed', TfriendItem).active = true;
                            }
                            TfriendItem.getComponent('friendItem').init(data.data[i]);
                            TfriendItem.parent = _this.content;

                        }
                        setTimeout(function() {
                            _this.scroll.once('scroll-to-bottom', _this.loadingMore, _this);
                        }, 1000);
                    }

                } else {
                    tips(data.message);
                }

            })
    },
    getrefFriend: function() {
        //获得好友信息
        this.scroll.off('scroll-to-bottom', this.loadingMore, this);
        var atlas = this.atlas;
        var friendItem = this.friendItem;
        var _this = this.node;
        var user_id = getUserInfo().user_id;
        ajax(urlPrefix + 'user/user1025.do', 'user_id=' + user_id,
            function(res) {
                var data = JSON.parse(res);

                if (data.state) {
                    for (var i = 0; i < data.data.length; i++) {
                        var TfriendItem = cc.instantiate(friendItem);
                        cc.find('headimg/img', TfriendItem).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(data.data[i].head_img);
                        cc.find('friendInfo/friendNickName', TfriendItem).getComponent(cc.Label).string = data.data[i].nickname;
                        cc.find('friendInfo/friendLevel', TfriendItem).getComponent(cc.Label).string = "等级:" + data.data[i].level;
                        cc.find('7/id', TfriendItem).getComponent(cc.Label).string = data.data[i].user_id;
                        cc.find('status', TfriendItem).active = true;
                        if (data.data[i].status == 1) {
                            cc.find('status', TfriendItem).getComponent(cc.Label).string = '推荐人';
                        } else if (data.data[i].status == 2) {
                            cc.find('status', TfriendItem).getComponent(cc.Label).string = '被推荐人';
                        }
                        TfriendItem.data = data.data[i];
                        TfriendItem.parent = _this;

                    }
                }
            }
        );
    },
    onDisable: function() {
        this.content.removeAllChildren();
    },
    changeTab: function(event) {
            var target = event.target;
            if (this.tab == 1) {
                this.tab = 2;
                this.onDisable();
                this.onEnable();
                target.getChildByName('Label').getComponent(cc.Label).string = '所有好友';
            } else if (this.tab == 2) {
                this.tab = 1;
                this.onDisable();
                this.onEnable();
                target.getChildByName('Label').getComponent(cc.Label).string = '推荐好友';
            }
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});