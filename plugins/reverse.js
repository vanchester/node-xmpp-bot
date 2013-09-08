exports.reverse = {
    name: 'reverse',
    about: 'Reverse string',
    help: 'reverse <STRING>',
    enabled: 1,
    aliases: ['rev'],
    run: function(params) {
        if (params[0]) {
            return params.join(' ').split('').reverse().join('');
        }

        return this.help;
    }
};