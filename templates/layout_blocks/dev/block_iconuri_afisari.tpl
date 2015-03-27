{assign var="curl" value=$config.current_url|fn_query_remove:"sort_by":"sort_order":"result_ids":"layout"}
{assign var="sorting" value=""|fn_get_products_sorting}
{assign var="sorting_orders" value=""|fn_get_products_sorting_orders}
{assign var="layouts" value=""|fn_get_products_views:false:false}
{assign var="pagination_id" value=$id|default:"pagination_contents"}
{assign var="avail_sorting" value=$settings.Appearance.available_product_list_sortings}
{if !(($category_data.selected_layouts|count == 1) || ($category_data.selected_layouts|count == 0 && ""|fn_get_products_views:true|count <= 1)) && !$hide_layouts}
<div class="ty-sort-container__views-icons">
{foreach from=$layouts key="layout" item="item"}
{if ($category_data.selected_layouts.$layout) || (!$category_data.selected_layouts && $item.active)}
    {if $layout == $selected_layout}
        {$sort_order = $search.sort_order_rev}
    {else}
        {$sort_order = $search.sort_order}
    {/if}
<a class="ty-sort-container__views-a {$ajax_class} {if $layout == $selected_layout}active{/if}" data-ca-target-id="{$pagination_id}" href="{"`$curl`&sort_by=`$search.sort_by`&sort_order=`$sort_order`&layout=`$layout`"|fn_url}" rel="nofollow">
    <i class="ty-icon-{$layout|replace:"_":"-"}"></i>
</a>
{/if}
{/foreach}
</div>
{/if}