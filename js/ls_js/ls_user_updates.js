/*******cart customisation**********/
$(document).ready(function () {
    //cache check
    //  console.log('cache ls_user_updates cache00');
    //display number of products in cart
    var block_id = '285';       //block_id=285/289 for cart_content2/cart-content-smarty
    var lsAvailableProducts_url = fn_url('index.lsAvailableProducts');
    var lscheckCompareNo = fn_url('index.ls_checkCompareNo');
    var ls_compare_clicked;
    var ls_delete_from_cart_clicked;
    var ls_add_to_cart_clicked;
    var ls_add_cart_product = fn_url('index.ls_add_cart_product');
    ls_global_vars.scrolldown_category_list=false;
    function customize_cart() {
        var cart_update_url = fn_url('index.updateCartNo'); //dispatch url for jquery ajax call
        //get the number of cart products (not including duplicates)from session
        var request0 = $.ajax({
            url: cart_update_url,
            dataType: 'json',
            type: 'POST'
        });
        request0.done(function (msg) {
            //parse the returned text in json format
            msg = jQuery.parseJSON(msg.text);  // only works with msg.text!
            //update no of products in cart
            if ($('#ls_cart_no').length == 0) { //element doest not exists
                $('#sw_dropdown_' + block_id + ' > a').prepend('<span id="ls_cart_no">' + msg.ammount + '</span>');
            }
            else {
                $('#ls_cart_no').html(msg.ammount);
                $('.ls_cart_no').html(msg.ammount);
                $('#ls_subtotal_tpl').html(msg.subtotal);
            }
            //update the subtotal
       //     console.log('the no of cart products is ' + msg.ammount + '; and the subtotal is' + msg.subtotal);
            //        console.log('the subtotal is: ' + msg.subtotal)
        });
        //  $('#sw_dropdown_'+block_id+' > a').prepend('<span id="ls_cart_no">'+ls_cart_no+'</span>');
        //   console.log('customize_cart() executed2');
    }
    /*  $('body').on('click', 'a.ls_delete_icon', function () {
     setTimeout(function () {
     customize_cart();
     }, 1400);
     //   setTimeout(function() {customize_cart();}, 2800);
     }); */

    //hide footer on 404 error page
    function hide_footer() {
        if ($('div.ty-exception__code').length) { //exception encountered    
            var error = $('div.ty-exception__code').first().html();
            error = error.trim();
            error = error.substr(0, 4);
            console.log('exception encountered:' + error);
            if (error == 404) { //hide footer
                console.log('exception code is 404');
                $('#tygh_footer').hide();
            }
        }
    }
    hide_footer();
    //dropdown fix for header menu
    $('div.top-links-grid').find('.ty-dropdown-box__title.cm-combination').on('click', function () {
        $(this).parent().siblings().children('.cm-popup-box.ty-dropdown-box__content').hide();
    });
    //style the header,filters,categories&pagination on scroll 
    function styleOnScroll() {
    //    console.log('scroll position is '+$(window).scrollTop());
        var top_panel = $('div.tygh-top-panel.clearfix').first();
        var top_panel_DefaultHeight = 45;
        var top_panel_window_pos = getPosY(top_panel, false);
        var header = $('div.tygh-header.clearfix').first(); //cache the header
        var header_height = header.outerHeight();
        //   console.log('top_panel_window_pos: '+top_panel_window_pos);
        //display header
        if (top_panel_window_pos + top_panel_DefaultHeight > -1) {
            top_panel.height(top_panel_DefaultHeight);
            header.css('position', 'static');
        } else { //hide header, make categories menu fixed
            //*increase document height by the height of the newly position: fixed element
            top_panel.height(top_panel_DefaultHeight + header_height); //*will prevent the whole document going up when header will be fixed
            header.css('position', 'fixed');
            header.css('top', 0);
        }
        //get subcategories position on scroll for filters/sorting positioning
        //  var offset_subcategories=$('.category_view_submenu.ty-float-left').offset();
        //   var subcategories_posY = offset_subcategories.top - $(window).scrollTop();
        //  var hideCategory_scrollPosition=$('.category_view_submenu.ty-float-left').height()+offset.top;
        //make filters fixed
        if ($('.filtre_orizontala_wrapper').length) {
            var subcategories_window_pos = getPosY($('.category_view_submenu').first(), true);
            var filters_sorting_container = $('div.ls_filters_sorting_grid').first(); //cache the container
        //    console.log('subcategories_window_pos: ' + subcategories_window_pos);
            if (subcategories_window_pos > -10) {
                $('div.ls_filters_sorting_grid').parent().removeClass("ls_filters_active");
            } else {
                $('div.ls_filters_sorting_grid').parent().addClass("ls_filters_active");
                //   filters_sorting_container.css('position','fixed');
                //  filters_sorting_container.css('top',46); 
            }
        }
        //position pagination on scroll down
        //get the content offset
        if ($('#pagination_contents').length) {
            var offset_pagination = $('#pagination_contents').offset();
            var content_posY = offset_pagination.top - $(window).scrollTop();
            //  console.log('pagination content top:'+content_posY);
            if ($('.ty-pagination__bottom').length) {
                //    console.log('ty-pagination__bottom found');
                if (content_posY >= 100) {
                    $('.ty-pagination__bottom').css('top', content_posY);
                } else {
                    $('.ty-pagination__bottom').css('top', 100);
                }
            }
            ;
        }
    }
    //get the y window position of the element on scroll
    function getPosY(obj, addHeight) {
        var offset_obj = obj.offset();
        if (addHeight == false) {
            var obj_posY = offset_obj.top - $(window).scrollTop();
            //   console.log('obj outerwidth:'+obj.outerHeight())
        } else {
            var obj_posY = offset_obj.top - $(window).scrollTop() + obj.outerHeight();
        }
        return obj_posY;
    }
    //pagination positioning
    setPaginationMargin();
    function setPaginationMargin() {
        if ($('#pagination_contents').length) {
            var offset_pagination = $('#pagination_contents').offset();
            var content_posY = offset_pagination.top - $(window).scrollTop();
            $('.ty-pagination__bottom').css('top', content_posY);
            if ($(window).width() > 800) {
                var pagination_margin = ($(window).width() - $('.container-fluid.content-grid').outerWidth(false)) / 2;
                console.log('pagination_margin:' + pagination_margin);
                $('.ty-pagination__bottom').css('right', pagination_margin);
            } else {
                console.log('width<800');
                $('.ty-pagination__bottom').css('right', 0);
            }
        }
    }
    //return to top
    $('body').on('click', 'div.ls_pagination_return_click', function () {
        scrollToTop();
    });
    function scrollToTop() {
        $("html, body").animate({scrollTop: 0}, "slow"); //scroll top upermost position
    }
    ;
    $(window).scroll(function () {
        styleOnScroll();
    });
    $(window).resize(function () {
        setPaginationMargin();
        position_next_page_text();
    });
    $(document).ajaxComplete(function () {
        setPaginationMargin();
        position_next_page_text();
        //show product delivery estimation 
        if ($('div.ty-product-block__button #ls_add_to_cart_button').length) {
            $('#ls_shipping_estimation').show();
        }
        //check if product should be added to compare
        if (ls_compare_clicked) {
            ls_compare_clicked = false;
            //add in footer the no of comparison list from session          
            getComparisonNo();
        }
        //check if you shoulf remove the transparent div from cart
        if (ls_delete_from_cart_clicked) {
            ls_delete_from_cart_clicked = false;
            //remove the transparent div 
            if ($('.ls_please-wait').length) {
                setTimeout(function () {
                    $('.ls_please-wait').first().hide();
            //        console.log('trans div hidden');
                }, 500);
            }
            $('#ajax_loading_box').removeAttr('style');
            setTimeout(function () {
                customize_cart();
           //     console.log('ajax complete and customize_cart() executed');
            }, 300);
            //calculate the estimation
            ls_reload_product_data();
        }
        //check if you should update the cart
        if (ls_add_to_cart_clicked) {
            ls_add_to_cart_clicked = false;
            setTimeout(function () {
                //recalculate the estimation
                ls_reload_product_data();
                //reload the cart data
                var request0= $.ajax({
                    url: ls_add_cart_product,
                    dataType: 'json',
                    type: 'POST',
                    data: {
                    combination_hash: ls_global_vars.combination_hash
                    }
                });
                request0.done(function (msg) {
                    //parse the returned text in json format
                    msg = jQuery.parseJSON(msg.text);  // only works with msg.text!
                    var markup = msg.markup;
                    var hash = msg.hash;
                    var ls_vertical_slider = $('.ls-vertical-slider.ls-vertical-lsc_container');
                    var carousel_cart = '<ul class="ls_vertical_cart_ul ">' + msg.markup + '</ul>';
                    if (msg !== 0) {
                        //generate cart products V2
                        var sliderUl = $('div.ls-vertical-slider').children('ul');
                        var imgs = sliderUl.find('li');
                         if (imgs.length < 1) {
                             ls_vertical_slider.html(carousel_cart);
                             customize_cart();
                             console.log('ajax complete and customize_cart() executed');
                         } else {
                             sliderUl.find('li.ty-cart-items__list-item').remove();
                             sliderUl.html(markup);
                             customize_cart();
                             console.log('ajax complete and customize_cart() executed');
                         }
                        /*
                        console.log('required_products_no='+msg.required_products_no);
                        var sliderUl = $('div.ls-vertical-slider').children('ul');
                        var imgs = sliderUl.find('li');
                        //cart empty
                        if (imgs.length < 1) {
                            ls_vertical_slider.html(carousel_cart);
                            console.log('empty cart: ' + imgs.length);
                        } else { //cart not empty
                            //check if this product already exists in the cart
                            console.log('cart not empty: ' + imgs.length+'msg.hash='+hash);
                            $('.ls_cart_combination_hash').each(function (index, item) {
                                if ($(item).text() == msg.hash) {
                                    $(item).parents('li').first().remove();
                                    console.log('product already in cart');
                                    console.log('product hash: ' + $(item).text());
                                    return false;
                                } else {
                                    console.log('product not in cart, ls_cart_combination_hash='+$(item).text());
                                }
                            });
                            if (ls_vertical_slider.find('li').length) {
                                ls_vertical_slider.find('li').first().before(msg.markup);
                            } else {
                                //this product was already the only one in cart and got deleted
                                ls_vertical_slider.html(carousel_cart);
                            }
                        }
                        customize_cart();
                        console.log('ajax complete and customize_cart() executed'); */
                    }
                });
            }, 500);
        }
        //check if you need to position the page on pagination click
        if(ls_global_vars.scrolldown_category_list && $('.category_view_submenu').length) {
            ls_scrollTo_list_products(); 
        }
    });
    //set variable for triggering the add to compare ajax call
    $('div.ty-add-to-compare a').on('click', function () {
        ls_compare_clicked = true;
    });
    //set variable when a product is deleted
    $('body').on('click.lsNameSpace', 'a.cm-ajax.ls_delete_icon', function () {
        console.log('ls_delete_from_cart_clicked');
        ls_delete_from_cart_clicked = true;
    });

    //get comparison list no
    function getComparisonNo() {
        var request0 = $.ajax({
            url: lscheckCompareNo,
            dataType: 'html',
            type: 'POST'
        });
        request0.done(function (msg) {
            if (msg !== 0) {
                $('#ls_comparison_list_no').html('(' + msg + ')');
            }
        });
    }
    //close window button
    $('.ls_close_window').on('click', function () {
        $('.cm-popup-box.ty-dropdown-box__content').hide();
        var categories_dropdown = $('div.ty-menu__submenu');
        if (categories_dropdown.length) {
            categories_dropdown.hide();
            setTimeout(function () {
                categories_dropdown.removeAttr('style');
            }, 100);
            console.log('div.ty-menu__submenu found');
        }
    });
    //search modal customization
    $('#myModal1').on('show.bs.modal', function (e) {
        $('#tygh_main_container').children('.tygh-top-panel.clearfix').css("zIndex", 1);
        setTimeout(function () {
            $('div.ls_search_block.modal_block').find('#search_input').focus();
        }, 1300);
    });
    $('#myModal1').on('hide.bs.modal', function (e) {
        $('#tygh_main_container').children('tygh-top-panel.clearfix').css("zIndex", 2)
    });
    //show product delivery estimation 
    if ($('div.ty-product-block__button #ls_add_to_cart_button').length) {
        $('#ls_shipping_estimation').show();
    }
    //categories menu - active category display but remove highlight only when hovering other categories
    $(".top-menu li.ty-menu__item.cm-menu-item-responsive").mouseover(function () {
        if (!$(this).hasClass('ty-menu__item-active')) {
            $('.ty-menu__item-active').css('background-color', 'transparent');
        }
    }).mouseleave(function () {
        $(".ty-menu__item-active").css("background-color", '#666');
    });
    //scroll to top after clicking on pagination
    $('body').on('click', 'div.ty-pagination__items a', function () {
        scrollToTop();
    });
    //pagination dropdown on view all
    $('.ls_pagination_dropdown').hover(
            function () { //on mousenter
                $('.ls_pagination_dropdown_selection').show();
            },
            function () { //on mouseleave
                $('.ls_pagination_dropdown_selection').hide();
            })
    //remove this after css modification
    $('div.tygh-top-panel.clearfix').first().css('position', 'static');
    $('div.tygh-header.clearfix').first().css('position', 'static');
    //visual bug grid_list
    if ($('div.testmainboxgeneral.mainbox-container.clearfix.ty-float-left').first()) {
        $('div.testmainboxgeneral.mainbox-container.clearfix.ty-float-left').first().removeClass('ty-float-left');
        //   console.log('testmainboxgeneral found');
    }
    //product availability customization
    $('body').on('click', '[id^=button_cart_]', function () { //item added to cart
        //set variable when a product is added to cart
        ls_add_to_cart_clicked = true;
        var combination_hash=$(this).parents('form').find('span.ls_product_combination_hash').first().text();
        ls_global_vars={combination_hash: combination_hash};
        console.log('product added to cart, combination_hash:' ,ls_global_vars.combination_hash);
        var avail_ele = $('#ls_product_amount_availability');
        var amount_ele = $('.ty-value-changer__input.cm-amount.cm-reload-form');
        var product_id = $('div.ty-product-block__left .ls_product_id').first().text();
        if (amount_ele.length) { //if amount text field is present
            var amount = parseInt(amount_ele.val());
        } else {
            var amount = 1;
        }
      /*  if (avail_ele.length) { // products available
            var initial_product_amount = parseInt($('#ls_product_amount_availability').text());
            var final_amount = initial_product_amount - amount;
            if (final_amount > 0) {  //write the substracted value
                avail_ele.html(final_amount);
            } else { //write available to order in the selected language
                //append backorder mesage elments
                if ($('#ls_frontend_language').text() == 'ro') {
                    avail_ele.after('<span class="ls_avail_backorder">La comandă</span>');
                    //check out of stock action for email notification
                    if ($('div.ty-product-block__left .ls_product_out_of_stock_actions').first().text() === 'S' && ($('div.ty-product-block__left .ls_product_tracking').first().text() === 'B')) { //display email notification
                        if ($('#ls_email_notification').length) { //just show the email notification if it already exist but is hidden
                            $('#ls_email_notification').show();
                        } else { //append the email notification elements and script
                            var onclick_script = "if (!this.checked) { Tygh.$.ceAjax('request', 'http://coriolan.leadsoft.eu/index.php?dispatch=products.product_notifications&amp;enable=' + 'N&amp;product_id=2775&amp;email=' + $('#product_notify_email_2775').get(0).value, {cache: false}); }";
                            $('.ls_product_combination_hash').first().before('<div class="ty-control-group ls_email_notification"><label for="sw_product_notify_2775"><input id="sw_product_notify_2775" type="checkbox" class="checkbox cm-switch-availability cm-switch-visibility" name="product_notify" onclick="' + onclick_script + '">Anuntati-ma cand acest produs este din nou in stoc.</label></div><div class="ty-control-group ty-input-append ty-product-notify-email hidden ls_email_notification" id="product_notify_2775" style="display: none;"><input type="hidden" name="enable" value="Y" class="disabled" disabled=""><input type="hidden" name="product_id" value="2775" class="disabled" disabled=""><label id="product_notify_email_label" for="product_notify_email_2775" class="cm-required cm-email hidden">E-mail</label><input type="text" name="email" id="product_notify_email_2775" size="20" value="" class="ty-product-notify-email__input cm-hint-focused disabled" title="Introduceti adresa de e-mail" disabled=""><button class="ty-btn-go cm-ajax disabled" type="submit" name="dispatch[products.product_notifications]" title="Mergeti" disabled=""><i class="ty-btn-go__icon ty-icon-right-dir"></i></button></div>');
                            console.log('notification generated');
                        }

                    }

                } else { //english message
                    avail_ele.after('<span class="ls_avail_backorder">Nonexistent in stock but available for purchase.</span>');
                    //check out of stock action for email notification
                    if (($('div.ty-product-block__left .ls_product_out_of_stock_actions').first().text()) && ($('div.ty-product-block__left .ls_product_tracking').first().text() === 'B')) { //display email notification
                        if ($('#ls_email_notification').length) { //just show the email notification if it already exist but is hidden
                            $('#ls_email_notification').show();
                        } else { //append the email notification elements and script
                            var onclick_script = "if (!this.checked) { Tygh.$.ceAjax('request', 'http://coriolan.leadsoft.eu/index.php?dispatch=products.product_notifications&amp;enable=' + 'N&amp;product_id=2775&amp;email=' + $('#product_notify_email_2775').get(0).value, {cache: false}); }";
                            $('.ls_product_combination_hash').first().before('<div class="ty-control-group ls_email_notification"><label for="sw_product_notify_2775"><input id="sw_product_notify_2775" type="checkbox" class="checkbox cm-switch-availability cm-switch-visibility" name="product_notify" onclick="' + onclick_script + '>Notify me when this product is back in stock.</label></div><div class="ty-control-group ty-input-append ty-product-notify-email hidden ls_email_notification" id="product_notify_2775" style="display: none;"><input type="hidden" name="enable" value="Y" class="disabled" disabled><input type="hidden" name="product_id" value="2775" class="disabled" disabled=""><label id="product_notify_email_label" for="product_notify_email_2775" class="cm-required cm-email hidden">E-mail</label><input type="text" name="email" id="product_notify_email_2775" size="20" value="" class="ty-product-notify-email__input cm-hint-focused disabled" title="Introduceti adresa de e-mail" disabled=""><button class="ty-btn-go cm-ajax disabled" type="submit" name="dispatch[products.product_notifications]" title="Mergeti" disabled=""><i class="ty-btn-go__icon ty-icon-right-dir"></i></button></div>');
                            console.log('notification generated');
                        }

                    }
                }
                //remove the available message
                avail_ele.remove(); //quantity no
                console.log('avail_ele removed');
                $('#ls_availability_text').remove(); //unit of measure
            }
        } */
    });
  /*  $('body').on('click', 'a.ls_delete_icon', function () { //product/s deleted from cart
        var obj = $(this);
        var product_id = obj.parents('li').find('span.ls_cart_combination_id').text();
        var combination_hash = obj.parents('li').find('span.ls_cart_combination_hash').text();
        var product_data = [product_id, combination_hash];
        if (obj.parents('li').find('span.ls_cart_combination_hash').text() == $('.ls_product_combination_hash').first().text()) { //deleted product from current page
            var request0 = $.ajax({
                url: lsAvailableProducts_url,
                dataType: 'json',
                type: 'POST',
                data: {
                    product_id: product_id,
                    combination_hash: combination_hash
                }
            });
            request0.done(function (msg) {
                //parse the returned text in json format
                msg = jQuery.parseJSON(msg.text);  // only works with msg.text!
                msg = msg.amount;
                if ((msg !== 'no tracking') && (msg > 0)) {
                    console.log('no of available products=' + msg);
                    var avail_ele = $('#ls_product_amount_availability');
                    var deleted_cart_amount = $(obj.parents('li').find('.ls_cart_product_amount').first()).text();
                    if (avail_ele.length) { //available for purchase text not present
                        avail_ele.html(msg);
                    } else { //available for purchase text present
                        var avail_backorder = $('span.ls_avail_backorder');
                        if ($('#ls_frontend_language').text() == 'ro') {
                            avail_backorder.after('<span class="ty-qty-in-stock ty-control-group__item"><span id="ls_product_amount_availability">' + msg + '</span><span id="ls_availability_text">&nbsp;Produs(e)</span></span>');
                        } else {
                            avail_backorder.after('<span class="ty-qty-in-stock ty-control-group__item"><span id="ls_product_amount_availability">' + msg + '</span><span id="ls_availability_text">&nbsp;item(s)</span></span>');
                        }
                        avail_backorder.remove();
                        $('.ls_email_notification').hide();
                    }
                } else {
                    console.log('no tracking or non-positive amount');
                }
            });
        }
    }); */
    //delete product quickview modal for ajax reloading(product availability bug when deleting cart items)
    $('body').on('click', 'button.ui-dialog-titlebar-close', function () {
        var obj = $(this);
        if (obj.data("dismiss") === "modal") {
            obj.parents('div.ui-dialog.ui-widget').first().remove();
            console.log('modal removed');
        }
    });
    //color the text input of the search
    $('#search_input').keydown(function (e) {
        if (e.keyCode != 8) {
            var obj = $(this);
            if (!obj.hasClass('')) {
                obj.addClass('ls_search_text_color');
            }
        }
    });
    $('#search_input').keyup(function (e) {
        var obj = $(this);
        if (!(obj.val()) && (e.keyCode == 8)) {
            obj.removeClass('ls_search_text_color');
        }
    });
    //initialize the product page jquery-ui acordion
    var ls_product_page_accordion = $("#ls_product_page_accordion");
    if (ls_product_page_accordion.length) {
        $(function () {
            ls_product_page_accordion.accordion({
                collapsible: true,
                heightStyle: "content",
                active: false
            });
        });
    };
    //move product between cart and wishlist
    $('body').on('click', '.ls_move_to_cart', function() {
    var move_to_cart_buton=$(this);
    var move_to_cart_form=move_to_cart_buton.parents('form').first();
   // console.log('product_page_id='+product_page_id);
  //  console.log('product_page_form= ='+product_page_form.serialize());
    var ls_move_product_url=fn_url('');
    //add product to cart
     var request0 = $.ajax({
                url: ls_move_product_url,
                type: 'POST',
                data: move_to_cart_form.serialize(),
                async: false
            });
        request0.done(function (msg) {
        });
         //remove product from wishlist
            var delete_fav_product_url = fn_url('index.ls_deleteFavProduct');
            var footerFavId = move_to_cart_buton.parents('li').first().find('span.ls_cart_combination_hash').first().text();
            console.log('footerFavId=' + footerFavId);
            var request1 = $.ajax({
                url: delete_fav_product_url,
                type: 'POST',
                data: {footerFavId: footerFavId}
            });
            request1.done(function (msg) {
                // customize_cart();
                //reload the page without wishlist_id parameter so that the last selected options will appear
               var current_location=location.protocol + '//' + location.host + location.pathname;
               window.location.assign(current_location);
            });
    });
    //move the product from cart to wishlist
    $('body').on('click', '.ls_move_to_wishlist', function() {
        var move_to_wishlist_buton=$(this);
        var move_to_wishlist_form=move_to_wishlist_buton.parents('form').first();
        var li=move_to_wishlist_buton.parents('li').first();
        var ls_cart_combination_hash=li.find('.ls_cart_combination_hash').first().text();
        var ls_cart_combination_id=li.find('.ls_cart_combination_id').first().text();
        var ls_move_product_url=fn_url('index.ls_move_product');
        console.log('serilized move form: '+move_to_wishlist_form.serialize());
    //    console.log('ls_move_product_url='+ls_move_product_url);
      //  console.log('ls_cart_combination_hash'+ls_cart_combination_hash+';ls_cart_product_id'+ls_cart_product_id); 
         var request0 = $.ajax({
                url: ls_move_product_url,
                type: 'POST',
                data: move_to_wishlist_form.serialize()
            });
            request0.done(function (msg) {
                console.log('ajax for moving product done '+msg);
            //    customize_cart();
            //reload the page
             location.reload();
            });
    });
    //position viewport on pagination click
    $('body').on('click', 'div.ty-pagination a', function() {
        ls_global_vars.scrolldown_category_list=true;
    })
    //scroll to view category/search products
    function ls_scrollTo_list_products() {
        var new_scroll_pos = $('.category_view_submenu').first().outerHeight();
        new_scroll_pos += 45;
        // console.log('new scroll pos='+new_scroll_pos);
        $(window).scrollTop(new_scroll_pos);
    }
    //position viewport on filters click
    if ((window.location.search.indexOf('features_hash') > -1) || (window.location.search.indexOf('ls_view_all=true') > -1)) {
       ls_scrollTo_list_products();
    }
    //position the page on reset clicked
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function delete_cookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    function checkCookie() {
        var scroll_down = getCookie("scroll_down");
        if (scroll_down != "") { //reset was clicked
            console.log('scroll down cookie is set');
            //delete the cookie
            delete_cookie('scroll_down');
            //position the page
            ls_scrollTo_list_products();
        } else {
            console.log('scroll down cookie is not set');
        }
    }

    //set a cookie if the reset button was clicked
    $('body').on('click', '.ty-product-filters__reset-button', function() {
        setCookie("scroll_down", 'reset was clicked', 1);
    });
    //set a cookie if the next page button was clicked
    $('body').on('click', 'div.ls_next_page_container a', function() {
        setCookie("scroll_down", 'next page was clicked', 1);
    });
    //check if the reset buton was clicked
    checkCookie();
    //position the scroll on next page clicked
    $('body').on('click', 'ls_next_page_container a', function() {
        ls_scrollTo_list_products();
    });
    //position the next page icons/link
    function position_next_page_text() {
        //select the next page container
        var next_page_container=$('.ls_next_page_container');
        if(next_page_container){
            //get the page width
            var left_pos=($(document).width()/2)-100;           
            //select the next page text
            next_page_container.children('span').first().offset({left: left_pos});      
        }
    }
    position_next_page_text();
    function ls_reload_product_data() {
        var ls_reload_dataUrl = fn_url('products.ls_reload_product_data');
        var product_form=$('.ls_product_combination_hash').parents('form').first();
        if(product_form.find('.cm-picker-product-options.ty-product-options :input').length){
            var product_form_data = product_form.find('.cm-picker-product-options.ty-product-options :input').serialize();
        } else {
            var product_id=product_form.find('span.ls_product_id').first().text();
            var product_form_data = "product_data%5B"+product_id+"%5D%5Bproduct_id%5D="+product_id;
        }
        var ls_estimate_request = $.ajax({
            url: ls_reload_dataUrl,
            dataType: 'json',
            type: 'POST',
            data: product_form_data
        })
        ls_estimate_request.done(function (msg) {
            //parse the returned text in json format
            msg = jQuery.parseJSON(msg.text);  // only works with msg.text!
            $('span.ls_shipping_estimation_text span.ls_date').first().text(msg.ls_individual_estimation);
            //display the product availability
            //find the availability span and remove it
            var availability_container=$('span.ls_product_combination_hash').parents('form').first().find('div.ls_product_availability').first();
            if (msg.ls_product_availability) {
                availability_container.show();
                availability_container.find('span').remove();
                //add the new availability html
                availability_container.append(msg.ls_product_availability);
            } else {
                availability_container.hide();
            }
            //hide or show the cart button
            if(msg.ls_hide_button) {
             //   $('span.ls_product_combination_hash').parents('form').first().find('button.ty-btn__primary').first().hide();
                  $('span.ls_product_combination_hash').parents('form').first().find('div.ls_add_to_cart_estimate').first().hide();
                //hide the shipping estimate
            } else {
              //   $('span.ls_product_combination_hash').parents('form').first().find('button.ty-btn__primary').first().show();
                   $('span.ls_product_combination_hash').parents('form').first().find('div.ls_add_to_cart_estimate').first().show();
                //show the shipping estimate
            }
            //display the notification signup
            var email_notification=$('span.ls_product_combination_hash').parents('div.ty-product-block__button').first().find('.ls_email_notification');
            var email_notification_input=$('span.ls_product_combination_hash').parents('div.ty-product-block__button').first().find('.ls_email_notification_input');
            if(msg.ls_notification_signup) {
                email_notification.find('input.checkbox').first().prop('checked', false);
                email_notification.show();
              /*  if (!email_notification.length) {
                    $('span.ls_product_combination_hash').parents('div.ty-product-block__button').first().prepend(msg.ls_notification_signup);
                } else {
                  //  console.log('email notification already found');
                } */
            } else {
                //remove the notification signup   
                 email_notification.hide();
                 email_notification_input.hide();
             /*   if(email_notification) {
                    email_notification.remove();
                } */
            }
            console.log('ls_hide_button test ',msg.ls_hide_button);
            console.log('ls_test',msg.ls_test);
        });
    }
    //search adress by zipcode
    $('button.ls_search_adress_button').on('click', function () {
        var zipcode = $('div.ty-billing-zip-code .ty-input-text').val();
        zipcode=zipcode.trim();
        console.log('zipcode=' + zipcode);
        $.ajax({
            type: 'get',
            url: 'http://openapi.ro/api/addresses.json?zip=' + zipcode,
            dataType: 'jsonp',
            success: function (data) {
                console.log(data['0']);
                //set the county
                
                //set the city
                var city=data['0'].location;
                $('div.ty-billing-city .ty-input-text').val(city);
                $('div.ty-shipping-city .ty-input-text').val(city);
            }
        });
    });
});
//autocomplete for search modal
// autocomplete : this function will be executed every time we change the text
function ls_search_autocomplete() {
    var ls_search_autocomplete_url = fn_url('index.ls_search_autocomplete');
    var min_length = 2; // min caracters to trigger the  autocomplete AJAX
    var keyword = $('#search_input').val();
    if (keyword.length >= min_length) {
        var request0 = $.ajax({
            url: ls_search_autocomplete_url,
            dataType: 'json',
            type: 'POST',
            data: {q: keyword,
                subcats: 'N',
                pshort: 'N',
                pfull: 'N',
                pname: 'Y',
                pkeywords: 'N',
                search_performed: 'Y',
                save_view_results: 'product_id'
            }
        });
        request0.done(function (msg) {
            msg = msg.text;
            console.log('autocomplete ajax done, msg=' + msg);
            $('#ls_autocomplete_list_id').show();
            $('#ls_autocomplete_list_id').html(msg);

        });
    } else {
        $('#ls_autocomplete_list_id').hide();
    }
}

// set_item : this function will be executed when we select an item
function ls_search_set_item(item) {
    //remove any html tags
    item = item.replace(/(<([^>]+)>)/ig, "");
    // change input value
    $('#search_input').val(item);
    // hide proposition list
    $('#ls_autocomplete_list_id').hide();
    //show ajax loading box
    $('#ajax_loading_box').show();
}
//image preview for profile page upload
function ls_PreviewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("ls_uploadImage").files[0]);
    oFReader.onload = function (oFREvent) {
        document.getElementById("ls_uploadPreview").src = oFREvent.target.result;
    };
}
//for validating email confirmation
/*function ls_validateEmail() {
    var first_input=$('#email').val();
    var second_input=$('#email2').val();
    if(first_input!==second_input) {
        //change the styling of the text intput and display error messages
        return false;
    } else {
        return false;
    }
}*/
$("#save_profile_but" ).click(function( event ) {
    var first_input=$('#email').val();
    var second_input=$('#email2').val();
    if(first_input!==second_input) {
        //change the styling of the text intput , display error messages and prevent the form from submiting
        event.preventDefault();
    } 
});