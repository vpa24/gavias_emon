(function ($) {
    var $overview = $('#highlights');
    var setInnovationContent = function () {
        var $innovation = $overview.find('.expand-box-item .innovation .team-info .field__item');
        var $innovationList = $innovation.find('.expand-box-summary').clone().removeClass('expand-box-summary');

        var innovationContentTemplate = '\
        <a class="expand-box-control expand-box-show-more btn btn-sm btn-outline" href="javascript:;">Learn more</a>\
        <a class="expand-box-control expand-box-show-less close-icon" href="javascript:;"></a>\
        <a class="expand-box-control expand-box-show-less btn" href="javascript:;">Close</a>\
        <div class="expand-box-detail"></div>\
        ';
        var $innovationContent = $(innovationContentTemplate);
        $innovation.append($innovationContent);
        $innovation.find('.expand-box-detail').append($innovationList);
        $innovation.find('.loading').hide();
    }
    var setOverviewEffects = function () {
        var $expandBox = $overview.find('.row');
        $expandBox.css({ 'max-height': $expandBox.outerHeight() + 'px' });
        $expandBox.find('.expand-box-show-more').on('click', function () {
            var box = $(this).closest(".expand-box");
            var boxIndex = $(this).closest(".expand-box-item").index() + 1;
            box.addClass('expand-box-expand-' + boxIndex);
        });

        $expandBox.find('.expand-box-show-less').on('click', function () {
            var box = $(this).closest(".expand-box");
            var boxIndex = $(this).closest(".expand-box-item").index() + 1;
            box.removeClass('expand-box-expand-' + boxIndex);

            if (!$(this).hasClass('btn')){
                return;
            }
            var $viewSection = $(this).closest('.gsc-column');
            jQuery('html, body').animate({
                scrollTop: $viewSection.offset().top - 200
            }, 0);
        });

        $(window).resize(function () {
            $expandBox.css({ 'max-height': 'none' });
            $expandBox.css({ 'max-height': $expandBox.outerHeight() + 'px' });
        });
    }
    var setOverviewBlock = function () {
        setInnovationContent();
        setOverviewEffects();
    }
    setOverviewBlock();
})(jQuery);