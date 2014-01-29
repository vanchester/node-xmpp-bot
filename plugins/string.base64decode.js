exports.b64dec = {
    name: 'b64dec',
    group: 'String operations',
    about: 'Decode base64 to string',
    help: 'b64dec <CODE>',
    enabled: 1,
    aliases: ['base64dec', 'base64decode', 'b64d'],
    run: function(params) {
        if (params[0]) {
            try {
                if (/[^\w\d\/\+=]/i.test(params[0].trim())) {
                    return 'Wrong code format';
                }

                var buffer = new Buffer(params.join(' ').replace(/[=]+(.+)/, ''), 'base64');
                if (buffer) {
                    var msg = buffer.toString('utf8');
                    return (/[^\u0000-\u0800]/.test(msg))
                        ? 'Can not decode string'
                        : msg;
                } else {
                    return 'Can not decode string';
                }
            } catch (e) {
                return 'Wrong code';
            }
        }

        return this.help;
    }
};
