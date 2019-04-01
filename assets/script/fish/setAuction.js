cc.Class({
    extends: cc.Component,

    properties: {
        goodName: cc.Label,
        num: cc.EditBox,
        price: cc.EditBox,
        totalPrice: cc.Label,
        max: cc.Label
    },

    // use this for initialization
    onLoad: function() {

    },
    initAndShow: function(data) {
        this.data = data;

        this.goodName.string = data.fish_name;
        this.max.string = '(最多:' + data.fish_num + ')';

        this.node.active = true;
    },
    onNumChange: function(event, node) {
        if (event > this.data.fish_num) {
            tips('仓库里只有' + this.data.fish_num + '条!');
            node.string = this.data.fish_num;
            event = this.data.fish_num;
        }
        var rep=/[^0-9]/;
       
        if(rep.test(event)){

            node.string = '';
            event = 0;
            tips('数量必须为整数!');
        }
        this.sellNum = event;
        if (!this.sellPrice) {
            return;
        } else {
            this.totalPrice.string = (this.sellPrice * this.sellNum).toFixed(2);
        }
    },
    onPriceChange: function(event,node) {
        
        var sellPrice=event;

        var rep = /^\d*\.{0,1}\d{0,2}$/;

        if (!rep.test(event)) {

            node.string = '';
            
            tips('请输入正确的数量,最多两位小数!');
            return;
        }
        

        // var splitNum=sellPrice.toString().split('.');

        // if(splitNum.length>2){
        //     node.string = '';
        //     tips('请输入正确的数量!');
        //     return;
        // }

        // if(splitNum.length==2 &&splitNum[1].length>2){
        //     node.string = event.toFixed(2);
        //     tips('保留两位小数!');
        // }


        if (!sellPrice) {
            return;
        } else {
            this.sellPrice = sellPrice;
            this.totalPrice.string = (this.sellPrice * this.sellNum).toFixed(2);
        }
    },
    submit: function() {

        var _this = this;
        if(_this.sellNum<1){
            tips('数量不合法,必须为大于1的整数!');
            return;
        }

        if (this.sellNum > this.data.fish_num) {
            tips('仓库里只有' + this.data.fish_num + '条!');
            return;
        }
        if(!(_this.sellPrice&&_this.sellNum)){
            tips('数量和价格不可为空');
            return;
        }

        var rep = /^\d*\.{0,1}\d{0,2}$/;

        if (!rep.test(_this.sellPrice)) {
            tips('请输入正确的数量,最多两位小数!');
            return;
        }


        var data=this.data;
        ajax(
            urlPrefix + 'fish/fish1014.do',
            'user_id=' + getUserInfo().user_id +
            '&nickname='+getUserInfo().nickname+
            '&fish_id='+data.fish_id+
            '&goods_name='+data.fish_name+
            '&goods_code='+data.fish_code+
            '&single_price='+_this.sellPrice+
            '&number='+_this.sellNum+
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    cc.find('Fish').getComponent('fish').getWareHouserInfo();
                    _this.node.active=false;
                } else {
                    tips(data.message);
                }
            }
        )
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});