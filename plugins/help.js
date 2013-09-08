exports.help = {
    about: '',
    help: '',
    enabled: 1,
    run: function (params, to, plugins) {
        var answer = '';
        if (!params.length) {
            for (var name in plugins) {
                if (plugins[name].about) {
                    answer += name + ' ' + plugins[name].about + '\n';
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