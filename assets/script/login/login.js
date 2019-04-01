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
        username: {
            default: null,
            type: cc.EditBox
        },
        password: {
            default: null,
            type: cc.EditBox
        },
        login: {
            default: null,
            type: cc.Node
        },
        register: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function() {
        var _this = this;
        var rem = gJson('rememberMeQdd');
        if (rem) {
            tips('自动登录中！');
            _this.username.string = rem.split('&')[0];
            _this.password.string = rem.split('&')[1];
            _this.Login();

        }
        cc.director.preloadScene('home');


      
    },
    openRegister: function() {
        this.login.active = false;
        this.register.active = true;
    },
    openLogin: function() {
        this.login.active = true;
        this.register.active = false;
    },

    Login: function(event) {
        if (event) {
            var button = event.target;
            button.getComponent(cc.Button).interactable = false;
        }

        var account = this.username.string;
        var password = md5(this.password.string);

        if (this.rememberMeQdd) {
            sJson('rememberMeQdd', account + '&' + this.password.string);

        }


        ajax( //拿userinfo
            urlPrefix + 'user/user1038.do',
            'account=' + account + '&password=' + password,
            function(res) {
                var data = JSON.parse(res);
                if (data.state) {
                    
                    sJson('loginInfo', data.data);
                    
                    cc.director.loadScene('home');
                } else {
                    tips(data.message);
                }
                if (event) {
                    button.getComponent(cc.Button).interactable = true;
                }
            }
        );



    },
    rememberPass: function() {
        this.rememberMeQdd = true;

    },
    closeBtn: function() {
        this.node.active = false;
        cc.find('Canvas/chooseService').active = true;
    },
    wjmm: function() {
        this.node.active = false;
        cc.find('Canvas/wjmm').active = true;
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});