exports.help = {
    name: 'help',
    about: '',
    help: '',
    enabled: 1,
    aliases: ['?'],
    run: function (params, stanza, plugins) {
        var answer = '\nList of available commands:\n';
        if (!params.length) {
            for (var name in plugins) {
                if (plugins[name].name != name || plugins[name].max_access) {
                    continue;
                }

                if (plugins[name].about) {
                    answer += '\n[' + name + '] - ' + plugins[name].about;
                }
            }
        } else {
            if (typeof plugins[params[0]] == 'undefined') {
                answer = 'Command ' + params[0] + ' not found';
            } else {
                answer = plugins[params[0]].help ? plugins[params[0]].help : plugins[params[0]].about;
            }
        }

        return answer ? answer : 'There is no loaded plugins';
    }
};