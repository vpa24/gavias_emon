
var ptCompare = {};
(function ($) {
    ptCompare.history = {};
    ptCompare.history.setting = {
        localStorageID: 'ptCompare',
        family: '',
        compareItems: [],
        allCompareItems: {
            systems: [],
            motherboards: [],
            chassis: []
        },
        maxLimit: 4,
        compareWindow: null,
        highlightDiff: true
    }
    ptCompare.history.getSetting = function () {
        var $ele = $('.js-ptCompare-setting');
        if ($ele.length <= 0) {
            return;
        }
        var familySeries = $ele.data('family-series');
        if (familySeries == 'system') {
            familySeries = 'systems';
        }
        ptCompare.history.setting.family = familySeries;
        var defaultStoreSetting = {
            systems: [],
            motherboards: [],
            chassis: []
        }
        var storeSetting = localStorage.getItem(ptCompare.history.setting.localStorageID) || '{}';
        storeSetting = JSON.parse(storeSetting);
        if (storeSetting.allCompareItems != undefined) {
            for (var key in ptCompare.history.setting.allCompareItems) {
                if (storeSetting.allCompareItems.hasOwnProperty(key)) {
                    ptCompare.history.setting.allCompareItems[key] = storeSetting.allCompareItems[key];
                }
            }
        }
        ptCompare.history.setting.compareItems = ptCompare.history.setting.allCompareItems[ptCompare.history.setting.family];
        if (storeSetting.highlightDiff != undefined) {
            ptCompare.history.setting.highlightDiff = storeSetting.highlightDiff
        }
    }
    ptCompare.history.storeSetting = function () {
        ptCompare.history.setting.allCompareItems[ptCompare.history.setting.family] = ptCompare.history.setting.compareItems;
        var storeSetting = {
            'allCompareItems': ptCompare.history.setting.allCompareItems,
            'highlightDiff': ptCompare.history.setting.highlightDiff
        }
        localStorage.setItem(ptCompare.history.setting.localStorageID, JSON.stringify(storeSetting));
        //console.log(ptCompare.history.setting);
    }
    ptCompare.history.addProduct = function (skuFeature, successCallback, failCallback) {
        if (!ptCompare.history.couldPushItem()) {
            if (failCallback != undefined) {
                failCallback();
            }
            return;
        }
        if (!ptCompare.history.hasProduct(skuFeature.sku)) {
            ptCompare.history.setting.compareItems.push(skuFeature);
            ptCompare.history.storeSetting();
        }
        if (successCallback != undefined) {
            successCallback();
        }
    }
    ptCompare.history.removeProduct = function (sku) {
        var arrayRemove = function (arr, value) {
            return arr.filter(function (ele) {
                return ele.sku != value;
            });
        }
        ptCompare.history.setting.compareItems = arrayRemove(ptCompare.history.setting.compareItems, sku);
        ptCompare.history.storeSetting();
    }
    ptCompare.history.clearProduct = function () {
        ptCompare.history.setting.compareItems = [];
        ptCompare.history.storeSetting();
    }
    ptCompare.history.couldPushItem = function (sku) {
        if (ptCompare.history.setting.compareItems.length >= ptCompare.history.setting.maxLimit) {
            return false;
        } else {
            return true;
        }
    }
    ptCompare.history.hasProduct = function (sku) {
        var arr = ptCompare.history.setting.compareItems;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].sku == sku) {
                return true;
            }
        }
        return false;
    }
    ptCompare.history.getCompareItems = function () {
        return ptCompare.history.setting.compareItems;
    }
    ptCompare.history.goCompareMatrixPage = function (proList, isNewOpen) {
        var compareWindow = ptCompare.history.setting.compareWindow;
        if (proList == null) {
            proList = [];
            var compareItems = ptCompare.history.setting.compareItems;
            for (var i = 0; i < compareItems.length; ++i) {
                proList.push(compareItems[i].sku);
            }
        }

        var str = [];
        for (var i = 0; i < proList.length; ++i) {
            str.push(encodeURIComponent(proList[i].replace('_', '+').replace('AS-', 'AS -')));
        }

        var pageUrl = Drupal.url('products/compare?sku=' + str.join(','));
        if (isNewOpen == true) {
            if (compareWindow !== null) {
                compareWindow.close();
            }
            compareWindow = window.open(pageUrl, 'smc-product-compare');
            compareWindow.focus();
        } else {
            document.location.href = pageUrl;
        }

    }
    ptCompare.history.setHighlightStatus = function (status) {
        ptCompare.history.setting.highlightDiff = status;
        ptCompare.history.storeSetting();
    }
    ptCompare.history.getHighlightStatus = function () {
        return ptCompare.history.setting.highlightDiff;
    }
    ptCompare.history.attachHandler = function () {
        $(window).on('focus', function (event) {
            var $ele = $('.js-ptCompare-setting');
            if ($ele.length <= 0) {
                return;
            }
            ptCompare.history.getSetting();
            $(document).trigger('ptCompare.compareTray.renderLayout');
            $(document).trigger('ptCompare.productSelector.renderChosenGroupState');
        });
    }
    ptCompare.init = function () {
        ptCompare.history.getSetting();
        ptCompare.history.attachHandler();
        //console.log(ptCompare.history.setting);
    }();
})(jQuery);


