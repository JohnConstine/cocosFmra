window.urlPrefix = '';
window.websocketIp = '';
window.is_show = 1; //0不显示
window.animalState = '';
window.propState = '';
window.is_gold = 0;
window.shedPosition = [cc.v2(-80, 0), cc.v2(0, 60), cc.v2(80, 0), cc.v2(0, -60)];
window.heartCheck = {
	timeout: 5000, //60ms
	timeoutObj: null,
	reset: function() {
		clearTimeout(this.timeoutObj);　　　　
		this.start();
	},
	start: function() {
		this.timeoutObj = setTimeout(function() {
			WS.ob.send("is_alive");
		}, this.timeout)
	}
};
window.getback = '';
if (!getback) {
	window.getback = cc.game.on(cc.game.EVENT_SHOW, function() {
		console.log(1);
		var scenes = cc.director.getScene().name || '';

		if (scenes == 'home' || scenes == 'friendHome') {
			if (WS.ob.readyState != 1) {
				WS.start(getUserInfo().user_id);
			}
			ajax(
				urlPrefix + 'farm/farm1010.do',
				'',
				function(res) {
					var data = JSON.parse(res);
					if (data.state) {
						returnCurTime = data.data;
					}
				});
			updateGoldAndDia();
			ajax(
				urlPrefix + 'user/user1024.do',
				'user_id=' + getUserInfo().user_id,
				function(res) {
					var data = JSON.parse(res);
					if (data.state) {
						var allInfo = gJson('allInfo');
						allInfo.userInfo[0].level = data.data.level;
						allInfo.userInfo[0].user_exp = data.data.user_exp;
						sJson('allInfo', allInfo);
						cc.find('Canvas/fixItem/fixLayout/status/head/level').getComponent(cc.Label).string = data.data.level + '级';
						var curUpdateExp = allInfo.expInfo[data.data.level - 1].exp;
						cc.find('Canvas/fixItem/fixLayout/status/exp/expLabel/exp').getComponent(cc.Label).string = data.data.user_exp + '/' + curUpdateExp;
					}
				})

		}


	});
}
window.WS = {
	start: function(user_id, status) {
		var ob = new WebSocket("ws://" + websocketIp + "/websocket?user_id=" + user_id + '&status=' + status);



		ob.onopen = function(event) {
			console.log('已连接服务器');
			heartCheck.start();
		};
		ob.onmessage = function(event) {
			heartCheck.reset();
			if (event.data.substring(0, 1) != '{') {
				return false;
			}

			var res = JSON.parse(event.data);

			var RequestId = res.sendId; //请求者ID
			var myId = res.acceptId; //我的ID	
			if (myId != getUserInfo().user_id) {
				return;
			};

			var target = res.target;
			var type = res.type;
			var data = res.data
			var bob = cc.find('Canvas/fixItem/fixLayout/Btngroup/message/img/bob');
			var bobNum = cc.find('Canvas/fixItem/fixLayout/Btngroup/message/img/bob/num');
			if (bob && !bob.active) {
				bob.active = true;
			}
			if (target == 1) { //添加好友
				if (bobNum) {
					bobNum.getComponent(cc.Label).string = Number(bobNum.getComponent(cc.Label).string) + 1;
				}
			} else if (target == 2) { //升级   被狗咬更新金币
				if (bobNum) {
					bobNum.getComponent(cc.Label).string = Number(bobNum.getComponent(cc.Label).string) + 1;
				}
				ajax(
					urlPrefix + 'farm/farm1007.do',
					'user_id=' + getUserInfo().user_id,
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var allInfo = gJson('allInfo');
							allInfo.farmInfo = data.data;
							sJson('allInfo', allInfo);
							cc.find('Canvas/fixItem/fixLayout/gold/goldLabel').getComponent(cc.Label).string = data.data[0].gold;
						}
					})

			} else if (target == 3) { //交易
				if (bobNum) {
					bobNum.getComponent(cc.Label).string = Number(bobNum.getComponent(cc.Label).string) + 1;
				}
				ajax(
					urlPrefix + 'farm/farm1007.do',
					'user_id=' + getUserInfo().user_id,
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var allInfo = gJson('allInfo');
							allInfo.farmInfo = data.data;
							sJson('allInfo', allInfo);
							cc.find('Canvas/fixItem/fixLayout/diamond/diamondLabel').getComponent(cc.Label).string = data.data[0].diamond;
						}
					})
			} else if (target == 4) { //推荐人买宠物送的经验
				if (bobNum) {
					bobNum.getComponent(cc.Label).string = Number(bobNum.getComponent(cc.Label).string) + 1;
				}

				ajax(
					urlPrefix + 'user/user1024.do',
					'user_id=' + getUserInfo().user_id,
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							var allInfo = gJson('allInfo');
							allInfo.userInfo[0].level = data.data.level;
							allInfo.userInfo[0].user_exp = data.data.user_exp;
							sJson('allInfo', allInfo);
							cc.find('Canvas/fixItem/fixLayout/status/head/level').getComponent(cc.Label).string = data.data.level + '级';
							var curUpdateExp = allInfo.expInfo[data.data.level - 1].exp;
							cc.find('Canvas/fixItem/fixLayout/status/exp/expLabel/exp').getComponent(cc.Label).string = data.data.user_exp + '/' + curUpdateExp;
						}
					})
			} else if (target == -1) { //同账号登录踢下线

				if (WS.ob.close) {
					WS.ob.close();
					WS.ob = {};
					console.log(WS.ob.close);
				}
				if (DZWS.ob.close) {
					DZWS.ob.close();
					DZWS.ob = {};
				}
				cc.director.loadScene('login', function() {
					tips('此账号已在别处登录,若不是本人操作,请尽快修改密码！');
				});
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
			if (WS.ob.close) {
				WS.ob = {};
				setTimeout(function() {
					WS.start(getUserInfo().user_id, 2);
				}, 5000)
			}

		};

		this.ob = ob;

	},
	ob: {}

};

