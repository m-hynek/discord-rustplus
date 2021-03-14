const config = require("../config.json");
const rust = require("../modules/rust");
const md = require("../md.json");
const get = require('simple-get');

function chunkString(str, len) {
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

module.exports = {
    name: 'chuck',
    description: '',
    execute(msg, args) {
        get.concat({
            url: 'https://api.chucknorris.io/jokes/random',
            json: true
        }, function (err, res, data) {
            if (err) {
                console.log(err);
                return msg.reply("Error")
            }
            let chunks = chunkString(data.value, 125 - config.BOT_NAME.length);
            chunks.forEach(chunk => {
                let text = "[" + config.BOT_NAME + "] " + chunk;
                rust.factory.get().sendTeamMessage(text, message => {
                    console.log('message sent - ' + text);
                    console.log(message);
                });
            });
            return msg.react(md.OK);

        })
    }
}