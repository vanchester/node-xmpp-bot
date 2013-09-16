exports.urldec = {
    name: 'urldec',
    group: 'Net',
    about: 'Decode URL to string',
    help: 'urldec <URL>',
    enabled: 1,
    aliases: ['urldecode'],
    run: function(params) {
        if (params[0]) {
            return decodeURIComponent(params.join(' '));
        }

        return this.help;
    }
};