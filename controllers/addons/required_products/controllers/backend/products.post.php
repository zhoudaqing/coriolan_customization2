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
    //
    // Update required products
    //

    if ($mode == 'update') {
        if (!empty($_REQUEST['product_id'])) {
            //delete all from table of required products
            db_query('DELETE ?:product_required_products FROM ?:product_required_products WHERE product_id = ?i', $_REQUEST['product_id']);
            
            //
            $condition2 = db_quote(' (?:product_options.product_id = ?i OR (?:product_options.product_id=0 AND ?:product_global_option_links.product_id = ?i))', $_REQUEST['product_id'],$_REQUEST['product_id']);
            $join2 = db_quote(' JOIN ?:product_option_variants ON ?:product_option_variants.variant_id = req_prod.option_variant_id');
            $join2 .= db_quote(' JOIN ?:product_options ON ?:product_options.option_id = ?:product_option_variants.option_id');
            $join2 .= db_quote(' LEFT JOIN ?:product_global_option_links ON ?:product_options.option_id = ?:product_global_option_links.option_id ');
            $checkedVariants = db_get_array("SELECT req_prod.product_id, req_prod.option_variant_id FROM ?:product_option_variants_link as req_prod $join2 WHERE $condition2");
            
            //delete all variants which are linked to the required products
            foreach($checkedVariants as $checkedVariant){
                if($_REQUEST['linking_products'][$checkedVariant['product_id']]==0){
                    db_query("DELETE FROM ?:product_option_variants WHERE variant_id =?i",$checkedVariant['option_variant_id']);
                    db_query("DELETE FROM ?:product_option_variants_link WHERE option_variant_id =?i",$checkedVariant['option_variant_id']);
                }
            }
            
            if (!empty($_REQUEST['required_products'])) {
                $required_products = explode(',', $_REQUEST['required_products']);

                $key = array_search($_REQUEST['product_id'], $required_products);

                if ($key !== false) {
                    unset($required_products[$key]);
                }

                $entry = array (
                    'product_id' => $_REQUEST['product_id']
                );
                //'linked'=>$_REQUEST['linking_products'][$_REQUEST['product_id']]
                foreach ($required_products as $entry['required_id']) {
                    if (empty($entry['required_id'])) {
                        continue;
                    }
                    $entry['linked'] = $_REQUEST['linking_products'][$entry['required_id']];
                    db_query('INSERT INTO ?:product_required_products ?e', $entry);
                }
            }
        }
    }
}

if ($mode == 'update') {
    $product_id = empty($_REQUEST['product_id']) ? 0 : intval($_REQUEST['product_id']);

    Registry::set('navigation.tabs.required_products', array (
        'title' => __('required_products'),
        'js' => true
    ));

    $required_products = db_get_array('SELECT required_id, linked FROM ?:product_required_products WHERE product_id = ?i', $product_id);
    
    $required_products_final = array();
    $required_products_linked_final = array();
    foreach ($required_products as $required_product){
        $required_products_final[] = $required_product['required_id'];
        $required_products_linked_final[$required_product['required_id']] = $required_product['linked'];
    }

    Registry::get('view')->assign('required_products', $required_products_final);
    Registry::get('view')->assign('required_products_linked', $required_products_linked_final);
}
