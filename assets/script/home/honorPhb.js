
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
       if(!gJson(getUserInfo().user_id+'phb')){
           tips('排行榜可能会涉及到部分您的隐私（昵称、荣誉值），有关隐私保护条列，请查看https://www.morefind.com/farm/ys.html');
           sJson(getUserInfo().user_id+'phb',1);
       }
        var _this=this;
        ajax(
            urlPrefix+'user/user1009.do', 
            '', 
            function(res){
                var data=JSON.parse(res);
                if(data.state){
                    var phb=data.data;
                    
                    for(var i=1;i<(phb.length)+1;i++){
                        cc.find('list/view/content/'+i+'/nickName',_this.node).getComponent(cc.Label).string=phb[i-1].nickname;
                        cc.find('list/view/content/'+i+'/level',_this.node).getComponent(cc.Label).string=phb[i-1].level+'级';
                        cc.find('list/view/content/'+i+'/honor',_this.node).getComponent(cc.Label).string=phb[i-1].total_groly;
                        
                    }
              
                }
            });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
