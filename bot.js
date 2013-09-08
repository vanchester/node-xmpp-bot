var config = require ('./config.js'),
    xmpp = require('node-xmpp'),
    cl = new xmpp.Client({jid: config.jid, password: config.password});

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

        stanza.c('body').t('Hello');

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
