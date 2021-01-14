const { Command } = require('discord.js-commando');
const queue = require('./../../queue');
const util = require('./../../util');

module.exports = class ListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list',
			aliases: ['list'],
			group: 'admin',
			memberName: 'list',
			description: 'Lists captain and player lists.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		message.say('Captains: ' + queue.mainQueue.getReadableCaptainList() + '\nPlayers: ' + queue.mainQueue.getReadableNonCaptainList());
	}
};
