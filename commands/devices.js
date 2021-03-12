const helpers = require("../modules/helpers");

module.exports = {
    name: 'devices',
    description: 'Shows paired devices. No status request.',
    execute(msg, args) {
        let text = '```';
        let json = helpers.readJson();
        if (!json.devices.length) {
            msg.reply(JSON.stringify('No devices added.'));
        }
        helpers.traverse(json.devices, function (item) {
            text += item.id + ' - ' + item.name + ' - ' + helpers.getTypeName(item.type) + ' \n';
        });
        return msg.reply(text + '```');
    },
};