const Discord = require('./node_modules/discord.js')
const puppeteerScript = require('./puppeteer-script')

const client = new Discord.Client();

const prefix = "!";

client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "start") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`initializing minecraft server!`);
        puppeteerScript.launchServer();
    }
});

client.login("TOKEN");