{*  To modify and rearrange content blocks in your storefront pages
or change the page structure, use the layout editor under Design->Layouts
in your admin panel.

There, you can:

* modify the page layout
* make it fluid or static
* set the number of columns
* add, remove, and move blocks
* change block templates and types and more.

You only need to edit a .tpl file to create a new template
or modify an existing one; often, this is not the case.

Basic layouting concepts:

This theme uses the Twitter Bootstrap 2.3 CSS framework.

A layout consists of four containers (CSS class .container):
TOP PANEL, HEADER, CONTENT, and FOOTER.

Containers are partitioned with fixed-width grids (CSS classes .span1, .span2, etc.).

Content blocks live inside grids. You can drag'n'drop blocks
from grid to grid in the layout editor.

A block represents a certain content type (e.g. products)
and uses a certain template to display it (e.g. list with thumbnails).
*}
<!DOCTYPE html>
<html lang="{$smarty.const.CART_LANGUAGE}">
    <head>
        {capture name="title"}
            {hook name="index:title"}
            {if $page_title}
                {$page_title}
            {else}
                {foreach from=$breadcrumbs item=i name="bkt"}
                {if !$smarty.foreach.bkt.first}{$i.title|strip_tags}{if !$smarty.foreach.bkt.last} :: {/if}{/if}
            {/foreach}
        {if !$skip_page_title && $location_data.title}{if $breadcrumbs|count > 1} - {/if}{$location_data.title}{/if}
    {/if}
    {/hook}
{/capture}
<title>{$smarty.capture.title|strip|trim nofilter}</title>
{include file="meta.tpl"}
<link href="{$logos.favicon.image.image_path}" rel="shortcut icon" />
{include file="common/styles.tpl" include_dropdown=true}
{include file="common/scripts.tpl"}
</head>

