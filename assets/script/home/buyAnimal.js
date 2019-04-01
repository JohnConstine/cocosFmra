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

        ///user_id，animal_id，animal_num，order_total， animal_code，shed_id
        animalPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function() {

    },

    buyAnimalByDiamond: function(event) {

        var button = event.target;


        button.getComponent(cc.Button).interactable = false;

        var _this = this;
        var animalPrefab = this.animalPrefab;
        var userInfo = gJson('allInfo').userInfo[0];
        var user_id = userInfo.user_id;
        var shed_id = cc.find('isground', this.node).getComponent(cc.Label).string;
        var exp = cc.find('exp', this.node).getComponent(cc.Label).string;
        //var changeExp = this.changeExp;
        var animal_num = 1;
        var animal_id = cc.find('ID', this.node).getComponent(cc.Label).string;
        var animal_protime = parseInt(cc.find('born_time/time', this.node).getComponent(cc.Label).string);
        var animals = gJson('allInfo').animals;


        var order_total = cc.find('price2/diamond', this.node).getComponent(cc.Label).string;
        var animal_code = cc.find('avatar/headImg', this.node).getComponent(cc.Sprite).spriteFrame.name;



        var thisShedNum = 0;
        for (var i = 0; i < animals[shed_id].length; i++) {
            if (animals[shed_id][i]) {
                thisShedNum++;
            }
        }
        if (thisShedNum >= 4) {
           
            tips('这个圈已经满了！装不下啦');
            return;
        }

        ajax(
            urlPrefix + 'animal/animal1002.do',
            'user_id=' + user_id +
            '&animal_id=' + animal_id +
            '&animal_num=1' +
            '&order_total=' + order_total +
            '&animal_code=' + animal_code +
            '&shed_id=' + shed_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);

                if (data.state) {
                    tips(data.message);
                    //封装order对象
                    var order = {
                        animal_code: animal_code,
                        animal_id: animal_id,
                        animal_num: 1,
                        animal_proaccount: 8,
                        animal_protime: 48,
                        animal_totalpro: 378,
                        buy_date: null,
                        can_steal: 0,
                        create_date: data.data.time,
                        cub_num: 0,
                        id: data.data.id,
                        is_dead: 0,
                        order_total: order_total,
                        order_total_gold: 0,
                        produce_count: 0,
                        shed_id: 1,
                        user_id: 15745511,
                    };

                    //扣除钻石
                    updateGoldAndDia();

                    //在农场内添加动物
                    var animalJson = cc.instantiate(animalPrefab);
                    animalJson.data = order;
                    animalJson.curTime = data.data.time;
                    cc.loader.loadRes("common/pet/" + animal_code, sp.SkeletonData, function(animalJson, err, SkeletonData) {
                        animalJson.getChildByName('animalJson').getComponent(sp.Skeleton).skeletonData = SkeletonData;
                        animalJson.getChildByName('animalJson').getComponent(sp.Skeleton).animation = 'habitat_eat';
                    }.bind({}, animalJson));
                    var hasAdd = true;
                    var nowHave = 0;
                    for (var i = 0; i < animals[shed_id].length; i++) {
                        if (!animals[shed_id][i]) { //这个槽存在但是是空字符串，可以放进去
                            animalJson.position = shedPosition[i];
                            animals[shed_id][i] = order;
                            hasAdd = false;
                            break;
                        } else { //这个槽存在，但是已经有了
                            nowHave++;
                        }
                    }

                    if (hasAdd && nowHave < 4) {
                        animalJson.position = shedPosition[nowHave];
                        animals[shed_id][nowHave] = order;

                    }

                    ; //增加长度

                    var allInfo = gJson('allInfo');
                    allInfo.animals = animals;
                    sJson('allInfo', allInfo);


                    animalJson.parent = cc.find('Canvas/background/sheds/shed' + shed_id);

                    changeExp(exp.substring(3));

                    if (userInfo.referee_id != null && userInfo.referee_id.toString().length == 8) {

                        var wsMessage = {
                            sendId: user_id,
                            acceptId: userInfo.referee_id,
                            target: 4,
                            type: 1,
                            data: {
                                shed_id: 1
                            }
                        }
                        WS.ob.send(JSON.stringify(wsMessage));
                    }
                } else {
                    tips(data.message);
                }
                button.getComponent(cc.Button).interactable = true;
                
            }
        );


    },
    buyAnimalByGold: function(event) {

        var button = event.target;


        button.getComponent(cc.Button).interactable = false;

        var _this = this;
        var animalPrefab = this.animalPrefab;
        var userInfo = gJson('allInfo').userInfo[0];
        var user_id = userInfo.user_id;
        var shed_id = cc.find('isground', this.node).getComponent(cc.Label).string;
        var exp = cc.find('exp', this.node).getComponent(cc.Label).string;
        //var changeExp = this.changeExp;
        console.log(shed_id);
        var animal_num = 1;
        var animal_id = cc.find('ID', this.node).getComponent(cc.Label).string;
        var animal_protime = parseInt(cc.find('born_time/time', this.node).getComponent(cc.Label).string);
        var animals = gJson('allInfo').animals;


        var order_total_gold = cc.find('price2/diamond', this.node).getComponent(cc.Label).string;
        var animal_code = cc.find('avatar/headImg', this.node).getComponent(cc.Sprite).spriteFrame.name;


        if (animals[shed_id].length >= 4) {
            tips('这个圈已经满了！装不下啦');

            return;
        }


        ajax(
            urlPrefix + 'animal/animal1004.do',
            'user_id=' + user_id +
            '&animal_id=' + animal_id +
            '&animal_num=1' +
            '&order_total_gold=' + order_total_gold +
            '&animal_code=' + animal_code +
            '&shed_id=' + shed_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);

                if (data.state) {
                    tips(data.message);
                    //封装order对象
                    var order = {
                        animal_code: animal_code,
                        animal_id: animal_id,
                        animal_num: 1,
                        animal_proaccount: 8,
                        animal_protime: 48,
                        animal_totalpro: 378,
                        buy_date: null,
                        can_steal: 0,
                        create_date: data.data.time,
                        cub_num: 0,
                        id: data.data.id,
                        is_dead: 0,
                        order_total: 0,
                        order_total_gold: order_total_gold,
                        produce_count: 0,
                        shed_id: 1,
                        user_id: 15745511,
                    };

                    //扣除钻石
                    updateGoldAndDia();

                    //在农场内添加动物
                    var animalJson = cc.instantiate(animalPrefab);
                    animalJson.data = order;
                    animalJson.curTime = data.data.time;
                    cc.loader.loadRes("common/pet/" + animal_code, sp.SkeletonData, function(animalJson, err, SkeletonData) {
                        animalJson.getChildByName('animalJson').getComponent(sp.Skeleton).skeletonData = SkeletonData;
                        animalJson.getChildByName('animalJson').getComponent(sp.Skeleton).animation = 'habitat_eat';
                    }.bind({}, animalJson));

                    animalJson.position = shedPosition[animals[shed_id].length];
                    animals[shed_id].push(order); //增加长度

                    var allInfo = gJson('allInfo');
                    allInfo.animals = animals;
                    sJson('allInfo', allInfo);


                    animalJson.parent = cc.find('Canvas/background/sheds/shed' + shed_id);

                    changeExp(exp.substring(3));

                    if (userInfo.referee_id != null && userInfo.referee_id.toString().length == 8) {

                        var wsMessage = {
                            sendId: user_id,
                            acceptId: userInfo.referee_id,
                            target: 4,
                            type: 1,
                            data: {
                                shed_id: 1
                            }
                        }
                        WS.ob.send(JSON.stringify(wsMessage));
                    }
                } else {
                    tips(data.message);
                }
                button.getComponent(cc.Button).interactable = true;
            }
        );


    },

    buyProp: function(event) {

        var button = event.target;
        var _this = this;



        button.getComponent(cc.Button).interactable = false;

        var _this = this;
        var userInfo = gJson('allInfo').userInfo[0];
        var user_id = userInfo.user_id;
        var prop_id = this.node.data.id;
        var prop_num = this.node.buyNum;

        if (prop_id != 2) {
            ajax(
                urlPrefix + 'prop/prop1003.do',
                'user_id=' + user_id +
                '&prop_id=' + prop_id +
                '&prop_num=' + prop_num +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);

                    if (data.state) {
                        tips('购买成功！');
                        updateGoldAndDia();
                    } else {
                        tips(data.message);
                    }
                })
        } else {
            //购买看门狗
            ajax(
                urlPrefix + 'prop/prop1002.do',
                'user_id=' + user_id +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);

                    if (data.state) {
                        tips('购买成功！');
                        cc.find('Canvas/background/dog').active = true;
                        updateGoldAndDia();
                    } else {
                        tips(data.message);
                    }
                })
        }
        button.getComponent(cc.Button).interactable = true;


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});