###### Experimental code for educational purpose. Rewrite imminent.
#### Usage
````
git clone https://github.com/m-hynek/discord-rustplus.git
rename and edit example.config.json to config.json
npm install
node index.js
````
#### Features
##### In-game device pairing
- Pair devices to bot and control everything from discord
- Use various commands to check state and details
- Real time discord and teamchat notifications for switches and alarms status
- Low upkeep warning with configured time threshold

#### Bot bot commands

##### Help
Quick way to check if bot can react, list of commands

`!help`

##### Add
In-game pairing requests are sent to discord, where devices can be paired with bot

`!add device_id name`

![add](https://github.com/m-hynek/discord-rustplus/blob/main/add.png?raw=true)

##### Devices

`!devices`

Prints list of devices paired with bot with ids, names and types

![switch](https://github.com/m-hynek/discord-rustplus/blob/main/devices.png?raw=true)

##### Status

`!status tc|storage`

Shows status of TCs or complete monitored inventory

![status](https://github.com/m-hynek/discord-rustplus/blob/main/status1.png?raw=true)
![status](https://github.com/m-hynek/discord-rustplus/blob/main/status2.png?raw=true)

##### Switch

`!switch enable|disable name`

Obviously it enables or disables switch

![switch](https://github.com/m-hynek/discord-rustplus/blob/main/switch.png?raw=true)

##### Chuck

`!chuck` - sends random fact to ingame chat.

`!chuck bind alarm-name` - bind in-game with bot  so in-game alarm can trigger it (not yet implemented)

Working placeholder for triggering things by ingame alarm. Get Chuck Norris fact by using ingame button connected to smart alarm.

#### Some planned features

- teamchat sync
- !group: add switch grouping and toggle groups by !group enable|disable name (!group disable turrets)
- search and sorting of inventories for !status 
- !shops to see all player listings
- allow toggling switches in intervals, with delay or toggle for X minutes

###### How it works
> index.js
>> ![it works](https://media.giphy.com/media/10zsjaH4g0GgmY/giphy.gif)
