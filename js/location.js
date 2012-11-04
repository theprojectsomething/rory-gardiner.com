(function(){
	var state, first;

	function init(){
		if(!window.history.pushState){
			if(window.location.pathname.length>1) window.open(base + '#' + page, '_self');
			else if(window.location.hash.length){
				open(window.location.hash.slice(1));
				window.location.hash = '';
			}else open(window.location.href);
		}else open(window.location.href);
		if($.browser.msie && $.browser.version<9){
			$('#old a.continue').click(function(e){
				e.preventDefault();
				$('#old').remove();
				return false;
			});
		}

		$(document).bind('DOMMouseScroll mousewheel wheel', function(e){
			if($(e.target).parents('#static').length || url=='work' || url.indexOf('projects/')>=0) return false;
		});

		/*$('html').click(function(e){
			if(window.control.nav.isStatic() && (!isMobile || url!='work')){
				if(e.target.id!='static' && !$(e.target).parents('#static').length && ($(e.target).attr('href')==null || $(e.target).parents('.hero').length)){
					open(url==state ? '' : url, true);
					return false;
				}
			}
		});*/
	}

	$('a').live('click', function(e){
		if($(this).hasClass('close')){
			open(url==state ? '' : url, true);
			return false;
		}else if(!e.ctrlKey && !e.metaKey){
			var href = $(this).attr('href').toLowerCase();
			if((href.indexOf('http')<0 || href.indexOf(base)===0) && href.indexOf('tel')!==0 && href.indexOf('mailto')<0 && (href.slice(-5).indexOf('.')<0 || href==base) && !$(this).hasClass('external') && !$(this).hasClass('close')){
				if(window.location.href!=this.href || !window.history.pushState) open(href, true);
				this.blur();
				return false;
			}
		}
	});

	function open(href, push, prevState){
		var content, title = data.site.title, split, newPage, pageCount, error;
		newURL = href;
		if(newURL.indexOf(base.slice(0, -1))===0) newURL = newURL.slice(base.length);
		if(newURL.slice(-1)=='/') newURL = newURL.slice(0, -1);
		if(newURL=='') split = ['home'];
		else split = newURL.split('/');

		var isStatic = window.control.nav.isStatic(split[0]);
		if(data.pages.hasOwnProperty(split[0]) && split[0]!='missing' && !isStatic){
			newPage = split[0];
			window.currentData = data.pages[newPage];
			if(newPage=='home'){
				if(isMobile){
					newPage = newURL = 'work';
					split = [newPage];
					window.currentData = data.pages[newPage];
				}
				if(!window.currentData.html) window.currentData.html = createHTML(newPage, window.currentData.content, 0, !isMobile);
				content = $(window.currentData.html);
			}else{
				if(split.length==1){
					if(window.currentData.content instanceof Array) pageCount = window.currentData.content.length;
					//if(pageCount && window.currentData.hasOwnProperty('paging')) pageCount = Math.ceil(pageCount/Math.max(1, window.currentData.paging));
				}else if(split.length==2){
					var n = window.currentData.subs.indexOf(split[1]);
					if(n>=0){
						window.currentData = window.currentData.content[n];
						window.currentData.index = n;
						pageCount = window.currentData.content.length;
					}else error = true;
				}else{
					error = true;
				}
				if(!error){
					if(!window.currentData.html) window.currentData.html = createHTML(newPage, window.currentData.content, window.currentData.paging|0);
					content = $(window.currentData.html);
				}
			}
		}else if(isStatic && split.length==1){
			newPage = split[0];
			window.currentData = data.pages[newPage];
		}else{
			error = true;
		}
		type = window.currentData.type;

		if(error){
			isStatic = false;
			newURL = newPage = 'missing';
			window.currentData = data.pages[newPage];
			type = 'hidden';
			content = $(window.currentData.content);
		}else if(newPage!='home'){
			title += ' | ' + newPage.toUpperCase();
			if(!isStatic) $('body').attr('class', window.currentData.type);
		}
		if(isMobile){
			if(isStatic) $('body').addClass('static');
			else $('body').removeClass('static');
		}

		if(!isStatic) $('#nav .main .active').removeClass('active');
		$('#nav .main li.' + newPage).addClass('active');

		if(page!=newPage){
			page = newPage;
			document.title = title;
		}
		if(!isStatic && newURL!=url){
			$('#info .pages').empty().append(theLinks(newPage));
			$('.content').addClass('init');
			url = newURL ? newURL : '';
			$('.content').empty().append(content);
			window.control.image.refresh(0);
			if(prevState && prevState.scroll){
				window.control.image.scrollTo(0, prevState.scroll);
			}
			if(isMobile) window.control.mobile.reset(page=='work');
		}
		if(!isStatic) $('html').attr('id', page).css('overflow-y', (page=='projects' && split.length>1) || page=='work' ? 'hidden' : '');
		if(window.currentData.hasOwnProperty('index')) $('#info .pages li').eq(window.currentData.index).addClass('active');
		window.control.nav.show(pageCount ? new Array(pageCount) : null);
		window.control.nav.showStatic();
		window.control.nav.showInfo();
		state = newURL;
		window.trackPage(newURL);
		if(window.history.pushState){
			href = href.length ? href : base;
			if(push){
				window.history.pushState({"href": href, "title": title, "scroll": $(window).scrollTop()}, title, href);//.length ? href : base);
			}else if(!first){
				first = true;
				refreshState({"href": href, "title": title});
			}
		}
	}

	function theLinks(newPage){
		var list = data.pages[newPage].content;
		var r = '', s;
		if(!window.control.nav.isStatic() && newPage!='missing'){
			for(var i=0,n=list.length;i<n;i++){
				if(list[i].link || list[i].content){
					s = list[i].title ? (list[i].date ? list[i].date + ' |&nbsp;' : '') + '<span>' + list[i].title.toUpperCase() + '</span>': list[i].link;
					s = '<a href="' + (list[i].content ? newPage + '/' + (list[i].url ? list[i].url : list[i].title) : list[i].link )+ '">' + s + '</a>';
					r += '<li>' + s + '</li>';
				}
			}
		}
		return r;
	}

	function refreshState(params){
		params = params||{};
		if(window.history.pushState){
			if(window.history.state) for(var i in window.history.state) params[i] = window.history.state[i];
			params.scroll = $(window).scrollTop();
			window.history.replaceState(params, params.title, params.href);
		}
	}

	function createHTML(newPage, list, paging, slideshow){
		var r = '', s, a = [];
		paging = paging|0;
		for(var i=0,n=list.length;i<n;i++){
			if(data.images[list[i].id]){
				s = '<img data-id="' + list[i].id + '" data-title="' + data.images[list[i].id].title + '" data-src="' + data.images[list[i].id].url + '" />';
				if(list[i].content){
					s = '<a href="' + (list[i].content ? newPage + '/' + (list[i].url || list[i].title) : list[i].link) + '">' + s + '</a>';
					if(list[i].content && list[i].title) s += '<span class="title">' + list[i].title.toUpperCase() + (list[i].date ? ' | ' + list[i].date : '') + '</span>';
				}
				if(!slideshow) r += '<li class="hero">' + s + '</li>';
				else r += s;
			}
			if(paging && (i%paging==paging-1 || i==n-1)){
  				a.push('<li class="page' + (a.length>0 ? ' hidden' : '') + '"><ul>' + r + '</ul></li>');
  				r = '';
  			}
		}
		if(slideshow) r = '<article class="hero">' + r + '</article>';
		else{
			if(paging) r = a.join('');
			r = '<ul>' + r + '</ul>';
		}
		return r;
	}

	window.onpopstate = function(e){
		if(e.state && e.state.href!=state)
			open(e.state.href, false, e.state);
	};

	window.control.location = {
		init: init,
		open: open,
		refreshState: refreshState
	}

})();
