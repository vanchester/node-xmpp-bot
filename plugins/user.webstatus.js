var xmpp = require('node-xmpp'),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    fileServer = require('node-static'),
    config = require('../config.js'),
    http = require('http'),
    url = require('url'),
    fs = require('fs');

config.statusPluginUrl = config.statusPluginUrl.replace(/^\/+|\/+$/g, '');

exports.webstatus = {
    name: 'webstatus',
    group: 'User tools',
    about: 'JID\'s status for web',
    help: 'webstatus 1 - enable web status for your JID\nwebstatus 0 - disable web status for your JID',
    enabled: 1,
    aliases: ['web-status'],
    timer: null,
    afterLoad: function (client) {

        try {
            createIndexIfNotExists();

            client.on('stanza', function (stanzaOrig) {
                if (stanzaOrig.is('presence')) {
                    updateJidStatus(stanzaOrig);
                }
            });

            startWebServer();

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
                db.collection('jid_status').update(
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

            db.collection('jid_status').update(
                {'jid': userJID},
                {'$set': {'show': 1}},
                {'upsert': true},
                function () {
                    var templates = fs.readdirSync(__dirname + '/webstatus/');
                    var message =  'Web status enabled for your JID\n\n' +
                        config.statusPluginUrl + '/' + userJID + ' - as html code\n' +
                        config.statusPluginUrl + '/' + userJID + '/image - as image\n' +
                        config.statusPluginUrl + '/' + userJID + '/script - as JavaScript code\n' +
                        config.statusPluginUrl + '/' + userJID + '/json - as JSON-code\n' +
                        config.statusPluginUrl + '/' + userJID + '/json?callback=yourfunction - as JSON-code with callback\n' +
                        config.statusPluginUrl + '/' + userJID + '/xml\n\n' +
                        'You can add template name of icons to end of url, for example:\n' +
                        config.statusPluginUrl + '/' + userJID + '/icq\n' +
                        'Supported templates are: ' + templates.join(', ') + '\n\n' +
                        'Don\'t forget add authorize bot\'s JID';

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

        db.collection('status').indexInformation(function (err, indexes) {
            if (!indexes.jid_1_status_1) {
                console.log('creating index for collection status');
                db.createCollection('status', function (err, collection) {
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

function updateJidStatus(stanza)
{
    var jid = new xmpp.JID(stanza.attrs.from);
    var userJID = jid.user + '@' + jid.domain;
    if (stanza.attrs.type == 'unavailable') {
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection('jid_status').update(
                {'jid': userJID},
                {'$set': {'status': 'offline'}},
                {'upsert': true},
                function () {}
            );
        });
    } else if (typeof stanza.attrs.type == 'undefined') {
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection('jid_status').update(
                {'jid': userJID},
                {'$set': {'status': stanza.getChildText('show') || 'online'}},
                {'upsert': true},
                function () {}
            );
        });
    }
}

function startWebServer()
{
    if (typeof statusPluginServer != 'undefined') {
        console.log('Close web-server for status plugin');
        statusPluginServer.close();
    }

    console.log('Start web-server for status plugin');
    statusPluginServer = http.createServer(function(request, response) {
        var urlData = url.parse(request.url);
        var pathname = urlData.pathname;
        if (pathname == '/favicon.ico') {
            response.end();
            return;
        }

        var params = pathname.split('/');
        var userJID = getJid(params[1]);
        if (!userJID) {
            response.writeHead(400);
            response.write("");
            response.end();
            return;
        }

        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort | 27017) + '/' + config.dbName, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            db.collection('jid_status').findOne({'jid': userJID, 'show': 1}, function (err, item) {
                if (err) {
                    console.log(err);
                    response.end();
                    return;
                }

                var userStatus = (item && item.status) ? item.status : 'noauth';
                switch (params[2]) {
                    case 'image':
                        try {
                            var fileName = __dirname + '/webstatus/' + (params[3] || 'default');
                            if (fs.existsSync(fileName)) {
                                var file = new fileServer.Server(fileName);
                                file.serveFile(userStatus + '.png', 200, {}, request, response);
                            } else {
                                response.writeHead(404);
                                response.end();
                            }
                        } catch (e) {
                            response.writeHead(404);
                            response.end();
                        }
                        return;
                    case 'script':
                        response.writeHead(200, {"Content-Type": "application/x-javascript"});
                        response.write('document.write(\'<img src="' + config.statusPluginUrl + '/' + userJID + '/image alt="' + userStatus + '" title="' + userStatus +'" align="absmiddle" width="16" height="16" />\');');
                        response.end();
                        break;
                    case 'json':
                        response.writeHead(200, {"Content-Type": "application/json"});
                        var callbackName = '';
                        if (urlData.query) {
                            callbackName = urlData.query.split('=').reverse().shift();
                            response.write(callbackName + '({"status":"' + userStatus + '","jid":"' + userJID + '"});');
                        } else {
                            response.write('{"status":"' + userStatus + '","jid":"' + userJID + '"}');
                        }
                        response.end();
                        break;
                    case 'xml':
                        response.writeHead(200, {"Content-Type": "text/xml"});
                        response.write('<webstatus>\n' +
                            '<jid>' + userJID + '</jid>\n' +
                            '<status>' + userStatus + '</status>\n' +
                            '</webstatus>');
                        response.end();
                        break;
                    default:
                        response.writeHead(200, {"Content-Type": "text/html"});
                        response.write('<img src="' + config.statusPluginUrl + '/' + userJID + '/image/' + (params[2] || '') + '" title="' + userStatus + '" alt="' + userStatus + '" align="absmiddle" width="16" height="16" >');
                        response.end();
                }
            });
        });
    }).listen(config.statusPluginPort || 8282);
}
