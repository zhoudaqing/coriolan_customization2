{if $smarty.const.CART_LANGUAGE=="ro"}
<div class='botmenu_wrapper ls_menu_resize'>
    <div class='ls_upper_conecteaza'>
        <div class='ls_conecteaza_title'>CONECTEAZA-TE LA CORIOLAN</div>
        <div class='ls_close_window'><a href='#'>{__("close")}</a></div>
    </div>
    <div class='ls_mid_conecteaza'>
        <div class='ls_conecteaza_links'>
            <a class='ls_conecteaza_link poza_facebook'>facebook</a>
            <a class='ls_conecteaza_link poza_twitter'>twitter</a>
            <a class='ls_conecteaza_link poza_instagram'>instagram</a>
            <a class='ls_conecteaza_link poza_pinterest'>pinterest</a>
            <a class='ls_conecteaza_link poza_google'>google+</a>
            <a class='ls_conecteaza_link poza_youtube'>youtube</a>
        </div>
                {** block-description:tmpl_subscription **}
                {if $addons.news_and_emails}
                    <div class="ty-footer-form-block ls_conecteaza_div_form">
                        <form action="{""|fn_url}" method="post" name="subscribe_form" class="testsubscribe">
                            <input type="hidden" name="redirect_url" value="{$config.current_url}" />
                            <input type="hidden" name="newsletter_format" value="2" />
                            <div class="ty-footer-form-block__title ls_posta_text">{__("stay_connected")}</div>
                            <div class="ty-footer-form-block__form ty-control-group ty-input-append">
                                <label class="cm-required cm-email hidden" for="subscr_email{$block.block_id}">{__("email")}</label>
                                <input type="text" name="subscribe_email" id="subscr_email{$block.block_id}" size="20" {if $smarty.session.cart.user_data.email}value="{$smarty.session.cart.user_data.email}"{else} value="" placeholder="{__("enter_email")}"{/if}class="ty-input-text ls_submit_form" />
                                {*include file="buttons/go2.tpl" but_name="newsletters.add_subscriber" alt=__("go")*}
                                <button title="Mergeti" class="ty-btn-go abonare_buton" ><a href='{"pages.subscribe"|fn_url}'>ABONEAZA-TE</a></button>
                            </div>
                        </form>
                    </div>
                {/if}
        </div>
    </div>
{else}
    <div class='botmenu_wrapper ls_menu_resize'>
        <div class='ls_upper_conecteaza'>
            <div class='ls_conecteaza_title'>CONNECT TO CORIOLAN</div>
            <div class='ls_close_window'><a href='#'>{__("close")}</a></div>
        </div>
        <div class='ls_mid_conecteaza'>
            <div class='ls_conecteaza_links'>
                <a class='ls_conecteaza_link poza_facebook'>facebook</a>
                <a class='ls_conecteaza_link poza_twitter'>twitter</a>
                <a class='ls_conecteaza_link poza_instagram'>instagram</a>
                <a class='ls_conecteaza_link poza_pinterest'>pinterest</a>
                <a class='ls_conecteaza_link poza_google'>google+</a>
                <a class='ls_conecteaza_link poza_youtube'>youtube</a>
            </div>
            {** block-description:tmpl_subscription **}
            {if $addons.news_and_emails}
                <div class="ty-footer-form-block ls_conecteaza_div_form">
                    <form action="{""|fn_url}" method="post" name="subscribe_form" class="testsubscribe">
                        <input type="hidden" name="redirect_url" value="{$config.current_url}" />
                        <input type="hidden" name="newsletter_format" value="2" />
                        <div class="ty-footer-form-block__title ls_posta_text">{__("stay_connected")}</div>
                        <div class="ty-footer-form-block__form ty-control-group ty-input-append">
                            <label class="cm-required cm-email hidden" for="subscr_email{$block.block_id}">{__("email")}</label>
                            <input type="text" name="subscribe_email" id="subscr_email{$block.block_id}" size="20" {if $smarty.session.cart.user_data.email}value="{$smarty.session.cart.user_data.email}"{else} value="" placeholder="{__("enter_email")}"{/if} class="ty-input-text ls_submit_form" />
                            {*include file="buttons/go2.tpl" but_name="newsletters.add_subscriber" alt=__("go")*}
                            <button title="Mergeti" class="ty-btn-go abonare_buton ls_footer_subscribe" ><a href='{"pages.subscribe"|fn_url}'>SUBSCRIBE</a></button>
                        </div>
                    </form>
                </div>
            {/if}
        </div>
    </div>    
{/if}
</div>