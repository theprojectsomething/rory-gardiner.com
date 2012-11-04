(function(){
	/*var preloader;

	$(window).ready(function(){
		preloader = new Preloader();
		init();
	});

	function init(){
		list = [];
		$('img[data-src]').each(function(i){
			//list.push(this);
		});

		preloader = new Preloader();
		
		for(var i=0;i<list.length;i++){
			processImage(list[i], i*1000);
		}

		$('.hero').hover(function(){
			slideshow.pause(this);
		}, function(){
			slideshow.play(this);
		});
	}

	function processImage(element, delay){
		var src = $(element).attr('data-src');
		var image;
		var loader;
		var hide = $(element).index();
		var parent = $(element).parent();
		var p = 0;
		var bg = false;
		var init;
		if($(element).siblings('.loader').length){
			loader = $(element).siblings('.loader')[0];
		}else{
			loader = $('<aside class="loader"><span></span></aside>')[0];
			parent.prepend(loader);
			parent.transition({'background': '#ecedee', 'delay': 1}, 200);
		}
		preloader.load(src, onComplete, onError, onProgress);
		init = Date.now();
		
		function onComplete(img){
			image = img ? img : (preloader.image(src).parentNode ? $('<img src="' + src + '" />')[0] : preloader.image(src));
			$(element).remove();
			parent.append($(image).css({'opacity': 0, 'display': 'block'}));
			if(p>0){
				onProgress();
				$(loader).fadeOut(1000);
			}
			init = Date.now() - init;
			setTimeout(function(){
				if(!hide) parent.css('background', '');
				slideshow.add(image);
			}, (init < delay && !hide) ? delay - init : 0);
		}

		function onProgress(){
			if(Date.now() - init > 500){
				p = Math.round(preloader.progress(src)*100);
				$(loader).children('span').transition({'width': p + '%', 'ease': 'ease-out'}, 500);
			}
		}

		function onError(){
			var img = $('<img src="' + src + '" />');
			img.load(function(){
				onComplete(img[0]);
			}).error(function(){
				$(element).remove();
				parent.append('<span class="error">error loading image</span>');
				if(!hide) parent.transition({'background': '#ecedee'}, 200);
			});
		}
	}

	function slideshowImage(){

	}*/
	
})();