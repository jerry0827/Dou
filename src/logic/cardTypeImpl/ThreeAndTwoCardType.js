
//三带2的牌型
function ThreeAndTwoCardType() {
	
	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare = function(a, b) {
		var mapA=CardUtil.asValueStaticCount(a);
		var mapB=CardUtil.asValueStaticCount(b);
		var keyA=0;
		var keyB=0;
		
		
		for(var k=0;k<mapA.entrySet().length;k++) {
			var entry = mapA.entrySet()[k];
			if(entry.value==3){
				keyA=entry.key;
			}
		
		}
		for(var k=0;k<mapB.entrySet().length;k++) {
			var entry = mapB.entrySet()[k];
			if(entry.value==3){
				keyB=entry.key;
			}
		
		}
		if(keyA>keyB){
			return 1;
		}else{
			return 0;
		}
	}

	//说明：
	//参数：
	//返回：String
	this.getName = function() {
		// TODO Auto-generated method stub
		return CardTypeString.THREEANTWO_CARDTYPE;
	}


	//说明：
	//参数：
	//返回int
	this.getLength = function() {
		// TODO Auto-generated method stub
		return 5;
	}

	//说明：
	//参数：List<BashaoCard> list
	//返回boolean
	this.matches = function(list) {
		// TODO Auto-generated method stub
		if(list!=null){
			if(list.length==5){
				var map=CardUtil.asValueStaticCount(list);
				if(map.entrySet().length==2){
					if(map.containsValue(2)&&map.containsValue(3)){
						return true;
						
					}
				}
			}
		}
		return false;
	}

	//说明：
	//参数：
	//返回int
	this.getMinLength = function() {
		// TODO Auto-generated method stub
		return 5;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回OneSendCard
	this.getOneSendCardBiggerButleast = function(playerList, preOneSendCard) {
		var osc;
		//BashaoCard b=preOneSendCard.getOneSendCardList().get(0);
		// 三带一中，三个的那个值
		var preValue=0;
		var mapPre=CardUtil.asValueStaticCount(preOneSendCard.getOneSendCardList());
		
		for(var k=0;k<mapPre.entrySet().length;k++) {
			var entry = mapPre.entrySet()[k];
			if(entry.value==3){
				preValue=entry.key;
				break;
			}
			
		}
		
		var map=CardUtil.asValueStaticCount(playerList);
		var threeList = new Array();
		var twoList = new Array();
		
		for(var k=0;k<map.entrySet().length;k++) {
			var entry = map.entrySet()[k];
			if(entry.value==3){
				threeList[threeList.length] = entry.key;
			}
			if(entry.value==2){
				twoList[twoList.length]=entry.key;
			}
		}
		if(threeList.length==0){
			// 如果没有3张相同牌
			return null;
		}else{
			// 如果有3张相同牌，找出牌中最小一个，但是比b的值大的那个
			var biggerButLeast=CardUtil.getBiggerButLeastFromList(threeList,preValue);
			if(biggerButLeast>0){
				// 找到且大于牌值
				
				if(twoList.length>0){
					var needList=CardUtil.getCardListByValueAndCount(playerList,biggerButLeast,3);
					// 如果有就找最小的一对双牌
					var least=CardUtil.getMin(twoList);
					var twoCardList = CardUtil.getCardListByValueAndCount(playerList, least, 2);
					for(var k=0;k<twoCardList.length;k++) {
						needList[needList.length] = twoCardList[k];
					}
					osc=new OneSendCard(needList,CardTypeString.THREEANTWO_CARDTYPE);
					return osc;
				}else{
					// 如果没有双牌，就从剩余三张牌的类型中找
					if(threeList.length==1){
						return null;
					}else{
						// 有除要出的这个值之外的三张牌
						var moreBiggerButLeast=CardUtil.getBiggerButLeastFromList(threeList,biggerButLeast);
						var needList=CardUtil.getCardListByValueAndCount(playerList,moreBiggerButLeast,3);     
						var needList2=CardUtil.getCardListByValueAndCount(playerList,biggerButLeast,2);
						for(var k=0;k<needList2.length;k++) {
							needList[needList.length] = needList2[k];
						}
						osc=new OneSendCard(needList,CardTypeString.THREEANTWO_CARDTYPE);
						return osc;
					}
					
				}
				
				
			}else{
				// 找到但是没有找到牌值大的
				return null;
			}
	
		}
	}


	//说明：
	//参数：List<BashaoCard> cards
	//返回
	this.playSound = function(cards) {
		SoundRes.playSound("threewithpair.ogg");
	}
	
	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回BiggerType
	this.getBiggerType = function(oneSendCard, num) {
		var biggest = 3;
		for(var i=17;i>=3;i--) {
			if(num.get(i)!=null) {
				if(biggest<i) {
					biggest = i;
				}
			}
		}
		
		var valBiggest = 3;
		for(var k=0;k<oneSendCard.getOneSendCardList().length;k++) {
			var card = oneSendCard.getOneSendCardList()[k];
			if(valBiggest<card.getValue()) {
				valBiggest = card.getValue();
			}
		}
		
		//AAA一次打出去，多浪费，还不如拆成对子，单张呢
		if(valBiggest>=biggest) {
			return BiggerType.F;
		}
		if(valBiggest>=biggest-1) {
			return BiggerType.E;
		}
		return BiggerType.D;
	}
	
	this.effectUrl=function(osc) {
		return "res/audio/threewithpair.ogg";
	}
}
