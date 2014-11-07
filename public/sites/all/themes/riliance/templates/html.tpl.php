<?php print $doctype; ?>
<html lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>"<?php print $rdf->version . $rdf->namespaces; ?>>
<head<?php print $rdf->profile; ?>>
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>  
  <?php print $styles; ?>
  <?php print $scripts; ?>
  <!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200' rel='stylesheet' type='text/css'>

</head>
<body<?php print $attributes;?>>
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
  <!-- Start of Async HubSpot Analytics Code -->
 <script type="text/javascript">
   (function(d,s,i,r) {
     if (d.getElementById(i)){return;}
     var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
     n.id=i;n.src='//js.hs-analytics.net/analytics/'+(Math.ceil(new Date()/r)*r)+'/447959.js';
     e.parentNode.insertBefore(n, e);
   })(document,"script","hs-analytics",300000);
 </script>
<!-- End of Async HubSpot Analytics Code -->
</body>
</html>