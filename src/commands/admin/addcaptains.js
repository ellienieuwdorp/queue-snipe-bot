const { Command } = require('discord.js-commando');
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
			util.addCaptains(message.mentions.users);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('The captain list is now: ' + util.getReadableCaptainList() + '');
	}
};
