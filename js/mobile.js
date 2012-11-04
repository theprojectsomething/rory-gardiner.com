(function(){
	function initMobile(){
		if(page=='work' || page=='contact') resetMobile(true);

		/*$('#work .hero').click(function(){
			mobileSwipe.next();
		});*/
	}

	function resetMobile(b){
		window.mobileSwipe = null;
		if(b){
			$('.pages').empty().append('<li id="mobile-index"></li>');
			window.mobileSwipe = new Swipe($('.content')[0], {callback: onSwipe});
			onSwipe();
		}
	}

	function onSwipe(){
		$('#mobile-index').text((window.mobileSwipe.getPos() + 1) + '|' + data.pages['work'].content.length);
	}

	window.control.mobile = {
		init: initMobile,
		reset: resetMobile
	}
})();