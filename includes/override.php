<?php
function gavias_emon_preprocess_views_view_unformatted__taxonomy_term(&$variables){
   $current_uri = \Drupal::request()->getRequestUri();
   $url = \Drupal::service('path.current')->getPath();
   $arg = explode('/', $url);
   $tid = 0;
   if ((isset($arg[1]) && $arg[1] ==  "taxonomy") && (isset($arg[2]) && $arg[2] == "term") && isset($arg[3]) && is_numeric($arg[3]) ) {
      $tid = $arg[3];
   }
   $term = taxonomy_term_load($tid);
   $layout = 'list';
   $columns = 3;
   try{
      $field = $term->get('field_category_layout');
      if(isset($field) && $field){
         $field = $field->getValue();
         if( isset($field[0]['value']) && $field[0]['value'] ){
            $layout = $field[0]['value'];
         }
      }
   }catch(Exception $e){
      $layout = 'list';
   }
   
   $item_class = '';
   if($layout == 'grid' || $layout == 'masonry'){
      try{
         $field = $term->get('field_category_columns');
         if(isset($field) && $field){
            $field = $field->getValue();
            if( isset($field[0]['value']) && $field[0]['value'] ){
               $columns = $field[0]['value'];
            }
         }
      }catch(Exception $e){
         $columns = 3;
      }

      if ($columns == '1'){
         $item_class = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
      }else if($columns == 2){
         $item_class = 'col-lg-6 col-md-6 col-sm-6 col-xs-12';
      }else if($columns == 3){
         $item_class = 'col-lg-4 col-md-4 col-sm-4 col-xs-12';
      }else if($columns == 4){
         $item_class = 'col-lg-3 col-md-3 col-sm-6 col-xs-12';
      }else if($columns == 6){
         $item_class = 'col-lg-2 col-md-2 col-sm-6 col-xs-12';
      }
   }   
   if($layout=='masonry'){
      $item_class .= ' item-masory';
   }   
   $variables['gva_columns'] = $columns;
   $variables['gva_item_class'] = $item_class;

   $variables['gva_layout'] = $layout;
}

function gavias_emon_preprocess_views_view_unformatted(&$variables) {
   $view = $variables['view'];
   $rows = $variables['rows'];
   $style = $view->style_plugin;
   $options = $style->options;
   if(strpos($options['row_class'] , 'gva-carousel-1') || $options['row_class'] == 'gva-carousel-1' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '1';
   }
   if(strpos($options['row_class'].'x' , 'gva-carousel-2') || $options['row_class'] == 'gva-carousel-2' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '2';
   }
   if(strpos($options['row_class'].'x', 'gva-carousel-3') || $options['row_class'] == 'gva-carousel-3' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '3';
   }
   if(strpos($options['row_class'].'x', 'gva-carousel-4') || $options['row_class'] == 'gva-carousel-4' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '4';
   }
   if(strpos($options['row_class'].'x', 'gva-carousel-5') || $options['row_class'] == 'gva-carousel-5' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '5';
   }
   if(strpos($options['row_class'].'x', 'gva-carousel-6') || $options['row_class'] == 'gva-carousel-6' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '6';
   }
   if(strpos($options['row_class'].'x', 'gva-carousel-7') || $options['row_class'] == 'gva-carousel-7' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '7';
   }
   if(strpos($options['row_class'].'x', 'gva-carousel-8') || $options['row_class'] == 'gva-carousel-8' ){
      $variables['gva_carousel']['class'] = 'owl-carousel init-carousel-owl';
      $variables['gva_carousel']['columns'] = '8';
   }
     //$language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $current_path = \Drupal::service('path.current')->getPath(); 
    $path_alias = \Drupal::service('path.alias_manager')->getAliasByPath($current_path, $language);		

    $requestUri = \Drupal::request()->getRequestUri();
    $args = explode('/', $requestUri);
    $current_language = "";
    if(sizeof($args) > 1) 
      $current_language = "/" . $args[1];

    $variables['language'] = $current_language;
    $variables['langlink'] = getLanglinkParameter();    
    
    if($view->id()=="portfolio_filter") {   
      $product_type = "";
      $product_family = "";    

      if ($view->getDisplay()->display['id'] == 'sku_filter') {     
        $product_type = $view->args[0];
        $product_family = $view->args[1];            
        $variables['pf'] = getTermCountByProductType($product_type, $product_family);         
      }
      else if ($view->getDisplay()->display['id'] == 'sku_filter1') {     
        return;
      }
      else {
        $url_ary = explode("/",$path_alias);
        \Drupal::logger('override')->notice('url_ary=' . sizeof($url_ary) . $path_alias . '[0]=' . $url_ary[0] . '-' . $url_ary[1]);
        if(sizeof($url_ary)>3) $product_type = $url_ary[3];
        if(sizeof($url_ary)>4) $product_family = $url_ary[4];    
        $variables['pf'] = getTermCountByProductType($product_type, $product_family);         
      }          



      /*
      if ($view->getDisplay()->display['display_title'] == 'SKU filter') {
              $product_type = $view->args[0];
              $product_family = $view->args[1];    

              if($product_type){
                  $query = \Drupal::database()->select('taxonomy_term_field_data', 'ttfd');
                  $query->addField('ttfd', 'tid');
                  $query->condition('ttfd.name', $product_type);
                  $query->condition('ttfd.vid', 'product_type');
                  $query->range(0, 1);
                  $product_type_tid = $query->execute()->fetchField();         
              }
              if($product_family){
                  if($product_family=="gpu") $product_family = "GPU/Coprocessor";
                  $query = \Drupal::database()->select('taxonomy_term_field_data', 'ttfd');
                  $query->addField('ttfd', 'tid');
                  $query->condition('ttfd.name', $product_family);
                  $query->condition('ttfd.vid', 'x11');
                  $query->range(0, 1);
                  $product_family_tid = $query->execute()->fetchField();       
              }    
              $nid_sql = "";
              if($product_type && $product_family){
                  $nid_sql = "SELECT DISTINCT n.nid FROM `node_field_data` n inner join `node__field_product_type` npt on n.nid = npt.entity_id inner join `node__field_product_family` npf "
                          . " ON npt.entity_id = npf.entity_id WHERE npt.deleted = 0 AND npt.bundle='portfolio' AND n.status=1 AND `field_product_type_target_id` = ".$product_type_tid." "
                          . " AND `field_product_family_target_id` = ".$product_family_tid;
              }else if($product_type){
                  $nid_sql = "SELECT DISTINCT n.nid FROM `node_field_data` n inner join `node__field_product_type` npt on n.nid = npt.entity_id WHERE npt.deleted = 0 AND npt.bundle='portfolio' "
                          . "AND `field_product_type_target_id` = ".$product_type_tid." AND n.status=1";
              }
              //return "SELECT taxonomy_index.tid FROM `taxonomy_index`  WHERE taxonomy_index.nid in (".$nid_sql.") group by taxonomy_index.tid";
              $tid_ary = array();
              $result = db_query("SELECT taxonomy_index.tid FROM `taxonomy_index`  WHERE taxonomy_index.nid in (".$nid_sql.") group by taxonomy_index.tid");
              foreach ($result as $row) {
                $tid_ary[] =$row->tid;
              }
              $variables['pf'] = $tid_ary;
      }
      else {
       $variables['pf'] = getTermCountByProductType(); 
      }

      */
    }
}


