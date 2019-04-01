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
		pay: { //画布
			default: null,
			type: cc.Node
		},
		canvas: { //画布
			default: null,
			type: cc.Node
		},
		sign: { //签到
			default: null,
			type: cc.Node
		},
		myFriend: { //签到
			default: null,
			type: cc.Node
		},
		sell: { //出售
			default: null,
			type: cc.Node
		},

		honorPhb: { //排行榜
			default: null,
			type: cc.Node
		},
		setting: { //设置
			default: null,
			type: cc.Node
		},
		bindCard: { //绑定银行卡
			default: null,
			type: cc.Node
		},
		bindali: { //绑定支付宝
			default: null,
			type: cc.Node
		},

		changeNickName: { //修改昵称
			default: null,
			type: cc.Node
		},
		Warehouse: { //仓库
			default: null,
			type: cc.Node
		},


		addFriend: { //添加好友
			default: null,
			type: cc.Node
		},

		diamondToMoney: { //钻石兑换金币
			default: null,
			type: cc.Node
		},
		buyDiamond: { //购买钻石
			default: null,
			type: cc.Node
		},
		shopMall: { //商城
			default: null,
			type: cc.Node
		},
		payWay: { //选择支付方式
			default: null,
			type: cc.Node
		},
		confirmAddFriend: { //确认添加好友
			default: null,
			type: cc.Node
		},
		errorAddFriend: { //添加好友错误
			default: null,
			type: cc.Node
		},
		changeHead_img: { //修改头像
			default: null,
			type: cc.Node
		},
		jingong: { //修改头像
			default: null,
			type: cc.Node
		},
		message: {
			default: null,
			type: cc.Node
		},
		expPanel: cc.Node,
		openFish: cc.Node,
		mate: cc.Node,
		dlmate: cc.Node


	},

	// use this for initialization
	onLoad: function() {


	},
	showmessage: function(event) {

		this.message.active = !this.message.active;
		this.unabledSrcoll();
	},
	showchangeHead_img: function() {
		this.changeHead_img.active = !this.changeHead_img.active;
		this.unabledSrcoll();
	},
	showJingong: function() {
		this.jingong.active = !this.jingong.active;
		this.unabledSrcoll();
	},
	Showsign: function() {
		this.sign.active = !this.sign.active;
		this.unabledSrcoll();
	},
	Showsell: function() {
		this.sell.active = !this.sell.active;
		this.unabledSrcoll();
	},
	ShowmoneyPhb: function() {
		this.moneyPhb.active = !this.moneyPhb.active;
		this.unabledSrcoll();
	},
	ShowhonorPhb: function() {
		this.honorPhb.active = !this.honorPhb.active;
		this.unabledSrcoll();
	},
	Showsetting: function() {
		this.setting.active = !this.setting.active;
		this.unabledSrcoll();
	},
	ShowbindCard: function() {
		this.bindCard.active = !this.bindCard.active;
		this.unabledSrcoll();
	},
	Showbindali: function() {
		this.bindali.active = !this.bindali.active;
		this.unabledSrcoll();
	},
	ShowfriendUpdate: function() {
		this.friendUpdate.active = !this.friendUpdate.active;
		this.unabledSrcoll();
	},
	ShowchangeNickName: function() {
		this.changeNickName.active = !this.changeNickName.active;
		this.unabledSrcoll();
	},
	ShowWarehouse: function() {
		this.Warehouse.active = !this.Warehouse.active;
		this.unabledSrcoll();
	},
	ShowupdateRequest: function() {
		this.updateRequest.active = !this.updateRequest.active;
		this.unabledSrcoll();
	},
	ShowaddFriend: function() {
		this.addFriend.active = !this.addFriend.active;
		this.unabledSrcoll();
	},
	ShowanimalStatus: function() {
		this.animalStatus.active = !this.animalStatus.active;
		this.unabledSrcoll();
	},
	ShowdiamondToMoney: function() {
		this.diamondToMoney.active = !this.diamondToMoney.active;
		this.unabledSrcoll();
	},
	ShowMate: function() {
		this.mate.active = !this.mate.active;
		this.unabledSrcoll();
	},
	ShowbuyDiamond: function() {
		if (mate_open) {
			var _this = this;
			
			ajax(
				urlPrefix + 'farm/farm1010.do',
				//'http://www.morefind.com/farm/farm/farm1010.do',
				'',
				function(res) {
					var data = JSON.parse(res);
					var time = data.data;
					var date = new Date(time);
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					ajax(
						urlPrefix + 'farm/farm2001.do',
						'user_id=' + getUserInfo().user_id +
						'&year=' + year +
						'&month=' + month +
						'&page=0' +
						'&size=1' +
						'&max=100000&min=0' +
						userToken(),
						function(res) {
							var data = JSON.parse(res);
							if (data.state && data.data.length > 0) {
								_this.mate.active = !_this.mate.active;
								_this.unabledSrcoll();
							} else {
								_this.buyDiamond.active = !_this.buyDiamond.active;
								_this.unabledSrcoll();
							}
						}
					)
				}
			);



		} else {
			this.buyDiamond.active = !this.buyDiamond.active;
			this.unabledSrcoll();
		}



	},

	tabtouser: function() {
		this.mate.active = true;
		this.dlmate.active = false;
	},
	tabtodl: function() {
		this.mate.active = false;
		this.dlmate.active = true;
	},
	ShowshopMall: function() {
		this.shopMall.active = !this.shopMall.active;
		this.unabledSrcoll();
	},
	ShowpayWay: function() {
		this.payWay.active = !this.payWay.active;
		this.unabledSrcoll();
	},
	ShowmyFriend: function() {
		this.myFriend.active = !this.myFriend.active;
		this.unabledSrcoll();
	},
	Hidemessage: function() {
		this.message.active = false;
		this.enabledSrcoll();
	},
	HideconfirmAddFriend: function() {
		this.confirmAddFriend.active = false;
		this.enabledSrcoll();
	},
	HideerrorAddFriend: function() {
		this.errorAddFriend.active = false;
		this.enabledSrcoll();
	},
	Hidesign: function() {
		this.sign.active = false;
		this.enabledSrcoll();
	},
	Hidesell: function() {
		this.sell.active = false;
		this.enabledSrcoll();
	},
	HidemoneyPhb: function() {
		this.moneyPhb.active = false;
		this.enabledSrcoll();
	},
	HidehonorPhb: function() {
		this.honorPhb.active = false;
		this.enabledSrcoll();
	},
	Hidesetting: function() {
		this.setting.active = false;
		this.enabledSrcoll();
	},
	HidebindCard: function() {

		this.bindCard.active = false;
	},
	Hidebindali: function() {

		this.bindali.active = false;
	},
	HidefriendUpdate: function() {
		this.friendUpdate.active = false;
		this.enabledSrcoll();
	},
	HidechangeNickName: function() {
		this.changeNickName.active = false;
		this.enabledSrcoll();
	},
	HideWarehouse: function() {
		this.Warehouse.active = false;
		this.enabledSrcoll();
	},
	HideupdateRequest: function() {
		this.updateRequest.active = false;
		this.enabledSrcoll();
	},
	HideaddFriend: function() {
		this.addFriend.active = false;
		this.enabledSrcoll();
	},
	HideanimalStatus: function() {
		this.animalStatus.active = false;
		this.enabledSrcoll();
	},
	HideChangeHead_img: function() {
		this.changeHead_img.active = false;
		this.enabledSrcoll();
	},
	HidediamondToMoney: function() {
		this.diamondToMoney.active = false;
		this.enabledSrcoll();
	},
	HidebuyDiamond: function() {
		this.buyDiamond.active = false;
		this.enabledSrcoll();
	},
	HideshopMall: function() {
		this.shopMall.active = false;
		this.enabledSrcoll();
	},
	HidepayWay: function() {
		this.payWay.active = false;
		this.enabledSrcoll();
	},
	HidemyFriend: function() {
		this.myFriend.active = false;
		this.enabledSrcoll();
	},
	HideJingong: function() {
		this.jingong.active = false;
		this.enabledSrcoll();
	},
	HidePay: function() {
		this.pay.active = false;
		this.enabledSrcoll();
	},
	showExpLabel: function() {
		this.expPanel.active = true;
		this.unabledSrcoll();
	},
	hideExpLabel: function() {
		this.expPanel.active = false;
		this.enabledSrcoll();
	},

	// called every frame, uncomment this function to activate update callback
	update: function(dt) {

	},

	enabledSrcoll: function() {
		this.canvas.getComponent(cc.ScrollView).enabled = true;
	},
	unabledSrcoll: function() {
		this.canvas.getComponent(cc.ScrollView).enabled = false;
	},
	gotoPark: function() {
		cc.find('loading').active = true;
		cc.director.loadScene('park');
	},
	goHome: function() {
		cc.find('loading').active = true;
		cc.director.loadScene('home');
	},
	gotoPond: function() {
		var is_open = getUserInfo().fish_open;
		if (is_open) {
			cc.find('loading').active = true;
			cc.director.loadScene('pond');
		} else {
			this.checkStack();
		}
	},
	showOpenFish: function(data) {

		var dia = data.fish_price;
		var fish_num = data.fish_num;
		var fish_stock = data.fish_stock;


		var mes1 = cc.find('bg/mes1', this.openFish);

		var mes2 = cc.find('bg/mes2', this.openFish);

		if (fish_stock >= fish_num) { //系统开通
			mes1.active = true;
			mes2.active = false;
			cc.find('bg/tip', mes1).getComponent('cc.Label').string = '花费' + dia + '钻石购买' + fish_num + '鱼仔，并开通鱼塘';
		} else { //好友开通
			mes1.active = false;
			mes2.active = true;
			cc.find('bg/tip', mes2).getComponent('cc.Label').string = '开通鱼塘需要花费' + dia + '钻石，您将获得' + fish_num + '条鱼苗！';
		}
		this.openFish.active = true;
	},
	checkStack: function() {
		var _this = this;
		ajax(
			urlPrefix + 'fish/fish1002.do',
			'',
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					_this.showOpenFish(data.data);
				} else {
					return false;
				}
			},
			1
		);

	},
	openFishBySystem: function() {
		var _this = this;
		ajax(
			urlPrefix + 'fish/fish1001.do',
			'user_id=' + getUserInfo().user_id +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					tips(data.message);
					//更新缓存
					var allInfo = gJson('allInfo');
					allInfo.userInfo[0].fish_open = 1;
					sJson('allInfo', allInfo);
					updateGoldAndDia();
					_this.gotoPond();
				} else {
					tips(data.message);
				}
			}
		)
	},
	openFishByFriend: function() {
		var friendId = this.fisnOpenFriendId;
		var _this = this;
		ajax(
			urlPrefix + 'fish/fish1003.do',
			'user_id=' + getUserInfo().user_id +
			'&friend_id=' + friendId +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					tips(data.message);
					//更新缓存
					var allInfo = gJson('allInfo');
					allInfo.userInfo[0].fish_open = 1;
					sJson('allInfo', allInfo);
					updateGoldAndDia();
					_this.gotoPond();
				} else {
					tips(data.message);
				}
			}
		)
	},
	updataFishOpen: function() {
		// body...
	},
	onFishOpenInputChange: function(event) {
		this.fisnOpenFriendId = event;
	}

});