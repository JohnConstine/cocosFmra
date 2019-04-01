cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
    },

    // use this for initialization
    onLoad: function () {
        
        if(!is_show){
            cc.find("bg/bindcard",this.node).active=false;
            cc.find("bg/bindali",this.node).active=false;
        }
    },
    mute:function (event) {
        var target=event.target.parent.getComponent(cc.Toggle);

        if(target.isChecked==true){

            this.audioSource.pause();
        }else{
            this.audioSource.play();
        }
    },
    logout:function () {
        sJson('rememberMeQdd',null);
        
        if(WS.ob.close){
            WS.ob.close();
            WS.ob={};
        }
        cc.director.loadScene('login');
    },
    changeVolume:function (event) {
        var progress=event.progress;
        this.audioSource.volume=progress;
        console.log(event);
        console.log(this.audioSource);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
