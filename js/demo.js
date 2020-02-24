var urls = {
	"/products/ultra": "/products/nfo/Ultra.cfm",
	"/products/mp": "/products/nfo/Xeon_MP.cfm",
	"/products/mainstream": "/products/nfo/Xeon_SP_X11.cfm?pg=SS&show=SELECT&type=MS",
	"/products/gpu": "/products/nfo/gpu.cfm",
	"/products/dco": "/products/nfo/Xeon_SP_X11.cfm?pg=SS&show=SELECT&type=DCO",
	"/products/wio": "/products/nfo/WIO.cfm",
	"/products/bigtwin": "/products/nfo/BigTwin.cfm",
	"/products/fattwin": "/products/nfo/FatTwin.cfm",
	"/products/twinpro": "/products/nfo/2UTwinPro.cfm",
	"/products/twin-servers": "/products/nfo/2UTwin2.cfm",
	"/products/general-purpose-storage": "",
	"/products/top-loading-storage": "",
	"/products/rackmount": "",
	"/products/blade": "",
	"/products/storage": "/products/nfo/storage.cfm",
	"/products/twin": "/products/nfo/Twin.cfm",
	"/products/superblade": "/products/SuperBlade/",
	"/products/microblade": "/products/MicroBlade/",
	"/products/superblade/networking": "/products/SuperBlade/networking/",
	"/products/superblade/enclosure": "/products/SuperBlade/enclosure/",
	"/products/superblade/modules": "/products/SuperBlade/module/",
	"/products/superblade/powersupply": "/products/SuperBlade/powersupply/",
	"/products/superblade/management": "/products/SuperBlade/management/",
	"/products/superblade/storage": "",
	"/products/microblade/networking": "/products/MicroBlade/networking/",
	"/products/microblade/enclosure": "/products/MicroBlade/enclosure/",
	"/products/microblade/modules": "/products/MicroBlade/module/",
	"/products/microblade/powersupply": "/products/MicroBlade/powersupply/",
	"/products/microblade/management": "/products/MicroBlade/management/",
	"/products/microcloud": "/products/nfo/MicroCloud.cfm",
	"/products/motherboards": "/products/motherboard/",
	"/products/chassis": "/products/chassis/",
    "/products/chassis?pro=filter%3Dformfactor%26formfactor%3D1U": "/products/chassis/1U",
    "/products/chassis?pro=filter%3Dformfactor%26formfactor%3D2U": "/products/chassis/2U",
    "/products/chassis?pro=filter%3Dformfactor%26formfactor%3D3U": "/products/chassis/3U",
    "/products/chassis?pro=filter%3Dformfactor%26formfactor%3D4U": "/products/chassis/4U",
    "/products/chassis?pro=filter%3Dformfactor%26formfactor%3DMid-Tower%2CMini-Tower": "/products/chassis/tower",
    "/products/chassis?pro=filter%3Dformfactor%26formfactor%3DMini-ITX": "/products/chassis/Mini-ITX",
    "/products/chassis?pro=filter%3Dfeature%26feature%3DMobile%20Rack": "/products/chassis/mobileRack",
    "/products/chassis?pro=filter%3Dfeature%26feature%3DJBOD": "/products/chassis/JBOD",
	"/products/motherboards/matrix": "/support/resources/MB_matrix.php",
	"/products/embedded/servers": "/products/embedded/embedded_server.cfm",
	"/products/embedded/compact-and-industrial": "/products/system/Compact/",
	"/products/chassis/embedded-iot": "/products/embedded/embedded_chassis.cfm",
	"/products/motherboards/embedded-iot-boards": "/products/embedded/embedded_motherboard.cfm",
	"/products/systems": "/products/system/",
}

var path = window.location.pathname.toLowerCase();
var languages = ['/en', '/zh_tw', '/zh_cn', '/ja'];

var langParam = "mlg=0";
var lang = "/en";
for (var i = 0; i < languages.length; i++) {
	if (path.indexOf(languages[i]) == 0) {
		langParam = "mlg=" + i;
		path = path.substring(languages[i].length);
		break;
	}
}

var link = (urls[path] ? urls[path] : "");
if (window.location.search != '')
	link = (urls[path+window.location.search] ? urls[path+window.location.search] : link);

var badgeLabel = "Switch to legacy site";
if (link == "") {
	badgeLabel = "Switch to legacy homepage";
	link = "/index_home.cfm";
}

if (link.indexOf("?") >= 0) {
	link += "&" + langParam;
} else {
	link += "?" + langParam;
}


//link = "https://www.supermicro.com/index_splash.cfm?path=" + encodeURIComponent(link);
var badgeDIV = '<div id="demo-badge">' +
	//'<div>Beta Site</div>' +
	'<div>' +
	'<a class="btns btn-slide btn-slide-outline js-link-contact-form" href="/contact/feedback_web"><i class="fa fa-paper-plane"></i><span>Send Feedback</span></a>' +
	//'<span class="break-line"></span>' +
	//'<a class="ent-to-legacy" target="smci" href="' + link + ' "><i class="fa fa-sign-out"></i><span>' + badgeLabel + '</span></a>' +
	'</div>' +
	'</div>';

Drupal.attachBehaviors(document, Drupal.settings); // Reattach all drupal event


(function ($) {
	"use strict";

	jQuery(document).ready(function () {
		jQuery('#footer').prepend(badgeDIV);


		$('.ent-to-legacy').click(function () {
			jQuery.ajax({
				url: "/sites/default/files/php/optoutTrack.php",
				complete: function (jqXHR, textStatus) {
					console.log("complete");
				}
			});
		});


	});

})(jQuery);

