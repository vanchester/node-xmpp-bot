var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    xmpp = require('node-xmpp'),
    request = require('request'),
    Entities = require('html-entities').XmlEntities,
    entities = new Entities(),
    config = require('../config.js'),
    twitterAPI = require('node-twitter-api'),
    twitter = new twitterAPI({
        consumerKey: config.twitterAPIkey,
        consumerSecret: config.twitterAPIsecret,
        callback: ''
    });

exports.follow = {
    name: 'follow',
    group: 'User tools',
    about: 'Monitor tweets',
    help:
        'follow add <QUERY> - add new query to search\n' +
        'follow list - show all your queries\n' +
        'query del <QUERY> - remove query\n\n' +
        'Query examples:\n' +
        'watching now	containing both "watching" and "now". This is the default operator\n' +
        '"happy hour"	containing the exact phrase "happy hour"\n' +
        'love OR hate		containing either "love" or "hate" (or both)\n' +
        'beer -root 		containing "beer" but not "root"\n' +
        '#haiku		containing the hashtag "haiku"\n' +
        'from:alexiskold	sent from person "alexiskold"\n' +
        'to:techcrunch	sent to person "techcrunch"\n' +
        '@mashable		referencing person "mashable"\n' +
        'movie -scary :)	containing "movie", but not "scary", and with a positive attitude\n' +
        'flight :(		containing "flight" and with a negative attitude\n' +
        'traffic ?		containing "traffic" and asking a question\n' +
        'superhero since:2010-12-27	containing "superhero" and sent since date "2010-12-27" (year-month-day)\n' +
        'ftw until:2010-12-27		containing "ftw" and sent before the date "2010-12-27"\n' +
        'hilarious filter:links		containing "hilarious" and linking to URL\n' +
        'news source:twitterfeed		containing "news" and entered via TwitterFeed\n',
    enabled: 1,
    aliases: ['fl', 'fw'],
    afterLoad: function (client) {
        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort || 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            db.collection('follow').indexInformation(function (err, indexes) {
                if (!indexes.jid_1_query_1) {
                    console.log('creating index for collection follow');
                    db.createCollection('follow', function (err, collection) {
                        if (!err) {
                            collection.createIndex({'jid': 1, 'query': 1}, function () {});
                        }
                    });
                }
            });

            if (typeof followTimer != 'undefined') {
                console.log('reset Follow timer');
                clearInterval(followTimer);
            }

            followTimer = setInterval(function () {
                console.log('reading tweets');
                var collection = db.collection('follow');
                collection.find().toArray(function (err, items) {
                    if (err) {
                        console.log(err);
                    }

                    for (var i in items) {
                        getTweetsAndSend(items[i], collection, client)
                    }
                });
            }, 1000 * 60 * 5);
        });
    },
    run: function (params, stanza, plugins, client) {
        switch (params[0] ? params[0].toLowerCase() : params[0]) {
            case 'add':
            case 'a':
                if (!params[1]) {
                    return 'Wrong params count';
                }
                break;
            case 'del':
            case 'delete':
            case 'd':
            case 'rm':
                if (!params[1]) {
                    return 'Wrong params count';
                }
                break;
            case 'list':
            case 'l':
            case 'ls':
                break;
            default:
                return this.help;
        }

        MongoClient.connect('mongodb://' + config.dbServer + ':' + (config.dbPort || 27017) + '/' + config.dbName, function (err, db) {
            if (err) throw err;

            var collection = db.collection('follow');

            var jid = new xmpp.JID(stanza.attrs.to);

            var userJID = jid.user + '@' + jid.domain;
            var command = params[0].toLowerCase();
            params.shift();
            var query = params.join(' ');
            switch (command) {
                case 'add':
                case 'a':
                    addQuery(collection, userJID, query, stanza, client);
                    break;
                case 'del':
                case 'delete':
                case 'd':
                case 'rm':
                    collection.findOne({'jid': userJID, 'query': query}, function (err, item) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        if (!item) {
                            stanza.c('body').t('Query "' + query + '" not found');
                            client.send(stanza);
                            return;
                        }
                        collection.remove({'jid': userJID, 'query': query}, function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            stanza.c('body').t('Query deleted');
                            client.send(stanza);
                        });
                    });
                    break;
                case 'list':
                case 'l':
                case 'ls':
                    collection.find({'jid': userJID}).toArray(function (err, items) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        var message = '';
                        for (var i in items) {
                            message += items[i].query + '\n';
                        }

                        if (!message) {
                            message = 'You have not saved queries. Add first with coomand:\nfollow add <QUERY>';
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

function getTweetsAndSend(followData, collection, client)
{
    if (!followData.query) {
        return;
    }

    try {
        twitter.search(
            {q: followData.query},
            config.twitterAccessToken,
            config.twitterAccessTokenSecret,
            function (error, tweets) {
                if (error) {
                    console.log(error);
                    return;
                }

                (function (tweets, followData, collection) {
                    for (var i in tweets.statuses) {
                        (function (tweet) {
                            var id = tweet.id;

                            collection.findOne({'jid': followData.jid, 'query': followData.query, 'sent_tweets': id}, function (err, item) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                if (item) {
                                    return;
                                }

                                var stanza = new xmpp.Element(
                                    'message',
                                    {to: followData.jid, type: 'chat'}
                                );
                                var text = entities.decode(tweet.text);
                                stanza.c('body').t([text, tweet.user.name + ' @' + tweet.user.screen_name].join('\n'));
                                client.send(stanza);

                                collection.update({'jid': followData.jid, 'query': followData.query}, {'$push': {'sent_tweets': id}}, function () {});
                            });
                        })(tweets.statuses[i]);
                    }
                })(tweets, followData, collection);
            }
        );
    } catch (e) {
        console.log(e);
    }
}

function addQuery(collection, jid, query, stanza, client)
{
    collection.findOne({'jid': jid, 'query': query}, function (err, item) {
        if (err) {
            console.log(err);
            return;
        }

        if (item) {
            stanza.c('body').t('Query "' + query + '" already added');
            client.send(stanza);
            return;
        }

        twitter.search(
            {q: query},
            config.twitterAccessToken,
            config.twitterAccessTokenSecret,
            function (error, data) {
                if (error) {
                    stanza.c('body').t('Error in query. Fix it and try to add again');
                    client.send(stanza);
                    return;
                }

                var oldItems = [];
                for (var i in data.statuses) {
                    oldItems.push(data.statuses[i].id);
                }

                var data = {
                    'jid': jid,
                    'query': query,
                    'added': new Date(),
                    'sent_tweets': oldItems
                };

                collection.insert(data, {w: 1}, function (err, db) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    stanza.c('body').t('Query added');
                    client.send(stanza);
                });
            }
        );
    });
}
