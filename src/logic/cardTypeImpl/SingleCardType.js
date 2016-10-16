
//单张牌的牌型
function SingleCardType() {

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
		return CardTypeString.SINGLE_CARDTYPE;
	}

	//说明：
	//参数：
	//返回：int
	this.getLength = function() {
		return 1;
	}

	//说明：
	//参数：List<BashaoCard> list
	//返回：boolean
	this.matches = function(list) {
		if (list != null) {
			if (list.length > 0 && list.length == 1) {
				return true;
			}
		}
		return false;
	}
	
	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast = function(playerList, preOneSendCard) {
		var osc = null;
		var b = preOneSendCard.getOneSendCardList()[0];
		var map = CardUtil.asValueStaticCount(playerList);
		var singleList = new Array();
		
		for(var k=0;k<map.entrySet().length;k++) {
			var entry = map.entrySet()[k];
			if (entry.value == 1) {
				singleList[singleList.length]=entry.key;
			}
		}
		if (singleList.length == 0) {
			// 如果没有单牌,就找一个比张牌大的牌就行了
			for(var k=0;k<playerList.length;k++) {
				var bc = playerList[k];
				if (bc.getValue() > b.getValue()) {
					var findList = new Array(bc);
					osc = new OneSendCard(findList, CardTypeString.SINGLE_CARDTYPE);
					return osc;
				}
			}
		} else {
			// 如果有单牌，找出单牌中最小一个，但是别b的值大的那个
			singleList.sort(OneSendCard.sortFunction);
			var findValue = 0;
			for(var k=0;k<singleList.length;k++) {
				if (singleList[k] > b.getValue()) {
					findValue = singleList[k];
					break;
				}
			}
			if (findValue > 0) {
				// 如果找到
				for(var k=0;k<playerList.length;k++) {
					var bc = playerList[k];
					if (bc.getValue() == findValue) {
						var findList = new Array(bc);
						osc = new OneSendCard(findList, CardTypeString.SINGLE_CARDTYPE);
						return osc;
					}
				}
			} else {
				// 如果没有找到
				for(var k=0;k<playerList.length;k++) {
					var bc = playerList[k];
					if (bc.getValue() > b.getValue()) {
						var findList = new Array(bc);
						osc = new OneSendCard(findList, CardTypeString.SINGLE_CARDTYPE);
						return osc;
					}
				}
			}
		}
		return null;
	}

	//说明：
	//参数：
	//返回：int
	this.getMinLength = function() {
		return 1;
	}

	//说明：
	//参数：List<BashaoCard> cards
	//返回：
	this.playSound = function(cards) {
		SoundRes.playSound("single" + cards.get(0).getValue() + ".ogg");
	}

	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回：BiggerType
	this.getBiggerType = function(oneSendCard, num) {
		var value = oneSendCard.getOneSendCardList()[0].getValue();
		var biggest = 3;
		var smallest = 17;
		for (var i = 17; i >= 3; i--) {
			if (num.get(i) != null && num.get(i) >= 1) {
				if (biggest < i) {
					biggest = i;
				}
				if (smallest > num.get(i)) {
					smallest = i;
				}
			}
		}
		if (smallest >= value) {
			return BiggerType.A;
		}
		if (smallest + 1 >= value) {
			return BiggerType.B;
		}
		if (biggest <= value) {
			return BiggerType.F;
		}
		if (value>=biggest - 1) {
			return BiggerType.E;
		}
		if(value>=biggest-3) {
			return BiggerType.D;
		}
		return BiggerType.C;
	}
	
	this.effectUrl=function(osc) {
		var i = osc.getOneSendCardList()[0].value;
		return "res/audio/single" + i + ".ogg";
	}
}
