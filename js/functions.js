(function(){
	window._p = function(v){
		return parseInt(v);
	}

	if(!Array.prototype.indexOf){
		Array.prototype.indexOf = function(obj, start) {
			for(var i=(start||0), j=this.length; i<j; i++){
				if(this[i]===obj){return i;}
			}
			return -1;
		}
	}

	if(!Date.now){
      Date.now = function now(){  
        return +(new Date);  
      };  
    }  

	window.css3please = function(prop){
		prop = prop.toLowerCase();
		var prefixes = {'standard': '', 'Moz': "-p-e", 'Webkit': '-t-P-E', 'O': '-t-P-E', 'ms': '-P-E', 'Khtml': '-P-E'},
			elem = document.createElement('div'),
			upper = _u(prop),
			pre,
			standard;
		
		if(prop in elem.style) standard = true;
		    
		for(var i in prefixes){
			if((i + upper) in elem.style || standard){
				pre = standard ? '' : '-' + i.toLowerCase() + '-';
				return {prefix: pre, property: prop, css: pre + prop, js: (standard ? '' : i) + upper, end: _r(prefixes[i], 't', i) + _r(prefixes[i], 'p', prop) + _r(prefixes[i], 'e', 'end')};
			}
		}

		return false;

		function _r(s, r, p){
			var re = new RegExp('-[^' + r + ']', 'ig');
			return s.replace(re, '').replace('-' + r, p.toLowerCase()).replace('-' + r.toUpperCase(), _u(p));
		}

		function _u(s){
			return s.charAt(0).toUpperCase() + s.slice(1);			
		}
	}

	var transition = css3please('transition');
	$.fn.transition = function(props, time, callback){
		if(this.length && props && time){
			var _this = this;
			var trans = (function(){
				return !((_this.attr('style') || '').indexOf('transition')<0);
				/*var s = (_this.attr('style') || '');
				var r = s.replace(/(.+)(ransition-property: )([^;]+)(.+)/, '$3');
				if(s==r){
					r = r.replace(/(.+)(ransition: )([^;]+)(.+)/, '$3');
					if(s!=r) r = r.match(/(^|, )\S+/g).join('');
				}
				return s==r ? [] : r.split(', ');*/
			})();
			var finalise = function(){
				if(callback){
					_this.each(function(){
						callback.call(this);
					});
				}
			}
			props.delay = 0 | props.delay;
			props.ease = props.ease ? props.ease : 'ease-in-out';
			if(time<10) time *= 1000;
			if(props.delay<10 && props.delay>0) props.delay *= 1000;
			if(transition && !trans){
				var list = [];
				for(var i in props){
					if(i!='delay' && i!='ease' && _this.css(i)!=props[i])
						if(props[i]!=this.css(i)) list.push(i + ' ' + time + 'ms ' + props.ease + ' ' + props.delay + 'ms');
				}
				if(list.length){
					this.css(transition.css, list.join(', '));
					setTimeout(function(){_this.css(props);}, 1);
					_this.bind(transition.end, function(){
						_this.unbind(transition.end);
						_this.css(transition.css, '');
						finalise();
					});
				}else{
					setTimeout(function(){
						finalise();
						_this.css(transition.css, '');
					}, props.delay + time);
				}
			}else{
				var skip;
				for(var i in props) if(isNaN(props[i]) && i!='delay' && i!='ease') skip = true;
				if(skip){
					setTimeout(function(){
						finalise();
						_this.css(transition.css, '');
					}, props.delay + time);
				}else this.delay(props.delay).animate(props, time, callback);
			}
		}

		return this;
	};

	Object.size = function(obj){
	    var size = 0, key;
	    for(key in obj)
	        if (obj.hasOwnProperty(key)) size++;
	    return size;
	};


	Array.prototype.difference = function(a) {
	    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
	};

	'use strict';
	if(!('bind' in Function.prototype)){
	    Function.prototype.bind = function(owner){
	        var _this = this;
	        if(arguments.length<=1){
	            return function(){
	                return _this.apply(owner, arguments);
	            };
	        }else{
	            var args = Array.prototype.slice.call(arguments, 1);
	            return function(){
	                return _this.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
	            };
	        }
	    };
	}
	if(!('trim' in String.prototype)){
	    String.prototype.trim = function(){
	        return this.replace(/^\s+/, '').replace(/\s+$/, '');
	    };
	}
	if(!('forEach' in Array.prototype)){
	    Array.prototype.forEach = function(action, that){
	        for(var i=0, n=this.length; i<n; i++)
	            if(i in this) action.call(that, this[i], i, this);
	    };
	}
	if(!('map' in Array.prototype)){
	    Array.prototype.map = function(mapper, that){
	        var other = new Array(this.length);
	        for(var i=0, n=this.length; i<n; i++)
	            if(i in this) other[i] = mapper.call(that, this[i], i, this);
	        return other;
	    };
	}
	if(!('filter' in Array.prototype)){
	    Array.prototype.filter = function(filter, that){
	        var other= [], v;
	        for(var i=0, n=this.length; i<n; i++)
	            if(i in this && filter.call(that, v= this[i], i, this)) other.push(v);
	        return other;
	    };
	}
	if(!('every' in Array.prototype)){
	    Array.prototype.every= function(tester, that){
	        for(var i=0, n=this.length; i<n; i++)
	            if(i in this && !tester.call(that, this[i], i, this)) return false;
	        return true;
	    };
	}
	if(!('some' in Array.prototype)){
	    Array.prototype.some = function(tester, that){
	        for(var i=0, n=this.length; i<n; i++)
	            if(i in this && tester.call(that, this[i], i, this)) return true;
	        return false;
	    };
	}

})();