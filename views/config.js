const json = require("./config.json");
function config() { }

config.prototype = {
    ...json,
    changeConfigParam: function (key, value) {
        return this;
    }
};

module.exports = () => {
    return new config();
};
