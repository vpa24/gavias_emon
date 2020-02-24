(function (d, s, id) {
    if (jQuery('#socialFb').length <= 0) {
        return;
    }
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1&appId=192442017152&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
    var setFBPagePluginLayout = function () {
        var container_width = jQuery('#socialFb').width();
        if (container_width > 500) {
            container_width = 500;
        }
        if (container_width < 180) {
            container_width = 180;
        }
        jQuery('#socialFb .fb-page').attr("data-width", container_width);
    }
    var resizeFBPagePluginLayout = function () {
        setFBPagePluginLayout();
        FB.XFBML.parse();
    }
    jQuery(window).on('resize', function () {
        setTimeout(function () { resizeFBPagePluginLayout() }, 1500);
    });
    setFBPagePluginLayout();
}(document, 'script', 'facebook-jssdk'));

(function (w) {
    if (jQuery('#socialYoutube').length <= 0) {
        return;
    }
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var ytPlayer;
    w.onYouTubeIframeAPIReady = function () {
        ytPlayer = new w.YT.Player('socialYoutube', {
            events: {
                'onReady': onYouTubePlayerReady,
                'onError': onYouTubePlayerError
            }
        });
    }

    function onYouTubePlayerReady(event) {
        ytPlayer.cuePlaylist({
            listType: 'user_uploads',
            list: 'SupermicroUTube'
        });
    }

    function onYouTubePlayerError(event) {
        //console.log(event);
    }

})(window);


(function ($) {
    function initLinkedin() {
        var $socialLinkedin = $('#socialLinkedin');
        if ($socialLinkedin.length <= 0) {
            return;
        }
        $.ajax({
            url: "/sites/default/files/php/linkedin.php"
        }).done(function (msg) {
            if (msg.length > 0) {
                $socialLinkedin.replaceWith(msg);
            }
        }).fail(function () {
            $('.social-media-item--linkedin,.social-media-title--linkedin').hide();
        });
    }
    initLinkedin();
})(jQuery);
