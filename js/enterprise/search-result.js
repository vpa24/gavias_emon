(function($) {
    var initSearchResult = function() {

        var ele = {};
        ele.container = $('#search-result');
        if (ele.container.length <= 0) {
            return;
        }

        ele.loading = ele.container.find('.js-loading');
        ele.searchControl = ele.container.find('.js-search-control');
        ele.list = ele.container.find('.js-result-list');
        ele.paging = ele.container.find('.js-paging');
        ele.paging.prev = ele.paging.find('.js-page-prev');
        ele.paging.next = ele.paging.find('.js-page-next');

        var queryInfo = {
            keyword: '',
            total: 0,
            start: 0
        };

        var setting = {
            'searchIndexUrl': 'http://constellio-1638808731.us-east-1.elb.amazonaws.com',
            'searchIndexUrlMaster': 'http://constellio-1638808731.us-east-1.elb.amazonaws.com',
            'searchIndexUrlBK': 'http://bksearch.supermicro.com',
            'callTimes': 0
        }

        var replaceAll = function(target, search, replacement) {
            return target.replace(new RegExp(search, 'g'), replacement);
        }

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
            return '';
        };

        var getSearchResult = function() {
            var getSearchIndexUrl = function() {
                var keywordStr = queryInfo.keyword;
                // if (keywordStr.substr(keywordStr.length - 1, 1) == '+') {
                //     keywordStr = keywordStr.substr(0, keywordStr.length - 1);
                //     //console.log(keywordStr);
                // }

                keywordStr = encodeURIComponent(keywordStr);
                return encodeURIComponent(setting.searchIndexUrl + '/constellio/app/select?collectionName=products&hl=true&start=' + queryInfo.start + '&rows=20&q=%27' + keywordStr + '%27&wt=json');
            }

            var callbackForFail = function(msg) {
                setting.searchIndexUrl = setting.searchIndexUrlBK;
                fetchSearchResult(getSearchIndexUrl(), callbackForSuccess)
            }

            var callbackForSuccess = function(msg) {
                var doc = parseSearchResult(msg.contents);
                queryInfo.total = doc.response.numFound;
                queryInfo.start = doc.response.start;
                renderSearchResult(doc);
                ele.loading.hide();
            }

            ele.loading.show();
            fetchSearchResult(getSearchIndexUrl(), callbackForSuccess, callbackForFail);

            setting.callTimes += 1;
            if (setting.callTimes == 10) {
                setting.callTimes = 0;
                setting.searchIndexUrl = setting.searchIndexUrlMaster;
            }
        }

        var fetchSearchResult = function(urlstr, callbackForSuccess, callbackForFail) {
            $.ajax({
                method: "GET",
                url: "/sites/default/files/php/fetch.php?url=" + urlstr,
                dataType: "json"
            }).done(function(msg) {
                if (!((msg.status != undefined) && (msg.status.http_code != undefined) && (msg.status.http_code == 200))) {
                    if (callbackForFail != undefined) {
                        callbackForFail();
                    }
                    return;
                }
                callbackForSuccess(msg);
            });
        }

        var parseSearchResult = function(result) {

            var doc = result.response.docs;
            for (var i = 0; i < doc.length; i++) {
                var keyName = 'doc_uniqueKey';
                if (doc[i].doc_uniqueKey == undefined) {
                    keyName = 'id';
                }
                if (result.highlighting[doc[i][keyName]].doc_defaultSearchField == undefined) {
                    doc[i].doc_highlighting = '';
                    continue;
                }
                doc[i].doc_highlighting = result.highlighting[doc[i][keyName]].doc_defaultSearchField.toString();
            }

            return result;
        }

        var getRenderTemplate = function() {
            var temp = {};
            temp.row = '\
                <div class="search-result-item">\
                    <h4 class="search-result-title">\
                        <a href="%doc_url%" target="_blank">%doc_title%</a>\
                    </h4>\
                    <p class="search-result-content">%doc_highlighting%</p>\
                    <p class="search-result-link">%doc_url%</p>\
                </div>\
            ';
            return temp;
        }

        var renderSearchResult = function(result) {

            var html = renderSearchResultList(result);
            ele.list.show();
            ele.paging.show();
            if (html == '') {
                ele.paging.hide();
                html = '<div class="search-result-none">Your search: <span>' + queryInfo.keyword + '</span> did not match any results</div>'
            }
            ele.list.html(html);
            ele.searchControl.find('input').val(queryInfo.keyword);
            renderSearchResultPaging(result);
        }

        var renderSearchResultPaging = function(result) {
            var pageIndex = Math.floor((queryInfo.start + 1) / 20) + 1;
            var totalPage = Math.ceil(queryInfo.total / 20);

            ele.paging.find('.js-page-index').text(pageIndex);
            ele.paging.find('.js-page-total').text(totalPage);
            ele.paging.find('.js-total').text(queryInfo.total);
            ele.paging.find('.js-keyword').text(queryInfo.keyword);

            if (queryInfo.start <= 0) {
                ele.paging.prev.prop('disabled', true);
            } else {
                ele.paging.prev.prop('disabled', false);
            }

            if (pageIndex >= totalPage) {
                ele.paging.next.prop('disabled', true);
            } else {
                ele.paging.next.prop('disabled', false);
            }
        }

        var renderSearchResultList = function(result) {

            var temp = getRenderTemplate();
            var html = '';

            var doc = result.response.docs;
            for (var i = 0; i < doc.length; i++) {
                var str = temp.row;
                var itemInfo = JSON.parse(JSON.stringify(doc[i]));
                var docNodeNameList = ['doc_title', 'doc_url', 'doc_highlighting'];
                for (var j = 0; j < docNodeNameList.length; j++) {
                    itemInfo[docNodeNameList[j]] = itemInfo[docNodeNameList[j]] || '';
                }
                if (itemInfo.doc_title.toLowerCase() == 'title') {
                    itemInfo.doc_title = '';
                }
                if (itemInfo.doc_title == '' && itemInfo.doc_highlighting == '') {
                    continue;
                }
                if (itemInfo.doc_title == '') {
                    itemInfo.doc_title = itemInfo.doc_highlighting;
                    itemInfo.doc_highlighting = '';
                }
                itemInfo.doc_title = itemInfo.doc_title.replace('| Super Micro Computer, Inc.', '');
                itemInfo.doc_title = itemInfo.doc_title.replace('|  Super Micro Computer, Inc.', '');
                itemInfo.doc_title = itemInfo.doc_title.replace('- Super Micro Computer, Inc.', '');

                for (var j = 0; j < docNodeNameList.length; j++) {
                    var fieldStr = itemInfo[docNodeNameList[j]] || '';
                    if (docNodeNameList[j] == 'doc_url') {
                        var hostUrl = window.location.hostname;
                        fieldStr_ = fieldStr.replace('entweb.supermicro.com', hostUrl);
                        fieldStr = fieldStr.replace('www.supermicro.com', hostUrl);
                        fieldStr = fieldStr.replace('www.supermicro.com.tw', hostUrl);
                        fieldStr = fieldStr.replace('www.supermicro.nl', hostUrl);
                        str = replaceAll(str, '%' + docNodeNameList[j] + '%', fieldStr);
                    }
                    str = replaceAll(str, '%' + docNodeNameList[j] + '%', fieldStr);
                }
                html += str;
            }
            return html;
        }

        var seendSearchRequestforKeyword = function() {
            var keyword = ele.searchControl.find('input').val().trim();
            if (keyword == '') {
                return;
            }
            keyword = htmlEncode(keyword);
            queryInfo.keyword = keyword;
            queryInfo.total = 0;
            queryInfo.start = 0;
            sendSearchRequest(false);
        }

        var sendSearchRequest = function(isGoTop) {
            getSearchResult();
            if (isGoTop) {
                $('html,body').scrollTop(0);
            }
        }

        var htmlEncode = function(str) {
            var temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        }


        var init = function() {
            ele.searchControl.find('button').on('click', function() {
                seendSearchRequestforKeyword();
            });
            ele.searchControl.find('input').on('keypress', function(e) {
                if (e.keyCode == 13) {
                    seendSearchRequestforKeyword();
                }
            });
            ele.paging.prev.on('click', function() {
                queryInfo.start = queryInfo.start - 20;
                sendSearchRequest(true);
                return false;
            });
            ele.paging.next.on('click', function() {
                queryInfo.start = queryInfo.start + 20;
                sendSearchRequest(true);
                return false;
            });

            var initPageQuery = function() {
                var keyword = getUrlParameter('Search').trim();
                keyword = keyword.split('+');
                keyword = keyword.join(' ');
                keyword = decodeURIComponent(keyword);
                if (keyword.trim() == '') {
                    ele.loading.hide();
                    return;
                }
                keyword = htmlEncode(keyword);
                ele.searchControl.find('input').val(keyword);
                seendSearchRequestforKeyword();
            }()
        }
        init();


    }
    initSearchResult();
})(jQuery);