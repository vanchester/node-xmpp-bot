Plugin structure
----------------

 ```javascript
 exports.command = {
    name: 'command',
    group: 'Group name',
    about: 'Simple command',
    help: 'command <PARAMS>',
    enabled: 1,
    max_access: 0,
    aliases: ['command1', 'command2'],
    afterLoad: function () {},
    run: function (params, stanza, plugins, client) {
        return 'Hello!';
    }
};
 ```

where
* `exports.command` - command name to use in message
* `name: 'command'` - original name of command
* `group: 'Group name'` - group of command in list of commands when **help** sended
* `about: 'Simple command'` - short description for list of commands when **help** sended
* `help: 'command <PARAMS>'` - hint when sended **help command**
* `enabled: 1` - if 0, command will be disabled
* `max_access: 0` - if 1, command will be available only for admin's JIDs (param **adminJID** in **config.js**)
* `aliases: ['command1', 'command2']` - additional aliases of command, which can be used instead of original name of command
* `afterLoad: function () {}` - logic called when plugin loaded to memory during bot start
* `run: function (params, stanza, plugins, client) {}` - logic of plugin. **Params** contain all sended words (as array), **stanza** is the object of answer, **plugins** is the container of all loaded plugins, **client** - XMPP client object


**Run** can return string or null. If it return the string, this string will be sent to recipient. 
Also, message can be sent via **stranza** from plugin's body: `stranza.c('body').t('Hello!'); client.send(stranza);`. 
See all examples in plugins files
