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
		showMenuBar: false
	},
	methods: {

	}
});