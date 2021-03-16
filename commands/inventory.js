const bot = require("../modules/bot");
const helpers = require("../modules/helpers");
const rust = require("../modules/rust");
const md = require("../md.json");
const config = require("../config.json");

function getItemQuantity(item, target) {
    let qty = item.quantity;
    let currentQty = target[item.itemId];
    if (currentQty) {
        qty += currentQty;
    }
    return qty;
}

function execute(msg) {
    let cache = helpers.readJson();
    if (!Object.keys(cache.devices).length) {
        bot.client.channels.cache.get(config.PAIR_CHANNEL_ID).send("No Storage monitors found");
    }
    let inventory = {
        "tc": {},
        "storage": {
            'blueprints': {}
        },
    };
    let count = 0;
    let cnt = 0;
    let promise = new Promise(resolve => {
        Object.keys(cache.devices).forEach((item, i) => {
            let device = cache.devices[item];
            if (device.type > 2) {
                rust.factory.get().getEntityInfo(device.id, (message) => {
                    console.log("getEntityInfo response message: " + JSON.stringify(message));
                    if (message.response.error) {
                        console.log('skipping');
                    } else {
                        count += Object.keys(message.response.entityInfo.payload.items).length;
                        Object.keys(message.response.entityInfo.payload.items).forEach((key) => {
                            item = message.response.entityInfo.payload.items[key];
                            if (item.itemIsBlueprint) {
                                inventory.storage.blueprints[item.itemId] = getItemQuantity(item, inventory.storage.blueprints);
                            } else if (device.type === 4) {
                                inventory.tc[item.itemId] = getItemQuantity(item, inventory.tc);
                            } else {
                                inventory.storage[item.itemId] = getItemQuantity(item, inventory.storage);
                            }
                            cnt++;
                            if (count === cnt) {
                                setTimeout(() => {
                                    resolve();
                                }, 600);

                            }
                        });
                    }
                });
            }
        });
    });
    promise.then(() => {
        let text = md.CODE + '[All TC inventory]\n';
        Object.keys(inventory.tc).forEach(key => {
            text += helpers.getItemName(key) + ' x ' + inventory.tc[key] + '\n';
        });
        text += '\n[All boxes and vending machines inventory]\n';
        let bptext = '';

        Object.keys(inventory.storage).forEach((key, i) => {
            if (key === 'blueprints') {
                Object.keys(inventory.storage.blueprints).forEach(key => {
                    bptext += helpers.getItemName(key) + ' [blueprint] x ' + inventory.storage.blueprints[key] + '\n';
                });
            } else {
                text += helpers.getItemName(key) + ' x ' + inventory.storage[key] + '\n';
            }
        });
        text += '\n' + bptext + md.CODE;
        return msg.reply(text);
    });
}

module.exports = {
    name: 'inventory',
    description: 'Shows inventory of tc, boxes or vending machines.',
    execute(msg, args) {
            execute(msg);
    },
};