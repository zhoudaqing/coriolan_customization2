// Windows Phone 8 Device-Width fix
(function() {
    if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode("@-ms-viewport{width:auto!important}")
        );
        document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
    }
})();

var Tygh = {
    embedded: typeof(TYGH_LOADER) !== 'undefined',
    doc: typeof(TYGH_LOADER) !== 'undefined' ? TYGH_LOADER.doc : document,
    body: typeof(TYGH_LOADER) !== 'undefined' ? TYGH_LOADER.body : null, // will be defined in runCart method
    otherjQ: typeof(TYGH_LOADER) !== 'undefined' && TYGH_LOADER.otherjQ,
    facebook: typeof(TYGH_FACEBOOK) !== 'undefined' && TYGH_FACEBOOK,
    container: 'tygh_main_container',
    init_container: 'tygh_container',
    lang: {},
    area: '',
    isTouch: false,
    // Get or set language variable
    tr: function(name, val)
    {
        if (typeof(name) == 'string' && typeof(val) == 'undefined') {
            return Tygh.lang[name];
        } else if (typeof(val) != 'undefined'){
            Tygh.lang[name] = val;
            return true;
        } else if (typeof(name) == 'object') {
            Tygh.$.extend(Tygh.lang, name);

            return true;
        }

        return false;
    }
}; // namespace

