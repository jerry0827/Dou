var ruleLayer = cc.Layer.extend({
	rules: null,
	scene:null,
	smallY:null,
	bigY:null,

	ctor: function(scene) {
		this._super();
		this.scene=scene;
		var size = cc.director.getWinSize();
		var fromX = null;
		var fromY = null;
		
		
		//背景图片
		var sprite = new cc.Scale9Sprite(res.Rule_bg);
		sprite.x = size.width / 2;
		sprite.y = size.height / 2;
		sprite.width = size.width;
		sprite.height = size.height;
		sprite.scale = 0.9;
		this.addChild(sprite, 1);
		
		//关闭按钮
		var close = new cc.MenuItemImage(res.Rule_close, res.Rule_close, this._onClose.bind(this), this);
		close.x = sprite.x + 330;
		close.y = sprite.y + 170;
		var closeMenu = new cc.Menu(close);
		closeMenu.x = 0;
		closeMenu.y = 0;
		this.addChild(closeMenu, 1);
		
		
		var stencil = new cc.DrawNode(); 
		stencil.drawRect(cc.p(100, 50), cc.p(700, 370), cc.color(0, 0, 0), 1, cc.Color(0, 0, 0));
		
		var clippingPanel = new cc.ClippingNode(stencil);
		this.addChild(clippingPanel, 2);

		for(var i=1;i<=5;i++) {
			var rule = new cc.Scale9Sprite("res/rule/longPageRule" + i + ".png");
			if(this.rules==null) {
				this.rules = new Array();
			}
			if(fromX == null) {
				fromX = Math.ceil((size.width - rule.width) / 2 + 30);
//				fromY = size.height - rule.height + 25;
				fromY = size.height - rule.height + 265;
				this.bigY = fromY;
			}
			this.rules[this.rules.length] = rule;
			rule.anchorX=0;
			rule.anchorY=0;
			rule.x = fromX;
			rule.y = fromY;
			rule.scale = 0.9;
			clippingPanel.addChild(rule, 1);

			this.smallY = fromY;
			fromY = fromY - rule.height + 70;
			if(i==4) {
				fromY = fromY + 250;
			}
		}
		
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this._onMouseDown.bind(this),
			onTouchMoved: this._onMove.bind(this)
		}, this);
		
		return true;
	},
	
	_onClose:function() {
		this.scene.removeChild(this);
	},
	
	//尼玛坑爹玩意，用不到也要有个return true，否则onTouchMoved根本不调用
	_onMouseDown:function(touch, event) {
		return true;
	},

	_onMove: function(touch, event) {
		// 移动当前按钮精灵的坐标位置
		var target = event.getCurrentTarget();
		var fromX = null;
		var fromY = null;
		var delta = touch.getDelta();			  //获取事件数据: delta
		if(fromX == null || fromY == null) {
			fromX = delta.x;
			fromY = delta.y;
		}
		
		var by = this.rules[0].y;
		var sy = this.rules[this.rules.length-1].y;
		cc.log(this.bigY + " : " + this.smallY);
//		if(sy + delta.y > this.bigY + 400) {
		if(sy + delta.y > this.bigY + 50) {
			return;
		}
		if(by + delta.y < this.bigY) {
			return;
		}
		
		for(var i=0;i<this.rules.length;i++) {
			this.rules[i].y += delta.y;
		}
	},
});

/**
 * 暂时没用到
 */
var setLayer = cc.Layer.extend({
	scene:null,

	ctor: function(scene) {
		this._super();
		this.scene=scene;
		var size = cc.director.getWinSize();

		//背景图片
		var sprite = new cc.Scale9Sprite(res.Sett_bg);
		sprite.x = size.width / 2;
		sprite.y = size.height / 2;
		sprite.scale = 0.9;
		this.addChild(sprite, 1);

		//关闭按钮
		var close = new cc.MenuItemImage(res.Rule_close, res.Rule_close, this._onClose.bind(this), this);
		close.x = sprite.x + 330;
		close.y = sprite.y + 170;
		var closeMenu = new cc.Menu(close);
		closeMenu.x = 0;
		closeMenu.y = 0;
		this.addChild(closeMenu, 1);
		
		return true;
	},

	_onClose:function() {
		this.scene.removeChild(this);
	}

});

//背景层放了背景图片和玩家头像,不会变的东西
var backgroundLayer = cc.Layer.extend({
	scene:null,
 
	ctor: function (scene) {
		this._super();
		this.scene = scene;
		var size = cc.director.getWinSize();
		
		//背景图片
		var sprite = new cc.Scale9Sprite(res.BackGround_jpg);
		sprite.x = size.width / 2;
		sprite.y = size.height / 2;
		sprite.width = size.width;
		sprite.height = size.height;
		this.addChild(sprite, 1);
 
		//玩家头像
		this.drawHeader(res.Header_2_png, 60, 200, 0.9);
		this.drawHeader(res.Header_5_png, 740, 390, 0.9);
		this.drawHeader(res.Header_6_png, 60, 390, 0.9);
		
		//toolBar
		var back = new cc.MenuItemImage(res.Back, res.Back, function() {
			this.scene.restart();
		}, this);
		
		
		var soundsOpen = new cc.MenuItemImage(res.Sound_close,res.Sound_close); //声音
		var soundsClose = new cc.MenuItemImage(res.Sound_open,res.Sound_open); //声音
		var sounds = new cc.MenuItemToggle(soundsOpen, soundsClose, function(){
			musicutil.changeStatus();
		}, this);
		
		back.x = size.width / 2 - 230;
		back.y = size.height / 2 + 310;
		back.scale = 0.9;
		
		cc.MenuItemFont.setFontName("Times New Roman");                     
		cc.MenuItemFont.setFontSize(43);
		
		var baseScore = new cc.MenuItemFont("底分:  2", function(){
			cc.director.popScene();
		}, this);
		baseScore.setColor(cc.color(255, 106, 106));
		baseScore.x = 570;
		baseScore.y = 560;
		baseScore.scale = 0.7;
		var rateScore = new cc.MenuItemFont("倍数:    ", function(){
			cc.director.popScene();
		}, this);
		rateScore.setColor(cc.color(255, 106, 106));
		rateScore.x = 570;
		rateScore.y = 520;
		rateScore.scale = 0.7;
		var exitMenu = new cc.Menu(baseScore, rateScore);
		exitMenu.x = 0;
		exitMenu.y = 0;
		exitMenu.scale = 0.6;
		this.addChild(exitMenu, 2);

		sounds.x = size.width / 2 - 135;
		sounds.y = 535;
		sounds.scale = 0.9;

		var toolMenu = new cc.Menu(back, sounds);
		toolMenu.x = 0;
		toolMenu.y = 0;
		toolMenu.scale = 0.6;
		this.addChild(toolMenu, 1);
	},
	
	_showRule: function() {
		this.rule = new ruleLayer(this.scene);
		this.scene.addChild(this.rule);
	},
	
	drawHeader: function (res, x, y, scale) {
	 	var sprite1 = new cc.Sprite(res);
		sprite1.x = x;
		sprite1.y = y;
		sprite1.scale = scale;
		this.addChild(sprite1, 2);

		var sprite2 = new cc.Sprite("res/player/header_frame.png");
		sprite2.x = x;
		sprite2.y = y;
		sprite2.scale = 0.6;
		this.addChild(sprite2, 3);
	}
});

