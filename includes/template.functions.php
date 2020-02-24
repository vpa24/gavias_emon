<?php
function gavias_emon_preprocess_node(&$variables) {
  if ($variables['teaser'] || !empty($variables['content']['comments']['comment_form'])) {
    unset($variables['content']['links']['comment']['#links']['comment-add']);
  }
  if ($variables['node']->getType() == 'article') {
      $node = $variables['node'];
      $variables['comment_count'] = $node->get('comment')->comment_count;
      $post_format = 'standard';
      try{
         $field_post_format = $node->get('field_post_format');
         if(isset($field_post_format->value) && $field_post_format->value){
            $post_format = $field_post_format->value;
         }
      }catch(Exception $e){
         $post_format = 'standard';
      }

      $iframe = '';
      if($post_format == 'video' || $post_format == 'audio'){
         try{
            $field_post_embed = $node->get('field_post_embed');
            if(isset($field_post_embed->value) && $field_post_embed->value){
               $autoembed = new AutoEmbed();
               $iframe = $autoembed->parse($field_post_embed->value);
            }else{
               $iframe = '';
               $post_format = 'standard';
            }
         }
         catch(Exception $e){
            $post_format = 'standard';
         }
      }
      $variables['gva_iframe'] = $iframe;
      $variables['post_format'] = $post_format;

  }elseif($variables['node']->getType() == 'portfolio'){
    $iframe = '';
    $node = $variables['node'];
    try{
      $field_portfolio_embed = $node->get('field_portfolio_embed');
      if(isset($field_portfolio_embed->value) && $field_portfolio_embed->value){
        $autoembed = new AutoEmbed();
        $iframe = $autoembed->parse($field_portfolio_embed->value);
      }else{
        $iframe = '';
      }
    }
    catch(Exception $e){
       $iframe = '';
    }
    $variables['gva_iframe'] = $iframe;
  } elseif($variables['node']->getType() == 'landing2'){
        $language_mlg = getLanglinkParameter();
        $body = $variables['content']['body'][0]['#text'];
        $body=str_replace('{{langlink}}',$language_mlg,$body);
        $variables['content']['body'][0]['#text'] = $body;
  }

  $requestUri = \Drupal::request()->getRequestUri();
  $args = explode('/', $requestUri);
  $current_language = "";
  if(sizeof($args) > 1)
    $current_language = "/" . $args[1];

  $variables['language'] = $current_language;
  $transl_node = $variables['node']->getTranslation('en');
  $variables["en_node"] = $transl_node;
}

function gavias_emon_preprocess_field(&$variables, $hook) {
  $element = $variables['element'];  
}

function gavias_emon_preprocess_breadcrumb(&$variables){
  $variables['#cache']['max-age'] = 0;

  $request = \Drupal::request();
  $title = '';
  if ($route = $request->attributes->get(\Symfony\Cmf\Component\Routing\RouteObjectInterface::ROUTE_OBJECT)) {
    $title = \Drupal::service('title_resolver')->getTitle($request, $route);
  }

  if($variables['breadcrumb']){
     foreach ($variables['breadcrumb'] as $key => &$value) {
      if($value['text'] == 'Node'){
        unset($variables['breadcrumb'][$key]);
      }
    }

    if(($node = \Drupal::routeMatch()->getParameter('node')) && $variables['breadcrumb']){
      try{
        $field = $node->get('field_post_category');
        $field = $field->getValue();
         if( isset($field[0]['target_id']) && $field[0]['target_id'] ){
            $term = taxonomy_term_load($field[0]['target_id']);
            if($term){
              $variables['breadcrumb'][] = array(
                'text' => $term->get('name')->value,
                'url' => \Drupal::url('entity.taxonomy_term.canonical', array('taxonomy_term'=>$field[0]['target_id']))
              );
            }
         }

      }catch(Exception $e){

      }
    }

    if(!empty($title)){
      $variables['breadcrumb'][] = array(
          'text' => ''
      );
      $variables['breadcrumb'][] = array(
          'text' => $title
      );
    }
  }
}

/**
 * Implements hook_preprocess_HOOK() for block.html.twig.
 */
