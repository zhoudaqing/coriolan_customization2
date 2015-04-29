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
use Tygh\Session;
use Tygh\Mailer;

if (!defined('BOOTSTRAP')) { die('Access denied'); }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    //
    // Create/Update user
    //
    if ($mode == 'update') {
           // formtat the user fields caps
        $_SESSION['TEST']=$_REQUEST['user_data'];
        $_REQUEST['user_data']['email']=strtolower( $_REQUEST['user_data']['email']);
        $_REQUEST['user_data']['email2']=strtolower( $_REQUEST['user_data']['email2']);
        $_REQUEST['user_data']['firstname']=ucwords(strtolower( $_REQUEST['user_data']['firstname']));
        $_REQUEST['user_data']['lastname']=ucwords(strtolower( $_REQUEST['user_data']['lastname']));
        $_REQUEST['user_data']['b_firstname']=ucwords(strtolower( $_REQUEST['user_data']['b_firstname']));
        $_REQUEST['user_data']['b_lastname']=ucwords(strtolower( $_REQUEST['user_data']['b_lastname']));
        $_REQUEST['user_data']['s_firstname']=ucwords(strtolower( $_REQUEST['user_data']['s_firstname']));
        $_REQUEST['user_data']['s_lastname']=ucwords(strtolower( $_REQUEST['user_data']['s_lastname']));

              $target_dir = "/images/user_profile/";
//insert user id here
        $base_url=$_SERVER['DOCUMENT_ROOT'];
        $ls_image_name=$auth['user_id'].'.jpg'; //replace with user id
        $target_file = $base_url.$target_dir . $ls_image_name;
   //     error_reporting(E_ALL);
   //     ini_set('display_errors', 1);
        //user profile image
        $uploadOk = 1;
      //  echo "the upload image path is $target_file<br>";
       // var_dump($_REQUEST);
        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
        if (isset($_POST["submit"])) {
            $check = getimagesize($_FILES["p1"]["tmp_name"]);
            if ($check !== false) {
                //      echo "File is an image - " . $check["mime"] . ".";
                $uploadOk = 1;
            } else {
                //      echo "File is not an image.";
                $uploadOk = 0;
            }
        }
// Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
//    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $uploadOk = 0;
        }
// Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            //   echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
        } else {
     //   echo 'target file='.$target_file;
            if (move_uploaded_file($_FILES["p1"]["tmp_name"], $target_file)) {
       //         echo 'file uploaded,auth_id='.$auth['user_id'];
         //              echo "The file ". basename( $_FILES["p1"]["name"]). " has been uploaded.";
            } else {
         //             echo "Sorry, there was an error uploading your file.";
         //       echo 'file not uploaded,tmp name='.$_FILES["p1"]["tmp_name"].";target file=$target_file";
            }
        }
        if (fn_image_verification('use_for_register', $_REQUEST) == false) {
            fn_save_post_data('user_data');

            return array(CONTROLLER_STATUS_REDIRECT, 'profiles.add');
        }

        $is_update = !empty($auth['user_id']);

        if (!$is_update) {
            $is_valid_user_data = true;

            if (empty($_REQUEST['user_data']['email'])) {
                fn_set_notification('W', __('warning'), __('error_validator_required', array('[field]' => __('email'))));
                $is_valid_user_data = false;

            } elseif (!fn_validate_email($_REQUEST['user_data']['email'])) {
                fn_set_notification('W', __('error'), __('text_not_valid_email', array('[email]' => $_REQUEST['user_data']['email'])));
                $is_valid_user_data = false;
            }

            if (empty($_REQUEST['user_data']['password1']) || empty($_REQUEST['user_data']['password2'])) {

                if (empty($_REQUEST['user_data']['password1'])) {
                    fn_set_notification('W', __('warning'), __('error_validator_required', array('[field]' => __('password'))));
                }

                if (empty($_REQUEST['user_data']['password2'])) {
                    fn_set_notification('W', __('warning'), __('error_validator_required', array('[field]' => __('confirm_password'))));
                }
                $is_valid_user_data = false;

            } elseif ($_REQUEST['user_data']['password1'] !== $_REQUEST['user_data']['password2']) {
                fn_set_notification('W', __('warning'), __('error_validator_password', array('[field2]' => __('password'), '[field]' => __('confirm_password'))));
                $is_valid_user_data = false;
            } 

            if (!$is_valid_user_data) {
                return array(CONTROLLER_STATUS_REDIRECT, 'profiles.add');
            }
        }
        if ($_REQUEST['user_data']['email'] !== $_REQUEST['user_data']['email2']) {
                fn_set_notification('W', __('warning'), __('error_validator_password', array('[field2]' => __('email'), '[field]' => __('validate_email'))));
                $is_valid_user_data = false;
            }
        fn_restore_processed_user_password($_REQUEST['user_data'], $_POST['user_data']);

        $res = fn_update_user($auth['user_id'], $_REQUEST['user_data'], $auth, !empty($_REQUEST['ship_to_another']), true);

        if ($res) {
            list($user_id, $profile_id) = $res;

            // Cleanup user info stored in cart
            if (!empty($_SESSION['cart']) && !empty($_SESSION['cart']['user_data'])) {
                $_SESSION['cart']['user_data'] = fn_array_merge($_SESSION['cart']['user_data'], $_REQUEST['user_data']);
            }

            // Delete anonymous authentication
            if ($cu_id = fn_get_session_data('cu_id') && !empty($auth['user_id'])) {
                fn_delete_session_data('cu_id');
            }

            Session::regenerateId();

            if (!empty($_REQUEST['return_url'])) {
                return array(CONTROLLER_STATUS_OK, $_REQUEST['return_url']);
            }

        } else {
            fn_save_post_data('user_data');
            fn_delete_notification('changes_saved');
        }

        if (!empty($user_id) && !$is_update) {
            $redirect_url = "profiles.success_add";
        } else {
            $redirect_url = "profiles." . (!empty($user_id) ? "update" : "add") . "?";

            if (Registry::get('settings.General.user_multiple_profiles') == 'Y') {
                $redirect_url .= "profile_id=$profile_id&";
            }

            if (!empty($_REQUEST['return_url'])) {
                $redirect_url .= 'return_url=' . urlencode($_REQUEST['return_url']);
            }
        }
        return array(CONTROLLER_STATUS_OK, $redirect_url);
    }
}

