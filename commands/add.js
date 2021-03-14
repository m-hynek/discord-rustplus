const helpers = require("../modules/helpers");
const rust = require("../modules/rust");
const md = require("../md.json");

module.exports = {
    name: 'add',
    description: 'add device to discord bot json',
    execute(msg, args) {
        if (args.length < 2) {
            return msg.reply(`!add id name`);
        } else {
            let id = args[0];
            let name = args[1];
            let type = '';
            try {
                rust.factory.get().getEntityInfo(id, message => {
                    console.log("getEntityInfo response message: " + JSON.stringify(message));
                    type = helpers.getType(message);
                    helpers.updateJson(id, type, name);
                    return msg.react(md.OK);
                });
            } catch (err) {
                console.log(err)
                return msg.reply("Failed to get device info. Is bot online?");
            }

        }
    },
};