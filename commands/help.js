const md = require("../md.json");

module.exports = {
    name: 'help',
    description: 'Help!',
    execute(msg, args) {
        msg.reply(md.CODE + 'commands:\n' +
            '!help - this command\n' +
            '!add id name - pair a device with bot\n' +
            '!chat - send message to team chat\n' +
            '!chuck - send CN fact to team chat\n' +
            '!devices - prints devices and initializes communication with them\n' +
            '!group - not implemented\n' +
            '!inventory - print inventory report \n' +
            '!tc - print upkeep report\n' +
            '!switch enable!disable name - control switch by name\n'
            + md.CODE);
    },
};