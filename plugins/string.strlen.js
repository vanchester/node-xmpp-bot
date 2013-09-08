exports.strlen = {
    name: 'strlen',
    about: 'String length',
    help: 'strlen <STRING>',
    enabled: 1,
    run: function(params) {
        if (params[0]) {
            return params.join(' ').length;
        }

        return this.help;
    }
};