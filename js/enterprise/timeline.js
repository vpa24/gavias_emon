var milestonesHTML = '';


jQuery(document).ready(function() {

    // order timeline by year for mobile display
    jQuery(".hs-wrapper div[data-content] #timeline-modal").attr("id", "timeline-modal-mobile");

    jQuery(".hs-wrapper div[data-content] .timeline").sort(function (a, b) {
        return parseInt(jQuery(b).find('.year').text()) - parseInt(jQuery(a).find('.year').text());
    }).each(function () {
        var elem = jQuery(this);
        elem.find('.year').attr('data-target', '#timeline-modal-mobile');
        elem.remove();
        jQuery(elem).appendTo(".hs-wrapper div[data-content] .timeline-wrapper");
    });

    jQuery(".hs-wrapper div[data-content] .timeline-wrapper").each(function(){

        var total = jQuery(this).find('.timeline').length;

        if( total > 5){    
            jQuery(this).find('.timeline').eq(4).nextAll().hide().addClass('toggleable');
            jQuery(this).append('<div class="more" style="padding-top: 10px; text-align:center; cursor: pointer"><a>Show all</a></div>');    
        }

    });


    jQuery('.hs-wrapper div[data-content] .timeline-wrapper').on('click', '.more', function(){

        if ( jQuery(this).hasClass('less') ) {    
            jQuery(this).text('Show all').removeClass('less');    
        } else {
            jQuery(this).text('Show less').addClass('less'); 
        }

        jQuery(this).siblings('.timeline.toggleable').slideToggle();
/*
        jQuery('html, body').animate({
            scrollTop: jQuery('.hs-wrapper div[data-content] .timeline-wrapper .more').offset().top
        }, 400);                
*/
 
    });     


    jQuery('.hs-wrapper div[data-content] .timeline-wrapper .timeline').each(function() {
        var year = jQuery.trim(jQuery(this).find('.year').text());
        var companyMilestone = jQuery.trim(jQuery(this).find('.timeline-body').html());
        var productInnovations = jQuery.trim(jQuery(this).find('.product-innovations').html());

        milestonesHTML += "<div class='milestone' id='" + year + "'>";
        milestonesHTML += "<div class='year'>" + year + "</div>";
        if (companyMilestone != '') {
            milestonesHTML += "<div class='overlay-header'>company</div>";    
            milestonesHTML += "<div class='timeline-body'>" + companyMilestone + "</div>";    
        }
        if (productInnovations != '') {
            milestonesHTML += "<div class='overlay-header'>Engineering Innovations</div>";    
            milestonesHTML += "<div class='product-innovations'>" + productInnovations + "</div>";    
        }
        milestonesHTML += "</div>";
        
    });


    jQuery('.hs-wrapper .timeline-wrapper .timeline .year').on('click', function(event){
        //openSlidedownOverlay(jQuery(this).parent().find('.timeline-body')[0].outerHTML, jQuery(this).text() + ' Milestones');
        
        openSlidedownOverlay(milestonesHTML, null,  'milestone');

        var year = jQuery.trim(jQuery(this).text());

        console.log(jQuery('#' + year).offset().top);
        console.log(jQuery('.overlay-content').offset().top);


        jQuery('.overlay-content').scrollTop(0);
        //jQuery('.overlay-content').scrollTop(jQuery('#' + year).offset().top-jQuery('.overlay-content').offset().top);
        jQuery('.overlay-content').animate({
            scrollTop: jQuery('#' + year).offset().top-jQuery('.overlay-content').offset().top
        }, 400);                

        event.stopPropagation();        
    });     

});