function gavias_emon_preprocess_views_view_fields(&$variables) {
    $requestUri = \Drupal::request()->getRequestUri();
    $args = explode('/', $requestUri);
    $current_language = "";
    if(sizeof($args) > 1) 
      $current_language = "/" . $args[1];

    $variables['language'] = $current_language;
}



function gavias_emon_preprocess_views_view_grid(&$variables) {
   $view = $variables['view'];
   $rows = $variables['rows'];
   $style = $view->style_plugin;
   $options = $style->options;
   $variables['gva_masonry']['class'] = '';
   $variables['gva_masonry']['class_item'] = '';
   if(strpos($options['row_class_custom'] , 'masonry') || $options['row_class_custom'] == 'masonry' ){
      $variables['gva_masonry']['class'] = 'post-masonry-style row';
      $variables['gva_masonry']['class_item'] = 'item-masory';
   }
}

function gavias_emon_preprocess_views_view_fields__testimonial_v1(&$vars) {
   $fields = $vars['fields'];
   $vars['iframe_video'] = '';
   try{
      if(isset($fields['field_testimonial_embed']) && $fields['field_testimonial_embed']->content){
         $embed = strip_tags($fields['field_testimonial_embed']->content);
         $autoembed = new AutoEmbed();
         $vars['iframe_video'] = trim($autoembed->parse($embed));
      }   
   }catch(Exception $e){
      $vars['iframe_video'] = '';
   }
}
function getTermCountByProductType($product_type, $product_family){  
/*
    $product_type = "";
    $product_family = "";    
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $current_path = \Drupal::service('path.current')->getPath(); 
    $path_alias = \Drupal::service('path.alias_manager')->getAliasByPath($current_path, $language);	
    $url_ary = explode("/",$path_alias);
    if(sizeof($url_ary)>2) $product_type = $url_ary[3];
    if(sizeof($url_ary)>3) $product_family = $url_ary[4];    
*/    
    if($product_type){
        $query = \Drupal::database()->select('taxonomy_term_field_data', 'ttfd');
        $query->addField('ttfd', 'tid');
        $query->condition('ttfd.name', $product_type);
        $query->condition('ttfd.vid', 'product_type');
        $query->range(0, 1);
        $product_type_tid = $query->execute()->fetchField();         
    }
    if($product_family){
        if($product_family=="gpu") $product_family = "GPU/Coprocessor";
        $query = \Drupal::database()->select('taxonomy_term_field_data', 'ttfd');
        $query->addField('ttfd', 'tid');
        $query->condition('ttfd.name', $product_family);
        $query->condition('ttfd.vid', 'x11');
        $query->range(0, 1);
        $product_family_tid = $query->execute()->fetchField();       
    }    
    $nid_sql = "";
    if($product_type && $product_family){
        $nid_sql = "SELECT DISTINCT n.nid FROM `node_field_data` n inner join `node__field_product_type` npt on n.nid = npt.entity_id inner join `node__field_product_family` npf "
                . " ON npt.entity_id = npf.entity_id WHERE npt.deleted = 0 AND npt.bundle='portfolio' AND n.status=1 AND `field_product_type_target_id` = ".$product_type_tid." "
                . " AND `field_product_family_target_id` = ".$product_family_tid;
    }else if($product_type){
        $nid_sql = "SELECT DISTINCT n.nid FROM `node_field_data` n inner join `node__field_product_type` npt on n.nid = npt.entity_id WHERE npt.deleted = 0 AND npt.bundle='portfolio' "
                . "AND `field_product_type_target_id` = ".$product_type_tid." AND n.status=1";
    }
    //return "SELECT taxonomy_index.tid FROM `taxonomy_index`  WHERE taxonomy_index.nid in (".$nid_sql.") group by taxonomy_index.tid";
    $tid_ary = array();
    $result = db_query("SELECT taxonomy_index.tid FROM `taxonomy_index`  WHERE taxonomy_index.nid in (".$nid_sql.") group by taxonomy_index.tid");
    foreach ($result as $row) {
      $tid_ary[] =$row->tid;
    }
    return $tid_ary;
}


