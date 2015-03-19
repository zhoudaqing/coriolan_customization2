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
//var_dump($_SESSION['cart']['products'][3906556690]);
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
            echo '<li onclick="ls_search_set_item(\''.str_replace("'", "\'", $category_name).'\')">'."<a href='$category_url' class='ls_autocomplete_link'>$thumbnail<span class='ls_autocomplete_product_name'><b>".$category_name." #</span></b></a></li>";
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
        echo '<li onclick="ls_search_set_item(\''.str_replace("'", "\'", $product_name).'\')">'."<a href='$product_url' class='ls_autocomplete_link'>$thumbnail<span class='ls_autocomplete_product_name'>".$product_name_emphasis.'</span></a></li>';
       } 
   exit;
}  elseif ($mode == 'ls_add_cart_product') { //add product details to cart
    //generate markup 
   $markup='';
   $cart_products = array_reverse($_SESSION['cart']['products'], true);
    foreach ($cart_products as $hash => $cart_product) {
        $markup = $markup . ls_minicart_generate_markup($cart_product, $hash);
    }
    $response['markup']=$markup;
 //  $response['hash']=$main_hash;
 //  $response['markup']="<li>test</li>";
 // $response['hash']=999;
   echo json_encode($response);
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
