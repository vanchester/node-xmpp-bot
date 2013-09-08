exports.b64dec = {
    name: 'b64dec',
    about: 'Decode base64 to string',
    help: 'b64dec <CODE>',
    enabled: 1,
    aliases: ['base64dec', 'base64decode', 'b64d'],
    run: function(params) {
        if (params[0]) {
            try {
                var buffer = new Buffer(params.join(' ').replace(/[^=]*$/, ''), 'base64');
                if (buffer) {
                    return buffer.toString('utf8');
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