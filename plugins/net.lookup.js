var dns = require('dns');

exports.lookup = {
    name: 'lookup',
    group: 'Net',
    about: 'DNS lookup',
    help: 'lookup <DOMAIN>',
    enabled: 1,
    run: function(params, stanza, plugins, client) {
        if (params[0]) {
            dns.lookup(params[0], function (err, address, family) {
                if (err) {
                    stanza.c('body').t('Wrong domain');
                } else {
                    stanza.c('body').t(address);
                }
                client.send(stanza);
            });
            return null;
        }

        return this.help;
    }
};