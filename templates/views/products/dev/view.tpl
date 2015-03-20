{capture name="val_hide_form"}{/capture}
{capture name="val_capture_options_vs_qty"}{/capture}
{capture name="val_capture_buttons"}{/capture}
{capture name="val_separate_buttons"}{/capture}
{capture name="val_no_ajax"}{/capture}
{if $option_variants_to_product_array_strings|@count gt 0}
    {literal}
        <script type="text/javascript">
            $(document).ready(function(){
                var optionsWithVariantsLinkedToProducts = $('#options_with_variants_linked_to_products').val();
                loadOptionVariantProductInfo(optionsWithVariantsLinkedToProducts,'{/literal}{$product.product_id}{literal}');
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