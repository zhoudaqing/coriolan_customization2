{assign var="empty_tab_ids" value=$content|empty_tabs}
<div id="ls_product_page_accordion">
    {foreach from=$tabs item=tab key=tab_id}
        {if ((!$tabs_section && !$tab.section) || ($tabs_section == $tab.section)) && !$key|in_array:$empty_tab_ids}
            <h3 class="tab-list-title">{$tab.name}</h3>
            <div id="content_{$tab.html_id}" class="ty-wysiwyg-content content-{$tab.html_id}">
                {*$smarty.capture.$tab_content_capture nofilter*}
                {if $tab.tab_type == 'B'}
                    {render_block block_id=$tab.block_id dispatch="products.view"}
                {elseif $tab.tab_type == 'T'}
                    {include file=$tab.template product_tab_id=$tab.html_id}
                {/if}
                <span style="display: none" class="ls_testcontent"></span>
            </div>
        {/if}
    {/foreach} 
</div>


