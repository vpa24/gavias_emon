var cookieName = 'smcicookieconsent';
if (Cookies.get(cookieName) === undefined) {
	//console.log('smcigdpralert not set');
    var message = 'This site uses cookies.  By continuing to browse the site you are agreeing to our use of cookies. Review our cookies information <a href="/en/about/policies/privacy#cookies">here</a> for more details.';
	var path = window.location.pathname;
	//console.log(path);
	if (path.indexOf('/zh_tw/') == 0) {
        message = '本網站使用cookies。 繼續瀏覽本網站即表示您同意我們使用cookies。 有關詳細資訊，請查看<a href="/zh_tw/about/policies/privacy#cookies">我們的cookie訊息</a>。';
    }
	else if (path.indexOf('/zh_cn/') == 0)  {
        message = '这个站点使用Cookies。继续浏览网站表示您同意我们使用Cookies。在<a href="/zh_cn/about/policies/privacy#cookies">这里</a>查看Cookies信息以获取更多细节。';
    }
	else if (path.indexOf('/ja/') == 0) {
        message = 'このサイトはCookieを使用しています。 サイトを閲覧し続けることで、Cookieの使用に同意したことになります。 詳細については、こちらの<a href="/ja/about/policies/privacy#cookies">クッキー情報</a>を確認してください。';
    }

	jQuery('body').prepend('<div id="alert-container" style="z-index:10000">' +
	'<div class="alert-main">' + message + '</div>' +
	'<a class="alert-close" href="#" onclick="return closeAlert()">' + 
	'<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 13.3 13.3"><defs><style>  .cls-1{fill:white;}</style></defs><polygon class="cls-1" points="12.2 0 13.3 1.2 7.8 6.7 13.3 12.2 12.2 13.3 6.7 7.8 1.2 13.3 0 12.2 5.5 6.7 0 1.2 1.2 0 6.7 5.5 12.2 0"/></svg>' +
	'</a>' +
	'</div>');
	jQuery('#alert-container').slideDown(600);
}

function closeAlert() {
	jQuery('#alert-container').remove(); 
	Cookies.set(cookieName, '1', { domain: window.location.hostname, expires: 36500 });
	return false;	
}

