exports.b64enc = {
    name: 'b64enc',
    about: 'Encode string to base64',
    help: 'strlen <STRING>',
    enabled: 1,
    aliases: ['base64enc', 'base64encode', 'b64e'],
    run: function(params) {
        if (params[0]) {
            return new Buffer(params.join(' ')).toString('base64');
        }

        return this.help;
    }
};