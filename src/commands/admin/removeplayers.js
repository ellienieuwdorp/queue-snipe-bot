const { Command } = require('discord.js-commando');
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
	run(message) {
		util.removePlayers(message.mentions.users);
		message.reply('Players have been removed from the queue!');
	}
};
