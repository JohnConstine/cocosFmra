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
        type: 'system',
        messageItem: {
            default: null,
            type: cc.Prefab
        },
        systemMessage: {
            default: null,
            type: cc.Prefab
        },
        page: 0,
        size: 20,
        scroll: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function() {



    },
    onEnable: function() {
        var page = this.page;
        var size = this.size;
        var _this = this;
        cc.find('Canvas/fixItem/fixLayout/Btngroup/message/img/bob/num').getComponent(cc.Label).string = 0;
        cc.find('Canvas/fixItem/fixLayout/Btngroup/message/img/bob').active = false;

        var messageItem = this.systemMessage;
        ajax(
            urlPrefix + 'message/message1007.do',
            'user_id=' + getUserInfo().user_id +
            '&page=' + page +
            '&size=' + size,
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    for (var i = 0; i < data.data.length; i++) {
                        var item = cc.instantiate(messageItem);

                        cc.find('messageContent', item).getComponent(cc.Label).string = data.data[i].message_content;
                        cc.find('time', item).getComponent(cc.Label).string = getFormatTime(data.data[i].create_date);
                        item.data = data.data[i];
                        item.parent = cc.find('scroll/view/content', _this.node);
                    }
                } else {
                    tips(data.message);
                }
            }
        );
        this.scroll.once('scroll-to-bottom', this.loadingMore,this);
    },

    changeType: function(event, cus) {
        this.type = cus;
        this.onDisable();
        this.onEnable();
    },
    onDisable: function() {
        cc.find('scroll/view/content', this.node).removeAllChildren();
        this.page = 0;
    },
    loadingMore: function() {
            this.scroll.off('scroll-to-bottom', this.loadingMore,this);
            var messageItem = this.systemMessage;
            var _this = this;
            _this.page++;
            ajax(
                urlPrefix + 'message/message1007.do',
                'user_id=' + getUserInfo().user_id +
                '&page=' + _this.page +
                '&size=' + _this.size,
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        if (data.data.length==0) {
                            tips('没有更多消息了！');
                        } else {
                            for (var i = 0; i < data.data.length; i++) {
                                var item = cc.instantiate(messageItem);

                                cc.find('messageContent', item).getComponent(cc.Label).string = data.data[i].message_content;
                                cc.find('time', item).getComponent(cc.Label).string = getFormatTime(data.data[i].create_date);
                                item.data = data.data[i];
                                item.parent = cc.find('scroll/view/content', _this.node);
                               
                            }
                        }

                    } else {
                        tips(data.message);
                    }
                    setTimeout(function () {
                        _this.scroll.once('scroll-to-bottom', _this.loadingMore,_this);
                    },1000);
                })
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});