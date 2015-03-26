$(document).ready(function () {
    //cache check
    //console.log('CACHE change_fav 2');
    // var declarations
    ls_global_vars={};
    ls_global_vars.move_combination_hash='';
    var footerFavId2;
    var products_update_url = fn_url('products.ls_wishlist_update'); //dispatch url for jquery ajax call
    var domain_url = 'http://coriolan.leadsoft.eu/index.php';
    var product_img_container = "div.ty-product-block__img-wrapper";
    var fav_block_id = '#dropdown_279';
    ls_add_product_to_fav = false;
    ls_move_to_fav_do_ajax = false;
    ls_move_to_fav = false;
    function update_nr_fav(update, ls_async, add_product_footer) {
        ls_async = typeof ls_async !== 'undefined' ? ls_async : true;
        add_product_footer = typeof add_product_footer !== 'undefined' ? add_product_footer : false;
        if (update == true) { //needs timeout when called on this mode(session vars are not updated imediatly)
            var request0 = $.ajax({
                type: 'POST',
                url: products_update_url,
                async: ls_async
            });
            request0.done(function (msg) {
                if (msg != 0) {
                    $("#ls_preferate_no2").html('(' + msg + ')');
                    //           console.log('no of wishlist items ' + msg);
                } else {
                    $("#ls_preferate_no2").html('');
                    //          console.log('no items in shortlist');
                }
                $('#ls_preferate_no').html(msg);
                nr_fav_session = parseInt($('#ls_preferate_no').html());
                if (add_product_footer) {
                    compareFavoriteProductsTotal();
                }
            });
            nr_fav_session = parseInt($('#ls_preferate_no').html());
            return nr_fav_session;
        }
        else {
            var nr_fav_html = parseInt($('#ls_preferate_no').html());
            return nr_fav_html;
        }
    }
    function change_fav_content(no_fav) {
        if (no_fav > 0) {
            $('.ls_preferate_1').show();
            $('.ls_preferate_2').hide();
        } else {
            $('.ls_preferate_1').hide();
            $('.ls_preferate_2').show();
        }
    }
    $('body').on('click', 'div.ty-add-to-wish > a', function () { //user click on 'add product to wishlist'
        ls_add_product_to_fav = true;
        ls_productId = $(this).data("ca-dispatch"); //use dispatch instead of id for quick view functionality
        link_clicked = $(this);
        nr_fav_html = update_nr_fav(false);
        ls_global_vars.move_combination_hash=link_clicked.parents('form').find('span.ls_product_combination_hash').first().text();
        console.log('ls_global_vars.move_combination_hash: '+ls_global_vars.move_combination_hash);
    });
    //move product to wishlist
    $('body').on('click', 'span.ls_move_to_wishlist', function () { 
        ls_move_to_fav = true;
        ls_move_to_fav_do_ajax=true;
     //   ls_move_to_fav_do_ajax = true;
        link_clicked = $(this);
   //     ls_productId = link_clicked.data("ca-dispatch"); //use dispatch instead of id for quick view functionality
        nr_fav_html = update_nr_fav(false);
        ls_global_vars.move_combination_hash=link_clicked.parents('li').first().find('span.ls_cart_combination_hash').first().text();
    });
    $(document).ajaxComplete(function () {
        if (ls_add_product_to_fav) {
            ls_add_product_to_fav = false;
            addToFavoriteFooter();
        }
        if (ls_move_to_fav_do_ajax) {
            ls_move_to_fav_do_ajax=false
            addToFavoriteFooter();
        } 
    });
    function addToFavoriteFooter() {
        update_nr_fav(true, false, true);
    };
    function compareFavoriteProductsTotal() {
        if (nr_fav_session != nr_fav_html) { //product isn't already added
            if(ls_move_to_fav){ //if move to cart clicked
               console.log('compareFavoriteProductsTotal - move_to_fav true');
               var li=link_clicked.parents('li').first();
               ls_productId=li.find('.ls_cart_combination_id').first().text();
            } else { //add to shortlistclicked
                console.log('compareFavoriteProductsTotal - move_to_fav false');
            //get the id required to delete the product from wishlist
                ls_productId = ls_productId.substring(ls_productId.lastIndexOf(".") + 1, ls_productId.lastIndexOf("]"));
            }
             var generate_wishlist_markup_url=fn_url('index.ls_generate_wishlist_markup'); 
             var current_url=location.protocol + '//' + location.host + location.pathname;
             var request1 = $.ajax({
                dataType: "json",
                url: generate_wishlist_markup_url,
                type: 'POST',
                data: {
                    ls_productId: ls_productId,
                    combination_hash: ls_global_vars.move_combination_hash,
                    current_url: current_url
                    }
            });
            request1.done(function (msg) { 
                change_fav_content(1); //show or hide single image/carousel
                var append_product = jQuery.parseJSON(msg.text);
                //append products base on login status and no of favorite products
                if (nr_fav_session != 1)
                {
                    $('div.ls_preferate_carousel ul.recent_carousel_ul.lcs_fix').append('<li class="clearfix lsc_li_container">' + append_product + '</li>');
                    //         console.log('nr_fav_session!=1 append');
                }
                else {
                    if (nr_fav_session == 1) {
                        //first favorite addded - no carousel present
                        //add carousel html
                        if ((parseInt($('#ls_user_logged_in').html())) == 0) { //if not logged in
                            $('div.ls_mid_myaccount div.ls_poza_myaccount').after('<div class="ls_preferate_carousel" style="display: none;"><div class="lsc_wrap"><div class="lsc_slider" style="overflow: hidden;"> <ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">' + append_product + '</li></ul></div><div class="lsc_slider-nav"><span class="ls_nav_bullets"></span><button data-dir="prev" class="lsc_previous_b" disabled="">Previous</button><button data-dir="next" class="lsc_next_b" disabled="">Next</button></div></div></div>');
                        }
                        else {
                            $('div.ls_mid_myaccount').append('<div class="ls_preferate_carousel" style="display: none;"><div class="lsc_wrap"><div class="lsc_slider" style="overflow: hidden;"> <ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">' + append_product + '</li></ul></div><div class="lsc_slider-nav"><span class="ls_nav_bullets"></span><button data-dir="prev" class="lsc_previous_b" disabled="">Previous</button><button data-dir="next" class="lsc_next_b" disabled="">Next</button></div></div></div>');
                        }
                        //   $('.ls_preferate_carousel').append('<ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">'+append_product+'</li></ul>');
                        //bind carousel_13 events to the new markup ? or indirect binding through body is enoough?(also if no_fav_session=2 you must show carousel)
                    }
                }
                if ((parseInt($('#ls_user_logged_in').html())) == 0) {
                    $('.ls_poza_myaccount').html('<ul><li class="clearfix lsc_li_container">' + append_product + '</li></ul>');
                }
                change_fav(false, nr_fav_session);
            });
            /*
            var request1 = $.ajax({
                dataType: "html",
                //  async: false,
                url: domain_url + '?dispatch=index.getCartId&ls_productId=' + ls_productId,
                type: 'GET'
            });
            request1.done(function (msg) {
                change_fav_content(1);
                console.log('ls_productId ', ls_productId + ';link_clicked ', link_clicked);
                var footerFavId2 = msg;
                //       console.log(' getCartId msg:' + footerFavId2);
                if ($('div.ty-quick-view__wrapper').length == 0) { //product page
                    if (link_clicked.parents('div.ty-product-list.clearfix').length == 0) { //added main product
                        //              console.log('original product added');
                        var ls_product_url = location.protocol + '//' + location.host + location.pathname; //used to generate product link in product page
                        //           console.log('product page product url: ' + ls_product_url);
                        //check to see if a main image exist(to prevent thumbs from being loaded in carousel by the selector below and then lost on refresh)
                        if (!$('div.ty-product-img.cm-preview-wrapper').find('span.ty-no-image').length) { //imagine exist, append it to carousel
                            //obtain the image
                            var fav_product_img = $(product_img_container).find('img').first().clone();
                            fav_product_img = $('<div>').append($(fav_product_img).clone()).html(); //wrap it in a div then get the html of the div for image markup
                        }
                        else {
                            fav_product_img = '<span class="ty-no-image lsc_img"><i title="Nici o imagine" class="ty-no-image__icon ty-icon-image"></i></span>';
                        }
                    }
                    else {  //added required product
                        //           console.log('product added from required products');
                        var fav_link_parent = link_clicked.parents('div.ty-product-list.clearfix').first();
                        var ls_product_url = fav_link_parent.find('a.product-title').first().attr("href");
                        if (fav_link_parent.find('img').length) { //image exists
                            var fav_product_img = fav_link_parent.find('img').first().clone();
                            fav_product_img = $('<div>').append($(fav_product_img).clone()).html(); //wrap it in a div then get the html of the div for image markup
                        } else { //image does not exist 
                            fav_product_img = '<span class="ty-no-image lsc_img"><i title="Nici o imagine" class="ty-no-image__icon ty-icon-image"></i></span>';
                        }
                    }

                } else { //category page
                    var ls_product_url = $('div.ty-quick-view__wrapper').find('a.ty-quick-view__title').first().attr("href");
                    //get the image if it exists
                    if ($('div.ty-quick-view__wrapper div.ty-product-img').find('img').length) { //image exists
                        var fav_product_img = $('div.ty-quick-view__wrapper div.ty-product-img').find('img').first().clone();
                        fav_product_img = $('<div>').append($(fav_product_img).clone()).html(); //wrap it in a div then get the html of the div for image markup
                    } else { //image does not exist 
                        fav_product_img = '<span class="ty-no-image lsc_img"><i title="Nici o imagine" class="ty-no-image__icon ty-icon-image"></i></span>';
                    }
                }
                var append_product = '<div class="ty-twishlist-item testmulticolumnpre"><a href="http://coriolan.leadsoft.eu/index.php?dispatch=wishlist.delete&cart_id=' + footerFavId2 + '" class="ty-twishlist-item__remove ty-remove" title="inlaturati"><i class="ty-remove__icon ty-icon-cancel-circle"></i></a></div><div class="ty-grid-list__image testgridlistfooter2">' +
                        '<a href="' + ls_product_url + '?wishlist_id=' + footerFavId2 + '">' + fav_product_img + '</a></div>';
                //append products base on login status and no of favorite products
                if (nr_fav_session != 1)
                {
                    $('div.ls_preferate_carousel ul.recent_carousel_ul.lcs_fix').append('<li class="clearfix lsc_li_container">' + append_product + '</li>');
                    //         console.log('nr_fav_session!=1 append');
                }
                else {
                    if (nr_fav_session == 1) {
                        //first favorite addded - no carousel present
                        //add carousel html
                        if ((parseInt($('#ls_user_logged_in').html())) == 0) { //if not logged in
                            $('div.ls_mid_myaccount div.ls_poza_myaccount').after('<div class="ls_preferate_carousel" style="display: none;"><div class="lsc_wrap"><div class="lsc_slider" style="overflow: hidden;"> <ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">' + append_product + '</li></ul></div><div class="lsc_slider-nav"><span class="ls_nav_bullets"></span><button data-dir="prev" class="lsc_previous_b" disabled="">Previous</button><button data-dir="next" class="lsc_next_b" disabled="">Next</button></div></div></div>');
                        }
                        else {
                            $('div.ls_mid_myaccount').append('<div class="ls_preferate_carousel" style="display: none;"><div class="lsc_wrap"><div class="lsc_slider" style="overflow: hidden;"> <ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">' + append_product + '</li></ul></div><div class="lsc_slider-nav"><span class="ls_nav_bullets"></span><button data-dir="prev" class="lsc_previous_b" disabled="">Previous</button><button data-dir="next" class="lsc_next_b" disabled="">Next</button></div></div></div>');
                        }
                        //   $('.ls_preferate_carousel').append('<ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">'+append_product+'</li></ul>');
                        //bind carousel_13 events to the new markup ? or indirect binding through body is enoough?(also if no_fav_session=2 you must show carousel)
                    }
                }
                if ((parseInt($('#ls_user_logged_in').html())) == 0) {
                    $('.ls_poza_myaccount').html('<ul><li class="clearfix lsc_li_container">' + append_product + '</li></ul>');
                }
                change_fav(false, nr_fav_session);
            });
            */
        } else {
            console.log('fav product already added');
        }
      ls_move_to_fav=false;
    }
    function change_fav(remove, nr_fav_session) {
        if ((parseInt($('#ls_user_logged_in').html())) == 0) {
            //       console.log('number of fav products change_fav:' + nr_fav_session);
            if (nr_fav_session > 1) { //hide login, 1 picture div and show carousel
                $('div.ls_mid_myaccount .ty-login.ls_signin').hide();
                $('.ls_poza_myaccount').hide();
                $('.ls_text_myaccount').parent().hide();
                $('div.ls_mid_myaccount .ls_buton').hide();
                $('.ls_preferate_carousel').show();
            }
            else {  //show login, 1 picture div and hide carousel
                //add 1 picture
                if (remove == true) {
                    if (nr_fav_session == 1) {
                        var one_fav = $(fav_block_id + ' ul.recent_carousel_ul li.clearfix.lsc_li_container').first().clone();
                        $('.ls_poza_myaccount').html(one_fav);
                        $('.ls_poza_myaccount').show();
                    }
                    if (nr_fav_session == 0) {
                        $('.ls_poza_myaccount').children().first().hide();
                    }
                }
                $('div.ls_mid_myaccount .ty-login.ls_signin').show();
                $('.ls_text_myaccount').parent().show();
                $('div.ls_mid_myaccount .ls_buton').show();
                $('.ls_preferate_carousel').hide();
            }
        }
    }
    function change_fav_load() {
        var no_fav = $(fav_block_id + ' ul.recent_carousel_ul.lcs_fix li.clearfix.lsc_li_container').length;
        change_fav_content(no_fav);
        if (no_fav > 1) { //hide login, 1 picture div and show carousel
            $('div.ls_mid_myaccount .ty-login.ls_signin').hide();
            $('.ls_poza_myaccount').hide();
            $('.ls_text_myaccount').parent().hide();
            $('div.ls_mid_myaccount .ls_buton').hide();
            $('.ls_preferate_carousel').show();
        }
        else {
            if (no_fav == 1) {
                ////show login, 1 picture div and hide carousel
                //add 1 picture
                var one_fav = $(fav_block_id + ' ul.recent_carousel_ul li.clearfix.lsc_li_container').first().clone();
                $('.ls_poza_myaccount').html(one_fav);
                $('.ls_mid_myaccount .ty-login.ls_signin').show();
                $('.ls_poza_myaccount').show();
                $('.ls_text_myaccount').parent().show();
                $('div.ls_mid_myaccount .ls_buton').show();
                $('.ls_preferate_carousel').hide();
            }
        }
    }
    if ((parseInt($('#ls_user_logged_in').html())) == 0) {
        change_fav_load();
    }
    //remove fav product from footer
    $('body').on('click', ' div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove', function (event) { 
        event.preventDefault();
        var removeButton = $(this);
        ls_removeFavoriteProduct(removeButton,$('div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove'));
     /*   if (!removeButton.hasClass('ls_no_delete')) {
            $('div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove').addClass('ls_no_delete');
            var footerFavId = removeButton.parents('li').first().find('span.ls_cart_combination_hash').text();
            var request2 = $.ajax({
                url: 'http://coriolan.leadsoft.eu/index.php?dispatch=index.ls_deleteFavProduct&footerFavId=' + footerFavId,
                dataType: 'html',
                type: 'GET'
            });
            request2.done(function (msg) {
                //         console.log(msg);
                removeButton.parents('li.clearfix.lsc_li_container').first().remove();
                setTimeout(function () {
                    $('div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove').removeClass('ls_no_delete');
                    var nr_fav_session = update_nr_fav(true, false, false);
                    change_fav_content(nr_fav_session);
                    change_fav(true, nr_fav_session);
                }, 400);
            });
        } */
    });
    //remove favorite product from footer when moving product to cart
    $('body').on('click', 'div.ls_mid_myaccount input.ls_move_to_cart', function (event) { //remove fav product from footer
     //   event.preventDefault();
        var removeButton = $(this);
        ls_removeFavoriteProduct(removeButton,$('div.ls_mid_myaccount input.ls_move_to_cart'));
    });
   function ls_removeFavoriteProduct(removeButton, similarButtons) {
         if (!removeButton.hasClass('ls_no_delete')) {
           similarButtons.addClass('ls_no_delete');
            var footerFavId = removeButton.parents('li').first().find('span.ls_cart_combination_hash').text();
            var removeFavoriteProduct_url = fn_url('index.ls_deleteFavProduct');
            console.log('ls_removeFavoriteProduct footerFavId='+footerFavId+';removeFavoriteProduct_url'+removeFavoriteProduct_url);
            var request2 = $.ajax({
                url: removeFavoriteProduct_url+'&footerFavId=' + footerFavId,
                dataType: 'html',
                type: 'GET'
            });
            request2.done(function (msg) {
                console.log(msg);
              //  removeButton.parents('li.clearfix.lsc_li_container').first().remove();
                setTimeout(function () {
                    similarButtons.removeClass('ls_no_delete');
                    var nr_fav_session = update_nr_fav(true, false, false);
                    change_fav_content(nr_fav_session);
                    change_fav(true, nr_fav_session);
                }, 400);
            });
        } else {
            console.log('ls_removeFavoriteProduct has class ls_no_delete');
        }
   }
});