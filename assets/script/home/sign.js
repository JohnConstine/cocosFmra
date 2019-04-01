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
        signItem: {
            default: null,
            type: cc.Prefab
        },
        confirm: cc.Node

    },

    // use this for initialization
    onLoad: function() {
        var nowTime;
        var _this = this;
        ajax(
            urlPrefix + 'farm/farm1010.do',
            '',
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    nowTime = data.data;
                    var countDay = getCountDays(nowTime);
                    //var signItem=cc.instantiate(this.signItem);
                    var content = cc.find('body/scroll/view/content', _this.node);
                    //通过服务器时间拿到年月并获取签到信息
                    var user_id = getUserInfo().user_id;
                    var date = new Date(nowTime);
                    var year = date.getFullYear();
                    var month = _this.month = date.getMonth() + 1;
                    var day = _this.day = date.getDate();
                    var signItems = content.children;

                    _this.buqian = [];
                    var addUpHonor = 0;

                    //添加签到点击事件


                    for (var i = 0; i < countDay; i++) {
                        var signItem = cc.instantiate(_this.signItem);
                        cc.find('item/day', signItem).getComponent(cc.Label).string = '第' + (i + 1) + '天';
                        if (i == day - 1) {
                            cc.find('item/day', signItem).getComponent(cc.Label).string = '今天';
                            cc.find('item/day', signItem).getComponent(cc.Label).fontSize = 35;
                            cc.find('item/day', signItem).color = {
                                r: 226,
                                g: 28,
                                b: 28,
                                a: 255
                            };

                        }
                        signItem.parent = content;
                    }


                    ajax(
                        urlPrefix + 'farm/farm1008.do',
                        'user_id=' + user_id + '&year=' + year + '&month=' + month,
                        function(res) {
                            var data = JSON.parse(res);
                            if (data.state) {

                                for (var i = 0; i < data.data.length; i++) {
                                    var date = data.data[i].date;
                                    var isCheck = data.data[i].is_success;
                                    if (isCheck === 3) {
                                        cc.find('item/glo', signItems[date - 1]).getComponent(cc.Label).string = '+' + data.data[i].groly;
                                        cc.find('check', signItems[date - 1]).active = true;
                                    } else if (isCheck === 2) {
                                        cc.find('item/glo', signItems[date - 1]).getComponent(cc.Label).string = '签到失败';
                                    } else if (isCheck === 1) {
                                        if (date == day) {
                                            var sign = cc.find('body/btn/btn_sign/Label', _this.node).getComponent(cc.Label);
                                            sign.string = '签到中';
                                            sign.interactable = false;
                                        }
                                        cc.find('item/glo', signItems[date - 1]).getComponent(cc.Label).string = '签到中';
                                    } else if (isCheck === 0) {
                                        signItems[date - 1].on('touchstart', function(date, glory) {
                                            _this.showConfirm(date, glory, signItems[date - 1]);
                                        }.bind({}, date, data.data[i].groly))
                                        addUpHonor += Number(data.data[i].groly);
                                        cc.find('item/glo', signItems[date - 1]).getComponent(cc.Label).string = '+' + data.data[i].groly;
                                        _this.buqian.push(date);
                                    }
                                }
                                cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string = addUpHonor.toFixed(2);
                            } else {
                                tips(data.message);
                            }
                        }
                    );
                    cc.find('body/btn/total/totalGlo', _this.node).getComponent(cc.Label).string = getUserInfo().total_groly;

                }
            })



    },
    showConfirm: function(date, glory, signItem) {
        if (is_show) {
            this.confirm.active = true;
            this.yewuData = {
                date: date,
                glory: glory,
                item: signItem
            };
        } else {
            var _this = this;
            var user_id = getUserInfo().user_id;
            var month = this.month;
            var day = date;
            var content = cc.find('body/scroll/view/content', this.node);

            ajax(
                urlPrefix + 'farm/farm1004.do',
                'user_id=' + user_id + '&month=' + month + '&date=' + day + userToken(),
                function(res) {

                    var data = JSON.parse(res);
                    // signItem.off('touchstart', function(date, glory, signItem) {
                    //     _this.sign(date, glory, signItem);
                    // }.bind({}, date, glory, signItem))
                    if (data.state) {
                        if (data.data == 3) {
                            cc.find('check', content.children[day - 1]).active = true;
                            tips('签到成功');

                            cc.find('body/btn/total/totalGlo', _this.node).getComponent(cc.Label).string = (glory + Number(cc.find('body/btn/total/totalGlo', _this.node).getComponent(cc.Label).string)).toFixed(2);
                            cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string = (Number(cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string) - glory).toFixed(2);
                        } else if (data.data == 2) {
                            cc.find('false', content.children[day - 1]).active = true;
                            tips('签到失败');
                        } else if (data.data == 1) {
                            cc.find('item/glo', signItem).getComponent(cc.Label).string = '签到中';
                            tips('签到中');
                        }
                    } else {
                        tips(data.message);
                    }

                    setTimeout(function() {
                        updateGoldAndDia();
                    }, 100);

                });
        }

    },
    sign: function(event, isPipei) {
        this.confirm.active = false;
        var yewuData = this.yewuData;
        var date = yewuData.date;
        var glory = yewuData.glory;
        var signItem = yewuData.item;

        var url = isPipei == 1 ? 'farm/farm1024.do' : 'farm/farm1004.do';

        var _this = this;
        var user_id = getUserInfo().user_id;
        var month = this.month;
        var day = date;
        var content = cc.find('body/scroll/view/content', this.node);

        ajax(
            urlPrefix + url,
            'user_id=' + user_id + '&month=' + month + '&date=' + day + userToken(),
            function(res) {

                var data = JSON.parse(res);
                // signItem.off('touchstart', function(date, glory, signItem) {
                //     _this.sign(date, glory, signItem);
                // }.bind({}, date, glory, signItem))
                if (data.state) {
                    if (data.data == 3) {
                        cc.find('check', content.children[day - 1]).active = true;
                        tips('签到成功');

                        cc.find('body/btn/total/totalGlo', _this.node).getComponent(cc.Label).string = (glory + Number(cc.find('body/btn/total/totalGlo', _this.node).getComponent(cc.Label).string)).toFixed(2);
                        cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string = (Number(cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string) - glory).toFixed(2);
                    } else if (data.data == 2) {
                        cc.find('false', content.children[day - 1]).active = true;
                        tips('签到失败');
                    } else if (data.data == 1) {
                        cc.find('item/glo', signItem).getComponent(cc.Label).string = '签到中';
                        tips('签到中');
                    }
                } else {
                    tips(data.message);
                }

                setTimeout(function() {
                    updateGoldAndDia();
                }, 100);

            });
    },
    oneKeySign: function() {
        var user_id = getUserInfo().user_id;
        var month = this.month;
        var list = this.buqian;
        var token = userToken().split('=')[1];
        var _this = this;
        var aaa = {
            'user_id': user_id,
            'month': month,
            'list': list,
            'user_token': token
        };
        var url = urlPrefix + 'farm/farm1005.do'

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var res = xhr.responseText;
                var data = JSON.parse(res);
                if (data.state) {
                    var content = cc.find('body/scroll/view/content', _this.node).children;
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].is_success == 3) {
                            cc.find('check', content[data.data[i].date - 1]).active = true;
                        }
                    }
                    cc.find('body/btn/total/totalGlo', _this.node).getComponent(cc.Label).string += Number(cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string);
                    cc.find('body/btn/leiji/addUpGlo', _this.node).getComponent(cc.Label).string = 0;
                    _this.buqian = [];

                } else {
                    tips(data.message);
                }

            }
        };
        xhr.open("POST", url, true);
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(JSON.stringify(aaa));

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});