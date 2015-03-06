{assign var="dropdown_id" value=$block.snapping_id}
{assign var="r_url" value=$config.current_url|escape:url}
{hook name="checkout:cart_content"}
<div class="ty-dropdown-box ls_cart_wrap" id="cart_status_{$dropdown_id}"> 
    <div id="sw_dropdown_{$dropdown_id}" class="ty-dropdown-box__title cm-combination ls_car_click"> 
        <a href="{"checkout.cart"|fn_url}">
            {hook name="checkout:dropdown_title"}
            {if $smarty.session.cart.amount}
                <!--i class="ty-minicart__icon ty-icon-basket filled"></i>
                <span class="ty-minicart-title ty-hand">{*$smarty.session.cart.amount}&nbsp;{__("items")} {__("for")}&nbsp;{include file="common/price.tpl" value=$smarty.session.cart.display_subtotal*}</span>
                <i class="ty-icon-down-micro"></i-->
                <span id="ls_cart_no">{$smarty.session.cart.amount}</span>         
                <span id='ls_secondary_currency' style="display:none">{$smarty.const.CART_SECONDARY_CURRENCY}</span>
            {else}
                <!--i class="ty-minicart__icon ty-icon-basket empty"></i>
                <span class="ty-minicart-title empty-cart ty-hand">{*__("cart_is_empty")*}</span>
                <i class="ty-icon-down-micro"></i-->
                <span id="ls_cart_no">0</span>        
            {/if}
            {/hook}
        </a>
    </div>
    <div id="dropdown_{$dropdown_id}" class="cm-popup-box ty-dropdown-box__content hidden ls_cart_dropdown">
        {hook name="checkout:minicart"}
        <div class="cm-cart-content {if $block.properties.products_links_type == "thumb"}cm-cart-content-thumb{/if} {if $block.properties.display_delete_icons == "Y"}cm-cart-content-delete{/if}">
            <span style="display: none" id="ls_frontend_language">{$smarty.session.settings.cart_languageC.value}</span>
            <div class="ty-cart-items">
                <div class="ls_cart_upper_text">
                    <div class="ls_cart_total_items_text">
                        {if $smarty.session.cart.amount}
                            {__("total_items")}: <span class="ls_cart_no">{$smarty.session.cart.amount}</span>
                        {else}
                            {__("total_items")}: <span class="ls_cart_no">0</span>
                        {/if}
                    </div>
                    <div class="ls_cart_subtotal_text">
                        {__("subtotal")}: <span id='ls_subtotal_tpl'>{include file="common/price.tpl" value=$smarty.session.cart.display_subtotal}</span>
                    </div>
                </div>
                <div class="ls-vertical-slider-nav">
                    <button id="ls-vertical-lsc_prev" data-dir="prev">Previous</button>
                </div>
                <div class="ls_please-wait" style="display: none; position: absolute; height: 100%; width: 100%; top: 0; left: 0; z-index: 100; background: rgba(237,237,237,0.8)"></div>    
                <div class="ls-vertical-slider ls-vertical-lsc_container">
                    {if $smarty.session.cart.amount}
                        <ul class="ls_vertical_cart_ul ">
                            {hook name="index:cart_status"}
                            {assign var="_cart_products" value=$smarty.session.cart.products|array_reverse:true}
                            {foreach from=$_cart_products key="key" item="p" name="cart_products"}
                                {if !$p.extra.parent}
                                    <li class="ty-cart-items__list-item">
                                        <span style="display: none" class="ls_cart_combination_hash">{$key}</span>
                                        <span style="display: none" class="ls_cart_combination_id">{$p.product_id}</span>
                                        {if $block.properties.products_links_type == "thumb"}
                                            <div class="ty-cart-items__list-item-image">
                                                {include file="common/image.tpl" image_width="40" image_height="40" images=$p.main_pair no_ids=true}
                                            </div>
                                        {/if}
                                        <div class="ty-cart-items__list-item-desc">
                                            <a href="{"products.view?product_id=`$p.product_id``&wishlist_id=$key`"|fn_url}">{$p.product_id|fn_get_product_name nofilter}</a>
                                            <p>
                                                <span class="ls_cart_product_amount">{$p.amount}</span><span>&nbsp;x&nbsp;</span>{include file="common/price.tpl" value=$p.display_price span_id="price_`$key`_`$dropdown_id`" class="none"}
                                            </p>
                                            {if $p.product_options}
                                            <span style="display: none" class="testoptionsvariants">{$p|var_dump}</span>
                                            <!--div class="ls_cart_options"-->
                                                <div class="ty-control-group ty-product-options__info clearfix">
                                                <!--div class="ls_cart_options_title"--><label class="ty-product-options__title">{__("options")}:</label><!--/div-->                                    
                                                {include file="views/products/components/ls_minicart_options.tpl" ls_minicart_options=$p.ls_minicart_options product=$p name="cart_products" id=$key}
                                                </div>
                                            <!--/div-->
                                            {else}
                                                <span style="display: none">{$p|var_dump}</span>
                                            {/if}
                                        </div>
                                        {if $block.properties.display_delete_icons == "Y"}
                                            <div class="ty-cart-items__list-item-tools cm-cart-item-delete">
                                                {if (!$runtime.checkout || $force_items_deletion) && !$p.extra.exclude_from_calculate}
                                                    {include file="buttons/button.tpl" but_href="checkout.delete.from_status?cart_id=`$key`&redirect_url=`$r_url`" but_meta="cm-ajax" but_target_id="cart_status*" but_role="delete" but_name="delete_cart_item"}
                                                {/if}
                                            </div>
                                        {/if}
                                    </li>
                                {/if}
                            {/foreach}
                            {/hook}
                        </ul>
                    {else}
                        <div class="ty-cart-items__empty ty-center">{__("cart_is_empty")}</div>
                    {/if}
                </div>
                <div class="ls-vertical-slider-nav">
                    <button id="ls-vertical-lsc_next" data-dir="next">Next</button>
                </div>
            </div>

            {if $block.properties.display_bottom_buttons == "Y"}
                <div class="ls_bottom_buttons_cart cm-cart-buttons ty-cart-content__buttons buttons-container{*if $smarty.session.cart.amount*} full-cart{*else} hidden{/if*}">
                    {if $smarty.session.cart.amount}
                        <div class="ty-float-left ls_bottom_cart_view">
                            <a href="{"checkout.cart"|fn_url}" rel="nofollow" class="ty-btn ty-btn__secondary">{__("view_cart")}</a>
                        </div>
                        {if $settings.General.checkout_redirect != "Y"}
                            <div class="ty-float-right ls_bottom_cart_checkout">
                                <a href="{"checkout.checkout"|fn_url}" rel="nofollow" class="ty-btn ty-btn__primary">{__("checkout")}</a>
                            </div>
                        {/if}
                        <div class="ls_continue_shopping" style="display: none;">
                            <a href="#" class="ty-btn ty-btn__secondary">{__("continue_shopping")}</a>
                        </div>
                    {else}
                        <div class="ls_continue_shopping">
                            <a href="#" class="ty-btn ty-btn__secondary">{__("continue_shopping")}</a>
                        </div>
                    {/if}
                </div>
            {/if}

        </div>
        {/hook}
    </div>
    <!--cart_status_{$dropdown_id}--></div>
    {/hook}
