var spawn = require('child_process').spawn;

exports.ping = {
    name: 'ping',
    about: 'Ping host or IP',
    help: 'ping <HOST-OR-IP>',
    enabled: 1,
    run: function(params, stanza, plugins, client) {
        if (params[0]) {
            var stdout = '';

            var cp = spawn('ping', ['-n', '-W 1', '-c 4', params[0]]);

            cp.stdout.on('data', function (data) {
                stdout += data;
            });

            cp.on('exit', function (code) {
                stanza.c('body').t(stdout);
                client.send(stanza);
            });

            return null;
        }

        return this.help;
    }
};