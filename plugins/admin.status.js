var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    xmpp = require('node-xmpp'),
    config = require('../config.js');

exports.status = {
    name: 'status',
    group: 'Administration',
    about: 'Change bot status and set status message',
    help: 'status <ONLINE|CHAT|AWAY|DND> [<MESSAGE>], for example:\nstatus chat I want to chat with you!',
    enabled: 1,
    max_access: 1,
    afterLoad: function (client) {
        var config = require('../config.js');
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;
            db.collection('status').findOne({}, function (err, item) {
                if (err) {
                    return;
                }

                if (item) {
                    client.on('online', function () {
                        setStatus(client, item.status, item.message);
                    });
                }
            })
        });
    },
    run: function(params, stanza, plugins, client) {
        var availableStatuses = ['online', 'chat', 'away', 'dnd'];
        if (!params[0] || availableStatuses.indexOf(params[0].toLowerCase()) == -1) {
            return this.help;
        }

        var status = params.shift().toLowerCase();
        var message = params.join(' ');
        setStatus(client, status, message);

        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            db.collection('status').remove({}, function (err) {
                if (err) throw err;

                db.collection('status').insert({'status': status, 'message': message}, {w: 1}, function (err) {
                    if (err) throw err;
                });
            });
        });
        return 'Status changed successfully';
    }
};

function setStatus(client, status, message)
{
    var answer = new xmpp.Presence({}).c('show').t(status);
    if (message) {
        answer.up().c('status').t(message);
    }
    client.send(answer);
}