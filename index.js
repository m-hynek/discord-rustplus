import {run, shutdown} from "./modules/pairing";
import {handleMessage} from "./modules/discord";
import {Client as client} from "discord.js";

const config = require("./config.json");

client.on('message', msg => {
    handleMessage(msg);
});

client.login(config.BOT_TOKEN);

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

run();



