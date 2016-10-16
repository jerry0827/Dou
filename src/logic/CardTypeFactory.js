/**
 * 牌型工厂方法
 * @author Administrator
 *
 */
function CardTypeFactory() {}

CardTypeFactory.cardTypeStrings=new Array(CardTypeString.SINGLE_CARDTYPE);

CardTypeFactory.cardTypes=new Array(
		new SingleCardType(),
		new DoubleCardType(),
		new ThreeCardType(),
		new FourCardType(),
		new ThreeAndOneCardType(),
		new ThreeAndTwoCardType(),
		new FourOneOneCardType(),
		new FourTwoTwoCardType(),
		new OneTwoThreeCardType(),
		new OneOneTwoTwoCardType(),
		new PlaneCardType(),
		new PlaneOneCardType(),
		new PlaneTwoCardType()
	); 


/**
 * 根据传入的字符串返回牌型
 * @param cardTypeString 牌型的字符串
 * @return  牌型的实例
 */
//说明：
//参数：String cardTypeString
//返回：ICardType
CardTypeFactory.getCardTypeByCardTypeString=function(cardTypeString){
	if(cardTypeString==CardTypeString.SINGLE_CARDTYPE){
		return new SingleCardType();
	}else if(cardTypeString==CardTypeString.DOUBLE_CARDTYPE){
		return new DoubleCardType();
	}
	else if(cardTypeString==CardTypeString.THREE_CARDTYPE){
		return new ThreeCardType();
	}else if(cardTypeString==CardTypeString.FOUR_CARDTYPE){
		return new FourCardType();
	}else if(cardTypeString==CardTypeString.THREEANDONE_CARDTYPE){
		return new ThreeAndOneCardType();
	}else if(cardTypeString==CardTypeString.THREEANTWO_CARDTYPE){
		return new ThreeAndTwoCardType();
	}else if(cardTypeString==CardTypeString.FOURONEONE_CARDTYPE){
		return new FourOneOneCardType();
	}else if(cardTypeString==CardTypeString.FOURTWOTWO_CARDTYPE){
		return new FourTwoTwoCardType();
	}else if(cardTypeString==CardTypeString.ONETWOTHREE_CARDTYPE){
		return new OneTwoThreeCardType();
	}else if(cardTypeString==CardTypeString.ONEONETWOTWO_CARDTYPE){
		return new OneOneTwoTwoCardType();
	}else if(cardTypeString==CardTypeString.PLANE_CARDTYPE){
		return new PlaneCardType();
	}else if(cardTypeString==CardTypeString.PLANEONE_CARDTYPE){
		return new PlaneOneCardType();
	}else if(cardTypeString==CardTypeString.PLANEONE_CARDTYPE){
		return new PlaneOneCardType();
	}
	else if(cardTypeString==CardTypeString.PLANETWO_CARDTYPE){
		return new PlaneTwoCardType();
	}
	return null;
}
/**
 * 通过遍历类型，返回该类型字符串
 * @param list
 * @return
 */
//说明：
//参数：List<BashaoCard> list
//返回：String
CardTypeFactory.getCardType=function(list){
	for(var i=0;i<CardTypeFactory.cardTypes.length;i++) {
		var cardType = CardTypeFactory.cardTypes[i];
		if(cardType.matches(list)){
			return cardType.getName();
		}
	}
	return CardTypeString.NONE_CARDTYPE;
	
}
/**
 * 找出压牌的出牌，首先从最优方案中能够压牌的 OneSendCard，如果不存在，则再调用
 * getOneSendCardBiggerButleast找到一个可以压牌的OneSendCard
 * @param playerList 所有的牌
 * @param preOneSendCard 上一次出的牌
 * @return
 */
