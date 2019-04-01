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
    closeSelf:function(){
        this.node.active=false;
        // var ScrollView=cc.find('Canvas').getComponent(cc.ScrollView);
        // if(ScrollView){
        //     ScrollView.enabled=true;
        // }
        
    },
    showSelf:function(){
       
        this.node.active=true;
    },
    closeSelfAndUnlock:function () {
        this.node.active=false;
        var ScrollView = cc.find('Canvas').getComponent(cc.ScrollView);
        if (ScrollView) {
            ScrollView.enabled = true;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
