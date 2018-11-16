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
		loading: false
	},
	methods: {
		maximize: function() {
			if(remote.BrowserWindow.getFocusedWindow().isMaximized()){
				remote.BrowserWindow.getFocusedWindow().unmaximize();
			} else {
				remote.BrowserWindow.getFocusedWindow().maximize();
			}
		},
		minimize: function() {
			remote.BrowserWindow.getFocusedWindow().minimize();
		},
		exit: function() {
			remote.app.quit();
		},
	}
});