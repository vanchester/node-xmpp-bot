var crypto = require('crypto');

exports.md5 = {
    name: 'md5',
    group: 'String operations',
    about: 'MD5 summ of string',
    help: 'md5 <STRING>',
    enabled: 1,
    run: function(params) {
        if (params[0]) {
            var md5sum = crypto.createHash('md5');
            return md5sum.update(params[0]).digest('hex') ;
        }

        return this.help;
    }
};