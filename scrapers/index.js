var fs = require('fs');

var scrapers = {};

module.exports = function() {
        var files = fs.readdirSync(__dirname);
        files.splice(files.indexOf('index.js'), 1);
        for(var i = 0; i < files.length; i++) {
                var name = require('path').parse(files[i]).name;
                scrapers[name] = require("./"+files[i]);

        }
        return scrapers;
}
