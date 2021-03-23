# Rust+ Discord bot

#### Usage
````
git clone https://github.com/m-hynek/discord-rustplus.git
cd discord-rustplus
rename and edit example.config.json to config.json
npm install
node index.js
````
#### Features
##### In-game device pairing
- Pair devices to bot and control everything from discord
- Use various commands to check state and details of smart components
- Group switches together and control them all with one command

![add](https://github.com/m-hynek/discord-rustplus/blob/main/docs/img/add.png?raw=true)
![devices](https://github.com/m-hynek/discord-rustplus/blob/main/docs/img/devices.png?raw=true)
![switch](https://github.com/m-hynek/discord-rustplus/blob/main/docs/img/switch.png?raw=true)

##### Real time notifications
- Discord and in-game chat notifications for switches and alarms status changes

![notifications](https://github.com/m-hynek/discord-rustplus/blob/main/docs/img/notifications.png?raw=true)

##### Status reporting
- Instant overview of upkeep and storage

![status](https://github.com/m-hynek/discord-rustplus/blob/main/docs/img/status1.png?raw=true)
![status](https://github.com/m-hynek/discord-rustplus/blob/main/docs/img/status2.png?raw=true)

#### Bot bot commands

##### Help
Quick way to check if bot can react, list of commands

`!help`

##### Add
In-game pairing requests are sent to discord, where devices can be paired with bot

`!add device_id name`

##### Chat
Send a message to game chat

`!chat message-text`

##### Devices
Prints list of devices paired with bot with ids, names and types

`!devices`

##### Group
Bind switches with group

`!group set group-name swich1,swich2,...`

Control switches in group

`!group enable|disable group-name`

##### Inventory
Shows combined inventories of paired storage monitors

`!inventory` 

##### TC
Shows status of monitored TCs 

`!tc`

##### Switch
Enables or disables switch

`!switch enable|disable name`

##### Chuck
Working placeholder for triggering things by ingame alarm. Get Chuck Norris fact by using ingame button connected to smart alarm.

Sends random fact to ingame chat.

`!chuck`

Bind in-game with bot  so in-game alarm can trigger it (not yet implemented)

`!chuck bind alarm-name` 

#### Some planned features

- teamchat sync
- !group: add switch grouping and toggle groups by !group enable|disable name (!group disable turrets)
- search and sorting of inventories for !status 
- !shops to see all player listings
- allow toggling switches in intervals, with delay or toggle for X minutes

###### How it works
> index.js
>> ![it works](https://media.giphy.com/media/10zsjaH4g0GgmY/giphy.gif)
