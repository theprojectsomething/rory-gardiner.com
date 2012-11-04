<script type="text/javascript">
var _gaq = _gaq || [];
(function(){
  window.trackPage = function(relative_url){
    if(relative_url.slice(0, 1)!='/') relative_url = '/' + relative_url;
    log('Track Page', {'Page': relative_url});
    _gaq.push(['_trackPageview', relative_url]);
  }
  window.trackEvent = function(category, action, label, value, count){
    log('Track Event', {'Category': category, 'Action': action, 'Label': label, 'Value': value, 'Count': count});
    _gaq.push(['_trackEvent', category, action, label, Number(value), Number(count)]);
  }

  function log(type, data){
    if(console && devMode){
      if(!console.group) console.group = console.log;
      if(!console.info) console.info = console.log; 
      console.group('Google Analytics:', "<?php echo $data['site']['analytics'] ? 'ON' : 'OFF (UA not set)'; ?>");
      console.info(type);
      for(i in data) if(data[i]) console.log(i + ':', '"' + data[i] + '"');
      if(console.groupEnd) console.groupEnd();
    }
  }
})();
<?php if($data['site']['analytics']): ?>
  _gaq.push(['_setAccount', '<?php echo $data['site']['analytics']; ?>']);
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
<?php endif; ?>
</script>