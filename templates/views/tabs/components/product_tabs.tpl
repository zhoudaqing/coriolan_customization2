{capture name="tabsbox"}
    {foreach from=$tabs item="tab" key="tab_id"}
        {if $tab.show_in_popup != "Y" && $tab.status == "A"}
            {assign var="tab_content_capture" value="tab_content_capture_`$tab_id`"}

            {capture name=$tab_content_capture}
                {if $tab.tab_type == 'B'}
                    {render_block block_id=$tab.block_id dispatch="products.view"}
                {elseif $tab.tab_type == 'T'}
                    {include file=$tab.template product_tab_id=$tab.html_id}
                {/if}
            {/capture}

            {if $smarty.capture.$tab_content_capture|trim}
                {if $settings.Appearance.product_details_in_tab == "N"}
                    <h3 class="tab-list-title">{$tab.name}</h3>
                {/if}
            {/if}

            <div id="content_{$tab.html_id}" class="ty-wysiwyg-content content-{$tab.html_id}">
                {$smarty.capture.$tab_content_capture nofilter}
            </div>
        {/if}
    {/foreach}
{/capture}

{capture name="tabsbox_content"}
{if $settings.Appearance.product_details_in_tab == "Y"}
    {include file="common/tabsbox.tpl" content=$smarty.capture.tabsbox }
{else}
    {include file="blocks/ls_product_features_dropdown_2.tpl" content=$ls_product_dropdown_content title=$blocks.$tabs_block_id.description}
{/if}
{/capture}