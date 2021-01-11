const { Command } = require('discord.js-commando');
const queue = require('./../../queue');
const util = require('./../../util');

module.exports = class RemoveCaptainsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removecaptains',
			aliases: ['removecaptain'],
			group: 'admin',
			memberName: 'removecaptains',
			description: 'Removes one or more captains to the captain list.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		try {
			queue.main_queue.removeCaptains(message.mentions.users);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('The captain list is now + ' + queue.main_queue.getReadableCaptainList());
	}
};