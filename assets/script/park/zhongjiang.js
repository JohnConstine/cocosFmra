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
        goldItem: {
            default: null,
            type: cc.Prefab
        },

        diaItem: {
            default: null,
            type: cc.Prefab
        },
        imgs: {
            default: null,
            type: cc.SpriteAtlas
        },
        type: 'gold',
        page: 0,
        size: 10,
        scroll: cc.Node
    },

    // use this for initialization
    onEnable: function() {
    
        updateGoldAndDia();
        this.getMes();
        this.scroll.once('scroll-to-bottom', this.loadingMore, this);
    },
    loadingMore: function() {
        var _this = this;
        this.page++;
        this.scroll.off('scroll-to-bottom', this.loadingMore, this);
        this.getMes();
        setTimeout(function() {
            _this.scroll.once('scroll-to-bottom', _this.loadingMore, _this);
        }, 1000);
    },
    getMes: function() {

        var type = this.type;

        var _this = this;

        var imgs = this.imgs;

        if (type == 'gold') {
            var item = this.goldItem;
            ajax(urlPrefix + 'lottery/lottery1007.do',
                'user_id=' + getUserInfo().user_id +
                '&page=' + this.page +
                '&size=' + this.size +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {

                        for (var i = 0; i < data.data.length; i++) {
                            var goldItem = cc.instantiate(item);

                            cc.find('periods', goldItem).getComponent('cc.Label').string = '投注期数:第' + data.data[i].periods + '期';
                            cc.find('num/num', goldItem).getComponent('cc.Label').string = '投注数量:' + data.data[i].gold;
                            cc.find('result/resultnum', goldItem).getComponent('cc.Label').string = '投注号码：' + data.data[i].result + '号、' + data.data[i].result1 + '号';
                            cc.find('open/result', goldItem).getComponent('cc.Label').string = '本期开奖号码:' + data.data[i].win_result + '号、' + data.data[i].win_result1 + '号';
                            cc.find('result/resultimg', goldItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].id_name);

                            cc.find('result/result1img', goldItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].id_name1);
                            var is_prize = data.data[i].is_prize;
                            if (!data.data[i].code) {
                                cc.find('open/null', goldItem).active = true;
                                cc.find('open/result', goldItem).active = false;

                            } else {
                                if (is_prize == 0) {
                                    cc.find('open/0', goldItem).active = true;
                                    cc.find('open/0/resultimg', goldItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].code);
                                    cc.find('open/0/result1img', goldItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].code1);

                                } else if (is_prize == 2) { //一等奖
                                    cc.find('open/1', goldItem).active = true;
                                    cc.find('open/1/num', goldItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_gold
                                } else if (is_prize == 1) {
                                    cc.find('open/2', goldItem).active = true;
                                    cc.find('open/2/num', goldItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_gold
                                }
                            }

                            goldItem.parent = cc.find('scroll/view/content', _this.node);

                        }

                    } else {
                        tips(data.message);
                    }
                }
            );



        } else if (type == 'gold1') {
            var item = this.goldItem;
            ajax(
                urlPrefix + 'lottery/lottery3004.do',
                'user_id=' + getUserInfo().user_id +
                '&page=' + this.page +
                '&size=' + this.size +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {

                        for (var i = 0; i < data.data.length; i++) {
                            var goldItem = cc.instantiate(item);

                            cc.find('periods', goldItem).getComponent('cc.Label').string = '投注期数:第' + data.data[i].periods + '期';
                            cc.find('num/num', goldItem).getComponent('cc.Label').string = '投注数量:' + data.data[i].gold;
                            cc.find('result/resultnum', goldItem).getComponent('cc.Label').string = '投注号码：' + data.data[i].result + '号' ;
                            cc.find('open/result', goldItem).getComponent('cc.Label').string = '本期开奖号码:' + data.data[i].win_result + '号' ;
                            cc.find('result/resultimg', goldItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].id_name);

                         
                            var is_prize = data.data[i].is_prize;
                            if (!data.data[i].code) {
                                cc.find('open/null', goldItem).active = true;
                                cc.find('open/result', goldItem).active = false;

                            } else {
                                if (is_prize == 0) {
                                    cc.find('open/0', goldItem).active = true;
                                    cc.find('open/0/resultimg', goldItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].code);
                                   

                                } else if (is_prize == 2) { //一等奖
                                    cc.find('open/1', goldItem).active = true;
                                    cc.find('open/1/num', goldItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_gold
                                } else if (is_prize == 1) {
                                    cc.find('open/2', goldItem).active = true;
                                    cc.find('open/2/num', goldItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_gold
                                }
                            }

                            goldItem.parent = cc.find('scroll/view/content', _this.node);

                        }

                    } else {
                        tips(data.message);
                    }
                }
            );



        } else if (type == 'dia') {
            var item = this.diaItem;
            ajax(urlPrefix + 'lottery/lottery1008.do',
                'user_id=' + getUserInfo().user_id +
                '&page=' + this.page +
                '&size=' + this.size +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {

                        for (var i = 0; i < data.data.length; i++) {
                            var diaItem = cc.instantiate(item);

                            cc.find('periods', diaItem).getComponent('cc.Label').string = '投注期数:第' + data.data[i].periods + '期';
                            cc.find('num/num', diaItem).getComponent('cc.Label').string = '投注数量:' + data.data[i].diamond;
                            cc.find('result/resultnum', diaItem).getComponent('cc.Label').string = '投注号码：' + data.data[i].result + '号、' + data.data[i].result1 + '号';
                            cc.find('open/result', diaItem).getComponent('cc.Label').string = '本期开奖号码:' + data.data[i].win_result + '号、' + data.data[i].win_result1 + '号';
                            cc.find('result/resultimg', diaItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].id_name);
                            cc.find('result/result1img', diaItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].id_name1);
                            var is_prize = data.data[i].is_prize;
                            if (!data.data[i].code) {
                                cc.find('open/null', diaItem).active = true;
                                cc.find('open/result', diaItem).active = false;

                            } else {
                                if (is_prize == 0) {
                                    cc.find('open/0', diaItem).active = true;
                                    cc.find('open/0/resultimg', diaItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].code);
                                    cc.find('open/0/result1img', diaItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].code1);

                                } else if (is_prize == 2) { //一等奖
                                    cc.find('open/1', diaItem).active = true;
                                    cc.find('open/1/num', diaItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_diamond
                                } else if (is_prize == 1) {
                                    cc.find('open/2', diaItem).active = true;
                                    cc.find('open/2/num', diaItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_diamond
                                }
                            }


                            diaItem.parent = cc.find('scroll/view/content', _this.node);

                        }

                    } else {
                        tips(data.message);
                    }
                }
            );

        } else if (type == 'dia1') {
            var item = this.diaItem;
            ajax(
                urlPrefix + 'lottery/lottery2004.do',
                'user_id=' + getUserInfo().user_id +
                '&page=' + this.page +
                '&size=' + this.size +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {

                        for (var i = 0; i < data.data.length; i++) {
                            var diaItem = cc.instantiate(item);

                            cc.find('periods', diaItem).getComponent('cc.Label').string = '投注期数:第' + data.data[i].periods + '期';
                            cc.find('num/num', diaItem).getComponent('cc.Label').string = '投注数量:' + data.data[i].diamond;
                            cc.find('result/resultnum', diaItem).getComponent('cc.Label').string = '投注号码：' + data.data[i].result + '号' ;
                            cc.find('open/result', diaItem).getComponent('cc.Label').string = '本期开奖号码:' + data.data[i].win_result + '号' ;
                            cc.find('result/resultimg', diaItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].id_name);
                          
                            var is_prize = data.data[i].is_prize;
                            if (!data.data[i].code) {
                                cc.find('open/null', diaItem).active = true;
                                cc.find('open/result', diaItem).active = false;

                            } else {
                                if (is_prize == 0) {
                                    cc.find('open/0', diaItem).active = true;
                                    cc.find('open/0/resultimg', diaItem).getComponent('cc.Sprite').spriteFrame = imgs.getSpriteFrame(data.data[i].code);
                                   

                                } else if (is_prize == 2) { //一等奖
                                    cc.find('open/1', diaItem).active = true;
                                    cc.find('open/1/num', diaItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_diamond
                                } else if (is_prize == 1) {
                                    cc.find('open/2', diaItem).active = true;
                                    cc.find('open/2/num', diaItem).getComponent('cc.Label').string = '奖金:' + data.data[i].restroe_diamond
                                }
                            }


                            diaItem.parent = cc.find('scroll/view/content', _this.node);

                        }

                    } else {
                        tips(data.message);
                    }
                }
            );

        }


    },
    onDisable: function() {
        cc.find('scroll/view/content', this.node).removeAllChildren();
        this.page = 0;
        this.type = "gold";
    },
    reinit: function() {
        this.onDisable();
        this.onEnable();
    },
    changeTab: function(event, cus) {
        // var target = event.target;
        // target.color = {
        //     r: 255,
        //     g: 255,
        //     b: 255,
        //     a: 255
        // };
        // if (cus == 'prop') {
        //     var animal = target.parent.getChildByName('animal');
        //     animal.color = {
        //         r: 204,
        //         g: 204,
        //         b: 204,
        //         a: 255
        //     };
        // } else {
        //     var animal = target.parent.getChildByName('prop');
        //     animal.color = {
        //         r: 204,
        //         g: 204,
        //         b: 204,
        //         a: 255
        //     };
        // }

        this.type = cus;
        cc.find('scroll/view/content', this.node).removeAllChildren();
        this.page = 0;
        this.onEnable();
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});