const discord = require("./modules/bot");
const pairing = require("./modules/pairing");

discord.client.on('message', msg => {
    discord.handleMessage(msg);
});

process.on('SIGTERM', pairing.shutdown);
process.on('SIGINT', pairing.shutdown);

pairing.run();



