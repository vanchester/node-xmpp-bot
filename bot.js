var config = require ('./config.js'),
    xmpp = require('node-xmpp'),
    fs = require('fs'),
    cl = new xmpp.Client({jid: config.jid, password: config.password}),
    Plugins = require('./bot/plugins.js');

require('./bot/sendUnsafe.js');

cl.on('online', function() {
    console.log("Connected successfully");
    cl.send(new xmpp.Presence({}).c('show').t('online'));
});

// init plugins should be after on('online')
var plugins = new Plugins(__dirname + '/plugins', cl);

cl.on('stanza', function(stanza) {
    if (stanza.is('message') && stanza.attrs.type !== 'error') { // Important: never reply to errors!

        var message = stanza.getChildText('body');
        if (!message) {
            return;
        }
        console.log('Message from ' + stanza.attrs.from + ': ' + message);

        var params = message.split(' ');
        var command = params.shift().toLowerCase();
        console.log('Command ' + command);

        if (typeof plugins[command] == 'object' && plugins[command].max_access) {
            var jid = new xmpp.JID(stanza.attrs.from);

            if (config.adminJID.indexOf(jid.user + '@' + jid.domain) == -1) {
                console.log('Access denied for user ' + jid.user + '@' + jid.domain);
                return;
            }
        }

        if (typeof plugins[command] != 'object') {
            command = 'unknown';
        }

        if (typeof plugins[command].run != 'function') {
            console.log('Bad format of plugin ' + command);
            return;
        }

        // Swap addresses...
        stanza.attrs.to = stanza.attrs.from;
        delete stanza.attrs.from;
        stanza.remove('body');

        var body = null;
        try {
            body = plugins[command].run(params, stanza, plugins, this);
        } catch (e) {
            console.log(e);
            body = 'There is an error. Try again later';
        }

        if (body) {
            stanza.c('body').t(body);
            this.send(stanza);
        }
    }
});

cl.on('error', function(e) {
    console.error(e);
});
