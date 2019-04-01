cc.Class({
	extends: cc.Component,

	properties: {
		prefab: cc.Prefab,

		page: 0,
		size: 10,
		min: 0,
		max: 100000,
		scroll: cc.Node,
		content: cc.Node,
		buttons: {
			default: [],
			type: cc.Node
		},
		type: 0,
		freeze_diamondLabel: cc.Node,
		range: cc.Node,
		mateConfirm: cc.Node,
		chexiaoConfirm: cc.Node
	},
	onEnable: function() {
		var _this = this;
		ajax(
			urlPrefix + 'farm/farm1010.do',
			//'http://www.morefind.com/farm/farm/farm1010.do',
			'',
			function(res) {
				var data = JSON.parse(res);
				var time = data.data;
				var date = new Date(time);
				_this.year = date.getFullYear();
				_this.month = date.getMonth() + 1;
				_this.showAll();
			}
		);
		this.mateItem = '';

		var freeze_diamond = get_freeze_diamond();

		this.freeze_diamondLabel.getComponent(cc.Label).string = freeze_diamond;

	},
	// use this for initialization
	onLoad: function() {

	},


	LoadingMore: function() { //TODO
		this.scroll.off('scroll-to-bottom', this.LoadingMore, this);
		var _this = this;
		this.page++;
		var page = this.page;
		var size = this.size;
		var year = this.year;
		var month = this.month;

		var prefab = this.prefab;
		var content = this.content;
		switch (this.type) {
			case 0:
				ajax(
					urlPrefix + 'farm/farm2001.do',
					'user_id=' + getUserInfo().user_id +
					'&year=' + year +
					'&month=' + month +
					'&page=' + page +
					'&size=' + size +
					'&min=' + _this.min +
					'&max=' + _this.max +
					userToken(),
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var prefab = _this.prefab;
							for (var i = 0; i < data.data.length; i++) {
								var item = cc.instantiate(prefab);
								item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
								item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
								item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
								item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
								item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
								item.data = data.data[i];
								item.getChildByName('pipei').active = true;
								item.getChildByName('pipei').on('touchend', _this.askToMate, _this);
								item.parent = _this.content;
							}
						} else {
							tips(data.message);
						}
						_this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
					}
				);

				break;
			case 1:
				ajax(
					urlPrefix + 'farm/farm2004.do',
					'user_id=' + getUserInfo().user_id +
					'&year=' + year +
					'&month=' + month +
					'&page=' + page +
					'&size=' + size +
					userToken(),
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var prefab = _this.prefab;
							for (var i = 0; i < data.data.length; i++) {
								var item = cc.instantiate(prefab);
								item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
								item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
								item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
								item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
								item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
								item.data = data.data[i];
								item.getChildByName('mating').active = true;
								item.parent = _this.content;
							}
						} else {
							tips(data.message);
						}
						_this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
					}
				);

				break;
			case 2:
				ajax(
					urlPrefix + 'farm/farm2009.do',
					'user_id=' + getUserInfo().user_id +
					'&year=' + year +
					'&month=' + month +
					'&page=' + page +
					'&size=' + size +
					userToken(),
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var prefab = _this.prefab;
							for (var i = 0; i < data.data.length; i++) {
								var item = cc.instantiate(prefab);
								item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
								item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
								item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
								item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
								item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
								item.data = data.data[i];
								item.getChildByName('pick').active = true;
								item.getChildByName('pick').on('touchend', _this.getDia, _this);
								item.parent = _this.content;
							}
						} else {
							tips(data.message);
						}
						_this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
					}
				);

				break;
			case 3:
				ajax(
					urlPrefix + 'farm/farm2010.do',
					'user_id=' + getUserInfo().user_id +
					'&year=' + year +
					'&month=' + month +
					'&page=' + page +
					'&size=' + size +
					userToken(),
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var prefab = _this.prefab;
							for (var i = 0; i < data.data.length; i++) {
								var item = cc.instantiate(prefab);
								item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
								item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
								item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
								item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
								item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
								item.data = data.data[i];

								item.parent = _this.content;
							}
						} else {
							tips(data.message);
						}
						_this.scroll.once('scroll-to-bottom', _this.LoadingMore, _this);
					}
				);

				break;
		}

	},
	showAll: function() {
		this.allWhite();
		this.range.active = true;
		this.type = 0;
		this.page = 0;
		this.buttons[0].color = {
			r: 204,
			g: 204,
			b: 204,
			a: 255
		};

		this.content.removeAllChildren();
		var _this = this;
		var year = this.year;
		var month = this.month;

		ajax(
			urlPrefix + 'farm/farm2001.do',
			'user_id=' + getUserInfo().user_id +
			'&year=' + year +
			'&month=' + month +
			'&page=' + _this.page +
			'&size=' + _this.size +
			'&min=' + _this.min +
			'&max=' + _this.max +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var prefab = _this.prefab;
					for (var i = 0; i < data.data.length; i++) {
						var item = cc.instantiate(prefab);
						item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
						item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
						item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
						item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
						item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
						item.data = data.data[i];
						item.getChildByName('pipei').active = true;
						item.getChildByName('pipei').on('touchend', _this.askToMate, _this);
						item.parent = _this.content;
					}
				} else {
					tips(data.message);
				}
			}
		);
		this.scroll.once('scroll-to-bottom', this.LoadingMore, this);
	},
	showMating: function() {
		this.allWhite();
		this.range.active = false;
		this.type = 1;
		this.page = 0;
		this.buttons[1].color = {
			r: 204,
			g: 204,
			b: 204,
			a: 255
		};
		this.content.removeAllChildren();
		var _this = this;
		var year = this.year;
		var month = this.month;
		ajax(
			urlPrefix + 'farm/farm2004.do',
			'user_id=' + getUserInfo().user_id +
			'&year=' + year +
			'&month=' + month +
			'&page=' + _this.page +
			'&size=' + _this.size +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var prefab = _this.prefab;
					for (var i = 0; i < data.data.length; i++) {
						var item = cc.instantiate(prefab);
						item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
						item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
						item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
						item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
						item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
						item.data = data.data[i];
						item.getChildByName('mating').active = true;
						item.getChildByName('mating').on('touchend', _this.chexiao, _this);
						item.parent = _this.content;
					}
				} else {
					tips(data.message);
				}
			}
		);
		this.scroll.once('scroll-to-bottom', this.LoadingMore, this);

	},
	showCanPick: function() {
		this.allWhite();
		this.range.active = false;
		this.type = 2;
		this.page = 0;
		this.buttons[2].color = {
			r: 204,
			g: 204,
			b: 204,
			a: 255
		};
		var _this = this;
		var year = this.year;
		var month = this.month;
		this.content.removeAllChildren();
		ajax(
			urlPrefix + 'farm/farm2009.do',
			'user_id=' + getUserInfo().user_id +
			'&year=' + year +
			'&month=' + month +
			'&page=' + _this.page +
			'&size=' + _this.size +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var prefab = _this.prefab;
					for (var i = 0; i < data.data.length; i++) {
						var item = cc.instantiate(prefab);
						item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
						item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
						item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
						item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
						item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
						item.data = data.data[i];
						item.getChildByName('pick').active = true;
						item.getChildByName('pick').on('touchend', _this.getDia, _this);
						item.parent = _this.content;
					}
				} else {
					tips(data.message);
				}
			}
		);
		this.scroll.once('scroll-to-bottom', this.LoadingMore, this);
	},
	showFinished: function() {
		this.allWhite();
		this.range.active = false;
		this.type = 3;
		this.page = 0;
		this.buttons[3].color = {
			r: 204,
			g: 204,
			b: 204,
			a: 255
		};
		this.content.removeAllChildren();
		var _this = this;
		var year = this.year;
		var month = this.month;
		ajax(
			urlPrefix + 'farm/farm2010.do',
			'user_id=' + getUserInfo().user_id +
			'&year=' + year +
			'&month=' + month +
			'&page=' + _this.page +
			'&size=' + _this.size +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var prefab = _this.prefab;
					for (var i = 0; i < data.data.length; i++) {
						var item = cc.instantiate(prefab);
						item.getChildByName('id').getComponent('cc.Label').string = data.data[i].id;
						item.getChildByName('num').getComponent('cc.Label').string = data.data[i].groly;
						item.getChildByName('nickName').getComponent('cc.Label').string = data.data[i].nickname;
						item.getChildByName('phone').getComponent('cc.Label').string = data.data[i].telephone;
						item.getChildByName('ali').getComponent('cc.Label').string = data.data[i].ali_account;
						item.data = data.data[i];

						item.parent = _this.content;
					}
				} else {
					tips(data.message);
				}
			}
		);
		this.scroll.once('scroll-to-bottom', this.LoadingMore, this);
	},
	allWhite: function() {
		var buttons = this.buttons;
		for (var i in buttons) {
			buttons[i].color = {
				r: 255,
				g: 255,
				b: 255,
				a: 255
			}
		}
	},
	askToMate: function(event) {
		this.mateConfirm.active = true;
		this.mateItem = event.target.parent;
	},
	confirmAskToMate: function(event) {
		var _this = this;
		var data = this.mateItem.data;

		var id = data.id;
		var friend_id = data.user_id;

		var month = new Date(data.create_date).getMonth() + 1;

		ajax(
			urlPrefix + 'farm/farm2003.do',
			'user_id=' + getUserInfo().user_id +
			'&id=' + id +
			'&friend_id=' + friend_id +
			'&month=' + month +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {

					_this.mateConfirm.active = false;
					_this.mateItem.removeFromParent();

					updateGoldAndDia(_this.freeze_diamondLabel.getComponent(cc.Label));


				}
				tips(data.message);
			}
		);
	},
	chexiao: function(event) {

		this.chexiaoConfirm.getChildByName('content1').active = true;
		this.chexiaoConfirm.getChildByName('content2').active = false;
		this.chexiaoConfirm.active = true;
		this.chexiaoItem = event.target.parent;
	},
	confirmChexiao: function(event) {
		var _this = this;
		var data = this.chexiaoItem.data;


		var id = data.id;
		var month = new Date(data.create_date).getMonth() + 1;

		ajax(
			urlPrefix + 'farm/farm2012.do',
			'user_id=' + getUserInfo().user_id +
			'&id=' + id +
			'&month=' + month +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {


					updateGoldAndDia(_this.freeze_diamondLabel.getComponent(cc.Label));


					_this.chexiaoConfirm.active = false;
					_this.chexiaoItem.removeFromParent();
					tips(data.message);
				} else {
					_this.chexiaoConfirm.getChildByName('content1').active = false;
					_this.chexiaoConfirm.getChildByName('content2').active = true;
					_this.chexiaoConfirm.getChildByName('content2').getComponent('cc.Label').string = data.message;
				}
				// tips(data.message);

			}
		);
	},
	getDia: function(event) {
		var _this = this;
		var data = event.target.parent.data;


		var id = data.id;
		var friend_id = data.friend_id;
		var month = new Date(data.create_date).getMonth() + 1;
		ajax(
			urlPrefix + 'farm/farm2006.do',
			'user_id=' + getUserInfo().user_id +
			'&id=' + id +
			'&friend_id=' + friend_id +
			'&month=' + month +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					event.target.parent.removeFromParent();
					updateGoldAndDia(_this.freeze_diamondLabel.getComponent(cc.Label));


				}
				tips(data.message);

			}
		);
	},
	changeMin: function(event) {
		this.min = event;
	},
	changeMax: function(event) {
		this.max = event;
	},
	changeSubmit: function() {
		this.showAll();
	},
	shuoming: function() {
		cc.find('shuoming', this.node).active = true;
	}



	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});