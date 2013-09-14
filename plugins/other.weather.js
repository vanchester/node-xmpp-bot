var http = require('http'),
    host = "api.openweathermap.org",
    path = "/data/2.5/weather?mode=json&units=metric&q=";

exports.weather = {
    name: 'weather',
    group: 'Other',
    about: 'Show weather',
    help: 'weather <CITY>',
    enabled: 1,
    aliases: ['w', 'temp', 'temperature'],
    run: function(params, stanza, plugins, client) {
        if (!params[0]) {
            return this.help;
        }

        var options = {
            host: host,
            path: path + params[0]
        };

        if (/[а-яА-Я]/.test(params[0])) {
            options.path += '&lang=ru'
        }

        callback = function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var message = '';

                try {
                    var weather = JSON.parse (str);
                    message =
                        '\n' + weather.weather[0].description + '\n' +
                        'Temperature: ' + weather.main.temp + '° (' + weather.main.temp_min + '° - ' + weather.main.temp_max + '°)\n' +
                        'Humidity: ' + weather.main.humidity + '%\n' +
                        'Pressure: ' + weather.main.pressure.toFixed(0) + ' hpa\n' +
                        'Wind: ' + weather.wind.speed + ' m/s\n' +
                        '\nMore info: http://openweathermap.org/city/' + weather.id;
                } catch (e) {
                    console.log(options);
                    console.log(e);
                    message = "There is an error. Try again later";
                }

                stanza.c('body').t(message);
                client.send(stanza);
            });
        };

        http.request(options, callback).end();

        return null;
    }
};