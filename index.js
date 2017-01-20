var scrapers = require('./scrapers')();
var util = require('./util');


// compares two torrent files
function _compare(a, b) {
        if(a.seeders > b.seeders)
                return -1;
        else
                return 1;
}

// search through all the queries with the given scraper
function searchAllQueries(queries, scraper, cb) {
        function _searchQueries(queries, entries, scraper, cb) {
                if(queries.length == 0) {
                        cb(entries);
                        return;
                }
                var query = queries.pop();
                scrapers[scraper](query, function(err, data) {
			if(!err) {
				entries = entries.concat(data);
			}
                        _searchQueries(queries, entries, scraper, cb);
                });
        }
        if(scrapers[scraper] != undefined)
                _searchQueries(queries, [], scraper, cb);
        else
                cb([]);
}

// search queries using the given list of available scrapers
function searchScrapers(queries, _scrapers, cb) {
        function _searchScrapers(queries, entries, _scrapers, cb) {
                if(_scrapers.length == 0) {
                        cb(entries);
                        return;
                }
                var scraper = _scrapers.pop();
                var q = queries.slice();
                searchAllQueries(q, scraper, function(data) {
                        for(var j = 0; j < data.length; j++) {
                                var found = false;
                                for(var i = 0; i < entries.length; i++) {
                                        if(entries[i].name == data[j].name) {
                                                found = true;
                                                break;
                                        }
                                }
                                if(!found) entries.push(data[j]);
                        }
                        _searchScrapers(queries, entries, _scrapers, cb);
                });
        }
        _searchScrapers(queries, [], _scrapers, function(entries) {
                entries = entries.sort(_compare);
                cb(entries);
        });
}

function search(query, _scrapers, cb) {
        if(typeof query == "string") {
		query = [query];
	}
	if(typeof _scrapers == "string") {
		_scrapers = [_scrapers];
	}
        if(typeof _scrapers == "function") {
                cb = _scrapers;
                _scrapers = Object.keys(scrapers);
        }
        searchScrapers(query, _scrapers, cb);
};

function searchShow(name, season, episode, _scrapers, cb) {
        var queries = util.getShowQueries(name, season, episode);
        search(queries, _scrapers, cb);
};

module.exports = {
        search: search,
        searchShow: searchShow,
        scrapers: Object.keys(scrapers)
};
