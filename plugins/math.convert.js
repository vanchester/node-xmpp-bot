exports.convert = {
    name: 'convert',
    group: 'Math',
    about: 'Convert number between number systems',
    help: 'convert <NUMBER> <FROM-BASE> <TO-BASE>',
    enabled: 1,
    aliases: ['c', 'conv'],
    run: function(params) {
        if (!params[0] || !params[1] || !params[2]
            || !/^[\d]+$/.test(params[1]) || !/^[\d]+$/.test(params[2]))
        {
            return this.help;
        }

        if (params[1] < 2 || params[1] > 36
            || params[2] < 2 || params[2] > 36)
        {
            return 'Base of number system must between 2 and 36'
        }
        var num = parseInt(params[0], params[1]);

        var result = num.toString(params[2]);
        return isNaN(result) ? 'Incorrect number' : result;
    }
};