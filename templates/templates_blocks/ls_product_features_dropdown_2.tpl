<div id="ls_product_page_accordion">
    {assign var="ls_display_features" value=false}
    {foreach from=$product.product_features item=feature key=k}
        {if $feature.subfeatures} {*to hide empty features dropdown*}
            {$ls_display_features=true}
        {/if}
    {/foreach}
    {foreach from=$tabs item=tab key=tab_id}
        {if $tab.html_id==="description" && $product.short_description == ""}
            {continue}
        {/if}
        {if $tab.html_id==="required_products" && $product.required_products == ""}
            {continue}
        {/if}
        {if $tab.html_id==="features" && $product.product_features == ""}
            {continue}
        {/if}
        {if $tab.html_id==="description" || $tab.html_id==="required_products" || ($tab.html_id==="features" && $ls_display_features)}
            {if $tab.html_id==="description"}
            <h3 class="ls_product_accordion_title">{__("description")}</h3>
            {/if}
            {if $tab.html_id==="required_products"}
            <h3 class="ls_product_accordion_title">{__("required_products")}</h3>
            {/if}
            {if $tab.html_id==="features"}
            <h3 class="ls_product_accordion_title">{__("features")}</h3>
            {/if}
            <div id="content_{$tab.html_id}" class="ty-wysiwyg-content content-{$tab.html_id}">
                {*$smarty.capture.$tab_content_capture nofilter*}
                {if $tab.tab_type == 'B'}
                    {render_block block_id=$tab.block_id dispatch="products.view"}
                {elseif $tab.tab_type == 'T'}
                    {include file=$tab.template product_tab_id=$tab.html_id}
                {/if}
            </div>
        {/if}
    {/foreach} 
</div>



