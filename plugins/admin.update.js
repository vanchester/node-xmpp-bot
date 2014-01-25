var exec = require('child_process').exec;

exports.update = {
    name: 'update',
    group: 'Administration',
    about: 'Update bot code from repository',
    help: 'update',
    enabled: 1,
    max_access: 1,
    run: function(params, stanza, plugins, client) {
        exec('git pull && npm install', function (error, stdout, stderr) {
            var message = error ? sdterr : stdout;

            stanza.c('body').t(message);
            client.send(stanza);
        });
        return null;
    }
};
