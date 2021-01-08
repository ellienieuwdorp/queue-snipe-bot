const { Command } = require('discord.js-commando');
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
		util.distribute(message);
	}
};
