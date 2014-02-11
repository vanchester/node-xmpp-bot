node-xmpp-bot
=============

XMPP bot on Node.js, based on [node-xmpp](https://github.com/astro/node-xmpp)

Demo bot: bot@vanchester.ru

Requirements
------------
* Node.js >= 0.4.0
* npm
* node-gyp
* libicu-devel
* MongoDB
* screen

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
 [exit]       - Close bot
 [join]       - Join to groupchat (aliases: conf)
 [leave]      - Leave a groupchat (aliases: conf)
 [load]       - Load/reload plugin (aliases: reload)
 [st]         - Server statistic (aliases: statistic, os)
 [status]     - Change bot status and set status message
 [unload]     - Unload plugin
 [update]     - Update bot code from repository
 [version]    - Show version of the bot (aliases: ver)

Fun:
 101 [bash]       - Show quotes from bash.im

Math:
 201 [calc]       - Calculate string
 202 [convert]    - Convert number between number systems (aliases: c, conv)
 203 [roman]      - Convert numbers between roman and arabic systems

Net:
 301 [geoip]      - Return data about location by IP address
 302 [idn]        - Convert domain between IDN and punycode
 303 [lookup]     - DNS lookup
 304 [ping]       - Ping host or IP, or simple pong without params
 305 [port]       - Check port for open state (aliases: checkport)
 306 [resolve]    - Resolve domain records
 307 [urldec]     - Decode URL to string (aliases: urldecode)
 308 [urlenc]     - Encode string to URL (aliases: urlencode)
 309 [shorturl]   - URL shortener (aliases: short, urlshort, gl, url)
 310 [unshort]    - Unshort any URL created using URL shortening services

String operations:
 401 [b64dec]     - Decode base64 to string (aliases: base64dec, base64decode, b64d)
 402 [b64enc]     - Encode string to base64 (aliases: base64enc, base64encode, b64e)
 403 [crc32]      - CRC32 summ of string
 404 [lcase]      - Change all letters of string to lower case (aliases: lowercase, locase, lc)
 405 [md5]        - MD5 summ of string
 406 [morze]      - Convert string between letters and Morze symbols
 407 [reverse]    - Reverse string (aliases: rev, invert)
 408 [rmtag]      - Remove HTML-tags from string
 409 [sha1]       - SHA1 summ of string
 410 [strlen]     - String length (aliases: len, length)
 411 [translate]  - Translate string between Russian and Enlish (aliases: tr)
 412 [translit]   - Translit russian letters in string
 413 [ucase]      - Change all letters of string to upper case (aliases: uppercase, upcase, uc)

Time tools:
 501 [stamp]      - Convert timestamp to date or show current timestamp (aliases: timestamp, time)

User tools:
 601 [follow]     - Monitor tweets (aliases: fl, fw)
 602 [memo]       - Saving short message (aliases: note)
 603 [rss]        - Monitor RSS feed
 604 [todo]       - Manage your TODOs (compatible with todo.txt-cli format) (aliases: t)
 605 [webstatus]  - JID's status for web (aliases: web-status)

Weather:
 701 [weather]    - Show weather (aliases: w, temp, temperature)
 ```

Plugins
-------
You can extend bot commands with create plugins. All plugins is in directory `plugins`. 
See more information about plugin structure [here](./plugins/README.md)
