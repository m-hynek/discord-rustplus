const fs = require("fs");
const items = require("../items.json");

module.exports = {
    name: 'helpers',
    description: 'some functions',
    getItemName(id) {
        return items[id].name;
    },
    getDeviceById(id) {
        let json = module.exports.readJson();
        return json.devices[id];
    },
    getDeviceByName(name) {
        return new Promise(resolve => {
            let json = module.exports.readJson();
            Object.keys(json.devices).forEach(key => {
                let item = json.devices[key];
                if (item.name === name) {
                    return resolve(item);
                }
            });
        });
    },
    getType(message) {
        if (message.response.entityInfo.type === 3) {
            if (message.response.entityInfo.payload.capacity === 24) {
                return 4;
            } else {
                return 3;
            }
        } else {
            return message.response.entityInfo.type;
        }
    },
    getTypeName(id) {
        let type = '';
        switch (id) {
            case 1:
                type = 'Smart Switch';
                break;
            case 2:
                type = 'Smart Alarm';
                break;
            case 3:
                type = 'Storage Monitor';
                break;
            case 4:
                type = 'TC Monitor';
                break;
            default:
                type = 'unknown';
        }
        return type;
    },
    pairDevice(id, type, name) {
        let cache = module.exports.readJson();
        let device = {
            "id": id,
            "type": type,
            "name": name,
        };
        console.log(id, cache.devices[id]);
        cache.devices[id] = device;
        module.exports.writeJsonToFile(cache);
    },
    readJson() {
        let json = {
            devices: {},
            groups: {},
            chuck: 0
        };
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
    },
    getTimeDifference(date) {
        let ms_diff = 0;
        let now = new Date()

        if (date < now) {
            ms_diff = now - date;
        } else {
            ms_diff = date - now;
        }

        let days = Math.floor(ms_diff / 1000 / 60 / (60 * 24));
        let date_diff = new Date(ms_diff);

        return days + " Days " +
            date_diff.getHours() + " Hours " +
            date_diff.getMinutes() + " Minutes ";
    },
    chunkString(str, len) {
        let input = str.trim().split(' ');
        let [index, output] = [0, []]
        output[index] = '';
        input.forEach(word => {
            let temp = `${output[index]} ${word}`.trim()
            if (temp.length <= len) {
                output[index] = temp;
            } else {
                index++;
                output[index] = word;
            }
        })
        return output
    }
};

