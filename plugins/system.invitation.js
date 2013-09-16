var xmpp = require('node-xmpp');

exports.invitation = {
    name: '',
    enabled: 1,
    afterLoad: function (client) {
        client.on('stanza', function(stanza) {
            if (stanza.is('presence') && stanza.type == 'subscribe') {
                this.send(new xmpp.Presence({ to: stanza.from, type: 'subscribed' }).c('show').t('online'));
                this.send(new xmpp.Presence({ to: stanza.from }).c('show').t('online'));

                try {
                    var body = "Welcome to Bot! Type 'help' to see available commands";
                    if (body) {
                        var message = new xmpp.Message({
                            to: stanza.from,
                            type: "chat",
                            'xmlns:stream': "http://etherx.jabber.org/streams"
                        }).c('body').t(body);
                        this.send(message);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    },
    run: function () {}
}