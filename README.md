node-xmpp-bot
=============

XMPP bot on Node.js, extended with plugins

Requirements
------------
* Node.js >= 0.4.0
* npm
* MongoDB

Installation
------------
1. clone this repository in empty directory with command
 ```shell
 git clone https://github.com/vanchester/node-xmpp-bot.git .
 ```
2. run command `npm install` for download required extensions
3. copy **config.js.expample** to **config.js** end edit it with your JID and password
4. run command ```shell ./run.sh``` for run bot

Usage
-----
Send **help** to bot's JID via Jabber client to see the list of available commands

Supported commands
------------------
 ```shell
Administration:
 [exit]        - Close bot
 [load]        - Load/reload plugin
 [stat]        - Server statistic
 [unload]      - Unload plugin
 [update]      - Update bot code from repository

Net:
 [lookup]      - DNS lookup
 [ping]        - Ping host or IP
 [resolve]     - Resolve domain records

Time tools:
 [stamp]       - Convert timestamp to date or show current timestamp

String operations:
 [b64dec]      - Decode base64 to string
 [b64enc]      - Encode string to base64
 [crc32]       - CRC32 summ of string
 [lcase]       - Change all letters of string to lower case
 [md5]         - MD5 summ of string
 [reverse]     - Reverse string
 [rmtag]       - Remove HTML-tags from string
 [sha1]        - SHA1 summ of string
 [shorturl]    - URL shortener
 [strlen]      - String length
 [translate]   - Translate string between Russian and Enlish
 [translit]    - Translit russian letters in string
 [ucase]       - Change all letters of string to upper case
 [urldec]      - Decode URL to string
 [urlenc]      - Encode string to URL
 ```

Plugins
-------
You can extend bot commands with create plugins. All plugins is in directory `plugins`. Simple plugin structure is
 ```javascript
 exports.command = {
    name: 'command',
    group: 'Group name',
    about: 'Simple command',
    help: 'command <PARAMS>',
    enabled: 1,
    max_access: 0,
    aliases: ['command1', 'command2']
    run: function(params, stanza, plugins, client) {
        return 'See you!';
    }
};
 ```

where
* `exports.command` - Command name to use in message
* `name: 'command'` - Original name of command
* `group: 'Group name'` - Group of command in list of commands when **help** sended
* `about: 'Simple command'` - Short description for list of commands when **help** sended
* `enabled: 1` - If 0, command will be disabled
* `max_access: 0` - If 1, command will be available only for admin's JIDs (**adminJID** in **config.js**)
* `aliases: ['command1', 'command2']` - Additional aliases of command, which can be used instead of original name of command
* `run: function (params, stanza, plugins, client) {}` - Logic of plugin. 

* **Params** contain as array all sended words,
* **stanza** is the object of answer
* **plugins** is container of all loaded plugins
* **client** - XMPP client
