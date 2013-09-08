exports.urlenc = {
    name: 'urlenc',
    about: 'Encode string to URL',
    help: 'urlenc <STRING>',
    enabled: 1,
    aliases: ['urlencode'],
    run: function(params) {
        if (params[0]) {
            return encodeURIComponent(params.join(' '));
        }

        return this.help;
    }
};