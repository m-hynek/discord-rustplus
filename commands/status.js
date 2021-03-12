const helpers = require("../modules/helpers");
const rust = require("../modules/rust");
const discord = require("../modules/discord");

module.exports = {
    name: 'status',
    description: 'Shows status of tc, storage or switch.',
    execute(msg, args) {
        if (args.length < 1) {
            return msg.reply("!status tc|storage|switch");
        } else if (args[0] === "tc") {
            let cache = helpers.readJson();
            if (!cache.devices.length) {
                discord.client.channels.cache.get(config.PAIR_CHANNEL_ID).send("No TC Monitors found");
            }
            let info = "```";
            helpers.traverse(cache.devices, function (device) {
                if (device.type === 4) {
                    rust.factory.get().getEntityInfo(device.id, (message) => {
                        console.log("getEntityInfo response message: " + JSON.stringify(message));
                        let tcName = "[" + device.name + "]";
                        let protectionExpiry = message.response.entityInfo.payload.protectionExpiry;
                        let status = '';
                        if (protectionExpiry) {
                            let expireDate = new Date(protectionExpiry * 1000);
                            let protectionExpireIn = helpers.get_time_diff(expireDate);
                            status = "✅ Upkeep: " + protectionExpireIn;
                        } else {
                            status = "❌ Upkeep: decaying!";
                        }
                        let inventory = '';
                        if (message.response.entityInfo.payload.items.length) {
                            inventory += 'Inventory:\n';
                            helpers.traverse(message.response.entityInfo.payload.items, function (item) {
                                inventory += helpers.getItemName(item.itemId) + ' x ' + item.quantity;
                                if (item.itemIsBlueprint) {
                                    inventory += ' [blueprint]';
                                }
                                inventory += "\n";
                            });
                        }
                        info += tcName + "\n" + status + "\n" + inventory + "\n";
                        return true;
                    });
                }
            })
            setTimeout(function () {
                return msg.reply(info + "```");
            }, Math.random() * 3000);
        } else if (args[0] === "storage") {
            let cache = helpers.readJson();
            if (!cache.devices.length) {
                discord.client.channels.cache.get(config.PAIR_CHANNEL_ID).send("No Storage monitors found");
            }
            let inventory = {
                "tc": {},
                "storage": {
                    'blueprints': {}
                },
            };
            helpers.traverse(cache.devices, function (device) {
                if (device.type > 2) {
                    rust.factory.get().getEntityInfo(device.id, (message) => {
                        console.log("getEntityInfo response message: " + JSON.stringify(message));
                        helpers.traverse(message.response.entityInfo.payload.items, function (item) {
                            if (item.itemIsBlueprint) {
                                if (!inventory.storage.blueprints[item.itemId]) {
                                    inventory.storage.blueprints[item.itemId] = 0;
                                }
                                inventory.storage.blueprints[item.itemId] += item.quantity;
                            } else if (device.type === 4) {
                                if (!inventory.tc[item.itemId]) {
                                    inventory.tc[item.itemId] = 0;
                                }
                                inventory.tc[item.itemId] += item.quantity;
                            } else {
                                if (!inventory.storage[item.itemId]) {
                                    inventory.storage[item.itemId] = 0;
                                }
                                inventory.storage[item.itemId] += item.quantity;
                            }
                        });
                    });
                }
            });console.log(inventory);

            setTimeout(function () {
                let text = '```[All TC inventory]\n';
                Object.keys(inventory.tc).forEach(key => {
                    text += helpers.getItemName(key) + ' x ' + inventory.tc[key] + '\n';
                });
                text += '\n[All boxes and vending machines inventory]\n';
                let bptext = '';
                Object.keys(inventory.storage).forEach(key => {
                    if (key === 'blueprints') {
                        Object.keys(inventory.storage.blueprints).forEach(key => {
                            bptext += helpers.getItemName(key) + ' [blueprint] x ' + inventory.storage.blueprints[key] + '\n';
                        });
                    } else {
                        text += helpers.getItemName(key) + ' x ' + inventory.storage[key] + '\n';
                    }
                });
                text += '\n' + bptext + '```';
                return msg.reply(text);
            }, Math.random() * 3000);
        }
    },
};