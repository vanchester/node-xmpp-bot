var fs = require('fs');

var Plugins = function (path, client) {
    var that = this;

    fs.readdirSync(path).forEach(function(file) {
        if (!/.js$/.test(file)) {
            return;
        }

        var p = require(path + '/' + file);
        for (var name in p) {
            if (p[name].enabled != 1) {
                continue;
            }

            that[name.toLowerCase()] = p[name];

            if (typeof p[name].afterLoad == 'function') {
                p[name].afterLoad(client);
            }

            if (p[name].aliases) {
                for (var i in p[name].aliases) {
                    that[p[name].aliases[i].toLowerCase()] = p[name];
                }
            }
        }
    });

    addNumberAliases(this);
    return this
};

Plugins.prototype.getGroups = function (withAdminCommands)
{
    var groups = [];
    for (var name in this) {
        var group = this[name].group;
        if (!group || this[name].name != name || (this[name].max_access && !withAdminCommands)) {
            continue;
        }

        if (groups.indexOf(group) == -1) {
            groups.push(group);
        }
    }

    return groups;
};

function addNumberAliases(plugins)
{
    var groups = plugins.getGroups();
    var commandAliasNumber;
    var groupAliasNumber = 0;
    for (var n in groups) {
        groupAliasNumber += 100;
        commandAliasNumber = groupAliasNumber;
        var group = groups[n];
        for (var i in plugins) {
            if (plugins[i].group == group && i == plugins[i].name) {
                plugins[++commandAliasNumber] = plugins[i];
            }
        }
    }

    // plugins without group
    groupAliasNumber += 100;
    commandAliasNumber = groupAliasNumber;
    for (var i in plugins) {
        if (!plugins[i].group && plugins[i].name == i) {
            plugins[++commandAliasNumber] = plugins[i];
        }
    }
}


module.exports = Plugins;