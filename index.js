const Discord = require("discord.js");
const RustPlus = require('@liamcottle/rustplus.js');
const config = require("./config.json");
const axios = require('axios');
const express = require('express');
const {v4: uuidv4} = require('uuid');
const {register, listen} = require('push-receiver');

function traverse(array, callback) {
    for (let i = 0; i < array.length; i++) {
        callback(array[i]);
    }
}

function updateJson(id, type, name, group = null) {
    let cache = readJson();
    let device = {
        "id": id,
        "type": type,
        "name": name,
        "group": group
    };
    if (cache.devices) {
        let add = true;
        for (let i = 0; i < cache.devices.length; i++) {
            if (cache.devices[i].id === id) {
                cache.devices[i] = device;
                add = false;
            }
        }
        if (add) {
            cache.devices.push(device);
        }
    } else {
        cache.devices = [device]
    }
    writeJsonToFile(cache);
}

function readJson() {
    return require("./devices.json");
}

function writeJsonToFile(json) {
    var fs = require("fs");
    fs.writeFile("./devices.json", JSON.stringify(json), "utf8", function () {
        console.log('devices.json saved')
    });
}

let rustplus;
const client = new Discord.Client();
const prefix = "!";

function getType(message) {
    if (message.response.entityInfo.type === 3) {
        if (message.response.entityInfo.payload.capacity === 24) {
            return 4;
        } else {
            return 5;
        }
    } else {
        return message.response.entityInfo.type;
    }
}

client.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        return message.reply(`Pong!`);
    } else if (command === "pair") {
        if (args.length < 3) {
            return message.reply(`!pair id name group`);
        } else {
            let id = args[0];
            let name = args[1];
            let group = args[2];
            let type = '';
            rustplus.getEntityInfo(id, (message) => {
                console.log("getEntityInfo response message: " + JSON.stringify(message));
                type = getType(message);
                updateJson(id, type, name, group);
                return true;
            });
            return message.react("✅");
        }
    } else if (command === "devices") {
        return message.reply(JSON.stringify(readJson()));
    } else if (command === "status") {
        if (args.length < 1) {
            return message.reply("!status tc|explo|mats|comp|switch");
        } else if (args[0] === "tc") {
            let cache = readJson();
            if (!cache.devices.length) {
                client.channels.cache.get(config.PAIR_CHANNEL_ID).send("No TC found");
            }
            let info = "``` ";
            traverse(cache.devices, function (device) {
                if (device.type === 4) {
                    rustplus.getEntityInfo(device.id, (message) => {
                        console.log("getEntityInfo response message: " + JSON.stringify(message));
                        info += device.name + "\n" + "hasProtection: " + message.response.entityInfo.payload.hasProtection + "\n" + "protectionExpiry: " + message.response.entityInfo.payload.protectionExpiry + "\n";
                        return true;
                    });
                }
            })
            setTimeout(function() {
                return message.reply(info + "```");
            }, Math.random() * 2000);
        }
    } else if (command === "toggle") {
        if (args.length >= 2) {
            let cache = readJson();
            traverse(cache.devices, function (device) {
                if (device.name === args[0]) {
                    if (args[1] === 'on') {
                        rustplus.turnSmartSwitchOn(device.id, (message) => {
                            console.log("turnSmartSwitchOn response message: " + JSON.stringify(message));
                            return true;
                        });
                        rustplus.sendTeamMessage('[Sentry bot] switch ' + args[0] + ' online');
                        return message.react("✅")
                    } else if (args[1] === 'off') {
                        rustplus.turnSmartSwitchOff(device.id, (message) => {
                            console.log("turnSmartSwitchOff response message: " + JSON.stringify(message));
                            return true;
                        });
                        rustplus.sendTeamMessage('[Sentry bot] switch ' + args[0] + ' offline');
                        return message.react("✅")
                    }
                }
            });
        } else {
            return message.reply("!toggle name off|on");
        }
    } else if (command === "gtoggle") {
        if (args.length < 2) {
            if (args[1] === 'on') {
                rustplus.sendTeamMessage('[Sentry bot] group ' + args[0] + 'online');
            } else if (args[1] === 'off') {
                rustplus.sendTeamMessage('[Sentry bot] group ' + args[0] + 'offline');
            }
        } else {
            return message.reply("!toggle group off|on");
        }
    }
})
;

client.login(config.BOT_TOKEN);

const app = express();
const port = 3000;
const server = app.listen(port);

var expoPushToken = null;
var steamAuthToken = null;

async function run() {

    console.log("Registering with FCM");
    const credentials = await register('976529667804');

    console.log("Fetching Expo Push Token");
    axios.post('https://exp.host/--/api/v2/push/getExpoPushToken', {
        deviceId: uuidv4(),
        experienceId: '@facepunch/RustCompanion',
        appId: 'com.facepunch.rust.companion',
        deviceToken: credentials.fcm.token,
        type: 'fcm',
        development: false,
    }).then(async (response) => {

        expoPushToken = response.data.data.expoPushToken;
        console.log("Received Expo Push Token: " + expoPushToken);

        // register callback
        app.get('/callback', (req, res) => {

            steamAuthToken = req.query.token;

            if (steamAuthToken) {

                console.log("Steam Account Connected.");
                res.send('Steam Account successfully linked with rustplus.js, you can now close this window and go back to the console.');

                // register with Rust Companion API
                console.log("Registering with Rust Companion API");
                axios.post('https://companion-rust.facepunch.com:443/api/push/register', {
                    AuthToken: steamAuthToken,
                    DeviceId: 'rustplus.js',
                    PushKind: 0,
                    PushToken: expoPushToken,
                }).then((response) => {
                    console.log("Successfully registered with Rust Companion API.");
                    console.log("When you Pair with Servers or Smart Devices in game, notifications will appear here.");
                }).catch((error) => {
                    console.log("Failed to register with Rust Companion API");
                    console.log(error);
                });

            } else {
                res.send('token missing from request!');
            }

        });

        // ask user to login with steam
        console.log("Please open the following URL in your browser to link your Steam Account with rustplus.js");
        console.log("https://companion-rust.facepunch.com/login?returnUrl=" + encodeURIComponent(`http://localhost:${port}/callback`));

        console.log("Listening for FCM Notifications");

        let init = false;

        await listen(credentials, ({notification, persistentId}) => {
            // parse notification body
            const body = JSON.parse(notification.data.body);

            if (!init) {
                rustplus = new RustPlus(config.SERVER_IP, config.SERVER_PORT, body.playerId, body.playerToken);
                rustplus.on('connected', () => {
                    rustplus.sendTeamMessage('[Sentry bot] online');
                });
                init = true;
            }
            if (body.type === 'entity') {
                client.channels.cache.get(config.PAIR_CHANNEL_ID).send('Pair request for ' + body.entityName + ' with entity ID ' + body.entityId + '. Use "' + prefix + 'pair ' + body.entityId + ' name group" command.');
            }
        });

    }).catch((error) => {
        console.log("Failed to fetch Expo Push Token");
        console.log(error);
    });

}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {

    // unregister with Rust Companion API
    if (steamAuthToken) {
        console.log("Unregistering from Rust Companion API");
        await axios.delete('https://companion-rust.facepunch.com:443/api/push/unregister', {
            data: {
                AuthToken: steamAuthToken,
                PushToken: expoPushToken,
                DeviceId: 'rustplus.js',
            },
        }).then((response) => {
            console.log("Successfully unregistered from Rust Companion API");
        }).catch((error) => {
            console.log(error);
        });
    }

    // stop http server
    server.close(() => {
        process.exit(0);
    });

}

run();



