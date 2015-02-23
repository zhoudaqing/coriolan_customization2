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

$view->assign('wish_session', $_SESSION['wishlist']);

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
if ($mode == 'deleteFooter') {

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
                //  foreach ($v1 as $k2 => $v2) {
                if (multi_array_search($add_fav_id, $v1)) {
                    array_push($found, $k1);
                }
                //    }
            }
        }
        //get the image url of the last added product tofavorites
        // $products_footer=ls_get_fav_data();
        // $ls_fav_product['image_path']=end(ls_search_value_last($products_footer,'image_path'));
        // $ls_fav_product['image_path']='http://coriolan.leadsoft.eu/images/thumbnails/150/150/detailed/1/dr002.jpg';
        $ls_fav_product['footerFavId2'] = end($found);
        //  $ls_fav_product['footerFavId2']='274934320';
        //return json
        //  echo json_encode($ls_fav_product);

        echo end($found);
        exit;
        // Generate wishlist id - not working with all the products

        /*   if (!isset($data['product_options'])) {
          $data['product_options'] = fn_get_default_product_options($add_fav_id,true);
          }
          $data['extra']['product_options'] = $data['product_options'];
          $_id = fn_generate_cart_id($add_fav_id, $data['extra']);
          $_data = db_get_row('SELECT is_edp, options_type, tracking FROM ?:products WHERE product_id = ?i', $add_fav_id);
          $data['is_edp'] = $_data['is_edp'];
          $data['options_type'] = $_data['options_type'];
          $data['tracking'] = $_data['tracking'];
          echo $_id; */
        //Generate wishlist id - more complete code
        //  $product_ids = fn_add_product_to_wishlist($_REQUEST['product_data'], $wishlist, $auth);
        //    $product_ids = fn_add_product_to_wishlist($add_fav_id, $wishlist, $auth);
        /*  echo $product_ids;
          function fn_add_product_to_wishlist($product_data, &$wishlist, &$auth) {
          // Check if products have cusom images
          list($product_data, $wishlist) = fn_add_product_options_files($product_data, $wishlist, $auth, false, 'wishlist');

          fn_set_hook('pre_add_to_wishlist', $product_data, $wishlist, $auth);

          if (!empty($product_data) && is_array($product_data)) {
          $wishlist_ids = array();
          foreach ($product_data as $product_id => $data) {
          if (empty($data['amount'])) {
          $data['amount'] = 1;
          }
          if (!empty($data['product_id'])) {
          $product_id = $data['product_id'];
          }

          if (empty($data['extra'])) {
          $data['extra'] = array();
          }

          // Add one product
          if (!isset($data['product_options'])) {
          $data['product_options'] = fn_get_default_product_options($product_id);
          }

          // Generate wishlist id
          $data['extra']['product_options'] = $data['product_options'];
          $_id = fn_generate_cart_id($product_id, $data['extra']);

          $_data = db_get_row('SELECT is_edp, options_type, tracking FROM ?:products WHERE product_id = ?i', $product_id);
          $data['is_edp'] = $_data['is_edp'];
          $data['options_type'] = $_data['options_type'];
          $data['tracking'] = $_data['tracking'];

          // Check the sequential options
          if (!empty($data['tracking']) && $data['tracking'] == 'O' && $data['options_type'] == 'S') {
          $inventory_options = db_get_fields("SELECT a.option_id FROM ?:product_options as a LEFT JOIN ?:product_global_option_links as c ON c.option_id = a.option_id WHERE (a.product_id = ?i OR c.product_id = ?i) AND a.status = 'A' AND a.inventory = 'Y'", $product_id, $product_id);

          $sequential_completed = true;
          if (!empty($inventory_options)) {
          foreach ($inventory_options as $option_id) {
          if (!isset($data['product_options'][$option_id]) || empty($data['product_options'][$option_id])) {
          $sequential_completed = false;
          break;
          }
          }
          }

          if (!$sequential_completed) {
          fn_set_notification('E', __('error'), __('select_all_product_options'));
          // Even if customer tried to add the product from the catalog page, we will redirect he/she to the detailed product page to give an ability to complete a purchase
          $redirect_url = fn_url('products.view?product_id=' . $product_id . '&combination=' . fn_get_options_combination($data['product_options']));
          $_REQUEST['redirect_url'] = $redirect_url; //FIXME: Very very very BAD style to use the global variables in the functions!!!

          return false;
          }
          }

          $wishlist_ids[] = $_id;
          $wishlist['products'][$_id]['product_id'] = $product_id;
          $wishlist['products'][$_id]['product_options'] = $data['product_options'];
          $wishlist['products'][$_id]['extra'] = $data['extra'];
          $wishlist['products'][$_id]['amount'] = $data['amount'];
          }

          return $wishlist_ids;
          } else {
          return false;
          }
          } */
    } else {
        echo 'id not set';
    }
    exit;
} elseif ($mode == 'updateCartNo') {
    // echo var_dump($_SESSION[cart][products]);
    $ammount = 0;
    foreach ($_SESSION[cart][products] as $k0 => $v0) {
        $ammount = $ammount + $v0['amount'];
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
   //comparison list number for footer
   //echo '<li onclick="ls_search_set_item(\'product 1\')">product 1 </li><li  onclick="ls_search_set_item(\'product 2\')">product 2 </li>';
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
