<script type="text/javascript">
  var data = <?php echo json_encode($data); ?>;
  var base = "<?php echo $base_uri; ?>";
  var page = "<?php echo $page; ?>";
  var devMode = <?php echo $dev_mode ? 'true' : 'false'; ?>;
  var url = "<?php echo implode('/', $location); ?>";
  var type = "<?php echo $type; ?>";
  var isMobile = <?php echo $is_mobile ? 'true' : 'false'; ?>;
</script>
<?php include "_template/analytics.php"; ?>