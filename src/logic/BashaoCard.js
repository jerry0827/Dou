var BashaoCard = cc.Sprite.extend({
	value:0,
	clr:1,
	clicked:false,
	canClick:true,

	ctor: function(value, clr, clicked, canClick) {
		this._super("res/card/" + value + "-" + clr + ".gif");
		this.value = value;
		this.clr = clr;
		this.clicked=clicked;
		this.canClick=canClick;
		this.scale = 0.58;
		this.retain();
	},

	//返回boolean，是否相等
	isEqual: function(bc) {
		if (this.value == bc.value && this.clr == bc.clr) {
			return true;
		} else {
			return false;
		}
	},

	setCanClick: function(canClick) {
		this.canClick = canClick;
	},

	getValue: function() {
		return this.value;
	},
	setValue: function(value) {
		this.value = value;
	},
	getClr: function() {
		return this.clr;
	},
	setClr: function(clr) {
		this.clr = clr;
	},
	isClicked: function() {
		return this.clicked;
	},
	setClicked: function(clicked) {
		this.clicked = clicked;
	},


	compareTo: function(c2) {
		if(this.getValue()>c2.getValue()){
			return 1;
		}else if(this.getValue()<c2.getValue()){
			return -1;
		}else{
			return this.getClr() - c2.getClr();
		}
	},

});





//function BashaoCard(value, clr, clicked, canClick) {
//	this.value = value;
//	this.clr = clr;
//	this.clicked = clicked;
//	this.canClick = canClick;
//
//	//返回boolean，是否相等
//	this.isEqual = function(bc){
//		if(this.value==bc.value && this.clr==bc.clr){
//			return true;
//		}else{
//			return false;
//		}
//	}
//
//	this.setCanClick = function(canClick) {
//		this.canClick = canClick;
//	}
//
//	this.getValue = function() {
//		return this.value;
//	}
//	this.setValue = function(value) {
//		this.value = value;
//	}
//	this.getClr = function() {
//		return this.clr;
//	}
//	this.setClr = function(clr) {
//		this.clr = clr;
//	}
//	this.isClicked = function() {
//		return this.clicked;
//	}
//	this.setClicked = function(clicked) {
//		this.clicked = clicked;
//	}
//
//
//	this.compareTo = function(c2) {
//		if(this.getValue()>c2.getValue()){
//			return 1;
//		}else if(this.getValue()<c2.getValue()){
//			return -1;
//		}else{
//			return this.getClr() - c2.getClr();
//		}
//	}
//}


	