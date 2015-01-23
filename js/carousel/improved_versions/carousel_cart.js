
//30days_13
//image slider
(function($){
    $(document).ready(function(){
        var id_dropdown='#dropdown_285';
      //  console.log('carousel_cart new v 00 cache');
        function update_carousel() {
      if ($('#ls_update_finish').length==0) {
              $('#ls_cart_no').after('<span id="ls_update_finish" style="display:none;"></span>');
             var sliderUl=$('div.ls-vertical-slider').css('overflow','hidden').children('ul'),
                 imgHeight=/*imgs[0].width*/117,
                 slideStep=1,
                 imgs=sliderUl.find('li');
                 imgsLen=imgs.length;
                 sliderLoc=1;
                 sliderUl.animate({
                  'margin-top': 0  
                });
                $('.ls-vertical-slider-nav').show();
                $('#ls-vertical-lsc_prev').prop("disabled",true);
                hideNav(imgsLen);
                 if (imgsLen>slideStep) {
                     $('#ls-vertical-lsc_next').prop("disabled",false);
                 } else {
                     $('#ls-vertical-lsc_next').prop("disabled",true);
                 } 
        //         console.log('carousel_cart: imgsLen='+imgsLen);
                     $('#ls-vertical-lsc_next').on('click',function(){
                       if (! $.timers.length) { //to wait for previous animation to end
               //           console.log('forward');
                          sliderLoc=sliderLoc+slideStep;
                          topMargin=parseInt(sliderUl.css('marginTop'));
                          sliderUl.animate({
                          'margin-top': topMargin-(imgHeight*slideStep)
                            });
                            if (sliderLoc>(imgsLen-slideStep)) {
                                $('#ls-vertical-lsc_next').prop("disabled",true);
                            }
                            $('#ls-vertical-lsc_prev').prop("disabled",false);
                            console.log('sliderLoc='+sliderLoc+';imgsLen-slideStep='+(imgsLen-slideStep));
                 //           console.log('topMargin='+parseInt(sliderUl.css('marginTop')));
                       }
                    });
                    $('#ls-vertical-lsc_prev').on('click',function(){
                       if (! $.timers.length) {
                   //       console.log('backward');
                          sliderLoc=sliderLoc-slideStep;
                          topMargin=parseInt(sliderUl.css('marginTop'));
                          sliderUl.animate({
                          'margin-top': topMargin+(imgHeight*slideStep)
                            })
                            if (sliderLoc<=(imgsLen-slideStep)) {
                                $('#ls-vertical-lsc_next').prop("disabled",false);
                                console.log('next show(): sliderLoc<=(imgsLen-slideStep)');
                            }                   
                            if (sliderLoc==1) {
                                $('#ls-vertical-lsc_prev').prop("disabled",true);
                            }
                          console.log('sliderLoc='+sliderLoc);
                  //          console.log('topMargin='+parseInt(sliderUl.css('margintop')));
                        }
                    });
                $('body').on('click','[id^=button_cart_]', function() {
                    setTimeout(function() {
                        update_carousel();
                    }, 1400);
                 /*   setTimeout(function() {
                        update_carousel();
                    }, 2800); */
                }); 
                $('body').on('click','div.ty-add-to-wish > a', function() {
                    setTimeout(function() {
                        update_carousel();
                    }, 1400);
                /*    setTimeout(function() {
                        update_carousel();
                    }, 2800); */
                }); 
            }
        }
        $('body').on('click.lsNameSpace', 'div.cm-cart-item-delete', function() {
            var obj = $(this);
            setTimeout(function() {
                update_carousel_delete(obj);
                console.log('delete cart product clicked');
            }, 600);
        });
        /*
         //does not return to first product after delete
        function update_carousel_delete(obj) {
            //hide deleted product
            setTimeout(function(){
            obj.parent().hide();
            var sliderUl = $('div.ls-vertical-slider').children('ul'),
                    imgHeight = 117,
                    slideStep = 1,
                    imgs = sliderUl.find('li').filter(":visible");
                    imgsLen = imgs.length;
            if (sliderLoc>(imgsLen-slideStep)) {
                $('#ls-vertical-lsc_next').prop("disabled",true);
            } else {
                $('#ls-vertical-lsc_next').prop("disabled",false);
            }
             console.log('update_carousel_delete: sliderLoc='+sliderLoc);
             console.log('imgsLen-slideStep='+(imgsLen-slideStep)+';clicked object: '+obj);
            },600);
        } */
         function update_carousel_delete(obj) {
            //hide deleted product
          //  setTimeout(function(){
            obj.parent().hide();
            var sliderUl = $('div.ls-vertical-slider').children('ul'),
                    imgHeight = 117,
                    slideStep = 1,
                    imgs = sliderUl.find('li').filter(":visible");
                    imgsLen = imgs.length;
                    sliderLoc=1;
                    hideNav(imgsLen);
            sliderUl.animate({
                  'margin-top': 0  
                });
                $('#ls-vertical-lsc_prev').prop("disabled", true);
                if (imgsLen>slideStep) {
                     $('#ls-vertical-lsc_next').prop("disabled",false);
                 } else {
                     $('#ls-vertical-lsc_next').prop("disabled",true);
                 }
             if (imgsLen==0) { //executed only on delete(cs-cart does the rest of the job after refresh) 
                 //hide view cart, processing and display the carty is empty text 
                 $('div.cm-cart-buttons.ty-cart-content__buttons.buttons-container.full-cart').find('div.ls_bottom_cart_view').first().hide();
                 $('div.cm-cart-buttons.ty-cart-content__buttons.buttons-container.full-cart').find('div.ls_bottom_cart_checkout').first().hide(); 
                 $('div.cm-cart-buttons.ty-cart-content__buttons.buttons-container.full-cart').find('div.ls_continue_shopping').first().show();
                 $('ul.ls_vertical_cart_ul').remove();
                 if ($('#sw_select_en_wrap_language').length) {
                        if ($('div.ty-cart-items__empty.ty-center').length == 0) {
                            $('div.ls-vertical-slider.ls-vertical-lsc_container').append('<div class="ty-cart-items__empty ty-center">Cart is empty</div>');
                        }
                 } else {
                        if ($('div.ty-cart-items__empty.ty-center').length == 0) {
                            $('div.ls-vertical-slider.ls-vertical-lsc_container').append('<div class="ty-cart-items__empty ty-center">Cosul este gol</div>');
                        }
                 }
             }
             console.log('slideStep: '+slideStep);
             console.log('imgsLen: '+imgsLen);
         //   },600);
        }
        function hideNav(noProducts){
            if(noProducts<=1) {
                $('#ls-vertical-lsc_next').css('visibility', 'hidden');
                $('#ls-vertical-lsc_prev').css('visibility', 'hidden');
                $('div.ls-vertical-slider-nav').hide();
            } else {
                $('#ls-vertical-lsc_next').css('visibility', 'visible');
                $('#ls-vertical-lsc_prev').css('visibility', 'visible');
                $('div.ls-vertical-slider-nav').show();
            }
        }
        //close carousel
        $('body').on('click','div.ls_continue_shopping', function() {
            $(id_dropdown).hide();
        });
        update_carousel();
    });
})(jQuery); 
