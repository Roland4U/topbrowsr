const json = require("./history.json");
const fs = require("fs");
const uuidv4 = require('uuid/v4');

const history = {
    showHistory: function () {
        return orderByDate(json.history);
    },
    showRecentHistory: function (limit) {
        return orderByDate(json.history).slice(0, limit);
    },
    saveHistory: function (title, url, callback) {
        let alreadyExists = false;
        for (let i = 0; i < json.history.length; i++) {
            if (url == json.history[i].url) {
                json.history[i].date = new Date();
                alreadyExists = true;
                break;
            }
        }
        if (!alreadyExists) {
            json.history.push({ title, url, id: uuidv4(), date: new Date() });
        }
        fs.writeFile('./views/history.json', JSON.stringify(json), 'utf8', callback);
    },
    deleteHistory: function (id, callback) {
        const index = json.history.find((entry) => entry.id === id);
        json.history.splice(index, 1);
        fs.writeFile('./views/history.json', JSON.stringify(json), 'utf8', callback);
    },
    deleteAllHistory: function (callback) {
        json.history = [];
        fs.writeFile('./views/history.json', JSON.stringify(json), 'utf8', callback);
    }
};

module.exports = history;

function orderByDate(history) {
    history.sort((a, b) => new Date(a.date) < new Date(b.date))
    return history;
}