const { Command } = require('discord.js-commando');
const util = require('./../../util');

module.exports = class JoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: [],
			group: 'player',
			memberName: 'join',
			description: 'Adds user who sends the command to the playerList',
		});
	}
	run(message) {
		try {
			util.addPlayer(message.author);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('You were added to the queue!');
	}
};
