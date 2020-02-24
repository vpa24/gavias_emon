var slideIndex = 0;
var bannerSlideTimeout;
showSlides();

function showSlides() {
    if (jQuery(".banner-slide").length) {
        jQuery(".banner-slide").each(function() {
            jQuery(this).hide();
        });

        slideIndex++;
        if (slideIndex > jQuery(".banner-slide").length) {
            slideIndex = 1;
        }
        jQuery(".banner .banner-slide:nth-child(" + slideIndex + ")").show();

        jQuery(".banner .image-selector").each(function() {
            jQuery(this).removeClass('active');
        });
        jQuery(".banner .image-selector:nth-child(" + slideIndex + ")").addClass('active');

        bannerSlideTimeout = setTimeout(showSlides, 8000);
    }
}

function openSlidedownOverlay(contentHtml, title) {
    jQuery("#overlay").show();

    jQuery('#slidedown-overlay .overlay-content').html(contentHtml);
    jQuery('#slidedown-overlay .overlay-title').hide();
    if (title !== undefined) {
        jQuery('#slidedown-overlay .overlay-title').html(title);
        jQuery('#slidedown-overlay .overlay-title').show();
    }

    disablePageScrolling();
}

function closeSlidedownOverlay() {
    enablePageScrolling();
    jQuery("#overlay").hide();
}

[].forEach.call(document.querySelectorAll('.banner img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
        //console.log(img.getAttribute('data-src'));
        img.removeAttribute('data-src');
        jQuery(".banner .banner-product-title").show();
    };
});

[].forEach.call(document.querySelectorAll('.banner[data-src]'), function(banner) {
    var img = new Image();
    img.setAttribute('src', banner.getAttribute('data-src'));
    img.onload = function() {
        //console.log(img.src);
        banner.style.animation = 'banner-fade 3s';
        banner.style.backgroundImage = 'url(' + img.src + ')';
    };
});

function resizeEmbeddedVideo($embeddedVideo) {
    var h = $embeddedVideo.height();
    var w = $embeddedVideo.width();

    if (h / w < 0.5625)
        w = h / 0.5625;
    else
        h = 0.5625 * w;

    var $iframe = $embeddedVideo.find('.video-embed-field-responsive-video iframe');
    $iframe.height(h);
    $iframe.width(w);
}

