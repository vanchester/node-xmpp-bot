exports.strikeout = {
    name: 'strikeout',
    group: 'String operations',
    about: 'Strikethrough string',
    help: 'strikeout <STRIKETYPE> <TEXT>\n' +
        '\nKind of strikethrough:\n' +
        '0 - ' + strike('strike through', 0) + '\n' +
        '1 - ' + strike('cross hatching', 1) + '\n' +
        '2 - ' + strike('cross hatching windows style', 2) + '\n' +
        '3 - ' + strike('double cross hatching', 3) + '\n' +
        '4 - ' + strike('dots above', 4) + '\n' +
        '5 - ' + strike('wave above', 5) + '\n' +
        '6 - ' + strike('arrows below', 6) + '\n' +
        '7 - ' + strike('simple underline', 7) + '\n',
    enabled: 1,
    aliases: ['strike'],
    run: function(params) {
        if (!params[0] || !params[1]) {
            return this.help;
        }

        var type = params[0];
        params.shift();
        var text = params.join(' ');
        return strike(text, type);
    }
};

function strike(text, type)
{
    var uni = '\u0336';
    switch (parseInt(type)) {
        case 1: uni = '\u0337'; break;
        case 2: uni = '\u20E5'; break;
        case 3: uni = '\u20EB'; break;
        case 4: uni = '\u20DC'; break;
        case 5: uni = '\u0360'; break;
        case 6: uni = '\u032D'; break;
        case 7: uni = '\u0332'; break;
    }

    return text.replace(/(.)/g, '$1' + uni);
}
