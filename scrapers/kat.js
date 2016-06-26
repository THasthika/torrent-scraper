var cheerio = require('cheerio');
var request = require('request');

var util = require('../util');

var SEARCH_URL = "https://kat.cr/usearch/{:query:}/";

module.exports = function(query, cb) {
        var url = util.format(SEARCH_URL, {query: query});
        request({
                url: url,
                gzip: true
        }, function(err, res) {
                var data = [];
                // console.log();
                var $ = cheerio.load(res.body);
                var rows = $('table.data').children('tr:not(.firstr)');
                for(var i = 0; i < rows.length; i++) {
                        var _$ = cheerio.load($('table.data').children('tr:not(.firstr)')[0]);
                        var magnet = _$('i.ka-magnet').parent().attr('href');
                        var name = _$('a.cellMainLink').text();
                        var size = _$('td:nth-child(2)').text();
                        var files = Number(_$('td:nth-child(3)').text());
                        var seeders = Number(_$('td:nth-child(5)').text());
                        var leechers = Number(_$('td:nth-child(6)').text());
                        data.push({
                                name: name,
                                size: size,
                                files: files,
                                seeders: seeders,
                                leechers: leechers,
                                magnet: magnet
                        });
                }
                cb(err, data);
        });
};
