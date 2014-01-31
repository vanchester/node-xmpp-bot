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

        var answer = '\nList of available commands:\n';
        if (!params.length) {
            var groups = plugins.getGroups(isAdmin);
            var maxCommandLength = getMaxCommandLength(plugins, isAdmin) + 3;

            for (var i in groups) {
                var commands = '';
                for (var name in plugins) {
                    if (plugins[name].group != groups[i] || (plugins[name].max_access && !isAdmin) || !plugins[name].about) {
                        continue;
                    }

                    if (plugins[name].name != name) {
                        continue;
                    }

                    var command = ' ' + (plugins[name].numberAlias ? plugins[name].numberAlias + ' ' : '');
                    command += padRight('[' + name + ']', maxCommandLength);

                    var aliases = plugins[name].aliases ? plugins[name].aliases.join(', ') : '';
                    commands += command + ' - ' + plugins[name].about + (aliases ? ' (aliases: ' + aliases + ')\n' : '\n');
                }
                if (commands) {
                    answer += '\n' + groups[i] + ':\n' + commands;
                }
            }

            answer += '\n';

            // show commands without group
            for (var name in plugins) {
                if (plugins[name].group || (plugins[name].max_access && !isAdmin) || !plugins[name].about)
                {
                    continue;
                }

                if (plugins[name].name != name) {
                    continue;
                }

                var command = ' ' + (plugins[name].numberAlias ? ' ' + plugins[name].numberAlias + ' ' : '');
                command += padRight('[' + name + ']', maxCommandLength);

                var aliases = plugins[name].aliases.join(', ');
                answer += command + ' - ' + plugins[name].about + (aliases ? ' (aliases: ' + aliases + ')\n' : '\n');
            }

        } else {
            if (typeof plugins[params[0]] == 'undefined') {
                answer = 'Command ' + params[0] + ' not found';
            } else {
                answer = plugins[params[0]].help ? plugins[params[0]].help : plugins[params[0]].about;
            }
        }

        return answer ? answer + 'Type "help command" for more information about command' : 'There are no loaded plugins';
    }
};

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
