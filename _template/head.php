<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title><?php echo the_title(); ?></title>
<?php if($dev_mode): ?>
<meta name="robots" content="noindex, nofollow">
<?php endif; ?>
<meta name="description" content="<?php echo $data['site']['description']; ?>" />
<meta property="og:title" content="<?php echo $data['site']['title']; ?>"/>
<meta property="og:description" content="<?php echo $data['site']['description']; ?>" />
<meta property="og:type" content="website"/>
<meta property="og:url" content="<?php echo $base_uri . ($page=='home' ? '' : $page); ?>"/>
<meta property="og:site_name" content="<?php $data['site']['title']; ?>"/>
<?php if($data['site']['icon']): ?>
<meta property="og:image" content="<?php echo $base_uri . $data['site']['icon']; ?>"/>
<?php endif; ?>
<BASE href="<?php echo $base_uri; ?>">
<link href="css/html5.css" rel="stylesheet" type="text/css"/>
<link href="css/style.css" rel="stylesheet" type="text/css"/>
<link href="fonts/style.css" rel="stylesheet" type="text/css"/>
<?php if($data['site']['icon']): ?>
<link rel="image_src" type="image/jpeg" href="<?php echo $base_uri . $data['site']['icon']; ?>" />
<?php endif; ?>
<?php if($data['site']['favicon']): ?>
<link rel="shortcut icon" href="<?php echo $data['site']['favicon']; ?>" type="image/<?php echo (strpos($data['site']['favicon'], '.ico') > 0 ? 'x-icon' : substr(strrchr($data['site']['favicon'], '.'), 1)); ?>" />
<?php endif; ?>
<!--[if lt IE 9]>
<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script src="http://code.createjs.com/preloadjs-0.1.0.min.js"></script>
<script src="js/functions.js"></script>
<script src="js/control.js"></script>
<script src="js/location.js"></script>
<script src="js/image.js"></script>
<script src="js/canvas.js"></script>
<script src="js/preloader.js"></script>
<script src="js/fader.js"></script>
<script src="js/nav.js"></script>
<?php if($is_mobile): ?>
<script src="js/mobile.js"></script>
<script src="js/swipe.min.js"></script>
<?php endif; ?>
<script src="js/iscroll.js"></script>
<!-- note: analytics and page data are included in the footer -->