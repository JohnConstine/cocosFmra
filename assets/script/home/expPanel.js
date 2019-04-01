cc.Class({
    extends: cc.Component,

    properties: {
        bottomEmpty: cc.SpriteFrame,
        bottomFull: cc.SpriteFrame,
        bottomHalf: cc.SpriteFrame,
        bottomGrey: cc.SpriteFrame,
        bottmPrefab: cc.Prefab
    },

    // use this for initialization
    onEnable: function() {
      
        var _this = this;
        ajax(
            urlPrefix + 'user/user1034.do',
            'user_id=' + getUserInfo().user_id,
            function(res) {
                var data = JSON.parse(res);

                if (data.state) {
                   
                    var exps = data.data
                    delete exps.id;
                    delete exps.user_id;
                    var expArr = [];
                    for (var i in exps) {
                        expArr.push(exps[i]);
                    }
                   
                    var page1 = cc.find('PageView/view/content/page_1', _this.node);
                    var page2 = cc.find('PageView/view/content/page_2', _this.node);

                    for (var i = 0; i < expArr.length; i++) {
                        if (i < 8) {
                            var item = page1.children[i];
                        } else {
                            var item = page2.children[i - 8];
                        }
                        cc.find('panel/exp', item).getComponent('cc.Label').string = '储存经验:' + expArr[i];
                        cc.find('panel/name', item).getComponent('cc.Label').string = (i + 1) + '号栏';
                        cc.find('panel/img', item).getComponent('cc.Sprite').spriteFrame = expArr[i] ? _this.bottomHalf : _this.bottomEmpty;
                    }
                }
            }
        )
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});