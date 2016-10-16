function ArrayUtil(){}

ArrayUtil.exclude=function(arr, excludes) {
	var tmp = new Array();
	for(var i=0;i<arr.length;i++) {
		var has = false;
		for(var j=0;j<excludes.length;j++) {
			if(arr[i]==excludes[j]) {
				has = true;
			}
		}
		if(!has) {
			tmp[tmp.length] = arr[i];
		}
	}
	return tmp;
}