exports.stamp = {
    name: 'stamp',
    group: 'Time tools',
    about: 'Convert timestamp to date or show current timestamp',
    help: 'timestamp [<UNIX-time>]',
    enabled: 1,
    aliases: ['timestamp', 'time'],
    run: function(params) {
        if (params[0]) {
            return new Date(params[0] * 1000);
        }

        var date = new Date();
        var stamp = new Date().getTime() / 1000;
        return '\n' + date + '\n' + stamp.toFixed(0);
    }
};