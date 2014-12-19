{if $content|trim}
    <div class="mainbox2-container{if isset($hide_wrapper)} cm-hidden-wrapper{/if}{if $hide_wrapper} ty-hidden{/if}{if $block.user_class} {$block.user_class}{/if}{if $content_alignment == "RIGHT"} ty-float-right{elseif $content_alignment == "LEFT"} ty-float-left{/if}">
        <h3 class="mainbox2-title clearfix">
            {hook name="wrapper:mainbox_simple_title"}
            {if $smarty.capture.title|trim}
                {$smarty.capture.title nofilter}
            {else}
                <span>{$title nofilter}</span>
            {/if}
            {/hook}
        </h3>
        <div class="mainbox2-body">{$content nofilter}</div>
    </div>
{/if}