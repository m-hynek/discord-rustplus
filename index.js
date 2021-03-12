const config = require("./config.json");
const discord = require("./modules/discord");
const pairing = require("./modules/pairing");

discord.client.on('message', msg => {
    discord.handleMessage(msg);
});

discord.client.login(config.BOT_TOKEN);

process.on('SIGTERM', pairing.shutdown);
process.on('SIGINT', pairing.shutdown);

pairing.run();



