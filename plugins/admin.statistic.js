var os = require('os'),
    process = require('process'),
    util = require('util');

exports.stat = {
    name: 'stat',
    group: 'Administration',
    about: 'Server statistic',
    help: 'stat',
    enabled: 1,
    max_access: 1,
    aliases: ['stat', 'os'],
    run: function() {
        var message = 'System information for ' + os.hostname() + '\n';
        message += 'Uptime: ' + secondsToString(os.uptime()) + '\n';
        message += 'Load average: ' + loadAvgToString(os.loadavg()) + '\n';
        message += 'Memory: ' + bytesToSize(os.freemem()) + ' / ' + bytesToSize(os.totalmem()) + '\n';
        message += '\nBot uptime: ' + secondsToString(process.uptime()) + '\n';
        message += 'Bot memory usage: ' + bytesToSize(util.inspect(process.memoryUsage().rss)) + '\n';
        message += '\nVersions: ' + JSON.stringify(process.versions) + '\n';
        return message;
    }
};

function loadAvgToString(data)
{
    for (var i in data) {
        data[i] = data[i].toFixed(2);
    }

    return data.join(' ');
}

function bytesToSize(bytes)
{
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function secondsToString(seconds)
{
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = ((((seconds % 31536000) % 86400) % 3600) % 60).toFixed(0);

    var result = '';
    if (numyears) {
        result = numyears + " years ";
    }
    if (numyears || numdays) {
        result += numdays + " days ";
    }
    if (numyears || numdays || numhours) {
        result += numhours + " hours ";
    }
    if (numyears || numdays || numhours|| numminutes) {
        result += numminutes + " minutes ";
    }

    result += numseconds + " seconds";

    return  result;
}