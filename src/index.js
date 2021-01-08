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

// Returns true if the author of the message is privileged
function isAuthorizedMessage(msg) {
	return (
		'member' in msg &&
		(msg.member.hasPermission('ADMINISTRATOR') ||
			msg.member.roles.cache.find((r) => r.name === 'Queue Snipe Admin'))
	);
}