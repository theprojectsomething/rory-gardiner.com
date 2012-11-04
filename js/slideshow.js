(function(){
	/* 
		list [array]: dom elements to fade between
		delay [number]: time between fades in milliseconds
		fade [number]: duration of fade in milliseconds
		start [boolean]: start immediately 
	*/
	window.Slideshow = function(list, delay, fade, start){
		var current = {};
		var active = false;
		var animating = false;
		var timer;
		var _this = this;
		if(list) current.index = list.length>=2 ? 0 : false;
		
		this.stopped = function(){
			return !active;
		}

		this.delay = function(time){
			if(time)
				delay = Number(time) || 1000;
			else
				return delay; 
		}

		this.fade = function(time){
			if(time)
				fade = Number(time) || 1000;
			else
				return fade;
		}

		this.start = function(reset){
			if(current.index!==false && !active){
				_this.reset();
				active = true;
				_delay();
			}
		}

		this.reset = function(){
			if(!current.element) current.element = $(list).eq(current.index);
			current.element.stop(true).siblings().stop(true);
			if(animating) _this.stop();
			
		}

		this.stop = function(){
			animating = false;
			active = false;
			clearTimeout(timer);
		}

		function _next(){
			_this.reset();
			current.prev = current.element;
			current.index = (current.index + 1) % list.length;
			current.element = $(list).eq(current.index);
			_animate();
		}

		function _animate(){
			if(active){
				animating = true;
				current.prev.animate({opacity: 0}, fade);
				current.element.css({display: 'block', opacity: 0}).animate({opacity: 1}, fade, function(){
					console.log('done!')
					animating = false;
					_delay();
				});
			}
		}

		function _delay(force){
			if(active){
				timer = setTimeout(function(){
					if(active) _next();
				}, delay);
			}
		}

		this.delay(delay);
		this.fade(fade);
		
		if(start) this.start();
	}
})();