window.curFriendId = '';
window.curOpenAnimalNode = null;


function gJson(name) {
	return JSON.parse(cc.sys.localStorage.getItem(name));
}

function sJson(name, data) {
	cc.sys.localStorage.setItem(name, JSON.stringify(data));
}

function updateJson(name, data) {
	var path = name.split('-');
	var data = gJson(path[0]);
	if (panth.length > 1) {
		for (var i = 1; i < path.lenght; i++) {
			data = data[path[i]]
		}
	}

}

function tips(mes, lock) {
	if (!mes) {
		return;
	};
	if (lock) {
		var dialog = cc.find('error1');
		cc.find('7/errorMsg', dialog).getComponent(cc.Label).string = mes;
	} else {
		var dialog = cc.find('error');
		cc.find('error/7/errorMsg', dialog).getComponent(cc.Label).string = mes;
	}



	dialog.active = true;
}

function ajax(url, data, success, asyn) {
	cc.find('ajaxloading').active = true;
	asyn = asyn ? false : true;

	var xhr = new XMLHttpRequest();
	var timer = setTimeout(function() {
		xhr.abort();
		cc.find('ajaxloading').active = false;
	}, 10000)
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
			cc.find('ajaxloading').active = false;
			var res = xhr.responseText;
			success(res);
			clearTimeout(timer);
		} else if (xhr.readyState == 4 && xhr.status == 0) {
			cc.find('ajaxloading').active = false;
			tips('没有网络或网络超时！');
			clearTimeout(timer);
		}
		// else {
		// 	setTimeout(function() {
		// 		cc.find('ajaxloading').active = false;
		// 	}, 1000)
		// }

	};
	xhr.open("POST", url, asyn);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
	//xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	xhr.send(data);
}

function updateGoldAndDia(freeze_diamondLabel) {
	ajax(
		urlPrefix + 'farm/farm1007.do',
		'user_id=' + getUserInfo().user_id,
		function(res) {
			var data = JSON.parse(res);
			if (data.state) {
				var allInfo = gJson('allInfo');
				allInfo.farmInfo = data.data;
				sJson('allInfo', allInfo);
				cc.find('Canvas/fixItem/fixLayout/gold/goldLabel').getComponent(cc.Label).string = data.data[0].gold;
				cc.find('Canvas/fixItem/fixLayout/diamond/diamondLabel').getComponent(cc.Label).string = data.data[0].diamond;
				if(freeze_diamondLabel){
					freeze_diamondLabel.string=data.data[0].freeze_diamond;
				}
			}
		},
		1)
}



function getCurTime() {

	var time;
	ajax(
		urlPrefix + 'farm/farm1010.do',
		'',
		function(res) {
			var data = JSON.parse(res);
			time = data.data;
		},
		1);
	return time;

}



