var xmpp = require('node-xmpp'),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    config = require('../config.js'),
    http = require('http'),
    url = require('url'),
    fs = require('fs');

config.webmessagePluginUrl = config.webmessagePluginUrl.replace(/^\/+|\/+$/g, '');

exports.webmessage = {
    name: 'webmessage',
    group: 'User tools',
    about: 'Message via web request',
    help: 'webmessage 1 - enable web messages for your JID\nwebmessage 0 - disable web messages for your JID\n',
    enabled: 1,
    aliases: ['web-message', 'webmsg', 'web-msg'],
    timer: null,
    afterLoad: function (client) {
        try {
            createIndexIfNotExists();
            startWebServer(client);
        } catch (e) {
            console.log(e);
        }
    },
    run: function (params, stanza, plugins, client) {
        if (typeof params[0] != 'string' || params[0] < 0 || params[0] > 1) {
            return this.help;
        }

        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            var jid = new xmpp.JID(stanza.attrs.to);
            var userJID = jid.user + '@' + jid.domain;

            if (params[0] != 1) {
                if (err) {
                    console.log(err);
                    return;
                }
                db.collection('webmessages').update(
                    {'jid': userJID},
                    {'$set': {'show': 0}},
                    {'upsert': true},
                    function () {
                        stanza.c('body').t('Web status disabled for your JID');
                        client.send(stanza);
                    }
                );
                return;
            }

            db.collection('webmessages').update(
                {'jid': userJID},
                {'$set': {'show': 1}},
                {'upsert': true},
                function () {
                    var message =  'Web messages enabled for your JID\n\n' +
                        'Send GET or POST request to URL ' + config.webmessagePluginUrl + ' ' +
                        'with params:\n' +
                        'to=' + userJID + '\n' +
                        'message=text_of_message\n';

                    stanza.c('body').t(message);
                    client.send(stanza);
                }
            );

        });

        return null;
    }
};

function createIndexIfNotExists()
{
    MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
        if (err) throw err;

        db.collection('webmessages').indexInformation(function (err, indexes) {
            if (!indexes.jid_1_status_1) {
                console.log('creating index for collection webmessages');
                db.createCollection('webmessages', function (err, collection) {
                    if (!err) {
                        collection.createIndex({'jid': 1, 'status': 1}, {'unique': true}, function () {});
                    }
                });
            }
        });
    });
}

function getJid(jid)
{
    if (typeof jid == 'undefined' || jid == "") {
        return false;
    }

    try {
        jid = new xmpp.JID(jid);
        return jid.user + '@' + jid.domain;
    } catch (e) {
        return false;
    }
}

function startWebServer(client)
{
    if (typeof webmessagePluginServer != 'undefined') {
        console.log('Close web-server for webmessage plugin');
        webmessagePluginServer.close();
    }

    console.log('Start web-server for webmessage plugin');
    webmessagePluginServer = http.createServer(function(request, response) {
        qs = require('querystring');
        var remoteIP = request.connection.remoteAddress;
        if (request.method == 'POST') {
            var body = '';
            request.on('data', function(data) {
                body += data;
                // Too much POST data, kill the connection!
                if (body.length > 1e6) {
                    request.connection.destroy();
                }
            });
            request.on('end', function() {
                var params = qs.parse(body);
                if (params && !params.to && body.length) {
                    urlData = url.parse(request.url);
                    var getParams = qs.parse(urlData.query);
                    if (getParams && getParams.to) {
                        params = {
                            to: getParams.to,
                            message: body
                        }
                    }
                }
                sendWebMessageToJid(client, params, remoteIP);
            });
        } else {
            var urlData = url.parse(request.url);
            var params = qs.parse(urlData.query);
            sendWebMessageToJid(client, params, remoteIP);
        }

        response.end();

    }).listen(config.webmessagePluginPort || 8283);
}

function sendWebMessageToJid(client, params, remoteIP)
{
    MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        if (!params.to || !params.message) {
            console.log('Wrong params');
            return;
        }
        db.collection('webmessages').findOne({'jid': params.to, 'show': 1}, function (err, item) {
            if (err) {
                console.log(err);
                response.end();
                return;
            }

            if (!item || item.show != 1) {
                console.log('Messages disabled for JID ' + params.to);
                return;
            }
            var stanza = new xmpp.Element(
                'message',
                { to: params.to, type: 'chat' }
            );
            stanza.c('body').t('Web message from ' + remoteIP + ' via ' + config.webmessagePluginUrl + '\n' + params.message);
            client.send(stanza);
        });
    });
}
