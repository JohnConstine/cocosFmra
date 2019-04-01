cc.Class({
    extends: cc.Component,

    properties: {
        gold:cc.Node,
        dia:cc.Node,
        nickName:cc.Node,
        level:cc.Node,
        id:cc.Node,
        expLabel:cc.Node,
        headImg:cc.Node,
        expbar:cc.Node,
        headimg:cc.SpriteAtlas
       
    },

    // use this for initialization
    onLoad: function () {
        var allInfo=gJson('allInfo');
        var userInfo=allInfo.userInfo[0];
        var expInfo=allInfo.expInfo;
        var farmInfo=allInfo.farmInfo[0];
        
        this.gold.getComponent('cc.Label').string=farmInfo.gold;
        this.dia.getComponent('cc.Label').string=farmInfo.diamond;
        this.nickName.getComponent('cc.Label').string=userInfo.nickname;
        this.level.getComponent('cc.Label').string=userInfo.level+'级';
        this.id.getComponent('cc.Label').string='Id:'+userInfo.user_id;
        this.expLabel.getComponent('cc.Label').string=userInfo.user_exp+'/'+expInfo[userInfo.level-1].exp;
        this.headImg.getComponent(cc.Sprite).spriteFrame=this.headimg.getSpriteFrame(userInfo.head_img);
        this.expbar.getComponent(cc.ProgressBar).progress=userInfo.user_exp/expInfo[userInfo.level-1].exp;
       
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
