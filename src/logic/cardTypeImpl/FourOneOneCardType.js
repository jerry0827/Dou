function FourOneOneCardType() {
	
	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare = function(a, b) {
		var mapA=CardUtil.asValueStaticCount(a);
		var mapB=CardUtil.asValueStaticCount(b);
		var keyA=0;
		var keyB=0;
		for(var i=0;i<mapA.entrySet().length;i++) {
			var entry = mapA.entrySet()[i];
			if(entry.value==4){
				keyA=entry.key;
			}
		
		}
		for(var i=0;i<mapB.entrySet().length;i++) {
			var entry = mapB.entrySet()[i];
			if(entry.value==4){
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
		return CardTypeString.FOURONEONE_CARDTYPE;
	}


	//说明：
	//参数：
	//返回：
	this.getLength = function() {
		// TODO Auto-generated method stub
		return 6;
	}

	//说明：
	//参数：List<BashaoCard> list
	//返回：boolean
	this.matches = function(list) {
		if(list!=null){
			if(list.length==6){
				var map=CardUtil.asValueStaticCount(list);
				if(map.size()==2||map.size()==3){//4带1对，或2单
					if(map.containsValue(4)){
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
	this.getMinLength = function() {
		return 6;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast = function(playerList, preOneSendCard) {
		var osc;
		// 4带2中，4个的那个牌值
		var preValue=0;
		var mapPre=CardUtil.asValueStaticCount(preOneSendCard.getOneSendCardList());
		for(var i=0;i<mapPre.entrySet().length;i++) {
			var entry = mapPre.entrySet()[i];
			if(entry.value==4){
				preValue=entry.key;
				break;
			}
			
		}
		
		var map=CardUtil.asValueStaticCount(playerList);
		var fourList = new Array();
		var oneList = new Array();
		for(var i=0;i<map.entrySet().length;i++) {
			var entry = map.entrySet()[i];
			if(entry.value==4){
				fourList[fourList.length] = entry.key;
			}
			if(entry.value==1){
				oneList[oneList.length] = entry.key;
			}
		}
		if(fourList.length==0){
			// 如果没有4张相同牌
			return null;
		}else{
			// 如果有4张相同牌，找出牌中最小一个，但是比b的值大的那个
			var biggerButLeast=CardUtil.getBiggerButLeastFromList(fourList,preValue);
			if(biggerButLeast>0){
				// 找到且大于牌值
				var needList=CardUtil.getCardListByValueAndCount(playerList,biggerButLeast,4);
				if(oneList.length>1){
					// 如果有两张单牌就带两张最小的单牌
					var leastList=CardUtil.getLeastFromList(oneList,2);
					for(var i=0;i<leastList.length;i++) {
						var oneCardList=CardUtil.getCardListByValueAndCount(playerList,i,1);
						needList[needList.length] = oneCardList[0]; 
					}
				}else{
					// 如果没有两张单牌，就从剩余牌中找两张张最小的牌
					var restList=CardUtil.getRestListByRemove(playerList,needList);
					if(restList.length==0){
						return null;
					}
					// 找到第一张
					var bc=CardUtil.getLeastCardFromCardList(restList);	
					needList[needList.length]=bc;
					// 找到第2张
					var aList=new Array();
					aList[aList.length]=bc;
					var restList2=CardUtil.getRestListByRemove(restList,aList);
					var bc2=CardUtil.getLeastCardFromCardList(restList2);
					needList[needList.length]=bc2;
				}
				osc=new OneSendCard(needList,CardTypeString.THREE_CARDTYPE);
				return osc;
			}else{
				// 找到但是没有找到牌值大的
				return null;
			}
		}
	}

	//说明：
	//参数：List<BashaoCard> cards
	//返回：
	this.playSound = function(cards) {
//		SoundRes.playSound("fourwithsingle.ogg");
	}

	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回：BiggerType
	this.getBiggerType = function(oneSendCard, num) {
		return BiggerType.F;
	}
	
	this.effectUrl=function(osc) {
		return "res/audio/fourwithsingle.ogg";
	}
}
