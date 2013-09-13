exports.help = {
    name: 'help',
    about: '',
    help: '',
    enabled: 1,
    aliases: ['?'],
    run: function (params, stanza, plugins) {
        var config = require('../config.js');
        var xmpp = require('node-xmpp');

        var isAdmin = false;
        var jid = new xmpp.JID(stanza.attrs.to);

        if (config.adminJID && config.adminJID.indexOf(jid.user + '@' + jid.domain) != -1) {
            isAdmin = true;
        }

        // @todo fix when user settings will be ready
        var showNumbers = false;
        if (params[0] == 'num') {
            showNumbers = true;
            params.shift();
        }

        var answer = '\nList of available commands:\n';
        if (!params.length) {
            var groups = getGroups(plugins, isAdmin);
            var maxCommandLength = !showNumbers ? getMaxCommandLength(plugins, isAdmin) : 0;

            for (var i in groups) {
                answer += '\n' + groups[i] + ':\n';

                for (var name in plugins) {
                    if (plugins[name].group != groups[i] || (plugins[name].max_access && !isAdmin) || !plugins[name].about) {
                        continue;
                    }

                    if (showNumbers) {
                        if (!/^[\d]+$/.test(name)) {
                            continue;
                        }
                    } else {
                        if (plugins[name].name != name) {
                            continue;
                        }
                    }

                    var command = ' ' + padRight('[' + name + ']', maxCommandLength);
                    var aliases = plugins[name].aliases || [];
                    answer += command + ' - ' + plugins[name].about + (aliases.length ? ' (aliases: ' + aliases.join(', ') + ')\n' : '\n');
                }
            }

            answer += '\n';
            // show commands without group
            for (var name in plugins) {
                if (plugins[name].group || (plugins[name].max_access && !isAdmin) || !plugins[name].about)
                {
                    continue;
                }

                if (showNumbers) {
                    if (!/^[\d]+$/.test(name)) {
                        continue;
                    }
                } else {
                    if (plugins[name].name != name) {
                        continue;
                    }
                }

                var command = padRight('[' + name + ']', maxCommandLength);
                answer += command + ' - ' + plugins[name].about + '\n';
            }

        } else {
            if (typeof plugins[params[0]] == 'undefined') {
                answer = 'Command ' + params[0] + ' not found';
            } else {
                answer = plugins[params[0]].help ? plugins[params[0]].help : plugins[params[0]].about;
            }
        }

        return answer ? answer : 'There are no loaded plugins';
    }
};

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

function getMaxCommandLength(plugins, isAdmin)
{
    var len = 0;
    for (var name in plugins) {
        var group = plugins[name].group;
        if (group == '' || plugins[name].name != name || (plugins[name].max_access && !isAdmin)) {
            continue;
        }

        if (name.length > len) {
            len = name.length;
        }
    }

    return len;
}

function padRight(line, len, symbol)
{
    symbol = symbol || ' ';
    while (line.length < len) {
        line += symbol;
    }

    return line;
}