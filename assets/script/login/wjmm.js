cc.Class({
    extends: cc.Component,

    properties: {
        account: {
            default: null,
            type: cc.EditBox
        },
        password: {
            default: null,
            type: cc.EditBox
        },
        confirmPassword: {
            default: null,
            type: cc.EditBox
        },
        telephone: {
            default: null,
            type: cc.EditBox
        },
        yanzhengma: {
            default: null,
            type: cc.EditBox
        },
        submitBtn: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function() {

    },
    check: function() {
        var account = this.account.string;
        if (new RegExp('\\W').test(account) || account.length < 6) {
            tips('账号非法,只能输入6-15位的数字和字母');
            return;
        }

        var password = this.password.string;
        var comfirmPassword = this.confirmPassword.string;
        if (password !== comfirmPassword) {
            tips('两次输入的密码不一致！');
            return;
        }
        if (password.length < 6) {
            tips('密码的长度不能小于6位数');
            return;
        }
        if (new RegExp('\\s').test(password)) {
            tips('密码中不能包含空格');
            return;
        }
        var telephone = this.telephone.string;
        var yanzhengma = this.yanzhengma.string;
       

       
        var registerInfo = {};
        registerInfo.account = this.account.string;
        registerInfo.password = md5(password);
        registerInfo.telephone = this.telephone.string;
        registerInfo.yanzhengma = yanzhengma;
        
        registerInfo = JSON.stringify(registerInfo);
        this.goRegister(registerInfo);
    },
    goRegister: function(info) {
        var info=JSON.parse(info);
        var _this=this;
        ajax(
            urlPrefix+'user/user1021.do',
            'account='+info.account+
            '&password='+info.password+
            '&code='+info.yanzhengma,
            function (res) {
                var data=JSON.parse(res);
                if(data.state){
                    tips(data.message);
                    _this.closeBtn();
                }else{
                    tips(data.message);
                }
            })
    },
    getYzm: function(event) {
        var button = event.target;
        var account = this.account.string;
        var tel = this.telephone.string;
        var _this = this;
        if(account==null || account.length<1){
            tips('请先输入账号！');
            return;
        }
        if(tel.length!=11){
            tips('请输入正确的手机号码！');
            return;
        }


        ajax(
            urlPrefix + 'user/user1022.do',
            'telephone=' + tel+
            '&account='+account,
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                   
                    tips('已发送,请注意查收!');
                 
                    button.getComponent(cc.Button).interactable = false;
                    var label = button.getChildByName('Label').getComponent(cc.Label);
                    var time = 60;
                    var timer = setInterval(function() {

                        label.string = time + '秒后可重发';
                        time--;
                        if (time <= 0) {
                            clearInterval(timer);
                            button.getComponent(cc.Button).interactable = true;
                            label.string = '获取验证码';
                        }
                    }, 1000)
                } else {
                    tips(data.message);
                }
            })
    },
    closeBtn:function () {
        cc.find('Canvas/wjmm').active=false;
        cc.find('Canvas/login').active=true;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});