var request = require('request'),
    querystring = require('querystring'),
    util = require('util');

exports.translate = {
    name: 'translate',
    group: 'String operations',
    about: 'Translate string between Russian and Enlish',
    help: 'translate <STRING>',
    enabled: 1,
    aliases: ['tr'],
    run: function(params, stanza, plugins, client) {
        if (!params[0]) {
            return this.help;
        }

        str = params.join(' ');
        var onlyEn = 'En: ' + str.replace(/[^A-Za-z]/g, '');
        var onlyRu = 'Ru: ' + str.replace(/[^А-Яа-я]/g, '');
        opts = {
            sl: onlyEn.length > onlyRu.length ? 'en' : 'ru',
            tl: onlyEn.length > onlyRu.length ? 'ru' : 'en',
            hl: onlyEn.length > onlyRu.length ? 'en' : 'ru',
            client: 't',
            sc: 2,
            ie: 'UTF-8',
            oe: 'UTF-8',
            trs: 1,
            inputm: 1,
            prev: 'btn',
            ssel: 0,
            q: str
        };

        var url = 'http://translate.google.ru/translate_a/t?' + querystring.stringify(opts);
        request.get(url, function(err, response, body){
            var message = '';
            if (err) {
                message = err;
            } else {
                var result = body.substr(0, body.indexOf(']]') + 2).replace(/[\[]{3,}/g, '[[');

                try {
                    var json = JSON.parse(result);

                    if (json[0]) {
                        for (var i in json) {
                            if (json[i][0]) {
                                message += json[i][0];
                            }
                        }
                    } else {
                        message = 'Error';
                    }
                } catch (e) {
                    message = 'Error';
                }
            }
            stanza.c('body').t(message);
            client.send(stanza);
        });

        return null;
    }
};
