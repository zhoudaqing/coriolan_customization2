{assign var="id1" value=$id1|default:"pagination_contents"}
{assign var="pagination4" value=$search|fn_generate_pagination}
{assign var="pagination3" value=$search2|fn_generate_pagination}
{assign var="c_url" value=$config.current_url|fn_query_remove:"page"}
    <div class="ls_next_page_container">
         <span>{__("page")} {$pagination4.current_page}</span>
         {if $pagination4.next_page} 
          <a data-ca-scroll=".cm-pagination-container" href="{"`$c_url`&page=`$pagination4.next_page``$extra_url`"|fn_url}" data-ca-page="{$pagination4.next_range}" class="ls_next_page_container_link cm-history ty-pagination__item hidden-phone ty-pagination__range {$ajax_class}" data-ca-target-id="{$id1}"><span class='ls_next_page_icon'></span>{__("ls_next_page")}{*$pagination4.next_range_from} - {$pagination4.next_range_to*}</a>
         {/if}
    </div>
