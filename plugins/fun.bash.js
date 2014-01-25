var request = require('request'),
    Iconv = require('iconv').Iconv,
    Entities = require('html-entities').XmlEntities,
    host = "http://bash.im",
    cheerio = require('cheerio');

exports.bash = {
    name: 'bash',
    group: 'Fun',
    about: 'Show bash quotes',
    help: 'bash - show random quote,\nbash <NUMBER> - show fresh quote NUMBER',
    enabled: 1,
    aliases: [],
    run: function(params, stanza, plugins, client) {
        var options = {
            uri: host + (params[0] ? '' : '/random'),
            encoding: 'binary'
        };

        callback = function(err, res, body) {
            body = new Buffer(body, 'binary');
            var iconv = new Iconv('windows-1251', 'utf8//IGNORE');
            body = iconv.convert(body).toString();

            var message = '';

            try {
                var $ = cheerio.load(body);

                // remove ad-blocks
                $('.quote').each(function () {
                    if (!$('.text', $(this)).text()) {
                        $(this).remove();
                    }
                });

                var quoteNum = params[0] ? params[0] - 1 : 0;
                if (params[0] > 50) {
                    quoteNum = params[0] - (parseInt((params[0] / 50)) * 50) - 1;
                }

                message = $('.quote').eq(quoteNum).find('.text').html().replace(/\<br[^\>]*\>/g, '\n');

                // if quote is not in first page
                if (params[0] > 50) {
                    var page = parseInt(params[0] / 50);
                    var currPage = parseInt($('.arr').eq(0).next('span').text()) + 1;
                    options.uri = host + '/index/' + (currPage - page);
                    params[0] = params[0] - (page * 50);
                    request(options, callback);
                    return;
                }

                var entities = new Entities();
                message = entities.decode(message);
            } catch (e) {
                console.log(options);
                console.log(e);
                message = "There is an error. Try again later";
            }

            stanza.c('body').t(message);
            client.send(stanza);
        };

        request(options, callback);

        return null;
    }
};
