(function(){
	var preloader;
	$(window).ready(function(){
		list = [];
		$('img').each(function(i){
			list.push(this);
		});

		preloader = new Preloader();
		
		for(var i=0;i<list.length;i++){
			processImage(list[i]);
		}
	});

	function processImage(element){
		var url = $(element).attr('data-src');
		preloader.load(url, onComplete, onProgress, onError);

		function onComplete(){
			console.log("complete:", element);
		}

		function onProgress(){
			
		}

		function onError(){
			console.log("error:", $('img').index(element));
		}
	}

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

		this.load = function(src, onComplete, onProgress, onError){
			if(!manifest[src]) manifest[src] = {progress: 0, error: false, onProgress: [], onComplete: [], onError: []};
			if(manifest[src].progress===1){
				if(onComplete) onComplete();
			}else if(manifest[src].error){
				if(onError) onError();
			}else{
				if(onComplete) manifest[src].onComplete.push(onComplete);
				if(onProgress) manifest[src].onProgress.push(onProgress);
				if(onError) manifest[src].onError.push(onError);
				preload.loadFile(src);
			}
		}

		this.image = function(src){
			return manifest[src] ? manifest[src].image || 0 : 0;
		}

		this.progress = function(src){
			return manifest[src] ? manifest[src].progress : 0;
		}

		function clear(){
			preload.close();
			for(var i in manifest){
				clearItem(i);
			}
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
	}
})();