
function CardUtil() {}

//按照值相同，统计个数 返回什么值牌，有几种相同的值
//List<BashaoCard> list
CardUtil.asValueStaticCount = function(list){
	var map=new Map();
	if(list!=null) {
		for(var i=0;i<list.length;i++) {
			var key=list[i].value;
			if(map.containsKey(key)){
				map.put(key, map.get(key)+1);
			}else{
				map.put(key, 1);
			}

		}		
	}
	return map;
}

//返回什么值牌，有count个
//List<BashaoCard> list,int count
CardUtil.asValueStaticCountByValue = function(list, count){
	var map=new Map();
	for(var i=0;i<list.length;i++) {
		var c = list[i];
		var key=c.value;
		if(map.containsKey(c.value)){
			var value = map.get(key) + 1;
			map.put(key, value);
		}else{
			map.put(key, 1);
		}
	}
	
	var newMap=new Map();
	for(var i=0;i<map.length;i++) {
		if(map.entrySet()[i].value==count){
			newMap.put(map.entrySet()[i].key,map.entrySet()[i].value);
		}
	}
	return newMap;
}

//从list中找出大于value的最小值
//List<Integer> list, int value
CardUtil.getBiggerButLeastFromList = function(list, value) {
	list.sort(OneSendCard.sortFunction);
	for(var i=0;i<list.length;i++) {
		var o = list[i];
		if(o>value){
			return o;
		}
	}
	return 0;
}

//从牌的list中找值为value的牌，取count个
//List<BashaoCard> playerList, int value, int count
CardUtil.getCardListByValueAndCount = function(playerList, value, count) {
	var retList=new Array();
	var has=0;
	for(var i=0;i<playerList.length;i++) {
		var bc = playerList[i];
		if(bc.value==value){
			retList[retList.length]=bc;
			has++;
			if(has>=count){
				break;
			}
		}
	}
	return retList;
}

//真蛋疼，JS貌似不能根据参数个数重载
//从oneList找出最小的值
//List<Integer> oneList
//CardUtil.getLeastFromList2 = function(oneList) {
//	oneList.sort(OneSendCard.sortFunction);
//	return oneList[0];
//}

//从playerList中去掉needList的牌，返回一个新的List
//List<BashaoCard> playerList, List<BashaoCard> needList
CardUtil.getRestListByRemove = function(playerList, needList) {
	var retList=new Array();
	for(var i=0;i<playerList.length;i++) {
		var bc = playerList[i];
		var has=false;
		for(var j=0;j<needList.length;j++) {
			var bc2 = needList[j];
			if(bc.isEqual(bc2)){
				has=true;
				break;
			}
		}
		if(!has){
			retList[retList.length] = bc;
		}
	}
	return retList;
}

//从restList中找出最小的一张牌
//List<BashaoCard> restList
CardUtil.getLeastCardFromCardList = function(restList) {
	var initValue=restList[0].value;
	var bc=restList[0];
	for(var i=0;i<restList.length;i++) {
		var b = restList[i];
		if(b.value<initValue){
			initValue=b.value;
			bc=b;
		}
	}
	return bc;
}

//从oneList中取出count个最小的值
//List<Integer> oneList, int count
CardUtil.getLeastFromList = function(oneList, count) {
	oneList.sort(OneSendCard.sortFunction);
	var iList=new Array();
	for(var i=0;i<count;i++){
		iList[iList.length]=oneList[i];
	}
	return iList;
}

CardUtil.getMin = function(oneList) {
	var min = 17;
	for(var i=0;i<oneList.length;i++) {
		if(oneList[i]<min) {
			min = oneList[i];
		}
	}
	return min;
}

//从oneList中取出count个最小的值
//List<BashaoCard> cardList, int count
CardUtil.getLeastFromBashaoCardList = function(cardList, count) {
	var oneList = new Array();
	for(var i=0;i<cardList.length;i++) {
		var bc = cardList[i];
		oneList[oneList.length]=bc.value;
	}
	return CardUtil.getLeastFromList(oneList, count);
}

//对list进行排序，返回整数值
//List<BashaoCard> preList
CardUtil.sortCardList = function(preList) {
	var list=new Array();
	for(var i=0;i<preList.length;i++) {
		var bc = preList[i];
		list[list.length]=bc.value;
	}
	list.sort(OneSendCard.sortFunction);
	return list;
}