//说明：
//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
//返回：OneSendCard
CardTypeFactory.getBiggerOneSendCard=function(playerList, preOneSendCard){
	var dcsf=DevidedCardSolutionFactory.getInstance();
	var solutions=new Array();
	var currSolution;
	dcsf.getDevidedCardSolution(playerList, solutions, currSolution);
	var bestSolution=dcsf.getBestDevidedCardSolution(solutions);
	
	var biggerList=new Array();
	var spliteDouble=new Array();
	
	
	//在没有匹配单牌时找
	if(preOneSendCard.getCardType()==CardTypeString.SINGLE_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.DOUBLE_CARDTYPE){
		//
		//在单牌和双牌中找
		if(bestSolution.getSingleOrDouble()!=null){
			for(var m=0;m<bestSolution.getSingleOrDouble().length;m++) {
				var osc = bestSolution.getSingleOrDouble()[m];
				if(osc.getCardType()==preOneSendCard.getCardType()){
					//如果类型相同
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					if(cardType.compare(osc.getOneSendCardList(),preOneSendCard.getOneSendCardList() )>0){
						//如果大于，则加入到biggerList中
						
						biggerList[biggerList.length]=osc;
					}
				}else if(preOneSendCard.getCardType()==CardTypeString.SINGLE_CARDTYPE 
						&& osc.getCardType()==CardTypeString.DOUBLE_CARDTYPE) {
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					var list = osc.getOneSendCardList().slice(0, 1);
					if(cardType.compare(list,preOneSendCard.getOneSendCardList() )>0){
						spliteDouble[spliteDouble.length]=new OneSendCard(list, preOneSendCard.getCardType());
					}
				}
			}
		}
		

	}else if(preOneSendCard.getCardType()==CardTypeString.THREEANDONE_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.THREEANTWO_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.PLANEONE_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.PLANETWO_CARDTYPE){
		//如果是这几种类型，需要在匹配了单牌后找
		dcsf.dispatchSingleOrDouble(bestSolution);
		//在非单牌和非双牌中找
		if(bestSolution.getOneSendCards()!=null){
			for(var m=0;m<bestSolution.getOneSendCards().length;m++) {
				var osc = bestSolution.getOneSendCards()[m];
				if(osc.getCardType()==preOneSendCard.getCardType()){
					//如果类型相同
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					if(cardType.compare(osc.getOneSendCardList(),preOneSendCard.getOneSendCardList() )>0){
						//如果大于，则加入到biggerList中
						biggerList[biggerList.length]=osc;
					}
				}
			}
		}
	
	}else{
		//在非单牌和非双牌中找
		if(bestSolution.getOneSendCards()!=null){
			for(var m=0;m<bestSolution.getOneSendCards().length;m++) {
				var osc = bestSolution.getOneSendCards()[m];
				if(osc.getCardType()==preOneSendCard.getCardType()){
					//如果类型相同
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					if(cardType.compare(osc.getOneSendCardList(),preOneSendCard.getOneSendCardList() )>0){
						//如果大于，则加入到biggerList中
						biggerList[biggerList.length]=osc;
					}
				}
			}
		}

	}
	
	//如果最优方案中普通类型找不到，尝试找最优方案中的炸弹类型
	var zadan = new Array();
	if(bestSolution.getOneSendCards()!=null){
		for(var m=0;m<bestSolution.getOneSendCards().length;m++) {
			var osc = bestSolution.getOneSendCards()[m];
			if(osc.getCardType()==CardTypeString.FOUR_CARDTYPE){
				//如果是炸弹
				var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
				if(!preOneSendCard.getCardType()==CardTypeString.FOUR_CARDTYPE){
					//如果之前不是炸弹，则加入到biggerList中
//					biggerList.add(osc);
					zadan[zadan.length]=osc;
				}else{
					//如果之前也是炸弹
					if(cardType.compare(osc.getOneSendCardList(), preOneSendCard.getOneSendCardList())>0){
//						biggerList.add(osc);
						zadan[zadan.length]=osc;
					}
				}
			}
		}
	}
	
	
	if(biggerList.length>0) {
		//找到了大于
		if(biggerList.length==1){
			return biggerList[0];
		}else{
			//如果找到的数量大于1
			//通过比较大小的方式，找到所有牌中最小的那个
			var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
			var osc=biggerList[0];
			for(var m=0;m<biggerList.length;m++) {
				var temp = biggerList[m];
				if(cardType.compare(osc.getOneSendCardList(),temp.getOneSendCardList() )>0){
					osc=temp;
				}
			}
			return osc;
		}
	} else if (spliteDouble.length>0) {
		return spliteDouble[0];
	} else {
		if(zadan.length==1) {
			return zadan[0];
		} else if (zadan.length>1) {
			var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
			var osc=zadan[0];
			for(var m=0;m<zadan.length;m++) {
				var temp = zadan[m];
				if(cardType.compare(osc.getOneSendCardList(),temp.getOneSendCardList() )>0){
					osc=temp;
				}
			}
			return osc;
		}
		
		
		//最优方案中找不到大于pre	OneSendCard的牌型，则继续调用getOneSendCardBiggerButleast
		return CardTypeFactory.getOneSendCardBiggerButleast(playerList,preOneSendCard);
	}
}

