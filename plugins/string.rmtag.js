exports.rmtag = {
    name: 'rmtag',
    about: 'Remove HTML-tags from string',
    help: 'rmtag <STRING>',
    enabled: 1,
    run: function(params) {
        if (params[0]) {
            return params[0].replace(/(<([^>]+)>)/ig, '');
        }

        return this.help;
    }
};