node-xmpp-bot
=============

XMPP bot on Node.js, based on [node-xmpp](https://github.com/astro/node-xmpp)

Demo bot: bot@vanchester.ru

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
 [exit]       - Close bot
 [load]       - Load/reload plugin (aliases: reload)
 [stat]       - Server statistic (aliases: statistic, os)
 [status]     - Change bot status and set status message
 [unload]     - Unload plugin
 [update]     - Update bot code from repository

Math:
 101 [calc]       - Calculate string
 102 [convert]    - Convert number between number systems (aliases: c, conv)
 103 [roman]      - Convert numbers between roman and arabic systems

Net:
 201 [geoip]      - Return data about location by IP address
 202 [idn]        - Convert domain between IDN and punycode
 203 [lookup]     - DNS lookup
 204 [ping]       - Ping host or IP
 205 [port]       - Check port for open state (aliases: checkport)
 206 [resolve]    - Resolve domain records
 207 [urldec]     - Decode URL to string (aliases: urldecode)
 208 [urlenc]     - Encode string to URL (aliases: urlencode)
 209 [shorturl]   - URL shortener (aliases: short, urlshort, gl, url)
 210 [unshort]    - Unshort any URL created using URL shortening services

String operations:
 301 [b64dec]     - Decode base64 to string (aliases: base64dec, base64decode, b64d)
 302 [b64enc]     - Encode string to base64 (aliases: base64enc, base64encode, b64e)
 303 [crc32]      - CRC32 summ of string
 304 [lcase]      - Change all letters of string to lower case (aliases: lowercase, locase, lc)
 305 [md5]        - MD5 summ of string
 306 [morze]      - Convert string between letters and Morze symbols
 307 [reverse]    - Reverse string (aliases: rev, invert)
 308 [rmtag]      - Remove HTML-tags from string
 309 [sha1]       - SHA1 summ of string
 310 [strlen]     - String length (aliases: len, length)
 311 [translate]  - Translate string between Russian and Enlish (aliases: tr)
 312 [translit]   - Translit russian letters in string
 313 [ucase]      - Change all letters of string to upper case (aliases: uppercase, upcase, uc)

Time tools:
 401 [stamp]      - Convert timestamp to date or show current timestamp (aliases: timestamp, time)

User tools:
 501 [memo]       - Saving short message (aliases: note)

Weather:
 601 [weather]    - Show weather (aliases: w, temp, temperature)
 ```

Plugins
-------
You can extend bot commands with create plugins. All plugins is in directory `plugins`. 
See more information about plugin structure [here](./plugins/README.md)
