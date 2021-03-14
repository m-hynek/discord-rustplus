const Rust = require('@liamcottle/rustplus.js');

class Factory {
    rustplus;

    init(ip, port, playerId, playerToken) {
        this.rustplus = new Rust(ip, port, playerId, playerToken);
    }

    get() {
        return this.rustplus;
    }
}

module.exports = {
    name: 'rustplus',
    description: 'in game events',
    factory: new Factory
}

