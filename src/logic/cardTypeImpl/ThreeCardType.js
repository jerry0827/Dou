
//三张牌的牌型
function ThreeCardType() {

	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare = function(a, b) {
		var c1 = a[0];
		var c2 = b[0];
		if (c1.getValue() > c2.getValue()) {
			return 1;
		} else {
			return 0;
		}
	}

	//说明：
	//参数：
	//返回：String
	this.getName = function() {
		return CardTypeString.THREE_CARDTYPE;
	}

	//说明：
	//参数：
	//返回：int
	this.getLength = function() {
		return 3;
	}

	//说明：
	//参数：List<BashaoCard> list
	//返回：boolean
	this.matches = function(list) {
		if (list != null) {
			if (list.length == 3) {
				var value1 = list[0].getValue();
				var value2 = list[1].getValue();
				var value3 = list[2].getValue();
				if (value1 == value2 && value2 == value3) {
					return true;
				}
			}
		}
		return false;
	}

	//说明：
	//参数：
	//返回：int
	this.getMinLength = function() {
		return 3;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast = function(playerList, preOneSendCard) {
		var osc;
		var b = preOneSendCard.getOneSendCardList()[0];

		var map = CardUtil.asValueStaticCount(playerList);
		var threeList = new Array();
		
		for(var k=0;k<map.entrySet().length;k++) {
			var entry = map.entrySet()[k];
			if (entry.value == 3) {
				threeList[threeList.length] = entry.key;
			}
		}
		if (threeList.length == 0) {
			// 如果没有3张相同牌
			return null;
		} else {
			// 如果有3张相同牌，找出牌中最小一个，但是比b的值大的那个
			var biggerButLeast = CardUtil.getBiggerButLeastFromList(threeList, b.getValue());
			if (biggerButLeast > 0) {
				// 找到且大于牌值
				var needList = CardUtil.getCardListByValueAndCount(playerList, biggerButLeast, 3);
				osc = new OneSendCard(needList, CardTypeString.THREE_CARDTYPE);
				return osc;
			} else {
				// 找到但是没有找到牌值大的
				return null;
			}

		}

	}

	//说明：
	//参数：List<BashaoCard> cards
	//返回：
	this.playSound = function(cards) {
//		SoundRes.playSound("three" + cards.get(0).getValue() + ".ogg");
	}

	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回：BiggerType
	this.getBiggerType = function(oneSendCard, num) {
		var biggest = 3;
		for (var i = 17; i >= 3; i--) {
			if (num.get(i) != null) {
				if (biggest < i) {
					biggest = i;
				}
			}
		}

		var valBiggest = 3;
		for(var k=0;k<oneSendCard.getOneSendCardList().length;k++) {
			var card = oneSendCard.getOneSendCardList()[k];
			if (valBiggest < card.getValue()) {
				valBiggest = card.getValue();
			}
		}

		// AAA一次打出去，多浪费，还不如拆成对子，单张呢
		if (valBiggest >= biggest) {
			return BiggerType.F;
		}
		if (valBiggest >= biggest - 1) {
			return BiggerType.E;
		}
		return BiggerType.D;
	}
	
	this.effectUrl=function(osc) {
		var i = osc.getOneSendCardList()[0];
		return "res/audio/three" + i + ".ogg";
	}
}
