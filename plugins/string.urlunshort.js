var http = require('http'),
    host = "api.unshort.me",
    path = "/?format=json&r=";

exports.unshort = {
    name: 'unshort',
    group: 'String operations',
    about: 'Unshort any URL created using URL shortening services',
    help: 'unshort <SHORT-URL>',
    enabled: 1,
    run: function(params, stanza, plugins, client) {
        if (!params[0]) {
            return this.help;
        }

        var options = {
            host: host,
            path: path + params[0]
        };

        var callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var message = '';

                try {
                    var url = JSON.parse(str);
                    message = url.resolvedURL || 'Can not unshort this URL';
                } catch (e) {
                    console.log(options);
                    console.log(e);
                    message = "There is an error. Try again later";
                }

                stanza.c('body').t(message);
                client.send(stanza);
            });
        };

        http.request(options, callback).end();

        return null;
    }
};