function fn_change_options(obj_id, id, option_id)
{
    var $ = Tygh.$;
    // Change cart status
    var cart_changed = true;
    
    var params = [];
    var update_ids = [];
    var cache_query = false;
    var defaultValues = {};
    if($('.cm-reload-' + obj_id).length>0){
        var parents = $('.cm-reload-' + obj_id);

        $.each(parents, function(id, parent_elm) {
            var reload_id = $(parent_elm).prop('id');
            update_ids.push(reload_id);

            defaultValues[reload_id] = {};

            var elms = $(':input:not([type=radio]):not([type=checkbox])', parent_elm);
            $.each(elms, function(id, elm) {
                if (elm.type != 'submit' && elm.type != 'file' && !($(this).hasClass('cm-hint') && elm.value == elm.defaultValue) && elm.name.length != 0) {
                    if (elm.name == 'no_cache' && elm.value) {
                        cache_query = false;
                    }
                    params.push({name: elm.name, value: elm.value});
                }
            });

            elms = $(':input', parent_elm);
            $.each(elms, function(id, elm) {
                if ($(elm).is('select')) {
                    var elm_id = $(elm).prop('id');

                    $('option', elm).each(function() {
                        if (this.defaultSelected) {
                            defaultValues[reload_id][elm_id] = this.value;
                        }
                    });

                } else if ($(elm).is('input[type=radio], input[type=checkbox]')) {
                    defaultValues[reload_id][elm_id] = elm.defaultChecked;
                } else {
                    defaultValues[reload_id][elm_id] = elm.defaultValue;
                }

            });
        });

        var radio = $('input[type=radio]:checked, input[type=checkbox]', parents);
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

        var url = fn_url('products.options?changed_option[' + id + ']=' + option_id);

        for (var i = 0; i < params.length; i++) {
            url += '&' + params[i]['name'] + '=' + encodeURIComponent(params[i]['value']);
        }
        //console.log(url);
        $.ceAjax('request', url, {
            result_ids: update_ids.join(',').toString(),
            caching: cache_query,
            force_exec: true,
            pre_processing: fn_pre_process_form_files,
            callback: function(data, params) {
                fn_post_process_form_files(data, params);
                //console.log(data);
                var parents = $('.cm-reload-' + obj_id);
                $.each(parents, function(id, parent_elm) {
                    if (data.html[$(parent_elm).prop('id')]) {
                        var reload_id = $(parent_elm).prop('id');

                        var elms = $(':input', parent_elm);

                        if (defaultValues[reload_id] != null) {
                            $.each(elms, function(id, elm) {
                                var elm_id = $(elm).prop('id');

                                if (defaultValues[reload_id][elm_id] != null) {
                                    if ($(elm).is('select')) {
                                        var selected = {};
                                        var is_selected = false;
                                        $('option', elm).each(function() {
                                            selected[this.value] = this.defaultSelected;
                                            this.defaultSelected = (defaultValues[reload_id][elm_id] == this.value) ? true : false;
                                        });
                                        $('option', elm).each(function() {
                                            this.selected = selected[this.value];
                                            if (this.selected == true) {
                                                is_selected = true;
                                            }
                                        });
                                        if (!is_selected) {
                                            $('option', elm).get(0).selected = true;
                                        }
                                    } else if ($(elm).is('input[type=radio], input[type=checkbox]')) {
                                        var checked = elm.defaultChecked;
                                        elm.defaultChecked = defaultValues[reload_id][elm_id];
                                        elm.checked = checked;
                                    } else {
                                        var value = elm.defaultValue;
                                        elm.defaultValue = defaultValues[reload_id][elm_id];
                                        elm.value = value;
                                    }
                                }
                            });
                        }
                    }
                });

            },
            method: 'post'
        });
    }
}

function fn_set_option_value(id, option_id, value)
{
    var $ = Tygh.$;

    var elm = $('#option_' + id + '_' + option_id);
    if (elm.prop('disabled')) {
        return false;
    }
    if (elm.prop('type') == 'select-one') {
        elm.val(value).change();
    } else {
        elms = $('#option_' + id + '_' + option_id + '_group');
        if ($.browser.msie) {
            $('input[type=radio][value=' + value + ']', elms).prop('checked', true);
        }
        $('input[type=radio][value=' + value + ']', elms).click();
    }

    return true;
}

function fn_pre_process_form_files(data, params)
{
    var $ = Tygh.$;
    if (data.html) {
        // Create temporarily div element
        $(Tygh.body).append('<div id="file_container" class="hidden"></div>');
        var container = {};
        container = $('#file_container');
        
        // Move files blocks to the temporarily created container
        for (var k in data.html) {
            $('#' + k + ' .fileuploader').each(function(idx, elm){
                var jelm = $(elm);
                var jparent = jelm.parents('.control-group');
                jparent.appendTo(container);
                jparent.prop('id', 'moved_' + jparent.prop('id'));
            });
        }
    }
}

function fn_post_process_form_files(data, params)
{
    var $ = Tygh.$;
    var container = {};
    container = $('#file_container');
    
    $('div.control-group', container).each(function(idx, elm){
        var jelm = $(elm);
        var elm_id = jelm.prop('id').replace('moved_', '');
        var target = $('#' + elm_id);
        target.html('');
        jelm.children().appendTo(target);
    });
    
    container.remove();
}

function fn_change_variant_image(prefix, opt_id, var_id)
{
    var $ = Tygh.$;
    var images = $('[id*=variant_image_' + prefix + '_' + opt_id + ']');
    images.removeClass('product-variant-image-selected').addClass('product-variant-image-unselected');
    
    if (typeof(var_id) == 'undefined') {
        var_id = $('select[id*=_' + prefix + '_' + opt_id + ']').val();
    }
    $('[id*=variant_image_' + prefix + '_' + opt_id + '_' + var_id + ']').removeClass('product-variant-image-unselected').addClass('product-variant-image-selected');
}