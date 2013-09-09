node-xmpp-bot
=============

XMPP bot on Node.js, based on [node-xmpp](https://github.com/astro/node-xmpp), extended with plugins

Requirements
------------
* Node.js >= 0.4.0
* npm
* MongoDB

Installation
------------
1. clone this repository in empty directory with command
 ```
 git clone https://github.com/vanchester/node-xmpp-bot.git .
 ```
2. run command `npm install` for download required extensions
3. copy **config.js.example** to **config.js** and edit it with your JID and password
4. run command `./run.sh` for run bot

Usage
-----
Send **help** to bot's JID via Jabber client to see the list of available commands

Supported commands
------------------
 ```
Administration:
 [stat]        - Server statistic
 [load]        - Load/reload plugin
 [unload]      - Unload plugin
 [update]      - Update bot code from repository
 [exit]        - Close bot

Net:
 [lookup]      - DNS lookup
 [ping]        - Ping host or IP
 [resolve]     - Resolve domain records

String operations:
 [b64dec]      - Decode base64 to string
 [b64enc]      - Encode string to base64
 [crc32]       - CRC32 summ of string
 [md5]         - MD5 summ of string
 [sha1]        - SHA1 summ of string
 [lcase]       - Change all letters of string to lower case
 [ucase]       - Change all letters of string to upper case
 [reverse]     - Reverse string
 [rmtag]       - Remove HTML-tags from string
 [strlen]      - String length
 [translate]   - Translate string between Russian and Enlish
 [translit]    - Translit russian letters in string
 [shorturl]    - URL shortener
 [urldec]      - Decode URL to string
 [urlenc]      - Encode string to URL

Time tools:
 [stamp]       - Convert timestamp to date or show current timestamp
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
* `max_access: 0` - if 1, command will be available only for admin's JIDs (**adminJID** in **config.js**)
* `aliases: ['command1', 'command2']` - additional aliases of command, which can be used instead of original name of command
* `run: function (params, stanza, plugins, client) {}` - logic of plugin. **Params** contain all sended words (as array), **stanza** is the object of answer, **plugins** is the container of all loaded plugins, **client** - XMPP client object

**Run** can return string or null. If it return the string, this string will be send to recipient. 
Also, message can be sent via **stranza** from plugin's body: `stranza.c('body').t('Hello!'); client.send(stranza);`. 
See all examples in plugins files