function gavias_emon_preprocess_block(&$variables) {
    // Add a clearfix class to system branding blocks.
    if ($variables['plugin_id'] == 'system_branding_block') {
        $variables['attributes']['class'][] = 'clearfix';
    }
    $blocks = array("gavias_emon_introfooter","topheaderblock","x11video","calltoaction","ourproducts","gavias_emon_contactinfo","gavias_emon_copyright","x11videoyoutube","x11videoyoutubemediaelementplayer","enterprisefooteraboutus", "enterprisefooternews", "enterprisefooterresources", "enterprisefooterconnectfollow", "enterprisefooteraboutusent.links");
    if (in_array($variables['elements']['#id'], $blocks)) {
        $language_mlg = getLanglinkParameter();
        $body = $variables['content']['body'][0]['#text'];
        $body=str_replace('{{langlink}}',$language_mlg,$body);
        $variables['content']['body'][0]['#text'] = $body;
    }
}


function gavias_emon_preprocess_paragraph(&$variables) {
  $variables['language'] = "/" . getLangCode();
  $variables['langlink'] = getLanglinkParameter();

  $parent = $variables['paragraph']->getParentEntity();
  if ($parent) {
    $variables['parenttype'] = $parent->bundle();
  }  
}


function gavias_emon_preprocess_paragraph__banner_slider(&$variables) {
    $index = 0;
    for ($i = 0; $i < sizeof($variables['elements']['field_banner']['#items']->referencedEntities()); $i++) {
        if ($variables['elements']['field_banner'][$i]['#paragraph']->field_hide_flag->getString() == '0') {
            $variables['elements']['field_banner'][$i]['#paragraph']->index = $index++;        
        }
    } 
}


function gavias_emon_preprocess_paragraph__product_selector_structureddb(&$variables) {
  $blockname = 'productnamingconventions';
  $block = \Drupal\block\Entity\Block::load($blockname);
  $block_content = \Drupal::entityTypeManager()->getViewBuilder('block')->view($block);
  $variables[$blockname] = $block_content;
}



function gavias_emon_preprocess_paragraph__thumbnail(&$variables) {
  $link = $variables['paragraph']->field_link->getString();
  $variables['link'] = str_replace('{{langlink}}', getLanglinkParameter(), $link);
}

function gavias_emon_preprocess_paragraph__banner_product(&$variables) {
  $link = $variables['paragraph']->field_product_link->getString();
  $link = str_replace('{{langlink}}', getLanglinkParameter(), $link);
  $link = str_replace('/{{langcode}}', $variables['language'], $link);
  $variables['link'] = $link;
}

function gavias_emon_preprocess_paragraph__quick_link(&$variables) {
  $link = $variables['paragraph']->field_link->getString();
  $link = str_replace('{{langlink}}', getLanglinkParameter(), $link);
  $link = str_replace('{{langcode}}', $variables['language'], $link);
  $variables['link'] = $link;
}

function gavias_emon_preprocess_paragraph__html(&$variables) {
  $body = $variables['content']['field_body'][0]['#text'];
  $body = str_replace('{{langlink}}', getLanglinkParameter(), $body);
  $body = str_replace('/{{langcode}}', $variables['language'], $body);
  $variables['content']['field_body'][0]['#text'] = $body;
}

function gavias_emon_preprocess_paragraph__hover_box(&$variables) {
  $body = $variables['content']['field_body'][0]['#text'];
  $body = str_replace('{{langlink}}', getLanglinkParameter(), $body);
  $body = str_replace('/{{langcode}}', $variables['language'], $body);
  $variables['content']['field_body'][0]['#text'] = $body;
}

function gavias_emon_preprocess_block__system_branding_block(&$variables) {
  $variables['langlink'] = getLanglinkParameter();
  $variables['enterprise_style'] = theme_get_setting('enterprise');  
}


function getLanglinkParameter() {
  $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
  $language_mlg = "?mlg=0";
  switch($language){
      case "zh-hant":
          $language_mlg = "?mlg=1";
          break;
      case "zh-hans":
          $language_mlg = "?mlg=2";
          break;
      case "ja":
          $language_mlg = "?mlg=3";
          break;
  }
  return $language_mlg;
}


function getLangCode() {
  $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
  switch($language){
      case "zh-hant":
          $language = "zh_tw";
          break;
      case "zh-hans":
          $language = "zh_cn";
          break;
  }
  return $language;
}