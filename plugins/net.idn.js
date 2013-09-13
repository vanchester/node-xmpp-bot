var punycode = require('punycode');

exports.idn = {
    name: 'idn',
    group: 'Net',
    about: 'Convert domain between IDN and punycode',
    help: 'idn <DOMAIN>',
    enabled: 1,
    run: function(params) {
        if (!params[0]) {
            return this.help;
        }

        if (/^xn--/.test(params[0])) {
            return punycode.toUnicode(params[0]);
        }

        return punycode.toASCII(params[0]);
    }
};