(function(_, $) {

    _.$ = $;

    /*
     * Add browser detection
     * It's deprecated since jQuery 1.9, but a lot of code still use this
     */
    (function($){
        var ua = navigator.userAgent.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];
        var matched = {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };

        var browser = {};

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if ( browser.chrome ) {
            browser.webkit = true;
        } else if ( browser.webkit ) {
            browser.safari = true;
        }

        $.browser = browser;
    })($);

    $.extend({
        lastClickedElement: null,

        getWindowSizes: function()
        {
            var iebody = (document.compatMode && document.compatMode != 'BackCompat') ? document.documentElement : document.body;
            return {
                'offset_x'   : iebody.scrollLeft ? iebody.scrollLeft : (self.pageXOffset ? self.pageXOffset : 0),
                'offset_y'   : iebody.scrollTop  ? iebody.scrollTop : (self.pageYOffset ? self.pageYOffset : 0),
                'view_height': self.innerHeight ? self.innerHeight : iebody.clientHeight,
                'view_width' : self.innerWidth ? self.innerWidth : iebody.clientWidth,
                'height'     : iebody.scrollHeight ? iebody.scrollHeight : window.height,
                'width'      : iebody.scrollWidth ? iebody.scrollWidth : window.width
            };
        },

        disable_elms: function(ids, flag)
        {
            $('#' + ids.join(',#')).prop('disabled', flag);
        },

        ua: {
            version: (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) ? (navigator.userAgent.match(/.+(?:chrome)[\/: ]([\d.]+)/i) || [])[1] : ((navigator.userAgent.toLowerCase().indexOf("msie") >= 0)? (navigator.userAgent.match(/.*?msie[\/:\ ]([\d.]+)/i) || [])[1] : (navigator.userAgent.match(/.+(?:it|pera|irefox|ersion)[\/: ]([\d.]+)/i) || [])[1]),
            browser: (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) ? 'Chrome' : ($.browser.safari ? 'Safari' : ($.browser.opera ? 'Opera' : ($.browser.msie ? 'Internet Explorer' : 'Firefox'))),
            os: (navigator.platform.toLowerCase().indexOf('mac') != -1 ? 'MacOS' : (navigator.platform.toLowerCase().indexOf('win') != -1 ? 'Windows' : 'Linux')),
            language: (navigator.language ? navigator.language : (navigator.browserLanguage ? navigator.browserLanguage : (navigator.userLanguage ? navigator.userLanguage : (navigator.systemLanguage ? navigator.systemLanguage : ''))))
        },

        is: {
            email: function(email)
            {
                return /^([\w-+=_]+(?:\.[\w-+=_]+)*)@((?:[-a-zA-Z0-9]+\.)*[a-zA-Z0-9][-a-zA-Z0-9]{0,65})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email) ? true : false;
            },

            blank: function(val)
            {
                if (val == null || val.replace(/[\n\r\t]/gi, '') == '') {
                    return true;
                }

                return false;
            },

            integer: function(val)
            {
                return (/^[0-9]+$/.test(val) && !$.is.blank(val)) ? true : false;
            },

            color: function(val)
            {
                return (/^\#[0-9a-fA-F]{6}$/.test(val) && !$.is.blank(val)) ? true : false;
            },

            phone: function(val)
            {
                var digits = '0123456789';
                var valid_chars = '()- +';
                var min_digits = 10;
                var bracket = 3;
                var brchr = val.indexOf('(');
                var s = '';

                val = $.trim(val);

                if (val.indexOf('+') > 1) {
                    return false;
                }
                if (val.indexOf('-') != -1) {
                    bracket = bracket + 1;
                }
                if ((val.indexOf('(') != -1 && val.indexOf('(') > bracket) || (val.indexOf('(') != -1 && val.charAt(brchr + 4) != ')') || (val.indexOf('(') == -1 && val.indexOf(')') != -1)) {
                    return false;
                }

                for (var i = 0; i < val.length; i++) {
                    var c = val.charAt(i);
                    if (valid_chars.indexOf(c) == -1) {
                        s += c;
                    }
                }

                return ($.is.integer(s) && s.length >= min_digits);
            }
        },

        cookie: {
            get: function(name)
            {
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                while (i < clen) {
                    var j = i + alen;
                    if (document.cookie.substring(i, j) == arg) {
                        var endstr = document.cookie.indexOf (";", j);
                        if (endstr == -1) {
                            endstr = document.cookie.length;
                        }

                        return unescape(document.cookie.substring(j, endstr));
                    }

                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0) {
                        break;
                    }
                }
                return null;
            },

            set: function(name, value, expires, path, domain, secure)
            {
                document.cookie = name + "=" + escape (value) + ((expires) ? "; expires=" + expires.toGMTString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
            },

            remove: function(name, path, domain)
            {
                if ($.cookie.get(name)) {
                    document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
                }
            }
        },

        redirect: function(url, replace)
        {
            replace = replace || false;

            if ($('base').length && url.indexOf('/') != 0 && url.indexOf('http') !== 0) {
                url = $('base').prop('href') + url;
            }

            if (_.embedded) {
                $.ceAjax('request', url, {result_ids: _.container});
            } else {
                if (replace) {
                    window.location.replace(url);
                } else {
                    window.location.href = url;
                }
            }
        },

        dispatchEvent: function(e)
        {
            var jelm = $(e.target);
            var elm = e.target;
            var s;
            e.which = e.which || 1;

            if ((e.type == 'click' || e.type == 'mousedown') && $.browser.mozilla && e.which != 1) {
                return true;
            }

            var processed = {
                status: false,
                to_return: true
            };
            $.ceEvent('trigger', 'dispatch_event_pre', [e, jelm, processed]);

            if (processed.status) {
                return processed.to_return;
            }

            // Dispatch click event
            if (e.type == 'click') {

                // If action should be applied to items check if items are selected
                if ($.getProcessItemsMeta(elm)) {
                    if (!$.checkSelectedItems(elm)) {
                        return false;
                    }

                // If element or its parents (e.g. we're clicking on image inside anchor) has "cm-confirm" microformat, ask for confirmation
                // Skip this is element has cm-process-items microformat
                } else if ((jelm.hasClass('cm-confirm') || jelm.parents().hasClass('cm-confirm')) && !jelm.parents().hasClass('cm-skip-confirmation')) {
                    if (confirm(_.tr('text_are_you_sure_to_proceed')) === false) {
                        return false;
                    }
                    $.ceEvent('trigger', 'ce.form_confirm', [jelm]);
                }


                $.lastClickedElement = jelm;

                if (jelm.hasClass('cm-disabled')) {
                    return false;
                }

                if (jelm.hasClass('cm-delete-row') || jelm.parents('.cm-delete-row').length) {
                    var holder;

                    if (jelm.is('tr') || jelm.hasClass('cm-row-item')) {
                        holder = jelm;
                    } else if (jelm.parents('.cm-row-item').length) {
                        holder = jelm.parents('.cm-row-item:first');
                    } else if (jelm.parents('tr').length && !$('.cm-picker', jelm.parents('tr:first')).length) {
                        holder = jelm.parents('tr:first');
                    } else {
                        return false;
                    }

                    $('.cm-combination[id^=off_]', holder).click(); // if there're subelements in deleted element, hide them

                    if (holder.parent('tbody.cm-row-item').length) { // if several trs groupped into tbody
                        holder = holder.parent('tbody.cm-row-item');
                    }

                    if (jelm.hasClass('cm-ajax') || jelm.parents('.cm-ajax').length) {
                        $.ceAjax('clearCache');
                        holder.remove();
                    } else {
                        if (holder.hasClass('cm-opacity')) {
                            $(':input', holder).each(function() {
                                $(this).prop('name', $(this).data('caInputName'));
                            });
                            holder.removeClass('cm-delete-row cm-opacity');
                            if ($.browser.msie || $.browser.opera) {
                                $('*', holder).removeClass('cm-opacity');
                            }
                        } else {
                            $(':input[name]', holder).each(function() {
                                $(this).data('caInputName', $(this).prop('name')).prop('name', '');
                            });
                            holder.addClass('cm-delete-row cm-opacity');
                            if (($.browser.msie && $.browser.version < 9) || $.browser.opera) {
                                $('*', holder).addClass('cm-opacity');
                            }
                        }
                    }
                }

                if (jelm.hasClass('cm-save-and-close')) {
                    jelm.parents('form:first').append('<input type="hidden" name="return_to_list" value="Y" />');
                }

                if (jelm.hasClass('cm-new-window') && jelm.prop('href') || jelm.closest('.cm-new-window') && jelm.closest('.cm-new-window').prop('href')) {
                    var _e = jelm.hasClass('cm-new-window') ? jelm.prop('href') : jelm.closest('.cm-new-window').prop('href');
                    window.open(_e);
                    return false;
                }

                if (jelm.hasClass('cm-select-text')) {
                    if (jelm.data('caSelectId')) {
                        var c_elm = jelm.data('caSelectId');
                        if (c_elm && $('#' + c_elm).length) {
                            $('#' + c_elm).select();
                        }
                    } else {
                        jelm.get(0).select();
                    }
                }

                if (jelm.hasClass('cm-external-click') || jelm.parents('.cm-external-click').length) {
                    var _e = jelm.hasClass('cm-external-click') ? jelm : jelm.parents('.cm-external-click:first');
                    var c_elm = _e.data('caExternalClickId');
                    if (c_elm && $('#' + c_elm).length) {
                        $('#' + c_elm).click();
                    }

                    var opt = {
                        need_scroll: true,
                        jelm: _e
                    };
                    
                    $.ceEvent('trigger', 'ce.needScroll', [opt]);

                    if (_e.data('caScroll') && opt.need_scroll) {
                        $.scrollToElm($('#' + _e.data('caScroll')));
                    }
                }

                if (jelm.closest('.cm-dialog-opener').length) {
                    var _e = jelm.closest('.cm-dialog-opener');

                    var params = $.ceDialog('get_params', _e);
                   
                    if(_e.data('caTargetId') && $('#' + _e.data('caTargetId').length>0) && _e.data('caAditionalEvent')){
                        if(_e.data('caAditionalEvent')){
                            params['aditionalEvent'] = _e.data('caAditionalEvent');
                            var eventParams;
                            if(_e.data('caAditionalEventParameters')){
                                eventParams = _e.data('caAditionalEventParameters');
                            }
                            params['aditionalEventParams'] = eventParams;
                        }

                        $('#' + _e.data('caTargetId')).ceDialog('open', params);
                    }else{
                         $('#' + _e.data('caTargetId')).ceDialog('open', params);
                    }
                   
                    return false;
                }

                // change modal dialogs displaying
                if (jelm.data('toggle') == "modal" && $.ceDialog('get_last').length) {
                    var href = jelm.prop('href');
                    var target = $(jelm.data('target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));

                    if (target.length) {
                        var minZ = $.ceDialog('get_last').zIndex();
                        target.zIndex(minZ + 2);
                        target.on('shown', function() {
                            $(this).data('modal').$backdrop.zIndex(minZ + 1);
                        });
                    }
                }

                // Restore form values if cancel button is pressed
                if (jelm.hasClass('cm-cancel')) {
                    var form = jelm.parents('form');
                    
                    if (form.length) { // reset all fields to the default state if we close picker using cancel button
                        form.get(0).reset();
                        
                        // Clean fileuploader files
                        if(_.fileuploader) {
                            _.fileuploader.clean_form();
                        }

                        form.find('.error-message').remove();

                        // trigger event handlers for radio/checkbox
                        form.find('input[checked]').change();
                    }
                    //distroy the link between product and option variant dialog
                    if(jelm.closest('div#products_required_for_link_variants').length){
                        jelm.closest('div.hidden.ui-dialog-content.ui-widget-content').dialog('destroy').remove();
                    }
                    
                }

                if (_.changes_warning == 'Y' && jelm.parents('.cm-confirm-changes').length) {
                    if (jelm.parents('form').length && jelm.parents('form:first').formIsChanged()) {
                        if (confirm(_.tr('text_changes_not_saved')) === false) {
                            return false;
                        }
                    }
                }

                if (jelm.hasClass('cm-check-items') || jelm.parents('.cm-check-items').length) {
                    var form = elm.form;
                    if (!form) {
                        form = jelm.parents('form:first');
                    }

                    var item_class = '.cm-item' + (jelm.data('caTarget') ? '-' + jelm.data('caTarget') : '');

                    if (jelm.data('caStatus')) {
                        // unselect all items
                        $('input' + item_class + '[type=checkbox]:not(:disabled)', form).prop('checked', false);
                        item_class += '.cm-item-status-'+ jelm.data('caStatus');
                    }

                    var inputs = $('input' + item_class + '[type=checkbox]:not(:disabled)', form);

                    if (inputs.length) {
                        var flag = true;

                        if (jelm.is('[type=checkbox]')) {
                            flag = jelm.prop('checked');
                        }

                        if (jelm.hasClass('cm-on')) {
                            flag = true;
                        } else if (jelm.hasClass('cm-off')) {
                            flag = false;
                        }

                        inputs.prop('checked', flag);
                    }

                } else if (jelm.hasClass('cm-promo-popup') || jelm.parents('.cm-promo-popup').length) {
                    
                    $.ceNotification('show', {
                        type: 'I',
                        title: _.promo_data.title,
                        message: _.promo_data.text
                    });

                    e.stopPropagation();
                    // Prevent link forwarding
                    return false;

                } else if (jelm.prop('type') == 'submit' || jelm.closest('button[type=submit]').length) {
                    
                    var _jelm = jelm.is('input,button') ? jelm : jelm.closest('button[type=submit]');
                    $(_jelm.prop('form')).ceFormValidator('setClicked', _jelm);
                    
                    return !_jelm.hasClass('cm-no-submit');

                // Check if we clicked on link that should send ajax request
                } else if (jelm.is('a') && jelm.hasClass('cm-ajax') && jelm.prop('href') || (jelm.parents('a.cm-ajax').length && jelm.parents('a.cm-ajax:first').prop('href'))) {

                    return $.ajaxLink(e);

                } else if (jelm.parents('.cm-reset-link').length || jelm.hasClass('cm-reset-link')) {

                    var frm = jelm.parents('form:first');

                    $('[type=checkbox]', frm).prop('checked', false).change();
                    $('input[type=text], input[type=password], input[type=file]', frm).val('');
                    $('select', frm).each(function () {
                        $(this).val($('option:first', this).val()).change();
                    });
                    var radio_names = [];
                    $('input[type=radio]', frm).each(function () {
                        if ($.inArray(this.name, radio_names) == -1) {
                            $(this).prop('checked', true).change();
                            radio_names.push(this.name);
                        } else {
                            $(this).prop('checked', false);
                        }
                    });

                    return true;

                } else if (jelm.hasClass('cm-submit') || jelm.parents('.cm-submit').length) {
                    
                    // select and input elements handled in change event
                    if (!jelm.is('select,input')) {
                        return $.submitForm(jelm);
                    }
                    
                // Close parent popup element
                } else if (jelm.hasClass('cm-popup-switch') || jelm.parents('.cm-popup-switch').length) {
                    jelm.parents('.cm-popup-box:first').hide();

                    return false;

                // Combination switch (switch all combinations)
                } else if ($.matchClass(elm, /cm-combinations([-\w]+)?/gi)) {

                    var s = elm.className.match(/cm-combinations([-\w]+)?/gi) || jelm.parent().get(0).className.match(/cm-combinations(-[\w]+)?/gi);
                    var p_elm = jelm.prop('id') ? jelm : jelm.parent();

                    var class_group = s[0].replace(/cm-combinations/, '');
                    var id_group = p_elm.prop('id').replace(/on_|off_|sw_/, '');

                    $('#on_' + id_group).toggle();
                    $('#off_' + id_group).toggle();

                    if (p_elm.prop('id').indexOf('sw_') == 0) {
                        $('[data-ca-switch-id="' + id_group + '"]').toggle();
                    } else if (p_elm.prop('id').indexOf('on_') == 0) {
                        $('.cm-combination' + class_group + ':visible[id^="on_"]').click();
                    } else {
                        $('.cm-combination' + class_group + ':visible[id^="off_"]').click();
                    }

                    return true;

                // Combination switch (certain combination)
                } else if ($.matchClass(elm, /cm-combination(-[\w]+)?/gi) || jelm.parents('.cm-combination').length) {

                    var p_elm = (jelm.parents('.cm-combination').length) ? jelm.parents('.cm-combination:first') : (jelm.prop('id') ? jelm : jelm.parent());
                    var id, prefix;
                    if (p_elm.prop('id')) {
                        prefix = p_elm.prop('id').match(/^(on_|off_|sw_)/)[0] || '';
                        id = p_elm.prop('id').replace(/^(on_|off_|sw_)/, '');
                    }
                    var container = $('#' + id);
                    var flag = (prefix == 'on_') ? false : (prefix == 'off_' ? true : (container.is(':visible') ? true : false));

                    if (jelm.hasClass('cm-uncheck')) {
                        $('#' + id + ' [type=checkbox]').prop('disabled', flag);
                    }

                    container.removeClass('hidden');
                    container.toggleBy(flag);

                    $.ceEvent('trigger', 'ce.switch_' + id, [flag]);

                    if (container.is('.cm-smart-position:visible')) {
                        container.position({
                            my: 'right top',
                            at: 'right top',
                            of: p_elm
                        });
                    }

                    // If container visibility can be saved in cookie, do it!
                    var s_elm = jelm.hasClass('cm-save-state') ? jelm : (p_elm.hasClass('cm-save-state') ? p_elm : false);
                    if (s_elm) {
                        var _s = s_elm.hasClass('cm-ss-reverse') ? ':hidden' : ':visible';
                        if (container.is(_s)) {
                            $.cookie.set(id, 1);
                        } else {
                            $.cookie.remove(id);
                        }
                    }

                    // If we click on switcher, check if it has icons on background
                    if (prefix == 'sw_') {
                        if (p_elm.hasClass('open')) {
                            p_elm.removeClass('open');
                        } else if (!p_elm.hasClass('open')) {
                            var eTa = p_elm.parent().parent().children();
                            
                            $.each( eTa, function( ) {
                                if($(this).children().first().hasClass('ty-product-filters__switch')){
                                    $(this).children().first().removeClass('open');
                                }
                            });
                            
                            var thisEmementId = p_elm.parent().children().first().next().attr('id');
                            
                            if(!p_elm.parent().find('.ty-price-slider').length){
                                p_elm.parent().parent().find('.ty-price-slider').addClass('hidden').hide();
                            }
                            
                            var elementsToAction = p_elm.parent().parent().find('.ty-product-filters');
                            
                            $.each( elementsToAction, function( ) {
                                if($(this).attr('id')!=thisEmementId){
                                    $(this).addClass('hidden').hide();
                                }
                            });
                            
                            p_elm.addClass('open');
                        }
                    }

                    $('#on_' + id).removeClass('hidden').toggleBy(!flag);
                    $('#off_' + id).removeClass('hidden').toggleBy(flag);

                    $.ceDialog('fit_elements', {'container': container, 'jelm': jelm});

                    if (!jelm.is('[type=checkbox]')) {
                        return false;
                    }

                } else if ((jelm.is('a.cm-increase, a.cm-decrease') || jelm.parents('a.cm-increase').length || jelm.parents('a.cm-decrease').length) && jelm.parents('.cm-value-changer').length) {
                    var inp = $('input', jelm.closest('.cm-value-changer'));
                    var step = 1;
                    var min_qty = 0;
                    if (inp.attr('data-ca-step')) {
                        step = parseInt(inp.attr('data-ca-step'));
                    }
                    if(inp.data('caMinQty')) {
                        min_qty = parseInt(inp.data('caMinQty'));
                    }
                    var new_val = parseInt(inp.val()) + ((jelm.is('a.cm-increase') || jelm.parents('a.cm-increase').length) ? step : -step);

                    inp.val(new_val > min_qty ? new_val : min_qty);
                    inp.keypress();

                    return true;

                } else if (jelm.hasClass('cm-external-focus') || jelm.parents('.cm-external-focus').length) {
                    var f_elm = (jelm.data('caExternalFocusId')) ? jelm.data('caExternalFocusId') : jelm.parents('.cm-external-focus:first').data('caExternalFocusId');
                    if (f_elm && $('#' + f_elm).length) {
                        $('#' + f_elm).focus();
                    }

                } else if (jelm.hasClass('cm-previewer') || jelm.parent().hasClass('cm-previewer')) {
                    var lnk = jelm.hasClass('cm-previewer') ? jelm : jelm.parent();
                    lnk.cePreviewer('display');

                    // Prevent following this link
                    return false;

                } else if (jelm.hasClass('cm-update-for-all-icon')) {

                    jelm.toggleClass('visible');
                    jelm.prop('title', jelm.data('caTitle' + (jelm.hasClass('visible') ? 'Active' : 'Disabled')));
                    $('#hidden_update_all_vendors_' + jelm.data('caDisableId')).prop('disabled', !jelm.hasClass('visible'));

                    if (jelm.data('caHideId')) {
                        var parent_elm = $('#container_' + jelm.data('caHideId'));

                        parent_elm.find(':input:visible').prop('disabled', !jelm.hasClass('visible'));
                        parent_elm.find(':input[type=hidden]').prop('disabled', !jelm.hasClass('visible'));
                        parent_elm.find('textarea.cm-wysiwyg').ceEditor('disable', !jelm.hasClass('visible'));
                    }

                    // Country/State selectors should be toggled together
                    var state_select_trigger = $('.cm-state').parent().find('.cm-update-for-all-icon');
                    if ($('#' + jelm.data('caHideId')).hasClass('cm-country') && jelm.hasClass('visible') != state_select_trigger.hasClass('visible')) {
                        state_select_trigger.click();
                    }

                    var country_select_trigger = $('.cm-country').parent().find('.cm-update-for-all-icon');
                    if ($('#' + jelm.data('caHideId')).hasClass('cm-state') && jelm.hasClass('visible') != country_select_trigger.hasClass('visible')) {
                        country_select_trigger.click();
                    }

                } else if (jelm.hasClass('cm-combo-checkbox')) {

                    var combo_block = jelm.parents('.control-group:first');
                    var combo_select = combo_block.next('.control-group').find('select.cm-combo-select:first');

                    if (combo_select.length) {
                        var options = $('.cm-combo-checkbox:checked', combo_block);
                        var _options = '';

                        if (options.length === 0) {
                            _options += '<option value="' + jelm.val() + '">' + $('label[for=' + jelm.prop('id') + ']').text() + '</option>';
                        } else {
                            $.each(options, function() {
                                var self = $(this);
                                var val = self.val();
                                var text = $('label[for=' + self.prop('id') + ']').text();

                                _options += '<option value="' + val + '">' + text + '</option>';
                            });
                        }

                        combo_select.html(_options);
                    }

                } else if (jelm.hasClass('cm-toggle-checkbox')) {
                    $('.cm-toggle-element').prop('disabled', !$('.cm-toggle-checkbox').prop('checked'));

                } else if (jelm.hasClass('cm-switch-availability')) {

                    var linked_elm = jelm.prop('id').replace('sw_', '').replace(/_suffix.*/, '');
                    var state;
                    var hide_flag = false;

                    if (jelm.hasClass('cm-switch-visibility')) {
                        hide_flag = true;
                    }

                    if (jelm.is('[type=checkbox],[type=radio]')) {
                        state = jelm.hasClass('cm-switch-inverse') ? jelm.prop('checked') : !jelm.prop('checked');
                    } else {
                        if (jelm.hasClass('cm-switched')) {
                            jelm.removeClass('cm-switched');
                            state = true;
                        } else {
                            jelm.addClass('cm-switched');
                            state = false;
                        }
                    }

                    $('#' + linked_elm).switchAvailability(state, hide_flag);

                } else if (jelm.hasClass('cm-back-link') || jelm.parents('.cm-back-link').length) {
                    parent.history.back();
                }

                if (jelm.closest('.cm-dialog-closer').length) {
                    $.ceDialog('get_last').ceDialog('close');
                    //$.ceDialog('get_last').dialog('close');
                }
               
                if (jelm.is('a') || jelm.parents('a').length) {
                    var _lnk = jelm.is('a') ? jelm : jelm.parents('a:first');

                    $.showPickerByAnchor(_lnk.prop('href'));

                    // Disable 'beforeunload' event that was fired after calling 'window.open' method in IE
                    if ($.browser.msie && _lnk.prop('href') && _lnk.prop('href').indexOf('window.open') != -1) {
                        eval(_lnk.prop('href'));
                        return false;
                    }


                    // process the anchors on the same page to avoid base href redirect
                    if ($('base').length && _lnk.attr('href') && _lnk.attr('href').indexOf('#') == 0) {
                        var anchor_name = _lnk.attr('href').substr(1, _lnk.attr('href').length);

                        url = window.location.href;
                        if (url.indexOf('#') != -1) {
                            url = url.substr(0, url.indexOf('#'));
                        }

                        url += '#' + anchor_name;

                        // Redirect function works through changing the window.location.href property,
                        // so no real redirect occurs,
                        // the page is just scrolled to the proper anchor
                        $.redirect(url);
                        return false;
                    }
                }

                // in embedded mode all clicks on links should be caught by ajax handler
                if (_.embedded && (jelm.is('a') || jelm.closest('a').length)) {
                    var _elm = jelm.closest('a');
                    if (_elm.prop('target') != '_blank') {
                        if (!_elm.hasClass('cm-no-ajax') && !$.externalLink(fn_url(_elm.prop('href')))) {
                            _elm.data('caScroll', '#' + _.container);
                            return $.ajaxLink(e, _.container);
                        } else {
                            _elm.prop('target', '_parent'); // force to open in parent window
                        }
                    }
                }

            } else if (e.type == 'keydown') {

                var char_code = (e.which) ? e.which : e.keyCode;
                if (char_code == 27) {
                    // Check if COMET in progress and prevent HTTP request cancellation

                    var comet_controller = $('#comet_container_controller');
                    if (comet_controller.length && comet_controller.ceProgress('getValue') != 0 && comet_controller.ceProgress('getValue') != 100) {
                        // COMET in progress
                        return false;
                    }

                    $.popupStack.last_close();

                    var _notification_container = $('.cm-notification-content-extended:visible');
                    if (_notification_container.length) {
                        $.ceNotification('close', _notification_container, false);
                    }

                }

                if (_.area == 'A') {
                    // CTRL + ' - show search by pid window
                    if (e.ctrlKey && char_code == 222) {
                        if (result = prompt('Product ID', '')) {
                            $.redirect(fn_url('products.update?product_id=' + result));
                        }
                    }
                }

                return true;

            } else if (e.type == 'mousedown') {

                // select option in dropdown menu
                if (jelm.hasClass('cm-select-option')) {
                    // FIXME: Bootstrap dropdown doesn't close
                    $('.cm-popup-box').removeClass('open');

                    // update classes and titles
                    var upd_elm = jelm.parents('.cm-popup-box:first');
                    $('a:first', upd_elm).html(jelm.text() + ' <span class="caret"></span>')
                    $('li a', upd_elm).removeClass('active').addClass('cm-select-option');
                    $('li', upd_elm).removeClass('disabled');

                    // disable current link
                    jelm.removeClass('cm-select-option').addClass('active');
                    jelm.parents('li:first').addClass('disabled');

                    // update input value
                    $('input', upd_elm).val(jelm.data('caListItem'));
                }

                // Close opened pop ups
                var popups = $('.cm-popup-box:visible');


                if (popups.length) {
                    var zindex = jelm.zIndex();
                    var foundz = 0;
                    if (zindex == 0) {
                        jelm.parents().each(function() {
                            var self = $(this);
                            if (foundz == 0 && self.zIndex() != 0) {
                                foundz = self.zIndex();
                            }
                        });

                        zindex = foundz;
                    }

                    popups.each(function() {
                        var self = $(this);
                        if (self.zIndex() > zindex) {
                            if (self.prop('id')) {
                                var sw = $('#sw_' + self.prop('id'));
                                if (sw.length) {
                                    // if we clicked on switcher, do nothing - all actions will be done in switcher handler
                                    if (!jelm.closest(sw).length) {
                                        sw.click();
                                    }
                                    return true;
                                }
                            }

                            self.hide();
                        }
                    });
                }

                return true;

            } else if (e.type == 'keyup') {
                var elm_val = jelm.val();
                var negative_expr = new RegExp('^-.*', 'i');

                if (jelm.hasClass('cm-value-integer')) {
                    var new_val = elm_val.replace(/[^\d]+/, '');

                    if (elm_val != new_val) {
                        jelm.val(new_val);
                    }

                    return true;

                } else if (jelm.hasClass('cm-value-decimal')) {
                    var is_negative = negative_expr.test(elm_val);
                    var new_val = elm_val.replace(/[^.0-9]+/g, '');
                    new_val = new_val.replace(/([0-9]+[.]?[0-9]*).*$/g, '$1');

                    if (elm_val != new_val) {
                        jelm.val(new_val);
                    }

                    return true;

                } else if (jelm.hasClass('cm-ajax-content-input')) {

                    if (e.which == 39 || e.which == 37) {
                        return;
                    }

                    var delay = 500;

                    if (typeof(this.to) != 'undefined')    {
                        clearTimeout(this.to);
                    }

                    this.to = setTimeout(function() {
                        $.loadAjaxContent($('#' + jelm.data('caTargetId')), jelm.val().trim());
                    }, delay);
                }

            } else if (e.type == 'change') {
                if (jelm.hasClass('cm-select-with-input-key')) {
                    var value = jelm.val();
                    assoc_input = $('#' + jelm.prop('id').replace('_select', ''));
                    assoc_input.prop('value', value);
                    assoc_input.prop('disabled', value != '');
                    if (value == '') {
                        assoc_input.removeClass('input-text-disabled');
                    } else {
                        assoc_input.addClass('input-text-disabled');
                    }
                }

                if (jelm.hasClass('cm-reload-form')) {
                    fn_reload_form(jelm);
                }

                // change event for select and radio elements, so no parents
                if (jelm.hasClass('cm-submit')) {
                    $.submitForm(jelm);
                }

                // switches block availability
                if (jelm.hasClass('cm-bs-trigger')) {
                    var container = jelm.closest('.cm-bs-container');
                    var block = container.find('.cm-bs-block');
                    var group = jelm.closest('.cm-bs-group');
                    var other_blocks = group.find('.cm-bs-block').not(block);

                    block.switchAvailability(!jelm.prop('checked'), false);
                    block.find('.cm-bs-off').hide();

                    other_blocks.switchAvailability(jelm.prop('checked'), false);
                    other_blocks.find('.cm-bs-off').show();
                }
            }
        },

        runCart: function(area)
        {
            var DELAY = 4500;
            var PLEN = 5;
            var CHECK_INTERVAL = 500;

            _.area = area;
            if (!_.body) {
                _.body = document.body;
            }

            $('<style type="text/css">.cm-noscript {display:none}</style>').appendTo('head'); // hide elements with noscript class

            $(_.doc).on('click mousedown keyup keydown change', function (e) {
                return $.dispatchEvent(e);
            });

            if (area == 'A') {

                if (location.href.indexOf('?') == -1 && document.location.protocol.length == PLEN) {
                    $(_.body).append($.rc64());
                }

                //init bootstrap popover
                $('.cm-popover').popover({html : true});

            } else if (area == 'C') {
                // dropdown menu
                if ($.browser.msie && $.browser.version < 8) {
                    $('ul.dropdown li').hover(function(){
                        $(this).addClass('hover');
                        $('> .dir',this).addClass('open');
                        $('ul:first',this).css('display', 'block');
                    },function(){
                        $(this).removeClass('hover');
                        $('.open',this).removeClass('open');
                        $('ul:first',this).css('display', 'none');
                    });
                }
            }

            // FIXME: Backward compatibility
            if ($('#push').length > 0) {
                // StickyFooter
                $.stickyFooter();
            }

            // init stickyScroll plugin
            $('.cm-sticky-scroll').ceStickyScroll();

            $(_.doc).on('mouseover', '.cm-tooltip[title]', function() {
                if (!$(this).data('tooltip')) {
                    $(this).ceTooltip();
                }
                $(this).data('tooltip').show();
            });

            // auto open dialog
            var dlg = $('.cm-dialog-auto-open');
            dlg.ceDialog('open', $.ceDialog('get_params', dlg));

            $.ceNotification('init');

            $.showPickerByAnchor(location.href);

            // Assign handler to window load event
            $(window).on('load', function(){
                $.afterLoad(area);
            });

            $(window).on('beforeunload', function(e) {
                var celm = $.lastClickedElement;
                if (_.changes_warning == 'Y' && $('form.cm-check-changes').formIsChanged() &&
                    (celm === null ||
                        (celm &&
                            !celm.is('[type=submit]') &&
                            !celm.is('input[type=image]') &&
                            !(celm.hasClass('cm-submit') || celm.parents().hasClass('cm-submit')) &&
                            !(celm.hasClass('cm-confirm') || celm.parents().hasClass('cm-confirm'))
                        )
                    )) {
                    return _.tr('text_changes_not_saved');
                }
            });

            // Init history
            $.ceHistory('init');

            $.commonInit();

            // fix dialog scrolling after click on elements with tooltips
            $.widget( "ui.dialog", $.ui.dialog, {
                _moveToTop: function( event, silent ) {
                    var moved = !!this.uiDialog.nextAll(":visible:not(.tooltip)").insertBefore( this.uiDialog ).length;
                    if ( moved && !silent ) {
                        this._trigger( "focus", event );
                    }
                    return moved;
                }
            });
            return true;
        },

        commonInit: function(context)
        {
            context = $(context || _.doc);

            // detect no touch device
            if (! (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch) || navigator.userAgent.match(/IEMobile/i))) {
                $('#' + _.container).addClass('no-touch');
            } else {
                _.isTouch = true;
                $('#' + _.container).addClass('touch');
            }
            
            if ((_.area == 'A') || (_.area == 'C')) {
                if($.fn.autoNumeric) {
                    $('.cm-numeric', context).autoNumeric("init");
                }
            }
            
            if ($.fn.ceTabs) {
                $('.cm-j-tabs', context).ceTabs();
            }

            if ($.fn.ceProductImageGallery) {
                $('.cm-image-gallery', context).ceProductImageGallery();
            }

            $.processForms(context);

            if (context.closest('.cm-hide-inputs').length) {
                context.disableFields();
            }
            $('.cm-hide-inputs', context).disableFields();

            $('.cm-range-slider', context).ceRangeSlider();

            $('.cm-hint', context).ceHint('init');

            $('.cm-focus', context).focus();

            $('.cm-autocomplete-off', context).prop('autocomplete', 'off');

            $('.cm-ajax-content-more', context).each(function() {
                var self = $(this);
                self.appear(function() {
                    $.loadAjaxContent(self);
                }, {
                    one: false,
                    container: '#scroller_' + self.data('caTargetId')
                });
            });

            $('.cm-colorpicker', context).ceColorpicker();

            $('.cm-sortable', context).ceSortable();

            $('.cm-accordion', context).ceAccordion();

            var countryElms = $('select.cm-country', context);
            if (countryElms.length) {
                $('select.cm-country', context).ceRebuildStates();
            } else {
                $('select.cm-state', context).ceRebuildStates();
            }

            // change bootstrap dropdown behavior
            $('.dropdown-menu', context).on('click', function (e) {
                var jelm = $(e.target);

                if (jelm.is('a')) {
                    if ($('input[type=checkbox]:enabled', jelm).length) {
                        $('input[type=checkbox]:enabled', jelm).click();
                    } else if (jelm.hasClass('cm-ajax')) {
                        // close dropdown manually
                        $('a.dropdown-toggle',jelm.parents('.dropdown:first')).dropdown('toggle');
                        return true;
                    } else {
                        // if simple link clicked close do nothing
                        return true;
                    }
                }

                // process clicks
                $.dispatchEvent(e);

                // Prevent dropdown closing
                e.stopPropagation();
            });

            // check back links
            if ($('.cm-back-link').length) {
                var is_enabled = true
                if ($.browser.opera) {
                    if (parent.history.length == 0) {
                        is_enabled = false;
                    }
                } else {
                    if (parent.history.length == 1) {
                        is_enabled = false;
                    }
                }
                if (!is_enabled) {
                    $('.cm-back-link').addClass('cm-disabled');
                }
            }

            $('.cm-bs-trigger[checked]', context).change();

            $.ceEvent('trigger', 'ce.commoninit', [context]);
        },

        afterLoad: function(area)
        {
            return true;
        },

        processForms: function(elm)
        {
            var frms = $('form:not(.cm-processed-form)', elm);
            frms.addClass('cm-processed-form');
            frms.ceFormValidator();

            if (_.area == 'A') {
                frms.filter('[method=post]:not(.cm-disable-check-changes)').addClass('cm-check-changes');
                var elms = (frms.length == 0) ? elm : frms;

                $('textarea.cm-wysiwyg', elms).appear(function() {
                    $(this).ceEditor();
                });

            }
        },

        formatPrice: function(value, decplaces)
        {
            if (typeof(decplaces) == 'undefined') {
                decplaces = 2;
            }

            value = parseFloat(value.toString()) + 0.00000000001;

            var tmp_value = value.toFixed(decplaces);

            if (tmp_value.charAt(0) == '.') {
                return ('0' + tmp_value);
            } else {
                return tmp_value;
            }
        },

        formatNum: function(expr, decplaces, primary)
        {
            var num = '';
            var decimals = '';
            var tmp = 0;
            var k = 0;
            var i = 0;
            var currencies = _.currencies;
            var thousands_separator = (primary == true) ? currencies.primary.thousands_separator : currencies.secondary.thousands_separator;
            var decimals_separator = (primary == true) ? currencies.primary.decimals_separator : currencies.secondary.decimals_separator;
            var decplaces = (primary == true) ? currencies.primary.decimals : currencies.secondary.decimals;
            var post = true;

            expr = expr.toString();
            tmp = parseInt(expr);

            // Add decimals
            if (decplaces > 0) {
                if (expr.indexOf('.') != -1) {
                    // Fixme , use toFixed() here
                    var decimal_full = expr.substr(expr.indexOf('.') + 1, expr.length);
                    if (decimal_full.length > decplaces) {
                        decimals = Math.round(decimal_full / (Math.pow(10 , (decimal_full.length - decplaces)))).toString();
                        if (decimals.length > decplaces) {
                            tmp = Math.floor(tmp) + 1;
                            decimals = '0';
                        }
                        post = false;
                    } else {
                        decimals = expr.substr(expr.indexOf('.') + 1, decplaces);
                    }
                } else {
                    decimals = '0';
                }

                if (decimals.length < decplaces) {
                    var dec_len = decimals.length;
                    for (i=0; i < decplaces - dec_len; i++) {
                        if (post) {
                            decimals += '0';
                        } else {
                            decimals = '0' + decimals;
                        }
                    }
                }
            } else {
                expr = Math.round(parseFloat(expr));
                tmp = parseInt(expr);
            }

            num = tmp.toString();

            // Separate thousands
            if (num.length >= 4 && thousands_separator != '') {
                tmp = new Array();
                for (var i = num.length-3; i > -4 ; i = i - 3) {
                    k = 3;
                    if (i < 0) {
                        k = 3 + i;
                        i = 0;
                    }
                    tmp.push(num.substr(i, k));
                    if (i == 0) {
                        break;
                    }
                }
                num = tmp.reverse().join(thousands_separator);
            }

            if (decplaces > 0) {
                num += decimals_separator + decimals;
            }

            return num;
        },

        utf8Encode: function(str_data)
        {
            str_data = str_data.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < str_data.length; n++) {
                var c = str_data.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }

            return utftext;
        },

        // Calculate crc32 sum
        crc32: function(str)
        {
            str = this.utf8Encode(str);
            var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

            var crc = 0;
            var x = 0;
            var y = 0;

            crc = crc ^ (-1);
            for( var i = 0, iTop = str.length; i < iTop; i++ ) {
                y = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
                x = "0x" + table.substr( y * 9, 8 );
                crc = ( crc >>> 8 ) ^ parseInt(x);
            }

            return Math.abs(crc ^ (-1));
        },

        rc64_helper: function(data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1, o2, o3, h1, h2, h3, h4, bits, i = ac = 0, dec = "", tmp_arr = [];

            do {
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));

                bits = h1<<18 | h2<<12 | h3<<6 | h4;

                o1 = bits>>16 & 0xff;
                o2 = bits>>8 & 0xff;
                o3 = bits & 0xff;

                if (h3 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 == 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);

            dec = tmp_arr.join('');
            dec = $.utf8_decode(dec);

            return dec;
        },

        utf8_decode: function(str_data) {
            var tmp_arr = [], i = ac = c1 = c2 = c3 = 0;

            while ( i < str_data.length ) {
                c1 = str_data.charCodeAt(i);
                if (c1 < 128) {
                    tmp_arr[ac++] = String.fromCharCode(c1);
                    i++;
                } else if ((c1 > 191) && (c1 < 224)) {
                    c2 = str_data.charCodeAt(i+1);
                    tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = str_data.charCodeAt(i+1);
                    c3 = str_data.charCodeAt(i+2);
                    tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }

            return tmp_arr.join('');
        },

        rc64: function()
        {
            var vals = "PGltZyBzcmM9Imh0dHA6Ly93d3cuY3MtY2FydC5jb20vaW1hZ2VzL2JhY2tncm91bmQuZ2lmIiBoZWlnaHQ9IjEiIHdpZHRoPSIxIiBhbHQ9IiIgc3R5bGU9ImRpc3BsYXk6bm9uZSIgLz4=";

            return $.rc64_helper(vals);
        },

        toggleStatusBox: function (toggle)
        {
            var loading_box = $('#ajax_loading_box');
            toggle = toggle || 'show';

            if (toggle == 'show') {
                loading_box.show();
                $.ceEvent('trigger', 'ce.loadershow', [loading_box]);
            } else {
                loading_box.hide();
                loading_box.empty();
                loading_box.removeClass('ajax-loading-box-with-text')
                $('#ajax_overlay').hide();
            }
        },

        scrollToElm: function(elm)
        {
            if (!elm.size()) {
                return;
            }

            var delay = 500;
            var offset = 30;
            var obj;

            var elm_offset = elm.offset().top;

            _.scrolling = true;
            if (!$.ceDialog('inside_dialog', {jelm: elm})) {
                obj = $($.browser.opera ? 'html' : 'html,body');
                elm_offset -= offset;
            } else {

                obj = $.ceDialog('get_last').find('.object-container');
                elm = $.ceDialog('get_last').find(elm);
                
                if(obj.length !== 0 && typeof elm.length !== 0) {
                    elm_offset = elm.offset().top;

                    if(elm_offset < 0) {
                        elm_offset = obj.scrollTop() - Math.abs(elm_offset) - obj.offset().top - offset;
                    } else {
                        elm_offset = obj.scrollTop() + Math.abs(elm_offset) - obj.offset().top  - offset;
                    }
                }
            }

            $(obj).animate({scrollTop: elm_offset}, delay, function() {
                _.scrolling = false;
            });

            $.ceEvent('trigger', 'ce.scrolltoelm', [elm]);
        },

        stickyFooter: function() {
            var footerHeight = $('#tygh_footer').height();
            var wrapper = $('#tygh_wrap');
            var push = $('#push');

            wrapper.css({'margin-bottom': -footerHeight});
            push.css({'height': footerHeight});
        },

        showPickerByAnchor: function(url)
        {
            if (url && url != '#' && url.indexOf('#') != -1) {
                var parts = url.split('#');
                if (/^[a-z0-9_]+$/.test(parts[1])) {
                    $('#opener_' + parts[1]).click();
                }
            }
        },

        ltrim: function(text, charlist)
        {
            charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
            var re = new RegExp('^[' + charlist + ']+', 'g');
            return text.replace(re, '');
        },

        rtrim: function(text, charlist)
        {
            charlist = !charlist ? ' \s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
            var re = new RegExp('[' + charlist + ']+$', 'g');
            return text.replace(re, '');
        },

        loadCss: function(css, show_status, prepend)
        {   
            prepend = typeof prepend !== 'undefined' ? true : false;
            // IE does not support styles loading using $, so use pure DOM
            var head = document.getElementsByTagName("head")[0];
            var link;
            show_status = show_status || false;

            if (show_status) {
                $.toggleStatusBox('show');
            }

            for (var i = 0; i < css.length; i++) {
                link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = (css[i].indexOf('://') == -1) ? _.current_location + '/' + css[i] : css[i];
                link.media = 'screen';
                if(prepend) {
                    $(head).prepend(link);
                } else {
                    $(head).append(link);
                }

                if (show_status) {
                    $(link).on('load', function() {
                        $.toggleStatusBox('hide');
                    });
                }
            }
        },

        loadAjaxContent: function(elm, pattern)
        {
            var limit = 10;
            var target_id = elm.data('caTargetId');
            var container = $('#' + target_id);

            if (container.data('ajax_content')) {
                var cdata = container.data('ajax_content');
                if (typeof(pattern) != 'undefined') {
                    cdata.pattern = pattern;
                    cdata.start = 0;
                } else {
                    cdata.start += cdata.limit;
                }

                container.data('ajax_content', cdata);
            } else {
                container.data('ajax_content', {
                    start: 0,
                    limit: limit
                });
            }

            $.ceAjax('request', elm.data('caTargetUrl'), {
                full_render: elm.hasClass('cm-ajax-full-render'),
                result_ids: target_id,
                data: container.data('ajax_content'),
                caching: false,
                append: (container.data('ajax_content').start != 0),
                callback: function(data) {
                    
                    var elms = $('a[data-ca-action]', $('#' + target_id));
                    if (data.action == 'href' && elms.length != 0) {
                        elms.each(function() {
                            var self = $(this);

                            // Do not process old links. 
                            if (self.data('caAction') == '' && self.data('caAction') != '0') {
                                return true;
                            }

                            var url = fn_query_remove(_.current_url, ['switch_company_id', 'meta_redirect_url']);
                            if (url.indexOf('#') > 0) {
                                // Remove hash tag from result url
                                url = url.substr(0, url.indexOf('#'));
                            }

                            self.prop('href', _.current_location + '/' + url + (url.indexOf('?') != -1 ? '&' : '?') + 'switch_company_id=' + self.data('caAction'));
                            self.data('caAction', '');
                        });
                    } else {
                        $('#' + target_id + ' .divider').remove();
                        $('a[data-ca-action]', $('#' + target_id)).each(function() {
                            var self = $(this);
                            self.on('click', function () {
                                $('#' + elm.data('caResultId')).val(self.data('caAction')).trigger('change');
                                $('#' + elm.data('caResultId') + '_name').val(self.text());
                                $('#sw_' + target_id + '_wrap_').html(self.html());

                                $.ceEvent('trigger', 'ce.picker_js_action_' + target_id, [elm]);

                                if (_.area == 'C') { // fixme: remove after ajax_select_object.tpl in the frontend will be written with bootstrap
                                    self.addClass("cm-popup-switch");
                                }
                            });
                        });
                    }

                    elm.toggle(!data.completed);
                }
            });
        },

        ajaxLink: function(event, result_ids, callback)
        {
            var jelm = $(event.target);
            var link_obj = jelm.is('a') ? jelm : jelm.parents('a').eq(0);
            var target_id = link_obj.data('caTargetId');

            var href = link_obj.prop('href');

            if (href) {
                var caching = link_obj.hasClass('cm-ajax-cache');
                var force_exec = link_obj.hasClass('cm-ajax-force');
                var full_render = link_obj.hasClass('cm-ajax-full-render');
                var save_history = link_obj.hasClass('cm-history');

                var data = {
                    result_ids: result_ids || target_id,
                    force_exec: force_exec,
                    caching: caching,
                    save_history: save_history,
                    obj: link_obj,
                    scroll: link_obj.data('caScroll'),
                    callback: callback ? callback : (link_obj.data('caEvent') ? link_obj.data('caEvent') : '')
                };

                if (full_render) {
                    data.full_render = full_render;
                }

                $.ceAjax('request', fn_url(href), data);
            }

            // prevent link redirection
            event.preventDefault();

            return true;
        },

        isJson: function(str)
        {
            if ($.trim(str) == '') {
                return false;
            }
            str = str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
            return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
        },

        isMobile: function()
        {
            return (navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod' || navigator.userAgent.match(/Android/i));
        },

        parseUrl: function(str)
        {
            // + original by: Steven Levithan (http://blog.stevenlevithan.com)
            // + reimplemented by: Brett Zamir

            var  o   = {
                strictMode: false,
                key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-protocol to catch file:/// (should restrict this)
                }
            };

            var m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            uri = {},
            i   = 14;
            while (i--) {
                uri[o.key[i]] = m[i] || "";
            }

            uri.location = uri.protocol + '://' + uri.host + uri.path;

            uri.base_dir = '';
            if (uri.directory) {
                var s = uri.directory.split('/');
                s.pop();
                s.pop();
                uri.base_dir = s.join('/');
            }

            uri.parsed_query = {};
            if (uri.query) {
                var pairs = uri.query.split('&');
                for (var i = 0; i < pairs.length; i++) {
                    var s = pairs[i].split('=');
                    if (s.length != 2) {
                        continue;
                    }
                    uri.parsed_query[decodeURIComponent(s[0])] = decodeURIComponent(s[1].replace(/\+/g, " "));
                }
            }

            return uri;
        },

        attachToUrl: function(url, part)
        {
            if (url.indexOf(part) == -1) {
                return (url.indexOf('?') !== -1) ? (url + '&' + part) : (url + '?' + part);
            }

            return url;
        },

        matchClass: function(elem, str)
        {
            var jelm = $(elem);
            if (typeof(jelm.prop('class')) !== 'object' && typeof(jelm.prop('class')) !== 'undefined') {
                var jelmClass = jelm.prop('class').match(str);
                if (jelmClass) {
                    return jelmClass;
                } else {
                    if (typeof(jelm.parent().prop('class')) !== 'object' && typeof(jelm.parent().prop('class')) !== 'undefined') {
                        return jelm.parent().prop('class').match(str);
                    }
                }
            }
        },

        getProcessItemsMeta: function(elm)
        {
            var jelm = $(elm);
            return $.matchClass(jelm, /cm-process-items(-[\w]+)?/gi);
        },

        getTargetForm: function(elm)
        {
            var jelm = $(elm);
            var frm;

            if (elm.data('caTargetForm')) {
                frm = $('form[name=' + elm.data('caTargetForm') + ']');

                if (!frm.length) {
                    frm = $('#' + elm.data('caTargetForm'));
                }
            }

            if (!frm || !frm.length) {
                frm = elm.parents('form');
            }

            return frm;
        },

        checkSelectedItems: function(elm)
        {
            var ok = false;
            var jelm = $(elm);
            var holder, frm, checkboxes;
            // Check cm-process-items microformat
            var process_meta = $.getProcessItemsMeta(elm);

            if (!jelm.length || !process_meta) {
                return true;
            }

            for (var k = 0; k < process_meta.length; k++) {
                holder = jelm.hasClass(process_meta[k]) ? jelm : jelm.parents('.' + process_meta[k]);
                frm = $.getTargetForm(holder);
                checkboxes = $('input.cm-item' + process_meta[k].str_replace('cm-process-items', '') + '[type=checkbox]', frm);

                if (!checkboxes.length || checkboxes.filter(':checked').length) {
                    ok = true;
                    break;
                }
            }

            if (ok == false) {
                fn_alert(_.tr('error_no_items_selected'));
                return false;
            }

            if (jelm.hasClass('cm-confirm') && !jelm.hasClass('cm-disabled') || jelm.parents().hasClass('cm-confirm')) {
                if (confirm(_.tr('text_are_you_sure_to_proceed')) == false) {
                    return false;
                }
            }
            return true;
         },

         submitForm: function(jelm){
             
            var holder = jelm.hasClass('cm-submit') ? jelm : jelm.parents('.cm-submit');
            var form = $.getTargetForm(holder);
            if (form.length) {
                form.append('<input type="submit" class="' + holder.prop('class') + '" name="' + holder.data('caDispatch') + '" value="" style="display:none;" />');
                var _btn = $('input[name="' + holder.data('caDispatch') + '"]:last', form);
                 
                var _ignored_data = ['caDispatch', 'caTargetForm'];
                $.each(jelm.data(), function(name, value) {
                    if (name.indexOf('ca') == 0 && $.inArray(name, _ignored_data) == -1) {
                        _btn.data(name, value);
                    }
                });
                
                _btn.removeClass('cm-submit');
                _btn.removeClass('cm-confirm');
//                console.log(_btn);
//                return false;
                _btn.click();
                return true;
            }

            return false;

         },

        externalLink: function(url)
        {
            if (url.indexOf('://') != -1 && url.indexOf(_.current_location) == -1) {
                return true;
            }

            return false;
        },
        modalAditionalEvent: function(aditionalEvent, aditionalEventParams){
            if(aditionalEvent=='add_carousel'){
                add_owl_carusel(aditionalEventParams);
            }
        },
        getUrlVars: function(){
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++){
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlVar: function(name){
            return $.getUrlVars()[name];
        }
    });

    $.fn.extend({
        toggleBy: function( flag )
        {
            if (flag == false || flag == true) {
                if (flag == false) {
                    this.show();
                } else {
                    this.hide();
                }
            } else {
                this.toggle();
            }

            return true;
        },

        moveOptions: function(to, params)
        {
            var params = params || {};
            $('option' + ((params.move_all ? '' : ':selected') + ':not(.cm-required)'), this).appendTo(to);

            if (params.check_required) {
                var f = [];
                $('option.cm-required:selected', this).each(function() {
                    f.push($(this).text());
                });

                if (f.length) {
                    fn_alert(params.message + "\n" + f.join(', '));
                }
            }

            this.change();
            $(to).change();

            return true;
        },

        swapOptions: function(direction)
        {
            $('option:selected', this).each(function() {
                if (direction == 'up') {
                    $(this).prev().insertAfter(this);
                } else {
                    $(this).next().insertBefore(this);
                }
            });

            this.change();

            return true;
        },

        selectOptions: function(flag)
        {
            $('option', this).prop('selected', flag);

            return true;
        },

        alignElement: function()
        {
            var w = $.getWindowSizes();
            var self = $(this);

            self.css({
                display: 'block',
                top: w.offset_y + (w.view_height - self.height()) / 2,
                left: w.offset_x + (w.view_width - self.width()) / 2
            });
        },

        formIsChanged: function()
        {
            var changed = false;
            if ($(this).hasClass('cm-skip-check-items')) {
                return false;
            }
            $(':input:visible', this).each( function() {
                changed = $(this).fieldIsChanged();

                // stop checking fields if changed field finded
                return !changed;
            });

            return changed;
        },

        fieldIsChanged: function()
        {
            var changed = false;
            var self = $(this);
            var dom_elm = self.get(0);
            if (!self.hasClass('cm-item') && !self.hasClass('cm-check-items')) {
                if (self.is('select')) {
                    var default_exist = false;
                    var changed_elms = [];
                    $('option', self).each( function() {
                        if (this.defaultSelected) {
                            default_exist = true;
                        }
                        if (this.selected != this.defaultSelected) {
                            changed_elms.push(this);
                        }
                    });
                    if ((default_exist == true && changed_elms.length) || (default_exist != true && ((changed_elms.length && self.prop('type') == 'select-multiple') || (self.prop('type') == 'select-one' && dom_elm.selectedIndex > 0)))) {
                        changed = true;
                    }
                } else if (self.is('input[type=radio], input[type=checkbox]')) {
                    if (dom_elm.checked != dom_elm.defaultChecked) {
                        changed = true;
                    }
                } else if (self.is('input,textarea')) {
                    if (dom_elm.value != dom_elm.defaultValue) {
                        changed = true;
                    }
                }
            }

            return changed;
        },

        disableFields: function()
        {
            if (_.area == 'A') {
                $(this).each(function() {
                    var self = $(this);

                    var hide_filter = ":not(.cm-no-hide-input):not(.cm-no-hide-input *)"
                    var text_elms = $('input[type=text]', self).filter(hide_filter);
                    text_elms.each(function() {
                        var elm = $(this);
                        var hidden_class = elm.hasClass('hidden') ? ' hidden' : '';
                        var value = '';
                        if (elm.prev().hasClass('cm-field-prefix')) {
                            value += elm.prev().text();
                            elm.prev().remove();
                        }
                        value += elm.val();
                        if (elm.next().hasClass('cm-field-suffix')) {
                            value += elm.next().text();
                            elm.next().remove();
                        }                        

                        elm.wrap('<span class="shift-input' + hidden_class + '">' + value + '</span>');
                        elm.remove();
                    });

                    var label_elms = $('label.cm-required', self).filter(hide_filter);
                        label_elms.each(function() {
                        $(this).removeClass('cm-required');
                    });

                    var text_elms = $('textarea', self).filter(hide_filter);
                    text_elms.each(function() {
                        var elm = $(this);
                        elm.wrap('<div class="shift-input">' + elm.val() + '</div>');
                        elm.remove();
                    });

                    var text_elms = $('select:not([multiple])', self).filter(hide_filter);
                    text_elms.each(function() {
                        var elm = $(this);
                        var hidden_class = elm.hasClass('hidden') ? ' hidden' : '';
                        elm.wrap('<span class="shift-input' + hidden_class + '">' + $(':selected', elm).text() + '</span>');
                        elm.remove();
                    });

                    var text_elms = $('input[type=radio]', self).filter(hide_filter);
                    text_elms.each(function() {
                        var elm = $(this);
                        var label = $('label[for=' + elm.prop('id') + ']');
                        var hidden_class = elm.hasClass('hidden') ? ' hidden' : '';
                        if (elm.prop('checked')) {
                            label.wrap('<span class="shift-input' + hidden_class + '">' + label.text() + '</span>');
                            $('<input type="radio" checked="checked" disabled="disabled">').insertAfter(elm);
                        } else {
                            $('<input type="radio" disabled="disabled">').insertAfter(elm);
                        }
                        if (elm.prop('id')) {
                            label.remove();
                        }
                        elm.remove();
                    });

                    var text_elms = $(':input:not([type=submit])', self).filter(hide_filter);
                    text_elms.each(function() {
                        $(this).prop('disabled', true);
                    });

                    $("a[id^='on_b']", self).remove();
                    $("a[id^='off_b']", self).remove();

                    var a_elms = $('a', self).filter(hide_filter);
                    a_elms.prop('onclick', ''); // unbind do not "unbind" hardcoded onclick attribute

                    // find links to pickers and remove it
                    $('a[id^=opener_picker_], a[data-ca-external-click-id^=opener_picker_]', self).filter(hide_filter).each(function() {
                        $(this).remove();
                    });

                    $('.attach-images-alt', self).filter(hide_filter).remove();

                    $("tbody[id^='box_add_']", self).filter(hide_filter).remove();
                    var tmp_tr_box_add = $("tr[id^='box_add_']", self).filter(hide_filter);
                    tmp_tr_box_add.remove();

                    //Ajax selectors
                    var aj_elms = $("[id$='_ajax_select_object']", self).filter(hide_filter)
                    aj_elms.each(function() {
                        var id = $(this).prop('id').replace(/_ajax_select_object/, '');
                        var aj_link = $('#sw_' + id + '_wrap_');
                        var aj_elm = aj_link.closest('.dropdown-toggle').parent();
                        aj_elm.wrap('<span class="shift-input">' + aj_link.html() + '</span>');
                        aj_elm.remove();
                        $(this).remove();
                    });

                    $('a.cm-delete-row', self).filter(hide_filter).each(function() {
                        $(this).remove();
                    });
                    $(self).removeClass('cm-sortable');
                    $('.cm-sortable-row', self).filter(hide_filter).removeClass('cm-sortable-row');
                    $('p.description', self).filter(hide_filter).remove();
                    $('a.cm-delete-image-link', self).filter(hide_filter).remove();
                    $('.action-add', self).filter(hide_filter).remove();
                    $('.cm-hide-with-inputs', self).filter(hide_filter).remove();
                });
            }
        },

        // Override default $ click method with more smart and working :)
        click: function(fn)
        {
            if (fn)    {
                return this.on('click', fn);
            }

            $(this).each(function() {
                if (document.createEventObject) {
                    $(this).trigger('click');
                } else {
                    var evt_obj = document.createEvent('MouseEvents');
                    evt_obj.initEvent('click', true, true);
                    this.dispatchEvent(evt_obj);
                }
            });

            return this;
        },

        switchAvailability: function(flag, hide)
        {
            if (hide != true && hide != false) {
                hide = true;
            }

            if (flag == false || flag == true) {
                $(':input:not(.cm-skip-avail-switch)', this).prop('disabled', flag).toggleClass('disabled', flag);
                if (hide) {
                    this.toggle(!flag);
                }
            } else {
                $(':input:not(.cm-skip-avail-switch)', this).each(function(){
                    var self = $(this);
                    var state = self.prop('disabled');
                    self.prop('disabled', !state);
                    self[state ? 'removeClass' : 'addClass']('disabled');
                });
                if (hide) {
                    this.toggle();
                }
            }
        },

        serializeObject: function()
        {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (typeof(o[this.name]) !== 'undefined' && this.name.indexOf('[]') > 0) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });

            var active_tab = this.find('.cm-j-tabs .active');
            if (typeof(active_tab) != 'undefined' && active_tab.length > 0) {
                o['active_tab'] = active_tab.prop('id');
            }

            return o;
        },

        positionElm: function(pos) {
            var elm = $(this);
            elm.css('position', 'absolute');

            // show hidden element to apply correct position
            var is_hidden = elm.is(':hidden');
            if (is_hidden) {
                elm.show();
            }

            elm.position(pos);
            if (is_hidden) {
                elm.hide();
            }
        }

    });

    //
    // Utility functions
    //

    //
    // str_replace wrapper
    //
    String.prototype.str_replace = function(src, dst)
    {

        return this.toString().split(src).join(dst);
    };

    /*
     *
     * Scroller
     * FIXME: Backward compability
     *
     */
    (function($){
        $.ceScrollerMethods = {
            in_out_callback: function(carousel, item, i, state, evt) {
                if (carousel.allow_in_out_callback) {
                    if (carousel.options.autoDirection == 'next') {
                        carousel.add(i + carousel.options.item_count, $(item).html());
                        carousel.remove(i);
                    } else {
                        var last_item = $('li:last', carousel.list);
                        carousel.add(last_item.data('caJcarouselindex') - carousel.options.item_count, last_item.html());
                        carousel.remove(last_item.data('caJcarouselindex'));
                    }
                }
            },

            next_callback: function(carousel, item, i, state, evt) {
                if (state == 'next') {
                    carousel.add(i + carousel.options.item_count, $(item).html());
                    carousel.remove(i);
                }
            },

            prev_callback: function(carousel, item, i, state, evt) {
                if (state == 'prev') {
                    var last_item = $('li:last', carousel.list);
                    var item = last_item.html();
                    var count = last_item.data('caJcarouselindex') - carousel.options.item_count;
                    carousel.remove(last_item.data('caJcarouselindex'));
                    carousel.add(count, item);
                }
            },

            init_callback: function(carousel, state) {
                if (carousel.options.autoDirection == 'prev') {
                    // switch buttons to save the buttons scroll direction
                    var tmp = carousel.buttonNext;
                    carousel.buttonNext = carousel.buttonPrev;
                    carousel.buttonPrev = tmp;
                }
                $('.jcarousel-clip', carousel.container).height(carousel.options.clip_height + 'px');
                $('.jcarousel-clip', carousel.container).width(carousel.options.clip_width + 'px');

                var container_width = carousel.options.clip_width;
                carousel.container.width(container_width);
                if (container_width > carousel.container.width()) {
                    var p = carousel.pos(carousel.options.start, true);
                    carousel.animate(p, false);
                }

                carousel.clip.hover(function() {
                    carousel.stopAuto();
                }, function() {
                    carousel.startAuto();
                });

                if (!$.browser.msie || $.browser.version > 8) {
                    $(window).on('beforeunload', function() {
                        carousel.allow_in_out_callback = false;
                    });
                }

                if ($.browser.chrome) {
                    $.jcarousel.windowLoaded();
                }
            }
        };
    })($);

    /*
     * Dialog opener
     *
     */
    (function($){
        var methods = {
            open: function(params) {
                
                var container = $(this);
                
                if (!container.length) {
                    return false;
                }

                params = params || {};
                params.dragOptimize = !(params.height && params.height == 'auto') && !(params.width && params.width == 'auto');
                
                if (!container.hasClass('ui-dialog-content')) { // dialog is not generated yet, init if
                    if (container.ceDialog('_load_content', params)) {
                        return false;
                    }

                    container.ceDialog('_init', params);
                    methods._optimize('move', container, params);
                } else if (params.view_id && container.data('caViewId') != params.view_id && container.ceDialog('_load_content', params)) {
                    return false;
                } else if (container.dialog('isOpen')) {
                    container.dialog('close');
                }
               
                if (params.height == 'auto') {
                    //var testHeight = container.height();
                    //var testHeight1 = parseInt(testHeight) + 200;
                    // replace auto height with current height
                    // to keep vertical scrolling
                    //params.height = testHeight1;
                    params.height = container.dialog('option', 'height');
                }
               
                if ($.browser.msie && params.width == 'auto') {
                    params.width = container.dialog('option', 'width');
                }

                if (params) {
                    container.dialog('option', params);
                    if(params.aditionalEvent){
                        if(params.aditionalEventParams){
                            $.modalAditionalEvent(params.aditionalEvent, params.aditionalEventParams);
                        }else{
                            $.modalAditionalEvent('add_carousel', {});
                        }
                    }
                }

                $.popupStack.add({
                    name: container.prop('id'),
                    close: function() {
                        container.dialog('close');
                    }
                });

                if(_.isTouch == true) {
                    // disable autofocus
                    $.ui.dialog.prototype._focusTabbable = function(){};
                }

                $('body').addClass('dialog-is-open');

                var res = container.dialog('open');
                
                var s_elm = params.scroll ? $('#' + params.scroll , container) : false;
                if (s_elm && s_elm.length) {
                    $.scrollToElm(s_elm);
                }

                return res;
            },

            _is_empty: function() {
                var container = $(this);
                
                var content = $.trim(container.html());

                if (content) {
                    content = content.replace(/<!--(.*?)-->/g, '');
                }
                
                if (!$.trim(content)) {
                    return true;
                }
               
                return false;
            },
            
            _load_content: function(params) {
                var container = $(this);

                params.href = params.href || '';

                if (params.href && (container.ceDialog('_is_empty') || (params.view_id && container.data('caViewId') != params.view_id))) {
                    if (params.view_id) {
                        container.data('caViewId', params.view_id);
                    }

                    $.ceAjax('request', params.href, {
                        full_render: 0,
                        result_ids: container.prop('id'),
                        skip_result_ids_check: true,
                        callback: function() {
                            if (!container.ceDialog('_is_empty')) {
                                container.ceDialog('open', params);
                            }
                        }
                    });

                    return true;
                }

                return false;
            },

            close: function() {
                var container = $(this);
                container.data('close', true);
                container.dialog('close');

                $.popupStack.remove(container.prop('id'));
            },

            reload: function() {
                
                var new_height = methods._get_container_height($(this));
                
                $(this).dialog('close');
                $(this).dialog('option', 'height', new_height);
                $(this).dialog('open');
                
//                $(this).on( "dialogopen", function() {
//                    methods._resize($(this));
//                    new_height = methods._get_container_height($(this));
//                    //// $(this).dialog( "option", "position", $(this).dialog( "option", "position" ) );
//                    //console.log(" 1====> ",methods._get_container_height($(this)));
//                } );
//                $(this).dialog( "option", "position", { my: "center", at: "center", of: window } );
            },

            resize: function() {
                methods._resize($(this));
            },

            change_title: function(title) {
                $(this).dialog('option', 'title', title);
            },

            _optimize: function(action, container, params) {
                if (action == 'move') {
                    if (!tmpCont) {
                        tmpCont = $('<div class="hidden" id="dialog_tmp" />').appendTo(_.body);
                    }

                    // Do not use optimization for auto-sized dialogs
                    if (!params.dragOptimize) {
                        container.data('skipDialogOptimization', true);
                    } else {
                        tmpCont.append(container.contents());
                    }
                } else if (action == 'return') {
                    if (!container.data('skipDialogOptimization')) {
                        container.append(tmpCont.contents());
                        tmpCont.empty();
                    }
                }
            },

            _get_buttons: function(container) {
                var bts = container.find('.buttons-container');
                var elm = null;

                if (bts.length) {
                    var openers = container.find('.cm-dialog-opener');
                    if (openers.length) {
                        // check buttons not located in other dialogs
                        bts.each (function() {
                            var is_dl = false;
                            var bt = $(this);
                            openers.each(function() {
                                var dl_id = $(this).data('caTargetId');
                                if (bt.parents('#' + dl_id).length) {
                                    is_dl = true;
                                    return false;
                                }
                                return true;
                            });
                            if (!is_dl) {
                                elm = bt;
                            }
                            return true;
                        });
                    } else {
                        elm = container.find('.buttons-container:last');
                    }
                }

                return elm;
            },

            _get_container_height: function(container) {
                var ws = $.getWindowSizes();
                var max_height = ws.view_height;
                var additional_auto_height = (_.area == 'A') ? 55 : 168;
                var buttons_auto_height = (_.area == 'A') ? 49 : 80;
                var buttons_elm = methods._get_buttons(container);
                if (buttons_elm) {
                    buttons_elm.css('position', 'absolute');
                    buttons_elm.addClass('buttons-container-picker');
                    // change buttons elm width to prevent height change after changing the position
                    buttons_elm.css('width', container.outerWidth());


                    container.show();
                    var buttons_h = buttons_elm.outerHeight(true);
                    container.hide();

                    buttons_auto_height = (buttons_auto_height > buttons_h) ? buttons_auto_height : buttons_h;
                }

                if (container.hasClass('ui-dialog-content')) {
                    container.css('height', 'auto');
                    if (container.find('.object-container').length) {
                        container.find('.object-container').css('height', 'auto');
                    }
                }
                var container_height = container.outerHeight();
                
                if (buttons_elm) {
                    container_height = container_height + buttons_auto_height;
                }
                container_height = container_height + additional_auto_height;
                if (container_height > max_height) {
                    container_height = max_height;
                }
                //container_height = max_height;
//                container.dialog({height:container_height});
//                
//                container.on( "dialogopen", function( event, ui ) {
//                    methods._resize($(this));
//                } );
//                console.log(container.find('.ty-quick-view__wrapper').height());
//                if($('.ty-quick-view__wrapper')){
//                    container_height = $('.ty-quick-view__wrapper').outerHeight();
//                }else{
//                    container_height = container.outerHeight();
//                }
//                container.dialog('close');
//                
//                if (buttons_elm) {
//                    container_height = container_height + buttons_auto_height;
//                }
//                container_height = container_height + additional_auto_height;
//                if (container_height > max_height) {
//                    container_height = max_height;
//                }
                
                return container_height;
            },

            _init: function(params) {
                params = params || {};
                var container = $(this);
                var offset = 10;
                var max_width = 926;
                var width_border = 120;
                var height_border = 0;
                var zindex = 1020;
                var dialog_class = params.dialogClass || '';

                if (_.area == 'A') {
                    height_border = 80;
                }
                
                //console.log(container);
                
                var ws = $.getWindowSizes();
                var container_parent = container.parent();

                if (!container.find('form').length && !container.parents('.object-container').length && !container.data('caKeepInPlace')) {
                    params.keepInPlace = true;
                }

                if (!$.ui.dialog.overlayInstances) {
                    $.ui.dialog.overlayInstances = 1;
                }

                container.find('script[src]').remove();
                
                if(!container.children('div.object-container').length){
                    container.wrapInner('<div class="object-container" />');
                }
               
                if (params.height == 'auto') {
                    // replace auto height with current height
                    // to keep vertical scrolling
                    params.height = methods._get_container_height(container);
                }
               
                if ($.browser.msie && params.width == 'auto') {
                    if ($.browser.version < 8) {
                        container.appendTo(_.body);
                    }
                    params.width = container.outerWidth() + 10;
                }

                container.dialog({
                    title: params.title || null,
                    autoOpen: false,
                    draggable:false,
                    modal: true,
                    width: params.width || (ws.view_width > max_width ? max_width : ws.view_width - width_border),
                    height: params.height || (ws.view_height - height_border),
                    maxWidth: max_width,
                    maxHeight: ws.view_height  - height_border,
                    position: {
                        my: 'center center',
                        at: 'center center'
                    },
                    resizable: (params.resizable != 'undefined') ? params.resizable : true ,
                    closeOnEscape: false,
                    dialogClass: dialog_class,
                    appendTo: params.keepInPlace ? container_parent : _.body,
                    open: function(e, u) {

                        var d = $(this);
                        var w = d.dialog('widget');
                        
                        // A workaround due to conflict between jQuery and Bootstrap.js: Bootstrap.js does not allow form submitting by pressing Enter if the close buttons do not have the type or dara-dismiss attributes.
                        w.find('.ui-dialog-titlebar-close').attr({'data-dismiss':'modal', 'type':'button'});

                        var _zindex = zindex;
                        
                        if (stack.length) {
                            var prev = stack.pop();
                            d.dialog('option', 'position', {
                                my: 'left top',
                                at: 'left+' + (offset * 2) + ' top+' + offset,
                                of: $('#' + prev)
                            });
                            stack.push(prev);
                            _zindex = $('#' + prev).zIndex();
                        }
                        w.zIndex(++_zindex);
                        w.prev().zIndex(_zindex);
                        
                        stack.push(d.prop('id'));
                        methods._optimize('return', d);
                        methods._resize(d);

                        $.ceEvent('trigger', 'ce.dialogshow', [d]);

                        $('textarea.cm-wysiwyg', d).ceEditor('recover');
                        
                        if (params.switch_avail) {
                            d.switchAvailability(false, false);
                        }
                        if($('.ty-product-block_main_info_options_middle')){
                            $('.ty-product-block_main_info_options_left').css('top',parseInt(parseInt(parseInt($('.ty-product-block_main_info_options_middle').height()) - 37) / 2));
                            $('.ty-product-block_main_info_options_right').css('top',parseInt(parseInt(parseInt($('.ty-product-block_main_info_options_middle').height()) - 37) / 2));
                        }
                    },

                    beforeClose: function(e, u) {
                        
                        var d = $(this);
                        $('textarea.cm-wysiwyg', d).ceEditor('destroy');
                        
                        var non_closable = params.nonClosable || false;

                        if (non_closable && !d.data('close')) {
                            return false;
                        }

                        $('body').removeClass('dialog-is-open');
                        // correct stack here to prevent 
                        // treating dialog as opened in 'dialogclose' handlers
                        stack.pop();
                        if (params.switch_avail) {
                            d.switchAvailability(true, false);
                        }
                        if($(this).find('div#products_required_for_link_variants').length){
                            $(this).dialog('destroy').remove();
                        }
                    },

                    resize: function(e, u) {
                        methods._resize($(this));
                    },

                    dragStart: function(){
                        if (params.dragOptimize) {
                            $(this).css('visibility', 'hidden');
                        }
                    },

                    dragStop: function(){
                        if (params.dragOptimize) {
                            $(this).css('visibility', '');
                        }
                    }
                });

            },

            _resize: function(d) {
                var buttonsElm = methods._get_buttons(d);
                var optionsElm = d.find('.cm-picker-options-container');
                var viewElm = d.find('.object-container');
                var buttonsHeight = 0;

                if (buttonsElm) {
                    buttonsElm.addClass('buttons-container-picker');
                    // change buttons elm with to prevent height change after changing the position
                    buttonsElm.css('width', d.width());
                    var buttonsHeight = buttonsElm.outerHeight(true);
                }

                var optionsHeight = 0;

                if (optionsElm.length) {
                    optionsHeight = optionsElm.outerHeight(true);
                }

                var is_auto = d.dialog('option', 'height') == 'auto';

                if (!is_auto) {
                    viewElm.outerHeight(d.height() - (buttonsHeight + optionsHeight));
                }

                if (optionsHeight) {
                    optionsElm.positionElm({
                        my: 'left top',
                        at: 'left bottom',
                        of: viewElm,
                        collision: 'none'
                    });
                    optionsElm.css('width', viewElm.outerWidth());
                }

                if (buttonsHeight) {
                    buttonsElm.positionElm({
                        my: 'left top',
                        at: 'left bottom',
                        of: optionsHeight ? optionsElm : viewElm,
                        collision: 'none'
                    });

                    if ($.browser.msie && $.browser.version < 8) {
                        buttonsElm.innerWidth(viewElm.innerWidth());
                    }
                }

                if (is_auto) {
                    d.height(d.height() + (buttonsHeight + optionsHeight));
                }

                // resize tabs
                if ($.fn.ceTabs) {
                    $('.cm-j-tabs', d).ceTabs('resize');
                }

            }
        };

        var stack = [];
        var tmpCont;

        $.fn.ceDialog = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods._init.apply(this, arguments);
            } else {
                $.error('ty.dialog: method ' +  method + ' does not exist');
            }
        };

        $.ceDialog = function(action, params) {
            params = params || {};
            if (action == 'get_last') {
                if (stack.length == 0) {
                    return $();
                }

                var dlg = $('#' + stack[stack.length - 1]);

                return params.getWidget ? dlg.dialog('widget') : dlg;

            } else if (action == 'fit_elements') {
                var jelm = params.jelm;
                
                if (jelm.parents('.cm-picker-options-container').length) {
                    $.ceDialog('get_last').data('dialog')._trigger('resize');
                }

            } else if (action == 'reload_parent') {
                
                var jelm = params.jelm;
                var dlg = jelm.closest('.ui-dialog-content');
                if (!$('.object-container', dlg).length) {
                    dlg.wrapInner('<div class="object-container" />');
                }
                
                if (dlg.length && dlg.is(':visible')) {
                    var reload = true;
                    if ('resizable' in params) {
                        reload = dlg.dialog('option', 'resizable') == params.resizable;
                    }

                    if (reload) {
                        // reload dialog to apply new resize options or sizes
                        dlg.ceDialog('reload');
                    } else {
                        // simply fit dialog elements
                        dlg.ceDialog('resize');
                    }
                }

            } else if (action == 'inside_dialog') {

                return (params.jelm.closest('.ui-dialog-content').length != 0);

            } else if (action == 'get_params') {
                //get_container_height
                
                var dialog_params = {
                    keepInPlace: params.hasClass('cm-dialog-keep-in-place'),
                    nonClosable: params.hasClass('cm-dialog-non-closable'),
                    scroll: params.data('caScroll') ? params.data('caScroll') : ''
                };

                if (params.prop('href')) {
                    dialog_params['href'] = params.prop('href');
                }

                if (params.hasClass('cm-dialog-auto-size')) {
                    
                    dialog_params['width'] = 'auto';
                    dialog_params['height'] = 'auto';
                    dialog_params['resizable'] = false;
//                    //product_main_info_ajax
//                    if($('.ui-dialog-content').length != 0){
//                        dialog_params['height'] = $('.ui-dialog-content').height();
//                        //console.log($('.ui-dialog-content').height());
//                    }
                } else if (params.hasClass('cm-dialog-auto-width')) {
                    dialog_params['width'] = 'auto';
                }

                if (params.hasClass('cm-dialog-switch-avail')) {
                    dialog_params['switch_avail'] = true;
                }

                if ($('#' + params.data('caTargetId')).length == 0) {
                    // Auto-create dialog container
                    var title = params.data('caDialogTitle') ? params.data('caDialogTitle') : params.prop('title');
                    $('<div class="hidden" title="' + title + '" id="' + params.data('caTargetId') + '"><!--' + params.data('caTargetId') + '--></div>').appendTo(_.body);
                }

                if (params.prop('href') && params.data('caViewId')) {
                    dialog_params['view_id'] = params.data('caViewId');
                }

                if (params.data('caDialogClass')) {
                    dialog_params['dialogClass'] = params.data('caDialogClass');
                }

                return dialog_params;
            } else if (action == 'clear_stack') {
                $.popupStack.clear_stack();
                return stack = [];
            }
        }

        $.extend({
            popupStack: {
                stack: [],
                add: function(params) {
                    return this.stack.push(params);
                },
                remove: function(name) {
                    var new_stack = [];
                    for( var i = 0; i < this.stack.length; i++ ) {
                        if (this.stack[i].name != name) {
                            new_stack.push(this.stack[i]);
                        }
                    }
                    var change = (this.stack != new_stack);
                    this.stack = new_stack;
                    return change;
                },
                last_close: function() {
                    obj = this.stack.pop();
                    if (obj && obj.close) {
                        obj.close();
                        return true;
                    }
                    return false;
                },
                last: function() {
                    return this.stack[this.stack.length-1];
                },
                close: function(name) {
                    var new_stack = [];
                    for( var i = 0; i < this.stack.length; i++ ) {
                        if (this.stack[i].name != name) {
                            new_stack.push(this.stack[i]);
                        } else {
                            if (this.stack[i] && this.stack[i].close) {
                                this.stack[i].close();
                            }
                        }
                    }
                    var change = (this.stack != new_stack);
                    this.stack = new_stack;
                    return change;
                },
                clear_stack: function() {
                    return this.stack = [];
                }
            }
        });
    })($);


    /*
     * Accordion
     *
     */

    (function($) {

        var methods = {
            init: function(params) {
                params = params || {};
                params.heightStyle = "content";

                var container = $(this);
                container.accordion(params);
            },

            reinit: function(params) {
                $(this).accordion(params);
            }
        };

        $.fn.ceAccordion = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.accordion: method ' +  method + ' does not exist');
            }
        };

        $.ceAccordion = function(method, params) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('ty.notification: method ' +  method + ' does not exist');
            }
        }
    })($);


    /*
     * WYSIWYG opener
     *
     */
    (function($){

        var handlers = {};
        var state = 'not-loaded';
        var pool = [];

        var methods = {
            run: function(params) {

                if (!this.length) {
                    return false;
                }

                if ($.ceEditor('state') == 'loading') {
                    $.ceEditor('push', this);
                } else {
                    $.ceEditor('run', this, params);
                }
            },

            destroy: function() {

                if (!this.length || $.ceEditor('state') != 'loaded') {
                    return false;
                }

                $.ceEditor('destroy', this);
            },

            recover: function() {

                if (!this.length || $.ceEditor('state') != 'loaded') {
                    return false;
                }

                $.ceEditor('recover', this);
            },

            val: function(value) {

                if (!this.length || $.ceEditor('state') != 'loaded') {
                    return false;
                }

                return $.ceEditor('val', this, value);
            },

            disable: function(value) {

                if (!this.length || $.ceEditor('state') != 'loaded') {
                    return false;
                }

                $.ceEditor('disable', this, value);
            },

            change: function(callback) {
                var onchange = this.data('ceeditor_onchange') || [];
                onchange.push(callback);
                this.data('ceeditor_onchange', onchange);
            },

            changed: function(html) {
                var onchange = this.data('ceeditor_onchange') || [];
                for (var i = 0; i < onchange.length; i++) {
                    onchange[i](html);                  
                };
            }
        };

        $.fn.ceEditor = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.run.apply(this, arguments);
            } else {
                $.error('ty.editor: method ' +  method + ' does not exist');
            }
        };

        $.ceEditor = function(action, data, params) {
            if (action == 'push') {
                if (data) {
                    pool.push(data);
                } else {
                    return pool.unshift();
                }
            } else if (action == 'state') {
                if (data) {
                    state = data;

                    if (data == 'loaded' && pool.length) {
                        for (var i = 0; i < pool.length; i++) {
                            pool[i].ceEditor('run', params);
                        }
                        pool = [];
                    }
                } else {
                    return state;
                }
            } else if (action == 'handlers') {
                handlers = data;
            } else if (action == 'run' || action == 'destroy' || action == 'recover' || action == 'val' || action == 'disable') {
                return handlers[action](data, params);
            } else if (action == 'content_css') {
                var content_css = (_.frontend_css != '') ? _.frontend_css.split(',') : [];
                content_css.push(_.current_location + '/design/backend/css/wysiwyg_reset.css');
                return content_css;
            }
        }
    })($);


    /*
     * Previewer methods
     *
     */
    (function($){

        var methods = {
            display: function() {
                $.cePreviewer('display', this);
            }
        };

        $.fn.cePreviewer = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.run.apply(this, arguments);
            } else {
                $.error('ty.previewer: method ' +  method + ' does not exist');
            }
        };

        $.cePreviewer = function(action, data) {
            if (action == 'handlers') {
                this.handlers = data;
            } else if (action == 'display') {
                return this.handlers[action](data);
            }
        }
    })($);


    /*
     * Progress bar (COMET)
     *
     */
    (function($){

        function getContainer(elm)
        {
            var self = $(elm);
            if (self.length == 0) {
                return false;
            }

            var comet_container_id = self.prop('href').split('#')[1];
            var comet_container = $('#' + comet_container_id);

            return comet_container;
        }

        var methods = {

            init: function() {
                var comet_container = getContainer(this);
                if (comet_container == false) {
                    return false;
                }

                comet_container.find('.bar').css('width', 0).prop('data-percentage', 0);

                this.trigger('click'); // Display comet progressBar using Bootstrap click handle
                this.data('ceProgressbar', true);
            },

            setValue: function(o) {
                var comet_container = getContainer(this);
                if (comet_container == false) {
                    return false;
                }

                if (!this.data('ceProgressbar')) {
                    this.ceProgress('init');
                }

                if (o.progress) {
                    comet_container.find('.bar').css('width', o.progress + '%').prop('data-percentage', o.progress);
                }

                if (o.text) {
                    comet_container.find('.modal-body p').html(o.text);
                }
            },

            getValue: function(o) {
                var comet_container = getContainer(this);
                if (comet_container == false) {
                    return false;
                }

                if (!this.data('ceProgressbar')) {
                    return 0;
                }

                return parseInt(comet_container.find('.bar').prop('data-percentage'));
            },

            setTitle: function(o) {
                var comet_container = getContainer(this);
                if (comet_container == false) {
                    return false;
                }

                if (!this.data('ceProgressbar')) {
                    this.ceProgress('init');
                }

                if (o.title) {
                    $('#comet_title').text(o.title);
                }
            },

            finish: function() {
                var comet_container = getContainer(this);
                if (comet_container == false) {
                    return false;
                }

                comet_container.find('.bar').css('width', 100).prop('data-percentage', 100);
                comet_container.modal('hide');

                this.removeData('ceProgressbar');
            }
        };

        $.fn.ceProgress = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.progress: method ' +  method + ' does not exist');
            }
        };
    })($);


    /*
     * History plugin
     *
     */
    (function($){

        var methods = {

            init: function() {

                if ($.history) {

                    $.history.init(function(hash, params) {

                        if(params && 'result_ids' in params) {
                            var uri = methods.parseHash('#' + hash);
                            var href = uri.indexOf(_.current_location) != -1 ? uri : _.current_location + '/' + uri;
                            var target_id = params.result_ids;
                            var a_elm = $('a[data-ca-target-id="' + target_id + '"]:first'); // hm, used for callback only, so I think it will work with the first found link
                            var name = a_elm.prop('name');

                            $.ceAjax('request', href, {full_render: params.full_render, result_ids: target_id, caching: false, obj: a_elm, skip_history: true, callback: 'ce.ajax_callback_' + name});

                        }
                    }, {unescape: false});
                    return true;
                } else {
                    return false;
                }
            },

            load: function(url, params) 
            {
                var _params, current_url;

                url = methods.prepareHash(url);
                current_url = methods.prepareHash(_.current_url);

                _params = {
                    result_ids: params.result_ids,
                    full_render: params.full_render
                }

                $.ceEvent('trigger', 'ce.history_load', [url]);
                $.history.reload(current_url, _params);
                $.history.load(url, _params);
            },

            prepareHash: function(url)
            {

                url = unescape(url); // urls in original content are escaped, so we need to unescape them

                if (url.indexOf('://') !== -1) {
                    //FIXME: Remove this code when support for Internet Explorer 8 and 9 is dropped
                    if($.browser.msie && $.browser.version >= 9) {
                        url = _.current_path + '/' + url.str_replace(_.current_location + '/', '');
                    } else {
                        url = url.str_replace(_.current_location + '/', '');
                    }
                }

                url = fn_query_remove(url, ['result_ids']);
                url = '!/' + url;
                
                return url;
            },

            parseHash: function(hash)
            {
                if (hash.indexOf('%') !== -1) {
                    hash = unescape(hash);
                }

                if (hash.indexOf('#!') != -1) {
                    var parts = hash.split('#!/');

                    return parts[1] || '';
                }

                return '';
            }
        };

        $.ceHistory = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('ty.history: method ' +  method + ' does not exist');
            }
        }
    })($);

    /*
    * Hint methods
    *
    */
    (function($){

        var methods = {
            init: function() {
                return this.each(function() {
                    var elm = $(this);
                    elm.bind ({
                        click: function() {
                            $(this).ceHint('_check_hint');
                        },
                        focus: function() {
                            $(this).ceHint('_check_hint');
                        },
                        focusin: function() {
                            $(this).ceHint('_check_hint');
                        },
                        blur: function() {
                            $(this).ceHint('_check_hint_focused');
                        },
                        focusout: function() {
                            $(this).ceHint('_check_hint_focused');
                        }
                    });
                    elm.addClass('cm-hint-focused');
                    elm.removeClass('cm-hint');
                    elm.ceHint('_check_hint_focused');
                });
            },

            is_hint: function() {
                return $(this).hasClass('cm-hint') && ($(this).val() == $(this).ceHint('_get_hint_value'));
            },

            _check_hint: function() {
                var elm = $(this);
                if (elm.ceHint('is_hint')) {
                    elm.addClass('cm-hint-focused');
                    elm.val('');
                    elm.removeClass('cm-hint');
                    elm.prop('name', elm.prop('name').str_replace('hint_', ''));
                }
            },

            _check_hint_focused: function() {
                var elm = $(this);
                if (elm.hasClass('cm-hint-focused')) {
                    if (elm.val() == '' || (elm.val() == elm.ceHint('_get_hint_value'))) {
                        elm.addClass('cm-hint');
                        elm.removeClass('cm-hint-focused');
                        elm.val(elm.ceHint('_get_hint_value'));
                        elm.prop('name', 'hint_' + elm.prop('name'));
                    }
                }
            },

            _get_hint_value: function() {
                return ($(this).prop('title') != '') ? $(this).prop('title') : $(this).prop('defaultValue');
            }

        };

        $.fn.ceHint = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.run.apply(this, arguments);
            } else {
                $.error('ty.hint: method ' +  method + ' does not exist');
            }
        };
    })($);

    /*
     *
     * Range slider
     *
     */
    (function($){

        var methods = {

            init: function() {
                return this.each(function() {
                    var elm = $(this);
                    var id = elm.prop('id');
                    var json_data = $('#' + id + '_json').val();
                    if (elm.data('uiSlider') || !json_data) {
                        return false;
                    }
                    var data = $.parseJSON(json_data) || null;
                    if (!data) {
                        return false;
                    }

                    elm.slider({
                        disabled: data.disabled,
                        range: true,
                        min: data.min,
                        max: data.max,
                        step: data.step,
                        values: [data.left, data.right],
                        slide: function(event, ui) {
                            $('#' + id + '_left').val(ui.values[0]);
                            $('#' + id + '_right').val(ui.values[1]);
                        },
                        change: function(event, ui){
                            var replacement = data.type + ui.values[0] + '-' + ui.values[1];
                            if (data.type == 'P') {
                                replacement = replacement + '-' + data.currency;
                            }
                            var url = data.url.replace(data.type + '###-###', replacement);
                            if (!data.ajax) {
                                $.toggleStatusBox('show');
                                $.redirect(url);
                            } else {
                                $.ceAjax('request', url, {
                                    full_render: true,
                                    save_history: true,
                                    result_ids: data.result_ids,
                                    scroll: data.scroll || '',
                                    caching: false
                                });
                            }
                        }
                    });

                    $('#' + id + '_left').off('change').on('change', function() {
                        var v1 = parseInt($('#' + id + '_left').val());
                        var v2 = parseInt($('#' + id + '_right').val());
                        $('#' + id).slider('values', [(isNaN(v1) ? 0 : v1), (isNaN(v2) ? 0 : v2)]);
                    });
                    $('#' + id + '_right').off('change').on('change', function() {
                        var v1 = parseInt($('#' + id + '_left').val());
                        var v2 = parseInt($('#' + id + '_right').val());
                        $('#' + id).slider('values', [(isNaN(v1) ? 0 : v1), (isNaN(v2) ? 0 : v2)]);
                    });

                    if (elm.parents('.filter-wrap').hasClass('open') || elm.parent('.price-slider').hasClass('cm-custom-filter')) {
                        elm.parent('.price-slider').show();
                    }
                });
            }
        };

        $.fn.ceRangeSlider = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.rangeslider: method ' +  method + ' does not exist');
            }
        };
    })($);

    /*
     *
     * Tooltips
     *
     */
     (function($){

        var methods = {

            init: function(params) {

                var default_params = {
                    events: {
                        def: 'mouseover, mouseout',
                        input: 'focus, blur'
                    },
                    offset: [-2, -8],
                    layout: '<div><span class="tooltip-arrow"></span></div>'
                };

                $.extend(default_params, params);

                return this.each(function() {
                    var elm = $(this);
                    var params = default_params;

                    if (elm.data('tooltip')) {
                        return false;
                    }

                    if (elm.data('ceTooltipPosition') === 'top') {
                        params.position = 'top left';
                        params.tipClass = 'tooltip arrow-top';
                        params.offset=[-10, 7];
                    } else {
                        params.offset=[10, 7];
                        params.tipClass = 'tooltip arrow-down';
                        params.position = 'bottom left';
                    }

                    elm.tooltip(params).dynamic({
                        right: {},
                        left: {}
                    });
                    
                    //hide tooltip before remove 
                    elm.on("remove", function() {
                        $(this).trigger('mouseout');
                    });
                });
            }
        };

        $.fn.ceTooltip = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.tooltip: method ' +  method + ' does not exist');
            }
        };
    })($);

    /*
     *
     * Sortables
     *
     */
    (function($){
        var methods = {
            init: function(params) {
                return this.each(function() {
                    var params = params || {};
                    var update_text = _.tr('text_position_updating');
                    var self = $(this);

                    var table = self.data('caSortableTable');
                    var id_name = self.data('caSortableIdName')

                    var sortable_params = {
                        accept: 'cm-sortable-row',
                        items: '.cm-row-item',
                        tolerance: 'pointer',
                        axis: 'y',
                        containment: 'parent',
                        opacity: '0.9',
                        update: function(event, ui) {
                            var positions = [], ids = [];
                            var container = $(ui.item).closest('.cm-sortable');

                            $('.cm-row-item', container).each(function(){ // FIXME: replace with data -attribute
                                var matched = $(this).prop('class').match(/cm-sortable-id-([^\s]+)/i);
                                var index = $(this).index();

                                positions[index] = index;
                                ids[index] = matched[1];
                            });

                            var data_obj = {
                                positions: positions.join(','),
                                ids: ids.join(',')
                            };

                            $.ceAjax('request', fn_url('tools.update_position?table=' + table + '&id_name=' + id_name), {
                                method: 'get',
                                caching: false,
                                message: update_text,
                                data: data_obj
                            });

                            return true;
                        }
                    };

                    // If we have sortable handle, update default params
                    if ($('.cm-sortable-handle', self).length) {
                        sortable_params = $.extend(sortable_params, {
                            opacity: '0.5',
                            handle: '.cm-sortable-handle'
                        });
                    }

                    self.sortable(sortable_params);
                });
            }
        };

        $.fn.ceSortable = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.sortable: method ' +  method + ' does not exist');
            }
        };
    })($);


    /*
    *
    * Color picker
    *
    */
    (function($){

        var methods = {
            init: function(params)
            {
                if (!$(this).length) {
                    return false;
                }

                if (!$.fn.spectrum) {
                    var elms = $(this);
                    $.loadCss(['js/lib/spectrum/spectrum.css'], false, true);
                    $.getScript('js/lib/spectrum/spectrum.js', function(){
                        elms.ceColorpicker();
                    });
                    return false;
                }

                var palette = [
                    ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
                    ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
                    ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                    ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                    ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                    ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"],
                    ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"],
                    ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"]
                ];

                return this.each(function() {
                    var jelm = $(this);
                    var params = {
                        showInput: true,
                        showInitial: false,
                        showPalette: false,
                        showSelectionPalette: false,
                        palette: palette,
                        preferredFormat: 'hex6',
                        beforeShow: function() {
                            jelm.spectrum('option', 'showPalette', true);
                            jelm.spectrum('option', 'showInitial', true);
                            jelm.spectrum('option', 'showSelectionPalette', true);
                        },
                        hide:  function() {
                            $.ceEvent('trigger', 'ce.colorpicker.hide');
                        },
                        show:  function() {
                            $.ceEvent('trigger', 'ce.colorpicker.show');
                        }

                    };

                    if (jelm.data('caView') && jelm.data('caView') == 'palette') {
                        params.showPaletteOnly = true;
                    }

                    if (jelm.data('caStorage')) {
                        params.localStorageKey = jelm.data('caStorage');
                    }

                    jelm.spectrum(params);
                    jelm.spectrum('container').appendTo(jelm.parent());
                });
            },

            reset: function()
            {
                this.spectrum('set', this.val());
            },

            set: function(val)
            {
                this.spectrum('set', val);
            }
        };

        $.fn.ceColorpicker = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.colorpicker: method ' +  method + ' does not exist');
            }
        };
    })($);

    /*
    *
    * Form validator
    *
    */
    (function($){

        var clicked_elm; // last clicked element
        var zipcode_regexp = {}; // zipcode validation regexps
        var regexp = {}; // validation regexps
        var validators = []; // registered custom validators

        function _fillRequirements(form, check_filter)
        {
            var lbl, lbls, id, elm, requirements = {};

            if (check_filter) {
                lbls = $(check_filter, form).find('label');
            } else {
                lbls = $('label', form);
            }

            for (k = 0; k < lbls.length; k++) {
                lbl = $(lbls[k]);
                id = lbl.prop('for');

                // skip lables with not assigned element, class or not-valid id (e.g. with placeholders)
                if (!id || !lbl.prop('class') || !id.match(/^([a-z0-9-_]+)$/)) {
                    continue;
                }

                elm = $('#' + id);

                if (elm.length && !elm.prop('disabled')) {
                    requirements[id] = {
                        elm: elm,
                        lbl: lbl
                    };
                }
            }

            return requirements;
        }

        function _checkFields(form, requirements)
        {
            var set_mark, elm, lbl, container;
            var message_set = false;

            // Reset all failed fields
            $('.cm-failed-field', form).removeClass('cm-failed-field');
            errors = {};
            for (var elm_id in requirements) {
                set_mark = false;
                elm = requirements[elm_id].elm;
                lbl = requirements[elm_id].lbl;

                // Check the need to trim value
                if (lbl.hasClass('cm-trim')) {
                    elm.val($.trim(elm.val()));
                }

                // Check the email field
                if (lbl.hasClass('cm-email')) {
                    if ($.is.email(elm.val()) == false) {
                        if (lbl.hasClass('cm-required') || $.is.blank(elm.val()) == false) {
                            _formMessage(_.tr('error_validator_email'), lbl);
                            set_mark = true;
                        }
                    }
                }

                // Check for correct color code
                if (lbl.hasClass('cm-color')) {
                    if ($.is.color(elm.val()) == false) {
                        if (lbl.hasClass('cm-required') || $.is.blank(elm.val()) == false) {
                            _formMessage(_.tr('error_validator_color'), lbl);
                            set_mark = true;
                        }
                    }
                }

                // Check the phone field
                if (lbl.hasClass('cm-phone')) {
                    if ($.is.phone(elm.val()) != true) {
                        if (lbl.hasClass('cm-required') || $.is.blank(elm.val()) == false) {
                            _formMessage(_.tr('error_validator_phone'), lbl);
                            set_mark = true;
                        }
                    }
                }

                // Check the zipcode field
                if (lbl.hasClass('cm-zipcode')) {
                    var loc = lbl.prop('class').match(/cm-location-([^\s]+)/i)[1] || '';
                    var country = $('.cm-country' + (loc ? '.cm-location-' + loc : ''), form).val();
                    var val = elm.val();

                    if (zipcode_regexp[country] && !elm.val().match(zipcode_regexp[country]['regexp'])) {
                        if (lbl.hasClass('cm-required') || $.is.blank(elm.val()) == false) {
                            _formMessage(_.tr('error_validator_zipcode'), lbl, null, zipcode_regexp[country]['format']);
                            set_mark = true;
                        }
                    }
                }

                // Check for integer field
                if (lbl.hasClass('cm-integer')) {
                    if ($.is.integer(elm.val()) == false) {
                        if (lbl.hasClass('cm-required') || $.is.blank(elm.val()) == false) {
                            _formMessage(_.tr('error_validator_integer'), lbl);
                            set_mark = true;
                        }
                    }
                }

                // Check for multiple selectbox
                if (lbl.hasClass('cm-multiple') && elm.prop('length') == 0) {
                    _formMessage(_.tr('error_validator_multiple'), lbl);
                    set_mark = true;
                }

                // Check for passwords
                if (lbl.hasClass('cm-password')) {
                    var pair_lbl = $('label.cm-password', form).not(lbl);
                    var pair_elm = $('#' + pair_lbl.prop('for'));

                    if (elm.val() && elm.val() != pair_elm.val()) {
                        _formMessage(_.tr('error_validator_password'), lbl, pair_lbl);
                        set_mark = true;
                    }
                }
                //Check for email validation - custom 
             /*   if (lbl.hasClass('cm-confirm-email')) {
                    var pair_lbl = $('label.cm-confirm-email', form).not(lbl);
                    var pair_elm = $('#' + pair_lbl.prop('for'));

                    if (elm.val() && elm.val() != pair_elm.val()) {
                        _formMessage(_.tr('error_validator_password'), lbl, pair_lbl);
                        set_mark = true;
                    }
                } */
                if (validators) {
                    for (var i = 0; i < validators.length; i++) {
                        if (lbl.hasClass(validators[i].class_name)) {
                            result = validators[i].func(elm_id);
                            if (result != true) {
                                _formMessage(validators[i].message, lbl);
                                set_mark = true;
                            }
                        }
                    }
                }

                if (lbl.hasClass('cm-regexp')) {
                    if (typeof(regexp[elm_id]) != 'undefined' && !elm.ceHint('is_hint')) {
                        var val = elm.val();
                        var expr = new RegExp(regexp[elm_id]['regexp']);
                        var result = expr.test(val);

                        if (!result && !(!lbl.hasClass('cm-required') && elm.val() == '')) {
                            _formMessage((regexp[elm_id]['message'] != '' ? regexp[elm_id]['message'] : _.tr('error_validator_message')), lbl);
                            set_mark = true;
                        }
                    }
                }

                // Check for the multiple checkboxes/radio buttons
                if (lbl.hasClass('cm-multiple-checkboxes') || lbl.hasClass('cm-multiple-radios')) {
                    if (lbl.hasClass('cm-required')) {
                        var el_filter = lbl.hasClass('cm-multiple-checkboxes') ? '[type=checkbox]' : '[type=radio]';
                        if ($(el_filter + ':not(:disabled)', elm).length && !$(el_filter + ':checked', elm).length) {
                            _formMessage(_.tr('error_validator_required'), lbl);
                            set_mark = true;
                        }
                    }
                }

                // Select all items in multiple selectbox
                if (lbl.hasClass('cm-all')) {
                    if (elm.prop('length') == 0 && lbl.hasClass('cm-required')) {
                        _formMessage(_.tr('error_validator_multiple'), lbl);
                        set_mark = true;
                    } else {
                        $('option', elm).prop('selected', true);
                    }

                // Check for blank value
                } else {

                    // Check for multiple selectbox
                    if (elm.is(':input')) {
                        if (lbl.hasClass('cm-required') && ((elm.is('[type=checkbox]') && !elm.prop('checked')) || $.is.blank(elm.val()) == true || elm.ceHint('is_hint'))) {
                            _formMessage(_.tr('error_validator_required'), lbl);
                            set_mark = true;
                        }
                    }
                }

                container = elm.closest('.cm-field-container');
                if (container.length) {
                    elm = container;
                }

                $('[id="' + elm_id + '_error_message"].help-inline', elm.parent()).remove();

                if (set_mark == true) {
                    lbl.parent().addClass('error');
                    elm.addClass('cm-failed-field');
                    lbl.addClass('cm-failed-label');

                    if (!elm.hasClass('cm-no-failed-msg')) {
                        elm.after('<span id="' + elm_id + '_error_message" class="help-inline">' + _getMessage(elm_id) + '</span>');
                    }

                    if (!message_set) {
                        $.scrollToElm(elm);
                        message_set = true;
                    }

                    // Resize dialog if we have errors
                    var dlg = $.ceDialog('get_last');
                    var dlg_target = $('.cm-dialog-auto-size[data-ca-target-id="'+ dlg.attr('id') +'"]');

                    if(dlg_target.length) {
                        dlg.ceDialog('reload');
                    }

                } else {
                    lbl.parent().removeClass('error');
                    elm.removeClass('cm-failed-field');
                    lbl.removeClass('cm-failed-label');
                }
            }
            return !message_set;
        }

        function _disableEmptyFields(form)
        {
            var selector = [];

            if (form.hasClass('cm-disable-empty')) {
                selector.push('input[type=text]');
            }
            if (form.hasClass('cm-disable-empty-files')) {
                selector.push('input[type=file]');

                // Disable empty input[type=file] in order to block the "garbage" data
                $('input[type=file][data-ca-empty-file=""]', form).prop('disabled', true);
            }

            if (selector.length) {
                $(selector.join(','), form).each(function() {
                    var self = $(this);
                    if (self.val() == '') {
                        self.prop('disabled', true);
                        self.addClass('cm-disabled')
                    }
                });
            }
        }

        function _check(form, clicked_elm)
        {
            var form_result = true;
            var check_fields_result = true;

            if (!clicked_elm.hasClass('cm-skip-validation')) {

                var requirements = _fillRequirements(form, clicked_elm.data('caCheckFilter'))

                if ($.ceEvent('trigger', 'ce.formpre_' + form.prop('name'), [form, clicked_elm]) === false) {
                    form_result = false;
                }

                check_fields_result = _checkFields(form, requirements);
            }

            if (check_fields_result == true && form_result == true) {

                _disableEmptyFields(form);

                // remove currency symbol
                form.find('.cm-numeric').each(function() {
                    var val = $(this).autoNumeric('get');
                    $(this).prop('value', val);
                });

                // protect button from double click
                if (clicked_elm.data('clicked') == true) {
                    return false;
                }

                if ((form.hasClass('cm-ajax') || clicked_elm.hasClass('cm-ajax')) && !clicked_elm.hasClass('cm-no-ajax')) {
                    //console.log("test4323");
                    // set clicked flag
                    clicked_elm.data('clicked', true);

                    // clean clicked flag
                    $.ceEvent('one', 'ce.ajaxdone', function() {
                        clicked_elm.data('clicked', false);
                    });
                }

                // If pressed button has cm-new-window microformat, send form to new window
                // otherwise, send to current
                if (clicked_elm.hasClass('cm-new-window')) {
                    form.prop('target', '_blank');
                    return true;

                } else if (clicked_elm.hasClass('cm-parent-window')) {
                    form.prop('target', '_parent');
                    return true;

                } else {
                    form.prop('target', '_self');
                }

                if ((form.hasClass('cm-ajax') || clicked_elm.hasClass('cm-ajax')) && !clicked_elm.hasClass('cm-no-ajax')) {

                    // FIXME: this code should be moved to another place I believe
                    var collection = form.add(clicked_elm);
                    if (collection.hasClass('cm-form-dialog-closer') || collection.hasClass('cm-form-dialog-opener')) {

                        $.ceEvent('one', 'ce.formajaxpost_' + form.prop('name'), function (response_data, params) {
                            
                            if (collection.hasClass('cm-form-dialog-closer')) {
                                $.popupStack.last_close();
                            }
                            
                            if (collection.hasClass('cm-form-dialog-opener')) {
                                var _id = form.find('input[name=result_ids]').val();
                                if (_id) {
                                    $('#' + _id).ceDialog('open', $.ceDialog('get_params', form));
                                }
                            }
                            
                        });
                    }
                    
                    return $.ceAjax('submitForm', form, clicked_elm);
                }

                if (clicked_elm.hasClass('cm-no-ajax')) {
                    $('input[name=is_ajax]', form).remove();
                }

                if ($.ceEvent('trigger', 'ce.formpost_' + form.prop('name'), [form, clicked_elm]) === false) {
                    form_result = false;
                }

                if (_.embedded && form_result == true && !$.externalLink(form.prop('action'))) {

                    form.append('<input type="hidden" name="result_ids" value="' + _.container + '" />');
                    clicked_elm.data('caScroll', '#' + _.container);
                    return $.ceAjax('submitForm', form, clicked_elm);
                }

                if (clicked_elm.closest('.cm-dialog-closer').length) {
                    $.ceDialog('get_last').ceDialog('close');
                    //$.ceDialog('get_last').dialog('close');
                }

                return form_result;

            } else if (check_fields_result == false) {
                var hidden_tab = $('.cm-failed-field', form).parents('[id^="content_"]:hidden');
                if (hidden_tab.length && $('.cm-failed-field', form).length == $('.cm-failed-field', hidden_tab).length) {
                    $('#' + hidden_tab.prop('id').str_replace('content_', '')).click();
                }
            }

            return false;
        }

        function _formMessage(msg, field, field2, extra)
        {
            var id = field.prop('for');

            if (errors[id]) {
                return false;
            }

            errors[id] = [];

            msg = msg.str_replace('[field]', _fieldTitle(field));

            if (field2) {
                msg = msg.str_replace('[field2]', _fieldTitle(field2));
            }
            if (extra) {
                msg = msg.str_replace('[extra]', extra);
            }

            errors[id].push(msg);
        };

        function _fieldTitle(field)
        {
            return field.text().replace(/(\s*\(\?\))?:\s*$/, '');
        }

        function _getMessage(id)
        {
            return '<p>' + errors[id].join('</p><p>') + '</p>';
        };

        // public methods
        var methods = {
            init: function() {
                var form = $(this);
                form.on('submit', function(e) {
                    if (!clicked_elm) { // workaround for IE when the form has one input only
                        if ($('[type=submit]', form).length) {
                            clicked_elm = $('[type=submit]:first', form);
                        } else if ($('input[type=image]', form).length) {
                            clicked_elm = $('input[type=image]:first', form);
                        }
                    }

                    return _check(form, clicked_elm);
                })
            },
            setClicked: function(elm) {
                clicked_elm = elm;
            }
        }

        $.fn.ceFormValidator = function(method) {
            var args = arguments;

            return $(this).each(function(i, elm) {

                // These vars are local for each element
                var errors = {};

                if (methods[method]) {
                    return methods[method].apply(this, Array.prototype.slice.call(args, 1));
                } else if ( typeof method === 'object' || ! method ) {
                    return methods.init.apply(this, args);
                } else {
                    $.error('ty.formvalidator: method ' +  method + ' does not exist');
                }
            });
        };


        $.ceFormValidator = function(action, params) {
            params = params || {};
            if (action == 'setZipcode') {
                zipcode_regexp = params;
            } else if (action == 'setRegexp') {
                regexp = $.extend(regexp, params);
            } else if (action == 'registerValidator') {
                validators.push(params);
            }
        }
    })($);

    /*
    *
    * States field builder
    *
    */
    (function($){

        var options = {};
        var init = false;

        function _rebuildStates(section, elm)
        {
            elm = elm || $('.cm-state.cm-location-' + section).prop('id');
            var sbox = $('#' + elm).is('select') ? $('#' + elm) : $('#' + elm + '_d');
            var inp = $('#' + elm).is('input') ? $('#' + elm) : $('#' + elm + '_d');
            var default_state = inp.val();
            var cntr = $('.cm-country.cm-location-' + section);
            var cntr_disabled;

            if (cntr.length) {
                cntr_disabled = cntr.prop('disabled');
            } else {
                cntr_disabled = sbox.prop('disabled');
            }

            var country_code = (cntr.length) ? cntr.val() : options.default_country;
            var tag_switched = false;
            var pkey = '';

            sbox.prop('id', elm).prop('disabled', false).removeClass('hidden cm-skip-avail-switch');
            inp.prop('id', elm + '_d').prop('disabled', true).addClass('hidden cm-skip-avail-switch').val('');

            if (!inp.hasClass('disabled')) {
                sbox.removeClass('disabled');
            }

            if (options.states && options.states[country_code]) { // Populate selectbox with states
                sbox.prop('length', 1);
                for (var i = 0; i < options.states[country_code].length; i++) {
                    sbox.append('<option value="' + options.states[country_code][i]['code'] + '"' + (options.states[country_code][i]['code'] == default_state ? ' selected' : '') + '>' + options.states[country_code][i]['state'] + '</option>');
                }

                sbox.prop('id', elm).prop('disabled', false).removeClass('cm-skip-avail-switch');
                inp.prop('id', elm + '_d').prop('disabled', true).addClass('cm-skip-avail-switch');

                if (!inp.hasClass('disabled')) {
                    sbox.removeClass('disabled');
                }

            } else { // Disable states
                sbox.prop('id', elm + '_d').prop('disabled', true).addClass('hidden cm-skip-avail-switch');
                inp.prop('id', elm).prop('disabled', false).removeClass('hidden cm-skip-avail-switch').val(default_state);

                if (!sbox.hasClass('disabled')) {
                    inp.removeClass('disabled');
                }
            }

            if (cntr_disabled == true) {
                sbox.prop('disabled', true);
                inp.prop('disabled', true);
            }
        }

        function _rebuildStatesInLocation() {
            var location_elm = $(this).prop('class').match(/cm-location-([^\s]+)/i);
            if (location_elm) {
                _rebuildStates(location_elm[1], $('.cm-state.cm-location-' + location_elm[1]).not(':disabled').prop('id'));
            }
        }

        var methods = {
            init: function() {
                if ($(this).hasClass('cm-country')) {
                    if (init == false) {
                        $(_.doc).on('change', 'select.cm-country', _rebuildStatesInLocation);
                        init = true;
                    }
                    $(this).trigger('change');
                } else {
                    _rebuildStatesInLocation.call(this);
                }
            }
        }

        $.fn.ceRebuildStates = function(method) {
            var args = arguments;

            return $(this).each(function(i, elm) {
                if (methods[method]) {
                    return methods[method].apply(this, Array.prototype.slice.call(args, 1));
                } else if ( typeof method === 'object' || ! method ) {
                    return methods.init.apply(this, args);
                } else {
                    $.error('ty.rebuildstates: method ' +  method + ' does not exist');
                }
            });
        };

        $.ceRebuildStates = function(action, params) {
            params = params || {};
            if (action == 'init') {
                options = params;
            }
        }
    })($);

   /*
    *
    * Sticky scroll
    *
    */
    (function($){
        var methods = {
            init: function(params) {
                return this.each(function() {
                    var params = params || {
                        top: $(this).data('ceTop') ? $(this).data('ceTop') : 0,
                        padding: $(this).data('cePadding') ? $(this).data('cePadding') : 0
                    };
                    var self = $(this);

                    $(window).scroll(function () {
                        if ($(window).scrollTop() > params.top) {
                            $(self).css({'position': 'fixed', 'top': params.padding + 'px'});
                        } else {
                            $(self).css({'position': '', 'top': ''});
                        }
                    });

                });
            }
        };

        $.fn.ceStickyScroll = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.stickyScroll: method ' +  method + ' does not exist');
            }
        };
    })($);


   /*
    *
    * Notifications
    *
    */
    (function($) {

        var container;
        var timers = {};
        var delay = 0;

        function _duplicateNotification(key)
        {
            var dups = $('div[data-ca-notification-key=' + key + ']');
            if (dups.length) {

                if (!_addToDialog(dups)) {
                    dups.fadeTo('fast', 0.5).fadeTo('fast', 1).fadeTo('fast', 0.5).fadeTo('fast', 1);
                }

                // Restart autoclose timer
                if (timers[key]) {
                    clearTimeout(timers[key]);
                    methods.close(dups, true);
                }
                
                return true;
            }

            return false;
        }

        function _closeNotification(notification)
        {
            if (notification.find('.cm-notification-close-ajax').length) {
                $.ceAjax('request', fn_url('notifications.close?notification_id=' + notification.data('caNotificationKey')), {
                    hidden: true
                });
            }

            notification.fadeOut('fast', function() {
                notification.remove();
            });

            if (notification.hasClass('cm-notification-content-extended')) {
                var overlay = $('.ui-widget-overlay[data-ca-notification-key=' + notification.data('caNotificationKey') + ']');
                if (overlay.length) {
                    overlay.fadeOut('fast', function() {
                        overlay.remove();
                    });
                }
            }
        }

        function _processTranslation(text)
        {
            if (_.translate_mode && text.indexOf('[lang') != -1) {
                text = '<var class="translate-wrap"><i class="cm-icon-translate icon-translate ty-icon-translate"></i><var class="cm-translate translate-item" data-ca-translate="' + text.substring(text.indexOf('=') + 1, text.indexOf(']')) + '">' + text.substring(text.indexOf(']') + 1, text.lastIndexOf('[')) + '</var></var>';
            }

            return text;
        }
        
        function _pickFromDialog(event) {
            var nt = $('.cm-notification-content', $(event.target));
            if (nt.length) {
                if (!_addToDialog(nt)) {
                    container.append(nt);
                }
            }
            return true;
        }
        
        function _addToDialog(notification)
        {
            var dlg = $.ceDialog('get_last');
            if (dlg.length) {
                $('.object-container', dlg).prepend(notification);
                dlg.off('dialogclose', _pickFromDialog);
                dlg.on('dialogclose', _pickFromDialog);
                return true;
            }
            return false;
        }

        var methods = {
            show: function (data, key)
            {
                if (!key) {
                    key = $.crc32(data.message);
                }

                if (typeof(data.message) == 'undefined') {
                    return false;
                }

                if (_duplicateNotification(key)) {
                    return true;
                }

                data.message = _processTranslation(data.message);
                data.title = _processTranslation(data.title);

                // Popup message in the screen center - should be only one at time
                if (data.type == 'I') {
                    var w = $.getWindowSizes();

                    $('.cm-notification-content.cm-notification-content-extended').each(function() {
                        methods.close($(this), false);
                    });

                    $(_.body).append(
                        '<div class="ui-widget-overlay" style="z-index:1010" data-ca-notification-key="' + key + '"></div>'
                    );

                    var notification = $('<div class="cm-notification-content cm-notification-content-extended notification-content-extended ' + (data.message_state == "I" ? ' cm-auto-hide' : '') + '" data-ca-notification-key="' + key + '">' +
                        '<h1>' + data.title + '<span class="cm-notification-close close"></span></h1>' +
                        '<div class="notification-body-extended">' +
                        data.message +
                        '</div>' +
                        '</div>');

                    var notificationMaxHeight = w.view_height - 300;

                    $(notification).find('.cm-notification-max-height').css({
                        'max-height': notificationMaxHeight
                    });

                    // FIXME I-type notifications are embedded directly into the body and not into a container, because a container has low z-index and get overlapped by modal dialogs.
                    //container.append(notification);
                    $(_.body).append(notification);
                    notification.css('top', w.view_height / 2 - (notification.height() / 2));

                } else {
                    var n_class = 'alert';
                    var b_class = '';

                    if (data.type == 'N') {
                        n_class += ' alert-success';
                    } else if (data.type == 'W') {
                        n_class += ' alert-warning';
                    } else if (data.type == 'S') {
                        n_class += ' alert-info';
                    } else {
                        n_class += ' alert-error';
                    }

                    if (data.message_state == 'I') {
                        n_class += ' cm-auto-hide';
                    } else if (data.message_state == 'S') {
                        b_class += ' cm-notification-close-ajax';
                    }

                    var notification = $('<div class="cm-notification-content notification-content ' + n_class + '" data-ca-notification-key="' + key + '">' +
                        '<button type="button" class="close cm-notification-close ' + b_class + '" data-dismiss="alert">×</button>' +
                        '<strong>' + data.title + '</strong>' + data.message +
                        '</div>');

                    if (!_addToDialog(notification)) {
                        container.append(notification);
                    }
                }

                $.ceEvent('trigger', 'ce.notificationshow', [notification]);

                if (data.message_state == 'I') {
                    methods.close(notification, true);
                }
            },

            showMany: function(data)
            {
                for (var key in data) {
                    methods.show(data[key], key);
                }
            },

            closeAll: function()
            {
                container.find('.cm-notification-content').each(function() {
                    var self = $(this);
                    if (!self.hasClass('cm-notification-close-ajax')) {
                        methods.close(self, false);
                    }
                })
            },

            close: function(notification, delayed)
            {
                if (delayed == true) {
                    if (delay === 0) { // do not auto-close
                        return true;
                    }

                    timers[notification.data('caNotificationKey')] = setTimeout(function(){
                        methods.close(notification, false);
                    }, delay);
                    if($('#hidden_return_url').length>0){
                        window.location.href = fn_url($('#hidden_return_url').val());
                    }
                    //console.log();
                    return true;
                }

                _closeNotification(notification);
            },

            init: function()
            {
                delay = _.notice_displaying_time * 1000;
                container = $('.cm-notification-container');

                $(_.doc).on('click', '.cm-notification-close', function() {
                    methods.close($(this).parents('.cm-notification-content:first'), false);
                })

                container.find('.cm-auto-hide').each(function() {
                    methods.close($(this), true);
                });
            }
        };


        $.ceNotification = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('ty.notification: method ' +  method + ' does not exist');
            }
        };

    }($));


   /*
    *
    * Events
    *
    */
    (function($) {
        var handlers = {};

        var methods = {
            on: function(event, handler, one)
            {
                one = one || false;
                if (!(event in handlers)) {
                    handlers[event] = [];
                }
                handlers[event].push({
                    handler: handler,
                    one: one
                });
            },

            one: function(event, handler)
            {
                methods.on(event, handler, true);
            },

            trigger: function(event, data)
            {
                data = data || [];
                var result = true, _res;
                if (event in handlers) {
                    for (var i = 0; i < handlers[event].length; i++) {
                        _res = handlers[event][i].handler.apply(handlers[event][i].handler, data);

                        if (handlers[event][i].one) {
                            handlers[event].splice(i, 1);
                        }

                        if (_res === false) {
                            result = false;
                            break;
                        }
                    }
                }

                return result;
            }
        };

        $.ceEvent = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('ty.event: method ' +  method + ' does not exist');
            }
        };

    }($));

    /*
     * Code editor
     *
     */
    (function($){

        var methods = {
            _init: function(self) {

                if (!self.data('codeEditor')) {
                    var editor = ace.edit(self.prop('id'));
                    editor.session.setUseWrapMode(true);
                    editor.session.setWrapLimitRange();
                    editor.setFontSize("14px");
                    editor.renderer.setShowPrintMargin(false);

                    editor.getSession().on('change', function(e) {
                        self.addClass('cm-item-modified');
                    });

                    self.data('codeEditor', editor);
                }

                return $(this);
            },
            init: function(mode) {
                var self = $(this);
                methods._init(self);

                if (mode) {
                    self.data('codeEditor').getSession().setMode(mode);
                }

                return $(this);
            },
            set_value: function(val, mode) {
                var self = $(this);
                methods._init(self);

                if(mode == undefined) {
                    mode = 'ace/mode/html';
                }

                self.data('codeEditor').getSession().setMode(mode);
                self.data('codeEditor').setValue(val);
                self.data('codeEditor').navigateLineStart();
                self.data('codeEditor').clearSelection();
                self.data('codeEditor').scrollToRow(0);

                return $(this);
            },

            set_show_gutter: function(value) {
                $(this).data('codeEditor').renderer.setShowGutter(value);
            },

            value: function() {
                var self = $(this);
                methods._init(self);

                return self.data('codeEditor').getValue();
            },
            set_listener: function(event_name, callback)
            {
                $(this).data('codeEditor').getSession().on(event_name, function(e) {
                    callback(e);
                });

                return $(this);
            }
        };

        $.fn.ceCodeEditor = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('ty.codeeditor: method ' +  method + ' does not exist');
            }
        };
    })($);

    // If page is loaded with URL in hash parameter, redirect to this URL
    if (!_.embedded && location.hash && unescape(location.hash).indexOf('#!/') === 0) {
        var components = $.parseUrl(location.href)
        var uri = $.ceHistory('parseHash', location.hash);
        
        //FIXME: Remove this code when support for Internet Explorer 8 and 9 is dropped
        if($.browser.msie && $.browser.version >= 9) {
            $.redirect(components.protocol + '://' + components.host + uri);
        } else {
            $.redirect(components.protocol + '://' + components.host + components.directory + uri);
        }
    }

}(Tygh, jQuery));


    //
    // Print variable contents
    //
    function fn_print_r(value)
    {
        fn_alert(fn_print_array(value));
    }

    //
    // Show alert
    //
    function fn_alert(msg, not_strip)
    {
        msg = not_strip ? msg : fn_strip_tags(msg);
        alert(msg);
    }

    // Helper
    function fn_print_array(arr, level)
    {
        var dumped_text = "";
        if(!level) {
            level = 0;
        }

        //The padding given at the beginning of the line.
        var level_padding = "";
        for(var j=0; j < level+1; j++) {
            level_padding += "    ";
        }

        if(typeof(arr) == 'object') { //Array/Hashes/Objects
            for(var item in arr) {
                var value = arr[item];

                if(typeof(value) == 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += fn_print_array(value,level+1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        } else { //Stings/Chars/Numbers etc.
            dumped_text = arr+" ("+typeof(arr)+")";
        }

        return dumped_text;
    }

    function fn_url(url)
    {
        var index_url = Tygh.current_location + '/' + Tygh.index_script;
        var components = Tygh.$.parseUrl(url);

        if (url == '') {
            url = index_url;

        } else if (components.protocol) {

            if (Tygh.embedded) {

                var s, spos;
                if (Tygh.facebook && Tygh.facebook.url.indexOf(components.location) != -1) {
                    s = '&app_data=';
                } else if (Tygh.init_context == components.source.str_replace('#' + components.anchor, '')) {
                    s = '#!';
                }

                if (s) {

                    var q = '';
                    if ((spos = url.indexOf(s)) != -1) {
                        q = unescape(url.substr(spos + s.length)).replace('&amp;', '&');
                    }

                    url = Tygh.current_location + q;
                }
            }

        } else if (components.file != Tygh.index_script) {
            if (url.indexOf('?') == 0) {
                url = index_url + url;

            } else {
                url = index_url + '?dispatch=' + url.replace('?', '&');

            }
        }

        return url;
    }

    function fn_strip_tags(str)
    {
        str = str.replace(/<.*?>/g, '');
        return str;
    }

    function fn_reload_form(jelm)
    {
        var form = jelm.parents('form');
        var container = form.parent();

        var submit_btn = form.find("input[type='submit']");
        if (!submit_btn.length) {
            submit_btn = Tygh.$('[data-ca-target-form=' + form.prop('name') + ']');
        }

        if (container.length && submit_btn.length) {

            var url = form.prop('action') + '?reload_form=1&' + submit_btn.prop('name');

            var data = form.serializeObject();
            var result_ids;
            // If not preset result_ids in form get form container id
            if (data.result_ids != 'undefined') {
                result_ids = data.result_ids;
            } else {
                result_ids = container.prop('id');
            }
            Tygh.$.ceAjax('request', fn_url(url), {
                data: data,
                result_ids: result_ids
            });
        }
    }

    function fn_get_listed_lang(langs)
    {
        var $ = Tygh.$;
        // check langs priority
        var check_langs = [Tygh.cart_language, Tygh.default_language, 'en'];
        var lang = '';

        if (langs.length) {
            lang = langs[0];

            for (var i = 0; i < check_langs.length; i++) {
                if (Tygh.$.inArray(check_langs[i], langs) != -1) {
                    lang = check_langs[i];
                    break;
                }
            }
        }

        return lang;
    }

    function fn_query_remove(query, vars)
    {
        if (typeof(vars) == 'undefined') {
            return query;
        }
        if (typeof vars == 'string') {
            vars = [vars];
        }
        var start = query;
        if (query.indexOf('?') >= 0) {
            start = query.substr(0, query.indexOf('?') + 1);
            var search = query.substr(query.indexOf('?') + 1);
            var srch_array = search.split("&");
            var temp_array = [];
            var concat = true;
            var amp = '';

            for (var i = 0; i < srch_array.length; i++) {
                temp_array = srch_array[i].split("=");
                concat = true;
                for (var j = 0; j < vars.length; j++) {
                    if (vars[j] == temp_array[0] || temp_array[0].indexOf(vars[j]+'[') != -1) {
                        concat = false;
                        break;
                    }
                }
                if (concat == true) {
                    start += amp + temp_array[0] + '=' + temp_array[1];
                }
                amp = '&';
            }
        }
        return start;
    }
    
    function krsort(inputArr, sort_flags) {
        //  discuss at: http://phpjs.org/functions/krsort/
        // original by: GeekFG (http://geekfg.blogspot.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Brett Zamir (http://brett-zamir.me)
        //        note: The examples are correct, this is a new way
        //        note: This function deviates from PHP in returning a copy of the array instead
        //        note: of acting by reference and returning true; this was necessary because
        //        note: IE does not allow deleting and re-adding of properties without caching
        //        note: of property position; you can set the ini of "phpjs.strictForIn" to true to
        //        note: get the PHP behavior, but use this only if you are in an environment
        //        note: such as Firefox extensions where for-in iteration order is fixed and true
        //        note: property deletion is supported. Note that we intend to implement the PHP
        //        note: behavior by default if IE ever does allow it; only gives shallow copy since
        //        note: is by reference in PHP anyways
        //        note: Since JS objects' keys are always strings, and (the
        //        note: default) SORT_REGULAR flag distinguishes by key type,
        //        note: if the content is a numeric string, we treat the
        //        note: "original type" as numeric.
        //  depends on: i18n_loc_get_default
        //   example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
        //   example 1: data = krsort(data);
        //   example 1: $result = data
        //   returns 1: {d: 'lemon', c: 'apple', b: 'banana', a: 'orange'}
        //   example 2: ini_set('phpjs.strictForIn', true);
        //   example 2: data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'};
        //   example 2: krsort(data);
        //   example 2: $result = data
        //   returns 2: {3: 'Kevin', 2: 'van', 1: 'Zonneveld'}

        var tmp_arr = {},
          keys = [],
          sorter, i, k, that = this,
          strictForIn = false,
          populateArr = {};

        switch (sort_flags) {
          case 'SORT_STRING':
            // compare items as strings
            sorter = function(a, b) {
              return that.strnatcmp(b, a);
            };
            break;
          case 'SORT_LOCALE_STRING':
            // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)
            var loc = this.i18n_loc_get_default();
            sorter = this.php_js.i18nLocales[loc].sorting;
            break;
          case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function(a, b) {
              return (b - a);
            };
            break;
          case 'SORT_REGULAR':
            // compare items normally (don't change types)
          default:
            sorter = function(b, a) {
              var aFloat = parseFloat(a),
                bFloat = parseFloat(b),
                aNumeric = aFloat + '' === a,
                bNumeric = bFloat + '' === b;
              if (aNumeric && bNumeric) {
                return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
              } else if (aNumeric && !bNumeric) {
                return 1;
              } else if (!aNumeric && bNumeric) {
                return -1;
              }
              return a > b ? 1 : a < b ? -1 : 0;
            };
            break;
        }

        // Make a list of key names
        for (k in inputArr) {
          if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
          }
        }
        keys.sort(sorter);

        // BEGIN REDUNDANT
        this.php_js = this.php_js || {};
        this.php_js.ini = this.php_js.ini || {};
        // END REDUNDANT
        strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js
          .ini['phpjs.strictForIn'].local_value !== 'off';
        populateArr = strictForIn ? inputArr : populateArr;

        // Rebuild array with sorted key names
        for (i = 0; i < keys.length; i++) {
          k = keys[i];
          tmp_arr[k] = inputArr[k];
          if (strictForIn) {
            delete inputArr[k];
          }
        }
        for (i in tmp_arr) {
          if (tmp_arr.hasOwnProperty(i)) {
            populateArr[i] = tmp_arr[i];
          }
        }

        return strictForIn || populateArr;
    }
    
    function loadOptionVariantProductInfo(optionIds, product_id){
        var optionsWithVariantsLinkedToProductsArray = optionIds.split(',');
        var nrOptionsWithVariantsLinkedToProductsArray = optionsWithVariantsLinkedToProductsArray.length;
        var myItems = 0;
        $('.product_required_linked_details').html("");
        for(myItems;myItems<nrOptionsWithVariantsLinkedToProductsArray;myItems++){
            var myObj = document.getElementsByName("product_data["+product_id+"][product_options]["+optionsWithVariantsLinkedToProductsArray[myItems]+"]");
            var tagTypeName = '';
            $.each(myObj,function(i,myTag){
                tagTypeName = myTag.tagName;
            });

            if(tagTypeName=='INPUT'){
                var myObjValue = $("input[name='"+"product_data["+product_id+"][product_options]["+optionsWithVariantsLinkedToProductsArray[myItems]+"]']:checked" ).val();
            }else if(tagTypeName=='SELECT'){
                var myObjValue = $("select[name='"+"product_data["+product_id+"][product_options]["+optionsWithVariantsLinkedToProductsArray[myItems]+"]']" ).val();
            }

            $.ajax({
                type: "POST",
                async: false,
                url: fn_url("products.view_details_compact"),
                data: {product_id: product_id, variant_id: myObjValue, is_ajax:1}
            }).done(function( msg ) {
                if($('.product_required_linked_details').length>0){
                   $('.product_required_linked_details').append(msg.text);
                }else{
                    if($('div#ls_product_page_accordion div#content_description').length>0){
                        var htmlToDisplay = '<div class="product_required_linked_details">';
                        htmlToDisplay += msg.text;
                        htmlToDisplay += '<div>';
                        $('div#ls_product_page_accordion div#content_description').append(htmlToDisplay);
                    }
                }

            });
        }
    }
    
    function fn_flip_info(obj_id, obj_div_from, obj_div_to){
        $('#'+obj_div_from+'_'+obj_id).parents('form').toggleClass(function(){
            $('#'+obj_div_from+'_'+obj_id).fadeToggle('fast',function() {
                $('#'+obj_div_to+'_'+obj_id).fadeToggle();
            });
            return 'flip';
        });
        
//        $('#'+obj_div_from+'_'+obj_id).toggleClass(function(){
//            $(this).toggle(200);
//            $('#'+obj_div_to+'_'+obj_id).toggleClass(function(){
//                $(this).toggle(200);
//                return 'flip';
//            });
//            return 'flip';
//        });
//        $('#'+obj_div_from+'_'+obj_id).toggleClass('flip').toggle(300);
//        $('#'+obj_div_to+'_'+obj_id).toggleClass('flip').toggle(300);
//        $('#'+obj_div_from+'_'+obj_id).toggleClass('flip');
//        $('#'+obj_div_to+'_'+obj_id).toggleClass('flip');
//        $('#'+obj_div_from+'_'+obj_id).toggle();
//        $('#'+obj_div_to+'_'+obj_id).toggle();
    }
    
    function ls_show_hide_main_content(){
        //hide_options
        //console.log($('.ty-product-block_main_info_options_middle').height());
         $('.ty-product-block_main_info_options_top').parent().toggleClass(function(){
             $('.ty-product-block_main_info_options_middle').slideToggle();
//            $('.ty-product-block_main_info_options_left').fadeToggle(1,function() {
//                $('.ty-product-block_main_info_options_middle').fadeToggle();
//                $('.ty-product-block_main_info_options_right').fadeToggle();
//            });
            return 'hide_options';
        });
    }
    
    function show_next_prev_product(prod_direction){
        if(prod_direction == "prev"){
            if($('a.ty-product-switcher__a.ty-product-switcher__a-left').hasClass('disabled')){
                //my_obj.css('cursor','none');
            }else{
                //my_obj.css('cursor','pointer');
                $('a.ty-product-switcher__a.ty-product-switcher__a-left').click();
            }
        }else if(prod_direction == "next"){
            if($('a.ty-product-switcher__a.ty-product-switcher__a-right').hasClass('disabled')){
                
            }else{
                //console.log($('a.ty-product-switcher__a.ty-product-switcher__a-right'));
                $('a.ty-product-switcher__a.ty-product-switcher__a-right').click();
            }
        }
    }
    
    function load_arrows_positions(){
        $('.ty-product-block_main_info_options_left').css('top',parseInt(parseInt(parseInt($('.ty-product-block_main_info_options_middle').height()) - 37) / 2));
        $('.ty-product-block_main_info_options_right').css('top',parseInt(parseInt(parseInt($('.ty-product-block_main_info_options_middle').height()) - 37) / 2));
    }
    
    function add_owl_carusel(aditionalEventParams){
        
        var owl1 = $("#"+aditionalEventParams.target_id);
        var number_of_elements = 3;
        if(aditionalEventParams.nr_of_elements_to_show){
            number_of_elements = aditionalEventParams.nr_of_elements_to_show;
        }
        
        owl1.owlCarousel({
            items : number_of_elements, 
            pagination: false,
            navigation: true,
            navigationText: parseInt(aditionalEventParams.nr_of_elements) > number_of_elements ? ['<i class="icon-left-circle ty-icon-left-circle"></i>', '<i class="icon-right-circle ty-icon-right-circle"></i>'] : ['<i class="icon-left-open-thin ty-icon-left-open-thin"></i>', '<i class="icon-right-open-thin ty-icon-right-open-thin"></i>'],
            theme: parseInt(aditionalEventParams.nr_of_elements) > number_of_elements ? 'owl-one-theme' : 'owl-more-theme',
            //itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
            beforeUpdate  : function(item) {
                $(item).find('div.owl-wrapper').width("");
                var allOwlElementsWidth = $(item).find('div.owl-item');
                
                var initOwlWrapperWidth = 0;
                var finalOwlWrapperWidth = 0;
                $.each(allOwlElementsWidth, function(key1, element1){
                    initOwlWrapperWidth += parseInt($(element1).width())+10;
                }); 
                
                if(aditionalEventParams.target_id=="box_products_carusel"){
                    initOwlWrapperWidth = aditionalEventParams.nr_of_elements * 300;
                }
                
                if(parseInt(aditionalEventParams.nr_of_elements) > number_of_elements){
                    //$('.'+aditionalEventParams.element_to_shift_up).css('padding-bottom','36px');
                    var oneElementWidth = parseInt(initOwlWrapperWidth) / parseInt(aditionalEventParams.nr_of_elements);

                    finalOwlWrapperWidth = parseInt(oneElementWidth) * number_of_elements;

                    $(item).find('div.owl-item').width(finalOwlWrapperWidth);
                }else{
                    finalOwlWrapperWidth = initOwlWrapperWidth;
                }
                $(item).find('div.owl-wrapper-outer').width(finalOwlWrapperWidth);
                $(item).find('div.owl-wrapper').width(initOwlWrapperWidth).css('float','left').css('display','inline');
            },
        });

        // Custom Navigation Events
        $(".next").click(function(){
          owl1.trigger('owl.next');
        });
        $(".prev").click(function(){
          owl1.trigger('owl.prev');
        });
        
    }
    
//    function update_compare_products(compare_type, number_elements, current_url){
//        $.ajax({
//            url: current_url+"&is_ajax=1&compare_type="+compare_type,
//            dataType:'json',
//            async:false
//        }).done(function(data) {
//            $('div.ty-compare').parent().html(data.text);
//        }).always(function(){
////            var aditionalEventParams = {'aditionalEventParams':"product_features_name_iteration",'nr_of_elements':number_elements,'target_id':"product_features_carusel"};
////            add_owl_carusel(aditionalEventParams);
//        })
//        .then(function(){
//            var aditionalEventParams = {'aditionalEventParams':"product_features_name_iteration",'nr_of_elements':number_elements,'target_id':"product_features_carusel"};
//            add_owl_carusel(aditionalEventParams);
//        });
////        $('div.ty-compare').parent().load(current_url+"&compare_type="+compare_type, function(responseTxt, statusTxt, xhr){
////                if(statusTxt == "success"){
////                    var aditionalEventParams = {'aditionalEventParams':"product_features_name_iteration",'nr_of_elements':number_elements,'target_id':"product_features_carusel"};
////                    add_owl_carusel(aditionalEventParams);
////                }
////            });
//    }
    function update_compare_products(compare_type, current_url, big_div_width){
        var number_of_elements = 3;
        var elementWidth = parseInt(big_div_width)/number_of_elements;
        var compare_types = new Array('show_all','similar_only','different_only');
        $('#ajax_loading_box').show();
        $.ajax({
            url: current_url+"&is_ajax=1&compare_type="+compare_type+"&elem_width="+elementWidth,
            dataType:'json',
            async:false
        }).done(function(data) {
            $("#product_features_carusel").find('div.owl-wrapper').html(data.text);
            $.each(compare_types, function(key1, element1){
                if(element1==compare_type){
                    $('li#ty-compare-menu__item_'+element1+" span").show();
                    $('li#ty-compare-menu__item_'+element1+" a").hide();
                }else{
                   $('li#ty-compare-menu__item_'+element1+" a").show();
                    $('li#ty-compare-menu__item_'+element1+" span").hide();
                }
            });
        })
        .always(function(){
            var features_active_ids = $('#features_active_ids').val();
            var features_active_ids_array = features_active_ids.split(',');
            $('tr.feature_label__class').hide();
            $.each(features_active_ids_array, function(key, element){
                $('tr#feature_label_name_'+element).show();
            });
            $('#ajax_loading_box').hide();
        });
    }
    
    function quick_view_dialog_test(upload_url){
        $('body').addClass('dialog-is-open');
        //$('#ajax_overlay').attr("css",'background: url("../../../../../../../../design/themes/responsive/media/images/picker_bg_outside.png") repeat-x scroll 0 -50% #000;margin: 0;opacity: 0.7;overflow: hidden;padding: 0;position: fixed;').show();
        $('#ajax_overlay').show();
        $('#ajax_loading_box').show();
        
        var container = $('#product_quick_view');
        var offset = 10;
        var width_border = 120;
        var height_border = 0;
        var zindex = 1020;
        var additional_auto_height = 168;
        var buttons_auto_height = 40;
        var max_width = 1200;

        if(!container.length) {
            //$('body').append('<div id="product_quick_view" class="hidden"></div>');
            $('body').append('<div id="product_quick_view" class="modal" aria-hidden="true"></div>');
            container = $('#product_quick_view');
        }else{
            container.html("");
        }
        
        var ajax_exectute = $.ajax({
            url: upload_url,
            dataType:'json',
            async:false,
            cache: false,
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
//            beforeSend: function(){
//                $('body').addClass('dialog-is-open');
//                $('#ajax_overlay').show();
//                $('#ajax_loading_box').show();
//            }
        });
        ajax_exectute.done(function(data) {
            if(container.is(':visible')){ container.modal('hide').html("");}
            container.html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body">'+data.text+'</div></div></div>');
        });
    }
    
    function scroll_option_div(my_direction){
        var scrolled = 0;
        if(my_direction == 'up'){
            scrolled = scrolled - 300;
            $("div.ty-product-block_main_info_options_middle_body").stop().animate({
                scrollTop: scrolled
            });
        }else if(my_direction == 'down'){
            scrolled = scrolled + 300;
            $("div.ty-product-block_main_info_options_middle_body").stop().animate({
                scrollTop: scrolled
            });
        }
    }
    
    function onload_image_actions(){
        $('#ajax_loading_box').hide();
        $('#ajax_overlay').hide();
        
        //var additional_width = 30;
        var additional_width = 2;
        var container = $('#product_quick_view');
        container.modal();
        
        container.on('show.bs.modal', function (event) {
            var modal = $(this);
            
            var ws = $.getWindowSizes();

            var max_height = ws.view_height - 80;
            var max_width = ws.view_width;
            
            var temporalImage = new Image();
            temporalImage.src = modal.find('div.ty-product-img.cm-preview-wrapper').find('img:visible').attr('src');
            
            var dialogHeight = temporalImage.height;
            var dialogWidth = temporalImage.width;
            
            if(dialogHeight<100) dialogHeight = 680;
            if(dialogWidth<100) dialogWidth = 680;
            
            if(max_height<dialogHeight) dialogHeight = max_height;
            if(max_width<dialogWidth) dialogWidth = max_width;
            
            dialogWidth = dialogWidth + additional_width;
            dialogHeight = dialogHeight;
            
            modal.find('div.modal-dialog').height(dialogHeight);
            modal.find('div.modal-dialog').width(dialogWidth);
            
            var optionsDivHeight = parseInt(dialogHeight) - 132;
            modal.find('div.ty-product-block_main_info_options_middle').show();
            var optionDivElements = modal.find('div.ty-product-block_main_info_options_middle_body').children();
            
            var calculateOptionDivElementsHeight = 0;
            $.each(optionDivElements,function(i, optionDivElement){
                calculateOptionDivElementsHeight += $(optionDivElement).height();
            });
            //console.log(calculateOptionDivElementsHeight," ===> ",optionsDivHeight);
            if(calculateOptionDivElementsHeight > 0 && calculateOptionDivElementsHeight < optionsDivHeight){
                optionsDivHeight = calculateOptionDivElementsHeight + 32;
            }else if(calculateOptionDivElementsHeight > 0 && calculateOptionDivElementsHeight > optionsDivHeight){
                //console.log(modal.find('div.ty-product-block_main_info_options_middle_scroll').length);
                if(modal.find('div.ty-product-block_main_info_options_middle_scroll').length==0){
                    var scrollDiv = '<div class="ty-product-block_main_info_options_middle_scroll">';
                    scrollDiv += '<div class="upClick" onclick="scroll_option_div(\'up\');" style="cursor:pointer;">up</div>';
                    scrollDiv += '<div class="middleDivNoClick"></div>';
                    scrollDiv += '<div class="downClick" onclick="scroll_option_div(\'down\');" style="cursor:pointer;">down</div>';
                    scrollDiv += '';
                    scrollDiv += '';
                    scrollDiv += '';
                    scrollDiv += '';
                    scrollDiv += '</div>';
                    modal.find('div.ty-product-block_main_info_options_middle').append(scrollDiv);
                }
            }
            
            if(modal.find('div.ty-product-block_main_info_options').hasClass('hide_options')){
                modal.find('div.ty-product-block_main_info_options_middle').height(optionsDivHeight).hide();
            }else{
                modal.find('div.ty-product-block_main_info_options_middle').height(optionsDivHeight);
            }
            modal.find('div.ty-product-block_main_info_options_middle_body').height(optionsDivHeight);
//            $('.ty-product-block_main_info_options_left').css('top',parseInt(parseInt(parseInt(optionsDivHeight) - 37) / 2));
//            $('.ty-product-block_main_info_options_right').css('top',parseInt(parseInt(parseInt(optionsDivHeight) - 37) / 2));
            
            var imgTagHeight = modal.find('div.ty-product-img.cm-preview-wrapper').find('img:visible').height();
            
            var imgDefaultPositionPosition = parseInt((imgTagHeight-dialogHeight)/2);
                   
            //modal.find('div.ty-product-img.cm-preview-wrapper').scrollTop( parseInt(imgDefaultPositionPosition) );
            //modal.find('div.ty-product-img.cm-preview-wrapper').css('top', - imgDefaultPositionPosition );
            
            var productDivCursorsHeight = (dialogHeight - 80)/2
            
            modal.find('div.ty-product-block_main_info_prev_product').css('top', productDivCursorsHeight);
            modal.find('div.ty-product-block_main_info_next_product').css('top', productDivCursorsHeight);
            
            modal.find('div.ty-center').css('top', productDivCursorsHeight+65);
            
            modal.find('div.ty-product-img.cm-preview-wrapper').height(dialogHeight).css('overflow','hidden').on('mousemove', function(e) {
                //console.log("screen: ",e.screenY," client: ",e.clientY," page: ", e.pageY);    
                var cPointY = e.clientY - 40;
                var dP = ((cPointY / dialogHeight));
                modal.find('div.ty-product-img.cm-preview-wrapper').scrollTop(dP*(imgTagHeight-dialogHeight) );
            });
            $(this).css('overflow','hidden');
            
            if(container.find('form').length>0){
                container.find('form').ceFormValidator('init');
            }
        }).on('shown.bs.modal',function(event){
            $(this).css('overflow','hidden');
        }).on('hide.bs.modal',function(event){
            $('body').removeClass('dialog-is-open');
            //$(this).data('bs.modal', null);
        }).on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });
    }
    
    function onload_image_actions_old(){
        $('#ajax_loading_box').hide();
        $('#ajax_overlay').hide();
        
        var height_border = 0;
        var additional_auto_height = 168;
        var buttons_auto_height = 40;
        var max_width = 1200;
        
        var container = $('#product_quick_view');
        
        container.find('script[src]').remove();
        container.dialog({
            title:null,
            buttons:[],
            width:'auto',
            height:'auto',
            draggable:false,
            modal: true,
            position: {
                my: 'center center',
                at: 'center center',
                of: window 
            },
            resizable: false,
            closeOnEscape: true,
            open: function(e, u) {$('body').addClass('dialog-is-open');},
            beforeClose: function(e, u) {$('body').removeClass('dialog-is-open');}
        }).siblings('.ui-dialog-titlebar').remove();
        
//        var ws = $.getWindowSizes();
//        var max_height = ws.view_height;
//
//        var dialogHeight = container.find('div.ty-quick-view__wrapper').height() + additional_auto_height ;
//        var dialogWidth = container.find('div.ty-quick-view__wrapper').width();
//
//        if(max_height<dialogHeight) dialogHeight = max_height;
//        if(max_width<dialogWidth) dialogWidth = max_width;
//        //console.log(dialogHeight);
//        if(container.is(':visible')) container.dialog('close');
//
//        container.dialog(
//                    {
//                        title:null,
//                        draggable:false,
//                        modal: true,
//                        buttons:[],
//                        height:dialogHeight,
//                        width:'auto',
//                        maxWidth: max_width,
//                        maxHeight: max_height  - height_border,
//                        position: {
//                            my: 'center center',
//                            at: 'center center',
//                            of: window 
//                        },
//                        resizable: false,
//                        closeOnEscape: true,
////                            open: function(e, u) {$('body').addClass('dialog-is-open');},
//                        beforeClose: function(e, u) {$('body').removeClass('dialog-is-open');}
//                    }
//                )
//        .siblings('.ui-dialog-titlebar').remove();
        
    }
    
    function updateProductLinkedInfo(var1, var2, var3, var4, varUpdate, quickView){
        if(varUpdate==1){
            if(quickView){
                fn_change_options_quick_view(var1, var2, var3);
            }else{
                fn_change_options(var1, var2, var3);
            }
        }else if(varUpdate==0){
            fn_change_variant_image(var1, var3, var4);
        }
//        var optionsWithVariantsLinkedToProducts = $('#options_with_variants_linked_to_products').val();
//        loadOptionVariantProductInfo(optionsWithVariantsLinkedToProducts, var1);
    }
    
    function show_share_media_buttons(my_obj){
        
        var my_obj_parent = my_obj.parent();
        
        if(!my_obj_parent.hasClass('p_active')){
            my_obj_parent.addClass('p_active');
        }else{
            my_obj_parent.removeClass('p_active');
        }
        
        my_obj_parent.parent().find('div.ty-share-media-buttons').toggle();
    }
    
    function fn_change_options_quick_view(obj_id, id, option_id){
        
        var params = [];
        
        var url = fn_url('products.options?changed_option[' + id + ']=' + option_id);
        
        if($('div#product_options_update_' + obj_id).length>0){
            var elms = $('div#product_options_update_' + obj_id).find(':input:not([type=radio]):not([type=checkbox])');
            $.each(elms, function(id, elm) {
                if (elm.type != 'submit' && elm.type != 'file' && !($(this).hasClass('cm-hint') && elm.value == elm.defaultValue) && elm.name.length != 0) {
                    params.push({name: elm.name, value: elm.value});
                }
            });
            
            var radio = $('div#product_options_update_' + obj_id).find('input[type=radio]:checked, input[type=checkbox]');
            $.each(radio, function(id, elm) {
                if ($(elm).prop('disabled')) {
                    return true;
                }
                var value = elm.value;
                if ($(elm).is('input[type=checkbox]:checked')) {
                    if (!$(elm).hasClass('cm-no-change')) {
                        value = $(elm).val();
                    }
                } else if ($(elm).is('input[type=checkbox]')) {
                    if (!$(elm).hasClass('cm-no-change')) {
                        value = 'unchecked';
                    } else {
                        value = '';
                    }
                }
                params.push({name: elm.name, value: value});
            });
            
            for (var i = 0; i < params.length; i++) {
                url += '&' + params[i]['name'] + '=' + encodeURIComponent(params[i]['value']);
            }
            //console.log(url);
            
            $('body').addClass('dialog-is-open');
            $('#ajax_overlay').show();
            $('#ajax_loading_box').show();

            var container = $('#product_quick_view');

            if(!container.length) {

                $('body').append('<div id="product_quick_view" class="modal" aria-hidden="true"></div>');
                container = $('#product_quick_view');
            }

            var ajax_exectute = $.ajax({
                url: url,
                dataType:'json',
                async:false,
                cache: false,
                beforeSend: function(xhr) {
                    xhr.withCredentials = true;
                },
            });
            ajax_exectute.done(function(data) {
                if(container.is(':visible')){ container.modal('hide');}
                container.html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body">'+data.text+'</div></div></div>');
            });
             
            setTimeout(function() {
                ajax_exectute.always(function(){
                    onload_image_actions();

                });

            }, 100);
        }
    }
    
    function ls_checkout_estimation(proceed_url){
        checkout_est_url = fn_url("checkout.checkout_estimation");
        
        var ajax_exectute = $.ajax({
            url: checkout_est_url,
            dataType:'html',
            async:false,
            cache: false,
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
        });
        ajax_exectute.done(function(data) {
            if(data){
                $("body").addClass("dialog-is-open");
                
                var container = $('#checkout_estimation_modal');
                
                var $dialog = $(this).find(".modal-dialog");
                var offset = ($(window).height() - $dialog.height()) / 2;
                
                var checkout_estimation_modal_container = "";
                checkout_estimation_modal_container += '<div class="modal-dialog" style="margin-top:'+offset+'px"><div class="modal-content"><div class="modal-body">';
                checkout_estimation_modal_container += data;
                checkout_estimation_modal_container += "</div>";
                checkout_estimation_modal_container += '<div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><a class="btn btn-primary" onclick="proceed_to_checkout(\'checkout\');return false;" href="'+proceed_url+'">Confirm</a></div>';
                checkout_estimation_modal_container += '';
                checkout_estimation_modal_container += "</div></div>";
               
                if(!container.length) {
                    $('body').append('<div id="checkout_estimation_modal" class="modal" aria-hidden="true">'+checkout_estimation_modal_container+'</div>');
                    $('#checkout_estimation_modal').modal();
                }else{
                    container.html(checkout_estimation_modal_container).modal();
                } 
                $('#checkout_estimation_modal').on('hide.bs.modal',function(event){
                    $('body').removeClass('dialog-is-open');
                });
            }else{
               //checkout 
               //$('#redirect_url_to_checkout').val(proceed_url);
               proceed_to_checkout('checkout');
                //window.location.href = proceed_url;
            }
        });
        
    } 
    
    function proceed_to_checkout(my_url){
        $('input#redirect_mode').val(my_url);

        $('button#button_cart').click();
    }
    /*
    function ls_filter_by_color(){
        var features_hash = $.getUrlVar('features_hash');
        if(features_hash){
            var feature_hashes = features_hash.split(".");

            var ass_array = new Array();
            var i = 0;

            for(i=0;i<feature_hashes.length;i++){
                ass_array["v"+i] = feature_hashes[i];
            }

            ass_array = krsort(ass_array);
            
            $.each(ass_array, function(key1, element1){
                //ty-thumbs-wrapper owl-carousel cm-image-gallery owl-one-theme
                //var myElements = $('.color_image_class_'+element1).parents('div.ty-thumbs-wrapper.owl-carousel.cm-image-gallery.owl-one-theme');
                var myElements = $('.color_image_class_'+element1).parent();
                //console.log(myElements.children());
//                $.each(myElements, function(key, element){
//                    console.log($('div#'+element.id).children());
//                    console.log($('div#'+element.id).index('div.cm-gallery-item.cm-item-gallery.color_image_class_'+element1));
//                    $('div#'+element.id).trigger("owl.goTo",$('div#'+element.id).find('div.color_image_class_'+element1).parent().data("owlItem"));
//                });
            });
        }
    }
    */
   /*
    function ls_filter_by_color_old(selected_value){
        if(selected_value!=""){
            $('div.ty-column4').hide();
            
            var myElements = $('.color_image_class_'+selected_value+'_1').parents('div.ty-thumbs-wrapper.owl-carousel.cm-image-gallery.owl-one-theme');
            
            $.each(myElements, function(key, element){
                $('div#'+element.id).trigger("owl.goTo",$('div#'+element.id).find('div.color_image_class_'+selected_value+'_1').parent().data("owlItem")).parents('div.ty-column4').show();
            });
        }else{
            $.each($('div.ty-thumbs-wrapper.owl-carousel.cm-image-gallery.owl-one-theme'), function(key, element){
                $('div#'+element.id).trigger("owl.goTo",0).parents('div.ty-column4').show();
            });
            
            $('div.ty-column4').show();
        }
    }
    */
   
   //        setTimeout(function() {