(function ($) {
    ptCompare.productSelector = {};
    function attachHandler() {
        $(document).on('click', '.js-ptCompare-chosen .js-ptCompare-control', function (event) {
            var $target = $(event.target);
            var $targetProduct = $target.closest('.js-ptCompare-chosen');
            var sku = $targetProduct.data('sku');
            if ($target.prop('checked')) {
                var productFeature = {
                    sku: sku,
                    specUrl: $targetProduct.find('a').attr('href'),
                    specImg: $targetProduct.find('.product-image-hover-box img').attr('src')
                }
                ptCompare.history.addProduct(productFeature, function () {
                    renderChosenState($targetProduct, true);
                    renderChosenLimitState();
                    $(document).trigger('ptCompare.compareTray.renderLayout');
                }, function () {
                    renderChosenState($targetProduct, false);
                    renderChosenLimitState();
                });
            } else {
                ptCompare.history.removeProduct(sku);
                renderChosenState($targetProduct, false);
                renderChosenLimitState();
                $(document).trigger('ptCompare.compareTray.renderLayout');
            }
            //console.log(ptCompare.history.setting);
        });
        $(document).on('ptCompare.productSelector.renderChosenGroupState', function () {
            renderChosenGroupState();
        });
    }
    function renderChosenState($targetProduct, checked) {
        if (checked) {
            $targetProduct.addClass('js-ptCompare-chosen-selected');
            $targetProduct.find('.js-ptCompare-control').prop('checked', true);
        } else {
            $targetProduct.removeClass('js-ptCompare-chosen-selected');
            $targetProduct.find('.js-ptCompare-control').prop('checked', false);
        }
    }
    function renderChosenGroupState() {
        var proList = ptCompare.history.getCompareItems();
        $('.js-ptCompare-chosen.js-ptCompare-chosen-selected').each(function () {
            renderChosenState($(this), false);
        });
        for (var i = 0; i < proList.length; ++i) {
            var $obj = $('#' + proList[i].sku.replace('+', '_') + '.js-ptCompare-chosen');
            renderChosenState($obj, true);
        }
        renderChosenLimitState();
    }
    function renderChosenLimitState() {
        if (ptCompare.history.couldPushItem()) {
            $('body').removeClass('js-ptCompare-limit');
            $('.js-ptCompare-chosen:not(.js-ptCompare-chosen-selected)').find('.js-ptCompare-control').prop('disabled', false);
        } else {
            $('body').addClass('js-ptCompare-limit');
            $('.js-ptCompare-chosen:not(.js-ptCompare-chosen-selected)').find('.js-ptCompare-control').prop('disabled', true);
        }
    }
    function init() {
        attachHandler();
        renderChosenGroupState();
    };
    init();
})(jQuery);

