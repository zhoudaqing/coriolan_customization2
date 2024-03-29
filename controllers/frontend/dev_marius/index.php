<?php

/* * *************************************************************************
 *                                                                          *
 *   (c) 2004 Vladimir V. Kalynyak, Alexey V. Vinokurov, Ilya M. Shalnev    *
 *                                                                          *
 * This  is  commercial  software,  only  users  who have purchased a valid *
 * license  and  accept  to the terms of the  License Agreement can install *
 * and use this program.                                                    *
 *                                                                          *
 * ***************************************************************************
 * PLEASE READ THE FULL TEXT  OF THE SOFTWARE  LICENSE   AGREEMENT  IN  THE *
 * "copyright.txt" FILE PROVIDED WITH THIS DISTRIBUTION PACKAGE.            *
 * ************************************************************************** */

if (!defined('BOOTSTRAP')) {
    die('Access denied');
}

//
// Forbid posts to index script
//get wishlist variable for footer
if (isset($_SESSION['wishlist'])) {
    $result = $_SESSION['wishlist'];
    $wishlistest = count($result['products']);
    $view->assign('wishlistest', $wishlistest);
    $view->assign('ajaxproduct', $result);
} else {
    $view->assign('wishlistest', 0);
}
//vars for move to cart/wishlist 
$_SESSION['wishlist'] = isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : array();
$wishlist = & $_SESSION['wishlist'];
$_SESSION['continue_url'] = isset($_SESSION['continue_url']) ? $_SESSION['continue_url'] : '';
$auth = & $_SESSION['auth'];
$cart = & $_SESSION['cart'];

$view->assign('wish_session', $_SESSION['wishlist']);
/*
echo 'cart product';
var_dump($_SESSION['cart']['products'][4006127599]['extra']);
echo ';<br> session product';
var_dump($_SESSION['wishlist']['products'][4006127599]); */ 
//var_dump($_SESSION['settings']);
function ls_get_fav_data() {
//wishlist products footer carousel
    $_SESSION['wishlist'] = isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : array();
    $wishlist = & $_SESSION['wishlist'];
    $_SESSION['continue_url'] = 'http://coriolan.leadsoft.eu/';
    $auth = & $_SESSION['auth'];
    //view products

    $products_footer = !empty($wishlist['products']) ? $wishlist['products'] : array();
    $extra_products = array();
    $wishlist_is_empty = fn_cart_is_empty($wishlist);
    if (!empty($products_footer)) {
        foreach ($products_footer as $k => $v) {
            $_options = array();
            $extra = $v['extra'];
            if (!empty($v['product_options'])) {
                $_options = $v['product_options'];
            }
            $products_footer[$k] = fn_get_product_data($v['product_id'], $auth, CART_LANGUAGE, '', true, true, true, false, false, true, false, true);

            if (empty($products_footer[$k])) {
                unset($products_footer[$k], $wishlist['products'][$k]);
                continue;
            }
            $products_footer[$k]['extra'] = empty($products_footer[$k]['extra']) ? array() : $products_footer[$k]['extra'];
            $products_footer[$k]['extra'] = array_merge($products_footer[$k]['extra'], $extra);

            if (isset($products_footer[$k]['extra']['product_options']) || $_options) {
                $products_footer[$k]['selected_options'] = empty($products_footer[$k]['extra']['product_options']) ? $_options : $products_footer[$k]['extra']['product_options'];
            }

            if (!empty($products_footer[$k]['selected_options'])) {
                $options = fn_get_selected_product_options($v['product_id'], $v['product_options'], CART_LANGUAGE);
                foreach ($products_footer[$k]['selected_options'] as $option_id => $variant_id) {
                    foreach ($options as $option) {
                        if ($option['option_id'] == $option_id && !in_array($option['option_type'], array('I', 'T', 'F')) && empty($variant_id)) {
                            $products_footer[$k]['changed_option'] = $option_id;
                            break 2;
                        }
                    }
                }
            }
            $products_footer[$k]['display_subtotal'] = $products_footer[$k]['price'] * $v['amount'];
            $products_footer[$k]['display_amount'] = $v['amount'];
            $products_footer[$k]['cart_id'] = $k;
            if (!empty($products_footer[$k]['extra']['parent'])) {
                $extra_products[$k] = $products_footer[$k];
                unset($products_footer[$k]);
                continue;
            }
        }
    }

    fn_gather_additional_products_data($products_footer, array('get_icon' => true, 'get_detailed' => true, 'get_options' => true, 'get_discounts' => true));
    return $products_footer;
}

