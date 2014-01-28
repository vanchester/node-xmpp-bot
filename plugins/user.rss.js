var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    xmpp = require('node-xmpp'),
    request = require('request'),
    Url = require('url'),
    FeedParser = require('feedparser');

exports.rss = {
    name: 'rss',
    group: 'User tools',
    about: 'Monitor RSS feed',
    help: 'rss add <URL> [SHORT_DESCRIPTION] - add new feed to scanner\nrss list - show all your feeds\nrss del <URL> - remove feed from scanner',
    enabled: 1,
    aliases: [],
    timer: null,
    afterLoad: function (client) {
        var config = require('../config.js');
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort || 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            db.collection('rss').indexInformation(function (err, indexes) {
                if (!indexes.jid_1_url_1) {
                    console.log('creating index for collection rss');
                    db.createCollection('rss', function (err, collection) {
                        if (!err) {
                            collection.createIndex({'jid': 1, 'url': 1}, function () {});
                        }
                    });
                }
            });

            if (typeof RSStimer != 'undefined') {
                console.log('reset RSS timer');
                clearInterval(RSStimer);
            }

            RSStimer = setInterval(function () {
                console.log('read RSS');
                var collection = db.collection('rss');
                collection.find().toArray(function (err, feeds) {
                    if (err) throw err;

                    for (var i in feeds) {
                        getFeedAndSendArticles(feeds[i], collection, client)
                    }
                });
            }, 1000 * 60 * 5);
        });
    },
    run: function (params, stanza, plugins, client) {
        switch (params[0]) {
            case 'add':
            case 'a':
                if (!params[1]) {
                    return 'Wrong params count\n' + this.help;
                }
                var url = Url.parse(params[1]);
                if (!url.host) {
                    return 'Wrong url';
                }
                break;
            case 'del':
            case 'delete':
            case 'd':
                if (!params[1]) {
                    return 'Wrong params count\n' + this.help;
                }
                break;
            case 'list':
            case 'l':
                break;
            default:
                return this.help;
        }

        var config = require('../config.js');
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort || 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            var collection = db.collection('rss');

            var jid = new xmpp.JID(stanza.attrs.to);

            var userJID = jid.user + '@' + jid.domain;
            switch (params[0]) {
                case 'add':
                case 'a':
                    addFeed(collection, userJID, params, stanza, client);
                    break;
                case 'del':
                case 'delete':
                case 'd':
                    collection.findOne({'jid': userJID, 'url': params[1]}, function (err, item) {
                        if (err) throw err;

                        if (!item) {
                            stanza.c('body').t('Feed with URL "' + params[1] + '" not found');
                            client.send(stanza);
                            return;
                        }
                        collection.remove({'jid': userJID, 'url': params[1]}, function (err, removed) {
                            if (err) throw err;

                            stanza.c('body').t('Feed deleted');
                            client.send(stanza);
                        });
                    });
                    break;
                case 'list':
                case 'l':
                    collection.find({'jid': userJID}).toArray(function (err, items) {
                        if (err) throw err;

                        var message = '';
                        for (var i in items) {
                            message += items[i].url + ' ' + items[i].name + '\n';
                        }

                        if (!message) {
                            message = 'You have not saved feeds. Add first with coomand:\nrss add <URL> [SHORT_DESCRIPTION]';
                        }

                        stanza.c('body').t(message);
                        client.send(stanza);
                    });
                    break;
            }
        });

        return null;
    }
};

function getFeedAndSendArticles(feedData, collection, client)
{
    request(feedData.url).pipe(new FeedParser())
        .on('readable', function() {
            var stream = this,
                item;
            while (item = stream.read()) {
                (function (item, feedData) {
                    collection.findOne({'jid': feedData.jid, 'url': feedData.url, 'sent_articles': item.guid}, function (err, dbItem) {
                        if (err) throw err;

                        // if this news already sent, return
                        if (dbItem) {
                            return;
                        }

                        var stanza = new xmpp.Element(
                            'message',
                            { to: feedData.jid, type: 'chat' }
                        );
                        var descr = item.description.replace(/\<br[^\>]*\>/g, '\n').replace(/\<[^\>]+\>/g, '');
                        stanza.c('body').t([item.pubDate, item.title, descr, item.author, item.link].join('\n'));
                        client.send(stanza);

                        collection.update({'jid': feedData.jid, 'url': feedData.url}, {'$push': {'sent_articles': item.guid}}, function () {});
                    });
                })(item, feedData);
            }
        });
}

function addFeed(collection, jid, params, stanza, client)
{
    collection.findOne({'jid': jid, 'url': params[1]}, function (err, item) {
        if (err) throw err;

        if (item) {
            stanza.c('body').t('Rss with url "' + params[1] + '" already added');
            client.send(stanza);
            return;
        }

        request(params[1]).pipe(new FeedParser())
            .on('error', function(error) {
                collection.remove({'jid': jid, 'url': params[1]}, function () {});
                stanza.c('body').t(error);
                client.send(stanza);
            })
            .on('meta', function () {
                var data = {
                    'jid': jid,
                    'url': params[1],
                    'name': params.slice(2).join(' '),
                    'added': new Date(),
                    'sent_articles': []
                };
                collection.insert(data, {w: 1}, function (err, db) {
                    if (err) throw err;

                    stanza.c('body').t('Feed added');
                    client.send(stanza);
                });
            })
            .on('readable', function () {
                var stream = this, item;
                while (item = stream.read()) {
                    collection.update({'jid': jid, 'url': params[1]}, {'$push': {'sent_articles': item.guid}}, function () {});
                }
            });
    });
}
