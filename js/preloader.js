function Preloader(){
	var preload;
	var loading;
	var manifest = {};

	function init(){
		preload = new PreloadJS();
		preload.onFileLoad = fileComplete;
		preload.onFileProgress = fileProgress;
		preload.onError = fileError;
	}

	this.load = function(src, onComplete, onError, onProgress){
		if(!manifest[src]) manifest[src] = {progress: 0, error: false, onProgress: [], onComplete: [], onError: []};
		if(manifest[src].progress===1){
			if(onComplete) onComplete();
		}else if(manifest[src].error){
			if(onError) onError();
		}else{
			if(onComplete) manifest[src].onComplete.push(onComplete);
			if(onProgress) manifest[src].onProgress.push(onProgress);
			if(onError) manifest[src].onError.push(onError);
			try{
				preload.loadFile(src, true);
			}catch(e){
				if(onError) onError();
			}
		}
	}

	this.image = function(src){
		return manifest[src] ? manifest[src].image || 0 : 0;
	}

	this.progress = function(src){
		return manifest[src] ? manifest[src].progress : 0;
	}

	this.clear = function(){
		preload.close();
		for(var i in manifest){
			clearItem(i);
		}
		init();
	}

	function fileComplete(e){
		manifest[e.id].progress = 1;
		manifest[e.id].image = e.result;
		process(manifest[e.id].onComplete);
		clearItem(e.id);
	}

	function fileProgress(e){
		if(e.progress<1){
			manifest[e.id].progress = e.progress;
			process(manifest[e.id].onProgress);
		}
	}

	function fileError(e){
		manifest[e.id].error = true;
		process(manifest[e.id].onError);
		clearItem(e.id);
	}

	function clearItem(item){
		manifest[item].onComplete.length = manifest[item].onProgress.length = manifest[item].onError.length = 0;
	} 

	function process(list){
		for(var i=0;i<list.length;i++){
			list[i]();
		}
	}

	init();
	this.preloader = preload;
}