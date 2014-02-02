var xmpp = require('node-xmpp');

exports.invitation = {
    name: '',
    enabled: 1,
    afterLoad: function (client) {
        client.on('stanza', function(stanzaOrig) {
            var stanza = stanzaOrig.clone();
            if (stanza.is('presence') && stanza.attrs.type == 'subscribe') {
                var jidFrom = new xmpp.JID(stanza.attrs.from);
                var jidTo = new xmpp.JID(stanza.attrs.to);
                var userJID = jidFrom.user + '@' + jidFrom.domain;
                var botJID = jidTo.user + '@' + jidTo.domain;
                if (userJID == botJID) {
                    return;
                }

                //console.log('send ADD request to server');
                var addRequest = new xmpp.Iq({
                    from: botJID,
                    type: 'set'
                });
                addRequest
                    .c('query', {xmlns: 'jabber:iq:roster'})
                    .c('item', {jid: userJID, name: userJID, subscription: 'from'})
                    .c('group').t('Friends');

                //console.log(addRequest.toString());

                client.send(addRequest);

                //console.log('Send presence stanzas');
                var acceptedSubscription = new xmpp.Presence({
                    from: stanza.attrs.to,
                    to: stanza.attrs.from,
                    type: 'subscribed'
                });
                acceptedSubscription.c('show').t('online');

                //console.log(subscribedSubscription.toString());
                client.send(acceptedSubscription);

                //console.log('send online status');
                var status = new xmpp.Presence({
                    'from': botJID,
                    'to': userJID,
                    'type': 'subscribe',
                    'xmlns:stream': 'http://etherx.jabber.org/streams'
                });
                status.c('show').t('online');

                //console.log(status.toString());
                client.send(status);

                try {
                    var body = "Welcome to Bot! Type 'help' to see available commands";
                    if (body) {
                        var message = new xmpp.Message({
                            from: stanza.attrs.to,
                            to: stanza.attrs.from,
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
