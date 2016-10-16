/**
 * 必压
 */
function pressValid() {}

//CardTypeFactory.getCardTypeByCardTypeString=function(cardTypeString){
//	return null;
//}

pressValid.press=function(osc){
	//我是地主，能要起必要
	if(Game._who_turn == Game._landlord) {
		return true;
	}
	
	
	
	//我压队友的牌
	var preWho = Game._pre_one_sendcard.whoSend;
	if(preWho != Game._landlord) {
		//我要了就出完了，必须要
		if(osc.oneSendCardList.length==Game._player_cards[Game._who_turn].length) {
			return true;
		}
		
		//我打出去的牌，没人要得起，我要了之后，还剩一手牌，必须要
		if(biggertype.isBiggest(osc)) {
			var arrTmp = ArrayUtil.exclude(Game._player_cards[Game._who_turn], osc.oneSendCardList);
			if(arrTmp.length==0) {
				return true;
			}
			var type = CardTypeFactory.getCardType(arrTmp);
			if(type!=CardTypeString.NONE_CARDTYPE) {
				return true;
			}
		}
		
		
		//队友打出的是最大的牌，且手里还剩最后一首牌，必须不要
		if(biggertype.isBiggest(Game._pre_one_sendcard)) {
//			CardTypeFactory.getCardType(Game._player_cards[preWho]) {
				return false;
//			}
		}
		
		
		
		//我要了之后，还剩最后一手牌(单牌或对子)，且牌型比较大，则必要
		var arrTmp = ArrayUtil.exclude(Game._player_cards[Game._who_turn], osc.oneSendCardList);
		if(arrTmp.length==0) {
			return true;
		}
		var type = CardTypeFactory.getCardType(arrTmp);
		if(type==CardTypeString.SINGLE_CARDTYPE) {
			if(arrTmp[0]>=12) {//Q
				return true;
			}
		}
		if(type==CardTypeString.DOUBLE_CARDTYPE) {
			if(arrTmp[0]>=12) {//Q
				return true;
			}
		}
		
		
		
		//队友打出的是1张牌，且手里还剩一张牌，我也不要
		if(preWho!=Game._landlor) {
			if(Game._pre_one_sendcard.oneSendCardList.length==1 && Game._player_cards[preWho].length==1) {
				return false;
			}
		}
		
		
		
		//队友打出的不是单牌，也不是对子，我不要
		if(preWho!=Game._landlor) {
			var type = Game._pre_one_sendcard.cardType;
			if(type!=CardTypeString.DOUBLE_CARDTYPE && type!=CardTypeString.SINGLE_CARDTYPE) {
				return false;
			}
		}
		
		
		//队友打出的是单牌或者对子，我压牌时，用的牌太大，我也不要
		var num = new Map();
		for(var i=0;i<3;i++) {
			if(Game._who_turn!=i) {
				var cards = Game._player_cards[i];
				for(var j=0;j<cards.length;j++) {
					var value = cards[j].value;
					if(!num.containsKey(value)) {
						num.put(value, 1);
					} else {
						num.put(value, num.get(value) + 1);
					}
				}
			}
		}
		var type = CardTypeFactory.getCardTypeByCardTypeString(osc.cardType);
		var biggerType = type.getBiggerType(osc, num);
		if(biggerType==BiggerType.F || biggerType==BiggerType.E) {
			return false;
		}
		return true;
		
		
		
		
		//队友打出的
		
//		if(Game._player_cards[preWho].length==1) {
//			Game._player_cards[preWho].length==1
//		}
	}
	return true;
}