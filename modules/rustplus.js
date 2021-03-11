const RustPlus = require('@liamcottle/rustplus.js');
let rustplus;

module.exports = {
    name: 'rustplus',
    description: 'in game events',
    init(ip, port, playerId, playerToken) {
        rustplus = new RustPlus(ip, port, playerId, playerToken);
        rustplus.on('connected', () => {
            rustplus.sendTeamMessage('[Sentry bot] online');
        });
    },
    rustplus,
}