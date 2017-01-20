var cheerio = require('cheerio');
var request = require('request');

var util = require('../util');

var BASE_URL = "https://isohunt.to{:path:}";
var SEARCH_URL = "https://isohunt.to/torrents/?ihq={:query:}&Torrent_sort=-seeders";

function getMagnet(link, cb) {
        var url = util.format(BASE_URL, {path: link});
        request({
                url: url,
                gzip: true
        }, function(err, res) {
		if(err) {
			return cb(true, null);
		}
                $ = cheerio.load(res.body);
		var magnet = $('div.p div.btn-group a:nth-child(2)').attr('href');
		cb(null, magnet);
        });
}

function getMagnets(torrents, limit, cb) {
        var entries = [];
        var finished = false;
        var torrent_count = torrents.length;
        var finished_count = 0;
	
	if(torrents.length == 0) return cb(null, []);

        function _callback(err, t, magnet) {
                finished_count++;
                if(!err) {
			entries.push({
                        	name: t.name,
                        	size: t.size,
                        	magnet: magnet,
                        	seeders: t.seeders,
                        	leechers: null,
                        	files: null
                	});
		}
                if(torrents.length > 0) {
                        var torrent = torrents.pop();
                        getMagnet(torrent.link, function(magnet) {
                                _callback(torrent, magnet);
                        });
                } else if(finished_count == torrent_count && !finished) {
                        cb(null, entries);
                }
        };

        for(var i = 0; i < torrents.length && i < limit; i++) {
                (function(t) {
                        getMagnet(t.link, function(err, magnet) {
                                _callback(err, t, magnet);
                        });
                })(torrents.pop());
        }
}

module.exports = function(query, cb) {
        var url = util.format(SEARCH_URL, {query: query});
        request({
                url: url,
                gzip: true
        }, function(err, res) {
                if (err) {
                    return cb(true, []);
                }

                var $ = cheerio.load(res.body);
                var rows = $('div#search-list table tbody').children('tr');

                var torrs = [];

                for(var i = 0; i < rows.length; i++) {
                        var _$ = cheerio.load(rows[i]);
                        var name = _$('td.title-row a span').text();
                        var link = _$('td.title-row a').attr('href');
                        var size = _$('td.size-row').text();
                        var seeders = Number(_$('td.sy').text());
                        torrs.push({
                                name: name,
                                size: size,
                                seeders: seeders,
                                link: link
                        });
                }
                
                getMagnets(torrs, 10, cb);
        });
};
