{if ls_filters_breadcrumbs}
<div class="ls_filters_breadcrumbs">
    <div class="ty-breadcrumbs clearfix">
        {strip}
            {foreach from=$ls_filters_breadcrumbs item="bc" name="bcn" key="key" name="breadcrumbs"}
                    {if $key != "0" }
                    <span class="ty-breadcrumbs__slash">.</span>
                    {/if}
                {if $bc.link}
                    <a href="{$bc.link|fn_url}" class="ty-breadcrumbs__a{if $additional_class} {$additional_class}{/if}"{if $bc.nofollow} rel="nofollow"{/if}>{$bc.title|strip_tags|escape:"html" nofilter}</a>
                {else}
                    <span class="ty-breadcrumbs__current">{$bc.title|strip_tags|escape:"html" nofilter}</span>
                {/if}
                {if $featuresHashArrayLinks}
                        {foreach from=$featuresHashArrayLinks item="bcl" name="bcnl" key="keyl" name="breadcrumbsl"}
                            {if $key == (($breadcrumbs|@sizeof) - $keyl)}
                                <a href="{$bcl|fn_url}" class="ty-breadcrumbs__a_delete"> x </a>
                            {/if}
                        {/foreach}
                {else}
                     <span> test </span>
                {/if}
            {/foreach}
            {include file="common/view_tools.tpl"}
        {/strip}
    </div>
</div>
{/if}