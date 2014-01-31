var mongoSync = require('mongo-sync'),
    Server = mongoSync.Server,
    config = require('../config.js'),
    xmpp = require('node-xmpp'),
    Fiber = require('fibers');

process.env.TODO_SH = 'todo';
process.env.TODO_DIR = '';
process.env.TODO_FILE = '/todo';
process.env.DONE_FILE = '/done';
process.env.REPORT_FILE = '/report';

exports.todo = {
    name: 'todo',
    group: 'User tools',
    about: 'Manage your TODOs (compatible with todo.txt-cli format)',
    help: 'todo [-fhpantvV] [-d todo_config] action [task_number] [task_description]\nTry "todo -h" for more information.',
    enabled: 1,
    aliases: ['t'],
    afterLoad: function () {
        Fiber(function () {
            var mongoServer = new Server(config.dbServer + ':' + (config.dbPort || '27017'));
            var dbTodo = mongoServer.db(config.dbName);
            var collection = dbTodo.getCollection('todo');
            var indexes = collection.getIndexes();
            var exists = false;
            for (i in indexes) {
                if (indexes[i].name == 'jid_1_file_1') {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                console.log('Creating indexes for collection todo');
                collection.ensureIndex({'jid': 1, 'file': 1}, {'unique': true});
            }
        }).run();
    },
    run: function (params, stanzaOrig, plugins, client) {
        Fiber(function () {
            var db, filesystem, fs, go, requirejs, root, system, todo, ui, mongoServer, dbTodo;

            root = typeof exports !== "undefined" && exports !== null ? exports : this;

            go = require('../node_modules/todo.txt-node/lib/getopt.js');

            requirejs = require('../node_modules/todo.txt-node/lib/r.js');

            requirejs.config({
                baseUrl: __dirname
            });

            todo = requirejs('../node_modules/todo.txt-node/lib/todo');

            mongoServer = new Server(config.dbServer + ':' + (config.dbPort || '27017'));
            dbTodo = mongoServer.db(config.dbName);

            system = {
                db: function(msg, tag) {
                    var tagRe, _i, _len, _ref, _ref1;
                    if (tag == null) {
                        return console.log(msg);
                    }
                    _ref1 = (_ref = db.tags) != null ? _ref : [];
                    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        tagRe = _ref1[_i];
                        if (tagRe.test(tag)) {
                            return console.log(msg);
                        }
                    }
                    return null;
                },
                exit: function(code) {
                    return null;
                }
            };

            system.db.tags = [/tag/];

            sendMessage = function (message) {
                if (!message) {
                    return;
                }

                var exp = new RegExp(/^:([^:]+):;([^\n]*);/);
                var stanza = stanzaOrig.clone();
                if (exp.test(message)) {
                    var messageHtml = message.replace(exp, '<span style="color:$1">$2</span>');
                    stanza
                        .c('body').t(message)
                        .up()
                        .c('html', {xmlns: 'http://jabber.org/protocol/xhtml-im'})
                        .c('body', {xmlns: 'http://www.w3.org/1999/xhtml'})
                        .t(messageHtml);
                    client.sendUnsafe(stanza);
                } else {
                    stanza.c('body').t(message);
                    client.send(stanza);
                }
            };

            ui = {
                echo: sendMessage,
                ask: function() {
                    return 'y';
                }
            };

            db = system.db;
            db('tag', 'TEST DB');

            var jid = new xmpp.JID(stanzaOrig.attrs.to);
            var userJID = jid.user + '@' + jid.domain;
            filesystem = {
                _convertCygPath: function(filePath) {
                    return filePath ? filePath.replace(/^\/cygdrive\/(.)/, '$1:') : filePath;
                },
                lastFilePath: '',
                load: function(filePath) {
                    var e, result;
                    result = null;
                    filePath = this._convertCygPath(filePath);
                    if (/\.cfg/.test(filePath) || /config/.test(filePath)) {
                        result = config.todoColors;
                    } else {
                        try {
                            var data = dbTodo.getCollection('todo').findOne({'jid': userJID, 'file': filePath});
                            result = data ? data.content : '';
                        } catch (_error) {
                            e = _error;
                            return null;
                        }
                    }
                    this.lastFilePath = filePath;
                    return result;
                },
                save: function(filePath, content) {
                    var e;
                    filePath = this._convertCygPath(filePath);
                    try {
                        dbTodo.getCollection('todo').update(
                            {'jid': userJID, 'file': filePath},
                            {'$set': {'content': content}},
                            {'upsert': true}
                        );
                    } catch (_error) {
                        e = _error;
                        return;
                    }
                    return true;
                },
                append: function(filePath, appendContent) {
                    var content;
                    filePath = this._convertCygPath(filePath);
                    content = this.load(filePath);
                    if (content != null) {
                        content += appendContent + '\n';
                        if (this.save(filePath, content)) {
                            return content;
                        }
                    }
                }
            };

            root.run = function() {
                var e, env;
                env = {};
                for (e in process.env) {
                    env[e] = process.env[e];
                }
                if (env.HOME == null) {
                    env.HOME = env.USERPROFILE;
                }
                if (env.PWD == null) {
                    env.PWD = process.cwd();
                }
                todo.init(env, filesystem, ui, system);
                try {
                    todo.run(params);
                } catch (e) {console.log(e)}
            };

            root.run();
        }).run();
    }
};