//纸牌层,出的牌,标签,出牌按钮等
var cardLayer = cc.Layer.extend({
	readyMenu:null, //准备按钮,点击后要删除的
	callMenu:null, //叫地主按钮
	callLabels:new Array(), //存放每个玩家叫与不叫的Label
	scene:null,
	logic:null,
	_startX:0,
	_startY:0,
	_preX:0,
	_preY:0,
	selectedCard:new Array(),
	rate:new Array(),
	rateSprite:null,

	ctor: function (scene) {
		this._super();
		this.scene =  scene;
		this._ready();
		this._updateScore();
		
		return true;
	},
	
	_updateScore: function() {
		var score = cc.sys.localStorage.getItem("score");
		
		//剩余金币
		var goldBg = new cc.Sprite(res.Gold_bg);
		goldBg.x = 80;
		goldBg.y = 20;
		goldBg.scale = 0.8;
		this.addChild(goldBg);
		var goldSprite = new cc.Scale9Sprite(res.Gold_icon);
		goldSprite.x = 20;
		goldSprite.y = 20;
		goldSprite.scale = 0.2;
		this.addChild(goldSprite);

		var nums = new Array();
		while(score>0) {
			var num = score % 10;
			nums[nums.length] = num;
			score = Math.floor(score / 10);
		}
		var x = 30;
		var y = 19;
		for(var i=nums.length-1;i>=0;i--) {
			var num = nums[i];
			var sprite1 = new cc.Sprite("res/num/gold_num_" + num + ".png");
			sprite1.x = x + 17;
			sprite1.y = y;
			sprite1.scale=0.25;
			this.addChild(sprite1);
			x = x + 17;
		}
	},

	_ready: function() {
		var size = cc.director.getWinSize();
		//准备按钮
		var readyButton = new cc.MenuItemImage(res.Button_ready, res.Button_ready, this._onBegin, this);
		//擦,必须放到Menu中,点击才能有作用
		readyButton.x = size.width / 2;
		readyButton.y = size.height / 2;
		//Menu相当于一个层,所以设置左下角在为0,0;按钮在层的正中间,所以为size.width/2,size.height/2
		this.readyMenu = new cc.Menu(readyButton);
		this.readyMenu.x = 0;
		this.readyMenu.y = 0;
		this.readyMenu.scale = 0.6;
		this.addChild(this.readyMenu);
	},

	_onBegin: function() {
		Game.reset();
		this._onBeginClear();
		this._dispachcCard();
	},

	_onBeginClear: function() {
		if(this.readyMenu!=null) {
			this.removeChild(this.readyMenu);
			this.readyMenu = null;
		}
		if(Game._player_cards.length>0) {
			for(var i=0;i<Game._player_cards[0].length;i++) {
				this.removeChild(Game._player_cards[0][i]);
			}
		}
		for(var i=0;i<Game._bottom_cards.length;i++) {
			this.removeChild(Game._bottom_cards[i]);
		}
		for(var i=0;i<Game._bottom_cards_back.length;i++) {
			this.removeChild(Game._bottom_cards_back[i]);
		}
	},

	//发牌
	_dispachcCard: function() { 
		var cards = this._initCards();
		//将牌打乱
		cards.shuffle();
		Game._player_cards[0] = cards.slice(0,17);
		Game._player_cards[1] = cards.slice(17,34);
		Game._player_cards[2] = cards.slice(34,51);
		Game._bottom_cards = cards.slice(51,54);
		
		Game._player_cards[0].sort(OneSendCard.sortFunction);
		Game._player_cards[1].sort(OneSendCard.sortFunction);
		Game._player_cards[2].sort(OneSendCard.sortFunction);
		Game._bottom_cards.sort();

		this._insertSprite();
		this._insertBottomCardBack();
		//开始选地主
		this._chooseLandlord();
		
	},

	//开始选地主
	_chooseLandlord: function() {
		this.schedule(this._scheduleChoose, 1, cc.REPEAT_FOREVER, 1);
	},
	 
	_readyStart: function(){
		for(var i=0;i<this.rate.length;i++) {
			this.removeChild(this.rate[i]);
		}
		this._showMark();
		this.rate = new Array();
		this._startGame();
	},
	
	_showMark: function() {
		for(var i=0;i<3;i++) {
			var x = 0;
			var y = 0;
			
			if(i==0) {
				x = 31;
				y = 213;
			} else if(i==1) {
				x = 715;
				y = 404;
			} else {
				x = 31;
				y = 404;
			}
			
			var sprite = null;
			if(Game._landlord == i) {
				sprite = new cc.Sprite(res.landlord);
			} else {
				sprite = new cc.Sprite(res.famer);
			}
			sprite.x = x;
			sprite.y = y;
			sprite.scale = 0.5;
			this.addChild(sprite);
		}
	},
	
	_scheduleChoose: function() {
		if(this.whoTurn==null) {
			this.whoTurn = Math.ceil(Math.random() * 3) - 1;
		}
		if(this.nextplayer==null) {
			this.nextplayer=true;
		}
		if(!this.nextplayer) {
			return ;
		}
		if(this._chooseEnd(this.whoTurn)) {
			this.unschedule(this._scheduleChoose);
			this.scheduleOnce(this._readyStart, 3);
			return ;
		}

		var nextWho = this.whoTurn + 1;
		if(nextWho>=3) {
			nextWho = 0;
		}
		var currentWho = this.whoTurn;
		Game._call_times++;
		this.whoTurn = nextWho;
		
		
		this.nextplayer=!this.nextplayer;
		if(currentWho==0) {//玩家
			this._playerCall();
		} else {//电脑
			this._computeCall(currentWho);
			this.nextplayer = true;
			
			this._afterCall(currentWho, nextWho);
		} 
		
	},

	_startGame: function() {
		for(var i=0;i<this.callLabels.length;i++) {
			if(this.callLabels[i]!=null) {
				this.removeChild(this.callLabels[i]);
			}
		}
		this.callLabels.length=0;
		for(var i=0;i<Game._bottom_cards_back.length;i++) {
			this.removeChild(Game._bottom_cards_back[i]);
		}

		if(Game._landlord!=null) {
			if(this.readyMenu!=null) {
				this.removeChild(this.readyMenu);
				this.readyMenu = null;
			}

			var cards = Game._player_cards[Game._landlord];
			if(Game._landlord==0) {
				for(var i=0;i<cards.length;i++) {
					this.removeChild(cards[i]);
				}
			}
			for(var i=0;i<Game._bottom_cards.length;i++) {
				cards[cards.length] = Game._bottom_cards[i];
			}
			cards.sort(OneSendCard.sortFunction);
			if(Game._landlord==0) {
				this._insertBottomCard2Player();
			}
			this._insertBottomCard();

			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: this._onMouseDown.bind(this),
				onTouchMoved: this._onMove.bind(this),
				onTouchEnded: this._onMouseUp.bind(this)
			}, this);

			this.logic = new gameLogic(this);
			Game._who_turn = Game._landlord;
			this.logic._updateLeftCard(1);
			this.logic._updateLeftCard(2);
			
			this.schedule(this._discardSchedule, 1, cc.REPEAT_FOREVER, 1);
		} else {
			this._onBegin();
		}
	},
	
	_onMove: function(touch, event) {
		// 移动当前按钮精灵的坐标位置
		var pos = touch.getLocation();
		var touchX = pos.x;
		var touchY = pos.y;
		if(this._startX > touchX) {
			if(this._preX > touchX) {
				for(var i=0;i<Game._player_cards[0].length;i++) {
					var card = Game._player_cards[0][i];
					if(!Game._player_cards[0][i].canClick) {
						continue;
					}
					var sx = card.x;
					var sy= card.y;
					var ex = sx + Game._card_offset;
					var ey = sy + card.height;
					if(i==Game._player_cards[0].length-1) {
						ex = sx + card.width;
					}
					if(sx <= touchX && ex>=touchX && sy<=touchY && ey>=touchY) {
						if(this.selectedCard.contains(card)) {
							break;
						} else {
							card.setColor(cc.color(192, 192, 192));
							this.selectedCard[this.selectedCard.length] = card;
						}
					}
				}
			} else {
				for(var i=0;i<Game._player_cards[0].length;i++) {
					var card = Game._player_cards[0][i];
					if(!Game._player_cards[0][i].canClick) {
						continue;
					}
					var sx = card.x;
					var sy= card.y;
					var ex = sx + Game._card_offset;
					var ey = sy + card.height;
					if(i==Game._player_cards[0].length-1) {
						ex = sx + card.width;
					}
					if(sx <= this._preX && ex>=this._preX && sy<=this._preY && ey>=this._preY) {
						if(this.selectedCard.contains(card)) {
							if(!(sx<=touchX && ex>=touchX && sy<=touchY && ey>=touchY)) {
								card.setColor(cc.color(255, 255, 255));
								this.selectedCard.remove(card);
							}
						}
					}
				}
			}
		} else {
			if(this._preX < touchX) {
				for(var i=0;i<Game._player_cards[0].length;i++) {
					var card = Game._player_cards[0][i];
					if(!Game._player_cards[0][i].canClick) {
						continue;
					}
					var sx = card.x;
					var sy= card.y;
					var ex = sx + Game._card_offset;
					var ey = sy + card.height;
					if(i==Game._player_cards[0].length-1) {
						ex = sx + card.width;
					}
					if(sx <= touchX && ex>=touchX && sy<=touchY && ey>=touchY) {
						if(this.selectedCard.contains(card)) {
							break;
						} else {
							card.setColor(cc.color(192, 192, 192));
							this.selectedCard[this.selectedCard.length] = card;
						}
					}
				}
			} else {
				for(var i=0;i<Game._player_cards[0].length;i++) {
					var card = Game._player_cards[0][i];
					if(!Game._player_cards[0][i].canClick) {
						continue;
					}
					var sx = card.x;
					var sy= card.y;
					var ex = sx + Game._card_offset;
					var ey = sy + card.height;
					if(i==Game._player_cards[0].length-1) {
						ex = sx + card.width;
					}
					if(sx <= this._preX && ex>=this._preX && sy<=this._preY && ey>=this._preY) {
						if(this.selectedCard.contains(card)) {
							if(!(sx<=touchX && ex>=touchX && sy<=touchY && ey>=touchY)) {
								card.setColor(cc.color(255, 255, 255));
								this.selectedCard.remove(card);
							}
						} else {
							if(sx <= touchX && ex >= touchX && sy <= touchY && ey >=touchY) {
								this.selectedCard[this.selectedCard.length] = card;
							}
						}
					}
				}
			}
		}
		this._preX = touchX;
		this._preY = touchY;
	},
	
	_onMouseUp: function() {
		for(var i=0;i<this.selectedCard.length;i++) {
			var card = this.selectedCard[i];
			card.setColor(cc.color(255, 255, 255));
			if(card.isClicked()) {
				card.y = card.y - Game._card_up_distance;
			} else {
				card.y = card.y + Game._card_up_distance;
			}
			card.setClicked(!card.isClicked());
		}
		this.logic._playerDiscard();
	},
	
	_restart: function() {
		this.scene.removeChild(this, true);
		this.cardLayer = new cardLayer(this.scene);
		this.scene.addChild(this.cardLayer);		
	},
	
	_gameOver: function() {
		this.unschedule(this._discardSchedule);
		this._turnBackComputerCard();
		this.scheduleOnce(this._settleReward, 1);
		this.scheduleOnce(this._restart, 6);
	},
	
	//一局结束之后的结算
	_settleReward: function() {
		var whoWin = 0;
		var size = cc.director.getWinSize();
		for(var i=0;i<Game._player_cards.length;i++) {
			if(Game._player_cards[i].length==0) {
				whoWin = i;
				break;
			}
		}
		if(whoWin==0) { //我赢了
			var win = new cc.Scale9Sprite(res.Win);
			win.x = size.width / 2;
			win.y = size.height / 2;
			this.addChild(win, 1);
			musicutil.playEffect("res/audio/win.ogg");
		} else { //我输了
			var win = new cc.Scale9Sprite(res.Lose);
			win.x = size.width / 2;
			win.y = size.height / 2;
			this.addChild(win, 1);
			musicutil.playEffect("res/audio/lose.ogg");
		}
		
		var score = Game._RATE * Game.SCORE;
		for(var i=0;i<3;i++) {
			var x = 0;
			var y = 0;
			if(i==0) {
				x = 50;
				y = 200;
			} else if(i==1) {
				x = 400;
				y = 300;
			} else {
				x = 50;
				y = 300;
			}
		
			var x = 0;
			var y = 0;
			if(i==0) {
				x = 45;
				y = 250;
			} else if(i==1) {
				x = 710;
				y = 335;
			} else {
				x = 45;
				y = 335;
			}

			var doubleScore = score * 2;
			
			var winScore = 0;
			if(Game._landlord==whoWin) { //地主赢了
				if(i == whoWin) {
					winScore = doubleScore;
					this._showScore(doubleScore, false, x, y);
				} else {
					winScore = -score;
					this._showScore(score, true, x, y);
				}
			} else { //地主输了
				if(i == Game._landlord) {
					winScore = -doubleScore;
					this._showScore(doubleScore, true, x, y);
				} else {
					winScore = score;
					this._showScore(score, false, x, y);
				}
			}
			if(i==0) {
				var left = parseInt(cc.sys.localStorage.getItem("score"));
				var finalScore = left + winScore;
				cc.sys.localStorage.setItem("score", finalScore);
			}
		}
		this._updateScore();
	},
	
	_showScore: function(score, lose, x, y) {
		var sprite = null;
		if(lose) {
			sprite = new cc.Sprite("res/num/gray_num_sub.png");
		} else {
			sprite = new cc.Sprite("res/num/gold_num_add.png");
		}
		 
		sprite.x = x;
		sprite.y = y;
		sprite.scale=0.25;
		this.addChild(sprite);
		
		var nums = new Array();
		while(score>0) {
			var num = score % 10;
			if(num==0) {
				num = score;
			}
			nums[nums.length] = num;
			score = Math.floor(score / 10);
		}
		
		for(var i=nums.length-1;i>=0;i--) {
			var num = nums[i];
			
			var sprite1 = null;
			if(lose) {
				sprite1 = new cc.Sprite("res/num/gray_num_" + num + ".png");
			} else {
				sprite1 = new cc.Sprite("res/num/gold_num_" + num + ".png");
			}
			 
			sprite1.x = x + 17;
			sprite1.y = y;
			sprite1.scale=0.25;
			this.addChild(sprite1);
			x = x + 17;
		}
	},
	
	_turnBackComputerCard: function() {
		var player1 = Game._player_cards[1];
		var player2 = Game._player_cards[2];
		
		var fromX = 650 - player1.length * Game._card_offset_discard;
		var centY = 300;
		for(var i=0;i<player1.length;i++) {
			player1[i].x = fromX;
			player1[i].y = centY;
			player1[i].anchorX=0;
			player1[i].anchorY=0;
			player1[i].scale=0.4;
			this.addChild(player1[i]);
			fromX += Game._card_offset_discard;
		}
		
		fromX = 120;
		centY = 300;
		for(var i=0;i<player2.length;i++) {
			player2[i].x = fromX;
			player2[i].y = centY;
			player2[i].anchorX=0;
			player2[i].anchorY=0;
			player2[i].scale=0.4;
			this.addChild(player2[i]);
			fromX += Game._card_offset_discard;
		}
	},
	
	_discardSchedule: function(){
		this.logic._start();
	},

	_onMouseDown: function(touch, event){
		var x = touch.getLocation().x;
		var y = touch.getLocation().y;
		this._startX = x;
		this._startY = y;
		this._preX = x;
		this._preY = y;
		this.selectedCard = new Array();
		
		for(var i=0;i<Game._player_cards[0].length;i++) {
			var card = Game._player_cards[0][i];
			if(!Game._player_cards[0][i].canClick) {
				continue;
			}
			var sx = card.x;
			var sy= card.y;
			var ex = sx + Game._card_offset;
			var ey = sy + card.height;
			if(i==Game._player_cards[0].length-1) {
				ex = sx + card.width;
			}
			if(sx <= x && ex>=x && sy<=y && ey>=y) {
				if(this.selectedCard.contains(card)) {
					break;
				} else {
					card.setColor(cc.color(192, 192, 192));
					this.selectedCard[this.selectedCard.length] = card;
				}
			}
		}
//		var cards = Game._player_cards[0];
//		for(var i=0;i<cards.length;i++) {
//			var lx = cards[i].x;
//			var rx = cards[i].x + cards[i].getBoundingBox().width;
//			var ty = cards[i].y + cards[i].getBoundingBox().height;
//			var by = cards[i].y;
//			if(i<cards.length-1) {
//				rx = lx + Game._card_offset;
//			}
//			if(lx<=x && rx>=x && by<=y && ty>=y) {
//				if(cards[i].canClick) {
//					if(cards[i].clicked) {
//						cards[i].y = cards[i].y - Game._card_up_distance;
//					} else {
//						cards[i].y = cards[i].y + Game._card_up_distance;
//					}
//					cards[i].clicked = !cards[i].clicked;
//					this.logic._playerDiscard();
//				}
//			}
//		}
		return true;
	},

	//出牌
	_discard: function() {
		this.logic._discardSchedule();
	},
	
	//是否叫地主
	_computeCallValid: function(whoTurn) {
		var nums = 0;
		var cards = Game._player_cards[whoTurn];
		for(var i=0;i<cards.length;i++) {
			if(cards[i].value>=IConstants.MAX_CARD_NUM - 2) {
				nums = nums + 1;
			}
		}
		if(nums>=4) {
			return true;
		}
		
		var dcsf = DevidedCardSolutionFactory.getInstance();
		var solutions = new Array();
		var currSolution = null;
		dcsf.getDevidedCardSolution(Game._player_cards[whoTurn], solutions, currSolution);
		var bestSolution = dcsf.getBestDevidedCardSolution(solutions);
		
		if(bestSolution.oneSendCards!=null) {
			for(var i=0;i<bestSolution.oneSendCards.length;i++) {
				//炸弹加2
				var type = CardTypeFactory.getCardType(bestSolution.oneSendCards[i]);
				if(type==CardTypeString.FOUR_CARDTYPE) {
					num = num+2;
				}
				//大三条加1
				if(type==CardTypeString.THREE_CARDTYPE && bestSolution.oneSendCards[i][0].value>=IConstants.MAX_CARD_NUM - 3) {
					num = num+1;
				}
			}			
		}
		if(nums>=4) {
			return true;
		}
		return  false;
	},

	_computeCall:function(whoTurn) {
		var call = this._computeCallValid(whoTurn);
		var cards = Game._player_cards[whoTurn];
		var map = CardUtil.asValueStaticCount(cards);
		var num = 0;
		if(map.get(IConstants.MAX_CARD_NUM)!=null) {
			num = num + 1;
		}
		if(map.get(IConstants.MAX_CARD_NUM - 1)!=null) {
			num = num + 1;
		} 
		if(map.get(IConstants.MAX_CARD_NUM - 2)!=null) {
			num = num + map.get(IConstants.MAX_CARD_NUM - 2);
		}
		if(num>3){
			call = true;
		} else if(map.get(IConstants.MAX_CARD_NUM - 3)!=null && num==3) {
			call = map.get(IConstants.MAX_CARD_NUM - 3) >= 2;
		}
		
		var rob = this._hasOtherCall(whoTurn);

		if(call) {//叫地主,抢地主
			if(rob) {
				musicutil.playEffect("res/audio/CallLandlord_QDZ_M.mp3");
				Game._call_landlord[whoTurn] = 1;
			} else {
				musicutil.playEffect("res/audio/CallLandlord_JDZ_M.mp3");
				Game._call_landlord[whoTurn] = 3;
			}
			Game._landlord = whoTurn;
		} else {//不叫,不抢
			if(rob) {
				musicutil.playEffect("res/audio/CallLandlord_BQDZ_M.mp3");
				Game._call_landlord[whoTurn] = 0;
			} else {
				musicutil.playEffect("res/audio/CallLandlord_BJDZ_M.mp3");
				Game._call_landlord[whoTurn] = 2;
			}
		}

		var call = Game._call_landlord[whoTurn];
		var labelSprite;
		if(call==0) {//不抢
			labelSprite = new cc.Sprite(res.Label_no_rob);
		} else if(call==1) {//抢
			labelSprite = new cc.Sprite(res.Label_rob);
		} else if(call==2) {//不叫
			labelSprite = new cc.Sprite(res.Label_no_call);
		} else if(call==3) {//叫
			labelSprite = new cc.Sprite(res.Label_call);
		}

		this.callLabels[whoTurn] = labelSprite;
		if(whoTurn==0) {
			labelSprite.x = 80;
			labelSprite.y = 10;
		} else if(whoTurn==1) {
			labelSprite.x = 660;
			labelSprite.y = 370;
		} else if(whoTurn==2) {
			labelSprite.x = 140;
			labelSprite.y = 370;
		}
		labelSprite.scale=0.55;
		this.addChild(labelSprite);
	},

	//除了某个人,是否有其他人叫了
	_hasOtherCall: function(exclude) {
		for(var i=0;i<Game._call_landlord.length;i++) {
			if(Game._call_landlord[i]!=null && Game._call_landlord[i]!=0 && Game._call_landlord[i]!=2) {
				return true;
			}
		}
		return false;
	},


	//添加是否叫地主的Label,同时把下个人的清掉
	_afterCall:function(whoTurn, nextWho) {
		if(this.callLabels[nextWho]!=null) {
			this.removeChild(this.callLabels[nextWho]);
			this.callLabels[nextWho] = null;
		}
		if(this.callMenu!=null && whoTurn != 0) {
			this.removeChild(this.callMenu);
			this.callMenu = null;
		}
		
		if(Game._landlord == whoTurn) {
			if(Game._RATE==null) {
				Game._RATE = 3;
			} else {
				Game._RATE = Game._RATE * 2;
			}
			 
			for(var i=0;i<this.rate.length;i++) {
				this.removeChild(this.rate[i]);
			}
			this.rate = new Array();

			var action = cc.scaleTo(1, 0.65);
			var size = cc.director.getWinSize();
			var sprite = new cc.Sprite("res/num/gold_num_mut.png"); 
			sprite.x = size.width / 2 - 40;
			sprite.y = size.height / 2 + 30;
			sprite.scale=0.15;
			this.addChild(sprite);
			this.rate[this.rate.length] = sprite; 
			sprite.runAction(action);

			var action1 = cc.scaleTo(1, 0.65);
			var num = Game._RATE>=10 ? Math.floor(Game._RATE/10) : Game._RATE;
			var sprite1 = new cc.Sprite("res/num/gold_num_" + num + ".png"); 
			sprite1.x = size.width / 2;
			sprite1.y = size.height / 2 + 30;
			sprite1.scale=0.15;
			this.addChild(sprite1);
			this.rate[this.rate.length] = sprite1;
			sprite1.runAction(action1);

			if(Game._RATE>=10) {
				num = Game._RATE%10;
				var action2 = cc.scaleTo(1, 0.65);
				var sprite2 = new cc.Sprite("res/num/gold_num_" + num + ".png"); 
				sprite2.x = size.width / 2 + 39;
				sprite2.y = size.height / 2 + 30;
				sprite2.scale=0.15;
				this.addChild(sprite2);
				this.rate[this.rate.length] = sprite2;
				sprite2.runAction(action2);
			}	
			
			this._doubleRate();
		}
	},

	_doubleRate: function() {
		//添加到上面的toolbar上
		cc.MenuItemFont.setFontName("Times New Roman");                     
		cc.MenuItemFont.setFontSize(43);
		if(this.rateSprite!=null) {
			this.removeChild(this.rateSprite);
		}
		var startButton = new cc.MenuItemFont(Game._RATE, function(){}, this);
		startButton.setColor(cc.color(255, 106, 106));
		startButton.x = 610;
		startButton.y = 520;
		startButton.scale = 0.7;
		this.rateSprite = new cc.Menu(startButton);
		this.rateSprite.x = 0;
		this.rateSprite.y = 0;
		this.rateSprite.scale = 0.6;
		this.addChild(this.rateSprite, 3);
	},
	
	_playerCall: function(){
		var grab = false; //判断是否是抢地主
		for(var i=0;i<Game._call_landlord.length;i++) {
			//只要有一个人叫过地主,我都是抢的啦
			grab = grab || (Game._call_landlord[i]!=0 && Game._call_landlord[i]!=2);
		}

		var size = cc.director.getWinSize();
		var callButton;
		var noCallButton;
		if(grab) {
			callButton = new cc.MenuItemImage(res.Button_rob,res.Button_rob, function a(){
				this._callLandorCallBack(1);
			}, this),
			noCallButton = new cc.MenuItemImage(res.Button_no_rob, res.Button_no_rob, function a() {
				this._noCallLandorCallBack(0);
			}, this);
		} else {
			callButton = new cc.MenuItemImage(res.Button_call, res.Button_call, function a() {
				this._callLandorCallBack(3);
			}, this),
			noCallButton = new cc.MenuItemImage(res.Button_no_call, res.Button_no_call, function a() {
				this._noCallLandorCallBack(2);
			}, this);
		}
		callButton.x = size.width / 2 - 100;
		callButton.y = size.height / 2 - 50;
		noCallButton.x = size.width / 2 + 100;
		noCallButton.y = size.height / 2 - 50;
		this.callMenu = new cc.Menu(callButton, noCallButton);
		this.callMenu.x = 0;
		this.callMenu.y = 0;
		this.callMenu.scale = 0.55;
		this.addChild(this.callMenu);
	},

	_callLandorCallBack: function(type) {
		Game._call_landlord[0] = type;
		if(this.callMenu!=null) {
			this.removeChild(this.callMenu);
			this.callMenu = null;
		}

		var call = Game._call_landlord[0];
		var labelSprite;
		if(call==0) {//不抢
			musicutil.playEffect("res/audio/CallLandlord_BQDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_no_call);
		} else if(call==1) {//抢
			musicutil.playEffect("res/audio/CallLandlord_QDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_call);
		} else if(call==2) {//不叫
			musicutil.playEffect("res/audio/CallLandlord_BJDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_no_rob);
		} else if(call==3) {//叫
			musicutil.playEffect("res/audio/CallLandlord_JDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_rob);
		}


		this.callLabels[0] = labelSprite;
		labelSprite.x = 140;
		labelSprite.y = 220;
		labelSprite.scale=0.55;
		this.addChild(labelSprite);

		if(!this._chooseEnd(0)) {
			if(this.callLabels[1]!=null) { 
				this.removeChild(this.callLabels[1]);
				this.callLabels[1] = null;
			}
		}
		Game._landlord=0;
		this.nextplayer=true;
		
		this._afterCall(0, 1);
	},

	_noCallLandorCallBack: function(type) {
		Game._call_landlord[0] = type;
		if(this.callMenu!=null) {
			this.removeChild(this.callMenu);
			this.callMenu = null;
		}

		var call = Game._call_landlord[0];
		var labelSprite;
		if(call==0) {//不抢
			musicutil.playEffect("res/audio/CallLandlord_BQDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_no_rob);
		} else if(call==1) {//抢
			musicutil.playEffect("res/audio/CallLandlord_QDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_rob);
		} else if(call==2) {//不叫
			musicutil.playEffect("res/audio/CallLandlord_BJDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_no_call);
		} else if(call==3) {//叫
			musicutil.playEffect("res/audio/CallLandlord_JDZ_M.mp3");
			labelSprite = new cc.Sprite(res.Label_call);
		}

		this.callLabels[0] = labelSprite;
		labelSprite.x = 140;
		labelSprite.y = 220;
		labelSprite.scale=0.55;
		this.addChild(labelSprite);

		if(!this._chooseEnd(0)) {
			if(this.callLabels[1]!=null) {
				this.removeChild(this.callLabels[1]);
				this.callLabels[1] = null;
			}
		}
		this.nextplayer=true;
		
		this._afterCall(0, 1);
	},

	//等待玩家来喊地主
//	_waitingPlayerCall: function() {
//		if(Game._call_landlord[0]!=null) {
//			this.unschedule(this._waitingPlayerCall);
//		}
//	},

	//判断选地主是否结束Bigger
	_chooseEnd: function(whoTurn) {
		if(Game._call_times>=4) {
			return true;
		}
		if(Game._call_times==3) {
			//第1次没有叫地主
			if(Game._call_landlord[whoTurn]==0 || Game._call_landlord[whoTurn]==2) {
				return true;
			}
			//第1次叫地主了.如果其他2个玩家都没有叫地主,那么我就是地主,可以结束了;否则我就要在抢一次
			for(var i=0;i<Game._call_landlord.length;i++) {
				if(whoTurn!=i && Game._call_landlord[i]!=0 && Game._call_landlord[i]!=2) {
					return false;
				}
			}
			return true;
		}
		return false;
	},

	_insertBottomCardBack:function() {
		var fromX = 375;
		for(var i=0;i<3;i++) {
			var card = new cc.Sprite(res.Card_back_png);
			card.x = fromX;
			card.y = 415;
			card.scale = 0.15;
			this.addChild(card);
			fromX += Game._card_bottom_distance;
			Game._bottom_cards_back[i] = card;
		}
	},

	_insertBottomCard: function() {
		var fromX = 375;
		var bottomCards = new Array();
		for(var i=0;i<Game._bottom_cards.length;i++) {
			var card = Game._bottom_cards[i];
			var cardSprite = new cc.Sprite("res/card/" + card.value + "-" + card.clr + ".gif");
			cardSprite.x = fromX;
			cardSprite.y = 415;
			cardSprite.scale = 0.205;
			this.addChild(cardSprite);
			fromX += Game._card_bottom_distance;
			bottomCards[bottomCards.length] = cardSprite;
		}
		Game._bottom_cards=bottomCards;
	},

	_insertSprite: function() {
		//插入屏幕中
		var size = cc.director.getWinSize();
		var myCards = Game._player_cards[0];
		var fromX = size.width/2 - Game._player_cards[0].length / 2 * Game._card_offset - Game._card_offset;
		var centY = 44;
		for(var i=0;i<Game._player_cards[0].length;i++) {
			Game._player_cards[0][i].x = fromX;
			Game._player_cards[0][i].y = centY;
			Game._player_cards[0][i].anchorX=0;
			Game._player_cards[0][i].anchorY=0;
			this.addChild(Game._player_cards[0][i]);
			fromX += Game._card_offset;
		}
	},

	_insertBottomCard2Player: function() {
		//插入屏幕中
		var size = cc.director.getWinSize();
		var myCards = Game._player_cards[0];
		var fromX = size.width/2 - Game._player_cards[0].length / 2 * Game._card_offset - Game._card_offset;
		var centY = 44;
		var bc = Game._bottom_cards;

		for(var i=0;i<Game._player_cards[0].length;i++) {
			var isBottom = false;
			for(var j=0;j<bc.length;j++) {
				if(Game._player_cards[0][i].value == bc[j].value && Game._player_cards[0][i].clr == bc[j].clr) {
					isBottom = true;
					break;
				}
			}
			var card = Game._player_cards[0][i];
			card.x = fromX;
			Game._player_cards[0][i].x = fromX;
			Game._player_cards[0][i].y = centY;
			Game._player_cards[0][i].anchorX=0;
			Game._player_cards[0][i].anchorY=0;
			if(isBottom) {
				Game._player_cards[0][i].y = centY + Game._card_up_distance;
				var action = cc.moveTo(2, cc.p(fromX, centY));
				Game._player_cards[0][i].runAction(action);
			}
			this.addChild(Game._player_cards[0][i]);
			fromX += Game._card_offset;
		}
	},

	_resetPlayerCardPosition: function() {
		var size = cc.director.getWinSize();
		var myCards = Game._player_cards[0];
		var fromX = size.width/2 - Game._player_cards[0].length / 2 * Game._card_offset - Game._card_offset;
		var centY = 44;
		var bc = Game._bottom_cards;

		for(var i=0;i<Game._player_cards[0].length;i++) {
			var card = Game._player_cards[0][i];
			card.x = fromX;
			card.y = centY;
			card.anchorX=0;
			card.anchorY=0;
			fromX += Game._card_offset;
		}
	},

	//随机一桌牌
	_initCards: function() {
		var cards = new Array();
		for(var i=3;i<=15;i++) {
			for(var j=1;j<=4;j++) {
				var card = new BashaoCard(i, j, false, true);
				cards[cards.length] = card;
			}
		}
		//大小王
		cards[cards.length] = new BashaoCard(16, 5, false, true);
		cards[cards.length] = new BashaoCard(17, 5, false, true);
		return cards;
	}
});

var card = cc.Sprite.extend({
	clicked:null,
	value:null,
	colr:null,

	ctor: function(value, colr) {
		this._super("res/card/" + value + "-" + colr + ".gif");
		this.scale = 0.5;
		this.value = value;
		this.colr = colr;
	}
});

var loadingLayer = cc.Layer.extend({
	scene:null,
	
	ctor: function(scene) {
		this._super();
		this.scene = scene;
		
		var sprite = new cc.Scale9Sprite(res.Loading_img);
		var icon = new cc.Scale9Sprite(res.Icon_img);
		icon.x = 30;
		icon.y = 50;
		icon.anchorX=0;
		icon.anchorY=0;
		sprite.x = 0;
		sprite.y = 0; 
		sprite.anchorX=0;
		sprite.anchorY=0;
		sprite.scale = 0.77;
		this.addChild(sprite);
		this.addChild(icon);
		
		cc.MenuItemFont.setFontName("Times New Roman");                     
		cc.MenuItemFont.setFontSize(43);
		
		//开始游戏
		var start = new cc.Sprite(res.Button_bg);
		start.x = 620;
//		start.y = 320;
		start.y = 240;
		start.scale = 0.7;
		this.addChild(start);
		var startButton = new cc.MenuItemFont("开始游戏", function(){
			this.scene.removeChild(this, true);
			this.scene.addBackgroundLayer();
			this.scene.addCardLayer();
			musicutil.changeStatus();
		}, this);
		startButton.setColor(cc.color(22,100,255));
		startButton.x = 760;
//		startButton.y = 390;
		startButton.y = 255;
		var startMenu = new cc.Menu(startButton);
		startMenu.x = 0;
		startMenu.y = 0;
		startMenu.scale = 0.6;
		this.addChild(startMenu);
		
		//游戏设置
//		var setting = new cc.Sprite(res.Button_bg);
//		setting.x = 620;
//		setting.y = 240;
//		setting.scale = 0.7;
//		this.addChild(setting);
//		var setButton = new cc.MenuItemFont("游戏设置", function(){
//			this.set = new setLayer(scene); 
//			this.scene.addChild(this.set);
//		}, this);
//		setButton.setColor(cc.color(22,100,255));
//		setButton.x = 760;
//		setButton.y = 255;
//		var setMenu = new cc.Menu(setButton);
//		setMenu.x = 0;
//		setMenu.y = 0;
//		setMenu.scale = 0.6;
//		this.addChild(setMenu);
		
		//游戏说明
		var rule = new cc.Sprite(res.Button_bg);
		rule.x = 620;
		rule.y = 160;
		rule.scale = 0.7;
		this.addChild(rule);
		var ruleButton = new cc.MenuItemFont("游戏规则", function(){
			this.rule = new ruleLayer(scene); 
			this.scene.addChild(this.rule);
		}, this);
		ruleButton.setColor(cc.color(22,100,255));
		ruleButton.x = 760;
		ruleButton.y = 120;
		var ruleMenu = new cc.Menu(ruleButton);
		ruleMenu.x = 0;
		ruleMenu.y = 0;
		ruleMenu.scale = 0.6;
		this.addChild(ruleMenu);
		
		//退出游戏
		var exit = new cc.Sprite(res.Button_bg);
		exit.x = 620;
		exit.y = 80;
		exit.scale = 0.7;
		this.addChild(exit);
		var readyButton = new cc.MenuItemFont("退出游戏", function(){
			cc.director.popScene();
		}, this);
		readyButton.setColor(cc.color(22,100,255));
		readyButton.x = 760;
		readyButton.y = -10;
		var exitMenu = new cc.Menu(readyButton);
		exitMenu.x = 0;
		exitMenu.y = 0;
		exitMenu.scale = 0.6;
		this.addChild(exitMenu);
		
		//剩余金币
		var goldBg = new cc.Sprite(res.Gold_bg);
		goldBg.x = 80;
		goldBg.y = 20;
		goldBg.scale = 0.8;
		this.addChild(goldBg);
		var goldSprite = new cc.Scale9Sprite(res.Gold_icon);
		goldSprite.x = 20;
		goldSprite.y = 20;
		goldSprite.scale = 0.2;
		this.addChild(goldSprite);
		
		var left = cc.sys.localStorage.getItem("score");
		if(left=="") {
			cc.sys.localStorage.setItem("score",8888);
		}
		
		var scoreStr = cc.sys.localStorage.getItem("score")
		var score = parseInt(scoreStr);
		
		var nums = new Array();
		while(score>0) {
			var num = score % 10;
			nums[nums.length] = num;
			score = Math.floor(score / 10);
		}
		var x = 30;
		var y = 19;
		for(var i=nums.length-1;i>=0;i--) {
			var num = nums[i];
			var sprite1 = new cc.Sprite("res/num/gold_num_" + num + ".png");
			sprite1.x = x + 17;
			sprite1.y = y;
			sprite1.scale=0.25;
			this.addChild(sprite1);
			x = x + 17;
		}
		
		return true;
	},
});

var HelloWorldScene = cc.Scene.extend({
//	loading:null,
//	background:null,
//	cardLayer:null,
//	ruleLayer: null,
	
	onEnter:function () {
		this._super();
		
		var loading = new loadingLayer(this);
		this.addChild(loading);
	},
	
	addBackgroundLayer:function() {
		this.background = new backgroundLayer(this);
		this.addChild(this.background);
	},
	
	addCardLayer:function() {
		this.cardLayer = new cardLayer(this);
		this.addChild(this.cardLayer);
	},
	
	addRuleLayer:function() {
//		this.addChild(this.ruleLayer);
	},
	
	addLoadingLayer:function() {
//		this.addChild(this.loading);
	},
	
	restart:function() {
		this.loading = new loadingLayer(this);
		this.addChild(this.loading);
		
		this.removeChild(this.background);
		this.removeChild(this.cardLayer);
		musicutil.close();
	}
});


