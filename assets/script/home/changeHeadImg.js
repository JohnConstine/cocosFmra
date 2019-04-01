

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
        code:0,
        atlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        headimg:cc.Sprite

    },

    // use this for initialization
    onLoad: function () {
        var _this=this;
        var atlas=this.atlas;
        var content=cc.find('scrollView/view/content',this.node);
        var imgs=content.children;
        for(var i=0;i<imgs.length;i++){
            imgs[i].on('touchstart',function(){
               
                _this.code=this.name;
                var headimg=_this.headimg;
                headimg.spriteFrame=atlas.getSpriteFrame(this.name);
            }.bind(imgs[i]));
        }
    },
    submit:function(event){
        var button = event.target;
        button.getComponent(cc.Button).interactable = false;
        var headcode=this.code;
        var atlas=this.atlas;
        var user_id=gJson('allInfo').userInfo[0].user_id;
        var _this=this;
        ajax(
            urlPrefix+'user/user1004.do',
            'head_img='+headcode+'&user_id='+user_id+userToken(),
            function(res){
                var data=JSON.parse(res);
                if(data.state){
                    // //换头像
                    // var headimg=cc.find('Canvas/fixItem/fixLayout/status/headimg/img').getComponent(cc.Sprite);
                    // headimg.spriteFrame=atlas.getSpriteFrame(headcode);
                    
                    //修改本地localstorage
                    var allInfo=gJson('allInfo');
                    
                    allInfo.userInfo[0].head_img=headcode;
                    sJson('allInfo',allInfo);
                    
                    //关闭窗口
                    _this.node.active=false;
                    //出现提示框
                    
                    
                }
                tips(data.message,1);
                button.getComponent(cc.Button).interactable = false;
            }
            );
        
        
    },
    cancel:function(){
        var atlas=this.atlas;
        var headcode=getUserInfo().head_img;
        var headimg=this.headimg;
        headimg.spriteFrame=atlas.getSpriteFrame(headcode);
        this.node.active=false;
        cc.find('Canvas').getComponent(cc.ScrollView).enabled=true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
