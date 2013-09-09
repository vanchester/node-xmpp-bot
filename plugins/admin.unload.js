exports.unload = {
    name: 'unload',
    group: 'Administration',
    about: 'Unload plugin',
    help: 'unload <PLUGIN-NAME>',
    enabled: 1,
    max_access: 1,
    run: function(params, stanza, plugins, client) {
        if (!params[0]) {
            return this.help;
        }

        if (typeof plugins[params[0]] == 'undefined') {
            stanza.c('body').t('Plugin \'' + params[0] + '\' not loaded');
        } else {
            delete plugins[params[0]];
            stanza.c('body').t('Plugin \'' + params[0] + '\' unloaded successfully');
        }

        client.send(stanza);
        return null;
    }
};