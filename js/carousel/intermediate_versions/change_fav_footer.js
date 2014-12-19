$(document).ready(function() {
    //cache check
    console.log('CACHE change_fav int vers 10');
   // var declarations
   var footerFavId2;
   var products_update_url = fn_url('products.ls_wishlist_update'); //dispatch url for jquery ajax call
   var domain_url = 'http://coriolan.leadsoft.eu/index.php';
   var current_url=location.protocol + '//' + location.host + location.pathname; //used to generate product link
   var product_img_container="div.ty-product-block__img-wrapper.span10";
   var fav_block_id='#dropdown_279';
    $('body').on('click','div.ty-add-to-wish > a', function() { //user click on 'add product to wishlist'
       var ls_productId=$(this).attr('id');
       setTimeout(function(){
           var warning=$('#tygh_container div.cm-notification-content.notification-content.alert.alert-warning').first();
           if(!warning.length) {
              // if (!$('div.ls_mid_myaccount').has('a[href="'+current_url+'"]').length) { //product isn't already added
                  //replace the ajax call with a value returned by  the function down below
                        $.post( products_update_url, function( data ) {
                         $( "#ls_preferate_no2" ).html('('+data+')' );
                         $('#ls_preferate_no').html(data);
                      });
                //get the id required to delete the product from wishlist
                    ls_productId = ls_productId.substr(16);
                    console.log('ls_productId:'+ls_productId);
                    var request1 = $.ajax({
                        async: false,
                        url: domain_url+'?dispatch=index.getCartId&ls_productId=' + ls_productId,
                        dataType: 'html',
                        type: 'GET'
                    });
                    request1.done(function (msg) {

                        footerFavId2=msg;
                        console.log('getCartId msg:'+footerFavId2); 
                        //check to see if a main image exist(to prevent thumbs from being loaded in carousel by the selector below and then lost on refresh)
                      if(!$('div.ty-product-img.cm-preview-wrapper').find('span.ty-no-image').length) { //imagine exist, append it to carousel
                       //obtain the image
                       var fav_product_img=$(product_img_container).find('img').first().clone();
                       fav_product_img=$('<div>').append($(fav_product_img).clone()).html(); //wrap it in a div then get the html of the div for image markup
                       }
                      else {
                           fav_product_img='<span class="ty-no-image lsc_img"><i title="Nici o imagine" class="ty-no-image__icon ty-icon-image"></i></span>';
                       } 
                        var append_product='<div class="ty-twishlist-item testmulticolumnpre"><a href="http://coriolan.leadsoft.eu/index.php?dispatch=wishlist.delete&cart_id='+ footerFavId2+'" class="ty-twishlist-item__remove ty-remove" title="inlaturati"><i class="ty-remove__icon ty-icon-cancel-circle"></i></a></div><div class="ty-grid-list__image testgridlistfooter2">'+
                        '<a href="'+current_url+'?wishlist_id='+footerFavId2+'">'+fav_product_img+'</a></div>';
                     //check to see if the product already exist in favorites -
                    //check the number of li
                      if (!$('ul.recent_carousel_ul.lcs_fix').length==0) //first favorite addded - no carousel present
                      { 
                       $('div.ls_preferate_carousel ul.recent_carousel_ul.lcs_fix').append('<li class="clearfix lsc_li_container">'+append_product+'</li>');
                      }
                      else {
                          $('.ls_preferate_carousel').append('<ul class="recent_carousel_ul lcs_fix"><li class="clearfix lsc_li_container">'+append_product+'</li></ul>')
                      }
                         $('.ls_poza_myaccount').html('<ul><li class="clearfix lsc_li_container">'+append_product+'</li></ul>');
                         change_fav(false);
                    });
            }
       },1600);
       });
    function change_fav(remove,dec_no) {
        var no_fav=$(fav_block_id+' ul.recent_carousel_ul li.clearfix.lsc_li_container').length; //count all the li's with BOTH .clearfix AND .lsc_li_container
        console.log('number of ul li elements:'+no_fav);
        if (no_fav>1) { //hide login, 1 picture div and show carousel
            $('.ty-login.ls_signin').hide();
            $('.ls_poza_myaccount').hide();
            $('.ls_text_myaccount').parent().hide();
            $('.ls_buton').hide();
            $('.ls_preferate_carousel').show();
        }
        else {  //show login, 1 picture div and hide carousel
            //add 1 picture
            if (remove==true){ 
              //  var one_fav=$(fav_block_id+' ul.recent_carousel_ul li.clearfix.lsc_li_container').first().clone(); 
               // $('.ls_poza_myaccount').html('<ul><li class="clearfix lsc_li_container">'+one_fav.html+'</li></ul>');
               var one_fav=$(fav_block_id+' ul.recent_carousel_ul li.clearfix.lsc_li_container').first().clone();
               $('.ls_poza_myaccount').html(one_fav);
               console.log('product deleted');
                   if (dec_no==0) {
                        $('.ls_poza_myaccount').children().first().hide();
                   } else {
                       $('.ls_poza_myaccount').show();
                   }
            }
             $('.ty-login.ls_signin').show();
              $('.ls_text_myaccount').parent().show();
              $('.ls_buton').show();
             $('.ls_preferate_carousel').hide();
        }
    }
    function change_fav_load() {
        var no_fav=$(fav_block_id+' ul.recent_carousel_ul.lcs_fix li.clearfix.lsc_li_container').length;
        if (no_fav>1) { //hide login, 1 picture div and show carousel
            $('.ty-login.ls_signin').hide();
            $('.ls_poza_myaccount').hide();
            $('.ls_text_myaccount').hide();
            $('.ls_buton').hide();
            $('.ls_preferate_carousel').show();
        }
        else {  //show login, 1 picture div and hide carousel
            //add 1 picture
           var one_fav=$(fav_block_id+' ul.recent_carousel_ul li.clearfix.lsc_li_container').first().clone();
           $('.ls_poza_myaccount').html(one_fav);
             $('.ty-login.ls_signin').show();
              $('.ls_poza_myaccount').show();
              $('.ls_text_myaccount').show();
              $('.ls_buton').show();
             $('.ls_preferate_carousel').hide();
        }
    }
    change_fav_load();
   // $('.ty-twishlist-item__remove.ty-remove').on('click', function(){
      $('body').on('click',' div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove',function(event) { 
        event.preventDefault();
        var footerFavId = $(this).attr('href');
        footerFavId = footerFavId.substr(71);
        var request2 = $.ajax({
            url: 'http://coriolan.leadsoft.eu/index.php?dispatch=index.deleteFooter&footerFavId=' + footerFavId,
            dataType: 'html',
            type: 'GET'
        });
        request2.done(function (msg) {
            console.log(msg);
        });
        $(this).parents('li.clearfix.lsc_li_container').first().hide();
        //remove .clearfix ot lsc_li_container from the li
         $(this).parents('li.clearfix.lsc_li_container').first().removeClass( "clearfix" );
         
        var dec_no = $('#ls_preferate_no').html();
        dec_no--;
        if (!(dec_no == 0)) {
            $("#ls_preferate_no2").html('(' + dec_no + ')');
            $('#ls_preferate_no').html(dec_no);
        } else {
            $("#ls_preferate_no2").html('');
            $('#ls_preferate_no').html('0');
        }               
       // change_fav(true,dec_no); 
    });
});