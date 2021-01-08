const { Command } = require('discord.js-commando');
const util = require('./../../util');

module.exports = class RemoveCaptainsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'removecaptains',
			aliases: ['removecaptains'],
			group: 'admin',
			memberName: 'removecaptains',
			description: 'Removes one or more captains to the captain list.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		util.removeCaptains(message.mentions.users);
		message.reply('The captain list is now + ' + util.getReadableCaptainList());
	}
};