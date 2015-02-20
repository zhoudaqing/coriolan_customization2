{hook name="blocks:topmenu_dropdown"}

{if $items}
    <ul class="ty-menu__items cm-responsive-menu">
        {hook name="blocks:topmenu_dropdown_top_menu"}
            <li class="ty-menu__item ty-menu__menu-btn visible-phone">
                <a class="ty-menu__item-link">
                    <i class="ty-icon-short-list"></i>
                    <span>{__("menu")}</span>
                </a>
            </li>

        {foreach from=$items item="item1" name="item1"}
            {assign var="item1_url" value=$item1|fn_form_dropdown_object_link:$block.type}
            {assign var="unique_elm_id" value=$item1_url|md5}
            {assign var="unique_elm_id" value="topmenu_`$block.block_id`_`$unique_elm_id`"}

            {if $subitems_count}

            {/if}
            <li class="ty-menu__item {if !$item1.$childs} ty-menu__item-nodrop{else} cm-menu-item-responsive{/if} {if $item1.active || $item1|fn_check_is_active_menu_item:$block.type} ty-menu__item-active{/if}">
                    {if $item1.$childs}
                        <a class="ty-menu__item-toggle visible-phone cm-responsive-menu-toggle">
                            <i class="ty-menu__icon-open ty-icon-down-open"></i>
                            <i class="ty-menu__icon-hide ty-icon-up-open"></i>
                        </a>
                    {/if}
                    <a {if $item1_url} href="{$item1_url}"{/if} class="ty-menu__item-link">
                        {$item1.$name}
                    </a>
                {if $item1.$childs}
                    
                    {if !$item1.$childs|fn_check_second_level_child_array:$childs}
                    {* Only two levels. Vertical output *}
                        <div class="ty-menu__submenu">
                            <ul class="ty-menu__submenu-items ty-menu__submenu-items-simple cm-responsive-menu-submenu">
                            
                                {hook name="blocks:topmenu_dropdown_2levels_elements"}
                                {if $item1.category_id==25} {*id 25=inele*}
                                    <li>
                                        <div class="menu_container">
                                            <div class="menu_categories">
                                                <div class="menu_category one_column">
                                                    <span class="menu_title">NOUTĂŢI</span>
                                                    <ul class="category_container">
                                                        <li class="ty-menu__submenu-item"><a href="">INELE DE LOGODNĂ</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">CU PIETRE PREŢIOASE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">CU PERLE</a></li>
                                                    </ul>
                                                </div>
                                                <div class="menu_category double_column">
                                                    <span class="menu_title">COLECȚII INELE DE LOGODNĂ</span>
                                                    <ul class="category_container">
                                                        {foreach from=$item1.$childs item="item2" name="item2"}
                                                            {assign var="item_url2" value=$item2|fn_form_dropdown_object_link:$block.type}
                                                            <li class="ty-menu__submenu-item{if $item2.active || $item2|fn_check_is_active_menu_item:$block.type} ty-menu__submenu-item-active{/if}">
                                                                <a class="ty-menu__submenu-link" {if $item_url2} href="{$item_url2}"{/if}>{$item2.$name}</a>
                                                            </li>
                                                        {/foreach}
                                                        {if $item1.show_more && $item1_url}
                                                            <li class="ty-menu__submenu-item ty-menu__submenu-alt-link">
                                                                <a href="{$item1_url}"
                                                                   class="ty-menu__submenu-alt-link">{__("text_topmenu_view_more")}</a>
                                                            </li>
                                                        {/if}
                                                        <li class="extra_option_bottom">
                                                            <ul>
                                                                <li class="ty-menu__submenu-item"><a href="">EXCLUSIVE</a></li>
                                                                <li class="ty-menu__submenu-item"><a href="">BESTSELLERS</a></li>
                                                                <li class="ty-menu__submenu-item"><a href="">SELECŢII DESIGNER</a></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="menu_category last">
                                                    <span class="menu_title">PIETRE MONTATE</span>
                                                    <ul class="category_container">
                                                        <li class="ty-menu__submenu-item"><a href="">DIAMANTE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">DIAMANTE NEGRE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">SMARALDE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">SAFIRE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">RUBINE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">PERLE</a></li>
                                                        <li class="ty-menu__submenu-item"><a href="">ALTE PIETRE PREŢIOASE</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="menu_options">
                                                <ul>
                                                    <li class="ty-menu__submenu-item"><a href="">TRENDURI INELE LOGODNĂ</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">DESIGN & PROTOTIPIZARE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">CONSILIERE INELE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">EXPERIENŢĂ & CUNOAŞTERE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">GRAVARE INELE LOGODNĂ</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">GARANŢIE INELE</a></li>
                                                </ul>
                                            </div>
                                            <div class="menu_footer">
                                                <p class="message_menu"><a href="">Expediere gratuită până la 1 Noiembrie 2014</a></p>
                                                <a class="ls_close_window" href="#">{__("ls_close")}</a>
                                            </div>
                                        </div>
                                    </li>
                                {else}
                                {if $item1.category_id==1} {*id 1=verighete*}
                                <li>
                                        <div class="menu_container">
                                            <div class="menu_categories">
                                                <div class="menu_category double_column">
                                                    <span class="menu_title">COLECȚII VERIGHETE</span>
                                                    <ul class="category_container">
                                                        <li class="extra_option_bottom">
                                                            <ul>
                                                                <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link"  href="">EXCLUSIVE</a></li>
                                                                <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">BESTSELLERS</a></li>
                                                                <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">SELECŢII DESIGNER</a></li>
                                                            </ul>
                                                        </li>
                                                        {foreach from=$item1.$childs item="item2" name="item2"}                                                                                                   
                                                            {assign var="item_url2" value=$item2|fn_form_dropdown_object_link:$block.type}
                                                            {if $item2.$name!='2010' and $item2.$name!='2011' and $item2.$name!='2012' and $item2.$name!='toate produsele' }  
                                                                <li class="ty-menu__submenu-item{if $item2.active || $item2|fn_check_is_active_menu_item:$block.type} ty-menu__submenu-item-active{/if}">
                                                                    <a class="ty-menu__submenu-link" {if $item_url2} href="{$item_url2}"{/if}>{$item2.$name}</a>
                                                                </li>                               
                                                            {/if}
                                                        {/foreach}
                                                        {*if $item1.show_more && $item1_url*}
                                                            <li class="ty-menu__submenu-item ty-menu__submenu-alt-link">
                                                                <a href="{$item1_url}"
                                                                   class="ty-menu__submenu-alt-link">{__("text_topmenu_view_more")}</a>
                                                            </li>
                                                        {*/if*}
                                                    </ul>
                                                </div>
                                                <div class="menu_category one_column">
                                                    <span class="menu_title">CULORI</span>
                                                    <ul class="category_container">
                                                            <li class="ty-menu__submenu-item">
                                                                <a class="ty-menu__submenu-link"  href="#">MONOCOLORE</a>
                                                            </li>
                                                            <li class="ty-menu__submenu-item">
                                                                <a class="ty-menu__submenu-link"  href="#">BICOLORE</a>
                                                            </li>
                                                       
                                                            <li class="ty-menu__submenu-item">
                                                                <a class="ty-menu__submenu-link"  href="#">TRICOLORE</a>
                                                            </li>
                                                    </ul>
                                                </div>
                                                <div class="menu_category one_column">
                                                <span class="menu_title">LATIME</span>
                                                <ul class="category_container">
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">PANA LA 4 MM</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">INTRE 4 SI 5.5 MM</a>
                                                        </li>

                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">INTRE 5.5 SI 7 MM</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">PESTE 7 MM</a>
                                                        </li>
                                                </ul>
                                                </div>
                                                    <div class="menu_category one_column last">
                                                <span class="menu_title">NUMAR DIAMANTE</span>
                                                <ul class="category_container">
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">1</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">MAXIM 3</a>
                                                        </li>

                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">MAXIM 5</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">MAXIM 7</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">MAXIM 11</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">MAXIM 60%</a>
                                                        </li>
                                                        <li class="ty-menu__submenu-item">
                                                            <a class="ty-menu__submenu-link"  href="#">COMPLET</a>
                                                        </li>
                                                </ul>
                                                </div>
          
                                            </div>
                                            <div class="menu_options">
                                                <ul>
                                                    <li class="ty-menu__submenu-item"><a href="">TRENDURI INELE LOGODNĂ</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">DESIGN & PROTOTIPIZARE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">CONSILIERE INELE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">EXPERIENŢĂ & CUNOAŞTERE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">GRAVARE INELE LOGODNĂ</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">GARANŢIE INELE</a></li>
                                                </ul>
                                            </div>
                                            <div class="menu_footer">
                                                <p class="message_menu"><a href="">Expediere gratuită până la 1 Noiembrie 2014</a></p>
                                                <a class="ls_close_window" href="#">{__("ls_close")}</a>
                                            </div>
                                        </div>
                                    </li>
                                    {/if} {*end of verighete menu*}
                                    {if $item1.category_id==64} {*id 64=bijuterii*}
                                <li>
                                        <div class="menu_container">
                                            <div class="menu_categories">
                                                <div class="menu_category one_column">
                                                    <span class="menu_title">NOUTĂŢI</span>
                                                    <ul class="category_container">
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">EXCLUSIVE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">BESTSELLERS</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">SELECTII DESIGNER</a></li>
                                                    </ul>
                                                </div>
                                                <div class="menu_category double_column">
                                                    <span class="menu_title">TIPURI BIJUTERIE</span>
                                                    <ul class="category_container">
                                                        {foreach from=$item1.$childs item="item2" name="item2"}
                                                            {assign var="item_url2" value=$item2|fn_form_dropdown_object_link:$block.type}
                                                            <li class="ty-menu__submenu-item{if $item2.active || $item2|fn_check_is_active_menu_item:$block.type} ty-menu__submenu-item-active{/if}">
                                                                <a class="ty-menu__submenu-link" {if $item_url2} href="{$item_url2}"{/if}>{$item2.$name}</a>
                                                            </li>
                                                        {/foreach}
                                                        {if $item1.show_more && $item1_url}
                                                            <li class="ty-menu__submenu-item ty-menu__submenu-alt-link">
                                                                <a href="{$item1_url}"
                                                                   class="ty-menu__submenu-alt-link">{__("text_topmenu_view_more")}</a>
                                                            </li>
                                                        {/if}
                                                    </ul>
                                                </div>
                                                <div class="menu_category one_column last">
                                                    <span class="menu_title">PIETRE MONTATE</span>
                                                    <ul class="category_container">
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">DIAMANTE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">DIAMANTE NEGRE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">SMARALDE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">SAFIRE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">RUBINE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">PERLE</a></li>
                                                        <li class="ty-menu__submenu-item"><a class="ty-menu__submenu-link" href="">ALTE PIETRE PREŢIOASE</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="menu_options">
                                                <ul>
                                                    <li class="ty-menu__submenu-item"><a href="">TRENDURI INELE LOGODNĂ</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">DESIGN & PROTOTIPIZARE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">CONSILIERE INELE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">EXPERIENŢĂ & CUNOAŞTERE</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">GRAVARE INELE LOGODNĂ</a></li>
                                                    <li class="ty-menu__submenu-item"><a href="">GARANŢIE INELE</a></li>
                                                </ul>
                                            </div>
                                            <div class="menu_footer">
                                                <p class="message_menu"><a href="">Expediere gratuită până la 1 Noiembrie 2014</a></p>
                                                <a class="ls_close_window" href="#">{__("ls_close")}</a>
                                            </div>
                                        </div>
                                    </li>
                                    {/if} {*end of bijuterii menu*}
                                    {*foreach from=$item1.$childs item="item2" name="item2"}
                                        {assign var="item_url2" value=$item2|fn_form_dropdown_object_link:$block.type}
                                        <li class="ty-menu__submenu-item{if $item2.active || $item2|fn_check_is_active_menu_item:$block.type} ty-menu__submenu-item-active{/if}">
                                            <a class="ty-menu__submenu-link" {if $item_url2} href="{$item_url2}"{/if}>{$item2.$name}</a>
                                        </li>
                                    {/foreach*}
                                    {*if $item1.show_more && $item1_url}
                                        <li class="ty-menu__submenu-item ty-menu__submenu-alt-link">
                                            <a href="{$item1_url}"
                                               class="ty-menu__submenu-alt-link">{__("text_topmenu_view_more")}</a>
                                        </li>
                                    {/if*}
                                {/if}
                                {/hook}
                            </ul>
                        </div>
                    {else}
                        <div class="ty-menu__submenu" id="{$unique_elm_id}">
                            {hook name="blocks:topmenu_dropdown_3levels_cols"}
                                <ul class="ty-menu__submenu-items cm-responsive-menu-submenu">
                                    {foreach from=$item1.$childs item="item2" name="item2"}
                                        <li class="ty-top-mine__submenu-col">
                                            {assign var="item2_url" value=$item2|fn_form_dropdown_object_link:$block.type}
                                            <div class="ty-menu__submenu-item-header {if $item2.active || $item2|fn_check_is_active_menu_item:$block.type} ty-menu__submenu-item-header-active{/if}">
                                                <a{if $item2_url} href="{$item2_url}"{/if} class="ty-menu__submenu-link">{$item2.$name}</a>
                                            </div>
                                            {if $item2.$childs}
                                                <a class="ty-menu__item-toggle visible-phone cm-responsive-menu-toggle">
                                                    <i class="ty-menu__icon-open ty-icon-down-open"></i>
                                                    <i class="ty-menu__icon-hide ty-icon-up-open"></i>
                                                </a>
                                            {/if}
                                            <div class="ty-menu__submenu">
                                                <ul class="ty-menu__submenu-list cm-responsive-menu-submenu">
                                                    {if $item2.$childs}
                                                        {hook name="blocks:topmenu_dropdown_3levels_col_elements"}
                                                        {foreach from=$item2.$childs item="item3" name="item3"}
                                                            {assign var="item3_url" value=$item3|fn_form_dropdown_object_link:$block.type}
                                                            <li class="ty-menu__submenu-item{if $item3.active || $item3|fn_check_is_active_menu_item:$block.type} ty-menu__submenu-item-active{/if}">
                                                                <a{if $item3_url} href="{$item3_url}"{/if}
                                                                        class="ty-menu__submenu-link">{$item3.$name}</a>
                                                            </li>
                                                        {/foreach}
                                                        {if $item2.show_more && $item2_url}
                                                            <li class="ty-menu__submenu-item ty-menu__submenu-alt-link">
                                                                <a href="{$item2_url}"
                                                                   class="ty-menu__submenu-link">{__("text_topmenu_view_more")}</a>
                                                            </li>
                                                        {/if}
                                                        {/hook}
                                                    {/if}
                                                </ul>
                                            </div>
                                        </li>
                                    {/foreach}
                                    {if $item1.show_more && $item1_url}
                                        <li class="ty-menu__submenu-dropdown-bottom">
                                            <a href="{$item1_url}">{__("text_topmenu_more", ["[item]" => $item1.$name])}</a>
                                        </li>
                                    {/if}
                                </ul>
                            {/hook}
                        </div>
                    {/if}

                {/if}
            </li>
        {/foreach}

        {/hook}
    </ul>
{/if} 
{/hook}
