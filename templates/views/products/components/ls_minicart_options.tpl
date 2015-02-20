{foreach from=$ls_minicart_options key=k item=option}
            <div class="div_option_label_title">
                <label class="ty-control-group__label ty-product-options__item-label">
                    {$option.0.option_name}
                </label>
                <label class="ty-control-group__label ty-product-options__item-label label_option_variant_selected">
                    {$option.0.variant_name}
                </label> 
            </div>
{/foreach}