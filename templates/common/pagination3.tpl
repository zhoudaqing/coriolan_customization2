
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

                        <div class="ty-pagination__items">
                            {foreach from=$pagination2.navi_pages item="pg"}
                                {if $pg != $pagination2.current_page}
                                    <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pg``$extra_url`"|fn_url}" data-ca-page="{$pg}" class="cm-history ty-pagination__item {$ajax_class}" data-ca-target-id="{$id}">{$pg}</a>
                                {else}
                                    <span class="ty-pagination__selected">{$pg}</span>
                                {/if}
                            {/foreach}
                        </div>

                        <a data-ca-scroll=".cm-pagination-container" class="ty-pagination__item ty-pagination__btn ty-pagination__next {if !$pagination2.next_page}ls_inactive_pagination{/if} {if $pagination2.next_page} cm-history {$ajax_class}{/if}" {if $pagination2.next_page}href="{"`$c_url`&page=`$pagination2.next_page``$extra_url`"|fn_url}" data-ca-page="{$pagination2.next_page}" data-ca-target-id="{$id}"{/if}><span class="ty-pagination__text">{__("next")}</span>&nbsp;<i class="ty-pagination__text-arrow">&rarr;</i></a>

                        {if $pagination2.next_range}
                            <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination2.next_range``$extra_url`"|fn_url}" data-ca-page="{$pagination2.next_range}" class="cm-history ty-pagination__item hidden-phone ty-pagination__range {$ajax_class}" data-ca-target-id="{$id}">{$pagination2.next_range_from} - {$pagination2.next_range_to}</a>
                        {/if}
                        <div class="ls_view_all">
                            <a href="{$config.current_url}?dispatch=categories.view&ls_view_all=true">{__("view_all")}</a>
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


