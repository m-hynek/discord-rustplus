const Discord = require("discord.js");
const prefix = "!";
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require("fs");

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`); //what the hell
    client.commands.set(command.name, command);
}

exports.prefix = prefix;
exports.client = client;
exports.handleMessage = (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    console.log(`Called command: ${command}`);
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(msg, args);
    } catch (error) {
        console.log(error);
        return msg.reply('there was an error trying to execute that command!');
    }
}