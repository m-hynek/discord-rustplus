const get = require('simple-get');
const rust = require("../modules/rust");
const md = require("../md.json");
const config = require("../config.json");

module.exports = {
    name: 'chuck',
    description: '',
    execute(msg, args) {
        get.concat({
            url: 'https://api.chucknorris.io/jokes/random',
            json: true
        }, (err, res, data) => {
            if (err) {
                console.log(err);
                return msg.reply("Error")
            }
            rust.sendTeamMessage(data.value, () => {
                return msg.react(md.OK);
            }, config.BOT_NAME);
        });
    }
}