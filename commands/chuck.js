const get = require('simple-get');
const rust = require("../modules/rust");
const md = require("../md.json");
const config = require("../config.json");
const helpers = require("../modules/helpers");

module.exports = {
    name: 'chuck',
    description: '',
    execute(msg, args) {
        if (!args.length) {
            this.sendJoke(() => {
                return msg.react(md.OK);
            }, err => {
                return msg.reply("Error");
            });
        } else if (args.length === 2 && args[0] === "bind") {
            let cache = helpers.readJson();
            let promise = helpers.getDeviceByName(args[1]);
            promise.then(() => {
                cache.chuck = args[1];
                helpers.writeJsonToFile(cache);
                return msg.react(md.OK);
            }).catch(() => {
                return msg.reply(md.CODE + "Alarm : " + args[1] + " not found");
            });
        }
    },
    sendJoke(callback, error) {
        get.concat({
            url: 'https://api.chucknorris.io/jokes/random',
            json: true
        }, (err, res, data) => {
            if (err) {
                console.log(err);
                error(err);
            }
            rust.sendTeamMessage(data.value, config.BOT_NAME, () => {
                callback();
            });
        });
    },
}