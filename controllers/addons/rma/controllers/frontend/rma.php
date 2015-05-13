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

if (empty($auth['user_id']) && empty($auth['order_ids'])) {
    return array(CONTROLLER_STATUS_REDIRECT, "auth.login_form?return_url=" . urlencode(Registry::get('config.current_url')));
}
//comparison list number for footer
$view->assign('comparison_list_no', count($_SESSION["comparison_list"]));
Registry::get('view')->assign('wishlistest', fn_ls_wishlist_products_number());
list($wishlistProductsIds,$products_footer)=fn_ls_wishlist_products_footer();
$view->assign('wishlist_products_ids', $wishlistProductsIds);
$view->assign('products_footer', $products_footer);
