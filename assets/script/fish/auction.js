cc.Class({
	extends: cc.Component,

	properties: {
		auctionBuyPrefab: cc.Prefab,
		auctionSellPrefab: cc.Prefab,
		auctionBuyPanel: cc.Node,
		auctionSellPanel: cc.Node,
		buyAuction: cc.Node,
		buyPage: 0,
		buySize: 10,
		sellPage: 0,
		sellSize: 10,
		param: 'number',
		desc: 'desc',
		scroll: cc.Node,
		sellScroll: cc.Node,
		orderBy: cc.Node
	},

	// use this for initialization
	onEnable: function() {
		this.buyPage = 0;
		this.buySize = 10;
		this.sellPage = 0;
		this.sellSize = 10;
		this.param = 'number';
		this.desc = 'desc';
		var types = this.orderBy.children;
		for (var i = 0; i < types.length; i++) {
			types[i].getChildByName('text').color = {
				r: 255,
				g: 255,
				b: 255,
				a: 255
			};
		}
		types[3].getChildByName('text').color = {
			r: 255,
			g: 0,
			b: 0,
			a: 255
		};
		this.buyPanel();
	},
	changeSortType: function(event, res) {
		this.scroll.off('scroll-to-bottom', this.buyLoadingMore, this);
		this.scroll.getComponent(cc.ScrollView).scrollToTop();
		var types = this.orderBy.children;
		for (var i = 0; i < types.length; i++) {
			types[i].getChildByName('text').color = {
				r: 255,
				g: 255,
				b: 255,
				a: 255
			};
		}
		event.target.getChildByName('text').color = {
			r: 255,
			g: 0,
			b: 0,
			a: 255
		};

		this.param = res.split('*')[0];
		this.desc = res.split('*')[1];


		this.buyPanel();

	},
	buyPanel: function() {



		this.auctionBuyPanel.active = true;
		this.auctionSellPanel.active = false;
		this.buyPage = 0;
		var _this = this;

		var page = this.buyPage;
		var size = this.buySize;
		var param = this.param;
		var desc = this.desc;
		var prefab = this.auctionBuyPrefab;
		var content = cc.find('goods/scroll/view/content', this.auctionBuyPanel);
		content.removeAllChildren();
		ajax(
			urlPrefix + 'fish/fish1015.do',
			'user_id=' + getUserInfo().user_id +
			'&page=' + page +
			'&size=' + size +
			'&param=' + param +
			'&param2=' + desc +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var goods = data.data;

					for (var i = 0; i < goods.length; i++) {
						var node = cc.instantiate(prefab);
						node.getChildByName('Name').getComponent('cc.Label').string = goods[i].goods_name;
						node.getChildByName('Number').getComponent('cc.Label').string = goods[i].number + '条';


						node.getChildByName('Price').getChildByName('text').getComponent('cc.Label').string = (goods[i].single_price * goods[i].number).toFixed(2);
						node.getChildByName('Seller').getComponent('cc.Label').string = goods[i].nickname;
						node.yewuId = goods[i].id;
						node.getChildByName('handle').on('touchend', _this.showGoumaiPanel.bind(_this, goods[i]));
						node.parent = content;
					}
				} else {
					tips(data.message);
				}
				setTimeout(function() {
					_this.scroll.on('scroll-to-bottom', _this.buyLoadingMore, _this);
				}, 1000);
			}
		)


	},
	buyLoadingMore: function() { //TODO
		this.scroll.off('scroll-to-bottom', this.buyLoadingMore, this);
		var _this = this;
		this.buyPage++;
		var page = this.buyPage;
		var size = this.buySize;
		var param = this.param;
		var desc = this.desc;
		var prefab = this.auctionBuyPrefab;
		var content = cc.find('goods/scroll/view/content', this.auctionBuyPanel);
		ajax(
			urlPrefix + 'fish/fish1015.do',
			'user_id=' + getUserInfo().user_id +
			'&page=' + page +
			'&size=' + size +
			'&param=' + param +
			'&param2=' + desc +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var goods = data.data;

					for (var i = 0; i < goods.length; i++) {
						var node = cc.instantiate(prefab);
						node.getChildByName('Name').getComponent('cc.Label').string = goods[i].goods_name;
						node.getChildByName('Number').getComponent('cc.Label').string = goods[i].number + '条';
						
						node.getChildByName('Price').getChildByName('text').getComponent('cc.Label').string = (goods[i].single_price * goods[i].number).toFixed(2);
						node.getChildByName('Seller').getComponent('cc.Label').string = goods[i].nickname;
						node.yewuId = goods[i].id;
						node.getChildByName('handle').on('touchend', _this.showGoumaiPanel.bind(_this, goods[i]));
						node.parent = content;
					}
				} else {
					tips(data.message);
				}

				setTimeout(function() {
					_this.scroll.on('scroll-to-bottom', _this.buyLoadingMore, _this);
				}, 1000);

			}
		)
	},
	sellPanel: function() {
		this.auctionBuyPanel.active = false;
		this.auctionSellPanel.active = true;
		this.sellPage = 0;
		var _this = this;
		var page = this.sellPage;
		var size = this.sellSize;
		var param = this.param;
		var prefab = this.auctionSellPrefab;
		var content = cc.find('goods/scroll/view/content', this.auctionSellPanel);
		content.removeAllChildren();
		ajax(
			urlPrefix + 'fish/fish1020.do',
			'user_id=' + getUserInfo().user_id +
			'&page=' + page +
			'&size=' + size +
			'&param=' + param +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var goods = data.data;

					for (var i = 0; i < goods.length; i++) {
						var node = cc.instantiate(prefab);
						node.getChildByName('Name').getComponent('cc.Label').string = goods[i].goods_name;
						node.getChildByName('Number').getComponent('cc.Label').string = goods[i].number + '条';
						node.getChildByName('Price').getChildByName('text').getComponent('cc.Label').string = (goods[i].single_price * goods[i].number).toFixed(2);
						node.yewuId = goods[i].id;
						node.getChildByName('handle').on('touchend', _this.chexiao, node);
						node.parent = content;
					}
				} else {
					tips(data.message);
				}
			}
		)
		this.sellScroll.on('scroll-to-bottom', this.sellLoadingMore, this);
	},
	sellLoadingMore: function() { //TODO
		this.sellScroll.off('scroll-to-bottom', this.sellLoadingMore, this);
		var _this = this;
		this.sellPage++;
		var page = this.sellPage;
		var size = this.sellSize;
		var param = this.param;
		var desc = this.desc;
		var prefab = this.auctionSellPrefab;
		var content = cc.find('goods/scroll/view/content', this.auctionSellPanel);
		ajax(
			urlPrefix + 'fish/fish1020.do',
			'user_id=' + getUserInfo().user_id +
			'&page=' + page +
			'&size=' + size +
			'&param=' + param +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					var goods = data.data;

					for (var i = 0; i < goods.length; i++) {
						var node = cc.instantiate(prefab);
						node.getChildByName('Name').getComponent('cc.Label').string = goods[i].goods_name;
						node.getChildByName('Number').getComponent('cc.Label').string = goods[i].number + '条';
						node.getChildByName('Price').getChildByName('text').getComponent('cc.Label').string = (goods[i].single_price * goods[i].number).toFixed(2);
						node.yewuId = goods[i].id;
						node.getChildByName('handle').on('touchend', _this.chexiao, node);
						node.parent = content;
					}
				} else {
					tips(data.message);
				}
				setTimeout(function() {
					_this.sellScroll.on('scroll-to-bottom', _this.sellLoadingMore, _this);
				}, 1000);
			}
		)
	},
	changeToSell: function() {
		this.sellPanel();
	},
	changeToBuy: function() {
		this.buyPanel();
	},
	addGoodToAuction: function() {
		cc.find('ModalCtrl').getComponent('pondModal').showWareHouse();
	},
	buyGood: function(argument) {
		var _this = this;
		ajax(
			urlPrefix + 'fish/fish1021.do',
			'user_id=' + getUserInfo().user_id +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					_this.guardNum = data.data.fisher[0].grampus_count;
				} else {
					tips(data.message);
				}
			}
		)
	},
	chexiao: function() {
		console.log(this);
		var id = this.yewuId;
		var _this = this;
		ajax(
			urlPrefix + 'fish/fish1016.do',
			'user_id=' + getUserInfo().user_id +
			'&id=' + id +
			userToken(),
			function(res) {
				var data = JSON.parse(res);
				if (data.state) {
					tips(data.message);
					_this.removeFromParent();
				} else {
					tips(data.message);
				}
			}
		)
	},
	showGoumaiPanel: function(data) {

		this.buyAuction.getComponent('buyAuction').initAndShow(data);
	}

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});