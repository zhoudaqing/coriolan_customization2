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

if (!defined('BOOTSTRAP')) {
    die('Access denied');
}

$_REQUEST['category_id'] = empty($_REQUEST['category_id']) ? 0 : $_REQUEST['category_id'];

if ($mode == 'catalog') {
    fn_add_breadcrumb(__('catalog'));

    $root_categories = fn_get_subcategories(0);

    foreach ($root_categories as $k => $v) {
        $root_categories[$k]['main_pair'] = fn_get_image_pairs($v['category_id'], 'category', 'M');
    }

    Registry::get('view')->assign('root_categories', $root_categories);
} elseif ($mode == 'view') {
    
    $_statuses = array('A', 'H');
    $_condition = fn_get_localizations_condition('localization', true);
    $preview = fn_is_preview_action($auth, $_REQUEST);

    if (!$preview) {
        $_condition .= ' AND (' . fn_find_array_in_set($auth['usergroup_ids'], 'usergroup_ids', true) . ')';
        $_condition .= db_quote(' AND status IN (?a)', $_statuses);
    }

    if (fn_allowed_for('ULTIMATE')) {
        $_condition .= fn_get_company_condition('?:categories.company_id');
    }

    $is_avail = db_get_field("SELECT category_id FROM ?:categories WHERE category_id = ?i ?p", $_REQUEST['category_id'], $_condition);

    if (!empty($is_avail)) {

        if (!empty($_REQUEST['features_hash'])) {
            $_REQUEST['features_hash'] = fn_correct_features_hash($_REQUEST['features_hash']);
        }
        
        // Save current url to session for 'Continue shopping' button
        $_SESSION['continue_url'] = "categories.view?category_id=$_REQUEST[category_id]";

        // Save current category id to session
        $_SESSION['current_category_id'] = $_SESSION['breadcrumb_category_id'] = $_REQUEST['category_id'];

        // Get subcategories list for current category
        Registry::get('view')->assign('subcategories', fn_get_subcategories($_REQUEST['category_id']));

        // Get full data for current category
        $category_data = fn_get_category_data($_REQUEST['category_id'], CART_LANGUAGE, '*', true, false, $preview);

        if (!empty($category_data['meta_description']) || !empty($category_data['meta_keywords'])) {
            Registry::get('view')->assign('meta_description', $category_data['meta_description']);
            Registry::get('view')->assign('meta_keywords', $category_data['meta_keywords']);
        }

        $params = $_REQUEST;

        if (!empty($_REQUEST['items_per_page'])) {
            $_SESSION['items_per_page'] = $_REQUEST['items_per_page'];
        } elseif (!empty($_SESSION['items_per_page'])) {
            $params['items_per_page'] = $_SESSION['items_per_page'];
        }

        $params['cid'] = $_REQUEST['category_id'];
        $params['extend'] = array('categories', 'description');
        $params['subcats'] = '';
        if (Registry::get('settings.General.show_products_from_subcategories') == 'Y') {
            $params['subcats'] = 'Y';
        }
        if (isset($_REQUEST['ls_view_all'])) {
            list($products, $search) = fn_get_products($params,10000, CART_LANGUAGE);
            $ls_view_all=true;
            list($products2, $search2) = fn_get_products($params, Registry::get('settings.Appearance.products_per_page'), CART_LANGUAGE);
        } else {
            list($products, $search) = fn_get_products($params, Registry::get('settings.Appearance.products_per_page'), CART_LANGUAGE);
            $ls_view_all=false;
        }
        if (isset($search['page']) && ($search['page'] > 1) && empty($products)) {
            return array(CONTROLLER_STATUS_NO_PAGE);
        }
        
        $colorOptionFlag = false;
        $colorOptionVariants = array();
        foreach($products as $product123){
            $colorOptionCheck = db_get_row("SELECT ?:product_options.option_id FROM ?:product_options LEFT JOIN ?:product_global_option_links ON ?:product_options.option_id=?:product_global_option_links.option_id WHERE (?:product_options.product_id=?i OR ?:product_global_option_links.product_id=?i) AND ?:product_options.option_id = 2291", $product123['product_id'], $product123['product_id']);
            if(!empty($colorOptionCheck)){
                $colorOptionFlag = true;
            }
        }
        if($colorOptionFlag){
            $colorOptionVariants = db_get_array("SELECT ?:product_option_variants.*, ?:product_option_variants_descriptions.variant_name FROM ?:product_option_variants JOIN ?:product_option_variants_descriptions ON ?:product_option_variants.variant_id=?:product_option_variants_descriptions.variant_id WHERE ?:product_option_variants.option_id=2291 AND ?:product_option_variants_descriptions.lang_code = ?s", CART_LANGUAGE);
        }
        
        Registry::get('view')->assign('colorOptionVariants', $colorOptionVariants);
        
        fn_gather_additional_products_data($products, array(
            'get_icon' => true,
            'get_detailed' => true,
            'get_additional' => true,
            'get_options' => true,
            'get_discounts' => true,
            'get_features' => false
        ));

        $show_no_products_block = (!empty($params['features_hash']) && !$products);
        Registry::get('view')->assign('show_no_products_block', $show_no_products_block);

        $selected_layout = fn_get_products_layout($_REQUEST);
        Registry::get('view')->assign('show_qty', true);
        Registry::get('view')->assign('products', $products);
        foreach($products as $product321){
            //var_dump($product321);echo"<br/>___________________<br/>";
        }
        $ls_total_products_category = $search['total_items'];
        Registry::get('view')->assign('ls_total_products_category', $ls_total_products_category);
        Registry::get('view')->assign('products2', $products2);
        Registry::get('view')->assign('search2', $search2);
        Registry::get('view')->assign('ls_view_all', $ls_view_all);
        Registry::get('view')->assign('search', $search);
        Registry::get('view')->assign('selected_layout', $selected_layout);

        Registry::get('view')->assign('category_data', $category_data);

        // If page title for this category is exist than assign it to template
        if (!empty($category_data['page_title'])) {
            Registry::get('view')->assign('page_title', $category_data['page_title']);
        }

        fn_define('FILTER_CUSTOM_ADVANCED', true); // this constant means that extended filtering should be stayed on the same page

        list($filters) = fn_get_filters_products_count($_REQUEST);
        
        Registry::get('view')->assign('filter_features', $filters);
        /*
        if($_REQUEST['features_hash']){
            $featuresHashValues = explode(".", $_REQUEST['features_hash']);
        }
        */
        // [Breadcrumbs]
        //var_dump( $_SERVER['REQUEST_URI']);echo"<br/>___________<br/>";
        $parent_ids = explode('/', $category_data['id_path']);
        array_pop($parent_ids);
        
        if (!empty($parent_ids)) {
            $cats = fn_get_category_name($parent_ids);
            foreach ($parent_ids as $c_id) {
                fn_add_breadcrumb($cats[$c_id], "categories.view?category_id=$c_id");
            }
        }

        fn_add_breadcrumb($category_data['category'], (empty($_REQUEST['features_hash']) && empty($_REQUEST['advanced_filter'])) ? '' : "categories.view?category_id=$_REQUEST[category_id]");
        if (!empty($params['features_hash'])) { //add filters to breadcrumbs
            fn_add_filter_ranges_breadcrumbs($params, "categories.view?category_id=$_REQUEST[category_id]");
        } elseif (!empty($_REQUEST['advanced_filter'])) {
            fn_add_breadcrumb(__('advanced_filter'),'',false,true);
        }
        fn_separate_breadcrumbs();
        if($params['features_hash']){
            $featuresHashArrayLinks = array();
            $featuresHashArray = explode(".", $params['features_hash']);
            $featuresHashArray = array_reverse($featuresHashArray);
            
            $nrOfElements = count($featuresHashArray);
            foreach($featuresHashArray as $keyFeatureHash=>$featureHash){
                if($keyFeatureHash<($nrOfElements-1))
                    $featuresHashArrayLinks[$keyFeatureHash +1] = str_replace(".".$featureHash,"", $_SERVER['REQUEST_URI']);
                elseif($nrOfElements==1)
                    $featuresHashArrayLinks[$keyFeatureHash +1] = str_replace("&features_hash=".$featureHash,"", $_SERVER['REQUEST_URI']);
                else
                    $featuresHashArrayLinks[$keyFeatureHash +1] = str_replace($featureHash.".","", $_SERVER['REQUEST_URI']);
            }
       //     echo var_dump($featuresHashArray);
            Registry::get('view')->assign('featuresHashArrayLinks', $featuresHashArrayLinks);
        }
        // [/Breadcrumbs]
    } else {
        return array(CONTROLLER_STATUS_NO_PAGE);
    }
    //display category image
    $image_path = fn_get_image_pairs($_REQUEST['category_id'], 'category', 'M', true, true, CART_LANGUAGE);
 //   $image_relative_path=$image_path['detailed']['relative_path'];
   echo var_dump($image_relative_path);
  //  $thumbnail_path=fn_generate_thumbnail($image_relative_path, 60, 84, false);
    Registry::get('view')->assign('ls_category_image', $image_path['detailed']['image_path']);
} elseif ($mode == 'picker') {

    $category_count = db_get_field("SELECT COUNT(*) FROM ?:categories");
    if ($category_count < CATEGORY_THRESHOLD) {
        $params = array(
            'simple' => false
        );
        list($categories_tree, ) = fn_get_categories($params);
        Registry::get('view')->assign('show_all', true);
    } else {
        $params = array(
            'category_id' => $_REQUEST['category_id'],
            'current_category_id' => $_REQUEST['category_id'],
            'visible' => true,
            'simple' => false
        );
        list($categories_tree, ) = fn_get_categories($params);
    }

    if (!empty($_REQUEST['root'])) {
        array_unshift($categories_tree, array('category_id' => 0, 'category' => $_REQUEST['root']));
    }
    Registry::get('view')->assign('categories_tree', $categories_tree);
    if ($category_count < CATEGORY_SHOW_ALL) {
        Registry::get('view')->assign('expand_all', true);
    }
    if (defined('AJAX_REQUEST')) {
        Registry::get('view')->assign('category_id', $_REQUEST['category_id']);
    }
    Registry::get('view')->display('pickers/categories/picker_contents.tpl');
    exit;
}
//comparison list number for footer
$view->assign('comparison_list_no', count($_SESSION["comparison_list"]));
//get wishlist variable for footer
if (isset($_SESSION['wishlist'])) {
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
$test_var = fn_ls_get_product_filters();
$view->assign('test_var', $test_var);
