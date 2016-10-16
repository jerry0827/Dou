
//飞机牌带一张单牌的牌型
function PlaneOneCardType() {

	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare=function(a, b) {
		// TODO Auto-generated method stub
		// 把牌去除掉单牌，调用plane的比较算法
		var aRest = CardUtil.removeByCount(a, 1);
		var bRest = CardUtil.removeByCount(b, 1);
		var ret = new PlaneCardType().compare(aRest, bRest);
		return ret;
	}

	//说明：
	//参数：
	//返回：String
	this.getName=function() {
		// TODO Auto-generated method stub
		return CardTypeString.PLANEONE_CARDTYPE;
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
			// 333444 56或333444555 789
			// 除以4得到的商，将所有牌求得一个map《value,count》count为同一个value的个数，count>3的个数要大于商
			if (list.length >= 8 && list.length % 4 == 0) {
				var shang = list.length / 4;
				var map = CardUtil.asValueStaticCount(list);
				var count = 0;
				// 将大于3个的值放到list中，如果大于3个的值是3，4，5类型且最大不超过14
				var count3 = new Array();

				for(var i=0;i<map.entrySet().length;i++) {
					var entry = map.entrySet()[i];
					if (entry.value >= 3) {
						count++;
						count3[count3.length]=entry.key;
					}
				}
				if (shang == count) {
					// 商相等，并且这个shang个key为3，4，5类型且最大不超过14
					count3.sort(OneSendCard.sortFunction);
					for (var i = 1; i < count3.length; i++) {
						var pre = count3[i - 1];
						var curr = count3[i];
						if (curr != pre + 1) {
							return false;
						}
					}
					if (count3[count3.length - 1] <= 14) {
						return true;
					}
				}
			}
		}
		return false;
	}

	//说明：
	//参数：
	//返回：int
	this.getMinLength=function() {
		// TODO Auto-generated method stub
		return 8;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast=function(playerList, preOneSendCard) {
		if (playerList.length < preOneSendCard.getOneSendCardList().length) {
			// 如果牌数不够直接返回
			return null;
		}

		// 去除单牌，调用飞机的压牌算法，再从剩余的牌中找出3张单牌就ok了
		var aRest = CardUtil.removeByCount(preOneSendCard.getOneSendCardList(), 1);
		var newPreOneSendCard = new OneSendCard(aRest, CardTypeString.PLANE_CARDTYPE);
		var pCardType = new PlaneCardType();
		var retOsc = null;
		var osc = pCardType.getOneSendCardBiggerButleast(playerList, newPreOneSendCard);

		if (osc == null) {
			// 如果飞机都压不了，那么加上单牌还是压不了
			return null;
		} else {
			// 能压住，再从剩余的牌中找3张单牌
			// 先获取剩余牌
			var restList = CardUtil.getRestListByRemove(playerList, osc.getOneSendCardList());
			// 有多少个3张一样并且相连的
			var count = preOneSendCard.getOneSendCardList().length / 4;
			var needList = CardUtil.getSingleCardListBy(restList, count);
			// 飞机可以压住的牌的list
			var newList = osc.getOneSendCardList();
			for(var k=0;k<needList.length;k++) {
				newList[newList.length] = needList[k];
			}
			retOsc = new OneSendCard(newList, CardTypeString.PLANEONE_CARDTYPE);
			return retOsc;
		}

	}

	//说明：
	//参数：
	//返回：List<BashaoCard> cards
	this.playSound=function(cards) {
		SoundRes.playSound("threestraight.ogg");
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
