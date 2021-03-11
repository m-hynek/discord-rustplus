module.exports = {
    name: 'devices',
    description: 'Shows paired devices. No status request.',
    execute(msg, args) {
        msg.reply(JSON.stringify(readJson()));
    },
};