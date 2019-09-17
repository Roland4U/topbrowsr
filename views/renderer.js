const { remote } = require('electron');
const { Menu, BrowserWindow, MenuItem, shell } = remote;

var webview,
    bookmarks = [];

onload = () => {
    webview = document.querySelector('webview');

    // ********************************* TOOLBAR EVENTS *********************************

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

    $(".addBookmark").click(function () {
        addBookmark();
        refreshBookmarks();
    });

    $("#bookmarkList").delegate("li", "click", function (e) {
        let index = $('li').index(this) - 1;
        if (index == -1) {
            return;
        }
        if ($(e.target)[0].localName == "i") {
            deleteBookmark(index);
        } else {
            loadURL(bookmarks[index].url);
        }
    });

    $("#opacity").change(function () {
        let opacityValue = $(this).val() / 100;
        changeOpacity(opacityValue);
    });

    $("#ignoreMouse").change(function () {
        enableClickThrough();
    });

    $("#ytbToolbar").change(function (e) {
        if ($(this).prop("checked")) {
            webview.insertCSS('#masthead-container.ytd-app{ display: none;}')
        } else {
            webview.insertCSS('#masthead-container.ytd-app{ display: block;}')
        }
    });

    // ********************************* WEBVIEW EVENTS *********************************

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

    refreshBookmarks();
};

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

function addBookmark() {
    for (let i = 0; i < bookmarks.length; i++) {
        if (webview.getURL() == bookmarks[i].url)
            return;
    }
    bookmarks.push({
        url: webview.getURL(),
        title: webview.getTitle()
    });
    saveBookmark();
}

function saveBookmark(callback) {
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    if (callback)
        callback();
}

function deleteBookmark(i) {
    bookmarks.splice(i, 1);
    saveBookmark(() => {
        refreshBookmarks();
    });
}

function refreshBookmarks() {
    let storage = localStorage.getItem("bookmarks");
    $("li").remove(".bookmark");
    if (storage != undefined) {
        bookmarks = JSON.parse(storage);

        for (let i = 0; i < bookmarks.length; i++) {
            $('#bookmarkList').append('<li class="bookmark"><span>' + bookmarks[i].title + '</span><i class="fas fa-times"></i></li>');
        }
    } else {
        bookmarks = [];
        console.log("There was an error loading bookmarks");
    }
}