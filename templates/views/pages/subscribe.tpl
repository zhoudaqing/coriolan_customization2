<div class="tygh-content clearfix">
    <div class="ls_sign_newsletter_container">
        <div class="ls_sign_newsletter_wrap">
            <div class="ls_sign_newsletter">
                <p>
                    Sign up for the latest updates
                </p>
            </div>
            <h1>Read All About It</h1>
            <p class="ls_sign_newsletter_text">
                Be the first to hear Coriolan news, shop new arrivals and
                <br class="">
                get exclusive invitations to special events.
            </p>
            <hr>
        </div>
    </div>
    <div class="ls_sign_newsletter_categories">
        <ul class="">
            <li>
                <h2>Designer alerts</h2>
                <p>
                    Find out <br class="">
                    about this season's <br class="">
                    need-to-know names.
                </p>
            </li>
            <li>
                <h2>Invitations</h2>
                <p>
                    To exclusive <br class="">
                    events including our <br class="">
                    fashion shows.
                </p>
            </li>
            <li>
                <h2>Sale</h2>
                <p>
                    Special sale <br class="">
                    previews and seasonal <br class="">
                    promotions.
                </p>
            </li>
            <li class="">
                <h2>Food &amp; wine</h2>
                <p>
                    Restaurant news and <br class="">
                    events plus Foodmarket <br class="">
                    favourites.
                </p>
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
                    <label class="cm-required cm-profile-field" for="new_firstName">First name</label> 
                    <input x-autocompletetype="given-name" name="new_firstName" id="new_firstName" class="ty-input-text " type="text" placeholder="">
                </div>
                <div class="ls_sign_newsletter_form_surname">
                    <label class="cm-required" for="new_lastName">Surname</label> <input name="new_lastName" type="text" placeholder="">
                </div>
                <div class="ls_sign_newsletter_form_email">
                        <label class="cm-required cm-email" for="subscr_email99">{__("email")}</label>
                        <input type="text" name="subscribe_email" id="subscr_email99" size="20" placeholder="{__("enter_email")}" class="cm-hint ty-input-text ls_submit_form" />
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
                    Coriolan does not share your email or personal details with anyone else.             <br class="">
                    All data collected is held according to our <a href="#">privacy policy</a>.
                </p>
            </div>
        </div>
    </div>
</div>
{capture name="mainbox_title"}
{/capture}