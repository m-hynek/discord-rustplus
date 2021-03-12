const helpers = require("../modules/helpers");
const rust = require("../modules/rust");

module.exports = {
    name: 'pair',
    description: 'Pair device with discord bot',
    execute(msg, args) {
        if (args.length < 3) {
            return msg.reply(`!pair id name group`);
        } else {
            let id = args[0];
            let name = args[1];
            let group = args[2];
            let type = '';
            rust.factory.get().getEntityInfo(id, (message) => {
                console.log("getEntityInfo response message: " + JSON.stringify(message));
                type = helpers.getType(message);
                helpers.updateJson(id, type, name, group);
                return true;
            });
            return msg.react("✅");
        }
    },
};