var fish = cc.Class({
    extends: cc.Component,

    properties: {
        wareHousePrefab: cc.Prefab,
        guardNum: '',
        pools: {
            default: [],
            type: cc.Node
        },
        poolClick: cc.Prefab
    },


    // use this for initialization
    onLoad: function() {
        var poolClick = this.poolClick;
        var pools = this.pools;
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1012.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    _this.guardNum = data.data.fisher[0].grampus_count;
                    if (data.data.fisher[0].grampus_count > 0) {
                        cc.find('guard').active = true;
                    }

                    var fishpond = data.data.fishpond;
                    var arr = [];
                    for (var i = 0; i < 16; i++) {
                        arr[i] = 0;
                    }
                    for (var i = 0; i < fishpond.length; i++) {
                        arr[fishpond[i].fishpond_id - 1] = 1;
                        if (fishpond[i].fish_count > 0) {
                            arr[fishpond[i].fishpond_id - 1] = 2;
                        }
                    }

                    data.data.arr = arr;
                    _this.yewuData = data.data;


                    for (let i = 0; i < pools.length; i++) {
                        var click = pools[i].getChildByName('poolClick');
                        if (arr[i]) {
                            click.getComponent(cc.Sprite).enabled = false;
                        }
                        if (arr[i] == 2) {
                            pools[i].getChildByName('poolfish').active = true;
                        }

                        click.on('touchend', function() {
                            _this.showPoolPanel(i);
                        })
                    }
                } else {
                    tips(data.message);
                }
            }
        )
    },
    updateFishPond: function() {
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1012.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var fishpond = data.data.fishpond;
                    var arr = [];
                    for (var i = 0; i < 16; i++) {
                        arr[i] = 0;
                    }
                    for (var i = 0; i < fishpond.length; i++) {
                        arr[fishpond[i].fishpond_id - 1] = 1;
                        if (fishpond[i].fish_count > 0) {
                            arr[fishpond[i].fishpond_id - 1] = 2;
                        }
                    }
                    data.data.arr = arr;
                    _this.yewuData = data.data;
                } else {
                    tips(data.message);
                }
            }
        )
    },
    getWareHouserInfo: function() {
        var _this = this;

        ajax(
            urlPrefix + 'fish/fish1008.do',
            'user_id=' + getUserInfo().user_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var modalCtrl = cc.find('ModalCtrl').getComponent('pondModal');
                    cc.find('text', modalCtrl.wareHouse).active = false;
                    cc.find('scroll/view/content', modalCtrl.wareHouse).removeAllChildren();
                    for (var i = 0; i < data.data.length; i++) {
                        var wareHouseItem = cc.instantiate(_this.wareHousePrefab);
                        wareHouseItem.getComponent('wareHouseItem').init(data.data[i]);
                        wareHouseItem.parent = cc.find('scroll/view/content', modalCtrl.wareHouse);
                    }
                } else {
                    tips(data.message);
                }
            }
        )
    },
    openPool: function(event) {

        var fishpond_id = event.target.poolIndex;
        var _this = this;
        ajax(
            urlPrefix + 'fish/fish1009.do',
            'user_id=' + getUserInfo().user_id +
            '&fishpond_id=' + fishpond_id +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    _this.yewuData.fisher[0]['fishpond_' + fishpond_id] = 1;
                    var group = Math.ceil(fishpond_id / 4);
                    cc.find('Canvas/background/pools/group' + group + '/pool' + fishpond_id + '/poolClick').getComponent(cc.Sprite).enabled = false;
                    _this.updateFishPond();
                    updateGoldAndDia();
                } else {
                    tips(data.message);
                }

                event.target.parent.getComponent('closeSelf').closeSelfAndUnlock();
            }
        )
    },
    showPoolPanel: function(index) {

        var pondModal = cc.find('ModalCtrl').getComponent('pondModal');

        var is_open = this.yewuData.arr[index];

        if (is_open) {
            pondModal.showpoolHandle(index);
        } else {
            pondModal.showpoolOpen(index);
        }
    },
    shouHuo: function(event) {
        var index = event.target.poolIndex;
        var _this = this;
        if (!this.shouHuoNum) {
            tips('请输入数量');
            return;
        }
        ajax(
            urlPrefix + 'fish/fish1011.do',
            'user_id=' + getUserInfo().user_id +
            '&fishpond_id=' + index +
            '&fish_num=' + this.shouHuoNum +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {

                    if (data.data == 1) {
                        _this.pools[index - 1].getChildByName('poolfish').active = false;
                    }

                    tips('收获成功！');
                    _this.updateFishPond();
                } else {
                    tips(data.message);
                }
                event.target.parent.active = false;
                cc.find('ModalCtrl').getComponent('pondModal').enabledSrcoll();
            }
        )
    },
    fangYang: function(event) {
        var index = event.target.poolIndex;
        var _this = this;

        if (!this.fangYangNum) {
            tips('请输入数量');
            return;
        }
        ajax(
            urlPrefix + 'fish/fish1010.do',
            'user_id=' + getUserInfo().user_id +
            '&fishpond_id=' + index +
            '&fish_num=' + this.fangYangNum +
            userToken(),
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    tips(data.message);
                    _this.updateFishPond();
                    _this.pools[index - 1].getChildByName('poolfish').active = true;
                } else {
                    tips(data.message);
                }
                event.target.parent.active = false;
                cc.find('ModalCtrl').getComponent('pondModal').enabledSrcoll();

            }
        )
    },
    shouHuoEditChange: function(event) {
        this.shouHuoNum = event;
    },
    fangYangEditChange: function(event) {
        this.fangYangNum = event;
    }
});