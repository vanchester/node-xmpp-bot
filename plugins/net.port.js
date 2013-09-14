var net = require('net');

exports.port = {
    name: 'port',
    group: 'Net',
    about: 'Check port for open state',
    help: 'port <IP-OR-DOMAIN> <PORT>',
    enabled: 1,
    aliases: ['checkport'],
    run: function(params, stanza, plugins, client) {
        var colonPos = params[0] ? params[0].indexOf(':') : -1;
        if (!params[0] || (colonPos == -1 && !params[1])) {
            return this.help;
        }

        if (colonPos != -1) {
            params[1] = params[0].substr(colonPos + 1);
            params[0] = params[0].substr(0, colonPos);
        }

        var sock = new net.Socket();
        sock.setTimeout(1000);
        sock
            .on('connect', function() {
                stanza.c('body').t(params[0] + ':' + params[1] + ' is up');
                client.send(stanza);
                sock.destroy();
            })
            .on('error', function(e) {
                stanza.c('body').t(params[0] + ':' + params[1] + ' is down');
                client.send(stanza);
                sock.destroy();
            })
            .on('timeout', function(e) {
                stanza.c('body').t(params[0] + ':' + params[1] + ' is down (timeout)');
                client.send(stanza);
                sock.destroy();
            })
            .connect(params[1], params[0]);

        return null;
    }
};