(function(){
	var preloader;
	window.autoScroll = true;
	window.dimensions = {
		max: {
			base: {
				width: 0, 
				height: 800
			}
		},
		base: {
			ratio: {
				width: 6, 
				height: 4.5
			},
			full: {}, margin: {}
		},
		min: {}, nav: {}
	};

	function init(){
		preloader = new Preloader();
		resetDimensions();		
		for(var i in data.pages){
			if(data.pages[i].width || data.pages[i].height) dimensions.max[i] = {width: data.pages[i].width||0, height: data.pages[i].height||0};
		}
		dimensions.min.width = _p($('body').css('min-width'));
		dimensions.min.scale = dimensions.min.width/dimensions.base.ratio.width;
		setRatio(0);
	}

	function resetDimensions(){
		$('.content').css('margin', '');
		dimensions.margin = {
			top: _p($('.content').css('margin-top')),
			right: _p($('.content').css('margin-right')),
			bottom: _p($('.content').css('margin-bottom')),
			left: _p($('.content').css('margin-left'))
		};
		$('.content').css('margin-right', 0);
	}

	function setRatio(time){
		if(isMobile) resetDimensions();
		if(!time) $('html').click();
		var w = $(window).width() - dimensions.margin.left - dimensions.margin.right;
		var h = $(window).height() - dimensions.margin.top - dimensions.margin.bottom;
		dimensions.max.base.scale = Math.round(Math.max(dimensions.min.scale, Math.min(_b(w, 'width', 'base')/dimensions.base.ratio.width, _b(h, 'height', 'base')/dimensions.base.ratio.height)));
		dimensions.base.scale = Math.round(Math.max(dimensions.min.scale, Math.min(_b(w, 'width')/dimensions.base.ratio.width, _b(h, 'height')/dimensions.base.ratio.height)));
		dimensions.base.width = dimensions.base.ratio.width*dimensions.base.scale;
		dimensions.base.height = dimensions.base.ratio.height*dimensions.base.scale;
		dimensions.base.full.width = dimensions.base.ratio.width*dimensions.max.base.scale;
		dimensions.base.full.height = dimensions.base.ratio.height*dimensions.max.base.scale;
		dimensions.base.bottom =  Math.max(0, h - dimensions.base.height);
		dimensions.nav.height = Math.min(h, dimensions.base.full.height);
		if(type=='list'){
			dimensions.base.width *= 0.4;
			dimensions.base.height = dimensions.base.width*0.8;
		}
		dimensions.base.margin.bottom = dimensions.margin.bottom + (type=='list' || dimensions.base.bottom==0 || data.pages[page].paging ? 0 : dimensions.base.bottom);


		if(dimensions.max[page] ? dimensions.max[page].width : false){
			var nh = 0, id;
			var ml = $('.hero').length;
			var mw = Math.max(dimensions.min.width, _b(w, 'width'));
			dimensions.base.full.width = Math.max(dimensions.base.full.width, mw);
			var mr;// = mw/dimensions.max[page].width;
			$('.hero').css({width: mw}).each(function(i){
				id = data.pages[page].content[i].id;//$(this).children('img').data('id');
				mr = Math.min(1, mw/data.images[id].width);//mw/dimensions.max[page].width;
				data.pages[page].content[i].height = data.images[id].height*mr;
				data.pages[page].content[i].y = nh;
				$(this).css({'height': data.pages[page].content[i].height});
				if(i==ml - 1) dimensions.base.bottom = $(window).height() - data.pages[page].content[i].height - 2*dimensions.base.margin.bottom;//dimensions.margin.bottom;//dimensions.margin.bottom;
				nh += data.pages[page].content[i].height + dimensions.base.margin.bottom;
			});
		}else $('.hero').css({'height': dimensions.base.height, width: dimensions.base.width}).not(':last').css('margin-bottom', dimensions.base.margin.bottom);
		if((page=='work' || page=='contact') && isMobile){
			$('.content').css({'padding-left': dimensions.margin.left, 'width': w + dimensions.margin.right, 'margin': dimensions.margin.top + 'px 0 ' + 0 + 'px', 'height': dimensions.base.height});
			$('#nav').css({'width': dimensions.base.width, 'height': 98, 'left': ''});
			$('#info').css({'height': ''});
		}else{
			$('.content').css({'width': dimensions.base.full.width, 'margin-bottom': dimensions.base.bottom, 'height': ''});
			$('#nav').css({'height': dimensions.nav.height, 'left': dimensions.base.full.width + dimensions.margin.left});
			$('#info').css({'height': dimensions.nav.height - 130 - (type=='list' ? 0 : 180)});
		}
		setScroll(time);
	}

	function setScroll(time){
		window.scrollTop = $(window).scrollTop();
		if(!window.mouse.init) window.mouse.init = window.mouse.x;
		/* LAGS IN CHROME -> used position: fixed instead */
		//dimensions.nav.scroll = Math.min($('.hero').length ? $('.hero').last().position().top - dimensions.margin.top : 0, $(window).scrollTop());
		//$('#nav').css({'position': 'absolute', 'margin-top': dimensions.nav.scroll});

		var n;
		if(dimensions.max[page] ? dimensions.max[page].width : false){
			var h = 0;
			$('.hero').each(function(i){
				//h += data.pages[page].content[i].height + dimensions.base.margin.bottom;
				if(data.pages[page].content[i].y>window.scrollTop - dimensions.base.height*0.5){
					n = i;
					return false;
				}
			});
		}else n = Math.floor((window.scrollTop - dimensions.base.height*0.5)/(dimensions.base.height + dimensions.base.margin.bottom)) + 1;
		control.image.current = n;
		if(data.pages[page].paging){
			var np = control.image.page = Math.floor(n/data.pages[page].paging);
			if($('.content .page').eq(np).hasClass('hidden')) $('.content .page').eq(np).removeClass('hidden').prevAll().removeClass('hidden');
			if(control.image.current%data.pages[page].paging>=data.pages[page].paging-2) $('.content .page').eq(np + 1).removeClass('hidden');
			window.uiScroll = ((window.scrollTop + dimensions.base.bottom/2)/(dimensions.base.height + dimensions.base.margin.bottom)) % 1 === 0 || window.scrollTop == 0;
		}else{
			control.image.page = 0;
			window.uiScroll = (window.scrollTop/(dimensions.base.full.height + dimensions.base.margin.bottom)) % 1 === 0;
		}
		//$('.content').removeClass('init').children().children().removeClass('current').eq(n).addClass('current');
		$('.content').removeClass('init').find('.hero').removeClass('current').eq(n).addClass('current');
		if(window.autoScroll) window.control.nav.set();

		if(dimensions.timer){
			clearTimeout(dimensions.timer);
			n = 1;
		}
		var hasTemp = $('.temp').length;
		if(!hasTemp) $('.content').append('<aside style="height: 1px; width: 1px; overflow: hidden; display: block;" class="temp">s</aside>');
		dimensions.timer = setTimeout(function(){
			dimensions.timer = null;
			if(!window.autoScroll) window.autoScroll = true;
			if(n>0) window.control.location.refreshState();
			if(!uiScroll && window.mouse.init<$(window).width() && !mouse.down && false) scrollToImage(control.image.current, 0, true, true);
			window.mouse.init = 0;
			shuffleLoad();
			if(hasTemp) $('.temp').remove();
			if(!window.currentData.hasOwnProperty('index') && type!='list') $('#info .pages li').removeClass('active').eq(control.image.current).addClass('active');
		}, time ? time : 200);
	}

	function shuffleLoad(){
		var list = $('img[data-src]').not('.hidden img');
		list.sort(function(a, b){
			var n = _i(a) - _i(b);
			return n ? n/Math.abs(n) : 0;
		});
		preloader.clear();
		//var a = [];
		list.each(function(i){
			//a.push($(this).parents('.hero').index('.hero'));
			processImage(this, i);
		});
	}

	function _i(el){
		var y, i = $(el).parents('.hero').index('.hero');
		//return Math.abs(window.scrollTop - i*(dimensions.margin.top + dimensions.base.height));
		
		if(dimensions.max[page] ? dimensions.max[page].width : false){
			y = data.pages[page].content[i].y;
		}else y = i*(dimensions.margin.top + dimensions.base.height);
		return Math.abs(window.scrollTop - y);
	}

	function processImage(element, i){
		var img, loader, init, timer;
		var src = $(element).attr('data-src');
		var hero = $(element).parents('.hero');
		var parent = $(element).parent();
		var hide = parent.children('img').index(element);		
		var p = 0;
		var bg = false;
		var title = $(element).data('title');
		var id = $(element).data('id');
		if($(element).siblings('.loader').length){
			loader = $(element).siblings('.loader')[0];
		}else{
			loader = $('<aside class="loader"><span></span></aside>')[0];
			hero.prepend(loader);
			timer = setTimeout(function(){
				parent.css({'background': '#ecedee'});
			}, 500);
		}
		preloader.load(src, onComplete, onError, onProgress);
		init = Date.now();

		function onComplete(imgP){
			img = imgP ? imgP : (preloader.image(src).parentNode ? $('<img src="' + src + '" />')[0] : preloader.image(src));
			$(element).remove();
			parent.append($(img).attr({'data-id': id}).css({'opacity': 0, 'display': 'block'}));
			if(p>0){
				onProgress();
				$(loader).hide();
			}
			delay = i*600;
			init = Date.now() - init;
			setTimeout(function(){
				if(!hide){
					parent.css('background', '');
					clearTimeout(timer);
				}
				slideshow.add(img, !p);
			}, (init < delay && !hide && p) ? delay - init : 4);
		}

		function onProgress(){
			if(Date.now() - init > 500){
				p = Math.round(preloader.progress(src)*100);
				$(loader).children('span').transition({'width': p + '%', 'ease': 'ease-out'}, 500);
			}
		}

		function onError(){
			var imgP = $('<img src="' + src + '" />');
			imgP.load(function(){
				onComplete(imgP[0]);
			}).error(function(){
				$(element).remove();
				parent.append('<span class="error">problem loading image: ' + url + '</span>');
				if(!hide) parent.transition({'background': '#ecedee'}, 200);
			});
		}
	}

	function scrollToImage(i, y, single, animate){
		el = $('.content .hero');
		el = el.eq(0);
		if(!y){
			if(dimensions.max[page] ? dimensions.max[page].width : false){
				y = data.pages[page].content[i].y - (i>0 ? (dimensions.base.bottom/2) : 0);
			}else y = (el.height() + dimensions.base.margin.bottom)*i - (data.pages[page].paging && i>0 ? dimensions.base.bottom/2 : 0);
		}else i = Math.floor(y/(el.height() + dimensions.margin.top));
		i = i/data.pages[page].paging|0;
		if($('.content .page').eq(i).hasClass('hidden')) $('.content .page').eq(i).removeClass('hidden').prevAll().removeClass('hidden');
		if(animate) $(window.opera?'html':'html, body').animate({scrollTop:y}, 200);
		else $(window).scrollTop(y);
	}

	function _b(d, type, p){
		p = p ? p : page;
		var max = dimensions.max[p] || dimensions.max.base;
		return max[type] ? Math.min(max[type], d) : d;
	}

	window.control.image = {
		init: init,
		refresh: setRatio,
		setScroll: setScroll,
		scrollTo: scrollToImage
	};
})();