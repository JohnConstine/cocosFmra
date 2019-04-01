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
        animalItem: {
            default: null,
            type: cc.Prefab
        },
        animalItem_gold :{
            default: null,
            type: cc.Prefab
        },
        propItem: {
            default: null,
            type: cc.Prefab
        },
        altas1: {
            default: null,
            type: cc.SpriteAtlas
        },
        altas2: {
            default: null,
            type: cc.SpriteAtlas
        },
        altas3: {
            default: null,
            type: cc.SpriteAtlas
        },
        type: 'animal',
        flash: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onEnable: function() {
        var type = this.type;

        var _this = this.node;
        var level = gJson('allInfo').userInfo[0].level;
        var atlas1 = this.altas1;
        var atlas2 = this.altas2;
        var atlas3 = this.altas3;
        var flash = this.flash;
        if (type == 'animal') {
            var animalItem =is_gold?this.animalItem_gold:this.animalItem;
            var level = getUserInfo().level;
            var localAnimalState = gJson('localAnimalState');

            if (!localAnimalState || localAnimalState != animalState) { //如果没有本地记录就获取新的
                
                ajax(urlPrefix + 'animal/animal1001.do',
                    '',
                    function(res) {
                        var data = JSON.parse(res);
                        if (data.state) {
                            sJson('localAnimalState', animalState);
                            sJson('localAnimalData', data.data);
                            for (var i = 0; i < level; i++) {
                                var TanimalItem = cc.instantiate(animalItem);

                                var sprite = atlas1.getSpriteFrame(data.data[i].animal_code);
                                if (!sprite) {
                                    sprite = atlas2.getSpriteFrame(data.data[i].animal_code);
                                }
                                if (!sprite) {
                                    sprite = atlas3.getSpriteFrame(data.data[i].animal_code);
                                }

                                cc.find('avatar/headImg', TanimalItem).getComponent(cc.Sprite).spriteFrame = sprite;
                                //console.log(atlas.getSpriteFrame(data.data[i].animal_code));
                                cc.find('exp', TanimalItem).getComponent(cc.Label).string = '经验:' + data.data[i].animal_exp;
                                cc.find('isground', TanimalItem).getComponent(cc.Label).string = data.data[i].is_groud;
                                cc.find('ID', TanimalItem).getComponent(cc.Label).string = data.data[i].animal_id;
                                cc.find('name', TanimalItem).getComponent(cc.Label).string = data.data[i].animal_name;
                                cc.find('level', TanimalItem).getComponent(cc.Label).string = data.data[i].is_groud + '级宠物';
                                cc.find('price2/diamond', TanimalItem).getComponent(cc.Label).string = is_gold?data.data[i].animal_gold_price:data.data[i].animal_price;
                                cc.find('born_time/time', TanimalItem).getComponent(cc.Label).string = data.data[i].animal_protime + '小时';
                                cc.find('worth/worthtime', TanimalItem).getComponent(cc.Label).string = data.data[i].animal_totalpro;
                                cc.find('allcount/count', TanimalItem).getComponent(cc.Label).string = data.data[i].animal_proaccount + '次';
                                cc.find('introduce/intro', TanimalItem).getComponent(cc.Label).string = '介绍:' + data.data[i].animal_introduce;
                                TanimalItem.data = data.data[i];
                                TanimalItem.parent = _this;

                            }

                        }
                    }
                );
            } else {
                var animalData = gJson('localAnimalData')
                for (var i = 0; i < level; i++) {
                    var TanimalItem = cc.instantiate(animalItem);

                    var sprite = atlas1.getSpriteFrame(animalData[i].animal_code);
                    if (!sprite) {
                        sprite = atlas2.getSpriteFrame(animalData[i].animal_code);
                    }
                    if (!sprite) {
                        sprite = atlas3.getSpriteFrame(animalData[i].animal_code);
                    }

                    cc.find('avatar/headImg', TanimalItem).getComponent(cc.Sprite).spriteFrame = sprite;
                    //console.log(atlas.getSpriteFrame(animalData[i].animal_code));
                    cc.find('exp', TanimalItem).getComponent(cc.Label).string = '经验:' + animalData[i].animal_exp;
                    cc.find('isground', TanimalItem).getComponent(cc.Label).string = animalData[i].is_groud;
                    cc.find('ID', TanimalItem).getComponent(cc.Label).string = animalData[i].animal_id;
                    cc.find('name', TanimalItem).getComponent(cc.Label).string = animalData[i].animal_name;
                    cc.find('level', TanimalItem).getComponent(cc.Label).string = animalData[i].is_groud + '级宠物';
                    cc.find('price2/diamond', TanimalItem).getComponent(cc.Label).string =is_gold?animalData[i].animal_gold_price: animalData[i].animal_price;
                    cc.find('born_time/time', TanimalItem).getComponent(cc.Label).string = animalData[i].animal_protime + '小时';
                    cc.find('worth/worthtime', TanimalItem).getComponent(cc.Label).string = animalData[i].animal_totalpro;
                    cc.find('allcount/count', TanimalItem).getComponent(cc.Label).string = animalData[i].animal_proaccount + '次';
                    cc.find('introduce/intro', TanimalItem).getComponent(cc.Label).string = '介绍:' + animalData[i].animal_introduce;
                    TanimalItem.data = animalData[i];
                    TanimalItem.parent = _this;

                }
            }

        } else if (type == 'prop') {
            var propItem = this.propItem;
            var localPropState = gJson('localPropState');
            if (!localPropState || localPropState != propState) {
                ajax(
                    urlPrefix + 'prop/prop1001.do',
                    '',
                    function(res) {
                        var data = JSON.parse(res);
                        sJson('localPropState', propState);
                        sJson('localPropData', data.data);
                        if (data.state) {
                            for (var i = 0; i < data.data.length; i++) {
                                var TpropItem = cc.instantiate(propItem);

                                TpropItem.buyNum = 1;


                                var sprite = atlas1.getSpriteFrame(data.data[i].prop_code);
                                if (!sprite) {
                                    sprite = atlas2.getSpriteFrame(data.data[i].prop_code);
                                }
                                if (!sprite) {
                                    sprite = atlas3.getSpriteFrame(data.data[i].prop_code);
                                }
                                if (!sprite) {
                                    sprite = flash.getSpriteFrame(data.data[i].prop_code);
                                }

                                cc.find('headImg', TpropItem).getComponent(cc.Sprite).spriteFrame = sprite;
                                cc.find('ID', TpropItem).getComponent(cc.Label).string = data.data[i].id;
                                cc.find('name', TpropItem).getComponent(cc.Label).string = data.data[i].prop_name;
                                cc.find('price2/diamond', TpropItem).getComponent(cc.Label).string = data.data[i].prop_price;
                                cc.find('intro', TpropItem).getComponent(cc.Label).string = '介绍:' + data.data[i].prop_introduce;

                                if (data.data[i].id == 2) {
                                    cc.find('number', TpropItem).active = false;
                                } else {
                                    var add = cc.find('number/add', TpropItem);
                                    var del = cc.find('number/del', TpropItem);
                                    var num = cc.find('number/num', TpropItem);

                                    add.on('touchstart', function(TpropItem, num) {
                                        TpropItem.buyNum++;
                                        num.getComponent(cc.Label).string = TpropItem.buyNum;
                                    }.bind({}, TpropItem, num));

                                    del.on('touchstart', function(TpropItem, num) {
                                        TpropItem.buyNum--;
                                        if (TpropItem.buyNum < 1) TpropItem.buyNum = 1;
                                        num.getComponent(cc.Label).string = TpropItem.buyNum;
                                    }.bind({}, TpropItem, num));
                                }

                                // all.on('touchstart', function() {
                                //     this.num = haveNum;
                                //     num.getComponent(cc.Label).string = this.num;
                                //     total.getComponent(cc.Label).string = (this.num * price).toFixed(2);

                                // }.bind(this));

                                TpropItem.data = data.data[i];
                                TpropItem.parent = _this;

                            }
                        } else {
                            tips(data.message);
                        }

                    }
                )
            } else {
                var propData = gJson('localPropData');
                for (var i = 0; i < propData.length; i++) {
                    var TpropItem = cc.instantiate(propItem);

                    TpropItem.buyNum = 1;


                    var sprite = atlas1.getSpriteFrame(propData[i].prop_code);
                    if (!sprite) {
                        sprite = atlas2.getSpriteFrame(propData[i].prop_code);
                    }
                    if (!sprite) {
                        sprite = atlas3.getSpriteFrame(propData[i].prop_code);
                    }
                    if (!sprite) {
                        sprite = flash.getSpriteFrame(propData[i].prop_code);
                    }

                    cc.find('headImg', TpropItem).getComponent(cc.Sprite).spriteFrame = sprite;
                    cc.find('ID', TpropItem).getComponent(cc.Label).string = propData[i].id;
                    cc.find('name', TpropItem).getComponent(cc.Label).string = propData[i].prop_name;
                    cc.find('price2/diamond', TpropItem).getComponent(cc.Label).string = propData[i].prop_price;
                    cc.find('intro', TpropItem).getComponent(cc.Label).string = '介绍:' + propData[i].prop_introduce;

                    if (propData[i].id == 2) {
                        cc.find('number', TpropItem).active = false;
                    } else {
                        var add = cc.find('number/add', TpropItem);
                        var del = cc.find('number/del', TpropItem);
                        var num = cc.find('number/num', TpropItem);

                        add.on('touchstart', function(TpropItem, num) {
                            TpropItem.buyNum++;
                            num.getComponent(cc.Label).string = TpropItem.buyNum;
                        }.bind({}, TpropItem, num));

                        del.on('touchstart', function(TpropItem, num) {
                            TpropItem.buyNum--;
                            if (TpropItem.buyNum < 1) TpropItem.buyNum = 1;
                            num.getComponent(cc.Label).string = TpropItem.buyNum;
                        }.bind({}, TpropItem, num));
                    }

                    // all.on('touchstart', function() {
                    //     this.num = haveNum;
                    //     num.getComponent(cc.Label).string = this.num;
                    //     total.getComponent(cc.Label).string = (this.num * price).toFixed(2);

                    // }.bind(this));

                    TpropItem.data = propData[i];
                    TpropItem.parent = _this;

                }
            }

        }
    },
    onDisable: function() {
        this.node.removeAllChildren();
    },
    reinit: function() {
        this.onDisable();
        this.onEnable();
    },
    changeTab: function(event, cus) {
        var target = event.target;
        target.color = {
            r: 255,
            g: 255,
            b: 255,
            a: 255
        };
        if (cus == 'prop') {
            var animal = target.parent.getChildByName('animal');
            animal.color = {
                r: 204,
                g: 204,
                b: 204,
                a: 255
            };
        } else {
            var animal = target.parent.getChildByName('prop');
            animal.color = {
                r: 204,
                g: 204,
                b: 204,
                a: 255
            };
        }

        this.type = cus;
        this.reinit();
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});