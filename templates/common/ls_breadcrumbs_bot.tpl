<div id="breadcrumbs_{$block.block_id}" class="ls_breadcrumbs_bot">

{if $breadcrumbs && $breadcrumbs|@sizeof > 1}
    <div class="ty-breadcrumbs clearfix ls_breadcrumbs2">
        {strip}
            {foreach from=$breadcrumbs item="bc" name="bcn" key="key" name="breadcrumbs"}
                {if $key != "0"}
                    {if $key != "1"}
                    {if !$smarty.foreach.breadcrumbs.last}     
                    <span class="ty-breadcrumbs__slash">.</span>
                    {/if}
                    {/if}
                {if $bc.link}
                   <a href="{$bc.link|fn_url}" class="ty-breadcrumbs__a{if $additional_class} {$additional_class}{/if}"{if $bc.nofollow} rel="nofollow"{/if}>Vezi {$bc.title|strip_tags|escape:"html" nofilter}</a>
                {/if}
                {/if}
            {/foreach}
            {*include file="common/view_tools.tpl"*}
        {/strip}
    </div>
{/if}

<!--breadcrumbs_{$block.block_id}--></div>
