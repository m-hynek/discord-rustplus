###### Experimental code for educational purpose. Rewrite imminent.

#### Discord bot commands

##### Ping
Quick way to check if bot can react 

`!ping`

##### Add
In-game pairing requests are sent to discord, where devices can be paired with bot

`!add device_id name`

![add](https://github.com/m-hynek/discord-rustplus/blob/main/add.png?raw=true)

##### Devices

`!devices`

Prints list of devices paired with bot with ids, names and types

##### Status

`!status tc|storage`

Shows status of TCs or complete monitored inventory

![status](https://github.com/m-hynek/discord-rustplus/blob/main/status.png?raw=true)

##### Switch

`!switch enable|disable name`

Obviously it enables or disables switch

![switch](https://github.com/m-hynek/discord-rustplus/blob/main/switch.png?raw=true)

#### Some planned features

- teamchat sync
- discord reactions to device state changes (smart alarms, low upkeep, state of switches, etc)
- !chuck: send random Chuck Norris fact to teamchat, allow to bind smart alarm to this command, so joke can be requested by simple in-game button
- !group: add switch grouping and toggle groups by !group enable|disable name (!group disable turrets)
- search and sorting of inventories for !status 
- !shops to see all player listings
- allow toggling switches in intervals, with delay or toggle for X minutes

###### How it works
> index.js
>> ![it works](https://media.giphy.com/media/10zsjaH4g0GgmY/giphy.gif)
