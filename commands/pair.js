import {getType, updateJson} from "../modules/helpers";
import {rustplus} from "../modules/rustplus";

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
            rustplus.getEntityInfo(id, (message) => {
                console.log("getEntityInfo response message: " + JSON.stringify(message));
                type = getType(message);
                updateJson(id, type, name, group);
                return true;
            });
            return msg.react("✅");
        }
    },
};