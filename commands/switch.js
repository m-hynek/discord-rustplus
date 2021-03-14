const helpers = require("../modules/helpers");
const rust = require("../modules/rust");
const md = require("../md.json");

module.exports = {
    name: 'switch',
    description: 'Set switch on or off',
    execute(msg, args) {
        if (args.length > 1) {
            let toggle = args[0];
            let name = args[1];
            let cache = helpers.readJson();
            Object.keys(cache.devices).forEach((item, i) => {
                let device = cache.devices[item];
                if (device.name === name) {
                    if (toggle === 'enable') {
                        rust.factory.get().turnSmartSwitchOn(device.id, (message) => {
                            console.log("turnSmartSwitchOn response message: " + JSON.stringify(message));
                            return true;
                        });
                    } else if (toggle === 'disable') {
                        rust.factory.get().turnSmartSwitchOff(device.id, (message) => {
                            console.log("turnSmartSwitchOff response message: " + JSON.stringify(message));
                            return true;
                        });
                    }
                    return msg.react(md.OK)
                }
            });
        } else {
            msg.reply("!switch enable|disable name");
        }
    },
};

