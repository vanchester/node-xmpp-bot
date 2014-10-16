var math = require('mathjs');

exports.calc = {
    name: 'calc',
    group: 'Math',
    about: 'Calculate string',
    help: 'calc <EXPRESSION>',
    enabled: 1,
    run: function(params) {
        if (!params[0]) {
            return this.help;
        }

        try {
            return math.eval(params.join(' '));
        } catch (e) {
            return 'Expression is incorrect';
        }
    }
};
