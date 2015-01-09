
function SliderOpb(smallContainer, bigContainer, id_click, id_block) {
    var currentObj = this;
    this.smallContainer = smallContainer;
    this.bigContainer = bigContainer;
    this.id_click = id_click;
    this.id_block = id_block;
    this.sliderUl = $(this.id_block).find('div.lsc_slider').css('overflow', 'hidden').children('ul');
    this.nav = $(id_block).find('.lsc_slider-nav').first();
    this.imgs = this.sliderUl.find('.lsc_li_container'); //if you don't filter visible use remove on deleting items
    this.imgWidth = this.sliderUl.find('li.clearfix.lsc_li_container').first().outerWidth(true);
    this.imgsLen = this.imgs.length;
    this.current = 1;
    var currentPosition = this.current;
    (function() {
        //add navigation event binding for visible carousels
        $('body').on('click', '.lsc_next_b', function() {
            if ($(currentObj.id_block).is(':visible')) {
                currentObj.setCurrent('next'); //setCurrent must be called before transition
                currentObj.transition();
                //update the navigation
                currentObj.update();
                //enable previous button
                $(currentObj.id_block).find('.lsc_previous_b').prop("disabled", false);
            }
        });
        $('body').on('click', '.lsc_previous_b', function() {
            if ($(currentObj.id_block).is(':visible')) {
                currentObj.setCurrent('prev'); //setCurrent must be called before transition
                currentObj.transition();
                //update the navigation
                currentObj.update();
            }
        });
        //adjust the carousel on window resize
        $(window).resize(function() {
            currentObj.resizeCarousel();
            //update the navigation
            currentObj.update();
        });
        //disable previous button if the navigation position=0
        if (currentPosition == 1) {
            $(currentObj.id_block).find('.lsc_previous_b').prop("disabled", true);
        }
        ;
    })();
}
SliderOpb.prototype.transition = function(coords) { //optionally pass coordonates
    this.sliderUl.animate({
        'margin-left': coords || -((this.current - 1) * this.imgWidth) //coordonates or default
    })
    console.log('this.current ' + this.current + ';this.imgWidth' + this.imgWidth)
};
SliderOpb.prototype.setCurrent = function(dir) {
    // var pos=this.current;
    if (dir === 'next') {
        this.current += this.bigSlide;
    } else {
        this.current -= this.bigSlide;
    }
    this.current = (this.current < 1) ? 1 : this.current;
    console.log(this.current);
    // return pos;
};
SliderOpb.prototype.update = function() { //update no of elements on removing/adding products and the coresponding navigation
    //update no of elements
    this.sliderUl = $(this.id_block).find('div.lsc_slider').css('overflow', 'hidden').children('ul');
    this.imgs = this.sliderUl.find('.lsc_li_container'); //if you don't filter visible use remove on deleting items
    this.imgsLen = this.imgs.length;
    console.log('imgsLen: ' + this.imgsLen);
    //update this.bigSlide
    this.getBigSlide();
    //update the navigation 
    if (this.current > (this.imgsLen - this.bigSlide)) {
        $(this.id_block).find('.lsc_next_b').prop("disabled", true);
    }
    if (this.current <= (this.imgsLen - this.bigSlide)) {
        $(this.id_block).find('.lsc_next_b').prop("disabled", false);

    } else {
        console.log('next still disabled');
    }
    if (this.current == 1) {
        $(this.id_block).find('.lsc_previous_b').prop("disabled", true);
    }
    //move the carousel back if necesary(on deleting the last item from a slide)
    if (this.current>this.imgsLen) {
        this.returnTofirst();
    }
    
};
SliderOpb.prototype.resizeCarousel = function() { //called when showing the div(in dropup carousel dev( and make the carousel responsive)
    //adjust the navigation animation based on the width of the smallContainer(wich is based on the with of the window)       
    if ($(this.id_block).is(':visible')) { //does not work well with multiple carousel without this condition
        //update the value of this.bigSlide
        this.getBigSlide();
        //resize the carousel so that the maximum number if items viewed is equal to this.bigSlide
        var adjust = (this.bigSlide * this.imgWidth); //add +15 here on dev for navigation
        this.smallContainer.css('width', adjust + 'px');
    }
};
SliderOpb.prototype.getBigSlide = function() { 
    var bigcontainerWidth = this.bigContainer.width(); //get the inner width without padding
    this.bigSlide = parseInt(bigcontainerWidth / this.imgWidth);
    console.log('bigcontainerWidth:' + bigcontainerWidth);
}
SliderOpb.prototype.returnTofirst = function() {
    this.current=1;
    this.transition();
    this.update();
}
