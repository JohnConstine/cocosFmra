cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,

        page: 0,
        size: 10,

        scroll: cc.Node,
        content: cc.Node,
        buttons: {
            default: [],
            type: cc.Node
        },
        type: 0,
        confirm: cc.Node
    },
    onEnable: function() {
        var _this = this;
        ajax(
            //urlPrefix + 'farm/farm1010.do',
            'http://www.morefind.com/farm/farm/farm1010.do',
            '',
            function(res) {
                var data = JSON.parse(res);
                var time = data.data;
                var date = new Date(time);
                _this.year = date.getFullYear();
                _this.month = date.getMonth() + 1;
                _this.showAll();
            }
        );
        this.dlmateItem='';
    },
    // use this for initialization
    onLoad: function() {

    },


    LoadingMore: function() { //TODO
        this.scroll.off('scroll-to-bottom', this.LoadingMore, this);
        var _this = this;
        this.page++;
        var page = this.page;
        var size = this.size;
        var year = this.year;
        var month = this.month;

        var prefab = this.prefab;
        var content = this.content;
        switch (this.type) {
            case 0:
                ajax(
                    urlPrefix + 'farm/farm2002.do',
                    'user_id=' + getUserInfo().user_id +
                    '&year=' + year +
                    '&month=' + month +
                    '&page=' + _this.page +
                    '&size=' + _this.size +
                    userToken(),
                    function(res) {
                        var data = JSON.parse(res);
                        if (data.state) {
                            var prefab = _this.prefab;
                            for (var i = 0; i < data.data.length; i++) {
                                var item = cc.instantiate(prefab);
                                item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                                item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                                item.getChildByName('nickName').getComponent('cc.Label').string = '';
                                item.getChildByName('phone').getComponent('cc.Label').string = '';
                                item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                                item.data = data.data[i];

                                item.parent = _this.content;
                            }
                        } else {
                            tips(data.message);
                        };
                        _this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
                    }
                );
                break;
            case 1:
                ajax(
                    urlPrefix + 'farm/farm2007.do',
                    'user_id=' + getUserInfo().user_id +
                    '&year=' + year +
                    '&month=' + month +
                    '&page=' + _this.page +
                    '&size=' + _this.size +
                    userToken(),
                    function(res) {
                        var data = JSON.parse(res);
                        if (data.state) {
                            var prefab = _this.prefab;
                            for (var i = 0; i < data.data.length; i++) {
                                var item = cc.instantiate(prefab);
                                item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                                item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                                item.getChildByName('nickName').getComponent('cc.Label').string = '';
                                item.getChildByName('phone').getComponent('cc.Label').string = '';
                                item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                                item.data = data.data[i];
                                item.getChildByName('pipei').active = true;
                                item.getChildByName('pipei').on('touchend', _this.askToMate, _this);
                                item.parent = _this.content;
                            }
                        } else {
                            tips(data.message);
                        };
                        _this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
                    }
                );
                break;
            case 2:
                ajax(
                    urlPrefix + 'farm/farm2011.do',
                    'user_id=' + getUserInfo().user_id +
                    '&year=' + year +
                    '&month=' + month +
                    '&page=' + _this.page +
                    '&size=' + _this.size +
                    userToken(),
                    function(res) {
                        var data = JSON.parse(res);
                        if (data.state) {
                            var prefab = _this.prefab;
                            for (var i = 0; i < data.data.length; i++) {
                                var item = cc.instantiate(prefab);
                                item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                                item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                                item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
                                item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
                                item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                                item.data = data.data[i];

                                item.parent = _this.content;
                            }
                        } else {
                            tips(data.message);
                        };
                        _this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
                    }
                );
                break;
            case 3:
                ajax(
                    urlPrefix + 'farm/farm/farm2008.do',
                    'user_id=' + getUserInfo().user_id +
                    '&year=' + year +
                    '&month=' + month +
                    '&page=' + _this.page +
                    '&size=' + _this.size +
                    userToken(),
                    function(res) {
                        var data = JSON.parse(res);
                        if (data.state) {
                            var prefab = _this.prefab;
                            for (var i = 0; i < data.data.length; i++) {
                                var item = cc.instantiate(prefab);
                                item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                                item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                                item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
                                item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
                                item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                                item.data = data.data[i];

                                item.parent = _this.content;
                            }
                        } else {
                            tips(data.message);
                        };
                        _this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
                    }
                );
                break;
        }

    },
    showAll: function() {
        this.allWhite();
        this.type = 0;
        this.page = 0;
        this.buttons[0].color = {
            r: 204,
            g: 204,
            b: 204,
            a: 255
        };

        this.content.removeAllChildren();
        var _this = this;
        var year = this.year;
        var month = this.month;
        ajax(
            urlPrefix + 'farm/farm2002.do',
            'user_id=' + getUserInfo().user_id +
            '&year=' + year +
            '&month=' + month +
            '&page=' + _this.page +
            '&size=' + _this.size +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var prefab = _this.prefab;
                    for (var i = 0; i < data.data.length; i++) {
                        var item = cc.instantiate(prefab);
                        item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                        item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                        item.getChildByName('nickName').getComponent('cc.Label').string = '';
                        item.getChildByName('phone').getComponent('cc.Label').string = '';
                        item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                        item.data = data.data[i];

                        item.parent = _this.content;
                    }
                } else {
                    tips(data.message);
                }
            }
        );
        this.scroll.once('scroll-to-bottom', this.LoadingMore, this);
    },
    showMating: function() {
        this.allWhite();
        this.type = 1;
        this.page = 0;
        this.buttons[1].color = {
            r: 204,
            g: 204,
            b: 204,
            a: 255
        };
        this.content.removeAllChildren();
        var _this = this;
        var year = this.year;
        var month = this.month;
        ajax(
            urlPrefix + 'farm/farm2007.do',
            'user_id=' + getUserInfo().user_id +
            '&year=' + year +
            '&month=' + month +
            '&page=' + _this.page +
            '&size=' + _this.size +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var prefab = _this.prefab;
                    for (var i = 0; i < data.data.length; i++) {
                        var item = cc.instantiate(prefab);
                        item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                        item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                        item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
                        item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
                        item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                        item.data = data.data[i];
                        item.getChildByName('pipei').active = true;
                        item.getChildByName('pipei').on('touchend', _this.askToMate, _this);
                        item.parent = _this.content;
                    }
                } else {
                    tips(data.message);
                }
            }
        );;
        _this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);

    },
    showWating: function() {
        this.allWhite();
        this.type = 2;
        this.page = 0;
        this.buttons[2].color = {
            r: 204,
            g: 204,
            b: 204,
            a: 255
        };
        this.content.removeAllChildren();
        var _this = this;
        var year = this.year;
        var month = this.month;
        ajax(
            urlPrefix + 'farm/farm2011.do',
            'user_id=' + getUserInfo().user_id +
            '&year=' + year +
            '&month=' + month +
            '&page=' + _this.page +
            '&size=' + _this.size +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var prefab = _this.prefab;
                    for (var i = 0; i < data.data.length; i++) {
                        var item = cc.instantiate(prefab);
                        item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                        item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                        item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
                        item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
                        item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                        item.data = data.data[i];

                        item.parent = _this.content;
                    }
                } else {
                    tips(data.message);
                }
            }
        );

        this.scroll.once('scroll-to-bottom', this.LoadingMore, this);
    },
    showFinished: function() {
        this.allWhite();
        this.type = 3;
        this.page = 0;
        this.buttons[3].color = {
            r: 204,
            g: 204,
            b: 204,
            a: 255
        };
        this.content.removeAllChildren();
        var _this = this;
        var year = this.year;
        var month = this.month;
        ajax(
            urlPrefix + 'farm/farm2008.do',
            'user_id=' + getUserInfo().user_id +
            '&year=' + year +
            '&month=' + month +
            '&page=' + _this.page +
            '&size=' + _this.size +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var prefab = _this.prefab;
                    for (var i = 0; i < data.data.length; i++) {
                        var item = cc.instantiate(prefab);
                        item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
                        item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
                        item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
                        item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
                        item.getChildByName('time').getComponent('cc.Label').string = getFormatDate(data.data[i].create_date);
                        item.data = data.data[i];

                        item.parent = _this.content;
                    }
                } else {
                    tips(data.message);
                }
            }
        );

        this.scroll.once('scroll-to-bottom', this.LoadingMore, this);
    },
    allWhite: function() {
        var buttons = this.buttons;
        for (var i in buttons) {
            buttons[i].color = {
                r: 255,
                g: 255,
                b: 255,
                a: 255
            }
        }
    },
    askToMate: function(event) {
        this.dlmateItem = event.target.parent;
        this.confirm.active = true;


    },
    confirmAskToMate: function() {
        var _this = this;
        var data = this.dlmateItem.data;

        var id = data.id;
        var friend_id = data.friend_id;
        var month = new Date(data.create_date).getMonth() + 1;
        ajax(
            urlPrefix + 'farm/farm2005.do',
            'user_id=' + getUserInfo().user_id +
            '&id=' + id +
            '&friend_id=' + friend_id +
            '&month=' + month +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    _this.dlmateItem.removeFromParent();
                    _this.confirm.active=false;
                }
                tips(data.message);

            }
        );
    },
    shuoming: function() {
        cc.find('shuoming', this.node).active = true;
    }



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});