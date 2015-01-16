{if $option_variants_to_product_array_strings|@count gt 0}
    {literal}
        <script type="text/javascript">
            function loadOptionVariantProductInfo(optionIds){
                var optionsWithVariantsLinkedToProductsArray = optionIds.split(',');
                var nrOptionsWithVariantsLinkedToProductsArray = optionsWithVariantsLinkedToProductsArray.length;
                var myItems = 0;
                var product_id = {/literal}{$product.product_id}{literal};
                for(myItems;myItems<nrOptionsWithVariantsLinkedToProductsArray;myItems++){
                    var myObj = document.getElementsByName("product_data["+product_id+"][product_options]["+optionsWithVariantsLinkedToProductsArray[myItems]+"]");
                    var tagTypeName = '';
                    $.each(myObj,function(i,myTag){
                        tagTypeName = myTag.tagName;
                    });
                    
                    if(tagTypeName=='INPUT'){
                        var myObjValue = $("input[name='"+"product_data["+product_id+"][product_options]["+optionsWithVariantsLinkedToProductsArray[myItems]+"]']:checked" ).val();
                    }else if(tagTypeName=='SELECT'){
                        var myObjValue = $("select[name='"+"product_data["+product_id+"][product_options]["+optionsWithVariantsLinkedToProductsArray[myItems]+"]']" ).val();
                    }
                    
                    $.ajax({
                        type: "POST",
                        async: false,
                        url: fn_url("products.view_details_compact"),
                        data: {product_id: product_id, variant_id: myObjValue, is_ajax:1}
                    }).done(function( msg ) {
                        if($('.product_required_linked_details').length>0){
                           $('.product_required_linked_details').append(msg.text);
                        }else{
                            if($('.cm-tabs-content.ty-tabs__content.clearfix div#content_description').length>0){
                                var htmlToDisplay = '<div class="product_required_linked_details">';
                                htmlToDisplay += msg.text;
                                htmlToDisplay += '<div>';
                                $('.cm-tabs-content.ty-tabs__content.clearfix div#content_description').append(htmlToDisplay);
                            }
                        }
                        
                    });
                }
            }
            $(document).ready(function(){
                var optionsWithVariantsLinkedToProducts = $('#options_with_variants_linked_to_products').val();
                loadOptionVariantProductInfo(optionsWithVariantsLinkedToProducts);
            });
        </script>
    {/literal}
{/if}

{if $option_variants_to_product_array_strings|@count gt 0}
    {assign var="optionsWithVariantsLinkedToProductsKeys" value=$option_variants_to_product_array_strings|array_keys}
    {assign var="optionsWithVariantsLinkedToProducts" value=','|implode:$optionsWithVariantsLinkedToProductsKeys}
    <input type="hidden" id="options_with_variants_linked_to_products" value="{$optionsWithVariantsLinkedToProducts}">
{/if}

