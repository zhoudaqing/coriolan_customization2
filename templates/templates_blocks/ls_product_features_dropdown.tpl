{if $navigation.tabs}
    {assign var="empty_tab_ids" value=$content|empty_tabs}
    <div id="ls_product_page_accordion">
        {foreach from=$navigation.tabs item=tab key=key name=tabs}
            {if ((!$tabs_section && !$tab.section) || ($tabs_section == $tab.section)) && !$key|in_array:$empty_tab_ids}
                <h3>{$tab.title}</h3>
                <div id="{$tab_id}" class="cm-tabs-content ty-tabs__content clearfix">
                    {$content nofilter}
                </div>
            {/if}
        {/foreach}  
    </div>
{/if}


