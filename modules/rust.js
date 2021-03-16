const Rust = require('@liamcottle/rustplus.js');
const config = require('../config.json');
const helpers = require('../modules/helpers');

module.exports = {
    name: 'rustplus',
    description: 'in game events',
    factory: new class Factory {
        rustplus;

        init(ip, port, playerId, playerToken) {
            this.rustplus = new Rust(ip, port, playerId, playerToken);
        }

        get() {
            return this.rustplus;
        }
    },
    sendTeamMessage(textOriginal, callback, name) {
        let chunks = helpers.chunkString(textOriginal, 125 - name.length);
        let promise = new Promise(resolve => {
            chunks.forEach((chunk, i) => {
                let text = "[" + name  + "] " + chunk;
                module.exports.factory.get().sendTeamMessage(text, message => {
                    console.log('message sent - ' + text);
                    console.log(message);
                    if(i === chunks.length -1) {
                        resolve();
                    }
                });
            });
        });
        promise.then(() => {
            callback();
        });
    }
}

