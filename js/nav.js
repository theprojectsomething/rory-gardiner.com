(function(){
	var picker = {};

	function init(){
		if(window.addEventListener && !isMobile){
			window.staticScroll = new iScroll('static');
			window.infoScroll = new iScroll('info');
		}else{
			window.staticScroll = window.infoScroll = false;
		}
		picker.length = $('#nav .picker li').length;

		$('#nav .picker li').click(function(){
			if($(this).hasClass('active')) setNav($(this).index() + picker.init);
		});

		$('#nav .picker aside span').click(function(){
			var n, b = $(this).hasClass('next');
			if(page=='journal'){
				if(b){
					n = picker.init + picker.length;
				}else{
					n = picker.init - picker.length;
				}
				if(n>=0 && n<picker.list.length) showNav(picker.list, n);
				//console.log(picker)
				//showNav(picker.list, picker.init + picker.length);

			}else nextImage(b);
		});
		$(window).keydown(function(e){
			if(e.which>=37 && e.which<=40){
				if(e.which<=38 && window.control.image.current>0){
					window.control.image.scrollTo(control.image.current - 1, 0, true, true);
				}else if(e.which>=39 && window.control.image.current<$('.content .hero').length - 1){
					window.control.image.scrollTo(window.control.image.current + 1, 0, true, true);
				}
				return false;
			}
		});
		$('.hero').live('click', function(){
			if(url=='journal' && $('.hero').index(this)<control.image.current) window.control.image.scrollTo(window.control.image.current - 1, 0, true, true);
			else if(window.control.image.current<$('.content .hero').length - 1 && (!isMobile || page!='work')) window.control.image.scrollTo(window.control.image.current + 1, 0, true, true);
		});
	}

	function nextImage(b){
		if($('#nav .picker').css('display')=='block'){
			var n;
			if(b){
				n = picker.current + 1;
			}else{
				n = picker.current - 1;
			}
			if(n<picker.list.length && n>=0){
				picker.current = n;
				//if(n==picker.init + picker.length) showNav(picker.list, n, 0);
				//else if(n==picker.init - 1) showNav(picker.list, picker.init - picker.length, picker.length - 1);
				//else
				setNav(n);
			}
		}
	}

	function setNav(i){
		if(i==null){
			i = $('.content .hero').index($('.content .hero.current'));
		}else{
			window.autoScroll = false;
			window.control.image.scrollTo(i, 0);
		}
		picker.current = i;
		if(i>=picker.init + picker.length || i<picker.init) showNav(picker.list, (i/picker.length|0)*picker.length);
		//else if(i==picker.init - 1) showNav(picker.list, picker.init - picker.length);
		$('#nav .picker .current').removeClass('current');
		//$('#nav .picker li:eq(' + (i % picker.length) + ')').addClass('current');
		$('#nav .picker li:eq(' + (i - picker.init) + ')').addClass('current');
	}

	function showStatic(){
		$('#static').attr('class', '').find('.active').removeClass('active');
		if(isStatic()){
			var style = {top: isMobile && url=='work' ? -dimensions.base.height : $('#nav .main .' + page).position().top};
			style['max-height'] = page!='contact' ? $(window).height() - style.top - 2*dimensions.margin.bottom : '';
			$('#static').css(style);
			if(staticScroll){
				setTimeout(function(){
					staticScroll.refresh();
				}, 0);
			}
			$('#static').addClass(page).find('.' + page).addClass('active');
		}
	}

	function showInfo(){
		if(infoScroll){
			setTimeout(function(){
				infoScroll.refresh();
			}, 0);
		}
	}

	function isStatic(p){
		if(!p) p = page;
		return data.pages.hasOwnProperty(p) ? data.pages[p].type=='static' : false;
	}

	function showNav(list, init, selected){
		picker.list = list;
		picker.init = init = init || 0;
		$('#nav .picker .active').removeClass('active');
		$('#nav .picker .current').removeClass('current');
		$('#nav .picker').css('display', list ? 'block' : 'none');
		$('#nav .picker li').each(function(i){
			//var _this = this;
			var s = '';
			if(list){
				s = ('0' + (init + i + 1)).slice(-2);
				if(init + i<list.length){
					$(this).addClass('active');
				}

				if(selected!=undefined){
					if(i==selected) setNav(i);
				}else{
					if(i==picker.current - picker.init) $(this).addClass('current');
				}
			}
			//setTimeout(function(){
			//	$(_this).addClass('closed');
			//}, (i%5 + (i - i%5)/5)*50);
			//setTimeout(function(){

				//if(i==selected) setNav(i);
				$(this).text(s).removeClass('closed');
			//}, (i%5 + (i - i%5)/5)*50 + 250);
		});
	}

	window.control.nav = {
		init: init,
		set: setNav,
		show: showNav,
		showStatic: showStatic,
		showInfo: showInfo,
		isStatic: isStatic
	}
})();