(function ($) {

    var $container = $('#compare-tray');
    var compareWindow = null;
    var historyCompareNum = null;

    function attachHandler() {
        $(document).on('ptCompare.compareTray.renderLayout', function () {
            renderLayout();
        });
        $container.on('click', '.js-ptCompare-remove', function (event) {
            var sku = $(this).closest('.js-ptCompare-product').data('sku');
            ptCompare.history.removeProduct(sku);
            renderLayout();
            $(document).trigger('ptCompare.productSelector.renderChosenGroupState');
        });
        $container.on('click', '.js-ptCompare-remove-all', function (event) {
            ptCompare.history.clearProduct();
            renderLayout();
            $(document).trigger('ptCompare.productSelector.renderChosenGroupState');
        });
        $container.on('click', '.js-ptCompare-view-items', function (event) {
            showCompareItems();
        });
        $container.on('click', '.js-ptCompare-go', function (event) {
            ptCompare.history.goCompareMatrixPage(null, true);
        });
    }

    function getProductTempHtml() {

        return '\
        <div class="selected-product js-ptCompare-product" data-sku="%sku%">\
            <div class="close-compare js-ptCompare-remove"><i class="fa fa-times-circle-o"></i></div>\
            <a href="%specUrl%" target="smc-spec">\
                <div class="product-image-hover-box">\
                    <img src="%specImg%">\
                </div>\
                <span class="compare-sku">%title%</span>\
            </a>\
        </div>\
        ';

    }

    function renderLayoutForList() {
        var proList = ptCompare.history.getCompareItems();
        var htmlTemp = getProductTempHtml();
        var str = '';
        for (var i = 0; i < proList.length; ++i) {
            var productInfo = htmlTemp;
            productInfo = productInfo.replace('%sku%', proList[i].sku);
            productInfo = productInfo.replace('%specImg%', proList[i].specImg);
            productInfo = productInfo.replace('%specUrl%', proList[i].specUrl);
            productInfo = productInfo.replace('%title%', proList[i].sku.replace('_', '+').replace('AS-', 'AS -'));
            str += productInfo;
        }
        $container.find('.js-ptCompare-compare-items').html(str);
    }

    function renderLayout() {
        var proList = ptCompare.history.getCompareItems();
        renderLayoutForList();
        $container.find('.js-ptCompare-total').text(proList.length);
        $container.find('.js-ptCompare-total-max').text(ptCompare.history.setting.maxLimit);
        if (proList.length > 0) {
            $container.show();
            $container.find('.js-ptCompare-view-items').show();
        } else {
            $container.fadeOut(200);
            $container.find('.js-ptCompare-view-items').removeClass('more').hide();
            $container.find('.js-ptCompare-compare-items').hide();
        }
        if ((historyCompareNum == 0) && (proList.length == 1)) {
            setTimeout(function () {
                $container.addClass('hvr-wobble-vertical');
            }, 200);
        }
        historyCompareNum = proList.length;
    }


    function showCompareItems(isShow) {
        $container.find('.js-ptCompare-view-items').toggleClass('more');
        $container.find('.js-ptCompare-compare-items').slideToggle();
    }

    function init() {
        if ($container.length <= 0) {
            return;
        }
        attachHandler();
        renderLayout();
    }

    init();
})(jQuery);



(function ($) {

    var $container = $('.js-ptCompare-matrix');
    var ele = {};
    var windowWidth;
    function reLoadPageForDelete(sku) {
        var proList = [];
        $container.find('.js-ptCompare-product').each(function () {
            var proSku = $(this).data('sku');
            if (proSku != sku) {
                proList.push($(this).data('sku'));
            }
        });
        if (proList.length <= 0) {
            reLoadPageForDeleteAll();
            return;
        }
        ptCompare.history.goCompareMatrixPage(proList, false);
    }

    function reLoadPageForDeleteAll() {
        if (window.opener != null) {
            window.close();
            window.opener.focus();
            return;
        }
        var familyName = $container.find('.js-ptCompare-product:first-of-type .family').text();
        if (familyName.length <= 0) {
            familyName = $('.js-ptCompare-setting').data('family-name');
        }
        window.location = '/' + drupalSettings.path.currentLanguage + '/products/' + familyName;
    }

    function highlightDiff(isShowDiff) {
        $container.find('.js-ptCompare-highlight').prop('checked', isShowDiff);
        if (!isShowDiff) {
            $container.find('.compare-diff').removeClass('compare-diff');
            return;
        }
        var $rows = $container.find('.compare-row:not(.image-row)');
        $rows.each(function () {
            var $items = $(this).find('.compare-feature-title').next().find('.compare-feature-value');
            var diffRec = new Array($items.length);
            var max = 0;
            for (var i = 0; i < diffRec.length; i++) {
                //console.log('i' + i);
                diffRec[i] = 0;
                for (var j = 0; j < diffRec.length; j++) {
                    //console.log('j' + j);
                    if (i == j) {
                        continue;
                    }
                    if ($($items[i]).text() == $($items[j]).text()) {
                        diffRec[i] = diffRec[i] + 1;
                    }
                }
                if (diffRec[i] > max) {
                    max = diffRec[i];
                }
            }

            var rec;
            var start = 0;
            if (diffRec.length == 2) {
                start = 1;
            }
            for (var i = start; i < diffRec.length; i++) {
                var isDiff = false;
                if (diffRec[i] <= 0) {
                    isDiff = true;
                }
                if (diffRec[i] < max) {
                    isDiff = true;
                }

                if (diffRec.join('') == '1111') {
                    isDiff = true;
                }

                if (isDiff == true) {
                    //$($items[i]).addClass('compare-diff');
                    $($items[i]).closest('.compare-row').addClass('compare-diff');
                }
            }
        });
    }

    function attachHandler() {
        $container.on('click', '.js-ptCompare-remove', function (event) {
            var sku = $(this).closest('.js-ptCompare-product').data('sku');
            ptCompare.history.removeProduct(sku);
            reLoadPageForDelete(sku);
        });
        $container.on('click', '.js-ptCompare-remove-all', function (event) {
            ptCompare.history.clearProduct();
            reLoadPageForDeleteAll();
        });
        $container.on('click', '.js-ptCompare-highlight', function (event) {
            var status = $(this).prop('checked');
            highlightDiff(status);
            ptCompare.history.setHighlightStatus(status);
        });
        $container.on('click', '.js-ptCompare-print', function (event) {
            window.print();
        });
    }

    function attachHandlerForScroll() {
        ele.scrollLeft.on('click', function () {
            var itmeWidth = $('.js-ptCompare-product:first-of-type').outerWidth();
            ele.scroll.animate({ scrollLeft: ele.scroll.scrollLeft() - itmeWidth }, 500);
            checkArrowShow();
        });
        ele.scrollRight.on('click', function () {
            var itmeWidth = $('.js-ptCompare-product:first-of-type').outerWidth();
            ele.scroll.animate({ scrollLeft: ele.scroll.scrollLeft() + itmeWidth }, 500);
            checkArrowShow();
        });
        ele.scroll.on('scroll', function () {
            checkArrowShow();
        });
        $(window).on('resize', function () {
            if ($(window).width() == windowWidth) {
                return;
            }
            windowWidth = $(window).width();
            ele.scroll.scrollLeft(0);
            checkArrowShow();
        });
    }

    function checkArrowShow() {
        var itmeWidth = $('.js-ptCompare-product:first-of-type').outerWidth();
        var totalWidth = ($('.js-ptCompare-product').length * itmeWidth) + 150 - 2;
        var maxWidth = totalWidth - ele.scroll.outerWidth();
        var currentPosition = ele.scroll.scrollLeft();
        if (totalWidth <= ele.scroll.innerWidth()) {
            ele.scrollRight.hide();
            ele.scrollLeft.hide();
        } else {
            ele.scrollRight.show();
            ele.scrollLeft.show();
        }
        if (currentPosition >= maxWidth) {
            ele.scrollRight.prop('disabled', true);
        } else {
            ele.scrollRight.prop('disabled', false);
        }
        if (currentPosition <= 0) {
            ele.scrollLeft.prop('disabled', true);
        } else {
            ele.scrollLeft.prop('disabled', false);
        }
    }

    function renderScrollEffects() {

        ele.scrollLeft = $('<button class="s-btn-clear scroll-prev scroll-arrow js-scroll-prev"><i class="fa fa-angle-left"></i></button>');
        ele.scrollRight = $('<button class="s-btn-clear scroll-next scroll-arrow js-scroll-next"><i class="fa fa-angle-right"></i></button>');
        ele.scrollBox = $container;
        ele.scroll = ele.scrollBox.find('.product-compare-scroll');
        ele.scrollBox.find('.product-compare-main').append(ele.scrollLeft);
        ele.scrollBox.find('.product-compare-main').append(ele.scrollRight);
        checkArrowShow();
    }

    function renderLayout() {
        if (ptCompare.history.getHighlightStatus()) {
            highlightDiff(true);
        }
        renderScrollEffects();
    }

    function init() {
        if ($container.length <= 0) {
            return
        }
        renderLayout();
        attachHandler();
        attachHandlerForScroll();
    };

    init();
})(jQuery);