//从list中把单牌去掉，返回一个新list
//List<BashaoCard> list, int count
CardUtil.removeByCount = function(list, count) {
	var retList=new Array();
	var map=CardUtil.asValueStaticCount(list);
	var removeList=new Array();
	
	for(var i=0;i<map.entrySet().length;i++) {
		var key = map.entrySet()[i].key;
		var value = map.entrySet()[i].value;
		if(value==count){
			removeList[removeList.length]=key;
		}
	}
	for(var i=0;i<list.length;i++) {
		var b = list[i];
		var str=b.value;
		if(!removeList.contains(str)){
			retList[retList.length]=b;
		}
	}
	return retList;
}

//从剩余的牌中找i张最小的单牌
//List<BashaoCard> restList, int count
CardUtil.getSingleCardListBy = function(restList, count) {
	var map=CardUtil.asValueStaticCount(restList);
	var singleList=new Array();
	// 最后确定的单牌
	var retList=new Array();
	for(var i=0;i<map.entrySet().length;i++) {
		var key = map.entrySet()[i].key;
		var value = map.entrySet()[i].value;
		if(value==1&&key!=16&&!key!=17){
			singleList[singleList.length]=key;
		}
	}
	if(singleList.length>count){
		// 如果单牌数量大于要找的数量，就直接从单牌中找i张单牌
		singleList.sort(OneSendCard.sortFunction);
		for(var i=0;i<count;i++){
			var tempList=CardUtil.getCardListByValueAndCount(restList, singleList[i], 1);
			retList.addAll(tempList);
		}
	}else{
		// 如果单牌数量不够，差几张，就从剩余的牌中再找几张，补齐
		singleList.sort(OneSendCard.sortFunction);
		for(var i=0;i<singleList.length;i++){
			var tempList=CardUtil.getCardListByValueAndCount(restList, singleList[i], 1);
			retList.addAll(tempList);
		}
		// 还差几张牌
		var needCount=count-singleList.length;
		
		// 新的剩余牌
		var newRestList=CardUtil.getRestListByRemove(restList, retList);
		// 从新的剩余的牌中找出needCount张单牌
		var sortCardList=CardUtil.sortCardList(newRestList);
		
		for(var i=0;i<sortCardList.length;i++){
			var temp = sortCardList[i];
			if(needCount==0){
				break;
			}else{
				retList.addAll(CardUtil.getCardListByValueAndCount(newRestList, temp, 1));
				needCount--;
			}
			
		}
		
	}
	return retList;
}

//从剩余的牌中找几对最小的对牌
//List<BashaoCard> restList, int count
CardUtil.getDoubleCardListBy = function(restList, count) {
	var map=CardUtil.asValueStaticCount(restList);
	var doubleList=new Array();
	var threeList=new Array();
	// 最后确定的对牌
	var retList=new Array();
	for(var i=0;i<map.values.length;i++) {
		var key = map.values[i].key;
		var value = map.values[i].value;
		if(value==2){
			doubleList[doubleList.length] = key;
		}
		if(value==3){
			threeList[threeList.length] = key;
		}
	}
	if(doubleList.length>count){
		// 如果单牌数量大于要找的数量，就直接从单牌中找i张单牌
		doubleList.sort(OneSendCard.sortFunction);
		for(var i=0;i<count;i++){
			var tempList=CardUtil.getCardListByValueAndCount(restList, doubleList[i], 2);
			retList.addAll(tempList);
		}
		
	}else{
		// 如果单牌数量不够，差几张，就从剩余的牌中再找几张，补齐
//		doubleList.sort(objs);
		for(var i=0;i<doubleList.length;i++){
			var tempList=CardUtil.getCardListByValueAndCount(restList, doubleList[i], 2);
			retList.addAll(tempList);
		}
		// 还差几对牌
		var needCount=count-doubleList.length;
		
		if(threeList.length>=needCount){
			// 三牌的数量够用
			threeList.sort(OneSendCard.sortFunction);
			for(var i=0;i<needCount;i++){
				var key=threeObjs[i];
				var tempList=CardUtil.getCardListByValueAndCount(restList, key, 2);
				retList.addAll(tempList);
			}
		}else{
			// 三牌的数量不够用
			return null;
		}
		
		
	}
	return retList;
	
}

//安值统计oneSendCard(单牌和双牌)
//List<OneSendCard> singleOrDouble
CardUtil.asValueStaticOneSendCard = function(singleOrDouble) {
	var map = new Map();
	for(var i=0;i<singleOrDouble.length;i++) {
		var osc = singleOrDouble[i];
		var bc=osc.getOneSendCardList()[0];
		map.put(bc.value, osc);
	}
	return map;
}
	
	
//排序整数数组，从小到大
//List<Integer> singleList
CardUtil.sortIntegerList = function(singleList) {
	singleList.sort(OneSendCard.sortFunction);
	return singleList;
}
	

