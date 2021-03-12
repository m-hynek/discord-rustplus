const rust = require("../modules/rust");

module.exports = {
    name: 'gtoggle',
    description: 'Toggle group of switches on or off',
    execute(msg, args) {
        if (args.length < 2) {
            return msg.reply("!gtoggle group off|on");
        } else {
            if (args[1] === 'on') {
                rust.factory.get().sendTeamMessage('[Sentry bot] group ' + args[0] + 'online');
            } else if (args[1] === 'off') {
                rust.factory.get().sendTeamMessage('[Sentry bot] group ' + args[0] + 'offline');
            }
        }
    },
};