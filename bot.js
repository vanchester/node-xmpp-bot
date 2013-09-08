var config = require ('./config.js'),
    xmpp = require('node-xmpp'),
    fs = require('fs'),
    cl = new xmpp.Client({jid: config.jid, password: config.password});

var plugins = {};
fs.readdirSync("./plugins").forEach(function(file) {
    var p = require("./plugins/" + file);
    for (var name in p) {
        if (p[name].enabled != 1) {
            continue;
        }

        plugins[name] = p[name];
    }
});

console.log('Loaded plugins:');
console.log(plugins);

cl.on('online', function() {
    console.log("Connected successfully");
    cl.send(new xmpp.Element('presence', {}).
        c('show').t('online').up().
        c('status').t('Happily echoing your <message/> stanzas')
    );
});

cl.on('stanza', function(stanza) {
    if (stanza.is('message') && stanza.attrs.type !== 'error') { // Important: never reply to errors!

        var message = stanza.getChildText('body');
        if (!message) {
            return;
        }
        console.log('Message from ' + stanza.attrs.from + ': ' + message);

        var params = message.split(' ');
        var command = params.shift();
        console.log('Command ' + command);

        if (typeof plugins[command] != 'object') {
            if (typeof plugins['unknown'] == 'object') {
                console.log('Unknown command');
                command = 'unknown';
            } else {
                console.log('can not process this message');
                return;
            }
        }

        if (typeof plugins[command].run != 'function') {
            console.log('Bad format of plugin ' + command);
            return;
        }

        stanza.c('body').t(plugins[command].run(params, stanza.attrs.from, plugins));

        // Swap addresses...
        stanza.attrs.to = stanza.attrs.from;
        delete stanza.attrs.from;
        // and send back.
        cl.send(stanza);
    }
});

cl.on('error', function(e) {
    console.error(e);
});
