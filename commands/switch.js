const helpers = require("../modules/helpers");
const rust = require("../modules/rust");

module.exports = {
    name: 'switch',
    description: 'Set switch on or off',
    execute(msg, args) {
        if (args.length >= 2) {
            let cache = helpers.readJson();
            helpers.traverse(cache.devices, function (device) {
                if (device.name === args[1]) {
                    if (args[0] === 'enable') {
                        rust.factory.get().turnSmartSwitchOn(device.id, (message) => {
                            console.log("turnSmartSwitchOn response message: " + JSON.stringify(message));
                            return true;
                        });
                        rust.factory.get().sendTeamMessage('[Sentry bot] switch ' + args[1] + ' online');
                        return msg.react("✅")
                    } else if (args[1] === 'disable') {
                        rust.factory.get().turnSmartSwitchOff(device.id, (message) => {
                            console.log("turnSmartSwitchOff response message: " + JSON.stringify(message));
                            return true;
                        });
                        rust.factory.get().sendTeamMessage('[Sentry bot] switch ' + args[1] + ' offline');
                        return msg.react("✅")
                    }
                }
            });
        } else {
            msg.reply("!switch name enable|disable");
        }
    },
};

