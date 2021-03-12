const helpers = require("../modules/helpers");
const rust = require("../modules/rust");
const discord = require("../modules/discord");

module.exports = {
    name: 'status',
    description: 'Shows status of tc, storage or switch.',
    execute(msg, args) {
        if (args.length < 1) {
            return msg.reply("!status tc|explo|mats|comp|switch");
        } else if (args[0] === "tc") {
            let cache = helpers.readJson();
            if (!cache.devices.length) {
                discord.client.channels.cache.get(config.PAIR_CHANNEL_ID).send("No TC found");
            }
            let info = "``` ";
            helpers.traverse(cache.devices, function (device) {
                if (device.type === 4) {
                    rust.factory.get().getEntityInfo(device.id, (message) => {
                        console.log("getEntityInfo response message: " + JSON.stringify(message));
                        info += device.name + "\n" + "hasProtection: " + message.response.entityInfo.payload.hasProtection + "\n" + "protectionExpiry: " + message.response.entityInfo.payload.protectionExpiry + "\n";
                        return true;
                    });
                }
            })
            setTimeout(function() {
                return msg.reply(info + "```");
            }, Math.random() * 2000);
        }
    },
};