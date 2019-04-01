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
        num: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function() {
        var _this = this;


        var data = this.node.data;

        var cub_num = data.cub_num;
        var create_date = data.create_date;
        var animal_protime = data.animal_protime;
        var order_id = data.id;
        var animal_id = data.animal_id;
        var curTime = this.node.curTime;

        var item = this.node;
        var animalItem = data;
        var animalJson = this.node.getChildByName('animalJson');
        var time = animalJson.getChildByName('time');
        var shouhuo = animalJson.getChildByName('shouhuo');

        //var label = time.getComponent(cc.Label);
        var label = cc.find('animalJson/info/bg/time/timenum', item).getComponent(cc.Label);
        var produce_count_label = cc.find('animalJson/info/bg/num', item).getComponent(cc.Label);
        produce_count_label.string = '已生产\n' + animalItem.produce_count + '次';



        /*********
        1.倒计时 2.生产  3.收获  4.倒计时

        倒计时：期间可以使用道具，添加infotoggle点击事件 ，倒计时到0时，取消点击事件，触发生产接口

        生产：触发ajax接口，成功后把显示可收获字样，添加单次收获点击事件

        收获：收获后，添加生产次数，添加倒计时；
        ********/
        if (cub_num) { //如果有幼崽，说明以完成生产，点击即收获，收获后如果未达最大生产次数，重置倒计时，并消除点击收获，增加点击出现道具


            shouhuo.active = true;
            shouhuo.getComponent(cc.Label).string = '可收获' + cub_num + '只';

            item.once('touchstart', function(item, animalItem, event) {

                // var target = event.target;

                // var order_id = animalItem.id;
                // var product_num = animalItem.product_num;
                // var animal_id = animalItem.animal_id;
                // var produce_count = animalItem.produce_count;
                // var animal_proaccount = animalItem.animal_proaccount;
                // var animal_protime = animalItem.animal_protime;



                // ajax(
                //     urlPrefix + 'warehouse/warehouse1003.do',
                //     'order_id=' + order_id +
                //     '&user_id=' + getUserInfo().user_id +
                //     '&product_id=' + animal_id +
                //     userToken(),
                //     function(res) {

                //         var data = JSON.parse(res);
                //         if (data.state) {
                //             if (produce_count >= animal_proaccount - 1) {
                //                 item.destroy();
                //                 tips('动物达到生产次数,已死亡!');
                //             } else {

                //                 var schetime = animal_protime * 3600;
                //                 animalItem.produce_count += 1;
                //                 produce_count_label.string = '已生产\n' + animalItem.produce_count + '次';
                //                 shouhuo.active = false;
                //                 var timer = setInterval(function(label) {
                //                     var hours = Math.floor(schetime / (3600));
                //                     hours = hours >= 10 ? hours : '0' + hours;
                //                     var minutes = Math.floor(schetime / (60)) - (hours * 60);
                //                     minutes = minutes >= 10 ? minutes : '0' + minutes;
                //                     var second = Math.floor(schetime) - (hours * 60 * 60) - (minutes * 60);
                //                     second = second >= 10 ? second : '0' + second;
                //                     label.getComponent(cc.Label).string = hours + ':' + minutes + ':' + second;
                //                     schetime--;
                //                 }.bind({}, label), 1000);
                //                 tips(data.message);
                //             }

                //         } else {
                //             tips(data.message);
                //         }
                //         _this.node.on('touchstart', _this.propShow);
                //     }
                // )

                _this.toShouhuo();

            }.bind({}, item, animalItem));


        } else { //如果没有幼崽，说明还未生产，1，添加倒计时，倒计时为0是时自动生产，2.添加点击收获，收获后如果未达最大生产次数，重置倒计时，3.并消除点击收获，增加点击出现道具  4.点击道具后出发ajax接口，并减少倒计时一小时
            //切换是否显示道具
            this.node.on('touchstart', this.propShow);
            var schetime = this.schetime = (create_date + animal_protime * 3600 * 1000 - curTime) / 1000;

            this.addInterval(label, shouhuo);
            //1，添加倒计时，倒计时为0是时自动生产
            // var timer = setInterval(function(label) {

            //     var hours = Math.floor(schetime / (3600));
            //     hours = hours >= 10 ? hours : '0' + hours;
            //     var minutes = Math.floor(schetime / (60)) - (hours * 60);
            //     minutes = minutes >= 10 ? minutes : '0' + minutes;
            //     var second = Math.floor(schetime) - (hours * 60 * 60) - (minutes * 60);
            //     second = second >= 10 ? second : '0' + second;
            //     label.string = hours + ':' + minutes + ':' + second;

            //     schetime--;
            //     if (schetime <= 0) {
            //         _this.node.off('touchstart', _this.propShow); //倒计时为0后，去掉面板点击事件
            //         clearInterval(timer);
            //         ajax(
            //             urlPrefix + 'animal/animal1005.do',
            //             'order_id=' + order_id +
            //             '&user_id=' + getUserInfo().user_id +
            //             userToken(),
            //             function(res) {
            //                 var data = JSON.parse(res);
            //                 if (data.state) {
            //                     time.active = false;
            //                     shouhuo.active = true;
            //                     shouhuo.getComponent(cc.Label).string = '可收获';

            //                     //2.添加点击收获，收获后如果未达最大生产次数，重置倒计时
            //                     item.once('touchstart', _this.toShouhuo);

            //                 } else {
            //                     tips(data.message);
            //                 }
            //             }
            //         );
            //     }
            // }.bind({}, label), 1000);


        }
        cc.game.on(cc.game.EVENT_SHOW, function() {
            setTimeout(function () {
                _this.schetime = (create_date + animal_protime * 3600 * 1000 - returnCurTime) / 1000;
            },100)
        });


    },
    propShow: function() {

        if (curOpenAnimalNode == null || curOpenAnimalNode.data == null) { //第一次打开，赋值order_id
            curOpenAnimalNode = this;
            cc.find('animalJson/info', this).active = !cc.find('animalJson/info', this).active;
        } else {

            if (curOpenAnimalNode.data.id == this.data.id) { //点击自己，值不变，toggle
                cc.find('animalJson/info', this).active = !cc.find('animalJson/info', this).active;
            } else { //点击别的;

                cc.find('animalJson/info', curOpenAnimalNode).active = false;
                cc.find('animalJson/info', this).active = true;
                curOpenAnimalNode = this;
            }
        }

        //cc.find('animalJson/prop', this).active = !cc.find('animalJson/prop', this).active;
        // cc.find('animalJson/info', this).active = !cc.find('animalJson/info', this).active;
    },
    addInterval: function(label, shouhuo) {
        var _this = this;
        var order_id = this.node.data.id;
        var item = this.node;
        

        //1，添加倒计时，倒计时为0是时自动生产
        var timer = setInterval(function(label) {

            var hours = Math.floor(_this.schetime / (3600));
            hours = hours >= 10 ? hours : '0' + hours;
            var minutes = Math.floor(_this.schetime / (60)) - (hours * 60);
            minutes = minutes >= 10 ? minutes : '0' + minutes;
            var second = Math.floor(_this.schetime) - (hours * 60 * 60) - (minutes * 60);
            second = second >= 10 ? second : '0' + second;
            label.string = hours + ':' + minutes + ':' + second;

            _this.schetime--;
            if (_this.schetime <= 0) {
                cc.find('animalJson/info', item).active = false;
                _this.node.off('touchstart', _this.propShow); //倒计时为0后，去掉面板点击事件
                clearInterval(timer);
                ajax(
                    urlPrefix + 'animal/animal1005.do',
                    'order_id=' + order_id +
                    '&user_id=' + getUserInfo().user_id +
                    userToken(),
                    function(res) {
                        var data = JSON.parse(res);
                        if (data.state) {
                            _this.node.data.produce_count += 1;
                            shouhuo.active = true;
                            shouhuo.getComponent(cc.Label).string = '可收获';

                            //2.添加点击收获，收获后如果未达最大生产次数，重置倒计时
                            item.once('touchstart', _this.toShouhuo, _this);

                        } else {
                            tips(data.message);
                        }
                    }
                );
            }
        }.bind({}, label), 1000);
    },
    toShouhuo: function() { //收获动作
        var _this = this;

        var animalItem = this.node.data
        var order_id = animalItem.id;
        var product_num = animalItem.product_num;
        var animal_id = animalItem.animal_id;
        var produce_count = animalItem.produce_count;
        var animal_proaccount = animalItem.animal_proaccount;
        var animal_protime = animalItem.animal_protime;



        var item = this.node;

        var animalJson = item.getChildByName('animalJson');

        var shouhuo = animalJson.getChildByName('shouhuo');

        var label = cc.find('animalJson/info/bg/time/timenum', item).getComponent(cc.Label);

        var produce_count_label = cc.find('animalJson/info/bg/num', item).getComponent(cc.Label);


        ajax(
            urlPrefix + 'warehouse/warehouse1003.do',
            'order_id=' + order_id +
            '&user_id=' + getUserInfo().user_id +
            '&product_id=' + animal_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                   
                    console.log(animalItem.produce_count)
                    if (animalItem.produce_count >= animal_proaccount) {
                        data.message += '\n动物达到生产次数,已死亡!';
                        item.destroy();
                        var allInfo=gJson('allInfo');
                        var animals=allInfo.animals;
                        for(var i=0;i<animals[_this.node.data.shed_id].length;i++){
                            if(animals[_this.node.data.shed_id][i].id==animalItem.id){
                                animals[_this.node.data.shed_id][i]='';
                                break;
                            }
                        }
                       
                        allInfo.animals=animals;

                        sJson('allInfo',allInfo);
                    } else {
                        produce_count_label.string = '已生产\n' + animalItem.produce_count + '次';
                        item.on('touchstart', _this.propShow);
                        _this.addInterval(label, shouhuo);
                        _this.schetime = animal_protime * 3600;
                        shouhuo.active = false;
                    }

                }
                tips(data.message);


            }
        )
    },

    useFlash: function() {

        var _this = this;

        var order_id = this.node.data.id;


        if (new RegExp('\\D').test(_this.num.string)) {
            tips('非法输入！');
        }

        ajax(
            urlPrefix + 'prop/prop1005.do',
            'user_id=' + getUserInfo().user_id +
            '&prop_id=1' +
            '&prop_num=' + _this.num.string +
            '&order_id=' + order_id +
            userToken(),
            function(res) {

                var data = JSON.parse(res);
                if (data.state) {
                    _this.schetime -= _this.num.string * 3600;
                    tips('使用成功！');
                } else {
                    tips(data.message);
                }
            })

    },
    checkUseNum: function(event) {
        var hours = Math.ceil(this.schetime / 3600);
        if (event > hours) {
            this.num.string = hours;
        }

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});