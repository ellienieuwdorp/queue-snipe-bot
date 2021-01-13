const { Command } = require('discord.js-commando');
const queue = require('./../../queue');
const util = require('./../../util');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: [],
			group: 'player',
			memberName: 'leave',
			description: 'Removes user who sends the command from the playerList',
		});
	}
	run(message) {
		try {
			queue.mainQueue.removePlayer(message.author);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('You were removed from the queue!');
	}
};
