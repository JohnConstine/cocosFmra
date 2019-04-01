cc.Class({
    extends: cc.Component,

    properties: {
        editbox: {
            default: null,
            type: cc.EditBox
        },
        explabel: {
            default: null,
            type: cc.Label
        },
        changeExp: '',

    },
    onLoad: function() {
        // body...
    },

    // use this for initialization
    onEnable: function() {

        var _this = this;

        ajax(
                urlPrefix + 'farm/farm1007.do',
            'user_id=' + getUserInfo().user_id,
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var animals = data.data[0];

                    for (var i = 16; i > 0; i--) {
                        var shenum = 'shed' + i;
                        if (animals[shenum]) {
                            ajax(
                                urlPrefix + 'farm/farm1013.do',
                                'level=' + i,
                                function(res) {
                                   
                                    var data = JSON.parse(res);
                                    if (data.state) {
                                        _this.changeExp = data.data;
                                        cc.find('7/change', _this.node).getComponent(cc.Label).string = '100金币=' + data.data * 100 + '经验值';
                                    }
                                })
                            return;
                        }
                    }

                }
            },1)
    },
    edit: function() {
        var editValue = this.editbox.string;
        var explabel = this.explabel;
        var nowGold = curGold().string;
        if (new RegExp('\\D').test(editValue)) {
            tips('非法输入！');
            this.editbox.string='';
            this.explabel.string=0;
            return;
        }
        if (editValue*100 > nowGold) {
            tips('没有这么多金币！');
            this.editbox.string='';
            this.explabel.string=0;
           
            return;
        }


        explabel.string = parseInt(editValue * (this.changeExp)*100);


    },
    blur: function() {
        var editValue = this.editbox.string;
        var explabel = this.explabel;
        

    },

    submit: function(event) {
         var target=event.target;
        target.getComponent(cc.Button).interactable=false;
        
        var _this=this;
        var gold=this.editbox.string*100;

        ajax(
            urlPrefix + 'farm/farm1011.do',
            'user_id=' + getUserInfo().user_id +
            '&gold=' + gold +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    updateGoldAndDia();
                    changeExp(gold*_this.changeExp);
                    tips('兑换成功！');
                }else{
                    tips(data.message)
                }
                target.getComponent(cc.Button).interactable=true;
            })
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});