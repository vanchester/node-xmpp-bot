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
 [exit]    - Close bot
 [load]    - Load/reload plugin
 [stat]    - Server statistic (aliases: stat, os)
 [unload]  - Unload plugin
 [update]  - Update bot code from repository

Math:
 [calc]    - Calculate string
 [convert] - Convert number between number systems (aliases: c, conv)
 [roman]   - Convert numbers between roman and arabic systems

Net:
 [geoip]   - Return data about location by IP address
 [idn]     - Convert domain between IDN and punycode
 [lookup]  - DNS lookup
 [ping]    - Ping host or IP
 [port]    - Check port for open state (aliases: checkport)
 [resolve] - Resolve domain records

String operations:
 [b64dec]  - Decode base64 to string (aliases: base64dec, base64decode, b64d)
 [b64enc]  - Encode string to base64 (aliases: base64enc, base64encode, b64e)
 [crc32]   - CRC32 summ of string
 [lcase]   - Change all letters of string to lower case (aliases: lowercase, locase, lc)
 [md5]     - MD5 summ of string
 [morze]   - Convert string between letters and Morze symbols
 [reverse] - Reverse string (aliases: rev)
 [rmtag]   - Remove HTML-tags from string
 [sha1]    - SHA1 summ of string
 [strlen]  - String length (aliases: len, length)
 [translate] - Translate string between Russian and Enlish (aliases: tr)
 [translit] - Translit russian letters in string
 [ucase]   - Change all letters of string to upper case (aliases: uppercase, upcase, uc)
 [urldec]  - Decode URL to string (aliases: urldecode)
 [urlenc]  - Encode string to URL (aliases: urlencode)
 [shorturl] - URL shortener (aliases: short, urlshort, gl, url)
 [unshort] - Unshort any URL created using URL shortening services

Time tools:
 [stamp]   - Convert timestamp to date or show current timestamp (aliases: timestamp, time)

User tools:
 [memo]    - Saving short message
 [settings] - Configure your profile

Weather:
 [weather] - Show weather (aliases: w, temp, temperature)
 ```

Plugins
-------
You can extend bot commands with create plugins. All plugins is in directory `plugins`. 
See more information about plugin structure [here](./plugins/README.md)
