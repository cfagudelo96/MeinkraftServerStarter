const Discord = require('discord.js')
const puppeteerScript = require('./puppeteer-script')

const client = new Discord.Client();

const prefix = '!';

process.on('uncaughtException', function (err) {
  console.log('Uncaught exception!');
  console.error(err);
});

client.on('message', async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'start') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply('Initializing minecraft server!');
    try {
      await puppeteerScript.launchServer();
      message.reply('Ok I clicked the button to start the server! Now we wait...');
    } catch(error) {
      if (error === puppeteerScript.SERVER_ON_EXCEPTION) {
        message.reply('The server is already on you dumb dumb...');
      } else {
        message.reply(`I fucked up and couldn't start the server, please ask mama poof for help...`);
      }
    }
  } else if (command === 'status') {
    try {
      status = await puppeteerScript.getStatus();
      if (status === puppeteerScript.STATUS_ON) {
        message.reply('The server is up, go have some fun!');
      } else if (status === puppeteerScript.STATUS_OFF) {
        message.reply('The server is now offline, try turning it on using me~');
      } else if (status === puppeteerScript.STATUS_LOADING) {
        message.reply(`The server is loading, don't rush me or I'll bap you`);
      } else if (status === puppeteerScript.UNKNOWN_STATUS) {
        message.reply('Ok I have no idea what is the server status right now, call poof for help!');
      }
    } catch(error) {
      message.reply(`I fucked up and I didn't check the server status, please ask mama poof for help...`);
    }
  }
});

client.login(process.env.BOT_TOKEN);