function userToken() {
	return '&user_token=' + gJson('allInfo').userInfo[0].user_token;
}

function curGold() {
	return gJson('allInfo').farmInfo[0].gold;
}

function curDia() {
	return gJson('allInfo').farmInfo[0].diamond;
}

function get_freeze_diamond() {
	return gJson('allInfo').farmInfo[0].freeze_diamond;
}

function getUserInfo() {
	return gJson('allInfo').userInfo[0];
}

function getCountDays(time) {
	var curDate = new Date(time);
	var curMonth = curDate.getMonth() + 1;
	var curYear = curDate.getFullYear();
	var countDate = new Date(curYear, curMonth, 0);
	return countDate.getDate();
}


function getDttime() {
	var date = new Date();
	var y = date.getFullYear().toString();
	var mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

	return y + mm + d + h + m + s;

}

function getFormatTime(time) {
	var date = new Date(time);
	var y = date.getFullYear().toString();
	var mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

	return y + '-' + mm + '-' + d + ' ' + h + ':' + m + ':' + s;
}

function getFormatDate(time) {
	var date = new Date(time);
	var y = date.getFullYear().toString();
	var mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
	var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();


	return y + '-' + mm + '-' + d;
}

function md5(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}

	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	}

	function F(x, y, z) {
		return (x & y) | ((~x) & z);
	}

	function G(x, y, z) {
		return (x & z) | (y & (~z));
	}

	function H(x, y, z) {
		return (x ^ y ^ z);
	}

	function I(x, y, z) {
		return (y ^ (x | (~z)));
	}

	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	function WordToHex(lValue) {
		var WordToHexValue = "",
			WordToHexValue_temp = "",
			lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22;
	var S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20;
	var S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23;
	var S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;

	string = Utf8Encode(string);

	x = ConvertToWordArray(string);

	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}

	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

	return temp.toLowerCase();
}

function changeExp(exp) {
	//经验值复制
	var expLabel = cc.find('Canvas/fixItem/fixLayout/status/exp/expLabel/exp').getComponent(cc.Label);
	var str = expLabel.string;
	var curExp = parseInt(str.split('/')[0]) + parseInt(exp);
	var updateExp = str.split('/')[1];
	var user_id = gJson('allInfo').userInfo[0].user_id;
	var allInfo = gJson('allInfo');
	var curLevel = gJson('allInfo').userInfo[0].level;



	if (curExp >= updateExp) {
		var expInfo = gJson('allInfo').expInfo;

		if (curExp >= expInfo[expInfo.length - 1].exp) { //如果现有经验超过最大值

			updateExp = expInfo[expInfo.length - 1].exp;

			if (curLevel < expInfo[expInfo.length - 1].level) { //如果等级未达最大值，等级提升到最大值
				var level = expInfo[expInfo.length - 1].level;
				ajax(
					urlPrefix + 'user/user1010.do',
					'user_id=' + user_id +
					'&level=' + level +
					userToken(),
					function(res) {
						var data = JSON.parse(res);
						if (data.state) {
							level = parseInt(level) >= 10 ? level : '0' + level;
							cc.find('Canvas/fixItem/fixLayout/status/head/level').getComponent(cc.Label).string = level + '级';

							allInfo.userInfo[0].level = level;
							allInfo.userInfo[0].user_exp = curExp;

							sJson('allInfo', allInfo);
						}
					}, 1);
			}
		} else {
			for (var i = 0; i < expInfo.length; i++) {

				if (curExp < expInfo[i].exp) {
					var level = expInfo[i].level;
					ajax(
						urlPrefix + 'user/user1010.do',
						'user_id=' + user_id +
						'&level=' + level +
						userToken(),
						function(res) {
							var data = JSON.parse(res);
							if (data.state) {
								level = parseInt(level) >= 10 ? level : '0' + level;
								cc.find('Canvas/fixItem/fixLayout/status/head/level').getComponent(cc.Label).string = level + '级';

								allInfo.userInfo[0].level = level;
								allInfo.userInfo[0].user_exp = curExp;

								sJson('allInfo', allInfo);
							}
						}, 1);


					updateExp = expInfo[i].exp;
					break;
				}
			}
		}


	}

	expLabel.string = curExp + '/' + updateExp;

	var exppro = cc.find('Canvas/fixItem/fixLayout/status/exp').getComponent(cc.ProgressBar);
	exppro.progress = curExp / updateExp;



}

window.returnCurTime = '';