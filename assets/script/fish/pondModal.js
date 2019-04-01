cc.Class({
    extends: cc.Component,

    properties: {
        wareHouse: cc.Node,
        friendPanel: cc.Node,
        sells: cc.Node,
        messagePanel: cc.Node,
        buyGurad: cc.Node,
        canvas: cc.Node,
        poolOpen: cc.Node,
        poolHandle: cc.Node,
        GetBack: cc.Node
    },

    // use this for initialization
    onLoad: function() {
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1018.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    _this.data = data.data;
                } else {
                    tips(data.message);
                }
            }
        );
        cc.director.preloadScene('home');
    },
    enabledSrcoll: function() {
        this.canvas.getComponent(cc.ScrollView).enabled = true;
    },
    unabledSrcoll: function() {
        this.canvas.getComponent(cc.ScrollView).enabled = false;
    },
    backToHome: function() {
        cc.find('loading').active = true;
        cc.director.loadScene('home');
    },
    showMyfriend: function() {
        this.friendPanel.active = true;
        this.unabledSrcoll();
    },
    showGetBack: function() {
        this.GetBack.active = true;
        this.unabledSrcoll();
    },
    showWareHouse: function() {

        this.wareHouse.active = true;
        this.unabledSrcoll();
        var fish = cc.find('Fish').getComponent('fish');
        fish.getWareHouserInfo();
    },
    showsells: function() {

        this.sells.active = true;
        this.unabledSrcoll();
    },
    showmessagePanel: function() {
        this.messagePanel.active = true;
        this.unabledSrcoll();
    },
    showbuyGurad: function() {
        this.buyGurad.active = true;
        this.unabledSrcoll();
    },
    showpoolOpen: function(index) {

        var poolOpen = this.poolOpen;

        var thisdata = this.data[index];

        poolOpen.getChildByName('title').getComponent(cc.Label).string = thisdata.explain;

        poolOpen.getChildByName('nameLabel').getComponent(cc.Label).string = (index + 1) + '号池';
        poolOpen.getChildByName('splitLabel').getComponent(cc.Label).string = (thisdata.split * 100).toFixed(2) + '%';
        poolOpen.getChildByName('maxLabel').getComponent(cc.Label).string = thisdata.min_volume + '-' + thisdata.max_volume;
        poolOpen.getChildByName('openPriceLabel').getComponent(cc.Label).string = thisdata.open_price;
        poolOpen.getChildByName('yes_button').poolIndex = index + 1;

        poolOpen.active = true;
        this.unabledSrcoll();
    },
    showpoolHandle: function(index) {
        var fish = cc.find('Fish').getComponent('fish');
        var has_fish_arr = fish.yewuData.fishpond;
        var thisdata = this.data[index];
        var thisFishPond;
        for (var i = 0; i < has_fish_arr.length; i++) {
            if (has_fish_arr[i].fishpond_id == index + 1) {
                thisFishPond = has_fish_arr[i];
                break;
            }
        }
        var poolHandle = this.poolHandle;

        poolHandle.getChildByName('nameLabel').getComponent(cc.Label).string = (index + 1) + '号池';
        poolHandle.getChildByName('splitLabel').getComponent(cc.Label).string = (thisdata.split * 100).toFixed(2) + '%';
        poolHandle.getChildByName('maxLabel').getComponent(cc.Label).string = thisFishPond.fish_count;
        poolHandle.getChildByName('tip').getComponent(cc.Label).string = '注意：当鱼池内鱼仔数量小于' + thisdata.min_volume + '条时不会自动增加！';
        poolHandle.getChildByName('shouHuoNum').getChildByName('edit').getComponent(cc.EditBox).string = '';
        poolHandle.getChildByName('fangYangNum').getChildByName('edit').getComponent(cc.EditBox).string = '';


        poolHandle.getChildByName('yes_button').poolIndex = index + 1;
        poolHandle.getChildByName('no_button').poolIndex = index + 1;



        poolHandle.active = true;
        this.unabledSrcoll();
    }

});