
//30days_13
//image slider
(function($){
    $(document).ready(function(){
        console.log('carousel_cart new v 1 cache');
        function update_carousel() {
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
            $('#ls-vertical-lsc_prev').prop("disabled",true);;
             if (imgsLen>slideStep) {
                 $('#ls-vertical-lsc_next').prop("disabled",false);;
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
                            $('#ls-vertical-lsc_next').prop("disabled",true);;
                        }
                        $('#ls-vertical-lsc_prev').prop("disabled",false);;
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
            $('body').on('click','div.cm-cart-item-delete', function() {
                    update_carousel_delete($(this));
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
        function update_carousel_delete(obj) {
            //hide deleted product
            setTimeout(function(){
            obj.parent().hide();
            var sliderUl = $('div.ls-vertical-slider').children('ul'),
                    imgHeight = /*imgs[0].width*/117,
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
        }
        update_carousel();
    });
})(jQuery); 
