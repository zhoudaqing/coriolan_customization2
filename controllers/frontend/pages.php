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
    // if (empty($auth['user_id'])) {
        return array(CONTROLLER_STATUS_REDIRECT, "auth.login_form?return_url=".urlencode(Registry::get('config.current_url')));
  //  }
} 
} elseif ($mode == 'subscribe') { 
  //  echo 'test'; var_dump($_SESSION['test']);
  //  Registry::set('runtime.root_template', 'views/products/ls_subscribe_page.tpl');
}
//comparison list number for footer
$view->assign('comparison_list_no', count($_SESSION["comparison_list"]));
//get the number of products added in wishlist
Registry::get('view')->assign('wishlistest', fn_ls_wishlist_products_number());
list($wishlistProductsIds,$products_footer)=fn_ls_wishlist_products_footer();
$view->assign('wishlist_products_ids', $wishlistProductsIds);
$view->assign('products_footer', $products_footer);