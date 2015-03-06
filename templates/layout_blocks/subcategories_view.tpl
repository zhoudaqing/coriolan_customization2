{hook name="categories:view"}
<div id="category_products_{$block.block_id}" class="testblockview">
{if $subcategories or $category_data.description || $category_data.main_pair}
    {math equation="ceil(n/c)" assign="rows" n=$subcategories|count c=$columns|default:"2"}
    {split data=$subcategories size=$rows assign="splitted_subcategories"}

{if $category_data.description && $category_data.description != ""}
    <div class="ty-wysiwyg-content ty-mb-s">
        <div class="ls_category_page_image">
      <img src="{$ls_category_image}">
        </div>
      <p class="category_name_title">{$category_data.category nofilter}</p>
      {$category_data.description nofilter}
     </div>
{/if}

    {if $subcategories}
        <ul class="subcategories clearfix">
        {foreach from=$splitted_subcategories item="ssubcateg"}
            {foreach from=$ssubcateg item=category name="ssubcateg"}
                {if $category}
                    <li class="ty-subcategories__item">
                        <a href="{"categories.view?category_id=`$category.category_id`"|fn_url}">
                        {*if $category.main_pair}
                            {include file="common/image.tpl"
                                show_detailed_link=false
                                images=$category.main_pair
                                no_ids=true
                                image_id="category_image"
                                image_width=$settings.Thumbnails.category_lists_thumbnail_width
                                image_height=$settings.Thumbnails.category_lists_thumbnail_height
                                class="ty-subcategories-img"
                            }
                        {/if*}
                        {$category.category}
                        </a>
                    </li>
                {/if}
            {/foreach}
        {/foreach}
        </ul>
    {/if}

{/if}
</div>

{capture name="mainbox_title"}{$category_data.category}{/capture}
{/hook}
