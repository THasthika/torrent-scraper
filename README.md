#Torrent Scraper

Torrent Scraper is a node js library for scraping torrent sites for searching and accessing them in a easy way.

## Plug in scrapers

Scrapers can be added or use existing ones for scraping different torrent sites.

## Structure of a scraper

A scraper must be in the following format

``` javascript
// require all libraries that you use

// useful custom file for formating strings and other stuff
var util = require('../util');

var SEARCH_URL = "https://kat.cr/usearch/{:query:}/";

module.exports = function(query, cb) {
        var url = util.format(SEARCH_URL, {query: query});

        // search the site that you choose

        return {
                name: name, // name of the torrent (required)
                size: size, // size of the torrent (optional)
                files: files, // file count of the torrent (optional)
                seeders: seeders, // seeders of the torrent (required)
                leechers: leechers, // leechers of the torrent (optional)
                magnet: magnet // magnet link of the torrent (required)
        }
};
```
