/*******cart customisation**********/
$(document).ready(function () {
    //cache check
    //  console.log('cache ls_user_updates cache00');
    //display number of products in cart
    var block_id = '285';       //block_id=285/289 for cart_content2/cart-content-smarty
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
            //        console.log('the no of cart products is ' + msg.ammount)
            //        console.log('the subtotal is: ' + msg.subtotal)
        });
        //  $('#sw_dropdown_'+block_id+' > a').prepend('<span id="ls_cart_no">'+ls_cart_no+'</span>');
        //   console.log('customize_cart() executed2');
    }
    $('body').on('click', 'a.ls_delete_icon', function () {
        setTimeout(function () {
            customize_cart();
        }, 1400);
        //   setTimeout(function() {customize_cart();}, 2800);
    });

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
            //   console.log('subcategories_window_pos: ' + subcategories_window_pos);
            if (subcategories_window_pos > 45) {
                $('div.ls_filters_sorting_grid').parent().removeClass("ls_filters_active");
                //  $('div.ls_filters_sorting_grid').parent().addClass("ls_filters_active");
                //   filters_sorting_container.css('position','static');
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
        $("html, body").animate({scrollTop: 0}, "slow"); //scroll top upermost positio
    }
    ;
    $(window).scroll(function () {
        styleOnScroll();
    });
    $(window).resize(function () {
        setPaginationMargin();
    });
    $(document).ajaxComplete(function () {
        setPaginationMargin();
        //show product delivery estimation 
        if ($('div.ty-product-block__button #ls_add_to_cart_button').length) {
            $('#ls_shipping_estimation').show();
        }
    });
    //close window button
    $('.ls_close_window').on('click', function () {
        $('.cm-popup-box.ty-dropdown-box__content').hide();
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

    });
    $('body').on('click', 'a.ls_delete_icon', function () { //product/s deleted from cart
        var obj = $(this);
        if (obj.parents('li').find('span.ls_cart_combination_hash').text() == $('.ls_product_combination_hash').first().text()) { //deleted product from current page
            var deleted_cart_amount=$(obj.parents('li').find('.ls_cart_product_amount').first()).text();
            var initial_product_amount =$('#ls_product_amount_availability').text();
            var final_amount=parseInt(initial_product_amount)+parseInt(deleted_cart_amount);
            console.log('final amount='+final_amount);
            $('#ls_product_amount_availability').html(final_amount);
           // $('#ls_product_amount_availability').html(initial_product_amount-deleted_cart_amount);
        }
    });
});