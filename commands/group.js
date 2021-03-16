const helpers = require("../modules/helpers");
const md = require("../md.json");
const rust = require("../modules/rust");

module.exports = {
    name: 'group',
    description: 'grouping switches',
    execute(msg, args) {
        let command = args[0];
        let arg = args[1];
        let json = helpers.readJson();

        if (command === "set") {
            json.groups[arg] = [];
            if (args.length > 2) {
                let strArray = args[2].split(",");
                json.groups[arg] = [];
                strArray.forEach(item => {
                    json.groups[arg].push(item);
                });
                helpers.writeJsonToFile(json);
                return msg.react(md.OK);
            }else {
                msg.reply(md.CODE + "!group set name device1,device2,..deviceN"+ md.CODE);
            }

        } else if (command === "enable" && args.length === 2) {
            json.groups[arg].forEach(item => {
                let promise = helpers.getDeviceByName(item);
                promise.then(item => {
                    rust.factory.get().turnSmartSwitchOn(item.id, (message) => {
                        console.log("turnSmartSwitchOn response message: " + JSON.stringify(message));
                        return true;
                    });
                });
            });
            return msg.react(md.OK);
        } else if (command === "disable" && args.length === 2) {
            json.groups[arg].forEach(item => {
                let promise = helpers.getDeviceByName(item);
                promise.then(item => {
                    rust.factory.get().turnSmartSwitchOff(item.id, (message) => {
                        console.log("turnSmartSwitchOff response message: " + JSON.stringify(message));
                        return true;
                    });
                });
            });
            return msg.react(md.OK);
        } else if (args.length === 0) {
            let text = md.CODE;
            Object.keys(json.groups).forEach((key) => {
                text += "[" + key + "]\n";
                text += json.groups[key].join(',');
            });
            return msg.reply(text + md.CODE);
        } else {
            return msg.reply(md.CODE + "!group set|add|enable|disable name [device1,device2:..]" + md.CODE);
        }
    },
}
;