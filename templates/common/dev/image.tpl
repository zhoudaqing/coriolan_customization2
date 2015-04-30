{strip}
{if $capture_image}
    {capture name="image"}
{/if}

{if !$obj_id}
    {math equation="rand()" assign="obj_id"}
{/if}

{$image_data=$images|fn_image_to_display:$image_width:$image_height}
{$generate_image=$image_data.generate_image && !$external}

{if $show_detailed_link}
    <a id="det_img_link_{$obj_id}"{if $image_data.detailed_image_path && $image_id && !$test_hide_modal_image}data-ca-image-id="{$image_id}"{/if} class="{$link_class} {if $image_data.detailed_image_path}cm-previewer ty-previewer{/if}" {if $image_data.detailed_image_path && !$test_hide_modal_image}href="{$image_data.detailed_image_path}" title="{$images.detailed.alt}"{/if} {if $test_hide_modal_image}style="cursor:auto"{/if}>
{/if}
{if $image_data.image_path}
    <img class="ty-pict {$valign} {$class} {if $generate_image}ty-spinner{/if}"  {if $obj_id && !$no_ids}id="det_img_{$obj_id}"{/if} {if $generate_image}data-ca-image-path="{$image_data.image_path}"{/if} src="{if $generate_image}{$images_dir}/icons/spacer.gif{else}{$image_data.image_path}{/if}" alt="{$image_data.alt}" title="{$image_data.alt}" {if $image_onclick}onclick="{$image_onclick}"{/if} {if $main_image && $test_hide_modal_image}onload="onload_image_actions();"{/if} />
{else}
    
    {if !$image_width}
        {$image_width=260}
    {else}
        {$image_width=$image_width - 10}
    {/if}
    
    {if !$image_height}
        {if $image_width}
            {$image_height=$image_width}
        {else}
            {$image_height=340}
        {/if}
    {/if}
    {if $ls_is_category_page} {*if in category page*}
           {$image_height=320}
    {/if}
    <img style="display:none;" src="/design/themes/responsive/media/images/images/no-img.png" {if $main_image && test_hide_modal_image}onload="onload_image_actions();"{/if} />
    {if $ls_recent_footer}
    <span class="ty-no-image" style="min-width: {$image_width|default:$image_width}px; min-height: {$image_height|default:$image_width}px;"><i class="ty-no-image__icon ty-icon-image" title="{__("no_image")}"></i></span>
    {else}
    <span class="ty-no-image" style="min-width: {$image_width}px; min-height: {$image_height|default:$image_width}px;"><i class="ty-no-image__icon ty-icon-image" title="{__("no_image")}"></i></span>
    {/if}
{/if}
{if $show_detailed_link}
    {if $images.detailed_id}
        <span class="ty-previewer__icon hidden-phone"></span>
    {/if}
</a>
{/if}

{if $capture_image}
    {/capture}
    {capture name="icon_image_path"}
        {$image_data.image_path}
    {/capture}
    {capture name="detailed_image_path"}
        {$image_data.detailed_image_path}
    {/capture}
{/if}

{/strip}
