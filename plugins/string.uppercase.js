exports.ucase = {
    name: 'ucase',
    group: 'String operations',
    about: 'Change all letters of string to upper case',
    help: 'ucase <STRING>',
    enabled: 1,
    aliases: ['uppercase', 'upcase', 'uc'],
    run: function(params) {
        if (params[0]) {
            return params.join(' ').toUpperCase();
        }

        return this.help;
    }
};