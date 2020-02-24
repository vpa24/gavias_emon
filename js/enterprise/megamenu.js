(function($) {
    "use strict";

    jQuery(document).ready(function() {
        jQuery("header .sub-menu .product-image").show();
        $("header .sub-menu img.lazy").each(function() {
            var url = $(this).attr("data-src");
            $(this).attr("src", url);
            $(this).removeClass("lazy");
            $(this).removeAttr("data-src");
        });


        /* ------------------------------------------ */
        /* menu */
        /* ------------------------------------------ */
        jQuery('.navigation .gva_menu > li.menu-item > .sub-menu').hover(
            function() {
                jQuery(this).parent().children('a').addClass('active');
            },
            function() {
                jQuery(this).parent().children('a').removeClass('active');
            }
        );

        // add overlay when mouse over 
        var megaMenuDelayTimer = null;
        jQuery('.navigation .gva_menu > li.menu-item').mouseenter(function() {
            if (megaMenuDelayTimer != null) {
                clearTimeout(megaMenuDelayTimer);
                megaMenuDelayTimer = null;
            }
            var $obj = $(this);
            megaMenuDelayTimer = setTimeout(function() {
                jQuery('.navigation .gva_menu > li.menu-item.show-sub-menu').removeClass('show-sub-menu');
                $obj.addClass('show-sub-menu');
                if (jQuery('.main.main-page .page-overlay').length <= 0) {
                    jQuery('.main.main-page').append('<div class="page-overlay"></div>');
                }
                megaMenuDelayTimer = null;
            }, 600);
        }).mouseleave(function() {
            if (megaMenuDelayTimer != null) {
                clearTimeout(megaMenuDelayTimer);
                megaMenuDelayTimer = null;
            }
            megaMenuDelayTimer = setTimeout(function() {
                jQuery('.navigation .gva_menu > li.menu-item.show-sub-menu').removeClass('show-sub-menu');
                jQuery('.main.main-page .page-overlay').remove();
                megaMenuDelayTimer = null;
            }, 700);
        });


        // show description when mouse over 
        jQuery('.gva-mega-menu .block.block-quicktabs .quicktabs-main .menu-item').hover(
            function() {
                jQuery(this).find('ul').stop(true, true).delay(400).slideDown('500');
            },
            function() {
                jQuery(this).find('ul').stop(true, true).delay(400).slideUp('500');
            }
        );

        // ============================================================================
        // add mega menu effect 
        // ============================================================================
        $('.navigation .gva_menu > li > ul.sub-menu.show-on-desktop, .navigation .gva_menu > li div.sub-menu.show-on-desktop').addClass('attach-transition');

        // set megamenu height
        function calculateMegamenuHeihgt() {
            $('.gva_menu .sub-menu.show-on-desktop:hidden').show();

            var eleProductMenu = {};
            eleProductMenu.menu = $('#quicktabs-container-products_menu_enterprise');

            var calculateProductCategoryHeight = function($obj) {
                var maxHeight = 0;
                var $eleProductCat = $obj.find('.menu-category');
                $eleProductCat.css('height', '');
                $eleProductCat.each(function(index) {
                    if ($(this).outerHeight() > maxHeight) {
                        maxHeight = $(this).outerHeight() + 10;
                    }
                });
                $eleProductCat.outerHeight(maxHeight);
            }

            var calculateTabHeight = function() {
                var maxHeight = 0;
                var eleTabs = $(".quicktabs-tabpage");
                var $preShowMenu;
                maxHeight = 0;
                eleTabs.css('height', '');
                eleTabs.each(function(index) {
                    var isHide = false;
                    if ($(this).hasClass('quicktabs-hide')) {
                        isHide = true;
                        $(this).removeClass('quicktabs-hide');
                    }

                    if ($(this).hasClass('js-menu-category')) {
                        $preShowMenu = $(this).find('.col:first-child .menu-item:first-of-type ul');
                        $preShowMenu.show();
                        calculateProductCategoryHeight($(this));
                    }

                    var eleHeight = $(this).outerHeight();
                    if ($(this).hasClass('solution')) {
                        eleHeight -= 45;
                    }
                    if (eleHeight > maxHeight) {
                        maxHeight = eleHeight;
                    }

                    if ($(this).hasClass('js-menu-category')) {
                        $preShowMenu.hide();
                    }

                    if (isHide) {
                        $(this).addClass('quicktabs-hide');
                    }

                });
                eleTabs.outerHeight(maxHeight + 10);
                eleTabs.filter('.solution').outerHeight(maxHeight + 10 + 45);
            }
            calculateTabHeight();


        };
        calculateMegamenuHeihgt();
        var calculateMegamenuTimer;
        $(window).resize(function() {
            if (calculateMegamenuTimer != undefined) {
                clearTimeout(calculateMegamenuTimer);
            }
            calculateMegamenuTimer = setTimeout(function() {
                calculateMegamenuHeihgt();
            }, 2000);
        });

        // megamenu product category hover animation
        //$('#quicktabs-container-products_menu_enterprise .col > a').hover(function () {
        //    $(this).addClass('product-active');
        //});
        //$('#quicktabs-container-products_menu_enterprise .col').mouseleave(function () {
        //    $(this).find('>a').removeClass('product-active');
        //});


        /* ------------------------------------------ */
        /* mobile menu */
        /* ------------------------------------------ */
        $('.gva-navigation > ul.gva_menu_main > li.menu-item > a, .gva-navigation > ul.gva_menu_main > li.menu-item > ul:not(.show-on-desktop) a').on('click', function() {
            console.log($(this));
            var item = $(this).find(".nav-plus");
            if (item.length) {
                if (item.hasClass('nav-minus') == false) {
                    // expand
                    if (item.parent('a').parent('li').find('> ul').length == 2) {
                        //item.parent('a').parent('li').find('> ul.show-on-mobile').css("cssText", "display:block;");
                        item.parent('a').parent('li').find('> ul.show-on-mobile').slideDown();
                    } else {
                        item.parent('a').parent('li').find('> ul').slideDown();
                    }

                    item.addClass('nav-minus');
                } else {
                    item.parent('a').parent('li').find('> ul:not(.show-on-desktop)').slideUp();
                    item.removeClass('nav-minus');
                }
                return false;
            }
            return true;
        });


        $('#menu-bar').on('click', function(e) {
            if ($('.gva-navigation').hasClass('show-view')) {
                $(this).removeClass('show-view');
                $('.gva-navigation').removeClass('show-view');
                $('.header-right').removeClass('show-view');

                $('html, body').css('overflow', 'auto');
                $('.sub-menu.show-on-mobile').addClass('hide-on-desktop').removeClass('show-on-mobile');
                $('#search-sku-form').show();


            } else {
                $(this).addClass('show-view');
                $('.gva-navigation').addClass('show-view');
                $('.header-right').addClass('show-view');

                $('html, body').css('overflow', 'hidden');
                $('.sub-menu.hide-on-desktop').addClass('show-on-mobile').removeClass('hide-on-desktop');
                $('#search-sku-form').hide();
            }

            e.stopPropagation();
        })



        /* ------------------------------------------ */
        /* search */
        /* ------------------------------------------ */
        $('.gva-search-region .icon').on('click', function(e) {
            $('.search-content').animate({
                opacity: 'toggle',
                width: 'toggle'
            }, 300);

            if ($(this).parent().hasClass('show')) {
                $(this).parent().removeClass('show');
                $(this).find('.search').show();
                $(this).find('.fa-close').hide();
            } else {
                $(this).parent().addClass('show');
                $('input[id=edit-search]').focus();

                $(this).find('.search').hide();
                $(this).find('.fa-close').show();
            }
            e.stopPropagation();

        })

        $(window).click(function() {

            if ($('.gva-search-region .icon').parent().hasClass('show')) {
                $('.search-content').animate({
                    opacity: 'toggle',
                    width: 'toggle'
                }, 300);

                $('.gva-search-region .icon').parent().removeClass('show');
                $('.gva-search-region .icon .search').show();
                $('.gva-search-region .icon .fa-close').hide();
            }


            if ($('.gva-navigation').hasClass('show-view') && $(window).innerWidth() < 991) {
                $('#menu-bar').removeClass('show-view');
                $('.gva-navigation').removeClass('show-view');
                $('.header-right').removeClass('show-view');

                $('html, body').css('overflow', 'auto');
                $('.sub-menu.show-on-mobile').addClass('hide-on-desktop').removeClass('show-on-mobile');
                $('#search-sku-form').show();
            }

        });

        $('.search-content').click(function(event) {
            event.stopPropagation();
        });
        $('.gva-navigation.show-view').click(function(event) {
            event.stopPropagation();
        });


    });

})(jQuery);