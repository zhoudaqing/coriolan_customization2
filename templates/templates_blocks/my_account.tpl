{if !$auth.user_id}
<div class='topmenu_wrapper ls_menu_resize'>
    <span class="my_account_title">AVETI UN CONT CORIOLAN?</span>
    <div class="my_account_login">
        {include file="views/auth/login_form2.tpl"}
    </div>
    <div class="my_account_signup">
        <ul class="signup_text">
            <li>  Create a Coriolan account to enjoy: </li>
            <li>   - Faster checkout with saved details </li>
            <li>   - Easy order tracking and order histories </li>
            <li>   - Share your favourite products via Shortlist </li>
            <li>   - See more at: http://www.coriolan.ro/about </li>
        </ul>
        <a href="{"profiles.add"|fn_url}" rel="nofollow" class="ty-btn ty-btn__primary ls_buton">{__("register")}</a>
    </div>
    <div class="ls_close_window">
    <a href="#">{__("close")}</a>
    </div>
</div>
{else}
<div class='topmenu_wrapper ls_menu_resize'>
    <ul class="my_account_navigation">
        <li class="my_account_home"><a href="#">Pagina de start</a></li>
        <li class="my_account_profile"><a href="#">Detalii</a></li>
        <li class="my_account_preferences"><a href="#">Preferinte</a></li>
        <li class="my_account_orders"><a href="#">Comenzi</a></li>
        <li class="my_account_prefered"><a href="#">Preferate</a></li>
        <li><a href="{"auth.logout?redirect_url=`$return_current_url`"|fn_url}" rel="nofollow" class="ty-btn ty-btn__primary ls_buton my_account_logout_button">{__("sign_out")}</a></li>
    </ul>
    <div class="ls_despre_bot">
        <div class="ls_dropdown_bot">
            <span class="ls_promo_title">Hello there!</span>
            <span class="ls_promo_text">
                Looking for something specific? Give our Style Advisors a call on 0207 201 8688
            </span>
        </div>
        <div class="ls_close_window">
        <a href="#">{__("close")}</a>
        </div>
    </div>
</div>
{/if}