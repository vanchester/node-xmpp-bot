exports.unknown = {
    about: '',
    help: '',
    enabled: 1,
    run: function(params, stanza, plugins) {
        return "Command not found. Send 'help' for list of supported commands";
    }
};