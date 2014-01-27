var fs = require('fs');

exports.load = {
    name: 'load',
    group: 'Administration',
    about: 'Load/reload plugin',
    help: 'load <FILE-NAME>',
    enabled: 1,
    max_access: 1,
    aliases: ['reload'],
    run: function(params, stanza, plugins, client) {
        if (params[0]) {
            params[0] = params[0].replace('/', '').replace('\\', '');
            if (!/.js$/.test(params[0])) {
                params[0] += '.js';
            }
            fs.exists('./plugins/' + params[0], function (exists) {
                if (!exists) {
                    stanza.c('body').t('File ' + params[0] + ' not found');
                } else {
                    if (require.cache[__dirname + '/' + params[0]]) {
                        delete require.cache[__dirname + '/' + params[0]];
                    }

                    var p = require('./' + params[0]);
                    var message = '';
                    for (var name in p) {
                        if (p[name].enabled != 1) {
                            message += 'Plugin \'' + name + '\' disabled\n';
                            continue;
                        }

                        plugins[name] = p[name];
                        message += 'Plugin \'' + name + '\' loaded successfully\n';
                        if (p[name].aliases) {
                            for (var i in p[name].aliases) {
                                plugins[p[name].aliases[i]] = p[name];
                            }
                        }
                        if (typeof plugins[name].afterLoad == 'function') {
                            plugins[name].afterLoad(client);
                        }
                    }
                    stanza.c('body').t(message);
                }

                client.send(stanza);
            });

            return null;
        }

        return this.help;
    }
};
