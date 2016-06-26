
var pad = require('pad');

var SHOW_SEARCH_PATTERNS = [
        "{:name:} s{:season:}e{:episode:}",
        "{:name:} s{:season:} e{:episode:}",
        "{:name:} season {:season:} episode {:episode:}"
];

function format(str, vals) {
        for(var i in vals) {
                var val = vals[i];
                if(typeof val == "number") {
                        val = pad(2, val, '0');
                }
                str = str.replace("{:"+i+":}", val);
        }
        return str;
}

module.exports = {
        getShowQueries: function(name, season, episode) {
                var res = [];
                for(var i = 0; i < SHOW_SEARCH_PATTERNS.length; i++) {
                        res.push(format(SHOW_SEARCH_PATTERNS[i], {
                                name: name,
                                season: season,
                                episode: episode
                        }));
                }
                return res;
        },
        format: format
}
