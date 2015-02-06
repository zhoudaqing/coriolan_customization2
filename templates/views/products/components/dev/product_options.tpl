{if ($settings.General.display_options_modifiers == "Y" && ($auth.user_id  || ($settings.General.allow_anonymous_shopping != "hide_price_and_add_to_cart" && !$auth.user_id)))}
{assign var="show_modifiers" value=true}
{/if}

<input type="hidden" name="appearance[details_page]" value="{$details_page}" />
{foreach from=$product.detailed_params key="param" item="value"}
    <input type="hidden" name="additional_info[{$param}]" value="{$value}" />
{/foreach}

{if $product_options}

{if $obj_prefix}
    <input type="hidden" name="appearance[obj_prefix]" value="{$obj_prefix}" />
{/if}

{if $location == "cart" || $product.object_id}
    <input type="hidden" name="{$name}[{$id}][object_id]" value="{$id|default:$obj_id}" />
{/if}

{if $extra_id}
    <input type="hidden" name="extra_id" value="{$extra_id}" />
{/if}

{* Simultaneous options *}
{if $product.options_type == "S" && $location == "cart"}
    {$disabled = true}
{/if}

{* ********* javascript nameplates********* *}
        {if in_array(116, $product.category_ids)}        
        {literal}
            <style>
            @font-face {
                 font-family: 'BrushScriptStdMedium';
                 src: url('img/brushscriptstd.eot');
                 src: url('img/brushscriptstd.eot') format('embedded-opentype'),
                      url('img/brushscriptstd.woff') format('woff'),
                      url('img/brushscriptstd.ttf') format('truetype'),
                      url('img/brushscriptstd.svg#BrushScriptStdMedium') format('svg');
            }
            
            textarea.ty-product-options__textarea {
                resize:none;
                font-family:'BrushScriptStdMedium' !important;
                font-size: 20px;
            }
            
            .form-field label.cm-required{
               padding-right:10px;
               {/literal}
                {if $product.product_id eq '2501'}
                    {literal}
                    background:none !important;
                    {/literal}
                {/if}
                {literal}
            }
            </style>
           <script type="text/javascript">
              
            var txt_param=new Array();
                txt_param[0]=new Array();
                txt_param[0][0]=0;
                txt_param[0][1]=2;
                txt_param[1]=new Array();
                txt_param[1][0]=3;
                txt_param[1][1]=5;
                txt_param[2]=new Array();
                txt_param[2][0]=6;
                txt_param[2][1]=12;
                
            var txt_options=new Array();
            var txt_options_key=new Array();
            var txt_selected='';
                
            $(document).ready(function(){
                var txt_holder=$('textarea.ty-product-options__textarea').parent().prev('div').get(0);
                var new_index = 0;
                
                if($('textarea.ty-product-options__textarea').val().length>0){
                    $('textarea.ty-product-options__textarea').blur().focus();
                    var el = $("textarea.ty-product-options__textarea").get(0);

                    var elemLen = el.value.length;
                
                    el.selectionStart = elemLen;
                    el.selectionEnd = elemLen;
                
                    el.focus();
                }
                
                $(txt_holder).find('ul>li').each(function(index){
                    if(!$(this).hasClass("hidden")){
                        txt_options["'"+$(this).find('input').attr('value')+"'"] = new_index;
                        txt_options_key[new_index]=$(this).find('input').attr('value');
                        if($(this).find('input').get(0).checked){
                            txt_selected="'"+$(this).find('input').attr('value')+"'";
                        }
                    }else{new_index = new_index-1;}
                    new_index++;
                });
                
                var holder_id=$(txt_holder).find('ul').attr('id');
                
                $('textarea.ty-product-options__textarea').bind('paste', function(e){ 
                    var element = this;
                    setTimeout(function () {
                        var txt_val = $(element).val();
                        var txt_length=txt_val.length;
                       if(txt_length>=0 && txt_length<=2 && txt_options_key[0]!==undefined && !$('input[value="'+txt_options_key[0]+'"]').is(":checked")){
                           $('input[value="'+txt_options_key[0]+'"]').click();
                           txt_selected="'"+txt_options_key[0]+"'";
                       }else if(txt_length>=3 && txt_length<=5 && txt_options_key[1]!==undefined && !$('input[value="'+txt_options_key[1]+'"]').is(":checked")){
                           $('input[value="'+txt_options_key[1]+'"]').click();
                           txt_selected="'"+txt_options_key[1]+"'";
                       }else if(txt_length>=6 && txt_length<=12 && txt_options_key[2]!==undefined && !$('input[value="'+txt_options_key[2]+'"]').is(":checked")){
                           $('input[value="'+txt_options_key[2]+'"]').click();
                           txt_selected="'"+txt_options_key[2]+"'";
                       }else {
                           if(txt_length>12){
                                $(element).html(txt_val.substr(0,12));
                                $('input[value="'+txt_options_key[2]+'"]').click();
                                txt_selected="'"+txt_options_key[2]+"'";
                           }
                       }
                    }, 100);
                });
                
                $('textarea.ty-product-options__textarea').keyup(function(){
                   var txt_val=$(this).val();
                   var txt_length=txt_val.length;
                   
                   if(txt_length>=0 && txt_length<=2 && txt_options_key[0]!==undefined && !$('input[value="'+txt_options_key[0]+'"]').is(":checked")){
                       $('input[value="'+txt_options_key[0]+'"]').click();
                       txt_selected="'"+txt_options_key[0]+"'";
                   }else if(txt_length>=3 && txt_length<=5 && txt_options_key[1]!==undefined && !$('input[value="'+txt_options_key[1]+'"]').is(":checked")){
                       $('input[value="'+txt_options_key[1]+'"]').click();
                       txt_selected="'"+txt_options_key[1]+"'";
                   }else if(txt_length>=6 && txt_length<=12 && txt_options_key[2]!==undefined && !$('input[value="'+txt_options_key[2]+'"]').is(":checked")){
                       $('input[value="'+txt_options_key[2]+'"]').click();
                       txt_selected="'"+txt_options_key[2]+"'";
                   }else{
                      $(this).val(txt_val.substr(0,12));
                   }
                });
                // to do in stock alert
                $('.in-stock').html('5 zile');
                
                $('.radio').click(function(){
                   $('.in-stock').html('5 zile');
                });
            });
            
            function change_text(elem, var1, var2, var3, var4, varUpdate){
                var txt_selected="'"+$(elem).attr('value')+"'";
                var atxt_val=$('textarea.ty-product-options__textarea').val();
                var atxt_length=atxt_val.length;
                if(txt_param[txt_options[txt_selected]]){
                    if(atxt_length>txt_param[txt_options[txt_selected]][1]){
                        $('textarea.ty-product-options__textarea').val(atxt_val.substr(0,txt_param[txt_options[txt_selected]][1]));
                    }
                    if($('textarea.ty-product-options__textarea').val().length<=txt_param[txt_options[txt_selected]][1]){
                        if(varUpdate==1){
                            fn_change_options(var1, var2, var3);
                        }else if(varUpdate==0){
                            fn_change_variant_image(var1, var3, var4);
                        }
                    }
                }else{
                    if(varUpdate==1){
                        fn_change_options(var1, var2, var3);
                    }else if(varUpdate==0){
                        fn_change_variant_image(var1, var3, var4);
                    }
                }
            }
            
            </script>
        {/literal}
        {/if}
        
        {if $option_variants_to_product_array_strings|@count gt 0}
        {literal}
            <script type="text/javascript">
                function updateProductLinkedInfo(var1, var2, var3, var4, varUpdate){
                    if(varUpdate==1){
                        fn_change_options(var1, var2, var3);
                    }else if(varUpdate==0){
                        fn_change_variant_image(var1, var3, var4);
                    }
                    //$('.product_required_linked_details').html('');
                    //var optionsWithVariantsLinkedToProducts = $('#options_with_variants_linked_to_products').val();
                    //loadOptionVariantProductInfo(optionsWithVariantsLinkedToProducts);
                }
                $(document).ready(function(){
                    $('.product_required_linked_details').html('');
                    var optionsWithVariantsLinkedToProducts = $('#options_with_variants_linked_to_products').val();
                    loadOptionVariantProductInfo(optionsWithVariantsLinkedToProducts);
                });
            </script>
        {/literal}
        {/if}
        
        {literal}
            <style>
                {/literal}
                {foreach name="product_options" from=$product_options item="po"}
                    {if $po.option_type == "Y"} 
                        {foreach from=$po.variants item="vr"}
                            {if $vr.image_pair.icon.http_image_path}
                                {literal}
                                    input#option_variant_description_{/literal}{$obj_prefix}{$id}{literal}_{/literal}{$po.option_id}{literal}_{/literal}{$vr.variant_id}{literal}:not(old){
                                        height: 32px;
                                        margin: 0;
                                        opacity: 0;
                                        padding: 0;
                                        width: 32px;
                                    }
                                    input#option_variant_description_{/literal}{$obj_prefix}{$id}{literal}_{/literal}{$po.option_id}{literal}_{/literal}{$vr.variant_id}{literal}:not(old) + label#option_variant_description_label_{/literal}{$obj_prefix}{$id}{literal}_{/literal}{$po.option_id}{literal}_{/literal}{$vr.variant_id}{literal}{
                                        display      : inline-block;
                                        background   : url('{/literal}{$vr.image_pair.icon.http_image_path}{literal}') no-repeat center center;
                                        cursor:pointer;
                                        height: 32px;
                                        margin: 0;
                                        padding: 0;
                                        position: absolute;
                                        top: 0;
                                        width: 32px;
                                      /*line-height  : 24px;*/
                                    }
                                {/literal}
                            {/if}
                        {/foreach}
                    {/if}
                {/foreach}
                {literal}
            </style>
        {/literal}
