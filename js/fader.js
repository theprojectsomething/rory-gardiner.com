(function(){
	function Slideshow(delay, fade){
		var _this = this;

		this.add = function(img, skipFade){
			if(!$(img).siblings('img').length && skipFade){
				$(img).css('opacity', 1);
			}else if(!$(img).siblings('.showing').length){
				this.show(img);
			}
		}

		this.show = function(img){
			$(img).addClass('showing').transition({'opacity': 1}, fade, function(){
				setTimeout(function(){
					if($(img).hasClass('showing')) _this.next(img.parentNode);
				}, delay*1000);
			});
		}

		this.next = function(parent){
			var list = $(parent).children('img');
			if(list.length>1){
				var n = $(parent).children('.showing').index() % list.length;
				$(parent).children('.showing').transition({'opacity': 0}, fade).removeClass('showing');
				if($(parent).children('[src]').length>1) _this.show(list[n]);
			}
		}

		this.pause = function(parent){
			if($(parent).children('img').length>1) $(parent).children('.showing').removeClass('showing').addClass('paused');
		}

		this.play = function(parent){
			var paused = $(parent).children('.paused');
			if(paused && $(parent).children('img').length>1){
				paused.removeClass('paused');
				_this.show(paused[0]);
			}
		}
	}

	window.slideshow = new Slideshow(3, 1);
})();