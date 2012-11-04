<aside id="nav">
	<h1><a class="rory-gardiner" href=""><span>RORY GARDINER</span></a></h1>
	<nav class="main">
		<?php echo the_nav(); ?>
	</nav>
	<section id="static" class="<?php if(is_static($page)) echo $page; ?>">
		<aside class="overlays">
			<?php echo the_statics(); ?>
		</aside>
		<a href="" class="close"></a>
	</section>
	<aside id="info">
		<ul class="pages"><?php echo the_links(); ?></ul>
	</aside>
	<nav class="picker">
		<?php echo the_picker(); ?>
		<aside><span class="prev">PREV</span>|<span class="next">NEXT</span></aside>
	</nav>
</aside>