/**
 * 找出压牌的出牌，首先从最优方案中能够压牌的 OneSendCard，如果不存在，则再调用
 * getOneSendCardBiggerButleast找到一个可以压牌的OneSendCard
 * @param playerList 所有的牌
 * @param preOneSendCard 上一次出的牌
 * @return
 */
//说明：
//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
//返回：OneSendCard
CardTypeFactory.getBiggerOneSendCardTmp=function(playerList, preOneSendCard){
	var dcsf=DevidedCardSolutionFactory.getInstance();
	var solutions=new Array();
	var currSolution;
	dcsf.getDevidedCardSolution(playerList, solutions, currSolution);
	var bestSolution=dcsf.getBestDevidedCardSolution(solutions);
	
	var biggerList=new Array();
	
	//在没有匹配单牌时找
	if(preOneSendCard.getCardType()==CardTypeString.SINGLE_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.DOUBLE_CARDTYPE){
		//
		//在单牌和双牌中找
		if(bestSolution.getSingleOrDouble()!=null){
			for(var m=0;m<bestSolution.getSingleOrDouble().length;m++) {
				var osc = bestSolution.getSingleOrDouble()[m];
				if(osc.getCardType()==preOneSendCard.getCardType()){
					
					//如果类型相同
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					if(cardType.compare(osc.getOneSendCardList(),preOneSendCard.getOneSendCardList() )>0){
						//如果大于，则加入到biggerList中
						
						biggerList[biggerList.length]=osc;
					}
				}
			}
		}
		

	}else if(preOneSendCard.getCardType()==CardTypeString.THREEANDONE_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.THREEANTWO_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.PLANEONE_CARDTYPE
			||preOneSendCard.getCardType()==CardTypeString.PLANETWO_CARDTYPE){
		//如果是这几种类型，需要在匹配了单牌后找
		dcsf.dispatchSingleOrDouble(bestSolution);
		//在非单牌和非双牌中找
		if(bestSolution.getOneSendCards()!=null){
			for(var m=0;m<bestSolution.getOneSendCards().length;m++) {
				var osc = bestSolution.getOneSendCards()[m];
				if(osc.getCardType()==preOneSendCard.getCardType()){
					//如果类型相同
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					if(cardType.compare(osc.getOneSendCardList(),preOneSendCard.getOneSendCardList() )>0){
						//如果大于，则加入到biggerList中
						biggerList[biggerList.length]=osc;
					}
				}
			}
		}
	
	}else{
		//在非单牌和非双牌中找
		if(bestSolution.getOneSendCards()!=null){
			for(var m=0;m<bestSolution.getOneSendCards().length;m++) {
				var osc = bestSolution.getOneSendCards()[m];
				
				if(osc.getCardType()==preOneSendCard.getCardType()){
					//如果类型相同
					var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
					if(cardType.compare(osc.getOneSendCardList(),preOneSendCard.getOneSendCardList() )>0){
						//如果大于，则加入到biggerList中
						biggerList[biggerList.length]=osc;
					}
				}
			}
		}

	}
	
	//如果最优方案中普通类型找不到，尝试找最优方案中的炸弹类型
	var zadan = new Array();
	if(bestSolution.getOneSendCards()!=null){
		for(var m=0;m<bestSolution.getOneSendCards().length;m++) {
			var osc = bestSolution.getOneSendCards()[m];
			if(osc.getCardType()==CardTypeString.FOUR_CARDTYPE){
				//如果是炸弹
				var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
				if(!preOneSendCard.getCardType()==CardTypeString.FOUR_CARDTYPE){
					//如果之前不是炸弹，则加入到biggerList中
//					biggerList.add(osc);
					zadan[zadan.length]=osc;
				}else{
					//如果之前也是炸弹
					if(cardType.compare(osc.getOneSendCardList(), preOneSendCard.getOneSendCardList())>0){
//						biggerList.add(osc);
						zadan[zadan.length]=osc;
					}
				}
			}
		}
	}

	
	if(biggerList.length==0){
		if(zadan.length==1) {
			return zadan.get(0);
		} else if (zadan.length>1) {
			var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
			var osc=zadan[0];
			for(var m=0;m<zadan.length;m++) {
				var temp = zadan[m];
				if(cardType.compare(osc.getOneSendCardList(),temp.getOneSendCardList() )>0){
					osc=temp;
				}
			}
			return osc;
		}
		
		
		//最优方案中找不到大于pre	OneSendCard的牌型，则继续调用getOneSendCardBiggerButleast
		return CardTypeFactory.getOneSendCardBiggerButleast(playerList,preOneSendCard);
	}else{
		
		//找到了大于
		if(biggerList.length==1){
			return biggerList[0];
		}else{
			//如果找到的数量大于1
			//通过比较大小的方式，找到所有牌中最小的那个
			var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
			var osc=biggerList[0];
			for(var m=0;m<biggerList.length;m++) {
				var temp = biggerList[m];
				if(cardType.compare(osc.getOneSendCardList(),temp.getOneSendCardList() )>0){
					osc=temp;
				}
			}
			return osc;
		}
	}
}

