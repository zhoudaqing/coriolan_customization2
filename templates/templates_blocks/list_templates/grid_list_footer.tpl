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
                        {if $product}
                            {assign var="obj_id" value=$product.product_id}
                            {assign var="obj_id_prefix" value="`$obj_prefix``$product.product_id`"}
                            {include file="common/product_data2.tpl" product=$product}

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