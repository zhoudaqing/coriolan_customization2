{foreach from=$ls_minicart_options key=k item=option}
    {if $smarty.session.settings.cart_languageC.value==='en'}
        {if $option.0.variant_name}     
            <span class="ty-product-options clearfix">
                <span class="ty-product-options-name ls_minicart_option_name">{$option.0.option_name}:&nbsp;</span>
                <span class="ty-product-options-content ls_minicart_variant_name">{$option.0.variant_name}&nbsp;</span>
            </span>
        {/if}
    {else}
        {if $option.1.variant_name}  
            <span class="ty-product-options clearfix">
                <span class="ty-product-options-name ls_minicart_option_name">{$option.1.option_name}:&nbsp;</span>
                <span class="ty-product-options-content ls_minicart_variant_name">{$option.1.variant_name}&nbsp;</span>
            </span>
        {/if}
    {/if}
{/foreach}