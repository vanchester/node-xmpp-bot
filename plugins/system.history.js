var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    xmpp = require('node-xmpp'),
    config = require('../config.js');

exports.history = {
    name: '',
    enabled: 1,
    max_access: 1,
    afterLoad: function (client) {
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort || 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            db.collection('history').indexInformation(function (err, indexes) {
                if (!indexes.jid_1) {
                    console.log('creating index for collection history');
                    db.createCollection('history', function (err, collection) {
                        if (!err) {
                            collection.createIndex({'jid': 1}, function () {});
                            collection.createIndex({'type': 1}, function () {});
                            collection.createIndex({'date': 1}, function () {});
                        }
                    });
                }
            });

            client.on('stanza', function(stanza) {
                if (stanza.is('message') && stanza.attrs.type !== 'error') {
                    var jidFrom = new xmpp.JID(stanza.attrs.from);
                    var message = stanza.getChildText('body');
                    var type = stanza.attrs.type;
                    if (!message || !type) {
                        return;
                    }

                    db.collection('history').insert({
                        'date': new Date(),
                        'jid': jidFrom.user + '@' + jidFrom.domain,
                        'type': type,
                        'message': message
                    }, function () {});
                }
            });
        });
    }
};
