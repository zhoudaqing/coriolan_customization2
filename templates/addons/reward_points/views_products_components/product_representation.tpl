{if $product.points_info.price}
    <div class="ty-control-group">
        <span class="ty-control-group__label product-list-field testproductrepresentation">{__("price_in_points")}:</span>
        <span class="ty-control-group__item" id="price_in_points_{$obj_prefix}{$obj_id}">{$product.points_info.price}&nbsp;{__("points_lower")}</span>
    </div>
    <span class="ls_test cm_reload-{$product.product_id}">
                             <div>Estimare: {$ls_shipping_estimation}</div><div>Stoc optiune selectata: {$ls_in_stock}</div>
                             <div>Optiunea selectata este legata de alte produse? : {$ls_option_linked}</div>
    </span>
{/if}
<div class="ty-control-group product-list-field{if !$product.points_info.reward.amount} hidden{/if}">
    <span class="ty-control-group__label">{__("reward_points")}:</span>
    <span class="ty-control-group__item" id="reward_points_{$obj_prefix}{$obj_id}" >{$product.points_info.reward.amount}&nbsp;{__("points_lower")}</span>
</div>