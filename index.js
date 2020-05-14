const Discord = require('discord.js');
const client = new Discord.Client();

// Retrieve bot token using envy
const envy = require('envy');
const token = envy().token;

let playerList = [];
let captainList = [];

const prefix = '!';

// A new way to manipulate an array into a string, for better readability
function concatArray(arr) {
    let s = "";
    arr.forEach(function (v, n) {
        s = s + v
        if (arr.length > n + 1) s = s + ', '
    });
    return s;
}

// convert id to Discord user mentionable 
function convertIdToTag(id) {
    return client.users.cache.get(id).toString();
};

//abstracting addPlayer will let us use it in other scenarios, esp. automated testing.
function addPlayer(player, msg = undefined) {
    if (playerList.includes(player)) {
        if (msg != undefined) {
            msg.reply(`You are already queued up! If you would like to leave, please use ${prefix}leave`);
        };
        return [...playerList];
    };
    if (msg != undefined) msg.reply('You were added to the queue!')
    return [...playerList, player];
};

//abstracting join lets us edit and see it easier, instead of inside the tangle of ifs in the callback. 
function join(msg) {
    if (playerList.length >= (captainList.length * 2)) {
        msg.reply('The queue is currently full.');
        return [...playerList];
    };
    msg.reply('Adding you to the queue...');
    return addPlayer(msg.author.id, msg);
};

//abstracting addCaptain will let us use it in other scenarios, esp. automated testing
function addCaptain(captainSnowflake) {
    if (captainList.includes(captainSnowflake)) {
        console.log('Attempted to add captain already in list.');
        return [...captainList];
    };
    return [...captainList, captainSnowflake]
};

function addCaptains(msg) {
    const captains = msg.mentions.users;
    if (captains.size > 0) {
        captains.forEach(function (obj, snowflake) {
            captainList = addCaptain(snowflake);
        });
        const s = [];
        captainList.forEach(function (n) {
            s.push(convertIdToTag(n))
        });
        msg.reply(`The captain list is now: ${concatArray(s)}`)
        return
    };
    msg.reply('Please mention the users you want to add as captains after the command. Example: ```!addcaptains @user1 @user2```');

};

function removeCaptains(msg) {
    const captains = msg.mentions.users;
    if (captains.size > 0) {
        captains.forEach(function (obj, snowflake) {
            captainList = removeCaptain(snowflake);
        });
        const s = [];
        captainList.forEach(function (n) {
            s.push(convertIdToTag(n))
        });

        if (captainList.length === 0) {
            msg.reply('The captain list is now empty.')
        } else {
            msg.reply(`The captain list is now: ${concatArray(s)}`)
        };
        return;
    };

    msg.reply('Please mention the users you want to add as captains after the command. Example: ```!removecaptains @user1 @user2```');
};

//abstracting addCaptain will let us use it in other scenarios, esp. automated testing
function removeCaptain(captainSnowflake) {
    const snowflakeIndex = captainList.indexOf(captainSnowflake);

    if (snowflakeIndex === -1) {
        console.log('Attempted to remove captain not in the list.');
        return [...captainList];
    };

    captainList.splice(snowflakeIndex, 1)
    return [...captainList];
};


// Returns true if the author of the message is privileged
function isAuthorizedMessage(msg) {
    return ('member' in msg) && msg.member.hasPermission('ADMINISTRATOR');
}

client.login(token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function distribute() {
    // TO-DO
}

client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'join') {
        playerList = join(msg);
        console.log(playerList);
    }

    if (command === 'addcaptains') {
        if (!isAuthorizedMessage(msg)) {
            return;
        }
        addCaptains(msg);
        console.log(captainList);
    }

    if (command === 'removecaptains') {
        if (!isAuthorizedMessage(msg)) {
            return;
        }
        removeCaptains(msg);
        console.log(captainList)
    }

    if (command === 'distribute') {
        if (!isAuthorizedMessage(msg)) {
            return;
        }
        distribute();
    }
});

