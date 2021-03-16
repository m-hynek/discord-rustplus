const bot = require("../modules/bot");
const helpers = require("../modules/helpers");
const md = require("../md.json");
const config = require("../config.json");
const rust = require("../modules/rust");

function getStatus(protectionExpiry) {
    let status = '';
    if (protectionExpiry) {
        let expireDate = new Date(protectionExpiry * 1000);
        let protectionExpireIn = helpers.getTimeDifference(expireDate);
        status = md.ONLINE + " Upkeep: " + protectionExpireIn;
    } else {
        status = md.MISSING + " Upkeep: decaying!";
    }
    return status;
}

function getTcInventory(inventory, message) {
    inventory += 'Inventory:\n';
    let stock = {}
    message.response.entityInfo.payload.items.forEach(item => {
        if (!stock[item.itemId]) {
            stock[item.itemId] = 0;
        }
        stock[item.itemId] += item.quantity;
    });
    Object.keys(stock).forEach((key, i) => {
        inventory += helpers.getItemName(key) + ' x ' + stock[key] + "\n";
    });
    return inventory;
}

function buildTcReport(device, message) {
    let tcName = "[" + device.name + "]";
    let protectionExpiry = message.response.entityInfo.payload.protectionExpiry;
    let status = getStatus(protectionExpiry);
    let inventory = '';
    if (message.response.entityInfo.payload.items.length) {
        inventory = getTcInventory(inventory, message);
    }
    return tcName + "\n" + status + "\n" + inventory + "\n";
}

function execute(msg) {
    let cache = helpers.readJson();
    if (!Object.keys(cache.devices).length) {
        bot.client.channels.cache.get(config.PAIR_CHANNEL_ID).send("No TC Monitors found");
    }
    let info = md.CODE;
    let slowCount = 0;
    let cnt = 0;
    let promise = new Promise(resolve => {
        Object.keys(cache.devices).forEach((item, i) => {
            let device = cache.devices[item];
            if (device.type === 4) {
                cnt++;
                rust.factory.get().getEntityInfo(device.id, message => {
                    console.log("getEntityInfo response message: " + JSON.stringify(message));
                    info += buildTcReport(device, message, info);
                    slowCount++
                    if (slowCount === cnt) {
                        resolve();
                    }
                });
            }
        });
    });
    promise.then(() => {
        return msg.reply(info + md.CODE);
    });
}

module.exports = {
    name: 'tc',
    description: 'Shows status of tc',
    execute(msg, args) {
        execute(msg);
    },
};