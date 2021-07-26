## About this project.
This repository contains all the nodejs bots that runs on proxmox bots for walmart registration, walmart buy, walmart order status scraper, walmart extra item cancel and carrier status bots.

## How to run each bot
1, Clone this repo
2, Type in terminal `cd ProxmoxBots`
3, Install dependencies by typing `npm i`
4, Find specific folder of bot to run. E.g. if you want to run the `walmart-buy bot`, you should type `cd walmart-buy`
5, Run the bot using this command. `node init.js`

## Special case
1, For walmart order status scraper, it is designed to use either luminati proxy or buyproxy. We rarely use luminati but in case of rare case,
   you can run the bot with luminati proxies by adding another flag followed by `node init.js`. Like `node init.js 1`
   If you dont specify the flag, it will run using buyproxies.
2, This is the same in walmart extra item cancel bot.

## Where are these bots
You can find any related anydesk machine id and password(forte1long) in our git repo https://github.com/STLPROINC/stlpro/wiki/List-of-Anydesk-machines

## In case of emergency or problem
Ask Xiaoping for help.