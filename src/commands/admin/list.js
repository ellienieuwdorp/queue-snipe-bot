const { Command } = require('discord.js-commando');
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
	run(message) {
		message.say('Captains: ' + util.getReadableCaptainList() + '\nPlayers: ' + util.getReadablePlayerList());
	}
};
