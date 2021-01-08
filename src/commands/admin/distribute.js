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
	run(message) {
		util.distribute(message);
	}
};
