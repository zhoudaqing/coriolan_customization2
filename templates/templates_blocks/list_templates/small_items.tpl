<div class='botmenu_wrapper ls_menu_resize wide_carousel'>
    <div class='ls_upper_recent'>
        <div id='ls_total_bijuterie' class='ls_total_bijuterie'> </div>
        <div class='ls_recent_title'>RECENT VIZUALIZATE</div>
        <div class='ls_close_window'><a href='#'>{__("close")}</a></div>
    </div>
    <div class='ls_recent_carousel'> 
       <div class="lsc_wrap ">
            <div class="lsc_slider">
                <ul class="recent_carousel_ul lcs_fix">
                    {foreach from=$products item="product" name="products"}
                            {assign var="obj_id" value=$product.product_id}
                            {assign var="obj_id_prefix" value="`$obj_prefix``$product.product_id`"}
                            {include file="common/product_data.tpl" product=$product}
                            {hook name="products:product_small_item"}
                            <li class="clearfix lsc_li_container">
                                {assign var="form_open" value="form_open_`$obj_id`"}
                                {$smarty.capture.$form_open nofilter}
                                    <div class="ty-grid-list__image">
                                        <a href="{"products.view?product_id=`$product.product_id`"|fn_url}">{include file="common/image.tpl" image_width="170" image_height="213" images=$product.main_pair obj_id=$obj_id_prefix no_ids=true ls_recent_footer=true}</a>
                                    </div>
                                    <!--div class="lsc_description">
                                    {*
                                        {if $block.properties.item_number == "Y"}{$smarty.foreach.products.iteration}.&nbsp;{/if}
                                        {assign var="name" value="name_$obj_id"}{$smarty.capture.$name nofilter}

                                        {if $show_price}
                                        <div class="ty-template-small__item-price">
                                            {assign var="old_price" value="old_price_`$obj_id`"}
                                            {if $smarty.capture.$old_price|trim}{$smarty.capture.$old_price nofilter}&nbsp;{/if}

                                            {assign var="price" value="price_`$obj_id`"}
                                            {$smarty.capture.$price nofilter}
                                        </div>
                                        {/if}

                                        {assign var="rating" value="rating_$obj_id"}
                                        {$smarty.capture.$rating nofilter}

                                        {assign var="add_to_cart" value="add_to_cart_`$obj_id`"}
                                        {if $smarty.capture.$add_to_cart|trim}<p>{$smarty.capture.$add_to_cart nofilter}</p>{/if}
                                    *}</div-->
                                {assign var="form_close" value="form_close_`$obj_id`"}
                                {$smarty.capture.$form_close nofilter}
                            </li>
                            {/hook}
                        {/foreach}              
                </ul>
            </div>
            <div class="lsc_slider-nav">
                <span class="ls_nav_bullets"></span>
                <button class="lsc_previous_b" data-dir="prev">Previous</button>
                <button class="lsc_next_b"  data-dir="next">Next</button>
            </div>
        </div>        
    </div>
</div>