cc.Class({
    extends: cc.Component,
    //extends: websocket,

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
        fixLayout: {
            default: null,
            type: cc.Node
        },
        animalPrefab: {
            default: null,
            type: cc.Prefab
        },
        friendUpdatePrefab: {
            default: null,
            type: cc.Prefab
        }

    },

    // use this for initialization
    onLoad: function() {


        curOpenAnimalNode = '';
        cc.find('loading').active = true;
        var loginInfo = gJson('loginInfo');
        var user_id = loginInfo.user_id;
        var _this = this;
        //拿allInfo

        ajax(
            urlPrefix + 'user/user1017.do',
            'user_id=' + user_id +
            '&user_token=' + gJson('loginInfo').user_token,
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var allInfo = data.data;
                    var animals = [];
                    var animalInfo = allInfo.animalInfo
                    for (var i = 1; i < 17; i++) {
                        var item = [];
                        for (var j = 0; j < animalInfo.length; j++) {
                            if (animalInfo[j].shed_id == i) {
                                item.push(animalInfo[j]);
                            }
                        }
                        animals[i] = item;
                    }
                    allInfo.animals = animals;

                    _this.allInfo = allInfo;
                    sJson('allInfo', allInfo);

                    _this.init();
                }
            }, 1);

        ajax(
            urlPrefix + 'farm/farm1010.do',
            //'http://www.morefind.com/farm/farm/farm1010.do',
            '',
            function(res) {
                var data = JSON.parse(res);
                var time = data.data;
                _this.curTime = time;
            }
        );



    },
    init: function() {

        var friendUpdatePrefab = this.friendUpdatePrefab;

        var allInfo = this.allInfo;

        var userInfo = allInfo.userInfo[0];

        if (userInfo.user_id == '68504609' || userInfo.referee_id == '68504609' || userInfo.referee_id == '0') {
            cc.find('Canvas/fixItem/fixLayout/diamond').active = false;
            cc.find('Canvas/fixItem/fixLayout/gold/HUD-add').active = false;
            cc.find('Canvas/fixItem/fixLayout/button3/content/park').active = false;
            is_gold = 1;
        } else {
            is_gold = 0;
        }
        if (userInfo.user_id == '20074633' || userInfo.referee_id == '20074633' || userInfo.referee_id == '0') {
            is_show = 0;
            cc.find('Canvas/fixItem/fixLayout/button3/content/fenxiang').active = false;
            cc.find('Canvas/fixItem/fixLayout/button3/content/park').active = false;
            cc.find('Canvas/fixItem/fixLayout/button3/content/pond').active = false;
            cc.find('Canvas/fixItem/fixLayout/button3/content/mate').active = false;


            cc.find('Canvas/background/building/plane').active = false;
            cc.find('Canvas/background/building/Boat_vip').active = false;
        } else {
            is_show = 1;
            cc.find('Canvas/fixItem/fixLayout/button3/content/fenxiang').active = true;
        }

        // if (!mate_open) {
        //     cc.find('Canvas/fixItem/fixLayout/button3/content/mate').active = false;
        // }


        if (!(WS.ob.readyState && WS.ob.readyState == 1)) {
            WS.start(userInfo.user_id, 1);
        }

        var animalInfo = allInfo.animalInfo;

        var allLoadNum = animalInfo.length;

        var farmInfo = allInfo.farmInfo[0];

        var expInfo = allInfo.expInfo;

        var _this = this;

        var position = shedPosition;

        var curTime = allInfo.serverTime;
        //var curTime = new Date().getTime();

        var animalPrefab = this.animalPrefab;

        var level = userInfo.level;

        var curExp = userInfo.user_exp;

        if (curExp < expInfo[0].exp && level != expInfo[0].level) {
            level = expInfo[0].level;
            ajax(
                urlPrefix + 'user/user1023.do',
                'user_id=' + userInfo.user_id +
                '&level=' + expInfo[0].level +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        tips(data.message);
                        userInfo.level = expInfo[0].level;
                        var allInfo = gJson('allInfo');
                        allInfo.userInfo[0] = userInfo;
                        sJson('allInfo', allInfo);
                    }
                })
        } else {
            for (var expIndex = 1; expIndex < expInfo.length; expIndex++) {
                if (expInfo[expIndex - 1].exp <= curExp && curExp < expInfo[expIndex].exp) {
                    if (level > expInfo[expIndex].level) {
                        level = expInfo[expIndex].level;
                        ajax(
                            urlPrefix + 'user/user1023.do',
                            'user_id=' + userInfo.user_id +
                            '&level=' + expInfo[expIndex].level +
                            userToken(),
                            function(res) {
                                var data = JSON.parse(res);
                                if (data.state) {
                                    tips(data.message);
                                    userInfo.level = expInfo[expIndex].level;
                                    var allInfo = gJson('allInfo');
                                    allInfo.userInfo[0] = userInfo;
                                    sJson('allInfo', allInfo);
                                }
                            })
                    }
                    break;
                }
            }
        }


        var updateExp = expInfo[level - 1].exp;

        var fixLayout = this.fixLayout;

        var atlas = this.headimg
            //经验值复制
        var expLabel = cc.find('status/exp/expLabel/exp', fixLayout).getComponent(cc.Label);
        expLabel.string = curExp + '/' + updateExp;

        var exppro = cc.find('status/exp', fixLayout).getComponent(cc.ProgressBar);
        exppro.progress = curExp / updateExp;

        //头像赋值
        var headimg = cc.find('status/head/headimg', fixLayout).getComponent(cc.Sprite);
        var headcode = userInfo.head_img;
        headimg.spriteFrame = this.headimg.getSpriteFrame(headcode);

        //昵称赋值
        var nickNameLabel = cc.find('status/nickName', fixLayout).getComponent(cc.Label);
        nickNameLabel.string = userInfo.nickname;

        //等级赋值
        var levelLabel = cc.find('status/head/level', fixLayout).getComponent(cc.Label);
        levelLabel.string = (level > 10 ? level : 0 + level) + '级';

        //ID赋值
        var id = cc.find('status/id', fixLayout).getComponent(cc.Label);
        id.string = "Id:" + userInfo.user_id;

        //金币赋值
        var goldLabel = cc.find('gold/goldLabel', fixLayout).getComponent(cc.Label);
        goldLabel.string = (farmInfo.gold.toString()).length < 2 ? '0' + farmInfo.gold : farmInfo.gold;

        //钻石赋值
        var diamondLabel = cc.find('diamond/diamondLabel', fixLayout).getComponent(cc.Label);
        diamondLabel.string = (farmInfo.diamond.toString()).length < 2 ? '0' + farmInfo.diamond : farmInfo.diamond;



        //根据农场数据开通圈
        //看门狗
        if (farmInfo.have_dog == 1) {
            cc.find('Canvas/background/dog').active = true;
        }

        // var sheds = cc.find('background/sheds'); //1-16
        var sheds = cc.find('Canvas/background/sheds'); //1-16

        for (var i = 0; i < 16; i++) {
            var shenum = 'shed' + (i + 1);
            var shed = sheds.getChildByName(shenum);
            if (farmInfo[shenum]) { //已开放
                shed.color = {
                    a: 255,
                    r: 255,
                    g: 255,
                    b: 255
                };
                shed.getChildByName('Abilities-lock').active = false;
            } else { //未开放 添加点击事件
                var lock = shed.getChildByName('Abilities-lock');
                lock.on('touchstart', function(i, userInfo, atlas, _this) {

                    var level = cc.find('Canvas/fixItem/fixLayout/status/head/level').getComponent(cc.Label).string.match(/\d+/ig)[0];

                    if (level >= i + 1) {
                        ajax(
                            urlPrefix + 'user/user1018.do',
                            'user_id=' + userInfo.user_id,
                            function(res) {
                                var data = JSON.parse(res);
                                if (data.state) {
                                    //获得上级好友，渲染窗口

                                    var friendUpdate = cc.instantiate(friendUpdatePrefab);
                                    var friendItem = cc.find('sj/7/9', friendUpdate);

                                    var curFriend;

                                    if (data.data.length == 0) {
                                        curFriend = {

                                            head_img: "50104",
                                            is_login: "1",
                                            level: "16",
                                            nickname: "钱多多",
                                            user_id: "system"
                                        };
                                    } else if (data.data.length == 1) {
                                        curFriend = data.data[0];
                                        if (curFriend.is_login != 1) {
                                            curFriend = {

                                                head_img: "50104",
                                                is_login: "1",
                                                level: "16",
                                                nickname: "钱多多",
                                                user_id: "system"
                                            };
                                        }
                                    } else if (data.data.length == 2) {
                                        if (data.data[0].top_id == data.data[1].user_id) {
                                            var top = data.data[0];
                                            var top_top = data.data[1];

                                        } else {
                                            var top = data.data[1];
                                            var top_top = data.data[0];
                                        }

                                        if (top.is_login == 1) {
                                            curFriend = top;
                                        } else if (top.is_login == 0 && top_top.is_login == 1) {
                                            curFriend = top_top;
                                        } else if (top.is_login == 0 && top_top.is_login == 0) {
                                            curFriend = {

                                                head_img: "50104",
                                                is_login: "1",
                                                level: "16",
                                                nickname: "钱多多",
                                                user_id: "system"
                                            };
                                        }

                                    }

                                    var gold = gJson('allInfo').expInfo[i].gold;
                                    friendUpdate.getChildByName('intro').getComponent(cc.Label).string = '请好友帮忙开通' + (i + 1) + '号栏,花费' + gold + '金币';
                                    friendItem.getChildByName('name').getComponent(cc.Label).string = curFriend.nickname;
                                    friendItem.getChildByName('level').getComponent(cc.Label).string = '等级：' + curFriend.level;
                                    friendItem.getChildByName('headimg').getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(curFriend.head_img);

                                    friendItem.getChildByName('send').on('touchstart', function(send_id, i, event) {
                                        var user_id = gJson('allInfo').userInfo[0].user_id;
                                        var gold = gJson('allInfo').expInfo[i].gold;

                                        if (send_id == 'system') {

                                            ajax(
                                                urlPrefix + 'farm/farm1001.do',
                                                'user_id=' + user_id +
                                                '&shed_id=' + (i + 1) +
                                                '&gold=' + gold +
                                                userToken(),
                                                function(res) {
                                                    var data = JSON.parse(res);
                                                    if (data.state) {
                                                        tips('您的好友钱多多帮您开通了' + (i + 1) + '号栏！');
                                                        updateGoldAndDia();
                                                        cc.find('Canvas/background/sheds/shed' + (i + 1) + '/Abilities-lock').active = false;
                                                        cc.find('Canvas/background/sheds/shed' + (i + 1)).color = {
                                                            a: 255,
                                                            r: 255,
                                                            g: 255,
                                                            b: 255
                                                        };
                                                    } else {
                                                        tips(data.message);
                                                    }
                                                    friendUpdate.destroy();
                                                })
                                            return false;
                                        } else {

                                            ajax(
                                                urlPrefix + 'farm/farm1002.do',
                                                'user_id=' + user_id +
                                                '&shed_id=' + (i + 1) +
                                                '&gold=' + gold +
                                                '&friend_id=' + send_id +
                                                userToken(),
                                                function(res) {
                                                    var data = JSON.parse(res);
                                                    if (data.state) {

                                                        tips(data.data.tip);
                                                        updateGoldAndDia();
                                                        changeExp(data.data.exp);
                                                        cc.find('Canvas/background/sheds/shed' + (i + 1) + '/Abilities-lock').active = false;
                                                        cc.find('Canvas/background/sheds/shed' + (i + 1)).color = {
                                                            a: 255,
                                                            r: 255,
                                                            g: 255,
                                                            b: 255
                                                        };
                                                    } else {
                                                        tips(data.message);
                                                    }
                                                    friendUpdate.destroy();
                                                })

                                        }
                                        var wsMessage = {
                                            sendId: user_id,
                                            acceptId: send_id,
                                            target: 2,
                                            type: 1,
                                            data: {
                                                shed_id: i + 1
                                            }
                                        }
                                        WS.ob.send(JSON.stringify(wsMessage));


                                    }.bind({}, curFriend.user_id, i));
                                    friendUpdate.parent = cc.find('Canvas');


                                    //friendUpdate.active = true;
                                } else {
                                    tips(data.message);
                                }

                            }
                        )
                    } else {
                        tips('需要' + (i + 1) + '级开放！');
                    }
                }.bind({}, i, userInfo, atlas, _this))
            }
        }
        var animals = allInfo.animals;
        //把动物加载到圈里去

        if (animalInfo.length == 0) {
            cc.find('loading').active = false;
        } else {
            for (var k = 1; k < animals.length; k++) {

                for (var j = 0; j < animals[k].length; j++) {
                    var animalItem = animals[k][j];
                    var animalShedid = k;
                    var p = position[j];
                    var item = cc.instantiate(animalPrefab);
                    var animalCode = animalItem.animal_code;
                    item.data = animalItem;
                    item.curTime = curTime;


                    cc.loader.loadRes("common/pet/" + animalCode, sp.SkeletonData, function(item, animalShedid, p, k, j, err, SkeletonData) {
                        var animalJson = item.getChildByName('animalJson');
                        animalJson.getComponent(sp.Skeleton).skeletonData = SkeletonData;
                        animalJson.getComponent(sp.Skeleton).animation = 'habitat_eat';
                        item.position = p;
                        item.parent = cc.find('Canvas/background/sheds/shed' + animalShedid);

                        allLoadNum--;

                        if (allLoadNum <= 0) {
                            cc.find('loading').active = false;
                        }

                    }.bind({}, item, animalShedid, p, k, j));


                }

            }
        }


    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});