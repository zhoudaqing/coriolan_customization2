{strip}
{if $settings.General.alternative_currency == "use_selected_and_alternative"}
    {$value|format_price:$currencies.$primary_currency:$span_id:$class:false nofilter}{if $secondary_currency != $primary_currency}&nbsp;{if $class}<span class="ls_primary_currency {$class}">{/if}({if $class}</span>{/if}{$value|format_price:$currencies.$secondary_currency:$span_id:$class:true:$is_integer nofilter}{if $class}<span class="ls_secondary_currency {$class}">{/if}){if $class}</span>{/if}{/if}
{else}
    {$value|format_price:$currencies.$secondary_currency:$span_id:$class:true nofilter}
{/if}
{/strip}