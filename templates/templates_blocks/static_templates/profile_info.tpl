{if $runtime.controller == 'profiles'}
    {if $runtime.mode == 'add'}
        {*
    <div class="ty-account-benefits">
        {__("text_profile_benefits")}
    </div>
*}
    {elseif $runtime.mode == 'update'}
        <div class="ty-account-detail profiles-profile_fields">
            {__("text_profile_details")}
        </div>
    {/if}
{/if}