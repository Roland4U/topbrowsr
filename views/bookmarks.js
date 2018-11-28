const json = require("./bookmarks.json");
const fs = require("fs");
const uuidv4 = require('uuid/v4');

const bookmarks = {
    showBookmarks: function () {
        return json.bookmarks;
    },
    saveBookmark: function (title, url, callback) {
        if (alreadyAdded(url)) {
            return;//show alert
        }
        json.bookmarks.push({ title, url, id: uuidv4() });
        fs.writeFile('./views/bookmarks.json', JSON.stringify(json), 'utf8', callback);
    },
    deleteBookmarks: function (id, callback) {
        const index = json.bookmarks.find((bookmark) => bookmark.id === id);
        json.bookmarks.splice(index, 1);
        fs.writeFile('./views/bookmarks.json', JSON.stringify(json), 'utf8', callback);
    }
};

module.exports = bookmarks;

function alreadyAdded(url) {
    json.bookmarks.forEach(bookmark => {
        if (bookmark.url === url) {
            return true;
        }
    });
    return false;
}