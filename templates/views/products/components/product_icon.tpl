{assign var="wishlist_id" value=""}

{if $wishlist}
    {assign var="wishlist_id" value="&wishlist_id=`$product.cart_id`"}
{/if}

{capture name="main_icon"}
    {if $ls_is_category_page}
        <a href="{"products.view?product_id=`$product.product_id``$wishlist_id`"|fn_url}">
            {include file="common/image.tpl" obj_id=$obj_id_prefix images=$product.main_pair image_width=230}
        </a>
    {else}
        <a href="{"products.view?product_id=`$product.product_id``$wishlist_id`"|fn_url}">
            {include file="common/image.tpl" obj_id=$obj_id_prefix images=$product.main_pair image_width=$settings.Thumbnails.product_lists_thumbnail_width image_height=$settings.Thumbnails.product_lists_thumbnail_height}
        </a>
    {/if}  
{/capture}

{if $product.image_pairs && $show_gallery}
<div class="ty-center-block">
    <div class="ty-thumbs-wrapper owl-carousel cm-image-gallery" data-ca-items-count="1" data-ca-items-responsive="true" id="icons_{$obj_id_prefix}">
        {if $product.main_pair}
            <div class="cm-gallery-item cm-item-gallery">
                {$smarty.capture.main_icon nofilter}
            </div>
        {/if}
        {foreach from=$product.image_pairs item="image_pair"}
            {if $image_pair}
                <div class="cm-gallery-item cm-item-gallery {if $image_pair.pair_id_class}color_image_class_{$image_pair.pair_id_class}{if $image_pair.main_color_image}_1{/if}{/if}">
                    <a href="{"products.view?product_id=`$product.product_id``$wishlist_id`"|fn_url}">
                        {include file="common/image.tpl" no_ids=true images=$image_pair image_width=$settings.Thumbnails.product_lists_thumbnail_width image_height=$settings.Thumbnails.product_lists_thumbnail_height}
                    </a>
                </div>
            {/if}
        {/foreach}
    </div>
</div>
{else}
    {$smarty.capture.main_icon nofilter}
{/if}