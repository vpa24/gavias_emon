(function ($) {
    "use strict";
    $(document).ready(function () {

        var hasUpcoming = false;
        $(".webinar-list .swiper-wrapper").addClass('loading-content');


        $.when( $.ajax( "https://www.brighttalk.com/channel/17278/feed" ), 
                $.ajax( "/en/api/v1/webinars?_format=xml" ) )
        .done(function( brightTalkXml, webinarsXml ) {

            $(brightTalkXml).find('entry').each(function(index){
                var title = $(this).find('title').text();
                var author = $(this).find('author').text();
                var summary = $(this).find('summary').text().replace(/•/g, "<br>•");
                var link = $(this).find('link[type="text/html"]').attr('href');
                var thumbnail = $(this).find('link[title="thumbnail"]').attr('href');
                thumbnail = $(this).find('link[title="preview"]').attr('href');
                
                if (thumbnail == undefined )
                    thumbnail = "/sites/default/files/logos/news/BrightTALK.png";

                var status = $(this).find('bt\\:status').text();

                var start = parseInt($(this).find('bt\\:start').text(), 10);
                var duration = $(this).find('bt\\:duration').text();
                

                addSlide(title, author, summary, link, thumbnail, status, start);

            });


            $(webinarsXml).find('item').each(function(index){

                var title = $(this).find('title').text();
                var author = $(this).find('author').text();
                var summary = $(this).find('body').text();
                var link = $(this).find('link').text();
                var source = $(this).find('source').text();
                var thumbnail = $(this).find('thumbnail').text();
                var image = $(this).find('image').text();
                var start = parseInt($(this).find('date').text(), 10);
                

                if (image == "" && source != "") {
                    image  = "/sites/default/files/logos/news/" + source + ".png";
                }

                var status = "recorded";
                if (start > (new Date().getTime()/1000))
                    status = "upcoming";

                addSlide(title, author, summary, link, image, status, start);

            });


            if (!hasUpcoming) {
                $('#webinar-filter').hide();
            }

            // sorting
            $(".webinar-list .swiper-wrapper .slide").sort(sort_li).appendTo('.webinar-list .swiper-wrapper');

            console.log("load webinar-list done");
            $(".webinar-list .swiper-wrapper").removeClass('loading-content');


        });



        // sort function callback
        var statusCode = {
            "live": 0,
            "upcoming": 1,            
            "recorded": 2,
        };
        const ONE_YEAR = 3600 * 24 * 365;
        const TODAY = new Date().getTime()/1000;

        function sort_li(a, b){

            var a_status = statusCode[$(a).find('.webinar').data('status')]
            var b_status = statusCode[$(b).find('.webinar').data('status')];

            var a_start = $(a).find('.webinar').data('start');
            var b_start = $(b).find('.webinar').data('start');

            if (a_status === b_status) {
                if (a_status == 1)
                    return (b_start) < (a_start) ? 1 : -1;        
                if (a_status == 2)
                    return (b_start) > (a_start) ? 1 : -1;        

            }

            return (b_status) < (a_status) ? 1 : -1;    
        }


        function addSlide(title, author, summary, link, image, status, startTimestamp) {

            if ((TODAY - startTimestamp) > ONE_YEAR)
                return;

            var isUpcoming = (status == 'upcoming') ? true : false;
            if (isUpcoming)
                hasUpcoming = true;
            var linkLabel = "Watch this webinar";
            if (isUpcoming)
                linkLabel = 'Register now';

            var startDatetime = new Date(startTimestamp*1000);
            var startDate = startDatetime.toLocaleString('en', { month: "long", day: "numeric", year: "numeric"});


            var slideHtml = '<div class="column-inner bg-size-cover white-bg webinar"  data-status="' + status + '" data-start="' + startTimestamp +'">' + 
                            '  <div style="background-color: white; height:100%; padding: 5px 25px 15px">' + 
                            '    <div class="column-content-inner white-bg">' + 
                            '      <div class="widget gsc-team team-vertical">' + 
                            '        <div style="text-align:right" class="publish-date">' + startDate + '</div>' + 
                            '        <div class="widget-content text-left">' + 
                            '           <div class="team-header text-center">' + 
                            '                <img src="' + image + '">' +
                            '           </div>' + 
                            '           <div class="team-body text-left">' + 
                            '              <h3 class="team-name"><a href="' + link + '" target="news">' + title + '</a></h3>' +
                            '              <div class="news-author">by ' + author + '</div>' +
                            '           </div>' + 
                            
                            '           <div class="team-info">' + summary + ' </div>' + 
                            '           <a href="' + link + '" target="news" class="smaller semibold" tabindex="0">' +
                            '              <div class="readmore">' + linkLabel + ' <i class="fa fa-angle-right"></i></div>' + 
                            '           </a>' + 
                            '        </div>' + 
                            '      </div>' + 
                            '    </div>' + 
                            '  </div>';
            if (status === "upcoming") {
                slideHtml += '<div class="blue-triangle-topright"></div>' +
                             '<div class="white-triangle-topright"></div>' + 
                             '<div class="coming-soon-flag-corner"></div>';
            }

            $('<div class="slide"></div>').html(slideHtml).prependTo(".webinar-list .swiper-wrapper");
        }
        
        $('.webinar-list #webinar-filter input').on('change', function() {
            if ($(this).is(":checked")) {
                $('.webinar-list .swiper-wrapper').slick('slickFilter', function() {return $(this).find('.webinar').data('status') == 'upcoming';});
            } else {
                $('.webinar-list .swiper-wrapper').slick('slickUnfilter');
            }
        });

    });
})(jQuery);
