cc.Class({
    extends: cc.Component,

    properties: {

        Prefab: cc.Prefab,
        Panel1: cc.Node,
        Panel2: cc.Node,

        page: 0,
        size: 10,
        param: 'number',
        desc: 'desc',
        scroll: cc.Node,
        backNum: cc.EditBox


    },

    // use this for initialization
    onEnable: function() {


        this.showPanel1();
    },
    showPanel1: function() {
        this.Panel1.active = true;
        this.Panel2.active = false;
    },
    showPanel2: function() {
        this.Panel1.active = false;
        this.Panel2.active = true;
        this.page = 0;
        this.size = 10;
        var content = cc.find('view/content', this.scroll);
        content.removeAllChildren();
        var prefab = this.Prefab;
        var page = this.page;
        var size = this.size;
        ajax(
            urlPrefix + 'farm/farm2014.do',
            'user_id=' + getUserInfo().user_id +
            '&page=' + page +
            '&size=' + size +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        var item = cc.instantiate(prefab);
                        item.getChildByName('id').getComponent('cc.Label').string = items[i].id;
                        item.getChildByName('user_id').getComponent('cc.Label').string = items[i].user_id;
                        item.getChildByName('num').getChildByName('text').getComponent('cc.Label').string = items[i].diamond;
                        item.getChildByName('time').getComponent('cc.Label').string = getFormatTime(items[i].create_date);
                        var text;
                        switch (items[i].is_success) {
                            case 0:
                                text = '等待中';
                                break;
                            case 1:
                                text = '成功';
                                break;
                            case 2:
                                text = '失败';
                                break;

                        }
                        item.getChildByName('state').getComponent('cc.Label').string = text;
                        item.parent = content;
                    }
                } else {
                    tips(data.message);
                }

            }
        );
        this.scroll.on('scroll-to-bottom', this.loadingMore, this);
    },
    qingling: function() {
        this.backNum.string = '';
    },
    getBack: function() {

        if(!this.backNum.string){
            tips('请输入数量');
            return;
        }
        var num = parseFloat(this.backNum.string).toFixed(2);
        
        var _this = this;


        ajax(
            urlPrefix + 'farm/farm2013.do',
            'user_id=' + getUserInfo().user_id +
            '&diamond=' + num +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    updateGoldAndDia();
                } else {
                    tips(data.message);
                }
                _this.backNum.string = '';
            }
        )


    },
    loadingMore: function() { //TODO
        this.scroll.off('scroll-to-bottom', this.loadingMore, this);
        var _this = this;
        this.page++;
        var page = this.page;
        var size = this.size;

        var prefab = this.Prefab;
        var content = cc.find('view/content', this.scroll);
       
        ajax(
            urlPrefix + 'farm/farm2014.do',
            'user_id=' + getUserInfo().user_id +
            '&page=' + page +
            '&size=' + size +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var items = data.data;
                    for (var i = 0; i < items.length; i++) {
                        var item = cc.instantiate(prefab);
                        item.getChildByName('id').getComponent('cc.Label').string = items[i].id;
                        item.getChildByName('user_id').getComponent('cc.Label').string = items[i].user_id;
                        item.getChildByName('num').getChildByName('text').getComponent('cc.Label').string = items[i].diamond;
                        item.getChildByName('time').getComponent('cc.Label').string = getFormatTime(items[i].create_date);
                        var text;
                        switch (items[i].is_success) {
                            case 0:
                                text = '等待中';
                                break;
                            case 1:
                                text = '成功';
                                break;
                            case 2:
                                text = '失败';
                                break;

                        }
                        item.getChildByName('state').getComponent('cc.Label').string = text;
                        item.parent = content;
                    }
                } else {
                    tips(data.message);
                }
                setTimeout(function () {
                   _this.scroll.on('scroll-to-bottom', _this.loadingMore, _this);
                },1000);
            }
        );
    },
    changeToSell: function() {
        this.sellPanel();
    },
    changeToBuy: function() {
        this.buyPanel();
    },
    addGoodToAuction: function() {
        cc.find('ModalCtrl').getComponent('pondModal').showWareHouse();
    },
    buyGood: function(argument) {
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1021.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    _this.guardNum = data.data.fisher[0].grampus_count;
                } else {
                    tips(data.message);
                }
            }
        )
    },
    chexiao: function() {
        console.log(this);
        var id = this.yewuId;
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1016.do',
            'user_id=' + getUserInfo().user_id +
            '&id=' + id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    _this.removeFromParent();
                } else {
                    tips(data.message);
                }
            }
        )
    },
    showGoumaiPanel: function(data) {

        this.buyAuction.getComponent('buyAuction').initAndShow(data);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});