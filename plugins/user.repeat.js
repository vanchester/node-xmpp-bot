var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    xmpp = require('node-xmpp'),
    config = require('../config.js');

exports.repeat = {
    name: 'repeat',
    group: 'User tools',
    about: 'Repeat last command',
    help: 'repeat - repeat last command',
    enabled: 1,
    aliases: ['!!', '!', 'rt'],
    run: function (params, stanza, plugins, client) {
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort || 27017) + '/' + config.dbName, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }

            var collection = db.collection('history');

            var jid = new xmpp.JID(stanza.attrs.to);
            var userJID = jid.user + '@' + jid.domain;

            collection.findOne({jid: userJID, type: 'chat'}, {sort: {date: -1}}, function (err, item) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (!item) {
                    return;
                }

                var params = item.message.split(' ');
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

                var body = null;
                try {
                    body = plugins[command].run(params, stanza, plugins, client);
                } catch (e) {
                    console.log(e);
                    body = 'There is an error. Try again later';
                }

                if (body) {
                    stanza.c('body').t(body);
                    client.send(stanza);
                }
            });

        });

        return null;
    }
};
