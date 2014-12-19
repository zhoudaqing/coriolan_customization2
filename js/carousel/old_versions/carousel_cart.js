
//30days_13
//image slider
(function($){
    function update_carousel() {
     var sliderUl=$('div.ls-vertical-slider').css('overflow','hidden').children('ul'),
         imgHeight=/*imgs[0].width*/117,
         slideStep=1,
         imgs=sliderUl.find('li'),
         imgsLen=imgs.length,
         sliderLoc=1;
         sliderUl.animate({
          'margin-top': 0  
        });
        $('.ls-vertical-slider-nav').show();
        $('#ls-vertical-lsc_prev').hide();
         if (imgsLen>slideStep) {
             $('#ls-vertical-lsc_next').show();
         } else {
             $('#ls-vertical-lsc_next').hide();
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
                        $('#ls-vertical-lsc_next').hide();
                    }
                    $('#ls-vertical-lsc_prev').show();
           //         console.log('sliderLoc='+sliderLoc);
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
                        $('#ls-vertical-lsc_next').show();
                    }
                    if (sliderLoc==1) {
                        $('#ls-vertical-lsc_prev').hide();
                    }
           //         console.log('sliderLoc='+sliderLoc);
          //          console.log('topMargin='+parseInt(sliderUl.css('margintop')));
                }
            });
        $('body').on('click','div.cm-cart-item-delete', function() {
            setTimeout(function() {
                update_carousel();
            }, 1400);
        });
        $('body').on('click','[id^=button_cart_]', function() {
            setTimeout(function() {
                update_carousel();
            }, 1400);
        }); 
        $('body').on('click','div.ty-add-to-wish > a', function() {
            setTimeout(function() {
                update_carousel();
            }, 1400);
        }); 
    }
    update_carousel();
    //update carousel
    $('#ls-vertical-update').on('click', function() {
        update_carousel();
    });
 /*   $('div.cm-cart-item-delete').on('click', function() {
        setTimeout(function() {
               update_carousel();
                }, 1400); 
    });
    $('[id^=button_cart_]').on('click', function() {
        setTimeout(function() {
               update_carousel();
                }, 1400); 
    });   */   
})(jQuery); 
