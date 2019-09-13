const { remote } = require('electron');
const { Menu, BrowserWindow, MenuItem, shell } = remote;
const fs = require("fs");

var webview;

onload = () => {
    webview = document.querySelector('webview');

    $("#url").keyup(function (e) {
        if (e.keyCode == 13) {
            let url = $("#url").val();
            loadURL(url);
        }
    });

    $("#back").click(function () {
        if (webview.canGoBack())
            webview.goBack();
    });

    $("#forward").click(function () {
        if (webview.canGoForward())
            webview.goForward();
    });

    $("#home").click(function () {
        loadURL("https://www.google.com/");
    });

    $("#reload").click(function () {
        webview.reload();
    });

    $("#stop").click(function () {
        webview.stop();
    });

    $("#opacity").change(function () {
        let opacityValue = $(this).val() / 100;
        changeOpacity(opacityValue);
    });

    $("#ignoreMouse").change(function () {
        enableClickThrough();
    });

    webview.addEventListener('did-start-loading', (e) => {
        showStop();
    });

    webview.addEventListener('did-stop-loading', (e) => {
        showRefresh();
    });


    webview.addEventListener('did-navigate', (e) => {
        $("#url").val(e.url);
    });

    webview.addEventListener('did-navigate-in-page', (e) => {
        $("#url").val(e.url);
    });

}

function showRefresh() {
    $("#reload").show();
    $("#stop").hide();
}

function showStop() {
    $("#reload").hide();
    $("#stop").show();
}

function loadURL(url) {
    if (url.indexOf("http") != 0) {
        url = "http://" + url;
    }
    console.log("Loading " + url);
    webview.loadURL(url);
}

function enableClickThrough() {
    console.log("Clickthrough enabled.")
    var window = remote.getCurrentWindow();
    window.setIgnoreMouseEvents(true);
}

function changeOpacity(opacity) {
    $("body").css('opacity', opacity);
}
