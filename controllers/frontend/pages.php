<?php
/***************************************************************************
*                                                                          *
*   (c) 2004 Vladimir V. Kalynyak, Alexey V. Vinokurov, Ilya M. Shalnev    *
*                                                                          *
* This  is  commercial  software,  only  users  who have purchased a valid *
* license  and  accept  to the terms of the  License Agreement can install *
* and use this program.                                                    *
*                                                                          *
****************************************************************************
* PLEASE READ THE FULL TEXT  OF THE SOFTWARE  LICENSE   AGREEMENT  IN  THE *
* "copyright.txt" FILE PROVIDED WITH THIS DISTRIBUTION PACKAGE.            *
****************************************************************************/

use Tygh\Registry;

if (!defined('BOOTSTRAP')) { die('Access denied'); }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    return;
}

//
// View page details
//
if ($mode == 'view') {
   // var_dump($_SESSION['auth']['user_id']);
    if(($_REQUEST['page_id']!=17) || ($_SESSION['auth']['user_id'])) { //if not my-form page or user logged in
        $_REQUEST['page_id'] = empty($_REQUEST['page_id']) ? 0 : $_REQUEST['page_id'];
        $preview = fn_is_preview_action($auth, $_REQUEST);
        $page = fn_get_page_data($_REQUEST['page_id'], CART_LANGUAGE, $preview);

        if (empty($page) || ($page['status'] == 'D' && !$preview)) {
            return array(CONTROLLER_STATUS_NO_PAGE);
        }

        if (!empty($page['meta_description']) || !empty($page['meta_keywords'])) {
            Registry::get('view')->assign('meta_description', $page['meta_description']);
            Registry::get('view')->assign('meta_keywords', $page['meta_keywords']);
        }

        // If page title for this page is exist than assign it to template
        if (!empty($page['page_title'])) {
            Registry::get('view')->assign('page_title', $page['page_title']);
        }

        $parent_ids = explode('/', $page['id_path']);
        foreach ($parent_ids as $p_id) {
            $_page = fn_get_page_data($p_id);
            fn_add_breadcrumb($_page['page'], ($p_id == $page['page_id']) ? '' : ($_page['page_type'] == PAGE_TYPE_LINK && !empty($_page['link']) ? $_page['link'] : "pages.view?page_id=$p_id"));
        }

        Registry::get('view')->assign('page', $page);
} else {
  //  echo 'you do not have acces to this page';
     if (empty($auth['user_id'])) {
        return array(CONTROLLER_STATUS_REDIRECT, "auth.login_form?return_url=".urlencode(Registry::get('config.current_url')));
    }
} 
} elseif ($mode == 'subscribe') { 
  //  echo 'test'; var_dump($_SESSION['test']);
  //  Registry::set('runtime.root_template', 'views/products/ls_subscribe_page.tpl');
}
//comparison list number for footer
$view->assign('comparison_list_no', count($_SESSION["comparison_list"]));
//get wishlist variable for footer
if (isset($_SESSION['wishlist'])) {
    $test_ses = $_SESSION['wishlist'];
   Registry::get('view')->assign('test_ses', $test_ses);
    $result = $_SESSION['wishlist'];
    $wishlistest = count($result['products']);
   Registry::get('view')->assign('wishlistest', $wishlistest);
} else {
   Registry::get('view')->assign('wishlistest', 0);
}
//wishlist products footer carousel
$_SESSION['wishlist'] = isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : array();
$wishlist = & $_SESSION['wishlist'];
$_SESSION['continue_url'] = isset($_SESSION['continue_url']) ? $_SESSION['continue_url'] : '';
$auth = & $_SESSION['auth'];
//view products
$wishlistProductsIds = array();
$products_footer = !empty($wishlist['products']) ? $wishlist['products'] : array();
$extra_products = array();
$wishlist_is_empty = fn_cart_is_empty($wishlist);
if (!empty($products_footer)) {
    foreach ($products_footer as $k => $v) {
        $wishlistProductsIds[$k] = $v['product_id'];
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
        /* $products_footer[$k]['product_options'] = fn_get_selected_product_options($v['product_id'], $v['product_options'], CART_LANGUAGE);
          $products_footer[$k]['price'] = fn_apply_options_modifiers($v['product_options'], $products_footer[$k]['price'], 'P'); */
        if (!empty($products_footer[$k]['extra']['parent'])) {
            $extra_products[$k] = $products_footer[$k];
            unset($products_footer[$k]);
            continue;
        }
    }
}

fn_gather_additional_products_data($products_footer, array('get_icon' => true, 'get_detailed' => true, 'get_options' => true, 'get_discounts' => true));

//$view->assign('show_qty', true);
$view->assign('wishlist_products_ids', $wishlistProductsIds);
$view->assign('products_footer', $products_footer);