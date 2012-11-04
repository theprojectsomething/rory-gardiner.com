<?php foreach($data['pages']['work']['images'] as $img): ?>
	<?php if(isset($data['images'][$img['id']])): ?>
  <article class="hero">
    <img data-id="<?php echo $img['id']; ?>" data-title="<?php echo $data['images'][$img['id']]['title']; ?>" data-src="<?php echo $data['images'][$img['id']]['url']; ?>" />
  </article>
  	<?php endif; ?>
<?php endforeach; ?>