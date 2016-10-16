function musicutil(){}
musicutil.open=false;

musicutil.playBackMusic=function() {
	cc.audioEngine.playMusic("res/audio/Audio_after_bomb.ogg", true);
}

musicutil.close = function() {
	musicutil.open=false;
	musicutil.stopBackMusic();
	musicutil.setmusicvolumn(0);
}

musicutil.changeStatus=function() {
	if(musicutil.open) {
		musicutil.open=false;
		musicutil.stopBackMusic();
		musicutil.setmusicvolumn(0);
	} else {
		musicutil.open=true;
		musicutil.playBackMusic();
		musicutil.setmusicvolumn(1);
	}
}

musicutil.stopBackMusic=function() {
	cc.audioEngine.stopMusic();
}

musicutil.playEffect=function(url) {
	cc.audioEngine.playEffect(url, false);
}

musicutil.setmusicvolumn=function(num) {
	cc.audioEngine.setMusicVolume(num * 0.4);
}

musicutil.seteffectvolumn=function(num) {
	cc.audioEngine.setEffectsVolume(num);
}