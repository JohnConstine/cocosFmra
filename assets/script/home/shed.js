
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
        animalPrefab: {
            default: null,
            type: cc.Prefab,
        },

    },

    // use this for initialization
    onLoad: function() {
        var _this = this.node;
        var animalPrefab = this.animalPrefab;
        var shednum = _this.name.substring(4);
        var position = c.p;
        var animal = cc.find('animal', _this).children;
       

        setTimeout(function() {



            var animals = gJson('allInfo').animals;



            for (var i = 0; i < animals[shednum].length; i++) {

               

                    var animalJson = animal[i].getChildByName('cow1');

                    animalJson.active = true;
                    var animalItem = animals[shednum][i];
                    var animal_code = animalItem.animal_code;
                    var create_date = animalItem.create_date;
                    var animal_protime = animalItem.animal_protime;
                    var order_id = animalItem.id;
                    var cub_num = animalItem.cub_num;
                    var time = animalJson.getChildByName('time');
                    var shouhuo = animalJson.getChildByName('shouhuo');
                    var label = time.getComponent(cc.Label);
                    //var create_date=Date.parse(new Date()); 
                    animalJson.getComponent(sp.Skeleton).animation = c.randomAnim();   

                    /***********************************/
                    if (cub_num) {
                        time.active = false;
                        shouhuo.active = true;
                        shouhuo.getComponent(cc.Label).string = '可收获';
                        console.log(animalJson);
                        animal[i].on('touchstart', function(event) {
                            console.log(123);
                        },this )
                    } else {
                        var schetime = (create_date + animal_protime * 3600 * 1000 - curTime) / 1000;

                        var timer = setInterval(function(label,animalJson) {

                            var hours = Math.floor(schetime / (3600));
                            hours = hours >= 10 ? hours : '0' + hours;
                            var minutes = Math.floor(schetime / (60)) - (hours * 60);
                            minutes = minutes >= 10 ? minutes : '0' + minutes;
                            var second = Math.floor(schetime) - (hours * 60 * 60) - (minutes * 60);
                            second = second >= 10 ? second : '0' + second;
                            label.string = hours + ':' + minutes + ':' + second;
                            schetime--;
                            if (schetime <= 0) {
                                clearInterval(timer);
                                ajax(
                                    urlPrefix + 'animal/animal1005.do',
                                    'order_id=' + order_id + '&cub_num=20&user_id=' + getUserInfo().user_id + '&user_token=' + getUserInfo().user_token,
                                    function(res) {
                                        var data = JSON.parse(res);
                                        if (data.state) {
                                            time.active = false;
                                            shouhuo.active = true;
                                            shouhuo.getComponent(cc.Label).string = '可收获';
                                            
                                            animalJson.on('touchstart',function () {
                                                console.log(123);
                                            })
                                        }
                                    }
                                )


                            }
                        }.bind({}, label,animalJson), 1000);
                    }
              

                   if(shednum==16) {
                     cc.find('loading').active=false;
                   }

            }
        }, 1000)
    },
    keshouhuo:function () {
       console.log(msg)
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});