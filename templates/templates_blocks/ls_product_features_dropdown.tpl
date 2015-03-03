<div id="ls_product_page_accordion">
{foreach from=$tabs item="tab" key="tab_id"}
         <h3> Test dropdown{$tab_id}</h3>
         <div id="{$tab_id}" class="ty-dropdown-box__title cm-combination">
             Test content {$tab_id}
         </div>
{/foreach}  
</div>


