
//拆牌方案类
function DevidedCardSolution(oneSendCards,singleOrDouble) {
	//拆牌的每一手牌 		List<OneSendCard>
	this.oneSendCards=oneSendCards;
	//剩余的对牌或单牌	List<OneSendCard>
	this.singleOrDouble=singleOrDouble;
	
	//说明：获取单牌手数，用于选择最优方案 单牌手数， 炸弹可将单牌手数-2.5 飞机（x连续个）可将单牌手数-x（x>2）
	//参数：
	//返回：double
	this.getSingleCount=function(){
		// 初始值为singleOrDouble
		var initCount = 0;
		if(this.singleOrDouble!=null) {
			initCount = this.singleOrDouble.length;
		}
		if(this.oneSendCards!=null){
			for(var k=0;k<this.oneSendCards.length;k++) {
				var osc = this.oneSendCards[k];
				if(osc.getCardType()==CardTypeString.FOUR_CARDTYPE){
					initCount=initCount-2.5;
				}else if(osc.getCardType()==CardTypeString.PLANE_CARDTYPE){
					initCount=initCount-osc.getOneSendCardList().length/3;
				}
			}
		}
		return initCount;
	}

	//说明：
	//参数：
	//返回：List<OneSendCard>
	this.getOneSendCards=function() {
		return this.oneSendCards;
	}

	//说明：
	//参数：List<OneSendCard> oneSendCards
	//返回：
	this.setOneSendCards=function(oneSendCards) {
		this.oneSendCards = oneSendCards;
	}

	//说明：
	//参数：
	//返回：List<OneSendCard>
	this.getSingleOrDouble=function() {
		return this.singleOrDouble;
	}

	//说明：
	//参数：List<OneSendCard> singleOrDouble
	//返回：
	this.setSingleOrDouble=function(singleOrDouble) {
		this.singleOrDouble = singleOrDouble;
	}

	//说明：
	//参数：
	//返回：String
	this.toString=function() {
		var total="";
		if(this.oneSendCards!=null){
			for(var k=0;k<this.oneSendCards.length;k++) {
				var osc = this.oneSendCards[k];
				total += osc.getCardType() + ":" + osc.toString() + "    ";
			}
		}
		if(this.singleOrDouble!=null){
			for(var k=0;k<this.singleOrDouble.length;k++) {
				var osc = this.singleOrDouble[k];
				total += osc.getCardType() + ":" + osc.toString() + "    ";
			}
		}

		total += "单牌手数:" + this.getSingleCount();
		return total;
	}
	
}
