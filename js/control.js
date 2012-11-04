(function(){
	window.control = {};
	window.mouse = {};
	
	$(window).resize(function(){
		window.control.image.refresh();
		window.control.nav.showStatic();
	}).scroll(function(e){
		window.control.image.setScroll();
	}).ready(function(){
		$('body').removeClass('init');
		window.control.nav.init();
		window.control.image.init();
		window.control.location.init();
		if(isMobile) window.control.mobile.init();
	}).mousemove(function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	}).hover(function(){
		mouse.inside = true;
	}, function(){
		mouse.inside = false;
	}).mousedown(function(){
		mouse.down = true;
	}).mouseup(function(){
		mouse.down = false;
	});
})();