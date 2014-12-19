/*******cart customisation**********/
$(document).ready(function() { 
    //cache check
  //  console.log('cache ls_user_updates2');
    //display number of products in cart
    var block_id='285' ;       //block_id=285/289 for cart_content2/cart-content-smarty
    function customize_cart() {
        //add classes for cart menu
          $('#cart_status_'+block_id).addClass('ls_cart_wrap');
          $('#sw_dropdown_'+block_id).addClass('ls_car_click');
          $('#dropdown_'+block_id).addClass('ls_cart_dropdown');
          //remove cart extra html
          $('#sw_dropdown_'+block_id+' > a').find('.ty-minicart__icon.ty-icon-basket').hide();
           $('#sw_dropdown_'+block_id+' > a').find('.ty-icon-down-micro').hide();
           $('#sw_dropdown_'+block_id+' > a').find('.ty-minicart-title.ty-hand').hide();
           //count how many products are in cart - the ul is in #dropdown_block_id
         var ls_cart_no=$('span.ty-minicart-title.ty-hand').html();
         ls_cart_no=parseInt(ls_cart_no.substring(0, 2));
         if (isNaN(ls_cart_no)){
             ls_cart_no=0;
         }
         $('#sw_dropdown_'+block_id+' > a').prepend('<span id="ls_cart_no">'+ls_cart_no+'</span>');
    }
    customize_cart(); 
    $('body').on('click','i.ls_delete_icon',function(){
      setTimeout(function() {customize_cart();}, 1000);
    });

    $('[id^=button_cart_]').on('click', function() {
        setTimeout(function() {customize_cart()}, 1200);
    });
    $('.ty-add-to-wish > a').on('click', function() {
        setTimeout(function() {customize_cart()}, 1200);
        console.log('product added to favorites');
    });
    //change filters position
    /*
      var filters=$('#sidebox_24').parents('.ty-sidebox').clone(true);
      console.log(filters);
      if(!$('ul.subcategories.clearfix').length==0) {
         $(filters).insertAfter('ul.subcategories.clearfix');
     //    $('.span4.side-grid').remove();
      } */
    //delete favorite products
	 // $('div.ls_mid_myaccount a.ty-twishlist-item__remove.ty-remove').on('click', function(event) {
	 $('body').on('click','a.ty-twishlist-item__remove.ty-remove',function(event) {
	 event.preventDefault();
	 var footerFavId=$(this).attr('href');
	 footerFavId=footerFavId.substr(71);
	 var request=$.ajax({
	 url: 'http://coriolan.leadsoft.eu/index.php?dispatch=index.deleteFooter&footerFavId='+footerFavId,
	 dataType: 'html',
	 type: 'GET'
	 });
	 request.done(function( msg ) {
	 console.log( msg );
	 });
        });

    
});

