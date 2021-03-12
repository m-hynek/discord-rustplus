const config = require("../config.json");
const rust = require("./rust");
const discord = require("./discord");
let expoPushToken = null;
let steamAuthToken = null;
const {v4: uuidv4} = require('uuid');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const server = app.listen(port);
const {register, listen} = require('push-receiver');

module.exports = {
    name: 'pairing',
    description: 'Listen to server and device pairing events.',
    async run() {
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
                    res.send('Steam Account successfully linked with rust.js, you can now close this window and go back to the console.');

                    // register with Rust Companion API
                    console.log("Registering with Rust Companion API");
                    axios.post('https://companion-rust.facepunch.com:443/api/push/register', {
                        AuthToken: steamAuthToken,
                        DeviceId: 'rust.js',
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
            console.log("Please open the following URL in your browser to link your Steam Account with rust.js");
            console.log("https://companion-rust.facepunch.com/login?returnUrl=" + encodeURIComponent(`http://localhost:${port}/callback`));

            console.log("Listening for FCM Notifications");

            let initialized = false;

            await listen(credentials, ({notification, persistentId}) => {
                // parse notification body
                const body = JSON.parse(notification.data.body);

                if (!initialized) {
                    rust.factory.init(config.SERVER_IP, config.SERVER_PORT, body.playerId, body.playerToken);
                    let rustplus = rust.factory.get();
                    rustplus.on('connected', () => {
                        rustplus.sendTeamMessage('[Sentry bot] online');
                    });
                    initialized = true;
                }
                if (body.type === 'entity') {
                    discord.client.channels.cache.get(config.PAIR_CHANNEL_ID)
                        .send(
                            '```In-game pair request for ' + body.entityName + ' with entity ID ' + body.entityId + '.\n' +
                            'Use following command to pair it with bot:\n' +
                            discord.prefix + 'add ' + body.entityId + ' name```'
                        );
                }
            });

        }).catch((error) => {
            console.log("Failed to fetch Expo Push Token");
            console.log(error);
        });

    },
    async shutdown() {

        // unregister with Rust Companion API
        if (steamAuthToken) {
            console.log("Unregistering from Rust Companion API");
            await axios.delete('https://companion-rust.facepunch.com:443/api/push/unregister', {
                data: {
                    AuthToken: steamAuthToken,
                    PushToken: expoPushToken,
                    DeviceId: 'rust.js',
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
};
