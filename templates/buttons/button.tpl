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
                            {*if $ls_shipping_estimation_show2*}
                <div class="ls_shipping_estimation" id="ls_shipping_estimation">
                    <span style="display: none">optiunea este legata de alt produs: {$ls_option_linked}</span>
                    <span style="display: none">linked product avail since: {$testavailability0}</span>
                    <span style="display: none">settings.General.allow_negative_amount: {$settings.General.allow_negative_amount}</span>
                    <span style="display: none">ls_shipping_estimation_show: {$ls_shipping_estimation_show}</span>
                    <!--div> {*$ls_in_stock*}{*$product|var_dump*} Disponibil incepand cu: {$ls_avail_since}{*$product.avail_since*}</div>
                    <div>Timp procesare: {$product.ls_order_processing} ; Timp backorder: {$product.comm_period}</div>
                     <div>Actiune in lipsa stocului: {$product.out_of_stock_actions}</div-->
                    <img src="/design/themes/responsive/media/images/images/transport.png">
                    <span class="ls_shipping_estimation_text">{__("ls_shipping_estimation")}
                        <span>{*$ls_shipping_estimation*}
                            {$ls_shipping_estimation_day} {__("month_name_abr_$ls_shipping_estimation_month")} {$ls_shipping_estimation_year} 
                        </span>
                    </span> 
                    <img src="/design/themes/responsive/media/images/images/info.png"> 
                </div>
                {*/if*}
            <button {if $but_id}id="{$but_id}"{/if} class="{$but_meta} ty-btn" type="submit" name="{$but_name}" {if $but_onclick}onclick="{$but_onclick}"{/if}><img id='ls_add_to_cart_button' src="{$config.current_path}/design/themes/responsive/media/images/images/cart_white.png">&nbsp;{$but_text}</button>
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
