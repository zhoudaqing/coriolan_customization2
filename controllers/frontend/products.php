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

use Tygh\Registry;
use Tygh\BlockManager\ProductTabs;

if (!defined('BOOTSTRAP')) {
    die('Access denied');
}

//
// Search products
//
if ($mode == 'search') {

    $params = $_REQUEST;

    if (!empty($params['search_performed']) || !empty($params['features_hash'])) {

        fn_add_breadcrumb(__('advanced_search'), "products.search" . (!empty($_REQUEST['advanced_filter']) ? '?advanced_filter=Y' : ''));
        fn_add_breadcrumb(__('search_results'));
        $params = $_REQUEST;
        $params['extend'] = array('description');
        list($products, $search) = fn_get_products($params, Registry::get('settings.Appearance.products_per_page'));

        fn_gather_additional_products_data($products, array('get_icon' => true, 'get_detailed' => true, 'get_additional' => true, 'get_options' => true));

        if (!empty($products)) {
            $_SESSION['continue_url'] = Registry::get('config.current_url');
        }

        $selected_layout = fn_get_products_layout($params);

        Registry::get('view')->assign('products', $products);
        Registry::get('view')->assign('search', $search);
        Registry::get('view')->assign('selected_layout', $selected_layout);
    } else {
        fn_add_breadcrumb(__('advanced_search'));
    }

    if (!empty($params['advanced_filter'])) {
        $params['get_all'] = 'Y';
        $params['get_custom'] = 'Y';

        list($filters, $view_all_filter) = fn_get_filters_products_count($params);
        Registry::get('view')->assign('filter_features', $filters);
        Registry::get('view')->assign('view_all_filter', $view_all_filter);
    }
//
// View product details
//
} elseif ($mode == 'view' || $mode == 'quick_view') {

    $_REQUEST['product_id'] = empty($_REQUEST['product_id']) ? 0 : $_REQUEST['product_id'];

    if (!empty($_REQUEST['product_id']) && empty($auth['user_id'])) {

        $uids = explode(',', db_get_field("SElECT usergroup_ids FROM ?:products WHERE product_id = ?i", $_REQUEST['product_id']));

        if (!in_array(USERGROUP_ALL, $uids) && !in_array(USERGROUP_GUEST, $uids)) {
            return array(CONTROLLER_STATUS_REDIRECT, "auth.login_form?return_url=" . urlencode(Registry::get('config.current_url')));
        }
    }

    $product = fn_get_product_data($_REQUEST['product_id'], $auth, CART_LANGUAGE, '', true, true, true, true, fn_is_preview_action($auth, $_REQUEST));

    if (empty($product)) {
        return array(CONTROLLER_STATUS_NO_PAGE);
    }

    if ((empty($_SESSION['current_category_id']) || empty($product['category_ids'][$_SESSION['current_category_id']])) && !empty($product['main_category'])) {
        if (!empty($_SESSION['breadcrumb_category_id']) && in_array($_SESSION['breadcrumb_category_id'], $product['category_ids'])) {
            $_SESSION['current_category_id'] = $_SESSION['breadcrumb_category_id'];
        } else {
            $_SESSION['current_category_id'] = $product['main_category'];
        }
    }

    if (!empty($product['meta_description']) || !empty($product['meta_keywords'])) {
        Registry::get('view')->assign('meta_description', $product['meta_description']);
        Registry::get('view')->assign('meta_keywords', $product['meta_keywords']);
    } else {
        $meta_tags = db_get_row("SELECT meta_description, meta_keywords FROM ?:category_descriptions WHERE category_id = ?i AND lang_code = ?s", $_SESSION['current_category_id'], CART_LANGUAGE);
        if (!empty($meta_tags)) {
            Registry::get('view')->assign('meta_description', $meta_tags['meta_description']);
            Registry::get('view')->assign('meta_keywords', $meta_tags['meta_keywords']);
        }
    }
    if (!empty($_SESSION['current_category_id'])) {
        $_SESSION['continue_url'] = "categories.view?category_id=$_SESSION[current_category_id]";

        $parent_ids = fn_explode('/', db_get_field("SELECT id_path FROM ?:categories WHERE category_id = ?i", $_SESSION['current_category_id']));

        if (!empty($parent_ids)) {
            Registry::set('runtime.active_category_ids', $parent_ids);
            $cats = fn_get_category_name($parent_ids);
            foreach ($parent_ids as $c_id) {
                fn_add_breadcrumb($cats[$c_id], "categories.view?category_id=$c_id");
            }
        }
    }
    fn_add_breadcrumb($product['product']);

    if (!empty($_REQUEST['combination'])) {
        $product['combination'] = $_REQUEST['combination'];
    }
    
    //wishlist options selected
    $wishlistOptionsVariantsSelected = array();
    if (isset($_REQUEST['wishlist_id'])) {
        $conditionWishListSql = db_quote(' ?:user_session_products.product_id = ?i AND ?:user_session_products.item_id=?i', $_REQUEST['product_id'], $_REQUEST['wishlist_id']);
        $optsVariantsWishListSerialized = db_get_field("SELECT ?:user_session_products.extra FROM ?:user_session_products WHERE " . $conditionWishListSql . " LIMIT 1");

        $optsVariantsWishListUnSerialized = unserialize($optsVariantsWishListSerialized);
        $wishlistOptionsVariantsSelected = $optsVariantsWishListUnSerialized['product_options'];
        $product['selected_options'] = $wishlistOptionsVariantsSelected;
    }
    
    fn_gather_additional_product_data($product, true, true);
    Registry::get('view')->assign('product', $product);

    // If page title for this product is exist than assign it to template
    if (!empty($product['page_title'])) {
        Registry::get('view')->assign('page_title', $product['page_title']);
    }

    $params = array(
        'product_id' => $_REQUEST['product_id'],
        'preview_check' => true
    );
    list($files) = fn_get_product_files($params);

    if (!empty($files)) {
        Registry::get('view')->assign('files', $files);
    }

    /* [Product tabs] */
    $tabs = ProductTabs::instance()->getList(
            '', $product['product_id'], DESCR_SL
    );
    foreach ($tabs as $tab_id => $tab) {
        if ($tab['status'] == 'D') {
            continue;
        }
        if (!empty($tab['template'])) {
            $tabs[$tab_id]['html_id'] = fn_basename($tab['template'], ".tpl");
        } else {
            $tabs[$tab_id]['html_id'] = 'product_tab_' . $tab_id;
        }

        if ($tab['show_in_popup'] != "Y") {
            Registry::set('navigation.tabs.' . $tabs[$tab_id]['html_id'], array(
                'title' => $tab['name'],
                'js' => true
            ));
        }
    }
    Registry::get('view')->assign('tabs', $tabs);
    /* [/Product tabs] */

    // Set recently viewed products history
    fn_add_product_to_recently_viewed($_REQUEST['product_id']);

    // Increase product popularity
    fn_set_product_popularity($_REQUEST['product_id']);

    $product_notification_enabled = (isset($_SESSION['product_notifications']) ? (isset($_SESSION['product_notifications']['product_ids']) && in_array($_REQUEST['product_id'], $_SESSION['product_notifications']['product_ids']) ? 'Y' : 'N') : 'N');
    if ($product_notification_enabled) {
        if (($_SESSION['auth']['user_id'] == 0) && !empty($_SESSION['product_notifications']['email'])) {
            if (!db_get_field("SELECT subscription_id FROM ?:product_subscriptions WHERE product_id = ?i AND email = ?s", $_REQUEST['product_id'], $_SESSION['product_notifications']['email'])) {
                $product_notification_enabled = 'N';
            }
        } elseif (!db_get_field("SELECT subscription_id FROM ?:product_subscriptions WHERE product_id = ?i AND user_id = ?i", $_REQUEST['product_id'], $_SESSION['auth']['user_id'])) {
            $product_notification_enabled = 'N';
        }
    }

    Registry::get('view')->assign('show_qty', true);
    Registry::get('view')->assign('product_notification_enabled', $product_notification_enabled);
    Registry::get('view')->assign('product_notification_email', (isset($_SESSION['product_notifications']) ? $_SESSION['product_notifications']['email'] : ''));

    if ($mode == 'quick_view') {
        if (defined('AJAX_REQUEST')) {
            fn_prepare_product_quick_view($_REQUEST);
            Registry::set('runtime.root_template', 'views/products/quick_view.tpl');
        } else {
            return array(CONTROLLER_STATUS_REDIRECT, 'products.view?product_id=' . $_REQUEST['product_id']);
        }
    }
    $condition3 = db_quote(' a.product_id = ?i', $_REQUEST['product_id']);
    $join3 = db_quote(' JOIN ?:product_option_variants b ON b.variant_id = a.primary_variant_id');
    $join3 .= db_quote(' JOIN ?:product_options c ON c.option_id = b.option_id');
    $checkedVariants = db_get_fields("SELECT c.option_id FROM ?:product_option_variants_combinations a " . $join3 . " WHERE " . $condition3 . " GROUP BY c.option_id ORDER BY c.position");

    $view->assign('product_combination_options', $checkedVariants);

    $view->assign('wishlistOptionsVariantsSelected', $wishlistOptionsVariantsSelected);

    $selected_options = $product['selected_options'];
    if (!empty($wishlistOptionsVariantsSelected)) {
        $selected_options = $wishlistOptionsVariantsSelected;
    }

    $productArrayOtionsVariants = fn_get_options_variants_by_option_variant_id($_REQUEST['product_id'], $selected_options);

    $view->assign('product_array_otions_variants', $productArrayOtionsVariants);

    $fieldsOptionsVariantsLinksToProducts = "?:product_options.option_id, c.variant_id, d.product_id AS linked_prodict_id";
    $conditionOptionsVariantsLinksToProducts = db_quote(' (?:product_options.product_id = ?i OR (?:product_options.product_id=0 AND n.product_id = ?i))', $_REQUEST['product_id'], $_REQUEST['product_id']);
    $joinOptionsVariantsLinksToProducts = db_quote(' LEFT JOIN ?:product_global_option_links n ON ?:product_options.option_id = n.option_id ');
    $joinOptionsVariantsLinksToProducts .= db_quote(' JOIN ?:product_option_variants c ON ?:product_options.option_id = c.option_id');
    $joinOptionsVariantsLinksToProducts .= db_quote(' JOIN ?:product_option_variants_link d ON c.variant_id = d.option_variant_id');

    $optsVariantsLinksToProducts = db_get_array(
            "SELECT " . $fieldsOptionsVariantsLinksToProducts
            . " FROM ?:product_options " . $joinOptionsVariantsLinksToProducts
            . " WHERE " . $conditionOptionsVariantsLinksToProducts
            . " GROUP BY c.variant_id, ?:product_options.option_id"
            . " ORDER BY ?:product_options.position, c.position"
    );

    $optsVariantsLinksToProductsArray = array();
    $optionVariantsToProductArray = array();
    $optionVariantsToProductArrayStrings = array();
    foreach ($optsVariantsLinksToProducts as $optVariantsLinksToProduct) {
        $optsVariantsLinksToProductsArray[$optVariantsLinksToProduct['option_id']][$optVariantsLinksToProduct['variant_id']] = $optVariantsLinksToProduct['linked_prodict_id'];
        if (count($productArrayOtionsVariants) > 0) {
            if (in_array($optVariantsLinksToProduct['variant_id'], $productArrayOtionsVariants[$optVariantsLinksToProduct['option_id']])) {
                $optionVariantsToProductArray[$optVariantsLinksToProduct['option_id']][$optVariantsLinksToProduct['variant_id']] = "variants[" . $optVariantsLinksToProduct['variant_id'] . "]=" . $optVariantsLinksToProduct['variant_id'];
            }
        } else {
            if (in_array($optVariantsLinksToProduct['variant_id'], array_keys($product['product_options'][$optVariantsLinksToProduct['option_id']]['variants']))) {
                $optionVariantsToProductArray[$optVariantsLinksToProduct['option_id']][$optVariantsLinksToProduct['variant_id']] = "variants[" . $optVariantsLinksToProduct['variant_id'] . "]=" . $optVariantsLinksToProduct['variant_id'];
            }
        }
    }

    foreach ($optionVariantsToProductArray as $optionVariantsToProductKey => $optionVariantsToProduct) {
        $optionVariantsToProductArrayStrings[$optionVariantsToProductKey] = implode("&", $optionVariantsToProduct);
    }
    //product delivery estimation
    //product does not have variants & it's selected available for order
   // echo '<pre>'.var_dump($product).'</pre>';
    $ls_product_in_stock=true;
            $ls_get_product_variants = db_get_array("SELECT a.out_of_stock_actions, a.avail_since, a.comm_period, a.ls_order_processing,a.amount, b.option_id, 
    c.variant_id, d.product_id AS linked_product_id, d.product_nr  AS linked_product_nr, e.out_of_stock_actions AS linked_product_out_of_stock_actions,
    e.avail_since AS linked_product_avail_since, e.comm_period AS linked_product_comm_period, e.ls_order_processing AS linked_product_ls_order_processing, e.amount As linked_product_amount
    FROM cscart_products AS a
    LEFT JOIN cscart_product_options AS b ON a.product_id = b.product_id
    LEFT JOIN cscart_product_option_variants AS c ON b.option_id = c.option_id
    LEFT JOIN  cscart_product_option_variants_link AS d ON c.variant_id = d.option_variant_id
    LEFT JOIN cscart_products AS e ON d.product_id = e.product_id
    WHERE a.product_id = ?i HAVING linked_product_id IS NOT NULL
     ", $product["product_id"]);
            $ls_option_linked = 'Nu';
            $ls_shipping_estimation = 0;
            $ls_shipping_estimation_variants = 0;
            if (empty($ls_get_product_variants)) { //the query returned no results => product has no variants
                 $view->assign('testavailability0', 'no variants');
                 //check the product tracking
                if ($product['tracking'] === 'O') { //product tracking with options
                    if ($product['inventory_amount'] <= 0) {
                        $ls_product_in_stock=false;
                    } 
                } else {
                    if ($product['tracking'] === 'B') {  //product tracking wihout options
                        if ($product['amount'] <= 0) {
                            $ls_product_in_stock=false;
                        }
                    } else { // no tracking 
                        
                    }
                }
            } else { //the query returned results => product has variants
                if ($product['tracking'] === 'O') { //if tracking with options is selected
                    $view->assign('testavailability0', 'variants , tracking O');
                    $n = count($ls_get_product_variants);
                    $ls_get_product_variants[$n] = $product;
                    foreach ($ls_get_product_variants as $k => $v) {
                        if ($k != $n) { //check estimation using variants
                            if (in_array($ls_get_product_variants[$k]['variant_id'], $product['selected_options'])) { //check to see if product  variant is selected
                                $ls_option_linked = 'Da';
                                if ($ls_get_product_variants[$k]['linked_product_amount'] < $ls_get_product_variants[$k]['linked_product_nr']) { //product linked with variant is in stock
                                    $ls_product_in_stock=false;
                                }
                            }
                        } else { //check estimation using main product
                            if ($product['inventory_amount'] <= 0) {
                                $ls_product_in_stock=false;
                            } 
                        }
                    }
                } else {
                    if ($product['tracking'] === 'B') {  //product tracking wihout options
                        if ($product['amount'] <= 0) {
                            $ls_product_in_stock=false;
                        } 
                    } else { //no tracking
                      
                    }
                }
            }
            //check if the estimation is Sunday
            if (date("D", $ls_shipping_estimation) === 'Sun') {
                //add one more day to the estimation
                $ls_shipping_estimation = $ls_shipping_estimation + (24 * 60 * 60);
            }
            $view->assign('ls_option_linked', $ls_option_linked);
            $view->assign('ls_product_in_stock', $ls_product_in_stock);
} elseif ($mode == 'options') {

    //  $combination_hash = fn_generate_cart_id($product['product_id'], array('product_options' => $selected_options), true);
    // $combination_hash = fn_generate_cart_id(2773, $_REQUEST['product_data'][2773], true);
    // $ls_get_variant_amount = db_get_array("SELECT amount FROM cscart_product_options_inventory WHERE product_id='2773' AND combination_hash='$combination_hash'");
    if (!defined('AJAX_REQUEST') && !empty($_REQUEST['product_data'])) {
        list($product_id, $_data) = each($_REQUEST['product_data']);
        $product_id = isset($_data['product_id']) ? $_data['product_id'] : $product_id;
        return array(CONTROLLER_STATUS_REDIRECT, 'products.view?product_id=' . $product_id);
    }
} elseif ($mode == 'product_notifications') {
    fn_update_product_notifications(array(
        'product_id' => $_REQUEST['product_id'],
        'user_id' => $_SESSION['auth']['user_id'],
        'email' => (!empty($_SESSION['cart']['user_data']['email']) ? $_SESSION['cart']['user_data']['email'] : (!empty($_REQUEST['email']) ? $_REQUEST['email'] : '')),
        'enable' => $_REQUEST['enable']
    ));
    exit;
} elseif ($mode == 'load_option_variant_combinations') {
    $fieldsLanguage = "?:currencies.symbol";
    $conditionLanguage = db_quote(' ?:currency_descriptions.lang_code = ?s', DESCR_SL);
    $conditionLanguage .= db_quote(' AND ?:currencies.status = ?s', 'A');
    $joinLanguage = db_quote(' JOIN ?:currency_descriptions ON ?:currency_descriptions.currency_code = ?:currencies.currency_code');
    $currency = db_get_field(
            "SELECT " . $fieldsLanguage
            . " FROM ?:currencies"
            . $joinLanguage
            . " WHERE " . $conditionLanguage
            . " ORDER BY ?:currencies.position ASC LIMIT 1"
    );


    $fields2 = "?:product_options.option_id, ?:product_options.option_type, c.variant_id, c.modifier, c.modifier_type, c.position, d.variant_name";

    $condition2 = db_quote(' ?:product_options.option_id != ?i ', $_REQUEST['option_id']);
    $condition2 .= db_quote(' AND (?:product_options.product_id = ?i OR (?:product_options.product_id=0 AND n.product_id = ?i))', $_REQUEST['product_id'], $_REQUEST['product_id']);
    //$condition2 .= db_quote(' AND ?:product_options.company_id = ?i', $companyId);
    $condition2 .= db_quote(' AND b.lang_code = ?s', DESCR_SL);
    $join2 = db_quote(' LEFT JOIN ?:product_global_option_links n ON ?:product_options.option_id = n.option_id ');
    $join2 .= db_quote(' JOIN ?:product_options_descriptions b ON ?:product_options.option_id = b.option_id');
    $join2 .= db_quote(' JOIN ?:product_option_variants c ON ?:product_options.option_id = c.option_id');
    $join2 .= db_quote(' JOIN ?:product_option_variants_descriptions d ON c.variant_id = d.variant_id');

    $opts2 = db_get_array(
            "SELECT " . $fields2
            . " FROM ?:product_options " . $join2
            . " WHERE " . $condition2
            . " GROUP BY c.variant_id, ?:product_options.option_id"
            . " ORDER BY ?:product_options.position, c.position"
    );

    $fields4 = "b.option_id, b.variant_id, b.modifier, b.modifier_type, b.position, c.variant_name, e.option_type";
    $condition4 = db_quote(' a.product_id = ?i', $_REQUEST['product_id']);
    $condition4 .= db_quote(' AND primary_variant_id = ?i', $_REQUEST['variant_id']);
    $join4 = db_quote(' JOIN ?:product_option_variants b ON a.secondary_variant_id = b.variant_id');
    $join4 .= db_quote(' JOIN ?:product_options e ON e.option_id = b.option_id');
    $join4 .= db_quote(' JOIN ?:product_option_variants_descriptions c ON c.variant_id = b.variant_id');
    $checkedVariants = db_get_array("SELECT " . $fields4 . " FROM ?:product_option_variants_combinations a " . $join4 . " WHERE " . $condition4 . " ORDER BY b.position");

    $optionAndVariants = array();

    foreach ($opts2 as $opt2) {
        $optionAndVariants[$opt2['option_id']]['option_type'] = $opt2['option_type'];
        $optionAndVariants[$opt2['option_id']]['variants'][$opt2['variant_id']] = array('modifier' => $opt2['modifier'], '' => $opt2['modifier_type'], 'variant_name' => $opt2['variant_name'], 'currency' => $currency);
    }

    foreach ($checkedVariants as $checkedVariant) {
        $optionAndVariants[$checkedVariant['option_id']]['option_type'] = $checkedVariant['option_type'];
        $optionAndVariants[$checkedVariant['option_id']]['variants'][$checkedVariant['variant_id']] = array('modifier' => $checkedVariant['modifier'], '' => $checkedVariant['modifier_type'], 'variant_name' => $checkedVariant['variant_name'], 'currency' => $currency);
    }

    echo json_encode($optionAndVariants);

    exit;
} elseif ($mode == 'show_option_variant_link_products') {
    $action = 'show_all';
    $list = 'features';

    $fieldsOptionsVariantsLinksToProducts = "c.variant_id, d.product_id AS linked_product_id";
    $conditionOptionsVariantsLinksToProducts = db_quote(' (?:product_options.product_id = ?i OR (?:product_options.product_id=0 AND n.product_id = ?i))', $_REQUEST['product_id'], $_REQUEST['product_id']);
    $conditionOptionsVariantsLinksToProducts .= db_quote(' AND ?:product_options.option_id', $_REQUEST['option_id']);
    $joinOptionsVariantsLinksToProducts = db_quote(' LEFT JOIN ?:product_global_option_links n ON ?:product_options.option_id = n.option_id ');
    $joinOptionsVariantsLinksToProducts .= db_quote(' JOIN ?:product_option_variants c ON ?:product_options.option_id = c.option_id');
    $joinOptionsVariantsLinksToProducts .= db_quote(' JOIN ?:product_option_variants_link d ON c.variant_id = d.option_variant_id');

    $optsVariantsLinksToProducts = db_get_array(
            "SELECT " . $fieldsOptionsVariantsLinksToProducts
            . " FROM ?:product_options " . $joinOptionsVariantsLinksToProducts
            . " WHERE " . $conditionOptionsVariantsLinksToProducts
            . " GROUP BY c.variant_id, ?:product_options.option_id"
            . " ORDER BY ?:product_options.position, c.position"
    );
    $optsVariantsLinksToProductsArray = array();
    foreach ($optsVariantsLinksToProducts as $optVariantsLinksToProduct) {
        if (in_array($optVariantsLinksToProduct['variant_id'], $_REQUEST['variants'])) {
            $optsVariantsLinksToProductsArray[$optVariantsLinksToProduct['variant_id']] = $optVariantsLinksToProduct['linked_product_id'];
        }
    }

    if (!empty($optsVariantsLinksToProductsArray)) {
        $comparationResults = fn_get_product_data_for_compare($optsVariantsLinksToProductsArray, $action);

        Registry::get('view')->assign('comparison_data', $comparationResults);
        Registry::get('view')->assign('total_products', count($optsVariantsLinksToProductsArray));

        Registry::get('view')->assign('list', $list);
        Registry::get('view')->assign('action', $action);
    }
} elseif ($mode == 'ls_wishlist_update') { //update number of favorite products through ajax
    $result = $_SESSION['wishlist'];
    $wishlistest3 = count($result['products']);
    ;
    echo $wishlistest3;
    exit;
} elseif ($mode == 'delete_footer' && !empty($_REQUEST['cart_id'])) {
    fn_delete_wishlist_product($wishlist, $_REQUEST['cart_id']);

    fn_save_cart_content($wishlist, $auth['user_id'], 'W');

    exit;
} elseif ($mode == 'view_details_compact') {
    if ($_REQUEST['variant_id']) {
        $fieldsOptionsVariantsLinksToProducts = "d.product_id AS linked_product_id";
        $conditionOptionsVariantsLinksToProducts = db_quote(' (?:product_options.product_id = ?i OR (?:product_options.product_id=0 AND n.product_id = ?i))', $_REQUEST['product_id'], $_REQUEST['product_id']);
        $conditionOptionsVariantsLinksToProducts .= db_quote(' AND d.option_variant_id =?i', $_REQUEST['variant_id']);
        $joinOptionsVariantsLinksToProducts = db_quote(' LEFT JOIN ?:product_global_option_links n ON ?:product_options.option_id = n.option_id ');
        $joinOptionsVariantsLinksToProducts .= db_quote(' JOIN ?:product_option_variants c ON ?:product_options.option_id = c.option_id');
        $joinOptionsVariantsLinksToProducts .= db_quote(' JOIN ?:product_option_variants_link d ON c.variant_id = d.option_variant_id');

        $optsVariantsLinksToProducts = db_get_field(
                "SELECT " . $fieldsOptionsVariantsLinksToProducts
                . " FROM ?:product_options " . $joinOptionsVariantsLinksToProducts
                . " WHERE " . $conditionOptionsVariantsLinksToProducts
                . " GROUP BY c.variant_id, ?:product_options.option_id"
                . " LIMIT 1"
        );

        $productIds = array($optsVariantsLinksToProducts);
    } else {
        $productIds = array($_REQUEST['product_id']);
    }

    $productDataToView = fn_get_product_data_for_compare($productIds);

    $product_data = fn_get_product_data($productIds[0], $auth, CART_LANGUAGE, '', false, true, false, false);
    fn_gather_additional_product_data($product_data, false, false, false, true, false);

    if (!empty($product_data['product_features'])) {
        foreach ($product_data['product_features'] as $k => $v) {
            if ($v['feature_type'] == 'G' && empty($v['subfeatures'])) {
                continue;
            }
            $_features = ($v['feature_type'] == 'G') ? $v['subfeatures'] : array($k => $v);
            $group_id = ($v['feature_type'] == 'G') ? $k : 0;
            $productDataToView['feature_groups'][$k] = $v['description'];
            foreach ($_features as $_k => $_v) {
                if (in_array($_k, $_SESSION['excluded_features'])) {
                    if (empty($productDataToView['hidden_features'][$_k])) {
                        $productDataToView['hidden_features'][$_k] = $_v['description'];
                    }
                    continue;
                }

                if (empty($productDataToView['product_features'][$group_id][$_k])) {
                    $productDataToView['product_features'][$group_id][$_k] = $_v['description'];
                }
            }
        }
    }
    Registry::get('view')->assign('product_data_to_view', $productDataToView);
}

function fn_get_product_data_for_compare($product_ids, $action) {
    $auth = & $_SESSION['auth'];

    $comparison_data = array(
        'product_features' => array(0 => array())
    );
    $tmp = array();
    foreach ($product_ids as $product_id) {
        $product_data = fn_get_product_data($product_id, $auth, CART_LANGUAGE, '', false, true, false, false);

        fn_gather_additional_product_data($product_data, false, false, false, true, false);

        if (!empty($product_data['product_features'])) {
            foreach ($product_data['product_features'] as $k => $v) {
                if ($v['feature_type'] == 'G' && empty($v['subfeatures'])) {
                    continue;
                }
                $_features = ($v['feature_type'] == 'G') ? $v['subfeatures'] : array($k => $v);
                $group_id = ($v['feature_type'] == 'G') ? $k : 0;
                $comparison_data['feature_groups'][$k] = $v['description'];
                foreach ($_features as $_k => $_v) {
                    if (in_array($_k, $_SESSION['excluded_features'])) {
                        if (empty($comparison_data['hidden_features'][$_k])) {
                            $comparison_data['hidden_features'][$_k] = $_v['description'];
                        }
                        continue;
                    }

                    if (empty($comparison_data['product_features'][$group_id][$_k])) {
                        $comparison_data['product_features'][$group_id][$_k] = $_v['description'];
                    }
                }
            }
        }

        $comparison_data['products'][] = $product_data;
        unset($product_data);
    }

    if ($action != 'show_all' && !empty($comparison_data['product_features'])) {
        $value = '';

        foreach ($comparison_data['product_features'] as $group_id => $v) {
            foreach ($v as $feature_id => $_v) {
                unset($value);
                $c = ($action == 'similar_only') ? true : false;
                foreach ($comparison_data['products'] as $product) {
                    $features = !empty($group_id) && isset($product['product_features'][$group_id]) ? $product['product_features'][$group_id]['subfeatures'] : $product['product_features'];
                    if (empty($features[$feature_id])) {
                        $c = !$c;
                        break;
                    }
                    if (!isset($value)) {
                        $value = fn_get_feature_selected_value($features[$feature_id]);
                        continue;
                    } elseif ($value != fn_get_feature_selected_value($features[$feature_id])) {
                        $c = !$c;
                        break;
                    }
                }

                if ($c == false) {
                    unset($comparison_data['product_features'][$group_id][$feature_id]);
                }
            }
        }
    }

    return $comparison_data;
}

function fn_get_feature_selected_value($feature) {
    $value = null;

    if (strpos('SMNE', $feature['feature_type']) !== false) {
        if ($feature['feature_type'] == 'M') {
            foreach ($feature['variants'] as $v) {
                if ($v['selected']) {
                    $value[] = $v['variant_id'];
                }
            }
        } else {
            $value = $feature['variant_id'];
        }
    } elseif (strpos('OD', $feature['feature_type']) !== false) {
        $value = $feature['value_int'];
    } else {
        $value = $feature['value'];
    }

    return $value;
}

function fn_add_product_to_recently_viewed($product_id, $max_list_size = MAX_RECENTLY_VIEWED) {
    $added = false;

    if (!empty($_SESSION['recently_viewed_products'])) {
        $is_exist = array_search($product_id, $_SESSION['recently_viewed_products']);
        // Existing product will be moved on the top of the list
        if ($is_exist !== false) {
            // Remove the existing product to put it on the top later
            unset($_SESSION['recently_viewed_products'][$is_exist]);
            // Re-sort the array
            $_SESSION['recently_viewed_products'] = array_values($_SESSION['recently_viewed_products']);
        }

        array_unshift($_SESSION['recently_viewed_products'], $product_id);
        $added = true;
    } else {
        $_SESSION['recently_viewed_products'] = array($product_id);
    }

    if (count($_SESSION['recently_viewed_products']) > $max_list_size) {
        array_pop($_SESSION['recently_viewed_products']);
    }

    return $added;
}

function fn_set_product_popularity($product_id, $popularity_view = POPULARITY_VIEW) {
    if (empty($_SESSION['products_popularity']['viewed'][$product_id])) {
        $_data = array(
            'product_id' => $product_id,
            'viewed' => 1,
            'total' => $popularity_view
        );

        db_query("INSERT INTO ?:product_popularity ?e ON DUPLICATE KEY UPDATE viewed = viewed + 1, total = total + ?i", $_data, $popularity_view);

        $_SESSION['products_popularity']['viewed'][$product_id] = true;

        return true;
    }

    return false;
}

function fn_update_product_notifications($data) {
    if (!empty($data['email']) && fn_validate_email($data['email'])) {
        $_SESSION['product_notifications']['email'] = $data['email'];
        if ($data['enable'] == 'Y') {
            db_query("REPLACE INTO ?:product_subscriptions ?e", $data);
            if (!isset($_SESSION['product_notifications']['product_ids']) || (is_array($_SESSION['product_notifications']['product_ids']) && !in_array($data['product_id'], $_SESSION['product_notifications']['product_ids']))) {
                $_SESSION['product_notifications']['product_ids'][] = $data['product_id'];
            }

            fn_set_notification('N', __('notice'), __('product_notification_subscribed'));
        } else {
            $deleted = db_query("DELETE FROM ?:product_subscriptions WHERE product_id = ?i AND user_id = ?i AND email = ?s", $data['product_id'], $data['user_id'], $data['email']);

            if (isset($_SESSION['product_notifications']) && isset($_SESSION['product_notifications']['product_ids']) && in_array($data['product_id'], $_SESSION['product_notifications']['product_ids'])) {
                $_SESSION['product_notifications']['product_ids'] = array_diff($_SESSION['product_notifications']['product_ids'], array($data['product_id']));
            }

            if (!empty($deleted)) {
                fn_set_notification('N', __('notice'), __('product_notification_unsubscribed'));
            }
        }
    }
}
//comparison list number for footer
$view->assign('comparison_list_no', count($_SESSION["comparison_list"]));
//get wishlist variable for footer
if (isset($_SESSION['wishlist'])) {
    $test_ses = $_SESSION['wishlist'];
    $view->assign('test_ses', $test_ses);
    $result = $_SESSION['wishlist'];
    $wishlistest = count($result['products']);
    $view->assign('wishlistest', $wishlistest);
} else {
    $view->assign('wishlistest', 0);
}
//wishlist products footer carousel
$_SESSION['wishlist'] = isset($_SESSION['wishlist']) ? $_SESSION['wishlist'] : array();
$wishlist = & $_SESSION['wishlist'];
$_SESSION['continue_url'] = isset($_SESSION['continue_url']) ? $_SESSION['continue_url'] : '';
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
$view->assign('products_footer', $products_footer);
