{assign var="id" value=$id|default:"pagination_contents"}
{assign var="pagination" value=$search|fn_generate_pagination}
{assign var="pagination2" value=$search2|fn_generate_pagination}
{if $smarty.capture.pagination_open != "Y"}
    <div class="ty-pagination-container cm-pagination-container" id="{$id}">

        {if $save_current_page}
            <input type="hidden" name="page" value="{$search.page|default:$smarty.request.page}" />
        {/if}

        {if $save_current_url}
            <input type="hidden" name="redirect_url" value="{$config.current_url}" />
        {/if}
    {/if}

    {if $pagination.total_pages > 1}
        {if $settings.Appearance.top_pagination == "Y" && $smarty.capture.pagination_open != "Y" || $smarty.capture.pagination_open == "Y"}
            {assign var="c_url" value=$config.current_url|fn_query_remove:"page"}

            {if !$config.tweaks.disable_dhtml || $force_ajax}
                {assign var="ajax_class" value="cm-ajax"}
            {/if}

            {if $smarty.capture.pagination_open == "Y"}
                <div class="ty-pagination__bottom">
                {/if}
                <div class="ty-pagination">
                    {if $pagination.prev_range}
                        <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination.prev_range``$extra_url`"|fn_url}" data-ca-page="{$pagination.prev_range}" class="cm-history hidden-phone ty-pagination__item ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination.prev_range_from} - {$pagination.prev_range_to}</a>
                    {/if}
                    <a data-ca-scroll=".cm-pagination-container" class="testpagination2 ty-pagination__item ty-pagination__btn ty-pagination__prev {if !$pagination.prev_page}ls_inactive_pagination{/if}{if $pagination.prev_page} cm-history {$ajax_class}{/if}" {if $pagination.prev_page}href="{"`$c_url`&page=`$pagination.prev_page`"|fn_url}" data-ca-page="{$pagination.prev_page}" data-ca-target-id="{$id}"{/if}><i class="ty-pagination__text-arrow">&larr;</i>&nbsp;<span class="ty-pagination__text">{__("prev_page")}</span></a>

                    <div class="ty-pagination__items test_total_pages_1">
                        {foreach from=$pagination.navi_pages item="pg"}
                            {if $pg != $pagination.current_page}
                                <a href="{"`$c_url`&page=`$pg``$extra_url`"|fn_url}" data-ca-page="{$pg}" class="cm-history ty-pagination__item {$ajax_class}" data-ca-target-id="{$id}">{$pg}</a>
                            {else}
                                <span class="ty-pagination__selected">{$pg}</span>
                            {/if}
                        {/foreach}
                    </div>

                    <a data-ca-scroll=".cm-pagination-container" class="ty-pagination__item ty-pagination__btn ty-pagination__next {if !$pagination.next_page}ls_inactive_pagination{/if} {if $pagination.next_page} cm-history {$ajax_class}{/if}" {if $pagination.next_page}href="{"`$c_url`&page=`$pagination.next_page``$extra_url`"|fn_url}" data-ca-page="{$pagination.next_page}" data-ca-target-id="{$id}"{/if}><span class="ty-pagination__text">{__("next")}</span>&nbsp;<i class="ty-pagination__text-arrow">&rarr;</i></a>

                    {if $pagination.next_range}
                        <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination.next_range``$extra_url`"|fn_url}" data-ca-page="{$pagination.next_range}" class="cm-history ty-pagination__item hidden-phone ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination.next_range_from} - {$pagination.next_range_to}</a>
                    {/if}
                </div>
                <div class="ls_view_all">
                    <!--form method="POST" action="{$config.current_url|regex_replace:"/\?.*/":""}&dispatch=categories.view"-->
                    <!--form method="POST" action="{$config.current_url|regex_replace:"/&page=.*/":""}">
                        <input type="hidden" name="ls_view_all">
                         <input type="hidden" name="test" value="{$categories_tree}">
                        <input type="submit" value='{__("view_all")}'>
                    </form-->
                    <a href="{$config.current_url|regex_replace:"/&page=.*/":""}?&ls_view_all=true">{__("view_all")}</a>
                    <!--a href="{$config.current_url}?dispatch=categories.view&ls_view_all=true">{__("view_all")}</a-->
                    <!--a href="{$config.current_url|fn_url}?&ls_view_all=true">{__("view_all")}</a-->
                </div>
                <div class="ls_pagination_total_products">
                    {$ls_total_products_category} {__("block_products")}
                </div>
                <div class="ls_pagination_return">
                    <div class="ls_pagination_return_click">
                        click me
                    </div>
                    <div>{__("ls_top")}</span>
                    </div>
                </div>
                {if $smarty.capture.pagination_open == "Y"}
                </div>
            {/if}
        {else}
            <div><a data-ca-scroll=".cm-pagination-container" href="" data-ca-page="{$pg}" data-ca-target-id="{$id}" class="hidden"></a></div>
            {/if}
        {else}
            {*add view all condition here*}
            {if $ls_view_all}
                {if $settings.Appearance.top_pagination == "Y" && $smarty.capture.pagination_open != "Y" || $smarty.capture.pagination_open == "Y"}
                    {assign var="c_url" value=$config.current_url|fn_query_remove:"page"}

                {if !$config.tweaks.disable_dhtml || $force_ajax}
                    {assign var="ajax_class" value="cm-ajax"}
                {/if}

                {if $smarty.capture.pagination_open == "Y"}
                    <div class="ty-pagination__bottom">
                    {/if}
                    <div class="ty-pagination">
                        {if $pagination2.prev_range}
                            <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination2.prev_range``$extra_url`"|fn_url}" data-ca-page="{$pagination2.prev_range}" class="cm-history hidden-phone ty-pagination__item ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination2.prev_range_from} - {$pagination2.prev_range_to}</a>
                        {/if}
                        <a data-ca-scroll=".cm-pagination-container" class="testpagination2 ty-pagination__item ty-pagination__btn ty-pagination__prev {if !$pagination2.prev_page}ls_inactive_pagination{/if}{if $pagination2.prev_page} cm-history {$ajax_class}{/if}" {if $pagination2.prev_page}href="{"`$c_url`&page=`$pagination2.prev_page`"|fn_url}" data-ca-page="{$pagination2.prev_page}" data-ca-target-id="{$id}"{/if}><i class="ty-pagination__text-arrow">&larr;</i>&nbsp;<span class="ty-pagination__text">{__("prev_page")}</span></a>

                        <div class="ty-pagination__items test_ls_view_all ls_pagination_dropdown">
                            {foreach from=$pagination2.navi_pages item="pg" name="pagination_view_all"}
                                {if $smarty.foreach.pagination_view_all.first} 
                                    <a href="{"`$c_url`&page=`$pg``$extra_url`"|fn_url|regex_replace:"/ls_view_all=true/":""}" data-ca-page="{$pg}" class="cm-history ty-pagination__item {$ajax_class}" data-ca-target-id="{$id}">{$pg}</a> 
                                {else}
                                     <a href="{"`$c_url`&page=`$pg``$extra_url`"|fn_url|regex_replace:"/ls_view_all=true/":""}" data-ca-page="{$pg}" class="ls_pagination_dropdown_selection cm-history ty-pagination__item {$ajax_class}" data-ca-target-id="{$id}" style="display: none">{$pg}</a>
                                {/if}
                            {/foreach}
                        </div>

                        <a data-ca-scroll=".cm-pagination-container" class="ty-pagination__item ty-pagination__btn ty-pagination__next {if !$pagination2.next_page}ls_inactive_pagination{/if} {if $pagination2.next_page} cm-history {$ajax_class}{/if}" {if $pagination2.next_page}href="{"`$c_url`&page=`$pagination2.next_page``$extra_url`"|fn_url}" data-ca-page="{$pagination2.next_page}" data-ca-target-id="{$id}"{/if}><span class="ty-pagination__text">{__("next")}</span>&nbsp;<i class="ty-pagination__text-arrow">&rarr;</i></a>

                        {if $pagination2.next_range}
                            <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination2.next_range``$extra_url`"|fn_url}" data-ca-page="{$pagination2.next_range}" class="cm-history ty-pagination__item hidden-phone ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination2.next_range_from} - {$pagination2.next_range_to}</a>
                        {/if}
                    </div>
                    <!--div class="ls_view_all">
                    <a href="{$config.current_url|regex_replace:"/page-.*/":""}?&ls_view_all=true">{__("view_all")}</a>
                    </div-->
                    <div class="ls_pagination_total_products">
                        {$ls_total_products_category} {__("block_products")}
                    </div>
                    <div class="ls_pagination_return">
                        <div class="ls_pagination_return_click">
                            click me
                        </div>
                        <div>{__("ls_top")}</span>
                        </div>
                    </div>
                    {if $smarty.capture.pagination_open == "Y"}
                    </div>
                {/if}
            {else}
                <div><a data-ca-scroll=".cm-pagination-container" href="" data-ca-page="{$pg}" data-ca-target-id="{$id}" class="hidden"></a></div>
                {/if}
            {else} {*display pagination for 1 page*}
            {if $settings.Appearance.top_pagination == "Y" && $smarty.capture.pagination_open != "Y" || $smarty.capture.pagination_open == "Y"}
            {assign var="c_url" value=$config.current_url|fn_query_remove:"page"}

            {if !$config.tweaks.disable_dhtml || $force_ajax}
                {assign var="ajax_class" value="cm-ajax"}
            {/if}

            {if $smarty.capture.pagination_open == "Y"}
                <div class="ty-pagination__bottom">
                {/if}
                <div class="ty-pagination">
                    {if $pagination.prev_range}
                        <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination.prev_range``$extra_url`"|fn_url}" data-ca-page="{$pagination.prev_range}" class="cm-history hidden-phone ty-pagination__item ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination.prev_range_from} - {$pagination.prev_range_to}</a>
                    {/if}
                    <a data-ca-scroll=".cm-pagination-container" class="testpagination2 ty-pagination__item ty-pagination__btn ty-pagination__prev {if !$pagination.prev_page}ls_inactive_pagination{/if}{if $pagination.prev_page} cm-history {$ajax_class}{/if}" {if $pagination.prev_page}href="{"`$c_url`&page=`$pagination.prev_page`"|fn_url}" data-ca-page="{$pagination.prev_page}" data-ca-target-id="{$id}"{/if}><i class="ty-pagination__text-arrow">&larr;</i>&nbsp;<span class="ty-pagination__text">{__("prev_page")}</span></a>

                    <div class="ty-pagination__items test_total_pages_1">
                        {foreach from=$pagination.navi_pages item="pg"}
                            {if $pg != $pagination.current_page}
                                <a href="{"`$c_url`&page=`$pg``$extra_url`"|fn_url}" data-ca-page="{$pg}" class="cm-history ty-pagination__item {$ajax_class}" data-ca-target-id="{$id}">{$pg}</a>
                            {else}
                                <span class="ty-pagination__selected">{$pg}</span>
                            {/if}
                        {/foreach}
                    </div>

                    <a data-ca-scroll=".cm-pagination-container" class="ty-pagination__item ty-pagination__btn ty-pagination__next {if !$pagination.next_page}ls_inactive_pagination{/if} {if $pagination.next_page} cm-history {$ajax_class}{/if}" {if $pagination.next_page}href="{"`$c_url`&page=`$pagination.next_page``$extra_url`"|fn_url}" data-ca-page="{$pagination.next_page}" data-ca-target-id="{$id}"{/if}><span class="ty-pagination__text">{__("next")}</span>&nbsp;<i class="ty-pagination__text-arrow">&rarr;</i></a>

                    {if $pagination.next_range}
                        <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination.next_range``$extra_url`"|fn_url}" data-ca-page="{$pagination.next_range}" class="cm-history ty-pagination__item hidden-phone ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination.next_range_from} - {$pagination.next_range_to}</a>
                    {/if}
                </div>
                <div class="ls_pagination_total_products">
                    {$ls_total_products_category} {__("block_products")}
                </div>
                <div class="ls_pagination_return">
                    <div class="ls_pagination_return_click">
                        click me
                    </div>
                    <div>{__("ls_top")}</span>
                    </div>
                </div>
                {if $smarty.capture.pagination_open == "Y"}
                </div>
            {/if}
        {else}
            <div><a data-ca-scroll=".cm-pagination-container" href="" data-ca-page="{$pg}" data-ca-target-id="{$id}" class="hidden"></a></div>
            {/if}
            {/if}
        {/if}

    {if $smarty.capture.pagination_open == "Y"}
        <!--{$id}--></div>
    {capture name="pagination_open"}N{/capture}
{elseif $smarty.capture.pagination_open != "Y"}
    {capture name="pagination_open"}Y{/capture}
{/if}
