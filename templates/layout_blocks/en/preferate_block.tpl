{if $auth.user_id}
    <div class='botmenu_wrapper ls_menu_resize {if $wishlistest>1}wide_carousel{/if}'>
        <div class="ls_upper_preferate">
            <div class="ls_total_bijuterie">TOTAL PREFERATE: <span  id='ls_preferate_no'>{$wishlistest}</span>

                <span id='ls_cart_no_var' style='display: none'>
                    {if $smarty.session.cart.amount}{$smarty.session.cart.amount}
                    {else}0
                    {/if}
                </span>
                <span id='ls_user_logged_in' style='display: none'>1</span>
            </div>
            <div class="ls_total_title"><a href='http://coriolan.leadsoft.eu/index.php?dispatch=wishlist.view'> FAVORITES </a></div>
            <div class='ls_close_window'><a href='#'></a></div>
        </div>
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
    </div>
{else}
    <div class='botmenu_wrapper ls_menu_resize  {if $wishlistest>1}wide_carousel{/if}'>
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
            <div class='ls_bijuterii_favorite'><a href='http://coriolan.leadsoft.eu/index.php?dispatch=wishlist.view'>FAVORITE</a></div>
            <div class='ls_close_window'><a href='#'></a></div>
        </div>
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
                <span class='ls_buton'><a class='ls_signup' href='http://coriolan.leadsoft.eu/index.php?dispatch=profiles.add'>{__("create_account")}</a></span>
            </div>
        </div>
    </div>
    {literal}
    {/literal}
{/if}
