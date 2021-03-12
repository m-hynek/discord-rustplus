const fs = require("fs");

module.exports = {
    name: 'helpers',
    description: 'some functions',
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
    updateJson(id, type, name) {
        let cache = module.exports.readJson();
        let device = {
            "id": id,
            "type": type,
            "name": name
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
        module.exports.writeJsonToFile(cache);
    },
    readJson() {
        let json = {devices: []};
        try {
            if (fs.existsSync("./devices.json")) {
                console.log('devices.json does exists');
                return require("../devices.json");
            } else {
                console.log('devices.json does not exists, creating...');
                fs.writeFile("./devices.json", JSON.stringify(json), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log('writing to ' + "devices.json");
                });
            }
        } catch (err) {
            console.log(err);
        }
        return json;
    },
    writeJsonToFile(json) {
        fs.writeFile("./devices.json", JSON.stringify(json), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(json));
            console.log('writing to ' + "devices.json");
        });
    }
}
;