//存放游戏的全局数据

//function CardTypeFactory() {}
//CardTypeFactory.cardTypeStrings=new Array(CardTypeString.SINGLE_CARDTYPE);

function Game() {}

Game.reset = function() {
    Game._player_cards.length = 0;
    Game._bottom_cards.length = 0;
    Game._bottom_cards_back.length = 0;

    Game._landlord = null;
    Game._call_landlord.length=0;
    Game._call_times=0;

    Game._player_cards[0] = new Array();
    Game._player_cards[1] = new Array();
    Game._player_cards[2] = new Array();
    
    Game._who_turn = null;
    Game._pre_one_sendcard = null;
    Game._RATE = null;
}

//存放玩家手里剩余的牌
Game._player_cards = new Array();
//底牌
Game._bottom_cards = new Array();
//底牌的背面,还没确定地主呢,选完地主后,需要detach的
Game._bottom_cards_back = new Array();

//叫地主过程中的顺序
Game._landlord = null;
//存放数字标识每个玩家是否叫地主了,0不叫,1叫地主,2不抢地主,3抢地主
Game._call_landlord = new Array();
//一共叫了几次了
Game._call_times = 0;
//轮到谁出牌了
Game._who_turn = null;
Game._pre_one_sendcard = null;

//底牌之间的间距
Game._card_bottom_distance = 30;
//玩家2张牌之间的距离
Game._card_offset = 32;
//点击后,牌上移的距离
Game._card_up_distance = 20;
//出的牌,2张之间的距离
Game._card_offset_discard = 15;


//倍数
Game._RATE = null;
//底分
Game.SCORE = 2;