module.exports = {
    name: 'helpers',
    description: 'some modules',
    traverse(array, callback) {
        for (let i = 0; i < array.length; i++) {
            callback(array[i]);
        }
    },
    getType(message) {
        if (message.response.entityInfo.type === 3) {
            if (message.response.entityInfo.payload.capacity === 24) {
                return 4;
            } else {
                return 5;
            }
        } else {
            return message.response.entityInfo.type;
        }
    },
    updateJson(id, type, name, group = null) {
        let cache = readJson();
        let device = {
            "id": id,
            "type": type,
            "name": name,
            "group": group
        };
        if (cache.devices) {
            let add = true;
            for (let i = 0; i < cache.devices.length; i++) {
                if (cache.devices[i].id === id) {
                    cache.devices[i] = device;
                    add = false;
                }
            }
            if (add) {
                cache.devices.push(device);
            }
        } else {
            cache.devices = [device]
        }
        writeJsonToFile(cache);
    },
    readJson() {
        return require("./devices.json");
    },
    writeJsonToFile(json) {
        let fs = require("fs");
        fs.writeFile("./devices.json", JSON.stringify(json), "utf8", function () {
            console.log('devices.json saved')
        });
    }
};