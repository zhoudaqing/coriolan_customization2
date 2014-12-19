 //dev version
 //change the hardcoding
 $(document).ready(function(){
 //    console.log('carousel_13 cache');
     var id_recently_click='#sw_dropdown_269';
     var id_recently_block='#dropdown_269';
     var id_favorite_click='#sw_dropdown_279';
     var id_favorite_block='#dropdown_279';
     function carousel_footer(id_click, id_block) {
          $(id_click).on('click',function(){ //click to show dropup
                  sliderUl=$(id_block).find('div.lsc_slider').css('overflow','hidden').children('ul'),
                  imgs=$(id_block).find('.lsc_li_container'),
                  imgWidth=/*imgs[0].width/14*/170, //hardcoded width because of firefox bug
                  imgsLen=imgs.length,
                  current=1, //remove
                  totalImgsWidth=imgsLen * imgWidth,
                  bigSlide=/*parseInt($('.lsc_slider').width()/170) */ 11,
                  sliderLoc=1;
             //     console.log('bigSlide='+bigSlide+';imgWidth='+imgWidth+'; imgsLen='+imgsLen+'; sliderLoc='+sliderLoc+'; totalImgsWidth='+totalImgsWidth);
                  $(id_block).find('.lsc_slider-nav').show();
                  //disable next button by default
                 if (imgsLen>bigSlide) {
                     $(id_block).find('.lsc_next_b').prop("disabled",false);
                 } else {
                     $(id_block).find('.lsc_next_b').prop("disabled",true);
                 } 
                 //disable previous button by default
                 if (sliderLoc==1) {
                     $(id_block).find('.lsc_previous_b').prop("disabled",true);
                 }
            });
    }
    
         carousel_footer(id_recently_click,id_recently_block); //recently carousel
         carousel_footer(id_favorite_click,id_favorite_block); //favorites carousel
         //update navigation when deleting items
        $('.lsc_next_b').on('click',function(){
     //     console.log('forward, imgsLen='+imgsLen);
          sliderLoc=sliderLoc+bigSlide;
          leftMargin=parseInt(sliderUl.css('marginLeft'));
          sliderUl.animate({
              'margin-left': leftMargin-(imgWidth*bigSlide)  
            });
            if (sliderLoc>(imgsLen-bigSlide)) {
                $('.lsc_next_b').prop("disabled",true);
            }
            $('.lsc_previous_b').prop("disabled",false);
     //       console.log('sliderLoc='+sliderLoc);
    //        console.log('leftMargin='+parseInt(sliderUl.css('marginLeft')));
    });
     $('.lsc_previous_b').on('click',function(){
    //      console.log('backward, imgsLen'+imgsLen);
          sliderLoc=sliderLoc-bigSlide;
          leftMargin=parseInt(sliderUl.css('marginLeft'));
          sliderUl.animate({
              'margin-left': leftMargin+(imgWidth*bigSlide)
            })
          //  if (sliderLoc<(imgsLen-bigSlide)) {
                $('.lsc_next_b').prop("disabled",false);
          //  }
            if (sliderLoc==1) {
                $('.lsc_previous_b').prop("disabled",true);
            }
     //       console.log('sliderLoc='+sliderLoc);
     //       console.log('leftMargin='+parseInt(sliderUl.css('marginLeft')));
    });
          
});