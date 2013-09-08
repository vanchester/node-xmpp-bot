var crypto = require('crypto');

exports.sha1 = {
    name: 'sha1',
    about: 'SHA1 summ of string',
    help: 'sha1 <STRING>',
    enabled: 1,
    run: function(params) {
        if (params[0]) {
            var sha1sum = crypto.createHash('sha1');
            return sha1sum.update(params[0]).digest('hex') ;
        }

        return this.help;
    }
};