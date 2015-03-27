{assign var="wishlist_id" value=""}
{if $wishlist}
    {assign var="wishlist_id" value="&wishlist_id=`$item_id`"}
{/if}

<div class="ty-quick-view-button" title="{__("quick_view")}">
    {$current_url = $config.current_url|urlencode}
    {$quick_view_url = "products.quick_view?product_id=`$product.product_id`&prev_url=`$current_url`"}
    {if $block.type && $block.type != 'main'}
        {$quick_view_url = $quick_view_url|fn_link_attach:"n_plain=Y"}
    {/if}
    {if $quick_nav_ids} 
        {$quick_nav_ids = ","|implode:$quick_nav_ids}
        {$quick_view_url = $quick_view_url|fn_link_attach:"n_items=`$quick_nav_ids`"}
    {/if}
    
    {*{if $product.product_id==2372}*}
        <a class="ty-btn ty-btn__secondary ty-btn__big" data-ca-view-id="{if $wishlist_id}{$item_id}{else}{$product.product_id}{/if}" data-ca-target-id="product_quick_view" href="{"`$quick_view_url``$wishlist_id`"|fn_url}" data-ca-dialog-title="{__("quick_product_viewer")}" onclick="quick_view_dialog_test('{"`$quick_view_url``$wishlist_id`"|fn_url}');return false;">{__("quick_view")}</a>
    {*{else}*}
        {*<a class="ty-btn ty-btn__secondary ty-btn__big cm-dialog-opener cm-dialog-auto-size" data-ca-view-id="{if $wishlist_id}{$item_id}{else}{$product.product_id}{/if}" data-ca-target-id="product_quick_view" href="{"`$quick_view_url``$wishlist_id`"|fn_url}" data-ca-dialog-title="{__("quick_product_viewer")}" rel="nofollow">{__("quick_view")}</a>*}
    {*{/if}*}
</div>