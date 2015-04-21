{if $but_role == "action"}
    {assign var="suffix" value="-action"}
    {assign var="file_prefix" value="action_"}
{elseif $but_role == "act"}
    {assign var="suffix" value="-act"}
    {assign var="file_prefix" value="action_"}
{elseif $but_role == "disabled_big"}
    {assign var="suffix" value="-disabled-big"}
{elseif $but_role == "big"}
    {assign var="suffix" value="-big"}
{elseif $but_role == "delete"}
    {assign var="suffix" value="-delete"}
{elseif $but_role == "tool"}
    {assign var="suffix" value="-tool"}
{else}
    {assign var="suffix" value=""}
{/if}

{if $but_name && $but_role != "text" && $but_role != "act" && $but_role != "delete"} {* SUBMIT BUTTON *}
        {if $ls_add_to_cart_button}
                 {*custom display/hide cart condition here*} 
                 <span>product_amount={$product_amount}, product.ls_order_amount={$product.ls_order_amount} </span> 
                {if $settings.General.allow_negative_amount=='Y'}      
                    {if $product_amount<$product.ls_order_amount}
                        {if $product.out_of_stock_actions=='S'}  
                            {if $product.avail_since<=$smarty.const.TIME}
                                {assign var="ls_hide_add_to_cart" value=true scope="global"}
                            {/if}
                        {/if}
                    {/if}
                {/if} 
            <div class="ls_add_to_cart_estimate" {if $ls_hide_add_to_cart}style='display:none'{/if}>
                <input type="hidden" name="ls_calculate_estimate" value="true">
                <div>Stoc with options: {$ls_inventory_amount}</div>
                <div>Stoc track without options: {$ls_amount}</div>
                <img src="/design/themes/responsive/media/images/images/transport.png">
                <span class="ls_shipping_estimation_text">{__("ls_shipping_estimation")}
                    <span class="ls_date">{*$ls_shipping_estimation*}
                        {*$ls_shipping_estimation_day} {__("month_name_abr_$ls_shipping_estimation_month")} {$ls_shipping_estimation_year*}
                        {$ls_shipping_testimation_date} {*$ls_post_hash*}
                    </span>
                </span>        
                <span style="display: none" class="ls_product_combination_hash">{$product.combination_hash}</span>
                <input type='hidden' name="ls_product_combination_hash" value='{$product.combination_hash}'>
                <button {if $but_id}id="{$but_id}"{/if} class="{$but_meta} ty-btn" type="submit" name="{$but_name}" {if $but_onclick}onclick="{$but_onclick}"{/if}><img id='ls_add_to_cart_button' src="{$config.current_path}/design/themes/responsive/media/images/images/cart_white.png">&nbsp;{$but_text}</button>
            </div>
        {elseif $ls_search_button}
             <button {if $but_id}id="{$but_id}"{/if} class="{$but_meta} ty-btn__primary ty-btn" type="submit" name="{$but_name}" {if $but_onclick}onclick="{$but_onclick}"{/if}>{$but_text}</button>
        {else}
            <button {if $but_id}id="{$but_id}"{/if} class="{$but_meta} ty-btn" type="submit" name="{$but_name}" {if $but_onclick}onclick="{$but_onclick}"{/if}>{$but_text}</button>
        {/if}
    {elseif $but_role == "text" || $but_role == "act" || $but_role == "edit"} {* TEXT STYLE *}
        <a {$but_extra} class="ty-btn {if $but_meta}{$but_meta} {/if}{if $but_name}cm-submit {/if}text-button{$suffix}"{if $but_id} id="{$but_id}"{/if}{if $but_name} data-ca-dispatch="{$but_name}"{/if}{if $but_href} href="{$but_href|fn_url}"{/if}{if $but_onclick} onclick="{$but_onclick} return false;"{/if}{if $but_target} target="{$but_target}"{/if}{if $but_rel} rel="{$but_rel}"{/if}{if $but_external_click_id} data-ca-external-click-id="{$but_external_click_id}"{/if}{if $but_target_form} data-ca-target-form="{$but_target_form}"{/if}{if $but_target_id} data-ca-target-id="{$but_target_id}"{/if}>{if $but_icon}<i class="{$but_icon}"></i>{/if}{$but_text}</a>

    {elseif $but_role == "delete"}

        <a {$but_extra} {if $but_id}id="{$but_id}"{/if}{if $but_name} data-ca-dispatch="{$but_name}"{/if} {if $but_href}href="{$but_href|fn_url}"{/if}{if $but_onclick} onclick="{$but_onclick} return false;"{/if}{if $but_meta} class="{$but_meta} ls_delete_icon"{/if}{if $but_target} target="{$but_target}"{/if}{if $but_rel} rel="{$but_rel}"{/if}{if $but_external_click_id} data-ca-external-click-id="{$but_external_click_id}"{/if}{if $but_target_form} data-ca-target-form="{$but_target_form}"{/if}{if $but_target_id} data-ca-target-id="{$but_target_id}"{/if}><i title="{__("delete")}" class="ty-icon-cancel-circle"></i></a>

    {elseif $but_role == "icon"} {* LINK WITH ICON *}
        <a {$but_extra} {if $but_id}id="{$but_id}"{/if}{if $but_href} href="{$but_href|fn_url}"{/if} {if $but_onclick}onclick="{$but_onclick};{if !$allow_href} return false;{/if}"{/if} {if $but_target}target="{$but_target}"{/if} {if $but_rel} rel="{$but_rel}"{/if}{if $but_external_click_id} data-ca-external-click-id="{$but_external_click_id}"{/if}{if $but_target_form} data-ca-target-form="{$but_target_form}"{/if}{if $but_target_id} data-ca-target-id="{$but_target_id}"{/if} class="ty-btn {if $but_meta}{$but_meta}{/if}">{$but_text}</a>

    {else} {* BUTTON STYLE *}

        <a {if $but_href}href="{$but_href|fn_url}"{/if}{if $but_onclick} onclick="{$but_onclick} return false;"{/if} {if $but_target}target="{$but_target}"{/if} class="ty-btn {if $but_meta}{$but_meta} {/if}" {if $but_rel} rel="{$but_rel}"{/if}{if $but_external_click_id} data-ca-external-click-id="{$but_external_click_id}"{/if}{if $but_target_form} data-ca-target-form="{$but_target_form}"{/if}{if $but_target_id} data-ca-target-id="{$but_target_id}"{/if}>{if $but_icon}<i class="{$but_icon}"></i>{/if}{$but_text}</a>
        {/if}
