<div id="ls_product_page_accordion">
    {foreach from=$tabs item=tab key=tab_id}
        {if $tab.html_id==="description" || $tab.html_id==="required_products" || $tab.html_id==="features"}
            <h3 class="tab-list-title">{$tab.name}</h3>
            <div id="content_{$tab.html_id}" class="ty-wysiwyg-content content-{$tab.html_id}">
                {*$smarty.capture.$tab_content_capture nofilter*}
                {if $tab.tab_type == 'B'}
                    {render_block block_id=$tab.block_id dispatch="products.view"}
                {elseif $tab.tab_type == 'T'}
                    {include file=$tab.template product_tab_id=$tab.html_id}
                {/if}
                {*$smarty.capture.$tab_content_capture nofilter*}
            </div>
        {/if}
    {/foreach} 
</div>


