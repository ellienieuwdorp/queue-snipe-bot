const { Command } = require('discord.js-commando');
const queue = require('./../../queue');
const util = require('./../../util');

module.exports = class RemovePlayersCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removeplayers',
			aliases: ['removeplayer'],
			group: 'admin',
			memberName: 'removeplayers',
			description: 'Removes one or more players from the player list.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		try {
			queue.main_queue.removePlayers(message.mentions.users);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('Players have been removed from the queue!');
	}
};
