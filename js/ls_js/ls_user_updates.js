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
    $('body').on('click', 'i.ls_delete_icon', function () {
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
    //style the header,filters,categories on scroll 
    function styleOnScroll() {
        var scroll = $(window).scrollTop();
        //display header
        if (scroll == 0) {
            $('.tygh-top-panel.clearfix').removeClass("ls_header_inactive");
            $('.tygh-header.clearfix').removeClass("ls_categories_active");
        } else { //hide header, make categories menu fixed
            $('.tygh-top-panel.clearfix').addClass("ls_header_inactive");
            $('.tygh-header.clearfix').addClass("ls_categories_active");
        }
        //make filters fixed
        if ($('.filtre_orizontala_wrapper').length) {
            if (scroll >= 80) {
                $('.span16.main-content-grid').addClass("ls_filters_active");
            } else {
                $('.span16.main-content-grid').removeClass("ls_filters_active");
            }
        }
    }
    //pagination positioning
    setPaginationMargin();
    function setPaginationMargin() {
        if ($(window).width() > 800) {
            var pagination_margin = ($(window).width() - $('.container-fluid.content-grid').outerWidth(false)) / 2;
            console.log('pagination_margin:' + pagination_margin);
            $('.ty-pagination__bottom').css('right', pagination_margin);
        } else {
            console.log('width<800');
            $('.ty-pagination__bottom').css('right', 0);
        }
    }
    //return to top
    function returnToTop() {
        $('body').on('click', 'div.ls_pagination_return_click', function () {
            $("html, body").animate({scrollTop: 0}, "slow");
            return false;
        });
    }
    ;
    returnToTop();
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
        }, 2000);
    });
    $('#myModal1').on('hide.bs.modal', function (e) {
        $('#tygh_main_container').children('tygh-top-panel.clearfix').css("zIndex", 2)
    });
    //show product delivery estimation 
    if ($('div.ty-product-block__button #ls_add_to_cart_button').length) {
        $('#ls_shipping_estimation').show();
    }
});

