exports.lcase = {
    name: 'lcase',
    group: 'String operations',
    about: 'Change all letters of string to lower case',
    help: 'lcase <STRING>',
    enabled: 1,
    aliases: ['lowercase', 'locase', 'lc'],
    run: function(params) {
        if (params[0]) {
            return params.join(' ').toLowerCase();
        }

        return this.help;
    }
};