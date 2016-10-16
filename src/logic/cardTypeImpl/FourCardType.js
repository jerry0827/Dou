function FourCardType() {

	//说明：
	//参数：List<BashaoCard> a, List<BashaoCard> b
	//返回：int
	this.compare=function(a, b) {
		var c1=a[0];
		var c2=b[0];
		if(c1.getValue()==16||c1.getValue()==17){
			return 1;
		}
		if(c2.getValue()==16||c2.getValue()==17){
			return 0;
		}
		if(c1.getValue()>c2.getValue()){
			return 1;
		}else{
			return 0;
		}
	}

	//说明：
	//参数：
	//返回：String
	this.getName=function() {
		return CardTypeString.FOUR_CARDTYPE;
	}

	//说明：
	//参数：
	//返回：int
	this.getLength=function() {
		return 4;
	}

	//说明：
	//参数：List<BashaoCard> list
	//返回：boolean
	this.matches=function(list) {
		if(list!=null && list.length>0){
			if(list.length==4){
				var value1=list[0].getValue();
				var value2=list[1].getValue();
				var value3=list[2].getValue();
				var value4=list[3].getValue();
				if(value1==value2&&value2==value3&&value3==value4){
					return true;
				}
			}else if(list.length==2){
				var value1=list[0].getValue();
				var value2=list[1].getValue();
				if((value1==16||value1==17)&&(value2==16||value2==17)){
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
		return 4;
	}

	//说明：
	//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
	//返回：OneSendCard
	this.getOneSendCardBiggerButleast=function(playerList, preOneSendCard) {
		var osc;
		var b=preOneSendCard.getOneSendCardList()[0];

		var map=CardUtil.asValueStaticCount(playerList);
		var fourList = new Array();
		for(var i=0;i<map.entrySet().length;i++) {
			var entry = map.entrySet()[i];
			if(entry.value==4){
				fourList[fourList.length] = entry.key;
			}
		}
		if(fourList.length==0){
			// 如果没有4张相同牌
			return this.getKingBomb(playerList);
		}else{
			// 如果有4张相同牌，找出牌中最小一个，但是比b的值大的那个
			var biggerButLeast=CardUtil.getBiggerButLeastFromList(fourList,b.getValue());
			if(biggerButLeast>0){
				// 找到且大于牌值
				var needList=CardUtil.getCardListByValueAndCount(playerList,biggerButLeast,4);
				osc=new OneSendCard(needList,CardTypeString.FOUR_CARDTYPE);
				return osc;
			}else{
				// 找到但是没有找到牌值大的
				return this.getKingBomb(playerList);
			}
	
		}
	}
	
	/**
	 * 找王炸弹，如果没有返回null
	 * 
	 * @param playerList
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> playerList
	//返回：OneSendCard
	this.getKingBomb=function(playerList) {
		var oneSendCard;
		var c1;
		var c2;
		for(var i=0;i<playerList.length;i++) {
			var bc = playerList[i];
			if(bc.getValue()==16){
				c1=bc;
			}
			if(bc.getValue()==17){
				c2=bc;
			}
		}
		if(c1!=null&&c2!=null){
			var cardList=new Array();
			cardList[cardList.length] = c1;
			cardList[cardList.length] = c2;
			oneSendCard=new OneSendCard(cardList,CardTypeString.FOUR_CARDTYPE);
			return oneSendCard;
		}else{
			return null;
		}
	}


	//说明：
	//参数：List<BashaoCard> cards
	//返回：
	this.playSound=function(cards) {
		if(cards[0].getValue()!=cards[1].getValue()) {
//			SoundRes.playSound("bombjoker.ogg");
		} else {
//			SoundRes.playSound("bomb.ogg");
		}
	}

	//说明：
	//参数：OneSendCard oneSendCard, Map<Integer, Integer> num
	//返回：BiggerType
	this.getBiggerType=function(oneSendCard, num) {
		return BiggerType.F;
	}
	
	this.effectUrl=function(osc) {
		if(osc.getOneSendCardList().length==2) {
			return "res/audio/bombjoker.ogg";
		}
		return "res/audio/bomb.ogg";
	}
}