/**
 * 从所有的牌中找到比上一次出牌大的中最小的那个一次出牌
 * @param playerList 所有的牌
 * @param preOneSendCard 上一次出的牌
 * @return
 */
//说明：
//参数：List<BashaoCard> playerList, OneSendCard preOneSendCard
//返回：OneSendCard
CardTypeFactory.getOneSendCardBiggerButleast=function(playerList, preOneSendCard) {
	var cardType=CardTypeFactory.getCardTypeByCardTypeString(preOneSendCard.getCardType());
	var ret;
	if(playerList.length<cardType.getMinLength()){
		ret= null;
	}else{
		ret=cardType.getOneSendCardBiggerButleast(playerList,preOneSendCard);
	}
	//如果牌型不是炸弹，且按牌型找不到可以压牌的牌，尝试炸弹
	if(cardType.getName()!=CardTypeString.FOUR_CARDTYPE&&ret==null){
		var bomb=this.getCardTypeByCardTypeString(CardTypeString.FOUR_CARDTYPE);
		//创建一个不存在的炸弹，2222，让炸弹类型计算比它大的牌型
		var cardList=new Array();
		for(var i=1;i<=4;i++){
			var bc=new BashaoCard(2,i,0,0);
			cardList[cardList.length]=bc;
		}
		var virtual=new OneSendCard(cardList,CardTypeString.FOUR_CARDTYPE);
		ret=bomb.getOneSendCardBiggerButleast(playerList, virtual);
	}
	return ret;
}
/**
 * 比较两次出牌的大小
 * @param oneSendCard
 * @param preOneSendCard
 * @return 1：大于 0：小于或等于 -1：类型不匹配
 */
//说明：
//参数：OneSendCard oneSendCard, OneSendCard preOneSendCard
//返回：int
CardTypeFactory.compareOneSendCard=function(oneSendCard, preOneSendCard) {
	// TODO Auto-generated method stub
	var cardType1=oneSendCard.getCardType();
	var cardType2=preOneSendCard.getCardType();
	if(cardType1!=cardType2){
		
		return -1;
	}else{
		var cardType=CardTypeFactory.getCardTypeByCardTypeString(cardType1);
		return cardType.compare(oneSendCard.getOneSendCardList(), preOneSendCard.getOneSendCardList());
	}
	
}
/**
 * 电脑自主出牌
 * @param list
 * @return
 */
/*	public static OneSendCard getOneSendCardBySelf(List<BashaoCard> list) {
	// TODO Auto-generated method stub
	//0 定义拆牌工厂 ，定义拆牌规则
	//1拆成各种dividedcard 拆牌方案
	//
	//2定义择优方案（只有一种方案）
	//3 选择最优解决方案
	//4选择出牌方案（只有一种方案）
	
	return null;
}*/
/**
 * 电脑自主出牌
 * @param list
 * @return
 */
//说明：
//参数：List<BashaoCard> playerList
//返回：OneSendCard
CardTypeFactory.getFirstBestOneSendCard=function(playerList) {
	var dcsf=DevidedCardSolutionFactory.getInstance();
	var solutions=new Array();
	var currSolution=null;
	dcsf.getDevidedCardSolution(playerList, solutions, currSolution);
	var bestSolution=dcsf.getBestDevidedCardSolution(solutions);
	var osc=dcsf.getFirstOneSendCard(bestSolution);
	return osc;
}
