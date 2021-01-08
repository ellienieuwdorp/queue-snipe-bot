const { Command } = require('discord.js-commando');
const util = require('./../../util');

module.exports = class ResetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reset',
			aliases: [],
			group: 'admin',
			memberName: 'reset',
			description: 'Resets the player and captain lists.',
		});
	}
	run(message) {
		util.resetLists();
		message.reply('Player and captain lists have been reset.');
	}
};
