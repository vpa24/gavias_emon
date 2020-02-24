var stuckHeaderHeight = 0;

function disablePageScrolling() {
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    jQuery('html, body, .hs-container').addClass('noscroll');
    jQuery('body, #backtotop').css('margin-right', scrollbarWidth + 'px');
    jQuery('#sticky-subnav.navbar-fixed, .header-main.gv-sticky-menu.stuck, .header-main.gv-sticky-menu.front-page').css('padding-right', scrollbarWidth + 'px');

}

function enablePageScrolling() {
    jQuery('html, body, .hs-container').removeClass('noscroll');
    jQuery('body, #backtotop').css('margin-right', '0px');
    jQuery('#sticky-subnav.navbar-fixed, .header-main.gv-sticky-menu.stuck, .header-main.gv-sticky-menu.front-page').css('padding-right', '');
}

function refreshScrollspy() {
    if (jQuery("#sticky-subnav").length) {
        jQuery('body').scrollspy('refresh');
    }
}

function openSpecPage(productType, language, sku, specUrl) {
    var hostname = "https://entweb.supermicro.com";
    var url = hostname + "/" + language + specUrl;
    if (productType == 'motherboards') {
        url = hostname + "/" + language + "/products/motherboard/" + sku;
    }
    window.open(url, 'smc-spec');
}

function scrollToAnchor(anchor, animateTime) {
    var $stickyNav = jQuery("#sticky-subnav");
    var stickyHeaderHeight = 0;
    if ($stickyNav.length) {
        stickyHeaderHeight += $stickyNav.outerHeight();
    } else {
        stickyHeaderHeight += jQuery("#header").outerHeight();
    }
    var $anchorBlock = jQuery(anchor);
    if ($anchorBlock.length <= 0) {
        return;
    }

    var anchorPosition = $anchorBlock.offset().top - stickyHeaderHeight;
    jQuery('html, body').animate({
        scrollTop: anchorPosition
    }, animateTime);
}

document.addEventListener("DOMContentLoaded",
    function () {
        var div, n;
        var v = document.getElementsByClassName("youtube-thumbnail");
        for (n = 0; n < v.length; n++) {
            //v[n].innerHTML = loadVideoThumb(v[n].dataset.id, v[n].dataset.thumb);
            loadVideoThumb(v[n]);

            if (typeof v[n].dataset.id === "undefined") {
                v[n].addEventListener('click', function () {
                    $thumbnail = jQuery(this);
                    $iframe = $thumbnail.next('.videowrapper').find('iframe');
                    $iframe.attr('allow', "autoplay; fullscreen");
                    var videoUrl = $iframe.attr('src');
                    videoUrl = videoUrl.replace('autoplay=0', 'autoplay=1');
                    $iframe.attr('src', videoUrl);
                    setTimeout(function () { $thumbnail.hide(); $thumbnail.next('.videowrapper').show(); }, 200);
                });
            }
            else {
                v[n].addEventListener('click', function () {
                    loadAndPlayVideo('https://www.youtube.com/embed/' + this.dataset.id + '?autoplay=1&amp;start=0&amp;rel=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1')
                });
            }
        }

        // add play icons to all video embed fields
        var f = document.getElementsByClassName("video-embed-field-launch-modal");
        for (n = 0; n < f.length; n++) {
            f[n].innerHTML = f[n].innerHTML + '<div class="play"></div>';
        }

    }
);

function loadVideoThumb($youtubeVideo) {

    var id = $youtubeVideo.dataset.id;
    var videoThumb = $youtubeVideo.dataset.thumb;
    var play = '<div class="play"></div>';

    var thumb = '';
    if (id !== undefined)
        thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg">'.replace("ID", id);
    if (videoThumb !== undefined)
        thumb = '<img src="' + videoThumb + '">';

    if (thumb != '')
        $youtubeVideo.innerHTML = thumb + play;
}




function loadAndPlayVideo(videoSrc) {
    //var $iframe = jQuery("#" + iframeId);
    var $iframe = jQuery(".videowrapper iframe");
    if ($iframe.length) {
        $iframe.attr('allow', "autoplay; fullscreen");
        $iframe.attr('src', videoSrc);
    }
}

function getParameterByName(name) {
    return window.location.search.match(new RegExp('(?:[\?\&]' + name + '=)([^&]+)'));
}


