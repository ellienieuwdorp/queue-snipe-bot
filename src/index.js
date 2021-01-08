const path = require('path');
const util = require('./util');
const client = util.client;

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['admin', 'admin commands'],
		['player', 'player commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

const envy = require('envy');
const token = envy().botToken;

client.login(token);

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
});

const playerList = [];
let captainList = [];

// A new way to manipulate an array into a string, for better readability
function concatArray(arr) {
	let s = '';
	arr.forEach(function(v, n) {
		s = s + v;
		if (arr.length > n + 1) s = s + ', ';
	});
	return s;
}


// abstracting addPlayer will let us use it in other scenarios, esp. automated testing.
function addPlayer(player, msg = undefined) {
	if (playerList.includes(player)) {
		if (msg != undefined) {
			msg.reply(
				'You are already queued up! If you would like to leave, please use !leave',
			);
		}
		return [...playerList];
	}
	if (msg != undefined) msg.reply('You were added to the queue!');
	return [...playerList, player];
}

function removePlayer(playerSnowflake) {
	const snowflakeIndex = playerList.indexOf(playerSnowflake);

	if (snowflakeIndex === -1) {
		console.log('Attempted to remove captain not in the list.');
		return [...playerList];
	}

	playerList.splice(snowflakeIndex, 1);
	return [...playerList];
}

// abstracting join lets us edit and see it easier, instead of inside the tangle of ifs in the callback.
function join(msg) {
	if (playerList.length >= captainList.length * 2) {
		msg.reply('The queue is currently full.');
		return [...playerList];
	}
	return addPlayer(msg.author.id, msg);
}

function leave(msg) {
	msg.reply('Removed you from the queue!');
	return removePlayer(msg.author.id);
}

// abstracting addCaptain will let us use it in other scenarios, esp. automated testing
function addCaptain(captainSnowflake) {
	if (captainList.includes(captainSnowflake)) {
		console.log('Attempted to add captain already in list.');
		return [...captainList];
	}
	return [...captainList, captainSnowflake];
}

function addCaptains(msg) {
	const captains = msg.mentions.users;
	if (captains.size > 0) {
		captains.forEach(function(obj, snowflake) {
			captainList = addCaptain(snowflake);
		});
		const s = [];
		captainList.forEach(function(n) {
			s.push(convertIdToTag(n));
		});
		msg.reply(`The captain list is now: ${concatArray(s)}`);
		return;
	}
	msg.reply(
		'Please mention the users you want to add as captains after the command. Example: ```!addcaptains @user1 @user2```',
	);
}

function removeCaptains(msg) {
	const captains = msg.mentions.users;
	if (captains.size > 0) {
		captains.forEach(function(obj, snowflake) {
			captainList = removeCaptain(snowflake);
		});
		const s = [];
		captainList.forEach(function(n) {
			s.push(convertIdToTag(n));
		});

		if (captainList.length === 0) {
			msg.reply('The captain list is now empty.');
		}
		else {
			msg.reply(`The captain list is now: ${concatArray(s)}`);
		}
		return;
	}

	msg.reply(
		'Please mention the users you want to add as captains after the command. Example: ```!removecaptains @user1 @user2```',
	);
}

// abstracting addCaptain will let us use it in other scenarios, esp. automated testing
function removeCaptain(captainSnowflake) {
	const snowflakeIndex = captainList.indexOf(captainSnowflake);

	if (snowflakeIndex === -1) {
		console.log('Attempted to remove captain not in the list.');
		return [...captainList];
	}

	captainList.splice(snowflakeIndex, 1);
	return [...captainList];
}

// Returns true if the author of the message is privileged
function isAuthorizedMessage(msg) {
	return (
		'member' in msg &&
		(msg.member.hasPermission('ADMINISTRATOR') ||
			msg.member.roles.cache.find((r) => r.name === 'Queue Snipe Admin'))
	);
}

// The following is messy, but we need a mvp, so here we go
// The function to distribute players to captains; recursive, so if it is not out of players, it can keep going
function distributePlayers(msg, captains) {
	captains.forEach(function(v) {
		if (v.length < 2) {
			v.push(
				...playerList.splice(Math.floor(Math.random() * playerList.length)),
			);
		}
	});
	console.log(captains);
	if (playerList.length > 0) {
		distributePlayers(msg, captains);
	}
	else {
		let mstr = '```';
		let i = 1;
		captains.forEach(function(v, k) {
			mstr = mstr + `Team ${i}: ${convertIdToNick(k)}, `;
			console.log(`Made it here with ${mstr}`);
			v.forEach(function(player, i) {
				console.log(`Adding player ${convertIdToNick(player)}`);
				mstr = mstr + `${convertIdToNick(player)}`;
				if (i < v.length - 1) {
					mstr = mstr + ',';
				}
				mstr = mstr + ' ';
			});
			console.log(v);
			mstr = mstr + '\n';
			i++;
		});
		console.log(mstr);
		msg.reply(mstr + '```');
	}
}

function distribute(msg) {
	const captains = new Map();
	captainList.forEach(function(v) {
		captains.set(v, []);
	});
	distributePlayers(msg, captains);
}

// client.on('message', (msg) => {
// 	if (!msg.content.startsWith('!')) return;

// 	const args = msg.content.slice(1).split(/ +/);
// 	const command = args.shift().toLowerCase();

// 	if (command === 'join') {
// 		playerList = join(msg);
// 		console.log(playerList);
// 	}

// 	if (command === 'addcaptains') {
// 		if (!isAuthorizedMessage(msg)) {
// 			return;
// 		}
// 		addCaptains(msg);
// 		console.log(captainList);
// 	}

// 	if (command === 'removecaptains') {
// 		if (!isAuthorizedMessage(msg)) {
// 			return;
// 		}
// 		removeCaptains(msg);
// 		console.log(captainList);
// 	}

// 	if (command === 'ping') {
// 		msg.reply('Pong!');
// 	}

// 	if (command === 'list') {
// 		msg.reply('playerList: ' + playerList.toString() + '\ncaptainList: ' + captainList.toString());
// 	}

// 	if (command === 'distribute') {
// 		if (!isAuthorizedMessage(msg)) {
// 			return;
// 		}
// 		console.log('Distributing players, prepare yourself...');
// 		distribute(msg);
// 	}

// 	if (command === 'reset') {
// 		if (!isAuthorizedMessage(msg)) {
// 			return;
// 		}
// 		playerList = [];
// 		captainList = [];
// 		msg.reply('The player and captain lists have been emptied.');
// 	}

// 	if (command === 'leave') {
// 		playerList = leave(msg);
// 		console.log(playerList);
// 	}
// });
