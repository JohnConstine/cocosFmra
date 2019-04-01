//Cocos-Creator编辑器封装的Js,游戏的刚启动Js文件,获取服务器地址后跳转场景.

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
		item: {
			default: null,
			type: cc.Prefab
		},
		ps:cc.Label
	},

	// use this for initialization
	onLoad: function() {

		var prefab = this.item;
		var _this = this;
		if ((cc.sys.os).toLowerCase() == 'ios') {
			ajax(
				//'http://116.62.41.145/farm/server/server1002.do',
				'http://www.morefind.com/farm/server/server1002.do',
				'',
				function(res) {
					var data = JSON.parse(res);
					if (data.state) {
						if(data.data[0].remark){
							_this.ps.string=data.data[0].remark;
						}
						for (var i = 0; i < data.data.length; i++) {
							var itemData = data.data[i];

							var serviceItem = cc.instantiate(prefab);
							cc.find('name/name', serviceItem).getComponent(cc.Label).string = itemData.service_name;
							if (itemData.service_ip) {
								serviceItem.on('touchstart', function(itemData, event) {
									urlPrefix = 'http://' + itemData.service_ip + '/farm/';
									websocketIp = itemData.socket_ip;
									is_show = itemData.is_show;
									animalState = itemData.animal_change;
									window.mate_open=itemData.mate_open;
									propState = itemData.prop_change;
									if (!is_show) {
										var p = cc.find('Canvas/register/scroll/view/content');
										p.getChildByName('tel').active = false;
										p.getChildByName('yzm').active = false;
										p.getChildByName('refered_id').active = false;
										cc.find('Canvas/login/forgetPassword').active = false;
									}
									_this.node.active = false;
									cc.find('Canvas/login').active = true;
								}.bind({}, itemData));
							} else {
								serviceItem.on('touchstart', function(itemData, event) {
									tips('此服务器暂未开放');
								}.bind({}, itemData));
							}
							serviceItem.parent = cc.find('fuq/scroll/view/content', _this.node);
						}
					} else {
						tips(data.message);
					}
				}
			)
		} else {
			ajax(
				//'http://116.62.41.145/farm/server/server1001.do',
				'http://www.morefind.com/farm/server/server1001.do',
				'',
				function(res) {
					var data = JSON.parse(res);
					if (data.state) {
						if(data.data[0].remark){
							_this.ps.string=data.data[0].remark;
						}
						for (var i = 0; i < data.data.length; i++) {
							var itemData = data.data[i];

							var serviceItem = cc.instantiate(prefab);
							cc.find('name/name', serviceItem).getComponent(cc.Label).string = itemData.service_name;
							if (itemData.service_ip) {
								serviceItem.on('touchstart', function(itemData, event) {
									urlPrefix = 'http://' + itemData.service_ip + '/farm/';
									//urlPrefix = 'http://116.62.41.145/farm/';
									window.mate_open=itemData.mate_open;
									websocketIp = itemData.socket_ip;
									is_show = itemData.is_show;
									animalState = itemData.animal_change;
									propState = itemData.prop_change;
									if (!is_show) {
										var p = cc.find('Canvas/register/scroll/view/content');
										p.getChildByName('tel').active = false;
										p.getChildByName('yzm').active = false;
										p.getChildByName('refered_id').active = false;
										cc.find('Canvas/login/forgetPassword').active = false;
									}
									_this.node.active = false;
									cc.find('Canvas/login').active = true;
								}.bind({}, itemData));
							} else {
								serviceItem.on('touchstart', function(itemData, event) {
									tips('此服务器暂未开放');
								}.bind({}, itemData));
							}
							serviceItem.parent = cc.find('fuq/scroll/view/content', _this.node);
						}
					} else {
						tips(data.message);
					}
				}
			)
		}

	},

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});