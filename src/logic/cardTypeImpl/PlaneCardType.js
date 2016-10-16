
//飞机牌的牌型
function PlaneCardType() {

	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare=function(a, b) {
		var arr1 = CardUtil.sortCardList(a);
		var arr2 = CardUtil.sortCardList(b);
		if (arr1.length != arr2.length) {
			return -1;
		} else {
			if (arr1[arr1.length - 1] > arr2[arr2.length - 1]) {
				return 1;
			} else {
				return -1;
			}
		}
	}

	//说明：
	//参数：
	//返回：String
	this.getName=function() {
		// TODO Auto-generated method stub
		return CardTypeString.PLANE_CARDTYPE;
	}

	//说明：
	//参数：
	//返回：int
	this.getLength=function() {
		// TODO Auto-generated method stub
		return 0;
	}

	//说明：
	//参数：List<BashaoCard> list
	//返回：boolean
	this.matches=function(list) {
		if (list != null) {
			// 333444或333444555
			if (list.length >= 6 && list.length % 3 == 0) {
				list.sort(OneSendCard.sortFunction);
				var b = true;
				var card = list[0];
				var minValue = card.getValue();
				for (var i = 0; i < list.length; i++) {
					var c = list[i];
					cc.log(c.getValue() + "---" + minValue + "---" + Math.floor(i/3) + (minValue + Math.floor(i/3)));
					if (c.getValue() != (minValue + Math.floor(i/3))) {
						b = false;
					}
				}

				return b;
			}
		}
		return false;
	}

	//说明：
	//参数：
	//返回：int
	this.getMinLength=function() {
		// TODO Auto-generated method stub
		return 6;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast=function(playerList, preOneSendCard) {
		var preList = preOneSendCard.getOneSendCardList();
		var intArr = CardUtil.sortCardList(preList);
		// 获取连队的最大的那个值
		var preMaxValue = intArr[intArr.length - 1];
		var preMinValue = intArr[0];
		var preCount = intArr.length / 3;

		var map = CardUtil.asValueStaticCount(playerList);
		if (preMaxValue >= 14) {
			return null;
		} else {
			// 连续牌值的个数
			var count = 0;
			var start = 0;
			// 14是 A
			for (var i = preMinValue + 1; i <= 14; i++) {
				// int
				var o = map.get(i);
				if (o != null && o == 3) {
					// 如果有这张牌且个数大于等于3
					if (start == 0) {
						// 如果start被置零，给start赋值
						start = i;
					}
					count++;
				} else {
					// 断掉一张牌要重新开始
					count = 0;
					start = 0;
				}
				if (count == preCount) {
					// 数量已经够了，就返回
					break;
				}
			}
			var needList = new Array();
			if (count >= preCount) {
				// 找到连字
				for (var i = start; i < start + preCount; i++) {
					var list = CardUtil.getCardListByValueAndCount(playerList, i, 3);
					for(var k=0;k<list.length;k++) {
						needList[needList.length] = list[k];
					}
				}
				var osc = new OneSendCard(needList, CardTypeString.PLANE_CARDTYPE);
				return osc;
			} else {
				// 没有找到合适的牌
				return null;
			}
		}
	}

	//说明：
	//参数：List<BashaoCard> cards
	//返回：
	this.playSound=function(cards) {
//		SoundRes.playSound("threestraight.ogg");
	}

	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回：BiggerType
	this.getBiggerType=function(oneSendCard, num) {
		var biggest = 3;
		for (var i = 17; i >= 3; i--) {
			if (num.get(i) != null) {
				if (biggest < i) {
					biggest = i;
				}
			}
		}

		var valBiggest = 3;
		for(var i=0;i<oneSendCard.getOneSendCardList().length;i++) {
			var card = oneSendCard.getOneSendCardList()[i];
			if (valBiggest < card.getValue()) {
				valBiggest = card.getValue();
			}
		}

		// KKKAAA一次打出去，多浪费，还不如拆成对子，单张呢
		if (valBiggest >= biggest) {
			return BiggerType.F;
		}
		if (valBiggest >= biggest - 1) {
			return BiggerType.E;
		}
		return BiggerType.D;
	}
	
	this.effectUrl=function(osc) {
		return "res/audio/threestraight.ogg";
	}
}