function getTermArray($product_type, $product_family, $product_gen){  
    if($product_type){
        $query = \Drupal::database()->select('taxonomy_term_field_data', 'ttfd');
        $query->addField('ttfd', 'tid');
        $query->condition('ttfd.name', $product_type);
        $query->condition('ttfd.vid', 'product_type');
        $query->range(0, 1);
        $product_type_tid = $query->execute()->fetchField();         
    }
    if($product_family){
        if($product_family=="gpu") $product_family = "GPU/Coprocessor";
        $query = \Drupal::database()->select('taxonomy_term_field_data', 'ttfd');
        $query->addField('ttfd', 'tid');
        $query->condition('ttfd.name', $product_family);
        //$query->condition('ttfd.vid', $product_gen);
        $query->range(0, 1);
        $product_family_tid = $query->execute()->fetchField();       
    }    
    $nid_sql = "";
    if($product_type && $product_family){
        $nid_sql = "SELECT DISTINCT n.nid FROM `node_field_data` n inner join `node__field_product_type` npt on n.nid = npt.entity_id inner join `node__field_product_family` npf "
                . " ON npt.entity_id = npf.entity_id WHERE npt.deleted = 0 AND npt.bundle='portfolio' AND n.status=1 AND `field_product_type_target_id` = ".$product_type_tid." "
                . " AND `field_product_family_target_id` = ".$product_family_tid;
    }else if($product_type){
        $nid_sql = "SELECT DISTINCT n.nid FROM `node_field_data` n inner join `node__field_product_type` npt on n.nid = npt.entity_id WHERE npt.deleted = 0 AND npt.bundle='portfolio' "
                . "AND `field_product_type_target_id` = ".$product_type_tid." AND n.status=1";
    }
    //return "SELECT taxonomy_index.tid FROM `taxonomy_index`  WHERE taxonomy_index.nid in (".$nid_sql.") group by taxonomy_index.tid";
    $tid_ary = array();
    $result = db_query("SELECT taxonomy_index.tid FROM `taxonomy_index`  WHERE taxonomy_index.nid in (".$nid_sql.") group by taxonomy_index.tid");
    foreach ($result as $row) {
      $tid_ary[] =$row->tid;
    }
    return $tid_ary;
}



function gavias_emon_form_search_block_form_alter(&$form, $form_state) {

    if (theme_get_setting('enterprise') == '1') {
        $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
        switch($language){
            case "zh-hant":
               $language = "zh_tw";
               break;
            case "zh-hans":
               $language = "zh_cn";
            break;
         }
         $excludeLangs=array('ko', 'es', 'fr','de','it','de','pt-pt','ru','vi','th','id','ms','hi','nl');
         foreach ($excludeLangs as $v) {
            if ($v == $language) {
               $language="en";
            }
         }    
        $form['#action'] = '/'. $language . '/search';
        $form['#method'] = 'get';
        
        unset($form['keys']);

        $form['Search'] = [
          '#type' => 'search',
          '#title' => 'Search',
          '#title_display' => 'invisible',
          '#size' => 15,
          '#default_value' => ''
        ];           
        $form['Search']['#attributes']['placeholder'] = t('Search...');    
        $form['Search']['#attributes']['autocomplete'] = 'off';      
    }
    else {
        $httpHost = strtolower($_SERVER['HTTP_HOST']);
        $httpHost = (strpos($httpHost, 'www.supermicro') === false) ? "www.supermicro.com" : $httpHost;
        $form['#action'] = 'https://' . $httpHost . '/SearchToolkit/Search/Results.php';
        $form['#method'] = 'post';
        
        $form['Search'] = [
          '#type' => 'search',
          '#title' => 'Search',
          '#title_display' => 'invisible',
          '#size' => 15,
          '#default_value' => ''
        ];                 
    }
}
