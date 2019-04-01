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
		prefab: {
			default: null,
			type: cc.Prefab
		},
		propPrefab: {
			default: null,
			type: cc.Prefab
		},
		atlas: {
			default: null,
			type: cc.SpriteAtlas
		},
		type: 'animal',
		atlas2: {
			default: null,
			type: cc.SpriteAtlas
		},
		atlas3: {
			default: null,
			type: cc.SpriteAtlas
		},
	},

	// use this for initialization
	onEnable: function() {

		var user_id = getUserInfo().user_id;
		var _this = this;
		var atlas = this.atlas;
		var atlas2=this.atlas2;
		var atlas3=this.atlas3;
		if (this.type == 'animal') {
			var Prefab = this.prefab;
			ajax(
				urlPrefix + 'warehouse/warehouse1001.do',
				'user_id=' + user_id,
				function(res) {
					var data = JSON.parse(res);
					console.log(data);
					if (data.state) {
						var warehouse = data.data;
						for (var i = 0; i < warehouse.length; i++) {
							var warehouseItem = cc.instantiate(Prefab);

							warehouseItem.name = "" + warehouse[i].product_id + "";
							cc.find('name', warehouseItem).getComponent(cc.Label).string = warehouse[i].product_name;
							cc.find('num', warehouseItem).getComponent(cc.Label).string = 'X' + warehouse[i].product_num;
							cc.find('price', warehouseItem).getComponent(cc.Label).string = warehouse[i].product_price;
							cc.find('intro', warehouseItem).getComponent(cc.Label).string = warehouse[i].product_introduce;
							cc.find('img', warehouseItem).getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(warehouse[i].product_code);
							//cc.find('img',warehouseItem).getComponent(cc.Sprite).string='X'+data.data[i].product_num;
							warehouseItem.data = data.data[i];
							warehouseItem.parent = cc.find('scroll/view/content', _this.node);


						}
					}
				});



		} else if (this.type == 'prop') {
			var Prefab = this.propPrefab;
			ajax(
				urlPrefix + 'prop/prop1004.do',
				'user_id=' + getUserInfo().user_id,
				function(res) {
					var data = JSON.parse(res);
					if (data.state) {
						var warehouse = data.data;
						for (var i = 0; i < warehouse.length; i++) {
							var warehouseItem = cc.instantiate(Prefab);

							
							var sprite=atlas2.getSpriteFrame(warehouse[i].prop_code);
							if(!sprite){
								sprite=atlas3.getSpriteFrame(warehouse[i].prop_code);
							}

							cc.find('name', warehouseItem).getComponent(cc.Label).string = warehouse[i].prop_name;
							cc.find('num', warehouseItem).getComponent(cc.Label).string = 'X' + warehouse[i].prop_num;
							
							
							cc.find('img', warehouseItem).getComponent(cc.Sprite).spriteFrame = sprite;
							//cc.find('img',warehouseItem).getComponent(cc.Sprite).string='X'+data.data[i].product_num;
							warehouseItem.data = data.data[i];
							warehouseItem.parent = cc.find('scroll/view/content', _this.node);


						}
					} else {
						tips(data.message);
					}
				})
		}



	},
	onDisable: function() {
		cc.find('scroll/view/content', this.node).removeAllChildren();
	},
	changeType: function(event, cus) {
		var target = event.target;
		target.color = {
			r: 255,
			g: 255,
			b: 255,
			a: 255
		};
		if (cus == 'prop') {
			var animal = target.parent.getChildByName('animal');
			animal.color = {
				r: 204,
				g: 204,
				b: 204,
				a: 255
			};
		} else {
			var animal = target.parent.getChildByName('prop');
			animal.color = {
				r: 204,
				g: 204,
				b: 204,
				a: 255
			};
		}
		this.type = cus;
		this.onDisable();
		this.onEnable();
	}

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});