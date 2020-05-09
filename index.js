const Discord = require('discord.js');
const client = new Discord.Client();

// Retrieve bot token using envy
const envy = require('envy');
const token = envy().token;

let playerList = [];
let captainList = [];

const prefix = '!'

// Role that is authorized to call privileged commands
const authorizedRole = 'Mods';

// Returns true if the author of the message is privileged
function isAuthorizedMessage(msg) {
    if('member' in msg) {
        if(msg.member.roles.cache.find(r => r.name === authorizedRole)) {
            return true;
        }
    }
    return false;
}

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'join') {
        playerList.push(msg.author)
        msg.reply('you have been added to player pool.')
    }

    if (command === 'addcaptains') {
        if(isAuthorizedMessage(msg)) {

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

        } else {
            msg.reply('You are not authorized to run this command');
        }
    }

    if (command === 'removecaptain') {
        if(isAuthorizedMessage(msg)) {
            const indexOfCaptain = captainList.indexOf(msg.mentions.users.first())
            if (indexOfCaptain === -1) {
                msg.reply('captain was not removed because they were not on the list of team captains.')
            }
            if (indexOfCaptain !== -1) {
                let removedCaptain = captainList.splice(indexOfCaptain);
                msg.reply(removedCaptain.username + " has been removed from the list of team captains")
            }

        } else {
            msg.reply('You are not authorized to run this command');
        }
    }

    if (command === 'distribute') {
        // TO-DO
    }
});

