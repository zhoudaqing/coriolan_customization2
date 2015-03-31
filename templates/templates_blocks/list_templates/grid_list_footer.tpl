{if $products_footer}

    {script src="js/tygh/exceptions.js"}
    

    {if !$no_pagination}
        {include file="common/pagination.tpl"}
    {/if}
    
    {if !$no_sorting}
        {include file="views/products/components/sorting.tpl"}
    {/if}

    {if !$show_empty}
        {split data=$products_footer size=$columns|default:"2" assign="splitted_products"}
    {else}
        {split data=$products_footer size=$columns|default:"2" assign="splitted_products" skip_complete=true}
    {/if}

    {math equation="100 / x" x=$columns|default:"2" assign="cell_width"}
    {if $item_number == "Y"}
        {assign var="cur_number" value=1}
    {/if}

    {* FIXME: Don't move this file *}
    {*script src="js/tygh/product_image_gallery.js"*}

    {if $settings.Appearance.enable_quick_view == 'Y'}
        {$quick_nav_ids = $products_footer|fn_fields_from_multi_level:"product_id":"product_id"}
    {/if}
    <!--div class="grid-list"-->
    <div class="ls_preferate_carousel">
    <div class="lsc_wrap">
    <div class="lsc_slider">
    <!--ul id="ls_fav_ul" class="owl-carousel"-->
     <ul class="recent_carousel_ul lcs_fix">
        {strip}
            {foreach from=$splitted_products item="sproducts" name="sprod"}
                {foreach from=$sproducts item="product" name="sproducts"}
                    <!--div class="ty-column{*$columns*}"-->
                    <li class="clearfix lsc_li_container">
                        <span style="display: none" class="ls_cart_combination_hash">{$product.cart_id}</span>
                        {if $product}
                            {assign var="obj_id" value=$product.product_id}
                            {assign var="obj_id_prefix" value="`$obj_prefix``$product.product_id`"}
                            {include file="common/product_data2.tpl" product=$product}
                            {*move to cart form*}
                            <form enctype="multipart/form-data" class="ls_move_to_cart_form">
                                {*product options*}
                                <input type='hidden' name='ls_move_to' value='cart'>
                                <input type='hidden' name='ls_cart_combination_hash' value='{$product.cart_id}'>
                                {foreach from=$product.product_options item="option" key=option_id}
                                    <input type="hidden" name="product_data[{$product.product_id}][product_options][{$option_id}]" value="{$option.value}">
                                {/foreach}
                                <input type="hidden" name="result_ids" value="cart_status*,wish_list*,checkout*,account_info*">
                                <input type="hidden" name="redirect_url" value="{$config.current_url|fn_url}">
                                <input type="hidden" name="product_data[{$product.product_id}][product_id]" value="{$product.product_id}">
                                <!--input type="hidden" name="product_data[2704][product_options][2291]" value="111924">
                                <input type="hidden" name="product_data[2704][product_options][3468]" value="111210">
                                <input type="hidden" name="product_data[2704][product_options][3471]" value="111239">
                                <input type="hidden" name="product_data[2704][product_options][3470]" value="111238">
                                <input type="hidden" name="product_data[2704][product_options][3485]" value="111357">
                                <input type="hidden" name="product_data[2704][product_options][3469]" value="111212">
                                <input type="hidden" name="product_data[2704][product_options][3484]" value="111885"-->
                                <input type="hidden" name="appearance[show_product_options]" value="1">
                                <input type="hidden" name="appearance[details_page]" value="1">
                                <input type="hidden" name="additional_info[info_type]" value="D">
                                <input type="hidden" name="additional_info[get_icon]" value="1">
                                <input type="hidden" name="additional_info[get_detailed]" value="1">
                                <input type="hidden" name="additional_info[get_additional]" value="">
                                <input type="hidden" name="additional_info[get_options]" value="1">
                                <input type="hidden" name="additional_info[get_discounts]" value="1">
                                <input type="hidden" name="additional_info[get_features]" value="">
                                <input type="hidden" name="additional_info[get_extra]" value="">
                                <input type="hidden" name="additional_info[get_taxed_prices]" value="1">
                                <input type="hidden" name="additional_info[get_for_one_product]" value="1">
                                <input type="hidden" name="additional_info[detailed_params]" value="1">
                                <input type="hidden" name="additional_info[features_display_on]" value="C">
                                <input type="hidden" name="appearance[show_add_to_cart]" value="1">
                                <input type="hidden" name="appearance[separate_buttons]" value="1">
                                <input type="hidden" name="appearance[show_list_buttons]" value="1">
                                <input type="hidden" name="appearance[but_role]" value="big">
                                <input type="hidden" name="appearance[quick_view]" value="">
                                <input type="hidden" name="is_ajax" value="1">
                                <input type="hidden" name="full_render" value="Y">
                                <input type="hidden" name="dispatch[checkout.add..{$product.product_id}]" value="">
                                <span class="ty-btn ty-btn__text text-button ls_move_to_cart">move to cart</span>
                            </form>
                            <!--div class="ty-grid-list__item ty-quick-view-button__wrapper"-->
                            {assign var="form_open" value="form_open_`$obj_id`"}
                                {$smarty.capture.$form_open nofilter}
                                {hook name="products:product_multicolumns_list"}
                                <!--div class="ty-twishlist-item testmulticolumnpre3">
                                    <a href="{"wishlist.delete?cart_id=`$product.cart_id`"|fn_url}" class="ty-twishlist-item__remove ty-remove" title="{__("remove")}"><i class="ty-remove__icon ty-icon-cancel-circle"></i></a>
                                </div-->
                                        <div class="ty-grid-list__image testgridlistfooter2">
                                            {include file="views/products/components/product_icon2.tpl" product=$product show_gallery=false}

                                            {assign var="discount_label" value="discount_label_`$obj_prefix``$obj_id`"}
                                            {$smarty.capture.$discount_label nofilter}
                                        </div>

                                {/hook}
                                {assign var="form_close" value="form_close_`$obj_id`"}
                                {$smarty.capture.$form_close nofilter}
                            <!--/div-->
                        {/if}
                    </li>
                    <!--/div-->
                {/foreach}
                {if $show_empty && $smarty.foreach.sprod.last}
                    {assign var="iteration" value=$smarty.foreach.sproducts.iteration}
                    {capture name="iteration"}{$iteration}{/capture}
                    {hook name="products:products_multicolumns_extra"}
                    {/hook}
                    {assign var="iteration" value=$smarty.capture.iteration}
                    {if $iteration % $columns != 0}
                        {math assign="empty_count" equation="c - it%c" it=$iteration c=$columns}
                        {section loop=$empty_count name="empty_rows"}
                            <!--div class="ty-column{$columns}">
                                <div class="ty-product-empty">
                                    <span class="ty-product-empty__text">{__("empty")}</span>
                                </div>
                            </div-->
                        {/section}
                    {/if}
                {/if}
            {/foreach}
        {/strip}
    </ul>
    </div>
    <div class="lsc_slider-nav">
        <span class="ls_nav_bullets"></span>
        <button class="lsc_previous_b" data-dir="prev">Previous</button>
        <button class="lsc_next_b"  data-dir="next">Next</button>
    </div>
    </div>
    </div>

    {if !$no_pagination}
        {include file="common/pagination.tpl"}
    {/if}

{/if}

{capture name="mainbox_title"}{$title}{/capture}