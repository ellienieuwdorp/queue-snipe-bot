const Discord = require('discord.js');
const client = new Discord.Client();

// Retrieve bot token using envy
const envy = require('envy');
const token = envy().token;

let playerList = [];
let captainList = [];

const prefix = '!';

//abstracting addPlayer will let us use it in other scenarios, esp. automated testing.
function addPlayer(player, msg = undefined) {
    if (playerList.includes(player)) {
        if (msg != undefined) { msg.reply(`You are already queued up! If you would like to leave, please use ${prefix}leave`); };
        return [...playerList];
    };
    return [...playerList, player];
};

//abstracting join lets us edit and see it easier, instead of inside the tangle of ifs in the callback. 
function join(msg) {
    if (playerList.length >= (captainList.length * 2)) {
        msg.reply('The queue is currently full.');
        return [...playerList];
    }
    msg.reply('Adding you to the queue...');
    return addPlayer(msg.author.id);
};

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'join') {
        playerList = join(msg);
        console.log(playerList);
    }

    if (command === 'addcaptains') {
        const mentionedUsers = msg.mentions.users;
        if (mentionedUsers.size === 0) {
            msg.reply('please mention the users you want to add as captains after the command. Example: ```!addcaptains @user1 @user2```');
        }
        if (mentionedUsers.size > 0) {
            let usersString = "";
            mentionedUsers.forEach(function(user) {
                usersString += (user.username + " ");
                captainList.push(user);
            });

            msg.reply('the following users have been added to the list of captains: ' + usersString)
        }
    }

    if (command === 'removecaptain') {
        const indexOfCaptain = captainList.indexOf(msg.mentions.users.first())
        if (indexOfCaptain === -1) {
            msg.reply('captain was not removed because they were not on the list of team captains.')
        }
        if (indexOfCaptain !== -1) {
            let removedCaptain = captainList.splice(indexOfCaptain);
            msg.reply(removedCaptain.username + " has been removed from the list of team captains")
        }
    }

    if (command === 'distribute') {
        // TO-DO
    }
});

