const { Command } = require('discord.js-commando');
const queue = require('../../queue');
const util = require('./../../util');

module.exports = class DistributeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'distribute',
			aliases: [],
			group: 'admin',
			memberName: 'distribute',
			description: 'Distributed and prints the teams.',
		});
	}
	hasPermission(message) {
		return util.isAuthorizedMessage(message);
	}
	run(message) {
		const teams = queue.mainQueue.distribute(true);

		let index = 1;
		let response = '';
		for(const team of teams) {
			response = response + 'Team: ' + index + '\n```';
			index++;

			for(const player of team) {
				response = response + util.convertIdToTag(player.getDiscordUser().id) + '\n';
			}

			response = response + '```\n\n';
		}

		message.reply(response);
	}
};
