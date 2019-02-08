window.$ = window.jQuery = require('jquery');
var webview;
const {
	remote
} = require('electron'),
	config = require("./config"),
	bookmarks = require("./bookmarks"),
	history = require("./history");
const toastr = require("toastr");

toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": true,
	"positionClass": "toast-top-right",
	"preventDuplicates": true,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

const vueApp = new Vue({
	el: '#vueApp',
	data: {
		currentLocation: config.homeUri,
		showMenuBar: false,
		loading: false,
		canGoBack: false,
		canGoForward: false,
		showingBookmarks: false,
		showingHistory: false,
		bookmarks: [],
		history: []
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
		loadUri: function (uri) {
			this.currentLocation = httpChecker(uri ? uri : this.currentLocation);
		},
		back: function () {
			webview.goBack();
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
		goHome: function () {
			this.currentLocation = config.homeUri;
		},
		showBookmarks: function () {
			this.bookmarks = bookmarks.showBookmarks();
			this.showingBookmarks = true;
		},
		addBookmark: function () {
			const self = this;
			bookmarks.saveBookmark(webview.getTitle(), webview.getURL(), () => {
				self.bookmarks = bookmarks.showBookmarks();
				self.showingBookmarks = false;
			});
		},
		goBookmark: function (index) {
			this.loadUri(this.bookmarks[index].url);
			this.showingBookmarks = false;
		},
		deleteBookmark: function (index) {
			const self = this;
			bookmarks.deleteBookmarks(this.bookmarks[index].id, () => {
				self.bookmarks = bookmarks.showBookmarks();
				self.showingBookmarks = false;
			});
		},
		showHistory: function () {
			this.history = history.showHistory();
			this.showingHistory = true;
		},
		addHistory: function () {

		},
		goHistory: function (index) {

		},
		clearHistory: function (index) {

		},
		deleteHistory: function (index) {

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
		refreshUri(event, 'did-get-redirect-request');
	});

	webview.addEventListener('did-start-loading', function (event) {
		refreshValues('did-start-loading');
	});

	webview.addEventListener('did-stop-loading', function (event) {
		refreshValues('did-stop-loading');
	});

	webview.addEventListener('did-get-redirect-request', function (event) {
		refreshValues('did-get-redirect-request');
		refreshUri(event, 'did-get-redirect-request');
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

document.querySelector("#vueApp").addEventListener("mousedown", function (e) {
	let bookmarkClick = false;
	for (let i = 0; i < e.path.length; i++) {
		if (e.path[i].className === "bookmarksDropdown") {
			bookmarkClick = true;
			break;
		}
	}
	if (!bookmarkClick) {
		vueApp.showingBookmarks = false;
	}
});
