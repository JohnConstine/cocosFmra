cc.Class({
    extends: cc.Component,

    properties: {

        buttonAudio: {
            default: null,
            url: cc.AudioClip
        },

        bgm: {
            default: null,
            url: cc.AudioClip
        },

        mChupai: { // 男 单牌
            default: [],
            url: cc.AudioClip
        },
        wChupai: { //女 单牌
            default: [],
            url: cc.AudioClip
        },
        byz: { //不要走，决战到天亮
            default: [],
            url: cc.AudioClip
        },
        bycl: { //不要c啦
            default: [],
            url: cc.AudioClip
        },
        djh: { //大家好，很高心见到各位
            default: [],
            url: cc.AudioClip
        },
        gwzbhys: { //各位真不好意思，我要离开会
            default: [],
            url: cc.AudioClip
        },
        hnhz: { //和你合作真是太愉快了
            default: [],
            url: cc.AudioClip
        },
        kda: { //太点啊，等得我花儿都谢了
            default: [],
            url: cc.AudioClip
        },
        nidepai: { //你的牌打得也太好了
            default: [],
            url: cc.AudioClip
        },
        nishimm: { //你是MM,还是GG
            default: [],
            url: cc.AudioClip
        },
        jgpyb: { //交个朋友吧？
            default: [],
            url: cc.AudioClip
        },
        xczwb: { //下次咱们在玩吧，我先走了
            default: [],
            url: cc.AudioClip
        },
        zaijianle: { //再见了，俺会想念大家滴
            default: [],
            url: cc.AudioClip
        },
        wlc: { //怎么又断线了，网络怎么这么差
            default: [],
            url: cc.AudioClip
        },
        bujiao: { //不叫
            default: [],
            url: cc.AudioClip
        },
        buqiang: { //不抢
            default: [],
            url: cc.AudioClip
        },
        jiaodizhu: { // 叫地主
            default: [],
            url: cc.AudioClip
        },
        mqiangdizhu: { //男 抢地主
            default: [],
            url: cc.AudioClip
        },
        wqiangdizhu: { //女 抢地主
            default: [],
            url: cc.AudioClip
        },
        mingpai: { //明牌
            default: [],
            url: cc.AudioClip
        },
        mbaojing: { //男 报警
            default: [],
            url: cc.AudioClip
        },
        wbaojing: { //女 报警
            default: [],
            url: cc.AudioClip
        },
        bujiabeo: { //不加倍
            default: [],
            url: cc.AudioClip
        },
        mbuyao: { //男 不要
            default: [],
            url: cc.AudioClip
        },
        wbuyao: { //女不要
            default: [],
            url: cc.AudioClip
        },
        Mdani: { //男 大你
            default: [],
            url: cc.AudioClip
        },
        wdani: { //女 大你
            default: [],
            url: cc.AudioClip
        },
        Mduizi: {
            default: [],
            url: cc.AudioClip
        },
        Wduizi: {
            default: [],
            url: cc.AudioClip
        },
        feiji: { //飞机
            default: [],
            url: cc.AudioClip
        },
        jiabei: { //加倍
            default: [],
            url: cc.AudioClip
        },
        liandui: { //连对
            default: [],
            url: cc.AudioClip
        },
        sandaiyi: { //三带一对
            default: [],
            url: cc.AudioClip
        },
        sandaiyidui: { //三带一对
            default: [],
            url: cc.AudioClip
        },
        shunzi: { //顺子
            default: [],
            url: cc.AudioClip
        },
        sidaier: { //四带二
            default: [],
            url: cc.AudioClip
        },
        shidailianghdui: { //四带两对
            default: [],
            url: cc.AudioClip
        },
        Msange: { //三个
            default: [],
            url: cc.AudioClip
        },
        wsange: { //三个
            default: [],
            url: cc.AudioClip
        },
        wangzha: { //王炸
            default: [],
            url: cc.AudioClip
        },
        zhadan: { //炸弹
            default: [],
            url: cc.AudioClip
        },
        music: {
            default: [],
            url: cc.AudioClip
        },
        aoo: { //啊哦
            default: [],
            url: cc.AudioClip
        },
        zhaoxiang: { //照相声音
            default: [],
            url: cc.AudioClip
        },
        baozha: { //爆炸声音
            default: [],
            url: cc.AudioClip
        },
        tanpai: { //摊牌声音
            default: [],
            url: cc.AudioClip
        },
        bugu: { //布谷声音
            default: [],
            url: cc.AudioClip
        },
        kaipai: { //开始打牌
            default: [],
            url: cc.AudioClip
        },
        dapai: { //打牌
            default: [],
            url: cc.AudioClip
        },
        baojinga: { //报警声音
            default: [],
            url: cc.AudioClip
        },
        feijihuag: { //飞机声音
            default: [],
            url: cc.AudioClip
        },
        lianduiBgm: cc.AudioClip, //连对音效
        shunziBgm: cc.AudioClip, //顺子音效
        win: cc.AudioClip,
        lose: cc.AudioClip,
        loopBgm: { //循环背景音乐
            default: [],
            url: cc.AudioClip
        },
        qdzIndex: 0, //抢地主声音序号
        fapaiBgm: cc.AudioClip, //发牌音效
        timeOutBgm: cc.AudioClip, //超时音效
        baojingBgm: cc.AudioClip, //报警音效
        zhadanBgm: cc.AudioClip,
        mute: false
    },

    playMusic: function() {
        cc.audioEngine.playMusic(this.bgm, true);
    },

    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function(clip, bool) {
        if (!this.mute) {
            if (bool) {
                cc.audioEngine.playEffect(clip, true);
            } else {
                cc.audioEngine.playEffect(clip, false);
            }
        }

    },
    playChips: function() {
        this._playSFX(this.chipsAudio);
    },

    playButton: function() {
        this._playSFX(this.buttonAudio);
    },
    playBgmByRes: function(res) {
        console.log(res);
        var type = res.type;
        var max = res.max;
        switch (type) {
            case 'SINGLE_CARD':
                this._playSFX(this.mChupai[max - 3]);
                break;
            case 'DOUBLE_CARD':
                this._playSFX(this.Mduizi[max - 3]);
                break;
            case 'THREE_CARD':
                this._playSFX(this.Msange[max - 3]);
                break;
            case 'BOMB_CARD':
                this._playSFX(this.zhadan[0]);
                this._playSFX(this.zhadanBgm);
                break;
            case 'THREE_ONE_CARD':
                this._playSFX(this.sandaiyi[0]);
                break;
            case 'THREE_TWO_CARD':
                this._playSFX(this.sandaiyidui[0]);
                break;
            case 'BOMB_TWO_CARD':
                this._playSFX(this.sidaier[0]);
                break;
            case 'BOMB_TWOOO_CARD':
                this._playSFX(this.shidailianghdui[0]);
                break;
            case 'COMPANY_CARD':
                this._playSFX(this.liandui[0]);
                this._playSFX(this.lianduiBgm);
                break;
            case 'CONNECT_CARD':
                this._playSFX(this.shunzi[0]);
                this._playSFX(this.shunziBgm);
                break;
            case 'AIRCRAFT_CARD':
                this._playSFX(this.feiji[0]);
                this._playSFX(this.feijihuag[0]);
                break;
            case 'AIRCRAFT_SINGLE_CARD':
                this._playSFX(this.feiji[0]);
                this._playSFX(this.feijihuag[0]);
                break;
            case 'AIRCRAFT_DOBULE_CARD':
                this._playSFX(this.feiji[0]);
                this._playSFX(this.feijihuag[0]);
                break;
            case 'DOUBLE_JOKER':
                this._playSFX(this.wangzha[0]);
                this._playSFX(this.zhadanBgm);
                break;
        }
        this._playSFX(this.dapai[0]);

    },
    playWin: function() {
        this._playSFX(this.win);
    },
    playLose: function() {
        this._playSFX(this.lose);
    },
    playDizhupai: function() {
        this._playSFX(this.kaipai[0]);
    },
    playJdz: function() {
        this._playSFX(this.jiaodizhu[0]);
    },
    playQdz: function() {
        this._playSFX(this.mqiangdizhu[this.qdzIndex]);
        this.qdzIndex = (this.qdzIndex + 1) % 3;
    },
    playBj: function() {
        var len = this.bujiao.length;
        var index = Math.floor(Math.random() * len);
        this._playSFX(this.bujiao[index]);
    },
    playBq: function() {
        var len = this.buqiang.length;
        var index = Math.floor(Math.random() * len);
        this._playSFX(this.buqiang[index]);
    },
    playPass: function() {
        var len = this.mbuyao.length;
        var index = Math.floor(Math.random() * len);
        this._playSFX(this.mbuyao[index]);
    },
    playBaojing: function(index) {
        if (index == 'bj1') {
            this._playSFX(this.mbaojing[0]);
        } else {
            this._playSFX(this.mbaojing[1]);
        }
        this._playSFX(this.baojingBgm);

    },
    playTimeOut: function() {
        this._playSFX(this.timeOutBgm);
    },
    playBgmLoop: function() {
        this.pauseMusic();

        var bgms = this.loopBgm;
        cc.audioEngine.stopAllEffects()
        var len = bgms.length;
        var index = Math.floor(Math.random() * len);
        this._playSFX(bgms[index], true);


        // var bgmLoopIndex=0;

        // var bgmLoopId=this._playSFX(this.bgms[bgmLoopIndex]);
        // cc.audioEngine.setFinishCallback(bgmLoopId,function () {
        //     bgmLoopIndex=(bgmLoopIndex+1)%3;
        //     bgmLoopId=this._playSFX(this.bgms[bgmLoopIndex]);
        // })
    },
    toMute:function () {
        this.mute=true;
    },
    resumeMute:function () {
        this.mute=false;
    }
});