if ($mode == 'add') {

    if (!empty($auth['user_id'])) {
        return array(CONTROLLER_STATUS_REDIRECT, "profiles.update");
    }

    fn_add_breadcrumb(__('registration'));

    $user_data = array();
    if (!empty($_SESSION['cart']) && !empty($_SESSION['cart']['user_data'])) {
        $user_data = $_SESSION['cart']['user_data'];
    }

    $restored_user_data = fn_restore_post_data('user_data');
    if ($restored_user_data) {
        $user_data = fn_array_merge($user_data, $restored_user_data);
    }

    Registry::set('navigation.tabs.general', array (
        'title' => __('general'),
        'js' => true
    ));

    $params = array();
    if (isset($_REQUEST['user_type'])) {
        $params['user_type'] = $_REQUEST['user_type'];
    }

    $profile_fields = fn_get_profile_fields('C', array(), CART_LANGUAGE, $params);
    Registry::get('view')->assign('profile_fields', $profile_fields);
    Registry::get('view')->assign('user_data', $user_data);
    Registry::get('view')->assign('ship_to_another', fn_check_shipping_billing($user_data, $profile_fields));
    Registry::get('view')->assign('countries', fn_get_simple_countries(true, CART_LANGUAGE));
    Registry::get('view')->assign('states', fn_get_all_states());

} elseif ($mode == 'update') {
     var_dump($_SESSION['TEST']);
    if (empty($auth['user_id'])) {
        return array(CONTROLLER_STATUS_REDIRECT, "auth.login_form?return_url=".urlencode(Registry::get('config.current_url')));
    }
    $profile_id = empty($_REQUEST['profile_id']) ? 0 : $_REQUEST['profile_id'];
    fn_add_breadcrumb(__('editing_profile'));

    if (!empty($_REQUEST['profile']) && $_REQUEST['profile'] == 'new') {
        $user_data = fn_get_user_info($auth['user_id'], false);
    } else {
        $user_data = fn_get_user_info($auth['user_id'], true, $profile_id);
    }

    if (empty($user_data)) {
        return array(CONTROLLER_STATUS_NO_PAGE);
    }

    $restored_user_data = fn_restore_post_data('user_data');
    if ($restored_user_data) {
        $user_data = fn_array_merge($user_data, $restored_user_data);
    }

    Registry::set('navigation.tabs.general', array (
        'title' => __('general'),
        'js' => true
    ));

    $show_usergroups = true;
    if (Registry::get('settings.General.allow_usergroup_signup') != 'Y') {
        $show_usergroups = fn_user_has_active_usergroups($user_data);
    }

    if ($show_usergroups) {
        $usergroups = fn_get_usergroups('C');
        if (!empty($usergroups)) {
            Registry::set('navigation.tabs.usergroups', array (
                'title' => __('usergroups'),
                'js' => true
            ));

            Registry::get('view')->assign('usergroups', $usergroups);
        }
    }
 
    $profile_fields = fn_get_profile_fields();
  //  echo 'profile fields:'; var_dump($profile_fields);
                //check if the user has uploaded a image
       $target_dir = "/images/user_profile/";
//insert user id here
        $base_url=$_SERVER['DOCUMENT_ROOT'];
        $ls_image_name=$auth['user_id'].'.jpg'; //replace with user id
        $target_file = $base_url.$target_dir . $ls_image_name;
    if(file_exists($target_file)) {
        $ls_user_image='file exists';
      //  $view->assign('ls_user_image', $ls_user_image);
         Registry::get('view')->assign('ls_user_profile_image', $ls_user_image);
    } 
    Registry::get('view')->assign('profile_fields', $profile_fields);
    Registry::get('view')->assign('user_data', $user_data);
    Registry::get('view')->assign('ship_to_another', fn_check_shipping_billing($user_data, $profile_fields));
    Registry::get('view')->assign('countries', fn_get_simple_countries(true, CART_LANGUAGE));
    Registry::get('view')->assign('states', fn_get_all_states());
    if (Registry::get('settings.General.user_multiple_profiles') == 'Y') {
        Registry::get('view')->assign('user_profiles', fn_get_user_profiles($auth['user_id']));
    }

// Delete profile
} elseif ($mode == 'delete_profile') {

    fn_delete_user_profile($auth['user_id'], $_REQUEST['profile_id']);

    return array(CONTROLLER_STATUS_OK, "profiles.update");

} elseif ($mode == 'usergroups') {
    if (empty($auth['user_id']) || empty($_REQUEST['type']) || empty($_REQUEST['usergroup_id'])) {
        return array(CONTROLLER_STATUS_DENIED);
    }

    if (fn_request_usergroup($auth['user_id'], $_REQUEST['usergroup_id'], $_REQUEST['type'])) {
        $user_data = fn_get_user_info($auth['user_id']);

        Mailer::sendMail(array(
            'to' => 'default_company_users_department',
            'from' => 'default_company_users_department',
            'reply_to' => $user_data['email'],
            'data' => array(
                'user_data' => $user_data,
                'usergroups' => fn_get_usergroups('F', Registry::get('settings.Appearance.backend_default_language')),
                'usergroup_id' => $_REQUEST['usergroup_id']
            ),
            'tpl' => 'profiles/usergroup_request.tpl',
            'company_id' => $user_data['company_id'],
        ), 'A', Registry::get('settings.Appearance.backend_default_language'));
    }

    return array(CONTROLLER_STATUS_OK, "profiles.update");

} elseif ($mode == 'success_add') {

    if (empty($auth['user_id'])) {
        return array(CONTROLLER_STATUS_REDIRECT, "profiles.add");
    }

    fn_add_breadcrumb(__('registration'));
}

/**
 * Requests usergroup for customer
 *
 * @param int $user_id User identifier
 * @param int $usergroup_id Usergroup identifier
 * @param string $type Type of request (join|cancel)
 * @return bool True if request successfuly sent, false otherwise
 */
function fn_request_usergroup($user_id, $usergroup_id, $type)
{
    $success = false;
    if (!empty($user_id)) {
        $_data = array(
            'user_id' => $user_id,
            'usergroup_id' => $usergroup_id,
        );

        if ($type == 'cancel') {
            $_data['status'] = 'F';

        } elseif ($type == 'join') {
            $_data['status'] = 'P';
            $success = true;
        }

        if (!empty($_data['status'])) {
            db_query("REPLACE INTO ?:usergroup_links SET ?u", $_data);
        }
    }

    return $success;
}
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