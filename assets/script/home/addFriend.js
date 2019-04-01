
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
        input:{
            default:null,
            type:cc.EditBox
        },
      
    },

    // use this for initialization
    onLoad: function () {
        
    },
    jiaoyi:function () {
        var friendId = this.node.data.user_id;
        var nickname = this.node.data.nickname;
        var jiaoyi = cc.find('Canvas/fixItem/myfriends/jiaoyi');
        jiaoyi.friendId=friendId;
        
        cc.find('content/id', jiaoyi).getComponent(cc.Label).string = nickname + '(ID:' + friendId + ')';


        jiaoyi.active = true;
    },
    submit:function(){//添加好友
        var _this=this;
        var user_id=getUserInfo().user_id;
        var input=this.input;
        var friend_id=input.string;
        ajax(urlPrefix+'user/user1007.do','user_id='+friend_id,
                    function(res){
                        var data=JSON.parse(res);
                        
                        if(data.state){
                            var hasfind=_this.node.getChildByName('hasfind');
                            
                            cc.find('7/nickName',hasfind).getComponent(cc.Label).string='昵称:'+data.data[0].nickname;
                            cc.find('7/id',hasfind).getComponent(cc.Label).string='ID:'+data.data[0].user_id;
                            _this.node.data=data.data[0];
                            hasfind.active=true;
                        }else{
                            tips(data.message);
                        }
                    }
        );
        
    },
    
    cancel:function(){
        var input=this.input;
        input.string='';
    },
    add:function(){
        var user_id=getUserInfo().user_id;
        var input=this.input;
        var friend_id=input.string;
        ajax(
            urlPrefix+'user/user1006.do',
            'user_id='+user_id+
            '&friend_id='+friend_id+
            userToken(),
            function(res){
                var data=JSON.parse(res);
               
                if(data.state){
                    tips(data.message);
                    cc.find('Canvas/fixItem/myfriends').active=false;
                    cc.find('Canvas/fixItem/myfriends/addFriend').active=false;
                    cc.find('Canvas/fixItem/myfriends/hasfind').active=false;
                }else{
                    tips(data.message);
                }
            }
        );
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
