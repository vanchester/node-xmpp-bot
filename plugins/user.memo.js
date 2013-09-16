var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    xmpp = require('node-xmpp');

exports.memo = {
    name: 'memo',
    group: 'User tools',
    about: 'Saving short message',
    help: 'memo - list all your saved notes\nmemo <NAME> - show saved note <NAME>\nmemo add <NAME> <TEXT> - save <TEXT> with name <NAME>\nmemo del <NAME>',
    enabled: 1,
    aliases: ['invert'],
    afterLoad: function () {
        var config = require('../config.js');
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            db.collection('memo').indexInformation(function (err, indexes) {
                if (!indexes.jid_1_name_1) {
                    console.log('creating index for collection memo');
                    db.createCollection('memo', function (err, collection) {
                        if (!err) {
                            collection.createIndex({'jid': 1, 'name': 1}, function () {});
                        }
                    });
                }
            });
        });
    },
    run: function (params, stanza, plugins, client) {
        switch (params[0]) {
            case 'add':
            case 'a':
                if (!params[1] || !params[2]) {
                    return 'Wrong params count\n' + this.help;
                }
                break;
            case 'del':
            case 'd':
                if (!params[1]) {
                    return 'Wrong params count\n' + this.help;
                }
                break;
        }

        var config = require('../config.js');
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            var collection = db.collection('memo');

            var jid = new xmpp.JID(stanza.attrs.to);

            var userJID = jid.user + '@' + jid.domain;
            switch (params[0]) {
                case 'add':
                case 'a':
                    collection.findOne({'jid': userJID, 'name': params[1]}, function (err, item) {
                        if (err) throw err;

                        if (item) {
                            stanza.c('body').t('Note with name "' + params[1] + '" already exists. Delete if first with command \nmemo del ' + params[1]);
                            client.send(stanza);
                            return;
                        }

                        collection.insert({'jid': userJID, 'name': params[1], 'message': params.slice(2).join(' ')}, {w: 1}, function (err, db) {
                            if (err) throw err;

                            stanza.c('body').t('Note "' + params[1] + '" saved');
                            client.send(stanza);
                        });
                    });

                    break;
                case 'del':
                case 'd':
                    collection.findOne({'jid': userJID, 'name': params[1]}, function (err, item) {
                        if (err) throw err;

                        if (!item) {
                            stanza.c('body').t('Note with name "' + params[1] + '" not found. Add it with command\nmemo add ' + params[1] + '<TEXT>');
                            client.send(stanza);
                            return;
                        }
                        collection.remove({'jid': userJID, 'name': params[1]}, function (err, removed) {
                            if (err) throw err;

                            stanza.c('body').t('Note with name "' + params[1] + '" deleted');
                            client.send(stanza);
                        });
                    });
                    break;
                default:
                    if (params[0]) {
                        if (params[1]) {
                            collection.findOne({'jid': userJID, 'name': params[0]}, function (err, item) {
                                if (err) throw err;

                                if (item) {
                                    stanza.c('body').t('Note with name "' + params[0] + '" already exists. Delete if first with command \nmemo del ' + params[0]);
                                    client.send(stanza);
                                    return;
                                }

                                collection.insert({'jid': userJID, 'name': params[0], 'message': params.slice(1).join(' ')}, {w: 1}, function (err, db) {
                                    if (err) throw err;

                                    stanza.c('body').t('Note "' + params[0] + '" saved');
                                    client.send(stanza);
                                });
                            });

                            return;
                        }

                        collection.findOne({'jid': userJID, 'name': params[0]}, function (err, item) {
                            if (err) throw err;

                            if (item) {
                                stanza.c('body').t(item.message);
                            } else {
                                stanza.c('body').t('Note "' + params[0] + '" not found. Add it with command\nmemo add ' + params[0] + ' <TEXT>');
                            }
                            client.send(stanza);
                        });
                    } else {
                        var cursor = collection.find({'jid': userJID});

                        cursor.toArray(function(err, items) {
                            if (err) throw err;

                            var message = '';
                            for (var i in items) {
                                message += items[i].name + '\n';
                            }

                            if (!message) {
                                message = 'You have not notes. Add first by send "memo add <NAME> <TEXT>"';
                            }

                            stanza.c('body').t(message.trim());
                            client.send(stanza);
                        });
                    }
            }
        });

        return null;
    }
};