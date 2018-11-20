window.$ = window.jQuery = require('jquery');

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
		},
		forward: function () {
			webview.goForward();
		},
		reloadStop: function () {
			if (webview.isLoading() || webview.isWaitingForResponse()) {
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
	var webview = document.querySelector('webview');

	webview.addEventListener('load-commit', function (event, asd) {
		if (webview.isLoading() || webview.isWaitingForResponse()) {
			vueApp.loading = true;
		} else {
			vueApp.loading = false;
		}
	});

	webview.addEventListener('did-finish-load', function (event) {
		vueApp.loading = false;
	});

	webview.addEventListener('did-fail-load', function (event) {
		vueApp.loading = false;
	});
	
	webview.addEventListener('will-navigate', function(event) {
		vueApp.loading = true;
		vueApp.currentLocation = event.url;
	});
	
	webview.addEventListener('did-navigate', function(event) {
		vueApp.loading = true;
		vueApp.currentLocation = event.url;
	});

	webview.addEventListener('did-navigate', function (event) {
		vueApp.currentLocation = event.url;
		vueApp.canGoBack = webview.canGoBack();
		vueApp.canGoForward = webview.canGoForward();
	});

	webview.addEventListener('update-target-url', function (event) {
		//show link of target bottom left
	});
}

function httpChecker(uri) {
	if (uri.search(/http?:\/\//) === 0 || uri.search(/https?:\/\//) === 0) {
		return uri;
	}
	return "http://" + uri;
}


//ADD KEYBOARD EVENTS
// <webview>.undo()
// Executes editing command undo in page.

// <webview>.redo()
// Executes editing command redo in page.

// <webview>.cut()
// Executes editing command cut in page.

// <webview>.copy()
// Executes editing command copy in page.

// <webview>.paste()
// Executes editing command paste in page.

// <webview>.delete()
// Executes editing command delete in page.

// <webview>.selectAll()
// Executes editing command selectAll in page.