$products_footer = ls_get_fav_data();
$view->assign('show_qty', true);
$view->assign('products_footer', $products_footer);
$view->assign('test_var', $_SESSION[cart]);

//delete favorite product   
if ($mode == 'ls_deleteFavProduct') {

    /*  if (!empty($wishlist['products'][$wishlist_id]['extra']['configuration'])) {
      foreach ($wishlist['products'] as $key => $item) {
      if (!empty($item['extra']['parent']['configuration']) && $item['extra']['parent']['configuration'] == $wishlist_id) {
      unset($wishlist['products'][$key]);
      }
      }
      } */
    /*  $footerFavId=ls_sanitizeString($footerFavId).'99'; */
    //  array_push($_SESSION['wishlist']['products'],$footerFavId);
    if (isset($_REQUEST['footerFavId'])) {
        $id = $_REQUEST['footerFavId'];
        $wishlist = & $_SESSION['wishlist'];
        if (isset($wishlist['products'][$id])) {
            unset($_SESSION['wishlist']['products'][$id]);
            //  unset($wishlist['products'][$id]);
            echo 'session element unset with the id ' . $id;
        } else {
            echo "wishlist['products'][$id] doesnt exist";
        }
    } else {
        echo 'id not set';
    }
    exit;
} elseif ($mode == 'getCartId') { //get the id required to delete the product from wishlist
    if (isset($_REQUEST['ls_productId'])) {   //the id used to add the product to wishlist
        $add_fav_id = $_REQUEST['ls_productId'];
        $wishlist = & $_SESSION['wishlist'];
        $found = array();
        //get the required id hash from session based on product_id
        foreach ($wishlist as $k0 => $v0) {
            foreach ($v0 as $k1 => $v1) {
                if (multi_array_search($add_fav_id, $v1)) {
                    array_push($found, $k1);
                }
            }
        }
        $ls_fav_product['footerFavId2'] = end($found);

        echo end($found);
        exit;

    } else {
        echo 'id not set';
    }
    exit;
} elseif ($mode == 'updateCartNo') {
    // echo var_dump($_SESSION[cart][products]);
    $ammount = 0;
    foreach ($_SESSION[cart][products] as $k0 => $v0) {
        if (isset($v0["amount_total"])) {
            $ammount = $ammount + $v0['amount'];
        }
    }
    $response['ammount'] = $ammount;
    //$response['subtotal']=$_SESSION[cart]["subtotal"];
    $ls_subtotal = $_SESSION[cart]["subtotal"]; //get the subtotal of the primary currency
    //format the subtotal acording to the selected currency
    $ls_subtotal = fn_format_price_by_currency($ls_subtotal);
    $response['subtotal'] = $ls_subtotal;
    echo json_encode($response);
    exit;
} elseif ($mode == 'lsAvailableProducts') { 
    $product_id=$_REQUEST['product_id']; 
    $combination_hash=$_REQUEST['combination_hash']; 
    $ls_deleted_product = db_get_array("SELECT cscart_products.amount, cscart_products.tracking, 
        cscart_product_options_inventory.amount AS inventory_amount FROM cscart_products
        JOIN cscart_product_options_inventory ON cscart_products.product_id=cscart_product_options_inventory.product_id WHERE
        cscart_products.product_id = ?i AND cscart_product_options_inventory.combination_hash = ?i
     ", $product_id, $combination_hash);
    
    if($ls_deleted_product[0]['tracking']==='O') {
        $available_products=$ls_deleted_product[0]['inventory_amount'];
    } elseif($ls_deleted_product[0]['tracking']==='B') {
        $available_products=$ls_deleted_product[0]['amount'];
    } else { //no tracking, don't display any availability message
        $available_products='no tracking';
    } 
    $response['amount'] = $available_products; 
    echo json_encode($response);
    exit;
} elseif ($mode == 'ls_checkCompareNo') { 
   //comparison list number for footer
   echo count($_SESSION["comparison_list"]);
   exit;
} elseif ($mode == 'ls_search_autocomplete') {
    $base_url=fn_ls_get_base_url();
    $params = $_REQUEST;
    $no_of_results=8;
    list($products, $search) = fn_get_products($params, $no_of_results);
    //get products relative path
    fn_gather_additional_products_data($products, array('get_icon' => true, 'get_detailed' => true, 'get_additional' => true, 'get_options' => true));
    $max_results=3;
    $autocomplete_categories=fn_ls_autocomplete_categories($params['q'],$max_results);
   /* if(!empty($autocomplete_categories)){
        $products=array_unshift($products,$autocomplete_categories);
    }
    $products=array_slice($products, 0, $no_of_results); */
    //display the categories
    foreach($autocomplete_categories as $k=>$result) {
        foreach($result as $category) {
           $category_name=$category['category'];
           $category_id=$category['cid'];
           //add thumbnail path to categories
           $image_relative_path='';
           $thumbnail_path='';
           $image_relative_path = fn_get_image_pairs($category['cid'], 'category', 'M', true, true, CART_LANGUAGE);
           $image_relative_path=$image_relative_path['detailed']['relative_path'];
           $thumbnail_path=fn_generate_thumbnail($image_relative_path, 35, 49, false);
           $thumbnail="<image src='{$thumbnail_path}' width='35' height='49' class='ls_autocomplete_image'>";
           if(!$thumbnail_path) {
               $thumbnail='<span class="ty-no-image ls_autocomplete_no_image"><i class="ty-no-image__icon ty-icon-image" title="No image"></i></span>';
           }
           $category_url=$base_url."?dispatch=categories.view?category_id={$category_id}";
           // add new option
            $response['markup'].= '<li onclick="ls_search_set_item(\''.str_replace("'", "\'", $category_name).'\')">'."<a href='$category_url' class='ls_autocomplete_link'>$thumbnail<span class='ls_autocomplete_product_name'><b>".$category_name." #</span></b></a></li>";
        }
    }
    //display the products
    foreach ($products as $k0=>$product) {
       $image_relative_path='';
       $thumbnail_path='';
       $product_name=$product['product'];
       $product_url=$base_url."?dispatch=products.view?product_id={$product['product_id']}";
       // put in bold the written text - does not work with diferrent caps words
     //  $product_name_emphasis = str_replace($_POST['q'], '<b>'.$_POST['q'].'</b>', $product_name);
       $product_name_emphasis=$product_name;
       //get the image path
       foreach($product['image_pairs'] as $k1=>$image_pair) {
           if(isset($image_pair['detailed']['relative_path'])) {
             //  $image_path=$image_pair['detailed']['image_path']; //absolute path
               $image_relative_path=$image_pair['detailed']['relative_path'];
               $thumbnail_path=fn_generate_thumbnail($image_relative_path, 35, 49, false);
               break;
           }
       }
       $thumbnail="<image src='{$thumbnail_path}' width='35' height='49' class='ls_autocomplete_image'>";
        if (!$thumbnail_path) {
            $thumbnail = '<span class="ty-no-image ls_autocomplete_no_image"><i class="ty-no-image__icon ty-icon-image" title="No image"></i></span>';
        }
        // add new option
        $response['markup'].= '<li onclick="ls_search_set_item(\''.str_replace("'", "\'", $product_name).'\')">'."<a href='$product_url' class='ls_autocomplete_link'>$thumbnail<span class='ls_autocomplete_product_name'>".$product_name_emphasis.'</span></a></li>';
       } 
       $response['markup'].='<span style="display: none" id="ls_autocomplete_counter">'.$_REQUEST['ls_counter'].'</span>';
       $response['ls_counter']=$_REQUEST['ls_counter'];
       echo json_encode($response);
       exit;
}  elseif ($mode == 'ls_add_cart_product') { //add product details to cart
   $markup='';
   $cart_products = array_reverse($_SESSION['cart']['products'], true);
    foreach ($cart_products as $hash => $cart_product) {
        if($cart_product['price']!=0) {
            //generate markup 
            $markup = $markup . ls_minicart_generate_markup($cart_product, $hash);
        }
    }
   $response['markup']=$markup;
   echo json_encode($response);
   exit;
} elseif ($mode == 'ls_move_product') { //move product between cart and wishlist
    if($_REQUEST['ls_move_to']=='cart') { 
     /*    if (empty($auth['user_id']) && Registry::get('settings.General.allow_anonymous_shopping') != 'allow_shopping') {
            return array(CONTROLLER_STATUS_REDIRECT, "auth.login_form?return_url=" . urlencode($_REQUEST['return_url']));
        } */
         if (!empty($dispatch_extra)) {
            if (empty($_REQUEST['product_data'][$dispatch_extra]['amount'])) {
                $_REQUEST['product_data'][$dispatch_extra]['amount'] = 1;
            }
            foreach ($_REQUEST['product_data'] as $key => $data) {
                if ($key != $dispatch_extra && $key != 'custom_files') {
                    unset($_REQUEST['product_data'][$key]);
                }
            }
        } 
        
        $prev_cart_products = empty($cart['products']) ? array() : $cart['products'];

        fn_add_product_to_cart($_REQUEST['product_data'], $cart, $auth);

        fn_save_cart_content($cart, $auth['user_id']);

        $previous_state = md5(serialize($cart['products']));
        $cart['change_cart_products'] = true;
        fn_calculate_cart_content($cart, $auth, 'S', true, 'F', true); 
        if (md5(serialize($cart['products'])) != $previous_state && empty($cart['skip_notification'])) {
            $product_cnt = 0;
            $added_products = array();
            foreach ($cart['products'] as $key => $data) {
                if (empty($prev_cart_products[$key]) || !empty($prev_cart_products[$key]) && $prev_cart_products[$key]['amount'] != $data['amount']) {
                    $added_products[$key] = $data;
                    $added_products[$key]['product_option_data'] = fn_get_selected_product_options_info($data['product_options']);

                    if (!empty($prev_cart_products[$key])) {
                        $added_products[$key]['amount'] = $data['amount'] - $prev_cart_products[$key]['amount'];
                    }
                    $product_cnt += $added_products[$key]['amount'];
                }
            }

            if (!empty($added_products)) {
                Registry::get('view')->assign('added_products', $added_products);
                if (Registry::get('config.tweaks.disable_dhtml') && Registry::get('config.tweaks.redirect_to_cart')) {
                    Registry::get('view')->assign('continue_url', (!empty($_REQUEST['redirect_url']) && empty($_REQUEST['appearance']['details_page'])) ? $_REQUEST['redirect_url'] : $_SESSION['continue_url']);
                }

                $msg = Registry::get('view')->fetch('views/checkout/components/product_notification.tpl');
                fn_set_notification('I', __($product_cnt > 1 ? 'products_added_to_cart' : 'product_added_to_cart'), $msg, 'I');
                $cart['recalculate'] = true;
            } else {
                fn_set_notification('N', __('notice'), __('product_in_cart'));
            }
        }
     
        unset($cart['skip_notification']);

        $_suffix = '.cart'; 
  /*
        if (Registry::get('config.tweaks.disable_dhtml') && Registry::get('config.tweaks.redirect_to_cart') && !defined('AJAX_REQUEST')) {
            if (!empty($_REQUEST['redirect_url']) && empty($_REQUEST['appearance']['details_page'])) {
                $_SESSION['continue_url'] = fn_url_remove_service_params($_REQUEST['redirect_url']);
            }
            unset($_REQUEST['redirect_url']);
        } */
        //unset product from session wishlist array
        unset($_SESSION['wishlist']['products'][$_REQUEST['ls_cart_combination_hash']]);
        
    } elseif ($_REQUEST['ls_move_to']=='wishlist') {
       /* foreach($_SESSION['cart']['products'] as $hash=>$product) {
            if($hash==$_REQUEST['ls_cart_combination_hash']) {
                //check for hash colision
                if($product['product_id']==$_REQUEST['ls_cart_combination_id']) {
               //copy all the product data from session cart to session wishlist
                  $_SESSION['wishlist']['products'][$hash]['product_id'] =$product['product_id'];
                  $_SESSION['wishlist']['products'][$hash]['product_options'] =$product['product_options'];
                  $_SESSION['wishlist']['products'][$hash]['amount'] =$product['amount'];
                  $_SESSION['wishlist']['products'][$hash]['extra'] =$product['extra'];
              //unset product from session cart array
                    //  unset($_SESSION['cart']['products'][$hash]);
                    //delete the cart product
                    $cart = & $_SESSION['cart'];
                    fn_delete_cart_product($cart, $hash);

                    if (fn_cart_is_empty($cart) == true) {
                        fn_clear_cart($cart);
                    }

                    fn_save_cart_content($cart, $_SESSION['settings']['cu_id']['value']);

                    $cart['recalculate'] = true;
                    fn_calculate_cart_content($cart, $auth, 'A', true, 'F', true);
                    //update the database
                    //       $data = array ('type' => 'W');
            //  db_query('UPDATE ?:user_session_products SET ?u WHERE user_id = ?i AND item_id = ?i AND product_id = ?i', $data, $_SESSION['settings']['cu_id']['value'], $hash, $product['product_id']);  
                 //   echo 1;
                }
                
            }
        } */ 
        

        // wishlist is empty, create it
        if (empty($wishlist)) {
            $wishlist = array(
                'products' => array()
            );
        }
   
        $prev_wishlist = $wishlist['products'];

       $product_ids = fn_ls_add_product_to_wishlist($_REQUEST['product_data'], $wishlist, $auth);
/*
        fn_save_cart_content($wishlist, $auth['user_id'], 'W');

        $added_products = array_diff_assoc($wishlist['products'], $prev_wishlist); 
         if (!empty($added_products)) {
                foreach ($added_products as $key => $data) {
                    $product = fn_get_product_data($data['product_id'], $auth);
                    $product['extra'] = !empty($data['extra']) ? $data['extra'] : array();
                    fn_gather_additional_product_data($product, true, true);
                    $added_products[$key]['product_option_data'] = fn_get_selected_product_options_info($data['product_options']);
                    $added_products[$key]['display_price'] = $product['price'];
                    $added_products[$key]['amount'] = empty($data['amount']) ? 1 : $data['amount'];
                    $added_products[$key]['main_pair'] = fn_get_cart_product_icon($data['product_id'], $data);
                }
                Registry::get('view')->assign('added_products', $added_products);

                if (Registry::get('settings.General.allow_anonymous_shopping') == 'hide_price_and_add_to_cart') {
                    Registry::get('view')->assign('hide_amount', true);
                }

                $title = __('product_added_to_wl');
                $msg = Registry::get('view')->fetch('addons/wishlist/views/wishlist/components/product_notification.tpl');
                fn_set_notification('I', $title, $msg, 'I');
            } else {
                if ($product_ids) {
                    fn_set_notification('W', __('notice'), __('product_in_wishlist'));
                }
            }
            
            $product_ids = fn_add_product_to_wishlist($_REQUEST['product_data'], $wishlist, $auth);
            fn_save_cart_content($wishlist, $auth['user_id'], 'W'); */
        //delete the cart product
        fn_delete_cart_product($cart, $_REQUEST['ls_cart_combination_hash']);

        if (fn_cart_is_empty($cart) == true) {
            fn_clear_cart($cart);
        }

        fn_save_cart_content($cart, $_SESSION['settings']['cu_id']['value']);

        $cart['recalculate'] = true;
        fn_calculate_cart_content($cart, $auth, 'A', true, 'F', true);
    } else {
     //   echo 'bad request';
    }
    exit;
}  elseif ($mode == 'ls_generate_wishlist_markup') { 
    $base_url=fn_ls_get_base_url();
    //changed parameters correction
    $_REQUEST['ls_productId']=reset(array_keys($_REQUEST['product_data']));
    $_REQUEST['current_url']= $_REQUEST["redirect_url"];
    $_REQUEST['ls_cart_combination_hash']=$_REQUEST['ls_product_combination_hash'];
   
    //get thumbnail path
   //  $image_relative_path = fn_get_image_pairs($_REQUEST['ls_productId'], 'product', 'M', true, true, CART_LANGUAGE);
   //  $image_relative_path=$image_relative_path['detailed']['relative_path'];
      $image_relative_path = fn_get_cart_product_icon($_REQUEST['ls_productId'], $_REQUEST['product_data'][$_REQUEST['ls_productId']],true);
      $image_relative_path=$image_relative_path['detailed']['relative_path'];
     $thumbnail_path=fn_generate_thumbnail($image_relative_path, 118, null, false);
     if(!empty($thumbnail_path)) {
     $fav_product_img="<img class='ty-pict' src='{$thumbnail_path}'>";
     } else {
      $fav_product_img= "<span class='ty-no-image' style='min-width: 118px; min-height: 165px;'><i class='ty-no-image__icon ty-icon-image'></i></span>";  
     }
      $wishlist = & $_SESSION['wishlist'];
        $found = array();
        //get the required id hash from session based on product_id
        foreach ($wishlist as $k0 => $v0) {
            foreach ($v0 as $k1 => $v1) {
                if (multi_array_search($_REQUEST['ls_productId'], $v1)) {
                    $footerFavId2=$k1;
                    $product_options=$v1['product_options'];
                }
            }
        } 
    $append_product = "<span style='display: none' class='ls_cart_combination_hash'>{$footerFavId2}</span>";
    //add product details markup
    $ls_product_url = "<a href='{$base_url}/?dispatch=products.view?product_id={$_REQUEST['ls_productId']}&wishlist_id={$footerFavId2}'>{$fav_product_img}</a>";
    $append_product = $append_product.'<div class="ty-twishlist-item testmulticolumnpre"><a href="http://coriolan.leadsoft.eu/index.php?dispatch=wishlist.delete&cart_id='.$footerFavId2.'" class="ty-twishlist-item__remove ty-remove" title="inlaturati"><i class="ty-remove__icon ty-icon-cancel-circle"></i></a></div><div class="ty-grid-list__image testgridlistfooter2">'.
                        $ls_product_url.'</div>';
     //add form for moving to cart markup
    $append_product = $append_product."<form action='".fn_ls_get_base_url()."' method='post' name='product_form_{$_REQUEST['ls_productId']}' enctype='multipart/form-data' class='cm-disable-empty-files  cm-ajax cm-ajax-full-render cm-ajax-status-middle  cm-processed-form' target='_self'>";
        //generate product options input markup
    foreach($product_options as $option_id=>$value) {
       $append_product = $append_product."<input type='hidden' name='product_data[{$_REQUEST['ls_productId']}][product_options][{$option_id}]' value='{$value}'>";
    }
        //add other inputs
    $append_product = $append_product."<input type='hidden' name='result_ids' value='cart_status*,wish_list*,checkout*,account_info*'>"
            ."<input type='hidden' name='ls_move_to' value='cart'>"
            ."<input type='hidden' name='ls_cart_combination_hash' value='{$_REQUEST['ls_cart_combination_hash']}'>"
            . "<input type='hidden' name='redirect_url' value='".$_REQUEST['current_url']."'>"
            . "<input type='hidden' name='product_data[{$_REQUEST['ls_productId']}][product_id]' value='{$_REQUEST['ls_productId']}'><input type='hidden' name='appearance[show_product_options]' value='1'>
                                <input type='hidden' name='appearance[details_page]' value='1'>
                                <input type='hidden' name='additional_info[info_type]' value='D'>
                                <input type='hidden' name='additional_info[get_icon]' value='1'>
                                <input type='hidden' name='additional_info[get_detailed]' value='1'>
                                <input type='hidden' name='additional_info[get_additional]' value=''>
                                <input type='hidden' name='additional_info[get_options]' value='1'>
                                <input type='hidden' name='additional_info[get_discounts]' value='1'>
                                <input type='hidden' name='additional_info[get_features]' value=''>
                                <input type='hidden' name='additional_info[get_extra]' value=''>
                                <input type='hidden' name='additional_info[get_taxed_prices]' value='1'>
                                <input type='hidden' name='additional_info[get_for_one_product]' value='1'>
                                <input type='hidden' name='additional_info[detailed_params]' value='1'>
                                <input type='hidden' name='additional_info[features_display_on]' value='C'>
                                <input type='hidden' name='appearance[show_add_to_cart]' value='1'>
                                <input type='hidden' name='appearance[separate_buttons]' value='1'>
                                <input type='hidden' name='appearance[show_list_buttons]' value='1'>
                                <input type='hidden' name='appearance[but_role]' value='big'>
                                <input type='hidden' name='appearance[quick_view]' value=''>
                                <input type='hidden' name='full_render' value='Y'>
                                <input type='hidden' name='dispatch[checkout.add..{$_REQUEST['ls_productId']}]' value=''>
            <span class='ls_move_to_cart'><img class='ls_move_to_cart' src='../../../../../../../../design/themes/responsive/media/images/images/move_to_cart.png'></span>
            </form>";
  //  $append_product['$append_product'] = $append_product; 
  //  echo json_encode($append_product);
      echo $append_product;
    exit;
} elseif ($mode == 'ls_recently_viewed_name') {
    $result=db_get_array("SELECT * FROM ?:bm_blocks_descriptions WHERE block_id=25 AND (?:bm_blocks_descriptions.lang_code='en' OR ?:bm_blocks_descriptions.lang_code='ro') ORDER BY lang_code");
    foreach($result as $row=>$arr){
        if($arr["lang_code"]=='en'){
            $response['en']=$arr["name"];
        }
        if($arr["lang_code"]=='ro'){
            $response['ro']=$arr["name"];
        }
    }
    echo json_encode($response);
    echo $response;
    exit;
}

function ls_sanitizeString($var) {
    $var = strip_tags($var);
    $var = htmlentities($var);
    $var = stripslashes($var);
    return $var;
}

function multi_array_search($search_for, $search_in) {
    foreach ($search_in as $element) {
        if (($element == $search_for) || (is_array($element) && multi_array_search($search_for, $element))) {
            return true;
        }
    }
    return false;
}

function ls_search_value_last($array, $key) {
    $results = array();

    if (is_array($array)) {
        if (isset($array[$key])) {
            $results[] = $array[$key];
        }

        foreach ($array as $subarray) {
            $results = array_merge($results, ls_search_value_last($subarray, $key));
        }
    }

    return $results;
}
