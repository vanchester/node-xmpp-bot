exports.timestamp = {
    name: 'timestamp',
    about: 'Convert timestamp to date',
    help: 'timestamp <UNIX-time>',
    enabled: 1,
    aliases: ['stamp', 'time'],
    run: function(params) {
        if (params[0]) {
            return new Date(params[0] * 1000);
        }

        return this.help;
    }
};