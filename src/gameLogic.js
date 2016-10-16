var gameLogic = function(layer) {
    this.layer = layer;
    this.labels = new Array(); //每个玩家不要的标签
    this.discard = new Array(); //二维数组,每个玩家打出去的牌
    this.leftCard = new Array(); //剩余牌数量  2维数组
    this.leftCardImg = new Array();
    this.callMenu = null;
    this.end = true;
    this.num = 0;

    this._isEnd=function(){
        for(var i=0;i<3;i++) {
            if(Game._player_cards[i].length==0) {
                return true;
            }
        }
    }

    this._start=function() {
    	if(this.num==null) {
    		this.num = 0;
    	}
    	this._discardSchedule();
    }
    
    this._discardSchedule=function(){
//    	var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Sum", "sum", "(II)I", 3, 7);
//    	cc.log(result);
//    	jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BaiduADUtils", "show", "()V");
//		jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "title", "hahahahha");
    	
    	if(this.end==null) {
    		this.end = true;
    	}
    	if(!this.end) {
    		return ;
    	}
    	
    	
    	var cards = Game._player_cards[Game._who_turn];
    	cc.log("\n 玩家:" + Game._who_turn + "的牌");
    	for(var i=0;i<cards.length;i++) {
    		cc.log(cards[i].value);
    	}
        if(this._isEnd()) {
        	this._gameOver();
            return ;
        }
        
        this.end = false;
        if(Game._pre_one_sendcard==null) {//出牌
            if(Game._who_turn==0) {
                this._playerDiscard();
            } else {
                this._computerDiscard();
                this.end = true;
            }
        } else if(Game._pre_one_sendcard.whoSend == Game._who_turn) {//出牌
            if(Game._who_turn==0) {
                this._playerDiscard();
            } else {
                this._computerDiscard();
                this.end = true;
            }
        } else { //压牌
            if(Game._who_turn==0) {
                this._playerDiscard();
            } else {
                this._computerPressCard();
                this.end = true;
            }
        }
    }
    
    this._gameOver=function(){
    	for(var i=0;i<this.labels.length;i++) {
    		if(this.labels[i]!=null) {
    			this.layer.removeChild(this.labels[i]);
    		}
    	}
    	for(var i=0;i<this.discard.length;i++) {
    		if(this.discard[i]!=null) {
    			for(var j=0;j<this.discard[i].length;j++) {
    				if(this.discard[i][j]!=null) {
    					this.layer.removeChild(this.discard[i][j]);
    				}
    			}
    		}
    	}
    	for(var i=0;i<this.leftCardImg.length;i++) {
    		if(this.leftCardImg[i]!=null) {
    			this.layer.removeChild(this.leftCardImg[i]);
    		}
    	}
    	for(var i=0;i<this.leftCard.length;i++) {
    		if(this.leftCard[i]!=null) {
    			for(var j=0;j<this.leftCard[i].length;j++) {
    				if(this.leftCard[i][j]!=null) {
    					this.layer.removeChild(this.leftCard[i][j]);
    				}
    			}
    		}
    	}
    	this.layer._gameOver();
    	jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "title", "hahahahha");
    }

    //电脑出牌
    this._computerDiscard=function(){
//    	var cards = new Array(); 
//    	cards[0] = new BashaoCard(3, 1, false, true);
//    	cards[1] = new BashaoCard(3, 2, false, true);
//    	cards[2] = new BashaoCard(3, 3, false, true);
//    	cards[3] = new BashaoCard(4, 1, false, true);
//    	cards[4] = new BashaoCard(4, 2, false, true);
//    	cards[5] = new BashaoCard(4, 3, false, true);
//    	cards[6] = new BashaoCard(6, 1, false, true);
//    	cards[7] = new BashaoCard(6, 2, false, true);
//    	cards[8] = new BashaoCard(9, 1, false, true);
//    	cards[9] = new BashaoCard(10, 1, false, true);
//    	cards[10] = new BashaoCard(11, 1, false, true);
//    	cards[11] = new BashaoCard(12, 1, false, true);
//    	cards[12] = new BashaoCard(12, 2, false, true);
//    	cards[13] = new BashaoCard(13, 1, false, true);
//    	var dcsf1 = DevidedCardSolutionFactory.getInstance();
//    	var solutions1 = new Array();
//    	var currSolution1 = null;
//    	dcsf1.getDevidedCardSolution(cards, solutions1, currSolution1);
//    	var bestSolution1 = dcsf1.getBestDevidedCardSolution(solutions1);
//    	var osc1 = dcsf1.getFirstOneSendCard(bestSolution1);
    	
//    	cc.log("------_computerDiscard----");
        var dcsf = DevidedCardSolutionFactory.getInstance();
        var solutions = new Array();
        var currSolution = null;
        dcsf.getDevidedCardSolution(Game._player_cards[Game._who_turn], solutions, currSolution);
        var bestSolution = dcsf.getBestDevidedCardSolution(solutions);
        var osc = dcsf.getFirstOneSendCard(bestSolution);
        if(Game._who_turn!=Game._landlord && this._nextPlayer()!=Game._landlord) {//地主下家出牌
        	var num1 = (bestSolution.oneSendCards==null?0:bestSolution.oneSendCards.length);
        	var num2 = (bestSolution.singleOrDouble==null?0:bestSolution.singleOrDouble.length);
        	//我一把出不完，但是我下家还剩一张牌了
        	if(num1 + num2 > 1 && Game._player_cards[this._nextPlayer()].length==1) {
        		var card = null;
        		for(var i=0;i<Game._player_cards[Game._who_turn].length;i++) {
        			if(card==null) {
        				card = Game._player_cards[Game._who_turn][i]; 
        			}
        			if(card.value>Game._player_cards[Game._who_turn][i].value) {
        				card = Game._player_cards[Game._who_turn][i];
        			}
        		}
        		var oneSendCardList = new Array();
        		oneSendCardList[0]=card;
        		osc = new OneSendCard(oneSendCardList, CardTypeString.SINGLE_CARDTYPE, Game._who_turn);
        	}
        } else { //地主和抗门的
        	if(Game._player_cards[this._nextPlayer()].length==1) {
        		var biggistSingle = null;
        		var doubleCard = null;
        		var num1 = (bestSolution.oneSendCards==null?0:bestSolution.oneSendCards.length);
        		var num2 = (bestSolution.singleOrDouble==null?0:bestSolution.singleOrDouble.length);
        		var solution = new DevidedCardSolution(new Array(), new Array());
        		//不用特意挑出最大的单张，因为剩的如果都是单张，最后一把osc，肯定是最大的单张
        		while(osc.cardType==CardTypeString.SINGLE_CARDTYPE && (num1+num2)>0) {
        			var bestSolutionTmp = new DevidedCardSolution(new Array(), new Array());
        			if(bestSolution.singleOrDouble!=null && bestSolution.singleOrDouble.length>0) {
        				for(var i=0;i<bestSolution.singleOrDouble.length;i++) {
        					if(doubleCard==null && bestSolution.singleOrDouble[i].cardType==CardTypeString.DOUBLE_CARDTYPE) {
        						doubleCard = bestSolution.singleOrDouble[i];
        					}
        					if(biggistSingle==null || bestSolution.singleOrDouble[i].oneSendCardList[0].value>biggistSingle.oneSendCardList[0].value) {
        						biggistSingle = bestSolution.singleOrDouble[i];
        					}
        					if(bestSolution.singleOrDouble[i].cardType!=osc.cardType 
        							|| bestSolution.singleOrDouble[i].oneSendCardList.length!=osc.oneSendCardList.length) {
        						bestSolutionTmp.singleOrDouble[bestSolutionTmp.singleOrDouble.length]=bestSolution.singleOrDouble[i];
        					}
        				}
        			}
        			if(bestSolution.oneSendCards!=null && bestSolution.oneSendCards.length>0) {
        				for(var i=0;i<bestSolution.oneSendCards.length;i++) {
        					if(bestSolution.oneSendCards[i].cardType!=osc.cardType 
        							|| bestSolution.oneSendCards[i].oneSendCardList.length!=osc.oneSendCardList.length) {
        						bestSolutionTmp.oneSendCards[bestSolutionTmp.oneSendCards.length]=bestSolution.oneSendCards[i];
        					}
        				}
        			}
        			osc = dcsf.getFirstOneSendCard(bestSolutionTmp);
        			if(osc==null && doubleCard!=null) {
        				osc = doubleCard;
        			} else if(osc==null && biggistSingle!=null) {
        				osc = biggistSingle;
        			}
        			num1 = (bestSolutionTmp.oneSendCards==null?0:bestSolutionTmp.oneSendCards.length);
        			num2 = (bestSolutionTmp.singleOrDouble==null?0:bestSolutionTmp.singleOrDouble.length);
        			bestSolution = bestSolutionTmp;
        		}
        	} else if(Game._who_turn!=Game._landlord && osc.cardType==CardTypeString.SINGLE_CARDTYPE) { //我是抗门的
        		var oscTmp = null;
        		var solution = new DevidedCardSolution(new Array(), new Array());
        		var type = CardTypeFactory.getCardTypeByCardTypeString(osc.cardType);
        		var num = this._leftCard();
        		var biggerType = type.getBiggerType(osc, num);
        		var num1 = (bestSolution.oneSendCards==null?0:bestSolution.oneSendCards.length);
        		var num2 = (bestSolution.singleOrDouble==null?0:bestSolution.singleOrDouble.length);
        		
        		//不用特意挑出最大的单张，因为剩的如果都是单张，最后一把osc，肯定是最大的单张
        		while(biggerType<BiggerType.D && osc.cardType==CardTypeString.SINGLE_CARDTYPE && (num1+num2) > 0) {
        			var bestSolutionTmp = new DevidedCardSolution(new Array(), new Array());
        			if(bestSolution.singleOrDouble!=null && bestSolution.singleOrDouble.length>0) {
        				for(var i=0;i<bestSolution.singleOrDouble.length;i++) {
        					if(bestSolution.singleOrDouble[i].cardType!=osc.cardType 
        							|| bestSolution.singleOrDouble[i].oneSendCardList[0].value!=osc.oneSendCardList[0].value) {
        						bestSolutionTmp.singleOrDouble[bestSolutionTmp.singleOrDouble.length]=bestSolution.singleOrDouble[i];
        					}
        				}
        			}
        			if(bestSolution.oneSendCards!=null && bestSolution.oneSendCards.length>0) {
        				for(var i=0;i<bestSolution.oneSendCards.length;i++) {
        					if(bestSolution.oneSendCards[i].cardType!=osc.cardType 
        							|| bestSolution.oneSendCards[i].oneSendCardList.length!=osc.oneSendCardList.length) {
        						bestSolutionTmp.oneSendCards[bestSolutionTmp.oneSendCards.length]=bestSolution.oneSendCards[i];
        					}
        				}
        			}
        			oscTmp = dcsf.getFirstOneSendCard(bestSolutionTmp);
        			if(oscTmp==null) {
        				break;
        			}
        			biggerType = CardTypeFactory.getCardTypeByCardTypeString(oscTmp.cardType);
        			if(biggerType>=BiggerType.E) {
        				break;
        			}
        			osc = oscTmp;
        			num1 = (bestSolutionTmp.oneSendCards==null?0:bestSolutionTmp.oneSendCards.length);
        			num2 = (bestSolutionTmp.singleOrDouble==null?0:bestSolutionTmp.singleOrDouble.length);
        			bestSolution = bestSolutionTmp;
        		}
        	}
        }
        if(osc==null) {//这是出牌逻辑,肯定不会为空的啊
            this._showPassLabel();
            musicutil.playEffect("res/audio/pass.ogg");
        } else {
            osc.setWhoSend(Game._who_turn);
//            cc.log("---------电脑出牌:" + osc.toString());
            Game._pre_one_sendcard = osc;
            this._showDiscardSprite();
            this._removeArrayElements(Game._player_cards[Game._who_turn], Game._pre_one_sendcard.oneSendCardList);
            
            var cardType=CardTypeFactory.getCardTypeByCardTypeString(osc.getCardType());
            var url = cardType.effectUrl(osc);
            musicutil.playEffect(url);
            this._afterDiscard(osc);
        }
        this._clearNextPlayer();
        this._updateLeftCard(Game._who_turn);
        Game._who_turn = this._nextPlayer();
    }
    
    this._afterDiscard=function(osc) {
    	if(osc!=null && osc.cardType==CardTypeString.FOUR_CARDTYPE) {
    		Game._RATE = Game._RATE * 2;
    		this.layer._doubleRate();
    	}
    }
    
    this._leftCard=function(){
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
    	return num;
    }

    this._nextPlayer=function(){
        var next = Game._who_turn + 1;
        if(next>=3) {
            return 0;
        }
        return next;
    }

    this._biggestCard = function(who) {
    	var biggest = null;
    	for(var i=0;i<Game._player_cards[who].length;i++) {
    		if(biggest==null || biggest.value<Game._player_cards[who][i].value) {
    			biggest = Game._player_cards[who][i];
    		}
    	}
    	return biggest;
    }
    
    //电脑压牌
    this._computerPressCard=function() {
//    	cc.log("------_computerPressCard----");
        var dcsf = DevidedCardSolutionFactory.getInstance();
        var solutions = new Array();
        var currSolution = null;
        dcsf.getDevidedCardSolution(Game._player_cards[Game._who_turn], solutions, currSolution);
        var bestSolution = dcsf.getBestDevidedCardSolution(solutions);

        var osc = null;
        var next = Game._who_turn + 1;
        var preWho = Game._pre_one_sendcard.whoSend;
        var preCardType = Game._pre_one_sendcard.cardType;
        
        if(next>=3) {
        	next = 0;
        }
        if(Game._who_turn==Game._landlord && Game._player_cards[next].length==1 && preCardType==CardTypeString.SINGLE_CARDTYPE) {
        	var card = this._biggestCard(Game._who_turn);
        	if(card.value>Game._pre_one_sendcard.oneSendCardList[0].value) {
        		var oneSendCardList = new Array();
        		oneSendCardList[0] = card;
        		osc = new OneSendCard(oneSendCardList, CardTypeString.SINGLE_CARDTYPE, Game._who_turn);
        	}
        } else if(Game._who_turn!=Game._landlord && next==Game._landlord && Game._player_cards[next].length==1 && preCardType==CardTypeString.SINGLE_CARDTYPE) {
        	var card = this._biggestCard(Game._who_turn);
        	if(card.value>Game._pre_one_sendcard.oneSendCardList[0].value) {
        		var oneSendCardList = new Array();
        		oneSendCardList[0] = card;
        		osc = new OneSendCard(oneSendCardList, CardTypeString.SINGLE_CARDTYPE, Game._who_turn);
        	}
        } else if(Game._who_turn==Game._landlord) { //我是地主
        	osc = CardTypeFactory.getBiggerOneSendCard(Game._player_cards[Game._who_turn], Game._pre_one_sendcard);
        } else if(next == Game._landlord) { //我是抗牌的
        	if(preWho==Game._landlord) {
        		osc = CardTypeFactory.getBiggerOneSendCard(Game._player_cards[Game._who_turn], Game._pre_one_sendcard);
        	} else { //压队友的单牌
        		var oscTmp = CardTypeFactory.getBiggerOneSendCard(Game._player_cards[Game._who_turn], Game._pre_one_sendcard);
        		if(oscTmp!=null) {
        			var type = CardTypeFactory.getCardTypeByCardTypeString(oscTmp.cardType);
        			var num = this._leftCard();
        			var biggerType = type.getBiggerType(oscTmp, num);
        			var leftCards = ArrayUtil.exclude(Game._player_cards[Game._who_turn], oscTmp.oneSendCardList);
        			if(biggerType==BiggerType.F && CardTypeFactory.getCardType(leftCards)!=CardTypeString.NONE_CARDTYPE) {
        				osc = oscTmp;
        			} else if(preCardType == CardTypeString.SINGLE_CARDTYPE || preCardType==CardTypeString.DOUBLE_CARDTYPE) {
        				if(Game._player_cards[preWho].length>1) {
        					//队友打出的是单牌或者对子，我压牌时，用的牌太大，我也不要
        					var biggerType = CardTypeFactory.getCardTypeByCardTypeString(preCardType).getBiggerType(Game._pre_one_sendcard, num);
        					if(biggerType<BiggerType.D) {
        						if(bestSolution.singleOrDouble!=null && bestSolution.singleOrDouble.length>0) {
        							for(var i=0;i<bestSolution.singleOrDouble.length;i++) {
        								if(bestSolution.singleOrDouble[i].cardType == preCardType) {
        									if(CardTypeFactory.compareOneSendCard(bestSolution.singleOrDouble[i], Game._pre_one_sendcard)>0) {
        										var biggertype2 = CardTypeFactory.getCardTypeByCardTypeString(preCardType).getBiggerType(bestSolution.singleOrDouble[i], num);
        										if(biggertype2<BiggerType.E) {
        											if(osc==null) {
        												osc = bestSolution.singleOrDouble[i];
        											} else if(osc.oneSendCardList[0].value < bestSolution.singleOrDouble[i].oneSendCardList[0].value) {
        												osc = bestSolution.singleOrDouble[i];
        											}	
        										}
        									}

        								}
        							}
        						}
        					}
        				}
        			}
        		}
        	}
        } else { //我是地主下家   都取出来，下面会判断是否要压牌
        	osc = CardTypeFactory.getBiggerOneSendCard(Game._player_cards[Game._who_turn], Game._pre_one_sendcard);
        	if(osc!=null && !pressValid.press(osc)) {
        		osc = null;
        	}
        }
        
        if(osc==null) {//这是出牌逻辑,肯定不会为空的啊
            this._showPassLabel();
            musicutil.playEffect("res/audio/pass.ogg");
        } else {
    		osc.setWhoSend(Game._who_turn);
    		Game._pre_one_sendcard = osc;
    		this._showDiscardSprite();
    		this._removeArrayElements(Game._player_cards[Game._who_turn], Game._pre_one_sendcard.oneSendCardList);
    		this._updateLeftCard(Game._who_turn);
    		
    		var cardType=CardTypeFactory.getCardTypeByCardTypeString(osc.getCardType());
    		var url = cardType.effectUrl(osc);
    		musicutil.playEffect(url);
    		this._afterDiscard(osc);
        }
        this._clearNextPlayer();
        Game._who_turn = this._nextPlayer();
    }

    this._updateLeftCard = function(player) {
        var leftCards = this.leftCard[player];
        if(leftCards!=null && leftCards.length>0) {
            for(var i=0;i<leftCards.length;i++){
                this.layer.removeChild(leftCards[i]);
//                leftCards[i].release();
            }
        }
        this.leftCard[player] = new Array();

        var left =Game._player_cards[player].length;
        var x = 60;
        var y = 340;
        if(player==1) {
            x = 750;
        }

        //扑克背景
        if(this.leftCardImg[player]==null) {
        	var label = new cc.Sprite(res.Card_back_png);
        	label.retain();
        	label.scale=0.1;
        	label.x= x - 18;
        	label.y = y;
        	this.layer.addChild(label);
        	this.leftCardImg[player]=label;
        }

        var index = 0;
        if(left>=10) {
            var num = new cc.Sprite("res/num/gold_num_" + Math.floor(left/10) + ".png");
            num.retain();
            num.x = x;
            num.y = y;
            num.scale = 0.2;
            this.layer.addChild(num);
            this.leftCard[player][index++] = num;
            x = x + 14;
        }

        var num = new cc.Sprite("res/num/gold_num_" + left%10 + ".png");
        num.retain();
        num.x = x;
        num.y = y;
        num.scale = 0.2;
        this.layer.addChild(num);
        this.leftCard[player][index] = num;
    }

    //玩家出牌
    this._playerDiscard=function(){
//    	cc.log("------_playerDiscard----");
        if(Game._who_turn!=0) {
            return ;
        }
        if(this.callMenu!=null) {
            this.layer.removeChild(this.callMenu);
//            this.callMenu.release();
            this.callMenu = null;
        }

        var size = cc.director.getWinSize();

        var passBtn = null;
        if(this._passButtonEnable()) {
        	passBtn = new cc.MenuItemImage(res.Button_pass_light, res.Button_pass_light, this._pass, this);
//        	passBtn = new cc.MenuItemImage(res.Button_pass_light, res.Button_pass_light, function a(){this._pass();}, this);
        } else {
        	passBtn = new cc.MenuItemImage(res.Button_pass_gray,res.Button_pass_light,this._pass, this);
        }

        var rechooseBtn = null;
        if(this._rechooseButtonEnable()) {
        	rechooseBtn = new cc.MenuItemImage(res.Button_rechoose_light,res.Button_rechoose_light,this._rechoose, this);
//        	rechooseBtn = new cc.MenuItemImage(res.Button_rechoose_light,res.Button_rechoose_light,function a(){this._rechoose();}, this);
        } else {
        	rechooseBtn = new cc.MenuItemImage(res.Button_rechoose_gray,res.Button_rechoose_gray,this._rechoose, this);
        }

        var tipsBtn = null;
        if(this._tipsButtonEnable()) {
        	tipsBtn = new cc.MenuItemImage(res.Button_tip_light,res.Button_tip_light,this._tips, this);
//        	tipsBtn = new cc.MenuItemImage(res.Button_tip_light,res.Button_tip_light,function a(){this._tips();}, this);
        } else {
        	tipsBtn = new cc.MenuItemImage(res.Button_tip_gray,res.Button_tip_gray,this._tips, this);
        }

        var discardBtn = null;
        if(this._discardButtonEnable()) {
        	discardBtn = new cc.MenuItemImage(res.Button_discard_light,res.Button_discard_light,this._discard, this);
//        	discardBtn = new cc.MenuItemImage(res.Button_discard_light,res.Button_discard_light,function a(){this._discard();}, this);
        } else {
        	discardBtn = new cc.MenuItemImage(res.Button_discard_gray,res.Button_discard_gray,this._discard, this);
        }

        passBtn.x = size.width / 2 - 300;
        passBtn.y = size.height / 2 - 50;
        rechooseBtn.x = size.width / 2 - 100;
        rechooseBtn.y = size.height / 2 - 50;
        tipsBtn.x = size.width / 2 + 100;
        tipsBtn.y = size.height / 2 - 50;
        discardBtn.x = size.width / 2 + 300;
        discardBtn.y = size.height / 2 - 50;
        this.callMenu = new cc.Menu(passBtn, rechooseBtn, tipsBtn,discardBtn);
        this.callMenu.retain();
        this.callMenu.x = 0;
        this.callMenu.y = 0;
        this.callMenu.scale = 0.5
        this.layer.addChild(this.callMenu);
        return true;
    }


    //不要
    this._pass=function() {
    	if(!this._passButtonEnable()) {
    		return ;
    	}
        this.layer.removeChild(this.callMenu);
//        this.callMenu.release();
        this._showPassLabel();
        this._clearNextPlayer();
        Game._who_turn = this._nextPlayer();
        this.end = true;
        
        musicutil.playEffect("res/audio/pass.ogg");
    }
    //不要按钮是否可用
    this._passButtonEnable = function() {
        if(Game._who_turn == 0) {
            if(Game._pre_one_sendcard==null) {
                return false;
            }
            if(Game._pre_one_sendcard.getWhoSend()==0) {
                return false;
            }
        }
        return true;
    }

    //重选
    this._rechoose=function() {
    	if(!this._rechooseButtonEnable()) {
    		return ;
    	}
        var cards = Game._player_cards[0];
        for(var i=0;i<cards.length;i++) {
            if(cards[i].clicked) {
                cards[i].clicked = !cards[i].clicked;
                cards[i].y = cards[i].y - Game._card_up_distance
            }
        }
    }
    this._rechooseButtonEnable = function() {
        var cards = Game._player_cards[0];
        for(var i=0;i<cards.length;i++) {
            if(cards[i].clicked) {
                return true;
            }
        }
        return false;
    }

    //提示
    this._tips=function() {
    	if(!this._tipsButtonEnable()) {
    		return ;
    	}
        var cards = Game._player_cards[0];
        //如果有被选中的,先还原
        for(var i=0;i<cards.length;i++) {
            if(cards[i].clicked) {
                cards[i].sety = cards[i].getY() - Game._card_up_distance;
                cards[i].setClicked(!cards[i].clicked);
            }
        }

        var osc = CardTypeFactory.getBiggerOneSendCard(cards, Game._pre_one_sendcard);
        if(osc!=null && osc.getOneSendCardList().length>0) {
            for(var i=0;i<osc.getOneSendCardList().length;i++) {
                var card = osc.getOneSendCardList()[i];
                card.y = card.y + Game._card_up_distance;
                card.setClicked(!card.clicked);
            }
//            cc.log("---------上家出牌:" + Game._pre_one_sendcard.toString() + ",我出的牌:" + osc.toString());
            this._discard();
        } else {
            this.layer.removeChild(this.callMenu);
//          this.callMenu.release();
            this._showPassLabel();
            musicutil.playEffect("res/audio/pass.ogg");
            this._clearNextPlayer();
            Game._who_turn = this._nextPlayer();
            this.end = true;
        }
    }
    this._tipsButtonEnable=function() {
        if(Game._who_turn==0) {
            if(Game._pre_one_sendcard==null) {
                return false;
            }
            if(Game._pre_one_sendcard.getWhoSend()==0) {
                return false;
            }
        }
        return true;
    }

    //出牌
    this._discard=function() {
    	if(!this._discardButtonEnable()) {
    		return ;
    	}
    	if(this.callMenu!=null) {
    		this.layer.removeChild(this.callMenu);
    	}
//        this.callMenu.release();
        this._clearNextPlayer();

        var selectedCards = new Array();
        var cards = Game._player_cards[0];
        for(var i=0;i<cards.length;i++) {
            if(cards[i].clicked) {
                selectedCards[selectedCards.length] = cards[i];
            }
        }
        var type = CardTypeFactory.getCardType(selectedCards);
        if(type==CardTypeString.NONE_CARDTYPE) {
            return false;
        }
        for(var i=0;i<selectedCards.length;i++) {
            this.layer.removeChild(selectedCards[i]);
//            selectedCards[i].release();
        }
        var osc = new OneSendCard(selectedCards, type, Game._who_turn);
//        cc.log("---------我出牌:" + osc.toString());

        Game._pre_one_sendcard = osc;
        this._showDiscardSprite();
        this._removeArrayElements(Game._player_cards[0], selectedCards);
        this._clearNextPlayer();
        this.layer._resetPlayerCardPosition();

        Game._who_turn = this._nextPlayer();
        this.end = true;
        
        var cardType=CardTypeFactory.getCardTypeByCardTypeString(osc.getCardType());
        var url = cardType.effectUrl(osc);
        musicutil.playEffect(url);
        this._afterDiscard(osc);
    }
    this._discardButtonEnable=function(){
        var selectedCards = new Array();
        var cards = Game._player_cards[0];
        for(var i=0;i<cards.length;i++) {
            if(cards[i].clicked) {
                selectedCards[selectedCards.length] = cards[i];
            }
        }
        var type = CardTypeFactory.getCardType(selectedCards);
        if(type==CardTypeString.NONE_CARDTYPE) {
            return false;
        }
        if(Game._pre_one_sendcard==null) {
            return true;
        }
        if(Game._pre_one_sendcard.whoSend==Game._who_turn) {
            return true;
        }
        //压牌情况
        if(type==CardTypeString.FOUR_CARDTYPE && Game._pre_one_sendcard.getCardType()!=CardTypeString.FOUR_CARDTYPE) {
            return true;
        }
        var osc = new OneSendCard(selectedCards, type, Game._who_turn);
        return CardTypeFactory.compareOneSendCard(osc, Game._pre_one_sendcard) > 0;
    }

    this._clearNextPlayer=function() {
        var who = Game._who_turn;
        who++;
        if(who>=3) {
            who = 0;
        }

        if(this.discard[who]!=null && this.discard[who].length>0) {
            for(var i=0;i<this.discard[who].length;i++) {
                this.layer.removeChild(this.discard[who][i]);
//                this.discard[who][i].release();
            }
            this.discard[who].length=null;
        }
        if(this.labels[who]!=null) {
            this.layer.removeChild(this.labels[who]);
//            this.labels[who].release();
            this.labels[who] = null;
        }
    }

    this._removeArrayElements=function(origin, removes) {
        for(var i=0;i<removes.length;i++) {
            origin.remove(removes[i])
        }
    }

    //仅限玩家出牌时调用
    this._removeDiscardSprite=function() {
        var myCards = Game._player_cards[0];
        var osc = Game._pre_one_sendcard.oneSendCardList;
        for(var i=0;i<myCards.length;i++) {
            for(var j=0;j<osc.length;j++) {
                if(myCards[i].value==osc[j].value && myCards[i].clr==osc[j].clr) {
                    this.layer.remove(myCards[i]);
                    myCards.remove(myCards[i]);
                }
            }
        }
        //插入屏幕中
        var size = cc.director.getWinSize();
        var fromX = size.width/2 - myCards.length / 2 * Game._card_offset - Game._card_offset;
        var centY = size.height/7;
        for(var i=0;i<Game._player_cards[0].length;i++) {
            Game._player_cards[0][i].x = fromX;
            Game._player_cards[0][i].y = centY;
            Game._player_cards[0][i].anchorX=0;
            Game._player_cards[0][i].anchorY=0;
            fromX += Game._card_offset;
        }
    }

    //显示打出去的牌
    this._showDiscardSprite=function() {
        var fromX = 350;
        var centY = 200;
        if(Game._who_turn==1) {
            fromX = 650 - Game._pre_one_sendcard.oneSendCardList.length * Game._card_offset_discard;
            centY = 300;
        }
        if(Game._who_turn==2) {
        	fromX = 120
            centY = 300;
        }
        this.discard[Game._who_turn] = new Array();
        var cards = Game._pre_one_sendcard.oneSendCardList;
        for(var i=0;i<cards.length;i++) {
            cards[i].x = fromX;
            cards[i].y = centY;
            cards[i].anchorX=0;
            cards[i].anchorY=0;
            cards[i].scale=0.4;
            this.layer.addChild(cards[i]);
            fromX += Game._card_offset_discard;
            this.discard[Game._who_turn][i] = cards[i];
        }
        if(Game._who_turn==Game._landlord) {
        	var card = cards[cards.length - 1];
        	var sprite = new cc.Sprite(res.lord);
        	sprite.x = card.x + 39;
        	sprite.y = card.y + 51;
        	sprite.scale = 0.3;
        	this.layer.addChild(sprite);
        	this.discard[Game._who_turn][cards.length] = sprite; 
        }
    }

    //显示不要标签
    this._showPassLabel=function(){
        var label = new cc.Sprite(res.Label_pass);
        label.retain();
        if(Game._who_turn==0) {
            label.x = 140
            label.y = 220;
        }
        if(Game._who_turn==1) {
            label.x = 660
            label.y = 370;
        }
        if(Game._who_turn==2) {
            label.x = 140
            label.y = 370;
        }
        label.scale=0.55;
        this.labels[Game._who_turn] = label;
        this.layer.addChild(label);
    }
}