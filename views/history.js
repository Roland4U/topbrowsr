const json = require("./history.json");
const fs = require("fs");
const uuidv4 = require('uuid/v4');

const history = {
    showHistory: function () {
        return orderByDate(json.history);
    },
    showRecentHistory: function (limit) {
        return orderByDate(json.history).slice(limit);
    },
    saveHistory: function (title, url, callback) {
        json.history.push({ title, url, id: uuidv4(), date: new Date() });
        fs.writeFile('./views/history.json', JSON.stringify(json), 'utf8', callback);
    },
    deleteHistory: function (id, callback) {
        const index = json.history.find((entry) => entry.id === id);
        json.history.splice(index, 1);
        fs.writeFile('./views/history.json', JSON.stringify(json), 'utf8');
    }
};

module.exports = history;

function orderByDate(history){
    history.sort((a,b)=>new Date(a.date) < new Date(b.date))
    return history;
}