<body>
    {if $runtime.customization_mode.design}
        {include file="common/toolbar.tpl" title=__("on_site_template_editing") href="customization.disable_mode?type=design"}
    {/if}
    {if $runtime.customization_mode.translation}
        {include file="common/toolbar.tpl" title=__("on_site_text_editing") href="customization.disable_mode?type=translation"}
    {/if}
    {if "THEMES_PANEL"|defined}
        {include file="demo_theme_selector.tpl"}
    {/if}

    <div class="ty-tygh {if $runtime.customization_mode.theme_editor}te-mode{/if} {if $runtime.customization_mode.translation || $runtime.customization_mode.design}ty-top-panel-padding{/if}" id="tygh_container">

        {include file="common/loading_box.tpl"}
        {include file="common/notification.tpl"}

        <div class="ty-helper-container" id="tygh_main_container">
            {hook name="index:content"}
            {render_location}
            {/hook}
            <!--tygh_main_container--></div>


        {if $runtime.customization_mode.translation}
            {include file="common/translate_box.tpl"}
        {/if}
        {if $runtime.customization_mode.design}
            {include file="common/template_editor.tpl"}
        {/if}
        {if $runtime.customization_mode.theme_editor}
            {include file="common/theme_editor.tpl"}
        {/if}
        {hook name="index:footer"}{/hook}
        <!--tygh_container--></div>
        {* Chat *}
        {literal}
        <script type="text/javascript">
            window.$zopim || (function(d, s) {
                var z = $zopim = function(c) {
                    z._.push(c)
                }, $ = z.s =
                        d.createElement(s), e = d.getElementsByTagName(s)[0];
                z.set = function(o) {
                    z.set.
                            _.push(o)
                };
                z._ = [];
                z.set._ = [];
                $.async = !0;
                $.setAttribute('charset', 'utf-8');
                $.src = '//cdn.zopim.com/?N6m1TZ5Vu8PPo8Ed3HHKF4EkxhxKBHtF';
                z.t = +new Date;
                $.
                        type = 'text/javascript';
                e.parentNode.insertBefore($, e)
            })(document, 'script');
        </script>
    {/literal}
    {*generate recently viewed products&others*}
    {literal}
        <script type='text/javascript'>
            $(document).ready(function() {
                if (!$("#sw_dropdown_269").length) {
                    $(".span4.demo-store-grid").append('<div class="ty-dropdown-box footer_window recently_seen ty-float-left"><div id="sw_dropdown_269" class="ty-dropdown-box__title cm-combination">  \
        <a>RECENT VIZUALIZATE</a> \
    </div> \
    <div id="dropdown_269" class="cm-popup-box ty-dropdown-box__content" style="display: none" > \
    <div class="botmenu_wrapper ls_menu_resize"> \
    <div class="ls_upper_recent"> \
    <div id="ls_total_bijuterie" class="ls_total_bijuterie"></div> \
    <div class="ls_recent_title">RECENT VIZUALIZATE</div> \
    <div class="ls_close_window"> \
    <a href="#">CLOSE</a> \
    </div> \
    </div> \
    <div class="ls_recent_carousel"> \
    <div class="0_recente">Nu ati vizualizat recent produse</div> \
    </div> \
    </div> \
    </div> \
    </div></div>');
                }
                //generate no of favorites span
                $("#sw_dropdown_279 > a").append("<span id='ls_preferate_no2'>");
                //no of recently viewed products
                var no_li_recent = $('.recently_seen li').length;
                if (no_li_recent != '1') {
                    $('#ls_total_bijuterie').append('Total: ' + no_li_recent + ' bijuterii');
                } else {
                    $('#ls_total_bijuterie').append('Total: ' + no_li_recent + ' bijuterie');
                }
                if (no_li_recent != '0') {
                    $('#sw_dropdown_269 > a').append(' (' + no_li_recent + ')');
                }
                //display number of favorites products in footer
                var ls_preferate_no = $('#ls_preferate_no').html();
                if (ls_preferate_no != '0') {
                    $('#ls_preferate_no2').append(' (' + ls_preferate_no + ')');
                }
                //hide recent preferate sidebox
                $('#sidebox_25').siblings().hide();
                $('#sidebox_25').hide();
                //close window button
                $('.ls_close_window').on('click', function() {
                    $('.cm-popup-box.ty-dropdown-box__content').hide();
                });
                //search modal customization
                $('#myModal1').on('show.bs.modal', function(e) {
                    console.log('modal shown');
                    $('#tygh_main_container').children('.tygh-top-panel.clearfix').css("zIndex", 1);
                });
                $('#myModal1').on('hide.bs.modal', function(e) {
                    console.log('modal hidden');
                    $('#tygh_main_container').children('tygh-top-panel.clearfix').css("zIndex", 2)
                });
            }
            );
        </script>
    {/literal}
    {*center menu*}
    {literal}
        <script type='text/javascript'>
            $(document).ready(function() {
                function bresize() {
                    var footerDropdownZone = ($(window).width() - 1200) / 2;
                    $('.header_window').children('.ty-dropdown-box__content').css('left', footerDropdownZone);
                }
                ;
                bresize();
                $(window).resize(function() {
                    var footerDropdownZone = ($(window).width() - 1200) / 2;
                    $('.header_window').children('.ty-dropdown-box__content').css('left', footerDropdownZone);
                });
            });
        </script>
    {/literal}
    {*recently viewed&favorites carousel&user_updates&cart_carousel*}
    {literal}
        <!--script type='text/javascript' src='/../../../../js/carousel/carousel_13.js'></script-->
        <script type='text/javascript' src='/../../../../js/carousel/SliderOpb.js'></script>
        <script type='text/javascript' src='/../../../../js/carousel/initSliderOpb.js'></script>
        <!--script type='text/javascript' src='/../../../../js/carousel/owl.carousel.js'></script-->
        <script type='text/javascript' src='/../../../../js/carousel/change_fav_footer.js'></script>
        <script type='text/javascript' src='/../../../../js/ls_js/ls_user_updates.js'></script>
        <script type='text/javascript' src='/../../../../js/carousel/carousel_cart.js'></script>
        <script type='text/javascript' src='/../../../../js/jquery.bxslider/jquery.bxslider.min.js'></script>
    {/literal}
    {*initialize the SliderOpb carousels*}
    {literal}
        
    {/literal}
    {*boostrap include*}
    {literal}
        <script type='text/javascript' src='/../../../../js/search_modal/bootstrap.min.js'></script>
    {/literal}
</body>
</html>
