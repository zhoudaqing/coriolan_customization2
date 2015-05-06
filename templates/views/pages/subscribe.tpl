<div class="tygh-content clearfix">
    <div class="ls_sign_newsletter_container">
        <div class="ls_sign_newsletter_wrap">
            <div class="ls_sign_newsletter">
                <p>
                    {__("ls_sign_newsletter")}
                </p>
            </div>
            <h1>{__("ls_read_all")}</h1>
            <p class="ls_sign_newsletter_text">
                {__("ls_be_first1")}
                <br class="">
                {__("ls_be_first2")}
            </p>
            <hr>
        </div>
    </div>
    <div class="ls_sign_newsletter_categories">
        <ul class="">
            <li> 
                {__("ls_sign_newsletter_categories1")}
                <!--h2>Designer alerts</h2>
                <p>
                    Find out <br class="">
                    about this season's <br class="">
                    need-to-know names.
                </p-->
            </li>
            <li>
                {__("ls_sign_newsletter_categories2")}
            </li>
            <li>
                {__("ls_sign_newsletter_categories22")}
            </li>
            <li class="">
                {__("ls_sign_newsletter_categories3")}
            </li>
        </ul>
        <div class="ls_sign_newsletter_form">
            <form action="{""|fn_url}" method="post" name="subscribe_form" class="cm-processed-form ls_subscribe_newslleter_form">
                <input type="hidden" name="redirect_url" value="{""|fn_url}thanks" />
                <input type="hidden" name="newsletter_format" value="2" />
                <div id="" class="ls_sign_newsletter_form_title">
                    <label class="cm-required" for="ls_new_title">Title</label>
                    <select name="new_title"  class="ls_new_title">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Ms">Ms</option>
                        <option value="Dame">Dame</option>
                        <option value="Sir">Sir</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Professor">Professor</option>
                        <option value="Lord">Lord</option>
                        <option value="Lady">Lady</option>
                    </select>
                </div>
                <div class="ls_sign_newsletter_form_name">
                    <label class="cm-required" for="new_firstName">First name</label> 
                    <input  name="new_firstName" id="new_firstName" class="ty-input-text " type="text" placeholder="">
                </div>
                <div class="ls_sign_newsletter_form_surname">
                    <label class="cm-required" for="new_lastName">Surname</label> 
                    <input name="new_lastName" id="new_lastName" type="text" placeholder="">
                </div>
                <div class="ls_sign_newsletter_form_email">
                        <label class=" " for="ls_subscr_email99">{__("email")}</label>
                        <input type="text" name="subscribe_email" id="ls_subscr_email99" size="20" {if $smarty.session.cart.user_data.email} value="{$smarty.session.cart.user_data.email}" {else} placeholder="{__("enter_email")}" {/if}class="{if !$smarty.session.cart.user_data.email}cm-hint ty-input-text ls_submit_form{/if}" />
                        <span style="display: none" id="ls_subscribe_page_email">{$smarty.session.cart.user_data.email}</span>
                </div>
                <div class="ls_sign_newsletter_form_confirm">
                        <label class="cm-required cm-email" for="subscr_email99_2">{__("validate_email")}</label> 
                        <input type="text" name="subscribe_email_2" id="subscr_email99_2" size="20" placeholder="{__("enter_email")}" autocomplete="off" class="cm-hint ty-input-text ls_submit_form">
                </div>
                <p class="ls_subscribe_btn_wrap">
                        {include file="buttons/go2.tpl" but_name="newsletters.add_subscriber" alt=__("go")}                                 
                </p>
                <input type="hidden" name="dispatch" value="newsletters.add_subscriber">
            </form>
                
        </div>
        <div class="ls_sign_newsletter_last_text">
            <div class="">
                <p>
                    {__("ls_coriolan_personal_info")}
                </p>
            </div>
        </div>
    </div>
</div>
{capture name="mainbox_title"}
{/capture}