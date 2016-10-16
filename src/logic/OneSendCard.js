//一次出牌
function OneSendCard(oneSendCardList,cardType,whoSend) {
	//一次出牌的列表
//	private List<BashaoCard> oneSendCardList;
	this.oneSendCardList=oneSendCardList;
	//牌型
//	private String cardType;
	this.cardType=cardType;

	//谁出的牌
//	private int whoSend;
	this.whoSend=whoSend;

	
	//计算压牌比值
	this.getBiggerRate = function() {
		if(this.cardType == CardTypeString.FOUR_CARDTYPE){
			return 1;
		} else if(this.cardType==CardTypeString.FOURONEONE_CARDTYPE
				||this.cardType==CardTypeString.FOURTWOTWO_CARDTYPE){
			return 1;
		}else if(this.cardType==CardTypeString.PLANE_CARDTYPE
				||this.cardType==CardTypeString.PLANEONE_CARDTYPE
				||this.cardType==CardTypeString.PLANETWO_CARDTYPE){
			//飞机的压牌比值为最大的三张的压牌比值
			var map=CardUtil.asValueStaticCount(this.oneSendCardList);
			var maxThree=0;
			for(var i=0;i<map.entrySet().length;i++) {
				var entry = map.entrySet()[i];
				if(entry.value==3){
					var temp=entry.key;
					if(temp>maxThree){
						maxThree=temp;
					}
				}
			}
			var cardList=CardUtil.getCardListByValueAndCount(this.oneSendCardList, maxThree, 3);
			var osc=new OneSendCard(cardList,CardTypeString.THREE_CARDTYPE);
			return osc.getBiggerRate();
		}else if(this.cardType==CardTypeString.ONEONETWOTWO_CARDTYPE
				||this.cardType==CardTypeString.ONETWOTHREE_CARDTYPE){
			var count=0;
			if(this.cardType==CardTypeString.ONEONETWOTWO_CARDTYPE){
				count=this.oneSendCardList.length/2;
			}else{
				count=this.oneSendCardList.length;
			}
			//共有多少种
			var total=13-count;
			//能压过多少种
			var minList=CardUtil.getLeastFromBashaoCardList(this.oneSendCardList, 1);
			var minValue=minList[0];
			var bigger=minValue-3;
			return bigger/total;
		}else if(this.cardType == CardTypeString.THREE_CARDTYPE){
			var total=13;
			var minList=CardUtil.getLeastFromBashaoCardList(this.oneSendCardList, 1);
			var minValue=minList[0];
			var bigger=minValue-3;
			return bigger/total;
		}else if(this.cardType==CardTypeString.THREEANDONE_CARDTYPE||
				this.cardType==CardTypeString.THREEANTWO_CARDTYPE){
			var map=CardUtil.asValueStaticCount(this.oneSendCardList);
			var maxThree=0;
			for(var i=0;i<map.entrySet().length;i++) {
				var entry= map.entrySet()[i];
				if(entry.value==3){
					var temp=entry.key;
					maxThree=temp;
					
				}
			}
			var cardList=CardUtil.getCardListByValueAndCount(this.oneSendCardList, maxThree, 3);
			var osc=new OneSendCard(cardList,CardTypeString.THREE_CARDTYPE);
			return osc.getBiggerRate();
		}else if(this.cardType==CardTypeString.DOUBLE_CARDTYPE
				||this.cardType==CardTypeString.SINGLE_CARDTYPE){
			
			var total=15;
			var minList=CardUtil.getLeastFromBashaoCardList(this.oneSendCardList, 1);
			var minValue=minList[0];
			if(this.cardType==CardTypeString.SINGLE_CARDTYPE){
				if(minValue==17){
					//大王
					return 1;
				}
			}
			if(this.cardType==CardTypeString.DOUBLE_CARDTYPE){
				if(minValue==15){
					//对2
					return 1;
				}
			}
			var bigger=minValue-3;
			return bigger/total;
		}
		return 0;
	}
	//计算被压牌比值
	this.getLittleRate = function(){
		return 0;
	}
	
	
	this.getOneSendCardList = function() {
		return this.oneSendCardList;
	}
	this.setOneSendCardList = function(oneSendCardList ){
		this.oneSendCardList = oneSendCardList;
		
	}

	this.getCardType = function() {
		return this.cardType;
	}

	this.setCardType = function(cardType) {
		this.cardType = cardType;
	}

	this.getWhoSend = function() {
		return this.whoSend;
	}

	this.setWhoSend = function(whoSend) {
		this.whoSend = whoSend;
	}

	this.toString = function() {
		var total="";
		for(var i=0;i<this.oneSendCardList.length;i++) {
			/*try{
				console.log("==>" + this.oneSendCardList[i]);
				total+=this.oneSendCardList[i].value;
			}catch (e) {
				console.log(e + "===============================================>" + this.oneSendCardList[i]);
			}*/
			total+=this.oneSendCardList[i].value;
		}
		return total;
	}	
}


OneSendCard.sortFunction = function(v1, v2){
	if(v1 instanceof BashaoCard) {
		if(v1.value==v2.value) {
			return v1.clr - v2.clr;
		}
		return v1.value-v2.value;
	} else if(v1 instanceof Number) {
		return v1-v2;
	} else {
		return 0;
	}
}