<div class="cm-picker-product-options ty-product-options" id="opt_{$obj_prefix}{$id}">
    {foreach name="product_options" from=$product_options item="po"}
    {assign var="selected_variant" value=""}
    <div class="ty-control-group ty-product-options__item{if !$capture_options_vs_qty} product-list-field{/if} clearfix" id="opt_{$obj_prefix}{$id}_{$po.option_id}">
        {if !("SRC"|strpos:$po.option_type !== false && !$po.variants && $po.missing_variants_handling == "H")}
            <div class="div_option_label_title">
                <label {if $po.option_type !== "R" && $po.option_type !== "F"}for="option_{$obj_prefix}{$id}_{$po.option_id}"{/if} class="ty-control-group__label ty-product-options__item-label{if $po.required == "Y"} cm-required{/if}{if $po.regexp} cm-regexp{/if}">{$po.option_name}{if $po.description|trim}{include file="common/tooltip.tpl" tooltip=$po.description}{/if}:</label>
                {if $name=="cart_products"}
                <label class="ty-control-group__label ty-product-options__item-label label_option_variant_selected">
                    {$po.variants[$po.value].variant_name}
                </label>
                {/if}
            {if $po.option_type != "Y"}   
            </div>
            {/if}
        {if $po.option_type == "S"} {*Selectbox*}
            {if $po.variants}
                {if ($po.disabled || $disabled) && !$po.not_required}<input type="hidden" value="{$po.value}" name="{$name}[{$id}][product_options][{$po.option_id}]" id="option_{$obj_prefix}{$id}_{$po.option_id}" />{/if}
                    {if $name!="cart_products"}
                    <select 
                        name="{$name}[{$id}][product_options][{$po.option_id}]" 
                        {if !$po.disabled && !$disabled}id="option_{$obj_prefix}{$id}_{$po.option_id}"{/if} 
                        onchange="
                            {if $option_variants_to_product_array_strings|@count gt 0}
                                updateProductLinkedInfo('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}', '{$vr.variant_id}',{if $product.options_update}1{else}0{/if});
                            {else}
                                {if $product.options_update}
                                    fn_change_options('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}');
                                {else}
                                    fn_change_variant_image('{$obj_prefix}{$id}', '{$po.option_id}', '{$vr.variant_id}');
                                {/if}
                            {/if}" 
                            {if $product.exclude_from_calculate && !$product.aoc || $po.disabled || $disabled}disabled="disabled" class="disabled"{/if}>
                        {if $product.options_type == "S"}
                            {if !$runtime.checkout || $po.disabled || $disabled || ($runtime.checkout && !$po.value)}
                                <option value="">{if $po.disabled || $disabled}{__("select_option_above")}{else}{__("please_select_one")}{/if}</option>
                            {/if}
                        {/if}
                        {foreach from=$po.variants item="vr" name=vars}
                            {if (empty($product_array_otions_variants)) || ($product_array_otions_variants|@count gt 0 && (empty($product_array_otions_variants[$po.option_id]) || ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))))}
                                {if !($po.disabled || $disabled) || (($po.disabled || $disabled) && $po.value && $po.value == $vr.variant_id)}
                                    <option value="{$vr.variant_id}" {if (!empty($wishlistOptionsVariantsSelected) && $wishlistOptionsVariantsSelected[$po.option_id]==$vr.variant_id) || $po.value == $vr.variant_id}{assign var="selected_variant" value=$vr.variant_id}selected="selected"{/if}>
                                        {$vr.variant_name} {if $show_modifiers}{hook name="products:options_modifiers"}{if $vr.modifier|floatval}({include file="common/modifier.tpl" mod_type=$vr.modifier_type mod_value=$vr.modifier display_sign=true}){/if}{/hook}{/if}
                                    </option>
                                {/if}
                            {/if}
                        {/foreach}
                    </select>
                    {/if}
            {else}
                <input type="hidden" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$po.value}" id="option_{$obj_prefix}{$id}_{$po.option_id}" />
                <span>{__("na")}</span>
            {/if}
        {elseif $po.option_type == "R"} {*Radiobutton*}
            {if $po.variants}
                <ul id="option_{$obj_prefix}{$id}_{$po.option_id}_group" class="ty-product-options__elem">
                    {if !$po.disabled && !$disabled}
                        <li class="hidden"><input type="hidden" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$po.value}" id="option_{$obj_prefix}{$id}_{$po.option_id}" /></li>
                        {if $name!="cart_products"}
                        {foreach from=$po.variants item="vr" name="vars"}
                            {if (empty($product_array_otions_variants)) || ($product_array_otions_variants|@count gt 0 && (empty($product_array_otions_variants[$po.option_id]) || ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))))}
                                <li>
                                    <label id="option_description_{$obj_prefix}{$id}_{$po.option_id}_{$vr.variant_id}" class="ty-product-options__box option-items">
                                        <input type="radio" 
                                               class="radio" 
                                               name="{$name}[{$id}][product_options][{$po.option_id}]" 
                                               value="{$vr.variant_id}" 
                                               {if (!empty($wishlistOptionsVariantsSelected) && $wishlistOptionsVariantsSelected[$po.option_id]==$vr.variant_id) || $po.value == $vr.variant_id }{assign var="selected_variant" value=$vr.variant_id}checked="checked"{/if} 
                                               onclick="
                                                        {if in_array(116, $product.category_ids)}
                                                            change_text(this,'{$obj_prefix}{$id}', '{$id}', '{$po.option_id}', '{$vr.variant_id}',{if $product.options_update}1{else}0{/if});
                                                        {else}
                                                            {if $option_variants_to_product_array_strings|@count gt 0}
                                                                updateProductLinkedInfo('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}', '{$vr.variant_id}',{if $product.options_update}1{else}0{/if});
                                                            {else}
                                                                {if $product.options_update}
                                                                    fn_change_options('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}');
                                                                {else}
                                                                    fn_change_variant_image('{$obj_prefix}{$id}', '{$po.option_id}', '{$vr.variant_id}');
                                                                {/if}
                                                            {/if}
                                                            
                                                           
                                                        {/if}
                                                        " 
                                                    {if $product.exclude_from_calculate && !$product.aoc || $po.disabled || $disabled}disabled="disabled"{/if} 
                                        />
                                {$vr.variant_name}&nbsp;{if  $show_modifiers}{hook name="products:options_modifiers"}{if $vr.modifier|floatval}({include file="common/modifier.tpl" mod_type=$vr.modifier_type mod_value=$vr.modifier display_sign=true}){/if}{/hook}{/if}
                                    </label>
                                </li>
                            {/if}
                        {/foreach}
                        {/if}
                    {elseif $po.value}
                        {$po.variants[$po.value].variant_name}
                    {/if}
                </ul>
                {if !$po.value && $product.options_type == "S" && !($po.disabled || $disabled)}<p class="ty-product-options__description ty-clear-both">{__("please_select_one")}</p>{elseif !$po.value && $product.options_type == "S" && ($po.disabled || $disabled)}<p class="ty-product-options__description ty-clear-both">{__("select_option_above")}</p>{/if}
            {else}
                <input type="hidden" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$po.value}" id="option_{$obj_prefix}{$id}_{$po.option_id}" />
                <span>{__("na")}</span>
            {/if}
        
        {elseif $po.option_type == "Y"} {*RadiobuttonIcon*}
            {if $po.variants}
                {if $name!="cart_products"}
                <label class="ty-control-group__label ty-product-options__item-label label_option_variant_selected">
                    {*{$product_array_otions_variants[$po.option_id]|var_dump}=====>{$po.value|var_dump}---->{$vr.variant_id|var_dump}*}
                    {assign var="selected_variant_index" value=1}
                    {foreach from=$po.variants item="vr"}
                        {if (empty($product_array_otions_variants)) || ($product_array_otions_variants|@count gt 0 && (empty($product_array_otions_variants[$po.option_id]) || ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))))}
                            {if 
                                (!empty($wishlistOptionsVariantsSelected) && 
                                        $wishlistOptionsVariantsSelected[$po.option_id]==$vr.variant_id
                                ) || 
                                (empty($wishlistOptionsVariantsSelected) &&     
                                    (empty($product_array_otions_variants) || 
                                        ($product_array_otions_variants|@count gt 0 &&
                                            (empty($product_array_otions_variants[$po.option_id]) ||
                                                ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($po.value, $product_array_otions_variants[$po.option_id]))
                                            )
                                        )
                                    ) && 
                                    $po.value == $vr.variant_id
                                ) || 
                                (
                                    empty($wishlistOptionsVariantsSelected) && 
                                    (!$po.value ||
                                        ((empty($product_array_otions_variants) && $po.option_id==$po.value) || 
                                            ($product_array_otions_variants|@count gt 0 &&
                                                ((empty($product_array_otions_variants[$po.option_id]) && $po.option_id==$po.value) ||
                                                    ($product_array_otions_variants[$po.option_id]|@count gt 0 && 
                                                        in_array($vr.variant_id, $product_array_otions_variants[$po.option_id])
                                                    )
                                                    
                                                )
                                            )
                                        )
                                    ) && 
                                    $selected_variant_index==1
                                )
                            }
                                {$vr.variant_name}
                            {/if}
                            {assign var="selected_variant_index" value=$selected_variant_index+1}
                        {/if}
                    {/foreach}
                </label>
                {/if}
                </div>
                {if $name!="cart_products"}
                <ul id="option_{$obj_prefix}{$id}_{$po.option_id}_group" class="ty-product-options__elem ul_radio_button_icon">
                    {if !$po.disabled && !$disabled}
                        <li class="hidden">
                            {assign var="option_variant_selected" value=$po.value}
                            {if !$option_variant_selected}
                                {assign var="option_variant_ids" value=$po.variants|array_keys}
                                {assign var="option_variant_selected" value=$option_variant_ids[0]}
                            {/if}
                            <input type="hidden" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$option_variant_selected}" id="option_{$obj_prefix}{$id}_{$po.option_id}" /></li>
                            {assign var="selected_variant_index1" value=1}
                            {foreach from=$po.variants item="vr" name="vars"}
                                {if (empty($product_array_otions_variants)) || ($product_array_otions_variants|@count gt 0 && (empty($product_array_otions_variants[$po.option_id]) || ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))))}
                                <li class="li_radio_button_icon">
                                                <input type="radio" 
                                                   class="radio image_radio 
                                                            {if 
                                                                (!empty($wishlistOptionsVariantsSelected) && 
                                                                        $wishlistOptionsVariantsSelected[$po.option_id]==$vr.variant_id
                                                                ) || 
                                                                (empty($wishlistOptionsVariantsSelected) &&     
                                                                    (empty($product_array_otions_variants) || 
                                                                        ($product_array_otions_variants|@count gt 0 &&
                                                                            (empty($product_array_otions_variants[$po.option_id]) ||
                                                                                ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($po.value, $product_array_otions_variants[$po.option_id]))
                                                                            )
                                                                        )
                                                                    ) && 
                                                                    $po.value == $vr.variant_id
                                                                ) || 
                                                                (
                                                                    empty($wishlistOptionsVariantsSelected) && 
                                                                    (!$po.value ||
                                                                        ((empty($product_array_otions_variants) && $po.option_id==$po.value) || 
                                                                            ($product_array_otions_variants|@count gt 0 &&
                                                                                ((empty($product_array_otions_variants[$po.option_id]) && $po.option_id==$po.value) ||
                                                                                    ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))
                                                                                )
                                                                            )
                                                                        )
                                                                    ) && 
                                                                    $selected_variant_index1==1
                                                                )
                                                            }
                                                                image_radio_checked
                                                            {/if}
                                                         " 
                                                   name="{$name}[{$id}][product_options][{$po.option_id}]"
                                                   id="option_variant_description_{$obj_prefix}{$id}_{$po.option_id}_{$vr.variant_id}"
                                                   value="{$vr.variant_id}" 
                                                   {if 
                                                        (!empty($wishlistOptionsVariantsSelected) && 
                                                                $wishlistOptionsVariantsSelected[$po.option_id]==$vr.variant_id
                                                        ) || 
                                                        (empty($wishlistOptionsVariantsSelected) &&     
                                                            (empty($product_array_otions_variants) || 
                                                                ($product_array_otions_variants|@count gt 0 &&
                                                                    (empty($product_array_otions_variants[$po.option_id]) ||
                                                                        ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($po.value, $product_array_otions_variants[$po.option_id]))
                                                                    )
                                                                )
                                                            ) && 
                                                            $po.value == $vr.variant_id
                                                        ) || 
                                                        (
                                                            empty($wishlistOptionsVariantsSelected) && 
                                                            (!$po.value ||
                                                                ((empty($product_array_otions_variants) && $po.option_id==$po.value) || 
                                                                    ($product_array_otions_variants|@count gt 0 &&
                                                                        ((empty($product_array_otions_variants[$po.option_id]) && $po.option_id==$po.value) ||
                                                                            ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))
                                                                        )
                                                                    )
                                                                )
                                                            ) && 
                                                            $selected_variant_index1==1
                                                        )
                                                    }
                                                       {assign var="selected_variant" value=$vr.variant_id}
                                                       checked="checked"
                                                   {/if} 
                                                   onclick="
                                                            {if in_array(116, $product.category_ids)}
                                                                change_text(this,'{$obj_prefix}{$id}', '{$id}', '{$po.option_id}', '{$vr.variant_id}',{if $product.options_update}1{else}0{/if});
                                                            {else}
                                                                {if $option_variants_to_product_array_strings|@count gt 0}
                                                                    updateProductLinkedInfo('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}', '{$vr.variant_id}',{if $product.options_update}1{else}0{/if});
                                                                {else}
                                                                    {if $product.options_update}
                                                                        fn_change_options('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}');
                                                                    {else}
                                                                        fn_change_variant_image('{$obj_prefix}{$id}', '{$po.option_id}', '{$vr.variant_id}');
                                                                    {/if}
                                                                {/if}


                                                            {/if}
                                                            " 
                                                        {if $product.exclude_from_calculate && !$product.aoc || $po.disabled || $disabled}disabled="disabled"{/if} 
                                                />
                                                <label title="{$vr.variant_name}" id="option_variant_description_label_{$obj_prefix}{$id}_{$po.option_id}_{$vr.variant_id}" for="option_variant_description_{$obj_prefix}{$id}_{$po.option_id}_{$vr.variant_id}" class="ty-product-options__box option-items">{if $vr.image_pair.icon.http_image_path}&nbsp;{else}{$vr.variant_name}{/if}</label>
                                    </li>
                                    {assign var="selected_variant_index1" value=$selected_variant_index1+1}
                                {/if}
                            {/foreach}
                    {elseif $po.value}
                        {$po.variants[$po.value].variant_name}
                    {/if}
                </ul>
                {/if}
                {if !$po.value && $product.options_type == "S" && !($po.disabled || $disabled)}
                    <p class="ty-product-options__description ty-clear-both">{__("please_select_one")}</p>
                {elseif !$po.value && $product.options_type == "S" && ($po.disabled || $disabled)}
                    <p class="ty-product-options__description ty-clear-both">{__("select_option_above")}</p>
                {/if}
            {else}
                <input type="hidden" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$po.value}" id="option_{$obj_prefix}{$id}_{$po.option_id}" />
                <span>{__("na")}</span>
            {/if}    
            
        {elseif $po.option_type == "C" && $name!="cart_products"} {*Checkbox*}
            {foreach from=$po.variants item="vr"}
                {if (empty($product_array_otions_variants)) || ($product_array_otions_variants|@count gt 0 && (empty($product_array_otions_variants[$po.option_id]) || ($product_array_otions_variants[$po.option_id]|@count gt 0 && in_array($vr.variant_id, $product_array_otions_variants[$po.option_id]))))}
                    {if $vr.position == 0}
                        <input id="unchecked_option_{$obj_prefix}{$id}_{$po.option_id}" type="hidden" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$vr.variant_id}" {if $po.disabled || $disabled}disabled="disabled"{/if} />
                    {else}
                        <label class="ty-product-options__box option-items">
                            <span class="cm-field-container">
                                <input 
                                    id="option_{$obj_prefix}{$id}_{$po.option_id}" 
                                    type="checkbox" 
                                    name="{$name}[{$id}][product_options][{$po.option_id}]" 
                                    value="{$vr.variant_id}" class="checkbox" 
                                    {if (!empty($wishlistOptionsVariantsSelected) && $wishlistOptionsVariantsSelected[$po.option_id]==$vr.variant_id) || $po.value == $vr.variant_id}checked="checked"{/if} 
                                    {if $product.exclude_from_calculate && !$product.aoc || $po.disabled || $disabled}disabled="disabled"{/if} 
                                    {if $product.options_update}onclick="fn_change_options('{$obj_prefix}{$id}', '{$id}', '{$po.option_id}');"{/if}/>
                                {if $show_modifiers}{hook name="products:options_modifiers"}{if $vr.modifier|floatval}({include file="common/modifier.tpl" mod_type=$vr.modifier_type mod_value=$vr.modifier display_sign=true}){/if}{/hook}{/if}
                            </span>
                        </label>
                    {/if}
                {/if}
            {foreachelse}
                <label class="ty-product-options__box option-items"><input type="checkbox" class="checkbox" disabled="disabled" />
                {if $show_modifiers}{hook name="products:options_modifiers"}{if $vr.modifier|floatval}({include file="common/modifier.tpl" mod_type=$vr.modifier_type mod_value=$vr.modifier display_sign=true}){/if}{/hook}{/if}</label>
            {/foreach}
        {elseif $po.option_type == "I" && $name!="cart_products"} {*Input*}
            <input id="option_{$obj_prefix}{$id}_{$po.option_id}" type="text" name="{$name}[{$id}][product_options][{$po.option_id}]" value="{$po.value|default:$po.inner_hint}" {if $product.exclude_from_calculate && !$product.aoc}disabled="disabled"{/if} class="ty-valign ty-input-text{if $po.inner_hint} cm-hint{/if}{if $product.exclude_from_calculate && !$product.aoc} disabled{/if}" {if $po.inner_hint}title="{$po.inner_hint}"{/if} />
        {elseif $po.option_type == "T" && $name!="cart_products"} {*Textarea*}
            <textarea id="option_{$obj_prefix}{$id}_{$po.option_id}" class="ty-product-options__textarea{if $po.inner_hint} cm-hint{/if}{if $product.exclude_from_calculate && !$product.aoc} disabled{/if}" rows="3" name="{$name}[{$id}][product_options][{$po.option_id}]" {if $product.exclude_from_calculate && !$product.aoc}disabled="disabled"{/if} {if $po.inner_hint}title="{$po.inner_hint}"{/if} >{$po.value|default:$po.inner_hint}</textarea>
        {elseif $po.option_type == "F" && $name!="cart_products"} {*File*}
            <div class="ty-product-options__elem ty-product-options__fileuploader">
                {include file="common/fileuploader.tpl" images=$product.extra.custom_files[$po.option_id] var_name="`$name`[`$po.option_id``$id`]" multiupload=$po.multiupload hidden_name="`$name`[custom_files][`$po.option_id``$id`]" hidden_value="`$id`_`$po.option_id`" label_id="option_`$obj_prefix``$id`_`$po.option_id`" prefix=$obj_prefix}
            </div>
        {/if}
        {/if}

        {if $po.comment && $name!="cart_products"}
            <div class="ty-product-options__description">{$po.comment}</div>
        {/if}

        {if $po.regexp && !$no_script}
            <script type="text/javascript">
            (function(_, $) {
                $(document).ready(function() {
                    $.ceFormValidator('setRegexp', {
                        'option_{$id}_{$po.option_id}': {
                            regexp: "{$po.regexp|escape:javascript nofilter}", 
                            message: "{$po.incorrect_message|escape:javascript}"
                        }
                    });
                });
            }(Tygh, Tygh.$));
            </script>
        {/if}

        {capture name="variant_images"}
            {if !$po.disabled && !$disabled}
                {foreach from=$po.variants item="var"}
                    {if $var.image_pair.image_id}
                        {if $var.variant_id == $selected_variant}{assign var="_class" value="is-selected"}{else}{assign var="_class" value="ty-product-variant-image-unselected"}{/if}
                        {include file="common/image.tpl" class="ty-hand $_class ty-product-options__image" images=$var.image_pair image_width="50" image_height="50" obj_id="variant_image_`$obj_prefix``$id`_`$po.option_id`_`$var.variant_id`" image_onclick="fn_set_option_value('`$obj_prefix``$id`', '`$po.option_id`', '`$var.variant_id`'); void(0);"}
                    {/if}
                {/foreach}
            {/if}
        {/capture}
        
        {if $opts_variants_links_to_products_array && $opts_variants_links_to_products_array[{$po.option_id}]}
            {assign var="optVariantLinkProductId" value=$product.product_id}
            {assign var="optVariantLinkOptionId" value=$po.option_id}
            {assign var="optVariantLinkVariantsIds" value=$option_variants_to_product_array_strings[$po.option_id]}
            
            {assign var="optVariantLinkProductCount" value=$product_array_otions_variants[$po.option_id]|@count}
            {assign var="optSelectedOptionVariantId" value=$product.selected_options[$po.option_id]}
            {assign var="linkUrl" value="products.show_option_variant_link_products&product_id=$optVariantLinkProductId&option_id=$optVariantLinkOptionId&$optVariantLinkVariantsIds&selected=$optSelectedOptionVariantId"}
            <span>
                <a class="btn cm-tooltip hand cm-dialog-opener cm-ajax" data-ca-dialog-title="{__("link_to_product")}" name="links_product" data-ca-target-id="option_links_to_products_{$po.option_id}" data-ca-aditional-event="add_carousel" data-ca-aditional-event-parameters="{json_encode(["target_id"=>"product_features_carusel", "nr_of_elements"=>$optVariantLinkProductCount, "element_to_shift_up"=>"product_features_name_iteration"])}" id="link_products_{{$po.option_id}}" title="products" href="{$linkUrl|fn_url}">products</a>&nbsp;
            </span>
        {/if}
        {if $po.option_type != "Y" && $smarty.capture.variant_images|trim}<div class="ty-product-variant-image ty-clear-both">{$smarty.capture.variant_images nofilter}</div>{/if}
    </div>
    {/foreach}
</div>
{if $product.show_exception_warning == "Y"}
    <p id="warning_{$obj_prefix}{$id}" class="cm-no-combinations{if $location != "cart"}-{$obj_prefix}{$id}{/if}">{__("nocombination")}</p>
{/if}
{/if}

{if !$no_script}
<script type="text/javascript">
(function(_, $) {
    $.ceEvent('on', 'ce.formpre_{$form_name|default:"product_form_`$obj_prefix``$id`"}', function(frm, elm) {
        if ($('.cm-no-combinations{if $location != "cart"}-{$obj_prefix}{$id}{/if}').length) {
            $.ceNotification('show', {
                type: 'W', 
                title: _.tr('warning'), 
                message: _.tr('cannot_buy'),
            });

            return false;
        }
            
        return true;
    });
}(Tygh, Tygh.$));
</script>
{/if}