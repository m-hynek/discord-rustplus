const rust = require("../modules/rust");
const md = require("../md.json")

module.exports = {
    name: 'chat',
    description: '',
    execute(msg, args) {
        rust.sendTeamMessage(args.join(" "), msg.member.user.username, () => {
            return msg.react(md.OK);
        });
    }
}