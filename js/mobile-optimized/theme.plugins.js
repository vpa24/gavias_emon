
(function($) {
    "use strict";

    //------- OWL carousle init  ---------------
    jQuery(document).ready(function() {
        $('.init-carousel-owl').each(function() {
            var items = 4;
            var items_lg = 3;
            var items_md = 2;
            items = $(this).data('items');
            switch (items) {
                case 1:
                    items_lg = items_md = 1;
                    break;
                case 2:
                    items_lg = items_md = 2;
                    break;
                case 3:
                    items_lg = 3;
                    items_md = 2;
                    break;
                case 4:
                    items_lg = 3;
                    items_md = 2;
                    break;
                case 5:
                    items_lg = 4;
                    items_md = 2;
                    break;
                case 6:
                    items_lg = 4;
                    items_md = 2;
                    break;
                default:
                    items_lg = items - 2;
                    items_md = items - 3;
            }

            $(this).owlCarousel({
                nav: true,
                autoplay: false,
                autoplayTimeout: 20000,
                smartSpeed: 350,
                navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                autoHeight: false,
                loop: false,
                responsive: {
                    0: {
                        items: 1,
                        nav: false
                    },
                    640: {
                        items: items_md
                    },
                    992: {
                        items: items_lg
                    },
                    1200: {
                        items: items
                    }
                }
            });
        });

        if ($(window).width() > 780) {
            if ($.fn.jpreLoader) {
                var $preloader = $('.js-preloader');
                $preloader.jpreLoader({
                    autoClose: true,
                }, function() {
                    $preloader.addClass('preloader-done');
                    $('body').trigger('preloader-done');
                    $(window).trigger('resize');
                });
            }
        } else {
            $('body').removeClass('js-preloader');
        };

        var $container = $('.post-masonry-style');
        $container.imagesLoaded(function() {
            $container.masonry({
                itemSelector: '.item-masory',
                gutterWidth: 0,
                columnWidth: 1,
            });
        });

        if ($('.post-masonry-style').length) {
            $('.block-views').bind('DOMNodeInserted', function(event) {
                if ($(this).find('.post-masonry-style').length) {
                    var $container = $('.post-masonry-style');
                    $container.imagesLoaded(function() {
                        $container.masonry({
                            itemSelector: '.item-masory',
                            gutterWidth: 0,
                            columnWidth: 1,
                        });
                    });
                }
            });
        }

        /*-------------Milestone Counter----------*/
        jQuery('.milestone-block').each(function() {
            jQuery(this).appear(function() {
                var $endNum = parseInt(jQuery(this).find('.milestone-number').text());
                jQuery(this).find('.milestone-number').countTo({
                    from: 0,
                    to: $endNum,
                    speed: 4000,
                    refreshInterval: 60,
                });
            }, { accX: 0, accY: 0 });
        });


        /*========== product family dropdown on mobile  ==========*/
        jQuery('.selected-product-family li.active').on('click', function(e) {
            if (jQuery(this).find('.icaret').hasClass('fa-angle-down')) {
                jQuery(this).find('.icaret').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                jQuery(this).find('.icaret').removeClass('fa-angle-up').addClass('fa-angle-down');
            }

            jQuery('.mobile-style-tab').slideToggle();
            e.stopPropagation();
        });
        if (jQuery.trim(jQuery('.selected-product-family li.active a').text()) == "") {
            jQuery('.selected-product-family').hide();
            jQuery('.mobile-style-tab').show();
        }

        /*========== product type dropdown on mobile  ==========*/
        jQuery('.selected-product-type li').on('click', function(e) {
            if (jQuery(this).find('.icaret').hasClass('fa-angle-down')) {
                jQuery(this).find('.icaret').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                jQuery(this).find('.icaret').removeClass('fa-angle-up').addClass('fa-angle-down');
            }

            if ($(e.target).is('a')) {
                e.preventDefault();
            }
            jQuery('.product-type-tab').slideToggle();
            e.stopPropagation();
        });


        /*========== fade in  ==========*/
        jQuery(window).scroll(function() {
            /* Check the location of each desired element */
            jQuery('.hideme').each(function(i) {
                var bottom_of_object = jQuery(this).offset().top + jQuery(this).outerHeight();
                var bottom_of_window = jQuery(window).scrollTop() + jQuery(window).height();

                /* If the object is completely visible in the window, fade it it */
                if (bottom_of_window > bottom_of_object) {
                    jQuery(this).animate({ 'opacity': '1' }, 1000);
                }
            });
        });

        function slideToggle(selector) {
            $(selector).slideToggle();
        }


        /*-------------------------------------------------------*/
        /* product filters
        /*-------------------------------------------------------*/
        function performFilter(index) {
            var productGenFilter = $('.product-generation-filter').eq(index).find('.active a').data('filter');
            if (productGenFilter !== undefined)
                productGenFilter = "." + productGenFilter;
            else
                productGenFilter = "";

            var secondFilter =  $('.portfolio-filter').eq(index).find('a.active').data('filter');
            if (secondFilter === undefined)
                secondFilter = "*";

            var fullFilter = secondFilter+productGenFilter;
            console.log("filter=" + fullFilter + " (" + index + ")");
            $('.isotope-items').eq(index).isotope({ filter: fullFilter });

            // reload skuList for autocomplete
            $('#search-sku-input').val('');
            skuList = [];
            $('[sku]').each(function() {
                if ($(this).parents(fullFilter).is(":visible"))
                    skuList.push($.trim($(this).text()));
            });
            $("#search-sku-input").autocomplete('option', 'source', skuList);
        }

        if ($.fn.isotope) {
            $('.isotope-items').each(function(index) {
                var $el = $(this),
                    $portfolioFilter = $('.portfolio-filter').eq(index),
                    $filter = $portfolioFilter.find('a'),
                    $loop = $(this);

                //$loop.isotope();
                var v = getParameterByName("filter");
                //var newFilter = v ? v[1] : null;
                if  (v) {
                    var newFilter = v[1];

                    var newFilterElement = $portfolioFilter.find("a:contains('" + newFilter + "')" );

                    if (newFilterElement.length == 1) {
                        $portfolioFilter.find('a.active').removeClass('active');
                        newFilterElement.addClass('active');
                    }
                }

                var defaultFilter = $portfolioFilter.find('a.active').data('filter');
                if (defaultFilter === undefined) {
                    defaultFilter = '*';
                    $portfolioFilter.find("a:has(span:contains('All'))" ).addClass('active');
                }

                performFilter(index);

                $loop.imagesLoaded(function() {
                    $loop.isotope('layout');
                });

                if ($filter.length > 0) {
                    $filter.on('click', function(e) {
                        e.preventDefault();
                        var $a = $(this);
                        $filter.removeClass('active');
                        $a.addClass('active');
                        if ($('.portfolio-filter1').eq(index).is(":visible")) { // mobile style
                            if ($a.data("filter") == "*") // all
                                $('.portfolio-filter1').eq(index).find('.filterall').html("Filter Products");
                            else
                                $('.portfolio-filter1').eq(index).find('.filterall').html($a.text());
                            $('.portfolio-filter.filtertab').eq(index).slideUp();
                        }
                        performFilter(index);
                    });
                };

                $('.product-generation-filter').eq(index).find('li a').click(function( e ) {
                    e.preventDefault();
                    if ($(this).find('.toggleBtn').hasClass('toggleBtn_Off')) {
                       $('.product-generation-filter .toggleBtn').removeClass("toggleBtn_On");
                       $('.product-generation-filter .toggleBtn').addClass("toggleBtn_Off");
                       $('.product-generation-filter li').removeClass("active");

                       $(this).find('.toggleBtn').toggleClass('toggleBtn_Off toggleBtn_On');
                       $(this).parent('li').addClass("active");

                       performFilter(index);
                    }
                });



            });
        };


        //==== Customize =====
        $('.gavias-skins-panel .control-panel').click(function() {
            if ($(this).parents('.gavias-skins-panel').hasClass('active')) {
                $(this).parents('.gavias-skins-panel').removeClass('active');
            } else $(this).parents('.gavias-skins-panel').addClass('active');
        });

        $('.gavias-skins-panel .layout').click(function() {
            $('body').removeClass('wide-layout').removeClass('boxed');
            $('body').addClass($(this).data('layout'));
            $('.gavias-skins-panel .layout').removeClass('active');
            $(this).addClass('active');
            var $container = $('.post-masonry-style');
            $container.imagesLoaded(function() {
                $container.masonry({
                    itemSelector: '.item-masory',
                    gutterWidth: 0,
                    columnWidth: 1,
                });
            });
        });


        $('.portfolio-filter1').each(function(index) {
            $(this).find('.filter').click(function() {
                $('.portfolio-filter.filtertab').eq(index).slideToggle();
            });
        });


        /*----------- Animation Progress Bars --------------------*/

        $("[data-progress-animation]").each(function() {
            var $this = $(this);
            $this.appear(function() {
                var delay = ($this.attr("data-appear-animation-delay") ? $this.attr("data-appear-animation-delay") : 1);
                if (delay > 1) $this.css("animation-delay", delay + "ms");
                setTimeout(function() { $this.animate({ width: $this.attr("data-progress-animation") }, 800); }, delay);
            }, { accX: 0, accY: -50 });
        });

        /*-------------------------------------------------------*/
        /* Video box
        /*-------------------------------------------------------*/

        if (jQuery('.gsc-video-link').length) {
            jQuery('.gsc-video-link').click(function(e) {
                e.preventDefault();
                var link = jQuery(this);

                //var popup = jQuery('<div id="gsc-video-overlay"><a class="video-close" href="#close">&times;</a><iframe src="'+link.attr('data-url')+'" width="'+link.attr('data-width')+'" height="'+link.attr('data-height')+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
                var popup = jQuery('<div id="gsc-video-overlay"><iframe src="' + link.attr('data-url') + '" width="' + link.attr('data-width') + '" height="' + link.attr('data-height') + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');

                //var popup = jQuery('<div id="gsc-video-overlay"><a class="video-close" href="#close">&times;</a><video width="'+link.attr('data-width')+'" height="'+link.attr('data-height')+'" controls>' +
                //  '<source src="'+link.attr('data-url')+'"/></video></div>');
                link.parent().append(popup);
                var video_element = popup.find('iframe');
                setTimeout(function() {
                    video_element.addClass('loaded');
                }, 1000);

                popup.addClass('show');

                setTimeout(function() {
                    popup.addClass('open');
                }, 50);

                popup.find('a[href="#close"]').click(function(e) {
                    e.preventDefault();

                    popup.removeClass('open');

                    setTimeout(function() {
                        popup.removeClass('show');
                        popup.remove();
                    }, 350);
                });
            });
        }


        // ============================================================================
        // Fixed top Menu Bar
        // ============================================================================
        /* moved to global.js 
        if ($('.gv-sticky-menu').length > 0) {
            var sticky = new Waypoint.Sticky({
                element: $('.gv-sticky-menu')[0]
            });
        }
        */

        // ============================================================================
        // accordion animation
        // ============================================================================
        jQuery('.collapse.in').prev('.panel-heading').addClass('active');
        jQuery('#accordion').on('show.bs.collapse', function(a) {
            jQuery(a.target).prev('.panel-heading').addClass('active');
        }).on('hide.bs.collapse', function(a) {
            jQuery(a.target).prev('.panel-heading').removeClass('active');
        });


        // ============================================================================
        // Smooth scrolling to an anchor link
        // ============================================================================
        /* moved to global.js 
        jQuery('a[href^="#"][smooth]').on('click', function(event) {
            //event.preventDefault();

            jQuery('html, body').animate({
                scrollTop: jQuery(jQuery.attr(this, 'href')).offset().top-jQuery(".gv-sticky-menu").height()-jQuery("#sticky-subnav").height()
            }, 500);
        });
        */


        // ============================================================================
        // Sticky nav
        // ============================================================================
        /* moved to global.js 
        if ( $( "#sticky-subnav" ).length ) {
            var subnavOffset = jQuery('#sticky-subnav').offset().top;
            jQuery(window).scroll(function () {
                var scrollTop = jQuery(window).scrollTop() + jQuery(".gv-sticky-menu").height();
                var distance  = (subnavOffset - scrollTop);

                if (distance < 0) {
                  jQuery('#sticky-subnav').addClass('navbar-fixed');
                  jQuery('#sticky-subnav').css('top', jQuery(".gv-sticky-menu").height() + "px");
                }
                else {
                  jQuery('#sticky-subnav').removeClass('navbar-fixed');
                  jQuery('#sticky-subnav').css('top', '');
                }
            });
            jQuery('body').scrollspy({
                target: '#sticky-subnav',
                offset: jQuery(".gv-sticky-menu").height()+jQuery("#sticky-subnav").height()+75
            });
        }
        */

        // ============================================================================
        // form factor fitler
        // ============================================================================
        $('.tab-filter.formfactor-filter a').on('click', function(e) {
            e.preventDefault();
            var divName = $(this).data("filter");
            $('.tab-filter.formfactor-filter a').each(function() {
                $('.' + $(this).data("filter")).hide();
                $(this).parent('li').removeClass("active");
                $(this).find('.toggleBtn').removeClass("toggleBtn_On");
                $(this).find('.toggleBtn').addClass("toggleBtn_Off");
            });

            $('.' + divName).show();
            $(this).parent('li').addClass("active");
            $(this).find('.toggleBtn').toggleClass('toggleBtn_Off toggleBtn_On');
        })


        var t = getParameterByName("tab");
        if (t) {
            var defaultTab = $('.tab-filter a[data-filter=' + t[1] + ']');
            if (defaultTab.length == 1) {
                defaultTab.trigger("click");
                jQuery('html, body').animate({
                    scrollTop: defaultTab.offset().top-jQuery(".gv-sticky-menu").height()-jQuery("#sticky-subnav").height()
                }, 500);
            }
        }

        // ============================================================================
        // search sku feature
        // ============================================================================
        jQuery( "#search-sku" ).html('<form class="form-inline search-form search-block-form" id="search-sku-form"><div class="input-group"><input id="search-sku-input" class="form-control form-search" placeholder="Search by SKU"><div class="message"></div></div></form>');

        var skuList = [];
        jQuery('[sku]:visible').each(function() {
            skuList.push(jQuery.trim(jQuery(this).text()));
        });

        jQuery( "#search-sku-input" ).autocomplete({
            source: skuList,
            response: function(event, ui) {
                if (ui.content.length === 0) {
                    $("#search-sku-form .message").text("No results found");
                } else {
                    $("#search-sku-form .message").empty();
                }
            },
            select: function( event, ui ) {
                //console.log("[" + ui.item.label + "]");
                jQuery('[product]').removeClass('highlight-row');
                var sku = jQuery("[sku]:contains('" + ui.item.label + "')").first().parents('[product]');
                sku.addClass('highlight-row');
                //console.log(jQuery(".gv-sticky-menu").height());
                //console.log(jQuery("#sticky-subnav").height());
                jQuery('html, body').animate({
                    scrollTop: sku.offset().top-jQuery(".gv-sticky-menu").height()-jQuery("#sticky-subnav").height()
                }, 500);
            }
        });


        jQuery(".video-player").mb_YTPlayer();


        if (jQuery('img[usemap]').length)
            jQuery('img[usemap]').rwdImageMaps();

    });

})(jQuery);