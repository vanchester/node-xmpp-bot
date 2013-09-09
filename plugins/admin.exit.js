var process = require('process'),
    exec = require('child_process').exec;

exports.exit = {
    name: 'exit',
    group: 'Administration',
    about: 'Close bot',
    help: 'exit',
    enabled: 1,
    max_access: 1,
    run: function() {
        process.exit(1);
        return 'See you!';
    }
};
