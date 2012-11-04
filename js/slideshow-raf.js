(function(){
	/* 
		list [array]: dom elements to fade between
		delay [number]: time between fades in seconds
		duration [number]: duration of fade in seconds
		start [boolean]: start immediately 
	*/
	window.Slideshow = function(list, delay, duration, start){
		var current = {
			alpha: 0,
			time: 0
		};
		if(list) current.index = list.length==2 ? 0 : false;
		var active = false;
		var t_increment;
		var o_increment;

		this.delay = function(time){
			if(time){
				delay = time;
				t_increment = 1/(60*time);
			}else{
				return delay; 
			}
		}

		this.duration = function(time){
			if(time){
				duration = time;
				o_increment = 1/(60*time);
			}else{
				return duration;
			}
		}

		this.start = function(reset){
			if(current.index!==false){
				active = true;
				if(!current.element){
					current.element = $(list).eq(current.index).css('opacity', 1);
					current.element.siblings().hide();
				}
				current.alpha = current.element.css('opacity');
				if(reset) current.time = 0;
				animAlpha();
			}
		}

		this.stop = function(){
			active = false;
		}

		function next(){
			if(current.prev) current.prev.hide();
			current.prev = current.element;
			current.index = (current.index + 1) % list.length;
			current.element = $(list).eq(current.index).css('opacity', 0).show();
			animAlpha();
		}

		function animAlpha(){
			if(active){
				current.alpha += o_increment;
				setAlpha();
				if(current.alpha>=1){
					current.time = 0;
					animTime();
				}else window.requestAnimationFrame(animAlpha);
			}
		}

		function animTime(){
			if(active){
				current.time += t_increment;
				if(current.time>=1){
					current.alpha = 0;
					next();
				}else window.requestAnimationFrame(animTime);
			}
		}

		function setAlpha(){
			current.alpha = Math.min(1, current.alpha);
			if(current.prev){
				current.prev.css('opacity', 1 - current.alpha);
			}
			current.element.css('opacity', current.alpha);
		}

		this.duration(duration ? duration : 1);
		this.delay(delay ? delay : 1);

		if(start) this.start();
	}
})();

(function(){
	/* http://paulirish.com/2011/requestanimationframe-for-smart-animating/ */
	var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();