(function($) {
    "use strict";

    jQuery(document).ready(function() {

        // ================================================
        // lazy loading images
        // ================================================
        var lazyloadImages;
        var lazyloadThrottleTimeout;
        lazyloadImages = $(".lazy");

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function() {
                var scrollTop = $(window).scrollTop();
                lazyloadImages.each(function() {
                    var el = $(this);
                    if (el.offset().top < window.innerHeight + scrollTop + 1000) {
                        var url = el.attr("data-src");
                        el.attr("src", url);
                        el.removeClass("lazy");
                        el.removeAttr("data-src");
                        lazyloadImages = $(".lazy");
                    }
                });
                if (lazyloadImages.length == 0) {
                    $(document).off("scroll", lazyload);
                    $(window).off("resize", lazyload);
                }
            }, 20);
        }

        $(document).on("scroll", lazyload);
        $(window).on("resize", lazyload);



        // ================================================
        // Play the video link
        // ================================================
        jQuery(".paragraph--type--video-player .play-video-action").on('click', function(e) {
            var $thumbnail = $(this).closest('.paragraph--type--video-player').find('.youtube-thumbnail');
            var setIframe = function($iframe) {
                if ($iframe.length) {
                    $iframe.attr('allow', "autoplay; fullscreen");
                    var videoURL = $iframe.attr('src').split('?')[0] + "?autoplay=1&start=0&rel=0&loop=1&showinfo=0&modestbranding=1&enablejsapi=1";
                    //console.log(videoURL);
                    $iframe.attr('src', videoURL);
                }
            }
            if ($thumbnail.length) { // paragraph--enterprise--video-player.html.twig
                var $iframe = $thumbnail.next('.videowrapper').find('iframe');
                setIframe($iframe);
                setTimeout(function() {
                    $thumbnail.hide();
                    $thumbnail.next('.videowrapper').show();
                }, 200);
            } else { // node--resource--slide.html.twig
                var $modalVideo = $(this).closest('.paragraph--type--video-player').find('.modal-video');
                if ($modalVideo.length) {
                    var i = $modalVideo.index('#resources.border-style .resource-slide .modal-video');
                    var video = document.querySelectorAll('[data-video-embed-field-modal]')[i];
                    video.click();
                } else {
                    var $iframe = $(this).closest('.paragraph--type--video-player').find('.videowrapper iframe');
                    setIframe($iframe);
                }
            }
        });

        $('#resources.border-style .resource-slide .modal-video').on('click', function() {
            var i = jQuery(this).index('#resources.border-style .resource-slide .modal-video');
            var video = document.querySelectorAll('[data-video-embed-field-modal]')[i];
            video.click();
        });

        // ================================================
        // resources slider
        // ================================================
        $('#resources.border-style .resource-slide .slider-placeholder').scroll(function() {
            $('#resources.border-style .resource-slide .slider-placeholder').scrollLeft($(this).scrollLeft());
        });
        $(document).on('click', '#resources.border-style .slick-arrow.slick-next', function() {
            $('#resources.border-style .resource-slide .slider-placeholder').scrollLeft($('#resources.border-style .resource-slide .slider-placeholder').scrollLeft() + 105);
        });
        $(document).on('click', '#resources.border-style .slick-arrow.slick-prev', function() {
            $('#resources.border-style .resource-slide .slider-placeholder').scrollLeft($('#resources.border-style .resource-slide .slider-placeholder').scrollLeft() - 105);
        });




        // ================================================
        // iframe colorbox
        // ================================================
        if ($(".colorbox-iframe").length) {
            $(".colorbox-iframe").colorbox({
                iframe: true,
                width: "80%",
                height: "80%"
            });
        }

        // ================================================
        // carousel
        // ================================================
        jQuery(".banner .image-selector").on('click', function(e) {
            if (!jQuery(this).hasClass('active')) {
                jQuery(".banner .image-selector").removeClass('active');
                jQuery(this).addClass('active');

                //jQuery('.banner .banner-product img').attr('src', jQuery('.banner .banner-product .options[data-id=' + jQuery(this).data('id') + '] ').data('src'));              
                /*
                jQuery('.banner .banner-product img').hide();
                jQuery('.banner .banner-product img[data-id=' + jQuery(this).data('id') + '] ').show();
                */

                clearTimeout(bannerSlideTimeout);
                jQuery(".banner-slide").each(function() {
                    jQuery(this).hide();
                });
                jQuery(".banner .banner-slide:nth-child(" + ($(this).index() + 1) + ")").show();
            }
        });




        /*
              jQuery('.paragraph.paragraph--type--carousel .carousel').slick({
                  dots: true,
                  prevArrow:"<a class='slick-prev'><i class='fa fa-angle-left'></i></a>",
                  nextArrow:"<a class='slick-next'><i class='fa fa-angle-right'></i></a>"
              });
        
              jQuery('.carousel').on('init', function() {
                  console.log(jQuery('.carousel').length + " carousels inited");
                  jQuery('body').scrollspy('refresh');
              });
        */

        /*
              jQuery('body').on('activate.bs.scrollspy', function (event) {
                  console.log('activate.bs.scrollspy', event);
              });
        */



        $('#leadership .team-info .readmore').on('click', function(event) {
            openSlidedownOverlay(jQuery(this).closest('.team-info').find('.leadership-info')[0].outerHTML);
            event.stopPropagation();
        });


        $(window).click(function(event) {

            if ($(event.target).closest('#slidedown-overlay').length == 0) {
                closeSlidedownOverlay();
            }

        });


        // ================================================
        // news search
        // ================================================
        if (jQuery("#news-search a").length) {
            var path = window.location.pathname.replace(/\/$/, "");
            //console.log(path);
            jQuery("#news-search li.active").removeClass('active');
            jQuery("#news-search a[href='" + path + "'").each(function() {
                $(this).parent().addClass("active");
            });

            var domainName = window.location.hostname;
            if (domainName.indexOf('staging') < 0) {
                $('#news-search .subnav .nav-tabs>li:last-child').hide();
            }
        }


        // ================================================
        // superblade - enclosures
        // ================================================
        var setProductShowMore = function() {
            var enclosures = $('#enclosures');
            enclosures.find('.js-show-more').on('click', function(event) {
                event.preventDefault();
                $(this).hide();
                enclosures.find('.js-pre-hide:not(.js-show-less)').show();
                enclosures.find('.js-pre-hide.js-show-less').css("display", "block");
                enclosures.find('.js-show-more').hide();
                setTimeout(function() {
                    enclosures.find('.slick-slider').slick('setPosition');
                    if (typeof refreshScrollspy === 'undefined' || refreshScrollspy === null) {
                        refreshScrollspy();
                    }
                }, 50);
            });
            enclosures.find('.js-show-less').on('click', function(event) {
                event.preventDefault();
                $(this).hide();
                enclosures.find('.js-pre-hide').hide();
                enclosures.find('.js-show-more').show();
                setTimeout(function() {
                    enclosures.find('.slick-slider').slick('setPosition');
                    if (typeof refreshScrollspy === 'undefined' || refreshScrollspy === null) {
                        refreshScrollspy();
                    }
                }, 50);
            });
        }
        setProductShowMore();

        // ================================================
        // superblade - networking
        // ================================================
        var setBladeNetworking = function() {
            var currUrl = location.pathname.split('/');
            if (currUrl.length < 2) {
                return;
            }
            var currePage = currUrl[currUrl.length - 1].toLowerCase();
            if (!(currePage == 'networking' || currePage == 'management')) {
                return;
            }
            var currProduct = currUrl[currUrl.length - 2].toLowerCase();
            if (!(currProduct == 'superblade' || currProduct == 'microblade')) {
                return;
            }

            var setBNMGallery = function() {
                var pic = $("#BNM a.bnm-system-pic");
                if (pic.length <= 0) {
                    return;
                }
                pic.colorbox({
                    rel: "bnmSystemPic",
                    width: "900px",
                    maxWidth: "90%",
                    overlayClose: false
                });
            }

            var setProductSort = function() {
                var needSortArray = ['InfiniBand', 'IntelOmni-Path', '25GE'];
                for (var i = 0; i < needSortArray.length; i++) {
                    var $block = $('#' + needSortArray[i]).find('.portfolio-v1');
                    var startIndex = 0;
                    $block.each(function(index) {
                        var title = $(this).find('ul.product-tags li:first-child').text().trim();
                        if (title.substr(0, 1) != 'A') {

                            $(this).insertBefore($(this).parent().find(".portfolio-v1").eq(startIndex));
                            startIndex += 1;
                        }
                    });
                }
            }

            var setProductTitle = function() {
                var $block = $('.portfolio-v1');
                var preType = '';
                $block.each(function(index) {
                    if ($(this).index() == 0) {
                        preType = '';
                    }
                    var title = $(this).find('ul.product-tags li:first-child').text().trim();
                    var curreType
                    if (title.substr(0, 1) == 'A') {
                        curreType = 'Mezzanine Cards';
                    } else {
                        curreType = 'Switches';
                    }
                    if (curreType != preType) {
                        $('<div class="sub-title">' + curreType + '</div>').insertBefore($(this));
                        preType = curreType;
                    }
                });


                $('.box-title').html(function() {
                    return '<div>' + $(this).text() + '</div>';
                });
            }

            var setProductFormFactor = function() {
                var fromFactor = {
                    'superblade': {
                        'MBM-XEM-100': '4U / 6U / 8U',
                        'MBM-XEM-002': '4U / 6U / 8U',
                        'MBM-GEM-004': '4U / 6U / 8U',
                        'SBM-25G-100': '6U / 8U',
                        'MBM-CMM-001/MBM-CMM-FIO': '4U / 6U / 8U',
                        'SBM-CMM-001/BMB-CMM-002(mini-CMM)/SBM-CMM-003': '7U'
                    },
                    'microblade': {
                        'MBM-XEM-100': '3U / 6U',
                        'MBM-XEM-002': '3U / 6U',
                        'MBM-GEM-004': '3U / 6U',
                        'MBM-CMM-001/MBM-CMM-FIO': '3U / 6U'
                    }
                }
                var $block = $('.portfolio-v1');
                $block.each(function(index) {
                    var title = $(this).find('ul.product-tags li:first-child').text().trim();
                    title = title.replace(/\r\n|\n/g, "");
                    title = title.replace(/\s+/g, "");
                    var info = fromFactor[currProduct][title];
                    if (info != undefined) {
                        var $tags = $(this).find('.product-tags');
                        $tags.append('<li><img src="/sites/default/files/icons/system_icon_white2.svg">' + info + '</li>');
                    }
                });
            }

            if (currePage == 'networking') {
                setBNMGallery();
                setProductSort();
                setProductTitle();
            }
            setProductFormFactor();
        }
        setBladeNetworking();

        /*
        jQuery("#news-search a").on( "click", function(e) {
            e.preventDefault();
  
            jQuery('body').after(jQuery('<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>'));
            jQuery("#news-search a").removeClass("active");
            $(this).addClass("active");
  
            var link = $(this).attr("href");
            console.log(link);
  //          window.location.href = link;
  
  
            if (history.pushState) {
                window.history.pushState({path:link},'',link);
                console.log('history');
            }
  
            jQuery.ajax({
                  url : link,
                  type: 'GET',
                  dataType: 'html',
                  timeout: 10000,
                  success : function (response) {
                      console.log("success");
                      $('.paragraph--type--view').replaceWith($(response).find('.paragraph--type--view'));
                      console.log($(response).filter('script[data-drupal-selector]').html());
                      //console.log($('script[data-drupal-selector="drupal-settings-json"]'));
                      $('script[data-drupal-selector="drupal-settings-json"]').html($(response).filter('script[data-drupal-selector="drupal-settings-json"]').html());
  
                      
                      
                      console.log($(response).find('.news-resources > header').text());
                      console.log($(response).find('.news-resources form').attr('action'));
                      jQuery('.news-resources form').attr('action', $(response).find('.news-resources form').attr('action'));
                      //jQuery('.news-resources form').replaceWith($(response).find('.news-resources form'));
                      jQuery('.news-resources .view-content-wrap').html($(response).find('.news-resources .view-content-wrap').html());
  
  
                      
  
                  },
                  error: function (xhr, ajaxOptions, thrownError) {
                      console.log(xhr);                    
                      alert(xhr.statusText);
                  },
                  complete: function (jqXHR, textStatus) {
                      console.log("complete");
                      jQuery('.ajax-progress.ajax-progress-fullscreen').remove();
                  }
              });
              return false;
          });
  */


        // ============================================================================
        // for embedded video
        // ============================================================================
        jQuery(window).resize(function() {
            jQuery('.embedded-video .videowrapper:visible').each(function() {
                resizeEmbeddedVideo(jQuery(this).closest('.embedded-video'));
            });
        });
        jQuery('.embedded-video').click(function() {
            /*
            jQuery(".embedded-video").not(this).find('.video-embed-field-responsive-video iframe').each(function(){
                this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
            });            
            */
            resizeEmbeddedVideo(jQuery(this));
        });

        jQuery('.embedded-video .closebtn').click(function() {
            var $embeddedVideo = jQuery(this).closest('.embedded-video');
            $embeddedVideo.find('.videowrapper').hide();
            $embeddedVideo.find('.video-thumbnail.youtube-thumbnail').show();
            //pause the video
            $embeddedVideo.find('.video-embed-field-responsive-video iframe').each(function() {
                this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
            });
        });


        // ============================================================================
        // back to top when click on the page title in subnav 
        // ============================================================================
        jQuery(document).on('click', '#page-title-sticky-header > div', function() {
            jQuery('html, body').animate({
                scrollTop: 0
            }, 600);
        });

        if ($('.subnav ul.nav-tabs li.active').length == 0) {
            // compare paths to set the active tab
            var path = window.location.pathname.toLowerCase();
            $('.subnav ul.nav-tabs li').each(function() {
                if (path === $(this).find('a').attr('href')) {
                    $(this).addClass('active');
                    return false;
                }
            });
        }


        // ============================================================================
        // link to product selector
        // ============================================================================

        function directToProductSelector() {
            var getUrlParameter = function getUrlParameter(sParam) {
                var sPageURL = window.location.search.substring(1),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');

                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                    }
                }
                return '';
            };

            var pro = getUrlParameter('pro');
            if (pro == '') {
                return;
            }

            var setProductSelector = function() {
                if (triggerFilterByParams == undefined) {
                    return;
                }
                clearInterval(proTimer);
                var toPage = decodeURIComponent(pro);
                triggerFilterByParams(pro);
            }
            var proTimer = setInterval(setProductSelector, 500);
        }
        directToProductSelector();


        // ============================================================================
        // Scroll Box
        // ============================================================================

        function setScrollBox() {
            var ele = {};
            var itmeWidth, maxWidth;

            function bindEvent() {
                ele.scrollLeft.on('click', function() {
                    ele.scroll.animate({
                        scrollLeft: ele.scroll.scrollLeft() - itmeWidth
                    }, 500);
                    checkArrowShow();
                });
                ele.scrollRight.on('click', function() {
                    ele.scroll.animate({
                        scrollLeft: ele.scroll.scrollLeft() + itmeWidth
                    }, 500);
                    checkArrowShow();
                });
                ele.scroll.on('scroll', function() {
                    checkArrowShow();
                });
                $(window).on('resize', function() {
                    setScrollWidth();
                    ele.scroll.scrollLeft(0);
                });
            }

            function checkArrowShow() {
                var currentPosition = ele.scroll.scrollLeft();
                if (currentPosition >= maxWidth) {
                    ele.scrollRight.addClass('scroll-disabled');
                } else {
                    ele.scrollRight.removeClass('scroll-disabled');
                }
                if (currentPosition <= 0) {
                    ele.scrollLeft.addClass('scroll-disabled');
                } else {
                    ele.scrollLeft.removeClass('scroll-disabled');
                }
            }

            function setScrollWidth() {
                var $items = ele.scroll.find('.gsc-column');

                $items.css('min-width', '');
                ele.scroll.find('.row').css('width', '');

                itmeWidth = ele.scroll.find('.gsc-column:first-child').outerWidth();
                var totalWidth = $items.length * itmeWidth;
                maxWidth = totalWidth - ele.scroll.outerWidth();

                $items.css('min-width', 'auto');
                ele.scroll.find('.row').outerWidth(totalWidth);
            }

            function setScrollLayout() {
                ele.scrollBox.removeClass('scroll-box-loading');
                ele.scrollBox.find(':before').hide();
                ele.scrollLeft = $('<a class="scroll-prev scroll-arrow scroll-disabled" href="javascript:void(0);"><i class="fa fa-angle-left"></i></a>');
                ele.scrollRight = $('<a class="scroll-next scroll-arrow" href="javascript:void(0);"><i class="fa fa-angle-right"></i></a>');
                ele.scrollBox.find('.paragraph-boxes .row').wrap('<div class="scroll-box-container">').wrap('<div class="scroll-box-list">').css('opacity', '1');
                ele.scrollBox = ele.scrollBox.find('.scroll-box-container');
                ele.scroll = ele.scrollBox.find('.scroll-box-list');
                ele.scrollBox.append(ele.scrollLeft);
                ele.scrollBox.append(ele.scrollRight);
            }

            function init() {
                ele.scrollBox = $('#product-families.scroll-box');
                if (ele.scrollBox <= 0) {
                    return;
                }
                setScrollLayout()
                setScrollWidth();
                bindEvent();
            }

            init();

        }
        setScrollBox();

        // ============================================================================
        // paragraph-anchor
        // ============================================================================
        var initParagraphAnchor = function() {

            var ele = {};
            var initFixBar = function() {
                var listHeight = ele.anchorList.outerHeight();
                var checkListPosition = function() {
                    if (!window.matchMedia('(min-width: 992px)').matches) {
                        return;
                    }
                    var headerHeight = $('#header').outerHeight();
                    var checkPoint = ele.anchorList.offset().top - headerHeight;
                    var checkPointBottom = ele.anchorBlock.offset().top + ele.anchorBlock.outerHeight();

                    if ($(document).scrollTop() > checkPoint) {
                        ele.anchorList.addClass('s-paragraph-anchor-list--fixed');
                        if ($(document).scrollTop() >= checkPointBottom - $(window).height()) {
                            var bottomOffset = ((checkPointBottom - $(document).scrollTop()) % $(window).height());
                            if (bottomOffset < listHeight) {
                                bottomOffset = $(window).height() - bottomOffset;
                                ele.anchorList.find('ul').css({
                                    'top': 'auto',
                                    'bottom': bottomOffset + 'px'
                                });
                                return;
                            }
                        }
                        ele.anchorList.find('ul').css({
                            'top': (headerHeight + 20) + 'px',
                            'bottom': 'auto'
                        });
                    } else {
                        ele.anchorList.removeClass('s-paragraph-anchor-list--fixed');
                    }
                };
                $(document).on('scroll', checkListPosition);
            }

            var initAnchorList = function() {
                if (!ele.container.hasClass('js-paragraph-anchor-list-auto')) {
                    return;
                }
                var $list = $('<ul class="s-list"></ul>');
                ele.container.find('.js-paragraph-anchor-block').each(function(index) {
                    var title = $(this).find('.js-paragraph-anchor-title').text();
                    var id = $(this).attr('id');
                    if (id == undefined) {
                        id = 'js-paragraph-anchor-block-' + index;
                        $(this).attr('id', id);
                    }
                    $list.append('<li><a href="#' + id + '" smooth>' + title + '</a></li>');
                });
                ele.anchorList.append($list);
            }

            var init = function() {
                ele.container = $('#js-paragraph-anchor');
                if (ele.container.length <= 0) {
                    return;
                }
                ele.anchorList = ele.container.find('.js-paragraph-anchor-list');
                ele.anchorBlock = ele.container.find('.js-paragraph-anchor-content');
                initAnchorList();
                initFixBar();

            }();

        }();

        // ============================================================================
        // Support Page
        // ============================================================================
        var initSupport = function() {
            var initSupportFooter = function() {
                var $download = $('.js-support-footer .js-redirect');
                if ($download.length <= 0) {
                    return;
                }
                $download.on('click', function(event) {
                    event.preventDefault();
                    var newwindow = window.open("/about/policies/disclaimer.cfm?url=" + $(this).attr('href'), 'disclaimer', 'height=800,width=500,scrollbars=1,resizable=1');
                    newwindow.moveTo(0, 0);
                    return false;
                });

            }();
        }();

        // ==============================================================
        // Naming Convention links
        // ==============================================================
        var initNamingConvention = function() {
            if (jQuery('#product-naming-conventions').length <= 0) {
                return;
            }
            jQuery('.js-append-icon-info-circle a').prepend('<i class="fa fa-info-circle" style="color:#faab1a;font-size: 1.1em;margin-right: 0;"></i>');
            jQuery(document).on('click', '#product-naming-conventions a.naming-convention', function() {
                var link = jQuery(this).attr('href');
                jQuery("#overlay").show();
                jQuery('#slidedown-overlay .overlay-content').html("<iframe style='border: 0;width: 100%;height: 100%;' src='" + link + "'></iframe>");
                disablePageScrolling();
                return false;
            });
        }();

        // ==============================================================
        // Support24Hour
        // ==============================================================
        var setSupport24Hour = function() {

            var ele = {};
            ele.container = jQuery('#js-form-24hour');
            if (ele.container.length <= 0) {
                return;
            }
            ele.sn = ele.container.find('#sn');
            ele.loading = ele.container.find('.loading');
            var showResult = function(msg) {
                var errorMsg = '\
                <div class="s-panel-outline white-bg js-sn-result">\
                <h3>Serial Number Not Found</h3>\
                <p>The Serial Number is not found in our records. For Technical Support please call 1-408-503-8000. It is our pleasure to support you.</p>\
                </div>\
                ';
                var $obj = ele.container.find('.js-sn-result');
                if (msg.bIsSerialNumberFound === false) {
                    $obj.replaceWith(errorMsg).show();
                } else {
                    ele.container.hide();
                    ele.container.next().show();
                    $('.js-intro-superserver').hide();
                    $('html, body').scrollTop(0);
                }
                ele.loading.hide();
            }
            var fetchSN = function(sn) {
                ele.loading.show();
                $.ajax({
                    method: "GET",
                    url: Drupal.url("external_db_block/support/sncheck?serialNum=" + sn),
                    dataType: "json"
                }).done(function(msg) {
                    showResult(msg);
                });
            }
            var sendSearch = function() {
                var sn = ele.sn.val().trim();
                if (sn.length <= 0) {
                    alert('You must enter a Product Serial Number!');
                    return;
                }
                fetchSN(sn);
            }
            var bindEvent = function() {
                ele.container.find('.btn').on('click', function() {
                    sendSearch();
                });
                ele.container.find('.s-form').on('submit', function() {
                    sendSearch();
                    return false;
                });
            }

            bindEvent();
        }();

        // ================================================
        // Leadership slider
        // ================================================
        var setLeaderShip = function() {
            var leadership = $('#leadership');
            if (leadership.length <= 0) {
                return;
            }
            leadership.find('.swiper-wrapper').on('setPosition', function() {
                setTimeout(function() {
                    leadership.find('.bio').width('');
                    leadership.find('.bio').width(leadership.find('.bio').width());
                }, 500);
            });
            leadership.addClass('with-photo');
            $('#slidedown-overlay').addClass('with-photo');
            $('.overlay-content').addClass('with-photo');
        }();


        // ================================================
        // attch intel icon to banner
        // ================================================
        var setIntelBannerTag = function() {
            var getStr = function(hasText) {
                var wording = '';
                if (hasText) {
                    wording = '<div>Featuring 2nd Gen Intel® Xeon®</div><div>Scalable Processors</div>';
                }
                return '\
                <div class="bb-container s-intel-tag">\
                    <div class="s-intel-tag-innter">\
                        <div class="s-intel-tag-box">' + wording + '\
                            <img src="/sites/default/files/icons/Intel-Xeon-Platinum.jpg"></div>\
                        </div>\
                    </div>\
                </div>';
            }
            $('.js-attach-intel-tag').append(getStr(true));
            $('.js-attach-intel-tag-pic-only').append(getStr(false));
        }();

        // rebind event to element for drupal
        Drupal.attachBehaviors(document, Drupal.settings);

    });

})(jQuery);