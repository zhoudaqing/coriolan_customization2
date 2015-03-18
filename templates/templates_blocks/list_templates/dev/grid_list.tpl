{if $products}
    {*$products|@var_dump*}
    {script src="js/tygh/exceptions.js"}
    

    {if !$no_pagination}
        {include file="common/pagination2.tpl"}
    {/if}
    
    {if !$no_sorting}
        {include file="views/products/components/sorting.tpl"}
    {/if}

    {if !$show_empty}
        {split data=$products size=$columns|default:"2" assign="splitted_products"}
    {else}
        {split data=$products size=$columns|default:"2" assign="splitted_products" skip_complete=true}
    {/if}

    {math equation="100 / x" x=$columns|default:"2" assign="cell_width"}
    {if $item_number == "Y"}
        {assign var="cur_number" value=1}
    {/if}

    {* FIXME: Don't move this file *}
    {script src="js/tygh/product_image_gallery.js"}

    {if $settings.Appearance.enable_quick_view == 'Y'}
        {$quick_nav_ids = $products|fn_fields_from_multi_level:"product_id":"product_id"}
    {/if}
    {*assign var="ls_is_category_page" value=true*}
    <div class="grid-list testgridlist3">
        {strip}
            {foreach from=$splitted_products item="sproducts" name="sprod"}
                {foreach from=$sproducts item="product" name="sproducts"}
                    {*$product.cart_id|@var_dump*}
                    <div class="ty-column{$columns}">
                        {if $product}
                            {assign var="obj_id" value=$product.product_id}
                            {assign var="obj_id_prefix" value="`$obj_prefix``$product.product_id`"}
                            {include file="common/product_data.tpl" product=$product}

                            <div class="ty-grid-list__item ty-quick-view-button__wrapper" id="grid_product_default_tpl_{$obj_id}">
                                {assign var="form_open" value="form_open_`$obj_id`"}
                                {$smarty.capture.$form_open nofilter}
                                {assign var="wishlist_id" value=false}
                                {if $product.cart_id}
                                    {assign var="wishlist_id" value=true}
                                {/if}
                                {hook name="products:product_multicolumns_list"}
                                        <div class="ty-grid-list__image">
                                            {include file="views/products/components/product_icon.tpl" product=$product wishlist=$wishlist_id show_gallery=true ls_is_category_page=true}

                                            {assign var="discount_label" value="discount_label_`$obj_prefix``$obj_id`"}
                                            {$smarty.capture.$discount_label nofilter}
                                        </div>

                                        <div class="ty-grid-list__item-name">
                                            {assign var="wishlist_id" value=""}

                                            {if $wishlist}
                                               {assign var="wishlist_id" value=$product.cart_id}
                                            {/if}
                                             <a href="{"products.view?product_id=`$product.product_id``&wishlist_id=$wishlist_id`"|fn_url}" class="ty-cart-content__product-title">
                                                {assign var="ls_product_name" value=$product.product}                                                 
                                                 {$ls_product_name|truncate:23 nofilter}
                                             </a>   
                                            {if $item_number == "Y"}
                                                <span class="item-number">{$cur_number}.&nbsp;</span>
                                                {math equation="num + 1" num=$cur_number assign="cur_number"}
                                            {/if}

                                            {assign var="name" value="name_$obj_id"}
                                            {*$smarty.capture.$name nofilter*}
                                        </div>
                                        <div class="ty-grid-list__item-subtitle">
                                            {$product.subtitle nofilter}
                                        </div>
                                        <div class="ty-grid-list__price {if $product.price == 0}ty-grid-list__no-price{/if}">
                                            {*{assign var="old_price" value="old_price_`$obj_id`"}
                                            {if $smarty.capture.$old_price|trim}{$smarty.capture.$old_price nofilter}{/if}*}

                                            {assign var="price" value="price_`$obj_id`"}
                                            {$smarty.capture.$price nofilter}

                                            {assign var="clean_price" value="clean_price_`$obj_id`"}
                                            {$smarty.capture.$clean_price nofilter}

                                            {assign var="list_discount" value="list_discount_`$obj_id`"}
                                            {$smarty.capture.$list_discount nofilter}
                                        </div>
                                        
                                        {assign var="rating" value="rating_$obj_id"}
                                        {if $smarty.capture.$rating}
                                            <div class="grid-list__rating">
                                                {$smarty.capture.$rating nofilter}
                                            </div>
                                        {/if}

                                        <div class="ty-grid-list__control">
                                            {if $settings.Appearance.enable_quick_view == 'Y'}
                                                {include file="views/products/components/quick_view_link.tpl" wishlist=$wishlist_id item_id=$product.cart_id quick_nav_ids=$quick_nav_ids}
                                            {/if}
                                            <div class="controller_flip">
                                                <a href="" onclick="fn_flip_info('{$obj_id}', 'grid_product_default_tpl', 'grid_product_short_details_tpl');return false;" class="controller_flip_link" >test</a>
                                            </div>
                                            {if $show_add_to_cart}
                                                <div class="button-container">
                                                    {assign var="add_to_cart" value="add_to_cart_`$obj_id`"}
                                                    {$smarty.capture.$add_to_cart nofilter}
                                                </div>
                                            {/if}
                                        </div>
                                {/hook}
                                {assign var="form_close" value="form_close_`$obj_id`"}
                                {$smarty.capture.$form_close nofilter}
                            </div>
                            <div class="product_short_details" id="grid_product_short_details_tpl_{$obj_id}" style="display:none;">
                                <div class="grid_product_short_details_title">{$product.product nofilter}</div>
                                {*<div class="grid_product_short_details_code">
                                    <span class="grid_product_short_details_code_label">{__('code')}: </span>
                                    <span class="grid_product_short_details_code_value">{$product.product_code nofilter}</span>
                                </div>*}
                                <div class="grid_product_short_details_short_desc">{$product.subtitle nofilter}</div>
                                <div class="grid_product_short_details_price">
                                    {if $product.price_range}
                                        <span class="ty-price{if !$product.price_range.min_price|floatval && !$product.zero_price_action} hidden{/if}" id="line_discounted_price_{$obj_prefix}{$obj_id}">
                                            {include file="common/price.tpl" value=($product.price_range.min_price|floatval - $product.discount|floatval)|floatval span_id="discounted_price_`$obj_prefix``$obj_id`" class="ty-price-num"}
                                             - 
                                            {include file="common/price.tpl" value=($product.price_range.max_price|floatval - ($product.price_range.max_price|floatval * $product.discount_prc / 100)|floatval)|floatval span_id="discounted_price_`$obj_prefix``$obj_id`" class="ty-price-num"}
                                        </span>
                                    {else}
                                        {if $product.price|floatval || $product.zero_price_action == "P" || ($hide_add_to_cart_button == "Y" && $product.zero_price_action == "A")}
                                            <span class="ty-price{if !$product.price|floatval && !$product.zero_price_action} hidden{/if}" id="line_discounted_price_{$obj_prefix}{$obj_id}">{if $details_page}{/if}{include file="common/price.tpl" value=$product.price span_id="discounted_price_`$obj_prefix``$obj_id`" class="ty-price-num"}</span>
                                        {elseif $product.zero_price_action == "A" && $show_add_to_cart}
                                            {assign var="base_currency" value=$currencies[$smarty.const.CART_PRIMARY_CURRENCY]}
                                            <span class="ty-price-curency"><span class="ty-price-curency__title">{__("enter_your_price")}:</span>
                                            <div class="ty-price-curency-input">
                                                {if $base_currency.after != "Y"}{$base_currency.symbol}{/if}
                                                <input class="ty-price-curency__input" type="text" size="3" name="product_data[{$obj_id}][price]" value="" />
                                            </div>
                                            {if $base_currency.after == "Y"}{$base_currency.symbol}{/if}</span>
                                        {elseif $product.zero_price_action == "R"}
                                            <span class="ty-no-price">{__("contact_us_for_price")}</span>
                                            {assign var="show_qty" value=false}
                                        {/if}
                                    {/if}
                                </div>
                                <div class="grid_product_short_details_global_options">
                                    {if $product.product_options|@count gt 0}
                                    {foreach from=$product.product_options item="product_options" name="product_opt"}
                                        {if !$product_options.product_id}
                                            <div class="grid_product_short_details_global_option">
                                                <span class="grid_product_short_details_global_option_title">{$product_options.option_name}</span><br/>
                                                <div class="grid_product_short_details_global_option_variants">
                                                    {if $product_options.variants|@count gt 0}
                                                        {foreach from=$product_options.variants item="product_option_variant" name="product_opt_var"}
                                                            {if $product_options.option_type=='Y' && $product_option_variant.image_pair|@count gt 0}
                                                                {include file="common/image.tpl" class="ty-hand $_class ty-product-options__image" images=$product_option_variant.image_pair obj_id="variant_image_`$product.product_id`_`$product_options.option_id`_`$product_option_variant.variant_id`" }
                                                            {else}
                                                                <span class="grid_product_short_details_global_option_variant_title">{$product_option_variant.variant_name}</span>&nbsp;&nbsp;&nbsp;
                                                            {/if}
                                                        {/foreach}    
                                                    {/if}
                                                </div>
                                            </div>
                                        {/if}
                                    {/foreach}
                                    {/if}
                                    {if $product.price_range}
                                        <div class="grid_product_short_details_global_option">
                                            <span class="grid_product_short_details_global_option_title">CALITATE DIAMANT SELECTABILA</span>
                                        </div>
                                    {/if}
                                </div>
                                
                                {if $product.return_period}
                                    <div class="grid_product_short_details_return_period">
                                        <span class="grid_product_short_details_return_period_img">{$product.return_period}</span>
                                        <span class="grid_product_short_details_return_period_label">Returnabil</span>
                                    </div>
                                    
                                {/if}
                                
                                <div class="grid_product_short_details_view_product">
                                    <a href="{"products.view?product_id=`$product.product_id``&wishlist_id=$wishlist_id`"|fn_url}" class="ty-cart-content__product-title-button">
                                        VEZI PRODUSUL
                                    </a>
                                </div>
                                
                                {*
                                <div class="grid_product_short_details_price">{$smarty.capture.$price nofilter}</div>
                                <div class="grid_product_short_details_old_price">
                                    {if $product.discount}
                                    {__("old_price")}: {if $smarty.capture.$old_price|trim}{$smarty.capture.$old_price nofilter}{/if}
                                    {/if}
                                </div>
                                <div class="grid_product_short_details_discount">
                                    {if $product.discount}
                                        <span class="ty-list-price save-price ty-nowrap" id="line_discount_value_{$product.product_id}">{__("you_save")}: {include file="common/price.tpl" value=$product.discount span_id="discount_value_`$product.product_id`" class="ty-list-price ty-nowrap"}&nbsp;(<span id="prc_discount_value_{$product.product_id}" class="ty-list-price ty-nowrap">{$product.discount_prc}</span>%)</span>
                                    {elseif $product.list_discount}
                                        <span class="ty-list-price save-price ty-nowrap" id="line_discount_value_{$product.product_id}"> {__("you_save")}: {include file="common/price.tpl" value=$product.list_discount span_id="discount_value_`$product.product_id`" class="ty-list-price ty-nowrap"}&nbsp;(<span id="prc_discount_value_{$product.product_id}" class="ty-list-price ty-nowrap">{$product.list_discount_prc}</span>%)</span>
                                    {/if}
                                </div>
                                *}
                                <div class="ty-grid-list__control grid_product_short_details_control_buttons">
                                    {if $settings.Appearance.enable_quick_view == 'Y'}
                                        {include file="views/products/components/quick_view_link.tpl" wishlist=$wishlist_id item_id=$product.cart_id quick_nav_ids=$quick_nav_ids}
                                    {/if}
                                    <div class="controller_flip">
                                        <a href="" onclick="fn_flip_info('{$obj_id}', 'grid_product_short_details_tpl', 'grid_product_default_tpl');return false;" class="controller_flip_link" >test</a>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
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
                            <div class="ty-column{$columns}">
                                <div class="ty-product-empty">
                                    <span class="ty-product-empty__text">{__("empty")}</span>
                                </div>
                            </div>
                        {/section}
                    {/if}
                {/if}
            {/foreach}
        {/strip}
    </div>

    {if !$no_pagination}
        {include file="common/pagination2.tpl"}
    {/if}

{/if}

{capture name="mainbox_title"}{$title}{/capture}