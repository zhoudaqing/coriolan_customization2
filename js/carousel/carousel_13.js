 //dev version
 //change the hardcoding
 $(document).ready(function(){
     console.log('carousel_13 11 cache');
     var id_recently_click='#sw_dropdown_269';
     var id_recently_block='#dropdown_269';
     var id_favorite_click='#sw_dropdown_279';
     var id_favorite_block='#dropdown_279';
     function carousel_footer(id_click, id_block,bigDiv,smallDiv) {
      //    $(id_click).on('click',function(){ //click to show dropup
            setTimeout(function(){
                  sliderUl=$(id_block).find('div.lsc_slider').css('overflow','hidden').children('ul'),
                  imgs=sliderUl.find('.lsc_li_container').filter(":visible"),
                  imgWidth=$('ul.recent_carousel_ul.lcs_fix li.clearfix.lsc_li_container').filter(":visible").first().outerWidth(true), //hardcoded width because of firefox bug(initial width 190)
                  imgsLen=imgs.length,
                  current=1, //remove
                  totalImgsWidth=imgsLen * imgWidth,
                  sliderLoc=1;
                  bigSlide=  adjustCarousel(imgWidth,bigDiv,smallDiv)/*11*/;
                  sliderUl.animate({
                  'margin-left': 0
                    })
                  console.log('BIGdIV, SMALLdIV: ',bigDiv,smallDiv);
                 console.log('bigSlide='+bigSlide+';imgsLen='+imgsLen/*+'; imgsLen='+imgsLen+'; sliderLoc='+sliderLoc+'; totalImgsWidth='+totalImgsWidth*/);
                  $(id_block).find('.lsc_slider-nav').show();
                  //disable next button if there are insuficient products
                 if (imgsLen>bigSlide) {
                     $(id_block).find('.lsc_next_b').prop("disabled",false);
                 } else {
                     $(id_block).find('.lsc_next_b').prop("disabled",true);
                 } 
                 //disable previous button by default
                 if (sliderLoc==1) {
                     $(id_block).find('.lsc_previous_b').prop("disabled",true);
                 }
          },100);
    //    });
    }
    function adjustCarousel(imgWidth,bigContainer,smallContainer) { //needs to be called when showing the div(in dropup carousel dev)             
              var bigcontainerWidth=bigContainer.filter(":visible").first().width(); //get the inner width without padding
              var containerWidth=smallContainer.filter(":visible").first().width();
              console.log('initial bigcontainerWidth='+bigcontainerWidth);
              console.log('initial containerWidth='+containerWidth);
              var bigSlide2=parseInt(bigcontainerWidth/imgWidth); 
              console.log('bigSlide2='+bigSlide2);
              var adjust=(bigSlide2*imgWidth)+15;
              console.log('adjust='+adjust);
              if (adjust!=0) {
                  smallContainer.css('width',adjust+'px');
                    console.log('final containerWidth='+containerWidth);
                    return bigSlide2;
              }
              else {
                  return 1;
              }
          }
    $(id_recently_click).on('click', function(){
        carousel_footer(id_recently_click,id_recently_block,$('div.ls_recent_carousel').find('div.lsc_wrap').first(),$('div.ls_recent_carousel').find('div.lsc_slider').first()); //recently carousel
    });
     $(id_favorite_click).on('click', function(){
        carousel_footer(id_favorite_click,id_favorite_block,$('div.ls_preferate_carousel').find('div.lsc_wrap').first(),$('div.ls_preferate_carousel').find('div.lsc_slider').first()); //favorites carousel
    });
         
      
         //update navigation when deleting items
        $('body').on('click','.lsc_next_b',function(){
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
            console.log('sliderLoc='+sliderLoc);
            console.log('imgsLen-bigSlide='+(imgsLen-bigSlide));
    });
     $('body').on('click','.lsc_previous_b',function(){
          sliderLoc=sliderLoc-bigSlide;
          console.log('backward, imgsLen: '+imgsLen+'; bigSlide:'+bigSlide+'; sliderLoc:'+sliderLoc);
          leftMargin=parseInt(sliderUl.css('marginLeft'));
          sliderUl.animate({
              'margin-left': leftMargin+(imgWidth*bigSlide)
            })
           if (sliderLoc<=(imgsLen-bigSlide)) {
                $('.lsc_next_b').prop("disabled",false);
             
            } else {
                console.log('next still disabled');
            }
            if (sliderLoc==1) {
                $('.lsc_previous_b').prop("disabled",true);
            }
     //       console.log('sliderLoc='+sliderLoc);
     //       console.log('leftMargin='+parseInt(sliderUl.css('marginLeft')));
    });
    
     function update_nav_carousel(id_block){  
         imgs=$(id_block).find('.lsc_li_container').filter(":visible");
         imgsLen=imgs.length;
         if (sliderLoc>(imgsLen-bigSlide)) {
                $('.lsc_next_b').prop("disabled",true);
            }
        console.log('update_nav_carousel: sliderLoc='+sliderLoc+';imgsLen='+imgsLen+';bigSlide='+bigSlide+';id_block: '+id_block);
     }
 $('body').on('click',' div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove',function() { 
      setTimeout(function () {
            check_block();
        }, 1500); //wait for ajax call and the subsquent removed item from frontend (replace with callback function)
 });
     function check_block() {
         if ($(id_favorite_block).is(':visible')){
            update_nav_carousel(id_favorite_block);
        } else {
            update_nav_carousel(id_recently_block);
        } 
     }     
});