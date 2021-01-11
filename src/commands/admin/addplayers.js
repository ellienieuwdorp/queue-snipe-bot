const { Command } = require('discord.js-commando');
const util = require('./../../util');

module.exports = class AddPlayersCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'addplayers',
			aliases: ['addplayer'],
			group: 'admin',
			memberName: 'addplayers',
			description: 'Adds one or more players to the player list.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		try {
			util.addPlayers(message.mentions.users);
		}
		catch (error) {
			message.reply(error);
			return;
		}
		message.reply('Players added!');
	}
};
