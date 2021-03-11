module.exports = {
    name: 'toggle',
    description: 'Set switch on or off',
    execute(msg, args) {
        if (args.length >= 2) {
            let cache = readJson();
            traverse(cache.devices, function (device) {
                if (device.name === args[0]) {
                    if (args[1] === 'on') {
                        rustplus.turnSmartSwitchOn(device.id, (message) => {
                            console.log("turnSmartSwitchOn response message: " + JSON.stringify(message));
                            return true;
                        });
                        rustplus.sendTeamMessage('[Sentry bot] switch ' + args[0] + ' online');
                        return msg.react("✅")
                    } else if (args[1] === 'off') {
                        rustplus.turnSmartSwitchOff(device.id, (message) => {
                            console.log("turnSmartSwitchOff response message: " + JSON.stringify(message));
                            return true;
                        });
                        rustplus.sendTeamMessage('[Sentry bot] switch ' + args[0] + ' offline');
                        return msg.react("✅")
                    }
                }
            });
        } else {
            msg.reply("!toggle name off|on");
        }
    },
};

