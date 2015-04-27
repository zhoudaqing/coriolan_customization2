{if !$nothing_extra}
    {include file="common/subheader.tpl" title=__("user_account_info")}
{/if}

{hook name="profiles:account_info"}
    <div class="profiles-account_info">
        {if $register}
            {foreach from=$profile_fields.$section item=field}
                {if $field.field_name == "phone"}
                    {if $field.field_name}
                        {assign var="data_name" value="user_data"}
                        {assign var="data_id" value=$field.field_name}
                        {assign var="value" value=$user_data.$data_id}
                    {else}
                        {assign var="data_name" value="user_data[fields]"}
                        {assign var="data_id" value=$field.field_id}
                        {assign var="value" value=$user_data.fields.$data_id}
                    {/if}
            <div class="ty-control-group">
                <label for="id_{$data_id}" class="ty-control-group__title cm-required cm-trim">{$field.description}</label>
                <input {if $field.autocomplete_type}x-autocompletetype="{$field.autocomplete_type}"{/if} id="id_{$data_id}" type="text" name="user_data[phone]" size="32" maxlength="32" value="{$value}" class="ty-input-text" />
            </div>
                {/if}
            {/foreach}
        {/if}
        {if $settings.General.use_email_as_login != "Y"}
            <div class="ty-control-group">
                <label for="user_login_profile" class="ty-control-group__title cm-required cm-trim">{__("username")}</label>
                <input id="user_login_profile" type="text" name="user_data[user_login]" size="32" maxlength="32" value="{$user_data.user_login}" class="ty-input-text" />
            </div>
        {/if}

        {if $settings.General.use_email_as_login == "Y" || $nothing_extra || $runtime.checkout}
            <div class="ty-control-group">
                <label for="email" class="ty-control-group__title cm-required cm-email cm-trim">{__("email")}</label>
                <input type="text" id="email" name="user_data[email]" size="32" maxlength="128" value="{$user_data.email}" class="ty-input-text" />
            </div>
        {/if}

        <div class="ty-control-group">
            <label for="password1" class="ty-control-group__title cm-required cm-password">{__("password")}</label>
            <input type="password" id="password1" name="user_data[password1]" size="32" maxlength="32" value="{if $runtime.mode == "update"}            {/if}" class="ty-input-text cm-autocomplete-off" />
        </div>

        <div class="ty-control-group">
            <label for="password2" class="ty-control-group__title cm-required cm-password">{__("confirm_password")}</label>
            <input type="password" id="password2" name="user_data[password2]" size="32" maxlength="32" value="{if $runtime.mode == "update"}            {/if}" class="ty-input-text cm-autocomplete-off" />
        </div>
    </div>
{/hook}