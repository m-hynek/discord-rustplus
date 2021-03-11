import {rustplus} from "../modules/rustplus";

module.exports = {
    name: 'gtoggle',
    description: 'Toggle group of switches on or off',
    execute(msg, args) {
        if (args.length < 2) {
            if (args[1] === 'on') {
                rustplus.sendTeamMessage('[Sentry bot] group ' + args[0] + 'online');
            } else if (args[1] === 'off') {
                rustplus.sendTeamMessage('[Sentry bot] group ' + args[0] + 'offline');
            }
        } else {
            return msg.reply("!toggle group off|on");
        }
    },
};