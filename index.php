<?php
	$base_uri = "http://" . $_SERVER['HTTP_HOST'] . preg_replace('/[^\/]+$/', '', $_SERVER['PHP_SELF']);
	
	include "_template/functions.php";
	$data_url = 'data.json';
	$dev_mode = false;
	//$is_mobile = false;
	init_site();
?>
<!DOCTYPE HTML>
<!--[if lt IE 10 ]> <html id="<?php echo $page; ?>" class="ie<?php if($is_mobile) echo ' mobile'; ?>"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html id="<?php echo $page; ?>" <?php if($is_mobile) echo ' class="mobile"'; ?>> <!--<![endif]-->
<head><?php include "_template/head.php"; ?></head>
<body class="<?php echo $type; ?> init">
<section class="content">
	<?php if(isset($content)) echo $content; ?>
</section>
<?php include '_template/nav.php'; ?>
<?php include "_template/footer.php"; ?>
<!--[if lt IE 9]><?php include "_template/old.php"; ?><![endif]-->
</body>
</html>