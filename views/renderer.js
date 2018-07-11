window.$ = window.jQuery = require('jquery');
var uriHome = "https://www.google.com/";
const {
	remote
} = require('electron');

var app = new Vue({
	el: '#app',
	data: {
		url: uriHome,
		location: uriHome,
		canGoBack: false,
		canGoForward: false
	},
	methods: {
		go: function() {
			this.url = httpChecker(this.url);
			webview.loadURL(this.url);
		},
		back: function() {
			webview.goBack();
		},
		forward: function() {
			webview.goForward();
		},
		minimize: function() {
			remote.BrowserWindow.getFocusedWindow().minimize();
		},
		exit: function() {
			remote.app.quit();
		},
		reload: function() {
			webview.stop();
			webview.reload();
		}
	}
});

onload = () => {
	var webview = document.querySelector('webview');
	webview.addEventListener('will-navigate', function(event) {
		app.url = event.url;
		app.go();
	});

	webview.addEventListener('did-navigate', function(event) {
		app.url = event.url;
		app.canGoBack = webview.canGoBack();
		app.canGoForward = webview.canGoForward();
	});
}

function httpChecker(uri) {
	if (uri.search(/https?:\/\//)) {
		return "http://" + uri;
	}
	return uri;
}