(function ($) {
    "use strict";

    jQuery(document).ready(function () {

        // ------------------------------------------------
        // sticky image row
        // ------------------------------------------------
        var $imageRow = $(".product-compare-main .image-row");
        var width = $imageRow.width();

        if ($imageRow.length <= 0) {
            return;
        }

        function initSticky() {
            return new Waypoint.Sticky({
                element: $('.product-compare-main .image-row')[0],
                stuckClass: 'image-stuck',
                handler: function (direction) {
                    if (direction === 'down') { // stuck
                        jQuery(".product-compare-main .image-row.image-stuck").width(width);
                    } else {
                        jQuery(".product-compare-main .image-row").css('width', '');
                    }
                },
                offset: 100
            })
        }

        $(window).resize(function () {
            if (sticky != undefined) {
                sticky.destroy();
            }
            jQuery(".product-compare-main .image-row").css('width', '');
            width = $imageRow.width();

            if ($(window).innerWidth() > 1200 && $(".product-compare-main .sticky-wrapper").length == 0) {
                sticky = initSticky();
            }
        });


        $(window).scroll(function () {
            if ($(window).innerWidth() > 1200 &&
                $(window).scrollTop() < (parseInt($(".product-compare-main").css('margin-top')) + $(".product-compare-main").outerHeight() - $('.image-row').outerHeight())
            ) {
                if ($(".product-compare-main .sticky-wrapper").length == 0) {
                    sticky = initSticky();
                }
            } else {
                if (sticky != undefined) {
                    sticky.destroy();
                }
                jQuery(".product-compare-main .image-row.image-stuck").removeClass('image-stuck');
            }
        });

        var sticky;
        if ($(window).innerWidth() > 1200) {
            sticky = initSticky();
        }
    });

})(jQuery);