<?php
	include '_template/mobile_device.php';

	function load_json($file){
		$d = file_get_contents($file);
		return $d ? json_decode($d, true) : false;
	}

	function the_title(){
		global $data, $page;
		return $data['site']['title'] . ($page!='home' && $page!='missing' ? ' | ' . strtoupper($page) : '');
	}

	function the_nav(){	/* pass in any items to skip in a comma-separated list */
		global $data;
		$ex = func_get_args();
		$r = '';
		foreach($data['pages'] as $key => $val){
			$t = (isset($val['title']) ? $val['title'] : $key);
			if(array_search($t, $ex)===false && $val['type']!='hidden'){
	    		$r .= '<li class="' . $key . '"><a href="' . $key . '">' . strtoupper($t) . '</a></li>';
	    	}
    	}
    	return '<ul>' . $r . '</ul>';
	}

	function the_statics(){
		global $data, $page;
		$r = '';
		foreach($data['pages'] as $key => $val){
			if(is_static($key))
	    		//$r .= '<article class="' . $key . ($key==$page ? ' ' . 'active' : '') . '"><h3>' . strtoupper(isset($val['title']) ? $val['title'] : $key) . '</h3>' . strtoupper(markup($val['content'])) . '</article>';
	    		$r .= '<article class="' . $key . ($key==$page ? ' ' . 'active' : '') . '">' . markup(strtoupper($val['content'])) . '</article>';
    	}
    	return $r;
	}

	function the_links(){
		global $data, $page;
		$r = '';
		if(!is_static($page) && $page!='missing'){
			foreach($data['pages'][$page]['content'] as $img){
				if(isset($img['link']) || isset($img['content'])){
					$s = isset($img['title']) ? (isset($img['date']) ? $img['date'] . ' |&nbsp;' : '') . '<span>' . strtoupper($img['title']) . '</span>' : $img['link'];
					$s = '<a href="' . (isset($img['content']) ? $page . '/' . (isset($img['url']) ? $img['url'] : $img['title']) : $img['link']) . '">' . $s . '</a>';
					$r .= '<li>' . $s . '</li>';
				}
			}
		}
		return $r;
	}

	function is_static($p){
		global $data;
		return isset($data['pages'][$p]['type']) && $data['pages'][$p]['type']=='static';
	}

	function markup($s){
		global $is_mobile;
		//remove anchors
		$s = preg_replace('/(<a[^>]+>)|(<\/a\s?>)/', '', $s);
		//tabs
		$s = preg_replace('/\t/', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', $s);
		//new lines
		$s = preg_replace('/\n|\r/', '<br />', $s);
		//emails
		$s = preg_replace('/(([\w-\.]+)@((?:[\w-]+\.)+)([a-zA-Z]{2,4}))/i', '<a href="mailto:$0" target="_blank">$0</a>', $s);
		//urls
		$s = preg_replace_callback('/(?<=[^\w-@:%\+.~#?&\/=])[\w-:%\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\w-@:%\+.~#?&\/=]*)?/i', 'checkHTTP', $s);
		//de-skype numbers
		$s = preg_replace('/((\+)( )?(\d+))?( ?[\(\[]\d+[\)\]])?( )?(\d+)( )?(\d+)( )?(\d{3,6})/', $is_mobile ? '<a href="tel:$1$3$7$9$11">$1&shy;$5&shy;$6$7&shy;$8$9$10$11</a>' : '$1&shy;$5&shy;$6$7&shy;$8$9$10$11', $s);

		//$s = preg_replace('/(\+?\d+)(\W{2}\d+\W)?(\s)(\d+)((\s)(\d+))?((\s)(\d+))?/', $is_mobile ? '<a href="tel:$1$4$7$10">$1&shy;$2&shy;$3$4$5$8</a>' : '$1&shy;$2&shy;$3$4$5$8', $s);
		return $s;
	}

	function checkHTTP($matches){
		$url = strpos($matches[0], 'http')===0 ? $matches[1] : 'http://' . $matches[0];
		return '<a href="' . strtolower($url) . '" target="_blank">' . $matches[0] . '</a>';
	}


	function the_picker(){
		$r = '';
		for($i=1;$i<31;$i++)
			$r .= '<li></li>';
		return '<ul>' . $r . '</ul>';
	}

	function the_images($url, $list, $paging, $slideshow=false){
		global $data;
		$bot = is_bot();
		$r = '';
		$a = array();
		$n = 0;
		foreach($list as $img){
			if(isset($img['id']) && isset($data['images'][$img['id']])){
				$s = '<img data-id="' . $img['id'] . '" data-title="' . $data['images'][$img['id']]['title'] . '" ' . ($bot ? 'class="auto" ' : 'data-') . 'src="' . $data['images'][$img['id']]['url'] . '" />';
				if(isset($img['content'])){
					$s = '<a href="' . (isset($img['content']) ? $url . '/' . (isset($img['url']) ? $img['url'] : $img['title']) : $img['link']) . '">' . $s . '</a>';
					if(isset($img['content']) && isset($img['title'])) $s .= '<span class="title">' . strtoupper($img['title']) . (isset($img['date']) ? ' | ' . $img['date'] : '') . '</span>';
				}
				if(!$slideshow) $r .= '<li class="hero">' . $s . '</li>';
				else $r .= $s;
			}
			if($paging>0 && ($n%$paging==$paging-1 || $n==count($list)-1)){
  				$a[] = '<li class="page' . (count($a) ? ' hidden' : '') . '"><ul>' . $r . '</ul></li>';
  				$r = '';
  			}
  			++$n;
		}
		if($slideshow) $r = '<article class="hero">' . $r . '</article>';
		else{
			if($paging>0) $r = implode('', $a);
			$r = '<ul>' . $r . '</ul>';
		}
		return $r;
	}

	function the_subs(&$list, $r=false){
		$a = array();
		foreach($list as $n => &$sub){
			if(isset($sub['content'])){
				$a[] = isset($sub['url']) ? $sub['url'] : (isset($sub['title']) ? $sub['title'] : $n);
				if(is_array($sub['content']))
					$sub['subs'] = the_subs($sub['content'], true);
			}
		}
		if($r) return $a;
	}

	function init_site(){
		global $page, $location, $data, $data_url, $is_mobile;

		if(!isset($is_mobile)) $is_mobile = mobile_device();
		if(!isset($_GET['page']))
			$_GET['page'] = 'index.php';

		$data = load_json($data_url, true);
		the_subs($data['pages']);
		$data['pages']['missing'] = array("type" => "hidden", "content" => getPage('_template/missing.php'));
		checkPage($_GET['page']);
	}

	function addPars($s){
		return '<p>' . preg_replace('/(<br\s?\/?>){2}/', '</p><p>', $s) . '</p>';
	}

	function checkPage($get){
		global $page, $content, $location, $data, $type, $is_mobile, $base_uri;
		if(substr($get, -1)=='/') $get = substr($get, 0, -1);
		$location = explode('/', strtolower($get));
		$page = end(array_values($location));

		$error = false;
		if(strpos($_SERVER['REQUEST_URI'], 'index')!==false || $page=='missing'){
			$error = true;
		}else if($page=='index.php'){
			if($is_mobile){
				$page = 'work';
			}else{
				$page = 'home';
			}
			$location = array(0 => $page);
			$currentData = $data['pages'][$page];
			$content = the_images($page, $currentData['content'], 0, $page=='home');
		}else if(isset($data['pages'][$location[0]])){
			$page = $location[0];
			$currentData = $data['pages'][$page];
			if(count($location)==1){
				if(is_static($page)){
					if($is_mobile && $page=='contact'){
						$page = 'work';
						$location = array(0 => 'work');
						$content = the_images('work', $data['pages']['work']['content'], 0);
					}else{
						$location = array(0 => '');
						$content = the_images('home', $data['pages']['home']['content'], 0, true);
					}
				}else $content = the_images($page, $currentData['content'], isset($currentData['paging']) ? $currentData['paging'] : 0);
			}else if(count($location)==2 && !is_static($page)){
				$n = array_search($location[1], $currentData['subs']);
				if($n!==false){
					$currentData = $data['pages'][$page]['content'][$n];
					$content = the_images($page, $currentData['content'], isset($currentData['paging']) ? $currentData['paging'] : 0);
				}else{
					$error = true;
				}
			}else{
				$error = true;
			}
			if(!$error){

			}
		}else{
			$error = true;
		}

		if($error){
			set404();
			$page = 'missing';
			$currentData = $data['pages'][$page];
			$content = $currentData['content'];
			$location = array(0 => $page);
		}

		if($page!='home') $type = $currentData['type'];
	}

	function getPage($url){
	    if(is_file($url)){
	        ob_start();
	        @include $url;
	        return ob_get_clean();
	    }
	    return false;
	}

	function is_bot(){
		return strpos($_SERVER['HTTP_USER_AGENT'],"Googlebot")!==false || strpos($_SERVER['HTTP_USER_AGENT'],"Bingbot")!==false;
	}

	function set404(){
		header("HTTP/1.0 404 Not Found");
	}

	function jsonToReadable($json){
		$tc = 0;		//tab count
		$r = '';		//result
		$dq = false;	//double quotes
		$t = "\t";		//tab
		$nl = "\n";		//new line

		for($i=0; $i<strlen($json); $i++){
			$ch = $json[$i]; //character

			if($ch=='"' && $json[$i-1]!='\\') $dq = !$dq;

			if($dq){
				$r .= $ch;
				continue;
			}

			switch($ch){
				case '{':
					if($i) $r .= $nl;
					$r .= str_repeat($t, $tc) . $ch . $nl . str_repeat($t, ++$tc);
					break;
				case '}':
				   $r .= $nl . str_repeat($t, --$tc) . $ch;
				   break;
				case ',':
				   $r .= $ch;
				   if($json[$i+1]!='{') $r .= $nl . str_repeat($t, $tc);
				   break;
				default:
				   $r .= $ch;
			}
		}
		return $r;
   }
?>
