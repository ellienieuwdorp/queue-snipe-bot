const { Command } = require('discord.js-commando');
const queue = require('./../../queue');
const util = require('./../../util');

module.exports = class AddCaptainsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addcaptains',
			aliases: ['addcaptain'],
			group: 'admin',
			memberName: 'addcaptains',
			description: 'Adds one or more captains to the captain list.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		try {
			queue.mainQueue.addCaptains(message.mentions.users);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('The captain list is now: ' + queue.mainQueue.getReadableCaptainList() + '');
	}
};
