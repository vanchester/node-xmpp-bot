exports.morze = {
    name: 'morze',
    group: 'String operations',
    about: 'Convert string between letters and Morze symbols',
    help: 'morze <MESSAGE>',
    enabled: 1,
    run: function(params) {
        var letters = {
            'а': '.- ', 'б': '-... ', 'в': '.-- ', 'г': '--. ', 'д': '-.. ',
            'е': '. ', 'ж': '...- ', 'з': '--.. ', 'и': '.. ', 'й': '.--- ',
            'к': '-.- ', 'л': '.-.. ', 'м': '-- ', 'н': '-. ', 'о': '--- ',
            'п': '.--. ', 'р': '.-. ', 'с': '... ', 'т': '- ', 'у': '..- ',
            'ф': '..-. ', 'х': '.... ', 'ц': '-.-. ', 'ч': '---. ', 'ш': '---- ',
            'щ': '--.- ', 'ы': '-.-- ', 'ь': '-..- ', 'э': '..-.. ', 'ю': '..-- ',
            'я': '.-.- ', 'a': '.- ', 'b': '-... ', 'c': '-.-. ', 'd': '-.. ',
            'e': '. ', 'f': '..-. ', 'g': '--. ', 'h': '.... ', 'i': '.. ',
            'j': '.--- ', 'k': '-.- ', 'l': '.-.. ', 'm': '-- ',
            'n': '-. ', 'o': '--- ', 'p': '.--. ', 'q': '--.- ',
            'r': '.-. ', 's': '... ', 't': '- ', 'u': '..- ',
            'v': '...- ', 'w': '.-- ', 'x': '-..- ', 'y': '-.-- ',
            'z': '--.. ', '0': '----- ', '1': '.---- ', '2': '..--- ',
            '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ',
            '7': '--... ', '8': '---.. ', '9': '----. ', ' ': '  '
        };

        if (!params[0]) {
            return this.help;
        }

        var str = params.join(' ').toLowerCase();
        var message = '';
        if (/[a-zа-я0-9]+/.test(str)) {
            for (var i = 0; i < str.length; i++) {
                var letter = str.substr(i, 1);
                message += letters[letter] || letter;
            }
        } else {
            for (var i in params) {
                var symbol = params[i] || ' ';
                for (var key in letters) {
                    if (letters[key] == symbol + ' ') {
                        message += key;
                        break;
                    }
                }


            }
        }

        return message || null;
    }
};
