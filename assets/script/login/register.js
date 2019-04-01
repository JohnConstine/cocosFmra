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
		real_name: {
			default: null,
			type: cc.EditBox
		},
		referee_id: {
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
	
		setTimeout(function() {
			cc.find('Canvas/fcm').active = true;
			setTimeout(function() {
				cc.find('Canvas/fcm').active = false;
				cc.find('Canvas/chooseService').active = true;
			}, 2000);
		}, 2000);
	},
	check: function(event) {
		var button = event.target;
		
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
		if (yanzhengma != this.yzm&&is_show) {
			tips('验证码有误！');
			return;
		}

		var real_name = this.real_name.string;
		var referee_id = this.referee_id.string;

		var registerInfo = {};
		registerInfo.account = this.account.string;
		registerInfo.password = md5(password);
		registerInfo.telephone = this.telephone.string;
		registerInfo.real_name = this.real_name.string;
		registerInfo.referee_id = this.referee_id.string;
		registerInfo = JSON.stringify(registerInfo);
		this.goRegister(registerInfo,button);
	},
	goRegister: function(info, button) {
		button.getComponent(cc.Button).interactable = false;
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
				var data = JSON.parse(xhr.responseText);
				if (data.state) {
					tips('注册成功！');
					cc.find('Canvas/register').active = false;
					cc.find('Canvas/login').active = true;
				} else {
					tips(data.message)
				}
				button.getComponent(cc.Button).interactable = true;
			} else if (xhr.readyState == 4 && xhr.status == 0) {
				tips('没有网络或网络超时！');
				button.getComponent(cc.Button).interactable = true;
			}
		};
		xhr.open("POST", urlPrefix + 'user/user1001.do', true);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
		xhr.send(info);
	},
	getYzm: function(event) {
		var button = event.target;
		button.getComponent(cc.Button).interactable = false;
		var tel = button.parent.getChildByName('tel').getComponent(cc.EditBox).string;
		var _this = this;
		ajax(
			urlPrefix + 'user/user1031.do',
			'telephone=' + tel,
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					_this.yzm = data.data;
					tips('已发送,请注意查收!');
					
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
					setTimeout(function () {
						button.getComponent(cc.Button).interactable = true;
					},1000);
				}
			})
	},
	closeBtn: function() {
			cc.find('Canvas/register').active = false;
			cc.find('Canvas/login').active = true;
		}
		// called every frame, uncomment this function to activate update callback
		// update: function (dt) {

	// },
});