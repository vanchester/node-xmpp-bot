var dns = require('dns');

exports.resolve = {
    name: 'resolve',
    about: 'Resolve domain records',
    help: 'resolve <DOMAIN>',
    enabled: 1,
    run: function(params, stanza, plugins, client) {
        if (!params[0]) {
            return this.help;
        }

        dns.resolve4(params[0], function (err, addresses) {
            var message = 'A: ';
            message += err || JSON.stringify(addresses, null, 2).replace(/[\r\n]/g, '');
            dns.resolveMx(params[0], function (err, addresses) {
                message += '\nMX: ';
                message += err || JSON.stringify(addresses, null, 2).replace(/[\r\n]/g, '');
                dns.resolveTxt(params[0], function (err, addresses) {
                    message += '\nTxt: ';
                    message += err || JSON.stringify(addresses, null, 2).replace(/[\r\n]/g, '');
                    dns.resolveSrv(params[0], function (err, addresses) {
                        message += '\nSrv: ';
                        message += err || JSON.stringify(addresses, null, 2).replace(/[\r\n]/g, '');
                        dns.resolveNs(params[0], function (err, addresses) {
                            message += '\nNS: ';
                            message += err || JSON.stringify(addresses, null, 2).replace(/[\r\n]/g, '');
                            dns.resolveCname(params[0], function (err, addresses) {
                                message += '\nCName: ';
                                message += err || JSON.stringify(addresses, null, 2).replace(/[\r\n]/g, '');
                                stanza.c('body').t(message);
                                client.send(stanza);
                            });
                        });
                    });
                });
            });
        });

        return null;
    }
};