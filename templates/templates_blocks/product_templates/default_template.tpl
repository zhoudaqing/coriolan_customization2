{script src="js/tygh/exceptions.js"}
<div class="ty-product-block">
    <div class="ty-product-block__wrapper clearfix">
    {hook name="products:view_main_info"}
        {if $product}
            {assign var="obj_id" value=$product.product_id}
            {include file="common/product_data.tpl" product=$product separate_buttons=$separate_buttons|default:true but_role="big" but_text=__("add_to_cart")}
            <div class="ty-product-block__img-wrapper">
                {hook name="products:image_wrap"}
                    {if !$no_images}
                        <div class="ty-product-block__img cm-reload-{$product.product_id}" id="product_images_{$product.product_id}_update">

                            {assign var="discount_label" value="discount_label_`$obj_prefix``$obj_id`"}
                            {$smarty.capture.$discount_label nofilter}

                            {include file="views/products/components/product_images.tpl" product=$product show_detailed_link="Y" image_width=$settings.Thumbnails.product_details_thumbnail_width image_height=$settings.Thumbnails.product_details_thumbnail_height}
                        <!--product_images_{$product.product_id}_update--></div>
                    {/if}
                {/hook}
            </div>
            <div class="ty-product-block__left">
                {assign var="form_open" value="form_open_`$obj_id`"}
                {$smarty.capture.$form_open nofilter}

                {hook name="products:main_info_title"}
                    {include file="common/ls_breadcrumbs.tpl"}
                    {if !$hide_title}
                        <h1 class="ty-product-block-title">{$product.product nofilter}</h1>
                    {/if}

                    {hook name="products:brand"}
                        <div class="brand">
                            {include file="views/products/components/product_features_short_list.tpl" features=$product.header_features}
                        </div>
                    {/hook}
                {/hook}

                {assign var="old_price" value="old_price_`$obj_id`"}
                {assign var="price" value="price_`$obj_id`"}
                {assign var="clean_price" value="clean_price_`$obj_id`"}
                {assign var="list_discount" value="list_discount_`$obj_id`"}
                {assign var="discount_label" value="discount_label_`$obj_id`"}

                {hook name="products:promo_text"}
                {if $product.promo_text}
                <div class="ty-product-block__note">
                    {$product.promo_text nofilter}
                </div>
                {/if}
                {/hook}

                <div class="{if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}prices-container {/if}price-wrap">
                    
                    {if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}
                        <div class="ty-product-prices">
                            {if $smarty.capture.$old_price|trim}{$smarty.capture.$old_price nofilter}&nbsp;{/if}
                    {/if}

                    {if $smarty.capture.$price|trim}
                        <div class="ty-product-block__price-actual">
                            {$smarty.capture.$price nofilter}
                        </div>
                    {/if}

                    {if $smarty.capture.$old_price|trim || $smarty.capture.$clean_price|trim || $smarty.capture.$list_discount|trim}
                            {$smarty.capture.$clean_price nofilter}
                            {$smarty.capture.$list_discount nofilter}
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
                    {assign var="sku" value="sku_`$obj_id`"}
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

                {if $show_descr}
                {assign var="prod_descr" value="prod_descr_`$obj_id`"}
                    <h3 class="ty-product-block__description-title">{__("description")}</h3>
                    <div class="ty-product-block__description">{$smarty.capture.$prod_descr nofilter}</div>
                {/if}
                {*shipping estimation*}
                {assign var="ls_shipping_estimation_show2" value=true}
                {assign var="shipping_test" value=99}
                {if ($settings.General.inventory_tracking == "Y" && $settings.General.allow_negative_amount != "Y" && (($product_amount <= 0 || $product_amount < $product.min_qty) && $product.tracking != "D") && $product.is_edp != "Y")}
                  {if (!$product.hide_stock_info && !(($product_amount <= 0 || $product_amount < $product.min_qty) && ($product.avail_since > $smarty.const.TIME)))}
                    {assign var="ls_shipping_estimation_show2" value=false}
                     {assign var="shipping_test" value=3}
                  {/if}
                {/if}
                {*if $show_product_amount && $product.is_edp != "Y" && $settings.General.inventory_tracking == "Y"}
          {if !$product.hide_stock_info}
            {if $settings.Appearance.in_stock_field == "Y"}
                {if $product.tracking != "D"}
                    {if ($product_amount > 0 && $product_amount >= $product.min_qty) && $settings.General.inventory_tracking == "Y" || $details_page}
                        {if $settings.General.inventory_tracking == "Y" && $settings.General.allow_negative_amount != "Y"}
                            {assign var="ls_shipping_estimation_show2" value=false}
                             {assign var="shipping_test" value=2}
                        {/if}
                    {/if}
                {/if}
            {else}
                {if ((($product_amount > 0 && $product_amount >= $product.min_qty) || $product.tracking == "D") && $settings.General.inventory_tracking == "Y" && $settings.General.allow_negative_amount != "Y") || ($settings.General.inventory_tracking == "Y" && $settings.General.allow_negative_amount == "Y")}
                    {if ($product_amount<1)}
                       {assign var="ls_shipping_estimation_show2" value=false}
                        {assign var="shipping_test" value=1}
                    {/if}
                {elseif $details_page && ($product_amount <= 0 || $product_amount < $product.min_qty) && $settings.General.inventory_tracking == "Y" && $settings.General.allow_negative_amount != "Y"}
                    {assign var="ls_shipping_estimation_show2" value=false}
                    {assign var="shipping_test" value=0}
                {/if}
            {/if}
        {/if}
        {/if*}  
                {*if $ls_shipping_estimation_show2*}
                <!--div class="ls_shipping_estimation" id="ls_shipping_estimation" style='display: none'>
                    <span style="display: none">ls_get_product_variants: {$ls_get_product_variants|var_dump}</span>
                    <span style="display: none">ls_shipping_estimation_variants: {$ls_shipping_estimation_variants|var_dump}</span>
                    <span style="display: none">settings.General.allow_negative_amount: {$settings.General.allow_negative_amount}</span>
                    <span style="display: none">ls_shipping_estimation_show: {$ls_shipping_estimation_show}</span>
                    <div> {*$ls_in_stock*}{*$product|var_dump*} Disponibil incepand cu: {$ls_avail_since}{*$product.avail_since*}</div>
                    <div>Timp procesare: {$product.ls_order_processing} ; Timp backorder: {$product.comm_period}</div>
                     <div>Actiune in lipsa stocului: {$product.out_of_stock_actions}</div>
                    <img src="/design/themes/responsive/media/images/images/transport.png">
                    <span class="ls_shipping_estimation_text">{__("ls_shipping_estimation")}
                        <span>{*$ls_shipping_estimation*}
                            {$ls_shipping_estimation_day} {__("month_name_abr_$ls_shipping_estimation_month")} {$ls_shipping_estimation_year} 
                        </span>
                    </span> 
                    <img src="/design/themes/responsive/media/images/images/info.png"> 
                </div-->
                {*/if*}
                {if $capture_buttons}{capture name="buttons"}{/if}
                <div class="ty-product-block__button">
                    {if $show_details_button}
                        {include file="buttons/button.tpl" but_href="products.view?product_id=`$product.product_id`" but_text=__("view_details") but_role="submit"}
                    {/if}

                    {assign var="add_to_cart" value="add_to_cart_`$obj_id`"}
                    {$smarty.capture.$add_to_cart nofilter}

                    {assign var="list_buttons" value="list_buttons_`$obj_id`"}
                    {$smarty.capture.$list_buttons nofilter}
                </div>
                {if $capture_buttons}{/capture}{/if}

                {assign var="form_close" value="form_close_`$obj_id`"}
                {$smarty.capture.$form_close nofilter}

                {hook name="products:product_detail_bottom"}
                {/hook}

                {if $show_product_tabs}
                {include file="views/tabs/components/product_popup_tabs.tpl"}
                {$smarty.capture.popupsbox_content nofilter}
                {/if}
            </div>
        {/if}

    {/hook}
    </div>

    {if $smarty.capture.hide_form_changed == "Y"}
        {assign var="hide_form" value=$smarty.capture.orig_val_hide_form}
    {/if}

    {if $show_product_tabs}

        {include file="views/tabs/components/product_tabs.tpl"}

        {if $blocks.$tabs_block_id.properties.wrapper}
            {include file=$blocks.$tabs_block_id.properties.wrapper content=$smarty.capture.tabsbox_content title=$blocks.$tabs_block_id.description}
        {else}
            {$smarty.capture.tabsbox_content nofilter}
        {/if}

    {/if}
</div>

<div class="product-details">
</div>

{capture name="mainbox_title"}{assign var="details_page" value=true}{/capture}
{include file="common/ls_breadcrumbs_bot.tpl"}