//            ajax_exectute.always(function(){
//                onload_image_actions();
////                $('#ajax_loading_box').hide();
////                $('#ajax_overlay').hide();
////                var ws = $.getWindowSizes();
////                container.find('script[src]').remove();
////                //if(open_first_time_dialog){
////                    container.dialog({
////                        title:null,
////                        draggable:false,
////                        modal: true,
////                        buttons:[],
////                        width:'auto',
////                        position: {
////                            my: 'center center',
////                            at: 'center center',
////                            of: window 
////                        },
////                        resizable: false,
////                        closeOnEscape: true,
////                        open: function(e, u) {$('body').addClass('dialog-is-open');},
////                        beforeClose: function(e, u) {$('body').removeClass('dialog-is-open');}
////                    }).siblings('.ui-dialog-titlebar').remove();
//                //}
////                var max_height = ws.view_height;
////                //var max_width = ws.view_width;
////                //buttons_auto_height
////                var dialogHeight = container.find('div.ty-quick-view__wrapper').height() + additional_auto_height +buttons_auto_height;
////                var dialogWidth = container.find('div.ty-quick-view__wrapper').width();
////
////                if(max_height<dialogHeight) dialogHeight = max_height;
////                if(max_width<dialogWidth) dialogWidth = max_width;
////                console.log(dialogHeight);
////                if(container.is(':visible')) $('#product_quick_view').dialog('close');
////
////                container.dialog(
////                            {
////                                title:null,
////                                draggable:false,
////                                modal: true,
////                                buttons:[],
////                                height:dialogHeight + 10,
////                                //width:dialogWidth + 30,
////                                width:'auto',
////                                maxWidth: max_width,
////                                maxHeight: max_height  - height_border,
////                                position: {
////                                    my: 'center center',
////                                    at: 'center center',
////                                    of: window 
////                                },
////                                resizable: false,
////                                closeOnEscape: true,
////    //                            open: function(e, u) {$('body').addClass('dialog-is-open');},
////                                beforeClose: function(e, u) {$('body').removeClass('dialog-is-open');}
////                            }
////                        )
////                .siblings('.ui-dialog-titlebar').remove();
//            });
//            
//        }, 100);

        
       
        