var fs = require('fs');

exports.version = {
    name: 'version',
    about: 'Show version of the bot',
    group: 'Administration',
    help: '',
    enabled: 1,
    aliases: ['ver'],
    max_access: 1,
    run: function (params, stanza, plugins, client) {
        try {
            fs.readFile(__dirname + '/../VERSION', function read(err, data) {
                if (err) {
                    throw err;
                }

                stanza.c('body').t('Node-XMPP-bot version ' + data.toString().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,''));
                client.send(stanza);
            });
        } catch (e) {
            console.log(e);
        }
    }
};