(function ($) {
    "use strict";

    jQuery(document).ready(function () {

        var $stickyNav = $("#sticky-subnav");

        // ============================================================================
        // back to top
        // ============================================================================
        $('body').append("<div id='backtotop'></div>");
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#backtotop').fadeIn();
            } else {
                $('#backtotop').fadeOut();
            }
        });

        $('#backtotop').click(function () {
            $("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function () {
                $('html, body').stop();
            });
            $('html,body').animate({scrollTop: 0}, 1200, 'easeOutQuart', function () {
                $("html, body").unbind("scroll mousedown DOMMouseScroll mousewheel keyup");
            });
            return false;
        });
        


        // ============================================================================
        // language dropdown preselect fix
        // ============================================================================
        $("select").each(function () {
            $(this).val($(this).find('option[selected]').val());
        });

        // ============================================================================
        // scrolling to an anchor link
        // ============================================================================
        function scrollToAnchorOnLoad() {
            var pageHash = window.location.hash;
            if (pageHash) {
                scrollToAnchor(pageHash, 600);
            }
        }
        jQuery(document).on('click', 'a[href^="#"][smooth]', function (event) {
            event.preventDefault();
            if ($(this).parents('.subnav.navbar-mobile').length > 0) {
                var $obj = this;
                setTimeout(function () {
                    scrollToAnchor(jQuery.attr($obj, 'href'), 600);
                }, 300);
            } else {
                scrollToAnchor(jQuery.attr(this, 'href'), 600);
            }
        });

        // ============================================================================
        // If the page contains sticky subnav, only stick the subnav, not the header.
        // If not, stick the header.
        // ============================================================================
        if ($('.gv-sticky-menu').length > 0) {
            if ($stickyNav.length == 0) {
                var sticky = new Waypoint.Sticky({
                    element: $('.gv-sticky-menu')[0]
                });
            }
        }

        // ============================================================================
        // Sticky nav
        // ============================================================================
        if ($stickyNav.length) {
            var subnavOffset = $stickyNav.offset().top;

            jQuery(window).scroll(function () {
                var scrollTop = jQuery(window).scrollTop();
                var distance = (subnavOffset - scrollTop);

                if (distance < 0) {
                    $stickyNav.addClass('navbar-fixed');
                    $stickyNav.css('top', "0px");
                    if (!jQuery('#page-title-sticky-header').length) {
                        var pageTitle = $.trim($('.banner-title').text());
                        if (pageTitle != '') {
                            $stickyNav.find('.container').prepend("<div class='bb-container' id='page-title-sticky-header'><div>" + pageTitle + "</div></div>");
                            var english = /^[A-Za-z0-9®]*$/;
                            if (pageTitle.length > 15 || !english.test(pageTitle)) {
                                jQuery('#page-title-sticky-header').addClass('long-title');
                            }
                        }
                    }
                    $('#content').css('margin-top', $stickyNav.outerHeight());
                }
                else {
                    $stickyNav.removeClass('navbar-fixed');
                    $stickyNav.css('top', '');
                    $('#content').css('margin-top', 0);
                }
            });

            if ($('.nav-sub-tabs').length > 0) {
                $('.nav-sub-tabs').find('li:first-child').addClass('active');
                var $stickyParentNav;
                $stickyParentNav = $('#sticky-subnav .nav.nav-tabs li.active');
                $('body').on('activate.bs.scrollspy', function () {
                    $stickyParentNav.addClass('active');
                });
            }


            //mobile sticky
            var initMobileStickyNav = function () {
                var ele = {};
                ele.mainNav = $stickyNav.find('.nav-tabs');
                ele.subNav = $stickyNav.find('.nav-sub-tabs');
                
                var setInitLayout = function () {
                    var setLayout = function ($list) {
                        if ($list.find('li.active').length <= 0) {
                            $list.addClass('initless');
                        } else {
                            $list.removeClass('initless');
                        }
                    }
                    setLayout(ele.mainNav);
                    setLayout(ele.subNav);
                }

                var setLayoutType = function (showType) {
                    if (showType == 'more') {
                        ele.showMore.hide();
                        ele.showLess.show();
                        if ((ele.subNav.length > 0) && (ele.subNav.is(":visible"))) {
                            ele.subNav.removeClass('less');
                            return;
                        }
                        ele.mainNav.removeClass('less');
                    } else {
                        ele.showMore.show();
                        ele.showLess.hide();
                        if ((ele.subNav.length > 0) && (ele.subNav.is(":visible"))) {
                            ele.subNav.addClass('less');
                            return;
                        }
                        ele.mainNav.addClass('less');
                    }
                }
                var checkMobile = function () {
                    setLayoutType('less');
                    if (window.matchMedia('(max-width: 1199px)').matches) {
                        $stickyNav.addClass('navbar-mobile');
                    } else {
                        $stickyNav.removeClass('navbar-mobile');
                    }
                }
                var init = function () {
                    ele.mainNav.addClass('less');
                    ele.subNav.addClass('less');
                    ele.showMore = $('<div class="slide-control slide-control-down js-slide-nav-down"><i class="fa fa-chevron-down"></i></div>');
                    ele.showLess = $('<div class="slide-control slide-control-up js-slide-nav-up"><i class="fa fa-chevron-up"></i></div>');
                    $stickyNav.append(ele.showMore).append(ele.showLess);
                    $stickyNav.find('li a').on('click', function () {
                        setLayoutType('less');
                    });
                    ele.showMore.on('click', function () {
                        setLayoutType('more');
                    });
                    ele.showLess.on('click', function () {
                        setLayoutType('less');
                    });
                    $('body').on('activate.bs.scrollspy', function () {
                        setInitLayout();
                    });
                    $(window).resize(function () {
                        checkMobile();
                    });
                    checkMobile();
                    setInitLayout();
                }();
            }();

            jQuery('body').scrollspy({
                target: '#sticky-subnav',
                offset: Math.round($(window).height() / 3)
            });

            $(window).resize(function () {
                setTimeout(function () {
                    refreshScrollspy();
                }, 500);
            });
        }


        jQuery(window).scroll(function () {
            if (stuckHeaderHeight == 0 && jQuery(".gv-sticky-menu.stuck").length) {
                stuckHeaderHeight = jQuery(".gv-sticky-menu.stuck").outerHeight(true);
            }
        });


        // ================================================================================
        // remove language select options that aren't en, zh_tw, zh_cn or ja, in most cases
        // ================================================================================
        function adjustLangSelect() {
            var lg = ['ko', 'es', 'fr', 'de', 'it', 'pt-pt', 'ru', 'vi', 'th', 'id', 'ms', 'hi', 'nl'];
            var arrayRemove = function (arr, value) {
                return arr.filter(function (ele) {
                    return ele != value;
                });
            }
            var pathArray = window.location.pathname.split('/');
            if (pathArray.length >= 0) {
                if (pathArray[pathArray.length - 1].toLowerCase() == 'ceo-letter') {
                    lg = arrayRemove(lg, 'ko');
                }
                if (pathArray[pathArray.length - 1].toLowerCase() == 'ceo-3rdpartysecurity-update') {
                    lg = arrayRemove(lg, 'ko');
                    lg = arrayRemove(lg, 'es');
                }
                if (pathArray[pathArray.length - 1].toLowerCase() == 'supermicro-business-update-5-17-19') {
                    lg = arrayRemove(lg, 'ko');
                    lg = arrayRemove(lg, 'es');
                    lg = arrayRemove(lg, 'de');
                }
                if ((pathArray.length >= 2) && (pathArray[pathArray.length - 2].toLowerCase() == 'pressreleases')) {
                    return;
                }
            }
            for (var i = 0; i < lg.length; i++) {
                lg[i] = '.lang-dropdown-select-element option[value=' + lg[i] + ']';
            }
            $(lg.join(',')).remove();
        }
        adjustLangSelect();

        // ================================================================================
        // copyright
        // ================================================================================
        function setCopyright() {
            var $ele=$('#footer .copyright-year');
            if ($ele.length<=0){
                return;
            }
            $ele.replaceWith(new Date().getFullYear());
        }
        setCopyright();


        function pageLoadSetting() {
            //slider will effect page height, when page height change, need to refresh scrollspy and relocated page to right anchor when page load
            var $slide = $(".swiper-wrapper:last");
            if ($slide.length) {
                $slide.on('init', function () {
                    setTimeout(function () {
                        scrollToAnchorOnLoad();
                        refreshScrollspy();
                    }, 500);
                });
            } else {
                setTimeout(function () {
                    scrollToAnchorOnLoad();
                }, 500);
            }

            var recTimes = 0;
            var tabTimer = setInterval(function () {
                recTimes += 1;
                refreshScrollspy();
                if (recTimes == 5) {
                    clearInterval(tabTimer);
                }
            }, 2000);
        }
        pageLoadSetting();


        $(window).resize(function () {
            if (window.matchMedia('(min-width: 991px)').matches) {
                $('.mobile-style-tab').show();
                $('.product-type-tab').show();
                $('.portfolio-filter.filtertab').show();
                $('html, body').css('overflow', 'auto');
                $('.sub-menu.show-on-mobile').addClass('hide-on-desktop').removeClass('show-on-mobile');
                $('#search-sku-form').show();
            } else {
                if ($('.gva-navigation').hasClass('show-view')) {
                    $('html, body').css('overflow', 'hidden');
                    $('#search-sku-form').hide();
                }
                if (jQuery.trim(jQuery('.selected-product-family li.active a').text()) == "") {
                    jQuery('.selected-product-family').hide();
                    jQuery('.mobile-style-tab').show();
                }
                $('.sub-menu.hide-on-desktop').addClass('show-on-mobile').removeClass('hide-on-desktop');
            }
        });

    });

})(jQuery);

