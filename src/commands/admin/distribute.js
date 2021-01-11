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
		queue.main_queue.distribute(message);
	}
};
