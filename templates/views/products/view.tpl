{capture name="val_hide_form"}{/capture}
{capture name="val_capture_options_vs_qty"}{/capture}
{capture name="val_capture_buttons"}{/capture}
{capture name="val_separate_buttons"}{/capture}
{capture name="val_no_ajax"}{/capture}
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

{hook name="products:layout_content"}
{include 
    file=$product.product_id|fn_get_product_details_layout 
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
    but_role="action" 
    capture_buttons=$smarty.capture.val_capture_buttons 
    capture_options_vs_qty=$smarty.capture.val_capture_options_vs_qty 
    separate_buttons=$smarty.capture.val_separate_buttons 
    show_add_to_cart=true 
    show_list_buttons=true 
    but_role="action" 
    block_width=true 
    no_ajax=$smarty.capture.val_no_ajax 
    show_product_tabs=true}
{/hook}