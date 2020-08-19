const Discord = require('discord.js');
const client = new Discord.Client();

// Retrieve bot token using envy
const envy = require('envy');
const token = envy().botToken;

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

// convert id to Discord channel nickname
function convertIdToNick(id) {
    return client.users.cache.get(id).tag;
}

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
// The following is messy, but we need a mvp, so here we go
// The function to distribute players to captains; recursive, so if it is not out of players, it can keep going
function distributePlayers(msg, captains) {
    captains.forEach(function(v){
        if (v.length < 2) {
            v.push(...playerList.splice(Math.floor(Math.random() * playerList.length)));
        }
    });
    console.log(captains)
    if (playerList.length > 0) {
        distributePlayers(msg, captains)
    } else {
        let mstr = '```'
        let i = 1
        captains.forEach(function(v, k) {
            mstr = mstr + `Team ${i}: ${convertIdToNick(k)}, `;
            console.log(`Made it here with ${mstr}`)
            v.forEach(function(player, i) {
                console.log(`Adding player ${convertIdToNick(player)}`)
                mstr = mstr + `${convertIdToNick(player)}`
                if (i < v.length-1) {mstr = mstr + ','};
                mstr = mstr + ' ';
            }); 
            console.log(v); 
            mstr = mstr + '\n';
            i++;
        })
        console.log(mstr)
        msg.reply(mstr + '```')
    }
}

function distribute(msg) {
    let captains = new Map();
    captainList.forEach(function(v) {
        captains.set(v, [])
    });
    distributePlayers(msg, captains)
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
        console.log('Distributing players, prepare yourself...')
        distribute(msg);
    }
});

