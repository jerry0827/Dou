/**
 * 1:最大的牌，没人要得起
 * 2:极大的牌
 * 3:一般牌
 * 4:极小牌
 * 5:最小的牌
 */
function biggertype(){}

biggertype.gettype=function(osc){
	if(osc.cardType == CardTypeString.FOUR_CARDTYPE) {
		return 1;
	}
	if(osc.cardType == CardTypeString.FOURONEONE_CARDTYPE) {
		return 1;
	}
	if(osc.cardType == CardTypeString.FOURTWOTWO_CARDTYPE) {
		return 1;
	}
}

biggertype.isBiggest=function(osc) {
	for(var i=0;i<3;i++) {
		if(Game._who_turn!=i) {
			var tmp = CardTypeFactory.getBiggerOneSendCard(Game._player_cards[Game._who_turn], osc);
			if(tmp!=null) {
				return false;
			}
		}
	}
	return true;
}