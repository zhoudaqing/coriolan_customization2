/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//add favorite product to carousel
$(document).ready(function() {
    $('.ty-add-to-wish > a').on('click', function() {
       var current_url=document.URL;
       //var $elems = $('.ty-column > a[href="'+current_url+'"]');
     /*  $('.ty-grid-list__item-name').each(function() {
           console.log($(this).children('a'));
       })
       //var length = $elems.length;
       if( length) {
       console.log('product added to wishlist');
       } 
       else {
       console.log('this product already exist in wishlist');
       } */
                var append_product='<div class="ty-column5">'+  
                '<div class="ty-grid-list__item ty-quick-view-button__wrapper"><form action="http://coriolan.leadsoft.eu/" method="post" name="product_form_2680" enctype="multipart/form-data" class="cm-disable-empty-files  cm-ajax cm-ajax-full-render cm-ajax-status-middle  cm-processed-form"> '+
                '<input type="hidden" name="result_ids" value="cart_status*,wish_list*,checkout*,account_info*">'+
                '<input type="hidden" name="redirect_url" value="index.php?dispatch=products.view&amp;product_id=2680">'+
                '<input type="hidden" name="product_data[2680][product_id]" value="2680">'+
                '<div class="ty-twishlist-item">'+
                 '<a href="http://coriolan.leadsoft.eu/index.php?dispatch=wishlist.delete&amp;cart_id=1791425091" class="ty-twishlist-item__remove ty-remove" title="inlaturati"><i class="ty-remove__icon ty-icon-cancel-circle"></i><span class="ty-twishlist-item__txt ty-remove__txt">inlaturati</span></a>'+
                '</div>'+
                '<div class="ty-grid-list__image testgridlistfooter">'+
                        '<a href="http://coriolan.leadsoft.eu/pietre-pretioase-diamante-perle/pietre-q1/piatra-q1-test2/">'+
                        '<img class="ty-pict   " id="det_img_2680" src="http://coriolan.leadsoft.eu/images/thumbnails/150/150/detailed/1/diamond-round-g-vs_bj73-8h.jpg" alt="" title="">'+
                    '</a>'+

                    '</div><div class="ty-grid-list__item-name">'+
                           ' <a href="http://coriolan.leadsoft.eu/pietre-pretioase-diamante-perle/pietre-q1/piatra-q1-test2/" class="product-title" title="Diamant Rotund 3.5 mm G VS1 0.17 ct">Diamant Rotund 3.5 mm G VS1 0.17 ct</a>    '+

                '</div><div class="ty-grid-list__price ">            <span class="cm-reload-2680" id="old_price_update_2680">'+                                
                      '  <!--old_price_update_2680--></span>'+
                       ' <span class="cm-reload-2680 ty-price-update" id="price_update_2680">'+
                      '  <input type="hidden" name="appearance[show_price_values]" value="1">'+
                     '   <input type="hidden" name="appearance[show_price]" value="1">'+

                      '  <span class="ty-price" id="line_discounted_price_2680"><span id="sec_discounted_price_2680" class="ty-price-num">1.466,00</span>&nbsp;<span class="ty-price-num">RON</span></span>'+                           
                                       ' <!--price_update_2680--></span>'+
                       ' </div><div class="grid-list__rating">  '  +

                '</div><div class="ty-grid-list__control"><div class="ty-quick-view-button">'+

                                       ' <a class="ty-btn ty-btn__secondary ty-btn__big cm-dialog-opener cm-dialog-auto-size" data-ca-view-id="2680" data-ca-target-id="product_quick_view" href="http://coriolan.leadsoft.eu/index.php?dispatch=products.quick_view&amp;product_id=2680&amp;prev_url=index.php%3Fdispatch%3Dproducts.view%26product_id%3D2680&amp;n_plain=Y&amp;n_items=1845%2C2680" data-ca-dialog-title="Vizualizator direct produse" rel="nofollow">Vizualizare rapida</a>'+
                '</div></div>'+
                '</form>'+
                '</div></div>';
      $('.ls_total_bijuterie').children('.grid-list').append(append_product);
      console.log('product added');
       });
                           }
               );
