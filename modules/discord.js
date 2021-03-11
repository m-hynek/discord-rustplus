const Discord = require("discord.js");
const prefix = "!";
const client = new Discord.Client();
client.commands = new Discord.Collection();
const botCommands = require('./commands');

module.exports = {
    name: 'discord',
    description: 'Discord bot',
    client,
    handleMessage(msg) {
        if (msg.author.bot) return;
        if (!msg.content.startsWith(prefix)) return;

        const args = msg.content.split(/ +/);
        const command = args.shift().toLowerCase();

        console.info(`Called command: ${command}`);

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(error);
            return msg.reply('there was an error trying to execute that command!');
        }
    }
}