<div class="ty-quick-view__wrapper">
    {capture name="val_hide_form"}{/capture}
    {capture name="val_capture_options_vs_qty"}{/capture}
    {capture name="val_capture_buttons"}{/capture}
    {capture name="val_no_ajax"}{/capture}

    {script src="js/tygh/exceptions.js"}
    
    {$obj_prefix=$obj_prefix|default:"ajax"}
    <div class="ty-product-block" id="product_main_info_{$obj_prefix}">
        <div class="ty-product-block__wrapper clearfix">
        {hook name="products:view_main_info"}
            {if $product}
                {assign var="wishlist_id" value="&wishlist_id=`$product.cart_id`"}
                <div class="ty-quick-view-tools">
                    {include file="common/view_tools.tpl" quick_view=true}
                </div>

                {$obj_id=$product.product_id}

                {include file="common/product_data.tpl"
                    obj_prefix=$obj_prefix
                    obj_id=$obj_id
                    product=$product
                    but_role="big"
                    but_text=__("add_to_cart")
                    add_to_cart_meta="cm-form-dialog-closer"
                    product=$product
                    show_sku=true
                    show_rating=true
                    show_old_price=true
                    show_price=true
                    show_list_discount=true
                    show_clean_price=true
                    details_page=true
                    show_discount_label=true
                    show_product_amount=true
                    show_product_options=true
                    hide_form=$smarty.capture.val_hide_form
                    min_qty=true
                    show_edp=true
                    show_add_to_cart=true
                    show_list_buttons=true
                    capture_buttons=$smarty.capture.val_capture_buttons
                    capture_options_vs_qty=$smarty.capture.val_capture_options_vs_qty
                    separate_buttons=true
                    block_width=true
                    no_ajax=$smarty.capture.val_no_ajax
                    show_descr=true
                    quick_view=true
                }

                {assign var="form_open" value="form_open_`$obj_id`"}
                {$smarty.capture.$form_open nofilter}

                {hook name="products:quick_view_image_wrap"}
                    {if !$no_images}
                        <div class="ty-product-block__img cm-reload-{$obj_prefix}{$obj_id}" id="product_images_{$obj_prefix}{$obj_id}_update">
                            {assign var="discount_label" value="discount_label_`$obj_prefix``$obj_id`"}
                            {$smarty.capture.$discount_label nofilter}

                            {include file="views/products/components/product_images.tpl" product=$product show_detailed_link=true image_width=$settings.Thumbnails.product_quick_view_thumbnail_width image_height=$settings.Thumbnails.product_quick_view_thumbnail_height}
                        <!--product_images_{$obj_prefix}{$obj_id}_update--></div>
                    {/if}
                {/hook}

                    <div class="ty-product-block__left">

                        {hook name="products:quick_view_title"}
                            {if !$hide_title}
                                <h1 class="ty-product-block-title">
                                    {assign var="wishlist_id" value="&wishlist_id=`$ls_wishlist_id`"}
                                    <a href="{"products.view?product_id=`$product.product_id``$wishlist_id`"|fn_url}" class="ty-quick-view__title">{$product.product nofilter}</a>
                                    <span style="display: none"><pre>{$ls_wishlist_id|var_dump}</pre></span>
                                </h1>
                            {/if}
                        {/hook}

                        {hook name="products:brand"}
                            <div class="ty-brand">
                                {include file="views/products/components/product_features_short_list.tpl" features=$product.header_features}
                            </div>
                        {/hook}

                        {assign var="prod_descr" value="prod_descr_`$obj_id`"}
                        {if $smarty.capture.$prod_descr|trim}
                            <div class="ty-product-block__description">{$smarty.capture.$prod_descr nofilter}</div>
                        {/if}

                        <div class="ty-product-block__note">
                            {$product.promo_text nofilter}
                        </div>

                        <div class="{if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}prices-container {/if}price-wrap clearfix">
                            {assign var="old_price" value="old_price_`$obj_id`"}
                            {assign var="price" value="price_`$obj_id`"}
                            {assign var="clean_price" value="clean_price_`$obj_id`"}
                            {assign var="list_discount" value="list_discount_`$obj_id`"}
                            {assign var="discount_label" value="discount_label_`$obj_id`"}

                             <div class="{if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}prices-container {/if}price-wrap clearfix">
                                {if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}
                                    <div class="ty-float-left ty-product-prices">
                                        {if $smarty.capture.$old_price|trim}{$smarty.capture.$old_price nofilter}&nbsp;{/if}
                                {/if}

                                <div class="ty-product-block__price-actual">
                                    {$smarty.capture.$price nofilter}
                                </div>

                                {if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}
                                        {$smarty.capture.$clean_price nofilter}
                                        {$smarty.capture.$list_discount nofilter}
                                    </div>
                                {/if}
                            </div>

                            {if $smarty.capture.$discount_label|trim}
                                <div class="ty-float-left">
                                    {$smarty.capture.$discount_label nofilter}
                                </div>
                            {/if}

                        </div>

                        {if $capture_options_vs_qty}{capture name="product_options"}{$smarty.capture.product_options nofilter}{/if}
                           <div class="ty-product-block__option">
                                {assign var="product_options" value="product_options_`$obj_id`"}
                                {$smarty.capture.$product_options nofilter}
                            </div>

                        {if $capture_options_vs_qty}{/capture}{/if}
                        <div class="ty-product-block__advanced-option">
                            {if $capture_options_vs_qty}{capture name="product_options"}{$smarty.capture.product_options nofilter}{/if}
                            {assign var="advanced_options" value="advanced_options_`$obj_id`"}
                            {$smarty.capture.$advanced_options nofilter}
                            {if $capture_options_vs_qty}{/capture}{/if}
                        </div>

                        <div class="ty-product-block__sku">
                            {$sku = "sku_`$obj_id`"}
                            {$smarty.capture.$sku nofilter}
                        </div>

                        {if $capture_options_vs_qty}{capture name="product_options"}{$smarty.capture.product_options nofilter}{/if}
                        <div class="ty-product-block__field-group">
                            {assign var="product_amount" value="product_amount_`$obj_id`"}
                            {$smarty.capture.$product_amount nofilter}

                            {assign var="qty" value="qty_`$obj_id`"}
                            {$smarty.capture.$qty nofilter}

                            {assign var="min_qty" value="min_qty_`$obj_id`"}
                            {$smarty.capture.$min_qty nofilter}
                        </div>
                        {if $capture_options_vs_qty}{/capture}{/if}
                        {assign var="product_edp" value="product_edp_`$obj_id`"}
                        {$smarty.capture.$product_edp nofilter}

                        {if $capture_buttons}{capture name="buttons"}{/if}
                        <div class="ty-product-block__button">
                                {assign var="add_to_cart" value="add_to_cart_`$obj_id`"}
                                {$smarty.capture.$add_to_cart nofilter}

                                {assign var="list_buttons" value="list_buttons_`$obj_id`"}
                                {$smarty.capture.$list_buttons nofilter}
                        </div>
                        {if $capture_buttons}{/capture}{/if}
                </div>
        </div>
            {assign var="form_close" value="form_close_`$obj_id`"}
            {$smarty.capture.$form_close nofilter}
        {/if}

        {if $smarty.capture.hide_form_changed == "Y"}
            {assign var="hide_form" value=$smarty.capture.orig_val_hide_form}
        {/if}

    {/hook}
    <!--product_main_info_{$obj_prefix}--></div>
</div>