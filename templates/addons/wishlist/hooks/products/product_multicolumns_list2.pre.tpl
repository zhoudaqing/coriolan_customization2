{if $is_wishlist}
<div class="ty-twishlist-item testmulticolumnpre">
    <a href="{"wishlist.delete?cart_id=`$product.cart_id`"|fn_url}" class="ty-twishlist-item__remove ty-remove" title="{__("remove")}"><i class="ty-remove__icon ty-icon-cancel-circle"></i></a>
</div>
{/if}