var config = require ('./config.js'),
    xmpp = require('node-xmpp'),
    fs = require('fs'),
    cl = new xmpp.Client({jid: config.jid, password: config.password});

var plugins = {};
fs.readdirSync("./plugins").forEach(function(file) {
    var p = require("./plugins/" + file);
    for (var name in p) {
        if (p[name].enabled != 1) {
            continue;
        }

        plugins[name.toLowerCase()] = p[name];

        if (typeof p[name].afterLoad == 'function') {
            p[name].afterLoad();
        }

        if (p[name].aliases) {
            for (var i in p[name].aliases) {
                plugins[p[name].aliases[i].toLowerCase()] = p[name];
            }
        }
    }
});

addNumberAliases(plugins);

cl.on('online', function() {
    console.log("Connected successfully");
    cl.send(new xmpp.Element('presence', {}).
        c('show').t('online').up().
        c('status').t('Happily echoing your <message/> stanzas')
    );
});

cl.on('stanza', function(stanza) {
    if (stanza.is('message') && stanza.attrs.type !== 'error') { // Important: never reply to errors!

        var message = stanza.getChildText('body');
        if (!message) {
            return;
        }
        console.log('Message from ' + stanza.attrs.from + ': ' + message);

        var params = message.split(' ');
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
            // check for admin commands
            if (typeof plugins['unknown'] == 'object') {
                console.log('Unknown command');
                command = 'unknown';
            } else {
                console.log('can not process this message');
                return;
            }
        }

        if (typeof plugins[command].run != 'function') {
            console.log('Bad format of plugin ' + command);
            return;
        }

        // Swap addresses...
        stanza.attrs.to = stanza.attrs.from;
        delete stanza.attrs.from;
        stanza.remove('body');

        var body = null;
        try {
            body = plugins[command].run(params, stanza, plugins, cl);
        } catch (e) {
            console.log(e);
            body = 'There is an error. Try again later';
        }

        if (body) {
            stanza.c('body').t(body);

            // and send back.
            cl.send(stanza);
        }
    }
});

cl.on('error', function(e) {
    console.error(e);
});

function addNumberAliases(plugins)
{
    var groups = getGroups(plugins);
    var commandAliasNumber;
    var groupAliasNumber = 0;
    for (var n in groups) {
        groupAliasNumber += 100;
        commandAliasNumber = groupAliasNumber;
        var group = groups[n];
        for (var i in plugins) {
            if (plugins[i].group == group && i == plugins[i].name) {
                plugins[++commandAliasNumber] = plugins[i];
            }
        }
    }

    // plugins without group
    groupAliasNumber += 100;
    commandAliasNumber = groupAliasNumber;
    for (var i in plugins) {
        if (!plugins[i].group && plugins[i].name == i) {
            plugins[++commandAliasNumber] = plugins[i];
        }
    }
}

function getGroups(plugins, isAdmin)
{
    var groups = [];
    for (var name in plugins) {
        var group = plugins[name].group;
        if (!group || plugins[name].name != name || (plugins[name].max_access && !isAdmin)) {
            continue;
        }

        if (groups.indexOf(group) == -1) {
            groups.push(group);
        }
    }

    return groups;
}