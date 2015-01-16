<pre style="display: none">{$ls_test_quick_view|var_dump}</pre>
{if $auth.user_id}
    <div class='botmenu_wrapper ls_menu_resize wide_carousel'>
        <div class="ls_upper_preferate">
            <div class="ls_total_bijuterie">TOTAL PREFERATE: <span  id='ls_preferate_no'>{$wishlistest}</span>

                <span id='ls_cart_no_var' style='display: none'>
                    {if $smarty.session.cart.amount}{$smarty.session.cart.amount}
                    {else}0
                    {/if}
                </span>
                <span id='ls_user_logged_in' style='display: none'>1</span>
            </div>
            <div class="ls_total_title"><a href='index.php?dispatch=wishlist.view'>FAVORITE</a></div>
            <div class='ls_close_window'><a href='#'> {__("close")}</a></div>
        </div>
        <span class="ls_preferate_1">
            <div class='ls_mid_myaccount2'>
                {if $products_footer}
                    {include file="blocks/list_templates/grid_list_footer.tpl" 
                    columns=1
                    show_empty=false
                    show_trunc_name=true 
                    show_old_price=true 
                    show_price=true 
                    show_clean_price=true 
                    show_list_discount=true
                    no_pagination=true
                    no_sorting=true
                    show_add_to_cart=false
                    is_wishlist=true}
                {/if} 
            </div>
        </span>
        <span class="ls_preferate_2" style="display: none">
            <div class="ls_mid_myaccount3">
                <div class="ls_mid_fav_connect">
                    <span>
                        Conecteaza-te si profita
                    </span>
                    <ul class="ls_preferate_2_ul">
                        <li>Alege produsele preferate cu optiunile dorite </li>
                        <li>si pastreaza-le in cont atat timp cat doresti </li>
                        <li>Lista va fi mereu disponibila, indiferent de unde </li>
                        <li>sau de pe ce dispozitiv te conectezi. </li>
                    </ul>
                </div>
                <div class="ls_mid_fav">
                    <span>
                        FAVORITE
                    </span>
                    <span class="ls_fav_icon">
                    </span>
                    <ul class="ls_preferate_2_main_ul">
                        <li>Iti place ceea ce vezi?</li>
                        <li>Apasa stelutele si creeaza </li>
                        <li>lista ta de produse favorite </li>
                    </ul>
                </div>
                <div class="ls_mid_fav_connect">
                    <span>
                        Nu ai cont? Nu te ingrijora...
                    </span>
                    <ul class="ls_preferate_2_ul">
                        <li>Alege si compara produsele preferate cu </li>
                        <li>optiunile dorite pentru a face alegerea perfecta</li>
                        <li>Lista o sa fie disponibila toata sesiunea ta.</li>
                    </ul>
                </div>
            </div> 
        </span>
    </div>
{else}
    {*$wish_session|var_dump*}{*$ajaxproduct|var_dump*}{*$products_footer|var_dump*}
    <div class='botmenu_wrapper ls_menu_resize  wide_carousel'>
        <div class='ls_upper_myaccount'>
            <div class='ls_total_bijuterie' >TOTAL PREFERATE: <span  id='ls_preferate_no'>{$wishlistest}</span>

                {*include file="addons/wishlist/views/wishlist/carousel.tpl"*}
                <span id='ls_cart_no_var' style='display: none'>
                    {if $smarty.session.cart.amount}{$smarty.session.cart.amount}
                    {else}0
                    {/if}
                </span>
                <span id='ls_user_logged_in' style='display: none'>0</span>
            </div>
            <div class='ls_bijuterii_favorite'><a href='index.php?dispatch=wishlist.view'>FAVORITE</a></div>
            <div class='ls_close_window'><a href='#'> {__("close")}</a></div>
        </div>
        <span class="ls_preferate_1">
            <div class='ls_mid_myaccount'>
                <div class='ls_poza_myaccount'> </div>
                {if $products_footer}
                    {include file="blocks/list_templates/grid_list_footer.tpl" 
                columns=1
                show_empty=false
                show_trunc_name=true 
                show_old_price=true 
                show_price=true 
                show_clean_price=true 
                show_list_discount=true
                no_pagination=true
                no_sorting=true
                show_add_to_cart=false
                is_wishlist=true}
                {/if}  

                {include file="views/auth/login_form2.tpl"}
                <div class="ls_preferate_signup">
                    <span class='ls_text_myaccount'>Nu ai nevoie de un cont Coriolan ca sa utilizezi Shortlist. </span>
                    <span class='ls_buton'><a class='ls_signup' href='index.php?dispatch=profiles.add'>{__("create_account")}</a></span>
                </div>
            </div>
        </span>
        <span class="ls_preferate_2" style="display: none">
            <div class="ls_mid_myaccount3">
                <span class="ls_preferate_2" style="display: none">
                    <div class="ls_mid_myaccount3">
                        <div class="ls_mid_fav_connect">
                            <span>
                                Conecteaza-te si profita
                            </span>
                            <ul class="ls_preferate_2_ul">
                                <li>Alege produsele preferate cu optiunile dorite </li>
                                <li>si pastreaza-le in cont atat timp cat doresti </li>
                                <li>Lista va fi mereu disponibila, indiferent de unde </li>
                                <li>sau de pe ce dispozitiv te conectezi. </li>
                            </ul>
                        </div>
                        <div class="ls_mid_fav">
                            <span class="ls_fav_icon">
                            </span>
                            <ul class="ls_preferate_2_main_ul">
                                <li>Iti place ceea ce vezi?</li>
                                <li>Apasa stelutele si creeaza </li>
                                <li>lista ta de produse favorite </li>
                            </ul>
                        </div>
                        <div class="ls_mid_fav_connect">
                            <span>
                                Nu ai cont? Nu te ingrijora...
                            </span>
                            <ul class="ls_preferate_2_ul">
                                <li>Alege si compara produsele preferate cu </li>
                                <li>optiunile dorite pentru a face alegerea perfecta</li>
                                <li>Lista o sa fie disponibila toata sesiunea ta.</li>
                            </ul>
                        </div>
                    </div> 
                </span>
            </div>
        </span>  
    </div>
    {literal}
    {/literal}
{/if}
