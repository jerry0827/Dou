
/**
 * 拆牌工厂，通过指定的拆牌规则，返回拆牌方案
 * 
 * @author Administrator 获取拆牌方案 -》计算最优出牌方案（单牌手数越小越好）-》 将单牌和双牌分配给飞机等（） -》计算最先出牌方案
 * 
 * 
 */
function DevidedCardSolutionFactory() {
	
	/*this.println = function(str) {
		alert(str);
	}*/


	/**
	 * 获取拆牌解决方案
	 * 
	 * @param cards
	 *            所有牌
	 * @param solutions
	 *            所有解决方案的引用
	 * @param currSolution
	 *            当前solution
	 * @return false表示不可再拆出 龙，炸弹，飞机，连队，3张
	 */
	//说明：
	//参数：List<BashaoCard> cards, List<DevidedCardSolution> solutions, DevidedCardSolution currSolution
	//返回：
	this.getDevidedCardSolution = function(cards, solutions, currSolution) {
		// 拆出所有可能的 龙，炸弹，飞机，连队，3张
		var oneSendCardList = this.getAllPossibleOneSendCard(cards);
		// 如果有，遍历，将任何一个加入到currSolution中
		if (oneSendCardList != null && oneSendCardList.length > 0) {
			for(var m=0;m<oneSendCardList.length;m++) {
				var osc = oneSendCardList[m];
				// 创建一个新的，进入下一层
				var nextSolution = new DevidedCardSolution();
				var oneSendCards = new Array();
				if (currSolution != null) {
					if (currSolution.getOneSendCards() != null && currSolution.getOneSendCards().length > 0) {
						// 将之前的OneSendCard放进来
						for(var n=0;n<currSolution.getOneSendCards().length;n++) {
							oneSendCards[oneSendCards.length] = currSolution.getOneSendCards()[n]
						}
					}
				}

				// 将本次的OneSendCard放进来
				oneSendCards[oneSendCards.length] = osc;
				nextSolution.setOneSendCards(oneSendCards);
				// 获取剩余牌
				var restCards = CardUtil.getRestListByRemove(cards, osc.getOneSendCardList());
				// 进行递归调用
				this.getDevidedCardSolution(restCards, solutions, nextSolution);

			}
		} else {
			// 如果没有，说明不可以再拆解了，
			// 1将cards加入到solution的rabisish中
			// 2将currSolution加入到solutions中，并将currSolution
			// 1
			var singleOrDouble = this.getOneSendCardOfSingleOrDouble(cards);
			if (currSolution == null) {
				currSolution = new DevidedCardSolution();
			}
//			alert("setsingle:" + singleOrDouble);
			currSolution.setSingleOrDouble(singleOrDouble);
			// 2
			solutions[solutions.length] = currSolution;
		}
	}

	/**
	 * 获取最优解决方案
	 * 
	 * @param solutions
	 * @return
	 */
	//说明：
	//参数：List<DevidedCardSolution> solutions
	//返回：DevidedCardSolution
	this.getBestDevidedCardSolution = function(solutions) {
		// 根据单牌手数比较，单牌手数越小，解决方案越好
		var initValue = 100;
		var best;
		for(var m=0;m<solutions.length;m++) {
			var solution = solutions[m];
			if (solution.getSingleCount() < initValue) {
				best = solution;
				initValue = solution.getSingleCount();
			}
		}
		return best;
	}


	/**
	 * 找出最先出牌，通过比较压牌比值，压牌比值最小的最先出
	 * 
	 * @param dcs
	 * @return
	 */
	//说明：
	//参数：DevidedCardSolution dcs
	//返回：OneSendCard
	this.getFirstOneSendCard = function(dcs) {
		var oldSingleOrDouble = dcs.getSingleOrDouble();
		// 先将未 分配之前的解决方案保存
		var saveSingleOrDouble = new Array();
		for(var m=0;m<oldSingleOrDouble.length;m++) {
			var osc = oldSingleOrDouble[m];
			var newOsc = new OneSendCard(osc.getOneSendCardList(),osc.getCardType());
			saveSingleOrDouble[saveSingleOrDouble.length]=newOsc;
		}

		// 是否有必要先出单牌
		var hasNessary = false;
		// 最后判断是否要先出单牌
		// boolean isSingleFirst=false;

		// 先判断有没有必要出单牌
		if (dcs.getSingleCount() > 0) {
			// 单牌手数>0
			hasNessary = true;
		} else {
			hasNessary = false;
		}

		var osc;
		if (hasNessary == false) {
			// 没有必要出单牌，即所有单牌都能带出去
			// 计算所有OneSendCard 的压牌比值和被压牌比值，压牌笔值越小越先出，压牌比值相等则被压牌比值越小越先出

			this.dispatchSingleOrDouble(dcs);

			// 目前只用压牌比值比较
			var minRate = 1;
			if (dcs.getOneSendCards() != null) {
				for(var m=0;m<dcs.getOneSendCards().length;m++) {
					var temp = dcs.getOneSendCards()[m];
					if (temp.getBiggerRate() < minRate) {
						osc = temp;
						minRate = temp.getBiggerRate();
					}
				}
			}

		} else {
			// 如果有必要出单牌
			// 需要先把单牌带到 3张或4张上
			this.dispatchSingleOrDouble(dcs);

			var minRate = 2;
			if (dcs.getOneSendCards() != null) {
				for(var m=0;m<dcs.getOneSendCards().length;m++) {
					var temp = dcs.getOneSendCards()[m];
					if (temp.getBiggerRate() < minRate) {
						osc = temp;
						minRate = temp.getBiggerRate();
					}
				}
			}
			if (dcs.getSingleOrDouble() != null) {
				for(var m=0;m<dcs.getSingleOrDouble().length;m++) {
					var temp = dcs.getSingleOrDouble()[m];
					if (temp.getBiggerRate() < minRate) {
						osc = temp;
						minRate = temp.getBiggerRate();
					}
				}
			}

		}
		// 如果最先出牌是单牌，或对牌，则不要根据之前的匹配进行出牌，而是从单牌和双牌中找出最小牌出
		if (osc == null
				|| osc.getCardType()==CardTypeString.SINGLE_CARDTYPE
				|| osc.getCardType()==CardTypeString.DOUBLE_CARDTYPE) {
			osc = this.getMinSingleOrDouble(saveSingleOrDouble);
		}

		return osc;
	}

	/**
	 * 在所有单牌和双牌中找出最小的
	 * 
	 * @param saveSingleOrDouble
	 * @return
	 */
	//说明：
	//参数： List<OneSendCard> saveSingleOrDouble
	//返回：OneSendCard
	this.getMinSingleOrDouble = function(saveSingleOrDouble) {
		// TODO Auto-generated method stub
		var map = CardUtil.asValueStaticOneSendCard(saveSingleOrDouble);
		var intList = new Array();
		var keys = map.keys();
		for(var m=0;m<keys.length;m++) {
			intList[intList.length] = keys[m];
		}
		intList = CardUtil.sortIntegerList(intList);
		return map.get(intList[0]);
	}

	/**
	 * 分发单牌和双牌分发
	 * 
	 * @param dcs
	 */
	//说明：
	//参数：DevidedCardSolution dcs
	//返回：
	this.dispatchSingleOrDouble = function(dcs) {
		var map = CardUtil.asValueStaticOneSendCard(dcs.getSingleOrDouble());
		var singleCount = 0;
		var doubleCount = 0;
		var singleList = new Array();
		var doubleList = new Array();

		for(var m=0;m<dcs.getSingleOrDouble().length;m++) {
			var temp = dcs.getSingleOrDouble()[m];
			if (temp.getCardType()==CardTypeString.SINGLE_CARDTYPE) {
				singleCount++;

			}
			if (temp.getCardType()==CardTypeString.DOUBLE_CARDTYPE) {
				doubleCount++;
			}
		}

		// 为飞机分牌
		// 飞机需要带几张单牌;
		var needCount = 0;
		if (dcs.getOneSendCards() != null) {
			for(var m=0;m<dcs.getOneSendCards().length;m++) {
				var temp = dcs.getOneSendCards()[m];
				if (temp.getCardType()==CardTypeString.PLANE_CARDTYPE) {
					map = CardUtil.asValueStaticOneSendCard(dcs.getSingleOrDouble());
					singleCount = 0;
					doubleCount = 0;
					singleList = new Array();
					doubleList = new Array();

					var entrys = map.entrySet();
					for(var m=0;m<entrys.length;m++) {
						var entry = entrys[m];
						if (entry.value.getCardType()==CardTypeString.SINGLE_CARDTYPE) {
							singleList[singleList.length] = entry.key;
							singleCount++;
						}
						if (entry.value.getCardType()==CardTypeString.DOUBLE_CARDTYPE) {
							doubleList[doubleList.length] = entry.key;
							doubleCount++;
						}
					}

					singleList = CardUtil.sortIntegerList(singleList);
					doubleList = CardUtil.sortIntegerList(doubleList);
					needCount = temp.getOneSendCardList().length / 3;
					var addCardList = new Array();
					// 如果单牌够，带单牌
					if (singleCount >= needCount) {
						for (var i = 0; i < needCount; i++) {
							var tempInt = singleList[i];
							var tempOsc = map.get(tempInt);
							// 从单牌中删除
							dcs.getSingleOrDouble().remove(tempOsc);
							this.addAll(addCardList, tempOsc.getOneSendCardList());
//							addCardList.addAll(tempOsc.getOneSendCardList());
						}
						this.addAll(temp.getOneSendCardList(), addCardList);
//						temp.getOneSendCardList().addAll(addCardList);
						temp.setCardType(CardTypeString.PLANEONE_CARDTYPE);
					} else if (doubleCount >= needCount) {
						// 如果单牌不够，双牌够带双牌
						for (var i = 0; i < needCount; i++) {
							var tempInt = doubleList[i];
							var tempOsc = map.get(tempInt);
							// 从单牌中删除
							dcs.getSingleOrDouble().remove(tempOsc);
							this.addAll(addCardList, tempOsc.getOneSendCardList());
//							addCardList.addAll(tempOsc.getOneSendCardList());
						}
						this.addAll(temp.getOneSendCardList(), addCardList);
//						temp.getOneSendCardList().addAll(addCardList);
						temp.setCardType(CardTypeString.PLANETWO_CARDTYPE);
					} else {
						// 判断单牌和双牌的总个数
						var totalSingleCount = 0;
						totalSingleCount = singleCount + doubleCount;
						if (totalSingleCount < needCount) {
							// 总单牌数不够
							// 只能继续尝试
							continue;
						}
						// 如果单牌不够，双牌不够，从双牌中拆除单牌
						// 还差几个
						var shotCount = needCount - singleCount;
						for (var i = 0; i < singleCount; i++) {
							var tempInt = singleList[i];
							var tempOsc = map.get(tempInt);
							// 从单牌中删除
							dcs.getSingleOrDouble().remove(tempOsc);
							this.addAll(addCardList, tempOsc.getOneSendCardList());
						}
						// 差的对数
						for (var i = 0; i < shotCount; i++) {
							var tempInt = doubleList[i];
							var tempOsc = map.get(tempInt);
							tempOsc.getOneSendCardList().pop();
							// 从单牌中删除
							dcs.getSingleOrDouble().remove(tempOsc);
							this.addAll(addCardList, tempOsc.getOneSendCardList());
						}
						this.addAll(temp.getOneSendCardList(), addCardList);
						temp.setCardType(CardTypeString.PLANEONE_CARDTYPE);
					}
				}
			}

			// 为3张分牌
			// 为3张分配只需要从小到大分牌即可

			for(var m=0;m<dcs.getOneSendCards().length;m++) {
				var temp = dcs.getOneSendCards()[m];
				if (temp.getCardType()==CardTypeString.THREE_CARDTYPE) {
					if (dcs.getSingleOrDouble().length > 0) {
						map = CardUtil.asValueStaticOneSendCard(dcs.getSingleOrDouble());
						var intList = new Array();
						var keys = map.keys();
						for(var n=0;n<keys.length;n++) {
							intList[intList.length] = keys[n];
						}
						intList = CardUtil.sortIntegerList(intList);
						var tempOsc = map.get(intList[0]);
						var addCardList = tempOsc.getOneSendCardList();
						dcs.getSingleOrDouble().remove(tempOsc);
						
						for(var i=0;i<addCardList.length;i++) {
							temp.getOneSendCardList()[temp.getOneSendCardList().length] = addCardList[i];
						}
//						temp.getOneSendCardList().addAll(addCardList);
						if (tempOsc.getCardType() == CardTypeString.SINGLE_CARDTYPE) {
							temp.setCardType(CardTypeString.THREEANDONE_CARDTYPE);
						} else {
							temp.setCardType(CardTypeString.THREEANTWO_CARDTYPE);

						}

					}

				}
			}
		}

	}

	/**
	 * 将单牌和双牌拆成oneSendCard返回
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard>
	this.getOneSendCardOfSingleOrDouble = function(cards) {
		var retList = new Array();
		var map = CardUtil.asValueStaticCount(cards);
		var entrys = map.entrySet();
		for(var m=0;m<entrys.length;m++) {
			var entry = entrys[m];
			if (entry.value == 1) {
				// 单牌
				var list1 = CardUtil.getCardListByValueAndCount(cards, entry.key, 1);
				var o1 = new OneSendCard(list1, CardTypeString.SINGLE_CARDTYPE);
				retList[retList.length] = o1;
			} else if (entry.value == 2) {
				// 对牌
				var list1 = CardUtil.getCardListByValueAndCount(cards, entry.key, 2);
				var o1 = new OneSendCard(list1, CardTypeString.DOUBLE_CARDTYPE);
				retList[retList.length] = o1;
			}
		}
		return retList;
	}

	/**
	 * //拆出所有可能的 龙，炸弹，飞机，连队，3张
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard>
	this.getAllPossibleOneSendCard = function(cards) {
		// TODO Auto-generated method stub
		var retList = new Array();

		// 1找出所有的炸弹
		var bombList = this.getAllBombByCardList(cards);
		// 3找出所有的飞机
		var planeList = this.getAllPlaneByCardList(cards);
		// 2找出所有的3张相同
		var threeList = this.getAllThreeByCardList(cards);
		// 4找出所有的连对
		var lianDuiList = this.getAlllianDuiByCardList(cards);
		// 5找出所有的的连子
		var lianZiList = this.getAlllianZiByCardList(cards);
		// 将所有的加入到retList中
		this.addAll(retList,bombList);
		this.addAll(retList,threeList);
		this.addAll(retList,planeList);
		this.addAll(retList,lianDuiList);
		this.addAll(retList,lianZiList);
		return retList;
	}
	this.addAll = function(origianArray, destArray) {
		for(var i=0;i<destArray.length;i++) {
			origianArray[origianArray.length] = destArray[i];
		}
	}

	/**
	 * 找出所有的的连子 eg:手里的牌为3,4,5,6,7,8 返回 3,4,5,6,7; 4,5,6,7,8; 3,4,5,6,7,8;
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard> 
	this.getAlllianZiByCardList = function(cards) {
		// TODO Auto-generated method stub
		// 连子最小个数为5个，最大个数为3-A为12个,A=14
		var minCount = 5;
		var maxCount = 12;
		var map = CardUtil.asValueStaticCount(cards);
		var osc;
		var lianziList = new Array();
		for (var i = minCount; i <= maxCount; i++) {

			// 外循环控制连字个数
			for (var j = 3; j <= 14 - i + 1; j++) {

				// 内循环控制初始值
				// 是否可以成连子，其间只要有一张牌的数量为0，则该连子不成
				var bHas = true;
				for (var h = j; h < j + i; h++) {
					// 最内循环控制查找当前牌值
					if (map.get(h) == null || map.get(String.valueOf(h)) == 0) {
						bHas = false;
						break;
					}
				}
				if (bHas == true) {
					// 从j开始的
					var totalCards = new Array();
					for (var h = j; h < j + i; h++) {
						// 最内循环控制查找当前牌值
						var tempCards;

						tempCards = CardUtil.getCardListByValueAndCount(cards, h, 1);
						for(var k=0;k<tempCards.length;k++) {
							totalCards[totalCards.length] = tempCards[k];
						}
					}
					osc = new OneSendCard(totalCards, CardTypeString.ONETWOTHREE_CARDTYPE);
					lianziList[lianziList.length]=osc;
				}
			}
		}
		return lianziList;
	}

	/**
	 * 找出所有的连对
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard>
	this.getAlllianDuiByCardList = function(cards) {
		// 连子最小个数为3个，最大个数为3-A为12个,A=14
		var minCount = 3;
		var maxCount = 10;
		var map = CardUtil.asValueStaticCount(cards);
		var osc;
		var lianziList = new Array();
		for (var i = minCount; i <= maxCount; i++) {

			// 外循环控制连字个数
			for (var j = 3; j <= 14 - i + 1; j++) {

				// 内循环控制初始值
				// 是否可以成连子，其间只要有一张牌的数量为0，则该连子不成
				var bHas = true;
				for (var h = j; h < j + i; h++) {
					// 最内循环控制查找当前牌值
					if (map.get(String.valueOf(h)) == null || map.get(h) < 2) {
						bHas = false;
						break;
					}
				}
				if (bHas == true) {
					// 从j开始的
					var totalCards = new Array();
					for (var h = j; h < j + i; h++) {
						// 最内循环控制查找当前牌值
						var tempCards;

						tempCards = CardUtil.getCardListByValueAndCount(cards, h, 2);
						this.addAll(totalCards, tempCards);
					}
					osc = new OneSendCard(totalCards, CardTypeString.ONEONETWOTWO_CARDTYPE);
					lianziList[lianziList.length]=osc;
				}
			}
		}
		return lianziList;
	}

	/**
	 * 3找出所有的飞机
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard>
	this.getAllPlaneByCardList = function(cards) {
		// TODO Auto-generated method stub
		var planeList = new Array();
		var map = CardUtil.asValueStaticCount(cards);
		// 从3到k,找出连续的大于3个的牌值
		var intListList = new Array();
		var threeList = new Array();
		
		var entrys = map.entrySet();
		for(var m=0;m<entrys.length;m++) {
			var entry = entrys[m];
			if (entry.value >= 3) {
				threeList[threeList.length] = entry.key;
			}
		}
		threeList.sort(OneSendCard.sortFunction);
		var preNumber = 0;
		var tempList = new Array();
		for (var i = 0; i < threeList.length; i++) {
			var curNumber = threeList[i];
			//2和谁都不能凑成飞机
			if(curNumber==IConstants.MAX_CARD_NUM-2) {
				continue;
			}
			if (preNumber == 0) {
				tempList[tempList.length]=curNumber;
			} else {
				if (preNumber == curNumber - 1) {
					// 连续
					tempList[tempList.length] = curNumber
				} else {
					// 不连续
					// 如果之前数量大于2就加入到intListList中
					if (tempList.length >= 2) {
						intListList[intListList.length]=tempList;
					}
					// 创建一个新List
					tempList = new Array();
				}
			}
			// 当前值赋值给preNumber;
			preNumber = curNumber;
		}
		// 如果之前数量大于2就加入到intListList中
		if (tempList.length >= 2) {
			intListList[intListList.length]=tempList
		}

		// 找出所有的飞机，如果飞机连续的个数>2,如333444555，则当成一个飞机，不考虑333444和444555
		for(var m=0;m<intListList.length;m++) {
			var temList = intListList[m];
			var osc;
			var totalCards = new Array();
			var tempCards;
			for(var n=0;n<temList.length;n++) {
				tempCards = CardUtil.getCardListByValueAndCount(cards, temList[n], 3);
				this.addAll(totalCards, tempCards);
			}
			osc = new OneSendCard(totalCards, CardTypeString.PLANE_CARDTYPE);
			planeList[planeList.length]=osc;
		}
		return planeList;
	}

	/**
	 * 找出所有的3张相同
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard>
	this.getAllThreeByCardList = function(cards) {
		// TODO Auto-generated method stub
		var map = CardUtil.asValueStaticCount(cards);
		var bombList = new Array();
		var entrys = map.entrySet();
		for(var m=0;m<entrys.length;m++) {
			var entry = entrys[m];
			if (entry.value >= 3) {
				var bombcards = CardUtil.getCardListByValueAndCount(cards, entry.key, 3);
				var osc = new OneSendCard(bombcards, CardTypeString.THREE_CARDTYPE);
				bombList[bombList.length]=osc;
			}
		}
		return bombList;
	}

	/**
	 * 找出所有的炸弹
	 * 
	 * @param cards
	 * @return
	 */
	//说明：
	//参数：List<BashaoCard> cards
	//返回：List<OneSendCard>
	this.getAllBombByCardList = function(cards) {
		// TODO Auto-generated method stub
		var map = CardUtil.asValueStaticCount(cards);
		var bombList = new Array();

		if (map.get("16") != null && map.get("17") != null) {
			var bombcards = new Array();
			var bombcards1 = CardUtil.getCardListByValueAndCount( cards, 16, 1);
			var bombcards2 = CardUtil.getCardListByValueAndCount(cards, 17, 1);
			this.addAll(bombcards,bombcards1);
			this.addAll(bombcards,bombcards2);
			var osc = new OneSendCard(bombcards, CardTypeString.FOUR_CARDTYPE);
			bombList[bombList.length]=osc;
		}
		var entrys = map.entrySet();
		for(var m=0;m<entrys.length;m++) {
			var entry = entrys[m];
			if (entry.value == 4) {
				var bombcards = CardUtil.getCardListByValueAndCount(cards,entry.key, 4);
				var osc = new OneSendCard(bombcards, CardTypeString.FOUR_CARDTYPE);
				bombList[bombList.length]=osc;
			}
		}
		return bombList;
	}
}

DevidedCardSolutionFactory.getInstance = function() {
	if (this.dcsf == null) {
		this.dcsf = new DevidedCardSolutionFactory();
	}
	return this.dcsf;
}
