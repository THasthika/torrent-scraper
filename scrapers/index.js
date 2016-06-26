var fs = require('fs');

var scrapers = {};

function addScraper(scraper) {
        for(var i = 0; i < scraper.urls.length; i++) {
                scrapers[scraper.urls[i]] = scraper.scraper;
        }
}

module.exports = function() {
        var files = fs.readdirSync(__dirname);
        var filename = require('path').parse(__filename).base;
        files.splice(files.indexOf(filename), 1);
        for(var i = 0; i < files.length; i++) {
                addScraper(require("./"+files[i]));
        }
        return scrapers;
}
