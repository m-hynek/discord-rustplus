const rust = require("../modules/rust");
const helpers = require("../modules/helpers");
const md = require("../md.json");

let text = md.CODE;

function getState(message) {
    let stateEmoji = '';
    if (message.response.error) {
        return [md.MISSING, '[no response]'];
    } else if (message.response.entityInfo.type === 3) {
        stateEmoji = message.response.entityInfo.payload.capacity === 0 ? md.OFFLINE : md.ONLINE;
    } else {
        stateEmoji = message.response.entityInfo.payload.value ? md.ONLINE : md.OFFLINE;
    }
    return [stateEmoji, stateEmoji === md.ONLINE ? '[on]' : '[off]'];
}

module.exports = {
    name: 'devices',
    description: 'Shows paired devices, inits connection. No status request.',
    execute(msg, args) {
        const devices = helpers.readJson();
        if (!Object.keys(devices.devices).length) {
            return msg.reply('No devices added.');
        }
        try {
            let promise =new Promise(resolve => {
                Object.keys(devices.devices).forEach((key, i) => {
                    let item = devices.devices[key];
                    rust.factory.get().getEntityInfo(item.id, (message) => {
                        console.log("getEntityInfo response message: " + JSON.stringify(message));
                        let state = getState(message);
                        text += state[0] + "[" + item.name + ']' + state[1] + '[' +
                            item.id + '][' + helpers.getTypeName(item.type) + ']\n';
                        if (i === (Object.keys(devices.devices).length - 1)) {
                            resolve();
                        }
                    });
                });
            });
            promise.then(() => {
                return msg.reply(text + md.CODE);
            });
        } catch (err) {
            console.log(err);
        }
    },
};