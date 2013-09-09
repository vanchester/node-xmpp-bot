exports.strlen = {
    name: 'strlen',
    group: 'String operations',
    about: 'String length',
    help: 'strlen <STRING>',
    enabled: 1,
    aliases: ['len', 'length'],
    run: function(params) {
        if (params[0]) {
            return params.join(' ').length;
        }

        return this.help;
    }
};