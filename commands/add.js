const helpers = require("../modules/helpers");
const rust = require("../modules/rust");
const md = require("../md.json");

function process(args, msg) {
    let id = args[0];
    let name = args[1];

    if (isNaN(parseInt(id))) {
        return msg.reply("Invalid entity ID - " + id + ". Pair device in-game to get its entity ID");
    }

    try {
        rust.factory.get().getEntityInfo(id, message => {
            console.log("getEntityInfo response message: " + JSON.stringify(message));
            if (message.response.error) {
                return msg.reply(md.CODE + "Entity " + id + "not found");
            }
            let type = helpers.getType(message);
            helpers.pairDevice(id, type, name);
            return msg.react(md.OK);
        });
    } catch (err) {
        console.log(err);
        return msg.reply("Failed to get device info. Is bot online?");
    }
}

module.exports = {
    name: 'add',
    description: 'add device to discord bot json',
    execute(msg, args) {
        if (args.length !== 2) {
            return msg.reply(`!add id name`);
        } else {
            return process(args, msg);
        }
    },
};