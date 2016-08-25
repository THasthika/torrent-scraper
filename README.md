#Torrent Scraper

Torrent Scraper is a node js library for scraping torrent sites for searching and accessing them in a easy way. Scrapers can be added or use existing ones for scraping different torrent sites.

## Available Scrapers

- kickass torrent (kat)
- isohunt (isohunt)

## Usage

`search(name, [scrapers,] callback)`

`searchShow(show_name, season_number, episode_number, [scrapers,] callback)`

``` javascript
var ts = require('torrent-scraper');

console.log(ts.scrapers); // list of all scrapers

// search for game of thrones season 1 episode 2 with all scrapers
ts.searchShow('Game of Thrones', 1, 2, function(entries) {
        var entry = entries[0];
        console.log(entry);
});

// search for suits season 1 episode 5 in the kat scraper only (kickass torrent)
ts.searchShow('Suits', 1, 5, ['kat'], function(entries) {
        var entry = entries[0];
        console.log(entry);
});

// search for deadpool in all scrapers
ts.search('Deadpool', function(entries) {
        var entry = entries[0];
        console.log(entry);
});
```

## Structure of a scraper

A scraper must saved inside the `scrapers` directory and be in the following format

``` javascript
// require all libraries that you use

// useful custom file for formating strings and other stuff
var util = require('../util');

var SEARCH_URL = "https://kat.cr/usearch/{:query:}/";

module.exports = function(query, cb) {
        var url = util.format(SEARCH_URL, {query: query});

        // search the site that you choose
	// the callback must be called from the function with the format below
        cb(err, [{
                name: name, // name of the torrent (required)
                size: size, // size of the torrent (optional)
                files: files, // file count of the torrent (optional)
                seeders: seeders, // seeders of the torrent (required)
                leechers: leechers, // leechers of the torrent (optional)
                magnet: magnet // magnet link of the torrent (required)
        }]);
};
```
