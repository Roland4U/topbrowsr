window.$ = window.jQuery = require('jquery');
var webview;
const {
	remote
} = require('electron'),
	config = require("./config"),
	bookmarks = require("./bookmarks"),
	history = require("./history");

var vueApp = new Vue({
	el: '#vueApp',
	data: {
		currentLocation: config.homeUri,
		showMenuBar: false,
		loading: false,
		canGoBack: false,
		canGoForward: false
	},
	methods: {
		maximize: function () {
			if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
				remote.BrowserWindow.getFocusedWindow().unmaximize();
			} else {
				remote.BrowserWindow.getFocusedWindow().maximize();
			}
		},
		minimize: function () {
			remote.BrowserWindow.getFocusedWindow().minimize();
		},
		exit: function () {
			remote.app.quit();
		},
		loadUri: function () {
			this.currentLocation = httpChecker(this.currentLocation);
			webview.loadURL(this.url);
		},
		back: function () {
			webview.goBack();
			bookmarks.saveBookmark("title",this.currentLocation, function(asd){
				console.log("well?", asd);
			});
		},
		forward: function () {
			webview.goForward();
		},
		reloadStop: function () {
			if (webview.isLoading()) {
				webview.stop();
			} else {
				webview.reload();
			}
		},
		showBookmarks: function () {

		},
		showHistory: function () {
			
		}
	}
});

onload = () => {
	webview = document.querySelector('webview');

	webview.addEventListener('load-commit', function (event, asd) {
		refreshValues('load-commit');
	});

	webview.addEventListener('did-finish-load', function (event) {
		refreshValues('did-finish-load');
	});

	webview.addEventListener('did-stop-loading', function (event) {
		refreshValues('did-stop-loading');
	});

	webview.addEventListener('will-navigate', function (event) {
		refreshValues('will-navigate');
		refreshUri(event, 'will-navigate');
	});

	webview.addEventListener('did-navigate', function (event) {
		refreshValues('did-navigate');
	});

	webview.addEventListener('did-navigate-in-page', function (event) {
		refreshValues('did-navigate-in-page');
	});

	webview.addEventListener('update-target-url', function (event) {
		//show link of target bottom left
	});

	webview.addEventListener('new-window', function (event) {
		event.preventDefault();
	});
}

function httpChecker(uri) {
	if (uri.search(/http?:\/\//) === 0 || uri.search(/https?:\/\//) === 0) {
		return uri;
	}
	return "http://" + uri;
}

function refreshValues(a) {
	webview = document.querySelector('webview');
	vueApp.canGoBack = webview.canGoBack();
	vueApp.canGoForward = webview.canGoForward();
	if (webview.isLoading()) {
		vueApp.loading = true;
	} else {
		vueApp.loading = false;
	}
}

function refreshUri(event, a) {
	if (event.url && vueApp.currentLocation !== event.url) {
		vueApp.currentLocation = event.url;
	}
}

//ADD KEYBOARD EVENTS
//go back, find, etc