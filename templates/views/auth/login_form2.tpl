{assign var="id" value=$id|default:"main_login"}

{capture name="login"}
    <form name="{$id}_form" action="{""|fn_url}" method="post" class='ls_signin_form'>
    <input type="hidden" name="return_url" value="{$smarty.request.return_url|default:$config.current_url}" />
    <input type="hidden" name="redirect_url" value="{$config.current_url}" />

        {if $style == "checkout"}
            <div class="checkout-login-form">{include file="common/subheader.tpl" title=__("returning_customer")}
        {/if}
        <div class="ty-control-group">
            <p class='ls_mail'><span class='ls_text'>{if $settings.General.use_email_as_login == "Y"}{__("email")}{else}{__("username")}{/if}</span>
            <input type="text" id="login_{$id}" name="user_login" size="30" value="{$config.demo_username}" class="ty-login__input" /></p>
        </div>

        <div class="ty-control-group password-forgot">
            <p class='ls_parola'><span class='ls_text'>{__("password")}</span><a href="{"auth.recover_password"|fn_url}" class="ty-password-forgot__a ls_recuperare_parola"  tabindex="5">{__("forgot_password_question")}</a>
                <input type="password" id="psw_{$id}" name="password" size="30" value="{$config.demo_password}" class="ty-login__input" maxlength="32" /></p>
        </div>

        {include file="common/image_verification.tpl" option="use_for_login" align="left"}

        {if $style == "checkout"}
            </div>
        {/if}

        {hook name="index:login_buttons"}
            <div class="buttons-container clearfix">
                <div class="ty-float-right">
                    {include file="buttons/login2.tpl" but_name="dispatch[auth.login]" but_role="submit"}
                </div>
            </div>
        {/hook}
    </form>
{/capture}

{if $style == "popup"}
    {$smarty.capture.login nofilter}
{else}
    <div class="ty-login ls_signin">
        {$smarty.capture.login nofilter}
    </div>

    {capture name="mainbox_title"}{__("sign_in")}{/capture}
{/if}
