(function($) {
    "use strict";

    jQuery(document).ready(function() {


        // ==============================================================
        // show more / show less
        // ==============================================================
        if (jQuery('#systems .gsc-column').length > 8) {
            jQuery('#systems .gsc-column:gt(7)').hide();
            jQuery('#systems .row').append("<div class='more'>Show more <i class='fa fa-angle-down'></i></div");

            jQuery('.more').on('click', function() {
                if ( jQuery(this).hasClass('less') ) {  
                    jQuery('#systems .gsc-column:gt(7)').slideUp();
                    jQuery(this).html("Show more <i class='fa fa-angle-down'></i>").removeClass('less');    
                } else {
                    jQuery('#systems .gsc-column:gt(7)').slideDown();
                    jQuery(this).html("Show less <i class='fa fa-angle-up'></i>").addClass('less'); 
                }
            });    
        }


        jQuery( '<div class="header-overlay"></div>' ).insertAfter( '.header-main.front-page' );


        
        $('.swiper-wrapper').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            //console.log("banner index: " + nextSlide);

            var $banner = $("[data-slick-index=" + nextSlide + "]").find('.banner');
            if ($banner.hasClass('light-layer-banner')) {
                $('.navigation .gva_menu > li > a').addClass('dark');
                $('header .front-page #shopping-cart-layer .cls-1').addClass('dark');
                $('header .front-page .gva-search-region .icon .search .st0').addClass('dark');
                $('.header-overlay').addClass('light');
            }
            else {
                $('.navigation .gva_menu > li > a').removeClass('dark');
                $('header .front-page #shopping-cart-layer .cls-1').removeClass('dark');
                $('header .front-page .gva-search-region .icon .search .st0').removeClass('dark');
                $('.header-overlay').removeClass('light');
            }            

            if ($banner.hasClass('no-overlay-banner')) {
                $('.header-overlay').hide();
            }
            else {
                $('.header-overlay').show();
            }            

        });

        $('#computex-video-btn').click(function() {
            $('.swiper-wrapper').slick('slickPause');
        });

        $('#systems .column-inner .team-body').click(function(e) {
            window.location.href = $(this).closest('.column-inner').find('.team-header a').attr('href');
        });

    });

})(jQuery);
