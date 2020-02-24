(function($) {
    jQuery(document).ready(function() {
        // ============================================================================
        // Help Message
        // ============================================================================
        function setHelpMessage() {
            var $successMessage = $('.main .help .messages__wrapper .messages');
            if ($successMessage.length > 0) {
                setTimeout(function() {
                    $successMessage.parent().fadeOut();
                }, 3000);
            }
        }
        setHelpMessage();

        // ============================================================================
        // Contact setting
        // ============================================================================
        function getContactPath(formUrl) {
            var currentPath = location.pathname + location.search + location.hash;
            //console.log('1:' + currentPath);
            if (currentPath == '/' || currentPath == '/' + drupalSettings.path.currentLanguage || currentPath == '/' + drupalSettings.path.currentLanguage + '/') {
                currentPath = '';
            }
            //console.log('2:' + currentPath);
            currentPath = currentPath.replace('/' + drupalSettings.path.pathPrefix, '');
            //console.log('3:' + currentPath);
            if (currentPath.substr(0, 1) == '/') {
                currentPath = currentPath.substr(1, currentPath.length - 1);
            }
            //console.log('4:' + currentPath);
            currentPath = Drupal.url(currentPath);
            //console.log('5:' + currentPath);

            if (formUrl == '') {
                formUrl = 'contact';
            }
            if (formUrl.substr(0, 1) == '/') {
                formUrl = formUrl.substr(1, formUrl.length - 1);
            }
            if (formUrl.indexOf('?destination') < 0) {
                return Drupal.url(formUrl + '?destination=' + encodeURIComponent(currentPath));
            } else {
                return Drupal.url(formUrl);
            }
        }

        function setContact() {
            var setContactLink = function() {

                var $links = $('.js-link-contact-form,a[href*=jsLinkContactForm]');
                if ($links.length <= 0) {
                    return;
                }
                $links.each(function(index) {
                    var formUrl = $(this).attr('href');
                    if (formUrl == '#jsLinkContactForm') {
                        formUrl = '';
                    }
                    formUrl = formUrl.split('#')[0];
                    var contactPath = getContactPath(formUrl);
                    $(this).attr('href', contactPath);
                    $(this).addClass('use-ajax');
                    $(this).data('dialog-type', 'dialog').data('dialog-renderer', 'off_canvas').data('dialog-options', {
                        width: 500
                    });
                });
            }
            var setOffCanvas = function() {
                if (Drupal.offCanvas == undefined) {
                    return;
                }
                clearInterval(checkOffCanvasTimer);
                setContactLink();

                $(window).on('dialog:aftercreate', function() {
                    var $form = $('#drupal-off-canvas .feedback-form');
                    var $textPath = $form.find('.field--name-field-path textarea');
                    if ($textPath.length >= 0) {
                        $textPath.val(location.pathname);
                    }
                    $form.find('.btn.button.button--primary').removeClass('button button--primary');
                });
                Drupal.attachBehaviors(document, Drupal.settings); // Reattach all drupal event
            }
            var checkOffCanvasTimer = setInterval(setOffCanvas, 300);
        }
        setContact();


        // ============================================================================
        // Contact file upload setting
        // ============================================================================
        function setContactFileUpload() {
            var copyFilePath = function($form) {
                var $temporary = $form.find('.field--name-field-temporary textarea');
                var $file = $form.find('.js-form-managed-file .file a');
                if ($temporary.length <= 0) {
                    return;
                }
                if ($file.length <= 0) {
                    $temporary.val('');
                    return;
                }
                var filePage = $file.attr('href');
                filePage = filePage.replace('http://md8.supermicro.com', '');
                $temporary.val(filePage);
            }

            $(document).on('submit', '.contact-message-feedback-web-form', function(event) {
                copyFilePath($(event.target));
            });
            $(document).on('mousedown', '.contact-message-feedback-web-form .js-form-managed-file .file a', function(event) {
                var filePage = $(this).attr('href');
                filePage = filePage.replace('http://md8.supermicro.com', '');
                window.open(filePage);
                event.stopPropagation();
                return false;
            });
        }
        setContactFileUpload();

        // ============================================================================
        // set survey form - green data center
        // ============================================================================
        function setSurveyForGreenDataCenter() {
            var checkOffCanvasTimer;
            var setFormLayout = function() {
                var $form = $('.contact-message-survey-for-green-data-center-form');
                var $label = $form.find('.field--name-field-temporary-check-1 label');
                var getReceiveUpdatesHtml = function() {
                    return 'Yes, I would like to receive updates, product news and promotional materials from Supermicro. Please review our <a href="' + Drupal.url('about/policies/privacy') + '" target="_blank">Privacy</a> statement for more details.';
                }
                if ($label.length > 0) {
                    $label.html(getReceiveUpdatesHtml());
                }
                $form.find('.form-actions').before('<div><span class="txt-warning s-txt-warning">*</span>All fields are required</div>');
            }

            var setOffCanvas = function() {
                if (Drupal.offCanvas == undefined) {
                    return;
                }
                clearInterval(checkOffCanvasTimer);
                $(window).on('dialog:aftercreate', function() {
                    setFormLayout();
                });
                Drupal.attachBehaviors(document, Drupal.settings); // Reattach all drupal event
            }

            var init = function() {
                var $form = $('#contact-message-survey-for-green-data-center-form');
                if ($form.length > 0) {
                    setFormLayout();
                    return;
                }
                checkOffCanvasTimer = setInterval(setOffCanvas, 300);
            }();
        }
        setSurveyForGreenDataCenter();
    });
})(jQuery);