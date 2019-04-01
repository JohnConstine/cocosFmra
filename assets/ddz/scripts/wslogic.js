/**
 * Created by Administrator on 2017/3/21.
 */

window.globalSite = '';
window.DZWS = {
	start: function() {
		var ob = new WebSocket("ws://120.27.249.116:8282");
		ob.onopen = function(event) {
			console.log('已连接服务器');

			var msg = {
				'type': 'login',
				'user_id': getUserInfo().user_id
			};
			ob.send(JSON.stringify(msg));
			//heartCheck.start();
		};
		ob.onmessage = function(event) {
			//heartCheck.reset();
			if (event.data.substring(0, 1) != '{') {
				return false;
			}

			var res = JSON.parse(event.data);

			console.log(res);
			var type = res.type;


			switch (type) {
				case 'duanxian':
					var index = siteToIndex(res.site);
					var Game = require('Game');
					Game.instance.showDuanxian(index);
					break;

				case 'teamMateBack':
					var Game = require('Game');
					var index = siteToIndex(res.site);

					if (!Game.instance.playerAnchors[index].getComponent('playerPrefab')){
						Game.instance.backTocreatePlayer(res.data);
					}
					
					Game.instance.hideDuanxian(index);


					break;
				case 'leaveRequest':
					var Game = require('Game');

					Game.instance.leaveRequest(res);

					break;
				case 'leaveRequestRes':
					var Game = require('Game');

					Game.instance.leaveRoomRes(res);
					break;
				case 'error':
					ddztips(res.msg);
					break;
				case 'login':
					var data = res.data;
					var room = cc.find('Menu/room').getComponent('Room');
					room.renderInfos(data);
					var priceArr = res.priceArr;
					var priceScript = cc.find('buyRoomCard').getComponent('buyRoomCard');

					priceScript.init(priceArr);
					break;
				case 'reConnect':
					cc.director.loadScene('table', function() {
						cc.find('Game').getComponent('Game').reConnect(res,true);
					});
					globalSite = res.site;


					break;
				case 'teamMateBack':



					break;
				case 'roomNumError':
					var room = cc.find('Menu/room').getComponent('Room');
					room.joinRoomCb(res);
					break;
				case 'getSite':
					globalSite = res.site;
					break;
				case 'joinRoom':

					var Game = require('Game');

					Game.instance.joinRoomToCreatePlayer(res);

					//var actorRenderer = require('ActorRenderer');

					//actorRenderer.instance.startCountdown();

					break;
				case 'leaveRoom':
					var site = res.site;
					var Game = require('Game');
					if (site == globalSite) {
						Game.instance.quitToMenu();
						globalSite = '';
					} else {
						Game.instance.leaveRoomToDeletePlayer(site);
					}

					//var actorRenderer = require('ActorRenderer');

					//actorRenderer.instance.startCountdown();

					break;
				case 'ready':
					var site = res.site;
					var mes = res.message;
					var index = siteToIndex(site);
					var Game = require('Game');
					index -= 1;

					cc.find('Canvas/playerLayer/anchorPlayer' + index + '/playerPrefab/cardInfo').active = true;



					break;
				case 'sendCard':
					//去掉所有准备
					for (var i = 0; i < 3; i++) {
						cc.find('Canvas/playerLayer/anchorPlayer' + i + '/playerPrefab/cardInfo').active = false;
					}
					//TODO 改变每一个人的状态，其他人是圈圈在转，自己的渲染展示牌面
					var Game = require('Game');
					var cards = res.cards;
					var site = res.site;
					var porks = [];
					for (var i = 0; i < cards.length; i++) {
						porks.push(porkStand[cards[i]]);
					}
					porks.sort(function(a, b) {
						return b.value == a.value ? a.id - b.id : b.value - a.value;
					});

					Game.instance.sendCard(porks);


					//更新局数
					var now_game_count = res.now_game_count;
					var game_count = res.game_count;
					var inGameUI = cc.find('Game/InGameUI').getComponent('InGameUI');
					inGameUI.updateGameCount(now_game_count, game_count);
					window.upperChupaiCards = '';
					break;
				case 'reSendCard':
					var Game = require('Game');
					var cards = res.cards;
					var site = res.site;
					var porks = [];
					for (var i = 0; i < cards.length; i++) {
						porks.push(porkStand[cards[i]]);
					}
					porks.sort(function(a, b) {
						return b.value - a.value;
					});


					var playerAnchors = Game.instance.playerAnchors;
					for (var i in playerAnchors) {
						if (playerAnchors[i]) {
							playerAnchors[i].getChildByName('playerPrefab').getComponent('ActorRenderer').resetCountdown();
						}
					}
					Game.instance.sendCard(porks);
					break;
				case 'jdz':
					//TODO 弹出按钮选择是否叫地主，倒计时30秒，三个玩家都展示倒计时
					var Game = require('Game');
					Game.instance.show_jdz(res);
					//ActorRenderer.startCountdown(30,2);
					var next = res.next;

					var nextIndex = siteToIndex(next);

					var ActorRenderer = Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					window.nextChupai = next;
					ActorRenderer.startCountdown(30, 2);

					var upper = res.before;
					if (upper) {
						var upperIndex = siteToIndex(upper);
						var upperActorRenderer = Game.instance.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
						upperActorRenderer.resetCountdown();
					}
					break;
				case 'is_qdz':
					//TODO 弹出按钮选择是否叫地主，倒计时30秒，三个玩家都展示倒计时
					var Game = require('Game');
					Game.instance.is_qdz(res);
					break;
				case 'dz_res':
					//TODO 展示三张地主牌，给地主玩家加地主头像，给地主玩家插入三张牌
					var dizhu = res.dizhu;
					var dizhupai = res.dizhupai;
					var times = cc.find('Canvas/uiLayer/times');
					times.getComponent('cc.Label').string = '倍数:' + res.times;
					times.active = true;
					var Game = require('Game');
					Game.instance.showDizhupaiAndTitle(dizhu, dizhupai);
					window.nextChupai = res.chupai;
					var nextIndex = siteToIndex(res.chupai);

					var upper = res.before;
					var upperIndex = siteToIndex(upper);
					if (upperIndex != nextIndex) {
						var upperActorRenderer = Game.instance.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
						upperActorRenderer.resetCountdown();
					}

					var ActorRenderer = Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					ActorRenderer.startCountdown(30, 1);
					break;
				case 'chupaiRes':

					var upper = res.upper;
					var Game = require('Game');
					var next = res.next;
					var pass = res.pass;
					var audio = cc.find('Game/AudioMng').getComponent('AudioMng');


					if (!pass) { //如果出牌了
						if (globalSite == upper) {
							//把自己显示的牌减少，显示到自己的上方
							Game.instance.myDeleteCards(res.res);
						} else {
							// 在对应的upper位置显示牌，减少牌数量
							Game.instance.showUpperChupaiAndDeleteCardNum(res);
						}
						var times = cc.find('Canvas/uiLayer/times');
						times.getComponent('cc.Label').string = '倍数:' + res.times;


						if (globalSite == next) {
							//显示出牌面板
							Game.instance.showChupaiBtn();
							window.upperChupaiCards = res.res;
						} else {
							//显示出牌倒计时
						}



						audio.playBgmByRes(res.res);
						if (res.audio) {
							audio.playBaojing(res.audio);
						}

					} else { //不要或者要不起
						if (globalSite == upper) {
							//显示不要
							Game.instance.inGameTextTip('不要');
							Game.instance.hideChupaiBtn();
						} else {
							// 在对应的upper位置显示牌，减少牌数量
							Game.instance.pass_changeText(upper);
						}

						if (globalSite == next) {
							//显示出牌面板
							window.upperChupaiCards = res.res;
							Game.instance.showChupaiBtn();
						} else {
							//显示出牌倒计时
						}
						audio.playPass();
					}
					var nextIndex = siteToIndex(next);
					var upperIndex = siteToIndex(upper);

					var upperActorRenderer = Game.instance.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					upperActorRenderer.resetCountdown();

					var ActorRenderer = Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					window.nextChupai = next;
					ActorRenderer.startCountdown(30);


					break;
				case 'loopOver':

					var upper = res.upper;
					var Game = require('Game');
					var next = res.next;
					var audio = cc.find('Game/AudioMng').getComponent('AudioMng');
					audio.playPass();
					if (globalSite == upper) {
						//显示不要
						Game.instance.inGameTextTip('不要');
						Game.instance.hideChupaiBtn();
					} else {
						// 在对应的upper位置显示牌，减少牌数量
						Game.instance.pass_changeText(upper);
					}
					//隐藏状态文字
					Game.instance.hideAllGameHandleState();
					//隐藏上一轮出牌
					Game.instance.hideUpperChupai();

					window.upperChupaiCards = '';
					if (globalSite == next) {
						//显示出牌面板

						Game.instance.showChupaiBtn(true);
					} else {
						//显示出牌倒计时
					}
					var nextIndex = siteToIndex(next);
					var upperIndex = siteToIndex(upper);

					var upperActorRenderer = Game.instance.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					upperActorRenderer.resetCountdown();

					var ActorRenderer = Game.instance.playerAnchors[nextIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					window.nextChupai = next;
					ActorRenderer.startCountdown(30, 1);


					break;
				case 'GameOver':
					var Game = require('Game');
					Game.instance.oneGameOver(res);
					var upper = res.upper;
					var audio = cc.find('Game/AudioMng').getComponent('AudioMng');



					if (globalSite == upper) {
						//把自己显示的牌减少，显示到自己的上方
						Game.instance.myDeleteCards(res.res);
					} else {
						// 在对应的upper位置显示牌，减少牌数量
						Game.instance.showUpperChupaiAndDeleteCardNum(res);
					}
					var times = cc.find('Canvas/uiLayer/times');
					times.getComponent('cc.Label').string = '倍数:' + res.times;


					audio.playBgmByRes(res.res);


					if (res.winner) {
						if (globalSite == res.dizhu) {
							audio.playWin();
						} else {
							audio.playLose();
						}
					} else {
						if (globalSite == res.dizhu) {
							audio.playLose();
						} else {
							audio.playWin();
						}
					}
					var upperIndex = siteToIndex(upper);

					var upperActorRenderer = Game.instance.playerAnchors[upperIndex].getChildByName('playerPrefab').getComponent('ActorRenderer');
					upperActorRenderer.resetCountdown();


					break;
			}



		};
		ob.onerror = function(event) {
			// tips('网络错误，请重新连接,3秒后重连中！');
			// setTimeout(function() {
			// 	cc.game.restart();
			// }, 3000)
			console.log('error')

		};
		ob.onclose = function(event) {
			// if (DZWS.ob.close) {
			// 	DZWS.ob = {};
			// 	setTimeout(function () {
			// 		DZWS.start(getUserInfo().user_id);
			// 	}, 5000)
			// }

		};
		this.ob = ob;
	},
	ob: {}
};
window.upperChupaiCards = '';

function joinRoom(roomNum) { //传给服务器桌号，座位号

	//TODO 保存roomNum和site 到本地  切换场景到桌子上
	var msg = {
		'type': 'joinRoom',
		'qdd_id': 1, //getUserInfo().user_id
		'nickName': '你大爷',
		'headImg': 52156,
		'roomNum': roomNum
	};

	DZWS.ob.send(JSON.stringify(msg));
}

function ready() { //按准备，如果有倒计时取消倒计时
	var msg = {
		'type': 'ready'
	};
	DZWS.ob.send(JSON.stringify(msg));
	//TODO 停止自己的倒计时，修改自己的准备状态
}

function jdz(res) {
	var msg = {
		'type': 'jdz_cb',
		'res': res
	};
	console.log(msg);
	DZWS.ob.send(JSON.stringify(msg));
}



function pass() {

}

function stopTimer() { //检测是否有倒计时，如果有则停止

}

function siteToIndex(site) {
	var index;
	if (site == globalSite) {
		index = 2;
	} else {
		if (globalSite == 2) {
			index = site;
		} else if (globalSite == 1) {
			index = (site + 1) % 3;
			index = index == 0 ? 3 : index;
		} else if (globalSite == 3) {
			index = (site - 1) % 3;
			index = index == 0 ? 3 : index;
		}
	}
	return index;
}


window.suit = ['spades', 'hearts', 'clubs', 'diamonds']; //黑桃：spades,红心：hearts,梅花：clubs,方块：diamonds
window.porkStand = initPork();

function initPork() { //初始化一副扑克
	var porkStand = [];
	for (var i = 0; i < 52; i++) {
		var a = {};
		var point = (i + 1) % 13;
		a.id = i;
		//a.suit=suit[Math.ceil((i+1)/13)-1];
		a.suit = Math.ceil((i + 1) / 13) - 1;

		if (2 < point) {
			a.value = point;
		} else {
			a.value = point + 13
		}
		if (point == 11) {
			point = 'J'
		} else if (point == 12) {
			point = 'Q'
		} else if (point == 0) {
			point = 'K'
		} else if (point == 1) {
			point = 'A'
		}
		a.point = point;
		porkStand.push(a);
	}
	porkStand[52] = {
		point: 'fJ',
		suit: 'JOKER',
		value: 16,
		id: 52
	};
	porkStand[53] = {
		point: 'tJ',
		suit: 'JOKER',
		value: 17,
		id: 53
	};
	return porkStand;
}

function ddztips(contentText, titleText) {
	var tips = cc.find('tips');
	var content = tips.getChildByName('content');
	content.getComponent('cc.Label').string = contentText;
	if (titleText) {
		var title = tips.getChildByName('title');
		title.getComponent('cc.Label').string = title;
	}
	tips.active = true;
}