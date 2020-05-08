const Discord = require('discord.js');
const client = new Discord.Client();

// Retrieve bot token using envy
const envy = require('envy');
const token = envy().token;

const commandPrefix = '!'

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === commandPrefix + 'ping') {
        msg.reply('Pong!');
    }
});

