$(document).ready(function () {
    var id_recently_click = '#sw_dropdown_269';
    var id_recently_block = '#dropdown_269';
    var id_favorite_click = '#sw_dropdown_279';
    var id_favorite_block = '#dropdown_279';
    var slider_preferate = new SliderOpb($('div.lsc_slider'), $('div.ls_preferate_carousel').find('div.lsc_wrap').first(), id_favorite_click, id_favorite_block);
    var slider_recente = new SliderOpb($('div.lsc_slider'), $('div.ls_recent_carousel').find('div.lsc_wrap').first(), id_recently_click, id_recently_block);
    console.log('slider_preferate.imgsLen: ' + slider_preferate.imgsLen);
    console.log('slider_recente.imgsLen: ' + slider_recente.imgsLen);
    $('#sw_dropdown_279').on('click', function () {
        //call resizeCarousel with a small timeout(to fetch the elements after they are displayed)
        setTimeout(function () {
            slider_preferate.resizeCarousel();
            slider_preferate.createNavbullets();
            slider_preferate.update();
        }, 100);
    });
    $('#sw_dropdown_269').on('click', function () {
        //call resizeCarousel with a small timeout(to fetch the elements after they are displayed)
        setTimeout(function () {
            slider_recente.resizeCarousel();
            slider_recente.createNavbullets();
            slider_recente.update();
        }, 100);
    });
    $('body').on('click', ' div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove', function () {
        setTimeout(function () {
            slider_preferate.createNavbullets();
            slider_preferate.update();
        }, 1500); //wait for ajax call and the subsquent removed item from frontend (replace with callback function)
    });
})