const json = require("./bookmarks.json");
const fs = require("fs");
const uuidv4 = require('uuid/v4');

const bookmarks = {
    showBookmarks: function () {
        return json.bookmarks;
    },
    saveBookmark: function (title, url, callback) {
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