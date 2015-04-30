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
    
    <div class="grid-list testgridlist2">
        {strip}
            {foreach from=$splitted_products item="sproducts" name="sprod"}
                {foreach from=$sproducts item="product" name="sproducts"}
                    {*$product.cart_id|@var_dump*}
                    <div class="ty-column{$columns} ls_grid_coloumns">
                        {if $product}
                            {assign var="obj_id" value=$product.product_id}
                            {assign var="obj_id_prefix" value="`$obj_prefix``$product.product_id`"}
                            {include file="common/product_data.tpl" product=$product}
                            
                            {*{if $smarty.request.dispatch=='wishlist.view'}*}
                            {assign var="form_open" value="form_open_`$obj_id`"}
                            {$smarty.capture.$form_open nofilter}
                            {*{/if}*}
                            {assign var="wishlist_id" value=""}

                            {if $wishlist}
                               {assign var="wishlist_id" value=$product.cart_id}
                            {/if}
                            <div class="ty-grid-list__item ty-quick-view-button__wrapper" id="grid_product_default_tpl_{if $wishlist_id}{$wishlist_id}{else}{$obj_id}{/if}">
                                {assign var="is_wishlist" value=false}
                            {if $product.cart_id}
                                {assign var="is_wishlist" value=true}
                            {/if}
                                {hook name="products:product_multicolumns_list"}
                                        <div class="ty-grid-list__image">
                                            <div class="ty-grid-list__top_info">
                                                {*{if $product.top_title}<div class="ty-grid-list__top_info_top_title">{$product.top_title nofilter}</div>{/if}*}
                                                {if $product.promo_name || $product.top_title}<div class="ty-grid-list__top_info_promo_name">{if $product.promo_name}{$product.promo_name nofilter}{elseif $product.top_title}{$product.top_title nofilter}{/if}</div>{/if}
                                            </div>
                                            {include file="views/products/components/product_icon.tpl" product=$product wishlist=$is_wishlist show_gallery=true ls_is_category_page=true}

                                            {assign var="discount_label" value="discount_label_`$obj_prefix``$obj_id`"}
                                            {$smarty.capture.$discount_label nofilter}
                                        </div>

                                        <div class="ty-grid-list__item-name">
                                            
                                             <a href="{"products.view?product_id=`$product.product_id``&wishlist_id=$wishlist_id`"|fn_url}" class="ty-cart-content__product-title">
                                                {if $product.product|strlen gt 24}
                                                    {$product.product|substr:0:24 nofilter} ...
                                                {else}
                                                    {$product.product nofilter}
                                                {/if}
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
                                            {if $product.discount}
                                                {assign var="old_price" value="old_price_`$obj_id`"}
                                                {if $smarty.capture.$old_price|trim}{$smarty.capture.$old_price nofilter}{/if}
                                            {else}
                                                {assign var="price" value="price_`$obj_id`"}
                                                {$smarty.capture.$price nofilter}
                                            {/if}
                                            {*{assign var="clean_price" value="clean_price_`$obj_id`"}
                                            {$smarty.capture.$clean_price nofilter}*}

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
                                            {if $smarty.request.dispatch=='wishlist.view'}
                                                {include file="views/products/components/move_to_cart_button.tpl" wishlist=$wishlist_id item_id=$product.cart_id quick_nav_ids=$quick_nav_ids}
                                            {elseif $smarty.request.dispatch!='wishlist.view' && $settings.Appearance.enable_quick_view == 'Y'}
                                                {include file="views/products/components/quick_view_link.tpl" wishlist=$wishlist_id item_id=$product.cart_id quick_nav_ids=$quick_nav_ids}
                                            {/if}
                                            <div class="controller_flip">
                                                <a href="" onclick="fn_flip_info('{if $wishlist_id}{$wishlist_id}{else}{$obj_id}{/if}', 'grid_product_default_tpl', 'grid_product_short_details_tpl');return false;" class="controller_flip_link" >test</a>
                                            </div>
                                            {if $show_add_to_cart}
                                                <div class="button-container">
                                                    {assign var="add_to_cart" value="add_to_cart_`$obj_id`"}
                                                    {$smarty.capture.$add_to_cart nofilter}
                                                </div>
                                            {/if}
                                        </div>
                                {/hook}
                            </div>
                            <div class="product_short_details" id="grid_product_short_details_tpl_{if $wishlist_id}{$wishlist_id}{else}{$obj_id}{/if}" style="display:none;">
                                <div class="grid_product_short_details_title">{$product.product nofilter}</div>
                                {*<div class="grid_product_short_details_code">
                                    <span class="grid_product_short_details_code_label">{__('code')}: </span>
                                    <span class="grid_product_short_details_code_value">{$product.product_code nofilter}</span>
                                </div>*}
                                <div class="grid_product_short_details_short_desc">{$product.subtitle nofilter}</div>
                                <div class="grid_product_short_details_price">
                                    {if $product.price_range}
                                        <span class="ty-price{if !$product.price_range.min_price|floatval && !$product.zero_price_action} hidden{/if}" id="line_discounted_price_{$obj_prefix}{$obj_id}">
                                            {include file="common/price.tpl" value=($product.price_range.min_price|round - $product.promo_value - ($product.price_range.min_price * $product.promo_percentage)/100) span_id="discounted_price_`$obj_prefix``$obj_id`" class="ty-price-num"}
                                             - 
                                            {include file="common/price.tpl" value=($product.price_range.max_price|round - $product.promo_value|floatval  - ($product.price_range.max_price|floatval * $product.promo_percentage / 100)|floatval)|floatval span_id="discounted_price_`$obj_prefix``$obj_id`" class="ty-price-num"}
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
                                    {if $smarty.request.dispatch=='wishlist.view'}
                                    <input type="hidden" name="redirect_url" value="index.php?dispatch=wishlist.delete&cart_id={$wishlist_id}" />
                                    <input type="hidden" name="appearance[show_price_values]" value="1" />
                                    <input type="hidden" name="appearance[show_price]" value="1" />
                                    <input type="hidden" name="appearance[show_product_options]" value="1" />
                                    <input type="hidden" name="appearance[details_page]" value="1" />
                                    <input type="hidden" name="appearance[dont_show_points]" value="" />
                                    <input type="hidden" name="appearance[show_sku]" value="" />
                                    <input type="hidden" name="appearance[show_product_amount]" value="1" />
                                    <input type="hidden" name="appearance[show_add_to_cart]" value="1" />
                                    <input type="hidden" name="appearance[separate_buttons]" value="1" />
                                    <input type="hidden" name="appearance[show_list_buttons]" value="1" />
                                    <input type="hidden" name="appearance[but_role]" value="big" />
                                    <input type="hidden" name="appearance[quick_view]" value="" />

                                    <input type="hidden" name="additional_info[info_type]" value="D" />
                                    <input type="hidden" name="additional_info[get_icon]" value="1" />
                                    <input type="hidden" name="additional_info[get_detailed]" value="1" />
                                    <input type="hidden" name="additional_info[get_additional]" value="" />
                                    <input type="hidden" name="additional_info[get_options]" value="1" />
                                    <input type="hidden" name="additional_info[get_discounts]" value="1" />
                                    <input type="hidden" name="additional_info[get_features]" value="" />
                                    <input type="hidden" name="additional_info[get_extra]" value="" />
                                    <input type="hidden" name="additional_info[get_taxed_prices]" value="1" />
                                    <input type="hidden" name="additional_info[get_for_one_product]" value="1" />
                                    <input type="hidden" name="additional_info[detailed_params]" value="1" />
                                    <input type="hidden" name="additional_info[features_display_on]" value="C" />
                                    <input type="hidden" name="product_data[{$obj_id}][extra][price_calc][total_price_calc]" value="{$product.price}" />
                                    {/if}
                                    {if $product.product_options|@count gt 0}
                                    {foreach from=$product.product_options item="product_options" name="product_opt"}
                                        
                                            <div class="grid_product_short_details_global_option">
                                                {if $smarty.request.dispatch=='wishlist.view'}
                                                    
                                                    <label class="ty-control-group__label ty-product-options__item-label cm-required" for="option_{$obj_id}_{$product_options.option_id}">{$product_options.option_name}:</label>
                                                    <label class="ty-control-group__label ty-product-options__item-label label_option_variant_selected">
                                                        {$product_options.variants[$product.selected_options[$product_options.option_id]]['variant_name']}
                                                        <input type="hidden" value="{$product_options.variants[$product.selected_options[$product_options.option_id]]['variant_id']}" name="product_data[{$obj_id}][product_options][{$product_options.option_id}]">
                                                    </label>
                                                {else}
                                                    {if !$product_options.product_id}
                                                    <span class="grid_product_short_details_global_option_title">{$product_options.option_name}</span>
                                                    <br/>
                                                    <div class="grid_product_short_details_global_option_variants">
                                                        {*{$product_options.variants|var_dump}*}
                                                        {if $product_options.variants|@count gt 0}
                                                            {foreach from=$product_options.variants item="product_option_variant" name="product_opt_var"}
                                                                {if $product_options.option_type=='Y' && $product_option_variant.image_pair|@count gt 0}
                                                                    {include file="common/image.tpl" class="$_class ty-product-options__image" images=$product_option_variant.image_pair obj_id="variant_image_`$product.product_id`_`$product_options.option_id`_`$product_option_variant.variant_id`" }
                                                                {else}
                                                                    <span class="grid_product_short_details_global_option_variant_title">{$product_option_variant.variant_name}</span>&nbsp;&nbsp;&nbsp;
                                                                {/if}
                                                            {/foreach}    
                                                        {/if}
                                                    </div>
                                                    {/if}
                                                {/if}
                                            </div>
                                        
                                    {/foreach}
                                    {/if}
                                    {if $smarty.request.dispatch=='wishlist.view'}
                                    <input type="hidden" name="ls_calculate_estimate" value="true" />
                                    <input type="hidden" name="full_render" value="Y" />
                                    <input type="hidden" name="dispatch[checkout.add..{{$obj_id}}]" value="" />
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
                                    {if $smarty.request.dispatch=='wishlist.view'}
                                        {include file="views/products/components/move_to_cart_button.tpl" wishlist=$wishlist_id item_id=$product.cart_id quick_nav_ids=$quick_nav_ids}
                                    {elseif $smarty.request.dispatch!='wishlist.view' && $settings.Appearance.enable_quick_view == 'Y'}
                                        {include file="views/products/components/quick_view_link.tpl" wishlist=$wishlist_id item_id=$product.cart_id quick_nav_ids=$quick_nav_ids}
                                    {/if}
                                    <div class="controller_flip">
                                        <a href="" onclick="fn_flip_info('{if $wishlist_id}{$wishlist_id}{else}{$obj_id}{/if}', 'grid_product_short_details_tpl', 'grid_product_default_tpl');return false;" class="controller_flip_link" >test</a>
                                    </div>
                                </div>
                            </div>
                            {*{if $smarty.request.dispatch=='wishlist.view'}*}
                            {assign var="form_close" value="form_close_`$obj_id`"}
                            {$smarty.capture.$form_close nofilter}
                            {*{/if}*}
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
    {include file="common/ls_next_page.tpl"}
    {if !$no_pagination}
        {include file="common/pagination2.tpl"}
    {/if}

{/if}

{capture name="mainbox_title"}{$title}{/capture}