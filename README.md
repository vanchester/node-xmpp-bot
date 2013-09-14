node-xmpp-bot
=============

XMPP bot on Node.js, based on [node-xmpp](https://github.com/astro/node-xmpp)

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
4. run command `./run.sh` to run the bot

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

Math:
 [calc]        - Calculate string
 [roman]       - Convert numbers between roman and arabic systems
 [convert]     - Convert number between number systems

Net:
 [geoip]       - Return data about location by IP address
 [idn]         - Convert domain between IDN and punycode
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

User tools:
 [memo]        - Saving short message

Weather:
 [weather]     - Show weather (aliases: w, temp, temperature)
 ```

Plugins
-------
You can extend bot commands with create plugins. All plugins is in directory `plugins`. 
See more information about plugin structure [here](./plugins/README.md)
