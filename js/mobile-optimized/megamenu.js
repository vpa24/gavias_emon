
(function($) {
    "use strict";

    jQuery(document).ready(function() {

        /* ------------------------------------------ */
        /* mobile menu */
        /* ------------------------------------------ */
        $('.gva-navigation a').on('click', function() {
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

                    item.parent('a').parent('li').find('> ul').slideUp();
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
            if ($(this).parent().hasClass('show')) {
                $(this).parent().removeClass('show');
            } else {
                $(this).parent().addClass('show');
            }
            e.stopPropagation();
        })






        // ============================================================================
        // add mega menu effect 
        // ============================================================================
        $('.navigation .gva_menu > li > ul.sub-menu.show-on-desktop, .navigation .gva_menu > li div.sub-menu.show-on-desktop').addClass('attach-transition');


    });

})(jQuery);





