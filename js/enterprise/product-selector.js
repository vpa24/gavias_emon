var keywordList = [];
var filterUrls = {};
var performFilter, performFilterByFilterNames;
var infinite;
var scrollToProductSelector;
var selectedProducts = [];

(function($) {
    "use strict";
    var filterCollapseStatus = {};
    var mobileFilter = 'expanded'; //expanded|collapsed
    var shareLink = '';

    jQuery(document).ready(function() {

        // ==============================================================
        // Naming Convention links
        // ==============================================================
        if (jQuery('#models').length == 1) {
            jQuery('#models .box-title').append(' <sup><a smooth href="#product-naming-conventions" class="fa fa-info-circle " style="color:#faab1a;font-size: 22px;cursor: pointer;"></a></sup>');
        }

        // ==============================================================
        // view-type
        // ==============================================================
        var currViewType = initViewType();

        function initViewType() {
            var type = Cookies.getJSON('smc-product-selector');
            if (type == undefined) {
                type = 'grid';
            } else {
                type = type.productVeiwType;
            }
            return type;
        }

        function setViewType() {
            var $list = jQuery('.product-selector-view .views-view-grid');
            var $choseToGrid = jQuery('.product-selector-view .grid-view-icon');
            var $choseToList = jQuery('.product-selector-view .list-view-icon');
            if (currViewType == 'grid') {
                $list.removeClass('list-view');
                $choseToGrid.addClass('selected').attr('src', '/sites/default/files/icons/grid-view-selected.jpg');
                $choseToList.removeClass('selected').attr('src', '/sites/default/files/icons/list-view.jpg');
            } else {
                $list.addClass('list-view');
                $choseToGrid.removeClass('selected').attr('src', '/sites/default/files/icons/grid-view.jpg');
                $choseToList.addClass('selected').attr('src', '/sites/default/files/icons/list-view-selected.jpg');
            }
            Waypoint.refreshAll();
        }
        jQuery(document).on('click', '.product-selector-view .grid-view-icon:not(.selected)', function() {
            currViewType = 'grid';
            Cookies.set('smc-product-selector', {
                productVeiwType: 'grid'
            });
            setViewType();
        });
        jQuery(document).on('click', '.product-selector-view .list-view-icon:not(.selected)', function() {
            currViewType = 'list';
            Cookies.set('smc-product-selector', {
                productVeiwType: 'list'
            });
            setViewType();
        });
        setViewType();

        // ==============================================================
        // collapsible filters
        // ==============================================================
        jQuery('.block-facets:not(.block-facets-summary)').each(function() {
            filterCollapseStatus[$(this).attr('id').split('--')[0]] = $(this).find('.expand-collapse-icon').hasClass('collapsed');
        });


        // ==============================================================
        // search 
        // ==============================================================
        jQuery("#keyword-search").html('<form style="position: relative; display: inline-block;" class="form-inline search-form search-block-form" id="keyword-search-form"><div class="input-group"><input id="keyword-search-input" class="form-control form-search" placeholder="Search"><div class="message"></div></div></form>');

        jQuery('[data-keyword]').each(function(index) {
            var filterName = jQuery.trim(jQuery(this).data('keyword'));
            var item = {
                type: "Filter",
                index: index,
                label: filterName
            };
            keywordList.push(item);
            filterUrls[filterName] = getFilterUrl(jQuery(this));
        });
        /*
        jQuery('[sku]').each(function(index) {
            var item = {type:"SKU", index: index, label: jQuery.trim(jQuery(this).text())};
            keywordList.push(item);
        });
        */

        var itemType = "";
        jQuery("#keyword-search-input").autocomplete({
            source: keywordList,
            response: function(event, ui) {
                if (ui.content.length === 0) {
                    $("#keyword-search-form .message").text("No results found");
                } else {
                    $("#keyword-search-form .message").empty();
                }
            },
            select: function(event, ui) {
                console.log(ui.item);
                var filterName = ui.item.label;
                triggerFilter(filterName, true);
                this.value = "";
                itemType = "";
                return false;
            }
        });
        /*        
                .autocomplete( "instance" )._renderItem = function( ul, item ) {
                    if (itemType != item.type) {
                        itemType = item.type;
                        return $( "<li>" )
                        .append( "<div style='background-color:#ccc; color:#222'>" + item.type + "</div><div>" + item.label + "</div>" )
                        .appendTo( ul );                
                    } else {
                        return $( "<li>" )
                        .append( "<div>" + item.label + "</div>" )
                        .appendTo( ul );
                    }
                };
        */

        // ==============================================================
        // filter ajax 
        // ==============================================================        
        bindFilterEvents();





        $(window).resize(function() {
            var winwidth = $(window).innerWidth();
            if (winwidth > 768) {
                jQuery('.sidebar-inner .filters').show();
            }
        });



        function bindFilterEvents() {


            $('#sku-search-input').keydown(function(event) {
                if (event.which == 13) {
                    $('#sku-search input[type=button]').click();
                    event.preventDefault();
                }
            });


            jQuery('.block-facets:not(.block-facets-summary) .block-title').on('click', function(e) {
                var $blockFacets = jQuery(this).closest('.block-facets');

                if (isMobile() && $blockFacets.find('.expand-collapse-icon').hasClass('collapsed')) {
                    collapseAllFilters();
                }

                $blockFacets.find('.expand-collapse-icon').toggleClass('collapsed');
                $blockFacets.find('.block-content').slideToggle();
                filterCollapseStatus[$blockFacets.attr('id').split('--')[0]] = $blockFacets.find('.expand-collapse-icon').hasClass('collapsed');
            });

            // ==============================================================
            // infinite scrolling
            // ==============================================================
            /*
            console.log("init Waypoint.Infinite");
            infinite = new Waypoint.Infinite({
              element: jQuery('.infinite-container')[0],
              onBeforePageLoad: function() {

                    var url = jQuery('.infinite-more-link').data('url');
                    url += "&page=" + jQuery('.infinite-more-link').data('page');
                    jQuery(".block-facets").each(function(){
                        jQuery(this).find(".facet-item a[checked]").each(function(index){
                            // add it to url
                            if (index == 0)
                                url += '&' + $(this).data("item-id") + "=" + encodeURI($(this).data("item-value"));
                            else
                                url += "," + encodeURI($(this).data("item-value"));
                        });
                    });

                    console.log('onBeforePageLoad: ' + url);
                    jQuery('.infinite-more-link').attr('href', url);
              },
              onAfterPageLoad: function($items, url) {
                    console.log('onAfterPageLoad: ' + url);
              },
              offset: 'bottom-in-view',
            });
            */

            // ==============================================================
            // show more / show less
            // ==============================================================
            jQuery('.paragraph--type--product-selector-structureddb .block-facets .facets-soft-limit-link').on('click', function() {
                var facet = $(this).closest('.block-facets');
                if (facet.find('li:hidden').length > 0) {
                    facet.find('li:gt(4)').slideDown();
                    $(this).addClass('open').text("Show less");
                } else {
                    facet.find('li:gt(4)').slideUp();
                    $(this).removeClass('open').text("Show more");
                }
                return false;
            });

            // ==============================================================
            // filters mobile behavior
            // ==============================================================
            if (mobileFilter == 'expanded' && isMobile()) {
                jQuery('.sidebar-inner .filters-mobile').addClass('expanded');
                jQuery('.sidebar-inner .filters').show();
                var $filter = getFirstExpandedFilter();
                collapseAllFilters();
                expandFilter($filter);
            }
            jQuery('.sidebar-inner .filters-mobile').on('click', function(e) {
                if (mobileFilter == 'collapsed') {
                    jQuery('.sidebar-inner .filters').slideDown();
                    mobileFilter = 'expanded';
                    jQuery('.sidebar-inner .filters-mobile').addClass('expanded');
                } else {
                    jQuery('.sidebar-inner .filters').slideUp();
                    mobileFilter = 'collapsed';
                    jQuery('.sidebar-inner .filters-mobile').removeClass('expanded');
                }
            });


            jQuery(".paragraph--type--product-selector-structureddb .facet-item a, .paragraph--type--product-selector-structureddb .block-facets-summary a, #sku-search input[type=button]").click(function(e) {
                e.preventDefault();

                if (document.getElementById("sku-search-input").checkValidity() == false) {
                    $("#sku-search-form")[0].reportValidity();
                    return;
                }


                //var link = $(this).attr('href');
                var link = "";


                // click from summary
                if ($(this).closest('.block-facets-summary').length) {
                    if ($(this).is('[data-item-id]')) {
                        console.log($(this).data("filter-id"));
                        //console.log(jQuery(".block-facets .facet-item").find('a[data-item-id='+ $(this).data("item-id") + '][data-item-value="'+ $(this).data("item-value").trim() + '"]'));
                        //jQuery(".block-facets .facet-item").find('a[data-item-id='+ $(this).data("item-id") + '][data-item-value="'+ $(this).data("item-value") + '"]').removeAttr('checked');
                        //
                        if ($(this).data("filter-id") == 'sku') {
                            $('input[name=sku]').val('');
                        } else {
                            jQuery(".block-facets .facet-item").find('a[data-filter-id="' + $(this).data("filter-id") + '"]').removeAttr('checked');
                        }

                    } else { // clear all
                        jQuery(".block-facets .facet-item a[checked]").each(function(index) {
                            $(this).removeAttr('checked');
                        });
                        $('input[name=sku]').val('');
                    }
                } else {
                    link += '&filter=' + $(this).data("item-id");
                }


                if (!$(this).is('[checked]')) {
                    $(this).attr('checked', '');
                    link += '&filtervalue=' + $(this).data("item-value");
                } else
                    $(this).removeAttr('checked');


                jQuery(".block-facets").each(function() {
                    jQuery(this).find(".facet-item a[checked]").each(function(index) {
                        // add it to url
                        if (index == 0)
                            link += '&' + $(this).data("item-id") + "=" + $(this).data("item-value");
                        else
                            link += "," + $(this).data("item-value");
                    });
                });


                // filter by sku
                link = $(this).attr('href') + encodeURI(link);
                var skuVal = $('form#sku-search-form input[name=sku]').val();
                if (skuVal != '') {
                    link += '&sku=' + encodeURIComponent(skuVal);
                }

                performFilter(link);


                selectedProducts = [];


            });

            jQuery(".paragraph--type--product-selector-structureddb .pager a").click(function(e) {
                e.preventDefault();
                var link = "";

                jQuery(".block-facets").each(function() {
                    jQuery(this).find(".facet-item a[checked]").each(function(index) {
                        // add it to url
                        if (index == 0)
                            link += '&' + $(this).data("item-id") + "=" + $(this).data("item-value");
                        else
                            link += "," + $(this).data("item-value");
                    });
                });

                // filter by sku
                link = $(this).attr('href') + encodeURI(link);
                var skuVal = $('form#sku-search-form input[name=sku]').val();
                if (skuVal != '') {
                    link += '&sku=' + encodeURIComponent(skuVal);
                }

                performFilter(link);
            });


        }


        performFilter = function(filterUrl) {
            console.log(filterUrl);
            jQuery('body').after(jQuery('<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>'));
            jQuery.ajax({
                url: filterUrl,
                type: 'GET',
                dataType: 'html',
                timeout: 30000,
                success: function(response) {
                    /*
                    if (infinite) {
                        infinite.destroy();
                    }
                    */

                    console.log("success");
                    var skuVal = jQuery("input[name=sku]").val();

                    if (filterUrl.indexOf("page") > 0) {
                        var $container = $(response).find('.infinite-container');

                        // if (selectedProducts.length == 4) {
                        //     $container.find('.product-selector-product:not(.compared-product) .add-to-compare input[type=checkbox]').attr('disabled', true);
                        //     $container.find('.product-selector-product:not(.compared-product) .add-to-compare').addClass('disabled');
                        // }

                        jQuery('.paragraph--type--product-selector-structureddb .infinite-container').append($container.html());
                        jQuery('.paragraph--type--product-selector-structureddb .pager').html($(response).find('.pager').html());
                        jQuery('.paragraph--type--product-selector-structureddb .sidebar-left').html($(response).find('.sidebar-left').html());

                    } else
                        jQuery('.paragraph--type--product-selector-structureddb .content').html(response);


                    $(".paragraph--type--product-selector-structureddb img.lazy").each(function() {
                        var url = $(this).attr("data-src");
                        $(this).attr("src", url);
                        $(this).removeClass("lazy");
                        $(this).removeAttr("data-src");
                    });


                    // sku value
                    jQuery("input[name=sku]").val(skuVal);


                    if (jQuery('.block-facets-summary .filter-item').length) {
                        jQuery('.block-facets-summary').show();
                    } else {
                        jQuery('.block-facets-summary').hide();
                    }

                    for (var blockId in filterCollapseStatus) {
                        if (filterCollapseStatus[blockId]) {
                            collapseFilter(jQuery('.block-facets[id=' + blockId + ']'));
                        }
                    }

                    // summary
                    jQuery(".block-facets .facet-item a[checked]").each(function() {
                        // display it in summary block
                        jQuery('.block-facets-summary .content ul').append(getFacetSummaryItem($(this).attr("href"), $(this).data("item-id"), $(this).data("item-value"), $(this).data("item-desc"), $(this).data("filter-id")));
                        jQuery('.block-facets-summary').show();
                    });
                    jQuery("input[name=sku]").each(function() {
                        var sku = $(this).val();
                        if (sku != "") {

                            var url = $(this).attr("href");
                            var id = sku;
                            var value = sku;
                            var label = "(" + sku + ")";
                            var filterId = "sku";

                            jQuery('.block-facets-summary .content ul').append(getFacetSummaryItem(url, id, value, label, filterId));
                            jQuery('.block-facets-summary').show();
                        }
                    });

                    bindFilterEvents();

                    if (filterUrl.indexOf("page") == -1 && scrollToProductSelector != false) {
                        var scrollToProduct = function() {
                            var $loading = jQuery('#resources .loading');
                            if (($loading.val() == undefined) || (!$loading.is(":visible"))) {
                                setTimeout(function() {
                                    scrollToAnchor('#models', 400);
                                }, 200);
                                return;
                            }
                            setTimeout(function() {
                                scrollToProduct();
                            }, 500);
                        }
                        scrollToProduct();
                    }

                    jQuery(document).trigger('ptCompare.productSelector.renderChosenGroupState');

                    setShareLink(filterUrl);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                    alert(xhr.statusText);
                },
                complete: function(jqXHR, textStatus) {
                    console.log("complete");
                    setViewType();
                    jQuery('.ajax-progress.ajax-progress-fullscreen').remove();
                }
            });
        };

        function collapseAllFilters() {
            jQuery('.block-facets:not(.block-facets-summary)').each(function() {
                collapseFilter(jQuery(this));
            });
        }

        function getFirstExpandedFilter() {
            for (var blockId in filterCollapseStatus) {
                if (filterCollapseStatus[blockId] == false) {
                    return jQuery('.block-facets[id=' + blockId + ']');
                }
            }
        }

        function collapseFilter($blockFacet) {
            if ($blockFacet == undefined || !$blockFacet.length)
                return;
            $blockFacet.find('.expand-collapse-icon').addClass('collapsed');
            $blockFacet.find('.block-content').hide();
            filterCollapseStatus[$blockFacet.attr('id').split('--')[0]] = true;
        }

        function expandFilter($blockFacet) {
            if ($blockFacet == undefined || !$blockFacet.length)
                return;
            $blockFacet.find('.expand-collapse-icon').removeClass('collapsed');
            $blockFacet.find('.block-content').show();
            filterCollapseStatus[$blockFacet.attr('id').split('--')[0]] = false;
        }

        function isMobile() {
            return jQuery('.sidebar-inner .filters-mobile').is(":visible");
        }

        function getFacetSummaryItem(url, id, value, label, filterId) {
            return '<div class="facet-item__status js-facet-deactivate filter-item">' +
                '    <a href="' + url + '" data-item-id="' + id + '" data-item-value="' + value + '" data-filter-id="' + filterId + '" >' +
                '        <span class="facet-item__value">' + label + '</span> <i class="fa fa-close"></i>' +
                '    </a>' +
                '</div>';
        }

        function getFilterUrl(filter) {
            var link = '&filter=' + filter.data("item-id");
            link += '&filtervalue=' + filter.data("item-value");
            link += '&' + filter.data("item-id") + "=" + filter.data("item-value");
            link = filter.attr('href') + encodeURI(link);
            return link;
        }

        performFilterByFilterNames = function(filterNames) {

            if (jQuery.isArray(filterNames)) {
                console.log("isArray");
                // TODO::

            } else if (filterNames.match(/%$/)) { // ends with %
                var filterPrefix = filterNames.slice(0, -1);
                var filters = jQuery(".block-facets .facet-item a[data-keyword^='" + filterPrefix + "']");
                console.log("filterPrefix=" + filterPrefix + ", length=" + filters.length);

                jQuery(".block-facets .facet-item a[checked]").each(function(index) {
                    jQuery(this).removeAttr('checked');
                });

                filters.each(function(index) {
                    if (index == (filters.length - 1)) { // last one 
                        jQuery(this).click();
                    } else {
                        jQuery(this).attr('checked', true);
                    }
                });

            } else { // single filter
                performFilter(filterUrls[filterNames]);
            }
        }

        function bindShareLink() {
            $('#models').on('click', '#pro-share-link', function() {
                var $obj = $(this).find('input[type=text]').val(shareLink);
                var copyText = $obj[0];

                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");
                $(this).addClass('copied');
                $(this).find('.tooltiptext').text('Copied');
                setTimeout(function() {
                    $obj.parent().removeClass('copied');
                    $obj.parent().find('.tooltiptext').text('Copy to clipboard');
                }, 1500);
            });
        }

        function setShareLink(filterUrl) {
            var url = location.protocol + '//' + location.host + location.pathname;
            shareLink = url + '#models';
            if (filterUrl.length <= 0) {
                return;
            }
            var excludeFilter = ['filter', 'filtervalue', 'block', 'lang', 'family', 'page', 'currentpage'];
            var filters = filterUrl.split('?');
            if (filters.length > 1) {
                filters = filters[1].split('&');
            }
            var attachVars = [];
            $.each(filters, function(index, value) {
                var filterItem = value.split('=');
                if (filterItem.length < 1) {
                    return;
                }
                for (var i = 0; i < excludeFilter.length; i++) {
                    if (filterItem[0] == excludeFilter[i]) {
                        return;
                    }
                }
                if (filterItem[0] == 'sku') {
                    attachVars.push('sku=' + decodeURIComponent(filterItem[1]));
                } else {
                    attachVars.push(decodeURI(value));
                }
            });
            if (attachVars.length <= 0) {
                return;
            }
            attachVars = attachVars.join('&');
            url += '?pro=' + encodeURIComponent(attachVars);
            shareLink = url;
        }
        setShareLink('');
        bindShareLink();

        function initPrint() {

            var elePrint = {};
            elePrint.container = $('#models');
            elePrint.list = elePrint.container.find('.product-selector-view .views-view-grid');
            var proType = elePrint.container.find('.product-selector').data('family-series');
            var switchLayout = function(isPrint, isList) {
                if (proType == 'systems') {
                    if (isPrint) {
                        if (!isList) {
                            elePrint.list.addClass('list-view');
                        }
                    } else {
                        if (!isList) {
                            elePrint.list.removeClass('list-view');
                        }
                    }
                } else {
                    if (isPrint) {
                        if (isList) {
                            elePrint.list.removeClass('list-view');
                        }
                    } else {
                        if (isList) {
                            elePrint.list.addClass('list-view');
                        }
                    }
                }

                if (isPrint) {
                    $('html').addClass('print-product-selector');
                } else {
                    $('html').removeClass('print-product-selector');
                }
            }
            var handleOnPrintClick = function() {
                var isList = true;
                if (!elePrint.list.hasClass('list-view')) {
                    isList = false;
                }
                switchLayout(true, isList);
                setTimeout(function() {
                    window.print();
                    setTimeout(function() {
                        switchLayout(false, isList);
                    }, 2000);
                }, 1000);
            }
            elePrint.container.on('click', '#pro-print', function() {
                handleOnPrintClick();
                return false;
            });

            var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
            if (isSafari) {
                $('html').addClass('is-safari');
            }
        }
        initPrint();

    });

})(jQuery);

function triggerFilterByParams(filterParams) {
    var link = jQuery(".filters .block-facets .facet-item a[href]:eq(0)").attr('href');
    var filters = filterParams.split('&');
    var attachVars = [];
    jQuery.each(filters, function(index, value) {
        var filterItem = value.split('=');
        if (filterItem[0] == 'sku') {
            if (filterItem.length < 1) {
                return;
            }
            jQuery('form#sku-search-form input[name=sku]').val(filterItem[1]);
            attachVars.push('sku=' + encodeURIComponent(filterItem[1]));
        } else {
            attachVars.push(encodeURI(value));
        }
    });
    attachVars = attachVars.join('&');
    performFilter(link + "&" + attachVars);
    // performFilter(link + "&" + encodeURI(filterParams));
    selectedProducts = [];
}

function triggerFilter(filterNames, clearAll) {
    if (clearAll) {
        performFilterByFilterNames(filterNames);
        selectedProducts = [];
    } else {
        var obj = jQuery("[data-keyword]").filter(function() {
            return jQuery(this).data("keyword") === filterNames;
        })
        console.log("[" + filterNames + "]...." + obj.length);
        if (obj.length == 1) {
            obj.removeAttr('checked');
            obj.click();
        } else { // search by SKU

        }
    }
}