
// var porkTypes={
// 		SINGLE_CARD , //单牌-  
// 		DOUBLE_CARD, //对子-  
// 		THREE_CARD, //3不带-  
// 		BOMB_CARD, //炸弹  
// 		THREE_ONE_CARD, //3带1-  
// 		THREE_TWO_CARD, //3带2-  
// 		BOMB_TWO_CARD, //四个带2张单牌  
// 		BOMB_TWOOO_CARD, //四个带2对  
// 		CONNECT_CARD, //连牌-  
// 		COMPANY_CARD, //连队-  
// 		AIRCRAFT_CARD, //飞机不带-  
// 		AIRCRAFT_SINGLE_CARD, //飞机带单牌-  
// 		AIRCRAFT_DOBULE_CARD, //飞机带对子-  
// 		DOUBLE_JOKER, //王炸
// 		ERROR_CARD //错误的牌型  
// };


function getType(porks) {
	var upper = {};
	var types = pointType(porks);
	
	if (porks.length == 1) //单牌
	{
		upper.type = 'SINGLE_CARD';
		upper.length = 1;
		upper.max = types.singleValue[0];
	} else if (porks.length == 2) //对子，王炸，错牌
	{
		if (types.double) {
			upper.type = 'DOUBLE_CARD';
			upper.length = 1;
			upper.max = types.doubleValue[0];
		} else if (isDoubleJoker(porks)) {
			upper.type = 'DOUBLE_JOKER';
			upper.length = 1;
			upper.max = 17;
		} else {
			return false;
		}
	} else if (porks.length == 3) //三张不带，错牌
	{
		if (types.triple) {
			upper.type = 'THREE_CARD';
			upper.length = 1;
			upper.max = types.tripleValue[0];
		} else {
			return false;
		}
	} else if (porks.length == 4) //炸弹，三带一，错牌
	{
		if (types.bomb) {
			upper.type = 'BOMB_CARD';
			upper.length = porks.length;
			upper.max = types.bombValue[0];
		} else if (types.triple) {
			upper.type = 'THREE_ONE_CARD';
			upper.length = 1;
			upper.max = types.tripleValue[0];
		} else {
			return false;
		}
	} else if (porks.length == 5) //顺子，三带二，错牌
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else if (types.triple && types.double) {
			upper.type = 'THREE_TWO_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 6) //顺子,连对,飞机,四带2单
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else if (porks.length == types.triple * 3 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else if (types.bomb) {
			upper.type = 'BOMB_TWO_CARD';
			upper.length = types.bomb;
			upper.max = types.bombValue[0];
		} else {
			return false;
		}
	} else if (porks.length == 7) //顺子
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 8) //顺子,连对,飞机带单,四带2双
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) { //顺子
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) { //连对
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else if (porks.length == types.triple * 4 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_SINGLE_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else if (types.bomb == 1 && types.double == 2) {
			upper.type = 'BOMB_TWOOO_CARD';
			upper.length = types.bomb;
			upper.max = types.bombValue[0];
		} else {
			return false;
		}
	} else if (porks.length == 9) //顺子,飞机不带 3*3
	{


		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else if (porks.length == types.triple * 3 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 10) //顺子,飞机带对子,连对
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else if (porks.length == types.triple * 5 && isShunzi(types.tripleValue) && types.double == 2) {
			upper.type = 'AIRCRAFT_DOBULE_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 11) //顺子,
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 12) //顺子,飞机带单牌3*(3+1),连对,飞机不带4*3
	{
		if (porks.length == types.single && isShunzi(types.singleValue)) {
			upper.type = 'CONNECT_CARD';
			upper.length = types.single;
			upper.max = types.singleValue[types.singleValue.length - 1];
		} else if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else if (porks.length == types.triple * 3 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else if (porks.length == types.triple * 4 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_SINGLE_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 14) //连对
	{
		if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 15) //3*(3+2),5*3
	{
		if (porks.length == types.triple * 3 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else if (porks.length == types.triple * 5 && isShunzi(types.tripleValue) && types.double == types.triple) {
			upper.type = 'AIRCRAFT_SINGLE_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 16) //8*2,4*(3+1)
	{
		if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else if (porks.length == types.triple * 4 && isShunzi(types.tripleValue)) {
			upper.type = 'AIRCRAFT_SINGLE_CARD';
			upper.length = types.triple;
			upper.max = types.tripleValue[types.tripleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 18) //9*2
	{
		if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else {
			return false;
		}
	} else if (porks.length == 20) //10*2
	{
		if (porks.length == types.double * 2 && isShunzi(types.doubleValue)) {
			upper.type = 'COMPANY_CARD';
			upper.length = types.double;
			upper.max = types.doubleValue[types.doubleValue.length - 1];
		} else {
			return false;
		}
	}else{
		return false;
	}
	upper.porks = porks;
	upper.porkLength = porks.length;
	return upper;
}

function isThreeOne(porks) { //是否是3带1
	if (porks.length == 4) {
		for (var i = 0; i < porks.length; i++) {
			var newPorks = porks.slice();
			newPorks.splice(i, 1);
			if (newPorks[0].value == newPorks[1].value && newPorks[0].value == newPorks[2].value) {
				return true;
			}
		}
		return false;
	} else {
		return false;
	}
}

function isThreeTwo(porks) { //是否是3带2
	if (porks.length == 5) {
		for (var i = 0; i < porks.length; i++) {
			var newPorks = porks.slice();
			newPorks.splice(i, 1);
			if (isThreeOne(newPorks)) {
				if (newPorks[isThreeOne(newPorks)].value == porks[i].value) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	} else {
		return false;
	}
}

function isShunzi(porks) { //是否是顺子

	console.log(porks);
	porks.sort(function(a, b) { //排序
		return a - b;
	});
	if (porks[porks.length - 1] >= 15) { //是否包含2 鬼
		return false;
	}

	for (var i = 1; i < porks.length; i++) {
		if (porks[i] - porks[i - 1] != 1) {
			return false;
		}
	}
	return true;

}


function isDoubleJoker(porks) { //是否是王炸
	if (porks[0].point == 'fJ' && porks[1].point == 'tJ' || porks[0].point == 'tJ' && porks[1].point == 'fJ') {
		return true;
	} else {
		return false;
	}
}

function porkSort(porks) {
	var list = [];
	for (var i = 0; i < porks.length; i++) { //转化为大小值
		list.push(pai[porks[i].value])
	}
	list.sort(function(a, b) { //排序
		return a - b;
	});
	return list;
}



function pointType(porks) { //把相同大小的放在一起，统计数量
	// var list = porkSort(porks);
	porks.sort(function (a,b) {
		return a.value-b.value;
	})
	var obj = [];
	var objNum = 0;
	var single = 0,
		singleValue = [],
		double = 0,
		doubleValue = [],
		triple = 0,
		tripleValue = [],
		bomb = 0,
		bombValue = [];

	for (var i = 0; i < porks.length; i++) {
		if (!obj[porks[i].value]) {
			obj[porks[i].value] = 1;
		} else {
			obj[porks[i].value] += 1;
		}
	}
	
	for (var i in obj ) {
		if (obj[i]) {
			objNum += 1;
			if (obj[i] == 1) {
				single += 1
				singleValue.push(i);
			} else if (obj[i] == 2) {
				double += 1
				doubleValue.push(i);
			} else if (obj[i] == 3) {
				triple += 1
				tripleValue.push(i);
			} else if (obj[i] == 4) {
				bomb += 1
				bombValue.push(i);
			}
		}
	}
	var res = {};
	res.pointTypes = objNum;
	res.single = single;
	res.singleValue = singleValue;
	res.double = double;
	res.doubleValue = doubleValue;
	res.triple = triple;
	res.tripleValue = tripleValue;
	res.bomb = bomb;
	res.bombValue = bombValue;
	return res;
}

function judge(my, upper) { //判断出牌和上家的大小，判断能不能出牌
	console.log(my);
	console.log(upper);
	if (my.type == 'DOUBLE_JOKER') {
		return true;
	} else if (upper.type == 'DOUBLE_JOKER') {
		return false;
	} else if (my.type == 'BOMB_CARD' && !(upper.type == 'BOMB_CARD' && my.max < upper.max)) {
		return true;
	} else if (my.type == upper.type && my.porkLength == upper.porkLength && my.length == upper.length && parseInt(my.max) > parseInt(upper.max)) {
		return true;
	} else {
		return false;
	}
}