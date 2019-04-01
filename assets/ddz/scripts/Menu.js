cc.Class({
    extends: cc.Component,

    properties: {
        audioMng: cc.Node,
        muteBtn:cc.Node,
        playBtn:cc.Node
    },

    // use this for initialization
    onLoad: function() {
        this.audioMng = this.audioMng.getComponent('AudioMng');
        this.audioMng.playMusic();
        cc.director.preloadScene('table', function() {
            cc.log('Next scene preloaded');
        });
        if (!DZWS.ob.onopen) {
            DZWS.start();
        } else {
            var msg = {
                'type': 'login',
                'user_id': getUserInfo().user_id
            };
            DZWS.ob.send(JSON.stringify(msg));
        }
    },

    playGame: function(event, site) {
        this.audioMng.pauseMusic();
        cc.director.loadScene('table', function() {
            joinRoom();

        });
    },
    goBackHome: function() {
        this.audioMng.pauseMusic();
        cc.find('loading').active = true;
        cc.audioEngine.stopAllEffects();
        cc.director.loadScene('park');
    },

    // called every frame
    update: function(dt) {

    },
    muteMusic:function () {
        

        this.audioMng.toMute();
        this.audioMng.pauseMusic();
        this.muteBtn.active=false;
        this.playBtn.active=true;
    },
    playMusic:function () {
       
        this.audioMng.resumeMute();
        this.audioMng.resumeMusic();
        this.playBtn.active=false;
        this.muteBtn.active=true;
    }
});