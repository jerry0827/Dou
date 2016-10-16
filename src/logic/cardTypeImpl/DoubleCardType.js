

// 两张牌的牌型
function DoubleCardType() {

	//List<BashaoCard> a, List<BashaoCard> b
	this.compare=function(a, b) {
		var c1=a[0];
		var c2=b[0];
		if(c1.value>c2.value){
			return 1;
		}else{
			return 0;
		}
	}

	this.getName = function() {
		return CardTypeString.DOUBLE_CARDTYPE;
	}


	this.getLength = function() {
		return 2;
	}

	//List<BashaoCard> 
	this.matches=function(list) {
		if(list==null||list.length!=2){
			return false;
		}else{
			return list[0].value==list[1].value;
		}
	}

	this.getMinLength = function() {
		return 2;
	}

	//返回OneSendCard
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	this.getOneSendCardBiggerButleast = function(playerList, preOneSendCard) {
		var osc;
		var b=preOneSendCard.getOneSendCardList()[0];

		var map=CardUtil.asValueStaticCount(playerList);
		var doubleList = new Array();
		for(var i=0;i<map.entrySet().length;i++) {
			var entry = map.entrySet()[i];
			if(entry.value==2){
				doubleList[doubleList.length]=entry.key;
			}
		}
		if(doubleList.length==0){
			// 如果没有对牌,就找3张牌
			osc=this.findTwoInThree(playerList,b.getValue);
		}else{
			// 如果有对牌，找出对牌中最小一个，但是比b的值大的那个
			doubleList.sort(OneSendCard.sortFunction);
			var findValue=0;
			for(var i=0;i<doubleList.length;i++) {
				var o = doubleList[i];
				var i = o;
				
				if(i>b.value) {
					findValue=i;
					break;
				}
			}
			if(findValue>0){
				// 如果找到大于出牌的牌
				var findList=new Array();
				var count=0;
				for(var i=0;i<playerList.length;i++) {
					var bc = playerList[i];
					if(bc.value == findValue) {
						findList[findList.length]=bc;
						count++;
						if(count==2) {
							osc=new OneSendCard(findList,CardTypeString.DOUBLE_CARDTYPE);
							return osc;
						}
					}
				}
			}else{
				// 如果没有找到大于出牌的牌
				osc=this.findTwoInThree(playerList,b.value);
			}
		}
		return osc;
	}
	
	//从数量为3的牌中找一个大于value值的最小两张牌
	//List<BashaoCard> playerList, int value
	this.findTwoInThree = function(playerList, value) {
		var osc;
		var map3=CardUtil.asValueStaticCountByValue(playerList, 3);
		var set = map3.keys();
		var list=new Array();
		
		if(set.length>0){
			// 3张牌中找到
			for(var i=0;i<set.length;i++) {
				list[list.length]=set[i];
			}
			var biggerButLeast=CardUtil.getBiggerButLeastFromList(list,value);
			if(biggerButLeast>0){
				// 找到且大于牌值
				var needList=CardUtil.getCardListByValueAndCount(playerList,biggerButLeast,2);
				osc=new OneSendCard(needList,CardTypeString.DOUBLE_CARDTYPE);
				return osc;
			}else{
				// 找到但是没有找到牌值大的
				return null;
			}
			
		}else{
			// 3张牌中没有找到
			return null;
		}
	}


	//List<BashaoCard> cards
	this.playSound = function(cards) {
		//SoundRes.playSound("pair" + cards.get(0).getValue() + ".ogg");
	}

	//OneSendCard oneSendCard, Map<Integer, Integer> num
	this.getBiggerType = function(oneSendCard, num) {
		var value = oneSendCard.getOneSendCardList()[0].getValue();
		var biggest = 3;
		var smallest = 17;
		for(var i=17;i>=3;i--) {
			if(num.get(i)!=null && num.get(i)>=2) {
				if(biggest<i) {
					biggest = i;
				}
				if(smallest>i) {
					smallest = i;
				}
			}
		}
		
//		3最小      4-7极差       8-10差      J-K好         A极好		  2最大
		if(value<=smallest) {
			return BiggerType.A;
		}
		if(value<=smallest+4) {
			return BiggerType.B;
		}
		if(value<=smallest+7) {
			return BiggerType.C;
		}
		if(value>=biggest) {
			return BiggerType.F;
		}
		if(value>=biggest-1) {
			return BiggerType.E;
		}
		return BiggerType.D;
	}
	
	this.effectUrl=function(osc) {
		var i = osc.getOneSendCardList()[0].value;
		return "res/audio/pair" + i + ".ogg";
	}
}
