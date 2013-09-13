var geoip = require('geoip-lite');

exports.geoip = {
    name: 'geoip',
    group: 'Net',
    about: 'Retru ndata about location by IP address',
    help: 'geoip <IP>',
    enabled: 1,
    run: function(params) {
        if (!params[0]) {
            return this.help;
        }

        var geo = geoip.lookup(params[0]);
        return '\nCountry: ' + (geo.country || 'unknown') + '\n' +
               'City: ' + (geo.city || 'unknown') +
                (geo.ll ? '\nhttps://maps.google.com/maps?t=h&q=loc:' + geo.ll.join(',') + '&z=6' : '');

    }
};