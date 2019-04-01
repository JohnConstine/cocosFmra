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
        imgs: {
            default: null,
            type: cc.SpriteAtlas
        },
       
        periods:10000000
    },

    // use this for initialization
    onEnable: function() {
        this.getMes();
    },
    getMes: function() {
        var _this = this;
        var periods=this.periods;
        ajax(
            urlPrefix + 'lottery/lottery3003.do',            
            'periods='+periods,
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    var imgs=_this.imgs;
                    cc.find('kj/resultimg',_this.node).getComponent('cc.Sprite').spriteFrame=imgs.getSpriteFrame(data.data.id_name);
                
                    cc.find('kj/resultnum',_this.node).getComponent('cc.Label').string='开奖号码：'+data.data.result+'号';
                    cc.find('kj/periods/periodsNum',_this.node).getComponent('cc.Label').string='第'+data.data.periods+'期';
                    _this.periods=data.data.periods;
                } else {
                    tips(data.message)
                }
            }
        )
    },
    add:function () {
        this.periods++;
        this.getMes();
    },
    del:function () {
        this.periods--;
        this.getMes();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});