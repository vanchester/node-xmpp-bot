exports.unknown = {
    about: '',
    help: '',
    enabled: 1,
    run: function(params, from, plugins) {
        return "Command not found. Send 'help' for list of supported commands";
    }
};