//连子牌的牌型
function OneTwoThreeCardType() {

	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare=function(a, b) {
		if (a.length != b.length) {
			// 连子的数量不一样
			return -1;
		} else {
			// 如果a的最大牌大于b的最大牌就返回1
			var arr1 = new Array();
			var arr2 = new Array();
			var i = 0;
			for(var m=0;m<a.length;m++) {
				var bc = a[m];
				arr1[i] = bc.getValue();
				i++;
			}
			var j = 0;
			for(var k=0;k<b.length;k++) {
				var bc = b[k];
				arr2[j] = bc.getValue();
				j++;
			}
			arr1.sort(OneSendCard.sortFunction);
			arr2.sort(OneSendCard.sortFunction);
			var max1 = arr1[arr1.length - 1];
			var max2 = arr2[arr2.length - 1];
			if (max1 > max2) {
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
		return CardTypeString.ONETWOTHREE_CARDTYPE;
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
		// TODO Auto-generated method stub
		if (list != null) {
			if (list.length >= 5) {
				list.sort(OneSendCard.sortFunction);
				var b = true;
				for (var i = 1; i < list.length; i++) {
					var c1 = list[i - 1];
					var c2 = list[i];
					if (c2.getValue() != c1.getValue() + 1) {
						// 有一个不等于前面的值+1;
						b = false;
					}
				}
				// 如果最后一张牌是>=2,也不是连子
				var card = list[list.length - 1];
				if (card.getValue() >= 15) {
					b = false;
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
		return 5;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast=function(playerList, preOneSendCard) {
		var preList = preOneSendCard.getOneSendCardList();
		var intArr = CardUtil.sortCardList(preList);
		// 获取龙的最大的那个值
		var preMaxValue = intArr[intArr.length - 1];
		var preMinValue = intArr[0];
		var preCount = intArr.length;
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
				if (o != null && o > 0) {
					// 如果有这张牌
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
					var list = CardUtil.getCardListByValueAndCount(playerList, i, 1);
					needList[needList.length]=list[0];
				}
				var osc = new OneSendCard(needList, CardTypeString.ONETWOTHREE_CARDTYPE);
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
		SoundRes.playSound("straight.ogg");
	}

	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回：BiggerType
	this.getBiggerType=function(oneSendCard, num) {
		var biggest = 3;
		for(var i=0;i<oneSendCard.getOneSendCardList().length;i++) {
			var card = oneSendCard.getOneSendCardList()[i];
			if (biggest < card.getValue()) {
				biggest = card.getValue();
			}
		}
		for (var i = 17; i >= 3; i--) {
			if (num.get(i) != null) {
				if (biggest == i && biggest != 15) {
					return BiggerType.F;
				} else {
					break;
				}
			}
		}
		if (biggest >= 13) {
			return BiggerType.E;
		}
		if (biggest >= 11) {
			return BiggerType.D;
		}
		return BiggerType.C;
	}
	
	this.effectUrl=function(osc) {
		return "res/audio/straight.ogg";
	}
}
