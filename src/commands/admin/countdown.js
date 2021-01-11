const { Command } = require('discord.js-commando');
const util = require('./../../util');

module.exports = class AddCaptainsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'countdown',
			aliases: ['countdown'],
			group: 'admin',
			memberName: 'countdown',
			description: 'Starts a countdown timer for people to join',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		try {
			message.say('10 seconds to go');
			setTimeout(() => message.say('GO! ' + util.getReadableCaptainList()), 10000);
		}
		catch (error) {
			message.reply(error);
			return;
		}
	}
};
