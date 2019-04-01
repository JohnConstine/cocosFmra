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
    },

    // use this for initialization
    onLoad: function () {

    },
    init:function (obj) {
    	this.data=obj;

    	var node=this.node;
    	node.getChildByName('num').getComponent(cc.Label).string='X'+obj.fish_num;
    	node.getChildByName('name').getComponent(cc.Label).string=obj.fish_name;
    	//node.getChildByName('img').getComponent(cc.Sprite).spriteFrame=this.fish_name;
    },
    buttonOnClick:function () {
    	var setAuction=cc.find('Canvas/fixItem/cangku/setAuction').getComponent('setAuction');
    	setAuction.initAndShow(this.data);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
