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
        headimg: {
            default: null,
            type: cc.SpriteAtlas
        },
        animalPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad: function() {
        
    },
    // use this for initialization
    onEnable: function() {
        cc.find('loading').active = true;
        var _this = this;
        var headimg = this.headimg;
        var animalPrefab = this.animalPrefab;

        ajax(
            urlPrefix + 'farm/farm1010.do',
            '',
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    _this.curTime = data.data;
                    ajax(
                        urlPrefix + 'user/user1020.do',
                        'user_id=' + curFriendId,
                        function(res) {
                            var data = JSON.parse(res);
                            if (data.state) {
                                var userInfo = data.data.friendInfo[0];
                                var animalInfo = data.data.animalOrders;
                                var farmInfo = data.data.farmInfo[0];
                                var allLoadNum = animalInfo.length;

                                if (farmInfo.have_dog == 1) {
                                    cc.find('Canvas/background/dog').active = true;
                                }

                                //把动物信息分圈
                                var animals = [];
                                for (var i = 1; i < 17; i++) {
                                    animals[i] = [];
                                }
                                for (var j = 0; j < animalInfo.length; j++) {
                                    animals[animalInfo[j].shed_id].push(animalInfo[j])
                                }



                                //个人信息赋值
                                var muban = cc.find('Canvas/fixItem/fixLayout/muban');
                                muban.getChildByName('nickname').getComponent(cc.Label).string = '昵称：' + userInfo.nickname;
                                muban.getChildByName('id').getComponent(cc.Label).string = 'Id号：' + userInfo.user_id;
                                muban.getChildByName('level').getComponent(cc.Label).string = '等级：' + userInfo.level;
                                muban.getChildByName('headimg').getComponent(cc.Sprite).spriteFrame = headimg.getSpriteFrame(userInfo.head_img);

                                //农场开通赋值
                                var sheds = cc.find('Canvas/background/sheds'); //1-16

                                for (var i = 0; i < 16; i++) {
                                    var shenum = 'shed' + (i + 1);
                                    var shed = sheds.getChildByName(shenum);
                                    if (farmInfo[shenum]) {

                                        shed.color = {
                                            a: 255,
                                            r: 255,
                                            g: 255,
                                            b: 255
                                        };
                                        shed.getChildByName('Abilities-lock').active = false;
                                    }
                                }
                                //动物赋值
                                if (allLoadNum == 0) {
                                    cc.find('loading').active = false;
                                }

                                for (var k = 1; k < animals.length; k++) {

                                    for (var j = 0; j < animals[k].length; j++) {
                                        var animalItem = animals[k][j];
                                        var animalShedid = k;
                                        var p = shedPosition[j];
                                        var item = cc.instantiate(animalPrefab);
                                        var animalCode = animalItem.animal_code;


                                        cc.loader.loadRes("common/pet/" + animalCode, sp.SkeletonData, function(animalItem, item, animalShedid, p, err, SkeletonData) {


                                            var create_date = animalItem.create_date;
                                            var animal_protime = animalItem.animal_protime;
                                            var order_id = animalItem.id;
                                            var can_steal = animalItem.can_steal;
                                            var cub_num = animalItem.cub_num;
                                            var animal_id = animalItem.animal_id;


                                            var animalJson = item.getChildByName('animalJson');
                                            animalJson.getComponent(sp.Skeleton).skeletonData = SkeletonData;
                                            animalJson.getComponent(sp.Skeleton).animation = 'habitat_eat';
                                            item.position = p;


                                            var time = animalJson.getChildByName('time');
                                            var shouhuo = animalJson.getChildByName('shouhuo');

                                            var label = time.getComponent(cc.Label);

                                            if (cub_num) {
                                                time.active = false;
                                                shouhuo.active = true;
                                                if (!can_steal) {
                                                    shouhuo.getComponent(cc.Label).string = '可偷取';

                                                    item.on('touchstart', function(item, animalItem, event) {
                                                        var target = event.target;

                                                        var order_id = animalItem.id;

                                                        var product_num = animalItem.product_num;
                                                        var animal_id = animalItem.animal_id;
                                                        var produce_count = animalItem.produce_count;
                                                        var animal_proaccount = animalItem.animal_proaccount;
                                                        var animal_protime = animalItem.animal_protime;


                                                        ajax(
                                                            urlPrefix + 'warehouse/warehouse1004.do',
                                                            'user_id=' + getUserInfo().user_id +
                                                            '&friend_id=' + curFriendId +
                                                            '&order_id=' + order_id +
                                                            '&animal_id=' + animal_id +
                                                            userToken(),
                                                            function(res) {
                                                                var data = JSON.parse(res);
                                                                if (data.state) {
                                                                    tips(data.message);
                                                                    if (data.data == 404) { //被狗咬了
                                                                        var wsMessage = {
                                                                            sendId: getUserInfo().user_id,
                                                                            acceptId: curFriendId,
                                                                            target: 2,
                                                                            type: 1,
                                                                            data: {
                                                                                shed_id: i + 1
                                                                            }
                                                                        }
                                                                        WS.ob.send(JSON.stringify(wsMessage));
                                                                    } else {
                                                                        shouhuo.getComponent(cc.Label).string = '已偷取过';
                                                                    }

                                                                } else {
                                                                    tips(data.message);

                                                                }

                                                            }
                                                        )
                                                    }.bind({}, item, animalItem));
                                                } else { //can_steal为1.已被偷取过
                                                    shouhuo.getComponent(cc.Label).string = '已偷取过';
                                                }

                                            } else {
                                                var schetime = (create_date + animal_protime * 3600 * 1000 - _this.curTime) / 1000;

                                                if (schetime <= 0) {
                                                    ajax(
                                                        urlPrefix + 'animal/animal1005.do',
                                                        'order_id=' + order_id +
                                                        '&user_id=' + getUserInfo().user_id +
                                                        userToken(),
                                                        function(res) {
                                                            var data = JSON.parse(res);
                                                            if (data.state) {
                                                                time.active = false;
                                                                shouhuo.active = true;
                                                                shouhuo.getComponent(cc.Label).string = '可偷取';
                                                                item.on('touchstart', function(item, animalItem, event) {
                                                                    var target = event.target;

                                                                    var order_id = animalItem.id;

                                                                    var product_num = animalItem.product_num;
                                                                    var animal_id = animalItem.animal_id;
                                                                    var produce_count = animalItem.produce_count;
                                                                    var animal_proaccount = animalItem.animal_proaccount;
                                                                    var animal_protime = animalItem.animal_protime;


                                                                    ajax(
                                                                        urlPrefix + 'warehouse/warehouse1004.do',
                                                                        'user_id=' + getUserInfo().user_id +
                                                                        '&friend_id=' + curFriendId +
                                                                        '&order_id=' + order_id +
                                                                        '&animal_id=' + animal_id +
                                                                        userToken(),
                                                                        function(res) {
                                                                            var data = JSON.parse(res);
                                                                            if (data.state) {
                                                                                tips('偷取成功!')
                                                                                shouhuo.getComponent(cc.Label).string = '已偷取过';
                                                                            }
                                                                            tips(data.message);
                                                                        }
                                                                    )
                                                                }.bind({}, item, animalItem));
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    time.active = false;
                                                    shouhuo.active = true;
                                                    shouhuo.getComponent(cc.Label).string = '生长中';
                                                }

                                            }

                                            allLoadNum--;
                                            if (allLoadNum <= 0) {
                                                cc.find('loading').active = false;
                                            }
                                            item.parent = cc.find('Canvas/background/sheds/shed' + animalShedid);

                                        }.bind({}, animalItem, item, animalShedid, p));



                                    }

                                }


                            } else {
                                tips(data.message);
                            }
                        });
                }
            })


    },
    goHome: function() {
            cc.find('loading').active = true;
            cc.director.loadScene('home');
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});